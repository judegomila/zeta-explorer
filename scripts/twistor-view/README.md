# Focused twistor view verification

Run from the repository root with the locked npm dependencies installed:

    npm run test:twistor
    npx vite build --config scripts/twistor-view/vite.config.mjs
    npx vite --config scripts/twistor-view/vite.config.mjs

The last command serves the actual TwistorPage with its original dependency closure at http://127.0.0.1:3003/scripts/twistor-view/preview.html. It is a review harness, not a second app or deployment. Build output is dist-twistor-preview. The full application's build and assertion suites remain separate.

An optional DOM integration check requires jsdom 26. Install it into a temporary directory rather than altering this project's dependencies:

    npm install --prefix /tmp/twistor-dom-harness --no-audit --no-fund jsdom@26
    JSDOM_MODULE=/tmp/twistor-dom-harness/node_modules/jsdom/lib/api.js node --no-warnings scripts/twistor-view/dom-check.mjs

The DOM check stubs the pre-existing 2D and 3D illustration components. It tests the actual new view, evidence boundary transitions, reset and repeated interactions, query-parameter preservation, view navigation, and history back/forward. It does not test WebGL or visual appearance. If interrupted, remove scripts/twistor-view/.dom-page.mjs before committing.

Recorded on 3 October 2026:
- 2,242 mathematical, scope, KaTeX and source-link checks passed.
- 20 DOM interaction checks passed.
- Dependency-closure production build passed. The legacy 3D chunk retains a bundle-size warning.
- Independently reviewed scientific formulas and labels; both interval certificates and all 2,933 report diagnostics passed from the copied research package.
- Browser visual QA was blocked by the cloud browser's ERR_BLOCKED_BY_CLIENT when opening the local preview. No screenshot or visual pass is claimed.
- The full repository build/assertion sweep was not run in this partial source snapshot; the existing PR CI must supply those checks.

This model uses numerical samples only as diagnostics. Neither numerical agreement nor these UI tests are proofs of RH.
