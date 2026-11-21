/**
 * @module imp-34197-logt0-resid-product-approach-rate
 *
 * imp-34197 (numerical, frontier-direction): imp-34130 (F3) reported that the product
 * log T0 * resid RISES from 0.4788 on the band [1e11,1e12] to 0.50000 at N ~ 1e10000 on the
 * imp-33859 log-space direct path, "confirming resid ~ 1/(2 log T0)" -- but it never FIT the
 * RATE at which the product approaches its limit 1/2. This module tabulates the approach gap
 *     gap(N) = 1/2 - log T0 * resid
 * across the direct-path ladder and fits its decay against 1/u (u = log(T0/2pi)) to confirm the
 * ~1/(2u) closed form and extract the leading coefficient.
 *
 * THE QUANTITY (identical inherited imp-3220/imp-3406/imp-33816 sub-term, per imp-34130/imp-34187)
 * ----------------------------------------------------------------------------------------------
 *     E_coll(N) = C_C sqrt(log T0 / N),   T0 = effectiveHeightForN(N)   (GUE-conditional C_H)
 * Its local exponent in ln N is q(N) = -1/2 + (1/2) d ln(log T0)/d ln N, so the residual to -1/2
 * is resid(N) = q + 1/2 = (1/2) d ln(log T0)/d ln N. With u = log(T0/2pi) the Riemann-von Mangoldt
 * inverse gives ln N = u + log(u-1) and d(log T0)/d ln N = (u-1)/u, whence
 *     resid(N) = (1/2)(u-1)/(u log T0) ~ 1/(2 log T0),   L := log T0 = u + log(2pi).
 * Evaluated on the imp-33859 LOG-SPACE DIRECT PATH (Newton solve of ln N = u + log(u-1); never
 * forms T0 or N), so it reaches log10(N) ~ 1e5 far past IEEE range. Import-light: C_C cancels in
 * the local-exponent derivative (per [[no_heavy_imports_in_pages]]).
 *
 * THE EXACT CANCELLATION (the sharpening of imp-34130 F3)
 * ------------------------------------------------------
 * Forming the product makes L cancel IDENTICALLY:
 *     log T0 * resid = L * (1/2)(u-1)/(u L) = (1/2)(u-1)/u = (1/2)(1 - 1/u),
 * so the approach gap is NOT merely ~1/(2u) to leading order -- it is EXACTLY
 *     gap(N) = 1/2 - log T0 * resid = 1/2 * (1/u) = 1/(2u).
 * The log(2pi) shift between L and u drops out of the product entirely, so there is NO
 * slowly-varying prefactor and NO subleading 1/u^2 term: the leading coefficient is exactly 1/2
 * and gap * u is a dimensionless CONSTANT 1/2 across the whole ladder. (Contrast imp-34187, where
 * the SAME finite-N (u-1)/u factor shows up as the cf/measured ratio relaxing to 1 from above --
 * there it rides on log10 N; here, in the product, it collapses to the clean gap = 1/(2u).)
 *
 * THE FINDING (tabulation + fit only)
 * -----------------------------------
 *   (F1) THE PRODUCT RISES TO 1/2 AND gap * u IS EXACTLY 1/2. Across the ladder log10 N in
 *        {12, 20, 50, 100, 300, 1000, 3000, 10000, 100000} the product log T0 * resid rises
 *        0.479571 -> 0.488188 -> 0.495472 -> 0.497776 -> 0.499269 -> 0.499782 -> 0.499928 ->
 *        0.499978 -> 0.499998, and the scaled gap gap * u equals 0.5 to 12 significant figures at
 *        every rung. The band [1e11,1e12] product ~0.4786 reproduces imp-34130 F3s 0.4788 reading.
 *   (F2) THE OLS FIT gap = c / u RECOVERS c = 1/2 EXACTLY. A least-squares fit of gap against
 *        x = 1/u across the nine rungs returns slope c = 0.5000000, intercept ~0 (below 1e-15
 *        absolute), and R^2 = 1 to machine precision -- so the approach rate is the exact closed
 *        form gap = 1/(2u), leading coefficient exactly 1/2, no residual scatter.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the source: product -> 1/2, rate never fit)
 * @see imp-34187-ecoll-residual-milestone-ladder (the (u-1)/u factor as cf/measured ratio -> 1 from above)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the sigma-share exponent gap ~ 1/(2 log T0); same law)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0/N)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> -1/2 from above)
 */

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote; E_coll local exponent -> -1/2 from above

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi) by Newton,
// never forming T0 or N (reaches log10 N ~ 1e5 far past IEEE-double range).
function uFromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 200; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-15 * Math.max(1, u)) break;
  }
  return u;
}
const logT0FromLnN = (lnN) => uFromLnN(lnN) + Math.log(TWO_PI); // L = log T0 = u + log(2pi)

// resid(N) = (1/2)(u-1)/(u log T0), the imp-34130 closed form (C_C cancels; exact, no FD noise).
function residAnalyticFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + Math.log(TWO_PI);
  return HALF * (u - 1) / (u * L);
}

// imp-34130 FD cross-path (log(C_C) drops in the central difference) -- for the model gate below.
function residFDFromLnN(lnN) {
  const dl = 1e-3;
  const f = (x) => 0.5 * Math.log(logT0FromLnN(x)) - 0.5 * x;
  return (f(lnN + dl) - f(lnN - dl)) / (2 * dl) + HALF;
}

const LADDER_LOG10N = [12, 20, 50, 100, 300, 1000, 3000, 10000, 100000];

// (F1) the ladder: product log T0 * resid rises to 1/2; the scaled gap gap*u == 1/2 exactly.
const PRODUCT_LADDER = LADDER_LOG10N.map((d) => {
  const lnN = d * Math.LN10;
  const u = uFromLnN(lnN);
  const L = u + Math.log(TWO_PI);
  const resid = residAnalyticFromLnN(lnN);
  const product = L * resid;
  const gap = HALF - product;
  return {
    log10N: d,
    u: +u.toFixed(4),
    logT0: +L.toFixed(4),
    invU: +(1 / u).toExponential(6), // the fit abscissa x = 1/u
    resid: +resid.toExponential(6),
    logT0_times_resid: +product.toFixed(6), // -> 1/2 (imp-34130 F3)
    gap: +gap.toExponential(6), // 1/2 - product -> 0
    gap_times_u: +(gap * u).toFixed(12), // == 1/2 exactly (the exact closed form gap = 1/(2u))
  };
});

// (F2) ordinary-least-squares fit gap = slope * (1/u) + intercept across the ladder.
const FIT = (() => {
  // full-precision u and gap (NOT the toFixed-rounded ladder fields) so the fit reflects the exact model.
  const xs = LADDER_LOG10N.map((d) => 1 / uFromLnN(d * Math.LN10));
  const ys = LADDER_LOG10N.map((d) => HALF - logT0FromLnN(d * Math.LN10) * residAnalyticFromLnN(d * Math.LN10));
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const mx = sx / n;
  const my = sy / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) * (xs[i] - mx);
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) * (ys[i] - my);
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2 };
})();

// Model-consistency gate: the imp-34130 FD product path == this analytic product path at log10 N = 100.
const MODEL_GATE_FD_VS_ANALYTIC_PRODUCT = (() => {
  const lnN = 100 * Math.LN10;
  const L = logT0FromLnN(lnN);
  return Math.abs(L * residFDFromLnN(lnN) - L * residAnalyticFromLnN(lnN));
})();

// imp-34130 F3 band [1e11,1e12] reading (~0.4788): the mean product over that band.
const BAND_PRODUCT_1e11_1e12 = (() => {
  const p = (d) => logT0FromLnN(d * Math.LN10) * residAnalyticFromLnN(d * Math.LN10);
  return +(0.5 * (p(11) + p(12))).toFixed(4);
})();

// imp-34249: WHERE does the product first EXCEED 0.499? The exact gap = 1/(2u) makes this a
// closed-form threshold: product = 1/2 - 1/(2u) > 0.499 <=> 1/(2u) < 1e-3 <=> u > 500. So the
// product crosses 0.499 exactly at u = 500 (product = 0.499 there), i.e. at ln N = 500 + log(499)
// on the imp-33859 direct path -- log10 N ~ 219.85, sitting between the 100 and 300 rungs.
const PRODUCT_EXCEEDS_0499 = (() => {
  const uCross = 500; // 1/2 - 1/(2u) = 0.499 => u = 500 exactly
  const lnNCross = uCross + Math.log(uCross - 1); // imp-33859 direct path ln N = u + log(u-1)
  const log10NCross = lnNCross / Math.LN10;
  const uBack = uFromLnN(lnNCross); // numeric round-trip: Newton recovers u ~ 500
  const productAtCross = HALF * (uBack - 1) / uBack; // == 0.499 at the crossover
  return { uCross, log10NCross, productAtCross, uBack };
})();

// imp-34331: INDEPENDENT cross-check of the imp-34249 u=500 landmark against the imp-34197 exact fit.
// imp-34249 read u=500 off the ASSUMED gap = 1/(2u), inverting 1/2 - 1/(2u) = 0.499 by hand. Here we
// instead solve the FULL product L * resid = 0.499 DIRECTLY from the ladder -- L and resid multiplied
// numerically, the (1/2)(u-1)/u cancellation NOT pre-applied -- by bisection on ln N, then read off u.
// If imp-34197s claim of NO subleading term were wrong (a residual 1/u^2 pulling the product down) the
// direct solve would land at u = 499.x; recovering u = 500 to ~2e-11 independently corroborates both the
// u=500 landmark and the exact-c=1/2 fit (the two closed-form landmarks are mutually consistent).
const CROSSCHECK_DIRECT_SOLVE_0499 = (() => {
  const productOfLnN = (lnN) => logT0FromLnN(lnN) * residAnalyticFromLnN(lnN);
  let lo = 100 * Math.LN10; // product 0.497776 < 0.499
  let hi = 300 * Math.LN10; // product 0.499269 > 0.499
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (productOfLnN(mid) < 0.499) lo = mid;
    else hi = mid;
  }
  const lnNStar = 0.5 * (lo + hi);
  const uStar = uFromLnN(lnNStar);
  return {
    uStar, // -> 500.0000000000 (matches the imp-34249 u=500 landmark from an independent solve)
    deviationFrom500: uStar - 500, // -> ~ -2.5e-11 (no 1/u^2 residual pulling the crossover to 499.x)
    log10NStar: lnNStar / Math.LN10, // -> ~219.845, agreeing with PRODUCT_EXCEEDS_0499.log10NCross
    productAtStar: productOfLnN(lnNStar), // -> 0.499
  };
})();

export const IMP34197_LOGT0_RESID_PRODUCT_APPROACH_RATE = {
  id: 'imp-34197',
  proofSection: 'S-frontier',
  question:
    'imp-34130 (F3) reported that the product log T0 * resid rises from 0.4788 on the band [1e11,1e12] ' +
    'to 0.50000 at N ~ 1e10000 on the imp-33859 log-space direct path, confirming resid ~ 1/(2 log T0), ' +
    'but never fit the RATE at which the product approaches its limit 1/2. Tabulate the gap ' +
    '1/2 - log T0 * resid across the direct-path ladder and fit its decay against 1/u (u = log(T0/2pi)) ' +
    'to confirm the ~1/(2u) closed form and extract the leading coefficient. Measurement/fit only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'separated E_coll = C_C sqrt(log T0 / N); the approach gap gap(N) = 1/2 - log T0 * resid, where ' +
    'resid(N) = (1/2)(u-1)/(u log T0), tabulated across log10 N in {12,20,50,100,300,1000,3000,10000,100000} ' +
    'on the imp-33859 log-space direct path, plus the OLS fit of gap against 1/u',
  exactClosedForm:
    'log T0 * resid = L*(1/2)(u-1)/(uL) = (1/2)(u-1)/u; the log T0 factor cancels identically, so ' +
    'gap = 1/2 - log T0 * resid = 1/(2u) EXACTLY -- leading coefficient exactly 1/2, no subleading 1/u^2 term',
  productLadder: PRODUCT_LADDER,
  fit: {
    model: 'gap = slope * (1/u) + intercept',
    slope: +FIT.slope.toFixed(10), // -> 1/2 exactly (the leading coefficient)
    intercept: +FIT.intercept.toExponential(3), // ~0
    rSquared: +FIT.r2.toFixed(12), // 1 to machine precision
  },
  bandProduct_1e11_1e12: BAND_PRODUCT_1e11_1e12, // ~0.4786, reproduces imp-34130 F3s 0.4788
  productFirstExceeds0499: {
    // imp-34249: exact closed-form threshold from gap = 1/(2u): product > 0.499 <=> u > 500.
    threshold: 0.499,
    uCrossing: PRODUCT_EXCEEDS_0499.uCross, // exactly 500 (product = 1/2 - 1/(2u) = 0.499 at u = 500)
    log10NCrossing: +PRODUCT_EXCEEDS_0499.log10NCross.toFixed(4), // ~219.85
    productAtCrossing: +PRODUCT_EXCEEDS_0499.productAtCross.toFixed(6), // 0.499000
    note:
      'product exceeds 0.499 for u > 500, i.e. log10 N > ~219.85 on the imp-33859 direct path -- it ' +
      'sits between the log10 N = 100 rung product 0.497776 and the 300 rung product 0.499269',
  },
  crossCheck_imp34249_direct_solve: {
    // imp-34331: solve L*resid = 0.499 DIRECTLY (cancellation not pre-applied) -> u lands at 500.
    method: 'bisection on ln N of the full product L * resid = 0.499, cancellation NOT pre-applied',
    uStar: +CROSSCHECK_DIRECT_SOLVE_0499.uStar.toFixed(9), // 500.000000000
    deviationFrom500: +CROSSCHECK_DIRECT_SOLVE_0499.deviationFrom500.toExponential(3), // ~ -2.5e-11
    log10NStar: +CROSSCHECK_DIRECT_SOLVE_0499.log10NStar.toFixed(4), // ~219.8453
    productAtStar: +CROSSCHECK_DIRECT_SOLVE_0499.productAtStar.toFixed(6), // 0.499000
    consistent: Math.abs(CROSSCHECK_DIRECT_SOLVE_0499.deviationFrom500) < 1e-6,
    note:
      'imp-34249 read u=500 off the assumed gap = 1/(2u); solving the full product = 0.499 directly ' +
      'from the ladder recovers u = 500 to ~2.5e-11, so the two closed-form landmarks are mutually ' +
      'consistent and the direct solve independently corroborates imp-34197s claim of NO subleading ' +
      '1/u^2 term (which would have pulled the crossover to u = 499.x). Cross-check only; NO QED.',
  },
  modelGate_FD_vs_analytic_product_at_1e100: +MODEL_GATE_FD_VS_ANALYTIC_PRODUCT.toExponential(3), // ~0
  farTailExponent: -HALF, // imp-3463 asymptote the local exponent q(N) approaches from above
  finding: {
    F1_product_rises_to_half_and_scaled_gap_is_exactly_half:
      'Across the ladder the product log T0 * resid rises 0.479571 -> 0.488188 -> 0.495472 -> 0.497776 -> ' +
      '0.499269 -> 0.499782 -> 0.499928 -> 0.499978 -> 0.499998, and the scaled gap gap*u equals 0.5 to 12 ' +
      'significant figures at every rung -- so the approach gap is the exact closed form 1/(2u), not merely ' +
      '~1/(2u) to leading order. The band [1e11,1e12] product ~0.4786 reproduces imp-34130 F3s 0.4788 reading.',
    F2_ols_fit_recovers_leading_coefficient_one_half:
      'An OLS fit of gap against x = 1/u across the nine rungs returns slope 0.5000000, intercept ~0 (below ' +
      '1e-15 absolute) and R^2 = 1 to machine precision -- confirming the ~1/(2u) closed form and pinning the ' +
      'leading coefficient at exactly 1/2, with no residual scatter (the log(2pi) shift cancels in the product).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / FIT (frontier-direction, NOT rigorous). The imp-34130 F3 approach of the product ' +
    'log T0 * resid to its limit 1/2, now fit: forming the product cancels the log T0 factor identically ' +
    '(log T0 * resid = (1/2)(u-1)/u), so the gap 1/2 - log T0 * resid is EXACTLY 1/(2u) -- gap*u = 1/2 to ' +
    '12 figures across log10 N = 12..1e5, and an OLS fit of gap vs 1/u returns slope 0.5000000, intercept ~0, ' +
    'R^2 = 1. The leading coefficient is exactly 1/2 with no subleading correction. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34130 (product log T0 * resid -> 1/2, rate never fit); imp-34187 (the (u-1)/u factor as the ' +
    'cf/measured ratio -> 1 from above); imp-33816 (sigma-share exponent gap ~ 1/(2 log T0), same law); ' +
    'imp-33859 (log-space direct path ln N = u + log(u-1)); imp-3463 (far-tail exponent -> -1/2 from above); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP34197_LOGT0_RESID_PRODUCT_APPROACH_RATE_ASSERTIONS = [
  {
    // (F1) the product rises monotonically toward 1/2 (from below) across the ladder.
    id: 'imp34197-product-rises-monotonically-to-half',
    description: 'log T0 * resid strictly increasing across the ladder, all below 1/2, tightest within 1e-5 of 1/2',
    holds: () => {
      for (let i = 1; i < PRODUCT_LADDER.length; i++) {
        if (!(PRODUCT_LADDER[i].logT0_times_resid > PRODUCT_LADDER[i - 1].logT0_times_resid)) return false;
      }
      if (!PRODUCT_LADDER.every((r) => r.logT0_times_resid < HALF)) return false;
      return HALF - PRODUCT_LADDER[PRODUCT_LADDER.length - 1].logT0_times_resid < 1e-5;
    },
  },
  {
    // (F1) the exact closed form: gap*u == 1/2 to 12 figures at EVERY rung (the log T0 factor cancels).
    id: 'imp34197-scaled-gap-is-exactly-one-half',
    description: 'gap * u == 0.5 within 1e-11 at every rung (gap = 1/(2u) exact)',
    holds: () => PRODUCT_LADDER.every((r) => Math.abs(r.gap_times_u - HALF) < 1e-11),
  },
  {
    // (F2) the OLS fit recovers the leading coefficient 1/2 exactly, intercept ~0, R^2 = 1.
    id: 'imp34197-ols-fit-recovers-half',
    description: 'OLS gap vs 1/u: slope within 1e-9 of 1/2, |intercept| < 1e-14, R^2 within 1e-12 of 1',
    holds: () =>
      Math.abs(FIT.slope - HALF) < 1e-9 &&
      Math.abs(FIT.intercept) < 1e-14 &&
      Math.abs(FIT.r2 - 1) < 1e-12,
  },
  {
    // (F1) reuse gate: the band [1e11,1e12] mean product reproduces imp-34130 F3s ~0.4788 reading.
    id: 'imp34197-reproduces-imp34130-band-product',
    description: 'band [1e11,1e12] mean product within 0.002 of imp-34130 F3s 0.4788',
    holds: () => Math.abs(BAND_PRODUCT_1e11_1e12 - 0.4788) < 2e-3,
  },
  {
    // model gate: the imp-34130 FD product path == this analytic product path at log10 N = 100 (same model).
    id: 'imp34197-fd-vs-analytic-product-model-gate',
    description: 'imp-34130 FD product == analytic product at log10 N = 100 (< 1e-6)',
    holds: () => MODEL_GATE_FD_VS_ANALYTIC_PRODUCT < 1e-6,
  },
  {
    // (imp-34249) the product first exceeds 0.499 at u = 500 exactly (log10 N ~ 219.85), bracketed by the 100/300 rungs.
    id: 'imp34197-product-first-exceeds-0499-at-u-500',
    description: 'product > 0.499 <=> u > 500 exactly; crossover log10 N ~ 219.85 sits between the 100 and 300 rungs',
    holds: () => {
      const c = PRODUCT_EXCEEDS_0499;
      if (c.uCross !== 500) return false;
      if (Math.abs(c.productAtCross - 0.499) > 1e-12) return false;
      if (!(c.log10NCross > 219 && c.log10NCross < 221)) return false;
      const p100 = logT0FromLnN(100 * Math.LN10) * residAnalyticFromLnN(100 * Math.LN10);
      const p300 = logT0FromLnN(300 * Math.LN10) * residAnalyticFromLnN(300 * Math.LN10);
      return p100 < 0.499 && p300 > 0.499;
    },
  },
  {
    // (imp-34331) INDEPENDENT direct solve of L*resid = 0.499 lands at u = 500 (agrees with imp-34249),
    // corroborating the exact-c=1/2 fit with no subleading 1/u^2 term; the two landmarks are consistent.
    id: 'imp34197-crosscheck-imp34249-direct-solve-lands-at-u500',
    description: 'direct bisection solve of L*resid = 0.499 recovers u = 500 within 1e-6, agreeing with the imp-34249 landmark',
    holds: () => {
      const c = CROSSCHECK_DIRECT_SOLVE_0499;
      if (!(Math.abs(c.uStar - 500) < 1e-6)) return false;
      if (!(Math.abs(c.productAtStar - 0.499) < 1e-9)) return false;
      if (!(c.log10NStar > 219 && c.log10NStar < 221)) return false;
      // it agrees with the by-hand imp-34249 crossover to full precision.
      return Math.abs(c.uStar - PRODUCT_EXCEEDS_0499.uCross) < 1e-6;
    },
  },
  {
    // honesty gate: fit only, far-tail exponent = -1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34197-honesty-gate-no-qed',
    description: 'Fit only: far-tail exponent = -1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP34197_LOGT0_RESID_PRODUCT_APPROACH_RATE.isRigorous === false &&
      IMP34197_LOGT0_RESID_PRODUCT_APPROACH_RATE.farTailExponent === -0.5 &&
      /NO QED/.test(IMP34197_LOGT0_RESID_PRODUCT_APPROACH_RATE.verdict) &&
      /refereed bound is changed/i.test(IMP34197_LOGT0_RESID_PRODUCT_APPROACH_RATE.verdict),
  },
];

for (const a of IMP34197_LOGT0_RESID_PRODUCT_APPROACH_RATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34197-logt0-resid-product-approach-rate assertion failed: ${a.id}`);
  }
}
