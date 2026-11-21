/**
 * @module imp-3374-overflow-degree-viz-data
 *
 * imp-3374 (ux): lightweight, import-light viz-data module for a chart of the imp-3253
 * section-26 overflow-support fraction vs completion degree: degree-2 (absolute occupation
 * measure) overflow ~0.209 of tau, rising to degree-0 (scale-invariant normalized-spectral,
 * RH-equivalent) overflow ~0.64 of tau, with the geometric bare-crossover proxy ~0.7062
 * marked as the upper reference the degree-0 spectral value sits below.
 *
 * Only TWO completion degrees (2 and 0) were actually reconciled by imp-3253 -- there is no
 * computed intermediate-degree data point. The monotone connector drawn between them is a
 * SCHEMATIC illustration of the direction imp-3253 establishes (lowering completion degree
 * raises the overflow fraction), not a measured curve.
 *
 * The bare-crossover geometry (tau_star, bareCrossoverFraction) is recomputed here directly
 * from the same closed form as imp-3253 (arcsinh(1)/a at the genuine-Phi cell a=0.5, U=6) so
 * this module self-verifies rather than baking an opaque literal.
 *
 * @see imp-3253-overflow-degree-reconcile.js (source module: degreeMap, measured, verdict)
 *
 * Ticket: imp-3374 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 * no refereed bound is changed; NO QED.
 */

const A = 0.5;
const U = 6;

const TAU_STAR = Math.asinh(1) / A;
const BARE_CROSSOVER_FRACTION = (U - TAU_STAR) / U;

export const IMP3374_DEG2_OVERFLOW = 0.2092;
export const IMP3374_DEG0_SPECTRAL_OVERFLOW = 0.64;
export const IMP3374_BARE_CROSSOVER_FRACTION = BARE_CROSSOVER_FRACTION;
export const IMP3374_TAU_STAR = TAU_STAR;

export const IMP3374_DEGREE_POINTS = [
  {
    degree: 2,
    fraction: IMP3374_DEG2_OVERFLOW,
    label: 'degree-2 (absolute occupation)',
    measured: true,
  },
  {
    degree: 0,
    fraction: IMP3374_DEG0_SPECTRAL_OVERFLOW,
    label: 'degree-0 (scale-invariant spectral, RH-equivalent)',
    measured: true,
  },
];

export const IMP3374_GEOMETRIC_REFERENCE = {
  fraction: BARE_CROSSOVER_FRACTION,
  label: 'geometric bare-crossover proxy (U - tau_star)/U',
};

// -- Tripwire assertions ------------------------------------------------------
const ASSERTIONS = [
  {
    id: 'imp3374-bare-crossover-matches-imp3253',
    why: 'The recomputed geometric bare-crossover fraction must reproduce the imp-3253 ~0.7062 ' +
         'value; a drift means the arcsinh(1)/a closed form or the (A,U) cell values changed.',
    holds: () => Math.abs(BARE_CROSSOVER_FRACTION - 0.7062) < 1e-3,
  },
  {
    id: 'imp3374-degree-monotone-rise',
    why: 'THE DELIVERABLE: overflow fraction must rise monotonically from degree-2 (0.209) to ' +
         'degree-0 (0.64) to the geometric bare-crossover proxy (0.706); a flip mis-states the ' +
         'degree-dependence direction imp-3253 establishes.',
    holds: () =>
      IMP3374_DEG2_OVERFLOW < IMP3374_DEG0_SPECTRAL_OVERFLOW &&
      IMP3374_DEG0_SPECTRAL_OVERFLOW < BARE_CROSSOVER_FRACTION,
  },
  {
    id: 'imp3374-only-two-degrees-measured',
    why: 'Honesty tripwire: only degree 2 and degree 0 are measured points; the chart must not ' +
         'silently imply a computed intermediate-degree curve.',
    holds: () => IMP3374_DEGREE_POINTS.length === 2 && IMP3374_DEGREE_POINTS.every((p) => p.measured === true),
  },
];

for (const assertion of ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3374-overflow-degree-viz-data assertion failed: ${assertion.id}`);
  }
}
