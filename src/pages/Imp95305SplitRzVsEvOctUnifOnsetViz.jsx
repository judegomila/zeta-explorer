import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95305_CURVES,
  IMP95305_XSTAR_SPLITRZ,
  IMP95305_XSTAR_EVOCTUNIF,
  IMP95305_WINDOW_RATIO,
} from '../data/imp-95305-splitrz-vs-evoctunif-onset-viz-data.js';
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

// log10(certSplitRz(x, 1.3)) vs log10(certUnif(x)), x = 8..32, with the
// two firing-onset markers (imp-95252 xStarRz = 15.981584, imp-95250
// xStarUnif = 27.035582).
function SplitRzVsEvOctUnifPanel() {
  const points = IMP95305_CURVES;
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const svgH = 340;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 7;
  const maxX = 33;
  const minY = -14.5;
  const maxY = 16;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const zeroLog = 0; // log10(1) = 0, the fires-at-1 threshold

  const splitRzLine = points.map((p) => `${xOf(p.x)},${yOf(Math.log10(p.splitRz))}`).join(' ');
  const evOctUnifLine = points.map((p) => `${xOf(p.x)},${yOf(Math.log10(p.evOctUnif))}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={[8, 12, 16, 20, 24, 28, 32]}
      yTicks={[-14, -7, 0, 7, 14]}
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
        certificate = 1 (firing onset)
      </text>
      <polyline points={splitRzLine} fill="none" stroke={ED.series3} strokeWidth={2} opacity={0.9} />
      <polyline points={evOctUnifLine} fill="none" stroke={ED.series4} strokeWidth={2} opacity={0.9} />
      <circle
        cx={xOf(IMP95305_XSTAR_SPLITRZ)}
        cy={yOf(zeroLog)}
        r={3.5}
        fill={ED.series3}
        stroke={ED.paper}
        strokeWidth={1}
      />
      <circle
        cx={xOf(IMP95305_XSTAR_EVOCTUNIF)}
        cy={yOf(zeroLog)}
        r={3.5}
        fill={ED.series4}
        stroke={ED.paper}
        strokeWidth={1}
      />
      <text x={padL + 8} y={padT + 14} fill={ED.series3} fontSize={9}>
        SPLIT-RZ certSplitRz(x, {IMP95305_WINDOW_RATIO}) -- onset {IMP95305_XSTAR_SPLITRZ}
      </text>
      <text x={padL + 8} y={padT + 27} fill={ED.series4} fontSize={9}>
        EV-OCT-UNIF certUnif(x) -- onset {IMP95305_XSTAR_EVOCTUNIF}
      </text>
    </AxisFrame>
  );
}

export default function Imp95305SplitRzVsEvOctUnifOnsetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="SPLIT-RZ vs EV-OCT-UNIF Every-Octave Certificate Onsets (imp-95252 / imp-95250 / imp-95305)" />

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
        Both certificates bound sqrt(Lambda(V, x)) for a twin pair {'{2^k, r 2^k}'} in every
        octave k, at unbounded octave count m. imp-95250 COROLLARY EV-OCT-UNIF pays for
        m-uniformity with depth suppression of high octaves plus a lattice Blaschke tail bound
        PhiUnif; imp-95252 COROLLARY SPLIT-RZ instead uses a single m-uniform block Riesz-basis
        constant A_blk from the Grenander&ndash;Szego/Poisson symbol machinery. The panel
        plots log10 of both certificates against depth x at window ratio r = {IMP95305_WINDOW_RATIO}: the
        filled dots mark where each curve crosses the certificate = 1 firing-onset threshold.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        certSplitRz(x, {IMP95305_WINDOW_RATIO}) vs certUnif(x)
      </h3>
      <SplitRzVsEvOctUnifPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> SPLIT-RZ (green) crosses
        the threshold at x = {IMP95305_XSTAR_SPLITRZ}, roughly eleven depth units before
        EV-OCT-UNIF (orange) crosses at x = {IMP95305_XSTAR_EVOCTUNIF}. At small x both
        certificates are far above 1 (vacuous), and EV-OCT-UNIF starts many orders of magnitude
        higher than SPLIT-RZ because PhiUnif (~1e-21) is far smaller than A_blk is large relative
        to the shared coalLaw numerator -- the fixed m-uniform Riesz constant of SPLIT-RZ avoids
        paying the double-exponential depth-suppression penalty that EV-OCT-UNIF's envelope
        carries for every higher octave. Neither curve is coalescence-uniform (both degrade as
        r &rarr; 1); the onset drop is the m-uniform, fixed-r comparison imp-95252 records.
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
        imp-95305 baked viz-data (curves recomputed independently from the imp-95252 / imp-95250
        documented closed forms). Changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
