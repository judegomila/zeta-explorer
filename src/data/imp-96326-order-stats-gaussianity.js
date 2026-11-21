/**
 * imp-96326 -- Is the FULL per-window C - E discrepancy body Gaussian, not just its max?
 *
 * imp-96271 tested only the batch MAXIMUM: worstSigma = maxPosExcess/sdDiscrepancy
 * against the Gumbel E[max]+/-sd, finding z in [-1.10,+1.85] and calling the imp-95562
 * "Gaussian-tailed" claim supported at the extreme. It never tested the BODY of the
 * per-window discrepancy distribution. This module does.
 *
 * METHOD (offline: tmp/imp-96326-order-stats-gaussianity.mjs, over the 10^6 Odlyzko
 * ordinates in src/data/zeros-to-1e6.js, using the SAME non-overlapping 2*Delta(T_c)
 * tiling as tmp/imp-95562-msq-vs-pointwise.mjs so nWindows / mean / sd reproduce the
 * imp-95562 rows exactly). At each of the six imp-95562 heights we collect the full
 * per-window discrepancy array D = C - E, standardize it by its sample mean and sd,
 * and test the WHOLE standardized distribution against a standard Gaussian with:
 *   - Kolmogorov-Smirnov statistic KS = max|F_n - Phi| (mean+sd estimated =>
 *     Lilliefors; compared to the classical 5% critical value ~ 0.886/sqrt(n)),
 *   - Anderson-Darling A^2 with the D'Agostino-Stephens small-sample adjustment
 *     A2star = A2(1 + 0.75/n + 2.25/n^2) and its case-3 p-value (5% critical 0.752).
 * A^2 up-weights the tails, so it is the stricter of the two here.
 *
 * FINDING. The per-window discrepancy BODY is Gaussian at accessible heights, with a
 * single mild low-height caveat that AD (not KS) detects:
 *   - KS passes at ALL six heights (KS < the 0.886/sqrt(n) 5% critical value
 *     everywhere; KS range 0.030-0.085).
 *   - Anderson-Darling passes at 5 of 6 heights (p_AD 0.29-0.90 for T >= 3e4). The
 *     sole failure is the lowest height / smallest batch T = 1e4, n = 75, where
 *     A2star = 0.859 gives p_AD = 0.027 (< 0.05) -- a marginal tail-shape deviation.
 * This is the SAME height imp-96271 singled out at the extreme (the only one whose
 * worst window exceeded the leading sqrt(2 ln n)), so the two views agree: the T=1e4
 * batch is the one mild non-Gaussian outlier, and it is a small-sample / low-height
 * effect that vanishes for every T >= 3e4. The imp-95562 "Gaussian" claim is thus
 * SUPPORTED for the distribution body at T >= 3e4 and MARGINALLY QUALIFIED (AD p=0.027,
 * KS still passing) at the smallest T=1e4 batch.
 *
 * CAVEAT. D = C - E has an integer count part C, so the marginal is quasi-discrete;
 * the KS/AD statistics probe the SHAPE of the standardized body, not a strictly
 * continuous null. The composite (estimated-parameter) p-values are approximate.
 *
 * Import-light: no zeros bundle, no sibling imports. Per-height n / KS / A2 / A2star /
 * p_AD are baked literals from the offline run; the critical values are re-derived.
 * Measurement only; uses baked offline order statistics; changes no bound; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 * @see imp-96271-worst-excess-evt-gaussianity (the batch-maximum test this extends)
 * @see imp-95562-meansquare-vs-pointwise-gap (finding 2, the claim under test)
 */

// Baked from tmp/imp-96326-order-stats-gaussianity.mjs over the 10^6 Odlyzko ordinates.
// n / mean / sd reproduce the imp-95562 rows; ks / A2 / A2star / pAD are the measured
// order-statistics goodness-of-fit results for the standardized per-window body.
const MEASURED = [
  { Tc: 1.0e4, n: 75, mean: -0.0323, sd: 0.6218, ks: 0.0847, A2: 0.8503, A2star: 0.8591, pAD: 0.0274 },
  { Tc: 3.0e4, n: 130, mean: 0.0069, sd: 0.5823, ks: 0.0663, A2: 0.4369, A2star: 0.4395, pAD: 0.2925 },
  { Tc: 7.0e4, n: 198, mean: 0.0182, sd: 0.5689, ks: 0.0314, A2: 0.1878, A2star: 0.1885, pAD: 0.9017 },
  { Tc: 1.5e5, n: 291, mean: -0.0253, sd: 0.6714, ks: 0.0314, A2: 0.2993, A2star: 0.3001, pAD: 0.5822 },
  { Tc: 3.0e5, n: 411, mean: -0.0369, sd: 0.6199, ks: 0.0355, A2: 0.4135, A2star: 0.4142, pAD: 0.3357 },
  { Tc: 5.0e5, n: 443, mean: -0.0051, sd: 0.6078, ks: 0.0300, A2: 0.3737, A2star: 0.3743, pAD: 0.4158 },
];

// Classical 5% critical values (re-derived here, not baked).
const ksCrit05 = (n) => 0.886 / Math.sqrt(n); // Lilliefors, mean+sd estimated
const AD_CRIT_05 = 0.752; // Anderson-Darling, estimated params (Stephens case 3)

const ROWS = MEASURED.map((m) => {
  const ksc = ksCrit05(m.n);
  return {
    Tc: m.Tc,
    nWindows: m.n,
    mean: m.mean,
    sd: m.sd,
    ks: m.ks, // Kolmogorov-Smirnov statistic vs standard Gaussian
    ksCrit05: ksc, // 0.886/sqrt(n)
    ksGaussian: m.ks < ksc, // whole body passes KS at 5%
    A2: m.A2, // raw Anderson-Darling
    A2star: m.A2star, // small-sample adjusted
    adCrit05: AD_CRIT_05,
    pAD: m.pAD, // approximate AD p-value
    adGaussian: m.A2star < AD_CRIT_05, // body passes AD at 5%
    bothGaussian: m.ks < ksc && m.A2star < AD_CRIT_05,
  };
});

const nKSpass = ROWS.filter((r) => r.ksGaussian).length;
const nADpass = ROWS.filter((r) => r.adGaussian).length;
const allKSpass = nKSpass === ROWS.length;
const allADpass = nADpass === ROWS.length;
const pADmin = Math.min(...ROWS.map((r) => r.pAD));
const pADmax = Math.max(...ROWS.map((r) => r.pAD));
const adFailures = ROWS.filter((r) => !r.adGaussian).map((r) => r.Tc);

export const IMP96326_ORDER_STATS_GAUSSIANITY = {
  ticket: 'imp-96326',
  source:
    'tmp/imp-96326-order-stats-gaussianity.mjs over src/data/zeros-to-1e6.js (10^6 Odlyzko ordinates), same non-overlapping 2*Delta(T_c) tiling as imp-95562; baked per-height n / KS / A2 / A2star / p_AD',
  definitions: {
    discrepancy: 'D = C - E per non-overlapping window; C = local pointwise zero count, E = 2 Delta delta(T) mean-square envelope',
    standardize: 'z = (D - sampleMean) / sampleSd per height, then tested against standard-normal Phi',
    ks: 'Kolmogorov-Smirnov max|F_n - Phi| with mean+sd estimated (Lilliefors); 5% critical ~ 0.886/sqrt(n)',
    ad: 'Anderson-Darling A^2, small-sample adjusted A2star = A2(1 + 0.75/n + 2.25/n^2); 5% critical 0.752, tail-weighted so stricter than KS',
  },
  rows: ROWS,
  aggregates: {
    nHeights: ROWS.length,
    nKSpass, // 6 of 6
    nADpass, // 5 of 6
    allHeightsKSGaussian: allKSpass, // true
    allHeightsADGaussian: allADpass, // false -- T=1e4 marginal
    pADrange: { min: pADmin, max: pADmax }, // [0.0274, 0.9017]
    adFailureHeights: adFailures, // [1e4]
  },
  verdict:
    'MEASURED order statistics of the full per-window (C - E) body on actual zeta zeros: the distribution is Gaussian at accessible heights, with one mild low-height caveat. Kolmogorov-Smirnov passes at ALL six heights (KS < 0.886/sqrt(n) everywhere, KS 0.030-0.085). Anderson-Darling -- which up-weights the tails -- passes at 5 of 6 heights (p_AD 0.29-0.90 for T >= 3e4); the sole failure is the lowest height / smallest batch T = 1e4, n = 75, where A2star = 0.859 gives p_AD = 0.027, a marginal tail-shape deviation. This is the SAME T=1e4 batch imp-96271 singled out at the extreme (the only height whose worst window exceeded the leading sqrt(2 ln n)), so the body test and the maximum test agree: T=1e4 is the one mild small-sample outlier and the body is fully Gaussian for every T >= 3e4. The imp-95562 Gaussian claim is SUPPORTED for the body at T >= 3e4 and marginally qualified (AD p=0.027, KS still passing) at T=1e4. D has an integer count part so the marginal is quasi-discrete and the composite p-values are approximate. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated regardless.',
};

// --- self-executing internal-consistency assertions (formula/threshold re-derivation) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // KS critical value re-derivation at a spot batch size
  if (!approx(ROWS[0].ksCrit05, 0.886 / Math.sqrt(75), 1e-12)) throw new Error('imp-96326: ksCrit05 re-derivation mismatch');
  // A2star must exceed A2 (positive small-sample inflation) at every height
  for (const r of ROWS) if (!(r.A2star >= r.A2)) throw new Error('imp-96326: A2star below raw A2');
  // core finding: KS passes everywhere
  if (!allKSpass) throw new Error('imp-96326: a height failed the KS body test');
  // core finding: AD passes at 5 of 6, the single failure being the lowest height
  if (nADpass !== 5) throw new Error('imp-96326: unexpected AD pass count (expected 5 of 6)');
  if (!(adFailures.length === 1 && adFailures[0] === 1.0e4)) throw new Error('imp-96326: AD failure not the T=1e4 batch');
  // the T=1e4 AD failure is marginal (p below but near 0.05), not a gross deviation
  if (!(ROWS[0].pAD < 0.05 && ROWS[0].pAD > 0.01)) throw new Error('imp-96326: T=1e4 AD p-value not in the marginal (0.01,0.05) band');
  // every T >= 3e4 height passes AD comfortably
  for (const r of ROWS) if (r.Tc >= 3.0e4 && !(r.pAD > 0.05)) throw new Error('imp-96326: a T>=3e4 height failed AD');
  // honesty gates: measurement, not a bound change
  if (!/NO QED/.test(IMP96326_ORDER_STATS_GAUSSIANITY.verdict))
    throw new Error('imp-96326: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96326_ORDER_STATS_GAUSSIANITY.verdict))
    throw new Error('imp-96326: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96326_ORDER_STATS_GAUSSIANITY;
