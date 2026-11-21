/**
 * imp-96150 -- EXACT GUE two-interval number-variance covariance for the sd(C - E) statistic
 * at the FIVE imp-96090 genuinely held-out heights {2e4, 5e4, 1e5, 2e5, 4e5}, extending the
 * imp-96128 single-height census (T = 1.5e5 only) to test whether the anti-correlation rho_exact
 * and its n_eff inflation are UNIFORM across heights or height-specific.
 *
 * WHAT imp-96128 LEFT OPEN. imp-96128 computed the exact adjacent-box count covariance for the
 * sd(C - E) statistic via the union identity Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2 and found
 * rho_exact = -0.46398 at the significant height T = 1.5e5, near the GUE-rigidity value -1/2 and
 * opposite in sign to the imp-96109 O(1/L) proxy. That anti-correlation raises the AR-1 effective
 * independent count from n_w = 291 to n_eff ~ 795 (factor f = 2.731) and sits a full 1.04 in rho
 * units on the safe side of the sign-forbidden flip threshold rho_crit = 0.5744. imp-96128 evaluated
 * this at ONE height and reported the six-height rho_exact list only in prose; it did NOT tabulate
 * n_eff or the flip-gap across heights. This module recomputes rho_exact, the AR-1 factor, n_eff and
 * the flip-gap at the five imp-96090 held-out centres to check across-height uniformity.
 *
 * METHOD (identical to imp-96128). Per height T the strip is tiled into n_w non-overlapping hard
 * boxes of full width 2*Delta, Delta = sqrt(T/2pi); each box holds L = 2*Delta*delta(T) zeros on
 * average (delta = log(T/2pi)/2pi). The box count variance is the GUE number variance Sigma^2(L),
 * and the adjacent-box (edge-to-edge) count covariance follows from the union identity
 *     Var(N([0,2L])) = Sigma^2(2L) = 2 Sigma^2(L) + 2 Cov  =>  Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2,
 *     rho_exact = Cov / Sigma^2(L) = Sigma^2(2L)/(2 Sigma^2(L)) - 1.
 * The AR-1 effective independent factor is f = (1 - rho_exact)/(1 + rho_exact); n_eff = n_w * f. The
 * five centres and their window counts n_w are the imp-96090 held-out set (measured by the identical
 * imp-95562 band() tiling over the 10^6 Odlyzko ordinates); only the sine-kernel covariance census is
 * recomputed here -- no zeros are needed for the covariance itself.
 *
 * FINDINGS.
 *  1. rho_exact IS UNIFORM. Across all five held-out heights the exact adjacent-box correlation is
 *     strongly negative and near -1/2: rho_exact = -0.45870, -0.46131, -0.46304, -0.46461, -0.46604
 *     at T = 2e4, 5e4, 1e5, 2e5, 4e5 -- a total spread of only 0.0073 over ~1.3 decades, bracketing
 *     the imp-96128 significant-height value -0.46398 (T = 1.5e5). The correlation drifts monotonically
 *     (very slowly) toward -1/2 as T grows, exactly as GUE rigidity predicts (Sigma^2 grows only
 *     logarithmically, so doubling L barely raises the variance and forces the halves ever closer to
 *     perfect anti-correlation).
 *  2. THE n_eff INFLATION IS A NEARLY-CONSTANT FACTOR, NOT HEIGHT-SPECIFIC. The AR-1 factor
 *     f = (1 - rho)/(1 + rho) sits in 2.695 .. 2.746 across the five heights (imp-96128 measured
 *     f = 2.731 at T = 1.5e5): the 291 -> 795 inflation at the significant height is NOT a peculiarity
 *     of that height but the same ~2.7x multiplier that applies everywhere. Concretely n_eff =
 *     286, 456, 646, 919, 1304 at the five held-out heights (from n_w = 106, 168, 237, 336, 475): the
 *     growth of n_eff across heights is driven by the growing window count n_w, not by any change in
 *     the correlation-induced multiplier.
 *  3. THE SAFE-SIDE FLIP MARGIN HOLDS UNIFORMLY. The verdict flips only at a POSITIVE
 *     rho >= rho_crit = 0.5744; the exact correlation is negative at every height, so the gap
 *     rho_crit - rho_exact is 1.0331 .. 1.0405 across all five -- uniformly ~1.04 in rho units on the
 *     safe side and of the wrong sign to ever approach the threshold. The sign-forbidden safety of the
 *     imp-96128 verdict is therefore not a single-height accident; it holds across the whole accessible
 *     band.
 *
 * HONEST CAVEAT. rho_exact is the THEORETICAL GUE (sine-kernel, universality) two-interval
 * correlation for boxes of unfolded length L, not the empirical adjacent-box covariance of the actual
 * Riemann zeros (which would need the zeros bundle). The window counts n_w are the imp-96090 held-out
 * measurements; the AR-1 effective-count formula is the same imp-96109/imp-96128 model, and the sine
 * process carries slowly decaying higher-lag correlations (imp-96128 measured lag-2/lag-3 at -0.020 /
 * -0.008, small and negative) so the tiling is only approximately AR-1 -- but the higher lags push the
 * same way and raise n_eff further. This measurement changes NO bound and does not raise the ~1.9-sigma
 * confidence (set by the excursion depth, not the correlation model); it confirms the imp-96128
 * single-height finding is UNIFORM across the accessible height band rather than height-specific.
 *
 * VERDICT. Across the five imp-96090 held-out heights {2e4, 5e4, 1e5, 2e5, 4e5} the exact GUE
 * two-interval covariance for the sd(C - E) statistic is uniformly strongly anti-correlated
 * (rho_exact in -0.4587 .. -0.4660, spread 0.0073, bracketing the imp-96128 T = 1.5e5 value -0.46398),
 * the AR-1 n_eff inflation is a nearly-constant ~2.7x multiplier (f in 2.695 .. 2.746, not
 * height-specific), and the safe-side flip margin rho_crit - rho_exact holds uniformly at ~1.04 in rho
 * units. The imp-96128 significant-dip strengthening is UNIFORM across the accessible band, not a
 * single-height accident. Measurement only; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96128-number-variance-two-interval-covariance-exact (the single-height T = 1.5e5 census this extends)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the five held-out heights and window counts)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the significant-dip verdict)
 *
 * Import-light: no zeros bundle, no sibling imports. The five held-out window counts n_w are the
 * imp-96090 measured literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; the
 * covariance census is recomputed here from the sine-kernel number-variance function.
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
// AR-1 effective independent factor: n_eff = n_w (1 - rho)/(1 + rho).
const arEffectiveFactor = (rho) => (1 - rho) / (1 + rho);

const RHO_CRIT = 0.57443; // POSITIVE lag-1 correlation that flips the verdict to noise (imp-96071/imp-96109)
const RHO_15E5 = -0.46398; // imp-96128 exact rho at the significant height T = 1.5e5
const FACTOR_15E5 = 2.7312; // imp-96128 AR-1 factor at T = 1.5e5 (n_w 291 -> n_eff ~795)

// The five imp-96090 held-out heights and their measured non-overlapping window counts n_w
// (deterministic tiling geometry; the covariance census below needs no zeros).
const HELDOUT = [
  { Tc: 2.0e4, nWindows: 106 },
  { Tc: 5.0e4, nWindows: 168 },
  { Tc: 1.0e5, nWindows: 237 },
  { Tc: 2.0e5, nWindows: 336 },
  { Tc: 4.0e5, nWindows: 475 },
];

const rows = HELDOUT.map((m) => {
  const L = envelopeCount(m.Tc);
  const varBox = gueNumberVariance(L); // Sigma^2(L)
  const cov = twoIntervalCov(L); // exact adjacent-box covariance
  const rhoExact = cov / varBox; // lag-1 correlation
  const factor = arEffectiveFactor(rhoExact); // AR-1 effective independent factor
  const nEff = m.nWindows * factor;
  const gapToFlip = RHO_CRIT - rhoExact; // rho units to the positive flip threshold (safe side)
  return { Tc: m.Tc, nWindows: m.nWindows, zerosPerBox: L, varBox, cov, rhoExact, factor, nEff, gapToFlip };
});

const rhoValues = rows.map((r) => r.rhoExact);
const factorValues = rows.map((r) => r.factor);
const gapValues = rows.map((r) => r.gapToFlip);
const rhoSpread = Math.max(...rhoValues) - Math.min(...rhoValues);

const uniformity = {
  rhoMin: Math.min(...rhoValues),
  rhoMax: Math.max(...rhoValues),
  rhoSpread, // total range of rho_exact across the five held-out heights
  allAntiCorrelatedNearHalf: rhoValues.every((r) => r < -0.45 && r > -0.5),
  bracketsSignificantHeight: Math.min(...rhoValues) < RHO_15E5 && RHO_15E5 < Math.max(...rhoValues),
  factorMin: Math.min(...factorValues),
  factorMax: Math.max(...factorValues),
  factorNearlyConstant: Math.max(...factorValues) - Math.min(...factorValues) < 0.06, // ~2.7x everywhere
  gapMin: Math.min(...gapValues),
  gapMax: Math.max(...gapValues),
  allSafeSide: gapValues.every((g) => g > 1.0), // every height on the safe side by ~1.04 rho units
};

export const IMP96150_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_HELDOUT_HEIGHTS = {
  ticket: 'imp-96150',
  source:
    'imp-96128 computed the exact GUE two-interval covariance for the sd(C - E) statistic at T = 1.5e5 only (rho_exact = -0.46398, n_eff 291 -> 795). This module recomputes rho_exact, the AR-1 factor, n_eff and the flip-gap at the five imp-96090 held-out heights {2e4, 5e4, 1e5, 2e5, 4e5} via the same union identity Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2, to test whether the anti-correlation and its n_eff inflation are uniform across heights or height-specific. Window counts n_w: the imp-96090 measurements over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  definitions: {
    zerosPerBox: 'L = 2*Delta*delta(T), Delta = sqrt(T/2pi), delta = log(T/2pi)/2pi: mean zeros in one width-2Delta hard box',
    varBox: 'Sigma^2(L) = (log(2pi L) + gamma + 1)/pi^2: GUE number variance of one box count',
    cov: 'Cov(N(I),N(J)) = (Sigma^2(2L) - 2 Sigma^2(L))/2: exact count covariance of two adjacent edge-to-edge boxes (union identity; determinantal sine kernel)',
    rhoExact: 'rho_exact = Cov / Sigma^2(L) = Sigma^2(2L)/(2 Sigma^2(L)) - 1: the exact adjacent-box lag-1 correlation',
    factor: 'f = (1 - rho_exact)/(1 + rho_exact): AR-1 effective independent factor; > 1 for anti-correlated boxes',
    nEff: 'n_eff = n_w * f: effective independent window count under the exact correlation',
    gapToFlip: 'rho_crit - rho_exact: distance in rho units to the positive flip threshold rho_crit = 0.5744 (> 0 = safe side)',
  },
  significantHeightReference: { Tc: 1.5e5, rhoExact: RHO_15E5, factor: FACTOR_15E5, nWindows: 291, rhoCritFlip: RHO_CRIT },
  rows: rows.map((r) => ({
    Tc: r.Tc,
    nWindows: r.nWindows,
    zerosPerBox: r.zerosPerBox,
    varBox: r.varBox,
    cov: r.cov,
    rhoExact: r.rhoExact,
    factor: r.factor,
    nEff: r.nEff,
    gapToFlip: r.gapToFlip,
  })),
  uniformity,
  caveat:
    'rho_exact is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L, not the empirical adjacent-box covariance of the actual Riemann zeros (which would need the zeros bundle). The window counts n_w are the imp-96090 held-out measurements; the AR-1 effective-count formula is the same imp-96109/imp-96128 model, and the sine process has slowly decaying higher-lag correlations (imp-96128: lag-2/lag-3 at -0.020 / -0.008, small and negative) so the tiling is only approximately AR-1, but the higher lags push the same way. This changes no bound and does not raise the ~1.9-sigma confidence (set by the excursion depth, not the correlation model); it shows the imp-96128 single-height finding is uniform across the accessible band.',
  verdict:
    'Across the five imp-96090 held-out heights {2e4, 5e4, 1e5, 2e5, 4e5} the exact GUE two-interval covariance for the sd(C - E) statistic is uniformly strongly anti-correlated (rho_exact in -0.4587 .. -0.4660, spread 0.0073, bracketing the imp-96128 T = 1.5e5 value -0.46398), the AR-1 n_eff inflation is a nearly-constant ~2.7x multiplier (f in 2.695 .. 2.746, not height-specific), and the safe-side flip margin rho_crit - rho_exact holds uniformly at ~1.04 in rho units. The imp-96128 significant-dip strengthening is UNIFORM across the accessible band, not a single-height accident. Measurement only; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  const at = (Tc) => rows.find((r) => r.Tc === Tc);
  // five held-out heights, matching the imp-96090 set (none in the six imp-95562 fit heights)
  if (rows.length !== 5) throw new Error('imp-96150: expected five held-out heights');
  const fitSet = new Set([1.0e4, 3.0e4, 7.0e4, 1.5e5, 3.0e5, 5.0e5]);
  if (rows.some((r) => fitSet.has(r.Tc))) throw new Error('imp-96150: a fit height leaked into the held-out set');
  // per-height rho_exact reproduces the offline census
  if (!approx(at(2.0e4).rhoExact, -0.458696, 1e-5)) throw new Error('imp-96150: T = 2e4 rho_exact drifted');
  if (!approx(at(5.0e4).rhoExact, -0.461305, 1e-5)) throw new Error('imp-96150: T = 5e4 rho_exact drifted');
  if (!approx(at(1.0e5).rhoExact, -0.463042, 1e-5)) throw new Error('imp-96150: T = 1e5 rho_exact drifted');
  if (!approx(at(2.0e5).rhoExact, -0.464611, 1e-5)) throw new Error('imp-96150: T = 2e5 rho_exact drifted');
  if (!approx(at(4.0e5).rhoExact, -0.466037, 1e-5)) throw new Error('imp-96150: T = 4e5 rho_exact drifted');
  // n_eff reproduces the offline census
  if (!approx(at(2.0e4).nEff, 285.647, 1e-2)) throw new Error('imp-96150: T = 2e4 n_eff drifted');
  if (!approx(at(4.0e5).nEff, 1304.150, 1e-2)) throw new Error('imp-96150: T = 4e5 n_eff drifted');
  // UNIFORMITY: every rho_exact anti-correlated near -1/2, tight spread, brackets the significant height
  if (!uniformity.allAntiCorrelatedNearHalf) throw new Error('imp-96150: some rho_exact not anti-correlated near -1/2');
  if (!(uniformity.rhoSpread < 0.01)) throw new Error('imp-96150: rho_exact spread across heights should be < 0.01');
  if (!uniformity.bracketsSignificantHeight) throw new Error('imp-96150: held-out rho band should bracket the T = 1.5e5 value');
  // UNIFORMITY: AR-1 factor nearly constant (~2.7x) -- inflation is not height-specific
  if (!uniformity.factorNearlyConstant) throw new Error('imp-96150: AR-1 factor should be nearly constant across heights');
  if (!(uniformity.factorMin > 2.6 && uniformity.factorMax < 2.8))
    throw new Error('imp-96150: AR-1 factor band should sit in ~2.7x for every height');
  // UNIFORMITY: safe-side flip margin holds at every height (positive rho_crit vs negative rho_exact)
  if (!uniformity.allSafeSide) throw new Error('imp-96150: every held-out height should be on the safe side of rho_crit');
  if (!(uniformity.gapMin > 1.0 && uniformity.gapMax < 1.1))
    throw new Error('imp-96150: flip-gap should be uniformly ~1.04 in rho units');
  // honesty gates
  if (!/NO QED/.test(IMP96150_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_HELDOUT_HEIGHTS.verdict))
    throw new Error('imp-96150: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96150_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_HELDOUT_HEIGHTS.verdict))
    throw new Error('imp-96150: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96150_NUMBER_VARIANCE_TWO_INTERVAL_COVARIANCE_HELDOUT_HEIGHTS;
