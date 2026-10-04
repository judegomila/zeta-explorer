import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96983_BANDS,
  IMP96983_LN3_MARKER,
  IMP96983_VERDICT,
} from '../data/imp-96983-ritz-vs-rigorous-crossval-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97082: the imp-96983 leaf bakes two chart-ready range bands (log10
// coordinates included) but had no confirmed consumer (grep of src/pages and
// src/components was empty). This is the first consumer: a horizontal
// log-scale range chart showing the Ritz UPPER-estimate band nested strictly
// inside the interval-rigorous flanking bracket, both ~22x above the binding
// 2a=(ln3)/2 margin.
const BAND_COLOR = Object.freeze({
  'Ritz UPPER estimate (imp-96938)': ED.series1,
  'Rigorous flanking bracket (certificate)': ED.series4,
});

function RangeBandPanel() {
  const bands = IMP96983_BANDS;
  const marker = IMP96983_LN3_MARKER;
  const svgW = 720;
  const padL = 210;
  const padR = 30;
  const svgH = 170;
  const padT = 24;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const rowH = plotH / bands.length;

  const allLogs = bands.flatMap((b) => [b.logLo, b.logHi]).concat([marker.logValue]);
  const minLog = Math.min(...allLogs) - 0.08;
  const maxLog = Math.max(...allLogs) + 0.08;
  const xOf = (log) => padL + ((log - minLog) / (maxLog - minLog)) * plotW;

  const ticks = [0.5521, 1, 5.605, 7.743, 12.0089, 21.0155, 56.05].filter(
    (v) => Math.log10(v) >= minLog && Math.log10(v) <= maxLog
  );

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {ticks.map((v) => (
        <g key={`t${v}`}>
          <line
            x1={xOf(Math.log10(v))}
            y1={padT}
            x2={xOf(Math.log10(v))}
            y2={padT + plotH}
            stroke={ED.ruleSoft}
            strokeWidth={1}
          />
          <text x={xOf(Math.log10(v))} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {v < 1 ? v.toFixed(3) : v.toFixed(v < 10 ? 2 : 1)}
          </text>
        </g>
      ))}
      <line
        x1={xOf(marker.logValue)}
        y1={padT - 6}
        x2={xOf(marker.logValue)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1.4}
        strokeDasharray="3,2"
      />
      <text x={xOf(marker.logValue)} y={padT - 10} textAnchor="middle" fill={ED.series2} fontSize={8}>
        binding 2a=(ln3)/2 margin ({marker.value.toFixed(4)})
      </text>
      {bands.map((b, i) => {
        const y = padT + i * rowH + rowH / 2;
        return (
          <g key={b.label}>
            <text x={padL - 10} y={y + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>
              {b.label}
            </text>
            <line
              x1={xOf(b.logLo)}
              y1={y}
              x2={xOf(b.logHi)}
              y2={y}
              stroke={BAND_COLOR[b.label]}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <circle cx={xOf(b.logMid)} cy={y} r={3.2} fill={ED.paper2} stroke={BAND_COLOR[b.label]} strokeWidth={2} />
            <text x={xOf(b.logLo)} y={y - 10} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              {b.lo.toFixed(3)}
            </text>
            <text x={xOf(b.logHi)} y={y - 10} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              {b.hi.toFixed(2)}
            </text>
            {!b.isCertified && (
              <text x={xOf(b.logHi) + 8} y={y + 3} fill={ED.inkFaint} fontSize={8}>
                upper est.
              </text>
            )}
          </g>
        );
      })}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
        lambda_min(T_0.48[sigma_2]) estimate (log10 scale)
      </text>
    </svg>
  );
}

export default function Imp97082RitzVsRigorousCrossvalRangeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein Floor at 2a=0.96: Ritz vs Rigorous Cross-Validation" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> the Ritz band is an{' '}
        <strong>UPPER estimate</strong>, not a certified lower bound. No operator positivity
        is established here; the interval-rigorous certificate reach stays 2a&le;
        {IMP96983_VERDICT.intervalRigorousReachUnchanged}, and operator positivity for
        0.96&nbsp;&lt;&nbsp;2a&nbsp;&lt;&nbsp;ln&nbsp;3 stays <strong>OPEN</strong>. The apparent
        Ritz-below-rigorous inversion visible in the chart below (finest Ritz upper 12.0089 sits
        below the interpolated rigorous lower ~17.09) is a basis/normalisation/shift{' '}
        <strong>mismatch between two independently discretised estimators, not a certification
        failure</strong>. RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96958 cross-validated two independent estimators of lambda_min(T_0.48[sigma_2]) at
        2a=0.96 (a=0.48): a Ritz UPPER-estimate band and the interval-rigorous flanking bracket
        read off the certificate at the neighboring a=0.45/a=0.50 rungs. The Ritz band sits
        strictly inside the rigorous bracket, and both place the eigenvalue in the order-10
        positive band &mdash; about {IMP96983_LN3_MARKER.marginRatioTo096RitzMin.toFixed(1)}x
        above the binding 2a=(ln3)/2 margin.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Estimator range bands (log10 scale)
      </h3>
      <RangeBandPanel />

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
        imp-96983 viz-data leaf (every band value reused verbatim from imp-96958). Changes no
        bound, establishes no operator positivity; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH
        open; NO QED.
      </div>
    </div>
  );
}
