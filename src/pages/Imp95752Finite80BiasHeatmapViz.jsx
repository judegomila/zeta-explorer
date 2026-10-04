import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95752_HEATMAP_DELTA_LABELS,
  IMP95752_HEATMAP_RHO_LABELS,
  IMP95752_HEATMAP_BIAS_PCT,
  IMP95752_HEATMAP_RESOLVED,
  IMP95752_HEATMAP_D,
  IMP95752_CAVEAT_BANNER,
} from '../data/imp-95752-finite80-bias-heatmap-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// Sequential log-scale color: bias% near 0 fades toward background, larger bias fades toward amber.
function cellColor(biasPct) {
  const bg = { r: 15, g: 23, b: 42 };
  if (biasPct == null) return alpha(ED.series8, 0.12);
  const logZ = Math.log10(Math.max(biasPct, 1e-4));
  const t = Math.max(0, Math.min(1, (logZ + 4) / 5));
  const hi = { r: 245, g: 158, b: 11 };
  return `rgb(${Math.round(bg.r + (hi.r - bg.r) * t)},${Math.round(bg.g + (hi.g - bg.g) * t)},${Math.round(bg.b + (hi.b - bg.b) * t)})`;
}

function Finite80BiasHeatmap() {
  const svgW = 480;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 44;
  const svgH = 420;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nCols = IMP95752_HEATMAP_DELTA_LABELS.length;
  const nRows = IMP95752_HEATMAP_RHO_LABELS.length;
  const colW = cW / nCols;
  const rowH = cH / nRows;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP95752_HEATMAP_BIAS_PCT.map((col, i) =>
        col.map((bias, j) => {
          const resolved = IMP95752_HEATMAP_RESOLVED[i][j];
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
              {!resolved && (
                <line
                  x1={padL + i * colW + 4}
                  y1={padT + j * rowH + 4}
                  x2={padL + (i + 1) * colW - 4}
                  y2={padT + (j + 1) * rowH - 4}
                  stroke={ED.series2}
                  strokeWidth={1.5}
                />
              )}
            </g>
          );
        }),
      )}

      {IMP95752_HEATMAP_DELTA_LABELS.map((label, i) => (
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

      {IMP95752_HEATMAP_RHO_LABELS.map((rho, j) => (
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
  const stops = [-4, -3, -2, -1, 0, 1];
  const w = 240;
  const h = 14;
  return (
    <svg width={w} height={40} style={{ display: 'block' }}>
      {stops.slice(0, -1).map((s, i) => {
        const x0 = ((s + 4) / 5) * w;
        const x1 = ((stops[i + 1] + 4) / 5) * w;
        const mid = 10 ** ((s + stops[i + 1]) / 2);
        return <rect key={s} x={x0} y={0} width={x1 - x0} height={h} fill={cellColor(mid)} />;
      })}
      {stops.map((s) => (
        <text key={`lbl-${s}`} x={((s + 4) / 5) * w} y={h + 12} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {`10^${s}`}
        </text>
      ))}
    </svg>
  );
}

export default function Imp95752Finite80BiasHeatmapViz() {
  const flatCells = [];
  IMP95752_HEATMAP_DELTA_LABELS.forEach((label, i) => {
    IMP95752_HEATMAP_RHO_LABELS.forEach((rho, j) => {
      flatCells.push({
        delta: label,
        rho,
        D: IMP95752_HEATMAP_D[i][j],
        biasPct: IMP95752_HEATMAP_BIAS_PCT[i][j],
        resolved: IMP95752_HEATMAP_RESOLVED[i][j],
      });
    });
  });

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Finite-80 Block-Toeplitz Bias Heatmap (imp-95723 / imp-95752)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95723 tabulated the finite-80 twin-pair block-floor bias F_finite80&#47;F_inf - 1 across
        the full imp-95693 (delta, rho) grid. This heatmap shows the bias percent falling from
        ~7.27% at the smallest measured cross-pair gap (delta = ln1.2, rho = 3) down toward 0% as
        rho grows, at every in-pair gap delta. The five hatched cells in the lower-left corner
        (small delta, small rho) are float64-unresolvable: the cancellation-free dual and the
        Jacobi eigensolver both lose every significant figure there.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        bias% = 100*(F_finite80&#47;F_inf - 1), log-color scale, hatched = below float64 precision
      </p>
      <Finite80BiasHeatmap />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>D = rho*delta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>bias%</th>
          </tr>
        </thead>
        <tbody>
          {flatCells.map((c) => (
            <tr key={`${c.delta}-${c.rho}`} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.delta}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.rho}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.D.toFixed(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {c.resolved ? `${c.biasPct.toFixed(4)}` : 'below-prec'}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95752_CAVEAT_BANNER}
      </div>
    </div>
  );
}
