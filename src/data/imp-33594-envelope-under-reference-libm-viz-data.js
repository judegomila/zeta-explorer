/**
 * @module imp-33594-envelope-under-reference-libm-viz-data
 *
 * imp-33594 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33559 per-height reference-libm downward shift. Presents, for the imp-33312
 * heights tau in {7..10}, the fp64 band ceiling against the ~106-bit double-double
 * reference-precision ceiling: tau=7 10.648 -> 9.680, tau=8 10.779 -> 10.212 (the
 * binding height), tau=9 and tau=10 already sub-ULP resolved and unchanged.
 *
 * Reference literals are baked from imp-33559's PER_HEIGHT table (itself baked
 * from a ~51s offline dd run) -- no re-derivation of the underlying libm or
 * quadrature here.
 *
 * @see imp-33559-envelope-under-reference-libm.js (source module: the reference-libm measurement)
 * @see imp-33538 (the named ~10.78 ULP fp64 tau-uniform envelope this assesses)
 *
 * Ticket: imp-33594 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP33594_FP64_ENVELOPE_ULP = 10.7793;
export const IMP33594_REFERENCE_ENVELOPE_ULP = 10.2120;
export const IMP33594_BINDING_TAU = 8;

export const IMP33594_PER_HEIGHT = [
  { tau: 7, fp64CeilingUlp: 10.6477, ddCeilingUlp: 9.6798 },
  { tau: 8, fp64CeilingUlp: 10.7793, ddCeilingUlp: 10.2120 },
  { tau: 9, fp64CeilingUlp: 0.6650, ddCeilingUlp: 0.6650 },
  { tau: 10, fp64CeilingUlp: 0.0000, ddCeilingUlp: 0.0000 },
];

export const IMP33594_MAX_SHIFT_ULP = Math.max(
  ...IMP33594_PER_HEIGHT.map((r) => Math.abs(r.fp64CeilingUlp - r.ddCeilingUlp)),
);
