import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33323_BAR,
  IMP33323_BAND,
  IMP33323_GRADE6,
  IMP33323_GRADE5,
} from '../data/imp-33323-min-node-lattice-jitter-band-viz-data.js';

const PASS_COLOR = '#4ade80';
const FAIL_COLOR = '#38bdf8';
const BAR_COLOR = '#f472b6';
const BAND_COLOR = '#f59e0b';

function JitterScatterChart({ grade }) {
  const svgW = 620;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMax = 6;
  const yS = (v) => padT + cH * (1 - v / yMax);
  const n = grade.rows.length;
  const xS = (i) => padL + (i / (n - 1)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 1, 2, 3, 4, 5, 6].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <rect
        x={padL}
        y={yS(IMP33323_BAND.ceiling)}
        width={cW}
        height={yS(IMP33323_BAND.floor) - yS(IMP33323_BAND.ceiling)}
        fill={BAND_COLOR}
        opacity={0.08}
      />
      <text x={padL + 4} y={yS(IMP33323_BAND.ceiling) + 10} fill={BAND_COLOR} fontSize={9}>
        robust band [{IMP33323_BAND.floor},{IMP33323_BAND.ceiling}] ULP
      </text>

      <line x1={padL} y1={yS(IMP33323_BAR)} x2={padL + cW} y2={yS(IMP33323_BAR)} stroke={BAR_COLOR} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={padL + cW - 4} y={yS(IMP33323_BAR) - 6} textAnchor="end" fill={BAR_COLOR} fontSize={9}>
        strict &lt;1 ULP bar
      </text>

      {grade.rows.map(([panels, worstUlp, passes], i) => (
        <circle
          key={panels}
          cx={xS(i)}
          cy={yS(Math.min(worstUlp, yMax))}
          r={panels === grade.anchor ? 4.5 : 3}
          fill={passes ? PASS_COLOR : FAIL_COLOR}
          stroke={panels === grade.anchor ? '#f8fafc' : 'none'}
          strokeWidth={panels === grade.anchor ? 1.2 : 0}
        />
      ))}

      <text x={xS(0)} y={padT + cH + 14} textAnchor="start" fill="#64748b" fontSize={9}>
        {grade.lo}p
      </text>
      <text x={xS(n - 1)} y={padT + cH + 14} textAnchor="end" fill="#64748b" fontSize={9}>
        {grade.hi}p
      </text>
      <text x={padL + cW / 2} y={padT + cH + 28} textAnchor="middle" fill="#64748b" fontSize={9}>
        panel count (grade{grade.grade}, +/-2-panel lattice)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,16,${padT + cH / 2})`}>
        worst-in-window (ULP)
      </text>
    </svg>
  );
}

function GradeSummary({ grade }) {
  return (
    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.4rem 0 1.25rem' }}>
      grade{grade.grade}: anchor {grade.anchor}p ({grade.anchorUlp.toFixed(4)} ULP), pass-fraction{' '}
      {(grade.passFraction * 100).toFixed(1)}%, longest consecutive passing run{' '}
      <strong style={{ color: '#4ade80' }}>{grade.longestPassRun}</strong>.
    </p>
  );
}

export default function Imp33323MinNodeLatticeJitterBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Min-Node Graded-GL Lattice-Jitter Band (imp-33296)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-33296 quantified the imp-33249/imp-33277 latticeJitterCaveat: in the fully-resolved
        neighbourhood (tau* &gt; 6.2) around each min-node family (grade6 near 171p, grade5 near
        600p), the worst-in-window ULP does not shrink monotonically with more panels -- it
        jitters. Only ~12% of +/-2-panel lattice counts clear the strict &lt;1 ULP bar (green
        dots below), the longest run of consecutive passing counts is 1-2, and every resolved
        panel count of either grade sits inside a shared, grade-independent robust band
        [~0.7,~5] ULP (shaded).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        grade6 worst-in-window scatter (panels 155-235, anchor 171p ringed)
      </p>
      <JitterScatterChart grade={IMP33323_GRADE6} />
      <GradeSummary grade={IMP33323_GRADE6} />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        grade5 worst-in-window scatter (panels 560-680, anchor 600p ringed)
      </p>
      <JitterScatterChart grade={IMP33323_GRADE5} />
      <GradeSummary grade={IMP33323_GRADE5} />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> green dots clear the
        strict &lt;1 ULP bar (dashed pink); blue dots do not. The imp-33249 grade6/171p hit
        (ringed, 0.76 ULP) is a genuine lattice coincidence -- its immediate neighbours 169p and
        173p bounce to ~2.1 and ~2.3 ULP, both failing the bar. What is robust is the shaded band:
        every scanned panel count of either grade, resolved or not, stays inside [~0.7,~5] ULP,
        which is why the honest budget rule is stated as a band ceiling, not the fragile single hit.
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
        measurement only, of an already-verified table (imp-33296). Mass-feasibility is
        necessary-but-not-sufficient; the operator-level positivity (imp-3066 K_a &ge; 0) is
        UNTOUCHED; the NPHI=10 truncation is inherited upstream. RH-equivalent, NO QED.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
