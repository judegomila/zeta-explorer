/**
 * @module imp-35980-representability-cliff-glossary-duplicate-audit
 *
 * imp-35980 (content, S-frontier ticket audit): imp-35980 asked to "Add a glossary/Concepts
 * headword for the REPRESENTABILITY CLIFF of the RvM height inverse effectiveHeightForN (hard
 * +Infinity overflow at N~10^307.46, T>MAX_VALUE) as distinct from a conditioning ramp (imp-35892)".
 *
 * Auditing src/data/glossary.js BEFORE writing a new headword found this ALREADY DELIVERED:
 * glossary.js already carries the term "Representability Cliff of the RvM Height Inverse T(N):
 * the double-precision N ~ 10^307.46 hard NaN boundary of effectiveHeightForN, distinct from a
 * soft conditioning ramp" (firstUsed: imp-35961), with a WHAT-THE-CLIFF-IS / WHY-IT-IS-A-CLIFF-
 * NOT-A-RAMP / HOW-TO-APPLY / HONEST-SCOPE definition covering exactly the imp-35980 request.
 * imp-35980 is a DUPLICATE ticket the anti-starvation frontier scout re-seeded from the same
 * imp-35892 gap description before (or concurrently with) imp-35961 landing.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary headword -- imp-35961 already supplies the term, definition, firstUsed
 * attribution, and relatedTerms. No new numerics; no new claim; changes no bound; NO QED. This
 * module imports the pre-existing glossary.js export and pins a permanent regression guard that
 * the imp-35980-requested headword stays delivered and does not silently regress or get renamed.
 *
 * @see glossary (the pre-existing glossary array carrying the imp-35961 headword)
 * @see imp-35892-rdirect-own-floor-departure-height (source measurement the headword names)
 * @see imp-35978-rdirect-floor-viz-duplicate-audit (sibling duplicate-ticket audit pattern)
 */

import { glossary } from './glossary.js';

const CLIFF_TERM = glossary.find(
  (t) => typeof t.term === 'string' && t.term.startsWith('Representability Cliff of the RvM Height Inverse')
);

export const IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT = {
  id: 'imp-35980',
  proofSection: 'S-frontier',
  question:
    'imp-35980 asked to add a glossary/Concepts headword for the representability cliff of the ' +
    'RvM height inverse effectiveHeightForN (hard +Infinity overflow at N~10^307.46, T>MAX_VALUE) ' +
    'as distinct from a conditioning ramp; audit whether that headword already exists before ' +
    'writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries the term "Representability Cliff of the RvM ' +
    'Height Inverse T(N): the double-precision N ~ 10^307.46 hard NaN boundary of ' +
    'effectiveHeightForN, distinct from a soft conditioning ramp" (firstUsed: imp-35961), whose ' +
    'definition explicitly distinguishes the hard overflow-to-NaN cliff from a soft conditioning ' +
    'ramp -- exactly the imp-35980 request.',
  duplicateOf: 'imp-35961 (the ticket that authored the pre-existing representability-cliff glossary headword)',
  deliveredCategory: CLIFF_TERM ? CLIFF_TERM.category : null,
  deliveredFirstUsed: CLIFF_TERM ? CLIFF_TERM.firstUsed : null,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary headword added -- imp-35961 already supplies the term, the ' +
    'hard-cliff-vs-soft-ramp distinction, and the imp-35892 attribution. This module records the ' +
    'duplicate-ticket finding and pins a permanent regression guard confirming the delivered ' +
    'headword stays present and consistent. Presentation-only; changes no bound; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35980-headword-exists',
    description: 'The representability-cliff headword is present in GLOSSARY_TERMS',
    holds: () => !!CLIFF_TERM,
  },
  {
    id: 'imp35980-headword-attributed-to-imp-35961',
    description: 'The delivered headword firstUsed attributes it to imp-35961',
    holds: () => !!CLIFF_TERM && /imp-35961/.test(CLIFF_TERM.firstUsed),
  },
  {
    id: 'imp35980-headword-distinguishes-cliff-from-ramp',
    description: 'The delivered definition explicitly contrasts a hard cliff with a soft conditioning ramp',
    holds: () =>
      !!CLIFF_TERM &&
      /conditioning ramp/i.test(CLIFF_TERM.definition) &&
      /10\^307\.46|10\^307/.test(CLIFF_TERM.term),
  },
  {
    id: 'imp35980-duplicate-of-imp-35961',
    description: 'The audit correctly attributes the pre-existing headword to imp-35961',
    holds: () => IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35961'),
  },
  {
    id: 'imp35980-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT.verdict) &&
      /GUE-conditional/.test(IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35980_REPRESENTABILITY_CLIFF_GLOSSARY_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35980-representability-cliff-glossary-duplicate-audit assertion failed: ${a.id}`);
  }
}
