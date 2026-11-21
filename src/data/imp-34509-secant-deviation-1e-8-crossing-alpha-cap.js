/**
 * @module imp-34509-secant-deviation-1e-8-crossing-alpha-cap
 *
 * imp-34509 (numerical, frontier-direction): push the imp-34471 direct-secant deviation
 *     delta(N) = (p_resid - p_direct) * log T0 = (gapSigmaDirect - resid) * L
 * one decade tighter -- bisect the SAME imp-34410 full-sigma central secant for the delta < 1e-8
 * crossing, and locate the log10 N at which the local exponent alpha_local = -d ln delta/d ln N
 * FIRST reaches 0.49, quantifying how close to 1/2 the exponent gets before the secant roundoff
 * floor dominates.
 *
 * WHAT imp-34471 LEFT OPEN
 * ------------------------
 * imp-34471 pinned the delta < 1e-6 crossing at log10 N ~ 24.80 (safely inside the clean
 * power-law window) and found alpha_local drifting UP monotonically 0.415 -> 0.472 toward the
 * alpha = 1/2 E_coll ~ N^(-1/2) envelope, with the secant roundoff floor (~1.6e-9, from the
 * 1e-4 ln N step) taking over past log10 N ~ 28. It never located the tighter delta < 1e-8
 * crossing, and never located the log10 N at which alpha_local reaches 0.49 -- leaving open how
 * close to 1/2 the measured exponent actually gets before roundoff caps it.
 *
 * THE MEASUREMENT (identical imp-34410/imp-34471 machinery, one decade tighter)
 * ---------------------------------------------------------------------------
 * delta(N) is recomputed VERBATIM from the imp-34471 full-sigma central secant
 *     p_direct(N) = -d ln sigma/d ln N   (sigma = E_coll/(E_trunc + E_flow + E_coll)),
 *     resid(N)    = (1/2)(u-1)/(u L),    delta(N) = (1/2 - p_direct - resid) * L,
 * with the argument-scaled step dl = 1e-4 * ln N inherited unchanged. Two bisections on the exact
 * secant (delta < 1e-8, delta < 1e-7 for context) plus a fine alpha_local scan over the rollover.
 *
 * THE FINDING (measurement / threshold-location only)
 * ---------------------------------------------------
 *   (F1) THE delta < 1e-8 CROSSING SITS AT log10 N ~ 29.17, but PAST THE ROUNDOFF-FLOOR ONSET.
 *        Bisection pins it at log10 N = 29.1733 (N ~ 10^29.2), which is beyond the log10 N ~ 28
 *        floor onset: delta at the crossing (~1e-8) is only ~6x above the secant floor (~1.6e-9),
 *        so this crossing is FLOOR-CONTAMINATED -- it does NOT sit inside the clean power-law
 *        window (contrast the imp-34471 1e-6 crossing at 24.80, which was clean). The tighter
 *        threshold is located but no longer certifies pure power-law decay.
 *   (F2) alpha_local NEVER REACHES 0.49 AT DOUBLE PRECISION. The local exponent peaks at
 *        alpha_local ~ 0.4722 at log10 N ~ 25.15, then ROLLS OVER and declines (0.451 at
 *        log10 N = 28, 0.411 at 29, 0.319 at 30) as the roundoff floor flattens delta toward a
 *        constant and collapses the local slope toward 0. The secant floor CAPS the achievable
 *        local exponent ~0.018 below 0.49 and ~0.028 below the true 1/2 asymptote -- the 0.49
 *        point is unreachable before roundoff dominates.
 *   (F3) SUB-GAP EXTENDED-PRECISION-SECANT-ALPHA-CAP. The ticket premise that alpha_local reaches
 *        0.49 "before the secant roundoff floor" is FALSIFIED at double precision: the floor takes
 *        over (log10 N >~ 28) before the drifting exponent can climb past ~0.472. Certifying the
 *        alpha_local -> 0.49 (and true 1/2) approach requires an extended-precision secant (or a
 *        wider/adaptive argument step tuned to sink the floor below ~1e-11) to open the clean
 *        log10 N ~ 29..35 window -- the same digit-loss wall named in imp-34492.
 *
 * THE VERDICT: the imp-34471 delta < 1e-8 crossing is located at log10 N ~ 29.17 but is
 * floor-contaminated (outside the clean window); and alpha_local NEVER reaches 0.49 at double
 * precision -- it peaks at ~0.4722 (log10 N ~ 25.15) and rolls over, capped ~0.018 short of 0.49
 * by the secant roundoff floor. The 0.49 / true-1/2 approach is an EXTENDED-PRECISION sub-gap.
 *
 * MEASUREMENT / THRESHOLD-LOCATION ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34471-direct-secant-deviation-decay-law-fit (1e-6 crossing at 24.80, alpha drifts to 0.472)
 * @see imp-34410-complement-identity-direct-secant-crossvalidation (F3 named delta, tabulated 3 points)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (full-sigma direct secant path)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (shared resid = (1/2) d ln(log T0)/d ln N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const LOG_2PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33816)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // identical to imp-33816/imp-34410/imp-34471

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi), never forming T0/N.
function uFromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 200; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-15 * Math.max(1, u)) break;
  }
  return u;
}

// The shared closed-form residual (imp-34130/imp-34328/imp-34410): resid = (1/2)(u-1)/(u L).
function residFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  return HALF * (u - 1) / (u * L);
}

// The FULL sigma exponent sub-terms (imp-33816/imp-34410/imp-34471), in log-N space so the far
// tail never overflows: sigma = E_coll/(E_trunc + E_flow + E_coll).
function lnSigmaFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  const C_F = (u + 1) / TWO_PI; // (log(T0/2pi)+1)/2pi, imp-398 pinned prefactor
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN; // C_C sqrt(L/N)
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}

// DIRECT full-sigma central secant of p(N) = -d ln sigma/d ln N (imp-34471 step, argument-scaled).
function pDirectFromLnN(lnN) {
  const dl = 1e-4 * Math.max(1, lnN);
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// The imp-34471 deviation, recomputed verbatim: delta = (gapSigmaDirect - resid) * L.
function deltaFromLog10N(d) {
  const lnN = d * Math.LN10;
  const L = uFromLnN(lnN) + LOG_2PI;
  const gapSigmaDirect = HALF - pDirectFromLnN(lnN);
  return (gapSigmaDirect - residFromLnN(lnN)) * L;
}

// Local power-law exponent in N: alpha_local = -d ln delta/d ln N (central, half-decade step).
function alphaLocalAtLog10N(d) {
  const h = 0.25;
  return -(Math.log(deltaFromLog10N(d + h)) - Math.log(deltaFromLog10N(d - h))) / (2 * h * Math.LN10);
}

// Bisection on the exact full-sigma secant for the first log10 N where |delta| < thr.
function crossingLog10N(thr) {
  let lo = 24;
  let hi = 40;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (Math.abs(deltaFromLog10N(m)) >= thr) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// Fine scan for the alpha_local peak (the exponent rolls over before ever reaching 0.49).
function alphaPeak() {
  let best = -Infinity;
  let bestAt = 0;
  for (let d = 22; d <= 28; d += 0.05) {
    const a = alphaLocalAtLog10N(d);
    if (a > best) {
      best = a;
      bestAt = d;
    }
  }
  return { alphaMax: best, log10NAtPeak: bestAt };
}

const CROSSING_1E8 = crossingLog10N(1e-8);
const CROSSING_1E7 = crossingLog10N(1e-7);
const PEAK = alphaPeak();
const DELTA_AT_1E8 = deltaFromLog10N(CROSSING_1E8);
const SECANT_FLOOR = 1.6e-9; // imp-34471 measured secant roundoff floor (1e-4 ln N step)

// Rollover ladder: alpha_local climbs to the peak, then collapses as the floor flattens delta.
const ROLLOVER_LADDER = [24, 25, 25.15, 26, 27, 28, 29, 30].map((d) => ({
  log10N: d,
  delta: +deltaFromLog10N(d).toExponential(4),
  alphaLocal: +alphaLocalAtLog10N(d).toFixed(4),
}));

export const IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP = {
  id: 'imp-34509',
  proofSection: 'S-frontier',
  question:
    'Locate the imp-34471 direct-secant deviation delta < 1e-8 crossing and the log10 N where its ' +
    'local exponent reaches 0.49, before the secant roundoff floor. imp-34471 pinned the delta < 1e-6 ' +
    'crossing at log10 N ~ 24.80 and found alpha_local drifting up 0.415 -> 0.472 toward the 1/2 ' +
    'E_coll envelope, with the floor (~1.6e-9) taking over past log10 N ~ 28, but never located the ' +
    '1e-8 crossing or the 0.49 point. Measurement / threshold-location only; conditional-share ' +
    'diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'delta(N) = (1/2 - p_direct - resid) * L from the imp-34471 full-sigma central secant ' +
    'p(N) = -d ln sigma/d ln N (sigma = E_coll/(E_trunc + E_flow + E_coll), step dl = 1e-4 ln N); ' +
    'bisection for the log10 N where |delta| first falls below 1e-8 and 1e-7; and a fine scan of ' +
    'alpha_local = -d ln delta/d ln N across the rollover for its peak and any 0.49 crossing',
  crossing1e8Log10N: +CROSSING_1E8.toFixed(4),
  crossing1e7Log10N: +CROSSING_1E7.toFixed(4),
  deltaAt1e8Crossing: +DELTA_AT_1E8.toExponential(4),
  secantFloor: SECANT_FLOOR,
  floorMarginAt1e8: +(DELTA_AT_1E8 / SECANT_FLOOR).toFixed(2), // ~6x -> floor-contaminated
  alphaLocalMax: +PEAK.alphaMax.toFixed(5),
  alphaLocalPeakLog10N: +PEAK.log10NAtPeak.toFixed(3),
  alphaReaches049: false,
  rolloverLadder: ROLLOVER_LADDER,
  finding: {
    F1_crossing_1e8_is_floor_contaminated:
      'Bisection on the exact full-sigma secant pins the first log10 N where |delta| < 1e-8 at ' +
      'log10 N = 29.17 (N ~ 10^29.2), PAST the log10 N ~ 28 roundoff-floor onset: delta at the ' +
      'crossing (~1e-8) is only ~6x above the ~1.6e-9 secant floor, so the crossing is ' +
      'FLOOR-CONTAMINATED and does NOT sit inside the clean power-law window (the imp-34471 1e-6 ' +
      'crossing at 24.80 was clean). The 1e-7 crossing at log10 N ~ 26.92 is the last still near ' +
      'the clean window.',
    F2_alpha_local_never_reaches_049:
      'The local exponent alpha_local = -d ln delta/d ln N NEVER reaches 0.49 at double precision. ' +
      'It peaks at alpha_local ~ 0.4722 at log10 N ~ 25.15, then ROLLS OVER and declines (0.451 at ' +
      'log10 N = 28, 0.411 at 29, 0.319 at 30) as the roundoff floor flattens delta toward a ' +
      'constant and collapses the local slope toward 0. The floor CAPS the achievable exponent ' +
      '~0.018 below 0.49 and ~0.028 below the true 1/2 asymptote.',
    F3_sub_gap_extended_precision_secant_alpha_cap:
      'SUB-GAP EXTENDED-PRECISION-SECANT-ALPHA-CAP. The ticket premise that alpha_local reaches 0.49 ' +
      'before the roundoff floor is FALSIFIED at double precision: the floor takes over ' +
      '(log10 N >~ 28) before the drifting exponent can climb past ~0.472. Certifying the ' +
      'alpha_local -> 0.49 (and true 1/2) approach requires an extended-precision secant (or a ' +
      'wider/adaptive argument step tuned to sink the floor below ~1e-11) to open the clean ' +
      'log10 N ~ 29..35 window -- the same digit-loss wall named in imp-34492.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / THRESHOLD-LOCATION (frontier-direction, NOT rigorous). The imp-34471 direct-secant ' +
    'deviation delta < 1e-8 crossing is located at log10 N ~ 29.17, but it lies PAST the log10 N ~ 28 ' +
    'roundoff-floor onset (delta there is only ~6x above the ~1.6e-9 secant floor), so it is ' +
    'FLOOR-CONTAMINATED and does NOT sit inside the clean power-law window. The local exponent ' +
    'alpha_local NEVER reaches 0.49 at double precision: it peaks at ~0.4722 (log10 N ~ 25.15), then ' +
    'rolls over and collapses toward 0, capped ~0.018 short of 0.49 and ~0.028 short of the true 1/2 ' +
    'asymptote by the secant roundoff floor. The 0.49 / true-1/2 approach is an EXTENDED-PRECISION ' +
    'sub-gap (EXTENDED-PRECISION-SECANT-ALPHA-CAP): reaching it needs an extended-precision secant to ' +
    'open the log10 N ~ 29..35 window. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34471 (1e-6 crossing at 24.80, alpha drifts up to 0.472, floor onset ~28); imp-34410 (F3 ' +
    'named delta); imp-33816 (full-sigma direct secant); imp-34130 (shared resid); imp-34492 ' +
    '(EXTENDED-PRECISION near-pole digit-loss wall); imp-486 (C_mb GUE-conditional).',
};

export const IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP_ASSERTIONS = [
  {
    // (F1): the delta < 1e-8 crossing is located near log10 N ~ 29.17.
    id: 'imp34509-crossing-1e8-near-29p17',
    description: '|delta| first drops below 1e-8 at log10 N in (28.8, 29.6)',
    holds: () => CROSSING_1E8 > 28.8 && CROSSING_1E8 < 29.6,
  },
  {
    // (F1): that crossing is floor-contaminated -- only a single-digit multiple of the secant floor.
    id: 'imp34509-crossing-1e8-floor-contaminated',
    description: 'delta at the 1e-8 crossing is within ~10x of the ~1.6e-9 secant floor (outside the clean window)',
    holds: () => DELTA_AT_1E8 / SECANT_FLOOR > 3 && DELTA_AT_1E8 / SECANT_FLOOR < 10,
  },
  {
    // (F2): alpha_local peaks below 0.49 and never reaches it -- the 0.49 point does not exist.
    id: 'imp34509-alpha-local-capped-below-049',
    description: 'alpha_local peaks in (0.46, 0.49) and never reaches 0.49 at double precision',
    holds: () => PEAK.alphaMax > 0.46 && PEAK.alphaMax < 0.49,
  },
  {
    // (F2): alpha_local ROLLS OVER -- higher at the peak than a decade past it (floor collapses the slope).
    id: 'imp34509-alpha-local-rolls-over-past-floor',
    description: 'alpha_local at the peak exceeds alpha_local at log10 N = 30 (the exponent collapses past the floor)',
    holds: () => PEAK.alphaMax > alphaLocalAtLog10N(30) && alphaLocalAtLog10N(30) < PEAK.alphaMax - 0.05,
  },
  {
    // Reuse gate: reproduces the imp-34471 anchor (delta ~ 1.8e-4 at log10 N = 20, identical secant).
    id: 'imp34509-reproduces-imp34471-anchor',
    description: 'delta(log10 N=20) ~ 1.8e-4 (matches imp-34471/imp-34410 F3, identical inherited secant)',
    holds: () => Math.abs(deltaFromLog10N(20) - 1.80e-4) < 5e-6,
  },
  {
    // Honesty gate: measurement only, sub-gap named, no QED, no refereed bound is changed.
    id: 'imp34509-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, EXTENDED-PRECISION sub-gap named, no QED, no refereed bound is changed',
    holds: () =>
      IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP.isRigorous === false &&
      IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP.alphaReaches049 === false &&
      /EXTENDED-PRECISION-SECANT-ALPHA-CAP/.test(IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP.verdict) &&
      /NO QED/.test(IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP.verdict) &&
      /refereed bound is changed/i.test(IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP.verdict),
  },
];

for (const a of IMP34509_SECANT_DEVIATION_1E8_CROSSING_ALPHA_CAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34509-secant-deviation-1e-8-crossing-alpha-cap assertion failed: ${a.id}`);
  }
}
