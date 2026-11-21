/**
 * @module imp-34147-apex-cubic-tilt-sign-sweep
 *
 * imp-34147 (numerical): DOES THE imp-34084 APEX CUBIC-TILT SIGN d<0 PERSIST ACROSS THE LADDER?
 * imp-34084 C1 fit a single apex cubic coefficient d ~ -5.347e-4 (resid triple-prime(k*) < 0)
 * at the FIXED imp-33948 apex centre k* ~ 8.821092, and read the negative sign as the odd tilt
 * of the imp-33878 resid_exp(k) hump. But it fit d at ONE window centre only. It never asked
 * whether that odd-tilt SIGN is a local apex feature or a stable property of the whole hump.
 * This module re-runs the SAME symmetric {1,t,t^2,t^3} 21-point least-squares over k* +/- 0.1
 * at a SWEEP of window centres across the imp-33810 ladder support k = 6.5 .. 11.0 (quarter-decade
 * steps), tabulates d(centre) and its sign, and bisects for the centres where the tilt changes sign.
 *
 * THE MEASUREMENT (reuses the imp-33878 resid_exp(k) model + the imp-34084 fit grid VERBATIM)
 * ------------------------------------------------------------------------------------------
 *   resid_exp(k) = p_ecoll (1 - sigma_hi) - p_sigma is the imp-33773 M2 sub-leading residual
 *   over the sliding window [10^k, 10^(k+1)], the SAME smooth function of continuous k as
 *   imp-33878/imp-33948/imp-34008/imp-34084. We slide the 21-point k* +/- 0.1 symmetric fit grid
 *   from window centre 6.5 to 11.0 in quarter-decade steps, fit {1,t,t^2,t^3} at each centre, and
 *   read the cubic coefficient d(centre) = (1/6) resid triple-prime(centre). Where the tabulated
 *   sign flips between adjacent rungs we bisect for the exact centre at which d = 0.
 *
 * THE FINDING (measurement only -- the imp-34084 d<0 is a LOCAL apex feature, NOT ladder-stable)
 * ---------------------------------------------------------------------------------------------
 *   (S1) THE CUBIC-TILT SIGN IS NOT STABLE: d(centre) CHANGES SIGN THREE TIMES across the ladder
 *        support. d is POSITIVE for centre < 6.6166 (head), NEGATIVE on the central band
 *        6.6166 < centre < 8.8589, POSITIVE again on 8.8589 < centre < 10.9820, and NEGATIVE for
 *        centre > 10.9820 (tail). So the imp-34084 negative tilt describes only the central band.
 *   (S2) THE imp-33948 APEX k* ~ 8.821092 SITS INSIDE THE NEGATIVE BAND BUT ONLY ~0.0378 DECADE
 *        BELOW ITS UPPER SIGN CHANGE at centre ~ 8.8589. So d < 0 at the apex (reproducing the
 *        imp-34084 value d(k*) ~ -5.347e-4) is GENUINE but MARGINAL: shifting the window centre
 *        up by less than a twentieth of a decade flips the tilt positive. The negative apex tilt
 *        is a local feature of where k* falls relative to the resid triple-prime zero, NOT a
 *        robust global property of the hump.
 *   (S3) THE TILT IS FAR FROM CONSTANT WITHIN THE NEGATIVE BAND: d deepens to a minimum
 *        d ~ -7.04e-3 near centre ~ 8.0 (~13x the apex magnitude), well to the LEFT of the apex,
 *        then rises monotonically through the apex region to cross zero at 8.8589. The apex value
 *        d(k*) ~ -5.35e-4 is thus a small, near-crossing value, not the characteristic tilt scale.
 *
 * The punchline: the negative apex cubic tilt imp-34084 fit at a single centre is a LOCAL feature,
 * not a stable property of the imp-33878 hump. Sweeping the 21-point fit window across the ladder
 * shows d(centre) crosses zero three times (at centres ~6.6166, ~8.8589, ~10.9820); the apex
 * k* ~ 8.821092 lands inside the central negative band but only ~0.0378 decade below the upper
 * crossing, so its d < 0 sign flips under a sub-0.04-decade shift of the window centre. This
 * refines, does not overturn, imp-34084: its measured d(k*) is correct but it is a small
 * near-crossing value, and the tilt sign is centre-dependent across the hump.
 *
 * MEASUREMENT ONLY. A window-centre sweep of an inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; refines, does not overturn,
 * imp-34084; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34084-apex-cubic-tilt-coefficient (C1 fit d ~ -5.347e-4 at the SINGLE apex centre k*)
 * @see imp-34146-apex-quintic-tilt-coefficient (the odd quintic companion at the apex centre)
 * @see imp-33948-hump-apex-curvature-error-bar (the apex quadratic fit; k* comes from imp-33878)
 * @see imp-33878-hump-argmax-grid-refinement (the resid_exp(k) model + apex k* reused verbatim)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k = 6.00 .. 11.00 quarter-decade ladder support)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33878_HUMP_ARGMAX_GRID_REFINEMENT } from './imp-33878-hump-argmax-grid-refinement.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed strip (imp-2631/imp-33582/imp-33620/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33878/imp-33948/imp-34084 exactly

// EXACT inherited imp-3406/imp-33810/imp-33878/imp-33948/imp-34084 sub-terms (no re-derivation).
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

// The imp-34084 21-point symmetric {1,t,t^2,t^3} least-squares, but at an ARBITRARY window centre.
// Returns [a, b, c, d] with t = k - centre; d = CUBIC[3] = (1/6) resid triple-prime(centre).
function cubicFitAt(centre, W = 0.1, M = 21) {
  const deg = 3;
  const ts = [];
  const ys = [];
  for (let i = 0; i < M; i++) {
    const t = -W + (2 * W * i) / (M - 1);
    ts.push(t);
    ys.push(residExp(centre + t));
  }
  const nc = deg + 1;
  const S = Array.from({ length: nc }, () => Array(nc + 1).fill(0));
  for (let i = 0; i < M; i++) {
    const x = ts[i];
    const y = ys[i];
    for (let a = 0; a < nc; a++) {
      for (let b = 0; b < nc; b++) S[a][b] += Math.pow(x, a + b);
      S[a][nc] += Math.pow(x, a) * y;
    }
  }
  for (let p = 0; p < nc; p++) {
    let piv = p;
    for (let r = p + 1; r < nc; r++) if (Math.abs(S[r][p]) > Math.abs(S[piv][p])) piv = r;
    const tmp = S[p];
    S[p] = S[piv];
    S[piv] = tmp;
    const pv = S[p][p];
    for (let j = p; j <= nc; j++) S[p][j] /= pv;
    for (let r = 0; r < nc; r++) {
      if (r !== p) {
        const f = S[r][p];
        for (let j = p; j <= nc; j++) S[r][j] -= f * S[p][j];
      }
    }
  }
  return S.map((row) => row[nc]);
}
const cubicD = (centre) => cubicFitAt(centre)[3];

// (S1) Sweep the window centre across the imp-33810 ladder support in quarter-decade steps.
const SWEEP_LO = 6.5;
const SWEEP_HI = 11.0;
const SWEEP_STEP = 0.25;
const SWEEP = [];
for (let c = SWEEP_LO; c <= SWEEP_HI + 1e-9; c += SWEEP_STEP) {
  const centre = +c.toFixed(2);
  const F = cubicFitAt(centre);
  SWEEP.push({
    centre,
    d: +F[3].toExponential(4), // cubic coefficient d(centre)
    apex: +F[0].toExponential(4), // fitted value at the local window centre
    sign: Math.sign(F[3]),
  });
}

// Adjacent-rung sign flips in the tabulated sweep.
const SIGN_FLIP_BRACKETS = [];
for (let i = 1; i < SWEEP.length; i++) {
  if (SWEEP[i - 1].sign !== SWEEP[i].sign) {
    SIGN_FLIP_BRACKETS.push([SWEEP[i - 1].centre, SWEEP[i].centre]);
  }
}

// Bisect a bracketed sign flip for the exact centre where d(centre) = 0.
function bisectZero(a, b, iters = 80) {
  let fa = cubicD(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = cubicD(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}
const CROSSINGS = SIGN_FLIP_BRACKETS.map(([a, b]) => +bisectZero(a, b).toFixed(6));
// [ ~6.616582 (head), ~8.858861 (apex-band upper), ~10.982012 (tail) ]
const HEAD_CROSSING = CROSSINGS[0];
const APEX_CROSSING = CROSSINGS[1];
const TAIL_CROSSING = CROSSINGS[2];

// (S2) The imp-34084 apex value reproduced, and its margin below the near-apex sign change.
const D_AT_APEX = cubicD(K_STAR); // ~-5.3467e-4 (reproduces imp-34084 d ~ -5.347e-4)
const APEX_TO_CROSSING_OFFSET = +(APEX_CROSSING - K_STAR).toFixed(6); // ~+0.037769 (crossing ABOVE k*)

// (S3) The deepest (most negative) tilt in the central band and where it sits.
let deepest = SWEEP[0];
for (const r of SWEEP) if (r.d < deepest.d) deepest = r;
const DEEPEST_D = deepest.d; // ~-7.0398e-3
const DEEPEST_CENTRE = deepest.centre; // ~8.00 (well LEFT of the apex k* ~ 8.821)

export const IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP = {
  id: 'imp-34147',
  proofSection: 'S-frontier',
  question:
    'imp-34084 C1 fit the apex cubic tilt d ~ -5.347e-4 (resid triple-prime(k*) < 0) at the SINGLE ' +
    'imp-33948 apex centre k* ~ 8.821092, but never asked whether that negative sign is a local apex ' +
    'feature or a stable property of the imp-33878 hump. Re-run the SAME 21-point symmetric ' +
    '{1,t,t^2,t^3} fit over k* +/- 0.1 at a sweep of window centres across the imp-33810 ladder support ' +
    'k = 6.5 .. 11.0, tabulate d(centre) and its sign, and report where the tilt changes sign. ' +
    'Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the cubic coefficient d(centre) = (1/6) resid triple-prime(centre) of a 21-point symmetric ' +
    'least-squares fit over centre +/- 0.1 on {1,t,t^2,t^3}, swept across window centres 6.5 .. 11.0 in ' +
    'quarter-decade steps, its sign at each centre, and the bisected centres where d(centre) = 0, all on ' +
    'the inherited imp-33878 resid_exp(k) model',
  sweep: {
    centreLo: SWEEP_LO, // 6.5
    centreHi: SWEEP_HI, // 11.0
    centreStep: SWEEP_STEP, // 0.25 (quarter-decade)
    fitWindow: 0.1, // +/- 0.1 decade (imp-34084 grid)
    fitPoints: 21, // 21 (imp-34084 grid)
    table: SWEEP, // [{centre, d, apex, sign}, ...] 19 rungs
    note:
      'd(centre) is POSITIVE for centre < 6.6166, NEGATIVE on 6.6166 < centre < 8.8589, POSITIVE on ' +
      '8.8589 < centre < 10.9820, and NEGATIVE for centre > 10.9820 -- three sign changes across the ' +
      'ladder support, so the imp-34084 negative tilt describes only the central band.',
  },
  signChanges: {
    numberOfSignChanges: CROSSINGS.length, // 3
    crossings: CROSSINGS, // [~6.6166 head, ~8.8589 apex-band upper, ~10.9820 tail]
    headCrossing: HEAD_CROSSING, // ~6.616582
    apexBandUpperCrossing: APEX_CROSSING, // ~8.858861
    tailCrossing: TAIL_CROSSING, // ~10.982012
    note:
      'bisected zeros of d(centre): the tilt flips +->- at the head (~6.6166), -->+ just above the ' +
      'apex (~8.8589), and +->- at the tail (~10.9820); the central negative band ' +
      '[6.6166, 8.8589] is where the imp-34084 d < 0 holds.',
  },
  apexMargin: {
    kStar: K_STAR, // ~8.821092
    dAtApex: +D_AT_APEX.toExponential(4), // ~-5.3467e-4 (reproduces imp-34084)
    apexToUpperCrossingOffset: APEX_TO_CROSSING_OFFSET, // ~+0.037769 (crossing ~0.038 decade ABOVE k*)
    note:
      'the apex k* ~ 8.821092 lies INSIDE the negative band but only ~0.0378 decade BELOW the upper ' +
      'sign change at ~8.8589, so d(k*) ~ -5.35e-4 < 0 is genuine but MARGINAL -- a sub-0.04-decade ' +
      'shift of the window centre flips the tilt positive; the negative apex sign is a local feature.',
  },
  bandDepth: {
    deepestD: DEEPEST_D, // ~-7.0398e-3
    deepestCentre: DEEPEST_CENTRE, // ~8.00
    apexMagnitudeRatio: +(Math.abs(DEEPEST_D) / Math.abs(D_AT_APEX)).toFixed(2), // ~13.2
    note:
      'within the negative band d deepens to ~-7.04e-3 near centre ~8.00 (~13x the apex magnitude), ' +
      'well LEFT of the apex, then rises monotonically through the apex to cross zero at ~8.8589 -- so ' +
      'd(k*) ~ -5.35e-4 is a small near-crossing value, not the characteristic tilt scale.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (NOT rigorous). Sweeping the imp-34084 21-point symmetric {1,t,t^2,t^3} fit ' +
    'window across the imp-33810 ladder support (centre 6.5 .. 11.0, quarter-decade steps) shows the ' +
    'cubic-tilt coefficient d(centre) CHANGES SIGN THREE TIMES: positive for centre < 6.6166, negative on ' +
    'the central band 6.6166 < centre < 8.8589, positive on 8.8589 < centre < 10.9820, and negative for ' +
    'centre > 10.9820 (crossings bisected at ~6.616582, ~8.858861, ~10.982012). The imp-33948 apex ' +
    'k* ~ 8.821092 lies inside the negative band and reproduces the imp-34084 value d(k*) ~ -5.347e-4, ' +
    'but only ~0.0378 decade BELOW the upper sign change, so the negative apex tilt is GENUINE yet ' +
    'MARGINAL -- a sub-0.04-decade shift of the window centre flips it positive -- and within the band d ' +
    'deepens to ~-7.04e-3 near centre ~8.00 (~13x the apex magnitude, well left of the apex), so ' +
    'd(k*) is a small near-crossing value. The imp-34084 negative apex cubic tilt is therefore a LOCAL ' +
    'feature of where k* falls relative to the resid triple-prime zero, NOT a stable property of the ' +
    'hump. This refines, does not overturn, imp-34084. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34084 (C1 fit d ~ -5.347e-4 at the SINGLE apex centre k*; sign-persistence measured here); ' +
    'imp-34146 (odd quintic companion at the apex centre); imp-33948 (apex quadratic; k* from imp-33878); ' +
    'imp-33878 (resid_exp(k) model + apex k* reused verbatim); imp-33810 (the k = 6..11 ladder support); ' +
    'imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP_ASSERTIONS = [
  {
    // (S1) The cubic tilt sign is NOT stable: exactly three sign changes across the ladder support,
    // with the tabulated central band negative and the head/tail rungs the opposite sign.
    id: 'imp34147-three-sign-changes-across-ladder',
    description: 'd(centre) changes sign 3x: crossings ~6.6166, ~8.8589, ~10.9820; central band negative',
    holds: () =>
      CROSSINGS.length === 3 &&
      Math.abs(HEAD_CROSSING - 6.616582) < 1e-3 &&
      Math.abs(APEX_CROSSING - 8.858861) < 1e-3 &&
      Math.abs(TAIL_CROSSING - 10.982012) < 1e-3 &&
      HEAD_CROSSING < APEX_CROSSING &&
      APEX_CROSSING < TAIL_CROSSING &&
      cubicD(7.5) < 0 && // interior of the central negative band
      cubicD(9.75) > 0, // interior of the positive band
  },
  {
    // (S2) The apex sits inside the negative band, reproduces the imp-34084 value, and is only
    // ~0.038 decade below the upper sign change -- a genuine but marginal negative.
    id: 'imp34147-apex-negative-but-marginal',
    description: 'd(k*) ~-5.35e-4 (reproduces imp-34084), crossing ~0.0378 decade ABOVE k*',
    holds: () =>
      D_AT_APEX < 0 &&
      Math.abs(D_AT_APEX - -5.347e-4) < 5e-6 &&
      APEX_CROSSING > K_STAR &&
      APEX_TO_CROSSING_OFFSET > 0 &&
      APEX_TO_CROSSING_OFFSET < 0.06 &&
      Math.abs(APEX_TO_CROSSING_OFFSET - 0.037769) < 1e-3,
  },
  {
    // (S3) The tilt deepens well left of the apex to ~13x the apex magnitude, so d(k*) is a small
    // near-crossing value, not the characteristic band scale.
    id: 'imp34147-deepest-tilt-left-of-apex',
    description: 'd deepens to ~-7.04e-3 near centre ~8.00 (~13x apex magnitude), left of k*',
    holds: () =>
      DEEPEST_D < 0 &&
      Math.abs(DEEPEST_D - -7.0398e-3) < 5e-5 &&
      DEEPEST_CENTRE < K_STAR &&
      Math.abs(DEEPEST_CENTRE - 8.0) < 1e-9 &&
      Math.abs(DEEPEST_D) / Math.abs(D_AT_APEX) > 8,
  },
  {
    // Honesty gate: measurement only, isRigorous false, refines not overturns, no QED, no refereed bound is changed.
    id: 'imp34147-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, refines imp-34084, no QED, imp-3066 untouched, no refereed bound is changed',
    holds: () =>
      IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP.isRigorous === false &&
      /refines, does not overturn, imp-34084/.test(IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP.verdict) &&
      /NO QED/.test(IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP.verdict),
  },
];

for (const a of IMP34147_APEX_CUBIC_TILT_SIGN_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34147-apex-cubic-tilt-sign-sweep assertion failed: ${a.id}`);
  }
}
