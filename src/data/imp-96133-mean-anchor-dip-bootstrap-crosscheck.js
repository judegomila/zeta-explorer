/**
 * imp-96133 -- DIRECT-RESAMPLING CROSS-CHECK of the imp-96089 / imp-96114 below-envelope dip
 * significance. imp-96089 declared exactly one of the three below-envelope mean-anchor
 * number-variance dips significant (T = 1.5e5, z = 1.92 sigma) using the CHI-SQUARE z-score model:
 * a NORMAL-tail p-value read off z = (|residual|/r) / sqrt(2/n_w). That verdict rests on two
 * assumptions -- (a) the n_w non-overlapping windows are quasi-independent so the sd(C - E) estimator
 * has a chi-square sampling law, and (b) the normal approximation to that chi-square tail. This module
 * removes assumption (b): it re-derives the dip significance by a DIRECT parametric bootstrap of the
 * null sampling distribution of the sd(C - E) statistic, and asks whether the empirical p-value agrees
 * with the chi-square z = 1.92 verdict and whether T = 1e4 and T = 3e5 stay in the noise floor.
 *
 * METHOD (import-light, self-contained, seeded and reproducible).
 *  - Under the null the true number-variance ratio at a height is the envelope r_cap(T); the measured
 *    r_hat = sd(C - E)^2 / GUE_var is an n_w-window estimate, so its null law is
 *      r_hat = r_cap * G,  G = chi2_{n_w} / n_w  (mean 1, relative std sqrt(2/n_w)).
 *  - We DRAW G directly (Marsaglia-Tsang gamma sampler, chi2_k = 2*Gamma(k/2), fixed mulberry32 seed
 *    per height, N = 60000 draws) instead of reading a normal tail, and count how often a null
 *    fluctuation reaches the OBSERVED excursion e(T) = |r_measured / r_cap - 1| (the fractional gap of
 *    the measured ratio from the null mean r_cap). p_oneSided = P(G - 1 >= e), p_twoSided = P(|G-1| >= e).
 *  - A dip is called SIGNIFICANT iff the bootstrap two-sided p < 0.05 (the same ~2-sigma bar the
 *    z >= 1 chi-square test encodes), NOISE otherwise.
 *
 * FINDINGS (N = 60000, seeds fixed; the empirical p-values are Monte-Carlo estimates, MC std error
 * ~5e-4 at p ~ 0.015).
 *  1. T = 1.5e5 (deepest dip, n_w = 291, excursion 0.190): bootstrap p_oneSided ~ 0.0145,
 *     p_twoSided ~ 0.0221. The direct resampling AGREES with -- and is slightly SHARPER than -- the
 *     chi-square normal one-sided p ~ 0.0272 (from z = 1.923): both place the dip at the ~2-sigma /
 *     ~2-3 percent level. Verdict SIGNIFICANT, reproducing imp-96089.
 *  2. T = 1e4 (n_w = 75, excursion 0.065): bootstrap p_oneSided ~ 0.331, p_twoSided ~ 0.692 -- firmly
 *     inside the noise floor, agreeing with the chi-square z = 0.37 NOISE verdict.
 *  3. T = 3e5 (n_w = 411, excursion 0.005): bootstrap p_oneSided ~ 0.460, p_twoSided ~ 0.940 --
 *     unambiguously noise, agreeing with the chi-square z = 0.08 NOISE verdict.
 *  4. Exactly ONE of the three below-envelope dips is significant under the direct bootstrap, the same
 *     height (T = 1.5e5) the chi-square model flagged. The normal approximation was not distorting the
 *     verdict: the true chi-square tail at n_w = 291 is close enough to normal that the SIGNIFICANT /
 *     NOISE calls are unchanged.
 *
 * HONEST SUB-GAP (SG-96133-empirical-ordinate-bootstrap). This is a PARAMETRIC bootstrap: it resamples
 * the chi-square null law G = chi2_{n_w}/n_w, so it tests only assumption (b) (the normal tail
 * approximation), NOT assumption (a) (that the non-overlapping windows are quasi-independent and their
 * per-window (C - E) is Gaussian). A fully NON-PARAMETRIC block / circular bootstrap resampling the
 * per-window (C - E) values EMPIRICALLY over the 10^6 Odlyzko ordinates -- which would test assumption
 * (a) itself and detect any window de-correlation or heavy per-window tails -- still needs the zeros
 * bundle (src/data/zeros-to-1e6.js) and the per-window residuals, neither baked here; it is deferred.
 *
 * VERDICT. The direct parametric bootstrap of the sd(C - E) null sampling law CONFIRMS the imp-96089
 * chi-square verdict without the normal approximation: T = 1.5e5 is the single significant dip
 * (bootstrap two-sided p ~ 0.022, one-sided ~ 0.015, vs chi-square normal one-sided ~ 0.027), while
 * T = 1e4 (p ~ 0.69) and T = 3e5 (p ~ 0.94) stay firmly in the noise floor. The remaining
 * non-parametric ordinate-level bootstrap that would test the window-independence assumption itself is
 * the named sub-gap SG-96133-empirical-ordinate-bootstrap. Measurement / assessment only; changes no
 * bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays
 * PCC/GRH-gated.
 *
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the chi-square z-score verdict)
 * @see imp-96114-mean-anchor-dip-zscore-crosscheck (the independent z-score re-derivation)
 * @see imp-95562-meansquare-vs-pointwise-gap (the windowing whose n_w and sd(C - E) this resamples)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same measured
 * literals imp-95562 baked over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; every other
 * quantity, and the seeded Monte-Carlo bootstrap, is computed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;
const halfWidth = (T) => Math.sqrt(T / TWO_PI);
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T);
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Six measured imp-95562 sd(C - E) literals with the imp-95562 baked tiled window counts.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218, nWindows: 75 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823, nWindows: 130 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689, nWindows: 198 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714, nWindows: 291 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199, nWindows: 411 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078, nWindows: 443 },
];

const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const C0_mean = offsets.reduce((s, v) => s + v, 0) / offsets.length;
const cappedRatio = (T) => (SELBERG_C * logLog(T) + C0_mean) / gueNumberVariance(envelopeCount(T));

// --- seeded PRNG + chi-square sampler (deterministic, no zeros, IEEE-754 float arithmetic) ---
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Marsaglia-Tsang gamma(shape >= 1, scale = 1); standard normal via Box-Muller.
function gammaSample(rng, shape) {
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do {
      const u1 = rng();
      const u2 = rng();
      x = Math.sqrt(-2 * Math.log(u1 + 1e-300)) * Math.cos(TWO_PI * u2);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u + 1e-300) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}
// chi2_k / k = 2 * Gamma(k/2) / k, the relative null fluctuation of an n_w-window variance estimate.
const chi2OverK = (rng, k) => (2 * gammaSample(rng, k / 2)) / k;

// standard-normal upper tail via erfc, for the chi-square z-score reference p-value.
function erfc(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return 1 - (x >= 0 ? y : -y);
}

const N_DRAWS = 60000;
const SIG_LEVEL = 0.05; // two-sided bar matching the z >= 1 (~2-sigma) chi-square test

const rows = MEASURED.map((m) => {
  const gueVar = gueNumberVariance(envelopeCount(m.Tc));
  const rMeasured = (m.sdDiscrepancy * m.sdDiscrepancy) / gueVar;
  const rCap = cappedRatio(m.Tc);
  const residual = rCap - rMeasured;
  const belowEnvelope = residual < -1e-12;
  const relErr = Math.abs(residual) / rMeasured; // imp-96089 z-score normalization
  const zScore = belowEnvelope ? relErr / Math.sqrt(2 / m.nWindows) : null;
  const zNormalOneSided = belowEnvelope ? 0.5 * erfc(zScore / Math.SQRT2) : null;
  // bootstrap: null fluctuation about the null mean r_cap must reach the observed excursion
  const excursion = belowEnvelope ? Math.abs(rMeasured / rCap - 1) : null;
  let bootOneSided = null;
  let bootTwoSided = null;
  if (belowEnvelope) {
    const rng = mulberry32(0x9e3779b9 ^ m.nWindows);
    let up = 0;
    let two = 0;
    for (let i = 0; i < N_DRAWS; i++) {
      const g = chi2OverK(rng, m.nWindows);
      if (g - 1 >= excursion) up++;
      if (Math.abs(g - 1) >= excursion) two++;
    }
    bootOneSided = up / N_DRAWS;
    bootTwoSided = two / N_DRAWS;
  }
  const significant = belowEnvelope ? bootTwoSided < SIG_LEVEL : null;
  return {
    Tc: m.Tc,
    nWindows: m.nWindows,
    measuredRatio: rMeasured,
    envelopeRatio: rCap,
    belowEnvelope,
    excursion,
    zScore,
    zNormalOneSided,
    bootOneSided,
    bootTwoSided,
    significant,
  };
});

const belowRows = rows.filter((r) => r.belowEnvelope);
const significantHeights = belowRows.filter((r) => r.significant).map((r) => r.Tc);
const noiseHeights = belowRows.filter((r) => !r.significant).map((r) => r.Tc);
// the bootstrap SIGNIFICANT / NOISE calls match the chi-square z >= 1 calls at every below-envelope height
const agreesWithChiSquare = belowRows.every((r) => r.significant === r.zScore >= 1);

export const IMP96133_MEAN_ANCHOR_DIP_BOOTSTRAP_CROSSCHECK = {
  ticket: 'imp-96133',
  purpose:
    'Direct parametric-bootstrap cross-check of the imp-96089 below-envelope dip significance: resample the sd(C - E) null sampling law G = chi2_{n_w}/n_w (seeded Monte-Carlo, N = 60000) instead of reading a normal tail off z, and test whether the empirical p-value reproduces the chi-square z = 1.92 SIGNIFICANT verdict at T = 1.5e5 while T = 1e4 and T = 3e5 stay in the noise floor.',
  method: {
    nullLaw: 'r_hat = r_cap * chi2_{n_w}/n_w (mean 1, relative std sqrt(2/n_w))',
    draws: N_DRAWS,
    sampler: 'Marsaglia-Tsang gamma (chi2_k = 2*Gamma(k/2)), Box-Muller normal, mulberry32 seed per height',
    excursion: 'e(T) = |r_measured / r_cap - 1|: fractional gap of the measured ratio from the null mean r_cap',
    significanceBar: 'two-sided bootstrap p < 0.05 (the ~2-sigma bar the z >= 1 chi-square test encodes)',
  },
  meanAnchor: C0_mean,
  belowEnvelope: belowRows.map((r) => ({
    Tc: r.Tc,
    nWindows: r.nWindows,
    excursion: r.excursion,
    zScore: r.zScore,
    zNormalOneSided: r.zNormalOneSided,
    bootOneSided: r.bootOneSided,
    bootTwoSided: r.bootTwoSided,
    verdict: r.significant ? 'SIGNIFICANT' : 'NOISE',
  })),
  significantHeights, // [1.5e5]: the deepest dip stays significant under direct resampling
  noiseHeights, // [1e4, 3e5]
  agreesWithChiSquare,
  subGap:
    'SG-96133-empirical-ordinate-bootstrap: this is a PARAMETRIC bootstrap of the chi-square null (tests only the normal-tail approximation). A fully NON-PARAMETRIC block / circular bootstrap resampling the per-window (C - E) EMPIRICALLY over the 10^6 Odlyzko ordinates -- which would test the window-independence / Gaussian-window assumption itself -- still needs the zeros bundle and the per-window residuals, not baked here; deferred.',
  caveat:
    'The bootstrap p-values are seeded Monte-Carlo estimates (MC std error ~5e-4 at p ~ 0.015 for N = 60000), reproducible in Node per seed; cross-engine transcendental last-ULP differences move them only at the ~1e-4 level, far below the reported bands. Measurement / assessment only.',
  verdict:
    'The direct parametric bootstrap of the sd(C - E) null law CONFIRMS the imp-96089 chi-square verdict without the normal approximation: T = 1.5e5 is the single significant below-envelope dip (bootstrap two-sided p ~ 0.022, one-sided ~ 0.015, vs the chi-square normal one-sided ~ 0.027), while T = 1e4 (p ~ 0.69) and T = 3e5 (p ~ 0.94) stay firmly in the noise floor. The remaining non-parametric ordinate-level bootstrap that would test the window-independence assumption itself is the named sub-gap SG-96133-empirical-ordinate-bootstrap. Changes no bound; RH open; NO QED; no refereed bound is changed.',
};

// --- self-executing internal-consistency assertions (wide bands: MC + cross-engine tolerant) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  // mean anchor reproduces imp-96089/imp-96114
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96133: C0_mean drifted from imp-96089');
  // exactly the three imp-96089 below-envelope heights
  if (belowRows.length !== 3) throw new Error('imp-96133: below-envelope count changed from 3');
  // z-scores still reproduce imp-96089 (chi-square reference)
  if (!approx(at(1.0e4).zScore, 0.374, 5e-3)) throw new Error('imp-96133: T = 1e4 z-score drifted');
  if (!approx(at(1.5e5).zScore, 1.923, 5e-3)) throw new Error('imp-96133: T = 1.5e5 z-score drifted');
  if (!approx(at(3.0e5).zScore, 0.075, 5e-3)) throw new Error('imp-96133: T = 3e5 z-score drifted');
  // deepest dip: bootstrap p in the significant band, below the 5 percent bar
  if (!(at(1.5e5).bootTwoSided > 0.008 && at(1.5e5).bootTwoSided < 0.045))
    throw new Error('imp-96133: T = 1.5e5 bootstrap two-sided p left the expected ~0.022 band');
  if (!(at(1.5e5).bootOneSided > 0.004 && at(1.5e5).bootOneSided < 0.03))
    throw new Error('imp-96133: T = 1.5e5 bootstrap one-sided p left the expected ~0.015 band');
  if (at(1.5e5).significant !== true) throw new Error('imp-96133: T = 1.5e5 should stay SIGNIFICANT under the bootstrap');
  // the two noise heights: bootstrap p firmly in the noise floor
  if (!(at(1.0e4).bootTwoSided > 0.4)) throw new Error('imp-96133: T = 1e4 should be NOISE (large bootstrap p)');
  if (!(at(3.0e5).bootTwoSided > 0.6)) throw new Error('imp-96133: T = 3e5 should be NOISE (large bootstrap p)');
  if (at(1.0e4).significant !== false) throw new Error('imp-96133: T = 1e4 should be NOISE under the bootstrap');
  if (at(3.0e5).significant !== false) throw new Error('imp-96133: T = 3e5 should be NOISE under the bootstrap');
  // exactly one significant height and it is the deepest dip; bootstrap agrees with chi-square
  if (significantHeights.length !== 1 || significantHeights[0] !== 1.5e5)
    throw new Error('imp-96133: expected exactly one significant height, T = 1.5e5');
  if (!agreesWithChiSquare) throw new Error('imp-96133: bootstrap verdict disagrees with the chi-square z >= 1 calls');
  // honesty gates
  if (!/NO QED/.test(IMP96133_MEAN_ANCHOR_DIP_BOOTSTRAP_CROSSCHECK.verdict))
    throw new Error('imp-96133: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96133_MEAN_ANCHOR_DIP_BOOTSTRAP_CROSSCHECK.verdict))
    throw new Error('imp-96133: verdict dropped the no-refereed-bound-change banner');
  if (!/SG-96133-empirical-ordinate-bootstrap/.test(IMP96133_MEAN_ANCHOR_DIP_BOOTSTRAP_CROSSCHECK.subGap))
    throw new Error('imp-96133: sub-gap name missing');
})();

export default IMP96133_MEAN_ANCHOR_DIP_BOOTSTRAP_CROSSCHECK;
