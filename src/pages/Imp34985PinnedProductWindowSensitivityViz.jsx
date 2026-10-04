import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34956_PINNED_PRODUCT_WINDOW_SENSITIVITY as D } from '../data/imp-34956-pinned-product-window-sensitivity.js';
import { ED } from '../styles/tokens.js';

const SWEEP = D.dexSweep; // 11-point dense sample of P = g* r0 across the full [1e9,1e11] bracket
const NOMINAL_DEX = D.nominalWindow.dex; // 9.53
const P_NOMINAL = D.nominalWindow.product; // ~1.43656e-3
const LANDMARK_DEX = D.physicalCrossingLandmark.landmarkDex; // ~9.53068
const P_MOVE_PHYSICAL = D.localSensitivity.pMoveAcrossPhysicalWindow; // ~9.1e-8
const RESIDUAL = D.localSensitivity.residualRampSpread; // 1.6e-7
const MAX_OVER_MIN = D.fullBracket.maxOverMin; // ~52.8x

// log10(P) plotted against the swept X_CROSS window dex, across the full [1e9,1e11] bracket.
function WindowSensitivityChart() {
  const svgW = 760;
  const svgH = 320;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const dexLo = 9;
  const dexHi = 11;
  const log10PLo = -4.3; // below the smallest sample (~-4.11)
  const log10PHi = -2.2; // above the largest sample (~-2.39)

  const xAt = (dex) => padL + ((dex - dexLo) / (dexHi - dexLo)) * cW;
  const yAt = (p) => padT + cH - ((Math.log10(p) - log10PLo) / (log10PHi - log10PLo)) * cH;

  const path = SWEEP.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xAt(s.dex)},${yAt(s.product)}`).join(' ');

  const xTicks = [9, 9.5, 10, 10.5, 11];
  const yTickVals = [4e-3, 1e-3, 3e-4, 1e-4];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTickVals.map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={v}>
          <line x1={xAt(v)} y1={padT + cH} x2={xAt(v)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* P(X_CROSS) curve across the full bracket -- 52.8x swing, log-scaled y axis */}
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {SWEEP.map((s) => (
        <circle key={s.dex} cx={xAt(s.dex)} cy={yAt(s.product)} r={2.5} fill={ED.series1} />
      ))}

      {/* nominal window / physical crossing landmark -- coincide to < 1e-3 dex, marked as one point */}
      <line x1={xAt(NOMINAL_DEX)} y1={padT} x2={xAt(NOMINAL_DEX)} y2={padT + cH} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <circle cx={xAt(NOMINAL_DEX)} cy={yAt(P_NOMINAL)} r={4} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(NOMINAL_DEX) + 6} y={yAt(P_NOMINAL) - 8} fill={ED.brass} fontSize={9}>
        nominal 10^{NOMINAL_DEX} = physical landmark ({LANDMARK_DEX.toFixed(3)})
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        X_CROSS window (log10 N); y = P = g* r0, log scale
      </text>
      <text x={16} y={padT + cH / 2} fill={ED.inkFaint} fontSize={10} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        P (log scale)
      </text>
    </svg>
  );
}

export default function Imp34985PinnedProductWindowSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pinned-Product Window Sensitivity (imp-34985 / imp-34956)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        P = g* r0 falls monotonically by a factor of {MAX_OVER_MIN}x ({D.fullBracket.productLo}&nbsp;
        &rarr;&nbsp;{D.fullBracket.productHi}) as the X_CROSS window is swept across the full
        [10^9,&nbsp;10^11] bracket. The nominal window 10^{NOMINAL_DEX} (amber) sits on the physical
        knee-inflection crossing landmark (~{LANDMARK_DEX.toFixed(3)} dex) to &lt;&nbsp;1e-3 dex, so the
        two markers coincide at this chart&apos;s resolution.
      </p>
      <WindowSensitivityChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> The {MAX_OVER_MIN}x swing shown
        here is an uncertainty on the ABSOLUTE VALUE of P from a free window choice -- it contributes
        EXACTLY ZERO to the ~{RESIDUAL.toExponential(1)} m-ramp-invariance residual (imp-34924), because
        that residual is measured with X_CROSS held FIXED across every m. Pinned to the physical
        crossing landmark (window width ~{D.physicalCrossingLandmark.windowWidthDex}), the fixed-window
        assumption instead perturbs P by only ~{P_MOVE_PHYSICAL.toExponential(1)} -- the same order as
        the noise floor, and far too small to resolve on this chart. Viz-only page rendering imp-34956
        literals verbatim (no new bound). Measurement only on the inherited imp-3220/imp-3406 surrogate;
        C_mb GUE-conditional per imp-486; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
