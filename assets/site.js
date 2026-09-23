// 共通: GitHub の最新 Release を読んで表示する（配布物の中身は固定で書かない）
// releases/latest はプレリリースを数えないので、一覧から下書き以外の一番新しいものを採る（2026-09-23）
(function () {
  var cfg = window.SJP || {};
  var API = 'https://api.github.com/repos/' + cfg.repo + '/releases?per_page=20';

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
        .then(function (list) {
          var rels = (list || []).filter(function (x) { return !x.draft; });
          rels.sort(function (a, b) { return new Date(b.published_at) - new Date(a.published_at); });
          return rels[0] || null;
        })
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
      if (rel.prerelease) { var t = el('span', 'プレリリース（試験版）'); t.className = 'tag'; h.appendChild(t); }
      h.appendChild(el('span', '　' + fmtDate(rel.published_at) + ' 公開'));
      h.className = 'meta';
      box.appendChild(h);
      var assets = (rel.assets || []);
      // ボタンはこの版を指す（ZIP が1つならそのファイル、それ以外は版のページ）
      var btn = document.getElementById('download-btn');
      if (btn) {
        var zips = assets.filter(function (a) { return /\.zip$/i.test(a.name); });
        btn.href = zips.length === 1 ? zips[0].browser_download_url : rel.html_url;
      }
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
