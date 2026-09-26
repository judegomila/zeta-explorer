import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97452_CURVE,
  IMP97452_RUNGS,
  IMP97452_REACH_2A,
  IMP97452_BINDING_2A,
  IMP97452_REACH_FLOOR,
  IMP97452_BINDING_FLOOR,
  IMP97452_NEG_AREA,
} from '../data/imp-97452-krein-rk-floor-linear-ladder-viz-data.js';

// imp-97452: visualizes the imp-97431 measurement that the imp-97399
// reproducing-kernel Krein floor floor(a) = -(a/pi)*18301.61 is exactly
// linear in the half-width a across 2a in (0, ln3], never crossing zero
// within the interval-rigorous reach 2a<=0.96 (nor at the binding ln3).

function LinearLadderPanel() {
  const svgW = 720;
  const svgH = 320;
  const padL = 64;
  const padR = 24;
  const padT = 20;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 0;
  const maxX = IMP97452_BINDING_2A;
  const minY = Math.min(...IMP97452_CURVE.map((p) => p.floor)) * 1.05;
  const maxY = 40;

  const xOf = (twoA) => padL + ((twoA - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* reach band */}
      <rect
        x={xOf(0)}
        y={padT}
        width={xOf(IMP97452_REACH_2A) - xOf(0)}
        height={plotH}
        fill="rgba(74,222,128,0.06)"
      />
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {/* y ticks */}
      {[minY, minY / 2, 0].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v.toFixed(0)}
          </text>
        </g>
      ))}

      {/* x ticks */}
      {[0, IMP97452_REACH_2A, IMP97452_BINDING_2A].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {v.toFixed(2)}
        </text>
      ))}

      {/* the linear curve */}
      <polyline
        points={IMP97452_CURVE.map((p) => `${xOf(p.twoA)},${yOf(p.floor)}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={2}
      />

      {/* measured rungs from imp-97431 */}
      {IMP97452_RUNGS.map((r) => (
        <circle
          key={r.twoA}
          cx={xOf(r.twoA)}
          cy={yOf(r.floor)}
          r={3.5}
          fill={r.inReach ? '#4ade80' : '#f87171'}
        />
      ))}

      {/* reach-limit marker */}
      <line
        x1={xOf(IMP97452_REACH_2A)}
        y1={padT}
        x2={xOf(IMP97452_REACH_2A)}
        y2={padT + plotH}
        stroke="#4ade80"
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      <text x={xOf(IMP97452_REACH_2A)} y={padT - 6} textAnchor="middle" fill="#4ade80" fontSize={8.5}>
        reach 2a=0.96 ({IMP97452_REACH_FLOOR.toFixed(2)})
      </text>

      {/* binding marker */}
      <line
        x1={xOf(IMP97452_BINDING_2A)}
        y1={padT}
        x2={xOf(IMP97452_BINDING_2A)}
        y2={padT + plotH}
        stroke="#f87171"
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      <text x={xOf(IMP97452_BINDING_2A) - 4} y={padT + 12} textAnchor="end" fill="#f87171" fontSize={8.5}>
        binding 2a=ln3, out of reach ({IMP97452_BINDING_FLOOR.toFixed(2)})
      </text>

      {/* vacuous a->0 limit */}
      <text x={xOf(0) + 4} y={yOf(0) - 6} fill="#94a3b8" fontSize={8.5}>
        a&rarr;0: floor&rarr;0 (vacuous, never attained)
      </text>

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9}>
        2a (band width) &mdash; floor(a) = -(a/pi)&middot;{IMP97452_NEG_AREA} (green shading = interval-rigorous reach)
      </text>
    </svg>
  );
}

export default function Imp97452RkFloorLinearLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97431: The Reproducing-Kernel Krein Floor is Linear in the Half-Width a" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> the RKHS
        budget alone certifies c_sharp &gt; 0 for no band 2a in (0, ln3]. The
        floor is strictly negative throughout the interval-rigorous reach
        2a&le;0.96 and approaches 0 only in the vacuous a&rarr;0 limit, which
        certifies nothing (the trivial band carries no test functions).
        Establishes no operator positivity; no bound moves; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The symbol sigma_2(t) = (t^2+1/4)^2 w_1(t) does not depend on the band
        half-width a; the half-width enters the imp-97399 reproducing-kernel
        floor only through the pointwise mass cap K_a(t,t) = a/pi. Because the
        confined negative area &int; sigma_2^- dt = 18301.61 is fixed
        (imp-97399 Finding 1), the floor is EXACTLY LINEAR: floor(a) =
        -(a/pi)&middot;18301.61. imp-97431 measured this ladder across the
        interval-rigorous reach and found it never crosses zero.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        floor(a) vs. band 2a, over (0, ln3]
      </h3>
      <LinearLadderPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the
        line is exactly straight through the origin (floor is linear in a);
        green markers are the imp-97431 measured rungs inside the
        interval-rigorous reach, the red marker is the binding (out-of-reach)
        2a=ln3 rung. Shrinking the band only scales the same fixed negative
        area down proportionally &mdash; it never flips sign.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page
        consuming the imp-97431 rkFloor function and measured ladder verbatim;
        no re-solve. Establishes no operator positivity; changes no bound;
        interval-rigorous certificate reach stays 2a&le;0.96; Platt-Trudgian
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
