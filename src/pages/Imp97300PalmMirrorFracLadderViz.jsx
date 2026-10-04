import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97300_RUNG_ROWS,
  IMP97300_TARGET_ROWS,
  IMP97300_REFERENCE_POINTS,
} from '../data/imp-97300-palm-mirror-frac-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97300: the imp-97189 extended ladder shipped with a rung table and a frac-target
// bisection table but no chart. This page renders both: the frac-of-mean approach to 1
// (and the closed-form law it converges to) against ln N, and the bisection table showing
// how far each frac target sits above the imp-97101 parity crossing ln N* = 18.394.

function LineChart({ series, xLabel, yLabel, logX = false }) {
  const svgW = 640;
  const svgH = 280;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tx = (x) => (logX ? Math.log10(x) : x);
  const allX = series.flatMap((s) => s.points.map((p) => tx(p.x)));
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY) * (Math.min(...allY) < 0 ? 1.05 : 0.95);
  const maxY = Math.max(...allY) * 1.05;
  const spanY = maxY - minY || 1;

  const xOf = (x) => padL + ((tx(x) - minX) / (maxX - minX || 1)) * plotW;
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
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(logX ? 10 ** v : v)} y1={padT + plotH} x2={xOf(logX ? 10 ** v : v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(logX ? 10 ** v : v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {logX ? `1e${v.toFixed(1)}` : v.toFixed(0)}
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
            strokeDasharray={s.dashed ? '4,3' : undefined}
          />
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

export default function Imp97300PalmMirrorFracLadderViz() {
  const fracSeries = [
    { label: 'measured frac(lnN)', color: ED.series1, points: IMP97300_RUNG_ROWS.map((r) => ({ x: r.lnN, y: r.frac })) },
    { label: 'approach law 1 - 12.12/lnN', color: ED.series2, dashed: true, points: IMP97300_RUNG_ROWS.map((r) => ({ x: r.lnN, y: r.fracApproachLaw })) },
  ];
  const targetSeries = [
    { label: 'first lnN reaching frac target', color: ED.series5, points: IMP97300_TARGET_ROWS.map((r) => ({ x: r.lnN, y: r.target })) },
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Palm Mirror-Count Frac-of-Mean: an Infinitely-Slow Approach to 1" />

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
        neutral rigid-lattice Palm 2-slot mirror count trails its asymptotic mean ln&nbsp;N/2 by
        a fixed additive constant 1/y0&nbsp;=&nbsp;6.0606 at every height, so frac(ln&nbsp;N)
        approaches 1 but never reaches it at any finite height. This sharpens (does not
        replace) the imp-97127 height-effect verdict. No bound moves; Platt&ndash;Trudgian
        &Lambda;&nbsp;&le;&nbsp;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        The measured fraction of mean (blue) coincides with the closed-form approach law{' '}
        <code>1 &minus; 12.12 / ln N</code> (red, dashed) once ln N is large enough for the o(1)
        residual to decay &mdash; the two curves visibly separate at the low-height end (ln
        N&nbsp;=&nbsp;22, the imp-97127 last rung) and converge by ln N&nbsp;=&nbsp;200.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        frac(lnN) vs ln N: measured ladder vs closed-form approach law
      </h3>
      <LineChart series={fracSeries} xLabel="ln N" yLabel="frac of mean" logX />
      <Legend series={fracSeries} />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.5rem 0 1rem', maxWidth: 700 }}>
        Because the deficit 1 &minus; frac decays only like ~12.12 / ln N, reaching even
        frac&nbsp;=&nbsp;0.90 needs ln N&nbsp;~&nbsp;120.5 &mdash; already{' '}
        {(IMP97300_TARGET_ROWS.find((r) => r.target === 0.9).lnN / IMP97300_REFERENCE_POINTS.parityCrossing.lnN).toFixed(1)}x
        above the imp-97101 parity crossing ln N*&nbsp;=&nbsp;{IMP97300_REFERENCE_POINTS.parityCrossing.lnN}. Reaching
        frac&nbsp;=&nbsp;0.99 needs ln N&nbsp;~&nbsp;1212.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Bisection table: first ln N reaching each frac target
      </h3>
      <LineChart series={targetSeries} xLabel="ln N (log10 scale)" yLabel="frac target" logX />
      <Legend series={targetSeries} />

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
        imp-97300 viz-data leaf (every value reused verbatim from the imp-97189 baked ladder,
        no re-derivation of the Palm 2-slot mirror kernel). Changes no bound, establishes no
        operator positivity; Platt-Trudgian &Lambda;&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
