import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3675_PAIR_SPREAD_LADDER,
  IMP3675_PAIR_TOL,
  IMP3675_N2000_LANCZOS_OVER_DENSE_RATIO,
} from '../data/imp-3675-dense-lanczos-pair-spread-crossover-viz-data.js';

const SERIES = [
  { key: 'densePair78', label: 'dense lambda_7=lambda_8 spread (Householder+QL, no Krylov)', color: '#38bdf8', dash: 'none' },
  { key: 'lanczosPair78', label: 'imp-3619 Lanczos (m=440) lambda_7=lambda_8 spread', color: '#f59e0b', dash: '4 2.5' },
];

function PairSpreadChart() {
  const svgW = 680;
  const padL = 74;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const Ns = IMP3675_PAIR_SPREAD_LADDER.map((r) => r.N);
  const allVals = IMP3675_PAIR_SPREAD_LADDER.flatMap((r) => SERIES.map((s) => r[s.key])).concat(IMP3675_PAIR_TOL);
  const logNMin = Math.log10(Ns[0]);
  const logNMax = Math.log10(Ns[Ns.length - 1]);
  const logYMin = Math.floor(Math.log10(Math.min(...allVals)));
  const logYMax = Math.ceil(Math.log10(Math.max(...allVals)));

  const xS = (N) => padL + ((Math.log10(N) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));

  const yTicks = [];
  for (let e = logYMin; e <= logYMax; e += 2) yTicks.push(Math.pow(10, e));

  const pathFor = (key) =>
    IMP3675_PAIR_SPREAD_LADDER.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.N).toFixed(1) + ',' + yS(r[key]).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(IMP3675_PAIR_TOL)} x2={padL + cW} y2={yS(IMP3675_PAIR_TOL)} stroke="#475569" strokeWidth={1} strokeDasharray="5 3" />
      <text x={padL + cW - 4} y={yS(IMP3675_PAIR_TOL) - 5} textAnchor="end" fill="#64748b" fontSize={9}>
        PAIR_TOL = 1e-14
      </text>

      {SERIES.map((s) => (
        <path key={s.key} d={pathFor(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} />
      ))}
      {IMP3675_PAIR_SPREAD_LADDER.map((r) =>
        SERIES.map((s) => (
          <circle key={s.key + r.N} cx={xS(r.N)} cy={yS(r[s.key])} r={2.6} fill={s.color} />
        )),
      )}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {Ns.map((N) => (
        <g key={'x' + N}>
          <line x1={xS(N)} y1={padT + cH} x2={xS(N)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(N)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {N}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        lambda_7=lambda_8 relative spread (log scale)
      </text>
    </svg>
  );
}

export default function Imp3675DenseLanczosPairSpreadCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Dense-vs-Lanczos Fourth-Pair Spread Crossover at N=2000 (imp-3643)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        An independent dense full-spectrum solver (Householder tridiagonalization + implicit-QL,
        no Krylov subspace) keeps the lambda_7=lambda_8 adjacent-pair spread pinned at machine
        precision through all three deep rungs, including N=2000 (1.96e-16). The imp-3619 Lanczos
        (m=440) reading tracks it closely at N=1200 and N=1600 but crosses over and degrades to
        3.99e-11 at N=2000 -- about {IMP3675_N2000_LANCZOS_OVER_DENSE_RATIO.toLocaleString()}x
        larger than the dense value there. Since the dense solver never runs Lanczos and cannot
        host a Krylov ghost, the N=2000 crossover is a reorthogonalization artifact of the finite
        m=440 depth, not a genuine near-degeneracy splitting.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        lambda_7=lambda_8 relative spread vs N: dense solver stays flat, Lanczos crosses over at N=2000
      </p>
      <PairSpreadChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {SERIES.map((s) => (
          <span key={s.key}>
            <span style={{ color: s.color }}>&#9644;</span> {s.label}
          </span>
        ))}
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> dense cross-validation only --
        confirms the imp-3619 deep-rung sigma_3 and the fourth-pair lambda_7=lambda_8 degeneracy
        against an independent solver, and identifies the N=2000 Lanczos loss as a Krylov
        reorthogonalization artifact. Does NOT construct the missing magnitude and does NOT
        attempt the imp-3066 K_a &ge; 0 positivity. RH-equivalent; Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3656-triple-skew-toeplitz-gap-ladder" style={{ color: '#7c3aed' }}>
          Triple Skew-Toeplitz Gap Ladder (imp-3656)
        </Link>
      </div>
    </div>
  );
}
