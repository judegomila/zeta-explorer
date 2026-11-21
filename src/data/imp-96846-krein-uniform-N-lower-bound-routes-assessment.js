/**
 * @fileoverview imp-96846 -- ASSESSMENT (proof): which route can deliver a LOWER bound on the
 * Route I Krein floor lambda_min(T_a[sigma_2]) that is UNIFORM in the Galerkin dimension N ? The
 * tabulated floors are N-Galerkin Rayleigh UPPER bounds (Courant-Fischer min-max), monotone
 * DECREASING in N (0.6174 -> 0.5786 -> 0.5521 at N=20/28/36 for 2a=ln3), so a positive floor is
 * necessary-consistency, NOT operator positivity (recurring obstruction IMP96749_UNIFORM_N_GAP
 * cited by imp-96827 / imp-96834 / imp-96835). This module weighs the three candidate routes the
 * ticket names -- (A) a coercivity / Garding estimate, (B) a trace-class tail control, (C) a min-max
 * COMPLEMENTARY (lower-bound) eigenvalue method -- reports which is most tractable, and names the
 * precise analytic obstruction that stops each. NO operator-positivity theorem is established; NO QED.
 *
 * CONTEXT. rh-route-i-toeplitz-krein-certificate-2026-09-24 proves pole-free Weil positivity is
 * EXACTLY T_a[sigma_2] >= 0 on L^2(-a,a), sigma_2(t) = (t^2+1/4)^2 w_1(t),
 * w_1(t) = 2 theta-prime(t) - sqrt2 ln2 cos(t ln 2). The quadratic form is
 *   q_a(g) = (1/2pi) int_R sigma_2(t) |ghat(t)|^2 dt,   g in C_c-infinity(-a,a),
 * and lambda_min(T_a[sigma_2]) = inf_g q_a(g) / ||g||_{L^2}^2. imp-96769 already ruled out the de
 * Branges / reproducing-kernel route (sigma_2 sign-indefinite => not a de Branges weight) and reduced
 * the uniform-in-N gap to strict positivity of the lowest eigenvalue lambda_1(a) of a COMPACT-RESOLVENT
 * operator (form domain H^2(-a,a) [in x] embeds compactly in L^2, so the spectrum is discrete and
 * lambda_1 is a genuine lowest eigenvalue, not an essential-spectrum edge). This ticket assesses the
 * three OPERATOR-THEORETIC routes de Branges did not cover.
 *
 * SYMBOL ORDER (used by all three routes). theta-prime(t) ~ (1/2) ln(t / 2pi) for large t, so
 * w_1(t) ~ ln t and sigma_2(t) ~ t^4 ln t: the principal symbol is POSITIVE of order 4 (times a log),
 * while the SIGN-INDEFINITENESS lives entirely in the fixed mid-band dip of w_1 on (6.945, 10.532) --
 * a bounded, lower-order feature. This split (positive high-order principal part + indefinite bounded
 * mid-band) is what decides each route below.
 *
 * ROUTE A -- COERCIVITY / GARDING. A Garding inequality for the order-4 positive principal symbol gives
 *   q_a(g) >= c_0 ||g||_{H^2(-a,a)}^2 - C ||g||_{L^2}^2,
 * with C controlled by the L-infinity size of the NEGATIVE part of sigma_2 on the dip band. This is a
 * genuine, classical estimate -- but it is a lower bound of the WRONG kind: bounding the H^2 term below
 * by zero yields only q_a(g) >= -C ||g||_{L^2}^2, i.e. lambda_1 >= -C < 0. Garding delivers exactly the
 * two facts already known (semiboundedness + discreteness / compact resolvent) and NOTHING toward a
 * POSITIVE floor, because the sign-indefiniteness is a bounded lower-order (compact) contribution that
 * the Garding principal-symbol estimate discards with the wrong sign. OBSTRUCTION A: coercivity controls
 * the high-t principal part but the positivity is decided by the fixed mid-band dip, which Garding cannot
 * see; the reachable constant is -C, never a positive c. Route A is STRUCTURALLY INCAPABLE of a positive
 * uniform floor.
 *
 * ROUTE B -- TRACE-CLASS TAIL CONTROL. The hope: split T_a[sigma_2] = P_N T P_N + tail and bound the
 * Galerkin tail in trace (or operator) norm so that lambda_1 >= lambda_min^{(N)} - ||tail||. This fails
 * at the OUTSET: T_a[sigma_2] is UNBOUNDED (order-4 symbol t^4 ln t), so its high-mode Galerkin tail
 * (I - P_N) T (I - P_N) is unbounded -- not trace-class, not even bounded -- and no norm bound on it
 * exists. Only the RESOLVENT (T + m)^{-1} (m large) is compact/trace-class, and a trace-class tail bound
 * on the resolvent would control eigenvalue LOCATIONS only if the resolvent EXISTS at the point of
 * interest z = 0, i.e. only if lambda_1 != 0 is ALREADY known -- circular for certifying lambda_1 > 0.
 * What survives is strictly a CONVERGENCE-RATE statement: a certified operator-norm rate for the
 * compact resolvent Galerkin truncation would turn a MEASURED lambda_min^{(N)} into
 * lambda_1 >= lambda_min^{(N)} - delta_N. That rate is exactly the open (N,T) joint-resolution envelope
 * of imp-96827 / imp-96847, currently rigorous-STYLE modeling not a proof (imp-96848). OBSTRUCTION B:
 * the tail of the unbounded T is not trace-class; the only viable variant reduces to the open
 * resolvent-truncation rate and cannot by itself decide the sign of lambda_1.
 *
 * ROUTE C -- MIN-MAX COMPLEMENTARY (LOWER-BOUND) EIGENVALUE METHODS. Ritz/Galerkin gives only UPPER
 * bounds lambda_1 <= lambda_min^{(N)}. The classical way to a genuine LOWER bound is a complementary
 * method: Temple, Kato-Temple, Lehmann-Maehly-Goerisch, or Weinstein-Aronszajn. Temple/Kato-Temple give
 *   lambda_1 >= mu - (||T g - mu g||^2) / (beta - mu),   provided beta <= lambda_2 and mu < beta,
 * for a trial g with Rayleigh quotient mu; Lehmann-Goerisch generalises this to certified two-sided
 * enclosures. These are the ONLY routes that structurally produce lower bounds on lambda_1, and their
 * ingredients are all interval-arithmetic-friendly here: the residual ||T g - mu g|| is an L^2 norm of
 * sigma_2 ghat (order-8 symbol, finite on the compact support), and mu is a Rayleigh quotient. This
 * makes Route C the MOST TRACTABLE of the three -- it is the standard rigorous machinery for exactly
 * this "Galerkin-from-above needs a companion from-below" situation. What it still REQUIRES is an
 * a-priori LOWER bound beta on the SECOND eigenvalue lambda_2(a) (equivalently a certified spectral-gap
 * enclosure, or a solvable base problem T_0 <= T with known spectrum for Lehmann-Goerisch). For the
 * sign-indefinite multiplier sigma_2 there is no obvious solvable base operator whose spectrum bounds
 * lambda_2 from below, so beta is not yet in hand. OBSTRUCTION C (the precise remaining step):
 * constructing a CERTIFIED a-priori lower bound beta <= lambda_2(a) (a base problem / rough eigenvalue
 * enclosure), after which Temple/Lehmann-Goerisch would deliver a rigorous positive lambda_1 lower bound
 * from the already-measured trial data -- WITHOUT any de Branges structure and WITHOUT the LP conditioning
 * wall of the pointwise Krein certificate.
 *
 * VERDICT. Route A (Garding) is structurally incapable of a positive uniform floor -- it yields only
 * semiboundedness + discreteness (already known) and the reachable constant is negative. Route B
 * (trace-class tail) is obstructed at the outset because the tail of the unbounded operator is not
 * trace-class; its only viable variant collapses onto the open resolvent-truncation convergence-rate
 * envelope (imp-96827 / imp-96847 / imp-96848) and cannot decide sgn(lambda_1) by itself. Route C
 * (min-max complementary: Temple / Kato-Temple / Lehmann-Goerisch) is the MOST TRACTABLE and the
 * recommended direction: it is the only route that structurally produces lower bounds on lambda_1, its
 * residual/Rayleigh ingredients are interval-friendly, and it reduces the whole problem to ONE concrete
 * missing input -- a certified a-priori lower bound beta on lambda_2(a). SUB-GAP
 * IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND: derive/certify an a-priori lower bound
 * beta <= lambda_2(a) (a solvable base problem or rough eigenvalue enclosure) on 0.96 < 2a < ln 3, then
 * feed the measured trial data through Kato-Temple / Lehmann-Goerisch to emit a rigorous positive floor.
 * Assessment only; no operator positivity proved; interval-rigorous certificate reach stays 2a <= 0.96;
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96769-krein-de-branges-uniform-gap-assessment.js (de Branges route ruled out; uniform-N gap = strict positivity of lambda_1 of a compact-resolvent operator)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (Legendre ladder; SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED; N=20/28/36 floors 0.6174/0.5786/0.5521 at 2a=ln3)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (Gegenbauer diagonal-Gram floor plateau to N=124)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (t-truncation residual envelope; the (N,T) rate Route B reduces to)
 * @see imp-96848 (the geometric-per-doubling tail is rigorous-STYLE modeling, not a proof)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN2 = Math.log(2); // 0.6931471805599453
const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this assessment)
export const IMP96846_RIGOROUS_REACH_2A = 0.96;

// the p=2 pencil crossing lambda_1(a)=0 (carried from imp-96769; ln3 sits below it)
export const IMP96846_CROSSING_2A = 1.1316;

// the three candidate routes, verdict on each, and the reachable constant sign
export const IMP96846_ROUTES = Object.freeze({
  A_garding_coercivity: Object.freeze({
    verdict: 'structurally incapable of a positive uniform floor',
    reachableConstantSign: 'negative', // Garding gives lambda_1 >= -C, C = L-infinity dip depth
    delivers: 'semiboundedness + discreteness only (already known via compact resolvent)',
    obstruction: 'sign-indefiniteness lives in the fixed bounded mid-band dip (6.945,10.532), a lower-order (compact) term Garding discards with the wrong sign; coercivity only controls the order-4 positive principal part',
  }),
  B_trace_class_tail: Object.freeze({
    verdict: 'obstructed at the outset; only variant reduces to an open convergence-rate',
    reachableConstantSign: 'undecidable by itself',
    delivers: 'nothing directly; a certified resolvent-truncation rate would only convert a MEASURED floor to lambda_1 >= lambda_min^{(N)} - delta_N',
    obstruction: 'T_a[sigma_2] is unbounded (order-4 symbol t^4 ln t) so its Galerkin tail is not trace-class; only the resolvent is compact, and a resolvent-tail bound at z=0 presupposes lambda_1 != 0 (circular); the viable variant is the open (N,T) rate of imp-96827/96847/96848',
  }),
  C_minmax_complementary: Object.freeze({
    verdict: 'MOST TRACTABLE; recommended direction; reduces to one concrete missing input',
    reachableConstantSign: 'positive', // reachable IF the a-priori lambda_2 lower bound is supplied
    delivers: 'a genuine rigorous LOWER bound on lambda_1 via Temple / Kato-Temple / Lehmann-Goerisch from the already-measured trial data',
    obstruction: 'requires a certified a-priori LOWER bound beta on the second eigenvalue lambda_2(a) (a solvable base problem T_0 <= T with known spectrum, or a rough eigenvalue enclosure); no obvious base operator exists yet for the sign-indefinite sigma_2',
  }),
});

export const IMP96846_MOST_TRACTABLE = 'C_minmax_complementary';

export const IMP96846_VERDICT = Object.freeze({
  ticket: 'imp-96846',
  question: 'which route delivers a LOWER bound on lambda_min(T_a[sigma_2]) uniform in the Galerkin dimension N ?',
  uniformGapEqualsLambda1Positivity: true, // carried from imp-96769 (compact resolvent)
  gardingReachesPositiveFloor: false,
  traceClassTailIsWellPosed: false, // tail of an unbounded operator is not trace-class
  traceClassTailReducesToOpenRate: true,
  complementaryMethodIsMostTractable: true,
  complementaryMethodNeedsLambda2LowerBound: true,
  rigorousUniformFloorDelivered: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND -- Route C (Temple/Kato-Temple/Lehmann-Goerisch) is the only route that structurally yields lower bounds on lambda_1 and is interval-friendly; it reduces the uniform-in-N floor to ONE missing input, a certified a-priori lower bound beta <= lambda_2(a) (base problem / rough enclosure) on 0.96 < 2a < ln 3, after which the measured trial data emit a rigorous positive floor; Route A (Garding) can reach only lambda_1 >= -C, Route B (trace-class tail) is ill-posed for the unbounded T and its variant is the open (N,T) rate',
  operatorPositivityProved: false,
  qed: false,
});
export default IMP96846_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96846_ASSERTIONS = [
  {
    id: 'imp96846-garding-cannot-reach-positive-floor',
    holds: () =>
      IMP96846_ROUTES.A_garding_coercivity.reachableConstantSign === 'negative' &&
      IMP96846_VERDICT.gardingReachesPositiveFloor === false,
    why: 'a Garding coercivity estimate for the order-4 positive principal symbol yields only lambda_1 >= -C with C the dip depth, i.e. it delivers semiboundedness/discreteness but never a positive uniform floor.',
  },
  {
    id: 'imp96846-trace-class-tail-ill-posed-and-reduces-to-open-rate',
    holds: () =>
      IMP96846_VERDICT.traceClassTailIsWellPosed === false &&
      IMP96846_VERDICT.traceClassTailReducesToOpenRate === true,
    why: 'T_a[sigma_2] is unbounded so its Galerkin tail is not trace-class; the only viable variant is a certified resolvent-truncation rate, which is the open (N,T) convergence envelope of imp-96827/96847/96848.',
  },
  {
    id: 'imp96846-complementary-is-most-tractable',
    holds: () =>
      IMP96846_MOST_TRACTABLE === 'C_minmax_complementary' &&
      IMP96846_VERDICT.complementaryMethodIsMostTractable === true &&
      IMP96846_ROUTES.C_minmax_complementary.reachableConstantSign === 'positive' &&
      IMP96846_VERDICT.complementaryMethodNeedsLambda2LowerBound === true,
    why: 'Temple/Kato-Temple/Lehmann-Goerisch is the only route that structurally produces lower bounds on lambda_1 and is interval-friendly; it is the most tractable and reduces to one missing input, a certified a-priori lower bound on lambda_2.',
  },
  {
    id: 'imp96846-subgap-named-and-crossing-above-ln3',
    holds: () =>
      IMP96846_VERDICT.subGap.indexOf('IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND') === 0 &&
      LN2 < LN3 && LN3 < IMP96846_CROSSING_2A,
    why: 'the sub-gap records the single missing analytic input (an a-priori lower bound on lambda_2); the target range ln2 < 2a < ln3 sits below the p=2 crossing 2a*=1.1316 where lambda_1 stays positive.',
  },
  {
    id: 'imp96846-assessment-only-no-qed',
    holds: () =>
      IMP96846_VERDICT.operatorPositivityProved === false &&
      IMP96846_VERDICT.rigorousUniformFloorDelivered === false &&
      IMP96846_VERDICT.intervalRigorousReachUnchanged === IMP96846_RIGOROUS_REACH_2A &&
      IMP96846_RIGOROUS_REACH_2A === 0.96 &&
      IMP96846_VERDICT.qed === false,
    why: 'assessment only: no operator-positivity theorem, no rigorous uniform floor delivered, the interval-rigorous certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96846_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96846-krein-uniform-N-lower-bound-routes-assessment assertion failed: ${a.id}`);
  }
}

void LN2;
void LN3;
