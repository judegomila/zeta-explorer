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

## Structural-audit follow-up

The revised view adds the precise dual action and bounded-operator domains, the independent arithmetic normalization choices, known scalar Schur range a>=1/2, and the exact all-window boundedness target. It does not promote the universal X-weighted Hardy semigroup or exponentially weighted tail-energy estimate into a thin-width proof.

The nearby-width scope [0.24999998,0.25000002], 1<L<=1.5, uses the original point interval certificate plus a proved analytical width perturbation bound. Its norm bound is 0.99999. The tighter 0.99998 remains selected only at the exact quarter-width. Certificate controls compare literal decimals using exact rational arithmetic, including digits beyond binary64 precision.

Follow-up local validation: 2,359 mathematical/scope/formula checks, 30 DOM interaction checks, and the focused production build passed. Eleven new exact structural checks and the refreshed scientific manifest also passed. The original PR commit's full application CI and automatic-preview desktop browser checks passed; those must be checked again against the follow-up commit before claiming its completion. Mobile rendering and the existing WebGL-dependent illustration remain outside the verified visual coverage.

A deployed-browser regression test found React number-input coercion could leave a long decimal visible after a numeric preset reset. Presets and controlled window values now remain decimal strings; the DOM checks assert displayed values as well as certificate state.
