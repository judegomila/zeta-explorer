import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO } from '../data/imp-36141-route-ii-vs-route-i-panel-count-ratio.js';
import { ED } from '../styles/tokens.js';

const { panelRatios, honestCaveat } = IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO;
const {
  routeI_freqFactor_logN,
  routeII_freqFactor_w,
  exactGap_halfLog2,
  panelCountRatioFloor,
  panelWidthRatioCeil,
  extraPanelPct,
  panelWidthShrinkPct,
} = panelRatios;

const BARS = [
  { label: 'panel count (n)', routeI: 1, routeII: panelCountRatioFloor, deltaPct: extraPanelPct },
  { label: 'panel width (L)', routeI: 1, routeII: panelWidthRatioCeil, deltaPct: -panelWidthShrinkPct },
];

function PanelRatioChart() {
  const svgW = 560;
  const svgH = 240;
  const padL = 100;
  const padR = 40;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const rowH = plotH / BARS.length;
  const scaleMax = 1.15;
  const bw = (v) => (v / scaleMax) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {BARS.map((row, i) => {
        const y0 = padT + i * rowH;
        const barH = 16;
        const yI = y0 + rowH * 0.28 - barH / 2;
        const yII = y0 + rowH * 0.68 - barH / 2;
        return (
          <g key={row.label}>
            <text x={padL - 10} y={y0 + rowH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              {row.label}
            </text>
            <rect x={padL} y={yI} width={bw(row.routeI)} height={barH} fill={ED.series1} rx={2} />
            <text x={padL + bw(row.routeI) + 6} y={yI + barH / 2 + 4} fill={ED.inkSoft} fontSize={10}>
              Route I &mdash; 1.000
            </text>
            <rect x={padL} y={yII} width={bw(row.routeII)} height={barH} fill={ED.series7} rx={2} />
            <text x={padL + bw(row.routeII) + 6} y={yII + barH / 2 + 4} fill={ED.inkSoft} fontSize={10}>
              Route II &mdash; {row.routeII.toFixed(4)} ({row.deltaPct >= 0 ? '+' : ''}
              {row.deltaPct.toFixed(2)}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp36268PanelCountRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route II vs Route I Panel-Count / Panel-Width Ratio (imp-36268 / imp-36141)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35777 I2 cap L_panel &middot; (B/&delta;) &lt; &pi; fixes the maximum panel width
        inversely to the derivative bound B = sup|H&#8348;&prime;|, so the looser Route II bound
        needs more, narrower panels than Route I over the same abscissa interval. imp-36141 pins the
        frequency-factor component of that gap to the exact identity log&nbsp;N = w &minus;
        (1/2)&nbsp;log&nbsp;2, giving a frequency-floor panel-count ratio n&#8322;&#8324;&#8322;/n&#8322;
        = w/log&nbsp;N &asymp; {panelCountRatioFloor.toFixed(4)} (+{extraPanelPct.toFixed(2)}% panels
        for Route II), turning the imp-36054 "few percent, marginal" verdict into a number.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        normalized panel count / width, Route I = 1.000 baseline
      </p>
      <PanelRatioChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
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
            <td style={{ padding: '0.4rem 0.6rem' }}>Route I frequency factor, log N</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {routeI_freqFactor_logN.toFixed(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>Route II frequency factor, w</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {routeII_freqFactor_w.toFixed(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>exact gap, w &minus; log N</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {exactGap_halfLog2.toFixed(6)} = (1/2)&nbsp;log&nbsp;2
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>panel-count ratio floor, n&#8322;&#8324;&#8322;/n&#8322;</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {panelCountRatioFloor.toFixed(6)} (+{extraPanelPct.toFixed(2)}%)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>panel-width ratio ceiling, L&#8322;&#8324;&#8322;/L&#8322;</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {panelWidthRatioCeil.toFixed(6)} (&minus;{panelWidthShrinkPct.toFixed(2)}%)
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only, reusing the
        imp-36141 tabulation verbatim. {panelCountRatioFloor.toFixed(4)} is a frequency-floor{' '}
        <em>lower bound</em> on the true panel-count ratio &mdash; the main-term-sharpness and
        uniform-fold+disk-sup axes are same-signed (imp-36054) and push the true ratio higher, but
        keep it within a few percent. Certifies no derivative bound B, certifies no I2 cap, is not
        unconditional, changes no bound, no RH verdict, NO QED. {honestCaveat.sota}.
      </div>
    </div>
  );
}
