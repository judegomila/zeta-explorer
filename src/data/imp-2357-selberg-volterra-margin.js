/**
 * @module imp-2357-selberg-volterra-margin
 * @fileoverview imp-2357 -- Sweep the Volterra contraction margin across
 *   Selberg-class L-functions. Concretely: the Dedekind zeta functions
 *   zeta_K(s) of five small IMAGINARY QUADRATIC fields K = Q(sqrt(D)),
 *   D in {-3, -4, -7, -8, -20} (fundamental discriminants). These are
 *   degree-2 Selberg-class L-functions arithmetically distinct from both the
 *   Riemann zeta (imp-1267 scalar baseline) and the GL(2) cusp form Delta
 *   (imp-1317). The question: does the Cauchy-Schwarz slack
 *
 *       margin = HS_bound / op_norm
 *
 *   stay BELOW 2 across this Selberg-class subfamily (generalized-RH-flavored
 *   empirical evidence that the Volterra mechanism is uniform)?
 *
 *   WHY IMAGINARY QUADRATIC FIELDS (the cleanly-computable subfamily)
 *   ----------------------------------------------------------------
 *   For K imaginary quadratic (r_1 = 0, r_2 = 1) the completed Dedekind zeta
 *   has a SINGLE complex gamma factor Gamma_C(s) = (2*pi)^{-s} Gamma(s):
 *
 *       Lambda_K(s) = |D|^{s/2} (2*pi)^{-s} Gamma(s) zeta_K(s),
 *       functional equation  Lambda_K(s) = Lambda_K(1 - s),  central c = 1/2.
 *
 *   A single Gamma factor means the inverse-Mellin kernel is a SCALAR theta
 *   series -- the matrix-Phi_L of imp-1298 collapses to a scalar, exactly as
 *   in imp-1317 (Delta). This is the GL(1)-archimedean-shape case, so the
 *   imp-1267 scalar HS-bound machinery applies verbatim with the
 *   ideal-counting coefficients a_K(n) in place of tau(n).
 *
 *   KERNEL CONSTRUCTION
 *   -------------------
 *   zeta_K(s) = sum_{n>=1} a_K(n) n^{-s},  a_K(n) = #{integral ideals of norm n}
 *             = sum_{d | n} chi_D(d),  chi_D = Kronecker symbol (D | .).
 *   (Imaginary quadratic: zeta_K = zeta * L(., chi_D), so a_K = 1 * chi_D as a
 *    Dirichlet convolution.) Absorbing |D|^{s/2} by w -> w / sqrt(|D|):
 *
 *       Lambda_K(s) = int_0^inf f_K(w) w^{s-1} dw,
 *       f_K(w) = sum_{n>=1} a_K(n) exp(-2*pi*n*w / sqrt(|D|)),
 *
 *   and centering at s = 1/2 + it with w = e^u gives the inverse-Mellin
 *   Fourier kernel (symmetric in u by the functional equation):
 *
 *       Phi_K(u) = e^{u/2} * sum_{n>=1} a_K(n) exp(-2*pi*n*e^u / sqrt(|D|)).
 *
 *   SCALE INVARIANCE OF THE MARGIN
 *   ------------------------------
 *   margin = HS_bound/op_norm is invariant under Phi -> c*Phi (I_0, J_a and the
 *   kernel Phi(x)Phi(y)sinh all scale as Phi^2). So the overall gamma/|D|
 *   normalization constant is irrelevant -- only the SHAPE of Phi_K (decay rate
 *   set by sqrt(|D|), and the a_K(n) pattern) drives the margin. This makes the
 *   margin a robust, convention-independent diagnostic.
 *
 *   THE HS BOUND (same inequality as imp-1267 / imp-1317)
 *   -----------------------------------------------------
 *       V_{a, Phi_K} f(x) = int_0^x Phi_K(x) Phi_K(y) sinh(a(x-y)) f(y) dy,
 *       ||V||_op <= ||V||_HS <= sqrt(I_0 * J_a),
 *       I_0 = int_0^inf Phi_K(u)^2 du,
 *       J_a = int_0^inf Phi_K(u)^2 sinh^2(a u) du.
 *
 *   NUMERICAL RESULTS (run 2026-06-04 via scripts/compute-imp2357-selberg-margin.mjs)
 *   --------------------------------------------------------------------------------
 *   N_COEF = 120 (a_K tail < 1e-18 for u >= 0). U_INF = 3, N_INF = 30000
 *   midpoint nodes for I_0, J_a. U_OP = 3, N_OP = 800 Galerkin + power iteration.
 *   A_GRID = {0.01, 0.05, 0.2}.
 *
 *     field          D     margin (all 3 a-values)    HS bound holds
 *     -----------   ----   -----------------------    --------------
 *     Q(sqrt(-3))    -3    1.522x                     yes (all rows)
 *     Q(i)           -4    1.526x                     yes
 *     Q(sqrt(-7))    -7    1.531x                     yes
 *     Q(sqrt(-2))    -8    1.541x                     yes
 *     Q(sqrt(-5))   -20    1.553x - 1.554x            yes
 *
 *   margin range over all 15 rows: [1.522, 1.554].  ALL < 2.  HS bound holds
 *   at EVERY row (op_norm <= HS_bound).
 *
 *   VERDICT: 'selberg-margin-sub-2-holds'.
 *
 *   INTERPRETATION
 *   --------------
 *   The Cauchy-Schwarz slack margin is remarkably uniform (~1.52-1.55x) and
 *   sub-2 across all five imaginary quadratic Dedekind zetas. It is slightly
 *   TIGHTER than the GL(2) Delta case (imp-1317: 1.71x) and the scalar Riemann
 *   xi case (imp-1267: 1.58x-2.57x). The margin rises gently and monotonically
 *   with |D| (1.522 at D=-3 up to 1.554 at D=-20), reflecting the slower kernel
 *   decay exp(-2*pi*e^u / sqrt(|D|)) for larger |D|, but stays far from 2. This
 *   is empirical support that the Volterra contraction mechanism is a uniform
 *   Selberg-class object on the cleanly-scalar (single-Gamma) subfamily.
 *
 *   HONEST SCOPE / NAMED SUB-GAP
 *   ----------------------------
 *   Only IMAGINARY QUADRATIC fields are computed -- their single complex gamma
 *   factor makes Phi_K a SCALAR theta series. NOT computed (the sub-gap):
 *     (i)  REAL quadratic fields K = Q(sqrt(D)), D > 0: gamma factor is
 *          Gamma_R(s)^2 = pi^{-s} Gamma(s/2)^2 (TWO real places), whose
 *          inverse Mellin is a rank-2 / K-Bessel kernel -- genuinely a 2-row
 *          matrix Phi_L (imp-1298), not the scalar case here.
 *     (ii) Symmetric-power L(s, sym^m f), m >= 2: GL(m+1) with a PRODUCT of
 *          >= 3 gamma factors -- matrix-valued kernel, requires the imp-1298
 *          matrix HS bound. Dirichlet coefficients are computable from Hecke
 *          eigenvalues but the multi-Gamma kernel is not the scalar theta here.
 *   So this ticket settles the margin question for the single-Gamma scalar
 *   subfamily of the Selberg class; the matrix-gamma cases remain OPEN.
 *
 *   This is NOT a proof of GRH for any zeta_K (GRH for Dedekind zeta is open).
 *   The op_norm is a Galerkin power-iteration LOWER bound on ||V||_op, so
 *   "HS_bound >= op_norm" is a NECESSARY (not sufficient) check; the ~1.5x
 *   margin is far too large for discretization noise to flip the verdict.
 *
 *   Ticket: imp-2357 (numerical, medium, opus-4-8).
 */

import { IMP1267_VOLTERRA_HS_BOUND } from './imp-1267-volterra-hs-bound.js';
import { IMP1317_GL2_MAASS_HS_CONCRETE } from './imp-1317-gl2-maass-hs-concrete.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── HS bound formula (mirrors imp-1267 / imp-1317) ──────────────────────────
const HS_BOUND_FORMULA = Object.freeze({
  label: 'HS-bd_zetaK',
  inequality: '||V_{a, Phi_K}||_op <= ||V_{a, Phi_K}||_HS <= sqrt(I_0 * J_a)',
  kernel_formula:
    'k_{a, K}(x, y) = Phi_K(x) * Phi_K(y) * sinh(a*(x-y))  for 0 <= y <= x',
  phi_K_formula:
    'Phi_K(u) = e^{u/2} * sum_{n>=1} a_K(n) * exp(-2*pi*n*e^u / sqrt(|D|)), ' +
    'a_K(n) = sum_{d | n} chi_D(d) = #{integral ideals of norm n}',
  I_0_definition: 'I_0 = integral_0^infty Phi_K(u)^2 du',
  J_a_definition: 'J_a = integral_0^infty Phi_K(u)^2 sinh^2(a*u) du',
  central_point: 'c = 1/2 (Dedekind functional equation s -> 1 - s)',
  scale_invariance:
    'margin = HS_bound/op_norm is invariant under Phi_K -> c*Phi_K, so the ' +
    'gamma/|D| normalization does not affect the margin (only kernel SHAPE does)',
});

// ── Frozen sweep rows (2026-06-04 run; one block per field) ─────────────────
const FIELDS = Object.freeze([
  Object.freeze({
    label: 'Q(sqrt(-3))',
    D: -3,
    sqrtAbsD: 1.7320508075688772,
    gammaFactor: '(2*pi)^{-s} Gamma(s) (single Gamma_C -- imaginary quadratic)',
    aK_1_to_12: Object.freeze([1, 0, 1, 1, 0, 0, 2, 0, 1, 0, 0, 1]),
    I0: 0.00009744775704643866,
    phi_at_0: 0.02659921116065473,
    phi_max_abs: 0.026595044700851337,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 2.6593693694067186e-10, hs_bound: 1.60981234995476e-7, op_norm_galerkin: 1.0579470664396962e-7, margin: 1.521637897605079, hs_bound_holds: true, iter_count: 7, converged: true, residual: 2.1144324293492787e-14 }),
      Object.freeze({ a: 0.05, Ja: 6.649046628529248e-9, hs_bound: 8.04943898944119e-7, op_norm_galerkin: 5.289972575552882e-7, margin: 1.5216409677889309, hs_bound_holds: true, iter_count: 7, converged: true, residual: 2.2010676819772985e-14 }),
      Object.freeze({ a: 0.2, Ja: 1.0654073461018243e-7, hs_bound: 0.0000032221352581544673, op_norm_galerkin: 0.0000021174729062017076, margin: 1.5216890136905161, hs_bound_holds: true, iter_count: 7, converged: true, residual: 2.3601301978380166e-14 }),
    ]),
  }),
  Object.freeze({
    label: 'Q(i)',
    D: -4,
    sqrtAbsD: 2,
    gammaFactor: '(2*pi)^{-s} Gamma(s) (single Gamma_C -- imaginary quadratic)',
    aK_1_to_12: Object.freeze([1, 1, 0, 1, 2, 0, 0, 1, 1, 2, 0, 0]),
    I0: 0.00031463653308058724,
    phi_at_0: 0.04508514975402407,
    phi_max_abs: 0.04507890002532238,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 1.0682666401827178e-9, hs_bound: 5.797548724010325e-7, op_norm_galerkin: 3.799216356846096e-7, margin: 1.5259854084285784, hs_bound_holds: true, iter_count: 7, converged: true, residual: 9.269114112518118e-15 }),
      Object.freeze({ a: 0.05, Ja: 2.6709728679985313e-8, hs_bound: 0.000002898940570517738, op_norm_galerkin: 0.000001899711899579344, margin: 1.5259895835571988, hs_bound_holds: true, iter_count: 7, converged: true, residual: 9.84866988109017e-15 }),
      Object.freeze({ a: 0.2, Ja: 4.2812243915103456e-7, hs_bound: 0.000011606160432653264, op_norm_galerkin: 0.000007605335937607462, margin: 1.5260549340446898, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.1284308394166747e-14 }),
    ]),
  }),
  Object.freeze({
    label: 'Q(sqrt(-7))',
    D: -7,
    sqrtAbsD: 2.6457513110645907,
    gammaFactor: '(2*pi)^{-s} Gamma(s) (single Gamma_C -- imaginary quadratic)',
    aK_1_to_12: Object.freeze([1, 2, 0, 3, 0, 0, 1, 4, 1, 0, 2, 0]),
    I0: 0.0023098690424253783,
    phi_at_0: 0.11056554873378335,
    phi_max_abs: 0.11055304917445942,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 1.1492637490701965e-8, hs_bound: 0.000005152328362555103, op_norm_galerkin: 0.0000033647060078549214, margin: 1.531286344342409, hs_bound_holds: true, iter_count: 7, converged: true, residual: 7.706015859783155e-15 }),
      Object.freeze({ a: 0.05, Ja: 2.873631646797291e-7, hs_bound: 0.000025763759004211556, op_norm_galerkin: 0.00001682483749382354, margin: 1.5312931856649152, hs_bound_holds: true, iter_count: 7, converged: true, residual: 5.661614588652786e-15 }),
      Object.freeze({ a: 0.2, Ja: 0.000004609641582994429, hs_bound: 0.00010318753989332018, op_norm_galerkin: 0.00006738116628431334, margin: 1.531400324208142, hs_bound_holds: true, iter_count: 7, converged: true, residual: 2.7328422186999762e-15 }),
    ]),
  }),
  Object.freeze({
    label: 'Q(sqrt(-2))',
    D: -8,
    sqrtAbsD: 2.8284271247461903,
    gammaFactor: '(2*pi)^{-s} Gamma(s) (single Gamma_C -- imaginary quadratic)',
    aK_1_to_12: Object.freeze([1, 1, 2, 1, 0, 2, 0, 1, 3, 0, 2, 2]),
    I0: 0.0031169763569844377,
    phi_at_0: 0.12290750574250336,
    phi_max_abs: 0.12289500611750528,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 1.783307195359061e-8, hs_bound: 0.000007455552538326332, op_norm_galerkin: 0.000004838709613502532, margin: 1.5408142116074581, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.656084561800895e-15 }),
      Object.freeze({ a: 0.05, Ja: 4.459086101452575e-7, hs_bound: 0.000037281182856751724, op_norm_galerkin: 0.000024195630992665942, margin: 1.5408229224545624, hs_bound_holds: true, iter_count: 7, converged: true, residual: 5.298558207796258e-16 }),
      Object.freeze({ a: 0.2, Ja: 0.000007155036410158039, hs_bound: 0.00014933880715951032, op_norm_galerkin: 0.0000969128799102763, margin: 1.5409593368577108, hs_bound_holds: true, iter_count: 7, converged: true, residual: 4.227451028129425e-15 }),
    ]),
  }),
  Object.freeze({
    label: 'Q(sqrt(-5))',
    D: -20,
    sqrtAbsD: 4.47213595499958,
    gammaFactor: '(2*pi)^{-s} Gamma(s) (single Gamma_C -- imaginary quadratic)',
    aK_1_to_12: Object.freeze([1, 1, 2, 1, 1, 2, 2, 1, 3, 1, 0, 2]),
    I0: 0.03270528411359561,
    phi_at_0: 0.3402156077194618,
    phi_max_abs: 0.340190608260307,
    rows: Object.freeze([
      Object.freeze({ a: 0.01, Ja: 3.3763027573462657e-7, hs_bound: 0.0001050823205551371, op_norm_galerkin: 0.00006765168554150875, margin: 1.5532845887581352, hs_bound_holds: true, iter_count: 7, converged: true, residual: 4.156913044180253e-15 }),
      Object.freeze({ a: 0.05, Ja: 0.00000844342630816219, hs_bound: 0.0005254946777091583, op_norm_galerkin: 0.000338307887419276, margin: 1.5533030628336948, hs_bound_holds: true, iter_count: 7, converged: true, residual: 5.781840241817679e-16 }),
      Object.freeze({ a: 0.2, Ja: 0.00013576466122823858, hs_bound: 0.002107183385008434, op_norm_galerkin: 0.0013563293875297896, margin: 1.5535926629490309, hs_bound_holds: true, iter_count: 7, converged: true, residual: 1.4964193697860269e-15 }),
    ]),
  }),
]);

// ── Aggregate summary statistics over all 15 rows ───────────────────────────
const ALL_ROWS = FIELDS.flatMap((f) => f.rows);
const MARGIN_MIN = 1.521637897605079;
const MARGIN_MAX = 1.5535926629490309;
const N_ROWS = 15;

// ── Method ──────────────────────────────────────────────────────────────────
const METHOD = Object.freeze({
  quadrature: 'midpoint rule',
  N_COEF: 120,
  N_COEF_tail_note: 'a_K tail < 1e-18 for u >= 0 (exp(-2*pi*n*e^u/sqrt(|D|)) damping)',
  U_INF: 3,
  N_INF: 30000,
  U_OP: 3,
  N_OP: 800,
  a_grid: Object.freeze([0.01, 0.05, 0.2]),
  ideal_count_formula: 'a_K(n) = sum_{d|n} kronecker(D, d) via Cohen 1993 Alg. 1.4.10',
  op_norm_evaluation:
    'Galerkin matrix 2-norm via power iteration on V[i][j] = ' +
    'h * Phi_K(t_i) Phi_K(t_j) sinh(a (t_j - t_i)) for j > i',
  seededRNG: 'LCG seed 0x12345678 (same as imp-1262/1316/1317)',
  computeScript: 'scripts/compute-imp2357-selberg-margin.mjs',
});

// ── Verdict ─────────────────────────────────────────────────────────────────
const ALLOWED_VERDICTS = Object.freeze([
  'selberg-margin-sub-2-holds',
  'selberg-margin-exceeds-2',
  'computation-too-coarse-for-verdict',
]);
const VERDICT = 'selberg-margin-sub-2-holds';
const VERDICT_RATIONALE =
  'All 15 rows (5 imaginary quadratic Dedekind zetas x 3 a-values) have margin ' +
  'in [1.522, 1.554], all < 2, and the HS bound holds at every row ' +
  '(op_norm <= HS_bound). The margin is slightly tighter than the GL(2) Delta ' +
  'case (imp-1317: 1.71x) and the scalar Riemann xi case (imp-1267: 1.58-2.57x), ' +
  'rising gently and monotonically with |D|. Empirical support that the Volterra ' +
  'Cauchy-Schwarz slack is a uniform sub-2 Selberg-class object on the ' +
  'single-Gamma (scalar-kernel) subfamily.';

// ── Cross-references ────────────────────────────────────────────────────────
const CROSS_REFERENCES = Object.freeze([
  Object.freeze({ ticket: 'imp-1267', role: 'scalar HS bound (Riemann xi, margin 1.58-2.57x)', path: 'src/data/imp-1267-volterra-hs-bound.js' }),
  Object.freeze({ ticket: 'imp-1317', role: 'GL(2) Delta concrete test (margin 1.71x)', path: 'src/data/imp-1317-gl2-maass-hs-concrete.js' }),
  Object.freeze({ ticket: 'imp-1298', role: 'GL(n) matrix HS-bound framework (needed for the matrix-gamma sub-gap)', path: 'src/data/imp-1298-gl-n-selberg-extension.js' }),
  Object.freeze({ ticket: 'imp-1258', role: 'two-way collapse reducing SS15-27 to ||V|| <= 1', path: 'src/data/imp-1258-volterra-cdb-bridge.js' }),
]);

// ── Honest scope ────────────────────────────────────────────────────────────
const HONEST_SCOPE = Object.freeze([
  'EMPIRICAL margin sweep on 15 rows (5 imaginary quadratic fields x a in ' +
    '{0.01, 0.05, 0.2}). NOT a proof of GRH for any zeta_K -- GRH for Dedekind ' +
    'zeta is open. The test confirms the Volterra HS-bound margin, NOT zero ' +
    'locations.',
  'IMAGINARY QUADRATIC ONLY: r_2 = 1 gives a SINGLE complex gamma factor ' +
    'Gamma_C(s), so Phi_K is a SCALAR theta series (the imp-1298 matrix-Phi_L ' +
    'collapses to a scalar). The imp-1267 scalar machinery applies verbatim.',
  'NAMED SUB-GAP (i): REAL quadratic fields (D > 0) have gamma factor ' +
    'Gamma_R(s)^2 = pi^{-s} Gamma(s/2)^2 (two real places); the inverse Mellin ' +
    'is a rank-2 K-Bessel kernel -- a genuine 2-row MATRIX Phi_L, NOT computed ' +
    'here. OPEN.',
  'NAMED SUB-GAP (ii): symmetric-power L(s, sym^m f) for m >= 2 is GL(m+1) ' +
    'with a PRODUCT of >= 3 gamma factors -- matrix-valued kernel requiring the ' +
    'imp-1298 matrix HS bound. Dirichlet coefficients are computable from Hecke ' +
    'eigenvalues but the multi-Gamma kernel is NOT the scalar theta here. OPEN.',
  'OP-NORM is a Galerkin power-iteration LOWER bound on ||V||_op ' +
    '(||A_N|| <= ||V||). "HS_bound >= op_norm" is NECESSARY, not sufficient; the ' +
    '~1.5x margin is far too large for discretization noise to flip the verdict.',
  'a_K(n) TRUNCATION at N_COEF = 120: the n-series tail is < 1e-18 for u >= 0 ' +
    '(exp(-2*pi*n*e^u/sqrt(|D|)) damping; worst case D = -20 at u = 0). ' +
    'INTEGRATION window [0, U_INF = 3]: Phi_K(u)^2 at u = 3 is below 1e-23 even ' +
    'for the slowest-decaying field (D = -20).',
  'MARGIN SCALE-INVARIANCE: margin = HS_bound/op_norm is unchanged under ' +
    'Phi_K -> c*Phi_K, so the gamma/|D| normalization convention does not affect ' +
    'the reported margins -- only the kernel SHAPE (decay rate, a_K pattern) does.',
]);

// ── Master export ───────────────────────────────────────────────────────────
export const IMP2357_SELBERG_VOLTERRA_MARGIN = Object.freeze({
  id: 'imp-2357-selberg-volterra-margin',
  ticket: 'imp-2357',
  generatedAt: '2026-06-04T00:40:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['S25', 'S26', 'S27', 'imp-1298 GL(n) extension'],
  relatedTickets: ['imp-1267', 'imp-1317', 'imp-1298', 'imp-1258'],

  summary:
    'Volterra contraction-margin sweep across the Selberg class: Dedekind zeta ' +
    'of five small imaginary quadratic fields (D in {-3,-4,-7,-8,-20}). Single ' +
    'complex gamma factor makes Phi_K a scalar theta series, so the imp-1267 ' +
    'scalar HS bound applies with ideal-counting coefficients a_K(n). All 15 ' +
    'rows have margin in [1.522, 1.554] (all < 2) and the HS bound holds ' +
    'everywhere -- slightly tighter than Delta (imp-1317: 1.71x) and Riemann xi ' +
    '(imp-1267: 1.58-2.57x). VERDICT: selberg-margin-sub-2-holds. HONEST ' +
    'SUB-GAP: real quadratic (Gamma_R^2) and sym^m L (m>=2) have matrix-valued ' +
    'kernels and are NOT computed -- they need the imp-1298 matrix HS bound.',

  hsBoundFormula: HS_BOUND_FORMULA,
  fields: FIELDS,
  method: METHOD,

  summaryStats: Object.freeze({
    nFields: FIELDS.length,
    nRows: N_ROWS,
    marginMin: MARGIN_MIN,
    marginMax: MARGIN_MAX,
    allMarginsSub2: MARGIN_MAX < 2,
    allHsBoundsHold: ALL_ROWS.every((r) => r.hs_bound_holds),
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
    computeScript: 'scripts/compute-imp2357-selberg-margin.mjs',
    imp1267HsBound: 'src/data/imp-1267-volterra-hs-bound.js',
    imp1317Gl2: 'src/data/imp-1317-gl2-maass-hs-concrete.js',
    cohen1993: 'Cohen, H. (1993). A Course in Computational Algebraic Number Theory, Springer GTM 138 (Kronecker symbol Alg. 1.4.10)',
    iwaniecKowalski: 'Iwaniec, H. & Kowalski, E. (2004). Analytic Number Theory, AMS Coll 53 (Selberg class, ch. 5)',
    neukirch: 'Neukirch, J. (1999). Algebraic Number Theory, Springer GMW 322 (Dedekind zeta, ch. VII)',
  }),
});

export default IMP2357_SELBERG_VOLTERRA_MARGIN;

// ── Tripwire assertions ─────────────────────────────────────────────────────
export const IMP2357_SELBERG_VOLTERRA_MARGIN_ASSERTIONS = [
  // (T1) HS bound formula stated explicitly with Phi_K kernel and I_0/J_a defs
  {
    id: 'imp2357-hs-bound-formula-explicit',
    why:
      'The HS bound ||V|| <= sqrt(I_0 * J_a) and the Phi_K kernel definition ' +
      'must be present and consistent with imp-1267 / imp-1317. A drift means ' +
      'the inequality no longer matches the scalar Volterra machinery.',
    holds: () => {
      const f = IMP2357_SELBERG_VOLTERRA_MARGIN.hsBoundFormula;
      return (
        f.inequality.includes('sqrt(I_0 * J_a)') &&
        f.phi_K_formula.includes('a_K(n)') &&
        f.phi_K_formula.includes('sqrt(|D|)') &&
        f.I_0_definition.includes('Phi_K') &&
        f.J_a_definition.includes('sinh') &&
        f.kernel_formula.includes('sinh(a*(x-y))')
      );
    },
  },

  // (T2) PRIMARY: every row has margin < 2 and HS bound holds
  {
    id: 'imp2357-all-margins-sub-2-and-hs-holds',
    why:
      'PRIMARY SUCCESS CRITERION: the Cauchy-Schwarz margin must be sub-2 and ' +
      'the HS bound must dominate the Galerkin op_norm at every row. A margin ' +
      '>= 2 or hs_bound_holds=false would refute the sub-2 Selberg-class claim.',
    holds: () =>
      IMP2357_SELBERG_VOLTERRA_MARGIN.fields.every((fld) =>
        fld.rows.every(
          (r) =>
            r.hs_bound_holds === true &&
            r.margin < 2 &&
            r.margin > 1 &&
            r.hs_bound >= r.op_norm_galerkin,
        ),
      ),
  },

  // (T3) Five imaginary quadratic fields, correct fundamental discriminants
  {
    id: 'imp2357-five-imaginary-quadratic-fields',
    why:
      'The sweep must cover the five small imaginary quadratic fields ' +
      'D in {-3,-4,-7,-8,-20}, all with NEGATIVE fundamental discriminant ' +
      '(imaginary quadratic = single complex gamma factor). A wrong/missing D ' +
      'means the field set does not match the ticket.',
    holds: () => {
      const Ds = IMP2357_SELBERG_VOLTERRA_MARGIN.fields.map((f) => f.D);
      const want = [-3, -4, -7, -8, -20];
      return (
        IMP2357_SELBERG_VOLTERRA_MARGIN.fields.length === 5 &&
        want.every((d) => Ds.includes(d)) &&
        Ds.every((d) => d < 0)
      );
    },
  },

  // (T4) Three a-values per field; 15 rows total
  {
    id: 'imp2357-three-a-values-15-rows',
    why:
      'Each field is swept at a in {0.01, 0.05, 0.2}, giving 5 x 3 = 15 rows. ' +
      'A different count means the sweep grid is inconsistent with the method.',
    holds: () => {
      let total = 0;
      for (const fld of IMP2357_SELBERG_VOLTERRA_MARGIN.fields) {
        const aSet = new Set(fld.rows.map((r) => r.a));
        if (fld.rows.length !== 3 || !aSet.has(0.01) || !aSet.has(0.05) || !aSet.has(0.2)) {
          return false;
        }
        total += fld.rows.length;
      }
      return total === 15;
    },
  },

  // (T5) I_0 is a-independent within each field (constant across its 3 rows is
  //      implicit; I_0 lives on the field, not the row) and in (0, 1)
  {
    id: 'imp2357-I0-positive-and-bounded',
    why:
      'I_0 = int Phi_K^2 du must be a single positive value per field in (0, 1) ' +
      '(scale fixed by the chosen gamma/|D| convention). A nonpositive or huge ' +
      'I_0 indicates a kernel-construction bug.',
    holds: () =>
      IMP2357_SELBERG_VOLTERRA_MARGIN.fields.every(
        (f) => typeof f.I0 === 'number' && f.I0 > 0 && f.I0 < 1,
      ),
  },

  // (T6) Verdict in allowed set and matches the data
  {
    id: 'imp2357-verdict-in-allowed-set',
    why:
      'The verdict must be one of the three allowed strings and ' +
      'selberg-margin-sub-2-holds must agree with the rows (all margins < 2).',
    holds: () => {
      const v = IMP2357_SELBERG_VOLTERRA_MARGIN.verdict;
      const allowed = IMP2357_SELBERG_VOLTERRA_MARGIN.allowedVerdicts;
      const allSub2 = IMP2357_SELBERG_VOLTERRA_MARGIN.fields.every((fld) =>
        fld.rows.every((r) => r.margin < 2),
      );
      return allowed.includes(v) && v === 'selberg-margin-sub-2-holds' && allSub2;
    },
  },

  // (T7) margin range recorded and consistent with the rows
  {
    id: 'imp2357-margin-range-consistent',
    why:
      'summaryStats.marginMin / marginMax must bracket every row margin and ' +
      'marginMax must be < 2. A mismatch means the aggregate stats drifted from ' +
      'the underlying rows.',
    holds: () => {
      const s = IMP2357_SELBERG_VOLTERRA_MARGIN.summaryStats;
      const margins = IMP2357_SELBERG_VOLTERRA_MARGIN.fields.flatMap((f) =>
        f.rows.map((r) => r.margin),
      );
      const lo = Math.min(...margins);
      const hi = Math.max(...margins);
      return (
        s.marginMax < 2 &&
        Math.abs(s.marginMin - lo) < 1e-9 &&
        Math.abs(s.marginMax - hi) < 1e-9 &&
        s.nRows === 15
      );
    },
  },

  // (T8) Ideal-counting coefficients: a_K(1) = 1, and the inert/ramified
  //      structure for Q(i) (D=-4) is correct: a_K(3)=0 (inert), a_K(5)=2 (split)
  {
    id: 'imp2357-ideal-counts-arithmetic-correct',
    why:
      'a_K(n) = #{ideals of norm n} must satisfy a_K(1) = 1 for every field and ' +
      'the Q(i) splitting must be correct: 3 is inert so a_K(3) = 0, 5 splits so ' +
      'a_K(5) = 2. A wrong coefficient means the Kronecker symbol / convolution ' +
      'is broken and the kernel is the wrong arithmetic object.',
    holds: () => {
      const fields = IMP2357_SELBERG_VOLTERRA_MARGIN.fields;
      const everyAK1 = fields.every((f) => f.aK_1_to_12[0] === 1);
      const qi = fields.find((f) => f.D === -4);
      // aK_1_to_12 is indexed from n=1, so index 2 is a_K(3), index 4 is a_K(5)
      return everyAK1 && qi.aK_1_to_12[2] === 0 && qi.aK_1_to_12[4] === 2;
    },
  },

  // (T9) Honest scope flags the imaginary-quadratic-only restriction and BOTH
  //      named matrix-gamma sub-gaps (real quadratic, sym^m)
  {
    id: 'imp2357-honest-scope-names-matrix-gamma-sub-gap',
    why:
      'The deliverable is a PARTIAL: only the single-Gamma scalar subfamily is ' +
      'computed. honestScope must flag the imaginary-quadratic restriction and ' +
      'both matrix-gamma sub-gaps (real quadratic Gamma_R^2, and sym^m L). ' +
      'Missing any of these understates the open scope.',
    holds: () => {
      const scope = IMP2357_SELBERG_VOLTERRA_MARGIN.honestScope.join(' | ').toLowerCase();
      return (
        IMP2357_SELBERG_VOLTERRA_MARGIN.honestScope.length >= 6 &&
        scope.includes('imaginary quadratic') &&
        scope.includes('real quadratic') &&
        (scope.includes('sym^m') || scope.includes('symmetric-power')) &&
        scope.includes('matrix') &&
        (scope.includes('galerkin') || scope.includes('lower bound'))
      );
    },
  },

  // (T10) Source parents link imp-1267 and imp-1317 (audit trail)
  {
    id: 'imp2357-source-parents-1267-and-1317-linked',
    why:
      'imp-2357 inherits the scalar HS machinery from imp-1267 and the concrete ' +
      'GL(2) precedent from imp-1317. sourceParents must record live values from ' +
      'both, demonstrating they were actually imported and used.',
    holds: () => {
      const sp = IMP2357_SELBERG_VOLTERRA_MARGIN.sourceParents;
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
