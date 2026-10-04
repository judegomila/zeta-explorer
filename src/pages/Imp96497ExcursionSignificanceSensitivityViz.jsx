import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96497_SCENARIOS,
  IMP96497_EXCURSION_DEPTH,
  IMP96497_TWO_SIGMA_GAP,
  IMP96497_HONEST_BANNER,
} from '../data/imp-96497-excursion-significance-sensitivity-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAR_COLORS = { naive: ED.series1, target: ED.series4, corrected: ED.series3 };

function ScenarioChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 220;
  const padR = 60;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxZ = Math.max(...IMP96497_SCENARIOS.map((s) => s.z)) * 1.15;
  const xOf = (z) => padL + (z / maxZ) * plotW;
  const rowH = plotH / IMP96497_SCENARIOS.length;

  const targetZ = IMP96497_SCENARIOS.find((s) => s.key === 'target').z;
  const targetX = xOf(targetZ);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={targetX} y1={padT} x2={targetX} y2={padT + plotH} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" opacity={0.8} />
      <text x={targetX} y={padT - 4} textAnchor="middle" fill={ED.series2} fontSize={8}>z = 2 (2-sigma)</text>

      <line x1={xOf(1)} y1={padT} x2={xOf(1)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
      <text x={xOf(1)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>z = 1</text>

      {IMP96497_SCENARIOS.map((s, i) => {
        const y = padT + i * rowH + rowH * 0.22;
        const h = rowH * 0.56;
        const x0 = padL;
        const x1 = xOf(s.z);
        return (
          <g key={s.key}>
            <text x={padL - 10} y={y + h / 2 - 4} textAnchor="end" fill={ED.ink} fontSize={9.5}>{s.label}</text>
            <text x={padL - 10} y={y + h / 2 + 8} textAnchor="end" fill={ED.inkFaint} fontSize={8}>n_w = {s.nW.toFixed(1)}</text>
            <rect x={x0} y={y} width={Math.max(1, x1 - x0)} height={h} fill={BAR_COLORS[s.key]} opacity={0.85} rx={2} />
            <text x={x1 + 6} y={y + h / 2 + 3} fill={ED.ink} fontSize={9}>z = {s.z.toFixed(3)}</text>
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        z-score at T = 1.5e5 (dip depth relErr = {IMP96497_EXCURSION_DEPTH.relErr.toFixed(4)} held fixed)
      </text>
    </svg>
  );
}

function GapTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginTop: '0.5rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.35rem 0.5rem' }}>Quantity</th>
          <th style={{ padding: '0.35rem 0.5rem' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink)' }}>n_w cited (naive)</td>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink-soft)' }}>{IMP96497_TWO_SIGMA_GAP.nWCurrent}</td>
        </tr>
        <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink)' }}>n_w needed for z = 2</td>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink-soft)' }}>{IMP96497_TWO_SIGMA_GAP.nWNeeded}</td>
        </tr>
        <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink)' }}>extra windows needed</td>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--brass)' }}>+{IMP96497_TWO_SIGMA_GAP.extraWindows}</td>
        </tr>
        <tr>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink)' }}>window increase</td>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--brass)' }}>+{IMP96497_TWO_SIGMA_GAP.windowIncreasePct.toFixed(2)}%</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Imp96497ExcursionSignificanceSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96452: Excursion-Significance Sensitivity (naive vs 2-sigma vs correlation-corrected)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96497_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96452 traced the "~1.9-sigma excursion confidence" repeatedly cited by
        imp-96430/imp-96128/imp-96184 to a single below-envelope number-variance dip at
        T = 1.5e5, and quantified two sensitivities: how many extra tiling windows would lift
        it to a clean 2-sigma, and how much higher a naive z would be if the imp-96128
        anti-correlation model were used instead of the conservative naive window count. This
        page charts the three scenarios side by side, with the dip depth held fixed throughout.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        z-score vs window count n_w across the three scenarios
      </h3>
      <ScenarioChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.25rem' }}>
        Gap to the 2-sigma target
      </h3>
      <GapTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the naive/cited
        scenario sits just under 2-sigma at z &asymp; 1.923 with n_w = 291 windows; closing the
        gap to a clean 2-sigma needs only +24 windows (+8.12%) at the same dip depth &mdash;
        but that increment cannot come from more verified-zero height, since the dip window is
        fully interior to the existing ordinate set. The correlation-corrected scenario
        (n_eff &asymp; 795, from the imp-96128 exact anti-correlation) would already clear
        3-sigma; the ~1.9-sigma figure is deliberately quoted on the conservative naive count.
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
        imp-96452 baked reach record verbatim (only the bar layout is computed here). Changes
        no bound, establishes no operator positivity, no RH claim; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
