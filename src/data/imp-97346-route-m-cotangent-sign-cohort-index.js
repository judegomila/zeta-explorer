/**
 * @module imp-97346-route-m-cotangent-sign-cohort-index
 * @fileoverview imp-97346 -- META cross-reference index note grouping the Route M cotangent
 *   sign-of-S(b) cohort (imp-97181, imp-97226, imp-97270, imp-97287, imp-97314) as a single
 *   DERIVE-MEASURE-RECONCILE-SHARPEN-OBSTRUCT arc, so future work does not re-read the five
 *   tickets in isolation and re-attempt a strategy already shown to fail.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All five study the sign of the same operative varying-modulus
 *   Vasyunin cotangent sum S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) that drives the Route M
 *   cotangent first moment F_cot(b) = -(pi/2) Phi(b), Phi(b) = -V(1,b) + S(b)
 *   (F_cot(b) > 0 <=> S(b) < 0 to leading order, since -V(1,b) = o(phi(b) b) is PROVED, imp-97119):
 *     imp-97181 -- proves the numerator kernel c_0(h/a) is EXACTLY odd/mean-zero over coprime
 *       numerators (Sum_h c_0(h/a) = 0 for every a), reframing the sign of S(b) as a SIGNED
 *       INVERSE-MAP BIAS against that mean-zero kernel rather than a pointwise sign fact. Derivation
 *       + partial; sign stays measured not proved.
 *     imp-97226 -- extends the signed/absolute cancellation ratio |S(b)|/A(b) from b=2003 (imp-97204)
 *       to b=24001; ratio stays a STABLE CONSTANT ~0.540 with no drift, and S(b)/(phi(b) b) converges
 *       flat and negative to ~-0.0795. Measurement only.
 *     imp-97270 -- cross-validates the ledger coefficient kappa_cot ~ +0.12 by reconstructing it
 *       from the two settled legs: the PROVED boundary leg (imp-97119, contributes 0) plus the
 *       imp-97226 varying-modulus limit -0.0795, giving kappa_cot(reconstructed) = +0.124899, which
 *       agrees with the independent total-minus-arith ledger value +0.125504 to ~0.48%.
 *     imp-97287 -- derives an EXACT residue-resonance decomposition of S(b) by regrouping over
 *       r = b mod a (the direct-line companion to the imp-97181 inverse-line reframing): S(b) =
 *       Sum_{r>=1} Sum_{a: r<a<b, a|(b-r), (a,b)=1} c_0(r/a). Proves the r=1 family is strictly
 *       negative but finds the negative mass spread across ALL residue-shifts with no sign-definite
 *       termwise split -- no elementary leading term settles the sign.
 *     imp-97314 -- tests whether a fixed small-shift band {r <= R} can be proved to dominate the
 *       positive-leaning large-residue mass. Proves any FIXED finite band of shift families grows
 *       only Theta(b log b) = o(b^2) = o(|S(b)|) (imp-97226 measured S(b) = Theta(b^2)), so the
 *       small-r dominance strategy PROVABLY CANNOT close the sign -- the negative-driving mass keeps
 *       moving to a growing range of shifts as b grows.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97181/97287 read as two separate
 *   reframings (inverse-line, then direct-line) and imp-97226/97270 as an unrelated numerical
 *   cross-check. Read together, the cohort is ONE continuous attack on ONE sign question: reframe
 *   (97181), measure the target value and cross-validate the ledger coefficient it controls
 *   (97226, 97270), reframe again with an exact decomposition that isolates the provably-negative
 *   part (97287), then test and REFUTE the one natural finite-family closing strategy (97314). This
 *   index bakes that reading verbatim so a future scout does not re-attempt r<=R small-shift
 *   dominance (already shown to fail by a Theta(b log b) vs Theta(b^2) growth gap) and does not
 *   re-measure the cancellation ratio or kappa_cot reconstruction the middle two tickets already
 *   settled.
 *
 *   MEASURED / PROVED (what each leaf actually establishes).
 *   - c_0(h/a) numerator kernel is EXACTLY odd and mean-zero over coprime h (imp-97181, rigorous).
 *   - |S(b)|/A(b) cancellation ratio ~0.540 STABLE to b=24001; S(b)/(phi(b) b) -> ~-0.0795 (imp-97226,
 *     measured).
 *   - kappa_cot reconstructed from settled legs = +0.124899, agrees with ledger implied value
 *     +0.125504 to ~0.48% (imp-97270, arithmetic cross-check, no new measurement).
 *   - S(b) residue-resonance decomposition is EXACT; r=1 family strictly negative (imp-97287,
 *     rigorous); low-shift share of the negative mass measured to DECREASE (~51%->17%, b=211..1009).
 *   - any fixed finite shift band grows only Theta(b log b), strictly smaller order than S(b) itself
 *     = Theta(b^2) (imp-97314, rigorous growth bound) -- small-r dominance PROVABLY FAILS.
 *
 *   WHAT STAYS OPEN. The sign of S(b) (equivalently, positivity of F_cot(b) and kappa_cot) remains
 *   MEASURED, not proved. The imp-97287/imp-97314 obstruction rules out the finite-band dominance
 *   strategy specifically; it does not rule out every possible closing argument (e.g. a genuine
 *   growing-band or non-elementary Bettin-Conrey mean-value approach, cf. the companion route
 *   [[project_route_m_lower_companion_first_moment]] first-moment pursuit).
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No
 *   bound changes: F_cot(b) > 0 (equivalently S(b) < 0, kappa_cot ~ +0.12) stays MEASURED not
 *   PROVED; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97181-route-m-cotangent-firstmoment-sign-inverse-bias.js (numerator odd/mean-zero reframing)
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (cancellation ratio + S(b)/(phi b b) ladder)
 * @see imp-97270-route-m-kappa-cot-three-leaf-reconciliation.js (kappa_cot reconstruction cross-check)
 * @see imp-97287-route-m-cotangent-signed-half-residue-resonance-decomposition.js (exact residue decomposition)
 * @see imp-97314-route-m-cotangent-smallr-family-dominance-obstruction.js (small-shift dominance obstruction)
 *
 * Ticket: imp-97346 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const ROUTE_M_COTANGENT_SIGN_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97181',
    role: 'numerator kernel odd/mean-zero reframing (inverse-line)',
    result:
      'PROVES the numerator kernel c_0(h/a) is exactly odd and mean-zero over coprime h for every ' +
      'a; reframes the sign of S(b) as a signed inverse-map bias, not a pointwise sign fact.',
  }),
  Object.freeze({
    id: 'imp-97226',
    role: 'cancellation ratio + signed-half ladder extension (b to 24001)',
    result:
      'MEASURES |S(b)|/A(b) stable ~0.540 (no drift, b=101..24001); S(b)/(phi(b) b) converges flat ' +
      'and negative to ~-0.0795.',
  }),
  Object.freeze({
    id: 'imp-97270',
    role: 'kappa_cot three-leaf reconciliation',
    result:
      'Reconstructs kappa_cot = +0.124899 from the proved boundary leg (0) plus the imp-97226 ' +
      'varying-modulus limit; agrees with the independent ledger value +0.125504 to ~0.48%.',
  }),
  Object.freeze({
    id: 'imp-97287',
    role: 'exact residue-resonance decomposition of S(b) (direct-line)',
    result:
      'Derives an EXACT decomposition of S(b) by residue r = b mod a; proves the r=1 family strictly ' +
      'negative, but finds the negative mass spread across all shifts, no sign-definite termwise split.',
  }),
  Object.freeze({
    id: 'imp-97314',
    role: 'small-r family-dominance closing attempt',
    result:
      'PROVES any fixed finite shift band grows only Theta(b log b) = o(b^2) = o(S(b)), so the ' +
      'small-r dominance strategy provably cannot close the sign.',
  }),
]);

export const IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX = Object.freeze({
  id: 'imp-97346',
  proofSection: 'S-cotangent-sign',
  cohort: ROUTE_M_COTANGENT_SIGN_COHORT,
  targetQuantity:
    'sign of S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a), the operative varying-modulus Vasyunin ' +
    'cotangent sum controlling F_cot(b) = -(pi/2) Phi(b) and the coefficient kappa_cot ~ +0.12.',
  measuredValue: -0.0795,
  measuredValueSource: 'imp-97226 (S(b)/(phi(b) b) limit, b up to 24001, no drift)',
  reconstructedKappaCot: 0.124899,
  ledgerImpliedKappaCot: 0.125504,
  smallRDominanceObstruction:
    'Any fixed finite shift band {r<=R} grows only Theta(b log b); S(b) itself is Theta(b^2) ' +
    '(imp-97314), so small-r dominance cannot settle the sign.',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The cohort reframes the sign of S(b) twice ' +
    '(inverse-line reframing imp-97181, exact residue-resonance decomposition imp-97287), measures ' +
    'and cross-validates the target constants (imp-97226, imp-97270), and tests + REFUTES the one ' +
    'natural finite-family closing strategy (imp-97314). The sign of S(b) (equivalently positivity ' +
    'of F_cot(b) and kappa_cot ~ +0.12) stays MEASURED, not proved. Future work on this thread ' +
    'should not re-attempt small-r/finite-band dominance arguments (already shown to fail by a ' +
    'Theta(b log b) vs Theta(b^2) growth gap) and should not re-measure the cancellation ratio or ' +
    'kappa_cot reconstruction this cohort already settled. Establishes nothing new; moves no bound; ' +
    'RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97181 (numerator odd/mean-zero reframing); imp-97226 (cancellation ratio ladder); ' +
    'imp-97270 (kappa_cot reconciliation); imp-97287 (residue-resonance decomposition); ' +
    'imp-97314 (small-r dominance obstruction); imp-97097/imp-97119/imp-97204 (shared setup).',
});

export default IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97346-cohort-has-all-five-members',
    why: 'The whole point of the index is grouping exactly these five tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97181', 'imp-97226', 'imp-97270', 'imp-97287', 'imp-97314'].every((id) =>
        ids.includes(id),
      );
    },
  },
  {
    id: 'imp97346-measured-values-consistent',
    why: 'The index exists to cross-validate the measured sign target against the reconstructed ' +
      'and ledger-implied kappa_cot values; both must agree to a small tolerance.',
    holds: () => {
      const idx = IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX;
      return (
        idx.measuredValue < 0 &&
        Math.abs(idx.reconstructedKappaCot - idx.ledgerImpliedKappaCot) < 0.01
      );
    },
  },
  {
    id: 'imp97346-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX.verdict) &&
      /MEASURED, not proved/.test(IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97346_ROUTE_M_COTANGENT_SIGN_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97346-route-m-cotangent-sign-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
