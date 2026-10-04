import React from 'react';
import { ED } from '../styles/tokens.js';

/**
 * WithinStepStepoverExplainer (imp-35363) — a short companion explainer for the
 * imp-35278 finding: an endpoint gate OR an endpoint signed-crossing check is
 * blind to a DP45 order-5 dt/2 pair-1495 pass-through that completes entirely
 * inside a single step. Both endpoints of the step read positive (no collision
 * detected), while the true trajectory dips negative and returns strictly
 * between them.
 *
 * Mounted on Imp35288R2FlowLadderSlackViz to make the "within-step step-over,
 * not an endpoint artifact" language in that page's narrative concrete.
 *
 * Props:
 *   compact  when true, render with tighter top/bottom margins for dense pages.
 */
export default function WithinStepStepoverExplainer({ compact = false } = {}) {
  const svgW = 320;
  const svgH = 100;
  const padL = 12;
  const padR = 12;
  const padT = 14;
  const padB = 14;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const yZero = padT + plotH * 0.4;
  const yDip = padT + plotH * 0.95;
  const x0 = padL;
  const xMid = padL + plotW * 0.5;
  const x1 = padL + plotW;

  // Smooth cubic through (x0, yZero) -> dip near xMid -> (x1, yZero), staying
  // positive at both sampled endpoints while crossing negative in between.
  const path = `M ${x0} ${yZero - 10} C ${xMid - 40} ${yZero - 6}, ${xMid - 20} ${yDip}, ${xMid} ${yDip} S ${xMid + 40} ${yZero - 6}, ${x1} ${yZero - 10}`;

  return (
    <div
      style={{
        background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
        border: '1px solid color-mix(in srgb, var(--brass-deco) 35%, transparent)',
        borderLeft: '4px solid var(--brass-deco)',
        borderRadius: 8,
        padding: '14px 16px',
        margin: compact ? '12px 0' : '18px 0',
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold', color: 'var(--brass)' }}>
        Why an endpoint check misses a within-step step-over
      </p>
      <p style={{ margin: '0 0 10px 0', fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary, #94a3b8)' }}>
        A gate check and a signed-crossing check both only ever sample the gap
        function <strong>at step endpoints</strong>. For pair-1495 on the DP45
        order-5 dt/2 reference, the gap is <strong>positive at both endpoints</strong>
        of one step, but the true order-5 sub-step trajectory dips negative and
        returns strictly inside that step &mdash; a step-over that neither method can
        see, because neither ever evaluates the gap anywhere except the two
        endpoints it already agrees on.
      </p>
      <svg width={svgW} height={svgH} style={{ display: 'block', margin: '0 auto 10px' }}>
        <line x1={padL} y1={yZero} x2={x1} y2={yZero} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
        <text x={padL} y={yZero - 14} fill={ED.inkFaint} fontSize={8.5}>
          gap(t) = 0
        </text>
        <path d={path} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
        <circle cx={x0} cy={yZero - 10} r={3.5} fill={ED.series3} />
        <circle cx={x1} cy={yZero - 10} r={3.5} fill={ED.series3} />
        <text x={x0 - 6} y={yZero - 18} fill={ED.series3} fontSize={8}>
          + (endpoint)
        </text>
        <text x={x1 - 44} y={yZero - 18} fill={ED.series3} fontSize={8}>
          + (endpoint)
        </text>
        <text x={xMid - 30} y={yDip + 12} fill={ED.series2} fontSize={8}>
          &minus; interior (missed)
        </text>
      </svg>
      <p style={{ margin: '0 0 6px 0', fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary, #94a3b8)' }}>
        Two remedies actually catch this:
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.75, color: 'var(--text-secondary, #94a3b8)' }}>
        <li>
          <strong style={{ color: 'var(--brass)' }}>Finer grid:</strong> shrink the step so the
          interior dip straddles a step boundary instead of hiding inside one step (the
          imp-35324 tauC/4000 re-run).
        </li>
        <li>
          <strong style={{ color: 'var(--brass)' }}>True sub-step dense output:</strong> a DP45
          dense-output interpolant evaluated within the step, rather than only at its two
          endpoints.
        </li>
      </ul>
    </div>
  );
}
