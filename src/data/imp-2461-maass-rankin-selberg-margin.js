/**
 * @module imp-2461-maass-rankin-selberg-margin
 * @fileoverview imp-2461 -- Locate the exact-2 Cauchy-Schwarz margin boundary for
 *   the DEGREE-4 MAASS Rankin-Selberg convolution L(s, f x g). Wave-4 follow-on to
 *   imp-2421, which swept HOLOMORPHIC x HOLOMORPHIC RS pairs and found the slack
 *   margin = HS_bound/op_norm edged JUST OVER 2 at the largest weight gap
 *   (F20 x Delta ~2.00) and named the Maass-RS / exact-2 boundary OPEN
 *   (imp-2421 sub-gap (i)). This module settles the MAASS direction.
 *
 *   MAASS x MAASS RS = PRODUCT OF TWO IMAGINARY-ORDER K-BESSELS K_{iR1} K_{iR2}
 *   --------------------------------------------------------------------------
 *   For two even self-dual level-1 Maass forms f, g with spectral parameters
 *   R1, R2 (Laplace eigenvalue 1/4 + R^2) the completed Rankin-Selberg
 *   L-function Lambda(s, f x g) (functional equation s -> 1-s, central c = 1/2)
 *   has archimedean factor a PRODUCT of FOUR real gamma factors at the spectral
 *   combinations +-i(R1+R2), +-i(R1-R2):
 *       gamma(s) = Gamma_R(s+i(R1+R2)) Gamma_R(s+i(R1-R2))
 *                  Gamma_R(s-i(R1-R2)) Gamma_R(s-i(R1+R2)),  Gamma_R(s)=pi^{-s/2}Gamma(s/2).
 *   The classical Mellin transform of a PRODUCT of two K-Bessels (Gradshteyn-
 *   Ryzhik 6.576.4) is exactly this four-gamma product:
 *       int_0^inf K_mu(x) K_nu(x) x^{s-1} dx
 *         = (2^{s-3}/Gamma(s)) Gamma((s+mu+nu)/2) Gamma((s+mu-nu)/2)
 *                              Gamma((s-mu+nu)/2) Gamma((s-mu-nu)/2),
 *   so with mu = iR1, nu = iR2 the inverse-Mellin kernel of the degree-4 Maass-RS
 *   gamma factor is the SCALAR product G(y) = K_{iR1}(c sqrt y) K_{iR2}(c sqrt y),
 *   NOT a 2x2 matrix. (The 1/Gamma(s) twist is the zeta(2s) removed by the
 *   d^2-sum in the Rankin-Selberg coefficients, exactly as imp-2421.) This is the
 *   imaginary-order analogue of imp-2421s holomorphic y^m K_nu kernel and
 *   RESOLVES imp-2421 sub-gap (i) for the self-dual Maass case: a Maass-RS
 *   L-function still has a SCALAR (product-of-two-K-Bessel) kernel.
 *
 *   KERNEL CONSTRUCTION
 *   -------------------
 *   b(n) = sum_{d^2|n} a_f(n/d^2) a_g(n/d^2) (unfolded inner product / zeta(2s)),
 *       Phi(u) = e^{u/2} sum_{n>=1} b(n) K_{iR1}(4 pi sqrt(n e^u)) K_{iR2}(4 pi sqrt(n e^u)),
 *   Phi(-u)=Phi(u) by Lambda(s)=Lambda(1-s); the Volterra operator lives on
 *   [0,inf) as in imp-2356 / imp-2421. The HS bound is the same inequality:
 *       ||V||_op <= ||V||_HS <= sqrt(I_0 J_a),  I_0=int Phi^2, J_a=int Phi^2 sinh^2(a u).
 *
 *   ARITHMETIC ANCHOR (no fabricated eigenvalues)
 *   ---------------------------------------------
 *   Only ONE level-1 Maass form has in-repo tabulated Hecke data: the first even
 *   SL(2,Z) Maass form, R = 9.533695261353925, a(1..6) from imp-2356 (a(1)=1,
 *   Hejhal/Then/LMFDB, Hecke-multiplicative fill). The genuine ARITHMETIC
 *   Maass-RS pair is therefore the self-Rankin-Selberg f x f (= zeta(s)
 *   L(s, sym^2 f)), b(n) = sum_{d^2|n} a(n/d^2)^2, kernel K_{iR}^2.
 *
 *   NUMERICAL RESULTS (run 2026-06-04 via compute-imp2461-maass-rs-margin.mjs)
 *   -------------------------------------------------------------------------
 *   K_{iR}(x) via cos-integral DLMF (8000 nodes); U_INF=2.5/3, N_INF=4000,
 *   U_OP=2.5/3, N_OP=600 Galerkin power iteration.
 *
 *   (1) ARITHMETIC ANCHOR (self-RS f x f, R=9.5337), a in {0.01,0.05,0.2}:
 *       margin = 1.4738x at ALL three a-values (FLAT in a -- kernel-shape
 *       dominated). HS bound holds at every row. op_norm ~ 2.8e-35 to 5.5e-34,
 *       i.e. the RH-relevant contraction ||V|| sits ~34 ORDERS OF MAGNITUDE
 *       below 1. So the genuine degree-4 Maass-RS slack is WELL sub-2 (1.47x,
 *       even below imp-2421s holomorphic 1.70x-2.00x band), and ||V|| << 1 holds
 *       by ~34 orders -- DIRECTLY answering the ticket headline (yes, the op-norm
 *       stays orders below 1, NOT just the HS bound).
 *
 *   (2) ARCHIMEDEAN R-SWEEP (pure K_{iR}^2 envelope, b(n)=delta_{n,1}) to LOCATE
 *       the exact-2 boundary in spectral-parameter space. Margin rises MONOTONE
 *       with R across the well-resolved window R in [4,16]:
 *           R    4     6     8    9.53   11    12    13    14    15    16
 *         margin 1.459 1.462 1.467 1.474 1.488 1.507 1.542 1.618 1.812 2.353
 *       crossing margin = 2 at R* ~ 15.35 (linear interp between R=15 margin
 *       1.812 and R=16 margin 2.353, both op_norm > 1e-47, safely resolved).
 *       So the Maass-RS HS-slack crosses 2 only for spectral parameter R >~ 15.35;
 *       the genuine first Maass form (R=9.53) sits COMFORTABLY BELOW it.
 *
 *   KEY HONEST FINDINGS
 *   -------------------
 *   - The genuine arithmetic Maass-RS pair (f x f) has margin 1.47x and op_norm
 *     ~34 orders below 1: the contraction is the load-bearing quantity and it is
 *     overwhelmingly satisfied; the HS-slack is well sub-2.
 *   - The exact-2 boundary EXISTS for the Maass family and is LOCATED at spectral
 *     parameter R* ~ 15.35 (archimedean envelope), well ABOVE the first Maass
 *     eigenvalue R=9.53. This is the imaginary-order analogue of imp-2421s
 *     holomorphic finding that the slack crosses 2 only at a sharp-kernel extreme.
 *   - At EVERY computed row (anchor and archimedean) op_norm <= HS_bound holds
 *     and op_norm << 1, so the imp-1258 collapse contraction holds throughout.
 *
 *   VERDICT: 'maass-rs-arithmetic-sub-2-archimedean-crossing-at-R-15'.
 *
 *   HONEST SCOPE / NAMED SUB-GAPS
 *   -----------------------------
 *   EMPIRICAL margin study. NOT a proof of GRH for any L(s, f x g) (open). The
 *   op_norm is a Galerkin power-iteration LOWER bound: "HS_bound >= op_norm" is
 *   NECESSARY, not sufficient (held at every row). NOT computed:
 *     (i)   DISTINCT-form Maass pairs f x g (R1 != R2): only ONE level-1 Maass
 *           form has in-repo Hecke data, so the arithmetic anchor is the self-RS
 *           f x f. Distinct-form pairs need a second forms eigenvalues. OPEN
 *           (sub-gap imp-2461-distinct-maass-pair).
 *     (ii)  The archimedean R-sweep STRIPS the arithmetic (b(n)=delta_{n,1}); it
 *           is a kernel-SHAPE locus, not an arithmetic margin. Only R=9.5337
 *           carries real Hecke data. Whether a real Maass form with R >~ 15.35
 *           and its b(n) actually crosses 2 is left to second-form data. OPEN.
 *     (iii) PRECISION LIMIT: for R >~ 18 the K_{iR}(4 pi e^{u/2})^2 envelope is
 *           suppressed by ~exp(-pi R) and op_norm underflows toward double-
 *           precision noise (R=18 margin jumps non-monotonically to 4.11, R=20
 *           to 3.29), so margins beyond R~16 are NOT reliable; the trustworthy
 *           monotone window is R in [4,16]. OPEN (higher-precision arithmetic).
 *     (iv)  HIGHER-LEVEL / nebentypus Maass forms (conductor > 1) rescale the
 *           kernel argument and add ramified factors; only level-1 here. OPEN
 *           (shared with imp-2421 sub-gap (ii)).
 *
 *   Ticket: imp-2461 (numerical, medium, opus-4-8). dependsOn imp-2421.
 */

import { IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN } from './imp-2421-rankin-selberg-volterra-margin.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── HS bound formula (mirrors imp-1267 / imp-2356 / imp-2421) ───────────────
const HS_BOUND_FORMULA = Object.freeze({
  label: 'HS-bd_MaassRankinSelberg',
  inequality: '||V_{a, Phi}||_op <= ||V_{a, Phi}||_HS <= sqrt(I_0 * J_a)',
  kernel_formula: 'k_{a}(x, y) = Phi(x) * Phi(y) * sinh(a*(x-y))  for 0 <= y <= x',
  phi_formula:
    'Phi(u) = e^{u/2} * sum_{n>=1} b(n) * K_{iR1}(4*pi*sqrt(n*e^u)) * ' +
    'K_{iR2}(4*pi*sqrt(n*e^u)), b(n) = sum_{d^2|n} a_f(n/d^2) a_g(n/d^2)',
  gamma_factor:
    'gamma(s) = Gamma_R(s+i(R1+R2)) Gamma_R(s+i(R1-R2)) Gamma_R(s-i(R1-R2)) ' +
    'Gamma_R(s-i(R1+R2)) (PRODUCT of FOUR real gamma factors -- degree 4)',
  inverse_mellin:
    'product-of-two-K-Bessel Mellin (Gradshteyn-Ryzhik 6.576.4): int K_mu K_nu ' +
    'x^{s-1} dx = (2^{s-3}/Gamma(s)) prod Gamma((s +- mu +- nu)/2); with mu=iR1, ' +
    'nu=iR2 the inverse Mellin is the SCALAR G(y)=K_{iR1}(c sqrt y) K_{iR2}(c sqrt y)',
  I_0_definition: 'I_0 = integral_0^infty Phi(u)^2 du',
  J_a_definition: 'J_a = integral_0^infty Phi(u)^2 sinh^2(a*u) du',
  central_point: 'c = 1/2 (Rankin-Selberg functional equation s -> 1 - s)',
  scale_invariance:
    'margin = HS_bound/op_norm is invariant under Phi -> c*Phi, so the gamma ' +
    'normalization does not affect the margin (only kernel SHAPE does)',
});

// ── First even SL(2,Z) Maass form (imp-2356 arithmetic data) ────────────────
const MAASS_FORM = Object.freeze({
  label: 'first even SL(2,Z) Maass cusp form',
  R_SPEC: 9.533695261353925,
  a1_to_6: Object.freeze([1, 1.549304477, 0.246899772, 1.549304477 * 1.549304477 - 1, 0.722110000, 1.549304477 * 0.246899772]),
  source: 'imp-2356 (Hejhal/Then/LMFDB; a(1)=1, Hecke-multiplicative fill)',
});

// ── (1) ARITHMETIC ANCHOR: self-RS f x f (2026-06-04 run) ───────────────────
const ANCHOR = Object.freeze({
  label: 'self-RS f x f',
  pair: 'Maass(R=9.5337) x Maass(R=9.5337)',
  R1: 9.533695261353925,
  R2: 9.533695261353925,
  kernel: 'K_{iR}(4 pi sqrt(n e^u))^2',
  b_1_to_6: Object.freeze([1, 2.4003443624522434, 0.06095949741365198, 2.9609643334517797, 0.5214428521000001, 0.14632378595478163]),
  I0: 5.628412047231801e-32,
  phi_max_abs: 1.011975994728602e-15,
  rows: Object.freeze([
    Object.freeze({ a: 0.01, Ja: 2.950218911519804e-38, hs_bound: 4.074929160558396e-35, op_norm_galerkin: 2.764890948054774e-35, margin: 1.4738118924456292, hs_bound_holds: true, iter_count: 7, converged: true, residual: 2.0200701695968894e-15 }),
    Object.freeze({ a: 0.05, Ja: 7.375707264058521e-37, hs_bound: 2.0374866777940434e-34, op_norm_galerkin: 1.382460500513385e-34, margin: 1.473811857219364, hs_bound_holds: true, iter_count: 7, converged: true, residual: 2.585633607708548e-15 }),
    Object.freeze({ a: 0.2, Ja: 1.1805132526119207e-35, hs_bound: 8.1513281205689e-34, op_norm_galerkin: 5.530781362466488e-34, margin: 1.4738113091734588, hs_bound_holds: true, iter_count: 7, converged: true, residual: 2.8001516644589405e-15 }),
  ]),
});

// ── (2) ARCHIMEDEAN R-SWEEP: pure K_{iR}^2 envelope (b(n)=delta_{n,1}) ───────
// a = 0.05 (margin is flat in a). Reliable monotone window R in [4,16];
// R >= 18 rows are precision-limited (op_norm underflowing toward fp noise).
const ARCHIMEDEAN_SWEEP = Object.freeze([
  Object.freeze({ R: 4, margin: 1.4590167227158652, op_norm: 1.4779399398821802e-29, hs_bound: 2.1563390874577814e-29, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 6, margin: 1.46155651976962, op_norm: 7.210063711847668e-31, hs_bound: 1.0537915626005307e-30, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 8, margin: 1.466627785768559, op_norm: 9.649063782275839e-33, hs_bound: 1.415158504973881e-32, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 9.533695261353925, margin: 1.474183717543499, op_norm: 1.3813574292504693e-34, hs_bound: 2.036374630308788e-34, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 11, margin: 1.4883590751898519, op_norm: 1.039091403846784e-36, hs_bound: 1.5465411208671244e-36, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 12, margin: 1.506853678919983, op_norm: 2.2243236562986542e-38, hs_bound: 3.351730284602375e-38, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 13, margin: 1.542082294732192, op_norm: 3.020959065544556e-40, hs_bound: 4.658567488086967e-40, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 14, margin: 1.6184486042796065, op_norm: 2.480641758619944e-42, hs_bound: 4.014791191956157e-42, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 15, margin: 1.8123825166179794, op_norm: 1.1622293183171554e-44, hs_bound: 2.1064040968188448e-44, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 16, margin: 2.3527929869419117, op_norm: 3.0319662665058144e-47, hs_bound: 7.133588968479331e-47, hs_bound_holds: true, reliable: true }),
  Object.freeze({ R: 18, margin: 4.113106038896042, op_norm: 1.1195652831126605e-52, hs_bound: 4.6048907269090415e-52, hs_bound_holds: true, reliable: false }),
  Object.freeze({ R: 20, margin: 3.293404009038256, op_norm: 7.462227617030293e-58, hs_bound: 2.4576130350283558e-57, hs_bound_holds: true, reliable: false }),
  Object.freeze({ R: 25, margin: 3.6051703499853773, op_norm: 2.7677547718428653e-71, hs_bound: 9.978227439478441e-71, hs_bound_holds: true, reliable: false }),
]);

const MARGIN_TWO_CROSSING_R = 15.347175885155517; // linear interp R=15 -> R=16

// ── Method ──────────────────────────────────────────────────────────────────
const METHOD = Object.freeze({
  quadrature: 'midpoint rule',
  bessel_method:
    'K_{iR}(x) = int_0^inf cos(R t) exp(-x cosh t) dt (imaginary order), ' +
    'midpoint 8000 nodes, tail cut at x cosh t ~ 720',
  N_MAASS: 6,
  anchor_grid: Object.freeze({ U_INF: 2.5, N_INF: 4000, U_OP: 2.5, N_OP: 600 }),
  arch_grid: Object.freeze({ U_INF: 3.0, N_INF: 4000, U_OP: 3.0, N_OP: 600 }),
  a_grid_anchor: Object.freeze([0.01, 0.05, 0.2]),
  a_arch: 0.05,
  rs_coeff_formula: 'b(n) = sum_{d^2|n} a_f(n/d^2) a_g(n/d^2); self-RS: a(n/d^2)^2',
  op_norm_evaluation:
    'Galerkin matrix 2-norm via power iteration on V[i][j] = ' +
    'h * Phi(t_i) Phi(t_j) sinh(a (t_j - t_i)) for j > i',
  seededRNG: 'LCG seed 0x12345678 (same as imp-1317 / imp-2356 / imp-2421)',
  precision_window: 'reliable monotone archimedean window R in [4,16]; R>=18 underflow-limited',
  computeScript: 'scripts/compute-imp2461-maass-rs-margin.mjs',
});

// ── Verdict ─────────────────────────────────────────────────────────────────
const ALLOWED_VERDICTS = Object.freeze([
  'maass-rs-arithmetic-sub-2-archimedean-crossing-at-R-15',
  'maass-rs-margin-exceeds-2-for-arithmetic-form',
  'computation-too-coarse-for-verdict',
]);
const VERDICT = 'maass-rs-arithmetic-sub-2-archimedean-crossing-at-R-15';
const VERDICT_RATIONALE =
  'The genuine degree-4 MAASS Rankin-Selberg arithmetic anchor (self-RS f x f of ' +
  'the first SL(2,Z) Maass form, R=9.5337, kernel K_{iR}^2) has Cauchy-Schwarz ' +
  'slack margin 1.4738x at all three a-values (FLAT in a -- below imp-2421s ' +
  'holomorphic 1.70x-2.00x band) with the RH-relevant op_norm ~34 ORDERS below 1 ' +
  '(max ' + ANCHOR.rows[2].op_norm_galerkin.toExponential(2) + '), so the ' +
  'contraction of the imp-1258 collapse is the load-bearing quantity and is ' +
  'overwhelmingly satisfied. The exact-2 boundary DOES exist for the Maass family: ' +
  'the pure archimedean K_{iR}^2 envelope rises monotonically with R across the ' +
  'well-resolved window R in [4,16] and crosses margin 2 at spectral parameter ' +
  'R* ~ 15.35 -- comfortably ABOVE the first Maass eigenvalue R=9.53. This resolves ' +
  'imp-2421 sub-gap (i): the self-dual Maass-RS kernel is SCALAR (a product of two ' +
  'imaginary-order K-Bessels, not a matrix), and the slack crosses 2 only at a ' +
  'sharp-kernel extreme, mirroring the holomorphic large-weight-gap finding.';

// ── Cross-references ────────────────────────────────────────────────────────
const CROSS_REFERENCES = Object.freeze([
  Object.freeze({ ticket: 'imp-2421', role: 'holomorphic RS margin sweep (named the Maass-RS / exact-2 sub-gap this module settles)', path: 'src/data/imp-2421-rankin-selberg-volterra-margin.js' }),
  Object.freeze({ ticket: 'imp-2356', role: 'Maass K_{iR} kernel + Hecke eigenvalue data (R=9.5337)', path: 'src/data/imp-2356-maass-volterra-hs.js' }),
  Object.freeze({ ticket: 'imp-1267', role: 'scalar HS bound (Riemann xi, margin 1.58-2.57x)', path: 'src/data/imp-1267-volterra-hs-bound.js' }),
  Object.freeze({ ticket: 'imp-2357', role: 'Selberg-class margin sweep (named the multi-gamma sub-gap)', path: 'src/data/imp-2357-selberg-volterra-margin.js' }),
  Object.freeze({ ticket: 'imp-1258', role: 'two-way collapse reducing SS15-27 to ||V|| <= 1', path: 'src/data/imp-1258-volterra-cdb-bridge.js' }),
]);

// ── Honest scope ────────────────────────────────────────────────────────────
const HONEST_SCOPE = Object.freeze([
  'EMPIRICAL margin study. NOT a proof of GRH for any L(s, f x g) -- GRH for ' +
    'Rankin-Selberg L-functions is open. The test probes the Volterra HS-bound ' +
    'SLACK, NOT zero locations.',
  'DEGREE 4 / FOUR-GAMMA -> SCALAR KERNEL: the Maass x Maass RS archimedean factor ' +
    'is a PRODUCT of four real gamma factors, but its inverse Mellin is the SCALAR ' +
    'product of two imaginary-order K-Bessels G(y)=K_{iR1}(c sqrt y) K_{iR2}(c sqrt y) ' +
    '(Gradshteyn-Ryzhik 6.576.4). This RESOLVES imp-2421 sub-gap (i): a self-dual ' +
    'Maass-RS L-function still has a SCALAR (not matrix) kernel.',
  'KEY HONEST FINDING (arithmetic): the genuine self-RS f x f (R=9.5337) has ' +
    'margin 1.4738x (flat in a), BELOW imp-2421s holomorphic 1.70x-2.00x band, ' +
    'with op_norm ~34 orders below 1. The RH-relevant ||V|| << 1 is the load-' +
    'bearing quantity and holds overwhelmingly.',
  'KEY HONEST FINDING (archimedean): the pure K_{iR}^2 envelope crosses margin 2 ' +
    'at spectral parameter R* ~ 15.35 (interp R=15 margin 1.812 -> R=16 margin ' +
    '2.353), ABOVE the first Maass eigenvalue R=9.53. So the exact-2 boundary ' +
    'EXISTS for the Maass family and is LOCATED, mirroring the holomorphic ' +
    'large-weight-gap crossing of imp-2421.',
  'NAMED SUB-GAP (i): DISTINCT-form Maass pairs f x g (R1 != R2) are NOT computed ' +
    '-- only ONE level-1 Maass form has in-repo Hecke data, so the arithmetic ' +
    'anchor is the self-RS f x f. OPEN (imp-2461-distinct-maass-pair).',
  'NAMED SUB-GAP (ii): the archimedean R-sweep STRIPS the arithmetic ' +
    '(b(n)=delta_{n,1}); it is a kernel-SHAPE locus, not an arithmetic margin. ' +
    'Only R=9.5337 carries real Hecke data. Whether a real Maass form with ' +
    'R >~ 15.35 actually crosses 2 needs second-form data. OPEN.',
  'NAMED SUB-GAP (iii): PRECISION LIMIT -- for R >~ 18 the K_{iR}^2 envelope is ' +
    'suppressed by ~exp(-pi R) and op_norm underflows toward double-precision ' +
    'noise (R=18 margin non-monotonically 4.11, R=20 3.29), so the trustworthy ' +
    'monotone window is R in [4,16]. OPEN (higher-precision arithmetic).',
  'NAMED SUB-GAP (iv): HIGHER-LEVEL / nebentypus Maass forms (conductor > 1) ' +
    'rescale the kernel argument and add ramified factors; only level-1 here. ' +
    'OPEN (shared with imp-2421 sub-gap (ii)).',
  'OP-NORM is a Galerkin power-iteration LOWER bound on ||V||_op; ' +
    '"HS_bound >= op_norm" is NECESSARY, not sufficient. It held at every row.',
]);

// ── Master export ───────────────────────────────────────────────────────────
export const IMP2461_MAASS_RANKIN_SELBERG_MARGIN = Object.freeze({
  id: 'imp-2461-maass-rankin-selberg-margin',
  ticket: 'imp-2461',
  generatedAt: '2026-06-04T22:10:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['S25', 'S26', 'S27', 'imp-1298 GL(n) extension'],
  relatedTickets: ['imp-2421', 'imp-2356', 'imp-1267', 'imp-2357', 'imp-1258'],

  summary:
    'Maass Rankin-Selberg V-margin: settles imp-2421 sub-gap (i). Maass x Maass RS ' +
    'is a degree-4 four-gamma factor whose inverse Mellin is the SCALAR product of ' +
    'two imaginary-order K-Bessels K_{iR1} K_{iR2} (Gradshteyn-Ryzhik 6.576.4). ' +
    'ARITHMETIC ANCHOR: self-RS f x f of the first SL(2,Z) Maass form (R=9.5337) ' +
    'has margin 1.4738x (flat in a, below the holomorphic 1.70x-2.00x band) with ' +
    'op_norm ~34 orders below 1. ARCHIMEDEAN: the K_{iR}^2 envelope crosses margin ' +
    '2 at spectral parameter R* ~ 15.35, ABOVE R=9.53, locating the exact-2 ' +
    'boundary. VERDICT: maass-rs-arithmetic-sub-2-archimedean-crossing-at-R-15. ' +
    'SUB-GAPS: distinct-form Maass pairs, arithmetic-at-large-R, R>16 precision, ' +
    'higher level remain OPEN.',

  hsBoundFormula: HS_BOUND_FORMULA,
  maassForm: MAASS_FORM,
  anchor: ANCHOR,
  archimedeanSweep: ARCHIMEDEAN_SWEEP,
  marginTwoCrossingR: MARGIN_TWO_CROSSING_R,
  method: METHOD,

  summaryStats: Object.freeze({
    anchorMarginMin: Math.min(...ANCHOR.rows.map((r) => r.margin)),
    anchorMarginMax: Math.max(...ANCHOR.rows.map((r) => r.margin)),
    anchorAllSub2: ANCHOR.rows.every((r) => r.margin < 2),
    anchorMaxOpNorm: Math.max(...ANCHOR.rows.map((r) => r.op_norm_galerkin)),
    anchorContractionHolds: Math.max(...ANCHOR.rows.map((r) => r.op_norm_galerkin)) < 1,
    archReliableMonotone: ARCHIMEDEAN_SWEEP.filter((r) => r.reliable).length,
    archCrossingR: MARGIN_TWO_CROSSING_R,
    firstMaassR: 9.533695261353925,
    crossingAboveFirstMaass: MARGIN_TWO_CROSSING_R > 9.533695261353925,
  }),

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictRationale: VERDICT_RATIONALE,

  crossReferences: CROSS_REFERENCES,
  honestScope: HONEST_SCOPE,

  sourceParents: Object.freeze({
    imp_2421_verdict: IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.verdict,
    imp_2421_max_op_norm: IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.summaryStats.maxOpNorm,
    imp_2421_margin_max: IMP2421_RANKIN_SELBERG_VOLTERRA_MARGIN.summaryStats.marginMax,
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    computeScript: 'scripts/compute-imp2461-maass-rs-margin.mjs',
    imp2421Holomorphic: 'src/data/imp-2421-rankin-selberg-volterra-margin.js',
    imp2356Maass: 'src/data/imp-2356-maass-volterra-hs.js',
    gradshteynRyzhik: 'Gradshteyn, I.S. & Ryzhik, I.M., Table of Integrals 6.576.4 (Mellin transform of K_mu(x) K_nu(x))',
    iwaniecKowalski: 'Iwaniec, H. & Kowalski, E. (2004). Analytic Number Theory, AMS Coll 53 (Rankin-Selberg L-functions, ch. 5)',
    dlmf: 'DLMF 10.32.9 (integral representation of K_{iR})',
  }),
});

export default IMP2461_MAASS_RANKIN_SELBERG_MARGIN;

// ── Tripwire assertions ─────────────────────────────────────────────────────
export const IMP2461_MAASS_RANKIN_SELBERG_MARGIN_ASSERTIONS = [
  // (T1) HS bound + scalar K_{iR1} K_{iR2} kernel stated explicitly
  {
    id: 'imp2461-hs-bound-and-product-bessel-kernel-explicit',
    why:
      'The HS bound ||V|| <= sqrt(I_0 J_a) and the SCALAR product-of-two-K-Bessel ' +
      'Phi kernel (four-gamma inverse Mellin via Gradshteyn-Ryzhik 6.576.4) must be ' +
      'present and consistent with the imp-2356 / imp-2421 scalar Volterra machinery.',
    holds: () => {
      const f = IMP2461_MAASS_RANKIN_SELBERG_MARGIN.hsBoundFormula;
      return (
        f.inequality.includes('sqrt(I_0 * J_a)') &&
        f.phi_formula.includes('K_{iR1}') &&
        f.phi_formula.includes('K_{iR2}') &&
        f.phi_formula.includes('b(n)') &&
        f.gamma_factor.includes('FOUR') &&
        f.inverse_mellin.includes('6.576.4') &&
        f.inverse_mellin.includes('SCALAR') &&
        f.J_a_definition.includes('sinh')
      );
    },
  },

  // (T2) PRIMARY: arithmetic anchor margin < 2 at every a AND op_norm << 1
  {
    id: 'imp2461-anchor-sub-2-and-contraction-holds',
    why:
      'PRIMARY: the genuine arithmetic Maass-RS anchor (self-RS f x f) must have ' +
      'margin < 2 at every a, the HS bound must dominate op_norm, and the ' +
      'RH-relevant op_norm must be far below 1 (the imp-1258 contraction). Either ' +
      'failing would refute the headline finding.',
    holds: () =>
      IMP2461_MAASS_RANKIN_SELBERG_MARGIN.anchor.rows.every(
        (r) =>
          r.hs_bound_holds === true &&
          r.hs_bound >= r.op_norm_galerkin &&
          r.op_norm_galerkin < 1e-20 &&
          r.margin > 1 && r.margin < 2,
      ),
  },

  // (T3) Anchor margin is essentially FLAT in a (kernel-shape dominated)
  {
    id: 'imp2461-anchor-margin-flat-in-a',
    why:
      'The Cauchy-Schwarz slack is set by the kernel SHAPE, not the Volterra ' +
      'parameter a: the three anchor margins must agree to high precision (~1.4738). ' +
      'A spread would indicate an a-dependent artifact rather than a structural margin.',
    holds: () => {
      const ms = IMP2461_MAASS_RANKIN_SELBERG_MARGIN.anchor.rows.map((r) => r.margin);
      const spread = Math.max(...ms) - Math.min(...ms);
      return spread < 1e-4 && Math.abs(ms[0] - 1.4738) < 1e-3;
    },
  },

  // (T4) Archimedean envelope: margin monotone increasing on the reliable window
  //      and crosses 2 between R=15 and R=16
  {
    id: 'imp2461-archimedean-monotone-and-crosses-2',
    why:
      'The exact-2 boundary deliverable hinges on the K_{iR}^2 envelope rising ' +
      'monotonically with R on the well-resolved window R in [4,16] and bracketing ' +
      'margin 2 between R=15 (1.812) and R=16 (2.353). Drift here breaks the ' +
      'located crossing R* ~ 15.35.',
    holds: () => {
      const rel = IMP2461_MAASS_RANKIN_SELBERG_MARGIN.archimedeanSweep.filter((r) => r.reliable);
      for (let i = 1; i < rel.length; i++) if (rel[i].margin <= rel[i - 1].margin) return false;
      const r15 = rel.find((r) => r.R === 15);
      const r16 = rel.find((r) => r.R === 16);
      return r15.margin < 2 && r16.margin > 2 && rel.every((r) => r.hs_bound_holds);
    },
  },

  // (T5) Located crossing R* is in (15,16) and ABOVE the first Maass eigenvalue
  {
    id: 'imp2461-crossing-R-located-above-first-maass',
    why:
      'The crossing R* must be a number in (15,16) and strictly above the first ' +
      'SL(2,Z) Maass eigenvalue R=9.5337, so the genuine arithmetic form sits ' +
      'comfortably in the sub-2 regime -- the central honest claim.',
    holds: () => {
      const M = IMP2461_MAASS_RANKIN_SELBERG_MARGIN;
      return (
        M.marginTwoCrossingR > 15 && M.marginTwoCrossingR < 16 &&
        M.marginTwoCrossingR > M.maassForm.R_SPEC &&
        M.summaryStats.crossingAboveFirstMaass === true
      );
    },
  },

  // (T6) Self-RS coefficients correct: b(1)=1, b(2)=a(2)^2, b(4)=a(4)^2+a(1)^2
  {
    id: 'imp2461-self-rs-coefficients-correct',
    why:
      'b(1) must be 1 (analytic normalization). For self-RS f x f, b(2) = a(2)^2 ' +
      '(no square divisor), and b(4) = a(4)^2 + a(1)^2 (d=1 and d=2 both contribute). ' +
      'A wrong value means the d^2-sum Rankin-Selberg convolution is broken.',
    holds: () => {
      const a = IMP2461_MAASS_RANKIN_SELBERG_MARGIN.maassForm.a1_to_6;
      const b = IMP2461_MAASS_RANKIN_SELBERG_MARGIN.anchor.b_1_to_6;
      return (
        Math.abs(b[0] - 1) < 1e-12 &&
        Math.abs(b[1] - a[1] * a[1]) < 1e-9 &&
        Math.abs(b[3] - (a[3] * a[3] + a[0] * a[0])) < 1e-9
      );
    },
  },

  // (T7) Verdict in allowed set and matches the data
  {
    id: 'imp2461-verdict-in-allowed-set-matches-data',
    why:
      'The verdict must be one of the allowed strings and the arithmetic-sub-2 / ' +
      'archimedean-crossing verdict must agree with the rows (anchor all sub-2, ' +
      'crossing located, contraction holding).',
    holds: () => {
      const M = IMP2461_MAASS_RANKIN_SELBERG_MARGIN;
      return (
        M.allowedVerdicts.includes(M.verdict) &&
        M.verdict === 'maass-rs-arithmetic-sub-2-archimedean-crossing-at-R-15' &&
        M.summaryStats.anchorAllSub2 === true &&
        M.summaryStats.anchorContractionHolds === true
      );
    },
  },

  // (T8) Honest scope names the four-gamma->scalar reduction and the four sub-gaps
  {
    id: 'imp2461-honest-scope-names-reduction-and-subgaps',
    why:
      'The deliverable is a PARTIAL that resolves imp-2421 sub-gap (i) but leaves ' +
      'four named sub-gaps. honestScope must flag the four-gamma -> scalar-product-' +
      'Bessel reduction, the arithmetic sub-2 finding, the archimedean crossing, ' +
      'and the distinct-form / precision / higher-level sub-gaps.',
    holds: () => {
      const scope = IMP2461_MAASS_RANKIN_SELBERG_MARGIN.honestScope.join(' | ').toLowerCase();
      return (
        IMP2461_MAASS_RANKIN_SELBERG_MARGIN.honestScope.length >= 8 &&
        scope.includes('scalar') &&
        scope.includes('distinct-form') &&
        scope.includes('precision limit') &&
        scope.includes('higher-level') &&
        (scope.includes('galerkin') || scope.includes('lower bound'))
      );
    },
  },

  // (T9) Source parent links imp-2421 (audit trail of the settled sub-gap)
  {
    id: 'imp2461-source-parent-2421-linked',
    why:
      'imp-2461 settles imp-2421 sub-gap (i), so sourceParents must record live ' +
      'values from imp-2421 (verdict + op-norm + max margin), demonstrating the ' +
      'holomorphic module was actually imported and compared against.',
    holds: () => {
      const sp = IMP2461_MAASS_RANKIN_SELBERG_MARGIN.sourceParents;
      return (
        typeof sp.imp_2421_verdict === 'string' &&
        sp.imp_2421_verdict.includes('rankin-selberg') &&
        typeof sp.imp_2421_max_op_norm === 'number' && sp.imp_2421_max_op_norm > 0 &&
        typeof sp.imp_2421_margin_max === 'number' && sp.imp_2421_margin_max > 1.9
      );
    },
  },
];
