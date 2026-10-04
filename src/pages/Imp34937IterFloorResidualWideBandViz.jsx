import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND } from '../data/imp-34903-iters-to-floor-residual-sign-wide-band.js';
import { ED } from '../styles/tokens.js';

const D = IMP34903_ITERS_TO_FLOOR_RESIDUAL_SIGN_WIDE_BAND;
const POINTS = D.wide_band_pointwise;
const LOC = D.summary.off_by_one_localization;

// Scatter of resid(seed) = k_single - k_measured across the full [1e6,1e15] 10^0.05 grid, showing every
// off-by-one point sits at -1 (never +1) and clusters at/below the imp-33721 sigmoid-knee decade.
function ResidualScatter() {
  const svgW = 720;
  const svgH = 260;
  const padL = 50;
  const padR = 20;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 6;
  const xMax = 15;
  const yMin = -1.5;
  const yMax = 0.5;
  const xAt = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yAt = (y) => padT + cH - ((y - yMin) / (yMax - yMin)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {[0, -1].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((e) => (
        <g key={e}>
          <line x1={xAt(e)} y1={padT + cH} x2={xAt(e)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(e)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            1e{e}
          </text>
        </g>
      ))}

      {/* sigmoid-knee decade N* ~ 3.38e9, log10 ~ 9.53 */}
      <line
        x1={xAt(9.53)}
        y1={padT}
        x2={xAt(9.53)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xAt(9.53) + 4} y={padT + 10} fill={ED.brass} fontSize={9}>
        knee ~3.38e9
      </text>

      {/* the imp-34887 tested window [1e9,1e12] */}
      <rect
        x={xAt(9)}
        y={padT}
        width={xAt(12) - xAt(9)}
        height={cH}
        fill={ED.series1}
        opacity={0.05}
      />

      {POINTS.map((p, i) => (
        <circle
          key={i}
          cx={xAt(p.logSeed)}
          cy={yAt(p.resid)}
          r={p.resid !== 0 ? 3.2 : 2}
          fill={p.resid < 0 ? ED.series2 : p.resid > 0 ? ED.series3 : ED.paper3}
          opacity={p.resid !== 0 ? 0.9 : 0.5}
        />
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        resid(seed) = k_single - k_measured across [1e6,1e15] (10^0.05 grid, 181 seeds) -- every off-by-one
        point is -1 (red), never +1 (green never appears); shaded band = imp-34887 tested [1e9,1e12] window
      </text>
    </svg>
  );
}

// Localization bar chart: off-by-one count per sub-band, showing concentration at/below the knee and
// vanishing entirely above 1e12.
function LocalizationBars() {
  const svgW = 720;
  const svgH = 220;
  const padL = 50;
  const padR = 20;
  const padT = 24;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const bands = [
    { label: '[1e6,1e9)', count: LOC.below_1e9 },
    { label: '[1e9,1e12]', count: LOC.window_1e9_1e12 },
    { label: '(1e12,1e15]', count: LOC.above_1e12 },
  ];
  const yMax = Math.max(...bands.map((b) => b.count)) * 1.25;
  const barW = cW / bands.length / 2;
  const yAt = (y) => padT + cH - (y / yMax) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {[0, yMax / 2, yMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(0)}
          </text>
        </g>
      ))}

      {bands.map((b, i) => {
        const cx = padL + ((i + 0.5) * cW) / bands.length;
        return (
          <g key={b.label}>
            <rect
              x={cx - barW / 2}
              y={yAt(b.count)}
              width={barW}
              height={padT + cH - yAt(b.count)}
              fill={b.count === 0 ? ED.paper3 : ED.series5}
            />
            <text x={cx} y={yAt(b.count) - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
              {b.count}
            </text>
            <text x={cx} y={padT + cH + 18} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {b.label}
            </text>
          </g>
        );
      })}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        off-by-one count per sub-band -- concentrated at/below the sigmoid knee, zero three decades above it
      </text>
    </svg>
  );
}

export default function Imp34937IterFloorResidualWideBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Iters-to-Floor Residual Wide-Band Sweep (imp-34937 / imp-34903)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Across the full {D.summary.wide_band_points}-point [1e6,1e15] sweep there are{' '}
        {D.summary.wide_band_off_by_one} off-by-one seeds and every single one is{' '}
        {D.summary.wide_band_minus_one_residuals === D.summary.wide_band_off_by_one ? '-1' : 'mixed-sign'}
        {' '}(0 over-counts), three decades below the sigmoid knee and three decades above it.
      </p>
      <ResidualScatter />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Localizing by sub-band, the off-by-ones sit at and below the knee decade ({LOC.below_1e9} below
        1e9, {LOC.window_1e9_1e12} in [1e9,1e12] reproducing imp-34887 verbatim) and vanish entirely above
        1e12 ({LOC.above_1e12} off-by-one): the single-rate log law is EXACT that far above the crossover.
      </p>
      <LocalizationBars />

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
        imp-34903 wide-band literals verbatim (no new computation). Measurement on the INHERITED
        imp-3220/imp-3406 surrogate map, IEEE-754 double precision, NOT a rigorous asymptotic; the
        C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED;
        imp-3066 K_a&ge;0 untouched; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
