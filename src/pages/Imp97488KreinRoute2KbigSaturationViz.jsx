import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97488_MEASURED_POINTS,
  IMP97488_SATURATION_CURVE,
  IMP97488_LINEAR_DIVERGENCE_CURVE,
  IMP97488_LOG_DIVERGENCE_CURVE,
  IMP97488_FLOOR_BRACKET,
  IMP97488_FITS,
  IMP97488_REQUIRED_RHO_EXCEEDS,
} from '../data/imp-97488-krein-route2-kbig-saturation-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97488: visualizes the imp-97455 Kbig->infinity saturation of the
// best-reachable Route-2 lower bound on lambda_2 -- measured points hugging
// a saturation fit that flattens to a finite floor, against linear/log
// divergence fits that keep falling once extrapolated past Kbig=140.

const COLOR_POINTS = ED.series1;
const COLOR_SATURATION = ED.series3;
const COLOR_LINEAR = ED.series2;
const COLOR_LOG = ED.series4;
const COLOR_FLOOR = ED.series8;

function SaturationPanel() {
  const svgW = 720;
  const svgH = 360;
  const padL = 66;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const kMin = 44;
  const kMax = 400;

  const allVals = [
    ...IMP97488_SATURATION_CURVE.map((p) => p.bound),
    ...IMP97488_LINEAR_DIVERGENCE_CURVE.map((p) => p.bound),
    ...IMP97488_LOG_DIVERGENCE_CURVE.map((p) => p.bound),
    ...IMP97488_MEASURED_POINTS.map((p) => p.bound),
  ];
  const yMin = Math.min(...allVals) - 15;
  const yMax = Math.max(0, ...allVals) + 15;

  const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const [floorLo, floorHi] = IMP97488_FLOOR_BRACKET;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* finite-floor bracket band */}
      <rect
        x={padL}
        y={yOf(floorHi)}
        width={plotW}
        height={Math.max(1, yOf(floorLo) - yOf(floorHi))}
        fill={COLOR_FLOOR}
        opacity={0.12}
      />
      <text x={padL + 4} y={yOf(floorHi) - 4} fill={COLOR_FLOOR} fontSize={9}>
        finite floor bracket [-322.065,-305.866]
      </text>

      {/* zero line */}
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.rule} strokeWidth={1} />

      {/* divergence fit overlays */}
      <polyline
        points={IMP97488_LINEAR_DIVERGENCE_CURVE.map((p) => `${xOf(p.Kbig)},${yOf(p.bound)}`).join(' ')}
        fill="none"
        stroke={COLOR_LINEAR}
        strokeWidth={1.4}
        strokeDasharray="5 4"
      />
      <polyline
        points={IMP97488_LOG_DIVERGENCE_CURVE.map((p) => `${xOf(p.Kbig)},${yOf(p.bound)}`).join(' ')}
        fill="none"
        stroke={COLOR_LOG}
        strokeWidth={1.4}
        strokeDasharray="2 3"
      />

      {/* saturation fit curve */}
      <polyline
        points={IMP97488_SATURATION_CURVE.map((p) => `${xOf(p.Kbig)},${yOf(p.bound)}`).join(' ')}
        fill="none"
        stroke={COLOR_SATURATION}
        strokeWidth={2}
      />

      {/* measured points */}
      {IMP97488_MEASURED_POINTS.map((p) => (
        <circle key={p.Kbig} cx={xOf(p.Kbig)} cy={yOf(p.bound)} r={4} fill={COLOR_POINTS} stroke={ED.paper} strokeWidth={1} />
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[44, 140, 200, 300, 400].map((k) => (
        <text key={`xk${k}`} x={xOf(k)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {k}
        </text>
      ))}
      {[yMax, 0, -200, floorHi, floorLo, yMin].map((v, i) => (
        <text key={`yv${i}`} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
          {v.toFixed(0)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        Kbig &mdash; <tspan fill={COLOR_POINTS}>dots: measured bound</tspan>,{' '}
        <tspan fill={COLOR_SATURATION}>green: saturation fit (R^2=0.9965)</tspan>,{' '}
        <tspan fill={COLOR_LINEAR}>red dashed: linear fit (R^2=0.799)</tspan>,{' '}
        <tspan fill={COLOR_LOG}>amber dotted: log fit (R^2=0.913)</tspan>
      </text>
    </svg>
  );
}

export default function Imp97488KreinRoute2KbigSaturationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97455: The Route-2 Kbig&rarr;&infin; Saturation" />

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
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> the
        measured points and fit parameters are reused verbatim from
        imp-97455; the curves are the same closed-form fits evaluated past
        the measured Kbig=140 range so the saturation/divergence comparison
        is visible. Measurement only &mdash; no rigorous lower bound on
        lambda_2, no operator positivity, no bound moves; interval-rigorous
        reach stays 2a&le;0.96; RH
        open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97440 found the best-reachable Route-2 Lehmann-Maehly lower bound
        on lambda_2 worsening monotonically over three points (Kbig=44,60,76).
        imp-97455 extended the sweep to Kbig=140 and found the per-unit
        magnitude slope collapsing 3.030&rarr;0.131: the bound does not
        diverge to -&infin;, it <em>saturates</em> at a finite floor. The
        saturation model |bound|=Y&infin;-B&middot;Kbig<sup>-p</sup> fits at
        R&sup2;={IMP97488_FITS.saturation.r2.toFixed(4)}, far better than the
        linear (R&sup2;={IMP97488_FITS.linearDivergence.r2.toFixed(3)}) or log
        (R&sup2;={IMP97488_FITS.logDivergence.r2.toFixed(3)}) divergence fits
        it beats.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        bound vs Kbig: saturation fit vs the divergence fits it beats
      </h3>
      <SaturationPanel />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem', maxWidth: 700 }}>
        Required rho for a usable m=1 enclosure: {IMP97488_REQUIRED_RHO_EXCEEDS}
        &mdash; roughly four orders of magnitude above the measured floor
        (bracket [{IMP97488_FLOOR_BRACKET[0]}, {IMP97488_FLOOR_BRACKET[1]}]),
        far off the y-axis of the panel above. The Route-2 m=1 enclosure
        stays unusable at 2a=ln3 whether the bound diverges or saturates.
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
        only, consuming the imp-97455 measured points, fit parameters, and
        finite-floor bracket verbatim. Establishes no operator positivity;
        changes no bound; RH open;
        NO QED.
      </div>
    </div>
  );
}
