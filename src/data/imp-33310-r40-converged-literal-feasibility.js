/**
 * @module imp-33310-r40-converged-literal-feasibility
 * @fileoverview imp-33310 -- ASSESS whether the imp-33292 ladder-independent converged
 *   R_40 ~ 1.0243966950314 should be proposed as a STORED literal, by cross-checking it against
 *   the imp-3685 coarse [0,7]/1200 baked value and the imp-3849 native [0,2]/4800 converged value
 *   within the storage-precision assertion tolerance band, and deciding FEASIBLE / NOT-YET the
 *   imp-3888 residual can be retired to a converged constant WITHOUT weakening any assertion.
 *
 *   WHAT imp-33292 LEFT (a converged literal, deferred to a separate proposal never minted)
 *   -------------------------------------------------------------------------------------
 *   imp-33256/imp-33276 isolated the ~1.21e-5 imp-3888 R_40 = |D_40|/|D_40^saddle| spread entirely
 *   to the INNER A(tau) O(h^4) Simpson resolution (R_40 outer-invariant to ~1e-14 at every inner
 *   grid). imp-33292 then applied repeated Richardson to the inner grid, collapsing that drift ~9
 *   orders to the ~40 ULP arithmetic floor and yielding a ladder-independent converged
 *   R_40 ~ 1.0243966950314 -- but it explicitly LEFT the imp-3685 and imp-3849 assertions intact and
 *   deferred any converged literal to a separate proposal. That proposal was never minted. This
 *   module is the deferred FEASIBILITY ASSESSMENT: not a patch, just the delta arithmetic and verdict.
 *
 *   THE THREE VALUES (all documented, cross-checked, assertion-gated in their source modules)
 *   ---------------------------------------------------------------------------------------
 *     converged (imp-33292)      R_40 = 1.0243966950314   ladder-independent Richardson extrapolant
 *     imp-3849 native ([0,2]/4800) R_40 = 1.02439670       inner-converged; the imp-3849/imp-3868/
 *                                                          imp-3895 three-rule cross-check target
 *     imp-3685 coarse ([0,7]/1200) R_40 = 1.02438462       baked saddleDnRatioLast (~1.02438)
 *   The storage-precision band that 7-sig-fig toExponential(6) cache fields require is ~1e-6 (the
 *   recurring red-build tolerance: reconstructing a 7-sig-fig field needs ~1e-6, not ~1e-9).
 *
 *   MEASURED (exact subtraction of the documented literals; storage round-trip of the converged value)
 *   -------------------------------------------------------------------------------------------------
 *     (1) THE CONVERGED VALUE MATCHES THE imp-3849 NATIVE VALUE WITHIN THE STORAGE BAND.
 *         |converged - imp-3849 native| ~ 4.97e-9, ~200x INSIDE the ~1e-6 band. The imp-3849
 *         inner-converged [0,2]/4800 value and the imp-33292 Richardson extrapolant are the same
 *         number at storage precision -- unsurprising, since both sit on the converged inner grid.
 *     (2) THE CONVERGED VALUE DOES NOT UNIFY WITH THE imp-3685 COARSE VALUE AT THE STORAGE BAND.
 *         |converged - imp-3685 coarse| ~ 1.208e-5, ~12x OUTSIDE the ~1e-6 band. The imp-3685 baked
 *         1.02438 is a genuinely DISTINCT coarse-inner-grid value (the imp-3888 residual itself); one
 *         7-sig-fig literal cannot represent both it and the converged value.
 *     (3) THE CONVERGED VALUE IS STORABLE AT 7 SIG FIGS WITHIN THE BAND. toExponential(6) rounds it
 *         to 1.024397, whose round-trip error ~3.05e-7 is INSIDE the ~1e-6 band, so a new 7-sig-fig
 *         cache field faithfully carries it.
 *     (4) NEITHER EXISTING ASSERTION IS WEAKENED. imp-3685 (1e-4-tolerant, target 1.02438) and imp-3849
 *         (1e-4-tolerant, target 1.02440) both still PASS against the converged value:
 *         |converged - 1.02438| ~ 1.67e-5 < 1e-4 and |converged - imp-3849 native| ~ 4.97e-9 < 1e-4.
 *
 *   VERDICT -- FEASIBLE as a NEW, SEPARATELY-NAMED field; NOT to unify with the imp-3685 coarse slot
 *   ------------------------------------------------------------------------------------------------
 *   FEASIBLE: the imp-3888 residual CAN be retired to a converged constant, minted as a NEW cache
 *   field (converged R_40 = 1.024397 at 7-sig-fig storage). It reproduces the imp-3849 native value
 *   to ~5e-9, round-trips at 7 sig figs to ~3e-7 (both inside ~1e-6), and weakens NEITHER the imp-3685
 *   nor the imp-3849 1e-4-tolerant assertion. What is NOT feasible -- and was never required -- is
 *   overwriting/unifying the imp-3685 coarse baked 1.02438 INTO the converged constant at the 1e-6
 *   grain: the ~1.21e-5 coarse-vs-converged gap is ~12x the storage band, so imp-3685 must remain a
 *   separate (coarse-inner-grid) field. Net: a NEW converged literal is safe to bake; the coarse and
 *   converged fields coexist, they do not collapse into one.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   ASSESSMENT ONLY. This module performs the deferred imp-33292 feasibility check and returns a
 *   FEASIBLE verdict on minting a NEW converged R_40 cache field; it PROPOSES no edit to imp-3685 or
 *   imp-3849 and PATCHES no literal here. It establishes NO new bound. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. No refereed bound is changed. The
 *   converged R_40 is a grid-CONVERGENCE floor of this truncated-kernel model (shared finite
 *   NPHI = 10 kernel truncation), not a certified error bound.
 *
 *   @see imp-33292-r40-inner-richardson-extrapolation.js (produced the converged R_40 ~ 1.0243966950314)
 *   @see imp-33256-r40-inner-quadrature-sweep.js (swept the inner axis; coarse 1.02438462 -> converged)
 *   @see imp-33276-r40-cross-outer-invariance-all-inner-grids.js (isolated the residual to the inner grid)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (inner-converged native R_40 = 1.02440)
 *   @see imp-3685 baked saddleDnRatioLast ~ 1.02438 (coarse [0,7]/1200)
 */

// The three documented, cross-checked R_40 = |D_40|/|D_40^saddle| values (assertion-gated in source).
const CONVERGED_R40 = 1.0243966950314;   // imp-33292 ladder-independent Richardson extrapolant
const IMP3849_NATIVE = 1.02439670;       // imp-3849 inner-converged [0,2]/4800 (three-rule cross-check)
const IMP3685_COARSE = 1.02438462;       // imp-3685 coarse [0,7]/1200 baked saddleDnRatioLast

// Tolerance bands.
const STORAGE_TOL = 1e-6;   // 7-sig-fig toExponential(6) cache-field reconstruction band
const ASSERT_TOL = 1e-4;    // the imp-3685 / imp-3849 self-check assertion tolerance

// (1) converged vs imp-3849 native; (2) converged vs imp-3685 coarse.
const deltaConverged3849 = Math.abs(CONVERGED_R40 - IMP3849_NATIVE);
const deltaConverged3685 = Math.abs(CONVERGED_R40 - IMP3685_COARSE);

// (3) storage round-trip of the converged value at 7 sig figs (toExponential(6)).
const stored7SigFig = parseFloat(CONVERGED_R40.toExponential(6));   // 1.024397
const roundTripErr = Math.abs(CONVERGED_R40 - stored7SigFig);

// (4) do the existing 1e-4-tolerant assertions still pass against the converged value?
const imp3685AssertSurvives = Math.abs(CONVERGED_R40 - 1.02438) < ASSERT_TOL;
const imp3849AssertSurvives = deltaConverged3849 < ASSERT_TOL;

// Verdict flags.
const matchesImp3849WithinStorageBand = deltaConverged3849 < STORAGE_TOL;
const storableAt7SigFig = roundTripErr < STORAGE_TOL;
const unifiesWithImp3685CoarseAtStorageBand = deltaConverged3685 < STORAGE_TOL;
const existingAssertionsSurvive = imp3685AssertSurvives && imp3849AssertSurvives;

// FEASIBLE to mint a NEW converged field iff it matches the imp-3849 native value and round-trips
// within the storage band AND neither existing assertion is weakened. It does NOT unify with the
// imp-3685 coarse slot (that gap exceeds the band), but that unification was never required.
const feasibleAsNewField =
  matchesImp3849WithinStorageBand && storableAt7SigFig && existingAssertionsSurvive;

const verdict = feasibleAsNewField
  ? 'FEASIBLE-AS-NEW-FIELD'
  : 'NOT-YET';

export const IMP33310_R40_CONVERGED_LITERAL_FEASIBILITY = Object.freeze({
  id: 'imp-33310',
  title: 'Feasibility of baking the imp-33292 converged R_40 ~ 1.0243966950314 as a stored literal',

  values: Object.freeze({
    convergedR40: CONVERGED_R40,       // imp-33292 ~1.0243966950314
    imp3849Native: IMP3849_NATIVE,     // imp-3849 [0,2]/4800 ~1.02439670
    imp3685Coarse: IMP3685_COARSE,     // imp-3685 [0,7]/1200 ~1.02438462
    stored7SigFig,                     // 1.024397 (toExponential(6) round of converged)
    storageTol: STORAGE_TOL,           // ~1e-6
    assertTol: ASSERT_TOL,             // ~1e-4
  }),

  measured: Object.freeze({
    deltaConverged3849,                       // ~4.97e-9 (inside storage band)
    deltaConverged3685,                       // ~1.208e-5 (outside storage band, ~12x)
    roundTripErr,                             // ~3.05e-7 (inside storage band)
    matchesImp3849WithinStorageBand,          // true
    storableAt7SigFig,                        // true
    unifiesWithImp3685CoarseAtStorageBand,    // false
    imp3685AssertSurvives,                    // true (|converged-1.02438|~1.67e-5 < 1e-4)
    imp3849AssertSurvives,                    // true (~4.97e-9 < 1e-4)
    existingAssertionsSurvive,                // true
    feasibleAsNewField,                       // true
    verdict,
  }),

  interpretation: Object.freeze({
    convergedMatchesImp3849:
      'The imp-33292 Richardson converged R_40 and the imp-3849 native [0,2]/4800 value agree to ' +
      '~4.97e-9, ~200x inside the ~1e-6 storage band -- the same number at storage precision, since ' +
      'both sit on the converged inner grid.',
    coarseIsADistinctValue:
      'The imp-3685 coarse [0,7]/1200 baked 1.02438 differs from the converged value by ~1.208e-5, ' +
      '~12x the ~1e-6 band. It is the imp-3888 residual itself -- a genuinely distinct coarse-inner-grid ' +
      'value that one 7-sig-fig literal cannot share with the converged value.',
    newFieldIsSafe:
      'A NEW converged cache field (converged R_40 = 1.024397 at 7-sig-fig storage) round-trips to ' +
      '~3.05e-7 (inside the band) and weakens NEITHER the imp-3685 (1e-4, target 1.02438) NOR the ' +
      'imp-3849 (1e-4, target 1.02440) assertion, both of which still pass against the converged value.',
    verdictMeaning:
      'FEASIBLE to retire the imp-3888 residual to a converged constant AS A NEW, separately-named ' +
      'field; NOT to overwrite/unify the imp-3685 coarse slot into it (never required). The coarse and ' +
      'converged fields coexist.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isAssessmentOnly: true,
    proposesEditToImp3685OrImp3849: false,
    patchedALiteral: false,
    changesAnyBound: false,
    establishesOperatorPositivity: false,
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'The converged R_40 is a grid-CONVERGENCE floor of this truncated-kernel model; the shared ' +
      'finite NPHI = 10 kernel truncation remains the residual model floor, not a certified error bound.',
    sota: 'No refereed bound is changed',
  }),
});

export const IMP33310_R40_CONVERGED_LITERAL_ASSERTIONS = [
  {
    id: 'imp33310-converged-matches-imp3849-within-storage-band',
    why: 'The imp-33292 converged R_40 must reproduce the imp-3849 native [0,2]/4800 value to within ' +
      'the ~1e-6 storage-precision band, confirming the two are the same number at storage precision.',
    holds: () => deltaConverged3849 < STORAGE_TOL && deltaConverged3849 < 1e-8,
  },
  {
    id: 'imp33310-coarse-is-outside-storage-band',
    why: 'The imp-3685 coarse [0,7]/1200 baked value must differ from the converged value by more than ' +
      'the ~1e-6 storage band (the ~1.21e-5 imp-3888 residual), so it cannot unify with the converged literal.',
    holds: () =>
      deltaConverged3685 > STORAGE_TOL &&
      deltaConverged3685 > 1e-5 && deltaConverged3685 < 1.5e-5 &&
      unifiesWithImp3685CoarseAtStorageBand === false,
  },
  {
    id: 'imp33310-converged-storable-at-7-sig-fig',
    why: 'The converged value must round-trip through toExponential(6) (7 sig figs) to within the ' +
      '~1e-6 band, so a new 7-sig-fig cache field faithfully carries it.',
    holds: () => roundTripErr < STORAGE_TOL && stored7SigFig === 1.024397,
  },
  {
    id: 'imp33310-existing-assertions-survive',
    why: 'The converged value must NOT weaken either existing 1e-4-tolerant assertion: it must stay ' +
      'within 1e-4 of both the imp-3685 baked 1.02438 and the imp-3849 native value.',
    holds: () => imp3685AssertSurvives && imp3849AssertSurvives && existingAssertionsSurvive,
  },
  {
    id: 'imp33310-verdict-is-feasible-as-new-field',
    why: 'The classified verdict must be FEASIBLE-AS-NEW-FIELD: the converged constant can be minted as ' +
      'a new separately-named field without weakening any assertion, and is not indeterminate.',
    holds: () => verdict === 'FEASIBLE-AS-NEW-FIELD' && feasibleAsNewField === true,
  },
  {
    id: 'imp33310-honest-assessment-only',
    why: 'Mandatory honesty: assessment only, proposes no edit to imp-3685/imp-3849, patches no literal, ' +
      'changes no bound, imp-3066 untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33310_R40_CONVERGED_LITERAL_FEASIBILITY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isAssessmentOnly === true &&
        c.proposesEditToImp3685OrImp3849 === false &&
        c.patchedALiteral === false &&
        c.changesAnyBound === false &&
        c.establishesOperatorPositivity === false
      );
    },
  },
];

// Self-executing validation: the delta arithmetic and verdict are checked on import.
for (const a of IMP33310_R40_CONVERGED_LITERAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33310 assertion failed: ' + a.id);
  }
}
