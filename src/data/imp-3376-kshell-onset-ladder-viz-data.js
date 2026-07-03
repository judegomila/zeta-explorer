/**
 * @module imp-3376-kshell-onset-ladder-viz-data
 *
 * imp-3376 (ux): lightweight, import-light viz-data module for a chart of the imp-3290
 * symmetric K-shell isolation onset ladder onset(K), which rises monotonically from
 * c* = sqrt(2+sqrt(3))-1 ~ 0.93185 at K=1 (the worst symmetric case) toward the K -> infinity
 * single-neighbour recovery onset = 1. K=2 reproduces the imp-3046 irreducible-quintic root
 * ~0.98129. The imp-3370 follow-up derives that 1-onset(K) decays as A/K^3 (CUBIC), not the
 * initially eyeballed ~1/K, with A = 6/(3+pi^2) ~ 0.46621.
 *
 * Reference literals are baked from re-running the exact bisection on
 * SG1C_R2T2_KSHELL_GENERAL's closed rate G(rho,K) -- reproduced here to machine precision,
 * no re-derivation of the underlying theory.
 *
 * @see sg1c-theta-trap-theorems.js (source module: SG1C_R2T2_KSHELL_GENERAL)
 */

export const IMP3376_C_STAR = 0.9318516525781366; // sqrt(2+sqrt(3))-1, K=1 onset (worst symmetric case)

// K=2 onset matches the imp-3046 irreducible-quintic root to machine precision
export const IMP3376_K2_QUINTIC_ROOT = 0.9812937702648579;

export const IMP3376_ONSET_LADDER = [
  { shellCount: 1, onset: 0.9318516525781366, deltaFrom1: 0.06814834742186338 },
  { shellCount: 2, onset: 0.9812937702648579, deltaFrom1: 0.018706229735142132 },
  { shellCount: 3, onset: 0.9923528794723775, deltaFrom1: 0.0076471205276225085 },
  { shellCount: 4, onset: 0.9961467649446434, deltaFrom1: 0.0038532350553566186 },
  { shellCount: 5, onset: 0.9977905740386952, deltaFrom1: 0.0022094259613048006 },
  { shellCount: 6, onset: 0.998616677604254, deltaFrom1: 0.0013833223957460117 },
  { shellCount: 8, onset: 0.9993534171536813, deltaFrom1: 0.0006465828463186885 },
  { shellCount: 12, onset: 0.9997866357467149, deltaFrom1: 0.00021336425328510877 },
  { shellCount: 20, onset: 0.9999495497711404, deltaFrom1: 0.00005045022885963313 },
  { shellCount: 40, onset: 0.999993231600516, deltaFrom1: 0.000006768399483991772 },
];

// K -> infinity limit condition has its unique root EXACTLY at rho=1 (psi(2)+gamma = H_1 = 1
// by telescoping) -- the infinite symmetric shell recovers the single-neighbour threshold.
export const IMP3376_LIMIT_ONSET = 1;

// imp-3370: leading-order decay law of 1-onset(K), CUBIC not the eyeballed ~1/K.
export const IMP3376_LEADING_COEF_A = 0.46621479674170285; // = 6/(3+pi^2)
export const IMP3376_DECAY_EXPONENT = 3;
