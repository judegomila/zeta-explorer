import Mathlib

/-!
# Exact finite-`N` viscous Burgers / heat identity and the finite Taylor-sum representation

This file formalizes the statements of `job19_burgers_heat_identity.tex`.

## Setting

A time-dependent polynomial is modelled as a map `p : ℝ → ℝ[X]`, `s ↦ p s`, whose value at `z`
is `P (z, s) = (p s).eval z`.  A *heat flow of degree bound `N`* (`BurgersHeat.IsHeatFlow`) is
such a family with

* `(p s).natDegree ≤ N` for every `s` (in the source, `p s` is monic of degree exactly `N`;
  only the uniform degree bound is used),
* every coefficient `s ↦ (p s).coeff i` differentiable in `s`,
* the forward heat equation `∂_s P = ∂_z² P` (all derivatives are `deriv`).

Following the source (and the sign discussion in the `.tex`), the Cauchy transform is taken with
the sign `M = -∂_z log P = -P'/P = ∑_k 1/(x_k - z)`.

## Main results

* `BurgersHeat.burgers_identity` (Theorem 1): `∂_s M = ∂_z² M - 2 M ∂_z M` wherever `P ≠ 0`.
* `BurgersHeat.taylor_representation` (Theorem 2): `p s = ∑_{m ≤ N/2} (s^m/m!) • D^{2m} (p 0)`.
* `BurgersHeat.taylor_representation_heatOp` (Corollary): `p s = heatOp (-s) (p 0)`, where
  `heatOp t q = ∑_k ((-t)^k/k!) • D^{2k} q` is the de Bruijn (anti-diffusive) heat operator.

The interval `I ∋ 0` of the source is taken to be all of `ℝ` here (the hypotheses are imposed for
all `s : ℝ`).
-/

open Polynomial

namespace BurgersHeat

/-- `P (z, s)`: the value at `z` of the time-dependent polynomial `p`. -/
noncomputable def Pf (p : ℝ → ℝ[X]) (z s : ℝ) : ℝ := (p s).eval z

/-- `M (z, s) = -∂_z log P = -(∂_z P)/P`, the Cauchy transform with the source's sign
convention (`M = ∑_k 1/(x_k - z)` when `P = ∏_k (z - x_k)`). -/
noncomputable def Mf (p : ℝ → ℝ[X]) (z s : ℝ) : ℝ :=
  -deriv (fun ζ => Pf p ζ s) z / Pf p z s

/-- The de Bruijn heat operator `e^{-t D²}` on polynomials, `heatOp t q = ∑_k ((-t)^k/k!) D^{2k} q`
(a finite sum, since `D^{2k} q = 0` once `2k > deg q`). -/
noncomputable def heatOp (t : ℝ) (q : ℝ[X]) : ℝ[X] :=
  ∑ k ∈ Finset.range (q.natDegree / 2 + 1), ((-t) ^ k / (Nat.factorial k : ℝ)) • (derivative^[2 * k] q)

/-- A time-dependent polynomial family of degree at most `N`, with differentiable coefficients,
solving the forward heat equation `∂_s P = ∂_z² P`. -/
structure IsHeatFlow (N : ℕ) (p : ℝ → ℝ[X]) : Prop where
  degree_le : ∀ s, (p s).natDegree ≤ N
  coeff_differentiable : ∀ i, Differentiable ℝ (fun s => (p s).coeff i)
  heat : ∀ z s, deriv (fun σ => Pf p z σ) s = deriv (deriv (fun ζ => Pf p ζ s)) z

variable {N : ℕ} {p : ℝ → ℝ[X]}

/-- The heat equation in polynomial form: `∂_s P (z, s) = (D² (p s)).eval z`. -/
lemma heat_poly (hp : IsHeatFlow N p) (z s : ℝ) :
    deriv (fun σ => Pf p z σ) s = (derivative^[2] (p s)).eval z := by
  rw [hp.heat z s]
  have h : deriv (fun ζ => Pf p ζ s) = fun ζ => eval ζ (derivative (p s)) := by
    funext ζ; exact (p s).deriv
  rw [h, Polynomial.deriv]
  simp [Function.iterate_succ_apply']

/-- Expansion of `(D^k q).eval z` as a linear combination of the coefficients of `q`. -/
lemma eval_iterate_derivative_eq_sum {q : ℝ[X]} (hq : q.natDegree ≤ N) (k : ℕ) (z : ℝ) :
    (derivative^[k] q).eval z
      = ∑ i ∈ Finset.range (N + 1), q.coeff i * (derivative^[k] ((X : ℝ[X]) ^ i)).eval z := by
  conv_lhs => rw [q.as_sum_range' (N + 1) (by omega)]
  simp [Polynomial.iterate_derivative_sum, ← Polynomial.C_mul_X_pow_eq_monomial,
    Polynomial.iterate_derivative_C_mul, Polynomial.eval_finset_sum]

/-- The coefficients of a heat flow satisfy the coefficient form of the heat equation. -/
lemma hasDerivAt_coeff (hp : IsHeatFlow N p) (i : ℕ) (s : ℝ) :
    HasDerivAt (fun σ => (p σ).coeff i) ((derivative^[2] (p s)).coeff i) s := by
  set c : ℕ → ℝ := fun i => deriv (fun σ => (p σ).coeff i) s with hc
  have hd : ∀ i, HasDerivAt (fun σ => (p σ).coeff i) (c i) s := fun i =>
    ((hp.coeff_differentiable i) s).hasDerivAt.congr_deriv rfl
  have hzero : ∀ j, N < j → c j = 0 := by
    intro j hj
    have hfun : (fun σ => (p σ).coeff j) = fun _ => (0 : ℝ) := by
      funext σ
      exact Polynomial.coeff_eq_zero_of_natDegree_lt (lt_of_le_of_lt (hp.degree_le σ) hj)
    simp [hc, hfun]
  set q1 : ℝ[X] := ∑ i ∈ Finset.range (N + 1), (monomial i) (c i) with hq1def
  have hq1c : ∀ j, q1.coeff j = c j := by
    intro j
    by_cases hj : j < N + 1
    · simp [hq1def, Polynomial.finset_sum_coeff, Polynomial.coeff_monomial,
        Finset.sum_ite_eq', hj]
    · simp [hq1def, Polynomial.finset_sum_coeff, Polynomial.coeff_monomial,
        Finset.sum_ite_eq', hj, hzero j (by omega)]
  have key : q1 = derivative^[2] (p s) := by
    apply Polynomial.funext
    intro z
    have h1 : HasDerivAt (fun σ => Pf p z σ) (∑ i ∈ Finset.range (N + 1), c i * z ^ i) s := by
      have he : (fun σ => Pf p z σ)
          = ∑ i ∈ Finset.range (N + 1), (fun σ => (p σ).coeff i * z ^ i) := by
        funext σ
        rw [Finset.sum_apply]
        exact Polynomial.eval_eq_sum_range' (Nat.lt_succ_of_le (hp.degree_le σ)) z
      rw [he]
      exact HasDerivAt.sum (fun i _ => (hd i).mul_const (z ^ i))
    have h2 := heat_poly hp z s
    rw [h1.deriv] at h2
    rw [← h2, hq1def]
    simp [Polynomial.eval_finset_sum, Polynomial.eval_monomial]
  rw [← key, hq1c i]
  exact hd i

/-- All `z`-derivatives of a heat flow are differentiable in `s`, with `∂_s D^k P = D^{k+2} P`. -/
lemma hasDerivAt_eval_iterate (hp : IsHeatFlow N p) (k : ℕ) (z s : ℝ) :
    HasDerivAt (fun σ => (derivative^[k] (p σ)).eval z) ((derivative^[k + 2] (p s)).eval z) s := by
  have hdeg2 : (derivative^[2] (p s)).natDegree ≤ N :=
    le_trans (Polynomial.natDegree_iterate_derivative (p s) 2)
      (le_trans (Nat.sub_le _ _) (hp.degree_le s))
  have he : (fun σ => (derivative^[k] (p σ)).eval z)
      = ∑ i ∈ Finset.range (N + 1),
          (fun σ => (p σ).coeff i * (derivative^[k] ((X : ℝ[X]) ^ i)).eval z) := by
    funext σ
    rw [Finset.sum_apply]
    exact eval_iterate_derivative_eq_sum (hp.degree_le σ) k z
  rw [he]
  have hsum := HasDerivAt.sum
    (fun i (_ : i ∈ Finset.range (N + 1)) =>
      (hasDerivAt_coeff hp i s).mul_const ((derivative^[k] ((X : ℝ[X]) ^ i)).eval z))
  refine hsum.congr_deriv ?_
  rw [← eval_iterate_derivative_eq_sum hdeg2 k z, Function.iterate_add_apply]

/-! ### Theorem 1: the exact finite-`N` viscous Burgers identity -/

/-- `∂_z (D^k q) = D^{k+1} q`, as a `HasDerivAt` statement. -/
lemma hasDerivAt_iterate_eval (q : ℝ[X]) (k : ℕ) (z : ℝ) :
    HasDerivAt (fun ζ => (derivative^[k] q).eval ζ) ((derivative^[k + 1] q).eval z) z := by
  simpa [Function.iterate_succ_apply'] using Polynomial.hasDerivAt (derivative^[k] q) z

lemma Mf_eq (p : ℝ → ℝ[X]) (z s : ℝ) :
    Mf p z s = -(derivative (p s)).eval z / (p s).eval z := by
  simp [Mf, Pf, Polynomial.deriv]

/-- First `z`-derivative of `M`. -/
lemma hasDerivAt_Mf_z (p : ℝ → ℝ[X]) (s z : ℝ) (hz : (p s).eval z ≠ 0) :
    HasDerivAt (fun ζ => Mf p ζ s)
      (((derivative^[1] (p s)).eval z ^ 2 - (derivative^[2] (p s)).eval z * (p s).eval z)
        / (p s).eval z ^ 2) z := by
  have hfun : (fun ζ => Mf p ζ s) = fun ζ => -(derivative^[1] (p s)).eval ζ / (p s).eval ζ := by
    funext ζ; simpa using Mf_eq p ζ s
  rw [hfun]
  have h1 : HasDerivAt (fun ζ => -(derivative^[1] (p s)).eval ζ)
      (-(derivative^[2] (p s)).eval z) z := (hasDerivAt_iterate_eval (p s) 1 z).neg
  have h2 : HasDerivAt (fun ζ => (p s).eval ζ) ((derivative^[1] (p s)).eval z) z := by
    simpa using hasDerivAt_iterate_eval (p s) 0 z
  have h3 : HasDerivAt (fun ζ => -(derivative^[1] (p s)).eval ζ / (p s).eval ζ)
      ((-(derivative^[2] (p s)).eval z * (p s).eval z
        - (-(derivative^[1] (p s)).eval z) * (derivative^[1] (p s)).eval z)
        / (p s).eval z ^ 2) z := h1.div h2 hz
  exact h3.congr_deriv (by ring)

/-- First `z`-derivative of `M`. -/
lemma deriv_z_Mf (p : ℝ → ℝ[X]) (z s : ℝ) (hz : (p s).eval z ≠ 0) :
    deriv (fun ζ => Mf p ζ s) z =
      ((derivative (p s)).eval z ^ 2 - (derivative^[2] (p s)).eval z * (p s).eval z)
        / (p s).eval z ^ 2 := by
  simpa using (hasDerivAt_Mf_z p s z hz).deriv

/-- Second `z`-derivative of `M`. -/
lemma deriv2_z_Mf (p : ℝ → ℝ[X]) (z s : ℝ) (hz : (p s).eval z ≠ 0) :
    deriv (deriv (fun ζ => Mf p ζ s)) z =
      (3 * (p s).eval z * (derivative (p s)).eval z * (derivative^[2] (p s)).eval z
        - (p s).eval z ^ 2 * (derivative^[3] (p s)).eval z
        - 2 * (derivative (p s)).eval z ^ 3) / (p s).eval z ^ 3 := by
  have hU : ∀ᶠ ζ in nhds z, (p s).eval ζ ≠ 0 :=
    ((Polynomial.continuous (p s)).continuousAt).eventually_ne hz
  have heq : deriv (fun ζ => Mf p ζ s) =ᶠ[nhds z]
      fun ζ => ((derivative^[1] (p s)).eval ζ ^ 2
        - (derivative^[2] (p s)).eval ζ * (p s).eval ζ) / (p s).eval ζ ^ 2 :=
    hU.mono (fun ζ hζ => (hasDerivAt_Mf_z p s ζ hζ).deriv)
  rw [heq.deriv_eq]
  have h0 : HasDerivAt (fun ζ => (p s).eval ζ) ((derivative^[1] (p s)).eval z) z := by
    simpa using hasDerivAt_iterate_eval (p s) 0 z
  have h1 := hasDerivAt_iterate_eval (p s) 1 z
  have h2 := hasDerivAt_iterate_eval (p s) 2 z
  have hn : HasDerivAt (fun ζ => (derivative^[1] (p s)).eval ζ ^ 2
      - (derivative^[2] (p s)).eval ζ * (p s).eval ζ)
      (2 * (derivative^[1] (p s)).eval z * (derivative^[2] (p s)).eval z
        - ((derivative^[3] (p s)).eval z * (p s).eval z
          + (derivative^[2] (p s)).eval z * (derivative^[1] (p s)).eval z)) z := by
    have hp2 : HasDerivAt (fun ζ => (derivative^[1] (p s)).eval ζ ^ 2)
        (2 * (derivative^[1] (p s)).eval z * (derivative^[2] (p s)).eval z) z := by
      simpa [mul_comm, mul_assoc, mul_left_comm] using h1.pow 2
    exact hp2.sub (h2.mul h0)
  have hd : HasDerivAt (fun ζ => (p s).eval ζ ^ 2)
      (2 * (p s).eval z * (derivative^[1] (p s)).eval z) z := by
    simpa [mul_comm, mul_assoc, mul_left_comm] using h0.pow 2
  have hz2 : (p s).eval z ^ 2 ≠ 0 := pow_ne_zero _ hz
  have hq : HasDerivAt (fun ζ => ((derivative^[1] (p s)).eval ζ ^ 2
        - (derivative^[2] (p s)).eval ζ * (p s).eval ζ) / (p s).eval ζ ^ 2)
      (((2 * (derivative^[1] (p s)).eval z * (derivative^[2] (p s)).eval z
        - ((derivative^[3] (p s)).eval z * (p s).eval z
          + (derivative^[2] (p s)).eval z * (derivative^[1] (p s)).eval z)) * (p s).eval z ^ 2
        - ((derivative^[1] (p s)).eval z ^ 2 - (derivative^[2] (p s)).eval z * (p s).eval z)
          * (2 * (p s).eval z * (derivative^[1] (p s)).eval z)) / ((p s).eval z ^ 2) ^ 2) z :=
    hn.div hd hz2
  rw [hq.deriv]
  simp only [Function.iterate_one]
  field_simp
  ring

/-- `s`-derivative of `M`. -/
lemma deriv_s_Mf (hp : IsHeatFlow N p) (z s : ℝ) (hz : (p s).eval z ≠ 0) :
    deriv (fun σ => Mf p z σ) s =
      ((derivative (p s)).eval z * (derivative^[2] (p s)).eval z
        - (p s).eval z * (derivative^[3] (p s)).eval z) / (p s).eval z ^ 2 := by
  have hfun : (fun σ => Mf p z σ) = fun σ => -(derivative^[1] (p σ)).eval z / (p σ).eval z := by
    funext σ; simpa using Mf_eq p z σ
  rw [hfun]
  have hB : HasDerivAt (fun σ => -(derivative^[1] (p σ)).eval z)
      (-(derivative^[3] (p s)).eval z) s := (hasDerivAt_eval_iterate hp 1 z s).neg
  have hA : HasDerivAt (fun σ => (p σ).eval z) ((derivative^[2] (p s)).eval z) s := by
    simpa using hasDerivAt_eval_iterate hp 0 z s
  have h3 : HasDerivAt (fun σ => -(derivative^[1] (p σ)).eval z / (p σ).eval z)
      ((-(derivative^[3] (p s)).eval z * (p s).eval z
        - (-(derivative^[1] (p s)).eval z) * (derivative^[2] (p s)).eval z)
        / (p s).eval z ^ 2) s := hB.div hA hz
  rw [h3.deriv]
  simp only [Function.iterate_one]
  ring

/-- **Theorem 1** (exact finite-`N` viscous Burgers identity).  If `P` is a polynomial in `z` of
degree at most `N` with `s`-differentiable coefficients solving the heat equation
`∂_s P = ∂_z² P`, then `M = -∂_z log P` satisfies, wherever `P ≠ 0`,
`∂_s M = ∂_z² M - 2 M ∂_z M`. -/
theorem burgers_identity (hp : IsHeatFlow N p) (z s : ℝ) (hz : Pf p z s ≠ 0) :
    deriv (fun σ => Mf p z σ) s
      = deriv (deriv (fun ζ => Mf p ζ s)) z - 2 * Mf p z s * deriv (fun ζ => Mf p ζ s) z := by
  have hz' : (p s).eval z ≠ 0 := hz
  rw [deriv_s_Mf hp z s hz', deriv2_z_Mf p z s hz', deriv_z_Mf p z s hz', Mf_eq]
  field_simp
  ring

/-! ### Theorem 2: the finite Taylor-sum representation -/

/-- **Theorem 2** (finite Taylor-sum representation).  A heat flow of degree bound `N` is given by
the finite Taylor sum `p s = ∑_{m ≤ N/2} (s^m/m!) • D^{2m} (p 0)`. -/
theorem taylor_representation (hp : IsHeatFlow N p) (s : ℝ) :
    p s = ∑ m ∈ Finset.range (N / 2 + 1),
      (s ^ m / (Nat.factorial m : ℝ)) • (derivative^[2 * m] (p 0)) := by
  apply Polynomial.funext
  intro z
  set K := N / 2 with hK
  set f : ℕ → ℝ → ℝ := fun m σ => (derivative^[2 * m] (p σ)).eval z with hf
  have hfd : ∀ m σ, HasDerivAt (f m) (f (m + 1) σ) σ := by
    intro m σ
    have h := hasDerivAt_eval_iterate hp (2 * m) z σ
    have he : 2 * m + 2 = 2 * (m + 1) := by ring
    rw [he] at h
    exact h
  have hfK : ∀ σ, f (K + 1) σ = 0 := by
    intro σ
    have hd : (p σ).natDegree < 2 * (K + 1) := by
      have := hp.degree_le σ
      omega
    simp [hf, Polynomial.iterate_derivative_eq_zero hd]
  set G : ℝ → ℝ :=
    fun σ => ∑ m ∈ Finset.range (K + 1), ((s - σ) ^ m / (Nat.factorial m : ℝ)) * f m σ with hG
  have hGd : ∀ σ, HasDerivAt G 0 σ := by
    intro σ
    have hterm : ∀ m ∈ Finset.range (K + 1),
        HasDerivAt (fun τ => ((s - τ) ^ m / (Nat.factorial m : ℝ)) * f m τ)
          (-((m : ℝ) * (s - σ) ^ (m - 1)) / (Nat.factorial m : ℝ) * f m σ
            + ((s - σ) ^ m / (Nat.factorial m : ℝ)) * f (m + 1) σ) σ := by
      intro m _
      have hbase : HasDerivAt (fun τ : ℝ => s - τ) (-1) σ := by
        simpa using (hasDerivAt_id σ).const_sub s
      have hpow : HasDerivAt (fun τ : ℝ => (s - τ) ^ m) ((m : ℝ) * (s - σ) ^ (m - 1) * (-1)) σ :=
        hbase.pow m
      exact ((hpow.div_const (Nat.factorial m : ℝ)).mul (hfd m σ)).congr_deriv (by ring)
    have hfe : (fun τ => ∑ m ∈ Finset.range (K + 1),
          ((s - τ) ^ m / (Nat.factorial m : ℝ)) * f m τ)
        = ∑ m ∈ Finset.range (K + 1),
          (fun τ => ((s - τ) ^ m / (Nat.factorial m : ℝ)) * f m τ) := by
      funext τ
      rw [Finset.sum_apply]
    have hval : ∑ m ∈ Finset.range (K + 1),
        (-((m : ℝ) * (s - σ) ^ (m - 1)) / (Nat.factorial m : ℝ) * f m σ
          + ((s - σ) ^ m / (Nat.factorial m : ℝ)) * f (m + 1) σ) = 0 := by
      have tele : ∀ n : ℕ, ∑ m ∈ Finset.range (n + 1),
          (-((m : ℝ) * (s - σ) ^ (m - 1)) / (Nat.factorial m : ℝ) * f m σ
            + ((s - σ) ^ m / (Nat.factorial m : ℝ)) * f (m + 1) σ)
          = (s - σ) ^ n / (Nat.factorial n : ℝ) * f (n + 1) σ := by
        intro n
        induction n with
        | zero => simp
        | succ n ih =>
            rw [Finset.sum_range_succ, ih]
            have hfac : (Nat.factorial (n + 1) : ℝ) = (n + 1) * (Nat.factorial n : ℝ) := by
              push_cast [Nat.factorial_succ]; ring
            have hne : (Nat.factorial n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr (Nat.factorial_ne_zero n)
            simp only [Nat.add_sub_cancel, hfac]
            field_simp
            push_cast
            ring
      rw [tele K, hfK σ]
      ring
    rw [hG, hfe]
    exact (HasDerivAt.sum hterm).congr_deriv hval
  have hconst : G s = G 0 :=
    is_const_of_deriv_eq_zero (fun σ => (hGd σ).differentiableAt) (fun σ => (hGd σ).deriv) s 0
  have hGs : G s = (p s).eval z := by
    rw [hG]
    simp only [sub_self]
    rw [Finset.sum_eq_single_of_mem 0 (Finset.mem_range.mpr (Nat.succ_pos K))
      (fun m _ hm => by simp [zero_pow hm])]
    simp [hf]
  have hG0 : G 0 = (∑ m ∈ Finset.range (K + 1),
      (s ^ m / (Nat.factorial m : ℝ)) • (derivative^[2 * m] (p 0))).eval z := by
    simp [hG, hf, Polynomial.eval_finset_sum]
  rw [← hGs, hconst, hG0]

/-- **Corollary** (bridge to `heatOp`).  Theorem 2 says exactly that `p s = heatOp (-s) (p 0)`,
i.e. the de Bruijn heat operator `e^{-tD²}` evaluated at `t = -s`. -/
theorem taylor_representation_heatOp (hp : IsHeatFlow N p) (s : ℝ) :
    p s = heatOp (-s) (p 0) := by
  rw [taylor_representation hp s, heatOp]
  simp only [neg_neg]
  refine (Finset.sum_subset ?_ ?_).symm
  · intro k hk
    have hd := hp.degree_le 0
    simp only [Finset.mem_range] at hk ⊢
    omega
  · intro k _ hk
    have hd := hp.degree_le 0
    simp only [Finset.mem_range, not_lt] at hk
    have : (p 0).natDegree < 2 * k := by omega
    simp [Polynomial.iterate_derivative_eq_zero this]

/-! ### A concrete example (non-vacuity of the hypotheses) -/

/-- `P (z, s) = z² + 2s` is a heat flow of degree bound `2`: the hypotheses of the theorems
above are satisfiable. -/
lemma isHeatFlow_sq_add : IsHeatFlow 2 (fun s => X ^ 2 + C (2 * s)) := by
  constructor
  · intro s
    apply le_trans (Polynomial.natDegree_add_le _ _)
    simp only [Polynomial.natDegree_X_pow, Polynomial.natDegree_C, max_le_iff]
    exact ⟨le_refl _, Nat.zero_le _⟩
  · intro i
    have h : (fun s : ℝ => ((X : ℝ[X]) ^ 2 + C (2 * s)).coeff i)
        = fun s : ℝ => (if i = 2 then (1 : ℝ) else 0) + (if i = 0 then 2 * s else 0) := by
      funext s
      rcases i with _ | _ | i <;> simp [Polynomial.coeff_X_pow, Polynomial.coeff_C]
    rw [h]
    by_cases hi : i = 0
    · simp [hi]
      fun_prop
    · simp [hi]
  · intro z s
    have h1 : (fun σ : ℝ => Pf (fun s => X ^ 2 + C (2 * s)) z σ) = fun σ => z ^ 2 + 2 * σ := by
      funext σ; simp [Pf]
    have h2 : (fun ζ : ℝ => Pf (fun s => X ^ 2 + C (2 * s)) ζ s) = fun ζ => ζ ^ 2 + 2 * s := by
      funext ζ; simp [Pf]
    rw [h1, h2]
    have hd : deriv (fun ζ : ℝ => ζ ^ 2 + 2 * s) = fun ζ => 2 * ζ := by
      funext ζ
      have h3 : HasDerivAt (fun ζ : ℝ => ζ ^ 2 + 2 * s) (2 * ζ) ζ := by
        simpa using (hasDerivAt_pow 2 ζ).add_const (2 * s)
      exact h3.deriv
    rw [hd]
    have h4 : HasDerivAt (fun σ : ℝ => z ^ 2 + 2 * σ) 2 s := by
      simpa using ((hasDerivAt_id s).const_mul (2 : ℝ)).const_add (z ^ 2)
    rw [h4.deriv]
    simpa using ((hasDerivAt_id z).const_mul (2 : ℝ)).deriv.symm

end BurgersHeat
