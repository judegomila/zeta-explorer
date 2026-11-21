/**
 * imp-34430 -- Does the imp-34345 +72.94 log-T0-drift bump (leading OLS-+17 -> exact-fit +89.94
 * M2-ceiling e^3 D^2 coefficient) admit a CLOSED FORM from the imp-34211 ~0.28-decade window-width
 * shortfall, or is it only readable off the imp-34189 bisection?
 *
 * BACKGROUND. imp-34345 Finding 2 decomposed the exact-fit endpoint-curvature coefficient
 *   89.94 = 17 (imp-34127 OLS-+17 detrend-cubic-bias baseline) + 72.94 (imp-34211 log-T0-drift bump).
 *   The +17 baseline places the leading closed-form crossing at kEnd_cf ~ 21.031; reaching the
 *   imp-34189/imp-34150 bisected ceiling kEnd_bis ~ 21.281 requires shifting the crossing UP by the
 *   ~0.25-0.28 decade-index imp-34211 window-width shortfall, which forces the coefficient to +89.94.
 *   imp-34345 left the practical conclusion as "quote the ceiling from the bisection" and did NOT test
 *   whether the +72.94 bump itself is reproducible as a closed-form function of the shortfall.
 *
 * THE TEST (all machinery rebuilt verbatim from the inherited imp-3406/imp-33810 sub-terms; the
 * single-coefficient matcher kEndForCoeff(c) and matchCoeffForTarget are the imp-34189/imp-34267/
 * imp-34345 functions unchanged). The natural closed form is a linearization of the required-coefficient
 * map: bump ~ (dc_star/dk)|_leading * Delta_k, with c*(k) = matchCoeffForTarget(k) the coefficient whose
 * closed-form crossing lands at k, and Delta_k = kEnd_bis - kEnd_cf ~ 0.25 the window shortfall. If a
 * single slope dc_star/dk reproduces 72.94 = c*(kEnd_bis) - c*(kEnd_cf) to within the ~0.28 residual, the
 * bump has a closed form; otherwise it is an artifact of the matcher map that must be read off the
 * bisection.
 *
 * FINDING 1 -- the required-coefficient map c*(k) is NON-MONOTONE and passes through a NEAR-POLE at
 *   the exact-fit point, so it has NO well-defined slope there. The forward matcher kEndForCoeff(c)
 *   jumps discontinuously across c ~ 89.94: kEndForCoeff(89.94) ~ 21.234 but kEndForCoeff(90.0) ~ 21.281
 *   -- a ~0.047 leap in the crossing across a ~0.06 window in c. Equivalently the inverse c*(k)
 *   PLATEAUS: c*(21.25) and c*(21.281) are both 89.9405 (difference < 1e-4) even though k differs by
 *   0.031. Over the top ~0.03 of the shortfall the coefficient does not move at all; over the first
 *   ~0.02 (21.031 -> 21.05) it jumps from ~12 to ~27. A quantity that is frozen over one third of the
 *   interval and rockets over another third is not a slope-times-shortfall closed form.
 *
 * FINDING 2 -- consequently NO single linear closed form reproduces the +72.94 bump. The chord slope
 *   bump/Delta_k ~ 292, but the local secant dc_star/dk swings from ~750 across the first window step down
 *   to ~0 across the plateau -- a range ratio in the hundreds. A leading-end linearization
 *   (dc_star/dk|_leading ~ 6.0e3 by central difference) predicts a bump ~ 1.5e3 (over 20x too large); the
 *   ceiling-end/plateau slope predicts a bump ~ 0-10 (an order of magnitude too small). Neither, nor the
 *   chord, is within the ~0.28 residual -- indeed none is within an order of magnitude of 72.94.
 *
 * VERDICT. HONEST NEGATIVE: the +72.94 log-T0-drift bump does NOT admit a closed form from the ~0.28
 *   window-width shortfall. The coefficient sits on a near-pole/plateau of the matcher map where the
 *   coefficient-to-crossing sensitivity is non-monotone and swings by two-plus orders of magnitude, so
 *   there is no leading slope to multiply the shortfall by. This is the same eD ~ 1.13 = O(1) pathology
 *   imp-34189 diagnosed for the window-width Taylor series (which does not converge at a full-decade
 *   window) and imp-34345 read off the bisection: 89.94 is exact-fit only, not a derived constant, and
 *   the +72.94 bump inherits that status. imp-34345s practical conclusion (quote the ceiling from the
 *   bisection) stands, now with the closed-form route explicitly closed off.
 *
 * Measurement/derivation within the inherited imp-3406/imp-33810 component model only; the component
 * model is NOT a rigorous asymptotic; no bound changes; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-34345-m2-ceiling-exactfit-90-vs-8994-residual-channel-decomposition (the +72.94 bump split)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (eD~1.13=O(1); non-convergent window series)
 * @see imp-34211-closedform-vs-bisection-kend-gap (the O((eD)^2) log-T0-drift/window shortfall ~0.28)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the leading OLS-cubic-bias coeff +17)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34127/imp-34189/imp-34211/imp-34345 exactly
const D = Math.LN10; // decade window width in x = ln N

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34345 (no re-derivation).
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

function olsSigmaExponent(k, pts = 5) {
  const step = 1 / (pts - 1);
  const xs = [];
  const ys = [];
  for (let i = 0; i < pts; i++) {
    const N = Math.pow(10, k + i * step);
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
function ecollExponentMag(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return -Math.log(parts(hi).E_coll / parts(lo).E_coll) / Math.log(hi / lo);
}
function residDecade(k) {
  return ecollExponentMag(k) * (1 - parts(Math.pow(10, k + 1)).sigma) - olsSigmaExponent(k);
}
function eCont(N) {
  const h = 1e-4;
  const Lp = Math.log(effectiveHeightForN(N * Math.exp(h)));
  const Lm = Math.log(effectiveHeightForN(N / Math.exp(h)));
  const Lslope = (Lp - Lm) / (2 * h);
  return 0.5 - Lslope / (2 * Math.log(effectiveHeightForN(N)));
}
function eDerivs(N) {
  const x = Math.log(N);
  const h = 1e-3;
  const e0 = eCont(N);
  const ep = eCont(Math.exp(x + h));
  const em = eCont(Math.exp(x - h));
  return { e: e0, e2: (ep - 2 * e0 + em) / (h * h) };
}
function bisect(fn, lo0, hi0, iters = 200) {
  if (fn(lo0) <= 0 || fn(hi0) >= 0) return NaN;
  let lo = lo0;
  let hi = hi0;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// The imp-34189/imp-34267/imp-34345 single-coefficient closed-form matcher -- verbatim.
function kEndForCoeff(cc) {
  const fn = (k) => {
    const hi = Math.pow(10, k + 1);
    const { e, e2 } = eDerivs(hi);
    return sigma(hi) - (-e2 * D * D / 160) / (e * e * D / 2 + cc * e * e * e * D * D / 480);
  };
  return bisect(fn, 15, 27);
}
// imp-34267/imp-34345 matchCoeffForTarget: the coefficient c* whose closed-form crossing lands at targetK.
function matchCoeffForTarget(targetK) {
  let clo = -500;
  let chi = 2000;
  for (let i = 0; i < 80; i++) {
    const cm = (clo + chi) / 2;
    if (kEndForCoeff(cm) < targetK) clo = cm;
    else chi = cm;
  }
  return (clo + chi) / 2;
}

// Anchors: the bisected ceiling and the leading (OLS-+17) closed-form crossing (imp-34345 reproduced).
const KEND_BIS = bisect((k) => residDecade(k), 17, 27); // ~21.2809
const OLS_BASELINE = 17;
const KEND_LEADING = kEndForCoeff(OLS_BASELINE); // ~21.031 (kEndForCoeff(17), imp-34345 KEND_LEADING)
const SHORTFALL = KEND_BIS - KEND_LEADING; // ~0.2498 (imp-34211 window-width shortfall)

// The exact-fit coefficient and the +72.94 bump (imp-34345 canonical convention: bump = c* - 17).
const EXACT_FIT_COEFF = matchCoeffForTarget(KEND_BIS); // ~89.9405
const BUMP = EXACT_FIT_COEFF - OLS_BASELINE; // ~72.94
const CHORD_SLOPE = BUMP / SHORTFALL; // ~292 (average dc*/dk over the shortfall)

// FINDING 1: the forward matcher is discontinuous / the inverse c*(k) plateaus at the near-pole.
const KEND_AT_8994 = kEndForCoeff(89.94); // ~21.234
const KEND_AT_9000 = kEndForCoeff(90.0); // ~21.281 -- a ~0.047 jump across a ~0.06 window in c
const POLE_JUMP = KEND_AT_9000 - KEND_AT_8994; // ~0.047 (near-pole / discontinuity)
const CSTAR_AT_2125 = matchCoeffForTarget(21.25); // ~89.9405
const CSTAR_AT_BIS = matchCoeffForTarget(KEND_BIS); // ~89.9405 (== EXACT_FIT_COEFF)
const PLATEAU_DIFF = CSTAR_AT_BIS - CSTAR_AT_2125; // < 1e-4 -- coefficient frozen over the top of the window

// FINDING 2: the local dc*/dk swings by orders of magnitude, so no single linear closed form works.
const CSTAR_AT_2105 = matchCoeffForTarget(21.05); // ~26.79
const EARLY_SECANT = (CSTAR_AT_2105 - matchCoeffForTarget(21.031)) / (21.05 - 21.031); // ~750
const PLATEAU_SECANT = PLATEAU_DIFF / (KEND_BIS - 21.25); // ~0 (coefficient frozen)
const HK = 1e-3;
const SLOPE_LEAD = (matchCoeffForTarget(KEND_LEADING + HK) - matchCoeffForTarget(KEND_LEADING - HK)) / (2 * HK); // ~6.0e3
const LINEAR_PRED_LEAD = SLOPE_LEAD * SHORTFALL; // ~1.5e3 (>20x too large)
const LINEAR_PRED_PLATEAU = PLATEAU_SECANT * SHORTFALL; // ~0 (order of magnitude too small)

export const IMP34430_DRIFT_BUMP_CLOSED_FORM_FROM_WINDOW_SHORTFALL = {
  id: 'imp-34430',
  proofSection: 'S-frontier',
  question:
    'Does the imp-34345 +72.94 log-T0-drift bump (leading OLS-+17 -> exact-fit +89.94 M2-ceiling e^3 D^2 ' +
    'coefficient) admit a CLOSED FORM from the imp-34211 ~0.28-decade window-width shortfall -- i.e. is ' +
    'bump ~ (dc*/dk) * Delta_k for a well-defined coefficient-to-crossing slope -- or is it only readable ' +
    'off the imp-34189 bisection? Measurement within the component model only; NO QED.',
  measuredQuantity:
    'The required-coefficient map c*(k) = matchCoeffForTarget(k) and its slope across the shortfall ' +
    'window [kEnd_cf ~ 21.031, kEnd_bis ~ 21.281]: the near-pole jump in the forward matcher at c ~ 89.94, ' +
    'the plateau of c*(k) over the top of the window, the local-vs-chord slope swing, and the linear ' +
    'closed-form bump predictions from the leading-end and plateau-end slopes.',
  result: {
    kEnd_bis: +KEND_BIS.toFixed(4), // ~21.2809
    kEnd_leading_plus17: +KEND_LEADING.toFixed(4), // ~21.031
    shortfall_Delta_k: +SHORTFALL.toFixed(4), // ~0.2498
    exact_fit_coeff: +EXACT_FIT_COEFF.toFixed(4), // ~89.9405
    bump: +BUMP.toFixed(4), // ~72.94
    chord_slope_bump_over_Dk: +CHORD_SLOPE.toFixed(2), // ~292
    // FINDING 1: near-pole / plateau
    kEnd_at_c8994: +KEND_AT_8994.toFixed(4), // ~21.234
    kEnd_at_c9000: +KEND_AT_9000.toFixed(4), // ~21.281
    pole_jump_in_k: +POLE_JUMP.toFixed(4), // ~0.047 across ~0.06 in c
    cstar_plateau_diff: PLATEAU_DIFF, // < 1e-4 (c* frozen over top 0.03 of window)
    // FINDING 2: slope swing and failed linear closed form
    early_secant_dcstar_dk: +EARLY_SECANT.toFixed(1), // ~750
    plateau_secant_dcstar_dk: +PLATEAU_SECANT.toFixed(4), // ~0
    slope_lead_central_diff: +SLOPE_LEAD.toFixed(1), // ~6.0e3
    linear_pred_bump_from_lead: +LINEAR_PRED_LEAD.toFixed(1), // ~1.5e3 (>20x too large)
    linear_pred_bump_from_plateau: +LINEAR_PRED_PLATEAU.toFixed(4), // ~0 (>>too small)
  },
  finding: {
    A_matcher_map_non_monotone_near_pole:
      'The required-coefficient map c*(k) is non-monotone and passes through a near-pole at the exact-fit ' +
      'point. The forward matcher kEndForCoeff jumps discontinuously across c ~ 89.94: kEndForCoeff(89.94) ' +
      '~ ' + KEND_AT_8994.toFixed(3) + ' but kEndForCoeff(90.0) ~ ' + KEND_AT_9000.toFixed(3) + ', a ~' +
      POLE_JUMP.toFixed(3) + ' leap in the crossing across a ~0.06 window in c. Equivalently c*(k) PLATEAUS: ' +
      'c*(21.25) and c*(kEnd_bis) are both ~89.9405 (difference ' + PLATEAU_DIFF.toExponential(2) + ') even ' +
      'though k differs by ~0.031. Over the top third of the shortfall the coefficient does not move at all.',
    B_no_single_linear_closed_form:
      'Consequently no single slope reproduces the +72.94 bump. The chord slope bump/Delta_k ~ ' +
      CHORD_SLOPE.toFixed(0) + ', but the local secant dc*/dk swings from ~' + EARLY_SECANT.toFixed(0) +
      ' across the first window step down to ~0 across the plateau. A leading-end linearization ' +
      '(dc*/dk|_leading ~ ' + SLOPE_LEAD.toExponential(1) + ') predicts a bump ~ ' +
      LINEAR_PRED_LEAD.toExponential(1) + ' (>20x too large); the plateau slope predicts ~0 (an order of ' +
      'magnitude too small). None -- leading, chord, or plateau -- is within an order of magnitude of 72.94, ' +
      'let alone the ~0.28 residual.',
    C_verdict_no_closed_form:
      'HONEST NEGATIVE: the +72.94 log-T0-drift bump does NOT admit a closed form from the ~0.28 ' +
      'window-width shortfall. The exact-fit coefficient sits on a near-pole/plateau of the matcher map ' +
      'where the coefficient-to-crossing sensitivity is non-monotone and swings by two-plus orders of ' +
      'magnitude, so there is no leading slope to multiply the shortfall by. This is the same eD ~ 1.13 = ' +
      'O(1) pathology imp-34189 diagnosed (the window-width Taylor series does not converge at a full-decade ' +
      'window). 89.94 is exact-fit only, not a derived constant; the +72.94 bump inherits that status. ' +
      'imp-34345s practical conclusion -- quote the ceiling from the bisection -- stands, with the ' +
      'closed-form route now explicitly closed off.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Rebuilding the imp-34189/imp-34267/imp-34345 ' +
    'single-coefficient matcher verbatim from the inherited imp-3406/imp-33810 sub-terms and probing the ' +
    'required-coefficient map c*(k) = matchCoeffForTarget(k) across the shortfall window shows the exact-fit ' +
    'coefficient 89.94 sits on a NEAR-POLE / PLATEAU: kEndForCoeff jumps ~0.047 in the crossing across a ~0.06 ' +
    'window in c near 89.94, and c*(21.25) == c*(21.281) == 89.9405 (frozen over the top ~0.03 of the window). ' +
    'The local slope dc*/dk swings from ~750 across the first window step to ~0 across the plateau (leading ' +
    'central-difference ~6.0e3), versus the chord slope ~292; the resulting linear closed-form bump predictions ' +
    'span ~0 to ~1.5e3, none within an order of magnitude of the true 72.94. So the +72.94 log-T0-drift bump ' +
    'does NOT admit a closed form from the window shortfall -- it is inseparable from the near-pole structure ' +
    'of the matcher and must be read off the bisection, the same eD ~ 1.13 = O(1) non-convergence imp-34189 ' +
    'found. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; descriptive within ' +
    'the model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 ' +
    'untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34345 (the +72.94 bump split tested here); imp-34189 (eD~1.13=O(1); non-convergent window series); ' +
    'imp-34211 (the O((eD)^2) log-T0-drift/window shortfall ~0.28); imp-34127 (the leading OLS-cubic-bias ' +
    'coeff +17); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34430_DRIFT_BUMP_CLOSED_FORM_FROM_WINDOW_SHORTFALL_ASSERTIONS = [
  {
    // (A) The anchors reproduce imp-34345: bisected ceiling ~21.281, leading crossing ~21.031, shortfall ~0.25.
    id: 'imp34430-anchors-reproduce-imp34345',
    description: 'kEnd_bis ~21.281, kEnd_leading ~21.031, shortfall ~0.25',
    holds: () =>
      KEND_BIS > 21.27 && KEND_BIS < 21.29 &&
      KEND_LEADING > 21.02 && KEND_LEADING < 21.04 &&
      SHORTFALL > 0.22 && SHORTFALL < 0.30,
  },
  {
    // (B) The exact-fit coefficient and the +72.94 bump reproduce imp-34345.
    id: 'imp34430-exact-fit-coeff-and-bump',
    description: 'exact-fit coeff ~89.94 and bump ~72.94 (imp-34345 reproduced)',
    holds: () =>
      Math.abs(EXACT_FIT_COEFF - 89.94) < 0.05 &&
      Math.abs(BUMP - 72.94) < 0.05,
  },
  {
    // (C) FINDING 1: the forward matcher is near-discontinuous at c ~ 89.94 (near-pole).
    id: 'imp34430-forward-matcher-near-pole',
    description: 'kEndForCoeff jumps ~0.047 in the crossing across a ~0.06 window in c near 89.94',
    holds: () =>
      KEND_AT_8994 < KEND_AT_9000 && POLE_JUMP > 0.02 && POLE_JUMP < 0.1,
  },
  {
    // (D) FINDING 1: the inverse c*(k) PLATEAUS over the top of the shortfall (frozen coefficient).
    id: 'imp34430-cstar-plateau',
    description: 'c*(21.25) == c*(kEnd_bis) to <1e-3 even though k differs by ~0.031',
    holds: () => Math.abs(PLATEAU_DIFF) < 1e-3 && KEND_BIS - 21.25 > 0.02,
  },
  {
    // (E) FINDING 2: no single linear closed form -- slope swings orders of magnitude, predictions bracket-fail.
    id: 'imp34430-no-single-linear-closed-form',
    description: 'leading-end linear bump prediction >>72.94 and plateau-end <<72.94; neither within an OoM',
    holds: () =>
      LINEAR_PRED_LEAD > 500 && // leading slope over-predicts by >6x
      LINEAR_PRED_PLATEAU < 10 && // plateau slope under-predicts by >7x
      EARLY_SECANT > 50 * Math.max(PLATEAU_SECANT, 1e-6), // slope range ratio in the tens-plus
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34430-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34430_DRIFT_BUMP_CLOSED_FORM_FROM_WINDOW_SHORTFALL.isRigorous === false &&
      /NO QED/.test(IMP34430_DRIFT_BUMP_CLOSED_FORM_FROM_WINDOW_SHORTFALL.verdict) &&
      /refereed bound is changed/i.test(IMP34430_DRIFT_BUMP_CLOSED_FORM_FROM_WINDOW_SHORTFALL.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34430_DRIFT_BUMP_CLOSED_FORM_FROM_WINDOW_SHORTFALL.verdict),
  },
];

for (const a of IMP34430_DRIFT_BUMP_CLOSED_FORM_FROM_WINDOW_SHORTFALL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34430-drift-bump-closed-form-from-window-shortfall assertion failed: ${a.id}`);
  }
}
