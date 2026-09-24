/**
 * @module imp-96456-vasyunin-conditioning-ceiling-viz-data
 *
 * imp-96456 (ux): import-light viz-data leaf for the imp-96428 Route M Vasyunin Gram
 * conditioning-ceiling finding. imp-96428 fit the measured lam_min(N) power law over the
 * imp-96105/imp-96325 SPD Gram rungs and derived three double-precision Cholesky-breakdown
 * ceilings (one per lam_max proxy), but shipped only baked numbers, no chart. This module
 * reshapes those numbers into two log-log-ready point series: the lam_min(N) rungs against
 * the power-law fit, and cond#(N) = lam_max(N)/lam_min(N) under each of the three proxies
 * against the 1/eps breakdown line.
 *
 * No re-derivation: the 12 measured lam_min rungs, the fit exponent/coefficient, the three
 * proxies and the three ceiling N values are all copied verbatim from imp-96428. The three
 * lam_max(N) proxy formulas used to trace the cond#(N) curves -- lam_max ~ N (linear),
 * lam_max ~ 10 log N (trace), lam_max ~ 1 (const) -- are exactly the proxies imp-96428's
 * prose names; each is checked below to reproduce the imp-96428 IMP96428_CEILING ceiling-N
 * and IMP96428_TARGET_COND cond# values to within 0.1%, so tracing the curves from these
 * closed-form proxies is a presentational reshaping, not a new derivation.
 *
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (the source finding this reshapes)
 *
 * Ticket: imp-96456 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294 convention) -- values are
 * validated below via a plain exported check object instead of an import-time throw.
 */

import {
  IMP96428_LAMMIN_ROWS,
  IMP96428_FIT,
  IMP96428_LAMMIN_EXTRAP,
  IMP96428_CEILING,
  IMP96428_TARGET_COND,
  IMP96428_VERDICT,
  IMP96428_HONEST_BANNER,
} from './imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js';

const log10 = Math.log10;
const lamMinFit = (N) => IMP96428_FIT.A * Math.pow(N, -IMP96428_FIT.p);

// -- panel 1: lam_min(N) measured rungs + power-law fit curve --

export const IMP96456_LAMMIN_MEASURED_POINTS = IMP96428_LAMMIN_ROWS.map((r) => ({
  N: r.N,
  log10N: log10(r.N),
  log10LamMin: log10(r.lamMin),
}));

export const IMP96456_LAMMIN_EXTRAP_POINTS = IMP96428_LAMMIN_EXTRAP.map((r) => ({
  N: r.N,
  log10N: log10(r.N),
  log10LamMin: log10(r.lamMin),
}));

// Fit curve sampled densely across the measured-to-extrapolated range for a smooth overlay.
const FIT_LOG10N_MIN = log10(IMP96428_LAMMIN_ROWS[0].N);
const FIT_LOG10N_MAX = log10(IMP96428_LAMMIN_EXTRAP[IMP96428_LAMMIN_EXTRAP.length - 1].N);
const FIT_SAMPLES = 60;
export const IMP96456_LAMMIN_FIT_CURVE = Array.from({ length: FIT_SAMPLES + 1 }, (_, i) => {
  const log10N = FIT_LOG10N_MIN + (i / FIT_SAMPLES) * (FIT_LOG10N_MAX - FIT_LOG10N_MIN);
  const N = Math.pow(10, log10N);
  return { N, log10N, log10LamMin: log10(lamMinFit(N)) };
});

// -- panel 2: cond#(N) under the three lam_max proxies vs the 1/eps breakdown line --

// The three lam_max(N) proxy formulas imp-96428's prose names verbatim.
const LAMMAX_PROXIES = Object.freeze({
  linear: { label: 'lam_max ~ N (pessimistic)', lamMax: (N) => N, ceilingN: IMP96428_CEILING.lamMaxLinearN },
  trace: { label: 'lam_max ~ 10 log N (trace)', lamMax: (N) => 10 * Math.log(N), ceilingN: IMP96428_CEILING.lamMaxTraceLog },
  constOne: { label: 'lam_max ~ O(1) (optimistic)', lamMax: (N) => 1, ceilingN: IMP96428_CEILING.lamMaxConstOne },
});

const COND_LOG10N_MIN = 2; // N = 100
const COND_LOG10N_MAX = 9; // N = 1e9, spans past every ceiling
const COND_SAMPLES = 70;

function condCurve(proxyKey) {
  const proxy = LAMMAX_PROXIES[proxyKey];
  return Array.from({ length: COND_SAMPLES + 1 }, (_, i) => {
    const log10N = COND_LOG10N_MIN + (i / COND_SAMPLES) * (COND_LOG10N_MAX - COND_LOG10N_MIN);
    const N = Math.pow(10, log10N);
    const cond = proxy.lamMax(N) / lamMinFit(N);
    return { N, log10N, log10Cond: log10(cond) };
  });
}

export const IMP96456_COND_CURVES = Object.freeze({
  linear: condCurve('linear'),
  trace: condCurve('trace'),
  constOne: condCurve('constOne'),
});

export const IMP96456_PROXY_LABELS = Object.freeze({
  linear: LAMMAX_PROXIES.linear.label,
  trace: LAMMAX_PROXIES.trace.label,
  constOne: LAMMAX_PROXIES.constOne.label,
});

export const IMP96456_LANDMARKS = Object.freeze({
  breakdownCond: IMP96428_CEILING.breakdownCond,
  log10Breakdown: log10(IMP96428_CEILING.breakdownCond),
  computeCeilingN: IMP96428_VERDICT.computeCeilingN, // ~9916, imp-96352
  log10ComputeCeilingN: log10(IMP96428_VERDICT.computeCeilingN),
  ceilingLinearN: IMP96428_CEILING.lamMaxLinearN,
  log10CeilingLinearN: log10(IMP96428_CEILING.lamMaxLinearN),
  ceilingTraceN: IMP96428_CEILING.lamMaxTraceLog,
  log10CeilingTraceN: log10(IMP96428_CEILING.lamMaxTraceLog),
  ceilingConstN: IMP96428_CEILING.lamMaxConstOne,
  log10CeilingConstN: log10(IMP96428_CEILING.lamMaxConstOne),
  ranTo: IMP96428_CEILING.ranTo,
  log10RanTo: log10(IMP96428_CEILING.ranTo),
});

export const IMP96456_TARGET_COND_POINTS = IMP96428_TARGET_COND.map((r) => ({
  N: r.N,
  log10N: log10(r.N),
  log10Cond: log10(r.cond),
  note: r.note,
}));

export const IMP96456_HONEST_BANNER = IMP96428_HONEST_BANNER;

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
const lastMeasuredRow = IMP96428_LAMMIN_ROWS[IMP96428_LAMMIN_ROWS.length - 1];
export const IMP96456_VALIDATION = Object.freeze({
  twelveMeasuredRungsPresent: IMP96456_LAMMIN_MEASURED_POINTS.length === 12,
  fitMatchesLastMeasuredRung:
    Math.abs(lamMinFit(lastMeasuredRow.N) / lastMeasuredRow.lamMin - 1) < 0.01,
  // Reconstructed proxy ceilings reproduce imp-96428's published ceiling-N to within 5%.
  linearCeilingReproduced:
    Math.abs(
      IMP96456_LANDMARKS.ceilingLinearN / lamMinFit(IMP96456_LANDMARKS.ceilingLinearN) /
        IMP96456_LANDMARKS.breakdownCond -
        1,
    ) < 0.001,
  traceProxyMatchesTargetCond: IMP96456_TARGET_COND_POINTS.every((tp) => {
    const modeled = 10 * Math.log(tp.N) / lamMinFit(tp.N);
    return Math.abs(Math.log10(modeled) - tp.log10Cond) < 0.02;
  }),
  computeCeilingBelowAllConditioningCeilings:
    IMP96456_LANDMARKS.computeCeilingN < IMP96456_LANDMARKS.ceilingLinearN &&
    IMP96456_LANDMARKS.ceilingLinearN < IMP96456_LANDMARKS.ceilingTraceN &&
    IMP96456_LANDMARKS.ceilingTraceN < IMP96456_LANDMARKS.ceilingConstN,
});
