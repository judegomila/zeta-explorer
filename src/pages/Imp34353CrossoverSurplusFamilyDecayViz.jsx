import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34260_SURPLUS_FAMILY_LADDER,
  IMP34260_SURPLUS_1EM4_CROSSING,
} from '../data/imp-34260-crossover-surplus-family-viz-data.js';
import { ED } from '../styles/tokens.js';

// Log-scale bar chart of surplus(thr) across the five thresholds, annotated with
// the N_cross(thr) each rung recedes to and the surplus-below-1e-4 crossing marker.
function SurplusDecayBars() {
  const svgW = 640;
  const svgH = 340;
  const padL = 68;
  const padR = 20;
  const padT = 20;
  const padB = 64;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logMin = -9.5;
  const logMax = -3.2;
  const yAt = (v) => padT + cH - ((Math.log10(v) - logMin) / (logMax - logMin)) * cH;

  const n = IMP34260_SURPLUS_FAMILY_LADDER.length;
  const slot = cW / n;
  const barW = slot * 0.5;

  const yTickExps = [-3, -4, -5, -6, -7, -8, -9];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTickExps.map((e) => {
        const v = Math.pow(10, e);
        if (e < logMin || e > logMax) return null;
        return (
          <g key={'y' + e}>
            <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              {'1e' + e}
            </text>
          </g>
        );
      })}

      {IMP34260_SURPLUS_FAMILY_LADDER.map((row, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        const top = yAt(row.surplus);
        const bottom = padT + cH;
        return (
          <g key={row.thr}>
            <rect
              x={x}
              y={top}
              width={barW}
              height={bottom - top}
              fill={ED.series1}
              stroke={ED.paper}
              strokeWidth={0.75}
            />
            <text x={xCenter} y={top - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
              {row.surplus.toExponential(2)}
            </text>
            <text x={xCenter} y={padT + cH + 16} textAnchor="middle" fill={ED.ink} fontSize={10}>
              thr={row.thr}
            </text>
            <text x={xCenter} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5} fontFamily="monospace">
              N_cross&asymp;{row.N_cross.toExponential(2)}
            </text>
          </g>
        );
      })}

      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        surplus(thr) (log scale)
      </text>
    </svg>
  );
}

export default function Imp34353CrossoverSurplusFamilyDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-Surplus Threshold-Family Decay Ladder (imp-34353 / imp-34174)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33848 showed the halving-vs-crossover surplus 1/2&minus;sigma(N_cross) is purely the
        Gronwall E_flow term, and imp-33743 generalised the crossover to arbitrary thr via
        N_cross(thr) = (C_C(1&minus;thr)/(E_trunc&nbsp;thr))<sup>2</sup>&nbsp;log&nbsp;T0. imp-34174
        restores E_flow at each generalised crossover in closed form,
        surplus(thr) = thr(1&minus;thr)r/(1+(1&minus;thr)r) with r = E_flow(N_cross)/E_trunc, and
        tabulates the family thr &isin; {'{'}0.5, 0.3, 0.1, 0.05, 0.01{'}'}: as thr shrinks, N_cross(thr)
        recedes from {IMP34260_SURPLUS_FAMILY_LADDER[0].N_cross.toExponential(3)} to{' '}
        {IMP34260_SURPLUS_FAMILY_LADDER[IMP34260_SURPLUS_FAMILY_LADDER.length - 1].N_cross.toExponential(3)},
        and the surplus collapses monotonically from{' '}
        {IMP34260_SURPLUS_FAMILY_LADDER[0].surplus.toExponential(4)} to{' '}
        {IMP34260_SURPLUS_FAMILY_LADDER[IMP34260_SURPLUS_FAMILY_LADDER.length - 1].surplus.toExponential(4)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        surplus(thr) collapse across the generalised threshold family (log-scale bars, N_cross(thr) annotated)
      </p>
      <SurplusDecayBars />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>thr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N_cross(thr)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>E_flow/E_trunc</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>surplus(thr)</th>
          </tr>
        </thead>
        <tbody>
          {IMP34260_SURPLUS_FAMILY_LADDER.map((row) => (
            <tr key={row.thr} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.thr}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.N_cross.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.eFlowOverETrunc.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.surplus.toExponential(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Crossing marker:</strong>{' '}
        {IMP34260_SURPLUS_1EM4_CROSSING.label}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked
        literals reproducing the imp-34174 measurement (via the imp-34260 viz-data module); no
        new derivation, no bound changed. Derivation/measurement only within the inherited
        imp-33743/imp-33848 extrapolation component model, which is NOT a rigorous asymptotic;
        C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz untouched; imp-3066 K_a&ge;0
        untouched; NO QED.
      </div>
    </div>
  );
}
