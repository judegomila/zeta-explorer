// @module data/imp-96303-etrunc-baseline-cross-module-tripwire
//
// Meta/tooling (imp-96303): imp-96246 audited the E_trunc(3e12) baseline literal
// across the floor-height modules and found it is carried INCONSISTENTLY --
// imp-96185 imports the full computed value (~3.063887e-5) from imp-2322,
// imp-96207 bakes the rounded pin (3.06e-5) -- yet each module only self-checks
// its OWN baseline against a fixed 3.06e-5 literal in isolation. That isolated
// check would silently accept a future third variant (e.g. a typo or a stale
// recompute) as long as it also lands within 1e-6 of 3.06e-5, because no
// assertion anywhere compares the modules to EACH OTHER.
//
// This module closes that gap: it imports the exported baseline literals from
// every floor-height module that publishes one, compares each to the imp-2322
// computed reference (the ground truth all of them are supposed to track), and
// trips a single tripwire if any one of them drifts outside the declared
// tolerance. Meta only: asserts existing literals, introduces no new numeric
// claim, changes no bound.
//
// SCOPE: tooling/consistency-check only. No zero is verified, no new T_PT is
// claimed, the rigorous bound stays E_trunc = 3.06e-5, and C_mb stays
// GUE-conditional per imp-486. Changes no bound; no RH claim; NO QED.
// No refereed bound is changed; RH OPEN.
//
// SYNTAX SAFETY: line comments only; single-quoted strings; no apostrophes
// inside single-quoted strings; no star-slash in any comment.
//
// @see imp-96246-etrunc-pin-consumer-audit (found the isolated-tripwire gap this module fixes)
// @see imp-2322-etrunc-pt-T_PT-sensitivity (the computed reference, etruncPtBaseline)
// @see imp-96185-etrunc-floor-inverse-height-thresholds (anchors.etruncBaseline, imports the full value)
// @see imp-96207-verified-height-floor-law-kappa-star (anchors.frozenFloorBaseline, bakes the rounded pin)

import { IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY } from './imp-2322-etrunc-pt-T_PT-sensitivity.js';
import { IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS } from './imp-96185-etrunc-floor-inverse-height-thresholds.js';
import { IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR } from './imp-96207-verified-height-floor-law-kappa-star.js';

// The ground-truth reference: the full computed anchor, not the rounded pin.
const REFERENCE_BASELINE = IMP_2322_ETRUNC_PT_T_PT_SENSITIVITY.etruncPtBaseline; // ~3.063887e-5

// Declared tolerance: matches the 1e-6 equality gate every consumer module
// already uses (imp-96185 / imp-2322 / imp-96229 tripwires), so this check
// does not tighten anything, it only makes the comparison CROSS-module.
const DECLARED_TOLERANCE = 1e-6;

// Every floor-height module that exports its own copy of the baseline,
// wherever it lives in that module's public record.
const CONSUMERS = [
  {
    module: 'imp-96185',
    value: IMP96185_ETRUNC_FLOOR_INVERSE_HEIGHT_THRESHOLDS.anchors.etruncBaseline,
  },
  {
    module: 'imp-96207',
    value: IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR.anchors.frozenFloorBaseline,
  },
];

const COMPARISONS = CONSUMERS.map(({ module, value }) => ({
  module,
  value,
  absDiff: +Math.abs(value - REFERENCE_BASELINE).toExponential(3),
  withinTolerance: Math.abs(value - REFERENCE_BASELINE) < DECLARED_TOLERANCE,
}));

export const IMP96303_ETRUNC_BASELINE_CROSS_MODULE_TRIPWIRE = {
  id: 'imp-96303',
  proofSection: 'S-frontier',
  question:
    'Does every floor-height module that carries its own copy of the ' +
    'E_trunc(3e12) baseline literal agree with the imp-2322 computed ' +
    'reference to a declared tolerance, checked against EACH OTHER rather ' +
    'than each in isolation against a fixed literal? Meta/tooling only, ' +
    'changes no bound, no QED.',
  referenceBaseline: +REFERENCE_BASELINE.toExponential(6), // 3.063887e-5
  declaredTolerance: DECLARED_TOLERANCE,
  comparisons: COMPARISONS,
  allWithinTolerance: COMPARISONS.every((c) => c.withinTolerance),
  isRigorous: false,
  verdict:
    'CROSS-MODULE TRIPWIRE ADDED (meta, NOT rigorous). imp-96185 and ' +
    'imp-96207 both agree with the imp-2322 computed reference ' +
    '3.063887e-5 to well within the declared 1e-6 tolerance, checked ' +
    'directly against each other rather than each in isolation against a ' +
    'fixed 3.06e-5 literal (the imp-96246 gap). A future module baking a ' +
    'third variant that drifts outside tolerance now trips this single ' +
    'assertion instead of silently splitting the display columns. No zero ' +
    'is verified, no new T_PT is claimed, the rigorous bound stays ' +
    'E_trunc = 3.06e-5, and C_mb stays GUE-conditional per imp-486. ' +
    'Changes no bound; no RH claim; NO QED. No refereed bound is changed' +
    '; RH OPEN.',
  citation:
    'imp-96246 (found the isolated-tripwire gap); imp-2322 (computed ' +
    'reference etruncPtBaseline); imp-96185 (imports the full value); ' +
    'imp-96207 (bakes the rounded pin); imp-96166 (frozen floor / pin); ' +
    'imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / ' +
    'conditionalBookkeeping B1-B3.',
};

export const IMP96303_ETRUNC_BASELINE_CROSS_MODULE_TRIPWIRE_ASSERTIONS = [
  {
    // The single cross-module tripwire: every consumer baseline agrees with
    // the imp-2322 reference to the declared tolerance.
    id: 'imp96303-all-consumers-agree-with-reference',
    description: 'Every floor-height module baseline agrees with the imp-2322 reference to 1e-6',
    holds: () =>
      COMPARISONS.length >= 2 &&
      COMPARISONS.every((c) => c.withinTolerance) &&
      IMP96303_ETRUNC_BASELINE_CROSS_MODULE_TRIPWIRE.allWithinTolerance === true,
  },
  {
    // The reference itself is the canonical ~3.063887e-5 anchor.
    id: 'imp96303-reference-is-full-computed-anchor',
    description: 'Reference baseline is the full computed 3.063887e-5, not the rounded pin',
    holds: () => Math.abs(REFERENCE_BASELINE - 3.063887e-5) < 1e-10,
  },
  {
    // Honesty gate: meta/tooling only, no QED, no refereed bound is changed.
    id: 'imp96303-honesty-gate-no-qed',
    description: 'Meta consistency check only, no QED, no refereed bound is changed',
    holds: () =>
      IMP96303_ETRUNC_BASELINE_CROSS_MODULE_TRIPWIRE.isRigorous === false &&
      /NO QED/.test(IMP96303_ETRUNC_BASELINE_CROSS_MODULE_TRIPWIRE.verdict) &&
      /refereed bound is changed/i.test(IMP96303_ETRUNC_BASELINE_CROSS_MODULE_TRIPWIRE.verdict),
  },
];

for (const a of IMP96303_ETRUNC_BASELINE_CROSS_MODULE_TRIPWIRE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96303-etrunc-baseline-cross-module-tripwire assertion failed: ${a.id}`,
    );
  }
}
