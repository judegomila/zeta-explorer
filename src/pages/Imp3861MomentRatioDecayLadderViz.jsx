import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3861_DECAY_LADDER,
  IMP3861_REDUCED_FACTOR,
  IMP3861_CROSSING_LO_N,
  IMP3861_CROSSING_HI_N,
} from '../data/imp-3861-moment-ratio-decay-ladder-viz-data.js';

const N_MIN = 6;
const N_MAX = 80;

function DecayLadderLogLogChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMin = -3;
  const yMax = -0.5;

  const xS = (n) => padL + ((Math.log(n) - Math.log(N_MIN)) / (Math.log(N_MAX) - Math.log(N_MIN))) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const linePath = (key) =>
    IMP3861_DECAY_LADDER.map(
      (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r[key]).toFixed(2),
    ).join(' ');

  const yTicks = [1e-1, 1e-2, 1e-3];
  const xTicks = [6, 10, 20, 40, 80];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {/* REJECTED: slow 16/(ln n)^2 law, normalized to agree with eps_n at n=6 */}
      <path d={linePath('lawSlow')} fill="none" stroke="#f87171" strokeWidth={1.6} strokeDasharray="2,3" />
      {/* REJECTED: c/n law, normalized to agree with eps_n at n=6 */}
      <path d={linePath('lawInvN')} fill="none" stroke="#fbbf24" strokeWidth={1.6} strokeDasharray="6,3" />
      {/* Laplace-variance order 1/(n(1+4 tau*(n))) -- tracks eps_n closely, drifting apart slightly */}
      <path d={linePath('lawLaplace')} fill="none" stroke="#a78bfa" strokeWidth={1.8} strokeDasharray="1,4" />

      {/* Measured eps_n = Q_n/tau*(n)^2 - 1 */}
      <path d={linePath('eps')} fill="none" stroke="#38bdf8" strokeWidth={2.6} />
      {IMP3861_DECAY_LADDER.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.eps)} r={3} fill="#38bdf8" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        eps_n (log scale)
      </text>
    </svg>
  );
}

function ReducedFactorChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = 0.4;
  const yMax = 2.4;

  const xS = (n) => padL + ((n - N_MIN) / (N_MAX - N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP3861_REDUCED_FACTOR.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.reduced).toFixed(2),
  ).join(' ');

  const yTicks = [0.5, 1.0, 1.5, 2.0];
  const xTicks = [6, 20, 40, 60, 80];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke="#f472b6" strokeWidth={1.2} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(1) - 5} textAnchor="end" fill="#f9a8d4" fontSize={8.5}>
        reduced factor = 1
      </text>

      <path d={path} fill="none" stroke="#34d399" strokeWidth={2.4} />
      {IMP3861_REDUCED_FACTOR.map((r) => (
        <circle
          key={r.n}
          cx={xS(r.n)}
          cy={yS(r.reduced)}
          r={3.5}
          fill={r.n === IMP3861_CROSSING_LO_N || r.n === IMP3861_CROSSING_HI_N ? '#f472b6' : '#34d399'}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        eps_n * n * (1+4 tau*)
      </text>
    </svg>
  );
}

export default function Imp3861MomentRatioDecayLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Moment-Ratio Correction Decay Ladder eps_n = Q_n/tau*(n)^2 - 1 (imp-3735 / imp-3861)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3735 measured the subleading moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1
        (Q_n = M_(n+2)/M_n, tau*(n) solving n = 4&pi; tau* e<sup>4 tau*</sup>) across n = 6..80 on
        a converged de Bruijn-Newman moment ladder, and tested three candidate decay laws. Both
        simple laws are REJECTED: eps_n does not fall like the slow 1/tau*<sup>2</sup> &sim;
        16/(ln n)<sup>2</sup>, nor like c/n. The decay instead matches the Laplace-variance order
        1/(n(1+4 tau*(n))) &sim; 4/(n ln n), the leading estimate from the moment integrand's
        saddle-point curvature.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        eps_n (solid) vs the three candidate laws on a log-log axis, all normalized to agree at
        n=6: REJECTED slow 16/(ln n)<sup>2</sup> (red dash), REJECTED c/n (amber dash), and the
        Laplace-variance order 1/(n(1+4 tau*)) (violet dots)
      </p>
      <DecayLadderLogLogChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        The reduced factor eps_n * n * (1+4 tau*(n)) drifting THROUGH 1 between n=
        {IMP3861_CROSSING_LO_N} and n={IMP3861_CROSSING_HI_N} (pink markers): the exact eps_n falls
        slightly FASTER than the leading Laplace-variance estimate at large n
      </p>
      <ReducedFactorChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart normalizes
        all three curves to agree with the measured eps_n at n=6, so it is the DIVERGING SHAPE
        across n=6..80 -- not the absolute scale -- that rejects the two simple laws. The slow
        16/(ln n)<sup>2</sup> law flattens far above the measured points by n=80, and the c/n law
        falls far below them; only the Laplace-variance curve 1/(n(1+4 tau*)) tracks eps_n
        closely across the full range. The bottom chart isolates that near-tracking as the exact
        reduced factor eps_n * n * (1+4 tau*(n)), which is close to 1 throughout but drifts from
        just above 1 (2.06 at n=10) to below 1 (0.57 at n=80), crossing 1 near n~49 -- the local
        decay exponent p(n) = -d ln eps_n/d ln n grows without bound (super-polynomial), so no
        single power law describes the tail exactly.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This pins the large-n decay order of a
        subleading moment-ratio correction that feeds the imp-3713/imp-3731 exact-saddle-ratio
        crossing model; mass-feasibility is necessary-but-not-sufficient and the operator-level
        K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched. Platt-Trudgian &Lambda;
        &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
