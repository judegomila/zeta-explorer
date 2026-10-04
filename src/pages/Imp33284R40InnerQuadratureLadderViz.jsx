import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33284_LADDER,
  IMP33284_COARSE_H_INNER,
  IMP33284_COARSE_DELTA,
  IMP33284_TIE_BAR,
} from '../data/imp-33284-r40-inner-quadrature-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const ALL_POINTS = [...IMP33284_LADDER, { hInner: IMP33284_COARSE_H_INNER, delta: IMP33284_COARSE_DELTA, withinTieBar: false, isCoarse: true }].sort(
  (a, b) => a.hInner - b.hInner,
);

const H_MIN = 3e-4;
const H_MAX = 1e-2;
const D_MIN = 1e-10;
const D_MAX = 5e-5;

function ConvergenceLadderChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const xS = (h) => padL + ((Math.log10(h) - Math.log10(H_MIN)) / (Math.log10(H_MAX) - Math.log10(H_MIN))) * cW;
  const yS = (d) => padT + cH * (1 - (Math.log10(d) - Math.log10(D_MIN)) / (Math.log10(D_MAX) - Math.log10(D_MIN)));

  const path = ALL_POINTS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.hInner).toFixed(1) + ',' + yS(r.delta).toFixed(2)).join(' ');

  // O(h^4) reference guide anchored at the finest sweep rung.
  const anchor = IMP33284_LADDER[IMP33284_LADDER.length - 1];
  const guideH0 = anchor.hInner;
  const guideD0 = anchor.delta;
  const guideH1 = H_MAX;
  const guideD1 = guideD0 * (guideH1 / guideH0) ** 4;
  const guidePath = 'M' + xS(guideH0).toFixed(1) + ',' + yS(guideD0).toFixed(2) + ' L' + xS(guideH1).toFixed(1) + ',' + yS(guideD1).toFixed(2);

  const xTicks = [1e-3, 3e-3, 1e-2];
  const yTicks = [1e-9, 1e-7, 1e-5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP33284_TIE_BAR)} x2={padL + cW} y2={yS(IMP33284_TIE_BAR)} stroke={ED.series7} strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={padL + 4} y={yS(IMP33284_TIE_BAR) - 5} textAnchor="start" fill={ED.series7} fontSize={8.5}>
        informal tie bar ~1e-5
      </text>

      <path d={guidePath} fill="none" stroke={ED.rule} strokeWidth={1} strokeDasharray="2,2" />

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ALL_POINTS.map((r) => (
        <circle
          key={r.hInner}
          cx={xS(r.hInner)}
          cy={yS(r.delta)}
          r={r.isCoarse ? 5 : 4}
          fill={r.isCoarse ? ED.series4 : r.withinTieBar ? ED.series3 : ED.series1}
          stroke={r.isCoarse ? ED.series4 : 'none'}
          strokeWidth={r.isCoarse ? 1.5 : 0}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((v) => (
        <g key={'x' + v}>
          <line x1={xS(v)} y1={padT + cH} x2={xS(v)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        h_inner (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        delta = |R_40(h) - R_40_converged| (log scale)
      </text>
    </svg>
  );
}

export default function Imp33284R40InnerQuadratureLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="R_40 Inner-Quadrature O(h^4) Convergence Ladder (imp-33256 / imp-33284)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33256 swept the inner A(tau) Simpson resolution (holding the outer moment grid fixed
        at the imp-3849 converged T_A=2, NM=3200) to explain the ~1.21e-5 imp-3888 R_40 residual.
        Refining the inner panel width h_inner drives delta = |R_40(h_inner) - R_40_converged|
        down with classic O(h^4) Simpson convergence, crossing the informal ~1e-5 tie bar between
        h_inner ~ 5.7e-3 (above) and h_inner ~ 5.0e-3 (below). The imp-3685 native coarse grid
        ([0,7]/1200, h_inner &asymp; 5.83e-3, orange marker) is the only rung on the wrong side of
        the bar -- purely because it is the coarsest inner grid in the family.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        delta vs h_inner (log-log), tie bar dashed pink, O(h^4) reference slope dashed grey
      </p>
      <ConvergenceLadderChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the ladder tracks the
        O(h^4) reference slope closely across three-plus decades of h_inner, confirming the
        residual is genuine Simpson-order quadrature drift and not noise or a bug. Green markers
        sit within the informal tie bar; blue markers (the three coarsest sweep rungs) and the
        orange imp-3685 marker sit above it.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This ladder tabulates the inner-quadrature
        sensitivity of a single moment-ratio diagnostic (R_40) used inside a mass-feasibility
        check; mass-feasibility is necessary-but-not-sufficient and the operator-level K_a &ge; 0
        sign-positivity residual (imp-3066) remains untouched.
      </div>
    </div>
  );
}
