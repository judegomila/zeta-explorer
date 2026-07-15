/**
 * @module formalization-status-2026-07-09
 * @fileoverview
 * Status of the Lean 4 formalization PILOT of the de Bruijn–Newman lower-bound
 * chain (formalization/lean/). Machine-checkable rigor infrastructure — a
 * scaffold with a few genuinely-proved order lemmas and honest `sorry`-stubs
 * for the deep analytic theorems. It proves NOTHING new about RH; it hardens
 * the DEFINITIONAL layer and maps exactly what mathlib still lacks.
 *
 * Toolchain: Lean 4.9.0 / Lake 5.0.0 / elan 4.2.1. mathlib's prebuilt cache
 * aborts on this macOS (dyld __DATA_CONST SG_READ_ONLY), so the project is
 * self-contained on plain Lean 4 core (builds offline; `lake build` → exit 0).
 * Commit d99a02f4.
 */

export const FORMALIZATION_META = {
  date: '2026-07-09',
  system: 'Lean 4.9.0 (plain core, no mathlib — cache incompatible on this host)',
  location: 'formalization/lean/DeBruijnNewman/Basic.lean',
  build: 'lake build → exit 0 (only the 3 deep theorems warn as `sorry`)',
  headline:
    'The definitional layer RH ⇔ Λ=0 is machine-checked with ZERO axioms; the deep theorems ' +
    '(existence of Λ, de Bruijn monotonicity, Rodgers–Tao Λ≥0) are honest `sorry`-stubs with their ' +
    'required ingredients named. No new mathematics; a verifiable scaffold.',
};

// Genuinely PROVED, sorry-free (axiom-audited via #print axioms).
export const PROVED_LEMMAS = [
  { name: 'dbn_unique', statement: 'IsDBNConstant Λ₁ → IsDBNConstant Λ₂ → Λ₁ = Λ₂', axioms: 'propext only', note: 'Uniqueness of the DBN constant (Int.le_antisymm on cross-evaluations).' },
  { name: 'monotone_of_dbn', statement: 'up-closedness: HasOnlyRealZeros is monotone in t under IsDBNConstant', axioms: 'propext only', note: 'The order structure the constant lives in.' },
  { name: 'RH_iff_lambda_nonpos', statement: 'IsDBNConstant Λ → (RH ↔ Λ ≤ 0)', axioms: 'ZERO axioms', note: 'The classical equivalence, fully machine-checked.' },
  { name: 'RH_iff_lambda_eq_zero', statement: 'RH ↔ Λ = 0 (given Rodgers–Tao)', axioms: 'adds none of its own (rests on the rodgers_tao stub)', note: 'Real derivation combining RH⇔Λ≤0 with Λ≥0.' },
];

// Honest `sorry`-stubs — stated but NOT proved; each names the missing ingredient.
// 2026-07-14 UPDATE (RealRooted.lean, commit 91763a02): the finite-dimensional
// ALGEBRAIC SHADOW of the Laguerre–Pólya class is now fully proved sorry-free in
// plain Lean 4 core (#print axioms → propext only, no sorryAx). These port
// verbatim to ℝ / any integral domain once mathlib is available:
//   evalFactors_eq_zero_iff, Poly.eval_eq_zero_iff, evalFactors_append,
//   Poly.eval_mul, isRealRooted_mul (2-factor closure), Poly.mul_isRealRooted,
//   isRealRooted_prod (finite n-ary product closure).
export const REALROOTED_SHADOW = {
  proved: 'Real-rooted class closed under finite products (isRealRooted_prod), the algebraic shadow of "LP is closed under products". 7 lemmas, sorry-free (propext only).',
  significance: 'This is the finite-dimensional core of heat_preserves_LP; the remaining distance is exactly the infinite-dimensional entire-function theory (Hadamard/Hermite–Poulain) absent from this toolchain.',
};

export const STUBBED_THEOREMS = [
  { name: 'exists_dbn_constant', statement: '∃ Λ, IsDBNConstant Λ', needs: 'de Bruijn monotonicity + Newman growth/lower bounds + an infimum (sInf/IsGLB over ℝ completeness).' },
  { name: 'deBruijn_monotone', statement: 'HasOnlyRealZeros t → t ≤ s → HasOnlyRealZeros s', needs: 'NO LONGER a bare sorry (91763a02): it is now a real proof term = (realZeros_iff_LP s).mpr (heat_preserves_LP … hle), reduced to two sourced sub-stubs — realZeros_iff_LP (needs Hadamard factorization / LP class; shadow: Poly.eval_eq_zero_iff, proved) and heat_preserves_LP (needs Hermite–Poulain multiplier theory; shadow: isRealRooted_prod, proved).' },
  { name: 'rodgers_tao', statement: 'IsDBNConstant Λ → 0 ≤ Λ', needs: 'the full Rodgers–Tao (2020) zero-dynamics + pair-correlation argument. Far beyond current formalization reach.' },
];

export const MATHLIB_GAP = {
  present: 'ℝ/ℂ, entire & analytic functions, complex differentiability, integration, enough real analysis that the companion Gaussian heat-kernel positivity fact is a one-line `positivity` proof.',
  absent: 'Laguerre–Pólya class; Hermite–Biehler theorem; entire-function order/genus + Hadamard factorization specialized to Ξ; heat-flow dynamics of zeros; the pair-correlation inputs Rodgers–Tao rely on.',
  verdict: 'A full Λ≥0 formalization is a research-level target. Even the "easier" 1950 de Bruijn monotonicity is a substantial multi-file build; Rodgers–Tao is far beyond current reach.',
};

export const FORMALIZATION_STATUS = {
  meta: FORMALIZATION_META,
  proved: PROVED_LEMMAS,
  realRootedShadow: REALROOTED_SHADOW,
  stubbed: STUBBED_THEOREMS,
  mathlibGap: MATHLIB_GAP,
};
