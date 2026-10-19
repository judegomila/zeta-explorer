// Site navigation: 6 groups, each split into headed sections.
// Consumers: EditorialHeader (src/components/editorial/PostLayout.jsx), the
// classic NavBar + command palette (src/App.jsx), DirectoryPage, and
// scripts/audit-nav-links.mjs (reads every `to: '...'` with a regex).
// Every group also exposes a flat `items` list (all sections concatenated) so
// older consumers that only read `g.items` keep working.
const RAW = [
  {
    label: 'Overview',
    sections: [
      {
        heading: 'Start here',
        items: [
          { to: '/', label: 'Home' },
          { to: '/guide', label: 'Guide to the Riemann Hypothesis' },
          { to: '/blog', label: 'RH for non-specialists' },
          { to: '/concepts', label: 'Concepts (explained from the start)' },
        ],
      },
      {
        heading: 'Where things stand',
        items: [
          { to: '/what-we-know', label: 'What we know' },
          { to: '/state-of-program', label: 'State of the program' },
          { to: '/results', label: 'Graded results' },
          { to: '/no-gos', label: 'No-go theorems (list)' },
          { to: '/state-of-field', label: 'State of the field (external work)' },
        ],
      },
      {
        heading: 'Browse',
        items: [
          { to: '/atlas', label: 'Atlas of approaches' },
          { to: '/directory', label: 'Directory (all sections)' },
          { to: '/visualizations', label: 'Visualization index' },
          { to: '/simulators', label: 'Simulator index' },
        ],
      },
    ],
  },
  {
    label: 'Bounds on Λ',
    sections: [
      {
        heading: 'Bounds and candidates',
        items: [
          { to: '/lambda-bounds', label: 'Λ bounds ledger' },
          { to: '/lambda-timeline', label: 'Λ bound timeline' },
          { to: '/full-story', label: 'How the Λ bound is improved' },
          { to: '/lambda-01758354-candidate', label: 'Candidate Λ ≤ 0.1758354' },
          { to: '/lambda-0116091', label: 'Λ ≤ 0.116091 (zero-free half-plane)' },
          { to: '/newman-lambda-01787854-candidate', label: 'Candidate Λ ≤ 0.1787854' },
        ],
      },
      {
        heading: 'Theorems and lemmas',
        items: [
          { to: '/theorem-b-threshold', label: 'Theorem B: minimal-gap threshold Θ_b' },
          { to: '/route-b-limsup', label: 'Route B: limsup t_c = 0' },
          { to: '/frozen-rung-pt-equivalence', label: 'Frozen rungs = Platt–Trudgian' },
          { to: '/theta-static-obstruction', label: 'R1-T2: static-route obstruction' },
          { to: '/theta-seizing-margin', label: 'R1-T3: seizing margin' },
          { to: '/theta-basin-closure', label: 'R1-T4: basin closure' },
          { to: '/onset-bracket-ledger', label: 'sg1c onset bracket ledger' },
        ],
      },
      {
        heading: 'What limits the 0.2 floor',
        items: [
          { to: '/pt-floor-audit', label: 'What binds Λ ≤ 0.2 (audit)' },
          { to: '/verified-height-lever', label: 'Verified zero height as a lever' },
          { to: '/mollified-barrier-certificate', label: 'Mollified barrier certificate' },
          { to: '/zero-density-scoping', label: 'Zero-density estimates and Λ' },
          { to: '/reach-frontier-audit', label: 'Reach frontier: heights vs zero lists' },
          { to: '/route-m-cohort2-audit', label: 'Route M cohort-2 audit index' },
        ],
      },
      {
        heading: 'Freeze calculus',
        items: [
          { to: '/permutation-architecture', label: 'Permutation architecture (Λ ≤ 0.14 contract)' },
          { to: '/viz-cost-floor', label: 'Cost floor' },
          { to: '/viz-window-landscape', label: 'Window landscape' },
          { to: '/viz-freeze-flow', label: 'Freeze flow' },
        ],
      },
    ],
  },
  {
    label: 'Routes to RH',
    sections: [
      {
        heading: 'Maps and graphs',
        items: [
          { to: '/route-map', label: 'Route map (all routes, table)' },
          { to: '/threads', label: 'Research threads' },
          { to: '/frontier-dag', label: 'Open problems DAG (live)' },
          { to: '/rh-landscape-dag', label: 'RH literature DAG' },
          { to: '/project-dag', label: 'Project attempts DAG' },
          { to: '/program-dag', label: 'Freeze-program history DAG' },
          { to: '/routes-roadmap', label: 'Fifty research routes (2026-10-06)' },
          { to: '/rh-novel-routes-roadmap', label: 'Routes A–G roadmap' },
          { to: '/rh-dag', label: 'Insight graph (archive)' },
          { to: '/open-frontier', label: 'Open frontier (archive)' },
        ],
      },
      {
        heading: 'Obstructions',
        items: [
          { to: '/obstruction-seam', label: 'The obstruction seam' },
          { to: '/flow-blindness-no-go', label: 'Flow-blindness no-go' },
          { to: '/subhalf-strip-pcc-criterion', label: 'Seam-escape criterion (PCC lemma)' },
          { to: '/pcc-route-exhaustion', label: 'Pair-correlation route audit' },
          { to: '/guth-maynard-scoping', label: 'Guth–Maynard large values (α = 1/2)' },
        ],
      },
      {
        heading: 'Approaches',
        items: [
          { to: '/rh-equivalents', label: 'RH equivalents (catalog)' },
          { to: '/critical-line-proportion', label: 'Proportion of zeros on the line' },
          { to: '/berry-keating-xp', label: 'Berry–Keating H = xp' },
          { to: '/connes-adelic', label: 'Connes adelic / Weil positivity' },
          { to: '/selberg-trace', label: 'Selberg trace formula' },
          { to: '/spectral-attack', label: 'Spectral operator console' },
          { to: '/rh-attack', label: 'Approach strategies (computational tests)' },
          { to: '/cross-attack', label: 'Approach comparison dashboard' },
          { to: '/voronin-universality', label: 'Voronin universality' },
          { to: '/supercritical', label: 'Supercritical-fluid analogy' },
          { to: '/twistor', label: 'Twistor duality' },
          { to: '/zx-calculus', label: 'ZX-calculus analogy' },
        ],
      },
    ],
  },
  {
    label: 'Twin-ladder model',
    sections: [
      {
        heading: 'The model',
        items: [
          { to: '/oscillators', label: 'Prime oscillators' },
          { to: '/twin-ladder', label: 'Twin-ladder explorer' },
          { to: '/hamiltonian', label: 'Hamiltonian' },
          { to: '/zeta', label: 'Zeta landscape' },
          { to: '/waves', label: 'Wave simulator' },
          { to: '/modes', label: 'Zeros as log-space modes' },
          { to: '/simulator', label: 'Model sandbox' },
          { to: '/break-it', label: 'Stress-test the model' },
        ],
      },
      {
        heading: 'Model analysis',
        items: [
          { to: '/fourier', label: 'Fourier domain' },
          { to: '/control', label: 'Control theory (functional-equation factor)' },
          { to: '/info-theory', label: 'Information theory' },
          { to: '/schatten-trace-norm', label: 'Schatten trace norm' },
          { to: '/gap-closing', label: 'Unitarity-deficit gap analysis' },
          { to: '/health', label: 'Model metrics (live)' },
        ],
      },
      {
        heading: 'Paper program §15–27',
        items: [
          { to: '/shift-bridge-positivity', label: '§15 Shift-bridge positivity' },
          { to: '/closure-routes', label: '§16 Four closure routes' },
          { to: '/blaschke-ghosts', label: '§17 Blaschke ghosts' },
          { to: '/three-attacks', label: '§18 Three closure attempts' },
          { to: '/rigorous-numerics-stages', label: '§20 Rigorous numerics' },
          { to: '/freezing-bridge', label: '§23 Freezing bridge' },
          { to: '/hidden-square-program', label: '§25–27 Hidden-square program' },
          { to: '/section26-conditioning-artifact', label: '§26 Conditioning artifact' },
          { to: '/kyp-bounded-real', label: 'Apps M–O: KYP / bounded-real' },
          { to: '/reciprocal-program', label: 'Apps B–G: reciprocal program' },
          { to: '/volterra-bound', label: 'Volterra norm bound ‖V‖ ≤ 1' },
          { to: '/collapse-chain', label: 'Collapse chain: ‖V‖ ≤ 1 ⇔ CDB-Exist' },
          { to: '/ht-corridor-certificates', label: 'H_t corridor certificates' },
          { to: '/ht-window-census', label: 'H_t finite-window census' },
          { to: '/excess-fraction-phi', label: 'Excess fraction φ(s)' },
        ],
      },
      {
        heading: 'Paper records',
        items: [
          { to: '/paper', label: 'The twin-ladder paper' },
          { to: '/twin-ladder-paper-roadmap', label: 'Paper roadmap (historical)' },
          { to: '/paper-audit-dashboard', label: 'Paper review and audit ledger' },
        ],
      },
    ],
  },
  {
    label: 'Visualize',
    sections: [
      {
        heading: 'Galleries',
        items: [
          { to: '/visual-geometries', label: 'Visual geometries of ζ' },
          { to: '/diagrams', label: 'Diagrams' },
          { to: '/animations', label: 'Animations' },
        ],
      },
      {
        heading: 'Zeros and their statistics',
        items: [
          { to: '/riemann-siegel-z', label: 'Riemann–Siegel Z(t)' },
          { to: '/hardy-z', label: 'Hardy Z(t) asymptotics' },
          { to: '/gram-points', label: 'Gram points' },
          { to: '/viz-near-zero', label: 'Near a zeta zero' },
          { to: '/statistics', label: 'Zero statistics' },
          { to: '/pair-correlation', label: 'Pair correlation' },
          { to: '/gue-comparison', label: 'Spacings vs GUE' },
          { to: '/esy-rigidity-empirical', label: 'ESY rigidity (bulk)' },
          { to: '/edge-rigidity', label: 'ESY rigidity (edge)' },
        ],
      },
      {
        heading: 'Prime phase field',
        items: [
          { to: '/viz-log-phase-spiral', label: 'Log-phase spiral' },
          { to: '/zoom-hierarchy', label: 'Zoom hierarchy of the spiral' },
          { to: '/viz-phase-cylinder', label: 'Phase cylinder' },
          { to: '/viz-unwrapped-rays', label: 'Unwrapped phase rays' },
          { to: '/angular-spacing-stats', label: 'Angular-spacing statistics' },
          { to: '/viz-prime-caustic', label: 'Prime caustic' },
          { to: '/viz-prime-density-caustic', label: 'Prime density on caustics' },
          { to: '/viz-caustic-resonance', label: 'Caustic resonance overlay' },
          { to: '/viz-prime-phase-crystal', label: 'Prime phase crystal' },
          { to: '/viz-hyperbolic-prime-spiral', label: 'Hyperbolic prime spiral' },
          { to: '/prime-rigidity', label: 'Caustics: true vs perturbed' },
          { to: '/viz-euler-product', label: 'Euler product: true vs perturbed' },
          { to: '/viz-euler-transport-flow', label: 'Euler transport flow' },
          { to: '/vortex-field', label: 'Prime-log vortex field' },
        ],
      },
      {
        heading: 'Flows and operators',
        items: [
          { to: '/debruijn-departure', label: 'Zero departure under de Bruijn flow' },
          { to: '/viz-winding-dyson-flow', label: 'Winding under Dyson/Newman flow' },
          { to: '/cayley-schur-trajectory', label: 'Cayley–Schur trajectory' },
          { to: '/viz-volterra-kernel-heatmap', label: 'Volterra kernel heatmap' },
          { to: '/viz-volterra-norm-curve', label: 'Volterra norm curve' },
          { to: '/viz-twin-ladder-tomography', label: 'Twin-ladder tomography' },
          { to: '/viz-twistor-dual-intertwiner', label: 'Twistor–dual intertwiner' },
        ],
      },
      {
        heading: 'Other number theory',
        items: [
          { to: '/odd-zeta', label: 'Odd zeta values (Apéry)' },
          { to: '/catalan-signed-ladder', label: "Catalan's constant: signed ladder" },
          { to: '/irrationality-pipeline', label: 'Irrationality pipeline' },
          { to: '/pascal', label: "Pascal's triangle and ζ" },
          { to: '/mills-theorem', label: "Mills' theorem" },
          { to: '/gilbreath', label: "Gilbreath's observation" },
          { to: '/calabi-yau', label: 'Calabi–Yau approach' },
        ],
      },
    ],
  },
  {
    label: 'Records',
    sections: [
      {
        heading: 'Verification',
        items: [
          { to: '/formalization-status', label: 'Lean formalization status' },
          { to: '/formalization-review', label: 'Formalization review' },
          { to: '/dyson-verifier', label: 'Dyson collision verifier' },
          { to: '/rigor', label: 'Known issues (self-review)' },
          { to: '/rigor-dashboard', label: 'Corrected-claims ledger' },
          { to: '/proof-checker', label: 'Proof checker' },
        ],
      },
      {
        heading: 'Twin-ladder proof attempt (historical)',
        items: [
          { to: '/formal-proof', label: 'Formal proof attempt' },
          { to: '/proof-explorer', label: 'Proof step explorer' },
          { to: '/proof-overview', label: 'Proof attempt overview (audited)' },
          { to: '/proof-planner', label: 'Proof planner' },
          { to: '/rh-proof-state', label: 'Proof-state snapshot (2026-06-18)' },
          { to: '/reasoning', label: 'Historical reasoning' },
        ],
      },
      {
        heading: 'Project activity',
        items: [
          { to: '/engine-room', label: 'Engine room (live)' },
          { to: '/autonomous-fleet', label: 'Autonomous fleet' },
          { to: '/improvement-queue', label: 'Improvement queue' },
          { to: '/improvements', label: 'Improvements log' },
          { to: '/index', label: 'Improvements by wave' },
          { to: '/research-journal', label: 'Research journal (sessions)' },
          { to: '/explorations', label: 'Exploration journal' },
          { to: '/meta-acceleration', label: 'Meta acceleration' },
        ],
      },
      {
        heading: 'Library',
        items: [
          { to: '/literature', label: 'Literature' },
          { to: '/lmfdb-cross-reference', label: 'LMFDB cross-reference' },
          { to: '/papers-download', label: 'Paper downloads' },
          { to: '/papers', label: 'Saved papers' },
          { to: '/paper-upload', label: 'Upload a paper' },
          { to: '/history', label: 'History of RH' },
          { to: '/wiki', label: 'Glossary (searchable)' },
          { to: '/docs', label: 'App documentation' },
        ],
      },
    ],
  },
];

export const NAV_GROUPS = RAW.map((g) => ({ ...g, items: g.sections.flatMap((s) => s.items) }));

// Former nav entries that are no longer placed in a group. Their routes and
// page files are kept; the command palette still lists them (see App.jsx).
// The objects use `path` (not `to`) so link audits count only placed entries.
export const NAV_DROPPED = [
  { path: '/threads', label: 'Λ ≤ 0.17759432 y-thaw package (thread)', reason: 'second nav entry for the same URL as Research threads' },
  { path: '/dashboard', label: 'Model metrics dashboard', reason: 'shows the same six live metrics as /health' },
];

// Routed pages that were never in the nav; listed so the command palette can find them.
export const NAV_SEARCH_ONLY = [
  { path: '/c-shock-numerical-coincidence', label: 'C-shock numerical coincidence' },
  { path: '/surrogate-model', label: 'Surrogate model' },
];

// Returns the label of the group containing `pathname`, or null.
export function groupForPath(pathname) {
  const g = NAV_GROUPS.find((grp) => grp.items.some((it) => it.to === pathname));
  return g ? g.label : null;
}
