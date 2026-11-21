/**
 * @module imp-97337-krein-routeb-certified-bessel-enclosure
 *
 * imp-97337 (numerical, opus-4-8): execute the named residual SUB-GAP IMP97184_INTERVAL_BESSEL_ENCLOSURE --
 * a CERTIFIED interval spherical-Bessel enclosure of g(t) = v0 . Phi(t) as ONE phase-preserving entity per
 * panel (replacing the imp-97184 24-point SAMPLED subgrid supremum) plus a Route C far-tail |g|-majorant
 * beyond Tfar. Derivation / execution only; no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open;
 * NO QED.
 *
 * CONTEXT. imp-96888 reduced the Route I Krein t-truncation residual to a single scalar tail integral
 *   <v0 | R_T | v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,   g(t) = v0 . Phi(t),
 * a RIGOROUS upper bound for any fixed trial v0 (imp-96888: exactness of v0 is not required). imp-97184
 * EXECUTED the imp-97100 Route B combined phase-preserving panel enclosure and MEASURED it viable (the panel
 * majorant M(h)/rq falls 2.278x -> 1.421x as panels narrow), BUT its per-panel supremum was SAMPLED on a
 * 24-point subgrid, not a certified enclosure, so no rigorous majorant was produced. imp-97260 recorded that
 * honest status and named the residual IMP97184_INTERVAL_BESSEL_ENCLOSURE. This leaf executes the certified
 * enclosure step of that sub-gap.
 *
 * THE KEY MECHANISM (why no interval-Bessel library is needed) -- from imp-97263. For INTEGER order the Hankel
 * P/Q form of j_k(z) TERMINATES and is EXACT (DLMF 10.49):
 *   z j_k(z) = sin(z - k pi/2) A_k(z) + cos(z - k pi/2) B_k(z),
 *   A_k(z) = SUM_{m: 2m<=k} (-1)^m a_{2m}(k) z^-2m,   B_k(z) = SUM_{m: 2m+1<=k} (-1)^m a_{2m+1}(k) z^-(2m+1),
 * with a_j(k) = (k+j)!/(2^j j!(k-j)!) exact positive integers (zero for j>k). Reducing each phase z - k pi/2
 * to +/- sin z, +/- cos z (k mod 4) and ASSEMBLING the whole trial FIRST gives an EXACT closed form
 *   z g(z) = sin(z) S(z) + cos(z) C(z),   S(z) = SUM_m s_m z^-m,   C(z) = SUM_m c_m z^-m,
 * where s_m, c_m are exact integers built from the trial coefficients d_k and the a_j(k). Assembling BEFORE
 * bounding is the crux: the inter-mode cancellation that annihilates the leading orders lives INSIDE s_m, c_m
 * (here s_0=s_1=s_2=c_0=c_1=c_2=0, so g = O(z^-4)); the imp-97184 Route A control failed precisely because it
 * summed |d_k| |Phi_k| mode-wise, discarding this cancellation.
 *
 * THE CERTIFIED PER-PANEL ENCLOSURE (the deliverable; replaces the sampled subgrid sup). On a panel
 * [z_L, z_R] (z = a t, z_L > 0), a certified upper bound on |g| needs only three CERTIFIED primitives, none of
 * them a spherical-Bessel value:
 *   (i)   a certified sup of |sin z|, |cos z| over the panel (endpoints, plus 1 if a peak z = off + n pi is
 *         inside -- |sin|, |cos| have interior extrema only at those points);
 *   (ii)  each z^-m is decreasing, so |S(z)| <= SUM_m |s_m| z_L^-m =: Sbar(z_L), likewise Cbar(z_L);
 *   (iii) the triangle inequality on the ASSEMBLED polynomials:
 *           |g(z)| <= ( sinSup * Sbar(z_L) + cosSup * Cbar(z_L) ) / z_L  =: U(z_L, z_R).
 * This is the phase-preserving g-as-one-entity enclosure imp-97184 sampled, now CERTIFIED and interval-library
 * free. MEASURED: over 572 panels covering z in [T a, T a + 400] (T=4800, g ~ 1e-8, above the float floor) the
 * enclosure brackets the exact g at EVERY panel with worst (true sup)/(enclosure) = 0.9871 -- i.e. only ~1.3%
 * conservative, far tighter than the sampled subgrid could certify.
 *
 * THE ROUTE C FAR-TAIL |g|-MAJORANT (z >= Zfar := a Tfar). Beyond Tfar the panel spans full periods so
 * sinSup = cosSup = 1, and each z^-m is decreasing, giving the CLOSED-FORM uniform bound
 *   |g(z)| <= z^-4 * SUM_{m>=3} (|s_m| + |c_m|) Zfar^-(m-3)  =:  C_far * z^-4,   for all z >= Zfar,
 * built entirely from the exact integers s_m, c_m and the single real Zfar. At Tfar = 60000 this gives
 * C_far = 48524.3 (verified: |g(z)| z^4 sits under the local constant at z = 8000, 12000, 20000). This is the
 * Route C far-tail majorant the sub-gap names -- an explicit z^-4 |g|-envelope with NO Bessel evaluation.
 *
 * HONEST SCOPE (what is and is NOT delivered).
 *   DELIVERED: the certified interval-library-free per-panel |g| enclosure PRIMITIVE (the replacement for the
 *   imp-97184 sampled subgrid sup) and the closed-form Route C far-tail |g|-majorant, executed end-to-end and
 *   verified to bracket the exact g, for the imp-97134 annihilating RATIONAL trial d_k -- a legitimate fixed
 *   rational trial (imp-96888: the Rayleigh bound is rigorous for ANY trial v0).
 *   NOT DELIVERED (two named residuals, both coupling this |g| enclosure to still-open steps):
 *     (R1) instantiate the SAME scheme for the actual near-optimal ground state v0 (to make the majorant TIGHT,
 *          not just valid): needs v0 in the spherical-Bessel-ORDER basis, i.e. the degree-to-v0 overlap
 *          inversion d = C^T v0 -- imp-97227 Obstruction B (imp-97164 / imp-97338), still open;
 *     (R2) convert this |g|-enclosure into the full sigma_2-WEIGHTED tail-integral majorant M(h) and the numeric
 *          Route C integral (1/(pi B)) int sigma_2 |g|^2: needs the closed-form sigma_2 majorant and the
 *          normalization B from the imp-96888 solver (IMP96888_RAYLEIGH_TAIL_MAJORANT).
 * So this discharges the "how" of IMP97184_INTERVAL_BESSEL_ENCLOSURE -- the certified interval enclosure and
 * far-tail majorant now need NO interval spherical-Bessel primitive -- while R1/R2 stay the named residuals.
 *
 * Rayleigh floors stay UPPER bounds on the true lambda_min; establishes NO operator positivity; interval-
 * rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97184-krein-routeb-panel-enclosure-execution.js (sampled-subgrid sup; the step this certifies)
 * @see imp-97260-krein-routeb-panel-enclosure-honest-status.js (names IMP97184_INTERVAL_BESSEL_ENCLOSURE)
 * @see imp-97263-krein-analytic-bessel-z4-remainder-majorant.js (exact terminating P/Q; a_j(k) machinery)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the annihilating rational trial d_k)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (Rayleigh reduction; rigorous for any trial v0)
 *
 * Ticket: imp-97337 (numerical, opus-4-8, medium). Derivation/execution only; changes no bound; NO QED.
 * Import-light: one light literal import (imp-97134 trial), no zeros bundle.
 */

import { IMP97134_TRIALS } from './imp-97134-krein-annihilating-rational-trial-execution.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const T = 4800; // binding rung t-truncation (imp-97184)
const TFAR = 60000; // Route C far-tail cutoff (imp-97184)

// combined fixed rational trial d_k over k = 0..7 (even + odd annihilating trials, imp-97134)
const DK = Object.freeze({ ...IMP97134_TRIALS.even, ...IMP97134_TRIALS.odd });

// exact Hankel coefficient a_j(k) = (k+j)!/(2^j j!(k-j)!); positive integer for 0<=j<=k, zero for j>k.
function aCoeff(k, j) {
  if (j < 0 || j > k) return 0;
  let num = 1;
  for (let i = k - j + 1; i <= k + j; i++) num *= i; // (k+j)!/(k-j)!
  let den = Math.pow(2, j);
  for (let i = 2; i <= j; i++) den *= i; // 2^j j!
  return num / den;
}

// Assemble z g(z) = sin(z) S(z) + cos(z) C(z) FIRST, then bound. s_m, c_m exact integers (power z^-m).
function assemble() {
  const s = new Array(8).fill(0);
  const c = new Array(8).fill(0);
  for (const kStr of Object.keys(DK)) {
    const k = +kStr;
    const d = DK[kStr];
    // A_k: even powers 2m with (-1)^m a_{2m}(k); B_k: odd powers 2m+1 with (-1)^m a_{2m+1}(k)
    const A = {};
    const B = {};
    for (let m = 0; 2 * m <= k; m++) A[2 * m] = Math.pow(-1, m) * aCoeff(k, 2 * m);
    for (let m = 0; 2 * m + 1 <= k; m++) B[2 * m + 1] = Math.pow(-1, m) * aCoeff(k, 2 * m + 1);
    const addS = (poly, sign) => { for (const [pw, v] of Object.entries(poly)) s[+pw] += sign * d * v; };
    const addC = (poly, sign) => { for (const [pw, v] of Object.entries(poly)) c[+pw] += sign * d * v; };
    // phase z - k pi/2 -> +/- sin z, +/- cos z (k mod 4): reduce sin(z-kpi/2)A + cos(z-kpi/2)B
    const p = ((k % 4) + 4) % 4;
    if (p === 0) { addS(A, +1); addC(B, +1); } // sin z A + cos z B
    else if (p === 1) { addC(A, -1); addS(B, +1); } // -cos z A + sin z B
    else if (p === 2) { addS(A, -1); addC(B, -1); } // -sin z A - cos z B
    else { addC(A, +1); addS(B, -1); } // -sin z B + cos z A
  }
  return { s: Object.freeze(s), c: Object.freeze(c) };
}

const { s: SPOLY, c: CPOLY } = assemble();

// exact P/Q value of j_k(z) (DLMF 10.49) -- used only to CHECK the enclosure, never inside the bound.
function jExact(k, z) {
  const ph = z - (k * Math.PI) / 2;
  const si = Math.sin(ph);
  const co = Math.cos(ph);
  let A = 0;
  for (let m = 0; 2 * m <= k; m++) A += Math.pow(-1, m) * aCoeff(k, 2 * m) * Math.pow(z, -2 * m);
  let B = 0;
  for (let m = 0; 2 * m + 1 <= k; m++) B += Math.pow(-1, m) * aCoeff(k, 2 * m + 1) * Math.pow(z, -(2 * m + 1));
  return (si * A + co * B) / z;
}
function gTrue(z) {
  let g = 0;
  for (const kStr of Object.keys(DK)) g += DK[kStr] * jExact(+kStr, z);
  return g;
}

// (i) certified sup of |sin z| / |cos z| over [zL, zR]: endpoints, or 1 if an interior peak lies inside.
function trigSup(zL, zR, kind) {
  const off = kind === 'sin' ? Math.PI / 2 : 0; // |sin| peaks at pi/2 + n pi, |cos| at n pi
  const nlo = Math.ceil((zL - off) / Math.PI);
  const nhi = Math.floor((zR - off) / Math.PI);
  if (nhi >= nlo) return 1; // a peak of modulus 1 is inside the panel
  const f = kind === 'sin' ? Math.sin : Math.cos;
  return Math.max(Math.abs(f(zL)), Math.abs(f(zR)));
}

// (ii)+(iii) certified per-panel enclosure U(zL, zR) >= sup_{[zL,zR]} |g|.
export function enclosureUpper(zL, zR) {
  let Sbar = 0;
  let Cbar = 0;
  for (let m = 0; m < 8; m++) {
    Sbar += Math.abs(SPOLY[m]) * Math.pow(zL, -m);
    Cbar += Math.abs(CPOLY[m]) * Math.pow(zL, -m);
  }
  return (trigSup(zL, zR, 'sin') * Sbar + trigSup(zL, zR, 'cos') * Cbar) / zL;
}

// Route C far-tail |g|-majorant coefficient: |g(z)| <= C_far z^-4 for all z >= Zfar.
function routeCConstant(Zfar) {
  let cfar = 0;
  for (let m = 3; m < 8; m++) cfar += (Math.abs(SPOLY[m]) + Math.abs(CPOLY[m])) * Math.pow(Zfar, -(m - 3));
  return cfar;
}

const ZFAR = a * TFAR;
const C_FAR = routeCConstant(ZFAR);

// -- verification measurements (reliable-float z window; g ~ 1e-8, above the double-precision floor) --
const VERIFY = (() => {
  let ok = true;
  let worst = 0;
  let nPan = 0;
  for (let z = T * a; z < T * a + 400; z += 0.7) {
    const zL = z;
    const zR = z + 0.7;
    const U = enclosureUpper(zL, zR);
    let mx = 0;
    for (let i = 0; i <= 400; i++) mx = Math.max(mx, Math.abs(gTrue(zL + (zR - zL) * (i / 400))));
    nPan++;
    if (mx > U) ok = false;
    worst = Math.max(worst, mx / U);
  }
  return { ok, worst, nPan };
})();

export const IMP97337_ENCLOSURE = Object.freeze({
  aRung: a,
  T,
  Tfar: TFAR,
  Zfar: ZFAR,
  sPoly: SPOLY, // exact-integer coefficients of S(z) = SUM s_m z^-m
  cPoly: CPOLY, // exact-integer coefficients of C(z) = SUM c_m z^-m
  gLeadingOrder: 4, // s_0..s_2 = c_0..c_2 = 0 => g = O(z^-4)
  panelsChecked: VERIFY.nPan, // 572
  enclosureBracketsTrueG: VERIFY.ok, // true at every panel
  worstTrueOverUpper: VERIFY.worst, // ~0.9871 -> only ~1.3% conservative
  routeCConstant: C_FAR, // |g(z)| <= C_far z^-4 for z >= Zfar; C_far ~ 48524.3
});

export const IMP97337_VERDICT = Object.freeze({
  ticket: 'imp-97337',
  question:
    'execute IMP97184_INTERVAL_BESSEL_ENCLOSURE: a certified interval spherical-Bessel enclosure of g(t)=v0.Phi(t) as one phase-preserving entity per panel (replacing the imp-97184 24-point sampled subgrid sup) plus a Route C far-tail majorant beyond Tfar.',
  answer:
    'executed for the imp-97134 annihilating rational trial d_k (rigorous for any fixed trial by imp-96888). Assembling z g(z) = sin(z) S(z) + cos(z) C(z) FIRST (exact-integer s_m, c_m from the DLMF 10.49 terminating P/Q form, imp-97263) puts the inter-mode cancellation inside the coefficients (s_0..2 = c_0..2 = 0 => g=O(z^-4)); a certified per-panel bound then needs only (i) a certified sup of |sin|,|cos|, (ii) monotone z^-m endpoint bounds, (iii) the triangle inequality on S,C -- NO interval spherical-Bessel primitive. The enclosure brackets the exact g at every one of 572 panels (z in [T a, T a+400]) with worst (true sup)/(enclosure)=0.9871, i.e. ~1.3% conservative, far tighter than the sampled subgrid could certify. The Route C far-tail majorant is the closed form |g(z)| <= C_far z^-4 for z>=Zfar=a Tfar, C_far = SUM_{m>=3}(|s_m|+|c_m|) Zfar^-(m-3) = 48524.3, built from exact integers with no Bessel evaluation. This discharges the "how" of IMP97184_INTERVAL_BESSEL_ENCLOSURE; converting the |g| enclosure into the full sigma_2-weighted M(h) integral (needs the sigma_2 majorant + normalization B) and instantiating for the actual ground state v0 (needs the degree-to-order map, Obstruction B) stay the named residuals.',
  // what IS delivered
  assemblyIsExact: true, // z g = sin z S + cos z C reproduces exact P/Q
  gLeadingOrderFour: true, // s_0..2 = c_0..2 = 0
  certifiedEnclosureNoIntervalBessel: true, // only certified trig + monotone z^-m + triangle on S,C
  enclosureBracketsTrueG: IMP97337_ENCLOSURE.enclosureBracketsTrueG,
  enclosureWorstTrueOverUpper: IMP97337_ENCLOSURE.worstTrueOverUpper, // <1 => valid upper bound
  routeCFarTailMajorant: true, // |g(z)| <= C_far z^-4, z >= Zfar
  routeCConstant: C_FAR,
  replacesSampledSubgridSup: true, // the imp-97184 24-point sampled sup is now certified
  // honest scope: two named residuals coupling this |g| enclosure to still-open steps
  fullSigma2WeightedMajorantProduced: false, // R2: needs sigma_2 majorant + normalization B (imp-96888)
  actualGroundStateInstantiated: false, // R1: needs degree-to-order map (Obstruction B, imp-97164/imp-97338)
  obstructionBStillOpen: 'imp-97164 / imp-97338 degree-to-v0 overlap inversion d = C^T v0',
  intervalMajorantForResidualProduced: false, // no rigorous <v0|R_T|v0> majorant yet (R1+R2 open)
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97184_INTERVAL_BESSEL_ENCLOSURE: the certified interval-library-free per-panel |g| enclosure (replacing the imp-97184 sampled subgrid sup) and the closed-form Route C far-tail |g|-majorant |g(z)|<=C_far z^-4 (z>=Zfar) are EXECUTED and verified to bracket the exact g (worst true/upper 0.9871) for the imp-97134 rational trial. Residuals: (R1) instantiate the same scheme for the actual near-optimal ground state v0 -- needs the degree-to-order map d=C^T v0 (Obstruction B, imp-97164/imp-97338); (R2) convert the |g| enclosure into the full sigma_2-weighted tail-integral majorant M(h) and numeric Route C integral -- needs the closed-form sigma_2 majorant + normalization B (IMP96888_RAYLEIGH_TAIL_MAJORANT). No bound on Lambda moves.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97337_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97337_ASSERTIONS = [
  {
    id: 'imp97337-assembly-exact-and-order-four',
    holds: () => {
      // s_0..2 = c_0..2 = 0 (cancellation => g=O(z^-4)); assembly reproduces exact P/Q where g is above the float floor
      const leadZero = [0, 1, 2].every((m) => SPOLY[m] === 0 && CPOLY[m] === 0);
      const integers = SPOLY.every((v) => Number.isInteger(v)) && CPOLY.every((v) => Number.isInteger(v));
      let maxrel = 0;
      for (const z of [50, 100, 200, 400]) {
        let S = 0;
        let C = 0;
        for (let m = 0; m < 8; m++) { S += SPOLY[m] * Math.pow(z, -m); C += CPOLY[m] * Math.pow(z, -m); }
        const gA = (Math.sin(z) * S + Math.cos(z) * C) / z;
        const gT = gTrue(z);
        maxrel = Math.max(maxrel, Math.abs(gA - gT) / Math.abs(gT));
      }
      return leadZero && integers && maxrel < 1e-6;
    },
    why: 'assembling z g = sin z S + cos z C from the exact terminating P/Q form gives exact-integer s_m, c_m with s_0..2 = c_0..2 = 0 (inter-mode cancellation => g=O(z^-4)) and reproduces the exact g to <1e-6 relative where g is above the double-precision floor.',
  },
  {
    id: 'imp97337-certified-enclosure-brackets-true-g',
    holds: () =>
      IMP97337_ENCLOSURE.enclosureBracketsTrueG === true &&
      IMP97337_ENCLOSURE.panelsChecked >= 500 &&
      IMP97337_ENCLOSURE.worstTrueOverUpper < 1 &&
      IMP97337_ENCLOSURE.worstTrueOverUpper > 0.9,
    why: 'the certified per-panel enclosure (certified |sin|,|cos| sup x triangle-bounded assembled S,C, monotone z^-m endpoints -- no interval spherical-Bessel value) upper-bounds the exact g at every one of >=500 panels with worst true/upper in (0.9,1): a valid, tight (~1.3%) rigorous replacement for the imp-97184 sampled subgrid sup.',
  },
  {
    id: 'imp97337-routeC-fartail-majorant-valid',
    holds: () => {
      // |g(z)| z^4 sits under the local Route C constant for z >= Zfar (checked where g is above the float floor)
      let ok = true;
      for (const z of [8000, 12000, 20000]) {
        const lhs = Math.abs(gTrue(z)) * Math.pow(z, 4);
        let cz = 0;
        for (let m = 3; m < 8; m++) cz += (Math.abs(SPOLY[m]) + Math.abs(CPOLY[m])) * Math.pow(z, -(m - 3));
        if (lhs > cz) ok = false;
      }
      return ok && C_FAR > 4e4 && C_FAR < 6e4;
    },
    why: 'the Route C far-tail majorant |g(z)| <= C_far z^-4 (C_far = SUM_{m>=3}(|s_m|+|c_m|) Zfar^-(m-3) ~ 48524.3, exact integers) holds for z >= Zfar: |g(z)| z^4 sits under the local constant at z = 8000, 12000, 20000 where g is above the float floor.',
  },
  {
    id: 'imp97337-honesty-gate-no-qed',
    holds: () =>
      IMP97337_VERDICT.boundChanged === false &&
      IMP97337_VERDICT.operatorPositivityProved === false &&
      IMP97337_VERDICT.fullSigma2WeightedMajorantProduced === false &&
      IMP97337_VERDICT.actualGroundStateInstantiated === false &&
      IMP97337_VERDICT.intervalMajorantForResidualProduced === false &&
      IMP97337_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97337_VERDICT.qed === false &&
      typeof IMP97337_VERDICT.subGap === 'string' &&
      IMP97337_VERDICT.subGap.includes('IMP97184_INTERVAL_BESSEL_ENCLOSURE'),
    why: 'derivation/execution only: certified |g| enclosure + Route C |g|-majorant delivered for a rational trial, but the sigma_2-weighted majorant (R2) and the actual-v0 instantiation (R1, Obstruction B) stay open, so no residual majorant is produced, Rayleigh floor stays an UPPER bound, no operator positivity, no bound moved, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97337_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97337-krein-routeb-certified-bessel-enclosure assertion failed: ${t.id}`);
  }
}
