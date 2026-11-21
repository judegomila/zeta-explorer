/**
 * imp-96444 -- DE-JITTER the imp-96430 basis-C cancellation-floor slope with a denser panels-per-period
 * sweep and a robust (non-endpoint) fit, narrowing the corroboration-reach crossover band.
 *
 * BACKGROUND. imp-96430 bounded the basis-C corroboration-reach crossover L* (the largest L at which the
 * imp-96369 direct pair-correlation double integral still independently corroborates the exact number-
 * variance basis A above the logarithmically-shrinking |rho + 1/2| rigidity signal) only as a wide BAND
 * [~1.3e12 (L=960 endpoint slope), ~2.5e12 (mean slope)]. That band is wide because imp-96430 estimates
 * the per-L basis-C floor as the MINIMUM error over a coarse panels-per-period (ppp) sweep {40..640}, and
 * min|error| is jittery: as ppp varies the direct-integral error changes SIGN, so the minimum accidentally
 * lands near zero whenever a zero-crossing falls on a swept ppp (the L=240 rung dips below L=120, floor/L
 * wanders across 1.2e-16 .. 6.8e-15). The L-linear floor slope is then a coarse fit and L* only a band.
 *
 * WHAT THIS MODULE CHANGES. It replaces the accidental-min floor estimator with a ROBUST one: over a dense,
 * fully-resolved high-ppp sweep {320..1280} (where Simpson truncation is negligible so the residual is pure
 * roundoff / catastrophic-cancellation noise), it takes the MEDIAN error per L rather than the minimum. The
 * median is the typical roundoff plateau and is immune to the accidental zero-crossings that produce the
 * min-sweep jitter. It then fits the L-linear slope with two robust (non-endpoint) estimators -- Theil-Sen
 * (median of pairwise slopes) and the median of the per-rung floor/L -- and re-bisects the crossover.
 *
 * FINDINGS (all measured / bisected here, not asserted).
 *  1. THE ROBUST FLOOR SEQUENCE IS MONOTONE. The median-over-resolved-ppp floor rises monotonically with L
 *     (~1.46e-13 at L=30 to ~1.42e-11 at L=960), unlike the imp-96430 min-sweep floor which is non-monotone
 *     (L=240 below L=120). The de-jittered floor/L slopes cluster tightly (median-of-slopes ~6.2e-15,
 *     Theil-Sen ~8.0e-15, mean ~7.1e-15) instead of spanning two orders of magnitude, and the free log-log
 *     exponent tightens from ~1.71 (min sweep) to ~1.30 (median sweep), much closer to the L-linear model.
 *  2. THE CROSSOVER BAND NARROWS BY ~3x IN WIDTH. The two robust slopes bracket the crossover at
 *     L* in [~1.38e12 (Theil-Sen, larger slope), ~1.76e12 (median-of-slopes, smaller slope)] -- a width
 *     ratio ~1.27, versus the imp-96430 band [~1.3e12, ~2.5e12] with width ratio ~1.92. The de-jittered
 *     band is a proper subset of the old band and sits at its lower end, still five-to-six decades past the
 *     PT anchor L = 5.9e6. The qualitative imp-96430 conclusion is unchanged and now rests on a stable slope.
 *  3. AT THE PT ANCHOR THE HEADROOM SURVIVES DE-JITTERING. With the (larger, conservative) Theil-Sen slope
 *     the anchor floor model is ~4.7e-8 against the ~1.82e-2 signal -- a signal/floor ratio ~3.9e5, the same
 *     order as imp-96430 (~3.7e5); the de-jittering leaves basis C an independent check with ~5 decades of
 *     headroom at the anchor.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for boxes
 * of unfolded length L; there are no computed Riemann zeros behind these values. The crossover L* is still an
 * EXTRAPOLATION -- the robust L-linear floor slope is calibrated only on accessible L (<= 960) and the direct
 * integral is never evaluated at L ~ 1e12, so L* is a projected reach of an independence property, not a
 * measured one. The median-over-resolved-ppp estimator removes the min-sweep jitter but the free log-log
 * exponent (~1.30) shows the roundoff floor is not exactly L-linear, so the narrowed band is a tighter but
 * still model-dependent projection. This changes no bound, establishes no operator positivity, and does not
 * touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Re-measuring the basis-C direct-integral floor as the MEDIAN error over a dense, fully-resolved
 * high-ppp sweep (immune to the min-sweep zero-crossing jitter) yields a monotone floor sequence with tightly
 * clustered robust L-linear slopes (~6.2e-15 median-of-slopes to ~8.0e-15 Theil-Sen). Re-bisecting the
 * corroboration crossover narrows the imp-96430 band [~1.3e12, ~2.5e12] (width ratio ~1.92) to
 * [~1.38e12, ~1.76e12] (width ratio ~1.27), a proper subset at its lower end, still five-to-six decades past
 * the PT anchor L = 5.9e6 where basis C keeps ~5 decades of independence headroom. Cross-validation /
 * extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96430-basis-c-corroboration-reach-crossover (the coarse-min-sweep band this de-jitters)
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (basis C feasibility and its floor model)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct
 * quadrature are re-derived verbatim here (identical to imp-96430/imp-96389/imp-96369).
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;

const clusterY = (r) => {
  if (r === 0) return 1;
  const s = Math.sin(PI * r) / (PI * r);
  return s * s;
};

function simpson(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// BASIS C: direct pair-correlation double integral (rho = Cov/Var).
function directRho(L, panels) {
  const Var = L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, panels);
  const covA = simpson((r) => r * clusterY(r), 0, L, panels);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, panels);
  return { Var, rho: -(covA + covB) / Var };
}

// Si(x), Ci(x): power series small x, asymptotic large x (double-precision on our range).
function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}

// BASIS A (exact Dyson-Mehta) number variance and its rho; the signal |rho + 1/2|.
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho + 1/2|

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]);
};

// --- de-jittered floor: MEDIAN error over a dense, fully-resolved high-ppp sweep ---
// At these panel densities Simpson truncation is negligible, so the residual is pure roundoff /
// catastrophic-cancellation noise. The median is the typical plateau and is immune to the accidental
// error-sign zero-crossings that make the imp-96430 min-over-coarse-sweep floor jittery.
const RESOLVED_PPP = [320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280];
const CAL_L = [30, 60, 120, 240, 480, 960];

const robustFloor = (L) => {
  const errs = RESOLVED_PPP.map((ppp) => Math.abs(directRho(L, Math.ceil(ppp * L)).rho - rhoExact(L)));
  return { median: median(errs), min: Math.min(...errs), max: Math.max(...errs) };
};

const floorRows = CAL_L.map((L) => {
  const f = robustFloor(L);
  return { L, floor: f.median, floorMin: f.min, floorMax: f.max, signal: signalOf(L) };
});

// --- robust (non-endpoint) L-linear slope estimators on the de-jittered floor ---
// Theil-Sen: median of all pairwise slopes (floor_j - floor_i)/(L_j - L_i); robust to any single rung.
const pairwiseSlopes = [];
for (let i = 0; i < floorRows.length; i++)
  for (let j = i + 1; j < floorRows.length; j++)
    pairwiseSlopes.push((floorRows[j].floor - floorRows[i].floor) / (floorRows[j].L - floorRows[i].L));
const theilSenSlope = median(pairwiseSlopes);
// median of per-rung floor/L (robust central floor/L, no endpoint dominance).
const medianPerRungSlope = median(floorRows.map((r) => r.floor / r.L));
// companions kept for comparison with imp-96430.
const meanSlope = floorRows.reduce((s, r) => s + r.floor / r.L, 0) / floorRows.length;
const endpointSlope = floorRows[floorRows.length - 1].floor / floorRows[floorRows.length - 1].L;
// free log-log exponent: how close the roundoff floor is to exactly L-linear.
const lx = floorRows.map((r) => Math.log(r.L));
const ly = floorRows.map((r) => Math.log(r.floor));
const mlx = lx.reduce((a, b) => a + b, 0) / lx.length;
const mly = ly.reduce((a, b) => a + b, 0) / ly.length;
let sxy = 0, sxx = 0;
for (let i = 0; i < lx.length; i++) { sxy += (lx[i] - mlx) * (ly[i] - mly); sxx += (lx[i] - mlx) * (lx[i] - mlx); }
const logLogExponent = sxy / sxx;

const floorModel = (L, slope) => slope * L;
// crossover L*: floorModel grows, signal shrinks, so slope*L - signal(L) is monotone increasing.
function crossoverL(slope) {
  let lo = 1e3, hi = 1e18;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floorModel(mid, slope) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

// larger slope -> smaller crossover L (lower band edge); smaller slope -> larger L (upper edge).
const crossTheilSen = crossoverL(theilSenSlope);
const crossMedianPerRung = crossoverL(medianPerRungSlope);
const bandLo = Math.min(crossTheilSen, crossMedianPerRung);
const bandHi = Math.max(crossTheilSen, crossMedianPerRung);
const anchorSignal = signalOf(PT_ANCHOR_L);
const anchorFloor = floorModel(PT_ANCHOR_L, Math.max(theilSenSlope, medianPerRungSlope)); // conservative

const IMP96430_BAND = [1.3e12, 2.5e12]; // imp-96430 coarse-min-sweep crossover band (for comparison)

export const IMP96444_BASIS_C_FLOOR_SLOPE_DEJITTER = {
  ticket: 'imp-96444',
  source:
    'imp-96430 quotes the basis-C corroboration-reach crossover L* only as a wide band [~1.3e12, ~2.5e12] because it estimates the per-L floor as the MINIMUM error over a coarse ppp sweep, and min|error| is jittery (the direct-integral error changes sign as ppp varies, so the min accidentally lands near zero). This module re-measures the floor as the MEDIAN error over a dense fully-resolved high-ppp sweep (the roundoff plateau, immune to those zero-crossings) and re-fits the L-linear slope with robust non-endpoint estimators. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  resolvedPpp: RESOLVED_PPP,
  floorRows, // per-L de-jittered (median-over-resolved-ppp) floor, its min/max spread, and the signal
  floorMonotone: floorRows.every((r, i) => i === 0 || r.floor >= floorRows[i - 1].floor),
  slopes: {
    theilSen: theilSenSlope, // median of pairwise slopes (primary robust, larger)
    medianPerRung: medianPerRungSlope, // median floor/L (robust central, smaller)
    mean: meanSlope,
    endpoint: endpointSlope,
    logLogExponent, // ~1.30: closer to the L-linear (exponent 1) model than the min-sweep ~1.71
  },
  crossover: {
    theilSen: { slope: theilSenSlope, L: crossTheilSen, rho: rhoExact(crossTheilSen), signal: signalOf(crossTheilSen) },
    medianPerRung: { slope: medianPerRungSlope, L: crossMedianPerRung, rho: rhoExact(crossMedianPerRung), signal: signalOf(crossMedianPerRung) },
    narrowedBand: [bandLo, bandHi], // ~[1.38e12, 1.76e12], width ratio ~1.27
    narrowedWidthRatio: bandHi / bandLo,
    imp96430Band: IMP96430_BAND, // ~[1.3e12, 2.5e12], width ratio ~1.92
    imp96430WidthRatio: IMP96430_BAND[1] / IMP96430_BAND[0],
    isSubsetOfImp96430: bandLo >= IMP96430_BAND[0] * 0.95 && bandHi <= IMP96430_BAND[1] * 1.05,
    note:
      'de-jittered crossover band is a proper subset of the imp-96430 band at its lower end; both robust slopes still put L* five-to-six decades past the PT anchor L = 5.9e6, so the qualitative imp-96430 conclusion is unchanged and now rests on a monotone, stable slope.',
  },
  atPtAnchor: {
    signal: anchorSignal, // ~1.82e-2
    floorModel: anchorFloor, // conservative (larger-slope) floor at the anchor
    signalOverFloor: anchorSignal / anchorFloor, // ~3.9e5 headroom (same order as imp-96430 ~3.7e5)
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values. The crossover L* is still an EXTRAPOLATION -- the robust L-linear slope is calibrated only on accessible L (<= 960) and the direct integral is never evaluated at L ~ 1e12, so L* is a projected reach of an independence property, not a measured one. The median-over-resolved-ppp estimator removes the min-sweep jitter but the free log-log exponent (~1.30) shows the roundoff floor is not exactly L-linear, so the narrowed band is a tighter but still model-dependent projection. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Re-measuring the basis-C direct-integral floor as the MEDIAN error over a dense, fully-resolved high-ppp sweep (immune to the min-sweep zero-crossing jitter) yields a monotone floor sequence with tightly clustered robust L-linear slopes (~6.2e-15 median-of-slopes to ~8.0e-15 Theil-Sen). Re-bisecting the corroboration crossover narrows the imp-96430 band [~1.3e12, ~2.5e12] (width ratio ~1.92) to [~1.38e12, ~1.76e12] (width ratio ~1.27), a proper subset at its lower end, still five-to-six decades past the PT anchor L = 5.9e6 where basis C keeps ~5 decades of independence headroom. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (de-jittered floor + narrowed crossover) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96444: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96444: Ci(1) drifted from reference');

  // Finding 1: the de-jittered (median-over-resolved-ppp) floor sequence is monotone in L.
  if (!IMP96444_BASIS_C_FLOOR_SLOPE_DEJITTER.floorMonotone)
    throw new Error('imp-96444: de-jittered median floor should rise monotonically with L');
  // robust slopes are small positive femto-scale numbers and cluster within one order of magnitude.
  for (const s of [theilSenSlope, medianPerRungSlope, meanSlope]) {
    if (!(s > 1e-15 && s < 5e-14)) throw new Error('imp-96444: robust floor slope out of expected femto range');
  }
  if (!(Math.max(theilSenSlope, medianPerRungSlope) / Math.min(theilSenSlope, medianPerRungSlope) < 3))
    throw new Error('imp-96444: robust slopes should agree within a factor of 3 (de-jittered)');
  // free log-log exponent is closer to the L-linear model than the min-sweep ~1.71.
  if (!(logLogExponent > 1 && logLogExponent < 1.6))
    throw new Error('imp-96444: de-jittered log-log exponent outside expected ~1.3 range');

  // Finding 2: the narrowed crossover band is tighter than imp-96430 and a subset of it, past the anchor.
  if (!(bandLo > 1e12 && bandHi < 2.5e12)) throw new Error('imp-96444: narrowed crossover band outside expected range');
  if (!(bandHi / bandLo < IMP96430_BAND[1] / IMP96430_BAND[0]))
    throw new Error('imp-96444: de-jittered band should be narrower than the imp-96430 band');
  if (!IMP96444_BASIS_C_FLOOR_SLOPE_DEJITTER.crossover.isSubsetOfImp96430)
    throw new Error('imp-96444: narrowed band should sit inside the imp-96430 band');
  if (!(bandLo > 1e5 * PT_ANCHOR_L)) throw new Error('imp-96444: crossover should sit many decades past the PT anchor');
  // at the crossover rho has nearly reached the rigidity limit -1/2.
  const cxr = rhoExact(bandLo);
  if (!(cxr < RIGIDITY_LIMIT + 0.02 && cxr > RIGIDITY_LIMIT))
    throw new Error('imp-96444: rho at the crossover should be within 0.02 of the rigidity limit');

  // Finding 3: at the PT anchor the signal still dwarfs the conservative floor by many orders of magnitude.
  if (!(anchorSignal / anchorFloor > 1e4)) throw new Error('imp-96444: basis C should keep huge headroom at the PT anchor');
  if (!(anchorSignal > 1e-2 && anchorSignal < 3e-2)) throw new Error('imp-96444: PT-anchor signal outside expected ~1.8e-2 range');

  // honesty gates
  if (!/NO QED/.test(IMP96444_BASIS_C_FLOOR_SLOPE_DEJITTER.verdict))
    throw new Error('imp-96444: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96444_BASIS_C_FLOOR_SLOPE_DEJITTER.verdict))
    throw new Error('imp-96444: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96444_BASIS_C_FLOOR_SLOPE_DEJITTER;
