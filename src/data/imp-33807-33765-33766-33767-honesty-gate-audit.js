/**
 * @module imp-33807-33765-33766-33767-honesty-gate-audit
 * @fileoverview imp-33807 -- honesty-gate assertion coverage audit of the imp-33765/imp-33766/
 * imp-33767 cohort, mirroring the imp-33733 sigma-cohort honesty audit. Confirms whether each
 * module backs its "NO QED / Platt-Trudgian Lambda<=0.2 remains SOTA / imp-3066 untouched" prose
 * caveat with an EXECUTABLE build-time tripwire (an `isRigorous === false` field paired with a
 * regex test on a stored verdict string), not only prose in a fileoverview comment.
 *
 * METHOD (read-only, performed at author time). Direct grep of each of the three module source
 * files for `isRigorous`, `NO QED`, `SOTA`, and `imp-3066`, then inspection of each module's own
 * bottom-of-file assertion block to confirm the executable check actually reads a stored honesty
 * field (as opposed to merely containing the phrases in a comment no code ever inspects).
 *
 * RESULT (audited 2026-07-05). Two of three modules match the imp-33733 pattern exactly; the
 * third carries an EQUIVALENT but differently-shaped executable tripwire, not the isRigorous:false
 * / literal-"NO QED" pattern the ticket asked to confirm:
 *   - imp-33766-h4-independent-discharge-scoping.js: `isRigorous: false` field (line 171);
 *     self-executing assertion (~line 259) checks
 *     `IMP33766_H4_INDEPENDENT_DISCHARGE_SCOPING.isRigorous === false`,
 *     `/NO QED/.test(...verdict)`, `/remains the rigorous SOTA/.test(...verdict)`, and
 *     `/imp-3066[^.]*UNTOUCHED/.test(...verdict)`. Full match.
 *   - imp-33767-sigma-inflection-offset-reconciliation.js: `isRigorous: false` field (line 224);
 *     self-executing assertion (~line 293) checks
 *     `IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION.isRigorous === false`,
 *     `/NO QED/.test(...verdict)`, and `/remains SOTA/.test(...verdict)`. Full match.
 *   - imp-33765-g7-obstruction-orthogonal-lever.js: NO `isRigorous` field anywhere in the file,
 *     and the literal string "NO QED" (all-caps, the exact substring the sibling modules'
 *     regexes test for) does not appear -- only "No false QED" appears inside a fileoverview
 *     comment, which no assertion inspects. Instead this module's honesty gate is a `honestCaveat`
 *     object with boolean fields (`isProof`, `isReductionBelowRH`, `isStructuralDiagnostic`,
 *     `imp3066Untouched`, `didNotAttemptPositivity`, ...) plus a `/Platt-Trudgian/` regex on its
 *     `sota` string, enforced by the executable assertion `imp33765-honest-diagnostic-not-a-verdict`
 *     (~line 401). This IS an executable tripwire and it DOES cover the same honesty ground
 *     (no proof, no RH verdict, imp-3066 untouched, no refereed bound is changed) -- so there is no silent,
 *     unenforced prose-only caveat -- but it is a structurally different mechanism from the
 *     isRigorous:false + literal-NO-QED-regex pattern used by its two siblings and by the
 *     imp-33733 cohort, so it does not "match" in the strict sense the ticket asked to confirm.
 *
 * This finding differs from the imp-33733 audit, which found zero gaps: here one of three modules
 * (imp-33765) enforces honesty through a distinct-but-equivalent field/regex shape rather than the
 * common isRigorous:false pattern. No follow-on tripwire-ADDITION is needed (imp-33765 already has
 * one), but a future consistency pass could fold imp-33765's `honestCaveat` shape into the common
 * `isRigorous` field name if cross-module tooling ever needs to scan for it uniformly.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33733 (the honesty-gate audit pattern this audit mirrors), imp-33765, imp-33766,
 * imp-33767
 */

export const IMP_33807_HONESTY_GATE_AUDIT = {
  id: 'imp-33807',
  auditedAt: '2026-07-05',
  modules: [
    {
      file: 'imp-33765-g7-obstruction-orthogonal-lever.js',
      hasIsRigorousFalseField: false,
      hasEquivalentExecutableHonestyTripwire: true,
      equivalentShape: 'honestCaveat boolean-field object + /Platt-Trudgian/ regex on sota string',
      verdictContainsLiteralNoQed: false,
      matchesImp33733Pattern: false,
    },
    {
      file: 'imp-33766-h4-independent-discharge-scoping.js',
      hasIsRigorousFalseField: true,
      hasEquivalentExecutableHonestyTripwire: true,
      equivalentShape: 'isRigorous:false field + verdict-string regex (imp-33733 pattern)',
      verdictContainsLiteralNoQed: true,
      matchesImp33733Pattern: true,
    },
    {
      file: 'imp-33767-sigma-inflection-offset-reconciliation.js',
      hasIsRigorousFalseField: true,
      hasEquivalentExecutableHonestyTripwire: true,
      equivalentShape: 'isRigorous:false field + verdict-string regex (imp-33733 pattern)',
      verdictContainsLiteralNoQed: true,
      matchesImp33733Pattern: true,
    },
  ],
  fullyMatchingImp33733PatternCount: 2,
  equivalentButDifferentShapeCount: 1,
  unenforcedGapsFound: 0,
  recommendation:
    'No tripwire-addition action needed -- all three modules already carry an executable ' +
    'honesty-gate assertion that would fail the build on a false isRigorous/honestCaveat claim. ' +
    'imp-33765 alone uses a differently-shaped honestCaveat object rather than the common ' +
    'isRigorous:false + literal-NO-QED-regex pattern; this is a naming-consistency observation, ' +
    'not an enforcement gap.',
  honestNote:
    'Read-only audit; no new bound claimed by this module itself. imp-3066 K_a >= 0 positivity ' +
    'untouched. No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_33807_ASSERTIONS = [
  {
    id: 'imp33807-exactly-three-modules-audited',
    holds: () => IMP_33807_HONESTY_GATE_AUDIT.modules.length === 3,
    why: 'The audit must cover exactly the three named modules (imp-33765/imp-33766/imp-33767).',
  },
  {
    id: 'imp33807-all-three-carry-an-executable-tripwire',
    holds: () => {
      const m = IMP_33807_HONESTY_GATE_AUDIT.modules;
      const covered = m.filter((x) => x.hasEquivalentExecutableHonestyTripwire === true).length;
      return covered === 3;
    },
    why: 'Grep-verified: every module in this cohort pairs its honesty caveat with a ' +
      'self-executing build-time assertion, whether via isRigorous:false or an equivalent ' +
      'honestCaveat object.',
  },
  {
    id: 'imp33807-two-match-imp33733-pattern-one-differs',
    holds: () => {
      const m = IMP_33807_HONESTY_GATE_AUDIT.modules;
      const matching = m.filter((x) => x.matchesImp33733Pattern === true).length;
      const differing = m.filter((x) => x.matchesImp33733Pattern === false).length;
      return (
        matching === 2 &&
        differing === 1 &&
        matching === IMP_33807_HONESTY_GATE_AUDIT.fullyMatchingImp33733PatternCount &&
        differing === IMP_33807_HONESTY_GATE_AUDIT.equivalentButDifferentShapeCount
      );
    },
    why: 'imp-33766 and imp-33767 use the isRigorous:false + literal-NO-QED-regex pattern; ' +
      'imp-33765 uses a distinct honestCaveat boolean-field shape that covers the same ground.',
  },
  {
    id: 'imp33807-zero-unenforced-gaps',
    holds: () => IMP_33807_HONESTY_GATE_AUDIT.unenforcedGapsFound === 0,
    why: 'No module in this cohort has a purely prose-only honesty caveat that no build-time ' +
      'assertion inspects.',
  },
  {
    id: 'imp33807-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33807_HONESTY_GATE_AUDIT.honestNote) &&
      /No QED/i.test(IMP_33807_HONESTY_GATE_AUDIT.honestNote) &&
      /imp-3066/.test(IMP_33807_HONESTY_GATE_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed' +
      ' and imp-3066 stays untouched.',
  },
];

for (const a of IMP_33807_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33807 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33807_ASSERTIONS };
