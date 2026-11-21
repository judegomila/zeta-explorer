/**
 * @module imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data
 * @fileoverview imp-35483 -- VIZ DATA ONLY for the imp-35413 E_flow far-tail fd-vs-analytic
 *   remnant sub-1e-3 crossing ladder: the remnant |analytic - fd-surrogate| first drops below
 *   1e-3 at N ~ 4.17e25 (log10 N ~ 25.6205), on the closed surrogate height map
 *   T0 = 2 pi N / log N.
 *
 *   imp-35413 bisected the crossing and tabulated a five-rung ladder (N = 1e24, 1e25, the
 *   crossing, 1e26, 1e28) but shipped no chart, so the crossing is not visually legible
 *   anywhere on the site.
 *
 *   Values below are baked reference literals, reproduced verbatim from the imp-35413 bisection
 *   on the imp-3220/imp-3406 closed surrogate channel. This module does NOT import imp-35413 or
 *   any heavier module (no fresh computation), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35413-eflow-fartail-remnant-sub1e3-crossing.js (the bisected crossing this bakes)
 *   @see imp-35371-eflow-fartail-remnant-deep-extension.js (the deep ladder this continues, endpoint 1e24)
 *   @see imp-35431-eflow-fartail-remnant-decay-law-fit.js (decay-rate law fit bracketing this crossing)
 *
 *   Ticket: imp-35483 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Discharges nothing: this module's own surrogate-vs-true fidelity
 *   gap remains an UNNAMED tracked sub-gap per the imp-35413 scope note; imp-35337a stays OPEN
 *   and does not cover this quantity. E_flow > 0 strictness (imp-33848) UNTOUCHED; C_mb
 *   GUE-conditional per imp-486 UNTOUCHED. NO QED. No refereed bound is changed.
 */

// -- the imp-35413 five-rung ladder, baked verbatim (log10N, remnant, above/below 1e-3) --
export const IMP35483_LADDER_POINTS = Object.freeze([
  Object.freeze({ log10N: 24, N: 1e24, remnant: 0.001097, aboveThreshold: true, isCrossing: false }),
  Object.freeze({ log10N: 25, N: 1e25, remnant: 0.001036, aboveThreshold: true, isCrossing: false }),
  Object.freeze({ log10N: 25.6205, N: 4.173614e25, remnant: 0.001, aboveThreshold: false, isCrossing: true }),
  Object.freeze({ log10N: 26, N: 1e26, remnant: 0.000979, aboveThreshold: false, isCrossing: false }),
  Object.freeze({ log10N: 28, N: 1e28, remnant: 0.00088, aboveThreshold: false, isCrossing: false }),
]);

export const IMP35483_CROSSING = Object.freeze({
  log10N: 25.6205,
  N: 4.173614e25,
  remnant: 0.001,
  remnantTimesLogN: 0.058993,
});

export const IMP35483_THRESHOLD = 1e-3;

export const IMP35483_SUMMARY = Object.freeze({
  pointCount: IMP35483_LADDER_POINTS.length,
  minRemnant: Math.min(...IMP35483_LADDER_POINTS.map((p) => p.remnant)),
  maxRemnant: Math.max(...IMP35483_LADDER_POINTS.map((p) => p.remnant)),
});

export default Object.freeze({
  id: 'imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data',
  ticket: 'imp-35483',
  sources: ['imp-35413-eflow-fartail-remnant-sub1e3-crossing.js'],
  points: IMP35483_LADDER_POINTS,
  crossing: IMP35483_CROSSING,
  threshold: IMP35483_THRESHOLD,
  summary: IMP35483_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35483_ASSERTIONS = [
  {
    id: 'imp35483-five-points-present',
    holds: () => IMP35483_LADDER_POINTS.length === 5,
    why: 'The ladder this bakes spans exactly the five imp-35413 rungs (1e24, 1e25, crossing, 1e26, 1e28).',
  },
  {
    id: 'imp35483-ladder-monotone-decreasing',
    holds: () =>
      IMP35483_LADDER_POINTS.every(
        (p, i) => i === 0 || p.remnant <= IMP35483_LADDER_POINTS[i - 1].remnant,
      ),
    why: 'The imp-35413 remnant is monotone decreasing past the 1e9 peak, so every baked rung must not exceed the previous one.',
  },
  {
    id: 'imp35483-bracket-straddles-threshold',
    holds: () => {
      const at1e25 = IMP35483_LADDER_POINTS.find((p) => p.log10N === 25);
      const at1e26 = IMP35483_LADDER_POINTS.find((p) => p.log10N === 26);
      return at1e25.remnant > IMP35483_THRESHOLD && at1e26.remnant < IMP35483_THRESHOLD;
    },
    why: 'The N=1e25 rung must sit above 1e-3 and the N=1e26 rung below it, bracketing the crossing exactly as imp-35413 bisected it.',
  },
  {
    id: 'imp35483-crossing-matches-imp35413',
    holds: () =>
      Math.abs(IMP35483_CROSSING.log10N - 25.6205) < 1e-3 &&
      Math.abs(IMP35483_CROSSING.remnant - 1e-3) < 1e-9,
    why: 'The baked crossing must reproduce the imp-35413 headline log10 N ~ 25.6205 at remnant = 1e-3 exactly.',
  },
  {
    id: 'imp35483-crossing-product-matches-imp35413',
    holds: () => Math.abs(IMP35483_CROSSING.remnantTimesLogN - 0.058993) < 1e-5,
    why: 'The baked remnant*logN at the crossing must reproduce the imp-35413 reported ~0.05899 value.',
  },
];

for (const assertion of IMP35483_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35483-eflow-fartail-remnant-sub1e3-crossing-viz-data assertion failed: ${assertion.id}`);
  }
}
