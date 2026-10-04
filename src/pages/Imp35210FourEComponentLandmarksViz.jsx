import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35210_LANDMARKS,
  IMP35210_N_MIN,
  IMP35210_N_MAX,
  IMP35210_DECADE_GAPS,
  IMP35210_NCROSS_OFFSETS,
} from '../data/imp-35210-four-e-component-landmarks-viz-data.js';
import { ED } from '../styles/tokens.js';

// One shared log-N axis: the four E-component crossover/threshold landmarks as ticks, ordered
// L1 (E_flow=E_trunc) < L2 (E_flow<1%) < L3 (E_coll=E_trunc, N_cross) < L4 (E_flow<0.1%).
function FourLandmarkLogAxis() {
  const svgW = 680;
  const svgH = 220;
  const padL = 50;
  const padR = 50;
  const padT = 60;
  const padB = 60;
  const cW = svgW - padL - padR;
  const axisY = padT + (svgH - padT - padB) / 2;

  const log10Min = Math.log10(IMP35210_N_MIN);
  const log10Max = Math.log10(IMP35210_N_MAX);
  const span = log10Max - log10Min;
  const pad = span * 0.15;
  const domainMin = log10Min - pad;
  const domainMax = log10Max + pad;
  const xAt = (n) => padL + ((Math.log10(n) - domainMin) / (domainMax - domainMin)) * cW;

  const points = IMP35210_LANDMARKS.map((l, i) => ({
    ...l,
    x: xAt(l.N),
    labelUp: i % 2 === 0,
  }));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* shared axis */}
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke={ED.rule} strokeWidth={1.5} />

      {/* landmark ticks */}
      {points.map((p) => (
        <g key={p.key}>
          <line x1={p.x} y1={axisY - 6} x2={p.x} y2={axisY + 6} stroke={ED.inkSoft} strokeWidth={1.5} />
          <circle
            cx={p.x}
            cy={axisY}
            r={4}
            fill={p.key === 'L3' ? ED.series2 : ED.brassDeco}
            stroke={ED.paper}
            strokeWidth={1}
          />
          <text
            x={p.x}
            y={p.labelUp ? axisY - 26 : axisY + 46}
            textAnchor="middle"
            fill={ED.ink}
            fontSize={9.5}
            dominantBaseline={p.labelUp ? 'auto' : 'hanging'}
          >
            {p.label}
          </text>
          <text
            x={p.x}
            y={p.labelUp ? axisY - 14 : axisY + 58}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={8}
            dominantBaseline={p.labelUp ? 'auto' : 'hanging'}
          >
            {p.N.toExponential(4)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp35210FourEComponentLandmarksViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Four E-Component Landmarks on One Shared Log-N Axis (imp-35210)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35153 pinned the E_flow = E_trunc crossover in closed form (N &asymp; 1.597752e6) and
        imp-35154 pinned the two E_flow negligibility thresholds (1% and 0.1% share of the
        above-floor residual) relative to the imp-33723 E_coll = E_trunc crossover N_cross &asymp;
        3.280294e9. This viz places all four landmarks on one shared log-N axis, in N-order, with
        the N_cross landmark highlighted in red.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        shared log-N axis: E_flow=E_trunc, E_flow&lt;1%, E_coll=E_trunc (N_cross), E_flow&lt;0.1%
      </p>
      <FourLandmarkLogAxis />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {IMP35210_LANDMARKS.map((l) => (
            <tr key={l.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{l.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{l.N.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{l.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Consecutive decade gaps:{' '}
        {IMP35210_DECADE_GAPS.map((g) => `${g.from}→${g.to} ≈ ${g.decades}`).join(', ')}.
        The E_flow&lt;1% threshold sits &asymp;{IMP35210_NCROSS_OFFSETS.L2_decades_below_Ncross} decades
        below N_cross, and the E_flow&lt;0.1% threshold sits &asymp;
        {IMP35210_NCROSS_OFFSETS.L4_decades_above_Ncross} decades above N_cross -- so the entire
        E_coll = E_trunc crossover neighborhood is already E_coll-only to better than 1%.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, every landmark
        (L1-L4) reused verbatim from imp-35153 / imp-35154 / imp-33723 -- all inherited from the
        imp-3220/imp-3406 single-rate log-law SURROGATE, no recomputation. Reader-facing diagnostic,
        NOT a rigorous asymptotic. The L3 landmark is the sigma(N) = E_coll/E(N) = 1/2 crossover
        (imp-33723): sigma(N) itself is a GUE-conditional diagnostic SHARE of the surrogate, not a
        way to move Lambda -- moving it changes no bound. The C_mb GUE-conditional per imp-486 is
        UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
