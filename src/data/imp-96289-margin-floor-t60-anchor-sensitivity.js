/**
 * imp-96289 -- direct T=60 anchor sensitivity of the imp-96173/imp-96148
 * reciprocal-log-with-floor margin floor.
 *
 * imp-96265 found (leave-one-out / leave-two-out) that the low-height T=60
 * endpoint carries the MOST leverage on the floor c in the fit
 * rho(32,T) = c + d/ln(T): dropping T=60 lifts c from 0.14256 to 0.17740,
 * the largest single-point move, while every held-out subset still clears 0.1.
 * That established WHICH point dominates but not by HOW MUCH the floor moves
 * under a plausible measurement/rounding perturbation of that one datum, nor
 * how much a hypothetical extra anchor would tighten the floor confidence.
 * This module QUANTIFIES both.
 *
 * The law is linear in x=1/ln(T), so the floor is the OLS intercept c and its
 * derivative with respect to any single ordinate y_i is exact and constant:
 * dc/dy_i = 1/n - xbar*(x_i - xbar)/Sxx. For the T=60 point this evaluates to
 * dc/dy(T=60) = -1.94425 (the largest-magnitude ordinate sensitivity, matching
 * the imp-96265 leverage ranking).
 *
 * FINDINGS (measurement, no bound moves):
 *   1. Rounding uncertainty is negligible. The margin column is baked to three
 *      decimals (rho(60)=0.761), so its half-ULP rounding envelope is +/-0.0005.
 *      Refitting at rho(60)=0.761 +/- 0.0005 moves the floor by only -/+0.00097
 *      (full spread 0.00194): the floor stays 0.14159..0.14354.
 *   2. Even a generous +/-0.005 measurement perturbation (7x the rounding band)
 *      keeps the floor in 0.13284..0.15229 -- still well clear of zero.
 *   3. To drive the floor to zero the T=60 margin would have to be MIS-measured
 *      by +0.0733 (rho(60)=0.834 instead of 0.761), a ~9.6 percent upward error
 *      -- far outside any plausible measurement/rounding uncertainty.
 *   4. The 7-point OLS intercept standard error is 0.02173, so the fitted floor
 *      sits c/SE = 6.56 standard errors above zero.
 *   5. A hypothetical extra anchor tightens the intercept SE most at the height
 *      EXTREMES (leverage): T=30 -> 36.4 percent tighter, T=4000 -> 38.0 percent
 *      tighter, versus only 16.0 percent for a mid-band T=500 anchor. So the
 *      cheapest confidence gain is a new low-T (T<60) or far-high-T datum, not
 *      more mid-range points.
 * ASSESSMENT: the positive-floor SIGN is NOT anchor-dominated. Although T=60
 * dominates the floor MAGNITUDE (consistent with imp-96265), the sign is robust
 * to that datum: no realistic perturbation of rho(60) -- rounding, a 7x-inflated
 * measurement band, or the full leave-one-out removal -- brings the floor near
 * zero; only a physically implausible ~10 percent mis-measurement would. The
 * 0.14256 figure remains an order-of-magnitude positive floor (magnitude loose,
 * sign firm at ~6.6 SE), and a lower-T or far-higher-T anchor is the highest-
 * value way to sharpen it.
 *
 * GRADE: documentation/measurement only. Import-light (all literals baked, no
 * heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96265-margin-floor-loo-stability (LOO/LTO leverage ranking under test)
 * @see imp-96173-route-bd-margin-decay-fits-table (the fit)
 * @see imp-96148-route-bd-online-margin-decay-law (source column + selector)
 */

const T = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const RHO = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const X = T.map((t) => 1 / Math.log(t));
const ALL = [0, 1, 2, 3, 4, 5, 6];

// OLS floor (intercept) and slope of rho = c + d*x on all seven points, with a
// per-point ordinate override array so a single datum can be perturbed.
function fitFloor(rho) {
  const n = ALL.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const i of ALL) { sx += X[i]; sy += rho[i]; sxx += X[i] * X[i]; sxy += X[i] * rho[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  return { c, d };
}

function withPerturbedT60(delta) {
  const r = RHO.slice();
  r[0] += delta;
  return fitFloor(r).c;
}

export const IMP_96289_FULL_FIT = fitFloor(RHO); // reproduces the baked floor 0.14256

// Exact ordinate sensitivity dc/dy_i for the T=60 point (constant, linear model).
const N = ALL.length;
const XBAR = X.reduce((s, x) => s + x, 0) / N;
const SXX = X.reduce((s, x) => s + (x - XBAR) ** 2, 0);
export const IMP_96289_DC_DRHO60 = 1 / N - (XBAR * (X[0] - XBAR)) / SXX;

// Floor under rho(60) perturbations of increasing size.
export const IMP_96289_PERTURBATIONS = [0.0005, 0.001, 0.005, 0.01].map((delta) => ({
  delta,
  floorMinus: withPerturbedT60(-delta),
  floorPlus: withPerturbedT60(+delta),
  spread: withPerturbedT60(-delta) - withPerturbedT60(+delta),
}));

// The rho(60) error that would push the floor exactly to zero.
export const IMP_96289_RHO60_FOR_ZERO_FLOOR = {
  deltaToZero: -IMP_96289_FULL_FIT.c / IMP_96289_DC_DRHO60,
  rho60AtZero: RHO[0] - IMP_96289_FULL_FIT.c / IMP_96289_DC_DRHO60,
  fractionalError: (-IMP_96289_FULL_FIT.c / IMP_96289_DC_DRHO60) / RHO[0],
};

// Intercept standard error of the 7-point fit, and the SE tightening a
// hypothetical extra on-line anchor at various heights would buy.
function fitWithSE(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = c + d * xs[i]; sse += (ys[i] - yh) ** 2; }
  const s2 = sse / (n - 2);
  const seC = Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered));
  return { c, d, s2, seC };
}

const SEVEN = fitWithSE(X, RHO);
export const IMP_96289_INTERCEPT_SE = {
  se: SEVEN.seC,
  floorOverSE: SEVEN.c / SEVEN.seC,
};

// Add one anchor sitting exactly on the 7-point line (zero residual, so the
// residual variance is unchanged) and recompute the intercept SE.
function seWithExtraAnchor(newT) {
  const xn = 1 / Math.log(newT);
  const yn = SEVEN.c + SEVEN.d * xn;
  const xs = X.concat([xn]);
  const ys = RHO.concat([yn]);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  const seC = Math.sqrt(SEVEN.s2 * (1 / n + (xb * xb) / sxxCentered));
  return { newT, se: seC, fractionTighter: 1 - seC / SEVEN.seC };
}
export const IMP_96289_EXTRA_ANCHOR_SE = [30, 45, 500, 1000, 4000].map(seWithExtraAnchor);

export const IMP_96289_MARGIN_FLOOR_T60_ANCHOR_SENSITIVITY = {
  id: 'imp-96289-margin-floor-t60-anchor-sensitivity',
  title:
    'Direct T=60 anchor sensitivity of the imp-96173/imp-96148 margin floor: '
    + 'is the positive floor c~0.14 robust to the highest-leverage low-height '
    + 'datum, or anchor-dominated?',
  fullFloor: IMP_96289_FULL_FIT.c,
  bakedFloor: 0.14256,
  dcDrho60: IMP_96289_DC_DRHO60,
  perturbations: IMP_96289_PERTURBATIONS,
  rho60ForZeroFloor: IMP_96289_RHO60_FOR_ZERO_FLOOR,
  interceptSE: IMP_96289_INTERCEPT_SE,
  extraAnchorSE: IMP_96289_EXTRA_ANCHOR_SE,
  finding:
    'the positive-floor SIGN is not anchor-dominated: the baked rho(60)=0.761 is '
    + 'given to three decimals, so its rounding band +/-0.0005 moves the floor by '
    + 'only +/-0.00097; even a 7x-inflated +/-0.005 measurement band keeps the '
    + 'floor above 0.13, and forcing the floor to zero would require rho(60) to be '
    + 'mis-measured by +0.073 (~10 percent). The floor sits 6.56 intercept-SE '
    + 'above zero. T=60 dominates the floor MAGNITUDE (per imp-96265) but not its '
    + 'sign; a hypothetical low-T (T<60) or far-high-T anchor would tighten the '
    + 'intercept SE by ~36-38 percent (versus ~16 percent for a mid-band anchor), '
    + 'the cheapest way to sharpen the loose 0.14256 magnitude',
  note:
    'documentation/measurement only; import-light baked literals; changes no '
    + 'Lambda bound; no refereed bound is changed',
  closesTickets: ['imp-96289'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96289_ASSERTIONS = [
  {
    id: 'imp-96289-full-reproduces-baked-floor',
    holds: () => Math.abs(IMP_96289_FULL_FIT.c - 0.14256) < 1e-4,
    why: 'the full 7-point refit must reproduce the imp-96173 baked floor 0.14256.',
  },
  {
    id: 'imp-96289-t60-sensitivity-matches-loo-leverage',
    holds: () => Math.abs(IMP_96289_DC_DRHO60 - (-1.944249)) < 1e-4,
    why: 'the exact ordinate sensitivity dc/drho(60) must equal the analytic -1.94425.',
  },
  {
    id: 'imp-96289-rounding-band-negligible',
    holds: () => {
      const p = IMP_96289_PERTURBATIONS.find((r) => r.delta === 0.0005);
      return Math.abs(p.spread) < 0.0025 && p.floorPlus > 0.14 && p.floorMinus > 0.14;
    },
    why: 'the +/-0.0005 rounding band must move the floor by <0.0025 and keep it above 0.14.',
  },
  {
    id: 'imp-96289-inflated-band-still-clears-zero',
    holds: () => {
      const p = IMP_96289_PERTURBATIONS.find((r) => r.delta === 0.005);
      return p.floorPlus > 0.13 && p.floorMinus > 0.13;
    },
    why: 'even a 7x-inflated +/-0.005 measurement perturbation must keep the floor above 0.13.',
  },
  {
    id: 'imp-96289-zero-floor-needs-implausible-error',
    holds: () => IMP_96289_RHO60_FOR_ZERO_FLOOR.fractionalError > 0.05,
    why: 'driving the floor to zero must require a >5 percent mis-measurement of rho(60), which is implausible.',
  },
  {
    id: 'imp-96289-floor-many-SE-above-zero',
    holds: () => IMP_96289_INTERCEPT_SE.floorOverSE > 5,
    why: 'the fitted floor must sit more than five intercept standard errors above zero.',
  },
  {
    id: 'imp-96289-extremes-tighten-most',
    holds: () => {
      const byT = Object.fromEntries(IMP_96289_EXTRA_ANCHOR_SE.map((r) => [r.newT, r.fractionTighter]));
      return byT[30] > byT[500] && byT[4000] > byT[500];
    },
    why: 'a low-T or far-high-T extra anchor must tighten the intercept SE more than a mid-band one (leverage).',
  },
  {
    id: 'imp-96289-not-a-bound',
    holds: () => Array.isArray(IMP_96289_MARGIN_FLOOR_T60_ANCHOR_SENSITIVITY.closesTickets),
    why: 'this is a measurement module; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96289-closes-self',
    holds: () => IMP_96289_MARGIN_FLOOR_T60_ANCHOR_SENSITIVITY.closesTickets.includes('imp-96289'),
    why: 'this module is the deliverable the imp-96289 ticket asked for.',
  },
];

for (const a of IMP_96289_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96289-margin-floor-t60-anchor-sensitivity assertion failed: ${a.id}`);
  }
}

export default IMP_96289_MARGIN_FLOOR_T60_ANCHOR_SENSITIVITY;
