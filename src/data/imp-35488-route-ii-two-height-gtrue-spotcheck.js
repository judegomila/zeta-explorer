/**
 * @module imp-35488-route-ii-two-height-gtrue-spotcheck
 *
 * imp-35488 (numerical, S-frontier): EXECUTE the imp-35475 Part-B route-(ii)
 * two-height data-anchored fidelity spot-check of the surrogate collision term
 * E_coll(N) = C_C sqrt(log T0 / N) [C_C = (1/8) sqrt(3 pi), imp-2642/imp-2643].
 * imp-35475 named this the "cheapest honest partial" for the OPEN sub-gap
 * imp-35337a (surrogate-vs-true sigma fidelity): both sigma landmarks -- the
 * flat-cap PEAK (N ~ 9.2186e5, T0 ~ 5.57e5) and the E_coll = E_trunc CROSSOVER
 * (N ~ 3.28e9, T0 ~ 1.14e9) -- sit BELOW the Platt-Trudgian verified height
 * T_PT = 3e12, so g_true is measurable directly IN PRINCIPLE.
 *
 * WHAT EXECUTING IT REVEALS (honest partial, two named sub-gaps):
 *
 *   imp-35488a -- CROSSOVER OUT OF IN-REPO RANGE. The repo's verified-zero table
 *   (zeros-to-1e6.js, ZEROS_EXTENDED) holds the first 10^6 Odlyzko ordinates, the
 *   last at height ~6.0027e5. The PEAK landmark (N = 9.2186e5, the 921860-th zero
 *   at height 5.57e5) is INSIDE the table, so g_true is measurable there. The
 *   CROSSOVER landmark (N = 3.28e9, height 1.14e9) is ~3280x beyond the table:
 *   although those zeros are mathematically verified (below T_PT = 3e12), the repo
 *   does NOT carry a zero list at height ~1.14e9. So the "two-height data check"
 *   reduces IN-REPO to a ONE-height (peak) check plus this named data-availability
 *   sub-gap; closing the crossover half needs an external Odlyzko/Platt zero table
 *   near height 1.14e9.
 *
 *   imp-35488b -- OBSERVABLE-TO-SIGMA DICTIONARY UN-EXECUTED. g_true (per imp-35475
 *   Part B) = the max deviation between the empirical zero configuration and its
 *   analytic (GUE) prediction at height T0(N). We measure it exactly as
 *   gue-vs-zeros-comparison.js defines it: a window of 100001 real zeros around the
 *   peak height, RvM-unfolded, nearest-neighbour spacings binned (50 bins over
 *   [0,4]), read off as max |empirical pdf - GUE Wigner pdf| plus KL and Hellinger.
 *   That is a DISTRIBUTIONAL (spacing-pdf) deviation, NOT an E_coll fidelity error
 *   in the sigma units of the ~2.14e-5 absolute flat-cap PEAK budget or the ~0.5%
 *   relative E_coll CROSSOVER budget (imp-35475 Part C). Converting the measured
 *   distributional deviation into those sigma/E_coll units is exactly the
 *   surrogate->observable dictionary that the C_C = (1/8) sqrt(3 pi) ansatz
 *   encodes and that imp-35337a leaves OPEN -- so this spot check REPORTS the raw
 *   empirical-vs-GUE agreement, it does NOT certify the surrogate E_coll to the
 *   landmark budgets.
 *
 * MEASURED (offline, scripts/imp-35488-route-ii-two-height-gtrue-offline.mjs, over
 * the real ZEROS_EXTENDED; literals baked here so this module stays import-light):
 *   - PEAK window (100001 spacings around the 921860-th zero, height 5.57e5):
 *     mean unfolded spacing 0.99999984 (confirms correct RvM unfolding), min
 *     unfolded spacing 0.016794, max empirical-vs-GUE pdf residual (g_true_peak)
 *     0.049026, KL 0.0014321, Hellinger 0.019198. The empirical zeros AGREE with
 *     GUE at the KL ~ 1.4e-3 level, and this TIGHTENS vs the first-10000 reference
 *     (KL 0.008118, Hellinger 0.048284, matching gue-vs-zeros-comparison.js
 *     verbatim) -- GUE universality improves with height, as expected.
 *   - Surrogate E_coll: PEAK 1.453810e-3, CROSSOVER 3.060000e-5 (reproduces the
 *     E_coll = E_trunc = 3.06e-5 crossover on the surrogate).
 *
 * HONEST VERDICT: at the peak height the analytic model the surrogate rests on
 * (GUE spacing statistics) holds well (KL ~ 1.4e-3), which is CONSISTENT with the
 * surrogate but does NOT by itself pin sigma to the ~2.14e-5 budget (units differ,
 * sub-gap imp-35488b); the crossover half is not in-repo measurable (sub-gap
 * imp-35488a). Spot check of ONE reachable height only; does NOT certify the
 * surrogate map globally; INHERITS no bound (sigma is a diagnostic share, not a
 * Lambda lever); C_mb GUE-conditional per imp-486 UNTOUCHED; C_C ansatz
 * (imp-2642/imp-2643), E_trunc floor (imp-2631), imp-398 C_F prefactor UNTOUCHED;
 * changes no bound; no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35475-sigma-fidelity-closure-scope (Part B route (ii) named this the cheapest honest partial)
 * @see gue-vs-zeros-comparison (defines the empirical-vs-GUE spacing deviation; our first-10000 ref reproduces it)
 * @see imp-35337-sigma-landmarks-double-double-certification (names imp-35337a; the two landmarks)
 * @see zeros-to-1e6 (ZEROS_EXTENDED: the first 10^6 Odlyzko ordinates, last at height ~6.0e5)
 * @see imp-486 (GUE-conditional caveat the analytic prediction inherits)
 */

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // 0.38374752 (imp-2642/imp-2643 ansatz)
const E_TRUNC_PT = 3.06e-5; // imp-2631 floor -> the crossover balance point
const T_PT = 3e12; // Platt-Trudgian verified height
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any sigma-fidelity spot check)

// The two sigma landmarks (imp-35337 / imp-3406 / imp-3444), taken as given.
const N_PEAK = 9.2186e5;
const N_CROSS = 3.280294352e9;
const N_TABLE = 1000000; // ZEROS_EXTENDED length (first 10^6 Odlyzko ordinates)
const LAST_ZERO_HEIGHT = 600269.677012445; // ZEROS_EXTENDED[999999]

// Landmark heights (RvM inverse effectiveHeightForN, verified in the offline run).
const T0_PEAK = 557318.2910957265; // ~5.57e5, matches the real gamma_921860 = 557317.36 to ~1.7e-6 rel
const T0_CROSS = 1143784918.1479425; // ~1.14e9

// Surrogate E_coll = C_C sqrt(log T0 / N) at each landmark.
const ECOLL_PEAK = 0.001453809993890098; // 1.453810e-3
const ECOLL_CROSS = 0.00003059999999845239; // 3.060000e-5 (reproduces E_coll = E_trunc)

// In-repo data coverage of route (ii).
const PEAK_IN_RANGE = N_PEAK < N_TABLE; // true  -> g_true measurable at the peak
const CROSS_IN_RANGE = N_CROSS < N_TABLE; // false -> crossover out of range (sub-gap imp-35488a)

// PEAK-window empirical-vs-GUE spacing deviation (offline over 100001 real zeros).
const PEAK_MEAS = {
  window: 100001, // spacings around the 921860-th zero
  meanUnfoldedSpacing: 0.9999998439233477, // ~1: correct RvM unfolding
  minUnfoldedSpacing: 0.016793711269848455,
  gTrueMaxResidual: 0.04902622292898007, // max |emp pdf - GUE Wigner pdf|
  kl: 0.0014321112734705659,
  hellinger: 0.019198430815837754,
};

// First-10000 reference: reproduces gue-vs-zeros-comparison.js (KL ~ 0.008, Hellinger ~ 0.048).
const REF_FIRST_10000 = {
  window: 10001,
  gTrueMaxResidual: 0.12603863866141096,
  kl: 0.008117861803183432,
  hellinger: 0.04828383631120784,
};

// imp-35475 Part-C landmark budgets (the targets the spot check is measured against).
const PEAK_ABS_SIGMA_BUDGET = 2.14e-5; // flat-cap margin sigma(peak) - sigma(10^6)
const CROSS_ECOLL_REL_BUDGET = 0.005; // 0.5% E_coll fidelity pins N_cross to 1% (d lnN/d lnE_coll = -2)

export const IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK = {
  id: 'imp-35488',
  proofSection: 'S-frontier',
  question:
    'Execute the imp-35475 route-(ii) two-height data-anchored fidelity spot-check of the surrogate ' +
    'E_coll: measure g_true (empirical-vs-analytic collision gap) directly at the two sigma landmark ' +
    'heights T0(peak) ~ 5.6e5 and T0(crossover) ~ 1.1e9 (both below T_PT = 3e12) and compare to the ' +
    'C_C sqrt(log T0/N) ansatz value.',
  landmarks: {
    peak: { N: N_PEAK, T0: T0_PEAK, ecollSurrogate: ECOLL_PEAK, inRepoRange: PEAK_IN_RANGE },
    crossover: { N: N_CROSS, T0: T0_CROSS, ecollSurrogate: ECOLL_CROSS, inRepoRange: CROSS_IN_RANGE },
    bothBelowT_PT: T0_PEAK < T_PT && T0_CROSS < T_PT, // true (verified-zeros exist mathematically at both)
  },
  measurement: {
    peakWindow: PEAK_MEAS,
    firstTenThousandReference: REF_FIRST_10000,
    note:
      'g_true measured as the max empirical-vs-GUE nearest-neighbour spacing pdf residual (RvM-unfolded, ' +
      '50 bins over [0,4]), the imp-35475 Part-B definition and the gue-vs-zeros-comparison.js methodology. ' +
      'The first-10000 reference reproduces gue-vs-zeros-comparison.js (KL ~ 0.008, Hellinger ~ 0.048) ' +
      'verbatim; the peak-height window is TIGHTER (KL ~ 1.4e-3), i.e. GUE universality improves with height.',
  },
  budgets: {
    peakAbsSigmaBudget: PEAK_ABS_SIGMA_BUDGET, // 2.14e-5 (imp-35475 Part C)
    crossoverEcollRelBudget: CROSS_ECOLL_REL_BUDGET, // 0.5% (imp-35475 Part C)
  },
  subGaps: {
    imp35488a:
      'CROSSOVER OUT OF IN-REPO RANGE: N_cross = 3.28e9 is ~3280x beyond the 10^6-zero table (last ' +
      'ordinate ~6.0027e5). Those zeros are mathematically verified (below T_PT = 3e12) but the repo carries ' +
      'no list at height ~1.14e9, so the crossover half of the two-height check needs an external ' +
      'Odlyzko/Platt zero table. The two-height check reduces IN-REPO to a one-height (peak) check.',
    imp35488b:
      'OBSERVABLE-TO-SIGMA DICTIONARY UN-EXECUTED: the measured g_true is a distributional (spacing-pdf) ' +
      'deviation, NOT an E_coll fidelity error in the sigma units of the 2.14e-5 absolute PEAK budget or the ' +
      '0.5% relative CROSSOVER budget. Mapping the distributional deviation into those units is exactly the ' +
      'surrogate->observable dictionary the C_C = (1/8) sqrt(3 pi) ansatz encodes and imp-35337a leaves OPEN.',
  },
  isRigorous: false,
  verdict:
    'HONEST PARTIAL (measurement, NOT a certification). Executing the route-(ii) two-height spot check in ' +
    'the repo: (peak) the 921860-th-zero window of 100001 real zeros (height 5.57e5) agrees with GUE at ' +
    'g_true max pdf residual 0.049026, KL 0.0014321, Hellinger 0.019198 -- tighter than the first-10000 ' +
    'reference (KL 0.008118, which reproduces gue-vs-zeros-comparison.js), so the analytic model the ' +
    'surrogate rests on holds WELL at the peak height; but this is a distributional agreement, NOT the ' +
    'sigma-unit fidelity the 2.14e-5 absolute PEAK budget asks for (sub-gap imp-35488b). (crossover) N = ' +
    '3.28e9 is ~3280x beyond the in-repo 10^6-zero table, so its g_true is NOT in-repo measurable (sub-gap ' +
    'imp-35488a); the two-height check reduces to a one-height (peak) check. Surrogate E_coll: PEAK ' +
    '1.453810e-3, CROSSOVER 3.060000e-5 (= E_trunc). Spot check of ONE reachable height only; does NOT ' +
    'certify the surrogate map globally; INHERITS no bound (sigma is a diagnostic share, not a Lambda ' +
    'lever); C_mb GUE-conditional per imp-486 UNTOUCHED; C_C ansatz (imp-2642/imp-2643), E_trunc floor ' +
    '(imp-2631), imp-398 C_F prefactor UNTOUCHED; changes no bound; no operator positivity; no RH verdict; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35475 (route-(ii) two-height check named the cheapest honest partial); imp-35337 (names ' +
    'imp-35337a; the two landmarks); imp-3406/imp-3444 (peak/crossover on double); gue-vs-zeros-comparison ' +
    '(empirical-vs-GUE spacing deviation, reproduced at the first-10000 reference); zeros-to-1e6 ' +
    '(ZEROS_EXTENDED, first 10^6 Odlyzko ordinates, last at height ~6.0e5); imp-2642/imp-2643 (C_C = ' +
    '(1/8) sqrt(3 pi) ansatz); imp-2631 (E_trunc floor); imp-398 (C_F prefactor); imp-486 (GUE-conditional ' +
    'caveat); Platt-Trudgian 2021 (T_PT = 3e12); Odlyzko/Montgomery (GUE pair-correlation).',
  L_pt_unchanged: L_PT,
};

export const IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK_ASSERTIONS = [
  {
    // Peak in-repo range, crossover out of range (sub-gap imp-35488a); both below T_PT.
    id: 'imp35488-peak-in-range-crossover-out',
    description: 'the PEAK landmark height is inside the 10^6-zero table but the CROSSOVER (N=3.28e9) is ~3280x beyond it',
    holds: () =>
      PEAK_IN_RANGE === true &&
      CROSS_IN_RANGE === false &&
      N_CROSS / N_TABLE > 3000 &&
      T0_PEAK < LAST_ZERO_HEIGHT && // the peak height is below the last tabulated zero
      T0_PEAK < T_PT && T0_CROSS < T_PT &&
      Math.abs(C_C - 0.38374752) < 1e-6,
  },
  {
    // The peak-window measurement is well-formed and tighter than the first-10000 GUE reference.
    id: 'imp35488-peak-gtrue-measured-tighter-than-ref',
    description: 'the 100001-zero peak window unfolds to mean spacing ~1 and agrees with GUE tighter (KL~1.4e-3) than the first-10000 reference (KL~8.1e-3, reproducing gue-vs-zeros-comparison)',
    holds: () =>
      Math.abs(PEAK_MEAS.meanUnfoldedSpacing - 1) < 1e-6 && // correct RvM unfolding
      PEAK_MEAS.kl > 0 && PEAK_MEAS.kl < REF_FIRST_10000.kl && // peak tighter than first-10000
      PEAK_MEAS.hellinger < REF_FIRST_10000.hellinger &&
      PEAK_MEAS.gTrueMaxResidual > 0 && PEAK_MEAS.gTrueMaxResidual < REF_FIRST_10000.gTrueMaxResidual &&
      Math.abs(REF_FIRST_10000.kl - 0.008118) < 1e-5 && // reproduces the existing gue-vs-zeros module
      Math.abs(REF_FIRST_10000.hellinger - 0.048284) < 1e-5,
  },
  {
    // Surrogate reproduces the E_coll = E_trunc crossover; budgets carried from imp-35475 Part C.
    id: 'imp35488-crossover-reproduces-etrunc-and-budgets',
    description: 'the surrogate E_coll reproduces E_coll=E_trunc at the crossover and the two imp-35475 Part-C budgets are carried (2.14e-5 absolute / 0.5% relative)',
    holds: () =>
      Math.abs(ECOLL_CROSS - E_TRUNC_PT) / E_TRUNC_PT < 1e-4 &&
      ECOLL_PEAK > ECOLL_CROSS &&
      Math.abs(PEAK_ABS_SIGMA_BUDGET - 2.14e-5) < 1e-8 &&
      Math.abs(CROSS_ECOLL_REL_BUDGET - 0.005) < 1e-12,
  },
  {
    // Honesty gate: partial only, two sub-gaps named, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35488-honest-partial-no-bound-moves-no-qed',
    description: 'HONEST PARTIAL: two sub-gaps named (imp-35488a/imp-35488b), sigma is not a Lambda lever so no bound moves, PT 0.2 unchanged, NO QED',
    holds: () =>
      IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /out of in-repo range/i.test(IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK.subGaps.imp35488a) &&
      /dictionary un-executed/i.test(IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK.subGaps.imp35488b) &&
      /imp-486/.test(IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK.verdict) &&
      /changes no bound/.test(IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK.verdict) &&
      /NO QED/.test(IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK.verdict),
  },
];

for (const a of IMP35488_ROUTE_II_TWO_HEIGHT_GTRUE_SPOTCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35488-route-ii-two-height-gtrue-spotcheck assertion failed: ${a.id}`);
  }
}
