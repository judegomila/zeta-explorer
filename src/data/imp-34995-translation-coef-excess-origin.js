/**
 * @module imp-34995-translation-coef-excess-origin
 *
 * imp-34995 (numerical, frontier): imp-34950 F3 confirmed the landmark-translation coefficient
 * dx* /d ln(C_mb) ~ 2.06, close to the "ideal" value 2 predicted by the additive ln(C_mb) log-odds
 * shift composed with the dominant -x/2 slope of u_0. imp-34950 reported the ~3% EXCESS over 2 only in
 * passing ("near the predicted 2") and never quantified or attributed it; the imp-35006 glossary
 * headword HEURISTICALLY attributed the excess to the same log-odds-DERIVATIVE feedback that produces
 * the ~12% exponent-transmission deficit (p ~ 1.549 vs the naive composite 2 q_eff ~ 1.76). This module
 * reuses the imp-34950 / imp-34925 landmark kernels VERBATIM and DECOMPOSES the ~3% translation-coefficient
 * excess into (i) a level-landmark SURROGATE-CURVATURE part and (ii) a log-odds-DERIVATIVE (inflection-
 * condition) part, then tests whether the excess shares the origin of the ~12% transmission deficit.
 *
 * THE DECOMPOSITION (the two candidate origins, isolated)
 * -------------------------------------------------------
 * C_mb enters u only as an additive constant c = ln(C_mb) (it shifts the level, not the x-derivatives).
 *   (i)  LEVEL landmark (u(x*) = const): dx* /dc = -1/u'(x*). This equals 2 EXACTLY only when u'(x*) = -1/2,
 *        i.e. when u_0 carries its x-dependence purely through -x/2. On the surrogate u' = -1/2 + 0.5 L'(x)/L(x)
 *        + phi'(x), so u' deviates from -1/2 by the slowly-varying effective-height term 0.5 L'/L and the tiny
 *        E_flow-ramp term phi'. This deviation is a SURROGATE-CURVATURE effect (it involves NO sigmoid feedback).
 *   (ii) The ACTUAL landmark is the INFLECTION/derivative condition (1-2S)u'^2 + u'' = 0, so the S(1-S)
 *        level-sensitivity of the sigmoid feeds into the translation: dx* /dc = 2 S(1-S) u'^2 / (dF/dx). The gap
 *        between the actual inflection coefficient and the level-landmark -1/u' is the pure LOG-ODDS-DERIVATIVE
 *        (inflection-condition) contribution -- the SAME structural mechanism blamed for the ~12% deficit.
 * The identity tc/2 - 1 = [(-1/u')/2 - 1] + [(tc - (-1/u'))/2] splits the excess additively into (i) + (ii).
 *
 * THE FINDING (measurement only; answers imp-34995)
 * -------------------------------------------------
 *   (F1) EXCESS QUANTIFIED: the inflection-landmark coefficient is tc = dx* /d ln(C_mb) ~ 2.0636 (reproducing
 *        imp-34950's ~2.06), a +3.18% excess over 2, stable to < 1e-4 across the finite-difference step.
 *   (F2) THE EXCESS IS DOMINATED BY SURROGATE CURVATURE, NOT THE LOG-ODDS DERIVATIVE. The additive split is
 *        level-landmark (surrogate-curvature) part ~ +5.02% (of which the 0.5 L'/L height term is ~ +4.75% and
 *        phi' only ~ +0.25%), and log-odds-derivative (inflection-condition) part ~ -1.84%. The two have
 *        OPPOSITE sign and partially cancel to the net +3.18%: the curvature term drives the excess, and the
 *        log-odds-derivative feedback actually REDUCES the coefficient.
 *   (F3) DISTINCT ORIGIN. The ~12% transmission deficit (p ~ 1.549 vs 2 q_eff ~ 1.76) IS the log-odds-derivative
 *        effect: s* enters u', u'' through phi, so only ~88% of the naive translation x local-exponent product
 *        transmits into the exponent. But on the translation coefficient itself the log-odds-derivative
 *        contribution is small AND opposite-signed (-1.84%), while the excess over 2 is dominated by the distinct
 *        surrogate-curvature (effective-height) term. So the ~3% excess does NOT share the same origin as the
 *        ~12% deficit -- it is a distinct surrogate curvature effect, partially CORRECTING the imp-35006
 *        heuristic that lumped the two together.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited imp-3220/imp-3406 surrogate, NOT an RH bound.
 * SWEEPS C_mb as a free knob and DECOMPOSES a fitted sensitivity; it does NOT discharge the GUE conditional
 * (C_mb GUE-conditional per imp-486). The level-vs-inflection split is a numerical attribution on the surrogate,
 * NOT a rigorous derivation. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the F3 translCoef ~2.06 + ~12% deficit this decomposes)
 * @see imp-35006 (the glossary headword heuristically attributing the ~3% excess to the log-odds derivative)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34886/imp-34925/imp-34950 exactly
const A = C_C_PINNED / E_TRUNC_PT;

// --- kernels reused VERBATIM from imp-34950 (C_mb enters u_0 as an additive ln C_mb shift) ------------------
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
function u0(x, cmb) {
  return Math.log(cmb) + Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
function uFull(x, s, cmb) {
  return u0(x, cmb) + phi(x, s);
}
function sigmaOf(x, s, cmb) {
  return 1 / (1 + Math.exp(-uFull(x, s, cmb)));
}
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
function d2Cond(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const up = d1((z) => uFull(z, s, cmb), x, h);
  const upp = d2((z) => uFull(z, s, cmb), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const v = -d1((z) => uFull(z, s, cmb), x, h);
  const vp = -d2((z) => uFull(z, s, cmb), x, h);
  const vpp = -d3((z) => uFull(z, s, cmb), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
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
const LO = Math.log(1e6);
const HI = Math.log(1e13);
function kneeAt(s, cmb) {
  return bisect((x) => fKnee(x, s, cmb, H_ID), LO, HI);
}
function inflAt(s, cmb) {
  return bisect((x) => d2Cond(x, s, cmb, H_ID), LO, HI);
}
function gapAt(s, cmb) {
  return (kneeAt(s, cmb) - inflAt(s, cmb)) / Math.LN10;
}
function sStarAt(cmb) {
  return bisect((s) => gapAt(s, cmb), 0, 1);
}

// baseline: the crossing strength and its inflection landmark at C_mb = 1 (reproduces imp-34886/imp-34950).
const S_STAR_AT_1 = sStarAt(1.0); // ~0.77765
const X_STAR_AT_1 = inflAt(S_STAR_AT_1, 1.0); // ~21.945 (N* ~ 3.4e9)

// --- (F1) the inflection-landmark translation coefficient dx* /d ln C_mb, and its excess over the ideal 2 ----
function translCoef(cmb, eps) {
  const xp = inflAt(S_STAR_AT_1, cmb * Math.exp(eps));
  const xm = inflAt(S_STAR_AT_1, cmb * Math.exp(-eps));
  return (xp - xm) / (2 * eps);
}
const TRANSL_COEF = translCoef(1.0, 1e-3); // ~2.0636
const IDEAL = 2.0;
const EXCESS_TOTAL = TRANSL_COEF / IDEAL - 1; // ~+0.0318

// robustness of the finite-difference coefficient across the step eps.
const TC_EPS_SPREAD = Math.abs(translCoef(1.0, 5e-4) - translCoef(1.0, 2e-3));

// --- (F2) decompose the excess: surrogate-curvature (level-landmark) part vs log-odds-derivative part --------
// u'(x*) and its constituent pieces at the landmark, at fixed s = s*(1).
const U_PRIME = d1((z) => uFull(z, S_STAR_AT_1, 1.0), X_STAR_AT_1, H_ID); // ~-0.4761
const HALF_LP_OVER_L = 0.5 * d1((z) => Lof(z), X_STAR_AT_1, H_ID) / Lof(X_STAR_AT_1); // ~+0.0227 (height curvature)
const PHI_PRIME = d1((z) => phi(z, S_STAR_AT_1), X_STAR_AT_1, H_ID); // ~+0.0012 (E_flow ramp)
// LEVEL-landmark coefficient (u(x*) = const holds): dx* /dc = -1/u'(x*); equals 2 exactly iff u' = -1/2.
const TC_LEVEL = -1 / U_PRIME; // ~2.1004
const EXCESS_CURVATURE = TC_LEVEL / IDEAL - 1; // ~+0.0502 (the surrogate-curvature part of the excess)
// LOG-ODDS-DERIVATIVE part: gap between the actual inflection coefficient and the level-landmark coefficient.
const EXCESS_LOGODDS = (TRANSL_COEF - TC_LEVEL) / IDEAL; // ~-0.0184 (opposite sign)
// additive-identity residual: EXCESS_TOTAL == EXCESS_CURVATURE + EXCESS_LOGODDS by construction.
const DECOMP_RESIDUAL = Math.abs(EXCESS_TOTAL - (EXCESS_CURVATURE + EXCESS_LOGODDS));
// sub-split of the curvature part into the height (0.5 L'/L) and E_flow-ramp (phi') contributions.
const EXCESS_FROM_LPL = -1 / (-0.5 + HALF_LP_OVER_L) / IDEAL - 1; // ~+0.0475 (dominant)
const EXCESS_FROM_PHIP = -1 / (-0.5 + PHI_PRIME) / IDEAL - 1; // ~+0.0025 (negligible)

// --- (F3) the ~12% transmission deficit (the genuine log-odds-derivative effect) for contrast ---------------
function qEffAt(x) {
  const eps = 1e-3;
  return -(Math.log(eflowRatio(x + eps)) - Math.log(eflowRatio(x - eps))) / (2 * eps);
}
const Q_EFF = qEffAt(X_STAR_AT_1); // ~0.855
// pinned exponent p on the reused 21-point C_mb grid (as in imp-34950).
const CMB_GRID = [];
for (let i = 0; i <= 20; i++) CMB_GRID.push(+(1.0 - 0.025 * i).toFixed(4));
const S_STAR = CMB_GRID.map((c) => sStarAt(c));
const LC = CMB_GRID.map((c) => Math.log(c));
const LS = S_STAR.map((s) => Math.log(s));
let num = 0, den = 0;
for (let i = 0; i < CMB_GRID.length; i++) {
  num += (LS[i] - Math.log(S_STAR[0])) * LC[i];
  den += LC[i] * LC[i];
}
const P_PINNED = num / den; // ~1.5493
const P_STRUCT_LOCAL = TRANSL_COEF * Q_EFF; // ~1.76 (naive translation x local-exponent composite)
const TRANSMISSION_DEFICIT = 1 - P_PINNED / P_STRUCT_LOCAL; // ~+0.122 (the ~12% deficit)

export const IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN = {
  id: 'imp-34995',
  proofSection: 'S-frontier',
  question:
    'imp-34950 F3 confirmed the landmark-translation coefficient dx* /d ln(C_mb) ~ 2.06 but never quantified ' +
    'or attributed the ~3% excess over the ideal 2, and the imp-35006 glossary heuristically ascribed it to ' +
    'the same log-odds-derivative feedback that produces the ~12% exponent-transmission deficit. Measure the ' +
    'excess and assess whether it shares that log-odds-derivative origin or is a distinct surrogate curvature ' +
    'effect. Measurement only; SWEEPS C_mb, does NOT discharge the GUE conditional (imp-486); no bound; NO QED.',
  verdictShort:
    'The inflection-landmark translation coefficient is dx* /d ln(C_mb) ~ 2.064, a +3.18% excess over 2. ' +
    'Decomposing it additively: the level-landmark SURROGATE-CURVATURE part is ~+5.02% (dominated by the ' +
    'slowly-varying 0.5 L\'/L effective-height term ~+4.75%; the E_flow-ramp phi\' term is only ~+0.25%), ' +
    'while the LOG-ODDS-DERIVATIVE (inflection-condition) part is ~-1.84% -- OPPOSITE sign, partially ' +
    'cancelling to the net +3.18%. The ~12% transmission deficit IS the log-odds-derivative effect (s* into ' +
    'u_x and u_xx), but its contribution to the translation coefficient is small and opposite-signed, so the ~3% ' +
    'excess is DOMINATED by a DISTINCT surrogate-curvature effect and does NOT share the deficit origin.',
  measuredQuantity:
    'the inflection-landmark translation coefficient tc = dx* /d ln(C_mb) at C_mb=1 and its excess over 2, ' +
    'additively decomposed into a level-landmark surrogate-curvature part (-1/u\'(x*), split into the 0.5 L\'/L ' +
    'height term and the phi\' E_flow-ramp term) and a log-odds-derivative inflection-condition part ' +
    '(tc - (-1/u\')), contrasted against the ~12% exponent-transmission deficit 1 - p/(tc q_eff)',
  translationExcess: {
    transl_coef: +TRANSL_COEF.toFixed(5), // ~2.06363
    ideal: IDEAL,
    excess_total_frac: +EXCESS_TOTAL.toFixed(5), // ~+0.03182
    tc_eps_spread: +TC_EPS_SPREAD.toExponential(3), // < 1e-4 (finite-difference stable)
  },
  decomposition: {
    excess_curvature_frac: +EXCESS_CURVATURE.toFixed(5), // ~+0.05021 (level-landmark surrogate curvature)
    excess_logodds_frac: +EXCESS_LOGODDS.toFixed(5), // ~-0.01839 (log-odds-derivative, OPPOSITE sign)
    decomp_residual: +DECOMP_RESIDUAL.toExponential(3), // ~0 (additive identity)
    curvature_from_height_LpL_frac: +EXCESS_FROM_LPL.toFixed(5), // ~+0.04751 (dominant curvature driver)
    curvature_from_ramp_phip_frac: +EXCESS_FROM_PHIP.toFixed(5), // ~+0.00246 (negligible)
    u_prime_at_landmark: +U_PRIME.toFixed(5), // ~-0.47610 (deviates from -1/2 by the height term)
    note:
      'C_mb enters u only as the additive constant ln(C_mb), so it shifts the LEVEL not the x-derivatives. The ' +
      'level-landmark coefficient -1/u\'(x*) exceeds 2 by ~+5.02% purely because u\'(x*) ~ -0.476 deviates from ' +
      '-1/2 via the slowly-varying 0.5 L\'/L effective-height term (~+4.75%) and a tiny phi\' ramp term (~+0.25%) ' +
      '-- a surrogate-curvature effect with NO sigmoid feedback. The actual INFLECTION landmark introduces the ' +
      'S(1-S) log-odds-derivative feedback, which REDUCES the coefficient by ~1.84%. Net excess +3.18% = +5.02% ' +
      'curvature - 1.84% log-odds-derivative.',
  },
  transmissionDeficitContrast: {
    q_eff: +Q_EFF.toFixed(4), // ~0.855
    p_pinned: +P_PINNED.toFixed(5), // ~1.5493
    p_struct_local: +P_STRUCT_LOCAL.toFixed(5), // ~1.764 (naive composite)
    transmission_deficit_frac: +TRANSMISSION_DEFICIT.toFixed(5), // ~+0.122 (the ~12% deficit)
    note:
      'The ~12% transmission deficit (p ~ 1.549 vs the naive composite tc q_eff ~ 1.76) IS the log-odds-derivative ' +
      'effect: s* enters u_x and u_xx through phi, so only ~88% of the naive product transmits into the exponent. On ' +
      'the translation coefficient the log-odds-derivative contribution is BOTH small AND opposite-signed (-1.84%), ' +
      'so the ~3% translation excess does NOT share the origin of the ~12% deficit.',
  },
  finding: {
    F1_excess_quantified:
      'The inflection-landmark translation coefficient is tc = dx* /d ln(C_mb) ~ 2.064 (reproducing imp-34950 ' +
      '~2.06), a +3.18% excess over the ideal 2, stable to < 1e-4 across the finite-difference step.',
    F2_excess_dominated_by_curvature:
      'Additive split: the level-landmark surrogate-curvature part is ~+5.02% (0.5 L\'/L height term ~+4.75%, ' +
      'phi\' ramp term ~+0.25%) and the log-odds-derivative inflection-condition part is ~-1.84% (OPPOSITE sign). ' +
      'They partially cancel to the net +3.18%: the excess is driven by surrogate curvature, and the ' +
      'log-odds-derivative feedback actually reduces the coefficient.',
    F3_distinct_origin_from_the_12pct_deficit:
      'The ~12% transmission deficit IS the log-odds-derivative effect (s* into u_x and u_xx), but the ' +
      'log-odds-derivative contribution to the translation coefficient is small and opposite-signed, while the ' +
      'excess over 2 is dominated by the distinct surrogate-curvature (effective-height) term. So the ~3% excess ' +
      'does NOT share the origin of the ~12% deficit -- it is a distinct surrogate curvature effect, partially ' +
      'CORRECTING the imp-35006 heuristic that lumped the two together.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Decomposing the imp-34950 F3 ~3% excess of the landmark-translation ' +
    'coefficient dx* /d ln(C_mb) over the ideal 2, on the reused imp-34950 kernels: (F1) tc ~ 2.064, a +3.18% ' +
    'excess, finite-difference stable to < 1e-4. (F2) Additive split into a level-landmark surrogate-curvature ' +
    'part ~+5.02% (dominated by the slowly-varying 0.5 L\'/L effective-height term ~+4.75%, phi\' ramp ~+0.25%) ' +
    'and a log-odds-derivative inflection-condition part ~-1.84% (OPPOSITE sign), which partially cancel to the ' +
    'net +3.18% -- so the excess is DRIVEN by surrogate curvature while the log-odds-derivative feedback REDUCES ' +
    'the coefficient. (F3) The ~12% transmission deficit (p ~ 1.549 vs tc q_eff ~ 1.76) IS the log-odds-derivative ' +
    'effect (s* into u_x and u_xx), but its contribution to the translation coefficient is small and opposite-signed, ' +
    'so the ~3% excess is a DISTINCT surrogate-curvature effect and does NOT share the deficit origin -- ' +
    'partially CORRECTING the imp-35006 heuristic. This SWEEPS C_mb as a free knob and DECOMPOSES a sensitivity; ' +
    'it does NOT discharge the GUE conditional (C_mb GUE-conditional per imp-486). The level-vs-inflection split ' +
    'is a numerical attribution on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous derivation; the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'ANSWERS imp-34995: the ~3% excess of dx* /d ln(C_mb) ~ 2.064 over 2 is +3.18% and splits additively into a ' +
    'level-landmark surrogate-curvature part +5.02% (0.5 L\'/L height term +4.75%, phi\' ramp +0.25%) MINUS a ' +
    'log-odds-derivative inflection-condition part -1.84%. So the excess is DOMINATED by a distinct surrogate ' +
    'curvature effect and does NOT share the origin of the ~12% transmission deficit (which IS the ' +
    'log-odds-derivative effect); the log-odds-derivative contribution to the coefficient is small and ' +
    'opposite-signed, partially correcting the imp-35006 heuristic. What stays OPEN (deferred, changes no ' +
    'bound): whether the +4.75% height-curvature term is surrogate-independent or drifts with the imp-3220/' +
    'imp-3406 extrapolation, and a derivation PINNING C_mb below the GUE bound of 1 (imp-486).',
  citation:
    'imp-34950 (the F3 translCoef ~2.06 and the ~12% transmission deficit decomposed here); imp-35006 (the ' +
    'glossary heuristic attributing the excess to the log-odds derivative, partially corrected here); ' +
    'imp-3463 (far-tail exponent 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN_ASSERTIONS = [
  {
    // Reuse gate: reproduces the imp-34950 F3 translation coefficient ~2.06 and its ~3% excess.
    id: 'imp34995-reproduces-imp34950-translcoef',
    description: 'inflection-landmark translation coefficient reproduces imp-34950 ~2.06 with a ~3% excess',
    holds: () => Math.abs(TRANSL_COEF - 2.06) < 0.02 && EXCESS_TOTAL > 0.02 && EXCESS_TOTAL < 0.05,
  },
  {
    // (F1): the coefficient is finite-difference stable across the step.
    id: 'imp34995-translcoef-fd-stable',
    description: 'translation coefficient is stable to < 1e-4 across the finite-difference step',
    holds: () => TC_EPS_SPREAD < 1e-4,
  },
  {
    // (F2): the additive identity holds -- total excess = curvature part + log-odds-derivative part.
    id: 'imp34995-additive-identity',
    description: 'excess_total == excess_curvature + excess_logodds (additive identity, residual ~ 0)',
    holds: () => DECOMP_RESIDUAL < 1e-9,
  },
  {
    // (F2): the excess is DOMINATED by surrogate curvature, with the log-odds part small AND opposite-signed.
    id: 'imp34995-curvature-dominates',
    description: 'curvature part is positive and larger in magnitude than the negative log-odds-derivative part',
    holds: () =>
      EXCESS_CURVATURE > 0 &&
      EXCESS_LOGODDS < 0 &&
      Math.abs(EXCESS_CURVATURE) > Math.abs(EXCESS_LOGODDS),
  },
  {
    // (F2): within the curvature part the 0.5 L'/L height term dominates the phi' ramp term.
    id: 'imp34995-height-term-dominates-curvature',
    description: 'the 0.5 L/L height curvature term dominates the phi ramp term inside the curvature part',
    holds: () => EXCESS_FROM_LPL > 0.02 && EXCESS_FROM_PHIP < 0.01 && EXCESS_FROM_LPL > 5 * EXCESS_FROM_PHIP,
  },
  {
    // (F3): the ~12% transmission deficit is reproduced and is a genuine log-odds-derivative effect (q_eff > 1/2).
    id: 'imp34995-transmission-deficit-reproduced',
    description: 'the ~12% transmission deficit is reproduced with q_eff above the far-tail 1/2',
    holds: () => TRANSMISSION_DEFICIT > 0.08 && TRANSMISSION_DEFICIT < 0.16 && Q_EFF > 0.5,
  },
  {
    // (F3): DISTINCT ORIGIN -- the log-odds contribution to the excess is opposite in sign to the deficit sign.
    id: 'imp34995-distinct-origin',
    description: 'log-odds contribution to the excess is negative while the transmission deficit is positive',
    holds: () => EXCESS_LOGODDS < 0 && TRANSMISSION_DEFICIT > 0 && EXCESS_TOTAL > 0,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp34995-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN.isRigorous === false &&
      IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN.farTailExponent === 0.5 &&
      typeof IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN.subGap === 'string' &&
      /imp-486/.test(IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN.subGap) &&
      /NO QED/.test(IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN.verdict) &&
      /refereed bound is changed/i.test(IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN.verdict),
  },
];

for (const a of IMP34995_TRANSLATION_COEF_EXCESS_ORIGIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34995-translation-coef-excess-origin assertion failed: ${a.id}`);
  }
}
