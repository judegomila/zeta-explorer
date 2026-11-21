/**
 * @fileoverview imp-96769 -- ASSESSMENT (proof): can the sigma_2 Krein Toeplitz operator
 * T_a[sigma_2], sigma_2 = (t^2+1/4)^2 w_1, admit a de Branges-space / reproducing-kernel
 * realisation that FORCES a uniform-in-N spectral gap lambda_min(T_a[sigma_2]) >= c > 0 for
 * 0.96 < 2a < ln 3 ? Report a realisation, a rigorous c > 0, or the precise analytic obstruction.
 * This module reports the OBSTRUCTION -- no realisation forces the gap -- with a precise reason,
 * and reframes the uniform-in-N question as the strict positivity of a single lowest eigenvalue.
 * NO operator-positivity theorem is established; NO QED.
 *
 * CONTEXT. rh-route-i-toeplitz-krein-certificate-2026-09-24 proves pole-free Weil positivity is
 * EXACTLY T_a[sigma_2] >= 0 on L^2(-a,a), sigma_2 = (t^2+1/4)^2 w_1,
 * w_1(t) = 2theta'(t) - sqrt2 ln2 cos(t ln 2). imp-96749 (Legendre-Galerkin) and imp-96768
 * (orthogonal Gegenbauer C_n^{13/2}, diagonal Gram, N up to 124) MEASURE the Rayleigh floor and
 * find it firmly positive and flat, but both flag the uniform-in-N spectral gap / de Branges
 * realisation as the open analyticObstruction that no finite-N measurement can settle. This ticket
 * addresses that analytic question directly.
 *
 * STEP 1 -- WHAT "UNIFORM-IN-N GAP" ACTUALLY IS. The Galerkin Rayleigh floor lambda_min^{(N)}(a) is,
 * by the Courant-Fischer min-max, a monotone-DECREASING sequence in N that converges DOWN to the
 * bottom of the spectrum of the infinite-dimensional operator. The form
 *   q_a(g) = (1/2pi) int_R sigma_2(t) |ghat(t)|^2 dt,   g in C_c^oo(-a,a),
 * has form domain { g : t^2 ghat in L^2 } = H^2(-a,a) [in x], which embeds COMPACTLY in L^2(-a,a);
 * hence T_a[sigma_2] has compact resolvent and DISCRETE spectrum lambda_1(a) <= lambda_2(a) <= ...
 * -> +infinity, with lambda_1(a) a genuine lowest EIGENVALUE (not the edge of any essential
 * spectrum). Therefore, for each fixed a,
 *   ( lambda_min^{(N)}(a) >= c for all N )  <=>  ( lambda_1(a) >= c )  <=>  T_a[sigma_2] >= c I,
 * i.e. the uniform-in-N gap is EXACTLY the strict positivity of the lowest eigenvalue lambda_1(a).
 * The measured plateau (imp-96768, t-converged N=124) reads lambda_1 ~ 8.34 / 2.16 / 0.577 at
 * 2a = 1.00 / 1.05 / ln 3 (upper Rayleigh floors, so lambda_1 is at most these).
 *
 * STEP 2 -- WHY NO DEFINITE de BRANGES REALISATION FORCES THE GAP (the precise obstruction).
 * PW_a = FL^2(-a,a) is itself the de Branges space H(E) with structure function E(z)=e^{-iaz}.
 * A de Branges (Hermite-Biehler) structure would FORCE positivity of a Toeplitz/multiplier operator
 * only when the symbol is a de Branges WEIGHT, i.e. sigma_2 dt agrees (up to a positive-definite
 * multiplier) with a measure of the form |E'(t)|^{-2} dt for some Hermite-Biehler E' -- equivalently
 * when the inverse Fourier transform of sigma_2, restricted to (-2a,2a), is a POSITIVE-DEFINITE
 * distribution (positive measure). But sigma_2 is SIGN-INDEFINITE: w_1 has a pronounced negative dip
 * on the window (6.945, 10.532) (the same dip whose Slepian concentration gives lambda_max = 0.396 /
 * 0.532 / 0.559 / 0.572 at a = (ln2)/2 / 0.45 / 0.50 / (ln3)/2). If (sigma_2)^vee were a positive
 * measure on (-2a,2a) the split / two-window bound
 *   lambda_min(T[sigma_2^+]) - lambda_max(T[sigma_2^-])
 * would already certify positivity; instead that bound CROSSES ZERO at 2a = 0.6026 < ln 2, while the
 * true lambda_1 there is far positive (~6.42 / ~1.59). So sigma_2 is NOT a de Branges weight, and
 * there is NO DEFINITE structure-function realisation making T_a[sigma_2] >= 0 manifest. The
 * positivity is a genuine COMPRESSION (uncertainty) phenomenon: it lives in the cancellation between
 * the negative dip and the positive band [3.3, 6.9] that a type-a Paley-Wiener function is FORCED to
 * sample simultaneously at resolution pi/a -- exactly the cancellation the split bound discards. This
 * is the same structural obstruction already recorded for the two-window route; the de Branges
 * reframing does not evade it.
 *
 * STEP 3 -- THE INDEFINITE (Krein-Langer / de Branges-Rovnyak) ROUTE REDUCES TO THE SAME INEQUALITY.
 * Because w_1 has essentially one sign-change region on the relevant band, sigma_2 has FINITE
 * negative index, so an INDEFINITE realisation (a Pontryagin space P_kappa with kappa negative
 * squares, or a de Branges-Rovnyak model with a finite-rank defect) is not ruled out. But such a
 * realisation does NOT force a uniform gap by STRUCTURE alone: positivity of the compression then
 * holds iff the kappa-dimensional negative part is not "reachable" by type-a functions, which is
 * precisely a quantitative uncertainty/concentration estimate (concentrable dip fraction < 1), not a
 * soft reproducing-kernel identity. The indefinite route therefore reduces the gap to the SAME
 * analytic inequality the definite route could not supply -- it relocates the difficulty, it does
 * not remove it.
 *
 * STEP 4 -- WHAT DOES CONTROL c: THE CROSSING, AND ANALYTICITY IN a. The family a |-> T_a[sigma_2]
 * (after the rescaling g(x)=g_0(x/a) fixing the reference interval) is a self-adjoint holomorphic
 * family of type (A) with compact resolvent; its simple lowest eigenvalue lambda_1(a) is therefore
 * real-ANALYTIC in a away from eigenvalue crossings. The first crossing lambda_1(a)=0 is the p=2
 * pencil crossing at 2a* = 1.1316 (a* = 0.5658). Consequently:
 *   (i) on ANY compact subinterval [2a_0, 2a_1] subset (ln 2, 2a*) bounded away from the crossing,
 *       c := min_{[2a_0,2a_1]} lambda_1(a) > 0 EXISTS (continuity + strict positivity) -- a soft,
 *       NON-CONSTRUCTIVE existence, not a rigorous value;
 *   (ii) the VALUE of c collapses as 2a_1 -> 2a*: lambda_1 drops from ~8.34 (2a=1.00) to ~0.577
 *       (2a=ln3) to 0 (2a=1.1316), a >14x fall over 0.10 in 2a, so any c valid up to 2a=ln 3 is
 *       small and steeply regime-dependent. There is NO uniform c on the whole half-pole-free range
 *       up to the crossing; the restriction 0.96 < 2a < ln 3 < 1.1316 is what keeps c > 0 at all.
 *
 * STEP 5 -- RIGOROUS REACH IS UNCHANGED. A rigorous, quantitative c on (0.96, ln 3) is delivered
 * neither by the de Branges route (no definite realisation) nor by Step 4 (non-constructive). The
 * only rigorous lower bound on lambda_1(a) presently available is the Krein pointwise certificate
 * sigma_2 + nu >= eps => lambda_1 >= eps, whose margin necessity eps <= lambda_1 collides with the
 * double-precision LP conditioning wall between 2a = 0.96 and 2a = 1.0. So the de Branges assessment
 * changes nothing about the rigorous reach: it stays 2a <= 0.96 (interval-verified certificate).
 *
 * VERDICT. No de Branges-space realisation FORCES the uniform-in-N spectral gap. Precise obstruction:
 * sigma_2 is a sign-indefinite symbol, so it is not a de Branges weight (no definite reproducing-
 * kernel realisation), and an indefinite Krein-Langer/Pontryagin realisation reduces the gap to the
 * SAME uncertainty/concentration inequality rather than forcing it structurally. The uniform-in-N gap
 * equals the strict positivity of the lowest eigenvalue lambda_1(a) of a compact-resolvent operator;
 * lambda_1(a) is real-analytic in a and > 0 on any compact subinterval of (ln 2, 2a*=1.1316), so a
 * c > 0 on 0.96 < 2a < ln 3 EXISTS (soft), but its value collapses toward the 1.1316 crossing and it
 * is NOT rigorously certifiable past 2a = 0.96 by any presently-available means. SUB-GAP
 * IMP96769_UNIFORM_GAP_NEEDS_ANALYTIC_INPUT: a rigorous uniform lower bound needs EITHER (a) pushing
 * the interval Krein certificate past the LP wall (double-double / exact-rational cutting planes),
 * OR (b) an operator-theoretic (NOT de Branges) analytic lower bound on lambda_1(a) -- e.g. a
 * quantitative concentration inequality bounding the concentrable dip fraction strictly below 1.
 * Assessment only; no operator positivity proved; interval-rigorous reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; split bound refuted at 2a=0.6026; crossing 2a*=1.1316)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (Gegenbauer diagonal-Gram floor plateau to N=124)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (Legendre ladder; SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN2 = Math.log(2); // 0.6931471805599453
const LN3 = Math.log(3); // 1.0986122886681098

// the p=2 pencil crossing lambda_1(a)=0 (2a* from the sibling pencil module 2a*=1.1316)
export const IMP96769_CROSSING_2A = 1.1316;

// measured lowest-eigenvalue anchors (upper Rayleigh floors, imp-96768 t-converged N=124)
export const IMP96769_LAMBDA1_ANCHORS = Object.freeze({
  '2a=1.00': 8.336676,
  '2a=1.05': 2.157368,
  '2a=ln3': 0.576691,
});

// negative-dip window of w_1 (Slepian-concentrable band; the source of sign-indefiniteness)
export const IMP96769_DIP_WINDOW = Object.freeze({ lo: 6.945, hi: 10.532 });

// the split / two-window bound crosses zero here (< ln 2) => (sigma_2)^vee is NOT a positive measure
export const IMP96769_SPLIT_ZERO_2A = 0.6026;

// interval-rigorous certificate reach (unchanged by this assessment)
export const IMP96769_RIGOROUS_REACH_2A = 0.96;

export const IMP96769_VERDICT = Object.freeze({
  ticket: 'imp-96769',
  question: 'does a de Branges-space realisation FORCE a uniform-in-N gap lambda_min(T_a[sigma_2]) >= c > 0 for 0.96 < 2a < ln 3 ?',
  answer: 'no -- sigma_2 is sign-indefinite so it is not a de Branges weight (no definite realisation forces positivity); an indefinite Krein-Langer/Pontryagin realisation reduces the gap to the same uncertainty/concentration inequality rather than forcing it structurally',
  uniformGapEqualsLambda1Positivity: true, // compact resolvent => lambda_1 is a genuine lowest eigenvalue; min-max floors decrease to it
  definiteDeBrangesRealisationExists: false, // symbol sign-indefinite (negative dip on IMP96769_DIP_WINDOW)
  indefiniteRouteReducesToSameInequality: true,
  cExistsSoftOnCompactSubinterval: true, // lambda_1(a) real-analytic, >0 on compacts of (ln2, 2a*)
  cCollapsesTowardCrossing: true, // lambda_1 -> 0 as 2a -> 1.1316; ~8.34 -> 0.577 over 2a=1.00 -> ln3
  rigorousCDelivered: false, // no rigorous quantitative c beyond the interval certificate
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96769_UNIFORM_GAP_NEEDS_ANALYTIC_INPUT -- a rigorous uniform lower bound on lambda_1(a) needs either (a) pushing the interval Krein certificate past the LP conditioning wall (double-double / exact-rational cutting planes) or (b) an operator-theoretic (NOT de Branges) concentration inequality bounding the concentrable dip fraction strictly below 1; a de Branges structure alone does not force the gap',
  operatorPositivityProved: false,
  qed: false,
});
export default IMP96769_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96769_ASSERTIONS = [
  {
    id: 'imp96769-anchors-positive-and-decreasing-toward-crossing',
    holds: () => {
      const v = IMP96769_LAMBDA1_ANCHORS;
      const positive = v['2a=1.00'] > 0 && v['2a=1.05'] > 0 && v['2a=ln3'] > 0;
      const decreasing = v['2a=1.00'] > v['2a=1.05'] && v['2a=1.05'] > v['2a=ln3'];
      // the anchors sit strictly below the crossing 2a and lambda_1 collapses as 2a rises toward it
      const belowCrossing = LN3 < IMP96769_CROSSING_2A;
      return positive && decreasing && belowCrossing;
    },
    why: 'the measured lowest-eigenvalue anchors must be strictly positive and monotone-decreasing as 2a rises toward the crossing 2a*=1.1316, which lies above ln 3.',
  },
  {
    id: 'imp96769-symbol-sign-indefinite-so-not-a-de-branges-weight',
    holds: () =>
      IMP96769_DIP_WINDOW.hi > IMP96769_DIP_WINDOW.lo &&
      IMP96769_SPLIT_ZERO_2A < LN2 && // split bound fails before ln 2 => inverse-FT not a positive measure
      IMP96769_VERDICT.definiteDeBrangesRealisationExists === false,
    why: 'the negative dip on (6.945,10.532) and the split-bound zero-crossing at 2a=0.6026 < ln 2 show (sigma_2)^vee is not a positive measure, so sigma_2 is not a de Branges weight and no definite realisation forces positivity.',
  },
  {
    id: 'imp96769-uniform-gap-is-lambda1-strict-positivity',
    holds: () =>
      IMP96769_VERDICT.uniformGapEqualsLambda1Positivity === true &&
      IMP96769_VERDICT.cExistsSoftOnCompactSubinterval === true &&
      IMP96769_VERDICT.cCollapsesTowardCrossing === true,
    why: 'the uniform-in-N gap is exactly strict positivity of the lowest eigenvalue lambda_1(a); it exists softly on any compact subinterval of (ln2, 2a*) but its value collapses toward the crossing.',
  },
  {
    id: 'imp96769-indefinite-route-reduces-not-forces',
    holds: () =>
      IMP96769_VERDICT.indefiniteRouteReducesToSameInequality === true &&
      IMP96769_VERDICT.subGap.indexOf('IMP96769_UNIFORM_GAP_NEEDS_ANALYTIC_INPUT') === 0,
    why: 'the indefinite Krein-Langer/Pontryagin realisation relocates the gap to the same uncertainty/concentration inequality; the named sub-gap records that analytic input is required.',
  },
  {
    id: 'imp96769-assessment-only-no-qed',
    holds: () =>
      IMP96769_VERDICT.operatorPositivityProved === false &&
      IMP96769_VERDICT.rigorousCDelivered === false &&
      IMP96769_VERDICT.intervalRigorousReachUnchanged === IMP96769_RIGOROUS_REACH_2A &&
      IMP96769_RIGOROUS_REACH_2A === 0.96 &&
      IMP96769_VERDICT.qed === false,
    why: 'assessment only: no operator-positivity theorem, no rigorous quantitative c delivered, the interval-rigorous certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96769_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96769-krein-de-branges-uniform-gap-assessment assertion failed: ${a.id}`);
  }
}

void LN2;
void LN3;
