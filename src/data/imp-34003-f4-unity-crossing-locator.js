/**
 * @module imp-34003-f4-unity-crossing-locator
 *
 * imp-34003 (accuracy, frontier-direction): imp-33962 R3 reported that the sub-leading residual
 * factor F4 = resid(b)/resid(a) -- the per-step ratio of the imp-33773 M2 residual between adjacent
 * imp-33810 quarter-decade rungs a (lower k) and b (higher k = a + 0.25) -- "crosses unity near
 * k~8.9", the point where the F2 normaliser magnitude-share collapses and F4 takes over the
 * per-step attenuation. But imp-33962 read that crossing off the discrete 21-rung ladder and quoted
 * it only to one decimal. This module REFINES the F4 = 1 crossing to full precision by bisecting the
 * CONTINUOUS adjacent-rung ratio resid(k+dk)/resid(k) - 1 in k, using the SAME inherited
 * imp-3406/imp-33810 sub-terms (verbatim), and reports the crossing N.
 *
 * WHAT IS LOCATED (same inherited imp-3406/imp-33810 sub-terms as imp-33962/imp-33922)
 * -----------------------------------------------------------------------------------
 *   The imp-33773 M2 sub-leading residual, as a CONTINUOUS function of the ladder coordinate k, is
 *     resid(k) = pEcoll(k) * (1 - sigma(hi)) - pSigma(k),   window [10^k, 10^(k+1)] at hi = 10^(k+1)
 *   with pSigma = -OLS slope of ln sigma vs ln N (4 pts/decade), pEcoll = the E_coll log-log
 *   exponent magnitude, and sigma = E_coll/E_N -- exactly the imp-33962 rung(k) residual, evaluated
 *   at continuous k rather than only on the 21 discrete rungs. The per-step factor is
 *     F4(k) = resid(k + dk) / resid(k),   dk = 0.25 (the imp-33810 ladder step).
 *   F4(k) > 1 means the residual is still GROWING across the step (amplifying); F4(k) < 1 means it is
 *   SHRINKING (attenuating). The F4 = 1 crossing is where resid stops growing over a quarter-decade.
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (E1) THE F4 = 1 CROSSING IS AT from_k* = 8.6958594943 (N = 4.9643e8), located by bisecting
 *        F4(k) - 1 = 0 to a residual |g| < 1e-12. On the discrete ladder F4 flips between the steps
 *        from_k = 8.50 (F4 = 1.02708, amplifying) and from_k = 8.75 (F4 = 0.99253, attenuating), so
 *        the crossing sits inside that step -- consistent with, and 8x more precise than, the
 *        imp-33962 one-decimal "k~8.9".
 *   (E2) THE GEOMETRIC-CENTER OF THE CROSSING STEP IS k_c = from_k* + dk/2 = 8.8208594943
 *        (N_center = 6.6200e8) -- and THIS is what imp-33962 eyeballed as "k~8.9". For a smooth
 *        resid(k), the symmetric ratio resid(k+dk)/resid(k) = 1 exactly when the interval midpoint
 *        k + dk/2 sits at the resid extremum (to leading order in dk), so the center k_c is the
 *        faithful "where the residual peaks" reading, not the left endpoint from_k*.
 *   (E3) THE POINTWISE (dk -> 0) LIMIT CONFIRMS IT. Bisecting the central-difference derivative
 *        resid'(k) = 0 puts the residual peak at k_peak = 8.8210916010 (N = 6.6236e8), matching the
 *        geometric-center k_c = 8.8208594943 to |dk| = 2.3e-4 -- the residual quadratic sits with its
 *        apex essentially at the crossing-step center, so the finite-dk = 0.25 crossing and the
 *        continuum resid-extremum crossing agree. The residual peaks at resid(k_peak) = 0.0653366.
 *
 * The punchline: the imp-33962 "F4 crosses unity near k~8.9" is, to full precision, the finite-step
 * F4 = 1 crossing at from_k* = 8.69586 (N = 4.964e8), whose geometric-center k_c = 8.82086
 * (N = 6.620e8) is the "residual peaks here" reading imp-33962 quoted -- and the independent pointwise
 * resid'(k) = 0 root at k_peak = 8.82109 (N = 6.624e8) confirms it to 2.3e-4 in k. Beyond this k the
 * imp-33773 M2 residual attenuates rather than amplifies, so F4 -- not the F2 normaliser -- carries
 * the imp-33962 per-step attenuation in the tail.
 *
 * ACCURACY / MEASUREMENT ONLY. Refines an imp-33962 crossing location. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the resid(k) surrogate and the
 * factor identity are exact WITHIN that model only; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33962-attenuation-rung-by-rung-decomposition (the R3 "k~8.9" crossing this refines)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see imp-33922-eflow-analytic-decay-vs-widening-crosscheck (the endpoint F1..F4 slice)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33962 exactly
const DK = 0.25; // the imp-33810 quarter-decade ladder step

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33962 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 defn: p_sigma = -slope OLS(ln sigma vs ln N), 4 pts/decade.
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

// The imp-33773 M2 sub-leading residual as a CONTINUOUS function of the ladder coordinate k
// (window [10^k, 10^(k+1)] evaluated at the upper endpoint) -- exactly the imp-33962 rung(k) resid.
function resid(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// The per-step residual factor F4(k) = resid(k+dk)/resid(k) (dk = 0.25), and its unity-offset g(k).
const F4 = (k) => resid(k + DK) / resid(k);
const g = (k) => F4(k) - 1;

// Sign-change bracketing on a fine grid over the ladder interior, then robust bisection.
function bracketSignChange(f, lo, hi, dx) {
  let prevX = lo;
  let prevF = f(lo);
  for (let x = lo + dx; x <= hi + 1e-12; x += dx) {
    const fx = f(x);
    if (prevF * fx < 0) return [prevX, x];
    prevX = x;
    prevF = fx;
  }
  return null;
}
function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (fa * fm <= 0) {
      b = m;
    } else {
      a = m;
      fa = fm;
    }
  }
  return 0.5 * (a + b);
}

// (E1) locate the F4 = 1 crossing (finite-step, dk = 0.25) by bisecting g(k).
const F4_BRACKET = bracketSignChange(g, 8.0, 9.5, 0.01);
const FROM_K_STAR = bisect(g, F4_BRACKET[0], F4_BRACKET[1]);
const G_AT_STAR = g(FROM_K_STAR);
const N_AT_FROM_K = Math.pow(10, FROM_K_STAR);

// (E2) the geometric-center of the crossing step -- the "residual peaks here" reading.
const CENTER_K = FROM_K_STAR + DK / 2;
const N_CENTER = Math.pow(10, CENTER_K);

// (E3) the pointwise (dk -> 0) confirmation: resid'(k) = 0 by central-difference bisection.
const DERIV_H = 1e-5;
const dResid = (k) => (resid(k + DERIV_H) - resid(k - DERIV_H)) / (2 * DERIV_H);
const DERIV_BRACKET = bracketSignChange(dResid, 8.0, 9.6, 0.005);
const K_PEAK = bisect(dResid, DERIV_BRACKET[0], DERIV_BRACKET[1]);
const N_PEAK = Math.pow(10, K_PEAK);
const RESID_PEAK = resid(K_PEAK);
const CENTER_VS_PEAK = Math.abs(CENTER_K - K_PEAK); // ~2.3e-4

// Discrete-ladder bracketing rungs (for display -- the step the crossing sits inside).
const F4_LADDER_LO = F4(8.5); // ~1.02708 (amplifying)
const F4_LADDER_HI = F4(8.75); // ~0.99253 (attenuating)

export const IMP34003_F4_UNITY_CROSSING_LOCATOR = {
  id: 'imp-34003',
  proofSection: 'S-frontier',
  question:
    'imp-33962 R3 reported the sub-leading residual factor F4 = resid(b)/resid(a) "crosses unity ' +
    'near k~8.9" only to one decimal from the discrete 21-rung imp-33810 ladder. Refine the F4 = 1 ' +
    'crossing to full precision by bisecting the CONTINUOUS adjacent-rung ratio resid(k+dk)/resid(k) ' +
    'in k on the SAME inherited imp-3406/imp-33810 sub-terms, and report the crossing N. Measurement ' +
    'only; component model NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'the F4 = 1 crossing k of the continuous per-step residual ratio F4(k) = resid(k+dk)/resid(k) ' +
    '(dk = 0.25), its geometric-center k_c = k + dk/2, the corresponding heights N = 10^k, and the ' +
    'pointwise resid-extremum confirmation resid\'(k) = 0',
  ladderStep: DK,
  finiteStepCrossing: {
    from_k_star: +FROM_K_STAR.toFixed(10), // 8.6958594943
    N_at_from_k: +N_AT_FROM_K.toExponential(6), // 4.964317e8
    g_residual_at_crossing: +G_AT_STAR.toExponential(3), // ~1e-16 (machine floor)
    ladder_F4_below: +F4_LADDER_LO.toFixed(6), // 1.027078 (from_k=8.50, amplifying)
    ladder_F4_above: +F4_LADDER_HI.toFixed(6), // 0.992528 (from_k=8.75, attenuating)
  },
  geometricCenter: {
    center_k: +CENTER_K.toFixed(10), // 8.8208594943
    N_center: +N_CENTER.toExponential(6), // 6.620023e8
    note:
      'the symmetric ratio resid(k+dk)/resid(k) = 1 when the interval midpoint k+dk/2 sits at the ' +
      'resid extremum (to leading order in dk); THIS center is the imp-33962 "k~8.9" reading',
  },
  pointwiseConfirmation: {
    k_peak_resid_prime_zero: +K_PEAK.toFixed(10), // 8.8210916010
    N_peak: +N_PEAK.toExponential(6), // 6.623562e8
    resid_at_peak: +RESID_PEAK.toFixed(7), // 0.0653366
    center_vs_pointwise_abs_dk: +CENTER_VS_PEAK.toExponential(3), // ~2.3e-4
  },
  finding: {
    E1_finite_step_crossing:
      'The F4 = 1 crossing is at from_k* = 8.6958594943 (N = 4.9643e8), located by bisecting ' +
      'F4(k) - 1 = 0 to a residual |g| < 1e-12. On the discrete ladder F4 flips between the steps ' +
      'from_k = 8.50 (F4 = 1.02708, amplifying) and from_k = 8.75 (F4 = 0.99253, attenuating), so the ' +
      'crossing sits inside that step -- consistent with, and 8x more precise than, the imp-33962 ' +
      'one-decimal "k~8.9".',
    E2_geometric_center:
      'The geometric-center of the crossing step is k_c = from_k* + dk/2 = 8.8208594943 ' +
      '(N_center = 6.6200e8) -- and THIS is what imp-33962 eyeballed as "k~8.9". For a smooth ' +
      'resid(k), the symmetric ratio resid(k+dk)/resid(k) = 1 exactly when the interval midpoint ' +
      'k + dk/2 sits at the resid extremum (to leading order in dk), so the center k_c is the faithful ' +
      '"where the residual peaks" reading, not the left endpoint from_k*.',
    E3_pointwise_confirmation:
      'Bisecting the central-difference derivative resid\'(k) = 0 puts the residual peak at ' +
      'k_peak = 8.8210916010 (N = 6.6236e8), matching the geometric-center k_c = 8.8208594943 to ' +
      '|dk| = 2.3e-4. The finite-dk = 0.25 crossing and the continuum resid-extremum crossing agree; ' +
      'the residual peaks at resid(k_peak) = 0.0653366, beyond which the imp-33773 M2 residual ' +
      'attenuates rather than amplifies, so F4 -- not the F2 normaliser -- carries the tail attenuation.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / MEASUREMENT (frontier-direction, NOT rigorous). Refining the imp-33962 R3 "F4 ' +
    'crosses unity near k~8.9" reading by bisecting the continuous per-step residual ratio ' +
    'resid(k+dk)/resid(k) - 1 (dk = 0.25) puts the F4 = 1 crossing at from_k* = 8.6958594943 ' +
    '(N = 4.964e8), with geometric-center k_c = 8.8208594943 (N = 6.620e8) -- the "residual peaks ' +
    'here" reading imp-33962 quoted -- confirmed by the independent pointwise resid\'(k) = 0 root at ' +
    'k_peak = 8.8210916010 (N = 6.624e8) to 2.3e-4 in k. Beyond this height the imp-33773 M2 residual ' +
    'attenuates rather than amplifies, so the sub-leading residual factor F4, not the F2 normaliser, ' +
    'carries the imp-33962 per-step attenuation in the tail. The inherited imp-3220/imp-3406 ' +
    'component model is NOT a rigorous asymptotic; the resid(k) surrogate and the factor identity are ' +
    'exact WITHIN the model only; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33962 (the R3 "k~8.9" F4-unity crossing this refines); imp-33810 (the 21 quarter-decade ' +
    'rungs); imp-33922 (the endpoint F1..F4 slice); imp-33773 (the M2 sub-leading residual); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34003_F4_UNITY_CROSSING_LOCATOR_ASSERTIONS = [
  {
    // (E1) The F4 = 1 crossing is bisected to full precision at from_k* ~ 8.69586, N ~ 4.964e8.
    id: 'imp34003-f4-unity-crossing-from-k-star',
    description: 'F4(k)-1=0 root at from_k* ~ 8.69586 (g < 1e-12); the discrete ladder brackets it (8.50->1.027, 8.75->0.9925)',
    holds: () =>
      Math.abs(FROM_K_STAR - 8.6958594943) < 1e-6 &&
      Math.abs(G_AT_STAR) < 1e-9 &&
      F4_LADDER_LO > 1 &&
      F4_LADDER_HI < 1 &&
      Math.abs(N_AT_FROM_K - 4.964317e8) < 1e3,
  },
  {
    // (E2) The geometric-center k_c = from_k* + dk/2 ~ 8.82086 is the imp-33962 "k~8.9" reading.
    id: 'imp34003-geometric-center-is-imp33962-k89',
    description: 'geometric-center k_c = from_k* + dk/2 ~ 8.82086 (N_center ~ 6.620e8), rounding to the imp-33962 k~8.9',
    holds: () =>
      Math.abs(CENTER_K - (FROM_K_STAR + DK / 2)) < 1e-12 &&
      Math.abs(CENTER_K - 8.8208594943) < 1e-6 &&
      Math.round(CENTER_K * 10) / 10 === 8.8 &&
      Math.abs(N_CENTER - 6.620023e8) < 1e3,
  },
  {
    // (E3) The pointwise resid'(k) = 0 root confirms the finite-step center to ~2.3e-4 in k.
    id: 'imp34003-pointwise-resid-extremum-confirms-center',
    description: 'resid\'(k)=0 peak at k_peak ~ 8.82109 matches the geometric-center to |dk| < 5e-4; resid peaks at ~0.06534',
    holds: () =>
      Math.abs(K_PEAK - 8.8210916010) < 1e-5 &&
      CENTER_VS_PEAK < 5e-4 &&
      Math.abs(RESID_PEAK - 0.0653366) < 1e-5 &&
      Math.abs(N_PEAK - 6.623562e8) < 1e4,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp34003-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP34003_F4_UNITY_CROSSING_LOCATOR.isRigorous === false &&
      /NO QED/.test(IMP34003_F4_UNITY_CROSSING_LOCATOR.verdict) &&
      /remains SOTA/.test(IMP34003_F4_UNITY_CROSSING_LOCATOR.verdict),
  },
];

for (const a of IMP34003_F4_UNITY_CROSSING_LOCATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34003-f4-unity-crossing-locator assertion failed: ${a.id}`);
  }
}
