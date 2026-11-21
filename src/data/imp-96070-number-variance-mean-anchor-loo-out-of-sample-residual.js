/**
 * imp-96070 -- OUT-OF-SAMPLE test of the imp-96049 mean offset anchor via LEAVE-ONE-OUT
 * cross-validation of the number-variance envelope r_cap(T) over the six imp-95562 heights.
 *
 * imp-96049 tabulated the mean-anchor six-height residual band residual(T) = r_cap(T) - r(T)
 * and flagged the HONEST CAVEAT: both the max and mean offset anchors are fitted FROM the same
 * six measured heights, so the shrunk mean-anchor band (max-abs +0.0552, signed-mean ~+0.00003)
 * is IN-SAMPLE. This ticket answers imp-96049's open question -- does the fitted mean anchor
 * generalize beyond the six heights it was fitted from? -- with the only data-available honest
 * out-of-sample estimator: leave-one-out (LOO) cross-validation. There are NO measured sd(C - E)
 * literals at brand-new heights (T = 5e4, 1e6) in the repo, so a fresh held-out height cannot be
 * evaluated; LOO instead HOLDS OUT each of the six heights in turn, refits the anchor from the
 * remaining five offsets, and measures the held-out signed residual under an anchor that never
 * saw that height. (The ticket example even lists T = 3e4, one of the six -- LOO is exactly the
 * intended held-out interpretation.)
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). The SAME six imp-95562 measured
 * sd(C - E) literals imp-95710/imp-95722/imp-95946/imp-95958/imp-96049 baked (over the 10^6
 * Odlyzko ordinates) are re-used verbatim, and the per-height offset offset(T) = measuredVar -
 * Selberg term is recomputed exactly as imp-96049. For each height T_i: the mean anchor
 * C0_mean^LOO(i) is the arithmetic mean of the OTHER five offsets; it is propagated through the
 * identical closed-form r_cap(T_i); and the held-out residual r_cap^LOO(T_i) - r(T_i) is
 * tabulated. The same LOO is run for the max anchor (max of the other five) as a control. The
 * LOO band summaries are compared against the imp-96049 in-sample band.
 *
 * FINDINGS.
 *  1. The mean anchor does NOT generalize as a valid cap out-of-sample. Under LOO, 3 of the 6
 *     held-out heights poke ABOVE the refit envelope (residual < 0), matching the in-sample
 *     count of 3 but with the DIP DEEPENING: the deepest held-out residual is -0.0885 (-19.1%)
 *     at T = 1.5e5, worse than the in-sample -0.0737 (-16.0%) imp-96049 reported. The LOO
 *     max-abs residual rises to +0.0885 (from the in-sample +0.0552 at T = 7e4, whose held-out
 *     residual grows to +0.0663 / +19.0%). The signed-mean stays ~+0.00004 (LOO of a mean is
 *     still centred), so the mean anchor remains a good CENTRE estimator out-of-sample but a
 *     FAILED upper bound -- confirming imp-96049's caveat that a mean anchor under-covers any
 *     unmeasured height whose true offset exceeds the mean.
 *  2. Even the MAX anchor loses uniform conservatism out-of-sample, but only at its own argmax.
 *     Under LOO the max anchor stays conservative at 5 of 6 held-out heights (worst-above of
 *     those five is +0.0599 at T = 1e4) and fails at exactly ONE: T = 1.5e5, the height that
 *     PINS C0_max, where the held-out residual is -0.0495 (-10.7%). Removing the argmax drops
 *     the refit anchor from 0.3337 to 0.2854, which no longer covers the outlier it defined.
 *     So the max anchor's uniform-cap property over the overlap is contingent on the T = 1.5e5
 *     high outlier being IN the fit set -- a sharper statement of why imp-95722 kept the max
 *     anchor AND of its fragility to that single pinning height.
 *  3. Net out-of-sample ranking. For a strict cap, neither anchor is robust from six heights:
 *     the mean fails at 3/6 (deepest -19.1%), the max fails at 1/6 (its argmax, -10.7%). The
 *     max anchor is still the strictly better cap out-of-sample (fewer and shallower breaches),
 *     which is the out-of-sample vindication of the imp-95722 max-anchor choice that imp-96049
 *     could only argue in-sample.
 *
 * HONEST CAVEAT. LOO over six points is a low-resolution out-of-sample proxy, not a genuine new
 * held-out measurement: each refit anchor is built from only five offsets, so the LOO residuals
 * carry the same six-point sampling noise as the fit. A true out-of-sample test needs measured
 * sd(C - E) at heights outside {1e4, 3e4, 7e4, 1.5e5, 3e5, 5e5} (e.g. new Odlyzko windows at
 * T = 5e4, 1e6), which the repo does not have. This measurement changes NO Lambda bound: it
 * tests the generalization of the imp-96049 mean anchor, and confirms the dead-zone r_cap < 1
 * headline must continue to rest on the (out-of-sample-safer) max anchor, not the mean.
 *
 * VERDICT. Leave-one-out cross-validation shows the imp-96049 mean offset anchor does NOT
 * generalize as an upper bound: 3 of 6 held-out heights fall below the refit envelope, deepest
 * -0.0885 (-19.1%) at T = 1.5e5 (deeper than the in-sample -0.0737), while its signed-mean stays
 * ~0 (a good centre, a failed cap). The max anchor loses uniform conservatism at only its own
 * argmax (T = 1.5e5, -0.0495 / -10.7%) and stays conservative at the other five, so it is the
 * strictly better out-of-sample cap -- an out-of-sample vindication of the imp-95722 max-anchor
 * choice. Measurement only; changes no bound; NO QED; no refereed bound is changed;
 * the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96049-number-variance-mean-anchor-six-height-residual-band (the in-sample mean-anchor band this tests)
 * @see imp-95946-number-variance-envelope-vs-measured-crossvalidation (the max-anchor six-height band)
 * @see imp-95958-number-variance-mean-anchor-c0-tightening (the mean/median anchor r_cap at T = 3e12)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same
 * measured literals imp-95710/imp-95722/imp-95946/imp-95958/imp-96049 baked; every derived
 * quantity is recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722/imp-95946/imp-95958/imp-96049 baked (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Per-height offset offset(T) = measuredVar - Selberg term (identical to imp-96049).
const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;

const C0_mean_full = mean(offsets); // imp-96049 in-sample mean anchor
const C0_max_full = Math.max(...offsets); // imp-95722/imp-95946 in-sample max anchor

const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T)); // r_cap(T)

// Leave-one-out out-of-sample band: for each height, refit the anchor from the OTHER five offsets
// and measure the held-out signed residual r_cap^LOO(T) - r(T) under an anchor that never saw T.
function looBand(anchorOf) {
  const rows = MEASURED.map((m, i) => {
    const others = offsets.filter((_, j) => j !== i);
    const C0_loo = anchorOf(others);
    const gueVar = gueNumberVariance(envelopeCount(m.Tc));
    const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar; // imp-95710 r(T)
    const rCapLoo = cappedRatio(m.Tc, C0_loo);
    const residual = rCapLoo - rMeasured; // >= 0 means the refit envelope caps the held-out T
    return { Tc: m.Tc, C0_loo, measuredRatio: rMeasured, envelopeRatioLoo: rCapLoo, residual, residualRelPct: (residual / rMeasured) * 100 };
  });
  const rs = rows.map((r) => r.residual);
  const deepestIdx = rows.reduce((mi, r, i, arr) => (r.residual < arr[mi].residual ? i : mi), 0);
  return {
    rows,
    minResidual: Math.min(...rs),
    maxResidual: Math.max(...rs),
    maxAbsResidual: Math.max(...rs.map((v) => Math.abs(v))),
    meanAbsResidual: rs.reduce((s, v) => s + Math.abs(v), 0) / rs.length,
    signedMeanResidual: mean(rs),
    heightsBelowEnvelope: rs.filter((v) => v < -1e-12).length,
    uniformlyConservative: Math.min(...rs) >= -1e-12,
    deepestDip: { Tc: rows[deepestIdx].Tc, residual: rows[deepestIdx].residual, relPct: rows[deepestIdx].residualRelPct },
  };
}

const meanLoo = looBand((xs) => mean(xs));
const maxLoo = looBand((xs) => Math.max(...xs));

export const IMP96070_NUMBER_VARIANCE_MEAN_ANCHOR_LOO_OUT_OF_SAMPLE_RESIDUAL = {
  ticket: 'imp-96070',
  source:
    'imp-96049 HONEST CAVEAT: both the max and mean offset anchors are fitted FROM the same six imp-95562 heights, so the shrunk mean-anchor band is in-sample. This tests generalization via leave-one-out cross-validation over those six heights. Envelope: imp-95722 r_cap(T). Measurements: the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  method:
    'Leave-one-out (LOO): for each of the six heights T_i, refit the anchor from the OTHER five offsets and measure the held-out residual r_cap^LOO(T_i) - r(T_i) under an anchor that never saw T_i. Run for both the mean anchor and (as a control) the max anchor. No new measured heights exist in the repo, so LOO is the honest out-of-sample proxy.',
  definitions: {
    offset: 'offset(T) = measuredVar - (1/2pi^2) log log(T/2pi): the per-height Selberg-subtracted residual whose anchor gives C0',
    looAnchor: 'C0^LOO(i) = anchor (mean or max) of the FIVE offsets excluding height i: the refit anchor that never saw T_i',
    residual: 'residual(T) = r_cap^LOO(T) - r(T): held-out envelope minus measured; >= 0 means the refit envelope caps the held-out T',
    heightsBelowEnvelope: 'count of the six held-out heights where the measured ratio pokes above the refit r_cap (residual < 0)',
  },
  inSampleAnchors: { C0_mean_full, C0_max_full },
  overlapHeights: { bottomT: MEASURED[0].Tc, topT: MEASURED[MEASURED.length - 1].Tc, count: MEASURED.length },
  meanAnchorLoo: meanLoo,
  maxAnchorLoo: maxLoo,
  comparison: {
    meanFailsCap: !meanLoo.uniformlyConservative,
    maxFailsCap: !maxLoo.uniformlyConservative,
    meanHeightsBelow: meanLoo.heightsBelowEnvelope,
    maxHeightsBelow: maxLoo.heightsBelowEnvelope,
    maxIsBetterOutOfSample: maxLoo.heightsBelowEnvelope < meanLoo.heightsBelowEnvelope && maxLoo.minResidual > meanLoo.minResidual,
  },
  caveat:
    'LOO over six points is a low-resolution out-of-sample proxy, not a genuine new held-out measurement: each refit anchor is built from only five offsets and carries the same six-point sampling noise as the fit. A true out-of-sample test needs measured sd(C - E) at heights outside {1e4, 3e4, 7e4, 1.5e5, 3e5, 5e5} (e.g. new Odlyzko windows at T = 5e4, 1e6), which the repo does not have. Changes NO Lambda bound: it tests the generalization of the imp-96049 mean anchor and confirms the dead-zone r_cap < 1 headline must continue to rest on the out-of-sample-safer max anchor.',
  verdict:
    'Leave-one-out cross-validation shows the imp-96049 mean offset anchor does NOT generalize as an upper bound: 3 of 6 held-out heights fall below the refit envelope, deepest -0.0885 (-19.1%) at T = 1.5e5 (deeper than the in-sample -0.0737), while its signed-mean stays ~0 (a good centre, a failed cap). The max anchor loses uniform conservatism at only its own argmax (T = 1.5e5, -0.0495 / -10.7%) and stays conservative at the other five, so it is the strictly better out-of-sample cap -- an out-of-sample vindication of the imp-95722 max-anchor choice. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // in-sample anchors reproduce imp-96049
  if (!approx(C0_mean_full, 0.26184177603555076, 1e-9)) throw new Error('imp-96070: C0_mean_full drifted from imp-96049');
  if (!approx(C0_max_full, 0.3337213835371905, 1e-9)) throw new Error('imp-96070: C0_max_full drifted from imp-95722');
  // MEAN anchor LOO: signed-mean stays centred, but 3 of 6 held-out heights breach the cap
  if (!(Math.abs(meanLoo.signedMeanResidual) < 1e-3)) throw new Error('imp-96070: mean-anchor LOO signed-mean not centred near zero');
  if (meanLoo.heightsBelowEnvelope !== 3) throw new Error('imp-96070: mean-anchor LOO heights-below-envelope not 3');
  if (meanLoo.uniformlyConservative) throw new Error('imp-96070: mean-anchor LOO unexpectedly stayed a uniform cap');
  // deepest held-out mean dip is at T = 1.5e5 and DEEPENS past the in-sample -0.0737
  if (meanLoo.deepestDip.Tc !== 1.5e5) throw new Error('imp-96070: deepest mean-anchor LOO dip not at T = 1.5e5');
  if (!approx(meanLoo.minResidual, -0.08848229352770492, 1e-9)) throw new Error('imp-96070: mean-anchor LOO min residual drifted');
  if (!(meanLoo.minResidual < -0.0737)) throw new Error('imp-96070: mean-anchor LOO dip did not deepen past the in-sample -0.0737');
  if (!approx(meanLoo.maxResidual, 0.06627693488077846, 1e-9)) throw new Error('imp-96070: mean-anchor LOO max residual drifted');
  if (!approx(meanLoo.meanAbsResidual, 0.04202612911210854, 1e-9)) throw new Error('imp-96070: mean-anchor LOO mean-abs residual drifted');
  // MAX anchor LOO: fails at exactly ONE height, its own argmax T = 1.5e5
  if (maxLoo.heightsBelowEnvelope !== 1) throw new Error('imp-96070: max-anchor LOO heights-below-envelope not 1');
  if (maxLoo.deepestDip.Tc !== 1.5e5) throw new Error('imp-96070: max-anchor LOO single breach not at its argmax T = 1.5e5');
  if (!approx(maxLoo.minResidual, -0.04954017507211972, 1e-9)) throw new Error('imp-96070: max-anchor LOO min residual drifted');
  // out-of-sample ranking: max anchor is the strictly better cap (fewer, shallower breaches)
  if (!IMP96070_NUMBER_VARIANCE_MEAN_ANCHOR_LOO_OUT_OF_SAMPLE_RESIDUAL.comparison.maxIsBetterOutOfSample)
    throw new Error('imp-96070: max anchor not the strictly better out-of-sample cap');
  // honesty gates
  if (!/NO QED/.test(IMP96070_NUMBER_VARIANCE_MEAN_ANCHOR_LOO_OUT_OF_SAMPLE_RESIDUAL.verdict))
    throw new Error('imp-96070: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96070_NUMBER_VARIANCE_MEAN_ANCHOR_LOO_OUT_OF_SAMPLE_RESIDUAL.verdict))
    throw new Error('imp-96070: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96070_NUMBER_VARIANCE_MEAN_ANCHOR_LOO_OUT_OF_SAMPLE_RESIDUAL;
