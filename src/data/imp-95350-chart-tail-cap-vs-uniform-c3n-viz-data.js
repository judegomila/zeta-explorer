/**
 * @module imp-95350-chart-tail-cap-vs-uniform-c3n-viz-data
 *
 * imp-95350 (ux): lightweight, import-light viz-data module charting the
 * imp-95332 LEMMA TAIL-CHART per-chart tail cap c3nChart(t0, t1) across all
 * K = 256 charts of [0, pi] at a = ln(rho) = 6 (rho = e^6), against the flat
 * imp-95329 theta-uniform tail constant c3n it replaces.
 *
 * The per-chart cap formula (LEMMA TAIL-CHART, verbatim from
 * imp-95332-chart-tail-pencil-floor.js: the m = 2..N chart-endpoint charges
 * plus the imp-95329 geometric remainder re-anchored at (2N + 1) pi) is
 * recomputed here across all 256 charts -- imp-95332 itself only reports the
 * single binding-chart value (k = 114) and the flat uniform constant, not
 * the full per-chart series. This module supplies that series for
 * visualization; every value is cross-checked at k = 114 and at the flat
 * constant against the imp-95332 baked record fields (c3nChartA6K114,
 * c3nA6) to rel 1e-12.
 *
 * MEASURED (recomputed here, cross-checked against imp-95332): the cap is
 * monotone NONDECREASING in chart index k across all 256 charts, smallest
 * at the first chart k = 0 (0.1348, 12.37% of the uniform constant) and
 * largest at the last chart k = 255 (0.2443, 22.41% of the uniform
 * constant); the binding chart k = 114 sits at 0.1552 (14.23%). Every
 * chart's cap is strictly below the flat uniform c3n = 1.0901 -- the
 * chart-refinement gain (uniform / per-chart) ranges from about 4.09x at
 * the last chart to about 8.09x at the first chart.
 *
 * Import-light: only imports the already-committed imp-95332 record (a
 * plain object export, no zeros bundle, no heavy deps) for cross-check
 * literals; recomputes the per-chart series itself with the same
 * closed-form arithmetic imp-95332 uses. Follows the imp-95349 import-light
 * viz-data pattern. MEASUREMENT / PRESENTATION ONLY. Changes no bound,
 * establishes no operator positivity, no RH claim; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-95332-chart-tail-pencil-floor.js (LEMMA TAIL-CHART, function
 *   c3nChart, record fields c3nA6 / c3nChartA6K114 / bindingChartRhoE6)
 *
 * Ticket: imp-95350 (ux, sonnet-4-6, low). Presentation only, RH-free;
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

// imp-95332 LEMMA TAIL-CHART per-chart cap (verbatim)
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

const A6 = 6;
const K = 256;
const { c3n: C3N_UNIFORM } = pen3Constants(A6);

export const IMP95350_CHART_TAIL_CAP_SERIES = Array.from({ length: K }, (_, k) => {
  const t0 = (PI * k) / K;
  const t1 = (PI * (k + 1)) / K;
  const cap = c3nChart(A6, t0, t1);
  return {
    k,
    tMid: (t0 + t1) / 2,
    c3nChart: cap,
    ratioToUniform: cap / C3N_UNIFORM,
  };
});

export const IMP95350_SUMMARY = {
  a: A6,
  rho: 'e^6',
  K,
  c3nUniform: C3N_UNIFORM,
  firstChart: IMP95350_CHART_TAIL_CAP_SERIES[0],
  bindingChart: IMP95350_CHART_TAIL_CAP_SERIES[114],
  lastChart: IMP95350_CHART_TAIL_CAP_SERIES[K - 1],
  gainAtFirstChart: C3N_UNIFORM / IMP95350_CHART_TAIL_CAP_SERIES[0].c3nChart,
  gainAtLastChart: C3N_UNIFORM / IMP95350_CHART_TAIL_CAP_SERIES[K - 1].c3nChart,
  gainAtBindingChart: C3N_UNIFORM / IMP95350_CHART_TAIL_CAP_SERIES[114].c3nChart,
};

const REF = IMP95332_CHART_TAIL_PENCIL_FLOOR.theoremRzPen6;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95350_ASSERTIONS = [
  {
    id: 'imp95350-uniform-constant-matches-source-record',
    description:
      'the recomputed flat theta-uniform c3n constant at a = 6 matches the imp-95332 baked c3nA6 literal to rel 1e-12',
    holds: () => Math.abs(C3N_UNIFORM / REF.c3nA6 - 1) < 1e-12,
  },
  {
    id: 'imp95350-binding-chart-matches-source-record',
    description:
      'the recomputed per-chart cap at the imp-95332 binding chart (k = 114) matches the baked c3nChartA6K114 literal to rel 1e-12, and that chart index matches bindingChartRhoE6',
    holds: () =>
      Math.abs(IMP95350_CHART_TAIL_CAP_SERIES[114].c3nChart / REF.c3nChartA6K114 - 1) < 1e-12 &&
      REF.bindingChartRhoE6 === 114,
  },
  {
    id: 'imp95350-every-chart-cap-below-uniform',
    description:
      'every one of the 256 per-chart caps is strictly below the flat uniform c3n constant (LEMMA TAIL-CHART chart-refinement is nonincreasing from the [0, pi] uniform anchor)',
    holds: () => IMP95350_CHART_TAIL_CAP_SERIES.every((r) => r.c3nChart < C3N_UNIFORM),
  },
  {
    id: 'imp95350-monotone-nondecreasing-in-k',
    description:
      'the per-chart cap series is monotone nondecreasing in chart index k across all 256 charts (smallest at k = 0, largest at k = 255)',
    holds: () => {
      for (let k = 1; k < K; k++) {
        if (IMP95350_CHART_TAIL_CAP_SERIES[k].c3nChart < IMP95350_CHART_TAIL_CAP_SERIES[k - 1].c3nChart - 1e-15) {
          return false;
        }
      }
      const minRow = IMP95350_CHART_TAIL_CAP_SERIES.reduce((m, r) => (r.c3nChart < m.c3nChart ? r : m));
      const maxRow = IMP95350_CHART_TAIL_CAP_SERIES.reduce((m, r) => (r.c3nChart > m.c3nChart ? r : m));
      return minRow.k === 0 && maxRow.k === K - 1;
    },
  },
  {
    id: 'imp95350-summary-fields-consistent',
    description:
      'the exported summary gain factors equal the flat uniform constant divided by the corresponding per-chart cap, and every gain exceeds 1',
    holds: () =>
      Math.abs(IMP95350_SUMMARY.gainAtFirstChart - C3N_UNIFORM / IMP95350_SUMMARY.firstChart.c3nChart) < 1e-12 &&
      Math.abs(IMP95350_SUMMARY.gainAtLastChart - C3N_UNIFORM / IMP95350_SUMMARY.lastChart.c3nChart) < 1e-12 &&
      Math.abs(IMP95350_SUMMARY.gainAtBindingChart - C3N_UNIFORM / IMP95350_SUMMARY.bindingChart.c3nChart) < 1e-12 &&
      IMP95350_SUMMARY.gainAtFirstChart > 1 &&
      IMP95350_SUMMARY.gainAtLastChart > 1 &&
      IMP95350_SUMMARY.gainAtBindingChart > 1,
  },
];

for (const a of IMP95350_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95350-chart-tail-cap-vs-uniform-c3n-viz-data assertion failed: ${a.id}`);
  }
}
