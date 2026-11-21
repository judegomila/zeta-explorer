/**
 * @module imp-97354-krein-routeb-relaxed-v0-tail-looseness
 *
 * imp-97354 (numerical, opus-4-8): INSTANTIATE the imp-97337 certified |g|-enclosure scheme for a
 * representative member of the imp-97113 6-carrier-functional 94-dim RELAXED family (a v0 that annihilates
 * only the six leading carrier functionals, leaving its own nonzero tail d_8..d_105) and MEASURE the resulting
 * Route C far-tail majorant constant and per-panel enclosure against the imp-97337 rational-trial baseline.
 * Measurement only; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * CONTEXT (imp-97337 residual R1). imp-97337 executed the certified interval-library-free per-panel |g|
 * enclosure and the closed-form Route C far-tail majorant |g(z)| <= C_far z^-4 (z >= Zfar) for the imp-97134
 * 8-sparse annihilating RATIONAL trial (degrees 0..7 only), giving C_far ~ 48524.3 -- valid for any fixed trial
 * by imp-96888, but LOOSE relative to the actual near-optimal ground state. imp-97338 CLOSED the exact-8-sparse
 * INVERSION branch (no committed v0 reproduces the imp-97134 trial: the band-triangular c_{jk} cascade forces
 * v0_2..v0_99 = 0, then the eight low-degree targets over-constrain v0_0, v0_1). It explicitly left the CORRECT
 * relaxation live: impose only the six imp-97113 carrier functionals on v0, leaving the 94-dim family, where
 * "every such v0 carries its OWN nonzero tail d_8..d_105". This leaf instantiates the enclosure scheme for a
 * representative such relaxed trial and MEASURES how much that free tail loosens the majorant.
 *
 * THE REPRESENTATIVE RELAXED TRIAL (degree level, exact integers). The six carrier functionals decouple by
 * parity into two rank-3 blocks (imp-97113); the imp-97134 base trial (even {0,2,4,6} -> (33,55,27,5), odd
 * {1,3,5,7} -> (143,273,165,35)) annihilates them with support 0..7. Because the sum of two annihilating trials
 * is annihilating, adding ANY pure-tail annihilating component keeps all six carriers zero while populating the
 * tail. This leaf builds a minimal-integer pure-tail annihilator on the next four degrees per parity via the
 * exact 3x4 cofactor kernel:
 *   EVEN degrees {8,10,12,14}  -> ( -225, -567, -475, -133 )
 *   ODD  degrees {9,11,13,15}  -> ( -261, -667, -567, -161 )
 * (each substituted into its imp-97113 rank-3 block gives all three residuals EXACTLY 0). The representative
 * relaxed trial is d = base + tail: a member of the 94-dim family with certified g = O(z^-4) (six carriers
 * annihilated) but a NONZERO tail on degrees 8..15 -- the honest stand-in for the "own nonzero tail d_8..d_105"
 * that imp-97338 flagged for every relaxed v0.
 *
 * THE MEASUREMENT (the deliverable). Assembling z g(z) = sin(z) S(z) + cos(z) C(z) FIRST (exact-integer s_m,
 * c_m from the DLMF 10.49 terminating P/Q, imp-97263/imp-97337) and applying the SAME Route C constant
 * C_far = SUM_{m>=3} (|s_m| + |c_m|) Zfar^-(m-3) (Zfar = a Tfar, Tfar = 60000):
 *   - the six-carrier annihilation still holds: s_0 = s_1 = s_2 = c_0 = c_1 = c_2 = 0 (g = O(z^-4) preserved);
 *   - but the far-tail constant JUMPS to C_far ~ 5.18e6, a factor ~106.7 LOOSER than the 8-sparse baseline
 *     48524.3, because the dominant m=3 order coefficient (|s_3| + |c_3|) rises from 48510 to ~5.17e6:
 *     the six carrier functionals kill only the z^-1, z^-2, z^-3 CARRIER orders (s_0..2, c_0..2), NOT the
 *     assembled-polynomial z^-3 coefficient s_3, c_3, which the free tail degrees d_8..d_15 dominate.
 *   - the certified per-panel enclosure still brackets the exact g at every panel near z = T a (worst
 *     (true sup)/(enclosure) ~ 0.947, < 1), so the scheme instantiates cleanly on the relaxed trial.
 *
 * HONEST READING. Imposing ONLY the six carrier functionals does NOT tighten the Route C majorant -- a generic
 * relaxed member is ~107x LOOSER than the sparse baseline, because the majorant is governed by an assembled-
 * polynomial coefficient (s_3, c_3) that the six carriers leave FREE. Making the majorant tight therefore needs
 * more than the relaxation: it needs the actual near-optimal v0, i.e. the member of the 94-dim family that
 * MINIMIZES |s_3| + |c_3| (and the higher tail), which is exactly the further optimization the relaxation does
 * not perform. Two-sided c_{jk} interval control (IMP97015_ARB_INTERVAL_BESSEL) -- required to certify the tail
 * of an actual committed v0 rather than a hand-built degree trial -- remains open.
 *
 * SCOPE. Measurement / instantiation only for a representative degree-level relaxed trial (rigorous upper bound
 * for any fixed trial by imp-96888, but this trial is a stand-in, not a committed near-optimal v0). Produces no
 * committed v0, no interval majorant, no operator positivity; Rayleigh floors stay UPPER bounds; interval-
 * rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97337-krein-routeb-certified-bessel-enclosure.js (the scheme; 8-sparse baseline C_far ~ 48524.3)
 * @see imp-97338-krein-cjk-exact-band-inversion-obstruction.js (closes 8-sparse inversion; leaves 6-carrier relaxation live)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (six carrier functionals; 94-dim v0 family)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the base 8-sparse annihilating trial)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (Rayleigh reduction; rigorous for any trial v0)
 *
 * Ticket: imp-97354 (numerical, opus-4-8, medium). Measurement / instantiation only; changes no bound; NO QED.
 * Import-light: two light literal imports (imp-97134 base trial, imp-97113 carrier functionals), no zeros bundle.
 */

import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';
import { IMP97113_FUNCTIONALS } from './imp-97113-krein-bessel-asymptotic-annihilation-scope.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const T = 4800; // binding rung t-truncation (imp-97184)
const TFAR = 60000; // Route C far-tail cutoff (imp-97337)
const ZFAR = a * TFAR;
const KMAX = 15; // representative relaxed tail reaches degree 15 (base 0..7 + tail 8..15)
const LEN = KMAX + 1;

// exact Hankel coefficient a_j(k) = (k+j)!/(2^j j!(k-j)!); positive integer for 0<=j<=k, zero for j>k.
function aCoeff(k, j) {
  if (j < 0 || j > k) return 0;
  let num = 1;
  for (let i = k - j + 1; i <= k + j; i++) num *= i; // (k+j)!/(k-j)!
  let den = Math.pow(2, j);
  for (let i = 2; i <= j; i++) den *= i; // 2^j j!
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

// Build the representative relaxed trial d = base (imp-97134) + pure-tail annihilator on degrees 8..15.
const EVEN_TAIL_DEG = [8, 10, 12, 14];
const ODD_TAIL_DEG = [9, 11, 13, 15];
const EVEN_TAIL_KER = kernel3x4(EVEN_TAIL_DEG.map((k) => IMP97113_FUNCTIONALS.evenRow(k)));
const ODD_TAIL_KER = kernel3x4(ODD_TAIL_DEG.map((k) => IMP97113_FUNCTIONALS.oddRow(k)));

const BASE_DK = Object.freeze({ ...IMP97134_TRIALS.even, ...IMP97134_TRIALS.odd });
const RELAXED_DK = (() => {
  const d = { ...BASE_DK };
  EVEN_TAIL_DEG.forEach((k, i) => (d[k] = (d[k] || 0) + EVEN_TAIL_KER[i]));
  ODD_TAIL_DEG.forEach((k, i) => (d[k] = (d[k] || 0) + ODD_TAIL_KER[i]));
  return Object.freeze(d);
})();

// residual of the six imp-97113 carrier functionals on a degree map (must be all-zero for annihilation).
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

const BASE_POLY = assemble(BASE_DK);
const RELAX_POLY = assemble(RELAXED_DK);

// Route C far-tail constant: |g(z)| <= C_far z^-4 for z >= Zfar, from the assembled integer coefficients.
function routeCConstant(s, c, Zfar) {
  let cfar = 0;
  for (let m = 3; m < s.length; m++) cfar += (Math.abs(s[m]) + Math.abs(c[m])) * Math.pow(Zfar, -(m - 3));
  return cfar;
}
const C_FAR_BASE = routeCConstant(BASE_POLY.s, BASE_POLY.c, ZFAR);
const C_FAR_RELAX = routeCConstant(RELAX_POLY.s, RELAX_POLY.c, ZFAR);

// exact P/Q value of j_k(z) (DLMF 10.49) -- used only to CHECK the enclosure/decay, never inside the bound.
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

// certified sup of |sin z| / |cos z| over [zL, zR]: endpoints, or 1 if an interior peak lies inside.
function trigSup(zL, zR, kind) {
  const off = kind === 'sin' ? Math.PI / 2 : 0;
  const nlo = Math.ceil((zL - off) / Math.PI);
  const nhi = Math.floor((zR - off) / Math.PI);
  if (nhi >= nlo) return 1;
  const f = kind === 'sin' ? Math.sin : Math.cos;
  return Math.max(Math.abs(f(zL)), Math.abs(f(zR)));
}
function enclosureUpper(s, c, zL, zR) {
  let Sbar = 0;
  let Cbar = 0;
  for (let m = 0; m < s.length; m++) {
    Sbar += Math.abs(s[m]) * Math.pow(zL, -m);
    Cbar += Math.abs(c[m]) * Math.pow(zL, -m);
  }
  return (trigSup(zL, zR, 'sin') * Sbar + trigSup(zL, zR, 'cos') * Cbar) / zL;
}

// -- verification measurements (reliable-float z window near the binding rung z = T a) --
const VERIFY = (() => {
  let ok = true;
  let worst = 0;
  let nPan = 0;
  for (let z = T * a; z < T * a + 200; z += 0.7) {
    const U = enclosureUpper(RELAX_POLY.s, RELAX_POLY.c, z, z + 0.7);
    let mx = 0;
    for (let i = 0; i <= 200; i++) mx = Math.max(mx, Math.abs(gTrue(RELAXED_DK, z + 0.7 * (i / 200))));
    nPan++;
    if (mx > U) ok = false;
    worst = Math.max(worst, mx / U);
  }
  // relaxed trial decay: |g| z^4 stays bounded (g = O(z^-4)) across a ladder above the float floor.
  const gz4 = [200, 400, 800, 1600].map((z) => Math.abs(gTrue(RELAXED_DK, z)) * z ** 4);
  return { ok, worst, nPan, gz4Max: Math.max(...gz4) };
})();

const CARRIER_RES_RELAX = carrierResidual(RELAXED_DK);
const RELAX_LEADS_ZERO = [0, 1, 2].every(
  (m) => RELAX_POLY.s[m] === 0 && RELAX_POLY.c[m] === 0,
);

export const IMP97354_MEASUREMENT = Object.freeze({
  aRung: a,
  T,
  Tfar: TFAR,
  Zfar: ZFAR,
  baseTrial: BASE_DK, // imp-97134 8-sparse (degrees 0..7)
  evenTailKernel: Object.freeze({ degrees: EVEN_TAIL_DEG, coeffs: EVEN_TAIL_KER }),
  oddTailKernel: Object.freeze({ degrees: ODD_TAIL_DEG, coeffs: ODD_TAIL_KER }),
  relaxedTrial: RELAXED_DK, // base + pure-tail annihilator on degrees 8..15
  relaxedTailDegrees: Object.freeze([...EVEN_TAIL_DEG, ...ODD_TAIL_DEG].sort((x, y) => x - y)),
  sixCarriersAnnihilated: RELAX_LEADS_ZERO, // s_0..2 = c_0..2 = 0 still holds
  carrierResidualRelax: CARRIER_RES_RELAX, // all six functionals still exactly 0
  m3BaselineAbsSum: Math.abs(BASE_POLY.s[3]) + Math.abs(BASE_POLY.c[3]), // 48510
  m3RelaxedAbsSum: Math.abs(RELAX_POLY.s[3]) + Math.abs(RELAX_POLY.c[3]), // ~5.17e6
  cFarBaseline: C_FAR_BASE, // ~48524.3 (matches imp-97337)
  cFarRelaxed: C_FAR_RELAX, // ~5.18e6
  cFarLoosenessRatio: C_FAR_RELAX / C_FAR_BASE, // ~106.7x looser
  relaxedGDecayBoundedGz4Max: VERIFY.gz4Max, // |g| z^4 bounded => g = O(z^-4)
  panelsChecked: VERIFY.nPan,
  enclosureBracketsRelaxedG: VERIFY.ok, // true at every panel
  worstTrueOverUpper: VERIFY.worst, // < 1 => valid upper bound (~0.947)
});

export const IMP97354_VERDICT = Object.freeze({
  ticket: 'imp-97354',
  question:
    'instantiate the imp-97337 certified |g|-enclosure scheme for a representative member of the imp-97113 6-carrier-functional 94-dim relaxed family (a v0 annihilating only the six carrier functionals, carrying its own nonzero tail d_8..d_105) and measure the resulting Route C far-tail majorant constant and per-panel enclosure vs the imp-97337 8-sparse rational-trial baseline (C_far ~ 48524.3).',
  answer:
    'A representative relaxed trial is the imp-97134 8-sparse base plus a minimal-integer pure-tail annihilator on the next four degrees per parity (even {8,10,12,14} -> (-225,-567,-475,-133), odd {9,11,13,15} -> (-261,-667,-567,-161)), each an exact 3x4 cofactor kernel of the imp-97113 parity block. The sum still annihilates all six carrier functionals exactly (s_0=s_1=s_2=c_0=c_1=c_2=0, g = O(z^-4) preserved, |g| z^4 bounded), and the certified per-panel enclosure still brackets the exact g at every panel near z = T a (worst (true sup)/(enclosure) ~ 0.947 < 1) -- so the scheme instantiates cleanly on the relaxed trial. BUT the Route C far-tail constant C_far = SUM_{m>=3}(|s_m|+|c_m|) Zfar^-(m-3) JUMPS from the 8-sparse baseline 48524.3 to ~5.18e6, a factor ~106.7 LOOSER, because the dominant m=3 coefficient |s_3|+|c_3| rises from 48510 to ~5.17e6: the six carriers kill only the z^-1,z^-2,z^-3 CARRIER orders, NOT the assembled-polynomial z^-3 coefficient (s_3,c_3) that the free tail degrees d_8..d_15 dominate. HONEST READING: imposing only the six carrier functionals does NOT tighten the majorant -- a generic relaxed member is ~107x looser than the sparse baseline; making it tight needs the actual near-optimal v0 (the family member MINIMIZING |s_3|+|c_3| and the higher tail), a further optimization the relaxation does not perform, and certifying the tail of a committed v0 rather than a hand-built degree trial still needs two-sided c_{jk} interval control (IMP97015_ARB_INTERVAL_BESSEL).',
  // what IS measured
  schemeInstantiatedOnRelaxedTrial: true,
  sixCarriersStillAnnihilated: RELAX_LEADS_ZERO,
  relaxedGisOrderFour: VERIFY.gz4Max < 1e8, // |g| z^4 bounded
  enclosureBracketsRelaxedG: VERIFY.ok,
  worstTrueOverUpper: VERIFY.worst,
  cFarBaseline: C_FAR_BASE,
  cFarRelaxed: C_FAR_RELAX,
  cFarLoosenessRatio: C_FAR_RELAX / C_FAR_BASE, // ~106.7
  relaxationAloneTightensMajorant: false, // it LOOSENS it ~107x; tail is free
  tightMajorantNeedsNearOptimalV0: true, // minimize |s_3|+|c_3| over the 94-dim family
  // honest scope
  committedV0Produced: false, // degree-level stand-in, not a committed near-optimal v0
  twoSidedCjkIntervalControlOpen: 'IMP97015_ARB_INTERVAL_BESSEL', // needed for an actual committed v0 tail
  intervalMajorantProduced: false,
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97337 residual R1 MEASURED: instantiating the certified |g|-enclosure + Route C far-tail majorant for a representative member of the imp-97113 6-carrier 94-dim relaxed family (imp-97134 base + exact pure-tail annihilator on degrees 8..15) keeps all six carriers annihilated (g = O(z^-4), enclosure brackets the exact g, worst true/upper ~0.947) but LOOSENS the Route C constant from the 8-sparse baseline 48524.3 to ~5.18e6 (~106.7x), the m=3 assembled coefficient |s_3|+|c_3| rising 48510 -> ~5.17e6. The six carriers do NOT constrain s_3,c_3, so tightening needs the actual near-optimal v0 (family member minimizing |s_3|+|c_3| and the higher tail); certifying the tail of a committed v0 rather than a degree stand-in still needs two-sided c_{jk} interval control (IMP97015_ARB_INTERVAL_BESSEL). No committed v0, no interval majorant, no bound change.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97354_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97354_ASSERTIONS = [
  {
    id: 'imp97354-tail-annihilator-exact-and-carriers-vanish',
    holds: () => {
      // the pure-tail kernels annihilate their parity blocks, and the relaxed trial keeps all six carriers zero
      const evenTailRes = [0, 0, 0];
      EVEN_TAIL_DEG.forEach((k, i) => {
        const row = IMP97113_FUNCTIONALS.evenRow(k);
        for (let t = 0; t < 3; t++) evenTailRes[t] += EVEN_TAIL_KER[i] * row[t];
      });
      const oddTailRes = [0, 0, 0];
      ODD_TAIL_DEG.forEach((k, i) => {
        const row = IMP97113_FUNCTIONALS.oddRow(k);
        for (let t = 0; t < 3; t++) oddTailRes[t] += ODD_TAIL_KER[i] * row[t];
      });
      const tailZero = evenTailRes.every((v) => v === 0) && oddTailRes.every((v) => v === 0);
      const tailNonTrivial =
        EVEN_TAIL_KER.some((v) => v !== 0) && ODD_TAIL_KER.some((v) => v !== 0);
      const carriersZero =
        CARRIER_RES_RELAX.evenVals.every((v) => v === 0) &&
        CARRIER_RES_RELAX.oddVals.every((v) => v === 0);
      return tailZero && tailNonTrivial && carriersZero && RELAX_LEADS_ZERO;
    },
    why: 'the exact-integer pure-tail cofactor kernels on degrees {8,10,12,14}/{9,11,13,15} annihilate their imp-97113 parity blocks exactly, so the relaxed trial (base + tail) keeps all six carrier functionals zero and s_0..2 = c_0..2 = 0 (g = O(z^-4) preserved) while carrying a genuine nonzero tail.',
  },
  {
    id: 'imp97354-baseline-matches-imp97337',
    holds: () => C_FAR_BASE > 4.8e4 && C_FAR_BASE < 4.9e4,
    why: 'the 8-sparse baseline Route C constant recomputed here (~48524.3) matches the imp-97337 value, confirming the same enclosure scheme is instantiated before the relaxed trial is measured against it.',
  },
  {
    id: 'imp97354-relaxed-tail-loosens-majorant',
    holds: () =>
      C_FAR_RELAX > 5e6 &&
      C_FAR_RELAX / C_FAR_BASE > 100 &&
      C_FAR_RELAX / C_FAR_BASE < 115 &&
      IMP97354_MEASUREMENT.m3RelaxedAbsSum > 5e6 &&
      IMP97354_MEASUREMENT.m3BaselineAbsSum < 5e4,
    why: 'the representative relaxed trial LOOSENS the Route C far-tail constant to ~5.18e6 (~106.7x the 8-sparse baseline), driven by the m=3 assembled coefficient |s_3|+|c_3| rising from 48510 to ~5.17e6 -- the six carriers do not constrain s_3,c_3, so the free tail dominates.',
  },
  {
    id: 'imp97354-enclosure-still-brackets-relaxed-g',
    holds: () =>
      VERIFY.ok === true &&
      VERIFY.nPan >= 100 &&
      VERIFY.worst < 1 &&
      VERIFY.worst > 0.8 &&
      VERIFY.gz4Max < 1e8,
    why: 'the certified per-panel enclosure upper-bounds the exact relaxed g at every panel near z = T a (worst true/upper ~0.947 in (0.8,1)) and |g| z^4 stays bounded (< 1e8), confirming the scheme instantiates cleanly on the relaxed trial that decays as O(z^-4).',
  },
  {
    id: 'imp97354-measurement-only-no-qed',
    holds: () =>
      IMP97354_VERDICT.relaxationAloneTightensMajorant === false &&
      IMP97354_VERDICT.tightMajorantNeedsNearOptimalV0 === true &&
      IMP97354_VERDICT.committedV0Produced === false &&
      IMP97354_VERDICT.twoSidedCjkIntervalControlOpen === 'IMP97015_ARB_INTERVAL_BESSEL' &&
      IMP97354_VERDICT.intervalMajorantProduced === false &&
      IMP97354_VERDICT.operatorPositivityProved === false &&
      IMP97354_VERDICT.boundChanged === false &&
      IMP97354_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97354_VERDICT.qed === false &&
      typeof IMP97354_VERDICT.subGap === 'string' &&
      IMP97354_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'measurement/instantiation only: the relaxed-trial tail looseness (~107x) is measured for a degree-level stand-in, no committed near-optimal v0 is produced, two-sided c_{jk} interval control stays open, no interval majorant, Rayleigh floor stays an UPPER bound, no bound moves, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97354_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97354-krein-routeb-relaxed-v0-tail-looseness assertion failed: ${t.id}`);
  }
}
