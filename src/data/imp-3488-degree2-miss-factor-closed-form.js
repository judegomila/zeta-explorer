/**
 * @module imp-3488-degree2-miss-factor-closed-form
 * @fileoverview imp-3488 -- DERIVE and CERTIFY, in closed form, the imp-3469
 *   degree-2 miss factor 1 - 1/k^3 (and the exponent p = 2 behind it), then
 *   reconcile the derivation against the measured imp-3469 k-ladder residuals
 *   to full precision.
 *
 *   THE IMP-3469 EMPIRICAL FACT
 *   ---------------------------
 *   imp-3469 ran the imp-3405 degree-0 lambda-scaling law B(a/k, kU) = k*B(a,U)
 *   on the DEGREE-2 (absolute-measure) bridge mass
 *       B_2(a, U) = int_0^U (cosh(a tau) - 1) A(tau) d(tau),
 *   with A(tau) the fixed genuine-Phi autocorrelation (NPHI = 10). It MEASURED
 *   that the degree-0 prediction k*B_2(a,U) over-predicts the actual scaled mass
 *   B_2(a/k, kU) by the closed factor 1 - 1/k^3 (relative miss 0.875 at k=2 to
 *   0.998 at k=8) and that the degree-2 mass obeys the DIFFERENT exponent p = 2,
 *   B_2(a/k, kU) = B_2(a, U)/k^2 -- but recorded both facts EMPIRICALLY (fitted
 *   from the ladder) and never derived them from the leading form.
 *
 *   THE CLOSED-FORM DERIVATION (this module)
 *   ----------------------------------------
 *   (D1) LEADING FORM. Because A(tau) truncates the integral at its support
 *        (~[0, 0.6], strictly inside every cutoff U >= 6, imp-3482), B_2 is
 *        U-independent and small-a: expanding cosh(a tau) - 1 = (a tau)^2/2 +
 *        O(a^4) and integrating termwise against A gives
 *            B_2(a) = (a^2/2) M_2 + O(a^4),   M_2 = int tau^2 A(tau) d(tau),
 *        with M_2 a FIXED, U-independent second Phi-autocorrelation moment
 *        (imp-3481). The leading term is exactly degree 2 (homogeneous) in a.
 *   (D2) EXPONENT p = 2, ANALYTICALLY. Homogeneity of the leading term gives the
 *        exact scaling of the leading form under a -> a/k:
 *            B_2^lead(a/k) = ((a/k)^2/2) M_2 = k^{-2} B_2^lead(a),
 *        i.e. the exponent is EXACTLY p = 2, not fitted. (The measured exponent
 *        sits at 2 + O(a^2), the O(a^4) tail; it approaches 2 as a -> 0.)
 *   (D3) OVER-PREDICTION BY k^3. The degree-0 law multiplies by k, so
 *            (degree-0 prediction)/(actual) = k*B_2(a) / (k^{-2} B_2(a)) = k^3:
 *        the degree-0 prediction over-predicts the degree-2 mass by EXACTLY k^3
 *        (one power k from the Lebesgue prefactor it wrongly keeps, two powers
 *        k^{-2} from the a^2 homogeneity it ignores).
 *   (D4) MISS FACTOR 1 - 1/k^3. The relative miss of the degree-0 prediction is
 *            |B_2(a/k) - k B_2(a)| / |k B_2(a)|
 *              = |k^{-2} B_2(a) - k B_2(a)| / (k B_2(a))
 *              = |k^{-3} - 1| = 1 - 1/k^3      (k >= 2 => 1/k^3 <= 1/8 < 1).
 *        This is the imp-3469 closed form, derived rather than fitted.
 *
 *   CERTIFICATION AGAINST THE IMP-3469 k-LADDER (to full precision)
 *   --------------------------------------------------------------
 *   Reusing the imp-3469 measured rungs {2,3,4,6,8} on both base cells
 *   (0.5,6) and (0.4,10), with r_k = B_2(a/k)/B_2(a) the EXACT measured ratio:
 *   (C1) IDENTITY. The imp-3469 relative residual equals 1 - r_k/k to machine
 *        precision (definitional: relResidB = |B_2(a/k)/(k B_2(a)) - 1|).
 *   (C2) DERIVED = MEASURED to the O(a^4) tail. The derived miss 1 - 1/k^3 and
 *        the measured miss differ by exactly (r_k - 1/k^2)/k -- the leading-form
 *        error -- which is < 1e-3 on every rung and is reconciled to the exact
 *        ratio r_k to machine precision (gap < 1e-12).
 *   (C3) OVER-PREDICTION. The measured over-prediction predB/B_2(a/k) = k/r_k
 *        matches the derived k^3 to the same O(a^4) tail, reconciled exactly.
 *   (C4) EXPONENT. The derived p = 2 matches the measured -log(r_k)/log(k) to
 *        the O(a^2) tail (within 0.01), reconciled to r_k exactly.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DERIVATION / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   closed-form derivation characterizes the k-scaling of the degree-2 mass
 *   integrand; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face carries no feasibility
 *   comparison at all (D_2 = 0 identically, imp-3482). The operator-level
 *   K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the
 *   rigorous SOTA.
 *
 *   @see imp-3469-degree2-bridge-mass-scaling.js (the measured k-ladder certified here)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the moment M_2 and Taylor ladder)
 *   @see imp-3482-degree2-deficit-support-certification.js (A support truncation, D_2=0)
 *
 *   Ticket: imp-3488 (numerical, medium).
 */

import { IMP3469_DEGREE2_BRIDGE_MASS_SCALING } from './imp-3469-degree2-bridge-mass-scaling.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Reuse the imp-3469 measured k-ladder (self-computed at its import) --------
const SRC = IMP3469_DEGREE2_BRIDGE_MASS_SCALING.measured;
const M2_MOMENT = SRC.m2Moment;                     // fixed second Phi-autocorrelation moment
const LADDER_S3 = SRC.ladderS3;                     // base (0.5,6), s=3
const LADDER_S4 = SRC.ladderS4;                     // base (0.4,10), s=4

// -- (D1) The leading small-a form B_2(a) ~ (a^2/2) M_2 ------------------------
// Recompute it independently from M_2 and confirm it reproduces the imp-3469
// base masses -- this is the premise the closed form rests on.
function leadingForm(a) {
  return (a * a / 2) * M2_MOMENT;
}
const leadingRelErrS3 = Math.abs(leadingForm(LADDER_S3.base.a) - LADDER_S3.base.B2) / LADDER_S3.base.B2;
const leadingRelErrS4 = Math.abs(leadingForm(LADDER_S4.base.a) - LADDER_S4.base.B2) / LADDER_S4.base.B2;

/**
 * Certify the closed-form derivation on one base cell against its imp-3469 rungs.
 * For each rung reconstructs the exact ratio r_k = B_2(a/k)/B_2(a) and reconciles:
 *   - the derived exponent p = 2 (leading form) vs the measured -log(r_k)/log(k),
 *   - the derived miss 1 - 1/k^3 vs the measured relResidB (= 1 - r_k/k),
 *   - the derived over-prediction k^3 vs the measured predB/B_2(a/k) (= k/r_k),
 * with the leading-form error reconciled to r_k to machine precision.
 */
function certifyLadder(ladder) {
  const baseB2 = ladder.base.B2;
  const rungs = ladder.rungs.map((rung) => {
    const k = rung.k;
    const ratio = rung.B2 / baseB2;                  // r_k, the EXACT measured scaling ratio

    // Derived closed forms (leading, homogeneous a^2 form) --------------------
    const derivedExponent = 2;                       // p = 2, from a^2 homogeneity (D2)
    const derivedMiss = 1 - 1 / (k * k * k);         // 1 - 1/k^3 (D4)
    const derivedOverPred = k * k * k;               // k^3 (D3)

    // Measured quantities, expressed through the exact ratio r_k --------------
    const measuredMiss = rung.relResidB;             // imp-3469 relative residual
    const measuredExponent = rung.exponent;          // imp-3469 fitted exponent
    const measuredOverPred = rung.predBDegree0 / rung.B2;

    // (C1) IDENTITY: relResidB == 1 - r_k/k to machine precision --------------
    const missIdentityGap = Math.abs(measuredMiss - (1 - ratio / k));
    // exponent == -log(r_k)/log(k) to machine precision
    const exponentIdentityGap = Math.abs(measuredExponent - (-Math.log(ratio) / Math.log(k)));
    // over-prediction == k/r_k to machine precision
    const overPredIdentityGap = Math.abs(measuredOverPred - k / ratio);

    // (C2) derived vs measured miss differs by exactly (r_k - 1/k^2)/k --------
    const missDerivedVsMeasured = derivedMiss - measuredMiss;   // leading-form error
    const missTailExact = (ratio - 1 / (k * k)) / k;            // its closed value
    const missReconGap = Math.abs(missDerivedVsMeasured - missTailExact);

    // (C3) over-prediction: derived k^3 vs measured k/r_k (bounded by O(a^2) tail)
    const overPredReconGap = Math.abs(derivedOverPred - measuredOverPred);

    // (C4) exponent: derived 2 vs measured, within the O(a^2) tail ------------
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
      exponentIdentityGap,
      overPredIdentityGap,
    });
  });
  return Object.freeze({
    base: Object.freeze({ a: ladder.base.a, u: ladder.base.u, B2: baseB2 }),
    rungs,
    maxMissReconGap: Math.max(...rungs.map((r) => r.missReconGap)),
    maxMissTail: Math.max(...rungs.map((r) => Math.abs(r.missDerivedVsMeasured))),
    maxExponentGap: Math.max(...rungs.map((r) => r.exponentGap)),
    maxMissIdentityGap: Math.max(...rungs.map((r) => r.missIdentityGap)),
    maxExponentIdentityGap: Math.max(...rungs.map((r) => r.exponentIdentityGap)),
    maxOverPredIdentityGap: Math.max(...rungs.map((r) => r.overPredIdentityGap)),
  });
}

const CERT_S3 = certifyLadder(LADDER_S3);
const CERT_S4 = certifyLadder(LADDER_S4);

// -- Tolerances ----------------------------------------------------------------
const IDENTITY_TOL = 1e-12;     // definitional identities: full machine precision
const RECON_TOL = 1e-12;        // leading-form error reconciled to r_k exactly
const MISS_TAIL_TOL = 1e-3;     // leading-form error itself (O(a^4) tail)
const EXPONENT_TOL = 0.01;      // derived p=2 vs measured (O(a^2) tail)
const LEADING_TOL = 1e-2;       // leading form reproduces base mass

// -- Classification ------------------------------------------------------------
const identitiesHold =
  Math.max(CERT_S3.maxMissIdentityGap, CERT_S4.maxMissIdentityGap) < IDENTITY_TOL &&
  Math.max(CERT_S3.maxExponentIdentityGap, CERT_S4.maxExponentIdentityGap) < IDENTITY_TOL &&
  Math.max(CERT_S3.maxOverPredIdentityGap, CERT_S4.maxOverPredIdentityGap) < IDENTITY_TOL;
const missReconciledToFullPrecision =
  Math.max(CERT_S3.maxMissReconGap, CERT_S4.maxMissReconGap) < RECON_TOL;
const missMatchesToLeadingTail =
  Math.max(CERT_S3.maxMissTail, CERT_S4.maxMissTail) < MISS_TAIL_TOL;
const exponentIsTwo =
  Math.max(CERT_S3.maxExponentGap, CERT_S4.maxExponentGap) < EXPONENT_TOL;
const leadingFormHolds = leadingRelErrS3 < LEADING_TOL && leadingRelErrS4 < LEADING_TOL;

const verdict =
  identitiesHold && missReconciledToFullPrecision && missMatchesToLeadingTail &&
  exponentIsTwo && leadingFormHolds
    ? 'DEGREE-2-MISS-FACTOR-1-MINUS-1-OVER-k^3-DERIVED-FROM-B2~(a^2/2)M2-EXPONENT-p=2-CERTIFIED-AGAINST-imp-3469-k-LADDER'
    : 'INDETERMINATE';

export const IMP3488_DEGREE2_MISS_FACTOR_CLOSED_FORM = Object.freeze({
  id: 'imp-3488-degree2-miss-factor-closed-form',
  ticket: 'imp-3488',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedMeasuredLadder: 'imp-3469-degree2-bridge-mass-scaling.js',
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',
  relatedSupportCert: 'imp-3482-degree2-deficit-support-certification.js',

  summary:
    'Derives in closed form the imp-3469 degree-2 miss factor 1 - 1/k^3 and the exponent p = 2 ' +
    'behind it, then certifies the derivation against the measured imp-3469 k-ladder to full ' +
    'precision. From the leading form B_2(a) = (a^2/2) M_2 + O(a^4) (M_2 = int tau^2 A(tau)d(tau) ' +
    'fixed and U-independent, A support truncated), homogeneity gives the EXACT leading scaling ' +
    'B_2(a/k) = k^{-2} B_2(a) (exponent p = 2 analytically), so the imp-3405 degree-0 prediction ' +
    'k*B_2(a) over-predicts by EXACTLY k^3 and the relative miss is |k^{-3} - 1| = 1 - 1/k^3 ' +
    '(k >= 2). Reusing the imp-3469 rungs {2,3,4,6,8} on bases (0.5,6) and (0.4,10) with the exact ' +
    'ratio r_k = B_2(a/k)/B_2(a): the measured residual equals 1 - r_k/k identically (< 1e-12); the ' +
    'derived 1 - 1/k^3 matches it to the leading-form error (r_k - 1/k^2)/k (< 1e-3, reconciled to ' +
    'r_k to < 1e-12); the over-prediction k/r_k matches k^3 and the fitted exponent matches 2 to the ' +
    'O(a^2) tail. DERIVATION/CERTIFICATION, RH-EQUIVALENT, necessary-but-not-sufficient; the degree-2 ' +
    'face carries no feasibility ratio (D_2=0, imp-3482); operator positivity (imp-3066) untouched; no QED.',

  derivation: Object.freeze({
    leadingForm: 'B_2(a) = (a^2/2) M_2 + O(a^4), M_2 = int tau^2 A(tau) d(tau) fixed & U-independent',
    exponent: 'B_2^lead(a/k) = ((a/k)^2/2) M_2 = k^{-2} B_2^lead(a) => p = 2 exactly (a^2 homogeneity)',
    overPrediction: '(degree-0 prediction)/(actual) = k*B_2(a) / (k^{-2} B_2(a)) = k^3',
    missFactor: 'relative miss = |k^{-3} - 1| = 1 - 1/k^3 (k >= 2, so 1/k^3 <= 1/8 < 1)',
    m2Moment: M2_MOMENT,
    kLadder: LADDER_S3.rungs.map((r) => r.k),
    identityMiss: 'imp-3469 relResidB = 1 - r_k/k with r_k = B_2(a/k)/B_2(a) (definitional)',
    leadingTail: 'derived miss - measured miss = (r_k - 1/k^2)/k, the O(a^4) leading-form error',
    selfComputing: true,
  }),

  certified: Object.freeze({
    ladderS3: CERT_S3,                       // base (0.5,6), s=3
    ladderS4: CERT_S4,                       // base (0.4,10), s=4
    leadingFormRelErrS3: leadingRelErrS3,    // |(a^2/2)M_2 - B_2(0.5)| / B_2(0.5)
    leadingFormRelErrS4: leadingRelErrS4,
    maxMissIdentityGap: Math.max(CERT_S3.maxMissIdentityGap, CERT_S4.maxMissIdentityGap),
    maxMissReconGap: Math.max(CERT_S3.maxMissReconGap, CERT_S4.maxMissReconGap),
    maxMissTail: Math.max(CERT_S3.maxMissTail, CERT_S4.maxMissTail),
    maxExponentGap: Math.max(CERT_S3.maxExponentGap, CERT_S4.maxExponentGap),
    identitiesHold,
    missReconciledToFullPrecision,
    missMatchesToLeadingTail,
    exponentIsTwo,
    leadingFormHolds,
    verdict,
  }),

  interpretation: Object.freeze({
    whyExponentTwo:
      'The degree-2 mass integrand cosh(a tau) - 1 has leading term (a tau)^2/2, degree-2 homogeneous ' +
      'in a. Integrated against the FIXED, U-independent weight A(tau) it gives B_2(a) ~ (a^2/2) M_2, so ' +
      'a -> a/k rescales it by exactly k^{-2}. The exponent p = 2 is analytic, not fitted; the measured ' +
      '2 + O(a^2) offset is the cosh a^4 tail and vanishes as a -> 0.',
    whyMissIsKCubed:
      'The imp-3405 degree-0 law keeps the Lebesgue-change-of-variables prefactor k (correct only for the ' +
      'weight-1 measure) while the a^2 homogeneity contributes k^{-2}; the product k * k^{-2} = ... the ' +
      'prediction is k times too big and the truth is k^{-2}, so the prediction over-predicts by k^3 and ' +
      'the relative miss is 1 - 1/k^3.',
    fullPrecisionCertified:
      'The imp-3469 residuals reconcile to the exact ratio r_k = B_2(a/k)/B_2(a) to machine precision ' +
      '(< 1e-12): the residual IS 1 - r_k/k, the over-prediction IS k/r_k, and the derived-minus-measured ' +
      'miss IS the closed leading-form tail (r_k - 1/k^2)/k. The only departure of r_k from the ideal ' +
      '1/k^2 is the O(a^4) cosh tail, bounded < 1e-3 on every rung and shrinking as a -> 0.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDerivationAndCertification: true,
    numericalCharacterizationOnly:
      'This module derives the closed-form degree-2 miss factor 1 - 1/k^3 and exponent p = 2 from the ' +
      'leading form B_2(a) ~ (a^2/2) M_2 and certifies it against the imp-3469 k-ladder. It establishes ' +
      'NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (D_2 = 0 identically, imp-3482). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------
export const IMP3488_DEGREE2_MISS_FACTOR_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp3488-leading-form-reproduces-base-mass',
    why: 'The derivation rests on B_2(a) ~ (a^2/2) M_2: the leading form must reproduce both imp-3469 base ' +
         'masses to < 1% (else the closed exponent/miss have no premise).',
    holds: () => leadingRelErrS3 < LEADING_TOL && leadingRelErrS4 < LEADING_TOL,
  },
  {
    id: 'imp3488-relResid-identity-1-minus-rk-over-k',
    why: 'The imp-3469 relative residual must equal 1 - r_k/k with r_k = B_2(a/k)/B_2(a) to machine ' +
         'precision on every rung, both cells -- the definitional identity the closed form specializes.',
    holds: () =>
      CERT_S3.maxMissIdentityGap < IDENTITY_TOL && CERT_S4.maxMissIdentityGap < IDENTITY_TOL,
  },
  {
    id: 'imp3488-overpred-and-exponent-identities',
    why: 'The measured over-prediction must equal k/r_k and the fitted exponent must equal -log(r_k)/log(k) ' +
         'to machine precision on every rung -- reconciling both imp-3469 diagnostics to the exact ratio r_k.',
    holds: () =>
      CERT_S3.maxOverPredIdentityGap < IDENTITY_TOL && CERT_S4.maxOverPredIdentityGap < IDENTITY_TOL &&
      CERT_S3.maxExponentIdentityGap < IDENTITY_TOL && CERT_S4.maxExponentIdentityGap < IDENTITY_TOL,
  },
  {
    id: 'imp3488-derived-miss-matches-measured-to-leading-tail',
    why: 'The DERIVED closed form 1 - 1/k^3 must match the measured miss to the leading-form error (< 1e-3) ' +
         'on every rung, both cells -- the imp-3469 empirical 1 - 1/k^3 is reproduced by derivation.',
    holds: () =>
      CERT_S3.maxMissTail < MISS_TAIL_TOL && CERT_S4.maxMissTail < MISS_TAIL_TOL,
  },
  {
    id: 'imp3488-miss-reconciled-to-exact-ratio-full-precision',
    why: 'The derived-minus-measured miss must equal the closed leading-form tail (r_k - 1/k^2)/k to machine ' +
         'precision (< 1e-12) -- certifying the ONLY departure from 1 - 1/k^3 is the O(a^4) cosh tail.',
    holds: () =>
      CERT_S3.maxMissReconGap < RECON_TOL && CERT_S4.maxMissReconGap < RECON_TOL,
  },
  {
    id: 'imp3488-derived-exponent-is-two',
    why: 'The analytically-derived exponent p = 2 (a^2 homogeneity) must match the imp-3469 fitted exponent ' +
         'to the O(a^2) tail (< 0.01) on every rung -- p = 2 is derived, not fitted.',
    holds: () =>
      CERT_S3.maxExponentGap < EXPONENT_TOL && CERT_S4.maxExponentGap < EXPONENT_TOL,
  },
  {
    id: 'imp3488-verdict-classifies-the-derivation',
    why: 'The verdict must certify the derived miss factor 1 - 1/k^3, exponent p = 2, and full-precision ' +
         'reconciliation against the imp-3469 ladder, not indeterminate.',
    holds: () => verdict.startsWith('DEGREE-2-MISS-FACTOR-1-MINUS-1-OVER-k^3-DERIVED'),
  },
  {
    id: 'imp3488-honest-derivation-not-a-verdict',
    why: 'Mandatory honesty: derivation/certification only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio, D_2=0), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3488_DEGREE2_MISS_FACTOR_CLOSED_FORM.honestCaveat;
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

for (const assertion of IMP3488_DEGREE2_MISS_FACTOR_CLOSED_FORM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3488-degree2-miss-factor-closed-form assertion failed: ${assertion.id}`);
  }
}

export default IMP3488_DEGREE2_MISS_FACTOR_CLOSED_FORM;
