import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124840_LADDER_ROWS,
  IMP124840_SPACING_ROWS,
  IMP124840_SPACING_RATIO_LIMIT,
} from '../data/imp-124840-fartail-per-nine-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-124793 pure per-nine ladder verbatim (no new computation): log10 N climbing
// 5.30 -> 45.43 -> 437.29 -> 4346.94 for t = 0.9/0.99/0.999/0.9999, and the consecutive spacing
// ratio climbing toward the 10 limit (one added nine costs a ten-fold jump in log10 N).

function Log10NLadderChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const maxV = Math.max(...IMP124840_LADDER_ROWS.map((r) => r.log10N)) * 1.1;
  const yAt = (v) => padT + cH - (v / maxV) * cH;
  const barW = 110;
  const gap = (cW - IMP124840_LADDER_ROWS.length * barW) / (IMP124840_LADDER_ROWS.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, maxV / 2, maxV].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(0)}
          </text>
        </g>
      ))}

      {IMP124840_LADDER_ROWS.map((r, i) => {
        const x = padL + gap + i * (barW + gap);
        return (
          <g key={r.target}>
            <rect
              x={x}
              y={yAt(r.log10N)}
              width={barW}
              height={cH - (yAt(r.log10N) - padT)}
              fill={ED.series1}
              opacity={0.85}
            />
            <text x={x + barW / 2} y={yAt(r.log10N) - 6} textAnchor="middle" fill={ED.ink} fontSize={10} fontWeight={700}>
              {r.log10N.toFixed(4)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
              t = {r.target}
            </text>
            <text x={x + barW / 2} y={padT + cH + 29} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              {r.nines} nine{r.nines === 1 ? '' : 's'}
            </text>
          </g>
        );
      })}
      <text x={padL - 48} y={padT - 6} fill={ED.inkFaint} fontSize={9}>log10 N</text>
    </svg>
  );
}

function SpacingRatioChart() {
  const svgW = 720;
  const svgH = 200;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const vMax = IMP124840_SPACING_RATIO_LIMIT * 1.1;
  const yAt = (v) => padT + cH - (v / vMax) * cH;
  const ratios = IMP124840_SPACING_ROWS.filter((r) => r.ratioToPrev !== null);
  const barW = 130;
  const gap = (cW - ratios.length * barW) / (ratios.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {/* ratio -> 10 limit line */}
      <line
        x1={padL}
        y1={yAt(IMP124840_SPACING_RATIO_LIMIT)}
        x2={padL + cW}
        y2={yAt(IMP124840_SPACING_RATIO_LIMIT)}
        stroke={ED.brassDeco}
        strokeWidth={1.4}
        strokeDasharray="5 3"
      />
      <text
        x={padL + cW - 4}
        y={yAt(IMP124840_SPACING_RATIO_LIMIT) - 5}
        textAnchor="end"
        fill={ED.brass}
        fontSize={9}
        fontWeight={700}
      >
        ratio limit = {IMP124840_SPACING_RATIO_LIMIT}
      </text>

      {ratios.map((r, i) => {
        const x = padL + gap + i * (barW + gap);
        return (
          <g key={`${r.from}-${r.to}`}>
            <rect
              x={x}
              y={yAt(r.ratioToPrev)}
              width={barW}
              height={cH - (yAt(r.ratioToPrev) - padT)}
              fill={ED.series5}
              opacity={0.85}
            />
            <text x={x + barW / 2} y={yAt(r.ratioToPrev) - 6} textAnchor="middle" fill={ED.ink} fontSize={9.5} fontWeight={700}>
              {r.ratioToPrev.toFixed(4)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5} fontWeight={700}>
              {r.from} &rarr; {r.to}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp124840FartailPerNineLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Per-Nine Spacing Ladder (imp-124793)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The far-tail diagnostic 1 - 1/log(T0/2&pi;) crosses each pure per-nine target t = 0.9 /
        0.99 / 0.999 / 0.9999 at the closed-form RvM-inverted height log10 N = 5.2972 / 45.4251 /
        437.2940 / 4346.9448. Each added nine costs a ten-fold jump in log10 N, the logarithmic
        (geometric-in-nines) signature of the diagnostic's approach to 1.
      </p>
      <Log10NLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The consecutive log10 N spacing ratio climbs 9.7655 &rarr; 9.9769, approaching but never
        reaching the {IMP124840_SPACING_RATIO_LIMIT} limit from below.
      </p>
      <SpacingRatioChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-124793 closed-form RvM inversion literals verbatim (no new computation). Conditional-share
        diagnostic, not rigorous; changes no bound; establishes no operator positivity; no RH verdict,
        NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
