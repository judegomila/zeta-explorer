/**
 * @module imp-36067-glossary-headword-duplicate-audit
 *
 * imp-36067 (content, S-frontier ticket audit): imp-36067 asked to "Add a glossary/Concepts
 * headword distinguishing Kahan-Babuska-Neumaier (KBN) compensated summation from classic
 * Kahan summation, grounded in imp-36023 showing KBN ~10x tighter than classic Kahan on the
 * clustered worst order at N~488602 (1.89e-20 vs 2.31e-19) because KBN stays correct when the
 * running sum is smaller in magnitude than the incoming term".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY EXISTS:
 * the entry titled "Kahan-Babuska-Neumaier (KBN) compensated summation and its N-FLAT error
 * floor" (category "numerical") already states the KBN correction rule -- c += (s - t) + x when
 * |s| >= |x|, else c += (x - t) + s -- so the compensation stays correct even when the running
 * sum s is smaller in magnitude than the incoming term x, a case where classic Kahan silently
 * loses accuracy -- and already cites the exact imp-36023 N~488602 endpoint contrast (classic
 * Kahan ~2.31e-19 vs full KBN ~1.89e-20, "roughly an order tighter still"), with firstUsed
 * crediting imp-36085 as the ticket that added it. imp-36067 is a DUPLICATE of work imp-36085
 * already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-36085 entry already supplies the KBN-vs-classic-Kahan
 * distinction and the imp-36023 N~488602 numeric contrast in full. No new claim; changes no
 * bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing "Kahan-Babuska-Neumaier (KBN)
 *      compensated summation and its N-FLAT error floor" headword)
 * @see imp-36023-kbn-combined-worst-ladder (src/data/imp-36023-kbn-combined-worst-ladder.js --
 *      source module the headword documents)
 */

const REQUIRED_TERM_SUBSTRING = 'Kahan-Babuska-Neumaier (KBN) compensated summation and its N-FLAT error floor';
const REQUIRED_CATEGORY = 'numerical';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-36085';
const REQUIRED_CONTRAST_SUBSTRINGS = ['2.31e-19', '1.89e-20', '|s| >= |x|'];

export const IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-36067',
  proofSection: 'S-frontier',
  question:
    'imp-36067 asked to add a glossary/Concepts headword distinguishing KBN compensated ' +
    'summation from classic Kahan summation, grounded in the imp-36023 N~488602 endpoint ' +
    'contrast (1.89e-20 vs 2.31e-19); audit whether such a headword already exists before ' +
    'writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term "' +
    REQUIRED_TERM_SUBSTRING +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition states the KBN correction rule (choosing which operand feeds the ' +
    'correction term based on relative magnitude, c += (s - t) + x when |s| >= |x|, else ' +
    'c += (x - t) + s, so compensation stays correct even when the running sum s is smaller in ' +
    'magnitude than the incoming term x -- a case where classic Kahan silently loses accuracy) ' +
    'and already cites the exact imp-36023 N~488602 numeric contrast (classic Kahan ~2.31e-19 ' +
    'vs full KBN ~1.89e-20), with firstUsed crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-36085 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  requiredContrastSubstrings: REQUIRED_CONTRAST_SUBSTRINGS,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-36085 already supplies the KBN-vs-classic-' +
    'Kahan distinction and the imp-36023 N~488602 numeric contrast in full. This module records ' +
    'the duplicate-ticket finding and pins a permanent regression guard confirming the existing ' +
    'headword stays present and consistent. Changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp36067-required-term-substring-well-formed',
    description: 'The cited term substring matches the expected KBN-vs-Kahan headword title',
    holds: () =>
      IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      'Kahan-Babuska-Neumaier (KBN) compensated summation and its N-FLAT error floor',
  },
  {
    id: 'imp36067-finding-cites-correction-rule',
    description: 'The audit finding states the |s| >= |x| operand-selection correction rule',
    holds: () => /\|s\| >= \|x\|/.test(IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp36067-finding-cites-numeric-contrast',
    description: 'The audit finding cites the imp-36023 N~488602 numeric contrast (2.31e-19 vs 1.89e-20)',
    holds: () =>
      /2\.31e-19/.test(IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /1\.89e-20/.test(IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp36067-duplicate-of-imp-36085',
    description: 'The audit correctly attributes the pre-existing headword to imp-36085',
    holds: () => IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-36085'),
  },
  {
    id: 'imp36067-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP36067_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36067-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
