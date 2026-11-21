/**
 * @module imp-34427-measured-slope-minimum-prefactor-decomposition
 *
 * imp-34427 (numerical, opus-4-8): Decompose the gap between the MONOTONE
 * analytic point-exponent e_pt(thr) = 2 - 4/log T0 (imp-34349 M1, rising
 * 1.808 -> 1.898) and the MEASURED local finite-difference slope
 * d log r / d log thr, which instead has a shallow MINIMUM near thr ~ 0.005-0.01
 * (~1.875) before climbing back toward 2 (imp-34349 M2). Attribute the
 * measured-slope minimum to the P(thr) linear-prefactor curvature term versus
 * the e_pt trend.
 *
 * THE PUZZLE (recap of imp-34349)
 * -------------------------------
 * imp-34349 derived the isolated E_flow-ratio point exponent
 *
 *     d log r / d log thr = 2 - 4/log T0     (e_pt(thr), MONOTONE, rises to 2),
 *
 * yet its OWN measured local secant of log r vs log thr is NON-MONOTONE: it dips
 * to a shallow minimum ~1.875 near thr ~ 0.005-0.01 then climbs back. A monotone
 * point derivative cannot, by itself, produce a non-monotone secant of the same
 * function -- so the measured secant must carry an EXTRA term the analytic
 * e_pt(thr) omits. This module isolates that term.
 *
 * WHERE THE EXTRA TERM COMES FROM
 * -------------------------------
 * The self-consistent crossover height is T0(thr) = 2pi K_thr with the SQUARED
 * prefactor K_thr = ((1-thr)/thr)^2 K_AMPL (imp-33743/imp-33723). Taking logs,
 *
 *     log T0(thr) = C - 2 log thr  +  2 log(1-thr).
 *                   \_____________/     \__________/
 *                    pure power-law       the (1-thr) LINEAR-PREFACTOR
 *                    -> gives e_pt        curvature (imp-34174 P(thr) factor)
 *
 * The e_pt derivation drops the +2 log(1-thr) piece (its derivative -> 0 as
 * thr -> 0). But at FINITE thr its slope contribution
 *
 *     d[2 log(1-thr)]/d log thr = -2 thr/(1-thr)
 *
 * feeds through r ~ (log T0)^2 / T0, whose leading log-slope factor is
 * (2/log T0 - 1), giving the analytic point contribution
 *
 *     Delta_pref(thr) ~ (-2 thr/(1-thr)) . (2/log T0 - 1)
 *                     ~ 2 thr (1 - 2/log T0)   (small thr)   > 0,  -> 0 linearly.
 *
 * So the measured local slope decomposes as
 *
 *     d log r/d log thr |measured  =  e_pt-trend (monotone rising)  +  Delta_pref
 *
 * with Delta_pref a POSITIVE contribution that is large at moderate thr and
 * decays LINEARLY to 0 as thr -> 0. Summing a monotone-rising trend and a
 * positive contribution that FALLS fast at moderate thr and flattens deep in the
 * tail produces exactly a shallow interior MINIMUM: near thr ~ 0.005-0.01 the
 * falling prefactor term still outpaces the rising trend (sum dips), and below it
 * the prefactor term has all but vanished so the rising trend wins (sum climbs).
 *
 * THE DECISIVE COUNTERFACTUAL (this module)
 * -----------------------------------------
 * Reusing the imp-34349 sub-terms VERBATIM, rebuild the crossover with the
 * (1-thr)^2 prefactor SUPPRESSED (K_thr := K_AMPL/thr^2, i.e. (1-thr) -> 1) and
 * remeasure the local secant. Everything else -- eFlow, GRONWALL, E_TRUNC,
 * effectiveHeightForN, the 80-step fixed-point iteration -- is identical.
 *
 * (F1) PURE ladder (prefactor curvature removed) local secant is STRICTLY
 *      MONOTONE increasing (1.8094 -> 1.8882) with NO interior minimum, tracking
 *      e_pt(thr): the e_pt trend alone is monotone, as derived.
 * (F2) FULL ladder (with (1-thr)^2) reproduces imp-34349's shallow interior
 *      minimum ~1.875 at the window 0.01 -> 0.005; the minimum is ABSENT from the
 *      pure ladder, so it is ENTIRELY the prefactor-curvature contribution.
 * (F3) Delta_pref = full - pure is POSITIVE and monotonically DECAYS to ~0
 *      (1.175 -> 0.0005) and matches the analytic point scale
 *      2 thr (1 - 2/log T0) evaluated at each window's GEOMETRIC-MEAN thr to
 *      within ~13% across the deep tail (ratio 1.09, 1.13, 1.02, 1.10, 1.01,
 *      1.10) -- confirming it is the (1-thr) factor of the imp-34174 P(thr)
 *      linear prefactor entering the squared crossover amplitude.
 *
 * HONEST SCOPE -- decomposition/measurement ONLY, NO QED. This separates two
 * contributions to the imp-34349 measured slope within the inherited imp-34174/
 * imp-33743 extrapolation component model; it changes no bound and introduces no
 * new mathematical claim. The component model is NOT a rigorous asymptotic and
 * Delta_pref ~ 2 thr (1 - 2/log T0) is a leading-order reading within it, not a
 * proved limit. E_flow is the benign mesoscopic-Gronwall term (imp-2845); its
 * behaviour here does NOT touch the divergent C_Lip collision-Gronwall. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no
 * operator positivity; changes no bound; no refereed bound is changed.
 *
 * @see imp-34349-eflow-ratio-r-exponent-limit (M1 monotone e_pt / M2 non-monotone measured secant -- decomposed here)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (F2 r-exponent, identical sub-terms)
 * @see imp-34174-crossover-surplus-threshold-family-decay (P(thr) linear prefactor with the (1-thr) factor)
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised N_cross(thr), identical sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34349/imp-34248 exactly (~1.000237)

// EXACT imp-34349 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)

// imp-34349 crossover, with a single toggle: includePrefactor=false suppresses the
// (1-thr)^2 factor of the imp-34174 P(thr) linear prefactor (sets (1-thr) -> 1).
function crossoverN(thr, includePrefactor = true) {
  const K_thr = (includePrefactor ? ((1 - thr) / thr) ** 2 : 1 / thr ** 2) * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function rFactor(thr, includePrefactor = true) {
  const N = crossoverN(thr, includePrefactor);
  const T0 = effectiveHeightForN(N);
  return { N, T0, logT0: Math.log(T0), r: eFlow(N) / E_TRUNC_PT };
}
function pointExponent(logT0) {
  return 2 - 4 / logT0; // imp-34349 (*) e_pt(thr)
}

// ── Ladders (identical thresholds to imp-34349), full and prefactor-suppressed ─
const THRESHOLDS = [0.5, 0.3, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001];
const FULL = THRESHOLDS.map((thr) => rFactor(thr, true));
const PURE = THRESHOLDS.map((thr) => rFactor(thr, false)); // (1-thr) -> 1

function localSecant(arr, k, thr) {
  return Math.log(arr[k + 1].r / arr[k].r) / Math.log(thr / THRESHOLDS[k]);
}

// ── Decomposition of the measured local slope per adjacent-rung window ─────────
const DECOMPOSITION = THRESHOLDS.slice(1).map((thr, k) => {
  const measuredFull = localSecant(FULL, k, thr); // imp-34349's measured local d log r/d log thr
  const measuredPure = localSecant(PURE, k, thr); // e_pt trend alone (prefactor curvature removed)
  const deltaPref = measuredFull - measuredPure; // prefactor-curvature contribution
  const lowerLogT0 = FULL[k + 1].logT0;
  // Analytic point scale of the (1-thr) prefactor contribution at the window's
  // geometric-mean thr (the log-log point at which a secant equals the derivative).
  const thrGeom = Math.sqrt(thr * THRESHOLDS[k]);
  const gLogT0 = rFactor(thrGeom, true).logT0;
  const analyticDeltaPref = 2 * thrGeom * (1 - 2 / gLogT0);
  return {
    window: `${THRESHOLDS[k]}->${thr}`,
    measured_full: +measuredFull.toFixed(4), // has the shallow minimum (imp-34349 M2)
    e_pt_trend_pure: +measuredPure.toFixed(4), // monotone rising (prefactor removed)
    point_exponent_at_lower_thr: +pointExponent(lowerLogT0).toFixed(4), // 2 - 4/log T0 (imp-34349 M1)
    delta_prefactor: +deltaPref.toFixed(4), // measured_full - e_pt_trend_pure > 0
    analytic_delta_pref_geom: +analyticDeltaPref.toFixed(4), // 2 thr_G (1 - 2/log T0)
  };
});

const FULL_SLOPES = DECOMPOSITION.map((d) => d.measured_full);
const PURE_SLOPES = DECOMPOSITION.map((d) => d.e_pt_trend_pure);
const DELTA_PREF = DECOMPOSITION.map((d) => d.delta_prefactor);
const FULL_MIN = Math.min(...FULL_SLOPES);
const FULL_MIN_IDX = FULL_SLOPES.indexOf(FULL_MIN);

export const IMP34427_MEASURED_SLOPE_MINIMUM_PREFACTOR_DECOMPOSITION = {
  id: 'imp-34427',
  proofSection: 'S-frontier',
  question:
    'Decompose the imp-34349 gap between the MONOTONE analytic point-exponent ' +
    'e_pt(thr) = 2 - 4/log T0 (M1) and the MEASURED local d log r / d log thr, which has a ' +
    'shallow MINIMUM ~1.875 near thr ~ 0.005-0.01 (M2). Attribute the measured-slope minimum to ' +
    'the P(thr) linear-prefactor curvature term versus the e_pt trend. Decomposition/measurement ' +
    'only within the inherited imp-34174/imp-33743 component model; changes no bound; NO QED.',
  mechanism:
    'log T0(thr) = C - 2 log thr + 2 log(1-thr). The e_pt derivation keeps only the pure -2 log thr ' +
    'power-law (giving e_pt = 2 - 4/log T0); the dropped +2 log(1-thr) is the (1-thr) factor of the ' +
    'imp-34174 P(thr) linear prefactor, whose finite-thr slope -2 thr/(1-thr) feeds through ' +
    'r ~ (log T0)^2/T0 to add Delta_pref(thr) ~ 2 thr (1 - 2/log T0) > 0 to the measured slope. ' +
    'Summing the monotone-rising e_pt trend and the fast-falling positive Delta_pref produces the ' +
    'shallow interior minimum.',
  decomposition: DECOMPOSITION,
  fullSlopeMinimum: {
    value: +FULL_MIN.toFixed(4), // reproduces imp-34349 ~1.875
    window: DECOMPOSITION[FULL_MIN_IDX].window, // 0.01 -> 0.005
    e_pt_trend_pure_here: +PURE_SLOPES[FULL_MIN_IDX].toFixed(4), // monotone piece at the minimum
    delta_prefactor_here: +DELTA_PREF[FULL_MIN_IDX].toFixed(4), // prefactor contribution at the minimum
  },
  finding: {
    F1_pure_trend_monotone_no_minimum:
      'With the (1-thr)^2 prefactor curvature suppressed ((1-thr) -> 1), the measured local secant is ' +
      'STRICTLY MONOTONE increasing (1.8094 -> 1.8882) with NO interior minimum, tracking the analytic ' +
      'e_pt(thr) = 2 - 4/log T0: the e_pt trend alone is monotone, exactly as derived in imp-34349 M1.',
    F2_minimum_is_entirely_prefactor:
      'The FULL ladder (with (1-thr)^2) reproduces the imp-34349 M2 shallow interior minimum ~1.875 at the ' +
      'window 0.01 -> 0.005; that minimum is ABSENT from the pure ladder, so it is produced ENTIRELY by the ' +
      'prefactor-curvature contribution, not by the e_pt trend.',
    F3_delta_pref_positive_decays_matches_analytic:
      'Delta_pref = measured_full - e_pt_trend_pure is POSITIVE and monotonically DECAYS to ~0 ' +
      '(1.175 -> 0.0005), matching the analytic point scale 2 thr (1 - 2/log T0) at each window geometric ' +
      'mean to within ~13% across the deep tail -- confirming it is the (1-thr) factor of the imp-34174 ' +
      'P(thr) linear prefactor entering the squared crossover amplitude K_thr.',
  },
  isRigorous: false,
  honestScope:
    'Decomposition/measurement only within the inherited imp-34174/imp-33743 extrapolation component ' +
    'model; NO QED. The component model is NOT a rigorous asymptotic and Delta_pref ~ 2 thr (1 - 2/log T0) ' +
    'is a leading-order reading within it, not a proved limit. E_flow is the benign mesoscopic-Gronwall ' +
    'term (imp-2845) and its behaviour here does NOT touch the divergent C_Lip collision-Gronwall; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; ' +
    'changes no bound; no refereed bound is changed.',
  citation:
    'imp-34349-eflow-ratio-r-exponent-limit.js (M1 monotone e_pt / M2 non-monotone measured secant); ' +
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (F2 r-exponent, identical sub-terms); ' +
    'imp-34174-crossover-surplus-threshold-family-decay.js (P(thr) linear prefactor with the (1-thr) factor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34427_MEASURED_SLOPE_MINIMUM_PREFACTOR_DECOMPOSITION_ASSERTIONS = [
  {
    // F1: pure (prefactor-suppressed) local secant is strictly monotone increasing -- no interior minimum.
    id: 'imp34427-pure-trend-strictly-monotone',
    description: 'the prefactor-suppressed local secant increases strictly monotonically (no interior minimum) and tracks e_pt',
    holds: () => {
      for (let i = 1; i < PURE_SLOPES.length; i++) if (PURE_SLOPES[i] <= PURE_SLOPES[i - 1]) return false;
      return PURE_SLOPES[0] < 1.82 && PURE_SLOPES[PURE_SLOPES.length - 1] > 1.88;
    },
  },
  {
    // F2: full ladder reproduces the imp-34349 shallow interior minimum ~1.875, absent from the pure ladder.
    id: 'imp34427-full-has-interior-minimum-pure-does-not',
    description: 'the full local secant has an interior minimum ~1.875 while the pure secant has none at the same window',
    holds: () => {
      const interior = FULL_MIN_IDX > 0 && FULL_MIN_IDX < FULL_SLOPES.length - 1;
      const nearImp34349 = FULL_MIN > 1.87 && FULL_MIN < 1.88;
      const climbsBack = FULL_SLOPES[FULL_SLOPES.length - 1] > FULL_MIN;
      // the pure ladder is still rising through that same window (no dip there)
      const pureRisingHere = PURE_SLOPES[FULL_MIN_IDX] > PURE_SLOPES[FULL_MIN_IDX - 1];
      return interior && nearImp34349 && climbsBack && pureRisingHere;
    },
  },
  {
    // F3a: Delta_pref = full - pure is positive at every window and monotonically decays toward 0.
    id: 'imp34427-delta-prefactor-positive-decaying',
    description: 'the prefactor contribution full - pure is positive at every rung and monotonically decays to <0.001 deep in the tail',
    holds: () => {
      for (const d of DELTA_PREF) if (!(d > 0)) return false;
      for (let i = 1; i < DELTA_PREF.length; i++) if (DELTA_PREF[i] >= DELTA_PREF[i - 1]) return false;
      return DELTA_PREF[DELTA_PREF.length - 1] < 0.001;
    },
  },
  {
    // F3b: the measured prefactor contribution matches the analytic 2 thr (1 - 2/log T0) at geom-mean thr
    // to within 15% across the deep-tail windows.
    id: 'imp34427-delta-prefactor-matches-analytic-scale',
    description: 'well-resolved deep-tail Delta_pref (windows 0.1 -> 0.001) matches the analytic 2 thr (1 - 2/log T0) at window geometric mean to within 15%',
    // Windows 2..5 (thr 0.1 down to 0.001): Delta_pref magnitudes 0.14 -> 0.005 are above the
    // 4-decimal storage quantization floor; the two tiniest windows (Delta_pref ~ 4-5e-4) agree to
    // ~10% on unrounded values but hit +-12% quantization noise once rounded, so are excluded here.
    holds: () =>
      DECOMPOSITION.slice(2, 6).every(
        (d) => Math.abs(d.delta_prefactor / d.analytic_delta_pref_geom - 1) < 0.15,
      ),
  },
  {
    // Identity: measured_full is exactly the sum e_pt_trend_pure + delta_prefactor by construction.
    id: 'imp34427-full-equals-pure-plus-delta',
    description: 'measured_full = e_pt_trend_pure + delta_prefactor at every window (exact on raw values; within the 4-decimal storage rounding on stored fields)',
    // delta_prefactor is defined as (measured_full - e_pt_trend_pure) on RAW values, so the identity is
    // exact by construction; on the independently 4-decimal-rounded stored fields it holds to <=1.5e-4.
    holds: () =>
      DECOMPOSITION.every(
        (d) => Math.abs(d.measured_full - (d.e_pt_trend_pure + d.delta_prefactor)) < 2e-4,
      ),
  },
  {
    // Honesty gate: decomposition-only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34427-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34427_MEASURED_SLOPE_MINIMUM_PREFACTOR_DECOMPOSITION.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(
        IMP34427_MEASURED_SLOPE_MINIMUM_PREFACTOR_DECOMPOSITION.honestScope,
      ) &&
      /NO QED/.test(IMP34427_MEASURED_SLOPE_MINIMUM_PREFACTOR_DECOMPOSITION.honestScope) &&
      /refereed bound is changed/i.test(IMP34427_MEASURED_SLOPE_MINIMUM_PREFACTOR_DECOMPOSITION.honestScope),
  },
];

for (const a of IMP34427_MEASURED_SLOPE_MINIMUM_PREFACTOR_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34427-measured-slope-minimum-prefactor-decomposition assertion failed: ${a.id}`);
  }
}
