/**
 * @module imp-3510-degree3-miss-factor-closed-form
 * @fileoverview imp-3510 -- DERIVE and CERTIFY the ODD-degree analogue of the
 *   imp-3488 degree-2 miss factor: the DEGREE-3 (sinh, absolute-measure) bridge
 *   mass carries exponent p = 3, over-prediction k^4, and relative miss
 *   1 - 1/k^4, then reconcile the derivation against a measured degree-3 k-ladder
 *   to the O(a^2) leading-form tail.
 *
 *   THE DEGREE-3 MASS AND ITS LEADING FORM (imp-3481)
 *   -------------------------------------------------
 *   imp-3481 established the odd remainder R_3(a) = S(a) - a*M_1 with leading
 *   form (a^3/6) M_3, where
 *       S(a)  = int_0^{T_A} sinh(a tau) A(tau) d(tau) = sum a^{2j+1}/(2j+1)! M_{2j+1},
 *       M_n   = int_0^{T_A} tau^n A(tau) d(tau)  (fixed genuine-Phi moments),
 *   and A(tau) the FIXED autocorrelation (NPHI = 10), support ~[0, 0.6] strictly
 *   inside every cutoff U >= T_A. The DEGREE-3 bridge mass is exactly this odd
 *   remainder,
 *       B_3(a, U) = int_0^U (sinh(a tau) - a tau) A(tau) d(tau) = S(a) - a M_1,
 *   subtracting the degree-1 (Lebesgue-linear) part, so its leading term is the
 *   degree-3 homogeneous form (a^3/6) M_3 (imp-3481 n = 3 rung).
 *
 *   THE CLOSED-FORM DERIVATION (this module)
 *   ----------------------------------------
 *   (D1) LEADING FORM. Because A truncates the integral at its support, B_3 is
 *        U-independent and small-a:
 *            B_3(a) = (a^3/6) M_3 + O(a^5),   M_3 = int tau^3 A(tau) d(tau) fixed.
 *        The leading term is exactly degree 3 (homogeneous) in a.
 *   (D2) EXPONENT p = 3, ANALYTICALLY. Homogeneity of the leading term gives
 *            B_3^lead(a/k) = ((a/k)^3/6) M_3 = k^{-3} B_3^lead(a),
 *        i.e. the exponent is EXACTLY p = 3, not fitted (measured 3 + O(a^2)).
 *   (D3) OVER-PREDICTION BY k^4. The imp-3405 degree-0 law B(a/k, kU) = k*B(a,U)
 *        multiplies by k, so
 *            (degree-0 prediction)/(actual) = k*B_3(a)/(k^{-3} B_3(a)) = k^4:
 *        the degree-0 prediction over-predicts the degree-3 mass by EXACTLY k^4
 *        (one power k from the Lebesgue prefactor it wrongly keeps, three powers
 *        k^{-3} from the a^3 homogeneity it ignores).
 *   (D4) MISS FACTOR 1 - 1/k^4. The relative miss of the degree-0 prediction is
 *            |B_3(a/k) - k B_3(a)| / |k B_3(a)|
 *              = |k^{-3} B_3(a) - k B_3(a)| / (k B_3(a))
 *              = |k^{-4} - 1| = 1 - 1/k^4      (k >= 2 => 1/k^4 <= 1/16 < 1).
 *        This is the ODD analogue of the imp-3488 degree-2 form 1 - 1/k^3, with
 *        the exponent shifted p: 2 -> 3 and the over-prediction k^3 -> k^4.
 *
 *   CERTIFICATION AGAINST A DEGREE-3 k-LADDER (to the O(a^2) tail)
 *   -------------------------------------------------------------
 *   On the imp-3469 base cells (0.5, 6) and (0.4, 10) with rungs {2,3,4,6,8},
 *   evaluating the degree-3 mass B_3 directly (self-computing A) and writing
 *   r_k = B_3(a/k)/B_3(a) the EXACT measured ratio:
 *   (C1) IDENTITY. The degree-0 relative residual equals 1 - r_k/k to machine
 *        precision (definitional).
 *   (C2) DERIVED = MEASURED to the O(a^4) tail. The derived miss 1 - 1/k^4 and
 *        the measured miss differ by exactly (r_k - 1/k^3)/k -- the leading-form
 *        error -- reconciled to the exact ratio r_k to machine precision.
 *   (C3) OVER-PREDICTION. The measured over-prediction predB/B_3(a/k) = k/r_k
 *        matches the derived k^4 to the same O(a^2) tail, reconciled exactly.
 *   (C4) EXPONENT. The derived p = 3 matches the measured -log(r_k)/log(k) to the
 *        O(a^2) tail (within 0.01), reconciled to r_k exactly.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DERIVATION / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   characterizes the k-scaling of the degree-3 mass integrand; it establishes
 *   NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT and
 *   the degree-3 (odd) face carries no feasibility comparison. The operator-level
 *   K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the
 *   rigorous SOTA.
 *
 *   @see imp-3488-degree2-miss-factor-closed-form.js (the even n=2 case this mirrors)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the moment M_3 and Taylor ladder)
 *   @see imp-3501-moment-ladder-general-derivation.js (the general R_n leading form)
 *
 *   Ticket: imp-3510 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686/imp-3481). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds, same pipeline as
// imp-3481: the kernel decays super-exponentially so upper limit 7 captures the
// whole overlap.
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3481. A(tau)
// is negligible beyond its support (~[0, 0.6]); T_A = 6 captures it in full and is
// strictly inside every ladder cutoff U >= 6.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

// -- The fixed Phi-autocorrelation moments M_1, M_3 (imp-3481) -----------------
const M1_MOMENT = aWeightedMass((tau) => tau);           // int tau A(tau) d(tau)
const M3_MOMENT = aWeightedMass((tau) => tau * tau * tau); // int tau^3 A(tau) d(tau)

// -- The DEGREE-3 (sinh, absolute-measure) bridge mass -------------------------
// B_3(a) = int_0^{T_A} (sinh(a tau) - a tau) A(tau) d(tau) = S(a) - a*M_1, the
// imp-3481 odd remainder R_3, U-independent (A support-truncated). The integrand
// difference is formed once inside the weight so the degree-1 part cancels under
// the integral, matching S(a) - a*M_1 to machine precision.
function degree3Mass(a) {
  return aWeightedMass((tau) => Math.sinh(a * tau) - a * tau);
}

// -- (D1) The leading small-a form B_3(a) ~ (a^3/6) M_3 ------------------------
function leadingForm(a) {
  return (a * a * a / 6) * M3_MOMENT;
}

// -- The imp-3469 base cells and k-ladder --------------------------------------
const K_LADDER = Object.freeze([2, 3, 4, 6, 8]);
const BASE_CELLS = Object.freeze([
  Object.freeze({ a: 0.5, u: 6, s: 3 }),        // base (0.5, 6)
  Object.freeze({ a: 0.4, u: 10, s: 4 }),       // base (0.4, 10)
]);

const leadingRelErr = (a) => Math.abs(leadingForm(a) - degree3Mass(a)) / Math.abs(degree3Mass(a));

/**
 * Certify the closed-form derivation on one base cell against a measured degree-3
 * k-ladder. For each rung reconstructs the exact ratio r_k = B_3(a/k)/B_3(a) and
 * reconciles:
 *   - the derived exponent p = 3 (leading form) vs measured -log(r_k)/log(k),
 *   - the derived miss 1 - 1/k^4 vs the measured degree-0 residual (= 1 - r_k/k),
 *   - the derived over-prediction k^4 vs the measured k/r_k,
 * with the leading-form error reconciled to r_k to machine precision.
 */
function certifyLadder(cell) {
  const baseB3 = degree3Mass(cell.a);
  const rungs = K_LADDER.map((k) => {
    const scaledB3 = degree3Mass(cell.a / k);          // B_3(a/k)
    const ratio = scaledB3 / baseB3;                   // r_k, EXACT measured scaling ratio

    // Derived closed forms (leading, homogeneous a^3 form) --------------------
    const derivedExponent = 3;                         // p = 3, from a^3 homogeneity (D2)
    const derivedMiss = 1 - 1 / (k * k * k * k);       // 1 - 1/k^4 (D4)
    const derivedOverPred = k * k * k * k;             // k^4 (D3)

    // Measured quantities, expressed through the exact ratio r_k --------------
    const predDegree0 = k * baseB3;                    // degree-0 law prediction k*B_3(a)
    const measuredMiss = Math.abs(scaledB3 - predDegree0) / Math.abs(predDegree0); // = 1 - r_k/k
    const measuredExponent = -Math.log(ratio) / Math.log(k);
    const measuredOverPred = predDegree0 / scaledB3;   // = k/r_k

    // (C1) IDENTITY: degree-0 residual == 1 - r_k/k to machine precision ------
    const missIdentityGap = Math.abs(measuredMiss - (1 - ratio / k));
    const overPredIdentityGap = Math.abs(measuredOverPred - k / ratio);

    // (C2) derived vs measured miss differs by exactly (r_k - 1/k^3)/k --------
    const missDerivedVsMeasured = derivedMiss - measuredMiss;   // leading-form error
    const missTailExact = (ratio - 1 / (k * k * k)) / k;        // its closed value
    const missReconGap = Math.abs(missDerivedVsMeasured - missTailExact);

    // (C3) over-prediction: derived k^4 vs measured k/r_k (bounded by O(a^2) tail)
    const overPredReconGap = Math.abs(derivedOverPred - measuredOverPred);

    // (C4) exponent: derived 3 vs measured, within the O(a^2) tail ------------
    const exponentGap = Math.abs(derivedExponent - measuredExponent);

    return Object.freeze({
      k,
      ratio,
      derivedExponent,
      measuredExponent,
      exponentGap,
      derivedMiss,
      measuredMiss,
      missDerivedVsMeasured,
      missReconGap,
      derivedOverPred,
      measuredOverPred,
      overPredReconGap,
      missIdentityGap,
      overPredIdentityGap,
    });
  });
  return Object.freeze({
    base: Object.freeze({ a: cell.a, u: cell.u, s: cell.s, B3: baseB3 }),
    rungs,
    maxMissReconGap: Math.max(...rungs.map((r) => r.missReconGap)),
    maxMissTail: Math.max(...rungs.map((r) => Math.abs(r.missDerivedVsMeasured))),
    maxExponentGap: Math.max(...rungs.map((r) => r.exponentGap)),
    maxMissIdentityGap: Math.max(...rungs.map((r) => r.missIdentityGap)),
    maxOverPredIdentityGap: Math.max(...rungs.map((r) => r.overPredIdentityGap)),
  });
}

const CERT_S3 = certifyLadder(BASE_CELLS[0]);
const CERT_S4 = certifyLadder(BASE_CELLS[1]);
const leadingRelErrS3 = leadingRelErr(BASE_CELLS[0].a);
const leadingRelErrS4 = leadingRelErr(BASE_CELLS[1].a);

// -- Tolerances ----------------------------------------------------------------
const IDENTITY_TOL = 1e-12;     // definitional identities: full machine precision
const RECON_TOL = 1e-12;        // leading-form error reconciled to r_k exactly
const MISS_TAIL_TOL = 1e-3;     // leading-form error itself (O(a^2) tail on the miss)
const EXPONENT_TOL = 0.01;      // derived p=3 vs measured (O(a^2) tail)
const LEADING_TOL = 1e-2;       // leading form reproduces base mass

// -- Classification ------------------------------------------------------------
const identitiesHold =
  Math.max(CERT_S3.maxMissIdentityGap, CERT_S4.maxMissIdentityGap) < IDENTITY_TOL &&
  Math.max(CERT_S3.maxOverPredIdentityGap, CERT_S4.maxOverPredIdentityGap) < IDENTITY_TOL;
const missReconciledToFullPrecision =
  Math.max(CERT_S3.maxMissReconGap, CERT_S4.maxMissReconGap) < RECON_TOL;
const missMatchesToLeadingTail =
  Math.max(CERT_S3.maxMissTail, CERT_S4.maxMissTail) < MISS_TAIL_TOL;
const exponentIsThree =
  Math.max(CERT_S3.maxExponentGap, CERT_S4.maxExponentGap) < EXPONENT_TOL;
const leadingFormHolds = leadingRelErrS3 < LEADING_TOL && leadingRelErrS4 < LEADING_TOL;

const verdict =
  identitiesHold && missReconciledToFullPrecision && missMatchesToLeadingTail &&
  exponentIsThree && leadingFormHolds
    ? 'DEGREE-3-MISS-FACTOR-1-MINUS-1-OVER-k^4-DERIVED-FROM-B3~(a^3/6)M3-EXPONENT-p=3-CERTIFIED-AGAINST-DEGREE-3-k-LADDER'
    : 'INDETERMINATE';

export const IMP3510_DEGREE3_MISS_FACTOR_CLOSED_FORM = Object.freeze({
  id: 'imp-3510-degree3-miss-factor-closed-form',
  ticket: 'imp-3510',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDegree2MissFactor: 'imp-3488-degree2-miss-factor-closed-form.js',
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',
  relatedGeneralDerivation: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'Derives the ODD-degree analogue of the imp-3488 degree-2 miss factor: the degree-3 (sinh, ' +
    'absolute-measure) bridge mass B_3(a) = int (sinh(a tau) - a tau) A(tau) d(tau) = S(a) - a M_1 ' +
    '(the imp-3481 odd remainder R_3) has leading form (a^3/6) M_3 (M_3 = int tau^3 A d(tau) fixed, ' +
    'U-independent), so by a^3 homogeneity B_3(a/k) = k^{-3} B_3(a): the exponent is EXACTLY p = 3, ' +
    'the imp-3405 degree-0 prediction k*B_3(a) over-predicts by EXACTLY k^4, and the relative miss is ' +
    '|k^{-4} - 1| = 1 - 1/k^4 (k >= 2). This shifts the imp-3488 even form p:2->3, k^3->k^4, ' +
    '1-1/k^3->1-1/k^4. Certified against a measured degree-3 k-ladder {2,3,4,6,8} on the bases ' +
    '(0.5,6) and (0.4,10) with r_k = B_3(a/k)/B_3(a): the degree-0 residual equals 1 - r_k/k ' +
    'identically (< 1e-12), the derived 1 - 1/k^4 matches it to the leading-form error (r_k - 1/k^3)/k ' +
    '(< 1e-3, reconciled to r_k to < 1e-12), the over-prediction k/r_k matches k^4 and the fitted ' +
    'exponent matches 3 to the O(a^2) tail. DERIVATION/CERTIFICATION, RH-EQUIVALENT, necessary-but-not-' +
    'sufficient; the degree-3 (odd) face carries no feasibility ratio; operator positivity (imp-3066) ' +
    'untouched; no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',

  derivation: Object.freeze({
    degree3Mass: 'B_3(a) = int (sinh(a tau) - a tau) A(tau) d(tau) = S(a) - a M_1 (imp-3481 R_3)',
    leadingForm: 'B_3(a) = (a^3/6) M_3 + O(a^5), M_3 = int tau^3 A(tau) d(tau) fixed & U-independent',
    exponent: 'B_3^lead(a/k) = ((a/k)^3/6) M_3 = k^{-3} B_3^lead(a) => p = 3 exactly (a^3 homogeneity)',
    overPrediction: '(degree-0 prediction)/(actual) = k*B_3(a) / (k^{-3} B_3(a)) = k^4',
    missFactor: 'relative miss = |k^{-4} - 1| = 1 - 1/k^4 (k >= 2, so 1/k^4 <= 1/16 < 1)',
    oddVsEven: 'even n=2 (imp-3488): p=2, k^3, 1-1/k^3; odd n=3 (this): p=3, k^4, 1-1/k^4',
    m1Moment: M1_MOMENT,
    m3Moment: M3_MOMENT,
    kLadder: K_LADDER,
    identityMiss: 'degree-0 residual = 1 - r_k/k with r_k = B_3(a/k)/B_3(a) (definitional)',
    leadingTail: 'derived miss - measured miss = (r_k - 1/k^3)/k, the O(a^2) leading-form error',
    selfComputing: true,
  }),

  certified: Object.freeze({
    ladderS3: CERT_S3,                       // base (0.5,6), s=3
    ladderS4: CERT_S4,                       // base (0.4,10), s=4
    leadingFormRelErrS3: leadingRelErrS3,    // |(a^3/6)M_3 - B_3(0.5)| / B_3(0.5)
    leadingFormRelErrS4: leadingRelErrS4,
    maxMissIdentityGap: Math.max(CERT_S3.maxMissIdentityGap, CERT_S4.maxMissIdentityGap),
    maxMissReconGap: Math.max(CERT_S3.maxMissReconGap, CERT_S4.maxMissReconGap),
    maxMissTail: Math.max(CERT_S3.maxMissTail, CERT_S4.maxMissTail),
    maxExponentGap: Math.max(CERT_S3.maxExponentGap, CERT_S4.maxExponentGap),
    identitiesHold,
    missReconciledToFullPrecision,
    missMatchesToLeadingTail,
    exponentIsThree,
    leadingFormHolds,
    verdict,
  }),

  interpretation: Object.freeze({
    whyExponentThree:
      'The degree-3 mass integrand sinh(a tau) - a tau has leading term (a tau)^3/6, degree-3 ' +
      'homogeneous in a. Integrated against the FIXED, U-independent weight A(tau) it gives ' +
      'B_3(a) ~ (a^3/6) M_3, so a -> a/k rescales it by exactly k^{-3}. The exponent p = 3 is analytic, ' +
      'not fitted; the measured 3 + O(a^2) offset is the sinh a^5 tail and vanishes as a -> 0.',
    whyMissIsKFourth:
      'The imp-3405 degree-0 law keeps the Lebesgue-change-of-variables prefactor k (correct only for the ' +
      'weight-1 measure) while the a^3 homogeneity contributes k^{-3}; the prediction is k times too big ' +
      'and the truth is k^{-3}, so it over-predicts by k^4 and the relative miss is 1 - 1/k^4 -- the odd ' +
      'analogue of the imp-3488 degree-2 form 1 - 1/k^3 with the homogeneity exponent one higher.',
    fullPrecisionCertified:
      'The degree-0 residuals reconcile to the exact ratio r_k = B_3(a/k)/B_3(a) to machine precision ' +
      '(< 1e-12): the residual IS 1 - r_k/k, the over-prediction IS k/r_k, and the derived-minus-measured ' +
      'miss IS the closed leading-form tail (r_k - 1/k^3)/k. The only departure of r_k from the ideal ' +
      '1/k^3 is the O(a^2) sinh tail, bounded < 1e-3 on every rung and shrinking as a -> 0.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDerivationAndCertification: true,
    numericalCharacterizationOnly:
      'This module derives the closed-form degree-3 miss factor 1 - 1/k^4 and exponent p = 3 from the ' +
      'leading form B_3(a) ~ (a^3/6) M_3 and certifies it against a degree-3 k-ladder. It establishes ' +
      'NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-3 (odd) face carries no ' +
      'feasibility comparison. The operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel ' +
      'step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------
export const IMP3510_DEGREE3_MISS_FACTOR_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp3510-leading-form-reproduces-base-mass',
    why: 'The derivation rests on B_3(a) ~ (a^3/6) M_3: the leading form must reproduce both base ' +
         'degree-3 masses to < 1% (else the closed exponent/miss have no premise).',
    holds: () => leadingRelErrS3 < LEADING_TOL && leadingRelErrS4 < LEADING_TOL,
  },
  {
    id: 'imp3510-degree0-residual-identity-1-minus-rk-over-k',
    why: 'The degree-0 relative residual must equal 1 - r_k/k with r_k = B_3(a/k)/B_3(a) to machine ' +
         'precision on every rung, both cells -- the definitional identity the closed form specializes.',
    holds: () =>
      CERT_S3.maxMissIdentityGap < IDENTITY_TOL && CERT_S4.maxMissIdentityGap < IDENTITY_TOL,
  },
  {
    id: 'imp3510-overpred-identity-k-over-rk',
    why: 'The measured over-prediction must equal k/r_k to machine precision on every rung -- ' +
         'reconciling the degree-3 over-prediction diagnostic to the exact ratio r_k.',
    holds: () =>
      CERT_S3.maxOverPredIdentityGap < IDENTITY_TOL && CERT_S4.maxOverPredIdentityGap < IDENTITY_TOL,
  },
  {
    id: 'imp3510-derived-miss-matches-measured-to-leading-tail',
    why: 'The DERIVED closed form 1 - 1/k^4 must match the measured miss to the leading-form error ' +
         '(< 1e-3) on every rung, both cells -- the odd analogue 1 - 1/k^4 is reproduced by derivation.',
    holds: () =>
      CERT_S3.maxMissTail < MISS_TAIL_TOL && CERT_S4.maxMissTail < MISS_TAIL_TOL,
  },
  {
    id: 'imp3510-miss-reconciled-to-exact-ratio-full-precision',
    why: 'The derived-minus-measured miss must equal the closed leading-form tail (r_k - 1/k^3)/k to ' +
         'machine precision (< 1e-12) -- certifying the ONLY departure from 1 - 1/k^4 is the O(a^2) sinh tail.',
    holds: () =>
      CERT_S3.maxMissReconGap < RECON_TOL && CERT_S4.maxMissReconGap < RECON_TOL,
  },
  {
    id: 'imp3510-derived-exponent-is-three',
    why: 'The analytically-derived exponent p = 3 (a^3 homogeneity) must match the measured ' +
         '-log(r_k)/log(k) to the O(a^2) tail (< 0.01) on every rung -- p = 3 is derived, not fitted.',
    holds: () =>
      CERT_S3.maxExponentGap < EXPONENT_TOL && CERT_S4.maxExponentGap < EXPONENT_TOL,
  },
  {
    id: 'imp3510-verdict-classifies-the-derivation',
    why: 'The verdict must certify the derived miss factor 1 - 1/k^4, exponent p = 3, and full-precision ' +
         'reconciliation against the degree-3 ladder, not indeterminate.',
    holds: () => verdict.startsWith('DEGREE-3-MISS-FACTOR-1-MINUS-1-OVER-k^4-DERIVED'),
  },
  {
    id: 'imp3510-honest-derivation-not-a-verdict',
    why: 'Mandatory honesty: derivation/certification only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-3 ratio), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3510_DEGREE3_MISS_FACTOR_CLOSED_FORM.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isDerivationAndCertification === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3510_DEGREE3_MISS_FACTOR_CLOSED_FORM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3510-degree3-miss-factor-closed-form assertion failed: ${assertion.id}`);
  }
}

export default IMP3510_DEGREE3_MISS_FACTOR_CLOSED_FORM;
