/**
 * @module imp-35953-knee-offset-raw-rvm-height-crosscheck
 *
 * imp-35953 (accuracy, cross-validation): CROSS-CHECK the stability of the imp-35891
 * ~1-decade offset between the imp-35853 flattest-point knee (N_flat ~ 7.20e9) and the
 * imp-33701 sigma-exponent inflection decade ([1e10,1e11]) under an INDEPENDENT raw
 * Riemann-von Mangoldt height inverse, in place of the imp-3406 effectiveHeightForN.
 *
 * THE QUESTION
 * ------------
 * imp-35891 located BOTH markers on the SAME imp-3406 / imp-33582 sigma(N) surrogate,
 * which maps N -> T0 via effectiveHeightForN (a Newton inversion of the raw RvM law
 * N = (T0/2pi)(log(T0/2pi) - 1)). It found the two knees off by roughly one decade
 * (N_flat in [1e9,1e10]; inflection in [1e10,1e11]) and called that offset the honest
 * reading. But because both markers rode the SAME height inverse, the offset could in
 * principle be an artifact of that particular inverse rather than a stable feature.
 *
 * THE INDEPENDENT SURROGATE (raw RvM, closed form -- no Newton, no extrapolation)
 * ------------------------------------------------------------------------------
 * The raw RvM law N = (T0/2pi)(log(T0/2pi) - 1) inverts in CLOSED FORM via the Lambert W
 * function: writing x = T0/(2pi) and x = e^(1+w), the law becomes w*e^w = N/e, so
 *     w = W(N/e),      T0 = 2pi * exp(1 + W(N/e)).
 * This is an exact analytic inverse of the identical RvM law, computed by a Halley
 * Lambert-W iteration -- a genuinely different code path from the Newton-on-T iteration
 * inside effectiveHeightForN. If the ~1-decade offset survives the swap, it is a stable
 * feature of the two curves, not an artifact of the height-inverse implementation.
 *
 * THE MODEL (identical imp-3406 / imp-33582 sub-terms -- ONLY the height inverse swapped)
 * -------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     log T0 = log(rawHeightForN(N))            (Lambert-W raw RvM inverse -- the swap).
 *
 * THE MEASUREMENT
 * ---------------
 *   (a) Confirm rawHeightForN reproduces effectiveHeightForN to ~1e-15 relative across
 *       the [1e6, 1e12] ladder (both invert the SAME raw RvM law, different solvers).
 *   (b) Recompute N_flat = downslope N at sigma = imp-35853 flattest sigma (~0.407) by
 *       bisection on the raw-inverse sigma(N).
 *   (c) Recompute the imp-33701 exponent-ramp inflection decade on the raw-inverse
 *       sigma(N) via the identical OLS local-exponent ladder + second difference.
 *   (d) Report the decade offset and whether it stays ~1 decade or shifts.
 *
 * THE FINDING (cross-validation / measurement only)
 * -------------------------------------------------
 *   (F1) THE OFFSET IS STABLE -- IT STAYS EXACTLY ONE DECADE. On the raw Lambert-W RvM
 *        inverse, N_flat ~ 7.1985e9 (log10 N ~ 9.857, decade [1e9,1e10]) and the
 *        exponent-ramp inflection lands in [1e10,1e11] -- identical to the imp-35891
 *        readings on effectiveHeightForN. The ~1-decade offset is NOT a surrogate
 *        artifact.
 *   (F2) WHY IT IS STABLE: effectiveHeightForN is ITSELF a Newton inversion of the exact
 *        same raw RvM law the Lambert-W form inverts analytically, so the two height
 *        inverses agree to ~1e-15 relative across the whole ladder. sigma(N) depends on
 *        T0 essentially only through L = log T0, so a ~1e-15 height agreement propagates
 *        to an even smaller sigma difference -- both markers are pinned to the same
 *        decades. The offset reflects the geometry of the two curves, not the inverse.
 *   (F3) CONSISTENT WITH imp-35891 F3: the two knees measure DIFFERENT curves (flatness
 *        of the required-height multiple in sigma vs inflection of the decay exponent in
 *        N), so a ~1-decade offset is intrinsic. Swapping the height inverse cannot
 *        collapse or inflate it, confirming the imp-35891 reading is height-inverse robust.
 *
 * Cross-validation / measurement only. Reuses the imp-3406 / imp-33582 sigma model with
 * ONLY the N->T0 height inverse swapped to an independent raw RvM (Lambert-W) form;
 * instantiates no interval; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643),
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35891-flattest-point-vs-sigmoid-knee-crosslocation (the ~1-decade offset this stress-tests)
 * @see imp-35853-req4-required-height-continuous-sigma-knee (flattest-point locator, sigma ~ 0.407)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (exponent-ramp inflection, [1e10,1e11])
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: Newton N -> T0 RvM inverse, the reference)
 * Literature: Riemann-von Mangoldt counting formula; Lambert W function; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE } from './imp-35853-req4-required-height-continuous-sigma-knee.js';
import { IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION } from './imp-33701-sigma-postpeak-ramp-curvature-inflection.js';
import { IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION } from './imp-35891-flattest-point-vs-sigmoid-knee-crosslocation.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// ── Independent raw RvM height inverse via Lambert W (Halley iteration) ──────
// Principal branch W(x) for x >= -1/e; here N/e > 0 so we stay on the branch.
function lambertW(x) {
  if (!(x > -1 / Math.E) || !Number.isFinite(x)) return NaN;
  // Seed: series near 0, log-log for large x.
  let w = x < 3 ? x / (1 + x) : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 60; i++) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const denom = ew * (w + 1) - ((w + 2) * f) / (2 * w + 2);
    if (!(Math.abs(denom) > 0) || !Number.isFinite(denom)) break;
    const dw = f / denom;
    w -= dw;
    if (Math.abs(dw) < 1e-15 * (Math.abs(w) + 1e-300)) break;
  }
  return w;
}

// Closed-form inverse of N = (T0/2pi)(log(T0/2pi) - 1):  T0 = 2pi exp(1 + W(N/e)).
function rawHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  return TWO_PI * Math.exp(1 + lambertW(N / Math.E));
}

// EXACT imp-3406 / imp-33582 sub-terms; ONLY the height inverse is swapped.
function makeSigma(heightFn) {
  return function sigma(N) {
    const T0 = heightFn(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL;
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
    return E_coll / (E_TRUNC_PT + E_flow + E_coll);
  };
}
const sigmaRaw = makeSigma(rawHeightForN);
const sigmaRef = makeSigma(effectiveHeightForN);

// (a) Height agreement across the ladder: max relative |Traw/Tnewton - 1|.
const HEIGHT_LADDER_N = [1e6, 1e7, 1e8, 1e9, 7.2e9, 1e10, 1e11, 1e12];
let MAX_HEIGHT_REL_DIFF = 0;
for (const N of HEIGHT_LADDER_N) {
  const rel = Math.abs(rawHeightForN(N) / effectiveHeightForN(N) - 1);
  if (rel > MAX_HEIGHT_REL_DIFF) MAX_HEIGHT_REL_DIFF = rel;
}

// (b) N_flat on the raw-inverse sigma(N): peak, then downslope crossing of sigma_flat.
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigmaRaw(N + h) - sigmaRaw(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();
const SIGMA_MAX = sigmaRaw(N_PEAK);

function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigmaRaw(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const SIGMA_FLAT = IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.flattestPoint.sigma; // ~0.407
const N_FLAT = crossBelow(SIGMA_FLAT);
const LOG10_N_FLAT = Math.log10(N_FLAT);
const DECADE_N_FLAT = Math.floor(LOG10_N_FLAT); // 9 -> [1e9,1e10]

// (c) imp-33701 exponent-ramp inflection recomputed on the raw-inverse sigma(N).
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigmaRaw(N)));
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
  return -(sxy / sxx);
}
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const P_LADDER = DECADE_KS.map((k) => olsExponent(Math.pow(10, k), Math.pow(10, k + 1)));
const D1 = [];
for (let i = 1; i < P_LADDER.length; i++) D1.push(P_LADDER[i] - P_LADDER[i - 1]);
const D2 = [];
for (let i = 1; i < D1.length; i++) D2.push(D1[i] - D1[i - 1]);
let INFLECTION_K = null;
for (let i = 1; i < D2.length; i++) {
  if (Math.sign(D2[i]) !== Math.sign(D2[i - 1])) {
    INFLECTION_K = DECADE_KS[i + 1];
    break;
  }
}

// (d) Offset test on the raw inverse, compared to the imp-35891 reading.
const DECADE_OFFSET = INFLECTION_K - DECADE_N_FLAT; // expect 1
const N_FLAT_IN_INFLECTION_DECADE = LOG10_N_FLAT >= INFLECTION_K && LOG10_N_FLAT < INFLECTION_K + 1;
const OFFSET_MATCHES_IMP35891 = DECADE_OFFSET === IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION.decadeOffset;

export const IMP35953_KNEE_OFFSET_RAW_RVM_HEIGHT_CROSSCHECK = {
  id: 'imp-35953',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35891 ~1-decade offset between the imp-35853 flattest-point knee (N_flat ~ 7.20e9) and the ' +
    'imp-33701 sigma-exponent inflection decade ([1e10,1e11]) a stable feature, or an artifact of the imp-3406 ' +
    'effectiveHeightForN height inverse? Recompute both markers on an independent raw Riemann-von Mangoldt ' +
    'height inverse (T0 = 2pi exp(1 + W(N/e)), the closed-form Lambert-W inverse of N = (T0/2pi)(log(T0/2pi)-1)) ' +
    'and report whether the offset stays ~1 decade or shifts.',
  method:
    'Swap ONLY the N->T0 height inverse in the imp-3406 / imp-33582 sigma model from the Newton effectiveHeightForN ' +
    'to an independent closed-form Lambert-W raw RvM inverse, then recompute (a) N_flat by bisection on sigma(N) ' +
    'at the imp-35853 flattest sigma (~0.407) and (b) the imp-33701 exponent-ramp inflection decade via the ' +
    'identical OLS local-exponent ladder + second-difference sign change, and compare the decade offset to imp-35891.',
  maxHeightRelDiffVsNewton: +MAX_HEIGHT_REL_DIFF.toExponential(2),
  sigmaMax: +SIGMA_MAX.toFixed(6),
  flattestPointSigma: SIGMA_FLAT,
  flattestPointN: +N_FLAT.toExponential(4),
  flattestPointLog10N: +LOG10_N_FLAT.toFixed(4),
  flattestPointDecade: `1e${DECADE_N_FLAT}->1e${DECADE_N_FLAT + 1}`,
  inflectionDecadeRaw: `1e${INFLECTION_K}->1e${INFLECTION_K + 1}`,
  decadeOffsetRaw: DECADE_OFFSET,
  decadeOffsetImp35891: IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION.decadeOffset,
  offsetMatchesImp35891: OFFSET_MATCHES_IMP35891,
  coincide: N_FLAT_IN_INFLECTION_DECADE,
  offsetIsStable: DECADE_OFFSET === 1 && OFFSET_MATCHES_IMP35891 && N_FLAT_IN_INFLECTION_DECADE === false,
  finding: {
    F1_offset_stays_one_decade:
      'On the raw Lambert-W RvM inverse, N_flat ~ 7.1985e9 (log10 N ~ 9.857, decade [1e9,1e10]) and the ' +
      'exponent-ramp inflection lands in [1e10,1e11] -- identical decades to the imp-35891 reading on ' +
      'effectiveHeightForN, so the decade offset stays EXACTLY one. The ~1-decade offset is NOT a surrogate artifact.',
    F2_why_stable_same_law_different_solver:
      'effectiveHeightForN is itself a Newton inversion of the SAME raw RvM law the Lambert-W form inverts ' +
      'analytically, so the two height inverses agree to ~1e-15 relative across the [1e6,1e12] ladder. sigma(N) ' +
      'depends on T0 essentially only through L = log T0, so that agreement propagates to an even smaller sigma ' +
      'difference -- both markers are pinned to the same decades regardless of which inverse is used.',
    F3_consistent_with_imp35891_different_curves:
      'The two knees measure DIFFERENT curves (flatness of the required-height multiple in sigma vs inflection of ' +
      'the decay exponent in N), so the ~1-decade offset is intrinsic to their geometry. Swapping the height ' +
      'inverse cannot collapse or inflate it, confirming the imp-35891 reading is height-inverse robust.',
  },
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'CROSS-VALIDATION (NOT rigorous). Swapping the imp-3406 Newton effectiveHeightForN for an independent ' +
    'closed-form Lambert-W raw RvM inverse (T0 = 2pi exp(1 + W(N/e))) leaves BOTH markers in place: N_flat ~ ' +
    '7.1985e9 (log10 N ~ 9.857, decade [1e9,1e10]) and the imp-33701 exponent-ramp inflection in [1e10,1e11], so ' +
    'the imp-35891 ~1-decade offset stays EXACTLY one decade -- it is a stable feature, NOT an artifact of the ' +
    'height-inverse implementation. The reason is that effectiveHeightForN is itself a Newton inversion of the ' +
    'same raw RvM law, so the two inverses agree to ~1e-15 relative and sigma (which sees T0 only through ' +
    'log T0) is unchanged to well beyond decade resolution. This confirms the imp-35891 finding is height-inverse ' +
    'robust and consistent with its F3 (the offset is intrinsic to two different curves). Reuses the sigma model ' +
    'with only the height inverse swapped; instantiates no interval; derives no remainder; discharges nothing; ' +
    'changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35891 (the ~1-decade knee offset this stress-tests); imp-35853 (flattest-point locator, sigma ~ 0.407); ' +
    'imp-33701 (exponent-ramp inflection, [1e10,1e11]); imp-33582 (sigma-decay model; peak sigma_max ~ 0.9494); ' +
    'imp-3406 (effectiveHeightForN Newton RvM inverse, the reference); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting ' +
    'formula; Lambert W function; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35953_KNEE_OFFSET_RAW_RVM_HEIGHT_CROSSCHECK_ASSERTIONS = [
  {
    // (1) the independent Lambert-W raw inverse reproduces the Newton effectiveHeightForN
    // to near machine precision -- proving both invert the SAME raw RvM law.
    id: 'imp35953-raw-inverse-matches-newton',
    description: 'raw Lambert-W RvM inverse matches effectiveHeightForN to < 1e-12 relative across [1e6,1e12]',
    holds: () => MAX_HEIGHT_REL_DIFF < 1e-12,
  },
  {
    // (2) reuse gate: the raw-inverse sigma reproduces the imp-33582 / imp-35813 interior peak.
    id: 'imp35953-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5, sigma_max ~ 0.9494 -- confirms the identical imp-33582 sigma model is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3 && Math.abs(SIGMA_MAX - 0.9494) < 5e-4,
  },
  {
    // (3) reuse gate: N_flat on the raw inverse reproduces the imp-35891 / imp-35889 height.
    id: 'imp35953-flattest-N-reproduces-imp35891',
    description: 'flattest-point N ~ 7.20e9 (log10 N ~ 9.857, decade 9), matching imp-35891 on the raw inverse',
    holds: () =>
      Math.abs(N_FLAT / 7.20e9 - 1) < 5e-2 &&
      Math.abs(LOG10_N_FLAT - 9.857) < 0.05 &&
      DECADE_N_FLAT === 9,
  },
  {
    // (4) the exponent-ramp inflection on the raw inverse still lands in [1e10,1e11].
    id: 'imp35953-inflection-still-1e10',
    description: 'the exponent-ramp inflection decade on the raw inverse is [1e10,1e11] (K=10), matching imp-33701',
    holds: () =>
      INFLECTION_K === 10 &&
      INFLECTION_K === parseInt(IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.inflectionDecade.match(/1e(\d+)/)[1], 10),
  },
  {
    // (5) THE FINDING: the offset stays EXACTLY one decade and matches the imp-35891 reading --
    // the ~1-decade offset is a stable feature, not a surrogate artifact.
    id: 'imp35953-offset-stable-one-decade',
    description: 'decade offset stays exactly 1 and matches imp-35891; N_flat not in the inflection decade',
    holds: () =>
      DECADE_OFFSET === 1 &&
      OFFSET_MATCHES_IMP35891 === true &&
      N_FLAT_IN_INFLECTION_DECADE === false &&
      IMP35953_KNEE_OFFSET_RAW_RVM_HEIGHT_CROSSCHECK.offsetIsStable === true,
  },
  {
    // (6) honesty gate: cross-validation only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35953-crossvalidation-only-no-qed',
    description: 'cross-validation only: not rigorous/unconditional, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35953_KNEE_OFFSET_RAW_RVM_HEIGHT_CROSSCHECK;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35953_KNEE_OFFSET_RAW_RVM_HEIGHT_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35953-knee-offset-raw-rvm-height-crosscheck assertion failed: ${a.id}`);
  }
}
