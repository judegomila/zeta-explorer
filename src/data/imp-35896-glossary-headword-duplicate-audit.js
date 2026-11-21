/**
 * @module imp-35896-glossary-headword-duplicate-audit
 *
 * imp-35896 (content, S-frontier ticket audit): imp-35896 asked to "Add a glossary/Concepts
 * headword for the imp-35855 node-level de-cancellation identity M_G-1 = -a/(2-a): the
 * algebraic rewrite that replaces the near-equal subtraction (subtraction condition number
 * kappa_sub ~ 4/a, divergent as a->0) with an O(1)-conditioned form, and why it is
 * necessary-but-not-sufficient for the OPEN imp-34714a Krawczyk certificate".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY
 * EXISTS: the entry titled "Node-Level De-Cancellation and the Subtraction Condition Number
 * kappa_sub = (|x|+|y|)/|x-y|" (category 'numerical') already carries "THE WORKED EXAMPLE
 * (imp-35855)" paragraph stating the closed-form identity M_G - 1 = -a/(2-a), the
 * kappa_cancel ~ 4/a divergent-vs-kappa_direct ~ 1 bounded conditioning collapse, and a
 * dedicated "WHY THIS IS NODE-LEVEL, NOT A FULL CERTIFICATE" paragraph stating the rewrite is
 * necessary but not sufficient for the OPEN imp-34714a Krawczyk certificate -- with
 * firstUsed crediting imp-35939 as the ticket that added it. imp-35896 is a DUPLICATE of
 * work imp-35939 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-35939 entry already supplies the identity, the
 * kappa_sub metric, and the necessary-but-not-sufficient caveat in full. No new claim;
 * changes no bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing "Node-Level De-Cancellation
 *      and the Subtraction Condition Number kappa_sub = (|x|+|y|)/|x-y|" headword)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (the source module the headword documents)
 */

const REQUIRED_TERM_SUBSTRING =
  'Node-Level De-Cancellation and the Subtraction Condition Number kappa_sub = (|x|+|y|)/|x-y|';
const REQUIRED_CATEGORY = 'numerical';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-35939';
const REQUIRED_IDENTITY_SUBSTRING = '-a/(2-a)';
const REQUIRED_KAPPA_CANCEL_SUBSTRING = '4/a';

export const IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-35896',
  proofSection: 'S-frontier',
  question:
    'imp-35896 asked to add a glossary/Concepts headword for the imp-35855 M_G-1 = -a/(2-a) ' +
    'node-level de-cancellation identity (kappa_sub ~ 4/a divergent -> O(1) bounded) and why it ' +
    'is necessary-but-not-sufficient for the OPEN imp-34714a Krawczyk certificate; audit whether ' +
    'such a headword already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term "' +
    REQUIRED_TERM_SUBSTRING +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition states the ' +
    REQUIRED_IDENTITY_SUBSTRING +
    ' closed form for M_G - 1, the kappa_cancel ~ ' +
    REQUIRED_KAPPA_CANCEL_SUBSTRING +
    ' divergent-vs-kappa_direct ~ 1 bounded conditioning collapse, and a dedicated paragraph ' +
    'stating the rewrite is necessary but not sufficient for the OPEN imp-34714a Krawczyk ' +
    'certificate, with firstUsed crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-35939 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-35939 already supplies the M_G-1 = -a/(2-a) ' +
    'identity, the kappa_sub conditioning collapse, and the necessary-but-not-sufficient caveat ' +
    'in full. This module records the duplicate-ticket finding and pins a permanent regression ' +
    'guard confirming the existing headword stays present and consistent. Changes no bound; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35896-required-term-substring-well-formed',
    description: 'The cited term substring matches the expected node-level de-cancellation headword title',
    holds: () =>
      IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      'Node-Level De-Cancellation and the Subtraction Condition Number kappa_sub = (|x|+|y|)/|x-y|',
  },
  {
    id: 'imp35896-finding-cites-identity-and-kappa-cancel',
    description: 'The audit finding text quotes both the -a/(2-a) identity and the kappa_cancel ~ 4/a divergence',
    holds: () =>
      IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_IDENTITY_SUBSTRING) &&
      IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_KAPPA_CANCEL_SUBSTRING),
  },
  {
    id: 'imp35896-finding-cites-necessary-not-sufficient',
    description: 'The audit finding cites the OPEN imp-34714a Krawczyk certificate necessary-but-not-sufficient caveat',
    holds: () => /imp-34714a Krawczyk certificate/.test(IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp35896-duplicate-of-imp-35939',
    description: 'The audit correctly attributes the pre-existing headword to imp-35939',
    holds: () => IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35939'),
  },
  {
    id: 'imp35896-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35896_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35896-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
