import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95349_LEG_GAINS,
  IMP95349_CUMULATIVE_GAINS,
  IMP95349_LOOSENESS_LADDER,
} from '../data/imp-95349-rz-pen-gain-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// bar chart of the per-leg gain factor at each committed leg
function LegGainBarsPanel() {
  const rows = IMP95349_LEG_GAINS;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 7;
  const barW = plotW / rows.length / 2;
  const xOf = (i) => padL + (plotW / rows.length) * (i + 0.5);
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={rows.map((_, i) => i)}
      yTicks={[0, 1, 2, 3, 4, 5, 6, 7]}
      xOf={xOf}
      yOf={yOf}
      xLabel="chain leg"
      yLabel="floor gain factor (A_pen_k / A_pen_{k-1})"
    >
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 3" />
      {rows.map((r, i) => (
        <g key={r.leg}>
          <rect
            x={xOf(i) - barW / 2}
            y={yOf(r.gain)}
            width={barW}
            height={yOf(0) - yOf(r.gain)}
            fill={ED.series1}
            opacity={0.85}
          />
          <text x={xOf(i)} y={yOf(r.gain) - 6} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {r.gain.toFixed(4)}x
          </text>
          <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.leg}
          </text>
          <text x={xOf(i)} y={padT + plotH + 28} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
            {r.module}
          </text>
        </g>
      ))}
    </AxisFrame>
  );
}

// cumulative floor level relative to RZ-PEN2, plus the looseness ladder
function CumulativeAndLoosenessPanel() {
  const cum = IMP95349_CUMULATIVE_GAINS;
  const loose = IMP95349_LOOSENESS_LADDER;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 0;
  const maxX = cum.length - 1;
  const maxYCum = 14;
  const maxYLoose = 10;
  const xOf = (i) => padL + ((i - minX) / (maxX - minX)) * plotW;
  const yOfCum = (v) => padT + plotH - (v / maxYCum) * plotH;
  const yOfLoose = (v) => padT + plotH - (v / maxYLoose) * plotH;

  const cumLine = cum.map((r, i) => `${xOf(i)},${yOfCum(r.cumulativeGain)}`).join(' ');
  // looseness ladder rungs align to legs RZ-PEN4 (i=2), RZ-PEN5 (i=3), RZ-PEN6 (i=4)
  const looseIdx = [2, 3, 4];
  const looseLine = loose.map((r, k) => `${xOf(looseIdx[k])},${yOfLoose(r.looseness)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={cum.map((_, i) => i)}
      yTicks={[0, 2, 4, 6, 8, 10, 12, 14]}
      xOf={xOf}
      yOf={yOfCum}
      xLabel="chain leg (RZ-PEN2 .. RZ-PEN6)"
      yLabel="cumulative gain (left) / looseness (right, x10)"
    >
      <polyline points={cumLine} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.9} />
      {cum.map((r, i) => (
        <circle key={r.leg} cx={xOf(i)} cy={yOfCum(r.cumulativeGain)} r={2.5} fill={ED.series1} />
      ))}
      <polyline points={looseLine} fill="none" stroke={ED.series4} strokeWidth={2} strokeDasharray="6 3" opacity={0.9} />
      {loose.map((r, k) => (
        <circle key={r.leg} cx={xOf(looseIdx[k])} cy={yOfLoose(r.looseness)} r={3} fill={ED.series4} />
      ))}
      <text x={padL + 8} y={padT + 14} fill={ED.series1} fontSize={9}>
        cumulative floor gain vs RZ-PEN2 (left axis)
      </text>
      <text x={padL + 8} y={padT + 27} fill={ED.series4} fontSize={9}>
        looseness inf / A_pen at rho=e^6, r=2 (right axis, x10 scale)
      </text>
    </AxisFrame>
  );
}

export default function Imp95349RzPenGainLadderViz() {
  const finalGain = IMP95349_CUMULATIVE_GAINS[IMP95349_CUMULATIVE_GAINS.length - 1].cumulativeGain;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="RZ-PEN Symbol-Pencil Floor Gain Ladder at rho = e^6 (imp-95328..95332)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a floor-only measurement
        summary of already-proven per-leg gains, not a new theorem. It changes no Lambda bound and
        establishes no operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of
        the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The RZ-PEN block symbol-pencil floor A_pen has been sharpened across a chain of executed
        residual legs: imp-95329 (beta-trace cap), imp-95330 (K = 256 chart refinement), imp-95331
        (split-weight exact-root), and imp-95332 (per-chart tail cap). Each leg is a proven
        unconditional dominance A_pen_k &ge; A_pen_{'{k-1}'}, so every gain factor below is
        &ge; 1. At rho = e^6 the four gains compose to a cumulative {finalGain.toFixed(3)}x floor
        improvement over RZ-PEN2, while the residual looseness against the exact symbol-pencil
        infimum (at r = 2) drops 9.318x &rarr; 6.085x &rarr; 5.060x over the last three legs.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Per-leg floor gain factor, rho = e^6
      </h3>
      <LegGainBarsPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Cumulative gain vs RZ-PEN2, and residual looseness
      </h3>
      <CumulativeAndLoosenessPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each bar is the
        immediate-predecessor gain measured and baked in its own module (imp-95329's gainRhoE6,
        imp-95330's gainRhoE6, imp-95331's gainRhoE6R2, imp-95332's gainRhoE6R2); the line chart
        composes them into a running floor level relative to RZ-PEN2. The dashed looseness line
        shows that even after this whole chain, a 5.06x gap to the exact symbol-pencil infimum
        remains at rho = e^6 &mdash; named by imp-95332 as living entirely in the pair-identity
        truncation beyond {'{0, +-1}'} and the b-uniform t3 weight, both still OPEN.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-95349 baked viz-data (values copied verbatim from the imp-95329 / imp-95330 / imp-95331
        / imp-95332 records, no re-derivation). Changes no bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
