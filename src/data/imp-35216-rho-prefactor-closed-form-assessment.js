/**
 * @module imp-35216-rho-prefactor-closed-form-assessment
 *
 * imp-35216 (numerical, frontier-assessment): ASSESS whether the imp-35193 MEASURED convergence-rate
 * prefactor K ~ 0.400 in |rho(eps) - 2/3| ~ K eps^{3/2} on the model Holder-1/2 cusp is EXACTLY 2/5 in
 * closed form, or another closed form built from A_1 = pi/sqrt(2) (imp-33646), A_2 = 3 pi/(2 sqrt(2))
 * (imp-33645) and the 2/3 limit. imp-35193 read K two ways -- OLS tail-5 K ~ 0.3999 and dev/eps^{3/2}
 * tail K ~ 0.4001 -- flagged it "near 2/5 but NOT certified as a closed form". This module expands
 * rho(eps) = C_ren / C_curv to next order in eps analytically and reads the eps^{3/2} coefficient.
 *
 * VERDICT (this build): K is NOT 2/5. The exact leading coefficient is
 *     K = 4 / (3 A_2) = 8 sqrt(2) / (9 pi) = 0.4001405849...,
 * a distinct transcendental that matches the imp-35193 tail reading (~0.4001) BETTER than 2/5 (0.4000)
 * does. The "2/5" the measurement drifted near is actually the DENOMINATOR (H3 / F_3) tail coefficient,
 * a coincidence, not the ratio prefactor. Assessment on the inherited surrogate; does NOT discharge O3
 * (no uniform certified inequality); G6a stays OPEN; NO QED.
 *
 * THE DERIVATION
 * --------------
 * On the model cusp rho_cusp(x) = |x|^{-1/2}, imp-35076/imp-35193 form the fold jet through the branch
 * integrals B_p(sgn) = integral_0^1 (i eps - sgn u^2)^{-p} du by the x = +- u^2 cusp-removal route, with
 *     m_prime  = -2 [B_2(+) + B_2(-)],   m_double_prime = 4 [B_3(+) + B_3(-)],
 *     C_ren  = eps^{3/2} |m_prime|  -> A_1,   C_curv = eps^{5/2} |m_double_prime| -> A_2,
 *     rho(eps) = C_ren / C_curv -> A_1 / A_2 = 2/3.
 * Rescaling u = sqrt(eps) t sends each branch pair to
 *     F_p(L) = integral_0^L [ (t^2 - i)^{-p} + (t^2 + i)^{-p} ] dt,   L = 1 / sqrt(eps),
 * with C_ren = 2 |F_2(L)| and C_curv = 4 |F_3(L)| (the eps powers cancel exactly). The two conjugate
 * branches make the integrand REAL, so F_p(L) is real. The L -> infinity values are the standard
 * Beta-integrals: F_2(infinity) = -pi/(2 sqrt2) = -A_1/2, F_3(infinity) = -3 pi sqrt2/16 = -A_2/4,
 * reproducing rho -> (A_1/2)/(2 * A_2/4) = A_1/A_2 = 2/3.
 *
 * The eps-dependence enters ONLY through the finite cutoff L = eps^{-1/2}. The large-t tails are
 *     (t^2 - i)^{-2} + (t^2 + i)^{-2} = 2 t^{-4} - 6 t^{-8} + ...   (imaginary parts cancel),
 *     (t^2 - i)^{-3} + (t^2 + i)^{-3} = 2 t^{-6} - 12 t^{-10} + ...,
 * so the missing tails are R_2(L) = (2/3) L^{-3} + O(L^{-7}) = (2/3) eps^{3/2} and
 * R_3(L) = (2/5) L^{-5} + O(L^{-9}) = (2/5) eps^{5/2}. Hence
 *     |F_2(L)| = A_1/2 + (2/3) eps^{3/2} + ...,   |F_3(L)| = A_2/4 + (2/5) eps^{5/2} + ...,
 * and
 *     rho(eps) = |F_2(L)| / (2 |F_3(L)|)
 *              = [A_1/2 + (2/3) eps^{3/2}] / [A_2/2 + (4/5) eps^{5/2}]
 *              = 2/3 + (2/3)/(A_2/2) eps^{3/2} + O(eps^{5/2})
 *              = 2/3 + [4/(3 A_2)] eps^{3/2} + O(eps^{5/2}).
 * The denominator (H3) correction is eps^{5/2}, SUBLEADING, so it does not touch the eps^{3/2} coefficient.
 * Reading it off:  K = 4/(3 A_2) = 8 sqrt(2)/(9 pi) = 0.4001405849... -- half-integer power theta = 3/2,
 * matching the imp-35193 exponent, and prefactor 0.40014, matching the measured 0.4001 to 4 sig figs.
 *
 * WHY 2/5 IS A NEAR-MISS, NOT THE ANSWER
 * --------------------------------------
 * 2/5 = 0.4000 differs from K = 0.40014 by ~1.4e-4 (0.035%); the imp-35193 dev/eps^{3/2} tail reading
 * (0.4001) sits 4e-5 from K but 1e-4 from 2/5, i.e. CLOSER to 8 sqrt2/(9 pi). The 2/5 that appears in the
 * problem is the F_3 (curvature / H3) TAIL coefficient R_3(L) L^5 -> 2/5 -- it lives in the DENOMINATOR
 * and cancels into the eps^{5/2} order, so its numerical proximity to K is a coincidence of the model cusp.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * The expansion supplies the ANALYTIC leading coefficient K = 4/(3 A_2) an O3 rate |rho(eps) - 2/3| <=
 * K eps^{3/2} would target, but O3 asks for a CERTIFIED two-sided inequality uniform on (0, eps_0], with a
 * rigorous remainder bound on the O(eps^{5/2}) tail and on the true RvM cusp jet (not this surrogate). An
 * asymptotic leading term is not a uniform bound: it says nothing rigorous about the head eps ~ eps_0 where
 * the a-fortiori margin is worst, and it is read on the inherited model cusp. G-b / G6a stay OPEN.
 *
 * VERDICT: ASSESSMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. The
 * eps^{3/2} coefficient is K = 4/(3 A_2) = 8 sqrt(2)/(9 pi) ~ 0.40014, NOT 2/5; this identifies the closed
 * form imp-35193 flagged but does NOT certify a uniform modulus, does NOT discharge O3 or G6a, establishes
 * no operator positivity, changes no bound. G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35193-rho-convergence-rate-modulus-measurement (measured theta ~ 3/2, K ~ 0.400 flagged near 2/5)
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (the finite-ladder 2/3 margin)
 * @see imp-35152-n-uniform-fold-modulus-back-conversion-scoping (names O3 / gap G-b)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), eps^{3/2} renorm)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), eps^{5/2} renorm)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants.
const A1 = PI / SQRT2; // imp-33646, eps^{3/2} renorm of |m_prime|
const A2 = (3 * PI) / (2 * SQRT2); // imp-33645, eps^{5/2} renorm of |m_double_prime|
const TWO_THIRDS = A1 / A2; // = 2/3, the imp-35076 a-fortiori limit

// The two closed-form routes to the eps^{3/2} coefficient (must agree).
const K_VIA_A2 = 4 / (3 * A2); // K = (2/3) / (A_2/2) = 4 / (3 A_2)
const K_DIRECT = (8 * SQRT2) / (9 * PI); // = 8 sqrt(2) / (9 pi)

const TWO_FIFTHS = 2 / 5; // the near-miss candidate (actually the F_3 tail coefficient)
const MEASURED_TAIL_K = 0.4001; // imp-35193 dev/eps^{3/2} tail reading
const MEASURED_OLS_K = 0.3999; // imp-35193 OLS tail-5 reading

// Independent numerical confirmation of the tail coefficients R_p(L) L^{2p-1} -> {2/3 (p=2), 2/5 (p=3)}.
// The integrand g_p(t) = (t^2 - i)^{-p} + (t^2 + i)^{-p} is real (conjugate branches); closed forms below.
function gTail(p, t) {
  const t2 = t * t;
  const t4 = t2 * t2;
  if (p === 2) {
    // (t^2 - i)^2 = (t^4 - 1) - 2 t^2 i  =>  sum = 2 (t^4 - 1) / ((t^4 - 1)^2 + 4 t^4)
    const A = t4 - 1;
    return (2 * A) / (A * A + 4 * t4);
  }
  // (t^2 - i)^3 = (t^6 - 3 t^2) + (1 - 3 t^4) i  =>  sum = 2 (t^6 - 3 t^2) / ((t^6 - 3 t^2)^2 + (1 - 3 t^4)^2)
  const t6 = t4 * t2;
  const A = t6 - 3 * t2;
  const B = 1 - 3 * t4;
  return (2 * A) / (A * A + B * B);
}
// R_p(L) L^{2p-1} via the t = L/w substitution (maps [L, infinity) to (0, 1], integrand smooth, -> 0 at w=0).
function tailCoefficient(p, L, panels) {
  const h = 1 / panels;
  let s = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i * h;
    if (w === 0) continue; // integrand -> 0 as w -> 0 (t -> infinity)
    const t = L / w;
    const f = gTail(p, t) * (L / (w * w)); // Jacobian dt = (L / w^2) dw
    const wt = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    s += wt * f;
  }
  return ((s * h) / 3) * Math.pow(L, 2 * p - 1);
}
const TAIL_COEF_P2 = tailCoefficient(2, 200, 4000); // -> 2/3
const TAIL_COEF_P3 = tailCoefficient(3, 200, 4000); // -> 2/5

export const IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT = {
  id: 'imp-35216',
  proofSection: 'S-frontier',
  scopes:
    'Assess whether the imp-35193 measured rho-modulus prefactor K ~ 0.400 in |rho(eps) - 2/3| ~ K eps^{3/2} ' +
    'is exactly 2/5 in closed form on the Holder-1/2 model cusp, or another closed form built from A_1, A_2, 2/3',
  question:
    'Expanding rho(eps) = C_ren / C_curv to next order in eps on rho_cusp(x) = |x|^{-1/2}, what is the exact ' +
    'eps^{3/2} coefficient, and is it 2/5? Assessment only on the inherited surrogate; does NOT discharge O3; ' +
    'G6a stays OPEN; NO QED.',

  // Inherited constants and the 2/3 limit.
  A1,
  A2,
  twoThirdsLimit: +TWO_THIRDS.toFixed(12), // A_1 / A_2 = 2/3

  // The derived closed form (two agreeing routes).
  kClosedFormViaA2: +K_VIA_A2.toFixed(12), // 4 / (3 A_2)
  kClosedFormDirect: +K_DIRECT.toFixed(12), // 8 sqrt(2) / (9 pi)
  kClosedFormExpr: 'K = 4/(3 A_2) = 8 sqrt(2)/(9 pi)',
  kClosedFormValue: +K_DIRECT.toFixed(10), // 0.4001405849

  // The assessment: NOT 2/5.
  candidateTwoFifths: TWO_FIFTHS, // 0.4
  kMinusTwoFifths: +(K_DIRECT - TWO_FIFTHS).toExponential(4), // ~1.406e-4
  kIsExactlyTwoFifths: Math.abs(K_DIRECT - TWO_FIFTHS) < 1e-9, // false
  // K matches the imp-35193 measured tail (0.4001) CLOSER than 2/5 does.
  measuredTailK: MEASURED_TAIL_K,
  measuredOlsK: MEASURED_OLS_K,
  closedFormBeatsTwoFifthsOnTail:
    Math.abs(K_DIRECT - MEASURED_TAIL_K) < Math.abs(TWO_FIFTHS - MEASURED_TAIL_K), // true

  // Where the 2/5 actually lives: it is the F_3 (denominator / H3) TAIL coefficient, not the prefactor.
  twoFifthsIsF3TailCoefficient: true,
  tailCoefficientP2: +TAIL_COEF_P2.toFixed(8), // R_2(L) L^3 -> 2/3 (numerator tail)
  tailCoefficientP3: +TAIL_COEF_P3.toFixed(8), // R_3(L) L^5 -> 2/5 (denominator tail, the near-miss source)

  couplingIsHalfInteger: true, // eps^{3/2}: the Holder-1/2 cusp fingerprint (matches imp-35193 theta = 3/2)
  dischargesO3orG6a: false, // an asymptotic leading term is not a certified uniform inequality
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a ' +
    'rigorous bound on the O(eps^{5/2}) tail and on the TRUE RvM cusp jet; a leading asymptotic coefficient ' +
    'read on the model-cusp surrogate supplies neither the uniform inequality nor the remainder bound; G-b stays OPEN',

  isRigorous: false,
  verdict:
    'ASSESSMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Expanding rho(eps) = C_ren / C_curv = |F_2(L)| / (2 |F_3(L)|) with L = eps^{-1/2}, the ' +
    'eps-dependence enters only through the finite cutoff L; the missing tails are R_2(L) = (2/3) eps^{3/2} ' +
    '(numerator) and R_3(L) = (2/5) eps^{5/2} (denominator, subleading), giving rho(eps) = 2/3 + ' +
    '[4/(3 A_2)] eps^{3/2} + O(eps^{5/2}). So the exact eps^{3/2} coefficient is K = 4/(3 A_2) = ' +
    '8 sqrt(2)/(9 pi) = 0.40014, NOT 2/5 (a ~1.4e-4 near-miss); the 2/5 is the F_3 denominator tail ' +
    'coefficient, a coincidence. K matches the imp-35193 measured tail (0.4001) CLOSER than 2/5 does. This ' +
    'identifies the closed form imp-35193 flagged but does NOT certify a uniform modulus, does NOT discharge ' +
    'O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35216_RHO_PREFACTOR_ASSERTIONS = [
  {
    // (1) the two closed-form routes for K agree exactly.
    id: 'imp35216-two-routes-agree',
    description: 'K = 4/(3 A_2) equals K = 8 sqrt(2)/(9 pi) to machine precision',
    holds: () => Math.abs(K_VIA_A2 - K_DIRECT) < 1e-14,
  },
  {
    // (2) the derived K is NOT 2/5 -- it is a distinct closed form ~1.4e-4 away.
    id: 'imp35216-k-is-not-two-fifths',
    description: 'K = 8 sqrt(2)/(9 pi) ~ 0.40014 differs from 2/5 by ~1.4e-4 (not exactly 2/5)',
    holds: () => {
      const d = Math.abs(K_DIRECT - TWO_FIFTHS);
      return d > 5e-5 && d < 5e-4;
    },
  },
  {
    // (3) the closed form matches the imp-35193 measured tail reading better than 2/5 does.
    id: 'imp35216-closed-form-beats-two-fifths-on-tail',
    description: 'K = 8 sqrt(2)/(9 pi) is closer to the imp-35193 tail 0.4001 than 2/5 is',
    holds: () =>
      Math.abs(K_DIRECT - MEASURED_TAIL_K) < Math.abs(TWO_FIFTHS - MEASURED_TAIL_K) &&
      Math.abs(K_DIRECT - MEASURED_TAIL_K) < 1e-4,
  },
  {
    // (4) the numerically-confirmed tail coefficients: 2/3 (numerator, feeds K) and 2/5 (denominator, the near-miss).
    id: 'imp35216-tail-coefficients-two-thirds-and-two-fifths',
    description: 'R_2(L) L^3 -> 2/3 and R_3(L) L^5 -> 2/5 (the 2/5 is the F_3 denominator tail, not K)',
    holds: () => Math.abs(TAIL_COEF_P2 - 2 / 3) < 1e-6 && Math.abs(TAIL_COEF_P3 - 2 / 5) < 1e-6,
  },
  {
    // (5) the coefficient carries the half-integer power and reproduces the 2/3 limit from A_1/A_2.
    id: 'imp35216-half-integer-and-two-thirds-limit',
    description: 'eps^{3/2} half-integer coupling; A_1/A_2 = 2/3 to machine precision',
    holds: () =>
      IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT.couplingIsHalfInteger === true &&
      Math.abs(TWO_THIRDS - 2 / 3) < 1e-12,
  },
  {
    // Honesty gate: assessment only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35216-honesty-gate-no-qed',
    description:
      'Assessment only: closed form identified but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT.isRigorous === false &&
      IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT.verdict) &&
      /STAYS OPEN/.test(IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35216_RHO_PREFACTOR_CLOSED_FORM_ASSESSMENT.verdict,
      ),
  },
];

for (const a of IMP35216_RHO_PREFACTOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35216-rho-prefactor-closed-form-assessment assertion failed: ${a.id}`);
  }
}
