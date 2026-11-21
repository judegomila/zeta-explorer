/**
 * @module imp-97391-route-m-diagonal-skeleton-uniform-crossover-cohort-index
 * @fileoverview imp-97391 -- META cross-reference index note grouping the Route M interior
 *   second-moment separation cohort (imp-97311, imp-97329, imp-97330, imp-97349, imp-97356) as a
 *   single Q(b)-DIAGONAL-SKELETON / UNIFORM-CROSSOVER program, so future scouts do not re-attempt
 *   the fixed-a scale (already shown to be the wrong one) and do not re-measure the pinned
 *   boundary-layer constants this cohort already settled.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All five study the interior second moment
 *       Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2,
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),   C = (log 2pi - gamma)/2,
 *   whose sub-leading remainder g(b) = Q(b) - s0 b had two numerically-degenerate candidate forms
 *   (b^(1/2) vs log^2 b, imp-97292):
 *     imp-97311 -- derives the FIXED-a Bettin-Conrey asymptotic I(a,b) = kappa_a log b + d_a + o(1)
 *       and finds kappa_a = a/2 EXACTLY for every fixed a; the per-a moment weight kappa_a^2/a^2 =
 *       1/4 is INDEPENDENT of a, so the moment sum Sum_a kappa_a^2/a^2 DIVERGES -- the fixed-a scale
 *       cannot pin the intercept or separate the two candidates. Names the missing input as the
 *       UNIFORM (a ~ b) remainder profile.
 *     imp-97329 -- formalizes and MEASURES that uniform (a ~ b) profile: I(xb,b)/b converges to a
 *       b-independent limit f(x), a genuinely b-LINEAR bulk scale distinct from the fixed-a log b
 *       scale; shows the boundary layer (x -> 0) recovers the fixed-a slope kappa_a = a/2 and
 *       intercept d_1 = C + 1/2, so the two regimes are one smooth profile meeting at a crossover
 *       a ~ A(b). The joint fit stays numerically degenerate (b^(1/2) vs log^2 b, RMSE ratio 0.9996).
 *     imp-97330 -- PINS the fixed-a intercept d_a to closed form d_a = a(C+1/2) - (a/2) log a,
 *       correcting the imp-97311 "non-monotone arithmetic residue function" description: the
 *       residue dependence on b mod a averages to zero, so d_a carries no net arithmetic signal.
 *     imp-97349 -- derives the uniform diagonal remainder profile directly: splits I = Ihat + r
 *       (elementary skeleton + arithmetic residual), shows the arithmetic pieces Qcross/Qrr are
 *       LEADING-order (linear in b, not sub-leading), and shows the elementary skeleton Qhat is an
 *       exact log-polynomial with NO b^(1/2) term. DECIDES the separation: the sub-leading remainder
 *       is log^2 b, not b^(1/2) (imp-97292's b^(1/2) candidate is a short-ladder fitting artifact).
 *     imp-97356 -- substitutes the imp-97330 pinned d_a into the imp-97329 crossover, pinning the
 *       intercept constituent C + 1/2 EXACTLY and UNIFORMLY across the whole fixed-a boundary layer
 *       (not just the a=1 edge); but shows this pinned layer is only an O(log^2 b) = o(b) FRACTION
 *       of Q(b) (14.0%/11.3%/9.4% at b=400/800/1600, decreasing), so it constrains neither the
 *       b-linear slope s0 nor the sub-leading g(b) -- those live entirely in the imp-97349 bulk
 *       profile.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, the five tickets look like an asymptotic
 *   derivation that diverges (97311), an unrelated crossover measurement (97329), an intercept
 *   closed-form correction (97330), a separation decision (97349), and a substitution exercise
 *   (97356). Read together they are ONE story: the fixed-a scale is diagnosed as WRONG (97311),
 *   the correct uniform (a~b) scale is identified and measured (97329), the fixed-a boundary layer
 *   is fully pinned in closed form (97330, 97356), and the qualitative b^(1/2)-vs-log^2 b question
 *   is DECIDED by working directly in the uniform scale (97349) -- while the pinned boundary layer
 *   is shown to be too small a fraction of Q(b) to have ever settled that question on its own. This
 *   index bakes that reading so a future scout does not re-attempt separating the two candidates via
 *   the fixed-a moment (provably divergent, wrong scale) and does not re-measure the boundary-layer
 *   slope (1/2) or intercept (C+1/2), both now closed-form.
 *
 *   MEASURED / DERIVED / DECIDED (what each leaf actually establishes).
 *   - kappa_a = a/2 EXACTLY for every fixed a; Sum_a kappa_a^2/a^2 DIVERGES (imp-97311, derivation).
 *   - uniform crossover profile I(xb,b)/b -> f(x), a b-linear bulk scale; boundary layer (x->0)
 *     recovers kappa_a = a/2 and intercept C+1/2 (imp-97329, derivation + measurement).
 *   - d_a = a(C+1/2) - (a/2) log a EXACTLY, no net residue/arithmetic signal (imp-97330, measurement
 *     + closed-form pin).
 *   - the elementary skeleton Qhat is a log-polynomial with an EXACT log^2 b coefficient -1/2 in A2
 *     (hence -1/8 pre-coprimality in Qhat) and NO b^(1/2) term; the arithmetic residual pieces
 *     Qcross, Qrr are leading-order (linear in b); DECISION: separation is log^2 b, NOT b^(1/2)
 *     (imp-97349, derivation + decision).
 *   - the pinned fixed-a leg fixes the crossover slope 1/2 and intercept C+1/2 = 1.1303307 exactly
 *     and uniformly across a = 1..40, but is only an O(log^2 b) = o(b) fraction of Q(b) and touches
 *     neither s0 nor g(b) (imp-97356, measurement).
 *
 *   WHAT STAYS OPEN. The QUALITATIVE separation (log^2 b, not b^(1/2)) is decided, but the EXACT
 *   log^2 b coefficient is NOT pinned: the coprimality restriction turns the elementary -1/8
 *   skeleton coefficient into a divisor-weighted arithmetic function of b, and there is an
 *   additional log^2 b contribution from Qcross; certifying it needs a rigorous second-moment bound
 *   on the Vasyunin/Bettin-Conrey cotangent residual r(a,b) (the Estermann/Kloosterman small-inverse
 *   equidistribution input flagged by imp-97116, named sub-gap
 *   imp-97349-log2b-coefficient-needs-cotangent-second-moment).
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No
 *   bound changes: the rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916,
 *   imp-96352) binds first by > 2600x; no operator positivity; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97311-route-m-bettin-conrey-smalla-kappa-moment.js (fixed-a kappa_a=a/2; divergent moment)
 * @see imp-97329-route-m-uniform-crossover-second-moment.js (uniform a~b crossover profile f(x))
 * @see imp-97330-route-m-smalla-intercept-closed-form.js (pinned closed form d_a = a(C+1/2)-(a/2)log a)
 * @see imp-97349-route-m-diagonal-remainder-profile-separation.js (log^2 b vs b^(1/2) DECISION)
 * @see imp-97356-route-m-pinned-fixeda-crossover-intercept.js (pinned boundary layer, o(b) fraction)
 * @see imp-97292-route-m-cq-subleading-extended-ladder.js (the numerically-degenerate short ladder this cohort resolves qualitatively)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (Q(b), the O(b log b) cancellation, V kernel)
 *
 * Ticket: imp-97391 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const ROUTE_M_DIAGONAL_SKELETON_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97311',
    role: 'fixed-a Bettin-Conrey asymptotic and its (divergent) moment',
    result:
      'DERIVES kappa_a = a/2 EXACTLY for every fixed a; the per-a moment weight kappa_a^2/a^2 = 1/4 ' +
      'is independent of a, so Sum_a kappa_a^2/a^2 DIVERGES -- the fixed-a scale is the WRONG scale ' +
      'to separate the two candidate sub-leading forms of Q(b).',
  }),
  Object.freeze({
    id: 'imp-97329',
    role: 'uniform (a ~ b) crossover second moment',
    result:
      'MEASURES the bulk profile I(xb,b)/b -> f(x), a genuinely b-linear scale; the boundary layer ' +
      '(x -> 0) recovers the fixed-a slope a/2 and intercept C+1/2, unifying the two regimes; joint ' +
      'fit stays numerically degenerate (b^(1/2) vs log^2 b, RMSE ratio 0.9996).',
  }),
  Object.freeze({
    id: 'imp-97330',
    role: 'small-a intercept closed form',
    result:
      'PINS d_a = a(C + 1/2) - (a/2) log a exactly; corrects the imp-97311 "residue-driven" ' +
      'description -- the b mod a residue dependence averages to zero, no net arithmetic signal.',
  }),
  Object.freeze({
    id: 'imp-97349',
    role: 'diagonal remainder profile and the log^2 b vs b^(1/2) decision',
    result:
      'DECIDES the separation is log^2 b, NOT b^(1/2): the elementary skeleton Qhat is an exact ' +
      'log-polynomial (log^2 b coefficient -1/2 in A2, no fractional power); the arithmetic residual ' +
      'pieces Qcross, Qrr are leading-order (linear in b), not sub-leading.',
  }),
  Object.freeze({
    id: 'imp-97356',
    role: 'pinned fixed-a leg substituted into the crossover',
    result:
      'PINS the crossover intercept constituent to C + 1/2 = 1.1303307 exactly and uniformly across ' +
      'the whole boundary layer (a = 1..40), but this pinned mass is only an O(log^2 b) = o(b) ' +
      'fraction of Q(b) and constrains neither s0 nor g(b).',
  }),
]);

export const IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX = Object.freeze({
  id: 'imp-97391',
  proofSection: 'S-frontier',
  cohort: ROUTE_M_DIAGONAL_SKELETON_COHORT,
  targetQuantity:
    'the interior second moment Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 sub-leading remainder ' +
    'g(b) = Q(b) - s0 b, and its separation between two collinear candidate forms (b^(1/2) vs log^2 b).',
  separationDecision: 'log^2 b',
  separationDecidedBy: 'imp-97349',
  pinnedIntercept: 1.1303307,
  pinnedInterceptSource: 'imp-97330 / imp-97356 (C + 1/2, closed form)',
  pinnedLayerFractionOfQ: [0.140, 0.113, 0.094],
  pinnedLayerFractionAt: [400, 800, 1600],
  namedResiduals: [
    'IMP97311_FIXEDA_MOMENT_DIVERGES_WRONG_SCALE',
    'IMP97329_JOINT_FIT_NUMERICALLY_DEGENERATE',
    'IMP97349_LOG2B_COEFFICIENT_NEEDS_COTANGENT_SECOND_MOMENT',
    'IMP97356_PINNED_LAYER_IS_O_LOG2B_FRACTION_OF_Q',
  ],
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The cohort diagnoses the fixed-a scale as the WRONG ' +
    'one (imp-97311, provably divergent moment), identifies and measures the correct uniform (a~b) ' +
    'scale (imp-97329), fully pins the fixed-a boundary layer in closed form (imp-97330, imp-97356), ' +
    'and DECIDES the qualitative b^(1/2)-vs-log^2 b separation by working directly in the uniform ' +
    'scale (imp-97349): the sub-leading remainder of Q(b) is log^2 b, not b^(1/2). The exact log^2 b ' +
    'coefficient is NOT pinned -- it needs a rigorous second-moment bound on the Vasyunin/Bettin-' +
    'Conrey cotangent residual (the Estermann/Kloosterman input flagged by imp-97116). Future work on ' +
    'this thread should treat the fixed-a scale as a settled dead end (do not re-attempt separating ' +
    'the two candidates via Sum_a kappa_a^2/a^2) and should not re-measure the pinned boundary-layer ' +
    'slope (1/2) or intercept (C+1/2). Establishes nothing new; moves no bound; the rigorous anchor ' +
    'stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by > 2600x; no ' +
    'operator positivity; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97311 (fixed-a moment diverges); imp-97329 (uniform crossover profile); imp-97330 (pinned ' +
    'intercept closed form); imp-97349 (log^2 b vs b^(1/2) decision); imp-97356 (pinned layer o(b) ' +
    'fraction); imp-97292/imp-96750 (shared setup and the degenerate short ladder this resolves).',
});

export default IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97391-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX.cohort.map(
        (c) => c.id,
      );
      return ['imp-97311', 'imp-97329', 'imp-97330', 'imp-97349', 'imp-97356'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp97391-separation-decision-and-pinned-constants-consistent',
    why: 'The index exists to record the log^2 b decision and the pinned boundary-layer constants ' +
      'so future work does not re-derive or re-measure them.',
    holds: () => {
      const idx = IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX;
      const C = (Math.log(2 * Math.PI) - 0.5772156649015329) / 2;
      return (
        idx.separationDecision === 'log^2 b' &&
        Math.abs(idx.pinnedIntercept - (C + 0.5)) < 1e-6 &&
        idx.pinnedLayerFractionOfQ.length === 3 &&
        idx.pinnedLayerFractionOfQ[0] > idx.pinnedLayerFractionOfQ[1] &&
        idx.pinnedLayerFractionOfQ[1] > idx.pinnedLayerFractionOfQ[2]
      );
    },
  },
  {
    id: 'imp97391-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97391_ROUTE_M_DIAGONAL_SKELETON_UNIFORM_CROSSOVER_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97391-route-m-diagonal-skeleton-uniform-crossover-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
