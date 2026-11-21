import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97629_ROWS,
  IMP97629_EXTRAP_R_INF,
  IMP97629_EXTRAP_FRACTION,
  IMP97629_ENVELOPE,
  IMP97629_SUMMARY,
} from '../data/imp-97629-realizable-fraction-window-climb-viz-data.js';
import { ED } from '../styles/tokens.js';

// Bar-and-line chart: the realizable fraction R/envelope (bars) climbing with window half-width T,
// plus a dashed marker for the 1/T Richardson extrapolation R_inf/envelope (~0.513). The bars get
// visibly closer together as T grows -- decelerating increments, not a runaway to 1.
function FractionClimbChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const rows = IMP97629_ROWS;
  const n = rows.length;
  const slot = plotW / n;
  const barW = slot * 0.55;

  const yMax = IMP97629_EXTRAP_FRACTION * 1.08;
  const yOf = (frac) => padT + plotH - (frac / yMax) * plotH;
  const extrapY = yOf(IMP97629_EXTRAP_FRACTION);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {/* 1/T Richardson extrapolation reference line */}
      <line x1={padL} y1={extrapY} x2={padL + plotW} y2={extrapY} stroke={ED.brassDeco} strokeDasharray="4 3" strokeWidth={1} />
      <text x={padL + plotW - 4} y={extrapY - 5} textAnchor="end" fill={ED.brass} fontSize={9}>
        R_inf/envelope &asymp; {IMP97629_EXTRAP_FRACTION.toFixed(3)} (1/T extrapolation)
      </text>

      {rows.map((r, i) => {
        const x = padL + i * slot + (slot - barW) / 2;
        const y = yOf(r.fraction);
        const h = padT + plotH - y;
        return (
          <g key={r.T}>
            <rect x={x} y={y} width={barW} height={h} fill={r.isFirst ? ED.series2 : ED.series1} opacity={0.85} />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill={ED.ink} fontSize={9}>
              {r.fraction.toFixed(3)}
            </text>
            <text x={x + barW / 2} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
              T={r.T}
            </text>
          </g>
        );
      })}

      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        R / envelope
      </text>
    </svg>
  );
}

export default function Imp97629RealizableFractionWindowClimbViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Realizable-Fraction Window Climb: 0.43837 (T=12) -> 0.50552 (T=64) -> ~0.513 extrapolated (imp-97629 / imp-97564)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97564 window-ladder literals verbatim (no re-derivation, no new
        computation). Changes no bound; RH open;
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97629_SUMMARY.reading}
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        Holding the grid-converged spacing h=0.01 fixed, widening the window half-width T (red bar =
        the imp-97457 T=12 reading) climbs the realizable fraction with visibly shrinking increments
        toward the dashed 1/T Richardson extrapolation:
      </p>
      <FractionClimbChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>T</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>N</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>R</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>&Delta;R</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>fraction</th>
          </tr>
        </thead>
        <tbody>
          {IMP97629_ROWS.map((r) => (
            <tr key={r.T} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.T}</td>
              <td style={{ textAlign: 'right' }}>{r.N}</td>
              <td style={{ textAlign: 'right' }}>{r.R.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.increment === null ? '—' : `+${r.increment.toFixed(1)}`}</td>
              <td style={{ textAlign: 'right' }}>{r.fraction.toFixed(5)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 30%, transparent)' }}>
            <td style={{ padding: '3px 0', color: 'var(--brass)' }}>extrapolated (T&rarr;&infin;)</td>
            <td style={{ textAlign: 'right' }}>&mdash;</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>{IMP97629_EXTRAP_R_INF.toFixed(1)}</td>
            <td style={{ textAlign: 'right' }}>&mdash;</td>
            <td style={{ textAlign: 'right', color: 'var(--brass)' }}>{IMP97629_EXTRAP_FRACTION.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
        envelope = {IMP97629_ENVELOPE.toFixed(3)} (window-independent bathtub deepest measure &pi;/a).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97629_SUMMARY.verdict}
      </div>
    </div>
  );
}
