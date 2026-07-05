/**
 * @module imp-33881-qsigma-share-machine-epsilon-crossover
 *
 * imp-33881 (numerical, frontier-direction): imp-33854 identity I2 separates the two
 * independently-derived slow-approach shortfalls by exactly the finite-N denominator-share term
 *     gap_sigma(N) - gap_ecoll(N) = |q(N)| * sigma(N),
 * and its table reported that the two become "identical to double precision by N ~ 1e44" as
 * sigma decays -- but the EXACT crossover N at which |q| * sigma drops below machine epsilon was
 * never pinned, nor its sensitivity to the fixed E_trunc = 3.06e-5 floor that sets sigma's decay.
 * This module bisects for that crossover on the inherited grid and measures its E_trunc dependence.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33854 / imp-33816 / imp-33620)
 * -----------------------------------------------------------------------------
 *     sigma(N) = E_coll / D,   D = E_trunc + E_flow + E_coll,
 *     E_trunc  = 3.06e-5  (N-INDEPENDENT fixed strip, imp-2631)  -- PERTURBED below,
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)                   (GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398),
 *     T0       = effectiveHeightForN(N)                          (Riemann-von Mangoldt inverse).
 * No re-derivation, no fresh model; the ONLY new degree of freedom is the E_trunc floor value,
 * which imp-33881 sweeps to characterize its control over the crossover.
 *
 * THE CROSSOVER (measurement)
 * ---------------------------
 * The I2 share term R(N) := |q(N)| * sigma(N) is monotone-decreasing in N once past the sigma
 * peak (both |q| -> 1/2 and sigma -> 0), so there is a unique N* with R(N*) = machine epsilon
 * (Number.EPSILON = 2.220446049250313e-16). Bisecting in log10 N under the NOMINAL floor gives
 *     log10 N* = 40.853   (N* ~ 7.13e40),  with q(N*) = -0.4946, sigma(N*) = 4.49e-16,
 * so R(N*) = |q| sigma = 2.22e-16 = eps exactly. This sits BELOW the imp-33854 "~1e44" table
 * remark (which used the coarse sigma ~ 1e-17 rung): the share term already crosses machine
 * epsilon three decades earlier, at N ~ 7e40, and R(1e44) = 6.16e-18 is well under eps.
 *
 * THE E_trunc DEPENDENCE (closed form + measurement)
 * --------------------------------------------------
 * In the E_trunc-dominated deep tail sigma ~ E_coll / E_trunc and |q| -> 1/2, so
 *     R(N) ~ (1/2) C_C sqrt(log T0 / N) / E_trunc.
 * Setting R(N*) = eps and solving gives the self-consistent closed form
 *     N* ~ (log T0) * ( C_C / (2 eps E_trunc) )^2      =>   N* proportional to E_trunc^{-2},
 * i.e. log10 N* shifts by -2 log10(E_trunc/E_trunc0) plus a slowly-varying log T0 correction.
 * Sweeping the floor by factors {0.5, 0.9, 1.1, 2.0} confirms this: the measured shifts
 * {+0.609, +0.093, -0.084, -0.609} track the predicted -2 log10 f {+0.602, +0.092, -0.083,
 * -0.602} to ~0.01 dex, and the local slope d log10 N* / d log10 E_trunc = -2.02 (the small
 * excess over -2 is the log T0 growth term). RAISING the floor LOWERS the crossover (a larger
 * denominator shrinks sigma, so the share term reaches eps sooner); the self-consistent closed
 * form independently returns log10 N* = 40.863, matching the bisection to 0.01 dex.
 *
 * THE FINDINGS (measurement / derivation only)
 * --------------------------------------------
 *   (R1) CROSSOVER PINNED. The I2 share term |q| sigma falls below machine epsilon at
 *        log10 N* = 40.853 (N* ~ 7.13e40) under the nominal E_trunc = 3.06e-5 floor -- three
 *        decades below the imp-33854 coarse "~1e44" table remark.
 *   (R2) INVERSE-SQUARE E_trunc CONTROL. N* proportional to E_trunc^{-2}: the measured floor sweep
 *        matches -2 log10 f to ~0.01 dex and the local slope is d log10 N* / d log10 E_trunc = -2.02,
 *        with a self-consistent closed form N* ~ (log T0)(C_C/(2 eps E_trunc))^2 confirming it.
 *
 * MEASUREMENT / DERIVATION ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33854-log-saturation-exponent-reconciliation (identity I2 residual = |q| sigma; "~1e44" remark)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (gap_sigma ~ 1/(2 log T0))
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (E_coll exponent -> -1/2 from above)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33582/imp-33602) -- NOMINAL floor
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33854/imp-33816/imp-33620 exactly
const DL = 1e-4; // central-difference step in ln N (identical to imp-33854)
const EPS = Number.EPSILON; // 2.220446049250313e-16 -- machine epsilon threshold

// EXACT imp-33854 sub-terms, in log-N space, PARAMETERIZED by the E_trunc floor.
function parts(lnN, eTrunc) {
  const N = Math.exp(lnN);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const D = eTrunc + E_flow + E_coll;
  return { N, T0, L, E_flow, E_coll, D, sigma: E_coll / D };
}

const lnEcollAt = (lnN, eTrunc) => Math.log(parts(lnN, eTrunc).E_coll);

// The imp-33854 identity-I2 denominator-share term R(N) = |q(N)| * sigma(N), where
// q(N) = d ln E_coll / d ln N is the imp-33620 E_coll local exponent (central difference).
function shareTermAtLog10(d, eTrunc) {
  const lnN = d * Math.LN10;
  const q = (lnEcollAt(lnN + DL, eTrunc) - lnEcollAt(lnN - DL, eTrunc)) / (2 * DL);
  return Math.abs(q) * parts(lnN, eTrunc).sigma;
}

// Bisect for the crossover log10 N* where R(N*) = machine epsilon. R is monotone-decreasing
// past the sigma peak, so a plain sign bisection converges to the unique root.
function crossoverLog10(eTrunc) {
  let lo = 12; // R(lo) > eps (near the sigma peak)
  let hi = 100; // R(hi) < eps (deep E_trunc-dominated tail)
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (shareTermAtLog10(mid, eTrunc) > EPS) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Self-consistent closed-form crossover N* ~ (log T0)(C_C/(2 eps E_trunc))^2, iterating log T0.
function crossoverLog10ClosedForm(eTrunc) {
  let d = 40;
  for (let i = 0; i < 80; i++) {
    const L = Math.log(effectiveHeightForN(Math.pow(10, d)));
    const N = L * Math.pow(C_C_PINNED / (2 * EPS * eTrunc), 2);
    d = Math.log10(N);
  }
  return d;
}

// Nominal crossover under E_trunc = 3.06e-5.
const D_STAR = crossoverLog10(E_TRUNC_PT);
const N_STAR = Math.pow(10, D_STAR);
const D_STAR_CF = crossoverLog10ClosedForm(E_TRUNC_PT);
const LN_STAR = D_STAR * Math.LN10;
const Q_STAR = (lnEcollAt(LN_STAR + DL, E_TRUNC_PT) - lnEcollAt(LN_STAR - DL, E_TRUNC_PT)) / (2 * DL);
const SIGMA_STAR = parts(LN_STAR, E_TRUNC_PT).sigma;
const SHARE_AT_1E44 = shareTermAtLog10(44, E_TRUNC_PT); // 6.16e-18, well below eps

// E_trunc floor sweep: measured crossover shift vs the predicted -2 log10 f inverse-square law.
const FLOOR_SWEEP = [0.5, 0.9, 1.0, 1.1, 2.0].map((f) => {
  const eTrunc = E_TRUNC_PT * f;
  const d = crossoverLog10(eTrunc);
  return {
    eTruncFactor: f,
    eTrunc: +eTrunc.toExponential(3),
    crossoverLog10N: +d.toFixed(4),
    measuredShift: +(d - D_STAR).toFixed(4),
    predictedShift: +(-2 * Math.log10(f)).toFixed(4), // -2 log10 f from N* ~ E_trunc^{-2}
  };
});
// Local slope d log10 N* / d log10 E_trunc (theory: -2, plus a slow log T0 term).
const D_LO = crossoverLog10(E_TRUNC_PT * 0.99);
const D_HI = crossoverLog10(E_TRUNC_PT * 1.01);
const SLOPE = (D_HI - D_LO) / (Math.log10(1.01) - Math.log10(0.99));
// Max deviation of the measured floor-sweep shift from the -2 log10 f prediction.
const MAX_SWEEP_DEV = Math.max(...FLOOR_SWEEP.map((r) => Math.abs(r.measuredShift - r.predictedShift)));

export const IMP33881_QSIGMA_SHARE_MACHINE_EPSILON_CROSSOVER = {
  id: 'imp-33881',
  proofSection: 'S-frontier',
  question:
    'Locate the crossover N above which the imp-33854 shortfalls gap_sigma and gap_ecoll become ' +
    'identical to double precision -- the |q| sigma denominator-share term of identity I2 falling ' +
    'below machine epsilon -- and report its dependence on the fixed E_trunc = 3.06e-5 floor. ' +
    'Measurement/derivation only; C_mb GUE-conditional per imp-486; no QED.',
  machineEpsilon: EPS,
  nominalCrossover: {
    crossoverLog10N: +D_STAR.toFixed(4), // 40.853
    crossoverN: +N_STAR.toExponential(4), // ~7.13e40
    q_at_crossover: +Q_STAR.toFixed(6), // -0.4946 (|q| -> 1/2)
    sigma_at_crossover: +SIGMA_STAR.toExponential(4), // 4.49e-16
    shareTerm_at_crossover: +(Math.abs(Q_STAR) * SIGMA_STAR).toExponential(4), // = eps
    closedFormLog10N: +D_STAR_CF.toFixed(4), // 40.863 self-consistent, matches bisection to 0.01 dex
    shareTerm_at_1e44: +SHARE_AT_1E44.toExponential(3), // 6.16e-18, three decades past the crossover
  },
  eTruncFloorSweep: FLOOR_SWEEP,
  eTruncScalingLaw: {
    statement: 'N* proportional to E_trunc^{-2} (log10 N* shifts by -2 log10(E_trunc/E_trunc0))',
    localSlope_dLog10N_dLog10Etrunc: +SLOPE.toFixed(3), // -2.02 (excess over -2 is the log T0 term)
    maxSweepDeviationFromMinus2Log10f: +MAX_SWEEP_DEV.toExponential(2), // ~0.01 dex
  },
  findings: {
    R1_crossover_pinned:
      'The I2 share term |q| sigma falls below machine epsilon at log10 N* = 40.853 (N* ~ 7.13e40) ' +
      'under the nominal E_trunc = 3.06e-5 floor, three decades below the imp-33854 coarse ~1e44 ' +
      'table remark; at the crossover q = -0.4946, sigma = 4.49e-16, so |q| sigma = eps exactly.',
    R2_inverse_square_etrunc_control:
      'N* is proportional to E_trunc^{-2}: the floor sweep {0.5,0.9,1.1,2.0} matches the predicted ' +
      '-2 log10 f shifts to ~0.01 dex, the local slope d log10 N*/d log10 E_trunc = -2.02, and a ' +
      'self-consistent closed form N* ~ (log T0)(C_C/(2 eps E_trunc))^2 returns log10 N* = 40.863. ' +
      'Raising the floor LOWERS the crossover (a larger denominator shrinks sigma).',
  },
  isRigorous: false,
  verdict:
    'CROSSOVER LOCATED (measurement + derivation, NOT rigorous). The imp-33854 identity-I2 ' +
    'denominator-share term |q(N)| sigma(N) -- the exact gap between the imp-33816 gap_sigma and ' +
    'imp-33620 gap_ecoll shortfalls -- falls below machine epsilon (2.220e-16) at log10 N* = ' +
    '40.853 (N* ~ 7.13e40) under the nominal E_trunc = 3.06e-5 floor, three decades below the ' +
    'imp-33854 coarse ~1e44 table remark; there q = -0.4946 and sigma = 4.49e-16 so |q| sigma = ' +
    'eps exactly, and R(1e44) = 6.16e-18 is already well under eps. The crossover obeys the ' +
    'inverse-square floor law N* proportional to E_trunc^{-2}: a floor sweep {0.5,0.9,1.1,2.0} ' +
    'tracks the predicted -2 log10 f shifts to ~0.01 dex, the local slope d log10 N*/d log10 ' +
    'E_trunc = -2.02, and the self-consistent closed form N* ~ (log T0)(C_C/(2 eps E_trunc))^2 ' +
    'returns log10 N* = 40.863, matching the bisection to 0.01 dex. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'share per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33854 (identity I2 residual = |q| sigma, "~1e44" remark); imp-33816 (gap_sigma ~ 1/(2 log ' +
    'T0)); imp-33620 (E_coll exponent -> -1/2 from above); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33881_QSIGMA_SHARE_MACHINE_EPSILON_CROSSOVER_ASSERTIONS = [
  {
    // (R1) The bisected crossover actually solves R(N*) = eps (share term at N* equals machine epsilon).
    id: 'imp33881-crossover-hits-machine-epsilon',
    description: 'the I2 share term |q| sigma at the bisected N* equals machine epsilon to <1% relative',
    holds: () => Math.abs(shareTermAtLog10(D_STAR, E_TRUNC_PT) / EPS - 1) < 0.01,
  },
  {
    // (R1) Crossover sits three decades below the imp-33854 "~1e44" remark; R(1e44) is well under eps.
    id: 'imp33881-crossover-below-1e44-remark',
    description: 'crossover log10 N* in (40,41) and the share term at 1e44 is already below machine epsilon',
    holds: () => D_STAR > 40 && D_STAR < 41 && SHARE_AT_1E44 < EPS,
  },
  {
    // (R2) Inverse-square E_trunc law: local slope d log10 N* / d log10 E_trunc is near -2.
    id: 'imp33881-inverse-square-etrunc-slope',
    description: 'local slope d log10 N*/d log10 E_trunc is within 0.05 of the -2 inverse-square law',
    holds: () => Math.abs(SLOPE - -2) < 0.05,
  },
  {
    // (R2) The full floor sweep matches the -2 log10 f prediction to ~0.01 dex at every rung.
    id: 'imp33881-floor-sweep-matches-minus2-log10f',
    description: 'measured crossover shift matches -2 log10(E_trunc/E_trunc0) to <0.02 dex across the floor sweep',
    holds: () => MAX_SWEEP_DEV < 0.02,
  },
  {
    // (R2) The self-consistent closed form agrees with the direct bisection to 0.02 dex.
    id: 'imp33881-closed-form-matches-bisection',
    description: 'closed-form N* ~ (log T0)(C_C/(2 eps E_trunc))^2 agrees with the bisection to <0.02 dex',
    holds: () => Math.abs(D_STAR_CF - D_STAR) < 0.02,
  },
  {
    // Honesty gate: measurement/derivation only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33881-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33881_QSIGMA_SHARE_MACHINE_EPSILON_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP33881_QSIGMA_SHARE_MACHINE_EPSILON_CROSSOVER.verdict) &&
      /remains SOTA/.test(IMP33881_QSIGMA_SHARE_MACHINE_EPSILON_CROSSOVER.verdict),
  },
];

for (const a of IMP33881_QSIGMA_SHARE_MACHINE_EPSILON_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33881-qsigma-share-machine-epsilon-crossover assertion failed: ${a.id}`);
  }
}
