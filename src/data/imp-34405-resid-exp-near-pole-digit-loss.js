/**
 * @module imp-34405-resid-exp-near-pole-digit-loss
 * @fileoverview imp-34405 -- MEASURE the significant-digit loss of the surrogate
 *   resid_exp(k) as the fixed-band endpoint kEnd approaches the imp-34169 F3 /
 *   imp-34237 / imp-34310 pole k* ~ 21.28095 (the simple zero of resid_exp, where
 *   eflow_over_resid = eflow_attr / resid_exp diverges), and BOUND the finest kEnd
 *   increment resolvable before the imp-33843 log-surrogate log(eflow_over_resid)
 *   becomes numerically undefined.
 *
 *   imp-34169 F3 noted that resid_exp -> 0 near the pole "loses significant digits
 *   and windows go undefined", and imp-34310 F4 flagged the same near-pole digit loss
 *   as the reason its 3-rung secant slope / residue carry ~10% offsets, but neither
 *   quantified it as a RESOLVABILITY FLOOR. This module supplies that floor.
 *
 *   Import-light: reuses the imp-34310 published scalars (IMP34310_KSTAR,
 *   IMP34310_RESID_SLOPE_AT_ZERO), which are themselves import-light literals baked
 *   from imp-34237 (no 16.7MB zeros bundle in the chain), per
 *   [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]. The two
 *   positive-resid_exp rungs approaching k* from below are baked as literals matching
 *   the imp-34310 source (k = 21.00: resid_exp = +8.72e-8; k = 21.25: +8.19e-9).
 *
 *   THE MODEL (no fresh component model -- reuses the imp-34310 linear-zero read).
 *   -----------------------------------------------------------------------------
 *   Near the pole resid_exp(k) ~ m * (k - k*), with m = dg_resid/dk|_{k*} ~ -2.3156e-7
 *   (imp-34310 F1) and k* = 21.28095 REPORTED to 7 significant figures. Two independent
 *   precision floors govern how close kEnd may sit to k* before resid_exp -- and hence
 *   log(eflow_over_resid) -- is no longer resolvable:
 *
 *   (A) POLE-LOCATION floor. k* = 21.28095 carries a last-digit (5th-decimal) rounding
 *       uncertainty dk_star = 0.5e-5 = 5e-6. Since resid_exp = m*(k - k*), its RELATIVE
 *       precision at endpoint distance d = k* - k is rel(d) = dk_star / d, which BLOWS UP
 *       as d -> 0. The significant digits surviving in resid_exp are
 *           sig(d) = log10( d / dk_star ),
 *       hitting 0 (sign of resid_exp unresolved) at d = dk_star = 5e-6.
 *
 *   (B) STORAGE / CANCELLATION floor. resid_exp is stored to 7 significant figures
 *       (toExponential(6), relative half-ULP rho = 5e-7). As a small residual differenced
 *       from O(r_scale) terms (r_scale ~ the k=21.0 resid_exp magnitude 8.72e-8), its
 *       ABSOLUTE floor is delta_abs = rho * r_scale ~ 4.36e-14, reached at
 *           d_store = delta_abs / |m| ~ 1.88e-7.
 *
 *   The BINDING floor is the larger of the two: dk_star = 5e-6 (pole-location) dominates
 *   d_store = 1.88e-7 (storage) by ~27x. So the resolvability of kEnd near the pole is
 *   set by how well k* itself is known, NOT by the 7-sig-fig storage of resid_exp.
 *
 *   FINDINGS (measurement only -- quantifies the imp-34169 F3 / imp-34310 F4 digit loss).
 *   ---------------------------------------------------------------------------------
 *   (F1) DIGIT LOSS APPROACHING k*. On the two positive-resid rungs, the pole-location
 *        significant-digit count sig(d) = log10(d/dk_star) falls from ~4.75 at k=21.00
 *        (d=0.28095) to ~3.79 at k=21.25 (d=0.03095) -- ~0.96 digits lost over the last
 *        quarter-decade of approach, and heading to 0 at d = dk_star.
 *   (F2) FINEST RESOLVABLE kEnd INCREMENT. log(eflow_over_resid) requires resid_exp
 *        RESOLVABLY POSITIVE (eflow_attr > 0 fixed), i.e. d = k* - kEnd > dk_star. The
 *        finest kEnd step that keeps the log-surrogate well-defined is therefore
 *        ~dk_star = 5e-6 below k*: any closer and resid_exp's sign is unresolved, so
 *        eflow_over_resid may flip sign and log() returns NaN.
 *   (F3) BINDING FLOOR IS POLE-LOCATION, NOT STORAGE. The storage/cancellation floor
 *        d_store ~ 1.88e-7 is ~27x finer than dk_star ~ 5e-6 (~1.42 decades of kEnd
 *        headroom). So sharpening the reported k* by one more digit (to 21.280950)
 *        would recover ~1 decade of resolvable approach before the storage floor bites;
 *        the current wall is the pole-location precision, exactly the imp-34310 F4 caveat.
 *
 *   The punchline: as kEnd -> k* ~ 21.28095 the surrogate resid_exp loses significant
 *   digits at rate sig(d) = log10(d / 5e-6), so log(eflow_over_resid) stays numerically
 *   well-defined only for |kEnd - k*| >~ 5e-6 (the reported-k* rounding ULP), a floor
 *   ~27x looser than the 7-sig-fig storage floor ~1.88e-7. This quantifies the imp-34169
 *   F3 / imp-34310 F4 near-pole digit loss as a resolvability floor for the first time.
 *
 *   MEASUREMENT ONLY. A finite-difference / precision-budget read of an inherited
 *   surrogate near an inherited pole, NOT an RH bound. The component model is the
 *   inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the linear
 *   near-pole model reuses imp-34310; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 *   changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 *   no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (k*, slope m, F4 digit-loss caveat)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (resid_exp rows, kStar)
 *   @see imp-33843-eflow-resid-widening-form-fit.js (the log(eflow_over_resid) surrogate that goes undefined)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (F3: resid_exp -> 0 loses digits)
 */

import {
  IMP34310_KSTAR,
  IMP34310_RESID_SLOPE_AT_ZERO,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';

// --- Baked inputs (reuse the imp-34310 near-pole linear-zero read) -------------
const KSTAR = IMP34310_KSTAR; // 21.28095 (imp-34023/imp-34237/imp-34310)
const M = IMP34310_RESID_SLOPE_AT_ZERO; // dg_resid/dk|_{k*} ~ -2.3156e-7 (imp-34310 F1)
const ABS_M = Math.abs(M);

// The two positive-resid_exp rungs approaching k* from below (imp-34310 RUNG_K0/RUNG_LO).
const APPROACH_RUNGS = [
  { k: 21.0, residExp: 8.72e-8 }, // last-but-one positive rung; also the r_scale reference
  { k: 21.25, residExp: 8.19e-9 }, // closest positive rung to k* on the imp-34237 grid
];

// --- Precision floors ----------------------------------------------------------
// (A) Pole-location floor: k* = 21.28095 reported to 7 sig figs -> 5th-decimal ULP.
export const IMP34405_KSTAR_ULP = 5e-6; // half of the 1e-5 last-decimal place of 21.28095

// (B) Storage / cancellation floor: resid_exp stored to 7 sig figs (toExponential(6)).
const RHO_STORE = 5e-7; // relative half-ULP of the 7-significant-figure storage
const R_SCALE = APPROACH_RUNGS[0].residExp; // 8.72e-8, magnitude of the differenced terms
export const IMP34405_RESID_ABS_FLOOR = RHO_STORE * R_SCALE; // ~4.36e-14
export const IMP34405_D_STORE = IMP34405_RESID_ABS_FLOOR / ABS_M; // ~1.883e-7 in k

// The binding (larger) floor governs the finest resolvable kEnd increment near k*.
export const IMP34405_FINEST_KEND_INCREMENT = Math.max(
  IMP34405_KSTAR_ULP,
  IMP34405_D_STORE,
); // 5e-6 (pole-location dominates)
export const IMP34405_BINDING_FLOOR =
  IMP34405_KSTAR_ULP >= IMP34405_D_STORE ? 'pole-location' : 'storage';
export const IMP34405_FLOOR_HEADROOM_DECADES =
  Math.log10(IMP34405_KSTAR_ULP / IMP34405_D_STORE); // ~1.424 decades of kEnd headroom

// --- (F1) significant-digit count of resid_exp on the approaching rungs --------
// sig(d) = log10( d / dk_star ): digits surviving the pole-location uncertainty.
export const IMP34405_APPROACH = APPROACH_RUNGS.map((r) => {
  const d = KSTAR - r.k; // endpoint distance to the pole (positive, below k*)
  const relPrecision = IMP34405_KSTAR_ULP / d; // pole-location relative precision of resid_exp
  const sigDigits = Math.log10(d / IMP34405_KSTAR_ULP);
  return {
    k: r.k,
    residExp: r.residExp,
    distanceToPole: +d.toExponential(6),
    relPrecision: +relPrecision.toExponential(6),
    sigDigits: +sigDigits.toFixed(6),
  };
});

export const IMP34405_DIGITS_LOST_LAST_QUARTER_DECADE =
  +(IMP34405_APPROACH[0].sigDigits - IMP34405_APPROACH[1].sigDigits).toFixed(6); // ~0.958

export const IMP34405_RESID_EXP_NEAR_POLE_DIGIT_LOSS = {
  ticket: 'imp-34405',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  residSlope: M,
  question:
    'imp-34169 F3 / imp-34310 F4 note resid_exp -> 0 near k* ~ 21.28095 loses significant digits ' +
    'and the log(eflow_over_resid) window goes undefined, but never quantify the resolvability ' +
    'floor. Measure the resid_exp significant-digit loss as kEnd -> k* and bound the finest kEnd ' +
    'increment before the log-surrogate is numerically undefined. Measurement only; NO QED.',
  approach: IMP34405_APPROACH,
  digitsLostLastQuarterDecade: IMP34405_DIGITS_LOST_LAST_QUARTER_DECADE,
  kStarUlp: IMP34405_KSTAR_ULP,
  residAbsFloor: IMP34405_RESID_ABS_FLOOR,
  dStore: IMP34405_D_STORE,
  finestKEndIncrement: IMP34405_FINEST_KEND_INCREMENT,
  bindingFloor: IMP34405_BINDING_FLOOR,
  floorHeadroomDecades: +IMP34405_FLOOR_HEADROOM_DECADES.toFixed(6),
  finding: {
    F1_digit_loss_approaching_kstar:
      'The pole-location significant-digit count sig(d) = log10(d / 5e-6) falls from ~4.75 at ' +
      'k=21.00 (d=0.28095) to ~3.79 at k=21.25 (d=0.03095) -- ~0.96 digits lost over the last ' +
      'quarter-decade of approach, heading to 0 (sign of resid_exp unresolved) at d = 5e-6.',
    F2_finest_resolvable_kend_increment:
      'log(eflow_over_resid) requires resid_exp RESOLVABLY POSITIVE (eflow_attr > 0 fixed), i.e. ' +
      'd = k* - kEnd > 5e-6. The finest kEnd step keeping the log-surrogate well-defined is ' +
      '~5e-6 below k*; any closer and resid_exp sign is unresolved so eflow_over_resid may flip ' +
      'sign and log() returns NaN.',
    F3_binding_floor_is_pole_location:
      'The storage/cancellation floor d_store ~ 1.88e-7 is ~27x finer than the pole-location ' +
      'floor 5e-6 (~1.42 decades of kEnd headroom), so the wall is how well k* is known, NOT the ' +
      '7-sig-fig storage of resid_exp -- exactly the imp-34310 F4 caveat, now quantified.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a precision-budget read of the inherited surrogate resid_exp near the ' +
    'inherited pole k* ~ 21.28095, reusing the imp-34310 linear near-pole model. The finest ' +
    'resolvable kEnd increment ~5e-6 is the reported-k* rounding ULP (pole-location floor), ~27x ' +
    'looser than the 7-sig-fig storage floor ~1.88e-7; log(eflow_over_resid) stays well-defined ' +
    'only for |kEnd - k*| >~ 5e-6. Descriptive surrogate, NOT a rigorous asymptotic; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed.',
};

export const IMP34405_ASSERTIONS = [
  {
    // Reuse gate: k* and slope m are the imp-34310 published values, not fresh literals.
    id: 'imp-34405-reuses-imp34310-kstar-and-slope',
    description: 'k* = 21.28095 and slope m ~ -2.3156e-7 imported from imp-34310 verbatim',
    holds: () =>
      KSTAR === 21.28095 &&
      M < 0 &&
      Math.abs(M - -2.3156e-7) < 1e-10,
  },
  {
    // (F1) resid_exp loses significant digits toward k*: sig falls, staying between 3 and 5.
    id: 'imp-34405-digit-loss-approaching-kstar',
    description: 'sig(d) falls from ~4.75 (k=21.00) to ~3.79 (k=21.25); ~0.96 digits lost',
    holds: () =>
      IMP34405_APPROACH[0].sigDigits > IMP34405_APPROACH[1].sigDigits &&
      Math.abs(IMP34405_APPROACH[0].sigDigits - 4.74965) < 1e-3 &&
      Math.abs(IMP34405_APPROACH[1].sigDigits - 3.79169) < 1e-3 &&
      Math.abs(IMP34405_DIGITS_LOST_LAST_QUARTER_DECADE - 0.958) < 5e-3,
  },
  {
    // (F2) the finest resolvable kEnd increment is the pole-location ULP ~5e-6.
    id: 'imp-34405-finest-kend-increment-is-kstar-ulp',
    description: 'finest resolvable kEnd increment ~5e-6 = the reported-k* 5th-decimal half-ULP',
    holds: () =>
      IMP34405_KSTAR_ULP === 5e-6 &&
      IMP34405_FINEST_KEND_INCREMENT === IMP34405_KSTAR_ULP &&
      IMP34405_BINDING_FLOOR === 'pole-location',
  },
  {
    // (F3) the storage floor is finer (~1.88e-7), so pole-location binds by ~27x (~1.42 decades).
    id: 'imp-34405-storage-floor-finer-than-pole-location',
    description: 'storage floor d_store ~1.88e-7 < pole-location 5e-6; headroom ~1.42 decades',
    holds: () =>
      IMP34405_D_STORE > 0 &&
      IMP34405_D_STORE < IMP34405_KSTAR_ULP &&
      Math.abs(IMP34405_D_STORE - 1.88288e-7) < 1e-11 &&
      Math.abs(IMP34405_FLOOR_HEADROOM_DECADES - 1.4241) < 1e-3,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34405-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34405_RESID_EXP_NEAR_POLE_DIGIT_LOSS.isRigorous === false &&
      /NO QED/.test(IMP34405_RESID_EXP_NEAR_POLE_DIGIT_LOSS.honest) &&
      /refereed bound is changed/i.test(IMP34405_RESID_EXP_NEAR_POLE_DIGIT_LOSS.honest),
  },
];

for (const a of IMP34405_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34405-resid-exp-near-pole-digit-loss assertion failed: ${a.id}`);
  }
}
