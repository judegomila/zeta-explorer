/**
 * @module imp-33264-fifth-pair-spread-ladder-n2800-extended-viz-data
 *
 * imp-33264 (ux): lightweight, import-light viz-data module for a chart of the imp-33231
 * fifth-pair Gram degeneracy spread ladder EXTENDED through N=2800: worstPairSpread(N)
 * across N in {1200, 1600, 1800, 2000, 2200, 2400, 2800} = 0, 0, 1.97e-16, 1.38e-15,
 * 1.96e-15, 1.96e-15, 1.96e-16 (in ULP: 0, 0, 0.885, 6.195, 8.848, 8.846, 0.884), with the
 * N=2800 rung DIPPING an order of magnitude back down to the N=1800 level, plus the four
 * successive local power-law exponents (18.47, 3.74, -0.002, -14.94) that rule out any
 * coherent growth law spread ~ N^p.
 *
 * Reference literals are baked from the imp-33231 measured table (self-computing at
 * import) -- no re-derivation here.
 *
 * @see imp-33231-fifth-pair-spread-n2800-resolved.js (source module: spreadLadderExtended, localExponents, verdict)
 * @see imp-33217-fifth-pair-spread-ulp-floor-ladder-viz-data.js (prior four-rung viz-data module this extends)
 *
 * Ticket: imp-33264 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP33264_LADDER = [
  { N: 1200, spread: 0, ulps: 0 },
  { N: 1600, spread: 0, ulps: 0 },
  { N: 1800, spread: 1.965626e-16, ulps: 0.885 },
  { N: 2000, spread: 1.375522e-15, ulps: 6.195 },
  { N: 2200, spread: 1.964592e-15, ulps: 8.848 },
  { N: 2400, spread: 1.964257e-15, ulps: 8.846 },
  { N: 2800, spread: 1.963790e-16, ulps: 0.884 },
];

export const IMP33264_ULP_FLOOR = 10;

export const IMP33264_LOCAL_EXPONENTS = [
  { fromN: 1800, toN: 2000, exponent: 18.47 },
  { fromN: 2000, toN: 2200, exponent: 3.74 },
  { fromN: 2200, toN: 2400, exponent: -0.002 },
  { fromN: 2400, toN: 2800, exponent: -14.94 },
];

export const IMP33264_DIP_FACTOR_2400_TO_2800 = 10.0;
