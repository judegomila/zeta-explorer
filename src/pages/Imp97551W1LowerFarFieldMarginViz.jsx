import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97551_W1_PROFILE,
  IMP97551_NEGATIVE_WELL_INTERVALS,
  IMP97551_CROSSING_TSTAR,
  IMP97551_THRESHOLD_T0,
  IMP97551_MARGIN_AT_T0,
  IMP97551_WINDOW_BRIDGE,
} from '../data/imp-97551-w1lower-farfield-margin-viz-data.js';

// imp-97551: visualizes the imp-97501 rigorous far-field positivity margin of
// sigma_2(t) = (t^2+1/4)^2 w_1(t): the actual oscillating w_1(t) against its
// rigorous increasing lower bound w1Lower(t) = L(t) - sqrt2 ln2, crossing
// zero at t*=26.1023 and giving a clean positive margin at t0=27, alongside
// the confined negative well [0,3.306]u[6.945,10.532] and the guarded bridge
// window [10.532,27].

function MarginPanel() {
  const svgW = 720;
  const svgH = 320;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minT = IMP97551_W1_PROFILE[0].t;
  const maxT = IMP97551_W1_PROFILE[IMP97551_W1_PROFILE.length - 1].t;
  const actuals = IMP97551_W1_PROFILE.map((p) => p.actual);
  const lowers = IMP97551_W1_PROFILE.map((p) => p.lower);
  const minV = Math.min(...actuals, ...lowers);
  const maxV = Math.max(...actuals, ...lowers);
  const pad = (maxV - minV) * 0.08;
  const yMin = minV - pad;
  const yMax = maxV + pad;

  const xOf = (t) => padL + ((t - minT) / (maxT - minT)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const y0 = yOf(0);

  const band = (t0, t1, fill) => (
    <rect x={xOf(t0)} y={padT} width={Math.max(0, xOf(t1) - xOf(t0))} height={plotH} fill={fill} />
  );

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* confined negative well of w_1 (= sign(sigma_2)), reused from imp-97399 */}
      {IMP97551_NEGATIVE_WELL_INTERVALS.map(([a, b], i) => band(a, b, 'rgba(248,113,113,0.14)'))}

      {/* guarded bridge window [10.532, 27] */}
      {band(IMP97551_WINDOW_BRIDGE[0], IMP97551_WINDOW_BRIDGE[1], 'rgba(251,191,36,0.10)')}

      {/* rigorous-forever region beyond t0 */}
      {band(IMP97551_THRESHOLD_T0, maxT, 'rgba(52,211,153,0.12)')}

      {/* zero line */}
      <line x1={padL} y1={y0} x2={padL + plotW} y2={y0} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />

      {/* actual w_1(t) curve */}
      <polyline
        points={IMP97551_W1_PROFILE.map((p) => `${xOf(p.t)},${yOf(p.actual)}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={1.3}
      />

      {/* rigorous lower bound w1Lower(t) */}
      <polyline
        points={IMP97551_W1_PROFILE.map((p) => `${xOf(p.t)},${yOf(p.lower)}`).join(' ')}
        fill="none"
        stroke="#f87171"
        strokeWidth={1.8}
        strokeDasharray="5 3"
      />

      {/* crossing t* and threshold t0 markers */}
      <line x1={xOf(IMP97551_CROSSING_TSTAR)} y1={padT} x2={xOf(IMP97551_CROSSING_TSTAR)} y2={padT + plotH} stroke="#facc15" strokeWidth={1} strokeDasharray="2 2" />
      <line x1={xOf(IMP97551_THRESHOLD_T0)} y1={padT} x2={xOf(IMP97551_THRESHOLD_T0)} y2={padT + plotH} stroke="#4ade80" strokeWidth={1.5} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {[minT, 10, 20, IMP97551_CROSSING_TSTAR, IMP97551_THRESHOLD_T0, maxT].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8}>
          {typeof v === 'number' ? v.toFixed(v < 1 ? 1 : 0) : v}
        </text>
      ))}
      {[yMax, 0, yMin].map((v, i) => (
        <text key={`y${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8}>
          {v.toFixed(1)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9}>
        t &mdash; blue: actual w_1(t); red dashed: rigorous lower bound w1Lower(t); yellow line: crossing t*={IMP97551_CROSSING_TSTAR.toFixed(4)}; green line: threshold t0={IMP97551_THRESHOLD_T0}
      </text>
    </svg>
  );
}

export default function Imp97551W1LowerFarFieldMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97501: The Rigorous Far-Field Positivity Margin" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> the curve
        panel is an exact recomputation of the actual w_1(t) and its rigorous
        lower bound w1Lower(t); the summary constants (t*, t0, margin, guarded
        window) are reused verbatim from imp-97501. Establishes no operator
        positivity; changes no bound; interval-rigorous certificate reach
        stays 2a&le;0.96; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open;
        NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        sigma_2(t) = (t^2+1/4)^2 w_1(t), so sign(sigma_2) = sign(w_1). The
        rigorous lower bound w1Lower(t) = L(t) &minus; &radic;2&thinsp;ln2 is
        strictly increasing and crosses zero at t*={IMP97551_CROSSING_TSTAR},
        giving a clean explicit threshold t0={IMP97551_THRESHOLD_T0} with
        margin {IMP97551_MARGIN_AT_T0}: past t0, w_1(t) &gt; 0 is provable for
        every larger t, not just sampled. The confined negative well
        (red, [0,3.306]&cup;[6.945,10.532]) and the guarded bridge window
        (yellow, [{IMP97551_WINDOW_BRIDGE[0]},{IMP97551_WINDOW_BRIDGE[1]}])
        are reused verbatim from imp-97399/imp-97501.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        w_1(t): actual curve vs rigorous lower bound
      </h3>
      <MarginPanel />

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
        only, consuming the imp-97501 rigorous margin constants and the
        imp-97399 confined-well boundaries verbatim; the w_1(t) samples are an
        exact recompute, not new data. Establishes no operator positivity;
        changes no bound; interval-rigorous certificate reach stays
        2a&le;0.96; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open;
        NO QED.
      </div>
    </div>
  );
}
