import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34237_FIXED_BAND_PEAK_ROWS,
  IMP34237_PEAK_INCREMENTS,
  IMP34237_PEAK_SECOND_DIFFERENCE,
  IMP34237_RESID_EXP_ROWS,
  IMP34237_RESID_ZERO_KSTAR,
  IMP34237_FIRST_BREAKDOWN_KEND,
  IMP34237_COMPUTABLE_WINDOW_COUNT,
  IMP34237_TOTAL_WINDOW_COUNT,
} from '../data/imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';

// Panel 1: the fixed-band (k<=10) peak over the three computable windows,
// climbing +0.865303 -> +0.915942 -> +0.996333 with re-accelerating increments.
function PeakReaccelChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 19.5;
  const maxX = 21.5;
  const minY = 0.8;
  const maxY = 1.05;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34237_FIXED_BAND_PEAK_ROWS.map((r) => `${xAt(r.kEnd)},${yAt(r.peak)}`).join(' ');
  const xTicks = [20.0, 20.5, 21.0];
  const yTicks = [0.8, 0.85, 0.9, 0.95, 1.0, 1.05];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k.toFixed(1)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        kEnd (window right edge)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        fixed-band (k&le;10) peak
      </text>

      <polyline points={path} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {IMP34237_FIXED_BAND_PEAK_ROWS.map((r) => (
        <circle key={'pt' + r.kEnd} cx={xAt(r.kEnd)} cy={yAt(r.peak)} r={3.5} fill="#c4b5fd" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
    </svg>
  );
}

// Panel 2: resid_exp(k) decaying through the deep tail and crossing zero at
// k*~21.28095 -- the hard right edge past which eflow_over_resid has a pole.
function ResidExpZeroCrossingChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 18.7;
  const maxX = 21.8;
  // signed-log-ish axis: plot resid_exp directly, it spans ~3e-6 down to -5e-8, so
  // scale by sign(resid) * log10(1 + |resid|/1e-8) to keep both the decade decay
  // and the small negative tail rung visible on one linear pixel axis.
  const scale = (v) => Math.sign(v) * Math.log10(1 + Math.abs(v) / 1e-8);
  const minY = scale(-6e-8);
  const maxY = scale(4e-6);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((scale(y) - minY) / (maxY - minY)) * cH;

  const path = IMP34237_RESID_EXP_ROWS.map((r) => `${xAt(r.k)},${yAt(r.residExp)}`).join(' ');
  const zeroY = yAt(0);
  const xTicks = [19, 19.5, 20, 20.5, 21, 21.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + cW} y2={zeroY} stroke="#334155" strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW - 4} y={zeroY - 4} textAnchor="end" fill="#64748b" fontSize={9}>
        resid_exp = 0
      </text>

      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT} x2={xAt(k)} y2={padT + cH} stroke="#1e293b" strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        k
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        resid_exp(k) (signed-log scale)
      </text>

      <line x1={xAt(IMP34237_RESID_ZERO_KSTAR)} y1={padT} x2={xAt(IMP34237_RESID_ZERO_KSTAR)} y2={padT + cH} stroke="#f87171" strokeWidth={1.25} strokeDasharray="5,3" />
      <text x={xAt(IMP34237_RESID_ZERO_KSTAR) + 4} y={padT + 12} fill="#f87171" fontSize={9}>
        k* &asymp; {IMP34237_RESID_ZERO_KSTAR.toFixed(5)} (pole)
      </text>

      <polyline points={path} fill="none" stroke="#4ade80" strokeWidth={1.75} />
      {IMP34237_RESID_EXP_ROWS.map((r) => (
        <circle
          key={'pt' + r.k}
          cx={xAt(r.k)}
          cy={yAt(r.residExp)}
          r={3}
          fill={r.residExp > 0 ? '#4ade80' : '#f87171'}
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp34237FixedBandPeakReaccelAndSurrogatePoleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fixed-Band Peak Re-Acceleration & Surrogate Pole (imp-34237 / imp-34169)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34169 pushed the imp-34109 fixed-band (k&le;10) peak sweep one further decade.
        Over the three windows that stay computable (kEnd = 20.0, 20.5, 21.0) the peak keeps
        climbing {IMP34237_FIXED_BAND_PEAK_ROWS[0].peak.toFixed(6)} &rarr;{' '}
        {IMP34237_FIXED_BAND_PEAK_ROWS[1].peak.toFixed(6)} &rarr;{' '}
        {IMP34237_FIXED_BAND_PEAK_ROWS[2].peak.toFixed(6)}, and its increments{' '}
        {IMP34237_PEAK_INCREMENTS[0].toFixed(6)} &rarr; {IMP34237_PEAK_INCREMENTS[1].toFixed(6)}{' '}
        RE-ACCELERATE (second difference +{IMP34237_PEAK_SECOND_DIFFERENCE.toFixed(6)}). The sweep
        cannot continue past kEnd = {IMP34237_FIRST_BREAKDOWN_KEND.toFixed(1)}: the imp-33810/imp-33843
        surrogate resid_exp(k) decays through the deep tail and crosses zero at k* &asymp;{' '}
        {IMP34237_RESID_ZERO_KSTAR.toFixed(5)}, putting a pole in eflow_over_resid so only{' '}
        {IMP34237_COMPUTABLE_WINDOW_COUNT} of the ticket's {IMP34237_TOTAL_WINDOW_COUNT} windows compute.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fixed-band (k&le;10) peak over the three computable windows -- climbing, not settling
      </p>
      <PeakReaccelChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        surrogate resid_exp(k) decaying through the deep tail and crossing zero at k* (the hard right edge)
      </p>
      <ResidExpZeroCrossingChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>fixed-band peak</th>
          </tr>
        </thead>
        <tbody>
          {IMP34237_FIXED_BAND_PEAK_ROWS.map((r) => (
            <tr key={r.kEnd} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEnd.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.peak.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-data only, baked
        literals reproducing the imp-34169 measurement; no new derivation, no bound changed.
        Descriptive surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486
        UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED; Platt-Trudgian Lambda&le;0.2 remains SOTA.
      </div>
    </div>
  );
}
