import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  SEAM_GRAM_ONSET_LADDER_TABLE,
  SEAM_GRAM_ONSET_LADDER_ATTRIBUTION,
} from '../data/imp-95609-seam-gram-onset-ladder-table.js';
import { ED } from '../styles/tokens.js';

const RUNG_COLORS = {
  'SPLIT-RZ': ED.series3,
  'SPLIT-OPT': ED.series1,
  'SPLIT-SEP': ED.series8,
  'SPLIT-LOO': ED.series4,
  XSTAR_UNIF: ED.series7,
};

function SeamGramOnsetBarChart() {
  const rows = SEAM_GRAM_ONSET_LADDER_TABLE;
  const svgW = 680;
  const svgH = 360;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 96;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxOnset = Math.max(...rows.map((r) => r.onset));
  const minOnset = 0;
  const yOf = (v) => padT + plotH - ((v - minOnset) / (maxOnset - minOnset)) * plotH;
  const barW = plotW / rows.length;

  const yTicks = [0, 5, 10, 15, 20, 25, 30];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <line
            x1={padL}
            y1={yOf(v)}
            x2={padL + plotW}
            y2={yOf(v)}
            stroke={ED.ruleSoft}
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        every-octave onset
      </text>
      {rows.map((r, i) => {
        const x = padL + i * barW + barW * 0.15;
        const w = barW * 0.7;
        const y = yOf(r.onset);
        const h = padT + plotH - y;
        return (
          <g key={r.rung}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={RUNG_COLORS[r.rung] || '#94a3b8'}
              opacity={r.kind === 'off-lattice, superseded' ? 0.45 : 0.9}
              stroke={ED.paper}
              strokeWidth={1}
            />
            <text x={x + w / 2} y={y - 6} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
              {r.onset}
            </text>
            <text
              x={x + w / 2}
              y={padT + plotH + 16}
              textAnchor="end"
              fill={ED.inkSoft}
              fontSize={9}
              transform={`rotate(-35 ${x + w / 2} ${padT + plotH + 16})`}
            >
              {r.rung}
            </text>
            <text
              x={x + w / 2}
              y={padT + plotH + 42}
              textAnchor="end"
              fill={ED.inkFaint}
              fontSize={7.5}
              transform={`rotate(-35 ${x + w / 2} ${padT + plotH + 42})`}
            >
              #{r.rank} {r.kind}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp95623SeamGramOnsetLadderViz() {
  const attr = SEAM_GRAM_ONSET_LADDER_ATTRIBUTION;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Five-Rung Seam-Gram Every-Octave Onset Ladder (SPLIT-RZ 15.98 -> XSTAR_UNIF 27.04)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a reader-facing consolidation
        of five already-established firing-onset certificates (imp-95335 / imp-95419 / imp-95475),
        not a new theorem. It changes no Lambda bound and establishes no operator positivity.
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. RH does not follow from
        anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Each bar is a distinct every-octave-twin firing-onset certificate for the same seam-Gram
        Riesz floor problem, ordered by increasing onset depth x. SPLIT-SEP (dimmed) is the
        imp-95335 Ingham-type floor, superseded by SPLIT-OPT&apos;s class-optimal scalar floor
        (imp-95419 THEOREM SEP-OPT) by {attr.supersessionLn2.toFixed(4)}&times; at &delta; = ln 2.
        SPLIT-LOO and XSTAR_UNIF coincide exactly at 27.035582 (imp-95475 robustness check), so
        the ladder has five named rungs but four distinct onset values.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Onset depth x by rung
      </h3>
      <SeamGramOnsetBarChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> SPLIT-RZ (green) is the
        sharpest rung at x = 15.981584, using a lattice-pinned twin-pair Toeplitz symbol that has
        not been ported off-lattice. SPLIT-OPT (blue) is the off-lattice class-optimal floor at
        x = 20.593144, a {attr.onsetDropSplitSepToSplitOpt.toFixed(6)} depth-unit drop below the
        superseded SPLIT-SEP (grey, dimmed) at x = 23.157604. SPLIT-LOO and XSTAR_UNIF (orange /
        pink) tie exactly at x = 27.035582. The residual gap of{' '}
        {attr.residualGapSplitOptToSplitRz.toFixed(6)} depth units between SPLIT-OPT and SPLIT-RZ
        is attributed to {attr.residualGapAttribution.toLowerCase()}, not to scalar-floor slack
        &mdash; that slack was already closed by SEP-OPT.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-95609
        reader-facing table (itself consolidating imp-95457 / imp-95335 / imp-95419 / imp-95475).
        Changes no bound, establishes no operator positivity, no RH claim; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
