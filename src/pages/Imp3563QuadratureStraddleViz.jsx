import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3563_XISTAR_INF,
  IMP3563_GL_TAIL_SPREAD,
  IMP3563_CROSS_SCHEME_SPREAD,
  IMP3563_MIDPOINT_LADDER,
  IMP3563_TRAPEZOID_LADDER,
  IMP3563_TRAPEZOID_RICHARDSON_LIMIT,
  IMP3563_GAUSS_LEGENDRE_LADDER,
  IMP3563_GAUSS_LEGENDRE_LIMIT,
  IMP3563_MIDPOINT_ABS_ERROR,
  IMP3563_TRAPEZOID_ABS_ERROR,
  IMP3563_GAUSS_LEGENDRE_ABS_ERROR,
} from '../data/imp-3563-xistar-quadrature-straddle-viz-data.js';

const RUNG_COUNT = 5;
const COLORS = { midpoint: '#3b82f6', trapezoid: '#dc2626', gl: '#10b981', limit: '#94a3b8' };

function StraddleChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMin = 12.020;
  const yMax = 12.092;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));
  const xS = (i) => padL + (i / (RUNG_COUNT - 1)) * cW;

  const yLimit = yS(IMP3563_XISTAR_INF);
  const yTicks = [12.02, 12.04, 12.06, 12.08];

  const linePath = (ladder) =>
    ladder.map((c, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(c.xiStar).toFixed(2)).join(' ');

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

      <line x1={padL} y1={yLimit} x2={padL + cW} y2={yLimit} stroke={COLORS.limit} strokeWidth={1} strokeDasharray="3,3" />
      <text x={padL + cW - 4} y={yLimit - 5} textAnchor="end" fill="#94a3b8" fontSize={8.5}>
        xi*_inf = {IMP3563_XISTAR_INF}
      </text>

      <path d={linePath(IMP3563_MIDPOINT_LADDER)} fill="none" stroke={COLORS.midpoint} strokeWidth={2} />
      {IMP3563_MIDPOINT_LADDER.map((c, i) => (
        <circle key={'m' + i} cx={xS(i)} cy={yS(c.xiStar)} r={3.5} fill={COLORS.midpoint} />
      ))}

      <path d={linePath(IMP3563_TRAPEZOID_LADDER)} fill="none" stroke={COLORS.trapezoid} strokeWidth={2} strokeDasharray="5,3" />
      {IMP3563_TRAPEZOID_LADDER.map((c, i) => (
        <circle key={'t' + i} cx={xS(i)} cy={yS(c.xiStar)} r={3.5} fill={COLORS.trapezoid} />
      ))}

      <path d={linePath(IMP3563_GAUSS_LEGENDRE_LADDER)} fill="none" stroke={COLORS.gl} strokeWidth={2.4} />
      {IMP3563_GAUSS_LEGENDRE_LADDER.map((c, i) => (
        <circle key={'g' + i} cx={xS(i)} cy={yS(c.xiStar)} r={4} fill={COLORS.gl} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {Array.from({ length: RUNG_COUNT }, (_, i) => (
        <g key={'x' + i}>
          <line x1={xS(i)} y1={padT + cH} x2={xS(i)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {IMP3563_GAUSS_LEGENDRE_LADDER[i].N}
          </text>
          <text x={xS(i)} y={padT + cH + 27} textAnchor="middle" fill="#475569" fontSize={7.5}>
            ({IMP3563_MIDPOINT_LADDER[i].N})
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 40} textAnchor="middle" fill="#64748b" fontSize={10}>
        rung: Gauss-Legendre N (midpoint/trapezoid N)
      </text>

      <g fontSize={9}>
        <circle cx={padL + 6} cy={padT + 12} r={4} fill={COLORS.midpoint} />
        <text x={padL + 14} y={padT + 15} fill="#93c5fd">midpoint (imp-3523, falls from above)</text>
        <circle cx={padL + 6} cy={padT + 26} r={4} fill={COLORS.trapezoid} />
        <text x={padL + 14} y={padT + 29} fill="#fca5a5">trapezoid (imp-3548, rises from below)</text>
        <circle cx={padL + 6} cy={padT + 40} r={4} fill={COLORS.gl} />
        <text x={padL + 14} y={padT + 43} fill="#6ee7b7">Gauss-Legendre (imp-3548, no extrapolation)</text>
      </g>
    </svg>
  );
}

function ConvergenceChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMin = -11;
  const yMax = -1;
  const xS = (i) => padL + (i / (RUNG_COUNT - 1)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const yTicks = [1e-2, 1e-4, 1e-6, 1e-8, 1e-10];

  const linePath = (errs) => errs.map((e, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(e).toFixed(2)).join(' ');

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

      <path d={linePath(IMP3563_MIDPOINT_ABS_ERROR)} fill="none" stroke={COLORS.midpoint} strokeWidth={2} />
      {IMP3563_MIDPOINT_ABS_ERROR.map((e, i) => (
        <circle key={'m' + i} cx={xS(i)} cy={yS(e)} r={3.5} fill={COLORS.midpoint} />
      ))}

      <path d={linePath(IMP3563_TRAPEZOID_ABS_ERROR)} fill="none" stroke={COLORS.trapezoid} strokeWidth={2} strokeDasharray="5,3" />
      {IMP3563_TRAPEZOID_ABS_ERROR.map((e, i) => (
        <circle key={'t' + i} cx={xS(i)} cy={yS(e)} r={3.5} fill={COLORS.trapezoid} />
      ))}

      <path d={linePath(IMP3563_GAUSS_LEGENDRE_ABS_ERROR)} fill="none" stroke={COLORS.gl} strokeWidth={2.4} />
      {IMP3563_GAUSS_LEGENDRE_ABS_ERROR.map((e, i) => (
        <circle key={'g' + i} cx={xS(i)} cy={yS(e)} r={4} fill={COLORS.gl} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {Array.from({ length: RUNG_COUNT }, (_, i) => (
        <g key={'x' + i}>
          <line x1={xS(i)} y1={padT + cH} x2={xS(i)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            rung {i}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        rung index (each ladder doubles its own N per rung)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        |xiStar - xi*_inf| (log scale)
      </text>
    </svg>
  );
}

export default function Imp3563QuadratureStraddleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Two-Sided Quadrature Straddle of xi*_inf (imp-3548 / imp-3563)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Three independent quadrature rules locate the imp-3483/imp-3523 PSD peak-slope maximizer
        xi*_inf &sim; {IMP3563_XISTAR_INF} from three different angles. The imp-3523 MIDPOINT
        ladder falls to the limit from ABOVE (12.0870 &rarr; 12.0668) while the imp-3548 TRAPEZOID
        ladder -- an opposite-sign Euler-Maclaurin error constant -- rises to it from BELOW
        (12.0265 &rarr; 12.0665), bracketing xi*_inf from opposite sides. The imp-3548
        GAUSS-LEGENDRE rule (order-10 per panel) needs no Richardson model at all: it already
        lands on {IMP3563_GAUSS_LEGENDRE_LIMIT.toFixed(9)} at N = 90 and stays bit-stable (spread
        &lt; {IMP3563_GL_TAIL_SPREAD.toExponential(1)}) through N = 720.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        xi* ladder value per rung: midpoint falls, trapezoid rises, Gauss-Legendre is flat from the start
      </p>
      <StraddleChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Convergence rate: |xiStar - xi*_inf| per rung (log scale)
      </p>
      <ConvergenceChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. The trapezoid Richardson extrapolant
        ({IMP3563_TRAPEZOID_RICHARDSON_LIMIT.toFixed(9)}) and the Gauss-Legendre limit agree to
        {' '}{IMP3563_CROSS_SCHEME_SPREAD.toExponential(1)}, and both agree with the imp-3523
        headline to inside its conservative 1e-6 residual band -- confirming xi*_inf is
        quadrature-scheme-INVARIANT, not a midpoint-extrapolation-model artifact. It does not
        give xi* a closed form (the imp-3470 stationarity equation stays transcendental) and does
        not construct the missing imp-3066 K_a &ge; 0 sign-positivity residual, which remains
        untouched. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
