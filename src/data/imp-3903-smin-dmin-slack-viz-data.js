/**
 * @module imp-3903-smin-dmin-slack-viz-data
 * @fileoverview imp-3903 -- lightweight, import-light literal data for a
 *   visualization of the imp-3870 smin/Dmin slack measurement: the per-plateau
 *   (Dmin/smin)^2 rigorous-elasticity-inflation ratio (1987x plateau 4 to
 *   35492x plateau 9) and the tightest-individual-gap offset from the record
 *   pair (-259521 .. +418135, never adjacent on any of the 10 imp-3725
 *   plateaus).
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3870-smin-dmin-slack-measurement.js ROWS (dminOverSminSq,
 *   sminOverDmin, distFromPair). This module does NOT import imp-3725 /
 *   imp-3854 (and transitively no zeros bundle), so importing it into a page
 *   costs nothing at load time.
 *
 *   @see imp-3870-smin-dmin-slack-measurement.js (source measurement + full rows)
 *   @see imp-3854-thetabar-insensitivity-derivation.js (the residual attribution this refutes)
 *
 *   Ticket: imp-3903 (ux, low). Presentation only; measurement-only finding,
 *   corrects an imp-3854 characterization, not its inequality; no new bound;
 *   NO QED.
 */

export const IMP3903_ROWS = Object.freeze([
  { plateauIndex: 0, dminOverSminSq: 2382.3152894148557, sminOverDmin: 0.02048803847342129, distFromPair: -1944 },
  { plateauIndex: 1, dminOverSminSq: 9202.987114123045, sminOverDmin: 0.01042402857046946, distFromPair: 21126 },
  { plateauIndex: 2, dminOverSminSq: 5341.723550583708, sminOverDmin: 0.013682305899605894, distFromPair: 20346 },
  { plateauIndex: 3, dminOverSminSq: 3596.9810770496747, sminOverDmin: 0.016673659312514966, distFromPair: -29442 },
  { plateauIndex: 4, dminOverSminSq: 1986.9996165584344, sminOverDmin: 0.02243371035583999, distFromPair: -8555 },
  { plateauIndex: 5, dminOverSminSq: 11216.101872362226, sminOverDmin: 0.00944232680135644, distFromPair: -5209 },
  { plateauIndex: 6, dminOverSminSq: 16534.028523497927, sminOverDmin: 0.0077769742098990685, distFromPair: 158771 },
  { plateauIndex: 7, dminOverSminSq: 7269.080587391622, sminOverDmin: 0.011728980336431284, distFromPair: -259521 },
  { plateauIndex: 8, dminOverSminSq: 3609.8329526343787, sminOverDmin: 0.016643951723940727, distFromPair: -60818 },
  { plateauIndex: 9, dminOverSminSq: 35492.473549763985, sminOverDmin: 0.005308011637063393, distFromPair: 418135 },
]);

export const IMP3903_MIN_DMIN_OVER_SMIN_SQ = 1986.9996165584344; // plateau 4
export const IMP3903_MAX_DMIN_OVER_SMIN_SQ = 35492.473549763985; // plateau 9
export const IMP3903_MIN_OFFSET = -259521; // plateau 7
export const IMP3903_MAX_OFFSET = 418135; // plateau 9
export const IMP3903_ANY_ADJACENT = IMP3903_ROWS.some((r) => Math.abs(r.distFromPair) === 1);
