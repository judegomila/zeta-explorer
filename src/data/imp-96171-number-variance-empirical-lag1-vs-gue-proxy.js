/**
 * imp-96171 -- EMPIRICAL adjacent-box lag-1 correlation of the sd(C - E) statistic on the
 * ACTUAL Riemann zeros, versus the exact GUE two-interval proxy rho_exact = -0.46398 that
 * imp-96128/imp-96150 use for the adjacent-window correlation at the significant height T = 1.5e5.
 *
 * WHAT imp-96128 LEFT OPEN. imp-96128 computed the THEORETICAL GUE (sine-kernel, universality)
 * two-interval count correlation rho_exact = -0.46398 for boxes of unfolded length L = 495.78 at
 * T = 1.5e5, and used it as a proxy for the adjacent-window correlation of the sd(C - E) number-
 * variance statistic. Its HONEST CAVEAT: "rho_exact ... is not the empirical adjacent-box covariance
 * of the actual Riemann zeros over the 10^6 Odlyzko range (that would need the zeros bundle and is not
 * computed here)." This module measures that empirical correlation and compares it to the proxy.
 *
 * THE MEASUREMENT. Over the +/-30% height span at T = 1.5e5, tile non-overlapping hard boxes and form
 * the per-box discrepancy D = C - E (C = local zero count, E = 2*Delta*delta envelope), the same
 * sequence imp-95562 tabulates and imp-96128 models as an AR-1 process. The sample lag-1 correlation is
 *     r1 = ( sum_{i>=1} (D_i - Dbar)(D_{i-1} - Dbar) ) / ( sum_i (D_i - Dbar)^2 ).
 * TWO tilings were run over src/data/zeros-to-1e6.js:
 *  (a) the imp-95562 RAW tiling -- fixed step 2*Delta(Tc) with each box using its LOCAL half-width
 *      Delta(t) = sqrt(t/2pi). Because Delta(t) grows across the span, boxes above the center OVERLAP
 *      (box width 2*Delta(t) > step 2*Delta(Tc)) and boxes below the center leave GAPS.
 *  (b) a CLEAN unfolded edge-to-edge tiling -- equal-unfolded-length boxes via the Riemann-von Mangoldt
 *      map N(t) = (t/2pi)log(t/2pi) - t/2pi + 7/8, so adjacent boxes are exactly edge-to-edge with
 *      expected count L. This is the direct empirical analog of the sine-kernel two-interval covariance.
 *
 * FINDINGS.
 *  1. PROXY CONFIRMED UNDER THE CORRECT TILING. The clean unfolded edge-to-edge tiling gives an
 *     empirical lag-1 correlation r1 = -0.5126 at L = 495.78 (290 boxes) -- strongly ANTI-correlated,
 *     the SAME sign and comparable magnitude as the GUE proxy rho_exact = -0.46398. The difference
 *     0.049 is inside the small-sample band 1.96/sqrt(290) = 0.1151, so real zeros do NOT reject the
 *     proxy. An L-sweep (L in {100,200,300,495.78,700,1000}) stays in [-0.526, -0.433], bracketing the
 *     proxy at every scale: the strong adjacent-box anti-correlation is a robust empirical feature.
 *  2. THE RAW imp-95562 TILING CARRIES A POSITIVE ARTIFACT. Its lag-1 correlation is r1 = +0.243 at
 *     T = 1.5e5 -- the WRONG sign, outside the small-sample band. This is a tiling artifact: above the
 *     center the fixed step 2*Delta(Tc) is shorter than the local box width 2*Delta(t), so adjacent
 *     boxes overlap and share zeros, injecting a spurious POSITIVE correlation. It is not a finite-
 *     height failure of the GUE proxy; the clean tiling (a) removes the overlap and restores the
 *     GUE-predicted anti-correlation.
 *  3. NET EFFECT ON imp-96128. The empirical correlation of the count fluctuations is negative (safe
 *     side of the POSITIVE flip threshold rho_crit = 0.5744), exactly as imp-96128 concluded from the
 *     proxy. The proxy neither materially under- nor over-states the true de-correlation once the
 *     tiling overlap is removed: rho_exact = -0.46398 vs empirical -0.5126, both firmly anti-correlated.
 *
 * HONEST CAVEAT. r1 values are single-realization sample autocorrelations over ~290 boxes at one height;
 * their sampling spread is ~0.115, so the agreement is "not rejected", not a high-precision match. The
 * unfolding uses the smooth Riemann-von Mangoldt N(t) (no S(t) oscillation correction), which is exact
 * on average and negligible at L ~ 500. This measurement CLOSES the imp-96128 empirical-covariance
 * caveat -- the GUE proxy is validated by the actual zeros under the correct (edge-to-edge) tiling and
 * the raw imp-95562 tiling's positive lag-1 value is identified as an overlap artifact -- but it changes
 * no bound and does not raise the ~1.9-sigma significant-dip confidence, which is set by the excursion
 * depth, not the correlation model.
 *
 * VERDICT. The empirical adjacent-box lag-1 correlation of the sd(C - E) statistic on the actual Riemann
 * zeros at T = 1.5e5 is r1 = -0.5126 under a clean unfolded edge-to-edge tiling (290 boxes), CONFIRMING
 * the exact GUE proxy rho_exact = -0.46398 in sign and magnitude (difference 0.049 < the 0.1151 small-
 * sample band) and stable in [-0.526,-0.433] across an L-sweep. The imp-95562 raw variable-width tiling
 * reports r1 = +0.243, but that positive value is a box-overlap artifact of the fixed-step / local-width
 * mismatch, not a real de-correlation reversal. The proxy is neither materially under- nor over-stated:
 * the true correlation is anti-correlated on the safe side of the sign-forbidden flip threshold, exactly
 * as imp-96128 concluded. Measurement only; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96128-number-variance-two-interval-covariance-exact (the exact GUE proxy this validates)
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights
 * @see imp-95562-meansquare-vs-pointwise-gap (the sd(C - E) tiling this measures)
 *
 * Import-light: no zeros bundle, no sibling imports. The lag-1 correlations are baked literals from the
 * offline run tmp/imp-96171-scratch.mjs (raw tiling) and tmp/imp-96171-diag.mjs (clean unfolded tiling)
 * over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; the comparison arithmetic is re-derived.
 */

// GUE proxy from imp-96128 at the significant height T = 1.5e5.
const RHO_EXACT_15E5 = -0.46398; // exact GUE two-interval count correlation, L = 495.779
const RHO_CRIT_15E5 = 0.57443; // POSITIVE lag-1 correlation that flips the verdict to noise
const L_15E5 = 495.779; // imp-96128 zeros per box at T = 1.5e5

// Baked empirical lag-1 correlations of the per-box (C - E) sequence on the actual zeros.
const RAW_TILING = {
  // imp-95562 variable-width tiling: fixed step 2*Delta(Tc), local box width 2*Delta(t).
  nBoxes: 291,
  r1: 0.243202, // POSITIVE -- box-overlap artifact above the center
  r2: 0.036034,
  r3: -0.017555,
};
const CLEAN_UNFOLDED = {
  // equal-unfolded-length edge-to-edge boxes via Riemann-von Mangoldt N(t); direct sine-kernel analog.
  nBoxes: 290,
  L: L_15E5,
  r1: -0.512617, // strongly anti-correlated -- confirms the GUE proxy
  r2: 0.079473,
  r3: -0.110639,
};
// L-sweep of the clean-tiling lag-1 correlation (all firmly anti-correlated, bracketing the proxy).
const CLEAN_L_SWEEP = [
  { L: 100, nBoxes: 1441, r1: -0.4331 },
  { L: 200, nBoxes: 720, r1: -0.5233 },
  { L: 300, nBoxes: 480, r1: -0.436 },
  { L: 495.779, nBoxes: 290, r1: -0.5126 },
  { L: 700, nBoxes: 205, r1: -0.5256 },
  { L: 1000, nBoxes: 144, r1: -0.4516 },
];

const smallSampleBand = 1.96 / Math.sqrt(CLEAN_UNFOLDED.nBoxes); // ~0.1151
const cleanVsProxy = CLEAN_UNFOLDED.r1 - RHO_EXACT_15E5; // -0.0486
const proxyNotRejected = Math.abs(cleanVsProxy) <= smallSampleBand;

export const IMP96171_NUMBER_VARIANCE_EMPIRICAL_LAG1_VS_GUE_PROXY = {
  ticket: 'imp-96171',
  source:
    'imp-96128/imp-96150 use the exact GUE two-interval count correlation rho_exact = -0.46398 as a proxy for the adjacent-window correlation of the sd(C - E) number-variance statistic at T = 1.5e5, leaving the empirical adjacent-box covariance of the actual Riemann zeros uncomputed (its HONEST CAVEAT). This module measures the sample lag-1 correlation of the per-box (C - E) sequence over src/data/zeros-to-1e6.js at the significant height and compares it to the proxy, under both the imp-95562 raw tiling and a clean unfolded edge-to-edge tiling.',
  significantHeight: 1.5e5,
  gueProxy: {
    rhoExact: RHO_EXACT_15E5, // -0.46398 (imp-96128 exact GUE two-interval correlation)
    L: L_15E5, // 495.779 zeros per box
    rhoCritFlip: RHO_CRIT_15E5, // +0.57443 POSITIVE flip threshold
  },
  rawTiling: RAW_TILING, // imp-95562 variable-width tiling: r1 = +0.243 (overlap artifact)
  cleanUnfolded: CLEAN_UNFOLDED, // equal-unfolded-length edge-to-edge: r1 = -0.5126 (confirms proxy)
  cleanLSweep: CLEAN_L_SWEEP, // r1 stays in [-0.526, -0.433] across L
  comparison: {
    smallSampleBand, // 1.96/sqrt(nBoxes) ~ 0.1151
    cleanVsProxy, // empirical clean r1 minus proxy ~ -0.0486 (inside the band)
    proxyNotRejected, // true: real zeros do NOT reject the GUE proxy under the correct tiling
    rawArtifactSign:
      'The raw imp-95562 tiling r1 = +0.243 has the WRONG sign because above the center the fixed step 2*Delta(Tc) is shorter than the local box width 2*Delta(t): adjacent boxes overlap and share zeros, injecting spurious positive correlation. The clean edge-to-edge tiling removes the overlap and restores the GUE-predicted anti-correlation.',
  },
  caveat:
    'r1 values are single-realization sample autocorrelations over ~290 boxes at one height (sampling spread ~0.115), so the agreement is "not rejected", not a high-precision match. The unfolding uses the smooth Riemann-von Mangoldt N(t) (no S(t) correction), exact on average and negligible at L ~ 500. This CLOSES the imp-96128 empirical-covariance caveat but changes no bound and does not raise the ~1.9-sigma significant-dip confidence, which is set by the excursion depth, not the correlation model.',
  verdict:
    'The empirical adjacent-box lag-1 correlation of the sd(C - E) statistic on the actual Riemann zeros at T = 1.5e5 is r1 = -0.5126 under a clean unfolded edge-to-edge tiling (290 boxes), CONFIRMING the exact GUE proxy rho_exact = -0.46398 in sign and magnitude (difference 0.049 < the 0.1151 small-sample band) and stable in [-0.526,-0.433] across an L-sweep. The imp-95562 raw variable-width tiling reports r1 = +0.243, but that positive value is a box-overlap artifact of the fixed-step / local-width mismatch, not a real de-correlation reversal. The proxy is neither materially under- nor over-stated: the true correlation is anti-correlated on the safe side of the sign-forbidden flip threshold, exactly as imp-96128 concluded. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (comparison arithmetic only; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // clean-tiling empirical correlation confirms the GUE proxy: same sign, inside the small-sample band
  if (!(CLEAN_UNFOLDED.r1 < 0 && RHO_EXACT_15E5 < 0))
    throw new Error('imp-96171: clean empirical r1 and GUE proxy should both be negative');
  if (!proxyNotRejected)
    throw new Error('imp-96171: clean empirical r1 should be within the small-sample band of the proxy');
  if (!approx(smallSampleBand, 0.1151, 1e-3)) throw new Error('imp-96171: small-sample band drifted');
  if (!approx(cleanVsProxy, -0.0486, 1e-3)) throw new Error('imp-96171: clean-vs-proxy difference drifted');
  // the entire clean L-sweep is anti-correlated and brackets the proxy
  if (!CLEAN_L_SWEEP.every((r) => r.r1 < -0.4 && r.r1 > -0.55))
    throw new Error('imp-96171: every clean-tiling lag-1 correlation should be firmly anti-correlated');
  // the raw imp-95562 tiling carries the POSITIVE overlap artifact (opposite sign)
  if (!(RAW_TILING.r1 > 0)) throw new Error('imp-96171: raw tiling r1 should be the positive overlap artifact');
  if (!(RAW_TILING.r1 > smallSampleBand))
    throw new Error('imp-96171: raw tiling r1 artifact should be outside the small-sample band');
  // empirical correlation is on the SAFE side of the positive flip threshold (imp-96128 conclusion holds)
  if (!(CLEAN_UNFOLDED.r1 < RHO_CRIT_15E5))
    throw new Error('imp-96171: empirical correlation should be on the safe side of the flip threshold');
  // honesty gates
  if (!/NO QED/.test(IMP96171_NUMBER_VARIANCE_EMPIRICAL_LAG1_VS_GUE_PROXY.verdict))
    throw new Error('imp-96171: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96171_NUMBER_VARIANCE_EMPIRICAL_LAG1_VS_GUE_PROXY.verdict))
    throw new Error('imp-96171: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96171_NUMBER_VARIANCE_EMPIRICAL_LAG1_VS_GUE_PROXY;
