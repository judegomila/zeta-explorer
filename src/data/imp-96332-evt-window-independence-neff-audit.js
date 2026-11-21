/**
 * imp-96332 -- Auditing the imp-96271 window-independence assumption: does the
 * Gaussian-tail (extreme-value) conclusion survive an effective-sample-size correction?
 *
 * THE ASSUMPTION UNDER AUDIT. imp-96271 tests whether the imp-95562 worst single-window
 * excess is Gaussian-tailed by comparing the observed worstSigma = maxPosExcess/sdDiscrepancy
 * at six heights against the maximum of nWindows i.i.d. standard Gaussians (classical Gumbel
 * extreme-value law), reporting z = (worstSigma - E[max])/sd[max]. That comparison uses the
 * RAW nWindows as the batch size -- i.e. it assumes the per-window discrepancies D = C - E are
 * genuinely non-overlapping and effectively independent. This module checks that assumption and
 * re-runs the z comparison with an effective independent sample count n_eff.
 *
 * WHAT THE MEASURED LAG-1 CORRELATION SAYS (imp-96171). imp-96171 measured the sample lag-1
 * autocorrelation of the per-window (C - E) sequence on the actual Riemann zeros at the
 * significant height T = 1.5e5, under both tilings:
 *   (a) the imp-95562 RAW variable-width tiling (the one imp-95562/imp-96271 use): r1 = +0.2432
 *       -- a POSITIVE lag-1 correlation that imp-96171 identifies as a box-OVERLAP ARTIFACT
 *       (above the center height the fixed step 2 Delta(Tc) is shorter than the local box width
 *       2 Delta(t), so adjacent boxes share zeros);
 *   (b) a CLEAN unfolded edge-to-edge tiling (no overlap): r1 = -0.5126 -- strongly ANTI-
 *       correlated, matching the exact GUE two-interval proxy rho_exact = -0.46398.
 * So the windows are NOT exactly independent: the raw tiling is positively correlated (artifact),
 * and the true (clean) correlation is negative. Either way the iid assumption is not exact.
 *
 * THE CORRECTION. Map a lag-1 correlation r1 to an effective sample count with the standard
 * AR(1) variance-based factor n_eff = n (1 - r1)/(1 + r1), then feed n_eff (not the raw nWindows)
 * into the same Gumbel closed forms imp-96271 uses (E[max] = bN + gamma_E aN, bN = sqrt(2 ln n)
 * - (ln ln n + ln 4pi)/(2 sqrt(2 ln n)), aN = 1/sqrt(2 ln n), sd[max] = (pi/sqrt6) aN) and
 * recompute z. Positive r1 shrinks the batch (n_eff < n), lowering E[max] and pushing z UP;
 * negative r1 inflates it (n_eff > n), pushing z DOWN.
 *   raw   r1 = +0.2432 -> factor 0.6087 -> n_eff ~ 0.61 n;
 *   clean r1 = -0.5126 -> factor 3.1035 -> n_eff ~ 3.10 n.
 *
 * FINDING. The Gaussian-tail conclusion SURVIVES the effective-sample-size correction under both
 * measured lag-1 values. With the raw (overlap-artifact) r1, the z range moves from imp-96271's
 * [-1.10, +1.85] to [-0.66, +2.13]: the smallest-batch height (T = 1e4) nudges just past +2 to
 * z = +2.13 but stays inside imp-96271's +/-2.5 Gumbel-sd envelope. With the clean anti-correlated
 * r1, the range moves to [-2.18, +1.09]: the T = 1.5e5 height dips just past -2 to z = -2.18, but a
 * NEGATIVE z means the observed worst window sits BELOW the expected batch maximum -- conservative,
 * not an anomalous spike. No height, under either correlation, exceeds the +/-2.5 Gumbel-sd EV
 * envelope. The "Gaussian-tailed, no anomalous pointwise spikes" verdict is robust to the
 * independence correction.
 *
 * TWO HONEST CAVEATS.
 *  1. r1 is measured only at T = 1.5e5 (imp-96171 ran the lag-1 diagnostic at that one height).
 *     Here the SAME r1 is applied as a representative correlation to every height's nWindows;
 *     the per-height lag-1 correlation is NOT separately measured. SUB-GAP: measure r1 at each of
 *     the six imp-95562 heights to make the n_eff-per-height correction fully height-resolved.
 *  2. The AR(1) n_eff = n(1-r1)/(1+r1) is a VARIANCE-based effective count; it over-states the
 *     effect of short-range correlation on EXTREMES. For a stationary Gaussian sequence with
 *     r_k -> 0 the extremal index is theta = 1 (Berman): the maximum is asymptotically distributed
 *     as the max of n i.i.d. Gaussians regardless of short-range correlation, so n_eff = n is the
 *     asymptotically correct batch size for the MAXIMUM and the AR(1) correction here is a
 *     conservative finite-n bracket, not the sharp extreme-value adjustment. The true effect on z
 *     is smaller than the raw-artifact column suggests.
 *
 * NET. imp-96271's window-independence assumption is not exactly satisfied -- the raw imp-95562
 * tiling is positively (artifactually) correlated and the true tiling is anti-correlated -- but the
 * Gaussian-tail extreme-value conclusion is insensitive to the correction: every height stays
 * within the +/-2.5 Gumbel-sd envelope under both the raw-artifact and clean-tiling lag-1 values.
 * Assumption audit / measurement only; uses baked imp-95562 + imp-96171 literals; changes no bound;
 * NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. The imp-95562 per-height literals and the
 * imp-96171 lag-1 correlations are baked; the Gumbel closed forms and n_eff correction are
 * re-derived here from the formulas above.
 * @see imp-96271-worst-excess-evt-gaussianity (the EVT comparison whose iid assumption this audits)
 * @see imp-96171-number-variance-empirical-lag1-vs-gue-proxy (the measured lag-1 correlations)
 * @see imp-95562-meansquare-vs-pointwise-gap (the tiling and per-window discrepancy sequence)
 */

const EULER = 0.5772156649015329;

// Baked imp-95562 per-height literals (same as imp-96271 uses).
const IMP95562 = [
  { Tc: 1.0e4, nWindows: 75, maxPosExcess: 2.028, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, nWindows: 130, maxPosExcess: 1.494, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, nWindows: 198, maxPosExcess: 1.397, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, nWindows: 291, maxPosExcess: 1.669, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, nWindows: 411, maxPosExcess: 1.939, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, nWindows: 443, maxPosExcess: 1.752, sdDiscrepancy: 0.6078 },
];

// imp-96171 measured lag-1 correlations of the per-window (C - E) sequence at T = 1.5e5.
const R1_RAW = 0.243202; // imp-95562 raw variable-width tiling -- POSITIVE box-overlap artifact
const R1_CLEAN = -0.512617; // clean unfolded edge-to-edge tiling -- GUE anti-correlation

// AR(1) variance-based effective-sample factor: n_eff = n (1 - r1)/(1 + r1).
const neffFactor = (r1) => (1 - r1) / (1 + r1);
const FACTOR_RAW = neffFactor(R1_RAW); // 0.6087
const FACTOR_CLEAN = neffFactor(R1_CLEAN); // 3.1035

// Gumbel closed forms for the maximum of n i.i.d. standard Gaussians (identical to imp-96271).
const evtLeading = (n) => Math.sqrt(2 * Math.log(n));
const evtScale = (n) => 1 / evtLeading(n);
const evtLocation = (n) => {
  const b0 = evtLeading(n);
  return b0 - (Math.log(Math.log(n)) + Math.log(4 * Math.PI)) / (2 * b0);
};
const evtExpectedMax = (n) => evtLocation(n) + EULER * evtScale(n);
const evtMaxSd = (n) => (Math.PI / Math.sqrt(6)) * evtScale(n);
const zOf = (worstSigma, n) => (worstSigma - evtExpectedMax(n)) / evtMaxSd(n);

const ROWS = IMP95562.map((m) => {
  const worstSigma = m.maxPosExcess / m.sdDiscrepancy;
  const nEffRaw = m.nWindows * FACTOR_RAW;
  const nEffClean = m.nWindows * FACTOR_CLEAN;
  return {
    Tc: m.Tc,
    nWindows: m.nWindows,
    worstSigma,
    zRawIid: zOf(worstSigma, m.nWindows), // imp-96271 original z (n_eff = nWindows)
    nEffRawTiling: nEffRaw, // n_eff under the raw-tiling r1 = +0.2432 artifact
    zNeffRawTiling: zOf(worstSigma, nEffRaw), // z with the positive-correlation n_eff
    nEffCleanTiling: nEffClean, // n_eff under the clean-tiling r1 = -0.5126
    zNeffCleanTiling: zOf(worstSigma, nEffClean), // z with the anti-correlation n_eff
  };
});

const within = (r) =>
  Math.abs(r.zNeffRawTiling) < 2.5 && Math.abs(r.zNeffCleanTiling) < 2.5;
const allWithinEnvelope = ROWS.every(within);
const zNeffRawRange = {
  min: Math.min(...ROWS.map((r) => r.zNeffRawTiling)),
  max: Math.max(...ROWS.map((r) => r.zNeffRawTiling)),
};
const zNeffCleanRange = {
  min: Math.min(...ROWS.map((r) => r.zNeffCleanTiling)),
  max: Math.max(...ROWS.map((r) => r.zNeffCleanTiling)),
};

export const IMP96332_EVT_WINDOW_INDEPENDENCE_NEFF_AUDIT = {
  ticket: 'imp-96332',
  source:
    'imp-96271-worst-excess-evt-gaussianity.js (batch-of-n-Gaussians EVT model, raw nWindows) audited against the imp-96171-measured lag-1 autocorrelation of the imp-95562 per-window (C - E) sequence; baked imp-95562 and imp-96171 literals.',
  significantHeightForR1: 1.5e5,
  lag1Correlations: {
    rawTiling: R1_RAW, // +0.2432 -- imp-95562 tiling, positive OVERLAP ARTIFACT
    cleanTiling: R1_CLEAN, // -0.5126 -- clean edge-to-edge, GUE anti-correlation
    neffFactorRaw: FACTOR_RAW, // (1-r1)/(1+r1) = 0.6087 -> n_eff ~ 0.61 n
    neffFactorClean: FACTOR_CLEAN, // 3.1035 -> n_eff ~ 3.10 n
  },
  definitions: {
    nEff: 'n_eff = n (1 - r1)/(1 + r1) -- AR(1) variance-based effective independent sample count',
    z: '(worstSigma - E[max_{n_eff}]) / sd[max_{n_eff}] -- Gumbel deviation using n_eff not raw nWindows',
    envelope: '|z| < 2.5 Gumbel sd -- the imp-96271 extreme-value consistency envelope',
  },
  rows: ROWS,
  aggregates: {
    zNeffRawTilingRange: zNeffRawRange, // [-0.66, +2.13] under the positive-artifact n_eff
    zNeffCleanTilingRange: zNeffCleanRange, // [-2.18, +1.09] under the anti-correlation n_eff
    allWithinEvtEnvelope: allWithinEnvelope, // every height |z| < 2.5 under BOTH corrections
  },
  subGap:
    'The lag-1 correlation r1 is measured (imp-96171) only at T = 1.5e5 and applied here as a representative value at every height; the per-height r1 -- and hence a fully height-resolved n_eff -- is not separately measured. Measuring r1 at each of the six imp-95562 heights would close this.',
  extremalIndexCaveat:
    'The AR(1) n_eff = n(1-r1)/(1+r1) is a VARIANCE-based count and over-states the correlation effect on EXTREMES. A stationary Gaussian sequence with r_k -> 0 has extremal index theta = 1 (Berman): its maximum is asymptotically distributed as the max of n i.i.d. Gaussians regardless of short-range correlation, so n_eff = n is the asymptotically correct batch size for the maximum and this AR(1) correction is a conservative finite-n bracket, not the sharp extreme-value adjustment.',
  verdict:
    'The imp-96271 window-independence assumption is not exactly satisfied: the raw imp-95562 tiling carries a POSITIVE lag-1 correlation r1 = +0.2432 (an overlap artifact, imp-96171) and the true clean tiling is ANTI-correlated (r1 = -0.5126). Re-running the extreme-value z comparison with an AR(1) effective sample count n_eff = n(1-r1)/(1+r1) instead of the raw nWindows leaves the Gaussian-tail conclusion intact under BOTH measured correlations: the raw-artifact n_eff (~0.61 n) moves the z range to [-0.66, +2.13] and the clean-tiling n_eff (~3.10 n) moves it to [-2.18, +1.09], with every height staying inside imp-96271 +/-2.5 Gumbel-sd envelope. The lone crossings past +/-2 are the smallest-batch height (T = 1e4, z = +2.13, a routine tail draw for a small batch) and the T = 1.5e5 height (z = -2.18, i.e. BELOW the expected maximum -- conservative, not a spike). The extreme-value conclusion is robust to the effective-sample-size correction. Assumption audit / measurement only; uses baked imp-95562 and imp-96171 literals; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated regardless.',
};

// --- self-executing internal-consistency assertions (re-derivation only; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // AR(1) factor sanity: positive r1 shrinks the batch, negative r1 inflates it
  if (!(FACTOR_RAW < 1)) throw new Error('imp-96332: positive r1 should give n_eff < n');
  if (!(FACTOR_CLEAN > 1)) throw new Error('imp-96332: negative r1 should give n_eff > n');
  if (!approx(FACTOR_RAW, 0.6087, 1e-3)) throw new Error('imp-96332: raw n_eff factor drifted');
  if (!approx(FACTOR_CLEAN, 3.1035, 1e-3)) throw new Error('imp-96332: clean n_eff factor drifted');
  // spot-check a z re-derivation against the recorded literals (T = 1e4 raw-tiling n_eff)
  if (!approx(ROWS[0].zNeffRawTiling, 2.1306, 1e-3)) throw new Error('imp-96332: z(n_eff raw) re-derivation mismatch');
  if (!approx(ROWS[3].zNeffCleanTiling, -2.1779, 1e-3)) throw new Error('imp-96332: z(n_eff clean) re-derivation mismatch');
  // positive-correlation n_eff pushes z UP relative to the iid baseline; anti-correlation pushes DOWN
  for (const r of ROWS) {
    if (!(r.zNeffRawTiling > r.zRawIid - 1e-9)) throw new Error('imp-96332: raw-tiling n_eff should not lower z below iid');
    if (!(r.zNeffCleanTiling < r.zRawIid + 1e-9)) throw new Error('imp-96332: clean-tiling n_eff should not raise z above iid');
  }
  // CORE FINDING: the Gaussian-tail conclusion survives -- every height within the +/-2.5 envelope under both
  if (!allWithinEnvelope) throw new Error('imp-96332: a height left the +/-2.5 Gumbel-sd envelope under the n_eff correction');
  // the raw-artifact range and clean range bracket the reported values
  if (!approx(zNeffRawRange.max, 2.1306, 1e-3)) throw new Error('imp-96332: raw-tiling zmax drifted');
  if (!approx(zNeffCleanRange.min, -2.1779, 1e-3)) throw new Error('imp-96332: clean-tiling zmin drifted');
  // honesty gates: assumption audit, not a bound change
  if (!/NO QED/.test(IMP96332_EVT_WINDOW_INDEPENDENCE_NEFF_AUDIT.verdict))
    throw new Error('imp-96332: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96332_EVT_WINDOW_INDEPENDENCE_NEFF_AUDIT.verdict))
    throw new Error('imp-96332: verdict dropped the no-refereed-bound-change banner');
  if (!/theta = 1/.test(IMP96332_EVT_WINDOW_INDEPENDENCE_NEFF_AUDIT.extremalIndexCaveat))
    throw new Error('imp-96332: extremal-index caveat dropped');
})();

export default IMP96332_EVT_WINDOW_INDEPENDENCE_NEFF_AUDIT;
