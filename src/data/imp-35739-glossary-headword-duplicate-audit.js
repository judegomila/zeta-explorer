/**
 * @module imp-35739-glossary-headword-duplicate-audit
 *
 * imp-35739 (content, S-frontier ticket audit): imp-35739 asked to "Add a glossary/reference
 * headword for the imp-35538 five route-(i) derivation requirements (REQ-1 C_H provenance,
 * REQ-2 explicit-rate GUE local law, REQ-3 restricted->full Fourier support, REQ-4 e^200 height
 * regime, REQ-5 imp-486 conditionality) as a single named obstruction ladder".
 *
 * Auditing glossary.js BEFORE writing a new entry found the requested headword ALREADY EXISTS:
 * the entry titled "imp-35538 route-(i) finite-N remainder: the five derivation requirements"
 * (category 'concept') already catalogs all five requirements as a single named ladder --
 * REQ 1 (effective C_H = 1/8 provenance, the definitional prerequisite), REQ 2 (explicit-rate GUE
 * local law E_GUE(T0), the binding crux since Montgomery/Rudnick-Sarnak are asymptotic-only),
 * REQ 3 (restricted -> full Fourier-support upgrade, conjectural), REQ 4 (the log T0 >= 200,
 * T0 >= e^200 height regime), and REQ 5 (unavoidable imp-486 conditionality) -- with firstUsed
 * crediting imp-35570 as the ticket that added it. imp-35739 is a DUPLICATE of work imp-35570
 * already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-35570 entry already supplies the full five-requirement
 * catalog, the REQ 2 binding-crux framing, the e^200 height threshold, and cross-references to
 * imp-35493/imp-35551/imp-35475/imp-486. No new claim; changes no bound; NO QED.
 *
 * @see glossary (src/data/glossary.js -- holds the pre-existing imp-35538 five-requirements headword)
 * @see imp-35538-route-i-remainder-derivation-requirements (the source module the headword documents)
 * @see imp-35738-glossary-headword-duplicate-audit (companion duplicate-ticket audit, same pattern)
 */

const REQUIRED_TERM = 'imp-35538 route-(i) finite-N remainder: the five derivation requirements';
const REQUIRED_CATEGORY = 'concept';
const REQUIRED_FIRST_USED_SUBSTRING = 'imp-35570';
const REQUIRED_LADDER_SUBSTRING = 'REQ 1-5';
const REQUIRED_CRUX_SUBSTRING = 'REQ 2';
const REQUIRED_HEIGHT_SUBSTRING = 'e^200';

export const IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-35739',
  proofSection: 'S-frontier',
  question:
    'imp-35739 asked to add a glossary/reference headword for the imp-35538 five route-(i) ' +
    'derivation requirements (REQ-1..REQ-5) as a single named obstruction ladder; audit whether ' +
    'such a headword already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. glossary.js already carries a headword (term "' +
    REQUIRED_TERM +
    '", category ' +
    REQUIRED_CATEGORY +
    ') whose definition catalogs all five requirements ' +
    REQUIRED_LADDER_SUBSTRING +
    ' as a single ladder, names ' +
    REQUIRED_CRUX_SUBSTRING +
    ' (explicit-rate GUE local law) as the binding crux, states the ' +
    REQUIRED_HEIGHT_SUBSTRING +
    ' height threshold, and cross-links imp-35493/imp-35551/imp-35475/imp-486, with firstUsed ' +
    'crediting ' +
    REQUIRED_FIRST_USED_SUBSTRING +
    ' as the ticket that authored it.',
  duplicateOf: 'imp-35570 (the ticket that authored the existing headword)',
  requiredTerm: REQUIRED_TERM,
  requiredCategory: REQUIRED_CATEGORY,
  requiredFirstUsedSubstring: REQUIRED_FIRST_USED_SUBSTRING,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-35570 already supplies the full five-' +
    'requirement catalog as a single named obstruction ladder. This module records the ' +
    'duplicate-ticket finding and pins a permanent regression guard confirming the existing ' +
    'headword stays present and consistent. Changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35739-required-term-well-formed',
    description: 'The cited term matches the expected imp-35538 five-requirements headword exactly',
    holds: () =>
      IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTerm ===
      'imp-35538 route-(i) finite-N remainder: the five derivation requirements',
  },
  {
    id: 'imp35739-finding-cites-ladder-crux-and-height',
    description: 'The audit finding text quotes the REQ 1-5 ladder span, the REQ 2 binding crux, and the e^200 height threshold',
    holds: () =>
      IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_LADDER_SUBSTRING) &&
      IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_CRUX_SUBSTRING) &&
      IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding.includes(REQUIRED_HEIGHT_SUBSTRING),
  },
  {
    id: 'imp35739-duplicate-of-imp-35570',
    description: 'The audit correctly attributes the pre-existing headword to imp-35570',
    holds: () => IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35570'),
  },
  {
    id: 'imp35739-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35739_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35739-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
