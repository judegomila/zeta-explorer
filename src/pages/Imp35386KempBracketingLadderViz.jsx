import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35386_LADDER,
  IMP35386_K_CLOSED_FORM,
  IMP35386_COARSEST_NOTE,
  IMP35386_FINEST_NOTE,
} from '../data/imp-35386-kemp-bracketing-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const POINT_COLOR = ED.series1;
const K_COLOR = ED.series7;
const END_COLOR = ED.series4;

function KEmpChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const xMin = -3.2;
  const xMax = -1.0;
  const yMin = 0.388;
  const yMax = 0.422;

  const xS = (v) => padL + cW * ((v - xMin) / (xMax - xMin));
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const yTicks = [0.39, 0.395, 0.4, 0.405, 0.41, 0.415, 0.42];
  const xTicks = [-3, -2.5, -2, -1.5, -1];

  const first = IMP35386_LADDER[0];
  const last = IMP35386_LADDER[IMP35386_LADDER.length - 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      {xTicks.map((v) => (
        <text key={v} x={xS(v)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      <line
        x1={padL}
        y1={yS(IMP35386_K_CLOSED_FORM)}
        x2={padL + cW}
        y2={yS(IMP35386_K_CLOSED_FORM)}
        stroke={K_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + 6} y={yS(IMP35386_K_CLOSED_FORM) - 6} fill={K_COLOR} fontSize={9}>
        K = 8 sqrt(2)/(9 pi) = {IMP35386_K_CLOSED_FORM.toFixed(6)}
      </text>

      {IMP35386_LADDER.map((r) => {
        const isEnd = r.N === first.N || r.N === last.N;
        return (
          <circle
            key={r.N}
            cx={xS(r.log10Eps)}
            cy={yS(r.kEmpirical)}
            r={isEnd ? 5 : 3.5}
            fill={isEnd ? END_COLOR : POINT_COLOR}
          />
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        kEmpirical
      </text>
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(eps)
      </text>
    </svg>
  );
}

export default function Imp35386KempBracketingLadderViz() {
  const first = IMP35386_LADDER[0];
  const last = IMP35386_LADDER[IMP35386_LADDER.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Empirical Prefactor kEmp Across the imp-35076 Ladder (imp-35264)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35264 tabulated the empirical prefactor kEmp(eps) = (rho_meas - 2/3) / eps^{'{3/2}'}
        implied by each imp-35076 finite-ladder margin rung, and cross-checked it against the
        imp-35240 confirmed closed form K = 8 sqrt(2)/(9 pi) = {IMP35386_K_CLOSED_FORM.toFixed(6)}.
        In the best-resolved mid-ladder window kEmp brackets K to within ~5e-4; the two ends of
        the ladder depart for understood reasons, annotated below.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        kEmp(eps) vs log10(eps), against the K reference line
      </p>
      <KEmpChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Two-end departures (both understood, neither a
        prefactor conflict):</strong>
        <ul style={{ marginTop: '0.4rem', marginBottom: 0, paddingLeft: '1.1rem' }}>
          <li>
            N={first.N.toLocaleString()} (kEmp={first.kEmpirical.toFixed(6)}): {IMP35386_COARSEST_NOTE}.
          </li>
          <li>
            N={last.N.toLocaleString()} (kEmp={last.kEmpirical.toFixed(6)}): {IMP35386_FINEST_NOTE}.
          </li>
        </ul>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only over the
        inherited imp-35264 numbers -- adds a chart, no new measurement. Changes no bound, does
        NOT discharge O3 / H3 / H4 / G6a, imp-3066 off-diagonal endpoint-Hankel K_a &ge; 0
        UNTOUCHED, C_mb remains GUE-conditional (imp-486). RH-equivalent, NO QED.
      </div>
    </div>
  );
}
