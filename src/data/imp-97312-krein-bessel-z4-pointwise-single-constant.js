/**
 * @module imp-97312-krein-bessel-z4-pointwise-single-constant
 *
 * imp-97312 (numerical): INTEGRATE the imp-97294 fully-coherent POINTWISE z-dependent remainder bound into a
 * single closed tail constant by taking its supremum over the tail z >= Z0, and quantify the residual slack
 * against the measured peak. imp-97294 tightened the imp-97263 incoherent z^-4 majorant ~3.84x by regrouping
 * each order j into one harmonic P_j cos z + Q_j sin z (P_j, Q_j exact integers), then bounding across orders
 * by the triangle step SUM_j amp_j Z0^-(j-3) = C_coh ~= 5.409e4, leaving ~1.19x slack from that ONE step. The
 * pointwise form it exported for reference removes that step but is z-dependent; here it is turned into a
 * rigorous single constant.
 *
 * THE POINTWISE FORM (imp-97294 lines 41-42). Collecting the two frequencies across all orders,
 *
 *   SUM_k d_k R_k(z) = (1/z) [ cos z * A(z) + sin z * B(z) ],   A(z) = SUM_{j=3}^7 P_j z^-j,  B(z) = SUM_{j=3}^7 Q_j z^-j,
 *
 * so by Cauchy-Schwarz on the single {cos z, sin z} pair, POINTWISE in z,
 *
 *   | SUM_k d_k R_k(z) | z^4  <=  F(z) := sqrt( Atil(z)^2 + Btil(z)^2 ),   Atil = SUM_j P_j z^-(j-3),  Btil = SUM_j Q_j z^-(j-3).
 *
 * This is the imp-97294 pointwise bound written on the z^4-scaled remainder. Atil, Btil are polynomials in 1/z
 * with Atil(inf) = P_3, Btil(inf) = Q_3, so F(inf) = amp_3 = sqrt(P_3^2+Q_3^2) ~= 45178 (the leading floor).
 *
 * THE SINGLE CONSTANT (the deliverable). A uniform tail constant is the supremum of F over the tail:
 *
 *   C_ptwise(Z0) := sup_{z >= Z0} sqrt( Atil(z)^2 + Btil(z)^2 )  =>  | SUM_k d_k R_k(z) | <= z^-4 C_ptwise(Z0),  z >= Z0.
 *
 * On the vector partial sums (Atil, Btil) the sup is a VECTOR magnitude with the actual signs of (P_j, Q_j),
 * whereas C_coh = SUM_j |(P_j,Q_j)| Z0^-(j-3) took the triangle inequality on that same vector. Because the
 * (P_j, Q_j) partly cancel, C_ptwise < C_coh. Numerically F(z) is monotone DECREASING on [Z0, inf) at
 * Z0 = (ln 3 / 2) * 100, so the sup is attained at the tail EDGE z = Z0:
 *
 *   C_ptwise = F(Z0) ~= 4.5504e4   vs   C_coh ~= 5.4088e4   (a further 1.189x tightening of the single constant),
 *
 * and the true peak of | SUM_k d_k R_k(z) | z^4 on the tail is ~4.5484e4 (at z ~= 57.87, just interior to Z0).
 * Hence the pointwise single constant leaves only
 *
 *   slack  =  C_ptwise / measured_peak  ~=  1.00044   (0.044%),   down from C_coh / measured_peak ~= 1.189.
 *
 * The residual ~0.044% is now purely the gap between the tail-edge supremum F(Z0) and the interior true peak
 * (the true remainder's phase cos z, sin z does not align with the Cauchy-Schwarz envelope exactly at Z0); it is
 * NOT a further triangle-inequality loss -- the across-order triangle step is eliminated. So the pointwise form,
 * reduced to sup_{z>=Z0} F, is essentially tight against the measured peak: the imp-97294 ~1.19x slack collapses
 * to ~1.0004x.
 *
 * NET. Integrating the imp-97294 pointwise coherent bound as C_ptwise = sup_{z>=Z0} sqrt(Atil^2+Btil^2) yields a
 * rigorous single z^-4 tail constant ~4.5504e4 -- a further 1.189x below the imp-97294 across-order constant C_coh
 * and only 1.00044x above the measured peak. This is a measurement of the achievable slack, not a new certificate:
 * it changes no bound, produces no interval majorant (F uses IEEE-double Bessel evaluation, not an interval
 * library), proves no operator positivity. imp-97227 Obstruction B (the degree-to-v0 overlap inversion d = C^T v0,
 * imp-97164) stays open; Route B does not close on the remainder bound alone. Interval-rigorous reach stays
 * 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97294-krein-bessel-z4-coherent-jfreq-majorant.js (the coherent across-order constant C_coh; exports P_j,Q_j)
 * @see imp-97263-krein-analytic-bessel-z4-remainder-majorant.js (the original incoherent triangle majorant)
 * @see imp-97227-krein-interval-annihilation-certificate.js (Obstruction B still open)
 *
 * Ticket: imp-97312 (numerical, opus-4-8, medium). Measurement only, RH-free; changes no bound; NO QED.
 *
 * Import-light: one light literal import (imp-97134 trials, via the imp-97294 P/Q construction), no zeros bundle.
 */

import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const T_FARTAIL = 100; // representative far-tail cutoff; the constant is a closed form of Z0 = a T for any T
const Z0 = a * T_FARTAIL; // ~= 54.9306

// Merged degree->coefficient map d_k for the annihilating trial (even {0,2,4,6}, odd {1,3,5,7}).
const D = Object.freeze({ ...IMP97134_TRIALS.even, ...IMP97134_TRIALS.odd });

// Exact Hankel coefficient a_j(k+1/2) = (k+j)!/(2^j j!(k-j)!); positive integer for 0<=j<=k, zero for j>k.
function aCoeff(k, j) {
  if (j < 0 || j > k) return 0;
  let num = 1;
  for (let i = k - j + 1; i <= k + j; i++) num *= i; // (k+j)!/(k-j)!
  let den = Math.pow(2, j);
  for (let i = 2; i <= j; i++) den *= i; // 2^j j!
  return num / den;
}

// Exact-integer frequency-basis coefficients of the phase shift, period 4 in k (imp-97294 construction).
const cosK = (k) => [1, 0, -1, 0][((k % 4) + 4) % 4]; // cos(k pi/2)
const sinK = (k) => [0, 1, 0, -1][((k % 4) + 4) % 4]; // sin(k pi/2)

// Per-order harmonic collapse: SUM_k d_k (-1)^floor(j/2) a_j(k) trig_{j,k}(z) = P_j cos z + Q_j sin z.
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
  return { j, P, Q, amp: Math.hypot(P, Q) };
}

const PQ = Object.freeze([3, 4, 5, 6, 7].map(harmonicPQ));

// Scaled partial-sum envelope F(z) = sqrt(Atil^2 + Btil^2), Atil = SUM_j P_j z^-(j-3), Btil = SUM_j Q_j z^-(j-3).
// This is the imp-97294 pointwise coherent bound written on the z^4-scaled remainder: |SUM_k d_k R_k(z)| z^4 <= F(z).
function Fenvelope(z) {
  let A = 0;
  let B = 0;
  for (const { j, P, Q } of PQ) {
    const w = Math.pow(z, -(j - 3));
    A += P * w;
    B += Q * w;
  }
  return Math.hypot(A, B);
}

// The single tail constant: C_ptwise = sup_{z>=Z0} F(z). F is monotone decreasing on [Z0,inf), so sup = F(Z0);
// a coarse scan confirms the edge is the maximizer (no interior spike).
function pointwiseConstant(Z0v) {
  let sup = 0;
  for (let z = Z0v; z <= Z0v + 5000; z += 0.01) {
    const f = Fenvelope(z);
    if (f > sup) sup = f;
  }
  return sup;
}

// imp-97294 across-order coherent constant C_coh(Z0) = SUM_j amp_j Z0^-(j-3), for the comparison ratio.
function coherentConstant(Z0v) {
  let c = 0;
  for (const { j, amp } of PQ) c += amp * Math.pow(Z0v, -(j - 3));
  return c;
}

// -- reference exact evaluator (used ONLY to measure the true peak; never for the constant) --
function jExact(k, z) {
  const phase = z - (k * Math.PI) / 2;
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  let A = 0;
  for (let m = 0; 2 * m <= k; m++) A += Math.pow(-1, m) * aCoeff(k, 2 * m) * Math.pow(z, -2 * m);
  let B = 0;
  for (let m = 0; 2 * m + 1 <= k; m++) B += Math.pow(-1, m) * aCoeff(k, 2 * m + 1) * Math.pow(z, -(2 * m + 1));
  return (s * A + c * B) / z;
}
function threeLeading(k, z) {
  const phase = z - (k * Math.PI) / 2;
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  let t = s * aCoeff(k, 0);
  if (k >= 1) t += c * aCoeff(k, 1) * Math.pow(z, -1);
  if (k >= 2) t += s * -aCoeff(k, 2) * Math.pow(z, -2);
  return t / z;
}
function combinationRemainder(z) {
  let r = 0;
  for (const kStr of Object.keys(D)) {
    const k = +kStr;
    r += D[k] * (jExact(k, z) - threeLeading(k, z));
  }
  return r;
}
function measuredPeak(Z0v) {
  let peak = 0;
  let at = Z0v;
  for (let z = Z0v; z <= 20000; z += 0.005) {
    const v = Math.abs(combinationRemainder(z)) * Math.pow(z, 4);
    if (v > peak) {
      peak = v;
      at = z;
    }
  }
  return { peak, at };
}

const C_ptwise = pointwiseConstant(Z0);
const C_coh = coherentConstant(Z0);
const { peak: MEASURED_PEAK, at: PEAK_AT } = measuredPeak(Z0);

export const IMP97312_POINTWISE_CONSTANT = Object.freeze({
  aRung: a,
  T: T_FARTAIL,
  Z0,
  Fedge: Fenvelope(Z0), // sup is attained at the tail edge (F monotone decreasing)
  Finfinity: PQ[0].amp, // F(inf) = amp_3 = sqrt(P_3^2+Q_3^2) ~= 45178
  C_ptwise, // sup_{z>=Z0} F(z) ~= 4.5504e4
  C_coh, // imp-97294 across-order coherent constant ~= 5.4088e4
  tightenOverCoherent: C_coh / C_ptwise, // ~= 1.189x further tightening of the single constant
  measuredPeak: MEASURED_PEAK, // ~= 4.5484e4
  measuredPeakAt: PEAK_AT, // ~= 57.87
  slackPointwise: C_ptwise / MEASURED_PEAK, // ~= 1.00044
  slackCoherent: C_coh / MEASURED_PEAK, // ~= 1.189 (imp-97294)
});

export const IMP97312_VERDICT = Object.freeze({
  ticket: 'imp-97312',
  question:
    'integrate the imp-97294 fully-coherent pointwise z-dependent Bessel remainder bound |SUM_k d_k R_k(z)| <= z^-1 sqrt((SUM_j P_j z^-j)^2+(SUM_j Q_j z^-j)^2) into a SINGLE closed tail constant over z>=Z0, and quantify the residual slack against the measured peak ~4.534e4.',
  answer:
    'C_ptwise = sup_{z>=Z0} sqrt(Atil(z)^2+Btil(z)^2) with Atil=SUM_j P_j z^-(j-3), Btil=SUM_j Q_j z^-(j-3) is a rigorous single z^-4 tail constant. F(z) is monotone DECREASING on [Z0,inf) (higher-order terms add coherently at the tail edge), so the sup is attained at z=Z0 and C_ptwise = F(Z0) ~= 4.5504e4. This is a further 1.189x below the imp-97294 across-order coherent constant C_coh ~= 5.4088e4 (the vector partial sums (P_j,Q_j) partly cancel, so the magnitude beats the triangle sum). Against the measured true peak |SUM_k d_k R_k(z)| z^4 ~= 4.5484e4 (at z~=57.87) the pointwise single constant leaves only ~1.00044x slack (0.044%), down from the imp-97294 ~1.189x. The residual 0.044% is purely the gap between the tail-edge supremum F(Z0) and the interior true peak, NOT a further triangle loss: the across-order step is eliminated. So the pointwise form, reduced to sup_{z>=Z0} F, is essentially tight.',
  // What IS delivered.
  singleConstant: C_ptwise,
  C_coh,
  furtherTightenRatio: C_coh / C_ptwise, // ~1.189
  slackPointwise: C_ptwise / MEASURED_PEAK, // ~1.00044
  slackCoherentPrior: C_coh / MEASURED_PEAK, // ~1.189
  supAttainedAtEdge: Math.abs(C_ptwise - Fenvelope(Z0)) < 1e-6,
  // What is NOT delivered (honest scope).
  intervalMajorantProduced: false, // F uses IEEE-double evaluation, not an interval library
  operatorPositivityProved: false,
  fixedRationalV0OrderFourCertified: false,
  obstructionBStillOpen: 'imp-97164 degree-to-v0 overlap inversion d = C^T v0 (interval overlaps c_jk)',
  boundChanged: false,
  subGap:
    'The pointwise coherent bound reduces to a single tail constant C_ptwise = sup_{z>=Z0} sqrt(Atil^2+Btil^2) ~= 4.5504e4 with only ~1.00044x slack against the measured peak (vs the imp-97294 ~1.189x from the across-order triangle step). This is IEEE-double measurement only: no interval majorant is produced (F would need an interval spherical-Bessel envelope), and the residual blocker is unchanged -- imp-97227 Obstruction B (the degree-to-v0 overlap inversion d = C^T v0, imp-97164) still needs interval overlaps c_jk, and Route B does not close on the remainder bound alone.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97312_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97312_ASSERTIONS = [
  {
    id: 'imp97312-pointwise-bound-holds-on-tail',
    holds: () => {
      // The pointwise bound |SUM_k d_k R_k(z)| z^4 <= F(z) holds for all sampled z >= Z0 (to IEEE-double
      // rounding: the exact jExact evaluation and the P/Q regrouping are algebraically identical).
      for (let z = Z0; z <= 20000; z += 3.13) {
        const lhs = Math.abs(combinationRemainder(z)) * Math.pow(z, 4);
        const rhs = Fenvelope(z);
        if (lhs > rhs * (1 + 1e-4)) return false;
      }
      return true;
    },
    why: 'by Cauchy-Schwarz on the single {cos z, sin z} pair, |SUM_k d_k R_k(z)| z^4 <= sqrt(Atil(z)^2+Btil(z)^2) = F(z) pointwise; the sampled tail confirms it to IEEE-double rounding.',
  },
  {
    id: 'imp97312-single-constant-beats-coherent-and-bounds-tail',
    holds: () => {
      if (!(Number.isFinite(C_ptwise) && C_ptwise > 0 && C_ptwise < C_coh && C_coh / C_ptwise > 1.15)) return false;
      // C_ptwise is a valid single constant: |SUM_k d_k R_k(z)| z^4 <= C_ptwise for all sampled z >= Z0.
      for (let z = Z0; z <= 20000; z += 3.13) {
        if (Math.abs(combinationRemainder(z)) * Math.pow(z, 4) > C_ptwise * (1 + 1e-4)) return false;
      }
      return true;
    },
    why: 'C_ptwise = sup_{z>=Z0} F(z) is finite, positive, more than 1.15x smaller than the imp-97294 across-order C_coh, and rigorously bounds the measured |SUM_k d_k R_k(z)| z^4 uniformly on the sampled tail.',
  },
  {
    id: 'imp97312-sup-at-edge-and-slack-collapses',
    holds: () => {
      // F is monotone decreasing on [Z0,inf), so the sup is at the tail edge z=Z0.
      const edge = Fenvelope(Z0);
      if (Math.abs(C_ptwise - edge) > 1e-6) return false;
      if (!(Fenvelope(Z0) > Fenvelope(Z0 * 2) && Fenvelope(Z0 * 2) > Fenvelope(Z0 * 10))) return false;
      // the pointwise single-constant slack collapses to ~1.0004x, well below the imp-97294 ~1.19x.
      const slack = C_ptwise / MEASURED_PEAK;
      return slack > 1 && slack < 1.01 && C_coh / MEASURED_PEAK > 1.15;
    },
    why: 'F monotone decreasing on the tail puts the supremum at z=Z0, so C_ptwise = F(Z0); the resulting single-constant slack C_ptwise/peak ~= 1.0004 collapses the imp-97294 across-order slack C_coh/peak ~= 1.189 to essentially the edge-vs-interior-peak gap.',
  },
  {
    id: 'imp97312-measurement-only-no-qed',
    holds: () =>
      IMP97312_VERDICT.intervalMajorantProduced === false &&
      IMP97312_VERDICT.operatorPositivityProved === false &&
      IMP97312_VERDICT.fixedRationalV0OrderFourCertified === false &&
      IMP97312_VERDICT.boundChanged === false &&
      IMP97312_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97312_VERDICT.qed === false &&
      typeof IMP97312_VERDICT.subGap === 'string' &&
      IMP97312_VERDICT.subGap.includes('Obstruction B'),
    why: 'reducing the pointwise bound to a single constant is an IEEE-double measurement of achievable slack: no interval majorant, no operator positivity, no rational-v0 certificate, no bound change, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97312_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97312-krein-bessel-z4-pointwise-single-constant assertion failed: ${t.id}`);
  }
}
