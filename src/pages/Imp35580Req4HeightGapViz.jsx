import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35580_LOG_HEIGHT_BARS,
  IMP35580_SUMMARY,
} from '../data/imp-35580-req4-height-gap-viz-data.js';
import { ED } from '../styles/tokens.js';

function LogHeightBarChart() {
  const w = 720;
  const h = 320;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 56;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const maxLogT0 = Math.max(...IMP35580_LOG_HEIGHT_BARS.map((b) => b.logT0)) * 1.08;
  const barCount = IMP35580_LOG_HEIGHT_BARS.length;
  const gap = 24;
  const barW = (plotW - gap * (barCount - 1)) / barCount;

  const yPix = (v) => padT + plotH - (v / maxLogT0) * plotH;

  const yTicks = [0, 50, 100, 150, 200];

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={w - padR} y1={yPix(t)} y2={yPix(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yPix(t) + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {t}
          </text>
        </g>
      ))}
      <line x1={padL} x2={w - padR} y1={padT + plotH} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {IMP35580_LOG_HEIGHT_BARS.map((bar, i) => {
        const x = padL + i * (barW + gap);
        const y = yPix(bar.logT0);
        const barH = padT + plotH - y;
        const color = bar.key === 'needed' ? ED.series4 : ED.series1;
        return (
          <g key={bar.key}>
            <rect x={x} y={y} width={barW} height={barH} fill={color} rx={2} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={ED.ink} fontSize={11}>
              {bar.logT0.toFixed(2)}
            </text>
            <text x={x + barW / 2} y={h - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {bar.label.split(' (')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp35580Req4HeightGapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="REQ-4 Required-Height Gap: log T0 Needed vs Actual Landmarks (imp-35580)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35538 REQ-4 asks: even granting a GUE local law with an explicit finite-N rate
        (REQ 2), at what height would that remainder actually be small enough to bind the
        sigma landmarks? The natural leading rate is O(1/log T0), so hitting the 0.5% relative
        crossover budget needs log&nbsp;T0&nbsp;&ge;&nbsp;200 (T0&nbsp;&ge;&nbsp;e^200&nbsp;~
        7.23e86). This chart compares that needed log-height against the actual landmark
        log-heights and the Platt-Trudgian verified-height anchor.
      </p>

      <LogHeightBarChart />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
          </tr>
        </thead>
        <tbody>
          {IMP35580_LOG_HEIGHT_BARS.map((bar) => (
            <tr key={bar.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{bar.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {bar.logT0.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The REQ-4 needed log-height (200) is ~{IMP35580_SUMMARY.shortfallVsCross}x the crossover
        log-height (~{IMP35580_SUMMARY.logT0Cross}) and ~{IMP35580_SUMMARY.shortfallVsTPT}x the
        Platt-Trudgian anchor log-height (~{IMP35580_SUMMARY.logT_PT}, T0&nbsp;=&nbsp;3e12) --
        so a route-(i) remainder small enough to bind the landmarks on the natural
        O(1/log&nbsp;T0) rate cannot hold at, or anywhere near, any reachable height.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Presentation only of the
        imp-35538 REQ-4 requirements-scoping figures (no fresh derivation, no heavy data-module
        import); the needed log-height is a scoping estimate under the natural O(1/log T0) GUE
        local-law rate, which itself does NOT yet rigorously exist (imp-35538 REQ 2); this page
        derives no remainder, discharges nothing, changes no bound, establishes no operator
        positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED.
      </div>
    </div>
  );
}
