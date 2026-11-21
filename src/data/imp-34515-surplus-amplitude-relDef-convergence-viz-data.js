/**
 * @module imp-34515-surplus-amplitude-relDef-convergence-viz-data
 * @fileoverview imp-34515 -- VIZ DATA ONLY for the imp-34473 surplus-amplitude A_r convergence,
 *   showing relDef*logT0 rising toward the closed constant 2*log(2pi) = 3.675754.
 *
 *   imp-34473 assembled the leading surplus amplitude A_r = 5.264698e-6 in closed form and
 *   found the measured asymptote M(thr) = surplus/((log T0)^2 thr^3) approaches it from below.
 *   Writing the relative deficit relDef = 1 - M/A_r, the product relDef*logT0 rises
 *   monotonically toward the closed constant 2*log(2pi) = 3.675754, and imp-34507 identified
 *   the flat next-order gap as log(2pi)^2 - 1 = 2.377792.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34473 module's
 *   CONVERGENCE grid and DEEP deep-tail probe (direct re-statement, not re-derived here). This
 *   module does NOT import lambda-rh-height-mapping.js or the zeros bundle -- no fresh
 *   computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34473-surplus-amplitude-Ar-closed-form-assembly.js (source measurement)
 *   @see imp-34507-surplus-nextorder-constant-identification.js (next-order constant)
 *   @see imp-34514-coupling-ratio-1overlogT0-fit-viz-data.js (sibling viz-data precedent)
 *
 *   Ticket: imp-34515 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited imp-34329/imp-34248/imp-34174/
 *   imp-33743 extrapolation, NOT rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 *   K_a>=0 untouched; NO QED. No refereed bound is changed.
 */

// -- convergence grid: log T0, measured asymptote M, residual A_r-M, relative deficit, and
//    the rise-rate product relDef*logT0 -- baked verbatim from imp-34473's CONVERGENCE export --
export const IMP34515_CONVERGENCE = Object.freeze([
  Object.freeze({ thr: 1e-2, logT0: 30.001, measured: 4.6804e-6, residual: 5.8433e-7, relDeficitPct: 11.099, relDef_x_logT0: 3.3298 }),
  Object.freeze({ thr: 1e-3, logT0: 34.61, measured: 4.7207e-6, residual: 5.4396e-7, relDeficitPct: 10.3322, relDef_x_logT0: 3.576 }),
  Object.freeze({ thr: 1e-4, logT0: 39.207, measured: 4.7797e-6, residual: 4.8496e-7, relDeficitPct: 9.2115, relDef_x_logT0: 3.6115 }),
  Object.freeze({ thr: 1e-6, logT0: 48.403, measured: 4.8702e-6, residual: 3.9446e-7, relDeficitPct: 7.4925, relDef_x_logT0: 3.6266 }),
  Object.freeze({ thr: 1e-8, logT0: 57.603, measured: 4.9325e-6, residual: 3.3218e-7, relDeficitPct: 6.3095, relDef_x_logT0: 3.6345 }),
  Object.freeze({ thr: 1e-10, logT0: 66.806, measured: 4.9778e-6, residual: 2.8686e-7, relDeficitPct: 5.4488, relDef_x_logT0: 3.6402 }),
  Object.freeze({ thr: 1e-12, logT0: 76.011, measured: 5.0123e-6, residual: 2.5242e-7, relDeficitPct: 4.7946, relDef_x_logT0: 3.6445 }),
]);

// -- deep-tail rate probe (thr = 1e-80, log T0 ~ 389): relDef.logT0 -> 3.6696, next-order gap
//    ~ 2.38, both baked verbatim from imp-34473's DEEP export --
export const IMP34515_DEEP_TAIL = Object.freeze({
  logT0: 389.13,
  relDef_x_logT0: 3.66964,
  nextOrder_gap_x_logT0: 2.378,
});

export const IMP34515_CONSTANTS = Object.freeze({
  A_r: 5.264698e-6,
  two_log_two_pi: 3.675754,
  log_two_pi_sq_minus_1: 2.377792,
});

export default Object.freeze({
  id: 'imp-34515-surplus-amplitude-relDef-convergence-viz-data',
  ticket: 'imp-34515',
  source: 'imp-34473-surplus-amplitude-Ar-closed-form-assembly.js',
  convergence: IMP34515_CONVERGENCE,
  deepTail: IMP34515_DEEP_TAIL,
  constants: IMP34515_CONSTANTS,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34515_ASSERTIONS = [
  {
    id: 'imp34515-seven-landmarks-increasing-logT0',
    holds: () => {
      const r = IMP34515_CONVERGENCE;
      if (r.length !== 7) return false;
      for (let i = 1; i < r.length; i++) {
        if (!(r[i].logT0 > r[i - 1].logT0)) return false;
      }
      return true;
    },
    why: 'The seven thr landmarks (1e-2 down to 1e-12) must map to strictly increasing log T0 values.',
  },
  {
    id: 'imp34515-measured-rises-toward-Ar',
    holds: () => {
      const r = IMP34515_CONVERGENCE;
      const A_r = IMP34515_CONSTANTS.A_r;
      for (let i = 1; i < r.length; i++) {
        if (!(r[i].measured > r[i - 1].measured)) return false;
        if (!(r[i].measured < A_r)) return false;
      }
      return true;
    },
    why: 'The measured asymptote M must rise monotonically and stay strictly below A_r (imp-34473 F3).',
  },
  {
    id: 'imp34515-relDef-x-logT0-rises-toward-2log2pi',
    holds: () => {
      const r = IMP34515_CONVERGENCE;
      const target = IMP34515_CONSTANTS.two_log_two_pi;
      for (let i = 1; i < r.length; i++) {
        if (!(r[i].relDef_x_logT0 < target)) return false;
      }
      return (
        IMP34515_DEEP_TAIL.relDef_x_logT0 > r[r.length - 1].relDef_x_logT0 &&
        IMP34515_DEEP_TAIL.relDef_x_logT0 < target &&
        target - IMP34515_DEEP_TAIL.relDef_x_logT0 < 0.01
      );
    },
    why: 'relDef*logT0 must stay below 2*log(2pi)=3.675754 and rise toward it, reaching 3.6696 at the deep-tail probe (imp-34473 F4).',
  },
  {
    id: 'imp34515-next-order-gap-matches-log2pi-sq-minus-1',
    holds: () =>
      Math.abs(IMP34515_DEEP_TAIL.nextOrder_gap_x_logT0 - IMP34515_CONSTANTS.log_two_pi_sq_minus_1) < 0.01,
    why: 'The flat next-order gap must match log(2pi)^2 - 1 = 2.377792 (imp-34507).',
  },
];

for (const assertion of IMP34515_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34515-surplus-amplitude-relDef-convergence-viz-data assertion failed: ${assertion.id}`);
  }
}
