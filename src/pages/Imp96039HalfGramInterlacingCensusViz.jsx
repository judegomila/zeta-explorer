import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96039_CENSUS_ROWS,
  IMP96039_HEIGHT_BANDS,
  IMP96039_CAVEAT_BANNER,
} from '../data/imp-96039-route-b-half-gram-interlacing-census-viz-data.js';
import { ED } from '../styles/tokens.js';

// bar chart: half-Gram (n=1 pencil) vs classical Gram interlacing-violation
// fraction, up to gamma_300 (302 intervals each).
function CensusChart() {
  const rows = IMP96039_CENSUS_ROWS;
  const svgW = 420;
  const padL = 52;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 260;
  const padT = 24;
  const padB = 48;
  const plotH = svgH - padT - padB;

  const yOf = (frac) => padT + plotH - frac * plotH;
  const barW = plotW / rows.length;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const colors = [ED.series7, ED.series3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {Math.round(v * 100)}%
          </text>
        </g>
      ))}

      {rows.map((row, i) => {
        const cx = padL + barW * (i + 0.5);
        const barTop = yOf(row.fraction);
        return (
          <g key={row.label}>
            <rect
              x={cx - barW * 0.25}
              y={barTop}
              width={barW * 0.5}
              height={padT + plotH - barTop}
              fill={colors[i]}
              opacity={0.85}
            />
            <text x={cx} y={barTop - 6} textAnchor="middle" fill={colors[i]} fontSize={9}>
              {row.violations}/{row.intervals} ({(row.fraction * 100).toFixed(1)}%)
            </text>
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              {row.label}
            </text>
          </g>
        );
      })}

      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        violation fraction (up to gamma_300)
      </text>
    </svg>
  );
}

// height-band chart: half-Gram violation fraction stays flat near 0.55 across bands.
function HeightBandChart() {
  const bands = IMP96039_HEIGHT_BANDS;
  const svgW = 460;
  const padL = 52;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 220;
  const padT = 24;
  const padB = 40;
  const plotH = svgH - padT - padB;

  const yOf = (frac) => padT + plotH - frac * plotH;
  const barW = plotW / bands.length;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {Math.round(v * 100)}%
          </text>
        </g>
      ))}

      <line x1={padL} y1={yOf(0.5485)} x2={padL + plotW} y2={yOf(0.5485)} stroke={ED.rule} strokeWidth={1} strokeDasharray="5 4" />

      {bands.map((b, i) => {
        const cx = padL + barW * (i + 0.5);
        const barTop = yOf(b.fraction);
        return (
          <g key={`${b.lo}-${b.hi}`}>
            <rect
              x={cx - barW * 0.3}
              y={barTop}
              width={barW * 0.6}
              height={padT + plotH - barTop}
              fill={ED.series7}
              opacity={0.75}
            />
            <text x={cx} y={barTop - 6} textAnchor="middle" fill={ED.series7} fontSize={8.5}>
              {(b.fraction * 100).toFixed(0)}%
            </text>
            <text x={cx} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              {b.lo}-{b.hi}
            </text>
          </g>
        );
      })}

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        height band (gamma range)
      </text>
    </svg>
  );
}

export default function Imp96039HalfGramInterlacingCensusViz() {
  const [halfGram, classicalGram] = IMP96039_CENSUS_ROWS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route B: Half-Gram vs Classical-Gram Interlacing Census (imp-96039)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-7) 6%, transparent)',
          borderLeft: '3px solid var(--series-7)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-7)' }}>Honest status:</strong> {IMP96039_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        Lemma H (HKO): the zeros of the n=1 mean-field pencil Psi_1 interlace the zeta zeros only
        along the half-Gram lattice theta(x) = pi/2 (mod pi). Up to gamma_300 (302 intervals), this
        interlacing fails at the FIRST pair &mdash; interval ({halfGram.firstViolation[0].toFixed(3)},{' '}
        {halfGram.firstViolation[1].toFixed(3)}) holds gamma_2 and gamma_3 &mdash; and violates
        {' '}{halfGram.violations} of {halfGram.intervals} intervals ({(halfGram.fraction * 100).toFixed(1)}%).
        The classical Gram law, by contrast, only violates {classicalGram.violations} of{' '}
        {classicalGram.intervals} ({(classicalGram.fraction * 100).toFixed(1)}%), first failing at{' '}
        g&#8321;&#8322;&#8325;/g&#8321;&#8322;&#8326; (Titchmarsh).
      </p>

      <CensusChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.25rem 0 0.5rem', maxWidth: 700 }}>
        The half-Gram violation fraction is height-flat: it stays near 0.55 (dashed reference line)
        across every band up to gamma&#8321;&#8322;&#8321;&#8321;-scale heights (imp-96021), rather
        than decaying toward 0 &mdash; the n=1 pencil never approaches interlacing.
      </p>

      <HeightBandChart />

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
        Route B Lemma H interlacing census (baked literals, copied verbatim, not re-derived).
        Interlacing would presuppose RH; this chart establishes no operator positivity and carries
        no RH claim. No refereed bound is changed. NO QED.
      </div>
    </div>
  );
}
