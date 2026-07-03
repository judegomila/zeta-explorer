/**
 * @module imp-3635-flow-factor-band-viz-data
 * @fileoverview imp-3635 -- lightweight, import-light literal data for a
 *   visualization of the imp-3604 N_half/N_x ratio band under the rigorous
 *   Gronwall flow-factor bracket [1, 1.000474], across the imp-3443
 *   half-to-double E_trunc floor grid (f = 0.5 .. 2.0).
 *
 *   Visualizes the imp-3604 certificate: re-root-solving both the sigma=1/2
 *   half-decay crossing N_half and the E_coll=E_trunc crossover N_x under
 *   three flow factors -- Gronwall = 1 (large-N vanishing limit), the
 *   imp-3580 frozen node exp(2.37e-4) = 1.000237, and the imp-2644 C_G=2
 *   upper endpoint exp(4.74e-4) = 1.000474 -- shows the N_half/N_x ratio
 *   collapsing onto the SAME [0.99313, 0.99772] ~ 0.996 band at every floor,
 *   regardless of which flow factor is used. The band width per floor is
 *   at most ~3e-6, i.e. the frozen-Gronwall choice is not an artifact.
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3604-sigma-crossover-flow-factor-invariance.js GRID export. This
 *   module does NOT import that module, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3604-sigma-crossover-flow-factor-invariance.js (the source derivation)
 *   @see imp-3580-sigma-crossover-floor-invariance.js (frozen-Gronwall floor grid)
 *   @see imp-2644-eflow-gronwall-cg-discharge.js (A1 trap, C_G in [1,2])
 *
 *   Ticket: imp-3635 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Per-floor N_half/N_x ratios under the three flow factors (Gronwall = 1,
// frozen exp(2.37e-4), and exp(4.74e-4)), baked from the imp-3604 GRID.
export const IMP3635_FLOOR_GRID = Object.freeze([
  { factor: 0.5, ratios: [0.997717, 0.997717, 0.997716] },
  { factor: 0.75, ratios: [0.996836, 0.996836, 0.996835] },
  { factor: 1.0, ratios: [0.996020, 0.996019, 0.996018] },
  { factor: 1.5, ratios: [0.994515, 0.994514, 0.994512] },
  { factor: 2.0, ratios: [0.993129, 0.993127, 0.993126] },
]);

// The three flow factors swept across the rigorous Gronwall bracket.
export const IMP3635_FLOW_FACTORS = Object.freeze([
  { name: 'zero_limit_G1', gronwall: 1, label: 'Gronwall = 1', note: 'large-N vanishing limit' },
  { name: 'frozen_imp3580', gronwall: 1.000237, label: 'Gronwall = 1.000237', note: 'imp-3580 C_G=1 frozen node' },
  { name: 'cg2_upper', gronwall: 1.000474, label: 'Gronwall = 1.000474', note: 'imp-2644 C_G=2 upper endpoint' },
]);

export const IMP3635_BAND = Object.freeze({
  min: 0.993129,
  max: 0.997717,
  around: 0.996,
  maxRatioSwing: 3e-6, // largest per-floor spread across the flow-factor bracket
  frozenBaselineRatio: 0.996019, // f=1.0, frozen node -- reproduces imp-3580 exactly
  frozenBaselineNx: 3.280294e9,
});

export const IMP3635_VERDICT =
  'FLOW-FACTOR-BRACKET-COLLAPSES-ONTO-SAME-0.99313-0.99772-BAND-ARTIFACT-UNDER-3E-6';
