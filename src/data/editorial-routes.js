// Routes rendered in the scoped editorial theme. On these the legacy dark NavBar
// hides itself (pages render their own cream EditorialHeader) and .app-content
// drops its 56px top padding. Add a route here when you convert its page to the
// editorial style. Everything NOT listed keeps the legacy dark app untouched.
export const EDITORIAL_ROUTES = new Set([
  '/',
  '/guide',
  '/atlas',
  '/simulators',
  '/no-gos',
  '/results',
  '/threads',
  '/state-of-field',
  '/permutation-architecture',
  '/directory',
  '/lambda-01758354-candidate',
  '/lambda-0116091',
  '/lambda-qrh-conditional',
  '/autonomous-fleet',
  '/critical-line-proportion',
  '/flow-blindness-no-go',
  '/frozen-rung-pt-equivalence',
  '/pt-floor-audit',
  '/newman-lambda-01787854-candidate',
  '/what-we-know',
  '/shift-bridge-positivity',
  '/theorem-b-threshold',
  '/route-map',
  '/diagrams',
  '/catalan-signed-ladder',
  '/irrationality-pipeline',
  '/lambda-bounds',
  // Model group
  '/full-story',
  '/oscillators',
  '/hamiltonian',
  '/zeta',
  '/waves',
  '/modes',
  '/simulator',
  // Analysis group
  '/fourier',
  '/control',
  '/statistics',
  '/supercritical',
  '/info-theory',
  '/pascal',
  '/odd-zeta',
  '/twin-ladder',
  '/mills-theorem',
  '/gilbreath',
  '/calabi-yau',
  '/gram-points',
  '/schatten-trace-norm',
  '/pair-correlation',
  '/edge-rigidity',
  '/esy-rigidity-empirical',
  '/voronin-universality',
  // Twin-Ladder Program group (§15–27); ClosureRoutesPage deferred (8.7k lines)
  '/blaschke-ghosts',
  '/three-attacks',
  '/freezing-bridge',
  '/kyp-bounded-real',
  '/twin-ladder-paper-roadmap',
  '/rigorous-numerics-stages',
  '/paper-audit-dashboard',
  '/pcc-route-exhaustion',
  '/ht-corridor-certificates',
  '/ht-window-census',
  '/collapse-chain',
  '/hidden-square-program',
  '/section26-conditioning-artifact',
  '/excess-fraction-phi',
  '/reciprocal-program',
  // Approach group (OpenFrontierPage deferred, 4.7k lines)
  '/route-b-limsup',
  '/lambda-timeline',
  '/rh-dag',
  '/frontier-dag',
  '/program-dag',
  '/rh-landscape-dag',
  '/project-dag',
  '/volterra-bound',
  '/berry-keating-xp',
  '/connes-adelic',
  '/rh-attack',
  '/rh-research-modules',
  '/rh-arithmetic-foundation',
  '/rh-suzuki-recurrence',
  '/rh-prime-memory',
  '/rh-finite-suzuki-certificate',
  '/rh-whole-even-certificate',
  '/rh-spectral-denominator-repair',
  '/rh-spectral-head-theory',
  '/rh-historical-routes',
  '/rh-signed-complement',
  '/spectral-attack',
  '/theta-seizing-margin',
  '/theta-static-obstruction',
  '/theta-basin-closure',
  '/onset-bracket-ledger',
  '/gap-closing',
  '/twistor',
  '/zx-calculus',
  '/cross-attack',
  '/break-it',
  // Proof Tools group
  '/formal-proof',
  '/proof-checker',
  '/proof-planner',
  '/proof-overview',
  '/proof-explorer',
  '/dyson-verifier',
  '/rigor',
  '/rigor-dashboard',
  '/rh-proof-state',
  '/reasoning',
  // Progress group
  '/engine-room',
  '/meta-acceleration',
  '/research-journal',
  '/improvement-queue',
  '/improvements',
  '/dashboard',
  '/health',
  // Reference group
  '/concepts',
  // Concept pages: '/concept/<slug>' and '/concepts/class/<slug>' are matched by
  // EDITORIAL_PREFIXES below; the bare paths are listed for completeness.
  '/concept',
  '/concepts/class',
  '/history',
  '/explorations',
  '/literature',
  '/lmfdb-cross-reference',
  '/paper',
  '/papers',
  '/papers-download',
  '/paper-upload',
  '/blog',
  '/wiki',
  '/index',
  '/docs',
  '/selberg-trace',
  '/rh-equivalents',
  '/state-of-program',
  // Visualizations group (wave A; vortex-field + wave B pending)
  '/visualizations',
  '/animations',
  '/cayley-schur-trajectory',
  '/viz-hyperbolic-prime-spiral',
  '/viz-log-phase-spiral',
  '/viz-euler-transport-flow',
  '/hardy-z',
  '/viz-volterra-kernel-heatmap',
  '/viz-volterra-norm-curve',
  '/viz-twin-ladder-tomography',
  '/viz-prime-caustic',
  '/viz-prime-density-caustic',
  '/viz-caustic-resonance',
  '/viz-prime-phase-crystal',
  '/visual-geometries',
  '/viz-near-zero',
  '/viz-winding-dyson-flow',
  // Visualizations wave B + analysis/formalization
  '/vortex-field',
  '/debruijn-departure',
  '/verified-height-lever',
  '/mollified-barrier-certificate',
  '/zero-density-scoping',
  '/guth-maynard-scoping',
  '/obstruction-seam',
  '/subhalf-strip-pcc-criterion',
  '/formalization-status',
  '/formalization-review',
  '/viz-phase-cylinder',
  '/viz-unwrapped-rays',
  '/zoom-hierarchy',
  '/angular-spacing-stats',
  '/prime-rigidity',
  '/viz-euler-product',
  '/riemann-siegel-z',
  '/gue-comparison',
  // Idea-geometry wave (accurate-geometry visualizations)
  '/viz-cost-floor',
  '/viz-window-landscape',
  '/viz-freeze-flow',
  // Pages that render their own EditorialHeader (previously also showed the
  // classic dark bar above it)
  '/reach-frontier-audit',
  '/rh-novel-routes-roadmap',
  '/routes-roadmap',
  '/route-m-cohort2-audit',
]);

// Parameterised editorial routes: every pathname starting with one of these
// prefixes renders in the editorial theme (e.g. /concept/theta-trap).
export const EDITORIAL_PREFIXES = Object.freeze([
  '/concept/',
  '/concepts/class/',
]);

export function isEditorialRoute(pathname) {
  if (EDITORIAL_ROUTES.has(pathname)) return true;
  return EDITORIAL_PREFIXES.some((p) => pathname.startsWith(p));
}

// The ~420 auto-generated imp-NNNN / viz-* diagnostic pages all share the same
// dark PageHeader shell and were never hand-ported. Rather than convert each one,
// AppShell wraps THESE routes in the editorial chrome automatically (cream
// EditorialHeader + .ed-root .ed-viz-legacy scope) so they stay consistent and
// navigable with the rest of the site — and any future fleet-generated page
// matching this pattern inherits the frame for free. A route already in
// EDITORIAL_ROUTES (hand-ported, renders its own header) is excluded.
// A few non-viz content pages are also plain PageHeader/dark-chrome pages that
// were never hand-ported; they get the same auto-shell so the whole site is
// consistent. (The 2 monster pages /closure-routes + /open-frontier are handled
// here too — full hand-recolor of their 8.7k/4.7k lines is impractical, and the
// shared shell gives them the cream header + scope like everything else.)
const VIZ_LEGACY_EXTRA = new Set([
  '/c-shock-numerical-coincidence',
  '/surrogate-model',
  '/closure-routes',
  '/open-frontier',
]);

export function isVizLegacyRoute(pathname) {
  if (isEditorialRoute(pathname)) return false;
  return (
    pathname.startsWith('/viz-') || /imp\d/i.test(pathname) || VIZ_LEGACY_EXTRA.has(pathname)
  );
}
