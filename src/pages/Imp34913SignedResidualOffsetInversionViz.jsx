import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN } from '../data/imp-34887-iters-to-floor-residual-sign.js';
import { ED } from '../styles/tokens.js';

const D = IMP34887_ITERS_TO_FLOOR_RESIDUAL_SIGN;
const BAND_31 = D.sign_bands['band_31_step_0p1_1e9_to_1e12'];
const BAND_61 = D.sign_bands['band_61_step_0p05_1e9_to_1e12'];

// The signed residual k_single - k_measured across the dense [1e9,1e12] grid: 0 everywhere the single-rate
// law is exact, -1 at every off-by-one seed. Never +1 -- the deterministic sign the ticket asks to show.
function ResidualTraceChart({ band, title }) {
  const svgW = 720;
  const svgH = 200;
  const padL = 46;
  const padR = 20;
  const padT = 22;
  const padB = 30;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const trace = band.trace;
  const xAt = (i) => padL + ((i + 0.5) / trace.length) * cW;
  const yAt = (v) => padT + cH - ((v + 1.3) / 1.6) * cH; // range [-1.3, 0.3]

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        {title}
      </text>
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} />
      <text x={padL - 6} y={yAt(0) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        0
      </text>
      <line x1={padL} y1={yAt(-1)} x2={padL + cW} y2={yAt(-1)} stroke="#7f1d1d" strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL - 6} y={yAt(-1) + 3} textAnchor="end" fill={ED.series2} fontSize={9}>
        -1
      </text>
      {trace.map((p, i) => (
        <rect
          key={i}
          x={xAt(i) - (cW / trace.length) * 0.35}
          y={p.resid === 0 ? yAt(0) - 1.5 : yAt(0)}
          width={(cW / trace.length) * 0.7}
          height={Math.max(2, Math.abs(yAt(p.resid) - yAt(0)))}
          fill={p.resid === 0 ? ED.paper3 : ED.series2}
        />
      ))}
      <text x={padL} y={svgH - 4} textAnchor="start" fill={ED.inkFaint} fontSize={9}>
        10^{trace[0].log10Seed}
      </text>
      <text x={padL + cW} y={svgH - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        10^{trace[trace.length - 1].log10Seed}
      </text>
    </svg>
  );
}

// The fixed +1 offset does not zero the off-by-one count -- it inverts which seeds are exact.
function OffsetInversionChart() {
  const svgW = 720;
  const rowH = 34;
  const padL = 190;
  const padR = 100;
  const padT = 26;
  const svgH = padT + 4 * rowH + 12;
  const cW = svgW - padL - padR;

  const rows = [
    { label: 'band of 31, no offset', exact: BAND_31.exact_no_offset, total: 31, color: ED.series1 },
    { label: 'band of 31, +1 offset', exact: BAND_31.exact_plus1_offset, total: 31, color: ED.brass },
    { label: 'band of 61, no offset', exact: BAND_61.exact_no_offset, total: 61, color: ED.series1 },
    { label: 'band of 61, +1 offset', exact: BAND_61.exact_plus1_offset, total: 61, color: ED.brass },
  ];
  const xAt = (v, total) => (v / total) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, idx) => {
        const y = padT + idx * rowH;
        const w = xAt(r.exact, r.total);
        return (
          <g key={r.label}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
              {r.label}
            </text>
            <rect x={padL} y={y + 5} width={cW} height={rowH - 14} fill={ED.paper3} rx={3} />
            <rect x={padL} y={y + 5} width={w} height={rowH - 14} fill={r.color} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill={ED.ink} fontSize={10} fontFamily="monospace">
              {r.exact} exact of {r.total}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34913SignedResidualOffsetInversionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Signed Iters-to-Floor Residual and the Refuted Offset Fix (imp-34913 / imp-34887)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The signed residual k_single - k_measured across the dense [1e9,1e12] grid: {D.summary.total_off_by_one_seeds}{' '}
        seeds land off by one across both bands, and every single one is -1 (
        {D.summary.total_plus_one_residuals} seeds are +1). The single-rate log law never over-counts.
      </p>
      <ResidualTraceChart band={BAND_31} title="Band of 31 (10^0.1 spacing)" />
      <div style={{ height: '0.75rem' }} />
      <ResidualTraceChart band={BAND_61} title="Band of 61 (10^0.05 spacing)" />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Applying a fixed +1 offset to every seed does not remove the off-by-one -- it inverts the exact/off-by-one
        population, because the crossing is a seed-selective terminal-ceil boundary, not a global additive bias.
      </p>
      <OffsetInversionChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        {D.summary.why_offset_does_not_fix}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34887
        per-seed residual trace and offset-inversion counts (no new computation beyond the trace field added
        to the existing sign_bands). Measurement on the INHERITED imp-3220/imp-3406 surrogate crossover map;
        IEEE-754 double precision, no interval enclosure; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb
        GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a&ge;0 untouched; changes no bound; establishes
        no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
