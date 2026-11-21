// Content of the /key-results page. Static and import-free: this module must
// stay light (no data bundles, no zeros table).
//
// Every item has a stable `id`. The fields `rank`, `tier`, `verification`,
// `novelty`, `arbitrariness` and `importance` come from the two-stage stress
// test of 2026-11-21 (research-checkpoints/key-results-stress-test-2026-11-21/):
// each item was re-run and attacked by a first reviewer and then by an
// independent referee, and the referee's value is used where the two differ.
// `statement` and `statusNote` say what the final verdict supports; the note
// ends with what was corrected. `review` holds the repository paths of the
// item's VERDICT.md and REFEREE.md.
//
// The page shows the ranked view (sorted by rank, grouped by `tier` in the order
// of KEY_RESULT_TIERS) whenever at least one item has a numeric `rank`;
// otherwise it shows the grouped view defined by KEY_RESULT_GROUPS.
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
    meaning: 'A computer-assisted package whose composition has not been externally refereed.',
  },
  obstruction: {
    label: 'negative result / obstruction',
    grade: 'NO-GO',
    meaning: 'A statement that a route or a class of routes stops at a named point.',
  },
  visualisation: {
    label: 'visualisation',
    grade: 'MAP',
    meaning: 'A display. Any certified statement attached to it is named in the item.',
  },
  withdrawn: {
    label: 'withdrawn or wrong',
    grade: 'REFUTED',
    meaning: 'The statement as previously listed does not hold. The item says what was wrong and what remains true.',
  },
});

// Stress test of 2026-11-21: where its files are, the tiers in page order, and
// the two score scales.
export const STRESS_TEST_DATE = '2026-11-21';
export const STRESS_TEST_DIR = 'research-checkpoints/key-results-stress-test-2026-11-21/';
export const STRESS_TEST_REPORT = `${STRESS_TEST_DIR}RANKING.md`;

export const KEY_RESULT_TIERS = Object.freeze([
  { tier: 'holds and matters', meaning: 'Verified, and scored 3 or more for importance.' },
  { tier: 'holds, limited consequence', meaning: 'Verified as a correct statement of modest content.' },
  { tier: 'holds, mainly internal', meaning: 'Verified; the consequence is inside the project.' },
  { tier: 'weakened', meaning: 'A weaker statement than the one first listed holds. Each item gives the weaker statement and what was corrected.' },
  { tier: 'not established', meaning: 'The statement as listed did not hold. Each item says what was wrong.' },
]);

export const KEY_RESULT_SCALES = Object.freeze({
  arbitrariness: '1 = canonical, no choices; 5 = an artefact of the project’s own choices',
  importance: '1 = project-internal; 5 = of interest to specialists',
});

export const KEY_RESULT_GROUPS = Object.freeze([
  { id: 'geometric', heading: 'Geometric program', blurb: 'The bridge kernel, its shear and energy, and the surfaces on which zeta is drawn.' },
  { id: 'structural', heading: 'Structural results on why routes stop', blurb: 'Statements that a class of arguments cannot reach the Riemann Hypothesis, and where each one stops.' },
  { id: 'theorems', heading: 'Theorems and certificates', blurb: 'Identities, finite certificates and formalised statements.' },
  { id: 'lambda', heading: 'De Bruijn-Newman constant', blurb: 'Upper bounds on Λ obtained in the project, each with its status and conditions.' },
  { id: 'reductions', heading: 'Program-level reductions', blurb: 'Programs that restate a family of questions as one statement, with the outcome of each.' },
]);

const CP = 'research-checkpoints/rh-push-2026-11-16/';

// Review fields default to null; every item below sets them from the stress test.
const REVIEW_PENDING = Object.freeze({
  rank: null,
  tier: null,
  verification: null,
  novelty: null,
  arbitrariness: null,
  importance: null,
});

const T_LIMITED = 'holds, limited consequence';
const T_INTERNAL = 'holds, mainly internal';
const T_WEAKENED = 'weakened';
const T_NOT = 'not established';

const RAW = [
  // ── 1. Geometric program ────────────────────────────────────────────────
  {
    id: 'bridge-shear',
    group: 'geometric',
    title: 'Bridge shear and bridge energy',
    rank: 18,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known in a different form',
    arbitrariness: 3,
    importance: 1,
    statement:
      'Four items, none about the location of zeros. (1) An exact paired-coordinate double-integral formula for the de Branges kernel K_a of E_a(z) = Ξ(z + ia) in r = (u+v)/2, s = (v−u)/2, together with the retraction of an earlier split of K_a into a positive "diagonal channel" plus a remainder: the set u = v has measure zero, and the ratio of the retracted channel to the true kernel ranges from 1.4 to 5·10^7 at the points tested and is unbounded with height. (2) The raw shear Φ(u)Φ(v) sinh(a(v−u)) is a rank-2 skew kernel, so it is not positive by itself; the norm identity for such kernels is Lean-checked. (3) W_h(t)/h is a strip-Poisson average of P_a and splits as E₊ − E₋; the identity uses no arithmetic and holds for the Davenport-Heilbronn function. (4) One 2×2 Gram matrix at a = 1/8, nodes i/4 and 1/2 + i/3, is certified positive (eigenvalues 9.456e-8 and 9.081e-4); the same matrix for Davenport-Heilbronn is also positive (2.337e-5 and 2.013e-2). Positivity of K_a for a ≥ 1/2 is classical; for every a > 0 it is equivalent to RH and open.',
    status: 'notes',
    statusNote: 'The identities were replayed numerically at new points with no discrepancy. Their content is known in other variables (Sondow-Dumitrescu; Hermite-Biehler). The Lean file was read, not rebuilt. Corrected 2026-11-21: by de Branges’ theorem a finite Gram test carries no information beyond the pointwise inequality at its nodes, and the one shipped certificate does not distinguish ζ from a function with zeros off the line; the certifier’s verify step reports "invalid" under a different Python minor version because its hash includes the version.',
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
    title: 'Anti-bridge reflection and the bridge energy as a square',
    rank: 17,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known in a different form',
    arbitrariness: 3,
    importance: 1,
    statement:
      'For F(x) = ξ(1/2 + x), L = F′/F, P = [(L_i + L_j)/(x_i + x_j)] and B = [−(L_i − L_j)/(x_i − x_j)]: W(v_b ± J v_c) = b′Pb + c′Pc ± 2 b′Bc, so adding the reflected form removes B and leaves P ⊕ P. The bound −P ≤ B ≤ P at all orders holds exactly when M(s) = L(x)/(2x), s = x², is a Stieltjes function, which is equivalent to RH. The cutoff bridge energy is a sum of squares exactly when RH holds; otherwise it is an indefinite form. Both restate classical criteria (Stieltjes and Grommer; de Branges and Lagarias) and hold for any real even entire function of order at most 1; no Euler product is used. Finite checks: the Hankel matrices H0, H1 of ξ are positive definite through order 100, and for Davenport-Heilbronn the first negative pivot is at order 75. Order 100 reflects roughly the first 50 zeros: a planted off-line quartet at height 150 is first detected at order 99, and one at height 300 is not detected.',
    status: 'obstruction',
    statusNote: 'Proofs in notes; the finite tables are ball-arithmetic computations, reproduced by two independent routes. The lanes’ own verdict is "precise obstruction". Corrected 2026-11-21: a positive square factorisation exists only under RH, so "square factorisation of the bridge energy" overstated the unconditional content; without RH the form has at most one negative direction per off-line pair, and equality with the number of pairs is quoted, not proved.',
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
    rank: 20,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'certificate of a known fact',
    arbitrariness: 4,
    importance: 1,
    statement:
      'An interactive display of ζ, the completed ξ and the de Bruijn-Newman heat family on the plane, the sphere, an elliptic torus (a double cover) and its Klein and annulus quotients. Three interval-arithmetic checks accompany it. (M1) The 1517 zeros of ζ with 0 < Im s < 2000 are simple and on the critical line. (M2) For −1/20 ≤ τ ≤ 1/20 the heat family has exactly one zero, simple and on the line, in the disc of radius 7/20 about 1/2 + 14.134725141734693 i. (M3) A quartic model polynomial with closed-form roots has four simple real roots in disjoint discs for 0 ≤ u ≤ 0.13; this is not a statement about ζ. The symmetry identities used (the involutions on the chart, f∘A = conj f, Laurent-mode decay on zero-free annuli) are classical and hold for functions with zeros off the line. The checks give information only about the zeros tested.',
    status: 'visualisation',
    statusNote: 'The renderer is floating point; M1 to M3 rest on Arb and exact rational arithmetic. Corrected 2026-11-21: the earlier sentences on Klein-quotient invariants and a transport comparison are removed, because the review supports only M1 to M3 and classical identities (the transport law is the Laurent expansion, valid for any holomorphic function); the window |τ| ≤ 0.05 in M2 is about 1/24 of the range in which the zero stays in the disc (−1.2022 < τ < 1.2133), and the certificate’s bound 2.897e-4 is 11.5 times the true perturbation 2.52e-5; the README label "Certified quartet channels at τ = −0.13" refers to the model polynomial.',
    external: [{ href: './observatory/', label: 'Observatory' }],
    repo: [
      { path: 'observatory/README.md', label: 'Observatory documentation' },
      { path: `${CP}geometric-lanes/g-klein-bottle-seam/RESULT.md`, label: 'Klein seam invariants (lane note)' },
      { path: 'rigorous/klein-annulus-coupling-2026-11-14/README.md', label: 'Klein phase transport versus annulus energy' },
      { path: `${CP}geometric-lanes/SYNTHESIS_GEOMETRIC.md`, label: 'Synthesis of the geometric lanes' },
    ],
  },
  {
    id: 'zero-traps',
    group: 'geometric',
    title: 'Zero channels',
    rank: 4,
    tier: T_INTERNAL,
    verification: 'confirmed',
    novelty: 'certificate of a known fact',
    arbitrariness: 2,
    importance: 1,
    statement:
      'An Arb interval computation certifies that ζ has exactly 1517 zeros with 0 < Im s < 2000, all simple and on the critical line (3034 counting conjugates in the box [−1, 2] × [−2000, 2000]). N(2000) = 1517 is a known count; the certificate re-derives it with one symmetric disc per zero and one rectangle. The same result follows from two of Arb’s own library routines in about 3 seconds, and the height is nine orders of magnitude below the Platt-Trudgian verification. The moving-disc channels are separate statements: four discs of radius 1/100 for a quartic model polynomial on −13/100 ≤ τ ≤ 0 (not ζ), and one fixed disc of radius 7/20 about the first zero for the theta heat family on −1/20 ≤ τ ≤ 1/20. The lane report of 100 moving disc chains for −0.1 ≤ τ ≤ 0.5 was not part of the review.',
    status: 'interval',
    statusNote: 'Confirmed by four routes; every rigorous one relies on Arb’s enclosure of ζ, so the result is conditional on Arb. Corrected 2026-11-21: the earlier wording did not say that the count is known and that the library returns it directly; "3034 zeros below height 2000" should read 1517 with 0 < Im s < 2000; the draft’s radius rule is wrong for disc 1517 (recorded 0.3555, the rule gives 0.5067), which does not affect the result.',
    external: [{ href: './observatory/', label: 'Observatory (Channels workspace)' }],
    repo: [
      { path: 'research/rh/zero-channels/README.md', label: 'Zero channels, coupling and Newton guidance' },
      { path: `${CP}geometric-lanes/g-zero-channels/RESULT.md`, label: 'Lane report: 100 channels (not reviewed)' },
    ],
  },
  {
    id: 'twistor',
    group: 'geometric',
    title: 'Twistor pages (illustration) and a bound for a truncated Hankel operator',
    rank: 11,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'minor variation',
    arbitrariness: 4,
    importance: 2,
    statement:
      'The twistor pages are illustrations by analogy; no twistor duality for ζ is established. The established content is an interval-arithmetic bound for Suzuki’s truncated Hankel operator built from ξ(z−a)/ξ(z+a): ‖H_{1/4,L}‖ ≤ 49999/50000 for every 1 < L ≤ 3/2, and ‖H_{a,L}‖ ≤ 2^(−a) for 0 < a ≤ 1 and L ≤ 1.02259. For L ≤ 3/2 the operator depends only on the gamma factor and the Euler factor at 2, so the bound cannot depend on any zero. Numerically the Davenport-Heilbronn function satisfies the same inequality at L = 3/2 (norm 0.880) and exceeds 1 only from L about 7 (1.049 at L = 8). The operator built from the absolute value of the kernel at a = 1/4, L = 3/2 has norm greater than 1.049. The wide bridge R_{3/2}(w) = X(w − 3/2)/X(w + 3/2), X(w) = ξ(1/2 + w), with a chosen rational factor is the classical width-3/2 ξ-ratio intertwiner in other language; it is a contraction for Re w > 0.',
    status: 'interval',
    statusNote: 'The certificate uses mpmath interval arithmetic and was rebuilt independently in floating point; it was not redone in Arb. A Lean file contains a diagram chase and was not compiled in the review. Corrected 2026-11-21: the title claimed a duality; the certified window gives no information on zeros; two sentences on the /twistor page (|χ(s)| = 1 exactly on σ = 1/2, and a norm-preserving intertwiner) were false and are corrected there.',
    links: [
      { to: '/twistor', label: 'Twistor duality (illustration)' },
      { to: '/viz-twistor-dual-intertwiner', label: 'Twistor dual intertwiner view' },
    ],
    repo: [{ path: 'research/twistor-bridge-2026-10-03/README.md', label: 'Twistor bridge package and signed certificate' }],
  },

  // ── 2. Structural results ───────────────────────────────────────────────
  {
    id: 'flow-blindness',
    group: 'structural',
    title: 'Flow-blindness no-go',
    rank: 15,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known in a different form',
    arbitrariness: 3,
    importance: 1,
    statement:
      'If a set of conditions on the profile holds for the de Bruijn-Newman profile Φ and is preserved under multiplication by exp(−εu²) for ε > 0, it cannot imply that all zeros of the cosine transform are real. This is the theorem Λ ≥ 0 (Rodgers-Tao 2020) read contrapositively; for classes closed under every ε, Newman’s 1976 result suffices. It does not follow that arithmetic input is required: the non-arithmetic profile exp(−cosh u − 1.5u²) is even, positive, log-concave and rapidly decaying, and its transform has the zero 11.635 + 1.283 i. The properties for which closure is proved (evenness, positivity, log-concavity, decay bounds) were already known to be insufficient, and the hypotheses the project’s own programme uses (kernel positivity, Weil positivity) are not preserved by the damping, so the statement does not apply to them.',
    status: 'notes',
    statusNote: 'The Lean file is an abstract skeleton: H is an arbitrary family, and Λ ≥ 0, the de Bruijn-Newman characterisation and the flow identity are hypotheses. It was read, not rebuilt, in the review. Corrected 2026-11-21: withdrawn are "a proof needs arithmetic input", total positivity as a member of the class (Φ itself has a negative 5×5 Toeplitz minor, −1.847e-9), kernel positivity as flow-invariant, and the T3 corollary.',
    links: [
      { to: '/flow-blindness-no-go', label: 'Flow-blindness no-go' },
      { to: '/formalization-status', label: 'Formalization status' },
    ],
    repo: [{ path: 'formalization/lean-aristotle/flow_blindness/RequestProject/Main.lean', label: 'Lean file (abstract skeleton)' }],
  },
  {
    id: 'obstruction-map',
    group: 'structural',
    title: 'Obstruction map',
    rank: 12,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known in a different form',
    arbitrariness: 4,
    importance: 2,
    statement:
      'A table of attempted routes to RH (234 rows and 220 lane records in the copy reviewed), each with the step where it stops and, where one exists, an explicit function with zeros off the line that satisfies the hypotheses the route uses (Davenport-Heilbronn, the backward heat flow of ξ, ζ(s+a)ζ(s−a), sign twists, prime-deletion products and others). No route produced an inequality that locates zeros. All 220 lanes score 0 of 4 on the requirements R1 to R4; by the scoring rule any restatement or control-passing lane scores 0, so the score does not rank lanes. The common stopping condition was written down after the first 123 rows and then used as the filter for the remaining 111. The table is a record of this search. It is not a theorem and not a proof that other routes fail.',
    status: 'obstruction',
    statusNote: 'The numerical facts about the control functions reproduce (18 recomputed). No row verdict was replayed; 132 lanes had one internal referee and 10 none; 21 sub-claims marked proved were later broken by internal passes. The copy in this repository is an earlier version (118 rows by its README, 196 lane records). Corrected 2026-11-21: the row count; the panel of controls is not fixed (it grew from 9 to 24 tabulated controls during the campaign); no control has the functional equation, an Euler product and an off-line zero together; one part of the stopping condition depends on the unrefereed zero-free half-plane Re s > 7/8.',
    links: [
      { to: '/rh-research-modules', label: 'RH research modules' },
      { to: '/what-we-know', label: 'What we know' },
      { to: '/no-gos', label: 'No-go theorems (list)' },
    ],
    repo: [
      { path: `${CP}fleet-lanes/OBSTRUCTION_MAP.md`, label: 'Obstruction map (earlier copy)' },
      { path: `${CP}campaign/METRIC.md`, label: 'Requirements R1 to R4' },
      { path: `${CP}campaign/SCOREBOARD.md`, label: 'Campaign scoreboard' },
    ],
  },
  {
    id: 't3-zero-free-strip',
    group: 'structural',
    title: 'Twin-ladder T3 is a zero-free strip statement',
    rank: 13,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known',
    arbitrariness: 2,
    importance: 1,
    statement:
      'With the de Bruijn profile Φ, E_a(z) = Ξ(z + ia) = ξ(1/2 + a − iz) by angle addition, and T3(a) is the de Branges kernel condition for E_a. T3(a) holds if ζ has no zero with Re s > 1/2 + a. The converse at a fixed a fails in one configuration, off-strip zeros at one ordinate placed mirror-symmetrically about height a, which is not excluded unconditionally. T3(a) for every a > 0 is equivalent to RH. This is known: the argument is that of Lagarias 2005 (Lemmas 2.1 and 6.1, stated there for a ≥ 1/2 and under RH). The statement holds verbatim for the Davenport-Heilbronn function, whose kernel changes sign between a = 0.3085 and 0.3086, at its off-line zero (b = 0.30852). T3 restates the zero-free strip; it is not a mechanism for proving one.',
    status: 'notes',
    statusNote: 'A restatement of known theory; sketch in notes; no Lean and no interval certificate. Corrected 2026-11-21: "if and only if" at a fixed a has the exception above; the quoted 1e-30 is the rounding error of the angle-addition formula at 40 digits and involves neither Φ nor ζ; the repository’s channel numerics are at shift a/2.',
    links: [
      { to: '/concept/t3-strip', label: 'Concept: T3 as a zero-free strip' },
      { to: '/project-dag', label: 'Project attempts DAG' },
      { to: '/shift-bridge-positivity', label: 'Shift-bridge positivity' },
    ],
  },
  {
    id: 'pole-riesz',
    group: 'structural',
    title: 'Riesz-type truncations of zeta have zeros off the critical line',
    rank: 7,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'minor variation',
    arbitrariness: 3,
    importance: 2,
    statement:
      'For log-Riesz weights (1 − log n/log(N+1))^k, the functional-equation-symmetrised sections of ζ of order k = 2 have certified zeros off the critical line at height about 8.55·10^11 for N = 630, 1000, 1250, 1500 and 4000 (N = 1250: Re s = 0.541482496857657). The Liouville-twisted sum at s = 1/2 is positive at N = 36, 291, 2183, 16237 and negative at N = 37, 292, 2184, 16238 for k = 1, 2, 3, 4. An argument in the notes extends the failure to every integer k ≥ 1 and all N ≥ N₀(k), with N₀(k) not explicit. The mechanism is classical (Turán, Haselgrove, Montgomery): at the Liouville point of the prime torus the limit function is ζ(2s)/ζ(s), which is negative on (1/2, 1) and vanishes at s = 1. It applies to every unimodular completely multiplicative twist and to sharp, Cesàro and smooth cut-offs, so it is not specific to ζ and says nothing about zeros of ζ.',
    status: 'interval',
    statusNote: 'The listed instances are certified by interval Newton in Arb and reproduced by three implementations. The general statement is unrefereed. Lean covers only Σ λ(n) n^(−s) = ζ(2s)/ζ(s), its limit 0 at s = 1 and its sign on (1/2, 1). Corrected 2026-11-21: the earlier title read as a property of ζ’s own truncations; the pole-correction term of the sections plays no role (the zeros are unchanged to 15 digits without it); the thresholds shift by ±1 with the cut convention; "N = 284 is the first failing stage" came from an uncertified search.',
    repo: [
      { path: `${CP}fleet-lanes/box-riesz-order2/RESULT.md`, label: 'Riesz sections, all orders' },
      { path: `${CP}fleet-lanes/lean-harmonic-rh-push/07-liouville-limit/LiouvilleLimitProved.lean`, label: 'Lean file (limit function)' },
    ],
  },
  {
    id: 'route-i-ln2',
    group: 'structural',
    title: 'Route I: one step of the archimedean argument is not available past ln 2',
    rank: 6,
    tier: T_WEAKENED,
    verification: 'partly confirmed',
    novelty: 'not found in the literature',
    arbitrariness: 3,
    importance: 2,
    statement:
      'In the transcription of the Connes-Consani archimedean argument to S = {∞, 2}, the error functional has a logarithmic singularity at ρ = 2^k that carries the fraction 1 − 2^(−k) of the singularity of the trace remainder (proved, elementary; one half at ρ = 2, and 1 − p^(−k) for a prime p). Numerically, for support width 2a > ln 2 the composite E_S∘Q grows linearly along the frequencies 2πj/ln 2 (at a = 0.5, j = 32: about +155 at resonance and −265 at anti-resonance with converged values), so the sufficient condition E∘Q ≤ c |ĝ(0)|² used in the archimedean case is not available. This concerns that one step of that argument. Along the tested directions the excess is 1e-4 to 5e-3 of the Weil form, and nothing follows about Weil positivity past ln 2.',
    status: 'obstruction',
    statusNote: 'The cusp fraction is proved in notes and checked to 11 digits. The growth is numerical, with the corr term truncated below the test frequency. Corrected 2026-11-21: the recorded top eigenvalue was computed with the window [e^−16, 1] in place of (0, 1]; the converged values are λ_S(0) = 0.9999974 (1 − λ² = 5.18e-6, not 5.38e-5) and corr(ln 2) = 2.776 (not 1.458), and the absolute E_S∘Q values in the record are too high by about 18 to 22; the title "Route I stops at ln 2" said more than is established. Quantities downstream of 1/(1 − λ²) were not rechecked.',
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
    title: 'The PR-48 residual quantity is the Weil explicit-formula form on one-sided tests',
    rank: 16,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known in a different form',
    arbitrariness: 3,
    importance: 1,
    statement:
      'On finite sums v(t) = Σ b_j e^(−x_j t) with rates x_j > 1/2, the PR-48 residual quantity of eq. (21) equals Σ b_i b̄_j (L(x_i) + L(x_j))/(x_i + x_j) with L(x) = ξ′/ξ(1/2 + x), which is the zero side of the Weil explicit formula for the one-sided test (proved in notes; checked in Arb, absolute difference 1e-34 to 1e-49). Lean proves one statement: for Mathlib’s ξ, non-negativity of every Schur defect is equivalent to positive semidefiniteness of every real-node Pick matrix with nodes above 1/2. The link to RH is in Lean only with two analytic statements as hypotheses. A version with a margin θ < 1 is refuted on the full exponential class only. The identity is the explicit formula and holds equally for L(s, χ₄). With a planted off-line zero at heights 10, 17.5, 23, 31.5, 45, the finite-order test first detects it at orders 7, 12, 18, 29, 43 in one node family; in the other two families tested the zero at height 45 is not detected through order 48.',
    status: 'notes',
    statusNote: 'Lean: 7 files, standard axioms, no sorry, recompiled in the review. The identity with the explicit formula and the equivalence with RH are in notes with internal review only. Corrected 2026-11-21: the label "Lean-checked" was attached to the identity with the Weil functional, which is not in Lean; the status is now "proved in the repository’s notes".',
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
    rank: 10,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known in a different form',
    arbitrariness: 4,
    importance: 2,
    statement:
      'For K ≤ 12, every real-node Pick matrix of ξ′/ξ(1/2 + x) is positive semidefinite (positive definite for K ≤ 7 as written; for K = 8 to 12 only after a fix to the auxiliary function that has not been applied). This follows from zero verification to 3·10^12 (Platt-Trudgian) by an Arb certificate and gives no new information on zeros. The number 12 is where the run stopped: 13 and 14 pass in one replay of the same script, and K = 12 fails if the verified height is lowered to 3·10^10. At the centre x = 0 the Taylor (jet) matrix of the kernel is congruent to 2 H0 ⊕ 2 H1 for the two Hankel matrices of the Grommer and Stieltjes criteria, and the first order at which that jet matrix is not positive definite is min(2 K0 − 1, 2 K1). For Davenport-Heilbronn, H0 has negative pivots at 75 and 110 and H1 at 75 and 109, so the jet matrix first fails at order 149. For Pick matrices the first failing order depends on the node set: 149 for nodes near the centre, 153 to 164 for the other sets tested, and none through 170 for the nodes 1, 2, …, 170. 48 of 48 random 12-node Pick matrices of Davenport-Heilbronn are positive definite.',
    status: 'interval',
    statusNote: 'The Davenport-Heilbronn pivots are confirmed by an independent algorithm. The K-node certificate was replayed only through the project’s own script, and its lemmas have had one internal referee pass. The jet-matrix identity is Lean-checked for an arbitrary real sequence; ξ does not appear in the Lean file. Corrected 2026-11-21: the failure orders 149, 150, 218, 219 were stated for Pick matrices in general; they hold for the jet matrix and for node sets near the centre.',
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
    rank: 3,
    tier: T_LIMITED,
    verification: 'confirmed in a weaker form',
    novelty: 'formalisation of a known fact',
    arbitrariness: 3,
    importance: 2,
    statement:
      'Lean 4 proofs of two statements. (1) The multivariate Lee-Yang circle theorem for pair models in occupation form with symmetric couplings K ≥ 0: 2 theorems, 407 lines, by Asano contraction. (2) Parts (i) to (iii) of the stage theorem, 6 theorems, 292 lines: for couplings K_pq ≥ 0 on the primes dividing a squarefree M with Σ_q K_pq = log p, the Dirichlet polynomial Z_K(s) = Σ_{n|M} w_K(n) n^(−s) satisfies Z_K(1−s) = M^(s−1/2) Z_K(s) and has all its zeros on Re s = 1/2. The circle theorem is classical; no other formalisation was found in a short search. The stage theorem uses only the moduli of the activities and K ≥ 0: it holds equally for unimodular twists and non-prime energies, the line Re s = 1/2 is placed by the n linear conditions on K, and for distinct primes admissible K need n ≥ 3 and P_max² ≤ M. It gives no information about zeros of ζ.',
    status: 'lean',
    statusNote: 'Both files compile with the standard axioms and no sorry. In the repository file the stage theorems take the circle theorem as a hypothesis; the reviewers compiled joined files in which it is discharged, and those are not in this repository. Parts (iv) to (vi) of the stage theorem are in notes with one internal referee pass. Corrected 2026-11-21: the figure "44 theorems, 2576 lines" quoted for this work is the total of an eight-file batch; the other six files (36 theorems, 1877 lines) are on other topics.',
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
    title: 'Interval certificate for pole-free Weil positivity, support width up to ln 3',
    rank: 1,
    tier: T_LIMITED,
    verification: 'confirmed',
    novelty: 'certificate of a known fact',
    arbitrariness: 2,
    importance: 2,
    statement:
      'For every h in L²(−a, a) with 2a ≤ ln 3 and ĥ(±i/2) = 0, Weil’s quadratic form with the archimedean term and the prime 2 satisfies W(h) ≥ 8.2045e-4 ‖h‖² (9.0435e-4 from a second run with a longer truncation; two non-rigorous computations put the infimum near 9.44e-4). This is the form on the pole-free subspace. The full form on the same window, whose smallest eigenvalue is about 5.5e-8, is not covered. The pole-free form is also positive with the prime term removed (margin 0.0825), so the statement is a bound on the size of the p = 2 term.',
    status: 'interval',
    statusNote: 'Arb ball arithmetic at 256 bits (the Legendre-Galerkin certificate ARB-LEGE): one rigorous implementation, re-run and compared with two independent floating-point computations. The linear-programming Toeplitz/Krein certificate reaches 2a ≤ 0.96 only. Corrected 2026-11-21: the title named the linear-programming certificate; the note that no comparison with the literature had been made was out of date, since the full form was observed numerically by Connes-Consani (arXiv:2106.01715) and an unrefereed preprint (Zhu, arXiv:2608.24827) claims it certified at 2a = 1.6; the remark that the range is implied by the verified zeros rests on an internal theorem that was not rechecked.',
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
    rank: 2,
    tier: T_LIMITED,
    verification: 'confirmed',
    novelty: 'known in a different form',
    arbitrariness: 2,
    importance: 2,
    statement:
      'For S = {∞, 2} and cutoff scale 1, Tr(ϑ(f) P P̂_S P) = W_∞(f) + W_2(f) + D_S(f), with P̂_S = F_S⁻¹ P F_S. This is the published semilocal trace formula (Connes-Marcolli, Theorem 2.36; restated in arXiv:2611.13129, Theorem 8.1) with the Connes-Consani split into a positive compressed trace and a remainder. The part specific to this project is the explicit remainder kernel δ_S, which has logarithmic singularities at ρ = 2^k with slope 2^(k/2)/2 per log₂(1/ε). The left side is a positive functional; its multiplier is about 0.065 at t = 0. The identity gives no positivity beyond support width ln 2.',
    status: 'notes',
    statusNote: 'Derivation in notes, with the trace-class input taken from the literature; checked numerically end to end for two test functions (relative agreement 1e-7 and 1e-6). No interval certificate and no Lean. Corrected 2026-11-21: the record module defined P̂_S = F_S P_1 F_S, for which the trace diverges; the figures 96.7% and 99.71% and the sentence "Weil positivity below ln 3 is D_S ≤ L_S" restate W = L_S − D_S and are not separate results; the third digit of 0.0650 is not established.',
    links: [
      { to: '/viz-imp96103-route-i-remainder-resonance', label: 'Route I remainder resonance' },
      { to: '/rh-novel-routes-roadmap', label: 'Routes A-G roadmap (Route I)' },
    ],
  },
  {
    id: 'c-glob',
    group: 'theorems',
    title: 'Closed form for c_glob',
    rank: 5,
    tier: T_INTERNAL,
    verification: 'confirmed',
    novelty: 'not found in the literature',
    arbitrariness: 3,
    importance: 1,
    statement:
      'For points on a line moving by dx_k/ds = −2 Σ_{j≠k} 1/(x_k − x_j), take an adjacent pair with gap g and assume that every adjacent gap of the configuration is at least g (the minimal-gap hypothesis). With d₁ the distance from the pair to the nearest other point and ρ = g/d₁, the ratio ρ is decreasing at that instant whenever ρ < c_half = 0.8980208880762338, the unique root in (0, 1) of 4 + 4ρ − 4/ρ − 4/(ρ+1) − 2[ψ(1 + 2/ρ) − ψ(1 + 1/ρ)], where ψ is the digamma function. For each ρ in (c_half, 1) some finite configuration satisfying the hypothesis has ρ increasing. Without the minimal-gap hypothesis the infimum is 0; with the hypothesis "other gaps ≥ κg" the threshold moves from 0.748 (κ = 0.25) to 0.932 (κ → ∞). The statement is a sign law at one instant, has no arithmetic input and changes no bound on Λ.',
    status: 'notes',
    statusNote: 'Confirmed by three code paths, one without the digamma formula (agreement 1.9e-12). Persistence along the flow needs the pair to remain the smallest gap and is open (the R1 transfer). Corrected 2026-11-21: the minimal-gap hypothesis was omitted, and the statement is false without it; "closed form" means the root of an explicit digamma equation; transcendence of the constant is not proved.',
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
    rank: 8,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'minor variation',
    arbitrariness: 4,
    importance: 2,
    statement:
      'Λ ≤ 0.116091488672439 holds if three inputs that are not established hold. (H1) ζ has no zero with Re s > 7/8 (openai/math family 003; a Lean proof exists; not refereed). (H2) The analytic statements of D. J. Raymond’s decreasing-barrier chain (Zenodo 10.5281/zenodo.22867547; not refereed). (H4) This project’s own 468 floor entries and 59 kernel rows, which are internal and partly uncertified: 89 floor entries, used on 11,304 of 59,439 substeps, rest on a measured allowance of 0.0023 and an unreviewed lemma. It also uses (H3), the Platt-Trudgian verification of RH to height 3000175332800, which is refereed. With H1, H2 and H3 only, the value is 0.118505710922701. The arithmetic from the tables to both numbers was re-derived by three code paths; H1, H2 and H4 were not checked. The digits beyond "about 0.116" are an output of tuning. D. J. Raymond has deposited 0.116398 (Zenodo 23272725, 10 October 2026) by the same method and 0.107965 (Zenodo 23752103) by a re-engineered version, under the same half-plane; both are unrefereed.',
    status: 'conditional',
    statusNote: 'Conditional on H1, H2 and H4, and on H3, which is refereed. The Lean theorem takes the head wall, first contact, contact exclusion and the validity of every table entry as hypotheses. Corrected 2026-11-21: the earlier wording was "two unrefereed results"; that count fits 0.118506, and 0.116091 needs the third, internal block H4. Lowering the 89 partly uncertified floors by the allowance 0.0023 breaks the stored schedule (62 admissibility failures), so the value would have to be re-run.',
    links: [{ to: '/lambda-0116091', label: 'Λ ≤ 0.116091' }],
    repo: [{ path: 'papers/lambda-qrh-0.116091/DEPENDENCIES.md', label: 'Dependencies of the draft' }],
  },
  {
    id: 'y-transfer-01758',
    group: 'lambda',
    title: 'Candidate Λ ≤ 0.1758354 (y-transfer with an excision budget)',
    rank: 9,
    tier: T_WEAKENED,
    verification: 'partly confirmed',
    novelty: 'minor variation',
    arbitrariness: 4,
    importance: 2,
    statement:
      'An unrefereed computer-assisted candidate. Instantiating Polymath15 Theorem 1.2 at t₀ = 1583/10000, y₀² = 87677/2500000, X = 6000000185827 with an optimised 287-term mollifier gives Λ ≤ 879177/5000000 = 0.1758354, conditional on a barrier certificate inherited from the 0.1787854 package, window-freeze and tail lemmas written for another parameter row, a native-binding lemma, the prose y-transfer Theorems B and C, and four Arb verifiers. The review reproduced the binding lane minima with independent code (0.001872347 at N = 690988) and the assembled margin 1.622504e-3. It did not replay the lane sweep over 5,309,013 windows, the full y-Dini run, the barrier, the tail lemma or the native-binding lemma. Termwise monotonicity fails, as the proof note says, with a realised defect of about 1e-11 against the certified budget B ≤ 2.4958e-4. The certificate fails at y₀ → 0.186, t₀ → 0.1580 or N → 680000; 0.1758354 is where this mollifier’s triangle bound reaches zero at x = X.',
    status: 'candidate',
    statusNote: 'Partly confirmed; not refereed. Lean covers three abstract finite-sum inequalities and one calculus lemma; they are not instantiated from the certificate, and the calculus lemma as stated assumes more than the certificate supplies. Corrected 2026-11-21: the earlier wording presented the value as a bound and listed the y-transfer reduction and Lemma B3 as Lean-checked without this limit; the budget B exceeds the realised defect by a factor of about 2e7.',
    links: [
      { to: '/lambda-01758354-candidate', label: 'Candidate Λ ≤ 0.1758354' },
      { to: '/lambda-bounds', label: 'Λ bounds ledger' },
    ],
  },
  {
    id: 'pt-floor',
    group: 'lambda',
    title: 'What binds Λ ≤ 0.2',
    rank: 19,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known',
    arbitrariness: 4,
    importance: 1,
    statement:
      'In the Polymath15 criterion (Theorem 1.2 with the Euler-2 Lemma 10.1 and the target 0.03), the admissible Λ is a function of the verified zero height: Table 1 gives 0.20 at X = 5·10^12 and 0.19 at X = 2·10^13. Re-certifying the barrier, which is a pass/fail check on a compact region, does not change the value. This is printed in Polymath15, section 10. The stronger form, that more verified height is the only lever, does not hold: at the fixed height 3·10^12 a main-term calculation of the corner test passes at 0.197 with the Euler-2 mollifier, 0.183 with primes 2, 3, 5, 0.181 with primes up to 7 and 0.180 with primes up to 11. These figures omit the error terms and the barrier run and are not bounds on Λ. The stronger mollifier is the one used in Polymath15, section 8.5.',
    status: 'numerical',
    statusNote: 'A float64 main-term calculation by two independent implementations (agreement 3e-4); no proof, certificate or Lean statement. Corrected 2026-11-21: "only more verified height lowers the bound" is withdrawn, and with it the classification of sum-of-squares, Carleman and Putinar methods as unable to move the value; the first review’s remark that Lemma 10.1 was reproduced within 5% is withdrawn (the Table 1 column is matched to ±25%, depending on the reading); in the audit module "e_C = 0.955" is the mass of Polymath15 eq. (88), and the "10×" gap is 3.3× in height.',
    links: [
      { to: '/pt-floor-audit', label: 'What binds Λ ≤ 0.2 (audit)' },
      { to: '/verified-height-lever', label: 'Verified zero height as a lever' },
    ],
  },
  {
    id: 'gaussian-proxy',
    group: 'lambda',
    title: 'Gaussian convolution of H_0 is the de Bruijn flow at negative time',
    rank: 14,
    tier: T_WEAKENED,
    verification: 'confirmed in a weaker form',
    novelty: 'known',
    arbitrariness: 2,
    importance: 1,
    statement:
      'Gaussian convolution of H_0 with variance 2τ equals the de Bruijn function H_{−τ}. This is the Polymath15 heat-kernel formula (section 4) read at t < 0. The proxy implemented on the site averages the Riemann-Siegel Z function, not Ξ; its real zeros correspond one-to-one with those of the exact flow, shifted by about 1.45 τ in γ in the tested range. First pair merger: t = −1.877909 for the exact flow and −1.8766 for the proxy. Window counts of the proxy match the exact flow only when no shifted zero crosses a window edge: on γ in [10, 52] they agree at every τ tested, and on [10, 80] the proxy gives 7, 7, 5 against the exact 6, 6, 4 at τ = 2, 3, 5. Monotonicity of a window count (de Bruijn, Theorem 13, with a jet lemma) needs the hypothesis that no zero crosses the window ends.',
    status: 'numerical',
    statusNote: 'The identity is classical; the proxy counts and merger times are numerical. The earlier reading of the merger as a numerical artifact remains withdrawn. Corrected 2026-11-21: "exact" applies to convolution of H_0, not to the implemented Z-based proxy; the record’s headline merger time −1.8837 is off by 0.0058.',
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
    rank: 22,
    tier: T_NOT,
    verification: 'refuted',
    novelty: 'known in a different form',
    arbitrariness: 5,
    importance: 1,
    statement:
      'Not established. The statement ‖V_{a,Φ}‖ ≤ 1 for every a > 0 is false: in the repository’s normalisation it holds for a ≤ a* and fails for a ≥ 31.6214, with 31.6213 < a* < 31.6214. It is not equivalent to positivity of the shifted kernel K_a in either direction: ‖V‖ scales as c² under Φ → cΦ, and K_a ≥ 0 is scale-invariant. It does not separate ζ from the Davenport-Heilbronn kernel, for which ‖V‖ is 0.012 to 0.074 on the band of a where its K_a is indefinite. The conjectures of sections 15 to 27 of the twin-ladder draft are therefore not reduced to it; at least seven of them (15.1, 16.4, 16.6, 17.3, 18.1, 25.2, 25.3) are separate phrasings of the classical Hermite-Biehler form of RH, K_a ≥ 0 for every a > 0. The decomposition K_a = K_diag + shear in the app data is false: the complement of the shear is not positive semidefinite (value −9.04e-8 at z = 26.5 + 5i, a = 0.5).',
    status: 'withdrawn',
    statusNote: 'Refuted as worded. The bracket for a* rests on the lane’s Arb certificate, which was not rerun, and on two floating-point and mpmath replays; "holds for a ≤ a*" uses Φ ≥ 0. The earlier figure of norms 5000 times below 1 is the size of Φ² and is not evidence. The normalised replacement ‖R‖ ≤ 1 is a restatement of K_a ≥ 0 by the repository’s own account; the review did not re-derive it. Corrected 2026-11-21: the item moves from "obstruction" to "withdrawn or wrong"; the pages /collapse-chain and /volterra-bound, which stated that the program is RH-equivalent to ‖V‖ ≤ 1, now carry a correction notice.',
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
    title: 'Catalan signed ladder: two integral identities',
    rank: 21,
    tier: T_NOT,
    verification: 'partly confirmed',
    novelty: 'known in a different form',
    arbitrariness: 4,
    importance: 1,
    statement:
      'Two identities over the unit square are correct: ∫∫ (2x−1)(2y−1)/(1−xy) dx dy = 5ζ(2) − 8 and ∫∫ (2x−1)(2y−1)/(1+x²y²) dx dy = G − π + 2 ln 2 + π²/12, with G Catalan’s constant. The two claims built on them are false. The count "period dimension 2 against 5" is not an obstruction: 5 is an upper bound on the dimension of a span, the same device on the conductor-3 kernel 1/(1+xy+x²y²) also produces five generators, and L(2, χ₋₃) is proved irrational (Calegari-Dimitrov-Tang). The π term is not forced: with the page’s own kernel and P₀(x)P₂(y) the integral is G − 3 + 3 ln 2, and Zudilin’s 2003 recurrence gives rational forms u_n G − v_n in 1 and G alone. Those known forms do not prove irrationality because they decay at rate 2.406 per step against denominators growing at about 6.77 (proved bound 8.77). Irrationality of G is open in the refereed literature.',
    status: 'withdrawn',
    statusNote: 'Withdrawn as an obstruction. The identities were confirmed by 60-digit quadrature and by hand; they are routine. Corrected 2026-11-21: "forced π-column" and "period-dimension obstruction" are withdrawn; the triage table of the page lists L(2, χ₋₃) as dimension at most 3, which its own device contradicts. An external Lean-formalised claim about G (2026-10-06) is not peer reviewed and is not a result of this project.',
    links: [
      { to: '/catalan-signed-ladder', label: 'Catalan signed ladder' },
      { to: '/irrationality-pipeline', label: 'Irrationality pipeline' },
    ],
  },
];

export const KEY_RESULTS = Object.freeze(
  RAW.map((r) => Object.freeze({
    links: [],
    external: [],
    repo: [],
    ...REVIEW_PENDING,
    ...r,
    review: Object.freeze({
      verdict: `${STRESS_TEST_DIR}${r.id}/VERDICT.md`,
      referee: `${STRESS_TEST_DIR}${r.id}/REFEREE.md`,
    }),
  })),
);

export const KEY_RESULTS_COUNT = KEY_RESULTS.length;

// True when at least one item carries a rank.
export function hasRanking(items = KEY_RESULTS) {
  return items.some((r) => typeof r.rank === 'number' && Number.isFinite(r.rank));
}

// Ranked view: items sorted by rank (unranked last, in file order), cut into
// consecutive runs that share a tier. With `withEmptyTiers`, every tier of
// KEY_RESULT_TIERS that has no item is added as a section with an empty item
// list and the sections are put in tier order, so the page can say that a tier
// is empty.
export function rankedSections(items = KEY_RESULTS, { withEmptyTiers = false } = {}) {
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
  if (!withEmptyTiers) return sections;
  const order = KEY_RESULT_TIERS.map((t) => t.tier);
  const pos = (s) => { const i = order.indexOf(s.tier); return i < 0 ? order.length : i; };
  const present = new Set(sections.map((s) => s.tier));
  const all = [...sections, ...order.filter((t) => !present.has(t)).map((t) => ({ tier: t, items: [] }))];
  return all
    .map((s, i) => ({ s, i }))
    .sort((a, b) => pos(a.s) - pos(b.s) || a.i - b.i)
    .map((x) => x.s);
}
