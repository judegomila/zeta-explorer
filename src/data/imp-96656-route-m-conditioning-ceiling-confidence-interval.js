/**
 * @module imp-96656-route-m-conditioning-ceiling-confidence-interval
 *
 * imp-96656 (numerical, ERROR-PROPAGATION ONLY): replace the imp-96570 POINT range
 * for the Route M double-precision conditioning ceiling (independent single-object
 * cond# fit: 3.78e7 all-rung / 4.30e7 dense) with an error-bounded CONFIDENCE
 * INTERVAL, by propagating the OLS fit standard errors on the exponent q and the
 * coefficient lnC through the ceiling map N* = (1/(eps*C))^(1/q).
 *
 * THE ISSUE. imp-96570 reports the conditioning ceiling only as a point range
 * (independent single-object cond# power fit: dense 4.30e7, all-rung 3.78e7; composed
 * 4.11e7) with NO error band, even though each ceiling solves cond# = C N^q = 1/eps
 * from a log-log OLS whose slope q and intercept lnC carry standard errors (and a
 * covariance). Without a band the reader cannot tell whether the ordering
 * "compute ceiling 9916  <  rigorous lower ceiling 2.59e7  <  fitted ceiling" is
 * robust to the fit uncertainty or an artifact of reporting a bare point.
 *
 * WHAT WAS DONE (tmp/imp-96656-scratch.mjs, reproducible; pure re-analysis of the
 * already-committed imp-96570 cond# rows -- no Gram rebuilt, no new measurement).
 * For each subset (dense N=3000..6000, all five rungs N=250,3000..6000) fit
 * ln cond# = lnC + q ln N by OLS and carry the full parameter covariance:
 *     Var(q)     = s^2 / Sxx
 *     Var(lnC)   = s^2 (1/n + xbar^2 / Sxx)
 *     Cov(lnC,q) = -s^2 xbar / Sxx,   s^2 = SSres/(n-2),  Sxx = sum (x_i - xbar)^2.
 * The ceiling in log is ln N* = (L - lnC)/q with L = ln(1/eps). The delta method
 * (partials d(lnN)/d(lnC) = -1/q, d(lnN)/d(q) = -(lnN)/q) gives
 *     Var(ln N*) = (1/q^2) Var(lnC) + (lnN/q)^2 Var(q) + (2 lnN/q^2) Cov(lnC,q),
 * and the band is log-normal: N* in [exp(lnN* - t sigma), exp(lnN* + t sigma)] with
 * two-sided Student-t multipliers t(df) for df = n-2.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the exponent q carries a small but non-negligible standard error.
 * -------------------------------------------------------------------------------
 * dense (4 rungs, df=2): q = 1.9557 +/- 0.0219, lnC = 1.671 +/- 0.184, R^2=0.99975.
 * all   (5 rungs, df=3): q = 1.9837 +/- 0.0048, lnC = 1.436 +/- 0.038, R^2=0.99998.
 * The all-rung fit is ~4.5x tighter on q (the extra low anchor N=250 lengthens the
 * log-N lever arm, shrinking Var(q) ~ 1/Sxx), so it also yields the tighter ceiling.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the ceiling CONFIDENCE INTERVAL (replaces the imp-96570 point range).
 * -------------------------------------------------------------------------------
 *     dense:  N* = 4.30e7,  ~1 sigma [3.83e7, 4.82e7],  95% CI [2.76e7, 6.69e7]
 *     all:    N* = 3.78e7,  ~1 sigma [3.68e7, 3.87e7],  95% CI [3.50e7, 4.07e7]
 * The band is markedly asymmetric in N (log-normal): the ceiling is exponentially
 * sensitive to q, so the sparse dense fit spans a factor ~2.4 at 95% while the
 * all-rung fit spans only ~1.16. The imp-96570 point range 3.78e7-4.30e7 sits INSIDE
 * both 95% bands, so it was a reasonable central summary -- it just lacked the width.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the ordering survives the full 95% band, but the dense LOWER edge is
 *              close to the rigorous lower ceiling.
 * -------------------------------------------------------------------------------
 * Under the widest (dense, 95%) band the LOWER ceiling edge is N_lo = 2.76e7, which
 * still exceeds BOTH the imp-96548 rigorous trace-domination lower ceiling 2.59e7 and
 * the imp-96352 compute ceiling 9916. So the chain
 *     9916 (compute)  <  2.59e7 (rigorous lower)  <  N_lo (fitted 95% lower edge)
 * holds under the full uncertainty. BUT the margin over the rigorous lower ceiling is
 * only ~6.5% on the dense fit (2.76e7 vs 2.59e7): the two ceilings are NOT separated
 * by the fit uncertainty with room to spare on the sparse subset. The all-rung fit is
 * comfortable (N_lo = 3.50e7, ~35% above 2.59e7). The compute ceiling 9916 is ~2800x
 * below every band edge, so "compute binds first" is robust by a wide margin.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The Route M conditioning ceiling is now reported as an error-bounded interval:
 * N* = 3.78e7 (all-rung, 95% CI [3.50e7, 4.07e7]) / 4.30e7 (dense, 95% CI
 * [2.76e7, 6.69e7]). The compute-binds-first ordering (9916 < 2.59e7 < fitted band)
 * survives the full 95% band on both subsets; the only tight spot is the dense-fit
 * lower edge sitting ~6.5% above the rigorous lower ceiling. No bound is moved:
 * propagating the fit uncertainty does not touch lam_max, lam_min, or any Lambda
 * bound. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (the point range replaced here)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous lower ceiling 2.59e7)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power p=1.918)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling ~9916)
 *
 * Ticket: imp-96656 (numerical, opus-4-8, api-pool). Error-propagation only; NO QED.
 */

export const IMP96656_EPS = 2.220446049250313e-16;
const L = Math.log(1 / 2.220446049250313e-16); // ln(1/eps) ~ 36.04

// The imp-96570 directly-measured cond#(N) = lam_max/lam_min rows (already committed).
export const IMP96656_COND_ROWS = Object.freeze([
  Object.freeze({ N: 250, cond: 4.930210017770543 / 2.06e-5 }),
  Object.freeze({ N: 3000, cond: 5.861648882285381 / 1.7603246535995948e-7 }),
  Object.freeze({ N: 4000, cond: 5.94745308383515 / 9.990947269105856e-8 }),
  Object.freeze({ N: 5000, cond: 6.01140643903531 / 6.56754131662765e-8 }),
  Object.freeze({ N: 6000, cond: 6.062043896086687 / 4.694983880281018e-8 }),
]);

// Reference ceilings the interval is checked against.
const RIGOROUS_LOWER_CEILING = 2.59e7; // imp-96548 trace-domination lower ceiling
const COMPUTE_CEILING = 9916;          // imp-96352 wall-clock reach
const COMPOSED_MEASURED_CEILING = 41088904.757400334; // imp-96443/96548 composed ~4.11e7

// Two-sided Student-t critical values (small-sample; df = n-2).
const T95 = Object.freeze({ 2: 4.302653, 3: 3.182446 }); // 95%
const T68 = Object.freeze({ 2: 1.108, 3: 1.078 });       // ~68% (1-sigma-equivalent)

// OLS of ln cond# = lnC + q ln N carrying the full parameter covariance.
function olsFit(rows) {
  const n = rows.length;
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.cond));
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  let Sxx = 0, Sxy = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    Sxx += (xs[i] - xbar) ** 2;
    Sxy += (xs[i] - xbar) * (ys[i] - ybar);
    ssTot += (ys[i] - ybar) ** 2;
  }
  const q = Sxy / Sxx;
  const lnC = ybar - q * xbar;
  let ssRes = 0;
  for (let i = 0; i < n; i++) ssRes += (ys[i] - (lnC + q * xs[i])) ** 2;
  const df = n - 2;
  const s2 = ssRes / df;
  return {
    n, df, q, lnC, C: Math.exp(lnC), r2: 1 - ssRes / ssTot,
    seQ: Math.sqrt(s2 / Sxx),
    seLnC: Math.sqrt(s2 * (1 / n + (xbar * xbar) / Sxx)),
    varQ: s2 / Sxx,
    varLnC: s2 * (1 / n + (xbar * xbar) / Sxx),
    covLnCq: -s2 * xbar / Sxx,
  };
}

// Delta-method ceiling CI: ln N* = (L - lnC)/q, log-normal band at multiplier t.
function ceilingCI(fit, t) {
  const { q, lnC, varQ, varLnC, covLnCq } = fit;
  const lnN = (L - lnC) / q;
  const dLnC = -1 / q;
  const dq = -lnN / q;
  const varLnN = dLnC * dLnC * varLnC + dq * dq * varQ + 2 * dLnC * dq * covLnCq;
  const seLnN = Math.sqrt(varLnN);
  return {
    N: Math.exp(lnN),
    seLnN,
    Nlo: Math.exp(lnN - t * seLnN),
    Nhi: Math.exp(lnN + t * seLnN),
  };
}

const denseFit = olsFit(IMP96656_COND_ROWS.filter((r) => r.N >= 3000));
const allFit = olsFit(IMP96656_COND_ROWS);

function summarize(fit) {
  const ci95 = ceilingCI(fit, T95[fit.df]);
  const ci68 = ceilingCI(fit, T68[fit.df]);
  return Object.freeze({
    n: fit.n, df: fit.df,
    q: fit.q, seQ: fit.seQ, lnC: fit.lnC, seLnC: fit.seLnC, C: fit.C, r2: fit.r2,
    ceiling: ci95.N,
    seLnCeiling: ci95.seLnN,
    ci68: Object.freeze({ lo: ci68.Nlo, hi: ci68.Nhi }),
    ci95: Object.freeze({ lo: ci95.Nlo, hi: ci95.Nhi }),
    // margin of the 95% lower edge over the two reference ceilings
    lo95AboveRigorousFactor: ci95.Nlo / RIGOROUS_LOWER_CEILING,
    lo95AboveComputeFactor: ci95.Nlo / COMPUTE_CEILING,
    orderingHolds: ci95.Nlo > RIGOROUS_LOWER_CEILING && RIGOROUS_LOWER_CEILING > COMPUTE_CEILING,
  });
}

export const IMP96656_DENSE = summarize(denseFit); // 4 rungs, df=2
export const IMP96656_ALL = summarize(allFit);      // 5 rungs, df=3

export const IMP96656_INTERVAL = Object.freeze({
  method:
    'log-log OLS of cond# = C N^q with full (lnC,q) covariance, delta-method through ' +
    'ln N* = (ln(1/eps) - lnC)/q, log-normal band at Student-t(df=n-2).',
  referenceCeilings: Object.freeze({
    rigorousLower: RIGOROUS_LOWER_CEILING,
    compute: COMPUTE_CEILING,
    composedMeasured: COMPOSED_MEASURED_CEILING,
  }),
  dense: IMP96656_DENSE,
  all: IMP96656_ALL,
  replaces:
    'imp-96570 point range 3.78e7 (all) - 4.30e7 (dense) [no error band] -> ' +
    'all 95% CI [3.50e7, 4.07e7], dense 95% CI [2.76e7, 6.69e7].',
});

export const IMP96656_VERDICT = Object.freeze({
  question:
    'propagating the OLS fit-exponent standard errors through N* = (1/(eps C))^(1/q), ' +
    'does the compute-binds-first ordering 9916 < 2.59e7 < fitted ceiling survive the ' +
    'full 95% confidence band, and how wide is the ceiling interval?',
  ceilingPointAll: IMP96656_ALL.ceiling,       // ~3.78e7
  ceilingPointDense: IMP96656_DENSE.ceiling,   // ~4.30e7
  ceiling95All: '[3.50e7, 4.07e7]',
  ceiling95Dense: '[2.76e7, 6.69e7]',
  orderingSurvives95Band: IMP96656_ALL.orderingHolds && IMP96656_DENSE.orderingHolds,
  computeBindsFirstRobust:
    IMP96656_ALL.lo95AboveComputeFactor > 2000 && IMP96656_DENSE.lo95AboveComputeFactor > 2000,
  tightSpot:
    'the dense-fit 95% lower edge (2.76e7) sits only ~' +
    ((IMP96656_DENSE.lo95AboveRigorousFactor - 1) * 100).toFixed(1) +
    '% above the rigorous lower ceiling 2.59e7; the all-rung fit is comfortable (~' +
    ((IMP96656_ALL.lo95AboveRigorousFactor - 1) * 100).toFixed(0) + '% above).',
  anyBoundMoved: false,
  conclusion:
    'ERROR-BOUNDED CEILING. The Route M conditioning ceiling is N* = 3.78e7 (all-rung, ' +
    '95% CI [3.50e7, 4.07e7]) / 4.30e7 (dense, 95% CI [2.76e7, 6.69e7]), the band ' +
    'log-normal and asymmetric because N* is exponentially sensitive to q. The ordering ' +
    '9916 (compute) < 2.59e7 (rigorous lower) < fitted-ceiling 95% lower edge holds on ' +
    'both subsets, so compute binds first robustly (>=2800x below every band edge); the ' +
    'only tight spot is the dense-fit lower edge at ~6.5% above the rigorous lower ' +
    'ceiling. No bound moved; error-propagation only; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96656_SUBGAP = Object.freeze({
  id: 'imp-96656-ci-inherits-lammin-extrapolation-and-tdf',
  statement:
    'the confidence interval quantifies only the SAMPLING uncertainty of the log-log OLS ' +
    'on 4-5 accessible rungs; it inherits the same non-rigorous lam_min N^-p and lam_max ' +
    'a+b log N extrapolations (imp-96570 sub-gap) that the point ceiling rests on, and the ' +
    'Student-t band assumes homoscedastic log-normal residuals on a very small sample ' +
    '(df=2 dense / df=3 all), so the interval is a fit-uncertainty band, NOT a rigorous ' +
    'enclosure of the true breakdown N. Hardening would require measured cond# at more ' +
    'mid-range rungs (shrinking Var(q) ~ 1/Sxx) or a rigorous conditioning bound; not ' +
    'attempted here. The compute-binds-first verdict is unaffected either way.',
});

export const IMP96656_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Error-propagation only: every cond# ' +
  'value is a reproducible numeric already committed in imp-96570 / imp-96443 / imp-96105; ' +
  'the OLS covariance and delta-method ceiling band are pure re-analysis ' +
  '(tmp/imp-96656-scratch.mjs); no Gram was rebuilt and no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96656_ASSERTIONS = [
  {
    id: 'imp96656-fit-exponents-carry-standard-errors',
    holds: () =>
      IMP96656_DENSE.seQ > 0 && IMP96656_DENSE.seQ < 0.05 &&
      IMP96656_ALL.seQ > 0 && IMP96656_ALL.seQ < 0.02 &&
      IMP96656_ALL.seQ < IMP96656_DENSE.seQ, // all-rung tighter (longer lever arm)
    why: 'both fits carry a positive, small exponent standard error, and the all-rung fit (extra N=250 anchor) is tighter on q than the dense fit.',
  },
  {
    id: 'imp96656-ceiling-ci-brackets-the-point-range',
    holds: () =>
      IMP96656_ALL.ci95.lo < IMP96656_ALL.ceiling && IMP96656_ALL.ceiling < IMP96656_ALL.ci95.hi &&
      IMP96656_DENSE.ci95.lo < IMP96656_DENSE.ceiling && IMP96656_DENSE.ceiling < IMP96656_DENSE.ci95.hi &&
      IMP96656_ALL.ci95.hi < IMP96656_DENSE.ci95.hi, // dense band wider (sparser, df=2)
    why: 'the 95% CI brackets each point ceiling, and the dense (4-rung, df=2) band is wider than the all-rung band.',
  },
  {
    id: 'imp96656-ordering-survives-full-95-band',
    holds: () =>
      IMP96656_DENSE.ci95.lo > RIGOROUS_LOWER_CEILING &&
      IMP96656_ALL.ci95.lo > RIGOROUS_LOWER_CEILING &&
      RIGOROUS_LOWER_CEILING > COMPUTE_CEILING &&
      IMP96656_VERDICT.orderingSurvives95Band === true,
    why: 'even at the widest 95% lower edge both fitted ceilings exceed the rigorous lower ceiling 2.59e7, which exceeds the compute ceiling 9916: the ordering survives the full band.',
  },
  {
    id: 'imp96656-dense-lower-edge-is-the-tight-spot',
    holds: () =>
      IMP96656_DENSE.lo95AboveRigorousFactor > 1.0 &&
      IMP96656_DENSE.lo95AboveRigorousFactor < 1.15 &&
      IMP96656_ALL.lo95AboveRigorousFactor > 1.2,
    why: 'the dense-fit 95% lower edge sits only ~6.5% above the rigorous lower ceiling (the tight spot), while the all-rung fit sits comfortably ~35% above.',
  },
  {
    id: 'imp96656-compute-binds-first-robust',
    holds: () =>
      IMP96656_DENSE.lo95AboveComputeFactor > 2000 &&
      IMP96656_ALL.lo95AboveComputeFactor > 2000 &&
      IMP96656_VERDICT.computeBindsFirstRobust === true,
    why: 'every 95% lower band edge sits >= 2000x above the compute ceiling 9916, so compute binds first robustly under the fit uncertainty.',
  },
  {
    id: 'imp96656-honesty-gate-no-qed',
    holds: () =>
      IMP96656_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96656_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96656_HONEST_BANNER) &&
      /RH open/.test(IMP96656_HONEST_BANNER) &&
      /inherits-lammin-extrapolation/.test(IMP96656_SUBGAP.id),
    why: 'error-propagation only: no bound moved, the honesty markers are present, and the residual sub-gap (the band inherits the non-rigorous lam_min/lam_max extrapolation and small-sample t assumption) is recorded.',
  },
];

for (const a of IMP96656_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96656-route-m-conditioning-ceiling-confidence-interval assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96656_EPS,
  condRows: IMP96656_COND_ROWS,
  dense: IMP96656_DENSE,
  all: IMP96656_ALL,
  interval: IMP96656_INTERVAL,
  verdict: IMP96656_VERDICT,
  subGap: IMP96656_SUBGAP,
  banner: IMP96656_HONEST_BANNER,
};
