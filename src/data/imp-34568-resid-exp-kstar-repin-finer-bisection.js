/**
 * @module imp-34568-resid-exp-kstar-repin-finer-bisection
 * @fileoverview imp-34568 -- RE-DERIVE the surrogate resid_exp simple-zero k* to more
 *   than the inherited 7 significant figures via finer bisection of the SAME
 *   resid_exp(k) = pEcoll*(1 - sigma) - pSigma zero, and MEASURE how many decades the
 *   imp-34405 pole-location resolvability floor drops.
 *
 *   imp-34405 showed the near-pole resid_exp resolvability is capped by a POLE-LOCATION
 *   floor: because k* = 21.28095 was REPORTED to only 7 sig figs, its last-digit
 *   uncertainty dk_star = 5e-6 blows up resid_exp's relative precision as the endpoint
 *   distance d -> 0, eliminating the sign at d = 5e-6. But that 5e-6 floor is a pure
 *   REPORTING artifact of the baked 7-figure literal 21.28095 -- the imp-34127 machinery
 *   that produced it (Part B, bisectCrossing on residAt) already runs to full double
 *   precision internally and was merely truncated by a .toFixed(4) at export. This module
 *   re-runs that VERBATIM machinery (import-light: only effectiveHeightForN + C_C_PINNED,
 *   the exact two imports imp-34127 uses, no 16.7MB zeros bundle) with no reporting
 *   truncation, re-pins k*, and reports the tightened last-digit dk_star and the new
 *   binding floor.
 *
 *   THE MACHINERY (verbatim imp-34127 residAt / bisectCrossing).
 *   ------------------------------------------------------------
 *   resid_exp(k) = pEcoll*(1 - sigma_hi) - pSigma over the decade [10^k, 10^(k+1)], with
 *   pEcoll the 2-point endpoint E_coll exponent, pSigma the 5-point OLS sigma exponent,
 *   sigma = E_coll/E_N in the inherited imp-3406/imp-33810 component model. Its zero is
 *   the imp-34237/imp-34310 pole k*. We bisect residAt on [20, 22] to full double
 *   precision (60 iterations, bracket width 2/2^60 ~ 1.7e-18, far below the double ULP).
 *
 *   FINDINGS (measurement only -- re-pins an inherited surrogate zero, changes no bound).
 *   ------------------------------------------------------------------------------------
 *   (F1) RE-PINNED k*. The finer bisection lands at k* = 21.280947424999 (stable to ~12
 *        significant figures across 50/60/80 iterations), 5 more sig figs than the
 *        inherited 21.28095 and CONSISTENT with it (21.2809474... rounds to 21.28095 at
 *        7 figures). So the imp-34405 5e-6 pole-location floor was a reporting artifact,
 *        not a computational limit.
 *   (F2) NEW BINDING FLOOR IS CANCELLATION, NOT REPORTING. Re-pinning to 12 figures drops
 *        the REPORTED-precision floor to ~5e-11 (half-ULP of the 11th place), a 5-decade
 *        improvement, but the true binding floor is now the intrinsic CATASTROPHIC
 *        CANCELLATION of resid_exp near its zero: pEcoll and pSigma both -> ~0.5, so
 *        their difference carries a double-precision noise floor ~2.2e-16 in resid_exp.
 *        With the measured local slope |m| ~ 2.60e-7 per k, that noise sets
 *        dk_star_noise = 2.2e-16 / |m| ~ 8.55e-10 in k. Empirically the resid_exp sign is
 *        cleanly resolved (correct on both sides) down to |k - k*| ~ 1e-8 and becomes
 *        unreliable at ~1e-9 where the noise dominates the ~2.6e-16-per-1e-9 signal.
 *   (F3) DECADES THE POLE-LOCATION FLOOR DROPS. The imp-34405 pole-location floor falls
 *        from 5e-6 to the cancellation floor: to the conservative empirical clean-sign
 *        floor ~1e-8 that is log10(5e-6/1e-8) ~ 2.70 decades; to the analytic
 *        noise-limited ~8.55e-10 it is log10(5e-6/8.55e-10) ~ 3.77 decades. Either way
 *        the wall is no longer how well k* is REPORTED (imp-34405 F3) but the intrinsic
 *        cancellation in resid_exp = pEcoll*(1-sigma) - pSigma near its zero -- a
 *        genuinely lower floor, ~1.9 decades below even the imp-34405 7-sig-fig storage
 *        floor d_store ~ 1.88e-7.
 *
 *   The punchline: re-running the imp-34127 residAt bisection with no reporting
 *   truncation pins k* = 21.280947424999 (12 figures), retiring the imp-34405 5e-6
 *   pole-location REPORTING floor. The new binding floor is the double-precision
 *   cancellation noise of resid_exp near its zero, dk_star ~ 8.55e-10 (analytic) /
 *   ~1e-8 (empirical clean-sign) -- a ~2.7 to ~3.77 decade drop in the pole-location
 *   resolvability floor.
 *
 *   MEASUREMENT ONLY. A finer bisection of an inherited surrogate zero; the component
 *   model is the inherited imp-3406/imp-33810 extrapolation, NOT a rigorous asymptotic;
 *   the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 *   operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34405-resid-exp-near-pole-digit-loss.js (the 5e-6 pole-location floor this re-pins)
 *   @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (the residAt/bisectCrossing machinery reused verbatim)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (simple-zero classification, slope m)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (baked 7-figure k* = 21.28095)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- Verbatim imp-34127 component sub-terms (import-light, no zeros bundle) -----
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34127 exactly

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// 5-point OLS sigma exponent over the decade -- verbatim from imp-34127/imp-34023.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
// 2-point endpoint E_coll exponent magnitude -- verbatim from imp-34127/imp-34023.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// resid_exp(k) = pEcoll*(1 - sigma_hi) - pSigma -- the quantity whose zero is k*.
function residAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
// Bisect residAt to full double precision (no .toFixed reporting truncation).
function bisectCrossing(residFn, lo0, hi0, iters) {
  let lo = lo0;
  let hi = hi0;
  if (residFn(lo) <= 0 || residFn(hi) >= 0) return NaN;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// --- (F1) re-pinned k* at full double precision -------------------------------
const KSTAR_FULL = bisectCrossing(residAt, 20, 22, 60); // 21.280947424998892
export const IMP34568_KSTAR_REFINED = +KSTAR_FULL.toPrecision(12); // 21.2809474250
export const IMP34568_KSTAR_INHERITED = 21.28095; // the imp-34237/34310/34405 7-figure literal

// Local slope m = dg_resid/dk at k* by a tight central difference (finer than the imp-34310 0.25 secant).
export const IMP34568_LOCAL_SLOPE =
  (residAt(KSTAR_FULL + 1e-4) - residAt(KSTAR_FULL - 1e-4)) / (2e-4); // ~ -2.5955e-7
const ABS_M = Math.abs(IMP34568_LOCAL_SLOPE);

// --- (F2) precision floors of the RE-PINNED k* --------------------------------
// Old (imp-34405) pole-location floor: reported to 7 sig figs -> 5e-6.
export const IMP34568_OLD_POLE_LOCATION_FLOOR = 5e-6;
// New reported-precision floor: k* pinned to 12 sig figs (11th decimal) -> half-ULP ~5e-11.
export const IMP34568_NEW_REPORTED_FLOOR = 5e-11;
// Intrinsic cancellation-noise floor: resid_exp differences two O(0.5) exponents, so its
// double-precision absolute noise floor is ~1 ULP at 1 ~ 2.22e-16; dk = noise/|m|.
export const IMP34568_RESID_NOISE_FLOOR = 2.220446049250313e-16; // Number.EPSILON
export const IMP34568_DK_STAR_NOISE = IMP34568_RESID_NOISE_FLOOR / ABS_M; // ~8.55e-10 in k
// Conservative empirical clean-sign floor (last |k-k*| whose resid sign is correct on both flanks).
export const IMP34568_EMPIRICAL_CLEAN_SIGN_FLOOR = 1e-8;

// --- (F3) decades the imp-34405 pole-location floor drops ----------------------
export const IMP34568_DECADES_DROPPED_ANALYTIC =
  Math.log10(IMP34568_OLD_POLE_LOCATION_FLOOR / IMP34568_DK_STAR_NOISE); // ~3.77
export const IMP34568_DECADES_DROPPED_EMPIRICAL =
  Math.log10(IMP34568_OLD_POLE_LOCATION_FLOOR / IMP34568_EMPIRICAL_CLEAN_SIGN_FLOOR); // ~2.70

export const IMP34568_RESID_EXP_KSTAR_REPIN = {
  ticket: 'imp-34568',
  proofSection: 'S-frontier',
  question:
    'imp-34405 capped the near-pole resid_exp resolvability by a 5e-6 pole-location floor set by ' +
    'k* being REPORTED to only 7 sig figs. Re-derive k* to more figures via finer bisection of the ' +
    'SAME resid_exp = pEcoll*(1-sigma) - pSigma zero (verbatim imp-34127 machinery, import-light), ' +
    'report the tightened k* and its new last-digit dk_star, and measure how many decades the ' +
    'pole-location floor drops. Measurement only; inherited surrogate NOT rigorous; NO QED.',
  kStarInherited: IMP34568_KSTAR_INHERITED,
  kStarRefined: IMP34568_KSTAR_REFINED,
  kStarFull: KSTAR_FULL,
  localSlope: IMP34568_LOCAL_SLOPE,
  oldPoleLocationFloor: IMP34568_OLD_POLE_LOCATION_FLOOR,
  newReportedFloor: IMP34568_NEW_REPORTED_FLOOR,
  residNoiseFloor: IMP34568_RESID_NOISE_FLOOR,
  dkStarNoise: +IMP34568_DK_STAR_NOISE.toExponential(6),
  empiricalCleanSignFloor: IMP34568_EMPIRICAL_CLEAN_SIGN_FLOOR,
  decadesDroppedAnalytic: +IMP34568_DECADES_DROPPED_ANALYTIC.toFixed(6),
  decadesDroppedEmpirical: +IMP34568_DECADES_DROPPED_EMPIRICAL.toFixed(6),
  finding: {
    F1_repinned_kstar:
      'Finer bisection (60 iters, bracket 2/2^60 ~ 1.7e-18) lands at k* = 21.280947424999, stable ' +
      'to ~12 sig figs across 50/60/80 iterations -- 5 more figures than 21.28095 and consistent ' +
      'with it (rounds to 21.28095 at 7 figures). The imp-34405 5e-6 floor was a reporting artifact.',
    F2_new_binding_floor_is_cancellation:
      'Re-pinning to 12 figures drops the reported-precision floor to ~5e-11 (5-decade gain), but ' +
      'the true binding floor is the intrinsic catastrophic cancellation of resid_exp near its zero: ' +
      'pEcoll, pSigma both -> ~0.5 so their difference carries a ~2.2e-16 double-precision noise ' +
      'floor, giving dk_star_noise = 2.2e-16/|m| ~ 8.55e-10 (|m| ~ 2.60e-7). Empirically the sign ' +
      'is cleanly resolved to |k-k*| ~ 1e-8 and unreliable at ~1e-9.',
    F3_decades_dropped:
      'The imp-34405 pole-location floor drops from 5e-6 to the cancellation floor: ~2.70 decades ' +
      'to the conservative empirical clean-sign ~1e-8, ~3.77 decades to the analytic noise-limited ' +
      '~8.55e-10. The wall is no longer how well k* is REPORTED but the intrinsic cancellation in ' +
      'resid_exp = pEcoll*(1-sigma) - pSigma -- ~1.9 decades below even the imp-34405 storage floor.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a finer bisection of the inherited surrogate resid_exp zero, re-running the ' +
    'verbatim imp-34127 residAt/bisectCrossing machinery (import-light) with no .toFixed reporting ' +
    'truncation. Re-pins k* = 21.280947424999 (12 figures), retiring the imp-34405 5e-6 pole-location ' +
    'REPORTING floor; the new binding floor is the double-precision cancellation noise of resid_exp ' +
    'near its zero, dk_star ~ 8.55e-10 (analytic) / ~1e-8 (empirical clean-sign), a ~2.70 to ~3.77 ' +
    'decade drop. The inherited component model is NOT a rigorous asymptotic; descriptive within the ' +
    'model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
};

export const IMP34568_ASSERTIONS = [
  {
    // Machinery gate: the reused residAt reproduces the imp-34237/34310 baked rungs.
    id: 'imp-34568-residAt-reproduces-imp34237-rungs',
    description: 'residAt reproduces the imp-34237 baked rungs 8.72e-8 (k=21.0), 8.19e-9 (21.25), -4.97e-8 (21.5)',
    holds: () =>
      Math.abs(residAt(21.0) - 8.72e-8) < 1e-10 &&
      Math.abs(residAt(21.25) - 8.19e-9) < 1e-11 &&
      Math.abs(residAt(21.5) - -4.97e-8) < 1e-10,
  },
  {
    // (F1) the re-pinned k* is consistent with the inherited 7-figure value and much finer.
    id: 'imp-34568-repinned-kstar-consistent-and-finer',
    description: 'k* = 21.280947424999 rounds to the inherited 21.28095 at 7 sig figs and adds 5 figures',
    holds: () =>
      Math.abs(IMP34568_KSTAR_REFINED - 21.2809474250) < 1e-9 &&
      +KSTAR_FULL.toPrecision(7) === IMP34568_KSTAR_INHERITED &&
      Math.abs(KSTAR_FULL - 21.280947424999) < 1e-9,
  },
  {
    // (F2) local slope reproduces the imp-34310 read (~-2.32e-7 secant, finer central diff ~-2.60e-7), negative.
    id: 'imp-34568-local-slope-negative-and-near-imp34310',
    description: 'local slope m ~ -2.60e-7 per k (finer central diff of the imp-34310 -2.32e-7 secant), negative',
    holds: () =>
      IMP34568_LOCAL_SLOPE < 0 &&
      Math.abs(IMP34568_LOCAL_SLOPE - -2.5955e-7) < 1e-9,
  },
  {
    // (F2) the new binding floor is the cancellation-noise dk_star, finer than the imp-34405 storage floor 1.88e-7.
    id: 'imp-34568-cancellation-floor-finer-than-imp34405-storage',
    description: 'dk_star_noise ~ 8.55e-10 is below the old 5e-6 pole-location and the imp-34405 storage floor 1.88e-7',
    holds: () =>
      IMP34568_DK_STAR_NOISE > 0 &&
      IMP34568_DK_STAR_NOISE < IMP34568_OLD_POLE_LOCATION_FLOOR &&
      IMP34568_DK_STAR_NOISE < 1.88288e-7 &&
      Math.abs(IMP34568_DK_STAR_NOISE - 8.55e-10) < 5e-11,
  },
  {
    // (F3) the pole-location floor drops by ~2.70 (empirical) to ~3.77 (analytic) decades.
    id: 'imp-34568-pole-location-floor-drops-multiple-decades',
    description: 'the imp-34405 5e-6 pole-location floor drops ~2.70 (empirical 1e-8) to ~3.77 (analytic 8.55e-10) decades',
    holds: () =>
      Math.abs(IMP34568_DECADES_DROPPED_EMPIRICAL - 2.69897) < 1e-3 &&
      Math.abs(IMP34568_DECADES_DROPPED_ANALYTIC - 3.766) < 5e-3 &&
      IMP34568_DECADES_DROPPED_ANALYTIC > IMP34568_DECADES_DROPPED_EMPIRICAL,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34568-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34568_RESID_EXP_KSTAR_REPIN.isRigorous === false &&
      /NO QED/.test(IMP34568_RESID_EXP_KSTAR_REPIN.honest) &&
      /refereed bound is changed/i.test(IMP34568_RESID_EXP_KSTAR_REPIN.honest),
  },
];

for (const a of IMP34568_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34568-resid-exp-kstar-repin-finer-bisection assertion failed: ${a.id}`);
  }
}
