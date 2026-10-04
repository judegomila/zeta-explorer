import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35381_SWAP_FRACTION_LADDER,
  IMP35381_SUMMARY,
} from '../data/imp-35381-eflow-fartail-swap-fraction-viz-data.js';
import { ED } from '../styles/tokens.js';

// Bar chart of the imp-35279 inverse-swap FRACTION across the four-rung ladder, decreasing
// monotonically (0.786 -> 0.568) but never falling below 0.5 -- the swap stays the dominant
// but never the sole component of the E_flow far-tail residual.
function SwapFractionBarChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 32;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const yOf = (v) => padT + plotH - v * plotH;

  const n = IMP35381_SWAP_FRACTION_LADDER.length;
  const slot = plotW / n;
  const barW = slot * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Inverse-swap fraction of the E_flow far-tail residual, N = 1e6 .. 1e16
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(0.5)}
        x2={padL + plotW}
        y2={yOf(0.5)}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4,3"
      />

      {IMP35381_SWAP_FRACTION_LADDER.map((row, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        const top = yOf(row.swapFraction);
        const bottom = padT + plotH;
        return (
          <g key={row.N}>
            <rect x={x} y={top} width={barW} height={bottom - top} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
            <text x={xCenter} y={top - 8} textAnchor="middle" fill={ED.ink} fontSize={10} fontFamily="monospace">
              {row.swapFraction.toFixed(3)}
            </text>
            <text x={xCenter} y={padT + plotH + 18} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
              {row.N.toExponential(0)}
            </text>
          </g>
        );
      })}

      <text x={padL + plotW / 2} y={padT + plotH + 38} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        N
      </text>
    </svg>
  );
}

export default function Imp35381EflowFartailSwapFractionViz() {
  const top = IMP35381_SWAP_FRACTION_LADDER[0];
  const deep = IMP35381_SWAP_FRACTION_LADDER[IMP35381_SWAP_FRACTION_LADDER.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Inverse-Swap Fraction Ladder (imp-35381)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35279 isolated the height-map-only inverse-swap gap in the E_flow far-tail decay
        exponent at N&nbsp;=&nbsp;1e6, 1e9, 1e12, 1e16, and measured what FRACTION of the
        analytic residual it accounts for at each rung. The fraction interpolates
        MONOTONICALLY between the endpoints but DECREASES ({top.swapFraction.toFixed(3)}
        &nbsp;&rarr;&nbsp;{deep.swapFraction.toFixed(3)}) rather than rising toward 1: the
        inverse swap is the dominant but never the sole residual component, even at the
        deepest rung.
      </p>

      <SwapFractionBarChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>inverse-swap gap</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>analytic residual</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>swap fraction</th>
          </tr>
        </thead>
        <tbody>
          {IMP35381_SWAP_FRACTION_LADDER.map((row) => (
            <tr key={row.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.inverseSwapGap.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.analyticResidual.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.swapFraction.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Measurement only.
        Viz-data only, baked literals reproducing the imp-35279 swap-fraction measurements
        verbatim; no new derivation, no bound changed. The dashed line at 0.5 marks the
        threshold above which the swap stays dominant at every rung. Component model is the
        inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow&nbsp;&gt;&nbsp;0
        strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll
        far-tail exponent 1/2 per imp-3463; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no
        bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
