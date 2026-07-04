import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33591_GRADED_MIN_NODES,
  IMP33591_NODE_COMPETITIVE_RATIO,
  IMP33591_MAX_CC_OVER_GRADED,
  IMP33591_RUNG_TABLE,
} from '../data/imp-33591-deep-tail-cross-solver-node-budget-viz-data.js';

const GRADED_COLOR = '#f59e0b';
const CC_COLOR = '#38bdf8';
const RATIO_COLOR = '#4ade80';
const BAR_COLOR = '#f472b6';

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

  const yLo = log10(150);
  const yHi = log10(600);
  const yS = (nodes) => padT + cH * (1 - (log10(nodes) - yLo) / (yHi - yLo));

  const n = IMP33591_RUNG_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  const yTicks = [200, 257, 400, 513];

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

      {/* imp-33539 graded-GL flat plateau minimum: constant 200 nodes */}
      <line
        x1={padL}
        y1={yS(IMP33591_GRADED_MIN_NODES)}
        x2={padL + cW}
        y2={yS(IMP33591_GRADED_MIN_NODES)}
        stroke={GRADED_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(IMP33591_GRADED_MIN_NODES) - 6} fill={GRADED_COLOR} fontSize={9}>
        imp-33539 graded-GL flat minimum: 200 nodes (constant)
      </text>

      {/* CC single-grid min budget: climbs 257 -> 257 -> 513 */}
      <polyline
        points={IMP33591_RUNG_TABLE.map((r, i) => `${xS(i)},${yS(r.ccMinNodes)}`).join(' ')}
        fill="none"
        stroke={CC_COLOR}
        strokeWidth={1.5}
      />
      {IMP33591_RUNG_TABLE.map((r, i) => (
        <circle key={`cc-${r.n}`} cx={xS(i)} cy={yS(r.ccMinNodes)} r={3.5} fill={CC_COLOR} />
      ))}
      <text x={padL + 4} y={yS(513) + 14} fill={CC_COLOR} fontSize={9}>
        imp-33560 Clenshaw-Curtis single-grid min: climbs 257 -&gt; 257 -&gt; 513
      </text>

      {IMP33591_RUNG_TABLE.map((r, i) => (
        <text key={r.n} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          n={r.n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        deeper deep-tail rung n (tau* = saddleTau(n))
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        min-node budget (log scale)
      </text>
    </svg>
  );
}

function RatioChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const yMax = 5;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const n = IMP33591_RUNG_TABLE.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;
  const barW = 36;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 1, 2, 3, 4, 5].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}x
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP33591_NODE_COMPETITIVE_RATIO)}
        x2={padL + cW}
        y2={yS(IMP33591_NODE_COMPETITIVE_RATIO)}
        stroke={BAR_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33591_NODE_COMPETITIVE_RATIO) - 6} textAnchor="end" fill={BAR_COLOR} fontSize={9}>
        node-competitive bar (4x)
      </text>

      {IMP33591_RUNG_TABLE.map((r, i) => (
        <rect
          key={r.n}
          x={xS(i) - barW / 2}
          y={yS(r.ccOverGraded)}
          width={barW}
          height={cH - (yS(r.ccOverGraded) - padT)}
          fill={RATIO_COLOR}
          opacity={0.85}
        />
      ))}
      {IMP33591_RUNG_TABLE.map((r, i) => (
        <text key={`v-${r.n}`} x={xS(i)} y={yS(r.ccOverGraded) - 6} textAnchor="middle" fill={RATIO_COLOR} fontSize={9}>
          ~{r.ccOverGraded.toFixed(2)}x
        </text>
      ))}

      {IMP33591_RUNG_TABLE.map((r, i) => (
        <text key={r.n} x={xS(i)} y={padT + cH + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
          n={r.n}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
        deeper deep-tail rung n
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        CC / graded min-node ratio
      </text>
    </svg>
  );
}

export default function Imp33591DeepTailCrossSolverNodeBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Deep-Tail Cross-Solver Node Budget (imp-33560)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33560 tested whether the imp-33539 ~9.3x/~186x deep-tail
        graded-vs-uniform node saving is an intrinsic graded-GL advantage or an
        artifact of a weak uniform baseline, by swapping in an INDEPENDENT
        single-grid Clenshaw-Curtis solver. The top chart plots the imp-33539
        flat ~200-node graded-GL minimum (amber, dashed) against the CC
        single-grid minimum (blue) on a log axis across the deeper deep-tail
        rungs n in {'{350,375,400}'}. The bottom chart shows the CC/graded
        ratio at each rung against the 4x node-competitive bar (pink, dashed):
        every ratio stays well under it, so the graded rule is only
        node-competitive, not ~186x cheaper, against a strong independent solver.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        min-node budget to clear the &lt; 64 ULP band, by deeper deep-tail rung
      </p>
      <NodeBudgetChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        CC / graded min-node ratio, by deeper deep-tail rung
      </p>
      <RatioChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The ratio climbs from ~1.29x at n=350/375 to its worst,{' '}
        <strong style={{ color: '#4ade80' }}>~{IMP33591_MAX_CC_OVER_GRADED.toFixed(2)}x</strong>,
        at n=400 -- still well under the 4x node-competitive bar. The one
        genuine graded edge is that the ~200-node graded budget stays FLAT
        while the CC single-grid budget CLIMBS with depth (257 -&gt; 257 -&gt;
        513) as the saddle peak sharpens -- a mild ~1.3-2.6x real win, not the
        ~186x the weak uniform Richardson baseline suggested.
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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the
        amber line is flat because the imp-33539 graded-GL rule uses a fixed
        20-panel/10-node-per-panel budget at every rung; the blue CC line
        climbs with depth as the saddle sharpens. The exact node counts
        (200/257/513) are jittery arithmetic-floor lattice hits
        (imp-33249/imp-33295/imp-33539/imp-33560 latticeJitterCaveat) -- the
        robust reading is the order of the budgets (~200 vs ~250-500) and the
        node-competitiveness (&lt; 4x), not the precise counts.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong>
        accuracy/rule-design cross-solver measurement only, of an
        already-verified table (imp-33560). It changes no bound and patches no
        literal (imp-33213/imp-33316/imp-33539/imp-33560 intact); the
        imp-33316 &lt; 64 ULP band is known to fail at deeper rungs n &ge; 510
        (imp-33537/imp-33557), but the rungs shown here sit firmly inside it.
        Mass-feasibility is necessary-but-not-sufficient; the operator-level
        positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
