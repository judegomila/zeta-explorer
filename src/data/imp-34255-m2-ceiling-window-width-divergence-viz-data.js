/**
 * @module imp-34255-m2-ceiling-window-width-divergence-viz-data
 * @fileoverview imp-34255 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34189 M2-residual
 *   sign-change ceiling window-width divergence ladder kEndStar(w).
 *
 *   imp-34189 showed the bisected M2-residual crossing kEnd* has NO w -> 0 limit:
 *   it rises MONOTONICALLY as the fitting window narrows, kEnd* ~ 21.28, 21.73,
 *   22.30, 23.17, 23.94 at w = 1, 3/4, 1/2, 1/4, 1/8 decades. The imp-34127
 *   leading closed form (kEnd* ~ 21.00, a full-decade window) sits 0.28 BELOW
 *   the w=1 bisected rung, and the expansion parameter e*D ~ 1.13 (e ~ 0.490 the
 *   local E_coll exponent, D = ln10) is O(1) -- the closed form is only
 *   qualitative at a full decade, not a converged asymptotic.
 *
 *   All numbers are baked reference literals copied from the imp-34189 module
 *   docstring/exports -- this module does not import imp-34189 (or its
 *   lambda-rh-height-mapping / polymath15-constant-C-C dependency chain) so
 *   pages consuming it stay import-light.
 *
 *   @see imp-34189-m2-ceiling-next-order-window-width-correction.js (source measurement)
 *   @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (leading closed form kEnd*~21.00)
 *   @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation.js (bisected kEnd*~21.281 at w=1)
 *
 *   Ticket: imp-34255 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// The window-width ladder: bisected kEnd* DIVERGES as w narrows -- no w -> 0 limit.
export const IMP34255_WINDOW_LADDER_ROWS = Object.freeze([
  { wDecades: 1, kEndStar: 21.281 },
  { wDecades: 0.75, kEndStar: 21.73 },
  { wDecades: 0.5, kEndStar: 22.3 },
  { wDecades: 0.25, kEndStar: 23.17 },
  { wDecades: 0.125, kEndStar: 23.94 },
]);

// The imp-34127 leading closed form -- a full-decade (w=1) estimate, sitting
// below the w=1 bisected rung by the ~0.28 gap that imp-34189 showed does NOT
// close at next order.
export const IMP34255_KEND_LEADING_CLOSED_FORM = 21.0;
export const IMP34255_KEND_BISECTED_W1 = 21.281;
export const IMP34255_LEADING_GAP = +(IMP34255_KEND_BISECTED_W1 - IMP34255_KEND_LEADING_CLOSED_FORM).toFixed(3);

// The expansion parameter e*D at the crossing -- O(1), NOT small, so the
// Taylor-in-D series underlying the closed form does not converge at w=1.
export const IMP34255_E_AT_CROSSING = 0.49;
export const IMP34255_ED_AT_CROSSING = 1.13;
export const IMP34255_ED_SQUARED_AT_CROSSING = 1.27;

export const IMP34255_M2_CEILING_WINDOW_WIDTH_DIVERGENCE_VIZ_DATA = {
  ticket: 'imp-34255',
  windowLadderRows: IMP34255_WINDOW_LADDER_ROWS,
  kEndLeadingClosedForm: IMP34255_KEND_LEADING_CLOSED_FORM,
  kEndBisectedW1: IMP34255_KEND_BISECTED_W1,
  leadingGap: IMP34255_LEADING_GAP,
  eAtCrossing: IMP34255_E_AT_CROSSING,
  eDAtCrossing: IMP34255_ED_AT_CROSSING,
  eDSquaredAtCrossing: IMP34255_ED_SQUARED_AT_CROSSING,
  note:
    'The bisected M2-residual sign-change crossing kEnd*(w) rises monotonically as the ' +
    'fitting window w narrows from a full decade to 1/8 decade (21.28 -> 23.94), with no ' +
    'w -> 0 limit: the underlying continuous residual cancels identically, so there is no ' +
    'converged value the ladder approaches. The imp-34127 leading closed form (21.00) is a ' +
    'full-decade (w=1) reading that sits 0.28 below the w=1 bisected rung because the ' +
    'expansion parameter e*D ~ 1.13 at the crossing is O(1), not small.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34189 measurement; adds no new ' +
    'derivation and changes no bound. Descriptive surrogate/fit, NOT a rigorous asymptotic; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; ' +
    'Platt-Trudgian Lambda<=0.2 remains SOTA.',
};

export const IMP34255_ASSERTIONS = [
  {
    id: 'imp-34255-window-ladder-diverges-as-w-narrows',
    description: 'the bisected kEnd*(w) ladder rises monotonically as w shrinks from 1 to 1/8 decades',
    holds: () => {
      const rows = IMP34255_WINDOW_LADDER_ROWS;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].wDecades < rows[i - 1].wDecades)) return false;
        if (!(rows[i].kEndStar > rows[i - 1].kEndStar)) return false;
      }
      return rows.length === 5;
    },
  },
  {
    id: 'imp-34255-leading-closed-form-below-w1-bisected',
    description: 'the leading closed form (21.00) sits below the w=1 bisected crossing (21.281) by ~0.28',
    holds: () =>
      IMP34255_KEND_LEADING_CLOSED_FORM < IMP34255_KEND_BISECTED_W1 &&
      IMP34255_LEADING_GAP > 0.2 &&
      IMP34255_LEADING_GAP < 0.35,
  },
  {
    id: 'imp-34255-expansion-parameter-is-order-one',
    description: 'e*D at the crossing exceeds 1 (~1.13), so the underlying Taylor-in-D series is not small',
    holds: () => IMP34255_ED_AT_CROSSING > 1 && IMP34255_ED_AT_CROSSING < 1.5,
  },
];

for (const a of IMP34255_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34255-m2-ceiling-window-width-divergence-viz-data assertion failed: ${a.id}`);
  }
}
