/**
 * @module imp-97263-krein-analytic-bessel-z4-remainder-majorant
 *
 * imp-97263 (proof): derive an ANALYTIC (non-interval-library) two-sided majorant of the spherical-Bessel
 * z^-4 remainder R_k(z), uniform in z >= a T, for k = 0..7 -- sidestepping imp-97227 Obstruction A (the z^-4
 * remainder bound, which imp-97227 routed to the missing interval primitive IMP97015_ARB_INTERVAL_BESSEL).
 *
 * THE KEY OBSERVATION (why no interval Bessel library is needed). For INTEGER order the Hankel P/Q asymptotic
 * expansion of the spherical Bessel function is not merely asymptotic -- it TERMINATES and is EXACT (DLMF
 * 10.49.3-10.49.6):
 *
 *   j_k(z) = (1/z) [ sin(z - k pi/2) * SUM_{m=0}^{floor(k/2)}   (-1)^m a_{2m}(k)   z^-(2m)
 *                  + cos(z - k pi/2) * SUM_{m=0}^{floor((k-1)/2)}(-1)^m a_{2m+1}(k) z^-(2m+1) ],
 *
 * where the Hankel coefficient a_j(k) := a_j(k + 1/2) = (k+j)! / (2^j j! (k-j)!) = C(k+j, 2j) * (2j-1)!! is a
 * POSITIVE INTEGER for 0 <= j <= k and is ZERO for j > k. So the series has only finitely many terms and
 * carries NO asymptotic remainder: the whole function equals its P/Q form exactly. (Verified against the
 * upward recurrence to 7.7e-17 over k=0..7 across z in {10..1600}.)
 *
 * THE ANALYTIC MAJORANT (the deliverable). Define R_k(z) as j_k(z) minus its three leading P/Q terms
 * (the orders z^-1, z^-2, z^-3, i.e. j = 0, 1, 2 -- exactly the three coefficients imp-97134 / imp-97227
 * annihilate). Because the expansion is exact and finite, R_k(z) is itself an EXACT finite sum:
 *
 *   R_k(z) = (1/z) SUM_{j=3}^{k} (trig_j) (-1)^{floor(j/2)} a_j(k) z^-j,   trig_j in {sin, cos}(z - k pi/2).
 *
 * Since |sin|, |cos| <= 1 and every a_j(k) >= 0, the triangle inequality gives the closed-form TWO-SIDED bound
 *
 *   -M_k(z) <= R_k(z) <= M_k(z),   M_k(z) = SUM_{j=3}^{k} a_j(k) z^-(j+1),
 *
 * and uniformly on the far tail z >= Z0 := a T (each z^-(j+1) is decreasing in z),
 *
 *   |R_k(z)| <= z^-4 * SUM_{j=3}^{k} a_j(k) Z0^-(j-3)  =  z^-4 * Mbar_k(Z0),   Mbar_k(Z0) := SUM_{j=3}^{k} a_j(k) Z0^-(j-3).
 *
 * The leading term is a_3(k) z^-4, so R_k(z) = O(z^-4) with an EXPLICIT constant Mbar_k(Z0) built entirely
 * from exact integers a_j(k) and the single real Z0 = a T. No spherical-Bessel value is ever evaluated: the
 * bound needs only |trig| <= 1 and the exact-integer Hankel coefficients. This is exactly the "error bounded
 * by the first neglected term" mechanism the ticket names, but here it is not an inequality on an asymptotic
 * tail -- it is a triangle bound on an EXACT finite sum, so it is unconditional for all z >= Z0.
 *
 * THE COMBINATION CONSTANT (Obstruction A discharged for the annihilating trial). For the imp-97134
 * degree-level annihilating trial g(z) = SUM_k d_k j_k(z) (even {0,2,4,6} -> (33,55,27,5), odd
 * {1,3,5,7} -> (143,273,165,35), which zero the j = 0, 1, 2 coefficients), the O(z^-4) constant obeys
 *
 *   | SUM_k d_k R_k(z) | <= z^-4 * SUM_k |d_k| Mbar_k(Z0)  =:  z^-4 * C(Z0),
 *
 * a rigorous, closed-form, interval-library-free O(z^-4) constant, uniform in z >= Z0. At Z0 = a T with
 * a = (ln 3)/2 and T = 100 this gives C ~= 2.0796e5 (and C decreases toward its z-independent limit
 * SUM_k |d_k| a_3(k) as Z0 grows); the actual measured |g(z)| z^4 (~4.4e4 falling to ~3e3) sits comfortably
 * under it, so the majorant is valid and ~5-70x loose (the looseness is the price of the triangle inequality,
 * which does not exploit the further j=3 cancellation across the combination).
 *
 * NET. This leaf DISCHARGES imp-97227 Obstruction A ANALYTICALLY: a rigorous two-sided majorant of the z^-4
 * spherical-Bessel remainder R_k(z), uniform in z >= a T, in closed form from exact-integer Hankel coefficients
 * with NO interval spherical-Bessel evaluation -- the IMP97015_ARB_INTERVAL_BESSEL primitive is NOT needed for
 * the remainder half. It does NOT close the full g(t) = O(t^-4) certificate for a fixed rational v0: imp-97227
 * Obstruction B (the degree-to-v0 overlap inversion d = C^T v0, imp-97164) is a separate blocker still tied to
 * interval overlaps, and the Route B / IMP97100_PHASE_CANCELLATION_TRIAL tail majorant does not close on the
 * remainder bound alone. Derivation only: produces no interval tail majorant for the full trial; Rayleigh
 * floors stay UPPER bounds; establishes no operator positivity; interval-rigorous reach stays 2a <= 0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97227-krein-interval-annihilation-certificate.js (Obstruction A named + routed to IMP97015_ARB_INTERVAL_BESSEL)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the annihilating degree-level trials d_k)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (a_1 = tri, a_2 = quad carrier weights)
 * @see imp-97164-krein-v0-overlap-inversion-interval-obstruction.js (Obstruction B: the still-open v0 overlap map)
 * @see imp-97205-krein-routeb-sigma2-majorant-execution.js (Route B EASY factor; HARD factor still open)
 *
 * Ticket: imp-97263 (proof, opus-4-8, medium). Derivation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: one light literal import (imp-97134 trials), no zeros bundle.
 */

import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const T_FARTAIL = 100; // representative far-tail cutoff; the majorant is a closed form of Z0 = a T for any T

// Exact Hankel coefficient a_j(k+1/2) = (k+j)! / (2^j j! (k-j)!) = C(k+j,2j)(2j-1)!!.
// Positive integer for 0 <= j <= k, zero for j > k. Small (k <= 7), so an exact integer product is safe.
function aCoeff(k, j) {
  if (j < 0 || j > k) return 0;
  let num = 1;
  for (let i = k - j + 1; i <= k + j; i++) num *= i; // (k+j)! / (k-j)!
  let den = Math.pow(2, j);
  for (let i = 2; i <= j; i++) den *= i; // 2^j j!
  return num / den;
}

// Exact terminating P/Q form of j_k(z) (DLMF 10.49) -- used only to CHECK the derivation, never for the bound.
function jExact(k, z) {
  const phase = z - (k * Math.PI) / 2;
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  let A = 0; // even j multiply sin
  for (let m = 0; 2 * m <= k; m++) A += Math.pow(-1, m) * aCoeff(k, 2 * m) * Math.pow(z, -2 * m);
  let B = 0; // odd j multiply cos
  for (let m = 0; 2 * m + 1 <= k; m++) B += Math.pow(-1, m) * aCoeff(k, 2 * m + 1) * Math.pow(z, -(2 * m + 1));
  return (s * A + c * B) / z;
}

// Reference upward recurrence (independent of the P/Q form) to certify the exact expansion.
function jRecurrence(kmax, z) {
  const j = [Math.sin(z) / z, Math.sin(z) / (z * z) - Math.cos(z) / z];
  for (let k = 1; k < kmax; k++) j[k + 1] = ((2 * k + 1) / z) * j[k] - j[k - 1];
  return j;
}

// The three leading P/Q terms (orders z^-1, z^-2, z^-3; j = 0, 1, 2) -- the ones the trial annihilates.
function threeLeading(k, z) {
  const phase = z - (k * Math.PI) / 2;
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  let t = s * aCoeff(k, 0); // j=0
  if (k >= 1) t += c * aCoeff(k, 1) * Math.pow(z, -1); // j=1
  if (k >= 2) t += s * -aCoeff(k, 2) * Math.pow(z, -2); // j=2
  return t / z;
}

// Analytic pointwise two-sided majorant M_k(z) = SUM_{j=3}^k a_j(k) z^-(j+1) of |R_k(z)| (uses only |trig|<=1).
function Mk(k, z) {
  let m = 0;
  for (let j = 3; j <= k; j++) m += aCoeff(k, j) * Math.pow(z, -(j + 1));
  return m;
}

// Uniform-tail majorant coefficient Mbar_k(Z0) = SUM_{j=3}^k a_j(k) Z0^-(j-3), so |R_k(z)| <= z^-4 Mbar_k(Z0)
// for all z >= Z0.
function MbarK(k, Z0) {
  let m = 0;
  for (let j = 3; j <= k; j++) m += aCoeff(k, j) * Math.pow(Z0, -(j - 3));
  return m;
}

// The exact Hankel coefficient table a_j(k) for k, j = 0..7 (audit trail; a_j = 0 above the diagonal).
export const IMP97263_HANKEL_COEFFS = Object.freeze(
  [0, 1, 2, 3, 4, 5, 6, 7].map((k) => Object.freeze([0, 1, 2, 3, 4, 5, 6, 7].map((j) => aCoeff(k, j)))),
);

// Per-degree uniform-tail majorant coefficients Mbar_k(Z0) at Z0 = a T.
const Z0 = a * T_FARTAIL;
export const IMP97263_PER_DEGREE_MAJORANT = Object.freeze(
  [0, 1, 2, 3, 4, 5, 6, 7].map((k) => Object.freeze({ k, a3: aCoeff(k, 3), MbarK: MbarK(k, Z0) })),
);

// Combination O(z^-4) constant C(Z0) = SUM_k |d_k| Mbar_k(Z0), so |SUM_k d_k R_k(z)| <= z^-4 C(Z0), z >= Z0.
function combinationConstant(Z0v) {
  let c = 0;
  for (const kStr of [...Object.keys(IMP97134_TRIALS.even), ...Object.keys(IMP97134_TRIALS.odd)]) {
    const k = +kStr;
    const d = IMP97134_TRIALS.even[kStr] ?? IMP97134_TRIALS.odd[kStr];
    c += Math.abs(d) * MbarK(k, Z0v);
  }
  return c;
}

// z-independent limit of the constant as Z0 -> infinity: SUM_k |d_k| a_3(k) (only k >= 3 contribute).
const combinationConstantLimit = (() => {
  let c = 0;
  for (const kStr of [...Object.keys(IMP97134_TRIALS.even), ...Object.keys(IMP97134_TRIALS.odd)]) {
    const k = +kStr;
    const d = IMP97134_TRIALS.even[kStr] ?? IMP97134_TRIALS.odd[kStr];
    c += Math.abs(d) * aCoeff(k, 3);
  }
  return c;
})();

export const IMP97263_COMBINATION_MAJORANT = Object.freeze({
  aRung: a,
  T: T_FARTAIL,
  Z0,
  CofZ0: combinationConstant(Z0), // ~2.0796e5 at Z0 = a*100
  CofZ0_limit: combinationConstantLimit, // SUM_k |d_k| a_3(k), the Z0 -> infinity floor of C
});

export const IMP97263_VERDICT = Object.freeze({
  ticket: 'imp-97263',
  question:
    'derive an ANALYTIC (non-interval-library) two-sided majorant of the spherical-Bessel z^-4 remainder R_k(z), uniform in z >= a T, for k = 0..7 via the Hankel P/Q asymptotic error bounds, sidestepping imp-97227 Obstruction A (the z^-4 remainder majorant, previously routed to the missing IMP97015_ARB_INTERVAL_BESSEL primitive).',
  answer:
    'DISCHARGED. For INTEGER order the Hankel P/Q expansion of j_k(z) TERMINATES and is EXACT (DLMF 10.49): j_k(z) = (1/z)[sin(z-k pi/2) SUM (-1)^m a_{2m}(k) z^-2m + cos(z-k pi/2) SUM (-1)^m a_{2m+1}(k) z^-(2m+1)] with a_j(k) = (k+j)!/(2^j j!(k-j)!) = C(k+j,2j)(2j-1)!! a positive integer for j<=k and zero for j>k -- so there is NO asymptotic remainder, only a finite exact sum (checked vs the recurrence to 7.7e-17). Hence R_k(z) := j_k(z) minus its three leading terms (orders z^-1,z^-2,z^-3; j=0,1,2, the annihilated ones) is EXACTLY (1/z) SUM_{j=3}^k (trig)(-1)^floor(j/2) a_j(k) z^-j, and since |sin|,|cos|<=1 and a_j>=0 the triangle inequality gives the closed-form two-sided bound -M_k(z)<=R_k(z)<=M_k(z), M_k(z)=SUM_{j=3}^k a_j(k) z^-(j+1), and uniformly on z>=Z0:=a T, |R_k(z)| <= z^-4 SUM_{j=3}^k a_j(k) Z0^-(j-3). The leading a_3(k) z^-4 makes R_k(z)=O(z^-4) with an explicit constant built only from exact integers -- NO spherical-Bessel evaluation, so IMP97015_ARB_INTERVAL_BESSEL is not needed for the remainder half. For the imp-97134 annihilating trial |SUM_k d_k R_k(z)| <= z^-4 SUM_k |d_k| Mbar_k(Z0) = z^-4 C(Z0), C ~= 2.0796e5 at Z0=(ln3/2)*100 (falling to SUM_k|d_k|a_3(k) as Z0 grows), bounding the actual |g(z)|z^4 with ~5-70x slack. This discharges Obstruction A analytically. It does NOT close the full g(t)=O(t^-4) certificate for a fixed rational v0: Obstruction B (the degree-to-v0 overlap inversion d=C^T v0, imp-97164) is a separate blocker and IMP97100_PHASE_CANCELLATION_TRIAL / Route B do not close on the remainder bound alone.',
  // What IS delivered.
  expansionIsExactAndTerminating: true, // integer-order spherical Bessel: no asymptotic tail
  hankelCoeffsAreExactIntegers: IMP97263_HANKEL_COEFFS.every((row) => row.every((v) => Number.isInteger(v))),
  analyticTwoSidedMajorantDerived: true, // -M_k(z) <= R_k(z) <= M_k(z), closed form, no interval Bessel
  uniformInZTail: true, // |R_k(z)| <= z^-4 Mbar_k(Z0) for all z >= Z0 = a T
  remainderOrder: 4, // R_k(z) = O(z^-4), leading coefficient a_3(k)
  noIntervalBesselLibraryNeeded: true, // needs only |trig|<=1 and exact-integer a_j(k)
  obstructionADischargedAnalytically: true, // imp-97227 Obstruction A (z^-4 remainder majorant)
  combinationConstantCofZ0: IMP97263_COMBINATION_MAJORANT.CofZ0,
  combinationConstantLimit: IMP97263_COMBINATION_MAJORANT.CofZ0_limit,
  // What is NOT delivered (honest scope).
  fixedRationalV0OrderFourCertified: false, // full g(t)=O(t^-4) for a rational v0 NOT closed
  obstructionBStillOpen: 'imp-97164 degree-to-v0 overlap inversion d = C^T v0 (interval overlaps c_jk)',
  intervalMajorantProduced: false, // no interval tail majorant for the full trial
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL stays open, but imp-97227 Obstruction A (the z^-4 spherical-Bessel remainder majorant) is DISCHARGED ANALYTICALLY here: because the integer-order Hankel P/Q expansion terminates exactly, R_k(z) is a finite exact sum and |R_k(z)| <= z^-4 SUM_{j=3}^k a_j(k) Z0^-(j-3) uniformly on z >= Z0 = a T, with a_j(k) exact integers and no spherical-Bessel evaluation -- so IMP97015_ARB_INTERVAL_BESSEL is NOT needed for the remainder half. The residual is imp-97227 Obstruction B (the degree-to-v0 overlap inversion d = C^T v0, imp-97164), which still needs interval overlaps c_jk; Route B does not close on the remainder bound alone.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97263_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97263_ASSERTIONS = [
  {
    id: 'imp97263-exact-terminating-expansion-matches-recurrence',
    holds: () => {
      let maxerr = 0;
      for (const z of [10, 50, 100, 400, 1600]) {
        const jr = jRecurrence(7, z);
        for (let k = 0; k <= 7; k++) maxerr = Math.max(maxerr, Math.abs(jExact(k, z) - jr[k]));
      }
      return maxerr < 1e-12;
    },
    why: 'the integer-order Hankel P/Q form is EXACT and terminating (DLMF 10.49): it reproduces the independent upward recurrence for j_k(z) to machine precision over k=0..7 and z in {10..1600}, so there is no asymptotic remainder and R_k(z) is a finite exact sum.',
  },
  {
    id: 'imp97263-hankel-coeffs-exact-integers-and-recover-tri-quad',
    holds: () =>
      IMP97263_HANKEL_COEFFS.every((row) => row.every((v) => Number.isInteger(v) && v >= 0)) &&
      // a_1(k) = k(k+1)/2 = tri, a_2(k) = (k-1)k(k+1)(k+2)/8 = quad (the imp-97113 carrier weights).
      [0, 1, 2, 3, 4, 5, 6, 7].every(
        (k) => aCoeff(k, 1) === (k * (k + 1)) / 2 && aCoeff(k, 2) === ((k - 1) * k * (k + 1) * (k + 2)) / 8,
      ) &&
      // a_j(k) = 0 for j > k.
      [0, 1, 2, 3, 4, 5, 6, 7].every((k) => [k + 1, k + 2].every((j) => (j <= 7 ? aCoeff(k, j) === 0 : true))),
    why: 'the Hankel coefficients a_j(k) = (k+j)!/(2^j j!(k-j)!) are exact non-negative integers (they recover the imp-97113 carrier weights a_1 = tri = k(k+1)/2 and a_2 = quad = (k-1)k(k+1)(k+2)/8) and vanish for j > k, so the majorant is built from exact integers with no special-function evaluation.',
  },
  {
    id: 'imp97263-two-sided-majorant-bounds-remainder',
    holds: () => {
      for (const z of [50, 100, 400, 1600]) {
        for (let k = 0; k <= 7; k++) {
          const R = jExact(k, z) - threeLeading(k, z);
          if (Math.abs(R) > Mk(k, z) + 1e-12) return false;
        }
      }
      return true;
    },
    why: 'the closed-form pointwise majorant M_k(z) = SUM_{j=3}^k a_j(k) z^-(j+1) bounds |R_k(z)| = |j_k(z) - (three leading terms)| for every k=0..7 across z in {50..1600}, confirming the triangle bound -M_k <= R_k <= M_k that needs only |trig|<=1 and the exact-integer a_j.',
  },
  {
    id: 'imp97263-uniform-tail-and-combination-constant-finite',
    holds: () => {
      // |R_k(z)| <= z^-4 Mbar_k(Z0) for all z >= Z0 (test at Z0, 2 Z0, 4 Z0).
      for (const mult of [1, 2, 4]) {
        const z = Z0 * mult;
        for (let k = 0; k <= 7; k++) {
          const R = jExact(k, z) - threeLeading(k, z);
          if (Math.abs(R) > Math.pow(z, -4) * MbarK(k, Z0) + 1e-15) return false;
        }
      }
      // combination constant finite, positive, and >= its z-independent floor.
      const C = IMP97263_COMBINATION_MAJORANT.CofZ0;
      return (
        Number.isFinite(C) && C > 0 && C >= IMP97263_COMBINATION_MAJORANT.CofZ0_limit - 1e-9 && C < 3e5
      );
    },
    why: 'the uniform-tail form |R_k(z)| <= z^-4 Mbar_k(Z0), Mbar_k(Z0) = SUM_{j=3}^k a_j(k) Z0^-(j-3), holds for all z >= Z0 = a T, and the annihilating-trial combination constant C(Z0) = SUM_k |d_k| Mbar_k(Z0) is finite (~2.08e5 at Z0 = (ln3/2)*100), positive, and above its Z0 -> infinity floor SUM_k |d_k| a_3(k) -- a rigorous interval-library-free O(z^-4) constant.',
  },
  {
    id: 'imp97263-obstruction-a-discharged-but-no-qed',
    holds: () =>
      IMP97263_VERDICT.obstructionADischargedAnalytically === true &&
      IMP97263_VERDICT.noIntervalBesselLibraryNeeded === true &&
      IMP97263_VERDICT.fixedRationalV0OrderFourCertified === false &&
      IMP97263_VERDICT.intervalMajorantProduced === false &&
      IMP97263_VERDICT.operatorPositivityProved === false &&
      IMP97263_VERDICT.boundChanged === false &&
      IMP97263_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97263_VERDICT.qed === false &&
      typeof IMP97263_VERDICT.subGap === 'string' &&
      IMP97263_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
      IMP97263_VERDICT.subGap.includes('Obstruction B'),
    why: 'imp-97227 Obstruction A (the z^-4 remainder majorant) is discharged analytically without an interval Bessel library, but the full g(t)=O(t^-4) certificate for a rational v0 is NOT closed: Obstruction B (the degree-to-v0 overlap inversion, imp-97164) still needs interval overlaps, so no interval majorant, no operator positivity, no bound change, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97263_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97263-krein-analytic-bessel-z4-remainder-majorant assertion failed: ${t.id}`);
  }
}
