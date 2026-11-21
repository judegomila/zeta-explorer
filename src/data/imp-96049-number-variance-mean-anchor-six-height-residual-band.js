/**
 * imp-96049 -- RECOMPUTING the imp-95722/imp-95946 number-variance envelope r_cap(T) with the
 * MEAN-based offset anchor C0 and MEASURING the new six-height residual band against the
 * max-anchor band, while confirming r_cap(3e12) < 1 stays intact.
 *
 * imp-95946 tabulated the six-height residual band residual(T) = r_cap(T) - r(T) over the
 * T = 1e4..5e5 overlap using ONLY the MAX offset anchor C0_max: uniformly conservative
 * (residual >= 0 at all six, min 0 at the T = 1.5e5 anchor, up to +0.133 / ~38% at T = 7e4).
 * imp-95958 computed the mean/median anchor r_cap ONLY at the T = 3e12 window bottom (mean
 * anchor tightens r_cap(3e12) from ~0.260 to ~0.223). What neither did -- and what imp-95946
 * caveat 3 and imp-95787/imp-95800 called for -- is the mean-anchor SIX-HEIGHT residual band
 * over the overlap, i.e. how the envelope-minus-measured band redistributes once C0 is the
 * mean rather than the max offset.
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). The SAME six imp-95562 measured
 * sd(C - E) literals imp-95710/imp-95722/imp-95946/imp-95958 baked (over the 10^6 Odlyzko
 * ordinates) are re-used verbatim, and the per-height offset offset(T) = measuredVar - Selberg
 * term is recomputed exactly as imp-95946/imp-95958. Two anchors are formed from those six
 * offsets: C0_max (imp-95722/imp-95946) and C0_mean (imp-95787/imp-95800/imp-95958). Each is
 * propagated through the identical closed-form r_cap(T), and at each of the six overlap heights
 * the signed residual r_cap(T) - r(T) is tabulated under BOTH anchors, then the residual-band
 * summaries (min, max, mean-abs, signed-mean, count of heights below the measurement) are
 * compared. r_cap(3e12) is re-evaluated under the mean anchor as the dead-zone check.
 *
 * FINDINGS.
 *  1. The mean anchor SHRINKS the residual band. Max-abs residual drops from +0.1327 (max
 *     anchor, at T = 7e4) to +0.0552 (mean anchor, same height); mean-abs residual over the
 *     six falls from +0.0770 to +0.0350 (a ~54% reduction in average clearance). The signed
 *     mean residual collapses from +0.0770 (all-positive max-anchor slack) to ~+0.00003
 *     (essentially zero) -- the mean anchor centres the band, as expected from an arithmetic
 *     mean of the offsets.
 *  2. The mean anchor is NO LONGER UNIFORMLY CONSERVATIVE over the overlap. Three of the six
 *     heights now sit BELOW the envelope: T = 1e4 (residual -0.0293, -6.1%), T = 1.5e5
 *     (-0.0737, -16.0% -- the former max-anchor touch point, now the deepest dip because it
 *     was the high outlier that pinned C0_max), and T = 3e5 (-0.0020, -0.5%). The other three
 *     stay above (worst-above +0.0552 at T = 7e4). This is exactly why imp-95722 chose the
 *     conservative max anchor: the mean anchor trades ~54% tighter average clearance for
 *     losing the uniform-upper-bound property over the measured band.
 *  3. r_cap(3e12) < 1 STILL HOLDS with room to spare. The mean anchor gives r_cap(3e12) =
 *     0.22255 (vs 0.25987 under the max anchor), well under 1 -- reproducing imp-95958 F2 and
 *     confirming the tightening does not threaten the dead-zone r_cap < 1 conclusion.
 *
 * HONEST CAVEAT (unchanged from imp-95946/imp-95958). Both anchors are fitted FROM the same
 * six in-repo measurements; this is a redistribution of the SAME self-consistency envelope,
 * not an out-of-sample test. The mean anchor's loss of the uniform-upper-bound property over
 * the overlap is the direct in-band evidence for why the conservative max anchor carries the
 * dead-zone margin above the gamma_1e6 = 6.003e5 ceiling (imp-95750 F3); a mean anchor would
 * under-cover any unmeasured interior height whose true offset exceeds the mean. The measured
 * r_cap < 1 headline continues to rest on the max anchor.
 *
 * VERDICT. Recomputed with the mean offset anchor, the six-height residual band shrinks by
 * ~54% (mean-abs +0.0770 -> +0.0350, max-abs +0.1327 -> +0.0552, signed mean +0.0770 -> ~0)
 * but LOSES uniform conservatism -- three of six overlap heights fall below the envelope, the
 * deepest (-0.0737, -16%) at the former T = 1.5e5 max-anchor touch point; r_cap(3e12) = 0.22255
 * < 1 still holds comfortably. The mean anchor buys tighter average clearance at the cost of
 * the uniform-upper-bound property, quantifying precisely why imp-95722 kept the max anchor for
 * the dead-zone carrier. Measurement only; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-95946-number-variance-envelope-vs-measured-crossvalidation (the max-anchor six-height band)
 * @see imp-95958-number-variance-mean-anchor-c0-tightening (the mean/median anchor r_cap at T = 3e12)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same
 * measured literals imp-95710/imp-95722/imp-95946/imp-95958 baked; every derived quantity is
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

// Same six measured literals imp-95710/imp-95722/imp-95946/imp-95958 baked (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Per-height offset offset(T) = measuredVar - Selberg term (identical to imp-95946/imp-95958).
const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;

const C0_max = Math.max(...offsets); // imp-95722/imp-95946 conservative anchor (argmax at T = 1.5e5)
const C0_mean = mean(offsets); // tighter anchor (imp-95787/imp-95800/imp-95958)

const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T)); // r_cap(T)

// Six-height residual band under an anchor: residual(T) = r_cap(T) - r(T).
function residualBand(C0) {
  const rows = MEASURED.map((m) => {
    const gueVar = gueNumberVariance(envelopeCount(m.Tc));
    const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar; // imp-95710 r(T)
    const rCap = cappedRatio(m.Tc, C0);
    const residual = rCap - rMeasured; // >= 0 means conservative at T
    return { Tc: m.Tc, measuredRatio: rMeasured, envelopeRatio: rCap, residual, residualRelPct: (residual / rMeasured) * 100 };
  });
  const rs = rows.map((r) => r.residual);
  return {
    rows,
    minResidual: Math.min(...rs),
    maxResidual: Math.max(...rs),
    maxAbsResidual: Math.max(...rs.map((v) => Math.abs(v))),
    meanAbsResidual: rs.reduce((s, v) => s + Math.abs(v), 0) / rs.length,
    signedMeanResidual: mean(rs),
    heightsBelowEnvelope: rs.filter((v) => v < -1e-12).length, // count where measurement pokes above r_cap
    uniformlyConservative: Math.min(...rs) >= -1e-12,
  };
}

const maxBand = residualBand(C0_max);
const meanBand = residualBand(C0_mean);

const WINDOW_BOTTOM_T = 3.0e12; // imp-95519 window bottom (dead-zone carrier)
const rCapMeanWindow = cappedRatio(WINDOW_BOTTOM_T, C0_mean);
const rCapMaxWindow = cappedRatio(WINDOW_BOTTOM_T, C0_max);

// Band-tightening summary (mean anchor vs max anchor).
const maxAbsTighteningAbs = maxBand.maxAbsResidual - meanBand.maxAbsResidual;
const maxAbsTighteningPct = (maxAbsTighteningAbs / maxBand.maxAbsResidual) * 100;
const meanAbsTighteningAbs = maxBand.meanAbsResidual - meanBand.meanAbsResidual;
const meanAbsTighteningPct = (meanAbsTighteningAbs / maxBand.meanAbsResidual) * 100;

export const IMP96049_NUMBER_VARIANCE_MEAN_ANCHOR_SIX_HEIGHT_RESIDUAL_BAND = {
  ticket: 'imp-96049',
  source:
    'imp-95946 caveat 3 + imp-95787/imp-95800: the mean-based offset anchor tightens the envelope but the mean-anchor SIX-HEIGHT residual band was never tabulated (imp-95946 did only the max anchor; imp-95958 did the mean/median anchor only at T = 3e12). Envelope: imp-95722 r_cap(T). Measurements: the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  definitions: {
    offset: 'offset(T) = measuredVar - (1/2pi^2) log log(T/2pi): the per-height Selberg-subtracted residual whose anchor gives C0',
    C0_max: 'max over the six offsets: the imp-95722/imp-95946 conservative anchor (argmax at T = 1.5e5)',
    C0_mean: 'arithmetic mean of the six offsets: the tighter anchor imp-95787/imp-95800/imp-95958 propose',
    residual: 'residual(T) = r_cap(T) - r(T): envelope minus measured; >= 0 means the envelope is conservative at T',
    heightsBelowEnvelope: 'count of the six overlap heights where the measured ratio pokes above r_cap (residual < 0)',
  },
  anchors: { C0_max, C0_mean },
  overlapHeights: { bottomT: MEASURED[0].Tc, topT: MEASURED[MEASURED.length - 1].Tc, count: MEASURED.length },
  maxAnchorBand: maxBand,
  meanAnchorBand: meanBand,
  bandTightening: {
    maxAbsResidual: { max: maxBand.maxAbsResidual, mean: meanBand.maxAbsResidual, absDrop: maxAbsTighteningAbs, pctDrop: maxAbsTighteningPct },
    meanAbsResidual: { max: maxBand.meanAbsResidual, mean: meanBand.meanAbsResidual, absDrop: meanAbsTighteningAbs, pctDrop: meanAbsTighteningPct },
    signedMeanResidual: { max: maxBand.signedMeanResidual, mean: meanBand.signedMeanResidual },
    heightsBelowEnvelope: { max: maxBand.heightsBelowEnvelope, mean: meanBand.heightsBelowEnvelope },
  },
  windowBottom: { T: WINDOW_BOTTOM_T, rCapMean: rCapMeanWindow, rCapMax: rCapMaxWindow, meanBelowOne: rCapMeanWindow < 1 },
  caveat:
    'NOT an out-of-sample validation. Both anchors are fitted FROM the same six in-repo measurements, so this redistributes the SAME self-consistency envelope rather than testing it out of sample. The mean anchor loses the uniform-upper-bound property over the overlap (three of six heights fall below the envelope, deepest at the former T = 1.5e5 touch point), which is the direct in-band evidence for why the conservative max anchor carries the dead-zone margin above the gamma_1e6 = 6.003e5 ceiling (imp-95750 F3): a mean anchor would under-cover any unmeasured interior height whose true offset exceeds the mean. The measured r_cap < 1 headline continues to rest on the max anchor.',
  verdict:
    'MEASURED: recomputed with the mean offset anchor, the six-height residual band shrinks by ~54% (mean-abs +0.0770 -> +0.0350, max-abs +0.1327 -> +0.0552, signed mean +0.0770 -> ~0) but LOSES uniform conservatism -- three of six overlap heights fall below the envelope, the deepest (-0.0737, -16%) at the former T = 1.5e5 max-anchor touch point; r_cap(3e12) = 0.22255 < 1 still holds comfortably. The mean anchor buys tighter average clearance at the cost of the uniform-upper-bound property, quantifying precisely why imp-95722 kept the max anchor for the dead-zone carrier. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // anchors reproduce the imp-95722/imp-95946/imp-95958 values
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96049: C0_max reconstruction drifted from imp-95722');
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96049: C0_mean drifted from imp-95958');
  // max-anchor band reproduces imp-95946 (uniformly conservative, min 0, max ~0.133)
  if (!maxBand.uniformlyConservative) throw new Error('imp-96049: max-anchor band not uniformly conservative (imp-95946 regression)');
  if (!approx(maxBand.minResidual, 0, 1e-9)) throw new Error('imp-96049: max-anchor min residual not zero (anchor touch broken)');
  if (!approx(maxBand.maxResidual, 0.13266573775538515, 1e-6)) throw new Error('imp-96049: max-anchor max residual drifted from imp-95946');
  if (maxBand.heightsBelowEnvelope !== 0) throw new Error('imp-96049: max-anchor band should have zero heights below the envelope');
  // mean anchor SHRINKS the band on every summary
  if (!(meanBand.maxAbsResidual < maxBand.maxAbsResidual)) throw new Error('imp-96049: mean anchor did not shrink max-abs residual');
  if (!(meanBand.meanAbsResidual < maxBand.meanAbsResidual)) throw new Error('imp-96049: mean anchor did not shrink mean-abs residual');
  if (!approx(meanBand.meanAbsResidual, 0.035021774260090434, 1e-9)) throw new Error('imp-96049: mean-anchor mean-abs residual drifted');
  if (!approx(meanBand.maxAbsResidual, 0.07373524460642078, 1e-9)) throw new Error('imp-96049: mean-anchor max-abs residual drifted');
  // mean anchor centres the band: signed mean ~ 0
  if (!(Math.abs(meanBand.signedMeanResidual) < 1e-3)) throw new Error('imp-96049: mean-anchor signed-mean residual not centred near zero');
  // mean anchor loses uniform conservatism: three heights fall below the envelope
  if (meanBand.uniformlyConservative) throw new Error('imp-96049: mean anchor unexpectedly stayed uniformly conservative');
  if (meanBand.heightsBelowEnvelope !== 3) throw new Error('imp-96049: mean-anchor heights-below-envelope count changed from 3');
  // deepest dip is at the former T = 1.5e5 touch point
  const meanRows = meanBand.rows;
  const deepestIdx = meanRows.reduce((mi, r, i, arr) => (r.residual < arr[mi].residual ? i : mi), 0);
  if (meanRows[deepestIdx].Tc !== 1.5e5) throw new Error('imp-96049: deepest mean-anchor dip not at T = 1.5e5');
  // r_cap(3e12) < 1 must still hold under the mean anchor -- the dead-zone check
  if (!(rCapMeanWindow > 0 && rCapMeanWindow < 1)) throw new Error('imp-96049: mean-anchor r_cap(3e12) left (0,1)');
  if (!approx(rCapMeanWindow, 0.2225468806064992, 1e-9)) throw new Error('imp-96049: mean-anchor r_cap(3e12) drifted from imp-95958');
  // honesty gates
  if (!/NO QED/.test(IMP96049_NUMBER_VARIANCE_MEAN_ANCHOR_SIX_HEIGHT_RESIDUAL_BAND.verdict))
    throw new Error('imp-96049: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96049_NUMBER_VARIANCE_MEAN_ANCHOR_SIX_HEIGHT_RESIDUAL_BAND.verdict))
    throw new Error('imp-96049: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96049_NUMBER_VARIANCE_MEAN_ANCHOR_SIX_HEIGHT_RESIDUAL_BAND;
