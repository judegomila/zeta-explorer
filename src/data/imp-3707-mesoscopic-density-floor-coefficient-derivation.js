/**
 * imp-3707 -- DERIVE the imp-3642 mesoscopic density-floor coefficient
 *   V0(gamma) / log(gamma / 2 pi) = 0.48458
 * from the equilibrium (attractive Calogero-Moser) semicircle/uniform density, and test whether the
 * machine-epsilon-constant slope 0.48458 matches a closed form (candidates: c / (2 pi), a function of the
 * y_star = 4 d strip factor).
 *
 * SETUP (as in imp-3642 / imp-3662). The mesoscopic density floor is
 *     V0 = sup_{x in strip} Im M(x + i y_star),   Im M(x + i y) = sum_k y / ((x_k - x)^2 + y^2),
 * read at strip height y_star = 4 d, where d = 2 pi / log(gamma / 2 pi) is the RvM mean spacing. imp-3642
 * MEASURED V0 / log(gamma / 2 pi) = 0.48458 constant to machine epsilon across the height ladder but gave
 * NO analytic value for the coefficient.
 *
 * DERIVATION. The equilibrium profile of the attractive CM gas is, on the mesoscopic scale, the UNIFORM
 * lattice x_k = k d (unit density 1 / d; the local semicircle is flat over the O(y_star) strip window).
 * For the infinite uniform lattice the Stieltjes sum is summable in closed form via the Mittag-Leffler
 * cotangent identity
 *     sum_{k = -inf}^{inf} y / ((k d - x)^2 + y^2)
 *         = (pi / d) * sinh(2 pi y / d) / (cosh(2 pi y / d) - cos(2 pi x / d)).
 * The sup over x is at cos(2 pi x / d) = 1 (x on a lattice site), and with cosh A - 1 = 2 sinh^2(A/2),
 * sinh A = 2 sinh(A/2) cosh(A/2),
 *     sup_x Im M = (pi / d) * coth(pi y / d).
 * Since 1 / d = log(gamma / 2 pi) / (2 pi), we have (pi / d) = log(gamma / 2 pi) / 2, hence the ANALYTIC
 * density-floor coefficient is
 *     V0 / log(gamma / 2 pi) = (1 / 2) * coth(pi * y_star / d).                    [closed form]
 *
 * This is EXACTLY the (1/2) coth(pi y_star / d) continuum floor that imp-3662 identified empirically; the
 * present module supplies its derivation from the equilibrium density and quantifies the finite-block gap.
 *
 * VALUE AT y_star = 4 d.  (1/2) coth(4 pi) = 0.5000000000 (coth(4 pi) - 1 ~ 2 e^{-8 pi} ~ 5e-11), i.e. the
 * analytic coefficient is 1/2 to ten decimals, and is STRIP-HEIGHT-INDEPENDENT for y_star >= 2 d because
 * coth(pi * alpha) -> 1 super-exponentially (coth(2 pi) - 1 ~ 7e-6). So the universal continuum coefficient
 * is exactly 1/2.
 *
 * WHY 0.48458 IS NOT 1/2, AND IS NOT A CLOSED FORM.  0.48458 is the M = 161 FINITE-BLOCK truncation of the
 * closed form. Truncating the tail |k| > M/2 removes 2 * sum_{k > M/2} y / (k d)^2 ~ 4 y / (M d) from the
 * on-site sup, so the invariant deficit obeys the leading tail law
 *     (1/2) coth(pi y_star / d) - V0^{(M)} / log ~ (2 y_star) / (pi M d) = 8 / (pi M)   (at y_star = 4 d),
 * which is 8 / (pi * 161) = 0.01582 -- matching the measured ~3 % gap. The candidate reformulation
 * c / (2 pi) merely recovers V0 itself (0.48458 * 2 pi = 3.0447 = the truncated on-site sup) and yields no
 * clean constant; it is REJECTED. Conclusion: the coefficient's TRUE analytic value is 1/2; 0.48458 is a
 * finite-block artifact, not a closed form.
 *
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (single-seed 0.48458 invariant)
 * @see imp-3662-mesoscopic-invariant-seed-sensitivity (empirical (1/2) coth(pi y_star / d) floor)
 * Derivation/measurement only; no positivity, no bridge closure, NO QED; imp-3066 UNTOUCHED;
 * Platt-Trudgian Lambda <= 0.2 stays SOTA.
 */

const TWO_PI = 2 * Math.PI;
function coth(z) {
  return 1 / Math.tanh(z);
}

// ── closed-form infinite-lattice sup and invariant (derived above) ──
// Work in d = 1 units: log(gamma / 2 pi) = 2 pi / d = 2 pi. The invariant is scale-free, so d cancels.
const D = 1;
const LOG_RVM = TWO_PI / D; // = log(gamma / 2 pi) in these units
const YSTAR = 4 * D; // imp-3642 baseline strip height

// analytic on-site sup and coefficient (Mittag-Leffler cotangent identity)
const SUP_CLOSED = (Math.PI / D) * coth((Math.PI * YSTAR) / D);
const COEFF_CLOSED = SUP_CLOSED / LOG_RVM; // = (1/2) coth(pi * y_star / d)

// ── live finite-block truncation of the UNIFORM equilibrium lattice (unperturbed) ──
// grid-sup of Im M over one period for M particles; recovers 0.484 at M = 161 (imp-3642's seed value 0.48458
// adds the ~4e-4 perturbation contribution measured in imp-3662).
function supUniform(y, M) {
  let best = 0;
  for (let x = -3 * D; x <= 3 * D; x += D / 64) {
    let s = 0;
    const half = (M - 1) / 2;
    for (let k = -half; k <= half; k++) {
      const a = k * D - x;
      s += y / (a * a + y * y);
    }
    if (s > best) best = s;
  }
  return best;
}
function invariantUniform(y, M) {
  return supUniform(y, M) / LOG_RVM;
}

const M_LADDER = [81, 161, 321, 1001, 4001];
const CONV_ROWS = M_LADDER.map((M) => {
  const inv = invariantUniform(YSTAR, M);
  const tailLaw = 8 / (Math.PI * M); // leading (2 y_star)/(pi M d) at y_star = 4 d
  return {
    M,
    invariant: +inv.toFixed(6),
    deficit: +(COEFF_CLOSED - inv).toExponential(3),
    tailLawPredictedDeficit: +tailLaw.toExponential(3),
  };
});
const INV_M161 = invariantUniform(YSTAR, 161);
const DEFICIT_M161 = COEFF_CLOSED - INV_M161;
const TAIL_LAW_M161 = 8 / (Math.PI * 161);

// ── strip-height universality: coefficient (1/2) coth(pi * mult) is 1/2 for every mult >= 2 ──
const YSTAR_COEFFS = [1, 2, 4, 8, 16].map((mult) => ({
  yStarMult: mult,
  coeffClosed: +(0.5 * coth(Math.PI * mult)).toFixed(10),
  excessOverHalf: +(0.5 * coth(Math.PI * mult) - 0.5).toExponential(2),
}));

// ── candidate closed-form test: c / (2 pi) ──
const MEASURED = 0.48458;
const C_OVER_2PI_C = MEASURED * TWO_PI; // 3.0447 -- just recovers V0, not a clean constant
const HALF_RESIDUAL = 0.5 - MEASURED; // 0.01542, explained by finite-M truncation

export const IMP3707_MESOSCOPIC_DENSITY_FLOOR_COEFFICIENT_DERIVATION = {
  id: 'imp-3707',
  proofSection: 'S-frontier',
  question:
    'imp-3642 measured the mesoscopic density-floor coefficient V0(gamma) / log(gamma / 2 pi) = 0.48458 to ' +
    'machine epsilon but gave NO analytic value. Derive the coefficient from the equilibrium Calogero-Moser ' +
    'density and test whether 0.48458 is a closed form (candidates c / (2 pi), a function of the y_star = 4 d ' +
    'strip factor); report the analytic value, its residual against 0.48458, and whether it is universal or ' +
    'strip-height dependent. Derivation only; NOT an RH bound; no QED.',
  quantity:
    'analytic V0 / log(gamma / 2 pi) = (1/2) coth(pi * y_star / d) from the uniform equilibrium lattice via ' +
    'the Mittag-Leffler cotangent identity; finite-block convergence of the uniform-lattice invariant to it',
  derivation: {
    latticeSumIdentity:
      'sum_k y / ((k d - x)^2 + y^2) = (pi/d) sinh(2 pi y/d) / (cosh(2 pi y/d) - cos(2 pi x/d))',
    supOverStrip: 'sup_x Im M = (pi / d) coth(pi y / d)   [at x on a lattice site, cos(2 pi x/d) = 1]',
    coefficientClosedForm: 'V0 / log(gamma / 2 pi) = (1/2) coth(pi * y_star / d)   [since pi/d = log/2]',
  },
  analyticCoefficient: {
    atYStar4d: +COEFF_CLOSED.toFixed(10), // 0.5000000000
    excessOverOneHalf: +(COEFF_CLOSED - 0.5).toExponential(2), // ~coth(4 pi) - 1 ~ 5e-11
    universalContinuumValue: 0.5, // exactly 1/2 for every y_star >= 2 d
  },
  finiteBlockConvergence: {
    ladder: CONV_ROWS, // invariant rises 0.4687 (M=81) -> 0.4994 (M=4001) toward 1/2
    uniformInvariantAtM161: +INV_M161.toFixed(5), // 0.48420 (imp-3642 seed 0.48458 adds ~4e-4 perturbation)
    deficitAtM161: +DEFICIT_M161.toExponential(3), // 1.580e-2
    tailLawDeficitAtM161: +TAIL_LAW_M161.toExponential(3), // 1.582e-2 = 8/(pi*161), matches
    tailLaw: 'deficit ~ (2 y_star)/(pi M d) = 8/(pi M) at y_star = 4 d',
  },
  stripHeightUniversality: {
    coeffs: YSTAR_COEFFS, // (1/2) coth(pi*mult): 0.6217 (1d), 0.5000035 (2d), 0.5 (>=4d)
    universalForYStarAtLeast2d: YSTAR_COEFFS.filter((r) => r.yStarMult >= 2).every(
      (r) => Math.abs(r.coeffClosed - 0.5) < 1e-4
    ), // true -- coefficient is 1/2 for every y_star >= 2 d
  },
  candidateClosedFormTest: {
    measured: MEASURED,
    cOver2piRecoversV0: +C_OVER_2PI_C.toFixed(4), // 3.0447 = the M=161 on-site sup itself, no clean constant
    cOver2piRejected: true, // c/(2 pi) just re-expresses V0; not a closed form for 0.48458
    residualAgainstHalf: +HALF_RESIDUAL.toFixed(5), // 0.01542, matches the M=161 truncation deficit
    zeroPointFourEightIsClosedForm: false, // 0.48458 is a finite-block artifact, NOT a closed form
  },
  finding: {
    F1_analytic_value:
      'The mesoscopic density-floor coefficient DERIVES in closed form from the uniform equilibrium lattice ' +
      'via the Mittag-Leffler cotangent identity: sup_x Im M = (pi/d) coth(pi y_star/d), hence ' +
      'V0 / log(gamma / 2 pi) = (1/2) coth(pi * y_star / d). At y_star = 4 d this equals ' +
      COEFF_CLOSED.toFixed(10) + ' (coth(4 pi) - 1 ~ 5e-11), i.e. exactly 1/2.',
    F2_zero48458_is_finite_block_artifact:
      'The measured 0.48458 is NOT the analytic coefficient and NOT a closed form: it is the M = 161 ' +
      'finite-block truncation of 1/2. The uniform-lattice invariant at M = 161 is ' + INV_M161.toFixed(5) +
      ' (the imp-3642 perturbed seed adds ~4e-4), with deficit ' + DEFICIT_M161.toExponential(3) + ' from ' +
      '1/2, matched to the leading tail law 8/(pi M) = ' + TAIL_LAW_M161.toExponential(3) + '. The invariant ' +
      'climbs to ' + CONV_ROWS[CONV_ROWS.length - 1].invariant.toFixed(5) + ' at M = 4001, converging to 1/2.',
    F3_universal_not_strip_dependent:
      'The coefficient is UNIVERSAL (= 1/2), not strip-height dependent, for every y_star >= 2 d: ' +
      '(1/2) coth(pi * alpha) exceeds 1/2 by only ~7e-6 at alpha = 2 and ~5e-11 at alpha = 4. The finite-M ' +
      'y_star-dependence seen in imp-3662 (0.496 -> 0.468 as y_star: 2d -> 8d) is truncation, not the limit.',
    F4_candidate_rejected:
      'The candidate c / (2 pi) is REJECTED: 0.48458 * 2 pi = ' + C_OVER_2PI_C.toFixed(4) + ' merely recovers ' +
      'the M = 161 on-site sup V0 itself and yields no clean constant. The only closed form present is the ' +
      'derived 1/2.',
  },
  namedSubGap:
    'sg-3707-perturbed-block-continuum-limit: this module derives the UNIFORM-lattice coefficient exactly ' +
    '(= 1/2) and matches the M = 161 truncation, but the perturbed imp-3642 seed adds a ~4e-4 offset whose ' +
    'infinite-block limit (does the perturbed sup also converge to 1/2, or to 1/2 plus a seed-dependent ' +
    'constant?) is bounded but not certified here; the absolute shock constant c_sh (imp-2520 SG1) stays OPEN.',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-3642 machine-epsilon density-floor coefficient ' +
    'V0 / log(gamma / 2 pi) derives in closed form from the equilibrium (uniform) Calogero-Moser lattice via ' +
    'the Mittag-Leffler cotangent identity: sup_x Im M = (pi/d) coth(pi y_star/d), giving the coefficient ' +
    '(1/2) coth(pi * y_star / d) = 0.5000000000 at y_star = 4 d -- exactly 1/2, UNIVERSAL for every ' +
    'y_star >= 2 d. The measured 0.48458 is NOT a closed form but the M = 161 finite-block truncation of 1/2 ' +
    '(deficit 1.58e-2 = 8/(pi*161) tail law); the c/(2 pi) candidate merely recovers V0 and is rejected. ' +
    'Named residual sg-3707-perturbed-block-continuum-limit. Derivation only; no positivity, NO QED; ' +
    'imp-3066 UNTOUCHED; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};
