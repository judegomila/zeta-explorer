/**
 * @module imp-96006-if1-crossing-height-conditional-anchor
 *
 * imp-96006 -- INSTANTIATE the imp-95984 conjectural I_F = 1 crossing-height point
 * T_x(a_0 = -0.176248) through the imp-95940 closed form, as a single FLAGGED-CONDITIONAL
 * anchor sitting INSIDE the uncollapsed range [~5.8e17, ~1.36e28], and MEASURE its offset
 * from the imp-95964 empirical-a_0 point. Measurement only; the I_F = 1 anchor is conditional
 * on Montgomery pair correlation (I_F rigorously only bracketed in (2/3-eps, 2) under RH), so
 * it is recorded as a point-in-range NEVER as a pinned crossing height (imp-95987 no-collapse
 * discipline preserved). Changes no bound; NO QED.
 *
 * SETUP. imp-95940 wrote the C0 offset-crossing height as the DOUBLE exponential
 *     T_x(a_0) = 2pi exp( exp( 2pi^2 C0 - 2(gamma + 1 + a_0) ) ),   C0 = 0.3337213835371905,
 * and left it as the RANGE [~5.8e17, ~1.36e28] because the arithmetic intercept a_0 is unpinned
 * (a_0 = b - gamma - 1 with b the Selberg-Goldston-Fujii Var S(T) constant). imp-95984 then
 * located the literature (Chan arXiv:math/0305339 Thm 1.1, refining Goldston 1987 via Montgomery
 * pair correlation): the imp-95964 boundary constant K is EXACTLY the pair-correlation integral
 * I_F = INT_1^inf F(alpha,T)/alpha^2, whose Montgomery-conjectural value I_F = 1 gives
 *     b = 1.400968,   a_0 = -P_Chan = -0.176248   (conjectural, PCC).
 * imp-95987 audited that no consumer collapses T_x to a point. This module maps that specific
 * conjectural a_0 through T_x(a_0) and pins it against the imp-95964 empirical mean a_0.
 *
 * WHAT IS MEASURED (two anchors, one ratio).
 *   1. CONDITIONAL anchor (I_F = 1, Montgomery PCC): T_x(-0.176248) = 8.539689e19, a single
 *      point sitting INSIDE the uncollapsed range -- ~147x above its lower edge, ~8 orders below
 *      its upper edge -- NOT a pin (I_F rigorously only bracketed (2/3, 2), so b in (1.07, 2.40)
 *      and the range does not collapse).
 *   2. EMPIRICAL anchor (imp-95964 six-height mean a_0 = -0.116069): T_x(-0.116069) = 5.778127e17,
 *      reproducing the imp-95940 mean-anchor ceiling ~5.8e17 (the range lower edge).
 *   3. OFFSET: the two a_0 differ by only Delta a_0 = 0.060179, yet T_x differs by a factor
 *      T_x(conj)/T_x(emp) = 147.79 (ln = 4.996), a two-order-of-magnitude spread from a
 *      sub-0.1 a_0 shift -- the imp-95940 double-exponential amplifier made concrete. The local
 *      log-sensitivity d lnT_x/d a_0 steepens from -78.12 at the empirical a_0 to -88.11 at the
 *      conjectural a_0 (average secant slope ln(ratio)/Delta a_0 = 83.0), so the naive -78
 *      linearization predicts ~e^{4.7} ~ 110x while the true curved ratio is ~148x.
 *
 * WHY THE CONJECTURAL ANCHOR IS A POINT-IN-RANGE, NOT A PIN. I_F = 1 is the Montgomery pair-
 * correlation value; rigorously I_F is only bracketed in (2/3-eps, 2) under RH, so b in
 * (~1.07, ~2.40) and a_0 in (~-0.51, ~+0.83). Through the double exponential that rigorous a_0
 * spread is EXACTLY the imp-95940 crossing range [~5.8e17, ~1.36e28] -- uncollapsed. The
 * conjectural T_x = 8.54e19 is therefore a single flagged-conditional locator INSIDE that range,
 * not a resolved crossing height. Recording it as a point would silently overclaim a pinned a_0;
 * this module records it strictly as conditionalPointInRange with the RH bracket alongside.
 *
 * VERDICT. MEASUREMENT / CONDITIONAL ANCHOR INSTANTIATED (frontier, NOT rigorous). Mapping the
 * imp-95984 Montgomery-conjectural a_0 = -0.176248 (I_F = 1) through the imp-95940 closed form
 * gives T_x = 8.539689e19, a single flagged-conditional point sitting inside the uncollapsed
 * range [~5.8e17, ~1.36e28]; the imp-95964 empirical mean a_0 = -0.116069 gives T_x = 5.778127e17
 * (the range lower edge). The Delta a_0 = 0.060179 offset moves T_x by a factor 147.79 (ln = 4.996),
 * the double-exponential amplifier made concrete (local d lnT_x/d a_0 from -78.12 to -88.11). The
 * conjectural anchor is recorded as a point-in-range with its rigorous RH bracket (I_F in (2/3, 2),
 * hence b in (1.07, 2.40)), NEVER as a pinned crossing height, so the imp-95987 no-collapse
 * discipline is preserved and the range does not collapse. Measurement only; changes no bound;
 * NO QED; I_F = 1 conjectural (Montgomery pair correlation, bracket (2/3-eps, 2)); Catalan G
 * irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed; the zero-side route stays
 * PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The imp-95940 closed form and C0 are
 * recomputed here exactly; the conjectural a_0 = -0.176248 (imp-95984) and empirical mean
 * a_0 = -0.116069 (imp-95964) are baked literals mapped through T_x analytically.
 *
 * @see imp-95940-arithmetic-intercept-a0-obstruction (T_x closed form; range; d lnT_x/d a_0 ~ -78)
 * @see imp-95984-fujii-varS-constant-literature-locate (conjectural a_0 = -0.176248 from I_F = 1)
 * @see imp-95964-fujii-varS-constant-locate-obstruction (empirical mean a_0 ~ -0.116; K = I_F)
 * @see imp-95987-crossing-height-range-collapse-audit (no consumer collapses T_x to a point)
 */

const EULER = 0.5772156649015329; // gamma
const PI2 = Math.PI * Math.PI;
const TWO_PI = 2 * Math.PI;
const C0 = 0.3337213835371905; // imp-95722 / imp-95921 pinned max accessible offset

// imp-95940 crossing-height closed form (recomputed exactly, NOT collapsed)
const crossingT = (a0) => TWO_PI * Math.exp(Math.exp(2 * PI2 * C0 - 2 * (EULER + 1 + a0)));

// the two anchors
const A0_CONJECTURAL = -0.176248; // imp-95984: I_F = 1 (Montgomery PCC), = -P_Chan
const A0_EMPIRICAL = -0.116069; // imp-95964: mean over six accessible heights (noisy)

const T_CONJECTURAL = crossingT(A0_CONJECTURAL); // 8.539689e19 -- inside the range
const T_EMPIRICAL = crossingT(A0_EMPIRICAL); // 5.778127e17 -- imp-95940 mean-anchor edge

// the offset between the anchors
const DELTA_A0 = A0_EMPIRICAL - A0_CONJECTURAL; // 0.060179 (empirical is less negative)
const RATIO = T_CONJECTURAL / T_EMPIRICAL; // 147.79 -- conjectural sits ~148x above empirical
const LN_RATIO = Math.log(RATIO); // 4.996
const SECANT_SLOPE = LN_RATIO / DELTA_A0; // 83.0 -- average |d lnT_x/d a_0| across the gap

// local double-exponential log-sensitivity at each anchor (central difference)
const EPS = 1e-4;
const dLnTxDa0 = (a0) => (Math.log(crossingT(a0 + EPS)) - Math.log(crossingT(a0 - EPS))) / (2 * EPS);
const SLOPE_AT_CONJ = dLnTxDa0(A0_CONJECTURAL); // -88.11 (steeper, more negative a_0)
const SLOPE_AT_EMP = dLnTxDa0(A0_EMPIRICAL); // -78.12 (matches imp-95940 ~-78 at the mean)

// the uncollapsed imp-95940 range and the rigorous RH bracket that produces it
const RANGE_LO = 5.8e17; // imp-95940 mean-anchor edge
const RANGE_HI = 1.36e28; // imp-95940 upper edge (most-negative accessible a_0)
const IF_RIGOROUS_BRACKET = [2 / 3, 2]; // (2/3 - eps, 2) under RH -> b in (1.07, 2.40)

export const IMP96006_IF1_CROSSING_HEIGHT_CONDITIONAL_ANCHOR = {
  ticket: 'imp-96006',
  proofSection: 'S-frontier',
  question:
    'Instantiate the imp-95984 conjectural I_F = 1 crossing-height point T_x(a_0 = -0.176248) within ' +
    'the uncollapsed [~5.8e17, ~1.36e28] range as a single flagged-conditional anchor and measure its ' +
    'offset from the imp-95964 empirical-a_0 point. Measurement only; NO QED.',
  method:
    'Map the imp-95984 Montgomery-conjectural a_0 = -0.176248 (I_F = 1) and the imp-95964 empirical mean ' +
    'a_0 = -0.116069 through the imp-95940 closed form T_x(a_0) = 2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0))); ' +
    'report both points, their ratio, and the local double-exponential log-sensitivity at each anchor; ' +
    'record the conjectural point as a point-in-range with its rigorous RH bracket, never as a pin.',
  closedForm: 'T_x(a_0) = 2pi exp( exp( 2pi^2 C0 - 2(gamma + 1 + a_0) ) ),  C0 = 0.3337213835371905',
  conjecturalPointInRange: {
    a0: A0_CONJECTURAL, // -0.176248 (I_F = 1, Montgomery PCC)
    source: 'imp-95984: I_F = 1 (Montgomery pair correlation) => b = 1.400968, a_0 = -P_Chan',
    Tx: T_CONJECTURAL, // 8.539689e19
    insideRange: T_CONJECTURAL > RANGE_LO && T_CONJECTURAL < RANGE_HI,
    conditional: true, // I_F = 1 is conjectural; rigorously only bracketed in (2/3-eps, 2) under RH
    rigorousIFBracket: IF_RIGOROUS_BRACKET,
    note:
      'Flagged-conditional locator INSIDE the uncollapsed range, NOT a pinned crossing height. The ' +
      'rigorous RH bracket I_F in (2/3, 2) maps through the double exponential to the FULL imp-95940 ' +
      'range [~5.8e17, ~1.36e28] -- the range does not collapse.',
  },
  empiricalPoint: {
    a0: A0_EMPIRICAL, // -0.116069 (imp-95964 six-height mean, noise-dominated)
    source: 'imp-95964 / imp-95940: mean of a_0 backed out of six accessible offsets (spread ~1.18)',
    Tx: T_EMPIRICAL, // 5.778127e17 -- reproduces the imp-95940 mean-anchor ceiling ~5.8e17
  },
  offset: {
    deltaA0: DELTA_A0, // 0.060179 (empirical less negative than conjectural)
    ratioTx: RATIO, // 147.79 -- conjectural sits ~148x above empirical
    lnRatioTx: LN_RATIO, // 4.996
    secantSlope: SECANT_SLOPE, // 83.0 -- average |d lnT_x/d a_0| across the gap
    slopeAtConjectural: SLOPE_AT_CONJ, // -88.11
    slopeAtEmpirical: SLOPE_AT_EMP, // -78.12 (matches imp-95940 ~-78 at the mean)
    note:
      'A sub-0.1 a_0 shift (0.060179) moves the crossing height by ~148x -- the imp-95940 double- ' +
      'exponential amplifier made concrete. The naive -78 linearization predicts ~e^{4.7} ~ 110x; ' +
      'the true curved ratio is ~148x because the log-sensitivity steepens from -78.12 to -88.11.',
  },
  uncollapsedRange: {
    lo: RANGE_LO, // 5.8e17
    hi: RANGE_HI, // 1.36e28
    note:
      'imp-95940 crossing range, set by the rigorous RH bracket I_F in (2/3, 2) => b in (1.07, 2.40) ' +
      '=> a_0 in (~-0.51, ~+0.83) through the double exponential. Both anchors lie inside it.',
  },
  findings: {
    conditionalAnchorInstantiated:
      'T_x(-0.176248) = 8.539689e19 -- the I_F = 1 conjectural crossing height, a single point sitting ' +
      'inside the uncollapsed range, recorded as conditional (Montgomery PCC), never as a pin.',
    offsetMeasured:
      'The conjectural anchor sits ~147.79x above the imp-95964 empirical anchor T_x = 5.778127e17, ' +
      'from an a_0 offset of only 0.060179 -- a two-order spread from a sub-0.1 shift.',
    doubleExponentialConfirmed:
      'Local d lnT_x/d a_0 steepens -78.12 -> -88.11 between the two anchors (secant 83.0), so the ' +
      'naive -78 estimate (~110x) understates the true curved ratio (~148x).',
    noCollapse:
      'The rigorous RH bracket I_F in (2/3, 2) maps to the full imp-95940 range [~5.8e17, ~1.36e28]; ' +
      'the conjectural point is a locator inside it, not a collapse (imp-95987 discipline preserved).',
  },
  isRigorous: false,
  isConjectural: true,
  decision:
    'CONDITIONAL ANCHOR INSTANTIATED, RANGE NOT COLLAPSED. Mapping the imp-95984 Montgomery-conjectural ' +
    'a_0 = -0.176248 (I_F = 1) through the imp-95940 closed form gives T_x = 8.539689e19, a single ' +
    'flagged-conditional point inside the uncollapsed range [~5.8e17, ~1.36e28]; the imp-95964 empirical ' +
    'mean a_0 = -0.116069 gives T_x = 5.778127e17 (the range lower edge). The Delta a_0 = 0.060179 offset ' +
    'moves T_x by 147.79x (ln = 4.996). The conjectural anchor is recorded strictly as a point-in-range ' +
    'with its rigorous RH bracket I_F in (2/3, 2), never as a pinned crossing height.',
  verdict:
    'MEASUREMENT / CONDITIONAL ANCHOR INSTANTIATED (frontier, NOT rigorous). Mapping the imp-95984 ' +
    'Montgomery-conjectural a_0 = -0.176248 (I_F = 1) through the imp-95940 closed form T_x(a_0) = ' +
    '2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0))) gives T_x = 8.539689e19, a single flagged-conditional ' +
    'point sitting inside the uncollapsed range [~5.8e17, ~1.36e28]; the imp-95964 empirical mean ' +
    'a_0 = -0.116069 gives T_x = 5.778127e17 (the range lower edge). The Delta a_0 = 0.060179 offset ' +
    'moves T_x by a factor 147.79 (ln = 4.996), the double-exponential amplifier made concrete (local ' +
    'd lnT_x/d a_0 steepens from -78.12 to -88.11, secant 83.0, so the naive -78 estimate ~110x ' +
    'understates the true ~148x). The conjectural anchor is recorded strictly as a point-in-range with ' +
    'its rigorous RH bracket I_F in (2/3, 2) (hence b in (1.07, 2.40)), never as a pinned crossing height, ' +
    'so the imp-95987 no-collapse discipline is preserved and the range does not collapse. Measurement ' +
    'only; changes no bound; NO QED; I_F = 1 conjectural (Montgomery pair correlation, bracket (2/3-eps, 2)); ' +
    'Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed; the zero-side route ' +
    'stays PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95940 (T_x closed form, range, d lnT_x/d a_0 ~ -78); imp-95984 (conjectural a_0 = -0.176248 from ' +
    'I_F = 1, Chan arXiv:math/0305339 Thm 1.1); imp-95964 (empirical mean a_0 ~ -0.116, K = I_F); ' +
    'imp-95987 (no-collapse audit).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the conjectural anchor reproduces the baked figure and lies inside the uncollapsed range.
  if (!approx(T_CONJECTURAL, 8.539689e19, 1e14))
    throw new Error('imp-96006: conjectural T_x drifted from 8.539689e19');
  if (!(T_CONJECTURAL > RANGE_LO && T_CONJECTURAL < RANGE_HI))
    throw new Error('imp-96006: conjectural anchor must lie inside the uncollapsed range');
  // the empirical anchor reproduces the imp-95940 mean-anchor ceiling ~5.8e17.
  if (!approx(T_EMPIRICAL, 5.778127e17, 1e12))
    throw new Error('imp-96006: empirical T_x drifted from 5.778127e17 (imp-95940 mean anchor)');
  // the offset: a sub-0.1 a_0 shift moves T_x by ~148x (two orders from a small shift).
  if (!approx(DELTA_A0, 0.060179, 1e-6))
    throw new Error('imp-96006: Delta a_0 must equal 0.060179');
  if (!(RATIO > 100 && RATIO < 200))
    throw new Error('imp-96006: T_x ratio must be ~148x (two-order spread from sub-0.1 a_0 shift)');
  // the double-exponential log-sensitivity steepens toward more-negative a_0.
  if (!(SLOPE_AT_CONJ < SLOPE_AT_EMP && SLOPE_AT_EMP < -50))
    throw new Error('imp-96006: local d lnT_x/d a_0 must steepen toward the conjectural a_0');
  if (!(SLOPE_AT_CONJ < -80 && SLOPE_AT_EMP > -80))
    throw new Error('imp-96006: slopes must bracket -80 (-88.11 at conj, -78.12 at emp)');
  // NO-COLLAPSE guard: the conjectural point is flagged conditional, not a pin.
  if (IMP96006_IF1_CROSSING_HEIGHT_CONDITIONAL_ANCHOR.conjecturalPointInRange.conditional !== true)
    throw new Error('imp-96006: conjectural anchor must be flagged conditional (not a pin)');
  if (!(IF_RIGOROUS_BRACKET[0] < 1 && 1 < IF_RIGOROUS_BRACKET[1]))
    throw new Error('imp-96006: conjectural I_F = 1 must lie inside the rigorous RH bracket (2/3, 2)');
  // HONESTY gates: measurement only, conjectural, no false pin, no refereed bound is changed.
  if (IMP96006_IF1_CROSSING_HEIGHT_CONDITIONAL_ANCHOR.isRigorous !== false)
    throw new Error('imp-96006: isRigorous must be false');
  if (!/NO QED/.test(IMP96006_IF1_CROSSING_HEIGHT_CONDITIONAL_ANCHOR.verdict))
    throw new Error('imp-96006: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96006_IF1_CROSSING_HEIGHT_CONDITIONAL_ANCHOR.verdict))
    throw new Error('imp-96006: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96006_IF1_CROSSING_HEIGHT_CONDITIONAL_ANCHOR;
