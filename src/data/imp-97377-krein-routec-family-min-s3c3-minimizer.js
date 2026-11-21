/**
 * @module imp-97377-krein-routec-family-min-s3c3-minimizer
 *
 * imp-97377 (numerical, opus-4-8): SEARCH the imp-97113 6-carrier-functional 94-dim relaxed v0 family for the
 * member that MINIMIZES the m=3 assembled coefficient magnitude |s_3| + |c_3| -- the coefficient imp-97354
 * measured as the single driver loosening the Route C far-tail constant to ~5.18e6 (~106.7x the 8-sparse
 * baseline 48524.3) -- and quantify the tightest Route C far-tail constant achievable this way.
 * Measurement / search only; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * CONTEXT (imp-97354 residual). imp-97354 instantiated the imp-97337 certified |g|-enclosure for one
 * representative member of the 94-dim relaxed family (imp-97134 base + a hand-built pure-tail annihilator on
 * degrees 8..15) and found the Route C constant C_far = SUM_{m>=3}(|s_m|+|c_m|) Zfar^-(m-3) JUMPED to
 * ~5.18e6 because the m=3 coefficient |s_3|+|c_3| rose 48510 -> ~5.17e6: the six carriers kill only the
 * z^-1, z^-2, z^-3 CARRIER orders (s_0..2, c_0..2), NOT the assembled-polynomial z^-3 coefficient s_3, c_3.
 * imp-97354 flagged that a TIGHT majorant needs the actual near-optimal v0, the family member MINIMIZING
 * |s_3| + |c_3| (and the higher tail). This leaf performs that minimization at the degree level.
 *
 * THE KEY LINEAR STRUCTURE (measured here). Assembling z g(z) = sin(z) S(z) + cos(z) C(z) with exact-integer
 * s_m, c_m (imp-97263/imp-97337 machinery), the z^-3 (m=3) coefficients receive contributions ONLY from the
 * odd DLMF power B[3] = -a_3(k) of each degree k >= 3, and the sin z / cos z split is by k mod 4:
 *   - EVEN degrees (k mod 4 in {0,2}) feed c_3 ONLY;
 *   - ODD  degrees (k mod 4 in {1,3}) feed s_3 ONLY.
 * So s_3 and c_3 DECOUPLE by parity exactly like the six carrier functionals do. The base trial gives
 * s_3 = 45045 (odd degrees 1,3,5,7), c_3 = 3465 (even degrees 4,6), |s_3|+|c_3| = 48510. A pure-tail
 * annihilator on the next four degrees per parity (even {8,10,12,14} -> (-225,-567,-475,-133), odd
 * {9,11,13,15} -> (-261,-667,-567,-161), the imp-97354 exact 3x4 cofactor kernels) contributes a NONZERO
 * increment to c_3 (even, -2064825 per unit) resp. s_3 (odd, -3151575 per unit) while keeping all six
 * carriers zero. Because each parity kernel maps NONTRIVIALLY onto its z^-3 coefficient, a real multiple of
 * it can CANCEL the base contribution exactly.
 *
 * THE MINIMIZER (the deliverable). Scaling the even kernel by lamEven = -c_3^base / (-2064825) ~ 1.6781e-3
 * and the odd kernel by lamOdd = -s_3^base / (-3151575) ~ 1.4293e-2 gives the family member
 *   d = base + lamEven * evenKernel + lamOdd * oddKernel
 * with s_3 = c_3 = 0 EXACTLY (float residual ~1e-10), i.e. |s_3| + |c_3| driven to its GLOBAL minimum 0.
 * Consequences MEASURED:
 *   - all six carriers stay annihilated (residual ~1e-14) and s_0..2 = c_0..2 = 0 still hold;
 *   - g now decays ONE ORDER FASTER: g = O(z^-5) (|g| z^4 -> 0 decreasing 2824 -> 346 over z = 400..3200,
 *     while |g| z^5 stays bounded ~1e6), because killing s_3, c_3 removes the whole z^-3 order;
 *   - the Route C far-tail constant COLLAPSES to C_far ~ 99.37 (now dominated by the m=4 order
 *     (|s_4|+|c_4|) Zfar^-1 ~ 99.25, the higher m>=5 orders <= 0.13, all Zfar^-(m-3)-suppressed).
 * That is a factor ~488x TIGHTER than the 8-sparse baseline 48524.3 and ~52000x tighter than the imp-97354
 * generic relaxed member ~5.18e6.
 *
 * HONEST READING. The six carriers leave s_3, c_3 FREE, but the family member minimizing |s_3|+|c_3| drives
 * them to EXACTLY zero (two further linear conditions, feasible in the 94-dim family since each parity tail
 * kernel maps nontrivially onto its z^-3 coefficient), which GAINS an extra decay order (g = O(z^-5)) and
 * collapses the Route C constant to the now-leading m=4 floor ~99.37 -- so essentially ALL of the imp-97354
 * gap (and more) is recoverable at the DEGREE LEVEL. The residual to the true infimum: the m=4 / higher tail
 * is NOT itself minimized here (more tail degrees of freedom could push C_far toward the m=5 floor ~0.13),
 * and this uses REAL (non-integer) tail scalings lamEven, lamOdd -- a real-valued degree-level stand-in, not
 * an integer rational trial and not a committed v0. Certifying the tail of an actual committed v0 rather than
 * a hand-scaled degree combination still needs two-sided c_{jk} interval control (IMP97015_ARB_INTERVAL_BESSEL).
 *
 * SCOPE. Search / measurement only over the degree-level relaxed family (rigorous upper bound for any fixed
 * trial by imp-96888, but this minimizer is a real-coefficient stand-in, not a committed near-optimal v0).
 * Produces no committed v0, no interval majorant, no operator positivity; Rayleigh floors stay UPPER bounds;
 * interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97354-krein-routeb-relaxed-v0-tail-looseness.js (representative relaxed member; C_far ~5.18e6, the residual this leaf minimizes)
 * @see imp-97337-krein-routeb-certified-bessel-enclosure.js (the enclosure scheme; 8-sparse baseline C_far ~48524.3)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (six carrier functionals; 94-dim v0 family)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the base 8-sparse annihilating trial)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (Rayleigh reduction; rigorous for any trial v0)
 *
 * Ticket: imp-97377 (numerical, opus-4-8, medium). Search / measurement only; changes no bound; NO QED.
 * Import-light: two light literal imports (imp-97134 base trial, imp-97113 carrier functionals), no zeros bundle.
 */

import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';
import { IMP97113_FUNCTIONALS } from './imp-97113-krein-bessel-asymptotic-annihilation-scope.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const TFAR = 60000; // Route C far-tail cutoff (imp-97337)
const ZFAR = a * TFAR;
const KMAX = 15; // search over the same degree window as imp-97354 (base 0..7 + tail 8..15)
const LEN = KMAX + 1;

// exact Hankel coefficient a_j(k) = (k+j)!/(2^j j!(k-j)!); positive integer for 0<=j<=k, zero for j>k.
function aCoeff(k, j) {
  if (j < 0 || j > k) return 0;
  let num = 1;
  for (let i = k - j + 1; i <= k + j; i++) num *= i;
  let den = Math.pow(2, j);
  for (let i = 2; i <= j; i++) den *= i;
  return num / den;
}

// exact integer 1-dim kernel of a 3x4 imp-97113 parity block via signed 3x3 cofactors, reduced by gcd.
function det3(m) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}
function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}
function kernel3x4(cols) {
  const ker = [];
  for (let i = 0; i < 4; i++) {
    const sub = cols.filter((_, j) => j !== i);
    const M = [0, 1, 2].map((r) => sub.map((c) => c[r]));
    ker.push((-1) ** i * det3(M));
  }
  const g = ker.reduce((acc, v) => gcd(acc, v), 0) || 1;
  return ker.map((v) => v / g);
}

// Assemble z g(z) = sin(z) S(z) + cos(z) C(z) FIRST (exact-integer s_m, c_m), then bound (imp-97337 machinery).
function assemble(dmap) {
  const s = new Array(LEN).fill(0);
  const c = new Array(LEN).fill(0);
  for (const kStr of Object.keys(dmap)) {
    const k = +kStr;
    const d = dmap[kStr];
    const A = {};
    const B = {};
    for (let m = 0; 2 * m <= k; m++) A[2 * m] = Math.pow(-1, m) * aCoeff(k, 2 * m);
    for (let m = 0; 2 * m + 1 <= k; m++) B[2 * m + 1] = Math.pow(-1, m) * aCoeff(k, 2 * m + 1);
    const addS = (poly, sign) => { for (const [pw, v] of Object.entries(poly)) s[+pw] += sign * d * v; };
    const addC = (poly, sign) => { for (const [pw, v] of Object.entries(poly)) c[+pw] += sign * d * v; };
    const p = ((k % 4) + 4) % 4;
    if (p === 0) { addS(A, +1); addC(B, +1); }
    else if (p === 1) { addC(A, -1); addS(B, +1); }
    else if (p === 2) { addS(A, -1); addC(B, -1); }
    else { addC(A, +1); addS(B, -1); }
  }
  return { s, c };
}

// Route C far-tail constant: |g(z)| <= C_far z^-4 for z >= Zfar, from the assembled integer coefficients.
function routeCConstant(s, c, Zfar) {
  let cfar = 0;
  for (let m = 3; m < s.length; m++) cfar += (Math.abs(s[m]) + Math.abs(c[m])) * Math.pow(Zfar, -(m - 3));
  return cfar;
}

// exact P/Q value of j_k(z) (DLMF 10.49) -- used only to CHECK the decay order, never inside the bound.
function jExact(k, z) {
  const ph = z - (k * Math.PI) / 2;
  let A = 0;
  for (let m = 0; 2 * m <= k; m++) A += Math.pow(-1, m) * aCoeff(k, 2 * m) * Math.pow(z, -2 * m);
  let B = 0;
  for (let m = 0; 2 * m + 1 <= k; m++) B += Math.pow(-1, m) * aCoeff(k, 2 * m + 1) * Math.pow(z, -(2 * m + 1));
  return (Math.sin(ph) * A + Math.cos(ph) * B) / z;
}
function gTrue(dmap, z) {
  let g = 0;
  for (const kStr of Object.keys(dmap)) g += dmap[kStr] * jExact(+kStr, z);
  return g;
}

// carrier residual (six imp-97113 functionals) on a degree map.
function carrierResidual(dmap) {
  const evenVals = [0, 0, 0];
  const oddVals = [0, 0, 0];
  for (const kStr of Object.keys(dmap)) {
    const k = +kStr;
    const d = dmap[kStr];
    if (k % 2 === 0) {
      const row = IMP97113_FUNCTIONALS.evenRow(k);
      for (let i = 0; i < 3; i++) evenVals[i] += d * row[i];
    } else {
      const row = IMP97113_FUNCTIONALS.oddRow(k);
      for (let i = 0; i < 3; i++) oddVals[i] += d * row[i];
    }
  }
  return { evenVals, oddVals };
}

// -- the base 8-sparse trial and the two pure-tail cofactor kernels (imp-97134 / imp-97354) --
const EVEN_TAIL_DEG = [8, 10, 12, 14];
const ODD_TAIL_DEG = [9, 11, 13, 15];
const EVEN_TAIL_KER = kernel3x4(EVEN_TAIL_DEG.map((k) => IMP97113_FUNCTIONALS.evenRow(k)));
const ODD_TAIL_KER = kernel3x4(ODD_TAIL_DEG.map((k) => IMP97113_FUNCTIONALS.oddRow(k)));

const BASE_DK = Object.freeze({ ...IMP97134_TRIALS.even, ...IMP97134_TRIALS.odd });
const BASE_POLY = assemble(BASE_DK);
const C_FAR_BASE = routeCConstant(BASE_POLY.s, BASE_POLY.c, ZFAR);

// per-unit z^-3 contribution of each parity kernel (even -> c_3, odd -> s_3; the parity split of order z^-3).
function tailMap(deg, ker, lambda) {
  const d = {};
  deg.forEach((k, i) => (d[k] = lambda * ker[i]));
  return d;
}
const EVEN_UNIT = assemble(tailMap(EVEN_TAIL_DEG, EVEN_TAIL_KER, 1));
const ODD_UNIT = assemble(tailMap(ODD_TAIL_DEG, ODD_TAIL_KER, 1));

// scale each kernel to CANCEL the base z^-3 contribution exactly -> |s_3| + |c_3| driven to its global min 0.
const LAM_EVEN = -BASE_POLY.c[3] / EVEN_UNIT.c[3];
const LAM_ODD = -BASE_POLY.s[3] / ODD_UNIT.s[3];

const MIN_DK = (() => {
  const d = { ...BASE_DK };
  EVEN_TAIL_DEG.forEach((k, i) => (d[k] = (d[k] || 0) + LAM_EVEN * EVEN_TAIL_KER[i]));
  ODD_TAIL_DEG.forEach((k, i) => (d[k] = (d[k] || 0) + LAM_ODD * ODD_TAIL_KER[i]));
  return Object.freeze(d);
})();
const MIN_POLY = assemble(MIN_DK);
const C_FAR_MIN = routeCConstant(MIN_POLY.s, MIN_POLY.c, ZFAR);

const MIN_ABS_S3C3 = Math.abs(MIN_POLY.s[3]) + Math.abs(MIN_POLY.c[3]);
const BASE_ABS_S3C3 = Math.abs(BASE_POLY.s[3]) + Math.abs(BASE_POLY.c[3]);
const CARRIER_RES_MIN = carrierResidual(MIN_DK);
const MIN_LEADS_ZERO = [0, 1, 2].every(
  (m) => Math.abs(MIN_POLY.s[m]) < 1e-6 && Math.abs(MIN_POLY.c[m]) < 1e-6,
);
const M4_TERM = (Math.abs(MIN_POLY.s[4]) + Math.abs(MIN_POLY.c[4])) * Math.pow(ZFAR, -1);

// decay-order check: |g| z^4 -> 0 (decreasing) while |g| z^5 stays bounded => minimizer g = O(z^-5).
const DECAY = (() => {
  const zs = [400, 800, 1600, 3200];
  const gz4 = zs.map((z) => Math.abs(gTrue(MIN_DK, z)) * z ** 4);
  const gz5 = zs.map((z) => Math.abs(gTrue(MIN_DK, z)) * z ** 5);
  const gz4Decreasing = gz4[0] > gz4[gz4.length - 1];
  const gz5Bounded = Math.max(...gz5) / Math.min(...gz5) < 5; // ~1e6 across the ladder, no growth
  return { gz4, gz5, gz4Decreasing, gz5Bounded };
})();

export const IMP97377_MEASUREMENT = Object.freeze({
  aRung: a,
  Tfar: TFAR,
  Zfar: ZFAR,
  baseTrial: BASE_DK,
  evenTailKernel: Object.freeze({ degrees: EVEN_TAIL_DEG, coeffs: EVEN_TAIL_KER }),
  oddTailKernel: Object.freeze({ degrees: ODD_TAIL_DEG, coeffs: ODD_TAIL_KER }),
  lamEven: LAM_EVEN, // ~1.6781e-3 (real scaling of even kernel to cancel c_3)
  lamOdd: LAM_ODD, // ~1.4293e-2 (real scaling of odd kernel to cancel s_3)
  minimizerTrial: MIN_DK, // base + lamEven*evenKernel + lamOdd*oddKernel (real coefficients)
  s3Base: BASE_POLY.s[3], // 45045
  c3Base: BASE_POLY.c[3], // 3465
  s3Min: MIN_POLY.s[3], // ~0 (float residual ~1e-10)
  c3Min: MIN_POLY.c[3], // 0
  absS3C3Base: BASE_ABS_S3C3, // 48510
  absS3C3Min: MIN_ABS_S3C3, // ~0 (global minimum)
  sixCarriersAnnihilated: MIN_LEADS_ZERO, // s_0..2 = c_0..2 = 0 still holds
  carrierResidualMin: CARRIER_RES_MIN, // all six functionals ~0 (float ~1e-14)
  cFarBaseline: C_FAR_BASE, // ~48524.3 (imp-97337 8-sparse)
  cFarRelaxedRepresentative: 5.18e6, // imp-97354 generic relaxed member
  cFarMin: C_FAR_MIN, // ~99.37 (m=4 floor)
  cFarMinM4Term: M4_TERM, // ~99.25 (the dominant surviving order (|s_4|+|c_4|) Zfar^-1)
  tighteningVsBaseline: C_FAR_MIN / C_FAR_BASE, // ~0.00205 (~488x tighter)
  tighteningVsRelaxed: C_FAR_MIN / 5.18e6, // ~1.9e-5 (~52000x tighter)
  minimizerDecayGz4: DECAY.gz4, // |g| z^4 decreasing => faster than z^-4
  minimizerDecayGz5: DECAY.gz5, // |g| z^5 bounded => g = O(z^-5)
  minimizerIsOrderFive: DECAY.gz4Decreasing && DECAY.gz5Bounded,
});

export const IMP97377_VERDICT = Object.freeze({
  ticket: 'imp-97377',
  question:
    'search the imp-97113 6-carrier-functional 94-dim relaxed v0 family for the member minimizing the m=3 assembled coefficient |s_3|+|c_3| (the imp-97354 driver of the ~5.18e6 Route C far-tail constant) and quantify the tightest achievable Route C constant.',
  answer:
    'The m=3 coefficients s_3, c_3 decouple by parity exactly like the six carrier functionals: c_3 receives contributions ONLY from even degrees, s_3 ONLY from odd degrees, via the single odd DLMF power a_3(k) of each degree k >= 3. The base trial gives s_3 = 45045, c_3 = 3465 (|s_3|+|c_3| = 48510); each imp-97354 pure-tail cofactor kernel maps NONTRIVIALLY onto its z^-3 coefficient (even kernel -> c_3 at -2064825/unit, odd kernel -> s_3 at -3151575/unit) while keeping all six carriers zero, so a real multiple of it cancels the base contribution exactly. Scaling the even kernel by lamEven ~1.6781e-3 and the odd kernel by lamOdd ~1.4293e-2 gives the family member with s_3 = c_3 = 0 EXACTLY (|s_3|+|c_3| driven to its GLOBAL minimum 0). This GAINS an extra decay order -- g = O(z^-5) (|g| z^4 decreases 2824 -> 346 over z=400..3200 while |g| z^5 stays bounded ~1e6) -- and COLLAPSES the Route C far-tail constant to C_far ~99.37 (now dominated by the m=4 order (|s_4|+|c_4|) Zfar^-1 ~99.25), a factor ~488x TIGHTER than the 8-sparse baseline 48524.3 and ~52000x tighter than the imp-97354 generic relaxed member ~5.18e6. HONEST READING: essentially ALL of the imp-97354 gap (and more) is recoverable at the DEGREE level, because killing the free s_3, c_3 buys an extra order of decay; the residual to the true infimum is the m=4/higher tail (more tail DOF could push C_far toward the m=5 floor ~0.13), and this uses REAL (non-integer) tail scalings -- a real-coefficient degree-level stand-in, not an integer rational trial and not a committed v0. Certifying the tail of an actual committed v0 still needs two-sided c_{jk} interval control (IMP97015_ARB_INTERVAL_BESSEL).',
  // what IS measured
  s3c3DecoupleByParity: true,
  minAbsS3C3IsZero: MIN_ABS_S3C3 < 1e-6, // global minimum reached exactly
  sixCarriersStillAnnihilated: MIN_LEADS_ZERO,
  minimizerGainsExtraDecayOrder: IMP97377_MEASUREMENT.minimizerIsOrderFive, // g = O(z^-5)
  cFarBaseline: C_FAR_BASE,
  cFarMin: C_FAR_MIN,
  tighteningVsBaseline: C_FAR_MIN / C_FAR_BASE, // ~0.00205
  tighteningVsRelaxed: C_FAR_MIN / 5.18e6, // ~1.9e-5
  cFarNowDominatedByM4: M4_TERM / C_FAR_MIN > 0.99, // m=4 order is the surviving floor
  // honest scope
  committedV0Produced: false, // real-coefficient degree-level stand-in, not a committed near-optimal v0
  usesRealNonIntegerScalings: true, // lamEven, lamOdd real -> not an integer rational trial
  higherTailNotMinimized: true, // only |s_3|+|c_3| minimized; m>=4 floor could go lower with more DOF
  twoSidedCjkIntervalControlOpen: 'IMP97015_ARB_INTERVAL_BESSEL', // needed for an actual committed v0 tail
  intervalMajorantProduced: false,
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97354 residual MEASURED: the 94-dim relaxed family member minimizing |s_3|+|c_3| drives it to EXACTLY 0 (s_3, c_3 decouple by parity and each imp-97354 tail cofactor kernel maps nontrivially onto its z^-3 coefficient, so real scalings lamEven ~1.6781e-3 / lamOdd ~1.4293e-2 cancel the base contribution), gaining an extra decay order (g = O(z^-5)) and collapsing the Route C far-tail constant to ~99.37 (m=4 floor (|s_4|+|c_4|) Zfar^-1 ~99.25) -- ~488x tighter than the 8-sparse baseline 48524.3 and ~52000x tighter than the imp-97354 representative ~5.18e6. So essentially all of the imp-97354 looseness (and more) is recoverable at the degree level. Residuals: the m=4/higher tail is not itself minimized (more tail DOF could reach the m=5 floor ~0.13), the minimizer uses REAL non-integer scalings (a degree-level stand-in, not an integer rational trial, no committed v0), and certifying the tail of a committed v0 still needs two-sided c_{jk} interval control (IMP97015_ARB_INTERVAL_BESSEL). No committed v0, no interval majorant, no bound change.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97377_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97377_ASSERTIONS = [
  {
    id: 'imp97377-baseline-and-parity-decoupling',
    holds: () => {
      // base coefficients match imp-97354; s_3 fed by odd degrees only, c_3 by even degrees only.
      const baseOk = BASE_POLY.s[3] === 45045 && BASE_POLY.c[3] === 3465 && BASE_ABS_S3C3 === 48510;
      const evenFeedsC3Only = EVEN_UNIT.s[3] === 0 && EVEN_UNIT.c[3] !== 0;
      const oddFeedsS3Only = ODD_UNIT.c[3] === 0 && ODD_UNIT.s[3] !== 0;
      return baseOk && evenFeedsC3Only && oddFeedsS3Only;
    },
    why: 'the base 8-sparse trial gives s_3 = 45045 (odd degrees), c_3 = 3465 (even degrees), |s_3|+|c_3| = 48510 (matching imp-97354), and the z^-3 order decouples by parity -- the even tail kernel feeds c_3 only, the odd tail kernel feeds s_3 only -- so each parity can cancel its own base contribution independently.',
  },
  {
    id: 'imp97377-minimizer-drives-s3c3-to-zero',
    holds: () =>
      MIN_ABS_S3C3 < 1e-6 &&
      MIN_ABS_S3C3 < BASE_ABS_S3C3 &&
      CARRIER_RES_MIN.evenVals.every((v) => Math.abs(v) < 1e-6) &&
      CARRIER_RES_MIN.oddVals.every((v) => Math.abs(v) < 1e-6) &&
      MIN_LEADS_ZERO,
    why: 'scaling the even/odd tail kernels by lamEven ~1.6781e-3 / lamOdd ~1.4293e-2 cancels the base s_3, c_3 exactly, so |s_3|+|c_3| reaches its global minimum 0 (float ~1e-10) while all six carriers stay annihilated and s_0..2 = c_0..2 = 0.',
  },
  {
    id: 'imp97377-minimizer-gains-extra-decay-order',
    holds: () =>
      IMP97377_MEASUREMENT.minimizerIsOrderFive === true &&
      DECAY.gz4Decreasing === true &&
      DECAY.gz5Bounded === true,
    why: 'killing the z^-3 order makes g decay one order faster: |g| z^4 decreases (2824 -> 346 over z=400..3200) while |g| z^5 stays bounded (~1e6, no growth), so the minimizer is g = O(z^-5).',
  },
  {
    id: 'imp97377-routec-constant-collapses',
    holds: () =>
      C_FAR_MIN > 90 &&
      C_FAR_MIN < 110 &&
      C_FAR_MIN / C_FAR_BASE < 0.01 &&
      C_FAR_MIN / 5.18e6 < 1e-4 &&
      M4_TERM / C_FAR_MIN > 0.99,
    why: 'the Route C far-tail constant collapses to ~99.37, ~488x tighter than the 8-sparse baseline 48524.3 and ~52000x tighter than the imp-97354 relaxed member ~5.18e6, and is now dominated (>99%) by the m=4 order (|s_4|+|c_4|) Zfar^-1 -- the surviving floor once the z^-3 order is annihilated.',
  },
  {
    id: 'imp97377-search-only-no-qed',
    holds: () =>
      IMP97377_VERDICT.minAbsS3C3IsZero === true &&
      IMP97377_VERDICT.minimizerGainsExtraDecayOrder === true &&
      IMP97377_VERDICT.committedV0Produced === false &&
      IMP97377_VERDICT.usesRealNonIntegerScalings === true &&
      IMP97377_VERDICT.higherTailNotMinimized === true &&
      IMP97377_VERDICT.twoSidedCjkIntervalControlOpen === 'IMP97015_ARB_INTERVAL_BESSEL' &&
      IMP97377_VERDICT.intervalMajorantProduced === false &&
      IMP97377_VERDICT.operatorPositivityProved === false &&
      IMP97377_VERDICT.boundChanged === false &&
      IMP97377_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97377_VERDICT.qed === false &&
      typeof IMP97377_VERDICT.subGap === 'string' &&
      IMP97377_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'search/measurement only: the family minimizer of |s_3|+|c_3| is found at the degree level with real scalings (a stand-in, not a committed integer v0), the higher tail is not itself minimized, two-sided c_{jk} interval control stays open, no interval majorant, Rayleigh floor stays an UPPER bound, no bound moves, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97377_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97377-krein-routec-family-min-s3c3-minimizer assertion failed: ${t.id}`);
  }
}
