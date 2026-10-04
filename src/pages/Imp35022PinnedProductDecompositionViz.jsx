import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY as D } from '../data/imp-34956-pinned-product-window-sensitivity.js';
import { ED } from '../styles/tokens.js';

const G_STAR = D.gStar; // ~0.7776533 -- window-INVARIANT factor (imp-34956 W0 / imp-35011)
const MAX_REL_DIFF = D.productOverR0MaxRelDiff; // ~0 -- P/r0 = g* to machine precision at every window
const SWEEP = D.dexSweep; // 11-point sample of P = g* r0 across the full [1e9,1e11] bracket
const R0_SWEEP = SWEEP.map((s) => ({ dex: s.dex, r0: s.product / G_STAR })); // window-VARIABLE factor
const MAX_OVER_MIN = D.fullBracket.maxOverMin; // ~52.8x

// Two stacked panels sharing the same X_CROSS-window x-axis: r0 (swinging ~52.8x, log scale) on top,
// g* (flat at the FP floor) on the bottom, so the reader sees at a glance which factor carries all of
// P's window dependence.
function DecompositionCharts() {
  const svgW = 760;
  const svgH = 420;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padBGap = 56;
  const topH = 220;
  const botH = 100;
  const cW = svgW - padL - padR;

  const dexLo = 9;
  const dexHi = 11;
  const xAt = (dex) => padL + ((dex - dexLo) / (dexHi - dexLo)) * cW;

  // --- top panel: r0(dex), log scale, ~52.8x swing ---
  const log10Lo = -4.1; // below the smallest r0 sample
  const log10Hi = -2.0; // above the largest r0 sample
  const yTop = (r0) => padT + topH - ((Math.log10(r0) - log10Lo) / (log10Hi - log10Lo)) * topH;
  const topPath = R0_SWEEP.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xAt(s.dex)},${yTop(s.r0)}`).join(' ');
  const topYTicks = [5e-3, 1e-3, 3e-4, 1e-4];

  // --- bottom panel: g*(dex), flat at the double-precision floor ---
  const botY0 = padT + topH + padBGap;
  const yBotMid = botY0 + botH / 2;

  const xTicks = [9, 9.5, 10, 10.5, 11];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* top panel axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + topH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + topH} x2={padL + cW} y2={padT + topH} stroke={ED.rule} strokeWidth={1.5} />
      {topYTicks.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yTop(v)} x2={padL + cW} y2={yTop(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yTop(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      <path d={topPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {R0_SWEEP.map((s) => (
        <circle key={s.dex} cx={xAt(s.dex)} cy={yTop(s.r0)} r={2.5} fill={ED.series1} />
      ))}
      <text x={padL + 6} y={padT + 14} fill={ED.inkSoft} fontSize={10}>
        r0 = E_flow/E_trunc (window-VARIABLE factor) -- swings {MAX_OVER_MIN}x, log scale
      </text>

      {/* bottom panel: g* flat line at the FP floor */}
      <line x1={padL} y1={botY0} x2={padL} y2={botY0 + botH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={botY0 + botH} x2={padL + cW} y2={botY0 + botH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yBotMid} x2={padL + cW} y2={yBotMid} stroke={ED.series3} strokeWidth={2} />
      {R0_SWEEP.map((s) => (
        <circle key={s.dex} cx={xAt(s.dex)} cy={yBotMid} r={2.5} fill={ED.series3} />
      ))}
      <text x={padL - 8} y={yBotMid + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        {G_STAR.toFixed(7)}
      </text>
      <text x={padL + 6} y={botY0 + 14} fill={ED.inkSoft} fontSize={10}>
        g* (window-INVARIANT factor) -- flat to the double-precision floor (max rel diff {MAX_REL_DIFF})
      </text>

      {xTicks.map((v) => (
        <g key={v}>
          <line x1={xAt(v)} y1={botY0 + botH} x2={xAt(v)} y2={botY0 + botH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(v)} y={botY0 + botH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        X_CROSS window (log10 N)
      </text>
    </svg>
  );
}

export default function Imp35022PinnedProductDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pinned-Product Decomposition: g* vs r0 (imp-35022 / imp-34956)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-34956 pinned product P = g*&middot;r0 splits into a window-INVARIANT factor g* and a
        window-VARIABLE factor r0 = E_flow/E_trunc. This page renders the two factors as separate
        panels across the same [10^9,&nbsp;10^11] X_CROSS bracket: r0 (top) carries the full{' '}
        {MAX_OVER_MIN}x swing that imp-34956 measured in P, while g* (bottom) sits flat at the
        double-precision floor.
      </p>
      <DecompositionCharts />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Since P/r0 = g* to machine
        precision at every sampled window (max relative difference {MAX_REL_DIFF}), the {MAX_OVER_MIN}x
        swing visible in P is entirely a property of r0 -- the fixed-window assumption is a pure
        magnitude bound on the window-variable factor, not on g* itself. Viz-only page rendering
        imp-34956 literals verbatim (r0 derived as product/g*, no new computation). Measurement only on
        the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
