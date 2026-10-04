import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97470_DECAY_CURVES,
  IMP97470_SUMMARY,
  IMP97470_HONEST_BANNER,
} from '../data/imp-97470-route-m-sign-law-omega5-binet-decay-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97470: chart of the imp-97443 (X3) Binet-bracket decay law -- q1*certA(p1;q1) converging to the
// exact constant (1-1/p1)/12 across the omega=5 minimal-config ladder q1 = 10^2 .. 10^6, for p1 = 2, 3, 5.

function DecayChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 48;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const logMin = Math.log10(IMP97470_SUMMARY.q1Min) - 0.15;
  const logMax = Math.log10(IMP97470_SUMMARY.q1Max) + 0.15;
  const yMax = Math.max(...IMP97470_DECAY_CURVES.map((c) => c.cInfty)) * 1.08;
  const yMin = Math.min(...IMP97470_DECAY_CURVES.flatMap((c) => c.points.map((p) => p.q1certA))) * 0.9;

  const xS = (q1) => padL + ((Math.log10(q1) - logMin) / (logMax - logMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const xTicks = [1e2, 1e3, 1e4, 1e5, 1e6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {IMP97470_DECAY_CURVES.map((curve) => (
        <g key={'asym' + curve.p1}>
          <line
            x1={padL}
            y1={yS(curve.cInfty)}
            x2={padL + cW}
            y2={yS(curve.cInfty)}
            stroke={curve.color}
            strokeWidth={1}
            strokeDasharray="4,3"
            opacity={0.6}
          />
          <text x={padL + cW - 2} y={yS(curve.cInfty) - 4} textAnchor="end" fill={curve.color} fontSize={8.5}>
            {curve.cInftyLabel}
          </text>
        </g>
      ))}

      {IMP97470_DECAY_CURVES.map((curve) => {
        const path = curve.points
          .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.q1).toFixed(1) + ',' + yS(p.q1certA).toFixed(2))
          .join(' ');
        return (
          <g key={'curve' + curve.p1}>
            <path d={path} fill="none" stroke={curve.color} strokeWidth={2} />
            {curve.points.map((p) => (
              <circle key={p.q1} cx={xS(p.q1)} cy={yS(p.q1certA)} r={3.5} fill={curve.color} />
            ))}
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((q1) => (
        <g key={'x' + q1}>
          <line x1={xS(q1)} y1={padT + cH} x2={xS(q1)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(q1)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {q1.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        q1 (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        q1 * certA
      </text>

      <g fontSize={9}>
        {IMP97470_DECAY_CURVES.map((curve, i) => (
          <g key={'leg' + curve.p1}>
            <line
              x1={padL + 2}
              y1={padT + 12 + i * 14}
              x2={padL + 10}
              y2={padT + 12 + i * 14}
              stroke={curve.color}
              strokeWidth={2}
            />
            <text x={padL + 14} y={padT + 15 + i * 14} fill={curve.color}>
              p1 = {curve.p1}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Imp97470RouteMSignLawOmega5BinetDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Omega=5 Binet Decay Law (imp-97443 / imp-97470)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Honest status:</strong> {IMP97470_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route M omega=5 sign-law certificate certA(p1;q1,q2,q3,q4) decays like c/q1 as the leading
        prime q1 climbs the minimal-config ladder. The scaled quantity q1*certA converges monotonically to
        the exact constant (1-1/p1)/12, matched here against the imp-97443 extended-precision (mpmath
        dps=60) cross-check for p1 = 2, 3, 5 across q1 = 10^2 .. 10^6.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        q1 * certA vs q1, with the exact asymptote lines (1-1/p1)/12
      </p>
      <DecayChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-97470
        viz-data leaf (every value reused verbatim from imp-97443, no re-derivation). Changes no bound,
        establishes no operator positivity; Platt-Trudgian &Lambda;&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
