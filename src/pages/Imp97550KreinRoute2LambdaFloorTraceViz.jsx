import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97550_BOUND_POINTS,
  IMP97550_TRACE_POINTS,
  IMP97550_FLOOR,
  IMP97550_REQUIRED_RHO_EXCEEDS,
} from '../data/imp-97550-krein-route2-lambda-floor-trace-viz-data.js';

// imp-97550: visualizes the imp-97513 direct-build extension of the Route-2
// Kbig->infinity lambda_2 floor past the imp-97495 Kbig=380 edge -- four
// directly-measured bound points (no extrapolation) tightening the floor's
// upper edge, alongside tr(A2) continuing to converge.

const COLOR_POINTS = '#38bdf8';
const COLOR_TRACE = '#a78bfa';
const COLOR_TIGHT = '#4ade80';
const COLOR_WIDE = '#94a3b8';

function BoundPanel() {
  const svgW = 720;
  const svgH = 320;
  const padL = 66;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const kMin = 360;
  const kMax = 520;
  const [tightLo, tightHi] = IMP97550_FLOOR.tightenedBracket;
  const [wideLo, wideHi] = IMP97550_FLOOR.imp97495Bracket;

  const yMin = wideLo - 4;
  const yMax = 0;

  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* wide imp-97495 direct-build bracket */}
      <rect x={padL} y={yOf(wideHi)} width={plotW} height={Math.max(1, yOf(wideLo) - yOf(wideHi))} fill={COLOR_WIDE} opacity={0.1} />
      <text x={padL + 4} y={yOf(wideHi) - 4} fill={COLOR_WIDE} fontSize={9}>
        imp-97495 bracket [-313.756,-309.931066]
      </text>

      {/* tightened imp-97513 direct-build bracket */}
      <rect x={padL} y={yOf(tightHi)} width={plotW} height={Math.max(1, yOf(tightLo) - yOf(tightHi))} fill={COLOR_TIGHT} opacity={0.22} />
      <text x={padL + 4} y={yOf(tightLo) + 12} fill={COLOR_TIGHT} fontSize={9}>
        imp-97513 tightened bracket [-313.756,-310.375499]
      </text>

      {/* directly-built points */}
      <polyline
        points={IMP97550_BOUND_POINTS.map((p) => `${xOf(p.Kbig)},${yOf(p.bound)}`).join(' ')}
        fill="none"
        stroke={COLOR_POINTS}
        strokeWidth={1.6}
      />
      {IMP97550_BOUND_POINTS.map((p) => (
        <circle key={p.Kbig} cx={xOf(p.Kbig)} cy={yOf(p.bound)} r={4.5} fill={COLOR_POINTS} stroke="#0f172a" strokeWidth={1} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {[380, 420, 460, 500].map((k) => (
        <text key={`xk${k}`} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8}>
          {k}
        </text>
      ))}
      {[0, tightHi, tightLo, wideLo].map((v, i) => (
        <text key={`yv${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8}>
          {v.toFixed(2)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9}>
        Kbig &mdash; <tspan fill={COLOR_POINTS}>dots: directly-built bound (no extrapolation)</tspan>
      </text>
    </svg>
  );
}

function TracePanel() {
  const svgW = 720;
  const svgH = 220;
  const padL = 90;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const kMin = 360;
  const kMax = 520;
  const vals = IMP97550_TRACE_POINTS.map((p) => p.trace);
  const yMin = Math.min(...vals) - 6000;
  const yMax = Math.max(...vals) + 6000;

  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={IMP97550_TRACE_POINTS.map((p) => `${xOf(p.Kbig)},${yOf(p.trace)}`).join(' ')}
        fill="none"
        stroke={COLOR_TRACE}
        strokeWidth={2}
      />
      {IMP97550_TRACE_POINTS.map((p) => (
        <circle key={p.Kbig} cx={xOf(p.Kbig)} cy={yOf(p.trace)} r={4} fill={COLOR_TRACE} stroke="#0f172a" strokeWidth={1} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {[380, 420, 460, 500].map((k) => (
        <text key={`xk${k}`} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8}>
          {k}
        </text>
      ))}
      {IMP97550_TRACE_POINTS.map((p) => (
        <text key={`yv${p.Kbig}`} x={padL - 6} y={yOf(p.trace) + 3} textAnchor="end" fill="#64748b" fontSize={8}>
          {(p.trace / 1e6).toFixed(2)}M
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9}>
        Kbig &mdash; tr(A2), converging toward &sim;4819.1M
      </text>
    </svg>
  );
}

export default function Imp97550KreinRoute2LambdaFloorTraceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97513: The Route-2 Lambda_2 Floor, Kbig=420-500" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(56,189,248,0.06)',
          borderLeft: '3px solid #38bdf8',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#38bdf8' }}>Honest status:</strong> every
        point and bracket below is reused verbatim from imp-97513.
        Measurement only &mdash; no rigorous lower bound on lambda_2, no
        operator positivity, no bound moves; interval-rigorous reach stays
        2a&le;0.96; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO
        QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97495 built the direct A2 reproducing-kernel matrix to Kbig=380,
        reading the best-reachable Route-2 lower bound on lambda_2 at
        -309.931066. imp-97513 extended the SAME executed build to Kbig in
        {' '}
        {'{420,460,500}'}, continuing the monotone saturating decrease to
        -310.375499 at Kbig=500 &mdash; tightening the upper edge of the
        floor bracket while the deep end (power-saturation refit -313.756)
        is unchanged.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        directly-built bound vs Kbig: tightened floor bracket vs the wider imp-97495 bracket
      </h3>
      <BoundPanel />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        tr(A2) vs Kbig: the reproducing kernel keeps converging
      </h3>
      <TracePanel />

      <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        Required rho for a usable m=1 enclosure: {IMP97550_REQUIRED_RHO_EXCEEDS}
        &mdash; roughly four orders of magnitude above the measured floor
        (bracket [{IMP97550_FLOOR.tightenedBracket[0]}, {IMP97550_FLOOR.tightenedBracket[1]}]),
        far off the y-axis of the panel above. The delta ratios keep rising
        (0.730&rarr;0.771, not plateaued), so the corrected-tail central
        estimate (~-310.75) remains a measured, not converged, extrapolation.
        The Route-2 m=1 enclosure stays unusable at 2a=ln3.
      </p>

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
        only, consuming the imp-97513 directly-built points and brackets
        verbatim. Establishes no operator positivity; changes no bound;
        Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
