import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33257_SWEEP_ROWS,
  IMP33257_PASS_ULP_LINE,
  IMP33257_TAU_STAR_THRESHOLD,
} from '../data/imp-33257-node-budget-full-window-ulp-viz-data.js';

const WORST_COLOR = '#f472b6';
const TAU6_COLOR = '#38bdf8';
const PASS_COLOR = '#34d399';
const FAIL_COLOR = '#fb7185';
const FLOOR_ULP = 0.1; // display floor for log scale (grade3 tau=6 ULP is ~0.0)

function NodeBudgetUlpChart() {
  const svgW = 700;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = Math.log10(FLOOR_ULP);
  const yMax = Math.log10(20000);
  const yS = (ulp) => padT + cH * (1 - (Math.log10(Math.max(ulp, FLOOR_ULP)) - yMin) / (yMax - yMin));

  const n = IMP33257_SWEEP_ROWS.length;
  const slot = cW / n;
  const barW = slot * 0.28;

  const yTicks = [0.1, 1, 10, 100, 1000, 10000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t >= 1 ? t.toLocaleString() : t}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP33257_PASS_ULP_LINE)}
        x2={padL + cW}
        y2={yS(IMP33257_PASS_ULP_LINE)}
        stroke="#fbbf24"
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33257_PASS_ULP_LINE) - 5} textAnchor="end" fill="#fbbf24" fontSize={9}>
        &lt;1-ULP pass line
      </text>

      {IMP33257_SWEEP_ROWS.map((row, i) => {
        const cx = padL + slot * (i + 0.5);
        return (
          <g key={'row' + row.grade}>
            <rect
              x={cx - barW - 2}
              y={yS(row.worstUlp)}
              width={barW}
              height={padT + cH - yS(row.worstUlp)}
              fill={WORST_COLOR}
              opacity={0.85}
            />
            <rect
              x={cx + 2}
              y={yS(row.ulpAtTau6)}
              width={barW}
              height={padT + cH - yS(row.ulpAtTau6)}
              fill={row.passes ? PASS_COLOR : FAIL_COLOR}
              opacity={0.9}
            />
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={600}>
              grade {row.grade}
            </text>
            <text x={cx} y={padT + cH + 29} textAnchor="middle" fill="#64748b" fontSize={8.5}>
              {row.panels.toLocaleString()}p, tau*={row.tauStar.toFixed(3)}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        ULP gap (log scale)
      </text>

      <g>
        <rect x={padL + 8} y={padT - 16} width={10} height={10} fill={WORST_COLOR} opacity={0.85} />
        <text x={padL + 22} y={padT - 7} fill="#94a3b8" fontSize={9}>
          worst-in-window ULP
        </text>
        <rect x={padL + 170} y={padT - 16} width={10} height={10} fill={TAU6_COLOR} opacity={0.9} />
        <text x={padL + 184} y={padT - 7} fill="#94a3b8" fontSize={9}>
          ULP at tau=6 (green=passes, red=fails)
        </text>
      </g>
    </svg>
  );
}

function SweepTable() {
  const th = { textAlign: 'right', padding: '0.35rem 0.6rem', color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #334155' };
  const td = { textAlign: 'right', padding: '0.3rem 0.6rem', color: '#cbd5e1', fontVariantNumeric: 'tabular-nums' };
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', width: '100%', maxWidth: 760 }}>
      <thead>
        <tr>
          <th style={{ ...th, textAlign: 'left' }}>grade</th>
          <th style={th}>panels</th>
          <th style={th}>GL-10 nodes</th>
          <th style={th}>tau*</th>
          <th style={th}>worst ULP (@tau)</th>
          <th style={th}>ULP @ tau=6</th>
          <th style={{ ...th, textAlign: 'left' }}>verdict</th>
        </tr>
      </thead>
      <tbody>
        {IMP33257_SWEEP_ROWS.map((row) => (
          <tr key={row.grade}>
            <td style={{ ...td, textAlign: 'left', color: '#94a3b8' }}>{row.grade}</td>
            <td style={td}>{row.panels.toLocaleString()}</td>
            <td style={td}>{row.glNodes.toLocaleString()}</td>
            <td style={td}>{row.tauStar.toFixed(3)}</td>
            <td style={td}>~{row.worstUlp} (@{row.worstTau})</td>
            <td style={td}>~{row.ulpAtTau6}</td>
            <td style={{ ...td, textAlign: 'left', color: row.passes ? PASS_COLOR : FAIL_COLOR, fontWeight: 600 }}>
              {row.passes ? 'passes*' : 'FAILS'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp33257NodeBudgetFullWindowUlpViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Node-Budget vs Full-Window Accuracy: tau*>=6 is Necessary but Not Sufficient (imp-33232/imp-33257)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 720 }}>
        imp-3919 sized a minimal (panels,grade) graded-GL node budget for -ln A(tau) by requiring the
        innermost panel to drop below the peak scale sigma(6) (tau*(panels,grade) &ge; {IMP33257_TAU_STAR_THRESHOLD}),
        then validated it at a single point (tau=6, grade5, 0.83 ULP) and generalized to a ~2-order
        node-budget collapse across the grade sweep. imp-33232 re-ran every tabulated minimal budget
        across the FULL clean window tau in [0.5,6] against a converged reference. This page plots the
        worst-in-window ULP alongside the ULP at the single tau=6 endpoint for each budget, all of which
        satisfy tau* &ge; {IMP33257_TAU_STAR_THRESHOLD}.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        worst-in-window ULP vs tau=6 ULP per tabulated minimal budget (log scale)
      </p>
      <NodeBudgetUlpChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        full-window sweep table
      </p>
      <SweepTable />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart and table:</strong> every row clears the
        imp-3919 crossover condition tau* &ge; {IMP33257_TAU_STAR_THRESHOLD}, yet grades 3-5 (panels &ge; 342)
        hold few-ULP worst-in-window and sub-ULP at tau=6, while grades 6-8 (the cheapest, steepest-graded
        rows imp-3919 advertised as the ~2-order node-savings) blow up at the tau=6 endpoint by
        ~157/~3548/~15400 ULP -- monotonically worse with grade. So tau* &ge; {IMP33257_TAU_STAR_THRESHOLD}{' '}
        is NECESSARY but NOT SUFFICIENT: at high grade only one sub-peak GL-10 panel exists, and a single
        panel cannot resolve the collapsing peak to the &lt;1-ULP pass line.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation only; measures nothing
        new and makes no claim beyond what imp-33232 already established. Accuracy measurement/rule-design
        audit, RH-equivalent scale class; mass-feasibility is necessary-but-not-sufficient. Operator
        positivity (imp-3066 off-diagonal endpoint-Hankel K_a &ge; 0) is UNTOUCHED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA. NO QED; imp-33232 assertions left intact.
      </div>
    </div>
  );
}
