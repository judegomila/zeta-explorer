/**
 * @module imp-33326-genuine-eigenvector-fifth-pair-realized-c-ladder-viz-data
 *
 * imp-33326 (ux): lightweight, import-light viz-data module for a chart of the imp-33289
 * genuine-eigenvector fifth-pair realized backward-error constant
 * c = worstPairSpread / (n * kappa_pair * u) across the dense rungs N in
 * {160, 200, 240, 280, 320, 360, 400}, against the c <= 1 Wilkinson worst-case envelope
 * and the imp-33272 surrogate-rotation range [0.088, 0.884]. Two rungs (N=320: 1.42,
 * N=360: 1.06) poke modestly above the c <= 1 envelope; every rung's identical S' solved
 * in double-double collapses the fifth-pair spread to exactly zero (genuine backward
 * error, not a real pair gap).
 *
 * Reference literals are baked from the imp-33289 measured ladder (self-computing at
 * import) -- no re-derivation here.
 *
 * @see imp-33289-genuine-eigenvector-fifth-pair-realized-c.js (source module: GENUINE_LADDER, verdict)
 * @see imp-33272-fifth-pair-extended-precision-crossval.js (the surrogate range this ladder is tested against)
 *
 * Ticket: imp-33326 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

export const IMP33326_LADDER = [
  { N: 160, sigma4: 0.831404141170, kappaPair: 1.202784482878, cRealized: 0.400781 },
  { N: 200, sigma4: 0.887500587224, kappaPair: 1.126759817848, cRealized: 0.133233 },
  { N: 240, sigma4: 0.919942030049, kappaPair: 1.087025016073, cRealized: 0.266070 },
  { N: 280, sigma4: 0.940248582612, kappaPair: 1.063548532264, cRealized: 0.265829 },
  { N: 320, sigma4: 0.953754052214, kappaPair: 1.048488336882, cRealized: 1.416915 },
  { N: 360, sigma4: 0.963171926789, kappaPair: 1.038236240267, cRealized: 1.062252 },
  { N: 400, sigma4: 0.969992409523, kappaPair: 1.030935902366, cRealized: 0.353980 },
];

export const IMP33326_WILKINSON_ENVELOPE = 1;

export const IMP33326_SURROGATE_RANGE = { min: 0.088, max: 0.884 };

export const IMP33326_ABOVE_ENVELOPE_NS = [320, 360];

export const IMP33326_ALL_DD_COLLAPSE_TO_ZERO = true;

export const IMP33326_C_MIN = 0.133233; // N=200
export const IMP33326_C_MAX = 1.416915; // N=320
export const IMP33326_C_MEAN = 0.557;
