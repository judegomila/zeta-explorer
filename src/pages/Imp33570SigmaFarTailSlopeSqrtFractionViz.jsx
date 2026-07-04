import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33570_FRACTION_SERIES,
  IMP33570_LANDMARKS,
} from '../data/imp-33570-sigma-fartail-slope-sqrt-fraction-viz-data.js';

const COLORS = { slope: '#10b981', sqrt: '#a855f7', peak: '#f472b6' };

function SlopeSqrtFractionChart() {
  const svgW = 660;
  const padL = 52;
  const padR = 24;
  const padT = 24;
  const padB = 64;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const logNMin = 5.9;
  const logNMax = 9.6;
  const yMin = -0.15;
  const yMax = 1.15;

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const slopePath = IMP33570_FRACTION_SERIES.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N_ref).toFixed(1) + ',' + yS(r.fraction_slope).toFixed(2)
  ).join(' ');
  const sqrtPath = IMP33570_FRACTION_SERIES.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N_ref).toFixed(1) + ',' + yS(r.fraction_sqrt).toFixed(2)
  ).join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];
  const xTickNs = [1e6, 1e7, 1e8, 1e9];

  const peak = IMP33570_FRACTION_SERIES[0];
  const topRung = IMP33570_FRACTION_SERIES[IMP33570_FRACTION_SERIES.length - 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {(v * 100).toFixed(0)}%
          </text>
        </g>
      ))}
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke="#334155" strokeWidth={1} />

      <line
        x1={xS(IMP33570_LANDMARKS.N_max)}
        y1={padT}
        x2={xS(IMP33570_LANDMARKS.N_max)}
        y2={padT + cH}
        stroke={COLORS.peak}
        strokeWidth={1.2}
        strokeDasharray="4,2"
      />

      <path d={sqrtPath} fill="none" stroke={COLORS.sqrt} strokeWidth={2} strokeDasharray="6,3" />
      <path d={slopePath} fill="none" stroke={COLORS.slope} strokeWidth={2} />

      {IMP33570_FRACTION_SERIES.map((r) => (
        <g key={r.rung}>
          <circle cx={xS(r.N_ref)} cy={yS(r.fraction_slope)} r={2.5} fill={COLORS.slope} />
          <circle cx={xS(r.N_ref)} cy={yS(r.fraction_sqrt)} r={2.5} fill={COLORS.sqrt} />
        </g>
      ))}

      <text x={xS(peak.N_ref) + 6} y={yS(1.12)} fill="#f9a8d4" fontSize={9}>
        peak N~9.22e5, ~{peak.chord_ratio.toFixed(1)}:1
      </text>
      <text x={xS(topRung.N_ref) - 6} y={yS(1.12)} textAnchor="end" fill="#f9a8d4" fontSize={9}>
        ~{topRung.chord_ratio.toFixed(1)}:1
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xTickNs.map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8}>
            {N.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        N_ref (log scale, imp-3406 peak &rarr; imp-3444 crossover)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        fraction of Delta S
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.slope} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill="#6ee7b7">Delta S_slope fraction (-1/2 ln N power)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={COLORS.sqrt} strokeWidth={2} strokeDasharray="6,3" />
        <text x={padL + 14} y={padT + 29} fill="#c084fc">Delta S_sqrt fraction (+1/2 sqrt(log T0) power)</text>
      </g>
    </svg>
  );
}

export default function Imp33570SigmaFarTailSlopeSqrtFractionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Far-Tail Two-Power Fraction Split (imp-33540 / imp-33553 / imp-33570)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33540 decomposed the imp-33291 far-tail two-power log-factor S(N) = -(1/2) ln N +
        (1/2) ln(log T0) across the 3.55-decade off-regime span from the imp-3444 crossover
        (N &sim; 3.28e9) back to the imp-3406 interior max (N &sim; 9.22e5), finding the -1/2
        ln N slope carries &sim;+4.089 (&sim;106%) of Delta S while the +1/2 sqrt(log T0)
        coefficient carries only &sim;-0.228 (&sim;-6%, opposite sign) &mdash; an &sim;18:1
        dominance. imp-33553 extended that single-point split to a reference-N ladder and found
        the dominance does NOT relax toward parity moving toward the crossover; it INTENSIFIES,
        rising to &sim;21.5:1. This page plots the two fractions across that ladder.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Delta S_slope vs Delta S_sqrt as fractions of Delta S, across the off-regime span
      </p>
      <SlopeSqrtFractionChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the solid green curve is
        the -1/2 ln N slope&apos;s fraction of Delta S, which stays pinned just above 100% across
        the whole span (&sim;105.9% at the peak, marked, falling only to &sim;104.9% near the
        crossover). The dashed purple curve is the +1/2 sqrt(log T0) coefficient&apos;s fraction,
        an opposite-sign sliver that shrinks in magnitude from &sim;-5.9% to &sim;-4.9% moving
        toward the crossover. The two annotated ratios (&sim;18.0:1 at the peak, &sim;21.5:1 at
        the top rung) show the slope:sqrt dominance intensifying, not relaxing toward parity.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization only
        &mdash; the underlying component model is the inherited imp-3220/imp-3406 extrapolation,
        NOT a rigorous asymptotic. C_C is GUE-conditional per imp-486; changes no bound; imp-3066
        K_a &ge; 0 remains untouched; no positivity, no bridge closure, no RH claim. No RH verdict,
        NO QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33549-sigma-fartail-vs-interior-max" style={{ color: '#7c3aed' }}>
          Sigma(N) Far-Tail Law vs Interior-Max Reconciliation (imp-33315 / imp-33549)
        </Link>
      </div>
    </div>
  );
}
