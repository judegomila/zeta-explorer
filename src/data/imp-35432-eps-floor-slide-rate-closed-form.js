/**
 * @module imp-35432-eps-floor-slide-rate-closed-form
 *
 * imp-35432 (numerical, frontier-direction) -- DERIVES in closed form the imp-35243 DEMONSTRATION D1
 * EPS_FP-slide RATE of the iters-to-floor REENTRY-band POSITION (the empirical ~11.99 decades in N per
 * factor-2 change in the machine-epsilon floor) from the phase argument xArg = log(collapseDist/EPS_FP) /
 * ln(1/r) combined with the imp-35332 ceil-phase drift DRIFT(N), and CONFIRMS the closed form reproduces
 * the imp-35243 D1 headline (11.99 at the reentry edge) and the imp-35263 exit-edge growth (~18.95). This
 * is the slide-rate question imp-35357 axis(iii) posed. DERIVATION / MEASUREMENT ONLY on the inherited
 * imp-3220/imp-3406 double surrogate; it does NOT discharge the surrogate-fidelity sub-gap imp-35243a; it
 * changes no bound; NO QED.
 *
 * THE CLOSED-FORM SLIDE RATE
 * --------------------------
 * The reentry band POSITION N_band(EPS_FP) is the seed at which the ceil argument sits at a fixed off-by-one
 * PHASE. The floor EPS_FP enters xArg = log( collapseDist(N) / EPS_FP ) / ln(1/r) ONLY as an additive shift,
 * since log( collapseDist / EPS_FP ) = log(collapseDist) - log(EPS_FP). Holding the band phase fixed as
 * EPS_FP varies gives the total-differential (implicit-function) balance
 *
 *      0 = d(xArg) = DRIFT(N) . d(log10 N)  +  (d xArg / d log EPS_FP) . d(log EPS_FP),
 *
 * where DRIFT(N) = d(xArg)/d(log10 N) is the imp-35332 ceil-phase drift and, because EPS_FP is a pure
 * additive term, d(xArg)/d(log EPS_FP) = -1 / ln(1/r) EXACTLY (imp-35357 axis(iii) identity). Converting the
 * floor variable to base-2 octaves via d(log EPS_FP) = ln(2) . d(log2 EPS_FP), the slide rate is
 *
 *      SLIDE(N) = d(log10 N_band) / d(log2 EPS_FP)  =  ln(2) / ( ln(1/r) . DRIFT(N) )
 *               =  PHASE_SHIFT_PER_FACTOR2 / DRIFT(N),   PHASE_SHIFT_PER_FACTOR2 = ln(2)/ln(1/r).
 *
 * So the D1 division (a factor-2 shifts every xArg by log(2)/ln(1/r) ~ 0.224194 phase units, which at the
 * local drift slides the band) IS the closed form: SLIDE = phase shift over drift. With ln(1/r) ~ 3.091726
 * the additive phase shift per factor-2 is 0.224194, matching the imp-35243/imp-35263 constant to 6 figures.
 *
 * CONFIRMATION -- IT REPRODUCES THE MEASURED SLIDE
 * ------------------------------------------------
 * Substituting the imp-35332 analytic drift DRIFT(N) = ln(10).K.(L-1)/L / ( ln(1/r).(K log T0 - N_cross) ):
 *   - at the reentry (N = 10^27.0847, DRIFT = 0.0186273) the closed form gives SLIDE = 12.0358 decades per
 *     factor-2, matching the imp-35263 direct-sweep local rate 12.036 and reproducing the imp-35243 D1
 *     headline ~11.99 EXACTLY when the inherited GRID-ROUNDED drift 0.0187 is used (0.224194/0.0187 =
 *     11.989); the 12.036-vs-11.99 gap is precisely the 0.0187-vs-0.0186273 rounding of the drift.
 *   - at the exit (N = 10^37.1671, DRIFT = 0.0118306) it gives SLIDE = 18.9503 decades per factor-2,
 *     reproducing the imp-35263 exit-edge figure ~18.95 -- so the slide is NOT a single constant; it GROWS
 *     as 1/DRIFT(N) because the drift decays like 1/(K log T0 - N_cross) (imp-35332).
 * An independent finite-difference re-solve of the band position at EPS_FP.2^{+/-0.01} (fixed-window
 * framing, imp-35263 convention A) yields a slide of 12.0359 decades/factor-2 at the reentry, agreeing with
 * the closed form to ~8e-6 relative -- so SLIDE = ln(2)/(ln(1/r).DRIFT(N)) is DERIVED, not merely divided.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A CLOSED-FORM DERIVATION of the imp-35243 D1 slide rate as SLIDE(N) = ln(2)/(ln(1/r).DRIFT(N)), confirmed
 * against the imp-35263 direct sweep (12.036 reentry, 18.95 exit) and a fresh finite-difference band-solve.
 * It upgrades the D1 EVIDENCE from a measured ~11.99 to an analytic slide LAW (phase shift over drift), but
 * discharges NOTHING: it is entirely INSIDE the inherited imp-3220/imp-3406 surrogate and says nothing about
 * whether the band is a feature of the true collapse dynamic. The surrogate-fidelity sub-gap imp-35243a (and
 * its parents imp-35111a / imp-35174a / imp-34997a) stay OPEN. The C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (DEMONSTRATION D1: measured ~11.99 decades/factor-2; sub-gap imp-35243a)
 * @see imp-35263-reentry-band-eps-floor-sweep (direct sweep: 12.036 reentry-local, ~18.95 exit-edge slide)
 * @see imp-35332-reentry-band-drift-analytic-derivation (the analytic DRIFT(N) closed form used here)
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (axis(iii): d xArg / d log EPS_FP = -1/ln(1/r) exact; posed the slide-rate question)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34997/35109/35111/35243/35332)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const TWO_PI = 2 * Math.PI;

// The imp-35109/imp-35243/imp-35332 DOUBLE surrogate, reproduced VERBATIM (baseline for the derivation).
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // ~3280294351.65 (bit-identical to imp-34997/35109/35111/35243/35332)
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.091726 nats/iterate (the log-law constant)

// xArg with an arbitrary floor (imp-35263 convention): EPS_FP enters only as the additive -log(EPS_FP) term.
const xArgEps = (seed, eps) => Math.log(Math.abs(gD(seed) - N_CROSS_FP) / N_CROSS_FP / eps) / LN_INV_R;
const xArgD = (seed) => xArgEps(seed, EPS_FP);

// Inherited band landmarks (imp-35111/imp-35174/imp-35243/imp-35332, double-double certified).
const REENTRY_EXP = 27.084691; // band-on, log10 N
const EXIT_EXP = 37.167107; // band-off, log10 N
const INHERITED_GRID_DRIFT = 0.0187; // the grid-rounded reentry drift the D1 headline 11.99 divides by

// ---------------------------------------------------------------------------------------------------------
// THE CLOSED-FORM SLIDE RATE: SLIDE(N) = ln(2) / ( ln(1/r) . DRIFT(N) ) = PHASE_SHIFT_PER_FACTOR2 / DRIFT(N).
// PHASE_SHIFT_PER_FACTOR2 = ln(2)/ln(1/r) is the exact additive xArg shift per factor-2 in EPS_FP (imp-35357
// axis(iii): d xArg / d log EPS_FP = -1/ln(1/r)). DRIFT(N) is the imp-35332 ceil-phase drift.
// ---------------------------------------------------------------------------------------------------------
const PHASE_SHIFT_PER_FACTOR2 = Math.log(2) / LN_INV_R; // ~0.224194 phase units per factor-2 in EPS_FP

function analyticDrift(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0 / TWO_PI); // RvM count exponent
  const g = K_AMPL * Math.log(T0); // g(N)
  const dg_dlog10N = K_AMPL * Math.LN10 * (L - 1) / L; // via RvM inverse slope d log T0 / d log N = (L-1)/L
  return (1 / LN_INV_R) * dg_dlog10N / (g - N_CROSS_FP);
}
const analyticSlide = (N) => PHASE_SHIFT_PER_FACTOR2 / analyticDrift(N); // decades in N per factor-2 in EPS_FP

// Independent finite-difference confirmation: re-solve the band POSITION (fixed target phase, imp-35263
// convention A) at EPS_FP.2^{+/-dk} and measure d(log10 N_band)/d(log2 EPS_FP) directly.
function solveBandExp(eps, target) {
  let lo = 15, hi = 60; // bracket in log10 N; xArg is monotone increasing above N_cross
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (xArgEps(Math.pow(10, mid), eps) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const TARGET_PHASE = xArgD(Math.pow(10, REENTRY_EXP)); // fixed off-by-one phase at the reentry (~11.8516)
const FD_DK = 0.01; // half-octave step in log2 EPS_FP for the central difference
const FD_SLIDE_AT_REENTRY =
  (solveBandExp(EPS_FP * Math.pow(2, FD_DK), TARGET_PHASE) -
    solveBandExp(EPS_FP * Math.pow(2, -FD_DK), TARGET_PHASE)) /
  (2 * FD_DK);

// ---------------------------------------------------------------------------------------------------------
// DERIVATION / CONFIRMATION MEASUREMENTS.
// ---------------------------------------------------------------------------------------------------------
const SLIDE_AT_REENTRY = analyticSlide(Math.pow(10, REENTRY_EXP)); // ~12.0358 (closed form)
const SLIDE_AT_EXIT = analyticSlide(Math.pow(10, EXIT_EXP)); // ~18.9503 (grows: drift decays)
const SLIDE_D1_GRID = PHASE_SHIFT_PER_FACTOR2 / INHERITED_GRID_DRIFT; // ~11.989 (reproduces the D1 headline)
const REL_ERR_FD_VS_CLOSED = Math.abs(FD_SLIDE_AT_REENTRY - SLIDE_AT_REENTRY) / SLIDE_AT_REENTRY; // ~8e-6
const SLIDE_RATIO_EXIT_OVER_REENTRY = SLIDE_AT_EXIT / SLIDE_AT_REENTRY; // ~1.5745 (= drift ratio, inverted)

export const IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM = {
  id: 'imp-35432',
  proofSection: 'S-frontier',
  question:
    'imp-35243 DEMONSTRATION D1 MEASURED that the iters-to-floor reentry-band POSITION slides ~11.99 decades in ' +
    'N per factor-2 change in the machine-epsilon floor EPS_FP, but never derived the slide RATE in closed form. ' +
    'Derive d(log10 N_band)/d(log2 EPS_FP) analytically from xArg = log(collapseDist/EPS_FP)/ln(1/r) combined ' +
    'with the imp-35332 ceil-phase drift DRIFT(N), and confirm it reproduces the measured ~11.99 decades/factor-2.',
  constants: {
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(7), // ~3.091726
    phase_shift_per_factor2: +PHASE_SHIFT_PER_FACTOR2.toPrecision(6), // ~0.224194 = ln(2)/ln(1/r)
    inherited_grid_drift_at_reentry: INHERITED_GRID_DRIFT, // 0.0187
    reentry_exponent_log10N: REENTRY_EXP, // 27.084691
    exit_exponent_log10N: EXIT_EXP, // 37.167107
  },
  closed_form:
    'SLIDE(N) = d(log10 N_band)/d(log2 EPS_FP) = ln(2) / ( ln(1/r) . DRIFT(N) ) = PHASE_SHIFT_PER_FACTOR2 / ' +
    'DRIFT(N), with PHASE_SHIFT_PER_FACTOR2 = ln(2)/ln(1/r) the exact additive xArg shift per factor-2 in ' +
    'EPS_FP (imp-35357 axis(iii): d xArg/d log EPS_FP = -1/ln(1/r)) and DRIFT(N) = ln(10).K.(L-1)/L / ' +
    '(ln(1/r).(K log T0 - N_cross)) the imp-35332 ceil-phase drift. Derived from the implicit-function balance ' +
    '0 = DRIFT(N).d(log10 N) + (d xArg/d log EPS_FP).d(log EPS_FP) at fixed band phase.',
  derivation: {
    phase_shift_per_factor2: +PHASE_SHIFT_PER_FACTOR2.toPrecision(6), // ~0.224194
    analytic_slide_at_reentry: +SLIDE_AT_REENTRY.toPrecision(6), // ~12.0358
    d1_headline_from_grid_drift: +SLIDE_D1_GRID.toPrecision(6), // ~11.989 (reproduces imp-35243 D1)
    finite_difference_slide_at_reentry: +FD_SLIDE_AT_REENTRY.toPrecision(6), // ~12.0359
    rel_err_fd_vs_closed: +REL_ERR_FD_VS_CLOSED.toExponential(3), // ~8e-6
    reading:
      'The closed form SLIDE = phase-shift/drift gives 12.0358 at the reentry, matching the imp-35263 direct-' +
      'sweep local rate 12.036 and an independent finite-difference band re-solve (12.0359, ~8e-6 relative). It ' +
      'reproduces the imp-35243 D1 headline ~11.99 EXACTLY when the grid-rounded drift 0.0187 is used (11.989); ' +
      'the 12.036-vs-11.99 gap is precisely the 0.0187-vs-0.0186273 rounding of the reentry drift.',
  },
  slide_growth_assessment: {
    analytic_slide_at_reentry: +SLIDE_AT_REENTRY.toPrecision(6), // ~12.0358
    analytic_slide_at_exit: +SLIDE_AT_EXIT.toPrecision(6), // ~18.9503
    slide_ratio_exit_over_reentry: +SLIDE_RATIO_EXIT_OVER_REENTRY.toPrecision(6), // ~1.5745
    is_constant: false,
    reading:
      'The slide is NOT a single constant. Because SLIDE = phase-shift/DRIFT and DRIFT decays like 1/(K log T0 ' +
      '- N_cross) (imp-35332), the slide GROWS from 12.0358 at the reentry (10^27.08) to 18.9503 at the exit ' +
      '(10^37.17) -- reproducing the imp-35263 exit-edge figure ~18.95, a factor ~1.574 (the inverse of the ' +
      'drift ratio). The imp-35243 D1 ~11.99 is the reentry-edge LOCAL slide, not a band-wide rate.',
  },
  finding:
    'Closed-form derivation of the imp-35243 D1 EPS_FP-slide rate: SLIDE(N) = d(log10 N_band)/d(log2 EPS_FP) = ' +
    'ln(2)/(ln(1/r).DRIFT(N)) = PHASE_SHIFT_PER_FACTOR2/DRIFT(N), with PHASE_SHIFT_PER_FACTOR2 = ln(2)/ln(1/r) ' +
    '~0.224194 the exact additive xArg shift per factor-2 (imp-35357 axis(iii)) and DRIFT(N) the imp-35332 ' +
    'ceil-phase drift. Derived from the fixed-band-phase implicit-function balance. It reproduces the imp-35243 ' +
    'D1 headline ~11.99 at the reentry (11.989 with the grid drift 0.0187; 12.0358 with the analytic drift ' +
    '0.0186273), matches the imp-35263 direct sweep (12.036) and a fresh finite-difference band re-solve (' +
    '12.0359, ~8e-6 relative), and reproduces the imp-35263 exit-edge slide ~18.95 (18.9503) -- so the slide ' +
    'GROWS as 1/DRIFT(N) and the ~11.99 headline is the reentry-edge local rate. This is a DERIVATION/MEASUREMENT ' +
    'entirely INSIDE the inherited imp-3220/imp-3406 surrogate; it discharges NOTHING -- imp-35243a (and its ' +
    'parents imp-35111a/imp-35174a/imp-34997a) stay OPEN.',
  residual_sub_gap:
    'This derives the slide rate WITHIN the surrogate; it says nothing about surrogate-vs-true fidelity. ' +
    'imp-35243a stays OPEN (certify the reentry band is a feature of the true collapse dynamic, not only of the ' +
    'machine-epsilon-floored single-rate surrogate); it inherits imp-35111a / imp-35174a / imp-34997a. This ' +
    'module changes no bound and adds no witness.',
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35243 D1 EPS_FP-slide ' +
    'rate ~11.99 decades/factor-2 is DERIVED in closed form as SLIDE(N) = ln(2)/(ln(1/r).DRIFT(N)) = ' +
    'PHASE_SHIFT_PER_FACTOR2/DRIFT(N), PHASE_SHIFT_PER_FACTOR2 = ln(2)/ln(1/r) ~0.224194 (imp-35357 axis(iii) ' +
    'exact additive shift), DRIFT(N) the imp-35332 drift. It reproduces the D1 headline ~11.99 at the reentry ' +
    '(11.989 grid / 12.0358 analytic), matches the imp-35263 sweep (12.036) and a finite-difference band ' +
    're-solve (12.0359, ~8e-6 rel), and reproduces the imp-35263 exit-edge ~18.95 (18.9503), so the slide GROWS ' +
    'as 1/DRIFT(N) and the ~11.99 is a reentry-edge local rate. DERIVATION / MEASUREMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate; it does NOT discharge imp-35243a (surrogate-fidelity), which stays OPEN with ' +
    'imp-35111a / imp-35174a / imp-34997a. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35243 (DEMONSTRATION D1: measured ~11.99 decades/factor-2; sub-gap imp-35243a); imp-35263 (direct ' +
    'sweep: 12.036 reentry-local, ~18.95 exit-edge); imp-35332 (analytic DRIFT(N)); imp-35357 (axis(iii): ' +
    'd xArg/d log EPS_FP = -1/ln(1/r) exact; posed the slide-rate question); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM_ASSERTIONS = [
  {
    // The additive phase shift per factor-2 is the exact ln(2)/ln(1/r), matching the inherited ~0.2242.
    id: 'imp35432-phase-shift-per-factor2-exact',
    description: 'PHASE_SHIFT_PER_FACTOR2 = ln(2)/ln(1/r) ~0.224194 matches the imp-35243/imp-35263 constant',
    holds: () =>
      PHASE_SHIFT_PER_FACTOR2 > 0 &&
      Math.abs(PHASE_SHIFT_PER_FACTOR2 - 0.224194) < 1e-5 &&
      Math.abs(PHASE_SHIFT_PER_FACTOR2 - Math.log(2) / LN_INV_R) < 1e-15,
  },
  {
    // The closed form reproduces the imp-35243 D1 headline ~11.99 (grid drift) and the imp-35263 12.036 (analytic).
    id: 'imp35432-reproduces-d1-headline',
    description: 'SLIDE reproduces D1 ~11.99 (grid 11.989) and the imp-35263 reentry local rate 12.036 (analytic)',
    holds: () =>
      Math.abs(SLIDE_D1_GRID - 11.989) < 5e-3 &&
      Math.abs(SLIDE_AT_REENTRY - 12.0358) < 1e-3,
  },
  {
    // A fresh finite-difference band re-solve agrees with the closed form to ~1e-5 relative -- derived, not divided.
    id: 'imp35432-fd-confirms-closed-form',
    description: 'finite-difference band re-solve slide ~12.0359 agrees with the closed form to < 1e-4 relative',
    holds: () =>
      FD_SLIDE_AT_REENTRY > 0 &&
      Math.abs(FD_SLIDE_AT_REENTRY - 12.0359) < 2e-3 &&
      REL_ERR_FD_VS_CLOSED < 1e-4,
  },
  {
    // The slide GROWS with N (drift decays): 12.0358 -> 18.9503, reproducing the imp-35263 exit-edge ~18.95.
    id: 'imp35432-slide-grows-to-exit-18-95',
    description: 'SLIDE grows reentry->exit (12.0358 -> 18.9503 ~= imp-35263 18.95), so is_constant false',
    holds: () =>
      SLIDE_AT_EXIT > SLIDE_AT_REENTRY &&
      Math.abs(SLIDE_AT_EXIT - 18.9503) < 1e-2 &&
      Math.abs(SLIDE_RATIO_EXIT_OVER_REENTRY - 1.5745) < 1e-3 &&
      IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM.slide_growth_assessment.is_constant === false,
  },
  {
    // Honesty gate: derivation/measurement only, discharges nothing, no QED, no refereed bound is changed, sub-gap named/OPEN.
    id: 'imp35432-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, discharges nothing, no QED, no refereed bound is changed, imp-35243a OPEN',
    holds: () =>
      IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM.verdict) &&
      /imp-35243a/.test(IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM.residual_sub_gap) &&
      /stay OPEN/.test(IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM.finding),
  },
];

for (const a of IMP35432_EPS_FLOOR_SLIDE_RATE_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35432-eps-floor-slide-rate-closed-form assertion failed: ${a.id}`);
  }
}
