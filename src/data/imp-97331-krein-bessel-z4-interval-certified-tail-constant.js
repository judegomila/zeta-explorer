/**
 * @module imp-97331-krein-bessel-z4-interval-certified-tail-constant
 *
 * imp-97331 (numerical): PORT the imp-97312 pointwise Krein tail constant C_ptwise = sup_{z>=Z0} F(z),
 * F(z) = sqrt(Atil(z)^2 + Btil(z)^2), to INTERVAL ARITHMETIC to produce a rigorously CERTIFIED single
 * z^-4 tail constant, and verify the supremum is attained at the tail edge z = Z0.
 *
 * WHAT imp-97312 LEFT OPEN. imp-97294 collapsed each spherical-Bessel order j into one harmonic
 * P_j cos z + Q_j sin z with P_j, Q_j EXACT INTEGERS, and by Cauchy-Schwarz on the single {cos z, sin z}
 * pair the z^4-scaled combined remainder obeys
 *
 *   | SUM_k d_k R_k(z) | z^4  <=  F(z) := sqrt( Atil(z)^2 + Btil(z)^2 ),
 *       Atil(z) = SUM_{j=3}^7 P_j z^-(j-3),   Btil(z) = SUM_{j=3}^7 Q_j z^-(j-3).
 *
 * imp-97312 reduced this to the single constant C_ptwise = sup_{z>=Z0} F(z) ~= 4.5504e4, but it evaluated
 * F(z) in IEEE double precision over a coarse z-scan, so it produced NO interval majorant: the supremum
 * was measured, not certified. That was its stated residual.
 *
 * THE CERTIFICATION (the deliverable). Atil, Btil are polynomials in u = 1/z with EXACT-INTEGER
 * coefficients (P_3..P_7, Q_3..Q_7 all satisfy P_j = round(P_j) exactly in IEEE double, |P_j|,|Q_j| < 2^53,
 * so they are exact), evaluated over u in [0, u0], u0 = 1/Z0 (the whole tail z in [Z0, inf) maps to
 * u in (0, u0], and u = 0 is z = inf). We interval-evaluate F over a partition of [0, u0] into N equal
 * panels using a self-contained outward-rounded interval type (each +, -, x result is widened by one ULP
 * outward via a bit-level nextUp / nextDown, which is rigorous because IEEE round-to-nearest arithmetic
 * has error at most half a ULP; sqrt likewise). Interval Horner on each panel [u_lo, u_hi] gives a rigorous
 * enclosure of Atil, Btil there; the per-panel upper bound of F is sqrt of the outward sum of the squared
 * magnitudes. The panel maxima tile the tail, so
 *
 *   C_certified := max over panels of the interval upper bound of F   >=   sup_{z >= Z0} F(z)
 *
 * is a RIGOROUS single z^-4 tail constant: | SUM_k d_k R_k(z) | <= z^-4 C_certified for all z >= Z0
 * (given the imp-97294/97312 exact P/Q collapse and the Cauchy-Schwarz step, which are exact algebra).
 *
 * At N = 50000, C_certified ~= 45504.154 (only ~1.0000007x above the imp-97312 IEEE value 45504.120 and
 * ~1.00046x above the imp-97312 measured true peak 4.5484e4 -- the tiny excess over the IEEE value is the
 * panel-resolution and ULP-widening slack, both shrinking like 1/N). The per-panel argmax is the LAST panel
 * (the one adjacent to u = u0, i.e. z = Z0), and an interval LOWER bound of F evaluated at the single edge
 * point z = Z0 gives Fedge_lower ~= 45504.1205, so the true supremum is rigorously ENCLOSED,
 *
 *   sup_{z >= Z0} F(z)  in  [ Fedge_lower , C_certified ]  =  [ 45504.1205 , 45504.154 ]   (relative width ~7e-7),
 *
 * which certifies both the single constant AND that the supremum sits at the tail edge z = Z0 (the enclosure
 * pins it to the edge point within the panel resolution). Refining N tightens C_certified monotonically
 * downward toward Fedge_lower, as an upper bound must.
 *
 * NET. The imp-97312 pointwise single constant is now interval-CERTIFIED: C_certified ~= 45504.154 is a
 * rigorous upper bound for sup_{z>=Z0} sqrt(Atil^2+Btil^2), the exact-integer coefficient claim is verified,
 * and the supremum is certified to lie at the tail edge z = Z0 via a matching interval lower bound. This is a
 * rigor upgrade of the imp-97312 remainder-envelope constant only -- it changes no bound: the Cauchy-Schwarz
 * step and the P/Q order-collapse are inherited exact algebra, and imp-97227 Obstruction B (the degree-to-v0
 * overlap inversion d = C^T v0, imp-97164) stays open, so Route B does not close on the remainder bound alone.
 * Interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97312-krein-bessel-z4-pointwise-single-constant.js (the IEEE-double C_ptwise this certifies)
 * @see imp-97294-krein-bessel-z4-coherent-jfreq-majorant.js (the coherent P_j,Q_j across-order construction)
 * @see imp-97227-krein-interval-annihilation-certificate.js (Obstruction B still open)
 *
 * Ticket: imp-97331 (numerical, opus-4-8, medium). Certification/derivation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: two light literal imports (imp-97134 trials, imp-97312 IEEE constant for cross-check), no zeros bundle.
 */

import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';
import { IMP97312_POINTWISE_CONSTANT } from './imp-97312-krein-bessel-z4-pointwise-single-constant.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung
const T_FARTAIL = 100; // representative far-tail cutoff (same as imp-97312)
const Z0 = a * T_FARTAIL; // ~= 54.9306
const U0 = 1 / Z0; // tail in u = 1/z is [0, U0]; z >= Z0 <=> 0 < u <= U0

// -- reconstruct the exact-integer harmonic coefficients P_j, Q_j (imp-97294/97312 construction) --
const D = Object.freeze({ ...IMP97134_TRIALS.even, ...IMP97134_TRIALS.odd });
function aCoeff(k, j) {
  if (j < 0 || j > k) return 0;
  let num = 1;
  for (let i = k - j + 1; i <= k + j; i++) num *= i; // (k+j)!/(k-j)!
  let den = Math.pow(2, j);
  for (let i = 2; i <= j; i++) den *= i; // 2^j j!
  return num / den;
}
const cosK = (k) => [1, 0, -1, 0][((k % 4) + 4) % 4];
const sinK = (k) => [0, 1, 0, -1][((k % 4) + 4) % 4];
function harmonicPQ(j) {
  let P = 0;
  let Q = 0;
  for (let k = 3; k <= 7; k++) {
    const w = (D[k] ?? 0) * Math.pow(-1, Math.floor(j / 2)) * aCoeff(k, j);
    if (w === 0) continue;
    if (j % 2 === 0) {
      P += w * -sinK(k);
      Q += w * cosK(k);
    } else {
      P += w * cosK(k);
      Q += w * sinK(k);
    }
  }
  return { j, P, Q };
}
const PQ = Object.freeze([3, 4, 5, 6, 7].map(harmonicPQ));
// Horner coefficient lists in u = 1/z, highest power (j=7 -> u^4) first down to constant (j=3 -> u^0).
const Pcoef = Object.freeze([PQ[4].P, PQ[3].P, PQ[2].P, PQ[1].P, PQ[0].P]);
const Qcoef = Object.freeze([PQ[4].Q, PQ[3].Q, PQ[2].Q, PQ[1].Q, PQ[0].Q]);

// -- self-contained outward-rounded interval arithmetic (one-ULP widening, rigorous for IEEE round-to-nearest) --
const F64 = new Float64Array(1);
const U32 = new Uint32Array(F64.buffer); // [low, high] words of the double
function nextUp(x) {
  if (Number.isNaN(x) || x === Infinity) return x;
  if (x === 0) return Number.MIN_VALUE; // smallest positive subnormal
  F64[0] = x;
  if (x > 0) {
    if (U32[0] === 0xffffffff) {
      U32[0] = 0;
      U32[1] += 1;
    } else {
      U32[0] += 1;
    }
  } else {
    if (U32[0] === 0) {
      U32[0] = 0xffffffff;
      U32[1] -= 1;
    } else {
      U32[0] -= 1;
    }
  }
  return F64[0];
}
const nextDown = (x) => -nextUp(-x);
// Interval as [lo, hi]. Each op widens outward by one ULP so the true value is always enclosed.
const iAdd = (A, B) => [nextDown(A[0] + B[0]), nextUp(A[1] + B[1])];
function iMul(A, B) {
  const p0 = A[0] * B[0];
  const p1 = A[0] * B[1];
  const p2 = A[1] * B[0];
  const p3 = A[1] * B[1];
  return [nextDown(Math.min(p0, p1, p2, p3)), nextUp(Math.max(p0, p1, p2, p3))];
}
// Upper / lower bounds of A^2 for an interval A (tighter than iMul(A,A)).
function sqrHi(A) {
  const m = Math.max(Math.abs(A[0]), Math.abs(A[1]));
  return nextUp(m * m);
}
function sqrLo(A) {
  if (A[0] <= 0 && A[1] >= 0) return 0; // interval straddles 0
  const m = Math.min(Math.abs(A[0]), Math.abs(A[1]));
  return nextDown(m * m);
}
// Interval Horner: evaluate a polynomial (coefs high power -> low) at the interval u = [ulo, uhi].
function hornerI(coefs, u) {
  let acc = [coefs[0], coefs[0]];
  for (let i = 1; i < coefs.length; i++) acc = iAdd(iMul(acc, u), [coefs[i], coefs[i]]);
  return acc;
}

// Certified upper bound of sup_{z>=Z0} F over a partition of u in [0, U0] into N panels, plus the argmax panel.
function certifiedSup(N) {
  let sup = 0;
  let argmax = -1;
  for (let i = 0; i < N; i++) {
    const ulo = (U0 * i) / N;
    const uhi = (U0 * (i + 1)) / N;
    const u = [ulo, uhi];
    const AI = hornerI(Pcoef, u);
    const BI = hornerI(Qcoef, u);
    const fHi = nextUp(Math.sqrt(nextUp(sqrHi(AI) + sqrHi(BI)))); // upper bound of sqrt(A^2+B^2) on this panel
    if (fHi > sup) {
      sup = fHi;
      argmax = i;
    }
  }
  return { sup, argmax, N };
}
// Rigorous lower bound of F at the single tail-edge point z = Z0 (u = U0).
function edgeLower() {
  const AI = hornerI(Pcoef, [U0, U0]);
  const BI = hornerI(Qcoef, [U0, U0]);
  return nextDown(Math.sqrt(nextDown(sqrLo(AI) + sqrLo(BI))));
}

const N_PANELS = 50000;
const { sup: C_CERTIFIED, argmax: ARGMAX } = certifiedSup(N_PANELS);
const FEDGE_LOWER = edgeLower();
const C_PTWISE_IEEE = IMP97312_POINTWISE_CONSTANT.C_ptwise;
const MEASURED_PEAK = IMP97312_POINTWISE_CONSTANT.measuredPeak;

export const IMP97331_INTERVAL_TAIL_CONSTANT = Object.freeze({
  aRung: a,
  T: T_FARTAIL,
  Z0,
  U0, // tail edge in u = 1/z
  Npanels: N_PANELS,
  Pcoef, // exact-integer coefficients of Atil in u (high power -> low)
  Qcoef, // exact-integer coefficients of Btil in u
  C_certified: C_CERTIFIED, // rigorous interval upper bound of sup_{z>=Z0} F ~= 45504.154
  Fedge_lower: FEDGE_LOWER, // rigorous interval lower bound of F at z=Z0 ~= 45504.1205
  supEnclosure: [FEDGE_LOWER, C_CERTIFIED], // certified enclosure of the tail supremum
  enclosureRelWidth: (C_CERTIFIED - FEDGE_LOWER) / C_CERTIFIED, // ~7e-7
  argmaxPanel: ARGMAX, // = N-1: the panel adjacent to u=U0, i.e. the tail edge z=Z0
  supAtTailEdge: ARGMAX === N_PANELS - 1, // certified: supremum panel is the tail edge
  C_ptwise_IEEE: C_PTWISE_IEEE, // imp-97312 double-precision value being certified
  certifiedOverIEEE: C_CERTIFIED / C_PTWISE_IEEE, // ~1.0000007 (>1: a rigorous majorant)
  slackOverMeasuredPeak: C_CERTIFIED / MEASURED_PEAK, // ~1.00046 (imp-97312 peak 4.5484e4)
});

export const IMP97331_VERDICT = Object.freeze({
  ticket: 'imp-97331',
  question:
    'port the imp-97312 pointwise Krein tail constant C_ptwise = sup_{z>=Z0} sqrt(Atil(z)^2+Btil(z)^2) (Atil,Btil exact-integer polynomials in 1/z, evaluated in IEEE double by imp-97312) to interval arithmetic, producing a rigorously CERTIFIED single z^-4 tail constant, and verify the supremum is attained at the tail edge Z0.',
  answer:
    'The exact-integer coefficients P_3..P_7, Q_3..Q_7 make Atil, Btil polynomials in u=1/z with u in [0,U0], U0=1/Z0. Interval-evaluating F=sqrt(Atil^2+Btil^2) over a partition of [0,U0] into N=50000 panels with a self-contained outward-rounded (one-ULP) interval type yields C_certified = max panel upper bound >= sup_{z>=Z0} F(z) ~= 45504.154, a RIGOROUS single z^-4 tail constant (only ~1.0000007x above the imp-97312 IEEE value 45504.120, the excess being panel + ULP slack that shrinks like 1/N). The argmax panel is the LAST one (adjacent to u=U0, z=Z0), and an interval lower bound of F at the single edge point z=Z0 gives Fedge_lower ~= 45504.1205, so sup lies in the certified enclosure [45504.1205, 45504.154] (relative width ~7e-7): the supremum is certified to sit at the tail edge z=Z0. This upgrades the imp-97312 measured constant to interval-certified; it changes no bound (Cauchy-Schwarz + P/Q collapse are inherited exact algebra), and imp-97227 Obstruction B (d=C^T v0, imp-97164) stays open, so Route B does not close on the remainder bound alone.',
  // What IS delivered.
  certifiedTailConstant: C_CERTIFIED,
  supEnclosure: [FEDGE_LOWER, C_CERTIFIED],
  supAtTailEdge: ARGMAX === N_PANELS - 1,
  exactIntegerCoefficients: true,
  intervalMajorantProduced: true, // the imp-97312 residual is resolved: rigorous interval envelope of the sup
  // What is NOT delivered (honest scope).
  operatorPositivityProved: false,
  fixedRationalV0OrderFourCertified: false,
  obstructionBStillOpen: 'imp-97164 degree-to-v0 overlap inversion d = C^T v0 (interval overlaps c_jk)',
  boundChanged: false,
  subGap:
    'The imp-97312 pointwise single tail constant is interval-certified: C_certified = max-panel interval upper bound ~= 45504.154 rigorously bounds sup_{z>=Z0} sqrt(Atil^2+Btil^2), the exact-integer coefficients are verified, and the supremum is certified at the tail edge z=Z0 by a matching interval lower bound (enclosure relative width ~7e-7). This certifies only the imp-97294/97312 remainder ENVELOPE constant: the Cauchy-Schwarz {cos z,sin z} step and the P/Q order-collapse remain inherited exact algebra, no operator positivity is proved, and imp-97227 Obstruction B (the degree-to-v0 overlap inversion d=C^T v0, imp-97164) still needs interval overlaps c_jk, so Route B does not close on the remainder bound alone.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97331_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97331_ASSERTIONS = [
  {
    id: 'imp97331-coefficients-exact-integers',
    holds: () =>
      PQ.every(({ P, Q }) => P === Math.round(P) && Q === Math.round(Q) && Math.abs(P) < 2 ** 53 && Math.abs(Q) < 2 ** 53),
    why: 'the harmonic coefficients P_j, Q_j are exact integers in IEEE double (|.| < 2^53), so treating them as point intervals in the interval Horner is exact -- the certification has no coefficient rounding.',
  },
  {
    id: 'imp97331-certified-is-rigorous-upper-bound',
    holds: () => {
      // C_certified must be a genuine upper bound: >= the imp-97312 IEEE constant and >= a fine IEEE scan of F,
      // and only marginally above (panel+ULP slack), never below.
      if (!(Number.isFinite(C_CERTIFIED) && C_CERTIFIED > C_PTWISE_IEEE)) return false;
      if (!(C_CERTIFIED / C_PTWISE_IEEE < 1.0001)) return false;
      // independent double-precision scan of F(z) = sqrt(Atil^2+Btil^2) must never exceed C_certified.
      for (let z = Z0; z <= 20000; z += 1.7) {
        let A = 0;
        let B = 0;
        for (const { j, P, Q } of PQ) {
          const w = Math.pow(z, -(j - 3));
          A += P * w;
          B += Q * w;
        }
        if (Math.hypot(A, B) > C_CERTIFIED) return false;
      }
      return true;
    },
    why: 'C_certified = max-panel outward-rounded upper bound is a rigorous majorant: it exceeds the imp-97312 IEEE constant by only panel+ULP slack (<1.0001x) and dominates an independent fine IEEE scan of F on the tail.',
  },
  {
    id: 'imp97331-sup-certified-at-tail-edge',
    holds: () => {
      // The argmax panel is the last (adjacent to u=U0, z=Z0), and the interval lower bound at the edge point
      // encloses the sup tightly, certifying the supremum sits at the tail edge z=Z0.
      if (ARGMAX !== N_PANELS - 1) return false;
      if (!(FEDGE_LOWER > 0 && FEDGE_LOWER <= C_CERTIFIED)) return false;
      const relWidth = (C_CERTIFIED - FEDGE_LOWER) / C_CERTIFIED;
      return relWidth > 0 && relWidth < 1e-5;
    },
    why: 'the per-panel supremum is the last panel (the tail edge z=Z0) and a matching interval lower bound at the edge point encloses the true sup to relative width ~7e-7, certifying the supremum is at z=Z0.',
  },
  {
    id: 'imp97331-refinement-tightens-upper-bound',
    holds: () => {
      // As an upper bound must, refining the partition lowers (never raises) C_certified, staying above Fedge_lower.
      const coarse = certifiedSup(5000).sup;
      const fine = certifiedSup(100000).sup;
      return fine <= C_CERTIFIED && C_CERTIFIED <= coarse && fine >= FEDGE_LOWER;
    },
    why: 'a partition-based interval upper bound tightens monotonically downward under refinement toward the true sup, and every level stays a rigorous upper bound at or above the edge lower bound.',
  },
  {
    id: 'imp97331-certification-only-no-qed',
    holds: () =>
      IMP97331_VERDICT.intervalMajorantProduced === true &&
      IMP97331_VERDICT.operatorPositivityProved === false &&
      IMP97331_VERDICT.fixedRationalV0OrderFourCertified === false &&
      IMP97331_VERDICT.boundChanged === false &&
      IMP97331_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97331_VERDICT.qed === false &&
      typeof IMP97331_VERDICT.subGap === 'string' &&
      IMP97331_VERDICT.subGap.includes('Obstruction B'),
    why: 'this certifies only the imp-97312 remainder-envelope constant via interval arithmetic: interval majorant produced, but no operator positivity, no rational-v0 certificate, no bound change, reach stays 2a<=0.96, Obstruction B open, no QED.',
  },
];

for (const t of IMP97331_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97331-krein-bessel-z4-interval-certified-tail-constant assertion failed: ${t.id}`);
  }
}
