/**
 * @fileoverview imp-95548 viz data: the perm-arch section 5(i) small-prime-weld
 * over-budget picture, reader-facing. Import-light (literals only, no heavy
 * modules); reproduces PERM_ARCH_SIEVE_UNIVERSALITY.perPrimeMeasurement /
 * smallPrimeClosure from src/data/perm-arch-sieve-universality-no-go-2026-09-22.js
 * verbatim plus the derived cumulative sqrt-sum column. NOT a bound; NO QED.
 */

export const R_EX_BUDGET = 0.27968819555261474;

// S̄_p per prime (p=2 caveatP2-corrected: 0.396850), and the running
// cumulative sqrt(Σ_{p'<=p} S̄_p') that the ℓ²-collapse route needs to stay
// under R_EX_BUDGET at Q=1. Every cumulative value already exceeds the
// budget starting at the very first prime p=2.
export const PER_PRIME_SBAR_BUDGET_ROWS = Object.freeze([
  { p: 2, sBar: 0.396850, cumSqrt: 0.629960 },
  { p: 3, sBar: 0.462241, cumSqrt: 0.926872 },
  { p: 5, sBar: 0.381283, cumSqrt: 1.113721 },
  { p: 7, sBar: 0.315254, cumSqrt: 1.247248 },
  { p: 11, sBar: 0.232961, cumSqrt: 1.337381 },
  { p: 13, sBar: 0.206260, cumSqrt: 1.412391 },
  { p: 17, sBar: 0.168178, cumSqrt: 1.470723 },
  { p: 19, sBar: 0.154116, cumSqrt: 1.522216 },
  { p: 23, sBar: 0.132227, cumSqrt: 1.565046 },
  { p: 29, sBar: 0.109279, cumSqrt: 1.599578 },
  { p: 31, sBar: 0.103358, cumSqrt: 1.631566 },
  { p: 37, sBar: 0.089008, cumSqrt: 1.658618 },
  { p: 41, sBar: 0.081529, cumSqrt: 1.683016 },
  { p: 43, sBar: 0.078257, cumSqrt: 1.706107 },
  { p: 47, sBar: 0.072465, cumSqrt: 1.727213 },
  { p: 53, sBar: 0.065266, cumSqrt: 1.746005 },
  { p: 59, sBar: 0.059404, cumSqrt: 1.762934 },
  { p: 61, sBar: 0.057684, cumSqrt: 1.779219 },
  { p: 67, sBar: 0.053090, cumSqrt: 1.794076 },
  { p: 71, sBar: 0.050423, cumSqrt: 1.808074 },
  { p: 73, sBar: 0.049191, cumSqrt: 1.821627 },
  { p: 79, sBar: 0.045840, cumSqrt: 1.834166 },
  { p: 83, sBar: 0.043856, cumSqrt: 1.846082 },
  { p: 89, sBar: 0.041189, cumSqrt: 1.857205 },
  { p: 97, sBar: 0.038112, cumSqrt: 1.867437 },
]);

export const PER_PRIME_SBAR_BUDGET_SUMMARY = Object.freeze({
  rEx: R_EX_BUDGET,
  finalCumSqrt: 1.867437,
  overBudgetFactorAtQ1: 1.867437 / R_EX_BUDGET,
  firstCumulativeCrossPrime: 2,
  lastSingleWeldAboveBudgetPrime: 43,
});
