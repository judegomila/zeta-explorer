/**
 * @module imp-33325-far-term-tighter-majorant-viz-data
 *
 * imp-33325 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33290 far-term tighter-majorant collapse. Presents, per imp-3725 running-min
 * plateau (10 plateaus spanning N in [1e4,1e6]), the certified over-charge ratio
 * R_maj alongside the tightened realised-gap-aware ratio R_tight (identically the
 * imp-33269 K_real), and the per-plateau max B_j = max_j P_j/D_j whose growth
 * (2.10 -> 6.45) is the relocated imp-33250 N-uniformity residual dg2.
 *
 * Reference literals are baked from a direct re-run of the imp-33290 assessment
 * module's ROWS (no re-derivation of the underlying majorant kernel here).
 *
 * @see imp-33290-far-term-tighter-majorant-assessment.js (source module: feasibility assessment)
 * @see imp-33269-all-plateaus-majorant-ratio-scan.js (source of R_maj / R_tight per plateau)
 * @see imp-33250-tail-weight-ratio-n-uniformity-assessment.js (residual dg2 the obstruction relocates to)
 *
 * Ticket: imp-33325 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP33325_KREAL_BAND = { min: 0.7982689435006131, max: 1.602253772651275 };
export const IMP33325_RMAJ_RANGE = { min: 1.813396, max: 11.079813 };
export const IMP33325_MAXBJ_RANGE = { min: 2.0959, max: 6.4537 };

export const IMP33325_PLATEAU_TABLE = [
  { plateauIndex: 0, endN: 18859, rMaj: 3.948907, rTight: 1.045382, maxBj: 2.0959 },
  { plateauIndex: 1, endN: 44555, rMaj: 2.341221, rTight: 0.798269, maxBj: 2.1965 },
  { plateauIndex: 2, endN: 73997, rMaj: 7.110917, rTight: 1.57712, maxBj: 2.7439 },
  { plateauIndex: 3, endN: 82552, rMaj: 9.896026, rTight: 1.419159, maxBj: 4.6691 },
  { plateauIndex: 4, endN: 87761, rMaj: 1.813396, rTight: 0.826615, maxBj: 2.7013 },
  { plateauIndex: 5, endN: 95248, rMaj: 11.079813, rTight: 1.432387, maxBj: 6.4537 },
  { plateauIndex: 6, endN: 354769, rMaj: 9.641983, rTight: 1.602254, maxBj: 3.7228 },
  { plateauIndex: 7, endN: 415587, rMaj: 2.762958, rTight: 0.853623, maxBj: 4.1845 },
  { plateauIndex: 8, endN: 420891, rMaj: 4.227794, rTight: 0.875761, maxBj: 4.0866 },
  { plateauIndex: 9, endN: 1000000, rMaj: 6.820032, rTight: 1.04377, maxBj: 4.9938 },
];
