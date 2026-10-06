/* ============================================================
   Faculty profile — interactions, rendering, and live sync

   The page paints instantly from the local snapshot in data.js,
   then asks OpenAlex for anything published since. Everything on
   screen is derived from one array, so a new paper flows through
   the stats, chart, themes, co-authors, and list automatically.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function normTitle(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /* Working set — starts as the snapshot, grows when sync finds new work. */
  var pubs = PUBS.slice();
  var SCHOLAR_USER = PubFilter.SCHOLAR_USER;

  // ==========================================================
  //  Static UI — theme and tabs
  // ==========================================================
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }

  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));

  var themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  var tabs = $$('[role="tab"]');
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

  function select(tab, focus) {
    tabs.forEach(function (t, i) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) { tab.focus(); }
    if (history.replaceState) {
      history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    }
  }

  function selectById(id) {
    var t = tabs.filter(function (x) { return x.getAttribute('aria-controls') === id; })[0];
    if (t) { select(t, false); }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { select(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(tab);
      var next =
        e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] :
        e.key === 'ArrowLeft'  ? tabs[(i - 1 + tabs.length) % tabs.length] :
        e.key === 'Home'       ? tabs[0] :
        e.key === 'End'        ? tabs[tabs.length - 1] : null;
      if (next) { e.preventDefault(); select(next, true); }
    });
  });

  // ==========================================================
  //  Derived data — recomputed from `pubs` on every change
  // ==========================================================
  var THEMES = [
    { label: 'Modular equations',            re: /modular (equation|relation)/i },
    { label: 'Theta functions',              re: /theta/i },
    { label: 'Continued fractions',          re: /continued fraction/i },
    { label: 'Hypergeometric series',        re: /hypergeometric/i },
    { label: 'Eisenstein series',            re: /eisenstein/i },
    { label: 'Elliptic integrals & 1/π',     re: /elliptic|1\/π/i },
    { label: 'Partitions & quadratic forms', re: /partition|quadratic form|convolution sum|triangular|divisor/i },
    { label: 'Class invariants',             re: /class invariant|singular modul/i }
  ];

  var d = {};

  function authorsOf(p) {
    return p.a.split(/,\s*/).filter(function (n) { return n && !/vasuki/i.test(n); });
  }

  function venueName(v) {
    if (!v) { return ''; }
    if (/arxiv/i.test(v)) { return 'arXiv preprint'; }
    var stripped = v
      .replace(/\s*\d+\(.*$/, '')
      .replace(/\s*\d+\s*[,–—-].*$/, '')
      .replace(/,\s*\d.*$/, '')
      .replace(/\s+\d+$/, '')
      .replace(/[,\s]+$/, '')
      .trim();
    return (typeof VENUE_ALIASES !== 'undefined' && VENUE_ALIASES[stripped]) || stripped;
  }

  function derive() {
    var years = pubs.map(function (p) { return p.y; });
    d.minYear = Math.min.apply(null, years);
    d.maxYear = Math.max.apply(null, years);
    d.totalCites = pubs.reduce(function (n, p) { return n + (p.c || 0); }, 0);

    var coMap = {};
    pubs.forEach(function (p) {
      authorsOf(p).forEach(function (n) { coMap[n] = (coMap[n] || 0) + 1; });
    });
    d.coauthors = Object.keys(coMap).map(function (n) { return { name: n, n: coMap[n] }; })
      .sort(function (a, b) { return b.n - a.n || a.name.localeCompare(b.name); });

    var vMap = {};
    pubs.forEach(function (p) {
      var v = venueName(p.v);
      if (v) { vMap[v] = (vMap[v] || 0) + 1; }
    });
    d.venues = Object.keys(vMap).map(function (v) { return { name: v, n: vMap[v] }; })
      .filter(function (v) { return v.n > 1; })
      .sort(function (a, b) { return b.n - a.n || a.name.localeCompare(b.name); })
      .slice(0, 7);

    d.themes = THEMES.map(function (t) {
      return { label: t.label, re: t.re, n: pubs.filter(function (p) { return t.re.test(p.t); }).length };
    }).filter(function (t) { return t.n > 0; })
      .sort(function (a, b) { return b.n - a.n; });

    d.byYear = {};
    pubs.forEach(function (p) { d.byYear[p.y] = (d.byYear[p.y] || 0) + 1; });
  }

  // ==========================================================
  //  Avatars — real photo if a file exists, monogram otherwise
  // ==========================================================
  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function initials(name) {
    var parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) { return parts[0].charAt(0).toUpperCase(); }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function hue(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) { h = (h * 31 + name.charCodeAt(i)) % 360; }
    return h;
  }

  // ==========================================================
  //  Rendering
  // ==========================================================
  function renderSidebar() {
    $('#metrics').innerHTML = PROFILE.metrics.map(function (m) {
      return '<li><span class="metrics__label">' + esc(m.label) + '</span>' +
             '<span class="metrics__all">' + m.all + '</span>' +
             '<span class="metrics__recent">' + m.recent + ' since 2021</span></li>';
    }).join('');

    $('#venues').innerHTML = d.venues.map(function (v) {
      return '<li><a href="#panel-pubs" data-venue="' + esc(v.name) + '">' +
             esc(v.name) + ' <span class="pill">' + v.n + '</span></a></li>';
    }).join('');
  }

  function renderOverview() {
    $('#ov-span').textContent = d.minYear + '–' + d.maxYear;
    $('#ov-count').textContent = pubs.length;

    var mostCited = pubs.slice().sort(function (a, b) { return (b.c || 0) - (a.c || 0); })[0];
    var stats = [
      { k: pubs.length,                 v: 'indexed works' },
      { k: d.maxYear - d.minYear + 1,   v: 'years of publication' },
      { k: d.coauthors.length,          v: 'distinct co-authors' },
      { k: d.totalCites,                v: 'citations across listed works' },
      { k: mostCited.c || 0,            v: 'citations · most-cited paper' },
      { k: pubs.filter(function (p) { return p.y >= 2021; }).length, v: 'works since 2021' }
    ];
    $('#stats').innerHTML = stats.map(function (s) {
      return '<li><strong>' + s.k + '</strong><span>' + esc(s.v) + '</span></li>';
    }).join('');

    var peak = Math.max.apply(null, Object.keys(d.byYear).map(function (y) { return d.byYear[y]; }));
    var bars = '';

    for (var y = d.minYear; y <= d.maxYear; y++) {
      var n = d.byYear[y] || 0;

      // Bars top out at 85% of the track, leaving room for the count above
      // them. Scaling to 100% pushed the tallest bars and their labels out
      // of the plot, where the scroll container clipped them.
      var h = n ? Math.max(7, Math.round((n / peak) * 85)) : 0;

      // Label every fifth year, plus the final year when it is far enough
      // from the previous mark not to collide with it.
      var mark = (y % 5 === 0) || (y === d.maxYear && (d.maxYear % 5) > 2);

      bars += '<div class="chart__col" title="' + y + ': ' + n + (n === 1 ? ' publication' : ' publications') + '">' +
                '<span class="chart__track">' +
                  (n ? '<b class="chart__n">' + n + '</b>' : '') +
                  '<span class="chart__bar' + (n ? '' : ' is-empty') + '"' +
                    (n ? ' style="height:' + h + '%"' : '') + '></span>' +
                '</span>' +
                '<span class="chart__label">' + (mark ? y : '') + '</span>' +
              '</div>';
    }

    var plot = $('#chart .chart__plot');
    if (plot) { plot.parentNode.removeChild(plot); }
    $('#chart').insertAdjacentHTML('beforeend', '<div class="chart__plot">' + bars + '</div>');
  }

  function renderThemes() {
    $('#themes').innerHTML = d.themes.map(function (t, i) {
      return '<li><button type="button" data-theme-idx="' + i + '">' +
             esc(t.label) + ' <span class="pill">' + t.n + '</span></button></li>';
    }).join('');
  }

  function renderEducation() {
    var el = $('#education');
    if (!el) { return; }
    el.innerHTML = EDUCATION.map(function (e) {
      return '<li>' +
               '<span class="edu__year">' + esc(e.year) + '</span>' +
               '<span class="edu__body">' +
                 '<strong>' + esc(e.degree) + '</strong>' +
                 '<span class="edu__place">' + esc(e.place) + '</span>' +
                 (e.detail ? '<span class="edu__detail">' + esc(e.detail) + '</span>' : '') +
               '</span>' +
             '</li>';
    }).join('');
  }

  function renderGuide() {
    var el = $('#guide');
    if (!el || typeof GUIDE === 'undefined') { return; }
    var plainName = GUIDE.name.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '');
    var h = hue(plainName);
    var nameHtml = GUIDE.scholar
      ? '<a href="' + esc(GUIDE.scholar) + '" target="_blank" rel="noopener">' + esc(GUIDE.name) +
        ' <span aria-hidden="true">↗</span></a>'
      : esc(GUIDE.name);
    el.innerHTML =
      '<span class="avatar avatar--lg" style="--h:' + h + '">' +
        '<span class="avatar__mono">' + esc(initials(plainName)) + '</span>' +
        (GUIDE.photo ? '<img src="' + esc(GUIDE.photo) + '" alt="" loading="lazy">' : '') +
      '</span>' +
      '<span class="guide__body">' +
        '<span class="guide__name">' + nameHtml + '</span>' +
        '<span class="guide__role">' + esc(GUIDE.role) + '</span>' +
        '<p class="guide__bio">' + esc(GUIDE.bio) + '</p>' +
      '</span>';

    var img = el.querySelector('.avatar img');
    if (img) {
      img.addEventListener('error', function () {
        if (img.parentNode) { img.parentNode.removeChild(img); }
      });
    }
  }

  function renderStudents() {
    var phdEl = $('#phdStudents');
    var scholarEl = $('#researchScholars');
    if (phdEl && typeof PHD_STUDENTS !== 'undefined') {
      var rows = PHD_STUDENTS.slice().sort(function (a, b) { return a.year - b.year; });
      phdEl.innerHTML = rows.map(function (s) {
        return '<li>' +
                 '<span class="students__main">' +
                   '<span class="students__name">' + esc(s.name) + '</span>' +
                   (s.role ? '<span class="students__role">' + esc(s.role) + '</span>' : '') +
                 '</span>' +
                 '<span class="badge">' + s.year + '</span>' +
               '</li>';
      }).join('');
      var countEl = $('#phdCount');
      if (countEl) { countEl.textContent = PHD_STUDENTS.length; }
    }
    if (scholarEl && typeof RESEARCH_SCHOLARS !== 'undefined') {
      scholarEl.innerHTML = RESEARCH_SCHOLARS.map(function (s) {
        return '<li>' +
                 '<span class="students__main">' +
                   '<span class="students__name">' + esc(s.name) + '</span>' +
                   (s.role ? '<span class="students__role">' + esc(s.role) + '</span>' : '') +
                 '</span>' +
               '</li>';
      }).join('');
      var sCountEl = $('#scholarCount');
      if (sCountEl) { sCountEl.textContent = RESEARCH_SCHOLARS.length; }
    }
  }

  function renderGallery() {
    var el = $('#gallery');
    if (!el || typeof GALLERY === 'undefined') { return; }
    el.innerHTML = GALLERY.map(function (g) {
      var h = hue(g.caption);
      return '<li>' +
               '<span class="gallery__thumb is-placeholder" style="--h:' + h + '">' +
                 '<img src="assets/gallery/' + esc(g.file) + '" alt="" loading="lazy">' +
               '</span>' +
               '<span class="gallery__cap">' + esc(g.caption) + '</span>' +
             '</li>';
    }).join('');

    $$('#gallery .gallery__thumb img').forEach(function (img) {
      var thumb = img.closest('.gallery__thumb');
      img.addEventListener('load', function () {
        thumb.classList.remove('is-placeholder');
      });
      img.addEventListener('error', function () {
        if (img.parentNode) { img.parentNode.removeChild(img); }
      });
    });
  }

  /* Title links to the publisher (DOI) when known, else the Scholar record.
     The citation badge always points at Scholar, where the count lives. */
  function pubUrl(p) {
    return p.doi ? p.doi : scholarUrl(p);
  }

  function scholarUrl(p) {
    return p.id
      ? 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=' +
        SCHOLAR_USER + '&citation_for_view=' + encodeURIComponent(p.id)
      : 'https://scholar.google.com/scholar?q=' + encodeURIComponent(p.t);
  }

  function markVasuki(a) {
    return esc(a).replace(/(KR Vasuki)/gi, '<strong>$1</strong>');
  }

  var state = { q: '', sort: 'year', theme: null, author: null, venue: null };

  var listEl   = $('#pubs');
  var countEl  = $('#count');
  var emptyEl  = $('#empty');
  var clearBtn = $('#clearFilters');
  var qInput   = $('#q');
  var sortSel  = $('#sort');

  function matches(p) {
    if (state.theme !== null && d.themes[state.theme] && !d.themes[state.theme].re.test(p.t)) { return false; }
    if (state.author && p.a.split(/,\s*/).indexOf(state.author) === -1) { return false; }
    if (state.venue && venueName(p.v) !== state.venue) { return false; }
    if (state.q) {
      var hay = (p.t + ' ' + p.a + ' ' + p.v + ' ' + p.y).toLowerCase();
      if (state.q.split(/\s+/).some(function (w) { return hay.indexOf(w) === -1; })) { return false; }
    }
    return true;
  }

  function renderList() {
    var rows = pubs.filter(matches);

    rows.sort(function (a, b) {
      if (state.sort === 'cites') { return (b.c || 0) - (a.c || 0) || b.y - a.y; }
      if (state.sort === 'year-asc') { return a.y - b.y; }
      return b.y - a.y;
    });

    listEl.innerHTML = rows.map(function (p) {
      return '<li' + (p.isNew ? ' class="is-new"' : '') + '>' +
        '<p class="pubs__title"><a href="' + esc(pubUrl(p)) + '" target="_blank" rel="noopener">' +
          esc(p.t) + '<span class="pubs__ext" aria-hidden="true">↗</span></a></p>' +
        '<p class="pubs__meta">' + markVasuki(p.a) + (p.v ? ' &middot; <em>' + esc(p.v) + '</em>' : '') + '</p>' +
        '<p class="pubs__badges"><span class="badge">' + p.y + '</span>' +
        (p.c
          ? '<a class="badge badge--cite" href="' + esc(scholarUrl(p)) + '" target="_blank" rel="noopener" ' +
            'title="View citations on Google Scholar">' + p.c +
            (p.c === 1 ? ' citation' : ' citations') + ' ↗</a>'
          : '<span class="badge">not yet cited</span>') +
        (p.isNew ? '<span class="badge badge--new">new</span>' : '') +
        '</p></li>';
    }).join('');

    var active = [];
    if (state.theme !== null && d.themes[state.theme]) { active.push('theme: ' + d.themes[state.theme].label); }
    if (state.author) { active.push('co-author: ' + state.author); }
    if (state.venue)  { active.push('venue: ' + state.venue); }
    if (state.q)      { active.push('“' + state.q + '”'); }

    countEl.textContent = rows.length + (rows.length === 1 ? ' publication' : ' publications') +
      (active.length ? ' · ' + active.join(' · ') : '');

    clearBtn.hidden = !active.length;
    emptyEl.hidden = rows.length !== 0;
  }

  function renderAll() {
    derive();
    renderSidebar();
    renderOverview();
    renderEducation();
    renderGuide();
    renderThemes();
    renderStudents();
    renderGallery();
    renderList();
  }

  // ==========================================================
  //  Filter wiring
  // ==========================================================
  qInput.addEventListener('input', function () {
    state.q = qInput.value.trim().toLowerCase();
    renderList();
  });

  sortSel.addEventListener('change', function () {
    state.sort = sortSel.value;
    renderList();
  });

  clearBtn.addEventListener('click', function () {
    state = { q: '', sort: state.sort, theme: null, author: null, venue: null };
    qInput.value = '';
    renderList();
  });

  $('#themes').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-idx]');
    if (!btn) { return; }
    state.theme = Number(btn.dataset.themeIdx);
    state.author = null; state.venue = null;
    selectById('panel-pubs');
    renderList();
  });

  $('#venues').addEventListener('click', function (e) {
    var a = e.target.closest('[data-venue]');
    if (!a) { return; }
    e.preventDefault();
    state.venue = a.dataset.venue;
    state.theme = null; state.author = null;
    selectById('panel-pubs');
    renderList();
    $('#panel-pubs').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ==========================================================
  //  Live sync — OpenAlex
  //  Free, no key, CORS-enabled. Google Scholar has no API and
  //  blocks browser requests, so OpenAlex is the live source.
  //
  //  Whatever the sync finds is stored in localStorage and merged
  //  back in before the next first paint, so a paper only has to be
  //  discovered once. Nothing to download, nothing to redeploy.
  // ==========================================================
  var OA_URL = PubFilter.apiUrl();
  var CACHE_KEY = 'oa-works-v3';
  var FRESH = 6 * 60 * 60 * 1000;   // re-check in the background after 6h
  var THIS_YEAR = new Date().getFullYear();

  var syncEl = $('#sync');
  var cacheAge = null;
  var REFRESH_BTN = ' <button type="button" class="sync__btn" data-refresh>Refresh</button>';

  function setSync(cls, html) {
    if (!syncEl) { return; }
    syncEl.className = 'sync sync--' + cls;
    syncEl.innerHTML = html;
  }

  function readCache() {
    try {
      var box = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (!box || !box.works) { return null; }
      cacheAge = Date.now() - (box.at || 0);
      return box.works;
    } catch (e) { return null; }
  }

  function writeCache(works) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), works: works })); }
    catch (e) { /* quota or blocked — the page still works, just re-fetches */ }
  }

  /* Fold a result set into `pubs`. Only genuinely recent work carries the
     "new" flag, so the badge retires itself instead of accumulating. */
  function absorb(works) {
    var res = PubFilter.merge(works, pubs);

    res.added.forEach(function (p) {
      if (p.y >= THIS_YEAR - 1) { p.isNew = true; }
    });

    if (res.skipped && window.console) {
      // Filtered as another author's work, a deposit copy, or a translation.
      console.info('[sync] ' + res.skipped + ' off-profile record(s) filtered');
    }
    return res;
  }

  function ago(ms) {
    if (ms === null || ms === undefined) { return 'just now'; }
    var mins = Math.round(ms / 60000);
    if (mins < 1) { return 'just now'; }
    if (mins < 60) { return mins + (mins === 1 ? ' minute ago' : ' minutes ago'); }
    var hrs = Math.round(mins / 60);
    if (hrs < 24) { return hrs + (hrs === 1 ? ' hour ago' : ' hours ago'); }
    var days = Math.round(hrs / 24);
    return days + (days === 1 ? ' day ago' : ' days ago');
  }

  function report(count, when) {
    if (count) {
      setSync('new', '<strong>' + count + (count === 1 ? ' paper' : ' papers') +
        '</strong> added from OpenAlex since the saved snapshot &middot; checked ' + when + REFRESH_BTN);
    } else {
      setSync('ok', 'Up to date with OpenAlex &middot; checked ' + when + REFRESH_BTN);
    }
  }

  function fetchNow() {
    setSync('busy', '<span class="sync__dot"></span>Checking OpenAlex for new work…');

    return fetch(OA_URL, { headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        return r.json();
      })
      .then(function (json) {
        var works = json.results || [];
        writeCache(works);
        cacheAge = 0;

        var res = absorb(works);
        if (res.added.length || res.linked) { renderAll(); }
        report(pubs.length - PUBS.length, 'just now');
      })
      .catch(function () {
        setSync('off', 'Showing the saved list — OpenAlex could not be reached. ' +
          '<button type="button" class="sync__btn" data-refresh>Try again</button>');
      });
  }

  /* Seed from whatever this browser already knows, before the first paint,
     so previously discovered papers are on screen immediately. */
  var seeded = readCache();
  if (seeded) { absorb(seeded); }

  renderAll();

  var hash = window.location.hash.replace('#', '');
  if (hash) { selectById(hash); }

  if (syncEl && window.fetch) {
    syncEl.addEventListener('click', function (e) {
      if (e.target.closest('[data-refresh]')) { fetchNow(); }
    });

    if (!seeded || cacheAge > FRESH) {
      fetchNow();
    } else {
      report(pubs.length - PUBS.length, ago(cacheAge));
    }
  }

  // ==========================================================
  //  Odds and ends
  // ==========================================================
  var toast = $('#toast');
  var toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  var copyBtn = $('#copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.dataset.copy;
      var done = function () {
        showToast('Email address copied');
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { showToast(text); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { showToast(text); }
        document.body.removeChild(ta);
      }
    });
  }

  // ==========================================================
  //  Visitor counter
  //  hits.sh is an SVG hit-counter badge: the browser just requests an
  //  <img>, the service increments its own count and returns a picture of
  //  the number — no fetch(), no JSON, no CORS involved, since images
  //  aren't subject to cross-origin restrictions the way XHR/fetch are.
  //  Its key has to look like an actual "domain/path" (that's what every
  //  documented example uses, e.g. hits.sh/github.com/user/repo.svg) — a
  //  bare domain fails its own URL check and it renders "Invalid URL"
  //  right into the badge image instead of a count. Note that this is a
  //  case the load/error listeners below can't catch on their own: the
  //  request still succeeds and returns a valid image, just with the
  //  wrong text baked into it, so the fallback chain doesn't trigger for
  //  it — the fix has to be getting the key format right up front.
  //  A second, independent service (visitor-badge) is still tried if the
  //  first one ever fails outright (blocked by an ad-blocker, or down);
  //  only if every source fails does the block stay hidden, rather than
  //  showing a broken-image icon.
  // ==========================================================
  (function initVisitCounter() {
    var wrap = $('#visitCounter');
    var img = $('#visitBadge');
    if (!wrap || !img) { return; }

    var host = (window.location.hostname || 'local-preview.example').replace(/^www\./, '');
    if (!host || host.indexOf('.') === -1) { host = 'local-preview.example'; }
    var key = host + '/visits';

    var sources = [
      'https://hits.sh/' + key + '.svg?label=page+views&color=b5651d&labelColor=2f3a4c',
      'https://visitor-badge.laobi.icu/badge?page_id=' + encodeURIComponent(key) + '&left_text=page+views'
    ];
    var i = 0;

    function tryNext() {
      if (i >= sources.length) { wrap.hidden = true; return; }
      img.src = sources[i++];
    }

    img.addEventListener('load', function () { wrap.hidden = false; });
    img.addEventListener('error', tryNext);
    tryNext();
  })();

  var masthead = $('#masthead');
  var toTop = $('#toTop');

  function onScroll() {
    masthead.classList.toggle('is-stuck', window.scrollY > 8);
    toTop.classList.toggle('is-visible', window.scrollY > 500);
  }

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) { return; }
        setTimeout(function () { entry.target.classList.add('is-in'); }, i * 70);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
