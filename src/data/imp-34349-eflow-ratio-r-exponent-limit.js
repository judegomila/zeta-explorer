/**
 * @module imp-34349-eflow-ratio-r-exponent-limit
 *
 * imp-34349 (numerical, opus-4-8): Derive and measure the LIMITING small-thr
 * r-exponent of the imp-34248 F2 E_flow ratio r(thr) ~ (log T0)^2 thr^2, in
 * isolation from the linear prefactor. Question: does the measured local
 * d log r / d log thr (dropping to ~1.917 in imp-34248's deep-tail window)
 * approach 2 FROM BELOW as thr -> 0, or settle at some sub-2 limit?
 *
 * THE imp-34248 F2 READING (recap)
 * --------------------------------
 * imp-34248 factorised the imp-34174 crossover surplus(thr) = P(thr) . r(thr)
 * and read the E_flow ratio
 *
 *     r(thr) = E_flow(N_cross(thr)) / E_trunc ~ (log T0)^2 thr^2 / (4pi^2 E_trunc)
 *
 * with N_cross(thr) ~ ((1-thr)/thr)^2 K_AMPL log T0 (imp-33743/imp-33723). It
 * measured the local d log r / d log thr DROPPING BELOW 2 across its ladder
 * (2.985, 2.235, 1.978, 1.897; deep-tail OLS over {0.1,0.05,0.01} = 1.917) but
 * never derived the ANALYTIC limit or extended the ladder deep enough to see
 * whether the sub-2 readings converge to 2 or to a genuine sub-2 constant.
 *
 * THE DERIVATION (this module)
 * ----------------------------
 * The self-consistent crossover fixes T0 to leading order independently of the
 * log-T0 iteration: with N_cross ~ K_thr log T0, K_thr = ((1-thr)/thr)^2 K_AMPL,
 * and T0 ~ 2pi N_cross / log T0, the log-T0 factors CANCEL and
 *
 *     T0(thr) ~ 2pi K_thr = 2pi ((1-thr)/thr)^2 K_AMPL ~ thr^-2 . const,   so
 *     log T0(thr) = -2 log thr + C + o(1),   C = log(2pi K_AMPL).
 *
 * Substituting T0 ~ thr^-2 const into r ~ (log T0)^2 / T0 gives
 *
 *     log r = 2 log(log T0) + 2 log thr + const'.
 *
 * Differentiating in log thr, and using d log T0 / d log thr = -2 + o(1):
 *
 *     d log r / d log thr = 2 + 2 . d log(log T0)/d log thr
 *                         = 2 + 2 . (1/log T0)(-2)
 *                         = 2 - 4 / log T0.                                  (*)
 *
 * SO the analytic limiting r-exponent is 2, approached FROM BELOW, with the
 * leading correction -4 / log T0. Because log T0 = -2 log thr + C, the gap is
 *
 *     2 - (d log r / d log thr) ~ 4 / log T0 = 2 / (-log thr + C/2),
 *
 * i.e. the approach to 2 is only LOGARITHMICALLY slow in thr: halving the gap
 * requires SQUARING thr. The exponent does NOT settle at a sub-2 limit; the
 * measured sub-2 readings (imp-34248's 1.917, and ~1.875 at the shallow minimum
 * located here near thr ~ 0.005-0.01) are exactly the finite-thr -4/log T0
 * correction, and the local exponent turns and CLIMBS back toward 2 below the
 * minimum (1.8752 -> 1.8764 -> 1.8820 -> 1.8887 across thr 0.005 -> 0.0001).
 *
 * THE MEASUREMENT (this module)
 * -----------------------------
 * Extending the ladder to thr = 1e-4 and reusing the identical imp-34248/
 * imp-34174 sub-terms verbatim:
 *
 * (M1) The analytic point exponent e_pt(thr) = 2 - 4/log T0 rises monotonically
 *      1.808 -> 1.898 across thr 0.5 -> 1e-4, strictly below 2 at every rung.
 * (M2) The measured local secant d log r / d log thr tracks e_pt(thr) deep in
 *      the tail to <~0.01 and is NON-MONOTONE: it dips to a shallow minimum
 *      ~1.875 near thr ~ 0.005-0.01, then climbs back toward 2 -- confirming
 *      the approach is from below, not a settled sub-2 constant.
 * (M3) The gap x log T0 = (2 - measured local) . log T0 stabilises near the
 *      derived leading coefficient 4 in the deep tail (~3.9 -> ~4.4), so the
 *      -4/log T0 leading term of (*) is confirmed numerically.
 *
 * HONEST SCOPE -- derivation/measurement ONLY, NO QED. This isolates and
 * asymptotically analyses the r-factor of the inherited imp-34174/imp-33743
 * extrapolation component model; it changes no bound and introduces no new
 * mathematical claim. The component model is NOT a rigorous asymptotic; (*) is a
 * leading-order reading within it, not a proved limit. E_flow is the benign
 * mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT touch the
 * divergent C_Lip collision-Gronwall. The C_mb GUE-conditional per imp-486 is
 * UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity;
 * no refereed bound is changed.
 *
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (F2: r-exponent measured below 2; this isolates and derives its limit)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr) and r(thr))
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see imp-34329 (composite exponent limit -- distinct: this isolates the r-factor exponent only)
 * @see imp-34332 (prefactor P -> 1 -- distinct: this isolates the r-factor exponent only)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-34174/imp-34248 exactly (~1.000237)

// EXACT imp-34248 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function rFactor(thr) {
  const N = crossoverN(thr);
  const T0 = effectiveHeightForN(N);
  const r = eFlow(N) / E_TRUNC_PT;
  return { N, T0, logT0: Math.log(T0), r };
}

// ── Analytic point exponent (*) e_pt(thr) = 2 - 4 / log T0 ────────────────────
function pointExponent(logT0) {
  return 2 - 4 / logT0;
}

// ── Extended r-factor ladder (deepened past imp-34248 to thr = 1e-4) ──────────
const THRESHOLDS = [0.5, 0.3, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001];
const R_LADDER = THRESHOLDS.map((thr) => {
  const { logT0, r } = rFactor(thr);
  return {
    thr,
    logT0: +logT0.toFixed(4),
    r_eflow_over_etrunc: +r.toExponential(4),
    point_exponent: +pointExponent(logT0).toFixed(4), // 2 - 4/log T0, strictly < 2, rises toward 2
  };
});

// ── Measured local secant exponent d log r / d log thr between adjacent rungs ──
const ALL = THRESHOLDS.map((thr) => rFactor(thr));
const LOCAL_R_EXPONENTS = THRESHOLDS.slice(1).map((thr, k) => {
  const measured = Math.log(ALL[k + 1].r / ALL[k].r) / Math.log(thr / THRESHOLDS[k]);
  const lowerLogT0 = ALL[k + 1].logT0;
  return {
    window: `${THRESHOLDS[k]}->${thr}`,
    measured_r_exponent: +measured.toFixed(4), // d log r / d log thr
    point_exponent_at_lower_thr: +pointExponent(lowerLogT0).toFixed(4), // 2 - 4/log T0
    // (M3) gap x log T0 -> leading coefficient 4 of the derived -4/log T0 correction.
    gap_times_logT0: +((2 - measured) * lowerLogT0).toFixed(3),
  };
});

// ── Deep-tail OLS on ln r vs ln thr (reproduces + extends imp-34248 F2) ───────
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  return sxy / sxx;
}
const LN_THR = THRESHOLDS.map((t) => Math.log(t));
const LN_R = ALL.map((f) => Math.log(f.r));
const IMP34248_WINDOW = [2, 3, 4]; // thr in {0.1, 0.05, 0.01} -- imp-34248's deep-tail window
const DEEPEST_WINDOW = [6, 7, 8]; // thr in {0.001, 0.0005, 0.0001} -- deeper than imp-34248
const OLS_IMP34248_WINDOW = ols(
  IMP34248_WINDOW.map((i) => LN_THR[i]),
  IMP34248_WINDOW.map((i) => LN_R[i]),
); // reproduces imp-34248's ~1.917
const OLS_DEEPEST_WINDOW = ols(
  DEEPEST_WINDOW.map((i) => LN_THR[i]),
  DEEPEST_WINDOW.map((i) => LN_R[i]),
); // still sub-2, closer to the shallow-minimum region

export const IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT = {
  id: 'imp-34349',
  proofSection: 'S-frontier',
  question:
    'Derive and measure the limiting small-thr r-exponent of the imp-34248 F2 E_flow ratio ' +
    'r(thr) ~ (log T0)^2 thr^2: does the measured local d log r / d log thr (dropping to ~1.917) ' +
    'approach 2 FROM BELOW as thr -> 0, or settle at a sub-2 limit? Derivation/measurement only ' +
    'within the inherited imp-34174/imp-33743 component model; changes no bound; NO QED.',
  derivation:
    'The self-consistent crossover fixes T0(thr) ~ 2pi ((1-thr)/thr)^2 K_AMPL ~ thr^-2 const (the ' +
    'log-T0 factors cancel), so log T0 = -2 log thr + C. With r ~ (log T0)^2 / T0, log r = ' +
    '2 log(log T0) + 2 log thr + const, giving d log r / d log thr = 2 - 4 / log T0.',
  analyticLimit: {
    limiting_exponent: 2,
    approached_from: 'below',
    leading_correction: '-4 / log T0',
    gap_law: '2 - exponent ~ 4/log T0 = 2/(-log thr + C/2); logarithmically slow, gap halves only when thr squares',
  },
  rLadder: R_LADDER,
  localExponents: LOCAL_R_EXPONENTS,
  olsFits: {
    imp34248_window_r_slope: +OLS_IMP34248_WINDOW.toFixed(4), // ~1.917, reproduces imp-34248 F2 deep-tail
    deepest_window_r_slope: +OLS_DEEPEST_WINDOW.toFixed(4), // still < 2, past the shallow minimum
    note:
      'Both deep-tail OLS r-slopes remain strictly below 2, but the local secant exponent turns at a ' +
      'shallow minimum near thr ~ 0.005-0.01 and CLIMBS back toward 2 below it, matching the derived ' +
      'point form 2 - 4/log T0; the sub-2 readings are the finite-thr correction, not a settled limit.',
  },
  finding: {
    M1_point_exponent_below_2_rising:
      'The analytic point exponent e_pt(thr) = 2 - 4/log T0 is strictly below 2 at every rung and ' +
      'rises monotonically 1.808 -> 1.898 across thr 0.5 -> 1e-4, encoding the approach to 2 from below.',
    M2_measured_non_monotone_climbs_back:
      'The measured local d log r / d log thr tracks e_pt(thr) deep in the tail and is NON-MONOTONE: it ' +
      'dips to a shallow minimum ~1.875 near thr ~ 0.005-0.01 then climbs back toward 2 (1.8752 -> ' +
      '1.8887 across thr 0.005 -> 0.0001), so it does NOT settle at a sub-2 limit.',
    M3_gap_times_logT0_confirms_4:
      'The gap x log T0 = (2 - measured) . log T0 stabilises near the derived leading coefficient 4 ' +
      'in the deep tail (~3.9 -> ~4.4), confirming the -4/log T0 leading correction of the derivation.',
  },
  isRigorous: false,
  honestScope:
    'Derivation/measurement only within the inherited imp-34174/imp-33743 extrapolation component ' +
    'model; NO QED. The component model is NOT a rigorous asymptotic and d log r / d log thr = ' +
    '2 - 4/log T0 is a leading-order reading within it, not a proved limit. E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no ' +
    'operator positivity; changes no bound; no refereed bound is changed.',
  citation:
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (F2 r-exponent below 2, identical sub-terms); ' +
    'imp-34174-crossover-surplus-threshold-family-decay.js (r(thr) closed form); ' +
    'imp-33743-sigma-fartail-crossover-closed-form.js (generalised N_cross(thr)); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT_ASSERTIONS = [
  {
    // M1: analytic point exponent 2 - 4/log T0 is strictly below 2 at every rung and rises monotonically.
    id: 'imp34349-point-exponent-below-2-rising',
    description: 'e_pt(thr) = 2 - 4/log T0 is strictly < 2 everywhere and increases monotonically toward 2 (1.808 -> 1.898)',
    holds: () => {
      const es = R_LADDER.map((row) => row.point_exponent);
      for (const e of es) if (!(e < 2)) return false;
      for (let i = 1; i < es.length; i++) if (es[i] <= es[i - 1]) return false;
      return es[0] < 1.82 && es[es.length - 1] > 1.89;
    },
  },
  {
    // M2: the measured local secant exponent is NON-MONOTONE -- dips to an interior minimum then climbs
    // back toward 2, so it approaches 2 from below rather than settling at a sub-2 limit.
    id: 'imp34349-measured-non-monotone-climbs-back',
    description: 'the measured local d log r / d log thr has an interior minimum then climbs back toward 2, and the deepest window exceeds that minimum',
    holds: () => {
      const es = LOCAL_R_EXPONENTS.map((row) => row.measured_r_exponent);
      const minVal = Math.min(...es);
      const minIdx = es.indexOf(minVal);
      const deepest = es[es.length - 1];
      // interior minimum (not at either end) and the deepest window has climbed back above it toward 2
      return minIdx > 0 && minIdx < es.length - 1 && deepest > minVal && minVal > 1.8 && minVal < 2 && deepest < 2;
    },
  },
  {
    // M3: gap x log T0 stabilises near the derived leading coefficient 4 in the deep tail.
    id: 'imp34349-gap-times-logT0-near-4',
    description: 'the deep-tail (2 - measured) . log T0 stabilises near the derived leading coefficient 4 (between 3.5 and 4.6)',
    holds: () => {
      const deep = LOCAL_R_EXPONENTS.slice(-3).map((row) => row.gap_times_logT0);
      return deep.every((g) => g > 3.5 && g < 4.6);
    },
  },
  {
    // Point form tracks the measured secant deep in the tail (both below 2, agreeing to <~0.02).
    id: 'imp34349-point-form-tracks-measured-deep-tail',
    description: 'the analytic 2 - 4/log T0 tracks the measured local exponent to <0.02 across the deepest windows',
    holds: () =>
      LOCAL_R_EXPONENTS.slice(-3).every(
        (row) => Math.abs(row.measured_r_exponent - row.point_exponent_at_lower_thr) < 0.02,
      ),
  },
  {
    // Consistency with imp-34248 F2: the r-slope over its {0.1,0.05,0.01} window reproduces ~1.917.
    id: 'imp34349-reproduces-imp34248-r-slope',
    description: 'the OLS r-slope over imp-34248 deep-tail window {0.1,0.05,0.01} reproduces ~1.917 and stays sub-2 deeper',
    holds: () =>
      Math.abs(OLS_IMP34248_WINDOW - 1.917) < 0.02 && OLS_DEEPEST_WINDOW < 2 && OLS_DEEPEST_WINDOW > 1.8,
  },
  {
    // Honesty gate: derivation/measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34349-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT.honestScope) &&
      /NO QED/.test(IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT.honestScope) &&
      /refereed bound is changed/i.test(IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT.honestScope),
  },
];

for (const a of IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34349-eflow-ratio-r-exponent-limit assertion failed: ${a.id}`);
  }
}
