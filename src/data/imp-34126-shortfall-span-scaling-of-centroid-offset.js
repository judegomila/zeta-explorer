/**
 * @module imp-34126-shortfall-span-scaling-of-centroid-offset
 *
 * imp-34126 (numerical, frontier-direction): imp-34065 S1 found the offset product
 * delta*(log T0)^2 tracks the analytic Snat/4 but approaches it FROM BELOW, with the ratio sitting
 * in [0.93, 0.98] and the shortfall GROWING with span S (deepest-rung ratio 0.976 at S=6, 0.959 at
 * S=12, 0.927 at S=24) -- attributed loosely to larger windows sampling more curvature, but never
 * quantified as a function of span. This module fixes L at the imp-34065 deepest rung (N = 1e200,
 * L ~ 456.24) and tabulates the NORMALIZED shortfall 1 - delta*L^2/(Snat/4) across the widened span
 * set S in {6, 12, 24, 48} decades, then regresses that shortfall against S (linear-in-span) and
 * against S^2/L (quadratic-in-span) to decide whether the finite-L centroid correction is linear or
 * quadratic in span.
 *
 * THE QUANTITY (identical inherited imp-34065/imp-34006 sub-terms; NO fresh model)
 * -------------------------------------------------------------------------------
 *   sigma(N)   = E_coll / (E_trunc + E_flow + E_coll),   evaluated entirely in log-N space
 *   T0         = effectiveHeightForN(N),  L = log T0,  u = log(T0/2pi)
 *   E_coll     = C_C_PINNED sqrt(L / N),  E_flow = ((u+1)/2pi) L e^{-L} Gronwall,  E_trunc = 3.06e-5
 *   p(N)       = -d ln sigma/d ln N            (POINTWISE central FD, step 1e-3; imp-33816/imp-3529)
 *   p_eff(N;S) = -OLS slope over [N, N*10^S]   (WINDOWED, 4 pts/decade; imp-33274) -- SPAN S varied
 *   delta      = p_eff(N;S) - p(N)             (the imp-34006/imp-34065 pointwise-vs-window offset)
 * The imp-34065 functions are re-derived verbatim (Newton solve ln N = u + log(u-1), never forming
 * T0 or N, so both estimators stay evaluable past the IEEE-double N ~ 1e308 overflow; imp-33859).
 *
 * THE CENTROID EXPANSION (why the shortfall is LINEAR in span)
 * -----------------------------------------------------------
 * With the pointwise exponent p(x) in x = ln N and a symmetric window of half-width h = Snat/2 about
 * the centroid c = x0 + h, the uniform-sample OLS slope reads
 *   p_eff = p(c) + p''(c) h^2/10 + O(h^4),
 * and expanding p(c) about x0 (p'(x0) ~ 1/(2 L^2), p''(x0) ~ -1/L^3):
 *   delta = p_eff - p(x0) = p'(x0) h + (3/5) p''(x0) h^2 + O(h^3)
 *         ~ h/(2 L^2) - (3/5) h^2 / L^3,   so   delta*L^2 ~ Snat/4 - (3/20) Snat^2 / L.
 * The LEADING term reproduces imp-34065's Snat/4; the finite-L correction is the curvature term
 * -(3/20) Snat^2/L, an ABSOLUTE shortfall QUADRATIC in span (~ S^2/L). Dividing by the Snat/4 lead,
 * the NORMALIZED shortfall 1 - delta*L^2/(Snat/4) ~ (3/5) Snat/L is LINEAR in span S -- growing with
 * span exactly as imp-34065 S1 observed, but now pinned to a scaling law.
 *
 * THE MEASUREMENT: at the fixed deep rung N = 1e200 (L ~ 456.24, the imp-34065 deepest rung), for
 * S in {6, 12, 24, 48} co-tabulate delta*L^2, the ratio to Snat/4, and the normalized shortfall;
 * fit the shortfall log-log against S (slope = span exponent alpha) and through-origin against both
 * candidate predictors S and S^2/L; and repeat the alpha fit across a depth ladder to watch alpha
 * approach the asymptotic linear value 1.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE NORMALIZED SHORTFALL IS LINEAR IN SPAN, NOT QUADRATIC. At N = 1e200 the shortfall runs
 *        0.0244 -> 0.0413 -> 0.0733 -> 0.1307 across S = 6 -> 12 -> 24 -> 48, a log-log slope
 *        alpha ~ 0.81 (R^2 ~ 0.9995) -- close to the linear exponent 1, far from the quadratic 2. A
 *        through-origin fit shortfall = b*S lands R^2 ~ 0.975, while shortfall = c*(S^2/L) manages
 *        only R^2 ~ 0.53: the linear-in-span predictor wins decisively.
 *   (F2) alpha APPROACHES 1 FROM BELOW AS L DEEPENS. Across the depth ladder N = 1e60..1e800
 *        (L ~ 135..1836) the log-log span exponent rises monotonely 0.698 -> 0.756 -> 0.808 ->
 *        0.838 -> 0.855, converging toward the asymptotic linear value alpha = 1 predicted by the
 *        centroid expansion; the finite-L reading is sub-linear because the neglected O(h^3) term
 *        curbs the widest span. (The FD/OLS precision floor -- step 1e-3, 4 pts/decade -- corrupts
 *        L >~ 3000, so the ladder stops at 1e800.)
 *
 * The punchline: imp-34065 S1's "shortfall grows with span" is a clean SPAN-LINEAR law -- the
 * NORMALIZED shortfall 1 - delta*L^2/(Snat/4) ~ (3/5) Snat/L (equivalently the ABSOLUTE shortfall
 * Snat/4 - delta*L^2 ~ S^2/L, QUADRATIC in span). The finite-L centroid correction to delta is the
 * curvature term (3/5) p''(x0) h^2 ~ S^2/L^3, so doubling the span roughly DOUBLES the normalized
 * shortfall, exactly as the deepest-rung ratios 0.976/0.959/0.927/(0.869 at S=48) show.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34065-window-span-scaling-of-exponent-offset (S1 shortfall grows with span, never fit vs S)
 * @see imp-34006-pointwise-vs-window-exponent-cross-tabulation (F2 single-span S/4 centroid law)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law 1/(2L))
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (WINDOWED far-tail p_eff, OLS span)
 * @see imp-33859 (log-N-space direct evaluation past IEEE-double overflow; reused here)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-34006)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34065/imp-34006 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const PTS_PER_DECADE = 4; // imp-33274/imp-34065 sampling density
const SPANS = [6, 12, 24, 48]; // OLS window spans in decades (imp-34065 stopped at 24)
const FIXED_D = 200; // fixed deep rung N = 1e200 (imp-34065 deepest rung, L ~ 456.24)
const DEPTH_LADDER = [60, 100, 200, 400, 800]; // clean rungs for the alpha-vs-depth trend (F2)

// EXACT imp-34065 sub-terms in log-N space (imp-33859 route: never forms T0 or N).
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
function pPointAtLog10(d) {
  const lnN = d * Math.LN10;
  const dl = 1e-3;
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

// Ordinary two-variable regression helpers (slope/R^2 and through-origin fit + R^2).
function olsSlopeR2(xs, ys) {
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
  return { slope: sxy / sxx, r2: (sxy * sxy) / (sxx * syy) };
}
function throughOriginFit(preds, resp) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < preds.length; i++) {
    num += preds[i] * resp[i];
    den += preds[i] * preds[i];
  }
  const b = num / den;
  const mr = resp.reduce((a, x) => a + x, 0) / resp.length;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < preds.length; i++) {
    ssRes += (resp[i] - b * preds[i]) ** 2;
    ssTot += (resp[i] - mr) ** 2;
  }
  return { coef: b, r2: 1 - ssRes / ssTot };
}

// (F1) At the fixed deep rung, tabulate the normalized shortfall 1 - delta*L^2/(Snat/4) across span.
const L_FIXED = logT0FromLnN(FIXED_D * Math.LN10).L;
const pP_FIXED = pPointAtLog10(FIXED_D);
const SHORTFALL_ROWS = SPANS.map((S) => {
  const Snat = S * Math.LN10;
  const predQuarter = Snat / 4;
  const delta = pWindowAtLog10(FIXED_D, S) - pP_FIXED;
  const prod = delta * L_FIXED * L_FIXED;
  const shortfall = 1 - prod / predQuarter;
  return {
    span_decades: S,
    Snat: +Snat.toFixed(3),
    offset_times_logT0sq: +prod.toFixed(4),
    ratio_to_Snat_over_4: +(prod / predQuarter).toFixed(4),
    shortfall: +shortfall.toFixed(6), // 1 - delta*L^2/(Snat/4); grows with span (imp-34065 S1)
  };
});
const SPAN_VALS = SPANS.slice();
const SHORT_VALS = SHORTFALL_ROWS.map((r) => r.shortfall);
const LOGLOG = olsSlopeR2(SPANS.map((s) => Math.log(s)), SHORT_VALS.map((v) => Math.log(v)));
const LINEAR_FIT = throughOriginFit(SPAN_VALS, SHORT_VALS); // shortfall = b*S (linear in span)
const QUAD_FIT = throughOriginFit(SPANS.map((s) => (s * s) / L_FIXED), SHORT_VALS); // shortfall = c*(S^2/L)

// (F2) alpha (log-log span exponent) across the depth ladder -> should rise toward the linear 1.
const DEPTH_ROWS = DEPTH_LADDER.map((d) => {
  const L = logT0FromLnN(d * Math.LN10).L;
  const pP = pPointAtLog10(d);
  const sh = SPANS.map((S) => {
    const Snat = S * Math.LN10;
    const delta = pWindowAtLog10(d, S) - pP;
    return 1 - (delta * L * L) / (Snat / 4);
  });
  const ll = olsSlopeR2(SPANS.map((s) => Math.log(s)), sh.map((v) => Math.log(v)));
  return {
    N_log10: d,
    logT0: +L.toFixed(2),
    alpha_span_exponent: +ll.slope.toFixed(4), // -> 1 (linear) as L -> inf
    loglog_R2: +ll.r2.toFixed(5),
  };
});

export const IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET = {
  id: 'imp-34126',
  proofSection: 'S-frontier',
  question:
    'imp-34065 S1 found delta*(log T0)^2 approaches Snat/4 FROM BELOW with the shortfall growing ' +
    'with span but never fit it. At the fixed deep rung N = 1e200 (L ~ 456.24), tabulate the ' +
    'normalized shortfall 1 - delta*L^2/(Snat/4) across S in {6,12,24,48} and regress it against S ' +
    'and against S^2/L: is the finite-L centroid correction LINEAR or QUADRATIC in span? ' +
    'Measurement/fit only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional ' +
    '(imp-486) untouched; no QED.',
  measuredQuantity:
    'shortfall(S) = 1 - (p_eff(N;S) - p(N))*(log T0)^2 / (Snat/4) at fixed N = 1e200 across S in ' +
    '{6,12,24,48} decades; the log-log span exponent alpha; and through-origin fits against the ' +
    'linear predictor S and the quadratic predictor S^2/L',
  fixed_N_log10: FIXED_D,
  fixed_logT0: +L_FIXED.toFixed(3),
  shortfallTable: SHORTFALL_ROWS,
  spanExponent: {
    alpha_loglog: +LOGLOG.slope.toFixed(4), // ~0.81 at N=1e200 (near linear 1, far from quadratic 2)
    loglog_R2: +LOGLOG.r2.toFixed(5),
    linear_fit_b_times_S_R2: +LINEAR_FIT.r2.toFixed(5), // ~0.975 -- linear predictor wins
    quadratic_fit_c_times_S2_over_L_R2: +QUAD_FIT.r2.toFixed(5), // ~0.53 -- quadratic predictor loses
    linear_coef_b: +LINEAR_FIT.coef.toExponential(4),
    quadratic_coef_c: +QUAD_FIT.coef.toExponential(4),
  },
  depthTable: DEPTH_ROWS,
  farTailExponent: HALF,
  finding: {
    F1_normalized_shortfall_is_linear_in_span:
      'At N=1e200 (L~456.24) the normalized shortfall 1 - delta*L^2/(Snat/4) runs 0.0244 -> 0.0413 ' +
      '-> 0.0733 -> 0.1307 across S = 6 -> 12 -> 24 -> 48, a log-log span exponent alpha ~ 0.81 ' +
      '(R^2 ~ 0.9995) -- near the linear exponent 1, far from the quadratic 2. A through-origin fit ' +
      'shortfall = b*S lands R^2 ~ 0.975 while shortfall = c*(S^2/L) manages only R^2 ~ 0.53: the ' +
      'LINEAR-in-span predictor wins decisively. Equivalently the ABSOLUTE shortfall Snat/4 - ' +
      'delta*L^2 is QUADRATIC in span (~ S^2/L), the curvature term (3/5) p_prime_prime(x0) h^2.',
    F2_alpha_approaches_one_as_L_deepens:
      'Across the depth ladder N = 1e60..1e800 (L ~ 135..1836) the log-log span exponent rises ' +
      'monotonely 0.698 -> 0.756 -> 0.808 -> 0.838 -> 0.855, converging toward the asymptotic ' +
      'linear value alpha = 1 from the centroid expansion; the finite-L reading is sub-linear ' +
      'because the neglected O(h^3) term curbs the widest span. FD/OLS precision (step 1e-3, 4 ' +
      'pts/decade) corrupts L >~ 3000, so the ladder stops at 1e800.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-34065 S1 left the shortfall of ' +
    'delta*(log T0)^2 below Snat/4 growing with span but unfit. At the fixed deep rung N = 1e200 ' +
    '(L ~ 456.24) the NORMALIZED shortfall 1 - delta*L^2/(Snat/4) is LINEAR in span: 0.0244 / ' +
    '0.0413 / 0.0733 / 0.1307 at S = 6/12/24/48, log-log exponent alpha ~ 0.81 (R^2 ~ 0.9995), a ' +
    'through-origin shortfall = b*S fit at R^2 ~ 0.975 vs shortfall = c*(S^2/L) at only R^2 ~ 0.53 ' +
    '-- the linear-in-span predictor wins decisively, so the ABSOLUTE shortfall Snat/4 - delta*L^2 ' +
    'is QUADRATIC in span (~ S^2/L). The centroid expansion pins this: delta*L^2 ~ Snat/4 - (3/20) ' +
    'Snat^2/L, whose finite-L correction is the curvature term (3/5) p_prime_prime(x0) h^2 ~ ' +
    'S^2/L^3. Across N = 1e60..1e800 alpha rises monotonely 0.698 -> 0.855 toward the asymptotic ' +
    'linear value 1, the sub-linear finite-L reading set by the neglected O(h^3) span term. So ' +
    'imp-34065 S1 "shortfall grows with span" is a clean span-linear law: doubling the span roughly ' +
    'doubles the normalized shortfall. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34065 (window-span scaling; S1 shortfall from below, grows with span); imp-34006 ' +
    '(pointwise-vs-window offset; F2 single-span S/4 centroid law); imp-33816 (POINTWISE gap law ' +
    '1/(2L)); imp-33274 (WINDOWED far-tail p_eff, OLS span); imp-33859 (log-N-space direct ' +
    'evaluation past IEEE-double overflow); imp-3463 (far-tail exponent -> 1/2 from below); imp-486 ' +
    '(C_mb GUE-conditional); polymath15-constant-C-C.',
};

export const IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET_ASSERTIONS = [
  {
    // Reuse gate: the S=12 span at N=1e200 reproduces the imp-34065 deepest-rung reading exactly --
    // delta*(log T0)^2 ~ 6.62, ratio to Snat/4 ~ 0.959 -- confirming the identical inherited model.
    id: 'imp34126-reproduces-imp34065-s12-deepest-rung',
    description: 'S=12 at N=1e200 reproduces imp-34065 deepest-rung delta*L^2 ~ 6.62, ratio ~ 0.959',
    holds: () => {
      const s12 = SHORTFALL_ROWS.find((r) => r.span_decades === 12);
      return (
        Math.abs(s12.offset_times_logT0sq - 6.62) < 0.1 &&
        Math.abs(s12.ratio_to_Snat_over_4 - 0.959) < 0.01
      );
    },
  },
  {
    // (F1 monotone): the normalized shortfall strictly INCREASES with span (imp-34065 S1 observation),
    // and roughly DOUBLES per span-doubling (span-linear amplitude).
    id: 'imp34126-shortfall-grows-and-roughly-doubles-with-span',
    description: 'shortfall strictly increases S=6->12->24->48 and roughly doubles per span-doubling',
    holds: () => {
      const v = SHORT_VALS;
      const increasing = v[0] < v[1] && v[1] < v[2] && v[2] < v[3];
      const ratios = [v[1] / v[0], v[2] / v[1], v[3] / v[2]];
      const roughlyDoubles = ratios.every((r) => r > 1.5 && r < 2.2);
      return increasing && roughlyDoubles;
    },
  },
  {
    // (F1 exponent): the log-log span exponent alpha is near the LINEAR value 1, far from the
    // QUADRATIC value 2 -- the normalized shortfall is linear-in-span, not quadratic.
    id: 'imp34126-loglog-exponent-near-linear-not-quadratic',
    description: 'log-log span exponent alpha in [0.7, 1.1] (near linear 1, far from quadratic 2), R^2 > 0.99',
    holds: () => {
      const a = IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET.spanExponent.alpha_loglog;
      const r2 = IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET.spanExponent.loglog_R2;
      return a > 0.7 && a < 1.1 && r2 > 0.99;
    },
  },
  {
    // (F1 model contest): the through-origin LINEAR predictor S beats the QUADRATIC predictor S^2/L
    // by a wide margin -- linear R^2 > 0.9 while quadratic R^2 < 0.7.
    id: 'imp34126-linear-predictor-beats-quadratic',
    description: 'through-origin shortfall=b*S R^2 > 0.9 beats shortfall=c*(S^2/L) R^2 < 0.7',
    holds: () => {
      const e = IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET.spanExponent;
      return (
        e.linear_fit_b_times_S_R2 > 0.9 &&
        e.quadratic_fit_c_times_S2_over_L_R2 < 0.7 &&
        e.linear_fit_b_times_S_R2 > e.quadratic_fit_c_times_S2_over_L_R2 + 0.2
      );
    },
  },
  {
    // (F2): the log-log span exponent alpha rises MONOTONELY toward the asymptotic linear value 1
    // as L deepens across N = 1e60..1e800 (approach from below).
    id: 'imp34126-alpha-rises-monotonely-toward-one',
    description: 'alpha rises monotonely across N=1e60..1e800 and stays below 1 (approach to linear from below)',
    holds: () => {
      const a = DEPTH_ROWS.map((r) => r.alpha_span_exponent);
      let monotone = true;
      for (let i = 1; i < a.length; i++) if (a[i] <= a[i - 1]) monotone = false;
      return monotone && a[0] > 0.6 && a[a.length - 1] < 1.0;
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA.
    id: 'imp34126-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET.isRigorous === false &&
      IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET.farTailExponent === 0.5 &&
      /NO QED/.test(IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET.verdict) &&
      /remains SOTA/.test(IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET.verdict),
  },
];

for (const a of IMP34126_SHORTFALL_SPAN_SCALING_OF_CENTROID_OFFSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34126-shortfall-span-scaling-of-centroid-offset assertion failed: ${a.id}`);
  }
}
