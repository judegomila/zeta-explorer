/**
 * @module imp-3906-dpsi-sensitivity-viz-data
 * @fileoverview imp-3906 -- lightweight, import-light literal data for a
 *   visualization of the imp-3874 LEMMA-3854 sensitivity verification: the
 *   realised log-sensitivity (dPsi_N/dT)/Psi_N (~8-17) against the rigorous
 *   (8/smin^2) ceiling (~1.8e4-5.9e5) on the 3 verified [1e4,1e6] plateaus
 *   (0, 4, 9), and the resulting ceiling/actual slack factor (~2279x-34007x).
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3874-dpsi-sensitivity-verification.js ROWS (logSensBase,
 *   rigorousCeilBase, dpsiOverBoundBase/Top). This module does NOT import
 *   imp-3725 / imp-3854 (and transitively no zeros bundle), so importing it
 *   into a page costs nothing at load time.
 *
 *   @see imp-3874-dpsi-sensitivity-verification.js (source measurement + full rows)
 *   @see imp-3854-thetabar-insensitivity-derivation.js (the lemma verified)
 *   @see imp-3870-smin-dmin-slack-measurement.js (the ceiling-looseness picture)
 *
 *   Ticket: imp-3906 (ux, low). Presentation only; verification-only finding,
 *   confirms an existing lemma, does not tighten it; no new bound; NO QED.
 */

export const IMP3906_ROWS = Object.freeze([
  {
    plateauIndex: 0,
    logSensBase: 8.06298359,
    rigorousCeilBase: 18374.6873,
    dpsiOverBoundBase: 4.38809295e-4,
    dpsiOverBoundTop: 4.5072284e-4,
    slack: 18374.6873 / 8.06298359,
  },
  {
    plateauIndex: 4,
    logSensBase: 14.5601443,
    rigorousCeilBase: 34999.3348,
    dpsiOverBoundBase: 4.16012029e-4,
    dpsiOverBoundTop: 4.23079164e-4,
    slack: 34999.3348 / 14.5601443,
  },
  {
    plateauIndex: 9,
    logSensBase: 17.4486876,
    rigorousCeilBase: 593328.037,
    dpsiOverBoundBase: 2.9408163e-5,
    dpsiOverBoundTop: 3.01174404e-5,
    slack: 593328.037 / 17.4486876,
  },
]);

export const IMP3906_MIN_SLACK = Math.min(...IMP3906_ROWS.map((r) => r.slack)); // plateau 0
export const IMP3906_MAX_SLACK = Math.max(...IMP3906_ROWS.map((r) => r.slack)); // plateau 9
export const IMP3906_MIN_LOG_SENS = Math.min(...IMP3906_ROWS.map((r) => r.logSensBase));
export const IMP3906_MAX_LOG_SENS = Math.max(...IMP3906_ROWS.map((r) => r.logSensBase));
export const IMP3906_MIN_CEIL = Math.min(...IMP3906_ROWS.map((r) => r.rigorousCeilBase));
export const IMP3906_MAX_CEIL = Math.max(...IMP3906_ROWS.map((r) => r.rigorousCeilBase));
