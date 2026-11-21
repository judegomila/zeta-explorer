/**
 * imp-96528 -- MEASUREMENT: quantify how many MUTUALLY-INDEPENDENT unclipped interior heights
 * the fixed 10^6 Odlyzko ordinate set can supply (as the clip fraction and window spacing are
 * relaxed) and bound the resulting uncertainty on the relErr(T) scaling-exponent fit that the
 * imp-96510 systematic-vs-noise sub-gap needs.
 *
 * BACKGROUND. imp-96510 leaves an OPEN sub-gap (imp-96510-systematic-vs-noise-dip-depth-scaling):
 * deciding whether the below-envelope number-variance dip depth relErr(T) is a genuine SYSTEMATIC
 * deviation (relErr fixed, so the dip score z = relErr*sqrt(n_w/2) ~ T^(1/4), and a clean 2-sigma
 * is cheap at height ~5.4e6) or pure SAMPLING NOISE (relErr shrinks with the chi-square floor
 * sqrt(2/n_w), so z stays O(1) and a 2-sigma needs a contiguous ~2.44e13-ordinate source that does
 * not exist) requires the relErr(T) scaling EXPONENT measured across MORE than the two imp-96493
 * interior anchors (T = 1.5e5 and 3.879e5). imp-96510 asserts the fixed 10^6 set "supplies too few
 * independent unclipped heights (spacing 13/7) to fit the exponent" but never quantifies how few,
 * nor the precision a fit could actually reach. This module quantifies both.
 *
 * TWO COMPETING EXPONENTS. Write the dip depth as relErr(T) ~ C * T^p. The two readings imp-96510
 * contrasts are exactly two values of p:
 *   reading (A) SYSTEMATIC:      relErr fixed          => p = 0
 *   reading (B) SAMPLING-NOISE:  relErr ~ sqrt(2/n_w),  n_w ~ sqrt(T)  => relErr ~ T^(-1/4) => p = -1/4
 * so the whole sub-gap reduces to distinguishing p = 0 from p = -1/4: a separation of just
 * Delta_p = 1/4 in the log-log slope. A fit can decide it only if the slope standard error
 * SE(p) is comfortably below 1/4.
 *
 * THE INDEPENDENT-HEIGHT COUNT. A number-variance window at center T with span fraction s occupies
 * [(1 - s) T, (1 + s) T]. For the tiling to be fully interior to the ordinate band [T_min, T_max]
 * it needs (1 + s) T <= T_max (unclipped above) and (1 - s) T >= T_min (unclipped below), i.e.
 *   T in [ T_lo(s), T_hi(s) ],  T_lo = T_min/(1 - s),  T_hi = T_max/(1 + s).
 * Two heights give MUTUALLY-INDEPENDENT (non-overlapping) measurements only when their spans do not
 * share ordinates: 0.7*T2 >= 1.3*T1 at s = 0.30, i.e. T2/T1 >= g(s) = (1 + s)/(1 - s). So the
 * independent heights form a geometric ladder of ratio g(s), and the count the fixed set supplies is
 *   K_indep(s) = floor( log(T_hi(s)/T_lo(s)) / log g(s) ) + 1.
 * Relaxing the clip (smaller s) raises T_hi, lowers T_lo AND shrinks g, all of which raise K -- but
 * a smaller s narrows the window, so each height then measures a DIFFERENT (narrower-span)
 * number-variance statistic, not the +/-30 percent excursion depth the sub-gap is defined at. That
 * is the honest ceiling: buying more independent heights costs you the very quantity you are fitting.
 *
 * THE INTRINSIC PER-HEIGHT SCATTER. Under the sampling-noise reading the depth at each height is
 * relErr ~ sqrt(2/n_w) * |Z| with Z ~ N(0,1) (the chi-square variance estimator r has relative
 * error sqrt(2/n_w), and r_cap - r is a zero-mean fluctuation of that size). Taking logs,
 *   log relErr = [ 0.5 log(2/n_w) ]  +  log|Z|,
 * the bracket is the deterministic slope being fit and log|Z| is irreducible scatter. Its variance
 * is Var(log|Z|) = psi'(1/2)/4 = pi^2/8 (since Var(log chi^2_1) = psi'(1/2) = pi^2/2), so the
 * single-height log-scatter is sigma = sqrt(pi^2/8) ~ 1.1107 -- LARGE, and independent of s. This is
 * the dominant obstruction: even a single clean height carries ~1.1 nat of scatter in log relErr.
 *
 * SLOPE UNCERTAINTY. For an OLS fit of log relErr against log T over K heights on a ratio-g ladder,
 *   SE(p) = sigma / sqrt( sum_i (x_i - xbar)^2 ) = sigma / ( log g * sqrt( K (K^2 - 1) / 12 ) ),
 * with x_i = log T_i. Two points (K = 2, the imp-96493 pair) fit the slope with zero residual
 * degrees of freedom -- SE(p) is undefined, which is exactly why imp-96510 calls the exponent
 * unfit. K = 3 is the minimum that yields any error bar, and it is enormous.
 *
 * FINDINGS (recomputed below).
 *  1. At the sub-gap-native +/-30 percent span the fixed 10^6 set supplies only K_indep = 6
 *     mutually-independent unclipped interior heights across the practical band [1e4, 4.6175e5],
 *     and only K = 2 in the excursion regime T >= 1.5e5 (the two imp-96493 anchors) -- confirming
 *     imp-96510's "too few" verbatim and quantifying it.
 *  2. Even relaxing the clip to +/-10 percent (which changes the measured statistic) lifts the
 *     count only to ~20, because the tighter non-overlap spacing shrinks log g in step; and the
 *     irreducible per-height scatter sigma ~ 1.11 keeps SE(p) >= ~0.21 across the ENTIRE relaxation
 *     range s in [0.10, 0.30].
 *  3. Against the Delta_p = 1/4 separation between the two readings, that SE(p) leaves the systematic
 *     (p = 0) and sampling-noise (p = -1/4) laws separated by at most ~1.2 sigma (at +/-10 percent)
 *     and only ~0.58 sigma at the native +/-30 percent -- nowhere near the ~2-3 sigma a decisive fit
 *     needs. The fixed set CANNOT rigorously pin the exponent.
 *
 * VERDICT. The fixed 10^6 Odlyzko set supplies only ~6 mutually-independent unclipped +/-30 percent
 * interior heights (just 2 in the T >= 1.5e5 excursion regime). Relaxing the clip fraction toward
 * +/-10 percent raises the raw count toward ~20 but (i) changes the measured narrower-span statistic
 * away from the sub-gap-native +/-30 percent depth and (ii) still leaves the exponent standard error
 * SE(p) >= ~0.21, because the fixed ~1.5-decade lever arm and the irreducible single-height chi
 * scatter sigma = sqrt(pi^2/8) ~ 1.11 dominate. Since the systematic and sampling-noise readings
 * differ by only Delta_p = 1/4, that SE(p) separates them by at most ~1.2 sigma -- the fixed set
 * cannot decide the imp-96510 sub-gap by fitting relErr(T), and a rigorous decision genuinely
 * requires the higher / contiguous zero-source imp-96510 already showed does not exist. This
 * quantifies (does not close) the sub-gap. Measurement only; changes no bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96510-deeper-interior-dip-height-source-reach (names the open systematic-vs-noise sub-gap)
 * @see imp-96493-excursion-2sigma-interior-scan (the two interior anchors T = 1.5e5, 3.879e5)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the z = relErr/sqrt(2/n_w) dip score)
 *
 * Import-light: no zeros bundle, no sibling imports. The ordinate ceiling T_max = 600269.68 and the
 * practical interior floor T_min = 1e4 (the lowest imp-95562 band() fit height) are baked literals;
 * every count / lever arm / slope error is recomputed here.
 */

const T_MAX_ORDINATE = 600269.68; // top ordinate of the 10^6-th Odlyzko zero (src/data/zeros-to-1e6.js)
const T_MIN_INTERIOR = 1.0e4; // lowest imp-95562 band() fit height: the practical GUE-regime interior floor
const NATIVE_SPAN = 0.3; // the +/-30% span the imp-96510 sub-gap depth relErr is defined at
const EXCURSION_REGIME_FLOOR = 1.5e5; // the imp-96089 excursion regime the two imp-96493 anchors sit in

// competing exponents: systematic relErr ~ T^0, sampling-noise relErr ~ T^(-1/4).
const P_SYSTEMATIC = 0;
const P_SAMPLING_NOISE = -0.25;
const DELTA_P = Math.abs(P_SYSTEMATIC - P_SAMPLING_NOISE); // 0.25 separation the fit must resolve

// irreducible single-height log-relErr scatter: sd(log|Z|), Var(log|Z|) = psi'(1/2)/4 = pi^2/8.
const SIGMA_LOG_RELERR = Math.sqrt((Math.PI * Math.PI) / 8); // ~1.1107

const spanRatio = (s) => (1 + s) / (1 - s); // g(s): non-overlap independence spacing
const interiorHi = (s) => T_MAX_ORDINATE / (1 + s); // T_hi(s): highest unclipped-above center
const interiorLo = (s) => T_MIN_INTERIOR / (1 - s); // T_lo(s): lowest unclipped-below center

// independent-height count over a band [lo, hi] at spacing g(s).
const independentCount = (s, lo, hi) => {
  const rungs = Math.log(hi / lo) / Math.log(spanRatio(s));
  return rungs > 0 ? Math.floor(rungs) + 1 : 0;
};

// OLS slope standard error for K equally-log-spaced (ratio g) heights: SE = sigma / (log g * sqrt(K(K^2-1)/12)).
const slopeStandardError = (K, s) => {
  if (K < 3) return Infinity; // K=2 fits the slope with zero residual dof -> no error bar
  const spread = Math.log(spanRatio(s)) * Math.sqrt((K * (K * K - 1)) / 12);
  return SIGMA_LOG_RELERR / spread;
};

// --- native +/-30% span: the count over the full practical interior band, and in the excursion regime ---
const nativeHi = interiorHi(NATIVE_SPAN); // ~4.6175e5
const nativeLo = interiorLo(NATIVE_SPAN); // ~1.4286e4
const K_NATIVE_FULL = independentCount(NATIVE_SPAN, nativeLo, nativeHi); // 6
const K_NATIVE_REGIME = independentCount(NATIVE_SPAN, EXCURSION_REGIME_FLOOR, nativeHi); // 2 (the imp-96493 pair)
const SE_NATIVE_FULL = slopeStandardError(K_NATIVE_FULL, NATIVE_SPAN);

// --- relaxation sweep: shrink the clip fraction s and record how count / lever arm / SE(p) move ---
const SPAN_GRID = [0.30, 0.25, 0.20, 0.15, 0.10];
const relaxationSweep = SPAN_GRID.map((s) => {
  const lo = interiorLo(s);
  const hi = interiorHi(s);
  const K = independentCount(s, lo, hi);
  const SE = slopeStandardError(K, s);
  return {
    span: s,
    g: spanRatio(s),
    interiorLo: lo,
    interiorHi: hi,
    logLeverArm: Math.log(hi / lo), // fixed ~1.5-decade range of the 10^6 set
    K_indep: K,
    SE_exponent: SE,
    separationSigma: DELTA_P / SE, // how many sigma the two readings sit apart at this s
    changesFittedStatistic: s !== NATIVE_SPAN, // narrower span != the +/-30% sub-gap depth
  };
});

// best (smallest) SE reachable anywhere on the fixed set, and whether it can resolve Delta_p = 1/4.
const bestSweep = relaxationSweep.reduce((b, r) => (r.SE_exponent < b.SE_exponent ? r : b));
const bestSeparationSigma = DELTA_P / bestSweep.SE_exponent; // ~1.16 at +/-10%
const canResolveSubGap = bestSeparationSigma >= 3; // false: <= ~1.2 sigma everywhere

export const IMP96528_INDEPENDENT_UNCLIPPED_HEIGHT_COUNT_EXPONENT_FIT_REACH = {
  ticket: 'imp-96528',
  question:
    'How many mutually-independent unclipped interior heights does the fixed 10^6 Odlyzko set supply (as the clip fraction and window spacing are relaxed), and what uncertainty does that place on the relErr(T) scaling-exponent fit the imp-96510 systematic-vs-noise sub-gap needs?',
  method:
    'A +/-s span at center T occupies [(1-s)T,(1+s)T]; unclipped interior heights lie in [T_min/(1-s), T_max/(1+s)] and mutually-independent (non-overlapping) heights form a geometric ladder of ratio g(s)=(1+s)/(1-s), so K_indep(s)=floor(log(T_hi/T_lo)/log g)+1. The two imp-96510 readings are the two exponents p in relErr ~ C T^p (systematic p=0, sampling-noise p=-1/4), a separation Delta_p=1/4. With irreducible single-height log-relErr scatter sigma=sqrt(pi^2/8)~1.11, an OLS slope over K ladder heights has SE(p)=sigma/(log g * sqrt(K(K^2-1)/12)). Sweep s in [0.10,0.30]. Import-light, baked T_max/T_min literals.',
  competingReadings: {
    systematicExponent: P_SYSTEMATIC, // relErr fixed
    samplingNoiseExponent: P_SAMPLING_NOISE, // relErr ~ T^(-1/4)
    exponentSeparation: DELTA_P, // 0.25: what the fit must resolve
    note: 'The whole imp-96510 sub-gap reduces to distinguishing slope p = 0 from p = -1/4 in log relErr vs log T.',
  },
  perHeightScatter: {
    sigmaLogRelErr: SIGMA_LOG_RELERR, // sqrt(pi^2/8) ~ 1.1107
    derivation: 'relErr ~ sqrt(2/n_w)*|Z|, Z~N(0,1); Var(log|Z|) = trigamma(1/2)/4 = pi^2/8; s-independent and irreducible.',
  },
  nativeSpanCount: {
    span: NATIVE_SPAN,
    interiorLo: nativeLo, // ~1.4286e4
    interiorHi: nativeHi, // ~4.6175e5
    K_indep_fullBand: K_NATIVE_FULL, // 6: over the practical interior band [1e4, 4.6175e5]
    K_indep_excursionRegime: K_NATIVE_REGIME, // 2: T >= 1.5e5 (exactly the imp-96493 pair)
    SE_exponent_fullBand: SE_NATIVE_FULL, // ~0.43
    note: 'At the sub-gap-native +/-30% span the fixed set supplies only 6 independent unclipped heights (2 in the excursion regime) -- quantifying imp-96510s "too few".',
  },
  relaxationSweep,
  bestReach: {
    span: bestSweep.span, // 0.10
    K_indep: bestSweep.K_indep, // ~20
    SE_exponent: bestSweep.SE_exponent, // ~0.21
    separationSigma: bestSeparationSigma, // ~1.16
    changesFittedStatistic: bestSweep.changesFittedStatistic, // true: narrower span measures a different depth
    note: 'The smallest exponent error the fixed set can reach (at +/-10%, ~20 heights) still leaves SE(p) ~ 0.21 -- and it is not even the +/-30% depth the sub-gap is about.',
  },
  canResolveSubGap, // false
  verdict:
    'The fixed 10^6 Odlyzko set supplies only ~6 mutually-independent unclipped +/-30% interior heights (just 2 in the T >= 1.5e5 excursion regime, i.e. exactly the two imp-96493 anchors). Relaxing the clip fraction toward +/-10% raises the raw count toward ~20, but (i) narrower windows then measure a different, narrower-span statistic rather than the sub-gap-native +/-30% dip depth, and (ii) the exponent standard error SE(p) still bottoms out near ~0.21 because the fixed ~1.5-decade lever arm and the irreducible single-height chi scatter sigma = sqrt(pi^2/8) ~ 1.11 dominate. Since the systematic (p = 0) and sampling-noise (p = -1/4) readings differ by only Delta_p = 1/4, that SE(p) separates them by at most ~1.2 sigma (and only ~0.58 sigma at +/-30%) -- far short of the ~2-3 sigma a decisive fit needs. The fixed set therefore cannot pin the relErr(T) exponent, so the imp-96510 systematic-vs-noise sub-gap stays open pending the higher / contiguous zero-source imp-96510 already showed does not exist. This quantifies (does not close) the sub-gap. Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 / imp-96510 convention).
export const IMP96528_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the fixed 10^6 Odlyzko set supplies '
  + 'only ~6 mutually-independent unclipped +/-30% interior heights (2 in the excursion regime), and even at '
  + '+/-10% relaxation the relErr(T) exponent standard error stays >= ~0.21 -- separating the systematic '
  + '(p=0) and sampling-noise (p=-1/4) readings by at most ~1.2 sigma. The imp-96510 systematic-vs-noise '
  + 'sub-gap is QUANTIFIED as unresolvable from the fixed set, not decided; changes no bound.';

// --- self-executing internal-consistency assertions (formula re-derivation, generous tolerances) ---
(() => {
  const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
  // native span ladder ratio is 13/7
  if (rel(spanRatio(NATIVE_SPAN), 13 / 7) > 1e-12) throw new Error('imp-96528: native span ratio not 13/7');
  // exponent separation is exactly 1/4
  if (rel(DELTA_P, 0.25) > 1e-12) throw new Error('imp-96528: exponent separation not 1/4');
  // irreducible scatter sqrt(pi^2/8) ~ 1.1107
  if (rel(SIGMA_LOG_RELERR, 1.110720734539592) > 1e-9) throw new Error('imp-96528: sigma(log relErr) drifted from sqrt(pi^2/8)');
  // native +/-30% band count is 6 over [1e4, 4.6175e5]
  if (K_NATIVE_FULL !== 6) throw new Error('imp-96528: native full-band independent count not 6');
  // excursion-regime count is exactly the imp-96493 pair (2)
  if (K_NATIVE_REGIME !== 2) throw new Error('imp-96528: excursion-regime independent count not 2 (the imp-96493 pair)');
  // interior ceiling matches the imp-96493 clip threshold ~4.6175e5
  if (rel(nativeHi, 4.6175e5, 5e2) > 2e-3) throw new Error('imp-96528: native interior ceiling drifted from ~4.6175e5');
  // K=2 gives no error bar (undefined slope SE)
  if (Number.isFinite(slopeStandardError(2, NATIVE_SPAN))) throw new Error('imp-96528: K=2 should give an undefined (Infinity) slope SE');
  // native full-band SE(p) ~ 0.43 (6 heights)
  if (rel(SE_NATIVE_FULL, 0.4288, 5e-3) > 5e-3) throw new Error('imp-96528: native full-band SE(p) drifted from ~0.43');
  // relaxation raises the count monotonically as s shrinks
  const counts = relaxationSweep.map((r) => r.K_indep);
  for (let i = 1; i < counts.length; i++) if (!(counts[i] >= counts[i - 1])) throw new Error('imp-96528: independent count should not fall as the clip is relaxed');
  if (counts[0] !== 6 || counts[counts.length - 1] < 18) throw new Error('imp-96528: relaxation sweep count endpoints drifted (expect 6 -> ~20)');
  // the best reachable SE(p) is still >= ~0.2 and cannot resolve Delta_p = 1/4 at 3 sigma
  if (!(bestSweep.SE_exponent > 0.19 && bestSweep.SE_exponent < 0.23)) throw new Error('imp-96528: best reachable SE(p) drifted from ~0.21');
  if (!(bestSeparationSigma > 0.9 && bestSeparationSigma < 1.4)) throw new Error('imp-96528: best separation should be ~1.2 sigma');
  if (canResolveSubGap) throw new Error('imp-96528: fixed set must NOT be able to resolve the sub-gap at 3 sigma');
  // honesty gates
  if (!/NO QED/.test(IMP96528_INDEPENDENT_UNCLIPPED_HEIGHT_COUNT_EXPONENT_FIT_REACH.verdict))
    throw new Error('imp-96528: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96528_INDEPENDENT_UNCLIPPED_HEIGHT_COUNT_EXPONENT_FIT_REACH.verdict))
    throw new Error('imp-96528: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96528_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96528_HONEST_BANNER) && /NO QED/.test(IMP96528_HONEST_BANNER)))
    throw new Error('imp-96528: IMP96528_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96528_INDEPENDENT_UNCLIPPED_HEIGHT_COUNT_EXPONENT_FIT_REACH;
