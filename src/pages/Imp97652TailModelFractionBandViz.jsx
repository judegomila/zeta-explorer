import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97652_MODEL_ROWS,
  IMP97652_BAND_ROWS,
  IMP97652_TWO_RUNG_FRACTION,
  IMP97652_SUMMARY,
} from '../data/imp-97652-tail-model-fraction-band-viz-data.js';

// Grouped-bar chart: fraction per tail model, full-ladder vs tail-restricted fit.
function ModelSpreadChart() {
  const svgW = 640;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;
  const groupW = plotW / IMP97652_MODEL_ROWS.length;
  const barW = 34;

  const vals = IMP97652_MODEL_ROWS.flatMap((r) => [r.fullFraction, r.tailFraction]);
  const vMin = Math.min(...vals) - 0.005;
  const vMax = Math.max(...vals) + 0.005;
  const yOf = (v) => padT + plotH - ((v - vMin) / (vMax - vMin)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      <line
        x1={padL}
        y1={yOf(IMP97652_TWO_RUNG_FRACTION)}
        x2={padL + plotW}
        y2={yOf(IMP97652_TWO_RUNG_FRACTION)}
        stroke="#f87171"
        strokeDasharray="4 3"
        strokeWidth={1}
      />
      <text x={padL + plotW} y={yOf(IMP97652_TWO_RUNG_FRACTION) - 4} textAnchor="end" fill="#f87171" fontSize={9}>
        two-rung headline {IMP97652_TWO_RUNG_FRACTION.toFixed(4)}
      </text>

      {IMP97652_MODEL_ROWS.map((row, i) => {
        const gx = padL + groupW * i + groupW / 2;
        const fullY = yOf(row.fullFraction);
        const tailY = yOf(row.tailFraction);
        return (
          <g key={row.label}>
            <rect
              x={gx - barW - 3}
              y={fullY}
              width={barW}
              height={padT + plotH - fullY}
              fill="#60a5fa"
              opacity={0.85}
            />
            <text x={gx - barW / 2 - 3} y={fullY - 6} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
              {row.fullFraction.toFixed(4)}
            </text>
            <rect
              x={gx + 3}
              y={tailY}
              width={barW}
              height={padT + plotH - tailY}
              fill="#34d399"
              opacity={0.85}
            />
            <text x={gx + barW / 2 + 3} y={tailY - 6} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
              {row.tailFraction.toFixed(4)}
            </text>
            <text x={gx} y={padT + plotH + 16} textAnchor="middle" fill="#94a3b8" fontSize={10}>
              {row.label}
            </text>
          </g>
        );
      })}
      <text x={12} y={padT + 8} fill="#94a3b8" fontSize={9}>
        fraction
      </text>
    </svg>
  );
}

// Range-bar chart: full-ladder band vs asymptotic-tail band, with the two-rung headline marked.
function BandComparisonChart() {
  const svgW = 640;
  const padL = 190;
  const padR = 30;
  const padT = 16;
  const rowH = 46;
  const plotW = svgW - padL - padR;
  const svgH = padT + rowH * IMP97652_BAND_ROWS.length + 10;

  const allVals = IMP97652_BAND_ROWS.flatMap((r) => [r.lo, r.hi]);
  const vMin = Math.min(...allVals) - 0.004;
  const vMax = Math.max(...allVals) + 0.004;
  const xOf = (v) => padL + ((v - vMin) / (vMax - vMin)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP97652_BAND_ROWS.map((row, i) => {
        const y = padT + i * rowH + rowH / 2;
        return (
          <g key={row.label}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {row.label}
            </text>
            <line x1={xOf(row.lo)} y1={y} x2={xOf(row.hi)} y2={y} stroke="#60a5fa" strokeWidth={10} strokeLinecap="round" />
            <text x={xOf(row.lo)} y={y - 10} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
              {row.lo.toFixed(4)}
            </text>
            <text x={xOf(row.hi)} y={y - 10} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
              {row.hi.toFixed(4)}
            </text>
          </g>
        );
      })}
      <line
        x1={xOf(IMP97652_TWO_RUNG_FRACTION)}
        y1={padT - 4}
        x2={xOf(IMP97652_TWO_RUNG_FRACTION)}
        y2={padT + rowH * IMP97652_BAND_ROWS.length}
        stroke="#f87171"
        strokeDasharray="4 3"
        strokeWidth={1.4}
      />
      <text x={xOf(IMP97652_TWO_RUNG_FRACTION)} y={padT - 6} textAnchor="middle" fill="#f87171" fontSize={9}>
        headline {IMP97652_TWO_RUNG_FRACTION.toFixed(4)}
      </text>
    </svg>
  );
}

export default function Imp97652TailModelFractionBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Realizable-Fraction Tail-Model Band: Full Ladder vs Asymptotic Tail (imp-97652 / imp-97626)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97626 tail-model-fit literals verbatim (no re-derivation, no new
        computation). Eigenvalues are baked finite-section IEEE-double, not interval-enclosed; R_inf is
        an extrapolation, not a certified limit. Changes no bound; Platt&ndash;Trudgian &Lambda; &le;
        0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97652_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Fraction per tail model: full ladder (blue) vs asymptotic tail (green)
      </h3>
      <ModelSpreadChart />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <span style={{ color: '#60a5fa' }}>&#9632; full ladder (T=12..64)</span>
        <span style={{ color: '#34d399' }}>&#9632; asymptotic tail (T=28..64)</span>
      </div>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Model-spread band: full ladder [0.508, 0.543] vs asymptotic tail [0.508, 0.520]
      </h3>
      <BandComparisonChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97652_SUMMARY.verdict}
      </div>
    </div>
  );
}
