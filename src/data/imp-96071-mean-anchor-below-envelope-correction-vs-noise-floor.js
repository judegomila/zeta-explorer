/**
 * imp-96071 -- ASSESSING the two significant below-envelope heights of the imp-96049 mean-anchor
 * residual band: does a minimal r_cap correction restore all-positive slack, or do the dips fall
 * within the number-variance sampling noise floor?
 *
 * imp-96049 finding 3 showed the MEAN offset anchor loses uniform conservatism over the six-height
 * overlap: three of six heights sit BELOW the envelope, residual(T) = r_cap(T) - r(T) < 0, at
 * T = 1e4 (-0.0293, -6.1 percent), T = 1.5e5 (-0.0737, -16.0 percent, deepest = the former
 * max-anchor touch point), and T = 3e5 (-0.0020, -0.5 percent). This module answers imp-96049
 * caveat by asking two concrete questions the finding left open:
 *   (Q1) what is the MINIMAL additive r_cap correction delta_C0 that restores residual >= 0 at all
 *        six heights, and how large is it?
 *   (Q2) how big would the per-height sampling noise floor have to be for each dip to be within
 *        1 sigma of the measurement, i.e. NOT significant?
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). The SAME six imp-95562 measured
 * sd(C - E) literals and the identical closed-form r_cap(T) / offset(T) as imp-96049 are re-derived
 * verbatim here, so this module stands alone.
 *
 *  (Q1, EXACT). To make residual(T) = (SELBERG_C loglog(T) + C0) / gueVar(T) - r(T) >= 0 at a given
 *    height requires C0 >= offset(T) (offset(T) is by construction the C0 that zeros the residual
 *    there). Hence the minimal UNIFORM anchor that restores non-negativity at all six is exactly
 *    C0 = max(offsets) = C0_max, and the minimal additive correction to the mean anchor is
 *    delta_C0 = C0_max - C0_mean, binding at the argmax height T = 1.5e5. So restoring conservatism
 *    is NOT a small local tweak: it reverts precisely to the imp-95722 max anchor. Per-height bumps
 *    deltaNeeded(T) = offset(T) - C0_mean are reported (T = 1.5e5 is the largest = delta_C0).
 *
 *  (Q2, NOISE FLOOR, threshold form). Treat the measured number variance as a chi-square-type
 *    estimator: from n_w quasi-independent windows the relative sampling error of the variance
 *    (hence of the ratio r) is ~ sqrt(2 / n_w). A dip is within 1 sigma of the measurement iff
 *    sqrt(2 / n_w) >= |residual| / r, i.e. iff n_w <= n_w_crossover(T) = 2 / (|residual| / r)^2.
 *    Below that window count the dip is statistical noise; above it, real. We report the crossover
 *    window count per below-envelope height WITHOUT assuming a specific n_w (the actual per-height
 *    quasi-independent window count is not available import-light -- see SUB-GAP).
 *
 * FINDINGS.
 *  1. (Q1) The minimal uniform correction is delta_C0 = C0_max - C0_mean = 0.07188, a +27.5 percent
 *     bump on C0_mean = 0.26184, binding at T = 1.5e5 (deltaNeeded = 0.07188 there = the full gap).
 *     T = 1e4 needs only +0.02359 (+9.0 percent) and T = 3e5 only +0.00201 (+0.8 percent), but the
 *     deepest dip forces the uniform correction, which is exactly the max anchor. There is NO small
 *     correction that restores all-positive slack short of reverting to C0_max.
 *  2. (Q2) Noise-floor crossover window counts: T = 3e5 crosses at n_w ~ 73194 -- effectively any
 *     realistic sampling puts its -0.5 percent dip WELL within the noise floor (not significant).
 *     T = 1e4 crosses at n_w ~ 537: within noise only if fewer than ~540 quasi-independent windows
 *     were sampled there. T = 1.5e5 crosses at n_w ~ 79: the deepest dip is the LEAST dismissible as
 *     noise -- it stays within 1 sigma only if fewer than ~79 windows were sampled.
 *  3. Ordering the dips by dismissibility-as-noise: T = 3e5 (trivially noise) >> T = 1e4 (noise iff
 *     n_w < 537) >> T = 1.5e5 (noise iff n_w < 79). So the significant/not verdict at T = 1e4 and
 *     T = 1.5e5 hinges entirely on the actual window count, which this import-light module cannot
 *     recover -- the SUB-GAP below.
 *
 * SUB-GAP (imp-96071-window-count). The final significant-vs-noise verdict at T = 1e4 and T = 1.5e5
 * requires the actual per-height quasi-independent window count n_w(T) used to form the imp-95562
 * sd(C - E) measurement over the 10^6 Odlyzko ordinates (src/data/zeros-to-1e6.js). Recover n_w(T)
 * from the windowing (roughly ordinate-range / L(T), with a de-correlation factor), then compare to
 * the crossover counts 537 (T = 1e4) and 79 (T = 1.5e5). That measurement needs the zeros bundle and
 * is deferred to keep this module import-light.
 *
 * HONEST CAVEAT. The chi-square sqrt(2 / n_w) relative error is the standard first-order sampling
 * model for a variance estimator; the true de-correlation of overlapping GUE windows would inflate
 * the effective error (fewer independent windows), which only makes the dips EASIER to dismiss as
 * noise, not harder -- so the crossover counts are conservative upper bounds on when a dip becomes
 * real. This is measurement/assessment only.
 *
 * VERDICT. The minimal r_cap correction that restores all-positive slack is delta_C0 = 0.07188
 * (+27.5 percent of C0_mean), binding at T = 1.5e5 and exactly recovering the max anchor -- there is
 * no small local correction. Of the two significant dips, T = 1e4 (-6.1 percent) is within the noise
 * floor for any sampling with fewer than ~537 windows and T = 1.5e5 (-16.0 percent) only below ~79
 * windows, while T = 3e5 (-0.5 percent) is unambiguously noise (crossover ~73194). The final verdict
 * at the two significant heights is left as the named window-count sub-gap. Measurement only; changes
 * no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96049-number-variance-mean-anchor-six-height-residual-band (the mean-anchor residual band this refines)
 * @see imp-95946-number-variance-envelope-vs-measured-crossvalidation (the max-anchor six-height band)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same measured
 * literals imp-95710/imp-95722/imp-95946/imp-95958/imp-96049 baked; every derived quantity is
 * recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722/imp-95946/imp-95958/imp-96049 baked.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;

const C0_max = Math.max(...offsets); // imp-95722 conservative anchor (argmax at T = 1.5e5)
const C0_mean = mean(offsets); // imp-95958 tighter anchor

const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T));

// Per-height rows under the MEAN anchor, with the correction and noise-floor crossover for dips.
const rows = MEASURED.map((m, i) => {
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar; // imp-95710 r(T)
  const rCap = cappedRatio(m.Tc, C0_mean);
  const residual = rCap - rMeasured;
  const relPct = (residual / rMeasured) * 100;
  const belowEnvelope = residual < -1e-12;
  // Q1: additive C0 bump that zeros the residual at THIS height (= offset(T) - C0_mean).
  const deltaNeeded = offsets[i] - C0_mean;
  // Q2: chi-square noise-floor crossover window count -- below it the dip is within 1 sigma.
  const nwCrossover = belowEnvelope ? 2 / Math.pow(Math.abs(residual) / rMeasured, 2) : null;
  return { Tc: m.Tc, measuredRatio: rMeasured, envelopeRatio: rCap, residual, relPct, belowEnvelope, deltaNeeded, nwCrossover };
});

// Q1: minimal UNIFORM correction that restores non-negativity everywhere = max anchor.
const deltaC0Uniform = C0_max - C0_mean; // binding at the argmax height (T = 1.5e5)
const bindingRow = rows.reduce((mb, r) => (r.residual < mb.residual ? r : mb), rows[0]); // deepest dip
const belowRows = rows.filter((r) => r.belowEnvelope);

export const IMP96071_MEAN_ANCHOR_BELOW_ENVELOPE_CORRECTION_VS_NOISE_FLOOR = {
  ticket: 'imp-96071',
  source:
    'imp-96049 finding 3: under the mean offset anchor three of the six overlap heights fall below the envelope (T = 1e4 -6.1 percent, T = 1.5e5 -16.0 percent deepest, T = 3e5 -0.5 percent). This module asks whether a minimal r_cap correction restores all-positive slack and quantifies the sampling noise floor at the dips. Envelope: imp-95722 r_cap(T). Measurements: the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  definitions: {
    residual: 'residual(T) = r_cap(T) - r(T) under the mean anchor C0_mean; < 0 means below the envelope',
    deltaNeeded: 'deltaNeeded(T) = offset(T) - C0_mean: the additive C0 bump that zeros the residual at height T',
    deltaC0Uniform: 'C0_max - C0_mean: the minimal uniform additive correction restoring residual >= 0 at all six (binding at the argmax height, = reverting to the max anchor)',
    nwCrossover: 'n_w_crossover(T) = 2 / (|residual| / r)^2: the quasi-independent window count below which a chi-square sqrt(2/n_w) sampling error keeps the dip within 1 sigma (not significant)',
  },
  anchors: { C0_max, C0_mean },
  rows,
  q1_correction: {
    deltaC0Uniform,
    deltaC0UniformPctOfMean: (deltaC0Uniform / C0_mean) * 100,
    bindingHeightT: bindingRow.Tc,
    revertsToMaxAnchor: Math.abs(C0_mean + deltaC0Uniform - C0_max) < 1e-12,
    perHeightDeltaNeeded: rows.map((r) => ({ Tc: r.Tc, deltaNeeded: r.deltaNeeded })),
  },
  q2_noiseFloor: {
    belowEnvelopeHeights: belowRows.map((r) => ({ Tc: r.Tc, residual: r.residual, relPct: r.relPct, nwCrossover: r.nwCrossover })),
    note: 'A dip is within 1 sigma (not significant) iff the actual quasi-independent window count n_w(T) is at or below n_w_crossover(T). T = 3e5 crosses only above ~73194 windows so its dip is essentially always noise; T = 1e4 crosses at ~537; the deepest T = 1.5e5 crosses at ~79 and is the least dismissible as noise.',
  },
  subGap:
    'imp-96071-window-count: the final significant-vs-noise verdict at T = 1e4 (crossover ~537) and T = 1.5e5 (crossover ~79) needs the actual per-height quasi-independent window count n_w(T) from the imp-95562 windowing over the 10^6 Odlyzko ordinates. That requires the zeros bundle and is deferred to keep this module import-light.',
  caveat:
    'The chi-square sqrt(2/n_w) relative error is the first-order variance-estimator model; overlapping GUE windows de-correlate, inflating the effective error (fewer independent windows), which only makes dips EASIER to dismiss as noise -- so the crossover counts are conservative upper bounds on when a dip becomes real. Measurement/assessment only.',
  verdict:
    'The minimal r_cap correction restoring all-positive slack is delta_C0 = 0.07188 (+27.5 percent of C0_mean), binding at T = 1.5e5 and exactly recovering the max anchor -- no small local correction exists. Of the significant dips, T = 1e4 (-6.1 percent) is within the noise floor for any sampling below ~537 windows and T = 1.5e5 (-16.0 percent) only below ~79 windows, while T = 3e5 (-0.5 percent) is unambiguously noise (crossover ~73194). Final verdict at the two significant heights is the named window-count sub-gap. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // anchors reproduce imp-96049
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96071: C0_max drifted from imp-96049');
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96071: C0_mean drifted from imp-96049');
  // the mean-anchor residuals at the three below-envelope heights reproduce imp-96049 finding 3
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  if (!approx(at(1.0e4).residual, -0.0293, 1e-3)) throw new Error('imp-96071: T = 1e4 residual drifted from imp-96049 (-0.0293)');
  if (!approx(at(1.5e5).residual, -0.0737, 1e-3)) throw new Error('imp-96071: T = 1.5e5 residual drifted from imp-96049 (-0.0737)');
  if (!approx(at(3.0e5).residual, -0.0020, 1e-3)) throw new Error('imp-96071: T = 3e5 residual drifted from imp-96049 (-0.0020)');
  if (belowRows.length !== 3) throw new Error('imp-96071: below-envelope count changed from 3');
  // Q1: minimal uniform correction equals the max-mean gap and reverts to the max anchor
  if (!approx(deltaC0Uniform, 0.07187960750163974, 1e-9)) throw new Error('imp-96071: delta_C0 uniform correction drifted');
  if (!IMP96071_MEAN_ANCHOR_BELOW_ENVELOPE_CORRECTION_VS_NOISE_FLOOR.q1_correction.revertsToMaxAnchor)
    throw new Error('imp-96071: uniform correction did not revert to the max anchor');
  if (bindingRow.Tc !== 1.5e5) throw new Error('imp-96071: binding (deepest-dip) height not T = 1.5e5');
  // the binding height deltaNeeded equals the uniform correction (argmax offset)
  if (!approx(at(1.5e5).deltaNeeded, deltaC0Uniform, 1e-12)) throw new Error('imp-96071: T = 1.5e5 deltaNeeded not equal to the uniform correction');
  // Q2: noise-floor crossover window counts
  if (!approx(at(1.0e4).nwCrossover, 537.4, 1.0)) throw new Error('imp-96071: T = 1e4 crossover window count drifted');
  if (!approx(at(1.5e5).nwCrossover, 78.7, 0.5)) throw new Error('imp-96071: T = 1.5e5 crossover window count drifted');
  if (!(at(3.0e5).nwCrossover > 1e4)) throw new Error('imp-96071: T = 3e5 crossover should be huge (dip trivially within noise)');
  // ordering: deepest dip has the smallest crossover (least dismissible as noise)
  if (!(at(1.5e5).nwCrossover < at(1.0e4).nwCrossover && at(1.0e4).nwCrossover < at(3.0e5).nwCrossover))
    throw new Error('imp-96071: crossover ordering by dip depth broken');
  // honesty gates
  if (!/NO QED/.test(IMP96071_MEAN_ANCHOR_BELOW_ENVELOPE_CORRECTION_VS_NOISE_FLOOR.verdict))
    throw new Error('imp-96071: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96071_MEAN_ANCHOR_BELOW_ENVELOPE_CORRECTION_VS_NOISE_FLOOR.verdict))
    throw new Error('imp-96071: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96071_MEAN_ANCHOR_BELOW_ENVELOPE_CORRECTION_VS_NOISE_FLOOR;
