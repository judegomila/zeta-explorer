/**
 * @module imp-35839-glossary-duplicate-ticket-audit
 *
 * imp-35839 (content, sonnet-4-6, S-frontier ticket audit): imp-35839 asked to "Add a glossary
 * headword for the imp-35777 I2<->I3 coupling identity L_panel < pi.delta/B: the per-panel
 * argument-increment cap and the modulus floor are the SAME winding-certificate obstruction read
 * two ways (sup|f prime/f| <= B/delta), so a certificate cannot budget I2 panel resolution and I3
 * floor independently". Auditing src/data/glossary.js BEFORE writing found this headword ALREADY
 * EXISTS, added by the earlier imp-35818 ticket (glossary.js term "imp-35777 I2<->I3
 * log-derivative panel-cap coupling"), which the anti-starvation frontier scout re-seeded as a
 * near-duplicate title. imp-35839 is a DUPLICATE ticket, not a gap -- this module records the
 * audit finding and pins a permanent regression guard so the pre-existing entry cannot be
 * silently removed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary content (imp-35818 already supplies it in full: the coupling identity
 * L_panel < pi.delta/B, the robust-regime recovery B/delta ~ w(T_PT) ~ 13.446 => L_panel ~ 0.2336,
 * and the unbounded panel-count amplification where the I3 floor collapses). No new claim;
 * changes no bound; NO QED.
 *
 * @see imp-35818 (the completed ticket that actually added the imp-35777 glossary headword)
 * @see imp-35777 (the source module the headword documents)
 * @see glossary (src/data/glossary.js -- the array searched)
 */

import { glossary } from './glossary.js';

const REQUIRED_TERM_SUBSTRING = 'imp-35777 I2<->I3 log-derivative panel-cap coupling';

export const IMP35839_GLOSSARY_DUPLICATE_TICKET_AUDIT = {
  id: 'imp-35839',
  proofSection: 'S-frontier',
  question:
    'imp-35839 asked to add a glossary headword for the imp-35777 I2<->I3 coupling identity ' +
    'L_panel < pi.delta/B; audit whether it already exists before adding a duplicate.',
  finding:
    'DUPLICATE TICKET. The requested headword already exists in glossary.js, added by the ' +
    'earlier completed ticket imp-35818 ("imp-35777 I2<->I3 log-derivative panel-cap coupling"), ' +
    'and its text already covers every element imp-35839 asked for: the coupling identity ' +
    'L_panel < pi . delta / B derived from sup|f prime/f| <= B/delta, the robust-regime recovery ' +
    'B/delta ~ w(T_PT) ~ 13.446 giving L_panel ~ 0.2336 (matching the imp-35757 mean zero gap), ' +
    'and the unbounded panel-count amplification where the I3 floor collapses toward a grazing zero.',
  duplicateOf: 'imp-35818',
  matchedTerm: glossary.find((e) => e.term.includes(REQUIRED_TERM_SUBSTRING))?.term ?? null,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary content added -- imp-35818 already supplies it verbatim. This ' +
    'module records the duplicate-ticket finding and pins a permanent regression guard confirming ' +
    'the imp-35777 I2<->I3 coupling headword stays present in glossary.js. Changes no bound; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35839_GLOSSARY_DUPLICATE_TICKET_AUDIT_ASSERTIONS = [
  {
    id: 'imp35839-headword-already-present',
    description: 'The imp-35777 I2<->I3 coupling headword already exists in glossary.js (added by imp-35818)',
    holds: () => glossary.some((e) => e.term.includes(REQUIRED_TERM_SUBSTRING)),
  },
  {
    id: 'imp35839-headword-content-complete',
    description: 'The existing headword covers the coupling identity, the robust-regime recovery, and the amplification',
    holds: () => {
      const entry = glossary.find((e) => e.term.includes(REQUIRED_TERM_SUBSTRING));
      if (!entry) return false;
      const def = entry.definition;
      return (
        /L_panel < pi \. delta \/ B/.test(def) &&
        /sup_panel/.test(def) &&
        /0\.2336/.test(def) &&
        /13\.446/.test(def)
      );
    },
  },
  {
    id: 'imp35839-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35839_GLOSSARY_DUPLICATE_TICKET_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35839_GLOSSARY_DUPLICATE_TICKET_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35839_GLOSSARY_DUPLICATE_TICKET_AUDIT.verdict),
  },
];

for (const a of IMP35839_GLOSSARY_DUPLICATE_TICKET_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35839-glossary-duplicate-ticket-audit assertion failed: ${a.id}`);
  }
}
