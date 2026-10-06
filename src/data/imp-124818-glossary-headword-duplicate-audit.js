/**
 * @module imp-124818-glossary-headword-duplicate-audit
 *
 * imp-124818 (content, S-frontier ticket audit): imp-124818 asked to "Add a Concepts glossary
 * headword for the imp-124769 E_CF stencil crossover: |E_CF|_crit~1.4e-6 / sigma_crit~0.013
 * between L5 and L6 where landmark-bisection round-off overtakes O(eps^2) truncation".
 *
 * Auditing the existing glossary-headword modules BEFORE writing a new entry found the requested
 * headword ALREADY EXISTS: imp-124802 (src/data/imp-124802-ecf-noise-floor-crossover-glossary-
 * headword.js) already carries the term "imp-124769 E_CF stencil noise-floor crossover:
 * |E_CF|_crit ~ 1.4e-6 / sigma_crit ~ 0.013, between L5 and L6, where the direct
 * central-difference elasticity error switches from O(eps^2) truncation to landmark-bisection
 * round-off" -- naming the identical pinned magnitude |E_CF|_crit ~ 1.4e-6, the identical
 * sigma_crit ~ 0.013, the identical bracketing landmarks L5/L6, and the identical mechanism
 * (relative O(eps^2) truncation plateau relTrunc ~ 3.3e-7 overtaken by the landmark-bisection
 * round-off floor R ~ 4.5e-13). imp-124818 is a DUPLICATE of work imp-124802 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-124802 module already supplies the imp-124769 E_CF
 * stencil crossover headword, its truncation-vs-round-off mechanism, and the pinned crossover
 * magnitude/sigma in full. No new claim; changes no bound; NO QED.
 *
 * @see imp-124802-ecf-noise-floor-crossover-glossary-headword (src/data/imp-124802-ecf-noise-
 *      floor-crossover-glossary-headword.js -- holds the pre-existing headword)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (src/data/imp-124769-ecf-stencil-noise-floor-
 *      crossover.js -- source measurement module the headword documents)
 */

import { IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD } from './imp-124802-ecf-noise-floor-crossover-glossary-headword.js';

const REQUIRED_TERM_SUBSTRING =
  'imp-124769 E_CF stencil noise-floor crossover: |E_CF|_crit ~ 1.4e-6 / sigma_crit ~ 0.013, ' +
  'between L5 and L6, where the direct central-difference elasticity error switches from ' +
  'O(eps^2) truncation to landmark-bisection round-off';
const REQUIRED_GLOSSES = 'imp-124769';
const REQUIRED_CONTRAST_SUBSTRINGS = ['1.4e-6', '0.013', '3.3e-7', '4.5e-13'];

export const IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-124818',
  proofSection: 'S-frontier',
  question:
    'imp-124818 asked to add a Concepts glossary headword for the imp-124769 E_CF stencil ' +
    'crossover (|E_CF|_crit ~ 1.4e-6 / sigma_crit ~ 0.013 between L5 and L6 where landmark-' +
    'bisection round-off overtakes O(eps^2) truncation); audit whether such a headword already ' +
    'exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-124802-ecf-noise-floor-crossover-glossary-headword.js already ' +
    'carries a headword (term "' +
    REQUIRED_TERM_SUBSTRING +
    '") whose definition states the identical pinned crossover magnitude |E_CF|_crit ~ 1.4e-6 ' +
    'and sigma_crit ~ 0.013, the identical bracketing landmarks L5/L6, and the identical ' +
    'truncation-vs-round-off mechanism (relTrunc ~ 3.3e-7 plateau overtaken by the round-off ' +
    'floor R ~ 4.5e-13), with glosses crediting ' +
    REQUIRED_GLOSSES +
    ' as the source measurement this headword names.',
  duplicateOf: 'imp-124802 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredGlosses: REQUIRED_GLOSSES,
  requiredContrastSubstrings: REQUIRED_CONTRAST_SUBSTRINGS,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-124802 already supplies the imp-124769 E_CF ' +
    'stencil noise-floor crossover headword, its truncation-vs-round-off mechanism, and the ' +
    'pinned |E_CF|_crit/sigma_crit values in full. This module records the duplicate-ticket ' +
    'finding and pins a permanent regression guard confirming the existing headword stays ' +
    'present and consistent. Changes no bound; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
};

export const IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp124818-required-term-substring-well-formed',
    description: 'The cited term substring matches the existing imp-124802 headword title exactly',
    holds: () =>
      IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.headword.term,
  },
  {
    id: 'imp124818-finding-cites-crossover-magnitude-and-sigma',
    description: 'The audit finding cites the |E_CF|_crit ~ 1.4e-6 magnitude and sigma_crit ~ 0.013',
    holds: () =>
      /1\.4e-6/.test(IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /0\.013/.test(IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp124818-finding-cites-truncation-and-roundoff-constants',
    description: 'The audit finding cites the relTrunc ~ 3.3e-7 plateau and the round-off floor R ~ 4.5e-13',
    holds: () =>
      /3\.3e-7/.test(IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /4\.5e-13/.test(IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp124818-duplicate-of-imp-124802',
    description: 'The audit correctly attributes the pre-existing headword to imp-124802',
    holds: () => IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-124802'),
  },
  {
    id: 'imp124818-existing-headword-glosses-imp-124769',
    description: 'The existing imp-124802 headword glosses imp-124769, matching this ticket’s target',
    holds: () =>
      IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.glosses ===
      IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredGlosses,
  },
  {
    id: 'imp124818-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; PT Lambda<=0.2 SOTA',
    holds: () =>
      IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /remains SOTA/.test(IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP124818_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124818-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
