/**
 * imp-96312 -- CROSS-VALIDATE the imp-96267 rho_exact at the Platt-Trudgian verified height 3e12
 * against the imp-96128 single-height exact two-interval covariance machinery, confirming the two
 * independent evaluations of the GUE adjacent-box correlation agree at the PT anchor and that the
 * accessible-band value ~-0.48 (deviation 0.0182) is the operative correlation, not the -1/2 idealization.
 *
 * WHAT WAS NEVER TABULATED. imp-96267 reports rho_exact = -0.4818 (deviation |rho + 1/2| = 0.0182,
 * NOT within 1e-2 of the GUE-rigidity limit -1/2) at the PT verified height T = 3e12, computed from
 * the sine-kernel closed form rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1. imp-96128 computed the
 * SAME two-interval count correlation via the union-identity covariance
 * Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2, rho_exact = Cov/Sigma^2(L), but only tabulated it on the six
 * imp-95562 census heights T = 1e4 .. 5e5 (up to rho_exact = -0.4665), never at the PT anchor 3e12.
 * The two are ALGEBRAICALLY the same object -- rho_exact = Cov/Sigma^2(L) = Sigma^2(2L)/(2 Sigma^2(L)) - 1
 * -- so evaluating BOTH forms at 3e12 is a mutual-consistency check that should agree to floating point.
 * This module performs that check and reports the imp-96128 covariance quantities (L, Sigma^2(L), Cov,
 * AR-1 factor) at the PT anchor for the first time.
 *
 * FINDINGS.
 *  1. THE TWO EVALUATIONS AGREE EXACTLY AT 3e12. The imp-96267 form Sigma^2(2L)/(2 Sigma^2(L)) - 1 and
 *     the imp-96128 form Cov/Sigma^2(L) both give rho_exact = -0.4817670 at T = 3e12 -- byte-identical
 *     (absolute difference 0), as they must be since the union identity makes them the same expression.
 *     The deviation from -1/2 is 0.0182330, reproducing the imp-96267 value 0.0182 and confirming the PT
 *     anchor is NOT within 1e-2 of the rigidity limit.
 *  2. THE imp-96128 COVARIANCE QUANTITIES AT THE PT ANCHOR. L = 5.9148e6 zeros per box,
 *     Sigma^2(L) = 1.92592 (box variance), Cov = -0.92784 (exact adjacent-box count covariance). The
 *     PT-anchor box holds ~11,900x more zeros than the T = 1.5e5 significant-dip box (L = 495.78), yet
 *     rho_exact only strengthens marginally from -0.46398 to -0.48177: the correlation is nearly height-flat,
 *     the hallmark of the 1/log T crawl imp-96267 quantified.
 *  3. THE SAFE-SIDE VERDICT PERSISTS AT THE PT ANCHOR. The imp-96128 AR-1 effective factor
 *     f = (1 - rho)/(1 + rho) = 2.8593 at rho_exact = -0.48177 (up from 2.7312 at T = 1.5e5): the
 *     anti-correlation still RAISES the effective independent count, and the correlation sits a full
 *     1.0562 in rho units on the safe side of the sign-forbidden positive flip threshold rho_crit = 0.5744.
 *     Extending imp-96128 to 3e12 does not change its safe-side verdict; it deepens it.
 *
 * INTERPRETATION. The imp-96267 decade-ladder extrapolation and the imp-96128 union-identity covariance
 * are two views of one closed-form envelope; at the PT verified height they coincide to floating point,
 * confirming rho_exact ~ -0.48 (deviation 0.0182) as the operative accessible-band correlation and the
 * -1/2 endpoint as an asymptote no verified height reaches. The anti-correlation is helpful at every height.
 *
 * HONEST CAVEAT. rho_exact is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation
 * for boxes of unfolded length L(T); at T = 3e12 there are no computed Riemann zeros, so this is a
 * cross-validation of two closed-form evaluations of the same envelope, not a measurement of actual zeros.
 * It changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion
 * confidence.
 *
 * VERDICT. The imp-96267 rho_exact = -0.4817670 at the Platt-Trudgian verified height 3e12 (deviation
 * 0.0182330) is byte-identical to the imp-96128 union-identity covariance evaluation Cov/Sigma^2(L) at
 * the same height -- the two forms are the same object and agree to floating point. The imp-96128
 * covariance machinery extended to the PT anchor gives L = 5.91e6, Sigma^2(L) = 1.926, Cov = -0.928,
 * AR-1 factor 2.859, and the correlation sits 1.056 in rho units on the safe side of the sign-forbidden
 * rho_crit = 0.5744 flip threshold: the accessible-band value ~-0.48 is the operative correlation and
 * the -1/2 idealization is not reached. Measurement/cross-validation only; theoretical GUE quantity, not
 * real zeros; changes no bound; NO QED; no refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated.
 *
 * @see imp-96267-covariance-drift-rigidity-limit-reach (the decade-ladder + PT-anchor rho_exact = -0.4818)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the union-identity covariance and safe-side verdict)
 * @see imp-96350-covariance-outoffamily-crossvalidation (the OUT-OF-FAMILY corroboration: this module's two forms both
 *      feed on the same asymptotic-only number variance and the union identity makes them algebraically the same
 *      expression, so the byte-identical agreement here is a self-consistency check, not an independent confirmation;
 *      imp-96350 supplies the genuine independent check, against the exact Dyson-Mehta number variance and a direct
 *      pair-correlation double integral, discrepancy 2.52e-10)
 *
 * Import-light: no zeros bundle, no sibling imports. The sine-kernel number-variance and unfolded-length
 * formulas are re-derived verbatim from imp-96150/imp-96128/imp-96267 (the same closed form).
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;

// Formulas identical to imp-96128/imp-96267 (no re-import, to stay import-light).
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L zeros per box
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI); // Sigma^2(L)

// imp-96267 form: rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1.
const rhoFrom267 = (L) => gueNumberVariance(2 * L) / (2 * gueNumberVariance(L)) - 1;
// imp-96128 form: exact union-identity covariance then rho = Cov/Sigma^2(L).
const twoIntervalCov = (L) => (gueNumberVariance(2 * L) - 2 * gueNumberVariance(L)) / 2;
const rhoFrom128 = (L) => twoIntervalCov(L) / gueNumberVariance(L);
const arEffectiveFactor = (rho) => (1 - rho) / (1 + rho);

const PT_HEIGHT = 3e12; // Platt-Trudgian verified height
const RHO_CRIT = 0.57443; // imp-96128 positive flip threshold (sign-forbidden for anti-correlated boxes)

const L_PT = envelopeCount(PT_HEIGHT);
const varBoxPT = gueNumberVariance(L_PT);
const covPT = twoIntervalCov(L_PT);
const rho267 = rhoFrom267(L_PT);
const rho128 = rhoFrom128(L_PT);
const deviationPT = Math.abs(rho267 - RIGIDITY_LIMIT);
const factorPT = arEffectiveFactor(rho128);

// imp-96128 significant-dip reference point (T = 1.5e5) recomputed here for the height comparison.
const L_15E5 = envelopeCount(1.5e5);
const rho15E5 = rhoFrom128(L_15E5);

export const IMP96312_COVARIANCE_CROSS_VALIDATION_PT_ANCHOR = {
  ticket: 'imp-96312',
  source:
    'imp-96267 reports rho_exact = -0.4818 (deviation 0.0182) at the Platt-Trudgian verified height 3e12 from the sine-kernel closed form Sigma^2(2L)/(2 Sigma^2(L)) - 1. imp-96128 computed the SAME correlation via the union-identity covariance Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2, rho = Cov/Sigma^2(L), but only on the six imp-95562 census heights 1e4..5e5. This module evaluates BOTH forms at 3e12 for mutual consistency and tabulates the imp-96128 covariance quantities at the PT anchor for the first time. Cross-validation only; theoretical GUE quantity, not real zeros.',
  definitions: {
    rhoFrom267: 'rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 (imp-96267 form)',
    rhoFrom128: 'rho_exact = Cov/Sigma^2(L), Cov = (Sigma^2(2L) - 2 Sigma^2(L))/2 (imp-96128 union-identity form)',
    deviation: '|rho_exact - (-1/2)|: distance to the GUE-rigidity limit at the PT anchor',
    factor: 'f = (1 - rho)/(1 + rho): imp-96128 AR-1 effective-independent factor at the PT anchor',
  },
  rigidityLimit: RIGIDITY_LIMIT,
  plattTrudgianAnchor: {
    T: PT_HEIGHT,
    zerosPerBox: L_PT, // ~5.9148e6
    varBox: varBoxPT, // Sigma^2(L) ~ 1.92592
    cov: covPT, // ~-0.92784 exact adjacent-box covariance
    rhoFrom267: rho267, // -0.4817670 (imp-96267 form)
    rhoFrom128: rho128, // -0.4817670 (imp-96128 form)
    absFormDiscrepancy: Math.abs(rho267 - rho128), // 0 -- same object, byte-identical
    deviation: deviationPT, // 0.0182330 -- reproduces imp-96267 0.0182, NOT within 1e-2 of -1/2
    withinEpsilon1e2: deviationPT < 1e-2, // false: PT anchor does not reach within 1e-2 of the rigidity limit
    arFactor: factorPT, // 2.8593 -- anti-correlation still raises the effective count
    rhoCritFlip: RHO_CRIT, // +0.57443 positive flip threshold
    gapToFlip: RHO_CRIT - rho267, // ~1.0562 in rho units, safe side and wrong sign
  },
  heightComparison: {
    significantDipHeight: 1.5e5,
    rhoAtSignificantDip: rho15E5, // -0.46398 (imp-96128)
    rhoAtPlattTrudgian: rho267, // -0.48177
    zerosPerBoxRatio: L_PT / L_15E5, // ~11,900x more zeros per box at the PT anchor
    note: 'The PT-anchor box holds ~11,900x more zeros than the T=1.5e5 significant-dip box, yet rho_exact only strengthens from -0.46398 to -0.48177: near height-flat, the 1/log T crawl of imp-96267.',
  },
  caveat:
    'rho_exact is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L(T); at T=3e12 there are no computed Riemann zeros, so this cross-validates two closed-form evaluations of the same envelope, not a measurement of actual zeros. It changes no bound and does not touch the ~1.9-sigma excursion confidence.',
  statusNote:
    'NOT INDEPENDENT: the two forms cross-checked above (imp-96267 ratio and imp-96128 union-identity covariance) both reduce, algebraically, to the same asymptotic-only number variance Sigma2_asymp(L) = (ln(2piL)+gamma+1)/pi^2, so their byte-identical agreement is a WITHIN-family self-consistency check, not an independent confirmation of rho_exact=-0.4817670. imp-96350 supplies the genuine out-of-family corroboration -- the exact Dyson-Mehta sine-kernel number variance and a direct pair-correlation double integral, agreeing to a discrepancy of 2.52e-10 -- and should be cited as the independent cross-validation instead of this module.',
  verdict:
    'The imp-96267 rho_exact = -0.4817670 at the Platt-Trudgian verified height 3e12 (deviation 0.0182330) is byte-identical to the imp-96128 union-identity covariance evaluation Cov/Sigma^2(L) at the same height -- the two forms are the same object and agree to floating point. The imp-96128 covariance machinery at the PT anchor gives L=5.91e6, Sigma^2(L)=1.926, Cov=-0.928, AR-1 factor 2.859, and the correlation sits 1.056 in rho units on the safe side of the sign-forbidden rho_crit=0.5744 flip threshold: the accessible-band value ~-0.48 is the operative correlation and the -1/2 idealization is not reached. Measurement/cross-validation only; theoretical GUE quantity, not real zeros; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // the two forms are algebraically identical -> byte-identical at the PT anchor
  if (rho267 !== rho128) throw new Error('imp-96312: imp-96267 and imp-96128 forms should be byte-identical at 3e12');
  if (Math.abs(rho267 - rho128) !== 0) throw new Error('imp-96312: form discrepancy at 3e12 should be exactly 0');

  // reproduces the imp-96267 PT-anchor values
  if (!approx(rho267, -0.481767, 1e-5)) throw new Error('imp-96312: PT-anchor rho_exact drifted from imp-96267 -0.4818');
  if (!approx(deviationPT, 0.018233, 1e-5)) throw new Error('imp-96312: PT-anchor deviation drifted from imp-96267 0.0182');

  // the PT anchor is NOT within 1e-2 of the rigidity limit (imp-96267 finding #2)
  if (deviationPT < 1e-2) throw new Error('imp-96312: PT anchor should NOT be within 1e-2 of -1/2');

  // reproduces the imp-96128 significant-dip correlation and shows near height-flat drift
  if (!approx(rho15E5, -0.46398, 1e-4)) throw new Error('imp-96312: T=1.5e5 rho_exact drifted from imp-96128 -0.46398');
  if (!(rho267 < rho15E5)) throw new Error('imp-96312: rho_exact should strengthen (deepen) from 1.5e5 to 3e12');
  if (!(L_PT / L_15E5 > 1e4)) throw new Error('imp-96312: PT-anchor box should hold >1e4x more zeros than the 1.5e5 box');

  // imp-96128 covariance quantities at the PT anchor
  if (!approx(varBoxPT, 1.92592, 1e-4)) throw new Error('imp-96312: PT-anchor box variance drifted');
  if (!approx(covPT, -0.92784, 1e-4)) throw new Error('imp-96312: PT-anchor covariance drifted');
  if (!(covPT < 0)) throw new Error('imp-96312: PT-anchor covariance should be negative (anti-correlated)');

  // AR-1 factor > 1 (anti-correlation raises the effective count) and safe side of the flip threshold
  if (!(factorPT > 2.5)) throw new Error('imp-96312: PT-anchor AR-1 factor should exceed 2.5');
  if (!(RHO_CRIT > 0 && rho267 < 0)) throw new Error('imp-96312: flip needs positive rho; exact rho is negative (sign-forbidden)');
  if (!approx(IMP96312_COVARIANCE_CROSS_VALIDATION_PT_ANCHOR.plattTrudgianAnchor.gapToFlip, 1.0562, 1e-3))
    throw new Error('imp-96312: gap to flip threshold drifted');

  // honesty gates
  if (!/NO QED/.test(IMP96312_COVARIANCE_CROSS_VALIDATION_PT_ANCHOR.verdict))
    throw new Error('imp-96312: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96312_COVARIANCE_CROSS_VALIDATION_PT_ANCHOR.verdict))
    throw new Error('imp-96312: verdict dropped the no-refereed-bound-change banner');

  // consumer status note: must re-point to imp-96350 as the independent corroboration
  if (!/NOT INDEPENDENT/.test(IMP96312_COVARIANCE_CROSS_VALIDATION_PT_ANCHOR.statusNote))
    throw new Error('imp-96312: statusNote dropped the NOT INDEPENDENT flag');
  if (!/imp-96350/.test(IMP96312_COVARIANCE_CROSS_VALIDATION_PT_ANCHOR.statusNote))
    throw new Error('imp-96312: statusNote should re-point to imp-96350');
})();

export default IMP96312_COVARIANCE_CROSS_VALIDATION_PT_ANCHOR;
