import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95547_K_VALUES,
  IMP95547_H_VALUES,
  IMP95547_ALPHA_GRID_LO,
  IMP95547_ALPHA_ONE_BOUNDARY_H,
  IMP95547_WEIGHTS,
  IMP95547_SUMMARY,
  IMP95547_N_LO,
  IMP95547_N_HI,
} from '../data/imp-95547-alpha-kh-heat-scatter-viz-data.js';
import { ED } from '../styles/tokens.js';

// Diverging color: alpha < 1 (in Montgomery on-RH range) fades toward blue,
// alpha > 1 (PCC-gated, out of range) fades toward red, centered at alpha = 1.
function cellColor(alpha) {
  const lo = { r: 30, g: 64, b: 175 }; // alpha ~ 0.4 (blue)
  const mid = { r: 15, g: 23, b: 42 }; // alpha = 1 (background)
  const hi = { r: 220, g: 38, b: 38 }; // alpha ~ 1.1 (red, gated)
  if (alpha >= 1) {
    const t = Math.min(1, (alpha - 1) / 0.11);
    return `rgb(${Math.round(mid.r + (hi.r - mid.r) * t)},${Math.round(mid.g + (hi.g - mid.g) * t)},${Math.round(mid.b + (hi.b - mid.b) * t)})`;
  }
  const t = Math.min(1, (1 - alpha) / 0.6);
  return `rgb(${Math.round(mid.r + (lo.r - mid.r) * t)},${Math.round(mid.g + (lo.g - mid.g) * t)},${Math.round(mid.b + (lo.b - mid.b) * t)})`;
}

function AlphaHeatmap() {
  const svgW = 760;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 60;
  const rowH = 30;
  const svgH = padT + rowH * IMP95547_K_VALUES.length + padB;
  const cW = svgW - padL - padR;
  const colW = cW / IMP95547_H_VALUES.length;
  const boundaryX = padL + (IMP95547_ALPHA_ONE_BOUNDARY_H - 1) * colW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP95547_K_VALUES.map((k, ki) =>
        IMP95547_H_VALUES.map((h, hi) => (
          <rect
            key={`cell-${k}-${h}`}
            x={padL + hi * colW}
            y={padT + ki * rowH}
            width={colW}
            height={rowH}
            fill={cellColor(IMP95547_ALPHA_GRID_LO[ki][hi])}
            stroke={ED.paper}
            strokeWidth={0.3}
          />
        )),
      )}

      <line
        x1={boundaryX}
        y1={padT}
        x2={boundaryX}
        y2={padT + rowH * IMP95547_K_VALUES.length}
        stroke={ED.brassDeco}
        strokeWidth={1.75}
        strokeDasharray="4,3"
      />
      <text x={boundaryX} y={padT - 4} textAnchor="middle" fill={ED.brass} fontSize={9.5}>
        h* = {IMP95547_ALPHA_ONE_BOUNDARY_H.toFixed(2)} (alpha = 1, k = 1 only)
      </text>

      {IMP95547_K_VALUES.map((k, ki) => (
        <text
          key={`kt-${k}`}
          x={padL - 8}
          y={padT + ki * rowH + rowH / 2 + 3}
          textAnchor="end"
          fill={ED.inkSoft}
          fontSize={10}
        >
          k={k}
        </text>
      ))}

      {[1, 20, 40, 60, 80, 96].map((h) => (
        <text
          key={`ht-${h}`}
          x={padL + (h - 1) * colW + colW / 2}
          y={padT + rowH * IMP95547_K_VALUES.length + 14}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9.5}
        >
          {h}
        </text>
      ))}
      <text
        x={padL + cW / 2}
        y={svgH - 30}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
      >
        h (alias index, p = 97)
      </text>

      <text x={padL + cW - 4} y={svgH - 14} textAnchor="end" fill={ED.series2} fontSize={9}>
        alpha &gt; 1: PCC-gated (h in 82..96, k = 1)
      </text>
      <text x={padL + cW - 4} y={svgH - 2} textAnchor="end" fill={ED.series1} fontSize={9}>
        alpha &lt; 1: Montgomery on-RH range
      </text>
    </svg>
  );
}

function WeightBar() {
  const svgW = 760;
  const padL = 44;
  const padR = 16;
  const padT = 8;
  const padB = 22;
  const svgH = 90;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;
  const colW = cW / IMP95547_H_VALUES.length;
  const maxW = Math.max(...IMP95547_WEIGHTS);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP95547_H_VALUES.map((h, hi) => {
        const gated = h > IMP95547_ALPHA_ONE_BOUNDARY_H;
        const barH = (IMP95547_WEIGHTS[hi] / maxW) * cH;
        return (
          <rect
            key={`w-${h}`}
            x={padL + hi * colW}
            y={padT + cH - barH}
            width={Math.max(colW - 0.5, 0.5)}
            height={barH}
            fill={gated ? ED.series2 : ED.series1}
            opacity={0.8}
          />
        );
      })}
      <text x={padL} y={svgH - 6} textAnchor="start" fill={ED.inkFaint} fontSize={9.5}>
        h = 1
      </text>
      <text x={padL + cW} y={svgH - 6} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
        h = 96
      </text>
    </svg>
  );
}

export default function Imp95547AlphaKhHeatScatterViz() {
  const s = IMP95547_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="alpha_{k,h} Across the (k, h) Alias Grid: the imp-95519 PCC-Gated Region" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> presentation only. It changes
        no Lambda bound and establishes no operator positivity. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95519 section 4 gives the Montgomery frequency of the (k, h) Fresnel-Airy packet as
        alpha_&#123;k,h&#125; = 1 + log(1/(2&pi;(k &minus; h/p)))/log&nbsp;T, and finds
        alpha_&#123;k,h&#125; &gt; 1 exactly when k = 1 and h &gt; p(1 &minus; 1/(2&pi;)) &asymp;{' '}
        {s.alphaOneBoundaryH.toFixed(2)} &mdash; at p = 97 that is h &isin;
        &#123;{s.gatedHRange}&#125;, {s.gatedCount} of 96 aliases, carrying{' '}
        {(s.gatedShare * 100).toFixed(2)}% of the named-scalar majorant mass. That region sits
        outside Montgomery&rsquo;s on-RH range |alpha| &le; 1 (needs the pair-correlation
        conjecture proper), which is the section-4 PCC-gating verdict. The heatmap below charts
        alpha_&#123;k,h&#125; over k = 1..6, h = 1..96 at the window-bottom endpoint N ={' '}
        {IMP95547_N_LO.toLocaleString()} (T &asymp; 3.0e12); alpha_max there is{' '}
        {s.alphaMaxLo.toFixed(4)}, falling to {s.alphaMaxHi.toFixed(4)} at the window-top
        endpoint N = {IMP95547_N_HI.toLocaleString()} (T &asymp; 1.89e16) &mdash; only k = 1
        ever reaches alpha &gt; 1.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        alpha_&#123;k,h&#125; heatmap, k = 1..6, h = 1..96, N = {IMP95547_N_LO.toLocaleString()}
      </p>
      <AlphaHeatmap />

      <p
        style={{
          color: 'var(--ink-faint)',
          fontWeight: 700,
          fontSize: '0.82rem',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
        }}
      >
        illustrative per-alias majorant weight w(h) &prop; min(h, p&minus;h)^&#123;-2/3&#125;
        (red = gated aliases h &isin; &#123;{s.gatedHRange}&#125;)
      </p>
      <WeightBar />

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
            <td style={{ padding: '0.4rem 0.6rem' }}>alpha = 1 boundary h* (k = 1, N-independent)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {s.alphaOneBoundaryH.toFixed(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>gated aliases (p = 97)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {s.gatedCount} of 96, h &isin; &#123;{s.gatedHRange}&#125;
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>gated share of majorant mass</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {(s.gatedShare * 100).toFixed(2)}%
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>alpha_max (N = {IMP95547_N_LO.toLocaleString()})</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.alphaMaxLo.toFixed(4)}</td>
          </tr>
          <tr style={{ color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>alpha_max (N = {IMP95547_N_HI.toLocaleString()})</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.alphaMaxHi.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> every row k &ge; 2 stays
        blue (alpha &lt; 1, in Montgomery&rsquo;s on-RH range) across the whole h range; only the
        k = 1 row crosses the yellow boundary into red for h &gt; h*, the PCC-gated aliases
        imp-95519 identifies as carrying the majority of the majorant mass yet sitting outside the
        range where Montgomery&rsquo;s theorem (on RH) evaluates F(alpha).
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
