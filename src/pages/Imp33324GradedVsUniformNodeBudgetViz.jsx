import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33324_FLOOR_ULP,
  IMP33324_UNIFORM_LADDER_NODES,
  IMP33324_PLATEAU_NODES,
  IMP33324_MIN_NODE_SAVING_RANGE,
  IMP33324_PLATEAU_SAVING,
  IMP33324_RUNG_TABLE,
} from '../data/imp-33324-graded-vs-uniform-node-budget-viz-data.js';
import { ED } from '../styles/tokens.js';

const MIN_NODE_COLOR = ED.series3;
const PLATEAU_COLOR = ED.series4;
const UNIFORM_COLOR = ED.series1;
const FLOOR_COLOR = ED.series7;

function log10(v) {
  return Math.log(v) / Math.LN10;
}

function NodeBudgetChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yLo = log10(100);
  const yHi = log10(50000);
  const yS = (nodes) => padT + cH * (1 - (log10(nodes) - yLo) / (yHi - yLo));

  const n = IMP33324_RUNG_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  const yTicks = [100, 300, 1000, 3000, 10000, 37205];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* uniform Richardson ladder: constant 37205 nodes across every rung */}
      <line
        x1={padL}
        y1={yS(IMP33324_UNIFORM_LADDER_NODES)}
        x2={padL + cW}
        y2={yS(IMP33324_UNIFORM_LADDER_NODES)}
        stroke={UNIFORM_COLOR}
        strokeWidth={1.5}
      />
      <text x={padL + 4} y={yS(IMP33324_UNIFORM_LADDER_NODES) - 6} fill={UNIFORM_COLOR} fontSize={9}>
        uniform Richardson ladder: 37205 nodes (constant)
      </text>

      {/* robust graded plateau: constant 4000 nodes across every rung */}
      <line
        x1={padL}
        y1={yS(IMP33324_PLATEAU_NODES)}
        x2={padL + cW}
        y2={yS(IMP33324_PLATEAU_NODES)}
        stroke={PLATEAU_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(IMP33324_PLATEAU_NODES) - 6} fill={PLATEAU_COLOR} fontSize={9}>
        graded plateau (grade4/400p): 4000 nodes (constant)
      </text>

      {/* graded min-node lattice hit: 120 or 140 nodes per rung */}
      <polyline
        points={IMP33324_RUNG_TABLE.map((r, i) => `${xS(i)},${yS(r.gradedMinNodeNodes)}`).join(' ')}
        fill="none"
        stroke={MIN_NODE_COLOR}
        strokeWidth={1.5}
      />
      {IMP33324_RUNG_TABLE.map((r, i) => (
        <circle key={r.n} cx={xS(i)} cy={yS(r.gradedMinNodeNodes)} r={3.5} fill={MIN_NODE_COLOR} />
      ))}
      <text x={padL + 4} y={yS(120) + 14} fill={MIN_NODE_COLOR} fontSize={9}>
        graded min-node lattice hit: 120-140 nodes
      </text>

      {IMP33324_RUNG_TABLE.map((r, i) => (
        <text key={r.n} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          n={r.n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        saddle rung n (tau* = saddleTau(n))
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        inner nodes (log scale)
      </text>
    </svg>
  );
}

function WorstUlpChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const yMax = 30;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const n = IMP33324_RUNG_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 5, 10, 15, 20, 25, 30].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP33324_FLOOR_ULP)} x2={padL + cW} y2={yS(IMP33324_FLOOR_ULP)} stroke={FLOOR_COLOR} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={padL + cW - 4} y={yS(IMP33324_FLOOR_ULP) - 6} textAnchor="end" fill={FLOOR_COLOR} fontSize={9}>
        imp-33275 floor band bar (&lt; 30 ULP)
      </text>

      {[
        ['gradedMinNodeUlp', MIN_NODE_COLOR],
        ['gradedPlateauUlp', PLATEAU_COLOR],
        ['uniformLadderUlp', UNIFORM_COLOR],
      ].map(([key, color]) => (
        <polyline
          key={key}
          points={IMP33324_RUNG_TABLE.map((r, i) => `${xS(i)},${yS(r[key])}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.9}
        />
      ))}
      {[
        ['gradedMinNodeUlp', MIN_NODE_COLOR],
        ['gradedPlateauUlp', PLATEAU_COLOR],
        ['uniformLadderUlp', UNIFORM_COLOR],
      ].map(([key, color]) =>
        IMP33324_RUNG_TABLE.map((r, i) => (
          <circle key={`${key}-${r.n}`} cx={xS(i)} cy={yS(r[key])} r={2.6} fill={color} />
        ))
      )}

      {IMP33324_RUNG_TABLE.map((r, i) => (
        <text key={r.n} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          n={r.n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        saddle rung n
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        worst-window ULP
      </text>
    </svg>
  );
}

export default function Imp33324GradedVsUniformNodeBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Graded-vs-Uniform Inner Node Budget (imp-33295)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33295 measured, at each saddle-a rung n in {'{10,20,...,80}'}, how many inner quadrature
        nodes are needed to reach the imp-33275 A(tau) double-precision floor band (&lt; 30 ULP)
        by three routes: a graded-GL min-node lattice hit (green, 120-140 nodes), a robust fixed
        graded plateau rule (amber, grade4/400p, 4000 nodes) and the imp-33275 uniform-Simpson
        Richardson ladder (blue, 37205 nodes -- a single uniform grid never reaches this floor
        band, only the whole 5-rung ladder does). The top chart plots node budget on a log axis;
        the bottom chart overlays the worst-window ULP each route actually reaches against the
        30-ULP floor bar (pink, dashed).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        inner node budget to reach the floor band, by saddle rung
      </p>
      <NodeBudgetChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        worst-window ULP actually reached, by saddle rung
      </p>
      <WorstUlpChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        Node-saving ratios: the min-node graded lattice hit is{' '}
        <strong style={{ color: 'var(--series-3)' }}>
          ~{IMP33324_MIN_NODE_SAVING_RANGE.min.toFixed(1)}-{IMP33324_MIN_NODE_SAVING_RANGE.max.toFixed(1)}x
        </strong>{' '}
        fewer nodes than the uniform ladder (120-140 vs 37205), and the robust plateau rule is{' '}
        <strong style={{ color: 'var(--brass)' }}>~{IMP33324_PLATEAU_SAVING.toFixed(1)}x</strong> fewer
        (4000 vs 37205) -- at every rung, all three routes land within the 30-ULP floor band.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue and amber lines
        are flat because those routes use a fixed rule at every rung (37205 and 4000 nodes
        respectively); the green line is the jittery min-node lattice hit, which steps from 120 to
        140 nodes at n=60 (imp-33249/imp-33277 latticeJitterCaveat -- the exact node count bounces
        with neighbouring panel counts, so the robust reading is the ~9.3x plateau saving and the
        graded-is-cheaper ordering, not the precise 120-140 figure).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> accuracy/rule-design
        measurement only, of an already-verified table (imp-33295). Mass-feasibility is
        necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is
        UNTOUCHED; the NPHI=10 truncation is inherited upstream. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
