import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95546_LEG_GAINS,
  IMP95546_CUMULATIVE_GAINS,
  IMP95546_LOOSENESS_LADDER,
} from '../data/imp-95546-rzpen7-8-gain-ladder-viz-data.js';
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
  const rows = IMP95546_LEG_GAINS;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 4;
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
      yTicks={[0, 1, 2, 3, 4]}
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

// cumulative floor level relative to RZ-PEN6, plus the looseness ladder
function CumulativeAndLoosenessPanel() {
  const cum = IMP95546_CUMULATIVE_GAINS;
  const loose = IMP95546_LOOSENESS_LADDER;
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
  const maxYCum = 4.5;
  const maxYLoose = 5.5;
  const xOf = (i) => padL + ((i - minX) / (maxX - minX)) * plotW;
  const yOfCum = (v) => padT + plotH - (v / maxYCum) * plotH;
  const yOfLoose = (v) => padT + plotH - (v / maxYLoose) * plotH;

  const cumLine = cum.map((r, i) => `${xOf(i)},${yOfCum(r.cumulativeGain)}`).join(' ');
  // looseness ladder rungs align to legs RZ-PEN6 (i=0), RZ-PEN7 (i=1), RZ-PEN8 (i=2)
  const looseLine = loose.map((r, i) => `${xOf(i)},${yOfLoose(r.looseness)}`).join(' ');

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={cum.map((_, i) => i)}
      yTicks={[0, 1, 2, 3, 4]}
      xOf={xOf}
      yOf={yOfCum}
      xLabel="chain leg (RZ-PEN6 .. RZ-PEN8)"
      yLabel="cumulative gain (left) / looseness (right)"
    >
      <polyline points={cumLine} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.9} />
      {cum.map((r, i) => (
        <circle key={r.leg} cx={xOf(i)} cy={yOfCum(r.cumulativeGain)} r={2.5} fill={ED.series1} />
      ))}
      <polyline points={looseLine} fill="none" stroke={ED.series4} strokeWidth={2} strokeDasharray="6 3" opacity={0.9} />
      {loose.map((r, i) => (
        <circle key={r.leg} cx={xOf(i)} cy={yOfLoose(r.looseness)} r={3} fill={ED.series4} />
      ))}
      <text x={padL + 8} y={padT + 14} fill={ED.series1} fontSize={9}>
        cumulative floor gain vs RZ-PEN6 (left axis)
      </text>
      <text x={padL + 8} y={padT + 27} fill={ED.series4} fontSize={9}>
        looseness inf / A_pen at rho=e^6, r=2 (right axis)
      </text>
    </AxisFrame>
  );
}

export default function Imp95546RzPen78GainLadderViz() {
  const finalGain = IMP95546_CUMULATIVE_GAINS[IMP95546_CUMULATIVE_GAINS.length - 1].cumulativeGain;
  const finalLooseness = IMP95546_LOOSENESS_LADDER[IMP95546_LOOSENESS_LADDER.length - 1].looseness;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="RZ-PEN Symbol-Pencil Floor Gain Ladder, RZ-PEN6 to RZ-PEN8 (imp-95333/imp-95334)" />

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
        The imp-95349 gain-ladder page ends at RZ-PEN6 (imp-95332). This page continues the same
        chain two legs further: imp-95333 (RZ-PEN7, pair-extended kept-pair numerator floor over
        distance-1 and distance-2 shell pairs) and imp-95334 (RZ-PEN8, b-exact pointwise trace
        weight, the chain's LAST named leg -- the pointwise pencil-floor program is EFFECTIVELY
        TERMINAL after it). At (rho, r) = (e^6, 2) the two gains compose to a cumulative{' '}
        {finalGain.toFixed(3)}x floor improvement over RZ-PEN6, while the residual looseness
        against the exact symbol-pencil infimum drops 5.060x &rarr; 3.957x &rarr;{' '}
        {finalLooseness.toFixed(3)}x over the two legs. The imp-95407 audit flagged both source
        modules as ORPHAN (import-light, but no routed page and no visualizations-index.js row);
        this page surfaces them.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Per-leg floor gain factor, rho = e^6, r = 2
      </h3>
      <LegGainBarsPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Cumulative gain vs RZ-PEN6, and residual looseness
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
        immediate-predecessor gain measured and baked in its own module (imp-95333's
        gainRhoE6R2, imp-95334's gainRhoE6R2); the line chart composes them into a running floor
        level relative to RZ-PEN6. The dashed looseness line shows the gap to the exact
        symbol-pencil infimum collapsing from 5.06x to just over 1x by RZ-PEN8 -- imp-95334 names
        the pointwise pencil-floor sharpening program EFFECTIVELY TERMINAL at that point (only
        ~2-3 percent chart-refinement / kept-pair headroom remains); the surviving looseness lives
        off-lattice (imp-95232) and in the b-uniform corollary, both still OPEN.
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
        imp-95546 baked viz-data (values copied verbatim from the imp-95333 / imp-95334 records,
        no re-derivation). Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
