import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3927_CROSSING_ROWS,
  IMP3927_SIMPSON_INTERP,
  IMP3927_GL_INTERP,
  IMP3927_CC_INTERP,
  IMP3927_EPS_ROWS,
  IMP3927_EPS_SIGN_CHANGE_N,
  IMP3927_WELL_ROWS,
  IMP3927_CROSS_CC_GL_INTERP_DELTA,
  IMP3927_CROSS_CC_SIMPSON_INTERP_DELTA,
} from '../data/imp-3927-three-solver-crossing-viz-data.js';

const SIMPSON_COLOR = '#f472b6';
const GL_COLOR = '#38bdf8';
const CC_COLOR = '#a78bfa';

function CrossingBracketChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xMin = 214.6;
  const xMax = 216.4;
  const yMin = -8e-6;
  const yMax = 3e-6;
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const interps = [
    { v: IMP3927_SIMPSON_INTERP, color: SIMPSON_COLOR },
    { v: IMP3927_GL_INTERP, color: GL_COLOR },
    { v: IMP3927_CC_INTERP, color: CC_COLOR },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke="#334155" strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(0) - 4} textAnchor="end" fill="#7dd3fc" fontSize={8.5}>
        r_n = 0 (unity crossing)
      </text>

      {interps.map((it, i) => (
        <line
          key={'interp' + i}
          x1={xS(it.v)}
          y1={padT}
          x2={xS(it.v)}
          y2={padT + cH}
          stroke={it.color}
          strokeWidth={1}
          strokeDasharray="2,3"
          opacity={0.6}
        />
      ))}

      {IMP3927_CROSSING_ROWS.map((row) => (
        <g key={'n' + row.n}>
          <circle cx={xS(row.n)} cy={yS(row.simpsonR)} r={5} fill={SIMPSON_COLOR} />
          <circle cx={xS(row.n)} cy={yS(row.glR)} r={4} fill={GL_COLOR} />
          <circle cx={xS(row.n)} cy={yS(row.ccR)} r={2.5} fill={CC_COLOR} />
          <text x={xS(row.n)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            n={row.n}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        rung n near the crossing
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        r_n = R_n - 1
      </text>

      <g>
        <circle cx={padL + 8} cy={padT - 6} r={4} fill={SIMPSON_COLOR} />
        <text x={padL + 16} y={padT - 2} fill="#94a3b8" fontSize={9}>
          Simpson (imp-3849), n* = {IMP3927_SIMPSON_INTERP}
        </text>
        <circle cx={padL + 8} cy={padT + 10} r={4} fill={GL_COLOR} />
        <text x={padL + 16} y={padT + 14} fill="#94a3b8" fontSize={9}>
          Gauss-Legendre (imp-3868), n* = {IMP3927_GL_INTERP.toFixed(5)}
        </text>
        <circle cx={padL + 8} cy={padT + 26} r={4} fill={CC_COLOR} />
        <text x={padL + 16} y={padT + 30} fill="#94a3b8" fontSize={9}>
          Clenshaw-Curtis (imp-3895), n* = {IMP3927_CC_INTERP}
        </text>
      </g>
    </svg>
  );
}

function EpsSignChangeChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 16;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xMin = 90;
  const xMax = 310;
  const yMin = -6e-4;
  const yMax = 1.1e-3;
  const xS = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke="#334155" strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 6} y={yS(0) - 4} fill="#7dd3fc" fontSize={8.5}>
        eps_n = 0
      </text>

      <line
        x1={xS(IMP3927_EPS_SIGN_CHANGE_N)}
        y1={padT}
        x2={xS(IMP3927_EPS_SIGN_CHANGE_N)}
        y2={padT + cH}
        stroke="#fbbf24"
        strokeWidth={1}
        strokeDasharray="2,3"
        opacity={0.6}
      />
      <text x={xS(IMP3927_EPS_SIGN_CHANGE_N) + 4} y={padT + 12} fill="#fbbf24" fontSize={8.5}>
        n = {IMP3927_EPS_SIGN_CHANGE_N}
      </text>

      {(() => {
        const pts = (key) =>
          IMP3927_EPS_ROWS.map((row) => `${xS(row.n)},${yS(row[key])}`).join(' ');
        return (
          <>
            <polyline points={pts('simpsonEps')} fill="none" stroke={SIMPSON_COLOR} strokeWidth={1.5} opacity={0.7} />
            <polyline points={pts('glEps')} fill="none" stroke={GL_COLOR} strokeWidth={1.5} opacity={0.7} />
            <polyline points={pts('ccEps')} fill="none" stroke={CC_COLOR} strokeWidth={1.5} opacity={0.9} strokeDasharray="4,2" />
          </>
        );
      })()}

      {IMP3927_EPS_ROWS.map((row) => (
        <g key={'eps' + row.n}>
          <circle cx={xS(row.n)} cy={yS(row.ccEps)} r={3} fill={CC_COLOR} />
          <text x={xS(row.n)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            {row.n}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        rung n
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        eps_n = Q_n/tau*(n)^2 - 1
      </text>
    </svg>
  );
}

function WellRecoveryChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 16;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const yMin = -6.2e-4;
  const yMax = -5.5e-4;
  const xS = (i) => padL + ((i + 0.5) / IMP3927_WELL_ROWS.length) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      <polyline
        points={IMP3927_WELL_ROWS.map((row, i) => `${xS(i)},${yS(row.r)}`).join(' ')}
        fill="none"
        stroke={CC_COLOR}
        strokeWidth={1.5}
      />
      {IMP3927_WELL_ROWS.map((row, i) => (
        <g key={'well' + row.n}>
          <circle cx={xS(i)} cy={yS(row.r)} r={5} fill={CC_COLOR} />
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={9}>
            n={row.n}
          </text>
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        rung n (deep sub-unity well, recovering toward 1)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        r_n = R_n - 1 (Clenshaw-Curtis)
      </text>
    </svg>
  );
}

export default function Imp3927ThreeSolverCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Three-Solver Saddle-Crossing Cross-Check: Simpson, Gauss-Legendre and Clenshaw-Curtis Agree to ~1e-6 (imp-3895/imp-3927)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3895 re-derived the imp-3849 / imp-3868 exact-saddle ratio crossing n* = 215.23 through
        a THIRD, structurally distinct quadrature rule -- composite Clenshaw-Curtis (Chebyshev-extrema
        nodes) -- alongside composite Simpson (imp-3849, equispaced Newton-Cotes) and 5-point
        Gauss-Legendre (imp-3868, interior Gauss abscissae). The three rules share no node placement,
        weight pattern or error mechanism, so their agreement pins the crossing, the eps_n sign-change
        and the sub-unity well to the de Bruijn-Newman kernel, not to any single rule family's artifact.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        r_n = R_n - 1 bracketing n* = 215.23 -- Simpson vs Gauss-Legendre vs Clenshaw-Curtis
      </p>
      <CrossingBracketChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        eps_n = Q_n/tau*(n)^2 - 1 sign-change at n = 149, all three solvers overlaid
      </p>
      <EpsSignChangeChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        sub-unity well: r_n recovering toward 1 from n = 500 to n = 620 (Clenshaw-Curtis path)
      </p>
      <WellRecoveryChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> the top chart shows all
        three solvers' r_n crossing from positive to negative between n = 215 and n = 216, with the
        Clenshaw-Curtis crossing n* = {IMP3927_CC_INTERP} agreeing with Gauss-Legendre to ~
        {IMP3927_CROSS_CC_GL_INTERP_DELTA.toExponential(0)} of a rung and with Simpson to ~
        {IMP3927_CROSS_CC_SIMPSON_INTERP_DELTA.toFixed(4)}. The middle chart shows eps_n flipping
        sign at n = {IMP3927_EPS_SIGN_CHANGE_N} identically across all three solvers. The bottom
        chart shows the deep sub-unity well near n = 500 slowly recovering toward 1 out to n = 620
        with no second sign-change.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> third-solver CONFIRMATION only,
        at the RH-equivalent scale class; all three solvers share the finite NPHI=10 kernel
        truncation, so this removes the quadrature-rule-family worry, not the kernel-truncation
        floor. Mass-feasibility is necessary-but-not-sufficient; operator positivity (imp-3066
        off-diagonal endpoint-Hankel K_a &ge; 0) is UNTOUCHED. Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA. NO QED; imp-3849/imp-3868/imp-3731 assertions left intact.
      </div>
    </div>
  );
}
