import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124841_LOCATOR_BARS,
  IMP124841_SPREAD,
  IMP124841_SUMMARY,
} from '../data/imp-124841-knee-locator-comparison-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-124841 cross-check verbatim (no new computation): four independent ways of
// locating the sigma-ramp knee floor-elasticity cluster within 0.033 of each other, all well clear
// of the imp-33684 softened interior-peak contrast.

function LocatorBarChart() {
  const svgW = 720;
  const svgH = 240;
  const padL = 260;
  const padR = 70;
  const padT = 16;
  const padB = 10;
  const rowH = (svgH - padT - padB) / IMP124841_LOCATOR_BARS.length;
  const cW = svgW - padL - padR;

  const minV = -2.3;
  const maxV = -1.2;
  const xAt = (v) => padL + ((v - minV) / (maxV - minV)) * cW;
  const zeroBandLo = xAt(-2.2);
  const zeroBandHi = xAt(-1.9);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={zeroBandLo} y={padT} width={zeroBandHi - zeroBandLo} height={svgH - padT - padB} fill={ED.ruleSoft} opacity={0.4} />
      <text x={(zeroBandLo + zeroBandHi) / 2} y={padT - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
        clean ~-2 band
      </text>

      {IMP124841_LOCATOR_BARS.map((b, i) => {
        const y = padT + i * rowH;
        const barX0 = xAt(0 > b.pKnee ? b.pKnee : 0);
        const x0 = xAt(minV);
        const x1 = xAt(b.pKnee);
        const isOutlier = b.key === 'interior-peak-contrast';
        return (
          <g key={b.key}>
            <text x={padL - 10} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.ink} fontSize={10.5} fontWeight={600}>
              {b.label}
            </text>
            <line
              x1={x0}
              y1={y + rowH / 2}
              x2={x1}
              y2={y + rowH / 2}
              stroke={isOutlier ? ED.brass : ED.series1}
              strokeWidth={10}
              strokeLinecap="round"
            />
            <text x={x1 + 8} y={y + rowH / 2 + 4} fill={ED.ink} fontSize={10.5} fontWeight={700}>
              {b.pKnee}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT} x2={padL} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp124841KneeLocatorComparisonViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fresh vs Imported Knee-Locator Comparison (imp-124841)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP124841_SUMMARY.law}
      </p>
      <LocatorBarChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Spread across the four knee-locator readings: &Delta;(fresh vs imp-124772) &asymp;{' '}
        {IMP124841_SPREAD.deltaFreshVsImp124772.toExponential(1)}; &Delta;(ramp-inflection vs exponent-curvature)
        &asymp; {IMP124841_SPREAD.deltaRampVsExpCurvature}.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124841_SUMMARY.verdict}
      </div>
    </div>
  );
}
