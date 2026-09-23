// サイトの設定（ここだけ書き換える）
window.SJP = {
  repo: 'T1763/Suzerain_JP',
  // 報告の中継（Cloudflare Worker）の URL。例: 'https://suzerain-jp-report.<名前>.workers.dev/report'
  // 空のあいだは報告フォームを「準備中」にして GitHub の Issue フォームへ案内する
  relay: 'https://suzerain-jp-report.toshi1763320.workers.dev/report',
  // Cloudflare Turnstile の site key（公開してよい方）
  turnstileSiteKey: '0x4AAAAAAFAmZyYgY9FaeJtd'
};
