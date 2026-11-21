/**
 * imp-96243 (2026-09-24) — PROOF/DERIVATION: derive analytically WHY the imp-96227 anchor-invariant
 * per-channel coupling constant is EXACTLY sqrt(3)/2 at every interior anchor.
 *
 * imp-96227 MEASURED (to ~1e-11) that the per-channel tightening ratio
 *     tighten(alpha) = maxTolerableBottom(adjThresh(alpha)/2, alpha) / maxTolerableBottom(0, alpha)
 * equals sqrt(3)/2 ~ 0.8660254 EXACTLY at every interior anchor alpha in (lam_2, lam_top), even though the
 * absolute O(1e-3) thresholds shrink monotonically with alpha. It was measured, never derived. This module
 * derives it in closed form from the 3-level Kato-Temple bound and shows the constant is pure ellipse
 * geometry, anchor-independent for a structural reason (nothing special about the imp-96206 midpoint 0.866).
 *
 * -------------------------------------------------------------------------------------------------------
 * THE EXACT CERTIFY BOUNDARY IS LINEAR IN (eps_a^2, eps_b^2). For the 3-level ansatz psi = [1, eps_a, eps_b]
 * on eigenvalues {t = lam_top, p = lam_adj, q = lam_bot} the Kato-Temple upper bound is
 *     U(psi) = R + sigma^2/(R - alpha),   R = s1/s0,   sigma^2 = s2/s0 - R^2,
 *     s0 = 1 + eps_a^2 + eps_b^2,  s1 = t + p eps_a^2 + q eps_b^2,  s2 = t^2 + p^2 eps_a^2 + q^2 eps_b^2.
 * The certify boundary is U = 1. Clearing denominators (R - alpha > 0, s0 > 0):
 *     U - 1 = 0
 *       <=> (R - 1)(R - alpha) + sigma^2 = 0
 *       <=> (s1 - s0)(s1 - alpha s0) + (s0 s2 - s1^2) = 0        [multiply by s0^2]
 *       <=> s0 [ s2 - (1 + alpha) s1 + alpha s0 ] = 0.
 * The cross terms s1^2 cancel exactly, leaving a factor s0 (> 0) times a bracket LINEAR in the level sums.
 * Substituting s0, s1, s2 and grouping by eps_a^2, eps_b^2, each coefficient is the SAME quadratic
 * Q(lam) = lam^2 - (1 + alpha) lam + alpha = (lam - 1)(lam - alpha) evaluated at that level:
 *     s2 - (1 + alpha) s1 + alpha s0
 *        = (t - 1)(t - alpha) + (p - 1)(p - alpha) eps_a^2 + (q - 1)(q - alpha) eps_b^2  =  0.
 * So the certify boundary is EXACTLY a straight line in the squared-overlap coordinates (x, y) = (eps_a^2,
 * eps_b^2) -- equivalently an ELLIPSE in (eps_a, eps_b) -- with NO small-overlap approximation:
 *     A x + B y = delta,
 *     A = (1 - p)(alpha - p) > 0,   B = (1 - q)(alpha - q) > 0,   delta = (1 - t)(t - alpha) > 0,
 * where the signs hold because at an interior anchor lam_2 = p < alpha < t = lam_top < 1 and q < 0 < alpha.
 * (Written with the leading minus absorbed: A = (p-1)(p-alpha), B = (q-1)(q-alpha), delta = -(t-1)(t-alpha),
 *  each a product of two negatives, hence positive.)
 *
 * THE COUPLING RATIO IS PURE ELLIPSE GEOMETRY. Reading the thresholds straight off the line:
 *     pure bottom     b0 = maxTolerableBottom(0, alpha) : set x = 0  =>  b0^2 = delta / B,
 *     pure adjacent   a0 = maxTolerableAdjacent(0, alpha) : set y = 0  =>  a0^2 = delta / A.
 * Now spend eps_a = a0 / 2 (HALF the anchor-specific pure-adjacent threshold). Then
 *     A * (a0/2)^2 = A * a0^2 / 4 = delta / 4,
 * so a quarter of the linear budget delta is consumed and three quarters remain for the bottom channel:
 *     B * b_half^2 = delta - delta/4 = (3/4) delta  =>  b_half^2 = (3/4)(delta / B) = (3/4) b0^2.
 * Therefore
 *     tighten(alpha) = b_half / b0 = sqrt(3)/2   EXACTLY, for EVERY interior anchor alpha.
 * Both delta and B cancel: the ratio depends ONLY on the FRACTION of the (squared) budget spent, not on the
 * individual coefficients, so it is anchor-invariant by construction -- indeed pair-of-eigenvalues-invariant.
 *
 * ORIGIN OF THE CONSTANT. sqrt(3)/2 = sqrt(1 - (1/2)^2): spending the fraction f = 1/2 of the pure-adjacent
 * threshold consumes f^2 = 1/4 of the LINEAR (squared-coordinate) budget, leaving sqrt(1 - f^2) = sqrt(3)/2
 * of the pure-bottom overlap. Equivalently the point (eps_a, eps_b) = (a0/2, sqrt(3)/2 b0) is the 60-degree
 * point on the certify ellipse (cos 60 = 1/2, sin 60 = sqrt(3)/2). The imp-96206 midpoint coincidence
 * 1.032665e-3 / 1.192419e-3 = 0.866 is just this ellipse point evaluated at alpha = 0.81008715 -- not special.
 *
 * COROLLARIES (same line, no extra work).
 *   - WORST-CASE DIRECTION IS PURE-BOTTOM at every anchor: on the ellipse A x + B y = delta the smallest
 *     total magnitude sqrt(x + y) is along the axis with the LARGER coefficient; B > A (since q is farther
 *     from 1 and from alpha than p), so the minimum is b0 = sqrt(delta/B) < a0 = sqrt(delta/A). This is why
 *     imp-96227 finds worstMag = botPure and worstDeg = 90 at every alpha.
 *   - EQUAL-SPLIT boundary: eps_a = eps_b = m gives (A + B) m^2 = delta, so es/b0 = sqrt(B/(A+B)); with
 *     A << B (A/B ~ 0.003 near lam_top rising to ~0.035 near the low edge) this is 0.984..0.998, matching
 *     the imp-96227 equalSplit column.
 *   - GENERAL FRACTION: spending eps_a = f a0 leaves eps_b = sqrt(1 - f^2) b0 (f in [0,1]); f = 1/2 is the
 *     sqrt(3)/2 measured point, f -> 0 recovers pure bottom, f -> 1 closes the bottom channel.
 *
 * Derivation only. Changes no bound; diagonalizes nothing. The strict gap stays with the analytic
 * no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: baked real-spectrum literals transcribed IDENTICALLY from imp-96227 (which took them from the
 * imp-96188 / imp-96204 / imp-96206 FFT-Mellin port) + pure closed-form arithmetic; no imports, no zeros
 * bundle. Assertions reproduce the closed forms and check them against a from-scratch bisection of U = 1.
 */

export const IMP_96243_LAM_TOP = 0.9999731;            // t: top of the semilocal spectrum (< 1)
export const IMP_96243_LAM_ADJ = 0.6202012;            // p: adjacent second-largest signed eigenvalue (gap floor)
export const IMP_96243_LAM_BOT = -0.9927022;           // q: bottom-twin near-modulus-1 eigenvalue
export const IMP_96243_SQRT3_OVER_2 = Math.sqrt(3) / 2; // 0.8660254037844386 -- the derived coupling constant

/** The single quadratic whose roots are 1 and alpha: Q(lam) = (lam - 1)(lam - alpha). Every certify-boundary
 *  coefficient is this Q evaluated at the corresponding eigenvalue (see the derivation header). */
export function certifyQuadratic(lam, alpha) {
  return (lam - 1) * (lam - alpha);
}

/** Closed-form coefficients of the EXACT linear certify boundary A x + B y = delta in (x, y) = (eps_a^2,
 *  eps_b^2), derived from the Kato-Temple U = 1 condition. All three are positive at an interior anchor. */
export function certifyBoundaryCoefficients(
  alpha,
  t = IMP_96243_LAM_TOP,
  p = IMP_96243_LAM_ADJ,
  q = IMP_96243_LAM_BOT,
) {
  return {
    A: certifyQuadratic(p, alpha),        // coefficient of eps_a^2  = (p-1)(p-alpha) > 0
    B: certifyQuadratic(q, alpha),        // coefficient of eps_b^2  = (q-1)(q-alpha) > 0
    delta: -certifyQuadratic(t, alpha),   // constant budget = (1-t)(t-alpha) > 0
  };
}

/** Closed-form pure-bottom threshold b0 = sqrt(delta/B) (eps_a = 0). */
export function pureBottomClosed(alpha) {
  const { B, delta } = certifyBoundaryCoefficients(alpha);
  return Math.sqrt(delta / B);
}

/** Closed-form pure-adjacent threshold a0 = sqrt(delta/A) (eps_b = 0). */
export function pureAdjacentClosed(alpha) {
  const { A, delta } = certifyBoundaryCoefficients(alpha);
  return Math.sqrt(delta / A);
}

/** Closed-form bottom threshold once a fraction f of the pure-adjacent threshold is spent on eps_a:
 *  eps_b = sqrt(1 - f^2) * b0. At f = 1/2 this is the derived sqrt(3)/2 coupling. */
export function bottomAfterFractionClosed(alpha, f) {
  return Math.sqrt(1 - f * f) * pureBottomClosed(alpha);
}

// ---- independent from-scratch check: bisection of the Kato-Temple U = 1 boundary (NOT reusing imp-96227)
function katoTempleU(epsA, epsB, alpha, t = IMP_96243_LAM_TOP, p = IMP_96243_LAM_ADJ, q = IMP_96243_LAM_BOT) {
  const s0 = 1 + epsA * epsA + epsB * epsB;
  const s1 = t + epsA * epsA * p + epsB * epsB * q;
  const s2 = t * t + epsA * epsA * p * p + epsB * epsB * q * q;
  const R = s1 / s0;
  const sigma2 = s2 / s0 - R * R;
  return { U: R + sigma2 / (R - alpha), valid: R > alpha };
}
function maxBottomBisect(epsA, alpha) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleU(epsA, m, alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}
function maxAdjacentBisect(epsB, alpha) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleU(m, epsB, alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

// Anchors sampled by imp-96227 across the admissible gap (lam_2, lam_top).
export const IMP_96243_ANCHORS = Object.freeze([0.65, 0.70, 0.75, 0.81008715, 0.85, 0.90, 0.95]);

export const IMP_96243_DERIVATION = Object.freeze({
  id: 'imp-96243-route-i-kato-temple-coupling-derivation',
  route: 'I (Sonine refinement) — derive analytically why the imp-96227 per-channel coupling is exactly sqrt(3)/2 at every interior anchor',
  parents: [
    'src/data/imp-96227-route-i-kato-temple-joint-anchor-sweep.js (measured the anchor-invariant sqrt(3)/2 coupling)',
    'src/data/imp-96206-route-i-kato-temple-joint-leak.js (midpoint 1.033e-3/1.192e-3 = 0.866 reading)',
  ],
  status: 'DERIVATION — the Kato-Temple certify boundary U = 1 for the 3-level ansatz [1, eps_a, eps_b] on {lam_top, lam_adj, lam_bot} factors EXACTLY as s0 * [ (t-1)(t-alpha) + (p-1)(p-alpha) eps_a^2 + (q-1)(q-alpha) eps_b^2 ] = 0, so with s0 > 0 the boundary is a straight LINE A x + B y = delta in the squared-overlap coordinates (x, y) = (eps_a^2, eps_b^2) with A = (1-p)(alpha-p) > 0, B = (1-q)(alpha-q) > 0, delta = (1-t)(t-alpha) > 0 -- an exact ellipse in (eps_a, eps_b), no small-overlap approximation. Pure thresholds are b0 = sqrt(delta/B), a0 = sqrt(delta/A). Spending eps_a = a0/2 consumes A*(a0/2)^2 = delta/4, exactly a quarter of the linear budget, leaving (3/4)*delta for the bottom channel, so b_half^2 = (3/4) b0^2 and b_half/b0 = sqrt(3)/2 EXACTLY. Both delta and B cancel -- the ratio depends only on the FRACTION (1/4) of the squared budget spent, hence anchor-invariant (indeed eigenvalue-pair invariant): sqrt(3)/2 = sqrt(1 - (1/2)^2) is the 60-degree point on the certify ellipse, and the imp-96206 midpoint 0.866 is not special. Corollaries fall out of the same line: worst-case direction is pure-bottom because B > A so b0 < a0 is the ellipse minimum, and the equal-split ratio is sqrt(B/(A+B)). Derivation only; changes no bound; the strict gap stays with the analytic no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave); RH open; no refereed bound is changed; NO QED',
  keyIdentity: 'U = 1  <=>  s0 * [ (t-1)(t-alpha) + (p-1)(p-alpha) eps_a^2 + (q-1)(q-alpha) eps_b^2 ] = 0  (the s1^2 cross-terms cancel; every coefficient is Q(lam) = (lam-1)(lam-alpha))',
  couplingResult: 'b_half/b0 = sqrt(3)/2 exactly and anchor-invariantly, because eps_a = a0/2 spends exactly 1/4 of the linear budget A x + B y = delta, leaving 3/4 for eps_b^2; sqrt(3)/2 = sqrt(1 - 1/4)',
  generalFraction: 'spending eps_a = f * a0 leaves eps_b = sqrt(1 - f^2) * b0 for any f in [0,1]; f = 1/2 gives the measured sqrt(3)/2, f -> 0 recovers pure bottom, f -> 1 closes the bottom channel',
  honestLimits: 'the derivation is exact for the stated 3-level [1, eps_a, eps_b] Kato-Temple model on the three near-modulus-1-relevant eigenvalues, using the same baked FFT-Mellin Rayleigh-Ritz N=32 spectrum literals as imp-96227 (not a rigorous enclosure). It explains the measured constant; it does NOT diagonalize A, move a Lambda bound, or relax the obstruction -- the joint region stays pinned at O(1e-3) exactly as imp-96227 found. RH open; NO QED',
});

// ---- assertions (import-light; run < 0.5 s)
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96243_DERIVATION_ASSERTIONS = Object.freeze([
  {
    id: 'imp96243-boundary-factors-exactly-linear',
    description: 'the closed-form linear boundary A eps_a^2 + B eps_b^2 = delta reproduces the Kato-Temple U = 1 condition exactly: on the derived boundary point (eps_a=0, eps_b=b0) the from-scratch U equals 1 to ~1e-9 at every anchor',
    holds: () => IMP_96243_ANCHORS.every((alpha) => {
      const b0 = pureBottomClosed(alpha);
      const { U } = katoTempleU(0, b0, alpha);
      return approx(U, 1, 1e-9);
    }),
  },
  {
    id: 'imp96243-closed-form-matches-bisection',
    description: 'the closed-form pure-bottom b0 = sqrt(delta/B) and pure-adjacent a0 = sqrt(delta/A) match an independent from-scratch bisection of U = 1 at every anchor',
    holds: () => IMP_96243_ANCHORS.every((alpha) => {
      const b0c = pureBottomClosed(alpha), a0c = pureAdjacentClosed(alpha);
      const b0n = maxBottomBisect(0, alpha), a0n = maxAdjacentBisect(0, alpha);
      return approx(b0c, b0n, 1e-9) && approx(a0c, a0n, 1e-9);
    }),
  },
  {
    id: 'imp96243-coupling-derived-sqrt3over2',
    description: 'the derived half-adjacent coupling b_half/b0 equals sqrt(3)/2 exactly at every anchor, both from the closed form and from a from-scratch bisection (bottom threshold at eps_a = half the pure-adjacent threshold)',
    holds: () => IMP_96243_ANCHORS.every((alpha) => {
      const closed = bottomAfterFractionClosed(alpha, 0.5) / pureBottomClosed(alpha);
      const a0 = maxAdjacentBisect(0, alpha);
      const bisect = maxBottomBisect(a0 / 2, alpha) / maxBottomBisect(0, alpha);
      return approx(closed, IMP_96243_SQRT3_OVER_2, 1e-12) && approx(bisect, IMP_96243_SQRT3_OVER_2, 1e-8);
    }),
  },
  {
    id: 'imp96243-boundary-coeffs-positive-and-ordered',
    description: 'at every interior anchor the boundary coefficients satisfy A > 0, B > 0, delta > 0 and B > A (so the ellipse minimum is pure-bottom, b0 < a0), reproducing the imp-96227 pure-bottom worst-case direction',
    holds: () => IMP_96243_ANCHORS.every((alpha) => {
      const { A, B, delta } = certifyBoundaryCoefficients(alpha);
      return A > 0 && B > 0 && delta > 0 && B > A && pureBottomClosed(alpha) < pureAdjacentClosed(alpha);
    }),
  },
  {
    id: 'imp96243-reproduces-imp96227-midpoint',
    description: 'the closed forms reproduce the imp-96227 midpoint (alpha = 0.81008715) baked values: botPure ~ 1.192419e-3 and botHalfAdj ~ 1.032665e-3, whose ratio is sqrt(3)/2',
    holds: () => {
      const alpha = 0.81008715;
      const b0 = pureBottomClosed(alpha);
      const bHalf = bottomAfterFractionClosed(alpha, 0.5);
      return approx(b0, 1.192419e-3, 1e-7) && approx(bHalf, 1.032665e-3, 1e-7) && approx(bHalf / b0, IMP_96243_SQRT3_OVER_2, 1e-12);
    },
  },
  {
    id: 'imp96243-derivation-honesty',
    description: 'status records a DERIVATION with the exact linear-boundary factorization and the sqrt(3)/2 origin, routes the strict gap back to the analytic SG-96164-boundary / SG-96181-edge-octave, names the calibration honestly, and asserts RH open / NO QED',
    holds: () => /DERIVATION/.test(IMP_96243_DERIVATION.status)
      && /sqrt\(3\)\/2/.test(IMP_96243_DERIVATION.status)
      && /anchor-invariant/.test(IMP_96243_DERIVATION.status)
      && /SG-96164-boundary/.test(IMP_96243_DERIVATION.status)
      && /NO QED/.test(IMP_96243_DERIVATION.status)
      && /not a rigorous enclosure/.test(IMP_96243_DERIVATION.honestLimits)
      && /RH open/.test(IMP_96243_DERIVATION.honestLimits),
  },
]);

export default IMP_96243_DERIVATION;
