/**
 * @module imp-2402-gl2-weight16-hs
 * @fileoverview imp-2402 -- HS-bound spot-check on an ADDITIONAL GL(2)
 *   L-function family: the weight-16 level-1 holomorphic newform
 *   F = Delta * E4 (LMFDB 1.16.a.a). Extends the imp-1267 (zeta) /
 *   imp-1317 (Delta, weight 12) / imp-1346 (Dirichlet) / imp-2356 (Maass)
 *   validation set with a SECOND holomorphic GL(2) cusp form of a DIFFERENT
 *   weight, testing whether the Cauchy-Schwarz slack and the ||V|| << 1
 *   contraction persist as the gamma-factor center k/2 moves from 6 to 8.
 *
 *   QUESTION
 *   --------
 *   imp-1298 argued STRUCTURALLY that the scalar HS bound
 *
 *       ||V_{a, Phi}||_HS <= sqrt(I_0 * J_a)         (imp-1267)
 *
 *   extends to GL(n) automorphic L. imp-1317 confirmed it CONCRETELY on the
 *   weight-12 cusp form Delta. This ticket asks: does the bound also hold on a
 *   SECOND holomorphic GL(2) cusp form of a different weight (16)?
 *
 *   FORM CHOSEN: weight-16 newform F = Delta * E4 (LMFDB 1.16.a.a)
 *   -------------------------------------------------------------
 *   S_16(SL(2, Z)) is 1-dimensional, spanned by the cusp form Delta * E4. The
 *   normalized Hecke eigenform F has integer coefficients a(n) with a(1) = 1,
 *   a(2) = 216, a(3) = -3348, a(4) = 13888, a(5) = 52110, ... These are
 *   computed EXACTLY (not hardcoded) in scripts/compute-imp2402-gl2-weight16-hs.mjs
 *   from the q-expansions of Delta = q * prod (1 - q^m)^24 and
 *   E4 = 1 + 240 sum sigma_3(n) q^n. F is self-dual with trivial character.
 *
 *   Completed L-function:
 *       Lambda(s, F) = (2*pi)^{-s} * Gamma(s) * L(s, F)
 *       Functional equation: Lambda(s, F) = Lambda(16 - s, F)  (root number +1)
 *
 *   WHY a second holomorphic form (vs a Maass form):
 *     - Coefficients are integer-valued and exactly computable to arbitrary
 *       precision (unlike Maass-form Hecke eigenvalues, which require numerical
 *       spectral data; that case is the separate imp-2356 test).
 *     - Changing the WEIGHT from 12 to 16 changes the archimedean parameter
 *       (gamma-factor center s = k/2 goes 6 -> 8), so this is a genuinely
 *       different Phi_L decay profile, not a relabeling of Delta.
 *
 *   PHI_F CONSTRUCTION  (center s = k/2 = 8)
 *   ----------------------------------------
 *   f(y) := sum_{n>=1} a(n) exp(-2*pi*n*y);  Lambda(s,F) = int_0^inf f(y) y^{s-1} dy.
 *   Functional equation f(1/y) = y^{16} f(y). Substituting y = e^u, centering at
 *   s = 8 + it:
 *       Phi_F(u) := e^{8u} * f(e^u) = e^{8u} * sum_n a(n) exp(-2*pi*n*e^u).
 *   Phi_F(-u) = Phi_F(u). Super-exponential decay on R_+:
 *   Phi_F(u) ~ e^{8u} exp(-2 pi e^u).
 *
 *   NUMERICAL RESULTS (run 2026-06-04 via scripts/compute-imp2402-gl2-weight16-hs.mjs)
 *   ---------------------------------------------------------------------------------
 *   N_A = 20 (coefficient-series truncation; tail bound at u=0 is < 2e-47).
 *   U_INF = 2, N_INF = 20000 midpoint nodes for I_0^L and J_a^L.
 *   U_OP  = 2, N_OP  = 800 for Galerkin V matrix + power iteration.
 *
 *   Phi_F(0)     = 2.599e-3
 *   Phi_F(1)     = 1.140e-4
 *   Phi_F(2)     = 6.11e-14    (effectively fp-zero past u=2)
 *   max|Phi_F|   = 2.599e-3    (attained at u near 0)
 *
 *   I_0^L = int_0^U_INF Phi_F(u)^2 du = 3.248823e-6
 *
 *   Three-row sweep at a in {0.01, 0.05, 0.2}:
 *
 *     a       I_0^L         J_a^L         HS_bound     op_norm      margin
 *     -----   -----------   -----------   ----------   ----------   ------
 *     0.01    3.249e-6      3.526e-11     1.070e-8     5.885e-9     1.82x
 *     0.05    3.249e-6      8.817e-10     5.352e-8     2.943e-8     1.82x
 *     0.20    3.249e-6      1.415e-8      2.144e-7     1.179e-7     1.82x
 *
 *   - HS_bound = sqrt(I_0^L * J_a^L)  (analytical closed-form upper bound)
 *   - op_norm  = Galerkin matrix 2-norm via power iteration on V[i][j]
 *                with V[i][j] = h * Phi(t_i) Phi(t_j) sinh(a (t_j - t_i)) for j > i
 *   - margin   = HS_bound / op_norm  (ratio of analytical to empirical)
 *
 *   VERDICT
 *   -------
 *   ALL THREE rows: HS bound HOLDS empirically (HS_bound >= op_norm). The
 *   Cauchy-Schwarz slack factor is a constant 1.82x at every a, INSIDE the
 *   imp-1267 scalar-xi slack band (1.58x to 2.57x) and close to the 1.71x of
 *   the weight-12 Delta case (imp-1317). Both HS bound and op_norm are << 1
 *   (more than 6 orders of magnitude below the Conj 27.2 threshold of 1).
 *
 *   VERDICT: 'gl2-weight16-HS-bound-holds'.
 *
 *   INTERPRETATION
 *   --------------
 *   The HS contraction is NOT specific to the weight-12 form Delta: a second
 *   holomorphic GL(2) cusp form of a different weight (16, gamma center s = 8)
 *   shows the same ||V|| << 1 behavior with a comparable Cauchy-Schwarz slack.
 *   This is corroborating empirical evidence for the imp-1298 structural
 *   extension across holomorphic cusp forms of varying archimedean type.
 *
 *   LINEARITY-IN-a CHECK
 *   --------------------
 *   sinh(au) ~ au for small au, so HS bound ~ a * sqrt(I_0^L * M_2^L).
 *     HS(0.05) / HS(0.01) = 5.352e-8 / 1.070e-8 = 5.001  (a-ratio 5.0 -> OK)
 *     HS(0.20) / HS(0.05) = 2.144e-7 / 5.352e-8 = 4.007  (a-ratio 4.0 -> OK)
 *   Linear-in-a scaling matches expectation to < 0.2% across the swept grid.
 *
 *   HONEST CAVEATS
 *   --------------
 *   1. COEFFICIENT TRUNCATION at n=20: tail bounded by |a(21)| exp(-2 pi 21 e^u)
 *      with |a(n)| <= sigma_0(n) n^{15/2} (Deligne 1974). At u=0 the residual
 *      is < 2e-47, fp-zero across [0, U_INF].
 *   2. INTEGRATION DOMAIN [0, U_INF=2]: Phi_F(u) at u=2 is ~6.1e-14, so
 *      Phi_F^2 ~ 3.7e-27, well below quadrature noise relative to I_0^L ~ 3e-6.
 *   3. OP-NORM is a Galerkin LOWER BOUND on ||V||_op (||A_N|| <= ||V||). The
 *      "HS bound dominates op_norm" test is therefore NECESSARY (not
 *      sufficient); the 1.82x margin is large enough that discretization noise
 *      cannot flip the verdict.
 *   4. SCALAR (not matrix) HS BOUND: F is HOLOMORPHIC (weight 16), so its gamma
 *      factor is a single Gamma(s) and the matrix Phi_L of imp-1298 collapses to
 *      a scalar Phi_F. A true GL(2) Maass form (2x2 matrix Phi_L) is tested
 *      separately in imp-2356; the general matrix HS bound remains OPEN.
 *   5. THREE-ROW SWEEP only (a in {0.01, 0.05, 0.2}). Larger a would test the
 *      edge of the analytical closure range (cf imp-1316 scalar large-a sweep).
 *   6. NOT a proof of GRH for L(s, F). Modularity gives the analytic
 *      continuation and FE; the zero locations are conjectural. This test only
 *      confirms the OPERATOR-NORM side of the imp-1258 collapse holds
 *      empirically for F on the chosen grid.
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp2402-gl2-weight16-hs.mjs, run 2026-06-04.
 *
 *   Ticket: imp-2402 (numerical, medium, opus-4-8).
 */

import { IMP1267_VOLTERRA_HS_BOUND } from './imp-1267-volterra-hs-bound.js';
import { IMP1317_GL2_MAASS_HS_CONCRETE } from './imp-1317-gl2-maass-hs-concrete.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── Weight-16 newform coefficients a(1..20) (LMFDB 1.16.a.a) ────────────────
// Computed EXACTLY from Delta * E4 in scripts/compute-imp2402-gl2-weight16-hs.mjs.
// a(1)=1, a(2)=216 confirm the normalized Hecke eigenform.
const NEWFORM16_COEFFS = Object.freeze([
  null /* index 0 unused */,
  1, 216, -3348, 13888, 52110, -723168, 2822456, -4078080, -3139803, 11255760,
  20586852, -46497024, -190073338, 609650496, -174464280, -1335947264,
  1646527986, -678197448, 1563257180, 723703680,
]);

// ── Form metadata ───────────────────────────────────────────────────────────
const FORM_METADATA = Object.freeze({
  name: 'weight-16 level-1 newform (Delta * E4)',
  label: 'F = Delta * E4, the unique normalized cusp form spanning S_16(SL(2, Z))',
  weight: 16,
  level: 1,
  characterTrivial: true,
  selfDual: true,
  cuspidal: true,
  representation: 'GL(2)/Q, holomorphic, weight 16, level 1, trivial character',
  ramanujanConjecture:
    'Deligne 1974 (Weil conjectures): |a(p)| <= 2 * p^{15/2} for all primes p',
  lFunctionLMFDB: 'https://www.lmfdb.org/L/ModularForm/GL2/Q/holomorphic/1.16.a.a/',
  completedLambda: 'Lambda(s, F) = (2*pi)^{-s} * Gamma(s) * L(s, F)',
  functionalEquation: 'Lambda(s, F) = Lambda(16 - s, F)  (root number +1)',
  gammaFactor: '(2*pi)^{-s} * Gamma(s)  (single Gamma -- weight-16 holomorphic)',
  langlandsParameters: 'mu = 15/2 (single archimedean parameter, holomorphic weight shift)',
  archimedeanReduction:
    'Holomorphic weight k=16: gamma_pi(s) = (2pi)^{-s} Gamma(s) is a SINGLE Gamma factor. ' +
    'The matrix-Phi_L of imp-1298 collapses to a scalar Phi_F. The gamma center ' +
    's = k/2 = 8 differs from the Delta case (k/2 = 6), giving a different Phi_L decay profile.',
  coeffConstruction:
    'a(n) = (Delta * E4)[n], computed exactly from Delta = q prod (1 - q^m)^24 and ' +
    'E4 = 1 + 240 sum sigma_3(n) q^n. a(1)=1, a(2)=216 confirm normalization.',
});

// ── Phi_F construction ──────────────────────────────────────────────────────
const PHI_F_CONSTRUCTION = Object.freeze({
  formula:
    'Phi_F(u) = e^{8u} * sum_{n>=1} a(n) * exp(-2*pi*n*e^u)',
  derivation:
    'Lambda(s, F) = (2 pi)^{-s} Gamma(s) L(s, F) = integral_0^inf f(y) y^{s-1} dy ' +
    'where f(y) = sum_n a(n) exp(-2 pi n y). Substitution y = e^u in the Mellin ' +
    'integral and centering at s = 8 + it gives Lambda(8 + it) = integral_{-inf}^{inf} ' +
    'Phi_F(u) e^{iut} du. Phi_F is the inverse-Mellin Fourier kernel.',
  symmetry: 'Phi_F(-u) = Phi_F(u)  (functional equation f(1/y) = y^{16} f(y))',
  decay: 'Super-exponential: Phi_F(u) ~ e^{8u} exp(-2 pi e^u) as u -> infinity',
  center_s: 8,
  truncation_N_a: 20,
  truncation_tail_bound_at_u0: 1.8790896328896646e-47,
  truncation_tail_bound_at_U_INF: 0,
});

// ── Frozen rows from the 2026-06-04 run ────────────────────────────────────
const FROZEN_ROWS = Object.freeze([
  Object.freeze({
    a: 0.01,
    U_INF: 2,
    N_INF: 20000,
    U_OP: 2,
    N_OP: 800,
    I0_L: 0.0000032488227522766194,
    Ja_L: 3.525913686244796e-11,
    hs_bound: 1.0702835421716817e-8,
    op_norm_galerkin: 5.885163893474083e-9,
    iter_count: 7,
    converged: true,
    residual: 7.704797636688666e-14,
    hs_bound_holds: true,
    safety_margin: 1.818612975856957,
    hs_bound_below_one: true,
    op_norm_below_one: true,
  }),
  Object.freeze({
    a: 0.05,
    U_INF: 2,
    N_INF: 20000,
    U_OP: 2,
    N_OP: 800,
    I0_L: 0.0000032488227522766194,
    Ja_L: 8.816638610531888e-10,
    hs_bound: 5.3519805788601775e-8,
    op_norm_galerkin: 2.9428308154328857e-8,
    iter_count: 7,
    converged: true,
    residual: 7.571841281031222e-14,
    hs_bound_holds: true,
    safety_margin: 1.8186504473152698,
    hs_bound_below_one: true,
    op_norm_below_one: true,
  }),
  Object.freeze({
    a: 0.2,
    U_INF: 2,
    N_INF: 20000,
    U_OP: 2,
    N_OP: 800,
    I0_L: 0.0000032488227522766194,
    Ja_L: 1.415307697883835e-8,
    hs_bound: 2.14431430773505e-7,
    op_norm_galerkin: 1.1786892831577254e-7,
    iter_count: 7,
    converged: true,
    residual: 7.267946696488963e-14,
    hs_bound_holds: true,
    safety_margin: 1.8192362808206768,
    hs_bound_below_one: true,
    op_norm_below_one: true,
  }),
]);

// ── HS bound formula (mirroring imp-1267 + imp-1298 + imp-1317) ─────────────
const HS_BOUND_FORMULA = Object.freeze({
  label: 'HS-bd_F16',
  inequality: '||V_{a, Phi_F}||_op <= ||V_{a, Phi_F}||_HS <= sqrt(I_0^L * J_a^L)',
  kernel_formula:
    'k_{a, F}(x, y) = Phi_F(x) * Phi_F(y) * sinh(a*(x-y))  for 0 <= y <= x',
  I_0_L_definition: 'I_0^L = integral_0^infty Phi_F(u)^2 du',
  J_a_L_definition: 'J_a^L = integral_0^infty Phi_F(u)^2 sinh^2(a*u) du',
  derivation:
    'For 0 <= y <= x: sinh(a(x-y)) <= sinh(a*x). Separating x, y in HS integral: ' +
    '||V||_HS^2 = int_0^inf Phi(x)^2 int_0^x Phi(y)^2 sinh^2(a(x-y)) dy dx ' +
    '<= int Phi(x)^2 sinh^2(a x) dx * int Phi(y)^2 dy = J_a^L * I_0^L. ' +
    'Identical to imp-1267 / imp-1317 with Phi replaced by Phi_F (F is self-dual ' +
    'and real-valued so no complex conjugation issue).',
});

// ── Linearity-in-a verification ─────────────────────────────────────────────
const LINEARITY_IN_A = Object.freeze([
  Object.freeze({
    a_lo: 0.01,
    a_hi: 0.05,
    a_ratio: 5.0,
    hs_ratio: 5.3519805788601775e-8 / 1.0702835421716817e-8,
    abs_dev: Math.abs(5.3519805788601775e-8 / 1.0702835421716817e-8 - 5.0),
  }),
  Object.freeze({
    a_lo: 0.05,
    a_hi: 0.2,
    a_ratio: 4.0,
    hs_ratio: 2.14431430773505e-7 / 5.3519805788601775e-8,
    abs_dev: Math.abs(2.14431430773505e-7 / 5.3519805788601775e-8 - 4.0),
  }),
]);

// ── Verdict choices ─────────────────────────────────────────────────────────
const ALLOWED_VERDICTS = Object.freeze([
  'gl2-weight16-HS-bound-holds',
  'gl2-weight16-HS-bound-fails-by-X',
  'phi-L-computation-too-coarse-for-verdict',
]);

const VERDICT = 'gl2-weight16-HS-bound-holds';

const VERDICT_RATIONALE =
  'All three rows (a in {0.01, 0.05, 0.2}) satisfy hs_bound >= op_norm with a ' +
  'consistent safety margin 1.82x, inside the imp-1267 scalar-xi slack band ' +
  '(1.58x-2.57x) and close to the 1.71x of the weight-12 Delta case (imp-1317). ' +
  'Both HS_bound (max 2.14e-7) and op_norm (max 1.18e-7) are more than 6 orders ' +
  'of magnitude below the Conj 27.2 threshold of 1. Linearity-in-a matches ' +
  'expected ratios (5.0 and 4.0) to < 0.2%. Corroborates the imp-1298 structural ' +
  'extension on a SECOND holomorphic GL(2) cusp form of a different weight (16).';

// ── Cross-references ────────────────────────────────────────────────────────
const CROSS_REFERENCES = Object.freeze([
  Object.freeze({
    ticket: 'imp-1267',
    role: 'scalar HS bound formula and methodology (Phi_xi case)',
    path: 'src/data/imp-1267-volterra-hs-bound.js',
  }),
  Object.freeze({
    ticket: 'imp-1298',
    role: 'GL(n) structural extension framework (matrix Phi_L, Bhatia 1997)',
    path: 'src/data/imp-1298-gl-n-selberg-extension.js',
  }),
  Object.freeze({
    ticket: 'imp-1317',
    role: 'sister: weight-12 Delta HS-bound test (first concrete GL(2) case)',
    path: 'src/data/imp-1317-gl2-maass-hs-concrete.js',
  }),
  Object.freeze({
    ticket: 'imp-2356',
    role: 'companion: real-analytic Maass-form HS-bound test (matrix case)',
    path: 'src/data/imp-2356-maass-volterra-hs.js',
  }),
]);

// ── Honest scope ────────────────────────────────────────────────────────────
const HONEST_SCOPE = Object.freeze([
  'EMPIRICAL TEST on a 3-row grid (a in {0.01, 0.05, 0.2}), NOT a proof of ' +
    'Conj 27.2 for L(s, F). The HS bound formula and inequality come from ' +
    'imp-1267 (scalar) + imp-1298 (matrix-trace extension via Bhatia 1997).',
  'FORM CHOICE: F is a HOLOMORPHIC cusp form (weight 16), the unique normalized ' +
    'newform spanning S_16(SL(2, Z)). Coefficients computed exactly from ' +
    'Delta * E4 (a(1)=1, a(2)=216, matching LMFDB 1.16.a.a). The HS-bound test ' +
    'is structurally identical to the weight-12 Delta case (imp-1317) but with a ' +
    'different gamma-factor center (s = 8 vs 6).',
  'MATRIX vs SCALAR: For weight-16 holomorphic F the gamma factor is a SINGLE ' +
    'Gamma(s), so the matrix Phi_L of imp-1298 collapses to a scalar Phi_F. The ' +
    'true 2x2 matrix case (GL(2) Maass form) is the separate imp-2356 test; the ' +
    'general matrix HS bound remains OPEN.',
  'OP-NORM via Galerkin power iteration is a LOWER BOUND on ||V||_op ' +
    '(||A_N|| <= ||V||). The "HS bound dominates op_norm" check is therefore ' +
    'NECESSARY but not sufficient; the 1.82x margin makes a flip unlikely.',
  'COEFFICIENT TRUNCATION at N=20: tail < 2e-47 at u=0 (using |a(n)| <= ' +
    'sigma_0(n) n^{15/2} bound and exp(-2 pi n) damping). FP-zero across [0, U_INF].',
  'INTEGRATION WINDOW [0, U_INF=2]: Phi_F(u) at u=2 is ~6.1e-14 (super-exp decay ' +
    'e^{8u} exp(-2 pi e^u)); Phi_F^2 ~ 3.7e-27 -- fp-negligible vs I_0^L ~ 3e-6.',
  'NOT a test of GRH for L(s, F). Modularity gives the analytic continuation and ' +
    'FE; zero locations are conjectural. This test only confirms the OPERATOR-NORM ' +
    'side of the imp-1258 collapse holds empirically for F on the chosen grid.',
]);

// ── Master export ───────────────────────────────────────────────────────────
export const IMP2402_GL2_WEIGHT16_HS = Object.freeze({
  id: 'imp-2402-gl2-weight16-hs',
  ticket: 'imp-2402',
  generatedAt: '2026-06-04T04:31:24Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['S25', 'S26', 'S27', 'imp-1298 GL(n) extension'],
  relatedTickets: ['imp-1267', 'imp-1298', 'imp-1317', 'imp-2356'],

  summary:
    'HS-bound spot-check on a SECOND holomorphic GL(2) L-function family: the ' +
    'weight-16 level-1 newform F = Delta * E4 (LMFDB 1.16.a.a). The bound ' +
    '||V_{a, Phi_F}||_op <= sqrt(I_0^L * J_a^L) HOLDS at all 3 swept a-values ' +
    '{0.01, 0.05, 0.2} with a consistent 1.82x Cauchy-Schwarz slack (inside the ' +
    'imp-1267 scalar-xi band 1.58x-2.57x, close to Delta weight-12 1.71x). Both ' +
    'HS bound (max 2.14e-7) and op_norm (max 1.18e-7) more than 6 orders below ' +
    'the Conj 27.2 threshold. Linearity-in-a matches to < 0.2%. ' +
    'VERDICT: gl2-weight16-HS-bound-holds. Corroborates the imp-1298 extension ' +
    'across holomorphic cusp forms of varying weight. NOT a proof of GRH for L(s, F).',

  formMetadata: FORM_METADATA,
  newform16Coefficients: NEWFORM16_COEFFS,
  N_A: NEWFORM16_COEFFS.length - 1,

  phiFConstruction: PHI_F_CONSTRUCTION,
  hsBoundFormula: HS_BOUND_FORMULA,

  method: Object.freeze({
    quadrature: 'midpoint rule',
    U_INF: 2,
    N_INF: 20000,
    h_INF: 1e-4,
    U_OP: 2,
    N_OP: 800,
    h_OP: 2.5e-3,
    phiFKernel: 'e^{8u} sum_{n=1..N_A} a(n) exp(-2 pi n e^u)',
    N_A: 20,
    phiTailEstimate: 'coef-series tail at u=0 < 2e-47; underflow to 0 past u~1.5',
    HS_bound_evaluation: 'sqrt(I_0^L * J_a^L) at each a',
    op_norm_evaluation:
      'Galerkin matrix 2-norm via power iteration on V[i][j] with ' +
      'V[i][j] = h * Phi_F(t_i) * Phi_F(t_j) * sinh(a (t_j - t_i)) for j > i',
    powerIterTol: 1e-10,
    powerIterMaxIter: 2000,
    seededRNG: 'LCG seed 0x12345678 (same as imp-1317)',
  }),

  sweep: Object.freeze({
    a_grid: Object.freeze([0.01, 0.05, 0.2]),
    nRows: 3,
  }),

  rows: FROZEN_ROWS,

  diagnostics: Object.freeze({
    I0_L: 0.0000032488227522766194,
    phi_at_0: 0.0025990751775401733,
    phi_max_abs: 0.002599075174917854,
    phi_at_1: 1.139831e-4,
    phi_at_2: 6.106676e-14,
    coef_tail_bound_u0: 1.8790896328896646e-47,
    coef_tail_bound_U_INF: 0,
  }),

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictRationale: VERDICT_RATIONALE,

  linearityInA: LINEARITY_IN_A,

  crossReferences: CROSS_REFERENCES,
  honestScope: HONEST_SCOPE,

  sourceParents: Object.freeze({
    imp_1267_verdict_substring: IMP1267_VOLTERRA_HS_BOUND.summary_stats.verdict,
    imp_1267_max_hs_bound: IMP1267_VOLTERRA_HS_BOUND.summary_stats.maxHsBound,
    imp_1317_verdict: IMP1317_GL2_MAASS_HS_CONCRETE.verdict,
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    computeScript: 'scripts/compute-imp2402-gl2-weight16-hs.mjs',
    imp1267HsBound: 'src/data/imp-1267-volterra-hs-bound.js',
    imp1317Gl2Delta: 'src/data/imp-1317-gl2-maass-hs-concrete.js',
    deligne1974: 'Deligne, P. (1974). La conjecture de Weil. I. Pub. IHES 43, 273-307',
    bhatiaMatrixAnalysis: 'Bhatia, R. (1997). Matrix Analysis, Springer GTM 169',
    iwaniecKowalski: 'Iwaniec, H. & Kowalski, E. (2004). Analytic Number Theory, AMS Coll 53',
    lmfdb: 'https://www.lmfdb.org/L/ModularForm/GL2/Q/holomorphic/1.16.a.a/',
  }),
});

export default IMP2402_GL2_WEIGHT16_HS;

// ── Tripwire assertions (10) ─────────────────────────────────────────────────
export const IMP2402_GL2_WEIGHT16_HS_ASSERTIONS = [
  // (T1) HS bound formula stated explicitly (matches imp-1267 / imp-1317)
  {
    id: 'imp2402-hs-bound-formula-explicit',
    why:
      'The HS bound formula ||V|| <= sqrt(I_0^L * J_a^L) must be present with ' +
      'both I_0^L and J_a^L defined as integrals against Phi_F. A drift means the ' +
      'formula is inconsistent with imp-1267 / imp-1317.',
    holds: () => {
      const f = IMP2402_GL2_WEIGHT16_HS.hsBoundFormula;
      return (
        typeof f.inequality === 'string' &&
        f.inequality.includes('sqrt(I_0^L * J_a^L)') &&
        f.I_0_L_definition.includes('Phi_F') &&
        f.I_0_L_definition.includes('integral') &&
        f.J_a_L_definition.includes('sinh') &&
        f.kernel_formula.includes('Phi_F(x)') &&
        f.kernel_formula.includes('sinh(a*(x-y))')
      );
    },
  },

  // (T2) HS bound holds at every row (op_norm <= HS_bound)
  {
    id: 'imp2402-hs-bound-holds-every-row',
    why:
      'PRIMARY SUCCESS CRITERION: the HS bound must dominate the Galerkin op_norm ' +
      'at every row. If hs_bound_holds=false at any row, the imp-1298 extension ' +
      'fails empirically for the weight-16 form.',
    holds: () =>
      IMP2402_GL2_WEIGHT16_HS.rows.every(
        (r) => r.hs_bound_holds === true && r.hs_bound >= r.op_norm_galerkin,
      ),
  },

  // (T3) Three a-values present (0.01, 0.05, 0.2)
  {
    id: 'imp2402-three-a-values-swept',
    why:
      'Ticket requires a in {0.01, 0.05, 0.2}. A missing or extra a-value means ' +
      'the sweep does not match the imp-1317 comparison grid.',
    holds: () => {
      const aSet = new Set(IMP2402_GL2_WEIGHT16_HS.rows.map((r) => r.a));
      return (
        IMP2402_GL2_WEIGHT16_HS.rows.length === 3 &&
        aSet.has(0.01) &&
        aSet.has(0.05) &&
        aSet.has(0.2)
      );
    },
  },

  // (T4) I_0^L computed and consistent across rows
  {
    id: 'imp2402-I0L-computed-and-consistent',
    why:
      'I_0^L = int Phi_F(u)^2 du is a-independent and must be identical across ' +
      'all rows. A drift between rows indicates a recomputation bug.',
    holds: () => {
      const I0Set = new Set(IMP2402_GL2_WEIGHT16_HS.rows.map((r) => r.I0_L));
      const expected = 0.0000032488227522766194;
      const I0Diag = IMP2402_GL2_WEIGHT16_HS.diagnostics.I0_L;
      return I0Set.size === 1 && I0Diag === expected && I0Diag > 0 && I0Diag < 1;
    },
  },

  // (T5) Verdict in allowed set + matches the data
  {
    id: 'imp2402-verdict-in-allowed-set',
    why:
      'The verdict must be one of the three allowed strings and must agree with ' +
      'the rows (all hs_bound_holds=true gives gl2-weight16-HS-bound-holds).',
    holds: () => {
      const v = IMP2402_GL2_WEIGHT16_HS.verdict;
      const allowed = IMP2402_GL2_WEIGHT16_HS.allowedVerdicts;
      const allHold = IMP2402_GL2_WEIGHT16_HS.rows.every((r) => r.hs_bound_holds);
      return allowed.includes(v) && v === 'gl2-weight16-HS-bound-holds' && allHold;
    },
  },

  // (T6) Cross-references include imp-1267 and imp-1317
  {
    id: 'imp2402-cross-references-1267-and-1317',
    why:
      'imp-2402 extends imp-1267 (scalar HS bound) and the imp-1317 (weight-12 ' +
      'Delta) concrete test. Both must appear in crossReferences or the audit ' +
      'trail to the underlying machinery breaks.',
    holds: () => {
      const ids = new Set(
        IMP2402_GL2_WEIGHT16_HS.crossReferences.map((c) => c.ticket),
      );
      return ids.has('imp-1267') && ids.has('imp-1317');
    },
  },

  // (T7) Form metadata: weight 16, level 1, self-dual, a(1)=1, a(2)=216
  {
    id: 'imp2402-form-metadata-weight-16',
    why:
      'The form is the weight-16 newform F = Delta * E4 (weight 16, level 1, ' +
      'self-dual, a(1)=1, a(2)=216 per LMFDB 1.16.a.a). Mistating the weight, ' +
      'self-duality, or the leading coefficients means the form is misidentified.',
    holds: () => {
      const m = IMP2402_GL2_WEIGHT16_HS.formMetadata;
      return (
        m.weight === 16 &&
        m.level === 1 &&
        m.selfDual === true &&
        m.cuspidal === true &&
        m.characterTrivial === true &&
        typeof m.completedLambda === 'string' &&
        m.completedLambda.includes('Gamma') &&
        m.functionalEquation.includes('16 - s') &&
        IMP2402_GL2_WEIGHT16_HS.N_A === 20 &&
        IMP2402_GL2_WEIGHT16_HS.newform16Coefficients[1] === 1 &&
        IMP2402_GL2_WEIGHT16_HS.newform16Coefficients[2] === 216 &&
        IMP2402_GL2_WEIGHT16_HS.newform16Coefficients[3] === -3348 &&
        IMP2402_GL2_WEIGHT16_HS.newform16Coefficients[5] === 52110
      );
    },
  },

  // (T8) Linearity-in-a holds within 1% absolute deviation
  {
    id: 'imp2402-linearity-in-a-within-1pct',
    why:
      'sinh(au) ~ au for small au, so HS bound ~ a * sqrt(I_0^L * M_2^L). The two ' +
      'reported ratios (HS(0.05)/HS(0.01) ~ 5.0 and HS(0.2)/HS(0.05) ~ 4.0) must ' +
      'match the a-ratios to within 1% absolute deviation. A larger deviation ' +
      'indicates a breakdown of the linear approximation or a quadrature bug.',
    holds: () => {
      for (const row of IMP2402_GL2_WEIGHT16_HS.linearityInA) {
        if (Math.abs(row.hs_ratio - row.a_ratio) > 0.01 * row.a_ratio) return false;
      }
      return true;
    },
  },

  // (T9) HS bound and op_norm both below 1 with large margin
  {
    id: 'imp2402-hs-bound-and-op-norm-below-1',
    why:
      'Both the HS bound (analytical) and op_norm (Galerkin lower bound) must be ' +
      'below 1 (the Conj 27.2 threshold). The actual max HS bound is 2.14e-7 ' +
      '(more than 6 orders of magnitude below 1).',
    holds: () =>
      IMP2402_GL2_WEIGHT16_HS.rows.every(
        (r) =>
          r.hs_bound_below_one === true &&
          r.op_norm_below_one === true &&
          r.hs_bound < 1e-5 &&
          r.op_norm_galerkin < 1e-5,
      ),
  },

  // (T10) Honest scope flags: holomorphic, scalar reduction, Galerkin lower bound
  {
    id: 'imp2402-honest-scope-flags-form-and-scalar-reduction',
    why:
      'F is HOLOMORPHIC; the matrix-Phi_L of imp-1298 collapses to a scalar here. ' +
      'The Galerkin lower-bound character of op_norm and the not-a-GRH-proof scope ' +
      'must also be flagged. Missing any is dishonest scope.',
    holds: () => {
      const scope = IMP2402_GL2_WEIGHT16_HS.honestScope.join(' | ').toLowerCase();
      return (
        IMP2402_GL2_WEIGHT16_HS.honestScope.length >= 6 &&
        scope.includes('holomorphic') &&
        (scope.includes('scalar') || scope.includes('collapse')) &&
        (scope.includes('galerkin') || scope.includes('lower bound')) &&
        scope.includes('not a')
      );
    },
  },
];
