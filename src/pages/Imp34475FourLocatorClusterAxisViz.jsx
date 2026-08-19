import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34475_ORDERED_LOCATORS,
  IMP34475_GAPS,
  IMP34475_N_MIN,
  IMP34475_N_MAX,
} from '../data/imp-34475-four-locator-cluster-axis-viz-data.js';

// One shared linear-N axis: the four imp-34441 locators plotted as ticks, with the two
// distinct headline gaps (E_flow displacement, ramp-curvature offset) bracketed below/above.
function LocatorClusterAxis() {
  const svgW = 640;
  const svgH = 260;
  const padL = 50;
  const padR = 50;
  const padT = 70;
  const padB = 70;
  const cW = svgW - padL - padR;
  const axisY = padT + (svgH - padT - padB) / 2;

  const span = IMP34475_N_MAX - IMP34475_N_MIN;
  const pad = span * 0.18;
  const domainMin = IMP34475_N_MIN - pad;
  const domainMax = IMP34475_N_MAX + pad;
  const xAt = (n) => padL + ((n - domainMin) / (domainMax - domainMin)) * cW;

  // The two crossover locators (bisection + closed form) sit within ~1.7e-15 relative of each
  // other, i.e. visually coincident -- stack their labels so both remain legible.
  const points = IMP34475_ORDERED_LOCATORS.map((l, i) => ({
    ...l,
    x: xAt(l.N),
    labelUp: i % 2 === 0,
  }));

  const gapHalfCross = IMP34475_GAPS[0];
  const gapCrossKnee = IMP34475_GAPS[1];
  const xHalf = xAt(IMP34475_ORDERED_LOCATORS[0].N);
  const xCross = xAt(IMP34475_ORDERED_LOCATORS[2].N);
  const xKnee = xAt(IMP34475_ORDERED_LOCATORS[3].N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* shared axis */}
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke="#334155" strokeWidth={1.5} />

      {/* gap 1 bracket: N_half -> crossover (below axis) */}
      <line
        x1={xHalf}
        y1={axisY + 26}
        x2={xCross}
        y2={axisY + 26}
        stroke={gapHalfCross.color}
        strokeWidth={2}
      />
      <line x1={xHalf} y1={axisY + 20} x2={xHalf} y2={axisY + 32} stroke={gapHalfCross.color} strokeWidth={2} />
      <line x1={xCross} y1={axisY + 20} x2={xCross} y2={axisY + 32} stroke={gapHalfCross.color} strokeWidth={2} />
      <text x={(xHalf + xCross) / 2} y={axisY + 46} textAnchor="middle" fill={gapHalfCross.color} fontSize={10.5} fontWeight={700}>
        ~{(gapHalfCross.relativeOffset * 100).toFixed(2)}%
      </text>
      <text x={(xHalf + xCross) / 2} y={axisY + 58} textAnchor="middle" fill="#64748b" fontSize={8.5}>
        E_flow displacement
      </text>

      {/* gap 2 bracket: crossover -> knee (above axis) */}
      <line
        x1={xCross}
        y1={axisY - 26}
        x2={xKnee}
        y2={axisY - 26}
        stroke={gapCrossKnee.color}
        strokeWidth={2}
      />
      <line x1={xCross} y1={axisY - 20} x2={xCross} y2={axisY - 32} stroke={gapCrossKnee.color} strokeWidth={2} />
      <line x1={xKnee} y1={axisY - 20} x2={xKnee} y2={axisY - 32} stroke={gapCrossKnee.color} strokeWidth={2} />
      <text x={(xCross + xKnee) / 2} y={axisY - 40} textAnchor="middle" fill={gapCrossKnee.color} fontSize={10.5} fontWeight={700}>
        ~{(gapCrossKnee.relativeOffset * 100).toFixed(2)}%
      </text>
      <text x={(xCross + xKnee) / 2} y={axisY - 52} textAnchor="middle" fill="#64748b" fontSize={8.5}>
        ramp-curvature offset
      </text>

      {/* locator ticks */}
      {points.map((p) => (
        <g key={p.key}>
          <line x1={p.x} y1={axisY - 6} x2={p.x} y2={axisY + 6} stroke="#e2e8f0" strokeWidth={1.5} />
          <circle cx={p.x} cy={axisY} r={4} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={1} />
          <text
            x={p.x}
            y={p.labelUp ? axisY - 14 : axisY + 14}
            textAnchor="middle"
            fill="#cbd5e1"
            fontSize={9.5}
            dominantBaseline={p.labelUp ? 'auto' : 'hanging'}
          >
            {p.short}
          </text>
          <text
            x={p.x}
            y={p.labelUp ? axisY - 3 : axisY + 25}
            textAnchor="middle"
            fill="#64748b"
            fontSize={8}
            dominantBaseline={p.labelUp ? 'auto' : 'hanging'}
          >
            {p.N.toExponential(4)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp34475FourLocatorClusterAxisViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Four-Locator 3.28e9 Landmark Cluster on One Shared Axis (imp-34475 / imp-34441)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34441 tabulated four independently-derived landmarks that all cluster near
        N &asymp; 3.28e9 on the sigma(N) post-peak curve -- the sigma=1/2 halving landmark
        N_half, the E_coll=E_trunc crossover located two ways (closed-form fixed point and
        downslope bisection, coincident to ~1.7e-15 relative), and the sigmoid-knee inflection
        N_knee_sigmoid -- but never plotted them on one axis. This viz places all four on a
        shared linear-N axis and brackets the two distinct gaps between them.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        shared axis: halving landmark, crossover (both methods, visually coincident), sigmoid knee
      </p>
      <LocatorClusterAxis />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>locator</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {IMP34475_ORDERED_LOCATORS.map((l) => (
            <tr key={l.key} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{l.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{l.N.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{l.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-data only, every
        locator value and gap reused verbatim from imp-34441 (which itself reuses imp-33723 /
        imp-33721 / imp-3444 verbatim) -- no recomputation. Reader-facing diagnostic, NOT a
        rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
        bound; no RH verdict, NO QED. Platt-Trudgian Lambda&le;0.2 remains SOTA.
      </div>
    </div>
  );
}
