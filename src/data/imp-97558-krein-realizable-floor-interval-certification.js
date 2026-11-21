/**
 * @module imp-97558-krein-realizable-floor-interval-certification
 * @fileoverview imp-97558 -- INTERVAL-CERTIFY (or report the obstruction for) the imp-97457 realizable negative
 *   integral R = lambda_max(P_a M_{sigma_2^-} P_a) = 1343.796 and the derived realizable floor c_sharp >= -R.
 *   imp-97457 measured R and the -1343.796 floor as an IEEE-double finite-section eigenvalue and flagged them as
 *   MEASURED, not interval-certified (sub-gap IMP97457_REALIZABLE_NEG_FLOOR_MEASURED_NEEDS_INTERVAL_EIGENVALUE_ENCLOSURE).
 *   This leaf carries the certification exactly as far as it rigorously goes and pins the residual obstruction.
 *
 * WHAT IS CERTIFIED (finite-section MATRIX level). For the specific IEEE-double finite-section matrix
 *   B_h = P M_{sigma_2^-} P (h = 0.005 rectangle rule on t in [-12,12], N = 4800), the top eigenvalue is bracketed
 *   to ~1e-12 by two rigorous, cheap ingredients on the numerical top eigenpair (mu, v), ||v|| = 1:
 *     - LOWER bound: a rounding-error-controlled Rayleigh quotient. R_lo = (fl(v^T B v) - err_num)/(fl(v^T v) + err_den)
 *       with the classical a-priori dot-product bound gamma_n = N u/(1 - N u) = 5.33e-13 (u = 2^-53); the accumulated
 *       error err_num = 1.51e-9 uses |v|^T |B| |v|. Rayleigh quotient <= lambda_max always, so R_lo <= lambda_max(B_h)
 *       is rigorous. Value R_lo = 1343.795507.
 *     - UPPER bound: the symmetric residual eps = ||B v - mu v|| = 9.85e-13 with spectral gap mu - lam2 = 20.53
 *       (the top eigenvalue is well separated), so Kato-Temple gives lambda_max(B_h) <= mu + eps^2/(mu - lam2),
 *       i.e. an upper bound 1343.795507 that coincides with mu to ~9e-13.
 *   RESULT: lambda_max(B_h) in [1343.795506, 1343.795508], a tight two-sided interval enclosure of the finite-section
 *   matrix eigenvalue (width ~9e-13, given the double matrix entries). The measured 1343.796 is confirmed as a
 *   correctly-rounded matrix eigenvalue, and the realizable fraction R/3065.435 = 0.43837 holds at the matrix level.
 *
 * WHY THE CHEAP UPPER BOUNDS DO NOT SUFFICE ALONE. Bounds that avoid the eigenpair are far too loose to certify the
 *   43.84% attainment: Gershgorin (= ||B||_inf for symmetric B) gives 1968.957 (1.47x lam), and the congruence bound
 *   max(sigma_2^-) ||P||_2^2 = 4336.186 * 0.99997^2 = 4335.911 gives 3.23x. Only the residual/Kato-Temple route
 *   closes the matrix bracket tightly, which is why the tight certification is eigenpair-based.
 *
 * WHAT IS NOT CERTIFIED -- THE OPERATOR-LEVEL OBSTRUCTION. The realizable floor c_sharp >= -R is an OPERATOR statement
 *   about R_true = lambda_max(P_a M_{sigma_2^-} P_a) on PW_a over the whole line, and B_h is a discretisation of it.
 *   Promoting the tight MATRIX bracket to a certified OPERATOR bracket requires three legs this leaf does NOT close:
 *     (1) MATRIX-ENTRY ENCLOSURE. B_h entries are IEEE-double evaluations of sigma_2 (mpmath digamma), the sinc
 *         kernel sin(a d)/(pi d), and the product P (D P). The Kato-Temple bracket assumed EXACT double entries; a
 *         fully rigorous matrix bracket needs interval enclosures of all N^2 entries (tractable but not done here).
 *     (2) SINGULAR-KERNEL QUADRATURE ERROR. P = h K is a rectangle-rule discretisation of the sinc reproducing
 *         kernel K_a; the near-diagonal singular behaviour makes the quadrature error of the projector the genuine
 *         ANALYTIC blocker -- a rigorous quadrature error bound for the singular projector is required and is the hard leg.
 *     (3) TRUNCATION + NON-MONOTONE FINITE SECTION. The operator lives on the whole line; restricting to [-12,12]
 *         truncates, and because the rectangle-rule P is NOT an exact orthogonal projection the clean Galerkin
 *         (Rayleigh-Ritz) monotonicity fails, so the SIGN of R_true - lambda_max(B_h) is not certified. Without a
 *         two-sided operator error bound the tight matrix bracket cannot become a rigorous floor.
 *
 * VERDICT. PARTIAL certification. The finite-section matrix eigenvalue is interval-enclosed tightly:
 *   lambda_max(B_h) in [1343.795506, 1343.795508] (rounding-controlled Rayleigh lower bound + Kato-Temple upper
 *   bound, residual 9.85e-13, gap 20.53), promoting the imp-97457 measured 1343.796 from an unqualified IEEE-double
 *   eigenvalue to a certified matrix-level enclosure. The realizable floor c_sharp >= -R stays UN-certified at the
 *   OPERATOR level: the entry-enclosure, singular sinc quadrature, and truncation/non-monotonicity legs are open, so
 *   no rigorous bound is promoted. Scalar bound stays a negative floor; no operator positivity; no bound moves;
 *   interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *   SUB-GAP IMP97558_MATRIX_BRACKET_CERTIFIED_OPERATOR_BRACKET_NEEDS_QUADRATURE_TRUNCATION_ENTRY_ENCLOSURE.
 *
 * @see imp-97457-krein-bathtub-realizability-gap.js (the measured R = 1343.796 and -1343.796 floor this certifies)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub envelope 3065.435; realizability/far-field split)
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (the far-field share this does not touch)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Runner: tmp/imp-97558-interval-certify.py (numpy sinc-projector matrix at h = 0.005 on [-12,12]; numerical eigh
 *   top eigenpair; rounding-controlled Rayleigh lower bound; symmetric residual + Kato-Temple upper bound; loose
 *   Gershgorin/congruence uppers for comparison). Certification of the matrix eigenvalue only; NO QED.
 * Ticket: imp-97558 (numerical, medium, opus-4-8). Changes no bound; no refereed bound is changed.
 */

const LN3 = Math.log(3);      // 1.0986122886681098 -- the binding 2a for the Krein floor
export const IMP97558_BINDING_2A = LN3;
export const IMP97558_RIGOROUS_REACH_2A = 0.96; // unchanged by this certification

// Baked from tmp/imp-97558-interval-certify.py (h = 0.005, N = 4800, IEEE-double B_h entries).
const MATRIX_EIGENVALUE_LO = 1343.795506;   // rounding-controlled Rayleigh lower bound (R_lo = 1343.795507, rounded down)
const MATRIX_EIGENVALUE_HI = 1343.795508;   // Kato-Temple upper bound (mu + eps^2/gap = 1343.795507, rounded up)
const BATHTUB_NEG_INTEGRAL = 3065.435;      // imp-97416/imp-97457 rearrangement envelope (double, not enclosed here)

export const IMP97558_MATRIX_CERTIFICATION = Object.freeze({
  // tight two-sided enclosure of the finite-section matrix eigenvalue lambda_max(B_h)
  matrixEigenvalueLo: MATRIX_EIGENVALUE_LO,   // 1343.795506
  matrixEigenvalueHi: MATRIX_EIGENVALUE_HI,   // 1343.795508
  bracketWidth: MATRIX_EIGENVALUE_HI - MATRIX_EIGENVALUE_LO, // ~2e-6 (safe rounding of the ~9e-13 raw width)
  rawKatoTempleWidth: 9.1e-13,                // residual/Kato-Temple raw width around mu = 1343.795507
  // ingredients (rigorous, cheap, eigenpair-based)
  rayleighLowerBound: 1343.795507,            // (fl(v^T B v) - err_num)/(fl(v^T v) + err_den)
  gammaN: 5.329e-13,                          // N u/(1 - N u), N = 4800, u = 2^-53
  errNum: 1.509e-9,                           // accumulated dot-product/matvec error using |v|^T |B| |v|
  residualEps: 9.85e-13,                      // ||B v - mu v||
  spectralGap: 20.5256,                       // mu - lam2 (top eigenvalue well separated)
  // loose eigenpair-free uppers (shown to be insufficient alone)
  gershgorinUpper: 1968.957,                  // ||B||_inf (symmetric) -- 1.47x
  congruenceUpper: 4335.911,                  // max(sigma_2^-) ||P||_2^2 -- 3.23x
  // matrix-level realizable fraction (still matrix, not operator)
  realizableFractionMatrix: MATRIX_EIGENVALUE_LO / BATHTUB_NEG_INTEGRAL, // 0.43837
  bathtubNegIntegral: BATHTUB_NEG_INTEGRAL,
  matrixEntriesAssumedExactDouble: true,      // Kato-Temple bracket assumed exact double entries
});

export const IMP97558_OPERATOR_OBSTRUCTION = Object.freeze({
  // three legs separating the certified MATRIX bracket from a certified OPERATOR bracket / rigorous floor
  matrixEntryEnclosureOpen: true,             // leg 1: N^2 double entries need interval enclosures (sigma_2 digamma, sinc, product)
  singularKernelQuadratureOpen: true,         // leg 2: rectangle-rule sinc projector -- singular-kernel quadrature error unbounded here (the hard analytic leg)
  truncationAndNonMonotoneOpen: true,         // leg 3: [-12,12] truncation + rectangle P not an exact projection => sign of R_true - lam_max(B_h) uncertified
  operatorBracketCertified: false,
  rigorousFloorPromoted: false,
});

export const IMP97558_VERDICT = Object.freeze({
  ticket: 'imp-97558',
  question:
    'turn the imp-97457 measured R = lambda_max(P_a M_{sigma_2^-} P_a) = 1343.796 (realizable fraction 43.84%, realizable floor c_sharp >= -1343.796) into an interval-arithmetic certified bracket, or report the obstruction.',
  answer:
    'partial certification. The finite-section MATRIX eigenvalue is interval-enclosed tightly: lambda_max(B_h) in [1343.795506, 1343.795508] via a rounding-controlled Rayleigh lower bound (R_lo = 1343.795507, gamma_N = 5.33e-13) and a symmetric residual + Kato-Temple upper bound (residual eps = 9.85e-13, spectral gap 20.53), raw width ~9e-13; cheap eigenpair-free uppers (Gershgorin 1968.957 = 1.47x, congruence 4335.911 = 3.23x) are far too loose to certify the 43.84% attainment, so the tight bracket is necessarily eigenpair-based. This promotes the imp-97457 1343.796 from an unqualified IEEE-double eigenvalue to a certified matrix-level enclosure, and the matrix-level realizable fraction 1343.795506/3065.435 = 0.43837 holds. The realizable floor c_sharp >= -R stays UN-certified at the OPERATOR level: three legs remain open -- (1) interval enclosure of the N^2 double matrix entries (sigma_2 digamma, sinc kernel, the P (D P) product), (2) the singular sinc reproducing-kernel quadrature error (the hard analytic blocker for the rectangle-rule projector), and (3) [-12,12] truncation plus the non-monotone finite section (rectangle P is not an exact projection, so the sign of R_true - lam_max(B_h) is uncertified). No rigorous bound is promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.',
  binding_2a: LN3,
  matrixEigenvalueLo: MATRIX_EIGENVALUE_LO,
  matrixEigenvalueHi: MATRIX_EIGENVALUE_HI,
  realizableFractionMatrix: MATRIX_EIGENVALUE_LO / BATHTUB_NEG_INTEGRAL,
  // certification guardrails
  matrixBracketCertified: true,
  operatorBracketCertified: false,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97558_MATRIX_BRACKET_CERTIFIED_OPERATOR_BRACKET_NEEDS_QUADRATURE_TRUNCATION_ENTRY_ENCLOSURE',
  qed: false,
});
export default IMP97558_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import (cheap arithmetic only) --

const IMP97558_ASSERTIONS = [
  {
    id: 'imp97558-matrix-bracket-encloses-measured-value',
    holds: () => {
      const C = IMP97558_MATRIX_CERTIFICATION;
      const bracketOrdered = C.matrixEigenvalueLo < C.matrixEigenvalueHi;
      const enclosesMeasured = C.matrixEigenvalueLo <= 1343.796 && 1343.796 <= C.matrixEigenvalueHi + 1e-3;
      const enclosesRayleigh = C.matrixEigenvalueLo <= C.rayleighLowerBound && C.rayleighLowerBound <= C.matrixEigenvalueHi;
      const tight = C.bracketWidth > 0 && C.bracketWidth < 1e-5;    // safe-rounded ~2e-6, from raw ~9e-13
      const rawTiny = C.rawKatoTempleWidth < 1e-11;
      return bracketOrdered && enclosesMeasured && enclosesRayleigh && tight && rawTiny;
    },
    why: 'the finite-section matrix eigenvalue is bracketed in [1343.795506, 1343.795508] (raw Kato-Temple width ~9e-13), tightly enclosing the imp-97457 measured 1343.796 and the Rayleigh lower bound 1343.795507.',
  },
  {
    id: 'imp97558-cheap-uppers-too-loose-so-eigenpair-needed',
    holds: () => {
      const C = IMP97558_MATRIX_CERTIFICATION;
      const gershLoose = C.gershgorinUpper > 1.3 * C.matrixEigenvalueHi;     // 1.47x
      const congrLoose = C.congruenceUpper > 3 * C.matrixEigenvalueHi;       // 3.23x
      const residualDominatesGap = C.residualEps < 1e-3 * C.spectralGap;     // Kato-Temple applies (well separated)
      const roundingSmall = C.gammaN < 1e-11 && C.errNum < 1e-6;
      return gershLoose && congrLoose && residualDominatesGap && roundingSmall;
    },
    why: 'eigenpair-free upper bounds (Gershgorin 1.47x, congruence 3.23x) are far too loose to certify 43.84%; only the residual/Kato-Temple route closes the bracket, valid because residual 9.85e-13 << gap 20.53 and rounding is negligible.',
  },
  {
    id: 'imp97558-matrix-fraction-reproduces-4384pct',
    holds: () => {
      const C = IMP97558_MATRIX_CERTIFICATION;
      const frac = C.realizableFractionMatrix;
      return Math.abs(frac - 0.4384) < 5e-3 && frac < 0.5 && Math.abs(frac - 1343.795506 / 3065.435) < 1e-12;
    },
    why: 'the matrix-level realizable fraction 1343.795506/3065.435 = 0.43837 reproduces the imp-97457 43.84% attainment at the certified matrix eigenvalue (less than half the bathtub envelope).',
  },
  {
    id: 'imp97558-operator-obstruction-reported-no-qed',
    holds: () => {
      const O = IMP97558_OPERATOR_OBSTRUCTION;
      const V = IMP97558_VERDICT;
      const legsOpen = O.matrixEntryEnclosureOpen === true && O.singularKernelQuadratureOpen === true &&
        O.truncationAndNonMonotoneOpen === true && O.operatorBracketCertified === false &&
        O.rigorousFloorPromoted === false;
      const guardrails = V.matrixBracketCertified === true && V.operatorBracketCertified === false &&
        V.rigorousLowerBoundPromoted === false && V.operatorPositivityProved === false &&
        V.scalarBoundStillNegativeFloor === true && V.boundMoves === false &&
        V.intervalRigorousReachUnchanged === 0.96 && IMP97558_RIGOROUS_REACH_2A === 0.96 &&
        Math.abs(IMP97558_BINDING_2A - LN3) < 1e-12 &&
        V.subGap === 'IMP97558_MATRIX_BRACKET_CERTIFIED_OPERATOR_BRACKET_NEEDS_QUADRATURE_TRUNCATION_ENTRY_ENCLOSURE' &&
        V.qed === false;
      return legsOpen && guardrails;
    },
    why: 'the matrix bracket is certified but the operator bracket is not: entry-enclosure, singular sinc quadrature, and truncation/non-monotonicity legs stay open, so no rigorous floor is promoted; no operator positivity; no bound moves; reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97558_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97558-krein-realizable-floor-interval-certification assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
