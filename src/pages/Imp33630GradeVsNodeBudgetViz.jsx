import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33630_BAND_ULP,
  IMP33630_N_FIXED,
  IMP33630_NODE_BUDGETS,
  IMP33630_GRADE_TABLE,
} from '../data/imp-33630-grade-vs-node-budget-viz-data.js';
import { ED } from '../styles/tokens.js';

const GRADE_COLORS = {
  4: ED.series7,
  5: ED.series4,
  6: ED.series3,
  8: ED.series1,
};
const BAND_COLOR = ED.series8;

function GradeVsNodeBudgetChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMax = 105;
  const n = IMP33630_NODE_BUDGETS.length;
  const groupW = cW / n;
  const barW = (groupW * 0.7) / IMP33630_GRADE_TABLE.length;

  const yS = (v) => padT + cH * (1 - v / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 20, 40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* imp-33316 deep-tail band line */}
      <line
        x1={padL}
        y1={yS(IMP33630_BAND_ULP)}
        x2={padL + cW}
        y2={yS(IMP33630_BAND_ULP)}
        stroke={BAND_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33630_BAND_ULP) - 6} textAnchor="end" fill={BAND_COLOR} fontSize={9}>
        imp-33316 deep-tail band (&lt; 64 ULP)
      </text>

      {/* grouped bars: one group per node budget, one bar per grade */}
      {IMP33630_NODE_BUDGETS.map((nodes, gi) => {
        const groupX = padL + gi * groupW + groupW * 0.15;
        return (
          <g key={nodes}>
            {IMP33630_GRADE_TABLE.map((row, ri) => {
              const ulp = Math.min(row.ulpByNodes[gi], yMax);
              const x = groupX + ri * barW;
              const y = yS(ulp);
              const isMinInBand = row.minInBandNodes === nodes;
              return (
                <rect
                  key={row.grade}
                  x={x}
                  y={y}
                  width={barW * 0.85}
                  height={padT + cH - y}
                  fill={GRADE_COLORS[row.grade]}
                  opacity={isMinInBand ? 1 : 0.75}
                  stroke={isMinInBand ? ED.inkSoft : 'none'}
                  strokeWidth={isMinInBand ? 1.2 : 0}
                />
              );
            })}
            <text x={groupX + (barW * IMP33630_GRADE_TABLE.length) / 2} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {nodes}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        node budget (panels &times; 10 GL nodes)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        residual ULP
      </text>

      {/* legend */}
      {IMP33630_GRADE_TABLE.map((row, i) => (
        <g key={`legend-${row.grade}`}>
          <rect x={padL + 8 + i * 90} y={padT + 4} width={9} height={9} fill={GRADE_COLORS[row.grade]} />
          <text x={padL + 22 + i * 90} y={padT + 12} fill={ED.inkSoft} fontSize={9}>
            grade {row.grade}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp33630GradeVsNodeBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title={`Origin-Concentration Grade vs Node Budget at n=${IMP33630_N_FIXED} (imp-33600)`} />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        imp-33557 found that at the graded-GL-FAILING rung n={IMP33630_N_FIXED}, NO node budget up to
        4000 nodes reaches the imp-33316 &lt; 64 ULP band at the default origin-concentration grade 4.
        imp-33600 holds the graded-GL rule family and the imp-33539 node-budget ladder fixed and sweeps
        ONLY the grade in {'{4,5,6,8}'}. The chart below groups residual ULP by node budget, with one bar
        per grade; the white-outlined bar in each grade's series marks its minInBandNodes -- the smallest
        budget where that grade first enters the band.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        residual ULP by node budget, grouped by grade
      </p>
      <GradeVsNodeBudgetChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        grade-4 and grade-5 stay above the band at every budget in the ladder (minInBandNodes:{' '}
        <strong style={{ color: GRADE_COLORS[4] }}>null</strong> /{' '}
        <strong style={{ color: GRADE_COLORS[5] }}>null</strong>), while grade-6 clears the band at a
        node-competitive <strong style={{ color: GRADE_COLORS[6] }}>200 nodes</strong> (floor ~34.0 ULP)
        and grade-8 clears it at <strong style={{ color: GRADE_COLORS[8] }}>300 nodes</strong> (floor
        ~59.2 ULP).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the grade-6 and grade-8 series
        dip below the band line at their minInBandNodes budget but bounce back above it at larger
        budgets (grade-6 climbs back to ~100 ULP at 300 nodes) -- the per-grade/per-budget residual is a
        jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537
        latticeJitterCaveat), so the robust reading is the qualitative separation -- grade-4/5 stay out
        of band, grade-6/8 clear it at &le; 300 nodes -- not the exact per-budget ULP.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> accuracy/rule-design measurement
        only, of an already-verified sweep (imp-33600). It changes no bound and patches no literal
        (imp-33213/imp-33316/imp-33539/imp-33557 intact). Mass-feasibility is necessary-but-not-sufficient;
        the operator-level positivity (imp-3066 K_a &ge; 0) is UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
