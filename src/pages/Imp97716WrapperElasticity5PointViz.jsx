import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97716_RESIDUAL_ROWS,
  IMP97716_NOISE_FLOOR_BAND,
  IMP97716_SUMMARY,
} from '../data/imp-97716-wrapper-elasticity-5point-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

const CKH_3PT_COLOR = ED.series1;
const CKH_5PT_COLOR = ED.series1;
const GEXP_3PT_COLOR = ED.series4;
const GEXP_5PT_COLOR = ED.series4;
const NOISE_BAND_COLOR = alpha(ED.series2, 0.1);

// Grouped bar chart: precision digits (-log10|reldiff|) at the 3-point vs 5-point stencil, for both
// wrappers, across the three L2/L3/L4 landmarks. Taller bar = more precise (smaller residual).
function WrapperResidualChart() {
  const svgW = 680;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 55;
  const svgH = 340;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMax = Math.max(...IMP97716_RESIDUAL_ROWS.map((r) => Math.max(r.ckh_digits_5pt, r.gexp_digits_5pt))) + 1;
  const yOf = (digits) => padT + plotH - (digits / yMax) * plotH;

  const groupW = plotW / IMP97716_RESIDUAL_ROWS.length;
  const barW = groupW / 6;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* noise-floor band */}
      <rect
        x={padL}
        y={yOf(IMP97716_NOISE_FLOOR_BAND.digitsHi)}
        width={plotW}
        height={yOf(IMP97716_NOISE_FLOOR_BAND.digitsLo) - yOf(IMP97716_NOISE_FLOOR_BAND.digitsHi)}
        fill={NOISE_BAND_COLOR}
      />
      <text x={padL + 4} y={yOf(IMP97716_NOISE_FLOOR_BAND.digitsHi) - 3} fill={ED.series2} fontSize={8}>
        noise floor
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {[0, 3, 6, 9, 12].map((d) => (
        <g key={d}>
          <line x1={padL} y1={yOf(d)} x2={padL + plotW} y2={yOf(d)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(d) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {d}
          </text>
        </g>
      ))}

      {IMP97716_RESIDUAL_ROWS.map((r, i) => {
        const gx = padL + i * groupW + groupW / 2;
        const bars = [
          { v: r.ckh_digits_3pt, color: CKH_3PT_COLOR, dx: -2.5 },
          { v: r.ckh_digits_5pt, color: CKH_5PT_COLOR, dx: -1.5 },
          { v: r.gexp_digits_3pt, color: GEXP_3PT_COLOR, dx: 0.5 },
          { v: r.gexp_digits_5pt, color: GEXP_5PT_COLOR, dx: 1.5 },
        ];
        return (
          <g key={r.key}>
            {bars.map((b, j) => (
              <rect
                key={j}
                x={gx + b.dx * barW}
                y={yOf(b.v)}
                width={barW * 0.9}
                height={padT + plotH - yOf(b.v)}
                fill={b.color}
              />
            ))}
            <text x={gx} y={svgH - 30} textAnchor="middle" fill={ED.ink} fontSize={10}>
              {r.label}
            </text>
            <text x={gx} y={svgH - 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              (sigma={r.sigma})
            </text>
          </g>
        );
      })}

      <text x={-plotH / 2 - padT} y={16} transform="rotate(-90)" textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        precision digits = -log10|reldiff|
      </text>
    </svg>
  );
}

export default function Imp97716WrapperElasticity5PointViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Wrapper-Elasticity 5-Point Stencil Residuals (imp-97716 / imp-97686)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-97686 per-landmark residual ladder verbatim (no re-derivation,
        no new computation). Conditional-share diagnostic, NOT an RH bound; no refereed bound is changed;
         RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97716_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        3-point vs 5-point stencil residual precision, E_CKH (blue) vs E_GEXP (orange), L2/L3/L4
      </h3>
      <WrapperResidualChart />
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
        Darker bar = 5-point O(eps^4) rule; lighter bar = 3-point O(eps^2) rule. Red band marks the
        bisection-quantization noise floor the 5-point rule cannot cross.
      </p>

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>Landmark</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_CKH 3pt reldiff</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_CKH 5pt reldiff</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_GEXP 3pt reldiff</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_GEXP 5pt reldiff</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>GEXP improvement x</th>
          </tr>
        </thead>
        <tbody>
          {IMP97716_RESIDUAL_ROWS.map((row) => (
            <tr key={row.key} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>
                {row.label} (sigma={row.sigma})
              </td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.ckh_reldiff_3pt.toExponential(2)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.ckh_reldiff_5pt.toExponential(2)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.gexp_reldiff_3pt.toExponential(2)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.gexp_reldiff_5pt.toExponential(2)}</td>
              <td style={{ padding: '0.4rem 0.5rem' }}>{row.gexp_improvement_x}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97716_SUMMARY.verdict}
      </div>
    </div>
  );
}
