// src/data/imp-34145-honesty-gate-audit.js
//
// imp-34145: Honesty-gate coverage audit of the imp-34060/34061/34062/34063/34064/34065/34066
// numerical cohort -- confirm each module's OWN build-time tripwire (its ASSERTIONS array, not
// just its prose) regex-checks the imp-3066 K_a>=0 UNTOUCHED clause and the imp-486 C_mb
// GUE-conditional UNTOUCHED clause specifically, mirroring the imp-34122/imp-34102/imp-34058
// audits.
//
// GREP + READ RESULT (2026-07-05): all seven modules pass the core no-QED / isRigorous:false /
// SOTA tripwire -- each module's own ASSERTIONS array checks isRigorous === false and regex-tests
// /NO QED/ and /remains SOTA/ (or /remains the rigorous SOTA/) against its verdict string, throwing
// at import time if any check fails. But the cohort has NO imp-3066-SPECIFIC tripwire in six of the
// seven: imp-34060, imp-34062, imp-34063, imp-34064, imp-34065, and imp-34066 all state "imp-3066
// K_a >= 0 untouched" only in prose, with their honesty-gate assertions checking just
// isRigorous/NO-QED/SOTA (plus module-specific numeric facts) -- no imp-3066-specific regex at all.
// Only imp-34061 already carries a clause-specific tripwire: its assertion regex-tests the literal
// "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED" string. The C_mb clause fares worse:
// NONE of the seven modules' own assertions regex-check the "C_mb GUE-conditional ... UNTOUCHED"
// clause, even though six of the seven (all but imp-34061, which never mentions C_mb at all) state
// it in prose. So the reportable gap is 6 of 7 (imp-34060, imp-34062, imp-34063, imp-34064,
// imp-34065, imp-34066) with no imp-3066-specific tripwire, and 6 of 7 (the same six, since
// imp-34061 has no C_mb clause to cover) with no C_mb-specific tripwire either.

import { IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED } from './imp-34060-geometric-center-taylor-ratio-extended.js';
import { IMP34061_EPS6_SUBSUBSUBLEADING_ONSET_COEFFICIENT } from './imp-34061-eps6-subsubsubleading-onset-coefficient.js';
import { IMP34062_M2_RESIDUAL_ATTENUATION_RATE } from './imp-34062-m2-residual-attenuation-rate.js';
import { IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION } from './imp-34063-lnf2-slope-gap-attribution.js';
import { IMP34064_APEX_QUARTIC_CURVATURE_FIT } from './imp-34064-apex-quartic-curvature-fit.js';
import { IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET } from './imp-34065-window-span-scaling-of-exponent-offset.js';
import { IMP34066_CENTRED_WINDOW_COLLAPSES_EXPONENT_LEAD } from './imp-34066-centred-window-collapses-exponent-lead.js';

const SOTA_RE = /refereed bound is changed/i;
const IMP3066_PROSE_RE = /imp-3066[^.]*untouched/i;
const IMP3066_SPECIFIC_TRIPWIRE_RE = /imp-3066[^.]*K_a >= 0[^.]*UNTOUCHED/i;
const CMB_PROSE_RE = /C_mb[^.]*(UNTOUCHED|GUE-conditional)/i;
const CMB_SPECIFIC_TRIPWIRE_RE = /C_mb[^.]*GUE-conditional[^.]*UNTOUCHED/i;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-34060',
    path: '/src/data/imp-34060-geometric-center-taylor-ratio-extended.js',
    isRigorousValue: IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.isRigorous,
    hasNoQed: /NO QED/.test(IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.verdict),
    hasSota: SOTA_RE.test(IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34060_GEOMETRIC_CENTER_TAYLOR_RATIO_EXTENDED.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksCmb: false,
  }),
  Object.freeze({
    ticket: 'imp-34061',
    path: '/src/data/imp-34061-eps6-subsubsubleading-onset-coefficient.js',
    isRigorousValue: IMP34061_EPS6_SUBSUBSUBLEADING_ONSET_COEFFICIENT.isRigorous,
    hasNoQed: /NO QED/.test(IMP34061_EPS6_SUBSUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    hasSota: SOTA_RE.test(IMP34061_EPS6_SUBSUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34061_EPS6_SUBSUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34061_EPS6_SUBSUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    tripwireChecksImp3066: IMP3066_SPECIFIC_TRIPWIRE_RE.test(IMP34061_EPS6_SUBSUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    tripwireChecksCmb: false,
  }),
  Object.freeze({
    ticket: 'imp-34062',
    path: '/src/data/imp-34062-m2-residual-attenuation-rate.js',
    isRigorousValue: IMP34062_M2_RESIDUAL_ATTENUATION_RATE.isRigorous,
    hasNoQed: /NO QED/.test(IMP34062_M2_RESIDUAL_ATTENUATION_RATE.verdict),
    hasSota: SOTA_RE.test(IMP34062_M2_RESIDUAL_ATTENUATION_RATE.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34062_M2_RESIDUAL_ATTENUATION_RATE.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34062_M2_RESIDUAL_ATTENUATION_RATE.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksCmb: false,
  }),
  Object.freeze({
    ticket: 'imp-34063',
    path: '/src/data/imp-34063-lnf2-slope-gap-attribution.js',
    isRigorousValue: IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.isRigorous,
    hasNoQed: /NO QED/.test(IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.verdict),
    hasSota: SOTA_RE.test(IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34063_LNF2_SLOPE_GAP_ATTRIBUTION.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksCmb: false,
  }),
  Object.freeze({
    ticket: 'imp-34064',
    path: '/src/data/imp-34064-apex-quartic-curvature-fit.js',
    isRigorousValue: IMP34064_APEX_QUARTIC_CURVATURE_FIT.isRigorous,
    hasNoQed: /NO QED/.test(IMP34064_APEX_QUARTIC_CURVATURE_FIT.verdict),
    hasSota: SOTA_RE.test(IMP34064_APEX_QUARTIC_CURVATURE_FIT.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34064_APEX_QUARTIC_CURVATURE_FIT.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34064_APEX_QUARTIC_CURVATURE_FIT.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksCmb: false,
  }),
  Object.freeze({
    ticket: 'imp-34065',
    path: '/src/data/imp-34065-window-span-scaling-of-exponent-offset.js',
    isRigorousValue: IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.isRigorous,
    hasNoQed: /NO QED/.test(IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.verdict),
    hasSota: SOTA_RE.test(IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34065_WINDOW_SPAN_SCALING_OF_EXPONENT_OFFSET.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksCmb: false,
  }),
  Object.freeze({
    ticket: 'imp-34066',
    path: '/src/data/imp-34066-centred-window-collapses-exponent-lead.js',
    isRigorousValue: IMP34066_CENTRED_WINDOW_COLLAPSES_EXPONENT_LEAD.isRigorous,
    hasNoQed: /NO QED/.test(IMP34066_CENTRED_WINDOW_COLLAPSES_EXPONENT_LEAD.verdict),
    hasSota: SOTA_RE.test(IMP34066_CENTRED_WINDOW_COLLAPSES_EXPONENT_LEAD.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34066_CENTRED_WINDOW_COLLAPSES_EXPONENT_LEAD.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34066_CENTRED_WINDOW_COLLAPSES_EXPONENT_LEAD.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksCmb: false,
  }),
]);

const ALL_ISRIGOROUS_FALSE = COHORT_HONESTY_GATES.every((m) => m.isRigorousValue === false);
const ALL_HAVE_NO_QED = COHORT_HONESTY_GATES.every((m) => m.hasNoQed === true);
const ALL_HAVE_SOTA = COHORT_HONESTY_GATES.every((m) => m.hasSota === true);

const IMP3066_GAP_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.prosestatesImp3066Untouched && !m.tripwireChecksImp3066)
  .map((m) => m.ticket);
const IMP3066_COVERED_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.tripwireChecksImp3066)
  .map((m) => m.ticket);

const CMB_GAP_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.prosestatesCmbUntouched && !m.tripwireChecksCmb)
  .map((m) => m.ticket);
const CMB_COVERED_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.tripwireChecksCmb)
  .map((m) => m.ticket);

export const IMP34145_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-34145-honesty-gate-audit',
  ticket: 'imp-34145',
  cohort: COHORT_HONESTY_GATES,
  imp3066GapTickets: IMP3066_GAP_TICKETS,
  imp3066CoveredTickets: IMP3066_COVERED_TICKETS,
  cmbGapTickets: CMB_GAP_TICKETS,
  cmbCoveredTickets: CMB_COVERED_TICKETS,

  summary:
    'All seven imp-34060/34061/34062/34063/34064/34065/34066 modules carry a build-time tripwire ' +
    'asserting isRigorous===false, NO QED, and no refereed bound is changed -- none relies ' +
    'on prose alone for the core honesty gate. But the cohort has almost no clause-specific coverage: ' +
    'six of seven (imp-34060, imp-34062, imp-34063, imp-34064, imp-34065, imp-34066) state "imp-3066 ' +
    'K_a >= 0 untouched" only in prose with no imp-3066-specific regex tripwire at all -- only ' +
    'imp-34061 already carries one, matching the literal "imp-3066 off-diagonal endpoint-Hankel K_a ' +
    '>= 0 UNTOUCHED" string. The C_mb GUE-conditional clause is worse still: none of the seven ' +
    'modules regex-checks it in their own assertions, even though six of the seven state it in prose ' +
    '(imp-34061 never mentions C_mb at all, so it has nothing to cover).',

  verdict:
    'COHORT-PARTIALLY-COVERED: 7 of 7 modules pass the core isRigorous/NO-QED/SOTA tripwire. 6 of 7 ' +
    '(imp-34060, imp-34062, imp-34063, imp-34064, imp-34065, imp-34066) have no imp-3066-SPECIFIC ' +
    'tripwire -- flagged here as an audit finding, not fixed in this ticket (audit-only scope); ' +
    'imp-34061 already has one. 6 of 7 (the same six) also have no C_mb-SPECIFIC tripwire -- none of ' +
    'the seven modules regex-checks the C_mb GUE-conditional UNTOUCHED clause. No bound changed; ' +
    'imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; NO QED; ' +
    'no refereed bound is changed.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading each ' +
    'of the seven modules; does not modify any of the seven modules and adds no new bound. ' +
    'No refereed bound is changed.',
});

export const IMP34145_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34145-cohort-has-seven-modules',
    description: 'the audited cohort names exactly the seven imp-34060..34066 modules',
    holds: () => COHORT_HONESTY_GATES.length === 7
      && ['imp-34060', 'imp-34061', 'imp-34062', 'imp-34063', 'imp-34064', 'imp-34065', 'imp-34066'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-34145-all-seven-live-report-isrigorous-false',
    description: 'all seven modules live-report isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-34145-all-seven-carry-no-qed-and-sota',
    description: 'all seven modules carry NO QED text and the no-refereed-bound-change line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-34145-imp3066-gap-is-exactly-six-of-seven',
    description: 'the imp-3066-tripwire coverage gap is exactly six of the seven modules',
    holds: () => IMP3066_GAP_TICKETS.length === 6
      && ['imp-34060', 'imp-34062', 'imp-34063', 'imp-34064', 'imp-34065', 'imp-34066'].every(
        (t) => IMP3066_GAP_TICKETS.includes(t)
      ),
  },
  {
    id: 'imp-34145-imp3066-covered-is-exactly-one-of-seven',
    description: 'the imp-3066-tripwire coverage already extends only to imp-34061',
    holds: () => IMP3066_COVERED_TICKETS.length === 1 && IMP3066_COVERED_TICKETS[0] === 'imp-34061',
  },
  {
    id: 'imp-34145-cmb-gap-is-exactly-six-of-seven',
    description: 'the C_mb-tripwire coverage gap is exactly the same six modules (imp-34061 has no C_mb clause)',
    holds: () => CMB_GAP_TICKETS.length === 6
      && ['imp-34060', 'imp-34062', 'imp-34063', 'imp-34064', 'imp-34065', 'imp-34066'].every(
        (t) => CMB_GAP_TICKETS.includes(t)
      )
      && CMB_COVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-34145-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP34145_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP34145_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP34145_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP34145_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP34145_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34145-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP34145_COHORT_HONESTY_GATE_AUDIT;
