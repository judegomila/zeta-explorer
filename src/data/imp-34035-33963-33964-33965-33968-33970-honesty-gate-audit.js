// src/data/imp-34035-33963-33964-33965-33968-33970-honesty-gate-audit.js
//
// imp-34035: Audit the honesty-gate assertion coverage across the
// imp-33963 / imp-33964 / imp-33965 / imp-33968 / imp-33970
// residual-diagnostic + joint-phase cohort -- confirm each module carries an
// executable no-QED / H4-not-discharged / imp-3066-untouched / PT-SOTA
// tripwire, mirroring the imp-33912 and imp-33997 cohort-audit pattern.
//
// QUESTION: does each of the five modules back its prose honest-status
// caveat with an EXECUTABLE build-time assertion that THROWS if the honest
// framing is weakened or removed, and specifically -- for the two modules
// that touch the H4 minimal-input condition (imp-33968, imp-33970) -- does
// the tripwire also verify dischargesH4===false and the imp-3066
// off-diagonal endpoint-Hankel K_a>=0-untouched clause, or does any of the
// five rely on prose/comments alone?
//
// GREP + READ RESULT (2026-07-05): all five modules pass the core no-QED /
// isRigorous:false / PT-SOTA tripwire. But the cohort is NOT uniform in
// scope: imp-33963/imp-33964/imp-33965 are residual-DIAGNOSTIC modules (DF
// unit-root test, Ljung-Box portmanteau test, Durbin-Watson exact
// permutation p-value) with no dischargesH4 field at all -- H4 is simply not
// in scope for them, so its absence is not a gap. Their tripwire checks
// isRigorous===false, /NO QED/, /remains SOTA/, and /12% multiplicative/
// (imp-33965 additionally checks /SUB-GAP/) against the verdict string --
// but none of the three regex-checks the "imp-3066 K_a >= 0 untouched"
// clause that IS present in each one's prose verdict text. imp-33968 and
// imp-33970 ARE H4-adjacent (each carries dischargesH4: false) and their
// tripwires DO additionally assert dischargesH4===false and regex-check the
// literal "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED" clause.
// So the one real, reportable gap: imp-33963/imp-33964/imp-33965 state
// "imp-3066 K_a >= 0 untouched" in prose but do not have it covered by an
// executable regex check, unlike their imp-33968/imp-33970 cohort-mates.
// This mirrors (rather than repeats) the imp-33997 cohort's finding of a
// shape/coverage divergence within an otherwise-passing cohort.

import { IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST } from './imp-33963-dickey-fuller-unit-root-test.js';
import { IMP33964_LJUNG_BOX_PORTMANTEAU_TEST } from './imp-33964-ljung-box-portmanteau-test.js';
import { IMP33965_DURBIN_WATSON_EXACT_PERMUTATION_PVALUE } from './imp-33965-durbin-watson-exact-permutation-pvalue.js';
import { IMP33968_WINDING_RATE_VS_ALPHA_CURVE } from './imp-33968-winding-rate-vs-alpha-curve.js';
import { IMP33970_JOINT_PHASE_ZERO_UNIQUENESS } from './imp-33970-joint-phase-zero-uniqueness.js';

const SOTA_RE = /Lambda <= 0.2 remains( the rigorous)? SOTA\.?$|Lambda <= 0.2 remains SOTA/;
const IMP3066_RE = /imp-3066[^.]*untouched/i;

const COHORT_HONESTY_GATES = Object.freeze([
  Object.freeze({
    ticket: 'imp-33963',
    path: '/src/data/imp-33963-dickey-fuller-unit-root-test.js',
    inScopeForH4: false,
    isRigorousValue: IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.isRigorous,
    hasNoQed: /NO QED/.test(IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdict),
    hasSota: SOTA_RE.test(IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33963_DICKEY_FULLER_UNIT_ROOT_TEST.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksDischargesH4: false,
  }),
  Object.freeze({
    ticket: 'imp-33964',
    path: '/src/data/imp-33964-ljung-box-portmanteau-test.js',
    inScopeForH4: false,
    isRigorousValue: IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.isRigorous,
    hasNoQed: /NO QED/.test(IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.verdict),
    hasSota: SOTA_RE.test(IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksDischargesH4: false,
  }),
  Object.freeze({
    ticket: 'imp-33965',
    path: '/src/data/imp-33965-durbin-watson-exact-permutation-pvalue.js',
    inScopeForH4: false,
    isRigorousValue: IMP33965_DURBIN_WATSON_EXACT_PERMUTATION_PVALUE.isRigorous,
    hasNoQed: /NO QED/.test(IMP33965_DURBIN_WATSON_EXACT_PERMUTATION_PVALUE.verdict),
    hasSota: SOTA_RE.test(IMP33965_DURBIN_WATSON_EXACT_PERMUTATION_PVALUE.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33965_DURBIN_WATSON_EXACT_PERMUTATION_PVALUE.verdict),
    tripwireChecksImp3066: false,
    tripwireChecksDischargesH4: false,
  }),
  Object.freeze({
    ticket: 'imp-33968',
    path: '/src/data/imp-33968-winding-rate-vs-alpha-curve.js',
    inScopeForH4: true,
    isRigorousValue: IMP33968_WINDING_RATE_VS_ALPHA_CURVE.isRigorous,
    dischargesH4Value: IMP33968_WINDING_RATE_VS_ALPHA_CURVE.dischargesH4,
    hasNoQed: /NO QED/.test(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.verdict),
    hasSota: SOTA_RE.test(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33968_WINDING_RATE_VS_ALPHA_CURVE.verdict),
    tripwireChecksImp3066: true,
    tripwireChecksDischargesH4: true,
  }),
  Object.freeze({
    ticket: 'imp-33970',
    path: '/src/data/imp-33970-joint-phase-zero-uniqueness.js',
    inScopeForH4: true,
    isRigorousValue: IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.isRigorous,
    dischargesH4Value: IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.dischargesH4,
    hasNoQed: /NO QED/.test(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.verdict),
    hasSota: SOTA_RE.test(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.verdict),
    prosestatesImp3066Untouched: IMP3066_RE.test(IMP33970_JOINT_PHASE_ZERO_UNIQUENESS.verdict),
    tripwireChecksImp3066: true,
    tripwireChecksDischargesH4: true,
  }),
]);

const ALL_ISRIGOROUS_FALSE = COHORT_HONESTY_GATES.every((m) => m.isRigorousValue === false);
const ALL_HAVE_NO_QED = COHORT_HONESTY_GATES.every((m) => m.hasNoQed === true);
const ALL_HAVE_SOTA = COHORT_HONESTY_GATES.every((m) => m.hasSota === true);
const ALL_PROSE_STATE_IMP3066 = COHORT_HONESTY_GATES.every((m) => m.prosestatesImp3066Untouched === true);
const H4_MEMBERS = COHORT_HONESTY_GATES.filter((m) => m.inScopeForH4);
const ALL_H4_MEMBERS_DISCHARGE_FALSE = H4_MEMBERS.every((m) => m.dischargesH4Value === false);
const GAP_TICKETS = COHORT_HONESTY_GATES
  .filter((m) => m.prosestatesImp3066Untouched && !m.tripwireChecksImp3066)
  .map((m) => m.ticket);

export const IMP34035_COHORT_HONESTY_GATE_AUDIT = Object.freeze({
  id: 'imp-34035-33963-33964-33965-33968-33970-honesty-gate-audit',
  ticket: 'imp-34035',
  cohort: COHORT_HONESTY_GATES,
  gapTickets: GAP_TICKETS,

  summary:
    'All five imp-33963/imp-33964/imp-33965/imp-33968/imp-33970 modules carry a build-time ' +
    'tripwire asserting isRigorous===false, NO QED, and Platt-Trudgian Lambda<=0.2 remains SOTA. ' +
    'The two H4-adjacent modules (imp-33968, imp-33970) additionally assert dischargesH4===false ' +
    'and regex-check the "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED" clause. The ' +
    'three residual-diagnostic modules (imp-33963/imp-33964/imp-33965) are not H4-related and ' +
    'correctly carry no dischargesH4 field, but each states "imp-3066 K_a >= 0 untouched" in prose ' +
    'without a matching executable check -- a coverage gap relative to their imp-33968/imp-33970 ' +
    'cohort-mates.',

  verdict:
    'COHORT-MOSTLY-COVERED, ONE GAP CLASS: 5 of 5 modules pass the core isRigorous/NO-QED/SOTA ' +
    'tripwire; 2 of 2 H4-adjacent modules (imp-33968, imp-33970) also gate dischargesH4 and the ' +
    'imp-3066-untouched clause. 3 of 5 (imp-33963, imp-33964, imp-33965) state imp-3066 K_a>=0 ' +
    'untouched only in prose, with no regex tripwire covering it -- flagged here as an audit ' +
    'finding, not fixed in this ticket (audit-only scope). No bound changed; H4 (imp-33766) stays ' +
    'undischarged; imp-3066 K_a>=0 untouched; NO QED; Platt-Trudgian Lambda <= 0.2 remains the ' +
    'rigorous SOTA.',

  honest:
    'AUDIT-ONLY -- reports the honesty-gate tripwire coverage found by live-importing and reading ' +
    'each of the five modules; does not modify any of the five modules and adds no new bound. ' +
    'Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.',
});

export const IMP34035_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34035-cohort-has-five-modules',
    description: 'the audited cohort names exactly the five imp-33963/33964/33965/33968/33970 modules',
    holds: () => COHORT_HONESTY_GATES.length === 5
      && ['imp-33963', 'imp-33964', 'imp-33965', 'imp-33968', 'imp-33970'].every(
        (t) => COHORT_HONESTY_GATES.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp-34035-all-five-live-report-isrigorous-false',
    description: 'all five modules live-report isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE,
  },
  {
    id: 'imp-34035-all-five-carry-no-qed-and-sota',
    description: 'all five modules carry NO QED text and the Platt-Trudgian Lambda<=0.2 SOTA line',
    holds: () => ALL_HAVE_NO_QED && ALL_HAVE_SOTA,
  },
  {
    id: 'imp-34035-all-five-state-imp3066-untouched-in-prose',
    description: 'all five modules state the imp-3066 K_a>=0 untouched clause in their prose verdict',
    holds: () => ALL_PROSE_STATE_IMP3066,
  },
  {
    id: 'imp-34035-h4-members-discharge-false',
    description: 'both H4-adjacent modules (imp-33968, imp-33970) live-report dischargesH4 === false',
    holds: () => H4_MEMBERS.length === 2 && ALL_H4_MEMBERS_DISCHARGE_FALSE,
  },
  {
    id: 'imp-34035-gap-is-exactly-the-three-non-h4-residual-diagnostics',
    description: 'the imp-3066-tripwire coverage gap is exactly imp-33963/33964/33965, not imp-33968/33970',
    holds: () => GAP_TICKETS.length === 3
      && ['imp-33963', 'imp-33964', 'imp-33965'].every((t) => GAP_TICKETS.includes(t))
      && !GAP_TICKETS.includes('imp-33968')
      && !GAP_TICKETS.includes('imp-33970'),
  },
  {
    id: 'imp-34035-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and PT Lambda <= 0.2 stays SOTA',
    holds: () => /AUDIT-ONLY/.test(IMP34035_COHORT_HONESTY_GATE_AUDIT.honest)
      && /Lambda <= 0.2 stays the rigorous SOTA/.test(IMP34035_COHORT_HONESTY_GATE_AUDIT.honest)
      && /NO QED/.test(IMP34035_COHORT_HONESTY_GATE_AUDIT.verdict)
      && /Lambda <= 0.2 remains the rigorous SOTA/.test(IMP34035_COHORT_HONESTY_GATE_AUDIT.verdict),
  },
];

for (const a of IMP34035_COHORT_HONESTY_GATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34035-33963-33964-33965-33968-33970-honesty-gate-audit assertion failed: ${a.id}`);
  }
}

export default IMP34035_COHORT_HONESTY_GATE_AUDIT;
