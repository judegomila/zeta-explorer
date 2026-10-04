import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35541_SCHEME_ROWS,
  IMP35541_CROSS_CHECK,
  IMP35541_SUMMARY,
} from '../data/imp-35541-scheme-independence-viz-data.js';
import { ED } from '../styles/tokens.js';

const GRIDS = ['dt', 'dt/2'];
const FAMILIES = ['DP45', 'RK4', 'BS3'];

function rowFor(family, grid) {
  return IMP35541_SCHEME_ROWS.find((r) => r.family === family && r.grid === grid);
}

function SchemeIndependenceBars() {
  const barMaxWidth = 260;
  const rowH = 30;
  const labelW = 90;
  const svgW = labelW + barMaxWidth + 90;
  const svgH = rowH * FAMILIES.length * GRIDS.length + 20;
  const maxTc = Math.max(...IMP35541_SCHEME_ROWS.map((r) => r.t_c));
  const minTc = Math.min(...IMP35541_SCHEME_ROWS.map((r) => r.t_c));
  const span = maxTc - minTc || 1;

  let rowIndex = 0;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {GRIDS.map((grid) =>
        FAMILIES.map((family) => {
          const row = rowFor(family, grid);
          const y = 10 + rowIndex * rowH;
          const frac = (row.t_c - minTc) / span;
          const barW = 20 + frac * (barMaxWidth - 20);
          const idx = rowIndex;
          rowIndex += 1;
          return (
            <g key={`${family}-${grid}`}>
              <text x={labelW - 8} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
                {family} ({row.order}) {grid}
              </text>
              <rect
                x={labelW}
                y={y + 4}
                width={barW}
                height={rowH - 12}
                fill={family === 'DP45' ? ED.series1 : family === 'RK4' ? ED.series5 : ED.series3}
                rx={3}
              />
              <text
                x={labelW + barW + 8}
                y={y + rowH / 2 + 4}
                fill={ED.ink}
                fontSize={10}
                fontFamily="monospace"
              >
                {row.t_c.toExponential(6)}
              </text>
              {idx === 2 && (
                <line
                  x1={0}
                  y1={y + rowH}
                  x2={svgW}
                  y2={y + rowH}
                  stroke={ED.rule}
                  strokeWidth={1}
                  strokeDasharray="3,3"
                />
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

export default function Imp35541SchemeIndependenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="N=2000 Pair-1495 Crossing t_c: Scheme-Independence Across Orders 3/4/5 (imp-35541)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35351 caught a within-step crossing of pair 1495 at N=2000 using DP45 CONTD5 (order 5).
        imp-35416 corroborated it with RK4 + cubic Hermite (order 4). imp-35477 added a THIRD,
        distinct integrator family -- Bogacki-Shampine BS3 (order 3, FSAL) -- on the identical setup.
        All three catch the crossing at the same step and pair, with t_c values agreeing to within
        ~1e-4 relative at both grids, regardless of integrator order.
      </p>

      <SchemeIndependenceBars />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>family (order)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>grid</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>t_c</th>
          </tr>
        </thead>
        <tbody>
          {IMP35541_SCHEME_ROWS.map((row) => (
            <tr key={`${row.family}-${row.grid}`} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                {row.family} (order {row.order})
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.grid}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.t_c.toExponential(10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>grid</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel(BS3 vs DP45)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel(BS3 vs RK4)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>dt</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP35541_CROSS_CHECK.dt.bs3VsDp45.toExponential(3)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP35541_CROSS_CHECK.dt.bs3VsRk4.toExponential(3)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>dt/2</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP35541_CROSS_CHECK.dtHalf.bs3VsDp45.toExponential(3)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP35541_CROSS_CHECK.dtHalf.bs3VsRk4.toExponential(3)}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Across {IMP35541_SUMMARY.familiesCovered} integrator families spanning orders{' '}
        {IMP35541_SUMMARY.ordersCovered.join(', ')} and {IMP35541_SUMMARY.gridsCovered} grids, the
        maximum pairwise relative deviation in t_c is {IMP35541_SUMMARY.maxRelativeDeviation.toExponential(3)}
        {' '}-- all three families catch the crossing at the same step and pair, so the event is
        scheme-invariant and not a high-order artifact of DP45 or RK4 alone.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-35477 measurements verbatim; no new derivation, no bound changed.
        Measurement only on the inherited imp-3220/imp-3406 surrogate; does NOT advance the R2
        ladder past N=1000 (imp-35221/imp-35324/imp-35412); does NOT change the imp-35412 slack
        denominator (the endpoint DP45 dt/2 worst-case is kept); C_mb GUE-conditional per imp-486
        UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
