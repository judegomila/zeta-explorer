import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96316_SWEEP,
  IMP96316_SUMMARY,
  IMP96316_CAVEAT_BANNER,
} from '../data/imp-96316-etrunc-sensitivity-viz-data.js';

// N_peak/N_flow vs E_trunc-scale multiplier (log x-axis, 0.2x .. 20x), with a horizontal reference
// line at 1/sqrt(3) that the curve crosses smoothly -- a crossing, not a plateau or fixed point.
function SensitivityChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const lnScales = IMP96316_SWEEP.map((r) => Math.log(r.scale));
  const lnLo = Math.min(...lnScales);
  const lnHi = Math.max(...lnScales);
  const ratios = IMP96316_SWEEP.map((r) => r.ratio);
  const minV = Math.min(...ratios) * 0.97;
  const maxV = Math.max(...ratios) * 1.03;
  const xOf = (scale) => padL + ((Math.log(scale) - lnLo) / (lnHi - lnLo)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;

  const crossingY = yOf(IMP96316_SUMMARY.one_over_sqrt3);
  const measuredX = xOf(1);
  const measuredY = yOf(IMP96316_SUMMARY.ratio_at_1x);
  const crossingX = xOf(IMP96316_SUMMARY.crossing_scale);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke="#64748b"
        strokeWidth={1.5}
      />
      <text x={4} y={padT + 4} fill="#94a3b8" fontSize={10}>
        N_peak/N_flow
      </text>
      <text x={padL + plotW - 130} y={svgH - 4} fill="#94a3b8" fontSize={10}>
        E_trunc scale (log, 0.2x&#8594;20x)
      </text>

      <line
        x1={padL}
        y1={crossingY}
        x2={padL + plotW}
        y2={crossingY}
        stroke="#f87171"
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + plotW - 96} y={crossingY - 5} fill="#f87171" fontSize={9}>
        1/sqrt(3) = {IMP96316_SUMMARY.one_over_sqrt3.toFixed(5)}
      </text>

      <polyline
        fill="none"
        stroke="#60a5fa"
        strokeWidth={1.75}
        points={IMP96316_SWEEP.map((r) => `${xOf(r.scale)},${yOf(r.ratio)}`).join(' ')}
      />

      <circle cx={crossingX} cy={crossingY} r={3.5} fill="#f87171" />
      <circle cx={measuredX} cy={measuredY} r={3.5} fill="#34d399" />
      <text x={measuredX + 6} y={measuredY - 6} fill="#34d399" fontSize={9}>
        measured (E_trunc=1x)
      </text>

      {[0.2, 1, 5, 20].map((s) => (
        <text
          key={s}
          x={xOf(s)}
          y={svgH - padB + 16}
          fill="#64748b"
          fontSize={9}
          textAnchor="middle"
        >
          {s}x
        </text>
      ))}
    </svg>
  );
}

export default function Imp96316EtruncSensitivityViz() {
  const s = IMP96316_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="N_peak/N_flow vs E_trunc-Scaling Sensitivity Sweep (imp-96187 / imp-96316)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96316_CAVEAT_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Scaling the fixed-strip E_trunc floor drives the imp-3220 U-shape peak-location ratio
        N_peak/N_flow smoothly and monotonically downward from {s.ratio_at_low.toFixed(4)} at{' '}
        {s.scale_at_low.toFixed(2)}x to {s.ratio_at_high.toFixed(4)} at{' '}
        {s.scale_at_high.toFixed(1)}x, crossing 1/sqrt(3) = {s.one_over_sqrt3.toFixed(5)} at
        scale &asymp; {s.crossing_scale.toFixed(3)}x &mdash; near, but not equal to, the actual
        E_trunc (1x). The curve shows no plateau or fixed point at 1/sqrt(3): the proximity is an
        accident of the inherited constants, not a forced identity.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        N_peak/N_flow vs E_trunc-scale multiplier
      </h3>
      <SensitivityChart />

      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          borderCollapse: 'collapse',
          marginTop: '1.25rem',
        }}
      >
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>quantity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>ratio at actual E_trunc (1x)</td>
            <td style={{ textAlign: 'right', color: '#34d399' }}>{s.ratio_at_1x.toFixed(6)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>1/sqrt(3)</td>
            <td style={{ textAlign: 'right', color: '#f87171' }}>{s.one_over_sqrt3.toFixed(6)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>E_trunc scale at the 1/sqrt(3) crossing</td>
            <td style={{ textAlign: 'right' }}>{s.crossing_scale.toFixed(4)}x</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>sweep range</td>
            <td style={{ textAlign: 'right' }}>
              {s.scale_at_low.toFixed(2)}x&ndash;{s.scale_at_high.toFixed(1)}x
            </td>
          </tr>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page recomputing the
        imp-96187 F3 E_trunc-scale sensitivity sweep from the identical inherited component model at
        a finer grid to expose the smooth 1/sqrt(3) crossing for charting (no new derivation).
        Measurement/derivation display only; the C_mb GUE-conditional share (imp-486) stays
        untouched; establishes no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
