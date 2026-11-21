/**
 * @module imp-96516-route-m-remainder-viz-data
 *
 * imp-96516 (ux): import-light viz-data leaf for the imp-96487 Route M
 * Burnol-ratio asymptotic-remainder model. imp-96487 fit a 21-rung
 * N=250..10000 ratio(N) ladder to three nested models and found the
 * decaying-oscillation remainder (MB) extrapolates a plateau c0~0.9846,
 * ~1.5 percent below the RH value 1, with forcing c0=1 inflating the rms by
 * ~1.85x-1.98x under every decay exponent p in {0,1,2}. It shipped only the
 * baked ladder/model objects, no chart. This module reshapes that data into
 * a plot-ready ladder series, a sampled fitted-curve series (the MB model
 * evaluated densely across the log-N window), and the three-exponent rms
 * comparison for a bar chart.
 *
 * No re-derivation: every N, ratio, c0, a, b, p, w and rms value is copied
 * verbatim from imp-96487. The only new arithmetic here is (1) sampling the
 * already-fitted MB curve at a dense grid of L values for a smooth plot line
 * and (2) computing logN = log(N) for each ladder rung (elementary, not a
 * re-fit). Changes no bound; establishes no operator positivity; RH open;
 * NO QED; no refereed bound is changed.
 *
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the source data this reshapes)
 *
 * Ticket: imp-96516 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no
 * bound; NO QED. No self-executing assertion throw (per the imp-96294 convention) --
 * values are validated below via a plain exported check object instead of an import-time
 * throw.
 */

import {
  IMP96487_LADDER,
  IMP96487_MODELS,
  IMP96487_LOGN_WINDOW,
  IMP96487_C0EQ1_TEST,
  IMP96487_HONEST_BANNER,
} from './imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js';

const MB = IMP96487_MODELS.decayingOscillation;

const mbValueAt = (L) => MB.c0 + Math.pow(L, -MB.p) * (MB.a * Math.cos(MB.w * L) + MB.b * Math.sin(MB.w * L));

export const IMP96516_LADDER_POINTS = IMP96487_LADDER.map((r) => ({
  N: r.N,
  logN: Math.log(r.N),
  ratio: r.ratio,
  src: r.src,
}));

// Dense sample of the already-fitted MB curve across the measured log-N window,
// for a smooth plot line (not a re-fit, just evaluating the fixed formula).
const FIT_SAMPLES = 240;
export const IMP96516_FITTED_CURVE = Array.from({ length: FIT_SAMPLES + 1 }, (_, i) => {
  const L = IMP96487_LOGN_WINDOW.Lmin + (i / FIT_SAMPLES) * IMP96487_LOGN_WINDOW.span;
  return { logN: L, N: Math.exp(L), ratio: mbValueAt(L) };
});

export const IMP96516_PLATEAU_LINE = Object.freeze({ c0: MB.c0, rhValue: 1 });

export const IMP96516_RMS_BARS = IMP96487_C0EQ1_TEST.byExponent.map((r) => ({
  p: r.p,
  rmsFreeC0: r.rmsFreeC0,
  rmsForcedOne: r.rmsForcedOne,
  rmsRatio: r.rmsRatio,
}));

export const IMP96516_HONEST_BANNER = IMP96487_HONEST_BANNER;

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96516_VALIDATION = Object.freeze({
  twentyOneRungs: IMP96516_LADDER_POINTS.length === 21,
  logNMonotonic: IMP96516_LADDER_POINTS.every(
    (p, i) => i === 0 || p.logN > IMP96516_LADDER_POINTS[i - 1].logN
  ),
  fittedCurveInBand: IMP96516_FITTED_CURVE.every((p) => p.ratio > 0.9 && p.ratio < 1.1),
  threeExponentBars: IMP96516_RMS_BARS.length === 3,
  everyBarForcedAboveFree: IMP96516_RMS_BARS.every((b) => b.rmsForcedOne > b.rmsFreeC0),
  plateauBelowOne: IMP96516_PLATEAU_LINE.c0 < IMP96516_PLATEAU_LINE.rhValue,
});
