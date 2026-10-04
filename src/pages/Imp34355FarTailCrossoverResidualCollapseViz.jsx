import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34355_LANDMARK_COMPARISON,
  IMP34355_FARTAIL_RESIDUAL_COLLAPSE,
  IMP34355_SUMMARY,
} from '../data/imp-34355-fartail-crossover-residual-collapse-viz-data.js';
import { ED } from '../styles/tokens.js';

// Grouped log-scale bar chart: relative residual and E_flow/E_trunc ratio at the halving
// (thr=0.5) and far-tail (thr=0.1) landmarks -- both series drop by the SAME ~54x factor.
function LandmarkComparisonBars() {
  const svgW = 640;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logMin = -5.5;
  const logMax = -2;
  const yAt = (v) => padT + cH - ((Math.log10(v) - logMin) / (logMax - logMin)) * cH;

  const n = IMP34355_LANDMARK_COMPARISON.length;
  const groupSlot = cW / n;
  const barW = groupSlot * 0.28;
  const gap = groupSlot * 0.06;

  const yTickExps = [-2, -3, -4, -5];
  const series = [
    { key: 'rel_offset', color: ED.series7, label: 'closed-form-vs-empirical residual' },
    { key: 'E_flow_over_E_trunc', color: ED.series1, label: 'E_flow/E_trunc' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTickExps.map((e) => {
        const v = Math.pow(10, e);
        return (
          <g key={'y' + e}>
            <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              {'1e' + e}
            </text>
          </g>
        );
      })}

      {IMP34355_LANDMARK_COMPARISON.map((row, i) => {
        const groupCenter = padL + groupSlot * i + groupSlot / 2;
        return (
          <g key={row.landmark}>
            {series.map((s, j) => {
              const x = groupCenter - barW - gap / 2 + j * (barW + gap);
              const top = yAt(row[s.key]);
              const bottom = padT + cH;
              return (
                <g key={s.key}>
                  <rect x={x} y={top} width={barW} height={bottom - top} fill={s.color} stroke={ED.paper} strokeWidth={0.75} />
                  <text
                    x={x + barW / 2}
                    y={top - 6}
                    textAnchor="middle"
                    fill={ED.inkSoft}
                    fontSize={8.5}
                    fontFamily="monospace"
                  >
                    {row[s.key].toExponential(2)}
                  </text>
                </g>
              );
            })}
            <text x={groupCenter} y={padT + cH + 18} textAnchor="middle" fill={ED.ink} fontSize={10.5}>
              {row.landmark}
            </text>
          </g>
        );
      })}

      <g>
        <rect x={padL + cW - 210} y={padT} width={10} height={10} fill={ED.series7} />
        <text x={padL + cW - 196} y={padT + 9} fill={ED.inkSoft} fontSize={9.5}>
          residual
        </text>
        <rect x={padL + cW - 130} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + cW - 116} y={padT + 9} fill={ED.inkSoft} fontSize={9.5}>
          E_flow/E_trunc
        </text>
      </g>

      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        log scale
      </text>
    </svg>
  );
}

// Log-scale bar chart: the far-tail residual collapses from ~7.38e-5 (E_flow dropped) to
// ~1.33e-15 (E_flow restored) -- confirming the entire residual IS the flow term.
function ResidualCollapseBars() {
  const svgW = 640;
  const svgH = 260;
  const padL = 68;
  const padR = 20;
  const padT = 20;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logMin = -16;
  const logMax = -4;
  const yAt = (v) => padT + cH - ((Math.log10(v) - logMin) / (logMax - logMin)) * cH;

  const n = IMP34355_FARTAIL_RESIDUAL_COLLAPSE.length;
  const slot = cW / n;
  const barW = slot * 0.4;

  const yTickExps = [-4, -6, -8, -10, -12, -14, -16];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTickExps.map((e) => {
        const v = Math.pow(10, e);
        return (
          <g key={'y' + e}>
            <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
            <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
              {'1e' + e}
            </text>
          </g>
        );
      })}

      {IMP34355_FARTAIL_RESIDUAL_COLLAPSE.map((row, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        const top = yAt(row.rel_offset);
        const bottom = padT + cH;
        return (
          <g key={row.variant}>
            <rect x={x} y={top} width={barW} height={bottom - top} fill={ED.series3} stroke={ED.paper} strokeWidth={0.75} />
            <text x={xCenter} y={top - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
              {row.rel_offset.toExponential(2)}
            </text>
            <text x={xCenter} y={padT + cH + 16} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
              {row.variant}
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
        residual (log scale)
      </text>
    </svg>
  );
}

export default function Imp34355FarTailCrossoverResidualCollapseViz() {
  const [half, far] = IMP34355_LANDMARK_COMPARISON;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Crossover Residual Collapse (imp-34355 / imp-33743)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33723 pinned the closed-form crossover N_cross for the sigma&nbsp;=&nbsp;1/2 halving
        landmark; its closed-form-vs-empirical residual is {half.rel_offset.toExponential(2)}{' '}
        (~0.4%), entirely the dropped Gronwall E_flow term. imp-33743 generalised the closed form
        to an arbitrary threshold and evaluated it at the imp-33582 sigma&nbsp;&lt;&nbsp;0.1
        far-tail landmark: the residual there is only {far.rel_offset.toExponential(2)} (~0.007%)
        &mdash; <strong>~{IMP34355_SUMMARY.fartail_is_tighter_by.toFixed(2)}x tighter</strong>
        &mdash; because E_flow decays down the tail (F1). Restoring E_flow in the threshold
        balance closes the far-tail residual to floating-point noise (F2), confirming the entire
        gap is the flow term, NOT a discretization artifact.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        F1: residual and E_flow/E_trunc both drop by the same ~54x factor across the two landmarks
      </p>
      <LandmarkComparisonBars />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        F2: restoring E_flow in the far-tail threshold balance closes the residual to ~1.33e-15
      </p>
      <ResidualCollapseBars />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N_cross</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>E_flow/E_trunc</th>
          </tr>
        </thead>
        <tbody>
          {IMP34355_LANDMARK_COMPARISON.map((row) => (
            <tr key={row.landmark} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.landmark}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.N_cross.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.rel_offset.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.E_flow_over_E_trunc.toExponential(4)}
              </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> far-tail amplitude K_thr is{' '}
        {IMP34355_SUMMARY.amplitude_ratio_to_halving}x the halving amplitude (thr=0.1 vs thr=0.5);
        the fixed-point map is a strong contraction (|g&prime;(N_cross)|&nbsp;
        {IMP34355_SUMMARY.contraction_factor_at_root.toExponential(2)}); the residual gap tracks the
        E_flow decay to within a ~{IMP34355_SUMMARY.logT0_relative_drift_over_offset.toExponential(1)}{' '}
        second-order log&nbsp;T0 drift.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-33743/imp-33723 measurements; no new derivation, no bound changed.
        Derivation/measurement only within the inherited imp-3220/imp-3406 extrapolation component
        model, which is NOT a rigorous asymptotic; E_flow is the benign mesoscopic-Gronwall term
        (imp-2845) and its decay here does NOT touch the divergent C_Lip collision-Gronwall; C_mb
        GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz untouched; imp-3066 K_a&ge;0 untouched;
        NO QED.
      </div>
    </div>
  );
}
