import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD } from '../data/imp-34773-crossover-N-stencil-order-spread.js';
import { ED, alpha } from '../styles/tokens.js';

const DATA = IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD;
const ROWS = [DATA.stencil_4th_7pt, DATA.stencil_6th_9pt, DATA.stencil_8th_11pt];

// -- band plot: x = finer-edge closed-form crossover log10(N) for each of the three stencils.
// The 9-point (imp-34754) landmark sits INSIDE the [11-point, 7-point] band, not at either edge. --
function StencilOrderBandChart() {
  const xs = ROWS.map((r) => r.crossover_log10N_finer_0p05);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const pad = (xMax - xMin) * 0.18;

  const svgW = 680;
  const svgH = 200;
  const padL = 56;
  const padR = 24;
  const padT = 28;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const lo = xMin - pad;
  const hi = xMax + pad;
  const sx = (x) => padL + ((x - lo) / (hi - lo)) * plotW;
  const midY = padT + plotH / 2;

  const colorByOrder = { 4: ED.series1, 6: ED.series4, 8: ED.series2 };

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        log10(N) -- finer-edge (dp = 0.05) closed-form crossover
      </text>

      {/* the [362.6, 396.2] stencil-order band */}
      <rect
        x={sx(xMin)}
        y={padT + 8}
        width={sx(xMax) - sx(xMin)}
        height={plotH - 16}
        fill={alpha(ED.inkSoft, 0.1)}
        stroke="none"
      />

      <line x1={padL} y1={midY} x2={padL + plotW} y2={midY} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 4" />

      {ROWS.map((r) => (
        <g key={r.order}>
          <line
            x1={sx(r.crossover_log10N_finer_0p05)}
            y1={padT + 8}
            x2={sx(r.crossover_log10N_finer_0p05)}
            y2={padT + plotH - 8}
            stroke={colorByOrder[r.order]}
            strokeWidth={r.order === 6 ? 2.5 : 1.5}
          />
          <circle
            cx={sx(r.crossover_log10N_finer_0p05)}
            cy={midY}
            r={r.order === 6 ? 6 : 4.5}
            fill={colorByOrder[r.order]}
            stroke={ED.paper}
            strokeWidth={0.75}
          />
          <text
            x={sx(r.crossover_log10N_finer_0p05)}
            y={padT - 8}
            textAnchor="middle"
            fill={colorByOrder[r.order]}
            fontSize={11}
          >
            {r.order}-pt: {r.crossover_log10N_finer_0p05}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp34810CrossoverNStencilOrderBandViz() {
  const row6 = DATA.stencil_6th_9pt;
  const row4 = DATA.stencil_4th_7pt;
  const row8 = DATA.stencil_8th_11pt;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-N Stencil-Order Band, Finer Edge (imp-34810 / imp-34773)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34754 located the dp*(N)/probe-band finer-edge crossover landmark at log10&nbsp;N&nbsp;~&nbsp;
        {row6.crossover_log10N_finer_0p05} using the 9-point (6th-order) stencil alone. Because the roundoff
        amplitude W_max/denom enters dp*(N) cubically, imp-34773 re-measured the same crossover on the
        7-point (4th-order) and 11-point (8th-order) stencils too. The band below shows all three: the
        9-point landmark sits in the MIDDLE of the [{row8.crossover_log10N_finer_0p05},&nbsp;
        {row4.crossover_log10N_finer_0p05}] band spanned by the other two orders --
        ~{DATA.finer_crossover_spread_decades} decades wide (~{Math.round(DATA.finer_crossover_spread_fraction_of_central * 100)}%
        of the central value) -- not at either edge, so the landmark is stencil-order-robust in the sense
        that no single stencil choice pushes it outside the band the other orders bracket.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Finer-edge crossover across the three stencil orders
      </p>
      <StencilOrderBandChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>Stencil</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>Order</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>W_max/denom</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>Crossover log10 N (finer, 0.05)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>Crossover log10 N (coarser, 0.1)</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr
              key={r.order}
              style={{
                borderBottom: '1px solid var(--rule-soft)',
                color: r.order === 6 ? 'var(--brass)' : 'var(--ink)',
                fontWeight: r.order === 6 ? 700 : 400,
              }}
            >
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.stencil}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.order}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.roundoff_amplitude_wMax_over_denom}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.crossover_log10N_finer_0p05}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.crossover_log10N_coarser_0p1}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        The shift is an exact (W_max/denom)^(-1/4) power law: the 11-point/7-point crossover ratio
        {' '}{DATA.crossover_ratio_11pt_over_7pt} matches the amplitude-ratio prediction
        {' '}{DATA.amplitude_power_law_prediction} to 4 digits. The exact-model no-crossing verdict at
        N&nbsp;=&nbsp;1e300 holds on all three stencils (finer ratio {row4.exact_finer_ratio_1e300} /{' '}
        {row6.exact_finer_ratio_1e300} / {row8.exact_finer_ratio_1e300}, all &lt; 1), with the margin
        narrowing as stencil order (and roundoff amplitude) rises.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34773
        stencil-order sweep (imported literal, no new computation); establishes no new numerical claim.
        q1..q3 are inherited central differences on the imp-3220/imp-3406 component model, not fresh
        analytic closed forms, and the crossover N is an asymptotic extrapolation hundreds of decades past
        the imp-34711-validated 1e100 window -- it certifies nothing about the true q3. C_C&nbsp;=&nbsp;
        (1/8)&radic;(3&pi;) (imp-2714) and C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&nbsp;
        &ge;&nbsp;0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
