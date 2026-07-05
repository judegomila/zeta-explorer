import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION } from '../data/imp-33858-widening-fit-residual-localization.js';

const { perRungResidual, trough, farTailPeak, lag1Autocorr, signFlips, whiteNoiseExpectedFlips, aggregateRmse } =
  IMP33858_WIDENING_FIT_RESIDUAL_LOCALIZATION;

function ResidualShapeChart() {
  const svgW = 720;
  const padL = 48;
  const padR = 32;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 6;
  const kMax = 11;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const rMax = Math.max(...perRungResidual.map((r) => Math.abs(r.resid))) * 1.15;
  const yZero = padT + cH / 2;
  const yS = (resid) => yZero - (resid / rMax) * (cH / 2);

  const barW = (cW / (perRungResidual.length - 1)) * 0.6;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={yZero} x2={padL + cW} y2={yZero} stroke="#334155" strokeWidth={1.5} />

      {[rMax, rMax / 2, 0, -rMax / 2, -rMax].map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {[6, 7, 8, 9, 10, 11].map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH} x2={xS(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 18} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        k (ladder rung, N = 10^k)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        signed residual e_k (ln-ratio units)
      </text>

      {perRungResidual.map((r) => {
        const isTrough = r.k === trough.k;
        const isPeak = r.k === farTailPeak.k;
        const fill = isTrough ? '#f87171' : isPeak ? '#4ade80' : r.resid >= 0 ? '#93c5fd' : '#c4b5fd';
        const y0 = yS(0);
        const y1 = yS(r.resid);
        return (
          <rect
            key={'bar' + r.k}
            x={xS(r.k) - barW / 2}
            y={Math.min(y0, y1)}
            width={barW}
            height={Math.max(1, Math.abs(y1 - y0))}
            fill={fill}
            stroke="#0a0f1a"
            strokeWidth={0.5}
          />
        );
      })}
    </svg>
  );
}

export default function Imp33894ResidualShapeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-33843 Log-Linear Fit: Signed Residual Shape (imp-33858 / imp-33894)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33843 fit the imp-33810 eflow_attr/resid_exp widening to a log-linear surrogate and
        reported only the aggregate residual (RMSE &sim;{aggregateRmse}). imp-33858 tabulated the
        signed residual at each of the 21 rungs and found it is NOT uniform noise: it flips sign
        only {signFlips} times (vs &sim;{whiteNoiseExpectedFlips} expected for white noise) and
        carries a lag-1 autocorrelation of &sim;{lag1Autocorr}. This page is the first visual
        surface of that shape -- a head dip, a mid-ladder positive hump, a broad negative trough
        centered at k={trough.k} (highlighted red, e&sim;{trough.resid}), and a strong positive
        far-tail excursion at k={farTailPeak.k} (highlighted green, e&sim;{farTailPeak.resid}, the
        largest single residual).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Signed per-rung residual e_k of the imp-33843 log-linear fit, k = 6.00 .. 11.00
      </p>
      <ResidualShapeChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual e_k</th>
          </tr>
        </thead>
        <tbody>
          {perRungResidual.map((r) => (
            <tr key={r.k} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k.toFixed(2)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.k === trough.k ? '#f87171' : r.k === farTailPeak.k ? '#4ade80' : '#cbd5e1',
                }}
              >
                {r.resid}
              </td>
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization only
        -- the curvature shown here is real (a coherent low-frequency structure, not scatter) but
        stays small (&sim;12% multiplicative, within &sim;0.12 ln-ratio units) and does NOT overturn
        the imp-33843 log-linear-over-power-law form selection (R^2 &sim;0.99715 unchanged). The
        component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
        the OLS surrogate is descriptive, not derived. No bound changes; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED. Platt-Trudgian
        &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
