import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97630_WATERFALL_ROWS,
  IMP97630_ZERO_SOURCES,
  IMP97630_FULL_SPREAD,
  IMP97630_SUMMARY,
} from '../data/imp-97630-lambda2-floor-spread-waterfall-viz-data.js';
import { ED } from '../styles/tokens.js';

// Floating-bar waterfall: the rigorous upper edge steps down through two descents (honest geometric
// tail, then the dominant tail-model disagreement) to the power-refit deep end. Bar height encodes
// each descent's magnitude; color encodes its share of the full 3.06 spread.
function FloorWaterfallChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const rows = IMP97630_WATERFALL_ROWS;
  const n = rows.length;
  const slot = plotW / n;
  const barW = slot * 0.6;

  const top = rows[0].value; // -310.692227 (least negative, highest on the axis)
  const bottom = rows[rows.length - 1].value; // -313.756 (most negative)
  const span = top - bottom; // 3.063773, positive
  const yOf = (v) => padT + ((top - v) / span) * plotH;

  const colorFor = (row) => {
    if (row.kind === 'anchor') return ED.series8;
    return row.key === 'extrapolationModel' ? ED.series2 : ED.series1;
  };

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {rows.map((r, i) => {
        const x = padL + i * slot + (slot - barW) / 2;
        const yStart = yOf(r.start);
        const yEnd = yOf(r.end);
        const y = Math.min(yStart, yEnd);
        const h = Math.max(Math.abs(yEnd - yStart), r.kind === 'anchor' ? 3 : 0);
        return (
          <g key={r.key}>
            <rect x={x} y={y} width={barW} height={h || 3} fill={colorFor(r)} opacity={0.85} />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={ED.ink} fontSize={9}>
              {r.kind === 'anchor' ? r.value.toFixed(3) : `-${r.magnitude.toFixed(4)}`}
            </text>
            {r.kind === 'descent' && (
              <text x={x + barW / 2} y={y + h / 2 + 3} textAnchor="middle" fill={ED.paper} fontSize={9} fontWeight="bold">
                {r.sharePct.toFixed(1)}%
              </text>
            )}
            <text x={x + barW / 2} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
              {r.label}
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
        lambda_2 floor value
      </text>
    </svg>
  );
}

export default function Imp97630Lambda2FloorSpreadWaterfallViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Lambda_2 Floor Spread Waterfall: 5.6% Geometric Tail + 94.4% Tail-Model Disagreement = 3.06 (imp-97630 / imp-97600)" />

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
        page reshaping the frozen imp-97600 spread-decomposition literals verbatim (no re-derivation, no
        new computation). No rigorous lower bound on lambda_2 is produced; the floor stays four orders
        below the required 0.581059; interval-rigorous reach stays 2a&le;0.96; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97630_SUMMARY.reading}
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        The rigorous upper edge (grey) descends through the honest geometric K-truncation tail (blue,
        5.6%) then the dominant tail-model disagreement on nu_max (red, 94.4%) down to the power-refit
        deep end (grey):
      </p>
      <FloorWaterfallChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>step</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>start</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>end</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>share of spread</th>
          </tr>
        </thead>
        <tbody>
          {IMP97630_WATERFALL_ROWS.map((r) => (
            <tr key={r.key} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.start.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{r.end.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{r.kind === 'descent' ? `${r.sharePct.toFixed(2)}%` : '—'}</td>
            </tr>
          ))}
          {IMP97630_ZERO_SOURCES.map((s) => (
            <tr key={s.key} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0', color: 'var(--ink-faint)' }}>{s.label}</td>
              <td style={{ textAlign: 'right', color: 'var(--ink-faint)' }} colSpan={2}>{s.note}</td>
              <td style={{ textAlign: 'right', color: 'var(--ink-faint)' }}>{s.sharePct.toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
        full spread = {IMP97630_FULL_SPREAD.toFixed(6)} (upper edge &minus; power-refit deep end).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97630_SUMMARY.verdict}
      </div>
    </div>
  );
}
