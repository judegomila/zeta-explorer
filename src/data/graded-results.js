/**
 * @module graded-results
 * @fileoverview The graded results ledger backing /results — one row per
 * load-bearing result, each carrying its verbatim honesty grade and the
 * verification artifacts behind it. Import-light: plain literals only, no
 * heavy bundles.
 *
 * Grades are verbatim and nothing here promotes a bound: kernel-verified /
 * refereed-sound / prose-proof / arb-certified / measured /
 * candidate-unrefereed / contract-not-a-bound / no-go / refuted / eliminated.
 * Platt–Trudgian Λ ≤ 0.2 is the peer-reviewed benchmark; RH remains open.
 * NO QED.
 */

// Facet order + rendering metadata for the grade chips (warm editorial palette).
export const GRADE_META = [
  { grade: 'kernel-verified', color: '#4c7a4a', desc: 'Lean 4 proof, sorry-free, standard axioms only (#print axioms audited)' },
  { grade: 'refereed-sound', color: '#3f6f8a', desc: 'prose proof that survived an independent referee pass' },
  { grade: 'prose-proof', color: '#6d55b8', desc: 'written proof, not yet refereed or formalized' },
  { grade: 'arb-certified', color: '#7a6b2e', desc: 'interval computation (Arb/FLINT or mpmath.iv, directed rounding)' },
  { grade: 'measured', color: '#8a6a3f', desc: 'sampled computation — evidence, not a sup or a theorem' },
  { grade: 'candidate-unrefereed', color: '#b58a2e', desc: 'computer-assisted candidate value; not peer-reviewed, not a bound' },
  { grade: 'contract-not-a-bound', color: '#a9572e', desc: 'fail-closed conditional reduction; establishes no bound' },
  { grade: 'no-go', color: '#9d4a3f', desc: 'a route family shown unreachable by the stated method' },
  { grade: 'refuted', color: '#8c3b3b', desc: 'a specific claim or mechanism shown false' },
  { grade: 'killed', color: '#6e6259', desc: 'a lane closed on explicit failure criteria (economic or structural)' },
];

export const GRADE_ORDER = GRADE_META.map((g) => g.grade);

/**
 * Each entry: {
 *   statement    one honest sentence,
 *   grade        verbatim grade from GRADE_ORDER,
 *   verification array of artifact names/links (Lean decls, referee passes, Arb runs),
 *   thread       program thread tag,
 *   route        deep link (null when the result has no page of its own),
 *   date         YYYY-MM (record date of the artifact)
 * }
 */
export const RESULTS = [
  // ── defective-target discovery (a first: a formal target found FALSE, not merely unproven) ──
  {
    statement: 'Defective-target discovery: the sorried probe statement exists_heatOp_approx_tendsto is FALSE in its intended (everywhere-Summable) reading — no heat-majorized real-rooted approximant sequence exists for the full Laguerre–Pólya class at any t > 0 (Gaussian witness f = exp(−(c z)²), c = √(1/t), whose even derivatives ~c^{2k}(2k)!/k! admit no summable majorant). The literal mathlib-tsum-junk-semantics variant is recorded OPEN; both are superseded by the order-≤1 (finite-type) restatement, which is all ξ / H_t require. NOT a discharge — the pipeline’s first target found defective rather than unproven.',
    grade: 'refuted',
    verification: [
      'Lean: Probe.not_exists_heatOp_approx_tendsto_full_LP (capstone) + not_forall_exists_LP_approx_heatMajorized(_of_pos) + not_exists_heatMajorized_gaussianScaled (lp_retirement, mathlib v4.28, 0 sorry, standard axioms)',
      'second-round faithfulness review: VERIFIED-FAITHFUL — Probe.IsLaguerrePolya / Probe.HasOnlyRealRoots byte/character-identical to the probe; capstone minus its Summable conjunct diffs mechanically to the sorried statement',
      'non-vacuity verified: polynomials satisfy the Summable conjunct, so the refutation routes through the Gaussian inside the class',
    ],
    thread: 'aristotle-formalization',
    route: '/permutation-architecture',
    date: '2026-09',
  },
  {
    statement: 'Heat semigroup preserves the entire Laguerre–Pólya class (order-≤1 / finite-type): for t ≥ 0, if f is Laguerre–Pólya with ‖f(z)‖ ≤ A·exp(B‖z‖) then heatFlow t f is Laguerre–Pólya — the correct (finite-type-restricted) form of the defective target, which ξ and H_t satisfy. Proved unconditionally via a from-scratch truncation operator (sidestepping the finite Pólya–Schur and real-rootedness-closure mathlib gaps) + the heat-majorized transfer lemma, composed to the consumer. Closes the EntireLP arc: every statement in the probe tree is now kernel-proved, kernel-refuted, or explicitly open.',
    grade: 'kernel-verified',
    verification: [
      'Lean: EntireLP.heat_preserves_LP_entire_of_growth (entirelp_splice428, mathlib v4.28; build green 8034 jobs; 98 thms + 19 defs on [propext, Classical.choice, Quot.sound]; non-vacuity witnessed at f = id)',
      'second-round faithfulness review: VERIFIED-FAITHFUL on six checks — capstone = the probe’s heat_preserves_LP_entire with EXACTLY one added hgrowth hypothesis, byte-identical vocabulary; discharge chain fully unconditional',
      'cross-toolchain note: probe (v4.22) hosts the consumer; the verified composition lives at v4.28 (RealRootedPreservation port byte-identical, 4 API-rename deltas, diff-verified)',
    ],
    thread: 'aristotle-formalization',
    route: '/permutation-architecture',
    date: '2026-09',
  },
  // ── kernel-verified (Lean 4, sorry-free, standard axioms) ──────────────────
  {
    statement: 'Five-shell identity: unconditionally, E₉₇ = (1−A₉₇)·L(Y₄) − A₉₇·Σ_{g=1..4} L(Z_g) with the 25 primes ≤ 97 cut at (0,5,10,17,25) and the annihilated shells mutually orthogonal (disjoint Fourier supports).',
    grade: 'kernel-verified',
    verification: ['Lean: five_shell_identity (mathlib v4.28, 0 sorry)', 'orthogonality lemmas ip_Z_Z, ip_Z_Y4', 'faithfulness review: FAITHFUL'],
    thread: 'permutation-calculus',
    route: '/permutation-architecture',
    date: '2026-08',
  },
  {
    statement: 'Permutation-defect lemma: for contractions T₁..T_m and any permutation π, ‖T_π − T_id‖ ≤ Σ_{(i,j)∈Inv(π)} ‖[T_i,T_j]‖, via a bubble chain hitting each inversion exactly once; weighted noncontractive form included.',
    grade: 'kernel-verified',
    verification: ['Lean: norm_permProd_sub_one_le_sum', 'Lean: exists_swapChain_permWord', 'faithfulness review: FAITHFUL'],
    thread: 'permutation-calculus',
    route: '/permutation-architecture',
    date: '2026-08',
  },
  {
    statement: 'Ramanujan reversal + row sum: a_k⁽ⁿ⁾ = r_{n−1−k}⁽ⁿ⁾ for all n ≥ 1, and P_n(1) = R_n(1) = n^{n−1} — with the Cayley-type value proved from scratch (Abel binomial theorem + tree function ODE), not cited.',
    grade: 'kernel-verified',
    verification: ['Lean: theorem_1_reversal', 'Lean: theorem_2_ramanujan_value', 'Lean: corollary_1_row_sum'],
    thread: 'waves-2-3',
    route: null,
    date: '2026-08',
  },
  {
    statement: 'Jet lemma: e^{−sD²}xⁿ = cⁿHeₙ(x/c) with c = √(2s); for s > 0, e^{−sD²}x^{2m} has 2m distinct real roots and is squarefree; for s < 0 it is strictly positive on ℝ (no real roots).',
    grade: 'kernel-verified',
    verification: ['Lean: heatOp_X_pow_eq_scaled_hermiteReal (J1)', 'Lean: heatOp_X_pow_two_mul_card_roots (J2)', 'Lean: eval_heatOp_X_pow_two_mul_pos (J3)'],
    thread: 'waves-2-3',
    route: null,
    date: '2026-08',
  },
  {
    statement: 'Theta-trap Theorem A: Θ ≤ 1/4 is a sharp invariant of the attractive Calogero–Moser flow (explicit IsCMFlow hypotheses), with sharpness witnessed by a proven symmetric-triplet flow and corollary t_c ≤ g²/6.',
    grade: 'kernel-verified',
    verification: ['Lean: theoremA', 'Lean: ThetaDot_le', 'Lean: corollaryA1'],
    thread: 'waves-2-3',
    route: '/theorem-b-threshold',
    date: '2026-08',
  },
  {
    statement: 'Flow-blindness no-go: given 0 ≤ Λ (Rodgers–Tao, carried as a hypothesis), every flow-invariant, zero-reality-sound soft hypothesis class containing the t = 0 profile is contradictory — no soft class proves RH.',
    grade: 'kernel-verified',
    verification: ['Lean: noGo_backward (F1)', 'Lean: softClass_noGo / noGo_profile_class (F2)', 'Lean: gaussianDamp_logConcave (F3)'],
    thread: 'flow-blindness',
    route: '/flow-blindness-no-go',
    date: '2026-08',
  },
  {
    statement: 'L2 detection: an unconditional detection-radius theorem (‖X(z+a)‖ < ‖X(z−a)‖ on an explicit disk near a ghost zero) composing to 1 ≤ negIndex of the Schur Gram matrix; mesh detection of every ghost is conditional on the named ZeroRepulsion hypothesis, used only as a hypothesis.',
    grade: 'kernel-verified',
    verification: ['Lean: detection_radius_robust', 'Lean: l2_conditional_negIndex', 'non-vacuity witness in Examples.lean'],
    thread: 'frozen-rung',
    route: '/frozen-rung-pt-equivalence',
    date: '2026-08',
  },
  {
    statement: 'Heat-discriminant law: along the Calogero–Moser flow, d/ds log disc = −8Σ_{i<j}(x_i−x_j)^{−2}, and the discriminant is strictly decreasing on convex domains (generalization proved, not just the stated interval).',
    grade: 'kernel-verified',
    verification: ['Lean: hasDerivAt_log_disc_flow_S', 'Lean: strictAntiOn_disc', 'two-particle exact solution discharges hypotheses'],
    thread: 'waves-2-3',
    route: null,
    date: '2026-08',
  },
  {
    statement: 'r1fn sharp cap: Θ ≤ 1 − 2/N with exact maximizer Thetamax N, attained by the balanced arithmetic progression, plus the full equality/forcing characterization.',
    grade: 'kernel-verified',
    verification: ['Lean: Theta_le_one_sub_two_div_N', 'Lean: attainment + forcing characterization'],
    thread: 'waves-2-3',
    route: null,
    date: '2026-08',
  },
  {
    statement: 'Isolation onset: the exact R2-T identity with sign trichotomy, f = 4Q/(ρ(ρ+1)(ρ+2)), and the onset constant c* = √(2+√3) − 1 with uniqueness and the full sign dichotomy for all ρ > 0 (K-shells excluded, per source scope).',
    grade: 'kernel-verified',
    verification: ['Lean: cstar (both radical forms proved equal)', 'Lean: sign trichotomy + flow form'],
    thread: 'waves-2-3',
    route: null,
    date: '2026-08',
  },
  {
    statement: 'Gilbreath package: all nine items A1–R plus a lock certificate, with A3 (leading term of the prime row is odd) fully unconditional via Nat.nth Prime machinery; the drafted B′ was false at W = 0 and gained the necessary 1 ≤ W hypothesis.',
    grade: 'kernel-verified',
    verification: ['Lean: gilbreath_package A1–R', 'Lean: A3_prime_leading_odd (unconditional)'],
    thread: 'gilbreath',
    route: '/gilbreath',
    date: '2026-08',
  },
  {
    statement: 'Newton inequality: real-rooted real polynomials have log-concave coefficient sequences — the statement is character-for-character the previously sorried target at HeatCorollaries.lean:191, so it erases that sorry.',
    grade: 'kernel-verified',
    verification: ['Lean: newton_inequality', 'preservation theorems re-proved, not assumed'],
    thread: 'de-bruijn-formalization',
    route: '/formalization-review',
    date: '2026-08',
  },
  {
    statement: 'Argument principle on rectangles: winding of an analytic function around a rectangle equals the sum of analytic orders inside — the general lemma consumed by the §4.7 chain instead of hypothesizing it.',
    grade: 'kernel-verified',
    verification: ['Lean: ArgumentPrinciple.windingRect_eq_sum_analyticOrder', 'audit-repo PR #30 (lean/aristotle/argument_principle)'],
    thread: 'permutation-calculus',
    route: '/permutation-architecture',
    date: '2026-08',
  },
  {
    statement: 'Frozen-rung component set: the winding-form counting identity, shifted-bridge kernel + Krein–Langer/Sylvester inertia pieces, L1 tail-leakage integral bounds, and Blaschke/Schur-kernel quadratic-form bounds — 5 files, 0 sorry.',
    grade: 'kernel-verified',
    verification: ['Lean: winding_count_identity', 'Lean: tail_bound_of_integral_le', 'Lean: leakage_quadratic_form_bound', 'spot-check: identity non-vacuous'],
    thread: 'frozen-rung',
    route: '/frozen-rung-pt-equivalence',
    date: '2026-07',
  },
  {
    statement: '§4.7 implication chain: from hypotheses (H0)–(H6) — including the load-bearing (H3) and the strict open weld (H4) ‖E₉₇‖ < R_ex — winding 0 is derived (not assumed) and Theorem 4.1(ii) follows at the exact row constants; the weld itself remains an assumed input.',
    grade: 'kernel-verified',
    verification: ['Lean: theorem4_chain', 'Lean: theorem4_chain_argPrinciple (H6 discharged against the rectangle lemma)', 'faithfulness review: FAITHFUL'],
    thread: 'permutation-calculus',
    route: '/permutation-architecture',
    date: '2026-08',
  },
  {
    statement: 'Backward heat preserves real-rooted polynomials: e^{−tD²} (t ≥ 0) preserves real-rootedness of real polynomials — the polynomial de Bruijn / Hermite–Poulain theorem, machine-checked; the entire-function lift is closed modulo two precisely named axioms.',
    grade: 'kernel-verified',
    verification: ['Lean: heat_preserves_LP (mathlib v4.22, axiom-clean)', 'Lean: hermite_map_hasOnlyRealRoots', '#print axioms: no sorryAx'],
    thread: 'de-bruijn-formalization',
    route: '/formalization-review',
    date: '2026-07',
  },
  {
    statement: 'Min-gap sandwich (Theorem B): under an adjacent-pair background bound β with βg² < 2, the collision time obeys the exact closed-form pinch T₋ ≤ t_c ≤ T₊, with the static s = 0 gate discharged unconditionally.',
    grade: 'kernel-verified',
    verification: ['Lean: minGap_sandwich', 'Lean: bgStatic_mul_sq_lt_two (unconditional)', 'two-particle witness instantiated'],
    thread: 'waves-2-3',
    route: '/theorem-b-threshold',
    date: '2026-08',
  },
  {
    statement: 'Trap threshold: every level Θ* ≤ Θ_b = (√73−5)/8 is trapping along the attractive CM flow when the tracked pair realizes the minimal gap, and the threshold is attained by an explicit four-particle configuration.',
    grade: 'kernel-verified',
    verification: ['Lean: theoremB (Trap.lean)', 'Lean: rate_nonpos_of_sum_le (S1)', 'Lean: witness_threshold (attainment)'],
    thread: 'waves-2-3',
    route: '/theorem-b-threshold',
    date: '2026-08',
  },

  // ── refereed prose ─────────────────────────────────────────────────────────
  {
    statement: 'S0 note (y-thaw stage 1): m(ρ) = max(|B−ρA|/(1−ρ), |B+ρA|/(1+ρ)) is nondecreasing on [0,1), extending the boundary-circle Improved Triangle Inequality to the full disk |γ′| ≤ g_N; Polymath’s boundary-phase reduction provably does not port to the modulus form.',
    grade: 'refereed-sound',
    verification: ['independent referee pass 2026-09-10 (S0/S1/S2 sound, rows 1–6 accurate, O1 restated)', '400k randomized trials', 'module imp-95208-ythaw-package-stage12'],
    thread: 'y-thaw',
    route: null,
    date: '2026-09',
  },
  {
    statement: 'Weld chain (imp-95020 → imp-95052): the ℓ² alias collapse of the weld commutator [B_v,Π_p], its RKHS/Paley–Wiener ℓ²-to-pointwise passage with diagonal reproducing-kernel constant, and the von Neumann trace refinement √(λ_max(ρ)·K_W) tying the chain to the pointwise scalar |C_E,17|.',
    grade: 'refereed-sound',
    verification: ['modules imp-95008-weld-alias-l2-collapse → imp-95027 → imp-95020', 'residual (c) closed: RKHS passage', 'Lemma H (trace inequality) unconditional'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },

  // ── arb-certified computations ─────────────────────────────────────────────
  {
    statement: 'y-thaw sweep floor: the sharp-weight re-sweep at y = 0.1808, t = 129/800 is positive across the entire triangle-collapsed stretch (seams included), global interior minimum 0.062718178029 at N = 690996 — under our compile, not the sealed toolchain.',
    grade: 'arb-certified',
    verification: ['Arb/FLINT prec 256 (local clang compile)', 'module imp-95208-ythaw-package-stage12 (stage 2)'],
    thread: 'y-thaw',
    route: null,
    date: '2026-09',
  },
  {
    statement: 'y-thaw obligations O5 + O3: site coverage certified by three independent lanes (exact-rational, mpmath.iv 400-bit, Arb 400-bit), and the E_max budget re-closed over the full y-hull [0.1808, y_max] by inclusion isotonicity — O1/O2/O4/O6 stay open, 0.17759432 stays a package value.',
    grade: 'arb-certified',
    verification: ['verify_o5_site_coverage.py + verify_o5_site_arb.c (sha256 pinned)', 'verify_o3_error_budget.py (mpmath.iv 320-bit, directed rounding)', 'module imp-95212-ythaw-o5-o3'],
    thread: 'y-thaw',
    route: null,
    date: '2026-09',
  },
  {
    statement: 'T-P1 tail repricing: the minimal all-N tail cutoff for the 0.1399 row exists and equals N₁* = 220,495,706, with the boundary exact at both 320 and 512 bits — a pricing probe, deriving no bound and certifying no lane.',
    grade: 'arb-certified',
    verification: ['verify_tail_arb_01399.c (Arb 320-bit, fail-closed comparisons; re-confirmed at 512)', 'module imp-95206-t-p1-tail-repricing'],
    thread: '0.1399-row',
    route: null,
    date: '2026-09',
  },
  {
    statement: 'Tier-P/B/S slice certificates: the window-1 tiered certifier (degree-80 Taylor panels with exact Lagrange remainders + phase-resolving fallback) is built, validated, and has rigorously certified a 0.058% slice of window 1; the full-window run (priced 378 CPU-days) was not launched.',
    grade: 'arb-certified',
    verification: ['native/gate2-interval/tier_cert.c (Arb, alias-decomposed Lipschitz ledger re-derived rigorously)', 'modules imp-95213 / imp-95214 (chirp second level)'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },
  {
    statement: 'G1 telescope: the source-closed Lane-A evaluator reproduces the eq-(13) 25-defect telescope Σ_j D_j = E₉₇ to ≤ 1.8e-13 at seam points (cross-validated against the independent E₉₇ path to ≤ 8.4e-17) and to ≤ 4.3e-13 across all 343 family reconnaissance windows.',
    grade: 'arb-certified',
    verification: ['native/gate2-lane-a (point + pilotg3 modes)', 'high-precision spot audit', 'modules imp-95205 / imp-95217'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },

  // ── measurements ───────────────────────────────────────────────────────────
  {
    statement: 'G3 first-window pilot: on all 612,290 sampled points of the complete N = 690988 window, sup Σ_j |D_j| = 0.2437541384450471 < R_ex = 0.2796881955526244 (12.8% margin) and sup |E₉₇| = 0.1934424506064475 (30.8% margin) — sampled sups, not a continuum certificate.',
    grade: 'measured',
    verification: ['native/gate2-lane-a pilotg3 (300001-point grid + 3-level zoom, both seam charts)', 'module imp-95205-g3-first-window-pilot'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },
  {
    statement: 'λ_max(ρ) = 0.6231344958476320: the ensemble mode-density top eigenvalue named (and left unmeasured) by Lemma H, now measured — improving the pointwise constant to qVN = 0.7893887 and the weld-constant margin factor to 1.8149072.',
    grade: 'measured',
    verification: ['float64 power iteration vs mpmath eigh (agree to 1e-6)', 'module imp-95217-inertia-pcc-q-measurement'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },
  {
    statement: 'Inertia landscape: at every one of 21 measured seam points across the family the compressed defect form is full-rank and indefinite (n₀ = 0, n₋ ∈ [5,11]) — every PSD-certificate route through this compression is refuted pointwise, per the frozen-rung negIndex detector.',
    grade: 'measured',
    verification: ['Lane-A evaluator, telescope-checked per point', 'Inertia.lean le_negIndex interface', 'module imp-95217'],
    thread: 'gate-2',
    route: '/frozen-rung-pt-equivalence',
    date: '2026-09',
  },
  {
    statement: 'Family reconnaissance trend: over 343 windows spanning 690988 ≤ N ≤ 54799999, the sampled pilot sup peaks at 0.253731 (90.7% of R_ex, N = 691988, low edge) and decreases with ln N on every uniform series; no sampled window comes within 5% of R_ex.',
    grade: 'measured',
    verification: ['native/gate2-lane-a/recon (family-recon.jsonl, analyze.mjs)', 'max telescope error 4.245e-13'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },

  // ── candidates (computer-assisted, unrefereed; none is a bound) ────────────
  {
    statement: 'Λ ≤ 0.1787854 candidate: sealed computer-assisted package (v3) with a 3.15M-row Arb certificate and a three-piece final-time half-strip closure; reviewed by Dan Romik and publicly posted — not refereed, not a bound.',
    grade: 'candidate-unrefereed',
    verification: ['sealed v3 package (review-01787854-v3)', 'independent-audit summary', '3.15M-row Arb certificate'],
    thread: 'candidate-01787854',
    route: '/newman-lambda-01787854-candidate',
    date: '2026-07',
  },
  {
    statement: 'Λ ≤ 0.1758354 candidate: the y-transfer closes via profile-sector cells with an excision budget after termwise monotonicity was found false; the Arb verification (verify_ydini_genmoll.c, 256-bit, all 20,546 profiles) PASSED — B = 2.4957e-4, 7.5× inside the 1.872e-3 margin (run 2026-08-02, partials reproduced bit-identical 2026-09-22). This closes the y-Dini/excision computational gate only; composition audit + referee outstanding — still unrefereed, not a bound.',
    grade: 'candidate-unrefereed',
    verification: ['profile-sector cell decomposition (20,546 profiles; the 2^287 enumeration dissolved)', 'PASS: verify_ydini_genmoll.c (Arb 256-bit) B=2.495709389e-04 < 1.7e-3 (2026-08-02; reproduced 2026-09-22)'],
    thread: 'candidate-01758354',
    route: '/lambda-01758354-candidate',
    date: '2026-08',
  },
  {
    statement: '0.17759432 y-thaw package value (129/800 + 0.1808²/2): 2 of 6 obligations closed (O3 and O5, under our toolchain), O1/O2/O4/O6 open (record of 2026-09-22) — a package value, not a candidate and not a bound, until the obligation ledger closes.',
    grade: 'candidate-unrefereed',
    verification: ['obligation ledger O1–O6 (module imp-95140)', 'stages 1+2 frozen (module imp-95208)'],
    thread: 'y-thaw',
    route: null,
    date: '2026-09',
  },

  // ── contracts (fail-closed reductions; none establishes a bound) ───────────
  {
    statement: 'Λ ≤ 0.14 completion contract: the freeze-calculus route reduces the strict 0.14 statement to explicitly listed closed components plus one open family — a fail-closed contract, not a bound.',
    grade: 'contract-not-a-bound',
    verification: ['Permuting the Zeta Twin Ladder §4 (revised)', 'closed shell/transfer ledger', 'Lean: section47_chain consumes the contract logic'],
    thread: 'permutation-calculus',
    route: '/permutation-architecture',
    date: '2026-08',
  },
  {
    statement: 'The one open family: a uniform correlated enclosure |C_E,17| < 0.27968819555261474 on 690988 ≤ N ≤ 54799999, for every window parameter and both seam sides — open; raw pointwise tiling of it is infeasible (> 7.2e26 cells).',
    grade: 'contract-not-a-bound',
    verification: ['module imp-95006 (queue manifest)', 'five sufficient gates ranked (imp-95007)', 'cell-count cross-check (imp-95049)'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-08',
  },
  {
    statement: '0.1399 row (Theorem 4.5): y* = 33/200, t* = 10103/80000 gives t* + y*²/2 = 0.1399 from two new hypotheses (rectangular slab + directed final-time tail); the certification campaign is designed with failure criteria — conditional design only.',
    grade: 'contract-not-a-bound',
    verification: ['module imp-95201-01399-certification-campaign', 'slab lane imp-95046 / tail lane imp-95047'],
    thread: '0.1399-row',
    route: '/permutation-architecture',
    date: '2026-09',
  },

  // ── no-gos ─────────────────────────────────────────────────────────────────
  {
    statement: 'PT-floor audit: the verified zero height X ≈ 3e12, not barrier slack (≥ 1.2), binds Λ ≤ 0.2 — the whole barrier-tightening class (SOS/Carleman/Putinar/free-sub) is refuted as a Λ < 0.2 lever; the only lever is more verified height.',
    grade: 'no-go',
    verification: ['79-agent skeptical review', 'interval-rigorous corridor run', 'Burgers/imp-1327 cross-check'],
    thread: 'pt-floor',
    route: '/pt-floor-audit',
    date: '2026-07',
  },
  {
    statement: 'Raw tiling: a uniform raw-tiling atlas at the anchor cell width over the open family (every window parameter, both seam sides) needs more than 7.2e26 cells — pointwise tiling is not a viable global architecture.',
    grade: 'no-go',
    verification: ['independent re-derivation from the four stated ingredients (module imp-95049)', 'frozen spec constant confirmed (imp-95012)'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },
  {
    statement: 'Localized-barrier sum no-go on both sides: the last quantitative lever of the sub-0.14 program closes — prime side, the Fresnel packet width sits below the unconditional zero-free-region barrier at the paper heights (even GRH for L(s,χ mod p≤97) gives zero cancellation); zero side, 59.26% of the p=97 majorant mass sits at α_{k,h} > 1, outside Montgomery’s proven pair-correlation range, gating on the conjecture proper. Assessment only — changes no bound; no refereed bound is changed; RH open.',
    grade: 'no-go',
    verification: ['module imp-95519-localized-barrier-sum-prime-zero-nogo', 'Gauss–Plancherel alias lemma verified to 1e-12 at p = 7, 13, 97'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },

  // ── novel routes J/K/L/M (2026-09-23 non-stat-mech external-input hunt) ─────
  {
    statement: 'Novel route J (Weil–Deligne import to Z): every engine lands on a known wall — Weil positivity (missing Spec Z ×_F1 Spec Z self-product), the classical Landau-pole c/log t zero-free region (Fejér floor R ≥ 5.8284), or PCC (tensor square); no external arithmetic input reaches Z.',
    grade: 'no-go',
    verification: ['module rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23 (ROUTE_J)', 'Fejér ladder + 3-4-1 constant independently re-derived twice (imp-96050, imp-96073)'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },
  {
    statement: 'Novel route K (RMT/moments/ratios): moments constrain zeros only through Littlewood’s integrated lemma; the sole pointwise-sensitive channel (negative moments) is RH-equivalent and reduces to the Levinson–Conrey mollifier lineage. Wall = Jensen/integration, ceiling = Lindelöf ⇒ Density Hypothesis.',
    grade: 'no-go',
    verification: ['module rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23 (ROUTE_K)', 'Littlewood I(T) vs Jensen-from-moments measured to T=500 (loss 10x→2828x)'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },
  {
    statement: 'Novel route L (Li–Herglotz–CMV finite truncation, no zero input): reality is forced non-circularly and the 400×400 CMV matrix reproduces 39 zeros to 1e-12, but completeness is Weil positivity and the measured detector reach law is sublinear in N — the certificate stays verified-height-dominated, not a lever.',
    grade: 'no-go',
    verification: ['module rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23 (ROUTE_L)', 'reach extension to N=800 (imp-96045) + dps-independence sweep (imp-96068)'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },
  {
    statement: 'Novel route M (Nyman–Beurling via Vasyunin cotangent sums + Bettin–Conrey reciprocity): the reciprocity law is the Estermann functional equation of ζ itself, so every truncation of its descent leaves the Gram matrix indefinite — the route collapses to the Möbius-mollifier lineage with no non-perturbative escape.',
    grade: 'refuted',
    verification: ['module rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23', 'exact Vasyunin Gram to N=500: d_N² logN / Σ|ρ|⁻² = 0.998'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },
  {
    statement: 'Route M eigen-drift candidate RULED OUT: the sub-leading Vasyunin prolate eigen-spectrum (λ₁..λ₆, N=250..6000) is as strictly monotone-decreasing (0 upward steps each) and as uncorrelated with the w≈4.08 ratio(N) residual swing (max |corr|=0.064, spectral-gap ratios max 0.072) as λ_min, eliminating the eigen-drift alternative and strengthening the imp-96189 low-conductor (q=4,5) arithmetic-band attribution; band uniqueness vs a smooth non-spectral drift remains open.',
    grade: 'measured',
    verification: ['module imp-96203-route-m-vasyunin-subleading-spectrum', 'exact eigvalsh of the Vasyunin Gram to N=6000, d_N² reproduces imp-96105 bit-for-bit'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },
  {
    statement: 'Route B/D worst-support on-line margin ρ(32,T) extended to γ₂₀₀₀ (T≈2515): the fitted reciprocal-log floor keeps FALLING (0.16030 → 0.11063 → 0.07061, no plateau) and the reciprocal-log/log-linear R² gap REVERSES SIGN (+0.00214 → −0.01042), so the log-linear no-floor law now fits marginally better — overturning the earlier "floor law clearly wins" reading. The SIGN is unchanged: the margin stays strictly positive with no crossing (0.4171 at T≈2515); the uniform-in-T obstruction remains off the line (Weil-positivity strength).',
    grade: 'measured',
    verification: ['module imp-96209-route-bd-online-margin-floor-gamma2000', 'reproduces imp-96148/imp-96167/imp-96186 baked columns to |delta|<=0.0004, extends census 1000->2000 zeros'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },
  {
    statement: 'Novel route C (twisted-ladder signed interferometer Φ_ε(s)=Σ_χ ε_χ L(s,χ)): REFUTED as an off-line-nonvanishing lever — the functional equation pins each conjugate pair’s relative phase to the root number (arg W=2 arctan κ), so orthogonality is only a mean-square (Parseval) statement and joint universality forces ≫T off-line zeros for every ≥2-arm design; a concrete q=5 Davenport–Heilbronn superposition measures 8 off-line zeros vs 0 for the arm-union.',
    grade: 'refuted',
    verification: ['module rh-route-c-signed-interferometer-2026-09-23', 'q=5 superposition-vs-union off-line zero count 8 vs 0 (imp-96029), FE phase-pinning arg W=2 arctan κ verified to 1e-15'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },
  {
    statement: 'Route I (semilocal S={∞,2} Sonine/prolate trace identity, Connes–Consani style): the identity Tr(ϑ(f)PP̂_SP)=W_∞+W_2+D_S is EXACT and its trace side is unconditionally positive (min multiplier 0.0650), but the explicit remainder D_S carries log-cusp singularities at every ρ=2^k; Weil positivity on g-support<ln3 reduces to the inequality D_S≤L_S, saturated to 96.7%/99.71% on the pole-free minimizer — not gap-free, no unconditional extension past ln2.',
    grade: 'no-go',
    verification: ['module rh-route-i-semilocal-sonine-trace-identity-2026-09-23', 'trace-side positivity Lhat_S(0)=0.0650 verified on [0,250] step 0.01'],
    thread: 'rh-novel-routes',
    route: '/rh-novel-routes-roadmap',
    date: '2026-09',
  },

  // ── number-variance mean/max-anchor frontier ────────────────────────────────
  {
    statement: 'Number-variance mean-anchor window-count significance verdict: recovering the imp-95562 tiled window count n_w(T) from deterministic geometry (no zeros bundle) decides the three below-envelope mean-anchor dips — T=1.5e5 (−16.0%) is a real ~1.9σ excursion, T=1e4 and T=3e5 are noise (0.37σ, 0.08σ) — confirming the mean anchor genuinely under-caps at T=1.5e5.',
    grade: 'measured',
    verification: ['module imp-96089-mean-anchor-window-count-significance-verdict', 'n_w(T) tiling geometry reproduces imp-95562 nWindows exactly (75, 130, 198, 291, 411, 443)'],
    thread: 'number-variance',
    route: null,
    date: '2026-09',
  },
  {
    statement: 'Number-variance max-anchor out-of-sample vindication: at five brand-new held-out heights {2e4, 5e4, 1e5, 2e5, 4e5} outside the six fit heights, the imp-96049 max offset anchor caps all five (tightest +3.0% at T=5e4) while the mean anchor breaches at T=5e4 (−13.7%), resolving the imp-96070 in-sample caveat with real held-out data.',
    grade: 'measured',
    verification: ['module imp-96090-number-variance-mean-anchor-heldout-out-of-sample', 'five held-out centres over the 10^6 Odlyzko ordinates in zeros-to-1e6.js'],
    thread: 'number-variance',
    route: null,
    date: '2026-09',
  },

  // ── eliminates and refutations ──────────────────────────────────────────────────
  {
    statement: '0.1399 tail lane, K2 failure: N₁* = 220,495,706 is 4.01× the economic cutoff line, and the finite transition lane would need 219,804,718 rows (69.8× the v3 full-replay campaign) — economically dead in the verbatim endpoint-cap architecture.',
    grade: 'killed',
    verification: ['K1/K2 failure criteria of imp-95201', 'Arb repricing run (module imp-95206)'],
    thread: '0.1399-row',
    route: null,
    date: '2026-09',
  },
  {
    statement: 'Split-collar lever (Prop 4.3, 0.14 → 0.139981915): not viable — on the certified face the displaced-y margin reverses sign over a ~4–6e5-row stretch, and on the required t* face the lemma machinery fails by O(1) for both weights at every probed N; the salvage became the y-thaw package.',
    grade: 'killed',
    verification: ['sealed L12 shard minima (15 shards, 3,149,013 rows)', 'shadow producer runs (module imp-95207)'],
    thread: 'y-thaw',
    route: null,
    date: '2026-09',
  },
  {
    statement: 'Envelope pivot: envelope-scale (rather than phase-resolving) certification of the window-1 pilot is refuted on two independent grounds — every separating modulus envelope exceeds R_ex at sampled points (sup 0.34417), and the joint sub-R_ex target varies at phase scale.',
    grade: 'refuted',
    verification: ['native/gate2-interval/envprobe.c measurements', 'modules imp-95210 / imp-95145 (honest-status note)'],
    thread: 'gate-2',
    route: '/permutation-architecture',
    date: '2026-09',
  },
];

// Facet counts, precomputed once (used by the /results page and the home KPI).
export const RESULTS_BY_GRADE = GRADE_ORDER.map((grade) => ({
  grade,
  items: RESULTS.filter((r) => r.grade === grade),
})).filter((g) => g.items.length > 0);

export const RESULTS_COUNT = RESULTS.length;
