import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96801_ROWS,
  IMP96801_NULL_EXPONENT,
  IMP96801_MOST_SIGNIFICANT,
  IMP96801_HONEST_BANNER,
} from '../data/imp-96801-gmin-exponent-noise-band-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAND_COLOR = ED.series1;
const NULL_LINE_COLOR = ED.series2;
const OBS_COLOR = ED.series3;

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
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

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
            <text x={padL - 8} y={cy + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
              {r.label}
            </text>
          </g>
        );
      })}

      {[minX, (minX + maxX) / 2, maxX].map((v) => (
        <text key={`x${v.toFixed(2)}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v.toFixed(2)}
        </text>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
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
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96801_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96755 ran a 200,000-trial Monte Carlo of the exact GUE cube-root
        null (Weibull-3 block-extreme minima with median fixed to the
        measured envelope) to build a sampling-noise band for every
        imp-96629 / imp-96734 exponent estimator. Every measured exponent,
        including the steepest full-range fit -0.3983, lands inside its own
        95% band under the pure -1/3 law.
      </p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Reconciling imp-96616, imp-96734, and imp-96755:</strong>{' '}
        these three results measure different things, not competing verdicts.
        imp-96616 is a single POINT ESTIMATE -- the running-min exponent
        b = -0.3953 over N = 50..1e6, slightly steeper than GUE -1/3.
        imp-96734 then asked whether that steepness is a finite-N / plateau-bias
        artifact that shrinks toward -1/3 as N grows, or persists -- and found it
        PERSISTENT: the local exponent trend stays flat-to-steeper (not rising
        toward -1/3) out to N ~ 1.48e6. imp-96755 asked a different question --
        whether that persistent steepness exceeds ordinary block-extreme
        SAMPLING NOISE under the true GUE null -- and found it does not: every
        estimator's observed fit, including the steepest, lands inside its own
        95% Monte-Carlo band. So the deviation from -1/3 is real and does not
        shrink with N over the measured range, but it is also small enough that
        a pure -1/3 process would produce it by chance about as often --
        persistent-but-not-significant, not a contradiction.
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the
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
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96801 viz-data leaf (every band edge reused verbatim from imp-96755).{' '}
        {IMP96801_HONEST_BANNER}
      </div>
    </div>
  );
}
