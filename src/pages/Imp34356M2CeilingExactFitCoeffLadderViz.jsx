import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34356_COEFF_LADDER,
  IMP34356_CONTRIB_BEYOND_LINEAR,
  IMP34356_ENDPOINT_TERM_RATIOS,
  IMP34356_KEND_EXACT,
  IMP34356_EXACT_FIT_COEFF,
  IMP34356_E_AT_CROSSING,
  IMP34356_ED_AT_CROSSING,
} from '../data/imp-34356-m2-ceiling-exactfit-coeff-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Bar chart of c_eff(M) vs endpoint-truncation order M, with the +90 exact-fit reference line.
function CeffLadderChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minY = -200;
  const maxY = 180;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;
  const zeroY = yAt(0);

  const n = IMP34356_COEFF_LADDER.length;
  const bandW = cW / n;
  const barW = bandW * 0.55;

  const yTicks = [-200, -150, -100, -50, 0, 50, 100, 150];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + cW} y2={zeroY} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yAt(IMP34356_EXACT_FIT_COEFF)}
        x2={padL + cW}
        y2={yAt(IMP34356_EXACT_FIT_COEFF)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yAt(IMP34356_EXACT_FIT_COEFF) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        exact-fit coefficient {IMP34356_EXACT_FIT_COEFF}
      </text>

      {IMP34356_COEFF_LADDER.map((r, i) => {
        const bx = padL + i * bandW + (bandW - barW) / 2;
        const y0 = yAt(0);
        const y1 = yAt(r.cEff);
        const barY = Math.min(y0, y1);
        const barH = Math.max(Math.abs(y1 - y0), 1);
        const positive = r.cEff >= 0;
        return (
          <g key={'bar' + r.order}>
            <rect
              x={bx}
              y={barY}
              width={barW}
              height={barH}
              fill={positive ? ED.series1 : ED.series2}
              opacity={0.85}
              rx={2}
            />
            <text
              x={bx + barW / 2}
              y={positive ? barY - 6 : barY + barH + 14}
              textAnchor="middle"
              fill={ED.ink}
              fontSize={9}
              fontFamily="monospace"
            >
              {r.cEff.toFixed(1)}
            </text>
            <text x={bx + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              M={r.order}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        endpoint-curvature truncation order M
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        effective coefficient c_eff(M)
      </text>
    </svg>
  );
}

export default function Imp34356M2CeilingExactFitCoeffLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="M2-Ceiling Exact-Fit Coefficient Ladder (imp-34356 / imp-34267)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34267 decomposed the imp-34189 exact-fit e^3 D^2 coefficient (&asymp;{' '}
        {IMP34356_EXACT_FIT_COEFF}, reproducing the bisected kEnd* = {IMP34356_KEND_EXACT.toFixed(3)}{' '}
        exactly) through the isolated endpoint-curvature Taylor channel. Truncating sigma_hi at
        order M (all other channels kept exact) gives an effective single coefficient c_eff(M)
        that has the WRONG sign at M=0 ({IMP34356_COEFF_LADDER[0].cEff.toFixed(1)}), overshoots at
        M=1 and M=2, reaches the exact-fit already at cubic order M=3, and locks at{' '}
        {IMP34356_COEFF_LADDER[4].cEff.toFixed(2)} by M=4.
      </p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 5%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>imp-34267 finding:</strong> the endpoint Taylor terms
        shrink with the exact ratio term_{'{m+1}'}/term_m = -(eD/2)/(m+1) (
        {IMP34356_ENDPOINT_TERM_RATIOS.map((r) => r.ratio).join(', ')}) -- factorial-dominated, so
        the endpoint series CONVERGES. eD at the crossing &asymp;{' '}
        {IMP34356_ED_AT_CROSSING.toFixed(2)} (e &asymp; {IMP34356_E_AT_CROSSING.toFixed(2)}) is
        O(1), which is why the low-order truncations swing so far before settling.
      </div>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        c_eff(M): sign flip at M=0, overshoot at M=1/M=2, lock onto the exact-fit by M=4
      </p>
      <CeffLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>order M</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd*(M)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>c_eff(M)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>contribution beyond linear</th>
          </tr>
        </thead>
        <tbody>
          {IMP34356_COEFF_LADDER.map((r, i) => {
            const contrib = IMP34356_CONTRIB_BEYOND_LINEAR.find((c) => c.order === r.order);
            return (
              <tr key={r.order} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.order}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEndStar.toFixed(4)}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.cEff.toFixed(3)}</td>
                <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                  {contrib ? contrib.delta.toFixed(3) : '—'}
                </td>
              </tr>
            );
          })}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34267 measurement; no new derivation, no bound changed. Descriptive
        surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED;
        imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
