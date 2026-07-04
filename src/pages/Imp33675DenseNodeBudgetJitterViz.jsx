import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY } from '../data/imp-33641-grade6-node-budget-non-monotonicity.js';

const LINE_COLOR = '#38bdf8';
const FLOOR_COLOR = '#4ade80';
const SPIKE_COLOR = '#f87171';
const NEIGHBOR_COLOR = '#f59e0b';
const BAND_COLOR = '#64748b';

const { measured } = IMP33641_GRADE6_NODE_BUDGET_NON_MONOTONICITY;
const ladder = measured.denseLadder;

function NodeBudgetChart() {
  const svgW = 920;
  const padL = 50;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  const nLo = ladder[0].nodes;
  const nHi = ladder[ladder.length - 1].nodes;
  const yMax = Math.ceil((Math.max(...ladder.map((r) => r.ulp)) * 1.08) / 10) * 10;

  const xS = (n) => padL + ((n - nLo) / (nHi - nLo)) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  const path = ladder.map((r, i) => `${i === 0 ? 'M' : 'L'}${xS(r.nodes).toFixed(2)},${yS(r.ulp).toFixed(2)}`).join(' ');

  const floorPt = ladder.find((r) => r.nodes === measured.globalFloorNodes);
  const spikePt = ladder.find((r) => r.nodes === 300);
  const neighLoPt = ladder.find((r) => r.nodes === 290);
  const neighHiPt = ladder.find((r) => r.nodes === 310);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 20, 40, 60, 80, 100, 120].filter((v) => v <= yMax).map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(measured.deepFloorBandUlp)}
        x2={padL + cW}
        y2={yS(measured.deepFloorBandUlp)}
        stroke={BAND_COLOR}
        strokeWidth={1.2}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(measured.deepFloorBandUlp) - 5} fill={BAND_COLOR} fontSize={9}>
        imp-33316 band ceiling ({measured.deepFloorBandUlp} ULP)
      </text>

      <path d={path} fill="none" stroke={LINE_COLOR} strokeWidth={1.2} opacity={0.85} />

      {ladder.map((r) => (
        <circle key={r.nodes} cx={xS(r.nodes)} cy={yS(r.ulp)} r={1.4} fill={LINE_COLOR} opacity={0.55} />
      ))}

      {neighLoPt && (
        <circle cx={xS(neighLoPt.nodes)} cy={yS(neighLoPt.ulp)} r={4} fill={NEIGHBOR_COLOR} />
      )}
      {neighHiPt && (
        <circle cx={xS(neighHiPt.nodes)} cy={yS(neighHiPt.ulp)} r={4} fill={NEIGHBOR_COLOR} />
      )}
      {spikePt && (
        <>
          <circle cx={xS(spikePt.nodes)} cy={yS(spikePt.ulp)} r={5} fill={SPIKE_COLOR} />
          <text x={xS(spikePt.nodes)} y={yS(spikePt.ulp) - 9} textAnchor="middle" fill={SPIKE_COLOR} fontSize={9}>
            300n spike ~{spikePt.ulp.toFixed(1)}
          </text>
        </>
      )}
      {floorPt && (
        <>
          <circle cx={xS(floorPt.nodes)} cy={yS(floorPt.ulp)} r={5} fill={FLOOR_COLOR} />
          <text x={xS(floorPt.nodes)} y={yS(floorPt.ulp) - 9} textAnchor="middle" fill={FLOOR_COLOR} fontSize={9}>
            true floor ~{floorPt.ulp.toFixed(1)} @ {floorPt.nodes}n
          </text>
        </>
      )}

      {[150, 200, 300, 400, 500, 600].map((n) => (
        <text key={n} x={xS(n)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={9}>
        inner GL-10 nodes (10 &times; panels, panels 15..60)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={10} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,10,${padT + cH / 2})`}>
        ULP vs A_log target
      </text>
    </svg>
  );
}

export default function Imp33675DenseNodeBudgetJitterViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Dense Node-Budget Ladder, Grade 6, n=596 (imp-33641)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 820 }}>
        imp-33630 flagged a grade-6 n=596 node-budget non-monotonicity: the coarse {'{200,300,500,...}'}
        ladder DROPS to ~{measured.coarse200Ulp.toFixed(1)} ULP at 200 nodes then BOUNCES back OUT to ~
        {measured.coarse300Ulp.toFixed(1)} ULP at 300 nodes. imp-33641 re-ran the identical direct
        graded-GL A_direct(tau*) plateau on every integer panel P in [{measured.denseLoPanels},
        {measured.denseHiPanels}] ({measured.denseLoPanels * 10}..{measured.denseHiPanels * 10} nodes) to
        resolve whether that bounce is a genuine anti-convergence or a coarse-ladder sampling artifact. This
        chart renders the full dense ladder in one view.
      </p>

      <NodeBudgetChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The true floor sits at just {measured.globalFloorNodes} nodes (~{measured.globalFloorUlp.toFixed(1)}
        {' '}ULP, green), well inside the imp-33316 &lt; {measured.deepFloorBandUlp} ULP band and BELOW the
        coarse 200-node sample. The 300-node value the coarse ladder flagged (~
        {measured.coarse300Ulp.toFixed(1)} ULP, red) is a single-panel jitter spike -- its immediate integer
        neighbours at 290 and 310 nodes (orange, ~{measured.neighborLoUlp.toFixed(1)} and ~
        {measured.neighborHiUlp.toFixed(1)} ULP) both sit far below it, so the spike does not persist even one
        panel to either side. The dashed line marks the imp-33316 band ceiling the coarse 300-node sample
        appears to cross.
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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the jagged blue trace is high-frequency
        lattice jitter (Pearson r ~ {measured.pearsonR.toFixed(2)} vs node count, r&sup2; ~
        {measured.rSquared.toFixed(2)}), not a smooth curve. A coarse two-point {'{200,300}'} sample sees only
        the drop and the spike; the dense ladder shows both are local features of a jittery ~50-100 ULP band
        whose true floor the coarse sample never reached, supporting the imp-33641
        DENSE-LADDER-JITTER-ARTIFACT-NOT-ANTI-CONVERGENCE verdict.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> accuracy/rule-design measurement only. It
        changes no bound and patches no literal. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
