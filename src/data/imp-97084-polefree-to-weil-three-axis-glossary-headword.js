/** Historical export/key retained; the three-independent-axes claim is withdrawn. */
import { IMP97049_EXHAUSTIVENESS as audit } from './imp-97049-polefree-to-weil-obstruction-enumeration.js';

export const IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97084', proofSection: 'S-frontier', glosses: 'imp-97049',
  question: audit.question,
  headword: Object.freeze({
    key: 'polefree-to-weil-three-orthogonal-obstruction-axes-not-two-named-blockers',
    term: 'Correction: all-support pole-free positivity is already an RH criterion',
    definition: 'REACH must cover all compact smooth tests on unbounded supports, with every contributing prime power included. POLE TERM extension at fixed support is optional. CRITERION COMPLETENESS follows from that coverage without a uniform positive margin.',
    mechanism: 'A finite support range does not establish RH. Proving positivity for every finite support does; no separate limiting barrier remains.',
    verificationStatus: 'Corrected from Connes--Consani Appendix C, Proposition C.1; no bound moved.',
  }),
  anyBoundMoved: false, verdict: audit.subGap, citation: audit.reference,
});
export default IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD;

export const IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD_ASSERTIONS = [
  { id: 'imp97084-withdrawn-extra-axes',
    why: 'The glossary follows the corrected criterion, not the withdrawn three-axis claim.',
    holds: () => !audit.axisIIIhasProvenNoGoAgainstSoftClosure && audit.additionalIndependentAxes.length === 0 },
  { id: 'imp97084-no-new-bound', why: 'Criterion correction supplies no positivity certificate.',
    holds: () => IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD.anyBoundMoved === false },
];
