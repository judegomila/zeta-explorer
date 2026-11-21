import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95995_VARS_DECOMPOSITION_SEGMENTS,
  IMP95995_B_DIAG,
  IMP95995_B_EMPIRICAL,
  IMP95995_REQUIRED_ACCURACY,
  IMP95995_K_OVER_TOLERANCE,
} from '../data/imp-95995-varS-constant-decomposition-viz-data.js';
import { ED } from '../styles/tokens.js';

const SEGMENT_COLOR = { M: ED.series1, P2: ED.series3, K: ED.series2 };

// horizontal stacked bar: b = M + P2 (solid, pinned) + K (hatched, unresolved)
function DecompositionBarPanel() {
  const segments = IMP95995_VARS_DECOMPOSITION_SEGMENTS;
  const svgW = 640;
  const svgH = 150;
  const padL = 16;
  const padR = 16;
  const barY = 46;
  const barH = 46;
  const plotW = svgW - padL - padR;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  let cursor = padL;
  const bars = segments.map((seg) => {
    const w = (seg.value / total) * plotW;
    const bar = { ...seg, x: cursor, w };
    cursor += w;
    return bar;
  });

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <defs>
        <pattern id="imp95995-hatch" width={6} height={6} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width={6} height={6} fill={SEGMENT_COLOR.K} opacity={0.35} />
          <line x1={0} y1={0} x2={0} y2={6} stroke="#7f1d1d" strokeWidth={2} />
        </pattern>
      </defs>
      {bars.map((seg) => (
        <g key={seg.key}>
          <rect
            x={seg.x}
            y={barY}
            width={seg.w}
            height={barH}
            fill={seg.resolved ? SEGMENT_COLOR[seg.key] : 'url(#imp95995-hatch)'}
            stroke={seg.resolved ? 'none' : ED.series2}
            strokeWidth={seg.resolved ? 0 : 1.5}
          />
          {seg.w > 40 && (
            <text
              x={seg.x + seg.w / 2}
              y={barY + barH / 2 + 4}
              textAnchor="middle"
              fill={seg.resolved ? ED.paper : ED.series2}
              fontSize={11}
              fontWeight={600}
            >
              {seg.key}
            </text>
          )}
        </g>
      ))}
      <text x={padL} y={barY - 10} fill={ED.inkFaint} fontSize={10}>
        0
      </text>
      <text x={padL + plotW} y={barY - 10} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        b &asymp; {IMP95995_B_EMPIRICAL.toFixed(4)}
      </text>
      <text x={padL} y={barY + barH + 20} fill={ED.series1} fontSize={9}>
        &#9632; M (pinned, O(1e-12))
      </text>
      <text x={padL + 150} y={barY + barH + 20} fill={ED.series3} fontSize={9}>
        &#9632; P2 (pinned, O(1e-12))
      </text>
      <text x={padL + 340} y={barY + barH + 20} fill={ED.series2} fontSize={9}>
        &#9632; K (unresolved, O(1))
      </text>
    </svg>
  );
}

export default function Imp95995VarsConstantDecompositionViz() {
  const kSeg = IMP95995_VARS_DECOMPOSITION_SEGMENTS.find((s) => s.key === 'K');
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Var S(T) Constant Decomposition b = M + P2 + K (imp-95964)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only plot of an
        already-computed constant decomposition. It changes no Lambda bound and establishes no
        operator positivity.
        Catalan G irrationality stays OPEN; Sun arXiv:2609.04176 is single-author and unrefereed.
        RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95964 reconstructed the Selberg&ndash;Goldston&ndash;Fujii Var S(T) additive constant
        as b = M + P2 + K from the diagonal explicit-formula second moment. The Mertens constant
        M = {IMP95995_VARS_DECOMPOSITION_SEGMENTS[0].value.toFixed(4)} and the convergent
        prime-power double sum P2 = {IMP95995_VARS_DECOMPOSITION_SEGMENTS[1].value.toFixed(6)} are
        pinned to O(1e-12) (b_diag = {IMP95995_B_DIAG.toFixed(6)}), but the boundary/cutoff
        constant K = {kSeg.value.toFixed(4)} (backed out from the imp-95940 empirical a_0 mean) is
        an O(1) unresolved term &mdash; {IMP95995_K_OVER_TOLERANCE.toFixed(0)}x the required
        O({IMP95995_REQUIRED_ACCURACY}) accuracy needed to collapse the imp-95940 crossing-height
        range. The bar below has never been assembled before: solid segments are pinned, the
        hatched segment is the unresolved obstruction.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        b = M + P2 + K, pinned vs unresolved segments
      </h3>
      <DecompositionBarPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue and green
        segments (M and P2) are the diagonal explicit-formula arithmetic core, reproducible to
        O(1e-12) by direct prime summation. The red hatched segment (K) is not derived here &mdash;
        it is backed out from the imp-95940 empirical six-height mean and stands in for whatever
        the full smoothed explicit-formula treatment (Selberg / Goldston 1987 / Tsang 1984 / Fujii)
        would supply. Its size relative to the other two segments is the visual form of the
        obstruction: the unresolved term dominates the required accuracy, not the prime sum.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-95995 baked viz-data (values copied verbatim from the imp-95964 decomposition, no
        re-derivation). Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
