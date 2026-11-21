/**
 * @module imp-96612-route-m-lammax-rankr-power-iteration-bracket
 *
 * imp-96612 (numerical, HEURISTIC ASSESSMENT ONLY): imp-96586 measured two rank-ONE
 * mean-field proxies of the Vasyunin lam_max on the k=1 peak row and found they
 * BRACKET the measured leading log-slope b_meas = 0.3526 (imp-96443) by ~280x but
 * predict it with NEITHER: (P1) peak-row Gershgorin/Cesaro L1 row-sum slope 4.7062
 * (13.35x high) and (P2) one-step Perron Rayleigh R = m_2/m_1 slope 0.0166 (0.047x
 * low, convergent because the peak row is Hilbert-Schmidt). imp-96586 FINDING 2 showed
 * the log-growth is a genuinely COLLECTIVE multi-index off-diagonal effect. This ticket
 * asks the NEXT question: does an r-step power-iteration / rank-r Rayleigh surrogate from
 * the peak basis vector e_1 NARROW the bracket toward 0.3526 as r grows, and how many
 * collective modes r does the log-coefficient need?
 *
 * WHAT WAS DONE (tmp/imp-96612-rankr-power.py, reproducible; same exact Vasyunin V-table
 * V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q) and I_coprime and full Gram
 * G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) as imp-96105 / imp-96443 / imp-96586):
 * build the exact Gram on the imp-96443 ladder N = 250..6000 and, at each rung, form the
 * MOMENT RATIOS
 *     R_r(N) = m_{r+1}(N) / m_r(N),   m_j(N) = (G_N^j)_{11} = <e_1, G_N^j e_1>,
 * i.e. the Rayleigh quotient after r matvecs (r power-iteration steps) from the peak basis
 * vector e_1. By SPD power/Lanczos theory R_r increases monotonically to lam_max as r grows,
 * so its log-slope b_r must climb from ~0 (r=0, frozen diagonal I11) toward b_meas = 0.3526.
 * r=0 is the frozen diagonal proxy (imp-96548 value 1.2607), r=1 reproduces the imp-96586 P2
 * rank-one one-step Rayleigh (slope 0.0166). We fit b_r for r = 0..11 and measure the rate.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the rank-r power iteration DOES narrow toward 0.3526 (monotone from below).
 * -------------------------------------------------------------------------------
 * The moment-ratio log-slopes b_r climb monotonically and converge smoothly to 0.3526:
 *   r=0  b=0.00000  (0.000x)  frozen diagonal I11 = 1.2607, no log-growth
 *   r=1  b=0.01661  (0.047x)  == imp-96586 P2 rank-one one-step Rayleigh (cross-check)
 *   r=2  b=0.09286  (0.263x)
 *   r=3  b=0.19357  (0.549x)
 *   r=4  b=0.26902  (0.763x)  first within 25% of 0.3526
 *   r=5  b=0.31228  (0.886x)
 *   r=6  b=0.33404  (0.947x)  first within 10% of 0.3526
 *   r=7  b=0.34429  (0.976x)
 *   r=8  b=0.34894  (0.990x)
 *   r=11 b=0.35232  (0.9991x)
 * So the rank-r power-iteration surrogate NARROWS the imp-96586 bracket toward 0.3526 as r
 * grows -- unlike the rank-one one-step (r=1) it approaches the true slope, and unlike the
 * Gershgorin row-sum (which is NOT a power-iteration iterate) it converges from below rather
 * than overshooting. This is expected in direction (R_r -> lam_max) -- the CONTENT is the RATE.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the coefficient needs ~6 collective modes; it is NOT low-rank.
 * -------------------------------------------------------------------------------
 * The rate quantifies imp-96586 FINDING 2. A rank-one surrogate (r<=1) captures at most
 * 4.7% of the slope; reaching within 25% needs r>=4 and within 10% needs r>=6 collective
 * power-iteration modes; r~11 lands within 0.1%. So the 0.3526 log-coefficient is built by
 * accumulating ~6 collective off-diagonal modes, not one -- exactly the regime imp-96586 named.
 * The fit quality R^2 also climbs (0.906 at r=1 -> 0.995 at r=11) as the clean a + b log N
 * shape emerges only once enough modes accumulate, consistent with the imp-96562 note that
 * the imp-96443 ladder is ~2x pre-asymptotic.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * YES (with the honest caveat). An r-step power-iteration / rank-r Rayleigh surrogate from
 * e_1 DOES bracket 0.3526 tighter than the rank-one [0.0166, 4.7062] and converges to it as
 * r grows -- but only because R_r -> lam_max by construction, so this is not an independent
 * prediction of the coefficient; it is a MEASUREMENT of its collective rank. The content is
 * the RATE: ~6 collective modes reach 90% and ~4 reach 75%, quantifying imp-96586 FINDING 2
 * that the coefficient is a collective (not single-mode / not low-rank) off-diagonal effect.
 * It still gives NO closed-form / averaged-symbol / multiplicative-Toeplitz asymptotic for the
 * coefficient (the surrogate needs the operator itself to r matvecs). This SHARPENS
 * IMP96562_SUBGAP with a mode count; it does NOT close it. Changes no bound; no operator
 * positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96586-route-m-lammax-meanfield-cesaro-proxy.js (rank-one brackets, peak row Hilbert-Schmidt)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (localizes IMP96562_SUBGAP)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured lam_max = 3.0247 + 0.3526 log N fit)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (frozen-diagonal value 1.2607 = r=0)
 *
 * Ticket: imp-96612 (numerical, opus-4-8, api-pool). Heuristic assessment only; NO QED.
 */

// imp-96443 measured lam_max leading log-slope this assessment targets.
export const IMP96612_MEASURED_SLOPE = 0.3526253785070698;

// I(1,1) = 2C frozen dominant Gram diagonal (== r=0 moment-ratio value, no log-growth).
export const IMP96612_I11 = 1.2606614015078126;

// r-step power-iteration / rank-r Rayleigh moment-ratio log-slopes b_r fitted on the
// imp-96443 ladder N = 250..6000 (tmp/imp-96612-rankr-power.py). R_r(N) = m_{r+1}/m_r,
// m_j = (G_N^j)_{11} = <e_1, G_N^j e_1>; r matvecs (power-iteration steps) from e_1.
// slope = OLS log-slope of R_r(N); ratio = slope/0.3526; r2 = fit R^2; last6000 = R_r(6000).
export const IMP96612_RANKR_SLOPES = Object.freeze(
  [
    { r: 0, slope: 0.0, ratio: 0.0, r2: 1.0, last6000: 1.260661 },
    { r: 1, slope: 0.01661333, ratio: 0.047113, r2: 0.905998, last6000: 3.216309 },
    { r: 2, slope: 0.09286438, ratio: 0.263351, r2: 0.94686, last6000: 4.623061 },
    { r: 3, slope: 0.19357364, ratio: 0.54895, r2: 0.971928, last6000: 5.371837 },
    { r: 4, slope: 0.26902421, ratio: 0.762918, r2: 0.98448, last6000: 5.74368 },
    { r: 5, slope: 0.31227912, ratio: 0.885583, r2: 0.990305, last6000: 5.91899 },
    { r: 6, slope: 0.33404105, ratio: 0.947297, r2: 0.992993, last6000: 5.998708 },
    { r: 7, slope: 0.34428597, ratio: 0.976351, r2: 0.994255, last6000: 6.034215 },
    { r: 8, slope: 0.34894019, ratio: 0.989549, r2: 0.994856, last6000: 6.049861 },
    { r: 9, slope: 0.35101219, ratio: 0.995425, r2: 0.995143, last6000: 6.05672 },
    { r: 10, slope: 0.35192347, ratio: 0.998009, r2: 0.995279, last6000: 6.059719 },
    { r: 11, slope: 0.35232119, ratio: 0.999137, r2: 0.995343, last6000: 6.061029 },
  ].map((row) => Object.freeze(row)),
);

// imp-96586 rank-one bracket the rank-r ladder is compared against.
export const IMP96612_RANKONE_BRACKET = Object.freeze({
  perronOneStepSlope: 0.016613, // imp-96586 P2 == this ladder r=1 (cross-check)
  rowSumSlope: 4.7062, // imp-96586 P1 peak-row Gershgorin/Cesaro L1 (NOT a power iterate)
  measuredBetween: true,
  note:
    'imp-96586 rank-one proxies [0.0166, 4.7062] bracket 0.3526 by ~280x and predict it with ' +
    'neither; the rank-r moment ratios climb monotonically from the r=1 one-step (0.0166) to ' +
    '0.3526, converging from below rather than straddling it.',
});

// FINDING -- how many collective power-iteration modes the coefficient needs.
const firstWithin = (frac) =>
  IMP96612_RANKR_SLOPES.find((row) => Math.abs(row.ratio - 1) <= frac);
const within25 = firstWithin(0.25);
const within10 = firstWithin(0.1);
const deepest = IMP96612_RANKR_SLOPES[IMP96612_RANKR_SLOPES.length - 1];

export const IMP96612_MODE_COUNT = Object.freeze({
  firstRWithin25pct: within25 ? within25.r : null, // 4
  firstRWithin10pct: within10 ? within10.r : null, // 6
  rankOneCapturesFrac: IMP96612_RANKR_SLOPES[1].ratio, // 0.047 -- r=1 gets <5%
  deepestR: deepest.r,
  deepestSlope: deepest.slope,
  deepestRatio: deepest.ratio,
  monotoneClimb: IMP96612_RANKR_SLOPES.every(
    (row, i) => i === 0 || row.slope >= IMP96612_RANKR_SLOPES[i - 1].slope - 1e-9,
  ),
  note:
    'a rank-one surrogate (r<=1) captures <=4.7% of the 0.3526 slope; reaching within 25% ' +
    'needs r>=4 and within 10% needs r>=6 collective power-iteration modes; r~11 lands within ' +
    '0.1%. So the coefficient is built by accumulating ~6 collective off-diagonal modes, not ' +
    'one -- a quantitative confirmation of imp-96586 FINDING 2 (collective, not single-mode).',
});

export const IMP96612_VERDICT = Object.freeze({
  question:
    'does an r-step power-iteration / rank-r Rayleigh surrogate from the peak basis vector e_1 ' +
    'bracket the 0.3526 Vasyunin lam_max log-slope tighter than the rank-one [0.0166, 4.7062], ' +
    'and how many collective modes does the log-coefficient need?',
  rankRNarrowsBracket: true,
  convergesFromBelow: true,
  independentPredictionOfCoefficient: false, // R_r -> lam_max by construction, not a new pin
  collectiveModeCountFor90pct: within10 ? within10.r : null, // 6
  anyBoundMoved: false,
  conclusion:
    'YES (with caveat). The rank-r moment ratios R_r(N) = m_{r+1}/m_r narrow the imp-96586 ' +
    'rank-one bracket toward 0.3526 monotonically from below, but only because R_r -> lam_max ' +
    'by SPD power/Lanczos theory -- so this MEASURES the collective rank of the coefficient, it ' +
    'does not independently PREDICT it. The content is the rate: ~6 collective modes reach 90% ' +
    'and ~4 reach 75%, quantifying imp-96586 FINDING 2 that the 0.3526 leading log-coefficient ' +
    'is a collective (not single-mode / not low-rank) off-diagonal spectral-edge growth rate. ' +
    'It gives NO closed-form / averaged-symbol / multiplicative-Toeplitz asymptotic; it needs ' +
    'the operator itself to r matvecs. Sharpens IMP96562_SUBGAP with a mode count; does not ' +
    'close it. Changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96612_SUBGAP = Object.freeze({
  id: 'imp-96612-lammax-coefficient-needs-6-collective-power-iteration-modes',
  statement:
    'the 0.3526 leading log-coefficient of the multiplicative Vasyunin lam_max is a COLLECTIVE ' +
    'rank-~6 quantity: the r-step power-iteration moment ratios R_r(N) = (G^{r+1})_11/(G^r)_11 ' +
    'from e_1 have log-slopes climbing monotonically 0 -> 0.0166 (r=1) -> 0.3526, reaching ' +
    'within 25% at r=4 and within 10% at r=6, so a rank-one surrogate captures <5% and ~6 ' +
    'collective off-diagonal modes are needed for 90%. This quantifies imp-96586 FINDING 2 but ' +
    'still gives no closed-form pin: what remains open is a multiplicative-Toeplitz / ' +
    'Dirichlet-Bohr spectral-edge growth-rate theorem for the unbounded non-rank-one operator.',
});

export const IMP96612_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Heuristic assessment only: the rank-r moment ' +
  'ratios are reproducible power-iteration iterates from e_1 on the same exact Vasyunin Gram as ' +
  'imp-96105 / imp-96443 / imp-96586 (tmp/imp-96612-rankr-power.py). By construction R_r -> ' +
  'lam_max, so the convergence to 0.3526 is a measurement of the coefficient collective rank, ' +
  'NOT an independent prediction; no rigor is claimed, no bound is moved, no operator positivity ' +
  'is established. The measured 0.3526 fit stands unchanged (imp-96443).';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96612_ASSERTIONS = [
  {
    id: 'imp96612-rankone-matches-imp96586-p2',
    holds: () =>
      Math.abs(IMP96612_RANKR_SLOPES[1].slope - IMP96612_RANKONE_BRACKET.perronOneStepSlope) < 5e-6 &&
      IMP96612_RANKR_SLOPES[0].slope === 0.0,
    why: 'the r=1 moment ratio reproduces the imp-96586 P2 one-step Rayleigh slope 0.0166 and r=0 is the frozen diagonal (no log-growth) -- the rank-r ladder correctly extends the rank-one proxies.',
  },
  {
    id: 'imp96612-slopes-monotone-climb-to-measured',
    holds: () =>
      IMP96612_MODE_COUNT.monotoneClimb === true &&
      IMP96612_RANKR_SLOPES[IMP96612_RANKR_SLOPES.length - 1].ratio > 0.99 &&
      IMP96612_RANKR_SLOPES[IMP96612_RANKR_SLOPES.length - 1].ratio < 1.01,
    why: 'the moment-ratio log-slopes climb monotonically from below and reach within 1% of the measured 0.3526 by r=11 -- the rank-r surrogate narrows the bracket toward the true slope.',
  },
  {
    id: 'imp96612-collective-mode-count',
    holds: () =>
      IMP96612_MODE_COUNT.firstRWithin25pct === 4 &&
      IMP96612_MODE_COUNT.firstRWithin10pct === 6 &&
      IMP96612_MODE_COUNT.rankOneCapturesFrac < 0.05,
    why: 'a rank-one surrogate (r<=1) captures <5% of the slope; within 25% needs r>=4 and within 10% needs r>=6 collective modes -- quantifies imp-96586 FINDING 2 that the coefficient is collective, not single-mode.',
  },
  {
    id: 'imp96612-honesty-gate-no-qed',
    holds: () =>
      IMP96612_VERDICT.rankRNarrowsBracket === true &&
      IMP96612_VERDICT.independentPredictionOfCoefficient === false &&
      IMP96612_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96612_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96612_HONEST_BANNER) &&
      /RH open/.test(IMP96612_HONEST_BANNER) &&
      /6-collective-power-iteration-modes/.test(IMP96612_SUBGAP.id),
    why: 'heuristic assessment only: the rank-r ladder narrows the bracket but is not an independent coefficient prediction (R_r -> lam_max by construction), no bound moved, and the honesty markers plus the sharpened mode-count sub-gap are present.',
  },
];

for (const a of IMP96612_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96612-route-m-lammax-rankr-power-iteration-bracket assertion failed: ${a.id}`,
    );
  }
}

export default {
  measuredSlope: IMP96612_MEASURED_SLOPE,
  i11: IMP96612_I11,
  rankrSlopes: IMP96612_RANKR_SLOPES,
  rankOneBracket: IMP96612_RANKONE_BRACKET,
  modeCount: IMP96612_MODE_COUNT,
  verdict: IMP96612_VERDICT,
  subGap: IMP96612_SUBGAP,
  banner: IMP96612_HONEST_BANNER,
};
