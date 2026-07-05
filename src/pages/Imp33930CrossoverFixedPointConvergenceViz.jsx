import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33760_ITERATION_TRAJECTORY,
  IMP33760_CONVERGENCE_ERROR,
  IMP33760_LANDMARK_MARKERS,
  IMP33760_CAVEAT_BANNER,
} from '../data/imp-33760-crossover-fixed-point-convergence-viz-data.js';

const FLOOR_REL_ERROR = 1e-16; // display floor for the k>=5 exact-float-match rows (log axis can't plot 0)

function TrajectoryChart() {
  const svgW = 720;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const svgH = 260;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 0;
  const kMax = 8;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const nMin = 0.9e9;
  const nMax = 3.35e9;
  const yS = (n) => padT + cH - ((n - nMin) / (nMax - nMin)) * cH;

  const points = IMP33760_ITERATION_TRAJECTORY.map((r) => `${xS(r.k)},${yS(r.N)}`).join(' ');
  const nCross = IMP33760_LANDMARK_MARKERS.N_cross_closed_form;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {[1.0e9, 1.5e9, 2.0e9, 2.5e9, 3.0e9, 3.35e9].map((t) => (
        <g key={'yt' + t}>
          <line x1={padL - 4} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {(t / 1e9).toFixed(2)}e9
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(nCross)}
        x2={padL + cW}
        y2={yS(nCross)}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + 6} y={yS(nCross) - 6} fill="#f87171" fontSize={9}>
        N_cross closed-form {nCross.toExponential(4)}
      </text>

      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH - 4} x2={xS(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        Banach iteration step k
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        N_k
      </text>

      <polyline points={points} fill="none" stroke="#a78bfa" strokeWidth={1.75} />
      {IMP33760_ITERATION_TRAJECTORY.map((r) => (
        <circle key={'pt' + r.k} cx={xS(r.k)} cy={yS(r.N)} r={2.75} fill="#c4b5fd" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
    </svg>
  );
}

function ConvergenceErrorChart() {
  const svgW = 720;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const svgH = 260;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const kMin = 0;
  const kMax = 8;
  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;

  const logMin = -16;
  const logMax = 0;
  const yS = (relError) => {
    const v = Math.max(relError, FLOOR_REL_ERROR);
    const logV = Math.log10(v);
    return padT + cH - ((logV - logMin) / (logMax - logMin)) * cH;
  };

  const rows = IMP33760_CONVERGENCE_ERROR;
  const points = rows.map((r) => `${xS(r.k)},${yS(r.relError)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {[0, -2, -4, -6, -8, -10, -12, -14, -16].map((e) => (
        <g key={'yt' + e}>
          <line x1={padL - 4} y1={yS(10 ** e)} x2={padL + cW} y2={yS(10 ** e)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yS(10 ** e) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {'10^' + e}
          </text>
        </g>
      ))}

      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
        <g key={'xt' + k}>
          <line x1={xS(k)} y1={padT + cH - 4} x2={xS(k)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        Banach iteration step k
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        |N_k - N_cross| / N_cross
      </text>

      <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth={1.75} />
      {rows.map((r) => (
        <circle
          key={'pt' + r.k}
          cx={xS(r.k)}
          cy={yS(r.relError)}
          r={2.75}
          fill={r.relError === 0 ? '#4ade80' : '#7dd3fc'}
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp33930CrossoverFixedPointConvergenceViz() {
  const { N_cross_closed_form, N_half_empirical, contractionFactor, relOffsetPct } = IMP33760_LANDMARK_MARKERS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover Fixed-Point Convergence (imp-33760 / imp-33723)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33760 records the Banach fixed-point iteration N_k = K &middot; log&nbsp;T0(N_{'{k-1}'})
        that re-derives the imp-3444 crossover N_cross without bisection: seeded from a coarse 1e9
        guess, the trajectory reaches floating-point convergence in about 5 steps (contraction
        factor |g&prime;(N_cross)| &asymp; {contractionFactor}). This is the first routed viz page
        for that module -- none of the imp-33759 sigma-decay cohort had a dedicated page before it.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        N_k trajectory vs iteration step k
      </p>
      <TrajectoryChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        relative error to N_cross vs iteration step k, log axis (green: exact float match)
      </p>
      <ConvergenceErrorChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N_k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>relError</th>
          </tr>
        </thead>
        <tbody>
          {IMP33760_ITERATION_TRAJECTORY.map((r, i) => (
            <tr key={r.k} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.k}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {IMP33760_CONVERGENCE_ERROR[i].relError.toExponential ? IMP33760_CONVERGENCE_ERROR[i].relError.toExponential(4) : IMP33760_CONVERGENCE_ERROR[i].relError}
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
          fontSize: '0.85rem',
          color: '#cbd5e1',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Landmark comparison:</strong> the converged closed-form
        crossover N_cross = {N_cross_closed_form.toExponential(4)} sits about {relOffsetPct}% above the
        imp-33582 empirical sigma&nbsp;=&nbsp;1/2 halving landmark N_half = {N_half_empirical.toExponential(4)}.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> {IMP33760_CAVEAT_BANNER}
      </div>
    </div>
  );
}
