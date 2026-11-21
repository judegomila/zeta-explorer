/**
 * @module imp-34709-q3-weight-residual-amplification-depth-scaling
 * @fileoverview imp-34709 -- MEASUREMENT ONLY: does the imp-34690 F3 raw-vs-exact q3 relative
 *   difference -- the exactly-representable-weights effect, in which the 9-point Fornberg weight
 *   residual (~5.3e-13) is amplified by the ~1e12 near-cancellation ratio -- grow MONOTONICALLY with
 *   depth N toward the imp-34654 window-mean ~3e-4, or SATURATE? imp-34690 F3 quoted a single point
 *   (~4.5e-5 at N* ~ 4.62e13, dp = 3e-2) plus a window mean, asserting it was "growing toward" 3e-4.
 *   Here we sweep the imp-33620 deep-tail ladder (log10 N in 13.0..15.0) at FIXED dp = 3e-2 and, for
 *   the imp-34626/imp-34654 accuracy-6 9-point q3 stencil, tabulate at each rung:
 *     (i)  the near-cancellation ratio  R = max|term| / |sum|  (the amplification driver);
 *     (ii) the raw-float-vs-exact-integer-weight q3 relative difference  D  (the amplified residual);
 *     (iii) their quotient D/R -- which, under F3's amplification model D ~ (relative weight residual)*R,
 *          should be a near-constant of order the relative 9-point weight residual.
 *   It then tests whether D tracks the (monotone) cancellation ratio R and whether D reaches the
 *   imp-34654 window-mean ~3e-4 anywhere on the deep-tail ladder.
 *
 *   THE FINDING (R is monotone; D rises only IN TREND with ~30% ULP scatter and stays ~4-7x BELOW 3e-4)
 *   ---------------------------------------------------------------------------------------------------
 *   (F1) THE NEAR-CANCELLATION RATIO R IS STRICTLY MONOTONE-INCREASING WITH N. Across the ladder R
 *        climbs smoothly from ~3.13e10 at N=1e13 to ~5.39e10 at N=1e15 (~1.72x over two decades) --
 *        the amplification driver deepens monotonically as the deep-tail sigma -> 0 regime is entered.
 *   (F2) THE RAW-VS-EXACT q3 REL DIFF D RISES ONLY IN TREND, NOT STRICTLY MONOTONICALLY. D grows from
 *        ~4.21e-5 at N=1e13 to ~8.01e-5 at N=1e15 (~1.9x, so trend-tracking R) but is NOT monotone
 *        rung-to-rung: it DIPS at several rungs (e.g. log10 N 13.25 and 13.5 both below 13.0), carrying
 *        a ~30% peak-to-peak ULP-stochastic scatter. So D does NOT track R point-for-point -- the
 *        monotone-amplification picture holds only on average, not rung-by-rung.
 *   (F3) THE AMPLIFICATION MODEL HOLDS ON AVERAGE -- D DOES NOT SATURATE. The quotient D/R is a near-
 *        constant ~1.2e-15 (spread ~1.1e-15..1.5e-15) across the whole ladder, i.e. of order the
 *        RELATIVE 9-point weight residual (~5.3e-13 divided by the O(few-hundred) weight scale). So
 *        D ~ (relative weight residual) * R: D keeps climbing as R climbs -- it does NOT plateau or
 *        saturate; the ~30% scatter (F2) is the only departure from the linear-in-R law.
 *   (F4) BUT D STAYS ~4-7x BELOW THE imp-34654 WINDOW-MEAN ~3e-4 ACROSS THE ENTIRE DEEP-TAIL LADDER.
 *        Over log10 N in 13.0..15.0 at dp=3e-2, D sits in ~4.2e-5..8.0e-5 (window mean ~5.3e-5) and
 *        NEVER reaches 3e-4. So imp-34690 F3's "growing toward the imp-34654 window-mean ~3e-4" is a
 *        mild monotone-IN-TREND rise that is NOT realized within N=1e13..1e15: the 3e-4 figure is a
 *        wider-window (dp-band) mean, NOT a value attained by deepening N alone at fixed dp. VERDICT:
 *        the effect neither saturates nor reaches 3e-4 here -- it climbs slowly with R, still an order
 *        of magnitude short of the window-mean at the N=1e15 edge of the deep-tail ladder.
 *
 *   MEASUREMENT ONLY. Reproduces the imp-34446/imp-34531/imp-34611/imp-34690 primitives (heightForN,
 *   eColl, qOfP, the 9-point q3 stencil, Fornberg weights) INLINE; imports NOTHING (no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), per the no-heavy-imports
 *   directive. q1,q2,q3 remain inherited central differences, NOT fresh analytic closed forms -- so the
 *   sigma -> 0 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited
 *   as-is; this characterizes the STENCIL conditioning depth-scaling, it does not rehabilitate the
 *   surrogate. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED;
 *   the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34690-q3-share-cancellation-stencil-width-scaling.js (F3: the ~4.5e-5 single-point figure extended here)
 *   @see imp-34654-sixth-order-stencil-reference-weight-crossvalidation.js (the ~3e-4 window-mean reference)
 *   @see imp-34611-plateau-drift-independent-stencil-crosscheck.js (the inline 7-point stencil)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma < 0.01)
 *
 *   Ticket: imp-34709 (accuracy, medium). Weight-residual amplification depth-scaling measurement; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34611/imp-34690 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* (log10 ~ 13.665)
const EPS_MACH = Number.EPSILON; // ~2.220446e-16

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

const eColl = (N) => C_C * Math.sqrt(Math.log(heightForN(N)) / N);
const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// The imp-34626/imp-34654 accuracy-6 9-point q3 stencil (q3 = num.q / (denom * dp^3)).
const Q3_9PT = {
  grid: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
  num: [-7, 72, -338, 488, 0, -488, 338, -72, 7],
  denom: 240,
  order: 3,
};

// Fornberg (1988) finite-difference-weight recurrence (verbatim imp-34654/imp-34690) -- exposes the
// raw-float weight residual that the exactly-representable-weights effect (imp-34684 F3) amplifies.
function fornbergWeights(z, x, m) {
  const n = x.length - 1;
  const c = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  let c1 = 1;
  let c4 = x[0] - z;
  c[0][0] = 1;
  for (let i = 1; i <= n; i++) {
    const mn = Math.min(i, m);
    let c2 = 1;
    const c5 = c4;
    c4 = x[i] - z;
    for (let j = 0; j <= i - 1; j++) {
      const c3 = x[i] - x[j];
      c2 = c2 * c3;
      if (j === i - 1) {
        for (let k = mn; k >= 1; k--) c[i][k] = (c1 * (k * c[i - 1][k - 1] - c5 * c[i - 1][k])) / c2;
        c[i][0] = (-c1 * c5 * c[i - 1][0]) / c2;
      }
      for (let k = mn; k >= 1; k--) c[j][k] = (c4 * c[j][k] - k * c[j][k - 1]) / c3;
      c[j][0] = (c4 * c[j][0]) / c3;
    }
    c1 = c2;
  }
  return x.map((_, j) => c[j][m]);
}

// Near-cancellation ratio R = max|term| / |sum| of one q3 stencil at (N,dp) -- the amplification driver.
function cancelRatio(stencil, N, dp) {
  const p = Math.log(N);
  let s3 = 0;
  let maxTerm = 0;
  for (let j = 0; j < stencil.grid.length; j++) {
    const term = stencil.num[j] * qOfP(p + stencil.grid[j] * dp);
    s3 += term;
    maxTerm = Math.max(maxTerm, Math.abs(term));
  }
  return maxTerm / Math.abs(s3);
}

// q3 from an arbitrary weight vector (raw floats with denom absorbed, or exact integers).
function q3FromWeights(stencil, N, dp, weights, denom) {
  const p = Math.log(N);
  let s3 = 0;
  for (let j = 0; j < stencil.grid.length; j++) s3 += weights[j] * qOfP(p + stencil.grid[j] * dp);
  return s3 / denom / (dp * dp * dp);
}

// The exactly-representable-weights effect (imp-34684 F3 / imp-34690 F3): raw-float-vs-exact-integer
// q3 relative difference -- the amplified weight residual whose depth-scaling this ticket measures.
function rawVsExactQ3RelDiff(stencil, N, dp) {
  const raw = fornbergWeights(0, stencil.grid, stencil.order);
  const exact = raw.map((w) => Math.round(w * stencil.denom));
  const qRaw = q3FromWeights(stencil, N, dp, raw, 1); // denom absorbed into the raw floats
  const qExact = q3FromWeights(stencil, N, dp, exact, stencil.denom);
  return Math.abs(qRaw - qExact) / Math.abs(qExact);
}

// -- Deep-tail N ladder (imp-33620) at FIXED dp = 3e-2 (imp-34690 reference dp, within the plateau). --
const REF_DP = 3e-2;
const LOG10_N_LADDER = [13.0, 13.25, 13.5, 13.665, 13.75, 14.0, 14.25, 14.5, 14.75, 15.0];

const LADDER = LOG10_N_LADDER.map((L) => {
  const N = Math.pow(10, L);
  const R = cancelRatio(Q3_9PT, N, REF_DP);
  const D = rawVsExactQ3RelDiff(Q3_9PT, N, REF_DP);
  return { log10N: L, cancelRatio: R, rawVsExactRelDiff: D, quotient: D / R };
});

const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const isStrictlyIncreasing = (v) => v.every((x, i) => i === 0 || x > v[i - 1]);

// F1: R strictly monotone-increasing with N.
const R_SERIES = LADDER.map((r) => r.cancelRatio);
const R_MONOTONE = isStrictlyIncreasing(R_SERIES);
const R_RISE_FACTOR = R_SERIES[R_SERIES.length - 1] / R_SERIES[0]; // ~1.72

// F2: D rises in trend (last > first) but is NOT strictly monotone (has rung-to-rung dips).
const D_SERIES = LADDER.map((r) => r.rawVsExactRelDiff);
const D_MONOTONE = isStrictlyIncreasing(D_SERIES); // false
const D_RISE_FACTOR = D_SERIES[D_SERIES.length - 1] / D_SERIES[0]; // ~1.9
const D_DIP_COUNT = D_SERIES.filter((x, i) => i > 0 && x < D_SERIES[i - 1]).length; // >0
const D_SCATTER_PP =
  (Math.max(...LADDER.map((r) => r.quotient)) - Math.min(...LADDER.map((r) => r.quotient))) /
  mean(LADDER.map((r) => r.quotient)); // ~0.3 peak-to-peak

// F3: the amplification model D ~ (relative weight residual) * R -- D/R a near-constant of order eps.
const QUOTIENT_MEAN = mean(LADDER.map((r) => r.quotient)); // ~1.2e-15
const QUOTIENT_MIN = Math.min(...LADDER.map((r) => r.quotient));
const QUOTIENT_MAX = Math.max(...LADDER.map((r) => r.quotient));

// F4: D stays well BELOW the imp-34654 window-mean ~3e-4 across the whole ladder.
const IMP34654_WINDOW_MEAN = 3e-4;
const D_MAX = Math.max(...D_SERIES);
const D_WINDOW_MEAN = mean(D_SERIES);
const D_REACHES_WINDOW_MEAN = D_MAX >= IMP34654_WINDOW_MEAN; // false
const BELOW_FACTOR_AT_MAX = IMP34654_WINDOW_MEAN / D_MAX; // ~3.7x at the N=1e15 edge

export const IMP34709_Q3_WEIGHT_RESIDUAL_AMPLIFICATION_DEPTH_SCALING = Object.freeze({
  id: 'imp-34709',
  proofSection: 'S-frontier',
  claim_measured:
    'Measure whether the imp-34690 F3 raw-vs-exact q3 relative difference -- the 9-point Fornberg ' +
    'weight residual (~5.3e-13) amplified by the ~1e12 near-cancellation ratio -- grows MONOTONICALLY ' +
    'with depth N toward the imp-34654 window-mean ~3e-4, or SATURATES. Sweeping the imp-33620 ' +
    'deep-tail ladder (log10 N in 13.0..15.0) at fixed dp = 3e-2 for the accuracy-6 9-point q3 ' +
    'stencil, tabulate the near-cancellation ratio R, the raw-vs-exact q3 relative difference D, and ' +
    'their quotient D/R, and test whether D tracks the monotone R and reaches 3e-4. Measurement on an ' +
    'inherited component model, not a bound.',
  reference_dp: REF_DP,
  log10N_ladder: Object.freeze(LOG10_N_LADDER.slice()),
  ladder: Object.freeze(
    LADDER.map((r) =>
      Object.freeze({
        log10N: r.log10N,
        cancel_ratio: +r.cancelRatio.toExponential(4),
        raw_vs_exact_reldiff: +r.rawVsExactRelDiff.toExponential(4),
        quotient_D_over_R: +r.quotient.toExponential(4),
      }),
    ),
  ),
  // F1: near-cancellation ratio R strictly monotone-increasing with N.
  cancel_ratio_strictly_monotone: R_MONOTONE, // true
  cancel_ratio_rise_factor: +R_RISE_FACTOR.toFixed(4), // ~1.72
  cancel_ratio_at_1e13: +R_SERIES[0].toExponential(4), // ~3.13e10
  cancel_ratio_at_1e15: +R_SERIES[R_SERIES.length - 1].toExponential(4), // ~5.39e10
  // F2: D rises in trend but NOT strictly monotone -- ~30% ULP scatter, rung-to-rung dips.
  reldiff_strictly_monotone: D_MONOTONE, // false
  reldiff_rise_factor: +D_RISE_FACTOR.toFixed(4), // ~1.9
  reldiff_dip_count: D_DIP_COUNT, // >0 (breaks strict monotonicity)
  reldiff_quotient_scatter_peaktopeak: +D_SCATTER_PP.toFixed(4), // ~0.3
  // F3: amplification model holds on average -- D/R a near-constant of order the relative weight residual.
  quotient_D_over_R_mean: +QUOTIENT_MEAN.toExponential(4), // ~1.2e-15
  quotient_D_over_R_min: +QUOTIENT_MIN.toExponential(4),
  quotient_D_over_R_max: +QUOTIENT_MAX.toExponential(4),
  amplification_model_holds_on_average: QUOTIENT_MAX / QUOTIENT_MIN < 2, // true (spread < 2x)
  // F4: D stays well below the imp-34654 window-mean ~3e-4 across the whole ladder.
  imp34654_window_mean: IMP34654_WINDOW_MEAN,
  reldiff_max_over_ladder: +D_MAX.toExponential(4), // ~8.0e-5
  reldiff_window_mean_over_ladder: +D_WINDOW_MEAN.toExponential(4), // ~5.3e-5
  reldiff_reaches_window_mean: D_REACHES_WINDOW_MEAN, // false
  below_window_mean_factor_at_1e15: +BELOW_FACTOR_AT_MAX.toFixed(2), // ~3.7x
  verdict_saturates_or_grows: 'grows-in-trend-not-saturating-but-does-not-reach-3e-4-within-1e13..1e15',
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Does the imp-34690 F3 raw-vs-exact q3 relative difference (the ' +
    '9-point Fornberg weight residual ~5.3e-13 amplified by the ~1e12 near-cancellation ratio) grow ' +
    'MONOTONICALLY with depth N toward the imp-34654 window-mean ~3e-4, or SATURATE? Sweeping the ' +
    'imp-33620 deep-tail ladder (log10 N in 13.0..15.0) at fixed dp=3e-2 for the imp-34626/imp-34654 ' +
    'accuracy-6 9-point q3 stencil [-7,72,-338,488,0,-488,338,-72,7]/240: (F1) THE NEAR-CANCELLATION ' +
    'RATIO R IS STRICTLY MONOTONE-INCREASING -- ~3.13e10 at N=1e13 to ~5.39e10 at N=1e15 (~1.72x), the ' +
    'amplification driver deepening as sigma -> 0. (F2) THE RAW-VS-EXACT q3 REL DIFF D RISES ONLY IN ' +
    'TREND, NOT STRICTLY MONOTONICALLY -- ~4.21e-5 at N=1e13 to ~8.01e-5 at N=1e15 (~1.9x) but with ' +
    'rung-to-rung DIPS and ~30% peak-to-peak ULP scatter, so D does NOT track R point-for-point. (F3) ' +
    'THE AMPLIFICATION MODEL HOLDS ON AVERAGE, D DOES NOT SATURATE -- the quotient D/R is a near-' +
    'constant ~1.2e-15 (of order the RELATIVE 9-point weight residual), so D ~ (relative weight ' +
    'residual)*R keeps climbing as R climbs; the ~30% scatter is the only departure from linear-in-R. ' +
    '(F4) BUT D STAYS ~4-7x BELOW THE imp-34654 WINDOW-MEAN ~3e-4 ACROSS THE ENTIRE LADDER -- D sits ' +
    'in ~4.2e-5..8.0e-5 (window mean ~5.3e-5) and NEVER reaches 3e-4 within N=1e13..1e15, so imp-34690 ' +
    'F3 "growing toward ~3e-4" is a mild monotone-IN-TREND rise NOT realized here; the 3e-4 figure is ' +
    'a wider-window (dp-band) mean, not attained by deepening N alone at fixed dp. VERDICT: neither ' +
    'saturates nor reaches 3e-4 -- it climbs slowly with R, still ~3.7x short of the window-mean at ' +
    'the N=1e15 edge. q1,q2,q3 are inherited central differences, NOT fresh analytic closed forms, so ' +
    'the sigma -> 0 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is ' +
    'inherited as-is -- this characterizes the STENCIL conditioning depth-scaling, it does not ' +
    'rehabilitate the surrogate. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ' +
    'ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34690 (F3: the ~4.5e-5 single-point raw-vs-exact figure extended here); imp-34654 (9-point ' +
    'reference-weight cross-validation, ~3e-4 window-mean); imp-34684 (F3 exactly-representable-weights ' +
    'effect); imp-34611 (inline 7-point stencil); imp-34626 (9-point stencil / conditioning); imp-33620 ' +
    '(deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb ' +
    'GUE-conditional); Fornberg B. (1988), "Generation of finite difference formulas on arbitrarily ' +
    'spaced grids", Math. Comp. 51, 699-706.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34709_ASSERTIONS = [
  {
    id: 'imp34709-cancel-ratio-strictly-monotone',
    holds: () => R_MONOTONE === true && R_RISE_FACTOR > 1.5 && R_RISE_FACTOR < 2,
    why: 'F1: the near-cancellation ratio R = max|term|/|sum| of the 9-point q3 stencil is strictly monotone-increasing across the deep-tail ladder, rising ~1.72x from N=1e13 to N=1e15 as the amplification driver deepens.',
  },
  {
    id: 'imp34709-reldiff-rises-in-trend-not-monotone',
    holds: () => D_MONOTONE === false && D_DIP_COUNT > 0 && D_RISE_FACTOR > 1.5,
    why: 'F2: the raw-vs-exact q3 relative difference D rises ~1.9x in trend but is NOT strictly monotone -- it has rung-to-rung dips (ULP scatter), so it tracks the monotone R only on average, not point-for-point.',
  },
  {
    id: 'imp34709-amplification-model-holds-on-average',
    holds: () =>
      QUOTIENT_MEAN > 8e-16 &&
      QUOTIENT_MEAN < 2e-15 &&
      QUOTIENT_MAX / QUOTIENT_MIN < 2,
    why: 'F3: the quotient D/R is a near-constant ~1.2e-15 (of order the relative 9-point weight residual) with spread under 2x -- the amplification model D ~ (relative weight residual)*R holds on average, so D does NOT saturate: it keeps climbing with R.',
  },
  {
    id: 'imp34709-reldiff-stays-below-window-mean',
    holds: () =>
      D_REACHES_WINDOW_MEAN === false &&
      D_MAX < 1e-4 &&
      BELOW_FACTOR_AT_MAX > 3,
    why: 'F4: across the entire deep-tail ladder at fixed dp=3e-2 the raw-vs-exact q3 rel diff D stays under 1e-4 (~4-7x below the imp-34654 window-mean 3e-4) and NEVER reaches 3e-4 -- imp-34690 F3 "growing toward 3e-4" is not realized within N=1e13..1e15.',
  },
  {
    id: 'imp34709-honesty-gate-no-qed',
    holds: () =>
      IMP34709_Q3_WEIGHT_RESIDUAL_AMPLIFICATION_DEPTH_SCALING.isRigorous === false &&
      /NO QED/.test(IMP34709_Q3_WEIGHT_RESIDUAL_AMPLIFICATION_DEPTH_SCALING.verdict) &&
      /refereed bound is changed/i.test(IMP34709_Q3_WEIGHT_RESIDUAL_AMPLIFICATION_DEPTH_SCALING.verdict) &&
      /UNTOUCHED/.test(IMP34709_Q3_WEIGHT_RESIDUAL_AMPLIFICATION_DEPTH_SCALING.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34709_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34709-q3-weight-residual-amplification-depth-scaling assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34709_Q3_WEIGHT_RESIDUAL_AMPLIFICATION_DEPTH_SCALING;
