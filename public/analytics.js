/*
 * Usage analytics (PostHog) for exploreriemann.com: which pages and views
 * people open. Cookieless: nothing is stored in the visitor's browser, no
 * session recording, no cross-site identity. Requests go to this site's own
 * /ph path, which vercel.json forwards to PostHog (US).
 *
 * Runs on the production host only, so previews and local copies send nothing.
 * The project key below is public by design.
 */
(function () {
  'use strict';
  var KEY = 'phc_oY3eWn3mhNGrExSFSDaiBkfVsfUsMk7hqkyBQjmvRmnT';
  if (!/^(www\.)?exploreriemann\.com$/.test(location.hostname)) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;

  // One "page" is a path plus, in the research app, its hash route. The
  // Observatory rewrites its query string as the view changes; that is not a
  // new page.
  function pageKey() {
    var route = location.hash.indexOf('#/') === 0 ? location.hash.split('?')[0] : '';
    return location.pathname + route;
  }
  function mode() { return location.pathname.indexOf('/observatory') === 0 ? 'observatory' : 'research'; }

  var script = document.createElement('script');
  script.src = '/ph/static/array.js';
  script.async = true;
  script.onload = function () {
    var posthog = window.posthog;
    if (!posthog || typeof posthog.init !== 'function') return;
    posthog.init(KEY, {
      api_host: '/ph',
      ui_host: 'https://us.posthog.com',
      cookieless_mode: 'always',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: true,
      disable_surveys: true,
    });
    var last = null;
    function page() {
      var key = pageKey();
      if (key === last) return;
      last = key;
      var view = new URLSearchParams(location.search).get('view');
      posthog.capture('$pageview', { site_mode: mode(), page: key, observatory_view: view || undefined });
    }
    page();
    ['pushState', 'replaceState'].forEach(function (name) {
      var original = history[name];
      history[name] = function () { var out = original.apply(this, arguments); page(); return out; };
    });
    window.addEventListener('popstate', page);
    window.addEventListener('hashchange', page);
  };
  document.head.appendChild(script);
})();
