import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL as D } from '../data/imp-34950-eflow-crossing-strength-cmb-exponent-structural.js';
import { ED } from '../styles/tokens.js';

const P_PINNED = D.exponent.pinned.p;
const CI_LO = D.exponent.pinned.ci95_lo;
const CI_HI = D.exponent.pinned.ci95_hi;
const P_STRUCT_FAR = D.structuralAssessment.p_struct_fartail;
const P_STRUCT_LOCAL = D.structuralAssessment.p_struct_local_2qeff;
const REL_ERR_LOCAL = D.structuralAssessment.rel_err_local;
const REL_ERR_FARTAIL = D.structuralAssessment.rel_err_fartail;
const RAT_1P5 = 1.5;
const RAT_1P6 = 1.6;

// Bracket line: p_struct_fartail (undershoot) < CI < p_struct_local (overshoot), with 3/2 and 8/5
// marked as clean rationals sitting tens of sigma outside the pinned CI.
function BracketChart() {
  const svgW = 720;
  const svgH = 200;
  const padL = 40;
  const padR = 40;
  const padT = 30;
  const padB = 60;
  const cW = svgW - padL - padR;
  const axisY = padT + 40;

  const xMin = 0.95;
  const xMax = 1.8;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;

  const points = [
    { v: P_STRUCT_FAR, label: 'far-tail composite 2(1/2)', sub: `undershoot ${(REL_ERR_FARTAIL * 100).toFixed(0)}%`, color: ED.series2, y: -1 },
    { v: RAT_1P5, label: '3/2', sub: 'clean rational', color: ED.inkFaint, y: 1 },
    { v: P_PINNED, label: `p = ${P_PINNED.toFixed(4)}`, sub: 'measured, pinned', color: ED.series1, y: -1 },
    { v: RAT_1P6, label: '8/5', sub: 'clean rational', color: ED.inkFaint, y: 1 },
    { v: P_STRUCT_LOCAL, label: 'level-pinned 2 q_eff', sub: `overshoot +${(REL_ERR_LOCAL * 100).toFixed(0)}%`, color: ED.brass, y: -1 },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />
      {[1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8].map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={axisY - 4} x2={xAt(t)} y2={axisY + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(t)} y={axisY + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {/* CI band around the pinned exponent */}
      <rect x={xAt(CI_LO)} y={axisY - 10} width={xAt(CI_HI) - xAt(CI_LO)} height={20} fill={ED.series1} opacity={0.25} />

      {points.map((p) => (
        <g key={p.label}>
          <line x1={xAt(p.v)} y1={axisY} x2={xAt(p.v)} y2={axisY + p.y * 20} stroke={p.color} strokeWidth={1.5} />
          <circle cx={xAt(p.v)} cy={axisY} r={4.5} fill={p.color} stroke={ED.paper} strokeWidth={1} />
          <text
            x={xAt(p.v)}
            y={axisY + p.y * 20 + (p.y > 0 ? 12 : -8)}
            textAnchor="middle"
            fill={p.color}
            fontSize={9.5}
            fontWeight={700}
          >
            {p.label}
          </text>
          <text
            x={xAt(p.v)}
            y={axisY + p.y * 20 + (p.y > 0 ? 24 : -20)}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={8.5}
          >
            {p.sub}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        pinned exponent p (95% CI shaded) bracketed by the far-tail and level-pinned-local composites;
        3/2 and 8/5 sit tens of sigma outside the CI
      </text>
    </svg>
  );
}

export default function Imp35000EflowCrossingStrengthExponentDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Crossing-Strength Exponent Decomposition (imp-35000 / imp-34950)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The pinned exponent p = {P_PINNED.toFixed(4)} (95% CI [{CI_LO.toFixed(4)}, {CI_HI.toFixed(4)}])
        sits strictly between the two naive composite predictions: the far-tail composite
        2&times;(1/2) = {P_STRUCT_FAR.toFixed(2)} undershoots by {Math.abs(REL_ERR_FARTAIL * 100).toFixed(0)}%,
        and the level-pinned local composite 2&nbsp;q_eff = {P_STRUCT_LOCAL.toFixed(2)} overshoots by
        {' '}{(REL_ERR_LOCAL * 100).toFixed(0)}%. The clean rationals 3/2 and 8/5 lie{' '}
        {D.exponent.clean_rational_rejection.sigma_from_1p5}&ndash;{D.exponent.clean_rational_rejection.sigma_from_1p6}{' '}
        standard errors outside the CI.
      </p>
      <BracketChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {D.verdict}
      </div>
    </div>
  );
}
