/**
 * @module imp-96586-route-m-lammax-meanfield-cesaro-proxy
 *
 * imp-96586 (numerical, HEURISTIC ASSESSMENT ONLY): imp-96562 localized the open
 * IMP96562_SUBGAP to the leading log-coefficient of the Vasyunin lam_max asymptotic
 * lam_max = 3.0247 + 0.3526 log N (imp-96443 fit), showed it is entirely off-diagonal
 * mass (diagonal frozen at G_11 = I(1,1) = 1.2607), and that classical additive
 * Szego/Grenander does not apply (multiplicative kernel; log-divergent unbounded edge).
 * This ticket asks the NEXT question: does a HEURISTIC mean-field / Cesaro average of
 * the multiplicative kernel gcd(h,k) I(h/g,k/g)/(hk) PREDICT the 0.3526 growth RATE
 * (not an edge value), even non-rigorously, to give the fitted slope structural support?
 *
 * WHAT WAS DONE (tmp/imp-96586-meanfield.py, reproducible; same exact Vasyunin V-table
 * V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q) and I_coprime as imp-96105 / imp-96443):
 * the Gram is peaked at the k=1 diagonal (G_11 = I(1,1) is the largest entry), so the
 * Perron eigenvector concentrates near index 1 and the natural mean-field surrogates of
 * lam_max are built on the k=1 row G_{1,k} = I(1,k)/k. Two proxies were measured on the
 * imp-96443 ladder N = 250..6000 and their log-slopes compared to the measured slope
 * b_meas = 0.3526253785070698:
 *   (P1) PEAK-ROW CESARO / GERSHGORIN L1 MASS  P1(N) = Sum_{k<=N} G_{1,k} = Sum I(1,k)/k
 *        -- the crudest averaged-symbol / row-sum estimate (a Perron/Gershgorin UPPER
 *        proxy for lam_max).
 *   (P2) PERRON ONE-STEP RAYLEIGH from e_1  R(N) = (G^2)_{11}/G_{11} =
 *        (1/I11) Sum_{k<=N} G_{1,k}^2 -- the Rayleigh quotient of the first
 *        power-iteration iterate from the peak basis vector (a sharper mean-field edge).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- NEITHER mean-field proxy predicts 0.3526; they BRACKET it by ~280x.
 * -------------------------------------------------------------------------------
 *   (P1) the peak-row L1 mass grows as 4.7062 log N (R^2 = 0.998) -- a slope 13.35x
 *        the measured 0.3526. It OVERSHOOTS massively: the Gershgorin/Perron row sum
 *        double-counts off-diagonal mass that eigenvalue cancellation removes (the same
 *        gap imp-96548 saw between the trace-domination slope 1.2607 and 0.3526, only
 *        larger). ratio(P1) = 13.35.
 *   (P2) the Perron one-step Rayleigh CONVERGES: R(N) = 3.16 -> 3.22 with a log-slope of
 *        only 0.0166 (ratio 0.047), because the peak row is Hilbert-Schmidt
 *        (Sum_k G_{1,k}^2 converges to ~4.055, see FINDING 2). A single-mode / rank-one
 *        mean-field surrogate therefore predicts a BOUNDED spectral edge, NOT log-growth.
 *        ratio(P2) = 0.047.
 * The measured slope 0.3526 lies STRICTLY BETWEEN the two mean-field brackets
 * [0.0166, 4.7062] but is reproduced by NEITHER -- a factor ~21 above the one-step
 * estimate and a factor ~13 below the row-sum estimate. So no simple averaged-symbol
 * collapse pins the coefficient.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the peak row is Hilbert-Schmidt: the log-growth is COLLECTIVE.
 * -------------------------------------------------------------------------------
 * Sum_{k<=N} G_{1,k}^2 = 3.9827 (N=250) -> 4.0547 (N=6000) and is clearly convergent
 * (increments shrink by ~1/N). So the k=1 row of the Vasyunin operator is an ell^2
 * (Hilbert-Schmidt) vector: any rank-one / peak-row / single-mode mean-field surrogate
 * for lam_max saturates to a finite edge and cannot carry a log-divergence. The measured
 * 0.3526 log N therefore cannot originate from the dominant row alone -- it is a
 * genuinely COLLECTIVE multi-index off-diagonal effect (accumulated only over many
 * power-iteration steps / the full multiplicative coupling), exactly the regime where a
 * mean-field / averaged-symbol heuristic has no predictive content. This is fully
 * consistent with imp-96562 FINDING 3 (the ladder is ~2x pre-asymptotic) and with
 * imp-96562 FINDING 2 (unbounded multiplicative edge, no bounded limiting symbol).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * NO. A heuristic mean-field / Cesaro average of the multiplicative Vasyunin kernel does
 * NOT predict the measured lam_max log-slope 0.3526 -- not even non-rigorously. The two
 * natural single-mode proxies BRACKET it (row-sum 13.35x high; Perron one-step 0.047x
 * low, i.e. convergent) but neither lands near it, because the peak row is Hilbert-
 * Schmidt so the coefficient is not a single-mode/averaged-symbol quantity at all. This
 * does NOT weaken the imp-96443 fit -- it SHARPENS the imp-96562 IMP96562_SUBGAP: the
 * 0.3526 leading log-coefficient is a collective off-diagonal spectral-edge growth rate
 * with (i) no additive-Szego analog (imp-96562), (ii) no bounded limiting symbol
 * (imp-96562), and now (iii) no mean-field / rank-one / averaged-symbol prediction. A
 * rigorous OR heuristic pin still requires a genuine multiplicative-Toeplitz /
 * Dirichlet-Bohr spectral-edge asymptotic for an unbounded, non-rank-one operator, which
 * is not available. Changes no bound; no operator positivity; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (localizes IMP96562_SUBGAP)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max = 3.0247 + 0.3526 log N fit)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (trace-domination slope 1.2607)
 *
 * Ticket: imp-96586 (numerical, opus-4-8, api-pool). Heuristic assessment only; NO QED.
 */

// C = (log(2 pi) - gamma)/2; I(1,1) = 2C is the frozen dominant Gram diagonal.
export const IMP96586_C = 0.6303307007539063;
export const IMP96586_I11 = 1.2606614015078126;

// imp-96443 measured lam_max log-slope this assessment targets.
export const IMP96586_MEASURED_SLOPE = 0.3526253785070698;

// Mean-field proxy ladders on the k=1 (peak) row G_{1,k} = I(1,k)/k, N = 250..6000
// (tmp/imp-96586-meanfield.py). P1 = Sum G_{1,k} (row-sum), P2 = (1/I11) Sum G_{1,k}^2
// (Perron one-step Rayleigh), L2 = Sum G_{1,k}^2 (peak-row Hilbert-Schmidt mass).
export const IMP96586_ROWS = Object.freeze(
  [
    { N: 250, P1: 14.704029, P2: 3.159187, L2: 3.982665 },
    { N: 500, P1: 17.517952, P2: 3.185091, L2: 4.015322 },
    { N: 1000, P1: 20.573562, P2: 3.200375, L2: 4.034589 },
    { N: 2000, P1: 23.870216, P2: 3.209275, L2: 4.04581 },
    { N: 3000, P1: 25.910222, P2: 3.212613, L2: 4.050018 },
    { N: 4000, P1: 27.407548, P2: 3.214402, L2: 4.052272 },
    { N: 5000, P1: 28.59749, P2: 3.215529, L2: 4.053693 },
    { N: 6000, P1: 29.58824, P2: 3.216309, L2: 4.054677 },
  ].map((r) => Object.freeze(r)),
);

// OLS slope of a + b log N (returns {a,b,r2}).
function olsLog(rows, yOf) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map(yOf);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  let sst = 0;
  let ssr = 0;
  for (let i = 0; i < n; i += 1) {
    sst += (ys[i] - my) ** 2;
    ssr += (a + b * xs[i] - ys[i]) ** 2;
  }
  return { a, b, r2: 1 - ssr / sst };
}

const p1Fit = olsLog(IMP96586_ROWS, (r) => r.P1);
const p2Fit = olsLog(IMP96586_ROWS, (r) => r.P2);

// FINDING 1 -- neither proxy predicts 0.3526; they bracket it.
export const IMP96586_PROXIES = Object.freeze({
  p1_rowSum: Object.freeze({
    definition: 'P1(N) = Sum_{k<=N} G_{1,k} = Sum I(1,k)/k (peak-row Gershgorin/Cesaro L1 mass)',
    slope: p1Fit.b, // ~4.7062
    intercept: p1Fit.a,
    r2: p1Fit.r2,
    ratioToMeasured: p1Fit.b / IMP96586_MEASURED_SLOPE, // ~13.35
    verdict: 'OVERSHOOTS the measured 0.3526 by ~13.35x -- a Gershgorin row-sum double-counts off-diagonal mass that eigenvalue cancellation removes.',
  }),
  p2_perronOneStep: Object.freeze({
    definition: 'R(N) = (G^2)_{11}/G_{11} = (1/I11) Sum_{k<=N} G_{1,k}^2 (Perron one-step Rayleigh from e_1)',
    slope: p2Fit.b, // ~0.0166
    intercept: p2Fit.a,
    r2: p2Fit.r2,
    ratioToMeasured: p2Fit.b / IMP96586_MEASURED_SLOPE, // ~0.047
    verdict: 'CONVERGES (3.16 -> 3.22): the peak row is Hilbert-Schmidt, so a single-mode mean-field surrogate predicts a BOUNDED edge, ratio 0.047 -- not log-growth.',
  }),
  measuredBetweenBrackets: true,
  note:
    'the measured slope 0.3526 lies strictly between the two mean-field brackets ' +
    '[0.0166, 4.7062] but is reproduced by NEITHER (~21x above the one-step estimate, ' +
    '~13x below the row-sum): no simple averaged-symbol collapse pins the coefficient.',
});

// FINDING 2 -- peak row is Hilbert-Schmidt; the log-growth is collective.
export const IMP96586_PEAKROW_HS = Object.freeze({
  quantity: 'Sum_{k<=N} G_{1,k}^2 (peak-row L2 / Hilbert-Schmidt mass)',
  first: IMP96586_ROWS[0].L2, // 3.9827 at N=250
  last: IMP96586_ROWS[IMP96586_ROWS.length - 1].L2, // 4.0547 at N=6000
  convergent: true,
  lastIncrement: IMP96586_ROWS[IMP96586_ROWS.length - 1].L2 - IMP96586_ROWS[IMP96586_ROWS.length - 2].L2,
  note:
    'the k=1 row is an ell^2 (Hilbert-Schmidt) vector (Sum G_{1,k}^2 -> ~4.055, increments ' +
    'shrink ~1/N), so any rank-one / peak-row / single-mode mean-field surrogate saturates ' +
    'to a finite edge. The measured 0.3526 log N is therefore a COLLECTIVE multi-index ' +
    'off-diagonal effect, not a single-mode quantity -- the regime where mean-field / ' +
    'averaged-symbol heuristics have no predictive content.',
});

export const IMP96586_VERDICT = Object.freeze({
  question:
    'does a heuristic mean-field / Cesaro average of the multiplicative Vasyunin kernel ' +
    'gcd(h,k) I(h/g,k/g)/(hk) predict the measured lam_max log-slope 0.3526, non-rigorously?',
  meanFieldPredictsCoefficient: false,
  rowSumRatio: p1Fit.b / IMP96586_MEASURED_SLOPE, // ~13.35
  perronOneStepRatio: p2Fit.b / IMP96586_MEASURED_SLOPE, // ~0.047
  peakRowHilbertSchmidt: true,
  anyBoundMoved: false,
  conclusion:
    'NO. The two natural single-mode mean-field proxies BRACKET 0.3526 (peak-row L1 sum ' +
    '13.35x high; Perron one-step Rayleigh 0.047x low, i.e. convergent because the peak row ' +
    'is Hilbert-Schmidt) but neither predicts it. The 0.3526 leading log-coefficient is a ' +
    'collective off-diagonal spectral-edge growth rate with no additive-Szego analog ' +
    '(imp-96562), no bounded limiting symbol (imp-96562), and now no mean-field / rank-one / ' +
    'averaged-symbol prediction. A pin (rigorous or heuristic) still needs a genuine ' +
    'multiplicative-Toeplitz / Dirichlet-Bohr spectral-edge asymptotic for an unbounded, ' +
    'non-rank-one operator, not available. Changes no bound; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96586_SUBGAP = Object.freeze({
  id: 'imp-96586-lammax-coefficient-is-collective-not-meanfield',
  statement:
    'the 0.3526 leading log-coefficient of the multiplicative Vasyunin lam_max is a ' +
    'COLLECTIVE off-diagonal effect: the peak row is Hilbert-Schmidt (Sum G_{1,k}^2 ' +
    'converges), so no rank-one / peak-row / averaged-symbol mean-field surrogate predicts ' +
    'it -- the two natural proxies bracket it by ~280x (13.35x high, 0.047x low). Together ' +
    'with imp-96562 (no additive Szego, unbounded edge) this closes the easy heuristic ' +
    'routes: what remains open is a multiplicative-Toeplitz / Dirichlet-Bohr spectral-edge ' +
    'growth-rate theorem for the unbounded non-rank-one operator, which is not available.',
});

export const IMP96586_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Heuristic assessment only: the mean-field ' +
  'proxies are reproducible peak-row (k=1) sums on the same exact Vasyunin V-table as ' +
  'imp-96105 / imp-96443 (tmp/imp-96586-meanfield.py); no rigor is claimed for any proxy, no ' +
  'bound is moved, and no operator positivity is established. The measured 0.3526 fit stands ' +
  'unchanged (imp-96443); this only shows mean-field heuristics do not predict its slope.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96586_ASSERTIONS = [
  {
    id: 'imp96586-rowsum-overshoots',
    holds: () =>
      IMP96586_PROXIES.p1_rowSum.ratioToMeasured > 10 &&
      IMP96586_PROXIES.p1_rowSum.r2 > 0.99 &&
      IMP96586_PROXIES.p1_rowSum.slope > 4 && IMP96586_PROXIES.p1_rowSum.slope < 5,
    why: 'the peak-row Gershgorin/Cesaro L1 mass grows as ~4.71 log N (R^2 > 0.99), a slope > 10x the measured 0.3526 -- the crude row-sum proxy overshoots.',
  },
  {
    id: 'imp96586-perron-onestep-converges',
    holds: () =>
      IMP96586_PROXIES.p2_perronOneStep.ratioToMeasured < 0.1 &&
      IMP96586_PROXIES.p2_perronOneStep.slope < 0.05,
    why: 'the Perron one-step Rayleigh has log-slope ~0.017 (ratio < 0.1): the peak row is Hilbert-Schmidt so a single-mode surrogate saturates to a bounded edge, not log-growth.',
  },
  {
    id: 'imp96586-measured-strictly-bracketed',
    holds: () =>
      IMP96586_PROXIES.p2_perronOneStep.slope < IMP96586_MEASURED_SLOPE &&
      IMP96586_MEASURED_SLOPE < IMP96586_PROXIES.p1_rowSum.slope &&
      IMP96586_PROXIES.measuredBetweenBrackets === true,
    why: 'the measured slope 0.3526 lies strictly between the two mean-field brackets [0.0166, 4.7062] but is reproduced by neither -- no averaged-symbol collapse pins it.',
  },
  {
    id: 'imp96586-peakrow-hilbert-schmidt',
    holds: () =>
      IMP96586_PEAKROW_HS.convergent === true &&
      IMP96586_PEAKROW_HS.lastIncrement > 0 &&
      IMP96586_PEAKROW_HS.lastIncrement < 0.002 &&
      IMP96586_PEAKROW_HS.last > IMP96586_PEAKROW_HS.first,
    why: 'Sum G_{1,k}^2 converges (~4.055, last increment < 0.002), so the peak row is an ell^2 vector: the 0.3526 log-growth is a collective multi-index effect, not a single-mode quantity.',
  },
  {
    id: 'imp96586-honesty-gate-no-qed',
    holds: () =>
      IMP96586_VERDICT.meanFieldPredictsCoefficient === false &&
      IMP96586_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96586_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96586_HONEST_BANNER) &&
      /RH open/.test(IMP96586_HONEST_BANNER) &&
      /collective-not-meanfield/.test(IMP96586_SUBGAP.id),
    why: 'heuristic assessment only: mean-field does not predict the coefficient, no bound moved, and the honesty markers plus the sharpened collective sub-gap are present.',
  },
];

for (const a of IMP96586_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96586-route-m-lammax-meanfield-cesaro-proxy assertion failed: ${a.id}`,
    );
  }
}

export default {
  c: IMP96586_C,
  i11: IMP96586_I11,
  measuredSlope: IMP96586_MEASURED_SLOPE,
  rows: IMP96586_ROWS,
  proxies: IMP96586_PROXIES,
  peakRowHS: IMP96586_PEAKROW_HS,
  verdict: IMP96586_VERDICT,
  subGap: IMP96586_SUBGAP,
  banner: IMP96586_HONEST_BANNER,
};
