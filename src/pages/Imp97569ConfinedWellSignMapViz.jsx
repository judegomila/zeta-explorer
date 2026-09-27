import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97569_SIGN_MAP,
  IMP97569_LAMBDA_MIN_CURVE,
  IMP97569_CROSSING,
} from '../data/imp-97569-confined-well-sign-map-viz-data.js';

// imp-97569: charts the imp-97537 sigma_2 sign map (confined well, positive
// band, far-field t0=27) alongside the soft lambda_min(T_a[sigma_2]) curve
// crossing at 2a* ~ 1.1316, past ln3.

const COLOR_NEG = '#f87171';
const COLOR_POS_BAND = '#4ade80';
const COLOR_POS_MEASURED = '#facc15';
const COLOR_POS_RIGOROUS = '#38bdf8';

function segColor(seg) {
  if (seg.sign === 'negative') return COLOR_NEG;
  if (seg.status === 'band') return COLOR_POS_BAND;
  if (seg.status === 'measured') return COLOR_POS_MEASURED;
  return COLOR_POS_RIGOROUS;
}

function SignMapPanel() {
  const svgW = 720;
  const svgH = 120;
  const padL = 20;
  const padR = 20;
  const padT = 24;
  const rowH = 36;
  const tMax = 40;
  const plotW = svgW - padL - padR;

  const xOf = (t) => padL + (t / tMax) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 8} fill="#94a3b8" fontSize={9}>
        sign(sigma_2(t)) for t &ge; 0 (mirrored at t &lt; 0)
      </text>
      {IMP97569_SIGN_MAP.map((seg) => (
        <rect
          key={`${seg.tStart}-${seg.tEnd}`}
          x={xOf(seg.tStart)}
          y={padT}
          width={xOf(seg.tEnd) - xOf(seg.tStart)}
          height={rowH}
          fill={segColor(seg)}
          opacity={0.75}
          stroke="#0f172a"
          strokeWidth={1}
        />
      ))}
      {[0, 3.306, 6.945, 10.532, 27, 40].map((t) => (
        <text key={`tick${t}`} x={xOf(t)} y={padT + rowH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
          {t}
        </text>
      ))}
      <text x={padL} y={padT + rowH + 30} fill="#64748b" fontSize={9}>
        <tspan fill={COLOR_NEG}>&#9632; well (negative)</tspan>{'   '}
        <tspan fill={COLOR_POS_BAND}>&#9632; intervening band (positive)</tspan>{'   '}
        <tspan fill={COLOR_POS_MEASURED}>&#9632; measured positive</tspan>{'   '}
        <tspan fill={COLOR_POS_RIGOROUS}>&#9632; rigorously proven positive (t&ge;27)</tspan>
      </text>
    </svg>
  );
}

function LambdaMinPanel() {
  const svgW = 720;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 0.88;
  const xMax = 1.18;
  const xOf = (twoA) => padL + ((twoA - xMin) / (xMax - xMin)) * plotW;

  // symlog-ish (sqrt-compressed) y-axis: values range from ~56 down to -61
  const yMin = -65;
  const yMax = 60;
  const scale = (v) => Math.sign(v) * Math.sqrt(Math.abs(v));
  const sMin = scale(yMin);
  const sMax = scale(yMax);
  const yOf = (v) => padT + plotH - ((scale(v) - sMin) / (sMax - sMin)) * plotH;

  const points = IMP97569_LAMBDA_MIN_CURVE.map((p) => `${xOf(p.twoA)},${yOf(p.lambdaMin)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke="#334155" strokeWidth={1} strokeDasharray="4 3" />

      <line x1={xOf(IMP97569_CROSSING.ln3)} y1={padT} x2={xOf(IMP97569_CROSSING.ln3)} y2={padT + plotH} stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={xOf(IMP97569_CROSSING.ln3) + 4} y={padT + 10} fill="#a78bfa" fontSize={9}>
        2a=ln3
      </text>

      <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {IMP97569_LAMBDA_MIN_CURVE.map((p) => (
        <circle
          key={`pt${p.twoA}`}
          cx={xOf(p.twoA)}
          cy={yOf(p.lambdaMin)}
          r={3.5}
          fill={p.lambdaMin >= 0 ? '#4ade80' : '#f87171'}
          stroke="#0f172a"
          strokeWidth={1}
        />
      ))}

      <circle cx={xOf(IMP97569_CROSSING.twoAStar)} cy={yOf(0)} r={6} fill="none" stroke="#f59e0b" strokeWidth={2} />
      <text x={xOf(IMP97569_CROSSING.twoAStar) - 44} y={yOf(0) - 10} fill="#f59e0b" fontSize={9}>
        2a*={IMP97569_CROSSING.twoAStar}
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {[0.9, 1.0, 1.04, 1.08, 1.12, 1.16].map((v) => (
        <text key={`xv${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8}>
          {v}
        </text>
      ))}
      {[-60, -10, 0, 10, 30, 60].map((v) => (
        <text key={`yv${v}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9}>
        2a (support width) &mdash; true (finite-N Galerkin) soft lambda_min(T_a[sigma_2]) (sqrt-compressed y-axis)
      </text>
    </svg>
  );
}

export default function Imp97569ConfinedWellSignMapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97537: Confined Well vs Projected Positivity" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(56,189,248,0.06)',
          borderLeft: '3px solid #38bdf8',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#38bdf8' }}>Honest status:</strong> every
        boundary and sample below is reused verbatim from imp-97537. Assessment
        only &mdash; no operator positivity, no coercivity constant, no bound
        moves; interval-rigorous reach stays 2a&le;0.96; Platt-Trudgian
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        sigma_2(t) = (t^2+1/4)^2 w_1(t) is negative on a confined well
        ([0,3.306] &cup; [6.945,10.532]), positive on the intervening band,
        measured (but not rigorously proven) positive out to t=27, and
        rigorously proven positive for t&ge;27 (imp-97501). The confined well
        is compatible with positivity of the projected operator P_a
        M_sigma2 P_a: the true (finite-N Galerkin) soft lambda_min stays
        positive for every 2a&le;ln3 and crosses zero only at 2a*&sim;1.1316,
        past ln3.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        sign map of sigma_2(t)
      </h3>
      <SignMapPanel />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        soft lambda_min(T_a[sigma_2]) vs 2a
      </h3>
      <LambdaMinPanel />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> presentation
        only, consuming the imp-97537 sign-map boundaries and the baked
        lambda_min(T_a[sigma_2]) table verbatim. Establishes no operator
        positivity; changes no bound; Platt-Trudgian Lambda&le;0.2 remains
        SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
