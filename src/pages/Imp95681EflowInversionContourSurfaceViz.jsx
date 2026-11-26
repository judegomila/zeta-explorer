import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95658_AXIS_MULTS,
  IMP95658_CONTOUR_E_MULTS,
  IMP95658_GAP_SURFACE_WITH_FLOW,
  IMP95658_GAP_SURFACE_EFLOW_ZERO,
  IMP95658_CONTOUR_WITH_FLOW,
  IMP95658_CONTOUR_EFLOW_ZERO,
  IMP95658_HEADLINE,
} from '../data/imp-95658-eflow-inversion-contour-surface-viz-data.js';
import { ED } from '../styles/tokens.js';

// Diverging color: gap < 0 (inverted) fades toward red; gap > 0 fades toward blue, both pivoting
// from the same dark background at gap = 0. minG/maxG are shared across BOTH panels so the two
// surfaces are directly comparable by eye.
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

function GapSurfacePanel({ surface, contour, minG, maxG, label }) {
  const svgW = 340;
  const padL = 44;
  const padR = 12;
  const padT = 16;
  const padB = 40;
  const svgH = 340;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const mults = IMP95658_AXIS_MULTS;
  const nCols = mults.length;
  const nRows = mults.length;
  const colW = cW / nCols;
  const rowH = cH / nRows;

  const multLo = mults[0];
  const multHi = mults[mults.length - 1];
  // x-axis: E_trunc multiplier, y-axis: C_C multiplier (low at bottom, both linear in [0.5x, 1.5x])
  const xOf = (me) => padL + ((me - multLo) / (multHi - multLo)) * cW;
  const yOf = (mc) => padT + cH - ((mc - multLo) / (multHi - multLo)) * cH;

  const contourPoints = contour.map((p) => ({
    x: xOf(p.eTrunc_mult),
    y: yOf(Math.max(p.cC_invert_mult, multLo)),
    clampedToFloor: p.clampedToFloor,
  }));
  const onGrid = contourPoints.filter((p) => !p.clampedToFloor);
  const clamped = contourPoints.filter((p) => p.clampedToFloor);

  return (
    <div>
      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.4rem', textAlign: 'center' }}>
        {label}
      </p>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        {mults.map((mc, i) =>
          mults.map((me, j) => (
            <rect
              key={`cell-${i}-${j}`}
              x={padL + j * colW}
              y={padT + cH - (i + 1) * rowH}
              width={colW}
              height={rowH}
              fill={cellColor(surface[i][j], minG, maxG)}
              stroke={ED.paper}
              strokeWidth={0.5}
            />
          )),
        )}

        {clamped.length > 1 && (
          <polyline
            points={clamped.map((p) => `${p.x},${p.y}`).join(' ')}
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

        {IMP95658_AXIS_MULTS.filter((_, j) => j % 4 === 0).map((me) => (
          <text key={`xt-${me}`} x={xOf(me)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {me.toFixed(2)}
          </text>
        ))}
        <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
          E_trunc multiplier
        </text>

        {IMP95658_AXIS_MULTS.filter((_, i) => i % 4 === 0).map((mc) => (
          <text key={`yt-${mc}`} x={padL - 8} y={yOf(mc) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {mc.toFixed(2)}
          </text>
        ))}
        <text
          x={12}
          y={padT + cH / 2}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={10}
          transform={`rotate(-90 12 ${padT + cH / 2})`}
        >
          C_C multiplier
        </text>
      </svg>
    </div>
  );
}

function ColorLegend({ minG, maxG }) {
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

export default function Imp95681EflowInversionContourSurfaceViz() {
  const h = IMP95658_HEADLINE;
  // Shared color scale across both panels so the WITH-flow inversion and the strictly-positive
  // NO-flow surface are directly comparable.
  const minG = Math.min(h.withFlow.minGap, h.eFlowZero.minGap);
  const maxG = Math.max(
    Math.max(...IMP95658_GAP_SURFACE_WITH_FLOW.map((r) => Math.max(...r))),
    Math.max(...IMP95658_GAP_SURFACE_EFLOW_ZERO.map((r) => Math.max(...r))),
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Attribution of the Inversion-Contour Wedge (imp-95658 / imp-95681)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> presentation/measurement
        only. It changes no Lambda bound and establishes no operator positivity. RH does not follow from anything on this page.
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95617/imp-95646 gap = log10 N_knee &minus; log10 N_cross surface inverts (gap &lt;
        0) in the low-C_C / high-E_trunc corner of the [0.5x, 1.5x]&sup2; multiplier box. imp-95639
        tested whether that inversion survives with the E_flow term (imp-398) switched off. It does
        not: with E_flow zeroed, the same corner stays strictly positive and the gap = 0 contour is
        pushed entirely outside the search window. The two panels below render both surfaces on a
        shared color scale, so the wedge on the left and its absence on the right can be compared
        directly.
      </p>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <GapSurfacePanel
          surface={IMP95658_GAP_SURFACE_WITH_FLOW}
          contour={IMP95658_CONTOUR_WITH_FLOW}
          minG={minG}
          maxG={maxG}
          label="WITH E_flow (inverts, box-min = -0.00468)"
        />
        <GapSurfacePanel
          surface={IMP95658_GAP_SURFACE_EFLOW_ZERO}
          contour={IMP95658_CONTOUR_EFLOW_ZERO}
          minG={minG}
          maxG={maxG}
          label="E_flow = 0 (strictly positive, box-min = +0.01708)"
        />
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--ink-faint)', fontSize: '0.78rem' }}>gap (log10 N_knee &minus; log10 N_cross):</span>
        <ColorLegend minG={minG} maxG={maxG} />
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
            <th style={{ padding: '0.4rem 0.6rem' }}>WITH E_flow</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>E_flow = 0</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>base gap (pinned point, 1x, 1x)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{h.withFlow.baseGap}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{h.eFlowZero.baseGap}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>box-min gap</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {h.withFlow.minGap} at (C_C {h.withFlow.minAt.cC_mult}x, E_trunc {h.withFlow.minAt.eTrunc_mult}x)
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {h.eFlowZero.minGap} at (C_C {h.eFlowZero.minAt.cC_mult}x, E_trunc {h.eFlowZero.minAt.eTrunc_mult}x)
            </td>
          </tr>
          <tr style={{ color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>gap = 0 contour inside box?</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{String(h.withFlow.anyInvertInBox)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{String(h.eFlowZero.anyInvertInBox)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the gap = 0 contour
        (yellow) sits inside the visible box for the WITH-E_flow surface but is clamped to the 0.1x
        floor across the whole E_trunc range once E_flow is zeroed &mdash; it leaves the [0.1x,
        1.5x] search window entirely (dashed). The imp-95617 wedge is therefore attributable to the
        E_flow (imp-398) term, not to the E_coll/E_trunc balance on its own.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {h.note}
      </div>
    </div>
  );
}
