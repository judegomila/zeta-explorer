/**
 * @module imp-34000-geometric-center-fourth-order-taylor-tail
 *
 * imp-34000 (numerical, frontier-direction): imp-33947 R3 wrote out the THIRD-order half-log-decade
 * Taylor term S3 behind the imp-33879/imp-33900/imp-33903 geometric-center correction, confirmed a
 * convergent ~25x-per-order Taylor series in 1/log T0, and explicitly left a well-behaved
 * ~0.0035%..0.0065% relative FOURTH-order tail UNMEASURED (offset = S1 + S2 + S3 + O(h^4)). This
 * module WRITES OUT that fourth-order term S4 explicitly, evaluates it at each rung of the same
 * 1e12..1e15 ladder, and tests whether adding it closes the offset to machine precision or leaves a
 * fifth-order residual.
 *
 * THE HALF-DECADE TAYLOR SERIES (offset = law(N/sqrt10)/law(N) - 1, expanded in the step h = 1/2)
 * --------------------------------------------------------------------------------------------
 * With L(x) = log T0(10^x) the local decade log-height and law = 1/(2L), the exact direct offset is
 *     offset(x) = L(x) / L(x - h) - 1,   h = 1/2   (endpoint x -> geometric midpoint x - 1/2).
 * Writing L(x-h) = L(1 - a) with a = h(L1/L) - (h^2/2)(L2/L) + (h^3/6)(L3/L) - (h^4/24)(L4/L) + ...
 * and expanding L/L(x-h) - 1 = a + a^2 + a^3 + a^4 + ... order by order in h gives the half-log-decade
 * series in the local decade derivatives L1..L4 of L (bK = LK/L):
 *     S1 = (1/2) b1                                                     [imp-33879 leading factor]
 *     S2 = (1/4) b1^2 - (1/8) b2                                        [imp-33900 second-order term]
 *     S3 = (1/48) b3 - (1/8) b1 b2 + (1/8) b1^3                         [imp-33947 third-order term]
 *     S4 = -(1/384) b4 + (1/48) b1 b3 + (1/64) b2^2 - (3/32) b1^2 b2 + (1/16) b1^4   [THIS module]
 *     offset = S1 + S2 + S3 + S4 + O(h^5).
 * S4 collects the five order-h^4 pieces: the genuine fourth derivative -(1/384)(L4/L); the two a^2
 * cross terms (1/48)(L1/L)(L3/L) and (1/64)(L2/L)^2; the a^3 cross term -(3/32)(L1/L)^2(L2/L); and the
 * quartic self-product (1/16)(L1/L)^4 (the geometric tail of 1/(1-a) at order 4).
 *
 * FINITE-DIFFERENCE STEP. L1..L4 are centred finite differences of L in the decade exponent x. The
 * fourth-derivative 5-point stencil L4 = [L(x+2H) - 4L(x+H) + 6L(x) - 4L(x-H) + L(x-2H)] / H^4 divides
 * by H^4, so double-precision roundoff is amplified ~eps/H^4: the imp-33947 step H = 1e-3 (fine for the
 * lower derivatives) is roundoff-dominated for L4. We use H = 1e-2 here; S4 is flat to ~4 significant
 * digits across H in 5e-3..1e-1 (e.g. S4(1e12) = 0.0002752% for every H in that band), and the lower
 * terms S1..S3 are unchanged from imp-33947 (S3(1e12) = 0.006934% reproduced).
 *
 * THE MEASUREMENT (SAME 1e12..1e15 ladder as imp-33900/imp-33903/imp-33947)
 * ------------------------------------------------------------------------
 *   N      S4 (abs)    res(S1+S2+S3) rel   res(S1+S2+S3+S4) rel   S4 / res3   per-order cut
 *   1e12   0.000275%   0.0065%             0.000257%              96.07%      ~25x
 *   1e13   0.000204%   0.0053%             0.000193%              96.34%      ~27x
 *   1e14   0.000155%   0.0043%             0.000146%              96.58%      ~29x
 *   1e15   0.000119%   0.0035%             0.000114%              96.76%      ~31x
 * (res(...) rel is the residual offset - partial sum as a fraction of the exact offset; S4/res3 is S4
 * as a fraction of the absolute third-order residual offset - S1 - S2 - S3.)
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (R1) FOURTH-ORDER TERM WRITTEN OUT AND MEASURED. The explicit S4 term above is nonzero and
 *        positive, ~0.00012%..0.00028% absolute across 1e15..1e12, and stable to ~4 significant
 *        digits over centred-difference steps H in 5e-3..1e-1.
 *   (R2) THE imp-33947 FOURTH-ORDER TAIL IS A GENUINE FOURTH-ORDER TERM. Adding S4 recovers
 *        96.07%..96.76% of the absolute third-order residual and cuts the relative residual another
 *        ~25x..31x, from ~0.0035%..0.0065% (after S3) down to ~0.00011%..0.00026% (after S4) -- the
 *        same ~96%-recovery / ~25x-cut signature imp-33947 measured for S3 against the S2 residual.
 *   (R3) THE SERIES STILL DOES NOT TERMINATE -- A FIFTH-ORDER TAIL REMAINS. Adding S4 does NOT close
 *        the offset to machine precision; a well-behaved ~0.00011%..0.00026% relative fifth-order tail
 *        survives. The clean ~25x-per-order geometric reduction now extends S1 -> S2 -> S3 -> S4,
 *        confirming (a fourth successive order deep) a convergent half-log-decade Taylor series in
 *        1/log T0, with each order carrying a real, shrinking residual rather than closing at any
 *        finite order -- exactly the imp-33947 R3 verdict, one order further down.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; L1..L4 are finite-difference measurements; the C_mb GUE-conditional share
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33947-geometric-center-third-order-taylor-tail (third-order term S3, tail measured here)
 * @see imp-33900-geometric-center-second-order-taylor-tail (second-order term S2)
 * @see imp-33903-geometric-center-direct-finite-difference-reproduction (direct-vs-derivative offset)
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (leading factor S1)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5; // half-log-decade Taylor step h = 1/2 (endpoint -> geometric midpoint N/sqrt(10))
const H_FD = 1e-2; // centred finite-difference step in the decade exponent x (S4 flat over 5e-3..1e-1)

// The imp-33900/imp-33903/imp-33947 ladder rungs whose fourth-order Taylor tail we measure: 1e12..1e15.
const DECADE_EXPONENTS = [12, 13, 14, 15];

// Local decade log-height L(x) = log T0(10^x), and the pointwise shortfall law = 1/(2 L).
const Lfun = (x) => Math.log(effectiveHeightForN(Math.pow(10, x)));
const law = (N) => HALF / Math.log(effectiveHeightForN(N));

// Centred finite differences of L in the decade exponent x (L1 = first .. L4 = fourth derivative).
const dL = (x) => (Lfun(x + H_FD) - Lfun(x - H_FD)) / (2 * H_FD);
const d2L = (x) => (Lfun(x + H_FD) - 2 * Lfun(x) + Lfun(x - H_FD)) / (H_FD * H_FD);
const d3L = (x) =>
  (Lfun(x + 2 * H_FD) - 2 * Lfun(x + H_FD) + 2 * Lfun(x - H_FD) - Lfun(x - 2 * H_FD)) /
  (2 * H_FD * H_FD * H_FD);
const d4L = (x) =>
  (Lfun(x + 2 * H_FD) - 4 * Lfun(x + H_FD) + 6 * Lfun(x) - 4 * Lfun(x - H_FD) + Lfun(x - 2 * H_FD)) /
  (H_FD * H_FD * H_FD * H_FD);

// Per rung: exact offset, the four Taylor partial sums, and their residuals.
const TABLE = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const L = Lfun(e);
  const b1 = dL(e) / L;
  const b2 = d2L(e) / L;
  const b3 = d3L(e) / L;
  const b4 = d4L(e) / L;

  // Exact direct offset (Path B of imp-33903): law at the geometric midpoint vs the endpoint.
  const offset = law(Math.pow(10, e - HALF)) / law(N) - 1;

  // Order-by-order half-log-decade Taylor terms in the reduced decade derivatives bK = LK/L.
  const S1 = HALF * b1; // imp-33879 leading factor
  const S2 = 0.25 * b1 ** 2 - 0.125 * b2; // imp-33900 second-order term
  const S3 = (1 / 48) * b3 - 0.125 * b1 * b2 + 0.125 * b1 ** 3; // imp-33947 third-order term
  const S4 =
    -(1 / 384) * b4 +
    (1 / 48) * b1 * b3 +
    (1 / 64) * b2 ** 2 -
    (3 / 32) * b1 ** 2 * b2 +
    (1 / 16) * b1 ** 4; // FOURTH order (this module)

  const res123 = offset - S1 - S2 - S3; // third-order residual (imp-33947 fourth-order tail)
  const res1234 = offset - S1 - S2 - S3 - S4; // residual after fourth order (the fifth-order tail)

  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    offset_pct: +(offset * 100).toFixed(4), // ~4.376 .. 3.496
    S4_pct: +(S4 * 100).toFixed(6), // ~0.000275 .. 0.000119 (fourth-order term, absolute)
    res_S1S2S3_rel_pct: +((res123 / offset) * 100).toFixed(4), // ~0.0065 .. 0.0035 (imp-33947 tail)
    res_S1S2S3S4_rel_pct: +((res1234 / offset) * 100).toFixed(6), // ~0.000257 .. 0.000114 (fifth-order tail)
    S4_fraction_of_res3: +(S4 / res123).toFixed(4), // ~0.9607 .. 0.9676 (S4 recovers ~96% of res3)
    perOrderCut_res3_to_res4: +(res123 / res1234).toFixed(2), // ~25 .. 31 (geometric per-order reduction)
  };
});

const RES3_REL = TABLE.map((r) => Math.abs(r.res_S1S2S3_rel_pct)); // ~0.0035 .. 0.0065
const RES4_REL = TABLE.map((r) => Math.abs(r.res_S1S2S3S4_rel_pct)); // ~0.000114 .. 0.000257
const S4_FRAC = TABLE.map((r) => r.S4_fraction_of_res3); // ~0.9607 .. 0.9676
const CUTS = TABLE.map((r) => r.perOrderCut_res3_to_res4); // ~25 .. 31
const S4_PCT = TABLE.map((r) => r.S4_pct); // ~0.000119 .. 0.000275

const RES3_REL_MAX = +Math.max(...RES3_REL).toFixed(4); // ~0.0065
const RES4_REL_MAX = +Math.max(...RES4_REL).toFixed(6); // ~0.000257
const S4_FRAC_MIN = +Math.min(...S4_FRAC).toFixed(4); // ~0.9607
const S4_FRAC_MAX = +Math.max(...S4_FRAC).toFixed(4); // ~0.9676
const CUT_MIN = +Math.min(...CUTS).toFixed(2); // ~25.5
const CUT_MAX = +Math.max(...CUTS).toFixed(2); // ~30.8
const S4_MIN = +Math.min(...S4_PCT).toFixed(6); // ~0.000119
const S4_MAX = +Math.max(...S4_PCT).toFixed(6); // ~0.000275

export const IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL = {
  id: 'imp-34000',
  proofSection: 'S-frontier',
  question:
    'Write out the FOURTH-order half-log-decade Taylor term S4 behind the imp-33879/imp-33900/' +
    'imp-33947 geometric-center offset and test whether adding it closes the imp-33947 R3 ' +
    '~0.0035%..0.0065% relative fourth-order tail to machine precision or leaves a fifth-order ' +
    'residual on the same 1e12..1e15 ladder. Measurement only; no bound change; no QED.',
  componentModel:
    'offset(x) = L(x)/L(x-1/2) - 1 with L(x) = log T0(10^x), law = 1/(2L). Order-by-order half-log-' +
    'decade Taylor in bK = LK/L: S1 = (1/2)b1; S2 = (1/4)b1^2 - (1/8)b2; S3 = (1/48)b3 - (1/8)b1 b2 ' +
    '+ (1/8)b1^3; S4 = -(1/384)b4 + (1/48)b1 b3 + (1/64)b2^2 - (3/32)b1^2 b2 + (1/16)b1^4. L1..L4 are ' +
    'centred finite differences of L in the decade exponent x (step 1e-2; S4 flat over 5e-3..1e-1).',
  fourthOrderTerm:
    'S4 = -(1/384)(L4/L) + (1/48)(L1/L)(L3/L) + (1/64)(L2/L)^2 - (3/32)(L1/L)^2(L2/L) + (1/16)(L1/L)^4',
  table: TABLE,
  measurement: {
    fourth_order_term_abs_pct_range: [S4_MIN, S4_MAX], // ~[0.000119, 0.000275]
    residual_after_third_order_rel_pct_max: RES3_REL_MAX, // ~0.0065 (imp-33947 tail, reproduced)
    residual_after_fourth_order_rel_pct_max: RES4_REL_MAX, // ~0.000257 (fifth-order tail)
    s4_fraction_of_third_order_residual: [S4_FRAC_MIN, S4_FRAC_MAX], // ~[0.9607, 0.9676]
    per_order_reduction_third_to_fourth: [CUT_MIN, CUT_MAX], // ~[25, 31]
  },
  findings: {
    R1_fourth_order_term_written_out_and_measured:
      'The explicit S4 = -(1/384)(L4/L) + (1/48)(L1/L)(L3/L) + (1/64)(L2/L)^2 - (3/32)(L1/L)^2(L2/L) ' +
      '+ (1/16)(L1/L)^4 is nonzero and positive, ~0.00012%..0.00028% absolute across 1e15..1e12, and ' +
      'stable to ~4 significant digits over centred-difference steps H in 5e-3..1e-1.',
    R2_imp33947_fourth_order_tail_is_a_genuine_fourth_order_term:
      'The imp-33947 sub-0.0065% third-order residual is a genuine FOURTH-ORDER contribution: adding ' +
      'S4 recovers 96.07%..96.76% of the absolute third-order residual and cuts the relative residual ' +
      'another ~25x..31x, from ~0.0035%..0.0065% (after S3) down to ~0.00011%..0.00026% (after S4).',
    R3_series_does_not_terminate_fifth_order_tail_remains:
      'Adding S4 does NOT close the offset to machine precision; a ~0.00011%..0.00026% relative ' +
      'fifth-order tail survives. The clean ~25x-per-order geometric reduction now extends S1 -> S2 ' +
      '-> S3 -> S4, confirming a convergent half-log-decade Taylor series in 1/log T0, NOT a closing ' +
      'at any finite order -- the imp-33947 R3 verdict one order deeper.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33947 R3 well-behaved ~0.0035%..0.0065% ' +
    'relative FOURTH-order tail of the geometric-center offset is a genuine fourth-order Taylor term, ' +
    'not a non-Taylor discrepancy. The explicit fourth-order half-log-decade term S4 = -(1/384)(L4/L) ' +
    '+ (1/48)(L1/L)(L3/L) + (1/64)(L2/L)^2 - (3/32)(L1/L)^2(L2/L) + (1/16)(L1/L)^4 (L1..L4 centred ' +
    'finite differences of L = log T0 in the decade exponent, step 1e-2 chosen so the L4 5-point ' +
    'stencil is not roundoff-dominated) is nonzero and positive, ~0.00012%..0.00028% absolute across ' +
    '1e12..1e15, and recovers 96.07%..96.76% of the absolute third-order residual, cutting the ' +
    'relative residual another ~25x..31x from ~0.0035%..0.0065% (after S3) to ~0.00011%..0.00026% ' +
    '(after S4). Adding S4 does NOT close the offset to machine precision -- a well-behaved fifth-' +
    'order tail remains -- and the clean ~25x-per-order geometric reduction now extends S1 -> S2 -> ' +
    'S3 -> S4, confirming (a fourth successive order deep) that the ~4% offset is the leading term of ' +
    'a convergent half-log-decade Taylor series in 1/log T0, with each order carrying a real, ' +
    'shrinking residual rather than closing at any finite order. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; L1..L4 are finite-difference ' +
    'measurements; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33947 (third-order term S3, fourth-order tail measured here); imp-33900 (second-order term ' +
    'S2); imp-33903 (direct-vs-derivative offset); imp-33879 (leading factor S1); imp-33816 ' +
    '(pointwise gap_sigma ~ 1/(2 log T0)); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL_ASSERTIONS = [
  {
    // (R1) The fourth-order term is a nonzero, positive ~0.0001%..0.0003% contribution.
    id: 'imp34000-fourth-order-term-nonzero-positive',
    description: 'explicit S4 term is positive and ~0.0001%..0.0003% absolute across the ladder',
    holds: () => S4_MIN > 8e-5 && S4_MAX < 4e-4,
  },
  {
    // (R2) Adding S4 recovers the large majority (~96%) of the imp-33947 third-order residual.
    id: 'imp34000-fourth-order-recovers-most-of-third-order-residual',
    description: 'S4 recovers ~90%..99% of the absolute third-order residual at every rung',
    holds: () => S4_FRAC_MIN > 0.9 && S4_FRAC_MAX < 0.99,
  },
  {
    // (R2) The relative residual drops another order of magnitude when the fourth order is added.
    id: 'imp34000-fourth-order-cuts-residual-order-of-magnitude',
    description: 'fourth order cuts the relative residual >=10x below the third-order residual',
    holds: () => CUT_MIN > 10 && RES4_REL_MAX < RES3_REL_MAX / 10,
  },
  {
    // (R3) The series does NOT close to machine precision at fourth order: a fifth-order tail remains.
    id: 'imp34000-fifth-order-tail-remains-not-machine-precision',
    description: 'residual after fourth order is a nonzero ~0.0001%..0.001% tail, not machine precision',
    holds: () => RES4_REL_MAX > 1e-5 && RES4_REL_MAX < 1e-3,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp34000-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.isRigorous === false &&
      /NO QED/.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict) &&
      /remains SOTA/.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict),
  },
];

for (const a of IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-34000-geometric-center-fourth-order-taylor-tail assertion failed: ${a.id}`,
    );
  }
}
