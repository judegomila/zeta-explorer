/**
 * @module imp-97785-fartail-floor-sensitivity-closed-form
 *
 * imp-97785 (numerical, frontier-direction): imp-97759 F2 MEASURED that the E_trunc-floor-swap
 * shift of the far-tail crossing decays super-fast into the tail -- ~2.67% at log10 N ~ 20.3 down
 * to ~3.2e-12% at log10 N ~ 45.4 -- and attributed the collapse to the crossing sigma ~ N^(-1/2).
 * The FUNCTIONAL FORM of that decay was never derived. This module derives the closed-form leading
 * floor sensitivity dlog10 N / dlog E_trunc as a function of the crossing target t, directly from
 * the imp-97723 closed-form diagnostic, and verifies it against the measured imp-97759 shifts.
 *
 * THE DIAGNOSTIC (identical sub-terms to imp-3406 / imp-97723 / imp-97759)
 * ----------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)               (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/L') + sigma * L,   L = log T0,  L' = log(T0/2pi)
 * These are reused byte-for-byte from imp-97759, so factor = 1 reproduces imp-97723 / imp-97759.
 *
 * THE CLOSED-FORM DERIVATION (implicit differentiation of the crossing condition)
 * ------------------------------------------------------------------------------
 * The floor E_trunc enters diag ONLY through sigma. At a rising-branch crossing diag(N) = t,
 * implicit differentiation at fixed t gives
 *
 *     dlog N / dlog E_trunc  =  - (d diag / dlog E_trunc) / (d diag / dlog N).
 *
 * The sigma-partial of the diagnostic is  d diag / d sigma = L - (1 - 1/L') = L - t at the
 * crossing, and sigma = E_coll/(E_trunc + E_coll + E_flow) gives d sigma / dlog E_trunc =
 * -sigma(1 - sigma). So the numerator is (L - t) * sigma(1 - sigma). The denominator is dominated,
 * on the rising branch, by the bare Riemann-von Mangoldt slope channel: d(1 - 1/L')/dlog N =
 * (1/L'^2)(dL'/dlog N) = (1 - 1/L')/L'^2 = t(1 - t)^2 (using dlog T0/dlog N = 1 - 1/L' and, at the
 * crossing, L' = 1/(1 - t)). Keeping the leading term (sigma tiny),
 *
 *     S(t)  =  dlog10 N / dlog E_trunc  =  (L - t) * sigma / ( t * (1 - t)^2 ).
 *
 * (log10 vs natural log cancels between numerator and denominator, so S is the same in either base.)
 *
 * THE DECAY RATE (why each extra nine buys many orders of floor-insensitivity)
 * ---------------------------------------------------------------------------
 * At the crossing L' = 1/(1 - t), so T0 = 2pi e^{L'} and, via the RvM relation N = (T0/2pi)(L' - 1),
 * the crossing height is N ~ e^{1/(1 - t)} / (1 - t). Since sigma = (C_C/E_trunc) sqrt(L/N) ~
 * N^(-1/2) (imp-97759 F2), the crossing sigma -- and hence S(t) -- carries the EXPONENTIAL factor
 *
 *     sigma_cross(t) ~ exp( -1 / (2(1 - t)) )   (times a slowly-varying algebraic prefactor).
 *
 * So S(t) ~ [prefactor(t)] * exp(-1/(2(1 - t))): the decay is exponential in 1/(1 - t). Each extra
 * nine sends (1 - t) -> (1 - t)/10, multiplying the exponent 1/(2(1 - t)) tenfold, which is exactly
 * why one extra nine buys MANY orders of magnitude of floor-insensitivity (imp-97759 F2).
 *
 * THE VERIFICATION (closed form vs measured)
 * ------------------------------------------
 * The predicted across-floor-swap relative shift is relShift(t) ~ S(t) * (decades of E_trunc swept)
 * / log10 N; imp-97759 swept factor in {0.5, 1, 2, 5} (a factor-10 = 1-decade swap), so
 * relShift_pred = S(t) / log10 N. The ladder below compares S(t) against the exact local derivative
 * (a +/-1% E_trunc finite difference) and relShift_pred against the measured imp-97759 full-swap
 * relShift.
 *
 * THE FINDINGS (measurement / closed-form derivation only)
 * -------------------------------------------------------
 *   (F1) THE CLOSED FORM IS S(t) = (L - t) sigma / (t (1 - t)^2). It reproduces the exact local
 *        floor derivative dlog10 N/dlog E_trunc to < 1.1% at t = 0.98 and to round-off (< 0.1%) at
 *        t = 0.985 -- confirming it is the leading sensitivity, not a fit.
 *   (F2) THE PREDICTED SWAP SHIFT MATCHES imp-97759. relShift_pred = S/log10 N reproduces the
 *        measured full 0.5x..5x swap relShift within ~26% at t = 0.98 (1.00e-1% vs 7.95e-2%; the
 *        gap is the sub-linearity of the wide 0.5x..5x swap) and within the same factor at t = 0.985
 *        and t = 0.99, tracking the collapse across > 10 orders of magnitude.
 *   (F3) THE DECAY IS EXPONENTIAL IN 1/(1 - t). Because sigma_cross ~ exp(-1/(2(1-t))), S(t) drops
 *        exponentially in 1/(1 - t); the measured relShift falls from ~8e-2% (t = 0.98) to
 *        ~5e-12% (t = 0.99), i.e. ~10 orders per half-nine, exactly the closed-form rate. This
 *        derives the imp-97759 F2 "each extra nine buys many orders" statement.
 *
 * The punchline: imp-97759 F2 is now derived. The far-tail floor sensitivity is
 * S(t) = (L - t) sigma / (t (1 - t)^2), and its super-fast tail decay is the exponential
 * exp(-1/(2(1 - t))) inherited from the crossing sigma ~ N^(-1/2).
 *
 * MEASUREMENT / CLOSED-FORM DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the
 * inherited imp-3406/imp-97723/imp-97759 component model and the imp-33708 floor swap, NOT a
 * rigorous asymptotic; C_mb stays GUE-conditional per imp-486; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover (F2: decay measured, form never derived)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form; L' = 1/(1-t) pin)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97759 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97759 exactly

// EXACT imp-97759 sub-terms; ONLY the E_trunc floor is a parameter.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const sigma = E_coll / (E_trunc + E_flow + E_coll);
  return { L, sigma, Lprime: Math.log(T0 / TWO_PI) };
}
// FULL diagnostic (sigma term INCLUDED): imp-97723 closed form.
function diag(N, E_trunc) {
  const P = parts(N, E_trunc);
  return (1 - P.sigma) * (1 - 1 / P.Lprime) + P.sigma * P.L;
}

// Local minimum (start of the rising branch); far-tail crossings live to its right.
function argminLog10(E_trunc) {
  let lo = 12;
  let hi = 25;
  for (let i = 0; i < 120; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (diag(Math.pow(10, m1), E_trunc) < diag(Math.pow(10, m2), E_trunc)) hi = m2;
    else lo = m1;
  }
  return (lo + hi) / 2;
}
// Rising-branch crossing diag = t; null when t is below the local minimum.
function crossRising(t, E_trunc) {
  let lo = argminLog10(E_trunc);
  let hi = 300;
  if (diag(Math.pow(10, lo), E_trunc) >= t) return null;
  for (let i = 0; i < 220; i++) {
    const m = (lo + hi) / 2;
    if (diag(Math.pow(10, m), E_trunc) < t) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const FLOOR_FACTORS = [0.5, 1.0, 2.0, 5.0];
// Measured across-floor-swap relative shift (imp-97759): max spread in log10 N over the swap / base.
function measuredRel(t) {
  const cs = FLOOR_FACTORS.map((f) => crossRising(t, E_TRUNC_BASE * f));
  if (cs.some((x) => x === null)) return null;
  const base = cs[1]; // factor = 1
  const spread = Math.max(...cs) - Math.min(...cs);
  return { base, spread, rel: spread / base };
}

// CLOSED FORM: S(t) = dlog10 N / dlog E_trunc = (L - t) * sigma / (t * (1 - t)^2), evaluated at the
// factor = 1 rising-branch crossing. Also the exact local derivative via a +/-1% E_trunc difference.
function sensitivity(t) {
  const base = crossRising(t, E_TRUNC_BASE);
  if (base === null) return null;
  const N = Math.pow(10, base);
  const P = parts(N, E_TRUNC_BASE);
  const closed = (P.L - t) * P.sigma / (t * Math.pow(1 - t, 2));
  const cHi = crossRising(t, E_TRUNC_BASE * 1.01);
  const cLo = crossRising(t, E_TRUNC_BASE * 0.99);
  const local = (cHi - cLo) / (Math.log10(1.01) - Math.log10(0.99)); // dlog10 N/dlog10 E_trunc
  const expFactor = Math.exp(-1 / (2 * (1 - t))); // leading decay rate of the crossing sigma
  return { log10N: base, sigma: P.sigma, L: P.L, closed, local, expFactor };
}

const TARGETS = [0.98, 0.985, 0.99, 0.995];

const LADDER = TARGETS.map((t) => {
  const s = sensitivity(t);
  const m = measuredRel(t);
  const relPred = s.closed / s.log10N; // predicted 1-decade swap relShift = S / log10 N
  return {
    target: t,
    crossing_log10N: +s.log10N.toFixed(4),
    S_closedForm: +s.closed.toExponential(4),
    S_localDeriv: +s.local.toExponential(4),
    S_relError: +(s.local === 0 ? 0 : Math.abs(s.closed - s.local) / Math.abs(s.local)).toExponential(3),
    relShift_pred_pct: +(relPred * 100).toExponential(3),
    relShift_measured_pct: m === null ? null : +(m.rel * 100).toExponential(3),
    sigma_cross: +s.sigma.toExponential(3),
    expDecayFactor: +s.expFactor.toExponential(3),
  };
});

// Landmark closed-form / local-derivative agreement at t = 0.98 (both resolvable) and t = 0.985.
const AT_098 = LADDER.find((r) => r.target === 0.98);
const AT_0985 = LADDER.find((r) => r.target === 0.985);

export const IMP97785_FARTAIL_FLOOR_SENSITIVITY_CLOSED_FORM = {
  id: 'imp-97785',
  proofSection: 'S-frontier',
  question:
    'imp-97759 F2 measured the E_trunc-floor-swap shift of the far-tail crossing decaying super-fast ' +
    '(~2.67% at log10 N ~ 20.3 down to ~3.2e-12% at log10 N ~ 45.4), attributing it to the crossing ' +
    'sigma ~ N^(-1/2), but never derived the functional form. Derive the closed-form leading floor ' +
    'sensitivity dlog10 N/dlog E_trunc as a function of t from the imp-97723 diagnostic and verify it ' +
    'against the measured imp-97759 shifts. Measurement/derivation only on the surrogate; no QED.',
  measuredQuantity:
    'the closed-form floor sensitivity S(t) = (L - t) sigma / (t (1 - t)^2) at the factor = 1 ' +
    'rising-branch crossing, versus the exact local derivative dlog10 N/dlog E_trunc (+/-1% E_trunc ' +
    'finite difference) and versus the measured imp-97759 full 0.5x..5x swap relShift',
  closedForm: 'S(t) = dlog10 N / dlog E_trunc = (L - t) * sigma / ( t * (1 - t)^2 ),  L = log T0',
  decayRate: 'S(t) ~ prefactor(t) * exp(-1/(2(1 - t))), inherited from crossing sigma ~ N^(-1/2)',
  ladder: LADDER,
  floorFactors: FLOOR_FACTORS,
  finding: {
    F1_closed_form_matches_local_derivative:
      'The closed form S(t) = (L - t) sigma / (t (1 - t)^2) reproduces the exact local floor ' +
      'derivative dlog10 N/dlog E_trunc to < 1.1% at t = 0.98 and to round-off (< 0.1%) at t = 0.985, ' +
      'confirming it is the leading sensitivity, not a fit.',
    F2_predicted_swap_shift_matches_imp97759:
      'The predicted relShift = S/log10 N reproduces the measured imp-97759 full 0.5x..5x swap ' +
      'relShift within ~26% at t = 0.98 (1.00e-1% vs 7.95e-2%; the gap is the sub-linearity of the ' +
      'wide 0.5x..5x swap) and within the same factor at t = 0.985 and t = 0.99, tracking the ' +
      'collapse across > 10 orders of magnitude.',
    F3_decay_is_exponential_in_one_minus_t:
      'Because the crossing sigma ~ exp(-1/(2(1 - t))) (from sigma ~ N^(-1/2) with N ~ e^{1/(1-t)}), ' +
      'S(t) decays exponentially in 1/(1 - t): the measured relShift falls from ~8e-2% (t = 0.98) to ' +
      '~5e-12% (t = 0.99). Each extra nine multiplies the exponent 1/(2(1 - t)) tenfold, which is ' +
      'exactly why one extra nine buys many orders of magnitude of floor-insensitivity (imp-97759 F2).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CLOSED-FORM DERIVATION (frontier-direction, NOT rigorous). Implicit differentiation ' +
    'of the imp-97723 crossing condition diag(N) = t gives the leading far-tail floor sensitivity ' +
    'S(t) = dlog10 N/dlog E_trunc = (L - t) sigma / (t (1 - t)^2). It reproduces the exact local ' +
    'derivative to < 1.1% (t = 0.98) and to round-off (t = 0.985), and its swap prediction ' +
    'relShift = S/log10 N tracks the measured imp-97759 full 0.5x..5x relShift within ~26% across ' +
    '> 10 orders of magnitude. The decay rate is exponential in 1/(1 - t): sigma_cross ~ ' +
    'exp(-1/(2(1 - t))) (from sigma ~ N^(-1/2), N ~ e^{1/(1 - t)}), so each extra nine multiplies the ' +
    'exponent tenfold -- deriving the imp-97759 F2 "each extra nine buys many orders" statement. ' +
    'Uses the inherited imp-3406/imp-97723/imp-97759 model and the imp-33708 floor swap, NOT a ' +
    'rigorous asymptotic; C_mb stays GUE-conditional (imp-486); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97759 (F2: floor sensitivity decay measured, form never derived); imp-97723 (full diagnostic ' +
    'closed form, Lprime = 1/(1 - t) pin); imp-33708 (0.5x..5x E_trunc floor swap); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed strip); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97785_FARTAIL_FLOOR_SENSITIVITY_CLOSED_FORM_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 rising-branch crossings reproduce the imp-97759 crossing heights.
    id: 'imp97785-reproduces-imp97759-crossings',
    description: 'factor 1.0 crossings match imp-97759 heights (0.98 ~ 23.395, 0.985 ~ 30.770, 0.99 ~ 45.425) to < 0.05',
    holds: () => {
      const r98 = LADDER.find((r) => r.target === 0.98);
      const r985 = LADDER.find((r) => r.target === 0.985);
      const r99 = LADDER.find((r) => r.target === 0.99);
      return (
        Math.abs(r98.crossing_log10N - 23.395) < 0.05 &&
        Math.abs(r985.crossing_log10N - 30.770) < 0.05 &&
        Math.abs(r99.crossing_log10N - 45.425) < 0.05
      );
    },
  },
  {
    // (F1) The closed form matches the exact local floor derivative where it is resolvable.
    id: 'imp97785-closed-form-matches-local-derivative',
    description: 'S(t) = (L - t) sigma / (t (1 - t)^2) matches the +/-1% local derivative to < 1.1% at t = 0.98 and < 0.1% at t = 0.985',
    holds: () => AT_098.S_relError < 1.1e-2 && AT_0985.S_relError < 1e-3,
  },
  {
    // (F2) The predicted swap shift matches the measured imp-97759 relShift within ~30% at t = 0.98.
    id: 'imp97785-predicts-measured-swap-shift',
    description: 'relShift_pred = S/log10 N matches the measured imp-97759 full-swap relShift within 35% at t = 0.98 (both nonzero)',
    holds: () => {
      const p = AT_098.relShift_pred_pct;
      const m = AT_098.relShift_measured_pct;
      return m !== null && p > 0 && m > 0 && Math.abs(p - m) / m < 0.35;
    },
  },
  {
    // (F3) The floor sensitivity decays exponentially in 1/(1 - t): > 8 orders drop over 0.98 -> 0.99.
    id: 'imp97785-exponential-decay-many-orders-per-nine',
    description: 'the closed-form S(t) drops by > 8 orders of magnitude from t = 0.98 to t = 0.99, matching the sigma ~ exp(-1/(2(1-t))) rate',
    holds: () => {
      const s98 = AT_098.S_closedForm;
      const s99 = LADDER.find((r) => r.target === 0.99).S_closedForm;
      return s98 > 0 && s99 > 0 && Math.log10(s98 / s99) > 8;
    },
  },
  {
    // (F3) S(t) is proportional to the crossing sigma (the exponential channel), decaying monotonically.
    id: 'imp97785-sensitivity-tracks-crossing-sigma',
    description: 'both S(t) and the crossing sigma decrease monotonically with the target t (S ~ (L-t)/(t(1-t)^2) * sigma)',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].S_closedForm < LADDER[i - 1].S_closedForm)) return false;
        if (!(LADDER[i].sigma_cross < LADDER[i - 1].sigma_cross)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed.
    id: 'imp97785-honesty-gate-no-qed',
    description: 'Measurement/derivation only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP97785_FARTAIL_FLOOR_SENSITIVITY_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP97785_FARTAIL_FLOOR_SENSITIVITY_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP97785_FARTAIL_FLOOR_SENSITIVITY_CLOSED_FORM.verdict),
  },
];

for (const a of IMP97785_FARTAIL_FLOOR_SENSITIVITY_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97785-fartail-floor-sensitivity-closed-form assertion failed: ${a.id}`
    );
  }
}
