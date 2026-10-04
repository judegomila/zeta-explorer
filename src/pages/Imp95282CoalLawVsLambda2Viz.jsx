import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95282_CURVES, IMP95282_RATES } from '../data/imp-95282-coallaw-vs-lambda2-viz-data.js';
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
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
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

const RATE_KEYS = ['r1_01', 'r1_1', 'r1_5', 'r2_0'];
const RATE_COLORS = [ED.series3, ED.series1, ED.series4, ED.series2];

// coalLaw(x) confluent-span curve vs Lambda_2(x, r) at r = 1.01, 1.1, 1.5, 2.0,
// showing the imp-95231 COAL-DESC / imp-95227 dominance: coalLaw(x) sits
// above every Lambda_2(x, r) curve, with the gap widening as r leaves 1.
function CoalLawPanel() {
  const points = IMP95282_CURVES;
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const svgH = 320;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 0;
  const maxX = 3.1;
  const minY = 0;
  const maxY = 1.02;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const coalLine = points.map((p) => `${xOf(p.x)},${yOf(p.coalLaw)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[0, 0.5, 1, 1.5, 2, 2.5, 3]}
      yTicks={[0, 0.25, 0.5, 0.75, 1]}
      xOf={xOf}
      yOf={yOf}
      xLabel="x"
      yLabel="Lambda_2(x, r)  /  coalLaw(x)"
    >
      {RATE_KEYS.map((key, i) => {
        const line = points.map((p) => `${xOf(p.x)},${yOf(p[key])}`).join(' ');
        return (
          <polyline
            key={key}
            points={line}
            fill="none"
            stroke={RATE_COLORS[i]}
            strokeWidth={1.75}
            opacity={0.9}
          />
        );
      })}
      <polyline points={coalLine} fill="none" stroke={ED.inkSoft} strokeWidth={2.5} strokeDasharray="6 3" opacity={0.95} />
      <text x={padL + 8} y={padT + 14} fill={ED.ink} fontSize={9}>
        coalLaw(x) = e^(-2x)(1+2x^2+2x sqrt(1+x^2))  [confluent span, r -&gt; 1]
      </text>
      {RATE_KEYS.map((key, i) => (
        <text key={`lbl-${key}`} x={padL + plotW - 4} y={padT + 14 + i * 12} textAnchor="end" fill={RATE_COLORS[i]} fontSize={8.5}>
          r = {IMP95282_RATES[i]}
        </text>
      ))}
    </AxisFrame>
  );
}

export default function Imp95282CoalLawVsLambda2Viz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Confluent-Span Domination: coalLaw(x) vs Lambda_2(x, r) (imp-95231 / imp-95227 / imp-95282)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a model-family numeric
        illustration, not a new theorem. It changes no Lambda bound and establishes no operator
        positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. RH does not
        follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        For the exact signed N = 2 constant Lambda_2(x, r) at fixed depth x = nu_1 d and rate
        ratio r = nu_2/nu_1 &ge; 1, imp-95231 THEOREM COAL-DESC (and the imp-95227 two-rate
        coalescence dominance theorem) show the confluent-span value
        coalLaw(x) = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)), the r &rarr; 1 limit of Lambda_2,
        dominates Lambda_2(x, r) for every r &ge; 1. The panel below plots coalLaw(x) (dashed,
        light) against Lambda_2(x, r) at four rate ratios r = 1.01, 1.1, 1.5, 2.0: every solid
        curve sits at or below the dashed coalLaw(x) curve, and the gap widens as r moves away
        from coalescence (r = 1).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        coalLaw(x) vs Lambda_2(x, r) at r = 1.01, 1.1, 1.5, 2.0
      </h3>
      <CoalLawPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the r = 1.01 curve
        (green) tracks closest to the coalLaw(x) confluent span (dashed), since it is nearest
        coalescence; the r = 2.0 curve (red) sits furthest below it. This is the numeric picture
        behind imp-95231's analytic result dLambda_2/dr &le; 0 at r &rarr; 1+ for every x &gt; 0
        (THEOREM COAL-DESC, phi(x) &ge; 2x^3): Lambda_2 strictly decreases as the rate ratio
        leaves coalescence, so the confluent value is a strict local-max boundary, consistent
        with every curve here lying on or below coalLaw(x).
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
        imp-95282 baked viz-data (curves recomputed independently from the imp-95231 / imp-95227
        documented closed forms). Changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
