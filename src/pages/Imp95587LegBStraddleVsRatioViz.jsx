import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95587_STRADDLE_POINTS,
  IMP95587_RATIO_POINTS,
  IMP95587_DELTA_A_DET,
  IMP95587_DELTA_A_TRACE,
  IMP95587_PAPER_LAMMAX,
  IMP95587_MODEL_LAMMAX,
  IMP95587_RATIO_INEQUALITY_HOLDS,
} from '../data/imp-95587-legb-straddle-vs-ratio-viz-data.js';
import { ED } from '../styles/tokens.js';

function NumberLinePanel({ points, xMin, xMax, zeroLine, title }) {
  const svgW = 640;
  const padL = 24;
  const padR = 24;
  const cW = svgW - padL - padR;
  const svgH = 90;
  const axisY = 54;

  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={16} fill={ED.inkFaint} fontSize={10} fontWeight={700}>
        {title}
      </text>
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1} />

      {zeroLine && (
        <g>
          <line x1={xS(0)} y1={axisY - 22} x2={xS(0)} y2={axisY + 22} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4,3" />
          <text x={xS(0)} y={axisY + 36} textAnchor="middle" fill={ED.brass} fontSize={9}>
            0
          </text>
        </g>
      )}

      {points.map((p) => (
        <g key={p.key}>
          <line x1={xS(p.value)} y1={axisY - 6} x2={xS(p.value)} y2={axisY + 6} stroke={p.color} strokeWidth={2} />
          <circle cx={xS(p.value)} cy={axisY} r={5} fill={p.color} />
          <text x={xS(p.value)} y={axisY - 12} textAnchor="middle" fill={p.color} fontSize={9}>
            {p.value.toFixed(5)}
          </text>
          <text x={xS(p.value)} y={axisY + 20} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp95587LegBStraddleVsRatioViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="LEG B DELTA_A Straddle vs. the Direct Ratio Inequality (imp-95561, port window (3,1))" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        At the real port-derived window (p, D) = (3, 1), the Loewner-sandwich
        difference DELTA_A = A_m - A_p has eigenvalues that straddle zero
        (det = {IMP95587_DELTA_A_DET.toFixed(6)} &lt; 0, trace ={' '}
        {IMP95587_DELTA_A_TRACE.toFixed(6)} &gt; 0), so DELTA_A is genuinely
        indefinite and the sandwich test is inconclusive. Yet the direct
        generalized-pencil comparison it is meant to certify still holds:
        lambda_max(A_p,B_p) = {IMP95587_PAPER_LAMMAX.toFixed(6)} &le;
        lambda_max(A_m,B_m) = {IMP95587_MODEL_LAMMAX.toFixed(6)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
        DELTA_A eigenpair straddling zero -- the sandwich leg (DELTA_A &ge; 0) fails
      </p>
      <NumberLinePanel
        points={IMP95587_STRADDLE_POINTS}
        xMin={-0.05}
        xMax={0.13}
        zeroLine
        title="eig(DELTA_A)"
      />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.25rem' }}>
        the two ratio eigenvalues -- the direct-pencil decider still holds
      </p>
      <NumberLinePanel
        points={IMP95587_RATIO_POINTS}
        xMin={0}
        xMax={0.8}
        zeroLine={false}
        title="lambda_max(A_p,B_p) vs lambda_max(A_m,B_m)"
      />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the top
        panel shows DELTA_A's two eigenvalues on either side of zero (red
        negative, green positive) -- exactly the indefinite signature that
        makes the two-sided Loewner sandwich (DELTA_A &ge; 0 and DELTA_B &ge; 0)
        inconclusive at this window. The bottom panel shows the quantity LEG B
        actually needs: the paper-side largest generalized eigenvalue (blue)
        sitting comfortably below the model-side one (purple)
        {IMP95587_RATIO_INEQUALITY_HOLDS ? ' -- the inequality holds' : ''}.
        Together they illustrate imp-95537 D2: the direct pencil comparison is
        strictly sharper than the sandwich, which can fail even where the
        inequality it is meant to imply is true.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> witness-completeness
        only -- two fixed windows, no uniformity claim, no bound moves. LEG B
        substance is the imp-95443 uniformity-over-depth-and-size race, left
        untouched here. NO QED; no refereed bound is changed; RH
        open.
      </div>
    </div>
  );
}
