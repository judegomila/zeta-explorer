import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION } from '../data/imp-33854-log-saturation-exponent-reconciliation.js';

const { sharedGrid, findings, diagnostics } = IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION;

function CollapseChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const svgH = 300;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const dMin = sharedGrid[0].N_log10;
  const dMax = sharedGrid[sharedGrid.length - 1].N_log10;
  const xS = (d) => padL + ((d - dMin) / (dMax - dMin)) * cW;

  // log10 scale for the y-axis (all quantities are positive and span orders of magnitude).
  const allVals = sharedGrid.flatMap((r) => [r.gapSigma, r.gapEcoll, r.gFundamental]);
  const yMax = Math.log10(Math.max(...allVals));
  const yMin = Math.log10(Math.min(...allVals.filter((v) => v > 0)));
  const yS = (v) => padT + cH - ((Math.log10(v) - yMin) / (yMax - yMin)) * cH;

  const line = (key, color) => {
    const pts = sharedGrid.map((r) => `${xS(r.N_log10)},${yS(r[key])}`).join(' ');
    return <polyline points={pts} fill="none" stroke={color} strokeWidth={2} />;
  };

  const dots = (key, color) =>
    sharedGrid.map((r) => (
      <circle key={key + r.N_log10} cx={xS(r.N_log10)} cy={yS(r[key])} r={3} fill={color} />
    ));

  const ticksY = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {ticksY.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(10 ** t)} x2={padL + cW} y2={yS(10 ** t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(10 ** t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {(10 ** t).toExponential(1)}
          </text>
        </g>
      ))}

      {sharedGrid.map((r) => (
        <g key={'xt' + r.N_log10}>
          <line x1={xS(r.N_log10)} y1={padT + cH} x2={xS(r.N_log10)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.N_log10)} y={padT + cH + 18} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.N_log10}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log10 N
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        shortfall (log scale)
      </text>

      {line('gapSigma', '#f87171')}
      {dots('gapSigma', '#f87171')}
      {line('gapEcoll', '#4ade80')}
      {dots('gapEcoll', '#4ade80')}
      {line('gFundamental', '#93c5fd')}
      {dots('gFundamental', '#93c5fd')}

      <g transform={`translate(${padL + 12}, ${padT + 4})`}>
        <circle cx={0} cy={0} r={3} fill="#f87171" />
        <text x={8} y={3} fill="#cbd5e1" fontSize={9}>
          gap_sigma = 1/2 - p
        </text>
        <circle cx={0} cy={14} r={3} fill="#4ade80" />
        <text x={8} y={17} fill="#cbd5e1" fontSize={9}>
          gap_ecoll = q + 1/2
        </text>
        <circle cx={0} cy={28} r={3} fill="#93c5fd" />
        <text x={8} y={31} fill="#cbd5e1" fontSize={9}>
          g(N) = (1/2) d ln(log T0)/d ln N
        </text>
      </g>
    </svg>
  );
}

export default function Imp33895LogSaturationReconciliationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-33854 Log-Saturation Reconciliation: Two Shortfalls, One Object (imp-33895)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33816 and imp-33620 reported two seemingly separate slow-approach rates: the
        sigma(N) exponent shortfall gap_sigma = 1/2 - p, and the E_coll exponent residual
        gap_ecoll = q + 1/2. imp-33854 proved both reduce to a single fundamental object
        g(N) = (1/2) d ln(log T0)/d ln N, with gap_ecoll = g exactly and
        gap_sigma = g + |q| sigma (a finite-N denominator-share term that shrinks to zero as
        sigma decays). This page plots all three curves across the shared N = 1e12 .. 1e200
        ladder, showing the visual collapse.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        gap_sigma, gap_ecoll, and g(N) across the shared grid (log-log)
      </p>
      <CollapseChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>log10 N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap_sigma</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap_ecoll</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>|q|*sigma share</th>
          </tr>
        </thead>
        <tbody>
          {sharedGrid.map((r) => (
            <tr key={r.N_log10} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N_log10}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.sigma}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.gapSigma}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.gapEcoll}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.residualBetween}</td>
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> {findings.R2_residual_is_qSigma_vanishing}{' '}
        Max deviation of the exact identity gap_ecoll = g is {diagnostics.max_I1_deviation_gapEcoll_minus_g}
        (machine precision). Measurement/derivation only -- the component model is the inherited
        imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share
        per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
        K_a &ge; 0 remains untouched. No RH verdict, NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains
        the rigorous SOTA.
      </div>
    </div>
  );
}
