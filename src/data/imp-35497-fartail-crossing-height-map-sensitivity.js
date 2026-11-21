/**
 * @module imp-35497-fartail-crossing-height-map-sensitivity
 *
 * imp-35497 (numerical, frontier-direction): imp-35413 located the E_flow far-tail
 * fd-vs-analytic remnant sub-1e-3 crossing at N ~ 4.17e25 (log10 N ~ 25.6205) holding
 * the height map FIXED at the closed surrogate T0 = 2 pi N / log N (the choice that
 * makes the imp-35413 module pure Math, no heavy import). imp-35458 posed the same
 * HEIGHT-MAP sensitivity question for the E_coll=E_trunc crossover: recompute a landmark
 * under the EXACT Riemann-von Mangoldt inverse effectiveHeightForN(N) instead of the
 * closed surrogate and report the shift. This module applies that identical method to
 * the imp-35413 far-tail crossing.
 *
 * THE MEASUREMENT (single swap: the height map only)
 * --------------------------------------------------
 * The imp-35413 remnant is |analytic - fd|, where fd = localExponent is the central
 * log-log difference of the exact imp-35135 far-tail E_flow quantity eFlowWith(N), and
 * analytic = -1 + 3/log N is the imp-35198 closed leading form. eFlowWith reads the
 * height map T0(N). This module recomputes fd (hence the remnant, hence the crossing)
 * with ONLY the height map swapped from the closed surrogate T0 = 2 pi N / log N to the
 * exact RvM inverse effectiveHeightForN(N) -- the Newton solve of
 * (T/2pi)(log(T/2pi) - 1) = N -- keeping every other definition byte-identical. The
 * Newton solver is inlined (pure Math), so this module stays import-light like imp-35413.
 *
 *   height map                T0(1e26)        remnant(1e26)   sub-1e-3 crossing
 *   surrogate 2 pi N / log N   1.0495e25       0.000979        log10 N ~ 25.6205 (4.17e25)
 *   exact RvM inverse          1.1453e25       0.002082        log10 N ~ 40.9350 (8.61e40)
 *
 * THE FINDING
 * -----------
 * The exact RvM inverse sits ~9.1-9.8% ABOVE the closed surrogate at these scales
 * (T0_RvM / T0_surrogate ~ 1.095 near N = 1e25), an O(1/log T0) height-map divergence in
 * the same 5-8% band the imp-486 GUE-collision remainder inherits. That ~9% divergence
 * roughly DOUBLES the fd-vs-analytic remnant (0.001097 -> 0.002360 at N = 1e24) because
 * the imp-35198 analytic reference -1 + 3/log N was derived ON the surrogate channel and
 * is the wrong leading form for the RvM fd exponent. As a result the sub-1e-3 crossing
 * shifts from log10 N ~ 25.6205 (surrogate) to log10 N ~ 40.9350 (RvM inverse) -- a
 * +15.31-decade shift, an N-ratio of ~2.06e15. VERDICT: the sub-1e-3 crossing LANDMARK
 * is NOT robust; it is strongly surrogate-height-dependent -- it is a self-consistency
 * feature of the closed surrogate channel (surrogate fd vs surrogate analytic), NOT an
 * intrinsic far-tail scale. This does not weaken the imp-35413 slow-decay reading (the
 * remnant still decays under both maps); it only shows the 1e-3 CROSSING-N itself is an
 * artifact of the height-map choice and should always be quoted as a surrogate-channel
 * landmark.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the surrogate-channel crossing recomputed here)
 * @see imp-35458 (the height-map sensitivity method, applied to the E_coll=E_trunc crossover)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (byte-identical to imp-35413).
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// Height map A: the imp-35413 closed RvM surrogate T0 = 2 pi N / log N.
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// Height map B: the EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
// Inlined from lambda-rh-height-mapping.js effectiveHeightForN (pure Math, no import).
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

// The imp-35413 remnant |analytic - fd|, parameterised by the height map (single swap).
function makeRemnant(heightForN) {
  function eFlowWith(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    return C_F * (L / T0) * GRONWALL;
  }
  function localExponent(N) {
    const h = 1.0002; // same central-difference step as imp-35135/imp-35413
    const lo = Math.log(eFlowWith(N / h));
    const hi = Math.log(eFlowWith(N * h));
    return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
  }
  const analyticSurrogateExponent = (x) => -1 + 3 / x; // imp-35198 leading form
  return function remnantAtLog10(e) {
    const N = Math.pow(10, e);
    const x = Math.log(N);
    return Math.abs(analyticSurrogateExponent(x) - localExponent(N));
  };
}

function locateCrossingLog10(remnant, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnant(mid) > 1e-3) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const remnantSurrogate = makeRemnant(surrogateHeightForN);
const remnantRvM = makeRemnant(effectiveHeightForN);

// The surrogate crossing reproduces imp-35413; the RvM remnant sits ~2x higher, so its
// crossing lies far past 1e28 -- the [24, 300] bracket safely contains it.
const CROSS_SURROGATE_LOG10 = locateCrossingLog10(remnantSurrogate, 24, 28);
const CROSS_RVM_LOG10 = locateCrossingLog10(remnantRvM, 24, 300);
const N_SURROGATE = Math.pow(10, CROSS_SURROGATE_LOG10);
const N_RVM = Math.pow(10, CROSS_RVM_LOG10);
const SHIFT_DECADES = CROSS_RVM_LOG10 - CROSS_SURROGATE_LOG10;

// Height-map divergence and remnant inflation at the surrogate-crossing scale.
const T0_SURROGATE_1E26 = surrogateHeightForN(1e26);
const T0_RVM_1E26 = effectiveHeightForN(1e26);
const HEIGHT_REL_DIVERGENCE_1E26 = (T0_RVM_1E26 - T0_SURROGATE_1E26) / T0_SURROGATE_1E26;
const REMNANT_INFLATION_1E24 = remnantRvM(24) / remnantSurrogate(24);

export const IMP35497_FARTAIL_CROSSING_HEIGHT_MAP_SENSITIVITY = {
  id: 'imp-35497',
  proofSection: 'S-frontier',
  question:
    'Recompute the imp-35413 E_flow far-tail remnant sub-1e-3 crossing (N ~ 4.17e25, on ' +
    'the closed surrogate T0 = 2 pi N / log N) under the EXACT RvM inverse ' +
    'effectiveHeightForN, and report the crossing-N shift -- is the sub-1e-3 landmark robust?',
  method:
    'Swap ONLY the height map in the imp-35413 remnant |analytic - fd| (fd = central ' +
    'log-log difference of the imp-35135 far-tail E_flow on T0(N); analytic = imp-35198 ' +
    '-1 + 3/log N) from the closed surrogate T0 = 2 pi N / log N to the exact RvM inverse ' +
    '(Newton solve of (T/2pi)(log(T/2pi) - 1) = N, inlined pure-Math), then bisect the ' +
    'sub-1e-3 crossing under each map and compare.',
  crossings: {
    surrogate: {
      log10N: +CROSS_SURROGATE_LOG10.toFixed(4),
      N: +N_SURROGATE.toExponential(4),
    },
    rvmInverse: {
      log10N: +CROSS_RVM_LOG10.toFixed(4),
      N: +N_RVM.toExponential(4),
    },
    shiftDecades: +SHIFT_DECADES.toFixed(4),
    nRatio: +(N_RVM / N_SURROGATE).toExponential(4),
  },
  heightMapDivergence: {
    T0_surrogate_at_1e26: +T0_SURROGATE_1E26.toExponential(6),
    T0_rvm_at_1e26: +T0_RVM_1E26.toExponential(6),
    relDivergence_at_1e26: +HEIGHT_REL_DIVERGENCE_1E26.toExponential(4),
    remnantInflation_at_1e24: +REMNANT_INFLATION_1E24.toFixed(4),
  },
  finding: {
    F1_height_maps_diverge_by_about_9pct:
      'The exact RvM inverse sits ~9.1 percent above the closed surrogate at N = 1e26 ' +
      '(1.1453e25 vs 1.0495e25), an O(1/log T0) height-map divergence in the same 5-8 ' +
      'percent band the imp-486 GUE-collision remainder inherits.',
    F2_remnant_roughly_doubles:
      'That ~9 percent height divergence roughly DOUBLES the fd-vs-analytic remnant ' +
      '(0.001097 -> 0.002360 at N = 1e24), because the imp-35198 analytic reference ' +
      '-1 + 3/log N was derived on the surrogate channel and is the wrong leading form ' +
      'for the RvM fd exponent.',
    F3_crossing_shifts_15_decades:
      'The sub-1e-3 crossing shifts from log10 N ~ 25.6205 (surrogate) to log10 N ~ ' +
      '40.9350 (RvM inverse) -- a +15.31-decade shift, N-ratio ~2.06e15. The landmark is ' +
      'NOT robust: the 1e-3 crossing-N is a self-consistency feature of the closed ' +
      'surrogate channel, not an intrinsic far-tail scale.',
  },
  isRigorous: false,
  honestStatus:
    'Under the EXACT RvM inverse effectiveHeightForN (which sits ~9 percent above the ' +
    'closed surrogate T0 = 2 pi N / log N at these scales), the imp-35413 fd-vs-analytic ' +
    'remnant roughly doubles and its sub-1e-3 crossing shifts from N ~ 4.17e25 ' +
    '(log10 N ~ 25.6205) to N ~ 8.61e40 (log10 N ~ 40.9350) -- a +15.31-decade / ~2.06e15 ' +
    'shift. The sub-1e-3 crossing landmark is therefore strongly surrogate-height-dependent ' +
    '(a self-consistency feature of the surrogate channel), NOT robust. The slow-decay ' +
    'reading survives (the remnant decays under both maps); only the crossing-N is an ' +
    'artifact of the height-map choice. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Applying the imp-35458 height-map ' +
    'sensitivity method to the imp-35413 far-tail crossing: swapping the closed surrogate ' +
    'T0 = 2 pi N / log N for the exact RvM inverse effectiveHeightForN roughly doubles the ' +
    'fd-vs-analytic remnant and pushes the sub-1e-3 crossing from log10 N ~ 25.6205 ' +
    '(N ~ 4.17e25) out to log10 N ~ 40.9350 (N ~ 8.61e40), a +15.31-decade shift. The ' +
    'sub-1e-3 crossing landmark is strongly surrogate-height-dependent, NOT robust. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous ' +
    'asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35413 (surrogate-channel sub-1e-3 crossing, recomputed here); imp-35458 (height-map ' +
    'sensitivity method); imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail E_flow ' +
    'quantity); effectiveHeightForN (exact RvM inverse); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35497_FARTAIL_CROSSING_HEIGHT_MAP_SENSITIVITY_ASSERTIONS = [
  {
    // The surrogate-map crossing reproduces the imp-35413 landmark (log10 N ~ 25.6205).
    id: 'imp35497-reproduces-imp35413-surrogate-crossing',
    description: 'the surrogate-map crossing reproduces the imp-35413 log10 N ~ 25.6205 landmark',
    holds: () => Math.abs(CROSS_SURROGATE_LOG10 - 25.6205) < 1e-2,
  },
  {
    // The exact RvM inverse sits ~9 percent above the surrogate at the crossing scale.
    id: 'imp35497-height-maps-diverge-about-9pct',
    description: 'the RvM inverse exceeds the surrogate by ~9 percent at N = 1e26',
    holds: () =>
      HEIGHT_REL_DIVERGENCE_1E26 > 0.08 && HEIGHT_REL_DIVERGENCE_1E26 < 0.11,
  },
  {
    // The ~9 percent height divergence roughly doubles the remnant.
    id: 'imp35497-remnant-roughly-doubles',
    description: 'the RvM remnant is ~2x the surrogate remnant at N = 1e24',
    holds: () => REMNANT_INFLATION_1E24 > 1.8 && REMNANT_INFLATION_1E24 < 2.5,
  },
  {
    // The RvM crossing lands near log10 N ~ 40.94, far past the surrogate crossing.
    id: 'imp35497-rvm-crossing-located',
    description: 'the RvM sub-1e-3 crossing lands near log10 N ~ 40.94',
    holds: () => Math.abs(CROSS_RVM_LOG10 - 40.9350) < 5e-2,
  },
  {
    // The height-map swap shifts the crossing by ~15.3 decades -- not robust.
    id: 'imp35497-crossing-shift-about-15-decades',
    description: 'the sub-1e-3 crossing shifts by ~15.3 decades under the height-map swap',
    holds: () => SHIFT_DECADES > 14 && SHIFT_DECADES < 17,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35497-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35497_FARTAIL_CROSSING_HEIGHT_MAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35497_FARTAIL_CROSSING_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35497_FARTAIL_CROSSING_HEIGHT_MAP_SENSITIVITY.verdict),
  },
];

for (const a of IMP35497_FARTAIL_CROSSING_HEIGHT_MAP_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35497-fartail-crossing-height-map-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP35497_FARTAIL_CROSSING_HEIGHT_MAP_SENSITIVITY;
