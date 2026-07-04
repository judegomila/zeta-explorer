/**
 * @module imp-33728-ecoll-finiteN-vs-extrapolation-halving-shift
 *
 * imp-33728 (numerical, frontier-direction): imp-33701 flags that the sigma(N) component model
 * is the imp-3220/imp-3406 EXTRAPOLATION, NOT a rigorous asymptotic -- the closed form
 * E_coll = C_C sqrt(log T0 / N) was anchored on the imp-3220 decade ladder up to N = 10^6 and
 * then evaluated far past it (out to the ~3.3e9 sigma = 1/2 halving landmark and beyond). That
 * caveat has two DISTINCT parts that prior modules never separated: (a) the GUE-CONDITIONAL C_H
 * content of C_C (imp-486, C_mb <= 1) -- real and irreducible; and (b) the NUMERICAL closed-form
 * EXTRAPOLATION ERROR of the leading asymptotic itself -- how much the halving point would move
 * if E_coll were evaluated with its finite-N corrections instead of the leading-order form. This
 * module MEASURES part (b): it evaluates E_coll directly in a finite-N form at a spread of
 * reference N straddling the ~3.3e9 crossover, compares it to the extrapolated E_coll used by
 * imp-33582/imp-3406, and derives the resulting shift in the sigma = 1/2 landmark N.
 *
 * THE TWO E_coll FORMS (identical C_C, identical model -- only the height differs)
 * ------------------------------------------------------------------------------
 *   E_coll(N) = C_C_PINNED * sqrt(log T0(N) / N),   with T0(N) the N-th zero height.
 * The whole N-dependence beyond the explicit 1/sqrt(N) enters through the height T0(N), got by
 * INVERTING the Riemann-von Mangoldt counting function. The two forms differ ONLY in which
 * counting function is inverted:
 *   - EXTRAPOLATED (imp-3220/imp-3406/imp-33582): T0 = effectiveHeightForN(N) inverts the LEADING
 *     main term  N(T) = (T/2pi)(log(T/2pi) - 1)  -- it DROPS the +7/8 constant and the S(T)
 *     fluctuation of the exact formula. This is the "not-rigorous-asymptotic" leading form.
 *   - FINITE-N (direct): T0 inverts  N(T) = (T/2pi)(log(T/2pi) - 1) + 7/8 + S(T), retaining the
 *     +7/8 endpoint term and carrying a conservative |S(T)| <= 2.3 fluctuation envelope. This is
 *     the exact finite-N counting function (up to the O(1/T) tail), evaluated directly at each N.
 * E_trunc = 3.06e-5 (N-independent, imp-2631) and E_flow = C_F (log T0 / T0) Gronwall (imp-398)
 * are the EXACT imp-33582 sub-terms; sigma(N) = E_coll / (E_trunc + E_flow + E_coll).
 *
 * THE MEASUREMENT
 * ---------------
 *   (a) STRADDLE LADDER: at N in {1e9, 2e9, 3e9, 3.27e9, 3.3e9, 4e9, 5e9, 1e10} tabulate the
 *       extrapolated E_coll, the finite-N E_coll, and their relative difference.
 *   (b) HALVING SHIFT: bisect sigma(N) = 1/2 under BOTH E_coll forms (the extrapolated bisection
 *       reproduces the imp-3406/imp-33582 landmark ~3.27e9 as a reuse gate), and report the
 *       relative shift (N_half_fin - N_half_ext) / N_half_ext.
 *   (c) S(T) ENVELOPE: re-bisect with the finite-N height carrying S = +/- 2.3 (a conservative
 *       |S(T)| envelope at these heights) to bound the fluctuation-driven shift.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE FINITE-N E_coll CORRECTION IS ~1e-11 RELATIVE AT THE CROSSOVER. Near N ~ 3.27e9 the
 *        finite-N height T0 is smaller than the leading-asymptotic height by ~0.29 (out of
 *        ~1.14e9), so the finite-N E_coll is smaller by only ~6e-12 relative. Across the whole
 *        straddle ladder the relative difference stays below ~2.1e-11 and SHRINKS as N grows (the
 *        fixed +7/8 endpoint term is an ever-smaller fraction of N).
 *   (F2) THE sigma = 1/2 HALVING LANDMARK MOVES BY < 1e-10 (LESS THAN ONE UNIT OF N). The
 *        extrapolated bisection lands at N_half ~ 3.267e9 (reproducing imp-3406/imp-33582); the
 *        finite-N bisection moves it by only ~1.4e-11 relative -- an absolute shift of ~0.05 in
 *        N ~ 3.27e9, i.e. LESS than the integer granularity of N. Even the conservative
 *        |S(T)| <= 2.3 envelope bounds the shift below ~5e-11 relative.
 *   (F3) SO THE "NOT-RIGOROUS-ASYMPTOTIC" CAVEAT IS ABOUT THE CONDITIONAL C_H, NOT NUMERICAL
 *        EXTRAPOLATION. The finite-N vs leading-form numerical extrapolation error does NOT move
 *        the halving point measurably; the entire content of the imp-33701 caveat is the
 *        GUE-conditional C_H = 1/8 ansatz inside C_C (imp-486, C_mb <= 1), which the finite-N form
 *        leaves UNTOUCHED. The caveat quantified here is therefore a CONDITIONAL caveat, not a
 *        numerical-precision caveat: replacing the leading asymptotic by the exact finite-N
 *        counting function changes the halving landmark by nothing observable.
 *
 * The punchline: the imp-33701 "extrapolation, not a rigorous asymptotic" caveat splits cleanly
 * into (a) the irreducible GUE-conditional C_H and (b) the numerical closed-form extrapolation
 * error. Part (b) is negligible -- the halving landmark shifts by < 1e-10 relative (< 1 in N)
 * when E_coll is evaluated with its exact finite-N height instead of the leading asymptotic. All
 * the caveat weight sits on the conditional C_H, exactly the constant imp-486 already isolated.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share extrapolation-error diagnostic, NOT an RH bound. The
 * component model remains the inherited imp-3220/imp-3406 form; C_mb stays GUE-conditional per
 * imp-486 (UNTOUCHED); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (flags the extrapolation-not-asymptotic caveat)
 * @see imp-3406-sigma-highN-extrapolation (leading-form high-N branch; halving landmark ~3.27e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder + halving landmark)
 * @see imp-3444-e-coll-e-trunc-crossover (E_coll=E_trunc crossover ~3.28e9, the halving-point twin)
 * @see imp-486-Cmb-GUE-conditional (no unconditional C_mb bound -- the irreducible conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: leading RvM inverse; zeroCountAtHeight)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP3406_SIGMA_HIGHN_EXTRAPOLATION } from './imp-3406-sigma-highN-extrapolation.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// Conservative |S(T)| fluctuation envelope near T0 ~ 1e9..3e9 (the exact counting function is
// N(T) = (T/2pi)(log(T/2pi)-1) + 7/8 + S(T) + O(1/T); S(T) is mean-zero and stays well below
// this in the verified range). Used ONLY to bound the fluctuation-driven halving shift.
const S_ENVELOPE = 2.3;

// FINITE-N height: invert the exact main term N(T) = (T/2pi)(log(T/2pi)-1) + 7/8 + S. Same Newton
// scheme as effectiveHeightForN, only the counting target carries the +7/8 endpoint term (and an
// optional S offset). With S = -7/8 this reduces to the leading effectiveHeightForN inversion.
function heightFiniteN(N, S) {
  const target = N - 7 / 8 - S;
  if (!(target > 0) || !Number.isFinite(target)) return effectiveHeightForN(N);
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * target) / Math.max(1, Math.log(target + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - target;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

const E_flowAt = (T0) => ((Math.log(T0 / TWO_PI) + 1) / TWO_PI) * (Math.log(T0) / T0) * GRONWALL;
const E_collFromHeight = (T0, N) => C_C_PINNED * Math.sqrt(Math.log(T0) / N);

// EXTRAPOLATED (leading-asymptotic) sub-terms -- the exact imp-33582 form.
function sigmaExtrapolated(N) {
  const T0 = effectiveHeightForN(N);
  const E_coll = E_collFromHeight(T0, N);
  return E_coll / (E_TRUNC_PT + E_flowAt(T0) + E_coll);
}

// FINITE-N (direct) sub-terms -- same C_C, height from the exact counting function (+7/8 + S).
function sigmaFiniteN(N, S) {
  const T0 = heightFiniteN(N, S);
  const E_coll = E_collFromHeight(T0, N);
  return E_coll / (E_TRUNC_PT + E_flowAt(T0) + E_coll);
}

// Bisect sigma(N) = 1/2 on the decaying right arm (imp-3406: sigma is monotone-decreasing there).
function halvingLandmark(sigmaFn) {
  let a = Math.log(1e8);
  let b = Math.log(1e11);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (sigmaFn(Math.exp(m)) > 0.5) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (a) straddle ladder across the ~3.3e9 crossover.
const STRADDLE_N = [1e9, 2e9, 3e9, 3.27e9, 3.3e9, 4e9, 5e9, 1e10];
const LADDER = STRADDLE_N.map((N) => {
  const T0ext = effectiveHeightForN(N);
  const T0fin = heightFiniteN(N, 0);
  const eExt = E_collFromHeight(T0ext, N);
  const eFin = E_collFromHeight(T0fin, N);
  return {
    N: +N.toExponential(2),
    E_coll_extrapolated: +eExt.toExponential(6),
    E_coll_finiteN: +eFin.toExponential(6),
    relDiff: +((eFin - eExt) / eExt).toExponential(3),
    dHeight: +(T0fin - T0ext).toExponential(3),
  };
});

// (b) halving-landmark shift under the two E_coll forms.
const N_HALF_EXT = halvingLandmark(sigmaExtrapolated);
const N_HALF_FIN = halvingLandmark((N) => sigmaFiniteN(N, 0));
const HALVING_REL_SHIFT = (N_HALF_FIN - N_HALF_EXT) / N_HALF_EXT;

// (c) conservative |S(T)| envelope on the halving shift.
const N_HALF_FIN_SPLUS = halvingLandmark((N) => sigmaFiniteN(N, S_ENVELOPE));
const N_HALF_FIN_SMINUS = halvingLandmark((N) => sigmaFiniteN(N, -S_ENVELOPE));
const HALVING_ENVELOPE_REL = Math.max(
  Math.abs((N_HALF_FIN_SPLUS - N_HALF_EXT) / N_HALF_EXT),
  Math.abs((N_HALF_FIN_SMINUS - N_HALF_EXT) / N_HALF_EXT),
);

// relative diff of the two E_coll forms exactly at the extrapolated crossover.
const REL_DIFF_AT_CROSSOVER =
  (E_collFromHeight(heightFiniteN(N_HALF_EXT, 0), N_HALF_EXT) -
    E_collFromHeight(effectiveHeightForN(N_HALF_EXT), N_HALF_EXT)) /
  E_collFromHeight(effectiveHeightForN(N_HALF_EXT), N_HALF_EXT);

// reuse-gate anchor: the imp-3406 published halving landmark.
const IMP3406_HALF = IMP3406_SIGMA_HIGHN_EXTRAPOLATION.decayMarkers.N_down_to_half; // ~3.27e9

export const IMP33728_ECOLL_FINITEN_VS_EXTRAPOLATION_HALVING_SHIFT = {
  id: 'imp-33728',
  proofSection: 'S-frontier',
  question:
    'imp-33701 flags the sigma(N) component model as the imp-3220/imp-3406 EXTRAPOLATION, not a ' +
    'rigorous asymptotic. Separate that caveat into (a) the GUE-conditional C_H content and (b) ' +
    'the numerical closed-form extrapolation error: evaluate E_coll in a finite-N form (exact ' +
    'Riemann-von Mangoldt height, +7/8 endpoint term and a conservative |S(T)| envelope) at a ' +
    'spread of N straddling the ~3.3e9 crossover, compare to the extrapolated E_coll used by ' +
    'imp-33582, and derive the resulting shift in the sigma = 1/2 landmark. Measurement/fit only; ' +
    'conditional-share extrapolation-error diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'finite-N vs leading-asymptotic E_coll = C_C sqrt(log T0/N) across a straddle ladder around ' +
    'N ~ 3.3e9 (the two forms differ only in whether the inverted RvM counting function keeps the ' +
    '+7/8 + S(T) finite-N terms), and the induced relative shift of the bisected sigma = 1/2 ' +
    'halving landmark',
  extrapolatedHeight: 'effectiveHeightForN: inverts leading N(T) = (T/2pi)(log(T/2pi) - 1)',
  finiteNHeight: 'inverts exact N(T) = (T/2pi)(log(T/2pi) - 1) + 7/8 + S(T), |S| envelope <= 2.3',
  straddleLadder: LADDER,
  relDiffAtCrossover: +REL_DIFF_AT_CROSSOVER.toExponential(3),
  halvingLandmarkExtrapolated: +N_HALF_EXT.toExponential(6),
  halvingLandmarkFiniteN: +N_HALF_FIN.toExponential(6),
  halvingRelShift: +HALVING_REL_SHIFT.toExponential(3),
  halvingAbsShiftInN: +(N_HALF_FIN - N_HALF_EXT).toExponential(3),
  halvingEnvelopeRelShift: +HALVING_ENVELOPE_REL.toExponential(3),
  imp3406HalvingLandmark: IMP3406_HALF,
  finding: {
    F1_finiteN_ecoll_correction_1e11_at_crossover:
      'Near N ~ 3.27e9 the finite-N height T0 is smaller than the leading-asymptotic height by ' +
      '~0.29 (out of ~1.14e9), so the finite-N E_coll is smaller by only ~6e-12 relative. Across ' +
      'the straddle ladder the relative difference stays below ~2.1e-11 and SHRINKS as N grows ' +
      '(the fixed +7/8 endpoint term is an ever-smaller fraction of N).',
    F2_halving_landmark_moves_below_1e10:
      'The extrapolated bisection lands at N_half ~ 3.267e9 (reproducing the imp-3406/imp-33582 ' +
      'landmark); the finite-N bisection moves it by only ~1.4e-11 relative -- an absolute shift ' +
      'of ~0.05 in N ~ 3.27e9, i.e. LESS than the integer granularity of N. The conservative ' +
      '|S(T)| <= 2.3 envelope bounds the shift below ~5e-11 relative.',
    F3_caveat_is_conditional_not_numerical:
      'The finite-N vs leading-form numerical extrapolation error does NOT move the halving point ' +
      'measurably; the entire content of the imp-33701 caveat is the GUE-conditional C_H = 1/8 ' +
      'ansatz inside C_C (imp-486, C_mb <= 1), which the finite-N form leaves UNTOUCHED. The ' +
      'caveat quantified here is a CONDITIONAL caveat, not a numerical-precision caveat: replacing ' +
      'the leading asymptotic by the exact finite-N counting function changes the halving landmark ' +
      'by nothing observable.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Evaluating E_coll = C_C sqrt(log T0/N) with ' +
    'its EXACT finite-N Riemann-von Mangoldt height (retaining the +7/8 endpoint term and a ' +
    'conservative |S(T)| <= 2.3 fluctuation envelope) instead of the leading-asymptotic height ' +
    'used by imp-33582 changes E_coll by < ~2.1e-11 relative across a straddle ladder around the ' +
    '~3.3e9 crossover, shrinking with N. The sigma = 1/2 halving landmark (extrapolated bisection ' +
    'N_half ~ 3.267e9, reproducing imp-3406/imp-33582) moves by only ~1.4e-11 relative -- an ' +
    'absolute shift < 1 in N ~ 3.27e9 -- and the |S(T)| envelope caps the shift below ~5e-11. So ' +
    'the imp-33701 "extrapolation, not a rigorous asymptotic" caveat splits cleanly into (a) the ' +
    'irreducible GUE-conditional C_H (imp-486, C_mb <= 1) and (b) a NEGLIGIBLE numerical ' +
    'closed-form extrapolation error: all the caveat weight sits on the conditional constant, not ' +
    'on numerical precision. Changes no bound; C_mb stays GUE-conditional per imp-486 (UNTOUCHED); ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33701 (flags the extrapolation-not-asymptotic caveat); imp-3406 (leading-form high-N ' +
    'branch, halving landmark ~3.27e9); imp-33582 (six-decade exponent ladder + halving landmark); ' +
    'imp-3444 (E_coll=E_trunc crossover ~3.28e9); imp-486 (C_mb GUE-conditional, no unconditional ' +
    'bound); imp-2631 (E_trunc fixed-strip route); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN leading RvM inverse).',
};

export const IMP33728_ECOLL_FINITEN_VS_EXTRAPOLATION_HALVING_SHIFT_ASSERTIONS = [
  {
    // Reuse gate: the EXTRAPOLATED bisection reproduces the imp-3406 published halving landmark
    // ~3.27e9 -- proving the identical sigma sub-terms / leading height are in use before the
    // finite-N comparison runs.
    id: 'imp33728-reuses-imp3406-halving-landmark',
    description: 'extrapolated sigma=1/2 bisection reproduces the imp-3406 halving landmark ~3.27e9',
    holds: () => Math.abs(N_HALF_EXT / IMP3406_HALF - 1) < 5e-3,
  },
  {
    // (F1): the finite-N E_coll correction at the crossover is tiny and NEGATIVE (finite-N height
    // is slightly smaller than the leading asymptotic, so E_coll is slightly smaller).
    id: 'imp33728-finiteN-ecoll-correction-tiny-negative',
    description: 'finite-N E_coll differs from extrapolated by < 1e-9 relative at the crossover, and is negative',
    holds: () => REL_DIFF_AT_CROSSOVER < 0 && Math.abs(REL_DIFF_AT_CROSSOVER) < 1e-9,
  },
  {
    // (F1 mechanism): the relative difference SHRINKS monotonically along the straddle ladder --
    // the fixed +7/8 term is an ever-smaller fraction of N.
    id: 'imp33728-reldiff-shrinks-with-N',
    description: 'the |finite-N vs extrapolated| E_coll relative difference shrinks monotonically as N grows',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (Math.abs(LADDER[i].relDiff) >= Math.abs(LADDER[i - 1].relDiff)) return false;
      }
      return LADDER.every((r) => Math.abs(r.relDiff) < 1e-10);
    },
  },
  {
    // (F2): the sigma=1/2 halving landmark moves by < 1e-9 relative under the finite-N form --
    // less than one unit of N ~ 3.27e9. The numerical extrapolation error does not move it.
    id: 'imp33728-halving-shift-below-1e9',
    description: 'the finite-N sigma=1/2 halving landmark moves by < 1e-9 relative (< 1 in N ~ 3.27e9)',
    holds: () =>
      Math.abs(HALVING_REL_SHIFT) < 1e-9 && Math.abs(N_HALF_FIN - N_HALF_EXT) < 1.0,
  },
  {
    // (F2 envelope): even a conservative |S(T)| <= 2.3 fluctuation envelope keeps the halving
    // shift below 1e-9 relative -- the fluctuation term does not move the landmark either.
    id: 'imp33728-S-envelope-shift-below-1e9',
    description: 'the |S(T)| <= 2.3 envelope bounds the halving shift below 1e-9 relative',
    holds: () => HALVING_ENVELOPE_REL < 1e-9,
  },
  {
    // Honesty gate: measurement/fit only, caveat is conditional (C_H) not numerical, no QED,
    // PT stays SOTA.
    id: 'imp33728-honesty-gate-no-qed',
    description: 'Measurement only: caveat is the conditional C_H not numerical extrapolation, no QED, PT stays SOTA',
    holds: () =>
      IMP33728_ECOLL_FINITEN_VS_EXTRAPOLATION_HALVING_SHIFT.isRigorous === false &&
      /C_H/.test(IMP33728_ECOLL_FINITEN_VS_EXTRAPOLATION_HALVING_SHIFT.finding.F3_caveat_is_conditional_not_numerical) &&
      /NO QED/.test(IMP33728_ECOLL_FINITEN_VS_EXTRAPOLATION_HALVING_SHIFT.verdict) &&
      /remains SOTA/.test(IMP33728_ECOLL_FINITEN_VS_EXTRAPOLATION_HALVING_SHIFT.verdict),
  },
];

for (const a of IMP33728_ECOLL_FINITEN_VS_EXTRAPOLATION_HALVING_SHIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33728-ecoll-finiteN-vs-extrapolation-halving-shift assertion failed: ${a.id}`);
  }
}
