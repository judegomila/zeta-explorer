/**
 * @module imp-35257-ecoll-exponent-residual-closed-form-derivation
 *
 * imp-35257 (numerical, frontier-direction): imp-35242 MEASURED that the separated
 * E_coll local-decay-exponent residual to the far-tail -1/2 asymptote tracks the
 * imp-34130/imp-34187 closing law 1/(2 log T0) to <1e-4 across the ladder out to
 * N ~ 1e45, but it READ that agreement numerically and never DERIVED it from the
 * E_coll sub-term form. This module supplies the missing derivation and pins down
 * the one assumption the "1/(2 log T0)" law silently requires.
 *
 * (D1) CLOSED-FORM DERIVATION OF THE RESIDUAL
 * -------------------------------------------
 * The inherited imp-3220/imp-3406 E_coll sub-term is
 *     E_coll(N) = C_C * sqrt(log T0 / N) = C_C * (log T0)^(1/2) * N^(-1/2),
 * with T0 = effectiveHeightForN(N) the Riemann-von Mangoldt inverse. Taking logs,
 *     log E_coll = log C_C + (1/2) log log T0(N) - (1/2) log N.
 * The C_C prefactor is a constant, so differentiating in log N:
 *     d log E_coll / d log N = -1/2 + (1/2) * d(log log T0) / d(log N).
 * By the chain rule d(log log T0)/d(log N) = (1/log T0) * d(log T0)/d(log N), hence
 * the local-exponent RESIDUAL to the -1/2 asymptote is, EXACTLY,
 *
 *     residual  :=  d log E_coll / d log N - (-1/2)  =  (d log T0 / d log N) / (2 log T0).
 *
 * This is the closed form the imp-35257 title asks for. It is an identity of the
 * component model, not an approximation: the residual is the RvM height-map factor
 * F(N) := d log T0 / d log N divided by 2 log T0.
 *
 * (M1) THE RvM FACTOR F = d log T0 / d log N APPROACHES 1 (FROM BELOW)
 * -------------------------------------------------------------------
 * The stated closing law residual -> 1/(2 log T0) therefore holds iff F -> 1. From
 * the RvM count N = (T0/2pi)(log(T0/2pi) - 1) one has log N = log T0 + log(log(T0/2pi)
 * - 1) - log(2pi), so d log N/d log T0 = 1 + O(1/log T0) and F = 1 - 1/log T0 + o(1/log T0).
 * MEASURED (central difference on effectiveHeightForN, identity verified to ~1e-10):
 *
 *   log T0     F = d log T0/d log N     (1-F)*log T0     residual = F/(2 log T0)   1/(2 log T0)
 *   ~33.0      0.96788                  ~1.059           0.014678                  0.015165
 *   ~55.4      0.98134                  ~1.034           0.008851                  0.009019
 *   ~100.9     0.98990                  ~1.019           0.004907                  0.004957
 *   ~180.9     0.99441                  ~1.011           0.002749                  0.002765
 *   ~341.4     0.99706                  ~1.007           0.001460                  0.001466
 *   ~686.1     0.99854                  ~1.002           0.000728                  0.000729
 *
 * (M2) THE CLOSING LAW IS THE LEADING TERM; THE SUB-LEADING CORRECTION IS -1/(2 (log T0)^2)
 * ----------------------------------------------------------------------------------------
 * Because (1-F) * log T0 -> 1 (column three, converging to 1 from above), F = 1 -
 * 1/log T0 + o(1/log T0), so substituting into the exact identity,
 *     residual = F/(2 log T0) = 1/(2 log T0) - 1/(2 (log T0)^2) + o(1/(log T0)^2).
 * The imp-35242 "residual ~ 1/(2 log T0)" law is exactly the LEADING term; the residual
 * sits slightly BELOW 1/(2 log T0) by the sub-leading -1/(2 (log T0)^2) (~5e-5 at
 * log T0 ~ 100), which is precisely the size of the <1e-4 gap imp-35242 read numerically.
 *
 * THE FINDINGS (derivation + measurement only)
 * --------------------------------------------
 *   (D1) The residual equals (d log T0/d log N)/(2 log T0) EXACTLY -- an identity of the
 *        component model, verified to ~1e-10 (machine precision) via central-difference.
 *   (M1) The RvM factor F = d log T0/d log N rises monotonically toward 1 FROM BELOW as
 *        log T0 grows (0.968 -> 0.999 over log T0 ~ 33 -> 686), so the reduction of the
 *        exact residual to the stated 1/(2 log T0) closing law is driven by F -> 1 and is
 *        reached only in the log T0 -> inf limit.
 *   (M2) (1-F) log T0 -> 1, so F = 1 - 1/log T0 + o(...) and residual = 1/(2 log T0) -
 *        1/(2 (log T0)^2) + ...; the imp-35242 law is the leading term and the sub-leading
 *        correction (~5e-5 at log T0 ~ 100) matches the <1e-4 numerical gap imp-35242 saw.
 *
 * The punchline: the imp-35242 "residual ~ 1/(2 log T0)" law is not a coincidence -- it is
 * the leading term of the EXACT identity residual = (d log T0/d log N)/(2 log T0), which
 * reduces to 1/(2 log T0) precisely because the RvM factor d log T0/d log N -> 1 (from
 * below, as 1 - 1/log T0), leaving a computable -1/(2 (log T0)^2) sub-leading correction.
 *
 * DERIVATION + MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35242-ecoll-exponent-residual-0005-tolerance-locate (measured the residual ~ 1/(2 log T0) law derived here)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the residual ~ 1/(2 log T0) closing law, NO floor)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (E_coll exponent ladder, 1e15 rung)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz; cancels in the log-ratio)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// EXACT imp-33620/imp-35242 E_coll sub-term (no re-derivation, no fresh model).
function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N);
}

// Instantaneous d log(fn) / d log N at N = 10^e via a small central difference in
// s = log10 N. Used to verify the EXACT (instantaneous-derivative) identity, cleanly
// separated from the one-decade finite-difference convention imp-35242 tabulates.
function dLogDLogN(fn, e, h = 1e-5) {
  const hi = fn(Math.pow(10, e + h));
  const lo = fn(Math.pow(10, e - h));
  return Math.log(hi / lo) / (Math.log(10) * 2 * h);
}

// The measured RvM height-map factor F(N) = d log T0 / d log N.
function rvmFactor(e) {
  return dLogDLogN(effectiveHeightForN, e);
}

// The measured E_coll local-exponent residual to -1/2 (instantaneous).
function residualInstantaneous(e) {
  return dLogDLogN(eColl, e) + 0.5;
}

// The closed form predicted by the (D1) identity: residual = F / (2 log T0).
function residualClosedForm(e) {
  const T0 = effectiveHeightForN(Math.pow(10, e));
  return rvmFactor(e) / (2 * Math.log(T0));
}

// The measurement ladder in log10 N, spanning the imp-35242 range and deeper.
const DECADE_EXPONENTS = [15, 25, 45, 80, 150, 300];
const LADDER = DECADE_EXPONENTS.map((e) => {
  const T0 = effectiveHeightForN(Math.pow(10, e));
  const logT0 = Math.log(T0);
  const F = rvmFactor(e);
  const resMeasured = residualInstantaneous(e);
  const resClosed = residualClosedForm(e);
  return {
    logN: e,
    logT0: +logT0.toFixed(3),
    rvm_factor_F: +F.toFixed(6),
    one_minus_F_times_logT0: +((1 - F) * logT0).toFixed(4),
    residual_measured: +resMeasured.toFixed(7),
    residual_closed_form: +resClosed.toFixed(7),
    inv_two_log_T0: +(1 / (2 * logT0)).toFixed(7),
    identity_abs_err: +Math.abs(resMeasured - resClosed).toExponential(2),
  };
});

// (D1) Identity residual = F/(2 log T0) verified to machine precision across the ladder.
const IDENTITY_MAX_ABS_ERR = Math.max(...LADDER.map((r) => r.identity_abs_err));

// (M1) F rises monotonically toward 1 from below.
const RVM_FACTORS = LADDER.map((r) => r.rvm_factor_F);
const F_MONOTONE_INCREASING = RVM_FACTORS.every(
  (v, i) => i === 0 || v > RVM_FACTORS[i - 1],
);
const F_ALL_BELOW_ONE = RVM_FACTORS.every((v) => v < 1);
const F_DEEPEST = RVM_FACTORS[RVM_FACTORS.length - 1]; // ~0.9985 at log T0 ~ 686

// (M2) (1-F) log T0 -> 1, so residual = 1/(2 log T0) - 1/(2 (log T0)^2) + ...
const ONE_MINUS_F_LOGT0_DEEPEST = LADDER[LADDER.length - 1].one_minus_F_times_logT0; // -> ~1.00
// The sub-leading correction the closing law drops: residual - 1/(2 log T0) ~ -1/(2 (log T0)^2).
function subleadingResidualMinusLeading(e) {
  return residualClosedForm(e) - 1 / (2 * Math.log(effectiveHeightForN(Math.pow(10, e))));
}
function predictedSubleading(e) {
  const logT0 = Math.log(effectiveHeightForN(Math.pow(10, e)));
  return -1 / (2 * logT0 * logT0);
}
const SUBLEADING_MAX_REL_DEV = Math.max(
  ...DECADE_EXPONENTS.map((e) => {
    const meas = subleadingResidualMinusLeading(e);
    const pred = predictedSubleading(e);
    return Math.abs((meas - pred) / pred);
  }),
);

export const IMP35257_ECOLL_EXPONENT_RESIDUAL_CLOSED_FORM_DERIVATION = {
  id: 'imp-35257',
  proofSection: 'S-frontier',
  question:
    'Derive the closed form of the imp-35242 separated E_coll local-decay-exponent residual to ' +
    '-1/2 from E_coll = C_C sqrt(log T0 / N), and assess whether the RvM factor d log T0 / d log N ' +
    'approaches 1 (which would reduce the residual to the observed 1/(2 log T0) closing law). ' +
    'Derivation + measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  componentModel:
    'E_coll = C_C (log T0)^(1/2) N^(-1/2) (GUE-conditional C_H); T0 = effectiveHeightForN(N) (RvM ' +
    'inverse). log E_coll = log C_C + (1/2) log log T0 - (1/2) log N, so the C_C prefactor cancels ' +
    'in the log-derivative and the residual is a function of the RvM height map alone.',
  closedForm:
    'residual := d log E_coll / d log N - (-1/2) = (d log T0 / d log N) / (2 log T0), an EXACT ' +
    'identity of the component model (chain rule on log log T0), verified to ~1e-10.',
  ladder: LADDER,
  findings: {
    D1_closed_form_identity: {
      claim:
        'The E_coll local-exponent residual to -1/2 equals (d log T0/d log N)/(2 log T0) EXACTLY; ' +
        'differentiating log E_coll = log C_C + (1/2) log log T0 - (1/2) log N in log N gives ' +
        '-1/2 + (1/(2 log T0)) d log T0/d log N by the chain rule',
      identity_max_abs_err_over_ladder: +IDENTITY_MAX_ABS_ERR.toExponential(2), // ~1e-10
    },
    M1_rvm_factor_approaches_one: {
      claim:
        'The RvM factor F = d log T0/d log N rises monotonically toward 1 FROM BELOW as log T0 grows ' +
        '(0.968 at log T0 ~ 33 to 0.999 at log T0 ~ 686), so residual -> 1/(2 log T0) is reached only ' +
        'in the log T0 -> inf limit',
      F_monotone_increasing: F_MONOTONE_INCREASING,
      F_all_below_one: F_ALL_BELOW_ONE,
      F_deepest_rung: +F_DEEPEST.toFixed(6), // ~0.9985
    },
    M2_subleading_correction: {
      claim:
        '(1-F) log T0 -> 1, so F = 1 - 1/log T0 + o(...) and residual = 1/(2 log T0) - ' +
        '1/(2 (log T0)^2) + ...; the imp-35242 law is the leading term and the sub-leading ' +
        '-1/(2 (log T0)^2) correction (~5e-5 at log T0 ~ 100) matches the <1e-4 gap imp-35242 read',
      one_minus_F_times_logT0_deepest: ONE_MINUS_F_LOGT0_DEEPEST, // -> ~1.00
      subleading_max_rel_dev_over_ladder: +SUBLEADING_MAX_REL_DEV.toFixed(4),
    },
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). (D1) The imp-35242 separated ' +
    'E_coll local-exponent residual to the far-tail -1/2 asymptote equals (d log T0/d log N)/(2 log ' +
    'T0) EXACTLY -- an identity of the inherited component model obtained by differentiating ' +
    'log E_coll = log C_C + (1/2) log log T0 - (1/2) log N in log N (the C_C prefactor cancels), ' +
    'verified to ~1e-10 via central difference. (M1) The RvM height-map factor F = d log T0/d log N ' +
    'rises monotonically toward 1 FROM BELOW (0.968 at log T0 ~ 33 to 0.999 at log T0 ~ 686), so the ' +
    'reduction of the exact residual to the observed 1/(2 log T0) closing law (imp-34130/imp-34187) ' +
    'is driven by F -> 1 and is reached only in the log T0 -> inf limit. (M2) (1-F) log T0 -> 1, so ' +
    'F = 1 - 1/log T0 + o(...) and residual = 1/(2 log T0) - 1/(2 (log T0)^2) + ...; the imp-35242 ' +
    'law is precisely the leading term and the sub-leading -1/(2 (log T0)^2) correction (~5e-5 at ' +
    'log T0 ~ 100) accounts for the residual sitting slightly below 1/(2 log T0), matching the <1e-4 ' +
    'agreement imp-35242 read numerically. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35242 (measured the residual ~ 1/(2 log T0) law derived here); imp-34130 (residual ~ ' +
    '1/(2 log T0) closing law, no floor); imp-34187 (milestone ladder of the same law); imp-33620 ' +
    '(E_coll exponent ladder to 1e15); imp-486 (C_mb GUE-conditional); polymath15-constant-C-C (C_C ' +
    'cancels in the log-ratio); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35257_ECOLL_EXPONENT_RESIDUAL_CLOSED_FORM_DERIVATION_ASSERTIONS = [
  {
    // (D1): the closed-form identity residual = F/(2 log T0) holds to machine precision.
    id: 'imp35257-closed-form-identity-holds',
    description: 'residual equals (d log T0/d log N)/(2 log T0) to <1e-8 across the ladder',
    holds: () => IDENTITY_MAX_ABS_ERR < 1e-8,
  },
  {
    // (M1): F = d log T0/d log N rises monotonically toward 1 from below.
    id: 'imp35257-rvm-factor-approaches-one-from-below',
    description: 'F rises monotonically, stays below 1, and reaches ~0.999 at the deepest rung',
    holds: () =>
      F_MONOTONE_INCREASING &&
      F_ALL_BELOW_ONE &&
      F_DEEPEST > 0.998 &&
      F_DEEPEST < 1,
  },
  {
    // (M2): (1-F) log T0 -> 1, and the sub-leading correction is -1/(2 (log T0)^2).
    id: 'imp35257-subleading-correction-inverse-square-log',
    description: '(1-F) log T0 -> ~1 and residual - 1/(2 log T0) matches -1/(2 (log T0)^2)',
    holds: () =>
      Math.abs(ONE_MINUS_F_LOGT0_DEEPEST - 1) < 0.02 &&
      SUBLEADING_MAX_REL_DEV < 0.1,
  },
  {
    // Reuse gate: the residual reproduces the imp-35242 1/(2 log T0) magnitude at log T0 ~ 100.
    id: 'imp35257-reproduces-imp35242-magnitude',
    description: 'residual at log T0 ~ 100 sits just below 1/(2 log T0), matching imp-35242',
    holds: () => {
      const e = 45;
      const res = residualInstantaneous(e);
      const inv = 1 / (2 * Math.log(effectiveHeightForN(Math.pow(10, e))));
      return res < inv && inv - res < 1e-4 && res > 0.004 && res < 0.006;
    },
  },
  {
    // Honesty gate: derivation + measurement only, no QED, no refereed bound is changed.
    id: 'imp35257-honesty-gate-no-qed',
    description: 'Derivation + measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35257_ECOLL_EXPONENT_RESIDUAL_CLOSED_FORM_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP35257_ECOLL_EXPONENT_RESIDUAL_CLOSED_FORM_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP35257_ECOLL_EXPONENT_RESIDUAL_CLOSED_FORM_DERIVATION.verdict),
  },
];

for (const a of IMP35257_ECOLL_EXPONENT_RESIDUAL_CLOSED_FORM_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35257-ecoll-exponent-residual-closed-form-derivation assertion failed: ${a.id}`,
    );
  }
}
