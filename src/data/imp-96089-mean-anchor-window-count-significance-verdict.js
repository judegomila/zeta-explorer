/**
 * imp-96089 -- CLOSING the imp-96071-window-count sub-gap: the actual per-height quasi-independent
 * window count n_w(T) is recoverable import-light, so the significant-vs-noise verdict at the two
 * contested below-envelope mean-anchor heights (T = 1e4, T = 1.5e5) can now be decided.
 *
 * imp-96071 left a named sub-gap (imp-96071-window-count): its noise-floor crossover counts
 * (n_w_crossover ~ 537 at T = 1e4, ~79 at T = 1.5e5, ~73194 at T = 3e5) decide whether each
 * below-envelope dip is real or sampling noise ONLY once the ACTUAL quasi-independent window count
 * n_w(T) is known, and imp-96071 deferred that to keep the module import-light -- it thought n_w(T)
 * needed the zeros bundle.
 *
 * KEY OBSERVATION (why the sub-gap closes import-light). The imp-95562 measurement did NOT use an
 * unknown adaptive window count: it tiled n_w NON-OVERLAPPING hard-box windows of full width
 * 2*Delta(T_c), Delta = sqrt(T_c/2pi), across a +/-30 percent span about each T_c, clipped to the
 * available ordinate range. That count is pure DETERMINISTIC GEOMETRY, independent of the zeros:
 *   n_w(T) = floor( (min(1.30*T, T_max) - 0.70*T) / (2 * Delta(T)) ),
 * where T_max ~ 600269.68 is the height of the 10^6-th Odlyzko ordinate (the only clip that bites is
 * the top height T = 5e5, whose +30 percent edge 6.5e5 exceeds T_max). Evaluated here this reproduces
 * ALL SIX imp-95562 baked nWindows EXACTLY (75, 130, 198, 291, 411, 443), confirming n_w(T) is the
 * tiled window count and needs no zeros bundle. Non-overlapping hard boxes are quasi-independent to
 * leading order (they share only a boundary of measure O(1/L) relative to the ~L ~ 100-300 zeros each
 * box holds), so n_w is precisely the quasi-independent count the imp-96071 chi-square model asks for.
 *
 * METHOD (import-light: no zeros bundle, no sibling imports). The same six imp-95562 sd(C - E)
 * literals and the identical closed-form r_cap(T)/offset(T) as imp-96049/imp-96071 are re-derived
 * verbatim here so this module stands alone. For each below-envelope height:
 *   - recover n_w(T) from the tiling geometry above and cross-check against the imp-95562 baked count;
 *   - recompute the imp-96071 crossover n_w_crossover(T) = 2 / (|residual|/r)^2;
 *   - form the measurement z-score z(T) = (|residual|/r) / sqrt(2 / n_w) -- the dip in units of the
 *     chi-square sampling error -- and declare the dip SIGNIFICANT iff z >= 1 (equivalently
 *     n_w > n_w_crossover), NOISE otherwise.
 *
 * FINDINGS.
 *  1. n_w(T) is recovered EXACTLY from the tiling geometry: floor((min(1.3T, T_max) - 0.7T)/(2 Delta))
 *     = 75, 130, 198, 291, 411, 443 across the six heights, matching the imp-95562 baked nWindows to
 *     the integer (the T_max clip only bites at T = 5e5, whose +30 percent edge exceeds the ordinate
 *     ceiling). The sub-gap needed no zeros bundle -- the window count was deterministic all along.
 *  2. T = 1e4 (-6.1 percent): n_w = 75 is far BELOW the crossover 537 (z = 0.37 sigma). The dip is
 *     comfortably within the number-variance noise floor -- NOT significant.
 *  3. T = 1.5e5 (-16.0 percent, the deepest dip / former max-anchor touch point): n_w = 291 is well
 *     ABOVE the crossover 79 (z = 1.92 sigma). The dip is SIGNIFICANT -- it is a real below-envelope
 *     excursion, not sampling noise. For it to fall to noise the effective independent-window count
 *     would have to drop below 79, i.e. a de-correlation factor < 0.27 on non-overlapping boxes,
 *     which is implausible; the significant verdict is robust.
 *  4. T = 3e5 (-0.5 percent): n_w = 411 vs crossover ~73194 (z = 0.08 sigma) -- unambiguously noise,
 *     confirming imp-96071.
 *
 * CONSEQUENCE. Exactly ONE of the three below-envelope dips is significant: the deepest, T = 1.5e5,
 * at ~1.9 sigma. This is the SAME height at which imp-96071 Q1 found the minimal uniform r_cap
 * correction binds (delta_C0 = 0.07188 reverts to the max anchor) and imp-96070 found the LOO cap
 * breaches worst (-19.1 percent). The three lines of evidence agree: the mean anchor genuinely
 * (not by chance) under-caps the number variance at T = 1.5e5, so the dead-zone r_cap < 1 headline
 * must continue to rest on the out-of-sample-safer imp-95722 max anchor. The T = 1e4 and T = 3e5
 * dips are noise and impose no such demand.
 *
 * HONEST CAVEAT. The chi-square sqrt(2/n_w) is the first-order variance-estimator sampling model and
 * z >= 1 is a 1-sigma threshold, so T = 1.5e5 at 1.9 sigma is significant but not overwhelming -- it
 * is a genuine ~2-sigma excursion, not a high-confidence anomaly. Any true de-correlation of the
 * non-overlapping boxes lowers the effective n_w, which can only shrink z (push toward noise); since
 * that leaves T = 1e4 and T = 3e5 firmly noise and needs an implausible 73 percent window loss to
 * flip T = 1.5e5, the qualitative verdict is stable. Measurement/assessment only.
 *
 * VERDICT. The imp-96071-window-count sub-gap is CLOSED import-light: n_w(T) = floor(0.6 T / 2 Delta)
 * reproduces the imp-95562 tiling counts exactly (75, 291, 411). Of the contested dips, T = 1e4
 * (-6.1 percent, n_w 75 << 537, z 0.37) is NOISE and T = 1.5e5 (-16.0 percent, n_w 291 >> 79, z 1.92)
 * is SIGNIFICANT -- the deepest dip is a real ~1.9-sigma below-envelope excursion at exactly the
 * height where imp-96070/imp-96071 already flagged the mean anchor fails as a cap. Changes no bound;
 * NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96071-mean-anchor-below-envelope-correction-vs-noise-floor (the sub-gap this closes)
 * @see imp-96049-number-variance-mean-anchor-six-height-residual-band (the mean-anchor residual band)
 * @see imp-95562-meansquare-vs-pointwise-gap (the windowing whose n_w this recovers)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same measured
 * literals imp-95562 baked over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; the window
 * counts are re-derived from the tiling geometry and every other quantity is recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// The imp-95562 windowing tiled non-overlapping hard boxes of full width 2*Delta across a +/-30%
// span, clipped to the available ordinate range [T lower, T_MAX]. The tiled count is deterministic
// geometry -- no zeros needed. T_MAX ~ 600269.68 is the height of the 10^6-th Odlyzko ordinate; the
// only height whose +30% edge exceeds it is the top one, T = 5e5 (edge 6.5e5), so that span is clipped.
const SPAN_FRACTION = 0.3; // +/- 0.30 about T_c
const T_MAX_ORDINATE = 600269.68; // height of the 10^6-th Odlyzko ordinate (src/data/zeros-to-1e6.js)
const windowCount = (T) => {
  const upper = Math.min((1 + SPAN_FRACTION) * T, T_MAX_ORDINATE);
  const lower = (1 - SPAN_FRACTION) * T;
  return Math.floor((upper - lower) / (2 * halfWidth(T)));
};

// Same six measured literals imp-95562/imp-95710/imp-95722/imp-95946/imp-95958/imp-96049 baked.
// nWindowsBaked is the imp-95562 tiled window count, cross-checked against windowCount(Tc) below.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218, nWindowsBaked: 75 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823, nWindowsBaked: 130 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689, nWindowsBaked: 198 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714, nWindowsBaked: 291 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199, nWindowsBaked: 411 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078, nWindowsBaked: 443 },
];

const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
const C0_mean = mean(offsets); // imp-95958/imp-96049 mean anchor
const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T));

const rows = MEASURED.map((m) => {
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar; // imp-95710 r(T)
  const rCap = cappedRatio(m.Tc, C0_mean);
  const residual = rCap - rMeasured;
  const relPct = (residual / rMeasured) * 100;
  const belowEnvelope = residual < -1e-12;
  const nWindowsGeom = windowCount(m.Tc); // recovered from the tiling geometry
  const relErr = Math.abs(residual) / rMeasured; // |residual| / r
  const nwCrossover = belowEnvelope ? 2 / (relErr * relErr) : null; // imp-96071 crossover
  const sigmaSampling = Math.sqrt(2 / m.nWindowsBaked); // chi-square relative sampling error on r
  const zScore = belowEnvelope ? relErr / sigmaSampling : null; // dip in units of sampling error
  const significant = belowEnvelope ? m.nWindowsBaked > nwCrossover : null; // z >= 1 iff n_w > crossover
  return {
    Tc: m.Tc,
    measuredRatio: rMeasured,
    envelopeRatio: rCap,
    residual,
    relPct,
    belowEnvelope,
    nWindowsBaked: m.nWindowsBaked,
    nWindowsGeom,
    nwCrossover,
    sigmaSampling,
    zScore,
    significant,
  };
});

const belowRows = rows.filter((r) => r.belowEnvelope);
const geomMatchesBaked = rows.every((r) => r.nWindowsGeom === r.nWindowsBaked);
const significantHeights = belowRows.filter((r) => r.significant).map((r) => r.Tc);
const noiseHeights = belowRows.filter((r) => !r.significant).map((r) => r.Tc);

export const IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT = {
  ticket: 'imp-96089',
  source:
    'imp-96071 sub-gap (imp-96071-window-count): the final significant-vs-noise verdict at the below-envelope mean-anchor heights (T = 1e4 crossover ~537, T = 1.5e5 crossover ~79) needs the actual per-height quasi-independent window count n_w(T) from the imp-95562 windowing. This module recovers n_w(T) from the deterministic tiling geometry (no zeros bundle) and decides each dip. Measurements: the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  definitions: {
    windowCount: 'n_w(T) = floor((min(1.3T, T_max) - 0.7T) / (2 * Delta(T))), Delta = sqrt(T/2pi), T_max ~ 600269.68: the imp-95562 non-overlapping hard-box tiling count across the +/-30 percent span clipped to the ordinate ceiling -- deterministic geometry, no zeros',
    nwCrossover: 'n_w_crossover(T) = 2 / (|residual|/r)^2: the imp-96071 window count below which a chi-square sqrt(2/n_w) sampling error keeps the dip within 1 sigma',
    zScore: 'z(T) = (|residual|/r) / sqrt(2 / n_w): the below-envelope dip in units of the chi-square sampling error; SIGNIFICANT iff z >= 1 (i.e. n_w > n_w_crossover)',
  },
  meanAnchor: C0_mean,
  windowCountRecovery: {
    spanFraction: SPAN_FRACTION,
    geomMatchesBaked, // floor(0.6 T / 2 Delta) reproduces the imp-95562 nWindows exactly
    perHeight: rows.map((r) => ({ Tc: r.Tc, nWindowsGeom: r.nWindowsGeom, nWindowsBaked: r.nWindowsBaked })),
  },
  rows,
  belowEnvelopeVerdict: belowRows.map((r) => ({
    Tc: r.Tc,
    relPct: r.relPct,
    nWindows: r.nWindowsBaked,
    nwCrossover: r.nwCrossover,
    zScore: r.zScore,
    verdict: r.significant ? 'SIGNIFICANT' : 'NOISE',
  })),
  significantHeights, // [1.5e5]: the deepest dip is real
  noiseHeights, // [1e4, 3e5]: within the number-variance noise floor
  caveat:
    'The chi-square sqrt(2/n_w) is the first-order variance-estimator sampling model and z >= 1 is a 1-sigma threshold, so T = 1.5e5 at ~1.9 sigma is significant but not overwhelming. Any true de-correlation of the non-overlapping hard boxes lowers the effective n_w, which can only shrink z (push toward noise): it leaves T = 1e4 and T = 3e5 firmly noise and would need an implausible ~73 percent window loss to flip T = 1.5e5, so the qualitative verdict is stable. Measurement/assessment only.',
  verdict:
    'The imp-96071-window-count sub-gap is CLOSED import-light: n_w(T) = floor(0.6 T / 2 Delta) reproduces the imp-95562 tiling counts exactly (75, 291, 411 at T = 1e4, 1.5e5, 3e5), so the window count was deterministic geometry all along -- no zeros bundle needed. Of the contested dips, T = 1e4 (-6.1 percent, n_w 75 << crossover 537, z 0.37 sigma) is NOISE and T = 1.5e5 (-16.0 percent, n_w 291 >> crossover 79, z 1.92 sigma) is SIGNIFICANT: the deepest dip is a real ~1.9-sigma below-envelope excursion, at exactly the height where imp-96070 (LOO -19.1 percent) and imp-96071 (binding uniform correction) already flagged the mean anchor fails as a cap. T = 3e5 (-0.5 percent, z 0.08 sigma) is unambiguously noise. So the dead-zone r_cap < 1 headline must keep resting on the out-of-sample-safer imp-95722 max anchor. Changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  // mean anchor reproduces imp-96049/imp-96071
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96089: C0_mean drifted from imp-96071');
  // window count recovered from geometry matches the imp-95562 baked count at every height
  if (!geomMatchesBaked) throw new Error('imp-96089: geometric window count does not match imp-95562 nWindows');
  if (at(1.0e4).nWindowsGeom !== 75) throw new Error('imp-96089: T = 1e4 recovered window count not 75');
  if (at(1.5e5).nWindowsGeom !== 291) throw new Error('imp-96089: T = 1.5e5 recovered window count not 291');
  if (at(3.0e5).nWindowsGeom !== 411) throw new Error('imp-96089: T = 3e5 recovered window count not 411');
  // crossover counts reproduce imp-96071
  if (!approx(at(1.0e4).nwCrossover, 537.4, 1.0)) throw new Error('imp-96089: T = 1e4 crossover drifted from imp-96071');
  if (!approx(at(1.5e5).nwCrossover, 78.7, 0.5)) throw new Error('imp-96089: T = 1.5e5 crossover drifted from imp-96071');
  if (!(at(3.0e5).nwCrossover > 1e4)) throw new Error('imp-96089: T = 3e5 crossover should be huge');
  // three below-envelope heights (same as imp-96071)
  if (belowRows.length !== 3) throw new Error('imp-96089: below-envelope count changed from 3');
  // z-scores and the significance verdict
  if (!approx(at(1.0e4).zScore, 0.374, 5e-3)) throw new Error('imp-96089: T = 1e4 z-score drifted');
  if (!approx(at(1.5e5).zScore, 1.923, 5e-3)) throw new Error('imp-96089: T = 1.5e5 z-score drifted');
  if (at(1.0e4).significant !== false) throw new Error('imp-96089: T = 1e4 should be NOISE (n_w below crossover)');
  if (at(1.5e5).significant !== true) throw new Error('imp-96089: T = 1.5e5 should be SIGNIFICANT (n_w above crossover)');
  if (at(3.0e5).significant !== false) throw new Error('imp-96089: T = 3e5 should be NOISE');
  // exactly one significant height, and it is the deepest dip T = 1.5e5
  if (significantHeights.length !== 1 || significantHeights[0] !== 1.5e5)
    throw new Error('imp-96089: expected exactly one significant height, T = 1.5e5');
  // z >= 1 iff n_w > crossover consistency
  for (const r of belowRows)
    if (r.significant !== r.zScore >= 1) throw new Error('imp-96089: significance/z-score threshold inconsistent');
  // honesty gates
  if (!/NO QED/.test(IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT.verdict))
    throw new Error('imp-96089: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT.verdict))
    throw new Error('imp-96089: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT;
