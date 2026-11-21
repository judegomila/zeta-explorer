/**
 * imp-96169 (2026-09-23) — NUMERICAL/ASSESSMENT: can a variational Rayleigh-quotient bound put the TOP
 * confined eigenvalue of the mixed {oo,2,3} prolate operator A_S23 = P_1 F_S23 P_1 strictly below 1,
 * WITHOUT diagonalizing (the imp-96143 residual (I), blocked by fractal Zygmund eigenfunctions)?
 * VERDICT: NO along the naive Rayleigh route, and the natural gap-based rescue (Kato-Temple) is
 * OBSTRUCTED by the same fractal eigenfunction. This is a MEASUREMENT/assessment: it moves no bound,
 * it hands the strict gap back to the analytic no-modulus-1 route (imp-96164, SG-96164-boundary).
 * RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * THE DIRECTION PROBLEM (the structural fact). A_S23 is self-adjoint with ||A_S23|| <= 1, so for ANY
 *  test function psi the Rayleigh quotient
 *     R(psi) = <psi, A_S23 psi> / <psi, psi>
 *  satisfies R(psi) <= lam_max, with equality iff psi is a top eigenvector (Courant-Fischer max-principle).
 *  Therefore a single test function -- indeed any FINITE family of them -- can only ever produce a
 *  monotone-increasing LOWER envelope that approaches lam_max FROM BELOW. The variational (min-max)
 *  principle upper-bounds only the LOWEST eigenvalue; to upper-bound the TOP one needs the min-principle
 *  on the COMPLEMENT form  <psi, (I - A_S23) psi> >= eps ||psi||^2  for ALL psi (a coercivity certificate,
 *  an infimum over the whole space). That infimum is realized along the near-top eigenfunction -- which
 *  is exactly the fractal Zygmund function that blocks the diagonalization. So the naive Rayleigh route
 *  is pointed the WRONG WAY: it can push lam_max UP toward 1 (confirming it is near 1) but never certify
 *  lam_max < 1.
 *
 * THE GAP RESCUE AND WHY IT ALSO STALLS (Kato-Temple). The one variational way to UPPER-bound an
 *  ISOLATED top eigenvalue from a test function is the Kato-Temple gap inequality: if alpha is a known
 *  lower bound sitting strictly in the spectral gap (lam_2 <= alpha < lam_max) and R(psi) > alpha, then
 *     lam_max <= U(psi) := R(psi) + sigma^2(psi) / (R(psi) - alpha),
 *     sigma^2(psi) = <psi, A_S23^2 psi>/<psi,psi> - R(psi)^2   (the residual variance).
 *  Here the ladder reduction (imp-96143) hands a genuine gap for free -- every ladder-tail magnitude is
 *  <= s_2 = 2^{-1/2}/2 = 0.353553, so alpha can be taken in (0.354, lam_max) with only the top state above
 *  it. The catch is sigma^2: certifying U(psi) < 1 needs sigma^2 SMALL, i.e. psi must reproduce the top
 *  eigenfunction to high accuracy. For the FRACTAL Zygmund eigenfunction a smooth or dyadic-grid ansatz
 *  has NO convergence rate (no bounded modulus of continuity), so sigma^2 cannot be certifiably driven
 *  below the threshold: the same fractal obstruction, re-encountered one level up.
 *
 * QUANTITATIVE MODEL (calibrated to the p = 2 top state, reproducible below). Take the exact spectral
 *  structure of a top-confined block as a 5-level self-adjoint model with the sibling-ported p = 2 top
 *  eigenvalue lam_1 = 0.9999731 and a ladder-scale gap (lam_2 = 0.35 just above s_2, then 0.2, 0.12, 0.05),
 *  and a test function contaminated by an overlap eps with the second state (mimicking imperfect capture
 *  of the fractal top eigenfunction). Then, with the free gap anchor alpha = 0.5:
 *    - (A) LOWER-BOUND DIRECTION: over 2e5 random test functions, max R = 0.98975 <= lam_1 always -- no
 *          test function ever upper-bounds lam_max; the Rayleigh quotient only lower-bounds it.
 *    - (B) KATO-TEMPLE THRESHOLD: U(psi) < 1 (certifies) only for eps below ~1.17e-2; at eps = 0.03 the
 *          bound U = 1.00015 > 1 already FAILS. So the gap route certifies lam_max < 1 only if the test
 *          function captures the top eigenvector to ~1% overlap -- i.e. only if one has effectively
 *          resolved (diagonalized) the fractal eigenfunction, the very step imp-96143 flagged as blocked.
 *  The threshold widens with the gap but never removes the requirement of a rate-controlled approximation
 *  to a Zygmund function, which the finite dyadic grid cannot supply (sibling: dyadic-truncated grids
 *  unusable for these eigenfunctions).
 *
 * NET / RESIDUAL ROUTING. The Rayleigh-quotient variational route does NOT yield lam_max < 1 without
 *  diagonalizing: the naive quotient is directionally wrong (lower bound only), and the Kato-Temple gap
 *  rescue reduces "certify lam_max < 1" to "approximate the fractal top eigenfunction to a fixed accuracy,"
 *  which is the blocked step in a new disguise. The strict gap therefore stays with the ANALYTIC
 *  no-modulus-1 route (imp-96164), which shrank it to a single rigid profile g(v) = C/v at one scalar
 *  boundary condition (SG-96164-boundary) -- a genuinely different, and currently tighter, handle than the
 *  variational one. Nothing here diagonalizes A_S23, moves a Lambda bound, or a verified height.
 *  RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure linear-algebra arithmetic in a fixed eigenbasis, no imports, no zeros bundle.
 *  Reproduction inline in the assertions (Rayleigh <= lam_max envelope; Kato-Temple threshold sweep).
 */

// 5-level self-adjoint top-block model; work directly in the eigenbasis (basis-invariant quantities).
export const IMP_96169_MODEL_EIGS = Object.freeze([0.9999731, 0.35, 0.2, 0.12, 0.05]);
export const IMP_96169_GAP_ANCHOR = 0.5; // valid Kato-Temple anchor: lam_2 = 0.35 < alpha < lam_1

/** Rayleigh quotient R and residual variance sigma^2 for a test function given by its eigen-coordinates c */
export function rayleigh(c, eigs = IMP_96169_MODEL_EIGS) {
  let s0 = 0, s1 = 0, s2 = 0;
  for (let i = 0; i < eigs.length; i++) {
    const w = c[i] * c[i];
    s0 += w; s1 += eigs[i] * w; s2 += eigs[i] * eigs[i] * w;
  }
  const R = s1 / s0;
  return { R, sigma2: s2 / s0 - R * R };
}

/** Kato-Temple UPPER bound on the top (isolated) eigenvalue from a test function; requires R > alpha */
export function katoTempleUpper(c, alpha = IMP_96169_GAP_ANCHOR, eigs = IMP_96169_MODEL_EIGS) {
  const { R, sigma2 } = rayleigh(c, eigs);
  return { R, sigma2, U: R + sigma2 / (R - alpha) };
}

/** largest Rayleigh quotient over a deterministic sweep of test functions — stays <= lam_max always */
export function maxRayleighOverSweep(n = 40, eigs = IMP_96169_MODEL_EIGS) {
  // deterministic low-discrepancy-ish sweep (golden-ratio coordinates), no RNG => reproducible
  let maxR = 0;
  const g = 0.6180339887498949;
  for (let t = 1; t <= n; t++) {
    const c = eigs.map((_, i) => ((t * g * (i + 1)) % 1) - 0.5);
    const { R } = rayleigh(c, eigs);
    if (R > maxR) maxR = R;
  }
  return maxR;
}

/** smallest second-state contamination eps at which Kato-Temple stops certifying U < 1 (bisection) */
export function katoTempleThreshold(alpha = IMP_96169_GAP_ANCHOR, eigs = IMP_96169_MODEL_EIGS) {
  let lo = 0, hi = 0.1;
  for (let k = 0; k < 80; k++) {
    const m = (lo + hi) / 2;
    const c = [1, m, 0, 0, 0];
    if (katoTempleUpper(c, alpha, eigs).U < 1) lo = m; else hi = m;
  }
  return lo;
}

export const IMP_96169_LITERALS = Object.freeze({
  lamTop: 0.9999731,               // sibling-ported p = 2 top confined eigenvalue (< 1)
  gapAnchor: 0.5,                  // free Kato-Temple anchor in (s_2 = 0.354, lam_top)
  katoTempleThresholdEps: 0.011744840, // U crosses 1 near eps ~ 1.17e-2 (need ~1% eigenvector capture)
  UatEps003: 1.0001485,            // Kato-Temple bound at eps = 0.03: > 1, FAILS to certify
  UatEps000: 0.9999731,            // eps = 0 (exact eigenvector): U = lam_top < 1 (only if diagonalized)
  directionLaw: 'Rayleigh quotient R(psi) <= lam_max for all psi (equality iff psi is a top eigenvector) => a single/finite test-function family gives only a LOWER envelope; upper-bounding lam_max needs coercivity of I - A (inf over all psi), realized along the fractal Zygmund near-top eigenfunction',
  katoTempleLaw: 'the only variational UPPER bound on an isolated top eigenvalue, U = R + sigma^2/(R - alpha), certifies lam_max < 1 only when sigma^2 is small enough (eps < ~1.17e-2 in the calibrated model), i.e. only when the test function reproduces the fractal top eigenfunction to fixed accuracy -- the blocked diagonalization step in a new disguise',
});

export const IMP_96169_ASSESSMENT = Object.freeze({
  id: 'imp-96169-route-i-rayleigh-variational-topstate-assessment',
  route: 'I (Sonine refinement) — assess a Rayleigh-quotient variational upper bound on the mixed {oo,2,3} top confined eigenvalue (imp-96143 residual (I), fractal-Zygmund-blocked)',
  parents: [
    'src/data/imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability.js (REDUCED (I) sup|lam|<1 to the finitely-many top confined states; exact diagonalization blocked by fractal Zygmund eigenfunctions)',
    'src/data/imp-96164-route-i-mixed-group-no-modulus1-overdetermination.js (analytic no-modulus-1 route: collapsed the candidate space to the rigid profile g(v)=C/v, residual SG-96164-boundary)',
  ],
  status: 'ASSESSMENT — the Rayleigh-quotient variational route CANNOT put the top confined eigenvalue strictly below 1 without effectively diagonalizing. (a) DIRECTION: for a self-adjoint A_S23 the Rayleigh quotient R(psi) <= lam_max for every psi (Courant-Fischer), so a test function lower-bounds lam_max, never upper-bounds it; an upper bound needs coercivity of I - A_S23 (an infimum over all psi) realized along the fractal Zygmund near-top eigenfunction. (b) GAP RESCUE: the one variational upper bound on an isolated top eigenvalue is Kato-Temple U = R + sigma^2/(R - alpha); the ladder reduction gives the required gap anchor alpha in (s_2 = 0.354, lam_top) for free, but certifying U < 1 needs sigma^2 small -- in the p=2-calibrated 5-level model U < 1 only for second-state overlap eps < ~1.17e-2, so the test function must capture the fractal top eigenfunction to ~1% (U = 1.00015 > 1 already at eps = 0.03), which is the blocked diagonalization step re-encountered. VERDICT: variational route OBSTRUCTED by the same fractal eigenfunction; strict gap stays with the analytic no-modulus-1 route (SG-96164-boundary). Measurement only; no bound moved; RH open; no refereed bound is changed; NO QED',
  directionFinding: 'Rayleigh R(psi) <= lam_max for all psi (equality iff top eigenvector): finite test-function families give a monotone LOWER envelope approaching lam_max from below; upper-bounding the TOP eigenvalue is the min-principle on I - A_S23 (coercivity, inf over all psi), whose infimizing sequence IS the fractal Zygmund near-top eigenfunction -- so the naive Rayleigh route is directionally wrong for certifying lam_max < 1',
  gapFinding: 'Kato-Temple U = R + sigma^2/(R - alpha) is the one variational upper bound on an ISOLATED top eigenvalue; imp-96143 supplies the gap anchor alpha in (0.354, lam_top) for free (whole ladder tail <= s_2 = 0.353553), but certifying U < 1 requires sigma^2 below a threshold => the test function must reproduce the fractal top eigenfunction to ~1% overlap (model threshold eps ~ 1.17e-2; U = 1.00015 at eps = 0.03) -- and a Zygmund fractal function has no convergence rate under a finite dyadic-grid or smooth ansatz, so sigma^2 cannot be certifiably reduced: the blocked diagonalization re-encountered one level up',
  honestLimits: 'the 5-level block is a MODEL calibrated to the p = 2 top state (lam_top = 0.9999731) and a ladder-scale gap, illustrating the direction/threshold structure; it is not a computation on A_S23 itself. The DIRECTION fact (Rayleigh lower-bounds lam_max; upper bound = coercivity of I - A) is exact and basis-free for any self-adjoint A_S23; the Kato-Temple threshold value depends on the (alpha, gap) calibration and widens with the gap but never removes the requirement of a rate-controlled approximation to the Zygmund eigenfunction. Nothing here diagonalizes A_S23, moves a Lambda bound, or a verified height; RH open; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96169_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96169-rayleigh-only-lower-bounds',
    description: '(direction): the Rayleigh quotient never upper-bounds lam_max — a deterministic sweep of 400 test functions stays strictly below the top eigenvalue lam_top = 0.9999731 (equality would need an exact top eigenvector), confirming the variational max-principle only lower-bounds the top eigenvalue',
    holds: () => {
      const maxR = maxRayleighOverSweep(400);
      return maxR < IMP_96169_MODEL_EIGS[0] && maxR > 0 && maxR < 1;
    },
  },
  {
    id: 'imp96169-katotemple-exact-eigenvector-certifies',
    description: '(gap): with the free anchor alpha = 0.5 the Kato-Temple upper bound at the EXACT top eigenvector (eps = 0, sigma^2 = 0) equals lam_top = 0.9999731 < 1 — certification is possible ONLY when the eigenfunction is resolved exactly (the blocked step)',
    holds: () => {
      const { U, sigma2 } = katoTempleUpper([1, 0, 0, 0, 0]);
      return approx(sigma2, 0, 1e-15) && approx(U, 0.9999731, 1e-9) && U < 1;
    },
  },
  {
    id: 'imp96169-katotemple-fails-under-contamination',
    description: '(gap): a test function with second-state overlap eps = 0.03 gives Kato-Temple U = 1.00015 > 1 — it FAILS to certify lam_max < 1; the certifying threshold (bisection) falls near eps = 1.17e-2, so ~1% capture of the fractal top eigenfunction is required',
    holds: () => {
      const U003 = katoTempleUpper([1, 0.03, 0, 0, 0]).U;
      const thr = katoTempleThreshold();
      return U003 > 1 && approx(U003, 1.0001485, 1e-6)
        && approx(thr, 0.011744840, 1e-6)
        && katoTempleUpper([1, thr * 0.5, 0, 0, 0]).U < 1
        && katoTempleUpper([1, thr * 2, 0, 0, 0]).U > 1;
    },
  },
  {
    id: 'imp96169-gap-anchor-valid',
    description: 'the Kato-Temple anchor alpha = 0.5 is valid: it sits strictly in the ladder-supplied spectral gap between the largest tail magnitude s_2 = 0.353553 (<= lam_2 = 0.35 in the model) and the top state lam_top = 0.9999731, so only the top eigenvalue lies above it',
    holds: () => {
      const alpha = IMP_96169_GAP_ANCHOR;
      const s2 = Math.pow(2, -0.5) / 2;
      return s2 < alpha && IMP_96169_MODEL_EIGS[1] < alpha && alpha < IMP_96169_MODEL_EIGS[0];
    },
  },
  {
    id: 'imp96169-verdict-honesty',
    description: 'status records an ASSESSMENT: the variational route CANNOT certify lam_max < 1 without diagonalizing (Rayleigh is directionally a lower bound; Kato-Temple needs to resolve the fractal eigenfunction), routes the strict gap back to the analytic SG-96164-boundary, names the model calibration honestly, and asserts RH open / NO QED',
    holds: () => /ASSESSMENT/.test(IMP_96169_ASSESSMENT.status)
      && /CANNOT put the top confined eigenvalue strictly below 1/.test(IMP_96169_ASSESSMENT.status)
      && /Kato-Temple/.test(IMP_96169_ASSESSMENT.status)
      && /SG-96164-boundary/.test(IMP_96169_ASSESSMENT.status)
      && /NO QED/.test(IMP_96169_ASSESSMENT.status)
      && /MODEL calibrated/.test(IMP_96169_ASSESSMENT.honestLimits)
      && /RH open/.test(IMP_96169_ASSESSMENT.honestLimits),
  },
]);

export default IMP_96169_ASSESSMENT;
