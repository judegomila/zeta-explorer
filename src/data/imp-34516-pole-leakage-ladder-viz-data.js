/**
 * @module imp-34516-pole-leakage-ladder-viz-data
 * @fileoverview imp-34516 -- VIZ DATA ONLY for the imp-34468 pole-leakage 1%/3%/8% degradation
 *   ladder, showing the three bisected crossings {18.106, 18.497, 19.034} rising and widening
 *   toward the imp-34023 pole k* ~ 21.28095.
 *
 *   imp-34468 bisected leak(k) = 100 |dy/dk(k) - P| / |P| (the imp-34247 pole-leakage metric on
 *   the imp-34188 widening-slope surrogate) at the 3% and 8% thresholds, completing the ladder
 *   above the imp-34413 1% crossing. The inter-threshold spacings widen (1%->3% ~0.391 decades,
 *   3%->8% ~0.538 decades) as the branch steepens toward the pole.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34468 module's
 *   ladder/spacing exports (direct re-statement, not re-derived here). This module does NOT
 *   import lambda-rh-height-mapping.js or the zeros bundle -- no fresh computation, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34468-pole-leakage-3-8-percent-crossings.js (source measurement)
 *   @see imp-34413-widening-slope-pole-leakage-one-percent-crossing.js (the 1% rung)
 *   @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation.js (the pole k* ~ 21.281)
 *   @see imp-34515-surplus-amplitude-relDef-convergence-viz-data.js (sibling viz-data precedent)
 *
 *   Ticket: imp-34516 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED.
 *   No refereed bound is changed.
 */

// -- the 1%/3%/8% degradation ladder, baked verbatim from imp-34468's LEAK_1_3_8_LADDER export --
export const IMP34516_LADDER = Object.freeze([
  Object.freeze({ threshold: 1, k: 18.10597 }),
  Object.freeze({ threshold: 3, k: 18.49677 }),
  Object.freeze({ threshold: 8, k: 19.0344 }),
]);

export const IMP34516_CONSTANTS = Object.freeze({
  poleLocation: 21.28095,
  plateau: -0.977,
  leakAtK19: 7.567, // leak(19) -- BELOW 8%, so the 8% crossing lands above k=19
  spacing1to3: 0.391,
  spacing3to8: 0.538,
  decadesBelowPole8pct: 2.247,
});

export default Object.freeze({
  id: 'imp-34516-pole-leakage-ladder-viz-data',
  ticket: 'imp-34516',
  source: 'imp-34468-pole-leakage-3-8-percent-crossings.js',
  ladder: IMP34516_LADDER,
  constants: IMP34516_CONSTANTS,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34516_ASSERTIONS = [
  {
    id: 'imp34516-three-rungs-strictly-increasing',
    holds: () => {
      const r = IMP34516_LADDER;
      if (r.length !== 3) return false;
      return r[0].k < r[1].k && r[1].k < r[2].k;
    },
    why: 'The 1%/3%/8% ladder must strictly increase (imp-34468 R3).',
  },
  {
    id: 'imp34516-rungs-below-pole',
    holds: () => IMP34516_LADDER.every((r) => r.k < IMP34516_CONSTANTS.poleLocation),
    why: 'All three crossings must sit below the imp-34023 pole k* ~ 21.28095.',
  },
  {
    id: 'imp34516-spacing-widens',
    holds: () => IMP34516_CONSTANTS.spacing3to8 > IMP34516_CONSTANTS.spacing1to3,
    why: 'The 3%->8% spacing must exceed the 1%->3% spacing (imp-34468 R3 widening).',
  },
  {
    id: 'imp34516-eight-percent-above-k19',
    holds: () => IMP34516_LADDER[2].k > 19.0 && IMP34516_CONSTANTS.leakAtK19 < 8.0,
    why: 'The 8% crossing must sit above k=19, consistent with leak(19) ~ 7.567% being below 8% (imp-34468 R2).',
  },
];

for (const assertion of IMP34516_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34516-pole-leakage-ladder-viz-data assertion failed: ${assertion.id}`);
  }
}
