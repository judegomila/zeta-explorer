/**
 * @module imp-35635-peak-damping-a1trap-sensitivity
 *
 * imp-35635 (numerical, frontier-direction): imp-35609 confirmed the imp-35574
 * peak-LOCATION damping factor (~0.553, < 1 AMPLIFIED) is INPUT-STABLE to TWO of
 * its three fixed inputs -- the peak-locator bracket [1e4,1e7] (exactly invariant)
 * and the truncation floor E_trunc = 3.06e-5 (moves only ~1.1% under 3.6e-5). It
 * left the THIRD fixed input untouched: the Gronwall / A1-trap factor
 * g = exp(TC_A1_TRAP), TC_A1_TRAP = 2.37e-4, which multiplies the DIRECT-height
 * term E_flow ~ (log T0 / T0) g. This module measures whether the AMPLIFICATION-
 * not-damping verdict (damping factor < 1) survives an A1-trap perturbation.
 *
 * THE MEASUREMENT (imp-35574/imp-35609 computation, third input perturbed)
 * -----------------------------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll), with (imp-35017/imp-3406)
 *   E_coll = C_C sqrt(log T0 / N),  C_F = (log(T0/2pi) + 1)/(2pi),
 *   E_flow = C_F (log T0 / T0) g,  g = exp(TC_A1_TRAP).
 * Peak located by bisecting the sign of dg_sigma/dN in log N over [1e4,1e7].
 * Damping factor = (1 - T0_sur/T0_rvm at the fixed peak height) / |rel. shift|.
 * The A1-trap factor is swept over three variants plus the trap-off control g = 1
 * (E_trunc and bracket held at their imp-35574 baselines):
 *
 *   A1-trap        g = exp(.)     N_max (RvM)    N_max (sur)    rel. shift   damping factor
 *   2.37e-4 (base) 1.00023703     9.218633e5     1.327368e6     +43.9875%    0.553048
 *   1.50e-4        1.00015001     9.217532e5     1.327214e6     +43.9880%    0.553045
 *   3.00e-4        1.00030005     9.219431e5     1.327479e6     +43.9871%    0.553050
 *   1.00000000 (g=1, no trap)     9.215633e5     1.326949e6     +43.9889%    0.553039
 *   => the damping factor is invariant to the A1-trap to ~5 significant figures:
 *      it ranges over [0.553039, 0.553050], an ABSOLUTE spread of ~1.15e-5, and
 *      even the trap-OFF control g = 1 moves it only ~1.6e-5 RELATIVE from the
 *      baseline -- roughly 700x smaller than the ~1.1% E_trunc move imp-35609
 *      reported for the second input. The AMPLIFICATION verdict (factor < 1) is
 *      untouched in every variant.
 *
 * THE FINDING
 * -----------
 * The imp-35574 AMPLIFICATION-not-damping verdict (damping factor < 1, ~0.553) is
 * stable to ALL THREE of its fixed inputs. The A1-trap factor is the WEAKEST lever
 * of the three: perturbing TC_A1_TRAP from 2.37e-4 to {1.5e-4, 3.0e-4} -- or
 * removing the trap entirely (g = 1) -- moves the damping factor by at most
 * ~1.6e-5 relative, versus the ~1.1% relative for E_trunc and exact invariance for
 * the bracket. The reason is structural: the Gronwall factor multiplies ONLY the
 * direct-height term E_flow ~ (log T0 / T0) g, which near the interior peak is
 * negligible against E_coll and E_trunc (imp-35594 pins E_flow ~ O(1) E_trunc at
 * the peak, and g deviates from 1 by only ~2.4e-4), so a fractional change in g
 * feeds through to sigma -- and hence to the peak balance and the damping factor --
 * suppressed by the tiny E_flow weight. No A1-trap value in this range is a lever
 * that could flip the peak LOCATION into the crossover-style log-damping regime;
 * the ~32x gap to the crossover damping (~18x) is robust to the third input too.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; changes no bound.
 * Surrogate-vs-true fidelity (imp-35337a) stays OPEN; C_C = (1/8)sqrt(3 pi)
 * (imp-2642/imp-2643), the baseline E_trunc = 3.06e-5 (imp-2631/imp-447), and the
 * baseline TC_A1_TRAP = 2.37e-4 UNTOUCHED (the 1.5e-4/3.0e-4/g=1 values are
 * sensitivity probes, not re-anchorings); imp-35337a stays OPEN; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35609-peak-damping-input-sensitivity (the two-input study extended here)
 * @see imp-35574-peak-location-height-map-damping (the ~0.55 damping factor probed)
 * @see imp-35594-peak-crossover-mechanism-derivation (E_flow ~ O(1) E_trunc at the peak)
 * @see imp-35337 (the interior-peak locator)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // baseline N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP_BASE = 2.37e-4; // baseline Gronwall exponent (imp-3406/imp-35017/imp-35574)

// Height map A: the EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
// Inlined verbatim from imp-35609/imp-35574 (pure Math, no import, no zeros bundle).
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

// The imp-35017/imp-3406 double-surrogate sigma(N), parameterised by map AND Gronwall factor g.
function makeSigma(heightForN, gronwall) {
  return function sigma(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * gronwall; // Gronwall / A1-trap factor enters ONLY here
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
    return E_coll / (E_TRUNC_PT + E_flow + E_coll);
  };
}

// The imp-35337 peak locator (bracket [1e4,1e7], the imp-35574/imp-35609 baseline).
function locatePeak(sigma) {
  const dSigmadN = (N) => {
    const h = N * 1e-6;
    return (sigma(N + h) - sigma(N - h)) / (2 * h);
  };
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  const Nmax = Math.exp((a + b) / 2);
  return { Nmax, sigmaMax: sigma(Nmax) };
}

// Form the imp-35574 damping factor for a given Gronwall factor g.
function dampingFor(gronwall) {
  const pRvm = locatePeak(makeSigma(effectiveHeightForN, gronwall));
  const pSur = locatePeak(makeSigma(surrogateHeightForN, gronwall));
  const relShift = (pSur.Nmax - pRvm.Nmax) / pRvm.Nmax;
  const T0rvm = effectiveHeightForN(pRvm.Nmax);
  const T0sur = surrogateHeightForN(pRvm.Nmax);
  const rawRatio = T0sur / T0rvm;
  const dampingFactor = (1 - rawRatio) / Math.abs(relShift);
  return {
    NmaxRvm: pRvm.Nmax,
    NmaxSur: pSur.Nmax,
    relShift,
    dampingFactor,
  };
}

// The A1-trap sweep: baseline, two perturbations, and the trap-off control g = 1.
const A1_VARIANTS = [
  { label: 'baseline', tc_a1_trap: TC_A1_TRAP_BASE, gronwall: Math.exp(TC_A1_TRAP_BASE), baseline: true },
  { label: 'lower', tc_a1_trap: 1.5e-4, gronwall: Math.exp(1.5e-4), baseline: false },
  { label: 'upper', tc_a1_trap: 3.0e-4, gronwall: Math.exp(3.0e-4), baseline: false },
  { label: 'trap-off', tc_a1_trap: 0, gronwall: 1.0, baseline: false },
];

const A1_SWEEP = A1_VARIANTS.map((v) => {
  const r = dampingFor(v.gronwall);
  return {
    label: v.label,
    tc_a1_trap: v.tc_a1_trap,
    gronwall: +v.gronwall.toFixed(8),
    N_max_rvm: +r.NmaxRvm.toExponential(6),
    N_max_surrogate: +r.NmaxSur.toExponential(6),
    relative_shift_pct: +(r.relShift * 100).toFixed(4),
    damping_factor: +r.dampingFactor.toFixed(6),
    amplified: r.dampingFactor < 1,
  };
});

const BASE = A1_SWEEP.find((r) => r.label === 'baseline');
const DAMPINGS = A1_SWEEP.map((r) => r.damping_factor);
const DAMPING_MIN = Math.min(...DAMPINGS);
const DAMPING_MAX = Math.max(...DAMPINGS);
const DAMPING_SPREAD_ABS = DAMPING_MAX - DAMPING_MIN;
const TRAP_OFF = A1_SWEEP.find((r) => r.label === 'trap-off');
const TRAP_OFF_REL_MOVE = Math.abs(TRAP_OFF.damping_factor - BASE.damping_factor) / BASE.damping_factor;

export const IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY = {
  id: 'imp-35635',
  proofSection: 'S-frontier',
  question:
    'imp-35609 confirmed the imp-35574 peak-LOCATION damping factor (~0.553, < 1, AMPLIFIED) is ' +
    'input-stable to the peak-locator bracket and E_trunc but left the THIRD fixed input -- the ' +
    'Gronwall / A1-trap factor g = exp(TC_A1_TRAP), TC_A1_TRAP = 2.37e-4 -- untouched. Does the ' +
    'AMPLIFICATION-not-damping verdict (damping factor < 1) survive an A1-trap perturbation?',
  method:
    'Re-run the imp-35574/imp-35609 damping computation VERBATIM (same double-surrogate sigma, RvM ' +
    'inverse vs closed surrogate maps, same damping factor definition, same bracket [1e4,1e7] and ' +
    'baseline E_trunc = 3.06e-5) while sweeping ONLY the Gronwall factor g = exp(TC_A1_TRAP) over ' +
    'TC_A1_TRAP in {2.37e-4 (baseline), 1.5e-4, 3.0e-4} plus the trap-off control g = 1; report the ' +
    'damping factor spread and whether it stays below 1.',
  a1Sweep: A1_SWEEP,
  stability: {
    damping_min: +DAMPING_MIN.toFixed(6), // 0.553039
    damping_max: +DAMPING_MAX.toFixed(6), // 0.553050
    damping_spread_abs: +DAMPING_SPREAD_ABS.toExponential(3), // ~1.15e-5
    trap_off_relative_move: +TRAP_OFF_REL_MOVE.toExponential(3), // ~1.6e-5
    all_amplified: DAMPINGS.every((d) => d < 1), // true -- verdict A1-trap-stable
  },
  finding: {
    F1_a1_trap_barely_moves:
      'The damping factor is invariant to the A1-trap to ~5 significant figures: it ranges over ' +
      '[0.553039, 0.553050] (absolute spread ~1.15e-5) as TC_A1_TRAP moves over {1.5e-4, 2.37e-4, ' +
      '3.0e-4}, and even the trap-OFF control g = 1 moves it only ~1.6e-5 relative from baseline.',
    F2_weakest_of_three_inputs:
      'The A1-trap is the WEAKEST of the three fixed inputs: its ~1.6e-5 relative pull (trap-off vs ' +
      'baseline) is roughly 700x smaller than the ~1.1% imp-35609 E_trunc move and, like the bracket, ' +
      'never approaches a flip of the amplification verdict (factor < 1).',
    F3_verdict_a1_trap_stable:
      'The imp-35574 AMPLIFICATION-not-damping verdict (damping factor < 1, ~0.553) is A1-trap-stable ' +
      'because g multiplies only E_flow ~ (log T0 / T0) g, which imp-35594 pins to O(1) E_trunc at the ' +
      'peak, so a fractional change in g feeds through suppressed by the tiny E_flow weight.',
  },
  isRigorous: false,
  honestStatus:
    'Re-running the imp-35574/imp-35609 peak-location damping computation under an A1-trap sweep ' +
    '(TC_A1_TRAP in {1.5e-4, 2.37e-4, 3.0e-4} plus g = 1): the damping factor is invariant to ~5 ' +
    'significant figures (range [0.553039, 0.553050], absolute spread ~1.15e-5) and the trap-off ' +
    'control g = 1 moves it only ~1.6e-5 relative, staying below 1 in every case. The AMPLIFICATION- ' +
    'not-damping verdict is stable to all THREE of its fixed inputs, and the A1-trap is the weakest ' +
    'lever. Measurement only on the inherited imp-3220/imp-3406 surrogate; surrogate-vs-true fidelity ' +
    '(imp-35337a) UNTOUCHED; the baseline TC_A1_TRAP = 2.37e-4 stays the anchor and the variants are ' +
    'probes, not re-anchorings; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35609 two-input study to ' +
    'the THIRD fixed input of the imp-35574 peak-location damping factor (~0.553): sweeping the ' +
    'Gronwall / A1-trap factor g = exp(TC_A1_TRAP) over TC_A1_TRAP in {2.37e-4 (baseline), 1.5e-4, ' +
    '3.0e-4} -- and removing the trap entirely (g = 1) -- leaves the damping factor invariant to ~5 ' +
    'significant figures (range [0.553039, 0.553050], absolute spread ~1.15e-5; trap-off vs baseline ' +
    'only ~1.6e-5 relative, ~700x smaller than the imp-35609 E_trunc move), staying firmly below 1. ' +
    'The AMPLIFICATION-not-damping verdict is therefore stable to ALL THREE of its fixed inputs, with ' +
    'the A1-trap the weakest lever, because g multiplies only the negligible direct-height term ' +
    'E_flow ~ (log T0 / T0) g (imp-35594 pins E_flow ~ O(1) E_trunc at the peak). No A1-trap value in ' +
    'this range flips the peak LOCATION into the crossover-style log-damping regime; the ~32x gap to ' +
    'the crossover damping (~18x) is robust. This corroborates the imp-35574/imp-35594 structural ' +
    'mechanism. Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous ' +
    'asymptotic; surrogate-vs-true fidelity (imp-35337a) UNTOUCHED; C_C ansatz (imp-2642/imp-2643), ' +
    'the baseline E_trunc = 3.06e-5 (imp-2631/imp-447) and the baseline TC_A1_TRAP = 2.37e-4 ' +
    'UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; ' +
    'changes no bound; no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35609 (two-input peak-damping sensitivity extended here); imp-35574 (peak-location damping ' +
    'factor ~0.553, probed); imp-35594 (E_flow ~ O(1) E_trunc at the peak); imp-35337 (interior-peak ' +
    'locator); imp-486 (C_mb GUE-conditional, UNTOUCHED); imp-2631 (E_trunc = 3.06e-5 baseline, ' +
    'UNTOUCHED).',
};

export const IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY_ASSERTIONS = [
  {
    // The baseline (g = exp(2.37e-4)) reproduces the imp-35574/imp-35609 damping ~0.553.
    id: 'imp35635-reproduces-baseline',
    description: 'the baseline reproduces the imp-35574 peak damping factor ~0.553',
    holds: () => Math.abs(BASE.damping_factor - 0.553) < 5e-3,
  },
  {
    // The A1-trap sweep covers baseline, two variants, and the trap-off control.
    id: 'imp35635-sweep-covers-four-variants',
    description: 'the A1-trap sweep has four variants including the trap-off control g = 1',
    holds: () => A1_SWEEP.length === 4 && TRAP_OFF.gronwall === 1,
  },
  {
    // KEY: the A1-trap barely moves the damping factor -- weaker than the imp-35609 E_trunc move.
    id: 'imp35635-a1trap-move-tiny',
    description: 'removing the A1 trap (g = 1) moves the damping factor by well under the ~1.1% E_trunc move',
    holds: () => TRAP_OFF_REL_MOVE > 0 && TRAP_OFF_REL_MOVE < 1e-3,
  },
  {
    // The AMPLIFICATION verdict (factor < 1) is stable across every A1-trap variant.
    id: 'imp35635-amplification-a1trap-stable',
    description: 'the damping-factor-<1 (amplification) verdict holds under every A1-trap probe',
    holds: () =>
      IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY.stability.all_amplified === true &&
      DAMPING_MAX < 1 &&
      DAMPING_SPREAD_ABS < 1e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35635-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY.verdict),
  },
];

for (const a of IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35635-peak-damping-a1trap-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP35635_PEAK_DAMPING_A1TRAP_SENSITIVITY;
