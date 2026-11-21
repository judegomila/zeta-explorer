/**
 * @module imp-34328-sigma-vs-product-gap-log2pi-shift
 *
 * imp-34328 (numerical, frontier-direction): CROSS-VALIDATE the imp-34197 exact product gap
 * = 1/(2u) against the imp-33816 sigma-exponent gap ~ 1/(2 log T0) on a shared reference-N
 * ladder. imp-34197 called the sigma-share law "the same law", but the two modules never
 * tabulated their gaps side by side. This module settles whether the sigma channel ALSO
 * collapses to an EXACT 1/(2u) (log(2pi) cancelling), or whether it RETAINS the log(2pi) shift
 * -- i.e. whether the sigma-exponent gap is 1/(2 log T0) = 1/(2(u+log 2pi)) rather than 1/(2u).
 *
 * THE TWO GAPS (the same inherited resid, scaled on two different axes)
 * --------------------------------------------------------------------
 * Both channels rest on the SAME finite-N residual (imp-34130/imp-34197 closed form; u = log(T0/2pi),
 * L = log T0 = u + log(2pi)):
 *     resid(N) = (1/2)(u-1)/(u L)   ( = (1/2) d ln(log T0)/d ln N ).
 *   - imp-34197 forms the PRODUCT log T0 * resid = L * resid = (1/2)(u-1)/u = (1/2)(1 - 1/u), so its
 *     approach gap is   gapProduct = 1/2 - log T0 * resid = 1/(2u) EXACTLY (log T0 cancels the 1/L).
 *   - imp-33816 measures the BARE sigma-exponent shortfall gapSigma = 1/2 - p(N), and in the far
 *     tail (sigma ~ (C_C/E_trunc) sqrt(log T0 / N)) that shortfall IS resid itself:
 *         gapSigma = 1/2 - p = (1/2) d ln(log T0)/d ln N = resid = (1/2)(u-1)/(u L),
 *     which imp-33816 F2 validated as ~ 1/(2 log T0) (ratio gap/(0.5/log T0) -> 1).
 *
 * THE VERDICT: the sigma channel KEEPS the log(2pi) shift; only the product removes it
 * -----------------------------------------------------------------------------------
 * gapSigma is resid un-multiplied by log T0, so its leading term is 1/(2L) = 1/(2 log T0), NOT
 * 1/(2u). Scaled on the u axis, gapSigma * u = (1/2)(u-1)/L drifts to 1/2 only slowly and never
 * exactly (log(2pi)-shifted, 0.446 -> 0.500 across the ladder). Scaled on its NATURAL axis L,
 *     gapSigma * L = (1/2)(u-1)/u = 1/2 - 1/(2u),
 * which reveals the exact complementarity with the product channel:
 *     gapSigma * log T0 + gapProduct = 1/2   (EXACTLY, at every rung).
 * So the E_coll product uniquely removes the log(2pi) shift by multiplying resid by log T0; the
 * sigma exponent, un-multiplied, retains it. The two channels are NOT the identical 1/(2u) law --
 * they are exact complements on the log T0 axis, carrying the SAME (u-1)/u finite-N factor on two
 * different axes (u for the product gap, log T0 for the sigma gap).
 *
 * THE FINDING (cross-check / tabulation only)
 * -------------------------------------------
 *   (F1) THE SIGMA GAP DOES NOT CARRY THE EXACT 1/2. gapSigma * u = (1/2)(u-1)/L equals
 *        0.44607 -> 0.46787 -> ... -> 0.49999 across log10 N in {12,20,50,100,300,1000,3000,10000,1e5}
 *        -- it approaches 1/2 but is NOT the constant 1/2 that gapProduct * u == 0.5 (imp-34197) is at
 *        every rung. The sigma-exponent gap is log(2pi)-shifted: 1/(2 log T0), not 1/(2u).
 *   (F2) THE EXACT COMPLEMENT IDENTITY. On the natural log T0 axis gapSigma * log T0 = 1/2 - 1/(2u),
 *        so gapSigma * log T0 + gapProduct = 1/2 to 12+ figures at every rung -- the two gaps are exact
 *        complements, and 1/2 - gapSigma * log T0 reproduces the imp-34197 product gap 1/(2u) identically.
 *   (F3) THE SHIFT IS THE RATIO (u-1)/L. gapSigma / gapProduct = (u-1)/(u+log 2pi) rises 0.89215 ->
 *        0.99999 from below; its deficit from 1 is the log(2pi)=1.83788 shift (plus the -1/u finite
 *        term) that the product cancels and the sigma exponent keeps. The channels agree on the 1/2
 *        LEADING coefficient and the (u-1)/u factor, but the sigma gap sits on the log T0 axis, the
 *        product gap on the u axis -- differing by exactly the log(2pi) offset between them.
 *
 * CROSS-CHECK / TABULATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34197-logt0-resid-product-approach-rate (the product gap = 1/(2u) EXACT, log(2pi) cancels)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the sigma-exponent gap ~ 1/(2 log T0), F2 law)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the shared resid = (1/2) d ln(log T0)/d ln N)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0 or N)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2)
 */

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const LOG_2PI = Math.log(TWO_PI); // 1.83788... the shift between L = log T0 and u = log(T0/2pi)

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi) by Newton,
// never forming T0 or N (identical to imp-34197/imp-33816, reaches log10 N ~ 1e5 past IEEE range).
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

// The shared finite-N residual (imp-34130/imp-34197 closed form). This IS the far-tail
// sigma-exponent gap 1/2 - p(N) (imp-33816 F2), AND the factor the imp-34197 product multiplies by log T0.
function residFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  return HALF * (u - 1) / (u * L);
}

// Shared reference-N ladder (same rungs as imp-34197, so the two channels sit on identical N).
const LADDER_LOG10N = [12, 20, 50, 100, 300, 1000, 3000, 10000, 100000];

// The side-by-side gap table the two source modules never tabulated together.
const GAP_LADDER = LADDER_LOG10N.map((d) => {
  const lnN = d * Math.LN10;
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  const gapSigma = HALF * (u - 1) / (u * L); // imp-33816 sigma-exponent gap 1/2 - p ~ 1/(2 log T0)
  const gapProduct = 1 / (2 * u); // imp-34197 exact product gap 1/(2u)
  return {
    log10N: d,
    u: +u.toFixed(4),
    logT0: +L.toFixed(4),
    gapSigma: +gapSigma.toExponential(6), // ~ 1/(2 log T0) = 1/(2L), log(2pi)-shifted
    gapProduct: +gapProduct.toExponential(6), // = 1/(2u) EXACT (imp-34197)
    gapSigma_times_u: +(gapSigma * u).toFixed(8), // (1/2)(u-1)/L -> 1/2 SLOWLY, NOT the constant 1/2 (F1)
    gapSigma_times_logT0: +(gapSigma * L).toFixed(12), // (1/2)(u-1)/u = 1/2 - 1/(2u) (F2 natural axis)
    gapProduct_times_u: +(gapProduct * u).toFixed(12), // == 1/2 EXACT (imp-34197 reference)
    complementSum: +(gapSigma * L + gapProduct).toFixed(12), // gapSigma*log T0 + gapProduct == 1/2 EXACT (F2)
    ratio_sigma_over_product: +(gapSigma / gapProduct).toFixed(8), // (u-1)/L -> 1 from below (F3)
  };
});

// (F3) the shift is exactly (u-1)/L; its deficit from 1 is (log 2pi + 1)/L -- the log(2pi) offset
// PLUS a finite 1/L term (from the -1/u factor). The log(2pi) part is the larger of the two.
const SHIFT_AT_1e100 = (() => {
  const u = uFromLnN(100 * Math.LN10);
  const L = u + LOG_2PI;
  return {
    ratio: +((u - 1) / L).toFixed(8), // gapSigma/gapProduct at log10 N = 100
    deficitFromOne: +(1 - (u - 1) / L).toExponential(4), // = (log 2pi + 1)/L, the retained shift
    log2piComponent: +(LOG_2PI / L).toExponential(4), // log(2pi)/L, the larger part of the deficit
    finiteComponent: +(1 / L).toExponential(4), // 1/L, the -1/u finite part of the deficit
  };
})();

export const IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT = {
  id: 'imp-34328',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-34197 exact product gap = 1/(2u) against the imp-33816 sigma-exponent ' +
    'gap ~ 1/(2 log T0) on a shared reference-N ladder: does the sigma channel also collapse to an ' +
    'EXACT 1/(2u) (log(2pi) cancelling), or does it RETAIN the log(2pi) shift (gap ~ 1/(2 log T0), ' +
    'not 1/(2u)) that the E_coll product uniquely removes? Cross-check/tabulation only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the two approach gaps on a shared ladder log10 N in {12,20,50,100,300,1000,3000,10000,1e5}: ' +
    'gapProduct = 1/2 - log T0 * resid = 1/(2u) (imp-34197) and gapSigma = 1/2 - p = resid = ' +
    '(1/2)(u-1)/(u log T0) (imp-33816), with resid = (1/2) d ln(log T0)/d ln N the shared finite-N factor',
  sharedResidClosedForm:
    'resid(N) = (1/2)(u-1)/(u L), u = log(T0/2pi), L = log T0 = u + log(2pi); the product multiplies ' +
    'this by L (log T0 cancels -> gap 1/(2u)), the sigma exponent leaves it bare (leading 1/(2L), shifted)',
  gapLadder: GAP_LADDER,
  exactComplementIdentity: 'gapSigma * log T0 + gapProduct = 1/2 EXACTLY at every rung',
  shiftIsRatio: SHIFT_AT_1e100, // gapSigma/gapProduct = (u-1)/L; deficit from 1 dominated by log(2pi)/L
  finding: {
    F1_sigma_gap_does_not_carry_the_exact_half:
      'gapSigma * u = (1/2)(u-1)/L equals 0.44607 -> 0.46787 -> 0.48736 -> 0.49374 -> ... -> 0.49999 ' +
      'across the ladder -- it approaches 1/2 but is NOT the constant 1/2 that gapProduct * u == 0.5 ' +
      '(imp-34197) is at every rung. The sigma-exponent gap RETAINS the log(2pi) shift: it is ' +
      '1/(2 log T0) = 1/(2(u+log 2pi)), NOT 1/(2u). The sigma channel does not carry the exact 1/2.',
    F2_exact_complement_on_the_logT0_axis:
      'On its natural log T0 axis gapSigma * log T0 = (1/2)(u-1)/u = 1/2 - 1/(2u), so ' +
      'gapSigma * log T0 + gapProduct = 1/2 to 12+ figures at every rung -- the two gaps are EXACT ' +
      'complements, and 1/2 - gapSigma * log T0 reproduces the imp-34197 product gap 1/(2u) identically. ' +
      'The channels share the (u-1)/u finite-N factor but wear it on different axes (log T0 vs u).',
    F3_shift_is_the_ratio_u_minus_1_over_L:
      'gapSigma / gapProduct = (u-1)/(u+log 2pi) rises 0.89215 -> 0.93575 -> ... -> 0.99999 from below; ' +
      'at log10 N = 100 the ratio is 0.98748, its deficit from 1 (=~1.25e-2) decomposing EXACTLY as ' +
      '(log 2pi + 1)/L = the log(2pi)=1.83788 shift (log 2pi / L =~8.1e-3, the larger part) plus a finite ' +
      '1/L =~4.4e-3 term (from the -1/u factor). That log(2pi) offset is exactly what the E_coll product ' +
      'cancels (by multiplying resid by log T0) and the sigma exponent keeps.',
  },
  isRigorous: false,
  verdict:
    'CROSS-CHECK / TABULATION (frontier-direction, NOT rigorous). Tabulating the imp-34197 product gap ' +
    '1/(2u) and the imp-33816 sigma-exponent gap side by side on a shared reference-N ladder settles the ' +
    'imp-34197 "same law" note: they are NOT the identical 1/(2u) law. Both rest on the shared finite-N ' +
    'residual resid = (1/2)(u-1)/(u log T0), but the E_coll product multiplies it by log T0 -- cancelling ' +
    'the 1/(log T0) and giving the EXACT gap 1/(2u) with log(2pi) removed -- whereas the sigma exponent ' +
    'leaves resid bare, so its gap is the log(2pi)-shifted 1/(2 log T0) = 1/(2(u+log 2pi)), NOT 1/(2u). ' +
    'The sigma channel does NOT carry the exact 1/2 (gapSigma * u drifts 0.446 -> 0.500, never exact); on ' +
    'its natural log T0 axis the two are EXACT complements gapSigma * log T0 + gapProduct = 1/2, and their ' +
    'ratio (u-1)/(u+log 2pi) exposes the retained log(2pi) shift. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34197 (product gap = 1/(2u) EXACT, log(2pi) cancels); imp-33816 (sigma-exponent gap ~ ' +
    '1/(2 log T0), F2 law); imp-34130 (shared resid = (1/2) d ln(log T0)/d ln N); imp-33859 (log-space ' +
    'direct path ln N = u + log(u-1)); imp-3463 (far-tail exponent -> 1/2); imp-486 (C_mb GUE-conditional).',
};

export const IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT_ASSERTIONS = [
  {
    // Reuse gate: the product gap column reproduces imp-34197s exact 1/(2u) (gapProduct * u == 1/2).
    id: 'imp34328-reproduces-imp34197-exact-product-gap',
    description: 'gapProduct * u == 0.5 within 1e-11 at every rung (reproduces imp-34197 exact 1/(2u))',
    holds: () => GAP_LADDER.every((r) => Math.abs(r.gapProduct_times_u - HALF) < 1e-11),
  },
  {
    // (F1): the sigma gap does NOT carry the exact 1/2 -- gapSigma * u is strictly below 1/2 and rises.
    id: 'imp34328-sigma-gap-not-exact-half-on-u-axis',
    description: 'gapSigma * u is strictly below 1/2 at every rung and rises monotonically (log(2pi)-shifted, not 1/(2u))',
    holds: () => {
      if (!GAP_LADDER.every((r) => r.gapSigma_times_u < HALF)) return false;
      for (let i = 1; i < GAP_LADDER.length; i++) {
        if (!(GAP_LADDER[i].gapSigma_times_u > GAP_LADDER[i - 1].gapSigma_times_u)) return false;
      }
      // the first rung sits well below 1/2 (~0.446): the shift is a real gap, not rounding.
      return GAP_LADDER[0].gapSigma_times_u < 0.46;
    },
  },
  {
    // (F2): the exact complement identity gapSigma * log T0 + gapProduct == 1/2 at every rung.
    id: 'imp34328-exact-complement-identity',
    description: 'gapSigma * log T0 + gapProduct == 0.5 within 1e-11 at every rung (exact complements)',
    holds: () => GAP_LADDER.every((r) => Math.abs(r.complementSum - HALF) < 1e-11),
  },
  {
    // (F2): 1/2 - gapSigma * log T0 reproduces the imp-34197 product gap 1/(2u) identically
    // (recomputed at FULL precision -- the stored ladder fields are 7-sig-fig cache values).
    id: 'imp34328-half-minus-sigma-logT0-is-product-gap',
    description: '1/2 - gapSigma * log T0 == gapProduct (= 1/(2u)) within 1e-12 at every rung (full precision)',
    holds: () =>
      LADDER_LOG10N.every((d) => {
        const lnN = d * Math.LN10;
        const u = uFromLnN(lnN);
        const L = u + LOG_2PI;
        const gapSigmaTimesL = residFromLnN(lnN) * L; // = (1/2)(u-1)/u
        const gapProduct = 1 / (2 * u);
        return Math.abs(HALF - gapSigmaTimesL - gapProduct) < 1e-12;
      }),
  },
  {
    // (F3): the ratio gapSigma/gapProduct = (u-1)/L rises from below toward 1; its deficit from 1
    // decomposes EXACTLY as (log 2pi + 1)/L, with the log(2pi)/L part the larger of the two.
    id: 'imp34328-ratio-is-log2pi-shift',
    description: 'gapSigma/gapProduct = (u-1)/L rises monotonically toward 1 (< 1 everywhere); deficit at 1e100 = log(2pi)/L + 1/L exactly, log(2pi) part larger',
    holds: () => {
      if (!GAP_LADDER.every((r) => r.ratio_sigma_over_product < 1)) return false;
      for (let i = 1; i < GAP_LADDER.length; i++) {
        if (!(GAP_LADDER[i].ratio_sigma_over_product > GAP_LADDER[i - 1].ratio_sigma_over_product)) return false;
      }
      const s = SHIFT_AT_1e100;
      // the deficit from 1 is EXACTLY log(2pi)/L + 1/L, and the log(2pi) component dominates.
      return (
        Math.abs(s.deficitFromOne - (s.log2piComponent + s.finiteComponent)) < 1e-6 &&
        s.log2piComponent > s.finiteComponent
      );
    },
  },
  {
    // Honesty gate: cross-check only, no QED, no refereed bound is changed.
    id: 'imp34328-honesty-gate-no-qed',
    description: 'Cross-check only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT.isRigorous === false &&
      /NO QED/.test(IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT.verdict) &&
      /refereed bound is changed/i.test(IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT.verdict),
  },
];

for (const a of IMP34328_SIGMA_VS_PRODUCT_GAP_LOG2PI_SHIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34328-sigma-vs-product-gap-log2pi-shift assertion failed: ${a.id}`);
  }
}
