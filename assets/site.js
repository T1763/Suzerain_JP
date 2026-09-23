// 共通: GitHub の最新 Release を読んで表示する（配布物の中身は固定で書かない）
(function () {
  var cfg = window.SJP || {};
  var API = 'https://api.github.com/repos/' + cfg.repo + '/releases/latest';

  function fmtSize(n) {
    if (n >= 1048576) return (n / 1048576).toFixed(1) + ' MB';
    if (n >= 1024) return Math.round(n / 1024) + ' KB';
    return n + ' B';
  }
  function fmtDate(s) {
    var d = new Date(s);
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }
  function el(tag, text) { var e = document.createElement(tag); if (text != null) e.textContent = text; return e; }

  var cache = null;
  window.SJP.latestRelease = function () {
    if (!cache) {
      cache = fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    }
    return cache;
  };

  document.addEventListener('DOMContentLoaded', function () {
    var box = document.getElementById('release');
    if (!box) return;
    window.SJP.latestRelease().then(function (rel) {
      box.textContent = '';
      if (!rel) {
        box.appendChild(el('p', '公開の準備中です。公開されると、ここに最新版のファイルが表示されます。'));
        return;
      }
      var h = el('p');
      var b = el('strong', rel.name || rel.tag_name);
      h.appendChild(b);
      h.appendChild(el('span', '　' + fmtDate(rel.published_at) + ' 公開'));
      h.className = 'meta';
      box.appendChild(h);
      var assets = (rel.assets || []);
      if (assets.length) {
        var ul = el('ul');
        assets.forEach(function (a) {
          var li = el('li');
          var link = el('a', a.name);
          link.href = a.browser_download_url;
          li.appendChild(link);
          li.appendChild(el('span', '（' + fmtSize(a.size) + '）'));
          ul.appendChild(li);
        });
        box.appendChild(ul);
      }
    });
  });
})();
