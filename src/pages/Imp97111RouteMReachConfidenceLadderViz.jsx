import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97111_CONFIDENCE_LADDER,
  IMP97111_RESIDUAL_BARS,
  IMP97111_VERDICT,
} from '../data/imp-97111-route-m-reach-confidence-ladder-viz-data.js';

// imp-97111: the imp-97060 confidence table (10/5/1 percent target spread -> N_top) and the
// anchor back-check (law-vs-exact residual at 9 truncation rungs) shipped as literals inside a
// docstring table with no chart. This page renders both as bars: the confidence ladder on a
// log10(N_top) axis (the ~3.3-decade reach), and the signed residuals against zero.

function ConfidenceLadderChart({ rungs }) {
  const svgW = 640;
  const rowH = 40;
  const padL = 90;
  const padR = 90;
  const padT = 20;
  const svgH = padT + rungs.length * rowH + 16;
  const cW = svgW - padL - padR;
  const maxLog = Math.max(...rungs.map((r) => r.log10NTop));
  const minLog = Math.min(0, ...rungs.map((r) => r.log10NTop));
  const xAt = (v) => ((v - minLog) / (maxLog - minLog)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rungs.map((r, idx) => {
        const y = padT + idx * rowH;
        const w = xAt(r.log10NTop);
        const color = r.aboveCurrentTopRung ? '#f87171' : r.insideExactWindow ? '#4ade80' : '#38bdf8';
        return (
          <g key={r.targetSpreadPct}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10.5} fontFamily="monospace">
              S* = {r.label}
            </text>
            <rect x={padL} y={y + 6} width={cW} height={rowH - 16} fill="#1e293b" rx={3} />
            <rect x={padL} y={y + 6} width={w} height={rowH - 16} fill={color} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill="#e2e8f0" fontSize={9.5} fontFamily="monospace">
              N_top &asymp; {r.nTopRequired.toExponential(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ResidualBarChart({ bars }) {
  const svgW = 640;
  const rowH = 28;
  const padL = 90;
  const padR = 60;
  const padT = 20;
  const svgH = padT + bars.length * rowH + 16;
  const cW = svgW - padL - padR;
  const maxAbs = Math.max(...bars.map((b) => Math.abs(b.residualPct)));
  const mid = padL + cW / 2;
  const xAt = (v) => (v / maxAbs) * (cW / 2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={mid} y1={padT - 4} x2={mid} y2={padT + bars.length * rowH} stroke="#475569" strokeWidth={1} />
      {bars.map((b, idx) => {
        const y = padT + idx * rowH;
        const w = xAt(b.residualPct);
        const color = b.isImp96912Anchor ? '#fbbf24' : b.inFitWindow ? '#4ade80' : '#94a3b8';
        return (
          <g key={b.nTop}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={9.5} fontFamily="monospace">
              N={b.nTop}
            </text>
            <rect
              x={w >= 0 ? mid : mid + w}
              y={y + 4}
              width={Math.abs(w)}
              height={rowH - 12}
              fill={color}
              rx={2}
            />
            <text
              x={w >= 0 ? mid + w + 6 : mid - Math.abs(w) - 6}
              y={y + rowH / 2 + 4}
              textAnchor={w >= 0 ? 'start' : 'end'}
              fill="#e2e8f0"
              fontSize={9}
              fontFamily="monospace"
            >
              {b.residualPct >= 0 ? '+' : ''}
              {b.residualPct.toFixed(3)} pp
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97111RouteMReachConfidenceLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Reach-Threshold Confidence Ladder" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> only the trace ceiling
        T &asymp; 2.594e7 is rigorous; F, M inherit non-rigorous extrapolations. The 1-percent
        rung (N_top &asymp; 2.01e7) reaches &asymp;49% of N* -- a downward extrapolation. Changes
        no &Lambda; bound; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Confidence ladder: the imp-97033 log-decay law inverted at each target ceiling spread
        S*, giving the top exact rung N_top needed. Green = inside the exact ladder window
        (8000..24000); blue = above the current top rung; red = a downward extrapolation below it.
      </p>
      <ConfidenceLadderChart rungs={IMP97111_CONFIDENCE_LADDER} />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '1.25rem 0 0.5rem', maxWidth: 700 }}>
        Anchor back-check: signed residual (law minus exact spread, percentage points) at each of
        the 9 imp-97033 truncation rungs. Amber = the two imp-96912 anchor rungs (N=16000, 24000).
      </p>
      <ResidualBarChart bars={IMP97111_RESIDUAL_BARS} />

      <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '1rem', maxWidth: 700 }}>
        {IMP97111_VERDICT.note}
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
        imp-97111 viz-data leaf (every value reused verbatim from imp-97060, no re-derivation).
        Changes no bound, establishes no operator positivity; Platt-Trudgian &Lambda;&le;0.2
        remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
