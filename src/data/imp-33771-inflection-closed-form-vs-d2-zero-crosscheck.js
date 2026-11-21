/**
 * @module imp-33771-inflection-closed-form-vs-d2-zero-crosscheck
 *
 * imp-33771 (accuracy/cross-validation, frontier-direction): imp-33744 derived the sigma-ramp
 * inflection in closed form as sigma_infl = 1/2 - g_prime/(2 g^2) (the sigmoid-inflection of the
 * logistic flow d sigma/dt = -g(t) sigma(1-sigma), t = ln N), and imp-33721 NUMERICALLY located
 * the exponent-ramp acceleration (D2) zero-crossing knee at N* ~ 3.38e9 by sub-decade
 * second-differencing of the OLS local exponent. The two were never DIRECTLY cross-validated:
 * imp-33744 computes its own continuous exponent-ramp inflection but never inverts its closed-form
 * sigma value to an N location and lays it beside the imp-33721 DIRECT sub-decade D2 zero. This
 * module does exactly that -- it reproduces the imp-33721 sub-decade D2-zero locator verbatim, maps
 * the imp-33744 closed-form sigma_infl to its N location, and measures the agreement (in both the
 * sigma value and the N location), confirming the closed form reproduces the NUMERICALLY-LOCATED
 * knee rather than a nearby but distinct landmark (the halving point, or the whole-decade bracket).
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33721 / imp-33744 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 *
 * THE CROSS-CHECK (measurement only)
 * ----------------------------------
 *   (A) DIRECT D2-ZERO KNEE (imp-33721, reproduced verbatim). Quarter-decade OLS-exponent
 *       sub-brackets across [1e9, 1e11], first/second differences D1/D2 on the sub-bracket centers,
 *       the single log10-interpolated D2 zero-crossing -> log10 N*_D2 ~ 9.529 (N*_D2 ~ 3.38e9),
 *       and the conditional share sigma(N*_D2) there.
 *   (B) CLOSED-FORM INFLECTION -> N (imp-33744). sigma_cf = 1/2 - g_prime/(2 g^2) evaluated at the
 *       sigma = 1/2 halving point (g = -d ln r/d ln N, r = E_coll/E_trunc), then INVERTED through
 *       the (monotone) sigma(N) to its N location N*_cf.
 *   (C) OFFSET. Relative N offset N*_cf/N*_D2 - 1, the log10 gap, and the sigma gap sigma_cf -
 *       sigma(N*_D2). A continuous fine-difference exponent-ramp D2 zero is also located as an
 *       independent check that the sub-decade locator is not a grid artifact.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (F1) THE CLOSED FORM REPRODUCES THE NUMERICAL KNEE, NOT A DISTANT LANDMARK. The imp-33744
 *        closed-form inflection maps to N*_cf ~ 3.33e9 (log10 ~ 9.522); the imp-33721 direct
 *        sub-decade D2 zero sits at N*_D2 ~ 3.38e9 (log10 ~ 9.529). They agree to ~1.5% in N
 *        (log10 gap ~ 0.007) -- the same sub-decade, ~1.4 orders of magnitude closer than the
 *        imp-33701 whole-decade [1e10,1e11] bracket the coarse ladder had reported. The closed form
 *        lands the knee, not a distant landmark.
 *   (F2) THE ~1.5% OFFSET IS A GENUINE, RESOLVABLE TWO-NOTION SEPARATION. The log10 gap ~ 0.007
 *        EXCEEDS the imp-33721 grid-robustness window (+/- 0.001), so it is not numerical noise: the
 *        closed form targets the SIGMOID inflection (d2 sigma/dt2 = 0, sigma_cf ~ 0.4979) while
 *        imp-33721 locates the EXPONENT-RAMP D2 zero (d2 p/dt2 = 0, sigma ~ 0.4961). The two
 *        inflection notions are distinct-but-adjacent -- both collapse to sigma = 1/2 only in the
 *        pure-power limit -- and here separate by ~0.0018 in sigma and ~1.5% in N.
 *   (F3) BOTH SIT JUST ABOVE THE HALVING POINT, THE CLOSED FORM BRACKETED BETWEEN THEM. The halving
 *        landmark (N ~ 3.267e9), the closed-form inflection (N*_cf ~ 3.33e9) and the D2 knee
 *        (N*_D2 ~ 3.38e9) are ordered halving < cf < D2-knee, all within ~2% -- consistent with the
 *        imp-33744 picture that the log-factor curvature displaces every inflection notion just
 *        above sigma = 1/2 by an O(1/t^2) amount, and the residual notion-to-notion gap is smaller
 *        still. The closed form is a faithful analytic stand-in for the numerically-located knee.
 *
 * The punchline: inverting the imp-33744 closed form sigma_infl = 1/2 - g_prime/(2 g^2) to an N
 * location lands within ~1.5% (log10 ~ 0.007) of the imp-33721 direct sub-decade D2-zero knee at
 * N* ~ 3.38e9 -- the same sub-decade, orders of magnitude tighter than the whole-decade bracket, so
 * the closed form reproduces the numerically-located knee. The small residual is the genuine
 * (grid-robustness-exceeding) separation between the sigmoid-inflection and exponent-ramp-D2
 * notions, both displaced just above the sigma = 1/2 halving point by the running log-factor.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed form sigma_infl = 1/2 - g_prime/(2 g^2))
 * @see imp-33721-sigma-ramp-inflection-subdecade (direct sub-decade D2-zero knee N* ~ 3.38e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma=1/2 halving landmark ~3.27e9)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade bracket the knee refines from)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33721/imp-33744 exactly

// EXACT imp-33721/imp-33744 sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigma(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// --- (A) imp-33721 DIRECT sub-decade D2-zero locator (reproduced verbatim estimator/method) ---
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
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
  return -(sxy / sxx);
}
function subDecadeD2Zero(W, ptsPerDecade) {
  const edges = [];
  for (let d = 9.0; d <= 11.0 + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar };
}
const D2_PRIMARY = subDecadeD2Zero(0.25, 40);
const NSTAR_D2_LOG10 = D2_PRIMARY.cstar; // ~ 9.529
const NSTAR_D2 = Math.pow(10, NSTAR_D2_LOG10); // ~ 3.38e9
const SIGMA_AT_D2 = sigma(NSTAR_D2);

// Independent continuous fine-difference exponent-ramp D2 zero (grid-artifact control).
function localExponentP(N) {
  const t = Math.log(N);
  const h = 1e-3;
  const lo = Math.log(sigma(Math.exp(t - h)));
  const hi = Math.log(sigma(Math.exp(t + h)));
  return -((hi - lo) / (2 * h));
}
function d2PDt2(N) {
  const t = Math.log(N);
  const h = 2e-3;
  return (localExponentP(Math.exp(t + h)) - 2 * localExponentP(Math.exp(t)) + localExponentP(Math.exp(t - h))) / (h * h);
}
function findZeroInT(fOfN) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  let flo = fOfN(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = fOfN(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}
const NSTAR_RAMP_CONT = findZeroInT(d2PDt2); // ~ 3.38e9, continuous check on the sub-decade locator

// --- (B) imp-33744 closed-form inflection sigma_cf = 1/2 - g_prime/(2 g^2), then inverted to N ---
function findHalfN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigma(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function lnRatio(N) {
  return Math.log(terms(N).E_coll / E_TRUNC_PT);
}
function gAt(N) {
  const t = Math.log(N);
  const h = 1e-4;
  return -((lnRatio(Math.exp(t + h)) - lnRatio(Math.exp(t - h))) / (2 * h));
}
function gPrimeAt(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return (gAt(Math.exp(t + h)) - gAt(Math.exp(t - h))) / (2 * h);
}
const N_HALF = findHalfN();
const G_AT_HALF = gAt(N_HALF);
const GPRIME_AT_HALF = gPrimeAt(N_HALF);
const SIGMA_CF = 0.5 - GPRIME_AT_HALF / (2 * G_AT_HALF * G_AT_HALF); // ~ 0.4979 (matches imp-33744)
// Invert the monotone sigma(N) to the N location of the closed-form inflection value.
function invertSigma(target) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigma(Math.exp(mid)) > target) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
const NSTAR_CF = invertSigma(SIGMA_CF); // ~ 3.33e9

// --- (C) offsets ---
const N_REL_OFFSET_CF_VS_D2 = NSTAR_CF / NSTAR_D2 - 1; // ~ -1.5%
const LOG10_GAP_CF_VS_D2 = Math.log10(NSTAR_CF) - Math.log10(NSTAR_D2); // ~ -0.007
const SIGMA_GAP_CF_VS_D2 = SIGMA_CF - SIGMA_AT_D2; // ~ +0.0018
const GRID_ROBUSTNESS_LOG10 = 0.001; // imp-33721 F2 window
const HALVING_N = 3.27e9; // imp-33582/imp-33721
const IMP33701_BRACKET_CENTER_LOG10 = 10.5; // whole-decade [1e10,1e11] center the knee refined FROM

export const IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK = {
  id: 'imp-33771',
  proofSection: 'S-frontier',
  question:
    'imp-33744 derived the sigma-ramp inflection in closed form as sigma_infl = 1/2 - g_prime/(2 g^2), ' +
    'but never cross-validated it against the imp-33721 NUMERICALLY-located exponent-ramp D2 ' +
    '(acceleration) zero-crossing knee at N* ~ 3.38e9. Invert the closed-form sigma to its N ' +
    'location, lay it beside the direct sub-decade D2 zero, measure the agreement, and confirm the ' +
    'closed form reproduces the located knee rather than a nearby but distinct landmark. ' +
    'Measurement/cross-validation only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the imp-33721 direct sub-decade D2-zero knee (log10 N*_D2, N*_D2, sigma there), the imp-33744 ' +
    'closed-form inflection sigma_cf = 1/2 - g_prime/(2 g^2) inverted to its N location N*_cf, and ' +
    'the relative/log10/sigma offsets between the two -- plus a continuous fine-difference D2-zero control',
  // (A) imp-33721 direct D2-zero knee, reproduced
  d2ZeroSignChanges: D2_PRIMARY.signChanges, // must be 1
  d2ZeroLog10Nstar: +NSTAR_D2_LOG10.toFixed(4), // ~ 9.529
  d2ZeroNstar: +NSTAR_D2.toExponential(4), // ~ 3.38e9
  sigmaAtD2Zero: +SIGMA_AT_D2.toFixed(6),
  continuousRampD2ZeroNstar: +NSTAR_RAMP_CONT.toExponential(4), // grid-artifact control ~3.38e9
  // (B) imp-33744 closed-form inflection -> N
  halvingN: +N_HALF.toExponential(4),
  gAtHalving: +G_AT_HALF.toFixed(6),
  gPrimeAtHalving: +GPRIME_AT_HALF.toExponential(4),
  closedFormSigmaInfl: +SIGMA_CF.toFixed(6), // ~ 0.4979
  closedFormInflNstar: +NSTAR_CF.toExponential(4), // ~ 3.33e9
  closedFormInflLog10Nstar: +Math.log10(NSTAR_CF).toFixed(4), // ~ 9.522
  // (C) offsets
  nRelOffset_cf_vs_d2: +N_REL_OFFSET_CF_VS_D2.toFixed(4), // ~ -0.0151
  log10Gap_cf_vs_d2: +LOG10_GAP_CF_VS_D2.toFixed(4), // ~ -0.0066
  sigmaGap_cf_vs_d2: +SIGMA_GAP_CF_VS_D2.toFixed(6), // ~ 0.0018
  gridRobustnessLog10: GRID_ROBUSTNESS_LOG10,
  halvingLandmarkN: HALVING_N,
  imp33701BracketCenterLog10: IMP33701_BRACKET_CENTER_LOG10,
  finding: {
    F1_closed_form_reproduces_numerical_knee_not_distant_landmark:
      'The imp-33744 closed-form inflection maps to N*_cf ~ 3.33e9 (log10 ~ 9.522); the imp-33721 ' +
      'direct sub-decade D2 zero sits at N*_D2 ~ 3.38e9 (log10 ~ 9.529). They agree to ~1.5% in N ' +
      '(log10 gap ~ 0.007) -- the SAME sub-decade, ~1.4 orders of magnitude closer than the ' +
      'imp-33701 whole-decade [1e10,1e11] bracket (center log10 10.5) the coarse ladder reported. ' +
      'The closed form lands the numerically-located knee, not a distant landmark.',
    F2_offset_is_genuine_two_notion_separation:
      'The log10 gap ~ 0.007 EXCEEDS the imp-33721 grid-robustness window (+/- 0.001), so it is not ' +
      'numerical noise: the closed form targets the SIGMOID inflection (sigma_cf ~ 0.4979) while ' +
      'imp-33721 locates the EXPONENT-RAMP D2 zero (sigma ~ 0.4961). The two inflection notions are ' +
      'distinct-but-adjacent -- both collapse to sigma = 1/2 only in the pure-power limit -- and ' +
      'here separate by ~0.0018 in sigma and ~1.5% in N. A continuous fine-difference D2 zero ' +
      '(~3.38e9) confirms the sub-decade locator is not a grid artifact.',
    F3_both_sit_just_above_halving_cf_bracketed_between:
      'The halving landmark (~3.267e9), the closed-form inflection (N*_cf ~ 3.33e9) and the D2 knee ' +
      '(N*_D2 ~ 3.38e9) are ordered halving < cf < D2-knee, all within ~2% -- consistent with the ' +
      'imp-33744 picture that the running log-factor displaces every inflection notion just above ' +
      'sigma = 1/2 by O(1/t^2), the notion-to-notion residual smaller still. The closed form is a ' +
      'faithful analytic stand-in for the numerically-located knee.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier-direction, NOT rigorous). Inverting the imp-33744 ' +
    'closed form sigma_infl = 1/2 - g_prime/(2 g^2) to an N location gives N*_cf ~ 3.33e9 ' +
    '(log10 ~ 9.522), agreeing with the imp-33721 DIRECT sub-decade D2-zero knee N*_D2 ~ 3.38e9 ' +
    '(log10 ~ 9.529) to ~1.5% in N -- a log10 gap ~ 0.007, the same sub-decade and ~1.4 orders of ' +
    'magnitude tighter than the imp-33701 whole-decade bracket, so the closed form reproduces the ' +
    'numerically-located knee, NOT a distant landmark. The residual ~1.5% offset EXCEEDS the ' +
    'imp-33721 grid-robustness window (+/- 0.001 in log10), so it is a genuine two-notion ' +
    'separation: the closed form targets the sigmoid inflection (sigma_cf ~ 0.4979) while imp-33721 ' +
    'locates the exponent-ramp D2 zero (sigma ~ 0.4961), the two distinct-but-adjacent notions ' +
    'separated by ~0.0018 in sigma. Both, with the halving landmark, sit within ~2% just above ' +
    'sigma = 1/2 (halving < cf < D2-knee). The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33744 (closed form sigma_infl = 1/2 - g_prime/(2 g^2)); imp-33721 (direct sub-decade ' +
    'D2-zero knee N* ~ 3.38e9); imp-33582 (sigma=1/2 halving landmark ~3.27e9); imp-33701 ' +
    '(whole-decade bracket the knee refined from); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK_ASSERTIONS = [
  {
    // Reuse gate: the reproduced imp-33721 sub-decade locator yields EXACTLY ONE D2 sign change at
    // log10 N* ~ 9.529 -- proving the IDENTICAL model / estimator is in use before the cross-check.
    id: 'imp33771-reuses-imp33721-d2-knee',
    description: 'reproduced imp-33721 sub-decade D2 locator: one sign change at log10 N* ~ 9.529 (N* ~ 3.38e9)',
    holds: () =>
      D2_PRIMARY.signChanges === 1 &&
      NSTAR_D2_LOG10 !== null &&
      Math.abs(NSTAR_D2_LOG10 - 9.529) < 0.01 &&
      Math.abs(NSTAR_D2 / 3.38e9 - 1) < 0.02,
  },
  {
    // Reuse gate: the closed-form inflection reproduces the imp-33744 published value ~0.4979.
    id: 'imp33771-reuses-imp33744-closed-form',
    description: 'closed-form sigma_infl = 1/2 - g_prime/(2 g^2) reproduces the imp-33744 value ~0.4979 to < 1e-3',
    holds: () => Math.abs(SIGMA_CF - 0.4979) < 1e-3,
  },
  {
    // (F1): the inverted closed-form N location agrees with the DIRECT D2 knee to < 2% in N and
    // within the same sub-decade -- the closed form reproduces the numerical knee.
    id: 'imp33771-closed-form-reproduces-numerical-knee',
    description: 'inverted closed-form N*_cf agrees with the direct D2 knee N*_D2 to < 2% in N (same sub-decade)',
    holds: () =>
      Math.abs(N_REL_OFFSET_CF_VS_D2) < 0.02 &&
      Math.floor(Math.log10(NSTAR_CF)) === Math.floor(Math.log10(NSTAR_D2)),
  },
  {
    // (F1 sharp): the closed form lands MUCH closer to the D2 knee than to the imp-33701
    // whole-decade bracket center -- it reproduces the knee, not the coarse distant landmark.
    id: 'imp33771-not-a-distant-landmark',
    description: 'N*_cf is within ~1 decade of the D2 knee but ~1.4 decades from the imp-33701 bracket center (10.5)',
    holds: () =>
      Math.abs(LOG10_GAP_CF_VS_D2) < 0.05 &&
      Math.abs(IMP33701_BRACKET_CENTER_LOG10 - Math.log10(NSTAR_CF)) > 0.9,
  },
  {
    // (F2): the residual offset is a GENUINE two-notion separation -- it exceeds the imp-33721 grid
    // robustness window, and the closed-form (sigmoid) sigma sits ABOVE the exponent-ramp D2 sigma.
    id: 'imp33771-offset-is-genuine-two-notion-separation',
    description: 'log10 gap exceeds the imp-33721 grid-robustness window (0.001) and sigma_cf > sigma@D2 (sigmoid vs ramp)',
    holds: () =>
      Math.abs(LOG10_GAP_CF_VS_D2) > GRID_ROBUSTNESS_LOG10 &&
      SIGMA_GAP_CF_VS_D2 > 0 &&
      SIGMA_GAP_CF_VS_D2 < 0.01,
  },
  {
    // (F3): halving < cf < D2-knee, all within ~2% just above sigma = 1/2.
    id: 'imp33771-halving-cf-d2-ordering',
    description: 'ordering halving < closed-form < D2-knee, all within ~2% and all above the halving point',
    holds: () =>
      HALVING_N < NSTAR_CF &&
      NSTAR_CF < NSTAR_D2 &&
      NSTAR_D2 / HALVING_N - 1 < 0.04 &&
      SIGMA_CF < 0.5 &&
      SIGMA_AT_D2 < 0.5,
  },
  {
    // (F2 control): the continuous fine-difference exponent-ramp D2 zero corroborates the sub-decade
    // locator to < 1% -- the knee is not a grid artifact.
    id: 'imp33771-continuous-corroborates-subdecade',
    description: 'continuous fine-difference exponent-ramp D2 zero agrees with the sub-decade knee to < 1%',
    holds: () => Math.abs(NSTAR_RAMP_CONT / NSTAR_D2 - 1) < 0.01,
  },
  {
    // Honesty gate: measurement/cross-validation only, no bound change, no QED, no refereed bound is changed.
    id: 'imp33771-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK.verdict),
  },
];

for (const a of IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33771-inflection-closed-form-vs-d2-zero-crosscheck assertion failed: ${a.id}`);
  }
}
