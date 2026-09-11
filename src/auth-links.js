// ── Authenticated state preservation for docs.html links ──
// Loaded on inner/authenticated pages and dual-mode pages (pricing, terms,
// privacy). When the page is in authenticated mode (mode=app / auth=true|1,
// or an inner app page), every <a> targeting docs.html is rewritten to
// docs.html?mode=app so navigating to Documentation keeps the authenticated
// layout instead of slipping back to the public/guest state.
(function () {
  'use strict';

  // Fully authenticated inner pages — app state is implicit (no URL param).
  var AUTH_PAGES = [
    'dashboard.html',
    'saas_dashboard.html',
    'instances.html',
    'instance-wizard.html',
    'metrics.html',
    'settings.html',
    'system_logs.html',
    'api_keys.html',
    'support.html',
    'checkout.html'
  ];

  function isAuthed() {
    var p = new URLSearchParams(window.location.search);
    return p.get('mode') === 'app' || p.get('auth') === 'true' || p.get('auth') === '1';
  }

  var current = window.location.pathname.split('/').pop();
  if (!isAuthed() && AUTH_PAGES.indexOf(current) === -1) return;

  function appendMode(href) {
    var idx = href.indexOf('docs.html');
    if (idx === -1) return href;
    // Boundary check: 'docs.html' must be its own filename — the character
    // before must be a path separator/'.' and what follows must be a query
    // string or fragment (or nothing), so 'documentations.html' is untouched.
    if (idx > 0) {
      var prev = href.charAt(idx - 1);
      if (prev !== '/' && prev !== '.') return href;
    }
    var after = href.slice(idx + 'docs.html'.length);
    if (after && after.charAt(0) !== '?' && after.charAt(0) !== '#') return href;
    if (/[?&]mode=app/.test(after)) return href;

    var hashIdx = after.indexOf('#');
    var hash = hashIdx >= 0 ? after.slice(hashIdx) : '';
    var query = hashIdx >= 0 ? after.slice(0, hashIdx) : after;
    var sep = query.indexOf('?') === -1 ? '?' : '&';
    return href.slice(0, idx + 'docs.html'.length) + query + sep + 'mode=app' + hash;
  }

  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var updated = appendMode(href);
    if (updated !== href) a.setAttribute('href', updated);
  });
})();