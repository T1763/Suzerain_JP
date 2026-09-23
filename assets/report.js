// 不備の報告フォーム（report.html / tester.html 共通）。送信先は config.js の relay（Cloudflare Worker）
(function () {
  var cfg = window.SJP || {};
  var form = document.getElementById('report-form');
  var mode = form.getAttribute('data-mode') || 'report';        // report | tester
  var MAX_SHOTS = mode === 'tester' ? 10 : 3;
  var MAX_BYTES = 5 * 1024 * 1024;
  var OK_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
  var ISSUE_FORM = 'https://github.com/' + cfg.repo + '/issues/new?template=translation.yml';

  var shots = [];                                    // {blob, url, name}
  var list = document.getElementById('shots');
  var drop = document.getElementById('drop');
  var fileInput = document.getElementById('shot-input');
  var status = document.getElementById('status');
  var submit = document.getElementById('submit');
  var tsBox = document.getElementById('ts');
  var tsWidget = null;

  document.getElementById('max-shots').textContent = MAX_SHOTS;

  // 中継が未設定のときは送信できないので GitHub の Issue フォームへ案内する
  var offline = document.getElementById('offline');
  if (!cfg.relay) {
    offline.classList.remove('hidden');
    submit.disabled = true;
  }
  document.querySelectorAll('a[data-issue-form]').forEach(function (a) { a.href = ISSUE_FORM; });

  // 版の欄（テスター用）に最新 Release の名前を入れておく
  var ver = document.getElementById('f-version');
  if (ver && cfg.latestRelease) {
    cfg.latestRelease().then(function (rel) {
      if (rel && !ver.value) ver.value = rel.name || rel.tag_name;
    });
  }

  // Turnstile（ロボット対策）
  if (cfg.relay && cfg.turnstileSiteKey) {
    window.onTurnstileLoad = function () {
      tsWidget = window.turnstile.render(tsBox, { sitekey: cfg.turnstileSiteKey, language: 'ja' });
    };
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
    s.async = true;
    document.head.appendChild(s);
  }

  function setStatus(text, cls) {
    status.textContent = text;
    status.className = 'status' + (cls ? ' ' + cls : '');
  }

  // 大きすぎる・形式が違う画像は JPEG に描き直す
  function normalize(file) {
    if (OK_TYPES.indexOf(file.type) >= 0 && file.size <= MAX_BYTES) return Promise.resolve(file);
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var scale = Math.min(1, 2560 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b && b.size <= MAX_BYTES ? resolve(b) : reject(); }, 'image/jpeg', 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(); };
      img.src = url;
    });
  }

  var pending = 0;                                   // 描き直し中の枚数（上限の判定に含める）
  function addFiles(files) {
    Array.prototype.forEach.call(files, function (f) {
      if (!/^image\//.test(f.type)) return;
      if (shots.length + pending >= MAX_SHOTS) { setStatus('スクリーンショットは ' + MAX_SHOTS + ' 枚までです。', 'err'); return; }
      pending++;
      normalize(f).then(function (blob) {
        shots.push({ blob: blob, url: URL.createObjectURL(blob), name: f.name || 'screenshot' });
        render();
      }, function () { setStatus('この画像は読み込めませんでした: ' + (f.name || ''), 'err'); })
        .then(function () { pending--; });
    });
  }

  function render() {
    list.textContent = '';
    shots.forEach(function (s, i) {
      var d = document.createElement('div'); d.className = 'shot';
      var img = document.createElement('img'); img.src = s.url; img.alt = 'スクリーンショット ' + (i + 1);
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '×';
      x.setAttribute('aria-label', (i + 1) + '枚目を外す');
      x.addEventListener('click', function () { URL.revokeObjectURL(s.url); shots.splice(i, 1); render(); });
      var cap = document.createElement('span'); cap.textContent = Math.round(s.blob.size / 1024) + ' KB';
      d.appendChild(img); d.appendChild(x); d.appendChild(cap); list.appendChild(d);
    });
  }

  fileInput.addEventListener('change', function () { addFiles(fileInput.files); fileInput.value = ''; });
  document.addEventListener('paste', function (e) {
    var items = (e.clipboardData && e.clipboardData.files) || [];
    if (items.length) { addFiles(items); e.preventDefault(); }
  });
  ['dragenter', 'dragover'].forEach(function (t) {
    drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(function (t) {
    drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('over'); });
  });
  drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!cfg.relay) return;
    if (!form.reportValidity()) return;
    var fd = new FormData(form);
    fd.append('mode', mode);
    shots.forEach(function (s, i) { fd.append('shots', s.blob, 'shot' + (i + 1)); });
    if (tsWidget !== null) fd.append('turnstile', window.turnstile.getResponse(tsWidget) || '');

    submit.disabled = true;
    setStatus('送信しています…');
    fetch(cfg.relay, { method: 'POST', body: fd })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'HTTP ' + r.status }; }); })
      .then(function (res) {
        if (res.ok) {
          status.textContent = '';
          status.className = 'status ok';
          status.appendChild(document.createTextNode('送信しました。ありがとうございます。 '));
          var a = document.createElement('a'); a.href = res.url; a.textContent = '報告 #' + res.number + ' を見る';
          a.target = '_blank'; a.rel = 'noopener';
          status.appendChild(a);
          form.reset();
          shots.forEach(function (s) { URL.revokeObjectURL(s.url); });
          shots = []; render();
        } else {
          setStatus('送信できませんでした（' + (res.error || '不明なエラー') + '）。時間をおいてもう一度お試しください。', 'err');
        }
      })
      .catch(function () { setStatus('送信できませんでした。通信状態を確かめて、もう一度お試しください。', 'err'); })
      .then(function () {
        submit.disabled = false;
        if (tsWidget !== null) window.turnstile.reset(tsWidget);
      });
  });
})();
