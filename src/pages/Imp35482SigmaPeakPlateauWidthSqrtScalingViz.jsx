import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35482_SWEEP_POINTS,
  IMP35482_SLOPE,
  IMP35482_SUMMARY,
} from '../data/imp-35482-sigma-peak-plateau-width-sqrt-scaling-viz-data.js';
import { ED } from '../styles/tokens.js';

// Scatter of the four (sqrt(tol), W(tol)) points against the fitted W = slope * sqrt(tol) line
// through the origin -- the signature of a smooth quadratic sigma-peak maximum.
function SqrtScalingChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 320;
  const padT = 20;
  const padB = 46;
  const plotH = svgH - padT - padB;

  const maxX = Math.max(...IMP35482_SWEEP_POINTS.map((p) => p.sqrt_tol));
  const maxY = Math.max(...IMP35482_SWEEP_POINTS.map((p) => p.width_decades));
  const xOf = (v) => padL + (v / maxX) * plotW;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  const xTicks = [0, maxX * 0.25, maxX * 0.5, maxX * 0.75, maxX];
  const yTicks = [0, maxY * 0.25, maxY * 0.5, maxY * 0.75, maxY];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        sqrt(tol)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        W(tol) [decades]
      </text>

      {/* fitted line through the origin: W = slope * sqrt(tol) */}
      <line
        x1={xOf(0)}
        y1={yOf(0)}
        x2={xOf(maxX)}
        y2={yOf(IMP35482_SLOPE * maxX)}
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.7}
      />

      {IMP35482_SWEEP_POINTS.map((p) => (
        <g key={p.tol}>
          <circle cx={xOf(p.sqrt_tol)} cy={yOf(p.width_decades)} r={5} fill={ED.series2} stroke={ED.paper} strokeWidth={1} />
          <text
            x={xOf(p.sqrt_tol) + 8}
            y={yOf(p.width_decades) - 8}
            fill={ED.ink}
            fontSize={8.5}
            fontFamily="monospace"
          >
            tol={p.tol.toExponential(0)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp35482SigmaPeakPlateauWidthSqrtScalingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Peak Plateau Width vs sqrt(tol): a Line Through the Origin (imp-35482 / imp-35411)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35337 dd-certified the interior GUE-conditional sigma-share peak value but flagged its
        argmax as intrinsically ill-conditioned -- a flat maximum with a wide ln-N plateau. imp-35411
        quantified that plateau: at tolerance tol below the peak, the plateau width W(tol) (in decades
        of N) scales as sqrt(tol) to 6+ significant figures across four decades of tol, with slope
        W(tol)/sqrt(tol) = {IMP35482_SLOPE}. That is exactly the signature of a smooth quadratic
        maximum. This page plots the four measured points against that fitted line through the
        origin.
      </p>

      <SqrtScalingChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        All {IMP35482_SUMMARY.pointCount} measured points sit on the W = {IMP35482_SLOPE} &times;
        sqrt(tol) line through the origin; the per-point slope spread across the sweep is only{' '}
        {IMP35482_SUMMARY.maxSlopeSpread.toExponential(1)}, confirming the quadratic-maximum
        signature imp-35411 reported.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data only, baked literals
        reproducing the imp-35411 sqrt(tol) sweep verbatim; no new derivation, no bound changed.
        Discharges nothing: the imp-35337a surrogate-vs-true fidelity sub-gap stays OPEN; the C_C
        = (1/8)&nbsp;sqrt(3&nbsp;pi) ansatz (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631), and the
        imp-398 C_F prefactor are UNTOUCHED; changes no bound; establishes no operator positivity; no
        RH verdict, NO QED.
      </div>
    </div>
  );
}
