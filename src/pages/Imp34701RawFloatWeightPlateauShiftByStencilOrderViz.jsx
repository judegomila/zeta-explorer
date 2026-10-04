import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION } from '../data/imp-34684-fourth-order-stencil-reference-weight-crossvalidation.js';
import { IMP34654_SIXTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION } from '../data/imp-34654-sixth-order-stencil-reference-weight-crossvalidation.js';
import { ED } from '../styles/tokens.js';

const FOURTH = IMP34684_FOURTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION;
const SIXTH = IMP34654_SIXTH_ORDER_STENCIL_REFERENCE_CROSSVALIDATION;

const ROWS = [
  {
    label: '4th order (7-point q3)',
    order: 4,
    shift: FOURTH.plateau_raw_vs_reference_abs,
    residual: FOURTH.raw_fornberg_float_residual,
  },
  {
    label: '6th order (9-point q3)',
    order: 6,
    shift: SIXTH.plateau_raw_vs_imp34626_abs,
    residual: 5e-13,
  },
];

// Both shifts span ~4 orders of magnitude (~4e-8 vs ~3e-4), so plot log10(shift) on a
// linear axis rather than the raw values on a linear axis (the 4th-order bar would vanish).
function ShiftChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const logVals = ROWS.map((r) => Math.log10(r.shift));
  const minLog = Math.floor(Math.min(...logVals)) - 0.5;
  const maxLog = Math.ceil(Math.max(...logVals)) + 0.5;

  const minX = 1;
  const maxX = 9;
  const xAt = (order) => padL + ((order - minX) / (maxX - minX)) * cW;
  const yAt = (log) => padT + cH - ((log - minLog) / (maxLog - minLog)) * cH;
  const barW = 90;
  const zeroY = yAt(minLog);

  const gridLogs = [];
  for (let g = Math.ceil(minLog); g <= Math.floor(maxLog); g++) gridLogs.push(g);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {gridLogs.map((g) => (
        <g key={g}>
          <line x1={padL} x2={padL + cW} y1={yAt(g)} y2={yAt(g)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(g) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            1e{g}
          </text>
        </g>
      ))}
      {ROWS.map((r) => {
        const x = xAt(r.order);
        const y = yAt(Math.log10(r.shift));
        return (
          <g key={r.label}>
            <rect
              x={x - barW / 2}
              y={y}
              width={barW}
              height={zeroY - y}
              fill={r.order === 4 ? ED.series1 : ED.series7}
              opacity={0.85}
            />
            <text x={x} y={y - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
              {r.shift.toExponential(2)}
            </text>
            <text x={x} y={svgH - padB + 18} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
              {r.label}
            </text>
          </g>
        );
      })}
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        |raw-float plateau &minus; exact-integer plateau| (log scale)
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        finite-difference q3 stencil order
      </text>
    </svg>
  );
}

export default function Imp34701RawFloatWeightPlateauShiftByStencilOrderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Raw-Float-Weight Plateau Shift by Stencil Order (imp-34684 vs imp-34654)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Both the imp-34611 4th-order (7-point) and imp-34626 6th-order (9-point) q3 stencils re-derive
        their exact-integer weights from two independent reference constructions (Fornberg 1988
        recurrence and a Vandermonde solve). Feeding the RAW, un-rounded reference floats through the
        same q3-share plateau pipeline &mdash; instead of the rounded exact integers &mdash; exposes how
        much float residual in the weights leaks into the plateau. imp-34684 found this leak is ~four
        orders of magnitude smaller for the 4th-order stencil.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Raw-float-vs-exact-integer plateau shift, by stencil order
      </p>
      <ShiftChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> the 4th-order 7-point q3 stencil
        ([1,-8,13,0,-13,8,-1]/8) has Fornberg weights that are EXACTLY REPRESENTABLE in double precision
        (raw residual {FOURTH.raw_fornberg_float_residual}), so its raw-float plateau differs from the
        exact-integer plateau by only {FOURTH.plateau_raw_vs_reference_abs}. The 6th-order 9-point q3
        stencil ([-7,72,-338,488,0,-488,338,-72,7]/240) carries a ~5e-13 Fornberg residual that the q3
        near-cancellation amplifies ~1e9&times;, shifting its raw-float plateau by{' '}
        {SIXTH.plateau_raw_vs_imp34626_abs} &mdash; roughly four orders of magnitude larger. The gap is a
        weights-representability effect of the specific stencil, not a general property of wider
        stencils being more ill-conditioned (imp-34690 shows the underlying cancellation floor itself
        only differs ~1.25&times; between the two orders).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/cross-validation only,
        isRigorous false on both source modules; the inherited imp-3220/imp-3406 sigma&nbsp;-&gt;&nbsp;1
        deep-tail surrogate (least trustworthy there) is carried as-is and NOT rigorous. Neither module
        changes a bound; the C_mb GUE-conditional share per imp-486 is untouched, imp-3066 K_a&gt;=0
        untouched, no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
