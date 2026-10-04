import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY } from '../data/imp-36185-e-share-five-landmark-tail-decay-viz-data.js';
import { ED } from '../styles/tokens.js';

// Single-series line chart of shareColl vs log10 N across the imp-36111 five
// landmarks -- the one monotonically decaying arm past the roadmap sigma(N)
// U-shape peak (N ~9.22e5), from Kneedle-elbow (shareColl ~0.783) down to the
// imp-35971 sole-survivor (shareColl ~0.0099).
function DecayCurve() {
  const points = IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY;
  const svgW = 640;
  const padL = 48;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 320;
  const padT = 24;
  const padB = 56;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...points.map((p) => p.log10_N));
  const maxX = Math.max(...points.map((p) => p.log10_N));
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - v * plotH;

  const xTicks = [8, 9, 10, 11, 12, 13, 14];
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        shareColl = E_coll / E(N)
      </text>

      <polyline
        points={points.map((p) => `${xOf(p.log10_N)},${yOf(p.shareColl)}`).join(' ')}
        fill="none"
        stroke={ED.series7}
        strokeWidth={2.25}
        opacity={0.9}
      />

      {points.map((p) => (
        <g key={p.label}>
          <circle cx={xOf(p.log10_N)} cy={yOf(p.shareColl)} r={4.5} fill={ED.series7} stroke={ED.paper} strokeWidth={1.5} />
          <text
            x={xOf(p.log10_N)}
            y={yOf(p.shareColl) - 10}
            textAnchor="middle"
            fill={ED.inkSoft}
            fontSize={8}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp36203EShareFiveLandmarkDecayCurveViz() {
  const points = IMP36185_E_SHARE_FIVE_LANDMARK_TAIL_DECAY;
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Post-Peak shareColl Decay Curve (imp-36111 / imp-36185 / imp-36203)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-36111 cross-reference note merges the imp-35977 two-knee bars and the imp-36046
        tail bars into a single N-ordered sequence, reporting the imp-35889 collision-share
        shareColl = E_coll / (E_trunc + E_flow + E_coll) as five successive samples of one
        monotonically decaying arm past the roadmap sigma(N) U-shape peak (N&nbsp;&asymp;&nbsp;9.22e5).
        shareColl falls from &asymp;{first.shareColl} at the {first.label} (log10&nbsp;N&nbsp;&asymp;&nbsp;
        {first.log10_N}) to &asymp;{last.shareColl.toExponential(2)} at the {last.label} (log10&nbsp;N&nbsp;
        &asymp;&nbsp;{last.log10_N}), where E_trunc stands essentially alone.
      </p>

      <DecayCurve />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation-only consumer of
        the baked imp-36185 viz-data (itself reusing the recorded imp-36111 combined-sequence
        literals verbatim); no new derivation, no bound changed. C_C GUE-conditional (imp-2642 /
        imp-2643 / imp-486) untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
