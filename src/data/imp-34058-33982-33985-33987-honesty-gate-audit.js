// src/data/imp-34058-33982-33985-33987-honesty-gate-audit.js
//
// imp-34058: Audit the honesty-gate assertion coverage across the newest sigma(N)
// residual-drift cohort imp-33982 / imp-33985 / imp-33987 -- confirm each module
// carries an executable isRigorous:false / NO-QED / Platt-Trudgian Lambda<=0.2
// SOTA build-time tripwire, mirroring the imp-34035 cohort-audit pattern, and
// report whether any module relies on prose alone.
//
// QUESTION: does each of the three modules back its prose honest-status caveat
// with an EXECUTABLE build-time assertion that THROWS if the honest framing is
// weakened or removed -- and does that coverage extend to the "imp-3066
// off-diagonal endpoint-Hankel K_a >= 0 untouched" clause each module also
// states in prose, or does that specific clause rely on prose alone?
//
// GREP + READ RESULT (2026-07-05): all three modules pass the core no-QED /
// isRigorous:false / no-refereed-bound-change tripwire -- each module's own ASSERTIONS array
// checks isRigorous === false and regex-tests /NO QED/ and /remains SOTA/
// against its verdict string, and throws at import time if any check fails.
// None of the three relies on prose alone for that core gate. But mirroring
// the imp-34035 finding in a different cohort: none of the three modules'
// assertions regex-checks the "imp-3066 K_a >= 0 untouched" clause, even
// though all three state it verbatim in their verdict prose. imp-33985 comes
// closest -- its honesty-gate assertion checks a generic /UNTOUCHED/ regex
// against the verdict, but that match is satisfied by the (also present)
// "C_mb GUE-conditional per imp-486 is UNTOUCHED" text, not specifically the
// imp-3066 clause, so it does not actually gate imp-3066. imp-33982 and
// imp-33987 have no UNTOUCHED-shaped check at all. So the one reportable gap
// class: all three of imp-33982/imp-33985/imp-33987 state "imp-3066 K_a >= 0
// untouched" only in prose, with no executable regex tripwire covering that
// specific clause -- the same gap class imp-34035 found in a different
// cohort (imp-33963/imp-33964/imp-33965).

import { IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION } from './imp-33982-endpoint-peak-power-law-model-selection.js';
import { IMP33985_LOO_MODEL_SELECTION_SENSITIVITY } from './imp-33985-loo-model-selection-sensitivity.js';
import { IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT } from './imp-33987-fixed-band-convex-drift-exponent.js';

const SOTA_RE = /refereed bound is changed/i;
const IMP3066_RE = /imp-3066[^.]*untouched/i;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33982',
    path: '/src/data/imp-33982-endpoint-peak-power-law-model-selection.js',
    isRigorousValue: IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.isRigorous,
    hasNoQed: /NO QED/.test(IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.verdict),
    hasSota: SOTA_RE.test(IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33982_ENDPOINT_PEAK_POWER_LAW_MODEL_SELECTION.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-33985',
    path: '/src/data/imp-33985-loo-model-selection-sensitivity.js',
    isRigorousValue: IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.isRigorous,
    hasNoQed: /NO QED/.test(IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.verdict),
    hasSota: SOTA_RE.test(IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33985_LOO_MODEL_SELECTION_SENSITIVITY.verdict),
    tripwireChecksImp3066: false, // its own assertion checks a generic /UNTOUCHED/ regex, not the imp-3066 clause specifically
  }),
  Object.freeze({
    ticket: 'imp-33987',
    path: '/src/data/imp-33987-fixed-band-convex-drift-exponent.js',
    isRigorousValue: IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.isRigorous,
    hasNoQed: /NO QED/.test(IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.verdict),
    hasSota: SOTA_RE.test(IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33987_FIXED_BAND_CONVEX_DRIFT_EXPONENT.verdict),
    tripwireChecksImp3066: false,
  }),
]);

const ALL_ISRIGOROUS_FALSE = COHORT_HONESTY_GATES.every((m) => m.isRigorousValue === false);
const ALL_HAVE_NO_QED = COHORT_HONESTY_GATES.every((m) => m.hasNoQed === true);
const ALL_HAVE_SOTA = COHORT_HONESTY_GATES.every((m) => m.hasSota === true);
const ALL_PROSE_STATE_IMP3066 = COHORT_HONESTY_GATES.every((m) => m.prosestatesImp3066Untouched === true);
const GAP_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.prosestatesImp3066Untouched && !m.tripwireChecksImp3066)
  .map((m) => m.ticket);

export const IMP34058_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-34058-33982-33985-33987-honesty-gate-audit',
  ticket: 'imp-34058',
  cohort: COHORT_HONESTY_GATES,
  gapTickets: GAP_TICKETS,

  summary:
    'All three imp-33982/imp-33985/imp-33987 modules carry a build-time tripwire asserting ' +
    'isRigorous===false, NO QED, and no refereed bound is changed -- none relies on prose ' +
    'alone for the core honesty gate. But mirroring the imp-34035 cohort-audit finding in a different ' +
    'cohort: all three state the "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 untouched" clause only ' +
    'in prose, with no executable regex tripwire covering that specific clause. imp-33985 comes closest ' +
    '(its own assertion checks a generic /UNTOUCHED/ regex) but that match is satisfied by the separate ' +
    '"C_mb GUE-conditional... UNTOUCHED" text, not the imp-3066 clause, so it does not actually gate it.',

  verdict:
    'COHORT-MOSTLY-COVERED, ONE GAP CLASS: 3 of 3 modules pass the core isRigorous/NO-QED/SOTA ' +
    'tripwire. 3 of 3 (imp-33982, imp-33985, imp-33987) state the imp-3066 K_a>=0 untouched clause only ' +
    'in prose, with no regex tripwire covering it -- flagged here as an audit finding, not fixed in this ' +
    'ticket (audit-only scope). No bound changed; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed' +
    '.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading each ' +
    'of the three modules; does not modify any of the three modules and adds no new bound. ' +
    'No refereed bound is changed.',
});

export const IMP34058_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34058-cohort-has-three-modules',
    description: 'the audited cohort names exactly the three imp-33982/33985/33987 modules',
    holds: () => COHORT_HONESTY_GATES.length === 3
      && ['imp-33982', 'imp-33985', 'imp-33987'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-34058-all-three-live-report-isrigorous-false',
    description: 'all three modules live-report isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-34058-all-three-carry-no-qed-and-sota',
    description: 'all three modules carry NO QED text and the no-refereed-bound-change line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-34058-all-three-state-imp3066-untouched-in-prose',
    description: 'all three modules state the imp-3066 K_a>=0 untouched clause in their prose verdict',
    holds: () => ALL_PROSE_STATE_IMP3066,
  },
  {
    id: 'imp-34058-gap-is-exactly-the-three-cohort-members',
    description: 'the imp-3066-tripwire coverage gap is exactly imp-33982/33985/33987',
    holds: () => GAP_TICKETS.length === 3
      && ['imp-33982', 'imp-33985', 'imp-33987'].every((t) => GAP_TICKETS.includes(t)),
  },
  {
    id: 'imp-34058-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP34058_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP34058_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP34058_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP34058_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP34058_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34058-33982-33985-33987-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP34058_COHORT_HONESTY_GATE_AUDIT;
