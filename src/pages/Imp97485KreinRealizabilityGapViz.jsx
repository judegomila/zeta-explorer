import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97485_F_BATH,
  IMP97485_F_REAL_ILLUSTRATIVE,
  IMP97485_POINTWISE_BUDGET,
  IMP97485_GAP_BAR,
} from '../data/imp-97485-krein-realizability-gap-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97485: visualizes the imp-97457 measurement that no admissible
// band-limited density can fill the imp-97416 bathtub indicator -- the best
// realizable density peaks at only 52.5% of the a/pi ceiling -- and splits
// the floor gap into a realizability share (56.2%) and a discarded far-field
// share (43.8%).

function DensityPanel() {
  const svgW = 720;
  const svgH = 260;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minT = -12;
  const maxT = 12;
  const maxY = IMP97485_POINTWISE_BUDGET * 1.15;

  const xOf = (t) => padL + ((t - minT) / (maxT - minT)) * plotW;
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  // render f_bath as filled rectangles wherever it is at the ceiling (a strict indicator)
  const bathRects = [];
  let runStart = null;
  for (let i = 0; i < IMP97485_F_BATH.length; i++) {
    const p = IMP97485_F_BATH[i];
    const on = p.value > 0;
    if (on && runStart === null) runStart = p.t;
    if (!on && runStart !== null) {
      bathRects.push([runStart, IMP97485_F_BATH[i - 1].t]);
      runStart = null;
    }
  }
  if (runStart !== null) bathRects.push([runStart, IMP97485_F_BATH[IMP97485_F_BATH.length - 1].t]);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* f_bath: filled indicator blocks at the a/pi ceiling */}
      {bathRects.map(([t0, t1], i) => (
        <rect
          key={`bath${i}`}
          x={xOf(t0)}
          y={yOf(IMP97485_POINTWISE_BUDGET)}
          width={Math.max(1, xOf(t1) - xOf(t0))}
          height={plotH - (yOf(IMP97485_POINTWISE_BUDGET) - padT)}
          fill={alpha(ED.series2, 0.28)}
        />
      ))}

      {/* a/pi ceiling line */}
      <line
        x1={padL}
        y1={yOf(IMP97485_POINTWISE_BUDGET)}
        x2={padL + plotW}
        y2={yOf(IMP97485_POINTWISE_BUDGET)}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97485_POINTWISE_BUDGET) - 5} textAnchor="end" fill={ED.series2} fontSize={8.5}>
        ceiling a/pi = {IMP97485_POINTWISE_BUDGET.toFixed(4)}
      </text>

      {/* f_real: illustrative smoothed proxy, never reaching the ceiling */}
      <polyline
        points={IMP97485_F_REAL_ILLUSTRATIVE.map((p) => `${xOf(p.t)},${yOf(p.value)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[minT, 0, maxT].map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}
      <text x={padL - 8} y={yOf(0) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
        0
      </text>

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        t &mdash; red blocks: f_bath indicator (deepest measure-pi/a set); blue curve: illustrative f_real proxy
      </text>
    </svg>
  );
}

function GapBarPanel() {
  const svgW = 720;
  const svgH = 140;
  const padL = 20;
  const padR = 20;
  const padT = 30;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const barH = 44;

  const G = IMP97485_GAP_BAR;
  const total = G.totalGap; // 3066.017, from bathtubFloor to measuredCsharp
  const realWidth = (G.realizabilityShare / total) * plotW;
  const farWidth = (G.farFieldShare / total) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={realWidth} height={barH} fill={ED.series1} />
      <rect x={padL + realWidth} y={padT} width={farWidth} height={barH} fill={ED.brassDeco} />

      <text x={padL} y={padT - 8} fill={ED.inkFaint} fontSize={9}>
        bathtub floor {G.bathtubFloor.toFixed(3)}
      </text>
      <text x={padL + realWidth} y={padT - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        realizable floor {G.realizableFloor.toFixed(3)}
      </text>
      <text x={padL + plotW} y={padT - 8} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        measured c_sharp {G.measuredCsharp.toFixed(3)}
      </text>

      <text x={padL + realWidth / 2} y={padT + barH / 2 + 4} textAnchor="middle" fill={ED.paper} fontSize={9.5} fontWeight="600">
        realizability +{G.realizabilityShare.toFixed(1)} ({(G.realizabilityShareFraction * 100).toFixed(1)}%)
      </text>
      <text x={padL + realWidth + farWidth / 2} y={padT + barH / 2 + 4} textAnchor="middle" fill={ED.paper} fontSize={9.5} fontWeight="600">
        far field +{G.farFieldShare.toFixed(1)} ({(G.farFieldShareFraction * 100).toFixed(1)}%)
      </text>

      <text x={padL} y={padT + barH + 18} fill={ED.inkFaint} fontSize={9}>
        the gap from the rigorous bathtub floor to the measured c_sharp splits into two comparable shares
      </text>
    </svg>
  );
}

export default function Imp97485KreinRealizabilityGapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97457: The Krein Bathtub Realizability Gap" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> the
        blue f_real curve is an ILLUSTRATIVE smoothed proxy, not the exact
        numerically-solved top eigenfunction of P_a M_{'{sigma_2^-}'} P_a --
        it is rescaled only to match the imp-97457 measured peak-to-cap ratio
        0.5251 and is shown to convey the qualitative point (no admissible
        band-limited density can switch sharply between 0 and the a/pi
        ceiling). The red f_bath blocks and the gap-split numbers are exact:
        the deepest-measure-(pi/a) selection recomputed on the same grid, and
        the imp-97457 measured values reused verbatim. R is a finite-section
        IEEE-double eigenvalue, not interval-certified. Establishes no
        operator positivity; no bound moves; interval-rigorous certificate
        reach stays 2a&le;0.96; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH
        open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97416&apos;s bathtub optimiser assumes a density that can jump
        instantly between 0 and the pointwise cap a/pi -- but a genuinely
        band-limited (type a = (ln3)/2) density cannot switch that sharply.
        imp-97457 measured how much this costs: the best realizable density
        captures only 43.84% of the bathtub&apos;s negative integral and
        peaks at just 52.5% of the ceiling.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        f_bath (exact indicator) vs. f_real (illustrative, never fills the ceiling)
      </h3>
      <DensityPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Gap split: realizability vs. discarded far field
      </h3>
      <GapBarPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation
        only, consuming the imp-97457 measured R, gap attribution, and
        peak-to-cap ratio verbatim; f_bath is exactly recomputed, f_real is a
        labeled schematic. No re-solve of the underlying eigenproblem;
        establishes no operator positivity; changes no bound;
        interval-rigorous certificate reach stays 2a&le;0.96;
        Platt-Trudgian Lambda&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
