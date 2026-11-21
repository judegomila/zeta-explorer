/**
 * @module imp-97155-route-m-first-moment-evaluation-cohort-index
 * @fileoverview imp-97155 -- META cross-reference index note grouping the Route M analytic
 *   first-moment cohort (imp-97096 arithmetic-part evaluation, imp-97097 cotangent-part reciprocity
 *   attempt, imp-97119 boundary-term asymptotic, imp-97122 convergence-rate measurement) as a single
 *   FIRST-MOMENT-EVALUATION family, so future work reads the exact split kappa = kappa_arith + kappa_cot
 *   of the imp-97071 first moment F(b) >= kappa phi(b) b as one story instead of four isolated leaves.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All four analyze the same object: the Route M first moment F(b) of
 *   imp-97071 (Q(b) >= F(b)^2/S(b) via Cauchy-Schwarz), split as F = F_arith - (pi/2) Phi_cot with
 *   F_arith/(phi(b) b) -> kappa_arith and the cotangent part -> kappa_cot, kappa = kappa_arith + kappa_cot.
 *     imp-97096 -- derives the EXACT leading coefficient of the arithmetic part: kappa_arith =
 *       (3/2) C - 3/8 = (3/4)(log 2pi - gamma) - 3/8 = 0.5704960511308594..., via two exact elementary
 *       sub-sums plus a Moebius/Stirling part whose log b divergence cancels exactly. Leaves an explicit
 *       remainder bound on L0(b), L1(b) as the open residual (the sole gap of this leaf).
 *     imp-97097 -- attempts the Vasyunin/Dedekind reciprocity collapse of the cotangent part. Proves the
 *       fixed-modulus half collapses EXACTLY to zero (a <-> b-a antisymmetry), so the entire leading
 *       cotangent moment ~+0.12 phi(b) b sits in the varying-modulus half, which is a genuine
 *       Bettin-Conrey period-function mean value, NOT an elementary closed form. Reports this as the
 *       precise obstruction, not a bound.
 *     imp-97119 -- rigorously derives the exact leading asymptotic of the boundary term V(1,b) that
 *       imp-97097 only measured as o(phi(b) b): V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi + O(1/b),
 *       closing that boundary-term corner of the imp-97097 reduction with a proved (not measured) rate.
 *     imp-97122 -- measures the convergence RATE of F_arith(b)/(phi(b) b) to the imp-97096 exact
 *       kappa_arith: O(log b / b) on general moduli (coefficient ~1/4), orders faster on smooth/primorial
 *       moduli (divisor-sum cancellation), certifying imp-97096 numerically without supplying its
 *       still-open explicit remainder bound.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97096 reads as a closed-form-coefficient
 *   derivation, imp-97097 as a reciprocity attempt that "only partially" succeeds, imp-97119 as an
 *   unrelated classical cotangent-sum asymptotic, and imp-97122 as a numerical accuracy check. Read
 *   together, the cohort is the complete analytic evaluation of the Route M first moment attempted so
 *   far: kappa_arith is EXACT and its convergence rate is CERTIFIED (imp-97096 + imp-97122); kappa_cot is
 *   HALVED by an exact identity with the boundary corner CLOSED rigorously (imp-97097 + imp-97119), but
 *   its operative varying-modulus half remains a genuinely open Bettin-Conrey mean-value estimate. This
 *   index bakes that reading so a future scout does not re-attempt the reciprocity route on the
 *   fixed-modulus half (already proved zero) and does not conflate the arithmetic leaf's explicit-
 *   remainder sub-gap with the cotangent leaf's mean-value sub-gap -- they are different open problems.
 *
 *   MEASURED / DERIVED (what each leaf actually establishes).
 *   - kappa_arith = (3/2) C - 3/8 = 0.5704960511308594... is an EXACT closed-form leading coefficient,
 *     with two exact elementary parts and one Moebius/Stirling part whose log b divergence cancels
 *     exactly (imp-97096, rigorous derivation).
 *   - the fixed-modulus half of the cotangent first moment collapses to EXACTLY ZERO (plus the o(phi(b) b)
 *     boundary term -V(1,b)) via the a <-> b-a antisymmetry, for EVERY b >= 2 (imp-97097, rigorous).
 *   - the boundary term V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi + O(1/b) is a rigorously DERIVED
 *     classical asymptotic, confirming o(phi(b) b) via Landau's totient lower bound (imp-97119, rigorous).
 *   - F_arith(b)/(phi(b) b) converges to kappa_arith at rate O(log b / b) on general moduli (coefficient
 *     ~1/4), orders faster on smooth/primorial moduli (imp-97122, numerical measurement).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no explicit, uniform-in-b remainder bound for the arithmetic leaf's L0(b), L1(b) Moebius/Stirling
 *     sums exists yet (imp-97096's sole residual, sized but not closed by imp-97122).
 *   - the operative varying-modulus half of the cotangent first moment (Sum_a V(b,a)) has NO elementary
 *     closed form; it is a Bettin-Conrey period-function mean value, and no absolute lower bound
 *     kappa_cot > -kappa_arith is proved, only measured (~+0.12, stable) (imp-97097).
 *   - consequently kappa = kappa_arith + kappa_cot ~ 0.696 > 0 remains a MEASURED total, not a certified
 *     one: the arithmetic half is exact modulo an unclosed remainder, the cotangent half is exact-minus-
 *     a-mean-value modulo an unclosed positivity estimate.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: kappa ~ 0.696 stays a measurement, not a certificate; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith derivation)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (cotangent reciprocity partial collapse)
 * @see imp-97119-route-m-boundary-cotangent-asymptotic.js (rigorous boundary-term asymptotic)
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (arithmetic-part convergence rate)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97155 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...
const KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594 (imp-97096, exact)

const ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97096',
    role: 'derives the exact leading coefficient of the arithmetic first-moment part',
    result:
      'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594..., via two exact elementary sub-sums plus a ' +
      'Moebius/Stirling part whose log b divergence cancels exactly. Rigorous derivation; leaves an ' +
      'explicit remainder bound on L0(b), L1(b) as the sole open residual.',
  }),
  Object.freeze({
    id: 'imp-97097',
    role: 'attempts the Vasyunin/Dedekind reciprocity collapse of the cotangent first-moment part',
    result:
      'proves the fixed-modulus half collapses EXACTLY to zero (a <-> b-a antisymmetry); the entire ' +
      'leading cotangent moment sits in the varying-modulus half, a Bettin-Conrey period-function mean ' +
      'value with NO elementary closed form -- the precise obstruction, not a bound.',
  }),
  Object.freeze({
    id: 'imp-97119',
    role: 'derives the exact leading asymptotic of the boundary term V(1,b)',
    result:
      'V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi + O(1/b), rigorously closing the boundary-term ' +
      'corner of the imp-97097 reduction (previously only measured as o(phi(b) b)).',
  }),
  Object.freeze({
    id: 'imp-97122',
    role: 'measures the convergence rate of the arithmetic first moment to kappa_arith',
    result:
      'O(log b / b) on general moduli (coefficient ~1/4), orders faster on smooth/primorial moduli; ' +
      'certifies imp-97096 numerically but does NOT supply its still-open explicit remainder bound.',
  }),
]);

export const IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX = Object.freeze({
  id: 'imp-97155',
  proofSection: 'S-residual',
  cohort: ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT,
  measuredSignal:
    'kappa_arith is EXACT and its convergence rate is CERTIFIED (imp-97096 + imp-97122); kappa_cot is ' +
    'HALVED by an exact identity with the boundary corner CLOSED rigorously (imp-97097 + imp-97119), but ' +
    'its operative varying-modulus half remains a genuinely open Bettin-Conrey mean-value estimate.',
  namedResiduals: [
    'IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN',
    'IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN',
  ],
  kappaArith: KAPPA_ARITH,
  kappaCotMeasured: 0.12,
  kappaTotalMeasured: 0.696,
  anyBoundMoved: false,
  question:
    'The Route M analytic first-moment cohort (imp-97096/97097/97119/97122) reads as four separate ' +
    'tickets. Grouped, does the exact-arithmetic-plus-halved-cotangent evaluation amount to a certified ' +
    'lower bound kappa > 0, or does the operative cotangent mean-value estimate remain the open residual?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97096 derives the exact arithmetic-part coefficient ' +
    'kappa_arith and leaves an explicit remainder bound open; imp-97097 proves the fixed-modulus ' +
    'cotangent half is exactly zero and isolates the varying-modulus half as a Bettin-Conrey mean-value ' +
    'obstruction, not a closed form; imp-97119 closes the boundary-term corner of that reduction ' +
    'rigorously; imp-97122 certifies the imp-97096 rate numerically without closing its remainder gap. ' +
    'So the cohort as a whole is a FIRST-MOMENT-EVALUATION family: the arithmetic half is exact modulo an ' +
    'explicit-remainder sub-gap, the cotangent half is halved-by-an-exact-identity modulo an unclosed ' +
    'mean-value positivity estimate, and the measured total kappa ~ 0.696 stays a measurement, not a ' +
    'certificate. Establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97096 (exact arithmetic-part coefficient); imp-97097 (cotangent reciprocity partial collapse); ' +
    'imp-97119 (boundary-term rigorous asymptotic); imp-97122 (arithmetic-part convergence rate).',
});

export default IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97155-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97096', 'imp-97097', 'imp-97119', 'imp-97122'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97155-kappa-arith-matches-imp97096',
    why: 'The index quotes the imp-97096 exact coefficient; it must match that derivation bit-for-bit, ' +
      'not a rounded restatement.',
    holds: () =>
      Math.abs(IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX.kappaArith - 0.5704960511308594) < 1e-12,
  },
  {
    id: 'imp97155-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them without ' +
      're-reading all four tickets.',
    holds: () => {
      const idx = IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP97096_ARITH_EXPLICIT_REMAINDER_BOUND_OPEN') &&
        idx.namedResiduals.includes('IMP97097_COTANGENT_MEAN_VALUE_LOWER_BOUND_OPEN') &&
        idx.anyBoundMoved === false
      );
    },
  },
  {
    id: 'imp97155-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX.verdict) &&
      /RH open/.test(IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97155_ROUTE_M_FIRST_MOMENT_EVALUATION_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97155-route-m-first-moment-evaluation-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
