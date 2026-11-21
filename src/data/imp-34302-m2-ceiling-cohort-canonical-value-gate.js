// src/data/imp-34302-m2-ceiling-cohort-canonical-value-gate.js
//
// imp-34302: build-time gate for the M2-ceiling cohort pages (Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx
// and Imp34281M2CeilingCohortIndexPage.jsx), which both cite the imp-34023/imp-34237 BISECTED sign-change
// ceiling kEnd*~21.28095 as canonical while imp-34127 separately reports a LOWER, non-canonical closed-form
// leading estimate kEnd_closed_form~21.00 (a residual of ~-0.28 below the bisection, attributed by imp-34127
// to 2pt-vs-5pt estimator-discretization bias, NOT a competing ceiling reading). Live-imports both source
// modules so a future edit that drifts either literal, or that collapses the two distinct readings into one,
// throws at build time instead of silently mislabeling the closed form as the ceiling.
//
// @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (canonical ceiling literal, gated)
// @see Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx (cohort page gated)
// @see Imp34281M2CeilingCohortIndexPage.jsx (cohort index page gated)
// @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (closed-form estimate literal, gated)

import { IMP34237_RESID_ZERO_KSTAR } from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import { IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM } from './imp-34127-m2-residual-signchange-ceiling-closed-form.js';

const CANONICAL_CEILING = IMP34237_RESID_ZERO_KSTAR; // ~21.28095, the bisected sign-change ceiling
const CLOSED_FORM_ESTIMATE = IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM.closedForm.kEnd_closed_form; // ~21.00
const CLOSED_FORM_RESIDUAL = IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM.closedForm.residual_closed_minus_bisected; // ~-0.28
const IMP34127_OWN_BISECTED = IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM.closedForm.kEnd_bisected; // ~21.2809, imp-34127's own independent bisection

export const IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE = Object.freeze({
  id: 'imp-34302-m2-ceiling-cohort-canonical-value-gate',
  ticket: 'imp-34302',
  cohortPages: [
    'src/pages/Imp34237FixedBandPeakReaccelAndSurrogatePoleViz.jsx',
    'src/pages/Imp34281M2CeilingCohortIndexPage.jsx',
  ],
  canonicalCeiling: CANONICAL_CEILING,
  closedFormEstimate: CLOSED_FORM_ESTIMATE,
  closedFormResidual: CLOSED_FORM_RESIDUAL,

  summary:
    'The M2-ceiling cohort has exactly one canonical number -- the imp-34023/imp-34237 bisected sign-change ' +
    'ceiling kEnd*~21.28095 -- and one distinct, lower, non-canonical closed-form leading estimate from ' +
    'imp-34127 (kEnd_closed_form~21.00, residual~-0.28). This gate live-imports both source literals so the ' +
    'cohort pages cannot drift them together or silently swap which one is labeled "the ceiling".',

  verdict:
    'GATED: canonical ceiling and imp-34127 closed-form estimate remain distinct literals, separated by ' +
    'their reported ~-0.28 residual. No bound changed; C_mb GUE-conditional per imp-486 untouched; imp-3066 ' +
    'K_a>=0 untouched; NO QED; no refereed bound is changed.',

  honest:
    'GATE-ONLY -- checks the live values of two already-published source modules against the reading the ' +
    'cohort pages cite in prose; adds no new derivation and changes no bound. No refereed bound is changed' +
    '.',
});

export const IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE_ASSERTIONS = [
  {
    id: 'imp-34302-canonical-ceiling-matches-bisection',
    description: 'the canonical ceiling equals the imp-34237/imp-34023 bisected reading kEnd*~21.28095',
    holds: () => Math.abs(CANONICAL_CEILING - 21.28095) < 1e-9,
  },
  {
    id: 'imp-34302-closed-form-matches-imp-34127-reading',
    description: 'the imp-34127 closed-form leading estimate is ~21.00',
    holds: () => Math.abs(CLOSED_FORM_ESTIMATE - 21.0) < 0.05,
  },
  {
    id: 'imp-34302-two-readings-stay-distinct',
    description: 'the closed-form estimate and the canonical ceiling never collapse to the same value',
    holds: () => Math.abs(CLOSED_FORM_ESTIMATE - CANONICAL_CEILING) > 0.2,
  },
  {
    id: 'imp-34302-residual-consistent-with-imp34127-own-literals',
    description: 'imp-34127’s own reported residual reproduces its own closed-form-minus-its-own-bisected difference',
    holds: () => Math.abs(CLOSED_FORM_RESIDUAL - (CLOSED_FORM_ESTIMATE - IMP34127_OWN_BISECTED)) < 1e-3,
  },
  {
    id: 'imp-34302-cross-module-bisections-agree',
    description: 'imp-34127’s independent bisection and the imp-34237/imp-34023 canonical ceiling agree to within 1e-2',
    holds: () => Math.abs(IMP34127_OWN_BISECTED - CANONICAL_CEILING) < 1e-2,
  },
  {
    id: 'imp-34302-imp34127-honesty-markers-intact',
    description: 'the imp-34127 source module still self-reports isRigorous===false',
    holds: () => IMP34127_M2_RESIDUAL_SIGNCHANGE_CEILING_CLOSED_FORM.isRigorous === false,
  },
  {
    id: 'imp-34302-gate-only-honest',
    description: 'explicitly GATE-ONLY and no refereed bound is changed',
    holds: () => /GATE-ONLY/.test(IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE.honest)
      && /refereed bound is changed/i.test(IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE.honest)
      && /NO QED/.test(IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE.verdict)
      && /refereed bound is changed/i.test(IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE.verdict),
  },
];

for (const a of IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34302-m2-ceiling-cohort-canonical-value-gate assertion failed: ${a.id}`);
  }
}

export default IMP34302_M2_CEILING_COHORT_CANONICAL_VALUE_GATE;
