import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97106_PREQ,
  IMP97106_SURPLUS_BARS,
  IMP97106_MAX_COUNT,
  IMP97106_VERDICT,
} from '../data/imp-97106-palm-mirror-surplus-comparison-viz-data.js';
import { ED } from '../styles/tokens.js';

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
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
              {b.label}
            </text>
            <rect x={padL} y={y + 5} width={cW} height={rowH - 14} fill={ED.paper3} rx={3} />
            <rect x={padL} y={y + 5} width={w} height={rowH - 14} fill={b.color} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill={ED.ink} fontSize={9.5} fontFamily="monospace">
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
        stroke={ED.series2}
        strokeWidth={1.4}
        strokeDasharray="5,3"
      />
      <text x={padL + preqX} y={padT - 8} textAnchor="middle" fill={ED.series2} fontSize={9.5}>
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
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> H_desc-mirror(p_req)
        needs a measured mirror count &ge; p_req at the working row. Every baseline below is
        a finite-height / rigid-lattice / t = 0-proxy measurement (imp-97080); it supplies no
        uniform-in-t, all-x lower bound. Changes no &Lambda; bound; no refereed bound is changed;
         RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        Six baseline mirror-count measurements at the working row (t0 = 0.1314, y0 = 0.165),
        each compared against the required constant pull p_req = {IMP97106_PREQ.toFixed(4)}
        &nbsp;(dashed line). The surplus factor p_req / count is annotated next to each bar --
        every value above 1x means that baseline falls short of the hypothesis.
      </p>

      <SurplusBarChart bars={IMP97106_SURPLUS_BARS} preq={IMP97106_PREQ} maxCount={IMP97106_MAX_COUNT} />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '1rem', maxWidth: 700 }}>
        {IMP97106_VERDICT.note}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-97106 viz-data leaf (every value reused verbatim from imp-97080, no
        re-derivation). Changes no bound, establishes no operator positivity; RH open; NO QED.
      </div>
    </div>
  );
}
