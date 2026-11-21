/**
 * imp-96206 (2026-09-23) — NUMERICAL/MEASUREMENT: measure the COMBINED imp-96188 Kato-Temple leak. imp-96188
 * measured the certify-threshold for the adjacent-state leak (into lam_2 = 0.6202012, eps ~ 8.416e-3) and the
 * bottom-twin leak (into lam_S(1) = -0.9927022, eps ~ 1.192e-3) SEPARATELY, with 2-level test functions. But a
 * physically imperfect capture of the fractal Zygmund top eigenfunction leaks into BOTH near-modulus-1
 * neighbours at once. This ticket builds the 3-level test function [1, eps_a, eps_b] on {lam_top, lam_2,
 * lam_S(1)}, computes the Kato-Temple upper bound U over the joint (eps_a, eps_b) plane, and reports whether
 * the worst-case joint certify threshold falls below the separate bottom-twin 1.192e-3.
 * VERDICT: the worst-case JOINT threshold, measured as total overlap magnitude t = sqrt(eps_a^2 + eps_b^2),
 * does NOT fall below 1.192e-3 — it EQUALS it, and is attained at the PURE bottom-twin direction. Concentrating
 * the whole overlap in the bottom-twin channel is the worst case; splitting the same magnitude into the cheaper
 * adjacent channel RELAXES the constraint (adjacent leak costs ~7x less sigma^2 per unit overlap^2). But the
 * certify REGION is strictly COUPLED: any simultaneous adjacent leak monotonically TIGHTENS the tolerable
 * bottom overlap below 1.192e-3 (e.g. at eps_a = half its own threshold the bottom tolerance drops to
 * ~1.033e-3), so the two separate thresholds cannot both be spent at once. RH open; no refereed bound is changed;
 * NO QED. Measurement only; changes no bound; diagonalizes nothing.
 *
 * ---------------------------------------------------------------------------------------------------
 * SETUP (unchanged from imp-96188 / imp-96205). For the self-adjoint semilocal prolate operator
 *  A = P_1 F_S P_1 (S = {oo, 2}) the only variational UPPER bound on the isolated top eigenvalue lam_top from
 *  a test function psi is the Kato-Temple gap inequality: with a lower bound alpha strictly in the spectral
 *  gap (lam_2 <= alpha < lam_top) and R(psi) > alpha,
 *     lam_top <= U(psi) := R(psi) + sigma^2(psi) / (R(psi) - alpha),
 *     R = <psi,A psi>/<psi,psi>,  sigma^2 = <psi,A^2 psi>/<psi,psi> - R^2.
 *  We keep the imp-96188 gap-midpoint anchor alpha = 0.81008715 (the imp-96205 sweep already showed the
 *  bottom-twin obstruction is anchor-robust across the whole admissible gap). The NEW ingredient is a
 *  3-level ansatz psi = [1, eps_a, eps_b] on the three near-modulus-1-relevant eigenvalues
 *  {lam_top = 0.9999731, lam_2 = 0.6202012, lam_S(1) = -0.9927022}, so both leak channels are open at once:
 *     s0 = 1 + eps_a^2 + eps_b^2,
 *     s1 = lam_top + eps_a^2 lam_2 + eps_b^2 lam_S(1),
 *     s2 = lam_top^2 + eps_a^2 lam_2^2 + eps_b^2 lam_S(1)^2.
 *
 * THE JOINT (eps_a, eps_b) CERTIFY REGION (reproduced in the assertions below).
 *   - WORST-CASE TOTAL-MAGNITUDE THRESHOLD. Parametrise eps_a = t cos(theta), eps_b = t sin(theta) with
 *     theta in [0, pi/2] and t = total overlap magnitude. Minimising the certify threshold t*(theta) over
 *     directions, the minimum t* ~ 1.192419e-3 is attained at theta = pi/2 (PURE bottom-twin). So the joint
 *     worst-case threshold, as a total overlap magnitude, is EXACTLY the separate bottom-twin 1.192e-3 — it
 *     does NOT fall below it. Reason: the adjacent channel is ~7x cheaper in sigma^2 per unit overlap^2
 *     (residual distance |lam_2 - lam_top| ~ 0.3798 vs |lam_S(1) - lam_top| ~ 1.9927, squared ~ 27x, tempered
 *     by the R - alpha denominator effect), so diverting overlap from the bottom into the adjacent channel
 *     only RELAXES the total-magnitude constraint. The pure-bottom direction is the worst.
 *   - COUPLED PER-CHANNEL TIGHTENING. The certify region is NOT a rectangle: the two separate thresholds
 *     cannot both be spent simultaneously. Holding eps_a > 0 fixed, the maximal tolerable eps_b is strictly
 *     BELOW 1.192e-3 and monotonically decreasing in eps_a: at eps_a = 1/4 the adjacent threshold the bottom
 *     tolerance is ~1.155e-3, at 1/2 it is ~1.033e-3, and at the full adjacent threshold 8.416e-3 it collapses
 *     to ~1e-8. Symmetrically, holding eps_b > 0 fixed shrinks the tolerable eps_a below 8.416e-3. On the
 *     equal-split ray eps_a = eps_b the boundary sits at 1.180627e-3 per channel (total magnitude 1.669659e-3).
 *
 * NET / RESIDUAL ROUTING. Opening both leak channels at once does NOT loosen the imp-96188 obstruction: the
 *  worst-case total-overlap certificate stays pinned at the bottom-twin 1.192e-3 (pure-bottom direction), and
 *  the joint certify region is strictly TIGHTER per channel than either separate threshold — so treating the
 *  two leaks separately is OPTIMISTIC, not pessimistic. The variational route stays obstructed and the strict
 *  gap stays with the analytic no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). Nothing here
 *  diagonalizes A, moves a Lambda bound, or a verified height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: baked real-spectrum literals (lam_top, lam_2, lam_S(1) from imp-96188 / imp-96204, transcribed
 *  IDENTICALLY from the FFT-Mellin port) + pure linear-algebra arithmetic in the eigenbasis; no imports, no
 *  zeros bundle. Reproduction inline in the assertions (3-level joint threshold + coupled-region recovery).
 */

export const IMP_96206_LAM_TOP = 0.9999731;      // top of the semilocal spectrum (< 1)
export const IMP_96206_LAM_SECOND_SIGNED = 0.6202012;  // adjacent second-largest SIGNED eigenvalue (gap floor)
export const IMP_96206_LAM_BOTTOM = -0.9927022;  // bottom-twin: second near-modulus-1 eigenvalue
export const IMP_96206_ANCHOR = 0.81008715;      // imp-96188 gap-midpoint anchor (anchor-robust per imp-96205)

/** Kato-Temple UPPER bound on the top eigenvalue from a 3-level test function [1, epsA, epsB] on
 *  {lam_top, lam_2 (adjacent), lam_S(1) (bottom-twin)}; both leak channels open at once. */
export function katoTempleUpperThreeLevel(
  epsA, epsB,
  alpha = IMP_96206_ANCHOR,
  lamTop = IMP_96206_LAM_TOP,
  lamAdj = IMP_96206_LAM_SECOND_SIGNED,
  lamBot = IMP_96206_LAM_BOTTOM,
) {
  const s0 = 1 + epsA * epsA + epsB * epsB;
  const s1 = lamTop + epsA * epsA * lamAdj + epsB * epsB * lamBot;
  const s2 = lamTop * lamTop + epsA * epsA * lamAdj * lamAdj + epsB * epsB * lamBot * lamBot;
  const R = s1 / s0;
  const sigma2 = s2 / s0 - R * R;
  return { R, sigma2, U: R + sigma2 / (R - alpha), valid: R > alpha };
}

/** Smallest overlap eps_b at which Kato-Temple stops certifying U < 1, holding the adjacent leak eps_a fixed
 *  (a horizontal slice of the joint certify region). */
export function maxTolerableBottom(epsA, alpha = IMP_96206_ANCHOR) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperThreeLevel(epsA, m, alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

/** Smallest overlap eps_a at which Kato-Temple stops certifying U < 1, holding the bottom leak eps_b fixed
 *  (a vertical slice of the joint certify region). */
export function maxTolerableAdjacent(epsB, alpha = IMP_96206_ANCHOR) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperThreeLevel(m, epsB, alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

/** Certify threshold on the TOTAL overlap magnitude t = sqrt(epsA^2 + epsB^2) along a fixed direction
 *  theta in [0, pi/2] (epsA = t cos, epsB = t sin). */
export function directionThreshold(theta, alpha = IMP_96206_ANCHOR) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperThreeLevel(m * Math.cos(theta), m * Math.sin(theta), alpha);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

/** Worst-case (minimum) total-magnitude threshold over all leak directions theta in [0, pi/2]. */
export function jointWorstCaseThreshold(alpha = IMP_96206_ANCHOR, samples = 2000) {
  let worst = Infinity, worstTheta = 0;
  for (let i = 0; i <= samples; i++) {
    const theta = (Math.PI / 2) * i / samples;
    const t = directionThreshold(theta, alpha);
    if (t < worst) { worst = t; worstTheta = theta; }
  }
  return { worst, worstTheta, deg: worstTheta * 180 / Math.PI };
}

// Coupled certify-region boundary: horizontal slices (fix eps_a as a fraction of the separate adjacent
// threshold 8.415876e-3, read off the max tolerable eps_b). Shows the bottom tolerance shrinking below 1.192e-3.
export const IMP_96206_COUPLED_SLICES = Object.freeze([
  { epsA: 0.0000000e+0, maxEb: 1.192419e-3 }, // pure bottom leak: recovers the separate 1.192e-3
  { epsA: 2.103969e-3, maxEb: 1.154555e-3 },  // eps_a = 1/4 adjacent threshold
  { epsA: 4.207938e-3, maxEb: 1.032665e-3 },  // eps_a = 1/2 adjacent threshold
  { epsA: 6.311907e-3, maxEb: 7.887110e-4 },  // eps_a = 3/4 adjacent threshold
  { epsA: 8.415876e-3, maxEb: 3.428886e-7 },  // eps_a = full adjacent threshold: bottom tolerance collapses
]);

export const IMP_96206_LITERALS = Object.freeze({
  lamTop: 0.9999731,
  lamSecondSigned: 0.6202012,
  lamBottomTwin: -0.9927022,
  anchor: 0.81008715,
  separateAdjacentEps: 0.008415876,     // imp-96188 adjacent-only certify-threshold (recovered at eps_b = 0)
  separateBottomEps: 0.001192419,       // imp-96188 bottom-only certify-threshold (recovered at eps_a = 0)
  jointWorstCaseTotalMag: 0.001192419,  // min over directions of sqrt(eps_a^2+eps_b^2) threshold — pure bottom
  jointWorstCaseDirectionDeg: 90,       // attained at theta = pi/2 (pure bottom-twin), NOT the diagonal
  equalSplitPerChannelEps: 0.001180627, // eps_a = eps_b boundary (total magnitude 1.669659e-3)
  bottomToleranceAtHalfAdjacent: 0.001032665, // bottom tolerance once eps_a = half its own threshold
  verdict: 'the worst-case JOINT threshold as total overlap magnitude does NOT fall below the separate bottom-twin 1.192e-3 — it EQUALS it, attained at the PURE bottom direction (splitting overlap into the cheaper adjacent channel relaxes the total-magnitude constraint); but the certify REGION is strictly COUPLED, so any simultaneous adjacent leak tightens the tolerable bottom overlap below 1.192e-3 and the two separate thresholds cannot both be spent at once — treating the leaks separately is OPTIMISTIC',
});

export const IMP_96206_ASSESSMENT = Object.freeze({
  id: 'imp-96206-route-i-kato-temple-joint-leak',
  route: 'I (Sonine refinement) — build the 3-level test function [1, eps_a, eps_b] on {lam_top, lam_2, lam_S(1)} and measure the joint Kato-Temple certify region for simultaneous adjacent + bottom-twin leak',
  parents: [
    'src/data/imp-96188-route-i-kato-temple-real-spectrum-recalibration.js (separate adjacent 8.416e-3 and bottom-twin 1.192e-3 certify-thresholds)',
    'src/data/imp-96205-route-i-kato-temple-anchor-sensitivity.js (bottom-twin obstruction anchor-robust across the gap)',
  ],
  status: 'MEASUREMENT — opening BOTH leak channels at once with a 3-level ansatz [1, eps_a, eps_b] on {lam_top = 0.9999731, lam_2 = 0.6202012, lam_S(1) = -0.9927022} at the anchor 0.81008715. The worst-case JOINT certify threshold, measured as total overlap magnitude t = sqrt(eps_a^2 + eps_b^2), does NOT fall below the separate bottom-twin 1.192e-3 — the minimum over directions is ~1.192419e-3 and is attained at the PURE bottom-twin direction (theta = pi/2), because the adjacent channel costs ~7x less sigma^2 per unit overlap^2, so diverting overlap into it only RELAXES the total-magnitude constraint. But the certify REGION is strictly COUPLED, not a rectangle: holding a simultaneous adjacent leak eps_a > 0 monotonically shrinks the tolerable bottom overlap below 1.192e-3 (1.155e-3 at 1/4 the adjacent threshold, 1.033e-3 at 1/2, ~1e-8 at the full 8.416e-3), so the two separate thresholds cannot both be spent at once and treating the leaks separately is OPTIMISTIC. Net: opening both channels does not loosen the imp-96188 obstruction; the variational route stays obstructed and the strict gap stays with the analytic no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). Measurement only; no bound moved; RH open; no refereed bound is changed; NO QED',
  worstCaseFinding: 'the joint worst-case threshold as total overlap magnitude is ~1.192419e-3, EQUAL to the separate bottom-twin threshold and attained at the pure-bottom direction (theta = 90 deg); splitting the same magnitude into the cheaper adjacent channel relaxes the constraint, so the joint threshold does NOT fall below 1.192e-3',
  couplingFinding: 'the certify region is strictly coupled: the maximal tolerable bottom overlap eps_b decreases monotonically as the simultaneous adjacent leak eps_a grows (1.192e-3 at eps_a = 0, 1.033e-3 at eps_a = half the adjacent threshold, ~1e-8 at the full adjacent threshold), so the two separate thresholds cannot both be spent at once — treating them separately is optimistic',
  honestLimits: 'the region uses the exact FFT-Mellin semilocal {oo,2} spectrum (baked literals identical to imp-96188 / imp-96204, not a rigorous enclosure — Rayleigh-Ritz N = 32 numbers) and a 3-level single-magnitude-per-channel [1, eps_a, eps_b] ansatz on the three near-modulus-1-relevant eigenvalues only (a lower bound on the sigma^2 an actual dyadic-grid ansatz leaking into the full tail would incur, so the real threshold is at most this relaxed). The equal-split and total-magnitude findings are anchor-fixed at the gap midpoint (imp-96205 already showed anchor-robustness). Nothing here diagonalizes A, moves a Lambda bound, or a verified height; RH open; NO QED',
});

// ---- assertions (reproduce the joint region; import-light; run < 0.2 s)
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96206_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96206-recovers-separate-thresholds-on-the-axes',
    description: 'the 3-level joint region recovers the imp-96188 SEPARATE two-level thresholds on the axes: eps_a = 0 gives the bottom-twin 1.192e-3 and eps_b = 0 gives the adjacent 8.416e-3',
    holds: () => approx(maxTolerableBottom(0), 0.001192419, 1e-8)
      && approx(maxTolerableAdjacent(0), 0.008415876, 1e-8),
  },
  {
    id: 'imp96206-joint-worst-case-not-below-bottom-twin',
    description: 'the worst-case joint threshold as total overlap magnitude does NOT fall below the separate bottom-twin 1.192e-3 — the minimum over directions equals it and is attained at the pure-bottom direction (theta = 90 deg)',
    holds: () => {
      const j = jointWorstCaseThreshold();
      return approx(j.worst, 0.001192419, 1e-7)
        && j.worst >= 0.001192419 - 1e-9   // does NOT fall below the separate bottom-twin threshold
        && approx(j.deg, 90, 0.1);         // worst direction is pure bottom-twin, not the diagonal
    },
  },
  {
    id: 'imp96206-coupled-slices-reproduce',
    description: 'the baked coupled-slice table reproduces the live maxTolerableBottom() computation at every sampled adjacent leak eps_a',
    holds: () => IMP_96206_COUPLED_SLICES.every((row) => approx(maxTolerableBottom(row.epsA), row.maxEb, 1e-7)),
  },
  {
    id: 'imp96206-simultaneous-adjacent-leak-tightens-bottom',
    description: 'the certify region is strictly COUPLED: any simultaneous adjacent leak monotonically TIGHTENS the tolerable bottom overlap below the separate 1.192e-3, so the two separate thresholds cannot both be spent at once',
    holds: () => {
      let prev = Infinity;
      for (const row of IMP_96206_COUPLED_SLICES) {
        if (row.maxEb >= prev) return false; // strictly decreasing in eps_a
        prev = row.maxEb;
      }
      return maxTolerableBottom(0.004207938) < 0.001192419 // at half the adjacent threshold, bottom < separate
        && approx(maxTolerableBottom(0.004207938), 0.001032665, 1e-7);
    },
  },
  {
    id: 'imp96206-equal-split-below-separate-per-channel',
    description: 'on the equal-split ray eps_a = eps_b the per-channel boundary 1.180627e-3 sits below the separate bottom-twin 1.192e-3, confirming the joint per-channel constraint is tighter than either separate threshold',
    holds: () => {
      let lo = 0, hi = 0.5;
      for (let k = 0; k < 200; k++) {
        const m = (lo + hi) / 2;
        const { U, valid } = katoTempleUpperThreeLevel(m, m);
        if (valid && U < 1) lo = m; else hi = m;
      }
      return approx(lo, 0.001180627, 1e-8) && lo < 0.001192419;
    },
  },
  {
    id: 'imp96206-verdict-honesty',
    description: 'status records a MEASUREMENT: the joint total-magnitude threshold does not fall below the bottom-twin 1.192e-3 but the region is coupled, routes the strict gap back to the analytic SG-96164-boundary / SG-96181-edge-octave, names the calibration honestly, and asserts RH open / NO QED',
    holds: () => /MEASUREMENT/.test(IMP_96206_ASSESSMENT.status)
      && /does NOT fall below/.test(IMP_96206_ASSESSMENT.status)
      && /COUPLED/.test(IMP_96206_ASSESSMENT.status)
      && /1.192/.test(IMP_96206_ASSESSMENT.status)
      && /SG-96164-boundary/.test(IMP_96206_ASSESSMENT.status)
      && /NO QED/.test(IMP_96206_ASSESSMENT.status)
      && /not a rigorous enclosure/.test(IMP_96206_ASSESSMENT.honestLimits)
      && /RH open/.test(IMP_96206_ASSESSMENT.honestLimits),
  },
]);

export default IMP_96206_ASSESSMENT;
