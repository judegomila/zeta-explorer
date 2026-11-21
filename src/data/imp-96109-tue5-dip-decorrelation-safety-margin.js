/**
 * imp-96109 -- ROBUSTNESS of the imp-96089 T = 1.5e5 significant-dip verdict to the
 * quasi-independence assumption: how far the effective de-correlation factor on the
 * non-overlapping hard boxes can fall before n_w drops below the chi-square crossover 79.
 *
 * imp-96089 declared the T = 1.5e5 below-envelope dip (-16.0 percent) SIGNIFICANT because the
 * recovered quasi-independent window count n_w = 291 exceeds the imp-96071 chi-square crossover
 * n_w_crossover = 78.66 (z = 1.92 sigma). It flagged the sole exit route: the verdict flips to NOISE
 * only if the EFFECTIVE independent-window count n_eff falls below the crossover, i.e. if the
 * de-correlation factor f = n_eff / n_w drops below crossover / n_w = 78.66 / 291 = 0.2703. imp-96089
 * called an f that small "implausible" but did not quantify it. This module quantifies it two ways --
 * a direct factor threshold and a serial-correlation (AR-1) model of the actual boundary sharing --
 * and reports the verdict safety margin.
 *
 * WHY THE BOXES ARE ONLY WEAKLY CORRELATED. The imp-95562 windowing tiles n_w NON-OVERLAPPING hard
 * boxes of full width 2*Delta, Delta = sqrt(T/2pi). Adjacent boxes are edge-to-edge, so the only
 * shared data is a single boundary. Each box holds L = 2*Delta*delta(T) zeros (delta = log(T/2pi)/2pi
 * the mean density); at T = 1.5e5 that is L = 495.8 zeros per box. The shared boundary is O(1) zeros
 * out of L, so any POSITIVE correlation the boundary induces between adjacent box statistics is
 * O(1/L) = 0.0020 -- and the O(1) constant here is generous, since the per-box statistic sd(C - E) is
 * a second-moment (variance) estimate averaged over ~L points, which suppresses boundary effects
 * further than the raw count would.
 *
 * TWO MODELS OF THE DE-CORRELATION FACTOR.
 *   Direct: n_eff = f * n_w. The verdict flips iff f < f_crit = n_w_crossover / n_w. At T = 1.5e5,
 *     f_crit = 0.2703: the boxes would have to behave as if 73 percent of them carried NO independent
 *     information.
 *   AR-1 serial correlation: model the tiled sequence as lag-1 correlation rho between adjacent boxes,
 *     n_eff = n_w * (1 - rho) / (1 + rho). Solving n_eff = n_w_crossover gives the critical POSITIVE
 *     correlation rho_crit = (n_w - n_w_crossover) / (n_w + n_w_crossover) = 0.5744 at T = 1.5e5.
 *     To demote the dip to noise adjacent boxes would need lag-1 correlation >= 0.57.
 *
 * FINDINGS.
 *  1. The boundary-sharing correlation estimate rho_boundary ~ 1/L = 0.00202 at T = 1.5e5 is about
 *     285x SMALLER than the rho_crit = 0.5744 needed to flip the verdict (safety ratio 284.8). The
 *     verdict is robust by a wide margin: the true adjacent-box correlation would have to be ~285x the
 *     physical boundary-share estimate before the dip fell into the noise floor.
 *  2. Direct-factor view: the de-correlation factor implied by rho_boundary is
 *     f_boundary = (1 - rho_boundary)/(1 + rho_boundary) = 0.99597, versus the f_crit = 0.2703
 *     threshold -- a safety margin of 0.726 in factor units (the factor can fall from ~0.996 all the
 *     way to 0.27 before the verdict changes).
 *  3. Sign of the real correlation helps, not hurts. For GUE the number fluctuations in ADJACENT
 *     non-overlapping intervals are ANTI-correlated (the count covariance across a shared edge is
 *     negative), so a realistic rho < 0 gives n_eff = n_w(1 - rho)/(1 + rho) > n_w -- it INCREASES the
 *     effective independent count and pushes the dip further into "significant". A positive rho large
 *     enough to flip the verdict is not just large, it is the wrong sign for the boundary physics.
 *  4. The two NOISE heights are unconditionally safe under this analysis. At T = 1e4 (n_w 75 < crossover
 *     537) and T = 3e5 (n_w 411 << crossover 73194) the crossover already exceeds n_w, so rho_crit is
 *     NEGATIVE (-0.755, -0.989): no positive de-correlation could ever make them significant, and any
 *     real (positive-or-negative) correlation leaves them noise. De-correlation only ever pushes a
 *     verdict TOWARD noise, so the classification is stable in both directions: the significant dip
 *     needs an implausible +0.57 correlation to fall, the noise dips can never rise.
 *
 * HONEST CAVEAT. rho_boundary ~ 1/L is an order-of-magnitude physical estimate of the boundary-sharing
 * correlation, not a measured GUE two-interval covariance; the exact adjacent-box correlation for the
 * sd(C - E) statistic is not computed here. The conclusion does not depend on its precise value: the
 * 285x gap between the O(1/L) boundary estimate and the +0.57 flip threshold, plus the wrong-sign
 * observation (real adjacent-interval fluctuations anti-correlate), leaves the significant verdict
 * robust to any plausible O(1) correction to rho_boundary. As imp-96089 noted, T = 1.5e5 at ~1.9 sigma
 * is significant but not overwhelming; this module bounds the quasi-independence risk, it does not
 * raise the confidence. Measurement/assessment only.
 *
 * VERDICT. The imp-96089 T = 1.5e5 significant-dip verdict is ROBUST to the quasi-independence
 * assumption: flipping it to noise needs the effective de-correlation factor to fall below
 * f_crit = 0.2703 (n_eff < 78.66), equivalently a POSITIVE lag-1 correlation rho >= 0.5744 between
 * adjacent tiled boxes -- about 285x the O(1/L) = 0.0020 boundary-sharing estimate, and of the opposite
 * sign to the (anti-correlated) GUE adjacent-interval physics. The two noise heights have negative
 * rho_crit and can never be promoted. Changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the verdict whose robustness this bounds)
 * @see imp-96071-mean-anchor-below-envelope-correction-vs-noise-floor (the chi-square crossover model)
 * @see imp-95562-meansquare-vs-pointwise-gap (the non-overlapping hard-box windowing)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same measured
 * literals imp-95562 baked over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; the window
 * counts, crossovers, and de-correlation analysis are recomputed here from the tiling geometry.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L zeros per box
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// imp-95562 non-overlapping hard-box tiling count: deterministic geometry, no zeros needed.
const SPAN_FRACTION = 0.3;
const T_MAX_ORDINATE = 600269.68;
const windowCount = (T) => {
  const upper = Math.min((1 + SPAN_FRACTION) * T, T_MAX_ORDINATE);
  const lower = (1 - SPAN_FRACTION) * T;
  return Math.floor((upper - lower) / (2 * halfWidth(T)));
};

// Same six measured literals imp-95562/imp-96049/imp-96089 baked.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218, nWindows: 75 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823, nWindows: 130 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689, nWindows: 198 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714, nWindows: 291 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199, nWindows: 411 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078, nWindows: 443 },
];

const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
const C0_mean = mean(offsets); // imp-95958/imp-96049/imp-96089 mean anchor
const cappedRatio = (T) => (SELBERG_C * logLog(T) + C0_mean) / gueNumberVariance(envelopeCount(T));

// AR-1 effective independent count: n_eff = n_w (1 - rho) / (1 + rho).
const arEffectiveFactor = (rho) => (1 - rho) / (1 + rho);
// Invert to the critical rho that drives n_eff to a target factor f = n_eff / n_w.
const rhoForFactor = (f) => (1 - f) / (1 + f);

const rows = MEASURED.map((m) => {
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar; // imp-95710 r(T)
  const rCap = cappedRatio(m.Tc);
  const residual = rCap - rMeasured;
  const belowEnvelope = residual < -1e-12;
  const relErr = Math.abs(residual) / rMeasured;
  const nwCrossover = belowEnvelope ? 2 / (relErr * relErr) : null; // imp-96071 crossover
  const nWindowsGeom = windowCount(m.Tc);
  const zerosPerBox = envelopeCount(m.Tc); // L
  const rhoBoundary = belowEnvelope ? 1 / zerosPerBox : null; // O(1/L) boundary-share estimate
  // Direct de-correlation factor threshold: verdict flips iff n_eff/n_w < f_crit = crossover/n_w.
  const factorThreshold = belowEnvelope ? nwCrossover / m.nWindows : null;
  const factorBoundary = belowEnvelope ? arEffectiveFactor(rhoBoundary) : null;
  const factorMargin = belowEnvelope ? factorBoundary - factorThreshold : null;
  // AR-1 view: the critical POSITIVE lag-1 correlation needed to reach the crossover.
  const rhoCrit = belowEnvelope ? rhoForFactor(factorThreshold) : null;
  const safetyRatio = belowEnvelope ? rhoCrit / rhoBoundary : null; // how many x the boundary estimate
  return {
    Tc: m.Tc,
    relPct: (residual / rMeasured) * 100,
    belowEnvelope,
    nWindows: m.nWindows,
    nWindowsGeom,
    nwCrossover,
    zerosPerBox,
    rhoBoundary,
    factorThreshold,
    factorBoundary,
    factorMargin,
    rhoCrit,
    safetyRatio,
  };
});

const belowRows = rows.filter((r) => r.belowEnvelope);
const t15 = rows.find((r) => r.Tc === 1.5e5);
const noiseUnconditional = belowRows.filter((r) => r.rhoCrit < 0).map((r) => r.Tc); // rho_crit < 0 => never promotable

export const IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN = {
  ticket: 'imp-96109',
  source:
    'imp-96089 declared the T = 1.5e5 below-envelope dip significant (n_w 291 > crossover 78.66, z 1.92) and named the sole exit: the verdict flips only if the effective de-correlation factor n_eff/n_w falls below crossover/n_w. This module quantifies that factor from the non-overlapping hard-box boundary sharing (direct and AR-1 models) and reports the safety margin. Measurements: the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  definitions: {
    zerosPerBox: 'L = 2*Delta*delta(T), Delta = sqrt(T/2pi), delta = log(T/2pi)/2pi: mean zeros in one width-2Delta hard box',
    rhoBoundary: 'rho_boundary ~ 1/L: order-of-magnitude estimate of the POSITIVE correlation induced between adjacent edge-to-edge boxes by the single shared boundary (O(1) shared zeros out of L)',
    factorThreshold: 'f_crit = n_w_crossover / n_w: the de-correlation factor below which the effective count n_eff drops under the chi-square crossover and the dip becomes noise',
    factorBoundary: 'f_boundary = (1 - rho_boundary)/(1 + rho_boundary): the effective de-correlation factor the boundary-sharing correlation actually implies (AR-1 model)',
    rhoCrit: 'rho_crit = (n_w - n_w_crossover)/(n_w + n_w_crossover): the POSITIVE lag-1 correlation that would drive n_eff = n_w(1-rho)/(1+rho) down to the crossover; negative when n_w < crossover (height unpromotable)',
    safetyRatio: 'rho_crit / rho_boundary: how many times larger than the boundary-share estimate the true correlation would have to be to flip the verdict',
  },
  meanAnchor: C0_mean,
  rows: belowRows.map((r) => ({
    Tc: r.Tc,
    relPct: r.relPct,
    nWindows: r.nWindows,
    nwCrossover: r.nwCrossover,
    zerosPerBox: r.zerosPerBox,
    rhoBoundary: r.rhoBoundary,
    factorThreshold: r.factorThreshold,
    factorBoundary: r.factorBoundary,
    factorMargin: r.factorMargin,
    rhoCrit: r.rhoCrit,
    safetyRatio: r.safetyRatio,
  })),
  significantDip: {
    Tc: t15.Tc,
    factorThreshold: t15.factorThreshold, // 0.2703
    rhoCrit: t15.rhoCrit, // 0.5744
    rhoBoundary: t15.rhoBoundary, // 0.00202
    safetyRatio: t15.safetyRatio, // 284.8
    factorMargin: t15.factorMargin, // 0.726
  },
  noiseHeightsUnpromotable: noiseUnconditional, // [1e4, 3e5]: rho_crit < 0, can never become significant
  caveat:
    'rho_boundary ~ 1/L is an order-of-magnitude estimate of the boundary-sharing correlation, not a measured GUE two-interval covariance for the sd(C - E) statistic. The conclusion does not depend on the exact value: the ~285x gap to the +0.57 flip threshold, plus the wrong-sign observation (real adjacent GUE interval fluctuations ANTI-correlate, which raises n_eff), leaves the significant verdict robust to any plausible O(1) correction. This bounds the quasi-independence risk; it does not raise the ~1.9-sigma confidence. Measurement/assessment only.',
  verdict:
    'The imp-96089 T = 1.5e5 significant-dip verdict is ROBUST to the quasi-independence assumption: flipping it to noise needs the de-correlation factor to fall below f_crit = 0.2703 (n_eff < 78.66), equivalently a POSITIVE lag-1 correlation rho >= 0.5744 between adjacent tiled boxes -- about 285x the O(1/L) = 0.0020 boundary-sharing estimate and of the opposite sign to the anti-correlated GUE adjacent-interval physics. The two noise heights (T = 1e4, T = 3e5) have NEGATIVE rho_crit and can never be promoted; de-correlation only ever pushes toward noise. Changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  // mean anchor reproduces imp-96049/imp-96071/imp-96089
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96109: C0_mean drifted from imp-96089');
  // window counts recovered from geometry match the imp-95562 baked counts
  if (at(1.0e4).nWindowsGeom !== 75) throw new Error('imp-96109: T = 1e4 window count not 75');
  if (at(1.5e5).nWindowsGeom !== 291) throw new Error('imp-96109: T = 1.5e5 window count not 291');
  if (at(3.0e5).nWindowsGeom !== 411) throw new Error('imp-96109: T = 3e5 window count not 411');
  // three below-envelope heights (same as imp-96089)
  if (belowRows.length !== 3) throw new Error('imp-96109: below-envelope count changed from 3');
  // crossovers reproduce imp-96089
  if (!approx(at(1.5e5).nwCrossover, 78.658, 0.01)) throw new Error('imp-96109: T = 1.5e5 crossover drifted');
  // zeros per box
  if (!approx(at(1.5e5).zerosPerBox, 495.779, 1e-2)) throw new Error('imp-96109: T = 1.5e5 zeros/box drifted');
  // significant-dip de-correlation analysis
  if (!approx(at(1.5e5).factorThreshold, 0.27031, 1e-4)) throw new Error('imp-96109: T = 1.5e5 factor threshold drifted');
  if (!approx(at(1.5e5).rhoCrit, 0.57443, 1e-4)) throw new Error('imp-96109: T = 1.5e5 rho_crit drifted');
  if (!approx(at(1.5e5).rhoBoundary, 0.0020170, 1e-6)) throw new Error('imp-96109: T = 1.5e5 rho_boundary drifted');
  if (!approx(at(1.5e5).safetyRatio, 284.79, 0.5)) throw new Error('imp-96109: T = 1.5e5 safety ratio drifted');
  if (!(at(1.5e5).factorMargin > 0.7)) throw new Error('imp-96109: T = 1.5e5 factor margin should exceed 0.7');
  // the flip requires POSITIVE correlation and it is far above the boundary estimate
  if (!(at(1.5e5).rhoCrit > at(1.5e5).rhoBoundary * 100))
    throw new Error('imp-96109: T = 1.5e5 rho_crit should be >100x the boundary estimate');
  // noise heights are unpromotable: rho_crit < 0 (crossover exceeds n_w)
  if (!(at(1.0e4).rhoCrit < 0)) throw new Error('imp-96109: T = 1e4 should be unpromotable (rho_crit < 0)');
  if (!(at(3.0e5).rhoCrit < 0)) throw new Error('imp-96109: T = 3e5 should be unpromotable (rho_crit < 0)');
  if (noiseUnconditional.length !== 2) throw new Error('imp-96109: expected exactly two unpromotable noise heights');
  // honesty gates
  if (!/NO QED/.test(IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN.verdict))
    throw new Error('imp-96109: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN.verdict))
    throw new Error('imp-96109: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN;
