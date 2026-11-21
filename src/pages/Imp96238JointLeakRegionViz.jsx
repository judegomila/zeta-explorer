import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96238_BOUNDARY_CURVE,
  IMP96238_SLICE_POINTS,
  IMP96238_MARKERS,
  IMP96238_ANCHORS,
  IMP96238_HONEST_BANNER,
} from '../data/imp-96238-joint-leak-region-viz-data.js';
import { ED } from '../styles/tokens.js';

function JointLeakRegionChart() {
  const svgW = 680;
  const svgH = 400;
  const padL = 70;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const SCALE = 1e3; // plot in units of 1e-3 for readable ticks
  const xMax = IMP96238_ANCHORS.separateAdjacentEps * SCALE * 1.08;
  const yMax = IMP96238_ANCHORS.separateBottomEps * SCALE * 1.12;

  const xOf = (epsA) => padL + (epsA * SCALE / xMax) * plotW;
  const yOf = (epsB) => padT + plotH - (epsB * SCALE / yMax) * plotH;

  const xTicks = [0, 2, 4, 6, 8];
  const yTicks = [0, 0.4, 0.8, 1.2];

  const boundaryPath = IMP96238_BOUNDARY_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.epsA).toFixed(2)} ${yOf(p.epsB).toFixed(2)}`)
    .join(' ');

  // Shaded admissible region: everything below the boundary curve, down to the axes.
  const shadedPath = `${boundaryPath} L ${xOf(IMP96238_BOUNDARY_CURVE[IMP96238_BOUNDARY_CURVE.length - 1].epsA).toFixed(2)} ${yOf(0).toFixed(2)} `
    + `L ${xOf(0).toFixed(2)} ${yOf(0).toFixed(2)} Z`;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v / SCALE)} x2={padL + plotW} y2={yOf(v / SCALE)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v / SCALE) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`${v}e-3`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v / SCALE)} y1={padT} x2={xOf(v / SCALE)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(v / SCALE)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>{`${v}e-3`}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {/* shaded admissible (certified U < 1) region */}
      <path d={shadedPath} fill={ED.series1} opacity={0.14} stroke="none" />
      <path d={boundaryPath} fill="none" stroke={ED.series1} strokeWidth={1.5} opacity={0.9} />

      {/* equal-split diagonal ray for reference */}
      <line
        x1={xOf(0)} y1={yOf(0)}
        x2={xOf(IMP96238_ANCHORS.equalSplitPerChannelEps * 1.5)} y2={yOf(IMP96238_ANCHORS.equalSplitPerChannelEps * 1.5)}
        stroke={ED.rule} strokeWidth={0.75} strokeDasharray="3 3" opacity={0.6}
      />

      {IMP96238_SLICE_POINTS.map((p) => (
        <circle key={`slice-${p.epsA}`} cx={xOf(p.epsA)} cy={yOf(p.epsB)} r={2.4} fill="#94a3b8" />
      ))}

      <circle cx={xOf(IMP96238_MARKERS.pureBottom.epsA)} cy={yOf(IMP96238_MARKERS.pureBottom.epsB)} r={3.6} fill={ED.series3} />
      <text x={xOf(IMP96238_MARKERS.pureBottom.epsA) + 6} y={yOf(IMP96238_MARKERS.pureBottom.epsB) - 4} fill={ED.series3} fontSize={8.5}>
        pure-bottom worst case (1.192e-3)
      </text>

      <circle cx={xOf(IMP96238_MARKERS.equalSplit.epsA)} cy={yOf(IMP96238_MARKERS.equalSplit.epsB)} r={3.6} fill={ED.brassDeco} />
      <text x={xOf(IMP96238_MARKERS.equalSplit.epsA) + 6} y={yOf(IMP96238_MARKERS.equalSplit.epsB) + 12} fill={ED.brass} fontSize={8.5}>
        equal-split (1.180627e-3/channel)
      </text>

      <circle cx={xOf(IMP96238_MARKERS.fullAdjacent.epsA)} cy={yOf(IMP96238_MARKERS.fullAdjacent.epsB)} r={3.6} fill={ED.series2} />
      <text x={xOf(IMP96238_MARKERS.fullAdjacent.epsA) - 6} y={yOf(IMP96238_MARKERS.fullAdjacent.epsB) - 8} textAnchor="end" fill={ED.series2} fontSize={8.5}>
        full adjacent (bottom collapses)
      </text>

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        adjacent leak eps_a (into lam_2)
      </text>
      <text x={20} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 20 ${padT + plotH / 2})`}>
        tolerable bottom leak eps_b (into lam_S(1))
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <rect x={0} y={-6} width={10} height={10} fill={ED.series1} opacity={0.14} />
        <text x={14} y={2} fill={ED.inkSoft} fontSize={8.5}>certified region U &lt; 1 (below boundary)</text>
      </g>
    </svg>
  );
}

export default function Imp96238JointLeakRegionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96206: Joint (eps_a, eps_b) Kato-Temple Certify Region" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96238_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-96206 3-level test function [1, eps_a, eps_b] opens both leak channels at once:
        eps_a leaks into the cheap adjacent eigenvalue lam_2, eps_b leaks into the expensive
        bottom-twin eigenvalue lam_S(1). The shaded region is the set of (eps_a, eps_b) pairs for
        which the Kato-Temple upper bound still certifies U &lt; 1. It is <em>not</em> a rectangle:
        the boundary curve bows in below the axis-aligned separate thresholds, so any simultaneous
        adjacent leak strictly tightens the tolerable bottom overlap.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Non-rectangular admissible region (grey dots: the five imp-96206 baked coupled slices)
      </h3>
      <JointLeakRegionChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the worst-case
        total-magnitude threshold (green, 1.192e-3) sits at eps_a = 0 &mdash; the pure-bottom
        direction &mdash; because the adjacent channel costs ~7&times; less sigma&sup2; per unit
        overlap&sup2;. Moving right along the boundary trades bottom tolerance for adjacent
        tolerance, but the equal-split ray (dashed) crosses the boundary strictly inside the
        separate-threshold rectangle (yellow, 1.180627e-3 per channel), and the curve collapses to
        ~0 tolerable bottom leak once eps_a reaches the full separate adjacent threshold (red).
        Treating the two leak channels as independently bounded is optimistic.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96206 baked boundary function and literals verbatim (only the plot-resolution
        sampling is computed here). Changes no bound, establishes no operator positivity, no RH
        claim. NO QED.
      </div>
    </div>
  );
}
