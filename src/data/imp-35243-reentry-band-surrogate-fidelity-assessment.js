/**
 * @module imp-35243-reentry-band-surrogate-fidelity-assessment
 *
 * imp-35243 (accuracy, frontier-direction) -- ASSESSES the SURROGATE-FIDELITY (non-arithmetic) half of the
 * named sub-gap imp-35111a for the imp-34997/imp-35111 iters-to-floor REENTRY band.
 *
 * imp-35174 discharged the ARITHMETIC half of imp-35111a: it recomputed the reappearing off-by-one band edges
 * (band-on / reentry at N ~ 10^27.08, band-off / exit at N ~ 10^37.17, width ~10.08 decades) in the imp-35109
 * cancellation-free double-double path and found them agreeing double-vs-dd to ~1e-13/1e-14 in log10 N -- so the
 * band is NOT an IEEE-754 rounding artifact of the surrogate COMPUTATION. imp-35174 then explicitly re-pointed
 * the DEEPER half as sub-gap imp-35174a: it did NOT establish that the analytic iters-to-floor MODEL is a
 * faithful proxy for the TRUE collapse dynamic that far above the ~3.28e9 fixed point. This module does exactly
 * what the ticket asks: it (i) enumerates what a surrogate-fidelity certificate would need, and (ii) assesses
 * whether the reentry band is a real feature of the true dynamic or only of the analytic surrogate. It is an
 * ASSESSMENT: it does NOT discharge imp-35111a / imp-35174a; the surrogate half stays OPEN.
 *
 * THE SURROGATE, RESTATED SO THE FIDELITY QUESTION IS SHARP
 * --------------------------------------------------------
 * The reentry band lives entirely inside a single scalar, the ceil argument
 *      xArg(seed) = log( collapseDist(seed) / EPS_FP ) / ln(1/r),
 * where collapseDist is the one-step relative approach of the single-rate log-law map g(N) = K log T0(N) to its
 * fixed point N_CROSS_FP, r = |g prime (N_CROSS_FP)| is a SINGLE contraction rate measured by finite difference
 * AT the fixed point, and EPS_FP = 2.3e-16 is a machine-epsilon relative-agreement FLOOR. An off-by-one occurs
 * when the ceil phase frac(xArg) lands in the fixed window (W, 1) of width
 *      OFFSET = log(EPS_FP / PENULT) / ln(1/r),
 * with PENULT = 1.4536e-16 the quantized penultimate-collapse witness. The band is the interval of N over which
 * the slowly upward-drifting phase (~0.0187 per decade) sits inside that window. So the band is a property of a
 * DISCRETE, single-rate, machine-epsilon-floored iteration count -- NOT (yet) of the underlying continuous
 * collapse.
 *
 * DEMONSTRATION D1 -- THE BAND POSITION IS A DIRECT FUNCTION OF THE MACHINE-EPSILON FLOOR
 * --------------------------------------------------------------------------------------
 * The floor EPS_FP enters xArg only as an additive phase shift: changing it by a factor 2 shifts every xArg by
 * exactly log(2)/ln(1/r) ~ 0.2242 phase units, which -- at the measured drift ~0.0187 phase per decade -- slides
 * the entire reentry band by ~11.99 DECADES in N. A factor-2 wobble in a machine-precision agreement floor thus
 * relocates the band by twelve orders of magnitude in N. In the TRUE infinite-precision continuous collapse
 * there is no such floor: the iterate never stops at 2.3e-16, there is no integer iterate count, and hence no
 * off-by-one. The band edges W and OFFSET are set by the ratio EPS_FP/PENULT ~ 1.58 of TWO machine-precision
 * constants; neither has a counterpart in the continuous dynamic. So D1 shows the band is anchored to
 * representation parameters, which is exactly what a fidelity certificate must sever.
 *
 * DEMONSTRATION D2 -- THE BAND SITS 15-25 DECADES ABOVE ANY VERIFIED ZERO HEIGHT
 * -----------------------------------------------------------------------------
 * The Platt-Trudgian verified-zero height that binds Lambda <= 0.2 reaches N ~ 3e12 (log10 ~ 12.48). The reentry
 * (10^27.08) is ~14.6 decades ABOVE it; the exit (10^37.17) is ~24.7 decades above it. The band is therefore
 * wholly inside the EXTRAPOLATED regime: no verified arithmetic datum exists within ~15 decades of it, so the
 * true collapse dynamic there is not merely un-modelled but presently UNMEASURABLE. Any statement that the band
 * is real in the true dynamic would be an extrapolation of the surrogate by ~15-25 decades with no anchor.
 *
 * WHAT A SURROGATE-FIDELITY CERTIFICATE WOULD NEED (ENUMERATED)
 * ------------------------------------------------------------
 *   R1 FLOOR-INDEPENDENCE. Show the band-defining features survive removal of the machine-epsilon floor EPS_FP
 *      (and the PENULT witness) -- i.e. re-express the phenomenon in a floor-free continuum limit, or prove the
 *      true dynamic has an intrinsic floor at EPS_FP. D1 shows this is the binding requirement: without it the
 *      band moves ~12 decades per factor-2 in a representation constant.
 *   R2 SINGLE-RATE / LINEARIZATION FIDELITY. Certify that the single contraction rate r, measured by finite
 *      difference AT the fixed point, governs the TRUE approach out to seeds ~10^37 -- i.e. bound the nonlinear
 *      remainder of the true map uniformly across the band. The log law is only an asymptotic-near-fixed-point
 *      model, and imp-34862 already found a TWO-rate law, so single-rate fidelity is not automatic.
 *   R3 HEIGHT-MAP FIDELITY. Certify that g = K log T0(N), with K = (C_C/E_TRUNC_PT)^2 and the RvM inverse T0(N),
 *      models the true E_flow height at N ~ 10^37, where the imp-3220/imp-3406 truncation constants and the
 *      C_C = (1/8) sqrt(3 pi) ansatz are pinned near the ~3e12 anchor, NOT at 10^37.
 *   R4 INDEPENDENT-MODEL AGREEMENT. Reproduce the reentry/exit from an INDEPENDENT (non-log-law) model of the
 *      collapse, or from verified zero data at height ~10^27-10^37 -- which does not exist (D2). Absent that, the
 *      band has exactly one witness (the surrogate) and cannot be cross-validated.
 *
 * THE ASSESSMENT VERDICT
 * ----------------------
 * The reentry band is, on present evidence, a feature of the ANALYTIC SURROGATE, not an established feature of
 * the true collapse dynamic. imp-35174 removed the possibility that it is a double-ROUNDING artifact of computing
 * the surrogate; it did not, and could not, remove the possibility that the surrogate MODEL is unfaithful. The
 * decisive obstruction is R1/D1 (the band is pinned to a machine-epsilon floor absent from the continuum) sharp-
 * ened by R4/D2 (no verified datum within ~15 decades). A fidelity certificate needs all four of R1-R4; R1 and R4
 * are not merely open but appear presently UNREACHABLE (R4 would require verified zero height at ~10^27-10^37, ~15
 * decades beyond the ~3e12 frontier). So imp-35111a / imp-35174a stay OPEN, re-pointed as imp-35243a. This does
 * not weaken imp-35174 (its arithmetic result stands); it bounds its scope.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * An ASSESSMENT of surrogate-vs-true fidelity for the imp-34997/imp-35111 reentry band, with two concrete
 * demonstrations (floor-sensitivity, extrapolation gap) computed on the inherited imp-3220/imp-3406 surrogate.
 * It discharges NOTHING: imp-35111a / imp-35174a / imp-34997a stay OPEN as re-pointed imp-35243a. MEASUREMENT /
 * ASSESSMENT ONLY; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no
 * bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35174-reentry-band-precision-certification (discharged the ARITHMETIC half; re-pointed imp-35174a)
 * @see imp-35111-off-by-one-reentry-band-width (parent: band width/exit on double; named sub-gap imp-35111a)
 * @see imp-34997-iters-to-floor-tail-grid-refinement (locates the 10^27.08 reentry; sub-gap imp-34997a)
 * @see imp-34862-iters-to-floor-two-rate-law (a TWO-rate law -- bears on R2 single-rate fidelity)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see imp-35263-reentry-band-eps-floor-sweep (LATER: shows the D1 ~11.99-decade figure is the reentry-edge LOCAL
 *   rate, not a band-wide constant -- the true EPS_FP-factor-2 slide grows to ~18.95 decades at the exit edge)
 * @see imp-35332-reentry-band-drift-analytic-derivation (LATER: analytically derives DRIFT_PER_DECADE and shows it
 *   is NOT constant across the band -- it decreases monotonically from 0.0186273 at reentry to 0.0118306 at exit)
 *
 * HONESTY-AUDIT CAVEAT (imp-35385, added post hoc). The DRIFT_PER_DECADE = 0.0187 constant used below for D1/D1b
 * is a LOCAL value at the reentry edge (N ~ 10^27.08), not a band-wide constant. imp-35332 (filed after this
 * module) derives the drift analytically and shows it decreases ~1.574x across the band to 0.0118306 at the
 * exit edge; imp-35263 (also later) confirms the ~11.99-decade D1 figure is exactly the reentry-edge local rate
 * and that the true EPS_FP-factor-2 slide is NOT constant (it grows to ~18.95 decades at the exit edge). This
 * does not change the D1/D1b verdict at the reentry edge (still correct there), and imp-35243a stays OPEN; it
 * only bounds the D1 headline figure to the reentry edge rather than the whole band.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34997/35109/35111/35174)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)

// The imp-35174 DOUBLE surrogate, reproduced VERBATIM (used only to compute the fidelity demonstrations).
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // ~3280294351.65 (bit-identical to imp-34997/35109/35111/35174)
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// Inherited band landmarks (from imp-35174, double-double certified) and the PT verified-height anchor.
const DRIFT_PER_DECADE = 0.0187; // ceil-phase upward drift (imp-34997/35109)
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const PT_VERIFIED_HEIGHT_LOG10 = Math.log10(3e12); // ~12.48 -- highest verified zero height binding Lambda<=0.2

// The off-by-one window: both its width and (via the floor) its POSITION are set by machine-precision constants.
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408 (window width) -- pure ratio of two eps-scale consts
const EPS_OVER_PENULT = EPS_FP / PENULT; // ~1.5822 (both ~machine-epsilon)

// DEMONSTRATION D1: the machine-epsilon floor EPS_FP enters xArg as a pure additive phase shift, so a factor-2
// change relocates the whole band. The shift is exact and periodicity-independent (no bisection saturation).
const PHASE_SHIFT_PER_FLOOR_HALVING = Math.log(2) / LN_INV_R; // ~0.22419 phase units
const DECADE_SHIFT_PER_FLOOR_HALVING = PHASE_SHIFT_PER_FLOOR_HALVING / DRIFT_PER_DECADE; // ~11.99 decades in N

// DEMONSTRATION D1b (imp-35335): the D1 floor-sensitivity slope rests on R_CONTRACT from a SINGLE central-difference
// step h=1 in gPrimeAtStep. Re-measure R_CONTRACT, LN_INV_R, the phase shift log(2)/ln(1/r) and the decade shift on a
// stencil ladder h in {0.25, 0.5, 1, 2, 4} to confirm the ~11.99-decade figure is stencil-independent, not an artifact
// of the h=1 choice. Measured (this file, node): R_CONTRACT spread ~1.0e-5 relative; decade shift 11.98896-11.98900.
const STENCIL_LADDER = [0.25, 0.5, 1, 2, 4].map((h) => {
  const r = Math.abs(gPrimeAtStep(h));
  const lnInvR = Math.log(1 / r);
  const phase = Math.log(2) / lnInvR;
  return { h, r_contract: r, ln_inv_r: lnInvR, phase_shift: phase, decade_shift: phase / DRIFT_PER_DECADE };
});
const STENCIL_R_MAX_REL_DEV = Math.max(
  ...STENCIL_LADDER.map((s) => Math.abs(s.r_contract - R_CONTRACT) / R_CONTRACT),
); // ~1.05e-5 -- R_CONTRACT is stencil-independent to 5 significant figures
const STENCIL_DECADE_SHIFT_SPREAD =
  Math.max(...STENCIL_LADDER.map((s) => s.decade_shift)) - Math.min(...STENCIL_LADDER.map((s) => s.decade_shift)); // ~4e-5

// DEMONSTRATION D2: how far the band sits above the highest verified zero height (~3e12).
const REENTRY_DECADES_ABOVE_VERIFIED = REENTRY_EXP - PT_VERIFIED_HEIGHT_LOG10; // ~14.6
const EXIT_DECADES_ABOVE_VERIFIED = EXIT_EXP - PT_VERIFIED_HEIGHT_LOG10; // ~24.7

// The four requirements a surrogate-fidelity certificate would need (enumerated, with binding status).
const FIDELITY_CERTIFICATE_REQUIREMENTS = [
  {
    id: 'R1',
    name: 'Floor-independence',
    need: 'Re-express the band in a floor-free continuum limit, or prove the true dynamic has an intrinsic floor at EPS_FP.',
    status: 'BINDING / OPEN -- D1 shows the band moves ~12 decades per factor-2 in the machine-epsilon floor.',
  },
  {
    id: 'R2',
    name: 'Single-rate / linearization fidelity',
    need: 'Bound the nonlinear remainder of the true map uniformly across the band so the single fixed-point rate r governs the true approach to ~10^37.',
    status: 'OPEN -- log law is asymptotic-near-fixed-point; imp-34862 found a TWO-rate law.',
  },
  {
    id: 'R3',
    name: 'Height-map fidelity',
    need: 'Certify g = K log T0(N) models the true E_flow height at ~10^37, where the imp-3220/imp-3406 constants and the C_C ansatz are pinned near ~3e12, not at 10^37.',
    status: 'OPEN -- inherits the imp-3220/imp-3406 surrogate scope.',
  },
  {
    id: 'R4',
    name: 'Independent-model agreement',
    need: 'Reproduce the reentry/exit from an independent (non-log-law) model or from verified zero data at height ~10^27-10^37.',
    status: 'BINDING / PRESENTLY UNREACHABLE -- D2: no verified datum within ~15 decades of the band.',
  },
];

export const IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT = {
  id: 'imp-35243',
  proofSection: 'S-frontier',
  question:
    'imp-35174 discharged the ARITHMETIC half of imp-35111a (the reentry-band edges survive double-vs-double-' +
    'double recomputation) but left the SURROGATE-FIDELITY half open: does the analytic iters-to-floor MAP ' +
    'faithfully model the TRUE collapse dynamic at N ~ 10^37? Enumerate what a surrogate-fidelity certificate ' +
    'needs, and assess whether the reentry band is a real feature of the true dynamic or only of the surrogate.',
  constants: {
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    off_by_one_window_width_offset: +OFFSET.toPrecision(6), // ~0.148408 = log(EPS_FP/PENULT)/ln(1/r)
    eps_fp_over_penult_ratio: +EPS_OVER_PENULT.toPrecision(6), // ~1.5822 (both machine-epsilon-scale)
    drift_per_decade: DRIFT_PER_DECADE, // 0.0187
  },
  demonstration_D1_floor_sensitivity: {
    phase_shift_per_floor_halving: +PHASE_SHIFT_PER_FLOOR_HALVING.toPrecision(6), // ~0.224194 phase units
    decade_shift_per_floor_halving: +DECADE_SHIFT_PER_FLOOR_HALVING.toPrecision(6), // ~11.989 decades in N
    reading:
      'EPS_FP enters xArg = log(collapseDist/EPS_FP)/ln(1/r) as a pure additive phase shift log(2)/ln(1/r) per ' +
      'factor-2 change, which at the ~0.0187/decade drift relocates the whole band by ~12 decades in N. The ' +
      'true infinite-precision continuum has no such floor, no integer iterate count, and hence no off-by-one.',
  },
  demonstration_D1b_stencil_ladder: {
    r_contract_h1: +R_CONTRACT.toPrecision(9), // ~0.0454235 (the imp-35243 single-stencil value)
    ladder: STENCIL_LADDER.map((s) => ({
      h: s.h,
      r_contract: +s.r_contract.toPrecision(9),
      decade_shift: +s.decade_shift.toPrecision(9),
    })),
    r_max_rel_dev: +STENCIL_R_MAX_REL_DEV.toPrecision(3), // ~1.05e-5
    decade_shift_spread: +STENCIL_DECADE_SHIFT_SPREAD.toPrecision(3), // ~4e-5
    reading:
      'R_CONTRACT and the derived phase shift log(2)/ln(1/r) ~ 0.2242 and the ~11.99-decade floor-sensitivity are ' +
      'stencil-INDEPENDENT: across central-difference steps h in {0.25, 0.5, 1, 2, 4}, R_CONTRACT agrees to ~1e-5 ' +
      'relative and the decade shift stays 11.98896-11.98900. The D1 slope is not an artifact of the h=1 stencil.',
  },
  demonstration_D2_extrapolation_gap: {
    pt_verified_height_log10: +PT_VERIFIED_HEIGHT_LOG10.toPrecision(5), // ~12.48 (N ~ 3e12)
    reentry_decades_above_verified: +REENTRY_DECADES_ABOVE_VERIFIED.toPrecision(4), // ~14.6
    exit_decades_above_verified: +EXIT_DECADES_ABOVE_VERIFIED.toPrecision(4), // ~24.7
    reading:
      'The band sits ~14.6-24.7 decades above the highest verified zero height (~3e12) that binds Lambda<=0.2, ' +
      'so the true collapse dynamic there is presently UNMEASURABLE and the band cannot be cross-validated.',
  },
  fidelity_certificate_requirements: FIDELITY_CERTIFICATE_REQUIREMENTS,
  band_is_real_in_true_dynamic:
    'NOT ESTABLISHED. On present evidence the reentry band is a feature of the discrete, single-rate, machine-' +
    'epsilon-floored ANALYTIC SURROGATE, not of the true continuous collapse. imp-35174 ruled out a double-' +
    'ROUNDING artifact of computing the surrogate; it did not rule out an unfaithful surrogate MODEL. The ' +
    'binding obstructions are R1 (D1: band pinned to a machine-epsilon floor absent from the continuum) and R4 ' +
    '(D2: no verified datum within ~15 decades). Both appear presently UNREACHABLE.',
  finding:
    'Assessment of the surrogate-fidelity half of imp-35111a for the imp-34997/imp-35111 reentry band. Two ' +
    'concrete demonstrations on the inherited surrogate: (D1) a factor-2 change in the machine-epsilon floor ' +
    'EPS_FP slides the entire band by ~11.99 decades in N (the floor enters xArg as a pure additive phase shift ' +
    'log(2)/ln(1/r) ~ 0.2242 at the ~0.0187/decade drift), and the window width itself is log(EPS_FP/PENULT)/' +
    'ln(1/r) -- a ratio of two machine-precision constants absent from the continuum; (D2) the band (10^27.08 - ' +
    '10^37.17) sits ~14.6-24.7 decades above the highest verified zero height ~3e12, so the true dynamic there ' +
    'is unmeasurable. A fidelity certificate needs all four of R1 floor-independence, R2 single-rate/lineariza' +
    'tion fidelity (imp-34862 found a two-rate law), R3 height-map fidelity, R4 independent-model agreement; R1 ' +
    'and R4 are the binding, presently-unreachable ones. VERDICT: the band is NOT established as a feature of the ' +
    'true dynamic -- it is a feature of the analytic surrogate. imp-35174\'s arithmetic result stands; this bounds ' +
    'its scope. imp-35111a / imp-35174a / imp-34997a stay OPEN as re-pointed sub-gap imp-35243a.',
  residual_sub_gap_imp_35243a:
    'The surrogate-fidelity half stays OPEN. imp-35243a = certify surrogate-vs-true-dynamics fidelity for the ' +
    'reentry band, i.e. discharge R1 (floor-independence) and R4 (independent-model / verified-height agreement) ' +
    'in addition to R2/R3. R4 appears presently unreachable (needs verified zero height at ~10^27-10^37, ~15 ' +
    'decades above the ~3e12 frontier). It inherits, and does not discharge, imp-35111a / imp-35174a / ' +
    'imp-34997a / imp-34951a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (accuracy, frontier-direction, NOT an RH bound). imp-35174 discharged only the ARITHMETIC half ' +
    'of imp-35111a (the reentry-band edges survive double-double recomputation). This module assesses the ' +
    'SURROGATE-FIDELITY half and finds the reentry band is NOT established as a feature of the true collapse ' +
    'dynamic: (D1) a factor-2 change in the machine-epsilon floor EPS_FP relocates the whole band ~11.99 decades ' +
    'in N and the window width is a ratio of two machine-precision constants -- neither exists in the true ' +
    'infinite-precision continuum; (D2) the band sits ~14.6-24.7 decades above any verified zero height (~3e12), ' +
    'so the true dynamic there is unmeasurable. A fidelity certificate needs R1 floor-independence, R2 single-' +
    'rate/linearization fidelity (imp-34862 found a two-rate law), R3 height-map fidelity and R4 independent-' +
    'model agreement; R1/R4 are binding and presently unreachable. So imp-35111a / imp-35174a stay OPEN, re-' +
    'pointed as imp-35243a; imp-35174\'s arithmetic result is unaffected, only its scope is bounded. MEASUREMENT / ' +
    'ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/' +
    'imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35174 (discharged the arithmetic half; re-pointed imp-35174a); imp-35111 (parent: band width/exit on ' +
    'double; sub-gap imp-35111a); imp-34997 (locates the 10^27.08 reentry; sub-gap imp-34997a); imp-34862 (two-' +
    'rate law, bears on R2); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
  drift_not_constant_caveat:
    'HONESTY-AUDIT CAVEAT (imp-35385). DRIFT_PER_DECADE = 0.0187 above is a LOCAL value at the reentry edge, not ' +
    'a band-wide constant. imp-35332 (filed after this module) analytically derives the drift and shows it ' +
    'decreases monotonically from 0.0186273 at reentry to 0.0118306 at exit (~1.574x); imp-35263 (also later) ' +
    'confirms the D1 ~11.99-decade figure is exactly the reentry-edge local rate and that the true EPS_FP-' +
    'factor-2 slide grows to ~18.95 decades at the exit edge -- it is NOT constant across the band. This does ' +
    'not change the D1/D1b verdict AT the reentry edge; it bounds the D1 headline figure to that edge. ' +
    'imp-35243a stays OPEN.',
};

export const IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT_ASSERTIONS = [
  {
    // D1: the machine-epsilon floor relocates the band by many decades -- the surrogate-fidelity crux.
    id: 'imp35243-D1-floor-relocates-band',
    description: 'a factor-2 change in EPS_FP shifts the band ~12 decades in N (phase shift log(2)/ln(1/r) at the drift)',
    holds: () =>
      Math.abs(PHASE_SHIFT_PER_FLOOR_HALVING - Math.log(2) / LN_INV_R) < 1e-12 &&
      DECADE_SHIFT_PER_FLOOR_HALVING > 8 &&
      DECADE_SHIFT_PER_FLOOR_HALVING < 16 &&
      Math.abs(DECADE_SHIFT_PER_FLOOR_HALVING - 11.989) < 1e-2,
  },
  {
    // The window width is a ratio of two machine-precision constants (no continuum counterpart).
    id: 'imp35243-window-width-is-eps-scale',
    description: 'OFFSET = log(EPS_FP/PENULT)/ln(1/r) with EPS_FP/PENULT ~ 1.58, both machine-epsilon-scale',
    holds: () =>
      Math.abs(OFFSET - Math.log(EPS_OVER_PENULT) / LN_INV_R) < 1e-12 &&
      EPS_OVER_PENULT > 1 &&
      EPS_OVER_PENULT < 2 &&
      Math.abs(OFFSET - 0.148408) < 1e-5,
  },
  {
    // D1b (imp-35335): the D1 floor-sensitivity slope is stencil-independent (not an h=1 artifact).
    id: 'imp35243-D1b-stencil-independent-slope',
    description: 'R_CONTRACT and the ~11.99-decade shift agree across h in {0.25,0.5,1,2,4} (stencil-independent)',
    holds: () =>
      STENCIL_LADDER.length === 5 &&
      STENCIL_R_MAX_REL_DEV < 1e-4 &&
      STENCIL_DECADE_SHIFT_SPREAD < 1e-3 &&
      STENCIL_LADDER.every((s) => Math.abs(s.decade_shift - 11.989) < 1e-2),
  },
  {
    // D2: the band is 15-25 decades above any verified zero height -- unmeasurable in the true dynamic.
    id: 'imp35243-D2-band-far-above-verified-height',
    description: 'reentry ~14.6 and exit ~24.7 decades above the ~3e12 verified-height anchor',
    holds: () =>
      REENTRY_DECADES_ABOVE_VERIFIED > 10 &&
      EXIT_DECADES_ABOVE_VERIFIED > 20 &&
      EXIT_DECADES_ABOVE_VERIFIED > REENTRY_DECADES_ABOVE_VERIFIED &&
      Math.abs(REENTRY_DECADES_ABOVE_VERIFIED - 14.6) < 0.1 &&
      Math.abs(EXIT_DECADES_ABOVE_VERIFIED - 24.7) < 0.1,
  },
  {
    // The certificate requirements are enumerated with the two binding ones flagged.
    id: 'imp35243-certificate-requirements-enumerated',
    description: 'four requirements R1-R4 enumerated; R1 and R4 flagged BINDING',
    holds: () =>
      FIDELITY_CERTIFICATE_REQUIREMENTS.length === 4 &&
      FIDELITY_CERTIFICATE_REQUIREMENTS.map((r) => r.id).join(',') === 'R1,R2,R3,R4' &&
      /BINDING/.test(FIDELITY_CERTIFICATE_REQUIREMENTS[0].status) &&
      /BINDING/.test(FIDELITY_CERTIFICATE_REQUIREMENTS[3].status),
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap stays OPEN and named.
    id: 'imp35243-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, band NOT established in true dynamic, no QED, no refereed bound is changed, sub-gap named',
    holds: () =>
      IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.isRigorous === false &&
      /NOT ESTABLISHED/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.band_is_real_in_true_dynamic) &&
      /NO QED/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.verdict) &&
      /imp-35111a/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.residual_sub_gap_imp_35243a) &&
      /imp-35243a/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.residual_sub_gap_imp_35243a),
  },
  {
    // imp-35385 honesty audit: DRIFT_PER_DECADE is flagged as a local (not band-wide) value, cross-referencing
    // the later imp-35332 (analytic non-constancy) and imp-35263 (D1 figure is the reentry-edge local rate).
    id: 'imp35243-drift-not-constant-caveat-present',
    description: 'the drift_not_constant_caveat field cross-references imp-35332 and imp-35263 and keeps imp-35243a OPEN',
    holds: () =>
      /imp-35332/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.drift_not_constant_caveat) &&
      /imp-35263/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.drift_not_constant_caveat) &&
      /NOT constant/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.drift_not_constant_caveat) &&
      /imp-35243a stays OPEN/.test(IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT.drift_not_constant_caveat),
  },
];

for (const a of IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35243-reentry-band-surrogate-fidelity-assessment assertion failed: ${a.id}`);
  }
}
