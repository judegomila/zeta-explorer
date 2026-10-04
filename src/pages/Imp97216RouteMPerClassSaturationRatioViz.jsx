import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP97158_RATIOS, IMP97158_VERDICT } from '../data/imp-97158-route-m-theorem1-remainder-sharpness.js';
import { ED } from '../styles/tokens.js';

// imp-97216: first visualization for the imp-97158 per-b-class saturation-ratio measurement.
// Renders the three classes on one log-b axis: primes climbing toward the 1/4 asymptote (the
// named Theorem-1 constant's tight class), and prime powers / primorials collapsing toward 0
// (the mu-cancellation the triangle bound discards).

const QUARTER = 0.25;

function ClassLadderChart({ primes, primePowers, primorials }) {
  const svgW = 700;
  const svgH = 380;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const allB = [...primes, ...primePowers, ...primorials].map((r) => r.b);
  const minLogB = Math.log10(Math.min(...allB));
  const maxLogB = Math.log10(Math.max(...allB));
  const xAt = (b) => padL + ((Math.log10(b) - minLogB) / (maxLogB - minLogB)) * cW;
  const yAt = (r0) => padT + cH - (r0 / QUARTER) * cH;

  const series = [
    { rows: primes, color: ED.series3, label: 'primes -> 1/4' },
    { rows: primePowers, color: ED.series1, label: 'prime powers -> 0' },
    { rows: primorials, color: ED.series2, label: 'primorials -> 0 (orders faster)' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line
        x1={padL}
        y1={yAt(QUARTER)}
        x2={svgW - padR}
        y2={yAt(QUARTER)}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={svgW - padR} y={yAt(QUARTER) - 6} textAnchor="end" fill={ED.brass} fontSize={9.5} fontFamily="monospace">
        r0 = 1/4 (asymptotic limit)
      </text>
      <line x1={padL} y1={padT + cH} x2={svgW - padR} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />
      <text x={svgW - padR} y={svgH - 12} textAnchor="end" fill={ED.inkFaint} fontSize={9.5} fontFamily="monospace">
        b (log scale) &rarr;
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        fontFamily="monospace"
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        r0(b) = |E0(b)| / bound
      </text>
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            points={s.rows.map((r) => `${xAt(r.b)},${yAt(r.r0)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
          />
          {s.rows.map((r) => (
            <circle key={r.b} cx={xAt(r.b)} cy={yAt(r.r0)} r={4} fill={s.color} />
          ))}
        </g>
      ))}
      {series.map((s, idx) => (
        <g key={s.label}>
          <rect x={padL + 10} y={padT + 10 + idx * 16} width={10} height={10} fill={s.color} />
          <text x={padL + 26} y={padT + 19 + idx * 16} fill={ED.ink} fontSize={9.5} fontFamily="monospace">
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp97216RouteMPerClassSaturationRatioViz() {
  const { primes, primePowers, primorials, e0AsymptoticSaturationRatioLabel } = {
    primes: IMP97158_RATIOS.primes,
    primePowers: IMP97158_RATIOS.primePowers,
    primorials: IMP97158_RATIOS.primorials,
    e0AsymptoticSaturationRatioLabel: '1/4',
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Per-Class Remainder Saturation Ratios" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Honest status:</strong> the imp-97133 Theorem-1
        remainder constant 2<sup>&omega;(b)</sup>(log b + 2) is sharp only along the{' '}
        <strong>primes</strong>, where the saturation ratio r0(b) = |E0(b)|/bound climbs toward the
        exact limit {e0AsymptoticSaturationRatioLabel} (a finite factor-4 overhead). On prime powers
        and primorials the same bound is orders too large &mdash; a mu-sign cancellation over the
        squarefree divisors that the triangle method discards. Measurement only; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        r0(b) per b-class on a log-b axis. Green (primes) rises monotonically toward the 1/4 dashed
        line; blue (prime powers, fixed &omega;=1) decays with the exponent; red (primorials) falls
        away by orders of magnitude as &omega;(b) grows.
      </p>
      <ClassLadderChart primes={primes} primePowers={primePowers} primorials={primorials} />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 0.25rem', maxWidth: 700 }}>
        Primorial collapse (linear r0, note the scale): b=2 &rarr; r0=0.0570; b=30030 &rarr;
        r0=1.80e-5, a &gt;1000&times; collapse over six primes.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-97158
        measurement module (every value reused verbatim, no re-derivation). {IMP97158_VERDICT.conclusion}
      </div>
    </div>
  );
}
