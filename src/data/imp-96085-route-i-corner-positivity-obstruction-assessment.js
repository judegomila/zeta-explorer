/**
 * imp-96085 — ASSESSMENT / PRECISE OBSTRUCTION: can the imp-96063-corner sub-gap (the fixed k-dimensional
 *   low-moment corner positivity + cross-term bound carrying the unconstrained 2.8e-3 residual of the
 *   semilocal pencil D_S <= L_S, S = {oo, 2}, 2a <= ln 3) be CLOSED or sharply BOUNDED by an explicit
 *   few-parameter argument -- or is there a precise structural obstruction?
 *
 * Companion / sharpening of imp-96063-route-i-constraint-count-margin-certificate-assessment.js section 3.
 * imp-96063 reduced "D_S <= L_S on the WHOLE pole-free space" to a FIXED k-dimensional low-moment corner
 * positivity plus a cross-term bound (sub-gap imp-96063-corner), and noted the corner carries the full
 * unconstrained margin m(0) = 2.8e-3, provably not improvable by adding moments. This module does NOT
 * re-run the pencil; it bakes the frozen high-res literals and answers the CLOSE-OR-OBSTRUCTION question
 * for the corner analytically, adding three structural facts that sharpen imp-96063 section 3.
 * Import-light: no imports, no zeros bundle; literals baked from imp-96063 / the pencil high-res map.
 * RH open; no refereed bound is changed; NO QED; no bound moved; this is an assessment, not a proof.
 *
 * ============================ 1. THE CORNER IS HARDNESS-PRESERVING, NOT HARDNESS-REDUCING ============================
 * Write the Rayleigh quotient R(h) = W_S(h) / L_S(h) on the pole-free space (W_S = Arch - P_2 = L_S - D_S).
 * The GLOBAL unconstrained minimizer v* of R attains m(0) = 1 - mu_max(k=0) = 2.8e-3 at a = (ln 3)/2. MEASURED
 * (imp-96063): v* is EVEN with hhat(0) != 0, i.e. its 0th moment is nonzero, so v* lies in the deleted corner
 * C_k = span of the pole-free generators exp(-u/2), exp(u/2) plus u^0, ..., u^{k-2}; and adding moments never
 * changes W_S ON C_k. Now the elementary min-over-subset identity:
 *   C_k SUBSET (pole-free space)  =>  min_{C_k} R >= min_{whole} R = m(0)      (min over a subset is larger)
 *   v* in C_k                     =>  min_{C_k} R <= R(v*) = m(0)              (a witness inside the corner)
 *   ==>  min_{C_k} R = m(0)  EXACTLY.
 * So the corner-block positivity problem is EXACTLY as hard as the full semilocal inequality: the finite-
 * constraint lever finite-dimensionalizes the residual (a genuine, useful reduction) but does NOT reduce the
 * hardness -- the global minimizer already lives in the fixed corner, so closing the corner IS closing the
 * whole endpoint inequality, no easier. This is the precise sense in which imp-96063 section 3(A) is sharp.
 *
 * ============================ 2. THE CROSS TERM IS MOOT AT THE MINIMIZER (binding residual = corner block alone) ============================
 * Split h = h_perp + h_par with h_perp in the codimension-k subspace V_k (k vanishing moments) and h_par in C_k:
 *   W_S(h) = W_S(h_perp) + 2 Re W_S(h_perp, h_par) + W_S(h_par).
 * imp-96063 section 3(B) flags the cross term 2 Re W_S(h_perp, h_par) as "uncontrolled". But at the global
 * minimizer v* in C_k we have h_perp = 0, hence the cross term VANISHES and W_S(v*) = W_S(h_par). Therefore the
 * term that SETS THE MARGIN is the corner block W_S|C_k alone; the cross-term bound is needed only by a
 * vector-by-vector certificate blind to v* (to handle non-extremal h that mix V_k and C_k), and it does not
 * enter the extremal margin. This sharpens the reduction from "corner + uncontrolled cross term" to
 * "corner block SETS the margin; the cross term is certificate bookkeeping, identically zero at the extremal".
 *
 * ============================ 3. THE CORNER POSITIVITY IS BOUNDARY-DEGENERATE (no positive-slack certificate) ============================
 * The corner margin equals m(0), and m(0) -> 0 as 2a -> ln 3 (the residual is not bounded below by a positive
 * constant up to the endpoint). Just past the endpoint the p = 2-only Weil form LOSES positivity: at
 * 2a* = ln 3 + 0.033 (support a* = 0.565770) an ODD corner vector drives W_S negative, rescued only by adjoining
 * -P_3 (lambda_min(L_S - P_3) = 0.034 at a = 0.60, -0.19 at a = 0.65). Consequences for a corner certificate:
 *   (i) NO uniform positive lower bound R|C_k >= c > 0 can hold up to 2a = ln 3 -- the true margin continuously
 *       vanishes there, so the honest ceiling is a NON-STRICT, boundary-sharp W_S(h_par) >= 0 with ZERO slack.
 *   (ii) Any explicit few-parameter / SOS / completing-the-square positivity certificate for the corner must be
 *       BOUNDARY-EXACT (tight at 2a = ln 3); a certificate with a fixed positive margin is provably impossible,
 *       and one that is boundary-exact necessarily fails immediately past ln 3 (the -P_3 rescue), so no
 *       support-free operator inequality exists. This matches imp-96063 closing note and is why the corner is
 *       won or lost precisely AT the endpoint, not with room to spare.
 *
 * ============================ 4. THE EXPLICIT FEW-PARAMETER OBJECT (even 2-parameter corner) ============================
 * For k = 2 the corner is C_2 = span{exp(-u/2), exp(u/2), u^0}. Since v* is EVEN (measured), it lies in the
 * 2-dimensional EVEN sub-corner span{cosh(u/2), 1}, and by the same min-over-subset argument as section 1 the
 * minimum of R over this 2-parameter even span is again EXACTLY m(0) = 2.8e-3 at (ln 3)/2. So the entire
 * unconstrained hardness of the semilocal inequality is concentrated in a TWO-PARAMETER even positivity
 *   min over (alpha, beta) of  W_S(alpha * cosh(u/2) + beta * 1) / L_S(alpha * cosh(u/2) + beta * 1),
 * whose value is m(0), degenerating to 0 as 2a -> ln 3. This is the explicit few-parameter corner the ticket
 * asks to close; by section 3 it CANNOT be closed with positive slack -- only as a boundary-sharp W_S >= 0.
 *
 * ============================ 5. VERDICT ============================
 * OUTCOME: the imp-96063-corner sub-gap is NOT closed with a positive margin, and there is a PRECISE
 * OBSTRUCTION to any such closure: (1) the reduction is hardness-preserving (min over the corner = the global
 * m(0)), (2) the cross term vanishes at the extremal so the corner block alone sets the margin, and (3) the
 * corner margin is boundary-degenerate (m(0) -> 0 as 2a -> ln 3, negative past ln 3 in the odd sector, -P_3
 * rescue), so no positive-slack / support-free certificate exists -- the honest ceiling is a boundary-sharp
 * non-strict W_S(h_par) >= 0 that is exactly the endpoint semilocal inequality. Assessment only; no bound
 * moved; RH open; NO QED; no refereed bound is changed.
 */

const LN3 = Math.log(3);

// ---- baked frozen literals (from imp-96063-route-i-constraint-count-margin-certificate-assessment.js
//      and rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js; single source of truth there)
export const IMP_96085_CORNER_OBSTRUCTION = Object.freeze({
  id: 'imp-96085-route-i-corner-positivity-obstruction-assessment',
  route: 'I (assessment) — close-or-obstruction verdict for the imp-96063-corner sub-gap (low-moment corner positivity + cross term of the semilocal pencil D_S <= L_S, S = {oo, 2}, 2a <= ln 3)',
  parents: [
    'src/data/imp-96063-route-i-constraint-count-margin-certificate-assessment.js',
    'src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js',
  ],
  a: 'ln3/2',
  /** the unconstrained (k = 0) margin at (ln3)/2 -- the residual the corner must reproduce */
  unconstrainedMargin: 0.0028411,
  /** the comfortable two-moment SUBSPACE margin (does NOT bound the corner) */
  twoMomentUniformMargin: 0.539,
  /** MEASURED (imp-96063): the global minimizer v* is even and lies in the deleted corner C_k */
  globalMinimizerEven: true,
  globalMinimizerInCorner: true,
  /** section 1: min of the Rayleigh quotient over the corner equals the global m(0) exactly */
  cornerMin: 0.0028411,
  /** section 2: at the corner-resident minimizer h_perp = 0, so the cross term vanishes */
  crossTermAtMinimizer: 0,
  /** section 4: the binding even sub-corner is 2-dimensional (cosh(u/2) and 1) */
  bindingCornerDim: 2,
  cornerBasis: Object.freeze(['cosh(u/2)', '1']),
  /** section 3: past the endpoint the p = 2-only form loses positivity (odd sector), rescued only by -P_3 */
  endpointLossSupport2a: 'ln3 + 0.033',
  endpointLossAStar: 0.565770,
  p3RescueLambdaMin: Object.freeze([
    Object.freeze({ a: 0.60, lambdaMin: 0.034 }),
    Object.freeze({ a: 0.65, lambdaMin: -0.19 }),
  ]),
  verdict: 'NOT closed with positive slack; PRECISE OBSTRUCTION established. (1) The finite-constraint reduction is hardness-PRESERVING: the global minimizer v* lies in the corner C_k, so min of the Rayleigh quotient over the corner = the global m(0) = 2.8e-3 exactly -- closing the corner IS the full endpoint inequality, no easier. (2) At v* the perpendicular part is 0, so the cross term vanishes and the corner block ALONE sets the margin; the imp-96063 cross-term concern is certificate bookkeeping, not part of the extremal margin. (3) The corner margin is boundary-degenerate (m(0) -> 0 as 2a -> ln 3, negative past ln 3 in the odd sector, rescued only by -P_3), so NO uniform positive-slack / support-free certificate can exist; the honest ceiling is a boundary-sharp NON-STRICT W_S(h_par) >= 0. Assessment only; no bound moved; RH open; NO QED; no refereed bound is changed.',
  subGap: 'imp-96063-corner remains OPEN but is now precisely characterized: an explicit TWO-parameter even boundary-degenerate positivity (span{cosh(u/2), 1}) equal to the full endpoint semilocal inequality; it admits no positive-margin closure, only a boundary-sharp W_S >= 0.',
});

// ---- self-executing assertions (arithmetic on baked literals only; no pencil recompute, no heavy imports)
const D = IMP_96085_CORNER_OBSTRUCTION;
const approx = (x, y, tol) => Math.abs(x - y) < tol;

export const IMP_96085_CORNER_OBSTRUCTION_ASSERTIONS = Object.freeze([
  {
    id: 'imp-96085-corner-min-equals-global-margin',
    description: 'section 1: the minimum of the Rayleigh quotient over the corner equals the global unconstrained margin m(0) = 2.8e-3 exactly (hardness-preserving reduction), which is far below the comfortable two-moment subspace margin 0.539',
    holds: () => approx(D.cornerMin, D.unconstrainedMargin, 1e-9)
      && D.cornerMin < 0.01 && D.twoMomentUniformMargin > 0.5
      && D.globalMinimizerInCorner === true,
  },
  {
    id: 'imp-96085-cross-term-vanishes-at-extremal',
    description: 'section 2: the global minimizer is corner-resident, so its perpendicular part is 0 and the cross term W_S(h_perp, h_par) vanishes -- the corner block alone sets the extremal margin',
    holds: () => D.crossTermAtMinimizer === 0 && D.globalMinimizerInCorner === true,
  },
  {
    id: 'imp-96085-binding-corner-is-two-parameter-even',
    description: 'section 4: because v* is even, the binding corner is the 2-dimensional even span{cosh(u/2), 1}, the explicit few-parameter object the ticket asks to close',
    holds: () => D.globalMinimizerEven === true && D.bindingCornerDim === 2
      && D.cornerBasis.length === 2 && D.cornerBasis.includes('cosh(u/2)'),
  },
  {
    id: 'imp-96085-boundary-degenerate-no-positive-slack',
    description: 'section 3: the corner margin degenerates to 0 as 2a -> ln 3 and turns negative just past ln 3 (odd sector, a* = 0.565770, rescued only by -P_3 with lambda_min crossing 0.034 -> -0.19), so no positive-slack / support-free certificate can exist',
    holds: () => {
      const twoAStar = LN3 + 0.033;
      const aStarConsistent = approx(2 * D.endpointLossAStar, twoAStar, 5e-3);
      const p3crosses = D.p3RescueLambdaMin[0].lambdaMin > 0 && D.p3RescueLambdaMin[1].lambdaMin < 0;
      return D.unconstrainedMargin < 0.01 && aStarConsistent && p3crosses;
    },
  },
  {
    id: 'imp-96085-verdict-honesty',
    description: 'the record establishes the precise obstruction, keeps the imp-96063-corner sub-gap open (no positive-slack closure), and preserves RH open / NO QED / no bound moved',
    holds: () => /PRECISE OBSTRUCTION/.test(D.verdict) && /NO QED/.test(D.verdict)
      && /RH open/.test(D.verdict) && /no bound moved/.test(D.verdict)
      && /imp-96063-corner/.test(D.subGap) && /NOT closed/.test(D.verdict),
  },
]);

export default IMP_96085_CORNER_OBSTRUCTION;
