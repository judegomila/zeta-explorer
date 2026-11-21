import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95317_CURVES,
  IMP95317_ONSETS,
  IMP95317_N,
  IMP95317_R_VALUES,
} from '../data/imp-95317-confluent-bracket-across-r-viz-data.js';
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

const R_KEY = { 1: 'ceilR1', 1.3: 'ceilR1_3', 2: 'ceilR2', 3: 'ceilR3' };
const R_ONSET_KEY = { 1: 'r1', 1.3: 'r1_3', 2: 'r2', 3: 'r3' };
const R_COLORS = [ED.series3, ED.series1, ED.series4, ED.series7];

// log10(sqrt(T(3,x))) floor vs log10(coalN(3,R,x)) ceiling for R = 1, 1.3, 2, 3
function ConfluentBracketAcrossRPanel() {
  const points = IMP95317_CURVES;
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
  const maxY = 1.35;
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
        coalN(3, R, x) = 1 (firing onset)
      </text>
      {/* single R-independent floor curve */}
      <polyline
        points={points.map((p) => `${xOf(p.x)},${yOf(Math.log10(p.floor))}`).join(' ')}
        fill="none"
        stroke={ED.rule}
        strokeWidth={1.5}
        strokeDasharray="6 3"
        opacity={0.85}
      />
      {IMP95317_R_VALUES.map((R, i) => {
        const key = R_KEY[R];
        const ceilLine = points.map((p) => `${xOf(p.x)},${yOf(Math.log10(p[key]))}`).join(' ');
        const onsetX = IMP95317_ONSETS[R_ONSET_KEY[R]];
        return (
          <g key={R}>
            <polyline points={ceilLine} fill="none" stroke={R_COLORS[i]} strokeWidth={2} opacity={0.9} />
            <circle cx={xOf(onsetX)} cy={yOf(zeroLog)} r={3.5} fill={R_COLORS[i]} stroke={ED.paper} strokeWidth={1} />
          </g>
        );
      })}
      <text x={padL + 8} y={padT + 14} fill={ED.inkSoft} fontSize={9}>
        dashed = sqrt(T(3,x)) floor (R-independent)
      </text>
      {IMP95317_R_VALUES.map((R, i) => (
        <text key={`lbl-${R}`} x={padL + 8} y={padT + 27 + i * 13} fill={R_COLORS[i]} fontSize={9}>
          R = {R} ceiling coalN(3, {R}, x)
        </text>
      ))}
    </AxisFrame>
  );
}

export default function Imp95317ConfluentBracketAcrossRViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Confluent Bracket Across Window Ratio R at Fixed N = 3 (imp-95286 / imp-95251 / imp-95317)" />

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
        positivity. RH does not
        follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95303 already baked the imp-95286 / imp-95251 confluent bracket at fixed window ratio
        R = 1.3 while varying the rate count N = 3, 4, 5. This panel fixes N = {IMP95317_N} and
        instead varies the window ratio R over {IMP95317_R_VALUES.join(', ')}: the dashed curve is
        the single R-independent floor sqrt(T(3,x)), and the four solid curves are the
        coalN(3, R, x) ceiling at each R. Widening R pushes the firing onset (filled dot, where
        the ceiling crosses 1) further out in x and inflates the ceiling relative to the floor.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        sqrt(T(3,x)) floor vs coalN(3, R, x) ceiling, R = {IMP95317_R_VALUES.join(', ')}
      </h3>
      <ConfluentBracketAcrossRPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the firing onset shifts
        right as R grows (x = 4.353191, 4.930455, 5.948776, 6.947519 at R = 1, 1.3, 2, 3), and the
        vertical gap between each solid ceiling and the dashed floor widens with R. The imp-95286
        COROLLARY WINDOW-PINCH asymptote rho(3,R,x) = coalN/floor &rarr; R^2 as x &rarr; infinity is
        approached from ABOVE: at x = 100 the ratio rho/R^2 is 1.051 (R=1), 1.041 (R=1.3 and R=2),
        1.024 (R=3), decreasing monotonically with depth toward the limit rather than overshooting
        it. This is the window-ratio axis of the WINDOW-PINCH bracket that imp-95303 (which fixed
        R = 1.3 and varied N) did not visualize.
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
        imp-95317 baked viz-data (curves recomputed independently from the imp-95286 / imp-95251
        documented closed forms). Changes no bound, establishes no operator positivity, no RH
        claim. NO QED.
      </div>
    </div>
  );
}
