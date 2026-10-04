import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97302_ROWS,
  IMP97302_MEASURED,
} from '../data/imp-97302-inverse-line-diag-offdiag-coleading-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97302: the imp-97267/imp-97284 inverse-line DIAG-vs-OFFDIAG decomposition shipped as
// tables but no chart. This page renders both components (DIAG and OFFDIAG) per b, plus the
// share each carries of M2w, showing they sit near half each across the whole measured range
// b=101..1201 -- the off-diagonal is co-leading, not a vanishing lower-order remainder.

function LineChart({ series, xLabel, yLabel, logX = false }) {
  const svgW = 640;
  const svgH = 280;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tx = (x) => (logX ? Math.log10(x) : x);
  const allX = series.flatMap((s) => s.points.map((p) => tx(p.x)));
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY) * (Math.min(...allY) < 0 ? 1.05 : 0.9);
  const maxY = Math.max(...allY) * 1.1;
  const spanY = maxY - minY || 1;

  const xOf = (x) => padL + ((tx(x) - minX) / (maxX - minX || 1)) * plotW;
  const yOf = (y) => padT + plotH - ((y - minY) / spanY) * plotH;

  const xTicks = Array.from({ length: 6 }, (_, i) => minX + (i / 5) * (maxX - minX));
  const yTicks = Array.from({ length: 5 }, (_, i) => minY + (i / 4) * spanY);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(logX ? 10 ** v : v)} y1={padT + plotH} x2={xOf(logX ? 10 ** v : v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(logX ? 10 ** v : v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {logX ? `1e${v.toFixed(1)}` : v.toFixed(0)}
          </text>
        </g>
      ))}
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            points={s.points.map((p) => `${xOf(p.x)},${yOf(p.y)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={1.9}
            strokeDasharray={s.dashed ? '4,3' : undefined}
          />
          {s.points.map((p) => (
            <circle key={`${s.label}-${p.x}`} cx={xOf(p.x)} cy={yOf(p.y)} r={2.4} fill={s.color} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        {xLabel}
      </text>
      <text x={12} y={padT + 8} fill={ED.inkSoft} fontSize={9}>
        {yLabel}
      </text>
    </svg>
  );
}

function Legend({ series }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
      {series.map((s) => (
        <span key={s.label} style={{ color: s.color }}>
          &#9632; {s.label}
        </span>
      ))}
    </div>
  );
}

export default function Imp97302InverseLineDiagOffdiagCoLeadingViz() {
  const magnitudeSeries = [
    { label: 'DIAG (m=0)', color: ED.series1, points: IMP97302_ROWS.map((r) => ({ x: r.b, y: r.diag })) },
    { label: 'OFFDIAG (m!=0 twisted moments)', color: ED.series2, points: IMP97302_ROWS.map((r) => ({ x: r.b, y: r.offdiag })) },
    { label: 'M2w', color: ED.series5, dashed: true, points: IMP97302_ROWS.map((r) => ({ x: r.b, y: r.M2w })) },
  ];
  const shareSeries = [
    { label: 'diagShare = DIAG / M2w', color: ED.series1, points: IMP97302_ROWS.map((r) => ({ x: r.b, y: r.diagShare })) },
    { label: 'offShare = OFFDIAG / M2w', color: ED.series2, points: IMP97302_ROWS.map((r) => ({ x: r.b, y: r.offShare })) },
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Inverse-Line DIAG vs OFFDIAG: a Co-Leading Decomposition of M2w" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> MEASUREMENT only. The exact
        character-detection identity M2w&nbsp;=&nbsp;DIAG&nbsp;+&nbsp;OFFDIAG (imp-97267) splits
        the inverse-line second moment into the m=0 diagonal and the real m&nbsp;&ne;&nbsp;0
        twisted-moment defect. Measured across b=101..1201 (imp-97267 + imp-97284), the
        off-diagonal is NOT a vanishing lower-order remainder: it carries ~half of M2w at every
        rung, so a Weil-bound route that discards it cannot certify M2w. No bound moves;
        Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        DIAG (blue) and OFFDIAG (red) track each other closely across the whole measured range,
        with M2w (purple, dashed) sitting at roughly twice either one &mdash; consistent with the
        OFFDIAG/DIAG&nbsp;~&nbsp;1.0 ratio reported in imp-97267/imp-97284.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        DIAG, OFFDIAG, and M2w vs b (log10 scale)
      </h3>
      <LineChart series={magnitudeSeries} xLabel="b (log10 scale)" yLabel="magnitude" logX />
      <Legend series={magnitudeSeries} />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.5rem 0 1rem', maxWidth: 700 }}>
        Normalizing by M2w shows the point directly: both shares stay in a band around 0.5 at
        every measured b (diagShare&nbsp;&isin;&nbsp;[{IMP97302_MEASURED.diagShareBand[0].toFixed(3)},{' '}
        {IMP97302_MEASURED.diagShareBand[1].toFixed(3)}], offShare&nbsp;&isin;&nbsp;
        [{IMP97302_MEASURED.offShareBand[0].toFixed(3)}, {IMP97302_MEASURED.offShareBand[1].toFixed(3)}]),
        neither one dominating nor vanishing as b grows from {IMP97302_MEASURED.bRange[0]} to{' '}
        {IMP97302_MEASURED.bRange[1]}.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Share of M2w carried by each component vs b (log10 scale)
      </h3>
      <LineChart series={shareSeries} xLabel="b (log10 scale)" yLabel="share of M2w" logX />
      <Legend series={shareSeries} />

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
        imp-97302 viz-data leaf (every value reused verbatim from the imp-97267 and imp-97284
        baked ladders, no re-derivation of the exact O(b^3) character-detection kernel). Changes
        no bound, establishes no operator positivity; Platt-Trudgian &Lambda;&le;0.2 remains SOTA;
        RH open; NO QED.
      </div>
    </div>
  );
}
