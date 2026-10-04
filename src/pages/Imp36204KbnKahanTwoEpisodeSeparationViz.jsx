import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION } from '../data/imp-36186-kbn-kahan-two-episode-separation-viz-data.js';
import { ED } from '../styles/tokens.js';

const EPISODE_COLOR = {
  pre: ED.series8,
  transient: ED.series4,
  tiePlateau: ED.series1,
  persistent: ED.series7,
};

const EPISODE_LABEL = {
  pre: 'pre-ladder',
  transient: 'transient separation',
  tiePlateau: 'tie plateau',
  persistent: 'persistent separation',
};

// Single-series chart of the KBN/Kahan error ratio vs log10 N across the imp-36112
// merged sixteen-rung ladder, colored by episode: a transient separation at
// N=1500-3000, a tie plateau (ratio pinned at 1) at N=10000-33000, and a
// persistent separation deepening from N~34000 upward.
function SeparationCurve() {
  const points = IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION;
  const svgW = 640;
  const padL = 48;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 320;
  const padT = 24;
  const padB = 56;
  const plotH = svgH - padT - padB;

  const log10N = points.map((p) => Math.log10(p.N));
  const minX = Math.min(...log10N);
  const maxX = Math.max(...log10N);
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;

  const maxRatio = Math.max(...points.map((p) => p.ratio));
  const yOf = (v) => padT + plotH - (v / maxRatio) * plotH;

  const xTicks = [3, 3.5, 4, 4.5, 5, 5.5, 6];
  const yTicks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}x
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        kahanNormErr / kbnNormErr ratio
      </text>

      <polyline
        points={points.map((p) => `${xOf(Math.log10(p.N))},${yOf(p.ratio)}`).join(' ')}
        fill="none"
        stroke={ED.rule}
        strokeWidth={1.5}
        opacity={0.7}
      />

      {points.map((p) => (
        <circle
          key={p.N}
          cx={xOf(Math.log10(p.N))}
          cy={yOf(p.ratio)}
          r={5}
          fill={EPISODE_COLOR[p.episode]}
          stroke={ED.paper}
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

export default function Imp36204KbnKahanTwoEpisodeSeparationViz() {
  const points = IMP36186_KBN_KAHAN_TWO_EPISODE_SEPARATION;
  const transient = points.filter((p) => p.episode === 'transient');
  const tiePlateau = points.filter((p) => p.episode === 'tiePlateau');
  const persistent = points.filter((p) => p.episode === 'persistent');
  const endpoint = points[points.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="KBN vs Classic Kahan: Two-Episode Separation Record (imp-36112 / imp-36186 / imp-36204)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-36112 cross-reference note merges the imp-36062 and imp-36076 ladders into one
        N-ordered record of the Kahan/KBN compensated-summation error ratio. Rather than a single
        clean crossover, the merged record shows three regions in N order: a{' '}
        <span style={{ color: EPISODE_COLOR.transient }}>transient separation</span> at N =
        1500-3000 (ratio up to {Math.max(...transient.map((p) => p.ratio)).toFixed(2)}x, visible only
        on the finer small-N grid), a <span style={{ color: EPISODE_COLOR.tiePlateau }}>tie
        plateau</span> at N = 10000-33000 ({tiePlateau.length} bit-identical rungs, ratio pinned at
        1), and a <span style={{ color: EPISODE_COLOR.persistent }}>persistent separation</span>{' '}
        from N ~ 34000 upward that deepens to {endpoint.ratio.toFixed(2)}x by N ~ {endpoint.N}.
      </p>

      <SeparationCurve />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
        {Object.keys(EPISODE_LABEL).filter((k) => points.some((p) => p.episode === k)).map((k) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: EPISODE_COLOR[k], display: 'inline-block' }} />
            {EPISODE_LABEL[k]}
          </span>
        ))}
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation-only consumer of
        the baked imp-36186 viz-data (itself reusing the recorded imp-36062/imp-36076 per-rung
        literals verbatim, per imp-36112's reconciliation); no new derivation, no bound changed.
        The W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and the certified
        length-N interval sum stays MECHANICAL (imp-35725); no RH verdict, NO QED.
      </div>
    </div>
  );
}
