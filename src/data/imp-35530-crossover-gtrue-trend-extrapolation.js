/**
 * @module imp-35530-crossover-gtrue-trend-extrapolation
 *
 * imp-35530 (numerical, S-frontier): ADVANCE the CROSSOVER half of the imp-35475
 * route-(ii) data-anchored fidelity check of the surrogate collision term
 * E_coll(N) = C_C sqrt(log T0 / N) [C_C = (1/8) sqrt(3 pi), imp-2642/imp-2643].
 *
 * imp-35488 executed the route-(ii) PEAK-height check and declared the CROSSOVER
 * landmark (N ~ 3.28e9, T0 ~ 1.14e9) OUT OF IN-REPO RANGE (sub-gap imp-35488a):
 * its height is far beyond the last tabulated Odlyzko ordinate (~6.0027e5), so
 * g_true is NOT directly measurable there in-repo. This module does NOT overturn
 * that. Instead it does the honest reachable thing: it MEASURES the empirical
 * g_true(T0) height-decay TREND across a ladder of accessible in-table heights and
 * PROJECTS that trend (a fitted power law in log T0) up to the crossover height,
 * then compares the projected g_true to the modeled E_coll there.
 *
 * IMPORTANT: the crossover value is an EXTRAPOLATION ~1900x beyond the data, NOT a
 * direct measurement -- imp-35488a stays OPEN. What is genuinely new here is the
 * MEASURED height trend (10 disjoint 50000-spacing windows spanning heights
 * ~4.0e4 -> ~5.7e5) and a quantified, model-sensitivity-bracketed projection.
 *
 * MEASURED (offline, scripts/imp-35530-crossover-gtrue-trend-extrapolation-offline.mjs,
 * over the real ZEROS_EXTENDED; literals baked here so this module stays import-light):
 *
 *   - g_true read as the KL divergence of the RvM-unfolded nearest-neighbour
 *     spacing pdf vs the GUE Wigner surmise (the imp-35488 statistic). It decays
 *     MONOTONICALLY-in-trend with height: KL = 3.316e-3 at logT0 = 10.61 (height
 *     ~4.0e4) down to KL = 1.484e-3 at logT0 = 13.26 (height ~5.7e5). Mean unfolded
 *     spacing ~1 in every window (correct RvM unfolding). GUE universality
 *     tightens with height, as expected.
 *   - Log-log OLS fit KL ~ b (log T0)^(-p): b = 11.3159, p = 3.4463 (free exponent).
 *   - The bin-free Kolmogorov-Smirnov sup-distance D_KS (imp-35529 statistic) also
 *     trends down (1.923e-2 -> 1.275e-2) but sits near the ~1.36/sqrt(50000) ~ 6.1e-3
 *     finite-sample floor, so its extrapolation is floor-limited and only a
 *     secondary witness.
 *
 * PROJECTION to the crossover height (logT0 = 20.8576, EXTRAPOLATION not measurement):
 *   - free-exponent fit:      g_true(KL) ~ 3.214e-4
 *   - forced 1/logT0  (p=1):  g_true(KL) ~ 1.146e-3
 *   - forced 1/(logT0)^2 (p=2): g_true(KL) ~ 6.816e-4
 *   Modeled surrogate there:  E_coll_CROSS = 3.060e-5 (= E_trunc, imp-2631 floor).
 *
 * HONEST FINDING: across ALL THREE extrapolation forms (spanning a ~3.6x model
 * bracket, 3.2e-4 .. 1.15e-3), the PROJECTED true distributional deviation g_true
 * at the crossover height stays an ORDER OF MAGNITUDE above the modeled E_coll
 * (~10.5x for the free fit, up to ~37x for the 1/logT0 form). The qualitative
 * ordering g_true >> E_coll at the crossover is ROBUST to the model choice; the
 * exact value is NOT (sub-gap imp-35530a). AND the two quantities are in DIFFERENT
 * UNITS -- KL is a distributional (spacing-pdf) divergence, E_coll is a sigma-share
 * collision magnitude -- so this ordering is a diagnostic flag, NOT a certified
 * fidelity error (units mismatch inherited from imp-35488b, sub-gap imp-35530b).
 *
 * MEASUREMENT/EXTRAPOLATION ONLY; does NOT certify the surrogate map globally;
 * INHERITS no bound (sigma is a diagnostic share, not a Lambda lever); C_mb
 * GUE-conditional per imp-486 UNTOUCHED; C_C ansatz (imp-2642/imp-2643), E_trunc
 * floor (imp-2631), imp-398 C_F prefactor UNTOUCHED; changes no bound; no operator
 * positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (declared the crossover out of in-repo range; imp-35488a/b)
 * @see imp-35529-peak-ks-supdistance (bin-free KS sup-distance statistic reused here as the secondary witness)
 * @see imp-35475-sigma-fidelity-closure-scope (route (ii) two-height check)
 * @see imp-35337-sigma-landmarks-double-double-certification (the two sigma landmarks)
 * @see zeros-to-1e6 (ZEROS_EXTENDED: first 10^6 Odlyzko ordinates, last at height ~6.0e5)
 * @see imp-486 (GUE-conditional caveat the analytic prediction inherits)
 */

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // 0.38374752 (imp-2642/imp-2643 ansatz)
const E_TRUNC_PT = 3.06e-5; // imp-2631 floor -> the E_coll = E_trunc crossover balance point
const T_PT = 3e12; // Platt-Trudgian verified height
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any sigma-fidelity trend/extrapolation)

const N_PEAK = 9.2186e5;
const N_CROSS = 3.280294352e9;
const N_TABLE = 1000000; // ZEROS_EXTENDED length
const LAST_ZERO_HEIGHT = 600269.677012445; // ZEROS_EXTENDED[999999]

const T0_CROSS = 1143784918.1479425; // ~1.14e9 (RvM effectiveHeightForN(N_CROSS))
const LOG_T0_CROSS = 20.857608703616243;
const ECOLL_CROSS = 0.00003059999999845239; // 3.060e-5 (reproduces E_coll = E_trunc)
const CROSS_HEIGHT_BEYOND_TABLE = T0_CROSS / LAST_ZERO_HEIGHT; // ~1905x beyond last tabulated height
const CROSS_N_BEYOND_TABLE = N_CROSS / N_TABLE; // ~3280x beyond the table by index

// Measured g_true(T0) height-decay ladder: 10 disjoint 50000-spacing windows.
// Each: { logT: log midpoint height, kl: KL(emp spacing pdf || GUE Wigner), dKS: KS sup-distance }.
const RUNGS = [
  { logT: 10.607418562667458, kl: 0.003316381875851679, dKS: 0.01922578732582575 },
  { logT: 11.58727718575177, kl: 0.0023298607075828955, dKS: 0.017247580595416312 },
  { logT: 12.046902366885659, kl: 0.0021893895295887096, dKS: 0.016378712504895226 },
  { logT: 12.350898977175245, kl: 0.0018996067017992273, dKS: 0.01397101392790509 },
  { logT: 12.578564323550584, kl: 0.0019811705325364264, dKS: 0.014661528874331586 },
  { logT: 12.760710349041307, kl: 0.0017632902286334302, dKS: 0.013671966272806785 },
  { logT: 12.912576244958204, kl: 0.001696449588026555, dKS: 0.014213848864278955 },
  { logT: 13.042829702698477, kl: 0.0016767787389740407, dKS: 0.01188389954591132 },
  { logT: 13.15687990171876, kl: 0.0014900172784720557, dKS: 0.014017039058410091 },
  { logT: 13.258323151351231, kl: 0.0014843354879149869, dKS: 0.012746901622388979 },
];

// Log-log OLS fits KL ~ b (logT)^(-p), D_KS ~ b (logT)^(-p).
const KL_FIT = { b: 11.315864736338273, p: 3.446319858558324 };
const KS_FIT = { b: 1.8030996680584297, p: 1.9110199457288373 };

// Crossover-height projections (EXTRAPOLATION, not measurement).
const KL_CROSS_EXTRAP = 0.0003214254410014205; // free-exponent fit
const KS_CROSS_EXTRAP = 0.005430989088970821; // floor-limited secondary witness
const KL_CROSS_P1 = 0.001146045615034889; // forced 1/logT0
const KL_CROSS_P2 = 0.0006815647332400637; // forced 1/(logT0)^2
const KL_EXTRAP_VS_ECOLL_RATIO = 10.50409937966264; // free-fit g_true / E_coll_CROSS

export const IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION = {
  id: 'imp-35530',
  proofSection: 'S-frontier',
  question:
    'imp-35475 route (ii): measure g_true (empirical-vs-GUE collision deviation) at the E_coll=E_trunc ' +
    'crossover effective height T0 ~ 1.14e9 (below T_PT = 3e12) and compare to the C_C sqrt(log T0/N) ' +
    'surrogate value there. The crossover height is ~1905x beyond the in-repo zero table (imp-35488a), ' +
    'so measure the g_true height-decay TREND across the accessible table and project it to the crossover.',
  crossover: {
    N: N_CROSS,
    T0: T0_CROSS,
    logT0: LOG_T0_CROSS,
    ecollSurrogate: ECOLL_CROSS,
    inRepoRange: N_CROSS < N_TABLE, // false
    heightBeyondTableFactor: CROSS_HEIGHT_BEYOND_TABLE, // ~1905x
    nBeyondTableFactor: CROSS_N_BEYOND_TABLE, // ~3280x
    belowT_PT: T0_CROSS < T_PT, // true (verified zeros exist mathematically)
  },
  measuredTrend: {
    rungs: RUNGS,
    klFit: KL_FIT,
    ksFit: KS_FIT,
    firstRungKL: RUNGS[0].kl,
    lastRungKL: RUNGS[RUNGS.length - 1].kl,
    note:
      'KL of the RvM-unfolded nearest-neighbour spacing pdf vs the GUE Wigner surmise, over 10 disjoint ' +
      '50000-spacing windows spanning heights ~4.0e4 -> ~5.7e5. KL falls 3.316e-3 -> 1.484e-3 as logT0 ' +
      'climbs 10.61 -> 13.26 (GUE universality tightens with height). The KS sup-distance trends down too ' +
      'but sits near the ~1.36/sqrt(50000) ~ 6.1e-3 finite-sample floor, so it is only a secondary witness.',
  },
  projection: {
    freeExponent: KL_CROSS_EXTRAP, // 3.214e-4
    forced1OverLogT: KL_CROSS_P1, // 1.146e-3
    forced1OverLogT2: KL_CROSS_P2, // 6.816e-4
    ksFloorLimited: KS_CROSS_EXTRAP, // 5.431e-3
    ecollCross: ECOLL_CROSS, // 3.060e-5
    freeFitVsEcollRatio: KL_EXTRAP_VS_ECOLL_RATIO, // ~10.5x
    note:
      'EXTRAPOLATION ~1900x beyond the data, NOT a direct measurement. Across all three model forms ' +
      '(spanning a ~3.6x bracket, 3.2e-4 .. 1.15e-3) the projected g_true stays an ORDER OF MAGNITUDE above ' +
      'the modeled E_coll_CROSS = 3.060e-5. The ORDERING g_true >> E_coll at the crossover is robust to the ' +
      'model choice; the exact value is NOT. KL and E_coll are in different units (distributional divergence ' +
      'vs sigma-share magnitude), so this is a diagnostic flag, not a certified fidelity error.',
  },
  subGaps: {
    imp35530a:
      'PROJECTION IS AN EXTRAPOLATION, NOT A MEASUREMENT: the crossover g_true is projected ~1900x beyond ' +
      'the last tabulated zero via a power law in logT0 whose exponent (free p=3.45 vs forced p=1, p=2) is ' +
      'not pinned by theory, giving a ~3.6x value bracket. A DIRECT crossover measurement still needs an ' +
      'external Odlyzko/Platt zero table near height 1.14e9 -- imp-35488a stays OPEN.',
    imp35530b:
      'UNITS MISMATCH (inherits imp-35488b): the trended/projected g_true is a distributional (spacing-pdf) ' +
      'KL divergence, NOT an E_coll fidelity error in the sigma-share units of the crossover budget. The ' +
      'g_true >> E_coll ordering is a diagnostic flag; mapping it into sigma units is the surrogate->observable ' +
      'dictionary imp-35337a leaves OPEN.',
  },
  isRigorous: false,
  verdict:
    'HONEST PARTIAL (measured trend + model-bracketed extrapolation, NOT a certification). The crossover ' +
    'landmark height (T0 ~ 1.14e9) is ~1905x beyond the in-repo 10^6-zero table, so g_true is NOT directly ' +
    'measurable there (imp-35488a stays OPEN). What IS measured: the g_true(T0) height-decay trend across 10 ' +
    'accessible in-table windows -- KL falls 3.316e-3 -> 1.484e-3 as logT0 climbs 10.61 -> 13.26, fit KL ~ ' +
    '11.316 (logT0)^(-3.446). Projecting to logT0 = 20.858 gives g_true ~ 3.214e-4 (free fit), 1.146e-3 (1/logT0), ' +
    '6.816e-4 (1/(logT0)^2) -- all an ORDER OF MAGNITUDE above the modeled E_coll_CROSS = 3.060e-5 (= E_trunc), ' +
    'so the surrogate under-states the projected true distributional deviation at the crossover, ROBUSTLY to ' +
    'the model choice (sub-gap imp-35530a: value is a ~3.6x-bracketed extrapolation, not a measurement) and ' +
    'MODULO units (sub-gap imp-35530b: KL vs sigma-share, inherits imp-35488b). Measurement/extrapolation only; ' +
    'does NOT certify the surrogate map globally; INHERITS no bound (sigma is a diagnostic share, not a Lambda ' +
    'lever); C_mb GUE-conditional per imp-486 UNTOUCHED; C_C ansatz (imp-2642/imp-2643), E_trunc floor ' +
    '(imp-2631), imp-398 C_F prefactor UNTOUCHED; changes no bound; no operator positivity; no RH verdict; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35488 (declared the crossover out of in-repo range; sub-gaps imp-35488a/b); imp-35529 (bin-free KS ' +
    'sup-distance, secondary witness); imp-35475 (route-(ii) two-height check); imp-35337 (imp-35337a; the two ' +
    'landmarks); gue-vs-zeros-comparison (empirical-vs-GUE spacing deviation); zeros-to-1e6 (ZEROS_EXTENDED, ' +
    'first 10^6 Odlyzko ordinates, last at height ~6.0e5); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); ' +
    'imp-2631 (E_trunc floor); imp-398 (C_F prefactor); imp-486 (GUE-conditional caveat); Platt-Trudgian 2021 ' +
    '(T_PT = 3e12); Odlyzko/Montgomery (GUE pair-correlation; finite-height O(1/log T) approach).',
  L_pt_unchanged: L_PT,
};

export const IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION_ASSERTIONS = [
  {
    // Crossover out of in-repo range (imp-35488a) and reproduces E_coll = E_trunc.
    id: 'imp35530-crossover-out-of-range-reproduces-etrunc',
    description: 'the crossover landmark height is ~1905x beyond the last tabulated zero (out of range) and its surrogate E_coll reproduces E_trunc = 3.06e-5, below T_PT',
    holds: () =>
      N_CROSS > N_TABLE &&
      CROSS_HEIGHT_BEYOND_TABLE > 1000 &&
      CROSS_N_BEYOND_TABLE > 3000 &&
      T0_CROSS < T_PT &&
      Math.abs(ECOLL_CROSS - E_TRUNC_PT) / E_TRUNC_PT < 1e-4 &&
      Math.abs(LOG_T0_CROSS - Math.log(T0_CROSS)) < 1e-9 &&
      Math.abs(C_C - 0.38374752) < 1e-6,
  },
  {
    // The measured g_true trend decays with height and the fit encodes that decay.
    id: 'imp35530-gtrue-trend-decays-with-height',
    description: 'the measured KL(empirical||GUE) falls from the lowest-height rung to the highest-height rung and the fitted exponent is a genuine (positive) decay',
    holds: () => {
      const first = RUNGS[0];
      const last = RUNGS[RUNGS.length - 1];
      return (
        RUNGS.length === 10 &&
        last.logT > first.logT && // heights climb
        last.kl < first.kl && // KL decays with height
        first.kl > 0 && last.kl > 0 &&
        KL_FIT.p > 0 && KL_FIT.b > 0 && // positive-exponent power-law decay
        KS_FIT.p > 0 &&
        // fit reproduces the endpoint rungs to within the scatter
        Math.abs(KL_FIT.b * Math.pow(first.logT, -KL_FIT.p) - first.kl) < 1e-3
      );
    },
  },
  {
    // Projected g_true exceeds E_coll robustly across all three extrapolation models.
    id: 'imp35530-projection-exceeds-ecoll-robustly',
    description: 'across free-exponent, 1/logT0 and 1/(logT0)^2 fits the projected crossover g_true stays an order of magnitude above E_coll_CROSS = 3.06e-5, spanning a ~3.6x model bracket',
    holds: () => {
      const models = [KL_CROSS_EXTRAP, KL_CROSS_P1, KL_CROSS_P2];
      const allAboveEcoll = models.every((v) => v > 10 * ECOLL_CROSS);
      const bracket = Math.max(...models) / Math.min(...models);
      return (
        allAboveEcoll &&
        bracket > 3 && bracket < 5 && // ~3.6x model-dependence bracket
        Math.abs(KL_EXTRAP_VS_ECOLL_RATIO - KL_CROSS_EXTRAP / ECOLL_CROSS) < 1e-6 &&
        KL_EXTRAP_VS_ECOLL_RATIO > 10 &&
        KS_CROSS_EXTRAP > 0 // floor-limited secondary witness present
      );
    },
  },
  {
    // Honesty gate: partial only, two sub-gaps named, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35530-honest-partial-no-bound-moves-no-qed',
    description: 'HONEST PARTIAL: extrapolation not measurement (imp-35530a), units mismatch (imp-35530b), sigma is not a Lambda lever so no bound moves, PT 0.2 unchanged, NO QED',
    holds: () =>
      IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /EXTRAPOLATION, NOT A MEASUREMENT/i.test(IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION.subGaps.imp35530a) &&
      /UNITS MISMATCH/i.test(IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION.subGaps.imp35530b) &&
      /imp-486/.test(IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION.verdict) &&
      /changes no bound/.test(IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION.verdict) &&
      /NO QED/.test(IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION.verdict) &&
      /refereed bound is changed/i.test(IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION.verdict),
  },
];

for (const a of IMP35530_CROSSOVER_GTRUE_TREND_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35530-crossover-gtrue-trend-extrapolation assertion failed: ${a.id}`);
  }
}
