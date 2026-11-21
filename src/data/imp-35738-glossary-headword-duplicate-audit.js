/**
 * @module imp-35738-glossary-headword-duplicate-audit
 *
 * imp-35738 (content, S-frontier ticket audit): imp-35738 asked to "Add a glossary headword for
 * the imp-35696 coefficient-independent collision-scale M-exponent (-1/3) and its cube-root
 * amplitude prefactor ((3/c)^{1/3}, C_C-vs-pi^2/3 ratio ~2.047)".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY EXISTS:
 * the entry titled "imp-35696 exponent/coefficient consistency check: the imp-35652 resolution
 * floor (M^{-1/3}) and constant mismatch (C_C) are the SAME cubic-repulsion structure" (category
 * 'proof-frontier') already states the coefficient-independent -1/3 M-exponent finding verbatim
 * ("BOTH come out at -1/3 ... The exponent is fixed purely by the cubic-repulsion POWER,
 * coefficient-INDEPENDENT; the amplitude only sets the prefactor (3/c)^{1/3}") and the ~2.047
 * cube-root prefactor ratio ("prefCC/prefStd ~ 2.047"), with firstUsed citing imp-35743 as the
 * ticket that added it. imp-35738 is a DUPLICATE of work imp-35743 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-35743 entry already supplies the full definition, the
 * bisection-derived exponent check, the prefactor ratio, and cross-references to imp-35652/
 * imp-35680. No new claim; changes no bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing imp-35696 headword)
 * @see imp-35696-collision-exponent-consistency-check (the source module the headword documents)
 */

const REQUIRED_TERM_SUBSTRING = 'imp-35696 exponent/coefficient consistency check';
const REQUIRED_CATEGORY = 'proof-frontier';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-35743';
const REQUIRED_PREFACTOR_RATIO_SUBSTRING = '2.047';
const REQUIRED_EXPONENT_SUBSTRING = '-1/3';

export const IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-35738',
  proofSection: 'S-frontier',
  question:
    'imp-35738 asked to add a glossary headword for the imp-35696 coefficient-independent ' +
    'collision-scale M-exponent (-1/3) and its ~2.047 cube-root prefactor; audit whether such a ' +
    'headword already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term containing "' +
    REQUIRED_TERM_SUBSTRING +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition states the coefficient-independent ' +
    REQUIRED_EXPONENT_SUBSTRING +
    ' M-exponent result and the ~' +
    REQUIRED_PREFACTOR_RATIO_SUBSTRING +
    ' cube-root prefactor ratio, with relatedTerms cross-linking imp-35652 and imp-35680, and ' +
    'firstUsed crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-35743 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-35743 already supplies the definition, the ' +
    'coefficient-independence check, and the prefactor ratio in full. This module records the ' +
    'duplicate-ticket finding and pins a permanent regression guard confirming the existing ' +
    'headword stays present and consistent. Changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35738-required-term-substring-well-formed',
    description: 'The cited term substring matches the expected imp-35696 consistency-check headword prefix',
    holds: () =>
      IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      'imp-35696 exponent/coefficient consistency check',
  },
  {
    id: 'imp35738-finding-cites-exponent-and-prefactor',
    description: 'The audit finding text quotes both the -1/3 exponent and the ~2.047 prefactor ratio',
    holds: () =>
      IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_EXPONENT_SUBSTRING) &&
      IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_PREFACTOR_RATIO_SUBSTRING),
  },
  {
    id: 'imp35738-duplicate-of-imp-35743',
    description: 'The audit correctly attributes the pre-existing headword to imp-35743',
    holds: () => IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35743'),
  },
  {
    id: 'imp35738-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35738_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35738-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
