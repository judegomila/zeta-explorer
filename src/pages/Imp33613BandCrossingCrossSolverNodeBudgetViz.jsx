import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33613_BAND_ULP,
  IMP33613_ROWS,
  IMP33613_MODEST_BUDGET_NODES,
  IMP33613_MAX_GRADED_LADDER_NODES,
} from '../data/imp-33613-band-crossing-cross-solver-node-budget-viz-data.js';

const CC_COLOR = '#38bdf8';
const GRADED_COLOR = '#f59e0b';
const BAND_COLOR = '#f472b6';
const FAIL_COLOR = '#ef4444';

function NodeBudgetChart() {
  const svgW = 720;
  const padL = 54;
  const padR = 20;
  const padT = 24;
  const padB = 48;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  // Log scale over nodes, from 100 (below the smallest graded budget) to the
  // beyond-ladder "infinity" marker height.
  const nodesMin = 100;
  const nodesMax = 8192;
  const logMin = Math.log10(nodesMin);
  const logMax = Math.log10(nodesMax);
  const yS = (nodes) => padT + cH * (1 - (Math.log10(nodes) - logMin) / (logMax - logMin));

  const groupW = cW / IMP33613_ROWS.length;
  const barW = 34;
  const gap = 10;

  const gridNodes = [100, 200, 500, 1000, 2000, 4000, 8000];

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

      {IMP33613_ROWS.map((row, i) => {
        const cx = padL + groupW * (i + 0.5);
        const ccY = yS(row.ccMinNodes);
        const gradedClears = row.gradedMinInBandNodes != null;
        const gradedY = gradedClears ? yS(row.gradedMinInBandNodes) : yS(IMP33613_MAX_GRADED_LADDER_NODES);

        return (
          <g key={row.n}>
            {/* CC bar */}
            <rect
              x={cx - gap / 2 - barW}
              y={ccY}
              width={barW}
              height={padT + cH - ccY}
              fill={CC_COLOR}
              opacity={0.85}
            />
            <text x={cx - gap / 2 - barW / 2} y={ccY - 6} textAnchor="middle" fill={CC_COLOR} fontSize={9}>
              {row.ccMinNodes}
            </text>

            {/* graded bar (or Infinity marker) */}
            {gradedClears ? (
              <>
                <rect
                  x={cx + gap / 2}
                  y={gradedY}
                  width={barW}
                  height={padT + cH - gradedY}
                  fill={GRADED_COLOR}
                  opacity={0.85}
                />
                <text x={cx + gap / 2 + barW / 2} y={gradedY - 6} textAnchor="middle" fill={GRADED_COLOR} fontSize={9}>
                  {row.gradedMinInBandNodes}
                </text>
              </>
            ) : (
              <>
                <rect
                  x={cx + gap / 2}
                  y={padT}
                  width={barW}
                  height={cH}
                  fill={FAIL_COLOR}
                  opacity={0.35}
                />
                <text x={cx + gap / 2 + barW / 2} y={padT - 8} textAnchor="middle" fill={FAIL_COLOR} fontSize={9}>
                  &infin; (no clear)
                </text>
              </>
            )}

            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill="#94a3b8" fontSize={10}>
              n={row.n}
            </text>
            <text x={cx} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
              ({row.gradedBandStatus})
            </text>
          </g>
        );
      })}

      {/* imp-33316 band context line: not a node-axis quantity, drawn as a footnote marker */}
      <text x={padL + cW - 4} y={padT + 12} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        vs the imp-33316 &lt; {IMP33613_BAND_ULP} ULP A_log band
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        nodes to clear band (log scale)
      </text>
    </svg>
  );
}

export default function Imp33613BandCrossingCrossSolverNodeBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Band-Crossing Cross-Solver Node Budget (imp-33577)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        imp-33557 found the graded-GL grade-4 minInBandNodes is band-conditional at the
        imp-33557/imp-33537 band-crossing rungs n in {'{'}495,510,596{'}'}: 200 nodes at n=495,
        ~500 at the edge n=510, and Infinity at n=596 -- no budget up to 4000 nodes clears the
        imp-33316 &lt; {IMP33613_BAND_ULP} ULP A_log band there. imp-33577 ran an INDEPENDENT
        single-grid Clenshaw-Curtis cross-solver over the same rungs and found it clears the band
        at all three, including n=596, at a modest node budget. The chart below overlays the two
        solvers' smallest clearing-grid node counts (log scale) per rung.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Nodes to clear the &lt; {IMP33613_BAND_ULP} ULP band: Clenshaw-Curtis (blue) vs graded-GL grade-4 (amber)
      </p>
      <NodeBudgetChart />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        At n=<strong>495</strong> and n=<strong>510</strong> both solvers clear the band at a
        comparable few-hundred-node budget (CC 513/513 vs graded 200/~500). At n=
        <strong>596</strong> the graded ladder never clears it (red, marked &infin;) while CC clears
        it in just <strong style={{ color: CC_COLOR }}>385</strong> nodes -- reaching a CC floor of
        ~0.87 ULP, sub-ULP agreement with the imp-33213 log-domain target, where the graded-GL
        grade-4 ladder floors at ~65 ULP. All three CC clearing budgets stay well under the{' '}
        {IMP33613_MODEST_BUDGET_NODES}-node "modest budget" threshold imp-33577 checks against.
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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> both the CC and graded
        integrals are direct-domain quadratures of the SAME A(tau*) = int_0^7 Phi(s)Phi(s+tau*) ds,
        scored against the identical imp-33213 log-domain target. Since the target is shared, the
        n=596 gap between the CC floor (~0.87 ULP) and the graded floor (~65 ULP) is attributable
        to the QUADRATURE RULE -- Clenshaw-Curtis endpoint-clustered Chebyshev-Lobatto nodes versus
        the graded-GL grade-4 panel scheme -- not to an arithmetic property of A(tau*) itself. So
        the imp-33557 n=596 "no budget rescues it" reading is a graded-RULE resolution artifact, not
        a rule-invariant arithmetic-jitter floor.
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
        cross-solver measurement only, of an already-verified sweep (imp-33577). It changes no
        bound and patches no literal (imp-33213/imp-33316/imp-33557/imp-33577 intact). Both ladders
        are jittery near the arithmetic floor (imp-33249/imp-33277/imp-33295/imp-33557
        latticeJitterCaveat); the robust reading is the qualitative smallest-clearing-grid metric,
        not the exact 385/513 node counts. Mass-feasibility is necessary-but-not-sufficient; the
        operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
