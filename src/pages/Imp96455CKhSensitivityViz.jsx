import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96455_SWEEP_POINTS,
  IMP96455_LANDMARKS,
  IMP96455_HONEST_BANNER,
} from '../data/imp-96455-ckh-sensitivity-viz-data.js';

function RelGapChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = -1.2;
  const xMax = 2.2;
  const yMin = -0.005;
  const yMax = 0.095;

  const xOf = (log10Factor) => padL + ((log10Factor - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [-1, 0, 1, 2];
  const yTicks = [0, 0.02, 0.04, 0.06, 0.08];

  const firstZeroD = IMP96455_SWEEP_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10Factor).toFixed(2)} ${yOf(p.rateRelGapFirstZero).toFixed(2)}`)
    .join(' ');
  const gap1e22D = IMP96455_SWEEP_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10Factor).toFixed(2)} ${yOf(0).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{v.toFixed(2)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {v === 0 ? '1x' : `1e${v}x`}
        </text>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <path d={firstZeroD} fill="none" stroke="#fb923c" strokeWidth={2} opacity={0.95} />
      <path d={gap1e22D} fill="none" stroke="#38bdf8" strokeWidth={2} opacity={0.95} />

      {IMP96455_SWEEP_POINTS.map((p) => (
        <g key={`pts-${p.factorVsBaseline}`}>
          <circle cx={xOf(p.log10Factor)} cy={yOf(p.rateRelGapFirstZero)} r={2.6} fill="#fb923c" />
          <circle cx={xOf(p.log10Factor)} cy={yOf(0)} r={2.6} fill="#38bdf8" />
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        C_KH as a multiple of baseline (log scale, 0.1x .. 100x)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke="#fb923c" strokeWidth={2} />
        <text x={22} y={3} fill="#94a3b8" fontSize={8.5}>first-zero rate relative gap (flat at 8.47e-2)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke="#38bdf8" strokeWidth={2} />
        <text x={22} y={17} fill="#94a3b8" fontSize={8.5}>1e22 rate relative gap (flat at ~0, double-precision floor)</text>
      </g>
    </svg>
  );
}

function EcollScalingChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = -1.2;
  const xMax = 2.2;
  const yMin = -1.2;
  const yMax = 1.2;

  const xOf = (log10Factor) => padL + ((log10Factor - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [-1, 0, 1, 2];
  const yTicks = [-1, -0.5, 0, 0.5, 1];

  const measuredD = IMP96455_SWEEP_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10Factor).toFixed(2)} ${yOf(p.log10EcollRatio).toFixed(2)}`)
    .join(' ');
  const refD = IMP96455_SWEEP_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10Factor).toFixed(2)} ${yOf(p.log10SqrtFactorRef).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {`1e${v}x`}
        </text>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <path d={refD} fill="none" stroke="#a78bfa" strokeWidth={3} strokeDasharray="2 3" opacity={0.7} />
      <path d={measuredD} fill="none" stroke="#38bdf8" strokeWidth={1.5} opacity={0.95} />

      {IMP96455_SWEEP_POINTS.map((p) => (
        <circle key={`e-${p.factorVsBaseline}`} cx={xOf(p.log10Factor)} cy={yOf(p.log10EcollRatio)} r={2.6} fill="#38bdf8" />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        C_KH as a multiple of baseline (log scale, 0.1x .. 100x)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke="#a78bfa" strokeWidth={3} strokeDasharray="2 3" />
        <text x={22} y={3} fill="#94a3b8" fontSize={8.5}>exact sqrt(C_KH / baseline) reference</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke="#38bdf8" strokeWidth={1.5} />
        <text x={22} y={17} fill="#94a3b8" fontSize={8.5}>measured E_coll(0.125, 1e22) ratio to baseline</text>
      </g>
    </svg>
  );
}

export default function Imp96455CKhSensitivityViz() {
  const { rateRelGapFirstZeroBaseline, maxDev1e22, maxDevFirst, maxScaleLawDev } = IMP96455_LANDMARKS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96429: C_KH-Invariance Sweep" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96455_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The Koksma-Hlawka factor C_KH = pi * 2.622 enters the count-inversion rate and the
        tabulated-true-height rate as the identical sqrt(C_KH) prefactor, so it cancels
        exactly in the imp-96402 relative-gap verdict. imp-96429 swept C_KH across three
        decades (0.1x .. 100x baseline) to confirm this: both relative gaps stay flat, and
        only the absolute E_coll magnitude moves, tracking sqrt(C_KH) exactly.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Relative gaps vs C_KH: flat at 0 and flat at 8.47e-2
      </h3>
      <RelGapChart />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Absolute E_coll(0.125, 1e22) magnitude ratio vs C_KH, log-log
      </h3>
      <EcollScalingChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> in the top chart,
        both relative-gap curves are flat across the whole 3-decade sweep -- the 1e22 gap at
        the double-precision floor (max deviation {maxDev1e22.toExponential(2)}) and the
        first-zero gap at {rateRelGapFirstZeroBaseline.toExponential(6)} (max deviation{' '}
        {maxDevFirst.toExponential(2)}). In the bottom chart, the measured E_coll ratio (blue)
        lies exactly on the dashed sqrt(C_KH / baseline) reference (max deviation{' '}
        {maxScaleLawDev.toExponential(2)}): rescaling C_KH moves only the magnitude, never
        the verdict.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-96429 baked sweep table verbatim (only the log10 axis reshaping, a
        double-precision floor clip for the exact-zero 1e22 gap, and the eCollA1e22-to-baseline
        ratio are computed here). Measurement/accuracy audit of a normalization constant only:
        no gap closed, no bound changed, conditional C_H &le; 0.127 stays UNPROVEN, C_H
        isRigorousUpperBound = false (imp-2642/imp-2701), the imp-2640 Gronwall discharge of
        C_Lip stays NEGATIVE. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. RH open.
        NO QED.
      </div>
    </div>
  );
}
