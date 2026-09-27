/**
 * @module imp-97789-fold-amplitude-k-sensitivity-cohort-index
 * @fileoverview imp-97789 -- META cross-reference index grouping the fold-amplitude K sensitivity
 *   cohort (imp-97725 analytic pin, imp-97735 height-axis ladder, imp-97743 floor-axis sweep,
 *   imp-97757 shared two-axis crosstab, imp-97764 wide floor-window extension) BY PERTURBATION AXIS,
 *   so the five tickets are mutually discoverable instead of reading as an undifferentiated batch.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE PIN (baseline structure, no perturbation).
 *     imp-97725 -- derives the imp-97662/imp-97683 fold amplitude K = 0.423330 analytically via
 *       implicit differentiation: numerator S = sigma_max(1-sigma_max) = 4.801356e-2 is an EXACT
 *       closed form, curvature A = phi_xx*S/2 is read from the smooth R(N), L(N) (phi_xx =
 *       1.339604e-1), giving K = sqrt(S/(2 phi_xx)). HONEST SUB-GAP: phi_xx has no elementary
 *       closed form, so K = 0.4233 is a numerical property of the surrogate curvature at this one
 *       peak, not a universal constant. This pin is the shared baseline every other cohort member
 *       perturbs away from.
 *
 *   THE HEIGHT AXIS (perturb N away from the peak, floor fixed).
 *     imp-97735 -- walks the height ladder out to N = 1e32: phi_xx does NOT plateau, it falls
 *       monotonically by a factor ~1421-1449 (1.339604e-1 at the peak to ~9.42e-5 at N=1e32) as
 *       R -> the constant E_trunc floor, following the tail law phi_xx -> -(1/2)(ln L)_xx ~
 *       1/(2(ln N)^2). Because the denominator has no nonzero limit, K = sqrt(S/(2 phi_xx)) has no
 *       height-independent value -- CONFIRMS and SHARPENS the imp-97725 sub-gap (no plateau to
 *       promote to a pinned pure number).
 *
 *   THE FLOOR AXIS (perturb E_trunc, N fixed at the peak).
 *     imp-97743 -- sweeps E_trunc over 0.5x..5x of the imp-2631 baseline: K rises monotonically
 *       0.363295 -> 0.606688 (factor ~1.67) following a shallow power law K ~ E_trunc^(+0.221),
 *       an order of magnitude LESS sensitive than the imp-33708 far-tail landmark N ~E_trunc^(-2.0)
 *       or the imp-33684 interior-peak N_max ~E_trunc^(-1.375); mechanism is partial cancellation
 *       between a rising numerator S (sigma_max pulled toward 1/2) and a mildly falling phi_xx.
 *     imp-97764 -- extends the same floor axis to a wider 0.1x..10x window: confirms +0.221 is a
 *       GENUINE core power law (local slopes flat to 3 decimals, 0.2205..0.2235, across 0.1x..3x)
 *       that drifts mildly upward past 3x (reaching ~0.242 over 5x..10x, ~10% above the core) as the
 *       numerator-vs-curvature cancellation weakens at extreme floors; K stays a well-defined
 *       interior-peak amplitude at every swept factor, spanning 0.253935 (0.1x) to 0.717408 (10x).
 *
 *   THE CROSS-AXIS COMPARISON (both axes on one shared grid).
 *     imp-97757 -- lays the floor axis and the height axis side by side on g in [0.5, 2.0]: the
 *       floor-axis local elasticity dlnK/dln g = +0.2205 (reproducing imp-97743) exceeds the
 *       height-axis -0.1234 in magnitude by a ratio ~1.79, and the two axes push K in OPPOSITE
 *       directions through DIFFERENT channels of K = sqrt(S/(2 phi_xx)) -- the floor mainly via the
 *       numerator S (S factor ~1.635, phi_xx nearly fixed), the height mainly via the denominator
 *       phi_xx (factor ~1.401, S frozen at the peak). Nothing cancels to make K stationary.
 *
 *   WHY GROUP BY AXIS (not chronologically). Read in commit order the five tickets look like a
 *   single undifferentiated K-sensitivity batch. Split by which variable is perturbed, the shape is
 *   immediately legible: one baseline pin, one axis that never plateaus (height), one axis that is a
 *   genuine shallow power law (floor, confirmed at two window widths), and one ticket that puts both
 *   axes on a shared grid and shows they act through disjoint channels with opposite sign. This index
 *   bakes that split so a future scout can find, at a glance, which axis each ticket probes.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - Baseline pin: K = sqrt(S/(2 phi_xx)) = 0.423330, S = 4.801356e-2 exact, phi_xx = 1.339604e-1
 *     (imp-97725).
 *   - Height axis: phi_xx falls monotonically, no plateau, factor ~1421-1449 out to N=1e32; K has no
 *     height-independent value (imp-97735).
 *   - Floor axis: K ~ E_trunc^(+0.221), a genuine core power law (flat 0.1x..3x), drifting to ~0.242
 *     past 3x; an order of magnitude less floor-sensitive than the cohort's landmark N-exponents
 *     (imp-97743, imp-97764).
 *   - Cross-axis: floor dominates height locally by ratio ~1.79; the two axes act through disjoint
 *     numerator/denominator channels and push K in opposite directions (imp-97757).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - K = 0.423330 is NOT promoted to a universal constant on either axis; the imp-97725 sub-gap
 *     stands and is sharpened, not closed.
 *   - no new coercivity constant, no operator positivity, no RH verdict anywhere in this cohort.
 *   - the C_C 1/8 ansatz and E_trunc = 3.06e-5 pinned floor are UNTOUCHED; this batch only perturbs
 *     them as diagnostic sweeps, it does not re-pin either.
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No bound
 *   changes: MCM onset stays omega=11, interval-rigorous certified reach unaffected; RH open; NO QED.
 *   Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-97725-fold-amplitude-analytic-pin.js (baseline: closed-form numerator, phi_xx curvature, K=0.423330)
 * @see imp-97735-fold-amplitude-height-ladder-drift.js (height axis: phi_xx drifts to 0, no plateau)
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity.js (floor axis: K ~ E_trunc^(+0.221), 0.5x..5x)
 * @see imp-97757-fold-amplitude-axis-crosstab.js (both axes on a shared grid: floor dominates, opposite signs)
 * @see imp-97764-fold-amplitude-wide-window-power-law.js (floor axis extended to 0.1x..10x: genuine core power law)
 *
 * Ticket: imp-97789 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- unrelated Krein constant, kept only for cross-cohort scale reference

const PIN_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97725',
    step: 'derive the fold amplitude K analytically via implicit differentiation of the smooth component model',
    result:
      'numerator S = sigma_max(1-sigma_max) = 4.801356e-2 is EXACT closed form; curvature A = phi_xx*S/2 ' +
      'with phi_xx = 1.339604e-1 read from the smooth R(N), L(N); K = sqrt(S/(2 phi_xx)) = 0.423330. ' +
      'HONEST SUB-GAP: phi_xx has no elementary closed form, so K is a numerical property of the ' +
      'surrogate curvature at one peak, not a universal constant.',
  }),
]);

const HEIGHT_AXIS_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97735',
    step: 'walk the height ladder N away from the peak (floor fixed) out to N = 1e32',
    result:
      'phi_xx falls MONOTONICALLY with no plateau, factor ~1421-1449 from the peak to N=1e32, ' +
      'following the tail law phi_xx -> -(1/2)(ln L)_xx ~ 1/(2(ln N)^2); K has no height-independent ' +
      'value -- confirms and sharpens the imp-97725 sub-gap.',
  }),
]);

const FLOOR_AXIS_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97743',
    step: 'sweep E_trunc over 0.5x..5x of the imp-2631 baseline (N fixed at the peak)',
    result:
      'K rises monotonically 0.363295 -> 0.606688 (factor ~1.67) following K ~ E_trunc^(+0.221), an ' +
      'order of magnitude less sensitive than the imp-33708 far-tail (-2.0) or imp-33684 peak (-1.375) ' +
      'landmark N-exponents; a rising numerator S partially cancels a mildly falling phi_xx.',
  }),
  Object.freeze({
    id: 'imp-97764',
    step: 'extend the same floor axis to a wider 0.1x..10x window and test whether +0.221 is a genuine power law',
    result:
      'confirms a GENUINE core power law (local slopes flat to 3 decimals, 0.2205..0.2235, over ' +
      '0.1x..3x), drifting mildly to ~0.242 past 3x (5x..10x); K stays a well-defined interior-peak ' +
      'amplitude throughout, spanning 0.253935 (0.1x) to 0.717408 (10x).',
  }),
]);

const CROSS_AXIS_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97757',
    step: 'lay the floor axis and the height axis side by side on one shared perturbation grid g in [0.5, 2.0]',
    result:
      'floor-axis elasticity +0.2205 exceeds height-axis -0.1234 in magnitude by ratio ~1.79; the two ' +
      'axes act through DIFFERENT channels (floor via numerator S, height via denominator phi_xx) and ' +
      'push K in OPPOSITE directions -- nothing cancels to make K stationary.',
  }),
]);

export const IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX = Object.freeze({
  id: 'imp-97789',
  proofSection: 'S-frontier',
  pinCohort: PIN_SUBCOHORT,
  heightAxisCohort: HEIGHT_AXIS_SUBCOHORT,
  floorAxisCohort: FLOOR_AXIS_SUBCOHORT,
  crossAxisCohort: CROSS_AXIS_SUBCOHORT,
  measuredSignal:
    'five fold-amplitude K sensitivity tickets (imp-97725/97735/97743/97757/97764), grouped by ' +
    'perturbation axis: one baseline analytic pin, one height-axis ladder (no plateau, phi_xx -> 0), ' +
    'two floor-axis sweeps (0.5x..5x then extended 0.1x..10x, genuine shallow power law), and one ' +
    'cross-axis comparison on a shared grid (floor dominates, opposite signs).',
  namedResiduals: [
    'IMP97725_K_STRUCTURE_PINNED_VALUE_NOT_UNIVERSAL',
    'IMP97735_PHIXX_NO_PLATEAU_TAIL_TO_ZERO',
    'IMP97743_K_FLOOR_EXPONENT_PLUS_0P221',
    'IMP97764_FLOOR_EXPONENT_GENUINE_CORE_POWER_LAW',
    'IMP97757_FLOOR_DOMINATES_HEIGHT_OPPOSITE_SIGNS',
  ],
  kBaseline: 0.42333,
  floorExponent: 0.221,
  heightExponent: -0.1234,
  crossAxisElasticityRatio: 1.79,
  phiXxDriftFactorTo1e32: 1421,
  landmarkFarTailExponent: -2.0,
  landmarkPeakExponent: -1.375,
  kIsUniversalConstant: false,
  anyBoundMoved: false,
  mcmOnsetOmega: 11,
  question:
    'The five fold-amplitude K sensitivity tickets imp-97725/97735/97743/97757/97764, committed in ' +
    'immediate succession, read as an undifferentiated batch. Split by perturbation axis -- the ' +
    'baseline pin (imp-97725), the height axis (imp-97735), the floor axis (imp-97743/97764), and the ' +
    'cross-axis comparison (imp-97757) -- does each group settle a distinct question about K, and does ' +
    'none promote K = 0.4233 to a universal constant or move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The baseline pin (imp-97725) fixes K = sqrt(S/(2 phi_xx)) ' +
    '= 0.423330 with an exact numerator and a surrogate-model curvature. The height axis (imp-97735) ' +
    'shows phi_xx drifts to zero with no plateau out to N=1e32, so K has no height-independent value. ' +
    'The floor axis (imp-97743 then imp-97764) shows K ~ E_trunc^(+0.221) is a genuine core power law ' +
    '(flat 0.1x..3x, mild upward drift past 3x), an order of magnitude less sensitive than the cohort\'s ' +
    'landmark N-exponents. The cross-axis comparison (imp-97757) puts both on a shared grid: the floor ' +
    'dominates the height locally by ratio ~1.79, and the two act through disjoint numerator/denominator ' +
    'channels with opposite sign, so nothing cancels to make K stationary. No bound moves in any group: ' +
    'MCM onset stays omega=11, RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97725 (analytic pin, K=0.423330); imp-97735 (height-axis ladder, phi_xx no plateau); ' +
    'imp-97743 (floor-axis 0.5x..5x, K~E_trunc^0.221); imp-97764 (floor-axis extended 0.1x..10x, ' +
    'genuine core power law); imp-97757 (shared two-axis crosstab, floor dominates, opposite signs).',
  ln3: LN3,
});

export default IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97789-pin-subcohort-has-the-one-member',
    why: 'The pin split must contain exactly the one baseline analytic-derivation ticket.',
    holds: () => {
      const ids = IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.pinCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97725');
    },
  },
  {
    id: 'imp97789-height-axis-subcohort-has-the-one-member',
    why: 'The height-axis split must contain exactly the height-ladder ticket, not overlap the floor axis.',
    holds: () => {
      const ids = IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.heightAxisCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97735');
    },
  },
  {
    id: 'imp97789-floor-axis-subcohort-has-both-members',
    why: 'The floor-axis split must contain both the narrow and the wide-window sweeps.',
    holds: () => {
      const ids = IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.floorAxisCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97743') && ids.includes('imp-97764');
    },
  },
  {
    id: 'imp97789-cross-axis-subcohort-has-the-one-member',
    why: 'The cross-axis split must contain exactly the shared-grid comparison ticket.',
    holds: () => {
      const ids = IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.crossAxisCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97757');
    },
  },
  {
    id: 'imp97789-five-tickets-total-no-overlap',
    why: 'The index covers exactly five tickets split into four disjoint groups; an overlap or a ' +
      'dropped ticket would misreport the batch.',
    holds: () => {
      const idx = IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX;
      const allIds = [
        ...idx.pinCohort.map((c) => c.id),
        ...idx.heightAxisCohort.map((c) => c.id),
        ...idx.floorAxisCohort.map((c) => c.id),
        ...idx.crossAxisCohort.map((c) => c.id),
      ];
      const noOverlap = new Set(allIds).size === allIds.length;
      return allIds.length === 5 && noOverlap && idx.namedResiduals.length === 5;
    },
  },
  {
    id: 'imp97789-cross-axis-ratio-matches-elasticities',
    why: 'The crosstab ratio must be internally consistent with the reported floor/height elasticities.',
    holds: () => {
      const idx = IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX;
      const impliedRatio = idx.floorExponent === 0.221
        ? Math.abs(0.2205 / idx.heightExponent)
        : NaN;
      return Math.abs(impliedRatio - idx.crossAxisElasticityRatio) < 0.02;
    },
  },
  {
    id: 'imp97789-honesty-gate-no-qed',
    why: 'Documentation/index only: K not claimed universal, no bound moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.kIsUniversalConstant === false &&
      IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.anyBoundMoved === false &&
      IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.mcmOnsetOmega === 11 &&
      /NO QED/.test(IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97789_FOLD_AMPLITUDE_K_SENSITIVITY_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97789-fold-amplitude-k-sensitivity-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
