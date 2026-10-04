import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP } from '../data/imp-34824-inflection-crossover-gap-cmb-sweep.js';
import { ED } from '../styles/tokens.js';

const D = IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP;

// -- bar ladder: rel_gap_pct across the C_mb grid, with a zero baseline and the sign-flip C_mb marked. --
function GapLadder({ grid, zeroGapCmb }) {
  const svgW = 660;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 46;
  const rowH = 42;
  const plotW = svgW - padL - padR;
  const svgH = rowH * grid.length + padT + padB;

  const vMax = Math.max(...grid.map((g) => Math.abs(g.rel_gap_pct))) * 1.08;
  const xOf = (v) => padL + ((v + vMax) / (2 * vMax)) * plotW;
  const zeroX = xOf(0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={zeroX} x2={zeroX} y1={padT} y2={svgH - padB} stroke={ED.rule} strokeWidth={1.5} />
      {grid.map((g, i) => {
        const y = padT + rowH * i + rowH / 2;
        const barX = xOf(Math.min(0, g.rel_gap_pct));
        const barW = Math.max(Math.abs(xOf(g.rel_gap_pct) - zeroX), 2);
        const positive = g.rel_gap_pct >= 0;
        const color = positive ? ED.series1 : ED.series2;
        return (
          <g key={g.C_mb}>
            <text x={padL - 10} y={y + 4} textAnchor="end" fill={ED.inkSoft} fontSize={12} fontFamily="monospace">
              C_mb={g.C_mb.toFixed(2)}
            </text>
            <rect x={barX} y={y - 10} width={barW} height={20} fill={color} opacity={0.75} rx={3} />
            <text
              x={positive ? xOf(g.rel_gap_pct) + 8 : xOf(g.rel_gap_pct) - 8}
              y={y + 4}
              textAnchor={positive ? 'start' : 'end'}
              fill={color}
              fontSize={11}
              fontFamily="monospace"
            >
              {g.rel_gap_pct > 0 ? '+' : ''}
              {g.rel_gap_pct.toFixed(2)}%
            </text>
          </g>
        );
      })}
      <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        inflection-vs-crossover relative gap (%) -- sign flips near C_mb* ~ {zeroGapCmb.toFixed(4)}
      </text>
    </svg>
  );
}

export default function Imp34852CmbSweepSignFlipLadderViz() {
  const { grid, cmbZeroGap, gapElasticity, baseline } = D;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="C_mb-Sweep Inflection-vs-Crossover Sign-Flip Ladder (imp-34852 / imp-34824)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34824 recomputed the imp-33721 sigmoid-inflection knee and the imp-33723 Banach/Krawczyk crossover
        as functions of the GUE-conditional constant C_mb (bounded &le; 1, imp-486). At C_mb&nbsp;=&nbsp;1 the
        pair reproduces the imp-34800 +{baseline.rel_gap_pct.toFixed(2)}% residual, but across the sweep the
        relative gap falls monotonically and changes sign near C_mb&nbsp;*&nbsp;~ {cmbZeroGap.toFixed(4)},
        where the two landmarks coincide.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Relative gap (%) across the C_mb grid
      </p>
      <GapLadder grid={grid} zeroGapCmb={cmbZeroGap} />

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        The +{baseline.rel_gap_pct.toFixed(2)}% residual at C_mb&nbsp;=&nbsp;1 is the GUE-saturated endpoint
        of a monotonically-falling ladder, not a C_mb-free constant: the gap shrinks steadily through
        {' '}
        {grid.slice(1, -1).map((g) => `${g.rel_gap_pct > 0 ? '+' : ''}${g.rel_gap_pct.toFixed(2)}%`).join(', ')}
        {' '}
        before crossing zero and reaching {grid[grid.length - 1].rel_gap_pct.toFixed(2)}% at the smallest
        sampled C_mb&nbsp;=&nbsp;{grid[grid.length - 1].C_mb.toFixed(2)}. Local elasticity at the GUE bound:
        d(relGap)/dC_mb&nbsp;~&nbsp;{gapElasticity.dRelGap_dCmb.toExponential(3)} per unit -- a tighter
        (&lt;&nbsp;1) C_mb would shrink the residual toward zero, not preserve it.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34824
        literals verbatim (no new computation). Component model is the inherited imp-3220/imp-3406 surrogate
        crossover map, NOT a rigorous asymptotic; sub-gap imp-34714a REMAINS OPEN (no machine certificate).
        C_mb is treated as a free knob -- this does NOT discharge the GUE conditional (imp-486). The
        C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; no
        operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
