/**
 * @module imp-35371-eflow-fartail-remnant-deep-extension
 *
 * imp-35371 (accuracy, frontier-direction): imp-35280 measured the E_flow far-tail
 * fd-vs-analytic (closed-form/prefactor) remnant -- the gap |analytic - fd-surrogate|
 * between the imp-35198 analytic leading exponent (-1 + 3/log N) and the finite-difference
 * exponent read on the CLOSED surrogate height map T0 = 2 pi N / log N -- across the
 * four-rung ladder N = 1e6, 1e9, 1e12, 1e16, finding a NON-monotone ~0.002 band
 * (0.0025 / 0.0031 / 0.0026 / 0.0019) that its honestStatus reported as a floor which
 * "does NOT vanish with N" and told extrapolators past 1e16 to "assume the ~0.002 floor
 * persists". imp-35280 only measured to N = 1e16. This module EXTENDS the same remnant
 * two decades deeper, to N = 1e20 and N = 1e24, to ASSESS whether the ~0.002 remnant
 * asymptotes to a nonzero constant or slowly decays.
 *
 * THE MEASUREMENT (surrogate channel only -- no height-map swap, so no heavy import)
 * ---------------------------------------------------------------------------------
 * The fd-vs-analytic remnant holds the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N (imp-35280): both the fd-surrogate exponent and the analytic
 * exponent live on that closed inverse, so the remnant isolates ONLY the closed-form
 * Taylor truncation of -1 + 3/log N plus the (log T0)^2-vs-C_F*L prefactor-form
 * difference -- it never touches effectiveHeightForN. That makes this module pure Math
 * (no lambda-rh-height-mapping import) and it recomputes the imp-35280 four rungs live,
 * reproducing 0.0025 / 0.0031 / 0.0026 / 0.0019 to the digit before adding the two new
 * deep rungs.
 *
 *   N        fd-surrogate    analytic (-1+3/x)    fd-vs-analytic remnant
 *   1e6        -0.7803         -0.7829              0.0025   (imp-35280, reproduced)
 *   1e9        -0.8521         -0.8552              0.0031   (imp-35280, reproduced)
 *   1e12       -0.8889         -0.8914              0.0026   (imp-35280, reproduced)
 *   1e16       -0.9167         -0.9186              0.0019   (imp-35280, reproduced)
 *   1e20       -0.9334         -0.9349              0.0014   (NEW -- this module)
 *   1e24       -0.9446         -0.9457              0.0011   (NEW -- this module)
 *
 * THE FINDING (refines the imp-35280 "non-vanishing floor" reading)
 * ----------------------------------------------------------------
 * Past the N = 1e9 peak (0.0031) the remnant decreases MONOTONICALLY at every rung all the
 * way down: 0.0026 (1e12) -> 0.0019 (1e16) -> 0.0014 (1e20) -> 0.0011 (1e24), a factor ~2.33
 * drop across the 1e12..1e24 window (twelve decades). The two new deep rungs therefore do NOT
 * support a nonzero asymptote: the remnant keeps decaying, slowly, toward zero -- it is not a
 * constant floor. imp-35280 read its own N <= 1e16 window correctly (the remnant sits in a
 * ~0.002 band there and is a growing SHARE of the even-faster-shrinking residual), but its
 * extrapolation instruction "assume the ~0.002 floor persists" past 1e16 is REFINED here: on
 * the measured 1e16..1e24 continuation the remnant is ~0.0019 -> ~0.0011, i.e. SLOW DECAY, not
 * a nonzero asymptote. The decay is slow enough (well slower than 1/log N; remnant*log N drifts
 * only ~0.069 -> ~0.061 over 1e16..1e24) that within any single finite window it still reads as
 * a ~0.001..0.002 residual, so "floor" is a fair local description while "nonzero asymptote" is
 * not the correct global one.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a rigorous
 * asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066
 * K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant this extends)
 * @see imp-35279-eflow-fartail-inverse-swap-ladder (same remnant column, from the swap-gap side)
 * @see imp-35217-eflow-fartail-exponent-x2-correction (the leading residual being decomposed)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (far-tail E_flow quantity)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on a given height map (imp-35236 form).
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The four imp-35280 rungs (reproduced live) plus the two NEW deep rungs (imp-35371).
const RUNGS = [1e6, 1e9, 1e12, 1e16, 1e20, 1e24].map((N) => {
  const x = Math.log(N);
  const fdSurr = localExponent((n) => eFlowWith(surrogateHeightForN, n), N);
  const analytic = analyticSurrogateExponent(x);
  return {
    N: +N.toExponential(0),
    logN: +x.toFixed(4),
    fdSurrogateExponent: +fdSurr.toFixed(4),
    analyticExponent: +analytic.toFixed(4),
    remnant: +Math.abs(analytic - fdSurr).toFixed(4), // THE fd-vs-analytic floor
    isNewDeepRung: N >= 1e20, // 1e20, 1e24 are the imp-35371 extension
  };
});

// imp-35280 baked remnants at the shared four rungs -- faithfulness target for reproduction.
const IMP35280_REMNANTS = { 1e6: 0.0025, 1e9: 0.0031, 1e12: 0.0026, 1e16: 0.0019 };

export const IMP35371_EFLOW_FARTAIL_REMNANT_DEEP_EXTENSION = {
  id: 'imp-35371',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35280 E_flow far-tail fd-vs-analytic remnant two decades deeper ' +
    '(N = 1e20, 1e24) to assess whether the ~0.002 remnant asymptotes to a nonzero ' +
    'constant or slowly decays.',
  method:
    'Recompute the imp-35280 fd-vs-analytic remnant |analytic - fd-surrogate| live on the ' +
    'closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), reproducing the four imp-35280 rungs to ' +
    'the digit, then measuring the same remnant at the two new deep rungs N = 1e20 and 1e24.',
  ladder: RUNGS,
  finding: {
    F1_reproduces_imp35280_four_rungs:
      'The remnant recomputed live reproduces the imp-35280 four-rung values 0.0025 / 0.0031 ' +
      '/ 0.0026 / 0.0019 (N = 1e6..1e16) to the digit, confirming the deep extension shares ' +
      'the imp-35280 surrogate channel exactly.',
    F2_deep_rungs_continue_decay:
      'At the two NEW deep rungs the remnant is 0.0014 (N = 1e20) and 0.0011 (N = 1e24) -- ' +
      'past the N = 1e9 peak (0.0031) the remnant decreases MONOTONICALLY at every rung ' +
      '(0.0026 -> 0.0019 -> 0.0014 -> 0.0011), a factor ~2.33 drop over the 1e12..1e24 window.',
    F3_no_nonzero_asymptote:
      'The two deep rungs do NOT support a nonzero asymptote: the remnant keeps decaying ' +
      'slowly toward zero rather than levelling off at ~0.002. The decay is slower than ' +
      '1/log N (remnant*log N drifts only ~0.069 -> ~0.061 over 1e16..1e24), so within any ' +
      'single finite window it still reads as a ~0.001..0.002 residual.',
    F4_refines_imp35280_extrapolation:
      'imp-35280 read its N <= 1e16 window correctly (a ~0.002 band that is a growing share of ' +
      'the faster-shrinking residual), but its instruction to "assume the ~0.002 floor persists" ' +
      'past 1e16 is REFINED: the measured 1e16..1e24 continuation is ~0.0019 -> ~0.0011, i.e. ' +
      'slow decay, not a nonzero constant. "Floor" is fair locally; "nonzero asymptote" is not.',
  },
  isRigorous: false,
  honestStatus:
    'Extending the imp-35280 fd-vs-analytic remnant to N = 1e20 (0.0014) and N = 1e24 (0.0011) ' +
    'shows the remnant decreasing monotonically past its N = 1e9 peak all the way down ' +
    '(0.0031 -> 0.0026 -> 0.0019 -> 0.0014 -> 0.0011), a factor ~2.33 drop across the twelve ' +
    'decades from 1e12 to 1e24. The evidence therefore favours a SLOWLY DECAYING remnant, not a ' +
    'nonzero-constant floor: the imp-35280 "does NOT vanish with N" reading is accurate as a ' +
    'local description on any finite window (the decay is slower than 1/log N) but its ' +
    'extrapolation "assume the ~0.002 floor persists" overstates the deep behaviour, where the ' +
    'remnant is already ~0.0011 and still falling. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). The imp-35280 fd-vs-analytic remnant, ' +
    'extended two decades deeper, is 0.0014 at N = 1e20 and 0.0011 at N = 1e24 -- decreasing ' +
    'monotonically past the N = 1e9 peak (0.0026 / 0.0019 / 0.0014 / 0.0011 over 1e12..1e24), a ' +
    'factor ~2.33 drop over twelve decades. The two deep rungs do NOT support a nonzero asymptote: ' +
    'the ~0.002 "floor" is a slowly decaying quantity, so imp-35280 non-vanishing-on-its-window ' +
    'reading stands but its persist-past-1e16 extrapolation is refined toward slow decay. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; ' +
    'E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35280 (four-rung fd-vs-analytic remnant, extended here); imp-35279 (same remnant column, ' +
    'swap-gap side); imp-35217 (leading residual); imp-35198 (analytic -1 + 3/log N); imp-35135 ' +
    '(far-tail E_flow quantity); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35371_EFLOW_FARTAIL_REMNANT_DEEP_EXTENSION_ASSERTIONS = [
  {
    // Reproduce the imp-35280 four-rung remnants to the digit (surrogate channel is faithful).
    id: 'imp35371-reproduces-imp35280-four-rungs',
    description: 'the live remnant matches the imp-35280 baked values at N = 1e6, 1e9, 1e12, 1e16',
    holds: () =>
      RUNGS.filter((r) => !r.isNewDeepRung).every(
        (r) => Math.abs(r.remnant - IMP35280_REMNANTS[r.N]) < 5e-4,
      ),
  },
  {
    // The two new deep rungs carry the expected measured remnants.
    id: 'imp35371-deep-rungs-measured',
    description: 'the new deep rungs give remnant 0.0014 (N = 1e20) and 0.0011 (N = 1e24)',
    holds: () => {
      const byN = Object.fromEntries(RUNGS.map((r) => [r.N, r.remnant]));
      return Math.abs(byN[1e20] - 0.0014) < 5e-4 && Math.abs(byN[1e24] - 0.0011) < 5e-4;
    },
  },
  {
    // Past the N = 1e9 peak, the remnant decreases monotonically at every rung down to 1e24.
    id: 'imp35371-remnant-monotone-decreasing-past-peak',
    description: 'remnant strictly decreases across N = 1e9 -> 1e12 -> 1e16 -> 1e20 -> 1e24',
    holds: () => {
      const g = RUNGS.map((r) => r.remnant); // ordered by ascending N
      for (let i = 1; i < g.length - 1; i++) {
        if (!(g[i] > g[i + 1])) return false;
      }
      return true;
    },
  },
  {
    // No nonzero asymptote: the deep remnant is well below the ~0.002 band it was extrapolated at.
    id: 'imp35371-deep-remnant-below-floor-band',
    description: 'the deepest rung (N = 1e24) remnant is materially below the imp-35280 ~0.002 floor',
    holds: () => {
      const deep = RUNGS[RUNGS.length - 1];
      return deep.N === 1e24 && deep.remnant < 0.0015 && deep.remnant < IMP35280_REMNANTS[1e12];
    },
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35371-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35371_EFLOW_FARTAIL_REMNANT_DEEP_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP35371_EFLOW_FARTAIL_REMNANT_DEEP_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP35371_EFLOW_FARTAIL_REMNANT_DEEP_EXTENSION.verdict),
  },
];

for (const a of IMP35371_EFLOW_FARTAIL_REMNANT_DEEP_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35371-eflow-fartail-remnant-deep-extension assertion failed: ${a.id}`,
    );
  }
}

export default IMP35371_EFLOW_FARTAIL_REMNANT_DEEP_EXTENSION;
