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
} from '../data/imp-95646-transition-knee-2d-heatmap-viz-data.js';
import { IMP95635_PHYSICAL_BANDS_VS_INVERSION_WEDGE as W } from '../data/imp-95635-physical-bands-vs-inversion-wedge.js';
import { ED, alpha } from '../styles/tokens.js';

// Same diverging color scale as the imp-95646 heatmap (red = inverted, blue = ordering holds).
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

function BandVsWedgeChart() {
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
  const xOf = (me) => padL + ((me - multLo) / (multHi - multLo)) * cW;
  const yOf = (mc) => padT + cH - ((mc - multLo) / (multHi - multLo)) * cH;

  const contourPoints = IMP95646_INVERSION_CONTOUR.map((p) => ({
    x: xOf(p.eTrunc_mult),
    y: yOf(Math.max(p.cC_invert_mult, multLo)),
    offGrid: p.offGrid,
  }));
  const onGrid = contourPoints.filter((p) => !p.offGrid);
  const offGridRun = contourPoints.filter((p) => p.offGrid);

  const band = W.physicalBands;
  const bandX0 = xOf(band.E_trunc_mult.down);
  const bandX1 = xOf(band.E_trunc_mult.up);
  const bandY0 = yOf(band.C_C_mult.up);
  const bandY1 = yOf(band.C_C_mult.down);

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

      {/* imp-95635 provenance-grounded physical band, overlaid on the arbitrary +/-50% box */}
      <rect
        x={bandX0}
        y={bandY0}
        width={bandX1 - bandX0}
        height={bandY1 - bandY0}
        fill={alpha(ED.series3, 0.12)}
        stroke={ED.series3}
        strokeWidth={2}
      />

      {/* pinned point */}
      <circle cx={xOf(1)} cy={yOf(1)} r={5} fill="none" stroke={ED.series1} strokeWidth={2} />

      {/* box-corner minimum gap (arbitrary box wedge extremum) */}
      <rect
        x={xOf(IMP95646_MIN_GAP_POINT.eTrunc_mult) - 4}
        y={yOf(IMP95646_MIN_GAP_POINT.cC_mult) - 4}
        width={8}
        height={8}
        fill="none"
        stroke={ED.series2}
        strokeWidth={2}
      />

      {/* most-adverse physical corner (imp-95635 P2): still positive gap, no inversion */}
      <circle
        cx={xOf(W.physicalCorner.at.E_trunc_mult)}
        cy={yOf(W.physicalCorner.at.C_C_mult)}
        r={5}
        fill={ED.series3}
        stroke={ED.paper}
        strokeWidth={1}
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
      <text x={padL + cW - 4} y={padT + 24} textAnchor="end" fill={ED.series3} fontSize={9}>
        imp-95635 physical band
      </text>
      <text x={padL + cW - 4} y={padT + 36} textAnchor="end" fill={ED.series1} fontSize={9}>
        pinned point
      </text>
      <text x={padL + cW - 4} y={padT + 48} textAnchor="end" fill={ED.series2} fontSize={9}>
        arbitrary box-corner minimum
      </text>
    </svg>
  );
}

export default function Imp95670PhysicalBandVsWedgeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Physical Band vs. the Arbitrary-Box Inversion Wedge (imp-95635 / imp-95670)" />

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
        It changes no Lambda bound and establishes no operator positivity. RH does not follow from anything on this page.
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95617 sweep found the transition-before-knee ordering inverts (gap &lt; 0, red) in
        the low-C_C / high-E_trunc corner of an <em>arbitrary</em> [0.5x, 1.5x] &times; [0.5x, 1.5x]
        multiplier box. The green rectangle is the imp-95635 provenance-grounded physical band
        instead &mdash; C_C &isin; [{W.physicalBands.C_C_mult.down}x, {W.physicalBands.C_C_mult.up}x]
        from the Koksma&ndash;Hlawka / tangency-remainder provenance, E_trunc &isin;
        [{W.physicalBands.E_trunc_mult.down}x, {W.physicalBands.E_trunc_mult.up}x] from the honest
        Ingham/Guth&ndash;Maynard route. The physical band sits well clear of the yellow gap = 0
        contour and never reaches the pink arbitrary-box wedge: the filled green dot marks the
        most-adverse physical corner (best-case C_C, generous E_trunc), and its gap stays positive.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        gap heatmap with physical band overlay, C_C &isin; [{IMP95646_HEATMAP_CC_LABELS[0]}x,{' '}
        {IMP95646_HEATMAP_CC_LABELS[IMP95646_HEATMAP_CC_LABELS.length - 1]}x], E_trunc &isin; [
        {IMP95646_HEATMAP_ETRUNC_LABELS[0]}x,{' '}
        {IMP95646_HEATMAP_ETRUNC_LABELS[IMP95646_HEATMAP_ETRUNC_LABELS.length - 1]}x]
      </p>
      <BandVsWedgeChart />

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
            <td style={{ padding: '0.4rem 0.6rem' }}>pinned-point gap</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{IMP95646_PINNED_POINT.gap}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>arbitrary box-corner minimum gap</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP95646_MIN_GAP_POINT.gap} at (C_C {IMP95646_MIN_GAP_POINT.cC_mult}x, E_trunc{' '}
              {IMP95646_MIN_GAP_POINT.eTrunc_mult}x)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>physical C_C band</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              [{W.physicalBands.C_C_mult.down}x, {W.physicalBands.C_C_mult.up}x]
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>physical E_trunc band</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              [{W.physicalBands.E_trunc_mult.down}x, {W.physicalBands.E_trunc_mult.up}x] (one-sided down)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>gap at most-adverse physical corner</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {W.physicalCorner.gap} (inverts: {String(W.physicalCorner.inverts)})
            </td>
          </tr>
          <tr style={{ color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>C_C shrink needed to invert vs. physically available</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {W.contourShortfall.shrink_needed_to_invert}x needed &gt;{' '}
              {W.contourShortfall.shrink_physically_available}x available
            </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the green physical band is a
        small sliver of the full grey/colored box, sitting on the blue (gap &gt; 0) side of the
        yellow contour throughout. Its worst corner (filled green dot) still falls short of the
        contour by a C_C shrink of about 1.95x needed vs. only about 1.73x physically available
        (imp-95635 P3). The pink square &mdash; the arbitrary box's own extremum &mdash; sits far
        outside the green band entirely, in the direction (E_trunc up to 1.5x) that the physical
        band's one-sided-down E_trunc uncertainty never reaches.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {W.verdict}
      </div>
    </div>
  );
}
