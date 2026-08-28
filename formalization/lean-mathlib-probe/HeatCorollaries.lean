/-
  HeatCorollaries — two flagship corollaries of `MathlibBridge.heat_preserves_LP`.

  `MathlibBridge.heat_preserves_LP` is the (sorry-free) polynomial de Bruijn /
  Pólya–Schur theorem: for `t ≥ 0` the heat multiplier `e^{−t·D²} = heatOp t` maps
  real-rooted real polynomials to real-rooted real polynomials.  This file USES that
  theorem to derive two named consequences, WITHOUT modifying `MathlibBridge.lean`.

  ## TARGET 1 (fully proved, sorry-free) — Hermite polynomials are real-rooted.

  The probabilist's Hermite polynomial is `He_n = e^{−D²/2} xⁿ = heatOp (1/2) Xⁿ`.
  Since `Xⁿ` is trivially real-rooted, `heat_preserves_LP (1/2)` gives
  `HasOnlyRealRoots (heatOp (1/2) Xⁿ)` at once.  We then bridge to mathlib's
  `Polynomial.hermite` (which lives over `ℤ`) by proving the operator identity
  `(hermite n).map (Int.castRingHom ℝ) = heatOp (1/2) Xⁿ` by induction, using the
  "creation operator" recursion `heatOp (1/2) (X·q) = X·heatOp(1/2)q − D(heatOp(1/2)q)`
  — the exact ℝ-analog of mathlib's `Polynomial.hermite_succ`.  Conclusion:
  `HasOnlyRealRoots ((Polynomial.hermite n).map (Int.castRingHom ℝ))`.

  ## TARGET 2 (fully proved, sorry-free) — Newton's inequalities.

  Real-rootedness implies log-concavity of the *normalized* coefficients (Newton's
  inequalities).  mathlib v4.22.0 has no polynomial `logConcave`/Newton API, so the
  repeated-differentiation reduction to the quadratic discriminant is built here, in
  `NewtonInequality.lean` (ported from the Aristotle-verified v4.28 development under
  `formalization/lean-aristotle/newton_inequality/`).  `newton_inequality` below is
  `#print axioms`-clean — no `sorryAx`.
-/
import MathlibBridge
import NewtonInequality
import Mathlib.RingTheory.Polynomial.Hermite.Basic

open Polynomial
open scoped Polynomial

namespace HeatCorollaries

open MathlibBridge

/-! ## TARGET 1 — Hermite polynomials are real-rooted -/

/-- **`Xⁿ` is real-rooted.**  Its only root is `0` with multiplicity `n`, so
`card roots = n = natDegree`.  (`roots (Xⁿ) = n • {0}` via `roots_pow`, `roots_X`.) -/
theorem hasOnlyRealRoots_X_pow (n : ℕ) : HasOnlyRealRoots (X ^ n : ℝ[X]) := by
  unfold HasOnlyRealRoots
  rw [roots_pow, roots_X, natDegree_X_pow]
  simp

/-- **Self-contained heat-flow corollary.**  For every `t ≥ 0`, `heatOp t Xⁿ` is
real-rooted — a direct application of `heat_preserves_LP` to `Xⁿ`.  This is `He_n`
(rescaled) for `t = 1/2`, and is the fact the Hermite identification below packages. -/
theorem hasOnlyRealRoots_heatOp_X_pow (t : ℝ) (ht : 0 ≤ t) (n : ℕ) :
    HasOnlyRealRoots (heatOp t (X ^ n)) :=
  heat_preserves_LP t ht (hasOnlyRealRoots_X_pow n)

/-- **Iterated-derivative product rule with `X` (Leibniz, sorry-free).**
`D^m (X·q) = X·D^m q + m·D^{m-1} q`.  Only the `j = 0, 1` terms of the full Leibniz
expansion survive because `D^j X = 0` for `j ≥ 2`; proved directly by induction on `m`. -/
theorem iterate_derivative_X_mul (q : ℝ[X]) (m : ℕ) :
    derivative^[m] (X * q) = X * derivative^[m] q + (m : ℝ) • derivative^[m - 1] q := by
  induction m with
  | zero => simp
  | succ m ih =>
    rw [Function.iterate_succ_apply', ih, derivative_add, derivative_mul, derivative_X,
        one_mul, derivative_smul, ← Function.iterate_succ_apply' derivative m,
        Nat.add_sub_cancel]
    have hkey : (m : ℝ) • derivative (derivative^[m - 1] q) = (m : ℝ) • derivative^[m] q := by
      cases m with
      | zero => simp
      | succ k => rw [Nat.add_sub_cancel, ← Function.iterate_succ_apply' derivative k]
    rw [hkey]; push_cast; module

/-- **Creation identity for the fixed-cutoff heat sum (sorry-free).**
`heatPartial N t (X·q) = X·heatPartial N t q − (2t)·D(heatPartial (N−1) t q)`.
This is the finite-sum form of the heat commutation relation `e^{−t·D²}·x = (x − 2t·D)·e^{−t·D²}`
(equivalently `[e^{−t·D²}, x] = −2t·D·e^{−t·D²}`).  The `2t·D` term comes from the `+m·D^{m-1}q`
part of the Leibniz rule after re-indexing the sum by one. -/
theorem heatPartial_X_mul (N : ℕ) (t : ℝ) (q : ℝ[X]) :
    heatPartial N t (X * q)
      = X * heatPartial N t q - (2 * t) • derivative (heatPartial (N - 1) t q) := by
  unfold heatPartial
  -- rewrite each `D^{2k}(X·q)` via the Leibniz creation lemma
  have hterm : ∀ k ∈ Finset.range N,
      ((-t) ^ k / (Nat.factorial k : ℝ)) • derivative^[2 * k] (X * q)
        = X * (((-t) ^ k / (Nat.factorial k : ℝ)) • derivative^[2 * k] q)
          + (((-t) ^ k / (Nat.factorial k : ℝ)) * (2 * k : ℝ)) • derivative^[2 * k - 1] q := by
    intro k _
    rw [iterate_derivative_X_mul q (2 * k), smul_add, mul_smul_comm, smul_smul]
    push_cast; ring_nf
  rw [Finset.sum_congr rfl hterm, Finset.sum_add_distrib, ← Finset.mul_sum, sub_eq_add_neg]
  congr 1
  -- second sum = −(2t)·D(heatPartial (N−1) t q); reindex by one, killing the `k = 0` term
  have hsum2 : (∑ k ∈ Finset.range N,
        (((-t) ^ k / (Nat.factorial k : ℝ)) * (2 * k : ℝ)) • derivative^[2 * k - 1] q)
      = (-(2 * t)) • derivative (∑ k ∈ Finset.range (N - 1),
          ((-t) ^ k / (Nat.factorial k : ℝ)) • derivative^[2 * k] q) := by
    cases N with
    | zero => simp
    | succ M =>
      rw [Finset.sum_range_succ']
      simp only [Nat.cast_zero, mul_zero, zero_smul, add_zero]
      rw [Nat.add_sub_cancel, derivative_sum, Finset.smul_sum]
      refine Finset.sum_congr rfl (fun k _ => ?_)
      rw [derivative_smul, smul_smul]
      have hdeg : 2 * (k + 1) - 1 = 2 * k + 1 := by omega
      rw [hdeg, ← Function.iterate_succ_apply' derivative (2 * k),
          show 2 * k + 1 = (2 * k).succ from rfl]
      congr 1
      have hfac : (Nat.factorial (k + 1) : ℝ) = (k + 1 : ℝ) * (Nat.factorial k : ℝ) := by
        rw [Nat.factorial_succ]; push_cast; ring
      rw [hfac]
      have hk1 : ((k : ℝ) + 1) ≠ 0 := by positivity
      push_cast; field_simp; ring
  rw [hsum2, neg_smul]

/-- **Creation identity for `heatOp` at `t = 1/2` (sorry-free).**
`heatOp (1/2) (X·q) = X·heatOp(1/2) q − D(heatOp(1/2) q)`.  This is exactly the
Hermite three-term recursion `He_{n+1} = x·He_n − He_n'` in operator form.  Obtained from
`heatPartial_X_mul` at a common cutoff large enough to freeze all three `heatPartial`s at
their `heatOp` values (`heatPartial_stable`), with `2·(1/2) = 1`. -/
theorem heatOp_half_X_mul (q : ℝ[X]) :
    heatOp (1 / 2 : ℝ) (X * q)
      = X * heatOp (1 / 2 : ℝ) q - derivative (heatOp (1 / 2 : ℝ) q) := by
  set N : ℕ := (X * q).natDegree + q.natDegree + 2 with hN
  have hXq : (X * q).natDegree + 1 ≤ N := by omega
  have hq : q.natDegree + 1 ≤ N := by omega
  have hqm : q.natDegree + 1 ≤ N - 1 := by omega
  -- freeze the three heatPartials at their heatOp values
  have e1 : heatOp (1 / 2 : ℝ) (X * q) = heatPartial N (1 / 2) (X * q) := by
    unfold heatOp; rw [heatPartial_stable hXq]
  have e2 : heatOp (1 / 2 : ℝ) q = heatPartial N (1 / 2) q := by
    unfold heatOp; rw [heatPartial_stable hq]
  have e3 : heatOp (1 / 2 : ℝ) q = heatPartial (N - 1) (1 / 2) q := by
    unfold heatOp; rw [heatPartial_stable hqm]
  rw [e1, heatPartial_X_mul, ← e2, ← e3, show (2 : ℝ) * (1 / 2) = 1 by norm_num, one_smul]

/-- The real-coefficient Hermite polynomial `He_n : ℝ[X]`, obtained by pushing mathlib's
integer-coefficient `Polynomial.hermite n` along `ℤ ↪ ℝ`. -/
noncomputable def hermiteReal (n : ℕ) : ℝ[X] := (Polynomial.hermite n).map (Int.castRingHom ℝ)

/-- **The Hermite operator identity (sorry-free).**  `heatOp (1/2) Xⁿ = He_n` over `ℝ`,
i.e. `e^{−D²/2} xⁿ` is the `n`-th probabilist's Hermite polynomial.  Proved by induction:
the base case `heatOp (1/2) 1 = 1 = He_0`, and the step is the operator recursion
`heatOp_half_X_mul` matched against mathlib's `Polynomial.hermite_succ`
(`He_{n+1} = X·He_n − He_n'`), transported along the ring hom `Int.castRingHom ℝ`. -/
theorem heatOp_half_X_pow_eq_hermiteReal (n : ℕ) :
    heatOp (1 / 2 : ℝ) (X ^ n) = hermiteReal n := by
  induction n with
  | zero =>
    -- heatOp (1/2) 1 = 1 = He_0
    unfold hermiteReal
    rw [pow_zero, hermite_zero]
    unfold heatOp heatPartial
    rw [Polynomial.natDegree_one, Finset.sum_range_one]
    simp
  | succ n ih =>
    rw [pow_succ', heatOp_half_X_mul, ih]
    unfold hermiteReal
    rw [hermite_succ, Polynomial.map_sub, Polynomial.map_mul, Polynomial.map_X,
        derivative_map]

/-- **TARGET 1 (flagship, sorry-free): Hermite polynomials are real-rooted.**
Every probabilist's Hermite polynomial `He_n` (mathlib's `Polynomial.hermite n`, viewed
over `ℝ`) has only real roots.  This is `heat_preserves_LP (1/2)` applied to the trivially
real-rooted `Xⁿ`, transported across the operator identity `heatOp (1/2) Xⁿ = He_n`. -/
theorem hermiteReal_hasOnlyRealRoots (n : ℕ) : HasOnlyRealRoots (hermiteReal n) := by
  rw [← heatOp_half_X_pow_eq_hermiteReal]
  exact hasOnlyRealRoots_heatOp_X_pow (1 / 2) (by norm_num) n

/-- **TARGET 1, restated on mathlib's `Polynomial.hermite`.**  Identical content, spelled
out with the mathlib name and the explicit cast map `Int.castRingHom ℝ`. -/
theorem hermite_map_hasOnlyRealRoots (n : ℕ) :
    HasOnlyRealRoots ((Polynomial.hermite n).map (Int.castRingHom ℝ)) :=
  hermiteReal_hasOnlyRealRoots n

/-! ## TARGET 2 — Newton's inequalities (log-concavity of normalized coefficients)

For a real-rooted `p = ∑ₖ aₖ Xᵏ` of degree `n`, the *normalized* coefficients
`p̃ₖ := aₖ / C(n,k)` are log-concave: `p̃ₖ² ≥ p̃ₖ₋₁ · p̃ₖ₊₁` for `1 ≤ k ≤ n − 1`
(equivalently the elementary-symmetric means of the roots satisfy Newton's inequalities).

**Status: FULLY PROVED, sorry-free.**  mathlib v4.22.0 has no `logConcave`/Newton API for
polynomial coefficients (only symmetric-function *Newton identities* in
`RingTheory/MvPolynomial/Symmetric/NewtonIdentities.lean`, which are the power-sum ↔
elementary-symmetric recurrences, NOT the inequalities).  The proof lives in
`NewtonInequality.lean` (ported from the Aristotle-verified development under
`formalization/lean-aristotle/newton_inequality/`): the classical repeated-differentiation
reduction — `hasOnlyRealRoots_derivative` lowers `k` while
`NewtonInequality.coeff_div_choose_derivative` transports the `C(n,k)` normalization, down
to the index-`(0,1,2)` case `NewtonInequality.newton_low`, itself proved by induction on
the degree peeling off one linear factor per step. -/
theorem newton_inequality {p : ℝ[X]} (hp : HasOnlyRealRoots p) {k : ℕ}
    (hk0 : 1 ≤ k) (hk : k + 1 ≤ p.natDegree) :
    (p.coeff (k - 1) / (p.natDegree.choose (k - 1) : ℝ))
        * (p.coeff (k + 1) / (p.natDegree.choose (k + 1) : ℝ))
      ≤ (p.coeff k / (p.natDegree.choose k : ℝ)) ^ 2 :=
  NewtonInequality.newton_inequality hp hk0 hk

/-! ## Axiom audit (Targets 1 AND 2 — must be `sorryAx`-free) -/

#print axioms hasOnlyRealRoots_X_pow
#print axioms hasOnlyRealRoots_heatOp_X_pow
#print axioms iterate_derivative_X_mul
#print axioms heatPartial_X_mul
#print axioms heatOp_half_X_mul
#print axioms heatOp_half_X_pow_eq_hermiteReal
#print axioms hermiteReal_hasOnlyRealRoots
#print axioms hermite_map_hasOnlyRealRoots
#print axioms newton_inequality

end HeatCorollaries
