/**
 * @module imp-3900-h2-flux-convexity-viz-data
 * @fileoverview imp-3900 -- lightweight, import-light literal data for a
 *   visualization of the imp-3872 H2 discrete-flux convexity probe: the
 *   effective inviscid flux-gradient coefficient kappa = (m_s - m_zz)/(m m_z)
 *   measured as the single-signed constant 2.000000000 at every one of 325
 *   sampled (height, time, z) points along the imp-3642 attractive-CM RK4
 *   collision flow, and the finite-N viscosity fraction |m_zz|/|2 m m_z|
 *   shrinking ~518x (0.2266 -> 0.02433 -> 4.372e-4) as the coarse-graining
 *   scale y_star/d goes 2 -> 8.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3872-g6a-h2-discrete-flux-convexity-probe.js (ROWS.viscFracMean per
 *   anchor-to-crossover height, and SCALE_SWEEP.viscFracMean per y_star/d).
 *   This module does NOT import the Odlyzko zeros bundle or re-run the RK4
 *   probe, so importing it into a page costs nothing at load time.
 *
 *   @see imp-3872-g6a-h2-discrete-flux-convexity-probe.js (source probe + full rows)
 *   @see imp-3846-g6a-k4-caustic-regularity-toolkit-assessment (H2 dependency-chain root this probes)
 *
 *   Ticket: imp-3900 (ux, low). Presentation only, empirical PROBE not a
 *   certificate; H2 stays UNWRITTEN; G6a_shock_lipschitz OPEN; imp-3066
 *   untouched; NO QED.
 */

export const IMP3900_ROWS = Object.freeze([
  { logGamma: 9.1981, yStar: 3.4147, kappaMin: 2.0, kappaMean: 2.0, kappaMax: 2.0, viscFracMean: 0.03331 },
  { logGamma: 12, yStar: 2.4732, kappaMin: 2.0, kappaMean: 2.0, kappaMax: 2.0, viscFracMean: 0.03394 },
  { logGamma: 15, yStar: 1.9095, kappaMin: 2.0, kappaMean: 2.0, kappaMax: 2.0, viscFracMean: 0.06094 },
  { logGamma: 18, yStar: 1.555, kappaMin: 2.0, kappaMean: 2.0, kappaMax: 2.0, viscFracMean: 0.05278 },
  { logGamma: 20.8576, yStar: 1.3214, kappaMin: 2.0, kappaMean: 2.0, kappaMax: 2.0, viscFracMean: 0.07237 },
]);

export const IMP3900_SCALE_SWEEP = Object.freeze([
  { yOverD: 2, viscFracMean: 0.2266 },
  { yOverD: 4, viscFracMean: 0.02433 },
  { yOverD: 8, viscFracMean: 0.0004372 },
]);

export const IMP3900_TOTAL_SAMPLES = 325;
export const IMP3900_IDENTITY_MAX_RESID = 8.69e-14;
export const IMP3900_KAPPA_CONSTANT = 2;
export const IMP3900_EFFECTIVE_FLUX_SECOND_DERIVATIVE = -2;
export const IMP3900_VISC_SHRINK_FACTOR = 0.2266 / 0.0004372; // ~518.3x, y_star/d: 2 -> 8
