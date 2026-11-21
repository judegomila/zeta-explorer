import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96378_OVERLAP_CURVE,
  IMP96378_ANCHORS,
  IMP96378_HONEST_BANNER,
} from '../data/imp-96378-route-m-beat-period-overlap-viz-data.js';
import { IMP96344_SYNTHETIC_VS_REAL_NOTE } from '../data/imp-96344-route-m-synthetic-span-identifiability.js';
import { ED } from '../styles/tokens.js';

function OverlapCurveChart() {
  const svgW = 680;
  const svgH = 360;
  const padL = 50;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 0;
  const xMax = 13;
  const yMin = 0;
  const yMax = 1;

  const xOf = (L) => padL + ((L - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const path = IMP96378_OVERLAP_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.L).toFixed(2)} ${yOf(p.overlap).toFixed(2)}`)
    .join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = [0, 2, 4, 6, 8, 10, 12];

  const { currentSpan, sidelobeBump, firstTrueNull, beatPeriod } = IMP96378_ANCHORS;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(2)}</text>
        </g>
      ))}

      {/* beat period reference line -- the Rayleigh resolution span 2 pi / (w4 - w5) */}
      <line x1={xOf(beatPeriod.L)} y1={padT} x2={xOf(beatPeriod.L)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={path} fill="none" stroke={ED.series1} strokeWidth={1.75} opacity={0.95} />

      {/* imp-96344 baked anchors */}
      <circle cx={xOf(currentSpan.L)} cy={yOf(currentSpan.overlap)} r={4} fill={ED.series7} />
      <circle cx={xOf(sidelobeBump.L)} cy={yOf(sidelobeBump.overlap)} r={4} fill={ED.brassDeco} />
      <circle cx={xOf(firstTrueNull.L)} cy={yOf(firstTrueNull.overlap)} r={4} fill={ED.series3} />

      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        window span L in log N
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <circle cx={9} cy={0} r={4} fill={ED.series7} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>current span L={currentSpan.L.toFixed(4)}, overlap {currentSpan.overlap.toFixed(4)}</text>
        <circle cx={9} cy={16} r={4} fill={ED.brassDeco} />
        <text x={22} y={19} fill={ED.inkSoft} fontSize={8.5}>sidelobe bump L={sidelobeBump.L.toFixed(2)}, overlap {sidelobeBump.overlap.toFixed(2)}</text>
        <circle cx={9} cy={30} r={4} fill={ED.series3} />
        <text x={22} y={33} fill={ED.inkSoft} fontSize={8.5}>first true null L={firstTrueNull.L.toFixed(4)}, overlap {firstTrueNull.overlap.toExponential(1)}</text>
        <line x1={2} y1={44} x2={16} y2={44} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" />
        <text x={22} y={47} fill={ED.inkSoft} fontSize={8.5}>analytic beat period 2&pi;/(w4-w5) = {beatPeriod.L.toFixed(4)}</text>
      </g>
    </svg>
  );
}

export default function Imp96378RouteMBeatPeriodOverlapViz() {
  const { currentSpan, sidelobeBump, firstTrueNull, requiredNmaxMarginal } = IMP96378_ANCHORS;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96344: Route M Adjacent Conductor-Tone (q=4/q=5) Overlap vs Window Span" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96378_HONEST_BANNER}
      </div>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Synthetic vs real:</strong> {IMP96344_SYNTHETIC_VS_REAL_NOTE}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96344 found that the adjacent Route M conductor lines q=4 and q=5 (angular frequencies
        w4 and w5, spacing dw = w4 - w5 = 0.6284) cannot be resolved at the current window span
        L = {currentSpan.L.toFixed(4)} in log N: their normalized overlap is only
        {' '}{currentSpan.overlap.toFixed(4)}, a Dirichlet-sidelobe coincidence rather than genuine
        resolution. The overlap actually RISES to {sidelobeBump.overlap.toFixed(2)} near L = {sidelobeBump.L},
        before falling to a true null near L = {firstTrueNull.L.toFixed(2)} (N &#8776; {requiredNmaxMarginal.toExponential(2)}),
        one Rayleigh beat period 2&pi;/dw away from the start of the window.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Overlap |corr(cos w4 x, cos w5 x)| vs window span L
      </h3>
      <OverlapCurveChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the pink marker is where the
        current N=1e4 Vasyunin Gram run sits &mdash; low overlap, but for the wrong reason (a sidelobe
        coincidence, not resolution). The yellow marker shows the overlap climbing back up near L=7.5;
        only past the green marker, one full beat period out, does the correlation genuinely collapse.
        Reaching that green marker in real data needs N &#8776; 5.5e6, far beyond the current brute-force
        Gram reach of N=1e4.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page. The three marked anchors are
        copied verbatim from imp-96344; the connecting curve is a closed-form reconstruction of the same
        overlap definition computed here (product-to-sum trig identity, no sampling or fitting), verified
        to agree with the baked anchors to within their own rounding. Establishes no operator positivity,
        moves no Lambda bound, and does not decide whether the real Route M data carries a genuine
        multi-conductor band (imp-96344 F4: that needs the actual Vasyunin Gram at N ~ 5.5e6..1.2e11).
        Changes no bound, no RH claim. NO QED.
      </div>
    </div>
  );
}
