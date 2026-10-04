import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97467_LADDERS,
  IMP97467_B_LADDER,
} from '../data/imp-97467-route-m-crossover-fraction-tolerance-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97467: visualizes the imp-97441 measurement of the boundary-to-bulk
// crossover fraction x*(eps) = A(b)/b across eps in {0.5%,1%,2%,5%} on the
// b-ladder {1000,2000,4000,8000,16000}: flat (b-independent) at 0.5%/2%/5%,
// BIMODAL (a step) at 1%.

function TolerancePanel({ ladder }) {
  const svgW = 640;
  const svgH = 130;
  const padL = 70;
  const padR = 24;
  const padT = 14;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = ladder.points.map((p) => p.x);
  const yMin = Math.min(...xs);
  const yMax = Math.max(...xs);
  const pad = ladder.bIndependent ? Math.max((yMax - yMin) * 4, 0.003) : (yMax - yMin) * 0.15;
  const lo = yMin - pad;
  const hi = yMax + pad;

  // log-spaced x axis over the b-ladder (each rung is 2x the previous).
  const logB = IMP97467_B_LADDER.map((b) => Math.log2(b));
  const minLogB = logB[0];
  const maxLogB = logB[logB.length - 1];
  const xOf = (b) => padL + ((Math.log2(b) - minLogB) / (maxLogB - minLogB)) * plotW;
  const yOf = (v) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;

  const color = ladder.bIndependent ? ED.series3 : ED.series2;

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

        {/* y ticks: min/max of this row */}
        {[yMin, yMax].map((v) => (
          <g key={`y${v}`}>
            <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
            <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
              {v.toFixed(5)}
            </text>
          </g>
        ))}

        {/* x ticks: the b-ladder */}
        {IMP97467_B_LADDER.map((b) => (
          <text key={`x${b}`} x={xOf(b)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {b}
          </text>
        ))}

        <polyline
          points={ladder.points.map((p) => `${xOf(p.b)},${yOf(p.x)}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={ladder.bIndependent ? undefined : '5 3'}
        />
        {ladder.points.map((p) => (
          <circle key={p.b} cx={xOf(p.b)} cy={yOf(p.x)} r={3} fill={color} />
        ))}

        <text x={padL} y={padT - 2} fill={ED.ink} fontSize={10} fontWeight="bold">
          eps = {ladder.label} {ladder.bIndependent ? '(flat)' : '(BIMODAL)'}
        </text>
      </svg>
      <div style={{ paddingLeft: padL, fontSize: '0.72rem', color: 'var(--ink-faint)' }}>
        {ladder.note} &mdash; ladder spread {ladder.ladderSpread.toExponential(1)}
      </div>
    </div>
  );
}

export default function Imp97467CrossoverFractionToleranceLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97441: The Route M Crossover Fraction x*(eps) Across Four Tolerances" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> measurement
        only. The crossover fraction x*(eps) = A(b)/b (largest a/b with the
        linearized Vasyunin profile accurate to eps) is tabulated across the
        b-ladder at four tolerances; it establishes no operator positivity and
        moves no bound. The rigorous anchor stays T = 2.594e7; PT
        Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Each panel plots x*(eps) against b (log-spaced) at one tolerance. At
        eps = 0.5%, 2%, 5% the fraction is flat to 3-4 digits across the whole
        b-ladder (green, solid). At eps = 1% it instead STEPS from 0.199
        (b&le;2000) to 0.1665 (b&ge;4000, red, dashed): two crests of the
        signed deviation (I - I_lin)/I straddle the 1% level, so the
        first-exceedance crossing jumps between them as b grows &mdash; an
        oscillation-marginal tolerance, not a breakdown of the underlying
        linear scale A(b) = x*(eps) b.
      </p>

      {IMP97467_LADDERS.map((ladder) => (
        <TolerancePanel key={ladder.eps} ladder={ladder} />
      ))}

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each
        panel has its OWN y-axis scale (the four fractions span roughly 0.10
        to 0.94), so compare shape (flat vs stepped), not absolute height,
        across panels. The 1% panel's y-range is deliberately widened to show
        the step; the other three panels are zoomed tightly around their flat
        value to make the sub-1e-3 spread visible.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        consuming the imp-97441 x*(eps) table verbatim; no re-solve.
        Establishes no operator positivity; changes no bound; the imp-97437
        effective-curvature fixed point (kappa_eff = 0.0995) fits this table
        only in the mid-band eps ~ 1%-2%; PT Lambda&le;0.2 remains SOTA; RH
        open; NO QED.
      </div>
    </div>
  );
}
