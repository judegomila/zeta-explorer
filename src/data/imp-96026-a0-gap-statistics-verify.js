/**
 * @module imp-96026-a0-gap-statistics-verify
 *
 * imp-96026 -- VERIFY the imp-96005 six-height a_0 gap statistics reproduce from the baked
 * per-height sd literals. INDEPENDENT recomputation only: reimplement the back-out, the sample
 * statistics, the SE-unit gap, the normal two-sided p, and the more-heights sensitivity counts
 * from scratch (no import of imp-96005) and confirm each matches the published imp-96005 value.
 * RESULT: every quantity reproduces to full working precision --
 *   per-height a_0 = {0.24097, -0.36735, -0.61493, 0.56118, -0.16167, -0.35461} (match < 5e-5),
 *   mean = -0.116069, sample sd = 0.437523, SE = 0.178618, gap = -0.060179, z = 0.3369,
 *   two-sided p = 0.7362, and the sensitivity counts n = ceil((sd/0.03)^2) = ceil(212.70) = 213,
 *   n = ceil((sd/0.01)^2) = ceil(1914.27) = 1915.
 * The imp-96005 assessment (gap noise-consistent, inside 1 SE, not a resolved discrepancy) stands.
 * Verification / independent recomputation only; changes no bound; NO QED.
 *
 * WHAT WAS CHECKED (independent reimplementation).
 *  - BACK-OUT. a_0(T) = pi^2 * sd^2 - loglog(T/2pi) - gamma - 1 over the six imp-95710 / imp-95562
 *    heights T = 1e4..5e5 (sd in {0.6218, 0.5823, 0.5689, 0.6714, 0.6199, 0.6078}). This is the
 *    algebraic reduction of the imp-96005 two-step form PI2*(sd^2 - C*ll) - 0.5*ll with the single-
 *    endpoint Selberg slope C = 1/(2 pi^2): since PI2*C = 1/2, the -C*ll and -0.5*ll terms combine
 *    to exactly -ll, so both forms coincide. The six back-out values match the ticket literals.
 *  - SAMPLE STATISTICS. mean = -0.11606883 (ticket -0.116069), sample sd (n-1) = 0.43752321
 *    (ticket 0.437523), SE = sd/sqrt(6) = 0.17861810 (ticket 0.178618), spread max-min = 1.17611
 *    (straddles zero).
 *  - GAP IN SE UNITS. gap = -0.176248 - mean = -0.06017917 (magnitude 0.0602, ticket 0.060);
 *    z = |gap|/SE = 0.33691531 (ticket 0.337) -- inside 1 SE; two-sided normal p = 0.73618088
 *    (ticket 0.736) via the same Abramowitz-Stegun erf. All three within 1e-3 of the imp-96005 value.
 *  - MORE-HEIGHTS SENSITIVITY. raw (sd/0.03)^2 = 212.6962 -> ceil 213; raw (sd/0.01)^2 = 1914.2656
 *    -> ceil 1915. The ceil of the exact ratios reproduces the ticket 213 / 1915 counts, and the
 *    identity n_target * tol^2 = sd^2 (before ceil) holds.
 *
 * VERDICT. VERIFIED / INDEPENDENT RECOMPUTATION REPRODUCES imp-96005 (frontier, NOT rigorous).
 * The imp-96005 six-height a_0 gap statistics (gap -0.060179, SE 0.178618, z 0.337, p 0.736) and
 * the ~213 / ~1915 more-heights sensitivity counts all reproduce from the baked per-height sd
 * literals to full working precision under an independent reimplementation. The gap remains 0.34
 * standard errors of the six-height mean -- noise-consistent, NOT a resolved discrepancy -- and the
 * empirical route keeps its 0.179 noise floor (~18x the 0.01 pinning tolerance), so the conclusion
 * is unchanged: pinning a_0 still requires the analytic pair-correlation integral I_F, Montgomery-
 * conjectural (rigorous bracket 2/3-eps < I_F < 2), not more heights. Verification only; changes no
 * bound; NO QED; Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed; the
 * zero-side route stays PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd literals and the conjectural
 * a_0 = -0.176248 are baked; every statistic is recomputed live here from scratch.
 *
 * @see imp-96005-a0-published-vs-empirical-reconcile (the statistics being independently verified)
 * @see imp-95940-arithmetic-intercept-a0-obstruction (six-height back-out; T_x(a_0) sensitivity)
 * @see imp-95984-fujii-varS-constant-literature-locate (Chan a_0 = -P_Chan = -0.176248)
 */

const TWO_PI = 2 * Math.PI;
const GAMMA = 0.5772156649015329;
const PI2 = Math.PI * Math.PI;

// Six baked measured sd literals (imp-95710 / imp-95562), 10^6 ordinates each.
const MEASURED_SD = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];

// Published imp-96005 targets to reproduce (all baked, independently recomputed below).
const TARGET = {
  perHeightA0: [0.24097, -0.36735, -0.61493, 0.56118, -0.16167, -0.35461],
  mean: -0.116069,
  sampleSd: 0.437523,
  seMean: 0.178618,
  gap: -0.060179,
  zScore: 0.337,
  pTwoSided: 0.736,
  heightsForOneDecade: 213,
  heightsForPoint: 1915,
};
const A0_CONJECTURAL = -0.176248; // -P_Chan (imp-95984, Chan Thm 1.1, Montgomery I_F = 1)

// STEP 1 -- independent back-out a_0(T) = pi^2 sd^2 - loglog(T/2pi) - gamma - 1.
const a0Rows = MEASURED_SD.map((m) => {
  const ll = Math.log(Math.log(m.Tc / TWO_PI));
  const a0 = PI2 * (m.sd * m.sd) - ll - GAMMA - 1;
  return { Tc: m.Tc, a0 };
});
const a0Vals = a0Rows.map((r) => r.a0);

// STEP 2 -- sample statistics.
const n = a0Vals.length;
const mean = a0Vals.reduce((s, x) => s + x, 0) / n;
const spread = Math.max(...a0Vals) - Math.min(...a0Vals);
const sampleVar = a0Vals.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1);
const sampleSd = Math.sqrt(sampleVar);
const seMean = sampleSd / Math.sqrt(n);

// STEP 3 -- gap in SE units + normal two-sided p (independent Abramowitz-Stegun erf).
const gap = A0_CONJECTURAL - mean;
const zScore = Math.abs(gap) / seMean;
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const pTwoSided = 2 * (1 - 0.5 * (1 + erf(zScore / Math.SQRT2)));

// STEP 4 -- more-heights sensitivity counts (before/after ceil).
const rawDecade = (sampleSd / 0.03) ** 2;
const rawPoint = (sampleSd / 0.01) ** 2;
const heightsForOneDecade = Math.ceil(rawDecade);
const heightsForPoint = Math.ceil(rawPoint);

// per-height match diagnostic.
const perHeightMaxErr = Math.max(
  ...a0Vals.map((x, i) => Math.abs(x - TARGET.perHeightA0[i])),
);

export const IMP96026_A0_GAP_STATISTICS_VERIFY = {
  ticket: 'imp-96026',
  proofSection: 'S-frontier',
  question:
    'Verify the imp-96005 six-height a_0 gap statistics (mean -0.116069, SE 0.178618, z 0.337, ' +
    'p 0.736, gap -0.060179) and the ~213 / ~1915 more-heights sensitivity counts reproduce from ' +
    'the baked per-height sd literals under an independent recomputation. Verification only; NO QED.',
  method:
    'Reimplement the imp-95940 back-out a_0(T) = pi^2 sd^2 - loglog(T/2pi) - gamma - 1, the sample ' +
    'sd (n-1) and SE = sd/sqrt(6), the gap conjectural - mean in SE units with a normal two-sided p, ' +
    'and the n = ceil((sd/tol)^2) sensitivity counts, from scratch and compare each to imp-96005.',
  recomputed: {
    perHeightA0: a0Vals, // matches {0.24097, -0.36735, -0.61493, 0.56118, -0.16167, -0.35461}
    perHeightMaxErr, // < 5e-5 vs the ticket literals
    n,
    mean, // -0.11606883
    sampleSd, // 0.43752321
    seMean, // 0.17861810
    spread, // 1.17611 (straddles zero)
    gap, // -0.06017917
    zScore, // 0.33691531
    pTwoSided, // 0.73618088
    rawDecade, // 212.6962
    rawPoint, // 1914.2656
    heightsForOneDecade, // 213
    heightsForPoint, // 1915
  },
  target: TARGET,
  reproduces: {
    perHeight: perHeightMaxErr < 5e-5,
    mean: Math.abs(mean - TARGET.mean) < 1e-5,
    sampleSd: Math.abs(sampleSd - TARGET.sampleSd) < 1e-5,
    seMean: Math.abs(seMean - TARGET.seMean) < 1e-5,
    gap: Math.abs(gap - TARGET.gap) < 1e-5,
    zScore: Math.abs(zScore - TARGET.zScore) < 1e-3,
    pTwoSided: Math.abs(pTwoSided - TARGET.pTwoSided) < 1e-3,
    heightsForOneDecade: heightsForOneDecade === TARGET.heightsForOneDecade,
    heightsForPoint: heightsForPoint === TARGET.heightsForPoint,
  },
  findings: {
    allReproduce:
      'Every imp-96005 quantity reproduces to full working precision from the baked sd literals ' +
      'under an independent reimplementation: per-height a_0 (< 5e-5), mean, sd, SE, gap, z, p, and ' +
      'the ceil((sd/tol)^2) = 213 / 1915 sensitivity counts.',
    formForm:
      'The one-step back-out pi^2 sd^2 - loglog(T/2pi) - gamma - 1 equals the imp-96005 two-step ' +
      'PI2*(sd^2 - C*ll) - 0.5*ll form exactly, since PI2*C = PI2/(2 pi^2) = 1/2 folds the two ll ' +
      'terms into a single -ll -- so the two implementations agree by construction.',
    sensitivityExact:
      'The sensitivity counts are the ceil of the exact ratios (sd/0.03)^2 = 212.6962 -> 213 and ' +
      '(sd/0.01)^2 = 1914.2656 -> 1915, so n_target * tol^2 = sample variance before rounding.',
    conclusionUnchanged:
      'The gap stays 0.34 standard errors of the six-height mean (noise-consistent, not a resolved ' +
      'discrepancy); pinning a_0 to the O(0.01) tolerance still requires the analytic I_F, not more ' +
      'heights. No bound moves.',
  },
  isRigorous: false,
  decision:
    'VERIFIED. All imp-96005 six-height a_0 gap statistics (mean -0.116069, sample sd 0.437523, ' +
    'SE 0.178618, gap -0.060179, z 0.337, two-sided p 0.736) and the more-heights sensitivity ' +
    'counts (213 for one decade of T_x, 1915 for a point) reproduce to full working precision from ' +
    'the six baked per-height sd literals under an independent recomputation. The gap remains inside ' +
    '1 SE -- noise-consistent, not a resolved discrepancy. No bound moves.',
  verdict:
    'VERIFIED / INDEPENDENT RECOMPUTATION REPRODUCES imp-96005 (frontier, NOT rigorous). The ' +
    'six-height a_0 back-out {0.24097, -0.36735, -0.61493, 0.56118, -0.16167, -0.35461}, the mean ' +
    '-0.116069, sample sd 0.437523, SE 0.178618, gap -0.060179, z 0.337 and two-sided p 0.736, and ' +
    'the more-heights sensitivity n = ceil((sd/0.03)^2) = 213 / ceil((sd/0.01)^2) = 1915 all ' +
    'reproduce to full working precision from the baked per-height sd literals under an independent ' +
    'reimplementation. The gap stays 0.34 standard errors of the six-height mean -- noise-consistent, ' +
    'NOT a resolved discrepancy -- and the empirical route keeps its 0.179 noise floor (~18x the ' +
    '0.01 pinning tolerance), so pinning a_0 still requires the analytic pair-correlation integral ' +
    'I_F, Montgomery-conjectural (rigorous bracket 2/3-eps < I_F < 2), not more heights. ' +
    'Verification only; changes no bound; NO QED; Catalan G irrationality OPEN; Sun ' +
    'arXiv:2609.04176 single-author unrefereed; the zero-side route stays PCC / GRH-gated; ' +
    'no refereed bound is changed.',
  citation:
    'imp-96005 (a_0 gap noise-consistency statistics being verified); imp-95940 (six-height ' +
    'back-out, T_x(a_0) double-exponential sensitivity); imp-95984 (Chan Thm 1.1, a_0 = -P_Chan = ' +
    '-0.176248); imp-95710 / imp-95562 (the six measured sd literals).',
};

// --- self-executing internal-consistency assertions (live recomputation only) ---
(() => {
  const all = IMP96026_A0_GAP_STATISTICS_VERIFY.reproduces;
  for (const [k, ok] of Object.entries(all)) {
    if (ok !== true) throw new Error(`imp-96026: recomputed ${k} does NOT reproduce imp-96005`);
  }
  // gap must stay inside 1 SE -- noise-consistent (the imp-96005 conclusion).
  if (!(zScore < 1))
    throw new Error('imp-96026: verified gap must stay within 1 SE (noise-consistent)');
  if (!(pTwoSided > 0.5))
    throw new Error('imp-96026: verified two-sided p must exceed 0.5');
  // exact-ratio sensitivity identity: n_target * tol^2 = sample variance (before ceil).
  if (Math.abs(rawDecade * 0.03 * 0.03 - sampleVar) > 1e-12)
    throw new Error('imp-96026: (sd/0.03)^2 * 0.03^2 must equal the sample variance');
  if (Math.abs(rawPoint * 0.01 * 0.01 - sampleVar) > 1e-12)
    throw new Error('imp-96026: (sd/0.01)^2 * 0.01^2 must equal the sample variance');
  // HONESTY gates: verification only, no false pin, no refereed bound is changed.
  if (IMP96026_A0_GAP_STATISTICS_VERIFY.isRigorous !== false)
    throw new Error('imp-96026: isRigorous must be false');
  if (!/NO QED/.test(IMP96026_A0_GAP_STATISTICS_VERIFY.verdict))
    throw new Error('imp-96026: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96026_A0_GAP_STATISTICS_VERIFY.verdict))
    throw new Error('imp-96026: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96026_A0_GAP_STATISTICS_VERIFY;
