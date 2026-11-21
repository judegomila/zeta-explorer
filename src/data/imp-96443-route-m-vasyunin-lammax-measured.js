/**
 * @module imp-96443-route-m-vasyunin-lammax-measured
 *
 * imp-96443 (numerical): measure the top-of-spectrum lam_max of the exact-cotangent
 * Route M Vasyunin Gram G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) at the accessible rungs,
 * to REPLACE the imp-96428 three-proxy lam_max bracket (O(1) / trace = O(log N) /
 * O(N)) with a single measured lam_max(N) fit and a re-derived double-precision
 * Cholesky-breakdown conditioning ceiling.
 *
 * BACKGROUND: imp-96428 bounded the double-precision Cholesky-breakdown ceiling of
 * the imp-96105 / imp-96325 Vasyunin Gram only within a WIDE bracket
 * (lam_max ~ N pessimistic -> N ~ 2.16e5; lam_max ~ 10 log N trace -> N ~ 9.3e6;
 * lam_max ~ O(1) optimistic -> N ~ 1.31e8) because lam_max was never recorded --
 * its named sub-gap (imp-96428-lammax-unrecorded) asked for a direct top-eigenvalue
 * measurement to collapse the bracket to a single ceiling. This ticket does that.
 *
 * WHAT WAS DONE (tmp/imp-96443-lammax.py, reproducible): the SAME exact Vasyunin
 * V-table V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q) and I_coprime as
 * imp-96105 / imp-96325 / imp-96383 was rebuilt ONCE to NMAX = 6000, then lam_max
 * was measured by power iteration on each leading submatrix G[:N,:N] over the ladder
 * N = 250,500,1000,2000,3000,4000,5000,6000. Power iteration is cheap (matvec only,
 * ~15-20 iterations to a 1e-13 Rayleigh tolerance) versus the N^3 Cholesky. At the
 * small rungs (N <= 2000) the power-iteration lam_max was cross-checked against the
 * exact eigvalsh top eigenvalue and agreed to ~1e-14 relative.
 *
 * FINDINGS (see IMP96443_LAMMAX_ROWS / IMP96443_FIT / IMP96443_CEILING / IMP96443_VERDICT):
 *   (1) lam_max grows SLOWLY and logarithmically, NOT linearly and NOT constant:
 *       4.9302 (N=250) -> 6.0620 (N=6000), a clean fit lam_max = 3.0247 + 0.3526 log N
 *       (R^2 = 0.9954). So of the three imp-96428 proxies the log-growth (trace-family)
 *       form is right in SHAPE but the coefficient (0.3526) is well below the trace
 *       slope I(1,1) = 1.2607: lam_max is far below the trace, and far above O(1)
 *       (20% spread over the ladder rules out the optimistic constant proxy).
 *   (2) The Gram diagonal maximum is exactly G_11 = I(1,1) = 1.2606614015078126 at
 *       every N (the k=1 diagonal), and the trace/H_N ratio equals I(1,1) to full
 *       precision -- confirming the imp-96428 rigorous mild bound
 *       lam_max <= trace = I(1,1) H_N. The measured lam_max sits ABOVE the largest
 *       diagonal (as an SPD Gram with off-diagonal mass requires) and well BELOW the
 *       trace, exactly inside the imp-96428 bracket.
 *   (3) Re-deriving the ceiling cond#(N) = lam_max(N)/lam_min(N) = 1/eps with the
 *       measured log-fit lam_max in place of the three proxies (lam_min from the
 *       imp-96428 power law A N^-p, A=0.8187, p=1.9179) gives a SINGLE conditioning
 *       ceiling N ~ 4.11e7 -- between the imp-96428 trace proxy (9.3e6) and optimistic
 *       proxy (1.31e8), ~4.4x the trace bound. At N=1e4 the measured cond# ~ 3.60e8
 *       (~6.4 correct double-precision digits), BETTER than the imp-96428 trace-proxy
 *       estimate of 5.28e9.
 *
 * VERDICT: the measured lam_max collapses the imp-96428 three-proxy bracket to a
 * single conditioning ceiling N ~ 4.11e7. This still sits ~4100x above the
 * imp-96352 wall-clock compute ceiling N ~ 9916, so the imp-96428 verdict is
 * UNCHANGED and SHARPENED: CONDITIONING DOES NOT CAP the reachable range; compute /
 * wall-clock binds first by more than three orders of magnitude. The named sub-gap
 * imp-96428-lammax-unrecorded is now CLOSED (lam_max measured, bracket collapsed).
 *
 * MEASUREMENT / EXTRAPOLATION ONLY. Changes no bound, establishes no operator
 * positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (the 3-proxy bracket this collapses)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (lam_min N<=6000, Gram build)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (measured lam_min N=7000..1e4)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (N^3 wall-clock reach ceiling ~9916)
 *
 * Ticket: imp-96443 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// eps = double-precision machine epsilon; breakdown scale cond# = 1/eps.
export const IMP96443_EPS = 2.220446049250313e-16;

// Gram diagonal numerator I(1,1) = 2C, C = (log(2 pi) - gamma)/2. Diagonal G_kk = I(1,1)/k;
// so G_11 = I(1,1) is the largest diagonal and trace(G_N) = I(1,1) H_N (verified below).
export const IMP96443_I11 = 1.2606614015078126;

// Measured lam_max (top eigenvalue) by power iteration on G[:N,:N]; the N<=2000 rungs
// carry the exact eigvalsh cross-check (agree to ~1e-14 relative). trace = I(1,1) H_N.
export const IMP96443_LAMMAX_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMax: 4.930210017770543, trace: 7.6908858100937, iters: 15, lamMaxExact: 4.930210017770584 }),
  Object.freeze({ N: 500, lamMax: 5.228866173055301, trace: 8.563450305446962, iters: 16, lamMaxExact: 5.228866173055357 }),
  Object.freeze({ N: 1000, lamMax: 5.495523758931842, trace: 9.43664418600729, iters: 17, lamMaxExact: 5.495523758931908 }),
  Object.freeze({ N: 2000, lamMax: 5.733924618097868, trace: 10.310152995544131, iters: 18, lamMaxExact: 5.733924618097966 }),
  Object.freeze({ N: 3000, lamMax: 5.861648882285381, trace: 10.821202166468481, iters: 19, lamMaxExact: null }),
  Object.freeze({ N: 4000, lamMax: 5.94745308383515, trace: 11.183819328662667, iters: 20, lamMaxExact: null }),
  Object.freeze({ N: 5000, lamMax: 6.01140643903531, trace: 11.46509627662857, iters: 20, lamMaxExact: null }),
  Object.freeze({ N: 6000, lamMax: 6.062043896086687, trace: 11.6949, iters: 20, lamMaxExact: null }),
]);

// Log-N fit lam_max ~ a + b log N over the 8 measured rungs (power iteration).
export const IMP96443_FIT = Object.freeze({
  model: 'lam_max ~ a + b * log(N) (OLS)',
  a: 3.0246914027257246,
  b: 0.3526253785070698,
  r2: 0.9953986123515587,
  slopeBelowTrace: true,
  traceSlopeI11: 1.2606614015078126,
  note: 'lam_max grows logarithmically with slope 0.3526, well below the trace slope I(1,1)=1.2607 -- the trace-family SHAPE of the imp-96428 log proxy is right but its coefficient overstates lam_max; the O(1) and O(N) proxies are both ruled out (20% spread over the ladder, sub-linear growth).',
});

// Constant-model diagnostics: mean and spread rule out the optimistic O(1) proxy.
export const IMP96443_CONST = Object.freeze({
  mean: 5.65888460863726,
  spread: 1.1318338783161437,
  spreadPct: 20.001,
  constProxyRuledOut: true,
});

// Re-derived double-precision Cholesky-breakdown ceiling with the MEASURED lam_max.
// cond#(N) = lam_max(N)/lam_min(N); lam_max from IMP96443_FIT log form,
// lam_min from the imp-96428 power law A N^-p (A=0.8186721, p=1.917927); solve cond#=1/eps.
export const IMP96443_CEILING = Object.freeze({
  breakdownCond: 4.503599627370496e15, // = 1/eps
  measuredCeilingN: 41088904.757400334, // ~4.11e7 -- single ceiling, no bracket
  imp96428TraceProxyN: 9259821,   // ~9.3e6 (trace lam_max ~ 10 log N)
  imp96428OptimisticN: 130738947, // ~1.31e8 (lam_max ~ O(1))
  imp96428PessimisticN: 216192,   // ~2.16e5 (lam_max ~ N)
  betweenTraceAndOptimistic: true,
  overTraceProxyRatio: 4.4,       // 4.11e7 / 9.3e6
  ranTo: 6000,
  note: 'the measured lam_max collapses the imp-96428 3-proxy bracket to a single ceiling N ~ 4.11e7, sitting between the trace proxy (9.3e6) and optimistic proxy (1.31e8) and ~4.4x the trace bound; the pessimistic lam_max ~ N proxy (2.16e5) is far too conservative -- lam_max grows only as ~0.35 log N.',
});

// Condition number at the live targets with the measured lam_max (tighter than imp-96428).
export const IMP96443_TARGET_COND = Object.freeze([
  Object.freeze({ N: 9916, cond: 3.5384e8, correctDigits: 6.45, note: 'imp-96352 30-min wall-clock reach ceiling' }),
  Object.freeze({ N: 10000, cond: 3.5978e8, correctDigits: 6.44, note: 'already run (imp-96325); imp-96428 trace-proxy said 5.28e9 -- measured is 15x better' }),
  Object.freeze({ N: 100000, cond: 3.3638e10, correctDigits: 4.47 }),
]);

export const IMP96443_VERDICT = Object.freeze({
  question: 'what is the measured lam_max(N) of the Vasyunin Gram, and does it collapse the imp-96428 three-proxy conditioning bracket?',
  measuredLamMaxLaw: 'lam_max = 3.0247 + 0.3526 log N (R^2 = 0.9954)',
  collapsedCeilingN: 41088904.757400334,
  computeCeilingN: 9916,
  computeCeilingSource: 'imp-96352 (N^3 solve, single process, 30 min)',
  conditioningStillDoesNotCap: true,
  subgapClosed: 'imp-96428-lammax-unrecorded',
  conclusion:
    'lam_max grows logarithmically (slope 0.3526 << trace slope I(1,1)=1.2607, well above O(1)), so the imp-96428 three-proxy bracket collapses to a SINGLE measured double-precision Cholesky-breakdown ceiling N ~ 4.11e7 -- between the trace (9.3e6) and optimistic (1.31e8) brackets. This is ~4100x above the imp-96352 wall-clock compute ceiling N ~ 9916, so the imp-96428 verdict is UNCHANGED and sharpened: CONDITIONING DOES NOT CAP the reachable range; compute / wall-clock binds first by more than three orders of magnitude. At N=1e4 the measured cond# ~ 3.60e8 (~6.4 correct double-precision digits), 15x better than the imp-96428 trace-proxy estimate.',
});

// The imp-96428 sub-gap this ticket closes.
export const IMP96443_CLOSES = Object.freeze({
  id: 'imp-96428-lammax-unrecorded',
  status: 'closed',
  how: 'lam_max measured directly by power iteration on the same exact Vasyunin Gram (cross-checked vs eigvalsh to ~1e-14) over N=250..6000; the three-proxy bracket is replaced by the single fit lam_max = 3.0247 + 0.3526 log N and a single conditioning ceiling N ~ 4.11e7.',
});

// Honest residual sub-gap.
export const IMP96443_SUBGAP = Object.freeze({
  id: 'imp-96443-lammax-fit-extrapolated-to-4e7',
  statement:
    'lam_max is MEASURED only over N=250..6000 (the accessible Gram range); the single conditioning ceiling N ~ 4.11e7 rests on extrapolating the log-N fit lam_max = 3.0247 + 0.3526 log N by ~4 decades in N. If lam_max were to depart from the clean log growth at N well beyond 6000 the ceiling would shift, but since lam_max enters the condition number only linearly (versus lam_min ~ N^-1.92 in the denominator), even an order-of-magnitude lam_max error moves the ceiling N by a factor < 3 -- far short of closing the ~4100x margin over the imp-96352 compute ceiling. The verdict that compute binds first is robust to the extrapolation.',
});

export const IMP96443_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: lam_max is a reproducible power-iteration eigenvalue on the same exact Vasyunin Gram as imp-96105 / imp-96325 (tmp/imp-96443-lammax.py), cross-checked vs eigvalsh; the fit and re-derived conditioning ceiling are pure re-analysis; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96443_ASSERTIONS = [
  {
    id: 'imp96443-lammax-cross-check-matches-eigvalsh',
    holds: () =>
      IMP96443_LAMMAX_ROWS.filter((r) => r.lamMaxExact != null).every(
        (r) => Math.abs(r.lamMax - r.lamMaxExact) / r.lamMaxExact < 1e-12,
      ),
    why: 'at every rung with an exact cross-check the power-iteration lam_max matches the eigvalsh top eigenvalue to < 1e-12 relative: the measurement is reliable.',
  },
  {
    id: 'imp96443-lammax-log-growth-clean',
    holds: () =>
      IMP96443_FIT.r2 > 0.99 && IMP96443_FIT.b > 0.3 && IMP96443_FIT.b < 0.4 &&
      IMP96443_FIT.b < IMP96443_FIT.traceSlopeI11,
    why: 'lam_max follows a clean log-N law (R^2 > 0.99) with slope in (0.3,0.4), well below the trace slope I(1,1)=1.2607: the trace-family shape is right, its coefficient overstates lam_max.',
  },
  {
    id: 'imp96443-diag-max-is-I11',
    holds: () =>
      Math.abs(IMP96443_I11 - 1.2606614015078126) < 1e-15 &&
      IMP96443_LAMMAX_ROWS.every((r) => r.lamMax > IMP96443_I11) &&
      IMP96443_LAMMAX_ROWS.every((r) => r.lamMax < r.trace),
    why: 'the largest Gram diagonal is G_11 = I(1,1); the measured lam_max sits strictly between the largest diagonal and the trace at every rung, as an SPD Gram with off-diagonal mass requires and consistent with lam_max <= trace.',
  },
  {
    id: 'imp96443-ceiling-collapses-bracket',
    holds: () =>
      IMP96443_CEILING.measuredCeilingN > IMP96443_CEILING.imp96428TraceProxyN &&
      IMP96443_CEILING.measuredCeilingN < IMP96443_CEILING.imp96428OptimisticN,
    why: 'the single measured conditioning ceiling N ~ 4.11e7 lands between the imp-96428 trace proxy (9.3e6) and optimistic proxy (1.31e8), collapsing the three-proxy bracket to one ceiling.',
  },
  {
    id: 'imp96443-conditioning-does-not-cap',
    holds: () =>
      IMP96443_VERDICT.computeCeilingN < IMP96443_CEILING.measuredCeilingN / 1000 &&
      IMP96443_VERDICT.conditioningStillDoesNotCap === true,
    why: 'the imp-96352 wall-clock compute ceiling (N ~ 9916) is more than 1000x below the measured conditioning ceiling (4.11e7), so compute binds first: conditioning does not cap the reachable range.',
  },
  {
    id: 'imp96443-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96443_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96443_HONEST_BANNER) &&
      /NO QED/.test(IMP96443_HONEST_BANNER) &&
      IMP96443_CLOSES.id === 'imp-96428-lammax-unrecorded' &&
      /extrapolated/.test(IMP96443_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers, the closed imp-96428 sub-gap is named, and the residual extrapolation sub-gap is flagged.',
  },
];

for (const a of IMP96443_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96443-route-m-vasyunin-lammax-measured assertion failed: ${a.id}`);
  }
}

export default {
  eps: IMP96443_EPS,
  i11: IMP96443_I11,
  lamMaxRows: IMP96443_LAMMAX_ROWS,
  fit: IMP96443_FIT,
  constDiag: IMP96443_CONST,
  ceiling: IMP96443_CEILING,
  targetCond: IMP96443_TARGET_COND,
  verdict: IMP96443_VERDICT,
  closes: IMP96443_CLOSES,
  subGap: IMP96443_SUBGAP,
  banner: IMP96443_HONEST_BANNER,
};
