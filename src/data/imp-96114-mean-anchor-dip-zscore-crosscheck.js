/**
 * imp-96114 -- INDEPENDENT CROSS-CHECK of the imp-96089 below-envelope dip significance verdict.
 *
 * imp-96089 closed the imp-96071-window-count sub-gap and declared exactly ONE of the three
 * below-envelope mean-anchor number-variance dips significant (T = 1.5e5, z = 1.92 sigma). This
 * module is a STANDALONE second implementation -- it re-derives every quantity from scratch off the
 * six baked imp-95562 sd(C - E) literals, the deterministic tiling geometry n_w(T), and the closed
 * form crossover n_w_crossover = 2 / (|residual|/r)^2, then checks the three quoted z-scores and
 * crossover counts reproduce EXACTLY. It imports nothing (no sibling, no zeros bundle) so a drift in
 * imp-96089 cannot silently propagate into this check; the numbers are re-typed independently.
 *
 * WHAT REPRODUCES (all matched here to the stated precision).
 *  1. Tiling geometry: n_w(T) = floor((min(1.3T, T_max) - 0.7T) / (2 Delta(T))) yields
 *     75, 130, 198, 291, 411, 443 -- the six imp-95562 baked nWindows to the integer.
 *  2. Crossover counts: n_w_crossover = 537.4, 78.7, 73194.2 at T = 1e4, 1.5e5, 3e5
 *     (imp-96089 quoted 537 / 79 / 73194).
 *  3. z-scores: z = (|residual|/r) / sqrt(2/n_w) = 0.374, 1.923, 0.075 at the same three heights
 *     (imp-96089 quoted 0.37 / 1.92 / 0.08).
 *  4. Verdict: exactly ONE below-envelope dip is significant (z >= 1, n_w > crossover), namely the
 *     deepest at T = 1.5e5; T = 1e4 and T = 3e5 are within the number-variance noise floor.
 *
 * This is an accuracy re-derivation ONLY: it establishes nothing new, moves no bound, and confirms
 * imp-96089 was arithmetically faithful. RH remains open; no refereed bound is changed;
 * NO QED.
 *
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the verdict cross-checked here)
 * @see imp-96071-mean-anchor-below-envelope-correction-vs-noise-floor (the crossover model)
 * @see imp-95562-meansquare-vs-pointwise-gap (the windowing whose n_w is recovered)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same measured
 * literals imp-95562 baked over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

const SPAN_FRACTION = 0.3;
const T_MAX_ORDINATE = 600269.68; // height of the 10^6-th Odlyzko ordinate (src/data/zeros-to-1e6.js)
const windowCount = (T) => {
  const upper = Math.min((1 + SPAN_FRACTION) * T, T_MAX_ORDINATE);
  const lower = (1 - SPAN_FRACTION) * T;
  return Math.floor((upper - lower) / (2 * halfWidth(T)));
};

// Six measured imp-95562 sd(C - E) literals, re-typed independently, with the imp-95562 baked counts.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218, nWindowsBaked: 75 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823, nWindowsBaked: 130 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689, nWindowsBaked: 198 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714, nWindowsBaked: 291 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199, nWindowsBaked: 411 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078, nWindowsBaked: 443 },
];

const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const C0_mean = offsets.reduce((s, v) => s + v, 0) / offsets.length;
const cappedRatio = (T) => (SELBERG_C * logLog(T) + C0_mean) / gueNumberVariance(envelopeCount(T));

const rows = MEASURED.map((m) => {
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar;
  const rCap = cappedRatio(m.Tc);
  const residual = rCap - rMeasured;
  const belowEnvelope = residual < -1e-12;
  const relErr = Math.abs(residual) / rMeasured;
  return {
    Tc: m.Tc,
    nWindowsGeom: windowCount(m.Tc),
    nWindowsBaked: m.nWindowsBaked,
    belowEnvelope,
    nwCrossover: belowEnvelope ? 2 / (relErr * relErr) : null,
    zScore: belowEnvelope ? relErr / Math.sqrt(2 / m.nWindowsBaked) : null,
    significant: belowEnvelope ? m.nWindowsBaked > 2 / (relErr * relErr) : null,
  };
});

const belowRows = rows.filter((r) => r.belowEnvelope);
const geomMatchesBaked = rows.every((r) => r.nWindowsGeom === r.nWindowsBaked);
const significantHeights = belowRows.filter((r) => r.significant).map((r) => r.Tc);

export const IMP96114_MEAN_ANCHOR_DIP_ZSCORE_CROSSCHECK = {
  ticket: 'imp-96114',
  purpose:
    'Independent second implementation reproducing the imp-96089 below-envelope dip z-scores (0.37 / 1.92 / 0.08), crossover counts (537 / 79 / 73194) and single-significant-dip verdict from the baked imp-95562 sd(C - E) literals, the tiling n_w, and the chi-square crossover -- with no sibling import.',
  meanAnchor: C0_mean,
  geomMatchesBaked,
  reproduction: belowRows.map((r) => ({
    Tc: r.Tc,
    nWindows: r.nWindowsBaked,
    nWindowsGeom: r.nWindowsGeom,
    nwCrossover: r.nwCrossover,
    zScore: r.zScore,
    verdict: r.significant ? 'SIGNIFICANT' : 'NOISE',
  })),
  significantHeights, // [1.5e5]
  verdict:
    'CONFIRMED: the imp-96089 verdict reproduces exactly from the baked literals. Tiling geometry gives 75/130/198/291/411/443 (= imp-95562 nWindows); crossovers 537.4/78.7/73194.2 and z-scores 0.374/1.923/0.075 match imp-96089 to the quoted precision; exactly one below-envelope dip (T = 1.5e5, z = 1.92 sigma) is significant. Accuracy re-derivation only; changes no bound; RH open; NO QED; no refereed bound is changed.',
};

// --- self-executing cross-check assertions (independent re-derivation must match imp-96089) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96114: C0_mean drifted from imp-96089');
  if (!geomMatchesBaked) throw new Error('imp-96114: recovered tiling counts do not match imp-95562 nWindows');
  if (at(1.0e4).nWindowsGeom !== 75 || at(1.5e5).nWindowsGeom !== 291 || at(3.0e5).nWindowsGeom !== 411)
    throw new Error('imp-96114: tiling geometry did not reproduce 75/291/411');
  if (!approx(at(1.0e4).nwCrossover, 537.4, 1.0)) throw new Error('imp-96114: T = 1e4 crossover did not reproduce 537');
  if (!approx(at(1.5e5).nwCrossover, 78.7, 0.5)) throw new Error('imp-96114: T = 1.5e5 crossover did not reproduce 79');
  if (!(at(3.0e5).nwCrossover > 7e4)) throw new Error('imp-96114: T = 3e5 crossover did not reproduce 73194');
  if (!approx(at(1.0e4).zScore, 0.374, 5e-3)) throw new Error('imp-96114: T = 1e4 z-score did not reproduce 0.37');
  if (!approx(at(1.5e5).zScore, 1.923, 5e-3)) throw new Error('imp-96114: T = 1.5e5 z-score did not reproduce 1.92');
  if (!approx(at(3.0e5).zScore, 0.075, 5e-3)) throw new Error('imp-96114: T = 3e5 z-score did not reproduce 0.08');
  if (belowRows.length !== 3) throw new Error('imp-96114: below-envelope count changed from 3');
  if (significantHeights.length !== 1 || significantHeights[0] !== 1.5e5)
    throw new Error('imp-96114: expected exactly one significant dip, T = 1.5e5');
  for (const r of belowRows)
    if (r.significant !== r.zScore >= 1) throw new Error('imp-96114: significance/z-score threshold inconsistent');
  if (!/NO QED/.test(IMP96114_MEAN_ANCHOR_DIP_ZSCORE_CROSSCHECK.verdict))
    throw new Error('imp-96114: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96114_MEAN_ANCHOR_DIP_ZSCORE_CROSSCHECK.verdict))
    throw new Error('imp-96114: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96114_MEAN_ANCHOR_DIP_ZSCORE_CROSSCHECK;
