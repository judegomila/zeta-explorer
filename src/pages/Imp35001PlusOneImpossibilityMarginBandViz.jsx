import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND as D } from '../data/imp-34951-plus-one-impossibility-margin-band.js';
import { ED } from '../styles/tokens.js';

const EPS_FP = D.constants.eps_fp;
const PENULT = D.summary.penultimate_rel_dist;
const MARGIN = D.summary.impossibility_margin;
const OFF_BY_ONE_TOTAL = D.summary.wide_band_off_by_one;
const SUB_BELOW = D.bands.sub_below_1e6_to_1e9;
const SUB_WINDOW = D.bands.sub_window_1e9_to_1e12;

// Two flat lines (EPS_FP floor, measured penultimate distance) across the localized [1e6,1e12] off-by-one
// band, with the shaded gap between them as the constant impossibility margin. Rung ticks are spaced evenly
// within each known sub-band by count (13 in [1e6,1e9), 21 in [1e9,1e12]) as an illustrative proxy for the
// real seeds, since every rung shares the identical bit-for-bit penultimate distance.
function MarginBandChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 60;
  const padR = 30;
  const padT = 30;
  const padB = 55;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 6;
  const xMax = 12;
  const xAt = (logN) => padL + ((logN - xMin) / (xMax - xMin)) * cW;

  const yEps = padT + 20;
  const yPenult = padT + cH - 30;

  const belowTicks = Array.from({ length: SUB_BELOW.offByOne }, (_, i) => 6 + (8.95 - 6) * ((i + 0.5) / SUB_BELOW.offByOne));
  const windowTicks = Array.from({ length: SUB_WINDOW.offByOne }, (_, i) => 9 + (12 - 9) * ((i + 0.5) / SUB_WINDOW.offByOne));
  const ticks = [...belowTicks, ...windowTicks];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* margin shading between the EPS_FP floor and the measured penultimate distance */}
      <rect x={padL} y={yEps} width={cW} height={yPenult - yEps} fill={ED.series1} opacity={0.08} />

      <line x1={padL} y1={yEps} x2={padL + cW} y2={yEps} stroke={ED.brassDeco} strokeWidth={1.5} />
      <text x={padL + cW + 4} y={yEps + 3} fill={ED.brass} fontSize={9.5} fontWeight={700}>
        EPS_FP
      </text>

      <line x1={padL} y1={yPenult} x2={padL + cW} y2={yPenult} stroke={ED.series1} strokeWidth={1.5} />
      <text x={padL + cW + 4} y={yPenult + 3} fill={ED.series1} fontSize={9.5} fontWeight={700}>
        penult
      </text>

      {/* the 34 off-by-one rungs, all sharing the one bit-identical penultimate distance */}
      {ticks.map((logN, i) => (
        <circle key={i} cx={xAt(logN)} cy={yPenult} r={2.6} fill={ED.series1} stroke={ED.paper} strokeWidth={0.5} />
      ))}

      {[6, 7, 8, 9, 10, 11, 12].map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={svgH - padB} x2={xAt(t)} y2={svgH - padB + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(t)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            1e{t}
          </text>
        </g>
      ))}
      <line x1={padL} y1={svgH - padB} x2={padL + cW} y2={svgH - padB} stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        {OFF_BY_ONE_TOTAL} off-by-one rungs across the localized [1e6,1e12] band (13 + 21); every rung sits at the
        SAME penultimate distance, a fixed margin below EPS_FP
      </text>
    </svg>
  );
}

export default function Imp35001PlusOneImpossibilityMarginBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Plus-One Impossibility Margin Band (imp-35001 / imp-34951)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        All {OFF_BY_ONE_TOTAL} off-by-one rungs on [1e3,1e18] share ONE bit-identical penultimate relative
        distance, {PENULT.toExponential(4)}, so the impossibility margin EPS_FP &minus; penult is a single
        quantized constant {MARGIN.toExponential(4)} ({(D.summary.margin_over_eps_fp * 100).toFixed(2)}% of
        EPS_FP) at every rung &mdash; zero spread, min margin equal to max margin.
      </p>
      <MarginBandChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {D.verdict}
      </div>
    </div>
  );
}
