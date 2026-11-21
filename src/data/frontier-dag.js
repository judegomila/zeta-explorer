/**
 * frontier-dag — the live dependency graph of named open objects on the
 * current frontier (2026-09-14). Rendered by /frontier-dag.
 *
 * GRADE: documentation only. Import-light; no heavy bundle; no new
 * computation. Every node restates a verdict already recorded in the named
 * source module or ledger, with its grade verbatim. Nothing here promotes a
 * bound; NO QED. The historical insight DAG (how the ideas were found) is a
 * separate, unmodified page at /rh-dag.
 *
 * Sources: imp-95214 (G4 tier-2 chirp), imp-95213/95238/95245 (window-1
 * certifier + run decision), imp-95169/95170/95171 (copositive weld
 * dissolution / strip cover), imp-95217 (lambda_max(rho) measurement,
 * allowance 1.8149072), imp-95008 + PermutationArchitecturePage ((H4) family
 * + 0.14 contract), imp-95140 (y-thaw obligation ledger O1-O6),
 * ARISTOTLE_TARGETS.md waves 5-6 (job38 sharp_mass_monotonicity, (ZR) under
 * l2_detection_modulus), imp-95218 (Route VII cost curve), PT-floor audit.
 */

// kind: 'open-object' | 'result' | 'candidate' | 'contract'
// statusKind drives the node color on /frontier-dag only; `status` is the
// honest grade text and is authoritative.
export const NODES = [
  // ── Gate-2 / the 0.14 contract ─────────────────────────────────────────
  {
    id: 'copositive-strip',
    name: 'Copositive strip certificate',
    kind: 'open-object',
    status: 'in progress — Lemma WD reduction rigorous (mass ratios eliminated exactly, 12-D → 9-D); top sub-band [0.23208119…, 0.23209) closed; full-band cover relaunched on a long budget',
    statusKind: 'progress',
    route: null,
    source: 'imp-95169 / imp-95170 / imp-95171',
    closesIf:
      'Finishes the weld-ladder floor: strict copositivity of 2D − G over the strip band bounds λ_max(M) < 1 for every nonnegative mass profile at once, closing the multi-packet witness class. The load then lands wholly on the (H4) identification residual — now measured against the enlarged allowance 1.8149072.',
  },
  {
    id: 'weld-ladder-floor',
    name: 'Weld-ladder floor (multi-packet witness class)',
    kind: 'open-object',
    status: 'open — reduces exactly to strict copositivity of 2·blockdiag(G_b) − G on the strip band (Lemma WD); the convex operator-inequality route is refuted (Theorem WP)',
    statusKind: 'open',
    route: null,
    source: 'imp-95169',
    closesIf:
      'Closing the floor removes the last witness-class obstruction under the weld ladder and hands the whole burden to the (H4) identification residual.',
  },
  {
    id: 'h4-identification-residual',
    name: '(H4) identification residual — imp-95008 weld constants',
    kind: 'open-object',
    status: 'open — conditional transfer measured at 21 seam points: |C_E,17| < 0.27968… holds there PROVIDED C·√K·‖f‖ < 1.8149072 (von Neumann allowance; λ_max(ρ) = 0.6231344958476320 measured)',
    statusKind: 'open',
    route: '/permutation-architecture',
    source: 'imp-95217 / imp-95008',
    closesIf:
      'Identifying the weld constants under the measured allowance 1.8149072 transfers the seam-point margins to the strict correlated-center target, feeding (H4) directly. Honest caveat: structurally the same PCC wall — soft linear algebra creates no arithmetic input (flow-blindness pattern).',
  },
  {
    id: 'g4-batching',
    name: 'G4 family batching (tier-2 chirp level)',
    kind: 'result',
    status: 'built + validated + priced (imp-95214): window-1 certificate at 21.1 CPU-days, 17.9× under the level-1 route; full-window run not launched',
    statusKind: 'result',
    route: null,
    source: 'imp-95214 / imp-95238',
  },
  {
    id: 'window1-cert',
    name: 'Window-1 continuum certificate',
    kind: 'open-object',
    status: 'in progress — hardest slice certified (800 of 1,381,977 q-units, 0.058%, 0 failures); full-window run a deferred separate decision; window 1 is 1 of 54,109,012 Gate-2 windows',
    statusKind: 'progress',
    route: '/viz-imp95278-window1-coverage-bar',
    source: 'imp-95213 / imp-95238 / imp-95245',
    closesIf:
      'A full window-1 run would be the first full-window continuum-certified statement of the Gate-2 program — a milestone, not a bound-mover: window 1 alone sets no promotion flag. Closing (H4) requires the batched family run over all 54,109,012 windows on both seam charts.',
  },
  {
    id: 'h4-family',
    name: '(H4) — the one open family',
    kind: 'open-object',
    status: 'open — the enclosure |C_E,17| + r_num < 0.2796881955526147 on 690988 ≤ N ≤ 54,799,999, both seam charts; the strict open weld ‖E₉₇‖ < R_ex of the §4.7 chain',
    statusKind: 'open',
    route: '/permutation-architecture',
    source: 'imp-95008 / section47_chain (kernel-verified up to (H4))',
    closesIf:
      'Closing (H4) fires the Λ ≤ 0.14 completion contract. The contract is fail-closed: nothing is claimed unless this family closes in full.',
  },
  {
    id: 'contract-014',
    name: 'Λ ≤ 0.14 completion contract',
    kind: 'contract',
    status: 'contract-not-a-bound — fail-closed; reduced to exactly the (H4) family; kernel-verified implication chain (H0)–(H6) behind it',
    statusKind: 'contract',
    route: '/permutation-architecture',
    source: 'permutation architecture',
  },

  // ── y-thaw · the 0.17759432 package ────────────────────────────────────
  {
    id: 'o1-sharp-mass',
    name: 'O1 — sharp-mass y-monotonicity',
    kind: 'open-object',
    status: 'at Aristotle — job38 sharp_mass_monotonicity (wave 6, sequential slot); success reduces O1 to a producer run (gates G1–G4, per-cell hull form)',
    statusKind: 'aristotle',
    route: null,
    source: 'imp-95130 / imp-95227 / ARISTOTLE_TARGETS.md wave 6',
    closesIf:
      'Reduces O1 to a producer run. With O2 and O4 it arms O6 — three of the four open obligations of the 0.17759432 package.',
  },
  {
    id: 'o2-slab',
    name: 'O2 — barrier/winding slab at y = 0.1808',
    kind: 'open-object',
    status: 'open — tractability triage only: cheapest open obligation, error budget ~3.50× below allowance, 0.5198 margin far from exhaustion',
    statusKind: 'open',
    route: null,
    source: 'imp-95129',
    closesIf: 'An Arb re-run of the slab at the thawed bottom edge closes O2 and arms O6 (with O1 and O4).',
  },
  {
    id: 'o4-tail',
    name: 'O4 — analytic tail N > 3,840,000',
    kind: 'open-object',
    status: 'open — measurement only: tail-entry floor 0.325311 exceeds the O3 budget 1.33e6×, but N-uniform analytic majorants are not derived',
    statusKind: 'open',
    route: null,
    source: 'imp-95131',
    closesIf: 'Deriving the N-uniform majorants closes O4 and arms O6 (with O1 and O2).',
  },
  {
    id: 'o6-assembly',
    name: 'O6 — criterion assembly (Cor-3.2-analogue)',
    kind: 'open-object',
    status: 'gated — no heavy-compute content of its own; fires iff O1 ∧ O2 ∧ O4 close (O3 E_max budget and O5 site coverage already closed, certified in our toolchain)',
    statusKind: 'open',
    route: null,
    source: 'imp-95132 / imp-95140 / imp-95212',
    closesIf:
      'Assembling the criterion at (t₀, y₀) completes the 0.17759432 y-thaw package. Even complete, the package is candidate-unrefereed — a package value, not a bound.',
  },
  {
    id: 'ythaw-01775943',
    name: 'Λ ≤ 0.17759432 y-thaw package',
    kind: 'candidate',
    status: 'candidate-unrefereed — package value 129/800 + 0.1808²/2, not a bound; ledger: O3, O5 closed / O1, O2, O4, O6 open',
    statusKind: 'candidate',
    route: '/lambda-bounds',
    source: 'imp-95140 obligation ledger',
  },

  // ── frozen-rung ⟺ PT ───────────────────────────────────────────────────
  {
    id: 'zr-hypothesis',
    name: '(ZR) zero-repulsion hypothesis',
    kind: 'open-object',
    status: 'open — the single named hypothesis left: the kernel-verified L2 detection-modulus theorem (Aristotle wave 5, zero nonstandard axioms) is conditional on the ZeroRepulsion structure alone',
    statusKind: 'open',
    route: '/frozen-rung-pt-equivalence',
    source: 'l2_detection_modulus (job32) / frozen-rung Kernels.lean',
    closesIf:
      'Discharging (ZR) promotes frozen-rung ⟺ Platt–Trudgian from (proven inertia half + conditional converse) to a full theorem. It promotes a theorem, not a Λ value — by the inertia half, the certificate can never beat verified height.',
  },
  {
    id: 'frozen-rung-pt',
    name: 'Frozen-rung ⟺ Platt–Trudgian',
    kind: 'result',
    status: 'inertia half: prose-proof (unconditional); converse: conditional — kernel-verified detection modulus resting on (ZR) exactly',
    statusKind: 'result',
    route: '/frozen-rung-pt-equivalence',
    source: 'frozen-rung proposition + Aristotle wave 5',
  },

  // ── Route VII · t↓0 ────────────────────────────────────────────────────
  {
    id: 'route7-cost-curve',
    name: 'Route VII cost curve (t↓0 pricing)',
    kind: 'open-object',
    status: 'in progress — analysis on a 2-point Arb calibration: N1*(t,y) = exp(Θ(1/t)) derived from the tail architecture (SC3 floor ln N1* > 2/t), threshold constant to 1.6% across 57× in N1*',
    statusKind: 'progress',
    route: null,
    source: 'imp-95218',
    closesIf:
      'Decides the t↓0 diagonal program’s reachable floor. Current verdict: compute-blocked below U ≈ 0.145–0.150; every halving of U squares the row count, and technology moves prefactors, never the exponent. Falsifiable next point: the 0.14-row tail repriced through this architecture predicts N1* ≈ 2.85e8.',
  },
  {
    id: 't0-program-floor',
    name: 't↓0 diagonal program floor',
    kind: 'result',
    status: 'no-go (analysis) — reachable floor U ≈ 0.150 (t ≈ 0.137, y = 0.165), stretch 0.145; below that requires a new tail mechanism breaking the σ−½ = (t/2)·ln N coupling, i.e. arithmetic input',
    statusKind: 'nogo',
    route: '/flow-blindness-no-go',
    source: 'imp-95218 / flow-blindness + T3⟺strip dictionary',
    externalCorroboration:
      'INDEPENDENT EXTERNAL CORROBORATION (2026-09-21): a third-party unrefereed preprint by ' +
      'Dale James Raymond (Λ ≤ 0.149396, Zenodo 22867547 — different route, no connection to this ' +
      'program, cites Gomila only for context) lands its computer-assisted bound at 0.149395, ' +
      'squarely INSIDE this predicted floor band [0.145, 0.150]. More tellingly, its own structure ' +
      'confirms the floor rather than breaching it: its Part II Theorem 2 proves the ' +
      'kernel/averaging lever is EXHAUSTED in its class, its ODE-substep lever is converged, and it ' +
      'explicitly names the only remaining in-architecture lever as a JOINT TWO-POINT SOURCE ESTIMATE ' +
      'which it declares an OPEN research problem ("a possibility, not a proven gain"). That is exactly ' +
      'this node’s "a new mechanism is needed below ≈0.145–0.150" shape, reached independently. Its ' +
      'height-binding is logarithmic (floor ℓ ~ ¼·ln(X/4π)), consistent with the PT-floor audit ' +
      '(verified height binds). Two adversarial Fable-5 checks: the novel layer (correlated probes) is ' +
      'sound, AND the residual-risk ~8pp Polymath-grade re-derivation (AF §4.1, −1≤σ≤2 extension) was ' +
      'independently verified SOUND line-by-line vs Polymath15 §6 — so the corroborating bound is a ' +
      'strong, analytic-core-verified candidate (remaining unverified: AF §§6–12 + the 2.7M-row replay), ' +
      'NOT peer-reviewed, and does not move Λ. ' +
      'No refereed bound is changed. See the /lambda-bounds ladder entry.',
  },

  // ── the unconditional floor ────────────────────────────────────────────
  // ── Route I Krein Toeplitz certificate ─────────────────────────────────
  {
    id: 'route-i-uniform-n-gap',
    name: 'IMP96749_UNIFORM_N_GAP — uniform-in-N spectral gap for T_a[σ₂] (settled on 2a ≤ ln 3 by ARB-LEGE)',
    kind: 'candidate',
    status: 'PROVED (computer-assisted, Arb; two internal adversarial referee passes, one quadrature constant corrected with the conclusion unchanged; not externally refereed) on 2a ≤ ln 3 — ARB-LEGE (tlb-arb-lege-2026-09-28) executes leg (E) of the pole-free one-prime certificate in Arb: W(h) ≥ 8.2045368e-4‖h‖² (T=200, N=240; 9.0434717e-4 at T=400, N=320) for every pole-free h in L²(−a,a), 2a ≤ ln 3. Double rebuilds agree with the Arb balls to 3e-15; the W normalisation was checked four ways including the zero sum; independent Ritz upper bounds put the certificate within ~5% of tight. Via h = φ/4 − φ″ (φ ∈ H²₀) and Dirichlet Poincaré, λ₁(T_a[σ₂]) ≥ 8.2045e-4·(1/4+(π/2a)²)² ≥ 0.0583 > 0 (replaces the c♯ cohort best rigorous floor −3065). Ritz plateau ~0.56–0.59. The repo’s interval-rigorous reach moves from 2a ≤ 0.96 to 2a ≤ ln 3 (novelty vs the small-support literature not checked). Pole-free form only; past ln 3 the p = 3 term enters and nothing is claimed. Sibling DH-BLIND (tlb-dh-blind-2026-09-28): at conductor 5 the RH-false same-bridge Davenport–Heilbronn twin also passes positivity at these supports (proved to 2a ≤ 0.783, measured to ln 3), so this positivity does not encode the Euler product.',
    statusKind: 'candidate',
    route: '/viz-imp96777-krein-lammin-n-trend',
    source: 'tlb-arb-lege-2026-09-28 (ARB-LEGE) / imp-96544 / imp-96749 / imp-96768 / imp-96769',
    closesIf:
      'Settled for 2a ≤ ln 3 once an external referee checks the Arb run (scripts tmp/tlb-1-ref0-arb-lege-fixed.py [corrected Gauss exponent], tmp/tlb-1-normalisation-check.py, tmp/tlb-1-sigma2-reduction-check.py). Open sub-gaps: (i) a sharper certified σ₂ floor, e.g. via the clamped-beam constant (~0.285 vs Ritz ~0.57); (ii) 2a > ln 3, where the p = 3 term enters (one-prime reach 1.1286 is double-only). Fixed-window positivity localises no zero and moves no Λ bound; no refereed bound is changed.',
  },
  {
    id: 'verified-height',
    name: 'Verified zero height (external HPC)',
    kind: 'open-object',
    status: 'external — seam anchor X/2 ≈ 3.0000×10¹² already pinned at the ceiling (headroom 5.8e-5 relative); out of this program’s reach, RH-free',
    statusKind: 'external',
    route: '/verified-height-lever',
    source: 'PT-floor audit / imp-95218 §4',
    closesIf:
      'The only unconditional lever on the peer-reviewed floor (PT-floor audit: verified height binds, barrier slack does not). Along Route VII it re-binds logarithmically — erasing the 0.1399-row lane by height alone needs ~1.02e5× the current verified height.',
  },
  {
    id: 'pt-02-floor',
    name: 'Λ ≤ 0.2 floor (Platt–Trudgian 2021)',
    kind: 'result',
    status: 'refereed-sound — the peer-reviewed benchmark; the floor is set by verified zero height, not barrier slack',
    statusKind: 'result',
    route: '/pt-floor-audit',
    source: 'Platt–Trudgian 2021 / PT-floor audit',
  },
];

// meaning: 'closes' | 'gates' | 'promotes'
export const EDGES = [
  { from: 'copositive-strip', to: 'weld-ladder-floor', meaning: 'closes' },
  { from: 'weld-ladder-floor', to: 'h4-identification-residual', meaning: 'gates' },
  { from: 'h4-identification-residual', to: 'h4-family', meaning: 'gates' },
  { from: 'g4-batching', to: 'window1-cert', meaning: 'gates', note: 'prices the run 17.9× under level-1' },
  { from: 'window1-cert', to: 'h4-family', meaning: 'closes', note: 'only via the full 54,109,012-window family run' },
  { from: 'h4-family', to: 'contract-014', meaning: 'gates' },
  { from: 'o1-sharp-mass', to: 'o6-assembly', meaning: 'gates' },
  { from: 'o2-slab', to: 'o6-assembly', meaning: 'gates' },
  { from: 'o4-tail', to: 'o6-assembly', meaning: 'gates' },
  { from: 'o6-assembly', to: 'ythaw-01775943', meaning: 'closes' },
  { from: 'zr-hypothesis', to: 'frozen-rung-pt', meaning: 'promotes' },
  { from: 'route7-cost-curve', to: 't0-program-floor', meaning: 'gates', note: 'decides the reachable floor' },
  { from: 'verified-height', to: 't0-program-floor', meaning: 'gates', note: 'height and compute share one logarithm' },
  { from: 'verified-height', to: 'pt-02-floor', meaning: 'gates' },
];

export const FRONTIER_DAG = { asOf: '2026-09-14', nodes: NODES, edges: EDGES };
