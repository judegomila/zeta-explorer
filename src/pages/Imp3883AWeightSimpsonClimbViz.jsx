import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3883_TAU3_WITH_GAPS,
  IMP3883_TAU25_WITH_GAPS,
  IMP3883_LADDER_TAU3,
  IMP3883_LADDER_TAU25,
} from '../data/imp-3883-a-weight-simpson-climb-viz-data.js';

const LOG_N_MIN = 4;
const LOG_N_MAX = 8.4;

function ClimbChart({ rows, limit, yMin, yMax, color }) {
  const svgW = 640;
  const padL = 76;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xS = (n) => padL + ((Math.log10(n) - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.negLnA).toFixed(2)).join(' ');

  const xTicks = [1e4, 1e5, 1e6, 1e7, 1e8];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {/* graded-GL converged limit -- the flat asymptote */}
      <line x1={padL} y1={yS(limit)} x2={padL + cW} y2={yS(limit)} stroke="#f472b6" strokeWidth={1.4} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={yS(limit) - 5} textAnchor="end" fill="#f9a8d4" fontSize={9}>
        graded-GL limit = {limit.toFixed(4)}
      </text>

      <path d={path} fill="none" stroke={color} strokeWidth={2.2} />
      {rows.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.negLnA)} r={2.8} fill={color} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n (uniform-Simpson panels, log scale)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}
      >
        -ln A(tau)
      </text>
    </svg>
  );
}

function GapChart() {
  const svgW = 640;
  const padL = 76;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const logGapMin = -7;
  const logGapMax = 1;

  const xS = (n) => padL + ((Math.log10(n) - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * cW;
  const yS = (g) => padT + cH * (1 - (Math.log10(g) - logGapMin) / (logGapMax - logGapMin));

  const path3 = IMP3883_TAU3_WITH_GAPS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.gapToLimit).toFixed(2),
  ).join(' ');
  const path25 = IMP3883_TAU25_WITH_GAPS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.gapToLimit).toFixed(2),
  ).join(' ');

  const xTicks = [1e4, 1e5, 1e6, 1e7, 1e8];
  const yTicks = [1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1e0, 1e1];

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

      <path d={path3} fill="none" stroke="#38bdf8" strokeWidth={2.2} />
      {IMP3883_TAU3_WITH_GAPS.map((r) => (
        <circle key={'t3' + r.n} cx={xS(r.n)} cy={yS(r.gapToLimit)} r={2.6} fill="#38bdf8" />
      ))}

      <path d={path25} fill="none" stroke="#facc15" strokeWidth={2} strokeDasharray="4,3" />
      {IMP3883_TAU25_WITH_GAPS.map((r) => (
        <circle key={'t25' + r.n} cx={xS(r.n)} cy={yS(r.gapToLimit)} r={2.4} fill="#facc15" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {n.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill="#64748b" fontSize={10}>
        n (log scale)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}
      >
        gap to limit (log scale)
      </text>

      <circle cx={padL + 10} cy={padT + 12} r={2.6} fill="#38bdf8" />
      <text x={padL + 18} y={padT + 15} fill="#7dd3fc" fontSize={9}>tau=3.0 gap (needs n=2.048e8)</text>
      <circle cx={padL + 232} cy={padT + 12} r={2.4} fill="#facc15" />
      <text x={padL + 240} y={padT + 15} fill="#fde68a" fontSize={9}>tau=2.5 gap (needs n=2.56e7)</text>
    </svg>
  );
}

export default function Imp3883AWeightSimpsonClimbViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Uniform-Simpson Monotone Climb onto the Graded-GL -ln A Limit (imp-3850 / imp-3883)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3850 extends the imp-3736 two-path reconciliation of -ln A(tau) to tau in {'{'}2.5, 3.0{'}'},
        the window beyond the imp-3716 uniform-grid ceiling. At tau=3.0 the near-s=0 peak has
        collapsed to width ~6e-7, so the uniform log-Simpson rule needs n=2.048e8 panels to resolve
        it; pushed there it climbs monotonically -- with no overshoot -- onto the cutoff- and
        grade-invariant graded Gauss-Legendre limit {IMP3883_LADDER_TAU3.gradedGLLimit.toFixed(4)}.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        tau=3.0: -ln A(tau) vs n, n=1.2e4..2.048e8 (uniform log-Simpson, hi=12)
      </p>
      <ClimbChart rows={IMP3883_TAU3_WITH_GAPS} limit={IMP3883_LADDER_TAU3.gradedGLLimit} yMin={511302} yMax={511310.5} color="#38bdf8" />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        tau=2.5 companion: -ln A(tau) vs n, n=1.2e4..2.56e7 (uniform log-Simpson, hi=12)
      </p>
      <ClimbChart rows={IMP3883_TAU25_WITH_GAPS} limit={IMP3883_LADDER_TAU25.gradedGLLimit} yMin={69193} yMax={69199.2} color="#facc15" />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        gap to the graded-GL limit, both tau: strictly monotone decreasing, no overshoot
      </p>
      <GapChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top two panels plot the
        raw uniform-Simpson value against the flat graded-GL asymptote (dashed) -- the curve climbs
        from below and never crosses it. The bottom panel shows the same data as a log-log gap: both
        tau=2.5 and tau=3.0 gaps fall off smoothly with no sign change, and the tau=3.0 gap needs
        roughly 8x more panels than tau=2.5 at every matched residual level, tracking the
        1/(4&pi;e<sup>4tau</sup>) peak-width ratio between the two tau.
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
        only -- an accuracy/convergence reconciliation of two quadratures for a fixed autocorrelation
        weight, RH-equivalent and necessary-but-not-sufficient. It establishes NO operator
        positivity; the imp-3066 K_a &ge; 0 sign-positivity obstruction remains untouched. No RH
        verdict, no QED. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
