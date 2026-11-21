/**
 * @module imp-34594-eflow-attr-far-side-smoothness-ladder-viz-data
 * @fileoverview imp-34594 -- VIZ DATA ONLY for the imp-34572 far-side eflow_attr smoothness
 *   ladder (k = 21.30 .. 21.60, all above the eflow_over_resid pole k* ~ 21.28095). Presents
 *   the seven-rung table (three overlap rungs reproducing imp-34406 exactly, four new far-side
 *   rungs) together with the four interior/endpoint local per-k log-slopes, showing eflow_attr
 *   stays strictly positive, strictly monotone-decreasing and smoothly log-sloped all the way
 *   through the pole from the far side.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34572 module's
 *   IMP34572_FAR_SIDE_RUNGS / IMP34572_LOCAL_SLOPES exports (direct re-statement, not
 *   re-derived here). This module does NOT import lambda-rh-height-mapping.js or the zeros
 *   bundle -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (source measurement)
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (near-side bracket this continues)
 *   @see imp-34540-pole-leakage-five-rung-ladder-viz-data.js (viz-data pattern followed here)
 *
 *   Ticket: imp-34594 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED.
 *   No refereed bound is changed.
 */

// -- the full seven-rung far-side ladder, baked verbatim from imp-34572's IMP34572_FAR_SIDE_RUNGS --
export const IMP34594_RUNGS = Object.freeze([
  Object.freeze({ k: 21.3, eflowAttr: 4.33758269e-15, source: 'imp-34406' }),
  Object.freeze({ k: 21.35, eflowAttr: 3.89369900e-15, source: 'imp-34572' }),
  Object.freeze({ k: 21.4, eflowAttr: 3.49518130e-15, source: 'imp-34406' }),
  Object.freeze({ k: 21.45, eflowAttr: 3.13739933e-15, source: 'imp-34572' }),
  Object.freeze({ k: 21.5, eflowAttr: 2.81619473e-15, source: 'imp-34406' }),
  Object.freeze({ k: 21.55, eflowAttr: 2.52783306e-15, source: 'imp-34572' }),
  Object.freeze({ k: 21.6, eflowAttr: 2.26896059e-15, source: 'imp-34572' }),
]);

// -- local per-k log-slopes at the interior/endpoint rungs, baked verbatim from imp-34572 --
export const IMP34594_LOCAL_SLOPES = Object.freeze([
  Object.freeze({ k: 21.35, slopePerK: -2.15932 }),
  Object.freeze({ k: 21.45, slopePerK: -2.15999 }),
  Object.freeze({ k: 21.55, slopePerK: -2.16065 }),
  Object.freeze({ k: 21.6, slopePerK: -2.160976 }),
]);

export const IMP34594_CONSTANTS = Object.freeze({
  kStar: 21.28095,
  minEflowAttr: 2.26896059e-15,
  slopeDrift: -0.001656,
  secondDifference: 1.317524e-14,
});

export default Object.freeze({
  id: 'imp-34594-eflow-attr-far-side-smoothness-ladder-viz-data',
  ticket: 'imp-34594',
  source: 'imp-34572-eflow-attr-far-side-pole-smoothness.js',
  rungs: IMP34594_RUNGS,
  localSlopes: IMP34594_LOCAL_SLOPES,
  constants: IMP34594_CONSTANTS,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34594_ASSERTIONS = [
  {
    id: 'imp34594-seven-rungs-strictly-decreasing',
    holds: () => {
      const r = IMP34594_RUNGS;
      if (r.length !== 7) return false;
      for (let i = 1; i < r.length; i++) {
        if (!(r[i].eflowAttr < r[i - 1].eflowAttr)) return false;
      }
      return true;
    },
    why: 'eflow_attr must fall strictly monotonically across the seven far-side rungs (imp-34572 F1).',
  },
  {
    id: 'imp34594-rungs-above-kstar-and-positive',
    holds: () =>
      IMP34594_RUNGS.every((r) => r.k > IMP34594_CONSTANTS.kStar && r.eflowAttr > 0) &&
      Math.abs(IMP34594_RUNGS[IMP34594_RUNGS.length - 1].eflowAttr - IMP34594_CONSTANTS.minEflowAttr) < 1e-22,
    why: 'All seven far-side rungs sit above k* and remain strictly positive (imp-34572 F1).',
  },
  {
    id: 'imp34594-local-slopes-tight-and-drifting-small',
    holds: () =>
      IMP34594_LOCAL_SLOPES.every((s) => s.slopePerK < -2.15 && s.slopePerK > -2.17) &&
      Math.abs(
        IMP34594_LOCAL_SLOPES[IMP34594_LOCAL_SLOPES.length - 1].slopePerK -
          IMP34594_LOCAL_SLOPES[0].slopePerK -
          IMP34594_CONSTANTS.slopeDrift,
      ) < 1e-4,
    why: 'The local per-k log-slope must stay near -2.16 and drift by only ~0.0017 across the far side (imp-34572 F2).',
  },
];

for (const assertion of IMP34594_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34594-eflow-attr-far-side-smoothness-ladder-viz-data assertion failed: ${assertion.id}`);
  }
}
