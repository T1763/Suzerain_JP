// Suzerain 日本語化 — 不備報告の中継（Cloudflare Worker）
// サイトのフォーム（report.html / tester.html）から受け取り、スクリーンショットをリポジトリの
// report-images ブランチに保存して、GitHub Issue を作る。
//
// 変数（Cloudflare の画面の「設定 → 変数とシークレット」）:
//   GITHUB_TOKEN      [シークレット] fine-grained token。対象はこのリポジトリだけ、権限は Contents と Issues の Read and write
//   TURNSTILE_SECRET  [シークレット] Turnstile の secret key
//   REPO              T1763/Suzerain_JP
//   ALLOW_ORIGIN      https://t1763.github.io   （カンマ区切りで複数可）
//   IMG_BRANCH        report-images             （省略可）
//   RATE_PER_HOUR     10                        （省略可。KV の RL を結び付けたときだけ効く）
// KV（任意）: 名前 RL で KV 名前空間を結び付けると、同じ IP からの送信を1時間あたり RATE_PER_HOUR 件に制限する。

const MAX_SHOTS = { report: 3, tester: 10 };
const MAX_BYTES = 5 * 1024 * 1024;
const LIMITS = { story: 40, type: 40, scene: 200, detail: 4000, ja: 2000, en: 2000, note: 4000, steps: 2000, turn: 40, version: 100 };

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOW_ORIGIN || 'https://t1763.github.io').split(',').map((s) => s.trim());
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };
    const reply = (status, obj) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(req.url);
    if (url.pathname !== '/report' || req.method !== 'POST') return reply(404, { ok: false, error: 'not found' });
    if (!allowed.includes(origin)) return reply(403, { ok: false, error: '送信元が違います' });

    try {
      const ip = req.headers.get('CF-Connecting-IP') || '';

      // 回数制限（KV を結び付けたときだけ）
      if (env.RL) {
        const key = `rl:${ip}:${Math.floor(Date.now() / 3600000)}`;
        const n = parseInt((await env.RL.get(key)) || '0', 10);
        if (n >= parseInt(env.RATE_PER_HOUR || '10', 10)) return reply(429, { ok: false, error: '送信が多すぎます。1時間ほどおいてください' });
        await env.RL.put(key, String(n + 1), { expirationTtl: 3700 });
      }

      const fd = await req.formData();

      // ロボット対策（Turnstile）
      if (env.TURNSTILE_SECRET) {
        const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: String(fd.get('turnstile') || ''), remoteip: ip }),
        }).then((r) => r.json());
        if (!v.success) return reply(400, { ok: false, error: 'ロボット対策の確認に失敗しました。ページを読み込み直してください' });
      }

      const mode = fd.get('mode') === 'tester' ? 'tester' : 'report';
      const f = {};
      for (const k of Object.keys(LIMITS)) f[k] = String(fd.get(k) || '').replace(/\r\n?/g, '\n').trim().slice(0, LIMITS[k]);
      if (!f.detail) return reply(400, { ok: false, error: '問題の詳細を書いてください' });

      const files = fd.getAll('shots').filter((x) => typeof x === 'object' && x && 'arrayBuffer' in x);
      if (files.length > MAX_SHOTS[mode]) return reply(400, { ok: false, error: `スクリーンショットは ${MAX_SHOTS[mode]} 枚までです` });
      const images = [];
      for (const file of files) {
        if (file.size > MAX_BYTES) return reply(400, { ok: false, error: '画像が大きすぎます（1枚 5MB まで）' });
        const buf = new Uint8Array(await file.arrayBuffer());
        const ext = sniff(buf);
        if (!ext) return reply(400, { ok: false, error: '画像は PNG・JPEG・WebP にしてください' });
        images.push({ buf, ext });
      }

      const gh = github(env);
      const branch = env.IMG_BRANCH || 'report-images';
      const d = new Date();
      const id = `${d.toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 8)}`;
      const links = [];
      for (let i = 0; i < images.length; i++) {
        const path = `reports/${id}/${i + 1}.${images[i].ext}`;
        await gh.putFile(branch, path, images[i].buf, `report ${id} (${i + 1})`);
        links.push(`https://raw.githubusercontent.com/${env.REPO}/${branch}/${path}`);
      }

      const issue = await gh.createIssue({
        title: `[${shortType(f.type)}] ${oneLine(f.ja || f.detail, 60)}`,
        body: issueBody(mode, f, links, id),
        labels: ['翻訳の不備', shortType(f.type)].concat(mode === 'tester' ? ['tester'] : []),
      });
      return reply(200, { ok: true, number: issue.number, url: issue.html_url });
    } catch (e) {
      console.error(e && e.stack ? e.stack : e);
      return reply(500, { ok: false, error: 'サーバーのエラー' });
    }
  },
};

function sniff(b) {
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp';
  return null;
}

function b64(buf) {
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(s);
}

// 入力をそのまま Markdown に入れると、@ でだれかに通知が飛んだり、画像やリンクを差し込めたりするので無効にする
function safe(s) {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/@/g, '@​')
    .replace(/#(\d)/g, '#​$1')
    .replace(/!\[/g, '!​[')
    .replace(/\]\(/g, ']​(')
    .replace(/https?:\/\//g, (m) => m.replace('://', ':​//'));
}
const quote = (s) => safe(s).split('\n').map((l) => '> ' + l).join('\n');
const oneLine = (s, n) => { const t = s.replace(/\s+/g, ' '); return t.length > n ? t.slice(0, n) + '…' : t; };
const shortType = (t) => (t || 'その他').replace(/（.*）$/, '');

function issueBody(mode, f, links, id) {
  const out = [];
  const row = (k, v) => v && out.push(`**${k}**: ${safe(v)}  `);
  row('物語', f.story);
  row('種類', f.type);
  row('場面', f.scene);
  if (mode === 'tester') { row('版', f.version); row('ターン', f.turn); }
  out.push('', '### 問題の詳細', quote(f.detail));
  if (f.ja) out.push('', '### 画面に出ている文', quote(f.ja));
  if (f.en) out.push('', '### 英語の原文', quote(f.en));
  if (f.steps) out.push('', '### その場面までの流れ', quote(f.steps));
  if (f.note) out.push('', '### 気づいたこと', quote(f.note));
  if (links.length) {
    out.push('', '### スクリーンショット');
    links.forEach((u, i) => out.push(`![スクリーンショット ${i + 1}](${u})`));
  }
  out.push('', '---', `<sub>サイトのフォームから送信（${mode} / ${id}）</sub>`);
  return out.join('\n');
}

function github(env) {
  const api = `https://api.github.com/repos/${env.REPO}`;
  const headers = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'suzerain-jp-report',
  };
  const call = async (method, path, body) => {
    const r = await fetch(api + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    return { status: r.status, ok: r.ok, j };
  };
  let branchReady = false;
  async function ensureBranch(branch) {
    const has = await call('GET', `/git/ref/heads/${branch}`);
    if (has.ok) return;
    const repo = await call('GET', '');
    const base = await call('GET', `/git/ref/heads/${repo.j.default_branch}`);
    const made = await call('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: base.j.object.sha });
    if (!made.ok && made.status !== 422) throw new Error(`create branch: ${made.status} ${JSON.stringify(made.j)}`);
  }
  return {
    async putFile(branch, path, buf, message) {
      if (!branchReady) { await ensureBranch(branch); branchReady = true; }
      const r = await call('PUT', `/contents/${path}`, { message, content: b64(buf), branch });
      if (!r.ok) throw new Error(`put ${path}: ${r.status} ${JSON.stringify(r.j)}`);
    },
    async createIssue(issue) {
      let r = await call('POST', '/issues', issue);
      if (r.status === 422) {                      // ラベルで弾かれたときはラベル無しで作り直す
        const { labels, ...rest } = issue;
        r = await call('POST', '/issues', rest);
      }
      if (!r.ok) throw new Error(`issue: ${r.status} ${JSON.stringify(r.j)}`);
      return r.j;
    },
  };
}
