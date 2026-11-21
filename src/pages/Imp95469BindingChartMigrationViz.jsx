import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95469_MIGRATION_CURVE,
  IMP95469_BRANCH_CROSSOVER,
  IMP95469_R_INVARIANCE,
} from '../data/imp-95469-binding-chart-migration-viz-data.js';
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
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
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

const BRANCH_COLORS = { V4: ED.series4, Psi6: ED.series1 };

// line chart of k*(a) with branch coloring, the branch-crossover vertical
// marker and the interior peak highlighted
function MigrationCurvePanel() {
  const rows = IMP95469_MIGRATION_CURVE;
  const svgW = 640;
  const padL = 50;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minA = 0;
  const maxA = 6;
  const minK = 0;
  const maxK = 160;
  const xOf = (a) => padL + ((a - minA) / (maxA - minA)) * plotW;
  const yOf = (k) => padT + plotH - ((k - minK) / (maxK - minK)) * plotH;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[0, 1, 2, 3, 4, 5, 6]}
      yTicks={[0, 40, 80, 120, 160]}
      xOf={xOf}
      yOf={yOf}
      xLabel="a = ln(rho)"
      yLabel="binding chart k* (of K = 256)"
    >
      <line
        x1={xOf(IMP95469_BRANCH_CROSSOVER.aApprox)}
        y1={padT}
        x2={xOf(IMP95469_BRANCH_CROSSOVER.aApprox)}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text
        x={xOf(IMP95469_BRANCH_CROSSOVER.aApprox) + 4}
        y={padT + 10}
        fill={ED.inkSoft}
        fontSize={8.5}
      >
        crossover a~{IMP95469_BRANCH_CROSSOVER.aApprox}
      </text>
      <polyline
        points={rows.map((r) => `${xOf(r.aValue)},${yOf(r.kBind)}`).join(' ')}
        fill="none"
        stroke={ED.rule}
        strokeWidth={1.5}
        opacity={0.6}
      />
      {rows.map((r) => (
        <circle
          key={r.aLabel}
          cx={xOf(r.aValue)}
          cy={yOf(r.kBind)}
          r={r.isPeak ? 5 : 3.5}
          fill={BRANCH_COLORS[r.branch]}
          stroke={r.isPeak ? ED.inkSoft : 'none'}
          strokeWidth={r.isPeak ? 1.5 : 0}
        />
      ))}
      {rows
        .filter((r) => r.isPeak)
        .map((r) => (
          <text key={`peak-${r.aLabel}`} x={xOf(r.aValue)} y={yOf(r.kBind) - 10} textAnchor="middle" fill={ED.ink} fontSize={9}>
            peak k*={r.kBind}
          </text>
        ))}
      <text x={padL + 8} y={padT + 14} fill={BRANCH_COLORS.V4} fontSize={9}>
        V4 branch
      </text>
      <text x={padL + 8} y={padT + 27} fill={BRANCH_COLORS.Psi6} fontSize={9}>
        Psi6 branch
      </text>
    </AxisFrame>
  );
}

// bar chart of the r-invariance spread (max k* - min k* over 19 tau
// samples), essentially 0 except a 5-chart spread near the crossover
function RInvariancePanel() {
  const rows = IMP95469_R_INVARIANCE;
  const svgW = 640;
  const padL = 50;
  const padR = 24;
  const svgH = 220;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 6;
  const barW = plotW / rows.length / 2;
  const xOf = (i) => padL + (plotW / rows.length) * (i + 0.5);
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[]}
      yTicks={[0, 2, 4, 6]}
      xOf={xOf}
      yOf={yOf}
      xLabel="a (fixed rho, swept over 19 tau samples)"
      yLabel="spread max k* - min k* (of 256)"
    >
      {rows.map((r, i) => (
        <g key={r.aLabel}>
          <rect
            x={xOf(i) - barW / 2}
            y={yOf(r.spreadCharts)}
            width={barW}
            height={yOf(0) - yOf(r.spreadCharts)}
            fill={r.spreadCharts > 0 ? ED.brassDeco : ED.paper3}
            opacity={0.85}
          />
          <text x={xOf(i)} y={yOf(r.spreadCharts) - 6} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {r.spreadCharts}
          </text>
          <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            a = {r.aLabel}
          </text>
        </g>
      ))}
    </AxisFrame>
  );
}

export default function Imp95469BindingChartMigrationViz() {
  const last = IMP95469_MIGRATION_CURVE[IMP95469_MIGRATION_CURVE.length - 1];
  const peak = IMP95469_MIGRATION_CURVE.find((r) => r.isPeak);
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-95341 Binding-Chart Migration k*(a, mu) Across rho" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only chart of
        which K = 256 chart binds the imp-95332 pencil floor as rho varies; it changes no floor
        value, bound or onset. RH
        does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95332 chart floor max(V4_k, Psi5_k, Psi6_k) is minimized at a binding chart
        k*(a, mu) that migrates as rho = e^a varies (uniform certificate mu = 16/a^2, K = 256
        charts of [0, pi]). It starts on a V4-carried edge chart, crosses to the Psi6 branch at
        a ~ {IMP95469_BRANCH_CROSSOVER.aApprox} (rho ~ {IMP95469_BRANCH_CROSSOVER.rhoApprox}),
        peaks at k* = {peak.kBind} near a ~ {peak.aValue}, then retreats to k* = {last.kBind} at
        a = 6 (rho = e^6), the SOTA-relevant far end.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Binding chart k* vs a, with the V4-to-Psi6 branch crossover and interior peak
      </h3>
      <MigrationCurvePanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        r-invariance: spread of k* over 19 tau samples at fixed a
      </h3>
      <RInvariancePanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the binding window is
        essentially a function of rho alone &mdash; at fixed a the spread over r is 0 charts of
        256 for a &ge; 3, and at most 5 charts near the crossover (a = ln 10). So the interior
        far-rho window (theta* ~ 0.447 pi, chart 114 at rho = e^6) is where the imp-95332 open
        pencil-floor leg is best concentrated, not the V4-carried edge charts that only bind at
        small rho.
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
        imp-95469 baked viz-data (values copied verbatim from the imp-95341 record, no
        re-derivation). Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
