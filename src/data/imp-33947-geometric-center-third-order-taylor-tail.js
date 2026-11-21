/**
 * @module imp-33947-geometric-center-third-order-taylor-tail
 *
 * imp-33947 (numerical, frontier-direction): imp-33900 wrote out the SECOND-order half-log-decade
 * Taylor term S2 behind the imp-33879/imp-33903 geometric-center correction and showed that adding
 * S2 cuts the first-order residual ~25-fold, from the ~3.3-4.1% direct-finite-difference-vs-
 * derivative offset down to a relative residual of ~0.109-0.165% -- which it attributed, without
 * measuring it, to "the third-order tail". This module WRITES OUT that third-order term explicitly,
 * evaluates it at each rung of the 1e12..1e15 ladder, and tests whether adding it closes the offset
 * to machine precision or leaves a residual (a higher-order or non-Taylor contribution).
 *
 * THE HALF-DECADE TAYLOR SERIES (offset = law(N/sqrt10)/law(N) - 1, expanded in the step h = 1/2)
 * --------------------------------------------------------------------------------------------
 * With L(x) = log T0(10^x) the local decade log-height and law = 1/(2L), the exact direct offset is
 *     offset(x) = L(x) / L(x - h) - 1,   h = 1/2   (endpoint x -> geometric midpoint x - 1/2).
 * Writing L(x-h) = L - h L1 + (h^2/2) L2 - (h^3/6) L3 + O(h^4) and inverting term by term gives the
 * order-by-order half-log-decade expansion in the local decade derivatives L1 = dL/dx, L2 = d2L/dx2,
 * L3 = d3L/dx3 of L:
 *     S1 = (1/2) (L1/L)                                             [imp-33879 leading factor]
 *     S2 = (1/4) (L1/L)^2 - (1/8) (L2/L)                           [imp-33900 second-order term]
 *     S3 = (1/48) (L3/L) - (1/8) (L1/L)(L2/L) + (1/8) (L1/L)^3     [THIS module, third-order term]
 *     offset = S1 + S2 + S3 + O(h^4).
 * S3 collects the three order-h^3 pieces: the cubic self-product of S1 (the (1/8)(L1/L)^3 geometric
 * tail of 1/(1-u)), the S1-S2 cross term -(1/8)(L1/L)(L2/L), and the genuine third derivative
 * (1/48)(L3/L). L1, L2, L3 are centred finite differences of L in the decade exponent x (step
 * H = 1e-3; S3 is stable to ~4 significant digits across H in 5e-3..5e-4).
 *
 * THE MEASUREMENT (SAME 1e12..1e15 ladder as imp-33900/imp-33903)
 * --------------------------------------------------------------
 *   N      S3 (abs)   res(S1+S2) rel   res(S1+S2+S3) rel   S3 / res2   per-order cut
 *   1e12   0.006934%  0.165%           0.0065%             96.0%       ~25x
 *   1e13   0.005534%  0.142%           0.0052%             96.3%       ~27x
 *   1e14   0.004482%  0.124%           0.0043%             96.6%       ~29x
 *   1e15   0.003678%  0.109%           0.0035%             96.8%       ~31x
 * (res(S1+S2) rel and res(S1+S2+S3) rel are the residual offset - partial sum as a fraction of the
 * exact offset; S3/res2 is S3 as a fraction of the absolute second-order residual offset - S1 - S2.)
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (R1) THIRD-ORDER TERM WRITTEN OUT AND MEASURED. The explicit S3 term above is nonzero and
 *        positive, ~0.0037%..0.0069% absolute across 1e15..1e12, and stable to ~4 significant
 *        digits over centred-difference steps H in 5e-3..5e-4.
 *   (R2) THE OFFSET IS NOT FULLY ACCOUNTED AT SECOND ORDER. The imp-33900 sub-0.165% second-order
 *        residual is a genuine THIRD-ORDER contribution: adding S3 recovers 96.0%..96.8% of the
 *        absolute second-order residual and cuts the relative residual another ~25x..31x, from
 *        ~0.109%..0.165% (after S2) down to ~0.0035%..0.0065% (after S3).
 *   (R3) THE SERIES DOES NOT TERMINATE -- A FOURTH-ORDER TAIL REMAINS. Adding S3 does NOT close the
 *        offset to machine precision; a well-behaved ~0.0035%..0.0065% relative fourth-order tail
 *        survives. The clean ~25x-per-order geometric reduction S1 -> S2 -> S3 confirms a convergent
 *        half-log-decade Taylor series in 1/log T0, NOT a non-Taylor discrepancy: the ~4% offset is
 *        the leading term of that series, with each successive order carrying a real, shrinking
 *        residual contribution rather than the series closing at any finite order.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; L1, L2, L3 are finite-difference measurements; the C_mb GUE-conditional share
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33900-geometric-center-second-order-taylor-tail (second-order term S2, residual measured here)
 * @see imp-33903-geometric-center-direct-finite-difference-reproduction (direct-vs-derivative offset)
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (leading factor S1)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5; // half-log-decade Taylor step h = 1/2 (endpoint -> geometric midpoint N/sqrt(10))
const H_FD = 1e-3; // centred finite-difference step in the decade exponent x (stable to ~4 digits)

// The imp-33900/imp-33903 ladder rungs whose third-order Taylor tail we measure: 1e12..1e15.
const DECADE_EXPONENTS = [12, 13, 14, 15];

// Local decade log-height L(x) = log T0(10^x), and the pointwise shortfall law = 1/(2 L).
const Lfun = (x) => Math.log(effectiveHeightForN(Math.pow(10, x)));
const law = (N) => HALF / Math.log(effectiveHeightForN(N));

// Centred finite differences of L in the decade exponent x (L1 = first, L2 = second, L3 = third).
const dL = (x) => (Lfun(x + H_FD) - Lfun(x - H_FD)) / (2 * H_FD);
const d2L = (x) => (Lfun(x + H_FD) - 2 * Lfun(x) + Lfun(x - H_FD)) / (H_FD * H_FD);
const d3L = (x) =>
  (Lfun(x + 2 * H_FD) - 2 * Lfun(x + H_FD) + 2 * Lfun(x - H_FD) - Lfun(x - 2 * H_FD)) /
  (2 * H_FD * H_FD * H_FD);

// Per rung: exact offset, the three Taylor partial sums, and their residuals.
const TABLE = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const L = Lfun(e);
  const L1 = dL(e);
  const L2 = d2L(e);
  const L3 = d3L(e);

  // Exact direct offset (Path B of imp-33903): law at the geometric midpoint vs the endpoint.
  const offset = law(Math.pow(10, e - HALF)) / law(N) - 1;

  // Order-by-order half-log-decade Taylor terms in the local decade derivatives of L.
  const S1 = HALF * (L1 / L); // imp-33879 leading factor
  const S2 = 0.25 * (L1 / L) ** 2 - 0.125 * (L2 / L); // imp-33900 second-order term
  const S3 = (1 / 48) * (L3 / L) - 0.125 * (L1 / L) * (L2 / L) + 0.125 * (L1 / L) ** 3; // THIRD order

  const res1 = offset - S1; // first-order residual (the ~3.3-4.1% direct-vs-derivative offset)
  const res12 = offset - S1 - S2; // second-order residual (imp-33900 sub-0.165%, the third-order tail)
  const res123 = offset - S1 - S2 - S3; // residual after third order (the fourth-order tail)

  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    offset_pct: +(offset * 100).toFixed(4), // ~4.376 .. 3.496
    S3_pct: +(S3 * 100).toFixed(6), // ~0.006934 .. 0.003678 (third-order term, absolute)
    res_S1S2_rel_pct: +((res12 / offset) * 100).toFixed(4), // ~0.165 .. 0.109 (imp-33900 tail)
    res_S1S2S3_rel_pct: +((res123 / offset) * 100).toFixed(4), // ~0.0065 .. 0.0035 (fourth-order tail)
    S3_fraction_of_res2: +(S3 / res12).toFixed(4), // ~0.960 .. 0.968 (S3 recovers ~96% of res2)
    perOrderCut_res2_to_res3: +(res12 / res123).toFixed(2), // ~25 .. 31 (geometric per-order reduction)
  };
});

const RES2_REL = TABLE.map((r) => Math.abs(r.res_S1S2_rel_pct)); // ~0.109 .. 0.165
const RES3_REL = TABLE.map((r) => Math.abs(r.res_S1S2S3_rel_pct)); // ~0.0035 .. 0.0065
const S3_FRAC = TABLE.map((r) => r.S3_fraction_of_res2); // ~0.960 .. 0.968
const CUTS = TABLE.map((r) => r.perOrderCut_res2_to_res3); // ~25 .. 31
const S3_PCT = TABLE.map((r) => r.S3_pct); // ~0.0037 .. 0.0069

const RES2_REL_MAX = +Math.max(...RES2_REL).toFixed(4); // ~0.165
const RES3_REL_MAX = +Math.max(...RES3_REL).toFixed(4); // ~0.0065
const S3_FRAC_MIN = +Math.min(...S3_FRAC).toFixed(4); // ~0.960
const S3_FRAC_MAX = +Math.max(...S3_FRAC).toFixed(4); // ~0.968
const CUT_MIN = +Math.min(...CUTS).toFixed(2); // ~25.2
const CUT_MAX = +Math.max(...CUTS).toFixed(2); // ~30.9
const S3_MIN = +Math.min(...S3_PCT).toFixed(6); // ~0.003678
const S3_MAX = +Math.max(...S3_PCT).toFixed(6); // ~0.006934

export const IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL = {
  id: 'imp-33947',
  proofSection: 'S-frontier',
  question:
    'Measure the THIRD-order half-log-decade Taylor term of the imp-33903/imp-33900 geometric-center ' +
    'correction and test whether the ~4% direct-finite-difference-vs-derivative offset is fully ' +
    'accounted by second order or carries a residual third-order contribution. Extend the Taylor ' +
    'expansion to third order, evaluate the term at each 1e12..1e15 rung, and report whether adding ' +
    'it closes the offset to machine precision or leaves a residual. Measurement only; no bound change; no QED.',
  componentModel:
    'offset(x) = L(x)/L(x-1/2) - 1 with L(x) = log T0(10^x), law = 1/(2L). Order-by-order half-log-' +
    'decade Taylor: S1 = (1/2)(L1/L); S2 = (1/4)(L1/L)^2 - (1/8)(L2/L); S3 = (1/48)(L3/L) - ' +
    '(1/8)(L1/L)(L2/L) + (1/8)(L1/L)^3. L1, L2, L3 are centred finite differences of L in the decade ' +
    'exponent x (step 1e-3, stable to ~4 digits).',
  thirdOrderTerm: 'S3 = (1/48)(L3/L) - (1/8)(L1/L)(L2/L) + (1/8)(L1/L)^3',
  table: TABLE,
  measurement: {
    third_order_term_abs_pct_range: [S3_MIN, S3_MAX], // ~[0.003678, 0.006934]
    residual_after_second_order_rel_pct_max: RES2_REL_MAX, // ~0.165 (imp-33900 tail, reproduced)
    residual_after_third_order_rel_pct_max: RES3_REL_MAX, // ~0.0065 (fourth-order tail)
    s3_fraction_of_second_order_residual: [S3_FRAC_MIN, S3_FRAC_MAX], // ~[0.960, 0.968]
    per_order_reduction_second_to_third: [CUT_MIN, CUT_MAX], // ~[25, 31]
  },
  findings: {
    R1_third_order_term_written_out_and_measured:
      'The explicit S3 = (1/48)(L3/L) - (1/8)(L1/L)(L2/L) + (1/8)(L1/L)^3 is nonzero and positive, ' +
      '~0.0037%..0.0069% absolute across 1e15..1e12, and stable to ~4 significant digits over ' +
      'centred-difference steps H in 5e-3..5e-4.',
    R2_offset_not_fully_accounted_at_second_order:
      'The imp-33900 sub-0.165% second-order residual is a genuine THIRD-ORDER contribution: adding ' +
      'S3 recovers 96.0%..96.8% of the absolute second-order residual and cuts the relative residual ' +
      'another ~25x..31x, from ~0.109%..0.165% (after S2) down to ~0.0035%..0.0065% (after S3).',
    R3_series_does_not_terminate_fourth_order_tail_remains:
      'Adding S3 does NOT close the offset to machine precision; a ~0.0035%..0.0065% relative ' +
      'fourth-order tail survives. The clean ~25x-per-order geometric reduction S1 -> S2 -> S3 ' +
      'confirms a convergent half-log-decade Taylor series in 1/log T0, NOT a non-Taylor discrepancy.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The ~4% imp-33903 direct-finite-difference-vs-' +
    'derivative offset of the imp-33816 pointwise 1/(2 log T0) law is NOT fully accounted by second ' +
    'order: the imp-33900 sub-0.165% second-order residual is a genuine third-order contribution. ' +
    'The explicit third-order half-log-decade Taylor term S3 = (1/48)(L3/L) - (1/8)(L1/L)(L2/L) + ' +
    '(1/8)(L1/L)^3 (L1, L2, L3 centred finite differences of L = log T0 in the decade exponent) is ' +
    'nonzero and positive, ~0.0037%..0.0069% absolute across 1e12..1e15, and recovers 96.0%..96.8% ' +
    'of the absolute second-order residual, cutting the relative residual another ~25x..31x from ' +
    '~0.109%..0.165% (after S2) to ~0.0035%..0.0065% (after S3). Adding S3 does NOT close the offset ' +
    'to machine precision -- a well-behaved fourth-order tail remains -- and the clean ~25x-per-order ' +
    'geometric reduction S1 -> S2 -> S3 confirms the offset is the leading term of a convergent half-' +
    'log-decade Taylor series in 1/log T0, with each successive order carrying a real, shrinking ' +
    'residual contribution rather than the series closing at any finite order. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; L1, L2, L3 are finite-' +
    'difference measurements; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33900 (second-order term S2, residual measured here); imp-33903 (direct-vs-derivative ' +
    'offset); imp-33879 (leading factor S1); imp-33816 (pointwise gap_sigma ~ 1/(2 log T0)); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL_ASSERTIONS = [
  {
    // (R1) The third-order term is a nonzero, positive few-thousandths-of-a-percent contribution.
    id: 'imp33947-third-order-term-nonzero-positive',
    description: 'explicit S3 term is positive and ~0.003%..0.007% absolute across the ladder',
    holds: () => S3_MIN > 0.002 && S3_MAX < 0.01,
  },
  {
    // (R2) Adding S3 recovers the large majority (~96%) of the imp-33900 second-order residual.
    id: 'imp33947-third-order-recovers-most-of-second-order-residual',
    description: 'S3 recovers ~90%..99% of the absolute second-order residual at every rung',
    holds: () => S3_FRAC_MIN > 0.9 && S3_FRAC_MAX < 0.99,
  },
  {
    // (R2) The relative residual drops another order of magnitude when the third order is added.
    id: 'imp33947-third-order-cuts-residual-order-of-magnitude',
    description: 'third order cuts the relative residual >=10x below the second-order residual',
    holds: () => CUT_MIN > 10 && RES3_REL_MAX < RES2_REL_MAX / 10,
  },
  {
    // (R3) The series does NOT close to machine precision at third order: a fourth-order tail remains.
    id: 'imp33947-fourth-order-tail-remains-not-machine-precision',
    description: 'residual after third order is a nonzero ~0.003%..0.01% tail, not machine precision',
    holds: () => RES3_REL_MAX > 1e-4 && RES3_REL_MAX < 1e-2,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp33947-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL.isRigorous === false &&
      /NO QED/.test(IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL.verdict) &&
      /refereed bound is changed/i.test(IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL.verdict),
  },
];

for (const a of IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33947-geometric-center-third-order-taylor-tail assertion failed: ${a.id}`,
    );
  }
}
