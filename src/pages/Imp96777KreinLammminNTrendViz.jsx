import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96777_SERIES,
  IMP96777_NS,
  IMP96777_TRUSTED_BAND,
  IMP96777_HONEST_BANNER,
  IMP96777_CORRECTION_IMP96772,
} from '../data/imp-96777-krein-lammin-n-trend-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// Three-curve chart (each 2a rung normalised to its own N=20 value so all
// three share one y-axis) over N=20..76, with a shaded band marking the
// double-precision-trustworthy window (N<=52) and a dashed line at the
// Gram-conditioning wall onset (N=60).
function LammminTrendPanel() {
  const ns = IMP96777_NS;
  const svgW = 720;
  const padL = 48;
  const padR = 20;
  const svgH = 340;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...ns);
  const maxX = Math.max(...ns);
  const minY = 0.85;
  const maxY = 1.02;

  const xOf = (n) => padL + ((n - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const trustedN = ns[IMP96777_TRUSTED_BAND.trustedIdxMax];
  const wallN = ns[IMP96777_TRUSTED_BAND.wallOnsetIdx];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect
        x={padL}
        y={padT}
        width={xOf(trustedN) - padL}
        height={plotH}
        fill={alpha(ED.series3, 0.06)}
      />
      <rect
        x={xOf(trustedN)}
        y={padT}
        width={xOf(maxX) - xOf(trustedN)}
        height={plotH}
        fill={alpha(ED.series2, 0.05)}
      />
      <line
        x1={xOf(wallN)}
        y1={padT}
        x2={xOf(wallN)}
        y2={padT + plotH}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={xOf(wallN) + 4} y={padT + 10} fill={ED.series2} fontSize={8}>
        condB wall onset (N=60) &rarr;
      </text>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, (minY + maxY) / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {ns.map((n) => (
        <text key={`x${n}`} x={xOf(n)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {n}
        </text>
      ))}
      {IMP96777_SERIES.map((s) => (
        <g key={s.key}>
          <polyline
            points={ns.map((n, i) => `${xOf(n)},${yOf(s.normalizedValues[i])}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={1.9}
          />
          {ns.map((n, i) => (
            <circle key={`${s.key}${n}`} cx={xOf(n)} cy={yOf(s.normalizedValues[i])} r={2.4} fill={s.color} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (ticks at the eight ladder rungs 20..76)
      </text>
    </svg>
  );
}

export default function Imp96777KreinLammminNTrendViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I Krein Floor: lambda_min(T_a[sigma_2]) vs N" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96777_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96749 measured the Rayleigh-Ritz upper floor for the Route I Krein Toeplitz operator
        T_a[sigma_2] at 2a in {'{1.00, 1.05, ln3}'}, pushing the truncation N from 20 to 76. Each
        curve below is normalised to its own N=20 value so the three magnitudes (~8.3, ~2.1, ~0.57)
        share one axis: all three decrease slowly and stay firmly positive through the trusted
        window, then the decrements re-accelerate once the a-independent Gram condition number
        crosses ~1e13 (N&ge;60) &mdash; a conditioning artifact, not spectral collapse.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Normalised floor vs N, trusted window shaded
      </h3>
      <LammminTrendPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        {IMP96777_SERIES.map((s) => (
          <span key={s.key} style={{ color: s.color }}>
            &#9632; {s.label}
          </span>
        ))}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the green band
        (N&le;{IMP96777_TRUSTED_BAND.trustedNmax}, condB&le;
        {IMP96777_TRUSTED_BAND.condBAtTrustedMax.toExponential(2)}) is the double-precision-trustworthy
        window: every curve is monotone-decreasing but slowly-varying there, consistent with a
        positive N&rarr;infinity limit. The red band past the dashed condB-wall line
        (N&ge;{IMP96777_TRUSTED_BAND.wallOnsetIdx >= 0 ? 60 : '?'}, condB&ge;
        {IMP96777_TRUSTED_BAND.condBAtWallOnset.toExponential(2)}) is where the near-linear
        dependence of the (1-y^2)^{'{2m}'}-weighted basis corrupts the generalized eigenvalue &mdash;
        the visible re-acceleration there is numerical noise, not evidence the gap is closing.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Update ({IMP96777_CORRECTION_IMP96772.ticket}):</strong>{' '}
        {IMP96777_CORRECTION_IMP96772.note}
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
        imp-96777 viz-data leaf (every curve and band boundary reused verbatim from imp-96749).{' '}
        {IMP96777_HONEST_BANNER}
      </div>
    </div>
  );
}
