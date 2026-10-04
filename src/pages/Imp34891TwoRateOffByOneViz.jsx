import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW } from '../data/imp-34862-iters-to-floor-two-rate-law.js';
import { ED } from '../styles/tokens.js';

const D = IMP34862_ITERS_TO_FLOOR_TWO_RATE_LAW;

const ROWS = [
  { key: 'single', label: 'single-rate (baseline)', band31: D.baseline_single_rate.band_31_off_by_one, band61: D.baseline_single_rate.band_61_off_by_one, color: ED.series1 },
  { key: 'ratio_p1', label: 'ratio-fit p=1', band31: D.two_rate_ratio_fit.p1.band_31.offByOne, band61: D.two_rate_ratio_fit.p1.band_61.offByOne, color: ED.brass },
  { key: 'ratio_p2', label: 'ratio-fit p=2', band31: D.two_rate_ratio_fit.p2.band_31.offByOne, band61: D.two_rate_ratio_fit.p2.band_61.offByOne, color: ED.brass },
  { key: 'ratio_p3', label: 'ratio-fit p=3', band31: D.two_rate_ratio_fit.p3.band_31.offByOne, band61: D.two_rate_ratio_fit.p3.band_61.offByOne, color: ED.brass },
  { key: 'peel_m1', label: 'exact-peel m=1', band31: D.two_rate_exact_peel.m1.band_31.offByOne, band61: D.two_rate_exact_peel.m1.band_61.offByOne, color: ED.series3 },
  { key: 'peel_m2', label: 'exact-peel m=2', band31: D.two_rate_exact_peel.m2.band_31.offByOne, band61: D.two_rate_exact_peel.m2.band_61.offByOne, color: ED.series3 },
  { key: 'peel_m3', label: 'exact-peel m=3', band31: D.two_rate_exact_peel.m3.band_31.offByOne, band61: D.two_rate_exact_peel.m3.band_61.offByOne, color: ED.series3 },
];

const MAX_COUNT = Math.max(...ROWS.map((r) => Math.max(r.band31, r.band61)), 31);

function BarChart({ field, total, title }) {
  const svgW = 720;
  const rowH = 30;
  const padL = 150;
  const padR = 60;
  const padT = 30;
  const svgH = padT + ROWS.length * rowH + 16;
  const cW = svgW - padL - padR;
  const xAt = (v) => (v / MAX_COUNT) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={16} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        {title} (of {total})
      </text>
      {ROWS.map((r, idx) => {
        const y = padT + idx * rowH;
        const w = xAt(r[field]);
        return (
          <g key={r.key}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
              {r.label}
            </text>
            <rect x={padL} y={y + 4} width={cW} height={rowH - 12} fill={ED.paper3} rx={3} />
            <rect x={padL} y={y + 4} width={w} height={rowH - 12} fill={r.color} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill={ED.ink} fontSize={10} fontFamily="monospace">
              {r[field]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34891TwoRateOffByOneViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Two-Rate Iters-to-Floor Off-by-One Ladder (imp-34891 / imp-34862)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Off-by-one counts under the single-rate baseline vs the two-rate ratio-fit (p in &#123;1,2,3&#125;)
        and exact-peel (m in &#123;1,2,3&#125;) variants, over the two dense [1e9,1e12] bands (31 points at
        10^0.1 spacing, 61 points at 10^0.05 spacing). No variant reduces the baseline count on either band.
      </p>

      <BarChart field="band31" total={31} title="Band of 31 (10^0.1 spacing)" />
      <div style={{ height: '1rem' }} />
      <BarChart field="band61" total={61} title="Band of 61 (10^0.05 spacing)" />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '1rem' }}>
        Best two-rate off-by-one achieved: {D.summary.best_two_rate_off_by_one_band_31} of 31 (baseline{' '}
        {D.baseline_single_rate.band_31_off_by_one}) and {D.summary.best_two_rate_off_by_one_band_61} of 61
        (baseline {D.baseline_single_rate.band_61_off_by_one}). Max abs error across every two-rate variant
        stays {D.summary.max_abs_error_across_all_two_rate}. The exact-peel control -- which carries zero
        early-transient model error by construction -- still leaves the off-by-one on both bands, so the
        residual lives in the terminal ceil discretization, not the transient rate.
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
        imp-34862 two-rate off-by-one counts verbatim (no new computation). Measurement on the INHERITED
        imp-3220/imp-3406 surrogate crossover map; the C_mb GUE-conditional per imp-486 and the C_C 1/8
        ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; no
        RH verdict, NO QED.
      </div>
    </div>
  );
}
