import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION } from '../data/imp-34909-op-depth-newton-step-reconciliation.js';
import { ED } from '../styles/tokens.js';

const D = IMP34909_OP_DEPTH_NEWTON_STEP_RECONCILIATION;

// The shared 8-ops-per-step ladder: op-depth = Newton step * 8. Both published crossing points sit
// on the SAME 2^(op-depth/8) forward-doubling curve, marked against their own reference-width ratio.
const OPS_PER_STEP = D.constants.ops_per_newton_step; // 8
const MAX_OP_DEPTH = 48;
const CURVE_POINTS = Array.from({ length: MAX_OP_DEPTH + 1 }, (_, d) => ({
  d,
  ratio: Math.pow(2, d / OPS_PER_STEP),
}));

const BREACH_POINTS = [
  {
    label: 'imp-34884 d*=8 (seed-bracket, Newton step 1)',
    depth: 8,
    ratio: D.reconciliation.forward_ratio_at_d_star, // 2.0
    threshold: D.reconciliation.r_seed_ratio_imp34884, // 1
    color: ED.series1,
  },
  {
    label: 'imp-34889 step 5 (H2-margin, op-depth 40)',
    depth: D.reconciliation.step_889_as_op_depth, // 40
    ratio: D.reconciliation.forward_ratio_at_step_889_depth, // 32.0
    threshold: D.reconciliation.r_margin_ratio_imp34889, // ~19.91
    color: ED.series2,
  },
];

// The shared forward width-inflation curve 2^(op-depth/8), log2-scaled, with the two published
// crossing points marked at op-depth 8 (ratio 2, exceeds its own seed) and op-depth 40 (ratio 32,
// exceeds the (H2) margin ~19.91).
function ForwardDoublingCurveChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 0;
  const xMax = MAX_OP_DEPTH;
  const yMin = 0; // log2(ratio) = 0 at op-depth 0
  const yMax = MAX_OP_DEPTH / OPS_PER_STEP; // log2(ratio) at op-depth 48
  const xAt = (d) => padL + ((d - xMin) / (xMax - xMin)) * cW;
  const yAt = (log2ratio) => padT + cH - ((log2ratio - yMin) / (yMax - yMin)) * cH;

  const yTicks = [0, 1, 2, 3, 4, 5, 6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            2^{t}
          </text>
        </g>
      ))}

      {/* The log2(R_margin) threshold line ~19.91's log2 ~ 4.32, showing the (16,32] dyadic window. */}
      <line
        x1={padL}
        y1={yAt(Math.log2(D.reconciliation.r_margin_ratio_imp34889))}
        x2={padL + cW}
        y2={yAt(Math.log2(D.reconciliation.r_margin_ratio_imp34889))}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text
        x={padL + cW - 4}
        y={yAt(Math.log2(D.reconciliation.r_margin_ratio_imp34889)) - 5}
        textAnchor="end"
        fill={ED.brass}
        fontSize={8.5}
      >
        R_margin~{D.reconciliation.r_margin_ratio_imp34889}
      </text>

      <polyline
        points={CURVE_POINTS.map((p) => `${xAt(p.d)},${yAt(Math.log2(p.ratio))}`).join(' ')}
        fill="none"
        stroke={ED.rule}
        strokeWidth={2}
      />

      {BREACH_POINTS.map((p) => (
        <g key={p.label}>
          <circle cx={xAt(p.depth)} cy={yAt(Math.log2(p.ratio))} r={5} fill={p.color} />
          <line
            x1={xAt(p.depth)}
            y1={yAt(Math.log2(p.ratio))}
            x2={xAt(p.depth)}
            y2={padT + cH}
            stroke={p.color}
            strokeWidth={1}
            strokeDasharray="3 2"
          />
          <text x={xAt(p.depth)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            depth {p.depth}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        op-depth (8 ops per Newton step) -- forward width ratio 2^(op-depth/8), log2 scale
      </text>
    </svg>
  );
}

// The two reference-width thresholds each crossing point is measured against, and the gap between
// them (in doublings) that explains why the same doubling curve reads 8 in one axis and 40 in the
// other.
function ThresholdGapChart() {
  const svgW = 720;
  const svgH = 150;
  const padL = 190;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = [
    { label: 'R_seed (own seed bracket)', v: D.reconciliation.r_seed_ratio_imp34884, color: ED.series1 },
    { label: 'R_margin ((H2) margin)', v: D.reconciliation.r_margin_ratio_imp34889, color: ED.series2 },
  ];
  const xMin = -1; // log10(0.1)
  const xMax = 2; // log10(100)
  const xAt = (v) => padL + ((Math.log10(v) - xMin) / (xMax - xMin)) * cW;
  const rowH = cH / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x={padL - 6} y={padT + i * rowH + rowH / 2 + 3} textAnchor="end" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
            {r.label}
          </text>
          <line
            x1={padL}
            y1={padT + i * rowH + rowH / 2}
            x2={xAt(r.v)}
            y2={padT + i * rowH + rowH / 2}
            stroke={r.color}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <text x={xAt(r.v) + 6} y={padT + i * rowH + rowH / 2 + 3} fill={ED.inkFaint} fontSize={9}>
            {r.v}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10 scale -- {D.reconciliation.log2_threshold_gap_doublings} doublings separate the two thresholds
        (== the {D.reconciliation.breach_step_gap}-step crossing gap)
      </text>
    </svg>
  );
}

export default function Imp34940OpDepthNewtonStepReconciliationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Op-Depth vs Newton-Step Forward-Breach Reconciliation (imp-34940 / imp-34909)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        On the shared {D.constants.ops_per_newton_step}-ops-per-step ladder, both published crossing
        points sit on the SAME 2^(op-depth/{D.constants.ops_per_newton_step}) forward-width-doubling
        curve: the imp-34884 seed-bracket crossing at op-depth 8{' '}
        (Newton step {D.reconciliation.d_star_884_as_newton_step}, ratio{' '}
        {D.reconciliation.forward_ratio_at_d_star.toFixed(2)}) and the imp-34889 (H2)-margin crossing at
        op-depth {D.reconciliation.step_889_as_op_depth} (Newton step 5, ratio{' '}
        {D.reconciliation.forward_ratio_at_step_889_depth.toFixed(2)}).
      </p>
      <ForwardDoublingCurveChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The two crossings differ only in which reference width they are measured against: the
        seed-bracket threshold R_seed = {D.reconciliation.r_seed_ratio_imp34884} vs the (H2)-margin
        threshold R_margin ~ {D.reconciliation.r_margin_ratio_imp34889}, a gap of{' '}
        {D.reconciliation.log2_threshold_gap_doublings} doublings -- exactly the{' '}
        {D.reconciliation.breach_step_gap}-step difference between op-depth 8 and op-depth 40.
      </p>
      <ThresholdGapChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        {D.finding}
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
        imp-34909 constants/reconciliation/finding literals verbatim (no new computation).
        Reconciliation / measurement on the INHERITED imp-3220/imp-3406 surrogate crossover map; does
        NOT instantiate the imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN. C_C 1/8
        ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0
        untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
