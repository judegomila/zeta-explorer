import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35549_HEIGHT_DIVERGENCE_ROWS,
  IMP35549_SUMMARY,
} from '../data/imp-35549-height-map-divergence-viz-data.js';
import { ED } from '../styles/tokens.js';

function DivergenceLineChart() {
  const w = 720;
  const h = 320;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const xs = IMP35549_HEIGHT_DIVERGENCE_ROWS.map((r) => r.log10N);
  const ys = IMP35549_HEIGHT_DIVERGENCE_ROWS.map((r) => r.relativeDivergence * 100);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = Math.max(...ys) * 1.08;

  const xPix = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const yPix = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const pathD = IMP35549_HEIGHT_DIVERGENCE_ROWS.map((r, i) => {
    const x = xPix(r.log10N);
    const y = yPix(r.relativeDivergence * 100);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  const yTicks = [0, 10, 20, 30];

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={padL}
            x2={w - padR}
            y1={yPix(t)}
            y2={yPix(t)}
            stroke={ED.ruleSoft}
            strokeWidth={1}
          />
          <text x={padL - 8} y={yPix(t) + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {t}%
          </text>
        </g>
      ))}
      <line
        x1={padL}
        x2={w - padR}
        y1={padT + plotH}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1}
      />
      {[6, 50, 100, 150, 200].map((tick) => (
        <text
          key={tick}
          x={xPix(tick)}
          y={h - 10}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={10}
        >
          10^{tick}
        </text>
      ))}
      <path d={pathD} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP35549_HEIGHT_DIVERGENCE_ROWS.map((r) => (
        <circle
          key={r.log10N}
          cx={xPix(r.log10N)}
          cy={yPix(r.relativeDivergence * 100)}
          r={3}
          fill={ED.series1}
        />
      ))}
    </svg>
  );
}

export default function Imp35549HeightMapDivergenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Height-Map Divergence: effectiveHeightForN vs Closed Surrogate T0=2piN/logN (imp-35549)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Two far-tail height maps are used across this ticket cohort to convert an ordinal count N
        into a corresponding zeta-zero height T0: <code>effectiveHeightForN</code> (imp-35476), a
        Newton-iterated inverse of the Riemann-von Mangoldt counting function N(T), and the closed
        surrogate T0&nbsp;=&nbsp;2*pi*N/logN (imp-35473/imp-35280), which is the surrogate's
        zeroth Newton iterate -- i.e. the same equation solved with only one step of correction.
        This page plots how far apart the two maps land across N&nbsp;=&nbsp;1e6..1e200.
      </p>

      <DivergenceLineChart />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>T0_effective</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>T0_surrogate</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>relative divergence</th>
          </tr>
        </thead>
        <tbody>
          {IMP35549_HEIGHT_DIVERGENCE_ROWS.map((row) => (
            <tr key={row.log10N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                10^{row.log10N}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.T0_effective.toExponential(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.T0_surrogate.toExponential(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(row.relativeDivergence * 100).toFixed(4)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The relative divergence T0_effective/T0_surrogate&nbsp;-&nbsp;1 falls monotonically across
        all {IMP35549_SUMMARY.rungCount} rungs, from{' '}
        {(IMP35549_SUMMARY.firstRelativeDivergence * 100).toFixed(2)}% at N=1e6 down to{' '}
        {(IMP35549_SUMMARY.lastRelativeDivergence * 100).toFixed(2)}% at N=1e200. It never
        vanishes in this range: even at N=1e200 the two maps still disagree by
        {' '}~{(IMP35549_SUMMARY.lastRelativeDivergence * 100).toFixed(1)}%, confirming they are
        genuinely distinct height conventions rather than numerically-interchangeable proxies --
        any module that swaps one for the other across this cohort changes its answer by a
        measurable, non-vanishing amount.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, computing both
        height maps live from their existing formulas (no fresh derivation, no heavy data-module
        import); pure diagnostic re-plot measuring how far apart two already-existing height-map
        conventions land, does NOT establish which map (if either) is more accurate; measurement
        only on the inherited imp-3220/imp-3406 surrogate family; C_mb GUE-conditional per imp-486
        UNTOUCHED; changes no bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
