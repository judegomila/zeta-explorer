/**
 * @module imp-33572-tau-uniform-envelope-viz-data
 * @fileoverview imp-33572 -- lightweight, import-light literal data for a chart of the
 *   imp-33538 tau-uniform envelope constant: per-height band ceiling (maxUlp) vs the
 *   E ~= 10.78 ULP envelope (binding at tau=8), with each height's slack margin annotated.
 *
 *   Values below are baked reference literals reproduced from the imp-33538 module
 *   (src/data/imp-33538-tau-uniform-envelope-constant.js), which derives the envelope
 *   constant and per-rung margins from the imp-33312 measured band; this module does NOT
 *   re-run that derivation, so importing it into a page costs nothing at load time.
 *
 *   @see imp-33538-tau-uniform-envelope-constant.js (the source envelope-constant derivation)
 *   @see imp-33312-tau-uniform-jitter-band.js (the height-collapsing band the envelope covers)
 *
 *   Ticket: imp-33572 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 *   Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP33572_ENVELOPE_ULP = 10.779288696044262;
export const IMP33572_BINDING_HEIGHT = 8;

export const IMP33572_HEIGHT_SERIES = Object.freeze([
  { tau: 7, ceilingUlp: 10.64773262540905, marginUlp: 0.13155607063521124, marginFraction: 0.012204522426743162, isBinding: false },
  { tau: 8, ceilingUlp: 10.779288696044262, marginUlp: 0, marginFraction: 0, isBinding: true },
  { tau: 9, ceilingUlp: 0.6650258837361217, marginUlp: 10.114262812308139, marginFraction: 0.93830521637479, isBinding: false },
  { tau: 10, ceilingUlp: 0, marginUlp: 10.779288696044262, marginFraction: 1, isBinding: false },
]);
