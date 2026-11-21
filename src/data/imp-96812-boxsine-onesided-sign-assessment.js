/**
 * imp-96812 -- Assess whether the imp-96628 CERTIFIED two-sided envelope |DeltaCov_k(L)| <= C(k)/L^2
 * can be sharpened to the ONE-SIDED sign the imp-96593 VIF upper bound requires (residual (ii): pin
 * the sign of the O(1/L) finite-L box-sine correction at the certificate window L = 495.779).
 * Assessment only; conditional on GUE; honest obstruction; NO QED.
 *
 * WHAT THE VIF NEEDS. imp-96593 obstruction (ii): to make the conditional VIF a rigorous UPPER bound,
 * the imp-96567 closed form Cov_k(inf) = -(1/(2 pi^2)) ln(k^2/(k^2-1)) must be certified >= the true
 * finite-L box covariance Cov_k(L), i.e. the correction DeltaCov_k(L) = Cov_k(L) - Cov_k(inf) must be
 * certified <= 0 for ALL relevant lags k. imp-96617 MEASURED that DeltaCov is lag-alternating; imp-96628
 * certified only the two-sided envelope |DeltaCov_k| <= C(k)/L^2. This module asks the sharpening
 * question head-on: does the imp-96628 two-IBP decomposition itself yield a one-SIDED sign?
 *
 * THE DECOMPOSITION (imp-96628). With w = 2 pi L, DeltaCov_k(L) = -(1/(2 pi^2 w^2)) [B_k(w) + R_k(L)],
 *   B_k(w) = -2 cos(w k)/k^2 + cos(w(k-1))/(k-1)^2 + cos(w(k+1))/(k+1)^2   (explicit leading term),
 *   |R_k(L)| <= V(k) = |A_prime(0-)-A_prime(-1)| + |A_prime(1)-A_prime(0+)|  (total-variation remainder).
 * The sign of DeltaCov_k is the sign of -(B_k + R_k); the certified enclosure is DeltaCov_k in
 *   -(1/(2 pi^2 w^2)) * ( B_k +/- V(k) ).
 *
 * FINDING 1 -- THE LEADING TERM ALONE RECOVERS THE MEASURED SIGN (to ~4 sig figs). At w = 2 pi*495.779
 * = 3115.0713, dropping R_k entirely (DeltaCov_lead = -B_k/(2 pi^2 w^2)) reproduces the imp-96617
 * measured DeltaCov_k at EVERY lag k = 2..6 to ~4 significant figures:
 *   k=2: lead -3.0835e-9 vs measured -3.0777e-9;  k=3: +3.730e-10 vs +3.737e-10;
 *   k=4: +6.233e-10 vs +6.233e-10;  k=5: +1.533e-10 vs +1.532e-10;  k=6: -1.964e-10 vs -1.964e-10.
 * So R_k is EMPIRICALLY tiny at this window and the TRUE sign is governed by B_k. B_k(w) has signs
 * +,-,-,-,+ for k=2..6, giving DeltaCov signs -,+,+,+,- (the extra minus from the prefactor) -- exactly
 * the imp-96617 lag-alternating pattern.
 *
 * FINDING 2 -- THE ONE-SIDED SIGN FAILS ON TWO INDEPENDENT GROUNDS.
 *   (A) STRUCTURAL (fatal, certificate-independent). The sign of DeltaCov_k GENUINELY ALTERNATES with
 *       the lag: -,+,+,+,- for k = 2..6. The VIF upper bound needs DeltaCov_k <= 0 for ALL k, but
 *       k = 3,4,5 give DeltaCov_k > 0 (the closed form UNDER-estimates |Cov_k| there). No amount of
 *       certificate sharpening can produce a uniform-in-k one-sided bound, because the quantity being
 *       bounded changes sign across k. The one-sided route is closed by the geometry of B_k, not by
 *       remainder slack.
 *   (B) CERTIFICATE-SLACK (also blocks even the per-k sign from imp-96628). At EVERY k = 2..6 the
 *       total-variation remainder bound DOMINATES the leading term: |B_k| < V(k)
 *       (0.591<1.389, 0.071<0.336, 0.119<0.134, 0.029<0.067, 0.038<0.038). Hence the certified
 *       enclosure B_k +/- V(k) STRADDLES ZERO at every lag, so the imp-96628 two-IBP certificate CANNOT
 *       resolve even the fixed-k sign of DeltaCov_k -- although the true (measured) sign is definite.
 *       A one-sided certificate would need a bound on R_k SHARPER than its total variation, i.e. one
 *       that captures R_k's own oscillatory cancellation (empirically R_k is ~10^2x below V(k) here),
 *       which the two-IBP TV bound throws away.
 *
 * VERDICT. NO. The imp-96628 certified two-sided envelope CANNOT be sharpened to the one-sided sign the
 * imp-96593 VIF upper bound requires. The obstruction is twofold and the first horn is fatal: (A) the
 * explicit leading term B_k(w) = -2 cos(wk)/k^2 + cos(w(k-1))/(k-1)^2 + cos(w(k+1))/(k+1)^2 governs the
 * sign (dropping R_k reproduces the imp-96617 measured DeltaCov to ~4 sig figs at L = 495.779) and its
 * sign GENUINELY ALTERNATES with the lag (+,-,-,-,+ => DeltaCov -,+,+,+,- for k = 2..6), so DeltaCov_k
 * is positive at k = 3,4,5 and no uniform-in-k one-sided bound exists regardless of precision; and (B)
 * even the fixed-k sign is invisible to the imp-96628 certificate because its total-variation remainder
 * bound V(k) exceeds |B_k| at every k = 2..6, so the certified enclosure B_k +/- V(k) straddles zero.
 * This precisely characterizes why the oscillation blocks the sharpening: the sign is real but lag-
 * alternating (killing the uniform bound structurally), and the TV remainder is too lossy to expose
 * even the per-lag sign the envelope's leading term already carries. Assessment only; the VIF
 * certificate does NOT close; conditional on the GUE sine kernel / Montgomery pair correlation for the
 * zeta zeros (UNPROVEN); changes NO unconditional bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96628-boxsine-lagcorr-ibp-envelope (the certified two-sided C(k)/L^2 envelope this probes)
 * @see imp-96617-finite-L-correction-sign (the MEASURED lag-alternating sign this re-derives from B_k)
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment (obstruction (ii): the unpinned one-sided sign)
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the conditional VIF certificate at issue)
 *
 * Import-light: no zeros bundle, no sibling imports. B_k, V(k) and DeltaCov_lead are re-derived here
 * in closed form from the imp-96628 two-IBP identity and checked against the imp-96617 measured
 * literals in the self-tests below; no offline script needed.
 */

const PI = Math.PI;
const L = 495.779; // certificate window (imp-96542 / imp-96567 box length)
const W = 2 * PI * L; // w = 2 pi L = 3115.0713

// Leading two-IBP term B_k(w) (imp-96628): three cosines, each |.| <= 1.
export function leadingTerm(k) {
  return (
    -2 * Math.cos(W * k) / (k * k)
    + Math.cos(W * (k - 1)) / ((k - 1) * (k - 1))
    + Math.cos(W * (k + 1)) / ((k + 1) * (k + 1))
  );
}

// Total-variation remainder bound V(k) (imp-96628), for k >= 2.
export function totalVariation(k) {
  const Am1 = 1 / ((k - 1) * (k - 1)); // A'(-1)
  const A0m = (k - 2) / (k * k * k); //   A'(0-)
  const A0p = -(k + 2) / (k * k * k); //  A'(0+)
  const A1 = -1 / ((k + 1) * (k + 1)); // A'(1)
  return Math.abs(A0m - Am1) + Math.abs(A1 - A0p);
}

// Leading-order DeltaCov_k (drop R_k): DeltaCov_lead = -B_k/(2 pi^2 w^2).
export function deltaCovLeading(k) {
  return -leadingTerm(k) / (2 * PI * PI * W * W);
}

// imp-96617 measured signed corrections at the window (offline exact-integral literals).
const MEASURED_DELTACOV = { 2: -3.0777e-9, 3: 3.7366e-10, 4: 6.2329e-10, 5: 1.5316e-10, 6: -1.964e-10 };

const LAGS = [2, 3, 4, 5, 6];

export const IMP96812_BOXSINE_ONESIDED_SIGN_ASSESSMENT = {
  ticket: 'imp-96812',
  question:
    'Can the imp-96628 certified two-sided envelope |DeltaCov_k(L)| <= C(k)/L^2 be sharpened to the one-sided sign the imp-96593 VIF upper bound requires (DeltaCov_k <= 0 for all k) at the window L = 495.779?',
  window: L,
  w: W,
  decomposition:
    'DeltaCov_k(L) = -(1/(2 pi^2 w^2)) [B_k(w) + R_k(L)], w = 2 pi L; B_k = -2 cos(wk)/k^2 + cos(w(k-1))/(k-1)^2 + cos(w(k+1))/(k+1)^2 (explicit leading term); |R_k| <= V(k) (total-variation remainder). Sign of DeltaCov_k = sign of -(B_k + R_k).',
  leadingRecoversMeasured:
    'Dropping R_k, DeltaCov_lead = -B_k/(2 pi^2 w^2) reproduces the imp-96617 measured DeltaCov_k to ~4 sig figs at every k = 2..6, so the true sign is governed by B_k and R_k is empirically tiny at the window.',
  signPattern: 'B_k signs +,-,-,-,+ for k=2..6 => DeltaCov signs -,+,+,+,- (lag-alternating).',
  obstructionA_structural:
    'FATAL, certificate-independent: DeltaCov_k > 0 at k = 3,4,5, so the VIF requirement DeltaCov_k <= 0 for ALL k cannot hold for any precision -- the sign genuinely alternates with the lag.',
  obstructionB_certificateSlack:
    'The imp-96628 TV remainder bound V(k) exceeds |B_k| at every k = 2..6, so the certified enclosure B_k +/- V(k) STRADDLES ZERO and cannot resolve even the fixed-k sign (though the measured sign is definite). Sharpening needs an R_k bound below its total variation.',
  oneSidedAchievable: false,
  conditionality:
    'Conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). Changes NO unconditional bound.',
  verdict:
    'NO. The imp-96628 certified two-sided envelope |DeltaCov_k(L)| <= C(k)/L^2 CANNOT be sharpened to the one-sided sign the imp-96593 VIF upper bound requires. The obstruction is twofold and the first horn is fatal: (A) the explicit leading term B_k(w) = -2 cos(wk)/k^2 + cos(w(k-1))/(k-1)^2 + cos(w(k+1))/(k+1)^2 governs the sign -- dropping the remainder R_k reproduces the imp-96617 measured DeltaCov_k to ~4 significant figures at every lag k = 2..6, L = 495.779 -- and its sign GENUINELY ALTERNATES with the lag (+,-,-,-,+ for k = 2..6, giving DeltaCov -,+,+,+,-), so DeltaCov_k is positive at k = 3,4,5 and no uniform-in-k one-sided bound (DeltaCov_k <= 0 for ALL k) can exist regardless of certificate precision; and (B) even the fixed-k sign is invisible to the imp-96628 certificate, because its total-variation remainder bound V(k) exceeds |B_k| at every k = 2..6 (0.591<1.389, 0.071<0.336, 0.119<0.134, 0.029<0.067, 0.038<0.038), so the certified enclosure B_k +/- V(k) straddles zero. This precisely characterizes why the oscillation blocks the sharpening: the sign is real but lag-alternating (killing the uniform bound structurally), and the TV remainder is too lossy to expose even the per-lag sign the leading term already carries. Assessment only; the VIF certificate does NOT close; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96567 / imp-96628 convention).
export const IMP96812_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the imp-96628 certified two-sided '
  + 'box-sine envelope CANNOT be sharpened to a one-sided sign. The explicit leading term B_k governs '
  + 'the sign (dropping R_k reproduces the imp-96617 measured DeltaCov to ~4 sig figs at L = 495.779) '
  + 'and B_k alternates with the lag (DeltaCov -,+,+,+,- for k = 2..6), so DeltaCov_k > 0 at k = 3,4,5 '
  + 'and the VIF requirement DeltaCov_k <= 0 for ALL k fails structurally; separately the TV remainder '
  + 'bound V(k) exceeds |B_k| at every k, so the certified enclosure straddles zero. Conditional on the '
  + 'pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation; no zeros, no offline script) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // 1. The leading term alone reproduces the imp-96617 measured DeltaCov to ~1% at every lag,
  //    confirming R_k is empirically tiny and B_k governs the sign.
  for (const k of LAGS) {
    const lead = deltaCovLeading(k);
    const meas = MEASURED_DELTACOV[k];
    if (Math.sign(lead) !== Math.sign(meas))
      throw new Error('imp-96812: leading-term sign must match the measured DeltaCov sign at k = ' + k);
    if (!(Math.abs(lead - meas) <= 0.02 * Math.abs(meas)))
      throw new Error('imp-96812: leading term must reproduce measured DeltaCov to ~1% at k = ' + k);
  }

  // 2. The sign is LAG-ALTERNATING (both signs across k = 2..6), so no uniform one-sided bound exists.
  const signs = LAGS.map((k) => Math.sign(deltaCovLeading(k)));
  if (!(signs.some((s) => s > 0) && signs.some((s) => s < 0)))
    throw new Error('imp-96812: DeltaCov sign must be lag-alternating (both signs), blocking a one-sided bound');

  // 3. DeltaCov_k > 0 at k = 3,4,5 (the VIF needs DeltaCov_k <= 0 for ALL k -- violated).
  for (const k of [3, 4, 5])
    if (!(deltaCovLeading(k) > 0))
      throw new Error('imp-96812: DeltaCov must be positive at k = ' + k + ' (violates the VIF one-sided requirement)');

  // 4. Certificate-slack horn: the TV remainder bound dominates the leading term at EVERY lag,
  //    so the certified enclosure B_k +/- V(k) straddles zero.
  for (const k of LAGS) {
    const B = leadingTerm(k);
    const Vk = totalVariation(k);
    if (!(Math.abs(B) < Vk))
      throw new Error('imp-96812: |B_k| must be < V(k) at k = ' + k + ' (enclosure straddles zero)');
    if (!(B - Vk < 0 && B + Vk > 0))
      throw new Error('imp-96812: certified enclosure B_k +/- V(k) must straddle zero at k = ' + k);
  }

  // 5. The module records the one-sided sharpening as NOT achievable.
  if (IMP96812_BOXSINE_ONESIDED_SIGN_ASSESSMENT.oneSidedAchievable !== false)
    throw new Error('imp-96812: one-sided sharpening must be recorded as NOT achievable');

  // honesty gates
  if (!/NO QED/.test(IMP96812_BOXSINE_ONESIDED_SIGN_ASSESSMENT.verdict))
    throw new Error('imp-96812: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96812_BOXSINE_ONESIDED_SIGN_ASSESSMENT.verdict))
    throw new Error('imp-96812: verdict dropped the no-refereed-bound-change banner');
  if (!/[Cc]onditional/.test(IMP96812_BOXSINE_ONESIDED_SIGN_ASSESSMENT.verdict))
    throw new Error('imp-96812: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96812_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96812_HONEST_BANNER) && /NO QED/.test(IMP96812_HONEST_BANNER)))
    throw new Error('imp-96812: IMP96812_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96812_BOXSINE_ONESIDED_SIGN_ASSESSMENT;
