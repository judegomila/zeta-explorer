/**
 * @module imp-96395-sigma-local-exponent-ramp-viz-data
 *
 * imp-96395 (ux, sonnet-4-6): chart-shaping layer for the imp-96351 sigma(N)
 * post-peak local-exponent ramp on the tenth-decade grid across [1e9,1e12],
 * marking the single D2 (acceleration) zero-crossing knee at log10 N* ~ 9.529.
 *
 * imp-96351 only bakes the summary scalars (kneeLog10Nstar, sign-change count,
 * width sweep) -- it does NOT export the bracket-level p_dec/D1/D2 series a
 * ramp chart needs. The sigma(N)/olsExponentLog10/kneeOnGrid logic below is
 * copied verbatim from imp-96351 (identical sub-terms, identical OLS
 * estimator, no fresh model); the only new work is re-running that exact
 * grid once more here to expose the per-bracket series for the chart.
 *
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability.js (source measurement, method, verdict)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP96351_SIGMA_KNEE_TENTHDECADE_1E12_STABILITY } from './imp-96351-sigma-knee-tenthdecade-1e12-stability.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT imp-96351 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// Identical OLS local-exponent estimator to imp-96351.
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// Identical tenth-decade primary grid to imp-96351 (W=0.1, 100 pts/decade, [1e9,1e12]).
const WIDE_LO_D = 9.0;
const WIDE_HI_D = 12.0;
const W_PRIMARY = 0.1;
const PPD_PRIMARY = 100;

const edges = [];
for (let d = WIDE_LO_D; d <= WIDE_HI_D + 1e-9; d += W_PRIMARY) edges.push(+d.toFixed(6));

const BRACKETS = [];
for (let i = 0; i < edges.length - 1; i++) {
  const cen = (edges[i] + edges[i + 1]) / 2;
  BRACKETS.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], PPD_PRIMARY) });
}

const D1 = [];
for (let i = 1; i < BRACKETS.length; i++) {
  D1.push({ cen: (BRACKETS[i].cen + BRACKETS[i - 1].cen) / 2, d1: BRACKETS[i].p - BRACKETS[i - 1].p });
}

const D2 = [];
for (let i = 1; i < D1.length; i++) {
  D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
}

function interpAt(series, valueKey, d) {
  for (let i = 0; i < series.length - 1; i += 1) {
    if (d >= series[i].cen && d <= series[i + 1].cen) {
      const t = (d - series[i].cen) / (series[i + 1].cen - series[i].cen);
      return series[i][valueKey] + t * (series[i + 1][valueKey] - series[i][valueKey]);
    }
  }
  return series[series.length - 1][valueKey];
}

const { kneeLog10Nstar, kneeNstar, primaryNumSubBrackets, primaryNumSignChanges, verdict } =
  IMP96351_SIGMA_KNEE_TENTHDECADE_1E12_STABILITY;

export const IMP96395_RAMP = Object.freeze(
  BRACKETS.map((b) => Object.freeze({ log10N: b.cen, exponent: b.p })),
);

export const IMP96395_D2 = Object.freeze(
  D2.map((r) => Object.freeze({ log10N: r.cen, acceleration: r.d2 })),
);

export const IMP96395_KNEE = Object.freeze({
  log10N: kneeLog10Nstar,
  N: kneeNstar,
  exponent: +interpAt(BRACKETS, 'p', kneeLog10Nstar).toFixed(6),
  acceleration: +interpAt(D2, 'd2', kneeLog10Nstar).toFixed(6),
});

export const IMP96395_RAMP_AXIS = Object.freeze({
  log10NMin: WIDE_LO_D,
  log10NMax: WIDE_HI_D,
  exponentMin: Math.min(...BRACKETS.map((b) => b.p)),
  exponentMax: Math.max(...BRACKETS.map((b) => b.p)),
});

export const IMP96395_D2_AXIS = Object.freeze({
  log10NMin: WIDE_LO_D,
  log10NMax: WIDE_HI_D,
  accelerationMin: Math.min(...D2.map((r) => r.d2)),
  accelerationMax: Math.max(...D2.map((r) => r.d2)),
});

export const IMP96395_SUMMARY = Object.freeze({
  windowLabel: '[1e9,1e12]',
  widthDecades: W_PRIMARY,
  ptsPerDecade: PPD_PRIMARY,
  primaryNumSubBrackets,
  primaryNumSignChanges,
});

export const IMP96395_HONEST_BANNER = verdict;
