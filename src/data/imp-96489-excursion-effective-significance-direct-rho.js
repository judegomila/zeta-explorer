/**
 * imp-96489 -- DIRECT evaluation of the imp-96128 union-identity rho_exact AT the T = 1.5e5 excursion
 * box length, propagating its AR-1 factor to reconcile the imp-96452 conservative z = 1.9234 (naive
 * n_w = 291) against the effective z ~ 3.18 (n_eff ~ 795) it never actually recomputed.
 *
 * WHAT WAS LEFT DANGLING. imp-96452 quotes the ~1.9-sigma T = 1.5e5 excursion confidence as the
 * conservative naive figure z = relErr / sqrt(2 / n_w) = 1.9234 (n_w = 291), and SEPARATELY cites
 * imp-96128's exact GUE adjacent-box correlation as a hardcoded literal RHO_EXACT_15E5 = -0.46398,
 * from which it reads off the AR-1 factor (1 - rho)/(1 + rho) = 2.731 and n_eff ~ 795 => a naive z of
 * ~3.18. But imp-96452 never RE-EVALUATES rho_exact at the T = 1.5e5 box length itself; it trusts the
 * baked -0.46398. This module closes that seam by directly recomputing rho_exact from the box length
 * L = 2*Delta*delta(T) implied by T = 1.5e5 via the union identity
 *     rho_exact = Sigma^2(2L) / (2*Sigma^2(L)) - 1,
 * then propagating the resulting AR-1 factor through n_eff into the effective z, and reconciling the
 * ~3.18 effective figure against the conservative 1.9234.
 *
 * THE BOX LENGTH. At T = 1.5e5: Delta = sqrt(T/2pi) = 154.5097, delta(T) = log(T/2pi)/2pi = 1.604364,
 * so the mean count per width-2Delta hard box is L = 2*Delta*delta = 495.7794 zeros. This is the same
 * unfolded box length imp-96128/imp-96109 use; it is recomputed here rather than assumed.
 *
 * THE DIRECT rho_exact. Feeding L = 495.7794 through the GUE number variance
 * Sigma^2(x) = (log(2pi x) + gamma + 1)/pi^2:
 *   Sigma^2(L)  = 0.9748338,   Sigma^2(2L) = 1.0450643,
 *   Cov         = (Sigma^2(2L) - 2*Sigma^2(L))/2 = -0.4523016,
 *   rho_exact   = Sigma^2(2L)/(2*Sigma^2(L)) - 1 = -0.4639782.
 * The directly-evaluated rho_exact = -0.4639782 reproduces the imp-96128 baked literal -0.46398 to
 * five decimals -- confirming imp-96452's hardcoded value is the genuine box-length evaluation, not an
 * off-height stand-in.
 *
 * PROPAGATION AND RECONCILIATION. The AR-1 effective-count factor is f = (1 - rho)/(1 + rho) = 2.731192
 * (> 1 because the boxes are ANTI-correlated), lifting the effective independent count from n_w = 291
 * to n_eff = 794.777. Since z scales as sqrt(n_eff) at fixed dip depth relErr = 0.1594568, the effective
 * significance is
 *   z_eff = relErr / sqrt(2 / n_eff) = 3.178708,
 * whereas the conservative naive figure is z_cons = relErr / sqrt(2 / n_w) = 1.923422. Their ratio is
 * EXACTLY sqrt(f):  z_eff / z_cons = sqrt(2.731192) = 1.652632 -- an algebraic identity (both share
 * the same relErr and n_w scaling, differing only by the factor f applied to the count), confirming
 * the ~3.18 figure is the arithmetically forced consequence of the directly-evaluated rho_exact, not
 * an independent estimate.
 *
 * SAFE-SIDE VERDICT. The correlation model MOVES THE FIGURE UP, never down: z_eff = 3.179 > z_cons =
 * 1.923, and both clear the noise floor. The effective significance sits above the 2-sigma target as
 * well (3.179 > 2.0), and the exact rho_exact = -0.46398 sits a full 1.0384 in rho units on the safe
 * side of the sign-forbidden positive flip threshold rho_crit = 0.57443. So the conservative 1.9234 is
 * a strict LOWER BOUND on the true significance, and the directly-evaluated correlation model is
 * confirmed to sit on the safe side of every threshold. This reconciles the two figures imp-96452
 * carried side by side: 1.9234 is the deliberately-conservative naive floor, 3.1787 is the effective
 * value forced by the box-length rho_exact, and both are consistent with the significant-dip verdict.
 *
 * HONEST CAVEAT. rho_exact is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation
 * for boxes of unfolded length L, not the empirical adjacent-box covariance of the actual Riemann zeros
 * (that needs the zeros bundle). The AR-1 effective-count model is the same imp-96109/imp-96128 model;
 * the sine process carries small NEGATIVE higher-lag correlations (lag-2/lag-3 ~ -0.020/-0.008) so the
 * tiling is only approximately AR-1, but those terms push the same (safe) direction. This is a
 * measurement/reconciliation only; it changes no bound and, per the sibling modules, does not RAISE the
 * headline ~1.9-sigma quote -- it confirms that quote is a conservative floor beneath the effective 3.18.
 *
 * VERDICT. Directly evaluating the union-identity rho_exact at the T = 1.5e5 box length L = 495.7794
 * gives rho_exact = Sigma^2(2L)/(2*Sigma^2(L)) - 1 = -0.4639782 (reproducing the imp-96128 baked
 * -0.46398 to five decimals), whose AR-1 factor f = 2.731192 lifts n_eff from 291 to 794.777 and the
 * effective significance from the conservative z_cons = 1.923422 to z_eff = 3.178708 = sqrt(f) * z_cons.
 * The correlation model raises the figure and keeps it on the safe side of both the 2-sigma target and
 * the sign-forbidden rho_crit = 0.57443 flip threshold (gap 1.0384 in rho units), so the ~1.9-sigma
 * quote is confirmed as a conservative lower bound. Measurement/reconciliation only; changes no bound;
 * RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96452-excursion-confidence-2sigma-reach (carries z_cons = 1.9234 and the baked rho literal)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the union identity and rho_exact table)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (sets z = 1.923 at T = 1.5e5)
 * @see imp-96312-covariance-cross-validation-pt-anchor (the same rho_exact deepens at the PT anchor)
 *
 * Import-light: no zeros bundle, no sibling imports. n_w = 291 and relErr = 0.15945679221237827 are the
 * imp-95562/imp-96089 literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; every other
 * quantity (L, Sigma^2, rho_exact, f, n_eff, z) is recomputed here from the sine-kernel number variance.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2*Delta*delta: mean zeros per box
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI); // Sigma^2(L)

// Union identity: rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1, evaluated at the box length L.
const twoIntervalCov = (L) => (gueNumberVariance(2 * L) - 2 * gueNumberVariance(L)) / 2;
const unionRho = (L) => gueNumberVariance(2 * L) / (2 * gueNumberVariance(L)) - 1;
const arEffectiveFactor = (rho) => (1 - rho) / (1 + rho);

// Fixed measured inputs (imp-95562/imp-96089 literals over the 10^6 Odlyzko ordinates; no zeros needed).
const T_DIP = 1.5e5; // the single significant below-envelope number-variance dip
const N_W = 291; // deterministic +/-30% non-overlapping hard-box tiling count at T = 1.5e5
const REL_ERR = 0.15945679221237827; // dip depth |residual|/r (the "excursion depth")
const RHO_CRIT = 0.57443; // POSITIVE lag-1 correlation that would flip the verdict to noise
const Z_TARGET = 2.0;

// --- direct box-length evaluation of rho_exact at T = 1.5e5 ---
const Delta = halfWidth(T_DIP); // 154.5097
const delta = zeroDensity(T_DIP); // 1.604364
const L = envelopeCount(T_DIP); // 495.7794 = 2*Delta*delta
const varBox = gueNumberVariance(L); // Sigma^2(L) = 0.9748338
const varDouble = gueNumberVariance(2 * L); // Sigma^2(2L) = 1.0450643
const cov = twoIntervalCov(L); // -0.4523016
const rhoExact = unionRho(L); // -0.4639782 (directly evaluated at the box length)

// --- propagate the AR-1 factor into n_eff and the effective significance ---
const factor = arEffectiveFactor(rhoExact); // 2.731192
const nEff = N_W * factor; // 794.777
const zCons = REL_ERR / Math.sqrt(2 / N_W); // 1.923422: the conservative naive figure
const zEff = REL_ERR / Math.sqrt(2 / nEff); // 3.178708: the effective figure
const zRatio = zEff / zCons; // = sqrt(factor) exactly (shared relErr, factor applied to the count)
const gapToFlip = RHO_CRIT - rhoExact; // 1.0384 in rho units, on the safe side and wrong sign

export const IMP96489_EXCURSION_EFFECTIVE_SIGNIFICANCE_DIRECT_RHO = {
  ticket: 'imp-96489',
  question:
    'Evaluate the imp-96128 union-identity rho_exact DIRECTLY at the T = 1.5e5 excursion box length (rather than trusting the imp-96452 baked -0.46398), propagate its AR-1 factor into n_eff and the effective z, and reconcile the effective ~3.18 against the conservative naive 1.9234.',
  boxLength: {
    T: T_DIP,
    Delta, // sqrt(T/2pi) = 154.5097
    delta, // log(T/2pi)/2pi = 1.604364
    L, // 2*Delta*delta = 495.7794 zeros per box
    note: 'L = 2*Delta*delta(T) is the unfolded box length implied by T = 1.5e5, recomputed here rather than assumed.',
  },
  directRho: {
    varBox, // Sigma^2(L) = 0.9748338
    varDouble, // Sigma^2(2L) = 1.0450643
    cov, // (Sigma^2(2L) - 2 Sigma^2(L))/2 = -0.4523016
    rhoExact, // Sigma^2(2L)/(2 Sigma^2(L)) - 1 = -0.4639782
    matchesBakedLiteral: -0.46398, // imp-96452/imp-96128 hardcoded value: reproduced to five decimals
    note: 'The directly-evaluated union-identity rho_exact reproduces the imp-96128 baked -0.46398, confirming imp-96452 used the genuine box-length value, not an off-height stand-in.',
  },
  propagation: {
    nW: N_W, // 291 (conservative naive count)
    arFactor: factor, // (1 - rho)/(1 + rho) = 2.731192
    nEff, // 291 * factor = 794.777 (effective independent count under the exact anti-correlation)
    relErr: REL_ERR, // 0.1594568 dip depth (held fixed)
    zConservative: zCons, // 1.923422 = relErr / sqrt(2/n_w): the ~1.9-sigma quote
    zEffective: zEff, // 3.178708 = relErr / sqrt(2/n_eff): the ~3.18 effective figure
    zRatio, // 1.652632 = sqrt(factor): the effective/conservative ratio is exactly sqrt(f)
    note: 'z scales as sqrt(count) at fixed dip depth, so z_eff/z_cons = sqrt(n_eff/n_w) = sqrt(f): the ~3.18 figure is the arithmetically forced consequence of the box-length rho_exact.',
  },
  reconciliation: {
    zTarget: Z_TARGET, // 2.0
    effectiveClearsTarget: zEff > Z_TARGET, // true: 3.179 > 2.0
    correlationRaisesFigure: zEff > zCons, // true: the model moves the figure UP, never down
    rhoCritFlip: RHO_CRIT, // +0.57443 (positive flip threshold)
    gapToFlip, // 1.0384 in rho units, on the safe side and of the wrong sign
    onSafeSide: rhoExact < 0 && RHO_CRIT > 0, // true: sign-forbidden to reach the flip threshold
    statement:
      'The directly-evaluated correlation model raises the significance from the conservative naive z_cons = 1.9234 to the effective z_eff = 3.1787 = sqrt(f) * z_cons, clearing the 2-sigma target and sitting 1.0384 rho-units on the safe side of the sign-forbidden rho_crit = 0.57443 flip threshold. So the conservative 1.9234 is a strict LOWER BOUND and the effective 3.18 is the box-length rho_exact value; the two imp-96452 figures are reconciled and both are consistent with the significant-dip verdict.',
  },
  caveat:
    'rho_exact is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L, not the empirical adjacent-box covariance of the actual Riemann zeros (which would need the zeros bundle). The AR-1 effective-count model is the same imp-96109/imp-96128 model; small NEGATIVE higher-lag correlations (lag-2/lag-3 ~ -0.020/-0.008) make the tiling only approximately AR-1 but push the same safe direction. Measurement/reconciliation only; changes no bound and does not RAISE the headline ~1.9-sigma quote -- it confirms that quote is a conservative floor beneath the effective 3.18.',
  verdict:
    'Directly evaluating the union-identity rho_exact at the T = 1.5e5 box length L = 495.7794 gives rho_exact = Sigma^2(2L)/(2 Sigma^2(L)) - 1 = -0.4639782 (reproducing the imp-96128 baked -0.46398 to five decimals), whose AR-1 factor f = 2.731192 lifts n_eff from 291 to 794.777 and the effective significance from the conservative z_cons = 1.923422 to z_eff = 3.178708 = sqrt(f) * z_cons. The correlation model raises the figure and keeps it on the safe side of both the 2-sigma target and the sign-forbidden rho_crit = 0.57443 flip threshold (gap 1.0384 in rho units), so the ~1.9-sigma quote is confirmed as a conservative lower bound. Measurement/reconciliation only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // box length recomputed from T = 1.5e5 reproduces the imp-96128 value
  if (!approx(L, 495.7794, 1e-3)) throw new Error('imp-96489: T = 1.5e5 box length L drifted from 495.7794');
  if (!approx(varBox, 0.9748338, 1e-6)) throw new Error('imp-96489: Sigma^2(L) drifted');
  if (!approx(varDouble, 1.0450643, 1e-6)) throw new Error('imp-96489: Sigma^2(2L) drifted');
  if (!approx(cov, -0.4523016, 1e-6)) throw new Error('imp-96489: union covariance drifted');
  // the directly-evaluated rho_exact reproduces the imp-96128 baked literal
  if (!approx(rhoExact, -0.4639782, 1e-6)) throw new Error('imp-96489: directly-evaluated rho_exact drifted');
  if (!approx(rhoExact, -0.46398, 1e-4)) throw new Error('imp-96489: rho_exact does not match imp-96128 baked -0.46398');
  // union identity is self-consistent with the covariance form
  if (!approx(rhoExact, cov / varBox, 1e-12)) throw new Error('imp-96489: union rho inconsistent with Cov/Var');
  // propagation: AR-1 factor, n_eff, and the two z figures
  if (!approx(factor, 2.731192, 1e-5)) throw new Error('imp-96489: AR-1 factor drifted');
  if (!approx(nEff, 794.777, 1e-2)) throw new Error('imp-96489: n_eff drifted from ~794.78');
  if (!approx(zCons, 1.923422, 1e-5)) throw new Error('imp-96489: conservative z drifted from imp-96452 1.9234');
  if (!approx(zEff, 3.178708, 1e-5)) throw new Error('imp-96489: effective z drifted from ~3.18');
  // the effective/conservative ratio is EXACTLY sqrt(factor)
  if (!approx(zRatio, Math.sqrt(factor), 1e-12)) throw new Error('imp-96489: z_eff/z_cons should equal sqrt(f) exactly');
  // reconciliation: the model raises the figure and stays on the safe side of every threshold
  if (!(zEff > zCons)) throw new Error('imp-96489: correlation model must raise (not lower) the naive z');
  if (!(zEff > Z_TARGET)) throw new Error('imp-96489: effective z should clear the 2-sigma target');
  if (!(rhoExact < 0 && RHO_CRIT > 0)) throw new Error('imp-96489: flip needs positive rho; exact rho is negative (sign-forbidden)');
  if (!approx(gapToFlip, 1.0384, 1e-3)) throw new Error('imp-96489: gap to the flip threshold drifted');
  // honesty gates
  if (!/NO QED/.test(IMP96489_EXCURSION_EFFECTIVE_SIGNIFICANCE_DIRECT_RHO.verdict))
    throw new Error('imp-96489: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96489_EXCURSION_EFFECTIVE_SIGNIFICANCE_DIRECT_RHO.verdict))
    throw new Error('imp-96489: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96489_EXCURSION_EFFECTIVE_SIGNIFICANCE_DIRECT_RHO;
