import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95303_CURVES,
  IMP95303_ONSETS,
  IMP95303_WINDOW_RATIO,
} from '../data/imp-95303-conf-lb-vs-coaln-window-pinch-viz-data.js';
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

const N_KEYS = [3, 4, 5];
const N_COLORS = [ED.series3, ED.series1, ED.series4];

// log10(sqrt(T(N,x))) floor vs log10(coalN(N,1.3,x)) ceiling, N = 3, 4, 5,
// with the coalN = 1 firing-onset markers (imp-95286 overpricingCapAtOnsets).
function ConfLbVsCoalNPanel() {
  const points = IMP95303_CURVES;
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const svgH = 340;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 0.5;
  const maxX = 13.5;
  const minY = -3.2;
  const maxY = 1.9;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const zeroLog = 0; // log10(1) = 0, the coalN = 1 firing-onset threshold

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[1, 3, 5, 7, 9, 11, 13]}
      yTicks={[-3, -2, -1, 0, 1]}
      xOf={xOf}
      yOf={yOf}
      xLabel="x = nu d (depth)"
      yLabel="log10 value"
    >
      {/* coalN = 1 firing-onset threshold */}
      <line
        x1={padL}
        y1={yOf(zeroLog)}
        x2={padL + plotW}
        y2={yOf(zeroLog)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <text x={padL + plotW - 4} y={yOf(zeroLog) - 5} textAnchor="end" fill={ED.inkSoft} fontSize={8.5}>
        coalN(N, 1.3, x) = 1 (firing onset)
      </text>
      {N_KEYS.map((N, i) => {
        const floorLine = points
          .map((p) => `${xOf(p.x)},${yOf(Math.log10(p[`n${N}Floor`]))}`)
          .join(' ');
        const ceilLine = points
          .map((p) => `${xOf(p.x)},${yOf(Math.log10(p[`n${N}Ceil`]))}`)
          .join(' ');
        const onset = IMP95303_ONSETS[`n${N}`];
        return (
          <g key={N}>
            <polyline points={ceilLine} fill="none" stroke={N_COLORS[i]} strokeWidth={2} opacity={0.9} />
            <polyline
              points={floorLine}
              fill="none"
              stroke={N_COLORS[i]}
              strokeWidth={1.5}
              strokeDasharray="6 3"
              opacity={0.7}
            />
            <circle cx={xOf(onset.x)} cy={yOf(zeroLog)} r={3.5} fill={N_COLORS[i]} stroke={ED.paper} strokeWidth={1} />
          </g>
        );
      })}
      {N_KEYS.map((N, i) => (
        <text key={`lbl-${N}`} x={padL + 8} y={padT + 14 + i * 13} fill={N_COLORS[i]} fontSize={9}>
          N = {N} (solid = coalN ceiling, dashed = sqrt(T) floor)
        </text>
      ))}
    </AxisFrame>
  );
}

export default function Imp95303ConfLbVsCoalNWindowPinchViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Confluent Floor sqrt(T(N,x)) vs COAL-N Ceiling coalN(N,1.3,x) at N = 3, 4, 5 (imp-95286 / imp-95251 / imp-95303)" />

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
        imp-95286 THEOREM CONF-LB supplies a closed-form floor sqrt(T(N,x)) for the confluent span
        value Lambda_conf(N,x), and imp-95251 THEOREM COAL-N supplies the ceiling coalN(N,R,x) for
        the true window sup over at-most-N-rate configurations confined to a ratio-R window. The
        panel below plots both (log10 scale) at window ratio R = 1.3 for N = 3, 4, 5: solid lines
        are the coalN ceiling, dashed lines (same color) the sqrt(T) floor, and the filled dots
        mark the imp-95286 firing onsets where coalN(N,1.3,x) crosses 1 (the gray dashed
        threshold line).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        sqrt(T(N,x)) floor vs coalN(N, {IMP95303_WINDOW_RATIO}, x) ceiling
      </h3>
      <ConfLbVsCoalNPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> at each firing onset
        (filled dot, where the solid ceiling curve crosses the coalN = 1 threshold), the vertical
        gap between the solid ceiling and the dashed floor at the same x is exactly log10(rho),
        the imp-95286 overpricing cap: rho = 3.460619 (N=3, x=4.930455), 6.151212 (N=4,
        x=7.896539), 10.898085 (N=5, x=10.940699). The gap widens with N, matching the imp-95286
        asymptotic rho(N,R,x) -&gt; R^(N-1) = 1.3^(N-1): the WINDOW-PINCH bracket is tightest at
        N = 3 and loosens as N grows, so any future sharpening effort concentrates on the COAL-N
        ceiling side, not the floor (already 1-2 percent from exact per imp-95286).
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
        imp-95303 baked viz-data (curves recomputed independently from the imp-95286 / imp-95251
        documented closed forms). Changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
