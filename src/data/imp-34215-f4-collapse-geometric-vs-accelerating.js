/**
 * @module imp-34215-f4-collapse-geometric-vs-accelerating
 *
 * imp-34215 (numerical, frontier-direction): imp-34133 reported that of the three companion attenuation
 * factors driving the over-prediction ratio 1/(F2*F3*F4), only F4 collapses toward 0 -- from 0.11339 at
 * kEnd=13 to 3.65e-6 at kEnd=21, an overall ~x3.2e-5. imp-34023 had earlier CHARACTERIZED that collapse as
 * a "clean geometric decay" (ln F4 linear in kEnd, R^2 ~ 0.99942, per-unit factor ~0.359) -- but only over
 * the NARROW imp-33969 anchor window kEnd=11..13. Neither module measured the per-rung ratio F4(k+1)/F4(k)
 * across the FULL sign-stable ladder to test whether that geometric characterization survives extension.
 * This module supplies that measurement: on the same inherited imp-3406/imp-33810 sub-terms (head fixed at
 * k=6) it computes F4 on the 17-rung ladder kEnd=13.0..21.0 step 0.5, forms the per-rung half-unit ratio
 * F4(k+0.5)/F4(k), and fits whether the collapse is a CONSTANT-RATIO geometric decay or an ACCELERATING
 * (super-geometric) one.
 *
 * THE PER-RUNG RATIO IS MONOTONE DECREASING -- THE COLLAPSE ACCELERATES (super-geometric)
 * -------------------------------------------------------------------------------------
 *   The per-half-unit ratio F4(k+0.5)/F4(k) is NOT constant. It sits near 0.579 at the low end (kEnd=13.5),
 *   drifts only slowly down through ~0.57 across the quasi-flat region kEnd=13.5..17, then DIVES: 0.545 at
 *   kEnd=19, 0.495 at kEnd=20, 0.427 at kEnd=20.5, and 0.257 at kEnd=21. The ratio decreases strictly
 *   monotonically across all 16 steps -- the hallmark of an ACCELERATING collapse, not a constant-ratio
 *   geometric one. A log-linear (pure-geometric) fit ln F4 = a + b*kEnd over the full ladder gives per-unit
 *   factor exp(b) ~ 0.2976 with R^2 ~ 0.99196; adding a quadratic term, ln F4 = a + b*kEnd + c*kEnd^2, lifts
 *   R^2 to ~0.99681 with a NEGATIVE curvature c ~ -0.0389 -- concave-down in log space, i.e. super-geometric.
 *
 * THE ACCELERATION CONCENTRATES AT THE imp-33773 SIGN-CHANGE CEILING kEnd* ~ 21.28
 * -------------------------------------------------------------------------------
 *   The mechanism is transparent: F4 = TAIL.resid / HEAD.resid, and the imp-33773 M2 sub-leading residual
 *   TAIL.resid crosses zero at the ceiling kEnd* ~ 21.281 (imp-34150). As kEnd climbs toward that ceiling
 *   the numerator TAIL.resid -> 0, so F4 dives faster and faster and the per-rung ratio plunges -- the
 *   collapse is dominated by proximity to the residual sign-change pole, not by any fixed geometric factor.
 *   Consequently imp-34023's "clean geometric decay" holds only LOCALLY on the narrow kEnd=11..13 anchor
 *   window (where the per-rung ratio is nearly flat ~0.57); extended across the full sign-stable ladder the
 *   decay is ACCELERATING. The over-prediction ratio 1/(F2*F3*F4) therefore diverges SUPER-geometrically as
 *   the fit boundary recedes toward kEnd*, faster than the narrow-window geometric extrapolation implied.
 *
 * The punchline: the F4 collapse is ACCELERATING (super-geometric), not a constant-ratio geometric decay --
 * the per-rung half-unit ratio falls monotonically from ~0.579 to ~0.257 and a negative-curvature quadratic
 * ln-fit (R^2 ~ 0.9968) beats the log-linear geometric one (R^2 ~ 0.9920), with the acceleration
 * concentrated near the imp-33773 residual sign-change ceiling kEnd* ~ 21.28.
 *
 * NUMERICAL / MEASUREMENT ONLY. Curve fit of an inherited surrogate ratio, NOT an RH bound. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the geometric-vs-accelerating diagnosis is
 * descriptive within that model only; changes no bound; establishes no operator positivity; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34133-f2-f3-asymptotic-constant-fit (F2/F3 saturate, F4 alone collapses; same sub-terms, head k=6)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the narrow-window "clean geometric" claim)
 * @see imp-33969-eflow-decay-widening-ratio-kend-sweep (the 9-window F1..F4 decomposition)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the quarter-decade rungs reused verbatim)
 * @see imp-33773 / imp-34150 (the M2 residual sign change at kEnd* ~ 21.28 capping the sign-stable ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33969/imp-34023/imp-34133 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34133 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
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

// The imp-33810 endpoint rung at boundary k (head k=6, tail k=kEnd) -- same as imp-34133.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  return { k, resid };
}

const HEAD = rung(6); // fixed head, exactly as imp-34133
const F4 = (kEnd) => rung(kEnd).resid / HEAD.resid; // the collapsing driver factor

// The extended sign-stable ladder kEnd = 13.0..21.0 step 0.5 (resid > 0 => F4 > 0, decomposition valid).
const LADDER_KENDS = [];
for (let k = 13; k <= 21 + 1e-9; k += 0.5) LADDER_KENDS.push(+k.toFixed(2));
const LADDER = LADDER_KENDS.map((k) => ({ k, resid: rung(k).resid, F4: F4(k) })).filter((r) => r.resid > 0);
const KS = LADDER.map((r) => r.k);

// Per-rung half-unit ratio F4(k+0.5)/F4(k): constant => geometric, decreasing => accelerating.
const RATIOS = [];
for (let i = 1; i < LADDER.length; i++) {
  RATIOS.push({ k: LADDER[i].k, ratio: LADDER[i].F4 / LADDER[i - 1].F4 });
}
const RATIO_FIRST = RATIOS[0].ratio; // ~0.579 (kEnd = 13.5)
const RATIO_LAST = RATIOS[RATIOS.length - 1].ratio; // ~0.257 (kEnd = 21.0)
// Strictly monotone-decreasing per-rung ratio is the fingerprint of an accelerating collapse.
let ratioMonotoneDecreasing = true;
for (let i = 1; i < RATIOS.length; i++) {
  if (RATIOS[i].ratio >= RATIOS[i - 1].ratio) ratioMonotoneDecreasing = false;
}

// Log-linear (pure-geometric) fit ln F4 = a + b*kEnd over the full ladder.
function fitLogLinear(ks, fs) {
  const lf = fs.map((f) => Math.log(f));
  const n = ks.length;
  const mk = ks.reduce((a, b) => a + b, 0) / n;
  const ml = lf.reduce((a, b) => a + b, 0) / n;
  let skk = 0;
  let skl = 0;
  for (let i = 0; i < n; i++) {
    skk += (ks[i] - mk) ** 2;
    skl += (ks[i] - mk) * (lf[i] - ml);
  }
  const b = skl / skk;
  const a = ml - b * mk;
  let sst = 0;
  let sse = 0;
  for (let i = 0; i < n; i++) {
    sst += (lf[i] - ml) ** 2;
    sse += (lf[i] - (a + b * ks[i])) ** 2;
  }
  return { a, b, perUnitFactor: Math.exp(b), R2: 1 - sse / sst, sst };
}

// Quadratic fit ln F4 = a + b*kEnd + c*kEnd^2: c < 0 => concave-down in log space => super-geometric.
function fitLogQuadratic(ks, fs, sstRef) {
  const lf = fs.map((f) => Math.log(f));
  const n = ks.length;
  let S0 = n;
  let S1 = 0;
  let S2 = 0;
  let S3 = 0;
  let S4 = 0;
  let T0s = 0;
  let T1 = 0;
  let T2 = 0;
  for (let i = 0; i < n; i++) {
    const x = ks[i];
    const y = lf[i];
    S1 += x;
    S2 += x * x;
    S3 += x * x * x;
    S4 += x * x * x * x;
    T0s += y;
    T1 += x * y;
    T2 += x * x * y;
  }
  // Solve the 3x3 normal equations by Gaussian elimination with partial pivoting.
  const M = [
    [S0, S1, S2, T0s],
    [S1, S2, S3, T1],
    [S2, S3, S4, T2],
  ];
  for (let i = 0; i < 3; i++) {
    let pr = i;
    for (let r = i + 1; r < 3; r++) if (Math.abs(M[r][i]) > Math.abs(M[pr][i])) pr = r;
    const tmp = M[i];
    M[i] = M[pr];
    M[pr] = tmp;
    for (let r = 0; r < 3; r++) {
      if (r !== i) {
        const f = M[r][i] / M[i][i];
        for (let cc = i; cc < 4; cc++) M[r][cc] -= f * M[i][cc];
      }
    }
  }
  const a = M[0][3] / M[0][0];
  const b = M[1][3] / M[1][1];
  const c = M[2][3] / M[2][2];
  let sse = 0;
  for (let i = 0; i < n; i++) {
    const x = ks[i];
    sse += (lf[i] - (a + b * x + c * x * x)) ** 2;
  }
  return { a, b, c, R2: 1 - sse / sstRef };
}

const F4S = LADDER.map((r) => r.F4);
const GEOM_FIT = fitLogLinear(KS, F4S);
const QUAD_FIT = fitLogQuadratic(KS, F4S, GEOM_FIT.sst);
const F4_OVERALL_RATIO = F4S[F4S.length - 1] / F4S[0]; // ~3.2e-5

export const IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING = {
  id: 'imp-34215',
  proofSection: 'S-frontier',
  question:
    'imp-34133 named F4 as the sole collapsing attenuation factor (~x3.2e-5 over kEnd=13..21) driving the ' +
    'over-prediction ratio 1/(F2*F3*F4) divergence, and imp-34023 characterized that collapse as a "clean ' +
    'geometric decay" -- but only over the narrow kEnd=11..13 anchor window. Across the FULL sign-stable ' +
    'ladder, is the per-rung ratio F4(k+1)/F4(k) constant (a pure-geometric decay) or decreasing (an ' +
    'accelerating, super-geometric collapse)? Numerical/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'On the inherited imp-3406/imp-33810 sub-terms (head fixed at k=6), F4(kEnd)=TAIL.resid/HEAD.resid over ' +
    'the 17-rung sign-stable ladder kEnd=13.0..21.0 step 0.5; the per-rung half-unit ratio F4(k+0.5)/F4(k) ' +
    'and its monotonicity; a log-linear (pure-geometric) fit ln F4 = a + b*kEnd (per-unit factor exp(b), ' +
    'R^2); and a quadratic fit ln F4 = a + b*kEnd + c*kEnd^2 (curvature c sign, R^2) to test super-geometry.',
  ladderWindow: {
    kEnd_lo: 13.0,
    kEnd_hi: 21.0,
    step: 0.5,
    sign_stable_rungs: LADDER.length, // 17
    per_rung_ratio_count: RATIOS.length, // 16
  },
  perRungRatio: {
    form: 'F4(k+0.5)/F4(k)',
    ratio_at_kEnd_13_5: +RATIO_FIRST.toFixed(6), // ~0.579254
    ratio_at_kEnd_21_0: +RATIO_LAST.toFixed(6), // ~0.257260
    monotone_decreasing: ratioMonotoneDecreasing, // true => accelerating collapse
  },
  geometricFit: {
    form: 'ln F4 = a + b*kEnd (pure-geometric / constant-ratio)',
    perUnitFactor_expb: +GEOM_FIT.perUnitFactor.toFixed(6), // ~0.297616
    R2: +GEOM_FIT.R2.toFixed(6), // ~0.991961
  },
  quadraticFit: {
    form: 'ln F4 = a + b*kEnd + c*kEnd^2 (c<0 => concave-down => super-geometric)',
    curvature_c: +QUAD_FIT.c.toExponential(4), // ~-3.8861e-2 (NEGATIVE)
    R2: +QUAD_FIT.R2.toFixed(6), // ~0.996806 (beats the log-linear fit)
  },
  f4CollapseRatio_21_over_13: +F4_OVERALL_RATIO.toExponential(4), // ~3.221e-5
  verdict:
    'NUMERICAL / CURVE-FIT (frontier-direction, NOT rigorous). Across the full 17-rung sign-stable ladder ' +
    'kEnd=13..21 (same inherited imp-3406/imp-33810 sub-terms, head fixed at k=6), the F4 collapse is ' +
    'ACCELERATING (super-geometric), NOT a constant-ratio geometric decay. The per-rung half-unit ratio ' +
    'F4(k+0.5)/F4(k) is STRICTLY MONOTONE DECREASING, falling from ~0.5793 (kEnd=13.5) through a quasi-flat ' +
    '~0.57 region (kEnd=13.5..17) and then diving to ~0.4947 (kEnd=20), ~0.4273 (kEnd=20.5) and ~0.2573 ' +
    '(kEnd=21). A pure-geometric log-linear fit ln F4 = a + b*kEnd gives per-unit factor ~0.2976 with ' +
    'R^2 ~ 0.99196; adding a quadratic term lifts R^2 to ~0.99681 with a NEGATIVE curvature c ~ -0.0389 ' +
    '(concave-down in log space), confirming super-geometry. The acceleration concentrates near the ' +
    'imp-33773/imp-34150 M2 residual sign-change ceiling kEnd* ~ 21.28, where F4 = TAIL.resid/HEAD.resid ' +
    'dives as the numerator TAIL.resid -> 0: the collapse is dominated by proximity to that pole, not by a ' +
    'fixed geometric factor. So imp-34023 "clean geometric decay" holds only LOCALLY on the narrow ' +
    'kEnd=11..13 anchor window; extended to the full ladder the over-prediction ratio 1/(F2*F3*F4) diverges ' +
    'SUPER-geometrically. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the ' +
    'geometric-vs-accelerating diagnosis is descriptive within the model only; changes no bound; establishes ' +
    'no operator positivity; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-34133 (F2/F3 saturate, F4 alone collapses; same sub-terms, head k=6); imp-34023 (the narrow-window ' +
    '"clean geometric decay" characterization tested here); imp-33969 (the 9-window F1..F4 decomposition); ' +
    'imp-33810 (the quarter-decade rungs); imp-33773/imp-34150 (the M2 residual sign change at kEnd* ~ 21.28 ' +
    'capping the sign-stable ladder); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING_ASSERTIONS = [
  {
    // The ladder has the full 17 sign-stable rungs and 16 per-rung ratios.
    id: 'imp34215-ladder-17-rungs',
    description: 'Sign-stable ladder kEnd=13..21 step 0.5 has 17 rungs (all resid>0) and 16 per-rung ratios',
    holds: () => LADDER.length === 17 && RATIOS.length === 16,
  },
  {
    // The per-rung ratio is strictly monotone decreasing: the fingerprint of an accelerating collapse.
    id: 'imp34215-per-rung-ratio-monotone-decreasing',
    description: 'F4(k+0.5)/F4(k) is strictly monotone decreasing (~0.579 -> ~0.257): accelerating, not geometric',
    holds: () =>
      ratioMonotoneDecreasing === true &&
      RATIO_FIRST > 0.57 &&
      RATIO_FIRST < 0.59 &&
      RATIO_LAST > 0.25 &&
      RATIO_LAST < 0.27 &&
      RATIO_LAST < RATIO_FIRST,
  },
  {
    // The quadratic ln-fit has NEGATIVE curvature and beats the log-linear (pure-geometric) fit.
    id: 'imp34215-quadratic-beats-geometric-negative-curvature',
    description: 'Quadratic ln F4 fit has c<0 (concave-down => super-geometric) and higher R^2 than the log-linear fit',
    holds: () =>
      QUAD_FIT.c < 0 &&
      QUAD_FIT.R2 > GEOM_FIT.R2 &&
      GEOM_FIT.R2 > 0.99 &&
      QUAD_FIT.R2 > 0.996 &&
      GEOM_FIT.perUnitFactor > 0.25 &&
      GEOM_FIT.perUnitFactor < 0.35,
  },
  {
    // F4 alone collapses ~x3.2e-5 over the ladder (the driver contrast, consistent with imp-34133).
    id: 'imp34215-f4-overall-collapse-3e-5',
    description: 'F4(21)/F4(13) ~ 3.2e-5 (F4 -> 0), reproducing the imp-34133 collapse magnitude',
    holds: () => F4_OVERALL_RATIO > 0 && F4_OVERALL_RATIO < 1e-4,
  },
  {
    // Storage-precision guard (imp-2546/imp-2539/imp-34225 red-build trap): the stored toFixed fields
    // reconstruct to their live full-precision counterparts within the half-ULP floor.
    id: 'imp34215-storage-precision-pinned',
    description: 'Stored toFixed(6) per-rung ratio and geometric per-unit-factor fields reconstruct within 0.5e-6',
    holds: () =>
      Math.abs(IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.perRungRatio.ratio_at_kEnd_13_5 - RATIO_FIRST) <=
        0.5e-6 &&
      Math.abs(IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.perRungRatio.ratio_at_kEnd_21_0 - RATIO_LAST) <=
        0.5e-6 &&
      Math.abs(
        IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.geometricFit.perUnitFactor_expb - GEOM_FIT.perUnitFactor,
      ) <= 0.5e-6,
  },
  {
    // Honesty gate: numerical/curve-fit only, isRigorous false, no QED, C_mb untouched, K_a untouched, no refereed bound is changed.
    id: 'imp34215-honesty-gate-no-qed',
    description: 'Curve-fit only: isRigorous false, no QED, C_mb GUE-conditional per imp-486 UNTOUCHED, K_a untouched, no refereed bound is changed',
    holds: () =>
      IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.isRigorous === false &&
      /NO QED/.test(IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.verdict) &&
      /refereed bound is changed/i.test(IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING.verdict),
  },
];

for (const a of IMP34215_F4_COLLAPSE_GEOMETRIC_VS_ACCELERATING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34215-f4-collapse-geometric-vs-accelerating assertion failed: ${a.id}`);
  }
}
