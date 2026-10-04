import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33854_LOG_SATURATION_EXPONENT_RECONCILIATION } from '../data/imp-33854-log-saturation-exponent-reconciliation.js';
import { ED } from '../styles/tokens.js';

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
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {ticksY.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(10 ** t)} x2={padL + cW} y2={yS(10 ** t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(10 ** t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {(10 ** t).toExponential(1)}
          </text>
        </g>
      ))}

      {sharedGrid.map((r) => (
        <g key={'xt' + r.N_log10}>
          <line x1={xS(r.N_log10)} y1={padT + cH} x2={xS(r.N_log10)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.N_log10)} y={padT + cH + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.N_log10}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 N
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        shortfall (log scale)
      </text>

      {line('gapSigma', ED.series2)}
      {dots('gapSigma', ED.series2)}
      {line('gapEcoll', ED.series3)}
      {dots('gapEcoll', ED.series3)}
      {line('gFundamental', ED.series1)}
      {dots('gFundamental', ED.series1)}

      <g transform={`translate(${padL + 12}, ${padT + 4})`}>
        <circle cx={0} cy={0} r={3} fill={ED.series2} />
        <text x={8} y={3} fill={ED.ink} fontSize={9}>
          gap_sigma = 1/2 - p
        </text>
        <circle cx={0} cy={14} r={3} fill={ED.series3} />
        <text x={8} y={17} fill={ED.ink} fontSize={9}>
          gap_ecoll = q + 1/2
        </text>
        <circle cx={0} cy={28} r={3} fill="#93c5fd" />
        <text x={8} y={31} fill={ED.ink} fontSize={9}>
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

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33816 and imp-33620 reported two seemingly separate slow-approach rates: the
        sigma(N) exponent shortfall gap_sigma = 1/2 - p, and the E_coll exponent residual
        gap_ecoll = q + 1/2. imp-33854 proved both reduce to a single fundamental object
        g(N) = (1/2) d ln(log T0)/d ln N, with gap_ecoll = g exactly and
        gap_sigma = g + |q| sigma (a finite-N denominator-share term that shrinks to zero as
        sigma decays). This page plots all three curves across the shared N = 1e12 .. 1e200
        ladder, showing the visual collapse.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
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
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10 N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap_sigma</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap_ecoll</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>|q|*sigma share</th>
          </tr>
        </thead>
        <tbody>
          {sharedGrid.map((r) => (
            <tr key={r.N_log10} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
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
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {findings.R2_residual_is_qSigma_vanishing}{' '}
        Max deviation of the exact identity gap_ecoll = g is {diagnostics.max_I1_deviation_gapEcoll_minus_g}
        (machine precision). Measurement/derivation only -- the component model is the inherited
        imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share
        per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
        K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>
    </div>
  );
}
