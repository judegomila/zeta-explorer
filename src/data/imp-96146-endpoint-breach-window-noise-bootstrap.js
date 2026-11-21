/**
 * imp-96146 -- PER-WINDOW NOISE BOOTSTRAP of the two imp-96132 endpoint breaches.
 * imp-96132 extended the imp-96112 max-anchor window-robustness sweep to the other four
 * imp-96090 held-out heights and found 46 of 48 configs cap but TWO breach: T = 2e4 at the
 * coarse window k = 2 (margin -0.47%) and T = 4e5 at the fine window k = 0.5 (margin -0.0019%),
 * each a single adversarial extreme window while the imp-96090 canonical window caps comfortably
 * at every height. Its named sub-gap imp-96132-endpoint-window-breach asks whether those two
 * shallow breaches are STATISTICALLY SIGNIFICANT or lie inside the sd(C - E) noise of a single
 * estimator window. This module runs the imp-96133 direct-resampling bootstrap at exactly those
 * two breach configs and reads off the empirical p-values.
 *
 * METHOD (import-light, self-contained, seeded and reproducible; the same parametric bootstrap
 * imp-96133 used for the below-envelope dips, applied here to the upward endpoint breaches).
 *  - Under the null the true number-variance ratio at a height/window is the max-anchor envelope
 *    r_cap^max(T); the measured r_hat = sd(C - E)^2 / V_GUE(L) is an n_w-window estimate, so its
 *    null law is r_hat = r_cap * G, G = chi2_{n_w}/n_w (mean 1, relative std sqrt(2/n_w)).
 *  - We DRAW G directly (Marsaglia-Tsang gamma sampler, chi2_k = 2*Gamma(k/2), fixed mulberry32
 *    seed per window, N = 60000 draws) and count how often a null fluctuation reaches the OBSERVED
 *    excursion e = |r_measured / r_cap - 1| (here e > 0: the measured ratio pokes ABOVE the
 *    envelope). p_oneSided = P(G - 1 >= e), p_twoSided = P(|G - 1| >= e).
 *  - A breach is called SIGNIFICANT iff the two-sided bootstrap p < 0.05 (the ~2-sigma bar), and
 *    NOISE otherwise.
 *
 * FINDINGS (N = 60000, seeds fixed; MC std error ~2e-3 at these large p).
 *  1. T = 2e4, k = 2 (n_w = 53, per-window relative noise sqrt(2/53) = 0.194): the -0.47% margin
 *     is an excursion of only e = 0.00473 of the ratio above the envelope -- roughly 1/40 of the
 *     single-window noise. Bootstrap p_oneSided ~ 0.464, p_twoSided ~ 0.980; chi-square z = 0.024.
 *     Firmly NOISE.
 *  2. T = 4e5, k = 0.5 (n_w = 962, per-window noise sqrt(2/962) = 0.0456): the -0.0019% margin is
 *     an excursion of e = 1.93e-5, ~1/2360 of the single-window noise -- essentially on the
 *     envelope. Bootstrap p_oneSided ~ 0.491, p_twoSided ~ 0.9997; chi-square z = 0.00042.
 *     Unambiguously NOISE.
 *  3. NEITHER endpoint breach is significant: both sit deep inside the sd(C - E) noise of a single
 *     estimator window. The -0.47% and -0.0019% margins look alarming as raw percentages only
 *     because the max-anchor robustness margin is itself narrow at the endpoint heights; measured
 *     against the actual per-window sampling noise the excursions are ~0.02 sigma and ~0.0004 sigma.
 *
 * VERDICT. Both imp-96132 endpoint breaches are ESTIMATOR NOISE, not real cap-sign violations.
 * The per-window bootstrap places T = 2e4 (k = 2) at two-sided p ~ 0.98 and T = 4e5 (k = 0.5) at
 * two-sided p ~ 0.9997 -- neither approaches the 5% significance bar. So the imp-96112
 * "sign does not depend on the window choice" claim is NOT actually broken at the endpoint heights:
 * the two breaching windows are noise fluctuations of a single adversarial estimator, and the
 * max-anchor cap sign is statistically uniform across the held-out set once per-window noise is
 * accounted for. The imp-96090 canonical-window cap was never touched. Measurement / assessment
 * only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side
 * route stays PCC/GRH-gated.
 *
 * HONEST SUB-GAP (SG-96146-empirical-ordinate-bootstrap). This is the SAME parametric bootstrap as
 * imp-96133: it resamples the chi-square null law G = chi2_{n_w}/n_w, so it tests only the normal-tail
 * / sampling-law model, NOT the assumption that the non-overlapping windows are quasi-independent and
 * their per-window (C - E) is Gaussian. A fully NON-PARAMETRIC block / circular bootstrap resampling
 * the per-window (C - E) EMPIRICALLY over the 10^6 Odlyzko ordinates (src/data/zeros-to-1e6.js) -- the
 * same deferred SG-96133 work -- would test that assumption directly; not baked here, deferred. The
 * conclusion here is robust regardless: at p ~ 0.98 / 0.9997 no plausible tail correction reaches 0.05.
 *
 * @see imp-96132-max-anchor-window-robustness-four-heights (the two endpoint breaches this bootstraps)
 * @see imp-96133-mean-anchor-dip-bootstrap-crosscheck (the parametric bootstrap method reused here)
 * @see imp-96112-max-anchor-margin-window-robustness (the sign-independence claim this defends)
 *
 * Import-light: no zeros bundle, no sibling imports. The two breach configs (sd, mean local count L,
 * window count n_w) are the imp-96132 baked offline literals; the max anchor, the envelope and the
 * seeded Monte-Carlo bootstrap are recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);

const halfWidth = (T) => Math.sqrt(T / TWO_PI);
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T);
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// The six imp-95562 fit heights; the max anchor is the max in-sample offset (imp-95722/imp-96132).
const FIT = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];
const fitOffsets = FIT.map((m) => m.sd * m.sd - SELBERG_C * logLog(m.Tc));
const C0_max = Math.max(...fitOffsets); // imp-95722 in-sample max offset anchor
const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T));

// The two imp-96132 endpoint breach configs (sd, mean local count L, window count n_w baked
// offline over the 10^6 Odlyzko ordinates in tmp/imp-96132-window-robustness-four-heights.mjs).
const BREACHES = [
  { Tc: 2.0e4, tag: 'k=2', axis: 'half-width', sd: 6.907808e-1, meanL: 2.850101e2, nWin: 53 },
  { Tc: 4.0e5, tag: 'k=0.5', axis: 'half-width', sd: 6.511269e-1, meanL: 4.384063e2, nWin: 962 },
];

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

const rows = BREACHES.map((b) => {
  const rMeasured = (b.sd * b.sd) / gueNumberVariance(b.meanL);
  const rCap = cappedRatio(b.Tc, C0_max);
  const excursion = rMeasured / rCap - 1; // > 0: the measured ratio pokes above the envelope
  const marginRelPct = ((rCap - rMeasured) / rMeasured) * 100; // matches imp-96132 breach margin sign
  const relErr = Math.abs(rMeasured - rCap) / rMeasured;
  const perWindowNoise = Math.sqrt(2 / b.nWin);
  const zScore = relErr / perWindowNoise;
  const zNormalOneSided = 0.5 * erfc(zScore / Math.SQRT2);
  const e = Math.abs(excursion);
  const rng = mulberry32(0x9e3779b9 ^ b.nWin);
  let up = 0;
  let two = 0;
  for (let i = 0; i < N_DRAWS; i++) {
    const g = chi2OverK(rng, b.nWin);
    if (g - 1 >= e) up++;
    if (Math.abs(g - 1) >= e) two++;
  }
  const bootOneSided = up / N_DRAWS;
  const bootTwoSided = two / N_DRAWS;
  const significant = bootTwoSided < SIG_LEVEL;
  return {
    Tc: b.Tc,
    tag: b.tag,
    nWindows: b.nWin,
    measuredRatio: rMeasured,
    envelopeRatio: rCap,
    marginRelPct,
    excursion,
    perWindowNoise,
    excursionInSigma: e / perWindowNoise,
    zScore,
    zNormalOneSided,
    bootOneSided,
    bootTwoSided,
    verdict: significant ? 'SIGNIFICANT' : 'NOISE',
  };
});

const anySignificant = rows.some((r) => r.verdict === 'SIGNIFICANT');
const allNoise = rows.every((r) => r.verdict === 'NOISE');

export const IMP96146_ENDPOINT_BREACH_WINDOW_NOISE_BOOTSTRAP = {
  ticket: 'imp-96146',
  purpose:
    'Per-window sd(C - E) noise bootstrap of the two imp-96132 endpoint breaches (T = 2e4 coarse k = 2 at margin -0.47%, T = 4e5 fine k = 0.5 at margin -0.0019%): resample the sd(C - E) null sampling law G = chi2_{n_w}/n_w (seeded Monte-Carlo, N = 60000, the imp-96133 method) at exactly those two configs and read off whether the upward breaches are statistically significant or lie inside single-window estimator noise.',
  method: {
    nullLaw: 'r_hat = r_cap^max * chi2_{n_w}/n_w (mean 1, relative std sqrt(2/n_w))',
    draws: N_DRAWS,
    sampler: 'Marsaglia-Tsang gamma (chi2_k = 2*Gamma(k/2)), Box-Muller normal, mulberry32 seed per window',
    excursion: 'e = |r_measured / r_cap^max - 1|: fractional gap of the measured ratio above the envelope',
    significanceBar: 'two-sided bootstrap p < 0.05 (the ~2-sigma bar the z >= 1 chi-square test encodes)',
  },
  maxAnchor: { C0_max },
  breaches: rows.map((r) => ({
    Tc: r.Tc,
    window: r.tag,
    nWindows: r.nWindows,
    marginRelPct: r.marginRelPct,
    excursion: r.excursion,
    excursionInSigma: r.excursionInSigma,
    zScore: r.zScore,
    zNormalOneSided: r.zNormalOneSided,
    bootOneSided: r.bootOneSided,
    bootTwoSided: r.bootTwoSided,
    verdict: r.verdict,
  })),
  allNoise,
  anySignificant,
  subGap:
    'SG-96146-empirical-ordinate-bootstrap: this is the same PARAMETRIC bootstrap as imp-96133 (resamples the chi-square null law, tests only the sampling-law model). The fully NON-PARAMETRIC block / circular bootstrap resampling per-window (C - E) EMPIRICALLY over the 10^6 Odlyzko ordinates (the deferred SG-96133 work) would test the window-independence / Gaussian-window assumption itself; not baked here, deferred. The verdict is robust to that: at two-sided p ~ 0.98 / 0.9997 no plausible tail correction reaches 0.05.',
  caveat:
    'The bootstrap p-values are seeded Monte-Carlo estimates (MC std error ~2e-3 at these large p for N = 60000), reproducible in Node per seed; cross-engine transcendental last-ULP differences move them only at the ~1e-3 level, far below the reported bands. Measurement / assessment only; changes no bound.',
  verdict:
    'Both imp-96132 endpoint breaches are ESTIMATOR NOISE, not real cap-sign violations: the per-window bootstrap places T = 2e4 (k = 2) at two-sided p ~ 0.98 (excursion ~0.02 sigma of the single-window noise) and T = 4e5 (k = 0.5) at two-sided p ~ 0.9997 (~0.0004 sigma), neither near the 5% bar. So the imp-96112 sign-independence claim is NOT actually broken at the endpoint heights -- the two breaching windows are noise fluctuations of a single adversarial estimator, and the max-anchor cap sign is statistically uniform across the held-out set once per-window noise is accounted for; the imp-96090 canonical-window cap was never touched. Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (wide bands: MC + cross-engine tolerant) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  // max anchor reproduces imp-95722/imp-96090/imp-96132
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96146: C0_max drifted from imp-95722');
  // exactly the two imp-96132 endpoint breach configs
  if (rows.length !== 2) throw new Error('imp-96146: expected exactly the two endpoint breach configs');
  if (!at(2.0e4) || at(2.0e4).tag !== 'k=2') throw new Error('imp-96146: T=2e4 breach config not the coarse k=2 window');
  if (!at(4.0e5) || at(4.0e5).tag !== 'k=0.5') throw new Error('imp-96146: T=4e5 breach config not the fine k=0.5 window');
  // the breaches reproduce the imp-96132 margins (upward breach: marginRelPct < 0)
  if (!(at(2.0e4).marginRelPct < -0.4 && at(2.0e4).marginRelPct > -0.6))
    throw new Error('imp-96146: T=2e4 k=2 margin drifted from imp-96132 ~ -0.47%');
  if (!(at(4.0e5).marginRelPct < 0 && at(4.0e5).marginRelPct > -0.01))
    throw new Error('imp-96146: T=4e5 k=0.5 margin drifted from imp-96132 marginally-negative');
  // both excursions are a tiny fraction of the single-window noise
  if (!(at(2.0e4).excursionInSigma < 0.1)) throw new Error('imp-96146: T=2e4 excursion unexpectedly large in sigma units');
  if (!(at(4.0e5).excursionInSigma < 0.01)) throw new Error('imp-96146: T=4e5 excursion unexpectedly large in sigma units');
  // MAIN FINDING: both breaches are NOISE -- large two-sided bootstrap p, none significant
  if (!(at(2.0e4).bootTwoSided > 0.9)) throw new Error('imp-96146: T=2e4 breach should be NOISE (large bootstrap p)');
  if (!(at(4.0e5).bootTwoSided > 0.99)) throw new Error('imp-96146: T=4e5 breach should be NOISE (large bootstrap p)');
  if (at(2.0e4).verdict !== 'NOISE') throw new Error('imp-96146: T=2e4 breach should be NOISE');
  if (at(4.0e5).verdict !== 'NOISE') throw new Error('imp-96146: T=4e5 breach should be NOISE');
  if (anySignificant) throw new Error('imp-96146: no endpoint breach should be significant');
  if (!allNoise) throw new Error('imp-96146: both endpoint breaches should read NOISE');
  // honesty gates
  if (!/NO QED/.test(IMP96146_ENDPOINT_BREACH_WINDOW_NOISE_BOOTSTRAP.verdict))
    throw new Error('imp-96146: verdict dropped the NO QED banner');
  if (!/RH open/.test(IMP96146_ENDPOINT_BREACH_WINDOW_NOISE_BOOTSTRAP.verdict))
    throw new Error('imp-96146: verdict dropped the RH open banner');
  if (!/refereed bound is changed/i.test(IMP96146_ENDPOINT_BREACH_WINDOW_NOISE_BOOTSTRAP.verdict))
    throw new Error('imp-96146: verdict dropped the no-refereed-bound-change banner');
  if (!/SG-96146-empirical-ordinate-bootstrap/.test(IMP96146_ENDPOINT_BREACH_WINDOW_NOISE_BOOTSTRAP.subGap))
    throw new Error('imp-96146: sub-gap name missing');
})();

export default IMP96146_ENDPOINT_BREACH_WINDOW_NOISE_BOOTSTRAP;
