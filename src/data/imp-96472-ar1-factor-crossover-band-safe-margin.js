/**
 * imp-96472 -- MEASURE the imp-96128 AR-1 effective factor and the safe-side margin to the
 * sign-forbidden flip threshold rho_crit = 0.5744 across the imp-96430/imp-96444 corroboration-reach
 * crossover band [1.3e12, 2.5e12], the heights where independent numerical corroboration ends.
 *
 * WHAT WAS NEVER TABULATED. imp-96312 cross-validated rho_exact at the single Platt-Trudgian verified
 * height T = 3e12 (rho = -0.4817670, AR-1 factor f = 2.859, safe by 1.056 rho-units to rho_crit = 0.5744).
 * imp-96430 places the basis-C corroboration-reach crossover band -- where the L-linear cancellation floor
 * overtakes the |rho + 1/2| rigidity signal -- at [~1.3e12, ~2.5e12], de-jittered by imp-96444 to
 * [1.38e12, 1.76e12]. Neither rho_exact, the deviation |rho + 1/2|, the AR-1 factor, nor the safe-side
 * margin to rho_crit was ever tabulated inside this band; only the 3e12 anchor above it and the census
 * heights 1e4..5e5 far below it. This module evaluates the same closed forms
 * rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 and f = (1 - rho)/(1 + rho) at the band edges and the
 * de-jittered interior, confirming whether the anti-correlation safe-side verdict persists (deepens) all
 * the way to the corroboration-reach ceiling.
 *
 * FINDINGS.
 *  1. THE SAFE-SIDE VERDICT PERSISTS AND DEEPENS ACROSS THE WHOLE BAND. rho_exact strengthens
 *     monotonically from -0.4813252 at T = 1.3e12 to -0.4816726 at T = 2.5e12, never leaving the
 *     anti-correlated (negative) regime. The deviation |rho + 1/2| shrinks from 0.0186748 to 0.0183274 --
 *     the correlation crawls toward the -1/2 rigidity limit but never reaches within 1e-2 of it inside the
 *     band, exactly as at the 3e12 anchor (0.0182330).
 *  2. THE AR-1 EFFECTIVE FACTOR RISES MONOTONICALLY, STAYING WELL ABOVE 1. f = (1 - rho)/(1 + rho) climbs
 *     from 2.855981 at 1.3e12 to 2.858565 at 2.5e12, dovetailing continuously into the 3e12 anchor value
 *     2.859268: the anti-correlation RAISES the effective independent count at every band height, never
 *     lowers it.
 *  3. THE SAFE-SIDE MARGIN TO THE FLIP THRESHOLD WIDENS. The gap rho_crit - rho_exact grows from 1.055755
 *     at 1.3e12 to 1.056103 at 2.5e12 (1.056197 at the 3e12 anchor). The correlation sits a full ~1.056 in
 *     rho units on the safe side of the sign-forbidden positive flip threshold rho_crit = 0.5744, and moves
 *     FARTHER from it (not toward it) as height rises through the corroboration-reach ceiling.
 *
 * INTERPRETATION. The crossover band that imp-96430/imp-96444 identify as the end of independent numerical
 * corroboration is, for the AR-1 anti-correlation quantity, uneventful: rho_exact, its deviation, the AR-1
 * factor, and the safe-side margin all vary smoothly and monotonically across [1.3e12, 2.5e12] and connect
 * continuously to the 3e12 PT anchor. The safe-side verdict of imp-96128/imp-96312 does not merely survive
 * to the corroboration-reach ceiling -- it deepens there.
 *
 * HONEST CAVEAT. rho_exact is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L(T); at these heights there are no computed Riemann zeros, so this is a
 * closed-form envelope evaluation, not a measurement of actual zeros. It changes no bound, establishes no
 * operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Across the imp-96430/imp-96444 corroboration-reach crossover band [1.3e12, 2.5e12], the imp-96128
 * AR-1 effective factor rises monotonically from 2.855981 to 2.858565 and the safe-side margin to the
 * sign-forbidden rho_crit = 0.5744 flip threshold widens from 1.055755 to 1.056103, with rho_exact deepening
 * from -0.4813252 to -0.4816726 (deviation |rho + 1/2| shrinking 0.0186748 -> 0.0183274 but never within 1e-2
 * of -1/2). The anti-correlation safe-side verdict of imp-96128/imp-96312 persists and DEEPENS all the way to
 * the corroboration-reach ceiling, connecting continuously to the 3e12 PT anchor (f = 2.859268, gap 1.056197).
 * Measurement/cross-validation only; theoretical GUE quantity, not real zeros; changes no bound; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96312-covariance-cross-validation-pt-anchor (the 3e12 anchor rho/AR-1/margin this band extends downward)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the union-identity covariance and safe-side verdict)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the [1.3e12,2.5e12] crossover band this module tabulates)
 * @see imp-96444-basis-c-floor-slope-dejitter (the [1.38e12,1.76e12] de-jittered interior)
 * @see imp-96350-covariance-outoffamily-crossvalidation (the genuine out-of-family corroboration of rho_exact)
 *
 * Import-light: no zeros bundle, no sibling imports. The sine-kernel number-variance and unfolded-length
 * formulas are re-derived verbatim from imp-96128/imp-96267/imp-96312 (the same closed form).
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;

// Formulas identical to imp-96128/imp-96267/imp-96312 (no re-import, to stay import-light).
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L zeros per box
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI); // Sigma^2(L)

const rhoExact = (L) => gueNumberVariance(2 * L) / (2 * gueNumberVariance(L)) - 1; // imp-96267 form
const twoIntervalCov = (L) => (gueNumberVariance(2 * L) - 2 * gueNumberVariance(L)) / 2; // imp-96128 form
const arEffectiveFactor = (rho) => (1 - rho) / (1 + rho);

const RHO_CRIT = 0.57443; // imp-96128 positive flip threshold (sign-forbidden for anti-correlated boxes)
const PT_HEIGHT = 3e12;

// Band edges [1.3e12, 2.5e12] plus the imp-96444 de-jittered interior [1.38e12, 1.76e12].
const BAND_HEIGHTS = [1.3e12, 1.38e12, 1.76e12, 2.5e12];

const row = (T) => {
  const L = envelopeCount(T);
  const varBox = gueNumberVariance(L);
  const cov = twoIntervalCov(L);
  const rho = rhoExact(L);
  const f = arEffectiveFactor(rho);
  return {
    T,
    zerosPerBox: L,
    varBox,
    cov,
    rho,
    deviation: Math.abs(rho - RIGIDITY_LIMIT), // |rho + 1/2|
    arFactor: f,
    gapToFlip: RHO_CRIT - rho, // safe-side margin to rho_crit
    withinEpsilon1e2: Math.abs(rho - RIGIDITY_LIMIT) < 1e-2,
  };
};

const bandRows = BAND_HEIGHTS.map(row);
const anchorRow = row(PT_HEIGHT);
const loEdge = bandRows[0]; // 1.3e12
const hiEdge = bandRows[bandRows.length - 1]; // 2.5e12

export const IMP96472_AR1_FACTOR_CROSSOVER_BAND_SAFE_MARGIN = {
  ticket: 'imp-96472',
  source:
    'imp-96312 reports the imp-96128 AR-1 factor and safe-side margin only at the PT anchor 3e12. imp-96430 places the basis-C corroboration-reach crossover band at [~1.3e12, ~2.5e12] (de-jittered to [1.38e12, 1.76e12] by imp-96444), heights where the L-linear cancellation floor overtakes the |rho+1/2| rigidity signal. This module evaluates rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 and f = (1-rho)/(1+rho) at the band edges and de-jittered interior for the first time. Cross-validation only; theoretical GUE quantity, not real zeros.',
  definitions: {
    rho: 'rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 (adjacent-box count correlation)',
    deviation: '|rho_exact - (-1/2)|: distance to the GUE-rigidity limit',
    arFactor: 'f = (1 - rho)/(1 + rho): imp-96128 AR-1 effective-independent factor',
    gapToFlip: 'rho_crit - rho_exact: safe-side margin to the sign-forbidden positive flip threshold',
  },
  rigidityLimit: RIGIDITY_LIMIT,
  rhoCritFlip: RHO_CRIT,
  crossoverBand: { lo: 1.3e12, hi: 2.5e12, dejitteredLo: 1.38e12, dejitteredHi: 1.76e12 },
  bandRows, // per-height rho / deviation / AR-1 factor / safe-side margin
  plattTrudgianAnchor: anchorRow, // 3e12 continuation reference (matches imp-96312)
  monotonic: {
    rhoDeepens: hiEdge.rho < loEdge.rho, // -0.4816726 < -0.4813252
    deviationShrinks: hiEdge.deviation < loEdge.deviation, // 0.0183274 < 0.0186748
    arFactorRises: hiEdge.arFactor > loEdge.arFactor, // 2.858565 > 2.855981
    marginWidens: hiEdge.gapToFlip > loEdge.gapToFlip, // 1.056103 > 1.055755
    connectsToAnchor: anchorRow.arFactor > hiEdge.arFactor, // 2.859268 > 2.858565 (continuous into 3e12)
  },
  caveat:
    'rho_exact is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L(T); at these heights there are no computed Riemann zeros, so this evaluates the closed-form envelope, not actual zeros. It changes no bound and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Across the imp-96430/imp-96444 corroboration-reach crossover band [1.3e12, 2.5e12], the imp-96128 AR-1 effective factor rises monotonically from 2.855981 to 2.858565 and the safe-side margin to the sign-forbidden rho_crit = 0.5744 flip threshold widens from 1.055755 to 1.056103, with rho_exact deepening from -0.4813252 to -0.4816726 (deviation |rho + 1/2| shrinking 0.0186748 -> 0.0183274 but never within 1e-2 of -1/2). The anti-correlation safe-side verdict of imp-96128/imp-96312 persists and DEEPENS to the corroboration-reach ceiling, connecting continuously to the 3e12 PT anchor (f = 2.859268, gap 1.056197). Measurement/cross-validation only; theoretical GUE quantity, not real zeros; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // band edges reproduce the computed values
  if (!approx(loEdge.rho, -0.4813252, 1e-6)) throw new Error('imp-96472: 1.3e12 rho drifted');
  if (!approx(hiEdge.rho, -0.4816726, 1e-6)) throw new Error('imp-96472: 2.5e12 rho drifted');
  if (!approx(loEdge.arFactor, 2.855981, 1e-5)) throw new Error('imp-96472: 1.3e12 AR-1 factor drifted');
  if (!approx(hiEdge.arFactor, 2.858565, 1e-5)) throw new Error('imp-96472: 2.5e12 AR-1 factor drifted');
  if (!approx(loEdge.gapToFlip, 1.055755, 1e-5)) throw new Error('imp-96472: 1.3e12 safe-side margin drifted');
  if (!approx(hiEdge.gapToFlip, 1.056103, 1e-5)) throw new Error('imp-96472: 2.5e12 safe-side margin drifted');

  // anchor continuation matches imp-96312
  if (!approx(anchorRow.rho, -0.481767, 1e-5)) throw new Error('imp-96472: 3e12 anchor rho drifted from imp-96312');
  if (!approx(anchorRow.arFactor, 2.859268, 1e-5)) throw new Error('imp-96472: 3e12 anchor AR-1 factor drifted');

  // monotone deepening / widening across the band
  if (!(hiEdge.rho < loEdge.rho)) throw new Error('imp-96472: rho should deepen across the band');
  if (!(hiEdge.deviation < loEdge.deviation)) throw new Error('imp-96472: deviation should shrink across the band');
  if (!(hiEdge.arFactor > loEdge.arFactor)) throw new Error('imp-96472: AR-1 factor should rise across the band');
  if (!(hiEdge.gapToFlip > loEdge.gapToFlip)) throw new Error('imp-96472: safe-side margin should widen across the band');

  // every band height stays anti-correlated, safe-side, and outside 1e-2 of -1/2
  for (const r of bandRows) {
    if (!(r.rho < 0)) throw new Error('imp-96472: band rho should be negative (anti-correlated)');
    if (r.withinEpsilon1e2) throw new Error('imp-96472: band should NOT reach within 1e-2 of -1/2');
    if (!(r.arFactor > 2.5)) throw new Error('imp-96472: band AR-1 factor should exceed 2.5');
    if (!(r.gapToFlip > 1)) throw new Error('imp-96472: band should stay >1 rho-unit safe of the flip threshold');
    if (!(RHO_CRIT > 0 && r.rho < 0)) throw new Error('imp-96472: flip needs positive rho; exact rho is negative');
  }

  // continuous into the 3e12 anchor (verdict connectivity claim)
  if (!(anchorRow.arFactor > hiEdge.arFactor)) throw new Error('imp-96472: anchor should continue above the band ceiling');

  // honesty gates
  if (!/NO QED/.test(IMP96472_AR1_FACTOR_CROSSOVER_BAND_SAFE_MARGIN.verdict))
    throw new Error('imp-96472: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96472_AR1_FACTOR_CROSSOVER_BAND_SAFE_MARGIN.verdict))
    throw new Error('imp-96472: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96472_AR1_FACTOR_CROSSOVER_BAND_SAFE_MARGIN;
