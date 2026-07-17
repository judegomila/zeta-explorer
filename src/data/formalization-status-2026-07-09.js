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
  { name: 'deBruijn_monotone', statement: 'HasOnlyRealZeros t → t ≤ s → HasOnlyRealZeros s', needs: 'A real proof term = (realZeros_iff_LP s).mpr (heat_preserves_LP … hle). Its heat_preserves_LP sub-stub is now FULLY PROVED at the polynomial level (commit 9257213e4). Remaining: realZeros_iff_LP (Hadamard factorization / LP class on ℂ→ℂ) and lifting heat_preserves_LP from polynomials to the entire Ξ flow.' },
  { name: 'rodgers_tao', statement: 'IsDBNConstant Λ → 0 ≤ Λ', needs: 'the full Rodgers–Tao (2020) zero-dynamics + pair-correlation argument. Far beyond current formalization reach.' },
];

// 2026-07-16: mathlib UNBLOCKED — the tool gate on all analytic progress is cleared.
export const MATHLIB_UNBLOCK = {
  status: 'UNBLOCKED (commit 392f46ba1)',
  cause: 'The dyld abort was macOS 26.x rejecting the v4.9.0 mathlib `cache` binary’s linker flags (SG_READ_ONLY) — a linker issue, not a signature one (codesign cannot fix it).',
  fix: 'Toolchain v4.22.0 (already installed) has a macOS-26-compatible cache binary; `lake exe cache get` downloads all 7067 oleans clean. The mathlib-enabled project lives in formalization/lean-mathlib-probe/ (core project stays intact).',
  newLemmas: 'With mathlib, proved sorry-free the analytic bridge core Lean could NOT reach: derivative_hasRoot_between (Rolle/MVT root-interlacing) and heatKernel_pos (Gaussian kernel positivity). Then (commit 5d108df3d): hasOnlyRealRoots_derivative — the derivative of a real-rooted real polynomial is real-rooted, FULL general degree with multiplicities (false over ℤ, true over ℝ) — plus hasOnlyRealRoots_iterate_derivative (every Dⁿ preserves real-rootedness), and all 4 DBN order-lemmas re-proved against the REAL zero predicate ∀z,H t z=0→z.im=0. Axioms: propext + Classical.choice + Quot.sound only.',
  reduction: 'COMPLETE (commit 9257213e4): heat_preserves_LP is now FULLY SORRY-FREE — the polynomial de Bruijn / Pólya–Schur LP-multiplier theorem (e^{−tD²} preserves real-rootedness of real polynomials) is machine-checked in Lean, axiom-clean (propext/Classical.choice/Quot.sound, no sorryAx). Piece A (real-rootedness closed under coefficient limits) proved WITHOUT complex analysis via Cauchy root bound + Bolzano–Weierstrass + Vieta continuity; Piece B (operator binomial + Nat.choose asymptotic) from first principles. HONEST SCOPE: this is the POLYNOMIAL theorem for the concrete operator heatOp; the RH-relevant version still needs the entire-function LP class on ℂ→ℂ, the actual Riemann Ξ, its convolution flow H_t=Ξ∗G_t (connecting heatOp to the real de Bruijn flow), and Rodgers–Tao 0≤Λ (still a hypothesis via the axiom-H stand-in in the separate DBN order-lemmas). ENTIRE-FUNCTION LIFT (commit a1270165f, EntireLP.lean): the finite→entire STRUCTURAL bridge is now CLOSED sorry-free — IsLaguerrePolya defined as a loc-unif limit of real-rooted polynomials (Levin); isLaguerrePolya_heat_of_flow proves any flow restricting to heatOp on polynomials + continuous for loc-unif convergence preserves LP; heat_preserves_LP_entire follows, modulo TWO precisely-NAMED axioms (heatFlow_poly, heatFlow_continuous), not hidden sorries. Genuine remaining distance = BUILDING entire-function analysis mathlib lacks (order/genus + Hadamard factorization, the complex Gaussian convolution discharging those axioms, Ξ as a loc-unif limit, the de Bruijn differential inequality → Rodgers–Tao). NOT RH; NO QED. ——— [historical: the multiplier operator is CONCRETE — heatOp t p = e^{−t·D²} (sign-corrected: e^{+tD²} is FALSE for polynomials; e^{−tx²}∈LP). MILESTONE (commit b13613110): the atomic Hermite–Poulain SHIFT theorem is now FULLY PROVED sorry-free — p↦p′+c·p preserves real-rootedness (classical Pólya–Schur/Laguerre 1914), including the delicate "root at infinity" via EVT/Fermat on e^{cx}·p. So the POLYNOMIAL de Bruijn theorem (1950) is down to ONE final gap. MILESTONE (commit 50d2ad793): the ENTIRE FINITE/ALGEBRAIC side is now formalized sorry-free — (1−cD²) and every power (1−cD²)ⁿ preserve real-rootedness (built from the proved shift via (1−cD²)=(1+√c·D)(1−√c·D)), degrees pinned, heatOp algebra done. Confirmed Hurwitz is genuinely ABSENT from mathlib. The lone remaining sorry is exactly ONE analytic package: the n→∞ coefficient limit (1−x/n)ⁿ→e^{−x} PLUS Hurwitz root-continuity on bounded-degree families — both substantial standalone developments mathlib lacks. The RH-relevant (entire-function) version further needs LP-class on ℂ→ℂ, the real Ξ, and Rodgers–Tao 0≤Λ (a hypothesis). Verified machinery, not RH; NO QED.',
};

export const MATHLIB_GAP = {
  present: 'ℝ/ℂ, entire & analytic functions, complex differentiability, integration, enough real analysis that the companion Gaussian heat-kernel positivity fact is a one-line `positivity` proof.',
  absent: 'Laguerre–Pólya class; Hermite–Biehler theorem; entire-function order/genus + Hadamard factorization specialized to Ξ; heat-flow dynamics of zeros; the pair-correlation inputs Rodgers–Tao rely on.',
  verdict: 'A full Λ≥0 formalization is a research-level target. Even the "easier" 1950 de Bruijn monotonicity is a substantial multi-file build; Rodgers–Tao is far beyond current reach.',
};

export const FORMALIZATION_STATUS = {
  meta: FORMALIZATION_META,
  proved: PROVED_LEMMAS,
  realRootedShadow: REALROOTED_SHADOW,
  mathlibUnblock: MATHLIB_UNBLOCK,
  stubbed: STUBBED_THEOREMS,
  mathlibGap: MATHLIB_GAP,
};
