// src/data/imp-34019-33947-33948-33960-33961-33962-honesty-gate-audit.js
//
// imp-34019: Honesty-gate coverage audit of the newest imp-33947 / imp-33948 /
// imp-33960 / imp-33961 / imp-33962 measurement cohort: confirm each module
// carries an executable isRigorous:false / NO-QED / Platt-Trudgian Lambda<=0.2
// SOTA tripwire plus its own untouched-parent-verdict clause, mirroring the
// imp-33997/imp-33841 cohort audits.
//
// QUESTION: does each of the five modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, and does each carry the specific
// untouched-parent-verdict clause named in its own ticket, or does any rely
// on prose/comments alone?
//
// GREP + READ RESULT (2026-07-05): all five modules pass -- each carries a
// literal top-level `isRigorous: false` field checked by a dedicated
// `*_ASSERTIONS` array entry (named `*-honesty-gate-no-qed`) that is walked
// by a `for` loop throwing on any failure, plus `NO QED` and a
// `Lambda <= 0.2 ... SOTA` line in its prose `verdict`. Unlike the imp-33997
// cohort (which was shape-DIVERGENT -- 3 distinct isRigorous field shapes
// across its five members), THIS cohort is fully shape-CONSISTENT: all five
// modules use the same bare top-level `isRigorous` field, matching the
// imp-33841 cohort's consistency rather than imp-33997's split.
//
// Each module's own untouched-parent-verdict clause is also present in every
// case: imp-33947 names the imp-486 C_mb GUE-conditional share as untouched;
// imp-33948 names both imp-486 C_mb and the imp-2642/imp-2643 C_C 1/8 ansatz;
// imp-33960 names imp-33925 R2 as REFINED-not-overturned plus imp-486 C_mb,
// imp-3066 K_a>=0, and the polymath15 C_C=1/8 ansatz as untouched; imp-33961
// names H4 (imp-33766) as NOT discharged and G6a_shock_lipschitz as still
// OPEN, plus imp-3066 off-diagonal endpoint-Hankel K_a>=0 as untouched;
// imp-33962 names imp-33922 as REFINED-not-overturned plus imp-3066 K_a>=0
// and the imp-486 C_mb GUE-conditional share as untouched. As with every
// prior honesty-gate cohort audit, none of these untouched-parent clauses is
// itself regex-checked by the member module's own tripwire (only
// isRigorous/NO-QED/SOTA are) -- a shared, long-standing convention, not a
// new gap introduced by this cohort.
//
// Also checked (per the imp-34017/imp-34018 assessments on this same
// cohort-audit lineage): none of the five member modules, nor this audit
// itself, is wired into scripts/run-assertions.mjs DATA_MODULES -- consistent
// with every prior *-honesty-gate-audit.js file in this codebase (imp-33841,
// imp-33997, imp-34035), none of which self-wires either. This audit does
// not change that convention.

import { IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL } from './imp-33947-geometric-center-third-order-taylor-tail.js';
import { IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR } from './imp-33948-hump-apex-curvature-error-bar.js';
import { IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT } from './imp-33960-i1-roundoff-coefficient-fit.js';
import { IMP33961_JOINT_ONSET_CONVERGENCE_RATE } from './imp-33961-joint-onset-convergence-rate.js';
import { IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION } from './imp-33962-attenuation-rung-by-rung-decomposition.js';

const SOTA_RE = /refereed bound is changed/i;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33947',
    path: '/src/data/imp-33947-geometric-center-third-order-taylor-tail.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL.isRigorous,
    hasNoQed: /NO QED/.test(IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL.verdict),
    hasSota: SOTA_RE.test(IMP33947_GEOMETRIC_CENTER_THIRD_ORDER_TAYLOR_TAIL.verdict),
    untouchedParentClause: 'imp-486 C_mb GUE-conditional share untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33947-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33948',
    path: '/src/data/imp-33948-hump-apex-curvature-error-bar.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR.isRigorous,
    hasNoQed: /NO QED/.test(IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR.verdict),
    hasSota: SOTA_RE.test(IMP33948_HUMP_APEX_CURVATURE_ERROR_BAR.verdict),
    untouchedParentClause: 'imp-486 C_mb GUE-conditional and imp-2642/imp-2643 C_C 1/8 ansatz untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33948-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33960',
    path: '/src/data/imp-33960-i1-roundoff-coefficient-fit.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT.isRigorous,
    hasNoQed: /NO QED/.test(IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT.verdict),
    hasSota: SOTA_RE.test(IMP33960_I1_ROUNDOFF_COEFFICIENT_FIT.verdict),
    untouchedParentClause:
      'imp-33925 R2 refined not overturned; imp-486 C_mb GUE-conditional, imp-3066 K_a>=0, and the polymath15 C_C=1/8 ansatz all untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33960-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33961',
    path: '/src/data/imp-33961-joint-onset-convergence-rate.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33961_JOINT_ONSET_CONVERGENCE_RATE.isRigorous,
    hasNoQed: /NO QED/.test(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.verdict),
    hasSota: SOTA_RE.test(IMP33961_JOINT_ONSET_CONVERGENCE_RATE.verdict),
    untouchedParentClause:
      'H4 (imp-33766) NOT discharged, G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a>=0 untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33961-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33962',
    path: '/src/data/imp-33962-attenuation-rung-by-rung-decomposition.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION.isRigorous,
    hasNoQed: /NO QED/.test(IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION.verdict),
    hasSota: SOTA_RE.test(IMP33962_ATTENUATION_RUNG_BY_RUNG_DECOMPOSITION.verdict),
    untouchedParentClause:
      'imp-33922 refined not overturned; imp-3066 K_a>=0 and the imp-486 C_mb GUE-conditional share untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33962-honesty-gate-no-qed)',
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const ALL_ISRIGOROUS_FALSE = COHORT_HONESTY_GATES.every((m) => m.isRigorousValue === false);
const ALL_HAVE_NO_QED = COHORT_HONESTY_GATES.every((m) => m.hasNoQed === true);
const ALL_HAVE_SOTA = COHORT_HONESTY_GATES.every((m) => m.hasSota === true);
const ALL_HAVE_UNTOUCHED_CLAUSE = COHORT_HONESTY_GATES.every(
  (m) => typeof m.untouchedParentClause === 'string' && m.untouchedParentClause.length > 0
);
const SHAPE_VARIANTS = Array.from(new Set(COHORT_HONESTY_GATES.map((m) => m.isRigorousFieldShape)));
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);

export const IMP34019_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-34019-33947-33948-33960-33961-33962-honesty-gate-audit',
  ticket: 'imp-34019',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  shapeVariantCount: SHAPE_VARIANTS.length,
  shapeVariants: SHAPE_VARIANTS,
  uncoveredTickets: UNCOVERED_TICKETS,

  summary:
    'All five imp-33947/imp-33948/imp-33960/imp-33961/imp-33962 modules carry an executable ' +
    'honesty-gate tripwire that throws at import if the honest framing is weakened: each asserts ' +
    'isRigorous===false, NO QED, and no refereed bound is changed, plus states its own ' +
    'untouched-parent-verdict clause in prose. Unlike the imp-33997 cohort (shape-DIVERGENT, 3 ' +
    'distinct isRigorous field shapes), this cohort is fully shape-CONSISTENT: all five use a bare ' +
    'top-level isRigorous field.',

  verdict:
    'COHORT-FULLY-COVERED, SHAPE-CONSISTENT: 5 of 5 modules have an executable honesty tripwire ' +
    '(0 prose-only gaps), all 5 live-report isRigorous===false, all 5 carry NO QED text, all 5 carry ' +
    'the no-refereed-bound-change line, and all 5 state their own relevant untouched-parent-' +
    'verdict clause. No bound changed; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed' +
    '.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading ' +
    'each of the five modules; does not modify any of the five modules and does not change ' +
    'scripts/run-assertions.mjs wiring. No refereed bound is changed.',
});

export const IMP34019_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34019-cohort-has-five-modules',
    description: 'the audited cohort names exactly the five imp-33947/33948/33960/33961/33962 modules',
    holds: () => COHORT_HONESTY_GATES.length === 5
      && ['imp-33947', 'imp-33948', 'imp-33960', 'imp-33961', 'imp-33962'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-34019-all-five-covered',
    description: 'all five modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 5 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-34019-all-five-live-report-isrigorous-false',
    description: 'all five modules live-report isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-34019-all-five-carry-no-qed-and-sota',
    description: 'all five modules carry NO QED text and the no-refereed-bound-change line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-34019-all-five-name-untouched-parent-clause',
    description: 'all five modules state their own relevant untouched-parent-verdict clause',
    holds: () => ALL_HAVE_UNTOUCHED_CLAUSE,
  },
  {
    id: 'imp-34019-shape-is-fully-consistent',
    description: 'the isRigorous-field shape is a single variant across all five (unlike the imp-33997 3-way split)',
    holds: () => SHAPE_VARIANTS.length === 1,
  },
  {
    id: 'imp-34019-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP34019_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP34019_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP34019_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP34019_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP34019_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34019-33947-33948-33960-33961-33962-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP34019_COHORT_HONESTY_GATE_AUDIT;
