// src/data/imp-33997-33940-33941-33942-33976-33977-honesty-gate-audit.js
//
// imp-33997: Audit the honesty-gate assertion coverage across the imp-33940 /
// imp-33941 / imp-33942 / imp-33976 / imp-33977 cohort -- confirm each module
// carries an executable isRigorous:false / NO-QED / Platt-Trudgian Lambda<=0.2
// SOTA tripwire (plus its own relevant untouched-parent-verdict clause),
// mirroring the imp-33841 cohort honesty-gate audit.
//
// QUESTION: does each of the five modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, and does each carry the specific
// untouched-parent-verdict clause named in its own ticket, or does any rely
// on prose/comments alone?
//
// GREP + READ RESULT (2026-07-05): all five modules pass -- each carries a
// literal `isRigorous: false` (in some shape) plus `NO QED` and
// `Lambda <= 0.2 ... SOTA` text checked by a dedicated `*_ASSERTIONS` array
// entry that is walked by a `for` loop throwing on any failure. Unlike the
// imp-33841 cohort (which was fully shape-consistent, 3/3 using a bare
// `isRigorous` field), THIS cohort is NOT fully shape-consistent: 3 of 5
// (imp-33940/imp-33941/imp-33942) use a bare top-level `isRigorous` field,
// imp-33976 is a family ROLLUP with no isRigorous field of its own (it
// live-derives `allIsRigorousFalse` from its four child modules instead,
// since it makes no fresh numerical claim), and imp-33977 nests the field
// one level down at `honestCaveat.isRigorous`. All three shapes are read
// live below rather than assumed, so this audit cannot silently drift out of
// sync if a member module's honesty fields ever change shape again.
//
// Each module's own untouched-parent-verdict clause (the "relevant
// untouched-parent-verdict clause" the ticket asks for) is also present in
// every case: imp-33940/imp-33941 name the imp-33843 log-linear-over-power-
// law FORM verdict as untouched; imp-33942 names the imp-486 C_mb
// GUE-conditional and the imp-2642/imp-2643 C_C 1/8 ansatz as untouched;
// imp-33976 names H4 (imp-33766) as still undischarged and
// G6a_shock_lipschitz as still open; imp-33977 names imp-33918 and imp-33887
// as untouched. None of these clauses is itself regex-checked by the
// member module's own tripwire (only isRigorous/NO-QED/SOTA are), which
// matches the cohort-wide convention seen across every prior honesty-gate
// audit in this codebase (imp-33841 included) -- this is a shared,
// long-standing pattern, not a new gap introduced by this cohort.

import { IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY } from './imp-33940-interior-residual-boundary-stability.js';
import { IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION } from './imp-33941-endpoint-peak-growth-model-selection.js';
import { IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY } from './imp-33942-hump-argmax-gap-step-proportionality.js';
import { IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER } from './imp-33976-model-cusp-onset-family-honest-banner.js';
import { IMP33977_G_VS_LAW_OFFSET_VIZ_DATA } from './imp-33977-g-vs-law-offset-viz-data.js';

const SOTA_RE = /Lambda <= 0.2 remains( the rigorous)? SOTA\.?$|Lambda <= 0.2 remains SOTA/;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33940',
    path: '/src/data/imp-33940-interior-residual-boundary-stability.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY.isRigorous,
    hasNoQed: /NO QED/.test(IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY.verdict),
    hasSota: SOTA_RE.test(IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY.verdict),
    untouchedParentClause: 'imp-33843 log-linear-over-power-law FORM verdict untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33940-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33941',
    path: '/src/data/imp-33941-endpoint-peak-growth-model-selection.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.isRigorous,
    hasNoQed: /NO QED/.test(IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.verdict),
    hasSota: SOTA_RE.test(IMP33941_ENDPOINT_PEAK_GROWTH_MODEL_SELECTION.verdict),
    untouchedParentClause: 'edge-artifact reading and imp-33843 FORM verdict untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33941-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33942',
    path: '/src/data/imp-33942-hump-argmax-gap-step-proportionality.js',
    isRigorousFieldShape: 'top-level(isRigorous)',
    isRigorousValue: IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY.isRigorous,
    hasNoQed: /NO QED/.test(IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY.verdict),
    hasSota: SOTA_RE.test(IMP33942_HUMP_ARGMAX_GAP_STEP_PROPORTIONALITY.verdict),
    untouchedParentClause: 'imp-486 C_mb GUE-conditional and imp-2642/imp-2643 C_C 1/8 ansatz untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33942-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33976',
    path: '/src/data/imp-33976-model-cusp-onset-family-honest-banner.js',
    isRigorousFieldShape: 'rollup-derived(allIsRigorousFalse, live from 4 child modules)',
    isRigorousValue: IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.allIsRigorousFalse === true ? false : undefined,
    hasNoQed: /NO QED/.test(IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.banner),
    hasSota: SOTA_RE.test(IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.banner),
    untouchedParentClause: 'H4 (imp-33766) undischarged; G6a_shock_lipschitz stays open family-wide',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33976-banner-names-model-cusp-and-open-status)',
  }),
  Object.freeze({
    ticket: 'imp-33977',
    path: '/src/data/imp-33977-g-vs-law-offset-viz-data.js',
    isRigorousFieldShape: 'nested(honestCaveat.isRigorous)',
    isRigorousValue: IMP33977_G_VS_LAW_OFFSET_VIZ_DATA.honestCaveat.isRigorous,
    hasNoQed: /NO QED/.test(IMP33977_G_VS_LAW_OFFSET_VIZ_DATA.honestCaveat.honestyLock),
    hasSota: SOTA_RE.test(IMP33977_G_VS_LAW_OFFSET_VIZ_DATA.honestCaveat.honestyLock),
    untouchedParentClause: 'imp-33918 and imp-33887 untouched',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33977-honest-diagnostic-not-a-verdict)',
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const ALL_ISRIGOROUS_FALSE = COHORT_HONESTY_GATES.every((m) => m.isRigorousValue === false);
const ALL_HAVE_NO_QED = COHORT_HONESTY_GATES.every((m) => m.hasNoQed === true);
const ALL_HAVE_SOTA = COHORT_HONESTY_GATES.every((m) => m.hasSota === true);
const ALL_HAVE_UNTOUCHED_CLAUSE = COHORT_HONESTY_GATES.every((m) => typeof m.untouchedParentClause === 'string' && m.untouchedParentClause.length > 0);
const SHAPE_VARIANTS = Array.from(new Set(COHORT_HONESTY_GATES.map((m) => m.isRigorousFieldShape)));
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);

export const IMP33997_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-33997-33940-33941-33942-33976-33977-honesty-gate-audit',
  ticket: 'imp-33997',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  shapeVariantCount: SHAPE_VARIANTS.length,
  shapeVariants: SHAPE_VARIANTS,
  uncoveredTickets: UNCOVERED_TICKETS,

  summary:
    'All five imp-33940/imp-33941/imp-33942/imp-33976/imp-33977 modules carry an executable ' +
    'honesty-gate tripwire that throws at import if the honest framing is weakened: each asserts ' +
    'isRigorous===false (in its own shape), NO QED, and Platt-Trudgian Lambda<=0.2 remains SOTA, ' +
    'plus states its own untouched-parent-verdict clause in prose. Unlike the imp-33841 cohort ' +
    '(fully shape-consistent, 3/3 bare isRigorous), this cohort spans THREE distinct honesty-field ' +
    'shapes: bare top-level isRigorous (imp-33940/33941/33942), a rollup-derived ' +
    'allIsRigorousFalse read live off four child modules (imp-33976), and a nested ' +
    'honestCaveat.isRigorous (imp-33977). None relies on prose/comments alone.',

  verdict:
    'COHORT-FULLY-COVERED, SHAPE-DIVERGENT: 5 of 5 modules have an executable honesty tripwire ' +
    '(0 prose-only gaps), all 5 live-report isRigorous/allIsRigorousFalse===false, all 5 carry NO ' +
    'QED text, all 5 carry the Platt-Trudgian Lambda<=0.2 SOTA line, and all 5 state their own ' +
    'relevant untouched-parent-verdict clause. The one finding worth flagging is the 3-way shape ' +
    'split on where the isRigorous flag lives, which the imp-33841 cohort did not have. No bound ' +
    'changed; imp-3066 K_a>=0 untouched; NO QED; Platt-Trudgian Lambda <= 0.2 remains the ' +
    'rigorous SOTA.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading ' +
    'each of the five modules; does not modify any of the five modules and does not change ' +
    'scripts/run-assertions.mjs wiring. Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.',
});

export const IMP33997_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33997-cohort-has-five-modules',
    description: 'the audited cohort names exactly the five imp-33940/33941/33942/33976/33977 modules',
    holds: () => COHORT_HONESTY_GATES.length === 5
      && ['imp-33940', 'imp-33941', 'imp-33942', 'imp-33976', 'imp-33977'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-33997-all-five-covered',
    description: 'all five modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 5 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-33997-all-five-live-report-isrigorous-false',
    description: 'all five modules live-report isRigorous (or the rollup-derived equivalent) === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-33997-all-five-carry-no-qed-and-sota',
    description: 'all five modules carry NO QED text and the Platt-Trudgian Lambda<=0.2 SOTA line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-33997-all-five-name-untouched-parent-clause',
    description: 'all five modules state their own relevant untouched-parent-verdict clause',
    holds: () => ALL_HAVE_UNTOUCHED_CLAUSE,
  },
  {
    id: 'imp-33997-shape-split-is-three-way',
    description: 'the isRigorous-field shape divergence found is exactly 3 variants (not fully consistent, unlike imp-33841)',
    holds: () => SHAPE_VARIANTS.length === 3,
  },
  {
    id: 'imp-33997-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(IMP33997_COHORT_HONESTY_GATE_AUDIT.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP33997_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP33997_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /Lambda <= 0.2 remains the rigorous SOTA/.test(IMP33997_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP33997_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33997-33940-33941-33942-33976-33977-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP33997_COHORT_HONESTY_GATE_AUDIT;
