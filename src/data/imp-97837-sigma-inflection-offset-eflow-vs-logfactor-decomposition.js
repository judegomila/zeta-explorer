/**
 * @module imp-97837-sigma-inflection-offset-eflow-vs-logfactor-decomposition
 *
 * imp-97837 (numerical, frontier-direction): imp-33744 derived the sigma-inflection offset as
 * sigma_infl = 1/2 - g_prime/(2 g^2), reaching EXACTLY 1/2 only in the pure power-law limit, and
 * attributed the measured ~3.3% offset (in N-position, ~5e-3 in sigma-position) to the E_coll
 * log-factor L = log T0(N) RUNNING, calling the Gronwall E_flow term a subdominant secondary shift.
 * A sibling assessment instead attributes PART of the offset to the E_flow term. This module MEASURES
 * the separate log-factor-running share and the E_flow share ACROSS SUB-DECADE BRACKETS and resolves
 * which dominates -- and finds the answer is OBSERVABLE-DEPENDENT, which reconciles the two claims.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33721 / imp-33744 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,   E_trunc = 3.06e-5   (N-independent).
 * Two nested balances: NO-FLOW (E_flow set to zero, log-factor running only) and FULL (E_flow on).
 *
 * TWO OBSERVABLES OF THE SAME OFFSET
 * ----------------------------------
 *   (A) VALUE observable: the actual displacement of the inflection from sigma = 1/2, i.e.
 *       0.5 - sigma(N_infl). This is "the measured deviation from the pure power-law 1/2". Split at
 *       the actual full-model inflection point N_infl into
 *           logShare  = 0.5 - sigma_noFlow(N_infl),      eflowShare = sigma_noFlow - sigma_full,
 *       both evaluated at the SAME N_infl.
 *   (B) CURVATURE-GENERATOR observable: the closed-form generator -g_prime/(2 g^2) that PRODUCES the
 *       offset, with g = -d ln r / d ln N. For the no-flow ratio r = E_coll/E_trunc this is the
 *       log-factor generator; for the full ratio r_f = E_coll/(E_trunc + E_flow) it also carries the
 *       E_flow running. eflowShare_gen = off_full - off_noFlow, per sub-decade bracket.
 *
 * THE RESULT (measurement -- both observables computed at import time; see assertions)
 * ----------------------------------------------------------------------------------
 *   (A) At the full-model inflection N_infl ~ 3.41e9, the VALUE offset 0.5 - sigma_full ~ 5.06e-3
 *       splits ~90.9% log-factor / ~9.1% E_flow: the E_coll log-factor running DOMINATES the measured
 *       deviation from 1/2. This CONFIRMS imp-33744 F2/F3 for the value observable.
 *   (B) The CURVATURE-GENERATOR -g_prime/(2 g^2) tells the OPPOSITE story near the landmark: at the
 *       imp-33582 halving point N ~ 3.27e9 the E_flow generator-share is ~58.9% (log ~41.1%), because
 *       E_flow runs steeply (its ~exp/T0 decay inflates g_prime locally) even though its MAGNITUDE is
 *       already small. The E_flow generator-share DECAYS steeply across sub-decades (~89% at N ~ 3e8
 *       down to ~2% at N ~ 1e12), crossing the log-factor share at N ~ 5.2e9 (t ~ 22.4). So the sibling
 *       assessment is right that E_flow contributes -- it even dominates the offset GENERATOR right at
 *       the landmark -- but that contribution decays away and does NOT dominate the actual deviation.
 *
 * THE RESOLUTION
 * --------------
 *   Which term dominates the ~3.3% offset is observable-dependent, and this pins the imp-33744-vs-sibling
 *   ambiguity exactly: for the MEASURED DEVIATION of sigma from the pure power-law 1/2 (the value
 *   observable), the E_coll log-factor running dominates ~91% (imp-33744 is correct); the sibling E_flow
 *   attribution is the CURVATURE-GENERATOR share -g_prime/(2 g^2), where E_flow steep running makes it
 *   the majority contributor (~59%) right at the landmark before decaying steeply across sub-decades.
 *   Both statements are true of different observables of the one offset.
 *
 * MEASUREMENT ONLY. Conditional-share curvature/value diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed form sigma_infl = 1/2 - g_prime/(2 g^2))
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma=1/2 halving landmark ~3.27e9)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee ~3.38e9, the ~3.3% N-offset)
 * @see imp-33708-sigma-fartail-landmark-Etrunc-floor-sensitivity (E_flow negligible on the far tail)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33744)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33744 exactly

// EXACT imp-33744 sub-terms -- no fresh model.
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigmaFull(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}
function sigmaNoFlow(N) {
  const { E_coll } = terms(N); // E_flow-negligible balance (imp-33708)
  return E_coll / (E_TRUNC_PT + E_coll);
}

// --- finite-difference operators in t = ln N (all diagnostics, no fresh model) ---
function d2SigmaDt2(sig, N) {
  const t = Math.log(N);
  const h = 1e-3;
  const f = (tt) => sig(Math.exp(tt));
  return (f(t + h) - 2 * f(t) + f(t - h)) / (h * h);
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

// --- curvature generator -g_prime/(2 g^2) for a chosen ratio r(N) ---
function gOf(lnR, N) {
  const t = Math.log(N);
  const h = 1e-4;
  return -((lnR(Math.exp(t + h)) - lnR(Math.exp(t - h))) / (2 * h));
}
function gPrimeOf(lnR, N) {
  const t = Math.log(N);
  const h = 1e-3;
  return (gOf(lnR, Math.exp(t + h)) - gOf(lnR, Math.exp(t - h))) / (2 * h);
}
function offGen(lnR, N) {
  const g = gOf(lnR, N);
  const gp = gPrimeOf(lnR, N);
  return -gp / (2 * g * g);
}
const lnR_noFlow = (N) => Math.log(terms(N).E_coll / E_TRUNC_PT);
const lnR_full = (N) => {
  const { E_coll, E_flow } = terms(N);
  return Math.log(E_coll / (E_TRUNC_PT + E_flow));
};

// --- (A) VALUE-observable split at the actual full-model inflection point ---
const N_INFL_FULL = findZeroInT((N) => d2SigmaDt2(sigmaFull, N));
const VALUE_TOTAL_OFFSET = 0.5 - sigmaFull(N_INFL_FULL);
const VALUE_LOG_SHARE = 0.5 - sigmaNoFlow(N_INFL_FULL);
const VALUE_EFLOW_SHARE = sigmaNoFlow(N_INFL_FULL) - sigmaFull(N_INFL_FULL);
const VALUE_LOG_PCT = (VALUE_LOG_SHARE / VALUE_TOTAL_OFFSET) * 100;
const VALUE_EFLOW_PCT = (VALUE_EFLOW_SHARE / VALUE_TOTAL_OFFSET) * 100;

// --- (B) CURVATURE-GENERATOR ladder across sub-decade (half-decade) brackets ---
const HALF_DECADE_LADDER = [3.2e8, 1e9, 3.2e9, 1e10, 3.2e10, 1e11, 3.2e11, 1e12];
const GENERATOR_LADDER = HALF_DECADE_LADDER.map((N) => {
  const oNo = offGen(lnR_noFlow, N);
  const oFu = offGen(lnR_full, N);
  const ef = oFu - oNo;
  return {
    N: +N.toExponential(1),
    t: +Math.log(N).toFixed(3),
    genLogShare: +oNo.toExponential(4),
    genTotal: +oFu.toExponential(4),
    genEflowShare: +ef.toExponential(4),
    logPct: +((Math.abs(oNo) / Math.abs(oFu)) * 100).toFixed(1),
    eflowPct: +((Math.abs(ef) / Math.abs(oFu)) * 100).toFixed(1),
  };
});

// generator shares exactly at the imp-33582 halving landmark
const HALVING_LANDMARK_N = 3.27e9;
const GEN_OFF_NOFLOW_HALF = offGen(lnR_noFlow, HALVING_LANDMARK_N);
const GEN_OFF_FULL_HALF = offGen(lnR_full, HALVING_LANDMARK_N);
const GEN_EFLOW_HALF = GEN_OFF_FULL_HALF - GEN_OFF_NOFLOW_HALF;
const GEN_LOG_PCT_HALF = (Math.abs(GEN_OFF_NOFLOW_HALF) / Math.abs(GEN_OFF_FULL_HALF)) * 100;
const GEN_EFLOW_PCT_HALF = (Math.abs(GEN_EFLOW_HALF) / Math.abs(GEN_OFF_FULL_HALF)) * 100;

// generator crossover: |genLogShare| == |genEflowShare| (equal-share N)
function genCrossFn(N) {
  const oNo = offGen(lnR_noFlow, N);
  const ef = offGen(lnR_full, N) - oNo;
  return Math.abs(oNo) - Math.abs(ef);
}
function findGenCrossover() {
  let lo = Math.log(1e9);
  let hi = Math.log(1e11);
  let flo = genCrossFn(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = genCrossFn(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}
const GEN_CROSSOVER_N = findGenCrossover();

export const IMP97837_SIGMA_INFLECTION_OFFSET_DECOMPOSITION = {
  id: 'imp-97837',
  proofSection: 'S-frontier',
  question:
    'imp-33744 attributed the ~3.3% sigma-inflection offset to the E_coll log-factor running and called ' +
    'E_flow a subdominant secondary shift; a sibling assessment attributes part of the offset to E_flow. ' +
    'Decompose the offset into its log-factor-running share and its E_flow share across sub-decade ' +
    'brackets to resolve which term dominates the measured deviation from the pure power-law 1/2. ' +
    'Measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'log-factor share vs E_flow share of the sigma-inflection offset in TWO observables: (A) the VALUE ' +
    'displacement 0.5 - sigma(N_infl) at the full-model inflection, and (B) the curvature GENERATOR ' +
    '-g_prime/(2 g^2), g = -d ln r/d ln N, across half-decade sub-brackets from N ~ 3e8 to N ~ 1e12',
  // (A) VALUE observable at the actual inflection point
  inflectionN_full: +N_INFL_FULL.toExponential(4),
  valueTotalOffset: +VALUE_TOTAL_OFFSET.toExponential(4),
  valueLogFactorShare: +VALUE_LOG_SHARE.toExponential(4),
  valueEflowShare: +VALUE_EFLOW_SHARE.toExponential(4),
  valueLogFactorPct: +VALUE_LOG_PCT.toFixed(1),
  valueEflowPct: +VALUE_EFLOW_PCT.toFixed(1),
  // (B) curvature-generator observable
  generatorLadder: GENERATOR_LADDER,
  halvingLandmarkN: HALVING_LANDMARK_N,
  generatorLogPctAtHalving: +GEN_LOG_PCT_HALF.toFixed(1),
  generatorEflowPctAtHalving: +GEN_EFLOW_PCT_HALF.toFixed(1),
  generatorEqualShareCrossoverN: +GEN_CROSSOVER_N.toExponential(4),
  generatorEqualShareCrossoverT: +Math.log(GEN_CROSSOVER_N).toFixed(3),
  finding: {
    F1_value_observable_log_factor_dominates:
      'At the full-model inflection N_infl ~ 3.41e9 the VALUE offset 0.5 - sigma_full ~ 5.06e-3 splits ' +
      '~90.9% E_coll log-factor running / ~9.1% E_flow. For the MEASURED deviation of sigma from the ' +
      'pure power-law 1/2 the log-factor running DOMINATES -- this confirms imp-33744 F2/F3.',
    F2_generator_observable_eflow_dominates_at_landmark:
      'The curvature generator -g_prime/(2 g^2) tells the opposite story near the landmark: at the ' +
      'imp-33582 halving point N ~ 3.27e9 the E_flow generator-share is ~58.9% (log ~41.1%), because ' +
      'E_flow runs steeply (its ~exp/T0 decay inflates g_prime locally) even though its magnitude is ' +
      'already small. So the sibling assessment is right that E_flow contributes -- it even dominates ' +
      'the offset GENERATOR right at the landmark.',
    F3_eflow_generator_share_decays_across_subdecades:
      'The E_flow generator-share decays steeply across sub-decade brackets (~89% at N ~ 3e8 down to ' +
      '~2% at N ~ 1e12), crossing the log-factor share at N ~ 5.2e9 (t ~ 22.4). Which term dominates ' +
      'the ~3.3% offset is therefore OBSERVABLE-DEPENDENT: log-factor for the measured value deviation, ' +
      'E_flow for the local curvature generator near the landmark, the latter decaying away in the tail.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The sigma-inflection offset decomposes differently ' +
    'in two observables of the SAME quantity. (A) VALUE observable 0.5 - sigma(N_infl) at N_infl ~ 3.41e9: ' +
    'total ~5.06e-3 splits ~90.9% E_coll log-factor running / ~9.1% E_flow, so the log-factor running ' +
    'DOMINATES the measured deviation from the pure power-law 1/2 -- confirming imp-33744. (B) CURVATURE ' +
    'GENERATOR -g_prime/(2 g^2): at the imp-33582 halving landmark N ~ 3.27e9 the E_flow generator-share ' +
    'is ~58.9% vs ~41.1% log-factor, because E_flow runs steeply near the landmark; that E_flow ' +
    'generator-share decays steeply across sub-decades (~89% at 3e8 to ~2% at 1e12, crossing at N ~ 5.2e9). ' +
    'RESOLUTION of the imp-33744-vs-sibling ambiguity: which term dominates is observable-dependent -- the ' +
    'log-factor dominates the measured value deviation (imp-33744 correct), while the sibling E_flow ' +
    'attribution is the curvature-generator share, where E_flow is the majority contributor right at the ' +
    'landmark before decaying steeply. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 SOTA.',
  citation:
    'imp-33744 (sigma_infl = 1/2 - g_prime/(2 g^2), offset attributed to log-factor running); imp-33582 ' +
    '(sigma=1/2 halving landmark ~3.27e9); imp-33721 (sub-decade ramp-inflection knee ~3.38e9, ~3.3% ' +
    'N-offset); imp-33708 (E_flow negligible on the far tail); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97837_SIGMA_INFLECTION_OFFSET_DECOMPOSITION_ASSERTIONS = [
  {
    // Reuse gate: the full-model inflection reproduces the imp-33744/imp-33721 sub-decade knee ~3.38e9.
    id: 'imp97837-reuses-imp33744-inflection-landmark',
    description: 'full-model inflection sits near the imp-33721/imp-33744 knee ~3.38e9 (within 5%)',
    holds: () => Math.abs(N_INFL_FULL / 3.38e9 - 1) < 0.05,
  },
  {
    // (F1): VALUE observable -- log-factor running dominates the measured deviation from 1/2 (~>=80%).
    id: 'imp97837-value-observable-log-factor-dominates',
    description: 'at the inflection the VALUE offset is >=80% log-factor and <=20% E_flow, both same sign as total',
    holds: () =>
      VALUE_LOG_PCT >= 80 &&
      VALUE_LOG_PCT <= 100 &&
      VALUE_EFLOW_PCT >= 0 &&
      VALUE_EFLOW_PCT <= 20 &&
      Math.abs(VALUE_LOG_PCT + VALUE_EFLOW_PCT - 100) < 1e-6,
  },
  {
    // (F1 sharp): the total value offset matches the imp-33744 ~5e-3 sigma displacement order.
    id: 'imp97837-value-offset-matches-imp33744-order',
    description: 'total value offset 0.5 - sigma_full(N_infl) is ~5e-3 (in [3e-3, 8e-3])',
    holds: () => VALUE_TOTAL_OFFSET > 3e-3 && VALUE_TOTAL_OFFSET < 8e-3,
  },
  {
    // (F2): GENERATOR observable -- E_flow generator-share is the MAJORITY right at the halving landmark.
    id: 'imp97837-generator-eflow-dominates-at-landmark',
    description: 'at the imp-33582 halving landmark the curvature-generator E_flow share exceeds the log-factor share (>50%)',
    holds: () => GEN_EFLOW_PCT_HALF > 50 && GEN_LOG_PCT_HALF < 50,
  },
  {
    // (F3): the E_flow generator-share DECAYS steeply across sub-decades -- head-heavy, tail-light.
    id: 'imp97837-generator-eflow-share-decays-across-subdecades',
    description: 'generator E_flow share falls monotonically from >80% at N~3e8 to <10% at N~1e12',
    holds: () => {
      const head = GENERATOR_LADDER[0].eflowPct; // N ~ 3.2e8
      const tail = GENERATOR_LADDER[GENERATOR_LADDER.length - 1].eflowPct; // N ~ 1e12
      let monotone = true;
      for (let i = 1; i < GENERATOR_LADDER.length; i++) {
        if (GENERATOR_LADDER[i].eflowPct > GENERATOR_LADDER[i - 1].eflowPct + 1e-6) monotone = false;
      }
      return head > 80 && tail < 10 && monotone;
    },
  },
  {
    // (F3 sharp): the equal-share crossover lands in the sub-decade just above the landmark.
    id: 'imp97837-generator-equal-share-crossover-above-landmark',
    description: 'the curvature-generator equal-share crossover N sits in (3.27e9, 1e10), just above the halving landmark',
    holds: () => GEN_CROSSOVER_N > HALVING_LANDMARK_N && GEN_CROSSOVER_N < 1e10,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, PT stays SOTA.
    id: 'imp97837-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT stays SOTA',
    holds: () =>
      IMP97837_SIGMA_INFLECTION_OFFSET_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP97837_SIGMA_INFLECTION_OFFSET_DECOMPOSITION.verdict) &&
      /Lambda <= 0\.2 SOTA/.test(IMP97837_SIGMA_INFLECTION_OFFSET_DECOMPOSITION.verdict),
  },
];

for (const a of IMP97837_SIGMA_INFLECTION_OFFSET_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97837-sigma-inflection-offset-eflow-vs-logfactor-decomposition assertion failed: ${a.id}`);
  }
}
