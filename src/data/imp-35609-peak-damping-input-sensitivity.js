/**
 * @module imp-35609-peak-damping-input-sensitivity
 *
 * imp-35609 (numerical, frontier-direction): imp-35574 measured the imp-35458
 * height-map DAMPING factor at the interior sigma-PEAK LOCATION and found ~0.553
 * (< 1, mild AMPLIFICATION rather than the crossover ~18x log-damping). That
 * measurement used TWO fixed inputs it never varied:
 *   (i)  the peak-locator bisection bracket [1e4, 1e7] in log N, and
 *   (ii) the truncation floor E_trunc = 3.06e-5 (imp-2631/imp-447 fixed-strip).
 * This module measures whether the AMPLIFICATION-not-damping verdict (damping
 * factor < 1) is STABLE to those two inputs. It re-runs the imp-35574 damping
 * computation VERBATIM (same double-surrogate sigma, same RvM inverse and closed
 * surrogate maps, same damping factor definition) under three bracket widenings
 * ([1e3,1e8], [1e2,1e9], [1,1e10]) and under the E_trunc = 3.6e-5 variant.
 *
 * THE MEASUREMENT (imp-35574 computation, two inputs perturbed)
 * ------------------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll), with (imp-35017/imp-3406)
 *   E_coll = C_C sqrt(log T0 / N),  C_F = (log(T0/2pi) + 1)/(2pi),
 *   E_flow = C_F (log T0 / T0) Gronwall.
 * Peak located by bisecting the sign of dg_sigma/dN in log N over the bracket.
 * Damping factor = (1 - T0_sur/T0_rvm at the fixed peak height) / |rel. shift|.
 *
 *   INPUT (i) -- bracket widening at E_trunc = 3.06e-5:
 *     bracket        N_max (RvM)    N_max (sur)    rel. shift   damping factor
 *     [1e4, 1e7]     9.218633e5     1.327368e6     +43.987%     0.5530
 *     [1e3, 1e8]     9.218633e5     1.327368e6     +43.987%     0.5530
 *     [1e2, 1e9]     9.218633e5     1.327368e6     +43.987%     0.5530
 *     [1,   1e10]    9.218633e5     1.327368e6     +43.987%     0.5530
 *   => the damping factor is INVARIANT to the bracket to all reported digits:
 *      the interior peak is a genuine stationary point, so once the bracket
 *      contains it the bisection converges to the same N_max regardless of width.
 *      The imp-35574 bracket [1e4, 1e7] is NOT a tuned choice.
 *
 *   INPUT (ii) -- E_trunc swap 3.06e-5 -> 3.6e-5 (bracket [1e4, 1e7]):
 *     E_trunc        N_max (RvM)    N_max (sur)    rel. shift   damping factor
 *     3.06e-5        9.218633e5     1.327368e6     +43.987%     0.5530
 *     3.60e-5        7.368509e5     1.068197e6     +44.968%     0.5467
 *   => a larger floor pulls the peak EARLIER (N_max 9.22e5 -> 7.37e5, both maps),
 *      but the damping factor moves only 0.5530 -> 0.5467 (a ~1.1% relative,
 *      -0.0063 absolute change) and the relative location shift barely rises
 *      (+43.99% -> +44.97%). The AMPLIFICATION verdict (factor < 1) is untouched.
 *
 * THE FINDING
 * -----------
 * The imp-35574 AMPLIFICATION-not-damping verdict (damping factor < 1, ~0.55) is
 * INPUT-STABLE. It is exactly invariant to the peak-locator bracket (the bracket
 * only has to contain the interior stationary point, and [1e4,1e7] does) and it
 * moves by only ~1% relative under the E_trunc = 3.6e-5 variant, staying firmly
 * below 1 (0.5467 vs 0.5530). Neither fixed input is a lever that could flip the
 * peak LOCATION into the crossover-style log-damping regime; the ~32x gap between
 * the crossover damping (~18x) and the peak-location damping (~0.55) is robust to
 * both. This corroborates the imp-35574/imp-35594 structural mechanism: the peak
 * location balances E_coll against E_flow with no log-proportional insulation, so
 * its near one-for-one height response does not depend on the floor value or the
 * search window.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; changes no bound.
 * Surrogate-vs-true fidelity (imp-35337a) stays OPEN; C_C = (1/8)sqrt(3 pi)
 * (imp-2642/imp-2643) and the baseline E_trunc = 3.06e-5 (imp-2631/imp-447)
 * UNTOUCHED (the 3.6e-5 value is a sensitivity probe, not a re-anchoring);
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per
 * imp-3463; no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35574-peak-location-height-map-damping (the ~0.55 damping factor probed here)
 * @see imp-35594-peak-crossover-mechanism-derivation (the structural mechanism corroborated)
 * @see imp-35458-crossover-height-map-sensitivity (the ~18x crossover damping reference)
 * @see imp-35337 (the interior-peak locator whose bracket is varied here)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // baseline N-independent fixed-strip route (imp-2631/imp-3406)
const E_TRUNC_VARIANT = 3.6e-5; // the imp-35609 sensitivity probe (NOT a re-anchoring)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-35017/imp-35574 exactly

// Height map A: the EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
// Inlined verbatim from imp-35574 (pure Math, no import, no zeros bundle).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI; // d/dT of the RvM count = log(T/2pi)/(2pi)
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}
// Height map B: the imp-35413 closed surrogate T0 = 2 pi N / log N.
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// The imp-35017/imp-3406 double-surrogate sigma(N), parameterised by map AND E_trunc.
function makeSigma(heightForN, eTrunc) {
  return function sigma(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL;
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
    return E_coll / (eTrunc + E_flow + E_coll);
  };
}

// The imp-35337 peak locator, with the bracket [aN, bN] exposed as an input.
function locatePeak(sigma, aN, bN) {
  const dSigmadN = (N) => {
    const h = N * 1e-6;
    return (sigma(N + h) - sigma(N - h)) / (2 * h);
  };
  let a = Math.log(aN);
  let b = Math.log(bN);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  const Nmax = Math.exp((a + b) / 2);
  return { Nmax, sigmaMax: sigma(Nmax) };
}

// Form the imp-35574 damping factor for a given (E_trunc, bracket).
function dampingFor(eTrunc, aN, bN) {
  const pRvm = locatePeak(makeSigma(effectiveHeightForN, eTrunc), aN, bN);
  const pSur = locatePeak(makeSigma(surrogateHeightForN, eTrunc), aN, bN);
  const relShift = (pSur.Nmax - pRvm.Nmax) / pRvm.Nmax;
  const T0rvm = effectiveHeightForN(pRvm.Nmax);
  const T0sur = surrogateHeightForN(pRvm.Nmax);
  const rawRatio = T0sur / T0rvm;
  const dampingFactor = (1 - rawRatio) / Math.abs(relShift);
  return {
    NmaxRvm: pRvm.Nmax,
    NmaxSur: pSur.Nmax,
    relShift,
    rawRatio,
    dampingFactor,
  };
}

// Input (i): bracket widening at the baseline E_trunc.
const BRACKETS = [
  [1e4, 1e7], // imp-35574 baseline
  [1e3, 1e8],
  [1e2, 1e9],
  [1, 1e10],
];
const BRACKET_SWEEP = BRACKETS.map(([a, b]) => {
  const r = dampingFor(E_TRUNC_PT, a, b);
  return {
    bracket: [a, b],
    N_max_rvm: +r.NmaxRvm.toExponential(6),
    N_max_surrogate: +r.NmaxSur.toExponential(6),
    relative_shift_pct: +(r.relShift * 100).toFixed(3),
    damping_factor: +r.dampingFactor.toFixed(4),
    amplified: r.dampingFactor < 1,
  };
});

// Input (ii): E_trunc swap at the baseline bracket.
const BASE = dampingFor(E_TRUNC_PT, 1e4, 1e7);
const VARIANT = dampingFor(E_TRUNC_VARIANT, 1e4, 1e7);

// Spread of the damping factor across ALL perturbations (bracket + E_trunc).
const ALL_DAMPINGS = [
  ...BRACKET_SWEEP.map((r) => r.damping_factor),
  +VARIANT.dampingFactor.toFixed(4),
];
const DAMPING_MIN = Math.min(...ALL_DAMPINGS);
const DAMPING_MAX = Math.max(...ALL_DAMPINGS);
const DAMPING_SPREAD_ABS = DAMPING_MAX - DAMPING_MIN;
const ETRUNC_REL_MOVE = Math.abs(VARIANT.dampingFactor - BASE.dampingFactor) / BASE.dampingFactor;

export const IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY = {
  id: 'imp-35609',
  proofSection: 'S-frontier',
  question:
    'imp-35574 measured the peak-LOCATION damping factor (~0.553, < 1, AMPLIFIED) using a ' +
    'FIXED peak-locator bracket [1e4, 1e7] and a FIXED E_trunc = 3.06e-5. Is the ' +
    'AMPLIFICATION-not-damping verdict (damping factor < 1) stable to those two inputs?',
  method:
    'Re-run the imp-35574 damping computation VERBATIM (same double-surrogate sigma, RvM ' +
    'inverse vs closed surrogate maps, same damping factor definition) under (i) three ' +
    'bracket widenings [1e3,1e8], [1e2,1e9], [1,1e10] at the baseline E_trunc, and (ii) the ' +
    'E_trunc = 3.6e-5 variant at the baseline bracket [1e4,1e7]; report the damping factor ' +
    'spread and whether it stays below 1.',
  bracketSweep: BRACKET_SWEEP,
  eTruncSwap: {
    baseline: {
      E_trunc: E_TRUNC_PT,
      N_max_rvm: +BASE.NmaxRvm.toExponential(6), // 9.218633e5
      N_max_surrogate: +BASE.NmaxSur.toExponential(6), // 1.327368e6
      relative_shift_pct: +(BASE.relShift * 100).toFixed(3), // +43.987
      damping_factor: +BASE.dampingFactor.toFixed(4), // 0.5530
    },
    variant: {
      E_trunc: E_TRUNC_VARIANT,
      N_max_rvm: +VARIANT.NmaxRvm.toExponential(6), // 7.368509e5
      N_max_surrogate: +VARIANT.NmaxSur.toExponential(6), // 1.068197e6
      relative_shift_pct: +(VARIANT.relShift * 100).toFixed(3), // +44.968
      damping_factor: +VARIANT.dampingFactor.toFixed(4), // 0.5467
    },
    etrunc_relative_move: +ETRUNC_REL_MOVE.toFixed(5), // ~0.0114 (1.1%)
  },
  stability: {
    damping_min: +DAMPING_MIN.toFixed(4), // 0.5467
    damping_max: +DAMPING_MAX.toFixed(4), // 0.5530
    damping_spread_abs: +DAMPING_SPREAD_ABS.toFixed(4), // 0.0063
    bracket_invariant: BRACKET_SWEEP.every((r) => r.damping_factor === BRACKET_SWEEP[0].damping_factor),
    all_amplified: ALL_DAMPINGS.every((d) => d < 1), // true -- verdict input-stable
  },
  finding: {
    F1_bracket_invariant:
      'The damping factor is INVARIANT to the peak-locator bracket to all reported digits ' +
      '(0.5530 across [1e4,1e7] through [1,1e10]): the interior peak is a genuine stationary ' +
      'point, so any bracket containing it converges to the same N_max. [1e4,1e7] is not tuned.',
    F2_etrunc_barely_moves:
      'The E_trunc = 3.6e-5 variant pulls the peak earlier (N_max 9.22e5 -> 7.37e5) but moves ' +
      'the damping factor only 0.5530 -> 0.5467 (~1.1% relative, -0.0063 absolute), keeping it ' +
      'firmly below 1. The relative location shift barely rises (+43.99% -> +44.97%).',
    F3_verdict_input_stable:
      'The imp-35574 AMPLIFICATION-not-damping verdict (damping factor < 1, ~0.55) is ' +
      'INPUT-STABLE: neither the locator bracket nor the E_trunc value is a lever that could ' +
      'flip the peak LOCATION into the crossover-style log-damping regime.',
  },
  isRigorous: false,
  honestStatus:
    'Re-running the imp-35574 peak-location damping computation under bracket widenings and ' +
    'the E_trunc = 3.6e-5 variant: the damping factor is exactly bracket-invariant (0.5530 from ' +
    '[1e4,1e7] to [1,1e10]) and moves only ~1.1% (0.5530 -> 0.5467) under the larger floor, ' +
    'staying below 1 in every case. The AMPLIFICATION-not-damping verdict is input-stable. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate; surrogate-vs-true fidelity ' +
    '(imp-35337a) UNTOUCHED; the 3.6e-5 value is a sensitivity probe, not a re-anchoring; ' +
    'changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Probing the two fixed inputs of the ' +
    'imp-35574 peak-location damping factor (~0.553): (i) widening the peak-locator bracket from ' +
    '[1e4,1e7] to [1e3,1e8], [1e2,1e9] and [1,1e10] leaves the damping factor EXACTLY unchanged ' +
    '(0.5530 to all reported digits) because the interior peak is a genuine stationary point; ' +
    '(ii) swapping E_trunc 3.06e-5 -> 3.6e-5 pulls the peak earlier (N_max 9.22e5 -> 7.37e5) but ' +
    'moves the damping factor only ~1.1% (0.5530 -> 0.5467), keeping it firmly below 1. The ' +
    'AMPLIFICATION-not-damping verdict is therefore INPUT-STABLE: neither input is a lever that ' +
    'could flip the peak LOCATION into the crossover-style log-damping regime, and the ~32x gap ' +
    'to the crossover damping (~18x) is robust. This corroborates the imp-35574/imp-35594 ' +
    'structural mechanism. Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a ' +
    'rigorous asymptotic; surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; C_C ansatz ' +
    '(imp-2642/imp-2643) and the baseline E_trunc = 3.06e-5 (imp-2631/imp-447) UNTOUCHED; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; ' +
    'changes no bound; no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35574 (peak-location damping factor ~0.553, probed here); ' +
    'imp-35594 (structural mechanism corroborated); imp-35458 (crossover damping ~18x reference); ' +
    'imp-35337 (interior-peak locator whose bracket is varied); imp-486 (C_mb GUE-conditional, ' +
    'UNTOUCHED); imp-2631 (E_trunc = 3.06e-5 baseline, UNTOUCHED).',
};

export const IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY_ASSERTIONS = [
  {
    // The baseline (E_trunc 3.06e-5, bracket [1e4,1e7]) reproduces the imp-35574 damping ~0.553.
    id: 'imp35609-reproduces-imp35574-baseline',
    description: 'the baseline reproduces the imp-35574 peak damping factor ~0.553',
    holds: () => Math.abs(BASE.dampingFactor - 0.553) < 5e-3,
  },
  {
    // Input (i): the damping factor is exactly invariant across all four brackets.
    id: 'imp35609-bracket-invariant',
    description: 'the damping factor is invariant to the peak-locator bracket to reported digits',
    holds: () =>
      IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY.stability.bracket_invariant === true &&
      BRACKET_SWEEP.length === 4,
  },
  {
    // Input (ii): the E_trunc variant moves the damping factor by only a few percent.
    id: 'imp35609-etrunc-move-small',
    description: 'the E_trunc = 3.6e-5 variant moves the damping factor by under 3% relative',
    holds: () => ETRUNC_REL_MOVE > 0 && ETRUNC_REL_MOVE < 0.03,
  },
  {
    // KEY: the AMPLIFICATION verdict (factor < 1) is stable to BOTH inputs.
    id: 'imp35609-amplification-input-stable',
    description: 'the damping-factor-<1 (amplification) verdict holds under every bracket and E_trunc probe',
    holds: () =>
      IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY.stability.all_amplified === true &&
      DAMPING_MAX < 1 &&
      DAMPING_SPREAD_ABS < 0.05,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35609-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY.verdict),
  },
];

for (const a of IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35609-peak-damping-input-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP35609_PEAK_DAMPING_INPUT_SENSITIVITY;
