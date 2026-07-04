import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33573_ROWS,
  IMP33573_FLOOR_ULP,
  IMP33573_PLATEAU_SAVING_VS_SIMPSON,
  IMP33573_GRADED_VS_CC_NODE_RATIO,
} from '../data/imp-33573-r40-cross-solver-node-budget-viz-data.js';

const COLORS = {
  'Clenshaw-Curtis': '#38bdf8',
  'Graded-GL': '#f59e0b',
  'Simpson ladder': '#ef4444',
};

function NodeBudgetBarChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 60;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nodesMin = 30;
  const nodesMax = 40000;
  const logMin = Math.log10(nodesMin);
  const logMax = Math.log10(nodesMax);
  const yS = (nodes) => padT + cH * (1 - (Math.log10(nodes) - logMin) / (logMax - logMin));

  const groupW = cW / IMP33573_ROWS.length;
  const barW = 46;
  const gridNodes = [100, 1000, 10000, 40000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {gridNodes.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {IMP33573_ROWS.map((row, i) => {
        const cx = padL + groupW * (i + 0.5);
        const barY = yS(row.minNodes);
        const color = COLORS[row.solver] || '#94a3b8';

        return (
          <g key={row.label}>
            <rect
              x={cx - barW / 2}
              y={barY}
              width={barW}
              height={padT + cH - barY}
              fill={color}
              opacity={0.85}
            />
            <text x={cx} y={barY - 6} textAnchor="middle" fill={color} fontSize={10}>
              {row.minNodes}
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {row.solver}
            </text>
            <text x={cx} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={8}>
              {row.label.length > 26 ? `${row.label.slice(0, 24)}...` : row.label}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        nodes to clear R_40 floor (log scale)
      </text>
    </svg>
  );
}

export default function Imp33573R40CrossSolverNodeBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="R_40 Cross-Solver Node Budget (imp-33536)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        imp-33308 measured a ~63x inner-node saving of the graded-GL rule over a uniform-Simpson
        doubling-plus-Richardson ladder for the imp-33292 R_40 = |D_40|/|D_40^saddle| moment ratio.
        imp-33536 re-ran the same measurement under an INDEPENDENT Clenshaw-Curtis cross-solver
        (Chebyshev-Lobatto nodes + CC weights, sharing nothing with either the Simpson family or
        Gauss-Legendre) to check whether that ~63x reflects an intrinsic graded advantage or just a
        weak baseline. The chart below overlays all three solvers&apos; smallest node budget that
        clears the &lt; {IMP33573_FLOOR_ULP} ULP R_40 floor band (log scale).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Nodes to clear the &lt; {IMP33573_FLOOR_ULP} ULP R_40 floor: Clenshaw-Curtis (blue) vs graded-GL (amber) vs Simpson ladder (red)
      </p>
      <NodeBudgetBarChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The graded-GL plateau rule (400 nodes) reaches the floor at{' '}
        <strong>{IMP33573_PLATEAU_SAVING_VS_SIMPSON.toFixed(1)}x</strong> fewer nodes than the
        25206-node Simpson ladder -- the ~63x carries. But a single Clenshaw-Curtis grid alone
        reaches the same floor at just <strong style={{ color: COLORS['Clenshaw-Curtis'] }}>69</strong>{' '}
        nodes, node-competitive with the 80-node graded minimum (ratio{' '}
        <strong>{IMP33573_GRADED_VS_CC_NODE_RATIO.toFixed(2)}x</strong>). So against a strong
        independent solver the graded rule is not ~63x cheaper -- the headline figure is
        baseline-relative to the weak Simpson ladder, not an intrinsic property of grading.
      </p>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> all three bars measure
        node budgets under the SAME held-verbatim imp-33292 outer machinery (T_A=2, NM=3200,
        D_40 = C_42 - C_40), scored against the imp-33536 independently-converged Clenshaw-Curtis
        target (R_40 = 1.02439669503136, matched to ~52 ULP). The gap between the CC bar and the
        Simpson bar is almost five orders of magnitude, but the gap between the CC bar and the
        graded-GL bars is under 6x -- the Simpson ladder, not the graded rule, is the outlier.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design
        cross-solver measurement only, of an already-verified sweep (imp-33308/imp-33536). It
        changes no bound and patches no literal (imp-3685/imp-3849/imp-33292/imp-33308 intact). The
        exact node counts are jittery arithmetic-floor lattice properties (imp-33249/imp-33277/
        imp-33295 latticeJitterCaveat); the robust reading is the ORDER of the budgets, not the
        exact counts. Mass-feasibility is necessary-but-not-sufficient; the operator-level
        positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
