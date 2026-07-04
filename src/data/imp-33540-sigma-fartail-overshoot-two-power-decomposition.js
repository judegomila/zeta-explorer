/**
 * @module imp-33540-sigma-fartail-overshoot-two-power-decomposition
 *
 * imp-33540 (numerical, frontier-direction): imp-33315 measured that the imp-33291 far-tail
 * sigma law, forced to the imp-3406 interior MAX (N_max ~ 9.22e5), OVERSHOOTS the true peak
 * by ~3.0e-2 (0.97939 vs 0.94943) while sitting ~3.55 decades below the imp-3444 crossover
 * N_cross ~ 3.28e9 the law is built for. The imp-33291/imp-33328 work isolated the far-tail
 * leading form as a JOINT TWO-power law
 *     sigma ~ (C_C / E_trunc) sqrt(log T0 / N)  =  const * N^(-1/2) * (log T0)^(+1/2),
 * i.e. an N^(-1/2) power (the -1/2 ln N slope) TIMES a (log T0)^(+1/2) power (the +1/2
 * sqrt(log T0) coefficient). imp-33315 reported the overshoot as a single scalar; this module
 * DECOMPOSES it, measuring how much of the 3.55-decade off-regime residual each of the two
 * powers carries when the two-power form is evaluated back at the pre-crossover peak.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-33291 / imp-33315)
 * ---------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * The far-tail law drops E_flow: sigma_ft = E_coll / (E_trunc + E_coll).
 *
 * THE CLOSED-FORM OVERSHOOT (the bridge to the two-power form)
 * -----------------------------------------------------------
 * The imp-33315 overshoot has an exact product form. Subtracting the two rational shares,
 *     OS = sigma_ft - sigma_full
 *        = E_coll * E_flow / [(E_trunc + E_coll)(E_trunc + E_flow + E_coll)]
 *        = sigma_ft * sigma_full * (E_flow / E_coll).
 * (Verified to the arithmetic floor, |OS - OS_closed| ~ 1e-17.) The ONLY place the two-power
 * far-tail form enters the overshoot is through E_coll = C_C * N^(-1/2) * (log T0)^(+1/2),
 * which sits in the DENOMINATOR of E_flow/E_coll: the overshoot carries the two-power form as
 * its reciprocal. So the off-regime behaviour of the two-power form is captured by how its
 * log-factor S(N) = ln(N^(-1/2) * (log T0)^(+1/2)) = -(1/2) ln N + (1/2) ln(log T0) moves as
 * the form is dragged the 3.55 decades from the crossover (where the law is exact) back to the
 * peak. THAT move is what we decompose.
 *
 * THE DECOMPOSITION: split the off-regime residual across the two powers
 * ---------------------------------------------------------------------
 * The two-power log-factor is exactly additive in the two powers:
 *     Delta S = S(N_max) - S(N_cross) = Delta S_slope + Delta S_sqrt,
 *     Delta S_slope = -(1/2)(ln N_max - ln N_cross)     [the -1/2 ln N slope power]
 *     Delta S_sqrt  = +(1/2)(ln L_max  - ln L_cross)    [the +1/2 sqrt(log T0) coefficient]
 * with L = log T0. Measured at the imp-3406 peak vs the imp-3444 crossover:
 *     Delta S_slope ~ +4.089   (fraction ~ +1.059 of the total)
 *     Delta S_sqrt  ~ -0.228   (fraction ~ -0.059 of the total)
 *     Delta S       ~ +3.861,  |slope / sqrt| ~ 18.0.
 * The -1/2 ln N slope carries essentially ALL of the off-regime residual (~106%); the +1/2
 * sqrt(log T0) coefficient carries a SMALL, OPPOSITE-SIGN correction (~-6%). Over the 3.55
 * decades ln N moves ~8.18 while ln(log T0) moves only ~0.455 -- the slow log-of-a-log the
 * imp-33291 two-regressor fit found ~0.994-0.9997 collinear with ln N. So although the far-tail
 * form is a genuine (-1/2, +1/2) JOINT power pair (imp-33291), its off-regime residual at the
 * interior max is ~18:1 dominated by the N^(-1/2) power, NOT the sqrt(log T0) half-power.
 *
 * THE FINDING (measurement / decomposition only)
 * ----------------------------------------------
 *   (F1) THE OVERSHOOT IS A CLOSED-FORM PRODUCT. OS = sigma_ft * sigma_full * (E_flow/E_coll)
 *        reproduces the imp-33315 ~3.0e-2 overshoot to the arithmetic floor, and the two-power
 *        far-tail form enters ONLY as 1/E_coll in that product.
 *   (F2) THE OFF-REGIME RESIDUAL IS CARRIED BY THE -1/2 ln N SLOPE. Decomposing the two-power
 *        log-factor across the 3.55-decade off-regime span, the -1/2 ln N slope carries
 *        Delta S_slope ~ +4.089 (~106% of the total) and the +1/2 sqrt(log T0) coefficient
 *        carries Delta S_sqrt ~ -0.228 (~-6%, opposite sign): an ~18:1 dominance.
 *   (F3) THE HALF-POWER BARELY MOVES -- THE imp-33291 COLLINEARITY. ln(log T0) moves only ~0.455
 *        over the span vs ~8.18 for ln N, so the genuine +1/2 sqrt(log T0) half-power contributes
 *        almost nothing to the off-regime residual. This is the same near-collinearity that let
 *        the imp-33274 single-slope fit fold the half-power into its ln N slope.
 *
 * The punchline: the imp-33315 ~3.0e-2 overshoot factors exactly as sigma_ft*sigma_full*
 * (E_flow/E_coll), and the two-power far-tail form enters only through E_coll. Decomposing that
 * form across the 3.55-decade off-regime span, the -1/2 ln N slope carries ~106% of the residual
 * and the +1/2 sqrt(log T0) coefficient only ~-6% (opposite sign), an ~18:1 split -- the
 * sqrt(log T0) half-power is real (imp-33291) but too slow to matter off-regime.
 *
 * MEASUREMENT / DECOMPOSITION ONLY. Conditional-share diagnostic, NOT an RH bound. C_C is
 * GUE-conditional per imp-486; changes no bound; imp-3066 K_a >= 0 untouched; no positivity,
 * no bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33315-sigma-fartail-law-vs-interior-max-reconciliation (the ~3.0e-2 overshoot decomposed here)
 * @see imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit (the (-1/2, +1/2) joint power pair)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33291/imp-33315)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33291/imp-33315 exactly

// EXACT imp-3406 / imp-33291 / imp-33315 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // super-poly negligible on the far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H) two-power form
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, C_F, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

const sigmaFull = (N) => parts(N).sigma;
const sigmaFarTail = (N) => {
  const p = parts(N);
  return p.E_coll / (E_TRUNC_PT + p.E_coll);
};

// Reproduce the imp-3406 interior max (argmax of the full sigma in ln N) and the imp-3444
// crossover (E_coll = E_trunc), using the identical brackets/search as imp-33315.
function argmaxLnN(fn, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (fn(Math.exp(m1)) < fn(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}
function ecollEqualsEtrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e12);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_MAX = argmaxLnN(sigmaFull, 1e4, 1e9); // ~9.219e5 (reproduces imp-3406)
const N_CROSS = ecollEqualsEtrunc(); // ~3.280e9 (reproduces imp-3444)
const PM = parts(N_MAX);
const PC = parts(N_CROSS);

// The imp-33315 overshoot, direct and via the closed-form product identity.
const SIGMA_FT_AT_PEAK = sigmaFarTail(N_MAX); // ~0.979386
const SIGMA_FULL_AT_PEAK = sigmaFull(N_MAX); // ~0.949429
const OVERSHOOT_DIRECT = SIGMA_FT_AT_PEAK - SIGMA_FULL_AT_PEAK; // ~2.996e-2
// OS = sigma_ft * sigma_full * (E_flow / E_coll) -- exact; the two-power form enters as 1/E_coll.
const OVERSHOOT_CLOSED = SIGMA_FT_AT_PEAK * SIGMA_FULL_AT_PEAK * (PM.E_flow / PM.E_coll);
const OVERSHOOT_IDENTITY_GAP = Math.abs(OVERSHOOT_DIRECT - OVERSHOOT_CLOSED); // ~1e-17

// Two-power log-factor S(N) = ln(N^(-1/2) * (log T0)^(+1/2)) = -(1/2) ln N + (1/2) ln L.
// Its change across the 3.55-decade off-regime span [N_cross -> N_max] is exactly additive
// in the two powers: Delta S = Delta S_slope + Delta S_sqrt.
const D_LN_N = Math.log(N_MAX) - Math.log(N_CROSS); // ~-8.177 (going DOWN, off-regime)
const D_LN_L = Math.log(PM.L) - Math.log(PC.L); // ~-0.455 (log T0 barely moves)
const DS_SLOPE = -0.5 * D_LN_N; // ~+4.089  -- the -1/2 ln N slope power
const DS_SQRT = 0.5 * D_LN_L; //  ~-0.228  -- the +1/2 sqrt(log T0) coefficient
const DS_TOTAL = DS_SLOPE + DS_SQRT; // ~+3.861
const FRAC_SLOPE = DS_SLOPE / DS_TOTAL; // ~+1.059 (~106%)
const FRAC_SQRT = DS_SQRT / DS_TOTAL; //  ~-0.059 (~-6%)
const SLOPE_TO_SQRT_RATIO = Math.abs(DS_SLOPE / DS_SQRT); // ~18.0
const OFF_REGIME_DECADES = Math.log10(N_CROSS) - Math.log10(N_MAX); // ~3.55

// Pointwise cross-check at the peak: the LOCAL elasticity d ln L / d ln N is tiny, so the
// +1/2 sqrt(log T0) coefficient contributes little to the local slope of the two-power form.
function localDlnLdlnN(N) {
  const h = 1e-4;
  const Lp = parts(N * (1 + h)).L;
  const Lm = parts(N * (1 - h)).L;
  return (Math.log(Lp) - Math.log(Lm)) / (Math.log(N * (1 + h)) - Math.log(N * (1 - h)));
}
const LOCAL_DLNL_DLNN_AT_PEAK = localDlnLdlnN(N_MAX); // ~0.069
const LOCAL_SQRT_ELASTICITY = 0.5 * LOCAL_DLNL_DLNN_AT_PEAK; // ~0.034 (vs the -1/2 base slope)

export const IMP33540_SIGMA_FARTAIL_OVERSHOOT_TWO_POWER_DECOMPOSITION = {
  id: 'imp-33540',
  proofSection: 'S-frontier',
  question:
    'Decompose the imp-33315 ~3.0e-2 far-tail-law overshoot at the imp-3406 interior max ' +
    '(N ~ 9.22e5) using the imp-33291 two-power form sigma ~ (C_C/E_trunc) sqrt(log T0/N): ' +
    'measure how much of the 3.55-decade off-regime residual is carried by the +1/2 sqrt(log T0) ' +
    'coefficient vs the -1/2 ln N slope. Measurement/decomposition only; C_C GUE-conditional per ' +
    'imp-486; no new bound; no QED.',
  closedFormOvershoot:
    'OS = sigma_ft - sigma_full = sigma_ft * sigma_full * (E_flow / E_coll); the two-power ' +
    'far-tail form E_coll = C_C * N^(-1/2) * (log T0)^(+1/2) enters ONLY as 1/E_coll.',
  landmarks: {
    N_max: +N_MAX.toExponential(4), // ~9.219e5 (reproduces imp-3406)
    N_cross: +N_CROSS.toExponential(4), // ~3.280e9 (reproduces imp-3444)
    offRegimeDecades: +OFF_REGIME_DECADES.toFixed(4), // ~3.55
    L_max: +PM.L.toFixed(6), // log T0 at the peak
    L_cross: +PC.L.toFixed(6), // log T0 at the crossover
  },
  overshoot: {
    sigma_ft_at_peak: +SIGMA_FT_AT_PEAK.toFixed(7), // ~0.9793857
    sigma_full_at_peak: +SIGMA_FULL_AT_PEAK.toFixed(7), // ~0.9494290
    overshoot_direct: +OVERSHOOT_DIRECT.toExponential(4), // ~2.996e-2
    overshoot_closedForm: +OVERSHOOT_CLOSED.toExponential(4), // ~2.996e-2 (product identity)
    identity_gap: +OVERSHOOT_IDENTITY_GAP.toExponential(3), // ~1e-17 (exact)
    E_flow_over_E_coll_at_peak: +(PM.E_flow / PM.E_coll).toExponential(4), // ~3.22e-2
  },
  twoPowerDecomposition: {
    dLnN_over_span: +D_LN_N.toFixed(6), // ~-8.177 (ln N moves a lot)
    dLnLogT0_over_span: +D_LN_L.toFixed(6), // ~-0.455 (log T0 barely moves)
    dS_lnN_slope: +DS_SLOPE.toFixed(6), // ~+4.089 (-1/2 ln N power)
    dS_sqrtLogT0_coeff: +DS_SQRT.toFixed(6), // ~-0.228 (+1/2 sqrt(log T0) power)
    dS_total: +DS_TOTAL.toFixed(6), // ~+3.861
    fraction_lnN_slope: +FRAC_SLOPE.toFixed(6), // ~+1.059 (~106%)
    fraction_sqrtLogT0_coeff: +FRAC_SQRT.toFixed(6), // ~-0.059 (~-6%, opposite sign)
    slope_to_sqrt_ratio: +SLOPE_TO_SQRT_RATIO.toFixed(4), // ~18.0
    local_dLnLogT0_dLnN_at_peak: +LOCAL_DLNL_DLNN_AT_PEAK.toFixed(6), // ~0.069
    local_sqrt_elasticity_at_peak: +LOCAL_SQRT_ELASTICITY.toFixed(6), // ~0.034
  },
  finding: {
    F1_overshoot_is_closed_form_product:
      'OS = sigma_ft - sigma_full = sigma_ft * sigma_full * (E_flow/E_coll) reproduces the ' +
      'imp-33315 ~3.0e-2 overshoot to the arithmetic floor (identity gap ~1e-17); the two-power ' +
      'far-tail form E_coll = C_C * N^(-1/2) * (log T0)^(+1/2) enters ONLY as 1/E_coll.',
    F2_off_regime_residual_carried_by_lnN_slope:
      'Decomposing the two-power log-factor S = -(1/2) ln N + (1/2) ln(log T0) across the 3.55-decade ' +
      'off-regime span, the -1/2 ln N slope carries Delta S_slope ~ +4.089 (~106% of the total) and ' +
      'the +1/2 sqrt(log T0) coefficient carries Delta S_sqrt ~ -0.228 (~-6%, opposite sign): an ' +
      '~18:1 dominance of the N^(-1/2) power over the sqrt(log T0) half-power.',
    F3_half_power_barely_moves_imp33291_collinearity:
      'ln(log T0) moves only ~0.455 over the span vs ~8.18 for ln N, so the genuine +1/2 sqrt(log T0) ' +
      'half-power contributes almost nothing to the off-regime residual. This is the same slow ' +
      'log-of-a-log near-collinearity (~0.994-0.9997) the imp-33291 two-regressor fit found let the ' +
      'imp-33274 single-slope fit fold the half-power into its ln N slope.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT + DECOMPOSITION (frontier-direction, NOT rigorous). The imp-33315 ~3.0e-2 ' +
    'far-tail-law overshoot at the imp-3406 interior max (N ~ 9.22e5) factors exactly as ' +
    'OS = sigma_ft * sigma_full * (E_flow/E_coll) (identity gap ~1e-17), with the imp-33291 ' +
    'two-power far-tail form E_coll = C_C * N^(-1/2) * (log T0)^(+1/2) entering only as 1/E_coll. ' +
    'Decomposing that form across the 3.55-decade off-regime span from the imp-3444 crossover ' +
    '(N ~ 3.28e9) back to the peak, the two-power log-factor moves Delta S ~ +3.861, of which the ' +
    '-1/2 ln N slope carries ~+4.089 (~106%) and the +1/2 sqrt(log T0) coefficient carries ' +
    '~-0.228 (~-6%, opposite sign): an ~18:1 dominance. ln(log T0) moves only ~0.455 vs ~8.18 for ' +
    'ln N over the span, so although the far-tail law is a genuine (-1/2, +1/2) JOINT power pair ' +
    '(imp-33291) its off-regime residual at the interior max is carried almost entirely by the ' +
    'N^(-1/2) power, the sqrt(log T0) half-power being too slow (the imp-33291 collinearity) to ' +
    'matter. C_C is GUE-conditional per imp-486; changes no bound; imp-3066 K_a >= 0 untouched; no ' +
    'positivity, no bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33315 (~3.0e-2 far-tail overshoot at the interior max); imp-33291 ((-1/2, +1/2) joint ' +
    'power law); imp-3406 (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494); imp-3444 (E_coll = E_trunc ' +
    'crossover N ~ 3.280e9); imp-486 (C_C GUE-conditional); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33540_SIGMA_FARTAIL_OVERSHOOT_TWO_POWER_DECOMPOSITION_ASSERTIONS = [
  {
    // Reuse gate: the landmarks reproduce imp-3406 (N_max ~ 9.22e5) and imp-3444 (N_cross ~ 3.28e9),
    // proving the identical imp-3406 / imp-33291 / imp-33315 sub-term formulas are in use.
    id: 'imp33540-reproduces-imp3406-and-imp3444-landmarks',
    description: 'N_max ~ 9.22e5 (imp-3406) and N_cross ~ 3.28e9 (imp-3444) reproduced',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-3,
  },
  {
    // (F1): the closed-form product identity reproduces the imp-33315 ~3.0e-2 overshoot to the
    // arithmetic floor -- the two-power form enters ONLY as 1/E_coll in that product.
    id: 'imp33540-overshoot-closed-form-identity',
    description: 'OS = sigma_ft*sigma_full*(E_flow/E_coll) matches the direct ~3.0e-2 overshoot to ~1e-12',
    holds: () =>
      Math.abs(OVERSHOOT_DIRECT - 2.996e-2) < 5e-4 &&
      OVERSHOOT_IDENTITY_GAP < 1e-12,
  },
  {
    // (F2): the additive log decomposition -- the two fractions sum to 1, the -1/2 ln N slope
    // carries ~106% and the +1/2 sqrt(log T0) coefficient ~-6% (opposite sign).
    id: 'imp33540-lnN-slope-carries-off-regime-residual',
    description: 'Delta S_slope ~ +4.09 (~106%) vs Delta S_sqrt ~ -0.23 (~-6%); fractions sum to 1',
    holds: () =>
      DS_SLOPE > 3.9 && DS_SLOPE < 4.3 &&
      DS_SQRT < 0 && DS_SQRT > -0.35 &&
      Math.abs(FRAC_SLOPE + FRAC_SQRT - 1) < 1e-9 &&
      FRAC_SLOPE > 1 && FRAC_SLOPE < 1.12 &&
      FRAC_SQRT < 0 && FRAC_SQRT > -0.12,
  },
  {
    // (F2): the N^(-1/2) power dominates the sqrt(log T0) half-power ~18:1 in the off-regime residual.
    id: 'imp33540-slope-dominates-sqrt-18to1',
    description: 'the -1/2 ln N slope out-carries the +1/2 sqrt(log T0) coefficient ~18:1',
    holds: () => SLOPE_TO_SQRT_RATIO > 14 && SLOPE_TO_SQRT_RATIO < 22,
  },
  {
    // (F3): the half-power barely moves -- ln(log T0) shifts far less than ln N over the span,
    // and its local elasticity at the peak is small; the imp-33291 collinearity, quantitatively.
    id: 'imp33540-half-power-barely-moves',
    description: 'ln(log T0) moves ~0.46 vs ~8.18 for ln N over the 3.55-decade off-regime span',
    holds: () =>
      Math.abs(D_LN_N) > 7.5 && Math.abs(D_LN_N) < 9 &&
      Math.abs(D_LN_L) < 0.6 &&
      OFF_REGIME_DECADES > 3.4 && OFF_REGIME_DECADES < 3.7 &&
      LOCAL_SQRT_ELASTICITY > 0 && LOCAL_SQRT_ELASTICITY < 0.1,
  },
  {
    // Honesty gate: measurement/decomposition only, no QED, PT stays SOTA.
    id: 'imp33540-honesty-gate-no-qed',
    description: 'Measurement/decomposition only: no QED, PT stays SOTA',
    holds: () =>
      IMP33540_SIGMA_FARTAIL_OVERSHOOT_TWO_POWER_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP33540_SIGMA_FARTAIL_OVERSHOOT_TWO_POWER_DECOMPOSITION.verdict) &&
      /remains SOTA/.test(IMP33540_SIGMA_FARTAIL_OVERSHOOT_TWO_POWER_DECOMPOSITION.verdict),
  },
];

for (const a of IMP33540_SIGMA_FARTAIL_OVERSHOOT_TWO_POWER_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33540-sigma-fartail-overshoot-two-power-decomposition assertion failed: ${a.id}`);
  }
}
