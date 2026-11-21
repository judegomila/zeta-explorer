import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97504_BOUND_POINTS,
  IMP97504_TRACE_POINTS,
  IMP97504_FLOOR,
  IMP97504_REQUIRED_RHO_EXCEEDS,
} from '../data/imp-97504-krein-route2-kbig-direct-floor-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97504: visualizes the imp-97482 direct-build extension of the Route-2
// Kbig->infinity floor past the imp-97455/imp-97488 Kbig=140 ceiling -- four
// directly-measured bound points (no extrapolation) tightening the floor
// bracket, alongside tr(A2) continuing to converge.

const COLOR_POINTS = ED.series1;
const COLOR_TRACE = ED.series5;
const COLOR_TIGHT = ED.series3;
const COLOR_WIDE = ED.series8;

function BoundPanel() {
  const svgW = 720;
  const svgH = 320;
  const padL = 66;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const kMin = 120;
  const kMax = 280;
  const [tightLo, tightHi] = IMP97504_FLOOR.tightenedBracket;
  const [wideLo, wideHi] = IMP97504_FLOOR.imp97455Bracket;

  const yMin = wideLo - 10;
  const yMax = 0;

  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* wide imp-97455 extrapolated bracket */}
      <rect x={padL} y={yOf(wideHi)} width={plotW} height={Math.max(1, yOf(wideLo) - yOf(wideHi))} fill={COLOR_WIDE} opacity={0.1} />
      <text x={padL + 4} y={yOf(wideHi) - 4} fill={COLOR_WIDE} fontSize={9}>
        imp-97455 extrapolated bracket [-322.065,-305.866]
      </text>

      {/* tightened imp-97482 direct-build bracket */}
      <rect x={padL} y={yOf(tightHi)} width={plotW} height={Math.max(1, yOf(tightLo) - yOf(tightHi))} fill={COLOR_TIGHT} opacity={0.22} />
      <text x={padL + 4} y={yOf(tightLo) + 12} fill={COLOR_TIGHT} fontSize={9}>
        imp-97482 tightened bracket [-313.756,-308.745]
      </text>

      {/* directly-built points */}
      <polyline
        points={IMP97504_BOUND_POINTS.map((p) => `${xOf(p.Kbig)},${yOf(p.bound)}`).join(' ')}
        fill="none"
        stroke={COLOR_POINTS}
        strokeWidth={1.6}
      />
      {IMP97504_BOUND_POINTS.map((p) => (
        <circle key={p.Kbig} cx={xOf(p.Kbig)} cy={yOf(p.bound)} r={4.5} fill={COLOR_POINTS} stroke={ED.paper} strokeWidth={1} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[140, 180, 220, 260].map((k) => (
        <text key={`xk${k}`} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {k}
        </text>
      ))}
      {[0, -305.866, tightLo, wideLo].map((v, i) => (
        <text key={`yv${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(1)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        Kbig &mdash; <tspan fill={COLOR_POINTS}>dots: directly-built bound (no extrapolation)</tspan>
      </text>
    </svg>
  );
}

function TracePanel() {
  const svgW = 720;
  const svgH = 220;
  const padL = 80;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const kMin = 120;
  const kMax = 280;
  const vals = IMP97504_TRACE_POINTS.map((p) => p.trace);
  const yMin = Math.min(...vals) - 20000;
  const yMax = Math.max(...vals) + 20000;

  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline
        points={IMP97504_TRACE_POINTS.map((p) => `${xOf(p.Kbig)},${yOf(p.trace)}`).join(' ')}
        fill="none"
        stroke={COLOR_TRACE}
        strokeWidth={2}
      />
      {IMP97504_TRACE_POINTS.map((p) => (
        <circle key={p.Kbig} cx={xOf(p.Kbig)} cy={yOf(p.trace)} r={4} fill={COLOR_TRACE} stroke={ED.paper} strokeWidth={1} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[140, 180, 220, 260].map((k) => (
        <text key={`xk${k}`} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {k}
        </text>
      ))}
      {IMP97504_TRACE_POINTS.map((p) => (
        <text key={`yv${p.Kbig}`} x={padL - 6} y={yOf(p.trace) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {(p.trace / 1e6).toFixed(2)}M
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        Kbig &mdash; tr(A2), converging toward &sim;4819.1M
      </text>
    </svg>
  );
}

export default function Imp97504KreinRoute2KbigDirectFloorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97482: The Route-2 Kbig Floor, Directly Built" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> every
        point and bracket below is reused verbatim from imp-97482.
        Measurement only &mdash; no rigorous lower bound on lambda_2, no
        operator positivity, no bound moves; interval-rigorous reach stays
        2a&le;0.96; RH open; NO
        QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97455 extrapolated the Route-2 Kbig&rarr;&infin; floor to the
        bracket [-322.065,-305.866] from points measured only up to Kbig=140.
        imp-97482 extended the SAME direct A2 build past 140 to Kbig=260,
        reproducing the Kbig=140 anchor exactly and reading three further
        points with no extrapolation, tightening the floor to
        [-313.756,-308.745] &mdash; strictly inside the earlier bracket.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        directly-built bound vs Kbig: tightened floor bracket vs the wider imp-97455 bracket
      </h3>
      <BoundPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        tr(A2) vs Kbig: the reproducing kernel keeps converging
      </h3>
      <TracePanel />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        Required rho for a usable m=1 enclosure: {IMP97504_REQUIRED_RHO_EXCEEDS}
        &mdash; roughly four orders of magnitude above the measured floor
        (bracket [{IMP97504_FLOOR.tightenedBracket[0]}, {IMP97504_FLOOR.tightenedBracket[1]}]),
        far off the y-axis of the panel above. The Route-2 m=1 enclosure
        stays unusable at 2a=ln3.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97482 directly-built points and brackets
        verbatim. Establishes no operator positivity; changes no bound; RH open; NO QED.
      </div>
    </div>
  );
}
