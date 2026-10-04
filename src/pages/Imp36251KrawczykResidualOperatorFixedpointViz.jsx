import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP36251_N_CROSS,
  IMP36251_FP_AT_CENTER,
  IMP36251_RESIDUAL_OPERATOR_GRID,
  IMP36251_FINDING,
} from '../data/imp-36251-krawczyk-residual-operator-fixedpoint-viz-data.js';
import { ED } from '../styles/tokens.js';

// F(m) curve crossing zero at the fixed point N_cross.
function FCurve() {
  const svgW = 640;
  const svgH = 260;
  const padL = 70;
  const padR = 30;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const ms = IMP36251_RESIDUAL_OPERATOR_GRID.map((r) => r[0]);
  const fs = IMP36251_RESIDUAL_OPERATOR_GRID.map((r) => r[1]);
  const mMin = Math.min(...ms);
  const mMax = Math.max(...ms);
  const fMin = Math.min(...fs);
  const fMax = Math.max(...fs);

  const x = (m) => padL + ((m - mMin) / (mMax - mMin)) * plotW;
  const y = (f) => padT + (1 - (f - fMin) / (fMax - fMin)) * plotH;

  const path = IMP36251_RESIDUAL_OPERATOR_GRID.map((r, i) => `${i === 0 ? 'M' : 'L'} ${x(r[0])} ${y(r[1])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* zero line */}
      <line x1={padL} x2={svgW - padR} y1={y(0)} y2={y(0)} stroke={ED.rule} strokeDasharray="4 3" strokeWidth={1} />
      <text x={svgW - padR} y={y(0) - 6} textAnchor="end" fill={ED.inkFaint} fontSize={10} fontFamily="monospace">
        F(m) = 0
      </text>
      {/* N_cross vertical marker */}
      <line x1={x(IMP36251_N_CROSS)} x2={x(IMP36251_N_CROSS)} y1={padT} y2={svgH - padB} stroke={ED.brassDeco} strokeDasharray="4 3" strokeWidth={1.5} opacity={0.8} />
      <text x={x(IMP36251_N_CROSS)} y={padT - 6} textAnchor="middle" fill={ED.brass} fontSize={11} fontFamily="monospace">
        N_cross
      </text>
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      <circle cx={x(IMP36251_N_CROSS)} cy={y(0)} r={5} fill={ED.series1} stroke={ED.paper} strokeWidth={1.5} />
      <text x={padL} y={svgH - 10} fill={ED.inkFaint} fontSize={10} fontFamily="monospace">
        m = {mMin.toExponential(2)}
      </text>
      <text x={svgW - padR} y={svgH - 10} textAnchor="end" fill={ED.inkFaint} fontSize={10} fontFamily="monospace">
        m = {mMax.toExponential(2)}
      </text>
    </svg>
  );
}

// F-prime(m) curve, staying well clear of zero -- the (H1) margin.
function FPrimeCurve() {
  const svgW = 640;
  const svgH = 200;
  const padL = 70;
  const padR = 30;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const ms = IMP36251_RESIDUAL_OPERATOR_GRID.map((r) => r[0]);
  const fps = IMP36251_RESIDUAL_OPERATOR_GRID.map((r) => r[2]);
  const mMin = Math.min(...ms);
  const mMax = Math.max(...ms);
  // Fix the vertical domain to [0, 1] so the "far from zero" margin reads visually.
  const domainMin = 0;
  const domainMax = 1;

  const x = (m) => padL + ((m - mMin) / (mMax - mMin)) * plotW;
  const y = (fp) => padT + (1 - (fp - domainMin) / (domainMax - domainMin)) * plotH;

  const path = IMP36251_RESIDUAL_OPERATOR_GRID.map((r, i) => `${i === 0 ? 'M' : 'L'} ${x(r[0])} ${y(r[2])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={svgW - padR} y1={y(0)} y2={y(0)} stroke={ED.series2} strokeDasharray="3 3" strokeWidth={1} opacity={0.6} />
      <text x={svgW - padR} y={y(0) - 6} textAnchor="end" fill={ED.series2} fontSize={10} fontFamily="monospace">
        F-prime = 0 ((H1) forbidden)
      </text>
      <line x1={x(IMP36251_N_CROSS)} x2={x(IMP36251_N_CROSS)} y1={padT} y2={svgH - padB} stroke={ED.brassDeco} strokeDasharray="4 3" strokeWidth={1.5} opacity={0.8} />
      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2} />
      <circle cx={x(IMP36251_N_CROSS)} cy={y(IMP36251_FP_AT_CENTER)} r={5} fill={ED.series3} stroke={ED.paper} strokeWidth={1.5} />
      <text x={x(IMP36251_N_CROSS)} y={y(IMP36251_FP_AT_CENTER) - 12} textAnchor="middle" fill={ED.series3} fontSize={11} fontFamily="monospace" fontWeight={700}>
        {IMP36251_FP_AT_CENTER.toFixed(4)}
      </text>
    </svg>
  );
}

export default function Imp36251KrawczykResidualOperatorFixedpointViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Residual Operator F(m) and F-prime(m) at N_cross (imp-36154 / imp-36251)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-36154 residual node F(m) = m - K log T0(m), K ~ 1.5727e8, has a fixed point at{' '}
        <strong style={{ color: 'var(--brass)' }}>N_cross ~ 3.28e9</strong> where F(N_cross) = 0. Its exact
        derivative F-prime(m) = 1 - K * 2 pi / (T0 log(T0/2 pi)) sits at{' '}
        <strong style={{ color: 'var(--series-3)' }}>~0.9546</strong> at the centre and stays in [0.924, 0.968]
        across the whole +/-40% window shown below -- the (H1) nonvanishing hypothesis for the Krawczyk
        existence/uniqueness template holds with a large margin.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>F(m): residual crossing zero</h3>
      <FCurve />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.4rem' }}>
        F-prime(m): (H1) margin, far from zero
      </h3>
      <FPrimeCurve />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP36251_FINDING.fCrossesZeroAtCenter}.{' '}
        {IMP36251_FINDING.fPrimeStaysFarFromZero}. {IMP36251_FINDING.illustrativeOnly}. The imp-36154
        R1-R6 requirements (certified value, certified derivative enclosure, machine (H1)/(H2) tests,
        directed-rounding layer, seed + assembly) are untouched; imp-34687a stays UNIMPLEMENTED and
        imp-34714a stays OPEN. C_mb stays GUE-conditional (imp-486); no RH verdict, NO QED.
      </div>
    </div>
  );
}
