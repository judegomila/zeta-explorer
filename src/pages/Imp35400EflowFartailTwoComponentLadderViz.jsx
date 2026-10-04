import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35400_LADDER,
  IMP35400_SUMMARY,
} from '../data/imp-35400-eflow-fartail-two-component-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Stacked-bar chart: swap gap (bottom) + fd-vs-analytic remnant (top) at all four rungs,
// summing to the analytic residual -- the imp-35279/imp-35280 four-rung extension of the
// imp-35236/imp-35295 two-endpoint decomposition.
function StackedLadderChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 46;
  const padB = 54;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const yMax = 0.014;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;

  const n = IMP35400_LADDER.length;
  const slot = plotW / n;
  const barW = slot * 0.42;

  const yTicks = [0, 0.004, 0.008, 0.012];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 28} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        E_flow far-tail residual across the ladder: inverse-swap gap vs fd-vs-analytic remnant
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      {IMP35400_LADDER.map((row, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        const swapTop = yOf(row.swapGap);
        const totalTop = yOf(row.swapGap + row.remnant);
        const bottom = padT + plotH;
        return (
          <g key={row.N}>
            <rect x={x} y={swapTop} width={barW} height={bottom - swapTop} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
            <rect x={x} y={totalTop} width={barW} height={swapTop - totalTop} fill={ED.series7} stroke={ED.paper} strokeWidth={0.75} />
            <text x={xCenter} y={totalTop - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
              {row.residual.toFixed(4)}
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

      <g>
        <rect x={padL + plotW - 210} y={padT - 4} width={10} height={10} fill={ED.series1} />
        <text x={padL + plotW - 196} y={padT + 5} fill={ED.inkSoft} fontSize={9.5}>
          inverse-swap gap
        </text>
        <rect x={padL + plotW - 90} y={padT - 4} width={10} height={10} fill={ED.series7} />
        <text x={padL + plotW - 76} y={padT + 5} fill={ED.inkSoft} fontSize={9.5}>
          remnant
        </text>
      </g>
    </svg>
  );
}

// Line chart: the swap fraction decreases monotonically (0.786 -> 0.568) while the
// remnant's share of the residual grows (0.214 -> 0.432) -- a mirror-image crossing trend.
function FractionTrendChart() {
  const svgW = 640;
  const svgH = 240;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const n = IMP35400_LADDER.length;
  const xAt = (i) => padL + (cW * i) / (n - 1);
  const yAt = (v) => padT + cH - v * cH;

  const swapPts = IMP35400_LADDER.map((r, i) => [xAt(i), yAt(r.swapFraction)]);
  const remnantPts = IMP35400_LADDER.map((r, i) => [xAt(i), yAt(1 - r.swapFraction)]);

  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <path d={toPath(swapPts)} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={toPath(remnantPts)} fill="none" stroke={ED.series7} strokeWidth={2} />

      {IMP35400_LADDER.map((row, i) => (
        <g key={row.N}>
          <circle cx={swapPts[i][0]} cy={swapPts[i][1]} r={3.5} fill={ED.series1} />
          <circle cx={remnantPts[i][0]} cy={remnantPts[i][1]} r={3.5} fill={ED.series7} />
          <text x={xAt(i)} y={padT + cH + 18} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {row.N.toExponential(0)}
          </text>
        </g>
      ))}

      <g>
        <rect x={padL + cW - 210} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + cW - 196} y={padT + 9} fill={ED.inkSoft} fontSize={9.5}>
          swap fraction
        </text>
        <rect x={padL + cW - 90} y={padT} width={10} height={10} fill={ED.series7} />
        <text x={padL + cW - 76} y={padT + 9} fill={ED.inkSoft} fontSize={9.5}>
          remnant fraction
        </text>
      </g>
    </svg>
  );
}

export default function Imp35400EflowFartailTwoComponentLadderViz() {
  const top = IMP35400_LADDER[0];
  const deep = IMP35400_LADDER[IMP35400_LADDER.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Two-Component Decomposition: Full Four-Rung Ladder (imp-35400)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35236 decomposed the E_flow far-tail leading residual into an inverse-swap gap plus a
        closed-form/prefactor remnant, but only at its two endpoint anchors N&nbsp;=&nbsp;1e6 and
        1e16 (visualized in imp-35295). imp-35279 and imp-35280 independently extended the same
        decomposition to the two intermediate rungs N&nbsp;=&nbsp;1e9 and 1e12, confirming the
        reconstruction identity holds at every rung and that the remnant is a NON-VANISHING floor
        whose share of the (shrinking) residual grows deep down the ladder. This page visualizes
        the full four-rung result.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Swap gap + remnant reconstructs the residual at all four rungs
      </p>
      <StackedLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Swap fraction decreases ({top.swapFraction.toFixed(3)} &rarr; {deep.swapFraction.toFixed(3)}) while the
        remnant fraction grows ({(1 - top.swapFraction).toFixed(3)} &rarr; {(1 - deep.swapFraction).toFixed(3)})
      </p>
      <FractionTrendChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>swap gap</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>remnant</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>swap fraction</th>
          </tr>
        </thead>
        <tbody>
          {IMP35400_LADDER.map((row) => (
            <tr key={row.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.N.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.swapGap.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.remnant.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.residual.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Measurement only. Viz-data
        only, baked literals reproducing the imp-35279/imp-35280 four-rung measurements verbatim;
        no new derivation, no bound changed. The inverse swap is the dominant but not sole residual component at every
        rung; the fd-vs-analytic remnant is a non-vanishing ~0.002 closed-form/prefactor floor, not
        a transient artifact. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT
        a rigorous asymptotic; E_flow &gt; 0 strictness (imp-33848) untouched; C_mb GUE-conditional
        per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a&nbsp;&ge;&nbsp;0
        untouched; changes no bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
