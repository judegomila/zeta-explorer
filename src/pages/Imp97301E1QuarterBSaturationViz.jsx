import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97301_CLASS_SERIES,
  IMP97301_CLASS_KEYS,
  IMP97301_CLASS_LABELS,
  IMP97301_SUMMARY,
} from '../data/imp-97301-e1-quarter-b-saturation-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97301: the imp-97269 per-class b/4 E1-saturation cross-check shipped with a four-class
// table but no chart. This page renders the saturation ratio q(b) = |E1(b)|/(b/4) against
// log10(b) for each divisor class: primes climb toward 1, while prime powers, primorials and
// generic composites undershoot and decay as b grows.

const CLASS_COLORS = {
  primes: ED.series1,
  primePowers: ED.series2,
  primorials: ED.series5,
  genericComposites: ED.series3,
};

function LineChart({ series, xLabel, yLabel }) {
  const svgW = 640;
  const svgH = 300;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const allX = series.flatMap((s) => s.points.map((p) => p.x));
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = 0;
  const maxY = Math.max(...allY) * 1.08;
  const spanY = maxY - minY || 1;

  const xOf = (x) => padL + ((x - minX) / (maxX - minX || 1)) * plotW;
  const yOf = (y) => padT + plotH - ((y - minY) / spanY) * plotH;

  const xTicks = Array.from({ length: 6 }, (_, i) => minX + (i / 5) * (maxX - minX));
  const yTicks = Array.from({ length: 5 }, (_, i) => minY + (i / 4) * spanY);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {`1e${v.toFixed(1)}`}
          </text>
        </g>
      ))}
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            points={s.points.map((p) => `${xOf(p.x)},${yOf(p.y)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth={1.9}
          />
          {s.points.map((p) => (
            <circle key={`${s.label}-${p.x}`} cx={xOf(p.x)} cy={yOf(p.y)} r={2.4} fill={s.color} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        {xLabel}
      </text>
      <text x={12} y={padT + 8} fill={ED.inkSoft} fontSize={9}>
        {yLabel}
      </text>
    </svg>
  );
}

function Legend({ series }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
      {series.map((s) => (
        <span key={s.label} style={{ color: s.color }}>
          &#9632; {s.label}
        </span>
      ))}
    </div>
  );
}

export default function Imp97301E1QuarterBSaturationViz() {
  const series = IMP97301_CLASS_KEYS.map((key) => ({
    label: IMP97301_CLASS_LABELS[key],
    color: CLASS_COLORS[key],
    points: IMP97301_CLASS_SERIES[key].map((r) => ({ x: r.log10B, y: r.q })),
  }));

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M: E1 b/4-Saturation Ratio Per Divisor Class" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> MEASUREMENT only. The
        saturation ratio q(b) = |E1(b)|/(b/4) never exceeds 1 on the dense sweep b in
        [2,20000] (0 violations); it rises toward 1 only on the primes (the class where the
        -b/4 leader survives) and undershoots, decaying with b, on prime powers, primorials and
        generic composites (the mu-sign divisor cancellation removes the -b/4 leader off
        primes). No bound moves;
        RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        Each point is a baked (b, q) pair from the imp-97269 per-class table, plotted against
        log10(b). The primes series (blue) climbs from 0.765 at b=7 to 0.999952 at b=99991,
        the only class where q approaches the b/4 ceiling. The three smooth classes (red,
        purple, green) start lower and decay further as b grows.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        q(b) = |E1(b)|/(b/4) vs log10(b), by divisor class
      </h3>
      <LineChart series={series} xLabel="log10(b)" yLabel="q(b)" />
      <Legend series={series} />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.5rem 0 1rem', maxWidth: 700 }}>
        The binding class is <strong>{IMP97301_SUMMARY.bindingClass}</strong>: q ranges from{' '}
        {IMP97301_SUMMARY.primesMinQ.toFixed(3)} to {IMP97301_SUMMARY.primesMaxQ.toFixed(5)} on
        primes, while the smallest q reached across every smooth class is as low as{' '}
        {IMP97301_SUMMARY.smoothClassesMinQ.toFixed(5)}. The ceiling{' '}
        <code>|E1(b)| &le; {IMP97301_SUMMARY.ceiling}</code> holds class-uniformly on this
        dense sweep (b &le; 20000) &mdash; it does <strong>not</strong> hold in general: imp-97481
        later proved the ceiling FALSE for general squarefree b (explicit witness far beyond this
        range), and imp-97544 records the b/4-ceiling lower edge as a DEAD ROUTE.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-97301 viz-data leaf (every value reused verbatim from the imp-97269 baked
        IMP97269_CLASS_TABLE, no re-derivation of the O(b) E1 kernel). Changes no bound,
        establishes no operator positivity; RH
        open; NO QED.
      </div>
    </div>
  );
}
