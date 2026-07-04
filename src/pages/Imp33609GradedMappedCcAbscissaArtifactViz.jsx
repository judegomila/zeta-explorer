import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33609_BAND_ULP,
  IMP33609_GRADED_PLATEAU_NODES,
  IMP33609_MAX_MAP_SAVING_FACTOR,
  IMP33609_RUNG_TABLE,
} from '../data/imp-33609-graded-mapped-cc-abscissa-artifact-viz-data.js';

const UNMAPPED_COLOR = '#38bdf8';
const MAPPED_COLOR = '#4ade80';
const PLATEAU_COLOR = '#f59e0b';
const BAND_COLOR = '#f472b6';

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

  const yLo = log10(50);
  const yHi = log10(600);
  const yS = (nodes) => padT + cH * (1 - (log10(nodes) - yLo) / (yHi - yLo));

  const n = IMP33609_RUNG_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  const yTicks = [50, 100, 129, 200, 257, 400, 513];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* imp-33539 graded-GL flat plateau reference: constant 200 nodes */}
      <line
        x1={padL}
        y1={yS(IMP33609_GRADED_PLATEAU_NODES)}
        x2={padL + cW}
        y2={yS(IMP33609_GRADED_PLATEAU_NODES)}
        stroke={PLATEAU_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(IMP33609_GRADED_PLATEAU_NODES) - 6} fill={PLATEAU_COLOR} fontSize={9}>
        imp-33539 graded-GL plateau (reference): 200 nodes (constant)
      </text>

      {/* unmapped CC control: climbs 257 -> 257 -> 513 */}
      <polyline
        points={IMP33609_RUNG_TABLE.map((r, i) => `${xS(i)},${yS(r.unmappedNodes)}`).join(' ')}
        fill="none"
        stroke={UNMAPPED_COLOR}
        strokeWidth={1.5}
      />
      {IMP33609_RUNG_TABLE.map((r, i) => (
        <circle key={`u-${r.n}`} cx={xS(i)} cy={yS(r.unmappedNodes)} r={3.5} fill={UNMAPPED_COLOR} />
      ))}
      <text x={padL + 4} y={yS(513) + 14} fill={UNMAPPED_COLOR} fontSize={9}>
        unmapped CC control (imp-33560): climbs 257 -&gt; 257 -&gt; 513
      </text>

      {/* graded-mapped CC test: flat 129 -> 97 -> 129 */}
      <polyline
        points={IMP33609_RUNG_TABLE.map((r, i) => `${xS(i)},${yS(r.mappedNodes)}`).join(' ')}
        fill="none"
        stroke={MAPPED_COLOR}
        strokeWidth={1.5}
      />
      {IMP33609_RUNG_TABLE.map((r, i) => (
        <circle key={`m-${r.n}`} cx={xS(i)} cy={yS(r.mappedNodes)} r={3.5} fill={MAPPED_COLOR} />
      ))}
      <text x={padL + 4} y={yS(97) - 8} fill={MAPPED_COLOR} fontSize={9}>
        graded-mapped CC (s = hi t^4 composed): flat 129 -&gt; 97 -&gt; 129
      </text>

      {IMP33609_RUNG_TABLE.map((r, i) => (
        <text key={r.n} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          n={r.n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        deeper deep-tail rung n (tau* = saddleTau(n))
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        min-node CC budget (log scale)
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

  const yMax = 80;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const n = IMP33609_RUNG_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 20, 40, 60, 80].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP33609_BAND_ULP)} x2={padL + cW} y2={yS(IMP33609_BAND_ULP)} stroke={BAND_COLOR} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={padL + cW - 4} y={yS(IMP33609_BAND_ULP) - 6} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        imp-33316 deep-tail band (&lt; 64 ULP)
      </text>

      {[
        ['unmappedUlp', UNMAPPED_COLOR],
        ['mappedUlp', MAPPED_COLOR],
      ].map(([key, color]) => (
        <polyline
          key={key}
          points={IMP33609_RUNG_TABLE.map((r, i) => `${xS(i)},${yS(r[key])}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.9}
        />
      ))}
      {[
        ['unmappedUlp', UNMAPPED_COLOR],
        ['mappedUlp', MAPPED_COLOR],
      ].map(([key, color]) =>
        IMP33609_RUNG_TABLE.map((r, i) => (
          <circle key={`${key}-${r.n}`} cx={xS(i)} cy={yS(r[key])} r={2.6} fill={color} />
        ))
      )}

      {IMP33609_RUNG_TABLE.map((r, i) => (
        <text key={r.n} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          n={r.n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        deeper deep-tail rung n
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        residual at min-node grid (ULP)
      </text>
    </svg>
  );
}

export default function Imp33609GradedMappedCcAbscissaArtifactViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Graded-Mapped Clenshaw-Curtis Flat-Budget Artifact (imp-33580)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33560 found that a single Clenshaw-Curtis inner grid against the deep-tail weight
        A(tau) needs a CLIMBING node budget at the deeper deep-tail rungs n in {'{350,375,400}'}
        (257 nodes at n=350/375, rising to 513 at n=400), and attributed the climb to its fixed
        Chebyshev-Lobatto abscissae not tracking the sharpening saddle peak. imp-33580 tests that
        attribution directly by composing the imp-33539 origin-concentrating map s = hi t^4 onto
        the SAME nodes and cosine weights. The top chart plots the min-node CC budget on a log
        axis: blue is the unmapped control (reproduces the imp-33560 climb), green is the
        graded-mapped test (flattens to 129-97-129 nodes, below the unmapped floor). The bottom
        chart overlays the worst-window ULP each route reaches at its min-node grid against the
        imp-33316 &lt; 64 ULP band (pink, dashed).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        min-node CC budget to clear the &lt; 64 ULP band, by deeper deep-tail rung
      </p>
      <NodeBudgetChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        worst-window ULP reached at the min-node grid, by deeper deep-tail rung
      </p>
      <WorstUlpChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        At the deepest rung n=400 the graded map cuts the budget{' '}
        <strong style={{ color: '#4ade80' }}>~{IMP33609_MAX_MAP_SAVING_FACTOR.toFixed(2)}x</strong>{' '}
        (513 -&gt; 129 nodes); the worst graded-mapped budget (129) sits below the unmapped floor
        (257) at every rung. Because the ONLY change between control and test is the abscissa
        placement, the imp-33560 depth-climb is confirmed to be a UNIFORM-ABSCISSA ARTIFACT, not
        intrinsic to Clenshaw-Curtis -- grading, not the solver family, carries the flat-budget edge.
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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the amber line is flat
        because the imp-33539 graded-GL reference uses a fixed rule (200 nodes) at every rung; the
        blue unmapped-CC line climbs with depth as the saddle sharpens; the green graded-mapped-CC
        line stays flat and below it. The exact node counts (97/129/257/513) are jittery
        arithmetic-floor lattice hits (imp-33249/imp-33295/imp-33539/imp-33560 latticeJitterCaveat)
        -- the robust reading is the order of the budgets (graded-mapped ~100 vs unmapped ~250-500)
        and the flat-vs-climbing separation, not the precise counts.
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
        cross-solver measurement only, of an already-verified table (imp-33580). It changes no
        bound and patches no literal (imp-33213/imp-33316/imp-33539/imp-33560 intact); the imp-33316
        &lt; 64 ULP band is known to fail at deeper rungs n &ge; 510 (imp-33537/imp-33557), but the
        rungs shown here sit firmly inside it. Mass-feasibility is necessary-but-not-sufficient;
        the operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
