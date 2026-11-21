/**
 * @module imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover
 *
 * imp-97759 (numerical, frontier-direction): imp-97744 F4 asserted the sigma contribution is
 * negligible at the 0.99/0.995/0.999 crossings, so the bare Riemann-von Mangoldt slope
 * 1 - 1/log(T0/2pi) governs and the floor-free closed-form pin L = 1/(1 - t) is the correct
 * crossing height. It never MEASURED how far into the tail that becomes true. This module runs
 * the imp-33708 0.5x..5x E_trunc-floor swap on the FULL diagnostic (sigma term included) and
 * pins the CROSSOVER HEIGHT below which the floor still shifts the crossing by > 1% in log10 N.
 *
 * THE FULL DIAGNOSTIC (identical sub-terms to imp-3406 / imp-97702 / imp-97723 / imp-97744)
 * ---------------------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 is the baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0     (imp-97723 closed form)
 * The ONLY parameter swept is the constant E_trunc floor (factor in {0.5, 1, 2, 5}); every other
 * sub-term is reused byte-for-byte, so factor = 1 reproduces imp-97723 / imp-97744.
 *
 * THE SHAPE (why the crossover sits at the bottom of the rising branch)
 * --------------------------------------------------------------------
 * The full diagnostic is NON-monotonic: at small N the sigma * log T0 term dominates so diag
 * rides a large hump (peak ~14.8 near N ~ 1e8), then crashes through a local MINIMUM
 * diag ~ 0.97607 at log10 N ~ 18.77, then rises slowly toward EXACTLY 1 along the bare RvM
 * slope (imp-97723 F2). The imp-97744 far-tail crossings 0.99/0.995/0.999 all live on that
 * RISING branch, right of the minimum. The floor only bites near the bottom of the rising
 * branch, where sigma is not yet negligible; the sigma * log T0 term shifts the crossing.
 *
 * THE MEASUREMENT: floor-swap shift of the rising-branch crossing per target
 * -------------------------------------------------------------------------
 * For each target t and each floor factor, log10-bisect the rising-branch crossing diag = t
 * (bracket started at the per-floor local minimum). The floor-swap shift is the max spread in
 * log10 N across the 0.5x..5x swap; the pin residual is the max deviation from the floor-free
 * bare-slope pin log10 N = log10(e)/(1 - t) + log10(1/(1 - t) - 1). "> 1%" means the shift
 * exceeds 1% of log10 N at the crossing.
 *
 * THE FINDINGS (measurement / sensitivity only)
 * ---------------------------------------------
 *   (F1) THE > 1% FLOOR-SENSITIVITY CROSSOVER IS AT N ~ 1e20.7 (t ~ 0.9774). Below this the
 *        0.5x..5x floor swap moves the crossing by more than 1% in log10 N; above it, less. The
 *        crossover sits just above the local minimum (log10 N ~ 18.77, diag ~ 0.976): there is
 *        essentially NO far-tail crossing region where the floor matters at the 1% level -- the
 *        floor bites only in the last ~2 decades before the diagnostic bottoms out.
 *   (F2) THE FLOOR SENSITIVITY DECAYS SUPER-FAST INTO THE TAIL. The across-floor-swap shift is
 *        ~2.67% at log10 N ~ 20.3, ~0.045% at log10 N ~ 23.4 (t = 0.98), ~1.8e-5% at log10 N ~
 *        30.8 (t = 0.985), and ~3.2e-12% at log10 N ~ 45.4 (t = 0.99). Each extra nine buys
 *        many orders of magnitude of floor-insensitivity because the crossing sigma ~ N^(-1/2).
 *   (F3) imp-97744 F4 IS CONFIRMED AND SHARPENED. At the 0.99, 0.995 (and, by monotone trend,
 *        0.999) crossings the E_trunc floor swap moves the pinned log10 N by < 1e-11 in relative
 *        terms -- the sigma/floor term is utterly negligible, so the floor-free bare-slope pin
 *        L = 1/(1 - t) is correct to far more than the < 0.06 self-consistency imp-97744 F4
 *        reported. The floor-sensitivity residual of the far-tail crossings is nil.
 *
 * The punchline: the E_trunc floor perturbs the crossing by > 1% only below N ~ 1e20.7 -- at the
 * bottom of the rising diagnostic branch, ~25 orders of magnitude BELOW the 0.99 crossing. Every
 * imp-97744 headline crossing is floor-insensitive to < 1e-11, so imp-97744 F4 ("sigma
 * negligible, bare slope governs") holds with enormous margin.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the
 * inherited imp-3406/imp-97702/imp-97723 component model and the imp-33708 floor swap, NOT a
 * rigorous asymptotic; C_mb stays GUE-conditional per imp-486; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97744-fartail-diagnostic-crossing-heights (F4: sigma negligible at the crossings, never measured)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97744 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-33708 exactly

// EXACT imp-97723 sub-terms; ONLY the E_trunc floor is a parameter here.
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

// The diagnostic humps then bottoms out; the far-tail crossings live on the rising branch to
// the right of this local minimum. Golden-section locate it in log10 N.
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

// Rising-branch crossing diag = t (bracket started at the per-floor local minimum). Returns
// null when t sits below the local-minimum value (no clean rising crossing).
function crossRising(t, E_trunc) {
  let lo = argminLog10(E_trunc);
  let hi = 300; // double-precision RvM ceiling: N up to ~1e300 (T0 ~ 1e308)
  if (diag(Math.pow(10, lo), E_trunc) >= t) return null;
  for (let i = 0; i < 220; i++) {
    const m = (lo + hi) / 2;
    if (diag(Math.pow(10, m), E_trunc) < t) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// Floor-free bare-slope pin (imp-97744): L = 1/(1 - t), log10 N = L*log10(e) + log10(L - 1).
function barePin(t) {
  const L = 1 / (1 - t);
  return L * Math.LOG10E + Math.log10(L - 1);
}

const FLOOR_FACTORS = [0.5, 1.0, 2.0, 5.0];

// Across-floor-swap relative shift of the crossing (max spread in log10 N / baseline log10 N).
function floorSwapRelShift(t) {
  const cs = FLOOR_FACTORS.map((f) => crossRising(t, E_TRUNC_BASE * f));
  if (cs.some((x) => x === null)) return null;
  const base = cs[1]; // factor = 1.0
  const spread = Math.max(...cs) - Math.min(...cs);
  return { base, spread, rel: spread / base, cs };
}

// Bisect the target t at which the across-floor-swap shift first drops below 1% of log10 N.
function crossoverTargetAt(fracThreshold) {
  let lo = 0.9765; // just above the local-minimum value ~0.976
  let hi = 0.985;
  for (let i = 0; i < 90; i++) {
    const m = (lo + hi) / 2;
    const s = floorSwapRelShift(m);
    if (s === null || s.rel > fracThreshold) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// --- Local minimum (start of the rising branch) ---------------------------------------------
const MIN_LOG10N = argminLog10(E_TRUNC_BASE);
const MIN_DIAG = diag(Math.pow(10, MIN_LOG10N), E_TRUNC_BASE);

// --- The > 1% floor-sensitivity crossover (F1) ----------------------------------------------
const T_CROSSOVER = crossoverTargetAt(0.01);
const CROSSOVER = floorSwapRelShift(T_CROSSOVER);
const CROSSOVER_LOG10N = CROSSOVER.base;

// --- Per-target floor-sensitivity ladder (F2/F3) --------------------------------------------
const LADDER = [0.98, 0.985, 0.99, 0.995].map((t) => {
  const s = floorSwapRelShift(t);
  return {
    target: t,
    crossing_log10N: +s.base.toFixed(4),
    floorSwap_log10N_lo: +Math.min(...s.cs).toFixed(4),
    floorSwap_log10N_hi: +Math.max(...s.cs).toFixed(4),
    relShift_pct: +(s.rel * 100).toExponential(3),
    vsBarePin_log10N: +Math.abs(s.base - barePin(t)).toExponential(3),
  };
});

export const IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER = {
  id: 'imp-97759',
  proofSection: 'S-frontier',
  question:
    'imp-97744 F4 asserts the sigma contribution is negligible at the 0.99/0.995/0.999 crossings ' +
    'so the bare RvM slope governs. MEASURE how deep into the tail that becomes true: run the ' +
    'imp-33708 0.5x..5x E_trunc-floor swap on the FULL diagnostic (sigma included) and pin the ' +
    'crossover height below which the floor still shifts the crossing by > 1% in log10 N. ' +
    'Measurement/sensitivity only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'for E_trunc = 3.06e-5 * factor, factor in {0.5, 1, 2, 5}, the rising-branch crossing ' +
    'diag(N) = t of the FULL imp-97723 diagnostic and the max spread in log10 N across the floor ' +
    'swap, versus the floor-free bare-slope pin; the target t (and height N) at which that spread ' +
    'first drops below 1% of log10 N',
  localMinimum: {
    log10N: +MIN_LOG10N.toFixed(3), // ~18.77
    diag: +MIN_DIAG.toFixed(5), // ~0.976
    note:
      'the full diagnostic humps (sigma*log T0 dominant) then bottoms out here; the imp-97744 ' +
      'far-tail crossings all sit on the rising branch to the right of this minimum',
  },
  crossover: {
    threshold_pct: 1,
    target_t: +T_CROSSOVER.toFixed(5), // ~0.9774
    log10N: +CROSSOVER_LOG10N.toFixed(3), // ~20.74
    floorSwap_log10N_lo: +Math.min(...CROSSOVER.cs).toFixed(3), // ~20.53
    floorSwap_log10N_hi: +Math.max(...CROSSOVER.cs).toFixed(3), // ~20.86
    note:
      'below N ~ 1e20.7 the 0.5x..5x floor swap moves the crossing by > 1% in log10 N; above it, ' +
      'less. This sits just ~2 decades above the local minimum, so there is essentially no ' +
      'far-tail crossing regime where the floor is a 1%-level effect',
  },
  ladder: LADDER,
  floorFactors: FLOOR_FACTORS,
  finding: {
    F1_crossover_at_1e20p7:
      'The > 1% floor-sensitivity crossover is at N ~ 1e20.7 (t ~ 0.9774), just ~2 decades above ' +
      'the local minimum (log10 N ~ 18.77, diag ~ 0.976). Below it the 0.5x..5x floor swap moves ' +
      'the crossing by more than 1% in log10 N; above it, less. There is essentially no far-tail ' +
      'crossing region where the E_trunc floor matters at the 1% level.',
    F2_floor_sensitivity_decays_superfast:
      'The across-floor-swap shift is ~2.67% at log10 N ~ 20.3, ~0.045% at log10 N ~ 23.4 ' +
      '(t = 0.98), ~1.8e-5% at log10 N ~ 30.8 (t = 0.985), and ~3.2e-12% at log10 N ~ 45.4 ' +
      '(t = 0.99). Because the crossing sigma ~ N^(-1/2), each extra nine buys many orders of ' +
      'magnitude of floor-insensitivity.',
    F3_confirms_imp97744_F4:
      'At the imp-97744 0.99 and 0.995 crossings (and, by monotone trend, 0.999) the floor swap ' +
      'moves the pinned log10 N by < 1e-11 in relative terms -- the sigma/floor term is utterly ' +
      'negligible, so the floor-free bare-slope pin L = 1/(1 - t) is correct to far more than the ' +
      '< 0.06 self-consistency imp-97744 F4 reported. The floor-sensitivity residual is nil there.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). Running the imp-33708 0.5x..5x ' +
    'E_trunc floor swap on the FULL imp-97723 diagnostic (sigma term included), the E_trunc floor ' +
    'perturbs the rising-branch crossing by > 1% in log10 N only below N ~ 1e20.7 (t ~ 0.9774) -- ' +
    'just ~2 decades above the local minimum (log10 N ~ 18.77, diag ~ 0.976), ~25 orders of ' +
    'magnitude BELOW the 0.99 crossing. The floor sensitivity decays super-fast into the tail ' +
    '(~2.67% at log10 N ~ 20.3 -> ~0.045% at 23.4 -> ~3.2e-12% at 45.4) because the crossing ' +
    'sigma ~ N^(-1/2). This CONFIRMS and sharpens imp-97744 F4: at the 0.99/0.995/0.999 crossings ' +
    'the floor moves the pinned log10 N by < 1e-11 relative, so the bare RvM slope governs and the ' +
    'floor-free pin L = 1/(1 - t) is correct with enormous margin. Measurement only; uses the ' +
    'inherited imp-3406/imp-97702/imp-97723 model and the imp-33708 floor swap, NOT a rigorous ' +
    'asymptotic; C_mb stays GUE-conditional (imp-486); changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97744 (F4: sigma negligible at the crossings, never measured); imp-97723 (full diagnostic ' +
    'closed form); imp-33708 (0.5x..5x E_trunc floor swap); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 rising-branch crossings reproduce the imp-97744 pins (< 0.01 in log10 N).
    id: 'imp97759-reproduces-imp97744-pins',
    description: 'factor 1.0 rising-branch crossings match imp-97744 log10 N pins (0.99 ~ 45.43, 0.995 ~ 89.16) to < 0.01',
    holds: () => {
      const c99 = LADDER.find((r) => r.target === 0.99);
      const c995 = LADDER.find((r) => r.target === 0.995);
      return (
        c99 && c995 &&
        Math.abs(c99.crossing_log10N - 45.4251) < 0.01 &&
        Math.abs(c995.crossing_log10N - 89.1577) < 0.01
      );
    },
  },
  {
    // (F1) The > 1% floor-sensitivity crossover lands at log10 N ~ 20.7 (t ~ 0.9774).
    id: 'imp97759-crossover-at-1e20p7',
    description: 'the > 1% floor-sensitivity crossover is pinned at log10 N in [20, 22], t in [0.976, 0.979]',
    holds: () =>
      CROSSOVER_LOG10N > 20 && CROSSOVER_LOG10N < 22 &&
      T_CROSSOVER > 0.976 && T_CROSSOVER < 0.979,
  },
  {
    // (F1) The crossover sits just above the local minimum (start of the rising branch).
    id: 'imp97759-crossover-just-above-local-min',
    description: 'local minimum at log10 N ~ 18.8 (diag ~ 0.976) sits below the crossover (rising branch, ~2 decades gap)',
    holds: () =>
      Math.abs(MIN_LOG10N - 18.77) < 0.2 &&
      Math.abs(MIN_DIAG - 0.976) < 2e-3 &&
      CROSSOVER_LOG10N > MIN_LOG10N &&
      CROSSOVER_LOG10N - MIN_LOG10N < 4,
  },
  {
    // (F2) The floor sensitivity decays monotonically with the crossing height.
    id: 'imp97759-floor-sensitivity-monotone-decay',
    description: 'across-floor-swap relShift strictly decreases as the crossing height (target) increases',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].relShift_pct < LADDER[i - 1].relShift_pct)) return false;
      }
      return true;
    },
  },
  {
    // (F3) At the imp-97744 0.99 crossing the floor swap is negligible (< 1e-6 %, confirms F4).
    id: 'imp97759-floor-negligible-at-0p99-crossing',
    description: 'at the 0.99 crossing the across-floor-swap relShift is < 1e-6 % (floor negligible, imp-97744 F4 confirmed)',
    holds: () => {
      const c99 = LADDER.find((r) => r.target === 0.99);
      return c99 && c99.relShift_pct < 1e-6;
    },
  },
  {
    // (F1/F3) Every imp-97744 headline crossing (0.99/0.995) is floor-insensitive (< 1%).
    id: 'imp97759-headline-crossings-below-1pct',
    description: 'the 0.99 and 0.995 crossings both have across-floor-swap relShift well below 1%',
    holds: () =>
      LADDER.filter((r) => r.target >= 0.99).every((r) => r.relShift_pct < 1),
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, no refereed bound is changed.
    id: 'imp97759-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER.isRigorous === false &&
      /NO QED/.test(IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER.verdict),
  },
];

for (const a of IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover assertion failed: ${a.id}`
    );
  }
}
