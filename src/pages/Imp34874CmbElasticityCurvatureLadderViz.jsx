import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE } from '../data/imp-34844-inflection-crossover-gap-cmb-curvature.js';
import { ED } from '../styles/tokens.js';

const D = IMP34844_INFLECTION_CROSSOVER_GAP_CMB_CURVATURE;
const GRID = D.curveGrid; // C_mb descending 1.00 -> 0.30, with dRelGap_dCmb and d2RelGap_dCmb2 at each node
const CMB_STAR = D.linearExtrapolationMissesFlip.trueZeroCmb; // ~0.5116 sign-flip (imp-34838)

// Shared line-chart shell: plots a single series of {C_mb, value} nodes against C_mb (descending left-to-right)
// with a dashed marker at the C_mb* sign-flip location.
function LadderChart({ title, unit, color, valueKey, formatValue, note }) {
  const svgW = 680;
  const padL = 74;
  const padR = 30;
  const padT = 34;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 200;
  const svgH = padT + plotH + padB;

  const cmbMin = Math.min(...GRID.map((g) => g.C_mb));
  const cmbMax = Math.max(...GRID.map((g) => g.C_mb));
  const values = GRID.map((g) => g[valueKey]);
  const vMin = Math.min(...values, 0);
  const vMax = Math.max(...values, 0);
  const vSpan = vMax - vMin || 1;

  const xOf = (cmb) => padL + ((cmbMax - cmb) / (cmbMax - cmbMin)) * plotW; // C_mb=1 at left, 0.30 at right
  const yOf = (v) => padT + plotH - ((v - vMin) / vSpan) * plotH;
  const yZero = yOf(0);

  const pathD = GRID.map((g, i) => `${i === 0 ? 'M' : 'L'} ${xOf(g.C_mb).toFixed(2)} ${yOf(g[valueKey]).toFixed(2)}`).join(' ');
  const xStar = xOf(CMB_STAR);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>{title}</p>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        <line x1={padL} y1={yZero} x2={padL + plotW} y2={yZero} stroke={ED.rule} strokeWidth={1} />
        <line x1={xStar} y1={padT} x2={xStar} y2={padT + plotH} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={xStar} y={padT - 12} textAnchor="middle" fill={ED.brass} fontSize={10} fontWeight={700}>
          C_mb* &asymp; {CMB_STAR.toFixed(4)}
        </text>
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} />
        {GRID.map((g) => (
          <circle key={g.C_mb} cx={xOf(g.C_mb)} cy={yOf(g[valueKey])} r={3} fill={color} />
        ))}
        {[GRID[0], GRID[GRID.length - 1]].map((g) => (
          <text
            key={`lbl-${g.C_mb}`}
            x={xOf(g.C_mb)}
            y={yOf(g[valueKey]) + (g[valueKey] >= 0 ? -10 : 18)}
            textAnchor="middle"
            fill={color}
            fontSize={10}
            fontFamily="monospace"
          >
            {formatValue(g[valueKey])}
          </text>
        ))}
        <text x={padL} y={svgH - 10} fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
          C_mb = {cmbMax.toFixed(2)}
        </text>
        <text x={padL + plotW} y={svgH - 10} textAnchor="end" fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
          C_mb = {cmbMin.toFixed(2)}
        </text>
        <text x={padL - 10} y={padT + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
          {unit}
        </text>
      </svg>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{note}</p>
    </div>
  );
}

export default function Imp34874CmbElasticityCurvatureLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="C_mb Elasticity + Curvature Ladder (imp-34874 / imp-34844)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34824 quoted the inflection-vs-crossover gap elasticity d(relGap)/dC_mb&nbsp;~&nbsp;
        {D.slopeSpan.dRelGap_dCmb_at_gue} ONLY at the GUE bound C_mb&nbsp;=&nbsp;1. imp-34844 measured the
        same first and second derivatives on a dense C_mb grid: the elasticity rises MONOTONICALLY&nbsp;
        {D.slopeSpan.spanRatio}x to {D.slopeSpan.dRelGap_dCmb_at_low} at C_mb&nbsp;=&nbsp;0.30, while the
        curvature stays negative at every node and strengthens&nbsp;{D.curvatureSpan.strengthenRatio}x. The
        accelerating (not linear) approach is what pulls the sign-flip up into the physical range at
        C_mb*&nbsp;~&nbsp;{CMB_STAR.toFixed(4)} &mdash; a linear read of the GUE-bound slope alone would
        place it at C_mb&nbsp;~&nbsp;{D.linearExtrapolationMissesFlip.linearPredictedZeroCmb}, outside [0,1].
      </p>

      <LadderChart
        title={`First derivative d(relGap)/dC_mb (per unit C_mb) — rises ~${D.slopeSpan.spanRatio}x`}
        unit="d(relGap)/dC_mb"
        color={ED.series1}
        valueKey="dRelGap_dCmb"
        formatValue={(v) => v.toExponential(2)}
        note={`Monotonically increasing at every node from ${D.slopeSpan.dRelGap_dCmb_at_gue} at the GUE bound to ${D.slopeSpan.dRelGap_dCmb_at_low} at C_mb=0.30 — the +2.15e-2/unit imp-34824 value is a boundary plateau, not the elasticity across the sweep.`}
      />

      <LadderChart
        title={`Second derivative d2(relGap)/dC_mb2 (per unit^2 C_mb) — strengthens ~${D.curvatureSpan.strengthenRatio}x`}
        unit="d2(relGap)/dC_mb2"
        color={ED.series2}
        valueKey="d2RelGap_dCmb2"
        formatValue={(v) => v.toExponential(2)}
        note={`Negative at every node (all ${GRID.length} nodes below zero), from ${D.curvatureSpan.d2RelGap_dCmb2_at_gue} at the GUE bound to ${D.curvatureSpan.d2RelGap_dCmb2_at_low} at C_mb=0.30 — Richardson-stable across h in {0.01,0.02,0.04} (${D.curvatureSpan.richardsonHStability.toExponential(1)} agreement), a genuine accelerating concavity.`}
      />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34844
        curveGrid/slopeSpan/curvatureSpan literals verbatim (no new computation). Second-order diagnostic of
        an imp-34824 landmark on the inherited imp-3220/imp-3406 surrogate crossover map; treats C_mb as a
        free knob; does NOT tighten or discharge the GUE conditional (imp-486); the C_C&nbsp;1/8 ansatz
        (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
      </div>
    </div>
  );
}
