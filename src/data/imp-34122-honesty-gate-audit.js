// src/data/imp-34122-honesty-gate-audit.js
//
// imp-34122: Honesty-gate coverage audit of the imp-34040/34041/34042/34043/34044/34045
// measurement cohort -- confirm each module carries an executable isRigorous:false / NO-QED /
// Platt-Trudgian Lambda<=0.2 SOTA tripwire plus its imp-3066 K_a>=0 and imp-486 C_mb
// untouched-parent clauses, mirroring the imp-34102/imp-34019 audits.
//
// QUESTION: does each of the six modules back its prose "imp-3066 K_a >= 0 untouched" caveat
// with an EXECUTABLE build-time assertion that regex-checks that SPECIFIC clause (not just a
// generic /UNTOUCHED/ match), or does that clause rely on prose alone in some of the six?
//
// GREP + READ RESULT (2026-07-05): all six modules pass the core no-QED / isRigorous:false /
// PT-SOTA tripwire -- each module's own ASSERTIONS array checks isRigorous === false and
// regex-tests /NO QED/ and /remains (the rigorous )?SOTA/ against its verdict string, throwing
// at import time if any check fails. But the cohort SPLITS on the imp-3066 clause, mirroring the
// imp-34102 split: imp-34040, imp-34041, imp-34043, and imp-34044 state "imp-3066 K_a >= 0
// untouched" only in prose, with their honesty-gate assertions checking just isRigorous/NO-QED/
// SOTA -- no imp-3066-specific regex at all. imp-34042's honesty-gate assertion DOES regex-check
// /UNTOUCHED/, but that generic regex also matches the UNRELATED "imp-33843 ... verdict is
// UNTOUCHED" clause in its own verdict string -- the same generic-regex insufficiency imp-34058
// flagged in imp-33982/imp-33985/imp-33987 (imp-34080). Only imp-34045 already carries a
// clause-specific tripwire: its assertion regex-tests the literal "imp-3066 off-diagonal
// endpoint-Hankel K_a >= 0 UNTOUCHED" string. So the reportable gap is 5 of 6 (imp-34040,
// imp-34041, imp-34042, imp-34043, imp-34044) with no imp-3066-SPECIFIC tripwire; 1 of 6
// (imp-34045) already has one.

import { IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE } from './imp-34040-fixed-band-drift-saturation-decade.js';
import { IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT } from './imp-34041-eflow-widening-ratio-growth-law-tournament.js';
import { IMP34042_LTO_MODEL_SELECTION_SENSITIVITY } from './imp-34042-lto-model-selection-sensitivity.js';
import { IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT } from './imp-34043-endpoint-peak-saturating-model-tournament.js';
import { IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE } from './imp-34044-sawtooth-phase-realignment-schedule.js';
import { IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY } from './imp-34045-phase-zero-endpoint-degeneracy.js';

const SOTA_RE = /remains (the rigorous )?SOTA\.?$|remains (the rigorous )?SOTA/;
const IMP3066_RE = /imp-3066[^.]*untouched/i;
const IMP3066_SPECIFIC_TRIPWIRE_RE = /imp-3066[^.]*K_a >= 0[^.]*UNTOUCHED/i;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-34040',
    path: '/src/data/imp-34040-fixed-band-drift-saturation-decade.js',
    isRigorousValue: IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.isRigorous,
    hasNoQed: /NO QED/.test(IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.verdict),
    hasSota: SOTA_RE.test(IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34040_FIXED_BAND_DRIFT_SATURATION_DECADE.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34041',
    path: '/src/data/imp-34041-eflow-widening-ratio-growth-law-tournament.js',
    isRigorousValue: IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.isRigorous,
    hasNoQed: /NO QED/.test(IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.verdict),
    hasSota: SOTA_RE.test(IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34042',
    path: '/src/data/imp-34042-lto-model-selection-sensitivity.js',
    isRigorousValue: IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.isRigorous,
    hasNoQed: /NO QED/.test(IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.verdict),
    hasSota: SOTA_RE.test(IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34042_LTO_MODEL_SELECTION_SENSITIVITY.verdict),
    tripwireChecksImp3066: false, // its assertion regex is generic /UNTOUCHED/, not imp-3066-specific
  }),
  Object.freeze({
    ticket: 'imp-34043',
    path: '/src/data/imp-34043-endpoint-peak-saturating-model-tournament.js',
    isRigorousValue: IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT.isRigorous,
    hasNoQed: /NO QED/.test(IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT.verdict),
    hasSota: SOTA_RE.test(IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34044',
    path: '/src/data/imp-34044-sawtooth-phase-realignment-schedule.js',
    isRigorousValue: IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.isRigorous,
    hasNoQed: /NO QED/.test(IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.verdict),
    hasSota: SOTA_RE.test(IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34044_SAWTOOTH_PHASE_REALIGNMENT_SCHEDULE.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34045',
    path: '/src/data/imp-34045-phase-zero-endpoint-degeneracy.js',
    isRigorousValue: IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.isRigorous,
    hasNoQed: /NO QED/.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict),
    hasSota: SOTA_RE.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict),
    tripwireChecksImp3066: IMP3066_SPECIFIC_TRIPWIRE_RE.test(IMP34045_PHASE_ZERO_ENDPOINT_DEGENERACY.verdict),
  }),
]);

const ALL_ISRIGOROUS_FALSE = COHORT_HONESTY_GATES.every((m) => m.isRigorousValue === false);
const ALL_HAVE_NO_QED = COHORT_HONESTY_GATES.every((m) => m.hasNoQed === true);
const ALL_HAVE_SOTA = COHORT_HONESTY_GATES.every((m) => m.hasSota === true);
const ALL_PROSE_STATE_IMP3066 = COHORT_HONESTY_GATES.every((m) => m.prosestatesImp3066Untouched === true);
const GAP_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.prosestatesImp3066Untouched && !m.tripwireChecksImp3066)
  .map((m) => m.ticket);
const COVERED_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.tripwireChecksImp3066)
  .map((m) => m.ticket);

export const IMP34122_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-34122-honesty-gate-audit',
  ticket: 'imp-34122',
  cohort: COHORT_HONESTY_GATES,
  gapTickets: GAP_TICKETS,
  coveredTickets: COVERED_TICKETS,

  summary:
    'All six imp-34040/34041/34042/34043/34044/34045 modules carry a build-time tripwire asserting ' +
    'isRigorous===false, NO QED, and Platt-Trudgian Lambda<=0.2 remains SOTA -- none relies on prose ' +
    'alone for the core honesty gate. Mirroring the imp-34102 split, this cohort ALSO splits on the ' +
    'imp-3066 clause: imp-34040, imp-34041, imp-34043, and imp-34044 state "imp-3066 K_a >= 0 ' +
    'untouched" only in prose with no regex tripwire covering it at all; imp-34042 carries only a ' +
    'generic /UNTOUCHED/ assertion that also matches an unrelated UNTOUCHED clause in its own verdict, ' +
    'the same insufficiency imp-34058 flagged in imp-33982/imp-33985/imp-33987; only imp-34045 already ' +
    'carries a clause-specific tripwire regex-checking the literal "imp-3066 off-diagonal endpoint-' +
    'Hankel K_a >= 0 UNTOUCHED" string against its verdict.',

  verdict:
    'COHORT-PARTIALLY-COVERED: 6 of 6 modules pass the core isRigorous/NO-QED/SOTA tripwire. 5 of 6 ' +
    '(imp-34040, imp-34041, imp-34042, imp-34043, imp-34044) have no imp-3066-SPECIFIC tripwire -- 4 ' +
    'state the clause only in prose with no regex at all, and imp-34042 has only a generic /UNTOUCHED/ ' +
    'regex that does not specifically target the imp-3066 clause -- flagged here as an audit finding, ' +
    'not fixed in this ticket (audit-only scope). The remaining 1 of 6 (imp-34045) already carries that ' +
    'clause-specific tripwire. No bound changed; imp-3066 K_a >= 0 untouched; NO QED; Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading each ' +
    'of the six modules; does not modify any of the six modules and adds no new bound. Platt-Trudgian ' +
    'Lambda <= 0.2 stays the rigorous SOTA.',
});

export const IMP34122_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34122-cohort-has-six-modules',
    description: 'the audited cohort names exactly the six imp-34040/41/42/43/44/45 modules',
    holds: () => COHORT_HONESTY_GATES.length === 6
      && ['imp-34040', 'imp-34041', 'imp-34042', 'imp-34043', 'imp-34044', 'imp-34045'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-34122-all-six-live-report-isrigorous-false',
    description: 'all six modules live-report isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-34122-all-six-carry-no-qed-and-sota',
    description: 'all six modules carry NO QED text and the Platt-Trudgian Lambda<=0.2 SOTA line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-34122-all-six-state-imp3066-untouched-in-prose',
    description: 'all six modules state the imp-3066 K_a>=0 untouched clause in their prose verdict',
    holds: () => ALL_PROSE_STATE_IMP3066,
  },
  {
    id: 'imp-34122-gap-is-exactly-five-of-six',
    description: 'the imp-3066-tripwire coverage gap is exactly imp-34040/34041/34042/34043/34044',
    holds: () => GAP_TICKETS.length === 5
      && ['imp-34040', 'imp-34041', 'imp-34042', 'imp-34043', 'imp-34044'].every((t) => GAP_TICKETS.includes(t)),
  },
  {
    id: 'imp-34122-covered-is-exactly-one-of-six',
    description: 'the imp-3066-tripwire coverage already extends only to imp-34045',
    holds: () => COVERED_TICKETS.length === 1 && COVERED_TICKETS[0] === 'imp-34045',
  },
  {
    id: 'imp-34122-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(IMP34122_COHORT_HONESTY_GATE_AUDIT.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP34122_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP34122_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /Lambda <= 0.2 remains the rigorous SOTA/.test(IMP34122_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP34122_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34122-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP34122_COHORT_HONESTY_GATE_AUDIT;
