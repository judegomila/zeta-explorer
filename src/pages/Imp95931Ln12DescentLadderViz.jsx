import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95931_DESCENT_LADDER,
  IMP95931_LN13_DIRECT_UFIT_REL_PCT,
  IMP95931_LOOSER_THAN_LN13_FACTOR,
  IMP95931_CAVEAT_BANNER,
} from '../data/imp-95931-ln12-descent-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const DOT_COLOR = ED.series1;
const TARGET_COLOR = ED.series5;

// log-x scatter+line: reach vs u_fit_rel%, descending toward the ln1.3 target line
function DescentLadderChart() {
  const svgW = 560;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 40;
  const svgH = 260;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const reaches = IMP95931_DESCENT_LADDER.map((r) => r.reach);
  const minReach = Math.min(...reaches) * 0.85;
  const maxReach = Math.max(...reaches) * 1.15;
  const maxPct = Math.max(...IMP95931_DESCENT_LADDER.map((r) => r.uFitRelPct)) * 1.15;

  const xOf = (reach) => padL + ((Math.log(reach) - Math.log(minReach)) / (Math.log(maxReach) - Math.log(minReach))) * plotW;
  const yOf = (pct) => padT + plotH - (pct / maxPct) * plotH;

  const linePoints = IMP95931_DESCENT_LADDER.map((r) => `${xOf(r.reach)},${yOf(r.uFitRelPct)}`).join(' ');
  const targetY = yOf(IMP95931_LN13_DIRECT_UFIT_REL_PCT);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* ln1.3 direct target line */}
      <line x1={padL} y1={targetY} x2={svgW - padR} y2={targetY} stroke={TARGET_COLOR} strokeWidth={1.5} strokeDasharray="5,4" />
      <text x={svgW - padR} y={targetY - 6} textAnchor="end" fill={TARGET_COLOR} fontSize={11}>
        {`ln 1.3 direct target: ${IMP95931_LN13_DIRECT_UFIT_REL_PCT.toFixed(2)}%`}
      </text>

      {/* descent ladder line + points */}
      <polyline points={linePoints} fill="none" stroke={DOT_COLOR} strokeWidth={2} />
      {IMP95931_DESCENT_LADDER.map((r) => (
        <g key={r.ticket}>
          <circle cx={xOf(r.reach)} cy={yOf(r.uFitRelPct)} r={5} fill={DOT_COLOR} />
          <text x={xOf(r.reach)} y={yOf(r.uFitRelPct) - 10} textAnchor="middle" fill={ED.ink} fontSize={11}>
            {`${r.uFitRelPct.toFixed(3)}%`}
          </text>
          <text x={xOf(r.reach)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
            {`reach ${r.reach.toFixed(0)}`}
          </text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={svgH - padB} x2={svgW - padR} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
      <text x={12} y={padT + 4} fill={ED.inkFaint} fontSize={10}>u_fit_rel %</text>
    </svg>
  );
}

export default function Imp95931Ln12DescentLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="ln 1.2 u_fit_rel Descent Ladder vs the ln 1.3 Target (imp-95896 / imp-95931)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP95931_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Three successive tickets (imp-95860, imp-95881, imp-95896) each extended the ln&nbsp;1.2
        DD Jacobi grid further and re-ran the same primal A_fit envelope, tightening the per-delta
        u_fit certified interval every time. This panel plots that three-rung descent against the
        frozen ln&nbsp;1.3 direct interval (0.23%) that it approaches but has not yet crossed.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        u_fit_rel vs reach (log-x)
      </h3>
      <DescentLadderChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>ticket</th>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>grid</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>reach</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>u_fit_rel</th>
          </tr>
        </thead>
        <tbody>
          {IMP95931_DESCENT_LADDER.map((r) => (
            <tr key={r.ticket} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.ticket}</td>
              <td>{r.gridLabel}</td>
              <td style={{ textAlign: 'right' }}>{r.reach.toFixed(2)}</td>
              <td style={{ textAlign: 'right', color: DOT_COLOR }}>{r.uFitRelPct.toFixed(4)}%</td>
            </tr>
          ))}
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>&mdash;</td>
            <td>ln 1.3 direct (target)</td>
            <td style={{ textAlign: 'right' }}>&mdash;</td>
            <td style={{ textAlign: 'right', color: TARGET_COLOR }}>
              {IMP95931_LN13_DIRECT_UFIT_REL_PCT.toFixed(2)}%
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering three frozen
        measurements verbatim (no re-derivation). The final rung (0.247%) is
        {` ${IMP95931_LOOSER_THAN_LN13_FACTOR.toFixed(2)}x`} looser than the ln&nbsp;1.3 direct
        interval, not yet crossed. Supplies no new bound, establishes no operator positivity, no
        RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
