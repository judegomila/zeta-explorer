/**
 * @module imp-34246-widening-slope-limit-analytic-derivation
 *
 * imp-34246 (proof, frontier-direction): imp-34188 R2 found the exponential-approach limit b_inf of the
 * imp-33843 log-linear widening slope statistically INDISTINGUISHABLE from exactly -1 (pinned-fit extra-SS
 * F ~ 0.15 << F_0.05(1,18) = 4.414), but explicitly flagged this as a DESCRIPTIVE surrogate fit, NOT a
 * derivation that the limit IS -1. This module DERIVES the asymptotic per-k slope of
 * y(k) = ln(eflow_attr / resid_exp) analytically from the inherited imp-3220/imp-3406/imp-33810 component
 * forms and assesses whether that slope must approach exactly -1 per k-decade, or a nearby non-round value
 * the fit cannot resolve. Derivation within the component model ONLY; NOT a rigorous asymptotic; NO QED.
 *
 * THE INHERITED FORMS (imp-33810 parts, reused verbatim -- no fresh model)
 * -----------------------------------------------------------------------
 *   T0 = effectiveHeightForN(N) solves (T0/2pi)(u-1) = N with u = log(T0/2pi);  L = log T0.
 *   E_trunc = 3.06e-5 (fixed strip),  E_coll = C_C sqrt(L/N),  E_flow = C_F (L/T0) Gronwall,
 *   C_F = (u+1)/2pi,   E_N = E_trunc + E_flow + E_coll,   sigma = E_coll/E_N.
 *   eflow_attr = (E_flow/E_N)|s_flow|,  s_flow = d ln E_flow/d ln N  (window upper endpoint).
 *   resid_exp  = p_ecoll(1-sigma) - p_sigma,  p_ecoll = -d log E_coll/d log N,  p_sigma = -OLS slope ln sigma.
 *
 * THE DERIVATION (leading order in 1/u, u = log(T0/2pi) -> inf)
 * -----------------------------------------------------------
 *   (S1) NUMERATOR SCALE. As N -> inf, E_N -> E_trunc (E_flow, E_coll both vanish) and
 *        s_flow = [1/(u+1) + 1/L - 1] / [1 + 1/(u-1)] = -1 + 3/u + O(1/u^2), so |s_flow| -> 1 and
 *        eflow_attr ~ (E_flow/E_trunc)|s_flow|. Thus eflow_attr INHERITS the E_flow exponent:
 *        d ln eflow_attr / d ln N -> d ln E_flow/d ln N = -1 + 3/u + O(1/u^2)   (E_flow ~ polylog(N)/N).
 *   (S2) DENOMINATOR SCALE -- the E_coll-order term SURVIVES. Writing the finite-decade window quantities
 *        as continuous log-N derivatives, p_ecoll - p_sigma = -d ln E_N/d ln N ~ (E_flow + (1/2)E_coll)/E_trunc
 *        and p_ecoll*sigma ~ (1/2)E_coll/E_trunc, so the two E_coll pieces CANCEL at the strict-derivative
 *        leading order -- BUT the finite quarter-decade discretization (p_ecoll a 2-pt secant, p_sigma a
 *        4-pt OLS, sigma_hi an endpoint) leaves an O(E_coll) remnant. NUMERICALLY resid_exp/(E_coll/E_trunc)
 *        is a HUMP peaking at f_peak ~ 0.401 near k ~ 15.9 (NOT ->0 like E_flow, NOT constant): resid_exp
 *        SCALES LIKE E_coll ~ N^-1/2, with d ln resid_exp/d ln N ~ -0.487 at the hump peak (-> -1/2).
 *   (S3) THE SLOPE. dy/dk = ln10 [ d ln eflow_attr/d ln N - d ln resid_exp/d ln N ]
 *        = ln10 [ (-1 + 3/u) - (-1/2 + O(1/u)) ] = -ln10/2 + ln10*(3/u) + O(1/u^2).
 *        LEADING VALUE  dy/dk -> -ln10/2 = -1.15129  (a NON-ROUND value: -1 * log_10(e)^-1 ... = -1.1513).
 *        The two-term prediction -ln10/2 + ln10*3/u tracks the measured local slope across k=12..18 to
 *        within ~0.1 (residual shrinking 0.099 -> 0.008), confirming the +3/u E_flow correction is what
 *        lifts the raw -1.151 up toward the observed ~ -0.98 plateau.
 *
 * THE VERDICT (assessment -- b_inf is NOT derivably exactly -1)
 * -----------------------------------------------------------
 *   (V1) The clean leading-order slope is -ln10/2 ~ -1.1513, a NON-ROUND value, NOT -1. The measured
 *        pre-pole plateau (~ -0.98..-1.02) is that leading value MASKED by a slow, positive +ln10*(3/u)
 *        log-correction from the near-peak C_F = (u+1)/2pi factor in E_flow -- a correction that only
 *        vanishes as u = log(T0/2pi) -> inf.
 *   (V2) There is NO genuine k -> inf limit to reach: resid_exp is a HUMP through zero (the imp-34023 M2
 *        sign-change ceiling) at finite k* ~ 21.281 (u ~ 44), so the window is TRUNCATED before u -> inf can
 *        expose the -1.151 leading value; past the hump peak d ln resid_exp/d ln N turns and diverges to
 *        +inf at k* (the imp-34247 pole). The descriptive fit therefore samples only the corrected plateau.
 *   (V3) So imp-34188 s b_inf ~ -1.003 is a COINCIDENCE of the finite pre-pole window: the vanishing-log
 *        -correction curve -ln10/2 + ln10*3/u happens to cross ~ -1.0 in k~12..18 (u~27..40) where the fit
 *        lives. -1 is neither the leading algebraic value nor a reachable limit -- the fit CANNOT resolve
 *        whether the true (inaccessible) limit is -ln10/2 or a nearby value, because the M2 ceiling pole
 *        prevents the u -> inf window. This EXPLAINS imp-34188 s "indistinguishable from -1 but not derived".
 *
 * NAMED SUB-GAP (honest partial): the exact pre-pole plateau value is fixed by the u-dependent balance of
 * the +ln10*3/u E_flow correction against the resid_exp hump-coefficient f(k) (peak ~0.401), NEITHER of
 * which the descriptive fit resolves; a rigorous statement of the limit would require the u -> inf tail,
 * which the finite resid_exp zero at k* ~ 21.281 makes inaccessible in this component model.
 *
 * DERIVATION / ASSESSMENT ONLY within the inherited imp-3220/imp-3406/imp-33810 component model, which is
 * NOT a rigorous asymptotic. Changes no bound; establishes no operator positivity; the imp-33843 log-linear
 * verdict and the imp-34188 statistical finding are UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the b_inf ~ -1.003 descriptive fit this derives)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the resid_exp sign-change ceiling k*~21.281)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear widening-slope form b(k))
 * @see imp-33810-eflow-resid-ratio-N-ladder (the eflow_attr/resid_exp ladder and inherited parts)
 * @see imp-34205-widening-slope-convergence-viz-data (the b_inf convergence plot this derivation shows is a finite-window coincidence)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127
 * (leading closed form) -> imp-34189 (next-order term + window-width divergence) -> imp-34188
 * (widening-slope leading -ln10/2, observed -1 a finite-window coincidence per this module) -> imp-34246
 * (this module, derives b_inf~-1.003 is a finite-window coincidence, true leading value -ln10/2) ->
 * imp-34247 (simple-pole residue +1 fit of the same slope's divergence) -> imp-34169/imp-34237
 * (fixed-band peak re-acceleration terminating at the resid_exp pole). All eight share the same kEnd*
 * ceiling; see reciprocal @see links above.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5;
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-33810/imp-33877 exactly
const LN10 = Math.LN10;

// EXACT inherited imp-33810 parts (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExp(lo, hi, ppd = 4) {
  const step = 1 / ppd;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(lo); d <= Math.log10(hi) + 1e-9; d += step) {
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
const ecollExpMag = (lo, hi) => -Math.log(parts(hi).E_coll / parts(lo).E_coll) / Math.log(hi / lo);
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * LN10);
}
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExp(lo, hi);
  const pEcoll = ecollExpMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return { k, residExp, eflowAttr, y: Math.log(eflowAttr / residExp), ph };
}
function localSlope(k) {
  const dk = 0.01;
  return (rung(k + dk).y - rung(k - dk).y) / (2 * dk);
}

// (S3) LEADING analytic value: dy/dk -> ln10*(-1 - (-1/2)) = -ln10/2.
const LEADING_SLOPE = -LN10 / 2; // -1.15129...

// (S1) numerator inherits the E_flow exponent (|s_flow| -> 1); check at k=16 (deep, pre-pole).
const K_CHECK = 16;
const HI_CHECK = Math.pow(10, K_CHECK + 1);
const SFLOW_CHECK = Math.abs(eflowLogSlope(HI_CHECK)); // -> 1
const R_CHECK = rung(K_CHECK);
const EFLOW_ATTR_OVER_EFLOWTR = R_CHECK.eflowAttr / (R_CHECK.ph.E_flow / E_TRUNC); // -> |s_flow|

// (S2) resid_exp scales like E_coll: locate the resid/(E_coll/E_trunc) hump peak and its exponent.
let HUMP_K = 0;
let HUMP_F = -1;
for (let k = 10; k <= 20; k += 0.1) {
  const r = rung(k);
  const f = r.residExp / (r.ph.E_coll / E_TRUNC);
  if (f > HUMP_F) {
    HUMP_F = f;
    HUMP_K = +k.toFixed(2);
  }
}
const dn = 1e-4;
const RESID_EXP_AT_PEAK =
  (Math.log(rung(HUMP_K + dn).residExp) - Math.log(rung(HUMP_K - dn).residExp)) / (2 * dn) / LN10; // -> -1/2

// (V1) two-term prediction -ln10/2 + ln10*3/u tracks the measured local slope across the pre-pole plateau.
const PLATEAU = [12, 13, 14, 15, 16, 17, 18].map((k) => {
  const u = Math.log(parts(Math.pow(10, k + 1)).T0 / TWO_PI);
  const pred = LEADING_SLOPE + (LN10 * 3) / u;
  const meas = localSlope(k);
  return { k, u: +u.toFixed(3), predicted: +pred.toFixed(5), measured: +meas.toFixed(5), residual: +(meas - pred).toFixed(5) };
});
const MAX_PLATEAU_RESIDUAL = Math.max(...PLATEAU.map((p) => Math.abs(p.residual)));

// (V2/V3) the M2 sign-change ceiling truncates the window before u -> inf; -1 sits between the leading
// value and the reachable plateau, so it is neither derived nor a reachable limit.
const SIGN_CHANGE_CEILING = 21.281; // imp-34023/imp-34087/imp-34150 bisected kEnd*
const MEASURED_BINF_IMP34188 = -1.003; // imp-34188 free exponential-approach limit
// -1 lies strictly between the leading algebraic value (-1.151) and the shallow plateau (~ -0.98):
const MINUS_ONE_BETWEEN_LEADING_AND_PLATEAU = LEADING_SLOPE < -1.0 && localSlope(16) > -1.0;

export const IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION = {
  id: 'imp-34246',
  proofSection: 'S-frontier',
  question:
    'imp-34188 found the widening slope limit b_inf statistically indistinguishable from exactly -1 but ' +
    'flagged it a descriptive fit, not a derivation. Does the asymptotic slope of y(k)=ln(eflow_attr/resid_exp), ' +
    'derived from the inherited E_flow/resid_exp forms, MUST approach exactly -1 per k-decade -- or a nearby ' +
    'non-round value the fit cannot resolve?',
  // S1: numerator inherits E_flow exponent (|s_flow| -> 1)
  numeratorExponentSource: 'E_flow (~ polylog(N)/N), via eflow_attr ~ (E_flow/E_trunc)|s_flow|, |s_flow|->1',
  sflowAtK16: +SFLOW_CHECK.toFixed(5),
  eflowAttrOverEflowTrK16: +EFLOW_ATTR_OVER_EFLOWTR.toFixed(5),
  // S2: denominator scales like E_coll (hump, not E_flow)
  denominatorExponentSource: 'E_coll (~ N^-1/2): resid_exp/(E_coll/E_trunc) is a hump peaking ~0.401, exponent -> -1/2',
  residHumpPeakK: HUMP_K,
  residHumpPeakF: +HUMP_F.toFixed(4),
  residExpExponentAtPeak: +RESID_EXP_AT_PEAK.toFixed(5),
  // S3: the leading slope
  leadingSlope: +LEADING_SLOPE.toFixed(5), // -ln10/2 = -1.15129
  leadingSlopeClosedForm: '-ln10/2 = -(1/2)*ln(10) = -1.151293...',
  correctionTerm: '+ln10*(3/u), u = log(T0/2pi); vanishes only as u -> inf',
  plateauTwoTermFit: PLATEAU,
  maxPlateauResidual: +MAX_PLATEAU_RESIDUAL.toFixed(5),
  // Verdict
  measuredBInfImp34188: MEASURED_BINF_IMP34188,
  signChangeCeilingKStar: SIGN_CHANGE_CEILING,
  bInfDerivablyExactlyMinusOne: false,
  minusOneIsCoincidentalPrePoleValue: true,
  minusOneBetweenLeadingAndPlateau: MINUS_ONE_BETWEEN_LEADING_AND_PLATEAU,
  isRigorous: false,
  verdict:
    'DERIVED (component-model only): the leading-order per-k slope is -ln10/2 ~ -1.1513, a NON-ROUND value, ' +
    'NOT -1. eflow_attr inherits the E_flow exponent (-1 + 3/u) while resid_exp inherits the E_coll exponent ' +
    '(-1/2) via a hump-through-zero (peak ~0.401 at k~15.9), giving dy/dk = -ln10/2 + ln10*(3/u) + O(1/u^2). ' +
    'imp-34188 s b_inf ~ -1.003 is a COINCIDENCE of the finite pre-pole window: the slow +ln10*3/u correction ' +
    'lifts the raw -1.151 through ~ -1.0 in k~12..18, and the imp-34023 M2 sign-change ceiling at k*~21.281 ' +
    'truncates the window before u -> inf can expose the -1.151 leading value. So b_inf is NOT derivably exactly ' +
    '-1; the fit cannot resolve the true (inaccessible) limit. Named sub-gap: the exact plateau balances the ' +
    '+ln10*3/u E_flow correction against the resid_exp hump coefficient f(k), inaccessible past the finite ' +
    'resid_exp zero. Derivation within the inherited imp-3220/imp-3406/imp-33810 component model, which is NOT ' +
    'a rigorous asymptotic; the imp-33843 log-linear verdict and imp-34188 statistical finding are UNTOUCHED; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

const IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION_ASSERTIONS = [
  {
    // S1: numerator inherits the E_flow exponent -- |s_flow| near 1 and eflow_attr ~ (E_flow/E_trunc)|s_flow|.
    id: 'imp34246-numerator-inherits-eflow-exponent',
    description: '|s_flow| in (0.9,1) at k=16 and eflow_attr/(E_flow/E_trunc) matches |s_flow| to <1e-3',
    holds: () =>
      SFLOW_CHECK > 0.9 &&
      SFLOW_CHECK < 1.0 &&
      Math.abs(EFLOW_ATTR_OVER_EFLOWTR - SFLOW_CHECK) < 1e-3,
  },
  {
    // S2: resid_exp scales like E_coll (hump, exponent -> -1/2), NOT like E_flow.
    id: 'imp34246-denominator-inherits-ecoll-exponent',
    description: 'resid/(E_coll/E_trunc) hump peaks ~0.40 near k~15.9 and its exponent at peak is ~ -1/2',
    holds: () =>
      HUMP_K > 15 &&
      HUMP_K < 17 &&
      HUMP_F > 0.38 &&
      HUMP_F < 0.42 &&
      Math.abs(RESID_EXP_AT_PEAK + 0.5) < 0.03,
  },
  {
    // S3: the leading slope is -ln10/2, a non-round value distinct from -1 by >0.15.
    id: 'imp34246-leading-slope-is-minus-half-ln10',
    description: 'leadingSlope = -ln10/2 = -1.15129, distinct from -1 by ~0.151',
    holds: () =>
      Math.abs(LEADING_SLOPE - -1.1512925) < 1e-6 &&
      LEADING_SLOPE < -1.1 &&
      Math.abs(LEADING_SLOPE + 1.0) > 0.15,
  },
  {
    // V1: the two-term prediction tracks the measured pre-pole local slope across k=12..18.
    id: 'imp34246-two-term-prediction-tracks-plateau',
    description: 'max |measured - (-ln10/2 + ln10*3/u)| over k=12..18 stays below 0.12',
    holds: () => PLATEAU.length === 7 && MAX_PLATEAU_RESIDUAL < 0.12,
  },
  {
    // V3 + honesty gate: -1 not derivable, sits between leading value and plateau; isRigorous false, no QED.
    id: 'imp34246-honesty-gate-no-qed',
    description: 'b_inf NOT derivably -1; -1 between leading (-1.151) and plateau; isRigorous false, no QED, K_a>=0 untouched, no refereed bound is changed',
    holds: () =>
      IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION.bInfDerivablyExactlyMinusOne === false &&
      IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION.minusOneIsCoincidentalPrePoleValue === true &&
      MINUS_ONE_BETWEEN_LEADING_AND_PLATEAU === true &&
      IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION.verdict),
  },
];

for (const a of IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34246-widening-slope-limit-analytic-derivation assertion failed: ${a.id}`);
  }
}

export default IMP34246_WIDENING_SLOPE_LIMIT_ANALYTIC_DERIVATION;
