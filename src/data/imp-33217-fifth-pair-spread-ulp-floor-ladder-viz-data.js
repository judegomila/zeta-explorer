/**
 * @module imp-33217-fifth-pair-spread-ulp-floor-ladder-viz-data
 *
 * imp-33217 (ux): lightweight, import-light viz-data module for a chart of the imp-3851
 * fifth-pair Gram degeneracy spread ULP-floor ladder: worstPairSpread(N) across
 * N in {1200, 1600, 1800, 2000, 2200} = 0, 0, 1.97e-16, 1.38e-15, 1.96e-15 (in ULP:
 * 0, 0, 0.885, 6.195, 8.848), all sitting below the conservative 10-ULP backward-error
 * floor, plus the two successive local power-law exponents forced through the three
 * nonzero rungs -- p(1800->2000)=18.47 and p(2000->2200)=3.74 -- whose inconsistency
 * (ratio ~4.9) rules out a coherent growth law spread ~ N^p.
 *
 * Reference literals are baked from the imp-3851 measured table (self-computing at
 * import) -- no re-derivation here.
 *
 * @see imp-3851-fifth-pair-spread-n2200-resolved.js (source module: spreadLadderExtended, exponents, verdict)
 *
 * Ticket: imp-33217 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP33217_LADDER = [
  { N: 1200, spread: 0, ulps: 0 },
  { N: 1600, spread: 0, ulps: 0 },
  { N: 1800, spread: 1.965626e-16, ulps: 0.885 },
  { N: 2000, spread: 1.375522e-15, ulps: 6.195 },
  { N: 2200, spread: 1.964592e-15, ulps: 8.848 },
];

export const IMP33217_ULP_FLOOR = 10;

export const IMP33217_LOCAL_EXPONENTS = [
  { fromN: 1800, toN: 2000, exponent: 18.47 },
  { fromN: 2000, toN: 2200, exponent: 3.74 },
];

export const IMP33217_EXPONENT_RATIO = 4.94;
