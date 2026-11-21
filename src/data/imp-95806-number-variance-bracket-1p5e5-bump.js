/**
 * imp-95806 -- BRACKETING re-measurement of the imp-95710/imp-95787 T = 1.5e5 bump.
 *
 * The single T = 1.5e5 height drives the imp-95722/imp-95787 max-based windowing
 * offset C0 = 0.3337 (its per-height offset 0.3337 vs the 0.2618 six-height mean) and
 * pins the imp-95783 s = 1 touch. imp-95710 first flagged it as a non-monotone upward
 * bump in the number-variance ratio (r = 0.462 there, vs the ~0.40 band). Is that bump a
 * genuine finite-height feature (elevated across a neighbourhood of heights) or a
 * windowing/sampling artifact (isolated to the single sampled height)? A single sampled
 * height cannot tell them apart; a CLUSTER of nearby heights can.
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). Re-measure the imp-95562
 * pointwise number-variance ratio at nine centres bracketing 1.5e5 -- 7.0e4, 1.0e5,
 * 1.2e5, 1.35e5, 1.5e5, 1.65e5, 1.8e5, 2.0e5, 3.0e5 -- using the SAME windowing
 * (non-overlapping windows of half-width Delta = sqrt(T/2pi) tiled across +/-30% of each
 * centre) over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js. The offline run
 * tmp/imp-95806-bracket-1p5e5.mjs reproduces the three baked imp-95562 heights it shares
 * (7e4 -> sd 0.5689, 1.5e5 -> sd 0.6714, 3e5 -> sd 0.6199) to the printed precision, so
 * the six INTERIOR probes are directly comparable. Only the nine measured sd(C - E)
 * literals are baked; every derived quantity is recomputed here from the closed forms.
 *
 * FINDINGS.
 *  1. The T = 1.5e5 bump is ISOLATED. Its var-ratio r = 0.4627 stands strictly above
 *     every bracketing height: the eight neighbours in [7e4, 3e5] sit at r in
 *     [0.3364, 0.3838] and the six interior probes in [1.0e5, 2.0e5] (excluding 1.5e5)
 *     average r = 0.3547. The peak is 1.305x that bracket mean.
 *  2. The IMMEDIATE neighbours show NO elevation: 1.35e5 gives r = 0.3514 and 1.65e5
 *     gives r = 0.3461, both squarely in the baseline band and BELOW the six-height
 *     mean. A genuine finite-height feature would raise a neighbourhood; a lone spike
 *     flanked by baseline values is the signature of a sampling/windowing artifact.
 *  3. The per-height windowing offset behaves the same way: offset(1.5e5) = 0.3338 is the
 *     cluster maximum, while every bracketing offset sits in [0.2073, 0.2495]. So the
 *     imp-95722 max-based C0 = 0.3337 is pinned by this single artifact height, exactly as
 *     imp-95787 inferred -- and the local windowing correction typical of the region is
 *     ~0.23, near the imp-95787 six-height MEAN, not the max.
 *  4. ROBUSTNESS OF THE ANCHOR. Because the max-based C0 is an upper envelope, pinning it
 *     to an artifact only OVER-states the correction and ENLARGES the cap r_cap -- it can
 *     never falsely strengthen r_cap < 1 (imp-95787 F2). So the C0 anchor and the
 *     imp-95783 s = 1 touch are NOT robust as a genuine finite-height signal (the bump
 *     does not survive nearby re-sampling), but they remain valid CONSERVATIVELY: the
 *     true windowing correction is smaller, which only deepens the r_cap < 1 conservatism.
 *
 * VERDICT. Re-measured across a nine-height cluster bracketing T = 1.5e5 with the same
 * imp-95562 windowing over the 10^6 Odlyzko ordinates, the imp-95710/imp-95787 upward
 * bump (r = 0.4627) is ISOLATED to the single sampled height: its immediate neighbours
 * 1.35e5 (r = 0.3514) and 1.65e5 (r = 0.3461) show no elevation, and the six interior
 * probes average r = 0.3547 (peak/mean = 1.305). It is therefore a windowing/sampling
 * artifact, NOT a genuine finite-height feature. Consequently the imp-95722 max-based
 * C0 = 0.3337 and the imp-95783 s = 1 touch are pinned by an artifact height and are NOT
 * robust as a finite-height signal; but since the max is an upper envelope, this only means
 * the true local windowing correction is smaller (~0.23, near the imp-95787 six-height
 * mean), so the C0 over-estimate errs conservative and the r_cap < 1 conservatism is
 * unweakened. Measurement only; the Selberg leading log log cap is unconditional; changes
 * no bound; NO QED; no refereed bound is changed; the zero-side route stays
 * PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. Only the nine sd(C - E) literals are
 * measured (offline over the verified ordinates); every derived quantity is recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Baked from tmp/imp-95806-bracket-1p5e5.mjs over the 10^6 Odlyzko ordinates. The three
// heights shared with imp-95562 (7e4, 1.5e5, 3e5) reproduce the baked sd values exactly.
const PEAK_T = 1.5e5;
const MEASURED = [
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 }, // imp-95562 shared -> matches
  { Tc: 1.0e5, sdDiscrepancy: 0.6037 },
  { Tc: 1.2e5, sdDiscrepancy: 0.5685 },
  { Tc: 1.35e5, sdDiscrepancy: 0.5832 }, // immediate lower neighbour of the bump
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 }, // the imp-95710/imp-95787 bump -> matches imp-95562
  { Tc: 1.65e5, sdDiscrepancy: 0.5825 }, // immediate upper neighbour of the bump
  { Tc: 1.8e5, sdDiscrepancy: 0.5951 },
  { Tc: 2.0e5, sdDiscrepancy: 0.5900 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 }, // imp-95562 shared -> matches
];

const ROWS = MEASURED.map((m) => {
  const L = envelopeCount(m.Tc);
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  return {
    Tc: m.Tc,
    meanLocalCountL: L,
    measuredVariance: measuredVar,
    varRatioMeasuredOverGUE: measuredVar / gueNumberVariance(L), // r(T)
    windowingOffset: measuredVar - SELBERG_C * logLog(m.Tc), // imp-95787 per-height offset
  };
});

const peakRow = ROWS.find((r) => r.Tc === PEAK_T);
// interior bracketing probes: everything in [1e5, 2e5] except the peak itself
const bracket = ROWS.filter((r) => r.Tc >= 1.0e5 && r.Tc <= 2.0e5 && r.Tc !== PEAK_T);
const bracketMeanRatio = bracket.reduce((s, r) => s + r.varRatioMeasuredOverGUE, 0) / bracket.length;
const bracketMaxRatio = Math.max(...bracket.map((r) => r.varRatioMeasuredOverGUE));
const bracketMaxOffset = Math.max(...bracket.map((r) => r.windowingOffset));
const peakOverBracketMean = peakRow.varRatioMeasuredOverGUE / bracketMeanRatio;
const peakIsIsolated = peakRow.varRatioMeasuredOverGUE > bracketMaxRatio;

// immediate neighbours flanking the bump
const lowerNeighbour = ROWS.find((r) => r.Tc === 1.35e5);
const upperNeighbour = ROWS.find((r) => r.Tc === 1.65e5);

export const IMP95806_NUMBER_VARIANCE_BRACKET_1P5E5_BUMP = {
  ticket: 'imp-95806',
  source:
    'imp-95710 F1 (non-monotone upward bump at T = 1.5e5) + imp-95787 (that bump pins the max-based C0 = 0.3337) + imp-95783 (its s = 1 touch). The nine sd(C - E) values are measured offline (tmp/imp-95806-bracket-1p5e5.mjs) over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js with the imp-95562 windowing; the GUE/Selberg forms are re-derived here.',
  definitions: {
    varRatio: 'r(T) = sd(C - E)^2 / Sigma^2(L): measured pointwise number variance over the GUE asymptote',
    windowingOffset: 'offset(T) = sd(C - E)^2 - (1/2pi^2) log log(T/2pi): the imp-95787 per-height windowing correction',
    bracket: 'the six interior probes in [1.0e5, 2.0e5] excluding the peak at 1.5e5',
    envelope: 'L = 2 Delta delta(T), Delta = sqrt(T/2pi), delta(T) = (1/2pi) log(T/2pi)',
  },
  peakT: PEAK_T,
  rows: ROWS,
  decision: {
    peakVarRatio: peakRow.varRatioMeasuredOverGUE, // 0.4627
    peakOffset: peakRow.windowingOffset, // 0.3338 -> the C0 anchor
    lowerNeighbourVarRatio: lowerNeighbour.varRatioMeasuredOverGUE, // 0.3514 (1.35e5)
    upperNeighbourVarRatio: upperNeighbour.varRatioMeasuredOverGUE, // 0.3461 (1.65e5)
    bracketMeanRatio, // 0.3547
    bracketMaxRatio, // 0.3838
    bracketMaxOffset, // 0.2495
    peakOverBracketMean, // 1.305
    peakIsIsolated, // true: the peak exceeds every bracketing height
    isArtifact: peakIsIsolated, // isolated single-height spike = windowing/sampling artifact
    c0PinnedByArtifact: peakRow.windowingOffset > bracketMaxOffset, // true: C0 = 0.3337 comes from the artifact height
    typicalLocalOffset: bracketMaxOffset, // ~0.23-0.25, near the imp-95787 six-height mean 0.2618
  },
  verdict:
    'Re-measured across a nine-height cluster bracketing T = 1.5e5 with the same imp-95562 windowing over the 10^6 Odlyzko ordinates, the imp-95710/imp-95787 upward bump (r = 0.4627) is ISOLATED to the single sampled height: its immediate neighbours 1.35e5 (r = 0.3514) and 1.65e5 (r = 0.3461) show no elevation, and the six interior probes average r = 0.3547 (peak/mean = 1.305, peak strictly above every bracketing height). It is therefore a windowing/sampling artifact, NOT a genuine finite-height feature. Consequently the imp-95722 max-based C0 = 0.3337 and the imp-95783 s = 1 touch are pinned by this artifact height and are NOT robust as a finite-height signal; but since the max is an upper envelope, this only means the true local windowing correction is smaller (~0.23, near the imp-95787 six-height mean 0.2618), so the C0 over-estimate errs conservative and the r_cap < 1 conservatism is unweakened. Measurement only; the Selberg leading log log cap is unconditional; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the shared imp-95562 heights reproduce their baked var-ratios (method consistency)
  if (!approx(peakRow.varRatioMeasuredOverGUE, 0.4627, 2e-3))
    throw new Error('imp-95806: peak var-ratio drifted from the imp-95710 0.462 bump');
  if (!approx(peakRow.windowingOffset, 0.3337, 2e-3))
    throw new Error('imp-95806: peak offset drifted from the imp-95787 C0 = 0.3337');
  // the whole finding: the peak is ISOLATED (strictly above every bracketing height)
  if (!peakIsIsolated) throw new Error('imp-95806: peak not isolated -- re-check the bracketing measurement');
  // both immediate neighbours sit in the baseline band, below the peak by a clear margin
  if (!(lowerNeighbour.varRatioMeasuredOverGUE < 0.40 && upperNeighbour.varRatioMeasuredOverGUE < 0.40))
    throw new Error('imp-95806: an immediate neighbour is elevated -- bump may not be isolated');
  // the peak is materially above the bracket mean (artifact spike, not baseline noise)
  if (!(peakOverBracketMean > 1.2)) throw new Error('imp-95806: peak/bracketMean too small for an isolated spike');
  // C0 = 0.3337 is pinned by the artifact height, not the neighbourhood
  if (!(peakRow.windowingOffset > bracketMaxOffset))
    throw new Error('imp-95806: C0 no longer pinned by the peak -- re-derive the offsets');
  // every bracketing var-ratio stays strictly below the GUE asymptote 1 (finite-height suppression intact)
  for (const r of ROWS) if (!(r.varRatioMeasuredOverGUE > 0 && r.varRatioMeasuredOverGUE < 1))
    throw new Error('imp-95806: a var ratio left (0,1)');
  // honesty gates
  if (!/NO QED/.test(IMP95806_NUMBER_VARIANCE_BRACKET_1P5E5_BUMP.verdict))
    throw new Error('imp-95806: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95806_NUMBER_VARIANCE_BRACKET_1P5E5_BUMP.verdict))
    throw new Error('imp-95806: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95806_NUMBER_VARIANCE_BRACKET_1P5E5_BUMP;
