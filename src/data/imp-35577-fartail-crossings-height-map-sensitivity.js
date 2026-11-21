/**
 * @module imp-35577-fartail-crossings-height-map-sensitivity
 *
 * imp-35577 (numerical, frontier-direction): imp-35458 measured the E_coll = E_trunc
 * floor-crossover HEIGHT-MAP sensitivity (RvM inverse effectiveHeightForN vs the closed
 * surrogate T0 = 2 pi N / log N) and found a benign ~ -0.98 percent shift, ~18x smaller
 * than the ~18 percent raw-height gap, because the crossover sees the height map only
 * through log T0 (LOG-DAMPED, sub-1 percent). imp-35497 then applied the identical swap
 * to ONE deeper landmark -- the imp-35413 far-tail fd-vs-analytic remnant sub-1e-3
 * crossing (N ~ 4.17e25) -- and found the OPPOSITE: a +15.31-decade shift, NOT robust.
 * The imp-35473 sub-1e-4 crossing (N ~ 1.546e109), ~83.6 decades deeper still, was never
 * height-map-tested. This module measures the height-map shift of BOTH far-tail crossings
 * side by side and answers the imp-35577 question directly: does the imp-35458 log-damping
 * hold (stay sub-1 percent) or GROW at deep-tail heights?
 *
 * THE MEASUREMENT (single swap per crossing: the height map only)
 * --------------------------------------------------------------
 * Both crossings are threshold-crossings of the SAME fd-vs-analytic remnant
 * |analytic - fd|, where fd = localExponent is the central log-log difference of the
 * exact imp-35135 far-tail E_flow quantity eFlowWith(N) and analytic = -1 + 3/log N is
 * the imp-35198 closed leading form. eFlowWith reads the height map T0(N). We recompute
 * fd (hence the remnant, hence each crossing) with ONLY the height map swapped from the
 * closed surrogate T0 = 2 pi N / log N to the exact RvM inverse effectiveHeightForN(N)
 * (Newton solve of (T/2pi)(log(T/2pi) - 1) = N), keeping every other definition
 * byte-identical to imp-35413/imp-35473. The Newton solver is inlined (pure Math), so
 * this module stays import-light like imp-35413/imp-35473/imp-35497.
 *
 *   crossing        surrogate log10 N   RvM-inverse log10 N   shift (decades)
 *   sub-1e-3        25.6205 (4.17e25)   40.9350 (8.61e40)     +15.31  (imp-35497)
 *   sub-1e-4       109.1892 (1.55e109) 156.0294 (1.07e156)    +46.84  (NEW here)
 *
 *   height divergence (T0_RvM - T0_sur)/T0_sur   remnant inflation R_RvM/R_sur
 *   at sub-1e-3 scale   ~ +9.24 percent           ~ 2.13x
 *   at sub-1e-4 scale   ~ +2.65 percent           ~ 1.87x
 *
 * THE FINDING
 * -----------
 * The imp-35458 log-damping DOES NOT rescue the far-tail crossings, and the failure GROWS
 * deeper. The RvM-inverse map roughly doubles the fd-vs-analytic remnant under BOTH maps
 * (~2.13x at the sub-1e-3 scale, ~1.87x at the sub-1e-4 scale) -- because the imp-35198
 * analytic reference -1 + 3/log N was derived ON the surrogate channel and is the wrong
 * leading form for the RvM fd exponent -- and that near-constant factor-of-~2 inflation
 * rides an ever-SLOWER (~1/log N) remnant decay, so recovering the threshold costs more
 * decades the deeper the crossing sits. The absolute shift GROWS from +15.31 decades
 * (sub-1e-3) to +46.84 decades (sub-1e-4) EVEN THOUGH the raw height divergence SHRINKS
 * from ~9.24 percent to ~2.65 percent (the O(1/log T0) height gap itself damps deeper).
 * The relative shift in the crossing-N is astronomically far from the imp-35458 sub-1
 * percent regime -- an N-ratio of ~2.06e15 at 1e-3 and ~6.92e46 at 1e-4. VERDICT: the
 * far-tail remnant crossings are the LEAST height-map-robust landmarks in the cohort and
 * get MORE fragile deeper, in sharp contrast to the imp-35458 crossover / imp-35536 peak
 * which the log damps to sub-1 percent. The two crossing TYPES respond oppositely to the
 * height-map choice: the crossover / peak see the height only through log T0 (a ~18-32
 * percent raw gap compresses to under 1 percent), whereas the far-tail remnant compares a
 * map-swapped fd against a surrogate-channel analytic reference, so the mismatch inflation
 * survives and amplifies along the slow tail. This does not weaken the imp-35413/imp-35473
 * slow-decay reading (the remnant still decays under both maps); it only confirms one more
 * decade of threshold deeper that the crossing-N itself is a surrogate-channel artifact and
 * should always be quoted as such.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the surrogate-channel sub-1e-3 crossing)
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (the surrogate-channel sub-1e-4 crossing, NEW-tested here)
 * @see imp-35497-fartail-crossing-height-map-sensitivity (the sub-1e-3 swap, reproduced here)
 * @see imp-35458-crossover-height-map-sensitivity (the log-damped crossover, sub-1 percent)
 * @see imp-35536-peak-height-map-sensitivity (the log-damped interior peak, robust)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (byte-identical to imp-35413/imp-35473).
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// Height map A: the imp-35413/imp-35473 closed RvM surrogate T0 = 2 pi N / log N.
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

// The imp-35413/imp-35473 remnant |analytic - fd|, parameterised by the height map
// (single swap; byte-identical fd/analytic definitions to those two modules).
function makeRemnant(heightForN) {
  function eFlowWith(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    return C_F * (L / T0) * GRONWALL;
  }
  function localExponent(N) {
    const h = 1.0002; // same central-difference step as imp-35135/imp-35413/imp-35473
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

// Bisect the crossing of a chosen threshold in log10 N over [lo, hi]. The remnant is
// monotone decreasing past the ~1e9 peak, so a plain bisection converges to the unique root.
function locateCrossingLog10(remnant, lo, hi, threshold) {
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (remnant(mid) > threshold) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const remnantSurrogate = makeRemnant(surrogateHeightForN);
const remnantRvM = makeRemnant(effectiveHeightForN);

// Surrogate-channel crossings (reproduce imp-35413 / imp-35473 landmarks).
const SUB1E3_SUR_LOG10 = locateCrossingLog10(remnantSurrogate, 20, 40, 1e-3); // ~25.6205
const SUB1E4_SUR_LOG10 = locateCrossingLog10(remnantSurrogate, 100, 130, 1e-4); // ~109.1892

// RvM-inverse crossings. The RvM remnant sits ~2x higher, so both crossings lie far
// deeper; the wide brackets safely contain each unique root (all N < 1e308, finite).
const SUB1E3_RVM_LOG10 = locateCrossingLog10(remnantRvM, 24, 60, 1e-3); // ~40.9350 (imp-35497)
const SUB1E4_RVM_LOG10 = locateCrossingLog10(remnantRvM, 130, 200, 1e-4); // ~156.0294 (NEW)

const SUB1E3_SHIFT = SUB1E3_RVM_LOG10 - SUB1E3_SUR_LOG10; // ~+15.3145 decades
const SUB1E4_SHIFT = SUB1E4_RVM_LOG10 - SUB1E4_SUR_LOG10; // ~+46.8401 decades

// Height-map divergence at each surrogate-crossing scale (O(1/log T0), shrinks deeper).
function relDivergenceAtLog10(e) {
  const N = Math.pow(10, e);
  const tS = surrogateHeightForN(N);
  const tR = effectiveHeightForN(N);
  return (tR - tS) / tS;
}
const DIV_SUB1E3 = relDivergenceAtLog10(SUB1E3_SUR_LOG10); // ~+0.0924
const DIV_SUB1E4 = relDivergenceAtLog10(SUB1E4_SUR_LOG10); // ~+0.0265

// Remnant inflation R_RvM / R_sur at each surrogate-crossing scale (~2x both).
const INFLATION_SUB1E3 = remnantRvM(SUB1E3_SUR_LOG10) / remnantSurrogate(SUB1E3_SUR_LOG10); // ~2.13
const INFLATION_SUB1E4 = remnantRvM(SUB1E4_SUR_LOG10) / remnantSurrogate(SUB1E4_SUR_LOG10); // ~1.87

const N_RATIO_SUB1E3 = Math.pow(10, SUB1E3_SHIFT); // ~2.06e15
const N_RATIO_SUB1E4 = Math.pow(10, SUB1E4_SHIFT); // ~6.92e46

export const IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY = {
  id: 'imp-35577',
  proofSection: 'S-frontier',
  question:
    'Measure the height-map shift (RvM inverse effectiveHeightForN vs the imp-35413 closed ' +
    'surrogate T0 = 2 pi N / log N) of BOTH E_flow far-tail remnant threshold-crossings -- ' +
    'the imp-35413 sub-1e-3 (N ~ 4.17e25) and the imp-35473 sub-1e-4 (N ~ 1.546e109) -- and ' +
    'report whether the imp-35458 log-damping stays sub-1 percent or GROWS at deep-tail heights.',
  method:
    'Swap ONLY the height map in the imp-35413/imp-35473 remnant |analytic - fd| (fd = central ' +
    'log-log difference of the imp-35135 far-tail E_flow on T0(N); analytic = imp-35198 ' +
    '-1 + 3/log N) from the closed surrogate T0 = 2 pi N / log N to the exact RvM inverse ' +
    '(Newton solve of (T/2pi)(log(T/2pi) - 1) = N, inlined pure-Math), then bisect each ' +
    'threshold-crossing under both maps and compare the decade shift, the raw height divergence, ' +
    'and the remnant inflation at each crossing scale.',
  crossings: {
    sub1e3: {
      threshold: 1e-3,
      surrogate: { log10N: +SUB1E3_SUR_LOG10.toFixed(4), N: +Math.pow(10, SUB1E3_SUR_LOG10).toExponential(4) },
      rvmInverse: { log10N: +SUB1E3_RVM_LOG10.toFixed(4), N: +Math.pow(10, SUB1E3_RVM_LOG10).toExponential(4) },
      shiftDecades: +SUB1E3_SHIFT.toFixed(4),
      nRatio: +N_RATIO_SUB1E3.toExponential(4),
      heightDivergence: +DIV_SUB1E3.toExponential(4),
      remnantInflation: +INFLATION_SUB1E3.toFixed(4),
      source: 'reproduces imp-35497',
    },
    sub1e4: {
      threshold: 1e-4,
      surrogate: { log10N: +SUB1E4_SUR_LOG10.toFixed(4), N: +Math.pow(10, SUB1E4_SUR_LOG10).toExponential(4) },
      rvmInverse: { log10N: +SUB1E4_RVM_LOG10.toFixed(4), N: +Math.pow(10, SUB1E4_RVM_LOG10).toExponential(4) },
      shiftDecades: +SUB1E4_SHIFT.toFixed(4),
      nRatio: +N_RATIO_SUB1E4.toExponential(4),
      heightDivergence: +DIV_SUB1E4.toExponential(4),
      remnantInflation: +INFLATION_SUB1E4.toFixed(4),
      source: 'NEW (imp-35473 crossing never height-map-tested before)',
    },
  },
  finding: {
    F1_reproduces_sub1e3_swap:
      'The sub-1e-3 crossing swap reproduces imp-35497: surrogate log10 N ~ 25.6205 (4.17e25) ' +
      'to RvM-inverse log10 N ~ 40.9350 (8.61e40), a +15.31-decade shift, apples-to-apples.',
    F2_sub1e4_shift_grows:
      'The NEW sub-1e-4 crossing shifts from surrogate log10 N ~ 109.1892 (1.55e109) to ' +
      'RvM-inverse log10 N ~ 156.0294 (1.07e156), a +46.84-decade shift -- the absolute ' +
      'shift GROWS ~3.06x deeper (15.31 -> 46.84 decades) even though the raw height ' +
      'divergence SHRINKS from ~9.24 percent to ~2.65 percent (the O(1/log T0) gap damps deeper).',
    F3_log_damping_fails_and_grows:
      'The imp-35458 log-damping (sub-1 percent for the crossover) DOES NOT rescue the ' +
      'far-tail crossings and gets WORSE deeper: the N-ratio is ~2.06e15 at 1e-3 and ~6.92e46 ' +
      'at 1e-4, astronomically far from sub-1 percent, because the ~2x remnant inflation ' +
      '(analytic -1 + 3/log N is a surrogate-channel reference) rides an ever-slower ~1/log N ' +
      'decay, so a near-constant inflation costs more decades the deeper the crossing sits.',
  },
  logDampingVerdict:
    'GROWS -- the far-tail crossing shift is NOT sub-1 percent under the height-map swap and ' +
    'grows in absolute decades at deeper tail (from +15.31 to +46.84 decades), the opposite of ' +
    'the imp-35458 crossover (log-damped, ~ -0.98 percent) and imp-35536 peak (robust). The two ' +
    'crossing TYPES respond oppositely: the crossover/peak see the height only through log T0, ' +
    'whereas the far-tail remnant compares a map-swapped fd against a surrogate-channel analytic ' +
    'reference, so the mismatch inflation survives and amplifies along the slow tail.',
  isRigorous: false,
  honestStatus:
    'Swapping the height map from the closed surrogate T0 = 2 pi N / log N to the exact RvM ' +
    'inverse effectiveHeightForN pushes the imp-35413 sub-1e-3 far-tail crossing from ' +
    'N ~ 4.17e25 (log10 N ~ 25.6205) to N ~ 8.61e40 (log10 N ~ 40.9350, +15.31 decades, ' +
    'reproducing imp-35497) and the imp-35473 sub-1e-4 crossing from N ~ 1.55e109 ' +
    '(log10 N ~ 109.1892) to N ~ 1.07e156 (log10 N ~ 156.0294, +46.84 decades, NEW). The ' +
    'absolute shift GROWS deeper even though the raw height divergence shrinks (9.24 -> 2.65 ' +
    'percent), because the ~2x remnant inflation rides an ever-slower ~1/log N decay. The ' +
    'imp-35458 log-damping does NOT hold at deep-tail heights; both far-tail crossing-N are ' +
    'strongly surrogate-height-dependent artifacts. The slow-decay reading survives (the ' +
    'remnant decays under both maps). Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Applying the imp-35458/imp-35497 ' +
    'height-map sensitivity method to BOTH E_flow far-tail remnant crossings: swapping the ' +
    'closed surrogate T0 = 2 pi N / log N for the exact RvM inverse effectiveHeightForN roughly ' +
    'doubles the fd-vs-analytic remnant under both maps and pushes the sub-1e-3 crossing +15.31 ' +
    'decades (25.6205 -> 40.9350, reproducing imp-35497) and the never-before-tested sub-1e-4 ' +
    'crossing +46.84 decades (109.1892 -> 156.0294). The imp-35458 log-damping does NOT hold ' +
    'here and GROWS worse deeper: the absolute shift rises from +15.31 to +46.84 decades ' +
    '(N-ratio ~2.06e15 to ~6.92e46) even as the raw height divergence shrinks from ~9.24 to ' +
    '~2.65 percent -- the far-tail crossings are the least height-map-robust landmarks in the ' +
    'cohort, opposite to the log-damped crossover and peak, because they compare a map-swapped ' +
    'fd against a surrogate-channel analytic reference. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) ' +
    'untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per ' +
    'imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35413 (sub-1e-3 surrogate crossing); imp-35473 (sub-1e-4 surrogate crossing, ' +
    'height-map-tested here for the first time); imp-35497 (sub-1e-3 height-map swap, ' +
    'reproduced); imp-35458 (log-damped crossover method); imp-35536 (log-damped peak); ' +
    'imp-35198 (analytic -1 + 3/log N); imp-35135 (far-tail E_flow quantity); effectiveHeightForN ' +
    '(exact RvM inverse); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_ASSERTIONS = [
  {
    // The surrogate crossings reproduce the imp-35413 / imp-35473 landmarks.
    id: 'imp35577-reproduces-surrogate-crossings',
    description: 'surrogate crossings reproduce imp-35413 log10 N ~ 25.6205 and imp-35473 log10 N ~ 109.1892',
    holds: () =>
      Math.abs(SUB1E3_SUR_LOG10 - 25.6205) < 1e-2 &&
      Math.abs(SUB1E4_SUR_LOG10 - 109.1892) < 1e-2,
  },
  {
    // The sub-1e-3 RvM crossing reproduces the imp-35497 result (~40.9350, +15.31 decades).
    id: 'imp35577-sub1e3-swap-reproduces-imp35497',
    description: 'the sub-1e-3 RvM crossing lands near log10 N ~ 40.9350, +15.31 decade shift',
    holds: () =>
      Math.abs(SUB1E3_RVM_LOG10 - 40.9350) < 5e-2 &&
      SUB1E3_SHIFT > 14 &&
      SUB1E3_SHIFT < 17,
  },
  {
    // The NEW sub-1e-4 RvM crossing lands near log10 N ~ 156.0294, +46.84 decade shift.
    id: 'imp35577-sub1e4-swap-located',
    description: 'the sub-1e-4 RvM crossing lands near log10 N ~ 156.0294, +46.84 decade shift',
    holds: () =>
      Math.abs(SUB1E4_RVM_LOG10 - 156.0294) < 5e-2 &&
      SUB1E4_SHIFT > 44 &&
      SUB1E4_SHIFT < 50,
  },
  {
    // The absolute decade shift GROWS deeper while the raw height divergence SHRINKS.
    id: 'imp35577-shift-grows-while-divergence-shrinks',
    description: 'the decade shift grows (sub-1e-4 > sub-1e-3) while the height divergence shrinks (deeper < shallower)',
    holds: () =>
      SUB1E4_SHIFT > SUB1E3_SHIFT &&
      DIV_SUB1E4 < DIV_SUB1E3 &&
      DIV_SUB1E3 > 0.08 &&
      DIV_SUB1E3 < 0.11 &&
      DIV_SUB1E4 > 0.02 &&
      DIV_SUB1E4 < 0.04,
  },
  {
    // Both maps roughly double the remnant (~2x) at both crossing scales.
    id: 'imp35577-remnant-roughly-doubles-both',
    description: 'the RvM remnant is ~2x the surrogate remnant at both the sub-1e-3 and sub-1e-4 scales',
    holds: () =>
      INFLATION_SUB1E3 > 1.7 &&
      INFLATION_SUB1E3 < 2.5 &&
      INFLATION_SUB1E4 > 1.6 &&
      INFLATION_SUB1E4 < 2.3,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35577-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY.verdict),
  },
];

for (const a of IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35577-fartail-crossings-height-map-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY;
