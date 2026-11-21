import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95914_COMPARISON_ROWS,
  IMP95914_CAVEAT_BANNER,
} from '../data/imp-95914-ufit-comparison-panel-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = { 'ln1.2': ED.series1, 'ln1.25': ED.series4, 'ln1.3': ED.series5 };

// horizontal bar chart of u_fit_rel% per delta (N/A rows shown as a labeled gap)
function UFitRelBarChart() {
  const svgW = 560;
  const padL = 70;
  const padR = 90;
  const padT = 16;
  const rowH = 46;
  const svgH = padT + rowH * IMP95914_COMPARISON_ROWS.length + 10;
  const plotW = svgW - padL - padR;

  const maxPct = Math.max(
    ...IMP95914_COMPARISON_ROWS.filter((r) => r.hasUFitInterval).map((r) => r.uFitRelPct),
  ) * 1.15;
  const xOf = (v) => (v / maxPct) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP95914_COMPARISON_ROWS.map((row, i) => {
        const y = padT + i * rowH;
        const color = COLORS[row.label];
        return (
          <g key={row.label}>
            <text x={padL - 10} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={11}>
              {row.label}
            </text>
            {row.hasUFitInterval ? (
              <>
                <rect
                  x={padL}
                  y={y + 10}
                  width={Math.max(xOf(row.uFitRelPct), 2)}
                  height={rowH - 20}
                  fill={color}
                  opacity={0.85}
                />
                <text
                  x={padL + xOf(row.uFitRelPct) + 8}
                  y={y + rowH / 2 + 4}
                  fill={color}
                  fontSize={11}
                >
                  {`${row.uFitRelPct.toFixed(3)}%`}
                </text>
              </>
            ) : (
              <text x={padL + 8} y={y + rowH / 2 + 4} fill={ED.inkFaint} fontSize={11} fontStyle="italic">
                N/A -- crossing/shift-budget thread only
              </text>
            )}
          </g>
        );
      })}
      <line x1={padL} y1={padT} x2={padL} y2={svgH - 10} stroke={ED.rule} strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp95914UfitComparisonViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Per-Delta u_fit Comparison Panel (imp-95885 / imp-95914)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP95914_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95885 cross-validation assembled the per-delta u_fit certified intervals
        (ln&nbsp;1.2 / ln&nbsp;1.25 / ln&nbsp;1.3) side by side but never rendered them
        visually. This panel surfaces that table: fitted A vs the dual A_opt floor,
        u_fit_rel, u_fit/u_opt, reach, and conditioning, per delta.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        u_fit_rel by delta
      </h3>
      <UFitRelBarChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>delta</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>A_fit</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>A_opt (dual)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>u_fit_rel</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>u_fit/u_opt</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>reach</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>conditioning</th>
          </tr>
        </thead>
        <tbody>
          {IMP95914_COMPARISON_ROWS.map((r) => (
            <tr key={r.label} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0', color: COLORS[r.label] }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.aFitLatest === null ? 'N/A' : r.aFitLatest.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.aOpt === null ? 'N/A' : r.aOpt.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.hasUFitInterval ? `${r.uFitRelPct.toFixed(3)}%` : 'N/A'}</td>
              <td style={{ textAlign: 'right' }}>
                {r.uFitOverUOptLatest === null ? 'N/A' : r.uFitOverUOptLatest.toExponential(3)}
              </td>
              <td style={{ textAlign: 'right' }}>{r.reachLatest.toFixed(1)}</td>
              <td style={{ textAlign: 'right' }}>{r.condApprox.toExponential(1)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering the frozen
        imp-95885 per-delta comparison verbatim (no re-derivation). Reach alone does not order
        the intervals across deltas, and conditioning alone does not either -- imp-95895 refines
        the reading to a reach-to-conditioning interplay (ln&nbsp;1.25 is tightest despite only
        moderate conditioning). Supplies no new bound, establishes no operator positivity, no RH
        claim. NO QED.
      </div>
    </div>
  );
}
