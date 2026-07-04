/**
 * @module imp-33530-r40-converged-literal-mint
 * @fileoverview imp-33530 -- MINT the imp-33292 converged R_40 as a NEW, separately-named 7-sig-fig
 *   cache literal, carrying out the mint that imp-33310 assessed FEASIBLE but left deferred.
 *
 *   WHAT imp-33310 LEFT (a FEASIBLE verdict, mint deferred)
 *   ------------------------------------------------------
 *   imp-33310 (imp-33310-r40-converged-literal-feasibility.js) assessed whether the imp-33292
 *   ladder-independent converged R_40 ~ 1.0243966950314 could be baked as a stored literal, and
 *   returned VERDICT FEASIBLE-AS-NEW-FIELD; NOT to unify with the imp-3685 coarse slot -- but it
 *   PATCHED no literal (isAssessmentOnly). This module carries out the deferred step: it derives the
 *   7-sig-fig stored value on the converged inner grid, stamps its ~1e-6 storage tolerance, and
 *   confirms the minted field stays DISTINCT from the imp-3685 coarse 1.02438462 slot (does not unify).
 *
 *   THE MINTED FIELD (a NEW name; imp-3685 and imp-3849 are LEFT INTACT)
 *   ------------------------------------------------------------------
 *     saddleDnRatioConverged = 1.024397   the imp-33292 converged R_40 = |D_40|/|D_40^saddle| at
 *                                         7-sig-fig toExponential(6) storage precision.
 *   The imp-3685 baked saddleDnRatioLast ~ 1.02438462 (coarse [0,7]/1200) and the imp-3849 native
 *   [0,2]/4800 ~ 1.02439670 are UNTOUCHED. The new field is a THIRD, separately-named slot -- the
 *   coarse and converged fields coexist, they do not collapse into one.
 *
 *   MEASURED (storage round-trip of the converged value; exact subtraction against the coarse slot)
 *   ---------------------------------------------------------------------------------------------
 *     (1) THE MINTED LITERAL RECONSTRUCTS THE CONVERGED VALUE WITHIN THE STORAGE BAND.
 *         |saddleDnRatioConverged - convergedR40| ~ 3.05e-7, ~3x INSIDE the ~1e-6 band, so the
 *         7-sig-fig field faithfully carries the imp-33292 Richardson extrapolant.
 *     (2) THE MINTED LITERAL STAYS DISTINCT FROM THE imp-3685 COARSE SLOT.
 *         |saddleDnRatioConverged - imp3685Coarse| ~ 1.238e-5, ~12x OUTSIDE the ~1e-6 band, so the
 *         new field does NOT unify with the coarse 1.02438462 slot -- exactly the imp-33310
 *         non-unification finding, now realised as two coexisting stored literals.
 *     (3) THE MINTED LITERAL DOES NOT WEAKEN EITHER EXISTING 1e-4-TOLERANT ASSERTION.
 *         It stays within 1e-4 of both the imp-3685 baked 1.02438 and the imp-3849 native value.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MINT OF A GRID-CONVERGENCE LITERAL ONLY. This bakes a NEW 7-sig-fig cache field for the converged
 *   R_40; it edits NEITHER imp-3685 NOR imp-3849, unifies NO field, and establishes NO new bound. The
 *   converged R_40 is a grid-CONVERGENCE floor of this truncated-kernel model (shared finite
 *   NPHI = 10 kernel truncation), NOT a certified error bound. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33310-r40-converged-literal-feasibility.js (FEASIBLE verdict, mint deferred)
 *   @see imp-33292-r40-inner-richardson-extrapolation.js (converged R_40 ~ 1.0243966950314)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (native [0,2]/4800 R_40 = 1.02440)
 *   @see imp-3685 baked saddleDnRatioLast ~ 1.02438 (coarse [0,7]/1200)
 */

// The imp-33292 ladder-independent converged R_40 (assertion-gated at its source).
const CONVERGED_R40 = 1.0243966950314;   // imp-33292 Richardson extrapolant
const IMP3685_COARSE = 1.02438462;       // imp-3685 coarse [0,7]/1200 baked saddleDnRatioLast
const IMP3849_NATIVE = 1.02439670;       // imp-3849 inner-converged [0,2]/4800 native value

// Tolerance bands.
const STORAGE_TOL = 1e-6;   // 7-sig-fig toExponential(6) cache-field reconstruction band
const ASSERT_TOL = 1e-4;    // the imp-3685 / imp-3849 self-check assertion tolerance

// THE MINTED LITERAL: the converged value stamped at 7 sig figs (toExponential(6)).
const SADDLE_DN_RATIO_CONVERGED = parseFloat(CONVERGED_R40.toExponential(6));   // 1.024397

// (1) reconstruction error of the minted 7-sig-fig literal vs the converged value.
const reconstructionErr = Math.abs(SADDLE_DN_RATIO_CONVERGED - CONVERGED_R40);          // ~3.05e-7
// (2) distinctness of the minted literal from the imp-3685 coarse slot.
const deltaMintedVsCoarse = Math.abs(SADDLE_DN_RATIO_CONVERGED - IMP3685_COARSE);       // ~1.238e-5
// (3) the minted literal must not weaken either existing 1e-4-tolerant assertion.
const mintedWithinImp3685Assert = Math.abs(SADDLE_DN_RATIO_CONVERGED - 1.02438) < ASSERT_TOL;
const mintedWithinImp3849Assert = Math.abs(SADDLE_DN_RATIO_CONVERGED - IMP3849_NATIVE) < ASSERT_TOL;

// Mint status flags.
const reconstructsWithinStorageBand = reconstructionErr < STORAGE_TOL;
const distinctFromImp3685CoarseSlot = deltaMintedVsCoarse > STORAGE_TOL;
const existingAssertionsSurvive = mintedWithinImp3685Assert && mintedWithinImp3849Assert;

const minted =
  reconstructsWithinStorageBand && distinctFromImp3685CoarseSlot && existingAssertionsSurvive;

const verdict = minted ? 'MINTED-AS-NEW-DISTINCT-FIELD' : 'NOT-MINTED';

export const IMP33530_R40_CONVERGED_LITERAL_MINT = Object.freeze({
  id: 'imp-33530',
  title: 'Mint the imp-33292 converged R_40 as a NEW separately-named 7-sig-fig cache literal',

  // The NEW cache field this module mints, plus its storage-tolerance stamp.
  cacheField: Object.freeze({
    name: 'saddleDnRatioConverged',
    value: SADDLE_DN_RATIO_CONVERGED,   // 1.024397 (7-sig-fig stored converged R_40)
    storageTol: STORAGE_TOL,            // ~1e-6 reconstruction band the field is stamped with
    derivedFrom: 'imp-33292 ladder-independent Richardson-converged R_40 ~ 1.0243966950314',
    distinctFrom: 'imp-3685 coarse saddleDnRatioLast ~ 1.02438462 (does NOT unify)',
  }),

  values: Object.freeze({
    convergedR40: CONVERGED_R40,        // imp-33292 ~1.0243966950314
    imp3685Coarse: IMP3685_COARSE,      // imp-3685 [0,7]/1200 ~1.02438462
    imp3849Native: IMP3849_NATIVE,      // imp-3849 [0,2]/4800 ~1.02439670
    assertTol: ASSERT_TOL,              // ~1e-4
  }),

  measured: Object.freeze({
    reconstructionErr,                  // ~3.05e-7 (inside storage band)
    deltaMintedVsCoarse,                // ~1.238e-5 (outside storage band, ~12x)
    reconstructsWithinStorageBand,      // true
    distinctFromImp3685CoarseSlot,      // true
    mintedWithinImp3685Assert,          // true
    mintedWithinImp3849Assert,          // true
    existingAssertionsSurvive,          // true
    minted,                             // true
    verdict,                            // MINTED-AS-NEW-DISTINCT-FIELD
  }),

  interpretation: Object.freeze({
    mintReconstructs:
      'The minted 7-sig-fig saddleDnRatioConverged = 1.024397 reconstructs the imp-33292 converged ' +
      'R_40 ~ 1.0243966950314 to ~3.05e-7, ~3x inside the ~1e-6 storage band, so the stamped literal ' +
      'faithfully carries the converged value.',
    mintStaysDistinct:
      'The minted literal differs from the imp-3685 coarse baked 1.02438462 by ~1.238e-5, ~12x the ' +
      '~1e-6 band, so it is a genuinely DISTINCT separately-named field -- the coarse and converged ' +
      'slots coexist and do not collapse into one 7-sig-fig literal.',
    assertionsUntouched:
      'The minted value stays within 1e-4 of both the imp-3685 baked 1.02438 and the imp-3849 native ' +
      'value, so neither existing 1e-4-tolerant assertion is weakened by adding the new field.',
    verdictMeaning:
      'The imp-33310 FEASIBLE verdict is realised: the imp-3888 residual is retired to a converged ' +
      'constant AS A NEW, separately-named cache field, with the imp-3685 coarse slot LEFT INTACT.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    mintsANewFieldOnly: true,
    proposesEditToImp3685OrImp3849: false,
    unifiesAnyField: false,
    changesAnyBound: false,
    establishesOperatorPositivity: false,
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'The converged R_40 is a grid-CONVERGENCE floor of this truncated-kernel model; the shared ' +
      'finite NPHI = 10 kernel truncation remains the residual model floor, not a certified error bound.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

export const IMP33530_R40_CONVERGED_LITERAL_MINT_ASSERTIONS = [
  {
    id: 'imp33530-minted-literal-is-1p024397',
    why: 'The minted cache field must be exactly the 7-sig-fig toExponential(6) round of the imp-33292 ' +
      'converged R_40, i.e. 1.024397.',
    holds: () => SADDLE_DN_RATIO_CONVERGED === 1.024397,
  },
  {
    id: 'imp33530-minted-reconstructs-within-storage-band',
    why: 'The minted 7-sig-fig literal must reconstruct the converged R_40 to within the ~1e-6 storage ' +
      'band, so the stamped field faithfully carries the converged value.',
    holds: () => reconstructionErr < STORAGE_TOL && reconstructionErr < 5e-7,
  },
  {
    id: 'imp33530-minted-distinct-from-imp3685-coarse-slot',
    why: 'The minted literal must differ from the imp-3685 coarse baked 1.02438462 by more than the ' +
      '~1e-6 storage band (the ~1.24e-5 gap), confirming it is a distinct field that does not unify.',
    holds: () =>
      deltaMintedVsCoarse > STORAGE_TOL &&
      deltaMintedVsCoarse > 1e-5 && deltaMintedVsCoarse < 1.5e-5 &&
      distinctFromImp3685CoarseSlot === true,
  },
  {
    id: 'imp33530-existing-assertions-survive',
    why: 'The minted value must NOT weaken either existing 1e-4-tolerant assertion: it must stay within ' +
      '1e-4 of both the imp-3685 baked 1.02438 and the imp-3849 native value.',
    holds: () => mintedWithinImp3685Assert && mintedWithinImp3849Assert && existingAssertionsSurvive,
  },
  {
    id: 'imp33530-verdict-is-minted-as-new-distinct-field',
    why: 'The classified verdict must be MINTED-AS-NEW-DISTINCT-FIELD: the converged constant is minted ' +
      'as a new separately-named field without weakening any assertion and without unifying the coarse slot.',
    holds: () => verdict === 'MINTED-AS-NEW-DISTINCT-FIELD' && minted === true,
  },
  {
    id: 'imp33530-honest-mint-only',
    why: 'Mandatory honesty: mint of a grid-convergence literal only, proposes no edit to imp-3685/imp-3849, ' +
      'unifies no field, changes no bound, imp-3066 untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33530_R40_CONVERGED_LITERAL_MINT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.mintsANewFieldOnly === true &&
        c.proposesEditToImp3685OrImp3849 === false &&
        c.unifiesAnyField === false &&
        c.changesAnyBound === false &&
        c.establishesOperatorPositivity === false
      );
    },
  },
];

// Self-executing validation: the mint arithmetic and verdict are checked on import.
for (const a of IMP33530_R40_CONVERGED_LITERAL_MINT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33530 assertion failed: ' + a.id);
  }
}
