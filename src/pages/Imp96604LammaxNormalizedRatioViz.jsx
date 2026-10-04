import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96604_RATIO_SERIES,
  IMP96604_TARGETS,
  IMP96604_GAP_SUMMARY,
  IMP96604_HONEST_BANNER,
} from '../data/imp-96604-lammax-normalized-ratio-viz-data.js';
import { ED } from '../styles/tokens.js';

// log-N x-axis, two normalized ratio series on the y-axis (lam_max/log N in
// sky-blue, lam_max/trace in amber), each with a dashed horizontal line at
// its own asymptotic target -- both series still sit well above their line
// at the top rung, the imp-96562 FINDING 3 "still ~2x away" reading.
function RatioPanel() {
  const rows = IMP96604_RATIO_SERIES;
  const svgW = 700;
  const padL = 60;
  const padR = 90;
  const svgH = 340;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = rows.map((r) => r.logN);
  const minX = Math.min(...xs) - 0.15;
  const maxX = Math.max(...xs) + 0.15;
  const allY = rows.flatMap((r) => [r.lamMaxOverLogN, r.lamMaxOverTrace]);
  const minY = Math.min(...allY, IMP96604_TARGETS.lamMaxOverTraceTarget) - 0.08;
  const maxY = Math.max(...allY) + 0.08;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const yTicks = [minY, (minY + maxY) / 2, maxY];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v.toFixed(3)}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <g key={`x${r.N}`}>
          <line x1={xOf(r.logN)} y1={padT + plotH} x2={xOf(r.logN)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(r.logN)} y={padT + plotH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {r.N}
          </text>
        </g>
      ))}

      {/* target lines */}
      <line
        x1={padL}
        y1={yOf(IMP96604_TARGETS.lamMaxOverLogNTarget)}
        x2={padL + plotW}
        y2={yOf(IMP96604_TARGETS.lamMaxOverLogNTarget)}
        stroke={ED.series1}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW + 6} y={yOf(IMP96604_TARGETS.lamMaxOverLogNTarget) + 3} fill={ED.series1} fontSize={8}>
        target 0.3526
      </text>
      <line
        x1={padL}
        y1={yOf(IMP96604_TARGETS.lamMaxOverTraceTarget)}
        x2={padL + plotW}
        y2={yOf(IMP96604_TARGETS.lamMaxOverTraceTarget)}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW + 6} y={yOf(IMP96604_TARGETS.lamMaxOverTraceTarget) + 3} fill={ED.brass} fontSize={8}>
        target 0.2797
      </text>

      {/* lam_max/log N series */}
      <polyline
        points={rows.map((r) => `${xOf(r.logN)},${yOf(r.lamMaxOverLogN)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.4}
      />
      {rows.map((r) => (
        <circle key={`a${r.N}`} cx={xOf(r.logN)} cy={yOf(r.lamMaxOverLogN)} r={3.5} fill={ED.series1} />
      ))}

      {/* lam_max/trace series */}
      <polyline
        points={rows.map((r) => `${xOf(r.logN)},${yOf(r.lamMaxOverTrace)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.4}
      />
      {rows.map((r) => (
        <circle key={`b${r.N}`} cx={xOf(r.logN)} cy={yOf(r.lamMaxOverTrace)} r={3.5} fill={ED.brassDeco} />
      ))}

      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N
      </text>
      <text x={16} y={padT + plotH / 2} fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        ratio
      </text>
    </svg>
  );
}

export default function Imp96604LammaxNormalizedRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Normalized lam_max Ratios: Still ~2x Their Asymptotic Targets" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96604_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96562 asked whether either normalized candidate for the measured Vasyunin Gram lam_max
        log-slope 0.3526 is close enough to its asymptotic target to be read off numerically. Both
        series fall toward their target across N=250..6000 but remain far short: lam_max/log N goes
        {' '}{IMP96604_GAP_SUMMARY.lamMaxOverLogN.first.toFixed(4)} &rarr; {IMP96604_GAP_SUMMARY.lamMaxOverLogN.last.toFixed(4)}
        {' '}(target {IMP96604_GAP_SUMMARY.lamMaxOverLogN.target.toFixed(4)}), and lam_max/trace goes
        {' '}{IMP96604_GAP_SUMMARY.lamMaxOverTrace.first.toFixed(4)} &rarr; {IMP96604_GAP_SUMMARY.lamMaxOverTrace.last.toFixed(4)}
        {' '}(target {IMP96604_GAP_SUMMARY.lamMaxOverTrace.target.toFixed(4)}).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Two normalized ratios vs N, with their asymptotic targets
      </h3>
      <RatioPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the sky-blue curve is
        lam_max/log N descending toward its dashed target line at 0.3526; the amber curve is
        lam_max/trace descending toward its dashed target line at 0.2797. At the top rung N=6000
        the blue curve sits at {IMP96604_GAP_SUMMARY.lamMaxOverLogN.lastOverTarget.toFixed(2)}x its
        target and the amber curve at {IMP96604_GAP_SUMMARY.lamMaxOverTrace.lastOverTarget.toFixed(2)}x
        its target &mdash; both still ~2x away, so the pre-asymptotic intercept dominates the whole
        accessible ladder and neither ratio can be read off as a limiting constant from this data.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96604
        viz-data (ratio series reshaped verbatim from imp-96562). {IMP96604_HONEST_BANNER}
      </div>
    </div>
  );
}
