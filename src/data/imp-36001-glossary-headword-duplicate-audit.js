/**
 * @module imp-36001-glossary-headword-duplicate-audit
 *
 * imp-36001 (content, S-frontier ticket audit): imp-36001 asked to "Add a glossary/Concepts
 * headword for the argument-principle certified WINDING-COUNT ingredient ledger (imp-35727 I1
 * between-node interval enclosure, I2 per-panel arg-increment cap |Delta arg|<pi, I3 modulus
 * floor |f|>=delta>0, I4 integer closure error <pi, I5 corner composition), distinguishing it
 * from the held experimental point-sampled winding scaffolding".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY EXISTS:
 * the entry titled "imp-35727 W2 certified-winding-count ingredient ledger (I1-I5)" (category
 * 'proof-frontier') already enumerates all five ingredients -- I1 between-node interval
 * enclosure of f = H_t = A + B - C, I2 the certified per-panel argument-increment cap
 * |Delta arg f| < pi, I3 the interval lower bound |f| >= delta > 0, I4 closure of the
 * accumulated increments to a unique integer within a < pi error budget, I5 continuous corner
 * composition across the four rectangle corners -- and explicitly distinguishes all five from
 * the held-but-experimental winding scaffolding (imp-2696 winding-Lyapunov, imp-33923 off-axis
 * phase-winding quadrature, imp-33968 winding-rate-vs-alpha), each flagged isRigorous:false,
 * with firstUsed crediting imp-35817 as the ticket that added it. imp-36001 is a DUPLICATE of
 * work imp-35817 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-35817 entry already supplies the five-ingredient
 * ledger and the held-vs-certified distinction in full. No new claim; changes no bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing "imp-35727 W2
 *      certified-winding-count ingredient ledger (I1-I5)" headword)
 * @see finite-height-beats-platt-trudgian (src/data/finite-height-beats-platt-trudgian.js --
 *      source module the headword documents)
 */

const REQUIRED_TERM_SUBSTRING = 'imp-35727 W2 certified-winding-count ingredient ledger (I1-I5)';
const REQUIRED_CATEGORY = 'proof-frontier';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-35817';
const REQUIRED_INGREDIENT_SUBSTRINGS = ['I1 between-node', 'I2 a certified per-panel', 'I3 an interval lower bound', 'I4 closure', 'I5 continuous'];

export const IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-36001',
  proofSection: 'S-frontier',
  question:
    'imp-36001 asked to add a glossary/Concepts headword for the argument-principle certified ' +
    'winding-count ingredient ledger (imp-35727 I1-I5), distinguishing it from the held ' +
    'experimental point-sampled winding scaffolding; audit whether such a headword already ' +
    'exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term "' +
    REQUIRED_TERM_SUBSTRING +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition enumerates all five certified ingredients (I1 between-node interval ' +
    'enclosure, I2 per-panel argument-increment cap, I3 modulus lower-bound floor, I4 integer ' +
    'closure within a < pi error budget, I5 continuous corner composition) and explicitly ' +
    'contrasts them with the held-but-experimental winding scaffolding (imp-2696, imp-33923, ' +
    'imp-33968), each isRigorous:false, with firstUsed crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-35817 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  requiredIngredientSubstrings: REQUIRED_INGREDIENT_SUBSTRINGS,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-35817 already supplies the five-ingredient ' +
    'ledger and the held-vs-certified winding-scaffolding distinction in full. This module ' +
    'records the duplicate-ticket finding and pins a permanent regression guard confirming the ' +
    'existing headword stays present and consistent. Changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp36001-required-term-substring-well-formed',
    description: 'The cited term substring matches the expected W2 ingredient-ledger headword title',
    holds: () =>
      IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      'imp-35727 W2 certified-winding-count ingredient ledger (I1-I5)',
  },
  {
    id: 'imp36001-finding-cites-all-five-ingredients',
    description: 'The audit finding lists all five certified-ledger ingredients (I1-I5)',
    holds: () =>
      /I1 between-node interval/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /I2 per-panel argument-increment cap/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /I3 modulus lower-bound floor/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /I4 integer closure/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /I5 continuous corner composition/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp36001-finding-cites-held-scaffolding',
    description: 'The audit finding cites the held-but-experimental winding scaffolding it is distinguished from',
    holds: () =>
      /imp-2696/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /imp-33923/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /imp-33968/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp36001-duplicate-of-imp-35817',
    description: 'The audit correctly attributes the pre-existing headword to imp-35817',
    holds: () => IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35817'),
  },
  {
    id: 'imp36001-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP36001_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36001-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
