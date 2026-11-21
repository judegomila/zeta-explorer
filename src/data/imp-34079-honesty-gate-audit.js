// src/data/imp-34079-honesty-gate-audit.js
//
// imp-34079: Honesty-gate coverage audit of the newest imp-34000/34001/34002/34003/
// 34004/34005/34006/34007 measurement cohort -- confirm each module carries an
// executable isRigorous:false / NO-QED / Platt-Trudgian Lambda<=0.2 SOTA tripwire
// plus its untouched-parent clause (imp-486 C_mb, imp-3066 K_a>=0, C_C 1/8),
// mirroring the imp-34058/imp-34019/imp-34102/imp-34145 audits.
//
// QUESTION: does each of the eight modules back its prose honest-status caveat
// with an EXECUTABLE build-time assertion that THROWS if the honest framing is
// weakened or removed -- and does that coverage extend to the untouched-parent
// clauses (imp-3066 K_a>=0, imp-486 C_mb, C_C 1/8) each module states in prose,
// or do those clauses rely on prose alone in some of the eight?
//
// GREP + READ RESULT (2026-07-05): all eight modules pass the core no-QED /
// isRigorous:false / no-refereed-bound-change tripwire -- each module's own ASSERTIONS array
// checks isRigorous === false and regex-tests its verdict string for NO QED and
// remains (the rigorous) SOTA, throwing at import time if any check fails.
// Mirroring the imp-34145 pattern (imp-3066 AND C_mb both checked), this cohort
// splits on THREE untouched-parent clauses:
//   - imp-3066 K_a>=0 untouched: all eight state it in prose, but only imp-34002
//     already carries a clause-specific regex tripwire (it tests its verdict for
//     the literal "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED"
//     string as part of its H4/G6a honesty gate). The other seven (imp-34000,
//     imp-34001, imp-34003, imp-34004, imp-34005, imp-34006, imp-34007) state the
//     shorter "imp-3066 K_a >= 0 untouched" phrasing in prose with no regex
//     tripwire covering it at all.
//   - imp-486 C_mb GUE-conditional untouched: seven of eight state it in prose
//     (all except imp-34002, whose verdict never mentions C_mb); none of the
//     eight -- including imp-34002 -- carries an executable C_mb-specific
//     tripwire.
//   - C_C 1/8 ansatz untouched: only imp-34005 states this clause in its verdict
//     (the others either omit it or, in imp-34007's case, mention it only in a
//     JSDoc header comment that is not part of the exported/checked verdict
//     string); no module carries an executable C_C-specific tripwire.

import { IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL } from './imp-34000-geometric-center-fourth-order-taylor-tail.js';
import { IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT } from './imp-34001-geometric-center-taylor-ratio-fit.js';
import { IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT } from './imp-34002-eps4-subsubleading-onset-coefficient.js';
import { IMP34003_F4_UNITY_CROSSING_LOCATOR } from './imp-34003-f4-unity-crossing-locator.js';
import { IMP34004_LNF2_SATURATION_LAW_FIT } from './imp-34004-lnf2-saturation-law-fit.js';
import { IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY } from './imp-34005-apex-curvature-fit-window-sensitivity.js';
import { IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION } from './imp-34006-pointwise-vs-window-exponent-cross-tabulation.js';
import { IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING } from './imp-34007-i1-roundoff-per-rung-lnN-scaling.js';

const SOTA_RE = /refereed bound is changed/i;
const IMP3066_PROSE_RE = /imp-3066[^.]*untouched/i;
const IMP3066_SPECIFIC_TRIPWIRE_RE = /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/;
const CMB_PROSE_RE = /C_mb[^.]*imp-486[^.]*UNTOUCHED/i;
const CC_PROSE_RE = /C_C 1\/8 ansatz[^.]*UNTOUCHED/i;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-34000',
    path: '/src/data/imp-34000-geometric-center-fourth-order-taylor-tail.js',
    isRigorousValue: IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.isRigorous,
    hasNoQed: /NO QED/.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict),
    hasSota: SOTA_RE.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict),
    tripwireChecksImp3066: false,
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34000_GEOMETRIC_CENTER_FOURTH_ORDER_TAYLOR_TAIL.verdict),
    tripwireChecksCc: false,
  }),
  Object.freeze({
    ticket: 'imp-34001',
    path: '/src/data/imp-34001-geometric-center-taylor-ratio-fit.js',
    isRigorousValue: IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.isRigorous,
    hasNoQed: /NO QED/.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict),
    hasSota: SOTA_RE.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict),
    tripwireChecksImp3066: false,
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34001_GEOMETRIC_CENTER_TAYLOR_RATIO_FIT.verdict),
    tripwireChecksCc: false,
  }),
  Object.freeze({
    ticket: 'imp-34002',
    path: '/src/data/imp-34002-eps4-subsubleading-onset-coefficient.js',
    isRigorousValue: IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.isRigorous,
    hasNoQed: /NO QED/.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    hasSota: SOTA_RE.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    tripwireChecksImp3066: IMP3066_SPECIFIC_TRIPWIRE_RE.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34002_EPS4_SUBSUBLEADING_ONSET_COEFFICIENT.verdict),
    tripwireChecksCc: false,
  }),
  Object.freeze({
    ticket: 'imp-34003',
    path: '/src/data/imp-34003-f4-unity-crossing-locator.js',
    isRigorousValue: IMP34003_F4_UNITY_CROSSING_LOCATOR.isRigorous,
    hasNoQed: /NO QED/.test(IMP34003_F4_UNITY_CROSSING_LOCATOR.verdict),
    hasSota: SOTA_RE.test(IMP34003_F4_UNITY_CROSSING_LOCATOR.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34003_F4_UNITY_CROSSING_LOCATOR.verdict),
    tripwireChecksImp3066: false,
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34003_F4_UNITY_CROSSING_LOCATOR.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34003_F4_UNITY_CROSSING_LOCATOR.verdict),
    tripwireChecksCc: false,
  }),
  Object.freeze({
    ticket: 'imp-34004',
    path: '/src/data/imp-34004-lnf2-saturation-law-fit.js',
    isRigorousValue: IMP34004_LNF2_SATURATION_LAW_FIT.isRigorous,
    hasNoQed: /NO QED/.test(IMP34004_LNF2_SATURATION_LAW_FIT.verdict),
    hasSota: SOTA_RE.test(IMP34004_LNF2_SATURATION_LAW_FIT.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34004_LNF2_SATURATION_LAW_FIT.verdict),
    tripwireChecksImp3066: false,
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34004_LNF2_SATURATION_LAW_FIT.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34004_LNF2_SATURATION_LAW_FIT.verdict),
    tripwireChecksCc: false,
  }),
  Object.freeze({
    ticket: 'imp-34005',
    path: '/src/data/imp-34005-apex-curvature-fit-window-sensitivity.js',
    isRigorousValue: IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.isRigorous,
    hasNoQed: /NO QED/.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict),
    hasSota: SOTA_RE.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict),
    tripwireChecksImp3066: false,
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34005_APEX_CURVATURE_FIT_WINDOW_SENSITIVITY.verdict),
    tripwireChecksCc: false,
  }),
  Object.freeze({
    ticket: 'imp-34006',
    path: '/src/data/imp-34006-pointwise-vs-window-exponent-cross-tabulation.js',
    isRigorousValue: IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.isRigorous,
    hasNoQed: /NO QED/.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict),
    hasSota: SOTA_RE.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict),
    tripwireChecksImp3066: false,
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34006_POINTWISE_VS_WINDOW_EXPONENT_CROSS_TABULATION.verdict),
    tripwireChecksCc: false,
  }),
  Object.freeze({
    ticket: 'imp-34007',
    path: '/src/data/imp-34007-i1-roundoff-per-rung-lnN-scaling.js',
    isRigorousValue: IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.isRigorous,
    hasNoQed: /NO QED/.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict),
    hasSota: SOTA_RE.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict),
    prosestatesImp3066Untouched: IMP3066_PROSE_RE.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict),
    tripwireChecksImp3066: false,
    prosestatesCmbUntouched: CMB_PROSE_RE.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict),
    tripwireChecksCmb: false,
    prosestatesCcUntouched: CC_PROSE_RE.test(IMP34007_I1_ROUNDOFF_PER_RUNG_LNN_SCALING.verdict),
    tripwireChecksCc: false,
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

const CC_GAP_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.prosestatesCcUntouched && !m.tripwireChecksCc)
  .map((m) => m.ticket);

export const IMP34079_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-34079-honesty-gate-audit',
  ticket: 'imp-34079',
  cohort: COHORT_HONESTY_GATES,
  imp3066GapTickets: IMP3066_GAP_TICKETS,
  imp3066CoveredTickets: IMP3066_COVERED_TICKETS,
  cmbGapTickets: CMB_GAP_TICKETS,
  ccGapTickets: CC_GAP_TICKETS,

  summary:
    'All eight imp-34000/34001/34002/34003/34004/34005/34006/34007 modules carry a build-time ' +
    'tripwire asserting isRigorous===false, NO QED, and no refereed bound is changed -- ' +
    'none relies on prose alone for the core honesty gate. Mirroring the imp-34145 audit (which ' +
    'checked both the imp-3066 and C_mb clauses), this cohort has three untouched-parent clauses ' +
    'stated in prose with UNEVEN executable coverage: imp-3066 K_a>=0 (stated by all 8, tripwired ' +
    'only in imp-34002), imp-486 C_mb GUE-conditional (stated by 7 of 8, tripwired in none), and the ' +
    'C_C 1/8 ansatz (stated by only imp-34005, tripwired in none).',

  verdict:
    'COHORT-PARTIALLY-COVERED: 8 of 8 modules pass the core isRigorous/NO-QED/SOTA tripwire. For the ' +
    'imp-3066 K_a>=0 untouched clause, 7 of 8 (imp-34000, imp-34001, imp-34003, imp-34004, imp-34005, ' +
    'imp-34006, imp-34007) state it only in prose with no clause-specific regex tripwire, while ' +
    'imp-34002 already carries one. For the imp-486 C_mb GUE-conditional untouched clause, 7 of 8 ' +
    'state it in prose (imp-34002 omits it) and none of the 8 has an executable tripwire for it. For ' +
    'the C_C 1/8 ansatz untouched clause, only imp-34005 states it in prose and it too lacks a ' +
    'tripwire. Reported as audit findings, not fixed here (audit-only scope, modifies none of the ' +
    'eight modules). Adds no new bound; imp-3066 K_a>=0 untouched; imp-486 C_mb GUE-conditional ' +
    'untouched; C_C 1/8 ansatz untouched; NO QED; no refereed bound is changed.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading each ' +
    'of the eight modules; does not modify any of the eight modules and adds no new bound. ' +
    'No refereed bound is changed.',
});

export const IMP34079_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34079-cohort-has-eight-modules',
    description: 'the audited cohort names exactly the eight imp-34000..34007 modules',
    holds: () => COHORT_HONESTY_GATES.length === 8
      && ['imp-34000', 'imp-34001', 'imp-34002', 'imp-34003', 'imp-34004', 'imp-34005', 'imp-34006', 'imp-34007'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-34079-all-eight-live-report-isrigorous-false',
    description: 'all eight modules live-report isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-34079-all-eight-carry-no-qed-and-sota',
    description: 'all eight modules carry NO QED text and the no-refereed-bound-change line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-34079-imp3066-gap-is-exactly-seven-of-eight',
    description: 'the imp-3066-tripwire coverage gap is exactly the seven non-imp-34002 modules',
    holds: () => IMP3066_GAP_TICKETS.length === 7
      && ['imp-34000', 'imp-34001', 'imp-34003', 'imp-34004', 'imp-34005', 'imp-34006', 'imp-34007'].every(
        (t) => IMP3066_GAP_TICKETS.includes(t)
      ) && !IMP3066_GAP_TICKETS.includes('imp-34002'),
  },
  {
    id: 'imp-34079-imp3066-covered-is-exactly-imp34002',
    description: 'the imp-3066-tripwire coverage already extends only to imp-34002',
    holds: () => IMP3066_COVERED_TICKETS.length === 1 && IMP3066_COVERED_TICKETS[0] === 'imp-34002',
  },
  {
    id: 'imp-34079-cmb-gap-is-exactly-seven-of-eight',
    description: 'the C_mb-tripwire coverage gap is exactly the seven modules stating C_mb in prose (all but imp-34002)',
    holds: () => CMB_GAP_TICKETS.length === 7 && !CMB_GAP_TICKETS.includes('imp-34002'),
  },
  {
    id: 'imp-34079-cc-gap-is-exactly-imp34005',
    description: 'the C_C 1/8 ansatz clause is stated (and untripwired) in exactly imp-34005',
    holds: () => CC_GAP_TICKETS.length === 1 && CC_GAP_TICKETS[0] === 'imp-34005',
  },
  {
    id: 'imp-34079-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP34079_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP34079_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP34079_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP34079_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP34079_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34079-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP34079_COHORT_HONESTY_GATE_AUDIT;
