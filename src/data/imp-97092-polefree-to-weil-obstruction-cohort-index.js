/** Corrected cohort index: read the primary criterion before the historical claims. */
import { IMP97049_OBSTRUCTION_AXES as axes, IMP97049_EXHAUSTIVENESS as audit } from './imp-97049-polefree-to-weil-obstruction-enumeration.js';

export const IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX = Object.freeze({
  id: 'imp-97092', proofSection: 'S-frontier',
  cohort: Object.freeze([
    { id: 'imp-97036', role: 'Historical local obstruction assessment', result: 'Retain LP conditioning and the Rayleigh direction warning; its pole-inclusive requirement is superseded by the criterion correction.' },
    { id: 'imp-97049', role: 'Corrected RH target', result: audit.subGap },
    { id: 'rh-route-i-sonine-excess-semilocal-port-2026-09-23', role: 'Specific sufficient inequality', result: 'Failure of this Sonine/excess inequality is scoped to this construction, not every positivity mechanism.' },
    { id: 'flow-blindness-no-go', role: 'Conditional-class no-go', result: 'Only hypothesis classes containing the backward heat deformations are excluded. No general prohibition on analytic estimates or all-support proofs follows.' },
  ]),
  axisI: axes[0].name, axisII: axes[1].name, axisIII: axes[2].name,
  certifiedReach: 0.96,
  question: audit.question, anyBoundMoved: false,
  verdict: audit.subGap, citation: audit.reference,
  ln2: Math.log(2), ln3: Math.log(3),
});
export default IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX;

export const IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX_ASSERTIONS = [
  { id: 'imp97092-cohort-has-four-members', why: 'Historical cross-references remain navigable.',
    holds: () => IMP97092_POLEFREE_TO_WEIL_OBSTRUCTION_COHORT_INDEX.cohort.length === 4 },
  { id: 'imp97092-no-extra-rh-prerequisite', why: 'The all-support pole-free criterion must not acquire an optional pole-extension prerequisite.',
    holds: () => axes[1].requiredForRH === false && axes[2].carriesProvenNoGo === false },
];
