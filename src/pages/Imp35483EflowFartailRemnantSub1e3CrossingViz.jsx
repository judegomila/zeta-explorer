import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35483_LADDER_POINTS,
  IMP35483_CROSSING,
  IMP35483_THRESHOLD,
  IMP35483_SUMMARY,
} from '../data/imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data.js';
import { ED } from '../styles/tokens.js';

// Line chart of the imp-35413 remnant ladder against log10 N, with the 1e-3 threshold line and
// the bisected crossing marked.
function CrossingChart() {
  const svgW = 640;
  const padL = 64;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 320;
  const padT = 20;
  const padB = 46;
  const plotH = svgH - padT - padB;

  const minX = Math.min(...IMP35483_LADDER_POINTS.map((p) => p.log10N));
  const maxX = Math.max(...IMP35483_LADDER_POINTS.map((p) => p.log10N));
  const minY = IMP35483_SUMMARY.minRemnant * 0.9;
  const maxY = IMP35483_SUMMARY.maxRemnant * 1.1;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  const xTicks = [24, 25, 26, 28];
  const yTicks = [minY, IMP35483_THRESHOLD, maxY];

  const sorted = [...IMP35483_LADDER_POINTS].sort((a, b) => a.log10N - b.log10N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toExponential(2)}
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        remnant |analytic - fd|
      </text>

      {/* the 1e-3 threshold line */}
      <line
        x1={padL}
        y1={yOf(IMP35483_THRESHOLD)}
        x2={padL + plotW}
        y2={yOf(IMP35483_THRESHOLD)}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        opacity={0.8}
      />
      <text x={padL + plotW - 4} y={yOf(IMP35483_THRESHOLD) - 6} textAnchor="end" fill={ED.brass} fontSize={8.5}>
        1e-3 threshold
      </text>

      {/* the ladder polyline */}
      <polyline
        points={sorted.map((p) => `${xOf(p.log10N)},${yOf(p.remnant)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.7}
      />

      {sorted.map((p) => (
        <g key={p.log10N}>
          <circle
            cx={xOf(p.log10N)}
            cy={yOf(p.remnant)}
            r={p.isCrossing ? 6 : 5}
            fill={p.isCrossing ? ED.series3 : ED.series2}
            stroke={ED.paper}
            strokeWidth={1}
          />
          <text
            x={xOf(p.log10N) + 8}
            y={yOf(p.remnant) - 8}
            fill={ED.ink}
            fontSize={8.5}
            fontFamily="monospace"
          >
            {p.isCrossing ? `crossing ${p.log10N}` : `N=1e${p.log10N}`}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp35483EflowFartailRemnantSub1e3CrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Remnant Sub-1e-3 Crossing Ladder (imp-35483 / imp-35413)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35371 extended the imp-35280 E_flow far-tail fd-vs-analytic remnant (the gap between
        the imp-35198 analytic leading exponent -1 + 3/log N and the finite-difference exponent,
        both read on the closed surrogate height map T0 = 2 pi N / log N) to N = 1e24, where the
        remnant sat at 0.0011 -- still above 1e-3. imp-35413 continued the identical surrogate
        channel and bisected the sub-1e-3 crossing: the remnant first drops below 1e-3 at
        N ~ {IMP35483_CROSSING.N.toExponential(4)} (log10 N ~ {IMP35483_CROSSING.log10N}), bracketed
        cleanly by N = 1e25 (0.001036, above) and N = 1e26 (0.000979, below). This page plots the
        full five-rung ladder against the 1e-3 threshold, with the bisected crossing marked.
      </p>

      <CrossingChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        At the crossing, remnant &times; log N ~ {IMP35483_CROSSING.remnantTimesLogN}, continuing
        the imp-35371 slow drift (~0.061 at N = 1e24 down to ~0.059 here) -- the crossing is
        simply where the still-decaying remnant passes the 1e-3 mark, not a floor. Had the
        remnant been pinned at a nonzero ~0.002 floor, this crossing would never occur.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data only, baked
        literals reproducing the imp-35413 bisection verbatim on the inherited imp-3220/imp-3406
        surrogate extrapolation; no new derivation, no bound changed. This module's own
        surrogate-vs-true fidelity gap remains an UNNAMED tracked sub-gap (imp-35337a is scoped to
        the sigma(N) landmarks and does NOT cover this remnant quantity). E_flow &gt; 0 strictness
        (imp-33848) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent
        1/2 per imp-3463; changes no bound; establishes no operator positivity; no RH verdict, NO
        QED.
      </div>
    </div>
  );
}
