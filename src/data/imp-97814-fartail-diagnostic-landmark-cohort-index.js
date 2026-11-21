/**
 * @module imp-97814-fartail-diagnostic-landmark-cohort-index
 * @fileoverview imp-97814 -- META cross-reference index grouping the far-tail FULL-DIAGNOSTIC
 *   landmark cohort (imp-97723, imp-97745, imp-97759, imp-97777, imp-97781, imp-97782) by ROLE:
 *   closed-form asymptote (does the deep-tail diagnostic (1/2-p)*2 log T0 reach exactly 1?),
 *   presentation (viz of that asymptote), rising-branch floor-sensitivity (where does the
 *   E_trunc floor stop mattering to the far-tail crossings?), local-minimum pin (where does the
 *   full diagnostic bottom out before rising?), hump-peak pin (where does the small-N sigma*log T0
 *   hump peak?), and a companion knee-landmark E_flow sensitivity (how does the SEPARATE sigma(N)
 *   decay-exponent knee move relative to the E_coll=E_trunc crossover under an E_flow amplitude
 *   swap?). Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE SIX ROLES (one ticket each; five share the full-diagnostic chain, the sixth is a
 *   companion landmark on the adjacent sigma(N) ramp using the identical floor/amplitude-swap
 *   sensitivity methodology).
 *
 *   ROLE 1 -- CLOSED-FORM ASYMPTOTE (imp-97723). Extends the imp-97702 deep-tail diagnostic grid
 *     to 1e300 and derives the CLOSED FORM: (1/2-p)*2 log T0 is EXACTLY the Riemann-von Mangoldt
 *     log-derivative slope 1 - 1/log(T0/2pi), which climbs 0.9805 (1e24) -> 0.9989 (1e300) and
 *     converges to EXACTLY 1 (not a ~0.98 floor), crossing 0.99 near 1e45 and 0.995 near 1e89.
 *
 *   ROLE 2 -- PRESENTATION (imp-97745). Import-light viz-data leaf charting the ROLE 1 ladder and
 *     RvM-slope overlay verbatim; no new computation.
 *
 *   ROLE 3 -- RISING-BRANCH FLOOR-SENSITIVITY (imp-97759). Runs the imp-33708 0.5x..5x E_trunc
 *     floor swap on the FULL diagnostic and pins the crossover height (N ~ 1e20.7) below which the
 *     floor still shifts a rising-branch crossing by > 1% in log10 N; above it, sensitivity decays
 *     super-fast (~2.67% at 1e20.3 down to ~3.2e-12% at 1e45.4). Confirms imp-97744 F4: every
 *     headline 0.99/0.995/0.999 crossing is floor-insensitive to < 1e-11.
 *
 *   ROLE 4 -- LOCAL-MINIMUM PIN (imp-97777). Pins, by derivative root-finding (not golden-section),
 *     the full diagnostic's local minimum at log10 N = 18.77232, diag = 0.9760709. The MINIMUM
 *     LOCATION is strongly floor-sensitive (~2.43 decades across the 0.5x..5x swap, elasticity
 *     ~ -2.43) while its VALUE is nearly floor-insensitive (~0.34%, elasticity ~ -3.3e-3).
 *
 *   ROLE 5 -- HUMP-PEAK PIN (imp-97782). Companion to ROLE 4: pins the small-N hump peak at
 *     log10 N = 7.76832, diag = 14.89166 (sigma ~ 0.865), where BOTH the location (~1.79 decades,
 *     elasticity ~ -1.79) and the value (~27.5%, elasticity ~ -4.09) are strongly floor-sensitive
 *     -- the opposite extreme from ROLE 3's floor-insensitive far-tail crossings.
 *
 *   ROLE 6 -- KNEE-CROSSOVER E_FLOW SENSITIVITY (imp-97781). A companion landmark on the adjacent
 *     sigma(N) decay-exponent ramp (not the (1/2-p)*2 log T0 diagnostic): re-pins the imp-33721
 *     knee N* ~ 3.377e9 and its offsets to N_cross (+2.95%) and N_half (+3.36%), then shows N_cross
 *     is EXACTLY E_flow-independent while the knee-to-crossover offset is strongly E_flow-sensitive
 *     (E_flow OFF -> +4.74%, x2 amplitude -> +1.20%) because the knee is a curvature landmark that
 *     amplifies the tiny E_flow/E_trunc ~ 1.9e-3 ratio by ~1000x.
 *
 *   WHY GROUP THESE. ROLES 1-2 settle the deep-tail LIMIT of the full diagnostic; ROLES 3-5 map
 *     its floor-sensitivity across every named landmark (rising-branch crossings, minimum, hump
 *     peak) with a clean floor-insensitive-vs-floor-sensitive split governed by how close sigma
 *     sits to 1 there; ROLE 6 runs the analogous amplitude-swap sensitivity on the neighbouring
 *     sigma(N) knee, showing the same curvature-amplification pattern. Filed across a wide id
 *     range, together they form one floor/amplitude-sensitivity map of the far-tail landmark family.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - ROLE 1: diagnostic converges to EXACTLY 1; crosses 0.99 near 1e45, 0.995 near 1e89 (imp-97723).
 *   - ROLE 2: presentation-only viz of ROLE 1 (imp-97745).
 *   - ROLE 3: > 1% floor-sensitivity crossover at N ~ 1e20.7; headline crossings floor-insensitive
 *     to < 1e-11 (imp-97759).
 *   - ROLE 4: local minimum at log10 N = 18.77232, diag = 0.9760709; location floor-sensitive
 *     (elasticity ~ -2.43), value floor-insensitive (elasticity ~ -3.3e-3) (imp-97777).
 *   - ROLE 5: hump peak at log10 N = 7.76832, diag = 14.89166; BOTH location (elasticity ~ -1.79)
 *     and value (elasticity ~ -4.09) floor-sensitive (imp-97782).
 *   - ROLE 6: knee N* ~ 3.377e9, offsets +2.95%/+3.36% to N_cross/N_half at baseline; N_cross is
 *     E_flow-independent, offset sensitivity ~ -1.77 points per unit E_flow amplitude (imp-97781).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - No rigorous asymptotic derivation anywhere in the chain: all six tickets extrapolate the
 *     inherited imp-3220/imp-3406/imp-97702 component model and the imp-33708 floor swap / imp-398
 *     E_flow prefactor, none re-derived.
 *   - The C_mb GUE-conditional (imp-486) and C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED
 *     throughout; imp-3066 K_a >= 0 untouched.
 *   - No coefficient newly pinned toward a bound; no operator positivity established.
 *
 *   STATUS: a grouping/index note over six already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js (ROLE 1: closed-form asymptote to exactly 1)
 * @see imp-97745-fartail-diagnostic-asymptote-viz-data.js (ROLE 2: presentation of ROLE 1)
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js (ROLE 3: rising-branch floor-sensitivity crossover)
 * @see imp-97777-fartail-diagnostic-local-minimum-pin.js (ROLE 4: local-minimum pin + floor sensitivity)
 * @see imp-97781-knee-crossover-eflow-sensitivity.js (ROLE 6: companion knee-landmark E_flow sensitivity)
 * @see imp-97782-fartail-diagnostic-hump-peak-pin.js (ROLE 5: hump-peak pin + floor sensitivity)
 *
 * Ticket: imp-97814 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- reference constant carried by convention

const CLOSED_FORM_ASYMPTOTE_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97723',
    role: 'closed-form-asymptote',
    step: 'extend the deep-tail diagnostic grid to 1e300 and derive its closed form',
    result:
      'the diagnostic (1/2-p)*2 log T0 IS EXACTLY the RvM log-derivative slope ' +
      '1 - 1/log(T0/2pi), climbing 0.9805 (1e24) -> 0.9989 (1e300) and converging to EXACTLY 1, ' +
      'crossing 0.99 near 1e45 and 0.995 near 1e89.',
  }),
]);

const PRESENTATION_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97745',
    role: 'presentation',
    step: 'chart the ROLE 1 ladder and RvM-slope overlay',
    result: 'import-light viz-data leaf reusing ROLE 1 verbatim; no new computation.',
  }),
]);

const RISING_BRANCH_FLOOR_SENSITIVITY_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97759',
    role: 'rising-branch-floor-sensitivity',
    step: 'run the imp-33708 0.5x..5x E_trunc floor swap on the full diagnostic and pin the >1% crossover height',
    result:
      'the floor moves a rising-branch crossing by > 1% only below N ~ 1e20.7; above it ' +
      'sensitivity decays super-fast (~2.67% at 1e20.3 to ~3.2e-12% at 1e45.4); every ' +
      'imp-97744 headline 0.99/0.995/0.999 crossing is floor-insensitive to < 1e-11.',
  }),
]);

const LOCAL_MINIMUM_PIN_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97777',
    role: 'local-minimum-pin',
    step: 'pin the full diagnostic local minimum by derivative root-finding and its floor sensitivity',
    result:
      'minimum at log10 N = 18.77232, diag = 0.9760709; LOCATION strongly floor-sensitive ' +
      '(~2.43 decades, elasticity ~ -2.43) while VALUE is nearly floor-insensitive (~0.34%, ' +
      'elasticity ~ -3.3e-3).',
  }),
]);

const HUMP_PEAK_PIN_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97782',
    role: 'hump-peak-pin',
    step: 'pin the small-N sigma*log T0 hump peak by derivative root-finding and its floor sensitivity',
    result:
      'peak at log10 N = 7.76832, diag = 14.89166 (sigma ~ 0.865); BOTH location ' +
      '(~1.79 decades, elasticity ~ -1.79) and value (~27.5%, elasticity ~ -4.09) strongly ' +
      'floor-sensitive -- the opposite extreme from the ROLE 3 far-tail crossings.',
  }),
]);

const KNEE_EFLOW_SENSITIVITY_ROLE = Object.freeze([
  Object.freeze({
    id: 'imp-97781',
    role: 'knee-eflow-sensitivity',
    step: 'sweep an E_flow amplitude knob and pin the offset of the sigma(N) decay-exponent knee to the E_coll=E_trunc crossover',
    result:
      'baseline knee N* ~ 3.377e9 with offsets +2.95%/+3.36% to N_cross/N_half; N_cross is ' +
      'EXACTLY E_flow-independent while the knee-to-crossover offset moves ~ -1.77 points per ' +
      'unit E_flow amplitude (E_flow OFF -> +4.74%, x2 -> +1.20%), a curvature landmark ' +
      'amplifying E_flow/E_trunc ~ 1.9e-3 by ~1000x.',
  }),
]);

export const IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX = Object.freeze({
  id: 'imp-97814',
  proofSection: 'S-frontier',
  closedFormAsymptoteRole: CLOSED_FORM_ASYMPTOTE_ROLE,
  presentationRole: PRESENTATION_ROLE,
  risingBranchFloorSensitivityRole: RISING_BRANCH_FLOOR_SENSITIVITY_ROLE,
  localMinimumPinRole: LOCAL_MINIMUM_PIN_ROLE,
  humpPeakPinRole: HUMP_PEAK_PIN_ROLE,
  kneeEflowSensitivityRole: KNEE_EFLOW_SENSITIVITY_ROLE,
  measuredSignal:
    'six far-tail diagnostic/landmark leaves (imp-97723, imp-97745, imp-97759, imp-97777, ' +
    'imp-97781, imp-97782) grouped by role: closed-form asymptote, presentation, rising-branch ' +
    'floor-sensitivity, local-minimum pin, hump-peak pin, and a companion knee-landmark E_flow ' +
    'sensitivity.',
  namedResiduals: [
    'IMP97723_DIAGNOSTIC_CONVERGES_TO_EXACTLY_ONE',
    'IMP97745_PRESENTATION_ONLY',
    'IMP97759_FLOOR_CROSSOVER_AT_1E20P7',
    'IMP97777_LOCAL_MIN_LOCATION_FLOOR_SENSITIVE_VALUE_NOT',
    'IMP97782_HUMP_PEAK_BOTH_LOCATION_AND_VALUE_FLOOR_SENSITIVE',
    'IMP97781_KNEE_OFFSET_EFLOW_SENSITIVE_NCROSS_NOT',
  ],
  certifiedReach: 0.96,
  role1DiagnosticLimit: 1,
  role3FloorCrossoverLog10N: 20.7,
  role4MinimumLog10N: 18.77232,
  role4MinimumValue: 0.9760709,
  role4LocationElasticity: -2.43,
  role4ValueElasticity: -3.3e-3,
  role5PeakLog10N: 7.76832,
  role5PeakValue: 14.89166,
  role5LocationElasticity: -1.79,
  role5ValueElasticity: -4.09,
  role6KneeOffsetVsCrossBaseline: 0.0295,
  role6KneeOffsetVsHalfBaseline: 0.0336,
  role6OffsetSensitivityPerAmp: -0.0177,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  anyBoundMoved: false,
  question:
    'The six far-tail diagnostic/landmark tickets imp-97723, imp-97745, imp-97759, imp-97777, ' +
    'imp-97781, imp-97782, filed across a wide id range, each pin a different landmark or ' +
    'sensitivity of the same sigma(N)-derived diagnostic family. Split by role -- closed-form ' +
    'asymptote versus presentation versus rising-branch floor-sensitivity versus local-minimum ' +
    'pin versus hump-peak pin versus knee E_flow sensitivity -- does each settle a distinct piece ' +
    'of the floor/amplitude-sensitivity map, and is the split consistent (floor-insensitive ' +
    'crossings where sigma -> 0, floor-sensitive landmarks where sigma is not small)?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The split is consistent: ROLE 1-2 pin the deep-tail ' +
    'diagnostic LIMIT at exactly 1; ROLE 3 shows the far-tail rising-branch crossings (sigma -> 0) ' +
    'are floor-insensitive to < 1e-11; ROLE 4 shows the local minimum straddles the transition ' +
    '(location floor-sensitive, value not); ROLE 5 shows the small-N hump peak (sigma ~ 0.865, ' +
    'not small) is floor-sensitive in BOTH location and value; ROLE 6 shows the adjacent sigma(N) ' +
    'knee is a curvature landmark that amplifies a tiny E_flow/E_trunc ratio by ~1000x, while its ' +
    'E_coll=E_trunc crossover reference stays exactly E_flow-independent. No bound moves in any ' +
    'role: interval-rigorous certified reach stays EXACTLY 2a<=0.96, the C_mb GUE-conditional ' +
    '(imp-486) and C_C 1/8 ansatz (imp-2642/imp-2643) stay untouched throughout, and no operator ' +
    'positivity is established. RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97723 (closed-form asymptote to exactly 1); imp-97745 (presentation); imp-97759 ' +
    '(rising-branch floor-sensitivity crossover ~1e20.7); imp-97777 (local-minimum pin, ' +
    'location floor-sensitive, value not); imp-97782 (hump-peak pin, both floor-sensitive); ' +
    'imp-97781 (knee-to-crossover E_flow sensitivity, N_cross E_flow-independent).',
  ln3: LN3,
});

export default IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97814-all-six-roles-present-and-correctly-tagged',
    why: 'The six-role split must contain exactly the six far-tail diagnostic tickets named in ' +
      'the ticket title, one per role, each tagged with the matching role string.',
    holds: () => {
      const idx = IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;
      const roles = [
        [idx.closedFormAsymptoteRole, 'imp-97723', 'closed-form-asymptote'],
        [idx.presentationRole, 'imp-97745', 'presentation'],
        [idx.risingBranchFloorSensitivityRole, 'imp-97759', 'rising-branch-floor-sensitivity'],
        [idx.localMinimumPinRole, 'imp-97777', 'local-minimum-pin'],
        [idx.humpPeakPinRole, 'imp-97782', 'hump-peak-pin'],
        [idx.kneeEflowSensitivityRole, 'imp-97781', 'knee-eflow-sensitivity'],
      ];
      return roles.every(
        ([arr, id, role]) => arr.length === 1 && arr[0].id === id && arr[0].role === role,
      );
    },
  },
  {
    id: 'imp97814-six-tickets-total-no-overlap',
    why: 'The index covers exactly six tickets in six disjoint roles; an overlap or a dropped ' +
      'ticket would misreport the cohort.',
    holds: () => {
      const idx = IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;
      const allIds = [
        ...idx.closedFormAsymptoteRole.map((c) => c.id),
        ...idx.presentationRole.map((c) => c.id),
        ...idx.risingBranchFloorSensitivityRole.map((c) => c.id),
        ...idx.localMinimumPinRole.map((c) => c.id),
        ...idx.humpPeakPinRole.map((c) => c.id),
        ...idx.kneeEflowSensitivityRole.map((c) => c.id),
      ];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        allIds.length === 6 &&
        noOverlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 6
      );
    },
  },
  {
    id: 'imp97814-diagnostic-limit-is-exactly-one',
    why: 'imp-97723 established the deep-tail diagnostic converges to EXACTLY 1, not a ~0.98 floor.',
    holds: () => {
      const idx = IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;
      return idx.role1DiagnosticLimit === 1;
    },
  },
  {
    id: 'imp97814-minimum-value-below-peak-value',
    why: 'the pinned local-minimum value must sit strictly below the pinned hump-peak value and ' +
      'below the asymptotic limit of 1, matching the source tickets ordering: peak (~14.89) > ' +
      'limit (1) > minimum (~0.976).',
    holds: () => {
      const idx = IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;
      return (
        idx.role4MinimumValue < idx.role1DiagnosticLimit &&
        idx.role1DiagnosticLimit < idx.role5PeakValue &&
        idx.role5PeakLog10N < idx.role4MinimumLog10N
      );
    },
  },
  {
    id: 'imp97814-floor-sensitivity-split-consistent-with-sigma-proximity',
    why: 'ROLE 4 (minimum, sigma small) must show |value elasticity| << |location elasticity|, ' +
      'while ROLE 5 (peak, sigma ~ 0.865) must show both elasticities large -- the qualitative ' +
      'split each source ticket reports.',
    holds: () => {
      const idx = IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;
      return (
        Math.abs(idx.role4ValueElasticity) < Math.abs(idx.role4LocationElasticity) &&
        Math.abs(idx.role5ValueElasticity) > 1 &&
        Math.abs(idx.role5LocationElasticity) > 1
      );
    },
  },
  {
    id: 'imp97814-knee-offset-positive-baseline-negative-sensitivity',
    why: 'imp-97781 reports positive baseline offsets (knee above both crossover and halving) ' +
      'that DECREASE as E_flow amplitude increases (negative slope).',
    holds: () => {
      const idx = IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;
      return (
        idx.role6KneeOffsetVsCrossBaseline > 0 &&
        idx.role6KneeOffsetVsHalfBaseline > idx.role6KneeOffsetVsCrossBaseline &&
        idx.role6OffsetSensitivityPerAmp < 0
      );
    },
  },
  {
    id: 'imp97814-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () => {
      const idx = IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX;
      return (
        idx.anyBoundMoved === false &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3 &&
        /NO QED/.test(idx.verdict) &&
        /refereed bound is changed/i.test(idx.verdict) &&
        /2a<=0\.96/.test(idx.verdict)
      );
    },
  },
];

for (const assertion of IMP97814_FARTAIL_DIAGNOSTIC_LANDMARK_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97814-fartail-diagnostic-landmark-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
