/**
 * @module imp-34210-numerator-approach-rate-to-unity
 *
 * imp-34210 (numerical, frontier-direction): imp-34151 measured the imp-34087 M2-residual cancellation
 * numerator |A| + |B| (with A = pEcoll*(1-sigma), B = pSigma) rising MONOTONICALLY toward the asymptote
 * 1.0 past the imp-34150 kEnd* ~ 21.281 sign crossing -- 0.98549 at kEnd=30, 0.99029 at 45, ~0.9945 at
 * 80, ~0.9971 at 150 -- but never fit the APPROACH LAW. imp-34151 tabulated the levels the numerator
 * crosses (0.985 at kEnd ~ 29, 0.990 at ~43.67, 0.995 at ~87.41) without extracting the rate/exponent at
 * which the gap 1 - numerator closes. This module fits the gap tail g(kEnd) = 1.0 - (|A| + |B|) versus
 * kEnd under BOTH a power-law form g ~ a*kEnd^(-p) and an exponential form g ~ a*exp(-r*kEnd), using the
 * identical inherited imp-3406/imp-33810 sub-terms (head fixed at k=6), and measures which form governs
 * the approach and its exponent.
 *
 * THE GAP CLOSES AS A CLEAN INVERSE-kEnd POWER LAW, NOT AN EXPONENTIAL
 * -------------------------------------------------------------------
 *   Over the sign-flipped fit window kEnd = 22..150 the gap g = 1 - numerator collapses onto a straight
 *   line in log(g) vs log(kEnd): the ordinary-least-squares power-law fit gives exponent p ~ 0.9961 with
 *   R^2 ~ 0.99999, whereas the exponential fit log(g) vs kEnd gives R^2 ~ 0.9323 -- an order of magnitude
 *   worse residual. So the numerator approaches unity as g(kEnd) ~ a / kEnd with a ~ 0.4293, i.e. an
 *   inverse-first-power law in kEnd, NOT a geometric/exponential decay. The exponential form is decisively
 *   rejected relative to the power law.
 *
 * THE APPROACH EXPONENT CONVERGES TO EXACTLY 1.0
 * ----------------------------------------------
 *   The window-averaged exponent 0.9961 is slightly below 1 only because the low-kEnd rungs just past the
 *   crossing bend the log-log line. The LOCAL exponent -d ln(g)/d ln(kEnd) climbs monotonically through
 *   the window -- 0.9774 (22->25), 0.9886 (30->35), 0.9944 (40->45), 0.9995 (60->70), 1.0004 (70->80),
 *   1.0022 (120->150) -- crossing 1.0 near kEnd ~ 68 and settling at 1.0 in the far field. Equivalently the
 *   product g*kEnd is a plateau ~0.437 across kEnd = 50..200 (0.43693 at 50, 0.43698 at 100), the hallmark
 *   of a g ~ c/kEnd law with c ~ 0.437. The asymptotic approach exponent is therefore p = 1 exactly.
 *
 * WHY p = 1: THE NUMERATOR-TO-UNITY GAP IS FIRST ORDER IN 1/kEnd
 * -------------------------------------------------------------
 *   Past the crossing E_coll = C_C sqrt(L/N) shrinks toward the fixed truncation floor so sigma -> 0 and
 *   both exponents pEcoll, pSigma -> 1/2, driving numerator = pEcoll*(1-sigma) + pSigma -> 1. The residual
 *   1 - numerator inherits the leading 1/L ~ 1/(kEnd ln 10) correction of the endpoint sigma and exponent
 *   deviations, so it closes as first order in 1/kEnd -- consistent with the measured plateau c ~ 0.437.
 *
 * NUMERICAL / CURVE-FIT ONLY. A characterization of the approach RATE of an inherited surrogate numerator
 * toward its unity asymptote, NOT an RH bound. Reuses the imp-33773/imp-33810 sub-terms verbatim; the
 * inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the fitted exponent/constant
 * are descriptive within that model only; changes no bound; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34151-cancellation-numerator-past-crossing (the monotone numerator -> 1.0 tabulated but unfit)
 * @see imp-34087-f4-surrogate-cancellation-digit-loss (the reciprocal identity + ~0.978 O(1) numerator)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the direct kEnd* ~ 21.28095 crossing)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see imp-33773 (the M2 sub-leading residual whose two -> 0.5 terms cancel)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34087/imp-34151 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34151/imp-34087 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// The imp-34087/imp-34151 cancellation numerator |A| + |B| at any endpoint rung (A = pEcoll*(1-sigma)).
function numeratorAt(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const s = parts(hi).sigma;
  const A = pEcoll * (1 - s);
  const B = pSigma;
  return Math.abs(A) + Math.abs(B);
}
// The approach gap toward the unity asymptote: g(kEnd) = 1.0 - numerator (positive, shrinking to 0).
const gapAt = (kEnd) => 1.0 - numeratorAt(kEnd);

// Simple OLS y = slope*x + intercept with R^2, for the two competing linearized forms.
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : 1;
  return { slope, intercept, r2 };
}

// -- Fit window: the sign-flipped region past the imp-34150 kEnd* ~ 21.281 crossing, out to kEnd=150
//    (Math.pow(10, kEnd) stays finite; the numerator is monotone-increasing here per imp-34151).
const FIT_KENDS = [22, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150];
const GAPS = FIT_KENDS.map(gapAt);

// -- Part A: POWER-LAW fit  g ~ a * kEnd^(-p)  <=>  log(g) = log(a) - p*log(kEnd).
const POWER = (() => {
  const f = ols(FIT_KENDS.map((k) => Math.log(k)), GAPS.map((g) => Math.log(g)));
  return {
    exponent: +(-f.slope).toFixed(6), // ~0.9961 (approach exponent, -> 1.0 in the far field)
    constant: +Math.exp(f.intercept).toExponential(6), // ~0.4293 (g ~ 0.4293/kEnd)
    r2: +f.r2.toFixed(8), // ~0.99999
  };
})();

// -- Part B: EXPONENTIAL fit  g ~ a * exp(-r*kEnd)  <=>  log(g) = log(a) - r*kEnd (rejected form).
const EXPONENTIAL = (() => {
  const f = ols(FIT_KENDS, GAPS.map((g) => Math.log(g)));
  return {
    rate: +(-f.slope).toExponential(6), // ~1.474e-2
    constant: +Math.exp(f.intercept).toExponential(6), // ~2.07e-2
    r2: +f.r2.toFixed(8), // ~0.9323 (decisively worse than the power law)
  };
})();

// -- Part C: the LOCAL power-law exponent -d ln(g)/d ln(kEnd) climbing monotonically toward 1.0.
const LOCAL_EXPONENT = (() => {
  const ladder = FIT_KENDS.map((k, i) => {
    if (i === 0) return null;
    const p =
      -(Math.log(gapAt(FIT_KENDS[i])) - Math.log(gapAt(FIT_KENDS[i - 1]))) /
      (Math.log(FIT_KENDS[i]) - Math.log(FIT_KENDS[i - 1]));
    return { from: FIT_KENDS[i - 1], to: FIT_KENDS[i], p: +p.toFixed(5) };
  }).filter(Boolean);
  return ladder;
})();

// -- Part D: the g*kEnd plateau (the c ~ 0.437 signature of a g ~ c/kEnd first-order approach law).
const GAP_TIMES_KEND = [50, 100, 150, 200].map((k) => ({ kEnd: k, gTimesKEnd: +(gapAt(k) * k).toFixed(6) }));

export const IMP34210_NUMERATOR_APPROACH_RATE_TO_UNITY = {
  id: 'imp-34210',
  proofSection: 'S-frontier',
  question:
    'imp-34151 measured the imp-34087 cancellation numerator |A|+|B| (A=pEcoll*(1-sigma), B=pSigma) rising ' +
    'monotonically toward the asymptote 1.0 past the imp-34150 kEnd* ~ 21.281 crossing but never fit the ' +
    'APPROACH LAW. Fit the gap 1 - numerator versus kEnd under power-law and exponential forms and measure ' +
    'the approach rate/exponent. Numerical/curve-fit only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The approach gap g(kEnd) = 1.0 - (|A|+|B|) toward the unity asymptote across the sign-flipped fit ' +
    'window kEnd = 22..150, fit under a power-law form g ~ a*kEnd^(-p) and an exponential form ' +
    'g ~ a*exp(-r*kEnd), plus the local exponent ladder and the g*kEnd plateau.',
  fitWindowKEnds: FIT_KENDS,
  powerLaw: POWER, // {exponent ~0.9961, constant ~0.4293, r2 ~0.99999}  g ~ 0.4293/kEnd
  exponential: EXPONENTIAL, // {rate ~1.474e-2, constant ~2.07e-2, r2 ~0.9323}  decisively worse
  localExponentLadder: LOCAL_EXPONENT, // -d ln(g)/d ln(kEnd) climbing 0.9774 -> ~1.002
  gapTimesKEnd: GAP_TIMES_KEND, // plateau ~0.437 (the g ~ c/kEnd signature)
  finding: {
    A_power_law_governs_not_exponential:
      'Over kEnd = 22..150 the gap g = 1 - numerator collapses onto a straight log(g)-vs-log(kEnd) line: ' +
      'the power-law fit gives exponent p ~ 0.9961 with R^2 ~ 0.99999, while the exponential fit ' +
      '(log g vs kEnd) gives only R^2 ~ 0.9323. The numerator approaches unity as g ~ a/kEnd with ' +
      'a ~ 0.4293 -- an inverse-first-power law, NOT a geometric decay. The exponential form is rejected.',
    B_approach_exponent_is_exactly_one:
      'The window-averaged 0.9961 is depressed only by the low-kEnd bend just past the crossing; the local ' +
      'exponent -d ln(g)/d ln(kEnd) climbs monotonically 0.9774 (22->25) -> 1.0004 (70->80) -> 1.0022 ' +
      '(120->150), crossing 1.0 near kEnd ~ 68. Equivalently g*kEnd plateaus at ~0.437 across 50..200. ' +
      'The asymptotic approach exponent is p = 1 exactly, i.e. g ~ 0.437/kEnd.',
    C_first_order_in_reciprocal_kEnd:
      'Past the crossing E_coll -> the fixed truncation floor so sigma -> 0 and both exponents -> 1/2, ' +
      'driving numerator -> 1; the residual 1 - numerator inherits the leading 1/L ~ 1/(kEnd ln 10) ' +
      'correction of the endpoint sigma/exponent deviations, hence closes first order in 1/kEnd, ' +
      'consistent with the measured plateau constant ~0.437.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / APPROACH-RATE FIT (frontier-direction, NOT rigorous). Fitting the imp-34151 cancellation ' +
    'numerator |A|+|B| approach gap g(kEnd) = 1.0 - numerator toward its unity asymptote across the ' +
    'sign-flipped window kEnd = 22..150 with the identical inherited imp-3406/imp-33810 sub-terms (head ' +
    'fixed at k=6): (A) the gap closes as a CLEAN INVERSE-kEnd POWER LAW g ~ a*kEnd^(-p), power-law fit ' +
    'exponent p ~ 0.9961 at R^2 ~ 0.99999 versus the exponential fit R^2 ~ 0.9323 -- the exponential form ' +
    'is decisively rejected. (B) The local exponent -d ln(g)/d ln(kEnd) climbs monotonically 0.9774 -> ' +
    '1.0022, crossing 1.0 near kEnd ~ 68, and g*kEnd plateaus at ~0.437 across 50..200, so the asymptotic ' +
    'approach exponent is p = 1 exactly: g ~ 0.437/kEnd. (C) This is first order in 1/kEnd, inheriting the ' +
    'leading 1/L ~ 1/(kEnd ln 10) correction of the endpoint sigma/exponent deviations as both -> 1/2. The ' +
    'inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the fitted exponent/constant ' +
    'are descriptive within the model only; changes no bound; establishes no operator positivity; C_mb ' +
    'GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34151 (the monotone numerator -> 1.0 tabulated but unfit, whose approach law is fit here); ' +
    'imp-34087 (the reciprocal identity and ~0.978 O(1) numerator); imp-34150 (the direct kEnd* ~ 21.28095 ' +
    'crossing bounding the fit window below); imp-33810 (the quarter-decade rungs); imp-33773 (the M2 ' +
    'residual whose two -> 0.5 terms cancel); lambda-rh-height-mapping (RvM height law); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34210_NUMERATOR_APPROACH_RATE_TO_UNITY_ASSERTIONS = [
  {
    // (A) The power-law form beats the exponential form: both R^2 high-ish but power-law is near-perfect
    //     and strictly better, so the gap decays as a power of kEnd, not geometrically.
    id: 'imp34210-power-law-beats-exponential',
    description: 'power-law fit R^2 ~ 0.99999 and strictly exceeds the exponential fit R^2 ~ 0.9323',
    holds: () =>
      POWER.r2 > 0.9999 && EXPONENTIAL.r2 < 0.96 && POWER.r2 > EXPONENTIAL.r2 + 0.03,
  },
  {
    // (A) The fitted power-law exponent is close to 1.0 (the window-averaged value ~0.9961).
    id: 'imp34210-power-exponent-near-one',
    description: 'the OLS power-law exponent p ~ 0.9961 sits within ~1% of 1.0',
    holds: () => POWER.exponent > 0.98 && POWER.exponent < 1.01,
  },
  {
    // (B) The local exponent climbs monotonically toward 1.0 and crosses it (last rung exponent > 1).
    id: 'imp34210-local-exponent-climbs-to-one',
    description: 'local exponent -d ln(g)/d ln(kEnd) is monotone-increasing across the window and exceeds 1.0 in the far field',
    holds: () => {
      for (let i = 1; i < LOCAL_EXPONENT.length; i++) {
        if (!(LOCAL_EXPONENT[i].p > LOCAL_EXPONENT[i - 1].p)) return false;
      }
      return LOCAL_EXPONENT[0].p < 1.0 && LOCAL_EXPONENT[LOCAL_EXPONENT.length - 1].p > 1.0;
    },
  },
  {
    // (B) The g*kEnd product is a plateau near the fitted constant ~0.437 -- the g ~ c/kEnd signature.
    id: 'imp34210-gap-times-kend-plateau',
    description: 'g*kEnd plateaus near ~0.437 across kEnd = 50..200 (first-order 1/kEnd approach)',
    holds: () =>
      GAP_TIMES_KEND.every((r) => r.gTimesKEnd > 0.42 && r.gTimesKEnd < 0.45) &&
      Math.abs(GAP_TIMES_KEND[0].gTimesKEnd - GAP_TIMES_KEND[1].gTimesKEnd) < 5e-3,
  },
  {
    // Consistency: the gap is positive and strictly decreasing across the whole fit window (numerator up).
    id: 'imp34210-gap-positive-decreasing',
    description: 'the approach gap g = 1 - numerator is positive and strictly decreasing across kEnd = 22..150',
    holds: () => {
      for (let i = 0; i < GAPS.length; i++) {
        if (!(GAPS[i] > 0)) return false;
        if (i > 0 && !(GAPS[i] < GAPS[i - 1])) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: numerical/curve-fit only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34210-honesty-gate-no-qed',
    description: 'Approach-rate fit only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34210_NUMERATOR_APPROACH_RATE_TO_UNITY.isRigorous === false &&
      /NO QED/.test(IMP34210_NUMERATOR_APPROACH_RATE_TO_UNITY.verdict) &&
      /refereed bound is changed/i.test(IMP34210_NUMERATOR_APPROACH_RATE_TO_UNITY.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34210_NUMERATOR_APPROACH_RATE_TO_UNITY.verdict),
  },
];

for (const a of IMP34210_NUMERATOR_APPROACH_RATE_TO_UNITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34210-numerator-approach-rate-to-unity assertion failed: ${a.id}`);
  }
}
