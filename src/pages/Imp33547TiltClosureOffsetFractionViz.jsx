import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33317_RUNGS,
  IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N,
  IMP33317_OFFSET_FRAC_AT_120,
  IMP33317_RESIDUAL_CROSSING_GAP,
  IMP33317_RECON_CLOSES_FRACTION,
} from '../data/imp-33317-tilt-closure-crossing-gap.js';

function OffsetFractionChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const nMin = 10;
  const nMax = 120;
  const yMin = 0.92;
  const yMax = 1.004;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const yTicks = [0.92, 0.94, 0.96, 0.98, 1.0];

  const path = IMP33317_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.offsetFractionOfGap).toFixed(2),
  ).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5,3" />
      <text x={padL + 4} y={yS(1) - 5} fill="#fbbf24" fontSize={8.5}>
        offsetFractionOfGap = 1
      </text>

      <line
        x1={xS(IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N)}
        y1={padT}
        x2={xS(IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N)}
        y2={padT + cH}
        stroke="#f472b6"
        strokeWidth={1}
        strokeDasharray="2,3"
        opacity={0.8}
      />
      <text
        x={xS(IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N)}
        y={padT - 8}
        textAnchor="middle"
        fill="#f472b6"
        fontSize={8.5}
      >
        crosses 1 at n&asymp;{IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N.toFixed(1)}
      </text>

      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {IMP33317_RUNGS.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.offsetFractionOfGap)} r={2.5} fill="#38bdf8" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[10, 20, 40, 60, 80, 100, 120].map((n) => (
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
    </svg>
  );
}

function SecondOrderResidualChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const nMin = 10;
  const nMax = 120;
  const yMin = -0.01;
  const yMax = 0.05;

  const xS = (n) => padL + ((n - nMin) / (nMax - nMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const yTicks = [-0.01, 0, 0.01, 0.02, 0.03, 0.04];

  const path = IMP33317_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.secondOrderResidual).toFixed(2),
  ).join(' ');

  const zeroCrossN = (() => {
    for (let i = 1; i < IMP33317_RUNGS.length; i++) {
      const a = IMP33317_RUNGS[i - 1];
      const b = IMP33317_RUNGS[i];
      if (a.secondOrderResidual > 0 && b.secondOrderResidual < 0) {
        const t = a.secondOrderResidual / (a.secondOrderResidual - b.secondOrderResidual);
        return a.n + t * (b.n - a.n);
      }
    }
    return null;
  })();

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5,3" />

      {zeroCrossN != null && (
        <>
          <line
            x1={xS(zeroCrossN)}
            y1={padT}
            x2={xS(zeroCrossN)}
            y2={padT + cH}
            stroke="#f472b6"
            strokeWidth={1}
            strokeDasharray="2,3"
            opacity={0.8}
          />
          <text x={xS(zeroCrossN)} y={padT - 8} textAnchor="middle" fill="#f472b6" fontSize={8.5}>
            sign flip n&asymp;{zeroCrossN.toFixed(0)}
          </text>
        </>
      )}

      <path d={path} fill="none" stroke="#34d399" strokeWidth={2} />
      {IMP33317_RUNGS.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.secondOrderResidual)} r={2.5} fill="#34d399" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {[10, 20, 40, 60, 80, 100, 120].map((n) => (
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
    </svg>
  );
}

export default function Imp33547TiltClosureOffsetFractionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Moment-Tilt Crossing-Gap Closure: offsetFractionOfGap (imp-33317)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        offsetFractionOfGap = delta_n / (L_n^true - L_n^model), the fraction of the imp-3871/imp-3893
        model-fidelity crossing gap closed by the imp-3893 moment tilt alone, does NOT asymptote to 1
        from below across n=10..120 -- it CROSSES the 1.0 line at n &asymp;{' '}
        {IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N.toFixed(1)} and mildly overshoots, reaching{' '}
        {IMP33317_OFFSET_FRAC_AT_120.toFixed(5)} at n=120.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        offsetFractionOfGap across n=10..120: crosses 1.0 near n&asymp;74, then overshoots
      </p>
      <OffsetFractionChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        The second-order residual (L_n^true - L_n^model) - delta_n flips sign near the same n&asymp;74,
        driving the overshoot
      </p>
      <SecondOrderResidualChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> the top chart shows
        offsetFractionOfGap climbing from 0.938 at n=10 through 1.0 at n&asymp;
        {IMP33317_OFFSET_FRAC_CROSSES_ONE_AT_N.toFixed(1)}, then overshooting to{' '}
        {IMP33317_OFFSET_FRAC_AT_120.toFixed(5)} by n=120 -- the tilt offset delta_n first
        under-accounts, then over-accounts, for the L_n gap. The bottom chart shows why: the
        second-order residual left over after subtracting the tilt starts positive (+4.29e-2 at
        n=10) and flips sign near the same crossing point, ending negative (-4.92e-4 at n=120).
        Despite this sign flip, reconstructing the L_n=1 crossing from the surrogate plus the tilt
        offset alone (dropping the second-order term) still lands within{' '}
        {IMP33317_RESIDUAL_CROSSING_GAP.toFixed(4)} units of the true crossing -- the tilt accounts
        for {(IMP33317_RECON_CLOSES_FRACTION * 100).toFixed(2)}% of the full 30.2-unit shift, leaving
        only a small arithmetic-floor residual.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/fit only, at the
        RH-equivalent scale class. This is a closure extrapolation of a fixed-weight moment-ratio
        drift decomposition; it establishes no operator positivity. Mass-feasibility is
        necessary-but-not-sufficient, and the operator-level K_a &ge; 0 sign-positivity (imp-3066)
        remains untouched. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA. No QED.
      </div>
    </div>
  );
}
