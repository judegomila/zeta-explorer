import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96316_SWEEP,
  IMP96316_SUMMARY,
  IMP96316_CAVEAT_BANNER,
} from '../data/imp-96316-etrunc-sensitivity-viz-data.js';
import { ED } from '../styles/tokens.js';

// N_peak/N_flow vs E_trunc-scale multiplier (log x-axis, 0.2x .. 20x), with a horizontal reference
// line at 1/sqrt(3) that the curve crosses smoothly -- a crossing, not a plateau or fixed point.
function SensitivityChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const lnScales = IMP96316_SWEEP.map((r) => Math.log(r.scale));
  const lnLo = Math.min(...lnScales);
  const lnHi = Math.max(...lnScales);
  const ratios = IMP96316_SWEEP.map((r) => r.ratio);
  const minV = Math.min(...ratios) * 0.97;
  const maxV = Math.max(...ratios) * 1.03;
  const xOf = (scale) => padL + ((Math.log(scale) - lnLo) / (lnHi - lnLo)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;

  const crossingY = yOf(IMP96316_SUMMARY.one_over_sqrt3);
  const measuredX = xOf(1);
  const measuredY = yOf(IMP96316_SUMMARY.ratio_at_1x);
  const crossingX = xOf(IMP96316_SUMMARY.crossing_scale);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      <text x={4} y={padT + 4} fill={ED.inkSoft} fontSize={10}>
        N_peak/N_flow
      </text>
      <text x={padL + plotW - 130} y={svgH - 4} fill={ED.inkSoft} fontSize={10}>
        E_trunc scale (log, 0.2x&#8594;20x)
      </text>

      <line
        x1={padL}
        y1={crossingY}
        x2={padL + plotW}
        y2={crossingY}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + plotW - 96} y={crossingY - 5} fill={ED.series2} fontSize={9}>
        1/sqrt(3) = {IMP96316_SUMMARY.one_over_sqrt3.toFixed(5)}
      </text>

      <polyline
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.75}
        points={IMP96316_SWEEP.map((r) => `${xOf(r.scale)},${yOf(r.ratio)}`).join(' ')}
      />

      <circle cx={crossingX} cy={crossingY} r={3.5} fill={ED.series2} />
      <circle cx={measuredX} cy={measuredY} r={3.5} fill={ED.series3} />
      <text x={measuredX + 6} y={measuredY - 6} fill={ED.series3} fontSize={9}>
        measured (E_trunc=1x)
      </text>

      {[0.2, 1, 5, 20].map((s) => (
        <text
          key={s}
          x={xOf(s)}
          y={svgH - padB + 16}
          fill={ED.inkFaint}
          fontSize={9}
          textAnchor="middle"
        >
          {s}x
        </text>
      ))}
    </svg>
  );
}

export default function Imp96316EtruncSensitivityViz() {
  const s = IMP96316_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="N_peak/N_flow vs E_trunc-Scaling Sensitivity Sweep (imp-96187 / imp-96316)" />
      <p className="ed-lbl">Related: <Link to="/viz-imp96475-etrunc-sensitivity">later run (imp-96475)</Link></p>

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96316_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Scaling the fixed-strip E_trunc floor drives the imp-3220 U-shape peak-location ratio
        N_peak/N_flow smoothly and monotonically downward from {s.ratio_at_low.toFixed(4)} at{' '}
        {s.scale_at_low.toFixed(2)}x to {s.ratio_at_high.toFixed(4)} at{' '}
        {s.scale_at_high.toFixed(1)}x, crossing 1/sqrt(3) = {s.one_over_sqrt3.toFixed(5)} at
        scale &asymp; {s.crossing_scale.toFixed(3)}x &mdash; near, but not equal to, the actual
        E_trunc (1x). The curve shows no plateau or fixed point at 1/sqrt(3): the proximity is an
        accident of the inherited constants, not a forced identity.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        N_peak/N_flow vs E_trunc-scale multiplier
      </h3>
      <SensitivityChart />

      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: 'var(--ink)',
          borderCollapse: 'collapse',
          marginTop: '1.25rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>quantity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>ratio at actual E_trunc (1x)</td>
            <td style={{ textAlign: 'right', color: 'var(--series-3)' }}>{s.ratio_at_1x.toFixed(6)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>1/sqrt(3)</td>
            <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>{s.one_over_sqrt3.toFixed(6)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>E_trunc scale at the 1/sqrt(3) crossing</td>
            <td style={{ textAlign: 'right' }}>{s.crossing_scale.toFixed(4)}x</td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>sweep range</td>
            <td style={{ textAlign: 'right' }}>
              {s.scale_at_low.toFixed(2)}x&ndash;{s.scale_at_high.toFixed(1)}x
            </td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page recomputing the
        imp-96187 F3 E_trunc-scale sensitivity sweep from the identical inherited component model at
        a finer grid to expose the smooth 1/sqrt(3) crossing for charting (no new derivation).
        Measurement/derivation display only; the C_mb GUE-conditional share (imp-486) stays
        untouched; establishes no operator positivity, no RH claim; no refereed bound is changed.
         NO QED.
      </div>
    </div>
  );
}
