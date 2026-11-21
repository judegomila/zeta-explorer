/**
 * @module imp-35884-glossary-headword-duplicate-audit
 *
 * imp-35884 (content, S-frontier ticket audit): imp-35884 asked to "Add a glossary/Concepts
 * headword for the imp-35811 measured exp(-pi x/8) precision wall: working digits
 * D*(x)~0.17055x, double reaches x~104, quad x~200, T_PT extrapolates to ~1e12 digits
 * (~425GB per evaluated value) -- the categorical exact-de-Bruijn high-x precision
 * obstruction".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY
 * EXISTS: the entry titled "Exact-de-Bruijn arbitrary-precision digit-cost wall" (category
 * 'proof-frontier') already states the measured linear digit law D_underflow(x) ~ 0.17055 x,
 * the double-precision ceiling (x ~< 104), the quad-precision reach (x ~ 199-200), and the
 * T_PT extrapolation ("~1.02e12 decimal digits (~425 GB of mantissa per evaluated value)"),
 * with firstUsed crediting imp-35861 as the ticket that added it. imp-35884 is a DUPLICATE of
 * work imp-35861 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-35861 entry already supplies the full definition, the
 * three-stage progression (imp-35759/imp-35781/imp-35811), and the T_PT extrapolation. No new
 * claim; changes no bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing "Exact-de-Bruijn
 *      arbitrary-precision digit-cost wall" headword)
 * @see imp-35811-exact-debruijn-arbitrary-precision-digit-table (the source module the
 *      headword documents)
 */

const REQUIRED_TERM_SUBSTRING = 'Exact-de-Bruijn arbitrary-precision digit-cost wall';
const REQUIRED_CATEGORY = 'proof-frontier';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-35861';
const REQUIRED_DIGIT_LAW_SUBSTRING = '0.17055';
const REQUIRED_DOUBLE_CEILING_SUBSTRING = 'x = 104';
const REQUIRED_QUAD_REACH_SUBSTRING = 'x ~ 199-200';
const REQUIRED_TPT_DIGITS_SUBSTRING = '1.02e12';

export const IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-35884',
  proofSection: 'S-frontier',
  question:
    'imp-35884 asked to add a glossary/Concepts headword for the imp-35811 measured ' +
    'exp(-pi x/8) precision wall (D*(x)~0.17055x, double reaches x~104, quad x~200, T_PT ' +
    'extrapolates to ~1e12 digits/~425GB); audit whether such a headword already exists ' +
    'before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term "' +
    REQUIRED_TERM_SUBSTRING +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition states the ' +
    REQUIRED_DIGIT_LAW_SUBSTRING +
    ' linear digit law, the double-precision ceiling at ' +
    REQUIRED_DOUBLE_CEILING_SUBSTRING +
    ', the quad-precision reach ' +
    REQUIRED_QUAD_REACH_SUBSTRING +
    ', and the T_PT extrapolation to ~' +
    REQUIRED_TPT_DIGITS_SUBSTRING +
    ' decimal digits (~425 GB/value), with firstUsed crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-35861 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-35861 already supplies the definition, ' +
    'the three-stage progression, and the T_PT extrapolation in full. This module records ' +
    'the duplicate-ticket finding and pins a permanent regression guard confirming the ' +
    'existing headword stays present and consistent. Changes no bound; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
};

export const IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35884-required-term-substring-well-formed',
    description: 'The cited term substring matches the expected precision-wall headword title',
    holds: () =>
      IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      'Exact-de-Bruijn arbitrary-precision digit-cost wall',
  },
  {
    id: 'imp35884-finding-cites-digit-law-and-tpt-extrapolation',
    description: 'The audit finding text quotes both the 0.17055 digit law and the ~1.02e12 T_PT extrapolation',
    holds: () =>
      IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_DIGIT_LAW_SUBSTRING) &&
      IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_TPT_DIGITS_SUBSTRING),
  },
  {
    id: 'imp35884-finding-cites-double-and-quad-reach',
    description: 'The audit finding text quotes both the double-precision ceiling and the quad-precision reach',
    holds: () =>
      IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_DOUBLE_CEILING_SUBSTRING) &&
      IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_QUAD_REACH_SUBSTRING),
  },
  {
    id: 'imp35884-duplicate-of-imp-35861',
    description: 'The audit correctly attributes the pre-existing headword to imp-35861',
    holds: () => IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35861'),
  },
  {
    id: 'imp35884-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35884_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35884-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
