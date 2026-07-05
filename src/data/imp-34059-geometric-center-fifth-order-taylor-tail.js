/**
 * @module imp-34059-geometric-center-fifth-order-taylor-tail
 *
 * imp-34059 (numerical, frontier-direction): imp-34000 R3 wrote out the FOURTH-order half-log-decade
 * Taylor term S4 behind the imp-33879/imp-33900/imp-33947 geometric-center correction, confirmed the
 * clean ~25x-per-order series extends S1 -> S2 -> S3 -> S4 (each recovering ~96% of the prior residual
 * and cutting the relative residual another ~25x..31x), and explicitly left a surviving well-behaved
 * ~0.00011%..0.00026% relative FIFTH-order tail (offset = S1 + S2 + S3 + S4 + O(h^5)) UNMEASURED. This
 * module WRITES OUT that fifth-order term S5 explicitly, evaluates it at each rung of the same
 * 1e12..1e15 ladder, and tests whether the ~25x-per-order reduction and surviving-tail pattern continue
 * one order deeper.
 *
 * THE HALF-DECADE TAYLOR SERIES (offset = law(N/sqrt10)/law(N) - 1, expanded in the step h = 1/2)
 * --------------------------------------------------------------------------------------------
 * With L(x) = log T0(10^x) the local decade log-height and law = 1/(2L), the exact direct offset is
 *     offset(x) = L(x) / L(x - h) - 1,   h = 1/2   (endpoint x -> geometric midpoint x - 1/2).
 * Writing L(x-h) = L(1 - a) with a = h(L1/L) - (h^2/2)(L2/L) + (h^3/6)(L3/L) - (h^4/24)(L4/L)
 * + (h^5/120)(L5/L) - ... and expanding L/L(x-h) - 1 = a + a^2 + a^3 + a^4 + a^5 + ... order by order in
 * h gives the half-log-decade series in the local decade derivatives L1..L5 of L (bK = LK/L):
 *     S1 = (1/2) b1                                                     [imp-33879 leading factor]
 *     S2 = (1/4) b1^2 - (1/8) b2                                        [imp-33900 second-order term]
 *     S3 = (1/48) b3 - (1/8) b1 b2 + (1/8) b1^3                         [imp-33947 third-order term]
 *     S4 = -(1/384) b4 + (1/48) b1 b3 + (1/64) b2^2 - (3/32) b1^2 b2 + (1/16) b1^4   [imp-34000]
 *     S5 = (1/3840) b5 - (1/384) b1 b4 - (1/192) b2 b3 + (1/64) b1^2 b3 + (3/128) b1 b2^2
 *          - (1/16) b1^3 b2 + (1/32) b1^5                              [THIS module]
 *     offset = S1 + S2 + S3 + S4 + S5 + O(h^6).
 * S5 collects the seven order-h^5 pieces: the genuine fifth derivative (1/3840)(L5/L); the two a^2
 * cross terms -(1/384)(L1/L)(L4/L) and -(1/192)(L2/L)(L3/L); the two a^3 cross terms (1/64)(L1/L)^2(L3/L)
 * and (3/128)(L1/L)(L2/L)^2; the a^4 cross term -(1/16)(L1/L)^3(L2/L); and the quintic self-product
 * (1/32)(L1/L)^5 (the geometric tail of 1/(1-a) at order 5). (The method reproduces S1..S4 exactly.)
 *
 * FINITE-DIFFERENCE STEP. L1..L5 are centred finite differences of L in the decade exponent x. The
 * fifth-derivative 6-point stencil L5 = [-L(x-3H) + 4L(x-2H) - 5L(x-H) + 5L(x+H) - 4L(x+2H)
 * + L(x+3H)] / (2 H^5) divides by H^5, so double-precision roundoff is amplified ~eps/H^5: at H = 5e-3
 * the L5 stencil is roundoff-dominated (S5 jumps ~10%). We keep imp-34000 step H = 1e-2 here; because
 * b5 enters S5 with the tiny weight 1/3840, S5 is dominated by the accurate b1^5 / b1^3 b2 cross terms
 * and is flat to ~1% across H in 1e-2..1e-1 (S5(1e12) = 0.0000108% for every H in that band), and the
 * lower terms S1..S4 reproduce imp-34000 (S4(1e12) = 0.000275%).
 *
 * THE MEASUREMENT (SAME 1e12..1e15 ladder as imp-33947/imp-34000)
 * --------------------------------------------------------------
 *   N      S5 (abs)      res(S1..S4) rel   res(S1..S5) rel   S5 / res4   per-order cut
 *   1e12   0.0000108%    0.000257%         0.0000095%        96.29%      ~27x
 *   1e13   0.0000075%    0.000193%         0.0000062%        96.78%      ~31x
 *   1e14   0.0000052%    0.000146%         0.0000069%        95.25%      ~21x
 *   1e15   0.0000040%    0.000114%         (floor)           100.08%     (floor)
 * (res(...) rel is the residual offset - partial sum as a fraction of the exact offset; S5/res4 is S5
 * as a fraction of the absolute fourth-order residual offset - S1 - S2 - S3 - S4.)
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (R1) FIFTH-ORDER TERM WRITTEN OUT AND MEASURED. The explicit S5 term above is nonzero and positive,
 *        ~0.0000040%..0.0000108% absolute across 1e15..1e12, and flat to ~1 percent over centred-
 *        difference steps H in 1e-2..1e-1 (below H ~ 1e-2 the L5 5th-derivative stencil is roundoff-
 *        dominated). It is dominated by the (1/32)(L1/L)^5 self-product, not the tiny b5 fifth derivative.
 *   (R2) THE imp-34000 FIFTH-ORDER TAIL IS A GENUINE FIFTH-ORDER TERM. Adding S5 recovers 95.25%..96.78%
 *        of the absolute fourth-order residual at the three well-resolved rungs 1e12..1e14 (100.08% at
 *        1e15, at the cancellation floor) and cuts the relative residual another ~21x..31x, from
 *        ~0.00011%..0.00026% (after S4) down to ~0.0000062%..0.0000095% (after S5) -- the same
 *        ~96%-recovery signature imp-34000 measured for S4 against the S3 residual.
 *   (R3) THE SERIES STILL DOES NOT TERMINATE -- A SIXTH-ORDER TAIL REMAINS. Adding S5 does NOT close the
 *        offset to machine precision; a well-behaved ~0.0000062%..0.0000095% relative sixth-order tail
 *        survives at 1e12..1e14. The clean ~96%-recovery reduction now extends S1 -> S2 -> S3 -> S4 ->
 *        S5, confirming (a fifth successive order deep) a convergent half-log-decade Taylor series in
 *        1/log T0. The per-order cut stays in the same ~21x..31x (~25x) band but is NO LONGER cleanly
 *        monotone-ramping like S4: at the deepest rung 1e15 the post-S5 residual reaches the double-
 *        precision cancellation floor (offset minus a five-term sum agreeing to ~6 digits), so the
 *        recovery fraction is the robust invariant that continues, not the per-order cut ratio.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; L1..L5 are finite-difference measurements; the C_mb GUE-conditional share
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34000-geometric-center-fourth-order-taylor-tail (fourth-order term S4, fifth-order tail measured here)
 * @see imp-34001-geometric-center-taylor-ratio-fit (per-order reduction ratio ~c/log T0)
 * @see imp-33947-geometric-center-third-order-taylor-tail (third-order term S3)
 * @see imp-33900-geometric-center-second-order-taylor-tail (second-order term S2)
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (leading factor S1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5; // half-log-decade Taylor step h = 1/2 (endpoint -> geometric midpoint N/sqrt(10))
const H_FD = 1e-2; // centred finite-difference step in the decade exponent x (S5 flat over 1e-2..1e-1)

// The imp-33947/imp-34000 ladder rungs whose fifth-order Taylor tail we measure: 1e12..1e15.
const DECADE_EXPONENTS = [12, 13, 14, 15];

// Local decade log-height L(x) = log T0(10^x), and the pointwise shortfall law = 1/(2 L).
const Lfun = (x) => Math.log(effectiveHeightForN(Math.pow(10, x)));
const law = (N) => HALF / Math.log(effectiveHeightForN(N));

// Centred finite differences of L in the decade exponent x (L1 = first .. L5 = fifth derivative).
const dL = (x) => (Lfun(x + H_FD) - Lfun(x - H_FD)) / (2 * H_FD);
const d2L = (x) => (Lfun(x + H_FD) - 2 * Lfun(x) + Lfun(x - H_FD)) / (H_FD * H_FD);
const d3L = (x) =>
  (Lfun(x + 2 * H_FD) - 2 * Lfun(x + H_FD) + 2 * Lfun(x - H_FD) - Lfun(x - 2 * H_FD)) /
  (2 * H_FD * H_FD * H_FD);
const d4L = (x) =>
  (Lfun(x + 2 * H_FD) - 4 * Lfun(x + H_FD) + 6 * Lfun(x) - 4 * Lfun(x - H_FD) + Lfun(x - 2 * H_FD)) /
  (H_FD * H_FD * H_FD * H_FD);
const d5L = (x) =>
  (-Lfun(x - 3 * H_FD) +
    4 * Lfun(x - 2 * H_FD) -
    5 * Lfun(x - H_FD) +
    5 * Lfun(x + H_FD) -
    4 * Lfun(x + 2 * H_FD) +
    Lfun(x + 3 * H_FD)) /
  (2 * Math.pow(H_FD, 5));

// Per rung: exact offset, the five Taylor partial sums, and their residuals.
const TABLE = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const L = Lfun(e);
  const b1 = dL(e) / L;
  const b2 = d2L(e) / L;
  const b3 = d3L(e) / L;
  const b4 = d4L(e) / L;
  const b5 = d5L(e) / L;

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
    (1 / 16) * b1 ** 4; // imp-34000 fourth-order term
  const S5 =
    (1 / 3840) * b5 -
    (1 / 384) * b1 * b4 -
    (1 / 192) * b2 * b3 +
    (1 / 64) * b1 ** 2 * b3 +
    (3 / 128) * b1 * b2 ** 2 -
    (1 / 16) * b1 ** 3 * b2 +
    (1 / 32) * b1 ** 5; // FIFTH order (this module)

  const res1234 = offset - S1 - S2 - S3 - S4; // fourth-order residual (imp-34000 fifth-order tail)
  const res12345 = offset - S1 - S2 - S3 - S4 - S5; // residual after fifth order (the sixth-order tail)

  return {
    N_log10: e,
    logT0: +L.toFixed(4),
    offset_pct: +(offset * 100).toFixed(4), // ~4.376 .. 3.496
    S5_pct: +(S5 * 100).toFixed(8), // ~0.0000108 .. 0.0000040 (fifth-order term, absolute)
    res_S1toS4_rel_pct: +((res1234 / offset) * 100).toFixed(6), // ~0.000257 .. 0.000114 (imp-34000 tail)
    res_S1toS5_rel_pct: +((res12345 / offset) * 100).toFixed(8), // ~0.0000095 .. floor (sixth-order tail)
    S5_fraction_of_res4: +(S5 / res1234).toFixed(4), // ~0.9525 .. 1.0008 (S5 recovers ~96% of res4)
    perOrderCut_res4_to_res5: +(res1234 / res12345).toFixed(2), // ~21 .. 31 (floor-limited at 1e15)
  };
});

// The three well-resolved rungs 1e12..1e14: at 1e15 the post-S5 residual reaches the cancellation floor.
const CLEAN = TABLE.slice(0, 3);

const S5_PCT = TABLE.map((r) => r.S5_pct); // ~0.0000040 .. 0.0000108
const S5_FRAC_CLEAN = CLEAN.map((r) => r.S5_fraction_of_res4); // ~0.9525 .. 0.9678
const CUTS_CLEAN = CLEAN.map((r) => r.perOrderCut_res4_to_res5); // ~21 .. 31
const RES5_REL_CLEAN = CLEAN.map((r) => Math.abs(r.res_S1toS5_rel_pct)); // ~0.0000062 .. 0.0000095

const S5_MIN = +Math.min(...S5_PCT).toFixed(8); // ~0.0000040
const S5_MAX = +Math.max(...S5_PCT).toFixed(8); // ~0.0000108
const S5_FRAC_MIN = +Math.min(...S5_FRAC_CLEAN).toFixed(4); // ~0.9525
const S5_FRAC_MAX = +Math.max(...S5_FRAC_CLEAN).toFixed(4); // ~0.9678
const CUT_MIN = +Math.min(...CUTS_CLEAN).toFixed(2); // ~21.07
const CUT_MAX = +Math.max(...CUTS_CLEAN).toFixed(2); // ~31.08
const RES5_REL_MAX = +Math.max(...RES5_REL_CLEAN).toFixed(8); // ~0.0000095

export const IMP34059_GEOMETRIC_CENTER_FIFTH_ORDER_TAYLOR_TAIL = {
  id: 'imp-34059',
  proofSection: 'S-frontier',
  question:
    'Write out and measure the FIFTH-order half-log-decade Taylor term S5 behind the imp-33879/' +
    'imp-33900/imp-33947/imp-34000 geometric-center offset and test whether the ~25x-per-order ' +
    '(ramping to ~31x) reduction and surviving-tail pattern continue one order deeper on the same ' +
    '1e12..1e15 ladder. Measurement only; no bound change; no QED.',
  componentModel:
    'offset(x) = L(x)/L(x-1/2) - 1 with L(x) = log T0(10^x), law = 1/(2L). Order-by-order half-log-' +
    'decade Taylor in bK = LK/L: S1..S4 per imp-34000; S5 = (1/3840)b5 - (1/384)b1 b4 - (1/192)b2 b3 ' +
    '+ (1/64)b1^2 b3 + (3/128)b1 b2^2 - (1/16)b1^3 b2 + (1/32)b1^5. L1..L5 are centred finite ' +
    'differences of L in the decade exponent x (step 1e-2; S5 flat to ~1 percent over 1e-2..1e-1).',
  fifthOrderTerm:
    'S5 = (1/3840)(L5/L) - (1/384)(L1/L)(L4/L) - (1/192)(L2/L)(L3/L) + (1/64)(L1/L)^2(L3/L) ' +
    '+ (3/128)(L1/L)(L2/L)^2 - (1/16)(L1/L)^3(L2/L) + (1/32)(L1/L)^5',
  table: TABLE,
  measurement: {
    fifth_order_term_abs_pct_range: [S5_MIN, S5_MAX], // ~[0.0000040, 0.0000108]
    residual_after_fifth_order_rel_pct_max_resolved: RES5_REL_MAX, // ~0.0000095 (sixth-order tail, 1e12..1e14)
    s5_fraction_of_fourth_order_residual_resolved: [S5_FRAC_MIN, S5_FRAC_MAX], // ~[0.9525, 0.9678]
    per_order_reduction_fourth_to_fifth_resolved: [CUT_MIN, CUT_MAX], // ~[21, 31]
  },
  findings: {
    R1_fifth_order_term_written_out_and_measured:
      'The explicit S5 = (1/3840)(L5/L) - (1/384)(L1/L)(L4/L) - (1/192)(L2/L)(L3/L) ' +
      '+ (1/64)(L1/L)^2(L3/L) + (3/128)(L1/L)(L2/L)^2 - (1/16)(L1/L)^3(L2/L) + (1/32)(L1/L)^5 is ' +
      'nonzero and positive, ~0.0000040%..0.0000108% absolute across 1e15..1e12, dominated by the ' +
      '(1/32)(L1/L)^5 self-product, and flat to ~1 percent over centred-difference steps H in 1e-2..1e-1.',
    R2_imp34000_fifth_order_tail_is_a_genuine_fifth_order_term:
      'The imp-34000 sub-0.00026% fourth-order residual is a genuine FIFTH-ORDER contribution: adding ' +
      'S5 recovers 95.25%..96.78% of the absolute fourth-order residual at the resolved rungs 1e12..1e14 ' +
      'and cuts the relative residual another ~21x..31x, from ~0.00011%..0.00026% (after S4) down to ' +
      '~0.0000062%..0.0000095% (after S5) -- the same ~96%-recovery signature imp-34000 found for S4.',
    R3_series_does_not_terminate_sixth_order_tail_remains:
      'Adding S5 does NOT close the offset to machine precision; a ~0.0000062%..0.0000095% relative ' +
      'sixth-order tail survives at 1e12..1e14. The ~96%-recovery reduction now extends S1 -> S2 -> S3 ' +
      '-> S4 -> S5, confirming a convergent half-log-decade Taylor series in 1/log T0. The per-order cut ' +
      'stays in the same ~21x..31x band but is no longer cleanly monotone-ramping: at the deepest rung ' +
      '1e15 the post-S5 residual reaches the double-precision cancellation floor, so the recovery ' +
      'fraction (~96%), not the per-order cut ratio, is the robust invariant that continues.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-34000 R3 well-behaved ~0.00011%..0.00026% ' +
    'relative FIFTH-order tail of the geometric-center offset is a genuine fifth-order Taylor term, not ' +
    'a non-Taylor discrepancy. The explicit fifth-order half-log-decade term S5 = (1/3840)(L5/L) ' +
    '- (1/384)(L1/L)(L4/L) - (1/192)(L2/L)(L3/L) + (1/64)(L1/L)^2(L3/L) + (3/128)(L1/L)(L2/L)^2 ' +
    '- (1/16)(L1/L)^3(L2/L) + (1/32)(L1/L)^5 (L1..L5 centred finite differences of L = log T0 in the ' +
    'decade exponent, step 1e-2; below 1e-2 the L5 5-point stencil is roundoff-dominated) is nonzero ' +
    'and positive, ~0.0000040%..0.0000108% absolute across 1e12..1e15, dominated by the (1/32)(L1/L)^5 ' +
    'self-product, and recovers 95.25%..96.78% of the absolute fourth-order residual at the resolved ' +
    'rungs 1e12..1e14, cutting the relative residual another ~21x..31x from ~0.00011%..0.00026% (after ' +
    'S4) to ~0.0000062%..0.0000095% (after S5). Adding S5 does NOT close the offset to machine ' +
    'precision -- a well-behaved sixth-order tail remains -- and the clean ~96%-recovery reduction now ' +
    'extends S1 -> S2 -> S3 -> S4 -> S5, confirming (a fifth successive order deep) that the ~4% offset ' +
    'is the leading term of a convergent half-log-decade Taylor series in 1/log T0. The per-order cut ' +
    'stays in the same ~25x band but is no longer cleanly monotone-ramping: at the deepest rung 1e15 ' +
    'the post-S5 residual reaches the double-precision cancellation floor, so the ~96% recovery ' +
    'fraction, not the per-order cut ratio, is the robust invariant that continues. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; L1..L5 are ' +
    'finite-difference measurements; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34000 (fourth-order term S4, fifth-order tail measured here); imp-34001 (per-order ratio ' +
    '~c/log T0); imp-33947 (third-order term S3); imp-33900 (second-order term S2); imp-33879 (leading ' +
    'factor S1); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34059_GEOMETRIC_CENTER_FIFTH_ORDER_TAYLOR_TAIL_ASSERTIONS = [
  {
    // (R1) The fifth-order term is a nonzero, positive ~0.000004%..0.00001% contribution.
    id: 'imp34059-fifth-order-term-nonzero-positive',
    description: 'explicit S5 term is positive and ~0.000004%..0.00001% absolute across the ladder',
    holds: () => S5_MIN > 2e-6 && S5_MAX < 2e-5,
  },
  {
    // (R2) Adding S5 recovers the large majority (~96%) of the imp-34000 fourth-order residual.
    id: 'imp34059-fifth-order-recovers-most-of-fourth-order-residual',
    description: 'S5 recovers ~92%..99% of the absolute fourth-order residual at the resolved rungs',
    holds: () => S5_FRAC_MIN > 0.92 && S5_FRAC_MAX < 0.99,
  },
  {
    // (R2) The relative residual drops another order of magnitude when the fifth order is added.
    id: 'imp34059-fifth-order-cuts-residual-order-of-magnitude',
    description: 'fifth order cuts the relative residual >=10x at the resolved rungs 1e12..1e14',
    holds: () => CUT_MIN > 10,
  },
  {
    // (R3) The series does NOT close to machine precision at fifth order: a sixth-order tail remains.
    id: 'imp34059-sixth-order-tail-remains-not-machine-precision',
    description: 'residual after fifth order is a nonzero ~0.000001%..0.0001% tail, not machine precision',
    holds: () => RES5_REL_MAX > 1e-6 && RES5_REL_MAX < 1e-4,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp34059-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP34059_GEOMETRIC_CENTER_FIFTH_ORDER_TAYLOR_TAIL.isRigorous === false &&
      /NO QED/.test(IMP34059_GEOMETRIC_CENTER_FIFTH_ORDER_TAYLOR_TAIL.verdict) &&
      /remains SOTA/.test(IMP34059_GEOMETRIC_CENTER_FIFTH_ORDER_TAYLOR_TAIL.verdict),
  },
];

for (const a of IMP34059_GEOMETRIC_CENTER_FIFTH_ORDER_TAYLOR_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-34059-geometric-center-fifth-order-taylor-tail assertion failed: ${a.id}`,
    );
  }
}
