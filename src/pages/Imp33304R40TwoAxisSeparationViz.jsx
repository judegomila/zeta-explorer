import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33304_TWO_AXIS_RUNGS,
  IMP33304_R40_COARSE,
  IMP33304_R40_FINEST,
  IMP33304_INNER_DRIFT_SPAN,
  IMP33304_MAX_CROSS_OUTER_DELTA,
} from '../data/imp-33304-r40-two-axis-separation-viz-data.js';

// deltaCrossOuter=0 rungs are floored to this value so they still plot on the log axis.
const DELTA_FLOOR = 1e-15;
const DELTA_MAX = 1e-13;

function TwoAxisChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 60;
  const padT = 24;
  const padB = 60;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const n = IMP33304_TWO_AXIS_RUNGS.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  const r40Min = 1.024382;
  const r40Max = 1.024400;
  const yR40 = (v) => padT + cH * (1 - (v - r40Min) / (r40Max - r40Min));

  const yDelta = (d) => {
    const clamped = Math.max(d, DELTA_FLOOR);
    return padT + cH * (1 - (Math.log10(clamped) - Math.log10(DELTA_FLOOR)) / (Math.log10(DELTA_MAX) - Math.log10(DELTA_FLOOR)));
  };

  const r40Path = IMP33304_TWO_AXIS_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yR40(r.r40).toFixed(2)).join(' ');
  const deltaPath = IMP33304_TWO_AXIS_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yDelta(r.deltaCrossOuter).toFixed(2)).join(' ');

  const r40Ticks = [1.024385, 1.024390, 1.024395, 1.024400];
  const deltaTicks = [1e-15, 1e-14, 1e-13];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {r40Ticks.map((v) => (
        <g key={'r' + v}>
          <line x1={padL} y1={yR40(v)} x2={padL + cW} y2={yR40(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yR40(v) + 3.5} textAnchor="end" fill="#38bdf8" fontSize={9}>
            {v.toFixed(6)}
          </text>
        </g>
      ))}

      {deltaTicks.map((v) => (
        <text key={'d' + v} x={padL + cW + 6} y={yDelta(v) + 3.5} textAnchor="start" fill="#f472b6" fontSize={9}>
          {v.toExponential(0)}
        </text>
      ))}

      <path d={deltaPath} fill="none" stroke="#f472b6" strokeWidth={1.6} strokeDasharray="3,2" />
      <path d={r40Path} fill="none" stroke="#38bdf8" strokeWidth={2} />

      {IMP33304_TWO_AXIS_RUNGS.map((r, i) => (
        <g key={r.label}>
          <circle cx={xS(i)} cy={yR40(r.r40)} r={4} fill="#38bdf8" />
          <circle cx={xS(i)} cy={yDelta(r.deltaCrossOuter)} r={3.5} fill="#f472b6" />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP33304_TWO_AXIS_RUNGS.map((r, i) => (
        <text
          key={'x' + r.label}
          x={xS(i)}
          y={padT + cH + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize={8}
          transform={'rotate(-35,' + xS(i).toFixed(1) + ',' + (padT + cH + 16) + ')'}
        >
          {r.label}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 50} textAnchor="middle" fill="#64748b" fontSize={10}>
        inner A(tau) grid (refining left to right)
      </text>

      <text x={12} y={padT + cH / 2} textAnchor="middle" fill="#38bdf8" fontSize={9.5} transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}>
        R_40 (left axis, linear, blue)
      </text>
      <text x={svgW - 10} y={padT + cH / 2} textAnchor="middle" fill="#f472b6" fontSize={9.5} transform={'rotate(-90,' + (svgW - 10) + ',' + (padT + cH / 2) + ')'}>
        deltaCrossOuter (right axis, log, pink)
      </text>
    </svg>
  );
}

export default function Imp33304R40TwoAxisSeparationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="R_40 Two-Axis Separation: Inner Resolution vs Outer Moment Grid (imp-33276 / imp-33304)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33276 extended the imp-33256 R_40 = |D_40|/|D_40^saddle| cross-outer control
        (comparing the outer moment grids T_A=2/NM=3200 and T_A=6/NM=1600) from the single
        coarse inner grid [0,7]/1200 to the full refined inner ladder [0,2]/400 .. [0,2]/7200.
        The chart below overlays the two axes: R_40 itself (blue, left axis) climbs
        ~1.21e-5 from {IMP33304_R40_COARSE.toFixed(8)} to {IMP33304_R40_FINEST.toFixed(8)}
        {' '}as the inner grid refines, while the cross-outer delta (pink, right axis, log
        scale) stays flat at the machine-epsilon floor (worst {IMP33304_MAX_CROSS_OUTER_DELTA.toExponential(2)},
        several rungs bit-identical) at every inner resolution.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R_40 vs inner grid rung (blue, linear left axis) overlaid with cross-outer delta (pink, log right axis)
      </p>
      <TwoAxisChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the blue R_40 curve
        rises monotonically as the inner grid refines, carrying the entire ~{IMP33304_INNER_DRIFT_SPAN.toExponential(2)}
        {' '}imp-3888/imp-33256 drift. The pink cross-outer delta curve is essentially flat at
        the bottom of its log axis across every inner rung -- the outer moment grid choice
        (T_A=2/NM=3200 vs T_A=6/NM=1600) never moves R_40 by more than a few times 1e-14. The
        two axes are cleanly separated: inner resolution moves R_40, the outer grid does not.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This chart tabulates the inner-vs-outer
        sensitivity axes of a single moment-ratio diagnostic (R_40) used inside a mass-feasibility
        check; mass-feasibility is necessary-but-not-sufficient and the operator-level K_a &ge; 0
        sign-positivity residual (imp-3066) remains untouched. Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA.
      </div>
    </div>
  );
}
