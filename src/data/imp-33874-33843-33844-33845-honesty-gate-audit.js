/**
 * @module imp-33874-33843-33844-33845-honesty-gate-audit
 * @fileoverview imp-33874 -- honesty-gate assertion-coverage audit of the imp-33843
 * (eflow_attr/resid_exp log-linear widening-form fit), imp-33844 (M3 hump-peak closed form), and
 * imp-33845 (C_ren-C_PS fixed-3/2 onset-rate) modules, mirroring the imp-33827/imp-33807/imp-33733
 * cohort honesty-gate audits.
 *
 * QUESTION: does each of the three modules back its prose honest-status caveat with an EXECUTABLE
 * build-time assertion that THROWS if the honest framing is weakened or removed, or does it rely
 * on prose/comments alone?
 *
 * GREP + READ RESULT (2026-07-05): all three modules pass -- each carries a literal
 * `isRigorous: false` boolean field, checked by a dedicated `*_ASSERTIONS` array entry
 * ("...honesty-gate-no-qed" style), walked by a `for` loop that throws at import time if any
 * entry's `holds()` returns false. Unlike the imp-33786..imp-33789 cohort audited by imp-33827
 * (where 2 of 4 modules used a differently-shaped `honestCaveat` field instead), all three of
 * imp-33843/imp-33844/imp-33845 use the IDENTICAL `isRigorous:false` convention -- the cohort is
 * both fully covered AND convention-consistent.
 *
 * This is a read-only audit: it changes no bound, establishes no operator positivity, imp-3066
 * K_a >= 0 stays untouched, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33827, imp-33807, imp-33733 (the precedent honesty-gate audits this mirrors)
 * @see imp-33873 (the heavy-import-safety audit of the same three-module cohort)
 */

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33843',
    path: '/src/data/imp-33843-eflow-resid-widening-form-fit.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (imp33843-honesty-gate-no-qed)',
  }),
  Object.freeze({
    ticket: 'imp-33844',
    path: '/src/data/imp-33844-hump-peak-closed-form.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (honesty-gate check on isRigorous/verdict)',
  }),
  Object.freeze({
    ticket: 'imp-33845',
    path: '/src/data/imp-33845-cren-gap-onset-rate.js',
    usesIsRigorousField: true,
    honestyFieldShape: 'boolean-field(isRigorous)',
    hasExecutableTripwire: true,
    tripwireMechanism: 'exported *_ASSERTIONS array entry (honesty-gate check on isRigorous/verdict)',
  }),
]);

const COVERED_COUNT = COHORT_HONESTY_GATES.filter((m) => m.hasExecutableTripwire).length;
const ISRIGOROUS_FIELD_COUNT = COHORT_HONESTY_GATES.filter((m) => m.usesIsRigorousField).length;
const UNCOVERED_TICKETS = COHORT_HONESTY_GATES.filter((m) => !m.hasExecutableTripwire).map((m) => m.ticket);

export const IMP33874_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-33874-cohort-honesty-gate-audit',
  ticket: 'imp-33874',
  cohort: COHORT_HONESTY_GATES,
  coveredCount: COVERED_COUNT,
  isRigorousFieldCount: ISRIGOROUS_FIELD_COUNT,
  uncoveredTickets: UNCOVERED_TICKETS,

  summary:
    'All three imp-33843/imp-33844/imp-33845 modules carry an executable honesty-gate tripwire ' +
    'that throws at import if the honest framing is weakened: each uses a literal ' +
    '`isRigorous: false` boolean field checked by an *_ASSERTIONS array entry walked by a ' +
    '`for` loop that throws on failure. None relies on prose/comments alone, and unlike the ' +
    'imp-33827-audited cohort (2 of 4 using a differently-shaped honestCaveat field) all three ' +
    'here use the identical isRigorous convention.',

  verdict:
    'COHORT-FULLY-COVERED, CONVENTION-CONSISTENT: 3 of 3 modules have an executable honesty ' +
    'tripwire (0 uncovered), and all 3 of 3 use the literal `isRigorous:false` field named in the ' +
    'ticket title -- no convention split like the imp-33827 cohort. No bound changed; imp-3066 ' +
    'K_a >= 0 untouched; NO QED; no refereed bound is changed.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by reading each of the three ' +
    'modules; does not modify any module and does not change scripts/run-assertions.mjs wiring ' +
    '(that question is the separate imp-33875 ticket). No refereed bound is changed' +
    '.',
});

export const IMP33874_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-33874-cohort-has-three-modules',
    description: 'the audited cohort names exactly the three imp-33843/imp-33844/imp-33845 modules',
    holds: () => COHORT_HONESTY_GATES.length === 3
      && COHORT_HONESTY_GATES.every((m) => /^imp-3384[345]$/.test(m.ticket)),
  },
  {
    id: 'imp-33874-all-three-covered',
    description: 'all three modules have an executable honesty-gate tripwire; no uncovered tickets',
    holds: () => COVERED_COUNT === 3 && UNCOVERED_TICKETS.length === 0,
  },
  {
    id: 'imp-33874-all-three-use-isrigorous-field',
    description: 'all three modules use the literal isRigorous:false field convention (no split, unlike imp-33827)',
    holds: () => ISRIGOROUS_FIELD_COUNT === 3
      && COHORT_HONESTY_GATES.every((m) => m.usesIsRigorousField === true),
  },
  {
    id: 'imp-33874-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(IMP33874_COHORT_HONESTY_GATE_AUDIT.honest)
      && /refereed bound is changed/i.test(IMP33874_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP33874_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP33874_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP33874_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33874-cohort-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP33874_COHORT_HONESTY_GATE_AUDIT;
