import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96801_ROWS,
  IMP96801_NULL_EXPONENT,
  IMP96801_MOST_SIGNIFICANT,
  IMP96801_HONEST_BANNER,
} from '../data/imp-96801-gmin-exponent-noise-band-viz-data.js';

const BAND_COLOR = '#38bdf8';
const NULL_LINE_COLOR = '#f87171';
const OBS_COLOR = '#4ade80';

// Horizontal error-bar chart: eleven imp-96755 estimator rows, each showing
// its 95% Monte-Carlo null band (whisker) and observed fit (dot), against a
// single vertical dashed line at the GUE -1/3 cube-root null exponent.
function NoiseBandPanel() {
  const svgW = 720;
  const svgH = 340;
  const padL = 130;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allVals = [
    ...IMP96801_ROWS.flatMap((r) => [r.band95.lo, r.band95.hi, r.obs]),
    IMP96801_NULL_EXPONENT,
  ];
  const minX = Math.min(...allVals) - 0.05;
  const maxX = Math.max(...allVals) + 0.05;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;

  const rowH = plotH / IMP96801_ROWS.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <line
        x1={xOf(IMP96801_NULL_EXPONENT)}
        y1={padT}
        x2={xOf(IMP96801_NULL_EXPONENT)}
        y2={padT + plotH}
        stroke={NULL_LINE_COLOR}
        strokeWidth={1.3}
        strokeDasharray="4 3"
      />
      <text x={xOf(IMP96801_NULL_EXPONENT)} y={padT - 6} textAnchor="middle" fill={NULL_LINE_COLOR} fontSize={9}>
        GUE -1/3
      </text>

      {IMP96801_ROWS.map((r, i) => {
        const cy = padT + rowH * (i + 0.5);
        return (
          <g key={r.estimator}>
            <line x1={xOf(r.band95.lo)} y1={cy} x2={xOf(r.band95.hi)} y2={cy} stroke={BAND_COLOR} strokeWidth={2} />
            <line x1={xOf(r.band95.lo)} y1={cy - 4} x2={xOf(r.band95.lo)} y2={cy + 4} stroke={BAND_COLOR} strokeWidth={1.3} />
            <line x1={xOf(r.band95.hi)} y1={cy - 4} x2={xOf(r.band95.hi)} y2={cy + 4} stroke={BAND_COLOR} strokeWidth={1.3} />
            <circle cx={xOf(r.obs)} cy={cy} r={3.4} fill={OBS_COLOR} />
            <text x={padL - 8} y={cy + 3} textAnchor="end" fill="#94a3b8" fontSize={9}>
              {r.label}
            </text>
          </g>
        );
      })}

      {[minX, (minX + maxX) / 2, maxX].map((v) => (
        <text key={`x${v.toFixed(2)}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {v.toFixed(2)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        fitted exponent b -- whisker = 95% Monte-Carlo null band, dot = observed fit
      </text>
    </svg>
  );
}

export default function Imp96801GminExponentNoiseBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Gmin Exponent Fits vs the GUE Monte-Carlo Noise Band" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96801_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96755 ran a 200,000-trial Monte Carlo of the exact GUE cube-root
        null (Weibull-3 block-extreme minima with median fixed to the
        measured envelope) to build a sampling-noise band for every
        imp-96629 / imp-96734 exponent estimator. Every measured exponent,
        including the steepest full-range fit -0.3983, lands inside its own
        95% band under the pure -1/3 law.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Eleven estimators: 95% null band vs observed fit, against GUE -1/3
      </h3>
      <NoiseBandPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <span style={{ color: BAND_COLOR }}>&#9632; 95% Monte-Carlo null band</span>
        <span style={{ color: OBS_COLOR }}>&#9679; observed fit</span>
        <span style={{ color: NULL_LINE_COLOR }}>&#9632; GUE -1/3 cube-root exponent</span>
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the
        most significant single deviation is the {IMP96801_MOST_SIGNIFICANT.estimator}-range
        estimator (z = {IMP96801_MOST_SIGNIFICANT.z}, one-sided p ~ {IMP96801_MOST_SIGNIFICANT.oneSidedP}),
        but its dot still sits inside its own whisker -- {IMP96801_MOST_SIGNIFICANT.verdict}.
        The high-N-restricted and split-half rows (k&gt;=13..17, lowHalf/highHalf) drift
        furthest from -1/3 but carry the widest bands, and the two sliding-window
        trend rows sit almost exactly on zero drift.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-96801 viz-data leaf (every band edge reused verbatim from imp-96755).{' '}
        {IMP96801_HONEST_BANNER}
      </div>
    </div>
  );
}
