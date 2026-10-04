import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34904_LANDMARK_3P3E9_RECONCILIATION_TABLE } from '../data/imp-34904-landmark-3p3e9-reconciliation-table.js';
import { ED } from '../styles/tokens.js';

const D = IMP34904_LANDMARK_3P3E9_RECONCILIATION_TABLE;
const LANDMARKS = D.landmarks;
const GAPS = D.pairwiseGaps;

const CAUSE_COLOR = {
  'root-finding / floating-point residual': ED.series2,
  'Gronwall E_flow term (imp-33601/imp-33848)': ED.series1,
  'definitional inflection-vs-crossover offset (imp-33744)': ED.series5,
  'definitional inflection-vs-halving offset (imp-33744)': ED.series5,
};

// Shared-axis strip: the four landmarks plotted on a single N-axis (log-scaled around the
// ~3.3e9 cluster), showing the strict N_half < N_cross < N_knee ordering with L1/L2 overlapping.
function LandmarkAxis() {
  const svgW = 720;
  const svgH = 160;
  const padL = 50;
  const padR = 30;
  const padT = 40;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const nMin = 3.25e9;
  const nMax = 3.4e9;
  const xAt = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yMid = padT + cH / 2;

  const ticks = [3.25e9, 3.28e9, 3.31e9, 3.34e9, 3.37e9, 3.4e9];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yMid} x2={padL + cW} y2={yMid} stroke={ED.rule} strokeWidth={1.5} />

      {ticks.map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={yMid - 4} x2={xAt(t)} y2={yMid + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(t)} y={yMid + 20} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {(t / 1e9).toFixed(2)}e9
          </text>
        </g>
      ))}

      {LANDMARKS.map((lm, i) => {
        const x = xAt(lm.N);
        const dy = i % 2 === 0 ? -1 : 1;
        const labelY = yMid + dy * (26 + (i * 4));
        return (
          <g key={lm.key}>
            <line x1={x} y1={yMid} x2={x} y2={labelY} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,2" />
            <circle cx={x} cy={yMid} r={5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
            <text
              x={x}
              y={labelY + (dy > 0 ? 12 : -8)}
              textAnchor="middle"
              fill={ED.inkSoft}
              fontSize={9.5}
              fontWeight={700}
            >
              {lm.key} {lm.label}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        four landmarks on a shared N-axis -- L1/L2 overlap at N_cross ~3.2803e9 (imp-33723/imp-3444);
        strict ordering N_half {'<'} N_cross {'<'} N_knee holds
      </text>
    </svg>
  );
}

// Bar chart of the six pairwise relative gaps (log-scaled), colored by attributed cause family.
function PairwiseGapBars() {
  const svgW = 720;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 70;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logGap = (g) => Math.log10(Math.max(g.relGap, 1e-16));
  const yMin = -16;
  const yMax = 0;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;
  const barW = (cW / GAPS.length) * 0.6;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {[-16, -12, -8, -4, -2, 0].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{t}
          </text>
        </g>
      ))}

      {GAPS.map((g, i) => {
        const cx = padL + ((i + 0.5) * cW) / GAPS.length;
        const yLog = logGap(g);
        return (
          <g key={g.pair}>
            <rect
              x={cx - barW / 2}
              y={yAt(yLog)}
              width={barW}
              height={yAt(yMin) - yAt(yLog)}
              fill={CAUSE_COLOR[g.cause] || '#64748b'}
            />
            <text x={cx} y={yAt(yLog) - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
              {g.pct < 0.001 ? g.relGap.toExponential(1) : `${g.pct.toFixed(2)}%`}
            </text>
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} fontWeight={700}>
              {g.pair}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        six pairwise relative gaps (log10 scale) -- red = root-finding/FP residual (~1.7e-15), blue = Gronwall
        E_flow term (~0.41%), purple = definitional log-factor running offset (~3.06-3.48%)
      </text>
    </svg>
  );
}

export default function Imp34938LandmarkReconciliationAxisViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Four-Landmark ~3.3e9 Reconciliation Axis (imp-34938 / imp-34904)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The four independent landmarks -- {D.summary.ordering} -- plotted on a single shared N-axis.
      </p>
      <LandmarkAxis />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The six pairwise relative gaps collapse to three cause families spanning fourteen orders of
        magnitude: {D.summary.tightestGap}; {D.summary.eFlowGap}; {D.summary.definitionalGap}.
      </p>
      <PairwiseGapBars />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {D.clarity}
      </div>
    </div>
  );
}
