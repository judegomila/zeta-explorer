/**
 * imp-96184 -- EMPIRICAL adjacent-box lag-1 correlation r1 of the sd(C - E) statistic on the
 * ACTUAL Riemann zeros at the FIVE imp-96090 held-out centres {2e4, 5e4, 1e5, 2e5, 4e5}, under
 * the identical imp-96171 clean unfolded edge-to-edge tiling, compared to the imp-96150 exact
 * GUE per-height proxy rho_exact -- testing whether the imp-96171 single-height confirmation of
 * the GUE anti-correlation persists across height.
 *
 * WHAT imp-96171 LEFT OPEN. imp-96171 measured the empirical clean-unfolded edge-to-edge lag-1
 * correlation r1 = -0.5126 at the SINGLE significant height T = 1.5e5 (290 boxes), confirming the
 * exact GUE two-interval proxy rho_exact = -0.46398 in sign and magnitude (difference 0.049,
 * inside the small-sample band 1.96/sqrt(290) = 0.115). Its HONEST CAVEAT: "r1 values are
 * single-realization sample autocorrelations over ~290 boxes at ONE height." This module measures
 * r1 under the identical clean tiling at the other five imp-96090 held-out centres and compares
 * each to the imp-96150 per-height rho_exact, to decide whether the anti-correlated GUE agreement
 * is UNIFORM across height or only established at 1.5e5.
 *
 * THE MEASUREMENT (identical to imp-96171 clean tiling). Per centre Tc the +/-30% height span is
 * tiled into equal-unfolded-length edge-to-edge boxes of length L = envelopeCount(Tc) via the
 * Riemann-von Mangoldt map N(t) = (t/2pi)log(t/2pi) - t/2pi + 7/8, so adjacent boxes are exactly
 * edge-to-edge with expected count L. Each box carries the discrepancy D = C - E (C = local zero
 * count, E = unfolded length = L), and the sample lag-1 correlation is
 *     r1 = ( sum_{i>=1} (D_i - Dbar)(D_{i-1} - Dbar) ) / ( sum_i (D_i - Dbar)^2 ).
 * L and rho_exact per height are the imp-96150 literals (L = 2*Delta*delta, Delta = sqrt(T/2pi),
 * delta = log(T/2pi)/2pi; rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1). Counts run over the 10^6
 * Odlyzko ordinates in src/data/zeros-to-1e6.js.
 *
 * FINDINGS.
 *  1. THE GUE-PROXY CONFIRMATION IS UNIFORM ACROSS HEIGHT. At all five held-out centres the
 *     empirical r1 is strongly NEGATIVE -- r1 = -0.5157, -0.5764, -0.5314, -0.5152, -0.4893 at
 *     T = 2e4, 5e4, 1e5, 2e5, 4e5 -- the SAME sign and comparable magnitude as the imp-96150
 *     per-height proxy rho_exact = -0.4587, -0.4613, -0.4630, -0.4646, -0.4660. Every height sits
 *     firmly in the anti-correlated regime near the GUE-rigidity value -1/2, exactly as at the
 *     significant height T = 1.5e5.
 *  2. NO HEIGHT REJECTS THE PROXY. The signed difference r1 - rho_exact is -0.057, -0.115, -0.068,
 *     -0.051, -0.023 across the five heights, and each is INSIDE its own small-sample band
 *     1.96/sqrt(nBoxes) = 0.190, 0.152, 0.127, 0.107, 0.090. So the actual zeros do NOT reject the
 *     exact GUE proxy at any held-out height -- the imp-96171 "not rejected" verdict is not a
 *     single-height accident.
 *  3. THE EMPIRICAL BOX COUNTS MATCH THE imp-96150 GEOMETRY. The clean-tiling box counts
 *     (106, 167, 237, 335, 474) reproduce the imp-96150 held-out window counts n_w
 *     (106, 168, 237, 336, 475) to within one box, confirming the two measurements tile the same
 *     strips. The empirical r1 sits BELOW (more strongly anti-correlated than) rho_exact at ALL
 *     five heights -- the same sign-consistent, slightly-stronger empirical de-correlation
 *     imp-96171 saw at 1.5e5 (empirical -0.5126 vs proxy -0.46398), not a reversal.
 *
 * HONEST CAVEAT. Each r1 is a single-realization sample autocorrelation over ~100-470 boxes at one
 * height; the sampling spreads (0.09-0.19) are wide, so this is uniform "agreement not rejected",
 * not a high-precision match -- the T = 5e4 height has the largest deviation (-0.115) but still
 * inside its 0.152 band. The unfolding uses the smooth Riemann-von Mangoldt N(t) (no S(t)
 * oscillation correction), exact on average and negligible at L ~ 150-890. This EXTENDS the
 * imp-96171 single-height empirical confirmation across the five held-out heights but changes no
 * bound and does not raise the ~1.9-sigma significant-dip confidence, which is set by the excursion
 * depth, not the correlation model.
 *
 * VERDICT. The empirical clean-unfolded edge-to-edge lag-1 correlation r1 of the sd(C - E)
 * statistic on the actual Riemann zeros is strongly anti-correlated at every one of the five
 * imp-96090 held-out centres (r1 in -0.5764 .. -0.4893), CONFIRMING the imp-96150 exact GUE proxy
 * rho_exact (-0.4660 .. -0.4587) in sign and magnitude at all five heights, with the signed
 * difference inside the small-sample band at each. The anti-correlated GUE agreement imp-96171
 * established at the single significant height T = 1.5e5 is therefore UNIFORM across the accessible
 * height band, not a single-height accident. Measurement only; changes no bound; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96171-number-variance-empirical-lag1-vs-gue-proxy (the single-height empirical confirmation this extends)
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights (the exact per-height GUE proxy rho_exact)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the five held-out centres and window counts)
 *
 * Import-light: no zeros bundle, no sibling imports. The per-height r1/r2/r3 are baked literals from
 * the offline run tmp/imp-96184-scratch.mjs over the 10^6 Odlyzko ordinates in
 * src/data/zeros-to-1e6.js; the per-height rho_exact and comparison arithmetic are re-derived from
 * the same sine-kernel number-variance function imp-96150 uses.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L zeros per box (imp-96150)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI); // Sigma^2(L)
const twoIntervalCov = (L) => (gueNumberVariance(2 * L) - 2 * gueNumberVariance(L)) / 2;
const rhoExactOf = (L) => twoIntervalCov(L) / gueNumberVariance(L); // exact adjacent-box lag-1 correlation

// Baked empirical lag-1/2/3 correlations of the per-box (C - E) sequence on the actual zeros under
// the clean unfolded edge-to-edge tiling; from tmp/imp-96184-scratch.mjs over src/data/zeros-to-1e6.js.
const HELDOUT = [
  { Tc: 2.0e4, nBoxes: 106, r1: -0.515656, r2: 0.0804, r3: 0.0211 },
  { Tc: 5.0e4, nBoxes: 167, r1: -0.576374, r2: 0.1500, r3: -0.0510 },
  { Tc: 1.0e5, nBoxes: 237, r1: -0.531357, r2: 0.1063, r3: -0.1243 },
  { Tc: 2.0e5, nBoxes: 335, r1: -0.515186, r2: -0.0043, r3: 0.0112 },
  { Tc: 4.0e5, nBoxes: 474, r1: -0.489303, r2: -0.0212, r3: 0.0258 },
];

const SIGNIFICANT_HEIGHT_REFERENCE = {
  Tc: 1.5e5, // imp-96171 single significant height
  r1: -0.512617, // clean-tiling empirical lag-1 (290 boxes)
  rhoExact: -0.46398, // imp-96128 exact GUE proxy at T = 1.5e5
};

const rows = HELDOUT.map((m) => {
  const L = envelopeCount(m.Tc);
  const rhoExact = rhoExactOf(L); // imp-96150 per-height GUE proxy
  const band = 1.96 / Math.sqrt(m.nBoxes); // small-sample spread of the sample autocorrelation
  const diff = m.r1 - rhoExact; // empirical minus proxy (signed)
  return {
    Tc: m.Tc,
    nBoxes: m.nBoxes,
    zerosPerBox: L,
    r1: m.r1,
    r2: m.r2,
    r3: m.r3,
    rhoExact,
    diff,
    smallSampleBand: band,
    proxyNotRejected: Math.abs(diff) <= band,
  };
});

const r1Values = rows.map((r) => r.r1);
const uniformity = {
  r1Min: Math.min(...r1Values),
  r1Max: Math.max(...r1Values),
  allAntiCorrelated: r1Values.every((r) => r < 0), // every held-out height strongly negative
  allNotRejected: rows.every((r) => r.proxyNotRejected), // no height rejects the GUE proxy
  strongerThanProxyCount: rows.filter((r) => r.r1 < r.rhoExact).length, // heights with empirical below proxy
};

export const IMP96184_NUMBER_VARIANCE_EMPIRICAL_LAG1_HELDOUT_HEIGHTS = {
  ticket: 'imp-96184',
  source:
    'imp-96171 measured the empirical clean-unfolded edge-to-edge lag-1 correlation r1 = -0.5126 at the single significant height T = 1.5e5 (290 boxes), confirming the exact GUE proxy rho_exact = -0.46398 but flagging that this is a single-realization sample autocorrelation at ONE height. This module measures r1 under the identical clean tiling at the five imp-96090 held-out centres {2e4, 5e4, 1e5, 2e5, 4e5} over src/data/zeros-to-1e6.js and compares each to the imp-96150 per-height rho_exact, to decide whether the anti-correlated GUE agreement is uniform across height or only established at 1.5e5.',
  significantHeightReference: SIGNIFICANT_HEIGHT_REFERENCE,
  definitions: {
    zerosPerBox: 'L = 2*Delta*delta(T), Delta = sqrt(T/2pi), delta = log(T/2pi)/2pi: mean zeros in one unfolded box (imp-96150)',
    r1: 'sample lag-1 autocorrelation of the per-box (C - E) sequence under the clean unfolded edge-to-edge tiling',
    rhoExact: 'rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1: the imp-96150 exact GUE two-interval lag-1 correlation at this height',
    diff: 'r1 - rho_exact: signed empirical-minus-proxy difference',
    smallSampleBand: '1.96/sqrt(nBoxes): sampling spread of the single-realization autocorrelation',
    proxyNotRejected: 'true when |r1 - rho_exact| <= smallSampleBand: the actual zeros do not reject the GUE proxy at this height',
  },
  rows,
  uniformity,
  caveat:
    'Each r1 is a single-realization sample autocorrelation over ~100-470 boxes at one height; the sampling spreads (0.09-0.19) are wide, so this is uniform "agreement not rejected", not a high-precision match -- the T = 5e4 height has the largest deviation (-0.115) but still inside its 0.152 band. The unfolding uses the smooth Riemann-von Mangoldt N(t) (no S(t) correction), exact on average and negligible at L ~ 150-890. This extends the imp-96171 single-height confirmation across the five held-out heights but changes no bound and does not raise the ~1.9-sigma confidence, which is set by the excursion depth, not the correlation model.',
  verdict:
    'The empirical clean-unfolded edge-to-edge lag-1 correlation r1 of the sd(C - E) statistic on the actual Riemann zeros is strongly anti-correlated at every one of the five imp-96090 held-out centres (r1 in -0.5764 .. -0.4893), CONFIRMING the imp-96150 exact GUE proxy rho_exact (-0.4660 .. -0.4587) in sign and magnitude at all five heights, with the signed difference inside the small-sample band at each. The anti-correlated GUE agreement imp-96171 established at the single significant height T = 1.5e5 is therefore UNIFORM across the accessible height band, not a single-height accident. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (comparison arithmetic only; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  if (rows.length !== 5) throw new Error('imp-96184: expected five held-out heights');
  // none of the five is the imp-96171 significant height
  if (rows.some((r) => r.Tc === 1.5e5)) throw new Error('imp-96184: the significant height leaked into the held-out set');
  // per-height rho_exact reproduces the imp-96150 census (same envelopeCount / number-variance functions)
  if (!approx(at(2.0e4).rhoExact, -0.458696, 1e-5)) throw new Error('imp-96184: T = 2e4 rho_exact drifted from imp-96150');
  if (!approx(at(4.0e5).rhoExact, -0.466037, 1e-5)) throw new Error('imp-96184: T = 4e5 rho_exact drifted from imp-96150');
  // every held-out empirical r1 is strongly anti-correlated near the GUE-rigidity regime
  if (!uniformity.allAntiCorrelated) throw new Error('imp-96184: some held-out empirical r1 is not anti-correlated');
  if (!(uniformity.r1Min > -0.6 && uniformity.r1Max < -0.45))
    throw new Error('imp-96184: held-out empirical r1 band should sit firmly in the anti-correlated regime');
  // no held-out height rejects the GUE proxy (signed difference inside its small-sample band)
  if (!uniformity.allNotRejected) throw new Error('imp-96184: some held-out height rejects the GUE proxy');
  // the empirical box counts reproduce the imp-96150 held-out window counts n_w to within one box
  const nw = { 20000: 106, 50000: 168, 100000: 237, 200000: 336, 400000: 475 };
  if (!rows.every((r) => Math.abs(r.nBoxes - nw[r.Tc]) <= 1))
    throw new Error('imp-96184: clean-tiling box counts should match the imp-96150 window counts to within one box');
  // the empirical r1 sits below (stronger than) the proxy at every height (sign-consistent, not a reversal)
  if (uniformity.strongerThanProxyCount !== 5)
    throw new Error('imp-96184: expected all five heights with empirical r1 below the proxy');
  // honesty gates
  if (!/NO QED/.test(IMP96184_NUMBER_VARIANCE_EMPIRICAL_LAG1_HELDOUT_HEIGHTS.verdict))
    throw new Error('imp-96184: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96184_NUMBER_VARIANCE_EMPIRICAL_LAG1_HELDOUT_HEIGHTS.verdict))
    throw new Error('imp-96184: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96184_NUMBER_VARIANCE_EMPIRICAL_LAG1_HELDOUT_HEIGHTS;
