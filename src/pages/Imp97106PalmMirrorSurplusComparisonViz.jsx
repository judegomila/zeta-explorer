import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97106_PREQ,
  IMP97106_SURPLUS_BARS,
  IMP97106_MAX_COUNT,
  IMP97106_VERDICT,
} from '../data/imp-97106-palm-mirror-surplus-comparison-viz-data.js';

// imp-97106: the imp-97080 measurement compares six mirror-count baselines against the
// required p_req = 4.3743, but shipped as literals inside a docstring/JSDoc table with no
// chart. This page renders every baseline as a bar against a shared p_req reference line, so
// the "how short does each baseline fall" comparison is legible at a glance.

function SurplusBarChart({ bars, preq, maxCount }) {
  const svgW = 720;
  const rowH = 34;
  const padL = 210;
  const padR = 70;
  const padT = 20;
  const svgH = padT + bars.length * rowH + 16;
  const cW = svgW - padL - padR;
  const xAt = (v) => (v / maxCount) * cW;
  const preqX = xAt(preq);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {bars.map((b, idx) => {
        const y = padT + idx * rowH;
        const w = xAt(b.count);
        return (
          <g key={b.key}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10} fontFamily="monospace">
              {b.label}
            </text>
            <rect x={padL} y={y + 5} width={cW} height={rowH - 14} fill="#1e293b" rx={3} />
            <rect x={padL} y={y + 5} width={w} height={rowH - 14} fill={b.color} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill="#e2e8f0" fontSize={9.5} fontFamily="monospace">
              {b.count.toFixed(3)} ({b.surplus.toFixed(3)}x)
            </text>
          </g>
        );
      })}
      <line
        x1={padL + preqX}
        y1={padT - 4}
        x2={padL + preqX}
        y2={padT + bars.length * rowH}
        stroke="#f87171"
        strokeWidth={1.4}
        strokeDasharray="5,3"
      />
      <text x={padL + preqX} y={padT - 8} textAnchor="middle" fill="#f87171" fontSize={9.5}>
        p_req = {preq.toFixed(4)}
      </text>
    </svg>
  );
}

export default function Imp97106PalmMirrorSurplusComparisonViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Palm Mirror-Count vs p_req: Surplus Comparison" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> H_desc-mirror(p_req)
        needs a measured mirror count &ge; p_req at the working row. Every baseline below is
        a finite-height / rigid-lattice / t = 0-proxy measurement (imp-97080); it supplies no
        uniform-in-t, all-x lower bound. Changes no &Lambda; bound; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        Six baseline mirror-count measurements at the working row (t0 = 0.1314, y0 = 0.165),
        each compared against the required constant pull p_req = {IMP97106_PREQ.toFixed(4)}
        &nbsp;(dashed line). The surplus factor p_req / count is annotated next to each bar --
        every value above 1x means that baseline falls short of the hypothesis.
      </p>

      <SurplusBarChart bars={IMP97106_SURPLUS_BARS} preq={IMP97106_PREQ} maxCount={IMP97106_MAX_COUNT} />

      <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '1rem', maxWidth: 700 }}>
        {IMP97106_VERDICT.note}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-97106 viz-data leaf (every value reused verbatim from imp-97080, no
        re-derivation). Changes no bound, establishes no operator positivity; Platt-Trudgian
        &Lambda;&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
