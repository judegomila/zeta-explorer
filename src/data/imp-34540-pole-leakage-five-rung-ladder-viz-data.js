/**
 * @module imp-34540-pole-leakage-five-rung-ladder-viz-data
 * @fileoverview imp-34540 -- VIZ DATA ONLY for the FULL five-rung imp-34512 pole-leakage
 *   degradation ladder {1%: 18.106, 3%: 18.497, 8%: 19.034, 15%: 19.443, 20%: 19.637}, extending
 *   the imp-34516 three-rung viz with the newer 15%/20% rungs and the per-percentage-point
 *   normalized spacing (0.1954 -> 0.1075 -> 0.0584 -> 0.0387 decades/pp).
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34512 module's
 *   LADDER / spacingPerPp exports (direct re-statement, not re-derived here). This module does
 *   NOT import lambda-rh-height-mapping.js or the zeros bundle -- no fresh computation, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34512-pole-leakage-fit-15-20-percent-crossings.js (source measurement)
 *   @see imp-34468-pole-leakage-3-8-percent-crossings.js (the earlier 1%/3%/8% ladder)
 *   @see imp-34516-pole-leakage-ladder-viz-data.js (the three-rung viz this extends)
 *   @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation.js (the pole k* ~ 21.281)
 *
 *   Ticket: imp-34540 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED.
 *   No refereed bound is changed.
 */

// -- the full 1%/3%/8%/15%/20% degradation ladder, baked verbatim from imp-34512's LADDER export --
export const IMP34540_LADDER = Object.freeze([
  Object.freeze({ threshold: 1, k: 18.10597 }),
  Object.freeze({ threshold: 3, k: 18.49677 }),
  Object.freeze({ threshold: 8, k: 19.0344 }),
  Object.freeze({ threshold: 15, k: 19.44328 }),
  Object.freeze({ threshold: 20, k: 19.63682 }),
]);

// -- per-rung decade spacing and per-percentage-point normalized spacing, baked from imp-34512 --
export const IMP34540_SPACINGS = Object.freeze([
  Object.freeze({ from: 1, to: 3, decades: 0.3908, perPp: 0.1954 }),
  Object.freeze({ from: 3, to: 8, decades: 0.5376, perPp: 0.1075 }),
  Object.freeze({ from: 8, to: 15, decades: 0.4089, perPp: 0.0584 }),
  Object.freeze({ from: 15, to: 20, decades: 0.1935, perPp: 0.0387 }),
]);

export const IMP34540_CONSTANTS = Object.freeze({
  poleLocation: 21.28095,
  plateau: -0.977,
  decadesBelowPole20pct: 1.644,
});

export default Object.freeze({
  id: 'imp-34540-pole-leakage-five-rung-ladder-viz-data',
  ticket: 'imp-34540',
  source: 'imp-34512-pole-leakage-fit-15-20-percent-crossings.js',
  ladder: IMP34540_LADDER,
  spacings: IMP34540_SPACINGS,
  constants: IMP34540_CONSTANTS,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34540_ASSERTIONS = [
  {
    id: 'imp34540-five-rungs-strictly-increasing',
    holds: () => {
      const r = IMP34540_LADDER;
      if (r.length !== 5) return false;
      for (let i = 1; i < r.length; i++) {
        if (!(r[i].k > r[i - 1].k)) return false;
      }
      return true;
    },
    why: 'The full {1,3,8,15,20}% ladder must strictly increase (imp-34512 R1).',
  },
  {
    id: 'imp34540-rungs-below-pole',
    holds: () => IMP34540_LADDER.every((r) => r.k < IMP34540_CONSTANTS.poleLocation),
    why: 'All five crossings must sit below the imp-34023 pole k* ~ 21.28095.',
  },
  {
    id: 'imp34540-per-pp-spacing-monotone-decreasing',
    holds: () => {
      const s = IMP34540_SPACINGS;
      for (let i = 1; i < s.length; i++) {
        if (!(s[i].perPp < s[i - 1].perPp)) return false;
      }
      return true;
    },
    why: 'The per-percentage-point spacing must fall monotonically toward the pole (imp-34512 R2).',
  },
  {
    id: 'imp34540-twenty-pct-below-pole-by-decades',
    holds: () =>
      Math.abs(
        IMP34540_CONSTANTS.poleLocation - IMP34540_LADDER[4].k - IMP34540_CONSTANTS.decadesBelowPole20pct,
      ) < 0.005,
    why: 'The 20% rung must sit ~1.644 decades below the pole (imp-34512 R1).',
  },
];

for (const assertion of IMP34540_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34540-pole-leakage-five-rung-ladder-viz-data assertion failed: ${assertion.id}`);
  }
}
