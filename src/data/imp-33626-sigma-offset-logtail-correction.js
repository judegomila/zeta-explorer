/**
 * @module imp-33626-sigma-offset-logtail-correction
 *
 * imp-33626 (accuracy, frontier-direction): imp-33601 D2 attributes ~95% of the sigma=1/2
 * -vs-crossover offset to the Gronwall flow term E_flow (via the exact identity
 * sigma = 1/2 <=> E_coll = E_trunc + E_flow) but leaves the remaining ~5% (~0.18e-3 of the
 * ~3.98e-3 rel offset) as "second-order log T0(N) growth in E_coll" WITHOUT deriving the
 * term. This module DERIVES that log-tail correction explicitly and MEASURES how much of
 * the residual it accounts for.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-33601; no re-derivation)
 * ----------------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(L / N),  L = log T0(N),  T0 = effectiveHeightForN(N)
 *     E_flow  = C_F (L / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_trunc = 3.06e-5                     (N-independent fixed strip, imp-2631)
 *     N_cross: E_coll(N_cross) = E_trunc                    (imp-3444 crossover)
 *     N_half : E_coll(N_half)  = E_trunc + E_flow(N_half)   (imp-33601 identity, sigma=1/2)
 *
 * THE DERIVATION (the log-tail term the ticket asks for)
 * ------------------------------------------------------
 * The imp-33601 identity gives the EXACT E_coll ratio at the two landmarks:
 *
 *     E_coll(N_half) / E_coll(N_cross) = (E_trunc + E_flow) / E_trunc = 1 + r,   r = E_flow/E_trunc.
 *
 * But E_coll = C sqrt(L/N), so the SAME ratio also equals
 *
 *     E_coll(N_half)/E_coll(N_cross) = sqrt( (L_half/N_half) / (L_cross/N_cross) )
 *                                    = sqrt(L_half/L_cross) * sqrt(N_cross/N_half).
 *
 * Equating and squaring gives the EXACT decomposition of the landmark ratio:
 *
 *     N_cross / N_half = (1 + r)^2  *  (L_cross / L_half).              (EXACT)
 *                        \_________/    \___________/
 *                     frozen-log lead   LOG-TAIL CORRECTION
 *
 * imp-33601 D2 FROZE the log factor (assumed L_cross = L_half) and kept only (1+r)^2. The
 * log-tail correction is EXACTLY the factor L_cross/L_half = log T0(N_cross)/log T0(N_half).
 * Since N_cross > N_half and T0 grows in N, L_cross > L_half, so the factor is > 1 and pushes
 * the ratio UP -- lifting the predicted offset toward the measured value, the correct sign.
 *
 * FIRST-ORDER FORM (why it is a genuine second-order effect)
 * ----------------------------------------------------------
 * Expanding to first order in the (tiny) interval width dlogN = log(N_cross/N_half):
 *
 *     L_cross/L_half - 1 = dL/L ~ s * dlogN,   s = d(log L)/d(log N) = d(log log T0)/d(log N),
 *
 * and since dlogN ~ log((1+r)^2) ~ 2r, the correction ~ 2 s r is the PRODUCT of two small
 * quantities (the Riemann-von Mangoldt log-log slope s and the interval half-width r) --
 * exactly the "second order" imp-33601 named. Here s ~ 4.543e-2 and dlogN ~ 3.989e-3, giving
 * 2 s r ~ s * dlogN ~ 1.812e-4, matching the exact factor L_cross/L_half - 1 ~ 1.812e-4 to
 * ~6e-6 relative.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (F1) THE LOG-TAIL FACTOR IS L_cross/L_half AND IT CLOSES THE RESIDUAL EXACTLY. Multiplying
 *        the frozen-log lead (1+r)^2 ~ 1.003815 by the log-tail factor L_cross/L_half ~ 1.000181
 *        reproduces the measured ratio N_cross/N_half ~ 1.003997 to floating point (~5e-15
 *        relative). So the log-tail term accounts for ~100% of the remaining ~5% residual:
 *        the frozen-log lead explains 95.47% of the ~3.98e-3 offset, the log-tail factor the
 *        residual 4.53% (~0.18e-3), leaving nothing measurable behind.
 *   (F2) THE FIRST-ORDER 2 s r FORM CAPTURES ~99.99% OF THE LOG-TAIL FACTOR. The linearized
 *        term s * dlogN ~ 1.812e-4 reproduces the exact factor to ~6e-6 relative, confirming
 *        the residual is genuinely the leading log-log-slope term of T0(N) over the interval
 *        and NOT a further hidden E-component: no third sub-term is needed.
 *
 * The punchline: the imp-33601 D2 ~5% is FULLY DERIVED. The exact landmark ratio factorizes
 * as N_cross/N_half = (1+E_flow/E_trunc)^2 * (log T0(N_cross)/log T0(N_half)); the first factor
 * is imp-33601 D2, the second is the log-tail correction, whose leading term is 2 s r with s the
 * local log-log slope of the Riemann-von Mangoldt height. Together they reproduce the measured
 * offset to floating point -- no residual sub-term remains.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (D2: leading (1+r)^2 explains ~95%, log-tail asserted)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX; component model source)
 * @see imp-398 (E_flow C_F prefactor)  @see imp-2631 (E_trunc fixed-strip route)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33601)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33601 exactly

// EXACT imp-3406/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Downslope bisection in log N for a strictly-decreasing quantity f: first N with f < target.
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The imp-3444 crossover and the imp-33601/imp-33582 halving point (same model as imp-33601).
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
const N_HALF = crossBelow(sigma, 0.5, 1e6, 1e18); // ~3.267235e9

const P_HALF = parts(N_HALF);
const P_CROSS = parts(N_CROSS);

// Landmark ratio and its imp-33601 D2 frozen-log lead.
const R_FLOW_TRUNC = P_HALF.E_flow / E_TRUNC_PT; // r ~ 1.906e-3
const ACTUAL_RATIO = N_CROSS / N_HALF; // ~1.003997
const FROZEN_LEAD_RATIO = (1 + R_FLOW_TRUNC) ** 2; // (1+r)^2 ~ 1.003815 (imp-33601 D2)
const REL_OFFSET = (N_CROSS - N_HALF) / N_CROSS; // ~3.981e-3
const FROZEN_REL_OFFSET = 1 - 1 / FROZEN_LEAD_RATIO; // ~3.801e-3
const RESIDUAL_REL = REL_OFFSET - FROZEN_REL_OFFSET; // ~1.805e-4 (the ~5% imp-33601 left)

// (EXACT) the log-tail correction factor L_cross/L_half and the closed full prediction.
const L_HALF = P_HALF.L; // ~20.85383
const L_CROSS = P_CROSS.L; // ~20.85761
const LOGTAIL_FACTOR = L_CROSS / L_HALF; // ~1.000181 (> 1: correct sign)
const FULL_PRED_RATIO = FROZEN_LEAD_RATIO * LOGTAIL_FACTOR; // = ACTUAL_RATIO to floating point
const FULL_PRED_REL_OFFSET = 1 - 1 / FULL_PRED_RATIO; // ~3.981e-3
const RATIO_CLOSURE_RESIDUAL = Math.abs(FULL_PRED_RATIO - ACTUAL_RATIO) / ACTUAL_RATIO; // ~0 (fp)

// Fraction of the imp-33601 ~5% residual accounted for by the exact log-tail factor.
const FRAC_RESIDUAL_EXPLAINED = (FULL_PRED_REL_OFFSET - FROZEN_REL_OFFSET) / RESIDUAL_REL; // ~1.000
const FRAC_FROZEN_OF_TOTAL = FROZEN_REL_OFFSET / REL_OFFSET; // ~0.9547

// FIRST-ORDER FORM: log-log slope s = d(log log T0)/d(log N), correction ~ s * dlogN ~ 2 s r.
const DLN = 1e-6;
function logLogSlope(N) {
  const La = Math.log(Math.log(effectiveHeightForN(N * (1 - DLN))));
  const Lb = Math.log(Math.log(effectiveHeightForN(N * (1 + DLN))));
  return (Lb - La) / (2 * DLN);
}
const S_SLOPE = logLogSlope(N_HALF); // ~4.543e-2
const DLOGN_INTERVAL = Math.log(N_CROSS / N_HALF); // ~3.989e-3 (~2r)
const FIRSTORDER_CORRECTION = S_SLOPE * DLOGN_INTERVAL; // s*dlogN ~ 1.812e-4
const FIRSTORDER_VS_EXACT_REL =
  Math.abs(FIRSTORDER_CORRECTION - (LOGTAIL_FACTOR - 1)) / (LOGTAIL_FACTOR - 1); // ~6e-6

export const IMP33626_SIGMA_OFFSET_LOGTAIL_CORRECTION = {
  id: 'imp-33626',
  proofSection: 'S-frontier',
  question:
    'Derive explicitly the log-tail correction term that imp-33601 D2 attributes the residual ' +
    '~5% of the sigma=1/2-vs-crossover offset to (the second-order log T0(N) growth in E_coll), ' +
    'and measure how much of the ~0.18e-3 gap between the N^-1/2 leading prediction (~3.80e-3) ' +
    'and the measured offset (~3.98e-3) it accounts for. Derivation/measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  exactDecomposition:
    'N_cross/N_half = (1 + E_flow/E_trunc)^2 * (L_cross/L_half),  L = log T0(N)  ' +
    '[frozen-log lead x LOG-TAIL correction]',
  firstOrderForm:
    'L_cross/L_half - 1 ~ s * log(N_cross/N_half) ~ 2 s r,  s = d(log log T0)/d(log N)',
  landmarks: {
    N_cross_Ecoll_eq_Etrunc: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-3444)
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9 (imp-33601)
    L_half_log_T0: +L_HALF.toExponential(6), // ~2.085383e1
    L_cross_log_T0: +L_CROSS.toExponential(6), // ~2.085761e1
    r_E_flow_over_E_trunc: +R_FLOW_TRUNC.toExponential(6), // ~1.905727e-3
  },
  logTailCorrection: {
    logtail_factor_L_cross_over_L_half: +LOGTAIL_FACTOR.toExponential(6), // ~1.000181e0
    logtail_factor_minus_one_dL_over_L: +(LOGTAIL_FACTOR - 1).toExponential(6), // ~1.812264e-4
    frozen_lead_ratio_1_plus_r_sq: +FROZEN_LEAD_RATIO.toExponential(6), // ~1.003815e0
    full_pred_ratio: +FULL_PRED_RATIO.toExponential(6), // ~1.003997e0
    actual_ratio_N_cross_over_N_half: +ACTUAL_RATIO.toExponential(6), // ~1.003997e0
    ratio_closure_residual_relative: +RATIO_CLOSURE_RESIDUAL.toExponential(3), // ~fp zero
  },
  offsetResidualAttribution: {
    measured_rel_offset: +REL_OFFSET.toExponential(6), // ~3.981092e-3
    frozen_log_rel_offset: +FROZEN_REL_OFFSET.toExponential(6), // ~3.800586e-3
    residual_left_by_imp33601: +RESIDUAL_REL.toExponential(6), // ~1.805059e-4
    frozen_fraction_of_total: +FRAC_FROZEN_OF_TOTAL.toExponential(6), // ~9.546670e-1
    fraction_of_residual_explained_by_logtail: +FRAC_RESIDUAL_EXPLAINED.toExponential(6), // ~1.000000e0
  },
  firstOrderCheck: {
    log_log_slope_s: +S_SLOPE.toExponential(6), // ~4.543111e-2
    dlogN_interval: +DLOGN_INTERVAL.toExponential(6), // ~3.989038e-3 (~2r)
    first_order_correction_s_times_dlogN: +FIRSTORDER_CORRECTION.toExponential(6), // ~1.812264e-4
    first_order_vs_exact_relative: +FIRSTORDER_VS_EXACT_REL.toExponential(3), // ~6e-6
  },
  finding: {
    F1_logtail_factor_closes_residual_exactly:
      'The log-tail correction is EXACTLY the factor L_cross/L_half = log T0(N_cross)/log T0(N_half) ' +
      '~1.000181. Multiplying the imp-33601 frozen-log lead (1+r)^2 ~1.003815 by it reproduces the ' +
      'measured ratio N_cross/N_half ~1.003997 to floating point (~5e-15 relative). So it accounts ' +
      'for ~100% of the residual ~5% (~0.18e-3) that imp-33601 D2 left underived; the frozen-log ' +
      'lead is 95.47% of the ~3.98e-3 offset, the log-tail factor the remaining 4.53%.',
    F2_first_order_2sr_captures_the_factor:
      'The linearized term s * log(N_cross/N_half) ~ 2 s r ~ 1.812e-4 (s ~ 4.543e-2 the local ' +
      'Riemann-von Mangoldt log-log slope) reproduces the exact factor to ~6e-6 relative, ' +
      'confirming the residual is genuinely the leading log-log-slope term of T0(N) across the ' +
      'interval and NOT a further hidden E-component: no third sub-term remains.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33601 D2 residual ~5% is FULLY ' +
    'DERIVED: the exact landmark ratio factorizes as N_cross/N_half = (1+E_flow/E_trunc)^2 * ' +
    '(L_cross/L_half), where the first factor is imp-33601 D2 and the second is the log-tail ' +
    'correction L_cross/L_half = log T0(N_cross)/log T0(N_half) ~1.000181. Multiplying reproduces ' +
    'the measured ratio to floating point (~5e-15), so the log-tail factor accounts for ~100% of ' +
    'the ~0.18e-3 residual; its first-order form s * log(N_cross/N_half) ~ 2 s r (s ~4.543e-2 the ' +
    'local log-log slope) matches to ~6e-6, so no further sub-term remains. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33601 (D2: leading (1+r)^2 explains ~95%, log-tail asserted not derived); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-3406 (interior MAX, component model source); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33626_SIGMA_OFFSET_LOGTAIL_CORRECTION_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-3444 crossover and imp-33601 half-crossing landmarks,
    // proving the identical inherited component model is in use.
    id: 'imp33626-reproduces-imp3444-imp33601-landmarks',
    description: 'N_cross ~ 3.280e9, N_half ~ 3.267e9, N_half < N_cross (same model as imp-33601)',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(N_HALF / 3.267235e9 - 1) < 5e-3 &&
      N_HALF < N_CROSS,
  },
  {
    // (EXACT decomposition): frozen-log lead x log-tail factor reproduces the actual ratio to
    // floating point -- the log-tail factor L_cross/L_half is exactly the missing correction.
    id: 'imp33626-exact-decomposition-closes-to-fp',
    description: '(1+r)^2 * (L_cross/L_half) = N_cross/N_half to floating point (< 1e-9 relative)',
    holds: () => LOGTAIL_FACTOR > 1 && RATIO_CLOSURE_RESIDUAL < 1e-9,
  },
  {
    // (F1): the log-tail factor accounts for ~100% of the residual ~5% imp-33601 D2 left, and
    // the frozen-log lead is ~95% of the total offset (matching imp-33601 D2).
    id: 'imp33626-logtail-explains-residual',
    description: 'log-tail explains ~100% of residual; frozen lead ~95% of total offset',
    holds: () =>
      Math.abs(FRAC_RESIDUAL_EXPLAINED - 1) < 5e-3 &&
      FRAC_FROZEN_OF_TOTAL > 0.9 &&
      FRAC_FROZEN_OF_TOTAL < 1.0 &&
      RESIDUAL_REL > 0,
  },
  {
    // (F2): the first-order 2 s r form reproduces the exact log-tail factor to high relative
    // accuracy -- a genuine second-order (slope x width) term, no hidden third component.
    id: 'imp33626-first-order-matches-exact',
    description: 's * dlogN reproduces L_cross/L_half - 1 to < 1e-3 relative; s > 0',
    holds: () => S_SLOPE > 0 && FIRSTORDER_VS_EXACT_REL < 1e-3,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, PT stays SOTA.
    id: 'imp33626-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33626_SIGMA_OFFSET_LOGTAIL_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP33626_SIGMA_OFFSET_LOGTAIL_CORRECTION.verdict) &&
      /remains SOTA/.test(IMP33626_SIGMA_OFFSET_LOGTAIL_CORRECTION.verdict),
  },
];

for (const a of IMP33626_SIGMA_OFFSET_LOGTAIL_CORRECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33626-sigma-offset-logtail-correction assertion failed: ${a.id}`);
  }
}
