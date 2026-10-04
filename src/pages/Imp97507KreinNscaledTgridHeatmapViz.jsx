import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97507_GRID_CELLS,
  IMP97507_N_ROWS,
  IMP97507_T_COLUMNS,
  IMP97507_VALUE_RANGE,
  IMP97507_BEST_CELL,
} from '../data/imp-97507-krein-nscaled-tgrid-heatmap-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97507: visualizes the imp-97484 extended well-resolved lam_min(N,T)
// table (N=84..164, T=4800..8000) as a heatmap / column-family grid --
// rows fall with N, columns rise with T, and the tightest resolved cell
// (N=164, T=8000) is the current best directly-read upper bracket.

function colorFor(value) {
  const { min, max } = IMP97507_VALUE_RANGE;
  const t = (value - min) / (max - min); // 0 = tightest (min), 1 = loosest (max)
  // Deep blue (tight/best) -> light amber (loose/least-resolved)
  const r = Math.round(56 + t * (250 - 56));
  const g = Math.round(70 + t * (204 - 70));
  const b = Math.round(140 + t * (113 - 140));
  return `rgb(${r},${g},${b})`;
}

function HeatmapGrid() {
  const cellW = 96;
  const cellH = 40;
  const labelColW = 56;
  const labelRowH = 28;
  const svgW = labelColW + cellW * IMP97507_T_COLUMNS.length;
  const svgH = labelRowH + cellH * IMP97507_N_ROWS.length;

  const cellByKey = new Map(IMP97507_GRID_CELLS.map((c) => [`${c.N},${c.T}`, c]));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP97507_T_COLUMNS.map((T, ci) => (
        <text
          key={`th${T}`}
          x={labelColW + ci * cellW + cellW / 2}
          y={labelRowH - 8}
          textAnchor="middle"
          fill={ED.inkSoft}
          fontSize={11}
        >
          T={T}
        </text>
      ))}

      {IMP97507_N_ROWS.map((N, ri) => (
        <text
          key={`nh${N}`}
          x={labelColW - 8}
          y={labelRowH + ri * cellH + cellH / 2 + 4}
          textAnchor="end"
          fill={ED.inkSoft}
          fontSize={11}
        >
          N={N}
        </text>
      ))}

      {IMP97507_N_ROWS.map((N, ri) =>
        IMP97507_T_COLUMNS.map((T, ci) => {
          const cell = cellByKey.get(`${N},${T}`);
          const isBest = N === IMP97507_BEST_CELL.N && T === IMP97507_BEST_CELL.T;
          return (
            <g key={`c${N}_${T}`}>
              <rect
                x={labelColW + ci * cellW}
                y={labelRowH + ri * cellH}
                width={cellW - 2}
                height={cellH - 2}
                fill={colorFor(cell.value)}
                stroke={isBest ? ED.inkSoft : 'none'}
                strokeWidth={isBest ? 2 : 0}
              />
              <text
                x={labelColW + ci * cellW + (cellW - 2) / 2}
                y={labelRowH + ri * cellH + (cellH - 2) / 2 + 4}
                textAnchor="middle"
                fill={ED.paper}
                fontSize={10}
                fontWeight={isBest ? 700 : 400}
              >
                {cell.value.toFixed(6)}
              </text>
            </g>
          );
        }),
      )}
    </svg>
  );
}

export default function Imp97507KreinNscaledTgridHeatmapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-97484: lam_min(N,T) Heatmap (N=84..164, T=4800..8000)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> every
        cell below is the imp-97484 Rayleigh-Ritz UPPER bracket lam_min(N,T)
        reused verbatim. Measurement only &mdash; establishes no operator
        positivity, no lower bound, no bound moves; interval-rigorous reach
        stays 2a&le;0.96; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Each row is a subspace dimension N; each column is a cumulative-T
        checkpoint of the quadrature int_0^T sigma2 R_n R_m dt. Reading
        left-to-right, every row lightens (increases) as T resolves the
        inner limit from below; reading top-to-bottom, every column darkens
        (decreases) as larger N tightens the Rayleigh-Ritz bracket. The
        darkest, most-resolved cell (N=164, T=8000, outlined) is the current
        best directly-read bracket c_sharp &le; {IMP97507_BEST_CELL.value.toFixed(6)}.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        lam_min(N,T) column-family grid
      </h3>
      <HeatmapGrid />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 760 }}>
        The lightest cell (N=164, T=4800) is the LEAST resolved reading in
        the table, not a valid tighter bracket: because every column
        increases in T, small-T cells read spuriously low. The correct
        directly-read bracket is always the right (largest-T) edge of a row,
        which is why the tightest color sits at the bottom-right corner.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97484 table verbatim. Establishes no operator
        positivity; changes no bound; interval-rigorous reach stays
        2a&le;0.96; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO
        QED.
      </div>
    </div>
  );
}
