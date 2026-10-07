import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124880_SCATTER,
  IMP124880_FIT_LINE,
  IMP124880_ENVELOPE_UPPER,
  IMP124880_ENVELOPE_LOWER,
  IMP124880_FIT_SUMMARY,
  IMP124880_VERDICT,
} from '../data/imp-124880-pairratio-drift-slope-scatter-viz-data.js';
import { ED } from '../styles/tokens.js';

const SVG_W = 720;
const PAD_L = 70;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 48;
const SVG_H = 320;
const C_W = SVG_W - PAD_L - PAD_R;
const C_H = SVG_H - PAD_T - PAD_B;

// x-axis: log10(|E_CF|). y-axis: linear in units of 1e-12 (P spans under one decade: 9.36e-13..7.93e-12).
function DriftSlopeScatterChart() {
  const logX = (x) => Math.log10(x);
  const xVals = IMP124880_SCATTER.map((r) => logX(r.absE_CF));
  const xMin = Math.floor(Math.min(...xVals)) - 0.3;
  const xMax = Math.ceil(Math.max(...xVals)) + 0.3;

  const allY = [
    ...IMP124880_SCATTER.map((r) => r.product),
    ...IMP124880_ENVELOPE_UPPER.map((p) => p.product),
    ...IMP124880_ENVELOPE_LOWER.map((p) => p.product),
  ];
  const yMin = Math.min(0, Math.min(...allY) / 1e-12 - 0.5);
  const yMax = Math.max(...allY) / 1e-12 + 0.5;

  const xS = (x) => PAD_L + ((logX(x) - xMin) / (xMax - xMin)) * C_W;
  const yS = (y) => PAD_T + C_H - ((y / 1e-12 - yMin) / (yMax - yMin)) * C_H;

  const envelopePoints =
    IMP124880_ENVELOPE_UPPER.map((p) => `${xS(p.absE_CF)},${yS(p.product)}`).join(' ') +
    ' ' +
    [...IMP124880_ENVELOPE_LOWER].reverse().map((p) => `${xS(p.absE_CF)},${yS(p.product)}`).join(' ');

  const fitLinePoints = IMP124880_FIT_LINE.map((p) => `${xS(p.absE_CF)},${yS(p.product)}`).join(' ');

  const xTicks = [];
  for (let t = Math.ceil(xMin); t <= Math.floor(xMax); t++) xTicks.push(t);
  const yTicks = [];
  for (let t = Math.ceil(yMin); t <= Math.floor(yMax); t++) yTicks.push(t);

  return (
    <svg width={SVG_W} height={SVG_H} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + C_H} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={PAD_L} y1={PAD_T + C_H} x2={PAD_L + C_W} y2={PAD_T + C_H} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={PAD_L - 4} y1={yS(t * 1e-12)} x2={PAD_L + C_W} y2={yS(t * 1e-12)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={PAD_L - 8} y={yS(t * 1e-12) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}e-12
          </text>
        </g>
      ))}

      {xTicks.map((t) => (
        <g key={'xt' + t}>
          <line x1={xS(10 ** t)} y1={PAD_T + C_H - 4} x2={xS(10 ** t)} y2={PAD_T + C_H + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(10 ** t)} y={PAD_T + C_H + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {'1e' + t}
          </text>
        </g>
      ))}
      <text x={PAD_L + C_W / 2} y={SVG_H - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        |E_CF| (log scale)
      </text>
      <text
        x={16}
        y={PAD_T + C_H / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${PAD_T + C_H / 2})`}
      >
        P = |reldiff| * |E_CF|  (1e-12)
      </text>

      <polygon points={envelopePoints} fill={ED.series2} fillOpacity={0.14} stroke="none" />
      <polyline points={fitLinePoints} fill="none" stroke={ED.series2} strokeWidth={2} />

      {IMP124880_SCATTER.map((r) => (
        <circle key={r.key} cx={xS(r.absE_CF)} cy={yS(r.product)} r={4} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
      ))}
    </svg>
  );
}

export default function Imp124880PairratioDriftSlopeScatterViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Drift-Slope OLS Fit: P = D*|E_CF| + R Scatter (imp-124880 / imp-124850)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a presentation-only leaf
        reusing the frozen imp-124850 OLS fit verbatim (same six L2..L7 rungs, same fitted slope D,
        intercept R, and their standard errors). Accuracy/cross-validation diagnostic, NOT an RH bound;
        no operator positivity established; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-124850 fit the round-off invariant product P = |reldiff| * |E_CF| against |E_CF| across the
        six L2..L7 landmark rungs under the drift model P = D*|E_CF| + R, where the slope D is any
        genuine |E_CF|-proportional identity drift and the intercept R is the landmark-bisection
        round-off floor. The six orange points below are the measured (|E_CF|, P) rungs, the solid line
        is the best-fit OLS slope/intercept, and the shaded band is the +/-2-sigma envelope (slope and
        intercept each shifted by 2 standard errors) &mdash; the data stay well within the band and the
        line is visually flat, matching the fitted t-statistic of {IMP124880_FIT_SUMMARY.drift_slope_t_vs_zero}{' '}
        (well inside one sigma of zero slope).
      </p>

      <DriftSlopeScatterChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>value</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['drift slope D', IMP124880_FIT_SUMMARY.drift_slope_D],
            ['slope standard error', IMP124880_FIT_SUMMARY.drift_slope_se],
            ['t-statistic vs zero', IMP124880_FIT_SUMMARY.drift_slope_t_vs_zero],
            ['round-off floor R (intercept)', IMP124880_FIT_SUMMARY.roundoff_floor_R],
            ['intercept standard error', IMP124880_FIT_SUMMARY.roundoff_floor_se],
            ['R^2', IMP124880_FIT_SUMMARY.R2],
            ['2-sigma drift bound |D|+2se(D)', IMP124880_FIT_SUMMARY.drift_bound_2sigma],
            ['single-rung L2 cap (imp-124811)', IMP124880_FIT_SUMMARY.single_rung_cap_L2],
          ].map(([label, value]) => (
            <tr key={label} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{String(value)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124880_VERDICT}
      </div>
    </div>
  );
}
