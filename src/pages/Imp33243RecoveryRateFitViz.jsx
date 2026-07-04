import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33243_PR_SAMPLES,
  IMP33243_PEXP_SAMPLES,
  IMP33243_TAIL_LO_N,
  IMP33243_TAIL_HI_N,
  IMP33243_PR_AT_TAIL_LO,
  IMP33243_PR_AT_TAIL_HI,
  IMP33243_EXP_AT_720,
  IMP33243_EXP_AT_1300,
  IMP33243_PR_CROSSING_N,
} from '../data/imp-33243-recovery-rate-fit-viz-data.js';

const X_MIN = 600;
const X_MAX = 1424;

function RecoveryRateChart() {
  const svgW = 640;
  const padL = 50;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = 0;
  const yMax = 1;

  const xS = (n) => padL + ((n - X_MIN) / (X_MAX - X_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const prPath = IMP33243_PR_SAMPLES.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.pr).toFixed(2),
  ).join(' ');
  const expPath = IMP33243_PEXP_SAMPLES.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.exp).toFixed(2),
  ).join(' ');

  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const xTicks = [624, 790, 1000, 1200, 1424];

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

      {/* the law asymptote at 1.0 */}
      <line
        x1={padL}
        y1={yS(1)}
        x2={padL + cW}
        y2={yS(1)}
        stroke="#f87171"
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={yS(1) - 4} textAnchor="end" fill="#fca5a5" fontSize={8.5}>
        4/(n ln n) law (P_r = 1)
      </text>

      <path d={prPath} fill="none" stroke="#38bdf8" strokeWidth={2.2} />
      {IMP33243_PR_SAMPLES.map((r) => (
        <circle key={'pr' + r.n} cx={xS(r.n)} cy={yS(r.pr)} r={1.8} fill="#38bdf8" />
      ))}

      <path d={expPath} fill="none" stroke="#facc15" strokeWidth={2.2} />
      {IMP33243_PEXP_SAMPLES.map((r) => (
        <circle key={'exp' + r.n} cx={xS(r.n)} cy={yS(r.exp)} r={1.8} fill="#facc15" />
      ))}

      {/* endpoint markers */}
      <circle cx={xS(IMP33243_TAIL_LO_N)} cy={yS(IMP33243_PR_AT_TAIL_LO)} r={4} fill="none" stroke="#7dd3fc" strokeWidth={1.4} />
      <circle cx={xS(IMP33243_TAIL_HI_N)} cy={yS(IMP33243_PR_AT_TAIL_HI)} r={4} fill="none" stroke="#7dd3fc" strokeWidth={1.4} />
      <text x={xS(IMP33243_TAIL_HI_N) - 6} y={yS(IMP33243_PR_AT_TAIL_HI) - 8} textAnchor="end" fill="#7dd3fc" fontSize={8.5}>
        P_r={IMP33243_PR_AT_TAIL_HI.toFixed(3)}
      </text>

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
        P_r, p_r
      </text>

      <g>
        <circle cx={padL + 12} cy={padT + 12} r={3} fill="#38bdf8" />
        <text x={padL + 20} y={padT + 15} fill="#7dd3fc" fontSize={9}>
          P_r(n) = |r_n| (n ln n)/4
        </text>
        <circle cx={padL + 12} cy={padT + 26} r={3} fill="#facc15" />
        <text x={padL + 20} y={padT + 29} fill="#fde68a" fontSize={9}>
          p_r(n) local decay exponent (W=60)
        </text>
      </g>
    </svg>
  );
}

export default function Imp33243RecoveryRateFitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Deep-Tail Recovery-Rate Fit vs the Laplace-Variance Law, n=624..1424 (imp-33211)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33211 fitted the DECAY RATE of the imp-3869 deep-tail exact-saddle ratio
        recovery |r_n| = |R_n - 1| against the imp-3735 closed-form Laplace-variance law
        4/(n ln n), across the same extended ladder n = 624..1424. Two diagnostics are
        overlaid: the closed-form-law ratio P_r(n) = |r_n| (n ln n)/4 (blue, flat iff
        |r_n| tracks the law exactly) and the windowed local decay exponent
        p_r(n) = -d ln|r_n| / d ln n (yellow, the law predicts this climbs to ~1). Both
        climb monotonically toward, but never reach, 1 across the measured window --
        P_r reaches {IMP33243_PR_AT_TAIL_HI.toFixed(3)} at n = {IMP33243_TAIL_HI_N} and
        p_r climbs from {IMP33243_EXP_AT_720.toFixed(3)} (n=720) to{' '}
        {IMP33243_EXP_AT_1300.toFixed(3)} (n=1300).
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        P_r(n) and p_r(n) vs n, n=624..1424: both diagnostics climb toward the law value
        of 1 (red dashed line) but stay strictly below it across the measured window
      </p>
      <RecoveryRateChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> both P_r and p_r
        are monotone increasing across the whole window and stay strictly below their
        law value of 1, which imp-33211 read as |r_n| tightening onto the 4/(n ln n)
        order from below with no sub-unity floor detected. As measured on n = 624..1424,
        this looked consistent with R_n reaching 1 asymptotically.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
        }}
      >
        <strong style={{ color: '#fca5a5' }}>Superseded by imp-33230:</strong> the
        below-1 reading on this window was a finite-window artifact. imp-33230 extended
        the identical ladder past n = {IMP33243_TAIL_HI_N} and found P_r CROSSES 1 at
        n ~ {IMP33243_PR_CROSSING_N}, immediately above where this fit stopped -- the
        climb here was the leading edge of a crossing, not an asymptote. This page
        presents the imp-33211 n=624..1424 measurement honestly, with that later
        correction noted rather than hidden.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement/fit only
        -- no proof, no reduction below RH. This fits the decay rate of a moment-ratio
        convergence diagnostic; mass-feasibility is necessary-but-not-sufficient and the
        operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched.
        The imp-3869 and imp-3735 assertions are left intact. Platt-Trudgian &Lambda;
        &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
