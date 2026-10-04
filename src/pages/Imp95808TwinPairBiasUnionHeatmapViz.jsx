import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95808_DELTA_LABELS,
  IMP95808_RHO_LABELS,
  IMP95808_BIAS_PCT,
  IMP95808_SOURCE,
  IMP95808_FLAT_ROWS,
  IMP95808_MEASURED_CELL_COUNT,
  IMP95808_TOTAL_GRID_CELLS,
  IMP95808_CAVEAT_BANNER,
} from '../data/imp-95808-twin-pair-bias-union-heatmap-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// Sequential log-scale color: bias% near 0 fades toward background, larger bias fades toward amber.
function cellColor(biasPct) {
  const bg = { r: 15, g: 23, b: 42 };
  if (biasPct == null) return alpha(ED.series8, 0.1);
  const logZ = Math.log10(Math.max(biasPct, 1e-4));
  const t = Math.max(0, Math.min(1, (logZ + 4) / 6));
  const hi = { r: 245, g: 158, b: 11 };
  return `rgb(${Math.round(bg.r + (hi.r - bg.r) * t)},${Math.round(bg.g + (hi.g - bg.g) * t)},${Math.round(bg.b + (hi.b - bg.b) * t)})`;
}

function BiasUnionHeatmap() {
  const svgW = 480;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 44;
  const svgH = 380;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nCols = IMP95808_DELTA_LABELS.length;
  const nRows = IMP95808_RHO_LABELS.length;
  const colW = cW / nCols;
  const rowH = cH / nRows;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP95808_BIAS_PCT.map((col, i) =>
        col.map((bias, j) => {
          const source = IMP95808_SOURCE[i][j];
          return (
            <g key={`cell-${i}-${j}`}>
              <rect
                x={padL + i * colW}
                y={padT + j * rowH}
                width={colW}
                height={rowH}
                fill={cellColor(bias)}
                stroke={ED.paper}
                strokeWidth={1}
              />
              {source && (
                <text
                  x={padL + (i + 0.5) * colW}
                  y={padT + (j + 0.5) * rowH + 3}
                  textAnchor="middle"
                  fill={ED.paper}
                  fontSize={8.5}
                  fontFamily="monospace"
                >
                  {source === 'imp-95762' ? 'DD' : 'f64'}
                </text>
              )}
            </g>
          );
        }),
      )}

      {IMP95808_DELTA_LABELS.map((label, i) => (
        <text
          key={`xt-${i}`}
          x={padL + (i + 0.5) * colW}
          y={padT + cH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9.5}
        >
          {label}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        in-pair gap delta
      </text>

      {IMP95808_RHO_LABELS.map((rho, j) => (
        <text
          key={`yt-${j}`}
          x={padL - 8}
          y={padT + (j + 0.5) * rowH + 3}
          textAnchor="end"
          fill={ED.inkFaint}
          fontSize={9.5}
        >
          {rho}
        </text>
      ))}
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        rho
      </text>
    </svg>
  );
}

function ColorLegend() {
  const stops = [-4, -2, 0, 1.7];
  const w = 220;
  const h = 14;
  return (
    <svg width={w} height={40} style={{ display: 'block' }}>
      {stops.slice(0, -1).map((s, i) => {
        const x0 = ((s + 4) / 6) * w;
        const x1 = ((stops[i + 1] + 4) / 6) * w;
        const mid = 10 ** ((s + stops[i + 1]) / 2);
        return <rect key={s} x={x0} y={0} width={x1 - x0} height={h} fill={cellColor(mid)} />;
      })}
      {stops.map((s) => (
        <text key={`lbl-${s}`} x={((s + 4) / 6) * w} y={h + 12} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {s <= 0 ? `10^${s}` : '~52'}
        </text>
      ))}
    </svg>
  );
}

export default function Imp95808TwinPairBiasUnionHeatmapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Twin-Pair Bias Union Heatmap (imp-95785 / imp-95808)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95785 assembled the finite-80 twin-pair block bias biasPct = 100*(finite&#47;F_inf - 1)
        across the union of the imp-95762 double-double (DD) deep cells and the imp-95707 float64
        (f64) rho-sweep into one 13-cell table over three deltas. This heatmap shows the bias
        falling from 51.63% at the deep corner (delta = ln1.2, rho = 1) toward 0% as either delta or
        rho grows, jointly monotone in both directions. Blank cells were never measured by either
        source (the two grids are delta-disjoint, so only {IMP95808_MEASURED_CELL_COUNT} of the{' '}
        {IMP95808_TOTAL_GRID_CELLS} (delta, rho) combinations in this display grid have data).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        bias% color scale (log10), DD = imp-95762 double-double source, f64 = imp-95707 float64 source
      </p>
      <BiasUnionHeatmap />

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--ink-faint)', fontSize: '0.78rem' }}>bias% color scale (log10):</span>
        <ColorLegend />
      </div>

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>delta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>bias%</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {IMP95808_FLAT_ROWS.map((c) => (
            <tr key={`${c.delta}-${c.rho}`} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.delta}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.rho}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.biasPct.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {c.source === 'imp-95762' ? 'DD (95762)' : 'f64 (95707)'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95808_CAVEAT_BANNER}
      </div>
    </div>
  );
}
