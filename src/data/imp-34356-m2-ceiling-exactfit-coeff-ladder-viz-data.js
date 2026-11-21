/**
 * @module imp-34356-m2-ceiling-exactfit-coeff-ladder-viz-data
 * @fileoverview imp-34356 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34267 M2-ceiling
 *   exact-fit endpoint-curvature coefficient ladder c_eff(M).
 *
 *   imp-34267 decomposed the imp-34189 exact-fit e^3 D^2 coefficient (~+90/480,
 *   reproducing the bisected kEnd* = 21.281 exactly) through the isolated
 *   endpoint-curvature Taylor channel. Truncating sigma_hi at order M (all other
 *   channels kept exact) gives an effective single coefficient c_eff(M) that
 *   swings sign at M=0 (-185.7, wrong sign), overshoots at M=1/M=2 (+155.2,
 *   +59.8), then locks onto the exact-fit +89.94 by M=4 -- a factorially
 *   shrinking, alternating, CONVERGENT series (imp-34189's "does not converge"
 *   was too strong for this channel).
 *
 *   All numbers are baked reference literals copied from the imp-34267 module
 *   result -- this module does not import imp-34267 (or its
 *   lambda-rh-height-mapping / polymath15-constant-C-C dependency chain) so
 *   pages consuming it stay import-light.
 *
 *   @see imp-34267-m2-ceiling-exactfit-coeff-endpoint-decomposition.js (source measurement)
 *   @see imp-34189-m2-ceiling-next-order-window-width-correction.js (named the +90 exact-fit coeff)
 *   @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (leading closed form coeff +17)
 *
 *   Ticket: imp-34356 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// c_eff(M): the endpoint-order ladder -- swings sign at M=0, overshoots, then locks by M=4.
export const IMP34356_COEFF_LADDER = Object.freeze([
  { order: 0, kEndStar: 18.8908, cEff: -185.729 },
  { order: 1, kEndStar: 21.5285, cEff: 155.162 },
  { order: 2, kEndStar: 21.2243, cEff: 59.753 },
  { order: 3, kEndStar: 21.2889, cEff: 90.017 },
  { order: 4, kEndStar: 21.28, cEff: 89.94 },
  { order: 5, kEndStar: 21.281, cEff: 89.94 },
]);

// Per-order contributions to c_eff BEYOND the M=1 linear endpoint value -- alternating, shrinking.
export const IMP34356_CONTRIB_BEYOND_LINEAR = Object.freeze([
  { order: 2, delta: -95.409 },
  { order: 3, delta: 30.264 },
  { order: 4, delta: -0.077 },
  { order: 5, delta: 0 },
]);

// Endpoint Taylor-term ratios term_{m+1}/term_m -- factorial-suppressed, |ratio| < 1 throughout.
export const IMP34356_ENDPOINT_TERM_RATIOS = Object.freeze([
  { m: 2, ratio: -0.2817 },
  { m: 3, ratio: -0.1877 },
  { m: 4, ratio: -0.1406 },
  { m: 5, ratio: -0.1119 },
]);

export const IMP34356_KEND_EXACT = 21.2809;
export const IMP34356_EXACT_FIT_COEFF = 89.94;
export const IMP34356_E_AT_CROSSING = 0.4901;
export const IMP34356_ED_AT_CROSSING = 1.1284;

export const IMP34356_M2_CEILING_EXACTFIT_COEFF_LADDER_VIZ_DATA = {
  ticket: 'imp-34356',
  coeffLadder: IMP34356_COEFF_LADDER,
  contribBeyondLinear: IMP34356_CONTRIB_BEYOND_LINEAR,
  endpointTermRatios: IMP34356_ENDPOINT_TERM_RATIOS,
  kEndExact: IMP34356_KEND_EXACT,
  exactFitCoeff: IMP34356_EXACT_FIT_COEFF,
  eAtCrossing: IMP34356_E_AT_CROSSING,
  eDAtCrossing: IMP34356_ED_AT_CROSSING,
  note:
    'The endpoint-order ladder c_eff(M) swings sign at M=0 (-185.7, wrong sign vs the positive ' +
    'exact-fit), overshoots at M=1 (+155.2) and M=2 (+59.8), reaches the exact-fit +90.0 already ' +
    'at cubic order M=3, and locks at +89.94 by M=4. The per-order contributions beyond the ' +
    'linear endpoint term (-95.4, +30.3, -0.08, 0) alternate in sign and shrink, matching the ' +
    'exact endpoint Taylor-term ratio -(eD/2)/(m+1) (-0.282, -0.188, -0.141, -0.112): a ' +
    'factorial-dominated, convergent series.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34267 measurement; adds no new ' +
    'derivation and changes no bound. Descriptive surrogate/fit, NOT a rigorous asymptotic; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; ' +
    'no refereed bound is changed.',
};

export const IMP34356_ASSERTIONS = [
  {
    id: 'imp-34356-ladder-locks-onto-exact-fit-by-m4',
    description: 'c_eff(4) and c_eff(5) both sit within 0.5 of the exact-fit coefficient (89.94)',
    holds: () => {
      const c4 = IMP34356_COEFF_LADDER[4].cEff;
      const c5 = IMP34356_COEFF_LADDER[5].cEff;
      return Math.abs(c4 - IMP34356_EXACT_FIT_COEFF) < 0.5 && Math.abs(c5 - IMP34356_EXACT_FIT_COEFF) < 0.5;
    },
  },
  {
    id: 'imp-34356-m0-has-wrong-sign',
    description: 'c_eff(0) is negative while the exact-fit coefficient is positive (the eD=O(1) fingerprint)',
    holds: () => IMP34356_COEFF_LADDER[0].cEff < 0 && IMP34356_EXACT_FIT_COEFF > 0,
  },
  {
    id: 'imp-34356-term-ratios-all-below-one',
    description: 'all endpoint Taylor-term ratios have |ratio| < 1 (factorial-suppressed, convergent)',
    holds: () => IMP34356_ENDPOINT_TERM_RATIOS.every((r) => Math.abs(r.ratio) < 1),
  },
];

for (const a of IMP34356_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34356-m2-ceiling-exactfit-coeff-ladder-viz-data assertion failed: ${a.id}`);
  }
}
