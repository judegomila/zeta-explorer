import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33549_LADDER,
  IMP33549_INTERIOR_MAX,
  IMP33549_OVERSHOOT,
} from '../data/imp-33549-sigma-fartail-vs-interior-max-viz-data.js';

const COLORS = { full: '#10b981', farTail: '#a855f7', peak: '#f472b6' };

function SigmaFarTailVsInteriorMaxChart() {
  const svgW = 660;
  const padL = 52;
  const padR = 24;
  const padT = 24;
  const padB = 64;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const logNMin = 4;
  const logNMax = 12;
  const yMin = 0;
  const yMax = 1;

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const fullPath = IMP33549_LADDER.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.sigma_full).toFixed(2)
  ).join(' ');
  const farTailPath = IMP33549_LADDER.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r.sigma_farTail).toFixed(2)
  ).join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];
  const xTickNs = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line
        x1={xS(IMP33549_INTERIOR_MAX.N)}
        y1={padT}
        x2={xS(IMP33549_INTERIOR_MAX.N)}
        y2={padT + cH}
        stroke={COLORS.peak}
        strokeWidth={1.2}
        strokeDasharray="4,2"
      />

      <path d={farTailPath} fill="none" stroke={COLORS.farTail} strokeWidth={2} strokeDasharray="6,3" />
      <path d={fullPath} fill="none" stroke={COLORS.full} strokeWidth={2} />

      <circle
        cx={xS(IMP33549_INTERIOR_MAX.N)}
        cy={yS(IMP33549_INTERIOR_MAX.sigma)}
        r={5}
        fill="none"
        stroke={COLORS.peak}
        strokeWidth={2}
      />
      <circle
        cx={xS(IMP33549_OVERSHOOT.N)}
        cy={yS(IMP33549_OVERSHOOT.sigma_farTail)}
        r={4}
        fill={COLORS.farTail}
      />
      <line
        x1={xS(IMP33549_OVERSHOOT.N)}
        y1={yS(IMP33549_OVERSHOOT.sigma_full)}
        x2={xS(IMP33549_OVERSHOOT.N)}
        y2={yS(IMP33549_OVERSHOOT.sigma_farTail)}
        stroke="#f9a8d4"
        strokeWidth={1.5}
      />
      <text x={xS(IMP33549_INTERIOR_MAX.N) + 6} y={yS(0.86)} fill="#f9a8d4" fontSize={9}>
        peak N~9.22e5, overshoot ~3.0e-2
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
        N (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        sigma(N)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={COLORS.full} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill="#6ee7b7">sigma_full (imp-3406 U-shape)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={COLORS.farTail} strokeWidth={2} strokeDasharray="6,3" />
        <text x={padL + 14} y={padT + 29} fill="#c084fc">sigma_ft (imp-33291 far-tail law)</text>
      </g>
    </svg>
  );
}

export default function Imp33549SigmaFarTailVsInteriorMaxViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Far-Tail Law vs Interior-Max Reconciliation (imp-33315 / imp-33549)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33291 confirmed the far-tail conditional share sigma_ft(N) = E_coll/(E_trunc + E_coll)
        &sim; (C_C/E_trunc) sqrt(log T0/N) as a JOINT (-1/2, +1/2) power law in (ln N, ln log T0);
        imp-3406 separately pinned the full sigma(N) interior MAXIMUM at N &sim; 9.22e5
        (sigma_max &sim; 0.9494). imp-33315 reconciled the two and found them DISJOINT: the
        far-tail law is monotone decreasing (no interior maximum) and, forced to the true peak,
        overshoots by &sim;3.0e-2 &mdash; a residual carried by the E_flow term the far-tail law
        drops, which at the peak exceeds the E_trunc floor.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        sigma_full (imp-3406 U-shape) vs sigma_ft (imp-33291 far-tail law) across N = 1e4 .. 1e12
      </p>
      <SigmaFarTailVsInteriorMaxChart />

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
        the full sigma(N), which rises from the far pre-crossover tail, peaks at N &sim; 9.22e5
        (sigma_max &sim; 0.9494, marked), then falls monotonically past the imp-3444 crossover
        N_cross &sim; 3.28e9. The dashed purple curve is the imp-33291 far-tail law sigma_ft(N),
        which is monotone DECREASING everywhere on this range &mdash; it has no interior maximum, so
        it cannot reproduce the peak location. The two curves converge far past the crossover
        (agreeing to &lt;1e-3 by N = 1e12) but at the peak the far-tail law overshoots the true
        value by &sim;3.0e-2, &sim;3.55 decades off its valid regime.
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
        &mdash; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic. C_C is GUE-conditional per imp-486; changes no bound; imp-3066 K_a &ge; 0
        remains untouched; no positivity, no bridge closure, no RH claim. No RH verdict, NO QED.
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp33628-etrunc-ecoll-crossover" style={{ color: '#7c3aed' }}>
          E_trunc / E_coll Post-Peak Crossover Ladder (imp-33602 / imp-33628)
        </Link>
      </div>
    </div>
  );
}
