import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34953_R_MARGIN_DYADIC_WALL_ACROSS_N as D } from '../data/imp-34953-r-margin-dyadic-wall-across-N.js';
import { ED, alpha } from '../styles/tokens.js';

const SWEEP = D.sweep; // per-N R_margin, log2, nStar across 1e6..1e13
const N_PIN_LO = D.pinWindow.n_pin_lo; // ~2.6361e9 (R_margin = 16)
const N_PIN_HI = D.pinWindow.n_pin_hi; // ~5.2722e9 (R_margin = 32)
const SEED_BAND_LO = D.pinWindow.imp34693_seed_band_lo; // ~3.11e9
const SEED_BAND_HI = D.pinWindow.imp34693_seed_band_hi; // ~3.45e9
const N_CROSS = D.constants.N_cross_published; // 3.2803e9
const WALLS_CROSSED = D.bandWide.dyadic_walls_crossed; // 23

// nStar(N) staircase across the 1e6..1e13 sweep (log10 N on x, nStar on y), with the nStar = 5
// pinning window (in N-space) shaded and the imp-34693 admissible seed band marked inside it.
function RMarginWallSweepChart() {
  const svgW = 760;
  const svgH = 340;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logLo = 6; // log10(1e6)
  const logHi = 13; // log10(1e13)
  const nMin = -8;
  const nMax = 17;

  const xAt = (N) => padL + ((Math.log10(N) - logLo) / (logHi - logLo)) * cW;
  const yAt = (n) => padT + cH - ((n - nMin) / (nMax - nMin)) * cH;

  // Staircase segments between consecutive sweep points (nStar held flat, appropriate for a
  // sparse log-decade grid; steps are annotated with dots at the actual measured N values).
  const stepPath = SWEEP.map((p, i) => {
    const x = xAt(p.N);
    const y = yAt(p.n_star);
    const cmd = i === 0 ? 'M' : 'L';
    return `${cmd} ${x},${y}`;
  }).join(' ');

  const xTicks = [6, 7, 8, 9, 10, 11, 12, 13];
  const yTicks = [-8, -4, 0, 4, 5, 8, 12, 16];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* nStar = 5 pinning window shading (N in (2.6361e9, 5.2722e9]) */}
      <rect
        x={xAt(N_PIN_LO)}
        y={padT}
        width={xAt(N_PIN_HI) - xAt(N_PIN_LO)}
        height={cH}
        fill={alpha(ED.series1, 0.1)}
      />
      {/* imp-34693 admissible seed band, strictly inside the pinning window */}
      <rect
        x={xAt(SEED_BAND_LO)}
        y={padT}
        width={xAt(SEED_BAND_HI) - xAt(SEED_BAND_LO)}
        height={cH}
        fill={alpha(ED.series3, 0.22)}
      />

      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL} y2={yAt(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={v}>
          <line x1={xAt(Math.pow(10, v))} y1={padT + cH} x2={xAt(Math.pow(10, v))} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(Math.pow(10, v))} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            1e{v}
          </text>
        </g>
      ))}

      {/* nStar = 5 reference line */}
      <line x1={padL} y1={yAt(5)} x2={padL + cW} y2={yAt(5)} stroke={ED.series1} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + 4} y={yAt(5) - 5} fill={ED.series1} fontSize={9}>
        nStar = 5 (op-depth 40)
      </text>

      {/* nStar(N) staircase across the sweep */}
      <path d={stepPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      {SWEEP.map((p) => (
        <circle key={p.N} cx={xAt(p.N)} cy={yAt(p.n_star)} r={2.5} fill={ED.series3} />
      ))}

      {/* N_cross marker */}
      <line x1={xAt(N_CROSS)} y1={padT} x2={xAt(N_CROSS)} y2={padT + cH} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="2 2" />
      <text x={xAt(N_CROSS)} y={padT + 12} textAnchor="middle" fill={ED.brass} fontSize={9}>
        N_cross
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log10 scale); y = nStar(R_margin(N)) = floor(log2 R_margin) + 1
      </text>
    </svg>
  );
}

export default function Imp34980RMarginDyadicWallSweepViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="R_margin Dyadic-Wall Sweep Across N (imp-34980 / imp-34953)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        R_margin(N) = N&middot;FP_LO/K is linear in N, so nStar climbs one step per doubling of N,
        crossing {WALLS_CROSSED} dyadic 2^n walls across the full 1e6..1e13 sweep (green
        staircase). The shaded blue band is the nStar&nbsp;=&nbsp;5 pinning window in N-space,
        (2.6361e9,&nbsp;5.2722e9]; the darker green band inside it is the imp-34693 admissible
        seed band [3.11e9,&nbsp;3.45e9], which sits strictly inside the pin. So nStar stays pinned
        at 5 within the seed band even though it is nowhere near pinned band-wide.
      </p>
      <RMarginWallSweepChart />

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
        imp-34953 R_margin(N) = N&middot;FP_LO/K sweep verbatim (published K/FP_LO held fixed,
        reused via imp-34930), no new computation. Verification/measurement only on the inherited
        imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the imp-34687a
        directed-rounding layer; sub-gap imp-34714a REMAINS OPEN. C_C 1/8 ansatz (imp-2642/
        imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched;
        changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
