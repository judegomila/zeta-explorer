/**
 * @module imp-2689-tc-proj-b1-b2-status
 *
 * imp-2689 (high, proof): Stress-test the |t_c_proj| upper-bound lemmas B1 (slope)
 * and B2 (intercept) -- the binding OLS-projection residual P1 in L_cond. State
 * precisely WHAT each of B1 and B2 would need to be UNCONDITIONAL, evaluate the
 * gap between the CM-model / GUE-conditional closures and an unconditional bound,
 * and report whether any unconditional slope/intercept upper bound is achievable
 * from Weyl-density input ALONE.
 *
 * THIS IS A STATUS / NEGATIVE-CERTIFICATION MODULE. It asserts NO new bound and
 * makes NO claim that |t_c_proj| is rigorously bounded. It consolidates the
 * conditional status of B1 (b1-slope-conditional-upper-bound.js, imp-457) and B2
 * (b2-intercept-analytic-bound.js, imp-458) into one honest record for the
 * finite-N* = 1e4 beat.
 *
 * THE BINDING RESIDUAL P1 (imp-2633)
 * ----------------------------------
 * In L_cond = |t_c_proj| + E_flow + E_coll, the term |t_c_proj| approx 0.0071 is
 * the OLS POINT ESTIMATE a + b/N from PATH_C_BASELINE_FIT_V2 (imp-400), NOT a
 * rigorous upper bound (imp-2632). Pinning it to a theorem needs BOTH:
 *   B1 -- an analytic upper bound on the slope b      (imp-363/370)
 *   B2 -- an analytic upper bound on the intercept a  (lambda-zero-attack.js)
 * because |t_c_proj|(N) = a + b/N, so an honest upper bound needs both a^+ and b^+.
 *
 * WHAT B1 WOULD NEED TO BE UNCONDITIONAL
 * --------------------------------------
 * B1 is CONDITIONALLY CLOSED under the CM-model structural pair NoSwap + D-monotone
 * (b1-slope-conditional-upper-bound.js): the boundary ODE d(g_{k*}^2)/dtau = -D(tau)
 * with D(tau) >= D(0) gives tau_c(N) <= g0^2 / D(0), hence b(N) = N.tau_c(N) <= b_lin(N),
 * yielding the certified ceiling B1_SLOPE_CEILING approx 5.18 (3-sf ceiling of
 * max_N b_lin over the fit Ns). D-monotone was analytically closed (imp-463), but
 * NoSwap (the argmin index k* is constant on [0, tau_c]) is a CM-flow structural
 * assumption: its only known closures are
 *   (a) the imp-464 mid-trajectory lemma, whose step (a) FAILS for actual zeta
 *       zeros (S_{k*}(0) > S_j(0) for all j does not hold -- imp-584 refuted), or
 *   (b) a direct GUE/ESY local-law bound on b(N) (the original imp-363/370 route).
 * UNCONDITIONAL REQUIREMENT: a proof of NoSwap (or a direct slope bound) that does
 * NOT assume the Calogero-Moser no-crossing structure. NONE is known from Weyl
 * density alone -- the slope is a property of the trajectory ORDERING, which the
 * mean density does not control. B1 is therefore CM-MODEL-CONDITIONAL.
 *
 * WHAT B2 WOULD NEED TO BE UNCONDITIONAL
 * --------------------------------------
 * B2 is CONDITIONALLY CLOSED under the monotonicity conjecture
 *   M: |t_c(N+1)| <= |t_c(N)| for all N >= 2
 * (b2-intercept-analytic-bound.js). Under M the intercept a = lim_N |t_c(N)| is the
 * INFIMUM, so a <= |t_c(N_max)| <= tau_c_upper_bound(N_max) approx 0.0094 << 0.02.
 * CRUCIAL: the per-N bound tau_c_upper_bound(N) = 1 / (2.(sup Im m_inf - psi_N)) is
 * the Koksma-Hlawka / Selberg bound (imp-341) and uses ONLY
 *   - the Riemann-von Mangoldt (WEYL) density rho_inf(x) = log(x/2pi)/(2pi), and
 *   - the Selberg unconditional |S(T)| <= C_Selberg.log T  (C_Selberg = 3.0).
 * So the per-N upper bound IS unconditional-from-Weyl. The GAP is the LIMIT step:
 * taking a = lim |t_c(N)| as the infimum requires M, and the only unconditional
 * route to M is a GUE/local-law rigidity input (imp-471-style), which is
 * IRREDUCIBLE per the imp-486-style search-complete verdict (no Weyl-only proof of
 * the monotone ORDERING of collision times across N exists). B2 is therefore
 * GUE-CONDITIONAL on the limit step, even though its per-N ingredient is Weyl-only.
 *
 * CAN ANY UNCONDITIONAL SLOPE/INTERCEPT BOUND COME FROM WEYL DENSITY ALONE?
 * ------------------------------------------------------------------------
 * PARTIAL YES, but NOT for the a, b decomposition that P1 needs:
 *   - A per-N upper bound on |t_c(N)| at a SINGLE fixed N IS achievable from Weyl
 *     density alone (the Koksma-Hlawka bound, Selberg + RvM, no GUE / no CM-ordering).
 *   - The SLOPE b (B1) is NOT: it is a property of the trajectory ordering under the
 *     CM flow (NoSwap), which the mean density does not see.
 *   - The INTERCEPT a (B2) is NOT: it is a limit/infimum over N, which needs the
 *     cross-N monotonicity M (GUE-conditional), not a single-N density bound.
 * Therefore |t_c_proj| = a + b/N remains an OLS POINT ESTIMATE: the strongest
 * unconditional object is the per-N Koksma-Hlawka bound at ONE N, which does NOT
 * certify the a, b coefficients of the 1/N expansion. NO unconditional bound on
 * |t_c_proj| follows from Weyl density alone. This funnels into the same route-map
 * wall (no false QED).
 *
 * HONEST VERDICT
 * --------------
 * P1 (|t_c_proj|) stays a NUMERICAL ESTIMATE. B1 is CM-MODEL-CONDITIONAL (NoSwap),
 * B2 is GUE-CONDITIONAL on the limit step (M via imp-471, irreducible per
 * imp-486-style). The per-N Koksma-Hlawka bound is the only Weyl-only unconditional
 * ingredient, and it certifies neither the slope nor the intercept of the fit.
 *
 * @see imp-2633-l-cond-constant-discharge (names P1/B1/B2 as the binding residual)
 * @see b1-slope-conditional-upper-bound (imp-457, B1 NoSwap + D-monotone chain)
 * @see b2-intercept-analytic-bound (imp-458, B2 monotonicity-M chain)
 * @see lambda-intercept-burgers-uniformity (imp-341, Koksma-Hlawka per-N bound)
 */

// Light status module -- baked reference literals, NO heavy imports (the B1/B2
// records transitively pull computational caches; we record their pinned values
// here instead of importing them, per the build-hang guidance).

// B1: certified 3-sf slope ceiling under NoSwap + D-monotone (imp-457).
const B1_SLOPE_CEILING_REF = 5.18;
const B1_EMPIRICAL_SLOPE = 4.91;     // OLS slope b from PATH_C_BASELINE_FIT_V2

// B2: Koksma-Hlawka per-N intercept bound at N_max under M (imp-458 / imp-341).
const B2_INTERCEPT_UB_REF = 0.0094;  // tau_c_upper_bound(N_max), << 0.02 target
const B2_INTERCEPT_TARGET = 0.02;

// P1: the OLS point estimate of |t_c_proj| at N* = 1e4 (imp-2633), NOT rigorous.
const TC_PROJ_N1E4 = 0.0071;

export const IMP2689_TC_PROJ_B1_B2_STATUS = {
  id: 'imp-2689',
  question:
    'Stress-test B1 (slope) and B2 (intercept) -- the binding OLS-projection residual P1 = |t_c_proj| in L_cond. State what each would need to be unconditional, evaluate the CM-model/GUE-conditional gap, and report whether any unconditional slope/intercept bound is achievable from Weyl density alone.',
  bindingResidual: 'P1',
  tcProjN1e4: {
    value: TC_PROJ_N1E4,
    status: 'OLS-POINT-ESTIMATE-NOT-RIGOROUS',
    form: '|t_c_proj|(N) = a + b/N  (PATH_C_BASELINE_FIT_V2, imp-400/imp-2632)',
    needs: 'BOTH an upper bound a^+ on the intercept (B2) AND b^+ on the slope (B1)',
  },
  B1: {
    target: 'analytic upper bound on the OLS slope b',
    conditionalStatus: 'CM-MODEL-CONDITIONAL',
    closedUnder: 'NoSwap + D-monotone (D-monotone analytically closed by imp-463)',
    certifiedCeilingUnderConditions: B1_SLOPE_CEILING_REF,
    empiricalSlope: B1_EMPIRICAL_SLOPE,
    whatItWouldNeedToBeUnconditional:
      'a proof of NoSwap (argmin index k* constant on [0, tau_c]) that does NOT assume the Calogero-Moser no-crossing structure, OR a direct GUE/ESY local-law slope bound (imp-363/370). The imp-464 mid-trajectory closure FAILS for actual zeta zeros (imp-584).',
    weylDensitySufficient: false,
    weylDensityReason:
      'the slope is a property of the trajectory ORDERING under the CM flow (NoSwap), which the mean (Weyl) density does not control.',
  },
  B2: {
    target: 'analytic upper bound on the OLS intercept a',
    conditionalStatus: 'GUE-CONDITIONAL (on the limit step)',
    closedUnder: 'monotonicity M: |t_c(N+1)| <= |t_c(N)| for all N >= 2 (imp-336)',
    perNboundUB: B2_INTERCEPT_UB_REF,
    target02: B2_INTERCEPT_TARGET,
    perNboundIsWeylOnly: true,
    perNboundInput:
      'Koksma-Hlawka / Selberg bound tau_c_upper_bound(N) = 1/(2(sup Im m_inf - psi_N)) using ONLY Riemann-von Mangoldt (Weyl) density rho_inf = log(x/2pi)/(2pi) and Selberg |S(T)| <= 3.0 log T -- no GUE input (imp-341)',
    whatItWouldNeedToBeUnconditional:
      'a proof of M (the cross-N monotone ordering of collision times). The only unconditional route to M is a GUE/local-law rigidity input (imp-471-style), IRREDUCIBLE per the imp-486-style search-complete verdict -- no Weyl-only proof of the monotone ordering exists.',
    weylDensitySufficient: false,
    weylDensityReason:
      'the per-N bound is Weyl-only, but the intercept a = lim_N |t_c(N)| is an infimum over N, which needs the cross-N monotonicity M (GUE-conditional), not a single-N density bound.',
  },
  weylOnlyVerdict: {
    perNsingleNboundAchievable: true,
    slopeAchievable: false,
    interceptAchievable: false,
    summary:
      'A per-N upper bound on |t_c(N)| at a SINGLE fixed N IS achievable from Weyl density alone (Koksma-Hlawka, Selberg + RvM). Neither the slope b (CM-ordering / NoSwap) nor the intercept a (cross-N limit / M) of the 1/N fit is. So |t_c_proj| = a + b/N has NO unconditional bound from Weyl density alone.',
  },
  funnelsIntoWall: true,
  honestVerdict:
    'P1 = |t_c_proj| stays a NUMERICAL ESTIMATE. B1 is CM-MODEL-CONDITIONAL ' +
    '(NoSwap, refuted for zeta zeros by imp-584) and B2 is GUE-CONDITIONAL on its ' +
    'limit step (M via imp-471, irreducible per imp-486-style). The per-N ' +
    'Koksma-Hlawka bound is the ONLY Weyl-only unconditional ingredient, and it ' +
    'certifies neither the slope nor the intercept of the fit. No claim that ' +
    '|t_c_proj| is rigorously bounded; this funnels into the same route-map wall. ' +
    'No false QED.',
  citation:
    'imp-2633-l-cond-constant-discharge.js (P1/B1/B2 naming); b1-slope-conditional-upper-bound.js (imp-457); b2-intercept-analytic-bound.js (imp-458); lambda-intercept-burgers-uniformity.js (imp-341 Koksma-Hlawka); imp-470/471 (CM/GUE closures); imp-486-style irreducibility',
};

export const IMP2689_TC_PROJ_B1_B2_STATUS_ASSERTIONS = [
  {
    id: 'imp2689-B1-cm-model-conditional',
    description: 'B1 (slope) is recorded as CM-MODEL-CONDITIONAL and NOT sufficient from Weyl density alone',
    holds: () =>
      IMP2689_TC_PROJ_B1_B2_STATUS.B1.conditionalStatus === 'CM-MODEL-CONDITIONAL' &&
      IMP2689_TC_PROJ_B1_B2_STATUS.B1.weylDensitySufficient === false,
  },
  {
    id: 'imp2689-B2-gue-conditional',
    description: 'B2 (intercept) is recorded as GUE-CONDITIONAL on its limit step, even though its per-N ingredient is Weyl-only',
    holds: () =>
      IMP2689_TC_PROJ_B1_B2_STATUS.B2.conditionalStatus.includes('GUE-CONDITIONAL') &&
      IMP2689_TC_PROJ_B1_B2_STATUS.B2.perNboundIsWeylOnly === true &&
      IMP2689_TC_PROJ_B1_B2_STATUS.B2.weylDensitySufficient === false,
  },
  {
    id: 'imp2689-weyl-only-perN-yes-fit-no',
    description: 'A per-N single-N bound is Weyl-achievable, but neither the slope nor the intercept of the 1/N fit is',
    holds: () => {
      const v = IMP2689_TC_PROJ_B1_B2_STATUS.weylOnlyVerdict;
      return v.perNsingleNboundAchievable === true &&
        v.slopeAchievable === false &&
        v.interceptAchievable === false;
    },
  },
  {
    id: 'imp2689-tcproj-not-rigorous',
    description: 'P1 = |t_c_proj| is recorded as an OLS point estimate, NOT a rigorous bound; no false QED',
    holds: () =>
      IMP2689_TC_PROJ_B1_B2_STATUS.tcProjN1e4.status === 'OLS-POINT-ESTIMATE-NOT-RIGOROUS' &&
      IMP2689_TC_PROJ_B1_B2_STATUS.tcProjN1e4.value === 0.0071 &&
      IMP2689_TC_PROJ_B1_B2_STATUS.funnelsIntoWall === true,
  },
  {
    id: 'imp2689-B2-perN-bound-clears-target',
    description: 'The B2 per-N Koksma-Hlawka upper bound (~0.0094) clears the 0.02 assembly target under M (the conditional part is the limit step, not the magnitude)',
    holds: () =>
      IMP2689_TC_PROJ_B1_B2_STATUS.B2.perNboundUB < IMP2689_TC_PROJ_B1_B2_STATUS.B2.target02 &&
      IMP2689_TC_PROJ_B1_B2_STATUS.B2.perNboundUB > 0,
  },
];

for (const a of IMP2689_TC_PROJ_B1_B2_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2689-tc-proj-b1-b2-status assertion failed: ${a.id}`);
  }
}
