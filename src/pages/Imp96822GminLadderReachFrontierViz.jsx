import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96822_REACH_STAGES,
  IMP96822_ACQUISITION_SUMMARY,
  IMP96822_HONEST_BANNER,
} from '../data/imp-96822-gmin-ladder-reach-frontier-viz-data.js';
import { ED } from '../styles/tokens.js';

const STAGE_COLOR = { complete: ED.series3, partial: ED.series4, blocked: ED.series2 };

// Three-stage horizontal fill-fraction bar chart: the last COMPLETE dyadic
// block (k=19), the current TRUNCATED top rung (k=20, ~91% filled), and the
// next rung (k=21), which has zero data cached and is blocked on acquisition.
function ReachFrontierPanel() {
  const svgW = 720;
  const svgH = 200;
  const padL = 130;
  const padR = 90;
  const padT = 20;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const rowH = plotH / IMP96822_REACH_STAGES.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {[0, 0.5, 1].map((f) => (
        <g key={`grid${f}`}>
          <line
            x1={padL + f * plotW}
            y1={padT}
            x2={padL + f * plotW}
            y2={padT + plotH}
            stroke={ED.rule}
            strokeWidth={1}
          />
          <text x={padL + f * plotW} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {Math.round(f * 100)}%
          </text>
        </g>
      ))}
      {IMP96822_REACH_STAGES.map((s, i) => {
        const cy = padT + rowH * (i + 0.5);
        const barH = rowH * 0.5;
        return (
          <g key={s.k}>
            <text x={padL - 10} y={cy + 4} textAnchor="end" fill={ED.ink} fontSize={10}>
              {s.label}
            </text>
            <rect
              x={padL}
              y={cy - barH / 2}
              width={Math.max(plotW * s.fillFraction, 1)}
              height={barH}
              fill={STAGE_COLOR[s.status]}
              opacity={0.85}
            />
            <rect x={padL} y={cy - barH / 2} width={plotW} height={barH} fill="none" stroke={ED.rule} strokeWidth={1} />
            <text x={padL + plotW + 8} y={cy + 4} fill={ED.inkSoft} fontSize={9}>
              N&asymp;{Math.round(s.nCenter).toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp96822GminLadderReachFrontierViz() {
  const blocked = IMP96822_REACH_STAGES[2];
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Dyadic Block-Minima Ladder: Reach Frontier and Acquisition Requirement" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96822_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96754 pinned exactly where the imp-96629 / imp-96734 disjoint dyadic block-minima gap
        ladder stops. Green: the last COMPLETE block (k=19). Yellow: the current top rung (k=20) is
        only {(IMP96822_REACH_STAGES[1].fillFraction * 100).toFixed(2)}% filled &mdash; a minor
        optimism in the ladder&apos;s stated N-reach, though the block minimum itself remains valid.
        Red: the next rung (k=21) has zero data cached and needs{' '}
        {IMP96822_ACQUISITION_SUMMARY.nextRungExtraOrdinates.toLocaleString()} more consecutive
        ordinates than the {IMP96822_ACQUISITION_SUMMARY.zerosCached.toLocaleString()} currently
        cached &mdash; more than doubling the cache.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        fill fraction by dyadic rung
      </h3>
      <ReachFrontierPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> {IMP96822_ACQUISITION_SUMMARY.perRungRule}
        , so acquiring rung k={blocked.k} at N&asymp;
        {Math.round(blocked.nCenter).toLocaleString()} needs a contiguous ordinate list reaching well
        past the current cache &mdash; the same binding gap (contiguous zero-list length, not zero
        height) noted across the imp-96753/imp-96754 reach-frontier audits.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96822
        viz-data (all figures reused verbatim from imp-96754). {IMP96822_HONEST_BANNER}
      </div>
    </div>
  );
}
