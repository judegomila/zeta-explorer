import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96581_LADDER,
  IMP96581_SLOPE_GAP,
  IMP96581_N6000,
  IMP96581_HONEST_BANNER,
} from '../data/imp-96581-route-m-lammax-rigorous-vs-measured-viz-data.js';
import { ED } from '../styles/tokens.js';

// two-line chart on a log(N) x-axis: the rigorous SPD trace-domination
// upper bound (steeper slope) vs. the measured power-iteration fit
// (shallower slope), with the gap at N=6000 marked.
function LammaxPanel() {
  const rows = IMP96581_LADDER;
  const svgW = 700;
  const padL = 56;
  const padR = 20;
  const svgH = 320;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = rows.map((r) => Math.log(r.N));
  const minX = Math.min(...xs) * 0.98;
  const maxX = Math.max(...xs) * 1.02;
  const allY = rows.flatMap((r) => [r.rigorous, r.measured]);
  const minY = 0;
  const maxY = Math.max(...allY) * 1.08;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const last = rows[rows.length - 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, maxY / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {/* gap band at N=6000 */}
      <line
        x1={xOf(Math.log(last.N))}
        y1={yOf(last.rigorous)}
        x2={xOf(Math.log(last.N))}
        y2={yOf(last.measured)}
        stroke={ED.series2}
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
      <text x={xOf(Math.log(last.N)) + 6} y={(yOf(last.rigorous) + yOf(last.measured)) / 2} fill={ED.series2} fontSize={8.5}>
        {IMP96581_N6000.valueOverstatementRatio.toFixed(2)}x
      </text>
      <polyline
        points={rows.map((r) => `${xOf(Math.log(r.N))},${yOf(r.rigorous)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.8}
      />
      <polyline
        points={rows.map((r) => `${xOf(Math.log(r.N))},${yOf(r.measured)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={1.8}
      />
      {rows.map((r) => (
        <g key={`pts${r.N}`}>
          <circle cx={xOf(Math.log(r.N))} cy={yOf(r.rigorous)} r={3} fill={ED.series1} />
          <circle cx={xOf(Math.log(r.N))} cy={yOf(r.measured)} r={3} fill={ED.brassDeco} />
        </g>
      ))}
      <text x={padL + 8} y={yOf(last.rigorous) - 8} fill={ED.series1} fontSize={9}>
        rigorous: I(1,1)&middot;H_N (slope {IMP96581_SLOPE_GAP.rigorousSlope.toFixed(4)})
      </text>
      <text x={padL + 8} y={yOf(last.measured) + 14} fill={ED.brass} fontSize={9}>
        measured fit: 3.0247 + 0.3526&middot;log N (slope {IMP96581_SLOPE_GAP.measuredSlope.toFixed(4)})
      </text>
      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (log scale, ticks at the accessible ladder rungs)
      </text>
    </svg>
  );
}

export default function Imp96581RouteILammaxRigorousVsMeasuredViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M: lam_max(N) -- Rigorous Trace Bound vs. Measured Fit" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96581_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96548 established that the Vasyunin Gram G<sub>N</sub> is SPD, so lam_max(N) &le;
        trace(G<sub>N</sub>) = I(1,1)&middot;H<sub>N</sub> -- a rigorous, unconditional log-shape upper bound
        with slope I(1,1) = {IMP96581_SLOPE_GAP.rigorousSlope.toFixed(4)}. The measured
        power-iteration fit has slope {IMP96581_SLOPE_GAP.measuredSlope.toFixed(4)}, about{' '}
        {IMP96581_SLOPE_GAP.ratio.toFixed(2)}x smaller: trace domination gets the right shape but
        the wrong coefficient.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Rigorous trace bound vs. measured fit over the accessible N ladder
      </h3>
      <LammaxPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue curve is the
        rigorous SPD trace-domination upper bound; the yellow curve is the non-rigorous imp-96443
        measured fit. At the top accessible rung N={IMP96581_N6000.N}, the rigorous bound gives{' '}
        {IMP96581_N6000.rigorous.toFixed(4)} against the measured {IMP96581_N6000.measured.toFixed(4)}
        &nbsp;&mdash; a {IMP96581_N6000.valueOverstatementRatio.toFixed(2)}x overstatement of the
        curve VALUES (red dashed gap). That is a distinct number from the {' '}
        {IMP96581_N6000.ceilingOverstatementRatio.toFixed(2)}x figure imp-96548 reports for the
        resulting conditioning-CEILING estimates (measured-fit ceiling / rigorous-trace ceiling);
        both are correct but answer different questions, so this page keeps them labeled
        separately rather than treating them as the same ratio.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96581
        viz-data (ladder recomputed verbatim from the imp-96548 inputs). {IMP96581_HONEST_BANNER}
      </div>
    </div>
  );
}
