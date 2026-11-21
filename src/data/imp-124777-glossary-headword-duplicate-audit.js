/**
 * @module imp-124777-glossary-headword-duplicate-audit
 *
 * imp-124777 (content, S-frontier ticket audit): imp-124777 asked to "Add a Concepts glossary
 * headword for the imp-97823 reconstruction-kernel inverse-square-root fold law |K|~g^{-1/2}
 * (sqrt(10) per decade of gap near the sigma peak)".
 *
 * Auditing the existing glossary-headword modules BEFORE writing a new entry found the requested
 * headword ALREADY EXISTS: imp-97842 (src/data/imp-97842-kernel-decade-growth-sqrt10-glossary-
 * headword.js) already carries the term "Inverse-square-root kernel-fold law: the reconstruction
 * kernel |K| = |1/(N sigma_N)| grows exactly sqrt(10) per decade of gap approaching the imp-97520
 * L1 sigma peak" -- stating the same quadratic-fold derivation |K| = 1/(2 sqrt(A) sqrt(g)) ~
 * g^(-1/2), the same sqrt(10) = 3.162278 per-decade constant, and the same imp-97823 deep-window
 * fit slopes (-0.4994 upslope / -0.5006 downslope, residual ~4e-4). imp-124777 is a DUPLICATE of
 * work imp-97842 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new glossary entry -- the imp-97842 module already supplies the |K|~g^{-1/2}
 * inverse-square-root fold law headword, its quadratic-fold origin, and the sqrt(10)-per-decade
 * consequence in full. No new claim; changes no bound; NO QED.
 *
 * @see imp-97842-kernel-decade-growth-sqrt10-glossary-headword (src/data/imp-97842-kernel-decade-
 *      growth-sqrt10-glossary-headword.js -- holds the pre-existing headword)
 * @see imp-97823-kernel-decade-growth-sqrt10 (src/data/imp-97823-kernel-decade-growth-sqrt10.js --
 *      source measurement module the headword documents)
 */

import { IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD } from './imp-97842-kernel-decade-growth-sqrt10-glossary-headword.js';

const REQUIRED_TERM_SUBSTRING =
  'Inverse-square-root kernel-fold law: the reconstruction kernel |K| = |1/(N sigma_N)| grows ' +
  'exactly sqrt(10) per decade of gap approaching the imp-97520 L1 sigma peak';
const REQUIRED_GLOSSES = 'imp-97823';
const REQUIRED_CONTRAST_SUBSTRINGS = ['3.162278', 'g^(-1/2)', '-0.4994', '-0.5006'];

export const IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT = {
  id: 'imp-124777',
  proofSection: 'S-frontier',
  question:
    'imp-124777 asked to add a Concepts glossary headword for the imp-97823 reconstruction-' +
    'kernel inverse-square-root fold law |K|~g^{-1/2} (sqrt(10) per decade of gap near the sigma ' +
    'peak); audit whether such a headword already exists before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. imp-97842-kernel-decade-growth-sqrt10-glossary-headword.js already ' +
    'carries a headword (term "' +
    REQUIRED_TERM_SUBSTRING +
    '") whose definition states the identical quadratic-fold derivation |K| = ' +
    '1/(2 sqrt(A) sqrt(g)) ~ g^(-1/2) and the identical sqrt(10) = 3.162278 per-decade constant, ' +
    'and already cites the exact imp-97823 deep-window fit slopes (-0.4994 upslope / -0.5006 ' +
    'downslope, log-linear residual ~4e-4), with glosses crediting ' +
    REQUIRED_GLOSSES +
    ' as the source measurement this headword names.',
  duplicateOf: 'imp-97842 (the ticket that authored the existing headword)',
  requiredTermSubstring: REQUIRED_TERM_SUBSTRING,
  requiredGlosses: REQUIRED_GLOSSES,
  requiredContrastSubstrings: REQUIRED_CONTRAST_SUBSTRINGS,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new glossary entry added -- imp-97842 already supplies the |K|~g^{-1/2} ' +
    'inverse-square-root fold law headword, its quadratic-fold origin, and the sqrt(10)-per-' +
    'decade consequence in full. This module records the duplicate-ticket finding and pins a ' +
    'permanent regression guard confirming the existing headword stays present and consistent. ' +
    'Changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp124777-required-term-substring-well-formed',
    description: 'The cited term substring matches the existing imp-97842 headword title exactly',
    holds: () =>
      IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredTermSubstring ===
      IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD.headword.term,
  },
  {
    id: 'imp124777-finding-cites-fold-law-and-constant',
    description: 'The audit finding cites the g^(-1/2) fold law and the sqrt(10) = 3.162278 constant',
    holds: () =>
      /g\^\(-1\/2\)/.test(IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /3\.162278/.test(IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp124777-finding-cites-deep-window-slopes',
    description: 'The audit finding cites the imp-97823 deep-window fit slopes (-0.4994 / -0.5006)',
    holds: () =>
      /-0\.4994/.test(IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding) &&
      /-0\.5006/.test(IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.finding),
  },
  {
    id: 'imp124777-duplicate-of-imp-97842',
    description: 'The audit correctly attributes the pre-existing headword to imp-97842',
    holds: () => IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-97842'),
  },
  {
    id: 'imp124777-existing-headword-glosses-imp-97823',
    description: 'The existing imp-97842 headword glosses imp-97823, matching this ticket’s target',
    holds: () =>
      IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD.glosses ===
      IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.requiredGlosses,
  },
  {
    id: 'imp124777-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP124777_GLOSSARY_HEADWORD_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124777-glossary-headword-duplicate-audit assertion failed: ${a.id}`);
  }
}
