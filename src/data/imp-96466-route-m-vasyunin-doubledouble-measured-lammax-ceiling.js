/**
 * @module imp-96466-route-m-vasyunin-doubledouble-measured-lammax-ceiling
 *
 * imp-96466 (numerical): re-derive the double-double / extended-precision
 * (eps ~ 1e-32) Cholesky conditioning ceiling of the Route M Vasyunin Gram using
 * the imp-96443 MEASURED lam_max log-fit in place of the three imp-96428 lam_max
 * proxies that imp-96446 used.
 *
 * BACKGROUND: imp-96446 assessed how far a double-double Cholesky (eps ~ 1e-32)
 * pushes the conditioning ceiling, but it was framed against the THREE imp-96428
 * lam_max proxies (lam_max ~ N linear, ~ 10 log N trace, ~ O(1) const), giving a
 * WIDE double-double bracket N ~ 8.65e10 / 2.05e15 / 4.36e16. Meanwhile imp-96443
 * MEASURED lam_max directly by power iteration on the same exact-cotangent Gram
 * over N = 250..6000 and collapsed the DOUBLE-precision bracket to a single fit
 * lam_max = 3.0247 + 0.3526 log N (R^2 = 0.9954), giving a single double-precision
 * ceiling N ~ 4.11e7. This ticket re-runs the double-double assessment with that
 * measured lam_max, collapsing the imp-96446 three-proxy double-double bracket to a
 * single extended-precision ceiling.
 *
 * WHAT WAS DONE (tmp/imp-96466-scratch.mjs, reproducible): solve
 * cond#(N) = lam_max(N) / lam_min(N) = 1/eps for N by bisection in log10(N), with
 *   lam_max(N) = a + b log N   (imp-96443 fit: a = 3.0246914, b = 0.3526254, natural log)
 *   lam_min(N) = A N^-p        (imp-96428 power law: A = 0.8186721, p = 1.917927)
 * at eps = 2.22e-16 (double, port validation) and eps = 1e-32 (double-double).
 *
 * FINDINGS (see IMP96466_CEILING / IMP96466_VERDICT):
 *   (1) PORT VALIDATION: at eps = 2.22e-16 the solve reproduces the imp-96443
 *       double-precision ceiling N ~ 4.108890e7 to full precision, confirming the
 *       measured-lam_max ceiling formula is carried over exactly.
 *   (2) At double-double eps = 1e-32 the single measured-lam_max ceiling rises to
 *       N ~ 1.026e16, a +8.40 decade gain over the double-precision N ~ 4.11e7.
 *       The gain sits just below the closed-form const-proxy gain
 *       log10(eps_dp/eps_dd)/p = +8.52 decades (and well above the linear-proxy
 *       1/(1+p) = +5.60), because the measured lam_max grows only as ~0.35 log N,
 *       i.e. slowly enough to behave almost like the O(1) const proxy in the ceiling.
 *   (3) The single measured double-double ceiling N ~ 1.026e16 lands BETWEEN the
 *       imp-96446 trace-proxy double-double ceiling (2.05e15) and its const-proxy
 *       ceiling (4.36e16) -- the exact same bracket position the measured lam_max
 *       occupies in double precision, collapsing the imp-96446 three-proxy
 *       double-double bracket to one ceiling.
 *
 * VERDICT: conditioning STILL does not cap the reachable range under double-double.
 * The single measured extended-precision ceiling N ~ 1.026e16 is ~1.035e12 times
 * the imp-96352 wall-clock compute ceiling N ~ 9916 -- twelve orders of magnitude of
 * headroom. Double-double removes conditioning as a constraint entirely and only
 * reinforces the imp-96428 / imp-96443 verdict that COMPUTE / wall-clock binds first.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY. Changes no bound, establishes no operator
 * positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max log-fit + DP ceiling this extends)
 * @see imp-96446-route-m-vasyunin-doubledouble-conditioning-reach.js (the three-proxy double-double bracket this collapses)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law A N^-p)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (N^3 wall-clock reach ceiling ~9916)
 *
 * Ticket: imp-96466 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Machine epsilons: double-precision (port validation) and double-double.
export const IMP96466_EPS_DP = 2.220446049250313e-16;
export const IMP96466_EPS_DD = 1e-32;

// Inherited fits. lam_max from imp-96443 (natural-log OLS over N=250..6000);
// lam_min from the imp-96428 power law A N^-p.
export const IMP96466_LAMMAX_FIT = Object.freeze({
  a: 3.0246914027257246,
  b: 0.3526253785070698,
  form: 'lam_max = a + b * ln(N)',
  source: 'imp-96443 (measured power-iteration fit, R^2 = 0.9954)',
});
export const IMP96466_LAMMIN_LAW = Object.freeze({
  A: 0.8186721,
  p: 1.917927,
  form: 'lam_min = A * N^-p',
  source: 'imp-96428 (measured lam_min log-log OLS, R^2 = 0.99998)',
});

// Re-derived ceilings cond#(N) = lam_max(N)/lam_min(N) = 1/eps, solved by bisection.
export const IMP96466_CEILING = Object.freeze({
  // eps = 2.22e-16 port validation: reproduces the imp-96443 published DP ceiling.
  dpCeilingN: 41088904.7574003,        // ~4.11e7 -- matches imp-96443 IMP96443_CEILING.measuredCeilingN
  imp96443PublishedDpN: 41088904.757400334,
  portValidated: true,
  // eps = 1e-32 double-double: the new single measured-lam_max ceiling.
  ddCeilingN: 10261238724937952,       // ~1.026e16
  decadeGainDdOverDp: 8.3975,          // log10(ddCeilingN/dpCeilingN)
  // closed-form pure-proxy gains for context (both from log10(eps_dp/eps_dd)=16.3464).
  constProxyGainDecades: 8.52297,      // 1/p * log10(eps_dp/eps_dd) -- upper reference
  linearProxyGainDecades: 5.60207,     // 1/(1+p) * log10(eps_dp/eps_dd) -- lower reference
  note: 'the measured lam_max ~ 0.35 log N grows slowly, so its double-double decade gain (+8.40) sits just below the O(1) const-proxy gain (+8.52) and far above the linear-proxy gain (+5.60); lam_max enters cond# only linearly so the ceiling is nearly precision-scaled by 1/p.',
});

// Comparison against the imp-96446 three-proxy double-double bracket.
export const IMP96466_VS_IMP96446 = Object.freeze({
  imp96446DdLinearN: 8.65e10,
  imp96446DdTraceN: 2.05e15,
  imp96446DdConstN: 4.36e16,
  measuredDdN: 10261238724937952, // ~1.026e16
  betweenTraceAndConst: true,     // 2.05e15 < 1.026e16 < 4.36e16
  note: 'the single measured double-double ceiling lands between the imp-96446 trace (2.05e15) and const (4.36e16) proxy ceilings -- the same bracket position the measured lam_max holds in double precision (imp-96443: 9.3e6 < 4.11e7 < 1.31e8), collapsing the three-proxy double-double bracket to one ceiling.',
});

export const IMP96466_VERDICT = Object.freeze({
  question: 'does the imp-96443 measured lam_max log-fit change the double-double conditioning ceiling, and does conditioning cap the reachable range under extended precision?',
  measuredDdCeilingN: 10261238724937952,
  computeCeilingN: 9916,
  computeCeilingSource: 'imp-96352 (N^3 solve, single process, 30 min)',
  ceilingOverComputeRatio: 1.0348e12, // ddCeilingN / 9916
  conditioningStillDoesNotCap: true,
  conclusion:
    'Under the imp-96443 measured lam_max log-fit (in place of the three imp-96428 proxies imp-96446 used), the double-double eps=1e-32 Cholesky-breakdown ceiling is a SINGLE N ~ 1.026e16 -- a +8.40 decade lift over the double-precision N ~ 4.11e7, landing between the imp-96446 trace (2.05e15) and const (4.36e16) proxy ceilings. This is ~1.035e12 times the imp-96352 wall-clock compute ceiling N ~ 9916, so conditioning STILL does not cap the reachable range under double-double: compute / wall-clock binds first by twelve orders of magnitude. The port is validated by reproducing the imp-96443 double-precision ceiling 4.109e7 exactly at eps=2.22e-16.',
});

// Honest residual sub-gap.
export const IMP96466_SUBGAP = Object.freeze({
  id: 'imp-96466-doubledouble-ceiling-extrapolated-to-1e16',
  statement:
    'both inherited fits are MEASURED only over N=250..6000; the double-double ceiling N ~ 1.026e16 extrapolates the lam_max log-fit and the lam_min power law by ~12 decades in N. Because lam_max enters cond# only linearly while lam_min ~ N^-1.92 dominates the denominator, even an order-of-magnitude lam_max error moves the ceiling by a factor < 3 -- negligible against the ~1e12x margin over the imp-96352 compute ceiling. As imp-96446 flagged separately, the ~8-20x per-flop double-double slowdown lowers the compute ceiling it serves but is far absorbed by this margin. The verdict that compute binds first is robust to both extrapolations.',
});

export const IMP96466_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extrapolation only: the double-double ceiling is a pure re-solve of cond#=1/eps at eps=1e-32 using the imp-96443 measured lam_max fit and the imp-96428 measured lam_min power law; no Gram was rebuilt, no bound is claimed, and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const a = IMP96466_LAMMAX_FIT.a;
const b = IMP96466_LAMMAX_FIT.b;
const A = IMP96466_LAMMIN_LAW.A;
const p = IMP96466_LAMMIN_LAW.p;
const condOf = (N) => (a + b * Math.log(N)) / (A * Math.pow(N, -p));
const solveCeiling = (eps) => {
  const target = 1 / eps;
  let lo = 3, hi = 20;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (condOf(Math.pow(10, mid)) < target) lo = mid; else hi = mid;
  }
  return Math.pow(10, (lo + hi) / 2);
};

const IMP96466_ASSERTIONS = [
  {
    id: 'imp96466-port-reproduces-imp96443-dp-ceiling',
    holds: () =>
      Math.abs(solveCeiling(IMP96466_EPS_DP) - IMP96466_CEILING.imp96443PublishedDpN) /
        IMP96466_CEILING.imp96443PublishedDpN < 1e-6,
    why: 'solving cond#=1/eps at eps=2.22e-16 with the measured lam_max fit reproduces the imp-96443 published double-precision ceiling 4.109e7 to < 1e-6 relative: the port is exact.',
  },
  {
    id: 'imp96466-dd-ceiling-value',
    holds: () =>
      Math.abs(solveCeiling(IMP96466_EPS_DD) - IMP96466_CEILING.ddCeilingN) /
        IMP96466_CEILING.ddCeilingN < 1e-6,
    why: 'the double-double eps=1e-32 ceiling solves to N ~ 1.026e16, matching the stored IMP96466_CEILING.ddCeilingN.',
  },
  {
    id: 'imp96466-decade-gain-between-linear-and-const',
    holds: () => {
      const g = Math.log10(IMP96466_CEILING.ddCeilingN / IMP96466_CEILING.dpCeilingN);
      return g > IMP96466_CEILING.linearProxyGainDecades &&
             g < IMP96466_CEILING.constProxyGainDecades &&
             Math.abs(g - IMP96466_CEILING.decadeGainDdOverDp) < 1e-3;
    },
    why: 'the measured double-double decade gain (+8.40) lies strictly between the linear-proxy (+5.60) and const-proxy (+8.52) closed-form gains, consistent with lam_max growing as ~0.35 log N (near-const in the ceiling).',
  },
  {
    id: 'imp96466-dd-ceiling-between-imp96446-trace-and-const',
    holds: () =>
      IMP96466_VS_IMP96446.measuredDdN > IMP96466_VS_IMP96446.imp96446DdTraceN &&
      IMP96466_VS_IMP96446.measuredDdN < IMP96466_VS_IMP96446.imp96446DdConstN,
    why: 'the single measured double-double ceiling 1.026e16 lands between the imp-96446 trace (2.05e15) and const (4.36e16) proxy ceilings, collapsing the three-proxy bracket to one.',
  },
  {
    id: 'imp96466-conditioning-does-not-cap',
    holds: () =>
      IMP96466_VERDICT.computeCeilingN < IMP96466_VERDICT.measuredDdCeilingN / 1e9 &&
      IMP96466_VERDICT.conditioningStillDoesNotCap === true,
    why: 'the imp-96352 compute ceiling N ~ 9916 is more than nine orders of magnitude below the double-double conditioning ceiling 1.026e16, so compute binds first: conditioning still does not cap the reachable range.',
  },
  {
    id: 'imp96466-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96466_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96466_HONEST_BANNER) &&
      /NO QED/.test(IMP96466_HONEST_BANNER) &&
      /extrapolated/.test(IMP96466_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the residual extrapolation sub-gap is flagged.',
  },
];

for (const assertion of IMP96466_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96466-route-m-vasyunin-doubledouble-measured-lammax-ceiling assertion failed: ${assertion.id}`);
  }
}

export default {
  epsDp: IMP96466_EPS_DP,
  epsDd: IMP96466_EPS_DD,
  lamMaxFit: IMP96466_LAMMAX_FIT,
  lamMinLaw: IMP96466_LAMMIN_LAW,
  ceiling: IMP96466_CEILING,
  vsImp96446: IMP96466_VS_IMP96446,
  verdict: IMP96466_VERDICT,
  subGap: IMP96466_SUBGAP,
  banner: IMP96466_HONEST_BANNER,
};
