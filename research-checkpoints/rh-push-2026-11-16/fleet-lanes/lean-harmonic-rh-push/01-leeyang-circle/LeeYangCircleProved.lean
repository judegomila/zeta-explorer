import Mathlib

/-!
# Multivariate Lee–Yang circle theorem, occupation-number form (proved)

Finite index set `Fin n` (the "prime sites"), symmetric nonnegative pair couplings `K p q`.
The partition polynomial in the activities `z p` is

  `stageZ K z = ∑_{S ⊆ Fin n} exp(∑_{p<q, p,q ∈ S} K p q) * ∏_{p ∈ S} z p`.

With `r p = ∑_{q ≠ p} K p q` and `ζ p = exp(r p / 2) * z p` this is the standard Lee–Yang
polynomial `∑_S ∏_{i ∈ S, j ∉ S} a_ij ∏_{i ∈ S} ζ_i` with `a_ij = exp(-K i j / 2) ∈ (0,1]`.
The multivariate circle theorem (Lee–Yang 1952, Ruelle): the polynomial does not vanish when
all `|ζ p| < 1`, and does not vanish when all `|ζ p| > 1`.

Proof route (Asano contraction, one edge at a time).
* `contr`: two-variable Asano contraction.
* `two_site`: the two-site polynomial `1 + a u + a v + u v`, `|a| ≤ 1`, has no zero in the bidisc.
* `edge2`: if `A + B x + C y + D x y` has no zero in the bidisc then neither has
  `A + a B x + a C y + D x y` (two contractions of the product with the two-site polynomial).
* `edge_step`: the same for a multi-affine polynomial in any finite number of variables.
* `LY_wt`: induction over the edges, starting from `∏ (1 + z p)`.
* `key`: the bookkeeping identity between the occupation form and the Lee–Yang form.
-/

open Finset BigOperators

noncomputable section

/-- Occupation-number partition polynomial of a pair model on `Fin n`. -/
def stageZ {n : ℕ} (K : Fin n → Fin n → ℝ) (z : Fin n → ℂ) : ℂ :=
  ∑ S : Finset (Fin n),
    (Real.exp (∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0) : ℂ) * ∏ p ∈ S, z p

/-- Total coupling attached to the site `p`. -/
def rowSum {n : ℕ} (K : Fin n → Fin n → ℝ) (p : Fin n) : ℝ :=
  ∑ q ∈ (Finset.univ.erase p), K p q

namespace LeeYang

/-! ## Two-variable lemmas -/

/-- Asano contraction in two variables. -/
theorem contr (α β γ δ : ℂ)
    (h : ∀ x u : ℂ, ‖x‖ < 1 → ‖u‖ < 1 → α + β * x + γ * u + δ * x * u ≠ 0) :
    ∀ t : ℂ, ‖t‖ < 1 → α + δ * t ≠ 0 := by
  have hα : α ≠ 0 := by
    have := h 0 0 (by simp) (by simp)
    simpa using this
  have hαpos : 0 < ‖α‖ := norm_pos_iff.mpr hα
  have hle : ‖δ‖ ≤ ‖α‖ := by
    by_contra hlt
    push_neg at hlt
    have hδ : δ ≠ 0 := by
      intro h0; rw [h0, norm_zero] at hlt; linarith [norm_nonneg α]
    have hδpos : 0 < ‖δ‖ := norm_pos_iff.mpr hδ
    obtain ⟨s, hs⟩ := IsAlgClosed.exists_pow_nat_eq ((β + γ) ^ 2 - 4 * α * δ) (n := 2) (by norm_num)
    set w1 : ℂ := (-(β + γ) + s) / (2 * δ) with hw1
    set w2 : ℂ := (-(β + γ) - s) / (2 * δ) with hw2
    have hprod : w1 * w2 = α / δ := by
      rw [hw1, hw2]; field_simp; linear_combination -hs
    have hr1 : α + β * w1 + γ * w1 + δ * w1 * w1 = 0 := by
      rw [hw1]; field_simp; linear_combination hs
    have hr2 : α + β * w2 + γ * w2 + δ * w2 * w2 = 0 := by
      rw [hw2]; field_simp; linear_combination hs
    have hn : ‖w1‖ * ‖w2‖ < 1 := by
      rw [← norm_mul, hprod, norm_div, div_lt_one hδpos]; exact hlt
    by_cases h1 : ‖w1‖ < 1
    · exact h w1 w1 h1 h1 hr1
    · by_cases h2 : ‖w2‖ < 1
      · exact h w2 w2 h2 h2 hr2
      · push_neg at h1 h2
        nlinarith [norm_nonneg w1, norm_nonneg w2]
  intro t ht h0
  have h1 : α = -(δ * t) := by linear_combination h0
  have h2 : ‖α‖ = ‖δ‖ * ‖t‖ := by rw [h1, norm_neg, norm_mul]
  nlinarith [norm_nonneg δ, norm_nonneg t]

/-- The two-site polynomial has no zero in the open bidisc. -/
theorem two_site (a : ℝ) (ha : |a| ≤ 1) (u v : ℂ) (hu : ‖u‖ < 1) (hv : ‖v‖ < 1) :
    (1 : ℂ) + a * u + a * v + u * v ≠ 0 := by
  intro h0
  have ha2 : a ^ 2 ≤ 1 := by
    have := abs_le.mp ha; nlinarith [this.1, this.2]
  have hvsq : ‖v‖ ^ 2 < 1 := by nlinarith [norm_nonneg v]
  have hsq : ‖(a : ℂ) + v‖ ^ 2 ≤ ‖(1 : ℂ) + a * v‖ ^ 2 := by
    have e1 : ‖(a : ℂ) + v‖ ^ 2 = (a + v.re) ^ 2 + v.im ^ 2 := by
      rw [Complex.sq_norm, Complex.normSq_apply]; simp; ring
    have e2 : ‖(1 : ℂ) + a * v‖ ^ 2 = (1 + a * v.re) ^ 2 + (a * v.im) ^ 2 := by
      rw [Complex.sq_norm, Complex.normSq_apply]; simp; ring
    have e3 : ‖v‖ ^ 2 = v.re ^ 2 + v.im ^ 2 := by
      rw [Complex.sq_norm, Complex.normSq_apply]; ring
    rw [e1, e2]
    rw [e3] at hvsq
    nlinarith [mul_nonneg (sub_nonneg.mpr ha2) (sub_nonneg.mpr hvsq.le)]
  have hle : ‖(a : ℂ) + v‖ ≤ ‖(1 : ℂ) + a * v‖ :=
    (pow_le_pow_iff_left₀ (norm_nonneg _) (norm_nonneg _) (by norm_num)).mp hsq
  have h1 : (1 : ℂ) + a * v = -(u * (a + v)) := by linear_combination h0
  have h2 : ‖(1 : ℂ) + a * v‖ = ‖u‖ * ‖(a : ℂ) + v‖ := by rw [h1, norm_neg, norm_mul]
  by_cases hz : (a : ℂ) + v = 0
  · have hv' : v = -(a : ℂ) := by linear_combination hz
    have h3 : (1 : ℂ) + a * v = 0 := by rw [h1, hz]; simp
    rw [hv'] at h3
    have h4 : (1 : ℝ) - a ^ 2 = 0 := by
      have : ((1 - a ^ 2 : ℝ) : ℂ) = 0 := by push_cast; linear_combination h3
      exact_mod_cast this
    have h5 : ‖v‖ ^ 2 = a ^ 2 := by
      rw [hv', norm_neg, Complex.norm_real, Real.norm_eq_abs, sq_abs]
    linarith
  · have hpos : 0 < ‖(a : ℂ) + v‖ := norm_pos_iff.mpr hz
    nlinarith

/-- Changing the weight of the mixed terms of a two-variable multi-affine polynomial. -/
theorem edge2 (A B C D : ℂ) (a : ℝ) (ha : |a| ≤ 1)
    (h : ∀ x y : ℂ, ‖x‖ < 1 → ‖y‖ < 1 → A + B * x + C * y + D * x * y ≠ 0) :
    ∀ x y : ℂ, ‖x‖ < 1 → ‖y‖ < 1 → A + a * B * x + a * C * y + D * x * y ≠ 0 := by
  -- first contraction: the pair (x, u)
  have step1 : ∀ y v x : ℂ, ‖y‖ < 1 → ‖v‖ < 1 → ‖x‖ < 1 →
      (A + C * y) * (1 + a * v) + (B + D * y) * (a + v) * x ≠ 0 := by
    intro y v x hy hv hx
    refine contr ((A + C * y) * (1 + a * v)) ((B + D * y) * (1 + a * v))
      ((A + C * y) * (a + v)) ((B + D * y) * (a + v)) ?_ x hx
    intro x' u hx' hu h0
    have e : (A + B * x' + C * y + D * x' * y) * (1 + a * u + a * v + u * v) = 0 := by
      linear_combination h0
    rcases mul_eq_zero.mp e with e1 | e2
    · exact h x' y hx' hy e1
    · exact two_site a ha u v hu hv e2
  -- second contraction: the pair (y, v)
  intro x y hx hy h0
  refine contr (A + a * B * x) (C + a * D * x) (a * A + B * x) (a * C + D * x) ?_ y hy ?_
  · intro y' v hy' hv h1
    exact step1 y' v x hy' hv hx (by linear_combination h1)
  · linear_combination h0

/-! ## Multi-affine polynomials on a finite set of sites -/

variable {ι : Type*} [Fintype ι] [DecidableEq ι]

/-- Value of the multi-affine polynomial with coefficients `c`. -/
def ev (c : Finset ι → ℂ) (z : ι → ℂ) : ℂ := ∑ S : Finset ι, c S * ∏ p ∈ S, z p

/-- No zero in the open unit polydisc. -/
def LY (c : Finset ι → ℂ) : Prop := ∀ z : ι → ℂ, (∀ p, ‖z p‖ < 1) → ev c z ≠ 0

/-- `z` with the values at `i` and `j` replaced. -/
def zz (z : ι → ℂ) (i j : ι) (x y : ℂ) : ι → ℂ :=
  fun p => if p = i then x else if p = j then y else z p

/-- Monomial in the variables other than `i`, `j`. -/
def mon (z : ι → ℂ) (i j : ι) (S : Finset ι) : ℂ :=
  ∏ p ∈ S, (if p = i ∨ p = j then 1 else z p)

theorem ev_zz (c : Finset ι → ℂ) (z : ι → ℂ) (i j : ι) (hij : i ≠ j) (x y : ℂ) :
    ev c (zz z i j x y) =
      ∑ S : Finset ι, c S * ((if i ∈ S then x else 1) * (if j ∈ S then y else 1) * mon z i j S) := by
  unfold ev
  refine Finset.sum_congr rfl (fun S _ => ?_)
  congr 1
  have hp : ∀ p, zz z i j x y p =
      (if p = i then x else 1) * (if p = j then y else 1) * (if p = i ∨ p = j then 1 else z p) := by
    intro p
    unfold zz
    by_cases h1 : p = i
    · subst h1; simp [hij]
    · by_cases h2 : p = j
      · subst h2; simp [Ne.symm hij]
      · simp [h1, h2]
  simp_rw [hp, Finset.prod_mul_distrib, Finset.prod_ite_eq']
  rfl

omit [Fintype ι] in
theorem zz_self (z : ι → ℂ) (i j : ι) : zz z i j (z i) (z j) = z := by
  funext p
  unfold zz
  by_cases h1 : p = i
  · simp [h1]
  · by_cases h2 : p = j
    · subst h2
      split_ifs with h
      · rw [h]
      · rfl
    · simp [h1, h2]

omit [Fintype ι] in
theorem zz_norm (z : ι → ℂ) (hz : ∀ p, ‖z p‖ < 1) (i j : ι) (x y : ℂ) (hx : ‖x‖ < 1)
    (hy : ‖y‖ < 1) : ∀ p, ‖zz z i j x y p‖ < 1 := by
  intro p
  unfold zz
  split_ifs
  · exact hx
  · exact hy
  · exact hz p

/-- Multiplying by `a ∈ [-1,1]` the coefficients of the sets separating `i` from `j`
preserves the Lee–Yang property. -/
theorem edge_step (c : Finset ι → ℂ) (i j : ι) (hij : i ≠ j) (a : ℝ) (ha : |a| ≤ 1)
    (h : LY c) : LY (fun S => (if (i ∈ S ↔ j ∈ S) then (1 : ℂ) else (a : ℂ)) * c S) := by
  intro z hz
  set A : ℂ := ∑ S : Finset ι, if i ∉ S ∧ j ∉ S then c S * mon z i j S else 0 with hA
  set B : ℂ := ∑ S : Finset ι, if i ∈ S ∧ j ∉ S then c S * mon z i j S else 0 with hB
  set C : ℂ := ∑ S : Finset ι, if i ∉ S ∧ j ∈ S then c S * mon z i j S else 0 with hC
  set D : ℂ := ∑ S : Finset ι, if i ∈ S ∧ j ∈ S then c S * mon z i j S else 0 with hD
  have e1 : ∀ x y : ℂ, ev c (zz z i j x y) = A + B * x + C * y + D * x * y := by
    intro x y
    rw [ev_zz c z i j hij, hA, hB, hC, hD]
    simp only [Finset.sum_mul, ← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl (fun S _ => ?_)
    by_cases h1 : i ∈ S <;> by_cases h2 : j ∈ S <;> simp [h1, h2] <;> ring
  have e2 : ∀ x y : ℂ,
      ev (fun S => (if (i ∈ S ↔ j ∈ S) then (1 : ℂ) else (a : ℂ)) * c S) (zz z i j x y)
        = A + a * B * x + a * C * y + D * x * y := by
    intro x y
    rw [ev_zz _ z i j hij, hA, hB, hC, hD]
    simp only [Finset.sum_mul, Finset.mul_sum, ← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl (fun S _ => ?_)
    by_cases h1 : i ∈ S <;> by_cases h2 : j ∈ S <;> simp [h1, h2] <;> ring
  have h2 : ∀ x y : ℂ, ‖x‖ < 1 → ‖y‖ < 1 → A + B * x + C * y + D * x * y ≠ 0 := by
    intro x y hx hy
    rw [← e1]
    exact h _ (zz_norm z hz i j x y hx hy)
  have h3 := edge2 A B C D a ha h2 (z i) (z j) (hz i) (hz j)
  rw [← e2, zz_self] at h3
  exact h3

omit [DecidableEq ι] in
/-- Base case: all weights equal to one. -/
theorem LY_one : LY (fun _ : Finset ι => (1 : ℂ)) := by
  intro z hz
  have e : ev (fun _ : Finset ι => (1 : ℂ)) z = ∏ p, (1 + z p) := by
    unfold ev
    rw [Finset.prod_one_add, Finset.powerset_univ]
    simp
  rw [e, Finset.prod_ne_zero_iff]
  intro p _ h0
  have h1 : z p = -1 := by linear_combination h0
  have := hz p
  rw [h1] at this
  simp at this

/-- Lee–Yang weights attached to a finite set of (ordered) pairs. -/
def wt (a : ι × ι → ℝ) (E : Finset (ι × ι)) (S : Finset ι) : ℂ :=
  ∏ e ∈ E, (if (e.1 ∈ S ↔ e.2 ∈ S) then (1 : ℂ) else (a e : ℂ))

theorem LY_wt (a : ι × ι → ℝ) (ha : ∀ e, |a e| ≤ 1) (E : Finset (ι × ι)) : LY (wt a E) := by
  induction E using Finset.induction_on with
  | empty =>
    have : wt a (∅ : Finset (ι × ι)) = fun _ => (1 : ℂ) := by funext S; simp [wt]
    rw [this]; exact LY_one
  | insert e E he ih =>
    have e1 : wt a (insert e E) =
        fun S => (if (e.1 ∈ S ↔ e.2 ∈ S) then (1 : ℂ) else (a e : ℂ)) * wt a E S := by
      funext S; simp [wt, Finset.prod_insert he]
    rw [e1]
    by_cases hd : e.1 = e.2
    · have : (fun S => (if (e.1 ∈ S ↔ e.2 ∈ S) then (1 : ℂ) else (a e : ℂ)) * wt a E S)
          = wt a E := by
        funext S; simp [hd]
      rw [this]; exact ih
    · exact edge_step (wt a E) e.1 e.2 hd (a e) (ha e) ih

theorem wt_compl (a : ι × ι → ℝ) (E : Finset (ι × ι)) (S : Finset ι) :
    wt a E Sᶜ = wt a E S := by
  unfold wt
  refine Finset.prod_congr rfl (fun e _ => ?_)
  simp only [Finset.mem_compl, not_iff_not]

/-- Inversion symmetry of a polynomial with complement-symmetric coefficients. -/
theorem ev_inv (c : Finset ι → ℂ) (hc : ∀ S, c Sᶜ = c S) (z : ι → ℂ) (hz : ∀ p, z p ≠ 0) :
    ev c z = (∏ p, z p) * ev c (fun p => (z p)⁻¹) := by
  have e1 : ev c (fun p => (z p)⁻¹) = ∑ S : Finset ι, c S * ∏ p ∈ Sᶜ, (z p)⁻¹ := by
    unfold ev
    rw [← Equiv.sum_comp (Function.Involutive.toPerm compl (compl_involutive (α := Finset ι)))]
    refine Finset.sum_congr rfl (fun S _ => ?_)
    simp [hc]
  rw [e1]
  unfold ev
  rw [Finset.mul_sum]
  refine Finset.sum_congr rfl (fun S _ => ?_)
  have h1 : (∏ p, z p) = (∏ p ∈ S, z p) * ∏ p ∈ Sᶜ, z p := (Finset.prod_mul_prod_compl S z).symm
  have h2 : (∏ p ∈ Sᶜ, z p) * ∏ p ∈ Sᶜ, (z p)⁻¹ = 1 := by
    rw [← Finset.prod_mul_distrib]
    exact Finset.prod_eq_one (fun p _ => mul_inv_cancel₀ (hz p))
  rw [h1]
  linear_combination (-(c S * ∏ p ∈ S, z p)) * h2

end LeeYang

open LeeYang

/-! ## The occupation form -/

/-- Edge weights `exp(-K/2)` on the pairs `p < q`, `1` elsewhere. -/
def lyA {n : ℕ} (K : Fin n → Fin n → ℝ) (e : Fin n × Fin n) : ℝ :=
  Real.exp (-(if e.1 < e.2 then K e.1 e.2 / 2 else 0))

theorem lyA_le {n : ℕ} (K : Fin n → Fin n → ℝ) (hnn : ∀ p q, 0 ≤ K p q) (e : Fin n × Fin n) :
    |lyA K e| ≤ 1 := by
  unfold lyA
  rw [abs_of_pos (Real.exp_pos _), Real.exp_le_one_iff]
  split_ifs
  · linarith [hnn e.1 e.2]
  · simp

/-- Total coupling across the cut `(S, Sᶜ)`, halved. -/
def sepSum {n : ℕ} (K : Fin n → Fin n → ℝ) (S : Finset (Fin n)) : ℝ :=
  ∑ e : Fin n × Fin n, (if (e.1 ∈ S ↔ e.2 ∈ S) then 0 else if e.1 < e.2 then K e.1 e.2 / 2 else 0)

theorem wt_lyA {n : ℕ} (K : Fin n → Fin n → ℝ) (S : Finset (Fin n)) :
    wt (lyA K) Finset.univ S = ((Real.exp (-sepSum K S) : ℝ) : ℂ) := by
  unfold wt sepSum
  rw [← Finset.sum_neg_distrib, Real.exp_sum, Complex.ofReal_prod]
  refine Finset.prod_congr rfl (fun e _ => ?_)
  by_cases h : (e.1 ∈ S ↔ e.2 ∈ S)
  · simp [h]
  · simp [h, lyA]

/-- Bookkeeping identity: pairs inside `S` = half the row sums over `S` minus half the cut. -/
theorem key {n : ℕ} (K : Fin n → Fin n → ℝ) (hsymm : ∀ p q, K p q = K q p) (S : Finset (Fin n)) :
    (∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0)
      = (∑ p ∈ S, rowSum K p / 2) - sepSum K S := by
  have h1 : (∑ p ∈ S, rowSum K p / 2)
      = (∑ p : Fin n, ∑ q : Fin n, if p ∈ S ∧ p < q then K p q / 2 else 0)
        + ∑ p : Fin n, ∑ q : Fin n, if p ∈ S ∧ q < p then K p q / 2 else 0 := by
    rw [← Finset.sum_add_distrib, ← Fintype.sum_ite_mem S]
    refine Finset.sum_congr rfl (fun p _ => ?_)
    by_cases hp : p ∈ S
    · simp only [hp, if_true, true_and]
      unfold rowSum
      rw [← Finset.sum_add_distrib, Finset.sum_div, ← Finset.filter_ne' Finset.univ p,
        Finset.sum_filter]
      refine Finset.sum_congr rfl (fun q _ => ?_)
      rcases lt_trichotomy p q with hlt | heq | hgt
      · simp [hlt, hlt.ne', not_lt.mpr hlt.le]
      · subst heq; simp
      · simp [hgt, hgt.ne, not_lt.mpr hgt.le]
    · simp [hp]
  have h2 : (∑ p : Fin n, ∑ q : Fin n, if p ∈ S ∧ q < p then K p q / 2 else 0)
      = ∑ p : Fin n, ∑ q : Fin n, if q ∈ S ∧ p < q then K p q / 2 else 0 := by
    rw [Finset.sum_comm]
    refine Finset.sum_congr rfl (fun p _ => Finset.sum_congr rfl (fun q _ => ?_))
    rw [hsymm q p]
  have h3 : (∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0)
      = ∑ p : Fin n, ∑ q : Fin n, if p ∈ S ∧ q ∈ S ∧ p < q then K p q else 0 := by
    rw [← Fintype.sum_ite_mem S]
    refine Finset.sum_congr rfl (fun p _ => ?_)
    by_cases hp : p ∈ S
    · simp only [hp, if_true, true_and]
      rw [← Fintype.sum_ite_mem S]
      refine Finset.sum_congr rfl (fun q _ => ?_)
      by_cases hq : q ∈ S <;> simp [hq]
    · simp [hp]
  have h4 : sepSum K S = ∑ p : Fin n, ∑ q : Fin n,
      (if (p ∈ S ↔ q ∈ S) then 0 else if p < q then K p q / 2 else 0) := by
    unfold sepSum
    rw [Fintype.sum_prod_type]
  rw [h1, h2, h3, h4, ← Finset.sum_add_distrib, ← Finset.sum_sub_distrib]
  refine Finset.sum_congr rfl (fun p _ => ?_)
  rw [← Finset.sum_add_distrib, ← Finset.sum_sub_distrib]
  refine Finset.sum_congr rfl (fun q _ => ?_)
  by_cases hp : p ∈ S <;> by_cases hq : q ∈ S <;> by_cases hlt : p < q <;> simp [hp, hq, hlt]

/-- The occupation polynomial is the Lee–Yang polynomial in the normalised activities. -/
theorem stageZ_eq_ev {n : ℕ} (K : Fin n → Fin n → ℝ) (hsymm : ∀ p q, K p q = K q p)
    (z : Fin n → ℂ) :
    stageZ K z = ev (wt (lyA K) Finset.univ) (fun p => (Real.exp (rowSum K p / 2) : ℂ) * z p) := by
  unfold stageZ ev
  refine Finset.sum_congr rfl (fun S _ => ?_)
  rw [wt_lyA, key K hsymm S, Finset.prod_mul_distrib, sub_eq_add_neg, Real.exp_add, Real.exp_sum]
  push_cast
  ring

/-- Lee–Yang, inside the polydisc: ferromagnetic couplings, all normalised activities of
modulus `< 1`. -/
theorem lee_yang_inside {n : ℕ} (K : Fin n → Fin n → ℝ)
    (hsymm : ∀ p q, K p q = K q p) (hnn : ∀ p q, 0 ≤ K p q)
    (z : Fin n → ℂ) (hz : ∀ p, ‖z p‖ * Real.exp (rowSum K p / 2) < 1) :
    stageZ K z ≠ 0 := by
  rw [stageZ_eq_ev K hsymm]
  refine LY_wt (lyA K) (lyA_le K hnn) Finset.univ _ (fun p => ?_)
  rw [norm_mul, Complex.norm_real, Real.norm_eq_abs, abs_of_pos (Real.exp_pos _), mul_comm]
  exact hz p

/-- Lee–Yang, outside the polydisc: all normalised activities of modulus `> 1`. -/
theorem lee_yang_outside {n : ℕ} (K : Fin n → Fin n → ℝ)
    (hsymm : ∀ p q, K p q = K q p) (hnn : ∀ p q, 0 ≤ K p q)
    (z : Fin n → ℂ) (hz : ∀ p, 1 < ‖z p‖ * Real.exp (rowSum K p / 2)) :
    stageZ K z ≠ 0 := by
  rw [stageZ_eq_ev K hsymm]
  have hn : ∀ p, ‖(Real.exp (rowSum K p / 2) : ℂ) * z p‖ = ‖z p‖ * Real.exp (rowSum K p / 2) := by
    intro p
    rw [norm_mul, Complex.norm_real, Real.norm_eq_abs, abs_of_pos (Real.exp_pos _), mul_comm]
  have hne : ∀ p, (Real.exp (rowSum K p / 2) : ℂ) * z p ≠ 0 := by
    intro p h0
    have := hz p
    rw [← hn p, h0, norm_zero] at this
    linarith
  rw [ev_inv _ (wt_compl (lyA K) Finset.univ) _ hne]
  refine mul_ne_zero (Finset.prod_ne_zero_iff.mpr (fun p _ => hne p)) ?_
  refine LY_wt (lyA K) (lyA_le K hnn) Finset.univ _ (fun p => ?_)
  rw [norm_inv, hn p]
  exact inv_lt_one_of_one_lt₀ (hz p)

end

#print axioms lee_yang_inside
#print axioms lee_yang_outside
