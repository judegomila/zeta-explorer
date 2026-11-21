/**
 * @module imp-96005-a0-published-vs-empirical-reconcile
 *
 * imp-96005 -- RECONCILE the imp-95984 published crossing-intercept a_0 = -0.176248 (Chan Thm 1.1
 * under the Montgomery-conjectural pair-correlation value I_F = 1) against the imp-95940 / imp-95964
 * empirical a_0 ~ -0.116 backed out of six accessible zeta heights. RESULT: the gap is 0.060, which
 * is only 0.34 standard errors of the six-height mean (two-sided normal p ~ 0.74) -- i.e. FULLY
 * consistent with the six-height sampling noise, NOT a resolved discrepancy. The empirical route
 * cannot discriminate the conjectural -0.176248 from -0.116, from zero, or from a genuine finite-
 * height Var S(T) bias, because its noise floor (SE = 0.179) is ~18x the 0.01 pinning tolerance.
 * Measurement / assessment only; changes no bound; NO QED.
 *
 * SETUP. imp-95940 backs a_0 out of each accessible height via
 *     a_0(T) = pi^2 * measuredVar(T) - loglog(T/2pi) - gamma - 1,
 * over the six imp-95710 / imp-95562 heights T = 1e4..5e5 (10^6 ordinates each), giving
 *     a_0(T) in {0.24097, -0.36735, -0.61493, 0.56118, -0.16167, -0.35461}.
 * imp-95984 located Chan (arXiv:math/0305339, refining Goldston 1987 via Montgomery pair
 * correlation): b = I_F + M + P2, so a_0 = b - gamma - 1 = I_F - 1 + (M + P2 - gamma) = I_F - 1 -
 * P_Chan, and under the Montgomery-conjectural I_F = 1 this is a_0 = -P_Chan = -0.176248.
 *
 * STEP 1 -- MEASURE the gap. empirical mean a_0 = -0.116069 (n = 6), conjectural a_0 = -0.176248,
 * so gap = conjectural - empirical = -0.060179 (magnitude 0.0602, matching the ticket 0.060).
 *
 * STEP 2 -- EMPIRICAL UNCERTAINTY. The six per-height estimates have sample sd = 0.437523 and
 * standard error of the mean SE = sd/sqrt(6) = 0.178618 (spread max-min = 1.17611, straddling
 * zero). The gap is thus |gap|/SE = 0.3369 standard errors -- well inside 1 SE. Under a normal
 * approximation the two-sided probability of a deviation this large or larger is ~0.7362. So the
 * 0.060 gap is entirely attributable to the six-height sampling noise; the data does NOT reject the
 * conjectural -0.176248 (nor -0.116, nor 0 -- all lie within ~1 SE of the mean).
 *
 * STEP 3 -- MORE-HEIGHTS SENSITIVITY. If a_0 were a fixed constant sampled with this per-height
 * scatter, the SE of the mean falls only as sd/sqrt(n). Reaching the O(0.03) accuracy that fixes the
 * crossing height T_x to one decade (imp-95940: |Delta a_0| ~ ln10/78 ~ 0.03) needs n ~ (sd/0.03)^2
 * ~ 213 comparable independent heights; reaching the O(0.01) accuracy that pins T_x to a point needs
 * n ~ (sd/0.01)^2 ~ 1915. Beyond the raw 1/sqrt(n) noise floor, the six heights sit at very low
 * T = 1e4..5e5 where the Chan Thm 1.1 error term O(T/log^2 T) is a large RELATIVE correction, so a
 * genuine finite-height Var S(T) bias could persist even at large n and is NOT measured by the SE.
 * VERDICT: adding more comparable-height data would shrink the noise band toward the mean but cannot
 * reach the pinning tolerance without ~10^3 heights, and cannot by itself distinguish sampling noise
 * from a finite-height bias -- so it neither confirms the conjectural -0.176248 nor exposes a real
 * offset. The gap is consistent with noise; pinning a_0 still requires the analytic I_F, not more heights.
 *
 * WHAT THIS DELIVERS (measurement only). Gap = -0.060179; SE = 0.178618; z = |gap|/SE = 0.3369;
 * two-sided p ~ 0.7362 -> the discrepancy is noise-consistent, NOT a resolved offset. The empirical
 * six-height route has an 0.179 noise floor (~18x the 0.01 pinning tolerance) and cannot discriminate
 * the conjectural value; ~213 heights would be needed for one-decade T_x and ~1915 for a point, and
 * even then an unmeasured finite-height bias could remain. No bound moves; I_F = 1 stays Montgomery-
 * conjectural (rigorous RH bracket 2/3-eps < I_F < 2); the imp-95940 crossing range does not collapse.
 *
 * VERDICT. ASSESSMENT / GAP MEASURED, NOISE-CONSISTENT (frontier, NOT rigorous). The imp-95984
 * published a_0 = -0.176248 (Chan Thm 1.1 under Montgomery-conjectural I_F = 1) and the imp-95940 /
 * imp-95964 empirical a_0 mean = -0.116069 (six heights T = 1e4..5e5) differ by 0.060179, which is
 * only 0.34 standard errors of the six-height mean (SE = 0.178618, two-sided p ~ 0.7362) -- FULLY
 * consistent with the six-height sampling noise, not a resolved discrepancy. The empirical route
 * cannot discriminate the conjectural -0.176248 from -0.116 or from zero, needs ~213 comparable
 * heights for one-decade T_x accuracy and ~1915 for a point, and cannot by itself separate sampling
 * noise from a genuine finite-height Var S(T) bias (very low T, large O(T/log^2 T) relative error).
 * So more heights would not close the gap to the O(0.01) pinning tolerance nor confirm I_F = 1; the
 * only route to a_0 remains the analytic pair-correlation integral I_F, still Montgomery-conjectural
 * (rigorous bracket 2/3-eps < I_F < 2). Measurement/assessment only; changes no bound; NO QED;
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed; the zero-side route
 * stays PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The six measured literals (imp-95710 /
 * imp-95562) and the conjectural a_0 = -0.176248 are baked; the mean, SE, gap, z and p are derived
 * live here.
 *
 * @see imp-95984-fujii-varS-constant-literature-locate (Chan b = I_F + M + P2; a_0 = -P_Chan = -0.176248)
 * @see imp-95964-fujii-varS-constant-locate-obstruction (b = M + P2 + K; K = I_F)
 * @see imp-95940-arithmetic-intercept-a0-obstruction (six-height back-out; T_x(a_0) double-exp sensitivity)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const PI2 = Math.PI * Math.PI;

const logLog = (T) => Math.log(Math.log(T / TWO_PI)); // loglog(T/2pi)
const SELBERG_C = 1 / (2 * PI2); // 1/2pi^2 -- single-endpoint Selberg / residual offset slope

// Same six measured literals imp-95710 / imp-95562 baked (10^6 ordinates each).
const MEASURED = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];

// per-height back-out a_0(T) = pi^2 measuredVar - loglog(T/2pi) - gamma - 1 (imp-95940).
const a0Rows = MEASURED.map((m) => {
  const measuredVar = m.sd * m.sd;
  const ll = logLog(m.Tc);
  const offset = measuredVar - SELBERG_C * ll;
  const interceptG1a0 = PI2 * offset - 0.5 * ll; // = gamma + 1 + a_0 = b (Fujii constant)
  const a0 = interceptG1a0 - EULER - 1;
  return { Tc: m.Tc, a0 };
});
const a0Vals = a0Rows.map((r) => r.a0);

const n = a0Vals.length;
const a0Mean = a0Vals.reduce((s, x) => s + x, 0) / n;
const a0Max = Math.max(...a0Vals);
const a0Min = Math.min(...a0Vals);
const a0Spread = a0Max - a0Min; // ~1.176, straddling zero -> noise-dominated
// sample standard deviation (n-1) and standard error of the mean.
const sampleVar = a0Vals.reduce((s, x) => s + (x - a0Mean) ** 2, 0) / (n - 1);
const sampleSd = Math.sqrt(sampleVar); // ~0.4375
const seMean = sampleSd / Math.sqrt(n); // ~0.1786

// imp-95984 published intercept: Chan Thm 1.1 under Montgomery-conjectural I_F = 1 -> a_0 = -P_Chan.
const A0_CONJECTURAL = -0.176248; // = -P_Chan (imp-95984)

const gap = A0_CONJECTURAL - a0Mean; // conjectural - empirical mean ~ -0.0602
const zScore = Math.abs(gap) / seMean; // ~0.337 SE -- inside 1 SE

// two-sided normal tail p(|Z| > z) via an Abramowitz-Stegun erf approximation.
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const pTwoSided = 2 * (1 - 0.5 * (1 + erf(zScore / Math.SQRT2))); // ~0.736

// more-heights sensitivity: n needed for SE at the two imp-95940 accuracy targets (sd/sqrt(n) <= tol).
const TOL_ONE_DECADE = 0.03; // |Delta a_0| ~ ln10/78 -> fixes T_x to one order of magnitude
const TOL_POINT = 0.01; // pins T_x to a point
const heightsForOneDecade = Math.ceil((sampleSd / TOL_ONE_DECADE) ** 2); // ~213
const heightsForPoint = Math.ceil((sampleSd / TOL_POINT) ** 2); // ~1915

export const IMP96005_A0_PUBLISHED_VS_EMPIRICAL_RECONCILE = {
  ticket: 'imp-96005',
  proofSection: 'S-frontier',
  question:
    'Reconcile the imp-95984 published crossing-intercept a_0 = -0.176248 (Chan Thm 1.1 under the ' +
    'Montgomery-conjectural I_F = 1) against the imp-95940 / imp-95964 empirical a_0 ~ -0.116 from ' +
    'six heights: measure the gap, characterize the empirical uncertainty, and assess whether more ' +
    'heights would close it. Assessment only; NO QED.',
  method:
    'Back a_0 out of each of the six imp-95710 / imp-95562 heights, compute the sample sd and the ' +
    'standard error of the mean, express the gap conjectural - empirical in SE units with a normal ' +
    'two-sided p, and project the n needed for the imp-95940 one-decade (0.03) and point (0.01) ' +
    'a_0-accuracy targets via SE = sd/sqrt(n).',
  perHeight: a0Rows, // {Tc, a0} for the six heights
  empirical: {
    n,
    mean: a0Mean, // -0.116069
    sampleSd, // 0.437523
    seMean, // 0.178618 -- the noise floor of the six-height route
    spread: a0Spread, // 1.176 (max-min), straddles zero
  },
  published: {
    a0Conjectural: A0_CONJECTURAL, // -0.176248 = -P_Chan (Chan Thm 1.1, Montgomery I_F = 1)
    rigorousBracketIF: [2 / 3, 2], // I_F rigorously only (2/3 - eps, 2) under RH
    note: 'a_0 = -0.176248 requires the Montgomery-conjectural I_F = 1 (PCC / quantitative twin prime).',
  },
  reconciliation: {
    gap, // -0.060179 (conjectural - empirical mean)
    gapMagnitude: Math.abs(gap), // 0.060179 -- matches the ticket 0.060
    zScore, // 0.3369 -- gap in standard errors of the mean
    pTwoSided, // 0.7362 -- probability of a deviation this large under noise
    consistentWithNoise: zScore < 2, // true -- inside 1 SE, not a resolved discrepancy
  },
  moreHeightsSensitivity: {
    heightsForOneDecade, // ~213 comparable heights for SE <= 0.03 (one decade of T_x)
    heightsForPoint, // ~1915 comparable heights for SE <= 0.01 (point T_x)
    finiteHeightBiasCaveat:
      'The six heights sit at very low T = 1e4..5e5, where the Chan Thm 1.1 error term ' +
      'O(T/log^2 T) is a large relative correction; a genuine finite-height Var S(T) bias could ' +
      'persist at large n and is NOT captured by the sqrt(n) noise floor.',
    verdict:
      'More comparable-height data shrinks the noise band toward the mean but cannot reach the ' +
      'O(0.01) pinning tolerance without ~10^3 heights, and cannot by itself separate sampling ' +
      'noise from a finite-height bias -- so it neither confirms -0.176248 nor exposes a real offset.',
  },
  findings: {
    gapMeasured:
      'gap = conjectural - empirical mean = -0.060179 (magnitude 0.0602), matching the ticket 0.060.',
    noiseConsistent:
      'The gap is 0.337 standard errors of the six-height mean (SE = 0.178618, two-sided p ~ 0.7362) ' +
      '-- fully consistent with sampling noise, not a resolved discrepancy; -0.176248, -0.116 and 0 ' +
      'all lie within ~1 SE.',
    routeNoiseFloor:
      'The six-height empirical route has an 0.179 noise floor (~18x the 0.01 pinning tolerance) and ' +
      'cannot discriminate the conjectural value; the analytic pair-correlation integral I_F remains ' +
      'the only route to a_0, still Montgomery-conjectural (rigorous bracket 2/3-eps < I_F < 2).',
  },
  isRigorous: false,
  decision:
    'GAP MEASURED, NOISE-CONSISTENT, NOT A RESOLVED DISCREPANCY. The imp-95984 published a_0 = ' +
    '-0.176248 (Chan Thm 1.1, Montgomery-conjectural I_F = 1) and the imp-95940 / imp-95964 empirical ' +
    'a_0 mean = -0.116069 (six heights) differ by 0.060179, which is only 0.34 standard errors of the ' +
    'six-height mean (SE = 0.178618, two-sided p ~ 0.7362). The gap is fully consistent with the ' +
    'six-height sampling noise; the empirical route (0.179 noise floor, ~18x the 0.01 pinning ' +
    'tolerance) cannot discriminate the conjectural value, needs ~213 heights for one-decade T_x and ' +
    '~1915 for a point, and cannot separate noise from a finite-height Var S(T) bias -- so more ' +
    'heights would not close the gap nor confirm I_F = 1. No bound moves.',
  verdict:
    'ASSESSMENT / GAP MEASURED, NOISE-CONSISTENT (frontier, NOT rigorous). The imp-95984 published ' +
    'a_0 = -0.176248 (Chan arXiv:math/0305339 Thm 1.1 under the Montgomery-conjectural I_F = 1) and ' +
    'the imp-95940 / imp-95964 empirical a_0 mean = -0.116069 (six heights T = 1e4..5e5) differ by ' +
    '0.060179, which is only 0.34 standard errors of the six-height mean (SE = 0.178618, two-sided ' +
    'p ~ 0.7362) -- FULLY consistent with the six-height sampling noise, not a resolved discrepancy ' +
    '(-0.176248, -0.116 and 0 all lie within ~1 SE). The empirical route has an 0.179 noise floor ' +
    '(~18x the 0.01 pinning tolerance), needs ~213 comparable heights for one-decade T_x accuracy ' +
    'and ~1915 for a point, and cannot by itself separate sampling noise from a genuine finite-height ' +
    'Var S(T) bias (very low T, large O(T/log^2 T) relative error). So more heights would not close ' +
    'the gap to the O(0.01) pinning tolerance nor confirm I_F = 1; the only route to a_0 remains the ' +
    'analytic pair-correlation integral I_F, still Montgomery-conjectural (rigorous bracket 2/3-eps < ' +
    'I_F < 2). Measurement/assessment only; changes no bound; NO QED; Catalan G irrationality OPEN; ' +
    'Sun arXiv:2609.04176 single-author unrefereed; the zero-side route stays PCC / GRH-gated; ' +
    'no refereed bound is changed.',
  citation:
    'imp-95984 (Chan Thm 1.1, b = I_F + M + P2, a_0 = -P_Chan = -0.176248); imp-95964 (b = M + P2 + ' +
    'K, K = I_F); imp-95940 (six-height back-out, T_x(a_0) double-exponential sensitivity); Chan, On ' +
    'the second moment of S(T) (arXiv:math/0305339); Goldston 1987; Montgomery pair correlation.',
};

// --- self-executing internal-consistency assertions (live recomputation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the six-height mean reproduces the imp-95940 / imp-95964 empirical a_0 ~ -0.116.
  if (!approx(a0Mean, -0.116069, 1e-5))
    throw new Error('imp-96005: six-height a_0 mean drifted from -0.116069');
  // the gap magnitude matches the ticket 0.060.
  if (!approx(Math.abs(gap), 0.0602, 2e-3))
    throw new Error('imp-96005: gap magnitude must be ~0.060 (conjectural - empirical mean)');
  // KEY: the gap is inside 1 SE -- noise-consistent, not a resolved discrepancy.
  if (!(zScore < 1))
    throw new Error('imp-96005: gap must be within 1 SE of the six-height mean (noise-consistent)');
  if (!(pTwoSided > 0.5))
    throw new Error('imp-96005: two-sided p must exceed 0.5 (deviation this large is unremarkable)');
  // the noise floor SE must exceed the O(0.01) pinning tolerance by >~10x.
  if (!(seMean > 10 * 0.01))
    throw new Error('imp-96005: SE noise floor must exceed the O(0.01) tolerance by >~10x');
  // more-heights projection: pinning needs far more than the six available heights.
  if (!(heightsForPoint > 1000 && heightsForOneDecade > 100))
    throw new Error('imp-96005: pinning must require ~10^3 (point) / ~10^2 (decade) more heights');
  // HONESTY gates: assessment only, noise-consistent claim, no false pin, no refereed bound is changed.
  if (IMP96005_A0_PUBLISHED_VS_EMPIRICAL_RECONCILE.isRigorous !== false)
    throw new Error('imp-96005: isRigorous must be false');
  if (!/NO QED/.test(IMP96005_A0_PUBLISHED_VS_EMPIRICAL_RECONCILE.verdict))
    throw new Error('imp-96005: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96005_A0_PUBLISHED_VS_EMPIRICAL_RECONCILE.verdict))
    throw new Error('imp-96005: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96005_A0_PUBLISHED_VS_EMPIRICAL_RECONCILE;
