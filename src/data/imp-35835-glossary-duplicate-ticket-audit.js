/**
 * @module imp-35835-glossary-duplicate-ticket-audit
 *
 * imp-35835 (content, sonnet-4-6, S-frontier ticket audit): imp-35835 asked to "Add a glossary
 * headword for the imp-35778 two-knob I3 rectangle-floor prescription (delta_short vs
 * delta_long, delta=min of the two, grazing-collapse caveat on the short edges)". Auditing
 * src/data/glossary.js BEFORE writing found this headword ALREADY EXISTS, added by the earlier
 * imp-35819 ticket (glossary.js term "imp-35778 I3 edge-type floor decomposition (delta_short vs
 * delta_long)"), which the anti-starvation frontier scout re-seeded as a near-duplicate title.
 * imp-35835 is a DUPLICATE ticket, not a gap -- this module records the audit finding and pins a
 * permanent regression guard so the pre-existing entry cannot be silently removed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary content (imp-35819 already supplies it in full: the short/long edge
 * split, the delta=min(delta_short,delta_long) identity, and the grazing-collapse caveat living
 * on the short edges). No new claim; changes no bound; NO QED.
 *
 * @see imp-35819 (the completed ticket that actually added the imp-35778 glossary headword)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (the source module the headword documents)
 * @see glossary (src/data/glossary.js -- the array searched)
 */

import { glossary } from './glossary.js';

const REQUIRED_TERM_SUBSTRING = 'imp-35778 I3 edge-type floor decomposition';

export const IMP35835_GLOSSARY_DUPLICATE_TICKET_AUDIT = {
  id: 'imp-35835',
  proofSection: 'S-frontier',
  question:
    'imp-35835 asked to add a glossary headword for the imp-35778 delta_short/delta_long ' +
    'two-knob I3 rectangle-floor prescription; audit whether it already exists before adding a duplicate.',
  finding:
    'DUPLICATE TICKET. The requested headword already exists in glossary.js, added by the ' +
    'earlier completed ticket imp-35819 ("imp-35778 I3 edge-type floor decomposition (delta_short ' +
    'vs delta_long)"), and its text already covers every element imp-35835 asked for: the ' +
    'short-edge on-axis endpoint-placement floor quantizing Delta to ~ the 0.2336 mean gap, the ' +
    'long-edge off-axis h-linear floor via the imp-35777 B proxy, the delta = min(delta_short, ' +
    'delta_long) identity, and the imp-35758 grazing-collapse caveat living on the short edges.',
  duplicateOf: 'imp-35819',
  matchedTerm: glossary.find((e) => e.term.includes(REQUIRED_TERM_SUBSTRING))?.term ?? null,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary content added -- imp-35819 already supplies it verbatim. This ' +
    'module records the duplicate-ticket finding and pins a permanent regression guard confirming ' +
    'the imp-35778 delta_short/delta_long headword stays present in glossary.js. Changes no bound; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35835_GLOSSARY_DUPLICATE_TICKET_AUDIT_ASSERTIONS = [
  {
    id: 'imp35835-headword-already-present',
    description: 'The imp-35778 delta_short/delta_long headword already exists in glossary.js (added by imp-35819)',
    holds: () => glossary.some((e) => e.term.includes(REQUIRED_TERM_SUBSTRING)),
  },
  {
    id: 'imp35835-headword-content-complete',
    description: 'The existing headword covers the split, both edge floors, the min identity, and the grazing caveat',
    holds: () => {
      const entry = glossary.find((e) => e.term.includes(REQUIRED_TERM_SUBSTRING));
      if (!entry) return false;
      const def = entry.definition;
      return (
        /delta_short/.test(def) &&
        /delta_long/.test(def) &&
        /delta = min\(delta_short, delta_long\)/.test(def) &&
        /grazing-collapse/.test(def) &&
        /0\.2336/.test(def)
      );
    },
  },
  {
    id: 'imp35835-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35835_GLOSSARY_DUPLICATE_TICKET_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35835_GLOSSARY_DUPLICATE_TICKET_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35835_GLOSSARY_DUPLICATE_TICKET_AUDIT.verdict),
  },
];

for (const a of IMP35835_GLOSSARY_DUPLICATE_TICKET_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35835-glossary-duplicate-ticket-audit assertion failed: ${a.id}`);
  }
}
