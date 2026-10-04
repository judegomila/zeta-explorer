import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96721_SIGMA2_TABLE,
  IMP96721_SATURATION_SWEEP,
  IMP96721_DEPARTURE_WINDOW,
  IMP96721_SAFE_DIRECTION,
  IMP96721_HONEST_BANNER,
} from '../data/imp-96721-sigma2-emp-vs-gue-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// line chart: Sigma2_emp(L) vs Sigma2_GUE(L) across the calibration window
// (log x-axis, L=30..960), showing the widening gap as GUE keeps growing
// logarithmically while the empirical curve saturates.
function Sigma2Panel() {
  const rows = IMP96721_SIGMA2_TABLE;
  const svgW = 700;
  const padL = 56;
  const padR = 20;
  const svgH = 300;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logL = (L) => Math.log10(L);
  const minLogL = logL(rows[0].L);
  const maxLogL = logL(rows[rows.length - 1].L);
  const maxVal = Math.max(...rows.map((r) => Math.max(r.sigma2Emp, r.sigma2Gue))) * 1.08;

  const xOf = (L) => padL + ((logL(L) - minLogL) / (maxLogL - minLogL)) * plotW;
  const yOf = (v) => padT + plotH - (v / maxVal) * plotH;

  const pathOf = (key) =>
    rows.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.L).toFixed(2)} ${yOf(r[key]).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const v = f * maxVal;
        return (
          <g key={`y${f}`}>
            <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}
      <path d={pathOf('sigma2Gue')} fill="none" stroke={ED.series1} strokeWidth={1.8} />
      <path d={pathOf('sigma2Emp')} fill="none" stroke={ED.brassDeco} strokeWidth={1.8} />
      {rows.map((r) => (
        <g key={`pt${r.L}`}>
          <circle cx={xOf(r.L)} cy={yOf(r.sigma2Gue)} r={2.6} fill={ED.series1} />
          <circle cx={xOf(r.L)} cy={yOf(r.sigma2Emp)} r={2.6} fill={ED.brassDeco} />
          <text x={xOf(r.L)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            {r.L}
          </text>
        </g>
      ))}
      <text x={padL + plotW - 4} y={padT + 10} textAnchor="end" fill={ED.series1} fontSize={9}>
        Sigma2_GUE (sine-kernel)
      </text>
      <text x={padL + plotW - 4} y={padT + 22} textAnchor="end" fill={ED.brass} fontSize={9}>
        Sigma2_emp (real zeros)
      </text>
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        L (log scale)
      </text>
    </svg>
  );
}

// ratio Sigma2_emp/Sigma2_GUE vs L (log x-axis), marking the L~3-8 departure
// window where the ratio falls from ~0.90 toward ~0.76.
function RatioPanel() {
  const rows = IMP96721_SATURATION_SWEEP;
  const svgW = 700;
  const padL = 56;
  const padR = 20;
  const svgH = 260;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logL = (L) => Math.log10(L);
  const minLogL = logL(rows[0].L);
  const maxLogL = logL(rows[rows.length - 1].L);

  const xOf = (L) => padL + ((logL(L) - minLogL) / (maxLogL - minLogL)) * plotW;
  const yOf = (ratio) => padT + plotH - ratio * plotH;

  const path = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.L).toFixed(2)} ${yOf(r.ratio).toFixed(2)}`)
    .join(' ');

  const bandX1 = xOf(IMP96721_DEPARTURE_WINDOW.lLow);
  const bandX2 = xOf(IMP96721_DEPARTURE_WINDOW.lHigh);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={bandX1} y={padT} width={bandX2 - bandX1} height={plotH} fill={alpha(ED.series2, 0.1)} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke={ED.series5} strokeWidth={1.8} />
      {rows.map((r) => (
        <circle key={`pt${r.L}`} cx={xOf(r.L)} cy={yOf(r.ratio)} r={2.6} fill={ED.series5} />
      ))}
      <text x={(bandX1 + bandX2) / 2} y={padT + 14} textAnchor="middle" fill={ED.series2} fontSize={8.5}>
        L ~ {IMP96721_DEPARTURE_WINDOW.lLow}-{IMP96721_DEPARTURE_WINDOW.lHigh} departure onset
      </text>
      {rows.map((r) => (
        <text key={`lb${r.L}`} x={xOf(r.L)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
          {r.L}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        L (log scale)
      </text>
    </svg>
  );
}

export default function Imp96721Sigma2EmpVsGueViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Basis-C: Empirical Sigma2 (Real Zeros) vs. Exact GUE Sigma2" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96721_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96695 measured the number variance Sigma2(L) two ways: Sigma2_emp from real Odlyzko
        zeros (heights up to T ~ 1.13e6) and the exact Dyson-Mehta sine-kernel Sigma2_GUE. Below
        L ~ 3 the two track closely (within 1-9 percent); beyond it Sigma2_emp saturates near ~0.4
        while Sigma2_GUE keeps growing logarithmically &mdash; the well-known finite-height (Berry
        semiclassical) saturation of the zeta number variance, not a failure of GUE universality.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Sigma2_emp vs. Sigma2_GUE, L = 30..960
      </h3>
      <Sigma2Panel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Sigma2_emp / Sigma2_GUE ratio, small-L sweep (L = 0.5..960)
      </h3>
      <RatioPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Safe-direction signal shrinkage:</strong> at L ={' '}
        {IMP96721_SAFE_DIRECTION.atL}, the corroboration signal |rho + 1/2| measured from real
        zeros is {IMP96721_SAFE_DIRECTION.signalEmp.toExponential(2)}, about{' '}
        {IMP96721_SAFE_DIRECTION.shrinkageFactor.toFixed(0)}x smaller than the GUE signal{' '}
        {IMP96721_SAFE_DIRECTION.signalGue.toExponential(2)}. The real-zero rho sits closer to the
        rigidity limit -1/2 than the GUE rho, so the discrepancy shrinks the corroboration signal
        rather than contradicting it &mdash; the safe direction for the basis-C reach crossover.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Not uniform over the window:</strong> imp-96714
        checked the safe-direction sign at every calibration rung above, not just L = 960. It
        holds (safe) at L &ge; 120 but FAILS at the two smallest rungs L = 30 and L = 60, where
        the empirical number variance has not yet saturated to the rigidity limit -1/2. So the
        claim above should be read as &ldquo;safe at L &ge; 120, fails at L in {'{30, 60}'}&rdquo;,
        not as holding across the whole displayed window.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96721
        viz-data (values reused verbatim from imp-96695). {IMP96721_HONEST_BANNER}
      </div>
    </div>
  );
}
