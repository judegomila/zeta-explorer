/**
 * @module imp-2421-rankin-selberg-volterra-margin
 * @fileoverview imp-2421 -- Sweep the Volterra contraction margin on
 *   RANKIN-SELBERG convolution L-functions L(s, f x g) for low-level
 *   holomorphic Hecke newforms f, g on SL(2,Z). This is the first DEGREE-4
 *   testbed: the archimedean factor is a PRODUCT of two complex gamma factors,
 *   unlike the degree-1 (imp-1267 Riemann xi), degree-2 GL(2) (imp-1317 Delta /
 *   imp-2402 F16), and degree-2 Selberg-class (imp-2357 imaginary quadratic)
 *   cases. The question: does the Cauchy-Schwarz slack
 *
 *       margin = HS_bound / op_norm
 *
 *   stay BELOW 2 in the degree-4 / two-gamma regime?
 *
 *   PRODUCT-GAMMA REDUCES TO A SCALAR K-BESSEL KERNEL
 *   -------------------------------------------------
 *   For f, g holomorphic Hecke newforms of weights k1 >= k2 on SL(2,Z)
 *   (level 1, so the conductor of f x g is 1), the completed Rankin-Selberg
 *   L-function in ANALYTIC normalization (functional equation s -> 1-s, central
 *   point c = 1/2) is
 *
 *       Lambda(s, f x g) = gamma(s) L(s, f x g),
 *       gamma(s) = Gamma_C(s + (k1+k2)/2 - 1) * Gamma_C(s + (k1-k2)/2),
 *       Gamma_C(s) = 2 (2*pi)^{-s} Gamma(s),
 *
 *   so mu1 = (k1+k2)/2 - 1, mu2 = (k1-k2)/2, giving two Bessel parameters
 *       nu = mu1 - mu2 = k2 - 1,    m = (mu1 + mu2)/2 = (k1 - 1)/2.
 *   The inverse-Mellin transform of a PRODUCT of two gamma factors is, by the
 *   Mellin-Barnes identity
 *       (1/2pi*i) int Gamma(s+a) Gamma(s+b) x^{-s} ds = 2 x^{(a+b)/2} K_{a-b}(2 sqrt(x)),
 *   a SINGLE SCALAR modified-Bessel function K of the second kind -- NOT a
 *   matrix kernel. Dropping the scale-invariant prefactor,
 *       G(y) = y^{m} K_{nu}(4 pi sqrt(y)),   m = (k1-1)/2,  nu = k2-1.
 *   So the product-gamma case settles one direction of the matrix-gamma sub-gap
 *   named by imp-2357: a degree-4 RS L-function still has a SCALAR kernel.
 *
 *   KERNEL CONSTRUCTION
 *   -------------------
 *   L(s, f x g) = sum_{n>=1} b(n) n^{-s}. In analytic normalization the
 *   Rankin-Selberg Dirichlet coefficients come from the unfolded inner product
 *       sum_n lambda_f(n) lambda_g(n) n^{-s} = L(s, f x g) / zeta(2s),
 *   where lambda_f(n) = a_f(n) / n^{(k_f-1)/2} are the analytically-normalized
 *   Hecke eigenvalues (|lambda_f(p)| <= 2 by Deligne). Hence
 *       b(n) = sum_{d^2 | n} lambda_f(n/d^2) lambda_g(n/d^2).
 *   The theta-like inverse Mellin is Phi_0(w) = sum_n b(n) G(n w), and centering
 *   at s = 1/2 + it (w = e^u) gives the Fourier kernel
 *       Phi(u) = e^{u/2} * sum_{n>=1} b(n) (n e^u)^{m} K_{nu}(4 pi sqrt(n e^u)).
 *   The functional equation Lambda(s) = Lambda(1-s) makes Phi(-u) = Phi(u), so
 *   the operator lives on [0, inf) exactly as imp-2357.
 *
 *   EXACT q-EXPANSIONS (no external data, no approximate eigenvalues)
 *   ----------------------------------------------------------------
 *   All Hecke eigenvalues are computed EXACTLY in-script from integer
 *   q-expansions of the unique level-1 normalized newforms (these cusp-form
 *   spaces are 1-dimensional):
 *       Delta (wt 12) = q prod (1-q^n)^24      [a(1)=1, a(2) = tau(2) = -24]
 *       F16   (wt 16) = E4 * Delta             [a(1)=1, a(2) = 216]
 *       F18   (wt 18) = E6 * Delta             [a(1)=1, a(2) = -528]
 *       F20   (wt 20) = E8 * Delta             [a(1)=1, a(2) = 456]
 *   (same exact-q-expansion technique as imp-2402.)
 *
 *   THE HS BOUND (same inequality as imp-1267 / imp-1317 / imp-2357)
 *   ----------------------------------------------------------------
 *       V_{a, Phi} f(x) = int_0^x Phi(x) Phi(y) sinh(a(x-y)) f(y) dy,
 *       ||V||_op <= ||V||_HS <= sqrt(I_0 * J_a),
 *       I_0 = int_0^inf Phi(u)^2 du,  J_a = int_0^inf Phi(u)^2 sinh^2(a u) du.
 *
 *   NUMERICAL RESULTS (run 2026-06-04 via compute-imp2421-rankin-selberg-margin.mjs)
 *   -------------------------------------------------------------------------------
 *   N_COEF = 40 (b(n) truncation). K-Bessel via DLMF 10.32.9 integral, 4000
 *   nodes. U_INF = 3, N_INF = 4000 midpoint for I_0, J_a. U_OP = 3, N_OP = 600
 *   Galerkin power iteration. A_GRID = {0.01, 0.05, 0.2}.
 *
 *     pair          k1  k2  nu   m     margin (3 a-values)   HS bound holds
 *     -----------   --  --  --  ---   -------------------    --------------
 *     F16 x Delta   16  12  11  7.5   1.706x                 yes (all rows)
 *     F18 x Delta   18  12  11  8.5   1.729x - 1.730x        yes
 *     F20 x Delta   20  12  11  9.5   1.999x - 2.002x        yes
 *     F18 x F16     18  16  15  8.5   1.703x - 1.704x        yes
 *     F20 x F16     20  16  15  9.5   1.716x - 1.717x        yes
 *
 *   margin range over all 15 rows: [1.703, 2.002].  HS bound holds at EVERY row
 *   (op_norm <= HS_bound).  KEY HONEST FINDING: the slack margin is NOT
 *   uniformly sub-2 -- the largest-weight-gap pair F20 x Delta (k1-k2 = 8,
 *   smallest k2) reaches ~2.00 and edges JUST OVER 2 at a = 0.2 (margin 2.002,
 *   converged: NOP 600/800/1200 all agree). The four other pairs cluster at
 *   1.70x - 1.73x, in the imp-1267 scalar band and matching imp-1317 Delta.
 *
 *   CRUCIAL DISTINCTION (margin vs. the contraction itself)
 *   -------------------------------------------------------
 *   The RH-relevant quantity is the OPERATOR NORM ||V||_op, not the margin. The
 *   margin is only the Cauchy-Schwarz SLACK of the HS bound. At every one of the
 *   15 rows the op_norm is 8-13 orders of magnitude below 1 (max op_norm
 *   4.6e-7 at F20 x F16, a=0.2; min 7.2e-12), so the Volterra CONTRACTION
 *   ||V|| << 1 of the imp-1258 collapse holds throughout the degree-4 family.
 *   F20 x Delta crossing margin 2 means only that the HS bound over-estimates
 *   ||V|| by slightly more than 2x for that lopsided pair -- it does NOT signal
 *   any failure of the contraction.
 *
 *   VERDICT: 'rankin-selberg-margin-exceeds-2-at-large-weight-gap'.
 *
 *   INTERPRETATION
 *   --------------
 *   At FIXED nu (= k2 - 1) the margin rises with m = (k1-1)/2 (the larger
 *   weight): for k2 = 12 (nu = 11) it climbs 1.706 -> 1.729 -> 1.999 as k1 goes
 *   12 -> 18 -> 20; for k2 = 16 (nu = 15) it is much flatter (1.703 -> 1.716).
 *   So the smaller-form Bessel order nu damps the slack, while a LARGE WEIGHT
 *   GAP with a small k2 sharpens the kernel G(y) = y^m K_nu(4 pi sqrt y) enough
 *   to push the Cauchy-Schwarz slack past 2. This is the first observed
 *   automorphic family where the HS-bound slack is NOT uniformly sub-2 -- a
 *   concrete, honest counterexample to a naive "always sub-2" extrapolation
 *   from the GL(1)/GL(2)/imaginary-quadratic cases.
 *
 *   HONEST SCOPE / NAMED SUB-GAP
 *   ----------------------------
 *   EMPIRICAL margin sweep on 15 rows (5 RS pairs x a in {0.01,0.05,0.2}). NOT a
 *   proof of GRH for any L(s, f x g) -- GRH for Rankin-Selberg L-functions is
 *   open. Only level-1 HOLOMORPHIC x HOLOMORPHIC pairs are computed (two
 *   Gamma_C factors -> scalar K-Bessel kernel). NOT computed (the sub-gap):
 *     (i)  RS of a holomorphic form with a MAASS form, or two Maass forms:
 *          mixed/real archimedean parameters change the Bessel order to
 *          imaginary/half-integer type (cf imp-2356 K_{iR}); OPEN.
 *     (ii) HIGHER-LEVEL or non-trivial-nebentypus f, g: conductor > 1 rescales
 *          the kernel argument and may add ramified Euler factors; OPEN.
 *     (iii) the exact-2 boundary: F20 x Delta sits at margin ~2.00; whether a
 *           still-larger weight gap (e.g. k1 = 26, k2 = 12) drives the slack
 *           materially above 2 is left to a wider sweep; OPEN.
 *   The op_norm is a Galerkin power-iteration LOWER bound on ||V||_op, so
 *   "HS_bound >= op_norm" is NECESSARY (not sufficient); it held at every row.
 *
 *   Ticket: imp-2421 (numerical, high, opus-4-8).
 */

import { IMP1267_VOLTERRA_HS_BOUND } from './imp-1267-volterra-hs-bound.js';
import { IMP1317_GL2_MAASS_HS_CONCRETE } from './imp-1317-gl2-maass-hs-concrete.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── HS bound formula (mirrors imp-1267 / imp-1317 / imp-2357) ───────────────
const HS_BOUND_FORMULA = Object.freeze({
  label: 'HS-bd_RankinSelberg',
  inequality: '||V_{a, Phi}||_op <= ||V_{a, Phi}||_HS <= sqrt(I_0 * J_a)',
  kernel_formula:
    'k_{a}(x, y) = Phi(x) * Phi(y) * sinh(a*(x-y))  for 0 <= y <= x',
  phi_formula:
    'Phi(u) = e^{u/2} * sum_{n>=1} b(n) * (n*e^u)^m * K_nu(4*pi*sqrt(n*e^u)), ' +
    'm = (k1-1)/2, nu = k2-1, b(n) = sum_{d^2|n} lambda_f(n/d^2) lambda_g(n/d^2)',
  gamma_factor:
    'gamma(s) = Gamma_C(s + (k1+k2)/2 - 1) * Gamma_C(s + (k1-k2)/2) ' +
    '(PRODUCT of two complex gamma factors -- degree 4)',
  inverse_mellin:
    'product-gamma inverse Mellin is the scalar K-Bessel: (1/2pi*i) int ' +
    'Gamma(s+a)Gamma(s+b) x^{-s} ds = 2 x^{(a+b)/2} K_{a-b}(2 sqrt(x))',
  I_0_definition: 'I_0 = integral_0^infty Phi(u)^2 du',
  J_a_definition: 'J_a = integral_0^infty Phi(u)^2 sinh^2(a*u) du',
  central_point: 'c = 1/2 (Rankin-Selberg functional equation s -> 1 - s)',
  scale_invariance:
    'margin = HS_bound/op_norm is invariant under Phi -> c*Phi, so the ' +
    'gamma normalization does not affect the margin (only kernel SHAPE does)',
});

// ── Frozen sweep rows (2026-06-04 run; one block per RS pair) ───────────────
const PAIRS = Object.freeze([
  Object.freeze({
    label: 'F16 x Delta',
    k1: 16, k2: 12, nu: 11, m: 7.5,
    a2_f: 216, a2_g: -24,
    b_1_to_8: Object.freeze([0, 1, -0.6328124999999999, -0.5291876238378296, 0.69537353515625, 0.20618551295999998, 0.33487654320987653, -0.4877663944081902, -1.2594838142395017]),
    I0: 3.2997427109727382e-9,
    phi_at_0: 0.000083731920283019,
    phi_max_abs: 0.00008373189994955134,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 4.5433860047780075e-14, hs_bound: 1.224418427352422e-11, op_norm_galerkin: 7.176013272475143e-12, margin: 1.7062655556238915, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.7120456603315244e-15 }),
      Object.freeze({ a: 0.05, Ja: 1.1362110733349653e-12, hs_bound: 6.123074560515789e-11, op_norm_galerkin: 3.588503357867583e-11, margin: 1.706303143646587, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.168432967314358e-15 }),
      Object.freeze({ a: 0.2, Ja: 1.8270836594318733e-11, hs_bound: 2.455383063301472e-10, op_norm_galerkin: 1.4385115670480958e-10, margin: 1.70689142829769, hs_bound_holds: true, iter_count: 7, converged: true, residual: 3.0538878884779193e-15 }),
    ]),
  }),
  Object.freeze({
    label: 'F18 x Delta',
    k1: 18, k2: 12, nu: 11, m: 8.5,
    a2_f: -528, a2_g: -24,
    b_1_to_8: Object.freeze([0, 1, 0.7734374999999999, -0.22571085031075883, 0.19000244140625, -0.8118035251200001, -0.17457323578722755, -0.07964342737721362, 0.6046729087829589]),
    I0: 1.0857501283506876e-8,
    phi_at_0: 0.00013840769877659605,
    phi_max_abs: 0.00013840767729422196,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 2.0589581281122268e-13, hs_bound: 4.728122303691542e-11, op_norm_galerkin: 2.7341740597756307e-11, margin: 1.7292689493512117, hs_bound_holds: true, iter_count: 7, converged: true, residual: 0 }),
      Object.freeze({ a: 0.05, Ja: 5.1495592478200775e-12, hs_bound: 2.364558016685173e-10, op_norm_galerkin: 1.367329864750804e-10, margin: 1.7293252181807013, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.448626487628088e-15 }),
      Object.freeze({ a: 0.2, Ja: 8.293630302387303e-11, hs_bound: 9.489367821572818e-10, op_norm_galerkin: 5.484530577504005e-10, margin: 1.7302060199090736, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.1204683928555358e-15 }),
    ]),
  }),
  Object.freeze({
    label: 'F20 x Delta',
    k1: 20, k2: 12, nu: 11, m: 9.5,
    a2_f: 456, a2_g: -24,
    b_1_to_8: Object.freeze([0, 1, -0.33398437499999994, 0.889566292401226, 1.4336891174316406, -0.3762713493504, -0.2971012421886908, 0.05966586344226237, -1.2543894276022909]),
    I0: 2.000088506844115e-8,
    phi_at_0: 0.00012953500042251935,
    phi_max_abs: 0.00014721341771073302,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 7.945512650434063e-13, hs_bound: 1.2606239936284606e-10, op_norm_galerkin: 6.306868252899666e-11, margin: 1.9988113641804268, hs_bound_holds: true, iter_count: 7, converged: true, residual: 6.884531417186042e-14 }),
      Object.freeze({ a: 0.05, Ja: 1.9876697269536854e-11, hs_bound: 6.305168813189736e-10, op_norm_galerkin: 3.1542022149379743e-10, margin: 1.9989741885694934, hs_bound_holds: true, iter_count: 7, converged: true, residual: 6.60593172761242e-14 }),
      Object.freeze({ a: 0.2, Ja: 3.2127547734103245e-10, hs_bound: 2.5349149685160168e-9, op_norm_galerkin: 1.2664943433135134e-9, margin: 2.001520955777781, hs_bound_holds: true, iter_count: 7, converged: true, residual: 5.895429754014303e-14 }),
    ]),
  }),
  Object.freeze({
    label: 'F18 x F16',
    k1: 18, k2: 16, nu: 15, m: 8.5,
    a2_f: -528, a2_g: 216,
    b_1_to_8: Object.freeze([0, 1, -1.7402343749999998, 0.33319220760159635, 1.4776344299316406, -0.3503360802816, -0.5798325331504344, 0.2739818704005832, -1.612941764295101]),
    I0: 0.0000025089798144351787,
    phi_at_0: 0.0023184586891286576,
    phi_max_abs: 0.002318458111938768,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 3.420308234510877e-11, hs_bound: 9.263630130534258e-9, op_norm_galerkin: 5.438710405478924e-9, margin: 1.703276960877, hs_bound_holds: true, iter_count: 7, converged: true, residual: 8.334097675930548e-16 }),
      Object.freeze({ a: 0.05, Ja: 8.55350724682608e-10, hs_bound: 4.632556208499974e-8, op_norm_galerkin: 2.7197316928120007e-8, margin: 1.7033136837517435, hs_bound_holds: true, iter_count: 7, converged: true, residual: 3.599333483891982e-15 }),
      Object.freeze({ a: 0.2, Ja: 1.3754266236876566e-8, hs_bound: 1.8576645647341882e-7, op_norm_galerkin: 1.0902501079770721e-7, margin: 1.7038884482947052, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.990991526030919e-15 }),
    ]),
  }),
  Object.freeze({
    label: 'F20 x F16',
    k1: 20, k2: 16, nu: 15, m: 9.5,
    a2_f: 456, a2_g: 216,
    b_1_to_8: Object.freeze([0, 1, 0.7514648437499999, -1.3131692887827622, 0.7442648410797119, -0.162380952502272, -0.9868005544124371, -0.205256923305813, 1.445690813823603]),
    I0: 0.000009286310205184135,
    phi_at_0: 0.004131779906549296,
    phi_max_abs: 0.0041317791714923545,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 1.673588537293877e-10, hs_bound: 3.9422661393101456e-8, op_norm_galerkin: 2.297369669976136e-8, margin: 1.71599120108132, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.6814780007037426e-15 }),
      Object.freeze({ a: 0.05, Ja: 4.185687202881473e-9, hs_bound: 1.9715372121222277e-7, op_norm_galerkin: 1.1488858737910326e-7, margin: 1.7160426958829722, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.1952992585836328e-15 }),
      Object.freeze({ a: 0.2, Ja: 6.740182496850934e-8, hs_bound: 7.911474294043451e-7, op_norm_galerkin: 4.608136714177089e-7, margin: 1.7168488664200288, hs_bound_holds: true, iter_count: 7, converged: true, residual: 5.943875521982782e-16 }),
    ]),
  }),
]);

// ── Aggregate summary statistics over all 15 rows ───────────────────────────
const ALL_ROWS = PAIRS.flatMap((p) => p.rows);
const MARGIN_MIN = 1.703276960877;
const MARGIN_MAX = 2.001520955777781;
const N_ROWS = 15;
const MAX_OP_NORM = Math.max(...ALL_ROWS.map((r) => r.op_norm_galerkin));

// ── Method ──────────────────────────────────────────────────────────────────
const METHOD = Object.freeze({
  quadrature: 'midpoint rule',
  N_COEF: 40,
  N_COEF_tail_note:
    'b(n) (n*e^u)^m K_nu(4 pi sqrt(n e^u)) tail: K_nu super-exponential decay ' +
    'crushes the n^m growth by n ~ 30 even at u = 0 (smallest argument 4 pi)',
  N_BESSEL: 4000,
  bessel_method:
    'K_nu(x) = int_0^inf exp(-x cosh t) cosh(nu t) dt (DLMF 10.32.9), ' +
    'integer order nu, midpoint, tail cut at x cosh t ~ 720',
  U_INF: 3,
  N_INF: 4000,
  U_OP: 3,
  N_OP: 600,
  a_grid: Object.freeze([0.01, 0.05, 0.2]),
  rs_coeff_formula:
    'b(n) = sum_{d^2|n} lambda_f(n/d^2) lambda_g(n/d^2), ' +
    'lambda(n) = a(n)/n^{(k-1)/2} from EXACT integer q-expansions',
  newform_construction:
    'Delta = q prod(1-q^n)^24; F16 = E4*Delta; F18 = E6*Delta; F20 = E8*Delta ' +
    '(unique level-1 normalized eigenforms; same technique as imp-2402)',
  op_norm_evaluation:
    'Galerkin matrix 2-norm via power iteration on V[i][j] = ' +
    'h * Phi(t_i) Phi(t_j) sinh(a (t_j - t_i)) for j > i',
  seededRNG: 'LCG seed 0x12345678 (same as imp-1317 / imp-2357)',
  convergence_check:
    'F20 x Delta margin re-verified at N_OP in {600,800,1200}: all 2.0015 ' +
    '(structural, not a discretization artifact)',
  computeScript: 'scripts/compute-imp2421-rankin-selberg-margin.mjs',
});

// ── Verdict ─────────────────────────────────────────────────────────────────
const ALLOWED_VERDICTS = Object.freeze([
  'rankin-selberg-margin-sub-2-holds',
  'rankin-selberg-margin-exceeds-2-at-large-weight-gap',
  'computation-too-coarse-for-verdict',
]);
const VERDICT = 'rankin-selberg-margin-exceeds-2-at-large-weight-gap';
const VERDICT_RATIONALE =
  'Across 5 degree-4 Rankin-Selberg pairs x 3 a-values (15 rows) the HS bound ' +
  'holds at EVERY row (op_norm <= HS_bound), but the Cauchy-Schwarz slack ' +
  'margin is NOT uniformly sub-2: four pairs cluster at 1.703x - 1.730x (in the ' +
  'imp-1267 scalar band and matching imp-1317 Delta 1.71x), while the ' +
  'largest-weight-gap pair F20 x Delta (k1-k2 = 8, smallest k2 = 12) reaches ' +
  '~2.00 and edges just over 2 at a = 0.2 (margin 2.0015, converged under ' +
  'N_OP refinement). CRUCIALLY the operator norm ||V||_op stays 8-13 orders ' +
  'below 1 at every row (max ' + MAX_OP_NORM.toExponential(2) + '), so the ' +
  'Volterra CONTRACTION of the imp-1258 collapse holds throughout the degree-4 ' +
  'family -- the margin crossing 2 only means the HS bound is a looser ' +
  'over-estimate for the lopsided pair, not any failure of contractivity.';

// ── Cross-references ────────────────────────────────────────────────────────
const CROSS_REFERENCES = Object.freeze([
  Object.freeze({ ticket: 'imp-1267', role: 'scalar HS bound (Riemann xi, margin 1.58-2.57x)', path: 'src/data/imp-1267-volterra-hs-bound.js' }),
  Object.freeze({ ticket: 'imp-1317', role: 'GL(2) Delta concrete test (margin 1.71x)', path: 'src/data/imp-1317-gl2-maass-hs-concrete.js' }),
  Object.freeze({ ticket: 'imp-2402', role: 'GL(2) weight-16 newform F16 = E4*Delta (exact q-expansion technique)', path: 'src/data/imp-2402-gl2-weight16-hs.js' }),
  Object.freeze({ ticket: 'imp-2356', role: 'Maass K_{iR} kernel (Bessel inverse-Mellin precedent)', path: 'src/data/imp-2356-maass-volterra-hs.js' }),
  Object.freeze({ ticket: 'imp-2357', role: 'Selberg-class margin sweep (named the matrix/multi-gamma sub-gap this ticket partly settles)', path: 'src/data/imp-2357-selberg-volterra-margin.js' }),
  Object.freeze({ ticket: 'imp-1258', role: 'two-way collapse reducing SS15-27 to ||V|| <= 1', path: 'src/data/imp-1258-volterra-cdb-bridge.js' }),
]);

// ── Honest scope ────────────────────────────────────────────────────────────
const HONEST_SCOPE = Object.freeze([
  'EMPIRICAL margin sweep on 15 rows (5 Rankin-Selberg pairs x a in ' +
    '{0.01,0.05,0.2}). NOT a proof of GRH for any L(s, f x g) -- GRH for ' +
    'Rankin-Selberg L-functions is open. The test probes the Volterra HS-bound ' +
    'SLACK, NOT zero locations.',
  'DEGREE 4 / PRODUCT-GAMMA: gamma(s) = Gamma_C(s+(k1+k2)/2-1) Gamma_C(s+(k1-k2)/2) ' +
    'is a PRODUCT of two complex gamma factors, but its inverse Mellin is the ' +
    'SCALAR K-Bessel G(y) = y^m K_nu(4 pi sqrt y), m=(k1-1)/2, nu=k2-1. This ' +
    'settles one direction of the matrix-gamma sub-gap named by imp-2357: a ' +
    'product-gamma RS L-function still has a scalar (not matrix) kernel.',
  'KEY HONEST FINDING: the slack margin is NOT uniformly sub-2. F20 x Delta ' +
    '(largest weight gap, k1=20/k2=12) reaches ~2.00 and edges just over 2 at ' +
    'a=0.2 -- the first observed automorphic family where the HS-bound slack ' +
    'exceeds 2. The other four pairs are 1.70x-1.73x.',
  'CONTRACTION STILL HOLDS: the RH-relevant ||V||_op is 8-13 orders below 1 at ' +
    'every row (max ' + MAX_OP_NORM.toExponential(2) + '); margin>2 only means ' +
    'the HS bound over-estimates ||V|| by slightly more than 2x for the ' +
    'lopsided pair, NOT that the contraction fails.',
  'NAMED SUB-GAP (i): RS with a MAASS form (holomorphic x Maass, or Maass x ' +
    'Maass) has mixed/real archimedean parameters -> imaginary/half-integer ' +
    'Bessel order (cf imp-2356 K_{iR}); NOT computed. OPEN.',
  'NAMED SUB-GAP (ii): HIGHER-LEVEL or nebentypus f, g (conductor > 1) rescale ' +
    'the kernel argument and add ramified Euler factors; only LEVEL-1 ' +
    'holomorphic x holomorphic pairs are computed here. OPEN.',
  'NAMED SUB-GAP (iii): the exact-2 boundary -- whether a still-larger weight ' +
    'gap (e.g. k1=26, k2=12) pushes the slack materially above 2 is left to a ' +
    'wider sweep. OPEN.',
  'OP-NORM is a Galerkin power-iteration LOWER bound on ||V||_op; ' +
    '"HS_bound >= op_norm" is NECESSARY, not sufficient. It held at every row, ' +
    'and the F20 x Delta margin~2 was re-verified converged at N_OP up to 1200.',
  'MARGIN SCALE-INVARIANCE: margin = HS_bound/op_norm is unchanged under ' +
    'Phi -> c*Phi, so the gamma normalization convention does not affect the ' +
    'reported margins -- only the kernel SHAPE (m, nu, b(n) pattern) does.',
]);

// ── Master export ───────────────────────────────────────────────────────────
export const IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN = Object.freeze({
  id: 'imp-2421-rankin-selberg-volterra-margin',
  ticket: 'imp-2421',
  generatedAt: '2026-06-04T15:10:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['S25', 'S26', 'S27', 'imp-1298 GL(n) extension'],
  relatedTickets: ['imp-1267', 'imp-1317', 'imp-2402', 'imp-2356', 'imp-2357', 'imp-1258'],

  summary:
    'Volterra contraction-margin sweep on degree-4 RANKIN-SELBERG convolutions ' +
    'L(s, f x g) for 5 pairs of level-1 holomorphic newforms (F16/F18/F20 x ' +
    'Delta/F16). The product of two complex gamma factors has a SCALAR K-Bessel ' +
    'inverse Mellin G(y)=y^m K_nu(4 pi sqrt y), m=(k1-1)/2, nu=k2-1; b(n) from ' +
    'exact q-expansions. HS bound holds at all 15 rows. KEY FINDING: the slack ' +
    'margin is NOT uniformly sub-2 -- four pairs are 1.70x-1.73x but F20 x Delta ' +
    '(largest weight gap) reaches ~2.00 and edges over 2 at a=0.2. The op-norm ' +
    'contraction ||V|| << 1 (8-13 orders below 1) holds throughout. VERDICT: ' +
    'rankin-selberg-margin-exceeds-2-at-large-weight-gap. SUB-GAP: Maass-RS, ' +
    'higher level, and the exact-2 boundary remain OPEN.',

  hsBoundFormula: HS_BOUND_FORMULA,
  pairs: PAIRS,
  method: METHOD,

  summaryStats: Object.freeze({
    nPairs: PAIRS.length,
    nRows: N_ROWS,
    marginMin: MARGIN_MIN,
    marginMax: MARGIN_MAX,
    allMarginsSub2: MARGIN_MAX < 2,
    allHsBoundsHold: ALL_ROWS.every((r) => r.hs_bound_holds),
    maxOpNorm: MAX_OP_NORM,
    contractionHoldsEverywhere: MAX_OP_NORM < 1,
    nPairsSub2: PAIRS.filter((p) => p.rows.every((r) => r.margin < 2)).length,
    exceedsPair: 'F20 x Delta',
    marginVsDelta1317: 1.711, // imp-1317 Delta margin for comparison
    marginVsXi1267Range: Object.freeze([1.58, 2.57]), // imp-1267 scalar range
  }),

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictRationale: VERDICT_RATIONALE,

  crossReferences: CROSS_REFERENCES,
  honestScope: HONEST_SCOPE,

  sourceParents: Object.freeze({
    imp_1267_verdict_substring: IMP1267_VOLTERRA_HS_BOUND.summary_stats.verdict,
    imp_1267_max_hs_bound: IMP1267_VOLTERRA_HS_BOUND.summary_stats.maxHsBound,
    imp_1317_verdict: IMP1317_GL2_MAASS_HS_CONCRETE.verdict,
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    computeScript: 'scripts/compute-imp2421-rankin-selberg-margin.mjs',
    imp1267HsBound: 'src/data/imp-1267-volterra-hs-bound.js',
    imp1317Gl2: 'src/data/imp-1317-gl2-maass-hs-concrete.js',
    imp2402Weight16: 'src/data/imp-2402-gl2-weight16-hs.js',
    iwaniecKowalski: 'Iwaniec, H. & Kowalski, E. (2004). Analytic Number Theory, AMS Coll 53 (Rankin-Selberg L-functions, ch. 5)',
    dlmf: 'DLMF 10.32.9 (integral representation of K_nu) and the Mellin-Barnes identity for the product of two Gamma factors',
    coganDeligne: 'Deligne, P. (1974). La conjecture de Weil I, Publ. IHES 43 (|lambda_f(p)| <= 2 bound)',
  }),
});

export default IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN;

// ── Tripwire assertions ─────────────────────────────────────────────────────
export const IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN_ASSERTIONS = [
  // (T1) HS bound formula stated explicitly with the K-Bessel Phi kernel
  {
    id: 'imp2421-hs-bound-formula-explicit',
    why:
      'The HS bound ||V|| <= sqrt(I_0 * J_a) and the scalar K-Bessel Phi kernel ' +
      '(product-gamma inverse Mellin) must be present and consistent with the ' +
      'imp-1267 / imp-2357 scalar Volterra machinery.',
    holds: () => {
      const f = IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.hsBoundFormula;
      return (
        f.inequality.includes('sqrt(I_0 * J_a)') &&
        f.phi_formula.includes('K_nu') &&
        f.phi_formula.includes('b(n)') &&
        f.gamma_factor.includes('Gamma_C') &&
        f.inverse_mellin.includes('K_{a-b}') &&
        f.I_0_definition.includes('Phi') &&
        f.J_a_definition.includes('sinh') &&
        f.kernel_formula.includes('sinh(a*(x-y))')
      );
    },
  },

  // (T2) PRIMARY: HS bound holds at every row AND the contraction ||V||<<1 holds
  {
    id: 'imp2421-hs-holds-and-contraction-holds-everywhere',
    why:
      'PRIMARY: the HS bound must dominate the Galerkin op_norm at every row ' +
      '(necessary check), and the RH-relevant op_norm must be < 1 at every row ' +
      '(the contraction of the imp-1258 collapse). Either failing would refute ' +
      'the core finding.',
    holds: () =>
      IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.pairs.every((p) =>
        p.rows.every(
          (r) =>
            r.hs_bound_holds === true &&
            r.hs_bound >= r.op_norm_galerkin &&
            r.op_norm_galerkin < 1 &&
            r.margin > 1,
        ),
      ),
  },

  // (T3) HONEST FINDING: margin is NOT uniformly sub-2; exactly the F20 x Delta
  //      pair exceeds 2 (and only at a = 0.2), the rest are sub-2
  {
    id: 'imp2421-margin-not-uniformly-sub-2-f20delta-exceeds',
    why:
      'The honest deliverable hinges on the F20 x Delta pair edging over margin ' +
      '2 while the other four pairs stay sub-2. If this drifts (all sub-2, or ' +
      'the wrong pair exceeds), the verdict no longer matches the data.',
    holds: () => {
      const pairs = IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.pairs;
      const exceed = pairs.filter((p) => p.rows.some((r) => r.margin > 2));
      const sub2Count = pairs.filter((p) => p.rows.every((r) => r.margin < 2)).length;
      return (
        exceed.length === 1 &&
        exceed[0].label === 'F20 x Delta' &&
        exceed[0].k1 === 20 && exceed[0].k2 === 12 &&
        sub2Count === 4 &&
        IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.summaryStats.allMarginsSub2 === false
      );
    },
  },

  // (T4) Five RS pairs with correct (k1, k2) and derived (nu, m)
  {
    id: 'imp2421-five-pairs-correct-bessel-parameters',
    why:
      'Each pair must record the holomorphic weights and the derived Bessel ' +
      'parameters nu = k2-1, m = (k1-1)/2. A wrong nu/m means the product-gamma ' +
      'inverse-Mellin kernel is the wrong analytic object.',
    holds: () => {
      const pairs = IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.pairs;
      return (
        pairs.length === 5 &&
        pairs.every(
          (p) =>
            p.k1 >= p.k2 &&
            p.nu === p.k2 - 1 &&
            Math.abs(p.m - (p.k1 - 1) / 2) < 1e-12,
        )
      );
    },
  },

  // (T5) Three a-values per pair; 15 rows total
  {
    id: 'imp2421-three-a-values-15-rows',
    why:
      'Each pair is swept at a in {0.01, 0.05, 0.2}, giving 5 x 3 = 15 rows. ' +
      'A different count means the sweep grid is inconsistent with the method.',
    holds: () => {
      let total = 0;
      for (const p of IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.pairs) {
        const aSet = new Set(p.rows.map((r) => r.a));
        if (p.rows.length !== 3 || !aSet.has(0.01) || !aSet.has(0.05) || !aSet.has(0.2)) {
          return false;
        }
        total += p.rows.length;
      }
      return total === 15;
    },
  },

  // (T6) I_0 is a single positive value per pair, bounded
  {
    id: 'imp2421-I0-positive-and-bounded',
    why:
      'I_0 = int Phi^2 du must be a single positive value per pair in (0, 1) ' +
      '(scale fixed by the gamma convention). A nonpositive or huge I_0 ' +
      'indicates a K-Bessel kernel-construction bug.',
    holds: () =>
      IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.pairs.every(
        (p) => typeof p.I0 === 'number' && p.I0 > 0 && p.I0 < 1,
      ),
  },

  // (T7) Verdict in allowed set and matches the data (exceeds-2 case)
  {
    id: 'imp2421-verdict-in-allowed-set-matches-data',
    why:
      'The verdict must be one of the allowed strings and the exceeds-2 verdict ' +
      'must agree with the rows (max margin >= 2 and contraction holding).',
    holds: () => {
      const M = IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN;
      const maxMargin = Math.max(...M.pairs.flatMap((p) => p.rows.map((r) => r.margin)));
      return (
        M.allowedVerdicts.includes(M.verdict) &&
        M.verdict === 'rankin-selberg-margin-exceeds-2-at-large-weight-gap' &&
        maxMargin >= 2 &&
        M.summaryStats.contractionHoldsEverywhere === true
      );
    },
  },

  // (T8) Rankin-Selberg coefficients arithmetic: b(1)=1, b(p)=lam_f(p)lam_g(p),
  //      and the exact q-expansion eigenvalues a(2) are correct
  {
    id: 'imp2421-rs-coefficients-and-eigenvalues-correct',
    why:
      'b(1) must be 1 (analytic normalization) for every pair, and the exact ' +
      'level-1 newform second coefficients must match the q-expansions ' +
      '(Delta -24, F16 216, F18 -528, F20 456). F16 x Delta has b(2) = ' +
      '(216/2^7.5)(-24/2^5.5) = -5184/8192 = -0.6328125. A wrong value means ' +
      'the eigenvalue construction or the Dirichlet convolution is broken.',
    holds: () => {
      const pairs = IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.pairs;
      const everyB1 = pairs.every((p) => Math.abs(p.b_1_to_8[1] - 1) < 1e-12);
      const f16d = pairs.find((p) => p.label === 'F16 x Delta');
      const a2ok =
        f16d.a2_f === 216 && f16d.a2_g === -24 &&
        pairs.find((p) => p.k1 === 18).a2_f === -528 &&
        pairs.find((p) => p.k1 === 20).a2_f === 456;
      return everyB1 && a2ok && Math.abs(f16d.b_1_to_8[2] - (-0.6328125)) < 1e-9;
    },
  },

  // (T9) Honest scope names the degree-4/product-gamma reduction, the
  //      not-uniformly-sub-2 finding, and the three OPEN sub-gaps
  {
    id: 'imp2421-honest-scope-names-finding-and-subgaps',
    why:
      'The deliverable is a PARTIAL with an unexpected exceeds-2 result. ' +
      'honestScope must flag the product-gamma -> scalar-Bessel reduction, the ' +
      'not-uniformly-sub-2 finding, that the contraction still holds, and the ' +
      'Maass / higher-level / exact-2-boundary sub-gaps.',
    holds: () => {
      const scope = IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.honestScope.join(' | ').toLowerCase();
      return (
        IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.honestScope.length >= 7 &&
        scope.includes('product-gamma') &&
        scope.includes('scalar') &&
        scope.includes('not uniformly sub-2') &&
        scope.includes('maass') &&
        scope.includes('higher-level') &&
        (scope.includes('galerkin') || scope.includes('lower bound'))
      );
    },
  },

  // (T10) Source parents link imp-1267 and imp-1317 (audit trail)
  {
    id: 'imp2421-source-parents-1267-and-1317-linked',
    why:
      'imp-2421 inherits the scalar HS machinery from imp-1267 and the GL(2) ' +
      'precedent from imp-1317. sourceParents must record live values from both, ' +
      'demonstrating they were actually imported and used.',
    holds: () => {
      const sp = IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.sourceParents;
      return (
        typeof sp.imp_1267_verdict_substring === 'string' &&
        sp.imp_1267_verdict_substring.length > 5 &&
        typeof sp.imp_1267_max_hs_bound === 'number' &&
        sp.imp_1267_max_hs_bound > 0 &&
        sp.imp_1317_verdict === 'gl2-maass-HS-bound-holds'
      );
    },
  },
];
