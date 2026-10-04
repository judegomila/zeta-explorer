import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95350_CHART_TAIL_CAP_SERIES,
  IMP95350_SUMMARY,
} from '../data/imp-95350-chart-tail-cap-vs-uniform-c3n-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// per-chart cap c3nChart(k) across all 256 charts, vs the flat uniform c3n reference line
function ChartCapSeriesPanel() {
  const rows = IMP95350_CHART_TAIL_CAP_SERIES;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 1.2;
  const xOf = (k) => padL + (k / (rows.length - 1)) * plotW;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  const capLine = rows.map((r) => `${xOf(r.k)},${yOf(r.c3nChart)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[0, 64, 128, 192, 255]}
      yTicks={[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2]}
      xOf={xOf}
      yOf={yOf}
      xLabel="chart index k (0..255, theta in [0, pi])"
      yLabel="tail cap value"
    >
      <line
        x1={padL}
        y1={yOf(IMP95350_SUMMARY.c3nUniform)}
        x2={padL + plotW}
        y2={yOf(IMP95350_SUMMARY.c3nUniform)}
        stroke={ED.series4}
        strokeWidth={1.5}
        strokeDasharray="6 3"
      />
      <text x={padL + 8} y={yOf(IMP95350_SUMMARY.c3nUniform) - 6} fill={ED.series4} fontSize={9}>
        theta-uniform c3n = {IMP95350_SUMMARY.c3nUniform.toFixed(4)} (imp-95329, flat)
      </text>
      <polyline points={capLine} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.9} />
      <circle cx={xOf(114)} cy={yOf(IMP95350_SUMMARY.bindingChart.c3nChart)} r={3.5} fill={ED.series2} />
      <text x={xOf(114) + 6} y={yOf(IMP95350_SUMMARY.bindingChart.c3nChart) - 8} fill={ED.series2} fontSize={8.5}>
        binding chart k=114
      </text>
      <text x={padL + 8} y={padT + 14} fill={ED.series1} fontSize={9}>
        per-chart cap c3nChart(t0, t1) (imp-95332 LEMMA TAIL-CHART)
      </text>
    </AxisFrame>
  );
}

// chart-refinement gain factor (uniform / per-chart) across all 256 charts
function GainSeriesPanel() {
  const rows = IMP95350_CHART_TAIL_CAP_SERIES;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 260;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 9;
  const xOf = (k) => padL + (k / (rows.length - 1)) * plotW;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  const gainLine = rows.map((r) => `${xOf(r.k)},${yOf(IMP95350_SUMMARY.c3nUniform / r.c3nChart)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[0, 64, 128, 192, 255]}
      yTicks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
      xOf={xOf}
      yOf={yOf}
      xLabel="chart index k (0..255, theta in [0, pi])"
      yLabel="gain factor (uniform c3n / c3nChart)"
    >
      <polyline points={gainLine} fill="none" stroke={ED.series5} strokeWidth={2} opacity={0.9} />
      <text x={padL + 8} y={padT + 14} fill={ED.series5} fontSize={9}>
        per-chart gain over the flat theta-uniform tail constant
      </text>
    </AxisFrame>
  );
}

export default function Imp95350ChartTailCapVsUniformC3nViz() {
  const s = IMP95350_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Per-Chart Tail Cap vs Theta-Uniform c3n at rho = e^6 (imp-95332)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a floor-only measurement
        summary of an already-proven per-chart cap, not a new theorem. It changes no Lambda bound
        and establishes no operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains
        state of the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95329 trace-tail majorant c3n is theta-uniform: it charges the |n| &ge; 2 tail
        terms at a single worst-case value ({s.c3nUniform.toFixed(4)} at rho = e^6) for every chart.
        The imp-95332 LEMMA TAIL-CHART replaces it with a per-chart cap c3nChart(t0, t1) that
        charges each of the K = 256 charts of [0, pi] at its own endpoints. Every chart's cap sits
        strictly below the flat constant &mdash; the gain ranges from {s.gainAtFirstChart.toFixed(2)}x
        at the first chart (k = 0) down to {s.gainAtLastChart.toFixed(2)}x at the last chart
        (k = 255), with the binding chart (k = 114) at {s.gainAtBindingChart.toFixed(2)}x.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Per-chart tail cap across all 256 charts, rho = e^6
      </h3>
      <ChartCapSeriesPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Chart-refinement gain factor over the flat uniform constant
      </h3>
      <GainSeriesPanel />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the per-chart cap is
        monotone nondecreasing in chart index k (smallest at k = 0, largest at k = 255) because the
        chart-endpoint charges shift outward in |w| as theta increases toward pi. All 256 values sit
        strictly below the dashed flat reference line, which is why replacing the uniform constant
        with the per-chart cap tightens the imp-95332 RZ-PEN6 floor everywhere, most at the low-k
        charts and least at the high-k charts.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-95350 baked viz-data (per-chart series recomputed from the imp-95332 LEMMA TAIL-CHART
        closed form, cross-checked at the binding chart and the flat constant against the imp-95332
        record). Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
