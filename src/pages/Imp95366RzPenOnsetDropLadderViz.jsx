import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95366_ONSET_LADDER,
  IMP95366_ONSET_DROPS,
} from '../data/imp-95366-rzpen-onset-drop-ladder-viz-data.js';
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

const TRACK_KEYS = ['xStarUniform', 'xStarR13', 'xStarR105'];
const TRACK_LABELS = { xStarUniform: 'm-and-r-uniform', xStarR13: 'r = 1.3', xStarR105: 'r = 1.05' };
const TRACK_COLORS = { xStarUniform: ED.series1, xStarR13: ED.series4, xStarR105: ED.series5 };

// line chart of the every-octave firing onset ladder, one line per track
function OnsetLadderPanel() {
  const rows = IMP95366_ONSET_LADDER;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minY = 12.5;
  const maxY = 14.5;
  const xOf = (i) => padL + (plotW / (rows.length - 1)) * i;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={rows.map((_, i) => i)}
      yTicks={[12.5, 13, 13.5, 14, 14.5]}
      xOf={xOf}
      yOf={yOf}
      xLabel="chain leg (RZ-PEN2 .. RZ-PEN6)"
      yLabel="every-octave firing onset x*"
    >
      {TRACK_KEYS.map((key) => (
        <g key={key}>
          <polyline
            points={rows.map((r, i) => `${xOf(i)},${yOf(r[key])}`).join(' ')}
            fill="none"
            stroke={TRACK_COLORS[key]}
            strokeWidth={2}
            opacity={0.9}
          />
          {rows.map((r, i) => (
            <circle key={`${key}-${r.leg}`} cx={xOf(i)} cy={yOf(r[key])} r={2.5} fill={TRACK_COLORS[key]} />
          ))}
        </g>
      ))}
      {rows.map((r, i) => (
        <text key={r.leg} x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.leg}
        </text>
      ))}
      {TRACK_KEYS.map((key, i) => (
        <text key={`lbl-${key}`} x={padL + 8} y={padT + 14 + i * 13} fill={TRACK_COLORS[key]} fontSize={9}>
          {TRACK_LABELS[key]}
        </text>
      ))}
    </AxisFrame>
  );
}

// bar chart of the per-leg onset drop (m-and-r-uniform track), showing
// which currency contributed each onset drop
function OnsetDropBarsPanel() {
  const rows = IMP95366_ONSET_DROPS;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 56;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 1.05;
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
      yTicks={[0, 0.25, 0.5, 0.75, 1]}
      xOf={xOf}
      yOf={yOf}
      xLabel="chain leg"
      yLabel="onset drop (m-and-r-uniform track)"
    >
      {rows.map((r, i) => (
        <g key={r.leg}>
          <rect
            x={xOf(i) - barW / 2}
            y={yOf(r.dropUniform)}
            width={barW}
            height={yOf(0) - yOf(r.dropUniform)}
            fill={r.dropUniform > 1e-9 ? ED.series1 : ED.paper3}
            opacity={0.85}
          />
          <text x={xOf(i)} y={yOf(r.dropUniform) - 6} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {r.dropUniform.toFixed(4)}
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

export default function Imp95366RzPenOnsetDropLadderViz() {
  const first = IMP95366_ONSET_LADDER[0];
  const last = IMP95366_ONSET_LADDER[IMP95366_ONSET_LADDER.length - 1];
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="RZ-PEN Symbol-Pencil Every-Octave Onset-Drop Ladder (imp-95328..95332)" />

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
        summary of already-proven per-leg onset shifts, not a new theorem. It changes no Lambda
        bound and establishes no operator positivity. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The dyadic-twin-skeleton every-octave firing onset (the depth x beyond which the RZ-PEN
        block symbol-pencil floor certifies the coalescence bound) has been pushed out across the
        same chain of executed residual legs that imp-95349 charts for the rho = e^6 floor gain:
        imp-95329 (beta-trace cap), imp-95330 (K = 256 chart refinement), imp-95331 (split-weight
        exact-root), and imp-95332 (per-chart tail cap). On the m-and-r-uniform track the onset
        drops from {first.xStarUniform} to {last.xStarUniform}, and the drop is <em>not</em> spread
        evenly: the chart-refinement leg alone supplies the bulk of it.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Firing onset x* by chain leg, all three reported tracks
      </h3>
      <OnsetLadderPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Per-leg onset drop (m-and-r-uniform track): which currency moved the needle
      </h3>
      <OnsetDropBarsPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the beta-trace-cap leg
        (RZ-PEN3) moves the onset by only about 0.06 on every track, but the K = 256 chart-cover
        leg (RZ-PEN4) moves it by about 0.94 &mdash; almost the whole ladder drop. The last two
        legs (RZ-PEN5 side-weight/exact-root, RZ-PEN6 per-chart tail cap) leave the rho = 2 onset
        bitwise unchanged: their gains only activate above the exact-root activation crossover
        rho &asymp; 6.5, which the every-octave dyadic certificate never reaches.
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
        imp-95366 baked viz-data (values copied verbatim from the imp-95328 / imp-95329 /
        imp-95330 / imp-95331 / imp-95332 records, no re-derivation). Changes no bound, establishes
        no operator positivity, no RH claim.
        NO QED.
      </div>
    </div>
  );
}
