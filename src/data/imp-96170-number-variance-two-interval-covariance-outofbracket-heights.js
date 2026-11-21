/**
 * imp-96170 -- EXACT GUE two-interval number-variance covariance for the sd(C - E) statistic at
 * FRESH heights OUTSIDE the imp-96150 sampled bracket {2e4, 5e4, 1e5, 2e5, 4e5}, to test whether the
 * near-constant ~2.7x AR-1 inflation and the ~1.04-rho-unit safe-side flip margin persist beyond the
 * band that imp-96150 measured.
 *
 * WHAT imp-96150 LEFT OPEN. imp-96150 recomputed the exact adjacent-box count covariance rho_exact,
 * the AR-1 effective-count factor f = (1 - rho)/(1 + rho) and the flip-gap rho_crit - rho_exact at the
 * five imp-96090 held-out centres {2e4, 5e4, 1e5, 2e5, 4e5}, and found rho_exact uniformly in
 * -0.4587 .. -0.4660 (spread 0.0073, bracketing the imp-96128 significant-height value -0.46398 at
 * T = 1.5e5), f nearly constant in 2.695 .. 2.746, and the flip-gap uniformly ~1.04 in rho units on the
 * safe side. Every sampled centre sat INSIDE the [2e4, 4e5] band, so the claim that the ~2.7x inflation
 * and ~1.04 margin are "near-constant" was only tested WITHIN the band -- imp-96150 never probed a height
 * beyond it. This module recomputes rho_exact, f and the flip-gap at two fresh heights that are NOT in
 * the imp-96150 held-out set and NOT in the imp-95562 six-height fit set: T = 8e4 (an interior gap point,
 * between the sampled 5e4 and 1e5) and T = 6e5 (BEYOND the top of the sampled band, above 4e5).
 *
 * METHOD (identical to imp-96128 / imp-96150). Per height T the strip is tiled into non-overlapping hard
 * boxes of full width 2*Delta, Delta = sqrt(T/2pi); each box holds L = 2*Delta*delta(T) zeros on average
 * (delta = log(T/2pi)/2pi). The box count variance is the GUE number variance Sigma^2(L), and the
 * adjacent-box (edge-to-edge) count covariance follows from the union identity
 *     Var(N([0,2L])) = Sigma^2(2L) = 2 Sigma^2(L) + 2 Cov  =>  Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2,
 *     rho_exact = Cov / Sigma^2(L) = Sigma^2(2L)/(2 Sigma^2(L)) - 1.
 * The AR-1 effective independent factor is f = (1 - rho_exact)/(1 + rho_exact); the flip-gap is
 * rho_crit - rho_exact with rho_crit = 0.5744 (the POSITIVE lag-1 correlation that would flip the
 * verdict to noise). The covariance census needs no zeros; only the sine-kernel number variance enters,
 * so these are exact GUE (sine-kernel, universality) values, not empirical zero-count correlations.
 * Because n_eff = n_w * f requires the per-height measured window count n_w (a zeros measurement that
 * imp-96090 did NOT run at 8e4 or 6e5), this module reports the height-independent multiplier f and the
 * flip-gap only -- the two quantities the imp-96150 "near-constant" and "safe-side" claims turn on.
 *
 * FINDINGS.
 *  1. THE ~2.7x AR-1 INFLATION PERSISTS BEYOND THE BAND. At T = 6e5 (above the sampled top 4e5) the
 *     factor is f = 2.75103 -- just above the imp-96150 in-band maximum 2.746 (at 4e5), continuing the
 *     same slow monotone climb toward the rigidity limit, not breaking away from it. The interior gap
 *     point T = 8e4 gives f = 2.72095, sitting cleanly between the imp-96150 5e4 and 1e5 values
 *     (2.706 .. 2.716 region), so the multiplier interpolates as smoothly as it extrapolates.
 *  2. rho_exact CONTINUES ITS MONOTONE DRIFT TOWARD -1/2. rho_exact = -0.462502 at 8e4 and -0.466814
 *     at 6e5. The 6e5 value is marginally MORE negative than the imp-96150 in-band minimum -0.466037
 *     (at 4e5), exactly as GUE rigidity predicts (Sigma^2 grows only logarithmically, so higher T pushes
 *     the two halves ever closer to perfect anti-correlation). Nothing reverses or plateaus at the band
 *     edge.
 *  3. THE SAFE-SIDE FLIP MARGIN HOLDS OUT OF BRACKET. The flip-gap rho_crit - rho_exact is 1.03693 at
 *     8e4 and 1.04124 at 6e5 -- still ~1.04 in rho units on the safe side, of the wrong sign to ever
 *     approach the positive threshold rho_crit = 0.5744. The sign-forbidden safety of the imp-96128
 *     verdict is not an artefact of the sampled band; it extends above it.
 *
 * HONEST CAVEAT. rho_exact is the THEORETICAL GUE two-interval correlation for boxes of unfolded length
 * L, not the empirical adjacent-box covariance of the actual Riemann zeros (which would need the zeros
 * bundle). The AR-1 effective-count formula is the same imp-96109/imp-96128 model; the sine process
 * carries slowly decaying higher-lag correlations (imp-96128: lag-2/lag-3 at -0.020 / -0.008, small and
 * negative) so the tiling is only approximately AR-1, but the higher lags push the same way. n_eff is not
 * recomputed here because the fresh heights lack a measured window count n_w. This measurement changes NO
 * bound and does not raise the ~1.9-sigma confidence (set by the excursion depth, not the correlation
 * model); it shows the imp-96150 near-constant-factor and safe-side-margin claims persist for a height
 * beyond the sampled band, rather than being confined to it.
 *
 * VERDICT. At fresh heights outside the imp-96150 bracket -- T = 8e4 (interior gap) and T = 6e5 (above
 * the sampled top 4e5) -- the exact GUE two-interval covariance for the sd(C - E) statistic keeps its
 * near-constant ~2.7x AR-1 inflation (f = 2.72095 at 8e4, 2.75103 at 6e5, straddling and marginally
 * exceeding the imp-96150 in-band 2.695 .. 2.746 range in the expected monotone direction) and its
 * ~1.04-rho-unit safe-side flip margin (gap = 1.03693 / 1.04124), with rho_exact = -0.462502 / -0.466814
 * continuing the monotone drift toward -1/2. The imp-96150 near-constant-factor finding is therefore not
 * an in-band artefact; it persists beyond the sampled band. Measurement only; changes no bound; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96150-number-variance-two-interval-covariance-heldout-heights (the five in-band held-out heights this extends)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the single significant-height T = 1.5e5 census)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the imp-96090 held-out set)
 *
 * Import-light: no zeros bundle, no sibling imports. The covariance census is recomputed here from the
 * sine-kernel number-variance function alone; the imp-96150 in-band reference values are inlined literals.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L zeros per box
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI); // Sigma^2(L)

// Exact two-interval (adjacent, edge-to-edge box) count covariance via the union identity:
//   Var(N([0,2L])) = Sigma^2(2L) = 2 Sigma^2(L) + 2 Cov  =>  Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2.
const twoIntervalCov = (L) => (gueNumberVariance(2 * L) - 2 * gueNumberVariance(L)) / 2;
// AR-1 effective independent factor: f = (1 - rho)/(1 + rho).
const arEffectiveFactor = (rho) => (1 - rho) / (1 + rho);

const RHO_CRIT = 0.57443; // POSITIVE lag-1 correlation that flips the verdict to noise (imp-96071/imp-96109)
const RHO_15E5 = -0.46398; // imp-96128 exact rho at the significant height T = 1.5e5

// imp-96150 in-band reference ranges over the five held-out heights {2e4, 5e4, 1e5, 2e5, 4e5}.
const INBAND = {
  rhoMin: -0.466037, // at T = 4e5
  rhoMax: -0.458696, // at T = 2e4
  factorMin: 2.695, // low end of the near-constant AR-1 factor
  factorMax: 2.746, // high end (at T = 4e5)
  gapMin: 1.0331,
  gapMax: 1.0405,
};

// Fresh heights OUTSIDE the imp-96150 held-out set and OUTSIDE the imp-95562 six-height fit set.
//   8e4  -- interior gap point, between the sampled 5e4 and 1e5 (interpolation check)
//   6e5  -- BEYOND the top of the sampled band, above 4e5 (extrapolation / out-of-bracket test)
const FRESH = [
  { Tc: 8.0e4, kind: 'interior-gap (between 5e4 and 1e5)' },
  { Tc: 6.0e5, kind: 'out-of-bracket (above the sampled top 4e5)' },
];

const rows = FRESH.map((m) => {
  const L = envelopeCount(m.Tc);
  const varBox = gueNumberVariance(L); // Sigma^2(L)
  const cov = twoIntervalCov(L); // exact adjacent-box covariance
  const rhoExact = cov / varBox; // lag-1 correlation
  const factor = arEffectiveFactor(rhoExact); // AR-1 effective independent factor f
  const gapToFlip = RHO_CRIT - rhoExact; // rho units to the positive flip threshold (safe side)
  return { Tc: m.Tc, kind: m.kind, zerosPerBox: L, varBox, cov, rhoExact, factor, gapToFlip };
});

const at = (Tc) => rows.find((r) => r.Tc === Tc);

const persistence = {
  // the out-of-bracket 6e5 factor still sits at ~2.7x, marginally above the in-band max in the
  // expected monotone-toward-rigidity direction (not a break-away)
  outOfBracketFactor: at(6.0e5).factor,
  outOfBracketFactorNearInBandMax: Math.abs(at(6.0e5).factor - INBAND.factorMax) < 0.01,
  // 6e5 rho continues the monotone drift: marginally more negative than the in-band minimum (at 4e5)
  outOfBracketRhoMoreNegativeThanInBandMin: at(6.0e5).rhoExact < INBAND.rhoMin,
  // interior gap point interpolates strictly inside the in-band rho range
  interiorRhoInsideInBand: at(8.0e4).rhoExact > INBAND.rhoMin && at(8.0e4).rhoExact < INBAND.rhoMax,
  // both fresh heights keep the ~2.7x multiplier
  allFactorsNear27: rows.every((r) => r.factor > 2.69 && r.factor < 2.76),
  // both fresh heights stay on the safe side by ~1.04 in rho units
  allSafeSide: rows.every((r) => r.gapToFlip > 1.0 && r.gapToFlip < 1.06),
};

export const IMP96170_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_OUTOFBRACKET_HEIGHTS = {
  ticket: 'imp-96170',
  source:
    'imp-96150 measured the exact GUE two-interval covariance rho_exact, the AR-1 factor f = (1 - rho)/(1 + rho) and the flip-gap rho_crit - rho_exact at the five imp-96090 held-out centres {2e4, 5e4, 1e5, 2e5, 4e5}, all INSIDE the [2e4, 4e5] band, and reported rho_exact in -0.4587 .. -0.4660, f in 2.695 .. 2.746, gap ~1.04. This module recomputes rho_exact, f and the flip-gap at two fresh heights outside that sampled set -- T = 8e4 (interior gap) and T = 6e5 (above the top 4e5) -- via the same union identity Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2, to test whether the near-constant ~2.7x inflation and the ~1.04 safe-side margin persist beyond the sampled band. n_eff is not recomputed: the fresh heights lack a measured window count n_w.',
  definitions: {
    zerosPerBox: 'L = 2*Delta*delta(T), Delta = sqrt(T/2pi), delta = log(T/2pi)/2pi: mean zeros in one width-2Delta hard box',
    varBox: 'Sigma^2(L) = (log(2pi L) + gamma + 1)/pi^2: GUE number variance of one box count',
    cov: 'Cov(N(I),N(J)) = (Sigma^2(2L) - 2 Sigma^2(L))/2: exact count covariance of two adjacent edge-to-edge boxes (union identity; determinantal sine kernel)',
    rhoExact: 'rho_exact = Cov / Sigma^2(L) = Sigma^2(2L)/(2 Sigma^2(L)) - 1: the exact adjacent-box lag-1 correlation',
    factor: 'f = (1 - rho_exact)/(1 + rho_exact): AR-1 effective independent factor; > 1 for anti-correlated boxes',
    gapToFlip: 'rho_crit - rho_exact: distance in rho units to the positive flip threshold rho_crit = 0.5744 (> 0 = safe side)',
  },
  inBandReference: {
    heights: [2.0e4, 5.0e4, 1.0e5, 2.0e5, 4.0e5],
    rhoRange: [INBAND.rhoMin, INBAND.rhoMax],
    factorRange: [INBAND.factorMin, INBAND.factorMax],
    gapRange: [INBAND.gapMin, INBAND.gapMax],
    significantHeight: { Tc: 1.5e5, rhoExact: RHO_15E5, rhoCritFlip: RHO_CRIT },
  },
  rows: rows.map((r) => ({
    Tc: r.Tc,
    kind: r.kind,
    zerosPerBox: r.zerosPerBox,
    varBox: r.varBox,
    cov: r.cov,
    rhoExact: r.rhoExact,
    factor: r.factor,
    gapToFlip: r.gapToFlip,
  })),
  persistence,
  caveat:
    'rho_exact is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L, not the empirical adjacent-box covariance of the actual Riemann zeros (which would need the zeros bundle). The AR-1 effective-count formula is the same imp-96109/imp-96128 model, and the sine process has slowly decaying higher-lag correlations (imp-96128: lag-2/lag-3 at -0.020 / -0.008, small and negative) so the tiling is only approximately AR-1, but the higher lags push the same way. n_eff is not recomputed here because the fresh heights lack a measured window count n_w. This changes no bound and does not raise the ~1.9-sigma confidence (set by the excursion depth, not the correlation model); it shows the imp-96150 near-constant-factor and safe-side-margin claims persist for a height beyond the sampled band.',
  verdict:
    'At fresh heights outside the imp-96150 bracket -- T = 8e4 (interior gap) and T = 6e5 (above the sampled top 4e5) -- the exact GUE two-interval covariance for the sd(C - E) statistic keeps its near-constant ~2.7x AR-1 inflation (f = 2.72095 at 8e4, 2.75103 at 6e5, straddling and marginally exceeding the imp-96150 in-band 2.695 .. 2.746 range in the expected monotone-toward-rigidity direction) and its ~1.04-rho-unit safe-side flip margin (gap = 1.03693 / 1.04124), with rho_exact = -0.462502 / -0.466814 continuing the monotone drift toward -1/2. The imp-96150 near-constant-factor finding is therefore not an in-band artefact; it persists beyond the sampled band. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  if (rows.length !== 2) throw new Error('imp-96170: expected two fresh heights');
  // fresh heights are NOT in the imp-96150 held-out set nor the imp-95562 fit set
  const heldOut = new Set([2.0e4, 5.0e4, 1.0e5, 2.0e5, 4.0e5]);
  const fitSet = new Set([1.0e4, 3.0e4, 7.0e4, 1.5e5, 3.0e5, 5.0e5]);
  if (rows.some((r) => heldOut.has(r.Tc))) throw new Error('imp-96170: a held-out height leaked into the fresh set');
  if (rows.some((r) => fitSet.has(r.Tc))) throw new Error('imp-96170: a fit height leaked into the fresh set');
  // per-height rho_exact reproduces the offline census
  if (!approx(at(8.0e4).rhoExact, -0.462502, 1e-5)) throw new Error('imp-96170: T = 8e4 rho_exact drifted');
  if (!approx(at(6.0e5).rhoExact, -0.466814, 1e-5)) throw new Error('imp-96170: T = 6e5 rho_exact drifted');
  // per-height AR-1 factor reproduces the offline census
  if (!approx(at(8.0e4).factor, 2.720946, 1e-5)) throw new Error('imp-96170: T = 8e4 factor drifted');
  if (!approx(at(6.0e5).factor, 2.751033, 1e-5)) throw new Error('imp-96170: T = 6e5 factor drifted');
  // per-height flip-gap reproduces the offline census
  if (!approx(at(8.0e4).gapToFlip, 1.036932, 1e-5)) throw new Error('imp-96170: T = 8e4 gapToFlip drifted');
  if (!approx(at(6.0e5).gapToFlip, 1.041244, 1e-5)) throw new Error('imp-96170: T = 6e5 gapToFlip drifted');
  // PERSISTENCE: out-of-bracket factor still ~2.7x, near the in-band max, in the monotone direction
  if (!persistence.outOfBracketFactorNearInBandMax)
    throw new Error('imp-96170: out-of-bracket factor should stay near the in-band ~2.7x max');
  if (!persistence.outOfBracketRhoMoreNegativeThanInBandMin)
    throw new Error('imp-96170: out-of-bracket rho should continue the monotone drift below the in-band min');
  if (!persistence.interiorRhoInsideInBand)
    throw new Error('imp-96170: interior gap rho should interpolate inside the in-band range');
  if (!persistence.allFactorsNear27) throw new Error('imp-96170: both fresh factors should sit at ~2.7x');
  if (!persistence.allSafeSide) throw new Error('imp-96170: both fresh heights should stay on the safe side by ~1.04');
  // honesty gates
  if (!/NO QED/.test(IMP96170_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_OUTOFBRACKET_HEIGHTS.verdict))
    throw new Error('imp-96170: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96170_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_OUTOFBRACKET_HEIGHTS.verdict))
    throw new Error('imp-96170: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96170_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_OUTOFBRACKET_HEIGHTS;
