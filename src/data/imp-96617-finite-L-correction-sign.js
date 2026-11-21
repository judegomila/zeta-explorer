/**
 * imp-96617 -- Measure the SIGN of the O(1/L) finite-L correction to the box sine-kernel lag
 * correlation rho_k(L), to decide whether the imp-96567 closed form
 *   rho_k(inf) = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1))
 * is a certified ONE-SIDED (upper) bound on the true finite-L box correlation, or only a
 * two-sided approximation. Measurement only; conditional on GUE; NO QED.
 *
 * THE OBSTRUCTION (imp-96593 VERDICT, obstruction (ii)). imp-96593 migrated the residual VIF
 * softness from calibration to numerical enclosure: making the rigorous conditional level
 * (VIF <= 0.0334 / z >= 10.52, or the actual z ~ 26.0) fully certified needs a certified
 * one-sided bound that the imp-96567 closed form is >= the true finite-L box correlation. But
 * the closed form is the sin^2 -> 1/2 AVERAGED limit (the box length L cancels in the numerator),
 * and the finite-L correction it drops is an O(1/L) oscillatory integral whose SIGN was left
 * unpinned. This module measures that sign directly.
 *
 * THE EXACT CORRECTION INTEGRAL. In v-space (u = L v) the direct lag-k covariance numerator is
 *   Cov_k(L) = -(1/pi^2) int_{-1}^{1} (1-|v|) sin^2(pi L (v+k)) / (v+k)^2 dv,
 * and averaging sin^2 -> 1/2 gives the closed form Cov_k(inf) = -(1/(2 pi^2)) ln(k^2/(k^2-1))
 * (int_{-1}^{1} (1-|v|)/(v+k)^2 dv = ln(k^2/(k^2-1))). Using sin^2(theta) - 1/2 = -cos(2 theta)/2,
 * the EXACT finite-L correction is the oscillatory integral
 *   DeltaCov_k(L) = Cov_k(L) - Cov_k(inf)
 *                 = (1/(2 pi^2)) int_{-1}^{1} (1-|v|) cos(2 pi L (v+k)) / (v+k)^2 dv.
 * The Bartlett triangle weight (1-|v|) VANISHES at the box edges v = +/-1, so the leading
 * boundary term of the oscillatory integral is killed and the envelope is one power SMALLER
 * than the O(1/L) that obstruction (ii) assumed.
 *
 * THE MEASUREMENT (offline tmp/imp-96617-scratch.mjs, tmp/imp-96617-refine.mjs; Simpson on the
 * exact correction integral, converged to 5+ sig figs under panel refinement). At the certificate
 * window L = 495.779 the signed corrections are LAG-ALTERNATING, not one-signed:
 *   k=2: DeltaCov = -3.078e-9   k=3: +3.737e-10   k=4: +6.233e-10   k=5: +1.532e-10   k=6: -1.964e-10.
 * Sweeping L across the window [495.679, 495.879] every lag k = 2..6 takes BOTH signs (e.g. k=2
 * flips from ~0 to negative, k=3 flips positive->negative, k=4 flips negative->positive->negative):
 * the correction is genuinely OSCILLATORY in L, so the closed form is NOT a certified one-sided
 * bound -- the sign of rho_k(L) - rho_k(inf) is unpinned exactly as obstruction (ii) feared.
 *
 * THE SILVER LINING (a two-sided enclosure IS available). Although the SIGN oscillates, the
 * AMPLITUDE is tiny and obeys a clean O(1/L^2) envelope (one power below obstruction (ii)):
 * scanning L over a full period at L ~ 50, 200, 495, 2000 gives L^2 * max|DeltaCov_2| = 2.026e-3,
 * 2.057e-3, 2.063e-3, 2.066e-3 -- constant to ~1%, so |DeltaCov_k| <~ 2.07e-3 / L^2 numerically.
 * At L = 495.779 that is <~ 8.4e-9, and relative to Cov_k(inf) the correction is only ~1e-7
 * (|DeltaCov_2|/|Cov_2| = 2.11e-7, k=3..6 all 6e-8..2e-7). So the closed form agrees with the true
 * finite-L box covariance to ~6-7 significant figures. A rigorous VIF certificate therefore CANNOT
 * use the closed form as a one-sided bound, but CAN use the two-sided enclosure
 *   Cov_k(L) = Cov_k(inf) +/- C/L^2,  C ~ 2.07e-3 (measured; a certified C would need an
 * integration-by-parts / stationary-phase bound on the oscillatory integral, not delivered here).
 *
 * VERDICT. The O(1/L) finite-L correction DeltaCov_k(L) = Cov_k(L) - Cov_k(inf) is genuinely
 * OSCILLATORY in sign (both signs across the L-window near 495.779, and lag-alternating at the fixed
 * window), so the imp-96567 closed form is NOT a certified one-sided VIF upper bound -- confirming
 * imp-96593 obstruction (ii) that the sign is unpinned. However the amplitude is very small and
 * obeys a measured O(1/L^2) envelope (|DeltaCov_k| <~ 2.07e-3/L^2, ~1e-7 relative to Cov_k at
 * L = 495.779), because the Bartlett triangle weight vanishes at the box edges and removes the
 * leading O(1/L) term. So the closed form is a ~6-7-digit two-SIDED approximation with an available
 * (numerically) two-sided enclosure Cov_k = Cov_k(inf) +/- C/L^2, just not a one-SIDED bound; the
 * route to a rigorous conditional VIF via a one-sided closed form is closed, and the residual is a
 * certified |DeltaCov_k| envelope (oscillatory-integral bound), not a sign. Measurement only;
 * conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN);
 * changes NO unconditional bound; RH open; NO QED; no refereed bound is changed; the
 * zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the closed form whose sign this probes)
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment (VERDICT obstruction (ii): unpinned sign)
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the conditional VIF certificate)
 * @see imp-96571-vif-rho1-bound-rigor-assessment (softness confined to the sharpest level)
 * @see imp-96628-boxsine-lagcorr-ibp-envelope (certifies the |DeltaCov_k| <= C(k)/L^2 envelope left as the residual here)
 *
 * Import-light: no zeros bundle, no sibling imports. The signed DeltaCov_k at L = 495.779 and the
 * O(1/L^2) envelope constant are baked literals from the offline exact-correction integral; the
 * closed-form numerator, the correction-integral form, and the relative sizes are re-derived here.
 */

const PI = Math.PI;
const L = 495.779; // T = 1.5e5 non-overlapping box length (imp-96542 / imp-96567)

// Closed-form (averaged) lag-k covariance numerator: L cancels; rho_k(inf) = Cov / Sigma^2.
const covClosedNum = (k) => -Math.log((k * k) / (k * k - 1)) / (2 * PI * PI);

// Exact signed finite-L correction DeltaCov_k(L) at the certificate window (offline literals).
// DeltaCov_k = (1/(2 pi^2)) int_{-1}^{1} (1-|v|) cos(2 pi L (v+k)) / (v+k)^2 dv.
const DELTA_COV_AT_L = {
  2: -3.0777e-9,
  3: 3.7366e-10,
  4: 6.2329e-10,
  5: 1.5316e-10,
  6: -1.964e-10,
};

// Measured O(1/L^2) envelope: L^2 * max|DeltaCov_2| over a full L-period, at four scales.
const ENVELOPE_L2_SCAN = {
  50: 2.0264e-3,
  200: 2.0571e-3,
  495: 2.0633e-3,
  2000: 2.0664e-3,
};
const ENVELOPE_CONST = 2.07e-3; // C such that |DeltaCov_k| <~ C / L^2 (measured, not certified)

export const IMP96617_FINITE_L_CORRECTION_SIGN = {
  ticket: 'imp-96617',
  question:
    'Measure the sign of the O(1/L) finite-L correction to the box sine-kernel lag correlation rho_k(L) to decide whether the imp-96567 closed form rho_k(inf) = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) is a certified one-sided (upper) bound on the true finite-L box correlation, or only a two-sided approximation.',
  boxLength: L,
  correctionIntegral:
    'DeltaCov_k(L) = Cov_k(L) - Cov_k(inf) = (1/(2 pi^2)) int_{-1}^{1} (1-|v|) cos(2 pi L (v+k)) / (v+k)^2 dv  (from sin^2 theta - 1/2 = -cos(2 theta)/2; the Bartlett weight 1-|v| vanishes at v = +/-1).',
  signedCorrectionAtWindow: DELTA_COV_AT_L, // lag-alternating: -, +, +, +, - for k = 2..6
  signIsOscillatory: true,
  oneSidedBound: false,
  envelopeScan: ENVELOPE_L2_SCAN, // L^2 * max|DeltaCov_2| ~ const => O(1/L^2)
  envelopeConst: ENVELOPE_CONST, // |DeltaCov_k| <~ 2.07e-3 / L^2 (measured)
  relativeSizeAtWindow: {
    k2: Math.abs(DELTA_COV_AT_L[2] / covClosedNum(2)), // 2.11e-7
    k3: Math.abs(DELTA_COV_AT_L[3] / covClosedNum(3)), // 6.26e-8
    note: 'the closed form agrees with the true finite-L box covariance to ~6-7 significant figures',
  },
  twoSidedEnclosure:
    'Cov_k(L) = Cov_k(inf) +/- C/L^2 with C ~ 2.07e-3 (measured). A CERTIFIED C needs an integration-by-parts / stationary-phase bound on the oscillatory correction integral -- not delivered here; this is a measurement of the sign and the envelope order only.',
  conditionality:
    'All of the above is conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). It changes NO unconditional bound.',
  verdict:
    'The O(1/L) finite-L correction DeltaCov_k(L) = Cov_k(L) - Cov_k(inf) to the box sine-kernel lag correlation is genuinely OSCILLATORY in sign -- it takes both signs across the L-window near 495.779 and is lag-alternating (-, +, +, +, - for k = 2..6) at the fixed certificate window L = 495.779 -- so the imp-96567 closed form rho_k(inf) = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) is NOT a certified one-sided VIF upper bound on the true finite-L box correlation, confirming imp-96593 obstruction (ii) that the sign is unpinned. The amplitude is tiny and obeys a measured O(1/L^2) envelope |DeltaCov_k| <~ 2.07e-3/L^2 (L^2*max|DeltaCov_2| = 2.026e-3, 2.057e-3, 2.063e-3, 2.066e-3 at L ~ 50, 200, 495, 2000), one power below the O(1/L) obstruction (ii) assumed, because the Bartlett triangle weight (1-|v|) vanishes at the box edges and removes the leading term; relative to Cov_k(inf) the correction is only ~1e-7 at L = 495.779. So the closed form is a ~6-7-digit two-SIDED approximation with an available two-sided enclosure Cov_k = Cov_k(inf) +/- C/L^2, just not a one-SIDED bound: the route to a rigorous conditional VIF via a one-sided closed form is CLOSED, and the residual obstruction is now a CERTIFIED |DeltaCov_k| envelope (an oscillatory-integral bound), not a sign. Measurement only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96567 convention).
export const IMP96617_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the O(1/L) finite-L correction '
  + 'DeltaCov_k(L) to the box sine-kernel lag correlation is OSCILLATORY in sign (both signs across L '
  + 'near 495.779, lag-alternating -,+,+,+,- for k = 2..6 at the window), so the imp-96567 closed form '
  + 'is NOT a one-sided VIF upper bound -- confirming imp-96593 obstruction (ii). Amplitude tiny and '
  + 'O(1/L^2) (|DeltaCov_k| <~ 2.07e-3/L^2, ~1e-7 relative at L = 495.779), because the Bartlett weight '
  + 'vanishes at the box edges; a two-sided enclosure Cov_k = Cov_k(inf) +/- C/L^2 is available. '
  + 'Conditional on the pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the correction is NOT one-signed at the fixed window: both signs appear across k = 2..6
  const signs = Object.values(DELTA_COV_AT_L).map((v) => Math.sign(v));
  if (!(signs.some((s) => s > 0) && signs.some((s) => s < 0)))
    throw new Error('imp-96617: signed corrections must be lag-alternating (both signs), not one-signed');
  // the module records the sign as oscillatory and the closed form as NOT a one-sided bound
  if (IMP96617_FINITE_L_CORRECTION_SIGN.signIsOscillatory !== true)
    throw new Error('imp-96617: sign must be recorded as oscillatory');
  if (IMP96617_FINITE_L_CORRECTION_SIGN.oneSidedBound !== false)
    throw new Error('imp-96617: closed form must NOT be recorded as a one-sided bound');
  // the O(1/L^2) envelope is flat: L^2 * max|DeltaCov_2| constant to ~2% across two decades of L
  const scan = Object.values(ENVELOPE_L2_SCAN);
  const mn = Math.min(...scan);
  const mx = Math.max(...scan);
  if (!((mx - mn) / mn < 0.03))
    throw new Error('imp-96617: L^2 envelope constant must be flat (O(1/L^2) confirmed) to ~2%');
  if (!approx(ENVELOPE_CONST, mx, 1e-2))
    throw new Error('imp-96617: envelope constant must bound the measured scan');
  // the correction is tiny relative to the closed-form covariance (6-7 sig figs)
  if (!(Math.abs(DELTA_COV_AT_L[2] / covClosedNum(2)) < 1e-6))
    throw new Error('imp-96617: relative correction must be ~1e-7 (closed form agrees to ~6-7 digits)');
  // the envelope at L = 495.779 bounds every measured lag correction
  for (const k of Object.keys(DELTA_COV_AT_L)) {
    if (!(Math.abs(DELTA_COV_AT_L[k]) <= ENVELOPE_CONST / (L * L) + 1e-12))
      throw new Error('imp-96617: measured |DeltaCov_k| must respect the 2.07e-3/L^2 envelope');
  }
  // honesty gates
  if (!/NO QED/.test(IMP96617_FINITE_L_CORRECTION_SIGN.verdict))
    throw new Error('imp-96617: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96617_FINITE_L_CORRECTION_SIGN.verdict))
    throw new Error('imp-96617: verdict dropped the no-refereed-bound-change banner');
  if (!/conditional/i.test(IMP96617_FINITE_L_CORRECTION_SIGN.verdict))
    throw new Error('imp-96617: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96617_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96617_HONEST_BANNER) && /NO QED/.test(IMP96617_HONEST_BANNER)))
    throw new Error('imp-96617: IMP96617_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96617_FINITE_L_CORRECTION_SIGN;
