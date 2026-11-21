// Content of the /key-results page. Static and import-free: this module must
// stay light (no data bundles, no zeros table).
//
// Every item has a stable `id`. The fields `rank`, `tier`, `verification`,
// `novelty`, `arbitrariness` and `importance` are filled in later from an
// independent review; they are null until then. When at least one item has a
// numeric `rank`, the page shows the ranked view (sorted by rank, grouped by
// `tier`); otherwise it shows the grouped view defined by KEY_RESULT_GROUPS.
//
// Link fields per item:
//   links:    [{ to, label }]    routes of this app (checked against src/App.jsx
//                                by scripts/verify-key-results.mjs)
//   external: [{ href, label }]  links outside the hash router (the Observatory)
//   repo:     [{ path, label }]  files in this repository, relative to its root

export const REPO_BLOB_BASE = 'https://github.com/judegomila/zeta-explorer/blob/main/';

// The fixed set of status labels. `grade` selects the chip colour of the
// shared editorial GradeChip component.
export const KEY_RESULT_STATUSES = Object.freeze({
  lean: {
    label: 'Lean-checked',
    grade: 'FORMAL',
    meaning: 'The stated part is proved in Lean 4 with Mathlib, with no sorry and only the standard axioms. The note on the item says which part.',
  },
  interval: {
    label: 'interval-arithmetic certificate',
    grade: 'CERTIFIED',
    meaning: 'A finite computation in ball or exact rational arithmetic whose output is the stated inequality. Not externally refereed.',
  },
  notes: {
    label: "proved in the repository's notes, unrefereed",
    grade: 'THEOREM',
    meaning: 'A written proof exists in the repository. It has had at most internal review.',
  },
  numerical: {
    label: 'numerical evidence',
    grade: 'MEASURED',
    meaning: 'Floating-point or high-precision computation without a certificate.',
  },
  conditional: {
    label: 'conditional',
    grade: 'CONDITIONAL',
    meaning: 'Holds if the named inputs hold. The note on the item names them.',
  },
  candidate: {
    label: 'computer-assisted candidate, unrefereed',
    grade: 'CANDIDATE',
    meaning: 'A computer-assisted package whose composition has not been externally refereed. Not an accepted bound.',
  },
  obstruction: {
    label: 'negative result / obstruction',
    grade: 'NO-GO',
    meaning: 'A statement that a route or a class of routes stops at a named point.',
  },
});

export const KEY_RESULT_GROUPS = Object.freeze([
  { id: 'geometric', heading: 'Geometric program', blurb: 'The bridge kernel, its shear and energy, and the surfaces on which zeta is drawn.' },
  { id: 'structural', heading: 'Structural results on why routes stop', blurb: 'Statements that a class of arguments cannot reach the Riemann Hypothesis, and where each one stops.' },
  { id: 'theorems', heading: 'Theorems and certificates', blurb: 'Identities, finite certificates and formalised statements.' },
  { id: 'lambda', heading: 'De Bruijn-Newman constant', blurb: 'Statements about upper bounds on Λ. The accepted bound is Λ ≤ 0.2 (Platt-Trudgian).' },
  { id: 'reductions', heading: 'Program-level reductions', blurb: 'Programs that restate a family of questions as one statement, with the outcome of each.' },
]);

const CP = 'research-checkpoints/rh-push-2026-11-16/';

// Review fields, null until the independent review supplies them.
const REVIEW_PENDING = Object.freeze({
  rank: null,
  tier: null,
  verification: null,
  novelty: null,
  arbitrariness: null,
  importance: null,
});

const RAW = [
  // ── 1. Geometric program ────────────────────────────────────────────────
  {
    id: 'bridge-shear',
    group: 'geometric',
    title: 'Bridge shear and bridge energy',
    statement:
      'The shifted de Branges kernel K_a of E_a(z) = Ξ(z + ia) has an exact paired formula in the coordinates r = (u+v)/2, s = (v−u)/2. The raw shear Φ(u)Φ(v) sinh(a(v−u)) has rank at most 2 with eigenvalues +μ and −μ, so it is not positive by itself; the earlier diagonal split was withdrawn because the set u = v has measure zero. For the full bridge kernel the sign of the transverse shear is even boundary energy minus odd boundary energy, and a certifier classifies one finite Gram matrix at listed nodes as positive, negative or inconclusive.',
    status: 'notes',
    statusNote: 'The identities are exact. The finite shear-Gram certifier uses Arb ball arithmetic and applies only to the listed node set and shift. The inequality at all heights is open.',
    links: [
      { to: '/hidden-square-program', label: 'Shear kernel and its repair' },
      { to: '/sign-switching', label: 'Sign-switching contours and boundary-energy explorer' },
      { to: '/shift-bridge-positivity', label: 'Shift-bridge positivity' },
      { to: '/twin-ladder', label: 'Twin-ladder explorer' },
    ],
    repo: [
      { path: 'rigorous/shear_gram/README.md', label: 'Finite shear-Gram certifier' },
      { path: 'formalization/paper/sign_switching_energy_2026-11-07.md', label: 'Sign-switching energy note' },
      { path: 'src/data/shear-kernel-repair-2026-08-28.js', label: 'Shear kernel repair record' },
    ],
  },
  {
    id: 'anti-bridge-square',
    group: 'geometric',
    title: 'Anti-bridge reflection and the square factorisation of the bridge energy',
    statement:
      'Reflecting one field through the anti-bridge (the point s = 1/2) flips the sign of the coupling block: W(v_b ± J v_c) = b′Pb + c′Pc ± 2 b′Bc. Symmetrising removes B and leaves the form P, whose positivity is equivalent to RH; the bound needed on the coupling, −P ≤ B ≤ P, is the pair of parity-sector statements. The cutoff energy factors as H_c = A* M_c A with Hankel blocks: H_c ≥ 0 if and only if the anticausal block vanishes, if and only if RH, and without assumption H_c is a Krein-space square whose negative index is the number of off-line zero pairs.',
    status: 'notes',
    statusNote: 'One internal referee pass per lane. The identities also hold for the Davenport-Heilbronn function, so they do not locate zeros.',
    external: [{ href: './observatory/', label: 'Observatory (anti-bridge markers)' }],
    repo: [
      { path: `${CP}geometric-lanes/g-antibridge-cancel/RESULT.md`, label: 'Bridge and anti-bridge forms' },
      { path: `${CP}geometric-lanes/g-spinor-square-root/RESULT.md`, label: 'Square-root (Hankel block) form' },
      { path: 'rigorous/torus-heat-antibridge-2026-11-09/README.md', label: 'Torus heat flow and the opposite bridge' },
    ],
  },
  {
    id: 'observatory-surfaces',
    group: 'geometric',
    title: 'Zeta on the torus, the sphere and the Klein surface',
    statement:
      'The Observatory draws ζ, the completed ξ and the de Bruijn-Newman heat family on the plane, the sphere, an elliptic torus (a double cover) and the Klein and annulus quotients. On the Klein quotient the loaded field has exactly two topological invariants, N_on + 2 N_right and the seam sign, and neither detects an off-line pair. In the transport comparison the Klein quotient keeps the optimal relative coupling constant and the annulus supplies an explicit harmonic reference operator.',
    status: 'notes',
    statusNote: 'The Klein seam statement is classical in content and had one internal referee pass. The renderer is numerical.',
    external: [{ href: './observatory/', label: 'Observatory' }],
    repo: [
      { path: 'observatory/README.md', label: 'Observatory documentation' },
      { path: `${CP}geometric-lanes/g-klein-bottle-seam/RESULT.md`, label: 'Klein seam invariants' },
      { path: 'rigorous/klein-annulus-coupling-2026-11-14/README.md', label: 'Klein phase transport versus annulus energy' },
      { path: `${CP}geometric-lanes/SYNTHESIS_GEOMETRIC.md`, label: 'Synthesis of the geometric lanes' },
    ],
  },
  {
    id: 'zero-traps',
    group: 'geometric',
    title: 'Zero channels',
    statement:
      'A zero channel is a moving disk that holds exactly one zero while the heat parameter τ varies. Certified cases: four pairwise-disjoint disks of radius 1/100 for an exact quartet model on −13/100 ≤ τ ≤ 0; one fixed disk of radius 7/20 centred at 1/2 + 14.134725141734693 i for the theta heat family on −1/20 ≤ τ ≤ 1/20, with the zero on the critical line; and 100 pairwise-disjoint moving disk chains with one zero each for −0.1 ≤ τ ≤ 0.5.',
    status: 'interval',
    statusNote: 'Exact rational and Arb ball arithmetic. The certificates are local and restate verified zero height; they give no zero count at all heights.',
    external: [{ href: './observatory/', label: 'Observatory (Channels workspace)' }],
    repo: [
      { path: 'research/rh/zero-channels/README.md', label: 'Zero channels, coupling and Newton guidance' },
      { path: `${CP}geometric-lanes/g-zero-channels/RESULT.md`, label: '100 certified channels' },
    ],
  },
  {
    id: 'twistor',
    group: 'geometric',
    title: 'Twistor duality and the dual intertwiner',
    statement:
      'With R_a(w) = X(w−a)/X(w+a) and X(w) = ξ(1/2 + w), the wide bridge T(w) = R_{3/2}(w) A(w) is a holomorphic contraction for Re w > 0. For the signed local Hankel operator at width a = 1/4 a certificate gives ‖H_{1/4,L}‖ ≤ 49999/50000 for every 1 < L ≤ 3/2, while the operator built from the absolute value of the same kernel has norm greater than 1 at L = 3/2. The original twistor views on the page are illustrations by analogy.',
    status: 'interval',
    statusNote: 'The finite-L certificate does not give a pointwise Schur bound on R_a, global positivity, or RH.',
    links: [
      { to: '/twistor', label: 'Twistor duality' },
      { to: '/viz-twistor-dual-intertwiner', label: 'Twistor dual intertwiner view' },
    ],
    repo: [{ path: 'research/twistor-bridge-2026-10-03/README.md', label: 'Twistor bridge package and signed certificate' }],
  },

  // ── 2. Structural results ───────────────────────────────────────────────
  {
    id: 'flow-blindness',
    group: 'structural',
    title: 'Flow-blindness no-go',
    statement:
      'Given Λ ≥ 0 (Rodgers-Tao), every hypothesis class that is invariant under the de Bruijn-Newman flow, sound for real zeros and satisfied at t = 0 is contradictory. No flow-stable hypothesis proves RH; a proof needs an input that the flow changes, that is, arithmetic input.',
    status: 'lean',
    statusNote: 'The core lemmas are checked in Lean 4. Λ ≥ 0 enters as a hypothesis and is not formalised here.',
    links: [
      { to: '/flow-blindness-no-go', label: 'Flow-blindness no-go' },
      { to: '/formalization-status', label: 'Formalization status' },
    ],
    repo: [{ path: 'formalization/lean-aristotle/flow_blindness/RequestProject/Main.lean', label: 'Lean file' }],
  },
  {
    id: 'obstruction-map',
    group: 'structural',
    title: 'Obstruction map',
    statement:
      'One table of 118 closed routes, each with the point where it stops and the control that defeats it. The controls are fixed: Davenport-Heilbronn, the backward heat family, sign-twisted primes (positive and signed), ζ(s+a)ζ(s−a), a one-prime twin of ξ, and Beurling zeta. Every route ends at the same requirement: an inequality uniform in height that uses multiplicativity at all primes together, fails for every control, and reaches the critical line from finite stages or from Re s > 1. On the four requirements R1 to R4, all 196 lanes of the campaign score 0 of 4.',
    status: 'obstruction',
    statusNote: '186 of the 196 lanes had an internal referee pass; 19 lanes used in the map are marked unrefereed there. No external review.',
    links: [
      { to: '/rh-research-modules', label: 'RH research modules' },
      { to: '/what-we-know', label: 'What we know' },
      { to: '/no-gos', label: 'No-go theorems (list)' },
    ],
    repo: [
      { path: `${CP}fleet-lanes/OBSTRUCTION_MAP.md`, label: 'Obstruction map' },
      { path: `${CP}campaign/METRIC.md`, label: 'Requirements R1 to R4' },
      { path: `${CP}campaign/SCOREBOARD.md`, label: 'Campaign scoreboard' },
    ],
  },
  {
    id: 't3-zero-free-strip',
    group: 'structural',
    title: 'Twin-ladder T3 is a zero-free strip statement',
    statement:
      'T3(a) holds if and only if ζ has no zero with Re s > 1/2 + a, and T3(a) for every a > 0 is RH. T3 restates the zero-free strip; it is not a mechanism for proving one.',
    status: 'notes',
    statusNote: 'The trigonometric core of the dictionary was checked numerically to 1e-30 and the full identity to 1e-15.',
    links: [
      { to: '/concept/t3-strip', label: 'Concept: T3 as a zero-free strip' },
      { to: '/project-dag', label: 'Project attempts DAG' },
      { to: '/shift-bridge-positivity', label: 'Shift-bridge positivity' },
    ],
  },
  {
    id: 'pole-riesz',
    group: 'structural',
    title: 'The pole of zeta makes Riesz-type truncations fail',
    statement:
      'The pole-corrected, functional-equation-symmetrised Riesz sections of ζ of every integer order k ≥ 1 have zeros off the critical line for all large N. The cause is the pole at s = 1: at the Liouville point of the prime torus the limit function is ζ(2s)/ζ(s), which is negative on (1/2, 1) and vanishes at s = 1. A certified instance at order 2: for N = 1250 the section has a zero at 0.5414825 + 855204807584.9554 i.',
    status: 'obstruction',
    statusNote: 'The lane is unrefereed. The listed instances are Arb-certified. Lean covers the limit function only: Σ λ(n) n^(−s) = ζ(2s)/ζ(s), its limit 0 at s = 1 and its sign on (1/2, 1).',
    repo: [
      { path: `${CP}fleet-lanes/box-riesz-order2/RESULT.md`, label: 'Riesz sections, all orders' },
      { path: `${CP}fleet-lanes/lean-harmonic-rh-push/07-liouville-limit/LiouvilleLimitProved.lean`, label: 'Lean file (limit function)' },
    ],
  },
  {
    id: 'route-i-ln2',
    group: 'structural',
    title: 'Route I stops at ln 2',
    statement:
      'For the semilocal port to S = {∞, 2} of the Connes-Consani Sonine argument, the excess carries exactly half of the logarithmic cusp at ρ = 2. For every support width 2a > ln 2 the composite E_S∘Q is unbounded above along the resonances of the prime 2, so the required condition E∘Q ≤ c |ĝ(0)|² is false past ln 2, and no finite-rank correction restores it.',
    status: 'obstruction',
    statusNote: 'The half-split of the cusp is derived in the note; the growth along resonances was also measured (210 against a predicted 202).',
    links: [
      { to: '/rh-novel-routes-roadmap', label: 'Routes A-G roadmap (Route I)' },
      { to: '/routes-roadmap', label: 'Fifty research routes' },
    ],
    repo: [{ path: 'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js', label: 'Sonine excess record' }],
  },

  // ── 3. Theorems and certificates ────────────────────────────────────────
  {
    id: 'pr48-weil',
    group: 'theorems',
    title: 'The PR-48 residual target is the Weil functional',
    statement:
      'On each finite exponential test v, the gamma energy minus the prime side of the residual-energy target of PR 48, eq. (21), equals Weil’s quadratic functional on the one-sided test. Restricted to Schur residuals the target is equivalent to positivity of every real-node Pick matrix, and so to Weil positivity and to RH. Any version with a margin θ < 1 over all finite exponential tests is false.',
    status: 'lean',
    statusNote: 'Lean covers the Pick and Schur-complement equivalence (Theorem 2) for Mathlib’s ξ and the finite algebra of the identity: 7 files, 1612 lines. The equivalence with RH is in Lean only with two analytic statements as hypotheses. The identity with the Weil functional is proved in the notes with one internal referee pass.',
    repo: [
      { path: `${CP}equivalence-and-pick/eq48/RESULT.md`, label: 'Equivalence note' },
      { path: `${CP}fleet-lanes/b-lean-eq48/RESULT.md`, label: 'Lean formalisation report' },
      { path: `${CP}fleet-lanes/b-lean-eq48/Eq48Xi.lean`, label: 'Lean file (ξ instance)' },
    ],
  },
  {
    id: 'pick-hankel',
    group: 'theorems',
    title: 'Pick positivity for K ≤ 12 and the anchor Hankel-pair rule',
    statement:
      'Real-node Pick positivity holds for every K ≤ 12; it follows from verified zero height (Platt-Trudgian, 3·10^12) with an Arb certificate and gives no new information on zeros. At the anchor x = 0 the jet matrix of the bridge kernel is 2 H0 ⊕ 2 H1 for the two Hankel matrices of a Stieltjes moment problem, and the first failing Pick order is N* = min(2 K0 − 1, 2 K1). For Davenport-Heilbronn, H0 has negative pivots at 75 and 110 and H1 at 75 and 109, which gives the failure orders 149, 150, 218 and 219.',
    status: 'interval',
    statusNote: 'K ≤ 7 is positive definite as written; for K = 8 to 12 the written argument gives positive semidefinite. The anchor rule is proved by the lane author for clustered nodes and is unrefereed; its jet-matrix core is Lean-checked.',
    repo: [
      { path: `${CP}equivalence-and-pick/pick/NEXT_STAGE.md`, label: 'Pick certificate for K ≤ 12' },
      { path: `${CP}fleet-lanes/stack-antibridge/RESULT.md`, label: 'Anchor identity and failure-order rule' },
      { path: `${CP}fleet-lanes/lean-harmonic-rh-push/03-anchor-hankel/AnchorHankelProved.lean`, label: 'Lean file (jet matrix)' },
    ],
  },
  {
    id: 'lee-yang',
    group: 'theorems',
    title: 'Finite Lee-Yang stage theorem and a Lean formalisation of the circle theorem',
    statement:
      'For any graph on the primes dividing a squarefree M with couplings K_pq ≥ 0 that satisfy Σ_q K_pq = log p, the Dirichlet polynomial Z_K(s) = Σ_{n|M} w_K(n) n^(−s) satisfies Z_K(1−s) = M^(s−1/2) Z_K(s) and has all its zeros on Re s = 1/2. The statement does not pass to the limit: it also holds for a unimodular twist whose limit has a zero in the strip. The Lee-Yang circle theorem that it uses is classical; the contribution here is its Lean formalisation in the multivariate occupation form.',
    status: 'lean',
    statusNote: 'Lean covers the circle theorem (2 theorems, 407 lines) and parts (i) to (iii) of the stage theorem with Lee-Yang as an explicit hypothesis (6 theorems). The two files were not compiled as one.',
    repo: [
      { path: `${CP}fleet-lanes/res-sparse-ferromagnet/RESULT.md`, label: 'Stage theorem' },
      { path: `${CP}fleet-lanes/lean-harmonic-rh-push/01-leeyang-circle/LeeYangCircleProved.lean`, label: 'Lean file (circle theorem)' },
      { path: `${CP}fleet-lanes/lean-harmonic-rh-push/02-stage-selfdual/StageSelfdualProved.lean`, label: 'Lean file (stage theorem)' },
      { path: `${CP}fleet-lanes/lean-harmonic-rh-push/LOCAL_PROOFS.md`, label: 'Report on the local Lean proofs' },
    ],
  },
  {
    id: 'toeplitz-krein',
    group: 'theorems',
    title: 'Toeplitz/Krein certificate for pole-free Weil positivity',
    statement:
      'For every real h in L²(−a, a) with 2a ≤ ln 3 and ĥ(±i/2) = 0, the one-prime Weil form satisfies W(h) ≥ 8.2045368e-4 ‖h‖². This is Weil’s functional restricted to pole-free test functions of support width at most ln 3; it is not positivity of the full functional. The same range is also implied by the verified zeros.',
    status: 'interval',
    statusNote: 'Arb ball arithmetic at 256 bits, two internal referee passes. Comparison with the small-support literature has not been made.',
    links: [
      { to: '/viz-imp96646-krein-certificate-margin', label: 'Krein certificate margin' },
      { to: '/routes-roadmap', label: 'Fifty research routes' },
    ],
    repo: [{ path: 'src/data/tlb-arb-lege-2026-09-28.js', label: 'Certificate record' }],
  },
  {
    id: 'semilocal-sonine',
    group: 'theorems',
    title: 'Semilocal Sonine trace identity for S = {∞, 2}',
    statement:
      'The identity Tr(ϑ(f) P P̂_S P) = W_∞ + W_2 + D_S is exact, and its trace side is positive (smallest multiplier 0.0650). The remainder D_S has logarithmic cusps at every ρ = 2^k and is 96.7% to 99.71% of the trace on the pole-free minimiser, so Weil positivity for support below ln 3 is the inequality D_S ≤ L_S. The identity is not gap-free.',
    status: 'notes',
    statusNote: 'The percentages are measured on the minimiser at a = 0.5 and a = (ln 3)/2.',
    links: [
      { to: '/viz-imp96103-route-i-remainder-resonance', label: 'Route I remainder resonance' },
      { to: '/rh-novel-routes-roadmap', label: 'Routes A-G roadmap (Route I)' },
    ],
  },
  {
    id: 'c-glob',
    group: 'theorems',
    title: 'Closed form for c_glob',
    statement:
      'The global isolation constant equals the half-lattice constant: c_glob = c_half = 0.8980208880762339, the unique root in (0, 1) of 4 + 4ρ − 4/ρ − 4/(ρ+1) − 2[ψ(1 + 2/ρ) − ψ(1 + 1/ρ)], where ψ is the digamma function. This closes the R2 subgap; it changes no bound on Λ.',
    status: 'notes',
    statusNote: 'The R1 transfer and the off-basin regime are open.',
    links: [
      { to: '/theta-basin-closure', label: 'R1-T4: basin closure' },
      { to: '/onset-bracket-ledger', label: 'sg1c onset bracket ledger' },
    ],
    repo: [{ path: 'src/data/sg1c-cglo-closure-2026-08-28.js', label: 'Closure record' }],
  },

  // ── 4. De Bruijn-Newman constant ────────────────────────────────────────
  {
    id: 'lambda-0116',
    group: 'lambda',
    title: 'Λ ≤ 0.116091, conditional',
    statement:
      'A computer-assisted upper bound Λ ≤ 0.116091 that depends on two unrefereed results: the zero-free half-plane Re s > 7/8 and D. J. Raymond’s decreasing-barrier construction. The value also uses internal floor and kernel certificates; without them it is 0.118506.',
    status: 'conditional',
    statusNote: 'Conditional on the zero-free half-plane Re s > 7/8 (a Lean proof exists and was rebuilt here; the result is not refereed) and on Raymond’s construction (tables not verified). Λ ≤ 0.2 remains the accepted bound.',
    links: [{ to: '/lambda-0116091', label: 'Λ ≤ 0.116091' }],
    repo: [{ path: 'papers/lambda-qrh-0.116091/DEPENDENCIES.md', label: 'Dependencies of the draft' }],
  },
  {
    id: 'y-transfer-01758',
    group: 'lambda',
    title: 'Λ ≤ 0.1758354 by y-transfer with an excision budget',
    statement:
      'A candidate bound in which the y-transfer closes through profile-sector cells with an excision budget, after termwise monotonicity was found to be false. The Arb run over all 20,546 profiles passed with B = 2.4957e-4 against a margin of 1.872e-3. The y-transfer reduction and Lemma B3 are Lean-checked.',
    status: 'candidate',
    statusNote: 'The composition of the package is not externally refereed. Λ ≤ 0.2 remains the accepted bound.',
    links: [
      { to: '/lambda-01758354-candidate', label: 'Candidate Λ ≤ 0.1758354' },
      { to: '/lambda-bounds', label: 'Λ bounds ledger' },
    ],
  },
  {
    id: 'pt-floor',
    group: 'lambda',
    title: 'What binds Λ ≤ 0.2',
    statement:
      'In the Platt-Trudgian argument the bound Λ ≤ 0.2 is set by the verified zero height, about 3·10^12, and not by slack in the barrier (which is at least 1.2). Tightening the barrier by sum-of-squares, Carleman or Putinar methods therefore does not lower the bound; more verified height does.',
    status: 'obstruction',
    statusNote: 'A sensitivity audit with an interval-arithmetic corridor run. No bound changes.',
    links: [
      { to: '/pt-floor-audit', label: 'What binds Λ ≤ 0.2 (audit)' },
      { to: '/verified-height-lever', label: 'Verified zero height as a lever' },
    ],
  },
  {
    id: 'gaussian-proxy',
    group: 'lambda',
    title: 'The Gaussian-convolution proxy is the de Bruijn flow at negative time',
    statement:
      'The Gaussian-convolution proxy used in the winding experiments is the exact de Bruijn flow at a negative time. The monotonicity of its winding count is classical (de Bruijn, Theorem 13, with a jet lemma), and the earlier reading of that monotonicity as a numerical artifact is withdrawn.',
    status: 'notes',
    statusNote: 'A correction of earlier entries in this repository. No bound changes.',
    links: [
      { to: '/viz-imp34825-winding-count-ladder', label: 'Exact de Bruijn winding count ladder' },
      { to: '/debruijn-departure', label: 'De Bruijn departure' },
    ],
  },

  // ── 5. Program-level reductions ─────────────────────────────────────────
  {
    id: 'hidden-square',
    group: 'reductions',
    title: 'Hidden-square program and the statement ‖V‖ ≤ 1',
    statement:
      'The hidden-square program asks for positivity of the complete shifted kernel K_a for every a > 0, which is equivalent to RH. The proposed restatement of the conjectures of sections 15 to 27 of the twin-ladder paper (nine are listed) as the single statement ‖V‖ ≤ 1 is not a valid reduction: ‖V‖ is homogeneous under scaling and K_a is not. The normalised statement ‖R‖ ≤ 1 that survives is equivalent to RH. For the canonical Φ, ‖V_{a,Φ}‖ ≤ 1 holds if and only if a ≤ a*, with a* in (31.6213, 31.6214).',
    status: 'obstruction',
    statusNote: 'The bracket for a* is interval-certified with one internal referee pass. The earlier figure of norms 5000 times below 1 measured a mis-scaled operator and is withdrawn.',
    links: [
      { to: '/hidden-square-program', label: 'Hidden-square program' },
      { to: '/collapse-chain', label: 'Collapse chain' },
      { to: '/volterra-bound', label: 'Volterra norm bound' },
    ],
    repo: [{ path: `${CP}fleet-lanes/b-volterra-norm/RESULT.md`, label: 'Decision of ‖V‖ ≤ 1' }],
  },
  {
    id: 'catalan-ladder',
    group: 'reductions',
    title: 'Catalan signed ladder and the period-dimension obstruction',
    statement:
      'The signed ladder attached to the character χ₄ has the values 5ζ(2) − 8 for the ζ(2) control, of period dimension 2, and G − π + 2 ln 2 + π²/12 for Catalan’s constant G, of period dimension 5. The gap in dimension is the obstruction to carrying the ζ(2) argument over to G. Irrationality of G is open in the refereed literature.',
    status: 'notes',
    statusNote: 'The two values are exact. An external Lean-formalised claim about G (2026-10-06) is not peer reviewed and is not a result of this project.',
    links: [
      { to: '/catalan-signed-ladder', label: 'Catalan signed ladder' },
      { to: '/irrationality-pipeline', label: 'Irrationality pipeline' },
    ],
  },
];

export const KEY_RESULTS = Object.freeze(
  RAW.map((r) => Object.freeze({ links: [], external: [], repo: [], ...REVIEW_PENDING, ...r })),
);

export const KEY_RESULTS_COUNT = KEY_RESULTS.length;

// True once the independent review has supplied at least one rank.
export function hasRanking(items = KEY_RESULTS) {
  return items.some((r) => typeof r.rank === 'number' && Number.isFinite(r.rank));
}

// Ranked view: items sorted by rank (unranked last, in file order), cut into
// consecutive runs that share a tier.
export function rankedSections(items = KEY_RESULTS) {
  const ranked = (r) => typeof r.rank === 'number' && Number.isFinite(r.rank);
  const sorted = items
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const ra = ranked(a.r); const rb = ranked(b.r);
      if (ra && rb) return a.r.rank - b.r.rank || a.i - b.i;
      if (ra !== rb) return ra ? -1 : 1;
      return a.i - b.i;
    })
    .map((x) => x.r);
  const sections = [];
  for (const r of sorted) {
    const tier = ranked(r) ? (r.tier || null) : 'Not yet ranked';
    const last = sections[sections.length - 1];
    if (last && last.tier === tier) last.items.push(r);
    else sections.push({ tier, items: [r] });
  }
  return sections;
}
