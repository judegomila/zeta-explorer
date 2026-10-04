import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96663_LADDER,
  IMP96663_FIT_CURVE,
  IMP96663_CEILINGS,
  IMP96663_HONEST_BANNER,
} from '../data/imp-96663-route-m-condfit-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// log-log chart: the five measured cond#(N) points, the fitted power-law
// curve, and the three ceiling / compute-wall vertical markers.
function CondfitPanel() {
  const rows = IMP96663_LADDER;
  const curve = IMP96663_FIT_CURVE.points;
  const svgW = 700;
  const padL = 60;
  const padR = 20;
  const svgH = 340;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const markers = [
    { N: IMP96663_CEILINGS.computeCeiling, label: 'compute wall 9916', color: ED.inkSoft },
    { N: IMP96663_CEILINGS.rigorousLowerCeiling, label: 'rigorous lower 2.59e7', color: ED.series3 },
    { N: IMP96663_CEILINGS.composedMeasuredCeiling, label: 'composed measured 4.11e7', color: ED.brass },
    { N: IMP96663_CEILINGS.independentCeilingDense, label: 'independent dense 4.30e7', color: ED.series2 },
  ];

  const allLogN = [...rows.map((r) => Math.log(r.N)), ...markers.map((m) => Math.log(m.N))];
  const minX = Math.min(...allLogN) * 0.98;
  const maxX = Math.max(...allLogN) * 1.02;

  const allY = [...rows.map((r) => Math.log(r.cond)), ...curve.map((p) => Math.log(p.cond))];
  const minY = Math.min(...allY) * 0.98;
  const maxY = Math.max(...allY) * 1.02;

  const xOf = (logN) => padL + ((logN - minX) / (maxX - minX)) * plotW;
  const yOf = (logCond) => padT + plotH - ((logCond - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={12} y={padT + plotH / 2} fill={ED.inkSoft} fontSize={9} transform={`rotate(-90 12 ${padT + plotH / 2})`}>
        cond# = lam_max/lam_min (log scale)
      </text>

      {markers.map((m) => (
        <g key={m.label}>
          <line
            x1={xOf(Math.log(m.N))}
            y1={padT}
            x2={xOf(Math.log(m.N))}
            y2={padT + plotH}
            stroke={m.color}
            strokeWidth={1.2}
            strokeDasharray="4 3"
            opacity={0.7}
          />
        </g>
      ))}

      <polyline
        points={curve.map((p) => `${xOf(Math.log(p.N))},${yOf(Math.log(p.cond))}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.6}
        opacity={0.8}
      />

      {rows.map((r) => (
        <circle key={`pt${r.N}`} cx={xOf(Math.log(r.N))} cy={yOf(Math.log(r.cond))} r={3.5} fill={ED.series1} />
      ))}

      {markers.map((m, i) => (
        <text
          key={`lbl${m.label}`}
          x={xOf(Math.log(m.N)) + 4}
          y={padT + 12 + i * 12}
          fill={m.color}
          fontSize={8}
        >
          {m.label}
        </text>
      ))}

      <text x={padL + 8} y={padT + plotH - 8} fill={ED.series1} fontSize={9}>
        cond# ~ {IMP96663_FIT_CURVE.C.toExponential(3)}&middot;N^{IMP96663_FIT_CURVE.q.toFixed(4)} (R&sup2;={IMP96663_FIT_CURVE.r2.toFixed(5)})
      </text>
      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (log scale) -- measured rungs, fitted power law, and ceiling markers
      </text>
    </svg>
  );
}

export default function Imp96663RouteMCondfitLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M: Directly-Measured cond#(N) Ladder and Ceiling Markers" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96663_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96570 formed the directly-measured cond#(N) = lam_max/lam_min at the five accessible
        rungs where both extremes are measured (N=250, 3000..6000), fit it as a single power law
        cond# ~ C&middot;N^q (q={IMP96663_FIT_CURVE.q.toFixed(4)}, R&sup2;={IMP96663_FIT_CURVE.r2.toFixed(5)}
        on the dense subset), and extrapolated it to the double-precision breakdown scale 1/eps.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Measured cond# points, power-law fit, and the three conditioning ceilings vs. the compute wall
      </h3>
      <CondfitPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue dots are the five
        directly-measured cond#(N) rungs and the blue curve is their fitted power law. The four
        dashed vertical lines mark, left to right: the imp-96352 wall-clock compute ceiling
        (N~{IMP96663_CEILINGS.computeCeiling}), the imp-96548 rigorous trace-domination lower
        ceiling (N~{IMP96663_CEILINGS.rigorousLowerCeiling.toExponential(2)}), the composed
        measured-fit ceiling (N~{IMP96663_CEILINGS.composedMeasuredCeiling.toExponential(2)}), and
        this cross-check's independent dense-fit ceiling
        (N~{IMP96663_CEILINGS.independentCeilingDense.toExponential(2)}). All three conditioning
        ceilings sit &gt;2000x above the compute wall, confirming compute binds first regardless of
        which ceiling estimate is used.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96663
        viz-data (ladder, fit, and ceilings reused verbatim from imp-96570). {IMP96663_HONEST_BANNER}
      </div>
    </div>
  );
}
