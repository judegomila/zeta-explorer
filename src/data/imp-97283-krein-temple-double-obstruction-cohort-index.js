/**
 * @module imp-97283-krein-temple-double-obstruction-cohort-index
 * @fileoverview imp-97283 -- META cross-reference index note grouping the Krein TEMPLE
 *   double-obstruction cohort (imp-97136 feasibility assessment / imp-97162 eta2 measurement /
 *   imp-97228 domain-respecting-trial remedy test) as the INTRINSICALLY-DEAD Temple-route family:
 *   route (A) of imp-97121 Finding 2 (a Temple / Kato-Temple / Lehmann-Maehly complementary
 *   lower-bound eigenvalue certificate for lambda_min(T_a[sigma_2]) at 2a=ln3) is not merely
 *   "missing an ingredient" -- it is doubly obstructed structurally AND quantitatively, and the one
 *   remedy tried (a smooth mode-space cutoff) cannot fix the quantitative half. Index/meta only;
 *   establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological).
 *     imp-97136 -- FEASIBILITY: Temple's inequality lambda_min >= mu - eta2/(beta - mu) needs (1) a
 *       finite residual defect eta2 for a domain trial vector and (2) an a-priori LOWER bound beta on
 *       lambda_2. Ingredient (2) is STRUCTURALLY unobtainable: Rayleigh-Ritz gives only an UPPER bound
 *       on lambda_2, the wrong direction, so route (A) RELOCATES rather than removes the missing
 *       lower-bound object (Lehmann-Maehly shares the same circularity). Ingredient (1) is flagged as
 *       uncommitted and only heuristically available. Verdict: NOT feasible with committed objects.
 *     imp-97162 -- MEASUREMENT: commits ingredient (1). eta2 ~ 2.42e9 for the committed polynomial
 *       Ritz eigenvector at 2a=ln3, T=800 -- ~10 orders of magnitude above mu ~ 0.534, and GROWING
 *       monotonically with the evaluation space (no finite limit in reach), because T_a[sigma_2] is
 *       unbounded (t^4 prefactor) and a polynomial trial is at best marginally in dom(A). The beta
 *       needed for positivity is ~4.5e9, astronomically beyond any admissible O(1) lambda_2. CONFIRMS
 *       and SHARPENS imp-97136: route (A) is doubly obstructed (both ingredients fail, not just one).
 *     imp-97228 -- REMEDY TEST: tries the natural fix imp-97162 invites -- taper the Ritz coefficients
 *       (smooth mode-space cutoff) to give the trial vector better high-frequency decay. Result: eta2
 *       drops by AT MOST ~1 order of magnitude (2.42e9 -> 1.67e8) and only by driving mu to ~0.895,
 *       far above the 0.5 target (approximation destroyed); every taper that keeps mu near the floor
 *       leaves eta2 ~1e9; and EVERY taper still diverges with the evaluation space. The obstruction is
 *       a t-SPACE (t^4 weight) phenomenon, not a mode-space one -- no smooth mode-cutoff can cure it.
 *       SHARPENS imp-97162 further: the huge Temple defect is intrinsic to the unbounded operator, not
 *       an artifact of the particular trial vector.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97136 reads as an abstract feasibility
 *   note, imp-97162 as one numerical measurement, and imp-97228 as one more parameter sweep among
 *   many. Read together, they form a single escalating verdict on route (A): imp-97136 proves the
 *   STRUCTURAL half of the obstruction (beta is the wrong-direction Ritz object) is fatal on its own;
 *   imp-97162 proves the QUANTITATIVE half (eta2) is independently fatal, by ~10 orders of magnitude;
 *   imp-97228 closes off the one natural remedy (trial-vector tapering) for the quantitative half,
 *   localizing the divergence to the t^4 weight rather than the polynomial basis's mode truncation.
 *   No single leaf closes route (A) alone -- together they do, within the accessible basis. This
 *   index bakes that reading so a future scout does not re-attempt Temple / Kato-Temple /
 *   Lehmann-Maehly for this operator with the committed polynomial/Gegenbauer trial family, and does
 *   not mistake the imp-97228 taper result for a partial fix (it fixes at most one order of magnitude
 *   of a ten-order-of-magnitude gap).
 *
 *   MEASURED / DERIVED (what each leaf actually establishes).
 *   - route (A) is not feasible with committed objects: ingredient (2), a-priori beta <= lambda_2, is
 *     structurally unobtainable from Rayleigh-Ritz (wrong-direction bound); ingredient (1), a finite
 *     eta2, is uncommitted (imp-97136, feasibility assessment).
 *   - the tail-inclusive Temple defect eta2 ~ 2.42e9 for the committed Ritz eigenvector at 2a=ln3,
 *     T=800 (mu ~ 0.5338), growing monotonically with the evaluation space; required beta for
 *     positivity ~4.54e9, for the 0.5 target ~7.16e10, both astronomically beyond any admissible
 *     O(1) lambda_2 (imp-97162, measurement).
 *   - a Hann-tapered (smooth mode-cutoff) trial reduces eta2 by at most ~14.5x (to ~1.67e8) and only
 *     by pushing mu to ~0.895 (far above the 0.5 target); every taper still diverges with the
 *     evaluation space; the obstruction is a t-space (t^4) phenomenon, not curable by any mode-space
 *     cutoff within the polynomial/Gegenbauer family (imp-97228, measurement).
 *
 *   NOT ESTABLISHED (what stays open / out of scope for this cohort).
 *   - whether a genuinely non-polynomial trial vector FROM OUTSIDE this basis (e.g. a t-space
 *     smooth-cutoff or Gaussian function projected exactly onto dom(T_a[sigma_2])) could supply a
 *     finite small eta2 -- imp-97228 explicitly leaves this unbuilt and out of reach of the tested
 *     remedy.
 *   - any alternative complementary lower-bound route (not Temple/Kato-Temple/Lehmann-Maehly) for
 *     lambda_min(T_a[sigma_2]); this cohort speaks only to route (A) of imp-97121 Finding 2.
 *
 *   STATUS: a grouping/index note over three already-completed tickets, not a new derivation. No
 *   bound changes: route (A) (Temple/Kato-Temple/Lehmann-Maehly) is confirmed INTRINSICALLY DEAD for
 *   lambda_min(T_a[sigma_2]) within the committed polynomial/Gegenbauer trial family; the
 *   interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed; RH
 *   open; NO QED.
 *
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (Finding 2 route A; the missing lower-bound object)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (structural obstruction: beta is wrong-direction)
 * @see imp-97162-krein-temple-defect-eta2-measurement.js (quantitative obstruction: eta2 ~2.42e9)
 * @see imp-97228-krein-domain-respecting-trial-eta2.js (remedy test: tapering fails, t-space not mode-space)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 * @see project_toeplitz_krein_certificate (Route I Toeplitz/Krein certificate program, memory)
 *
 * Ticket: imp-97283 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97136',
    role: 'feasibility assessment: proves the structural half of the obstruction',
    result:
      'Temple/Kato-Temple/Lehmann-Maehly needs an a-priori lower bound beta <= lambda_2, but ' +
      'Rayleigh-Ritz supplies only an UPPER bound on lambda_2 (Courant-Fischer, wrong direction); ' +
      'route (A) relocates rather than removes the missing lower-bound object. NOT feasible with ' +
      'committed objects.',
  }),
  Object.freeze({
    id: 'imp-97162',
    role: 'measurement: proves the quantitative half of the obstruction',
    result:
      'the tail-inclusive Temple defect eta2 ~ 2.42e9 for the committed Ritz eigenvector at 2a=ln3, ' +
      'T=800 (mu ~ 0.5338), ~10 orders of magnitude above mu, growing with the evaluation space; the ' +
      'beta required for positivity (~4.54e9) is astronomically beyond any admissible lambda_2.',
  }),
  Object.freeze({
    id: 'imp-97228',
    role: 'remedy test: closes off the one natural fix for the quantitative half',
    result:
      'a Hann-tapered (smooth mode-cutoff) trial reduces eta2 by at most ~14.5x, only by driving mu ' +
      'to ~0.895 (far above the 0.5 target), and every taper still diverges with the evaluation ' +
      'space; the divergence is a t-space (t^4) phenomenon, not curable by mode-space tapering.',
  }),
]);

export const IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX = Object.freeze({
  id: 'imp-97283',
  proofSection: 'krein-route-i',
  binding_2a: LN3,
  cohort: KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT,
  measuredSignal:
    'route (A) (Temple / Kato-Temple / Lehmann-Maehly complementary lower-bound eigenvalue ' +
    'certificate for lambda_min(T_a[sigma_2]) at 2a=ln3) is obstructed on BOTH the structural axis ' +
    '(a-priori beta <= lambda_2 is the wrong-direction Ritz object) and the quantitative axis ' +
    '(the residual defect eta2 is ~10 orders of magnitude too large, and the one tested remedy -- ' +
    'mode-space tapering -- fixes at most one of those ten orders).',
  structuralObstruction: true, // imp-97136: beta <= lambda_2 unobtainable from Rayleigh-Ritz
  quantitativeObstruction: true, // imp-97162: eta2 ~2.42e9, ~10 orders above mu
  modeSpaceRemedyFails: true, // imp-97228: taper reduces eta2 by at most ~14.5x, obstruction is t-space
  routeAIntrinsicallyDeadWithinCommittedBasis: true,
  outsideBasisRemedyBuilt: false, // a genuine t-space smooth-cutoff/Gaussian trial is unbuilt
  anyBoundMoved: false,
  question:
    'The Krein Temple leaves (imp-97136/97162/97228) read as three separate items -- a feasibility ' +
    'note, one numerical measurement, and one parameter sweep. Grouped, do they jointly establish ' +
    'that route (A) is dead for this operator within the committed trial family, or does any leaf ' +
    'leave a live thread?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97136 proves route (A) needs an a-priori beta <= ' +
    'lambda_2 that Rayleigh-Ritz cannot supply (wrong-direction Courant-Fischer bound) -- a structural ' +
    'obstruction on its own; imp-97162 independently measures the residual defect eta2 ~ 2.42e9, ' +
    '~10 orders of magnitude above mu, and growing with the evaluation space -- a quantitative ' +
    'obstruction on its own; imp-97228 tests the one natural remedy (mode-space tapering) and finds ' +
    'it reduces eta2 by at most ~1 of the needed ~10 orders of magnitude, only by destroying the ' +
    'approximation (mu -> 0.895), because the divergence is a t-space (t^4) phenomenon that no ' +
    'mode-space cutoff touches. Together these three form the INTRINSICALLY-DEAD Temple-route ' +
    'family: route (A) is not a single missing ingredient away from working, it fails on two ' +
    'independent axes and the one tried remedy for the quantitative axis cannot close the gap within ' +
    'the polynomial/Gegenbauer trial family. Establishes nothing new; moves no bound; RH open; NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-97136 (structural obstruction: beta <= lambda_2 unobtainable); imp-97162 (quantitative ' +
    'obstruction: eta2 ~2.42e9, ~10 orders above mu); imp-97228 (remedy test: tapering fixes at most ' +
    '~1 order, t-space not mode-space).',
});

export default IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97283-cohort-has-all-three-members',
    why: 'The whole point of the index is grouping exactly these three tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97136', 'imp-97162', 'imp-97228'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97283-binding-2a-matches-ln3',
    why: 'The index quotes the binding 2a=ln3 shared by all three leaves; a mismatch would silently ' +
      'misstate which point on the Krein program this cohort concerns.',
    holds: () =>
      Math.abs(IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.binding_2a - Math.log(3)) < 1e-12,
  },
  {
    id: 'imp97283-both-obstruction-axes-present',
    why: 'The whole point of this index is that route (A) fails on TWO independent axes; a flipped ' +
      'flag would silently misrepresent the double-obstruction reading.',
    holds: () =>
      IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.structuralObstruction === true &&
      IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.quantitativeObstruction === true &&
      IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.modeSpaceRemedyFails === true,
  },
  {
    id: 'imp97283-remedy-not-mistaken-for-a-fix',
    why: 'The index exists partly to prevent a future scout from re-reading imp-97228 as a partial ' +
      'success; it must record that no outside-basis remedy has been built.',
    holds: () => {
      const idx = IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX;
      return (
        idx.routeAIntrinsicallyDeadWithinCommittedBasis === true &&
        idx.outsideBasisRemedyBuilt === false &&
        idx.anyBoundMoved === false
      );
    },
  },
  {
    id: 'imp97283-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.verdict) &&
      /RH open/.test(IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97283_KREIN_TEMPLE_DOUBLE_OBSTRUCTION_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97283-krein-temple-double-obstruction-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
