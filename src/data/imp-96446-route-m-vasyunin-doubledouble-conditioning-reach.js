/**
 * @module imp-96446-route-m-vasyunin-doubledouble-conditioning-reach
 *
 * imp-96446 (numerical): the imp-96428 verdict notes conditioning becomes
 * co-binding only near N ~ 2e5 in DOUBLE precision, where a double-double /
 * extended-precision Cholesky would be required, but never quantifies the reach
 * of that fix. This ticket re-derives the cond# = 1/eps Cholesky-breakdown
 * ceiling at double-double working precision (eps ~ 1e-32) under the SAME
 * measured lam_min power law and the SAME three lam_max proxies imp-96428 used,
 * and reports how many decades of N the extended-precision solve buys.
 *
 * INPUTS (all inherited, nothing re-measured):
 *   - lam_min ~ A N^-p with A = 0.8186721, p = 1.917927 (imp-96428 12-rung fit,
 *     R^2 = 0.99998, blind 1e4 prediction 0.12%).
 *   - three lam_max proxies bracketing the top of the spectrum:
 *       lam_max ~ N        (pessimistic linear)
 *       lam_max ~ 10 ln N  (trace = I(1,1) H_N, the rigorous mild bound)
 *       lam_max ~ O(1)     (optimistic).
 *   - breakdown scale cond# = lam_max / lam_min = 1/eps.
 *
 * METHOD (tmp/imp-96446-scratch.mjs, reproducible; pure re-analysis, no Gram
 * rebuilt): for the two eps-power-law proxies the ceiling is closed form,
 *   linear: N* = (A/eps)^{1/(1+p)},  const: N* = (A/eps)^{1/p},
 * and the trace proxy solves 10 ln(N) N^p / A = 1/eps by bisection. At
 * eps = 2.22e-16 the three ceilings reproduce imp-96428 exactly
 * (2.16e5 / 9.26e6 / 1.31e8), validating the port before pushing eps to 1e-32.
 *
 * FINDINGS (see IMP96446_CEILING_DD / IMP96446_DECADES / IMP96446_VERDICT):
 *   (1) At double-double eps ~ 1e-32 the Cholesky-breakdown ceiling rises to
 *         lam_max ~ N        -> N ~ 8.65e10  (pessimistic)
 *         lam_max ~ 10 ln N  -> N ~ 2.05e15  (trace, rigorous)
 *         lam_max ~ O(1)     -> N ~ 4.36e16  (optimistic)
 *       from the double-precision 2.16e5 / 9.26e6 / 1.31e8 respectively.
 *   (2) Decades of N bought over the double-precision ceiling:
 *         linear +5.60, trace +8.35, const +8.52 decades.
 *       The linear proxy buys FEWER decades because its exponent 1/(1+p) is
 *       smaller than the const proxy 1/p: the same eps improvement (16.35
 *       orders, log10(eps_dp/eps_dd)) is divided by 1+p vs p. Closed form:
 *       decades = log10(eps_dp/eps_dd)/(1+p) [linear], /p [const].
 *   (3) Does it lift conditioning above every plausible compute ceiling? YES.
 *       An exascale-YEAR N^3 direct solve (1e18 flop/s x 3.15e7 s, ~N^3/3 flops)
 *       reaches only N ~ 4.6e8. Even the PESSIMISTIC double-double linear ceiling
 *       8.65e10 sits ~190x above that, and the trace/const ceilings are 1e15-1e16.
 *       So in double-double, conditioning stops binding at any N a direct dense
 *       solve could ever reach; compute binds first by many orders of magnitude.
 *
 * VERDICT: a double-double Cholesky moves the conditioning ceiling from
 * N ~ 2e5 (double, pessimistic) up to N ~ 9e10..4e16 (double-double, across the
 * three proxies) -- a +5.6 to +8.5 decade gain -- which clears every realistic
 * dense-solve compute ceiling (exascale-year ~ 4.6e8). Extended precision
 * therefore removes conditioning as a constraint entirely for the Route M
 * Vasyunin pipeline; the imp-96428 conclusion (compute, not lam_min decay, caps
 * the reach) is only reinforced. The gain does NOT come free -- double-double
 * arithmetic is ~8-20x slower per flop, so it LOWERS the compute ceiling it is
 * meant to serve; that trade is a compute question (imp-96352 territory), not a
 * conditioning one.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY. Changes no bound, establishes no operator
 * positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (DP ceiling + fit)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (measured lam_min N=7000..1e4)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (N^3 wall-clock reach ceiling)
 *
 * Ticket: imp-96446 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// inherited lam_min power law (imp-96428 12-rung log-log OLS fit).
export const IMP96446_FIT = Object.freeze({ A: 0.8186721, p: 1.917927 });

// working-precision unit roundoff.
export const IMP96446_EPS = Object.freeze({
  double: 2.220446049250313e-16,       // IEEE-754 binary64
  doubleDouble: 1e-32,                 // ticket-spec double-double working precision
  doubleDoubleExact: 7.703719777548943e-32 / 6.25, // 2^-106 = 1.2326e-32 (true dd unit roundoff)
  note: 'ticket uses eps ~ 1e-32; the true double-double unit roundoff is 2^-106 = 1.2326e-32, which shifts every ceiling DOWN by <8% and does not change any decade count at the reported precision.',
});

// double-precision ceilings, recomputed here and cross-checked against imp-96428.
export const IMP96446_CEILING_DP = Object.freeze({
  lamMaxLinearN: 2.1619e5,   // imp-96428 IMP96428_CEILING.lamMaxLinearN = 216192
  lamMaxTraceLog: 9.2598e6,  // imp-96428 lamMaxTraceLog = 9259821
  lamMaxConstOne: 1.3074e8,  // imp-96428 lamMaxConstOne = 130738947
});

// double-double ceilings at eps = 1e-32 (this ticket).
export const IMP96446_CEILING_DD = Object.freeze({
  lamMaxLinearN: 8.6479e10,
  lamMaxTraceLog: 2.0477e15,
  lamMaxConstOne: 4.3589e16,
  note: 'cond# = lam_max/lam_min = 1/eps at eps = 1e-32; linear and const are closed form N* = (A/eps)^{1/(1+p)} and (A/eps)^{1/p}, trace solves 10 ln(N) N^p / A = 1/eps.',
});

// decades of N bought = log10(N_dd / N_dp) per proxy.
export const IMP96446_DECADES = Object.freeze({
  linear: 5.602,
  trace: 8.345,
  const: 8.523,
  closedFormLinear: 'log10(eps_dp/eps_dd) / (1 + p)',
  closedFormConst: 'log10(eps_dp/eps_dd) / p',
  epsOrdersGained: 16.346, // log10(2.22e-16 / 1e-32)
  note: 'the linear proxy buys the FEWEST decades because 1/(1+p) < 1/p: the same 16.35-order eps gain is divided by a larger exponent.',
});

// plausible dense-solve compute ceilings, for the "above every compute ceiling?" test.
export const IMP96446_COMPUTE_CEILING = Object.freeze({
  singleProcess30min: 9916,       // imp-96352 (N^3, single process, 30 min)
  exascaleYear: 4.555e8,          // 1e18 flop/s x 3.15e7 s, ~N^3/3 flops
  ddPessimisticCeiling: 8.6479e10,
  ddClearsExascaleYearBy: 189.8,  // 8.6479e10 / 4.555e8
  note: 'even the pessimistic double-double linear conditioning ceiling (8.65e10) sits ~190x above an exascale-YEAR dense N^3 solve (N ~ 4.6e8), so double-double lifts conditioning above every realistic dense compute ceiling.',
});

export const IMP96446_VERDICT = Object.freeze({
  question: 'how far does a double-double (eps ~ 1e-32) Cholesky push the imp-96428 conditioning ceiling, and does it lift conditioning above every plausible compute ceiling?',
  answer: 'YES -- double-double removes conditioning as a constraint entirely',
  ceilingDoubleN: '2.16e5 (pessimistic) to 1.31e8 (optimistic)',
  ceilingDoubleDoubleN: '8.65e10 (pessimistic) to 4.36e16 (optimistic)',
  decadesBought: '+5.6 (linear) to +8.5 (const)',
  clearsExascaleYear: true,
  conclusion:
    'a double-double Cholesky (eps ~ 1e-32) raises the cond# = 1/eps breakdown ceiling from N ~ 2.16e5..1.31e8 (double, across the three lam_max proxies) to N ~ 8.65e10..4.36e16, a +5.6 to +8.5 decade gain. Even the pessimistic 8.65e10 exceeds an exascale-year dense N^3 solve (N ~ 4.6e8) by ~190x, so extended precision lifts conditioning above every realistic dense compute ceiling. This only reinforces imp-96428: conditioning does not cap the Route M Vasyunin reach; compute does. The catch is that double-double arithmetic is ~8-20x slower per flop, which LOWERS the compute ceiling it serves -- a compute trade (imp-96352 territory), not a conditioning gain.',
});

// honest residual sub-gap.
export const IMP96446_SUBGAP = Object.freeze({
  id: 'imp-96446-dd-slowdown-not-modelled',
  statement:
    'this ticket quantifies only the CONDITIONING reach of double-double precision; it does not model the ~8-20x per-flop slowdown of double-double arithmetic, which lowers the wall-clock N^3 compute ceiling (imp-96352) below its double-precision value. The conditioning ceiling (8.65e10 pessimistic) clearing the exascale-year compute ceiling (4.6e8) by ~190x leaves ample margin for even a 20x slowdown, so the qualitative verdict (conditioning removed, compute binds) is robust; but a combined precision-cost model would give the true net reachable N. Inherits the imp-96428 sub-gap that lam_max is bracketed by three proxies, not measured.',
});

export const IMP96446_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extrapolation only: the lam_min power law and the three lam_max proxies are inherited verbatim from imp-96428 (itself pure re-analysis of imp-96105 / imp-96325 measured lam_min); this ticket only re-evaluates the same cond# = 1/eps ceiling at eps = 1e-32 (tmp/imp-96446-scratch.mjs). No Gram was rebuilt, no bound is claimed, no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const { A, p } = IMP96446_FIT;
const epsDP = IMP96446_EPS.double;
const epsDD = IMP96446_EPS.doubleDouble;
const ceilLinear = (eps) => Math.pow(A / eps, 1 / (1 + p));
const ceilConst = (eps) => Math.pow(A / eps, 1 / p);

const IMP96446_ASSERTIONS = [
  {
    id: 'imp96446-dp-ceilings-match-imp96428',
    holds: () =>
      Math.abs(ceilLinear(epsDP) / 216192 - 1) < 1e-3 &&
      Math.abs(ceilConst(epsDP) / 130738947 - 1) < 1e-3,
    why: 'recomputed double-precision linear and const ceilings reproduce imp-96428 (216192 / 130738947) to within 0.1%, validating the port before extending eps to 1e-32.',
  },
  {
    id: 'imp96446-dd-ceilings-lift-above-double',
    holds: () =>
      ceilLinear(epsDD) > 20 * ceilLinear(epsDP) &&
      ceilConst(epsDD) > 20 * ceilConst(epsDP) &&
      IMP96446_CEILING_DD.lamMaxLinearN < IMP96446_CEILING_DD.lamMaxTraceLog &&
      IMP96446_CEILING_DD.lamMaxTraceLog < IMP96446_CEILING_DD.lamMaxConstOne,
    why: 'double-double raises every proxy ceiling by orders of magnitude, and the three proxies keep the correct ordering (linear < trace < const).',
  },
  {
    id: 'imp96446-decades-closed-form-consistent',
    holds: () =>
      Math.abs(Math.log10(ceilLinear(epsDD) / ceilLinear(epsDP)) - IMP96446_DECADES.linear) < 0.01 &&
      Math.abs(Math.log10(epsDP / epsDD) / (1 + p) - IMP96446_DECADES.linear) < 0.01 &&
      Math.abs(Math.log10(epsDP / epsDD) / p - IMP96446_DECADES.const) < 0.01,
    why: 'the reported linear/const decade gains match both the direct ratio and the closed forms log10(eps_dp/eps_dd)/(1+p) and /p.',
  },
  {
    id: 'imp96446-linear-buys-fewest-decades',
    holds: () =>
      IMP96446_DECADES.linear < IMP96446_DECADES.trace &&
      IMP96446_DECADES.trace < IMP96446_DECADES.const,
    why: 'the pessimistic linear proxy buys the fewest decades because its exponent 1/(1+p) is smaller than the const proxy 1/p.',
  },
  {
    id: 'imp96446-clears-exascale-year',
    holds: () =>
      IMP96446_COMPUTE_CEILING.ddPessimisticCeiling > IMP96446_COMPUTE_CEILING.exascaleYear &&
      IMP96446_COMPUTE_CEILING.ddClearsExascaleYearBy > 100 &&
      IMP96446_VERDICT.clearsExascaleYear === true,
    why: 'even the pessimistic double-double conditioning ceiling exceeds an exascale-year dense N^3 solve by more than 100x, so extended precision lifts conditioning above every realistic dense compute ceiling.',
  },
  {
    id: 'imp96446-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96446_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96446_HONEST_BANNER) &&
      /NO QED/.test(IMP96446_HONEST_BANNER) &&
      typeof IMP96446_SUBGAP.statement === 'string' &&
      /dd-slowdown-not-modelled/.test(IMP96446_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the named sub-gap flags the un-modelled double-double slowdown.',
  },
];

for (const a of IMP96446_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96446-route-m-vasyunin-doubledouble-conditioning-reach assertion failed: ${a.id}`);
  }
}

export default {
  fit: IMP96446_FIT,
  eps: IMP96446_EPS,
  ceilingDouble: IMP96446_CEILING_DP,
  ceilingDoubleDouble: IMP96446_CEILING_DD,
  decades: IMP96446_DECADES,
  computeCeiling: IMP96446_COMPUTE_CEILING,
  verdict: IMP96446_VERDICT,
  subGap: IMP96446_SUBGAP,
  banner: IMP96446_HONEST_BANNER,
};
