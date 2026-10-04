import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33822_HEATMAP_X_LABELS,
  IMP33822_HEATMAP_Y_LABELS,
  IMP33822_HEATMAP_Z,
  IMP33822_CONTOUR_OVERLAY,
  IMP33822_CAVEAT_BANNER,
} from '../data/imp-33822-decoupled-rate-grid-heatmap-viz-data.js';
import { ED } from '../styles/tokens.js';

// Diverging log-scale color: below ||R|| = 1 fades toward blue, above fades toward red.
function cellColor(z) {
  const logZ = Math.log10(Math.max(z, 1e-6));
  const t = Math.max(-1, Math.min(1, logZ / 3));
  const bg = { r: 15, g: 23, b: 42 };
  if (t <= 0) {
    const lo = { r: 56, g: 189, b: 248 };
    const w = -t;
    return `rgb(${Math.round(bg.r + (lo.r - bg.r) * w)},${Math.round(bg.g + (lo.g - bg.g) * w)},${Math.round(bg.b + (lo.b - bg.b) * w)})`;
  }
  const hi = { r: 248, g: 113, b: 113 };
  const w = t;
  return `rgb(${Math.round(bg.r + (hi.r - bg.r) * w)},${Math.round(bg.g + (hi.g - bg.g) * w)},${Math.round(bg.b + (hi.b - bg.b) * w)})`;
}

// Fractional row position (0 = top row, rows.length - 1 = bottom row) for a ratio value,
// linearly interpolated between the bracketing IMP33822_HEATMAP_Y_LABELS entries.
function ratioToRowFrac(ratio, yLabels) {
  for (let i = 0; i < yLabels.length - 1; i++) {
    if (ratio >= yLabels[i] && ratio <= yLabels[i + 1]) {
      return i + (ratio - yLabels[i]) / (yLabels[i + 1] - yLabels[i]);
    }
  }
  return ratio < yLabels[0] ? 0 : yLabels.length - 1;
}

function DecoupledRateHeatmap() {
  const svgW = 720;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 44;
  const svgH = 380;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nCols = IMP33822_HEATMAP_X_LABELS.length;
  const nRows = IMP33822_HEATMAP_Y_LABELS.length;
  const colW = cW / nCols;
  const rowH = cH / nRows;

  const contourPoints = IMP33822_CONTOUR_OVERLAY.map((c) => {
    const colIdx = IMP33822_HEATMAP_X_LABELS.indexOf(c.sShear);
    const rowFrac = ratioToRowFrac(c.ratio, IMP33822_HEATMAP_Y_LABELS);
    return { x: padL + (colIdx + 0.5) * colW, y: padT + rowFrac * rowH };
  });

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP33822_HEATMAP_Z.map((row, i) =>
        row.map((z, j) => (
          <rect
            key={`cell-${i}-${j}`}
            x={padL + i * colW}
            y={padT + j * rowH}
            width={colW}
            height={rowH}
            fill={cellColor(z)}
            stroke={ED.paper}
            strokeWidth={1}
          />
        )),
      )}

      <polyline
        points={contourPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={2}
        strokeDasharray="6,3"
      />
      {contourPoints.map((p, i) => (
        <circle key={`ct-${i}`} cx={p.x} cy={p.y} r={3.25} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={0.75} />
      ))}

      {IMP33822_HEATMAP_X_LABELS.map((sa, i) => (
        <text
          key={`xt-${i}`}
          x={padL + (i + 0.5) * colW}
          y={padT + cH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9.5}
        >
          {sa}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        shear rate s_a
      </text>

      {IMP33822_HEATMAP_Y_LABELS.map((ratio, j) => (
        <text
          key={`yt-${j}`}
          x={padL - 8}
          y={padT + (j + 0.5) * rowH + 3}
          textAnchor="end"
          fill={ED.inkFaint}
          fontSize={9.5}
        >
          {ratio}
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
        pass/shear ratio s_b / s_a
      </text>

      <text x={padL + cW - 4} y={padT + 12} textAnchor="end" fill={ED.brass} fontSize={9}>
        ||R|| = 1 crossing contour
      </text>
    </svg>
  );
}

function ColorLegend() {
  const stops = [-3, -2, -1, 0, 1, 2, 3];
  const w = 260;
  const h = 14;
  return (
    <svg width={w} height={40} style={{ display: 'block' }}>
      {stops.slice(0, -1).map((s, i) => {
        const x0 = ((s + 3) / 6) * w;
        const x1 = ((stops[i + 1] + 3) / 6) * w;
        const mid = 10 ** ((s + stops[i + 1]) / 2);
        return <rect key={s} x={x0} y={0} width={x1 - x0} height={h} fill={cellColor(mid)} />;
      })}
      {stops.map((s) => (
        <text key={`lbl-${s}`} x={(((s + 3) / 6) * w)} y={h + 12} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {`10^${s}`}
        </text>
      ))}
    </svg>
  );
}

export default function Imp33833DecoupledRateHeatmapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Decoupled Pass/Shear-Rate ||R|| Heatmap (imp-33789 / imp-33822 / imp-33833)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33822 reshaped the imp-33789 two-parameter decoupled-rate grid into a heatmap-ready
        form: shear rate s_a on the x-axis, pass/shear ratio s_b&#47;s_a on the y-axis, and the
        Perron norm ||R|| as the cell color. This page is the first consumer of that module. The
        dashed yellow line is the imp-33789 ||R|| = 1 crossing contour: for every s_a the norm
        falls below unity only once the ratio overshoots past the coupled anchor (ratio = 1), and
        that overshoot cost shrinks as the shear stiffens.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        ||R||(s_a, s_b&#47;s_a) heatmap, log-color scale, s_a in {'{1,2,3,4,6,8}'}
      </p>
      <DecoupledRateHeatmap />

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--ink-faint)', fontSize: '0.78rem' }}>||R|| color scale (log10):</span>
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
            <th style={{ padding: '0.4rem 0.6rem' }}>s_a</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>crossing ratio s_b*&#47;s_a</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>crossing pass rate s_b*</th>
          </tr>
        </thead>
        <tbody>
          {IMP33822_CONTOUR_OVERLAY.map((c) => (
            <tr key={c.sShear} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.sShear}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.ratio.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.sPassStar.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP33822_CAVEAT_BANNER}
      </div>
    </div>
  );
}
