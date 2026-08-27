import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35977_E_SHARE_BARS,
  IMP35977_BALANCE_CROSSOVER_SIGMA,
} from '../data/imp-35977-e-share-stacked-bar-viz-data.js';

const SEGMENTS = [
  { key: 'shareTrunc', label: 'E_trunc', color: '#38bdf8' },
  { key: 'shareFlow', label: 'E_flow', color: '#a78bfa' },
  { key: 'shareColl', label: 'E_coll', color: '#f472b6' },
];

// Two-bar stacked chart: the imp-35977 fractional E(N) = E_trunc + E_flow + E_coll
// share split at the Kneedle-elbow (collision-dominated) and flattest-point
// (truncation-dominated) knees, straddling the sigma = 0.5 balance crossover.
function StackedBars() {
  const svgW = 480;
  const svgH = 300;
  const padL = 32;
  const padR = 24;
  const padT = 24;
  const padB = 56;
  const barW = 120;
  const gap = 96;
  const cH = svgH - padT - padB;

  const xLeft = padL + gap / 2;
  const xRight = svgW - padR - gap / 2 - barW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%', margin: '0 auto' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line
            x1={padL}
            x2={svgW - padR}
            y1={padT + cH - t * cH}
            y2={padT + cH - t * cH}
            stroke="#1e293b"
            strokeWidth={1}
          />
          <text x={padL - 6} y={padT + cH - t * cH + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}
      {[
        { bar: IMP35977_E_SHARE_BARS[0], x: xLeft },
        { bar: IMP35977_E_SHARE_BARS[1], x: xRight },
      ].map(({ bar, x }) => {
        let yCursor = padT + cH;
        return (
          <g key={bar.label}>
            {SEGMENTS.map((seg) => {
              const h = bar[seg.key] * cH;
              const y = yCursor - h;
              yCursor = y;
              return (
                <rect
                  key={seg.key}
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  fill={seg.color}
                  stroke="#0a0f1a"
                  strokeWidth={1}
                />
              );
            })}
            <text x={x + barW / 2} y={svgH - padB + 18} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}>
              {bar.label}
            </text>
            <text x={x + barW / 2} y={svgH - padB + 32} textAnchor="middle" fill="#64748b" fontSize={9.5}>
              N&asymp;{bar.N.toExponential(2)}
            </text>
          </g>
        );
      })}
      <text x={svgW / 2} y={14} textAnchor="middle" fill="#64748b" fontSize={10}>
        E(N) = E_trunc + E_flow + E_coll fractional share
      </text>
    </svg>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '0.5rem' }}>
      {SEGMENTS.map((seg) => (
        <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span style={{ width: 12, height: 12, background: seg.color, display: 'inline-block', borderRadius: 2 }} />
          {seg.label}
        </div>
      ))}
    </div>
  );
}

export default function Imp36025EShareStackedBarViz() {
  const [elbow, flat] = IMP35977_E_SHARE_BARS;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E(N) Three-Way Fractional Share at the Two Knees (imp-35977 / imp-36025)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35889 E(N) = E_trunc + E_flow + E_coll decomposition splits differently at the two
        imp-35853 knees. At the Kneedle-elbow (N&asymp;{elbow.N.toExponential(2)}, &sigma;&asymp;0.783)
        the split is collision-dominated (E_coll share &asymp;{elbow.shareColl}, E_trunc runner-up
        &asymp;{elbow.shareTrunc}, E_flow negligible). At the flattest point (N&asymp;
        {flat.N.toExponential(2)}, &sigma;&asymp;0.407) the split flips to truncation-dominated (E_trunc
        share &asymp;{flat.shareTrunc}, E_coll runner-up &asymp;{flat.shareColl}). The dominant term flips
        across the imp-35337 &sigma; = {IMP35977_BALANCE_CROSSOVER_SIGMA} balance crossover, which sits
        between the two knees.
      </p>

      <StackedBars />
      <Legend />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> presentation of the imp-35977 baked
        viz-data (itself reusing the recorded imp-35889 shares) as a stacked bar chart. Measurement /
        presentation only; changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO
        QED.
      </div>
    </div>
  );
}
