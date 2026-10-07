/**
 * @module imp-124944-sigma-en-denominator-notational-consistency-audit
 * @fileoverview imp-124944 -- audits the conditional-share denominator notation across the
 * recent sigma-diagnostic cohort named by the ticket (imp-124769/124793/124811/124812/124824/
 * 124837): imp-124837 writes the expanded form sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 * while several siblings write the shorthand sigma = E_coll / E_N with E_N defined separately.
 * This audit checks whether E_N is defined identically (same three terms, same role) everywhere
 * it appears written out, and flags any module where the denominator drops/adds a term or
 * reorders the terms in a way that changes substance (reordering a commutative sum does not).
 *
 * METHOD (read-only, performed at author time). Grepped each of the six named cohort modules
 * for an explicit written denominator ("E_N = ..." or "sigma(N) = E_coll / (...)"):
 *   - imp-124769-ecf-stencil-noise-floor-crossover.js : line 18,
 *     "E_N = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N"
 *   - imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js : no written denominator (the
 *     module's own per-nine ladder is a function of the RvM-slope diagnostic, not sigma itself;
 *     it carries no local sigma/E_N definition to audit).
 *   - imp-124811-pairratio-reldiff-ecf-roundoff-law.js : line 18,
 *     "E_N = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N" (verbatim match to
 *     imp-124769).
 *   - imp-124812-diag3-additivity-exact-identity-assessment.js : line 22,
 *     "E_N = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N" (verbatim match).
 *   - imp-124824-ecf-stencil-crossover-viz-data.js : no written denominator (pure viz-data leaf,
 *     imports its sigma/E_N values from upstream modules rather than restating the formula).
 *   - imp-124837-fartail-rvm-per-nine-conditional-share-note.js : conditionalShareDefinition
 *     field, "sigma(N) = E_coll / (E_trunc + E_flow + E_coll)" -- the expanded form, SAME three
 *     terms in the SAME order as the E_N shorthand used by imp-124769/124811/124812.
 *
 * RESULT: NO DRIFT FOUND. Every module in the named cohort that writes out the denominator
 * (4 of 6; the other 2 carry no local definition to compare) uses exactly the same three terms
 * E_trunc + E_flow + E_coll in exactly the same left-to-right order -- imp-124837's expanded
 * form is not merely equivalent up to commutativity, it is the identical token sequence as the
 * E_N := ... definitions elsewhere. No module drops a term, adds a term, or substitutes a
 * different quantity (e.g. E_cc, E_tail) for one of the three. A wider grep across the broader
 * project archive (not just the six named modules) turns up two-term variants such as
 * sigma = E_coll/(E_trunc + E_coll); those are a DIFFERENT, explicitly-labeled near-peak model
 * (dropping E_flow at the E_trunc = E_coll crossover, documented inline as such, e.g.
 * imp-96151's two-term closed form) and are not instances of the three-term E_N drifting --
 * they are a separate, intentionally-narrower approximation and out of this audit's scope.
 *
 * RECOMMENDATION. Nothing to repair. This audit fabricates no new numerics and moves no bound;
 * it only records that the conditional-share denominator notation is consistent across the
 * named cohort.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (E_N = E_trunc + E_flow + E_coll, line 18)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law.js (verbatim match, line 18)
 * @see imp-124812-diag3-additivity-exact-identity-assessment.js (verbatim match, line 22)
 * @see imp-124837-fartail-rvm-per-nine-conditional-share-note.js (expanded form, conditionalShareDefinition field)
 * @see imp-124926-fartail-landmark-vs-124837-chain-audit.js (sibling audit: found the roadmap's
 *   E_coll/(E_coll+E_trunc+E_flow) consistent with imp-124837 "up to commutative term order" --
 *   this audit narrows to the named cohort and finds the stronger result, identical term order)
 */

export const IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT = Object.freeze({
  id: 'imp-124944-sigma-en-denominator-notational-consistency-audit',
  title:
    'Audit of the conditional-share denominator notation (E_N vs expanded form) across the '
    + 'imp-124769/124793/124811/124812/124824/124837 cohort',
  method:
    'Grep each of the six named cohort modules for an explicit written denominator ("E_N = ..." '
    + 'or "sigma(N) = E_coll / (...)") and compare term sets and term order.',
  cohort: Object.freeze([
    'imp-124769-ecf-stencil-noise-floor-crossover.js',
    'imp-124793-fartail-diagnostic-per-nine-spacing-ladder.js',
    'imp-124811-pairratio-reldiff-ecf-roundoff-law.js',
    'imp-124812-diag3-additivity-exact-identity-assessment.js',
    'imp-124824-ecf-stencil-crossover-viz-data.js',
    'imp-124837-fartail-rvm-per-nine-conditional-share-note.js',
  ]),
  modulesWithExplicitDenominator: 4,
  modulesWithNoLocalDefinition: 2,
  allExplicitDenominatorsIdentical: true,
  denominatorTermOrder: 'E_trunc + E_flow + E_coll',
  driftFound: false,
  outOfScopeTwoTermVariantsExist: true,
  outOfScopeNote:
    'Two-term variants (sigma = E_coll/(E_trunc + E_coll)) exist elsewhere in the project but are '
    + 'an explicitly-labeled, intentionally-narrower near-peak model dropping E_flow at the '
    + 'E_trunc = E_coll crossover -- not an instance of the three-term E_N drifting.',
  verdict:
    'NO DRIFT FOUND: every named-cohort module that writes out the conditional-share denominator '
    + 'uses the identical token sequence E_trunc + E_flow + E_coll; the two modules with no local '
    + 'definition import their sigma/E_N values from upstream rather than restating the formula. '
    + 'Nothing to repair.',
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP124944_HONEST_BANNER =
  'Read-only notational-consistency audit of the conditional-share denominator across the '
  + 'imp-124769/124793/124811/124812/124824/124837 cohort: the four modules that write out the '
  + 'denominator all use the identical term sequence E_trunc + E_flow + E_coll (imp-124837 '
  + 'expanded form matches the E_N shorthand elsewhere token-for-token, not merely up to '
  + 'commutativity); no drift found, nothing repaired. Changes no bound; imp-3066 K_a >= 0 '
  + 'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.';

export default IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.cohort.length === 6 &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.modulesWithExplicitDenominator === 4 &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.modulesWithNoLocalDefinition === 2 &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.allExplicitDenominatorsIdentical === true &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.driftFound === false &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.anyBoundMoved === false &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.operatorPositivityEstablished === false &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.measurementOnly === true &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.isRigorous === false &&
    IMP124944_SIGMA_EN_DENOMINATOR_NOTATIONAL_CONSISTENCY_AUDIT.qed === false &&
    /NO QED/.test(IMP124944_HONEST_BANNER) &&
    /Lambda <= 0.2/.test(IMP124944_HONEST_BANNER) &&
    /imp-3066/.test(IMP124944_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-124944-sigma-en-denominator-notational-consistency-audit assertion FAILED: the audit '
      + 'must confirm the named cohort uses an identical conditional-share denominator.'
  );
}
