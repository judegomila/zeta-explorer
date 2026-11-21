/**
 * imp-95946 -- CROSS-VALIDATING the imp-95722 derived envelope r_cap(T) against the six
 * imp-95710 directly-measured number-variance ratios over their OVERLAP T = 1e4..5e5.
 *
 * imp-95722 derived an analytic upper envelope r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ]
 * / Sigma^2(L(T)) for the finite-height pointwise-variance / GUE number-variance ratio
 * r(T), carrying the crossover-height conservatism to r_cap(3e12) ~ 0.26 < 1 at the
 * imp-95519 window bottom. imp-95750 (F3) established that this conservatism CANNOT be
 * measured directly with in-repo zero data past the ceiling gamma_1e6 = 6.003e5 and so
 * stays reliant on the derived envelope. The envelope and the six imp-95710 direct
 * measurements OVERLAP only over T = 1e4..5e5, and that overlap has never been tabulated
 * as an envelope-minus-measured residual -- the only in-repo ground-truth check on the
 * envelope that carries the whole dead-zone conservatism.
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). Both r_cap and the measured
 * r(T) are recomputed here from the same closed forms and the SAME six imp-95562 measured
 * sd(C - E) literals imp-95710/imp-95722 baked (over the 10^6 Odlyzko ordinates). At each
 * of the six overlap heights compute the imp-95722 cappedRatio(T) and the imp-95710
 * measured ratio r(T) = sd(C - E)^2 / Sigma^2(L), then the signed residual
 * residual(T) = r_cap(T) - r(T) (envelope minus measured) and its relative size
 * residual / r.
 *
 * FINDINGS.
 *  1. The envelope is UNIFORMLY CONSERVATIVE across the whole overlap: residual(T) >= 0 at
 *     all six heights (min residual = 0). No sampled height pokes above the envelope.
 *  2. The margin is not uniform. It is EXACTLY ZERO at the C0-anchor height T = 1.5e5 (the
 *     argmax offset that pins C0, so the envelope touches the measurement there by
 *     construction) and rises to a worst-case +0.1327 (about +38.1% relative) at T = 7e4.
 *     Mean absolute residual over the six ~ +0.0770 (~+20.4% relative).
 *  3. HONEST CAVEAT (not an independent validation). C0 was pinned FROM these same six
 *     measurements as the MAX per-height offset, so residual >= 0 is a self-consistency
 *     check (the envelope cannot fall below the point that anchored it), NOT an
 *     out-of-sample test. What the tabulation quantifies is the SLACK the max-anchor buys
 *     over the measured band -- 0 at the anchor, up to ~38% at the tightest interior
 *     height -- consistent with the imp-95787/imp-95800 finding that the max anchor
 *     over-estimates the central offset (mean-based C0 would tighten the envelope while
 *     keeping r_cap < 1).
 *
 * VERDICT. Over the T = 1e4..5e5 overlap where the imp-95722 envelope and the imp-95710
 * direct measurements coexist, the envelope is uniformly conservative (r_cap >= r at all
 * six heights, min residual 0), touching the measurement only at the C0-anchor T = 1.5e5
 * and clearing it by up to +0.133 (~38%) elsewhere. Because C0 was pinned from these same
 * six points (max offset), this is a self-consistency check that quantifies the
 * max-anchor slack, not an out-of-sample validation; the dead-zone conservatism above
 * 5e5 remains reliant on the derived envelope (imp-95750 F3). Cross-validation only;
 * changes no bound; NO QED; no refereed bound is changed; the zero-side
 * route stays PCC/GRH-gated.
 *
 * @see imp-95973-six-point-noise-domination-wall-glossary-headword (shared nav index: this
 *   thread's self-consistency-only overlap check sits alongside the sibling imp-95940/imp-95941
 *   six-point-wall findings under one index note)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same
 * measured literals imp-95710/imp-95722 baked; every derived quantity is recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722 baked (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Reconstruct the imp-95722 offset C0 = max over heights of (measuredVar - Selberg term).
const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const C0 = Math.max(...offsets); // envelope offset (max anchor), matches imp-95722

const cappedVariance = (T) => SELBERG_C * logLog(T) + C0; // imp-95722 numerator cap
const cappedRatio = (T) => cappedVariance(T) / gueNumberVariance(envelopeCount(T)); // r_cap(T)

// The overlap cross-validation table: measured r(T) vs derived envelope r_cap(T).
const ROWS = MEASURED.map((m) => {
  const L = envelopeCount(m.Tc);
  const gueVar = gueNumberVariance(L);
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  const rMeasured = measuredVar / gueVar; // imp-95710 r(T)
  const rCap = cappedRatio(m.Tc); // imp-95722 r_cap(T)
  const residual = rCap - rMeasured; // envelope minus measured (>= 0 means conservative)
  return {
    Tc: m.Tc,
    logT: Math.log(m.Tc),
    measuredRatio: rMeasured,
    envelopeRatio: rCap,
    residual, // signed: r_cap - r
    residualRelPct: (residual / rMeasured) * 100, // relative to the measured ratio
    conservative: residual >= -1e-12, // envelope at or above the measurement here
  };
});

const residuals = ROWS.map((r) => r.residual);
const minResidual = Math.min(...residuals);
const maxResidual = Math.max(...residuals);
const meanAbsResidual = residuals.reduce((s, v) => s + Math.abs(v), 0) / residuals.length;
const relPcts = ROWS.map((r) => r.residualRelPct);
const maxResidualRelPct = Math.max(...relPcts);
const meanResidualRelPct = relPcts.reduce((s, v) => s + v, 0) / relPcts.length;
const uniformlyConservative = minResidual >= -1e-12; // no measured point pokes above r_cap
// the C0-anchor height (argmax offset) where the envelope touches the measurement
const anchorIdx = offsets.indexOf(Math.max(...offsets));
const anchorHeightT = MEASURED[anchorIdx].Tc;
const worstMarginIdx = residuals.indexOf(maxResidual);
const worstMarginHeightT = MEASURED[worstMarginIdx].Tc;

export const IMP95946_NUMBER_VARIANCE_ENVELOPE_VS_MEASURED_CROSSVALIDATION = {
  ticket: 'imp-95946',
  source:
    'imp-95750 F3 (the imp-95722 derived envelope carries the dead-zone conservatism but is never residual-checked against the imp-95710 measured overlap). Envelope: imp-95722 r_cap(T). Measurements: imp-95710 r(T) from the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  definitions: {
    measuredRatio: 'r(T) = sd(C - E)^2 / Sigma^2(L): imp-95710 measured pointwise variance over the GUE asymptote',
    envelopeRatio: 'r_cap(T) = [ (1/2pi^2) log log(T/2pi) + C0 ] / Sigma^2(L(T)): imp-95722 derived upper envelope',
    residual: 'residual(T) = r_cap(T) - r(T): envelope minus measured; >= 0 means the envelope is conservative at T',
    offsetC0: 'imp-95722 offset = max over the six heights of (measuredVar - Selberg term); the max anchor pins the envelope at the argmax height',
  },
  offsetC0: C0,
  overlapHeights: { bottomT: MEASURED[0].Tc, topT: MEASURED[MEASURED.length - 1].Tc, count: MEASURED.length },
  rows: ROWS,
  summary: {
    minResidual, // 0 at the C0 anchor
    maxResidual, // ~ +0.133 at T = 7e4
    meanAbsResidual, // ~ +0.077
    maxResidualRelPct, // ~ +38.1%
    meanResidualRelPct, // ~ +20.4%
    uniformlyConservative, // true: r_cap >= r at all six overlap heights
    anchorHeightT, // 1.5e5: envelope touches the measurement here (residual 0)
    worstMarginHeightT, // 7e4: tightest interior clearance
  },
  caveat:
    'NOT an out-of-sample validation. C0 was pinned FROM these same six measurements as the MAX per-height offset (argmax at T = 1.5e5), so residual >= 0 is a self-consistency check -- the envelope cannot fall below the point that anchored it -- and the tabulation quantifies the SLACK the max anchor buys over the measured band (0 at the anchor, up to ~38% at the tightest interior height), consistent with imp-95787/imp-95800 that the max anchor over-estimates the central offset. The dead-zone conservatism above 5e5 stays reliant on the derived envelope (imp-95750 F3).',
  verdict:
    'CROSS-VALIDATED over the T = 1e4..5e5 overlap: the imp-95722 derived envelope r_cap(T) is UNIFORMLY CONSERVATIVE against the six imp-95710 direct measurements (r_cap >= r at every height, min residual 0), touching the measurement only at the C0-anchor T = 1.5e5 and clearing it by up to +0.133 (~38.1% relative) at T = 7e4, mean absolute residual ~ +0.077 (~+20.4%). Because C0 was pinned from these same six points (max offset), this is a self-consistency check quantifying the max-anchor slack, NOT an out-of-sample test; the dead-zone conservatism above 5e5 remains reliant on the derived envelope (imp-95750 F3). Cross-validation only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 reconstruction matches the imp-95722 value
  if (!approx(C0, 0.3337213835371905, 1e-9)) throw new Error('imp-95946: C0 reconstruction drifted from imp-95722');
  // envelope + GUE closed forms match a spot value (same as imp-95710/95722)
  const r0 = ROWS[0];
  if (!approx(envelopeCount(1.0e4), 2 * Math.sqrt(1.0e4 / TWO_PI) * Math.log(1.0e4 / TWO_PI) / TWO_PI, 1e-9))
    throw new Error('imp-95946: envelope L formula mismatch');
  // the envelope is an upper cross-validated bound: residual >= 0 at every overlap height
  for (const r of ROWS)
    if (!(r.residual >= -1e-12)) throw new Error('imp-95946: measured ratio pokes above the envelope -- not conservative');
  if (!uniformlyConservative) throw new Error('imp-95946: envelope not uniformly conservative over the overlap');
  // the envelope touches the measurement exactly at the C0 anchor (residual 0 there)
  if (!approx(minResidual, 0, 1e-9)) throw new Error('imp-95946: min residual not zero -- anchor touch broken');
  if (!(anchorHeightT === 1.5e5)) throw new Error('imp-95946: C0 anchor height moved off T = 1.5e5');
  // worst-case interior margin lands at T = 7e4 and is a real positive clearance
  if (!(worstMarginHeightT === 7.0e4 && maxResidual > 0.1))
    throw new Error('imp-95946: worst-case residual margin drifted');
  // relative margins in the expected band
  if (!(maxResidualRelPct > 30 && maxResidualRelPct < 45))
    throw new Error('imp-95946: max relative residual outside the expected band');
  // every ratio (measured and envelope) stays strictly below the GUE asymptote
  for (const r of ROWS)
    if (!(r.measuredRatio > 0 && r.measuredRatio < 1 && r.envelopeRatio > 0 && r.envelopeRatio < 1))
      throw new Error('imp-95946: a ratio fell outside (0,1)');
  // honesty gates
  if (!/NO QED/.test(IMP95946_NUMBER_VARIANCE_ENVELOPE_VS_MEASURED_CROSSVALIDATION.verdict))
    throw new Error('imp-95946: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95946_NUMBER_VARIANCE_ENVELOPE_VS_MEASURED_CROSSVALIDATION.verdict))
    throw new Error('imp-95946: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95946_NUMBER_VARIANCE_ENVELOPE_VS_MEASURED_CROSSVALIDATION;
