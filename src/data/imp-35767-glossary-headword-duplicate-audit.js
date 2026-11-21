/**
 * @module imp-35767-glossary-headword-duplicate-audit
 *
 * imp-35767 (content, S-frontier ticket audit): imp-35767 asked to "Add a glossary/Concepts
 * headword for the imp-35727 certified-winding ingredient ledger I1-I5: the five GREENFIELD
 * ingredients a rigorous argument-principle zero count on the transition-rectangle boundary
 * needs beyond the held experimental scaffolding (I1 between-node interval enclosure, I2
 * per-panel |Delta arg|<pi cap, I3 modulus floor |f|>=delta, I4 integer closure within <pi
 * error, I5 corner continuity)".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY
 * EXISTS: the entry titled "imp-35727 W2 certified-winding-count ingredient ledger (I1-I5)"
 * (category 'proof-frontier') already enumerates I1 (between-node interval enclosure), I2
 * (per-panel |Delta arg f| < pi cap), I3 (modulus floor |f| >= delta > 0), I4 (integer closure
 * within < pi error), and I5 (corner continuity), and states all five are GREENFIELD, with
 * firstUsed crediting imp-35817 as the ticket that added it. imp-35767 is a DUPLICATE of work
 * imp-35817 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-35817 entry already supplies the full I1-I5
 * enumeration, the GREENFIELD verdict, and the cross-links to imp-35757/imp-35777/imp-35758/
 * imp-35778. No new claim; changes no bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing "imp-35727 W2
 *      certified-winding-count ingredient ledger (I1-I5)" headword)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (the source module the headword
 *      documents)
 */

const REQUIRED_TERM_SUBSTRING = 'imp-35727 W2 certified-winding-count ingredient ledger (I1-I5)';
const REQUIRED_CATEGORY = 'proof-frontier';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-35817';
const REQUIRED_I1_SUBSTRING = 'I1 between-node interval ENCLOSURE';
const REQUIRED_I4_SUBSTRING = 'I4 closure of the accumulated per-segment increments';
const REQUIRED_GREENFIELD_SUBSTRING = 'All FIVE are GREENFIELD';

export const IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-35767',
  proofSection: 'S-frontier',
  question:
    'imp-35767 asked to add a glossary/Concepts headword for the imp-35727 certified-winding ' +
    'ingredient ledger I1-I5 (between-node interval enclosure, per-panel argument cap, modulus ' +
    'floor, integer closure, corner continuity); audit whether such a headword already exists ' +
    'before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term "' +
    REQUIRED_TERM_SUBSTRING +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition enumerates "' +
    REQUIRED_I1_SUBSTRING +
    '" through "' +
    REQUIRED_I4_SUBSTRING +
    '" and I5 corner continuity, states "' +
    REQUIRED_GREENFIELD_SUBSTRING +
    '", with firstUsed crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-35817 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-35817 already supplies the full I1-I5 ' +
    'enumeration and GREENFIELD verdict. This module records the duplicate-ticket finding and ' +
    'pins a permanent regression guard confirming the existing headword stays present and ' +
    'consistent. Changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35767-required-term-substring-well-formed',
    description: 'The cited term substring matches the expected I1-I5 ledger headword title',
    holds: () =>
      IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      'imp-35727 W2 certified-winding-count ingredient ledger (I1-I5)',
  },
  {
    id: 'imp35767-finding-cites-i1-and-i4',
    description: 'The audit finding text quotes both the I1 enclosure phrase and the I4 closure phrase',
    holds: () =>
      IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_I1_SUBSTRING) &&
      IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_I4_SUBSTRING),
  },
  {
    id: 'imp35767-finding-cites-greenfield-verdict',
    description: 'The audit finding text quotes the GREENFIELD verdict for all five ingredients',
    holds: () =>
      IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_GREENFIELD_SUBSTRING),
  },
  {
    id: 'imp35767-duplicate-of-imp-35817',
    description: 'The audit correctly attributes the pre-existing headword to imp-35817',
    holds: () => IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35817'),
  },
  {
    id: 'imp35767-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35767_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35767-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
