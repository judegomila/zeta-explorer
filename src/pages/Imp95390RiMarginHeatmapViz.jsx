import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95390_HEATMAP_X_LABELS,
  IMP95390_HEATMAP_R_LABELS,
  IMP95390_HEATMAP_Z,
  IMP95390_RSTAR_BOUNDARY,
  IMP95390_SUMMARY,
} from '../data/imp-95390-ri-margin-heatmap-viz-data.js';
import { ED } from '../styles/tokens.js';

// Sequential color: 0 (outside the bump, RI free) stays background-dark,
// rising toward 1 (tightest, near-saturating RI) fades toward amber/red.
function cellColor(ratio) {
  const bg = { r: 15, g: 23, b: 42 };
  const hi = { r: 248, g: 113, b: 113 };
  const t = Math.max(0, Math.min(1, ratio));
  return `rgb(${Math.round(bg.r + (hi.r - bg.r) * t)},${Math.round(bg.g + (hi.g - bg.g) * t)},${Math.round(bg.b + (hi.b - bg.b) * t)})`;
}

function RiMarginHeatmap() {
  const svgW = 720;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 44;
  const svgH = 380;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nCols = IMP95390_HEATMAP_X_LABELS.length;
  const nRows = IMP95390_HEATMAP_R_LABELS.length;
  const colW = cW / nCols;
  const rowH = cH / nRows;

  const xLo = Math.log(IMP95390_HEATMAP_X_LABELS[0]);
  const xHi = Math.log(IMP95390_HEATMAP_X_LABELS[nCols - 1]);
  const rLo = Math.log(IMP95390_HEATMAP_R_LABELS[0]);
  const rHi = Math.log(IMP95390_HEATMAP_R_LABELS[nRows - 1]);
  // row 0 (r smallest) plots at the bottom, matching the heatmap grid below
  const xOf = (x) => padL + ((Math.log(x) - xLo) / (xHi - xLo)) * cW;
  const yOf = (r) => padT + cH - ((Math.log(r) - rLo) / (rHi - rLo)) * cH;

  const boundaryPoints = IMP95390_RSTAR_BOUNDARY.map((p) => ({
    x: xOf(p.x),
    y: yOf(p.rStar),
    offGrid: p.offGrid,
  }));
  const onGrid = boundaryPoints.filter((p) => !p.offGrid);
  const offGridRun = boundaryPoints.filter((p) => p.offGrid);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP95390_HEATMAP_X_LABELS.map((x, i) =>
        IMP95390_HEATMAP_R_LABELS.map((r, j) => (
          <rect
            key={`cell-${i}-${j}`}
            x={padL + i * colW}
            y={padT + cH - (j + 1) * rowH}
            width={colW}
            height={rowH}
            fill={cellColor(IMP95390_HEATMAP_Z[i][j])}
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

      {/* extremum corner marker: ratio -> 0.99998744 as (x -> 0, r -> 1) */}
      <circle
        cx={xOf(IMP95390_HEATMAP_X_LABELS[0])}
        cy={yOf(IMP95390_HEATMAP_R_LABELS[0])}
        r={5}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />

      {[0.02, 0.05, 0.1, 0.3, 0.5, 1, 1.5].map((x) => (
        <text
          key={`xt-${x}`}
          x={xOf(x)}
          y={padT + cH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9.5}
        >
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        x (log scale)
      </text>

      {[1.001, 1.1, 1.5, 2, 5, 10, 20].map((r) => (
        <text
          key={`rt-${r}`}
          x={padL - 8}
          y={yOf(r) + 3}
          textAnchor="end"
          fill={ED.inkFaint}
          fontSize={9.5}
        >
          {r}
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
        r (log scale)
      </text>

      <text x={padL + cW - 4} y={padT + 12} textAnchor="end" fill={ED.brass} fontSize={9}>
        r_star(x) bump-wedge boundary
      </text>
      <text x={padL + cW - 4} y={padT + 24} textAnchor="end" fill={ED.series1} fontSize={9}>
        corner extremum (ratio -&gt; 0.99998744)
      </text>
    </svg>
  );
}

function ColorLegend() {
  const stops = [0, 0.25, 0.5, 0.75, 1];
  const w = 260;
  const h = 14;
  return (
    <svg width={w} height={40} style={{ display: 'block' }}>
      {stops.slice(0, -1).map((s, i) => {
        const x0 = s * w;
        const x1 = stops[i + 1] * w;
        const mid = (s + stops[i + 1]) / 2;
        return <rect key={s} x={x0} y={0} width={x1 - x0} height={h} fill={cellColor(mid)} />;
      })}
      {stops.map((s) => (
        <text key={`lbl-${s}`} x={s * w} y={h + 12} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {s.toFixed(2)}
        </text>
      ))}
    </svg>
  );
}

export default function Imp95390RiMarginHeatmapViz() {
  const s = IMP95390_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="RI-Margin Tightness Map with the r_star(x) Bump-Wedge Boundary (imp-95271 / imp-95390)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement only. It changes
        no Lambda bound and establishes no operator positivity. Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains state of the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95231 LEMMA RI reduces ratio-monotonicity of Lambda_2 in r to the sign of a margin
        M(x, r) = RHS &minus; LHS, and imp-95271 swept it densely over a 171,600-cell (x, r) grid
        with zero sign changes. This page re-renders that map at a coarser, render-friendly
        resolution: cell color is the RI tightness ratio LHS/RHS &isin; [0, 1] wherever the h_r
        &gt; 0 bump is non-trivial (elsewhere RI is free, shown as background). The yellow curve
        is the r_star(x) boundary of that bump &mdash; the root of h_r(x, r) = 0 &mdash; dashed
        where it runs off the visible r-range (it diverges to +infinity as x &rarr; 0).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        RI tightness ratio LHS/RHS heatmap, x &isin; [{IMP95390_HEATMAP_X_LABELS[0]},{' '}
        {IMP95390_HEATMAP_X_LABELS[IMP95390_HEATMAP_X_LABELS.length - 1]}], r &isin; [
        {IMP95390_HEATMAP_R_LABELS[0]}, {IMP95390_HEATMAP_R_LABELS[IMP95390_HEATMAP_R_LABELS.length - 1]}]
      </p>
      <RiMarginHeatmap />

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--ink-faint)', fontSize: '0.78rem' }}>tightness ratio LHS/RHS:</span>
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
            <td style={{ padding: '0.4rem 0.6rem' }}>grid scope (imp-95271 full sweep)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.gridScope}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>max tightness ratio LHS/RHS</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {s.maxRatioLHSoverRHS} at {s.maxRatioLocation}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>deep-interior max ratio (x&isin;[0.3,0.9])</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.deepInteriorMaxRatio}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>bump-wedge cell fraction</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.bumpCellFraction}</td>
          </tr>
          <tr style={{ color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>counterexamples (M &lt; 0)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.counterexamples}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the wedge { '{' } x &lt;
        1, 1 &lt; r &lt; r_star(x) { '}' } is the only region where RI is non-trivial; everywhere
        else the bound is free and the cell is left dark. Inside the wedge, tightness rises
        sharply toward the (x &rarr; 0, r &rarr; 1) corner (circled), matching the imp-95271
        finding that the numerically tightest point coincides with the boundary already proven by
        THEOREM COAL-DESC &mdash; the interior of the wedge carries comfortable slack (ratio
        &le; 0.9166 on x &isin; [0.3, 0.9]).
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
