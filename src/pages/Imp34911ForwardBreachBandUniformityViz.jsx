import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34889_FORWARD_BREACH_BAND_UNIFORMITY } from '../data/imp-34889-forward-breach-band-uniformity.js';
import { ED } from '../styles/tokens.js';

const D = IMP34889_FORWARD_BREACH_BAND_UNIFORMITY;
const TABLE = D.bandTable; // [{k, rho_half_width, breach_step_lo/hi, four_step_ratio_to_margin_lo/hi, ...}]

// The 4-step image-half-width fraction of the (H2) margin at each sampled band point (lo/hi per k rung),
// against the crossing step (constant = 5 everywhere) -- the chart the ticket asks for.
function FourStepFractionChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 54;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const points = TABLE.flatMap((row) => [
    { label: `k=${row.k} lo`, frac: row.four_step_ratio_to_margin_lo, breach: row.breach_step_lo },
    { label: `k=${row.k} hi`, frac: row.four_step_ratio_to_margin_hi, breach: row.breach_step_hi },
  ]);

  const yMin = 0.7;
  const yMax = 1.0;
  const xAt = (i) => padL + ((i + 0.5) / points.length) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const yTicks = [0.7, 0.8, 0.9, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yAt(1)}
        x2={padL + cW}
        y2={yAt(1)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + cW - 2} y={yAt(1) - 4} textAnchor="end" fill={ED.series2} fontSize={9}>
        margin = (H2) delta*N (crossing line)
      </text>

      <polyline
        points={points.map((p, i) => `${xAt(i)},${yAt(p.frac)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={xAt(i)} cy={yAt(p.frac)} r={4} fill={ED.series1} />
          <text x={xAt(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {p.label}
          </text>
          <text x={xAt(i)} y={padT + cH + 28} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
            step {p.breach}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        band point (imp-34693 k rung, lower/upper edge)
      </text>
    </svg>
  );
}

// The forward/contraction width ratio across the same band points -- band-invariant at ~2.56e12-2.92e12.
function WidthRatioChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 70;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = TABLE.flatMap((row) => [
    { label: `k=${row.k} lo`, v: row.width_ratio_lo },
    { label: `k=${row.k} hi`, v: row.width_ratio_hi },
  ]);
  const minV = 2.0e12;
  const maxV = 3.2e12;
  const rowH = cH / rows.length;
  const xAt = (v) => padL + ((v - minV) / (maxV - minV)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x={padL - 6} y={padT + i * rowH + rowH / 2 + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
            {r.label}
          </text>
          <line
            x1={padL}
            y1={padT + i * rowH + rowH / 2}
            x2={xAt(r.v)}
            y2={padT + i * rowH + rowH / 2}
            stroke={ED.series3}
            strokeWidth={8}
            strokeLinecap="round"
          />
          <text x={xAt(r.v) + 6} y={padT + i * rowH + rowH / 2 + 3} fill={ED.inkFaint} fontSize={9}>
            {r.v.toExponential(3)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp34911ForwardBreachBandUniformityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Forward-Breach Band Uniformity (imp-34911 / imp-34889)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The 4-step forward-image half-width stays at {D.measured.four_step_ratio_to_margin_band_min}
        &ndash;{D.measured.four_step_ratio_to_margin_band_max} of the (H2) margin at every sampled
        imp-34693 band point (worst {D.measured.four_step_ratio_to_margin_band_max} at the lower edge,
        where the margin is smallest) -- always under 1, so the integer crossing step is exactly{' '}
        {D.measured.breach_step_band_min} band-wide.
      </p>
      <FourStepFractionChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The forward/contraction width ratio across the same band points stays band-invariant at{' '}
        {D.measured.width_ratio_band_min}&ndash;{D.measured.width_ratio_band_max} (T0 cancels; the spread
        is discrete ULP granularity of the contraction floor).
      </p>
      <WidthRatioChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Widest band: k={D.constants.widest_band_k}, half-width &asymp;{' '}
        {D.constants.widest_band_half_width} ({D.constants.widest_band_frac_of_N_cross} of N_cross &asymp;{' '}
        {D.constants.N_cross}). Center-point cross-check against the published imp-34865 literals:
        width ratio {D.crosscheck.center_width_ratio_matches_imp34865 ? 'matches' : 'MISMATCH'}, crossing
        step {D.crosscheck.center_breach_step_matches_imp34865 ? 'matches' : 'MISMATCH'} (both 5).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34889 bandTable/measured literals verbatim (no new computation). Feasibility/measurement on
        the INHERITED imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the imp-34687a
        directed-rounding layer; imp-34714a REMAINS OPEN. C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; changes no bound; establishes
        no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
