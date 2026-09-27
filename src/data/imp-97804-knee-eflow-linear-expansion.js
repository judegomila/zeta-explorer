/**
 * @module imp-97804-knee-eflow-linear-expansion
 *
 * imp-97804 (proof/derivation, frontier-direction): imp-97781 F3 MEASURED the imp-33721 sub-decade
 * exponent-ramp knee to be strongly E_flow-displaced -- the knee-to-crossover offset moves
 * d(offset)/d(amp) ~ -1.77 percentage points per unit E_flow amplitude even though E_flow/E_trunc ~
 * 1.9e-3 at the knee -- and explained it as a curvature (D2) landmark that "amplifies the small flow
 * term by ~1000x", but only numerically. Following the imp-33744 precedent (the closed form
 * sigma_infl = 1/2 - g_prime/(2 g^2) for the sigmoid inflection), this module DERIVES a first-order
 * E_flow-linear expansion of the knee position log10 N*(amp), checks it against the measured slope,
 * and decomposes which sub-term supplies the amplification.
 *
 * THE MODEL (identical sub-terms to imp-33721 / imp-97781 -- no fresh terms)
 * ------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + amp * E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     C_F      = (log(T0/2pi) + 1) / 2pi     (imp-398 pinned prefactor).
 * Write t = ln N and normalise to E_trunc: rho = E_coll/E_trunc, phi = E_flow/E_trunc (amp = 1). Let
 * g = -d ln rho/dt (the E_coll decay rate, ~ 1/2) and h = -d ln phi/dt (the E_flow decay rate).
 *
 * THE DERIVATION (first-order in amp -- closed form for the local exponent and its odds sub-term)
 * ---------------------------------------------------------------------------------------------
 *   The local decay exponent p = -d ln sigma/dt collapses to a single ratio:
 *       p = [ g + amp * phi * (g - h) ] / (1 + amp * phi + rho).                     (exact)
 *   At amp = 0 this is p0 = g/(1 + rho) = g (1 - sigma), reproducing imp-33744 exactly. The knee is
 *   the exponent-ramp inflection d2p/dt2 = 0; call its root t*(amp). To first order in amp,
 *       t*(amp) = t*(0) + amp * delta + O(amp^2),   delta = -[ d/damp (p_tt) ] / [ d/dt (p_tt) ],
 *   evaluated at the amp = 0 knee (p_tt = d2p/dt2). There are TWO physically distinct contributions:
 *
 *   (A) ODDS-PRESERVATION sub-term (closed form). Adding amp * phi to the denominator lowers sigma at
 *       fixed N; the odds O = sigma/(1-sigma) = rho/(1 + amp * phi), so holding the knee sigma-value
 *       fixed forces rho up by the factor (1 + amp * phi), i.e. d ln rho = amp * phi. Since
 *       d ln rho/dt = -g, the knee moves by dt = -amp * phi / g, giving the CLOSED FORM
 *           d log10 N* / d amp |_odds  =  - phi / (g * ln 10).
 *   (B) CURVATURE (knee-sigma-shift) sub-term. The knee sigma-value itself shifts with amp because
 *       E_flow enters p with the weight (g - h): E_flow decays FASTER than E_coll (h ~ 0.855 >
 *       g ~ 0.477, so h/g ~ 1.79 and g - h < 0), so its contribution to the D2 curvature of the ramp
 *       carries extra t-derivative leverage over the tiny intrinsic log-curvature (g'' ~ 1/t^3). This
 *       is the "amplification". It has no fully-reduced algebraic closed form here (the IFT third
 *       derivative is numerically fragile at that curvature scale); it is pinned as the residual
 *       S_curv = S_total - S_odds and keyed to h/g -- the one named sub-gap of this module.
 *
 * THE FINDING (derivation / measurement -- reproduces imp-97781, refines its "~1000x")
 * -----------------------------------------------------------------------------------
 *   (F1) THE CLOSED-FORM CONTINUOUS KNEE REPRODUCES THE MEASURED SLOPE. Solving the continuous
 *        d2p/dt2 = 0 root by bisection and central-differencing in amp gives
 *        d log10 N* / d amp ~ -0.00735, matching the imp-97781 discrete quarter-decade D2 estimator
 *        (-0.0075) to ~2%, and the offset slope d(N* / N_cross - 1) / d amp ~ -1.74 pp/amp matches the
 *        imp-97781 measured -1.77 pp/amp to ~2%. The continuous p_tt = 0 knee is thus a faithful
 *        closed-form proxy for the imp-33721 discrete knee, and its E_flow sensitivity IS captured.
 *   (F2) THE ODDS SUB-TERM IS ~23%, THE CURVATURE SUB-TERM IS ~77%. The closed-form odds piece
 *        -phi/(g ln 10) ~ -0.00168 accounts for only ~23% of the -0.00735 total; the remaining ~77%
 *        (-0.00566) is the curvature knee-sigma shift keyed by h/g ~ 1.79. So the DOMINANT amplifier
 *        is the flow decay rate h entering the exponent-ramp D2, NOT the direct denominator shift.
 *   (F3) THE "~1000x" IS AN OVERSTATEMENT; THE PINNED AMPLIFICATION IS ~9.4x. The dimensionless
 *        amplification A = |d(offset fraction)/d amp| / (E_flow/E_trunc at the knee) = 0.01744 /
 *        0.001851 ~ 9.4 -- the offset moves ~9x more than the bare E_flow/E_trunc ratio, not 1000x.
 *        The imp-97781 "~1000x" heuristic (comparing a percentage-point offset to a raw ratio) is
 *        refined here to the pinned ~9-10x, decomposed as ~23% odds + ~77% curvature (h/g ~ 1.79).
 *
 * The punchline: the knee position expands as log10 N*(amp) = log10 N*(0) - [phi/(g ln 10)] * amp -
 * S_curv * amp + O(amp^2), whose FIRST (closed-form) odds sub-term is only ~23% of the measured slope;
 * the E_flow amplification imp-97781 saw is dominated by the CURVATURE sub-term, keyed by the flow
 * decay rate h/g ~ 1.79, and the true amplification is ~9.4x, not ~1000x.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA. SUB-GAP: the curvature sub-term S_curv (~77% of the
 * slope) is pinned as a residual keyed to h/g, NOT reduced to a standalone algebraic closed form.
 *
 * @see imp-97781-knee-crossover-eflow-sensitivity (measured knee E_flow slope -1.77 pp/amp, "~1000x")
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed-form-expansion precedent sigma_infl)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee estimator, log10 N* ~ 9.529)
 * @see imp-398-e-flow-prefactor (C_F Gronwall flow prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY } from './imp-97781-knee-crossover-eflow-sensitivity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721/imp-97781 exactly

// EXACT imp-97781 sub-terms with the E_flow amplitude knob (amp = 1 is baseline).
function parts(N, amp) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = amp * C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}
const sigmaAmp = (N, amp) => parts(N, amp).sigma;

// Local decay exponent p = -d ln sigma/dt (t = ln N) and its second t-derivative (the ramp curvature).
function pExp(N, amp) {
  const t = Math.log(N);
  const h = 1e-4;
  const f = (tt) => Math.log(sigmaAmp(Math.exp(tt), amp));
  return -((f(t + h) - f(t - h)) / (2 * h));
}
function pTT(N, amp) {
  const t = Math.log(N);
  const h = 2e-3;
  return (pExp(Math.exp(t + h), amp) - 2 * pExp(Math.exp(t), amp) + pExp(Math.exp(t - h), amp)) / (h * h);
}

// Continuous knee: the single d2p/dt2 = 0 root on [1e9, 1e11], the closed-form proxy for the imp-33721
// discrete quarter-decade D2 knee. Bisected in t = ln N.
function kneeT(amp) {
  let lo = Math.log(1e9);
  let hi = Math.log(1e11);
  let flo = pTT(Math.exp(lo), amp);
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    const fm = pTT(Math.exp(m), amp);
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = m;
      flo = fm;
    } else {
      hi = m;
    }
  }
  return (lo + hi) / 2;
}

// N_cross: the E_coll = E_trunc crossover (E_flow-independent anchor, imp-97781 F2), for the offset.
function crossingAbovePeak(f) {
  let a = Math.log(9.22e5);
  let b = Math.log(1e80);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_CROSS = crossingAbovePeak((N) => parts(N, 1).E_coll - E_TRUNC_PT); // ~3.280294e9

// --- baseline knee (amp = 1) + first-order E_flow-linear slope (central difference in amp) ---
const T_KNEE = kneeT(1);
const N_KNEE = Math.exp(T_KNEE);
const LOG10_NSTAR_AMP1 = T_KNEE / Math.LN10;
const S_TOTAL = (kneeT(1.1) - kneeT(0.9)) / 0.2 / Math.LN10; // d log10 N*/d amp
const D_LN_N = S_TOTAL * Math.LN10;
const OFFSET_FACTOR = N_KNEE / N_CROSS; // N*/N_cross ~ 1.03
const OFFSET_SLOPE_PP = OFFSET_FACTOR * D_LN_N * 100; // d(N*/N_cross - 1)/d amp in percentage points

// --- closed-form sub-terms at the knee: rho, phi, g = -d ln rho/dt, h = -d ln phi/dt ---
function dlogAt(fOfT) {
  const hh = 1e-5;
  return (Math.log(fOfT(T_KNEE + hh)) - Math.log(fOfT(T_KNEE - hh))) / (2 * hh);
}
const RHO = parts(N_KNEE, 0).E_coll / E_TRUNC_PT;
const PHI = parts(N_KNEE, 1).E_flow / E_TRUNC_PT;
const G = -dlogAt((t) => parts(Math.exp(t), 0).E_coll / E_TRUNC_PT); // ~0.477
const H = -dlogAt((t) => parts(Math.exp(t), 1).E_flow / E_TRUNC_PT); // ~0.855
const H_OVER_G = H / G;

// (A) odds-preservation closed form; (B) curvature residual (the named sub-gap).
const S_ODDS = -PHI / (G * Math.LN10);
const S_CURV = S_TOTAL - S_ODDS;
const FRAC_ODDS = S_ODDS / S_TOTAL;
const FRAC_CURV = S_CURV / S_TOTAL;

// Dimensionless amplification: fractional-offset slope over the bare E_flow/E_trunc ratio at the knee.
const AMPLIFICATION = Math.abs(OFFSET_SLOPE_PP / 100) / PHI; // ~9.4, NOT ~1000

// Reuse gate against imp-97781 (same model, same measured slope).
const IMP97781_MEASURED_SLOPE = IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.eflowSensitivity.dLog10NstarPerUnitAmp; // ~-0.0075
const IMP97781_MEASURED_OFFSET_PP = IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.eflowSensitivity.dOffsetPtsPerUnitAmp; // ~-1.77
const IMP97781_LOG10_NSTAR = IMP97781_KNEE_CROSSOVER_EFLOW_SENSITIVITY.baseline.log10Nstar; // ~9.5286

export const IMP97804_KNEE_EFLOW_LINEAR_EXPANSION = {
  id: 'imp-97804',
  proofSection: 'S-frontier',
  question:
    'imp-97781 F3 measured the imp-33721 sub-decade exponent-ramp knee to move ~1.77 pp per unit ' +
    'E_flow amplitude despite E_flow/E_trunc ~ 1.9e-3 at the knee, calling it a ~1000x curvature ' +
    'amplification, but only numerically. Following the imp-33744 closed-form-expansion precedent, ' +
    'derive a first-order E_flow-linear expansion of the knee position log10 N*(amp), check it ' +
    'against the measured slope, and isolate which sub-term supplies the amplification. ' +
    'Derivation/measurement only; C_mb GUE-conditional (imp-486) untouched; no bound moves; NO QED.',
  derivedQuantity:
    'first-order expansion log10 N*(amp) = log10 N*(0) + S_total * amp, with the local exponent in ' +
    'closed form p = [g + amp phi (g-h)]/(1 + amp phi + rho) (t = ln N, rho = E_coll/E_trunc, ' +
    'phi = E_flow/E_trunc, g = -d ln rho/dt, h = -d ln phi/dt) and the odds sub-term ' +
    'S_odds = -phi/(g ln 10) split from the curvature residual S_curv',
  localExponentClosedForm: 'p = [ g + amp * phi * (g - h) ] / (1 + amp * phi + rho)',
  kneeExpansion: 'log10 N*(amp) = log10 N*(0) - [phi/(g ln 10)] * amp - S_curv * amp + O(amp^2)',
  oddsSubTermClosedForm: 'd log10 N*/d amp |_odds = - phi / (g * ln 10)  (holds the knee odds rho/(1+amp phi) fixed)',
  // pinned numbers (raw imp-97781 model)
  log10Nstar_amp1: +LOG10_NSTAR_AMP1.toFixed(5), // ~9.52906 (continuous knee)
  N_cross: +N_CROSS.toExponential(6), // 3.280294e9
  slope_dLog10Nstar_dAmp: +S_TOTAL.toFixed(6), // ~-0.00735
  offsetSlope_ppPerUnitAmp: +OFFSET_SLOPE_PP.toFixed(4), // ~-1.744
  rhoAtKnee: +RHO.toFixed(5),
  phiAtKnee: +PHI.toExponential(4), // ~1.85e-3
  gAtKnee: +G.toFixed(5), // ~0.477
  hAtKnee: +H.toFixed(5), // ~0.855
  hOverG: +H_OVER_G.toFixed(4), // ~1.79
  slope_odds_closedForm: +S_ODDS.toFixed(6), // ~-0.00168
  slope_curv_residual: +S_CURV.toFixed(6), // ~-0.00566
  fracOdds: +FRAC_ODDS.toFixed(4), // ~0.23
  fracCurv: +FRAC_CURV.toFixed(4), // ~0.77
  amplification: +AMPLIFICATION.toFixed(3), // ~9.4 (refines imp-97781 "~1000x")
  imp97781MeasuredSlope: IMP97781_MEASURED_SLOPE,
  imp97781MeasuredOffsetPP: IMP97781_MEASURED_OFFSET_PP,
  finding: {
    F1_closed_form_reproduces_measured_slope:
      'The continuous d2p/dt2 = 0 knee gives d log10 N*/d amp ~ ' + (+S_TOTAL.toFixed(5)) + ', matching ' +
      'the imp-97781 discrete quarter-decade D2 estimator (' + IMP97781_MEASURED_SLOPE + ') to ~2%, and ' +
      'the offset slope ~ ' + (+OFFSET_SLOPE_PP.toFixed(2)) + ' pp/amp matches the imp-97781 measured ' +
      IMP97781_MEASURED_OFFSET_PP + ' pp/amp to ~2%. The continuous knee is a faithful closed-form proxy.',
    F2_odds_23pct_curvature_77pct:
      'The closed-form odds sub-term -phi/(g ln 10) ~ ' + (+S_ODDS.toFixed(5)) + ' accounts for only ~' +
      (+(FRAC_ODDS * 100).toFixed(0)) + '% of the slope; the remaining ~' + (+(FRAC_CURV * 100).toFixed(0)) +
      '% (' + (+S_CURV.toFixed(5)) + ') is the curvature knee-sigma shift keyed by h/g ~ ' +
      (+H_OVER_G.toFixed(2)) + ' -- E_flow decays ~1.8x faster than E_coll, entering the ramp D2 with ' +
      'extra t-derivative leverage. The dominant amplifier is the flow decay rate h, NOT the denominator shift.',
    F3_amplification_is_about_9x_not_1000x:
      'The dimensionless amplification A = |d(offset fraction)/d amp| / (E_flow/E_trunc at knee) = ' +
      (+Math.abs(OFFSET_SLOPE_PP / 100).toExponential(3)) + ' / ' + (+PHI.toExponential(3)) + ' ~ ' +
      (+AMPLIFICATION.toFixed(1)) + '. The imp-97781 "~1000x" heuristic (a pp offset compared to a raw ' +
      'ratio) is refined to the pinned ~' + (+AMPLIFICATION.toFixed(0)) + 'x, decomposed as ~' +
      (+(FRAC_ODDS * 100).toFixed(0)) + '% odds + ~' + (+(FRAC_CURV * 100).toFixed(0)) + '% curvature (h/g ~ ' +
      (+H_OVER_G.toFixed(2)) + ').',
  },
  subGap:
    'The curvature sub-term S_curv (~77% of the slope) is pinned as the residual S_total - S_odds and ' +
    'keyed to h/g, NOT reduced to a standalone algebraic closed form: the implicit-function-theorem ' +
    'third t-derivative of p is numerically fragile at the tiny intrinsic log-curvature scale ' +
    '(g double-prime ~ 1/t^3). A fully-reduced closed form for S_curv is the one open piece.',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The local exponent has the exact closed form ' +
    'p = [g + amp phi (g-h)]/(1 + amp phi + rho) (reproducing imp-33744 p0 = g(1-sigma) at amp = 0), ' +
    'and the knee expands as log10 N*(amp) = log10 N*(0) - [phi/(g ln 10)] amp - S_curv amp + O(amp^2). ' +
    'The continuous d2p/dt2 = 0 knee gives d log10 N*/d amp ~ ' + (+S_TOTAL.toFixed(5)) + ', reproducing ' +
    'the imp-97781 measured ' + IMP97781_MEASURED_SLOPE + ' (and offset slope ~' + (+OFFSET_SLOPE_PP.toFixed(2)) +
    ' vs ' + IMP97781_MEASURED_OFFSET_PP + ' pp/amp) to ~2%. The CLOSED-FORM odds sub-term ' +
    '-phi/(g ln 10) ~ ' + (+S_ODDS.toFixed(5)) + ' is only ~' + (+(FRAC_ODDS * 100).toFixed(0)) + '% of the ' +
    'slope; the dominant ~' + (+(FRAC_CURV * 100).toFixed(0)) + '% is the curvature knee-sigma shift keyed by ' +
    'the flow decay rate h/g ~ ' + (+H_OVER_G.toFixed(2)) + '. The dimensionless amplification is A ~ ' +
    (+AMPLIFICATION.toFixed(1)) + ', so the imp-97781 "~1000x" is refined to the pinned ~' +
    (+AMPLIFICATION.toFixed(0)) + 'x. SUB-GAP: S_curv is pinned as a residual keyed to h/g, NOT reduced to a ' +
    'standalone closed form (the IFT third derivative is fragile at g double-prime ~ 1/t^3). The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97781 (measured knee E_flow slope -1.77 pp/amp, "~1000x"); imp-33744 (closed-form-expansion ' +
    'precedent sigma_infl = 1/2 - g_prime/(2 g^2)); imp-33721 (sub-decade knee log10 N* ~ 9.529); ' +
    'imp-398 (E_flow C_F Gronwall prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP97804_KNEE_EFLOW_LINEAR_EXPANSION_ASSERTIONS = [
  {
    // Reuse gate: the continuous knee reproduces the imp-97781 baseline knee log10 N* to < 0.01,
    // proving the IDENTICAL sigma model / sub-terms are in use before the derivation is read.
    id: 'imp97804-reuses-imp97781-knee',
    description: 'continuous knee log10 N* (amp=1) matches the imp-97781 baseline knee to < 0.01',
    holds: () => Math.abs(LOG10_NSTAR_AMP1 - IMP97781_LOG10_NSTAR) < 0.01,
  },
  {
    // (F1): the closed-form continuous-knee slope reproduces the imp-97781 measured d log10 N*/damp
    // to ~5% -- the derivation, not a fit, sets the slope.
    id: 'imp97804-slope-matches-imp97781',
    description: 'continuous-knee d log10 N*/damp reproduces the imp-97781 measured ~-0.0075 to ~5%',
    holds: () =>
      S_TOTAL < 0 &&
      Math.abs(S_TOTAL / IMP97781_MEASURED_SLOPE - 1) < 0.05,
  },
  {
    // (F1): the offset slope in percentage points reproduces the imp-97781 measured ~-1.77 pp/amp.
    id: 'imp97804-offset-slope-matches-imp97781',
    description: 'offset slope ~-1.74 pp/amp reproduces the imp-97781 measured ~-1.77 pp/amp to ~5%',
    holds: () =>
      OFFSET_SLOPE_PP < 0 &&
      Math.abs(OFFSET_SLOPE_PP / IMP97781_MEASURED_OFFSET_PP - 1) < 0.05,
  },
  {
    // (F2): the closed-form odds sub-term is a minority (~15..35%) of the slope -- the direct
    // denominator shift is NOT the dominant contribution.
    id: 'imp97804-odds-subterm-is-minority',
    description: 'odds sub-term -phi/(g ln10) is ~15..35% of the total slope (curvature dominates)',
    holds: () => FRAC_ODDS > 0.15 && FRAC_ODDS < 0.35 && S_ODDS < 0,
  },
  {
    // (F2): the curvature amplifier is keyed by the flow decay rate exceeding the collapse rate,
    // h/g > 1 (E_flow decays faster than E_coll), landing near ~1.8.
    id: 'imp97804-hoverg-exceeds-one',
    description: 'flow-to-collapse decay ratio h/g > 1 (near ~1.8): E_flow decays faster, feeding the D2 leverage',
    holds: () => H_OVER_G > 1.5 && H_OVER_G < 2.1 && H > G,
  },
  {
    // (F3): the pinned amplification is ~5..20x, refuting the imp-97781 "~1000x" heuristic.
    id: 'imp97804-amplification-is-order-ten-not-thousand',
    description: 'pinned amplification A ~ 5..20x (refines the imp-97781 "~1000x" heuristic)',
    holds: () => AMPLIFICATION > 5 && AMPLIFICATION < 20,
  },
  {
    // Honesty gate: derivation/measurement only, named sub-gap, no QED, PT stays SOTA.
    id: 'imp97804-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, sub-gap named, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97804_KNEE_EFLOW_LINEAR_EXPANSION.isRigorous === false &&
      /NOT reduced to a standalone/.test(IMP97804_KNEE_EFLOW_LINEAR_EXPANSION.subGap) &&
      /NO QED/.test(IMP97804_KNEE_EFLOW_LINEAR_EXPANSION.verdict) &&
      /remains SOTA/.test(IMP97804_KNEE_EFLOW_LINEAR_EXPANSION.verdict),
  },
];

for (const a of IMP97804_KNEE_EFLOW_LINEAR_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97804-knee-eflow-linear-expansion assertion failed: ${a.id}`);
  }
}
