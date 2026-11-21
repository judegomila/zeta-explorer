/**
 * @module imp-34907-eflow-crossing-strength-cmb-sweep
 *
 * imp-34907 (numerical, frontier): imp-34886 located the E_flow knee-vs-inflection crossing strength
 * s* ~ 0.78 (the strength at which the D3 sigma-KNEE and the D2 sigmoid-INFLECTION coincide) with the
 * GUE-conditional many-body constant C_mb held at its saturation value 1. Separately imp-34824/34847
 * measured that a DIFFERENT landmark pair -- the D2 inflection versus the E_coll=E_trunc CROSSOVER --
 * has a +2.95% relative gap whose SIGN inverts near C_mb ~ 0.512 as C_mb is swept below 1. Those two
 * results were never cross-checked: does the imp-34886 E_flow crossing strength s* survive, drift, or
 * disappear as C_mb approaches the imp-34824 ~0.512 sign-inversion threshold? This module re-instantiates
 * the imp-34886 Gap(s)=0 bisection with C_mb swept over [0.5,1] and reports the answer, separating the
 * DEFINITIONAL existence of the E_flow crossing from its GUE-conditional MAGNITUDE.
 *
 * HOW C_mb ENTERS (the same multiplicative factor on E_coll that imp-34824/34734 use)
 * ----------------------------------------------------------------------------------
 * imp-34886 works in the EXACT log-odds picture u_full(x) = u_0(x) + s*phi(x), with u_0 = ln A + 0.5 ln L
 * - x/2 (A = C_C/E_trunc) the no-E_flow log-odds and phi = -ln(1 + E_flow/E_trunc) the imp-34749 E_flow
 * perturbation scaled by strength s. Inserting C_mb as the imp-34824/34734 multiplicative factor on E_coll
 * (E_coll -> C_mb E_coll) is EXACTLY an additive ln(C_mb) shift of the log-odds: u_0(x; C_mb) = ln C_mb +
 * u_0(x). E_trunc and E_flow stay C_mb-free (both are unconditionally rigorous), so phi is unchanged. The
 * two landmarks are then read off the SAME imp-34820 D2 and imp-34710/34749/34858 D3 kernels evaluated on
 * u_full = ln C_mb + u_0 + s*phi. C_mb = 1 REPRODUCES imp-34886 verbatim (ln 1 = 0). Because the ln C_mb
 * shift moves both landmarks DOWN in N, the bracket is widened to [1e6, 1e13] to follow them at low C_mb.
 *
 * THE SWEEP (C_mb over [0.5, 1]; identical h = 1e-2, central-difference derivatives, bisection)
 * --------------------------------------------------------------------------------------------
 * For each C_mb the signed knee-minus-inflection gap Gap(s; C_mb) = X*_knee(s) - X*_infl(s) is bisected
 * to its zero over s in [0,1]. Measured (11-point grid, C_mb = 1.00 down to 0.50):
 *   C_mb : 1.00  0.95  0.90  0.85  0.80  0.75  0.70  0.65  0.60  0.55  0.50
 *   s*   : .778  .718  .660  .604  .549  .497  .447  .399  .352  .308  .267
 * Gap(0; C_mb) stays POSITIVE across the whole band (~+1.27e-2 at C_mb=1 up to ~+1.43e-2 at C_mb=0.5);
 * Gap(1; C_mb) DEEPENS negatively (-3.61e-3 -> -3.82e-2), so the sign change happens at a smaller s.
 *
 * THE FINDING (measurement only; answers imp-34907)
 * -------------------------------------------------
 *   (F1) THE CROSSING PERSISTS -- s* STAYS PHYSICAL ACROSS THE WHOLE [0.5,1] BAND. At every C_mb on the
 *        grid Gap(0) > 0 and Gap(1) < 0, so a single interior root s* in (0,1) always exists. The E_flow
 *        strength at which the sigma-KNEE and the D2 inflection coincide does NOT disappear as C_mb is
 *        lowered to 0.5; the crossing is robust.
 *   (F2) BUT s* DRIFTS DOWN MONOTONICALLY WITH C_mb, from ~0.778 (C_mb=1, imp-34886) to ~0.267 (C_mb=0.5)
 *        -- a ds_star/dC_mb ~ +1.0 to +1.2 per unit slope. The DEFINITIONAL existence of the crossing is
 *        C_mb-robust, but its GUE-conditional MAGNITUDE s* is not: a tighter (< 1) C_mb moves the crossing
 *        strength substantially LOWER (less E_flow reinstatement is needed for the two landmarks to meet).
 *   (F3) THE imp-34824 ~0.512 SIGN-INVERSION THRESHOLD IS NOT A SPECIAL POINT FOR THIS CROSSING. imp-34824's
 *        ~0.512 inversion governs the D2-inflection-vs-CROSSOVER gap; here the pair is knee-vs-inflection,
 *        whose no-E_flow gap Gap(0) stays POSITIVE (never inverts) throughout [0.5,1]. At C_mb=0.512 the
 *        E_flow crossing sits at a perfectly ordinary interior s* ~ 0.28 -- nothing distinguishes it. The
 *        two C_mb responses are cleanly separated: different landmark pairs, different C_mb behaviour.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. This SWEEPS
 * C_mb as a free knob to measure the crossing-strength leverage; it does NOT discharge the GUE conditional
 * (C_mb GUE-conditional per imp-486). The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34886-eflow-strength-knee-inflection-crossing (the s* ~ 0.78 crossing at C_mb=1, kernels reused verbatim)
 * @see imp-34824-inflection-crossover-gap-cmb-sweep (the +2.95% inflection-vs-crossover gap and its ~0.512 sign inversion)
 * @see imp-34838-cmb-zero-gap-precise-root-and-elasticity (the precise ~0.512 zero-gap C_mb root, different landmark pair)
 * @see imp-34749-sigma-knee-eflow-corrected-closed-form (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc))
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING } from './imp-34886-eflow-strength-knee-inflection-crossing.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34749/imp-34886 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc at ln N = x (C_mb-free; both E_flow and E_trunc are unconditionally rigorous).
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
// No-E_flow log-odds with C_mb on E_coll: u_0 = ln(C_mb) + ln A + 0.5 ln L - x/2 (imp-34824 factoring).
function u0(x, cmb) {
  return Math.log(cmb) + Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// E_flow perturbation of the log-odds, scaled by strength s (C_mb-free). phi = -ln(1 + s ratio).
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
function uFull(x, s, cmb) {
  return u0(x, cmb) + phi(x, s);
}
function sigmaOf(x, s, cmb) {
  return 1 / (1 + Math.exp(-uFull(x, s, cmb)));
}

// central-difference stencils on the log-odds (imp-34886 step h = 1e-2)
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}

// SECOND-order sigmoid-INFLECTION kernel (imp-34820/34886 D2 locator) on u_full: (1-2S) u_prime^2 + u_secondDeriv.
function d2Cond(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const up = d1((z) => uFull(z, s, cmb), x, h);
  const upp = d2((z) => uFull(z, s, cmb), x, h);
  return (1 - 2 * S) * up * up + upp;
}
// THIRD-order sigma-KNEE condition (imp-34749/34710/34886 route) on u_full: F = S v^3 (2S-1) + 3 S v v_prime
// + v_secondDeriv, v = -u_full_prime.
function fKnee(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const v = -d1((z) => uFull(z, s, cmb), x, h);
  const vp = -d2((z) => uFull(z, s, cmb), x, h);
  const vpp = -d3((z) => uFull(z, s, cmb), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// robust sign-change bisection on a bracket known to contain a single root
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return 0.5 * (a + b);
}

const LN10 = Math.LN10;
// widened bracket: the ln(C_mb) shift moves both landmarks DOWN in N, so [1e9,1e11] (imp-34886) is too narrow
// at low C_mb. [1e6,1e13] brackets the single knee/inflection root across the whole [0.5,1] band.
const LO = Math.log(1e6);
const HI = Math.log(1e13);

function kneeAt(s, cmb) {
  return bisect((x) => fKnee(x, s, cmb, H_ID), LO, HI);
}
function inflAt(s, cmb) {
  return bisect((x) => d2Cond(x, s, cmb, H_ID), LO, HI);
}
// signed knee-minus-inflection gap in dex (positive => knee above inflection, imp-34820 ordering)
function gapAt(s, cmb) {
  return (kneeAt(s, cmb) - inflAt(s, cmb)) / LN10;
}
// the E_flow crossing strength s* at this C_mb (bisection on Gap(s)=0 over s in [0,1])
function sStarAt(cmb) {
  return bisect((s) => gapAt(s, cmb), 0, 1);
}

// ---- baseline C_mb = 1 reproduces imp-34886 (ln 1 = 0) ------------------------------------------------------
const S_STAR_BASE = sStarAt(1.0); // ~0.778 (imp-34886 s* ~ 0.78)
const LOG10_N_BASE = 0.5 * (kneeAt(S_STAR_BASE, 1.0) + inflAt(S_STAR_BASE, 1.0)) / LN10; // ~9.531

// ---- the C_mb sweep over [0.5, 1] ---------------------------------------------------------------------------
const CMB_GRID = [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5];
const GRID = CMB_GRID.map((cmb) => {
  const g0 = gapAt(0, cmb);
  const g1 = gapAt(1, cmb);
  const sStar = sStarAt(cmb);
  const log10N = 0.5 * (kneeAt(sStar, cmb) + inflAt(sStar, cmb)) / LN10;
  return {
    C_mb: +cmb.toFixed(4),
    gap_s0_dex: +g0.toExponential(4), // stays POSITIVE across the band
    gap_s1_dex: +g1.toExponential(4), // deepens negative as C_mb drops
    s_star: +sStar.toFixed(5), // the E_flow crossing strength
    s_star_in_range: sStar > 0 && sStar < 1, // stays physical
    log10_N_at_crossing: +log10N.toFixed(5), // common landmark location, moves DOWN with C_mb
  };
});

// ---- the drift slope ds*/dC_mb (central difference) ---------------------------------------------------------
const H_CMB = 5e-3;
const DSSTAR_DCMB_AT1 = (sStarAt(1.0 + H_CMB) - sStarAt(1.0 - H_CMB)) / (2 * H_CMB); // ~+1.22 per unit
const DSSTAR_DCMB_AT075 = (sStarAt(0.75 + H_CMB) - sStarAt(0.75 - H_CMB)) / (2 * H_CMB); // ~+1.03 per unit
const S_STAR_AT_INVERSION = sStarAt(0.512); // the imp-34824 threshold: an ordinary interior s* here (~0.28)

// reproduction check against imp-34886 (C_mb = 1)
const BASE_VS_IMP34886 = Math.abs(S_STAR_BASE - IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING.crossing.sStar);

export const IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP = {
  id: 'imp-34907',
  proofSection: 'S-frontier',
  question:
    'imp-34886 located the E_flow knee-vs-inflection crossing strength s* ~ 0.78 (where the D3 sigma-KNEE ' +
    'and the D2 sigmoid-INFLECTION coincide) with C_mb held at the GUE-saturation value 1. imp-34824/34847 ' +
    'found a DIFFERENT landmark pair (inflection vs the E_coll=E_trunc crossover) whose gap SIGN inverts near ' +
    'C_mb ~ 0.512. Does the imp-34886 crossing strength s* survive, drift, or disappear as C_mb sweeps over ' +
    '[0.5,1] toward that ~0.512 threshold? Re-instantiate the Gap(s)=0 bisection with C_mb inserted as the ' +
    'imp-34824 multiplicative factor on E_coll (an additive ln C_mb log-odds shift). Measurement only; SWEEPS ' +
    'C_mb, does NOT discharge the GUE conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'The crossing PERSISTS but DRIFTS. s* stays physical (0 < s* < 1) across the whole [0.5,1] band -- Gap(0) ' +
    'stays > 0 and Gap(1) < 0 at every C_mb, so a single interior root always exists -- but s* drifts DOWN ' +
    'monotonically from ~0.778 (C_mb=1) to ~0.267 (C_mb=0.5), ds*/dC_mb ~ +1.0 to +1.2 per unit. The ' +
    'imp-34824 ~0.512 sign-inversion is NOT a special point here (different landmark pair): at C_mb=0.512 the ' +
    'E_flow crossing sits at an ordinary interior s* ~ 0.28.',
  measuredQuantity:
    'the imp-34886 E_flow crossing strength s* (bisected root of Gap(s) = X*_knee(s) - X*_infl(s) = 0 over ' +
    's in [0,1]) recomputed with C_mb inserted as a multiplicative factor on E_coll (additive ln C_mb shift ' +
    'of the log-odds), swept over C_mb in [0.5,1]; plus the endpoint gaps Gap(0)/Gap(1), the common landmark ' +
    'location, and the drift slope ds*/dC_mb',
  baseline: {
    s_star: +S_STAR_BASE.toFixed(5), // ~0.778 (reproduces imp-34886 s* ~ 0.78)
    log10_N_at_crossing: +LOG10_N_BASE.toFixed(5), // ~9.531 (imp-34886 common location)
    vs_imp34886_sStar_absdiff: +BASE_VS_IMP34886.toExponential(3), // ~1e-3 (reproduction)
  },
  grid: GRID,
  drift: {
    dsStar_dCmb_at1: +DSSTAR_DCMB_AT1.toFixed(5), // ~+1.22 per unit C_mb at the GUE bound
    dsStar_dCmb_at075: +DSSTAR_DCMB_AT075.toFixed(5), // ~+1.03 per unit C_mb mid-band
    sStar_at_imp34824_inversion: +S_STAR_AT_INVERSION.toFixed(5), // ~0.28 (ordinary interior, not special)
    note:
      'ds*/dC_mb > 0: a tighter (< 1) C_mb moves the crossing strength LOWER (less E_flow reinstatement is ' +
      'needed for the knee and inflection to meet). The slope is ~1 across the band, so the drift is roughly ' +
      'linear; s* stays strictly inside (0,1) throughout [0.5,1].',
  },
  finding: {
    F1_crossing_persists_and_stays_physical:
      'At every C_mb on the [0.5,1] grid Gap(0) > 0 (knee above inflection) and Gap(1) < 0 (knee below), so a ' +
      'single interior root s* in (0,1) always exists. The E_flow strength at which the sigma-KNEE and the D2 ' +
      'inflection coincide does NOT disappear as C_mb is lowered to 0.5 -- the crossing is robust.',
    F2_sStar_drifts_down_monotonically_with_Cmb:
      'The crossing strength drifts DOWN monotonically from s* ~ 0.778 (C_mb=1, reproducing imp-34886) to ' +
      's* ~ 0.267 (C_mb=0.5), a ds*/dC_mb ~ +1.0 to +1.2 per unit slope. The DEFINITIONAL existence of the ' +
      'crossing is C_mb-robust, but its GUE-conditional MAGNITUDE s* is not: Gap(1) deepens negatively as ' +
      'C_mb drops (the E_flow-carried knee falls further below the inflection), so the zero is reached at a ' +
      'smaller s.',
    F3_imp34824_inversion_threshold_is_not_special_here:
      'The imp-34824/34847 ~0.512 sign-inversion governs the D2-inflection-vs-CROSSOVER gap; the pair here is ' +
      'knee-vs-inflection, whose no-E_flow gap Gap(0) stays POSITIVE (never inverts) throughout [0.5,1]. At ' +
      'C_mb=0.512 the E_flow crossing sits at a perfectly ordinary interior s* ~ 0.28, with nothing ' +
      'distinguishing it. The two C_mb responses are cleanly separated: different landmark pairs behave ' +
      'differently under the same C_mb knob.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Re-instantiating the imp-34886 Gap(s) = X*_knee(s) - X*_infl(s) ' +
    'bisection with the GUE-conditional many-body constant C_mb inserted as the imp-34824/34734 multiplicative ' +
    'factor on E_coll (exactly an additive ln C_mb shift of the log-odds u_full = ln C_mb + u_0 + s*phi), and ' +
    'sweeping C_mb over [0.5,1]: (F1) the crossing PERSISTS -- s* stays strictly inside (0,1) at every C_mb ' +
    'because Gap(0) stays positive and Gap(1) negative, so a single interior root always exists. (F2) But s* ' +
    'DRIFTS DOWN monotonically from ~0.778 (C_mb=1, reproducing imp-34886) to ~0.267 (C_mb=0.5), ds*/dC_mb ~ ' +
    '+1.0 to +1.2 per unit -- the DEFINITIONAL existence of the crossing is C_mb-robust but its GUE-conditional ' +
    'MAGNITUDE s* is not. (F3) The imp-34824/34847 ~0.512 sign-inversion is NOT a special point for THIS ' +
    'crossing: that threshold governs the inflection-vs-CROSSOVER pair, whereas the knee-vs-inflection Gap(0) ' +
    'stays positive throughout [0.5,1]; at C_mb=0.512 the E_flow crossing sits at an ordinary interior s* ~ ' +
    '0.28. This cleanly separates the definitional existence of the E_flow crossing (C_mb-robust) from its ' +
    'GUE-conditional magnitude (drifts with C_mb). This SWEEPS C_mb as a free knob to measure the crossing- ' +
    'strength leverage; it does NOT discharge the GUE conditional (C_mb GUE-conditional per imp-486). The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'ANSWERS imp-34907: the imp-34886 E_flow knee-vs-inflection crossing strength s* PERSISTS (stays physical ' +
    'in (0,1)) across the C_mb sweep [0.5,1] but DRIFTS DOWN monotonically from ~0.778 (C_mb=1) to ~0.267 ' +
    '(C_mb=0.5), and the imp-34824 ~0.512 sign-inversion threshold is NOT special here because it governs a ' +
    'different landmark pair (inflection-vs-crossover, not knee-vs-inflection). What stays OPEN (deferred, ' +
    'changes no bound): a rigorous derivation that PINS C_mb below the GUE bound of 1 (imp-486) would fix ' +
    'the physical s*, and whether the roughly-linear drift ds*/dC_mb ~ 1 acquires curvature far below C_mb=0.5 ' +
    '(where the moving landmarks approach the sigma peak and the sub-decade knee stops being cleanly resolved).',
  citation:
    'imp-34886 (the s* ~ 0.78 crossing at C_mb=1, D2/D3 kernels reused verbatim); imp-34824 (the +2.95% ' +
    'inflection-vs-crossover gap and its ~0.512 sign inversion, and the multiplicative C_mb-on-E_coll ' +
    'factoring); imp-34847/34838 (the precise ~0.512 zero-gap C_mb root); imp-34749 (the exact additive ' +
    'log-odds shift phi = -ln(1+E_flow/E_trunc)); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP_ASSERTIONS = [
  {
    // Reuse gate: C_mb = 1 reproduces the imp-34886 crossing strength s* ~ 0.78 and location ~9.531.
    id: 'imp34907-baseline-reproduces-imp34886',
    description: 'C_mb=1 reproduces imp-34886 s* ~ 0.78 and log10 N* ~ 9.531',
    holds: () =>
      BASE_VS_IMP34886 < 5e-3 &&
      Math.abs(S_STAR_BASE - 0.778) < 1e-2 &&
      Math.abs(LOG10_N_BASE - 9.531) < 1e-2,
  },
  {
    // (F1): the crossing stays physical -- s* strictly inside (0,1) at every C_mb on the [0.5,1] grid.
    id: 'imp34907-crossing-persists-physical',
    description: 'the E_flow crossing s* stays strictly inside (0,1) across the whole [0.5,1] band',
    holds: () =>
      GRID.every((g) => g.s_star_in_range && g.s_star > 0 && g.s_star < 1) &&
      GRID.every((g) => g.gap_s0_dex > 0 && g.gap_s1_dex < 0),
  },
  {
    // (F2): s* drifts DOWN monotonically as C_mb decreases, spanning ~0.78 -> ~0.27 across the band.
    id: 'imp34907-sStar-drifts-down-monotonically',
    description: 's* falls monotonically as C_mb decreases, from ~0.78 (C_mb=1) to ~0.27 (C_mb=0.5)',
    holds: () => {
      for (let i = 1; i < GRID.length; i++) {
        if (!(GRID[i].s_star < GRID[i - 1].s_star)) return false;
      }
      return GRID[0].s_star - GRID[GRID.length - 1].s_star > 0.4;
    },
  },
  {
    // (F2): the drift slope ds*/dC_mb is positive and ~1 per unit across the band.
    id: 'imp34907-drift-slope-positive-order-one',
    description: 'ds*/dC_mb > 0 and ~1 per unit at both C_mb=1 and C_mb=0.75',
    holds: () =>
      DSSTAR_DCMB_AT1 > 0.5 &&
      DSSTAR_DCMB_AT1 < 2 &&
      DSSTAR_DCMB_AT075 > 0.5 &&
      DSSTAR_DCMB_AT075 < 2,
  },
  {
    // (F3): the imp-34824 ~0.512 threshold is not special here -- an ordinary interior s* ~ 0.28 sits there.
    id: 'imp34907-inversion-threshold-not-special',
    description: 'at C_mb=0.512 the E_flow crossing is an ordinary interior s* ~ 0.28 (Gap(0) still > 0)',
    holds: () =>
      S_STAR_AT_INVERSION > 0.15 &&
      S_STAR_AT_INVERSION < 0.4 &&
      gapAt(0, 0.512) > 0,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp34907-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP.isRigorous === false &&
      IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP.farTailExponent === 0.5 &&
      typeof IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP.subGap === 'string' &&
      /imp-486/.test(IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP.subGap) &&
      /NO QED/.test(IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP.verdict),
  },
];

for (const a of IMP34907_EFLOW_CROSSING_STRENGTH_CMB_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34907-eflow-crossing-strength-cmb-sweep assertion failed: ${a.id}`);
  }
}
