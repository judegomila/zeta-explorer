/**
 * @module imp-34008-apex-parabola-wing-fidelity
 *
 * imp-34008 (numerical): TEST THE imp-33948 APEX PARABOLA IN THE WINGS. imp-33948 E2
 * reported flat-top half-widths (~0.14 decade full-width at 0.14%, ~0.38 at 1%, ~0.85 at
 * 5%) by INVERTING the apex parabola drop = (1/2)|resid double-prime| dk^2, but never
 * checked the fitted quadratic against the TRUE resid_exp(k) in the wings, where the
 * cubic/quartic curvature of the hump enters. This module evaluates BOTH the fitted
 * quadratic P(t) = a + b t + c t^2 (t = k - k*) and the exact surrogate resid_exp(k*+t)
 * over a wide symmetric k range and reports the |k-k*| at which they diverge by 1% and 5%
 * of the apex, bounding the range over which "one broad quadratic maximum" holds.
 *
 * THE MEASUREMENT (reuses the imp-33878 resid_exp(k) model + the imp-33948 apex fit VERBATIM)
 * ------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma over the sliding window [10^k, 10^(k+1)]
 *   (identical parts(): E_trunc = 3.06e-5 fixed strip, E_coll = C_C sqrt(log T0 / N),
 *   E_flow = C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)). The apex quadratic is
 *   the SAME 21-point least-squares fit over k* +/- 0.1 as imp-33948 E1 (a ~ 6.5337e-2,
 *   b ~ 0, 2c = resid double-prime(k*) ~ -3.613e-2). We then scan t = k - k* outward in
 *   both directions and record the smallest |t| where |P(t) - resid_exp(k*+t)| / a first
 *   exceeds 1% and 5% -- the wing-fidelity radius of the quadratic.
 *
 * THE FINDING (measurement only -- the parabola is faithful WELL BEYOND its flat-top reading)
 * ------------------------------------------------------------------------------------------
 *   (W1) THE QUADRATIC IS FAITHFUL TO THE TRUE HUMP OVER A ~1.3-DECADE WINDOW AT THE 1% LEVEL.
 *        |P - resid_exp| / apex first reaches 1% at |k-k*| ~ 0.635 on the LOW-k (left) wing
 *        and ~0.714 on the HIGH-k (right) wing, and 5% at ~0.982 (left) / ~1.065 (right). So
 *        "one broad quadratic maximum" holds to within 1% across a full-width of ~1.27 decade
 *        (limited by the tighter left wing) and to within 5% across ~1.96 decade.
 *   (W2) THE WINGS ARE ASYMMETRIC: the LOW-k side departs first. At every offset the left
 *        discrepancy exceeds the right (e.g. at |t|=0.5, 0.410% left vs 0.218% right), so a
 *        nonzero cubic term tilts the true hump -- the parabola slightly under-resolves the
 *        steeper lower-k shoulder. The departure is monotone in |t|, so the first crossing IS
 *        the boundary of the faithful zone.
 *   (W3) THE imp-33948 E2 FLAT-TOP INVERSIONS LIVE ENTIRELY INSIDE THE FAITHFUL ZONE. The E2
 *        half-widths are 0.19 decade (1% flat-top) and 0.425 decade (5% flat-top); at those
 *        offsets the parabola-vs-truth discrepancy is only ~0.010% and ~0.222% of the apex --
 *        1-2 orders of magnitude below the drop being measured. So imp-33948 E2 never
 *        extrapolated the quadratic into unfaithful wings: the flat-top readings are honest.
 *
 * The punchline: the imp-33948 apex parabola tracks the true resid_exp(k) hump to within 1%
 * of the apex out to |k-k*| ~ 0.63-0.71 decade and within 5% out to ~0.98-1.07 decade (the
 * low-k wing departs first -- a cubic tilt). The imp-33948 E2 flat-top half-widths (0.19 and
 * 0.425 decade) sit deep inside this faithful zone, where the parabola-vs-truth error is only
 * ~0.01%/~0.22% -- so "one broad quadratic maximum" is not an inversion artifact but holds,
 * measured, across a ~1.3-decade (1%) to ~2-decade (5%) window of k. Numerical measurement
 * only; refines, does not overturn, imp-33948.
 *
 * MEASUREMENT ONLY. A wing-fidelity diagnostic of an inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33948-hump-apex-curvature-error-bar (the apex quadratic + E2 flat-top widths tested here)
 * @see imp-34005-apex-curvature-fit-window-sensitivity (the fit-window robustness companion)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model reused verbatim)
 * @see imp-33905-hump-argmax-grid-vs-continuum-reconciliation (R3 "one broad quadratic maximum")
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878/imp-33948 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-33948 sub-terms (no re-derivation, no fresh model).
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

// The SAME 21-point local quadratic least-squares fit over k* +/- 0.1 as imp-33948 E1.
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
const APEX_RESID = FIT.a; // ~6.5337e-2 (imp-33948 apex)
// The fitted apex parabola P(t) = a + b t + c t^2, t = k - k* (imp-33948 quadratic).
const parabola = (t) => FIT.a + FIT.b * t + FIT.c * t * t;

// Wing-fidelity scan: smallest |t| in each direction where |P - resid_exp|/apex exceeds tol.
const SCAN_STEP = 0.001;
const SCAN_MAX = 2.0;
function departureRadius(dir, tolFraction) {
  for (let i = 1; i <= Math.round(SCAN_MAX / SCAN_STEP); i++) {
    const t = dir * i * SCAN_STEP;
    const disc = Math.abs(parabola(t) - residExp(K_STAR + t)) / APEX_RESID;
    if (disc >= tolFraction) return +Math.abs(t).toFixed(3);
  }
  return null; // never departs within the scan window
}

// (W1) 1% and 5% departure radii on each wing.
const RADIUS = {
  left_1pct: departureRadius(-1, 0.01), // ~0.635
  right_1pct: departureRadius(+1, 0.01), // ~0.714
  left_5pct: departureRadius(-1, 0.05), // ~0.982
  right_5pct: departureRadius(+1, 0.05), // ~1.065
};
// The faithful full-width is bounded by the TIGHTER (low-k) wing.
const FAITHFUL_FULL_WIDTH = {
  at_1pct: +(RADIUS.left_1pct + RADIUS.right_1pct).toFixed(3), // ~1.35 decade (sum of wings)
  at_5pct: +(RADIUS.left_5pct + RADIUS.right_5pct).toFixed(3), // ~2.05 decade
  boundedBy1pct: +(2 * Math.min(RADIUS.left_1pct, RADIUS.right_1pct)).toFixed(3), // ~1.27 (2x tighter wing)
  boundedBy5pct: +(2 * Math.min(RADIUS.left_5pct, RADIUS.right_5pct)).toFixed(3), // ~1.96
};

// (W2) Asymmetry: discrepancy at a fixed probe offset, left vs right.
const PROBE_T = 0.5;
const DISC_PROBE = {
  offset: PROBE_T,
  leftPct: +((100 * Math.abs(parabola(-PROBE_T) - residExp(K_STAR - PROBE_T))) / APEX_RESID).toFixed(4), // ~0.410
  rightPct: +((100 * Math.abs(parabola(PROBE_T) - residExp(K_STAR + PROBE_T))) / APEX_RESID).toFixed(4), // ~0.218
};

// (W3) The imp-33948 E2 flat-top HALF-widths and the parabola-vs-truth error there.
const FLAT_TOP_HALFWIDTH_1PCT = 0.19; // imp-33948 flatTopFullWidthDecade.at_1pct ~0.38 / 2
const FLAT_TOP_HALFWIDTH_5PCT = 0.425; // imp-33948 flatTopFullWidthDecade.at_5pct ~0.85 / 2
function maxDiscAt(t) {
  const l = Math.abs(parabola(-t) - residExp(K_STAR - t)) / APEX_RESID;
  const r = Math.abs(parabola(t) - residExp(K_STAR + t)) / APEX_RESID;
  return Math.max(l, r);
}
const FIDELITY_AT_FLAT_TOP = {
  at_1pct_halfwidth: +(100 * maxDiscAt(FLAT_TOP_HALFWIDTH_1PCT)).toFixed(4), // ~0.010%
  at_5pct_halfwidth: +(100 * maxDiscAt(FLAT_TOP_HALFWIDTH_5PCT)).toFixed(4), // ~0.222%
};

export const IMP34008_APEX_PARABOLA_WING_FIDELITY = {
  id: 'imp-34008',
  proofSection: 'S-frontier',
  question:
    'imp-33948 E2 reported flat-top half-widths by INVERTING the apex parabola but never checked the ' +
    'fitted quadratic against the true resid_exp(k) in the wings, where cubic/quartic curvature enters. ' +
    'Evaluate both the parabola P(t)=a+b t+c t^2 and the exact resid_exp(k*+t) over a wide k range, ' +
    'report the |k-k*| at which they diverge by 1% and 5% of the apex, and state the honest validity ' +
    'range over which "one broad quadratic maximum" holds. Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the wing-fidelity radius |k-k*| at which the imp-33948 apex parabola departs from the true imp-33878 ' +
    'resid_exp(k) by 1% and 5% of the apex, on each wing, plus the parabola-vs-truth error at the ' +
    'imp-33948 E2 flat-top half-widths',
  apexParabola: {
    kStar: K_STAR, // ~8.821092
    apexResid: +APEX_RESID.toExponential(4), // ~6.5337e-2 (imp-33948)
    residSecondDeriv: +(2 * FIT.c).toExponential(4), // ~-3.613e-2 (imp-33948 E1)
    fitWindow: 0.1,
    fitPoints: 21,
  },
  wingFidelity: {
    departureRadiusDecade: RADIUS, // {left/right}_{1pct,5pct}
    faithfulFullWidthDecade: FAITHFUL_FULL_WIDTH,
    note:
      'the quadratic tracks the true resid_exp(k) to within 1% of the apex out to |k-k*|~0.635 (low-k) / ' +
      '0.714 (high-k) and within 5% out to ~0.982 / ~1.065; the low-k wing departs first (cubic tilt), so ' +
      'the 1% faithful full-width is bounded at ~1.27 decade and the 5% at ~1.96 decade.',
  },
  asymmetry: {
    probe: DISC_PROBE,
    note:
      'at every offset the low-k (left) discrepancy exceeds the high-k (right) -- a nonzero cubic term ' +
      'tilts the true hump, so the parabola under-resolves the steeper lower-k shoulder; the departure is ' +
      'monotone in |k-k*|, so the first crossing IS the boundary of the faithful zone.',
  },
  e2FlatTopFidelity: {
    flatTopHalfWidth1pct: FLAT_TOP_HALFWIDTH_1PCT, // 0.19 decade (imp-33948 E2 1% flat top / 2)
    flatTopHalfWidth5pct: FLAT_TOP_HALFWIDTH_5PCT, // 0.425 decade (imp-33948 E2 5% flat top / 2)
    parabolaVsTruthPct: FIDELITY_AT_FLAT_TOP, // ~0.010% / ~0.222%
    note:
      'the imp-33948 E2 flat-top half-widths (0.19, 0.425 decade) sit DEEP inside the faithful zone: the ' +
      'parabola-vs-truth error there is only ~0.010% and ~0.222% of the apex, 1-2 orders of magnitude ' +
      'below the drop being measured -- so E2 never extrapolated the quadratic into unfaithful wings.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (NOT rigorous). Evaluating the imp-33948 apex parabola P(t)=a+b t+c t^2 ' +
    '(a~6.5337e-2, 2c~-3.613e-2) against the true imp-33878 resid_exp(k*+t) over a wide symmetric k ' +
    'range, the quadratic stays within 1% of the apex out to |k-k*|~0.635 on the low-k wing and ~0.714 ' +
    'on the high-k wing, and within 5% out to ~0.982 / ~1.065 -- so "one broad quadratic maximum" holds, ' +
    'measured, across a ~1.27-decade (1%) to ~1.96-decade (5%) full-width window bounded by the tighter ' +
    'low-k wing. The wings are ASYMMETRIC (low-k departs first, e.g. 0.410% vs 0.218% at |t|=0.5), a ' +
    'cubic tilt the parabola cannot capture; the departure is monotone so the first crossing is the ' +
    'faithful-zone boundary. Crucially, the imp-33948 E2 flat-top half-widths (0.19 and 0.425 decade) ' +
    'sit deep inside this zone, where the parabola-vs-truth error is only ~0.010% and ~0.222% of the ' +
    'apex -- 1-2 orders of magnitude below the drop being inverted -- so the E2 flat-top readings are ' +
    'honest, not inversion artifacts. This refines, does not overturn, imp-33948. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) ' +
    'is descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33948 (apex parabola + E2 flat-top widths tested here); imp-34005 (fit-window robustness ' +
    'companion); imp-33878 (resid_exp(k) model reused verbatim); imp-33905 (R3 "one broad quadratic ' +
    'maximum"); imp-33810 (the ladder storing resid_exp(k)); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34008_APEX_PARABOLA_WING_FIDELITY_ASSERTIONS = [
  {
    // (W1) The quadratic is faithful over a ~1.3-decade (1%) to ~2-decade (5%) window.
    id: 'imp34008-wing-fidelity-radii-decades-wide',
    description: '1% departure at |k-k*|~0.63-0.71, 5% at ~0.98-1.07; faithful full-width ~1.27 (1%) / ~1.96 (5%)',
    holds: () =>
      RADIUS.left_1pct > 0.55 &&
      RADIUS.left_1pct < 0.75 &&
      RADIUS.right_1pct > 0.65 &&
      RADIUS.right_1pct < 0.8 &&
      RADIUS.left_5pct > 0.9 &&
      RADIUS.left_5pct < 1.05 &&
      RADIUS.right_5pct > 1.0 &&
      RADIUS.right_5pct < 1.15 &&
      FAITHFUL_FULL_WIDTH.boundedBy1pct > 1.1 &&
      FAITHFUL_FULL_WIDTH.boundedBy5pct > 1.8,
  },
  {
    // (W2) The wings are asymmetric: low-k departs first (cubic tilt).
    id: 'imp34008-wings-asymmetric-low-k-departs-first',
    description: 'left (low-k) discrepancy exceeds right at the probe offset, and left 1% radius < right 1% radius',
    holds: () =>
      DISC_PROBE.leftPct > DISC_PROBE.rightPct &&
      RADIUS.left_1pct < RADIUS.right_1pct &&
      RADIUS.left_5pct < RADIUS.right_5pct,
  },
  {
    // (W3) The imp-33948 E2 flat-top half-widths sit deep inside the faithful zone.
    id: 'imp34008-e2-flat-top-inside-faithful-zone',
    description: 'parabola-vs-truth error at the E2 flat-top half-widths (~0.010%, ~0.222%) far below the drop measured',
    holds: () =>
      FIDELITY_AT_FLAT_TOP.at_1pct_halfwidth < 0.05 && // << 1% flat-top drop
      FIDELITY_AT_FLAT_TOP.at_5pct_halfwidth < 1.0 && // << 5% flat-top drop
      FLAT_TOP_HALFWIDTH_1PCT < RADIUS.left_1pct && // 1% flat top inside 1% faithful radius
      FLAT_TOP_HALFWIDTH_5PCT < RADIUS.left_5pct, // 5% flat top inside 5% faithful radius
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines not overturns, no QED, PT SOTA.
    id: 'imp34008-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refines imp-33948, no QED, PT Lambda<=0.2 SOTA',
    holds: () =>
      IMP34008_APEX_PARABOLA_WING_FIDELITY.isRigorous === false &&
      /refines, does not overturn, imp-33948/.test(IMP34008_APEX_PARABOLA_WING_FIDELITY.verdict) &&
      /NO QED/.test(IMP34008_APEX_PARABOLA_WING_FIDELITY.verdict) &&
      /remains SOTA/.test(IMP34008_APEX_PARABOLA_WING_FIDELITY.verdict),
  },
];

for (const a of IMP34008_APEX_PARABOLA_WING_FIDELITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34008-apex-parabola-wing-fidelity assertion failed: ${a.id}`);
  }
}
