/**
 * @module imp-97615-sigma-landmark-sensitivity-cohort-index
 * @fileoverview imp-97615 -- META cross-reference index grouping the sigma(N) = E_coll/E_N
 *   landmark-ladder cohort (imp-97520, imp-97565, imp-36139, imp-97584, imp-97585) so the
 *   BASELINE object, the two one-axis SENSITIVITY modules (C_C-axis vs E_trunc-axis), and the
 *   FLOW-SHARE ladder are mutually discoverable instead of reading as five scattered leaves.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE BASELINE (one ticket: tabulates the four landmarks as a single cross-validated object).
 *     imp-97520 -- ties three scattered prose landmarks (imp-33582/imp-3406/imp-33723) plus a
 *       new below-0.1 tail point into one ladder: L1 PEAK (N ~ 9.218633e5, sigma_max ~ 0.949429),
 *       L2 BELOW-0.9 (N ~ 2.572361e7), L3 HALVING (N ~ 3.267235e9), L4 BELOW-0.1 (N ~ 3.213181e11);
 *       cross-checks L3 against the imp-33723 closed-form fixed point N_cross ~ 3.280294e9 to
 *       ~3.98e-3 (~0.4%), attributing the offset to the Gronwall E_flow/E_trunc ~ 1.91e-3 share.
 *
 *   THE C_C-AXIS SENSITIVITY MODULE (one ticket, on the halving crossover only).
 *     imp-97565 -- differentiates the imp-33723 fixed point N_cross = K log T0(N_cross) in C_C:
 *       closed-form elasticity d ln N_cross / d ln C_C = 2/(1 - g_prime) ~ 2.09517, confirmed by
 *       central difference to 6 digits; the halving landmark N_half tracks with a marginally
 *       STEEPER elasticity ~2.10235 because the ~0.4% halving offset is itself C_C-sensitive
 *       (shrinks from ~1.376e-2 at 0.5x C_C to ~1.141e-3 at 2x C_C).
 *
 *   THE E_TRUNC-AXIS SENSITIVITY MODULES (two tickets: single-landmark, then all-four-landmark).
 *     imp-36139 -- measures the E_trunc-sensitivity of N_cross ALONE (predates the four-landmark
 *       tabulation): a clean power law N_cross ~ E_trunc^{-2.095} across a 0.5x..2x floor sweep
 *       (OLS slope -2.0953, R^2 ~ 0.9999993), an 18.3x swing in N_cross over the range; sigma at
 *       the crossover stays pinned at ~0.4995 throughout (E_trunc = E_coll balance is invariant,
 *       only its N-location moves).
 *     imp-97584 -- generalizes imp-36139's single-landmark E_trunc-elasticity to ALL FOUR sigma(N)
 *       landmarks: L1 peak ~-1.373 (shallowest -- a balance point, not a crossover), L2 below-0.9
 *       ~-2.304 (steepest), L3 halving ~-2.098 (matches imp-36139's -2.095 to within measurement
 *       method), L4 below-0.1 ~-2.079; strict ordering L1<L2<L3<L4 preserved across the whole
 *       0.5x..2x ladder, though the peak-to-tail span contracts from ~5.76 to ~5.34 decades.
 *
 *   THE FLOW-SHARE LEAF (one ticket, N-axis rather than a constant-perturbation axis).
 *     imp-97585 -- sweeps the Gronwall flow share E_flow/E_trunc across the full verified ladder
 *       N in {1e6..1e12}: MONOTONE DECREASING, crossing share=1 at N ~ 1.597752e6 and dropping
 *       below the 1e-3 bar at N ~ 6.933193e9 (just past the halving landmark L3); reproduces the
 *       imp-97520 single-point ~1.91e-3 at N_half exactly; E_flow is never the binding E(N) term
 *       anywhere at or past L3.
 *
 *   WHY GROUP THESE (not re-derive). All five leaves probe the SAME sigma(N) landmark ladder
 *   object from imp-97520, along three genuinely distinct axes: perturb C_C (imp-97565), perturb
 *   E_trunc at one landmark then all four (imp-36139 then imp-97584), or hold both constants fixed
 *   and sweep N itself (imp-97585). Read individually they look like an undifferentiated batch of
 *   sensitivity numbers; grouped by axis, the cohort is legible as one deliberate three-axis survey
 *   of the same baseline object.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already
 *   committed).
 *   - Baseline four-landmark ladder tabulated as one cross-validated object; halving landmark
 *     matches the imp-33723 closed form to ~0.4% (imp-97520).
 *   - N_cross / N_half C_C-elasticity ~2.095 / ~2.10235, confirmed analytically and numerically
 *     (imp-97565).
 *   - N_cross E_trunc-elasticity ~-2.095 (OLS, R^2~0.9999993) at the halving landmark alone
 *     (imp-36139), generalized to all four landmarks -1.373/-2.304/-2.098/-2.079 (imp-97584).
 *   - E_flow/E_trunc flow share monotone decreasing across N in {1e6..1e12}, never binding past
 *     the halving landmark (imp-97585).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - sigma(N) surrogate component model stays the same inherited imp-3220/imp-3406 model, NOT a
 *     rigorous asymptotic; every elasticity here is a sensitivity readout of that model, not a
 *     new bound.
 *   - C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) stay UNTOUCHED.
 *   - no landmark reordering occurs anywhere in either sensitivity sweep, but neither sweep
 *     establishes an intrinsic (floor-independent) landmark location.
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No
 *   bound changes: no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97520-sigma-conditional-share-landmark-ladder.js (baseline four-landmark object)
 * @see imp-97565-crossover-cc-sensitivity-landmark-shift.js (C_C-axis: N_cross / N_half elasticity)
 * @see imp-36139-etrunc-coll-crossover-sensitivity.js (E_trunc-axis: N_cross alone, elasticity ~-2.095)
 * @see imp-97584-sigma-landmark-etrunc-sensitivity.js (E_trunc-axis: generalizes to all four landmarks)
 * @see imp-97585-eflow-etrunc-share-full-ladder.js (E_flow/E_trunc flow-share ladder across N)
 *
 * Ticket: imp-97615 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by this index)

const BASELINE_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97520',
    step: 'tabulate the sigma(N) = E_coll/E_N four-landmark ladder as one cross-validated object',
    result:
      'L1 peak N~9.218633e5 (sigma_max~0.949429), L2 below-0.9 N~2.572361e7, L3 halving ' +
      'N~3.267235e9, L4 below-0.1 N~3.213181e11; L3 matches the imp-33723 closed form to ~3.98e-3, ' +
      'offset attributed to the Gronwall E_flow/E_trunc~1.91e-3 share.',
  }),
]);

const CC_AXIS_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97565',
    step: 'differentiate the N_cross fixed point in C_C and confirm the halving-landmark shift',
    result:
      'closed-form elasticity d ln N_cross/d ln C_C = 2/(1-g_prime) ~2.09517, confirmed numerically ' +
      'to 6 digits; the halving landmark N_half tracks with a marginally steeper elasticity ~2.10235 ' +
      'since its C_C-sensitive offset shrinks from ~1.376e-2 (0.5x) to ~1.141e-3 (2x).',
  }),
]);

const ETRUNC_AXIS_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-36139',
    step: 'measure the E_trunc-sensitivity of the N_cross halving crossover alone',
    result:
      'clean power law N_cross ~ E_trunc^{-2.095} across a 0.5x..2x floor sweep (OLS slope -2.0953, ' +
      'R^2~0.9999993), an 18.3x swing in N_cross; sigma at the crossover pinned at ~0.4995 throughout.',
  }),
  Object.freeze({
    id: 'imp-97584',
    step: 'generalize the E_trunc-elasticity from N_cross alone to all four sigma(N) landmarks',
    result:
      'L1 peak ~-1.373 (shallowest, a balance point not a crossover), L2 below-0.9 ~-2.304 ' +
      '(steepest), L3 halving ~-2.098 (matches imp-36139), L4 below-0.1 ~-2.079; strict ordering ' +
      'L1<L2<L3<L4 preserved across the whole ladder, peak-to-tail span contracts ~5.76 -> ~5.34 decades.',
  }),
]);

const FLOW_SHARE_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97585',
    step: 'sweep the Gronwall flow share E_flow/E_trunc across the full verified ladder N in {1e6..1e12}',
    result:
      'monotone decreasing; crosses share=1 at N~1.597752e6 and drops below the 1e-3 bar at ' +
      'N~6.933193e9 (just past the halving landmark); reproduces the imp-97520 ~1.91e-3 point at ' +
      'N_half exactly; never the binding E(N) term at or past L3.',
  }),
]);

export const IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX = Object.freeze({
  id: 'imp-97615',
  proofSection: 'S-frontier',
  baselineCohort: BASELINE_COHORT,
  ccAxisCohort: CC_AXIS_SUBCOHORT,
  etruncAxisCohort: ETRUNC_AXIS_SUBCOHORT,
  flowShareCohort: FLOW_SHARE_COHORT,
  measuredSignal:
    'five sigma(N) landmark-ladder leaves (imp-97520/97565/36139/97584/97585), grouped by axis: ' +
    'one baseline four-landmark object, one C_C-axis sensitivity module (halving landmark only), ' +
    'two E_trunc-axis sensitivity modules (single landmark then generalized to all four), and one ' +
    'N-axis flow-share ladder.',
  namedResiduals: [
    'IMP97520_SIGMA_LANDMARK_LADDER_HALVING_CROSSVALIDATED',
    'IMP97565_NCROSS_CC_ELASTICITY_2P095',
    'IMP36139_NCROSS_ETRUNC_ELASTICITY_MINUS2P095',
    'IMP97584_FOUR_LANDMARK_ETRUNC_ELASTICITY_ORDERING_PRESERVED',
    'IMP97585_FLOW_SHARE_MONOTONE_DECREASING_NEVER_BINDING_PAST_HALVING',
  ],
  ncrossCcElasticity: 2.09517,
  nhalfCcElasticity: 2.10235,
  ncrossEtruncElasticityOls: -2.0953,
  fourLandmarkEtruncElasticities: Object.freeze({ L1: -1.373, L2: -2.304, L3: -2.098, L4: -2.079 }),
  flowShareUnityCrossingN: 1.597752e6,
  flowShareMilliCrossingN: 6.933193e9,
  halvingLandmarkN: 3.267235e9,
  anyBoundMoved: false,
  question:
    'The five sigma(N) landmark-ladder leaves imp-97520/97565/36139/97584/97585 all probe the ' +
    'same baseline object along three different axes (C_C, E_trunc, N). Split by axis, does each ' +
    'group settle a distinct sensitivity question with a distinct verdict, and does none move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97520 supplies the baseline four-landmark ' +
    'object. imp-97565 settles the C_C-axis at the halving crossover (elasticity ~2.095/2.102). ' +
    'imp-36139 and imp-97584 settle the E_trunc-axis, first at N_cross alone (~-2.095) then ' +
    'generalized to all four landmarks (-1.373/-2.304/-2.098/-2.079, ordering preserved). imp-97585 ' +
    'settles the orthogonal N-axis: the Gronwall flow share is monotone decreasing and never binding ' +
    'past the halving landmark. No bound moves in any group: the sigma(N) surrogate component model ' +
    'stays unchanged, C_C and C_mb stay untouched, and no landmark reordering occurs anywhere. RH ' +
    'open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97520 (four-landmark object); imp-97565 (C_C-elasticity of the halving crossover); ' +
    'imp-36139 (E_trunc-elasticity of N_cross alone); imp-97584 (E_trunc-elasticity of all four ' +
    'landmarks); imp-97585 (E_flow/E_trunc flow-share ladder across N).',
  lPt: L_PT,
});

export default IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97615-baseline-cohort-has-one-member',
    why: 'The baseline object is exactly one ticket; a missing or duplicated entry silently breaks the index.',
    holds: () => {
      const ids = IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX.baselineCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97520');
    },
  },
  {
    id: 'imp97615-etrunc-axis-has-both-members',
    why: 'The E_trunc-axis split must contain exactly the single-landmark and all-four-landmark leaves.',
    holds: () => {
      const ids = IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX.etruncAxisCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-36139') && ids.includes('imp-97584');
    },
  },
  {
    id: 'imp97615-five-tickets-total-no-overlap',
    why: 'The index covers exactly five tickets split into four disjoint groups; an overlap or a ' +
      'dropped ticket would misreport the cohort.',
    holds: () => {
      const idx = IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX;
      const allIds = [
        ...idx.baselineCohort.map((c) => c.id),
        ...idx.ccAxisCohort.map((c) => c.id),
        ...idx.etruncAxisCohort.map((c) => c.id),
        ...idx.flowShareCohort.map((c) => c.id),
      ];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        allIds.length === 5 &&
        noOverlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 5
      );
    },
  },
  {
    id: 'imp97615-fourlandmark-etrunc-ordering-monotone',
    why: 'imp-97584 reports a strictly monotone-decreasing E_trunc-elasticity magnitude from L1 to ' +
      'roughly the closed-form -2; a broken monotone ordering would misreport the leaf.',
    holds: () => {
      const e = IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX.fourLandmarkEtruncElasticities;
      return e.L1 > e.L2 && e.L2 < e.L3 && e.L3 < e.L4 && e.L4 < -2 && e.L4 > -2.1;
    },
  },
  {
    id: 'imp97615-flowshare-crossings-ordered',
    why: 'The share=1 crossing must precede the share=1e-3 crossing, and both must bracket the ' +
      'halving landmark on the correct side per imp-97585.',
    holds: () => {
      const idx = IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX;
      return (
        idx.flowShareUnityCrossingN < idx.halvingLandmarkN &&
        idx.flowShareMilliCrossingN > idx.halvingLandmarkN
      );
    },
  },
  {
    id: 'imp97615-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX.anyBoundMoved === false &&
      IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX.lPt === 0.2 &&
      /NO QED/.test(IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97615_SIGMA_LANDMARK_SENSITIVITY_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97615-sigma-landmark-sensitivity-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
