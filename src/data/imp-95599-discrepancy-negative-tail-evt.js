/**
 * imp-95599 -- NEGATIVE-tail extreme-value check of the imp-95562 discrepancy.
 *
 * imp-95583 compared only the worst POSITIVE window excess max(D) of the
 * discrepancy D = C - E (imp-95562, over the 10^6 Odlyzko ordinates) against the
 * Gumbel MAXIMUM of N iid N(0, sd) draws and concluded "no height-persistent
 * positive bias, no arithmetic outlier". It asserted the tail is two-sided
 * symmetric but never measured the NEGATIVE side. This module measures the
 * most-negative window excess min(D) at the same six heights and compares it to
 * the Gumbel MINIMUM.
 *
 * METHOD (offline: tmp/imp-95599-neg-tail.mjs, over the same 10^6 Odlyzko
 * ordinates in src/data/zeros-to-1e6.js, via the imp-95562 band() tiling). For
 * each height we recompute min(D) = most-negative single-window excess. By the
 * symmetry of the Gaussian, the sample MINIMUM of N iid N(0, sd) draws has mean
 * -E[max] and the SAME spread as the maximum, so the Gumbel normalization is
 *   a_N = 1/sqrt(2 ln N),
 *   b_N = sqrt(2 ln N) - (ln ln N + ln 4pi) / (2 sqrt(2 ln N)),
 *   E[min]  = -sd * (b_N + gamma_E * a_N),
 *   sd[min] =  sd * a_N * pi / sqrt(6).
 * gumbelZmin = (min(D) - E[min]) / sd[min] is how many Gumbel standard deviations
 * the observed most-negative window sits from the EVT-predicted mean minimum
 * (positive = less negative than predicted, negative = more negative).
 *
 * CONSISTENCY. The recomputed min(D) reproduces imp-95562 exactly where that
 * module resolves the sign: rows with maxAbsExcess > maxPosExcess (T = 7e4, 1.5e5,
 * 5e5) give min(D) = -maxAbsExcess (-1.483, -1.759, -1.813); the positive maxPos
 * values also reproduce imp-95583 to the digit, so gumbelZmax here matches the
 * imp-95583 positive-side aggregate (mean ~ -0.07).
 *
 * FINDINGS.
 *  1. Every observed most-negative window lies within |gumbelZmin| < 1.5 of the
 *     EVT mean minimum (measured range -0.75 .. +1.21, mean ~ +0.25): the negative
 *     tail is exactly the size EVT predicts for the minimum of N Gaussian draws --
 *     no negative arithmetic outlier and no height-persistent negative deficit.
 *  2. Two-sided symmetry is CONFIRMED: the ratio |min(D)| / max(D) runs
 *     0.837 .. 1.062 across the six heights, centered on ~0.97, and the positive
 *     and negative Gumbel-Z means are both small and opposite in sign
 *     (max side ~ -0.07, min side ~ +0.25) -- the discrepancy tail is genuinely
 *     two-sided, not merely positive-bias-free.
 *
 * VERDICT. The imp-95583 two-sided-symmetry assertion is now MEASURED on the
 * negative side and holds: across six heights the most-negative window excess
 * min(D) matches the Gumbel-predicted minimum -E[max] of N iid draws to within
 * ~1.2 Gumbel sd, mirroring the positive side, with |min|/max centered on ~1.
 * Report only; changes no bound; NO QED. No refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated regardless.
 *
 * Import-light: no zeros bundle, no sibling imports. The EVT formulas are
 * re-derived here; only the (N, sd, maxPos, minNeg) quadruples are baked literals
 * carried from the offline run over the verified ordinates.
 */

const EULER = 0.5772156649015329;

// EVT for the extremes of N iid N(0,1): (b_N, a_N) Gumbel normalization.
const gumbelBN = (N) => {
  const s2 = Math.sqrt(2 * Math.log(N));
  return s2 - (Math.log(Math.log(N)) + Math.log(4 * Math.PI)) / (2 * s2);
};
const gumbelAN = (N) => 1 / Math.sqrt(2 * Math.log(N));
const evtMeanStd = (N) => gumbelBN(N) + EULER * gumbelAN(N); // E[max]/sd; E[min]/sd = -this
const evtSdStd = (N) => (gumbelAN(N) * Math.PI) / Math.sqrt(6); // sd[max]/sd = sd[min]/sd

// Baked from tmp/imp-95599-neg-tail.mjs over the 10^6 Odlyzko ordinates (same
// imp-95562 band() tiling): N = nWindows, sd = sd(D), maxPos = worst positive
// window excess, minNeg = worst NEGATIVE window excess (the new quantity).
const MEASURED = [
  { Tc: 1.0e4, N: 75, sd: 0.6218, maxPos: 2.028, minNeg: -1.731 },
  { Tc: 3.0e4, N: 130, sd: 0.5823, maxPos: 1.494, minNeg: -1.251 },
  { Tc: 7.0e4, N: 198, sd: 0.5689, maxPos: 1.397, minNeg: -1.483 },
  { Tc: 1.5e5, N: 291, sd: 0.6714, maxPos: 1.669, minNeg: -1.759 },
  { Tc: 3.0e5, N: 411, sd: 0.6199, maxPos: 1.939, minNeg: -1.931 },
  { Tc: 5.0e5, N: 443, sd: 0.6078, maxPos: 1.752, minNeg: -1.813 },
];

const ROWS = MEASURED.map((m) => {
  const evtMean = m.sd * evtMeanStd(m.N); // predicted E[max(D)] = -E[min(D)]
  const evtSd = m.sd * evtSdStd(m.N); // predicted sd of either extreme
  return {
    Tc: m.Tc,
    nWindows: m.N,
    sdDiscrepancy: m.sd,
    observedMaxExcess: m.maxPos,
    observedMinExcess: m.minNeg,
    evtMeanMaxExcess: evtMean, // +E[max]
    evtMeanMinExcess: -evtMean, // -E[max] = E[min] by symmetry
    evtSdExcess: evtSd,
    gumbelZmax: (m.maxPos - evtMean) / evtSd, // positive side (reproduces imp-95583)
    gumbelZmin: (m.minNeg - -evtMean) / evtSd, // negative side (the new measurement)
    absRatioMinOverMax: Math.abs(m.minNeg) / m.maxPos, // ~1 => two-sided symmetric
  };
});

const zMins = ROWS.map((r) => r.gumbelZmin);
const zMaxs = ROWS.map((r) => r.gumbelZmax);
const meanGumbelZmin = zMins.reduce((s, z) => s + z, 0) / zMins.length;
const meanGumbelZmax = zMaxs.reduce((s, z) => s + z, 0) / zMaxs.length;
const maxAbsGumbelZmin = Math.max(...zMins.map((z) => Math.abs(z)));
const allMinWithinGumbel2 = ROWS.every((r) => Math.abs(r.gumbelZmin) < 2);
const absRatios = ROWS.map((r) => r.absRatioMinOverMax);
const meanAbsRatio = absRatios.reduce((s, v) => s + v, 0) / absRatios.length;

export const IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT = {
  ticket: 'imp-95599',
  source:
    'imp-95562 discrepancy tail (D = C - E over N hard-box windows at six heights, measured over the 1e6 Odlyzko ordinates via the imp-95562 band() tiling); the imp-95583 EVT check on max(D) extended here to the negative side min(D)',
  definitions: {
    discrepancy: 'D = C - E, C = local pointwise zero count, E = 2 Delta delta(T) mean-square envelope (imp-95562)',
    gumbelMin:
      'min of N iid N(0,sd): E[min] = -sd*(b_N + gamma_E a_N), sd[min] = sd*a_N*pi/sqrt(6) (same spread as the max by Gaussian symmetry)',
    gumbelZmin: 'gumbelZmin = (observed min(D) - E[min]) / sd[min] -- Gumbel-sd of the worst negative window from the EVT mean minimum',
  },
  rows: ROWS,
  aggregates: {
    meanGumbelZmin, // ~ +0.25: no height-persistent negative deficit
    meanGumbelZmax, // ~ -0.07: reproduces the imp-95583 positive-side mean
    maxAbsGumbelZmin, // < 1.5: worst negative window within ~1.2 Gumbel sd
    allWorstNegativeWindowsWithinTwoGumbelSd: allMinWithinGumbel2,
    meanAbsRatioMinOverMax: meanAbsRatio, // ~0.97: two-sided symmetric
    absRatioRange: {
      min: Math.min(...absRatios), // ~0.837
      max: Math.max(...absRatios), // ~1.062
    },
  },
  verdict:
    'ASSESSED: the imp-95562 discrepancy tail is two-sided-symmetric, confirming the assertion imp-95583 made but only checked on the positive side. Recomputing the most-negative window excess min(D) at each of six heights and comparing it to the Gumbel-predicted minimum -E[max] of N = nWindows iid N(0, sd(D)) draws, every point lies within |gumbelZmin| < 1.5 of the EVT mean (range -0.75 .. +1.21, mean ~ +0.25), so there is no height-persistent negative deficit and no negative arithmetic outlier. The ratio |min(D)|/max(D) runs 0.837 .. 1.062 (mean ~0.97), and the positive- and negative-side Gumbel-Z means are both small and opposite in sign (max ~ -0.07, min ~ +0.25): the tail is genuinely two-sided, not merely positive-bias-free. The recomputed min(D) reproduces imp-95562 exactly where the sign is resolved (min = -maxAbsExcess at T = 7e4, 1.5e5, 5e5). Report only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (EVT re-derivation + baked-data checks) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // Gumbel spot-check at N = 75
  const s2 = Math.sqrt(2 * Math.log(75));
  if (!approx(gumbelAN(75), 1 / s2, 1e-12)) throw new Error('imp-95599: a_N formula mismatch');
  // the EVT minimum is the negation of the EVT maximum (Gaussian symmetry)
  for (const r of ROWS)
    if (!approx(r.evtMeanMinExcess, -r.evtMeanMaxExcess, 1e-12))
      throw new Error('imp-95599: EVT min is not the negation of EVT max');
  // headline: every worst negative window within two Gumbel sd of the EVT mean minimum
  if (!allMinWithinGumbel2) throw new Error('imp-95599: a worst negative window exceeds two Gumbel sd -- outlier');
  if (!(maxAbsGumbelZmin < 2)) throw new Error('imp-95599: maxAbsGumbelZmin >= 2');
  // no height-persistent negative deficit: mean gumbelZmin small
  if (!(Math.abs(meanGumbelZmin) < 1)) throw new Error('imp-95599: mean gumbelZmin shows persistent deficit');
  // two-sided symmetry: |min|/max centered near 1
  if (!(meanAbsRatio > 0.75 && meanAbsRatio < 1.25))
    throw new Error('imp-95599: |min|/max ratio not centered on symmetry');
  // consistency with imp-95562: where maxAbs > maxPos the negative side is the abs-worst
  const consistency = [
    { N: 198, expectMin: -1.483 },
    { N: 291, expectMin: -1.759 },
    { N: 443, expectMin: -1.813 },
  ];
  for (const c of consistency) {
    const r = ROWS.find((x) => x.nWindows === c.N);
    if (!approx(r.observedMinExcess, c.expectMin, 1e-9))
      throw new Error('imp-95599: min(D) inconsistent with imp-95562 maxAbsExcess at N=' + c.N);
  }
})();

export default IMP95599_DISCREPANCY_NEGATIVE_TAIL_EVT;
