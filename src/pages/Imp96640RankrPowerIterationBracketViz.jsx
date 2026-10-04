import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96640_LADDER,
  IMP96640_TARGET_SLOPE,
  IMP96640_THRESHOLDS,
  IMP96640_HONEST_BANNER,
} from '../data/imp-96640-rankr-power-iteration-bracket-viz-data.js';
import { ED } from '../styles/tokens.js';

// bar chart: rank r (0..11) on the x-axis, ratio-to-target (slope_r / 0.3526)
// on the y-axis (0..1), with the r=4 (within 25%) and r=6 (within 10%)
// thresholds marked against the y=1 target line.
function RankRPanel() {
  const rows = IMP96640_LADDER;
  const svgW = 700;
  const padL = 56;
  const padR = 20;
  const svgH = 320;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const n = rows.length;
  const barW = (plotW / n) * 0.6;
  const slot = plotW / n;
  const xOf = (i) => padL + i * slot + slot / 2;
  const yOf = (ratio) => padT + plotH - ratio * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(1)}
        x2={padL + plotW}
        y2={yOf(1)}
        stroke={ED.series3}
        strokeWidth={1.2}
        strokeDasharray="3 3"
      />
      <text x={padL + plotW - 4} y={yOf(1) - 6} textAnchor="end" fill={ED.series3} fontSize={8.5}>
        target: measured slope {IMP96640_TARGET_SLOPE.toFixed(4)}
      </text>
      {rows.map((row, i) => (
        <g key={`bar${row.r}`}>
          <rect
            x={xOf(i) - barW / 2}
            y={yOf(row.ratio)}
            width={barW}
            height={plotH - yOf(row.ratio) + padT}
            fill={
              row.r === IMP96640_THRESHOLDS.within10pctR
                ? ED.brassDeco
                : row.r === IMP96640_THRESHOLDS.within25pctR
                ? ED.series1
                : '#475569'
            }
          />
          <text x={xOf(i)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {row.r}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        rank r (power-iteration steps from e_1)
      </text>
    </svg>
  );
}

export default function Imp96640RankrPowerIterationBracketViz() {
  const within25 = IMP96640_LADDER.find((r) => r.r === IMP96640_THRESHOLDS.within25pctR);
  const within10 = IMP96640_LADDER.find((r) => r.r === IMP96640_THRESHOLDS.within10pctR);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M: Rank-r Power-Iteration Bracket on the Vasyunin lam_max Log-Slope" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96640_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96612 formed the r-step power-iteration moment ratio R<sub>r</sub>(N) =
        (G<sub>N</sub><sup>r+1</sup>)<sub>11</sub> / (G<sub>N</sub><sup>r</sup>)<sub>11</sub> from the
        peak Vasyunin Gram basis vector e<sub>1</sub>, and fit its log-slope b<sub>r</sub> for
        r = 0..11. By SPD power/Lanczos theory R<sub>r</sub> &rarr; lam_max as r grows, so b<sub>r</sub>
        climbs monotonically toward the measured lam_max leading log-coefficient{' '}
        {IMP96640_TARGET_SLOPE.toFixed(4)} (imp-96443) &mdash; but only ~6 collective modes get it
        there.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Ratio b_r / 0.3526 vs. rank r
      </h3>
      <RankRPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue bar at r={within25.r}{' '}
        is the first rung within 25% of the target (ratio {within25.ratio.toFixed(3)}); the yellow
        bar at r={within10.r} is the first within 10% (ratio {within10.ratio.toFixed(3)}). A
        rank-one surrogate (r&le;1) captures under 5% of the slope, so the 0.3526 log-coefficient is
        a genuinely collective ~6-mode effect, not a single dominant mode.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96640
        viz-data (ladder reused verbatim from imp-96612). {IMP96640_HONEST_BANNER}
      </div>
    </div>
  );
}
