/**
 * imp-96271 -- Is the imp-95562 worst pointwise excess Gaussian-tailed, as claimed?
 *
 * imp-95562 finding 2 asserts the worst single-window C - E excess sits ~1.5-2.0
 * zeros above the mean-square envelope (about 2.9-3.3 sigma) and calls it
 * "Gaussian-tailed over ~10^2-10^3 windows -- no anomalous pointwise spikes".
 * The claim was stated but never tested against a quantitative extreme-value model.
 * This module tests it.
 *
 * TEST. For a tiling of n non-overlapping windows, if the per-window discrepancy
 * D = C - E were i.i.d. standard Gaussian (after normalizing by sd(D)), the worst
 * observed worstSigma = maxPosExcess / sdDiscrepancy should track the MAXIMUM of n
 * i.i.d. standard Gaussians, whose classical extreme-value law is
 *   leading order   b0(n) = sqrt(2 ln n),
 *   Gumbel location bN(n) = sqrt(2 ln n) - (ln ln n + ln 4pi) / (2 sqrt(2 ln n)),
 *   Gumbel scale    aN(n) = 1 / sqrt(2 ln n),
 *   E[max]          = bN(n) + gamma_E * aN(n),
 *   sd[max]         = (pi / sqrt 6) * aN(n).
 * We compare the observed worstSigma at each of the six imp-95562 heights against
 * E[max] and report the deviation z = (worstSigma - E[max]) / sd[max] in units of
 * the Gumbel standard deviation. |z| <~ 2 means the worst excess is exactly what a
 * batch of n i.i.d. Gaussians would produce -- i.e. Gaussian-tailed, no anomalous
 * spike; z >> 2 would flag an excess beyond the extreme-value prediction.
 *
 * FINDING. At all six heights the observed worst excess is consistent with the
 * maximum of n i.i.d. Gaussians: z ranges over [-1.10, +1.85] Gumbel sd, i.e. every
 * height sits within +/-2 sd of its expected batch maximum. Five of six heights fall
 * AT OR BELOW the leading sqrt(2 ln n); only the smallest-batch height (T = 1e4,
 * n = 75) exceeds the leading order, and even there worstSigma = 3.26 is only
 * z = +1.85 Gumbel sd above E[max] = 2.46 -- a routine tail draw for a batch of 75,
 * not an anomalous pointwise spike. The imp-95562 "Gaussian-tailed" claim is
 * SUPPORTED by the extreme-value comparison.
 *
 * Import-light: no zeros bundle, no sibling imports. The four imp-95562 per-height
 * literals (nWindows, maxPosExcess, sdDiscrepancy) are baked; the extreme-value
 * predictions are re-derived here from the closed forms above. Measurement only;
 * uses baked imp-95562 literals; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated regardless.
 * @see imp-95562-meansquare-vs-pointwise-gap (finding 2, the claim under test)
 */

const EULER = 0.5772156649015329;

// Baked from imp-95562 MEASURED rows (offline run over the 10^6 Odlyzko ordinates):
// nWindows, worst single-window excess over envelope, and per-window discrepancy sd.
const IMP95562 = [
  { Tc: 1.0e4, nWindows: 75, maxPosExcess: 2.028, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, nWindows: 130, maxPosExcess: 1.494, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, nWindows: 198, maxPosExcess: 1.397, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, nWindows: 291, maxPosExcess: 1.669, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, nWindows: 411, maxPosExcess: 1.939, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, nWindows: 443, maxPosExcess: 1.752, sdDiscrepancy: 0.6078 },
];

// Extreme-value statistics for the maximum of n i.i.d. standard Gaussians.
const evtLeading = (n) => Math.sqrt(2 * Math.log(n)); // b0(n) = sqrt(2 ln n)
const evtScale = (n) => 1 / evtLeading(n); // aN(n) = 1 / sqrt(2 ln n)
const evtLocation = (n) => {
  const b0 = evtLeading(n);
  return b0 - (Math.log(Math.log(n)) + Math.log(4 * Math.PI)) / (2 * b0);
};
const evtExpectedMax = (n) => evtLocation(n) + EULER * evtScale(n); // E[max]
const evtMaxSd = (n) => (Math.PI / Math.sqrt(6)) * evtScale(n); // sd[max]

const ROWS = IMP95562.map((m) => {
  const worstSigma = m.maxPosExcess / m.sdDiscrepancy;
  const leading = evtLeading(m.nWindows);
  const expectedMax = evtExpectedMax(m.nWindows);
  const maxSd = evtMaxSd(m.nWindows);
  const z = (worstSigma - expectedMax) / maxSd; // deviation in Gumbel sd units
  return {
    Tc: m.Tc,
    nWindows: m.nWindows,
    worstSigma, // observed max window in units of per-window sd
    evtLeadingSqrt2LnN: leading, // sqrt(2 ln n)
    evtExpectedMax: expectedMax, // E[max of n iid N(0,1)]
    evtMaxSd: maxSd, // Gumbel sd of that maximum
    deviationInGumbelSd: z, // (worstSigma - E[max]) / sd[max]
    exceedsLeadingOrder: worstSigma > leading,
    consistentWithGaussianTail: Math.abs(z) < 2.5, // within the EV envelope
  };
});

const zMin = Math.min(...ROWS.map((r) => r.deviationInGumbelSd));
const zMax = Math.max(...ROWS.map((r) => r.deviationInGumbelSd));
const allConsistent = ROWS.every((r) => r.consistentWithGaussianTail);
const nExceedingLeading = ROWS.filter((r) => r.exceedsLeadingOrder).length;

export const IMP96271_WORST_EXCESS_EVT_GAUSSIANITY = {
  ticket: 'imp-96271',
  source:
    'imp-95562-meansquare-vs-pointwise-gap.js finding 2 ("worst window ~2.9-3.3 sigma, Gaussian-tailed over ~1e2-1e3 windows"); baked nWindows / maxPosExcess / sdDiscrepancy literals',
  definitions: {
    worstSigma: 'maxPosExcess / sdDiscrepancy -- the worst single-window excess in units of the per-window discrepancy sd',
    evtLeading: 'b0(n) = sqrt(2 ln n) -- leading-order maximum of n iid standard Gaussians',
    evtExpectedMax: 'E[max] = bN(n) + gamma_E aN(n), bN = sqrt(2 ln n) - (ln ln n + ln 4pi)/(2 sqrt(2 ln n)), aN = 1/sqrt(2 ln n)',
    deviationInGumbelSd: '(worstSigma - E[max]) / sd[max], sd[max] = (pi/sqrt 6) aN(n) -- how far the observed worst excess sits from the expected batch maximum',
  },
  rows: ROWS,
  aggregates: {
    deviationRangeGumbelSd: { min: zMin, max: zMax }, // [-1.10, +1.85]
    allWithinEvtEnvelope: allConsistent, // every height within +/-2.5 Gumbel sd
    nHeightsExceedingLeadingOrder: nExceedingLeading, // 1 of 6 (only n=75)
    nHeights: ROWS.length,
  },
  verdict:
    'The imp-95562 "Gaussian-tailed, no anomalous pointwise spikes" claim is SUPPORTED by an extreme-value comparison. At all six sample heights the observed worst excess worstSigma = maxPosExcess/sdDiscrepancy is consistent with the maximum of nWindows i.i.d. standard Gaussians: the deviation z = (worstSigma - E[max])/sd[max] lies in [-1.10, +1.85] Gumbel sd, so every height sits within +/-2 sd of its expected batch maximum. Five of six heights fall at or below the leading sqrt(2 ln n); the sole height above leading order (T = 1e4, n = 75, worstSigma = 3.26) is only +1.85 Gumbel sd above its expected max 2.46 -- a routine tail draw for a batch of 75, not an anomalous spike. No height exceeds the extreme-value prediction. Measurement only; uses baked imp-95562 literals; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated regardless.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // EVT closed forms sanity: leading order strictly increases with batch size n
  for (let i = 1; i < ROWS.length; i++)
    if (!(ROWS[i].evtLeadingSqrt2LnN > ROWS[i - 1].evtLeadingSqrt2LnN))
      throw new Error('imp-96271: sqrt(2 ln n) not monotone in n');
  // spot-check the worstSigma re-derivation against the imp-95562 literals
  if (!approx(ROWS[0].worstSigma, 2.028 / 0.6218, 1e-9)) throw new Error('imp-96271: worstSigma re-derivation mismatch');
  // spot-check E[max] for the largest batch (n = 443)
  const n6 = 443;
  const b0 = Math.sqrt(2 * Math.log(n6));
  const expMax6 = b0 - (Math.log(Math.log(n6)) + Math.log(4 * Math.PI)) / (2 * b0) + EULER / b0;
  if (!approx(ROWS[5].evtExpectedMax, expMax6, 1e-9)) throw new Error('imp-96271: E[max] formula mismatch');
  // core finding: every height within the extreme-value envelope, none an anomalous spike
  if (!allConsistent) throw new Error('imp-96271: a height fell outside the +/-2.5 Gumbel-sd EV envelope');
  if (!(zMax < 2)) throw new Error('imp-96271: worst positive deviation exceeded +2 Gumbel sd -- would be an anomalous spike');
  if (!(zMin > -2)) throw new Error('imp-96271: worst negative deviation below -2 Gumbel sd');
  // only the smallest batch (n = 75) should exceed the leading order
  if (nExceedingLeading !== 1) throw new Error('imp-96271: unexpected count of heights exceeding sqrt(2 ln n)');
  if (!ROWS[0].exceedsLeadingOrder) throw new Error('imp-96271: expected the n=75 height to exceed the leading order');
  // honesty gate: measurement, not a bound change
  if (!/NO QED/.test(IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.verdict))
    throw new Error('imp-96271: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96271_WORST_EXCESS_EVT_GAUSSIANITY.verdict))
    throw new Error('imp-96271: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96271_WORST_EXCESS_EVT_GAUSSIANITY;
