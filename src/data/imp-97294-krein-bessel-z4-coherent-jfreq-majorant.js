/**
 * @module imp-97294-krein-bessel-z4-coherent-jfreq-majorant
 *
 * imp-97294 (proof): TIGHTEN the imp-97263 z^-4 spherical-Bessel remainder majorant by exploiting the
 * per-frequency (sin/cos) cross-cancellation ACROSS the annihilating degree combination, replacing the
 * triangle-inequality floor SUM_k |d_k| a_j(k) at each order j with the COHERENT amplitude of the single
 * {cos z, sin z} pair those k-terms collapse to. imp-97263 was ~5-70x loose precisely because it discarded
 * this cancellation; here it is recovered exactly.
 *
 * THE OBSERVATION (why coherence survives the combination). From imp-97263 the exact terminating Hankel P/Q
 * form gives, for the imp-97134 annihilating trial g(z) = SUM_k d_k j_k(z), the EXACT finite remainder
 *
 *   SUM_k d_k R_k(z) = (1/z) SUM_{j=3}^{7} [ SUM_k d_k (-1)^floor(j/2) a_j(k) trig_{j,k}(z) ] z^-j,
 *
 * where trig_{j,k} = sin(z - k pi/2) for even j and cos(z - k pi/2) for odd j. The imp-97263 bound applied the
 * triangle inequality term-by-term: |...| <= SUM_k |d_k| a_j(k). But every phase sin(z - k pi/2), cos(z - k pi/2)
 * expands in the SINGLE frequency basis {cos z, sin z} with the exact-integer coefficients cos(k pi/2) in
 * {1,0,-1,0} and sin(k pi/2) in {0,1,0,-1} (period 4 in k). So for each FIXED order j the whole degree sum over
 * k collapses to ONE harmonic
 *
 *   SUM_k d_k (-1)^floor(j/2) a_j(k) trig_{j,k}(z) = P_j cos z + Q_j sin z,
 *
 * with P_j, Q_j EXACT INTEGERS. Because |P_j cos z + Q_j sin z| <= sqrt(P_j^2 + Q_j^2) uniformly in z, the
 * per-order coefficient is the COHERENT amplitude amp_j := sqrt(P_j^2 + Q_j^2), not the incoherent floor
 * SUM_k |d_k| a_j(k). The two agree only when no cancellation is possible; here they differ most at the leading
 * order j=3 (the z^-4 term the ticket names): amp_3 = sqrt(3465^2 + 45045^2) ~= 45178 versus the incoherent
 * SUM_k |d_k| a_3(k) = 192780 -- a 4.27x collapse from the coherent regrouping.
 *
 * THE TIGHTER MAJORANT (the deliverable). Grouping by frequency inside each order and then applying the triangle
 * inequality only ACROSS the (distinct powers of z) orders j gives the closed-form uniform-tail constant
 *
 *   | SUM_k d_k R_k(z) | <= z^-4 SUM_{j=3}^{7} sqrt(P_j^2 + Q_j^2) Z0^-(j-3)  =:  z^-4 C_coh(Z0),   z >= Z0 = a T.
 *
 * At Z0 = (ln 3 / 2) * 100 this is C_coh ~= 5.409e4 versus the imp-97263 incoherent C ~= 2.080e5 -- a 3.84x
 * tighter rigorous constant. Measured against the true |SUM_k d_k R_k(z)| z^4 (peak ~4.534e4 on the tail), the
 * coherent constant leaves only ~1.19x slack (down from ~4.59x). The leading floor as Z0 -> infinity likewise
 * drops from SUM_k |d_k| a_3(k) = 192780 to amp_3 = 45178.
 *
 * The residual ~1.19x slack is the price of the ONE remaining triangle step -- across the different powers
 * z^-(j+1) -- since the orders cannot share a single z-independent amplitude. A fully-coherent POINTWISE bound
 * |SUM_k d_k R_k(z)| <= z^-1 sqrt( (SUM_j P_j z^-j)^2 + (SUM_j Q_j z^-j)^2 ) removes even that, but is
 * z-dependent, not a single constant; it is exported for reference.
 *
 * NET. The imp-97263 z^-4 remainder majorant is TIGHTENED ~3.84x (uniform constant) / 4.27x (leading j=3 floor)
 * by exact per-frequency regrouping into {cos z, sin z} with integer coefficients cos(k pi/2), sin(k pi/2) --
 * no interval Bessel library, no new special-function evaluation. It does NOT close the full g(t) = O(t^-4)
 * certificate: imp-97227 Obstruction B (the degree-to-v0 overlap inversion d = C^T v0, imp-97164) stays open,
 * Route B / IMP97100_PHASE_CANCELLATION_TRIAL does not close on the remainder bound alone. Derivation only:
 * produces no interval tail majorant for the full trial; Rayleigh floors stay UPPER bounds; establishes no
 * operator positivity; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97263-krein-analytic-bessel-z4-remainder-majorant.js (the ~5-70x loose triangle majorant tightened here)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the annihilating degree-level trials d_k)
 * @see imp-97227-krein-interval-annihilation-certificate.js (Obstruction A discharged; Obstruction B still open)
 * @see imp-97164-krein-v0-overlap-inversion-interval-obstruction.js (Obstruction B: the still-open v0 overlap map)
 *
 * Ticket: imp-97294 (proof, opus-4-8, medium). Derivation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: one light literal import (imp-97134 trials), no zeros bundle.
 */

import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const T_FARTAIL = 100; // representative far-tail cutoff; the constant is a closed form of Z0 = a T for any T
const Z0 = a * T_FARTAIL;

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

// Exact-integer frequency-basis coefficients of the phase shift, period 4 in k:
// sin(z - k pi/2) = sin(z) cos(k pi/2) - cos(z) sin(k pi/2), and dually for cos(z - k pi/2).
const cosK = (k) => [1, 0, -1, 0][((k % 4) + 4) % 4]; // cos(k pi/2)
const sinK = (k) => [0, 1, 0, -1][((k % 4) + 4) % 4]; // sin(k pi/2)

// Per-order harmonic collapse: SUM_k d_k (-1)^floor(j/2) a_j(k) trig_{j,k}(z) = P_j cos z + Q_j sin z.
// Returns exact-integer P_j, Q_j and the coherent amplitude amp_j = sqrt(P_j^2 + Q_j^2).
function harmonicPQ(j) {
  let P = 0; // coeff of cos z
  let Q = 0; // coeff of sin z
  for (let k = 3; k <= 7; k++) {
    const w = (D[k] ?? 0) * Math.pow(-1, Math.floor(j / 2)) * aCoeff(k, j);
    if (w === 0) continue;
    if (j % 2 === 0) {
      // even j -> sin(z - k pi/2) = sin z cosK - cos z sinK
      P += w * -sinK(k);
      Q += w * cosK(k);
    } else {
      // odd j -> cos(z - k pi/2) = cos z cosK + sin z sinK
      P += w * cosK(k);
      Q += w * sinK(k);
    }
  }
  return { j, P, Q, amp: Math.hypot(P, Q) };
}

// Incoherent per-order floor from imp-97263 (triangle inequality): SUM_k |d_k| a_j(k).
function incoherentFloor(j) {
  let s = 0;
  for (let k = 3; k <= 7; k++) s += Math.abs(D[k] ?? 0) * aCoeff(k, j);
  return s;
}

// The per-order table (j = 3..7): coherent amplitude vs the imp-97263 incoherent floor.
export const IMP97294_PER_ORDER = Object.freeze(
  [3, 4, 5, 6, 7].map((j) => {
    const { P, Q, amp } = harmonicPQ(j);
    const incoh = incoherentFloor(j);
    return Object.freeze({ j, P, Q, amp, incoherentFloor: incoh, tightenRatio: incoh / amp });
  }),
);

// Coherent uniform-tail constant C_coh(Z0) = SUM_{j=3}^7 sqrt(P_j^2+Q_j^2) Z0^-(j-3): |SUM_k d_k R_k(z)| <= z^-4 C_coh(Z0), z>=Z0.
function coherentConstant(Z0v) {
  let c = 0;
  for (let j = 3; j <= 7; j++) c += harmonicPQ(j).amp * Math.pow(Z0v, -(j - 3));
  return c;
}

// imp-97263 incoherent uniform-tail constant C(Z0) = SUM_{j=3}^7 (SUM_k |d_k| a_j(k)) Z0^-(j-3), for the ratio.
function incoherentConstant(Z0v) {
  let c = 0;
  for (let j = 3; j <= 7; j++) c += incoherentFloor(j) * Math.pow(Z0v, -(j - 3));
  return c;
}

export const IMP97294_COHERENT_MAJORANT = Object.freeze({
  aRung: a,
  T: T_FARTAIL,
  Z0,
  C_coh: coherentConstant(Z0), // ~5.409e4 at Z0 = a*100
  C_incoherent: incoherentConstant(Z0), // ~2.080e5 (imp-97263)
  tightenRatio: incoherentConstant(Z0) / coherentConstant(Z0), // ~3.84x
  amp3: harmonicPQ(3).amp, // leading j=3 coherent amplitude ~45178
  incoherentFloor3: incoherentFloor(3), // SUM_k |d_k| a_3(k) = 192780
  leadingTightenRatio: incoherentFloor(3) / harmonicPQ(3).amp, // ~4.27x
});

// -- reference exact evaluators (used ONLY to certify the coherent bound numerically, never for the constant) --
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
// Exact combination remainder SUM_k d_k R_k(z) = SUM_k d_k (j_k - three-leading).
function combinationRemainder(z) {
  let r = 0;
  for (const kStr of Object.keys(D)) {
    const k = +kStr;
    r += D[k] * (jExact(k, z) - threeLeading(k, z));
  }
  return r;
}

export const IMP97294_VERDICT = Object.freeze({
  ticket: 'imp-97294',
  question:
    'tighten the imp-97263 z^-4 spherical-Bessel remainder majorant |SUM_k d_k R_k(z)| <= z^-4 C(Z0) (~5-70x loose from the triangle inequality) by exploiting the j=3 (and higher) cross-cancellation across the annihilating combination -- a per-frequency sin/cos regrouping of SUM_k d_k a_j(k) rather than SUM_k |d_k| a_j(k).',
  answer:
    'TIGHTENED ~3.84x (uniform constant) / 4.27x (leading j=3 floor). Every phase sin(z - k pi/2), cos(z - k pi/2) expands in the single basis {cos z, sin z} with exact-integer coefficients cos(k pi/2) in {1,0,-1,0} and sin(k pi/2) in {0,1,0,-1}, so at each fixed order j the degree sum over k collapses to ONE harmonic P_j cos z + Q_j sin z with P_j, Q_j exact integers, whose modulus is bounded by the coherent amplitude amp_j = sqrt(P_j^2 + Q_j^2) uniformly in z -- NOT the incoherent floor SUM_k |d_k| a_j(k). This gives the closed-form uniform-tail constant C_coh(Z0) = SUM_{j=3}^7 amp_j Z0^-(j-3) ~= 5.409e4 at Z0=(ln3/2)*100, versus the imp-97263 incoherent 2.080e5. The leading order j=3 (the named z^-4 term) collapses from SUM_k |d_k| a_3(k) = 192780 to amp_3 = sqrt(3465^2+45045^2) ~= 45178, a 4.27x gain. Numerically C_coh rigorously bounds the true |SUM_k d_k R_k(z)| z^4 (peak ~4.534e4) with only ~1.19x slack (down from ~4.59x). The one remaining triangle step is across the distinct powers z^-(j+1); a fully-coherent POINTWISE bound removes it but is z-dependent, not a single constant. No interval Bessel library, no new special-function evaluation.',
  // What IS delivered.
  perOrderHarmonicCollapseExactInteger: IMP97294_PER_ORDER.every((r) => Number.isInteger(r.P) && Number.isInteger(r.Q)),
  coherentBeatsIncoherentEveryOrder: IMP97294_PER_ORDER.every((r) => r.amp <= r.incoherentFloor + 1e-9),
  leadingOrderTightenRatio: IMP97294_COHERENT_MAJORANT.leadingTightenRatio, // ~4.27
  uniformConstantTightenRatio: IMP97294_COHERENT_MAJORANT.tightenRatio, // ~3.84
  C_coh: IMP97294_COHERENT_MAJORANT.C_coh,
  C_incoherent: IMP97294_COHERENT_MAJORANT.C_incoherent,
  noIntervalBesselLibraryNeeded: true,
  // What is NOT delivered (honest scope).
  fixedRationalV0OrderFourCertified: false, // full g(t)=O(t^-4) for a rational v0 NOT closed
  obstructionBStillOpen: 'imp-97164 degree-to-v0 overlap inversion d = C^T v0 (interval overlaps c_jk)',
  intervalMajorantProduced: false,
  operatorPositivityProved: false,
  boundChanged: false,
  subGap:
    'The z^-4 remainder majorant is now ~3.84x tighter via exact per-frequency regrouping (amp_j = sqrt(P_j^2+Q_j^2) replaces SUM_k |d_k| a_j(k)), leaving only ~1.19x slack from the single across-order triangle step. The residual blocker is unchanged: imp-97227 Obstruction B (the degree-to-v0 overlap inversion d = C^T v0, imp-97164) still needs interval overlaps c_jk, and Route B / IMP97100_PHASE_CANCELLATION_TRIAL does not close on the remainder bound alone.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97294_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97294_ASSERTIONS = [
  {
    id: 'imp97294-leading-j3-harmonic-collapse-exact',
    holds: () => {
      const { P, Q, amp } = harmonicPQ(3);
      // exact-integer P_3, Q_3 and amp_3 = sqrt(3465^2 + 45045^2); incoherent floor = 192780.
      return P === 3465 && Q === 45045 && Math.abs(amp - Math.hypot(3465, 45045)) < 1e-9 && incoherentFloor(3) === 192780;
    },
    why: 'at the leading order j=3 the degree sum over k collapses to the single harmonic 3465 cos z + 45045 sin z (exact integers), so its modulus is bounded by amp_3 = sqrt(3465^2+45045^2) ~= 45178, replacing the imp-97263 incoherent floor SUM_k |d_k| a_3(k) = 192780 -- a 4.27x tightening of the z^-4 leading coefficient.',
  },
  {
    id: 'imp97294-coherent-amplitude-beats-incoherent-floor-every-order',
    holds: () =>
      IMP97294_PER_ORDER.every((r) => Number.isInteger(r.P) && Number.isInteger(r.Q) && r.amp <= r.incoherentFloor + 1e-9) &&
      IMP97294_PER_ORDER.find((r) => r.j === 3).tightenRatio > 4,
    why: 'for every order j=3..7 the coherent amplitude amp_j = sqrt(P_j^2+Q_j^2) (with P_j, Q_j exact integers) is <= the imp-97263 incoherent floor SUM_k |d_k| a_j(k), and strictly smaller at the leading order (ratio > 4), so per-frequency regrouping is a genuine tightening at every order.',
  },
  {
    id: 'imp97294-uniform-coherent-constant-tighter-and-valid',
    holds: () => {
      const Ccoh = IMP97294_COHERENT_MAJORANT.C_coh;
      const Cinc = IMP97294_COHERENT_MAJORANT.C_incoherent;
      if (!(Number.isFinite(Ccoh) && Ccoh > 0 && Ccoh < Cinc && Cinc / Ccoh > 3)) return false;
      // the coherent constant rigorously bounds the true |SUM_k d_k R_k(z)| z^4 uniformly on z >= Z0.
      for (let z = Z0; z <= 20000; z += 11.37) {
        if (Math.abs(combinationRemainder(z)) * Math.pow(z, 4) > Ccoh + 1e-6) return false;
      }
      return true;
    },
    why: 'the coherent uniform-tail constant C_coh(Z0) = SUM_{j=3}^7 amp_j Z0^-(j-3) ~= 5.41e4 is finite, positive, more than 3x smaller than the imp-97263 incoherent 2.08e5, and still rigorously bounds the measured |SUM_k d_k R_k(z)| z^4 (peak ~4.53e4) for all sampled z >= Z0 -- a valid, strictly tighter O(z^-4) constant.',
  },
  {
    id: 'imp97294-tightening-only-no-qed',
    holds: () =>
      IMP97294_VERDICT.perOrderHarmonicCollapseExactInteger === true &&
      IMP97294_VERDICT.coherentBeatsIncoherentEveryOrder === true &&
      IMP97294_VERDICT.noIntervalBesselLibraryNeeded === true &&
      IMP97294_VERDICT.fixedRationalV0OrderFourCertified === false &&
      IMP97294_VERDICT.intervalMajorantProduced === false &&
      IMP97294_VERDICT.operatorPositivityProved === false &&
      IMP97294_VERDICT.boundChanged === false &&
      IMP97294_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97294_VERDICT.qed === false &&
      typeof IMP97294_VERDICT.subGap === 'string' &&
      IMP97294_VERDICT.subGap.includes('Obstruction B'),
    why: 'the majorant is tightened ~3.84x but the full g(t)=O(t^-4) certificate for a rational v0 is NOT closed: Obstruction B (the degree-to-v0 overlap inversion, imp-97164) still needs interval overlaps, so no interval majorant, no operator positivity, no bound change, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97294_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97294-krein-bessel-z4-coherent-jfreq-majorant assertion failed: ${t.id}`);
  }
}
