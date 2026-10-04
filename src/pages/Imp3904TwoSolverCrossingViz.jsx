import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3904_CROSSING_ROWS,
  IMP3904_SIMPSON_INTERP,
  IMP3904_GL_INTERP,
  IMP3904_CROSS_SOLVER_INTERP_DELTA,
  IMP3904_R226_ROWS,
  IMP3904_CROSS_SOLVER_R226_DELTA,
  IMP3904_ARTIFACT_TO_CONVERGED_RATIO,
} from '../data/imp-3904-two-solver-crossing-viz-data.js';
import { ED } from '../styles/tokens.js';

const SIMPSON_COLOR = ED.series7;
const GL_COLOR = ED.series1;
const ARTIFACT_COLOR = ED.series4;

function CrossingBracketChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xMin = 214.6;
  const xMax = 216.4;
  const yMin = -8e-6;
  const yMax = 3e-6;
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(0) - 4} textAnchor="end" fill={ED.series1} fontSize={8.5}>
        r_n = 0 (unity crossing)
      </text>

      {[IMP3904_SIMPSON_INTERP, IMP3904_GL_INTERP].map((v, i) => (
        <line
          key={'interp' + i}
          x1={xS(v)}
          y1={padT}
          x2={xS(v)}
          y2={padT + cH}
          stroke={i === 0 ? SIMPSON_COLOR : GL_COLOR}
          strokeWidth={1}
          strokeDasharray="2,3"
          opacity={0.6}
        />
      ))}

      {IMP3904_CROSSING_ROWS.map((row) => (
        <g key={'n' + row.n}>
          <circle cx={xS(row.n)} cy={yS(row.simpsonR)} r={5} fill={SIMPSON_COLOR} />
          <circle cx={xS(row.n)} cy={yS(row.glR)} r={5} fill={GL_COLOR} />
          <text x={xS(row.n)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            n={row.n}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        rung n near the crossing
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        r_n = R_n - 1
      </text>

      <g>
        <circle cx={padL + 8} cy={padT - 6} r={4} fill={SIMPSON_COLOR} />
        <text x={padL + 16} y={padT - 2} fill={ED.inkSoft} fontSize={9}>
          Simpson (imp-3849), n* = {IMP3904_SIMPSON_INTERP}
        </text>
        <circle cx={padL + 8} cy={padT + 10} r={4} fill={GL_COLOR} />
        <text x={padL + 16} y={padT + 14} fill={ED.inkSoft} fontSize={9}>
          Gauss-Legendre (imp-3868), n* = {IMP3904_GL_INTERP}
        </text>
      </g>
    </svg>
  );
}

function R226BarChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 16;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const yMin = 1e-6;
  const yMax = 2e-4;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);
  const xS = (i) => padL + ((i + 0.5) / IMP3904_R226_ROWS.length) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(Math.abs(v)) - logYMin) / (logYMax - logYMin));

  const yTicks = [1e-6, 1e-5, 1e-4];
  const colors = [ARTIFACT_COLOR, SIMPSON_COLOR, GL_COLOR];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3904_R226_ROWS.map((row, i) => {
        const barTop = yS(row.r226);
        const barBottom = padT + cH;
        return (
          <rect
            key={row.label}
            x={xS(i) - 34}
            y={barTop}
            width={68}
            height={Math.max(barBottom - barTop, 0)}
            fill={colors[i]}
            opacity={0.85}
            rx={2}
          />
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3904_R226_ROWS.map((row, i) => (
        <text key={'x' + row.label} x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {row.label.split(' (')[0]}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 42} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        |r_226|, log axis
      </text>
    </svg>
  );
}

export default function Imp3904TwoSolverCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Two-Solver Saddle-Crossing Cross-Check: Simpson vs Gauss-Legendre Agree to ~1e-8 (imp-3868/imp-3904)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3868 re-derived the imp-3849 exact-saddle ratio crossing n* = 215.2 and cross-check
        r_226 through a STRUCTURALLY DISTINCT quadrature rule (5-point Gauss-Legendre, O(h^10))
        against imp-3849's composite Simpson (O(h^4)). The two solvers share no node placement,
        weight pattern or error exponent, so their agreement pins the crossing to the de
        Bruijn-Newman kernel, not to a shared Simpson-order artifact. The chart below overlays
        both solvers' r_n = R_n - 1 bracketing the crossing, and the second chart compares the
        imp-3731 inner=1200 near-zero r_226 = -2.314e-6 against the two inner-converged r_226
        values, which are ~{IMP3904_ARTIFACT_TO_CONVERGED_RATIO.toFixed(0)}x larger in magnitude.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        r_n = R_n - 1 bracketing n* = 215.2 -- Simpson (imp-3849) vs Gauss-Legendre (imp-3868)
      </p>
      <CrossingBracketChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        |r_226| -- imp-3731 inner=1200 artifact vs the two inner-converged solvers, log axis
      </p>
      <R226BarChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top chart shows both
        solvers' r_n crossing from positive to negative between n = 215 and n = 216, with the
        linear-interp crossings (Simpson {IMP3904_SIMPSON_INTERP}, Gauss-Legendre{' '}
        {IMP3904_GL_INTERP}) agreeing to ~{IMP3904_CROSS_SOLVER_INTERP_DELTA.toFixed(4)} of a rung.
        The bottom chart shows |r_226| on a log axis: the imp-3731 inner=1200 artifact sits at
        ~2.3e-6 while both inner-converged solvers land at ~8.7e-5, agreeing with each other to
        ~{IMP3904_CROSS_SOLVER_R226_DELTA.toExponential(0)} -- confirming the imp-3731 near-zero
        crossing was an inner-A(tau)-quadrature-resolution artifact, not a feature of the kernel.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> second-solver CONFIRMATION
        only, at the RH-equivalent scale class; both solvers share the finite NPHI=10 kernel
        truncation, so this removes the Simpson-order worry, not the kernel-truncation floor.
        Mass-feasibility is necessary-but-not-sufficient; operator positivity (imp-3066 off-diagonal
        endpoint-Hankel K_a &ge; 0) is UNTOUCHED. NO QED; imp-3849/imp-3731 assertions left intact.
      </div>
    </div>
  );
}
