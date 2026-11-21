/**
 * @module imp-95084-slab-44-certification-checklist
 *
 * imp-95084 (content, sonnet-4-6): render the imp-95046 SLAB_CERTIFICATION_REQUIREMENTS
 * (four items) as an explicit CONDITIONAL-TARGET checklist for hypothesis (a) of
 * Theorem 4.5 -- the rectangular slab (4.4) -- rather than leaving the requirement
 * list embedded only in the imp-95046 module body.
 *
 * Documentation only. Restates the four imp-95046 requirements verbatim as checklist
 * items; adds no new math, discharges no requirement, closes no gap. The frozen
 * imp-95012 spec discharges NONE of the four; the slab hypothesis stays an
 * INDEPENDENT-CONDITIONAL-TARGET. NO QED; no refereed bound is changed.
 *
 * @see imp-95046 (source: SLAB_CERTIFICATION_REQUIREMENTS, this module's only input)
 * @see imp-95012 (frozen spec ROW_01399_DECISION that discharges none of the four)
 * @see imp-95047 (the directed final-time tail, hypothesis (b), tracked separately)
 */

import {
  SLAB_CERTIFICATION_REQUIREMENTS as SOURCE,
  IMP95046_SLAB_44_TARGET,
} from './imp-95046-slab-44-conditional-target.js';

// The four requirements, restated as an explicit conditional-target checklist item
// each: what closing this item would require, and its current (undischarged) state.
const CHECKLIST = Object.freeze(
  SOURCE.map((req) =>
    Object.freeze({
      key: req.key,
      conditionalTarget: req.what,
      dischargedBySpec: req.dischargedBySpec,
      status: 'OPEN -- not discharged by the frozen imp-95012 spec',
    })
  )
);

export const IMP95084_SLAB_44_CERTIFICATION_CHECKLIST = {
  id: 'imp-95084',
  proofSection: 'S-frontier',
  question:
    'Render the four imp-95046 SLAB_CERTIFICATION_REQUIREMENTS as an explicit conditional-target ' +
    'checklist for hypothesis (a) of Theorem 4.5 (the rectangular slab (4.4)). Documentation only; ' +
    'no requirement is discharged; NO QED.',
  checklist: CHECKLIST,
  allOpen: CHECKLIST.every((item) => item.dischargedBySpec === false),
  isRigorous: false,
  verdict:
    'CONDITIONAL-TARGET CHECKLIST ONLY (navigation, not rigorous). The four imp-95046 requirements -- ' +
    '(i) a rigorous box-nonvanishing evaluator for H_tau on the closed box, (ii) the quantitative ' +
    'Lemma 4.4 inheritance hypotheses (only the wedge+join conclusion is transcribed in imp-95012), ' +
    '(iii) provenance for the larger compact slab routed through external preprint [20] (flagged ' +
    'not-an-antecedent), and (iv) the short-join u-width matching the tail-lane band ' +
    'y* <= v <= sqrt(1 - 2 t*) -- are laid out here as a checklist. The frozen imp-95012 spec ' +
    'discharges NONE of them, so hypothesis (a) of Theorem 4.5 stays an independent conditional ' +
    'target. This module restates the imp-95046 requirement text verbatim; it discharges no ' +
    'requirement, instantiates no interval, and changes no bound. NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-95046 (SLAB_CERTIFICATION_REQUIREMENTS, this module’s only source); imp-95012 ' +
    '(frozen spec ROW_01399_DECISION, discharges none of the four); imp-95047 (tail lane, ' +
    'hypothesis (b), tracked separately).',
};

export const IMP95084_SLAB_44_CERTIFICATION_CHECKLIST_ASSERTIONS = [
  {
    id: 'imp95084-four-items-present',
    description: 'the checklist has exactly the four imp-95046 requirement keys, in source order',
    holds: () =>
      CHECKLIST.length === 4 &&
      CHECKLIST.map((c) => c.key).join(',') ===
        'box_nonvanishing_evaluator,lemma_44_statement,larger_slab_provenance,seam_join_width',
  },
  {
    id: 'imp95084-all-undischarged',
    description: 'every checklist item is undischarged by the frozen spec, matching the imp-95046 source',
    holds: () =>
      IMP95084_SLAB_44_CERTIFICATION_CHECKLIST.allOpen === true &&
      CHECKLIST.every((item) => item.dischargedBySpec === false),
  },
  {
    id: 'imp95084-matches-source-text-verbatim',
    description: 'each conditionalTarget string matches the imp-95046 source requirement text verbatim',
    holds: () => CHECKLIST.every((item, i) => item.conditionalTarget === SOURCE[i].what),
  },
  {
    id: 'imp95084-consistent-with-source-verdict',
    description: 'this checklist agrees with the imp-95046 verdict that the slab is an independent conditional target',
    holds: () =>
      IMP95046_SLAB_44_TARGET.disposition === 'INDEPENDENT-CONDITIONAL-TARGET' &&
      IMP95046_SLAB_44_TARGET.provesBound === false,
  },
  {
    id: 'imp95084-honesty-gate-no-qed',
    description: 'checklist only: not rigorous, discharges nothing, no QED, no refereed bound is changed',
    holds: () =>
      IMP95084_SLAB_44_CERTIFICATION_CHECKLIST.isRigorous === false &&
      /NO QED/.test(IMP95084_SLAB_44_CERTIFICATION_CHECKLIST.verdict) &&
      /refereed bound is changed/i.test(IMP95084_SLAB_44_CERTIFICATION_CHECKLIST.verdict),
  },
];

for (const a of IMP95084_SLAB_44_CERTIFICATION_CHECKLIST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95084-slab-44-certification-checklist assertion failed: ${a.id}`);
  }
}

export default IMP95084_SLAB_44_CERTIFICATION_CHECKLIST;
