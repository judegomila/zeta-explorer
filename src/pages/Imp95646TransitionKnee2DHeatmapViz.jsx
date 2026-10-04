import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95646_HEATMAP_CC_LABELS,
  IMP95646_HEATMAP_ETRUNC_LABELS,
  IMP95646_HEATMAP_Z,
  IMP95646_MAX_GAP,
  IMP95646_MIN_GAP_POINT,
  IMP95646_INVERSION_CONTOUR,
  IMP95646_PINNED_POINT,
  IMP95646_PINNED_DISTANCE_TO_CONTOUR,
  IMP95646_SUMMARY,
} from '../data/imp-95646-transition-knee-2d-heatmap-viz-data.js';
import { ED } from '../styles/tokens.js';

// Diverging color: gap < 0 (ordering inverted) fades toward red; gap > 0 (transition still
// precedes the knee) fades toward blue; both pivot from the same dark background at gap = 0.
function cellColor(g, minG, maxG) {
  const bg = { r: 15, g: 23, b: 42 };
  if (g < 0) {
    const t = Math.max(0, Math.min(1, g / minG));
    const neg = { r: 239, g: 68, b: 68 };
    return `rgb(${Math.round(bg.r + (neg.r - bg.r) * t)},${Math.round(bg.g + (neg.g - bg.g) * t)},${Math.round(bg.b + (neg.b - bg.b) * t)})`;
  }
  const t = Math.max(0, Math.min(1, g / maxG));
  const pos = { r: 56, g: 189, b: 248 };
  return `rgb(${Math.round(bg.r + (pos.r - bg.r) * t)},${Math.round(bg.g + (pos.g - bg.g) * t)},${Math.round(bg.b + (pos.b - bg.b) * t)})`;
}

function TransitionKneeHeatmap() {
  const svgW = 720;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 44;
  const svgH = 420;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nCols = IMP95646_HEATMAP_ETRUNC_LABELS.length;
  const nRows = IMP95646_HEATMAP_CC_LABELS.length;
  const colW = cW / nCols;
  const rowH = cH / nRows;

  const multLo = IMP95646_HEATMAP_CC_LABELS[0];
  const multHi = IMP95646_HEATMAP_CC_LABELS[nRows - 1];
  // x-axis: E_trunc multiplier, y-axis: C_C multiplier (low at bottom, both linear in [0.5x, 1.5x])
  const xOf = (me) => padL + ((me - multLo) / (multHi - multLo)) * cW;
  const yOf = (mc) => padT + cH - ((mc - multLo) / (multHi - multLo)) * cH;

  const contourPoints = IMP95646_INVERSION_CONTOUR.map((p) => ({
    x: xOf(p.eTrunc_mult),
    y: yOf(Math.max(p.cC_invert_mult, multLo)),
    offGrid: p.offGrid,
  }));
  const onGrid = contourPoints.filter((p) => !p.offGrid);
  const offGridRun = contourPoints.filter((p) => p.offGrid);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP95646_HEATMAP_CC_LABELS.map((mc, i) =>
        IMP95646_HEATMAP_ETRUNC_LABELS.map((me, j) => (
          <rect
            key={`cell-${i}-${j}`}
            x={padL + j * colW}
            y={padT + cH - (i + 1) * rowH}
            width={colW}
            height={rowH}
            fill={cellColor(IMP95646_HEATMAP_Z[i][j], IMP95646_MIN_GAP_POINT.gap, IMP95646_MAX_GAP)}
            stroke={ED.paper}
            strokeWidth={0.5}
          />
        )),
      )}

      {offGridRun.length > 1 && (
        <polyline
          points={offGridRun.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={ED.brassDeco}
          strokeWidth={2}
          strokeDasharray="3,3"
          opacity={0.7}
        />
      )}
      {onGrid.length > 1 && (
        <polyline
          points={onGrid.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={ED.brassDeco}
          strokeWidth={2.25}
        />
      )}

      {/* pinned point: C_C = C_C_PINNED, E_trunc = E_TRUNC_PT (multiplier 1x, 1x) */}
      <circle cx={xOf(1)} cy={yOf(1)} r={5} fill="none" stroke={ED.series1} strokeWidth={2} />

      {/* box-corner minimum gap: low-C_C / high-E_trunc inversion wedge extremum */}
      <rect
        x={xOf(IMP95646_MIN_GAP_POINT.eTrunc_mult) - 4}
        y={yOf(IMP95646_MIN_GAP_POINT.cC_mult) - 4}
        width={8}
        height={8}
        fill="none"
        stroke={ED.series2}
        strokeWidth={2}
      />

      {IMP95646_HEATMAP_ETRUNC_LABELS.filter((_, j) => j % 2 === 0).map((me) => (
        <text key={`xt-${me}`} x={xOf(me)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {me.toFixed(2)}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        E_trunc multiplier
      </text>

      {IMP95646_HEATMAP_CC_LABELS.filter((_, i) => i % 2 === 0).map((mc) => (
        <text key={`yt-${mc}`} x={padL - 8} y={yOf(mc) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {mc.toFixed(2)}
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
        C_C multiplier
      </text>

      <text x={padL + cW - 4} y={padT + 12} textAnchor="end" fill={ED.brass} fontSize={9}>
        gap = 0 inversion contour
      </text>
      <text x={padL + cW - 4} y={padT + 24} textAnchor="end" fill={ED.series1} fontSize={9}>
        pinned point (C_C_PINNED, E_TRUNC_PT)
      </text>
      <text x={padL + cW - 4} y={padT + 36} textAnchor="end" fill={ED.series2} fontSize={9}>
        box-corner minimum gap
      </text>
    </svg>
  );
}

function ColorLegend() {
  const minG = IMP95646_MIN_GAP_POINT.gap;
  const maxG = IMP95646_MAX_GAP;
  const stops = [minG, minG / 2, 0, maxG / 2, maxG];
  const w = 280;
  const h = 14;
  return (
    <svg width={w} height={40} style={{ display: 'block' }}>
      {stops.slice(0, -1).map((s, i) => {
        const x0 = (i / (stops.length - 1)) * w;
        const x1 = ((i + 1) / (stops.length - 1)) * w;
        const mid = (s + stops[i + 1]) / 2;
        return <rect key={s} x={x0} y={0} width={x1 - x0} height={h} fill={cellColor(mid, minG, maxG)} />;
      })}
      {stops.map((s, i) => (
        <text
          key={`lbl-${s}`}
          x={(i / (stops.length - 1)) * w}
          y={h + 12}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          {s.toFixed(4)}
        </text>
      ))}
    </svg>
  );
}

export default function Imp95646TransitionKnee2DHeatmapViz() {
  const s = IMP95646_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Joint (C_C, E_trunc) Transition-Before-Knee Gap Contour (imp-95617 / imp-95646)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement/sensitivity only.
        It changes no Lambda bound and establishes no operator positivity. Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains state of the art. RH does not follow from anything on this page.
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95598 swept C_C and E_trunc one at a time and found the imp-95582 F3
        transition-before-knee ordering (gap = log10 N_knee &minus; log10 N_cross &gt; 0) survives
        each &plusmn;50% band on its own. Because the knee is not a pure function of A =
        C_C/E_trunc, the two 1-D bands do not cover the joint plane. This heatmap shades gap over
        the full [0.5x, 1.5x] &times; [0.5x, 1.5x] box: red where the ordering inverts (gap &lt;
        0), blue where it still holds. The yellow curve is the gap = 0 inversion contour, dashed
        where it runs below the visible C_C range; the cyan circle marks the pinned point (C_C =
        C_C_PINNED, E_trunc = E_TRUNC_PT); the pink square marks the box-corner minimum.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        gap heatmap, C_C &isin; [{IMP95646_HEATMAP_CC_LABELS[0]}x,{' '}
        {IMP95646_HEATMAP_CC_LABELS[IMP95646_HEATMAP_CC_LABELS.length - 1]}x], E_trunc &isin; [
        {IMP95646_HEATMAP_ETRUNC_LABELS[0]}x,{' '}
        {IMP95646_HEATMAP_ETRUNC_LABELS[IMP95646_HEATMAP_ETRUNC_LABELS.length - 1]}x]
      </p>
      <TransitionKneeHeatmap />

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--ink-faint)', fontSize: '0.78rem' }}>gap (log10 N_knee &minus; log10 N_cross):</span>
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
            <th style={{ padding: '0.4rem 0.6rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>grid scope</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.gridScope}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>pinned-point gap (C_C_PINNED, E_TRUNC_PT)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.pinnedGap}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>box-corner minimum gap</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {s.minGap} at (C_C {s.minGapAt.cC_mult}x, E_trunc {s.minGapAt.eTrunc_mult}x)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>pinned-point distance to contour (multiplier space)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.pinnedDistanceToContour}</td>
          </tr>
          <tr style={{ color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>box-inversion onset (E_trunc multiplier)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.boxInversionOnsetETruncMult}x</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> neither 1-D edge of the box
        inverts on its own (the E_trunc column at C_C = 1x and the C_C row at E_trunc = 1x both stay
        blue), yet the low-C_C / high-E_trunc corner does &mdash; the wedge is only visible once both
        axes move together. The pinned point sits roughly half a multiplier away from the contour
        (Euclidean distance in multiplier space), a margin set almost entirely by the C_C axis:
        reaching the wedge needs C_C to shrink toward its 0.5x edge, not just E_trunc to rise.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {s.verdict}
      </div>
    </div>
  );
}
