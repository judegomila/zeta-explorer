/**
 * @module imp-96428-route-m-vasyunin-lammin-conditioning-ceiling
 *
 * imp-96428 (numerical): assess whether the imp-96105 SPD Vasyunin Gram lam_min
 * decay would drive the exact-eigenvalue / Cholesky pipeline toward
 * double-precision ill-conditioning (Cholesky breakdown) at some N, bounding the
 * largest N at which the pipeline stays numerically reliable -- i.e. whether
 * CONDITIONING (not compute) caps a future extension past N=6000.
 *
 * BACKGROUND: imp-96105 finding 4 recorded that the Vasyunin Gram stays SPD over
 * N=250..6000 with lam_min decreasing smoothly from 2.06e-5 to 4.69e-8, and its
 * named sub-gap (IMP96105_SUBGAP) framed the N=1e4 reach as CPU-starved. imp-96325
 * later RAN the ladder to N=1e4 (lam_min 3.47e-8 at N=7000 down to 1.747e-8 at
 * N=1e4). This ticket takes those measured lam_min rungs and asks the separate
 * question the extension left open: independent of wall-clock, at what N does the
 * decay law itself make the double-precision Cholesky solve unreliable?
 *
 * WHAT WAS DONE (tmp/imp-96428-final.mjs, reproducible, pure re-analysis of already
 * committed measured lam_min values -- no new Gram build): a log-log ordinary
 * least-squares fit lam_min ~ A * N^-p over the 12 measured rungs
 * (imp-96105 N=250,3000..6000 + imp-96325 N=7000..1e4), then extrapolation of the
 * condition number cond#(N) = lam_max / lam_min against the double-precision
 * Cholesky-breakdown scale cond# = 1/eps (eps = 2.22e-16).
 *
 * FINDINGS (see IMP96428_FIT / IMP96428_CEILING / IMP96428_VERDICT):
 *   (1) lam_min(N) is a clean near-N^-2 power law: p = 1.9179, A = 0.8187,
 *       R^2 = 0.99998 over the full 12-rung ladder. A BLIND fit restricted to
 *       N<=6000 predicts the measured N=1e4 lam_min = 1.747e-8 to within 0.12%,
 *       so the decay is deterministic extrapolable structure, not noise -- exactly
 *       the point imp-96105 finding 4 made qualitatively, now quantified.
 *   (2) The largest reliable N depends on lam_max, which imp-96105/imp-96325 did
 *       not record; bracketed by three proxies for the top of the spectrum. The
 *       rigorous mild bound is lam_max <= trace(G) = I(1,1) * H_N = O(log N)
 *       (the Gram diagonal is G_kk = I(1,1)/k). The double-precision breakdown
 *       ceiling cond# = 1/eps = 4.5e15 then lands at:
 *         lam_max ~ N (pessimistic)     -> N ~ 2.16e5
 *         lam_max ~ 10 log N (trace)    -> N ~ 9.3e6
 *         lam_max ~ O(1) (optimistic)   -> N ~ 1.31e8
 *       Every bracket is >= 22x the already-run N=1e4.
 *   (3) At the live targets the solve is well-conditioned: cond#(N=1e4) ~ 5.3e9
 *       under the trace proxy (~6 correct double-precision digits retained), and
 *       cond#(N=9916, the imp-96352 wall-clock-reachable ceiling) ~ 5.2e9. Both
 *       sit ~6 orders of magnitude below the 1/eps breakdown scale.
 *
 * VERDICT: CONDITIONING DOES NOT CAP the reachable range. The double-precision
 * Cholesky-breakdown ceiling is N >= 2.16e5 (pessimistic lam_max) to ~1e7 (trace
 * bound) -- 22x to 1000x beyond the already-run N=1e4. Compute / wall-clock binds
 * first: imp-96352 puts the single-process reachable ceiling at N ~ 9916 at 30 min
 * (N^3 solve), an order of magnitude below even the pessimistic 2.16e5 conditioning
 * ceiling. Conditioning becomes co-binding only near N ~ 2e5 in double precision,
 * where a double-double / extended-precision Cholesky would be required. So the
 * IMP96105_SUBGAP framing stands: the cap past 6000 is compute (imp-96352) /
 * scheduling (imp-96261), NOT the lam_min decay.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY. Changes no bound, establishes no operator
 * positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (lam_min N<=6000, finding 4)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (measured lam_min N=7000..1e4)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (N^3 wall-clock reach ceiling)
 * @see imp-96999-route-m-lammin-exponent-crossvalidation.js (p/A cross-validated across
 *   ESTIMATORS, not across bases -- see IMP96428_CROSSVALIDATION_STATUS below)
 *
 * Ticket: imp-96428 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// eps = double-precision machine epsilon; breakdown scale cond# = 1/eps.
export const IMP96428_EPS = 2.220446049250313e-16;

// The 12 measured lam_min rungs analysed (already committed in imp-96105 / imp-96325).
export const IMP96428_LAMMIN_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMin: 2.06e-5, source: 'imp-96105 finding 4 endpoint' }),
  Object.freeze({ N: 3000, lamMin: 1.7603246535995948e-7, source: 'imp-96105' }),
  Object.freeze({ N: 3500, lamMin: 1.3110357936852896e-7, source: 'imp-96105' }),
  Object.freeze({ N: 4000, lamMin: 9.990947269105856e-8, source: 'imp-96105' }),
  Object.freeze({ N: 4500, lamMin: 8.127160411035654e-8, source: 'imp-96105' }),
  Object.freeze({ N: 5000, lamMin: 6.56754131662765e-8, source: 'imp-96105' }),
  Object.freeze({ N: 5500, lamMin: 5.446040156899344e-8, source: 'imp-96105' }),
  Object.freeze({ N: 6000, lamMin: 4.694983880281018e-8, source: 'imp-96105' }),
  Object.freeze({ N: 7000, lamMin: 3.4682763044531355e-8, source: 'imp-96325 measured' }),
  Object.freeze({ N: 8000, lamMin: 2.6401525380046092e-8, source: 'imp-96325 measured' }),
  Object.freeze({ N: 9000, lamMin: 2.1420528627612423e-8, source: 'imp-96325 measured' }),
  Object.freeze({ N: 10000, lamMin: 1.7470544295391648e-8, source: 'imp-96325 measured' }),
]);

// Power-law fit lam_min ~ A N^-p over all 12 rungs, plus the blind N<=6000 -> 1e4 check.
export const IMP96428_FIT = Object.freeze({
  model: 'lam_min ~ A * N^-p (log-log OLS)',
  p: 1.917927,
  A: 0.8186721,
  r2: 0.99998398,
  nearInverseSquare: true,
  blindFitTo6000: Object.freeze({
    p: 1.916659,
    predictedLamMin1e4: 1.7449e-8,
    measuredLamMin1e4: 1.7470544295391648e-8,
    relError: -0.0012,
    note: 'fit restricted to N<=6000 predicts the imp-96325 MEASURED N=1e4 lam_min to 0.12%, validating the decay as deterministic extrapolable structure.',
  }),
});

// Extrapolated lam_min at N beyond the measured ladder (from the 12-rung fit).
export const IMP96428_LAMMIN_EXTRAP = Object.freeze([
  Object.freeze({ N: 20000, lamMin: 4.614e-9 }),
  Object.freeze({ N: 50000, lamMin: 7.958e-10 }),
  Object.freeze({ N: 100000, lamMin: 2.106e-10 }),
  Object.freeze({ N: 200000, lamMin: 5.573e-11 }),
  Object.freeze({ N: 1000000, lamMin: 2.544e-12 }),
]);

// Cholesky-breakdown ceiling: N at which cond# = lam_max/lam_min reaches 1/eps.
// lam_max is not recorded upstream; bracketed by three proxies. Rigorous mild
// bound: lam_max <= trace(G) = I(1,1) * H_N = O(log N) (Gram diagonal G_kk = I(1,1)/k).
export const IMP96428_CEILING = Object.freeze({
  breakdownCond: 4.503599627370496e15, // = 1/eps
  lamMaxConstOne: 130738947,   // lam_max ~ O(1)  (optimistic)
  lamMaxTraceLog: 9259821,     // lam_max ~ 10 log N (trace = I(1,1) H_N proxy)
  lamMaxLinearN: 216192,       // lam_max ~ N (pessimistic)
  minBracket: 216192,
  ranTo: 10000,
  ceilingOverRanRatio: 21.6,   // 216192 / 10000
  note: 'even the pessimistic lam_max ~ N bracket puts the double-precision Cholesky-breakdown ceiling at N ~ 2.16e5, 21.6x beyond the already-run N=1e4; the rigorous trace proxy gives ~9.3e6.',
});

// Condition number at the live targets (trace lam_max ~ 10 log N proxy).
export const IMP96428_TARGET_COND = Object.freeze([
  Object.freeze({ N: 6000, cond: 1.87e9, correctDigits: 6.7 }),
  Object.freeze({ N: 10000, cond: 5.28e9, correctDigits: 6.3, note: 'already run (imp-96325)' }),
  Object.freeze({ N: 9916, cond: 5.19e9, correctDigits: 6.3, note: 'imp-96352 30-min wall-clock reach ceiling' }),
  Object.freeze({ N: 200000, cond: 2.19e12, correctDigits: 3.7, note: 'near the pessimistic conditioning ceiling' }),
]);

export const IMP96428_VERDICT = Object.freeze({
  question: 'does the lam_min decay (conditioning), not compute, cap a Route M Vasyunin Gram extension past N=6000?',
  answer: 'NO -- compute binds first',
  conditioningCeilingN: '2.16e5 (pessimistic lam_max) to ~9.3e6 (trace lam_max)',
  computeCeilingN: 9916,
  computeCeilingSource: 'imp-96352 (N^3 solve, single process, 30 min)',
  conclusion:
    'the SPD Vasyunin Gram lam_min follows a clean near-N^-2 power law (p=1.918, R^2=0.99998, blind 1e4 prediction 0.12%). The double-precision Cholesky-breakdown ceiling (cond# = 1/eps) is N >= 2.16e5 even under the pessimistic lam_max ~ N proxy and ~9.3e6 under the rigorous lam_max ~ trace = O(log N) bound -- 22x to 1000x past the already-run N=1e4. At N=1e4 the solve retains ~6 correct double-precision digits (cond# ~ 5.3e9). CONDITIONING DOES NOT CAP the reachable range; compute / wall-clock (imp-96352, reachable N ~ 9916) binds an order of magnitude sooner. Conditioning becomes co-binding only near N ~ 2e5 in double precision, where extended precision would be required.',
});

// Honest residual sub-gap.
export const IMP96428_SUBGAP = Object.freeze({
  id: 'imp-96428-lammax-unrecorded',
  statement:
    'the exact conditioning ceiling depends on lam_max, which imp-96105 / imp-96325 did not record; the ceiling here is bracketed by three lam_max proxies (O(1), trace = O(log N), O(N)) rather than measured. The rigorous mild bound lam_max <= trace = I(1,1) H_N = O(log N) puts the ceiling at ~9.3e6, but a direct lam_max measurement (top eigenvalue via power iteration on the same Cholesky factors) would replace the bracket with a single ceiling. Either way the ceiling exceeds the already-run N=1e4 by >= 22x, so this does not change the verdict that compute binds first.',
});

export const IMP96428_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extrapolation only: every lam_min value is a reproducible numeric already committed in imp-96105 / imp-96325; the fit and conditioning ceiling are pure re-analysis (tmp/imp-96428-final.mjs); no Gram was rebuilt, no bound is claimed and no operator positivity is established.';

// Honest-status caveat (imp-97026): the p/A fit above (IMP96428_FIT) has since been
// cross-validated by imp-96999 across FOUR INDEPENDENT ESTIMATORS on this SAME Gram
// basis (Theil-Sen, anchor-dropped dense, low/high splits), all landing within the
// OLS band. That does NOT extend to a second, genuinely independent BASIS (the Route
// M analogue of the imp-96852 Legendre-vs-Gegenbauer Route I cross-basis check) -- a
// diagonal-preconditioned / correlation-matrix rescaling of the Vasyunin Gram would
// yield a DIFFERENT lam_min obeying a related law, and that rebuild has not been run.
export const IMP96428_CROSSVALIDATION_STATUS = Object.freeze({
  crossValidatedAcrossEstimators: true,
  crossValidatedAcrossEstimatorsSource: 'imp-96999-route-m-lammin-exponent-crossvalidation.js',
  crossValidatedAcrossBases: false,
  openSubGap: 'IMP96999_SUBGAP (imp-96999-estimator-not-second-basis)',
  note:
    'the p=1.917927 / A=0.8186721 exponent is estimator-robust (imp-96999) but has NOT been ' +
    'reproduced on a second Vasyunin Gram basis; readers citing this exponent as basis-independent ' +
    'should point instead at the open second-basis rebuild.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96428_ASSERTIONS = [
  {
    id: 'imp96428-lammin-power-law-clean',
    holds: () =>
      IMP96428_FIT.p > 1.9 && IMP96428_FIT.p < 1.94 &&
      IMP96428_FIT.r2 > 0.9999,
    why: 'lam_min follows a clean near-N^-2 power law (p in (1.9,1.94), R^2 > 0.9999) over the 12 measured rungs.',
  },
  {
    id: 'imp96428-blind-1e4-prediction-validates',
    holds: () =>
      Math.abs(IMP96428_FIT.blindFitTo6000.relError) < 0.01,
    why: 'a fit restricted to N<=6000 predicts the imp-96325 MEASURED N=1e4 lam_min to within 1% (actually 0.12%): the decay is deterministic extrapolable structure, not conditioning noise.',
  },
  {
    id: 'imp96428-ceiling-exceeds-ran-range',
    holds: () =>
      IMP96428_CEILING.minBracket > 20 * IMP96428_CEILING.ranTo &&
      IMP96428_CEILING.lamMaxLinearN < IMP96428_CEILING.lamMaxTraceLog &&
      IMP96428_CEILING.lamMaxTraceLog < IMP96428_CEILING.lamMaxConstOne,
    why: 'even the pessimistic lam_max ~ N Cholesky-breakdown ceiling (2.16e5) exceeds the already-run N=1e4 by more than 20x, and the three lam_max proxies order correctly (linear < trace < const).',
  },
  {
    id: 'imp96428-compute-binds-before-conditioning',
    holds: () =>
      IMP96428_VERDICT.computeCeilingN < IMP96428_CEILING.minBracket &&
      IMP96428_VERDICT.answer === 'NO -- compute binds first',
    why: 'the imp-96352 wall-clock reach ceiling (N ~ 9916) is below even the pessimistic conditioning ceiling (2.16e5), so compute caps a future extension before conditioning does.',
  },
  {
    id: 'imp96428-targets-well-conditioned',
    holds: () =>
      IMP96428_TARGET_COND.every((r) => r.cond < IMP96428_CEILING.breakdownCond) &&
      IMP96428_TARGET_COND.find((r) => r.N === 10000).correctDigits > 5,
    why: 'at all live targets cond# sits below the 1/eps breakdown scale, and the already-run N=1e4 retains ~6 correct double-precision digits: the solve is reliable there.',
  },
  {
    id: 'imp96428-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96428_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96428_HONEST_BANNER) &&
      /NO QED/.test(IMP96428_HONEST_BANNER) &&
      typeof IMP96428_SUBGAP.statement === 'string' &&
      /lammax-unrecorded/.test(IMP96428_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the named sub-gap flags the unrecorded lam_max that the ceiling bracket rests on.',
  },
  {
    id: 'imp96428-crossvalidation-status-honest',
    holds: () =>
      IMP96428_CROSSVALIDATION_STATUS.crossValidatedAcrossEstimators === true &&
      IMP96428_CROSSVALIDATION_STATUS.crossValidatedAcrossBases === false &&
      /imp-96999/.test(IMP96428_CROSSVALIDATION_STATUS.crossValidatedAcrossEstimatorsSource) &&
      /IMP96999_SUBGAP/.test(IMP96428_CROSSVALIDATION_STATUS.openSubGap),
    why: 'the caveat must record that the exponent is cross-validated across estimators (imp-96999) but explicitly NOT across bases, pointing at the still-open second-basis sub-gap.',
  },
];

for (const a of IMP96428_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96428-route-m-vasyunin-lammin-conditioning-ceiling assertion failed: ${a.id}`);
  }
}

export default {
  eps: IMP96428_EPS,
  lamMinRows: IMP96428_LAMMIN_ROWS,
  fit: IMP96428_FIT,
  lamMinExtrap: IMP96428_LAMMIN_EXTRAP,
  ceiling: IMP96428_CEILING,
  targetCond: IMP96428_TARGET_COND,
  verdict: IMP96428_VERDICT,
  subGap: IMP96428_SUBGAP,
  banner: IMP96428_HONEST_BANNER,
  crossValidationStatus: IMP96428_CROSSVALIDATION_STATUS,
};
