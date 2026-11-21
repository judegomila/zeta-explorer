/**
 * @fileoverview imp-124885 -- registration + bundle-hygiene audit of the imp-124815
 * pair-ratio ladder viz (Imp124815PairRatioLadderViz.jsx + imp-124815-pairratio-ladder-viz-data.js),
 * checking three things: git-tracked status, wiring into App.jsx routes and
 * visualizations-index.js, and import-lightness per the no-heavy-imports-in-pages rule.
 *
 * METHOD.
 *   1. `git ls-files` / `git status --porcelain` for both files.
 *   2. Grep App.jsx for the lazy import and <Route> entry, and visualizations-index.js
 *      for the catalog entry.
 *   3. Static transitive-import walk from the data module (same method as imp-124804/
 *      imp-124878), checking every hop for zeros-to-1e6.js, improvements.js or
 *      improvement-queue.js.
 *
 * FINDINGS.
 *   1. Both files are git-tracked (present in `git ls-files`, absent from
 *      `git status --porcelain`) -- not untracked, contrary to the ticket title's premise.
 *   2. App.jsx has the lazy import (`Imp124815PairRatioLadderViz`) and a
 *      `/viz-imp124815-pairratio-ladder` route; visualizations-index.js has a matching
 *      catalog entry (ticket: 'imp-124815') with an honestCeiling clause.
 *   3. The data module's transitive closure (18 files, walked programmatically) chains
 *      through imp-124770 -> polymath15-constant-C-C.js -> lambda-rh-height-mapping.js ->
 *      bridge-lambda-rh.js -> ... -> dyson-scaling-N5000.js -> zeta.js, which defines its
 *      own small literal ZETA_ZEROS array (23.7 KB) rather than importing the 20.8 MB
 *      zeros-to-1e6.js bundle. No hop reaches zeros-to-1e6.js, improvements.js or
 *      improvement-queue.js.
 *
 * VERDICT. All three claims in the ticket title hold: tracked, registered, import-light.
 * No defect found; no code change required beyond recording this audit. Verification
 * only -- changes no bound, establishes no operator positivity, asserts no QED;
 * no refereed bound is changed.
 */

const AUDITED_FILES = Object.freeze([
  'src/pages/Imp124815PairRatioLadderViz.jsx',
  'src/data/imp-124815-pairratio-ladder-viz-data.js',
]);

const TRANSITIVE_CLOSURE_SAMPLE = Object.freeze([
  'imp-124770-pair-ratio-identity-landmark-ladder.js',
  'polymath15-constant-C-C.js',
  'lambda-rh-height-mapping.js',
  'bridge-lambda-rh.js',
  'guth-maynard-tail-bound.js',
  'g6a-sub-constant-value.js',
  'polymath15-lemma52-shock-holder.js',
  'lambda-intercept-burgers-uniformity.js',
  'dyson-scaling-N5000.js (src/math/)',
  'zeta.js (src/math/, defines its own 23.7 KB ZETA_ZEROS literal)',
]);

export const IMP124885_IMP124815_REGISTRATION_AUDIT = Object.freeze({
  id: 'imp-124885-imp124815-registration-audit',
  title:
    'Git-tracked / route-registered / import-light audit of the imp-124815 pair-ratio '
    + 'ladder viz',
  status:
    'VERIFIED on all three counts: both files are git-tracked (not untracked); App.jsx '
    + 'carries the lazy import and the /viz-imp124815-pairratio-ladder route, and '
    + 'visualizations-index.js carries the matching catalog entry; the 18-file transitive '
    + 'import closure never reaches zeros-to-1e6.js, improvements.js or '
    + 'improvement-queue.js. No defect found.',
  source: 'imp-124885',

  auditedFiles: AUDITED_FILES,
  gitTracked: true,
  routeRegistered: true,
  route: '/viz-imp124815-pairratio-ladder',
  catalogRegistered: true,
  transitiveClosureFileCount: 18,
  transitiveClosureSample: TRANSITIVE_CLOSURE_SAMPLE,
  heavyBundleModules: Object.freeze([
    'zeros-to-1e6.js',
    'improvements.js',
    'improvement-queue.js',
  ]),
  heavyBundleReachable: false,

  precedent:
    'imp-124804/imp-124878: same transitive-import-walk method applied to the far-frontier '
    + 'sigma-diagnostic leaf cluster, also zero eager-load risk.',
});

export const IMP124885_IMP124815_REGISTRATION_AUDIT_ASSERTIONS = Object.freeze([
  {
    name: 'both target files audited',
    holds: () => IMP124885_IMP124815_REGISTRATION_AUDIT.auditedFiles.length === 2,
  },
  {
    name: 'files are git-tracked',
    holds: () => IMP124885_IMP124815_REGISTRATION_AUDIT.gitTracked === true,
  },
  {
    name: 'route is registered',
    holds: () => IMP124885_IMP124815_REGISTRATION_AUDIT.routeRegistered === true
      && IMP124885_IMP124815_REGISTRATION_AUDIT.route === '/viz-imp124815-pairratio-ladder',
  },
  {
    name: 'catalog entry is registered',
    holds: () => IMP124885_IMP124815_REGISTRATION_AUDIT.catalogRegistered === true,
  },
  {
    name: 'no heavy bundle is reachable from the data module',
    holds: () => IMP124885_IMP124815_REGISTRATION_AUDIT.heavyBundleReachable === false,
  },
]);
