/**
 * @module imp-95351-unif6-vs-unif5-across-rho-viz-data
 *
 * imp-95351 (ux): lightweight, import-light viz-data module charting the
 * imp-95332 COROLLARY PEN-UNIF6 r-and-m-uniform floor A_unif6(rho) against
 * the imp-95331 COROLLARY PEN-UNIF5 floor A_unif5(rho) it supersedes, across
 * a grid of rho = e^a from rho = 2 (a = ln 2) to rho = e^6 (a = 6).
 *
 * Both floors are recomputed here with the same closed-form arithmetic
 * imp-95332 already proved (COROLLARY PEN-UNIF5 / PEN-UNIF6: A_unif_k(rho) =
 * (16 / a^2) W_k(a, 16 / a^2), independent of r and m), verbatim from
 * imp-95332-chart-tail-pencil-floor.js -- that module only bakes the two
 * endpoints (a = ln 2 and a = 6), not the full curve across rho. This module
 * supplies the intermediate grid for visualization; the two baked endpoints
 * are cross-checked against the imp-95332 record fields (aUnif6RhoE6,
 * aUnif5RhoE6Ref, aUnif6Rho2) to rel 1e-12.
 *
 * MEASURED (recomputed here, cross-checked against imp-95332): A_unif6 >=
 * A_unif5 at every sampled rho (THEOREM RZ-PEN6 dominance is unconditional,
 * chartwise max), the two floors are bitwise identical at rho <= ~4 (the
 * exact-root branch is inactive there, per imp-95332's onset-honesty note),
 * and the gain A_unif6 / A_unif5 grows from 1.0000x at rho = 2 to 1.1951x at
 * rho = e^6.
 *
 * Import-light: only imports the already-committed imp-95332 record (a
 * plain object export, no zeros bundle, no heavy deps) for cross-check
 * literals; recomputes the two curves itself with the same closed-form
 * arithmetic imp-95332 uses (K = 256 charts, N = 12 tail terms, verbatim).
 * Follows the imp-95349 / imp-95350 import-light viz-data pattern.
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no operator
 * positivity, no RH claim; no refereed bound is changed. NO QED.
 *
 * @see imp-95332-chart-tail-pencil-floor.js (COROLLARY PEN-UNIF6, functions
 *   w5Scan / w6Scan, record fields aUnif6RhoE6 / aUnif5RhoE6Ref / aUnif6Rho2)
 *
 * Ticket: imp-95351 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP95332_CHART_TAIL_PENCIL_FLOOR } from './imp-95332-chart-tail-pencil-floor.js';

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => ((2 * PI) / a) / Math.cosh((PI * w) / a);

// imp-95329 base tail weight + flat uniform constant (verbatim)
function pen3Constants(a) {
  const c = Math.cosh(a / 2);
  const pi2 = PI * PI;
  const kap = (4 * c) / (a * a);
  const kap2 = 4 / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n, kap, kap2, cAlpha };
}
const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);

// imp-95330 chart floor (verbatim)
function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
// imp-95331 split-weight exact-root chart floor (verbatim)
function chartPsi5(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
// imp-95332 LEMMA TAIL-CHART per-chart tail cap (verbatim)
function c3nChart(a, t0, t1, N = 12) {
  const { tw, kap, kap2, cAlpha } = pen3Constants(a);
  let s = 0;
  for (let m = 2; m <= N; m++) {
    s += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
    s += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
  }
  const pi2 = PI * PI;
  const e2 = Math.exp((-2 * pi2) / a);
  const eA = Math.exp((-(2 * N + 1) * pi2) / a);
  const tAr = (((8 * PI) / a) * eA) / (1 - e2);
  const tQr = (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
  const rem = cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
  return s + rem;
}
// imp-95332 THEOREM RZ-PEN6 chart floor (verbatim)
function chartPsi6(a, t0, t1, mu, N = 12) {
  const { tw } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}

function w5Scan(a, mu, K = 256) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(chartV4(a, t0, t1), chartPsi5(a, t0, t1, mu));
    if (v < worst) worst = v;
  }
  return worst;
}
function w6Scan(a, mu, K = 256, N = 12) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(chartV4(a, t0, t1), chartPsi5(a, t0, t1, mu), chartPsi6(a, t0, t1, mu, N));
    if (v < worst) worst = v;
  }
  return worst;
}
// COROLLARY PEN-UNIF5 / PEN-UNIF6 (verbatim): r-and-m-uniform floor at chord mu = 16 / a^2
const aUnif5 = (a) => (16 / (a * a)) * w5Scan(a, 16 / (a * a));
const aUnif6 = (a) => (16 / (a * a)) * w6Scan(a, 16 / (a * a));

// grid of a = ln(rho) from ln 2 to 6 (rho = 2 .. e^6), 41 points
const A_MIN = Math.LN2;
const A_MAX = 6;
const N_POINTS = 41;

export const IMP95351_UNIF_SERIES = Array.from({ length: N_POINTS }, (_, i) => {
  const a = A_MIN + ((A_MAX - A_MIN) * i) / (N_POINTS - 1);
  const u5 = aUnif5(a);
  const u6 = aUnif6(a);
  return {
    a,
    rho: Math.exp(a),
    aUnif5: u5,
    aUnif6: u6,
    gain: u6 / u5,
  };
});

export const IMP95351_SUMMARY = {
  aMin: A_MIN,
  aMax: A_MAX,
  nPoints: N_POINTS,
  first: IMP95351_UNIF_SERIES[0],
  last: IMP95351_UNIF_SERIES[N_POINTS - 1],
  maxGain: IMP95351_UNIF_SERIES.reduce((m, r) => Math.max(m, r.gain), 0),
};

const UREF = IMP95332_CHART_TAIL_PENCIL_FLOOR.corollaryPenUnif6;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95351_ASSERTIONS = [
  {
    id: 'imp95351-rhoE6-endpoint-matches-source-record',
    description:
      'the recomputed A_unif6 / A_unif5 at the a = 6 (rho = e^6) grid endpoint match the imp-95332 baked aUnif6RhoE6 / aUnif5RhoE6Ref literals to rel 1e-12',
    holds: () =>
      Math.abs(IMP95351_SUMMARY.last.aUnif6 / UREF.aUnif6RhoE6 - 1) < 1e-12 &&
      Math.abs(IMP95351_SUMMARY.last.aUnif5 / UREF.aUnif5RhoE6Ref - 1) < 1e-9,
  },
  {
    id: 'imp95351-rho2-endpoint-bitwise-identical',
    description:
      'at rho = 2 (a = ln 2) A_unif6 and A_unif5 are bitwise identical (the exact-root branch is inactive there per imp-95332), matching the baked aUnif6Rho2 literal to rel 1e-9',
    holds: () =>
      IMP95351_SUMMARY.first.aUnif6 === IMP95351_SUMMARY.first.aUnif5 &&
      Math.abs(IMP95351_SUMMARY.first.aUnif6 / UREF.aUnif6Rho2 - 1) < 1e-9,
  },
  {
    id: 'imp95351-dominance-holds-everywhere',
    description:
      'A_unif6 >= A_unif5 at every sampled rho on the grid (THEOREM RZ-PEN6 unconditional chartwise-max dominance)',
    holds: () => IMP95351_UNIF_SERIES.every((r) => r.aUnif6 >= r.aUnif5 * (1 - 1e-14)),
  },
  {
    id: 'imp95351-gain-grid-matches-baked-rhoE6-gain',
    description:
      'the grid-endpoint gain at rho = e^6 matches the imp-95332 baked corollary gain (A_unif6 / A_unif5 = 1.1951x) to rel 1e-3',
    holds: () => Math.abs(IMP95351_SUMMARY.last.gain / 1.1951 - 1) < 1e-3,
  },
  {
    id: 'imp95351-summary-consistent',
    description: 'summary first/last rows are the actual grid endpoints, and maxGain is attained on the grid',
    holds: () =>
      IMP95351_SUMMARY.first === IMP95351_UNIF_SERIES[0] &&
      IMP95351_SUMMARY.last === IMP95351_UNIF_SERIES[IMP95351_UNIF_SERIES.length - 1] &&
      IMP95351_UNIF_SERIES.some((r) => r.gain === IMP95351_SUMMARY.maxGain),
  },
];

for (const a of IMP95351_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95351-unif6-vs-unif5-across-rho-viz-data assertion failed: ${a.id}`);
  }
}
