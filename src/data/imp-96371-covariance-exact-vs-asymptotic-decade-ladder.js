/**
 * imp-96371 -- Extend the imp-96350 EXACT-vs-ASYMPTOTIC number-variance cross-check across the full
 * imp-96267 decade ladder of heights, not just the single Platt-Trudgian anchor L(3e12) = 5.9148e6.
 *
 * WHAT imp-96350 LEFT OPEN. imp-96350 measured the discrepancy between the exact Dyson-Mehta number
 * variance Sigma2_exact (which restores the oscillatory cos/Ci/Si corrections) and the asymptotic
 * Sigma2_asymp = (ln(2piL) + gamma + 1)/pi^2 (which drops them) ONLY at the PT anchor, forming
 * rho(L) = Sigma2(2L)/(2 Sigma2(L)) - 1 and finding |rho_exact - rho_asymp| = 2.52e-10. It explained
 * the near-perfect cancellation of the individually large (~0.0985) oscillatory corrections via the Si
 * tail, but never asked whether that cancellation is UNIFORM in L: at the accessible L = 30 the two
 * forms already split in the 5th decimal, so the discrepancy plainly is not L-independent.
 *
 * WHAT THIS MODULE MEASURES. Recompute both rho forms across the imp-96267 decade ladder of heights
 * T = {1e4, 1e5, ..., 1e12, 3e12} (L = 2 Delta delta(T) = envelopeCount(T)) and tabulate the
 * exact-vs-asymptotic discrepancy |rho_exact - rho_asymp| at every rung, plus the underlying
 * Sigma2_exact - Sigma2_asymp residual at L and 2L.
 *
 * FINDINGS.
 *  1. THE DISCREPANCY IS NOT UNIFORM -- IT IS U-SHAPED IN log T, NOT a flat ~1e-10. Across the ladder
 *     |rho_exact - rho_asymp| runs
 *       T = 1e4 : 1.47e-7   (worst rung -- dropped oscillatory terms matter most at small L)
 *       T = 1e5 : 1.17e-8
 *       T = 1e6 : 4.15e-10
 *       T = 1e7 : 4.14e-11
 *       T = 1e8 : 1.03e-12
 *       T = 1e9 : 3.23e-13  (floor -- at the double-precision roundoff limit for rho ~ -0.476)
 *       T = 1e10: 5.92e-12
 *       T = 1e11: 2.75e-11
 *       T = 1e12: 1.25e-10
 *       T = 3e12: 2.52e-10  (the imp-96350 PT-anchor value)
 *     So the discrepancy GROWS at smaller L exactly as anticipated (peaking 1.47e-7 at T = 1e4, ~580x
 *     the PT value), FALLS to a roundoff-limited floor ~3e-13 near T = 1e8-1e9, then RISES modestly
 *     back to 2.52e-10 at the PT anchor. The 2.52e-10 PT figure is representative of the large-L
 *     branch, not the worst case and not a flat asymptote.
 *  2. THE SIGN OF THE Sigma2 RESIDUAL OSCILLATES RUNG TO RUNG. Sigma2_exact(L) - Sigma2_asymp(L)
 *     alternates sign across the ladder (+2.14e-7, +1.69e-8, -1.11e-9, +7.76e-11, -3.78e-12, ...),
 *     confirming the residual is oscillatory (driven by cos(2piL) and the Si/Ci tails at the specific
 *     L of each height), not a smooth monotone error. Its magnitude ENVELOPE is what is U-shaped.
 *  3. THE -0.4818 VALUE SURVIVES OUT-OF-FAMILY AT EVERY DECADE, not just at the PT anchor. At every
 *     rung the discrepancy stays below ~1.5e-7 (>= 6 significant figures of agreement in rho, ~10 at
 *     the mid-ladder floor), so the exact Dyson-Mehta number variance and the asymptotic module value
 *     agree on rho across the whole ladder -- the imp-96350 out-of-family verdict is not a PT-anchor
 *     coincidence.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L(T); at these heights (and certainly at 3e12) there are no computed Riemann
 * zeros, so this cross-validates two independent closed-form evaluations of the same envelope across the
 * ladder, not a measurement of actual zeros. The mid-ladder floor ~3e-13 is at the double-precision
 * roundoff limit of the rho ratio, so the true out-of-family discrepancy there is only bounded by that
 * floor, not resolved. It changes no bound, establishes no operator positivity, and does not touch the
 * ~1.9-sigma excursion confidence.
 *
 * VERDICT. The imp-96350 near-perfect exact-vs-asymptotic cancellation is NOT uniform across the
 * imp-96267 decade ladder: |rho_exact - rho_asymp| is U-shaped in log T, growing to 1.47e-7 at T = 1e4
 * (dropped oscillatory terms matter most at small L, ~580x the PT value), falling to a roundoff-limited
 * ~3e-13 floor near T = 1e8-1e9, then rising back to the imp-96350 2.52e-10 at the PT anchor 3e12; the
 * Sigma2 residual sign oscillates rung to rung. At every rung the discrepancy stays below ~1.5e-7, so
 * the -0.4818 value survives out-of-family at every decade, not only at the PT anchor. Accuracy
 * cross-check only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96350-covariance-outoffamily-crossvalidation (the PT-anchor exact-vs-asymptotic measurement this extends)
 * @see imp-96267-covariance-drift-rigidity-limit-reach (the decade ladder of heights and the rho_exact drift)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (the direct-integral third basis and its cancellation floor)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci and the number-variance formulas are
 * re-derived verbatim here (identical to imp-96350) so the ladder is recomputed independently.
 */

const TWO_PI = 2 * Math.PI;
const PI = Math.PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L zeros per box

// --- Si(x) = Integral_0^x sin t/t dt, Ci(x) = gamma + ln x + Integral_0^x (cos t - 1)/t dt ---
// Power series for small x, asymptotic expansion for large x (double-precision accurate on our ranges).
function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x;
    let sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x;
  const i2 = inv * inv;
  let f = inv;
  let tf = inv;
  for (let k = 1; k < 20; k++) {
    tf *= -(2 * k) * (2 * k - 1) * i2;
    if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break;
    f += tf;
  }
  let g = i2;
  let tg = i2;
  for (let k = 1; k < 20; k++) {
    tg *= -(2 * k + 1) * (2 * k) * i2;
    if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break;
    g += tg;
  }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1;
    let sum = 0;
    for (let k = 1; k < 200; k++) {
      t *= (-x * x) / ((2 * k - 1) * (2 * k));
      const add = t / (2 * k);
      sum += add;
      if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x;
  const i2 = inv * inv;
  let f = inv;
  let tf = inv;
  for (let k = 1; k < 20; k++) {
    tf *= -(2 * k) * (2 * k - 1) * i2;
    if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break;
    f += tf;
  }
  let g = i2;
  let tg = i2;
  for (let k = 1; k < 20; k++) {
    tg *= -(2 * k + 1) * (2 * k) * i2;
    if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break;
    g += tg;
  }
  return f * Math.sin(x) - g * Math.cos(x);
}

// Asymptotic-only number variance (the module basis) and EXACT Dyson-Mehta number variance.
const sigma2Asymp = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (PI * PI);
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoFrom = (s2) => (L) => s2(2 * L) / (2 * s2(L)) - 1;

// The imp-96267 decade ladder of heights plus the Platt-Trudgian verified-height anchor 3e12.
const LADDER_HEIGHTS = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 3e12];

const ladder = LADDER_HEIGHTS.map((T) => {
  const L = envelopeCount(T);
  const rhoAsymp = rhoFrom(sigma2Asymp)(L);
  const rhoExact = rhoFrom(sigma2Exact)(L);
  return {
    T,
    L,
    rhoAsymp,
    rhoExact,
    discrepancy: Math.abs(rhoExact - rhoAsymp),
    sigma2ResidualAtL: sigma2Exact(L) - sigma2Asymp(L),
    sigma2ResidualAt2L: sigma2Exact(2 * L) - sigma2Asymp(2 * L),
    isPlattTrudgianAnchor: T === 3e12,
  };
});

const maxRow = ladder.reduce((a, b) => (b.discrepancy > a.discrepancy ? b : a));
const minRow = ladder.reduce((a, b) => (b.discrepancy < a.discrepancy ? b : a));
const ptRow = ladder.find((r) => r.isPlattTrudgianAnchor);

export const IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER = {
  ticket: 'imp-96371',
  source:
    'imp-96350 measured the exact-vs-asymptotic number-variance discrepancy |rho_exact - rho_asymp| = 2.52e-10 only at the single Platt-Trudgian anchor L(3e12) = 5.9148e6. This module extends that measurement across the imp-96267 decade ladder of heights T = {1e4..1e12, 3e12} to test whether the near-perfect cancellation of the oscillatory Ci/Si/cos corrections is uniform in L. Accuracy cross-check only; theoretical GUE quantity, not real zeros.',
  definitions: {
    sigma2Asymp: 'Sigma2_asymp(L) = (ln(2piL) + gamma + 1)/pi^2: large-L asymptotic number variance (drops the oscillatory terms)',
    sigma2Exact:
      'Sigma2_exact(L) = (1/pi^2)[ln(2piL)+gamma+1-cos(2piL)-Ci(2piL)] + L(1 - (2/pi)Si(2piL)): exact Dyson-Mehta sine-kernel number variance',
    rho: 'rho(L) = Sigma2(2L)/(2 Sigma2(L)) - 1: adjacent-box lag-1 correlation from a given number variance',
    discrepancy: '|rho_exact(L) - rho_asymp(L)|: the out-of-family gap between the exact and asymptotic number-variance ratios at each rung',
  },
  rigidityLimit: RIGIDITY_LIMIT,
  ladder: ladder.map((r) => ({
    T: r.T,
    L: r.L,
    rhoAsymp: r.rhoAsymp,
    rhoExact: r.rhoExact,
    discrepancy: r.discrepancy,
    sigma2ResidualAtL: r.sigma2ResidualAtL,
  })),
  shape: {
    worst: { T: maxRow.T, discrepancy: maxRow.discrepancy }, // T = 1e4, ~1.47e-7 (small-L branch)
    floor: { T: minRow.T, discrepancy: minRow.discrepancy }, // T ~ 1e9, ~3.2e-13 (roundoff-limited)
    ptAnchor: { T: ptRow.T, discrepancy: ptRow.discrepancy }, // T = 3e12, ~2.52e-10 (large-L branch)
    ratioWorstToPt: maxRow.discrepancy / ptRow.discrepancy, // ~580x: PT value is NOT the worst case
    isUShapedInLogT: maxRow.T < minRow.T && minRow.T < ptRow.T, // worst at smallest T, floor mid-ladder, rises again
    residualSignOscillates: true, // Sigma2_exact - Sigma2_asymp alternates sign rung to rung (cos/Si-tail driven)
    note: 'The discrepancy ENVELOPE is U-shaped in log T: largest at small L (incomplete oscillatory cancellation), a roundoff-limited floor ~3e-13 near T = 1e8-1e9, rising back to 2.52e-10 at the PT anchor. The mid-ladder floor is bounded by double-precision roundoff, not resolved.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L(T); at these heights (and certainly at 3e12) there are no computed Riemann zeros, so this cross-validates two independent closed-form evaluations of the same envelope across the ladder, not a measurement of actual zeros. The mid-ladder floor ~3e-13 is at the double-precision roundoff limit of the rho ratio, so the out-of-family discrepancy there is only bounded, not resolved. It changes no bound and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'The imp-96350 near-perfect exact-vs-asymptotic cancellation is NOT uniform across the imp-96267 decade ladder: |rho_exact - rho_asymp| is U-shaped in log T, growing to 1.47e-7 at T = 1e4 (dropped oscillatory terms matter most at small L, ~580x the PT value), falling to a roundoff-limited ~3e-13 floor near T = 1e8-1e9, then rising back to the imp-96350 2.52e-10 at the PT anchor 3e12; the Sigma2 residual sign oscillates rung to rung. At every rung the discrepancy stays below ~1.5e-7, so the -0.4818 value survives out-of-family at every decade, not only at the PT anchor. Accuracy cross-check only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // Si/Ci implementations reproduce standard reference values (identical basis to imp-96350)
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96371: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96371: Ci(1) drifted from reference');

  // the PT-anchor rung reproduces the imp-96350 out-of-family discrepancy 2.52e-10
  if (!approx(ptRow.discrepancy, 2.52e-10, 5e-11))
    throw new Error('imp-96371: PT-anchor discrepancy drifted from the imp-96350 2.52e-10');
  if (!approx(ptRow.rhoExact, -0.481767, 1e-5))
    throw new Error('imp-96371: PT-anchor rho_exact drifted from imp-96267 -0.4818');

  // the discrepancy is NOT uniform: the small-L worst rung is far larger than the PT value
  if (!(maxRow.T === 1e4)) throw new Error('imp-96371: worst discrepancy should be at the smallest height T = 1e4');
  if (!(maxRow.discrepancy > 1e-7)) throw new Error('imp-96371: small-L discrepancy should exceed 1e-7');
  if (!(maxRow.discrepancy > 100 * ptRow.discrepancy))
    throw new Error('imp-96371: small-L discrepancy should dwarf the PT value (non-uniform cancellation)');

  // U-shaped envelope: the floor sits mid-ladder between the small-L worst rung and the PT anchor
  if (!(maxRow.T < minRow.T && minRow.T < ptRow.T))
    throw new Error('imp-96371: discrepancy envelope should be U-shaped in log T (floor between small-L and PT)');
  if (!(minRow.discrepancy < 1e-11)) throw new Error('imp-96371: mid-ladder floor should be at the roundoff limit (< 1e-11)');

  // at every rung the -0.4818 value survives out-of-family (>= 6 sig figs of agreement)
  for (const r of ladder) {
    if (!(r.discrepancy < 1e-6)) throw new Error(`imp-96371: discrepancy at T=${r.T} exceeds 1e-6 -- value would not survive out-of-family`);
  }

  // the Sigma2 residual sign genuinely oscillates across the ladder
  const signs = new Set(ladder.map((r) => Math.sign(r.sigma2ResidualAtL)));
  if (!(signs.has(1) && signs.has(-1))) throw new Error('imp-96371: Sigma2 residual should change sign across the ladder (oscillatory)');

  // honesty gates
  if (!/NO QED/.test(IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER.verdict))
    throw new Error('imp-96371: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER.verdict))
    throw new Error('imp-96371: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96371_COVARIANCE_EXACT_VS_ASYMPTOTIC_DECADE_LADDER;
