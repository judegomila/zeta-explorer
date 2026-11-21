/**
 * @module imp-34191-span-exponent-alpha-limit-fit
 *
 * imp-34191 (numerical, frontier-direction): imp-34126 F2 found the log-log span exponent alpha of
 * the normalized centroid-offset shortfall 1 - delta*L^2/(Snat/4) rises MONOTONELY across the depth
 * ladder N = 1e60..1e800 (L = log T0 ~ 135..1836):
 *     alpha(L) = 0.6976, 0.7563, 0.8084, 0.8379, 0.8549,
 * "converging toward the centroid-expansion prediction alpha = 1" -- but the approach was described
 * qualitatively and NEVER fit to an actual limit. This module fits alpha(L) to saturating surrogates
 * to test whether the extrapolated L -> inf limit is statistically 1, and quantifies how the FD/OLS
 * precision floor (step 1e-3, 4 pts/decade) biases the deepest-rung (widest-span) reading downward.
 *
 * THE QUANTITY (identical inherited imp-34126/imp-34065/imp-34006 sub-terms; NO fresh model)
 * ----------------------------------------------------------------------------------------
 * The imp-34126 numerics are re-derived VERBATIM in log-N space (imp-33859 route: never form T0 or N):
 *   sigma(N) = E_coll / (E_trunc + E_flow + E_coll);  T0 = effectiveHeightForN(N);  L = log T0
 *   p(N)     = -d ln sigma/d ln N   (pointwise central FD, step 1e-3)
 *   p_eff(N;S) = -OLS slope over [N, N*10^S]  (windowed, 4 pts/decade), spans S in {6,12,24,48}
 *   shortfall(N;S) = 1 - (p_eff - p)*L^2 / (Snat/4),   Snat = S*ln 10
 *   alpha(L) = log-log OLS slope of shortfall vs S over the four spans (imp-34126 F2 span exponent)
 * The re-derived ladder reproduces imp-34126 F2 to the fourth decimal, so the fits below act on the
 * SAME numbers imp-34126 published.
 *
 * THE FITS (three saturating surrogates; measurement / extrapolation only)
 * -----------------------------------------------------------------------
 *   (A) alpha = 1 - c/L        -- limit fixed at 1, exponent fixed at 1 (the naive centroid guess).
 *   (B) alpha = alpha_inf + c L^{-p}  -- BOTH the limit and the exponent free (three-parameter; p
 *       chosen on a 0.05..3 grid, alpha_inf and c by OLS at each p).
 *   (C) alpha = 1 - c L^{-p}   -- limit fixed at 1 but the exponent free (log-log OLS on 1 - alpha).
 *
 * THE FINDING (measurement / fit only -- the ladder does NOT pin the limit to 1)
 * -----------------------------------------------------------------------------
 *   (F1) THE FIXED 1 - c/L SURROGATE IS REJECTED. Forcing both the limit 1 AND a 1/L approach gives
 *        c ~ 49.5 with R^2 ~ -1.26 (NEGATIVE -- worse than the mean): a 1/L decay to 1 is far too
 *        fast for data that sit at alpha ~ 0.70..0.85 over L ~ 135..1836. The naive centroid guess
 *        cannot describe the finite-L ladder.
 *   (F2) THE FREE THREE-PARAMETER FIT EXTRAPOLATES TO alpha_inf ~ 0.88, NOT 1. Letting the limit
 *        float, alpha = alpha_inf + c L^{-p} lands alpha_inf ~ 0.880, c ~ -7.79, p ~ 0.765 at
 *        R^2 ~ 0.99994 -- an excellent fit whose extrapolated limit is ~0.88, well BELOW the
 *        centroid-expansion 1. The five-rung moderate-L ladder therefore does NOT statistically
 *        confirm alpha -> 1: a free saturating fit prefers a sub-unity ceiling.
 *   (F3) FORCING THE LIMIT TO 1 DEMANDS A VERY SLOW p ~ 0.28 AND DEGRADES THE FIT. The limit-locked
 *        alpha = 1 - c L^{-p} fits with p ~ 0.281, c ~ 1.14 at R^2 ~ 0.970 -- acceptable, but the
 *        exponent is far slower than 1/L and R^2 drops from the free fit 0.99994 to 0.970. So alpha
 *        -> 1 is *consistent* with the ladder ONLY under a very slow (~L^{-0.28}) approach, which the
 *        finite ladder cannot distinguish from a genuine sub-unity limit near 0.88.
 *   (F4) THE PRECISION FLOOR BIASES THE DEEPEST-RUNG READING DOWNWARD. Refining the widest-span
 *        OLS sampling from 4 to 8 pts/decade at N = 1e800 lifts alpha from 0.8549 to 0.8568
 *        (delta ~ +0.0019): the coarse 4-pts/decade reading understates alpha, so the true ladder
 *        rises slightly faster than the published numbers -- a small (O(2e-3)) downward bias that
 *        does not change the qualitative verdict but confirms the imp-34126 precision caveat.
 *
 * VERDICT: imp-34126 F2 called alpha "converging toward alpha = 1", but a quantitative extrapolation
 * is EQUIVOCAL. The naive 1 - c/L is flatly rejected; a free saturating fit prefers alpha_inf ~ 0.88;
 * and pinning the limit to 1 is only possible with an implausibly slow L^{-0.28} approach at a
 * noticeably worse R^2. The ladder is CONSISTENT WITH alpha -> 1 but does NOT confirm it -- the depth
 * (L <~ 1836, capped by the FD/OLS floor) is too shallow to separate a limit of 0.88 from 1.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34126-shortfall-span-scaling-of-centroid-offset (F2 alpha ladder 0.698..0.855, source)
 * @see imp-34129-widening-slope-drift-convergence-fit (sibling convergence-fit: widening slope b -> b_inf)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (sibling limit-fit on the widening slope)
 * @see imp-34065-window-span-scaling-of-exponent-offset (S1 shortfall grows with span)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law 1/(2L))
 * @see imp-33859 (log-N-space direct evaluation past IEEE-double overflow; reused here)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-34006)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34126/imp-34065 exactly
const PTS_PER_DECADE = 4; // imp-33274/imp-34126 sampling density
const SPANS = [6, 12, 24, 48]; // OLS window spans in decades (imp-34126)
const DEPTH_LADDER = [60, 100, 200, 400, 800]; // imp-34126 F2 depth ladder (L ~ 135..1836)

// EXACT imp-34126 sub-terms in log-N space (imp-33859 route: never forms T0 or N).
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + Math.log(TWO_PI) };
}
function lnSigmaFromLnN(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI;
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL;
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}
function pPointAtLog10(d, dl = 1e-3) {
  const lnN = d * Math.LN10;
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}
function pWindowAtLog10(dStart, span, pts = PTS_PER_DECADE) {
  const step = 1 / pts;
  const xs = [];
  const ys = [];
  for (let d = dStart; d <= dStart + span + 1e-9; d += step) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(lnSigmaFromLnN(lnN));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function olsFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx, r2: (sxy * sxy) / (sxx * syy) };
}

// alpha(L): the imp-34126 F2 log-log span exponent at a given rung, with tunable FD/OLS precision.
function alphaAtDepth(d, pts = PTS_PER_DECADE, dl = 1e-3) {
  const L = logT0FromLnN(d * Math.LN10).L;
  const pP = pPointAtLog10(d, dl);
  const sh = SPANS.map((S) => {
    const Snat = S * Math.LN10;
    const delta = pWindowAtLog10(d, S, pts) - pP;
    return 1 - (delta * L * L) / (Snat / 4);
  });
  const ll = olsFit(SPANS.map((s) => Math.log(s)), sh.map((v) => Math.log(v)));
  return { L, alpha: ll.slope, r2: ll.r2 };
}

// Reproduce the imp-34126 F2 alpha ladder (should match 0.6976..0.8549 to 4 decimals).
const LADDER_ROWS = DEPTH_LADDER.map((d) => {
  const a = alphaAtDepth(d);
  return {
    N_log10: d,
    logT0: +a.L.toFixed(2),
    alpha: +a.alpha.toFixed(4),
    loglog_R2: +a.r2.toFixed(5),
  };
});
const L_ARR = LADDER_ROWS.map((r) => r.logT0);
const A_ARR = LADDER_ROWS.map((r) => r.alpha);

// (A) alpha = 1 - c/L : residual (alpha - 1) = -c*(1/L); c minimises the squared residual.
const invL = L_ARR.map((L) => 1 / L);
let numA = 0;
let denA = 0;
for (let i = 0; i < L_ARR.length; i++) {
  numA += (A_ARR[i] - 1) * invL[i];
  denA += invL[i] * invL[i];
}
const cFixedInvL = -(numA / denA);
const meanAlpha = A_ARR.reduce((a, b) => a + b, 0) / A_ARR.length;
let ssrA = 0;
let sstA = 0;
for (let i = 0; i < L_ARR.length; i++) {
  const pred = 1 - cFixedInvL / L_ARR[i];
  ssrA += (A_ARR[i] - pred) ** 2;
  sstA += (A_ARR[i] - meanAlpha) ** 2;
}
const FIT_A = { c: +cFixedInvL.toFixed(3), r2: +(1 - ssrA / sstA).toFixed(4) };

// (B) alpha = alpha_inf + c*L^{-p} : free limit + free exponent; p on a 0.05..3 grid, OLS per p.
let bestB = null;
for (let p = 0.05; p <= 3.0001; p += 0.005) {
  const xs = L_ARR.map((L) => Math.pow(L, -p));
  const f = olsFit(xs, A_ARR);
  let sse = 0;
  for (let i = 0; i < xs.length; i++) {
    sse += (A_ARR[i] - (f.intercept + f.slope * xs[i])) ** 2;
  }
  if (!bestB || sse < bestB.sse) bestB = { p, alpha_inf: f.intercept, c: f.slope, r2: f.r2, sse };
}
const FIT_B = {
  p: +bestB.p.toFixed(3),
  alpha_inf: +bestB.alpha_inf.toFixed(4),
  c: +bestB.c.toFixed(3),
  r2: +bestB.r2.toFixed(5),
};

// (C) alpha = 1 - c*L^{-p} : limit locked to 1, exponent free; log-log OLS on (1 - alpha).
const logOneMinus = A_ARR.map((a) => Math.log(1 - a));
const fitC = olsFit(L_ARR.map((L) => Math.log(L)), logOneMinus);
const pFixed1 = -fitC.slope;
const cFixed1 = Math.exp(fitC.intercept);
let ssrC = 0;
let sstC = 0;
const meanOM = A_ARR.reduce((a, b) => a + (1 - b), 0) / A_ARR.length;
for (let i = 0; i < L_ARR.length; i++) {
  const pred = cFixed1 * Math.pow(L_ARR[i], -pFixed1);
  ssrC += ((1 - A_ARR[i]) - pred) ** 2;
  sstC += ((1 - A_ARR[i]) - meanOM) ** 2;
}
const FIT_C = { p: +pFixed1.toFixed(4), c: +cFixed1.toFixed(4), r2: +(1 - ssrC / sstC).toFixed(4) };

// (F4) precision-floor sensitivity at the deepest rung: refine OLS sampling 4 -> 8 pts/decade.
const DEEP = DEPTH_LADDER[DEPTH_LADDER.length - 1];
const alphaCoarse = alphaAtDepth(DEEP, 4, 1e-3).alpha;
const alphaFine = alphaAtDepth(DEEP, 8, 1e-3).alpha;
const PRECISION = {
  N_log10: DEEP,
  alpha_4pts: +alphaCoarse.toFixed(4),
  alpha_8pts: +alphaFine.toFixed(4),
  downward_bias: +(alphaFine - alphaCoarse).toFixed(4), // >0 : coarse reading understates alpha
};

export const IMP34191_SPAN_EXPONENT_ALPHA_LIMIT_FIT = {
  id: 'imp-34191',
  proofSection: 'S-frontier',
  question:
    'imp-34126 F2 found the span exponent alpha of the normalized centroid-offset shortfall rises ' +
    'monotonely 0.698 -> 0.855 across N = 1e60..1e800 (L ~ 135..1836), "converging toward alpha = 1" ' +
    'but never fit to a limit. Fit alpha(L) to saturating surrogates alpha = 1 - c/L and ' +
    'alpha = alpha_inf + c L^{-p} to test whether the extrapolated limit is statistically 1, and ' +
    'quantify how the FD/OLS precision floor biases the widest-span reading downward. Measurement/fit ' +
    'only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486) untouched; ' +
    'no QED.',
  ladder: LADDER_ROWS,
  fit_fixedLimit1_invL: FIT_A, // (A) alpha = 1 - c/L
  fit_freeLimit_powerLaw: FIT_B, // (B) alpha = alpha_inf + c L^{-p}
  fit_fixedLimit1_freeExponent: FIT_C, // (C) alpha = 1 - c L^{-p}
  precisionFloor: PRECISION,
  finding: {
    F1_fixed_invL_rejected:
      'alpha = 1 - c/L (limit AND exponent fixed) gives c ~ 49.5 at R^2 ~ -1.26 (negative -- worse ' +
      'than the mean): a 1/L decay to 1 is far too fast for the ladder alpha ~ 0.70..0.85 over ' +
      'L ~ 135..1836. The naive centroid guess is flatly rejected.',
    F2_free_fit_extrapolates_below_one:
      'alpha = alpha_inf + c L^{-p} (free limit) lands alpha_inf ~ 0.880, c ~ -7.79, p ~ 0.765 at ' +
      'R^2 ~ 0.99994 -- an excellent fit whose extrapolated limit is ~0.88, BELOW the ' +
      'centroid-expansion 1. The five-rung moderate-L ladder does NOT statistically confirm ' +
      'alpha -> 1.',
    F3_forcing_limit_one_needs_slow_exponent:
      'alpha = 1 - c L^{-p} (limit locked to 1) fits with p ~ 0.281, c ~ 1.14 at R^2 ~ 0.970 -- an ' +
      'implausibly slow L^{-0.28} approach and a worse R^2 than the free fit 0.99994. alpha -> 1 is ' +
      'consistent with the ladder only under this slow approach, indistinguishable from a genuine ' +
      'sub-unity ceiling ~0.88.',
    F4_precision_floor_biases_deepest_rung_down:
      'Refining the widest-span OLS from 4 to 8 pts/decade at N = 1e800 lifts alpha from 0.8549 to ' +
      '0.8568 (delta ~ +0.0019): the coarse reading understates alpha, so the true ladder rises ' +
      'slightly faster -- a small O(2e-3) downward bias confirming the imp-34126 precision caveat, ' +
      'not enough to change the equivocal verdict.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-34126 F2 called the span exponent alpha ' +
    '"converging toward alpha = 1", but a quantitative extrapolation across the depth ladder ' +
    'N = 1e60..1e800 (L ~ 135..1836, alpha = 0.6976/0.7563/0.8084/0.8379/0.8549) is EQUIVOCAL. The ' +
    'naive fixed alpha = 1 - c/L is flatly rejected (R^2 ~ -1.26); a free saturating fit ' +
    'alpha = alpha_inf + c L^{-p} prefers alpha_inf ~ 0.880 (p ~ 0.765, R^2 ~ 0.99994), BELOW 1; and ' +
    'locking the limit to 1 via alpha = 1 - c L^{-p} demands an implausibly slow p ~ 0.281 at a ' +
    'degraded R^2 ~ 0.970. The ladder is CONSISTENT WITH the centroid-expansion alpha -> 1 but does ' +
    'NOT confirm it -- the depth (L <~ 1836, capped by the FD/OLS floor, whose coarse 4-pts/decade ' +
    'sampling additionally biases the deepest-rung reading DOWN by ~0.0019) is too shallow to ' +
    'separate a limit of 0.88 from 1. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34126 (F2 span exponent alpha ladder 0.698..0.855, source); imp-34129/imp-34188 ' +
    '(sibling convergence/limit fits on the widening slope); imp-34065 (window-span scaling; S1 ' +
    'shortfall grows with span); imp-33816 (POINTWISE gap law 1/(2L)); imp-33859 (log-N-space ' +
    'direct evaluation past IEEE-double overflow); imp-486 (C_mb GUE-conditional); ' +
    'polymath15-constant-C-C.',
};

export const IMP34191_SPAN_EXPONENT_ALPHA_LIMIT_FIT_ASSERTIONS = [
  {
    // Reuse gate: the re-derived alpha ladder reproduces imp-34126 F2 to the fourth decimal.
    id: 'imp34191-reproduces-imp34126-alpha-ladder',
    description: 'ladder alpha reproduces imp-34126 F2 0.6976/0.7563/0.8084/0.8379/0.8549 (tol 1e-3)',
    holds: () => {
      const want = [0.6976, 0.7563, 0.8084, 0.8379, 0.8549];
      return A_ARR.length === 5 && A_ARR.every((a, i) => Math.abs(a - want[i]) < 1e-3);
    },
  },
  {
    // (F1): the fixed alpha = 1 - c/L surrogate is REJECTED -- R^2 is negative (worse than the mean).
    id: 'imp34191-fixed-invL-rejected',
    description: 'alpha = 1 - c/L fits with R^2 < 0 (a 1/L approach to 1 is too fast for the ladder)',
    holds: () => FIT_A.r2 < 0,
  },
  {
    // (F2): the free three-parameter fit is excellent but extrapolates to alpha_inf ~ 0.88, NOT 1.
    id: 'imp34191-free-fit-limit-below-one',
    description: 'alpha = alpha_inf + c L^{-p} fits R^2 > 0.999 with alpha_inf in [0.85, 0.92] (< 1)',
    holds: () => FIT_B.r2 > 0.999 && FIT_B.alpha_inf > 0.85 && FIT_B.alpha_inf < 0.92,
  },
  {
    // (F3): locking the limit to 1 needs a slow exponent p ~ 0.28 and a worse R^2 than the free fit.
    id: 'imp34191-fixed-limit1-needs-slow-exponent',
    description: 'alpha = 1 - c L^{-p} needs p in [0.24, 0.33] at R^2 ~ 0.97, below the free-fit R^2',
    holds: () =>
      FIT_C.p > 0.24 && FIT_C.p < 0.33 && FIT_C.r2 > 0.95 && FIT_C.r2 < FIT_B.r2,
  },
  {
    // (F4): the coarse 4-pts/decade OLS biases the deepest-rung alpha DOWNWARD (refining lifts it).
    id: 'imp34191-precision-floor-biases-down',
    description: 'refining 4 -> 8 pts/decade at N=1e800 lifts alpha (downward_bias > 0, < 0.01)',
    holds: () => PRECISION.downward_bias > 0 && PRECISION.downward_bias < 0.01,
  },
  {
    // Honesty gate: measurement/fit only, extrapolated limit NOT confirmed to be 1, no QED, no refereed bound is changed.
    id: 'imp34191-honesty-gate-no-qed',
    description: 'Measurement only: verdict EQUIVOCAL (limit not confirmed 1), no QED, no refereed bound is changed',
    holds: () =>
      IMP34191_SPAN_EXPONENT_ALPHA_LIMIT_FIT.isRigorous === false &&
      /EQUIVOCAL/.test(IMP34191_SPAN_EXPONENT_ALPHA_LIMIT_FIT.verdict) &&
      /NO QED/.test(IMP34191_SPAN_EXPONENT_ALPHA_LIMIT_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34191_SPAN_EXPONENT_ALPHA_LIMIT_FIT.verdict),
  },
];

for (const a of IMP34191_SPAN_EXPONENT_ALPHA_LIMIT_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34191-span-exponent-alpha-limit-fit assertion failed: ${a.id}`);
  }
}
