import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35506_ENDPOINT_MAP, IMP35506_SUMMARY } from '../data/imp-35506-endpoint-positivity-map-viz-data.js';
import { ED } from '../styles/tokens.js';

const GRIDS = ['dt', 'dt/2', 'dt/4'];
const FAMILIES = ['DP45', 'RK4', 'BS3'];

function cellFor(family, grid) {
  return IMP35506_ENDPOINT_MAP.find((c) => c.family === family && c.grid === grid);
}

function EndpointPositivityHeatmap() {
  const cellW = 130;
  const cellH = 64;
  const labelW = 70;
  const labelH = 26;
  const svgW = labelW + cellW * GRIDS.length;
  const svgH = labelH + cellH * FAMILIES.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {GRIDS.map((grid, gi) => (
        <text
          key={grid}
          x={labelW + gi * cellW + cellW / 2}
          y={labelH - 8}
          textAnchor="middle"
          fill={ED.inkSoft}
          fontSize={11}
          fontFamily="monospace"
        >
          {grid}
        </text>
      ))}
      {FAMILIES.map((family, fi) => (
        <g key={family}>
          <text
            x={labelW - 10}
            y={labelH + fi * cellH + cellH / 2 + 4}
            textAnchor="end"
            fill={ED.inkSoft}
            fontSize={11}
          >
            {family}
          </text>
          {GRIDS.map((grid, gi) => {
            const cell = cellFor(family, grid);
            const isPositive = cell.positive;
            return (
              <g key={grid}>
                <rect
                  x={labelW + gi * cellW}
                  y={labelH + fi * cellH}
                  width={cellW - 4}
                  height={cellH - 4}
                  fill={isPositive ? ED.brassDeco : ED.paper3}
                  stroke={isPositive ? ED.brassDeco : ED.rule}
                  strokeWidth={isPositive ? 2 : 1}
                  rx={4}
                />
                <text
                  x={labelW + gi * cellW + (cellW - 4) / 2}
                  y={labelH + fi * cellH + (cellH - 4) / 2 - 4}
                  textAnchor="middle"
                  fill={isPositive ? '#0a0f1a' : '#e2e8f0'}
                  fontSize={11}
                  fontWeight={700}
                >
                  {isPositive ? 'POSITIVE' : 'negative'}
                </text>
                <text
                  x={labelW + gi * cellW + (cellW - 4) / 2}
                  y={labelH + fi * cellH + (cellH - 4) / 2 + 14}
                  textAnchor="middle"
                  fill={isPositive ? ED.paper : ED.inkSoft}
                  fontSize={9.5}
                  fontFamily="monospace"
                >
                  {cell.endpointGap >= 0 ? '+' : ''}
                  {cell.endpointGap.toExponential(3)}
                </text>
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

export default function Imp35506EndpointPositivityMapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="N=2000 Pair-1495 Endpoint-Positivity Map: DP45/RK4/BS3 x dt, dt/2, dt/4 (imp-35506)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35452 mapped the N=2000 pair-1495 step-endpoint signed gap g_end&nbsp;=&nbsp;y1[i+1]-y1[i]
        across RK4 and DP45 at three grids (dt, dt/2, dt/4); imp-35477 added a third integrator family
        (BS3, order 3) at dt and dt/2; imp-35573 filled the last cell, BS3 at dt/4 (endpoint NEGATIVE).
        The full 3x3 matrix has exactly ONE endpoint-POSITIVE cell -- DP45 at dt/2, the single-grid
        resonance where the within-step crossing never reaches the step endpoint -- against eight
        endpoint-NEGATIVE cells where the endpoint sees the crossing directly.
      </p>

      <EndpointPositivityHeatmap />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>endpoint gap g_end</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sign</th>
          </tr>
        </thead>
        <tbody>
          {IMP35506_ENDPOINT_MAP.map((row) => (
            <tr
              key={`${row.family}-${row.grid}`}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                color: row.positive ? 'var(--brass)' : 'var(--ink)',
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem' }}>
                {row.family} (order {row.order})
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.grid}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.endpointGap >= 0 ? '+' : ''}
                {row.endpointGap.toExponential(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontWeight: row.positive ? 700 : 400 }}>
                {row.positive ? 'POSITIVE (knife-edge)' : 'negative'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Of the {IMP35506_SUMMARY.totalCells} cells in the family-x-grid matrix, only{' '}
        {IMP35506_SUMMARY.lonePositiveCell} stays endpoint-positive; the other{' '}
        {IMP35506_SUMMARY.negativeCount} cells all have the endpoint see the crossing directly
        (negative g_end). imp-35452 showed this DP45 dt/2 resonance does not survive one further
        grid halving to dt/4 (the sign flips back to negative), so it is a single-grid artifact of
        DP45, not a systematic order-5 property, and BS3 (order 3) corroborates that RK4's
        endpoint-negative reading is the generic case.
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
        reproducing the imp-35452/imp-35477 measurements verbatim; no new derivation, no bound
        changed. Measurement only on the inherited imp-3220/imp-3406 surrogate; does NOT advance
        the R2 ladder past N=1000 (imp-35221/imp-35324/imp-35412); does NOT change the imp-35412
        slack denominator (the endpoint DP45 dt/2 worst-case is kept); C_mb GUE-conditional per
        imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict,
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
        Ticket provenance: this page and its data module were built directly under imp-35506 itself;
        imp-35567&apos;s later request for &quot;an import-light viz-data module + page&quot; for the
        same matrix duplicates this artifact and is closed as already-satisfied, not built again.
      </p>
    </div>
  );
}
