import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97206_GRID,
  IMP97206_STAGE1_LAM_N_INF,
  IMP97206_PLATEAU_MEAN,
  IMP97206_PLATEAU_STD,
  IMP97206_JOINT_INTERVAL,
  IMP97206_VERDICT,
} from '../data/imp-97206-krein-csharp-coupled-nt-jointlimit.js';

// imp-97367: first consumer of the imp-97206 coupled N,T grid + plateau arrays.
// Panel 1 shows the fixed-T lines descending in N but flattening as T grows
// (the N-spread collapse 0.0732 -> 0.0094). Panel 2 shows the inner T->inf
// extrapolant lam(N,inf) settling on a flat positive plateau over the
// reliable band N=84..132, discarding the degenerate N=52,68 fits.
const T_COLORS = Object.freeze({
  800: '#f87171',
  1600: '#facc15',
  2400: '#38bdf8',
  3200: '#4ade80',
});

const ALL_NS = [52, 68, 84, 100, 116, 132];

function GridPanel() {
  const svgW = 720;
  const svgH = 300;
  const padL = 48;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allVals = IMP97206_GRID.flatMap((row) => ALL_NS.map((n) => row.byN[n]));
  const minY = Math.min(...allVals) - 0.005;
  const maxY = Math.max(...allVals) + 0.005;
  const minX = Math.min(...ALL_NS);
  const maxX = Math.max(...ALL_NS);

  const xOf = (n) => padL + ((n - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {[minY, (minY + maxY) / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      {ALL_NS.map((n) => (
        <text key={`x${n}`} x={xOf(n)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
          {n}
        </text>
      ))}
      {IMP97206_GRID.map((row) => (
        <g key={row.T}>
          <polyline
            points={ALL_NS.map((n) => `${xOf(n)},${yOf(row.byN[n])}`).join(' ')}
            fill="none"
            stroke={T_COLORS[row.T]}
            strokeWidth={1.9}
          />
          {ALL_NS.map((n) => (
            <circle key={`${row.T}-${n}`} cx={xOf(n)} cy={yOf(row.byN[n])} r={2.4} fill={T_COLORS[row.T]} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        N (basis dimension, 52..132)
      </text>
    </svg>
  );
}

function PlateauPanel() {
  const svgW = 720;
  const svgH = 260;
  const padL = 48;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rows = IMP97206_STAGE1_LAM_N_INF;
  const vals = rows.map((r) => r.lamNinf);
  const minY = Math.min(...vals) - 0.01;
  const maxY = Math.max(...vals) + 0.01;
  const minX = Math.min(...rows.map((r) => r.N));
  const maxX = Math.max(...rows.map((r) => r.N));

  const xOf = (n) => padL + ((n - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const bandTop = yOf(IMP97206_PLATEAU_MEAN + IMP97206_PLATEAU_STD);
  const bandBot = yOf(IMP97206_PLATEAU_MEAN - IMP97206_PLATEAU_STD);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect
        x={padL}
        y={bandTop}
        width={plotW}
        height={bandBot - bandTop}
        fill="rgba(74,222,128,0.12)"
      />
      <line
        x1={padL}
        y1={yOf(IMP97206_PLATEAU_MEAN)}
        x2={padL + plotW}
        y2={yOf(IMP97206_PLATEAU_MEAN)}
        stroke="#4ade80"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {[minY, (minY + maxY) / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      {rows.map((r) => (
        <g key={r.N}>
          <text x={xOf(r.N)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
            {r.N}
          </text>
          <circle
            cx={xOf(r.N)}
            cy={yOf(r.lamNinf)}
            r={4}
            fill={r.reliable ? '#4ade80' : '#475569'}
            stroke={r.reliable ? '#166534' : '#1e293b'}
            strokeWidth={1}
          />
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        N (filled = reliable band N&ge;84, grey = discarded degenerate fit)
      </text>
    </svg>
  );
}

export default function Imp97367KreinCsharpCoupledNTGridViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein Floor: Coupled N&times;T Grid and the T&rarr;&infin; Plateau" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> measurement only. These are
        Rayleigh-Ritz UPPER bounds on c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3, not a
        certified floor. No operator positivity established; interval-rigorous certificate reach
        stays 2a&le;{IMP97206_VERDICT.intervalRigorousReachUnchanged}; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97206 measured the 6&times;4 grid c_sharp(N,T) for N in {'{52..132}'} &times; T in{' '}
        {'{800..3200}'}. At fixed N the floor rises with T; at fixed T it descends with N, but the
        N-spread collapses from 0.0732 (T=800) to 0.0094 (T=3200) as T grows &mdash; the
        t-truncation artifact shrinking uniformly.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        c_sharp(N,T) upper bound vs N, by T
      </h3>
      <GridPanel />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.75rem' }}>
        {IMP97206_GRID.map((row) => (
          <span key={row.T} style={{ color: T_COLORS[row.T] }}>
            &#9632; T={row.T}
          </span>
        ))}
      </div>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Inner T&rarr;&infin; extrapolant lam(N,inf): the flat positive plateau
      </h3>
      <PlateauPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> once T&rarr;&infin; is
        taken first (removing the t-truncation artifact), the reliable-band lam(N,inf) (N=84..132,
        filled dots) settles on a flat plateau {IMP97206_PLATEAU_MEAN.toFixed(6)} &plusmn;{' '}
        {IMP97206_PLATEAU_STD.toFixed(6)}, slightly INCREASING (not descending) in N. The N=52,68
        fits (grey dots) are discarded &mdash; their T-convergence is too flat to fit a genuine
        power law. The joint extrapolant is ~{IMP97206_VERDICT.jointExtrapolant} (robust range [
        {IMP97206_JOINT_INTERVAL[0]}, {IMP97206_JOINT_INTERVAL[1]}]), resolving the imp-97183
        fixed-T=800 N-descent as a pure truncation artifact rather than a trend toward 0.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-97206 committed arrays verbatim (no re-solve, no new numerics). Rayleigh-Ritz upper
        bounds only; establishes no operator positivity; changes no bound; Platt-Trudgian
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
