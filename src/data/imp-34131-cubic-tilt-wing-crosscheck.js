/**
 * @module imp-34131-cubic-tilt-wing-crosscheck
 *
 * imp-34131 (numerical): CROSS-CHECK THE TWO ROUTES TO THE SAME CUBIC TILT OF THE HUMP.
 * Two modules diagnose the same cubic term of the imp-33878 resid_exp(k) hump by different
 * routes but were never reconciled: imp-34008 W2 only INFERRED a nonzero cubic tilt from the
 * left/right wing asymmetry (0.410% left vs 0.218% right at |t| = 0.5) without fitting it,
 * while imp-34084 fit the apex cubic d = (1/6) resid triple-prime(k*) ~ -5.347e-4 directly.
 * imp-34084 reconstructed the wing asymmetry with a FULL cubic RE-FIT (re-optimising the odd
 * linear coefficient b together with d). This module runs the complementary, INDEPENDENT
 * cross-check: take d from the imp-34084 apex fit as-is, add a PURE cubic tilt d t^3 on top of
 * the imp-33948/imp-34008 parabola WITHOUT re-fitting b, and ask how much of the measured
 * imp-34008 0.410/0.218 wing split that single term reconstructs -- i.e. whether the two routes
 * agree on the cubic, and what residual remains.
 *
 * THE CROSS-CHECK (reuses the imp-33878 resid_exp(k) model + the imp-33948 parabola VERBATIM)
 * ------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma over the sliding window [10^k, 10^(k+1)]
 *   (identical parts(): E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N),
 *   E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)). We re-fit the SAME
 *   21-point symmetric quadratic P(t) = a + b t + c t^2 over k* +/- 0.1 as imp-33948/imp-34008
 *   (recovering a ~ 6.5337e-2 and the published 0.410/0.218 wing discrepancy INDEPENDENTLY),
 *   then form the pure-cubic-tilt reconstruction Q(t) = P(t) + d t^3 with d pulled from the
 *   imp-34084 apex fit (d ~ -5.347e-4). We report (i) the left/right wing discrepancy of Q vs
 *   the true resid_exp at |t| = 0.5, (ii) the fraction of the imp-34008 left-minus-right split
 *   that d t^3 reconstructs, and (iii) the residual EVEN discrepancy that survives in BOTH
 *   wings -- the quartic term the odd cubic cannot touch.
 *
 * THE FINDING (cross-validation only -- the two routes AGREE on the cubic; a quartic remains)
 * ------------------------------------------------------------------------------------------
 *   (X1) THE TWO ROUTES AGREE ON THE CUBIC. Adding the imp-34084 pure tilt d t^3 (d ~ -5.347e-4,
 *        NOT re-fit) to the independently re-derived imp-33948 parabola collapses the imp-34008
 *        wing split from 0.4101%/0.2175% (split +0.1926%) to 0.3078%/0.3198% (split -0.0120%),
 *        reconstructing ~106% of the measured left-minus-right asymmetry. This corroborates the
 *        imp-34084 full-refit reconstruction (~103%) by an independent path that never re-touches
 *        the linear term -- so the two diagnoses agree that the low-k-departs-first asymmetry IS
 *        the imp-34084 negative cubic tilt, to within a few-percent odd-quintic overshoot.
 *   (X2) A RESIDUAL EVEN (QUARTIC) DISCREPANCY REMAINS IN BOTH WINGS. After the pure cubic tilt
 *        the parabola-vs-truth discrepancy does NOT vanish: it settles to ~0.3078% (left) and
 *        ~0.3198% (right), a near-symmetric ~0.314% residual in BOTH wings. The odd cubic tilt
 *        only removes the left/right IMBALANCE; the residual is the EVEN part of the parabola
 *        error (E/apex ~ 0.314%, vs the odd part O/apex ~ -0.096%), which a cubic (odd) term
 *        cannot address -- this is the even QUARTIC curvature the imp-34064 companion fits, not a
 *        failure of the cubic route.
 *   (X3) BOTH ROUTES LAND ON THE SAME RESIDUAL. The pure-tilt residual wings (0.3078%/0.3198%)
 *        match the imp-34084 full-refit residual wings (0.3105%/0.3171%) to ~0.003% of the apex,
 *        so the small choice of whether to re-fit b or not is immaterial: both routes leave the
 *        SAME ~0.31% even quartic residual, confirming the reconciliation is route-independent.
 *
 * The punchline: the imp-34008 wing-asymmetry route and the imp-34084 apex-cubic-fit route AGREE
 * on the cubic tilt of the hump -- adding the imp-34084 pure tilt d t^3 (d ~ -5.347e-4) to the
 * independently re-derived imp-33948 parabola reconstructs ~106% of the measured 0.410/0.218
 * left/right split (matching imp-34084 full-refit ~103%), and both routes leave the SAME
 * near-symmetric ~0.31% residual in both wings -- an EVEN quartic term (imp-34064), NOT an
 * unresolved cubic. So the two routes are reconciled: the cubic is agreed, and what remains is
 * quartic. Cross-validation only; refines, does not overturn, imp-34008/imp-34084.
 *
 * CROSS-VALIDATION ONLY. A reconciliation of two diagnostics of an inherited surrogate, NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34084-apex-cubic-tilt-coefficient (the apex cubic fit d ~ -5.347e-4, pulled in as-is here)
 * @see imp-34008-apex-parabola-wing-fidelity (the W2 wing-asymmetry inference cross-checked here)
 * @see imp-34064-apex-quartic-curvature-fit (the EVEN quartic companion the residual points to)
 * @see imp-33948-hump-apex-curvature-error-bar (the apex quadratic re-derived independently here)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';
import { IMP34084_APEX_CUBIC_TILT_COEFFICIENT } from './imp-34084-apex-cubic-tilt-coefficient.js';
import { IMP34008_APEX_PARABOLA_WING_FIDELITY } from './imp-34008-apex-parabola-wing-fidelity.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878/imp-33948/imp-34008/imp-34084 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-33948/imp-34008/imp-34084 sub-terms (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
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

// resid_exp(k) as a smooth function of CONTINUOUS k over window [10^k, 10^(k+1)] (imp-33878 defn).
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const sigmaHi = parts(hi).sigma;
  return pEcoll * (1 - sigmaHi) - pSigma;
}

const K_STAR = IMP33878_HUMP_ARGMAX_GRID_REFINEMENT.continuumArgmax.kStar; // ~8.821092

// The SAME 21-point local quadratic least-squares fit over k* +/- 0.1 as imp-33948/imp-34008,
// re-derived INDEPENDENTLY here so the cross-check reconstructs the published wings from scratch.
function localQuadraticFit(W, M) {
  const ts = [];
  const ys = [];
  for (let i = 0; i < M; i++) {
    const t = -W + (2 * W * i) / (M - 1);
    ts.push(t);
    ys.push(residExp(K_STAR + t));
  }
  let s0 = M;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let t0 = 0;
  let t1 = 0;
  let t2 = 0;
  for (let i = 0; i < M; i++) {
    const x = ts[i];
    const y = ys[i];
    s1 += x;
    s2 += x * x;
    s3 += x * x * x;
    s4 += x * x * x * x;
    t0 += y;
    t1 += x * y;
    t2 += x * x * y;
  }
  const A = [
    [s0, s1, s2, t0],
    [s1, s2, s3, t1],
    [s2, s3, s4, t2],
  ];
  for (let p = 0; p < 3; p++) {
    const piv = A[p][p];
    for (let j = p; j < 4; j++) A[p][j] /= piv;
    for (let r = 0; r < 3; r++) {
      if (r !== p) {
        const f = A[r][p];
        for (let j = p; j < 4; j++) A[r][j] -= f * A[p][j];
      }
    }
  }
  return { a: A[0][3], b: A[1][3], c: A[2][3] };
}

const FIT = localQuadraticFit(0.1, 21);
const APEX_RESID = FIT.a; // ~6.5337e-2 (imp-33948 apex, re-derived independently)
const parabola = (t) => FIT.a + FIT.b * t + FIT.c * t * t; // imp-33948/imp-34008 quadratic

// The imp-34084 apex cubic coefficient d, pulled in AS-IS (NOT re-fit here).
const CUBIC_D = IMP34084_APEX_CUBIC_TILT_COEFFICIENT.cubicFit.cubicCoeffD; // ~-5.347e-4
// The pure-cubic-tilt reconstruction: parabola PLUS d t^3, with the linear term left untouched.
const cubicTilt = (t) => parabola(t) + CUBIC_D * t * t * t;

// Wing discrepancies at the imp-34008 W2 probe |t| = 0.5 (100 * |model - truth| / apex).
const PROBE_T = 0.5;
function discPct(evalFn, dir) {
  return (100 * Math.abs(evalFn(dir * PROBE_T) - residExp(K_STAR + dir * PROBE_T))) / APEX_RESID;
}

// (X1) The parabola-only wings, re-derived here, must reproduce the imp-34008 published split.
const PARAB_WINGS = {
  leftPct: +discPct(parabola, -1).toFixed(4), // ~0.4101 (reproduces imp-34008)
  rightPct: +discPct(parabola, +1).toFixed(4), // ~0.2175
};
PARAB_WINGS.splitPct = +(PARAB_WINGS.leftPct - PARAB_WINGS.rightPct).toFixed(4); // ~0.1926

// The pure-cubic-tilt wings, using the imp-34084 d as-is.
const TILT_WINGS = {
  leftPct: +discPct(cubicTilt, -1).toFixed(4), // ~0.3078
  rightPct: +discPct(cubicTilt, +1).toFixed(4), // ~0.3198
};
TILT_WINGS.splitPct = +(TILT_WINGS.leftPct - TILT_WINGS.rightPct).toFixed(4); // ~-0.0120

// Fraction of the imp-34008 left-minus-right split reconstructed by the pure tilt d t^3.
const SPLIT_RECONSTRUCTED_PCT = +(
  (100 * (PARAB_WINGS.splitPct - TILT_WINGS.splitPct)) / PARAB_WINGS.splitPct
).toFixed(2); // ~106%

// (X2) The residual EVEN discrepancy the cubic cannot touch (mean of the two tilt-residual wings),
// and the even/odd decomposition of the parabola error at the probe.
const RESIDUAL_EVEN_PCT = +((TILT_WINGS.leftPct + TILT_WINGS.rightPct) / 2).toFixed(4); // ~0.314
const R_PLUS = residExp(K_STAR + PROBE_T) - parabola(PROBE_T); // truth - parabola at +0.5
const R_MINUS = residExp(K_STAR - PROBE_T) - parabola(-PROBE_T); // truth - parabola at -0.5
const EVEN_PART_PCT = +((100 * ((R_PLUS + R_MINUS) / 2)) / APEX_RESID).toFixed(4); // ~0.314 (quartic)
const ODD_PART_PCT = +((100 * ((R_PLUS - R_MINUS) / 2)) / APEX_RESID).toFixed(4); // ~-0.096 (cubic)

// (X3) Agreement with the imp-34084 FULL-REFIT residual wings (route-independence check).
const REFIT_WINGS = IMP34084_APEX_CUBIC_TILT_COEFFICIENT.wingAsymmetryReconstruction.cubicSplit;
const TILT_VS_REFIT_MAX_ABS = +Math.max(
  Math.abs(TILT_WINGS.leftPct - REFIT_WINGS.leftPct),
  Math.abs(TILT_WINGS.rightPct - REFIT_WINGS.rightPct),
).toFixed(4); // ~0.003 (routes land on the same residual)

// The imp-34008 published wings this cross-check reconciles against.
const IMP34008_PROBE = IMP34008_APEX_PARABOLA_WING_FIDELITY.asymmetry.probe;

export const IMP34131_CUBIC_TILT_WING_CROSSCHECK = {
  id: 'imp-34131',
  proofSection: 'S-frontier',
  question:
    'imp-34008 W2 INFERRED a cubic tilt from the hump wing asymmetry (0.410%/0.218% at |t|=0.5) without ' +
    'fitting it; imp-34084 fit the apex cubic d ~ -5.347e-4 directly, reconstructing the asymmetry with a ' +
    'FULL cubic re-fit. Cross-check the two routes: add a PURE tilt d t^3 (d from imp-34084, NOT re-fit) to ' +
    'the imp-33948 parabola, report how much of the imp-34008 wing split it reconstructs, and whether a ' +
    'quartic residual remains. Cross-validation only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the fraction of the imp-34008 left-minus-right wing split (0.410-0.218) that a PURE cubic tilt d t^3 ' +
    '(d = imp-34084 apex cubic, applied without re-fitting the linear term) reconstructs on the ' +
    'independently re-derived imp-33948 parabola, plus the residual EVEN (quartic) discrepancy that survives',
  cubicAgreement: {
    kStar: K_STAR, // ~8.821092
    probeOffset: PROBE_T, // |t| = 0.5 (imp-34008 W2 probe)
    cubicD: CUBIC_D, // ~-5.347e-4 (imp-34084, applied as-is)
    imp34008PublishedWings: { leftPct: IMP34008_PROBE.leftPct, rightPct: IMP34008_PROBE.rightPct }, // 0.4101/0.2175
    parabolaWings: PARAB_WINGS, // re-derived {leftPct ~0.4101, rightPct ~0.2175, splitPct ~0.1926}
    pureTiltWings: TILT_WINGS, // {leftPct ~0.3078, rightPct ~0.3198, splitPct ~-0.0120}
    splitReconstructedPct: SPLIT_RECONSTRUCTED_PCT, // ~106%
    note:
      'adding the imp-34084 pure tilt d t^3 (d ~ -5.347e-4, NOT re-fit) to the independently re-derived ' +
      'imp-33948 parabola collapses the imp-34008 wing split from 0.4101/0.2175 (+0.1926) to 0.3078/0.3198 ' +
      '(-0.0120), reconstructing ~106% of the left-minus-right asymmetry -- corroborating the imp-34084 ' +
      'full-refit ~103% by a path that never touches the linear term; the two routes AGREE on the cubic.',
  },
  quarticResidual: {
    residualEvenPct: RESIDUAL_EVEN_PCT, // ~0.314 (mean of the two tilt-residual wings)
    evenPartPct: EVEN_PART_PCT, // ~0.314 (even part of the parabola error -- the quartic)
    oddPartPct: ODD_PART_PCT, // ~-0.096 (odd part -- the cubic, now removed by the tilt)
    note:
      'after the pure cubic tilt the wings do NOT vanish -- they settle to a near-symmetric ~0.314% in ' +
      'BOTH wings (even part E/apex ~0.314%, odd part O/apex ~-0.096%). The odd cubic removes only the ' +
      'left/right IMBALANCE; the surviving symmetric residual is the EVEN quartic curvature (imp-34064) a ' +
      'cubic term cannot address -- so what remains after the two routes agree on the cubic is quartic.',
  },
  routeIndependence: {
    pureTiltWings: { leftPct: TILT_WINGS.leftPct, rightPct: TILT_WINGS.rightPct }, // ~0.3078/0.3198
    fullRefitWings: { leftPct: REFIT_WINGS.leftPct, rightPct: REFIT_WINGS.rightPct }, // ~0.3105/0.3171 (imp-34084)
    maxAbsDiffPct: TILT_VS_REFIT_MAX_ABS, // ~0.003
    note:
      'the pure-tilt residual wings (~0.3078/0.3198) match the imp-34084 full-refit residual wings ' +
      '(~0.3105/0.3171) to ~0.003% of the apex, so whether the linear term is re-fit or not is immaterial: ' +
      'both routes leave the SAME ~0.31% even quartic residual, confirming the reconciliation is route-independent.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL CROSS-VALIDATION (NOT rigorous). Two diagnostics of the same cubic tilt of the imp-33878 ' +
    'resid_exp(k) hump are reconciled: imp-34008 W2 only INFERRED the tilt from the wing asymmetry ' +
    '(0.410%/0.218% at |t|=0.5), imp-34084 fit the apex cubic d ~ -5.347e-4 directly. Adding the imp-34084 ' +
    'pure tilt d t^3 (d as-is, NOT re-fit) to the independently re-derived imp-33948 parabola collapses the ' +
    'imp-34008 wing split from 0.4101/0.2175 (+0.1926) to 0.3078/0.3198 (-0.0120), reconstructing ~106% of ' +
    'the left-minus-right asymmetry -- corroborating the imp-34084 full-refit ~103% by a path that never ' +
    'touches the linear term, so the two routes AGREE on the cubic. What remains is a near-symmetric ~0.314% ' +
    'discrepancy in BOTH wings (even part E/apex ~0.314%, odd part O/apex ~-0.096%): the odd cubic removes ' +
    'only the left/right imbalance, and the surviving symmetric residual is the EVEN quartic curvature ' +
    '(imp-34064) a cubic cannot address. The pure-tilt residual wings match the imp-34084 full-refit wings ' +
    'to ~0.003% of the apex, so the reconciliation is route-independent. This refines, does not overturn, ' +
    'imp-34008/imp-34084. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34084 (apex cubic d ~ -5.347e-4 pulled in as-is; full-refit reconstruction corroborated); ' +
    'imp-34008 (W2 wing-asymmetry inference reconciled here); imp-34064 (the even quartic companion the ' +
    'residual points to); imp-33948 (apex quadratic re-derived independently); imp-33878 (resid_exp(k) ' +
    'model reused verbatim); imp-33810 (the ladder storing resid_exp(k)); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34131_CUBIC_TILT_WING_CROSSCHECK_ASSERTIONS = [
  {
    // (X1) The two routes agree on the cubic: the pure tilt reconstructs ~106% of the imp-34008 split,
    // and the re-derived parabola reproduces the imp-34008 published wings.
    id: 'imp34131-two-routes-agree-on-cubic',
    description: 'pure tilt d t^3 reconstructs ~106% of imp-34008 wing split; parabola reproduces 0.410/0.218',
    holds: () =>
      Math.abs(PARAB_WINGS.leftPct - IMP34008_PROBE.leftPct) < 1e-3 &&
      Math.abs(PARAB_WINGS.rightPct - IMP34008_PROBE.rightPct) < 1e-3 &&
      CUBIC_D < 0 &&
      PARAB_WINGS.splitPct > 0.15 &&
      Math.abs(TILT_WINGS.splitPct) < 0.03 &&
      Math.abs(TILT_WINGS.splitPct) < PARAB_WINGS.splitPct &&
      SPLIT_RECONSTRUCTED_PCT > 95 &&
      SPLIT_RECONSTRUCTED_PCT < 118,
  },
  {
    // (X2) A residual EVEN (quartic) discrepancy survives the cubic in both wings.
    id: 'imp34131-residual-quartic-survives-cubic',
    description: 'after the tilt the wings settle to a near-symmetric ~0.314%; even part >> |odd part|',
    holds: () =>
      RESIDUAL_EVEN_PCT > 0.25 &&
      RESIDUAL_EVEN_PCT < 0.38 &&
      EVEN_PART_PCT > 0.25 &&
      EVEN_PART_PCT < 0.38 &&
      Math.abs(EVEN_PART_PCT) > 2 * Math.abs(ODD_PART_PCT) &&
      Math.abs(TILT_WINGS.leftPct - TILT_WINGS.rightPct) < 0.03,
  },
  {
    // (X3) The pure-tilt and imp-34084 full-refit routes land on the SAME residual wings.
    id: 'imp34131-route-independent-residual',
    description: 'pure-tilt wings ~0.3078/0.3198 match imp-34084 full-refit ~0.3105/0.3171 to ~0.003% of apex',
    holds: () => TILT_VS_REFIT_MAX_ABS < 0.01,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, refines not overturns, no QED, no refereed bound is changed.
    id: 'imp34131-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, refines imp-34008/imp-34084, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP34131_CUBIC_TILT_WING_CROSSCHECK.isRigorous === false &&
      /refines, does not overturn, imp-34008\/imp-34084/.test(IMP34131_CUBIC_TILT_WING_CROSSCHECK.verdict) &&
      /NO QED/.test(IMP34131_CUBIC_TILT_WING_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34131_CUBIC_TILT_WING_CROSSCHECK.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34131_CUBIC_TILT_WING_CROSSCHECK.verdict),
  },
];

for (const a of IMP34131_CUBIC_TILT_WING_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34131-cubic-tilt-wing-crosscheck assertion failed: ${a.id}`);
  }
}
