/**
 * @module imp-1259-rh-equivalents-completeness-audit
 * @fileoverview Survey: non-Twin-Ladder RH-equivalents not yet in the main
 * rh-equivalents-reference.js catalog. Cross-walks the 12-entry catalog
 * against four candidate classes (Speiser 1934, Bombieri xi-positivity /
 * Weil 1952, Davenport-Heilbronn, Connes 1999 adelic spectral triple, and
 * Baez-Duarte 2003/2005 Nyman-Beurling refinement).
 *
 * VERDICT SUMMARY:
 *   SPEISER 1934          -- ALREADY IN CATALOG (entry name: "Speiser criterion")
 *   DAVENPORT-HEILBRONN   -- NOT AN RH EQUIVALENT; correctly absent (anti-example)
 *   BOMBIERI-WEIL         -- MISSING GAP: Weil 1952 / Bombieri 1992 positivity of a
 *                            quadratic form on test functions; distinct from Li 1997
 *   CONNES ADELIC         -- MISSING GAP: Connes 1999 trace formula on the adele
 *                            class space C_Q = A_Q* / Q* (noncommutative geometry)
 *   BAEZ-DUARTE           -- MISSING GAP: Baez-Duarte 2003/2005 strengthened Nyman-
 *                            Beurling via Ramanujan/Dirichlet series approximation
 *
 * Each MISSING GAP is a candidate to add to rh-equivalents-reference.js in a
 * follow-up ticket, which would bring the catalog from 12 to 15 equivalents
 * (the imp-1119 spec upper bound).
 *
 * Source tickets: imp-1259 (this file), imp-1119 (main catalog, haiku-4-5).
 */

import {
  RH_EQUIVALENTS,
  findByName,
} from './rh-equivalents-reference.js';

/**
 * Equivalents confirmed to be ALREADY in the rh-equivalents-reference.js catalog.
 *
 * @type {ReadonlyArray<{name: string, verdict: string, catalogEntry: string, note: string}>}
 */
export const CONFIRMED_PRESENT = Object.freeze([
  {
    name: 'Speiser criterion (zeros of zeta-prime)',
    verdict: 'PRESENT',
    catalogEntry: 'Speiser criterion (zeros of zeta-prime)',
    note:
      "Speiser 1934 / Levinson-Montgomery 1974: zeta' has no zeros in 0 < Re(s) < 1/2 iff RH. " +
      "Listed as entry #12 in rh-equivalents-reference.js with direction 'both'.",
  },
]);

/**
 * Published statements often cited as related to RH that are NOT genuine RH
 * equivalents. Correctly absent from the main catalog.
 *
 * @type {ReadonlyArray<{name: string, verdict: string, reason: string, reference: string}>}
 */
export const NOT_EQUIVALENTS = Object.freeze([
  {
    name: 'Davenport-Heilbronn theorem',
    verdict: 'NOT-AN-EQUIVALENT',
    reason:
      "Davenport-Heilbronn 1936 establishes that certain Dirichlet series " +
      "similar to zeta (Hurwitz zeta with irrational parameter, L-functions " +
      "with non-principal odd real character) have infinitely many zeros with " +
      "Re(s) > 1/2. This is an ANTI-EXAMPLE demonstrating that RH is a " +
      "special property of zeta(s) not shared by all Dirichlet series; it is " +
      "not a statement equivalent to RH. Its correct interpretation: RH cannot " +
      "follow from the functional equation or Euler product alone.",
    reference:
      "Davenport, H. & Heilbronn, H. (1936). On the zeros of certain Dirichlet " +
      "series. J. London Math. Soc. 11(3): 181-185. See also Titchmarsh, E.C. " +
      "(1986). Theory of the Riemann Zeta-Function (2nd ed.), Chapter 10.",
  },
]);

/**
 * Published RH-equivalent statements identified as MISSING from the current
 * 12-entry catalog. Each entry is a candidate addition for a follow-up ticket.
 *
 * @type {ReadonlyArray<{
 *   name: string, verdict: string, statement: string, direction: string,
 *   reference: string, year: number, addToMainCatalog: boolean
 * }>}
 */
export const MISSING_CANDIDATES = Object.freeze([
  {
    name: 'Weil-Bombieri explicit-formula positivity',
    verdict: 'MISSING',
    statement:
      "RH is equivalent to: for every smooth compactly supported test function f " +
      "with non-negative Fourier transform f-hat, the explicit formula sum over " +
      "zeros rho of f-hat(rho) plus the contributions from the prime powers minus " +
      "the archimedean terms is non-negative. Equivalently (Bombieri 1992): a " +
      "certain quadratic form W(f, f) constructed from the Weil explicit formula " +
      "is positive semi-definite on an appropriate function space. This is the " +
      "function-space positivity formulation of RH.",
    direction: 'both',
    reference:
      "Weil, A. (1952). Sur les formules explicites de la theorie des nombres " +
      "premiers. Comm. Sem. Math. Univ. Lund (Medd. Lunds Univ. Mat. Sem.) " +
      "Supplement dedic. M. Riesz: 252-265. Bombieri, E. (1992). Remarks on " +
      "Weil's quadratic functional in the theory of prime numbers, I. Atti Accad. " +
      "Naz. Lincei Cl. Sci. Fis. Mat. Natur. Rend. Lincei (9) Mat. Appl. 3(3): " +
      "175-185.",
    year: 1952,
    distinctFrom:
      "Li 1997 (entry #4) gives a SEQUENCE criterion (all lambda_n > 0 for n >= 1 " +
      "where lambda_n are Li coefficients); the Weil-Bombieri formulation gives a " +
      "QUADRATIC FORM positivity criterion on an L^2 function space. Both are " +
      "equivalent to RH but express the positivity in categorically different " +
      "objects. The Li criterion descends from Weil-Bombieri by choosing specific " +
      "test functions f_n.",
    addToMainCatalog: true,
  },
  {
    name: 'Connes adelic spectral triple (trace formula)',
    verdict: 'MISSING',
    statement:
      "RH is equivalent to: the Weil explicit formula is a Lefschetz trace " +
      "formula for the action of the idele class group C_K = A_K* / K* on the " +
      "adele class space, where the Frobenius correspondences have spectrum " +
      "exactly equal to the critical zeros of zeta. In noncommutative geometry: " +
      "the spectral triple (A, H, D) associated to the adele class space C_Q " +
      "has Dirac operator D with spectrum {Im(rho) : zeta(rho) = 0} (the " +
      "imaginary parts of the non-trivial zeros).",
    direction: 'both',
    reference:
      "Connes, A. (1999). Trace formula in noncommutative geometry and the zeros " +
      "of the Riemann zeta function. Selecta Math. (N.S.) 5(1): 29-106. See also " +
      "Connes, A. & Marcolli, M. (2008). Noncommutative Geometry, Quantum Fields " +
      "and Motives. Amer. Math. Soc. Colloq. Publ. 55, Chapter 2.",
    year: 1999,
    distinctFrom:
      "Hilbert-Polya conjecture (entry #6) posits an ABSTRACT self-adjoint " +
      "operator on SOME Hilbert space; the Connes formulation provides the " +
      "EXPLICIT candidate: the Dirac operator on the adele class space C_Q = " +
      "A_Q* / Q*. It is a concrete realization of the Hilbert-Polya programme " +
      "within noncommutative geometry, with an explicit spectral triple " +
      "construction rather than an existence conjecture. The imp-1205 crosswalk " +
      "covered the Connes framework vs four-route equivalence but did not add " +
      "the Connes criterion to the main RH_EQUIVALENTS catalog.",
    addToMainCatalog: true,
  },
  {
    name: 'Baez-Duarte criterion (Ramanujan-Nyman-Beurling)',
    verdict: 'MISSING',
    statement:
      "RH is equivalent to: the sequence c_k = sum_{j=0}^{k} (-1)^j C(k,j) / " +
      "zeta(2j+2) satisfies lim_{N->oo} sum_{k=0}^{N} |c_k|^2 / (k+1) = 0. " +
      "Equivalently: 1/zeta(s) can be approximated in a weighted L^2 norm by " +
      "finite Dirichlet polynomials whose coefficients are constructed from " +
      "Ramanujan sums c_q(n) = sum_{gcd(k,q)=1, k<=q} exp(2pi i k n / q).",
    direction: 'both',
    reference:
      "Baez-Duarte, L. (2003). A strengthening of the Nyman-Beurling criterion " +
      "for the Riemann hypothesis. Atti Accad. Naz. Lincei Cl. Sci. Fis. Mat. " +
      "Natur. Rend. Lincei (9) Mat. Appl. 14(1): 5-11. Baez-Duarte, L. (2005). " +
      "A sequential Riesz-like criterion for the Riemann hypothesis. Int. J. " +
      "Math. Math. Sci. 2005(21): 3527-3537.",
    year: 2003,
    distinctFrom:
      "Nyman-Beurling (entry #5) asks for L^2 closure of the span of fractional-" +
      "part functions { rho(theta/x) } spanning the constant 1. Baez-Duarte " +
      "replaces the fractional-part generating family with Ramanujan-sum Dirichlet " +
      "polynomials, giving an explicit computable sequence c_k that must tend to " +
      "zero -- a sequential criterion that is strictly stronger than the original " +
      "Nyman-Beurling statement.",
    addToMainCatalog: true,
  },
]);

/**
 * Summary verdict of the completeness audit.
 */
export const COMPLETENESS_VERDICT = Object.freeze({
  catalogSizeAtAudit: 12,
  confirmedPresent: CONFIRMED_PRESENT.length,
  notEquivalents: NOT_EQUIVALENTS.length,
  missingGaps: MISSING_CANDIDATES.length,
  projectedCatalogSizeAfterFix: 12 + MISSING_CANDIDATES.length,
  overallVerdict:
    "12-entry catalog is solid for the Twin-Ladder project scope. Three genuine " +
    "published RH equivalents are absent: Weil-Bombieri explicit-formula " +
    "positivity (1952/1992), Connes adelic spectral triple (1999), and Baez-" +
    "Duarte Ramanujan-Nyman criterion (2003/2005). Davenport-Heilbronn is NOT " +
    "an equivalent and should remain excluded. Adding the three missing entries " +
    "would bring the catalog to 15, the upper end of the imp-1119 spec.",
  actionableFollowUp:
    "Follow-up ticket: add Weil-Bombieri, Connes adelic, and Baez-Duarte " +
    "entries to rh-equivalents-reference.js. Each entry has a fully specified " +
    "statement, direction, reference, and distinctFrom note in this file.",
});

// ── Build-time tripwires ──────────────────────────────────────────────────

export const IMP_1259_ASSERTIONS = [
  {
    id: 'imp1259-speiser-in-main-catalog',
    holds: () => findByName('Speiser') !== null,
    why:
      "imp-1259 survey confirmed Speiser 1934 is PRESENT in the main catalog. " +
      "If findByName('Speiser') returns null, the main catalog regressed.",
  },
  {
    id: 'imp1259-davenport-heilbronn-absent',
    holds: () => findByName('Davenport') === null,
    why:
      "Davenport-Heilbronn is an ANTI-EXAMPLE (not an RH equivalent). It must " +
      "NOT appear in the main RH_EQUIVALENTS catalog. Its presence would be a " +
      "factual error that misleads readers.",
  },
  {
    id: 'imp1259-catalog-not-regressed-below-12',
    holds: () => RH_EQUIVALENTS.length >= 12,
    why:
      "The imp-1259 survey was conducted against the 12-entry catalog. Fewer " +
      "than 12 entries means an entry was incorrectly removed after this audit.",
  },
  {
    id: 'imp1259-three-missing-gaps-identified',
    holds: () => MISSING_CANDIDATES.length >= 3,
    why:
      "The survey must identify at least 3 actionable missing equivalents " +
      "(Weil-Bombieri, Connes adelic, Baez-Duarte). Fewer than 3 means the " +
      "audit was incomplete.",
  },
  {
    id: 'imp1259-missing-candidates-have-citations',
    holds: () =>
      MISSING_CANDIDATES.every(
        (c) =>
          typeof c.reference === 'string' &&
          c.reference.length >= 80 &&
          typeof c.year === 'number' &&
          c.year >= 1900 &&
          c.year <= 2030 &&
          typeof c.direction === 'string' &&
          ['RH=>S', 'S=>RH', 'both'].includes(c.direction)
      ),
    why:
      "Every missing candidate must carry a proper citation (>= 80 chars), " +
      "a publication year in 1900-2030, and a valid equivalence direction. " +
      "Required so the follow-up ticket can add these entries to the main " +
      "catalog without needing additional research.",
  },
  {
    id: 'imp1259-not-equivalents-documents-davenport',
    holds: () =>
      NOT_EQUIVALENTS.some((e) => e.name.includes('Davenport-Heilbronn')),
    why:
      "The NOT_EQUIVALENTS array must explicitly document the Davenport- " +
      "Heilbronn anti-example so future auditors know why it is correctly absent.",
  },
  {
    id: 'imp1259-connes-gap-identified',
    holds: () =>
      MISSING_CANDIDATES.some((c) =>
        c.name.toLowerCase().includes('connes')
      ),
    why:
      "The Connes adelic spectral triple formulation (Selecta Math. 5, 1999) " +
      "is a major published RH equivalent currently missing from the catalog. " +
      "The audit must flag it explicitly as a gap.",
  },
  {
    id: 'imp1259-all-missing-marked-for-main-catalog',
    holds: () => MISSING_CANDIDATES.every((c) => c.addToMainCatalog === true),
    why:
      "Every identified gap must be explicitly marked addToMainCatalog: true, " +
      "confirming the audit recommends adding them in a follow-up ticket.",
  },
];
