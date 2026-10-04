import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3860_LADDER,
  IMP3860_C_INF_CLOSED,
  IMP3860_B_CLOSED,
  IMP3860_DECREMENT_LADDER,
  IMP3860_STEP_RATIO_LIMIT,
} from '../data/imp-3860-a-weight-correction-limit-viz-data.js';
import { ED } from '../styles/tokens.js';

const TAU_MIN = 0.5;
const TAU_MAX = 5.5;

function CorrectionSettlingChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = 0.35;
  const yMax = 0.63;

  const xS = (tau) => padL + ((tau - TAU_MIN) / (TAU_MAX - TAU_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP3860_LADDER.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.tau).toFixed(1) + ',' + yS(r.c).toFixed(2),
  ).join(' ');

  const yTicks = [0.35, 0.40, 0.45, 0.50, 0.55, 0.60];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP3860_C_INF_CLOSED)}
        x2={padL + cW}
        y2={yS(IMP3860_C_INF_CLOSED)}
        stroke={ED.series7}
        strokeWidth={1.2}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={yS(IMP3860_C_INF_CLOSED) - 5} textAnchor="end" fill={ED.series7} fontSize={8.5}>
        c_inf = {IMP3860_C_INF_CLOSED.toFixed(4)}
      </text>

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2.4} />
      {IMP3860_LADDER.map((r) => (
        <circle key={r.tau} cx={xS(r.tau)} cy={yS(r.c)} r={4} fill={ED.series1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3860_LADDER.map((r) => (
        <g key={'x' + r.tau}>
          <line x1={xS(r.tau)} y1={padT + cH} x2={xS(r.tau)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.tau)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.tau}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        tau
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        c(tau) = -ln A(tau) - pi e^4tau
      </text>
    </svg>
  );
}

function DecrementLogChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = -5;
  const yMax = -0.5;

  const xS = (tau) => padL + ((tau - TAU_MIN) / (TAU_MAX - TAU_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const path = IMP3860_DECREMENT_LADDER.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.tau).toFixed(1) + ',' + yS(r.decrement).toFixed(2),
  ).join(' ');

  const yTicks = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2.4} />
      {IMP3860_DECREMENT_LADDER.map((r) => (
        <circle key={r.tau} cx={xS(r.tau)} cy={yS(r.decrement)} r={4} fill={ED.series3} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3860_DECREMENT_LADDER.map((r) => (
        <g key={'x' + r.tau}>
          <line x1={xS(r.tau)} y1={padT + cH} x2={xS(r.tau)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.tau)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.tau}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        tau
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        c(tau) - c_inf (log scale)
      </text>
    </svg>
  );
}

export default function Imp3860AWeightCorrectionLimitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="A-Weight Subleading Correction Settling to c_inf ~ 0.3543 (imp-3730 / imp-3860)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3730 used a peak-adapted graded Gauss-Legendre quadrature to measure the A-weight
        subleading correction c(tau) = -ln A(tau) - pi e<sup>4 tau</sup> across tau in [0.5, 6],
        resolving the ladder past the tau ~ 2.5 ceiling where a plain uniform grid stalled. The
        correction settles to a
        POSITIVE constant c_inf ~ 0.3543 -- it does not decay to 0 -- and imp-3844 later derived
        that limit in closed form: c_inf = -ln((pi/2) Phi(0)), with the e<sup>-2 tau</sup> approach
        coefficient B = 3/(2 pi) &asymp; {IMP3860_B_CLOSED.toFixed(6)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        c(tau) across tau in [0.5, 5.5], settling onto the closed-form c_inf (dashed)
      </p>
      <CorrectionSettlingChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Decrement c(tau) - c_inf on a log axis: a straight line confirms the geometric decay
        c(tau) - c_inf &sim; B e<sup>-2 tau</sup>, with each 0.5-step ratio settling near e
        <sup>-1</sup> &asymp; {IMP3860_STEP_RATIO_LIMIT.toFixed(4)}
      </p>
      <DecrementLogChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top chart shows c(tau)
        falling from 0.617 at tau=0.5 toward the dashed c_inf line rather than toward zero -- the
        REJECTED alternative (imp-3716/imp-3730 open sub-gap) was that c(tau) decays to 0. The
        bottom chart plots the same decrement on a log axis: it is close to linear, the signature
        of the geometric law c(tau) - c_inf ~ B e<sup>-2 tau</sup> that imp-3844 later derived
        exactly, with the consecutive half-step ratio converging to e<sup>-1</sup>.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This settles the tau &rarr; infinity limit of a
        subleading correction to a fixed autocorrelation-weight decay rate, a quantity used inside
        a mass-feasibility diagnostic; mass-feasibility is necessary-but-not-sufficient and the
        operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched.
      </div>
    </div>
  );
}
