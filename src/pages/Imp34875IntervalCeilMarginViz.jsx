import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL } from '../data/imp-34845-iters-to-floor-interval-ceil.js';
import { ED } from '../styles/tokens.js';

const D = IMP34845_ITERS_TO_FLOOR_INTERVAL_CEIL;
const BANDS = [
  { key: 'band_31_step_0p1_1e9_to_1e12', label: '31-pt sweep (10^0.1)' },
  { key: 'band_61_step_0p05_1e9_to_1e12', label: '61-pt sweep (10^0.05)' },
].map((b) => {
  const stats = D.interval_bands[b.key];
  const halfWidth = stats.maxIntervalWidth / 2;
  return { ...b, ...stats, halfWidth, margin: stats.minGapToInteger / halfWidth };
});

// Log-scale twin-bar chart: interval half-width vs the distance from x to its nearest integer, per band,
// so the reader can see the ~238x margin holds at both sampling densities, not just in aggregate.
function MarginChart() {
  const svgW = 680;
  const padL = 84;
  const padR = 30;
  const padT = 30;
  const padB = 54;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const allValues = BANDS.flatMap((b) => [b.halfWidth, b.minGapToInteger]);
  const logMin = Math.floor(Math.log10(Math.min(...allValues))) - 0.3;
  const logMax = Math.ceil(Math.log10(Math.max(...allValues))) + 0.3;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - logMin) / (logMax - logMin)) * plotH;

  const groupW = plotW / BANDS.length;
  const barW = 46;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {Array.from({ length: Math.round(logMax - logMin) + 1 }, (_, i) => Math.floor(logMin) + i)
        .filter((e) => e >= logMin && e <= logMax)
        .map((e) => (
          <g key={e}>
            <line x1={padL} y1={yOf(10 ** e)} x2={padL + plotW} y2={yOf(10 ** e)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yOf(10 ** e) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9} fontFamily="monospace">
              1e{e}
            </text>
          </g>
        ))}
      {BANDS.map((b, i) => {
        const cx = padL + groupW * (i + 0.5);
        const xHw = cx - barW - 4;
        const xGap = cx + 4;
        const yHw = yOf(b.halfWidth);
        const yGap = yOf(b.minGapToInteger);
        return (
          <g key={b.key}>
            <rect x={xHw} y={yHw} width={barW} height={padT + plotH - yHw} fill={ED.series1} />
            <text x={xHw + barW / 2} y={yHw - 8} textAnchor="middle" fill={ED.series1} fontSize={10} fontFamily="monospace">
              {b.halfWidth.toExponential(2)}
            </text>
            <rect x={xGap} y={yGap} width={barW} height={padT + plotH - yGap} fill={ED.brassDeco} />
            <text x={xGap + barW / 2} y={yGap - 8} textAnchor="middle" fill={ED.brass} fontSize={10} fontFamily="monospace">
              {b.minGapToInteger.toExponential(2)}
            </text>
            <text x={cx} y={svgH - padB + 18} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {b.label}
            </text>
            <text x={cx} y={svgH - padB + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={9} fontFamily="monospace">
              margin &asymp; {b.margin.toFixed(1)}x
            </text>
          </g>
        );
      })}
      <rect x={padL} y={padT - 20} width={10} height={10} fill={ED.series1} />
      <text x={padL + 16} y={padT - 11} fill={ED.inkSoft} fontSize={10}>
        interval half-width (x)
      </text>
      <rect x={padL + 190} y={padT - 20} width={10} height={10} fill={ED.brassDeco} />
      <text x={padL + 206} y={padT - 11} fill={ED.inkSoft} fontSize={10}>
        distance to nearest integer
      </text>
    </svg>
  );
}

export default function Imp34875IntervalCeilMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Interval-Ceil Margin: Half-Width vs Nearest-Integer Gap (imp-34875 / imp-34845)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34798 found the closed-form iters-to-floor count off by exactly one at some seeds. imp-34845 tested
        whether that +/-1 is a genuine ceil-rounding ambiguity by wrapping the ceil argument x(seed) in an
        enclosing interval [x_lo, x_hi] (propagating the r truncation half-width and a few-ULP delta_0 floor).
        The chart below compares that interval half-width against the smallest distance from x to its nearest
        integer, over the off-by-one seeds in each sweep &mdash; on a log scale, so the ~
        {D.constants.gap_over_half_width.toFixed(0)}x gap between them is visible directly.
      </p>

      <MarginChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        In both the {BANDS[0].offByOne}-of-31 and {BANDS[1].offByOne}-of-61 off-by-one cohorts, the
        numerical interval (blue) sits two decades below the nearest integer boundary (amber): zero of the{' '}
        {D.summary.total_off_by_one_seeds} off-by-one seeds across either band have a straddling
        (ceil(x_lo) &ne; ceil(x_hi)) interval &mdash; every one is a true one-off. The margin is wide enough
        ({D.constants.gap_over_half_width.toFixed(0)}x the half-width) that no plausible tightening of the
        interval could ever reach the boundary, which is why the +/-1 is classified as an intrinsic
        transient-vs-asymptotic model offset rather than a numerical rounding artifact.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34845
        interval_bands/constants literals verbatim (no new computation). Interval-ceil margin diagnostic of a
        surrogate iters-to-floor count on the inherited imp-3220/imp-3406 map, IEEE-754 double precision; the
        C_C&nbsp;1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator positivity; no RH verdict,
        NO QED.
      </div>
    </div>
  );
}
