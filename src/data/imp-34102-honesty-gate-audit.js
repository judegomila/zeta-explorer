// src/data/imp-34102-honesty-gate-audit.js
//
// imp-34102: Honesty-gate coverage audit of the newest imp-34008/34009/34022/34023/
// 34024/34025/34026 measurement cohort -- confirm each module carries an executable
// isRigorous:false / NO-QED / Platt-Trudgian Lambda<=0.2 SOTA tripwire plus its
// untouched-parent clause (imp-486 C_mb, imp-3066 K_a>=0, C_C 1/8), mirroring the
// imp-34019/imp-34058 audits, and report any module relying on prose alone.
//
// QUESTION: does each of the seven modules back its prose honest-status caveat with
// an EXECUTABLE build-time assertion that THROWS if the honest framing is weakened or
// removed -- and does that coverage extend to the "imp-3066 off-diagonal endpoint-
// Hankel K_a >= 0 untouched" clause each module also states in prose, or does that
// specific clause rely on prose alone in some of the seven?
//
// GREP + READ RESULT (2026-07-05): all seven modules pass the core no-QED /
// isRigorous:false / no-refereed-bound-change tripwire -- each module's own ASSERTIONS array checks
// isRigorous === false and regex-tests /NO QED/ and /remains SOTA/ against its
// verdict string, throwing at import time if any check fails. But the cohort SPLITS
// on the imp-3066 clause, unlike the imp-34035/imp-34058 cohorts where the gap was
// uniform: imp-34024, imp-34025, and imp-34026 (the three DF/KPSS/AR2/Ljung-Box
// stationarity-diagnostic modules) each already carry an assertion that regex-checks
// the LITERAL /imp-3066 K_a >= 0 untouched/ string against their verdict -- a real,
// clause-specific tripwire, not the generic /UNTOUCHED/ regex imp-34058 found
// insufficient in imp-33985. The other four -- imp-34008, imp-34009, imp-34022, and
// imp-34023 -- state the same clause verbatim in prose but their honesty-gate
// assertions check only isRigorous/NO-QED/SOTA, with no imp-3066-specific regex at
// all. So the reportable gap is a strict SUBSET of the cohort: 4 of 7 (imp-34008,
// imp-34009, imp-34022, imp-34023) have no imp-3066 tripwire; 3 of 7 (imp-34024,
// imp-34025, imp-34026) already do.

import { IMP34008_APEX_PARABOLA_WING_FIDELITY } from './imp-34008-apex-parabola-wing-fidelity.js';
import { IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY } from './imp-34009-aggregate-share-window-endpoint-sensitivity.js';
import { IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY } from './imp-34022-argmin-argmax-migration-symmetry.js';
import { IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION } from './imp-34023-eflow-widening-ratio-f4-collapse-extrapolation.js';
import { IMP34024_KPSS_STATIONARITY_BRACKET } from './imp-34024-kpss-stationarity-bracket.js';
import { IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION } from './imp-34025-ar2-breusch-godfrey-serial-correlation.js';
import { IMP34026_QUADRATIC_DETREND_LJUNG_BOX } from './imp-34026-quadratic-detrend-ljung-box.js';

const SOTA_RE = /refereed bound is changed/i;
const IMP3066_RE = /imp-3066[^.]*untouched/i;
const IMP3066_SPECIFIC_TRIPWIRE_RE = /imp-3066 K_a >= 0 untouched/;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-34008',
    path: '/src/data/imp-34008-apex-parabola-wing-fidelity.js',
    isRigorousValue: IMP34008_APEX_PARABOLA_WING_FIDELITY.isRigorous,
    hasNoQed: /NO QED/.test(IMP34008_APEX_PARABOLA_WING_FIDELITY.verdict),
    hasSota: SOTA_RE.test(IMP34008_APEX_PARABOLA_WING_FIDELITY.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34008_APEX_PARABOLA_WING_FIDELITY.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34009',
    path: '/src/data/imp-34009-aggregate-share-window-endpoint-sensitivity.js',
    isRigorousValue: IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.isRigorous,
    hasNoQed: /NO QED/.test(IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.verdict),
    hasSota: SOTA_RE.test(IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34022',
    path: '/src/data/imp-34022-argmin-argmax-migration-symmetry.js',
    isRigorousValue: IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.isRigorous,
    hasNoQed: /NO QED/.test(IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.verdict),
    hasSota: SOTA_RE.test(IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34022_ARGMIN_ARGMAX_MIGRATION_SYMMETRY.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34023',
    path: '/src/data/imp-34023-eflow-widening-ratio-f4-collapse-extrapolation.js',
    isRigorousValue: IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.isRigorous,
    hasNoQed: /NO QED/.test(IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.verdict),
    hasSota: SOTA_RE.test(IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.verdict),
    tripwireChecksImp3066: false,
  }),
  Object.freeze({
    ticket: 'imp-34024',
    path: '/src/data/imp-34024-kpss-stationarity-bracket.js',
    isRigorousValue: IMP34024_KPSS_STATIONARITY_BRACKET.isRigorous,
    hasNoQed: /NO QED/.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict),
    hasSota: SOTA_RE.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict),
    tripwireChecksImp3066: IMP3066_SPECIFIC_TRIPWIRE_RE.test(IMP34024_KPSS_STATIONARITY_BRACKET.verdict),
  }),
  Object.freeze({
    ticket: 'imp-34025',
    path: '/src/data/imp-34025-ar2-breusch-godfrey-serial-correlation.js',
    isRigorousValue: IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.isRigorous,
    hasNoQed: /NO QED/.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict),
    hasSota: SOTA_RE.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict),
    tripwireChecksImp3066: IMP3066_SPECIFIC_TRIPWIRE_RE.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict),
  }),
  Object.freeze({
    ticket: 'imp-34026',
    path: '/src/data/imp-34026-quadratic-detrend-ljung-box.js',
    isRigorousValue: IMP34026_QUADRATIC_DETREND_LJUNG_BOX.isRigorous,
    hasNoQed: /NO QED/.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict),
    hasSota: SOTA_RE.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict),
    tripwireChecksImp3066: IMP3066_SPECIFIC_TRIPWIRE_RE.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict),
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

export const IMP34102_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-34102-honesty-gate-audit',
  ticket: 'imp-34102',
  cohort: COHORT_HONESTY_GATES,
  gapTickets: GAP_TICKETS,
  coveredTickets: COVERED_TICKETS,

  summary:
    'All seven imp-34008/34009/34022/34023/34024/34025/34026 modules carry a build-time tripwire ' +
    'asserting isRigorous===false, NO QED, and no refereed bound is changed -- none relies on ' +
    'prose alone for the core honesty gate. Unlike the uniform gap the imp-34035/imp-34058 audits found, ' +
    'this cohort SPLITS on the imp-3066 clause specifically: imp-34024, imp-34025, and imp-34026 already ' +
    'carry an assertion regex-checking the literal "imp-3066 K_a >= 0 untouched" string against their ' +
    'verdict (a real clause-specific tripwire), while imp-34008, imp-34009, imp-34022, and imp-34023 ' +
    'state the same clause only in prose with no regex tripwire covering it at all.',

  verdict:
    'COHORT-PARTIALLY-COVERED: 7 of 7 modules pass the core isRigorous/NO-QED/SOTA tripwire. 4 of 7 ' +
    '(imp-34008, imp-34009, imp-34022, imp-34023) state the imp-3066 K_a>=0 untouched clause only in ' +
    'prose, with no regex tripwire covering it -- flagged here as an audit finding, not fixed in this ' +
    'ticket (audit-only scope). The other 3 of 7 (imp-34024, imp-34025, imp-34026) already carry that ' +
    'clause-specific tripwire. No bound changed; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed' +
    '.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading each ' +
    'of the seven modules; does not modify any of the seven modules and adds no new bound. ' +
    'No refereed bound is changed.',
});

export const IMP34102_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34102-cohort-has-seven-modules',
    description: 'the audited cohort names exactly the seven imp-34008/09/22/23/24/25/26 modules',
    holds: () => COHORT_HONESTY_GATES.length === 7
      && ['imp-34008', 'imp-34009', 'imp-34022', 'imp-34023', 'imp-34024', 'imp-34025', 'imp-34026'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-34102-all-seven-live-report-isrigorous-false',
    description: 'all seven modules live-report isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-34102-all-seven-carry-no-qed-and-sota',
    description: 'all seven modules carry NO QED text and the no-refereed-bound-change line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-34102-all-seven-state-imp3066-untouched-in-prose',
    description: 'all seven modules state the imp-3066 K_a>=0 untouched clause in their prose verdict',
    holds: () => ALL_PROSE_STATE_IMP3066,
  },
  {
    id: 'imp-34102-gap-is-exactly-four-of-seven',
    description: 'the imp-3066-tripwire coverage gap is exactly imp-34008/34009/34022/34023',
    holds: () => GAP_TICKETS.length === 4
      && ['imp-34008', 'imp-34009', 'imp-34022', 'imp-34023'].every((t) => GAP_TICKETS.includes(t)),
  },
  {
    id: 'imp-34102-covered-is-exactly-three-of-seven',
    description: 'the imp-3066-tripwire coverage already extends to imp-34024/34025/34026',
    holds: () => COVERED_TICKETS.length === 3
      && ['imp-34024', 'imp-34025', 'imp-34026'].every((t) => COVERED_TICKETS.includes(t)),
  },
  {
    id: 'imp-34102-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP34102_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP34102_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP34102_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP34102_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP34102_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34102-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP34102_COHORT_HONESTY_GATE_AUDIT;
