import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3540_BUDGET_LADDER,
  IMP3540_FIXED_BUDGET,
  IMP3540_FIXED_BUDGET_GAPS,
} from '../data/imp-3540-power-iteration-budget-viz-data.js';

const N_MIN = 160;
const N_MAX = 800;

function BudgetLadderChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const logN = (N) => Math.log10(N);
  const logNMin = logN(N_MIN);
  const logNMax = logN(N_MAX);
  const yMin = Math.log10(400);
  const yMax = Math.log10(8000);

  const xS = (N) => padL + ((logN(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const path = IMP3540_BUDGET_LADDER.map(
    (c, i) => (i === 0 ? 'M' : 'L') + xS(c.N).toFixed(1) + ',' + yS(c.budgetToClose).toFixed(2),
  ).join(' ');

  const yTicks = [500, 1000, 2000, 4000, 8000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke="#10b981" strokeWidth={2.4} />
      {IMP3540_BUDGET_LADDER.map((c) => (
        <circle key={c.N} cx={xS(c.N)} cy={yS(c.budgetToClose)} r={4} fill="#10b981" />
      ))}
      {IMP3540_BUDGET_LADDER.map((c) => (
        <text key={'lbl' + c.N} x={xS(c.N)} y={yS(c.budgetToClose) - 8} textAnchor="middle" fill="#6ee7b7" fontSize={8.5}>
          {c.budgetToClose === 6500 ? '~6250' : c.budgetToClose}
        </text>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3540_BUDGET_LADDER.map((c) => (
        <g key={'x' + c.N}>
          <line x1={xS(c.N)} y1={padT + cH} x2={xS(c.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(c.N)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {c.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        section size N (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        budget to reach 1e-9 gap
      </text>
    </svg>
  );
}

function FixedBudgetGapChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const logN = (N) => Math.log10(N);
  const logNMin = logN(N_MIN);
  const logNMax = logN(N_MAX);
  const yMin = -15;
  const yMax = -5;

  const xS = (N) => padL + ((logN(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const path = IMP3540_FIXED_BUDGET_GAPS.map(
    (c, i) => (i === 0 ? 'M' : 'L') + xS(c.N).toFixed(1) + ',' + yS(c.gap).toFixed(2),
  ).join(' ');

  const yTicks = [1e-14, 1e-12, 1e-10, 1e-8, 1e-6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke="#f59e0b" strokeWidth={2.4} />
      {IMP3540_FIXED_BUDGET_GAPS.map((c) => (
        <circle key={c.N} cx={xS(c.N)} cy={yS(c.gap)} r={4} fill="#f59e0b" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3540_FIXED_BUDGET_GAPS.map((c) => (
        <g key={'x' + c.N}>
          <line x1={xS(c.N)} y1={padT + cH} x2={xS(c.N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(c.N)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {c.N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        section size N (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        relative gap at budget={IMP3540_FIXED_BUDGET}
      </text>
    </svg>
  );
}

export default function Imp3540PowerIterationBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Power-Iteration Budget-to-1e-9 Growth (imp-3505 / imp-3540)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3505 swept the power-iteration step budget on the skew-Toeplitz section norm{' '}
        &Vert;Ttilde&Vert; across the imp-3240 U-grid and measured two monotone-in-N ladders
        against a converged (Krylov m=160) Lanczos reference. Both are the same underlying
        signature: the top-singular gap of the section shrinks as N grows, so power iteration
        needs more steps to converge.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Budget needed to reach 1e-9 relative agreement, vs. section size N
      </p>
      <BudgetLadderChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Relative gap at a fixed budget of {IMP3540_FIXED_BUDGET} steps, vs. section size N
      </p>
      <FixedBudgetGapChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. The budget ladder and fixed-budget gap curve are
        two views of the same skew-Toeplitz top-singular-gap shrinkage imp-3505 diagnosed
        (later fit in closed form by imp-3530); they do not construct the missing K_a &ge; 0
        sign-positivity residual (imp-3066), which remains untouched. Platt-Trudgian &Lambda;
        &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3467-closed-form-c" style={{ color: '#7c3aed' }}>
          Closed-Form C-Assembly (imp-3467)
        </Link>
        {' | '}
        <Link to="/viz-imp3564-power-iteration-closed-form" style={{ color: '#7c3aed' }}>
          Closed-Form K&middot;N^2 Fit (imp-3564)
        </Link>
      </div>
    </div>
  );
}
