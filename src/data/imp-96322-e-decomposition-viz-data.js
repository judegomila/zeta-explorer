/**
 * @module imp-96322-e-decomposition-viz-data
 *
 * imp-96322 (ux): import-light viz-data leaf for the imp-96290 Step-4 bridge
 * E(N) = E_trunc(N) + E_flow(N) + E_coll(N) decomposition at the conditional
 * anchor N = 1e4, plus the C_H = C_shock * C_Lip / 4 sub-constant magnitudes.
 * imp-96290 assembled that inventory as a measurement/table but shipped no
 * chart.
 *
 * Reshapes the imp-96290 baked conditionalAnchor and cHFactorization records
 * into log-scale-ready bar series. No re-derivation: every plotted magnitude
 * is copied verbatim from IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY.
 *
 * MEASUREMENT / PRESENTATION ONLY. Does not close G6_polymath15_bridge,
 * changes no bound, asserts no operator positivity. The conditional anchor
 * (C_H <= 0.127) is UNPROVEN (imp-2642/imp-2701: C_H isRigorousUpperBound =
 * false); this leaf must never present it as proven. RH open; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-96290-step4-bridge-subconstant-inventory.js (inventory, source of every literal)
 *
 * Ticket: imp-96322 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY } from './imp-96290-step4-bridge-subconstant-inventory.js';

const ANCHOR = IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY.conditionalAnchor;
const C_H_FACTORS = IMP96290_STEP4_BRIDGE_SUBCONSTANT_INVENTORY.cHFactorization;

// The three E(N) sub-terms at the N = 1e4 conditional anchor (C_H <= 0.127),
// reshaped for a log-scale bar chart. Order matches the decomposition string
// E(N) = E_trunc(N) + E_flow(N) + E_coll(N).
export const IMP96322_EN_TERMS = Object.freeze([
  Object.freeze({ key: 'E_trunc', label: 'E_trunc(N)', value: ANCHOR.E_trunc, quantified: true }),
  Object.freeze({ key: 'E_flow', label: 'E_flow(N)', value: ANCHOR.E_flow, quantified: true }),
  Object.freeze({ key: 'E_coll', label: 'E_coll(N)', value: ANCHOR.E_coll_at_hyp, quantified: false }),
]);

export const IMP96322_EN_TOTAL = Object.freeze({
  key: 'E_N',
  label: 'E(N) total',
  value: ANCHOR.E_N_at_hyp_approx,
});

export const IMP96322_PT_BOUND = ANCHOR.PT_BOUND;

// The two factors of C_H = C_shock * C_Lip / 4, for the supporting table.
// C_Lip has no numeric value: it is the unquantified (RH-hard) residual.
export const IMP96322_C_H_FACTORS = Object.freeze([
  Object.freeze({
    key: 'C_shock',
    label: 'C_shock',
    value: C_H_FACTORS.C_shock.magnitudeAtN1e4,
    quantified: C_H_FACTORS.C_shock.isNDependenceQuantified,
  }),
  Object.freeze({
    key: 'C_Lip',
    label: 'C_Lip',
    value: null,
    quantified: C_H_FACTORS.C_Lip.isNDependenceQuantified,
  }),
]);

export const IMP96322_C_H_ANSATZ = Object.freeze({
  leadingOrder: 0.125,
  stressTested: 0.127,
  isRigorousUpperBound: ANCHOR.isProven,
});

// Shared null -> label mapping so the render layer and the assertion below use the exact same
// string (imp-96341): C_Lip's value must never fall through to blank/NaN in the table cell.
export const IMP96322_UNQUANTIFIED_LABEL = '— (unquantified)';
export function formatCHFactorValue(value) {
  return value === null ? IMP96322_UNQUANTIFIED_LABEL : value;
}

export const IMP96322_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every E_trunc/E_flow/E_coll/E(N) '
  + 'magnitude and every C_shock/C_H value is copied verbatim from the imp-96290 baked inventory; only the '
  + 'log-scale bar layout is computed here (no re-derivation). The conditional anchor (C_H <= 0.127) is '
  + 'UNPROVEN -- C_H isRigorousUpperBound = false (imp-2642/imp-2701) -- and C_Lip, the one unquantified '
  + 'factor of C_H, is the RH-hard residual (imp-2640 Gronwall discharge NEGATIVE). Changes no bound, '
  + 'establishes no operator positivity.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96322_ASSERTIONS = [
  {
    id: 'imp96322-three-terms-present',
    holds: () => IMP96322_EN_TERMS.length === 3
      && IMP96322_EN_TERMS.every((t) => typeof t.value === 'number' && t.value > 0),
    why: 'the E(N) decomposition has exactly three positive sub-terms (E_trunc, E_flow, E_coll).',
  },
  {
    id: 'imp96322-terms-sum-to-total',
    holds: () => approx(
      IMP96322_EN_TERMS.reduce((s, t) => s + t.value, 0),
      IMP96322_EN_TOTAL.value,
      1e-3,
    ),
    why: 'E_trunc + E_flow + E_coll(hyp) must reproduce the imp-96290 baked E(N) total at the conditional anchor.',
  },
  {
    id: 'imp96322-total-well-under-pt-bound',
    holds: () => IMP96322_EN_TOTAL.value < IMP96322_PT_BOUND,
    why: 'imp-2706: the conditional budget sits well under the Platt-Trudgian bound (~16x margin).',
  },
  {
    id: 'imp96322-e-coll-dominates',
    holds: () => {
      const eColl = IMP96322_EN_TERMS.find((t) => t.key === 'E_coll').value;
      return IMP96322_EN_TERMS.every((t) => t.key === 'E_coll' || t.value <= eColl);
    },
    why: 'imp-96290: E_coll is the dominant sub-term of E(N) (linear leading factor of C_H).',
  },
  {
    id: 'imp96322-c-lip-unquantified-not-plotted-numeric',
    holds: () => IMP96322_C_H_FACTORS.find((c) => c.key === 'C_Lip').value === null
      && IMP96322_C_H_FACTORS.find((c) => c.key === 'C_Lip').quantified === false,
    why: 'C_Lip carries no numerical magnitude (its N-dependence is unquantified/RH-hard); the leaf must '
      + 'never fabricate a number for it.',
  },
  {
    id: 'imp96341-c-lip-formats-as-unquantified-label',
    holds: () => formatCHFactorValue(null) === IMP96322_UNQUANTIFIED_LABEL
      && formatCHFactorValue(IMP96322_C_H_FACTORS.find((c) => c.key === 'C_Lip').value) === IMP96322_UNQUANTIFIED_LABEL,
    why: 'imp-96341: the C_Lip table cell must render the explicit unquantified label, never blank/NaN.',
  },
  {
    id: 'imp96322-anchor-not-proven',
    holds: () => IMP96322_C_H_ANSATZ.isRigorousUpperBound === false,
    why: 'C_H isRigorousUpperBound = false (imp-2642/imp-2701 lock); the conditional anchor must stay '
      + 'flagged unproven.',
  },
  {
    id: 'imp96322-honest-banner-carries-status',
    holds: () => /RH open/.test(IMP96322_HONEST_BANNER)
      && /NO QED/.test(IMP96322_HONEST_BANNER)
      && /UNPROVEN/.test(IMP96322_HONEST_BANNER),
    why: 'honesty gate: measurement/presentation only, no RH claim, conditional anchor stays unproven.',
  },
];

for (const a of IMP96322_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96322-e-decomposition-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
