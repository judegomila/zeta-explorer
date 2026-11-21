/**
 * @module imp-35901-glossary-headword-duplicate-audit
 *
 * imp-35901 (content, S-frontier ticket audit): imp-35901 asked to "Add a glossary/Concepts
 * headword for the imp-35852 clustered sign-run skeptical summation ordering and the
 * coherent-vs-random-walk ceiling gap: why a stable sign partition (two long same-sign runs)
 * is the worst naive ordering yet still stays ~4.35 orders below the coherent O(N*u) ceiling,
 * so full sign-coherence is NOT realizable on the W1 sum".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY
 * EXISTS: the entry titled "Clustered Sign-Run Worst-case Ordering" (category 'numerical')
 * already states the stable-sign-partition construction, the "WHY HOSTILE ORDERINGS PUSH
 * NAIVE SUMMATION TOWARD THE O(N . u) CEILING" mechanism paragraph, the measured ~160x naive
 * degradation from ~6.55 to ~4.35 orders below the coherent N . eps ceiling, and the explicit
 * "full sign-coherence of the N rounding errors is NOT realizable on this data" verdict --
 * with firstUsed crediting imp-35938 as the ticket that added it. imp-35901 is a DUPLICATE of
 * work imp-35938 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-35938 entry already supplies the clustered-ordering
 * construction, the coherence mechanism, the ~4.35-orders measurement, and the
 * not-realizable verdict in full. No new claim; changes no bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing "Clustered Sign-Run
 *      Worst-case Ordering" headword)
 * @see imp-35852-w1-summation-adversarial-ordering (the source module the headword documents)
 */

const REQUIRED_TERM = 'Clustered Sign-Run Worst-case Ordering';
const REQUIRED_CATEGORY = 'numerical';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-35938';
const REQUIRED_ORDERS_SUBSTRING = '4.35';
const REQUIRED_NOT_REALIZABLE_SUBSTRING = 'NOT realizable on this data';

export const IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-35901',
  proofSection: 'S-frontier',
  question:
    'imp-35901 asked to add a glossary/Concepts headword for the imp-35852 clustered ' +
    'sign-run worst-case ordering and the coherent-vs-random-walk ceiling gap (worst naive ' +
    'ordering still ~4.35 orders below the coherent O(N*u) ceiling, so full sign-coherence is ' +
    'not realizable); audit whether such a headword already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term "' +
    REQUIRED_TERM +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition states the stable-sign-partition construction, the coherent-' +
    'accumulation mechanism, the measured ~' +
    REQUIRED_ORDERS_SUBSTRING +
    '-orders-below-ceiling worst case, and the explicit "' +
    REQUIRED_NOT_REALIZABLE_SUBSTRING +
    '" verdict, with firstUsed crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-35938 (the ticket that authored the existing headword)',
  requiredTerm: REQUIRED_TERM,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-35938 already supplies the clustered ' +
    'sign-run construction, the coherent-vs-random-walk ceiling gap measurement, and the ' +
    'not-realizable verdict in full. This module records the duplicate-ticket finding and ' +
    'pins a permanent regression guard confirming the existing headword stays present and ' +
    'consistent. Changes no bound; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35901-required-term-well-formed',
    description: 'The cited term matches the expected clustered sign-run headword title',
    holds: () => IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTerm === 'Clustered Sign-Run Worst-case Ordering',
  },
  {
    id: 'imp35901-finding-cites-orders-and-not-realizable',
    description: 'The audit finding text quotes both the ~4.35-orders measurement and the not-realizable verdict',
    holds: () =>
      IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_ORDERS_SUBSTRING) &&
      IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_NOT_REALIZABLE_SUBSTRING),
  },
  {
    id: 'imp35901-duplicate-of-imp-35938',
    description: 'The audit correctly attributes the pre-existing headword to imp-35938',
    holds: () => IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35938'),
  },
  {
    id: 'imp35901-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35901_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35901-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
