import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96555_CLASSICAL_PROLATE_CURVE,
  IMP96555_C_DIP,
  IMP96555_MOMENT_LADDER,
  IMP96555_PENCIL_RATIO,
  IMP96555_HONEST_BANNER,
} from '../data/imp-96555-route-i-concentration-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the Route I uncertainty/concentration analysis verbatim (no new computation): the
// classical prolate/Slepian curve lambda_0(c) with the dip time-bandwidth c_dip marked, the
// dip moment ladder (free -> pole-free -> two-moment -> three-moment) falling well below the
// unconstrained value, and the pole-free sharp-pencil ratio nu_max = 0.9977 showing how thin
// the margin is before three vanishing moments are added.
const CURVE = IMP96555_CLASSICAL_PROLATE_CURVE;
const C_DIP = IMP96555_C_DIP;
const LADDER = IMP96555_MOMENT_LADDER;
const RATIO = IMP96555_PENCIL_RATIO;

function ProlateCurveChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const cMax = Math.max(...CURVE.map((r) => r.c)) * 1.05;
  const xAt = (c) => padL + (c / cMax) * cW;
  const yAt = (v) => padT + cH - v * cH;

  const path = CURVE.map((r, i) => `${i === 0 ? 'M' : 'L'}${xAt(r.c).toFixed(2)},${yAt(r.lambda0).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      {[0, 1, 2, 3].map((c) => (
        <text key={c} x={xAt(c)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {c}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        time-bandwidth c
      </text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />

      {/* c_dip marker at a = (ln3)/2 */}
      <line
        x1={xAt(C_DIP.c)}
        y1={padT}
        x2={xAt(C_DIP.c)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      <circle cx={xAt(C_DIP.c)} cy={yAt(C_DIP.lambda0)} r={4} fill={ED.brassDeco} />
      <text x={xAt(C_DIP.c) + 6} y={yAt(C_DIP.lambda0) - 8} textAnchor="start" fill={ED.brass} fontSize={9} fontWeight={700}>
        c_dip = {C_DIP.c.toFixed(4)}, lambda_0 = {C_DIP.lambda0.toFixed(6)}
      </text>
    </svg>
  );
}

function MomentLadderChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const vMax = Math.max(...LADDER.map((r) => r.value)) * 1.15;
  const yAt = (v) => padT + cH - (v / vMax) * cH;
  const barW = 110;
  const gap = (cW - LADDER.length * barW) / (LADDER.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, vMax / 2, vMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {LADDER.map((r, i) => {
        const x = padL + gap + i * (barW + gap);
        return (
          <g key={r.label}>
            <rect x={x} y={yAt(r.value)} width={barW} height={cH - (yAt(r.value) - padT)} fill={ED.series5} opacity={0.85} />
            <text x={x + barW / 2} y={yAt(r.value) - 6} textAnchor="middle" fill={ED.ink} fontSize={10} fontWeight={700}>
              {r.value.toFixed(4)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function PencilRatioChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = [
    { label: 'pole-free', value: RATIO.poleFree },
    { label: '1 moment', value: RATIO.oneMoment },
    { label: '2 moments', value: RATIO.twoMoments },
    { label: '3 moments', value: RATIO.threeMoments },
  ];
  const yAt = (v) => padT + cH - v * cH;
  const barW = 110;
  const gap = (cW - rows.length * barW) / (rows.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      {/* nu = 1 reference line: a fully cancelling pencil */}
      <line x1={padL} y1={yAt(1)} x2={padL + cW} y2={yAt(1)} stroke={ED.series2} strokeWidth={1} strokeDasharray="2 3" />

      {rows.map((r, i) => {
        const x = padL + gap + i * (barW + gap);
        return (
          <g key={r.label}>
            <rect x={x} y={yAt(r.value)} width={barW} height={cH - (yAt(r.value) - padT)} fill={ED.series1} opacity={0.85} />
            <text x={x + barW / 2} y={yAt(r.value) - 6} textAnchor="middle" fill={ED.ink} fontSize={10} fontWeight={700}>
              {r.value.toFixed(6)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp96555RouteIConcentrationLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Concentration Ladder (imp-96555)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The classical prolate/Slepian eigenvalue lambda_0(c) bounds the fraction of a
        time-bandwidth-c signal that can concentrate in the dip window. At a = (ln3)/2 the dip
        time-bandwidth is c_dip = {C_DIP.c.toFixed(4)}, giving lambda_0(c_dip) = {C_DIP.lambda0.toFixed(6)}.
      </p>
      <ProlateCurveChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Adding vanishing-moment constraints (pole-free, then two and three moments) pulls the
        dip-window concentration down from {LADDER[0].value.toFixed(4)} to {LADDER[LADDER.length - 1].value.toFixed(4)}.
      </p>
      <MomentLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Even so, the pole-free sharp-pencil ratio nu_max = {RATIO.poleFree.toFixed(6)} sits within
        0.23% of 1: only three vanishing moments push the ratio comfortably below the fully
        cancelling line.
      </p>
      <PencilRatioChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP96555_HONEST_BANNER}
      </div>
    </div>
  );
}
