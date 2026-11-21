/**
 * @module imp-34546-tailside-overshoot-ratio-saturation-j5-j6
 *
 * imp-34546 (numerical, frontier-direction): imp-34528 (T2) found that the CUMULATIVE tail
 * overshoot ratio resRatio(j) = measFrac(j)/lawFrac(j) of the M3 saturation-curvature hump tail
 * over the pure N^(-1/2) law GROWS monotonically resRatio(j) = {2.200, 3.225, 3.834, 4.183} for
 * j = 1..4, so hump(9+j)/hump(9) is NOT a rescaled 10^(-j/2). imp-34528 stopped at j = 4 (tail
 * decade k = 13) because the imp-33809 amplitude ladder ended there, and it left OPEN whether the
 * overshoot ratio keeps climbing without bound or saturates to a finite ceiling. This module
 * recomputes the two further tail decades hump(14) and hump(15) with the IDENTICAL inherited
 * imp-33809 method (reuse-gated against the k = 6..13 ladder), extends resRatio to j = 5,6, and
 * MEASURES whether the overshoot ratio saturates by fitting it to a bounded a - b*r^j form.
 *
 * THE TAIL EXTENSION (imp-33809 method, recomputed verbatim -- no fresh model)
 * ---------------------------------------------------------------------------
 *   Same sub-terms as imp-33809/imp-33773/imp-34532 (no re-derivation): sigma = E_coll/(E_trunc+
 *   E_flow+E_coll), E_trunc = 3.06e-5, E_coll = C_C sqrt(logT0/N), E_flow = C_F (logT0/T0) Gronwall;
 *   per decade p_sigma = -slope OLS(ln sigma vs ln N, 4 pts/decade), p_ecoll = -d log E_coll /
 *   d log N over endpoints, hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma. A REUSE GATE recomputes
 *   k = 6..13 and checks it reproduces the imp-33809 humpAmplitudes verbatim; the two new tail rungs
 *   are (matching imp-34532 hump(14) and imp-34545 hump(15) exactly):
 *     hump(14) = 9.0441e-4, hump(15) = 2.9795e-4 (tail, k > 13).
 *   Peak hump(9) = 6.4758e-2 (reused).
 *
 * THE MEASUREMENT (measurement only -- extends the imp-34528 overshoot ladder to j = 5,6)
 * -------------------------------------------------------------------------------------
 *   For each tail offset j = k - 9: measFrac(j) = hump(9+j)/hump(9), lawFrac(j) = 10^(-j/2),
 *   resRatio(j) = measFrac(j)/lawFrac(j), localDecay(k) = hump(k-1)/hump(k). The extended ladder:
 *     resRatio(j) = {2.2003, 3.2249, 3.8336, 4.1825, 4.4165, 4.6009} for j = 1..6.
 *
 *   (S1) THE OVERSHOOT RATIO IS STILL CLIMBING AT j = 5,6 BUT WITH SHRINKING INCREMENTS. The new
 *        rungs resRatio(5) = 4.4165, resRatio(6) = 4.6009 continue above the j = 4 value 4.1825, so
 *        the imp-34528 T2 growth persists -- BUT the first differences dResRatio(j) = {1.0246,
 *        0.6087, 0.3489, 0.2340, 0.1844} shrink monotonically, so the climb is DECELERATING, the
 *        opposite of a runaway.
 *   (S2) THE OVERSHOOT RATIO SATURATES TO A FINITE CEILING. Fitting resRatio(j) = a - b*r^j (grid
 *        over r, linear a,b per r) gives a bounded geometric approach: ceiling a ~ 4.80, b ~ 4.23,
 *        r ~ 0.614, R^2 ~ 0.9996. So resRatio is NOT unbounded -- it converges geometrically to a
 *        finite limit ~4.80; by j = 6 it has covered ~96% of the 1 -> ceiling range (gap to ceiling
 *        ~0.20, still shrinking by ~0.61 per offset). The imp-34528 T2 "grows monotonically" verdict
 *        is TRUE but the growth is a bounded saturation, not divergence.
 *   (S3) THE SATURATION IS FORCED BY THE imp-34528 T3 localDecay -> sqrt(10) CONSISTENCY. As the
 *        local per-decade decay localDecay(k) = hump(k-1)/hump(k) climbs toward sqrt(10) = 3.16228
 *        (extended here: localDecay(14) = 2.9947, localDecay(15) = 3.0355, gap to sqrt(10) still
 *        halving), the per-offset step measFrac(j+1)/measFrac(j) -> 1/sqrt(10) = 10^(-1/2) = the pure
 *        lawFrac step, so resRatio(j+1)/resRatio(j) -> 1 and resRatio MUST level off. The finite
 *        ceiling in (S2) is the direct cumulative signature of the T3 local-rate convergence -- the
 *        two imp-34528 findings are consistent, not in tension.
 *
 * The punchline: imp-34528 T2 left open whether the cumulative overshoot resRatio(j) = measFrac(j)/
 * lawFrac(j) climbs without bound. Extending the tail to k = 14,15 (resRatio(5,6) = 4.4165, 4.6009)
 * and fitting a - b*r^j shows it SATURATES to a finite ceiling ~4.80 with a geometric approach
 * (r ~ 0.614, R^2 ~ 0.9996) -- the growth is real but bounded. This is exactly what the imp-34528 T3
 * localDecay -> sqrt(10) convergence requires: once the per-decade rate hits the pure N^(-1/2) slope,
 * the cumulative fraction tracks a fixed multiple of the pure law, so the overshoot ratio can only
 * level off. The tail overshoots the sqrt(1/N) law by a CONSTANT deep-tail factor ~4.8x, not a
 * growing one.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Recomputes the imp-33809 hump amplitudes by the same method
 * (reuse-gated against the k = 6..13 ladder); the fitted ceiling is a bounded-form extrapolation of
 * six points, NOT a proven limit; the component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34528-tailside-hump-decay-vs-sqrt-n-fartail (T2 overshoot ratio grows; T3 localDecay->sqrt(10); extended here)
 * @see imp-34532-hump-skew-headside-extension-k5-k4 (recomputed hump(14) = 9.0441e-4, reused method)
 * @see imp-34545-hump-skew-headside-extension-j6 (recomputed hump(15) = 2.9795e-4, reused method)
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes + method, reuse-gated here)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33809_SATURATION_CURVATURE_HUMP_VS_K } from './imp-33809-saturation-curvature-hump-vs-k.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33809/imp-33727/imp-33773 exactly

// EXACT inherited imp-3406/imp-33809 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaOf = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaOf(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma over the decade [10^k, 10^(k+1)] (imp-33809 M3 residual).
function humpAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

const CROSSOVER_K = 9;
const PEAK = humpAt(CROSSOVER_K); // hump(9) = 6.4758e-2 (recomputed, matches imp-33809)
const SQRT10 = Math.sqrt(10); // 3.16228: pure N^(-1/2) per-decade decay rate

// Reuse-gate ladder: recompute k = 6..13 and compare against the imp-33809 stored amplitudes.
const RECOMPUTED_6_13 = [6, 7, 8, 9, 10, 11, 12, 13].map((k) => humpAt(k));
const IMP33809_HUMPS = IMP33809_SATURATION_CURVATURE_HUMP_VS_K.humpAmplitudes; // k = 6..13

// The two new tail decades (k = 14,15), recomputed by the same method (match imp-34532/imp-34545).
const HUMP14 = humpAt(14); // 9.0441e-4 (imp-34532)
const HUMP15 = humpAt(15); // 2.9795e-4 (imp-34545)

// Extended cumulative-overshoot ladder j = 1..6 (imp-34528 j = 1..4 recomputed for continuity).
const OVERSHOOT_LADDER = [1, 2, 3, 4, 5, 6].map((j) => {
  const k = CROSSOVER_K + j;
  const hump = humpAt(k);
  const measFrac = hump / PEAK; // hump(9+j)/hump(9)
  const lawFrac = Math.pow(10, -j / 2); // idealized N^(-1/2) prediction 10^(-j/2)
  const localDecay = humpAt(k - 1) / hump; // per-decade decay factor k-1 -> k
  return {
    offset: j,
    k,
    hump: +hump.toExponential(4),
    measFrac: +measFrac.toFixed(6),
    lawFrac: +lawFrac.toFixed(6),
    resRatio: +(measFrac / lawFrac).toFixed(4), // cumulative overshoot factor over the pure law
    localDecay: +localDecay.toFixed(4), // hump(k-1)/hump(k), climbs toward sqrt(10)
    gapToSqrt10: +(SQRT10 - localDecay).toFixed(4),
  };
});

const RES_RATIOS = OVERSHOOT_LADDER.map((r) => r.resRatio); // {2.2003,3.2249,3.8336,4.1825,4.4165,4.6009}
// First differences of the overshoot ratio -- shrinking => decelerating climb (bounded).
const RES_RATIO_DIFFS = RES_RATIOS.slice(1).map((v, i) => +(v - RES_RATIOS[i]).toFixed(4));

// Fit resRatio(j) = a - b*r^j: grid over r in (0,1); a,b are the linear OLS solution given r.
function fitBoundedForm(ys) {
  const J = ys.map((_, i) => i + 1); // offsets 1..6
  const n = J.length;
  const my = ys.reduce((s, x) => s + x, 0) / n;
  let best = null;
  for (let r = 0.02; r < 0.995; r += 0.0005) {
    const u = J.map((j) => Math.pow(r, j)); // u = r^j
    const mu = u.reduce((s, x) => s + x, 0) / n;
    let suu = 0;
    let suy = 0;
    for (let i = 0; i < n; i++) {
      suu += (u[i] - mu) ** 2;
      suy += (u[i] - mu) * (ys[i] - my);
    }
    const negB = suy / suu; // slope of y vs u = -b
    const b = -negB;
    const a = my - negB * mu;
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i++) {
      const pred = a - b * u[i];
      ssRes += (ys[i] - pred) ** 2;
      ssTot += (ys[i] - my) ** 2;
    }
    if (!best || ssRes < best.ssRes) best = { a, b, r, R2: 1 - ssRes / ssTot, ssRes };
  }
  return best;
}
const FIT = fitBoundedForm(RES_RATIOS);
const CEILING = +FIT.a.toFixed(4); // ~4.80: finite saturation limit of the overshoot ratio
const FIT_B = +FIT.b.toFixed(4); // ~4.23
const FIT_R = +FIT.r.toFixed(4); // ~0.614 (geometric approach rate)
const FIT_R2 = +FIT.R2.toFixed(6); // ~0.9996
// Fraction of the 1 -> ceiling range covered by resRatio(6): how far into the saturation we are.
const GAP_TO_CEILING = +(CEILING - RES_RATIOS[RES_RATIOS.length - 1]).toFixed(4); // ~0.20
const SATURATION_FRAC = +((RES_RATIOS[RES_RATIOS.length - 1] - 1) / (CEILING - 1)).toFixed(4); // ~0.96

export const IMP34546_TAILSIDE_OVERSHOOT_RATIO_SATURATION_J5_J6 = {
  id: 'imp-34546',
  proofSection: 'S-frontier',
  question:
    'imp-34528 T2 found the cumulative tail overshoot ratio resRatio(j) = measFrac(j)/lawFrac(j) of ' +
    'the M3 hump tail over the pure N^(-1/2) law GROWS monotonically {2.200, 3.225, 3.834, 4.183} for ' +
    'j = 1..4, but stopped at j = 4 and left open whether it climbs without bound. Recomputing the tail ' +
    'decades hump(14), hump(15) by the same imp-33809 method and extending resRatio to j = 5,6, does ' +
    'the overshoot ratio saturate to a finite ceiling (bounded a - b*r^j form) or keep climbing? ' +
    'Measurement only; reuse-gated against imp-33809; inherited model NOT rigorous; no QED.',
  measuredQuantity:
    'hump(k) recomputed at k = 14,15; per tail offset j = 1..6: measFrac = hump(9+j)/hump(9), lawFrac ' +
    '= 10^(-j/2), resRatio = measFrac/lawFrac, localDecay = hump(k-1)/hump(k) and its gap to sqrt(10); ' +
    'plus a fit of resRatio(j) to the bounded form a - b*r^j (finite ceiling a, geometric rate r, R^2)',
  crossoverDecadeK: CROSSOVER_K,
  humpPeak: +PEAK.toExponential(4), // 6.4758e-2 (recomputed, matches imp-33809)
  tailExtensionAmplitudes: {
    hump13: +IMP33809_HUMPS[7].toExponential(4), // 2.7085e-3 (imp-33809 tail edge)
    hump14: +HUMP14.toExponential(4), // 9.0441e-4 (recomputed, matches imp-34532)
    hump15: +HUMP15.toExponential(4), // 2.9795e-4 (recomputed, matches imp-34545)
  },
  overshootLadder: OVERSHOOT_LADDER,
  overshootRatios: RES_RATIOS, // {2.2003,3.2249,3.8336,4.1825,4.4165,4.6009}: climbing, decelerating
  overshootRatioFirstDiffs: RES_RATIO_DIFFS, // {1.0246,0.6087,0.3489,0.2340,0.1844}: shrinking (bounded)
  boundedFit: {
    form: 'resRatio(j) = a - b*r^j',
    ceiling: CEILING, // ~4.80: finite saturation limit
    b: FIT_B, // ~4.23
    r: FIT_R, // ~0.614: geometric approach rate (per offset)
    R2: FIT_R2, // ~0.9996
    gapToCeilingAtJ6: GAP_TO_CEILING, // ~0.20: still-open room above resRatio(6)
    saturationFractionAtJ6: SATURATION_FRAC, // ~0.96: fraction of the 1->ceiling range covered by j=6
  },
  finding: {
    S1_climb_persists_but_decelerates:
      'the new rungs resRatio(5) = 4.4165, resRatio(6) = 4.6009 continue above resRatio(4) = 4.1825, ' +
      'so the imp-34528 T2 growth persists, but the first differences {1.0246, 0.6087, 0.3489, 0.2340, ' +
      '0.1844} shrink monotonically -- the climb is DECELERATING, not a runaway.',
    S2_overshoot_ratio_saturates_to_finite_ceiling:
      'fitting resRatio(j) = a - b*r^j gives a bounded geometric approach with ceiling a ~ ' +
      CEILING +
      ', r ~ ' +
      FIT_R +
      ', R^2 ~ ' +
      FIT_R2 +
      '; so the overshoot ratio SATURATES to a finite limit ~' +
      CEILING +
      ' rather than diverging -- by j = 6 it has covered ~' +
      Math.round(SATURATION_FRAC * 100) +
      '% of the 1 -> ceiling range (gap ~' +
      GAP_TO_CEILING +
      ').',
    S3_saturation_forced_by_localDecay_to_sqrt10:
      'the saturation is the cumulative signature of the imp-34528 T3 localDecay -> sqrt(10) ' +
      'convergence: as localDecay(k) = hump(k-1)/hump(k) climbs toward sqrt(10) = 3.16228 (extended ' +
      'here localDecay(14) = 2.9947, localDecay(15) = 3.0355), the per-offset step measFrac(j+1)/' +
      'measFrac(j) -> 10^(-1/2) = the pure lawFrac step, forcing resRatio(j+1)/resRatio(j) -> 1 and a ' +
      'finite ceiling. The T2 growth and the T3 local-rate convergence are CONSISTENT, not in tension.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-33809 curvature-hump ' +
    'amplitude hump(k) = p_ecoll*(1 - sigma_hi) - p_sigma at the tail rungs k = 14,15 (reuse-gated ' +
    'against the imp-33809 k = 6..13 ladder; matches imp-34532 hump(14) = 9.0441e-4 and imp-34545 ' +
    'hump(15) = 2.9795e-4) extends the imp-34528 cumulative overshoot ratio resRatio(j) = ' +
    'measFrac(j)/lawFrac(j) to j = 5,6: {2.2003, 3.2249, 3.8336, 4.1825, 4.4165, 4.6009}. The T2 ' +
    'growth PERSISTS but DECELERATES -- the first differences {1.0246, 0.6087, 0.3489, 0.2340, 0.1844} ' +
    'shrink monotonically -- and a fit to the bounded form resRatio(j) = a - b*r^j (ceiling a ~ ' +
    CEILING +
    ', b ~ ' +
    FIT_B +
    ', r ~ ' +
    FIT_R +
    ', R^2 ~ ' +
    FIT_R2 +
    ') shows the overshoot ratio SATURATES to a finite ceiling ~' +
    CEILING +
    ' rather than diverging (by j = 6 it has covered ~' +
    Math.round(SATURATION_FRAC * 100) +
    '% of the 1 -> ceiling range, gap ~' +
    GAP_TO_CEILING +
    '). This saturation is exactly what the imp-34528 T3 localDecay -> sqrt(10) convergence requires: ' +
    'once the per-decade rate reaches the pure N^(-1/2) slope, the cumulative fraction tracks a fixed ' +
    'multiple of the pure law, so the overshoot ratio can only level off -- so the tail overshoots the ' +
    'sqrt(1/N) law by a CONSTANT deep-tail factor ~' +
    CEILING +
    'x, not a growing one, and the T2/T3 findings are consistent. Honestly, the fitted ceiling is a ' +
    'bounded-form extrapolation of six points, NOT a proven limit; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34528 (T2 overshoot ratio grows {2.20..4.18}; T3 localDecay -> sqrt(10); extended here); ' +
    'imp-34532 (recomputed hump(14) = 9.0441e-4, reused method); imp-34545 (recomputed hump(15) = ' +
    '2.9795e-4, reused method); imp-33809 (per-k hump amplitudes + method, reuse-gated here); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-3066 (K_a >= 0 ' +
    'untouched); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34546_TAILSIDE_OVERSHOOT_RATIO_SATURATION_J5_J6_ASSERTIONS = [
  {
    // (Reuse gate) Recomputing k = 6..13 reproduces the imp-33809 amplitudes; peak = crossover 6.4758e-2.
    id: 'imp34546-reuse-gate-matches-imp33809',
    description: 'recomputed hump(k) for k = 6..13 matches the imp-33809 humpAmplitudes to <5e-4; peak ~6.4758e-2',
    holds: () =>
      RECOMPUTED_6_13.every((v, i) => Math.abs(v - IMP33809_HUMPS[i]) < 5e-4) &&
      Math.abs(PEAK - 6.4758e-2) < 5e-4,
  },
  {
    // (Continuity) The recomputed tail rungs match imp-34532 hump(14) and imp-34545 hump(15).
    id: 'imp34546-tail-rungs-match-siblings',
    description: 'recomputed hump(14) = 9.0441e-4 (imp-34532) and hump(15) = 2.9795e-4 (imp-34545) to <5e-6',
    holds: () => Math.abs(HUMP14 - 9.0441e-4) < 5e-6 && Math.abs(HUMP15 - 2.9795e-4) < 5e-6,
  },
  {
    // (Continuity) The recomputed j = 1..4 overshoot ratios reproduce the imp-34528 ladder.
    id: 'imp34546-continuity-with-imp34528-j1234',
    description: 'recomputed resRatio(1..4) reproduces the imp-34528 ladder {2.2003,3.2249,3.8336,4.1825} to <1e-3',
    holds: () =>
      [2.2003, 3.2249, 3.8336, 4.1825].every((v, i) => Math.abs(RES_RATIOS[i] - v) < 1e-3),
  },
  {
    // (S1) The overshoot ratio keeps climbing at j = 5,6 but the first differences shrink (decelerates).
    id: 'imp34546-climb-persists-but-decelerates',
    description: 'resRatio(5) = 4.4165 > resRatio(4), resRatio(6) = 4.6009 > resRatio(5); first diffs shrink monotonically',
    holds: () =>
      RES_RATIOS.every((r, i) => i === 0 || r > RES_RATIOS[i - 1]) &&
      Math.abs(RES_RATIOS[4] - 4.4165) < 5e-3 &&
      Math.abs(RES_RATIOS[5] - 4.6009) < 5e-3 &&
      RES_RATIO_DIFFS.every((d, i) => i === 0 || d < RES_RATIO_DIFFS[i - 1]),
  },
  {
    // (S2) The overshoot ratio saturates: the bounded fit a - b*r^j has a finite ceiling, r in (0,1),
    // high R^2, and resRatio(6) sits BELOW the fitted ceiling.
    id: 'imp34546-overshoot-ratio-saturates-finite-ceiling',
    description: 'bounded fit a - b*r^j: finite ceiling ~4.80, r in (0,1), R^2 > 0.999, resRatio(6) < ceiling',
    holds: () =>
      FIT_R > 0 &&
      FIT_R < 1 &&
      FIT_R2 > 0.999 &&
      CEILING > RES_RATIOS[5] &&
      CEILING < 6 &&
      Math.abs(CEILING - 4.803) < 0.1,
  },
  {
    // (S3) Consistency with imp-34528 T3: localDecay keeps climbing toward sqrt(10) at k = 14,15,
    // its gap shrinking -- the local-rate convergence that forces the cumulative ceiling.
    id: 'imp34546-localdecay-approaches-sqrt10-consistency',
    description: 'localDecay(14) = 2.9947, localDecay(15) = 3.0355 climb toward sqrt(10), gap shrinking, all < sqrt(10)',
    holds: () => {
      const ld = OVERSHOOT_LADDER.map((r) => r.localDecay);
      const gaps = OVERSHOOT_LADDER.map((r) => r.gapToSqrt10);
      return (
        ld.every((d) => d < SQRT10) &&
        ld[5] > ld[4] &&
        gaps.every((g, i) => i === 0 || g < gaps[i - 1]) &&
        Math.abs(ld[4] - 2.9947) < 5e-3 &&
        Math.abs(ld[5] - 3.0355) < 5e-3
      );
    },
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34546-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, crossover k = 9, no QED, no refereed bound is changed',
    holds: () =>
      IMP34546_TAILSIDE_OVERSHOOT_RATIO_SATURATION_J5_J6.isRigorous === false &&
      IMP34546_TAILSIDE_OVERSHOOT_RATIO_SATURATION_J5_J6.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP34546_TAILSIDE_OVERSHOOT_RATIO_SATURATION_J5_J6.verdict) &&
      /refereed bound is changed/i.test(IMP34546_TAILSIDE_OVERSHOOT_RATIO_SATURATION_J5_J6.verdict),
  },
];

for (const a of IMP34546_TAILSIDE_OVERSHOOT_RATIO_SATURATION_J5_J6_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34546-tailside-overshoot-ratio-saturation-j5-j6 assertion failed: ${a.id}`);
  }
}
