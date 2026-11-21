import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96322_EN_TERMS,
  IMP96322_EN_TOTAL,
  IMP96322_PT_BOUND,
  IMP96322_C_H_FACTORS,
  IMP96322_C_H_ANSATZ,
  IMP96322_HONEST_BANNER,
  formatCHFactorValue,
} from '../data/imp-96322-e-decomposition-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAR_COLORS = { E_trunc: ED.series1, E_flow: ED.series5, E_coll: ED.series7, E_N: ED.series4 };

function DecompositionChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 110;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const bars = [...IMP96322_EN_TERMS, { ...IMP96322_EN_TOTAL }];
  const logMin = Math.log10(2e-5);
  const logMax = Math.log10(0.3);

  const xOf = (v) => padL + ((Math.log10(v) - logMin) / (logMax - logMin)) * plotW;
  const rowH = plotH / bars.length;

  const ptX = xOf(IMP96322_PT_BOUND);
  const xTicks = [1e-4, 1e-3, 1e-2, 1e-1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>{v}</text>
        </g>
      ))}

      {/* Platt-Trudgian bound reference line */}
      <line x1={ptX} y1={padT} x2={ptX} y2={padT + plotH} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" opacity={0.8} />
      <text x={ptX} y={padT - 4} textAnchor="middle" fill={ED.series2} fontSize={8}>PT bound = 0.2</text>

      {bars.map((b, i) => {
        const y = padT + i * rowH + rowH * 0.22;
        const h = rowH * 0.56;
        const x0 = xOf(2e-5);
        const x1 = xOf(b.value);
        return (
          <g key={b.key}>
            <text x={padL - 10} y={y + h / 2 + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>{b.label}</text>
            <rect x={x0} y={y} width={Math.max(1, x1 - x0)} height={h} fill={BAR_COLORS[b.key]} opacity={b.key === 'E_N' ? 1 : 0.85} rx={2} />
            <text x={x1 + 6} y={y + h / 2 + 3} fill={ED.ink} fontSize={9}>{b.value.toExponential(2)}</text>
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        magnitude (log scale) at the N = 1e4 conditional anchor (C_H &le; 0.127)
      </text>
    </svg>
  );
}

function SubConstantTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginTop: '0.5rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.35rem 0.5rem' }}>Factor of C_H = C_shock &middot; C_Lip / 4</th>
          <th style={{ padding: '0.35rem 0.5rem' }}>Magnitude</th>
          <th style={{ padding: '0.35rem 0.5rem' }}>N-dependence quantified?</th>
        </tr>
      </thead>
      <tbody>
        {IMP96322_C_H_FACTORS.map((c) => (
          <tr key={c.key} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink)' }}>{c.label}</td>
            <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink-soft)' }}>
              {formatCHFactorValue(c.value)}
            </td>
            <td style={{ padding: '0.35rem 0.5rem', color: c.quantified ? 'var(--series-3)' : 'var(--series-2)' }}>
              {c.quantified ? 'yes' : 'no (RH-hard)'}
            </td>
          </tr>
        ))}
        <tr>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink)' }}>C_H ansatz (leading order / stress-tested)</td>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--ink-soft)' }}>
            {IMP96322_C_H_ANSATZ.leadingOrder} / {IMP96322_C_H_ANSATZ.stressTested}
          </td>
          <td style={{ padding: '0.35rem 0.5rem', color: 'var(--series-2)' }}>
            {IMP96322_C_H_ANSATZ.isRigorousUpperBound ? 'proven' : 'UNPROVEN'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Imp96322EDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96290: E(N) = E_trunc + E_flow + E_coll Decomposition" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96322_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96290 inventoried the three Step-4 Polymath15 bridge sub-constants (G6, G6a, C_H) that
        gate the imp-341 lim-sup skeleton and localized the residual gap to the single factor
        C_Lip inside C_H = C_shock &middot; C_Lip / 4. This page charts the E(N) sub-term
        magnitudes at the N = 1e4 conditional anchor it computed, and tabulates the C_H
        factorization it measured.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        E(N) sub-term magnitudes vs the Platt&ndash;Trudgian bound (log scale)
      </h3>
      <DecompositionChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.25rem' }}>
        C_H sub-constant factorization
      </h3>
      <SubConstantTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> E_coll dominates the
        budget by roughly an order of magnitude over E_flow and nearly three over E_trunc; the
        total E(N) still sits well under the dashed Platt&ndash;Trudgian bound at 0.2 (about a
        16x margin) &mdash; but only conditionally, since the C_H &le; 0.127 ansatz behind
        E_coll is unproven. The table below shows why: C_shock is N-uniform and quantified, while
        C_Lip &mdash; the one factor with no numerical magnitude here &mdash; carries the entire
        unresolved RH-hard residual.
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
        imp-96290 baked inventory verbatim (only the log-scale bar layout is computed here).
        Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
