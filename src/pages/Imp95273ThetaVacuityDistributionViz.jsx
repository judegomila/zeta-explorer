import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95273_THETA_VACUITY_DISTRIBUTION,
  IMP95273_SUMMARY,
} from '../data/imp-95273-theta-vacuity-distribution.js';
import { ED } from '../styles/tokens.js';

// Horizontal bar chart of log10(ratio), ratio = theta / e^(-y_min), one bar
// per signed seam family. Bars split at the vacuity boundary ratio = 1
// (log10 = 0): vacuous families (ratio < 1, PHASE-CERT bound >= 1/2) extend
// left in red, active families (ratio > 1, bound < 1/2) extend right in
// green.
function RatioBarChart() {
  const rows = IMP95273_THETA_VACUITY_DISTRIBUTION;
  const svgW = 720;
  const padL = 210;
  const padR = 70;
  const rowH = 34;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = rows.length * rowH;
  const svgH = padT + plotH + padB;

  const minX = -4;
  const maxX = 4.5;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const zeroX = xOf(0);

  const xTicks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {xTicks.map((v) => (
        <line
          key={`grid${v}`}
          x1={xOf(v)}
          y1={padT}
          x2={xOf(v)}
          y2={padT + plotH}
          stroke={v === 0 ? ED.brassDeco : ED.ruleSoft}
          strokeWidth={v === 0 ? 1.5 : 1}
          strokeDasharray={v === 0 ? '5 4' : undefined}
        />
      ))}
      {rows.map((r, i) => {
        const y = padT + i * rowH + rowH / 2;
        const logRatio = Math.log10(r.ratio);
        const barX = Math.min(zeroX, xOf(logRatio));
        const barW = Math.abs(xOf(logRatio) - zeroX);
        const fill = r.vacuous ? ED.series2 : ED.series3;
        return (
          <g key={r.key}>
            <text x={padL - 10} y={y + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9.5}>
              {r.key}
            </text>
            <rect x={barX} y={y - rowH * 0.3} width={Math.max(1, barW)} height={rowH * 0.6} fill={fill} opacity={0.85} />
            <text
              x={xOf(logRatio) + (r.vacuous ? -6 : 6)}
              y={y + 3}
              textAnchor={r.vacuous ? 'end' : 'start'}
              fill={fill}
              fontSize={8.5}
            >
              r={r.ratio.toExponential(2)}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <text key={`xt${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10( ratio = theta / e^(-y_min) )
      </text>
      <text x={zeroX} y={padT - 6} textAnchor="middle" fill={ED.brass} fontSize={8.5}>
        boundary r = 1
      </text>
    </svg>
  );
}

export default function Imp95273ThetaVacuityDistributionViz() {
  const rows = IMP95273_THETA_VACUITY_DISTRIBUTION;
  const deepest = rows.reduce((a, b) => (a.ratio < b.ratio ? a : b));
  const furthest = rows.reduce((a, b) => (a.ratio > b.ratio ? a : b));

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Theta Phase-Currency Vacuity Distribution (imp-95273 / imp-95233)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only
        page tabulating where representative signed seam families sit relative to the
        imp-95233 PHASE-CERT vacuity boundary. It changes no bound and establishes no
        operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the
        art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95233 COROLLARY PHASE-CERT bounds R(f) &le; e^(-y_min)/(2&nbsp;theta) and
        flags that the bound becomes VACUOUS (&ge; 1/2, no gain over the trivial
        symmetry ceiling) once theta &le; e^(-y_min). Writing r = theta / e^(-y_min),
        the certificate is ACTIVE for r &gt; 1 and VACUOUS for r &lt; 1. The chart below
        plots log10(r) for ten representative signed packet families: co-centered
        deep-cancellation witnesses (red, the regime the seam actually produces) all
        sit left of the amber boundary, while mild-sign / well-separated families
        (green) all sit right of it.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        r = theta / e^(-y_min), by family (red = vacuous, green = active)
      </h3>
      <RatioBarChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the deepest
        vacuous family is {deepest.key} at r = {deepest.ratio.toExponential(3)}
        {' '}(bound {deepest.bound.toExponential(3)}, {deepest.bound >= 100 ? 'far above' : 'above'}
        {' '}1/2), while the furthest active family is {furthest.key} at
        {' '}r = {furthest.ratio.toExponential(3)} (bound {furthest.bound.toExponential(3)},
        well below 1/2). All {IMP95273_SUMMARY.familiesMeasured} families satisfy
        PHASE-CERT (R &le; bound); the vacuity is confined to the deep-cancellation
        corner ({IMP95273_SUMMARY.vacuousCount} of {IMP95273_SUMMARY.familiesMeasured}{' '}
        families), not a defect of the certificate everywhere.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming
        the imp-95273 baked distribution (recomputed by Simpson quadrature and
        cross-checked against the imp-95233 exact closed forms to 2e-3 relative).
        Changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
