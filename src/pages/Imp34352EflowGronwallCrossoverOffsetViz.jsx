import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34352_LANDMARKS,
  IMP34352_LEADING_GRONWALL_TERM,
  IMP34352_LOGT0_DRIFT_TERM,
  IMP34352_PREDICTED_EXACT,
  IMP34352_MEASURED_OFFSET,
  IMP34352_LEADING_SHARE,
  IMP34352_DRIFT_SHARE,
  IMP34352_R_FLOW,
} from '../data/imp-34352-eflow-gronwall-crossover-offset-viz-data.js';
import { ED } from '../styles/tokens.js';

// Two stacked bars side by side: the MEASURED offset (single segment) vs the
// PREDICTED decomposition (leading 2r Gronwall term stacked under the deltaL
// log-T0 drift second-order term) -- both bars land at ~3.98e-3.
function OffsetDecompositionBars() {
  const svgW = 460;
  const svgH = 300;
  const padL = 64;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const maxVal = 4.4e-3;
  const yAt = (v) => padT + cH - (v / maxVal) * cH;
  const barW = 110;
  const gap = 90;
  const xMeasured = padL + 20;
  const xPredicted = xMeasured + barW + gap;

  const yTicks = [0, 0.001, 0.002, 0.003, 0.004];

  const leadingTop = yAt(IMP34352_LEADING_GRONWALL_TERM);
  const leadingBottom = yAt(0);
  const driftTop = yAt(IMP34352_LEADING_GRONWALL_TERM + IMP34352_LOGT0_DRIFT_TERM);
  const measuredTop = yAt(IMP34352_MEASURED_OFFSET);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(1)}
          </text>
        </g>
      ))}

      {/* Measured bar: single segment, the raw N_cross-vs-N_half relative offset. */}
      <rect
        x={xMeasured}
        y={measuredTop}
        width={barW}
        height={leadingBottom - measuredTop}
        fill={ED.series1}
        stroke={ED.paper}
        strokeWidth={0.75}
      />
      <text x={xMeasured + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        measured
      </text>
      <text x={xMeasured + barW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        offset
      </text>

      {/* Predicted bar: leading 2r Gronwall term (bottom) + deltaL drift (top), stacked. */}
      <rect
        x={xPredicted}
        y={leadingTop}
        width={barW}
        height={leadingBottom - leadingTop}
        fill={ED.series3}
        stroke={ED.paper}
        strokeWidth={0.75}
      />
      <rect
        x={xPredicted}
        y={driftTop}
        width={barW}
        height={leadingTop - driftTop}
        fill={ED.brassDeco}
        stroke={ED.paper}
        strokeWidth={0.75}
      />
      <text x={xPredicted + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        predicted
      </text>
      <text x={xPredicted + barW / 2} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        2r + deltaL
      </text>

      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        relative N_cross-vs-N_half offset
      </text>
    </svg>
  );
}

export default function Imp34352EflowGronwallCrossoverOffsetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow-Gronwall Crossover-Offset Decomposition (imp-34352 / imp-34270)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33723 pinned the imp-3444 E_coll=E_trunc crossover N_cross &asymp;{' '}
        {IMP34352_LANDMARKS.N_cross_closed_form.toExponential(6)} in closed form and attributed the
        residual ~0.4% offset from the sigma=1/2 halving landmark N_half &asymp;{' '}
        {IMP34352_LANDMARKS.N_half_sigma_eq_half.toExponential(6)} to the Gronwall flow term E_flow,
        but only NAMED that correction. imp-34270 FORMS it: dividing the two defining equations gives
        relOffset &asymp; 2r + deltaL, where r = E_flow/E_trunc = {IMP34352_R_FLOW.toExponential(6)}
        {' '}at N_half. The doubling comes from the inverse-square-root E_coll ~ N^(-1/2), which turns
        a fractional collision-target bump into a DOUBLED fractional shift in the crossover N.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        measured offset vs the two-term decomposition (leading 2r Gronwall term + deltaL log-T0 drift)
      </p>
      <OffsetDecompositionBars />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>share of measured offset</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>leading Gronwall term 2*E_flow/E_trunc</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP34352_LEADING_GRONWALL_TERM.toExponential(6)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {(IMP34352_LEADING_SHARE * 100).toFixed(2)}%
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>log T0 drift deltaL (second order)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP34352_LOGT0_DRIFT_TERM.toExponential(6)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {(IMP34352_DRIFT_SHARE * 100).toFixed(2)}%
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)', fontWeight: 700 }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>predicted total (2r + deltaL, exact division identity)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP34352_PREDICTED_EXACT.toExponential(6)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>100.00%</td>
          </tr>
          <tr style={{ color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>measured relative offset (N_cross vs N_half)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {IMP34352_MEASURED_OFFSET.toExponential(6)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>--</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked
        literals reproducing the imp-34270 measurement; no new derivation, no bound changed.
        Derivation/measurement only, conditional-share diagnostic, NOT a rigorous asymptotic;
        C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED;
        imp-3066 K_a&ge;0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
