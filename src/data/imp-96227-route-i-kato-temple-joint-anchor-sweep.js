/**
 * imp-96227 (2026-09-23) — NUMERICAL/MEASUREMENT: sweep the imp-96206 3-level JOINT (eps_a, eps_b)
 * Kato-Temple certify region across the admissible anchor alpha. imp-96206 measured the joint region at
 * only the gap-midpoint anchor alpha = 0.81008715; imp-96205 anchor-swept only the SEPARATE two-level
 * thresholds. This ticket combines them: sweep alpha across (lam_2, lam_top) for the coupled 3-level bound
 * and tabulate how the worst-case pure-bottom threshold, the equal-split per-channel boundary, and the
 * coupling strength (per-channel tightening) move with the anchor.
 * VERDICT: the joint coupled region stays pinned at O(1e-3) for EVERY admissible anchor.
 *   (1) The joint worst-case direction stays PURE-BOTTOM (theta = 90 deg) at every anchor, so the joint
 *       worst-case total-magnitude threshold EQUALS the separate bottom-twin threshold at every alpha
 *       (identical to the imp-96205 botEps column): supremum ~1.7828e-3 at the low-anchor edge, 1.192e-3 at
 *       the midpoint, decreasing to ~5.893e-4 near lam_top. It never falls below the bottom-twin threshold
 *       and never lifts off O(1e-3) anywhere in the gap.
 *   (2) The equal-split per-channel boundary tracks just below the pure-bottom threshold at every anchor
 *       (ratio ~0.984-0.998, rising toward the low-anchor edge), so equal-split stays O(1e-3) too.
 *   (3) The COUPLING STRENGTH is ANCHOR-INVARIANT: the per-channel tightening at eps_a = half the
 *       anchor-specific adjacent threshold is EXACTLY sqrt(3)/2 ~ 0.8660254 at every interior anchor (the
 *       bottom tolerance drops to 86.6 pct of its pure value), reproduced to ~1e-11. The imp-96206 midpoint
 *       reading 1.033e-3 / 1.192e-3 = 0.866 is NOT special — the coupling is the same at every anchor.
 * Net: combining both leak channels AND sweeping the anchor buys nothing; the joint region stays pinned at
 * O(1e-3) everywhere. The variational route stays obstructed and the strict gap stays with the analytic
 * no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). RH open; no refereed bound is changed; NO QED.
 * Measurement only; changes no bound; diagonalizes nothing.
 *
 * ---------------------------------------------------------------------------------------------------
 * SETUP (unchanged from imp-96188 / imp-96205 / imp-96206). For the self-adjoint semilocal prolate
 *  operator A = P_1 F_S P_1 (S = {oo, 2}) the only variational UPPER bound on the isolated top eigenvalue
 *  lam_top from a test function psi is the Kato-Temple gap inequality: with a lower bound alpha strictly in
 *  the spectral gap (lam_2 <= alpha < lam_top) and R(psi) > alpha,
 *     lam_top <= U(psi) := R(psi) + sigma^2(psi) / (R(psi) - alpha),
 *     R = <psi,A psi>/<psi,psi>,  sigma^2 = <psi,A^2 psi>/<psi,psi> - R^2.
 *  The 3-level ansatz psi = [1, eps_a, eps_b] on {lam_top = 0.9999731, lam_2 = 0.6202012,
 *  lam_S(1) = -0.9927022} opens both leak channels at once (s0 = 1 + eps_a^2 + eps_b^2, etc.). imp-96206
 *  measured the coupled (eps_a, eps_b) certify region at the single midpoint anchor 0.81008715; this ticket
 *  sweeps the SAME region across the whole admissible gap.
 *
 * THE JOINT ANCHOR SWEEP (reproduced in the assertions below). Sampling alpha across (lam_2, lam_top):
 *   - WORST-CASE DIRECTION STAYS PURE-BOTTOM. Minimising the total-magnitude certify threshold
 *     t*(theta) = threshold on sqrt(eps_a^2 + eps_b^2) along direction theta over theta in [0, pi/2], the
 *     minimum is attained at theta = 90 deg (pure bottom-twin) at EVERY anchor, because the adjacent channel
 *     is ~7x cheaper in sigma^2 per unit overlap^2 uniformly in alpha. So the joint worst-case
 *     total-magnitude threshold equals the SEPARATE bottom-twin threshold botEps(alpha) at every anchor,
 *     inheriting the imp-96205 monotone decrease from ~1.7828e-3 (low edge) to 0 (top edge). It never falls
 *     below the bottom-twin threshold; the joint region does not loosen the obstruction at any anchor.
 *   - EQUAL-SPLIT BOUNDARY TRACKS JUST BELOW. On the ray eps_a = eps_b the per-channel boundary sits just
 *     under the pure-bottom threshold (ratio es/botPure rising monotonically from ~0.9842 near lam_top to
 *     ~0.9983 near the low edge), so the equal-split constraint is uniformly O(1e-3) across the gap.
 *   - COUPLING STRENGTH IS ANCHOR-INVARIANT. The per-channel tightening ratio
 *     maxTolerableBottom(adjThresh(alpha)/2) / maxTolerableBottom(0) — the fraction the bottom tolerance
 *     retains once a simultaneous adjacent leak equal to HALF that anchor's own pure-adjacent threshold is
 *     spent — equals sqrt(3)/2 ~ 0.8660254 EXACTLY at every interior anchor (reproduced to ~1e-11). The
 *     coupling geometry of the region is thus anchor-independent even though the absolute thresholds shrink.
 *
 * NET / RESIDUAL ROUTING. Sweeping the anchor over the whole gap does NOT relax the joint coupled region off
 *  O(1e-3): the pure-bottom worst case, the equal-split boundary, and the anchor-invariant sqrt(3)/2 coupling
 *  all stay pinned. Opening both channels and choosing the anchor jointly buys nothing over the midpoint
 *  reading. The variational route stays obstructed and the strict gap stays with the analytic no-modulus-1
 *  route (SG-96164-boundary / SG-96181-edge-octave). Nothing here diagonalizes A, moves a Lambda bound, or a
 *  verified height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: baked real-spectrum literals (lam_top, lam_2, lam_S(1) transcribed IDENTICALLY from the
 *  imp-96188 / imp-96204 / imp-96206 FFT-Mellin port) + pure linear-algebra arithmetic in the eigenbasis; no
 *  imports, no zeros bundle. Reproduction inline in the assertions (joint anchor-swept region recalibration).
 */

export const IMP_96227_LAM_TOP = 0.9999731;      // top of the semilocal spectrum (< 1)
export const IMP_96227_LAM_SECOND_SIGNED = 0.6202012;  // adjacent second-largest SIGNED eigenvalue (gap floor)
export const IMP_96227_LAM_BOTTOM = -0.9927022;  // bottom-twin: second near-modulus-1 eigenvalue
export const IMP_96227_MIDPOINT_ANCHOR = 0.81008715;   // imp-96206 gap-midpoint reference anchor

/** Kato-Temple UPPER bound on the top eigenvalue from a 3-level test function [1, epsA, epsB] on
 *  {lam_top, lam_2 (adjacent), lam_S(1) (bottom-twin)}; both leak channels open at once. */
export function katoTempleUpperThreeLevel(
  epsA, epsB, alpha,
  lamTop = IMP_96227_LAM_TOP,
  lamAdj = IMP_96227_LAM_SECOND_SIGNED,
  lamBot = IMP_96227_LAM_BOTTOM,
) {
  const s0 = 1 + epsA * epsA + epsB * epsB;
  const s1 = lamTop + epsA * epsA * lamAdj + epsB * epsB * lamBot;
  const s2 = lamTop * lamTop + epsA * epsA * lamAdj * lamAdj + epsB * epsB * lamBot * lamBot;
  const R = s1 / s0;
  const sigma2 = s2 / s0 - R * R;
  return { R, sigma2, U: R + sigma2 / (R - alpha), valid: R > alpha };
}

/** Max tolerable bottom overlap eps_b (U < 1) holding the adjacent leak eps_a fixed, at anchor alpha. */
export function maxTolerableBottom(epsA, alpha) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperThreeLevel(epsA, m, alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

/** Max tolerable adjacent overlap eps_a (U < 1) holding the bottom leak eps_b fixed, at anchor alpha.
 *  hi = 0.5 caps the diverging/non-binding adjacent threshold at the low-anchor edge (alpha -> lam_2+). */
export function maxTolerableAdjacent(epsB, alpha) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperThreeLevel(m, epsB, alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

/** Certify threshold on the TOTAL overlap magnitude t = sqrt(epsA^2 + epsB^2) along direction theta. */
export function directionThreshold(theta, alpha) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperThreeLevel(m * Math.cos(theta), m * Math.sin(theta), alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

/** Worst-case (minimum) total-magnitude threshold over all leak directions theta in [0, pi/2], at anchor alpha. */
export function jointWorstCaseThreshold(alpha, samples = 2000) {
  let worst = Infinity, worstTheta = 0;
  for (let i = 0; i <= samples; i++) {
    const theta = (Math.PI / 2) * i / samples;
    const t = directionThreshold(theta, alpha);
    if (t < worst) { worst = t; worstTheta = theta; }
  }
  return { worst, worstTheta, deg: worstTheta * 180 / Math.PI };
}

/** Equal-split per-channel boundary eps_a = eps_b (U < 1) at anchor alpha. */
export function equalSplitBoundary(alpha) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperThreeLevel(m, m, alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

// Joint (eps_a, eps_b) certify region swept across the anchor alpha in (lam_2, lam_top).
//  worstMag  = jointWorstCaseThreshold (total-magnitude, pure-bottom direction) — equals the bottom-twin botEps
//  worstDeg  = worst-case direction (90 = pure bottom-twin) at every anchor
//  equalSplit = per-channel boundary on the eps_a = eps_b ray
//  botPure   = pure-bottom tolerance maxTolerableBottom(0)
//  botHalfAdj = bottom tolerance once eps_a = half the anchor-specific pure-adjacent threshold
//  tighten   = botHalfAdj / botPure — the coupling strength, anchor-invariant sqrt(3)/2 ~ 0.8660254
export const IMP_96227_JOINT_ANCHOR_SWEEP = Object.freeze([
  { alpha: 0.65,       worstMag: 1.695871e-3, worstDeg: 90, equalSplit: 1.692947e-3, botPure: 1.695871e-3, botHalfAdj: 1.468667e-3, tighten: 0.8660254 },
  { alpha: 0.70,       worstMag: 1.546699e-3, worstDeg: 90, equalSplit: 1.539797e-3, botPure: 1.546699e-3, botHalfAdj: 1.339481e-3, tighten: 0.8660254 },
  { alpha: 0.75,       worstMag: 1.391522e-3, worstDeg: 90, equalSplit: 1.381749e-3, botPure: 1.391522e-3, botHalfAdj: 1.205093e-3, tighten: 0.8660254 },
  { alpha: 0.81008715, worstMag: 1.192419e-3, worstDeg: 90, equalSplit: 1.180627e-3, botPure: 1.192419e-3, botHalfAdj: 1.032665e-3, tighten: 0.8660254 }, // imp-96206 midpoint
  { alpha: 0.85,       worstMag: 1.048176e-3, worstDeg: 90, equalSplit: 1.035937e-3, botPure: 1.048176e-3, botHalfAdj: 9.077467e-4, tighten: 0.8660254 },
  { alpha: 0.90,       worstMag: 8.444139e-4, worstDeg: 90, equalSplit: 8.327635e-4, botPure: 8.444139e-4, botHalfAdj: 7.312839e-4, tighten: 0.8660254 },
  { alpha: 0.95,       worstMag: 5.892776e-4, worstDeg: 90, equalSplit: 5.799696e-4, botPure: 5.892776e-4, botHalfAdj: 5.103294e-4, tighten: 0.8660254 },
]);

export const IMP_96227_LITERALS = Object.freeze({
  lamTop: 0.9999731,
  lamSecondSigned: 0.6202012,
  lamBottomTwin: -0.9927022,
  midpointAnchor: 0.81008715,
  worstDirectionDeg: 90,                 // pure bottom-twin at EVERY admissible anchor
  worstMagLowEdge: 0.0017828392,         // sup at alpha -> lam_2+ (inherits imp-96205 bottom-twin supremum)
  worstMagMidpoint: 0.001192419,         // imp-96206 midpoint reference
  worstMagNearTop: 0.0005892776,         // alpha = 0.95: still O(1e-3), never lifts off
  couplingTightenRatio: 0.8660254038,    // sqrt(3)/2 — ANCHOR-INVARIANT per-channel tightening at half-adjacent leak
  equalSplitOverBotPureLow: 0.99827576,  // es/botPure near the low-anchor edge (alpha = 0.65)
  equalSplitOverBotPureHigh: 0.98420433, // es/botPure near lam_top (alpha = 0.95)
  verdict: 'the joint coupled region stays pinned at O(1e-3) for EVERY admissible anchor: the worst-case direction stays pure-bottom (90 deg) so the joint total-magnitude threshold equals the separate bottom-twin threshold at every alpha (sup 1.7828e-3 low edge, 1.192e-3 midpoint, 5.893e-4 near top, never below the bottom-twin), the equal-split boundary tracks just below it, and the coupling strength is anchor-INVARIANT at exactly sqrt(3)/2 ~ 0.8660254 — the imp-96206 midpoint 0.866 reading is not special; combining both channels and sweeping the anchor buys nothing',
});

export const IMP_96227_ASSESSMENT = Object.freeze({
  id: 'imp-96227-route-i-kato-temple-joint-anchor-sweep',
  route: 'I (Sonine refinement) — sweep the imp-96206 3-level JOINT (eps_a, eps_b) Kato-Temple certify region across the admissible anchor alpha and tabulate the pure-bottom worst case, the equal-split boundary, and the coupling strength',
  parents: [
    'src/data/imp-96206-route-i-kato-temple-joint-leak.js (joint certify region at the single midpoint anchor)',
    'src/data/imp-96205-route-i-kato-temple-anchor-sensitivity.js (SEPARATE two-level thresholds anchor-swept)',
  ],
  status: 'MEASUREMENT — combining the imp-96205 anchor sweep with the imp-96206 3-level JOINT region: sweeping alpha across the admissible gap (0.6202012, 0.9999731) for the coupled (eps_a, eps_b) [1, eps_a, eps_b] ansatz on {lam_top = 0.9999731, lam_2 = 0.6202012, lam_S(1) = -0.9927022} shows the joint coupled region stays pinned at O(1e-3) for EVERY admissible anchor. (1) The joint worst-case direction stays PURE-BOTTOM (theta = 90 deg) at every anchor, so the joint worst-case total-magnitude threshold EQUALS the separate bottom-twin threshold at every alpha (identical to the imp-96205 botEps column): sup ~1.7828e-3 at the low-anchor edge, 1.192e-3 at the midpoint, decreasing to ~5.893e-4 near lam_top, never below the bottom-twin threshold and never off O(1e-3). (2) The equal-split per-channel boundary tracks just below the pure-bottom threshold at every anchor (es/botPure ~0.9842 near lam_top rising to ~0.9983 near the low edge). (3) The COUPLING STRENGTH is ANCHOR-INVARIANT: the per-channel tightening at eps_a = half the anchor-specific adjacent threshold equals sqrt(3)/2 ~ 0.8660254 EXACTLY at every interior anchor (to ~1e-11), so the imp-96206 midpoint 0.866 reading is not special. Net: combining both channels and sweeping the anchor buys nothing; the variational route stays obstructed and the strict gap stays with the analytic no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). Measurement only; no bound moved; RH open; no refereed bound is changed; NO QED',
  worstCaseFinding: 'the joint worst-case direction stays pure-bottom (theta = 90 deg) at every admissible anchor, so the joint total-magnitude threshold equals the separate imp-96205 bottom-twin threshold botEps(alpha) at every alpha — never falling below it and staying O(1e-3) throughout (sup 1.7828e-3 low edge, 1.192e-3 midpoint, 5.893e-4 near top)',
  equalSplitFinding: 'the equal-split per-channel boundary tracks just below the pure-bottom threshold at every anchor; the ratio es/botPure rises monotonically from ~0.9842 near lam_top to ~0.9983 near the low-anchor edge, so equal-split stays uniformly O(1e-3) across the gap',
  couplingFinding: 'the coupling strength is anchor-INVARIANT: the per-channel tightening maxTolerableBottom(adjThresh/2) / maxTolerableBottom(0) equals sqrt(3)/2 ~ 0.8660254 at every interior anchor (reproduced to ~1e-11), so the region geometry is anchor-independent and the imp-96206 midpoint 0.866 reading is not special',
  honestLimits: 'the sweep uses the exact FFT-Mellin semilocal {oo,2} spectrum (baked literals identical to imp-96188 / imp-96204 / imp-96206, not a rigorous enclosure — Rayleigh-Ritz N = 32 numbers) and the same 3-level single-magnitude-per-channel [1, eps_a, eps_b] ansatz on the three near-modulus-1-relevant eigenvalues only (a lower bound on the sigma^2 an actual dyadic-grid ansatz leaking into the full tail would incur, so the real thresholds are at most this relaxed). The low-anchor edge alpha -> lam_2+ is a supremum, not attained. Nothing here diagonalizes A, moves a Lambda bound, or a verified height; RH open; NO QED',
});

// ---- assertions (reproduce the joint anchor sweep; import-light; run < 0.5 s)
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96227_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96227-sweep-table-reproduces',
    description: 'the baked joint anchor-sweep table reproduces the live pure-bottom threshold, equal-split boundary, and half-adjacent bottom tolerance at every sampled anchor',
    holds: () => IMP_96227_JOINT_ANCHOR_SWEEP.every((row) => {
      const botPure = maxTolerableBottom(0, row.alpha);
      const adjHalf = maxTolerableAdjacent(0, row.alpha) / 2;
      const botHalf = maxTolerableBottom(adjHalf, row.alpha);
      const es = equalSplitBoundary(row.alpha);
      return approx(botPure, row.botPure, 1e-7)
        && approx(botPure, row.worstMag, 1e-7)   // pure-bottom threshold IS the worst-case total magnitude
        && approx(botHalf, row.botHalfAdj, 1e-7)
        && approx(es, row.equalSplit, 1e-7);
    }),
  },
  {
    id: 'imp96227-worst-direction-pure-bottom-every-anchor',
    description: 'the joint worst-case leak direction is PURE-BOTTOM (theta = 90 deg) at every admissible anchor, so the joint total-magnitude threshold equals the separate bottom-twin threshold and never falls below it anywhere in the gap',
    holds: () => IMP_96227_JOINT_ANCHOR_SWEEP.every((row) => {
      const j = jointWorstCaseThreshold(row.alpha, 2000);
      return approx(j.deg, 90, 0.1) && approx(j.worst, row.botPure, 1e-7);
    }),
  },
  {
    id: 'imp96227-coupling-anchor-invariant-sqrt3over2',
    description: 'the per-channel coupling strength maxTolerableBottom(adjThresh/2)/maxTolerableBottom(0) is anchor-INVARIANT at exactly sqrt(3)/2 ~ 0.8660254 at every interior anchor (reproduced to ~1e-9)',
    holds: () => {
      const target = Math.sqrt(3) / 2;
      return IMP_96227_JOINT_ANCHOR_SWEEP.every((row) => {
        const botPure = maxTolerableBottom(0, row.alpha);
        const adjHalf = maxTolerableAdjacent(0, row.alpha) / 2;
        const botHalf = maxTolerableBottom(adjHalf, row.alpha);
        return approx(botHalf / botPure, target, 1e-9);
      });
    },
  },
  {
    id: 'imp96227-region-pinned-O1e-3-every-anchor',
    description: 'the joint coupled region stays pinned at O(1e-3) across the whole gap: the worst-case threshold decreases monotonically in alpha but never lifts off O(1e-3) (sup ~1.7828e-3 low edge, ~5.893e-4 near top), and the equal-split boundary stays just below it at every anchor',
    holds: () => {
      let prev = Infinity;
      for (const row of IMP_96227_JOINT_ANCHOR_SWEEP) {
        if (row.worstMag >= prev) return false;       // monotone decreasing in alpha
        if (row.worstMag > 2e-3 || row.worstMag < 5e-4) return false; // stays O(1e-3)
        if (!(row.equalSplit < row.worstMag)) return false;           // equal-split just below pure-bottom
        prev = row.worstMag;
      }
      // low-anchor-edge supremum recovers the imp-96205 bottom-twin supremum
      return approx(maxTolerableBottom(0, IMP_96227_LAM_SECOND_SIGNED + 1e-9), 0.0017828392, 1e-6);
    },
  },
  {
    id: 'imp96227-verdict-honesty',
    description: 'status records a MEASUREMENT: the joint region stays pinned at O(1e-3) for every anchor with an anchor-invariant sqrt(3)/2 coupling, routes the strict gap back to the analytic SG-96164-boundary / SG-96181-edge-octave, names the calibration honestly, and asserts RH open / NO QED',
    holds: () => /MEASUREMENT/.test(IMP_96227_ASSESSMENT.status)
      && /pinned at O\(1e-3\)/.test(IMP_96227_ASSESSMENT.status)
      && /PURE-BOTTOM/.test(IMP_96227_ASSESSMENT.status)
      && /ANCHOR-INVARIANT/.test(IMP_96227_ASSESSMENT.status)
      && /sqrt\(3\)\/2/.test(IMP_96227_ASSESSMENT.status)
      && /SG-96164-boundary/.test(IMP_96227_ASSESSMENT.status)
      && /NO QED/.test(IMP_96227_ASSESSMENT.status)
      && /not a rigorous enclosure/.test(IMP_96227_ASSESSMENT.honestLimits)
      && /RH open/.test(IMP_96227_ASSESSMENT.honestLimits),
  },
]);

export default IMP_96227_ASSESSMENT;
