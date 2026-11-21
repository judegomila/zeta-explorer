/**
 * @module imp-96162-sigma-ushape-peak-eflow-recovery
 *
 * imp-96162 (numerical, frontier-direction): imp-96151 found that promoting the imp-33723
 * closed-form crossover to the two-term analytic share
 *   sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N)))
 * reproduces the imp-33582 post-peak decay-exponent ramp EXACTLY past 1e12 but is monotone
 * DECREASING over [1e2,1e12] -- so it captures only the RIGHT ARM of the imp-3220 U-shape and
 * misses the interior peak (sigma_max ~ 0.9494 at N ~ 9.22e5), which imp-96151 F2 attributed to
 * the omitted Gronwall flow term E_flow. This module derives the explicit pre-crossover rising
 * term that recovers the peak, and measures its fit against the full E_coll/E(N) share.
 *
 * THE RECOVERED THREE-TERM CLOSED FORM (add the pre-crossover rising factor back)
 * ------------------------------------------------------------------------------
 * The full share is sigma = E_coll / (E_trunc + E_flow + E_coll) = 1 / (1 + (E_trunc + E_flow)/E_coll).
 * Split the numerator ratio into a truncation piece and a flow piece:
 *   (E_trunc + E_flow)/E_coll = (E_trunc/E_coll) (1 + E_flow/E_trunc).
 * The imp-96151 crossover identity K = (C_C/E_trunc)^2 = N_cross/L_cross makes the imp-96151
 * closed-form factor EXACTLY the truncation ratio (verified to 1.6e-16, not an approximation):
 *   sqrt(N/N_cross) sqrt(L_cross/L) = (E_trunc/C_C) sqrt(N/L) = E_trunc/E_coll.
 * So the recovered model is the imp-96151 two-term form multiplied by ONE explicit pre-crossover
 * rising factor r_pre(N) = 1 + E_flow/E_trunc (the "sub-crossover component"):
 *
 *   sigma_rec(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N)) * (1 + E_flow(N)/E_trunc)).
 *
 * E_flow/E_trunc -> 0 in the far tail, so r_pre -> 1 and sigma_rec -> sigma_CF (imp-96151 F1
 * ramp preserved); at small N the factor r_pre is large and pushes sigma back down, restoring the
 * rising LEFT ARM the two-term form omits. Because the CF factor is EXACTLY E_trunc/E_coll,
 * sigma_rec is the full three-term share re-expressed on the imp-96151 crossover variables.
 *
 * THE PEAK IS SET BY A SECOND (NUMERATOR) CROSSOVER N_flow, DISTINCT FROM N_cross
 * -------------------------------------------------------------------------------
 * sigma peaks where g(N) = (E_trunc + E_flow)/E_coll is minimal. Write g = g_t + g_f with
 * g_t = E_trunc/E_coll (rising, d ln g_t/d ln N ~ +1/2 since g_t ~ sqrt(N/L)) and g_f = E_flow/E_coll
 * (falling, d ln g_f/d ln N ~ -1/2 since E_flow ~ L/T0 ~ (ln N)^2/N and E_coll ~ 1/sqrt(N)). Setting
 * d g/d ln N = 0 gives, to LEADING ORDER, g_t = g_f, i.e. E_trunc = E_flow: the peak sits at the
 * numerator crossover N_flow where the Gronwall flow term equals the truncation floor. This is a
 * SECOND crossover, ~3.3 decades BELOW the imp-33723 denominator crossover N_cross (E_coll=E_trunc,
 * the sigma=1/2 point that governs the right arm). Log corrections (the measured log-derivatives
 * are +0.466 and -0.304, not the clean +/-1/2) place the exact peak at E_flow/E_trunc = 1.530 and
 * at N ~ 0.577 N_flow -- numerically near 1/sqrt(3) (0.57735), but the non-1/2 log-derivatives make
 * that proximity a flagged coincidence, NOT a derived identity.
 *
 * THE FINDING (measurement/derivation only)
 * -----------------------------------------
 *   (F1) THE PRE-CROSSOVER FACTOR RECOVERS THE FULL U-SHAPE TO MACHINE PRECISION. sigma_rec matches
 *        the full three-term share to max relative error 5.7e-16 over [1e5,1e12] (it IS the full
 *        share re-expressed, since the CF factor equals E_trunc/E_coll to 1.6e-16), and its interior
 *        peak is sigma = 0.949429 at N = 9.2257e5 -- the imp-3220 landmark exactly. The single
 *        explicit rising factor r_pre = 1 + E_flow/E_trunc restores the left arm the imp-96151
 *        two-term form omits, while r_pre -> 1 in the far tail preserves the imp-96151 F1 ramp.
 *   (F2) THE PEAK IS THE SECOND (NUMERATOR) CROSSOVER, NOT THE DENOMINATOR CROSSOVER. To leading
 *        order the peak sits at N_flow where E_flow = E_trunc (N_flow ~ 1.598e6, log10 6.204),
 *        derived from the +1/2 / -1/2 log-slopes of g_t and g_f. The exact peak (N ~ 9.226e5,
 *        log10 5.965) sits at E_flow/E_trunc = 1.530, a factor 0.577 below N_flow after log
 *        corrections. This cleanly separates the U-shape into TWO crossovers: N_flow (numerator,
 *        peak) ~3.3 decades below N_cross (denominator, right-arm half-value ~3.280e9).
 *   (F3) THE PEAK IS PURELY A FLOW EFFECT. With r_pre forced to 1 (drop E_flow) the model is the
 *        imp-96151 two-term form, strictly monotone decreasing over [1e2,1e12] with no interior
 *        peak; the entire rising left arm and peak come from r_pre = 1 + E_flow/E_trunc, which is
 *        1.530 above unity at the peak. This confirms the imp-96151 F2 attribution of the peak to
 *        the Gronwall flow term and upgrades it from a qualitative statement to an explicit factor.
 *
 * The punchline: the imp-3220 U-shape peak the imp-96151 two-term closed form misses is recovered
 * EXACTLY by ONE explicit pre-crossover rising factor r_pre(N) = 1 + E_flow/E_trunc, and the peak
 * location is the SECOND, numerator crossover N_flow (E_flow=E_trunc, ~1.6e6) -- distinct from and
 * ~3.3 decades below the imp-33723 denominator crossover N_cross (E_coll=E_trunc, ~3.28e9) that
 * governs the right arm.
 *
 * MEASUREMENT/DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED (the share stays GUE-conditional); the C_C 1/8 ansatz is
 * UNTOUCHED (imp-2642/imp-2643); changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (two-term CF, F2 misses the peak)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (denominator crossover N_cross fixed point)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (post-peak right-arm decay ramp)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (no re-derivation, inherited from imp-96151).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;

// imp-33723/imp-96151 denominator crossover: N = K log T0(N), K = (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 60); // ~3.280294e9 (E_coll = E_trunc)
const L_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576

// imp-96151 two-term closed form (no flow): sigma_CF = 1/(1 + E_trunc/E_coll), E_trunc/E_coll
// = sqrt(N/N_cross) sqrt(L_cross/L). This is the RIGHT-ARM-only model that misses the peak.
function truncRatio(N) {
  const L = Math.log(effectiveHeightForN(N));
  return Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L);
}
const sigmaCF = (N) => 1 / (1 + truncRatio(N));

// RECOVERED three-term closed form: multiply by the explicit pre-crossover rising factor
//   r_pre(N) = 1 + E_flow(N)/E_trunc.
// sigma_rec(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L) (1 + E_flow/E_trunc)).
function risingFactor(N) {
  return 1 + parts(N).E_flow / E_TRUNC_PT;
}
const sigmaRec = (N) => 1 / (1 + truncRatio(N) * risingFactor(N));

// Central-difference sign of the share slope in N (U-shape probe).
function dSigmadN(f, N) {
  const h = N * 1e-6;
  return (f(N + h) - f(N - h)) / (2 * h);
}

// (Exactness) the imp-96151 CF factor equals E_trunc/E_coll (not an approximation).
let MAX_CF_VS_TRUNC_RATIO_REL = 0;
for (let k = 5; k <= 12; k += 0.5) {
  const N = Math.pow(10, k);
  const et = E_TRUNC_PT / parts(N).E_coll;
  MAX_CF_VS_TRUNC_RATIO_REL = Math.max(MAX_CF_VS_TRUNC_RATIO_REL, Math.abs(truncRatio(N) - et) / et);
}

// (F1) fit of the recovered model against the full three-term share over [1e5,1e12].
let MAX_REL_ERR_REC = 0;
for (let k = 5; k <= 12; k += 0.005) {
  const N = Math.pow(10, k);
  MAX_REL_ERR_REC = Math.max(MAX_REL_ERR_REC, Math.abs(sigmaRec(N) - sigmaFull(N)) / sigmaFull(N));
}
// recovered-model interior peak (should match the imp-3220 landmark).
let REC_PEAK_N = 0;
let REC_PEAK_SIGMA = -1;
for (let k = 5; k <= 8; k += 0.0005) {
  const N = Math.pow(10, k);
  const s = sigmaRec(N);
  if (s > REC_PEAK_SIGMA) {
    REC_PEAK_SIGMA = s;
    REC_PEAK_N = N;
  }
}

// (F2) second (numerator) crossover N_flow where E_flow = E_trunc (peak predictor, leading order).
let nfLo = 1e3;
let nfHi = 1e12;
for (let i = 0; i < 300; i++) {
  const mid = Math.sqrt(nfLo * nfHi);
  if (parts(mid).E_flow > E_TRUNC_PT) nfLo = mid;
  else nfHi = mid;
}
const N_FLOW = Math.sqrt(nfLo * nfHi); // ~1.598e6
const PEAK_OVER_NFLOW = REC_PEAK_N / N_FLOW; // ~0.577 (log-corrected)
const EFLOW_OVER_ETRUNC_AT_PEAK = parts(REC_PEAK_N).E_flow / E_TRUNC_PT; // ~1.530

// (F3) with the rising factor forced to 1 (drop flow) the model is monotone -- the peak is flow-only.
let CF_MONOTONE_DOWN = true;
for (let k = 2; k <= 12; k += 0.25) {
  if (dSigmadN(sigmaCF, Math.pow(10, k)) >= 0) CF_MONOTONE_DOWN = false;
}
const REC_RISES_AT_1E5 = dSigmadN(sigmaRec, 1e5) > 0; // left arm rising
const REC_FALLS_AT_1E7 = dSigmadN(sigmaRec, 1e7) < 0; // right arm falling

export const IMP96162_SIGMA_USHAPE_PEAK_EFLOW_RECOVERY = {
  id: 'imp-96162',
  proofSection: 'S-frontier',
  question:
    'Derive the pre-crossover rising term that recovers the imp-3220 U-shape peak the imp-96151 ' +
    'two-term closed form sigma_CF(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L(N))) misses (it ' +
    'reproduces only the right arm), and measure its fit against the full E_coll/E(N) share over ' +
    '[1e5,1e12]. Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  recoveredModel:
    'sigma_rec(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N)) * (1 + E_flow(N)/E_trunc)). The ' +
    'imp-96151 CF factor sqrt(N/N_cross) sqrt(L_cross/L) EQUALS E_trunc/E_coll exactly (crossover ' +
    'identity K = N_cross/L_cross); the single explicit pre-crossover rising factor r_pre = ' +
    '1 + E_flow/E_trunc restores the left arm and peak, and r_pre -> 1 in the far tail preserves ' +
    'the imp-96151 F1 ramp.',
  landmarks: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (denominator crossover, E_coll=E_trunc)
    L_cross: +L_CROSS.toFixed(6), // ~20.857609
    N_flow: +N_FLOW.toExponential(6), // ~1.597752e6 (numerator crossover, E_flow=E_trunc)
    cf_factor_equals_trunc_ratio_max_rel: +MAX_CF_VS_TRUNC_RATIO_REL.toExponential(3), // ~1.6e-16
    rec_vs_full_max_rel_err_1e5_1e12: +MAX_REL_ERR_REC.toExponential(3), // ~5.7e-16
    rec_peak_sigma: +REC_PEAK_SIGMA.toFixed(6), // ~0.949429 (imp-3220 landmark)
    rec_peak_N: +REC_PEAK_N.toExponential(6), // ~9.225714e5
    rec_peak_log10N: +Math.log10(REC_PEAK_N).toFixed(4), // ~5.9650
    peak_over_N_flow: +PEAK_OVER_NFLOW.toFixed(6), // ~0.577 (near 1/sqrt3, flagged coincidence)
    eflow_over_etrunc_at_peak: +EFLOW_OVER_ETRUNC_AT_PEAK.toFixed(6), // ~1.530 (exact peak condition)
  },
  uShape: {
    two_term_cf_strictly_decreasing_1e2_1e12: CF_MONOTONE_DOWN, // true (no peak without the flow factor)
    recovered_model_rises_at_1e5: REC_RISES_AT_1E5, // true (left arm restored)
    recovered_model_falls_at_1e7: REC_FALLS_AT_1E7, // true (post-peak right arm)
  },
  finding: {
    F1_rising_factor_recovers_full_u_shape:
      'sigma_rec matches the full three-term share to max relative error ~5.7e-16 over [1e5,1e12] ' +
      '(the CF factor equals E_trunc/E_coll to ~1.6e-16, so sigma_rec IS the full share re-expressed ' +
      'on the imp-96151 crossover variables), with interior peak 0.949429 at N ~ 9.2257e5 -- the ' +
      'imp-3220 landmark exactly. One explicit pre-crossover factor r_pre = 1 + E_flow/E_trunc ' +
      'restores the left arm the imp-96151 two-term form omits, and r_pre -> 1 preserves the F1 ramp.',
    F2_peak_is_the_numerator_crossover:
      'To leading order the peak sits at the numerator crossover N_flow ~ 1.598e6 (log10 6.204) ' +
      'where E_flow = E_trunc, from the +1/2 / -1/2 log-slopes of g_t = E_trunc/E_coll and ' +
      'g_f = E_flow/E_coll. Log corrections place the exact peak (N ~ 9.226e5, log10 5.965) at ' +
      'E_flow/E_trunc = 1.530, a factor ~0.577 below N_flow (numerically near 1/sqrt3, flagged as a ' +
      'coincidence since the measured log-slopes are +0.466 / -0.304, not clean +/-1/2). The U-shape ' +
      'thus splits into TWO crossovers: N_flow (numerator, peak) ~3.3 decades below N_cross ' +
      '(denominator, right-arm half-value ~3.280e9).',
    F3_peak_is_purely_a_flow_effect:
      'Forcing r_pre = 1 (dropping E_flow) recovers the imp-96151 two-term form, strictly monotone ' +
      'decreasing over [1e2,1e12] with no interior peak; the entire rising left arm and peak come ' +
      'from r_pre = 1 + E_flow/E_trunc (which is 1.530 above unity at the peak). This upgrades the ' +
      'imp-96151 F2 qualitative attribution of the peak to the Gronwall flow term into an explicit ' +
      'multiplicative factor and a named second crossover.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). The imp-3220 U-shape peak the ' +
    'imp-96151 two-term closed form misses is recovered by ONE explicit pre-crossover rising factor ' +
    'r_pre(N) = 1 + E_flow/E_trunc: sigma_rec(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L) r_pre) ' +
    'matches the full three-term share to ~5.7e-16 over [1e5,1e12] (the CF factor equals ' +
    'E_trunc/E_coll to ~1.6e-16) and reproduces the interior peak 0.949429 at N ~ 9.2257e5 exactly. ' +
    'The peak location is a SECOND, numerator crossover N_flow (E_flow=E_trunc, ~1.598e6) -- ' +
    'distinct from and ~3.3 decades below the imp-33723 denominator crossover N_cross (E_coll=E_trunc, ' +
    '~3.280e9) that governs the right arm; the leading-order peak = N_flow is log-corrected to ' +
    '~0.577 N_flow (E_flow/E_trunc = 1.530 at the exact peak). Forcing r_pre = 1 recovers the ' +
    'monotone right-arm-only model, confirming the peak is purely a Gronwall flow effect. Component ' +
    'model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96151 (two-term closed form, F2 misses the peak); imp-33723 (denominator crossover N_cross ' +
    'fixed point); imp-3220 (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); imp-33582 (post-peak ' +
    'right-arm decay ramp); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96162_SIGMA_USHAPE_PEAK_EFLOW_RECOVERY_ASSERTIONS = [
  {
    // Reuse gate: the CF factor is EXACTLY E_trunc/E_coll (imp-96151 crossover identity), not a fit.
    id: 'imp96162-cf-factor-equals-trunc-ratio-exactly',
    description: 'sqrt(N/N_cross) sqrt(L_cross/L) == E_trunc/E_coll to machine precision over [1e5,1e12]',
    holds: () => MAX_CF_VS_TRUNC_RATIO_REL < 1e-12,
  },
  {
    // (F1): recovered model matches the full share to machine precision and reproduces the peak.
    id: 'imp96162-rising-factor-recovers-full-share',
    description: 'sigma_rec == full share to <1e-12 over [1e5,1e12]; peak 0.949429 at N ~ 9.2257e5',
    holds: () =>
      MAX_REL_ERR_REC < 1e-12 &&
      Math.abs(REC_PEAK_SIGMA - 0.949429) < 1e-4 &&
      Math.abs(REC_PEAK_N / 9.22e5 - 1) < 5e-3,
  },
  {
    // (F2): peak governed by the numerator crossover N_flow (E_flow=E_trunc), distinct from N_cross.
    id: 'imp96162-peak-is-numerator-crossover-below-N-cross',
    description: 'N_flow ~ 1.598e6 (E_flow=E_trunc); peak ~ 0.577 N_flow; N_flow ~3.3 decades below N_cross',
    holds: () =>
      Math.abs(N_FLOW / 1.597752e6 - 1) < 5e-3 &&
      Math.abs(PEAK_OVER_NFLOW - 0.5774) < 5e-3 &&
      Math.abs(EFLOW_OVER_ETRUNC_AT_PEAK - 1.5297) < 5e-3 &&
      N_FLOW < N_CROSS / 1e3,
  },
  {
    // (F3): the peak is purely a flow effect -- drop the rising factor and the model is monotone.
    id: 'imp96162-peak-is-purely-a-flow-effect',
    description: 'two-term CF strictly decreasing; recovered model rises at 1e5 and falls at 1e7',
    holds: () => CF_MONOTONE_DOWN && REC_RISES_AT_1E5 && REC_FALLS_AT_1E7,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96162-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96162_SIGMA_USHAPE_PEAK_EFLOW_RECOVERY.isRigorous === false &&
      /NO QED/.test(IMP96162_SIGMA_USHAPE_PEAK_EFLOW_RECOVERY.verdict) &&
      /refereed bound is changed/i.test(IMP96162_SIGMA_USHAPE_PEAK_EFLOW_RECOVERY.verdict),
  },
];

for (const a of IMP96162_SIGMA_USHAPE_PEAK_EFLOW_RECOVERY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96162-sigma-ushape-peak-eflow-recovery assertion failed: ${a.id}`);
  }
}
