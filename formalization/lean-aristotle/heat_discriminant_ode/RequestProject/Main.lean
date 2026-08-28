import Mathlib

open scoped BigOperators
open scoped Real
open scoped Nat
open scoped Classical
open scoped Pointwise

set_option maxHeartbeats 8000000
set_option maxRecDepth 4000
set_option synthInstance.maxHeartbeats 20000
set_option synthInstance.maxSize 128

set_option relaxedAutoImplicit false
set_option autoImplicit false

set_option pp.fullNames true
set_option pp.structureInstances true
set_option pp.coercions.types true
set_option pp.funBinderTypes true
set_option pp.letVarTypes true
set_option pp.piBinderTypes true

set_option grind.warning false

namespace HeatDiscriminant

open Finset

/-! ## Setup

We formalize the heat-flow (attractive rational Calogero–Moser / Dyson) discriminant ODE
(Lemma S4-1 / Corollary S4-2).

Positions are indexed by `Fin N`; `pairsLt N` is the set of ordered pairs `(i, j)` with `i < j`,
and `disc y = ∏_{i<j} (y i - y j)^2` is the discriminant of the configuration `y`.
The flow is `dx_k/ds = -2 ∑_{j ≠ k} 1/(x_k - x_j)`, which enters as an explicit hypothesis
`hode`, together with the hypotheses that the motion is differentiable and that the positions
stay pairwise distinct (encoded as injectivity of `x s`).
-/

/-- The set of index pairs `(i, j)` with `i < j`. -/
def pairsLt (N : ℕ) : Finset (Fin N × Fin N) :=
  Finset.univ.filter (fun p => p.1 < p.2)

/-- The set of pairwise distinct index triples `(i, j, l)`. -/
def distinctTriples (N : ℕ) : Finset (Fin N × Fin N × Fin N) :=
  Finset.univ.filter (fun t => t.1 ≠ t.2.1 ∧ t.1 ≠ t.2.2 ∧ t.2.1 ≠ t.2.2)

/-- The discriminant of a configuration `y : Fin N → ℝ`, `Disc = ∏_{i<j} (y i - y j)^2`. -/
noncomputable def disc {N : ℕ} (y : Fin N → ℝ) : ℝ :=
  ∏ p ∈ pairsLt N, (y p.1 - y p.2) ^ 2

/-! ## Basic rewriting lemmas -/

theorem sum_pairsLt {N : ℕ} {M : Type*} [AddCommMonoid M] (f : Fin N × Fin N → M) :
    ∑ p ∈ pairsLt N, f p = ∑ i, ∑ j ∈ Finset.Ioi i, f (i, j) := by
  refine Finset.sum_finset_product _ _ _ ?_
  intro p; simp [pairsLt]

theorem prod_pairsLt {N : ℕ} {M : Type*} [CommMonoid M] (f : Fin N × Fin N → M) :
    ∏ p ∈ pairsLt N, f p = ∏ i, ∏ j ∈ Finset.Ioi i, f (i, j) := by
  refine Finset.prod_finset_product _ _ _ ?_
  intro p; simp [pairsLt]

/-- Symmetrization: a sum over ordered pairs `i ≠ j` folds into a sum over the pairs `i < j`. -/
theorem sum_pairsLt_symmetrize {N : ℕ} (g : Fin N → Fin N → ℝ) :
    ∑ p ∈ pairsLt N, (g p.1 p.2 + g p.2 p.1) = ∑ i, ∑ j ∈ ({i}ᶜ : Finset (Fin N)), g i j := by
  rw [sum_pairsLt (fun p => g p.1 p.2 + g p.2 p.1)]
  simpa [add_comm] using Finset.sum_sum_Ioi_add_eq_sum_sum_off_diag (fun i j => g j i)

/-- A sum over pairwise distinct triples written as an iterated sum. -/
theorem sum_distinctTriples {N : ℕ} (f : Fin N → Fin N → Fin N → ℝ) :
    ∑ t ∈ distinctTriples N, f t.1 t.2.1 t.2.2 =
      ∑ i, ∑ j ∈ ({i}ᶜ : Finset (Fin N)), ∑ l ∈ (({i}ᶜ : Finset (Fin N)).erase j), f i j l := by
  rw [Finset.sum_finset_product (distinctTriples N) Finset.univ
      (fun i => Finset.univ.filter (fun p : Fin N × Fin N => i ≠ p.1 ∧ i ≠ p.2 ∧ p.1 ≠ p.2))
      (by intro p; simp [distinctTriples])]
  refine Finset.sum_congr rfl (fun i _ => ?_)
  rw [Finset.sum_finset_product _ ({i}ᶜ : Finset (Fin N))
      (fun j => (({i}ᶜ : Finset (Fin N)).erase j))
      (by intro p; simp only [Finset.mem_filter, Finset.mem_univ, true_and, Finset.mem_erase,
            Finset.mem_compl, Finset.mem_singleton]; tauto)]

theorem sub_ne_zero_of_mem_pairsLt {N : ℕ} {y : Fin N → ℝ} (hy : Function.Injective y)
    {p : Fin N × Fin N} (hp : p ∈ pairsLt N) : y p.1 - y p.2 ≠ 0 := by
  simp only [pairsLt, Finset.mem_filter, Finset.mem_univ, true_and] at hp
  exact sub_ne_zero.mpr (fun h => (ne_of_lt hp) (hy h))

/-! ## Lemma 0 : the vanishing symmetric triple sum -/

/-- Cyclic rotation of a triple of indices. -/
private def rotTriple {N : ℕ} : Fin N × Fin N × Fin N ≃ Fin N × Fin N × Fin N where
  toFun t := (t.2.1, t.2.2, t.1)
  invFun t := (t.2.2, t.1, t.2.1)
  left_inv := by rintro ⟨i, j, l⟩; rfl
  right_inv := by rintro ⟨i, j, l⟩; rfl

/-- **Lemma 0 (vanishing symmetric triple sum).** For pairwise distinct reals
`y 1, …, y N`, `∑_{(i,j,l) pairwise distinct} 1 / ((y i - y j) (y i - y l)) = 0`.

The proof groups the six ordered terms of each unordered triple via the cyclic rotation
`(i,j,l) ↦ (j,l,i)`, using the partial-fraction identity
`1/((a-b)(a-c)) + 1/((b-a)(b-c)) + 1/((c-a)(c-b)) = 0`. -/
theorem sum_inv_triple_eq_zero {N : ℕ} {y : Fin N → ℝ} (hy : Function.Injective y) :
    ∑ t ∈ distinctTriples N, 1 / ((y t.1 - y t.2.1) * (y t.1 - y t.2.2)) = 0 := by
  set f : Fin N × Fin N × Fin N → ℝ :=
    fun t => 1 / ((y t.1 - y t.2.1) * (y t.1 - y t.2.2)) with hf
  have hmem : ∀ t : Fin N × Fin N × Fin N,
      t ∈ distinctTriples N ↔ rotTriple t ∈ distinctTriples N := by
    rintro ⟨i, j, l⟩
    simp only [distinctTriples, Finset.mem_filter, Finset.mem_univ, true_and, rotTriple,
      Equiv.coe_fn_mk]
    tauto
  have h1 : ∑ t ∈ distinctTriples N, f (rotTriple t) = ∑ t ∈ distinctTriples N, f t :=
    Finset.sum_equiv rotTriple hmem (fun t _ => rfl)
  have h2 : ∑ t ∈ distinctTriples N, f (rotTriple (rotTriple t))
      = ∑ t ∈ distinctTriples N, f (rotTriple t) :=
    Finset.sum_equiv rotTriple hmem (fun t _ => rfl)
  have hzero : ∑ t ∈ distinctTriples N,
      (f t + f (rotTriple t) + f (rotTriple (rotTriple t))) = 0 := by
    refine Finset.sum_eq_zero ?_
    rintro ⟨i, j, l⟩ ht
    simp only [distinctTriples, Finset.mem_filter, Finset.mem_univ, true_and] at ht
    obtain ⟨hij, hil, hjl⟩ := ht
    have hab : y i - y j ≠ 0 := sub_ne_zero.mpr (fun h => hij (hy h))
    have hac : y i - y l ≠ 0 := sub_ne_zero.mpr (fun h => hil (hy h))
    have hbc : y j - y l ≠ 0 := sub_ne_zero.mpr (fun h => hjl (hy h))
    have hba : y j - y i ≠ 0 := fun h => hab (by linarith [sub_eq_zero.mp h])
    have hca : y l - y i ≠ 0 := fun h => hac (by linarith [sub_eq_zero.mp h])
    have hcb : y l - y j ≠ 0 := fun h => hbc (by linarith [sub_eq_zero.mp h])
    simp only [hf, rotTriple, Equiv.coe_fn_mk]
    field_simp
    ring
  rw [Finset.sum_add_distrib, Finset.sum_add_distrib, h2, h1] at hzero
  linarith

/-! ## The algebraic identities behind Lemma S4-1 -/

/-- With the flow equation `v k = -2 ∑_{j ≠ k} 1/(y k - y j)`, the symmetrized sum appearing in
the logarithmic derivative of the discriminant equals minus the kinetic energy. -/
theorem sum_pairsLt_speed {N : ℕ} {y v : Fin N → ℝ} (hy : Function.Injective y)
    (hv : ∀ k, v k = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (y k - y j)) :
    ∑ p ∈ pairsLt N, 2 * (v p.1 - v p.2) / (y p.1 - y p.2) = -∑ k, (v k) ^ 2 := by
  have key : ∀ p ∈ pairsLt N, 2 * (v p.1 - v p.2) / (y p.1 - y p.2)
      = 2 * v p.1 / (y p.1 - y p.2) + 2 * v p.2 / (y p.2 - y p.1) := by
    rintro ⟨i, j⟩ hp
    have h1 : y i - y j ≠ 0 := sub_ne_zero_of_mem_pairsLt hy hp
    have h2 : y j - y i = -(y i - y j) := by ring
    simp only [h2]
    field_simp
    ring
  have hsym := sum_pairsLt_symmetrize (N := N) (fun i j => 2 * v i / (y i - y j))
  simp only at hsym
  rw [Finset.sum_congr rfl key, hsym]
  have hterm : ∀ i : Fin N, ∑ j ∈ ({i}ᶜ : Finset (Fin N)), 2 * v i / (y i - y j) = -(v i) ^ 2 := by
    intro i
    have hsum : ∑ j ∈ ({i}ᶜ : Finset (Fin N)), 2 * v i / (y i - y j)
        = 2 * v i * ∑ j ∈ ({i}ᶜ : Finset (Fin N)), 1 / (y i - y j) := by
      rw [Finset.mul_sum]; exact Finset.sum_congr rfl (fun j _ => by ring)
    rw [hsum, hv i]; ring
  rw [Finset.sum_congr rfl (fun i _ => hterm i), Finset.sum_neg_distrib]

/-- With the flow equation, the kinetic energy equals `8 ∑_{i<j} 1/(y i - y j)^2`;
the off-diagonal triples cancel by Lemma 0. -/
theorem sum_sq_speed {N : ℕ} {y v : Fin N → ℝ} (hy : Function.Injective y)
    (hv : ∀ k, v k = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (y k - y j)) :
    ∑ k, (v k) ^ 2 = 8 * ∑ p ∈ pairsLt N, 1 / (y p.1 - y p.2) ^ 2 := by
  have hsplit : ∀ k : Fin N, (v k) ^ 2 =
      4 * ((∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (y k - y j) ^ 2)
        + ∑ j ∈ ({k}ᶜ : Finset (Fin N)), ∑ l ∈ (({k}ᶜ : Finset (Fin N)).erase j),
            1 / ((y k - y j) * (y k - y l))) := by
    intro k
    have h1 : (v k) ^ 2 = 4 * ((∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (y k - y j))
        * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (y k - y j)) := by rw [hv k]; ring
    rw [h1, Finset.sum_mul_sum, ← Finset.sum_add_distrib]
    congr 1
    refine Finset.sum_congr rfl (fun j hj => ?_)
    rw [← Finset.add_sum_erase _ _ hj]
    congr 1
    · rw [div_mul_div_comm]; norm_num [sq]
    · exact Finset.sum_congr rfl (fun l _ => by rw [div_mul_div_comm]; norm_num)
  rw [Finset.sum_congr rfl (fun k (_ : k ∈ Finset.univ) => hsplit k), ← Finset.mul_sum,
    Finset.sum_add_distrib, ← sum_distinctTriples (fun i j l => 1 / ((y i - y j) * (y i - y l))),
    sum_inv_triple_eq_zero hy, add_zero]
  have hsym := sum_pairsLt_symmetrize (N := N) (fun i j => 1 / (y i - y j) ^ 2)
  simp only at hsym
  have h2 : ∑ p ∈ pairsLt N, (1 / (y p.1 - y p.2) ^ 2 + 1 / (y p.2 - y p.1) ^ 2)
      = 2 * ∑ p ∈ pairsLt N, 1 / (y p.1 - y p.2) ^ 2 := by
    rw [Finset.mul_sum]
    refine Finset.sum_congr rfl (fun p _ => ?_)
    have hsq : (y p.2 - y p.1) ^ 2 = (y p.1 - y p.2) ^ 2 := by ring
    rw [hsq]; ring
  rw [← hsym, h2]
  ring

/-- The discriminant of a configuration with pairwise distinct positions is positive. -/
theorem disc_pos {N : ℕ} {y : Fin N → ℝ} (hy : Function.Injective y) : 0 < disc y :=
  Finset.prod_pos (fun p hp => by
    have := sub_ne_zero_of_mem_pairsLt hy hp
    positivity)

/-! ## Lemma S4-1 -/

/-- The derivative of the discriminant along any differentiable motion with pairwise distinct
positions: `Disc' = Disc · ∑_{i<j} 2 (ẋ_i - ẋ_j)/(x_i - x_j)`. -/
theorem hasDerivAt_disc {N : ℕ} {x : ℝ → Fin N → ℝ} {v : Fin N → ℝ} {s₀ : ℝ}
    (hx : ∀ k, HasDerivAt (fun s => x s k) (v k) s₀)
    (hinj : Function.Injective (x s₀)) :
    HasDerivAt (fun s => disc (x s))
      (disc (x s₀) * ∑ p ∈ pairsLt N, 2 * (v p.1 - v p.2) / (x s₀ p.1 - x s₀ p.2)) s₀ := by
  have hf : ∀ p ∈ pairsLt N, HasDerivAt (fun s => (x s p.1 - x s p.2) ^ 2)
      ((2 : ℕ) * (x s₀ p.1 - x s₀ p.2) ^ (2 - 1) * (v p.1 - v p.2)) s₀ :=
    fun p _ => (((hx p.1).sub (hx p.2)).pow 2)
  have H := HasDerivAt.fun_finset_prod (u := pairsLt N)
    (f := fun p s => (x s p.1 - x s p.2) ^ 2) hf
  convert H using 1
  rw [Finset.mul_sum]
  refine Finset.sum_congr rfl (fun p hp => ?_)
  have hd : x s₀ p.1 - x s₀ p.2 ≠ 0 := sub_ne_zero_of_mem_pairsLt hinj hp
  have hprod : (∏ q ∈ (pairsLt N).erase p, (x s₀ q.1 - x s₀ q.2) ^ 2) * (x s₀ p.1 - x s₀ p.2) ^ 2
      = disc (x s₀) := Finset.prod_erase_mul _ _ hp
  simp only [smul_eq_mul, ← hprod]
  field_simp
  ring

/-- **Lemma S4-1, form (G)** (logarithm-free form): along the flow,
`Disc' = Disc · (-∑_k ẋ_k²)`. -/
theorem hasDerivAt_disc_flow_G {N : ℕ} {x : ℝ → Fin N → ℝ} {v : Fin N → ℝ} {s₀ : ℝ}
    (hx : ∀ k, HasDerivAt (fun s => x s k) (v k) s₀)
    (hinj : Function.Injective (x s₀))
    (hode : ∀ k, v k = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (x s₀ k - x s₀ j)) :
    HasDerivAt (fun s => disc (x s)) (disc (x s₀) * (-∑ k, (v k) ^ 2)) s₀ := by
  have H := hasDerivAt_disc hx hinj
  rwa [sum_pairsLt_speed hinj hode] at H

/-- **Lemma S4-1, form (S)** (logarithm-free form): along the flow,
`Disc' = Disc · (-8 ∑_{i<j} 1/(x_i - x_j)²)`. -/
theorem hasDerivAt_disc_flow_S {N : ℕ} {x : ℝ → Fin N → ℝ} {v : Fin N → ℝ} {s₀ : ℝ}
    (hx : ∀ k, HasDerivAt (fun s => x s k) (v k) s₀)
    (hinj : Function.Injective (x s₀))
    (hode : ∀ k, v k = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (x s₀ k - x s₀ j)) :
    HasDerivAt (fun s => disc (x s))
      (disc (x s₀) * (-8 * ∑ p ∈ pairsLt N, 1 / (x s₀ p.1 - x s₀ p.2) ^ 2)) s₀ := by
  have H := hasDerivAt_disc_flow_G hx hinj hode
  rw [sum_sq_speed hinj hode] at H
  convert H using 2
  ring

/-- **Lemma S4-1, form (G)** (logarithmic form): `d/ds log Disc = -∑_k ẋ_k²`. -/
theorem hasDerivAt_log_disc_flow_G {N : ℕ} {x : ℝ → Fin N → ℝ} {v : Fin N → ℝ} {s₀ : ℝ}
    (hx : ∀ k, HasDerivAt (fun s => x s k) (v k) s₀)
    (hinj : Function.Injective (x s₀))
    (hode : ∀ k, v k = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (x s₀ k - x s₀ j)) :
    HasDerivAt (fun s => Real.log (disc (x s))) (-∑ k, (v k) ^ 2) s₀ := by
  have hpos : disc (x s₀) ≠ 0 := ne_of_gt (disc_pos hinj)
  have H := (hasDerivAt_disc_flow_G hx hinj hode).log hpos
  rwa [mul_div_cancel_left₀ _ hpos] at H

/-- **Lemma S4-1, form (S)** (logarithmic form): `d/ds log Disc = -8 ∑_{i<j} 1/(x_i - x_j)²`. -/
theorem hasDerivAt_log_disc_flow_S {N : ℕ} {x : ℝ → Fin N → ℝ} {v : Fin N → ℝ} {s₀ : ℝ}
    (hx : ∀ k, HasDerivAt (fun s => x s k) (v k) s₀)
    (hinj : Function.Injective (x s₀))
    (hode : ∀ k, v k = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (x s₀ k - x s₀ j)) :
    HasDerivAt (fun s => Real.log (disc (x s)))
      (-8 * ∑ p ∈ pairsLt N, 1 / (x s₀ p.1 - x s₀ p.2) ^ 2) s₀ := by
  have hpos : disc (x s₀) ≠ 0 := ne_of_gt (disc_pos hinj)
  have H := (hasDerivAt_disc_flow_S hx hinj hode).log hpos
  rwa [mul_div_cancel_left₀ _ hpos] at H

/-! ## Corollary S4-2 : strict monotone decay -/

theorem pairsLt_nonempty {N : ℕ} (hN : 2 ≤ N) : (pairsLt N).Nonempty := by
  refine ⟨(⟨0, by omega⟩, ⟨1, by omega⟩), ?_⟩
  simp only [pairsLt, Finset.mem_filter, Finset.mem_univ, true_and]
  exact Fin.mk_lt_mk.mpr (by omega)

theorem sum_inv_sq_pairsLt_pos {N : ℕ} (hN : 2 ≤ N) {y : Fin N → ℝ} (hy : Function.Injective y) :
    0 < ∑ p ∈ pairsLt N, 1 / (y p.1 - y p.2) ^ 2 := by
  refine Finset.sum_pos (fun p hp => ?_) (pairsLt_nonempty hN)
  have := sub_ne_zero_of_mem_pairsLt hy hp
  positivity

/-- **Corollary S4-2 (strict monotone decay).** On a convex set `D` of times on which the
solution is differentiable, satisfies the flow equation and has pairwise distinct positions
(with `N ≥ 2`), the discriminant is strictly decreasing. -/
theorem strictAntiOn_disc {N : ℕ} (hN : 2 ≤ N) {x : ℝ → Fin N → ℝ} {v : ℝ → Fin N → ℝ}
    {D : Set ℝ} (hD : Convex ℝ D)
    (hx : ∀ s ∈ D, ∀ k, HasDerivAt (fun u => x u k) (v s k) s)
    (hinj : ∀ s ∈ D, Function.Injective (x s))
    (hode : ∀ s ∈ D, ∀ k, v s k = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin N)), 1 / (x s k - x s j)) :
    StrictAntiOn (fun s => disc (x s)) D := by
  have hderiv : ∀ s ∈ D, HasDerivAt (fun u => disc (x u))
      (disc (x s) * (-8 * ∑ p ∈ pairsLt N, 1 / (x s p.1 - x s p.2) ^ 2)) s :=
    fun s hs => hasDerivAt_disc_flow_S (hx s hs) (hinj s hs) (hode s hs)
  refine strictAntiOn_of_deriv_neg hD (fun s hs => ((hderiv s hs).differentiableAt).continuousAt.continuousWithinAt) ?_
  intro s hs
  have hsD : s ∈ D := interior_subset hs
  rw [(hderiv s hsD).deriv]
  have h1 : 0 < disc (x s) := disc_pos (hinj s hsD)
  have h2 : 0 < ∑ p ∈ pairsLt N, 1 / (x s p.1 - x s p.2) ^ 2 :=
    sum_inv_sq_pairsLt_pos hN (hinj s hsD)
  nlinarith

/-! ## Optional corollary : `t_c` as the smallest positive zero of the discriminant

This is the source's continuation, packaged under explicit hypotheses: `D` is the discriminant
of the (maximal) solution, agreeing with `Disc` of the configuration on `[0, t_c)`, and it
vanishes at the collision time `t_c`. Then `t_c` is the smallest positive zero of `D`. -/

theorem collisionTime_eq_sInf {N : ℕ} {x : ℝ → Fin N → ℝ} {tc : ℝ} (htc : 0 < tc)
    {D : ℝ → ℝ} (hinj : ∀ s ∈ Set.Ico (0 : ℝ) tc, Function.Injective (x s))
    (hD : ∀ s ∈ Set.Ico (0 : ℝ) tc, D s = disc (x s)) (hDtc : D tc = 0) :
    IsLeast {s : ℝ | 0 < s ∧ D s = 0} tc ∧ sInf {s : ℝ | 0 < s ∧ D s = 0} = tc := by
  have hleast : IsLeast {s : ℝ | 0 < s ∧ D s = 0} tc := by
    refine ⟨⟨htc, hDtc⟩, ?_⟩
    rintro s ⟨hs0, hDs⟩
    by_contra hlt
    push_neg at hlt
    have hmem : s ∈ Set.Ico (0 : ℝ) tc := ⟨le_of_lt hs0, hlt⟩
    have : disc (x s) = 0 := by rw [← hD s hmem]; exact hDs
    exact absurd this (ne_of_gt (disc_pos (hinj s hmem)))
  exact ⟨hleast, hleast.csInf_eq⟩

/-! ## A concrete solution (non-vacuity of the hypotheses)

The explicit two-particle solution `x(s) = (-√(1-2s), √(1-2s))` of the flow, defined for
`s < 1/2` and colliding at `s = 1/2`. It satisfies all the hypotheses of Lemma S4-1 and
Corollary S4-2, and its discriminant is `4(1-2s)`, with derivative `-8`. -/

noncomputable def twoParticle (s : ℝ) : Fin 2 → ℝ :=
  fun k => if k = 0 then -Real.sqrt (1 - 2 * s) else Real.sqrt (1 - 2 * s)

/-- The velocity field of the explicit two-particle solution. -/
noncomputable def twoParticleVel (s : ℝ) : Fin 2 → ℝ :=
  fun k => (if k = 0 then (1 : ℝ) else -1) / Real.sqrt (1 - 2 * s)

theorem twoParticle_hasDerivAt {s₀ : ℝ} (hs : 0 < 1 - 2 * s₀) (k : Fin 2) :
    HasDerivAt (fun s => twoParticle s k) (twoParticleVel s₀ k) s₀ := by
  have hsq : HasDerivAt (fun s : ℝ => Real.sqrt (1 - 2 * s))
      (-1 / Real.sqrt (1 - 2 * s₀)) s₀ := by
    have h1 : HasDerivAt (fun s : ℝ => 1 - 2 * s) (-2) s₀ := by
      simpa using ((hasDerivAt_id s₀).const_mul (2 : ℝ)).const_sub (1 : ℝ)
    have h2 := (Real.hasDerivAt_sqrt (ne_of_gt hs)).comp s₀ h1
    have hpos : Real.sqrt (1 - 2 * s₀) ≠ 0 := ne_of_gt (Real.sqrt_pos.mpr hs)
    convert h2 using 1
    field_simp
  have hneg : HasDerivAt (fun s : ℝ => -Real.sqrt (1 - 2 * s))
      (1 / Real.sqrt (1 - 2 * s₀)) s₀ := by
    simpa [neg_div] using hsq.neg
  fin_cases k
  · simpa [twoParticle, twoParticleVel] using hneg
  · simpa [twoParticle, twoParticleVel] using hsq

theorem twoParticle_injective {s₀ : ℝ} (hs : 0 < 1 - 2 * s₀) :
    Function.Injective (twoParticle s₀) := by
  have hp : 0 < Real.sqrt (1 - 2 * s₀) := Real.sqrt_pos.mpr hs
  intro a b hab
  fin_cases a <;> fin_cases b <;>
    simp only [twoParticle, Fin.zero_eta, Fin.mk_one, if_pos, one_ne_zero] at hab ⊢ <;>
    norm_num at hab ⊢ <;> linarith

theorem twoParticle_ode {s₀ : ℝ} (hs : 0 < 1 - 2 * s₀) (k : Fin 2) :
    twoParticleVel s₀ k
      = -2 * ∑ j ∈ ({k}ᶜ : Finset (Fin 2)), 1 / (twoParticle s₀ k - twoParticle s₀ j) := by
  have hp : Real.sqrt (1 - 2 * s₀) ≠ 0 := ne_of_gt (Real.sqrt_pos.mpr hs)
  have h0 : ({0}ᶜ : Finset (Fin 2)) = {1} := by decide
  have h1 : ({1}ᶜ : Finset (Fin 2)) = {0} := by decide
  fin_cases k <;>
    simp only [twoParticle, twoParticleVel, Fin.zero_eta, Fin.mk_one, h0, h1,
      Finset.sum_singleton] <;>
    norm_num <;> field_simp <;> ring

theorem twoParticle_disc {s₀ : ℝ} (hs : 0 < 1 - 2 * s₀) :
    disc (twoParticle s₀) = 4 * (1 - 2 * s₀) := by
  have h : Real.sqrt (1 - 2 * s₀) ^ 2 = 1 - 2 * s₀ := Real.sq_sqrt (le_of_lt hs)
  simp only [disc, pairsLt, twoParticle, Finset.prod_filter, Fintype.prod_prod_type,
    Fin.prod_univ_two]
  norm_num
  nlinarith [h]

theorem twoParticle_sum_inv_sq {s₀ : ℝ} (hs : 0 < 1 - 2 * s₀) :
    ∑ p ∈ pairsLt 2, 1 / (twoParticle s₀ p.1 - twoParticle s₀ p.2) ^ 2
      = 1 / (4 * (1 - 2 * s₀)) := by
  have h : Real.sqrt (1 - 2 * s₀) ^ 2 = 1 - 2 * s₀ := Real.sq_sqrt (le_of_lt hs)
  simp only [pairsLt, twoParticle, Finset.sum_filter, Fintype.sum_prod_type, Fin.sum_univ_two]
  norm_num
  rw [show (-Real.sqrt (1 - 2 * s₀) - Real.sqrt (1 - 2 * s₀)) ^ 2
      = 4 * Real.sqrt (1 - 2 * s₀) ^ 2 by ring, h, mul_inv]
  ring

/-- For the explicit two-particle solution, Lemma S4-1 (form (S)) gives `Disc' = -8`. -/
theorem twoParticle_hasDerivAt_disc {s₀ : ℝ} (hs : 0 < 1 - 2 * s₀) :
    HasDerivAt (fun s => disc (twoParticle s)) (-8) s₀ := by
  have H := hasDerivAt_disc_flow_S (fun k => twoParticle_hasDerivAt hs k)
    (twoParticle_injective hs) (fun k => twoParticle_ode hs k)
  rw [twoParticle_sum_inv_sq hs, twoParticle_disc hs] at H
  convert H using 1
  have h4 : (4 : ℝ) * (1 - 2 * s₀) ≠ 0 := by positivity
  field_simp

/-- The discriminant of the explicit two-particle solution is strictly decreasing before the
collision time `1/2`, by Corollary S4-2. -/
theorem twoParticle_strictAntiOn :
    StrictAntiOn (fun s => disc (twoParticle s)) (Set.Iio (1 / 2 : ℝ)) := by
  have hmem : ∀ s ∈ Set.Iio (1 / 2 : ℝ), 0 < 1 - 2 * s := by
    intro s hs
    simp only [Set.mem_Iio] at hs
    linarith
  exact strictAntiOn_disc (le_refl 2) (convex_Iio _)
    (fun s hs k => twoParticle_hasDerivAt (hmem s hs) k)
    (fun s hs => twoParticle_injective (hmem s hs))
    (fun s hs k => twoParticle_ode (hmem s hs) k)

end HeatDiscriminant
