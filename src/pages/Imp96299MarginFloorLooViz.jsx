import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96299_LOO_SERIES,
  IMP96299_LTO_BAND,
  IMP96299_ANCHORS,
  IMP96299_HONEST_BANNER,
} from '../data/imp-96299-margin-floor-loo-viz-data.js';
import { ED } from '../styles/tokens.js';

function MarginFloorLooChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const n = IMP96299_LOO_SERIES.length;
  const yMin = 0.10;
  const yMax = 0.22;

  const xOf = (i) => padL + ((i + 0.5) / n) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [0.10, 0.12, 0.14, 0.16, 0.18, 0.20, 0.22];

  const fullFitY = yOf(IMP96299_ANCHORS.fullFitFloor);
  const ltoMinY = yOf(IMP96299_LTO_BAND.min);
  const ltoMaxY = yOf(IMP96299_LTO_BAND.max);
  const barW = (plotW / n) * 0.55;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(2)}</text>
        </g>
      ))}

      {/* LTO min/max band across all 21 leave-two-out refits */}
      <rect
        x={padL}
        y={ltoMaxY}
        width={plotW}
        height={ltoMinY - ltoMaxY}
        fill={ED.series5}
        opacity={0.08}
      />
      <text x={padL + plotW - 4} y={ltoMaxY - 4} textAnchor="end" fill={ED.series5} fontSize={8}>
        LTO band [{IMP96299_LTO_BAND.min.toFixed(3)}, {IMP96299_LTO_BAND.max.toFixed(3)}] (21 refits)
      </text>

      {/* full 7-point fit reference line */}
      <line x1={padL} y1={fullFitY} x2={padL + plotW} y2={fullFitY} stroke={ED.series3} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      <text x={padL + 4} y={fullFitY - 4} fill={ED.series3} fontSize={8}>
        full-fit floor {IMP96299_ANCHORS.fullFitFloor.toFixed(5)}
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96299_LOO_SERIES.map((row, i) => {
        const x = xOf(i);
        const y = yOf(row.floor);
        const isHigh = row.isHighestLeverage;
        return (
          <g key={`loo-${row.droppedT}`}>
            <rect
              x={x - barW / 2}
              y={y}
              width={barW}
              height={padT + plotH - y}
              fill={isHigh ? ED.brassDeco : ED.series1}
              opacity={isHigh ? 0.9 : 0.75}
            />
            <text x={x} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              {row.droppedT.toFixed(0)}
            </text>
            <text x={x} y={y - 5} textAnchor="middle" fill={isHigh ? ED.brass : ED.inkSoft} fontSize={8}>
              {row.floor.toFixed(3)}
            </text>
          </g>
        );
      })}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        dropped height cutoff T (leave-one-out)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <rect x={0} y={-8} width={12} height={10} fill={ED.brassDeco} opacity={0.9} />
        <text x={16} y={0} fill={ED.inkSoft} fontSize={8.5}>
          highest-leverage drop: T={IMP96299_ANCHORS.highestLeverageT.toFixed(0)} (floor {IMP96299_ANCHORS.highestLeverageFloor.toFixed(3)})
        </text>
      </g>
    </svg>
  );
}

export default function Imp96299MarginFloorLooViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96265: Margin-Floor Leave-One-Out / Leave-Two-Out Refit Spread" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96299_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-96173/imp-96148 fit of the Route B/D worst-support margin column rho(32,T) to
        rho = c + d/ln(T) reports a positive floor c = 0.14256 from only seven height cutoffs.
        imp-96265 refit the same law on every leave-one-out (7) and leave-two-out (21) subset of
        those cutoffs to test whether the floor is a genuine asymptote or a short-column artifact.
        The floor never crosses zero in any refit, but its magnitude is endpoint-driven: dropping
        the shortest cutoff, T = 60, lifts the floor from 0.14256 to 0.17740 (+24%), the largest
        single-point move of any of the seven drops.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        LOO refit floor by dropped height cutoff (T=60 leverage highlighted)
      </h3>
      <MarginFloorLooChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each bar is the refit
        floor after dropping one of the seven height cutoffs (leave-one-out); the amber bar marks
        the highest-leverage drop, T = 60, which pulls the floor furthest above the full-fit
        reference line (green, dashed). The shaded purple band spans the min/max floor across all
        21 leave-two-out refits, [{IMP96299_LTO_BAND.min.toFixed(3)}, {IMP96299_LTO_BAND.max.toFixed(3)}]
        &mdash; every one of those 21 refits still clears 0.1, well clear of a zero crossing.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96265
        baked LOO/LTO refit tables verbatim (only the sort and delta computation happen here). The
        positive-floor sign is robust; the 0.14256 figure is an order-of-magnitude floor, not a
        sharp value. Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
