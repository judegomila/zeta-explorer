import Mathlib

/-!
# Inertia theorem for the bridge kernel, finite form

Finite model of the logarithmic derivative of a function of class (H):

  `L z = a z + ∑_k ma k / (z - i γ k) + ∑_j mr j * (1/(z - ρ j) + 1/(z + conj (ρ j)))`

with `a ≥ 0`, axis zeros `i γ k` of weights `ma k > 0`, and `κ` distinct zeros `ρ j` in
`Re > 0` (each paired with `-conj (ρ j)`), weights `mr j > 0`.
Kernel `K z w = (L z + conj (L w)) / (z + conj w)` on
`Ω = {Re z > 0} \ {ρ j}`.

Claims:
 * `kernel_identity`: the termwise (Pick) decomposition of `K`;
 * `form_nonneg_of_constraints`: the Hermitian form of `K` on any finite point set is `≥ 0` on
   the subspace cut out by the `κ` linear conditions `∑_i c i / (z i - ρ j) = 0`
   (so at most `κ` negative squares);
 * `exists_negative_subspace`: some finite point set in `Ω` carries a `κ`-dimensional subspace
   on which the form is negative definite (so at least `κ` negative squares).
Together: the kernel has exactly `κ` negative squares, `κ` = number of distinct zeros in
`Re z > 0`, independent of the weights (multiplicities).
-/

open Finset BigOperators
open scoped ComplexConjugate

noncomputable section

variable {m κ : ℕ}

def Lfun (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (z : ℂ) : ℂ :=
  (a : ℂ) * z + ∑ k, (ma k : ℂ) / (z - Complex.I * (γ k : ℂ))
    + ∑ j, (mr j : ℂ) * (1 / (z - ρ j) + 1 / (z + conj (ρ j)))

def Kker (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (z w : ℂ) : ℂ :=
  (Lfun a γ ma ρ mr z + conj (Lfun a γ ma ρ mr w)) / (z + conj w)

/-- Hermitian form of the kernel on the points `z i` with coefficients `c i`. -/
def kform (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    {n : ℕ} (z : Fin n → ℂ) (c : Fin n → ℂ) : ℂ :=
  ∑ i, ∑ l, c i * conj (c l) * Kker a γ ma ρ mr (z i) (z l)


theorem kernel_identity (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    (hρ : ∀ j, 0 < (ρ j).re) (z w : ℂ) (hz : 0 < z.re) (hw : 0 < w.re)
    (hzρ : ∀ j, z ≠ ρ j) (hwρ : ∀ j, w ≠ ρ j) :
    Kker a γ ma ρ mr z w
      = (a : ℂ)
        + ∑ k, (ma k : ℂ) / ((z - Complex.I * (γ k : ℂ)) * conj (w - Complex.I * (γ k : ℂ)))
        + ∑ j, (mr j : ℂ) * (1 / ((z - ρ j) * (conj w + ρ j))
                              + 1 / ((z + conj (ρ j)) * (conj w - conj (ρ j)))) := by
  have hzw : z + conj w ≠ 0 := by
    intro h; have := congrArg Complex.re h; simp at this; linarith
  have h1 : ∀ k, (ma k : ℂ) / (z - Complex.I * (γ k : ℂ))
      + conj ((ma k : ℂ) / (w - Complex.I * (γ k : ℂ)))
      = (ma k : ℂ) / ((z - Complex.I * (γ k : ℂ)) * conj (w - Complex.I * (γ k : ℂ)))
        * (z + conj w) := by
    intro k
    have e1 : z - Complex.I * (γ k : ℂ) ≠ 0 := by
      intro h; have := congrArg Complex.re h; simp at this; linarith
    have e2 : conj w + Complex.I * (γ k : ℂ) ≠ 0 := by
      intro h; have := congrArg Complex.re h; simp at this; linarith
    have e3 : conj (w - Complex.I * (γ k : ℂ)) = conj w + Complex.I * (γ k : ℂ) := by
      simp
    rw [map_div₀, e3, Complex.conj_ofReal]
    field_simp
    ring
  have h2 : ∀ j, (mr j : ℂ) * (1 / (z - ρ j) + 1 / (z + conj (ρ j)))
      + conj ((mr j : ℂ) * (1 / (w - ρ j) + 1 / (w + conj (ρ j))))
      = (mr j : ℂ) * (1 / ((z - ρ j) * (conj w + ρ j))
                              + 1 / ((z + conj (ρ j)) * (conj w - conj (ρ j)))) * (z + conj w) := by
    intro j
    have e1 : z - ρ j ≠ 0 := sub_ne_zero.mpr (hzρ j)
    have e2 : conj w + ρ j ≠ 0 := by
      intro h; have := congrArg Complex.re h; have := hρ j; simp at *; linarith
    have e3 : z + conj (ρ j) ≠ 0 := by
      intro h; have := congrArg Complex.re h; have := hρ j; simp at *; linarith
    have e4 : conj w - conj (ρ j) ≠ 0 := by
      rw [← map_sub]; exact (map_ne_zero _).mpr (sub_ne_zero.mpr (hwρ j))
    have e5 : conj ((mr j : ℂ) * (1 / (w - ρ j) + 1 / (w + conj (ρ j))))
        = (mr j : ℂ) * (1 / (conj w - conj (ρ j)) + 1 / (conj w + ρ j)) := by
      simp
    rw [e5]
    field_simp
    ring
  have h0 : conj ((a : ℂ) * w) = (a : ℂ) * conj w := by simp
  unfold Kker
  rw [div_eq_iff hzw]
  calc Lfun a γ ma ρ mr z + conj (Lfun a γ ma ρ mr w)
      = (a : ℂ) * (z + conj w)
        + ∑ k, ((ma k : ℂ) / (z - Complex.I * (γ k : ℂ))
            + conj ((ma k : ℂ) / (w - Complex.I * (γ k : ℂ))))
        + ∑ j, ((mr j : ℂ) * (1 / (z - ρ j) + 1 / (z + conj (ρ j)))
            + conj ((mr j : ℂ) * (1 / (w - ρ j) + 1 / (w + conj (ρ j))))) := by
        simp only [Lfun, map_add, map_sum, Finset.sum_add_distrib, h0]
        ring
    _ = _ := by
        simp only [h1, h2, ← Finset.sum_mul]
        ring

/-- The Hermitian form on a general finite index type. -/
def gform (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    {P : Type} [Fintype P] (z : P → ℂ) (c : P → ℂ) : ℂ :=
  ∑ i, ∑ l, c i * conj (c l) * Kker a γ ma ρ mr (z i) (z l)

theorem kform_eq_gform (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    {n : ℕ} (z : Fin n → ℂ) (c : Fin n → ℂ) :
    kform a γ ma ρ mr z c = gform a γ ma ρ mr z c := rfl

theorem sum3 {P K : Type} [Fintype P] [Fintype K] (w : K → ℂ) (f g : K → P → ℂ) :
    ∑ i, ∑ l, ∑ k, w k * (f k i * conj (g k l))
      = ∑ k, w k * ((∑ i, f k i) * conj (∑ l, g k l)) := by
  simp_rw [map_sum, Finset.sum_mul_sum, Finset.mul_sum]
  calc ∑ i, ∑ l, ∑ k, w k * (f k i * conj (g k l))
      = ∑ i, ∑ k, ∑ l, w k * (f k i * conj (g k l)) :=
        Finset.sum_congr rfl (fun i _ => Finset.sum_comm)
    _ = _ := Finset.sum_comm

/-- Decomposition of the form into squares: the Pick part and the hyperbolic pairs. -/
theorem gform_decomp (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    (hρ : ∀ j, 0 < (ρ j).re) {P : Type} [Fintype P] (z : P → ℂ) (c : P → ℂ)
    (hz : ∀ i, 0 < (z i).re) (hzρ : ∀ i j, z i ≠ ρ j) :
    gform a γ ma ρ mr z c
      = (a : ℂ) * ((∑ i, c i) * conj (∑ i, c i))
        + ∑ k, (ma k : ℂ) * ((∑ i, c i / (z i - Complex.I * (γ k : ℂ)))
              * conj (∑ i, c i / (z i - Complex.I * (γ k : ℂ))))
        + (∑ j, (mr j : ℂ) * ((∑ i, c i / (z i - ρ j)) * conj (∑ i, c i / (z i + conj (ρ j))))
          + ∑ j, (mr j : ℂ) * ((∑ i, c i / (z i + conj (ρ j))) * conj (∑ i, c i / (z i - ρ j)))) := by
  have key : ∀ i l, c i * conj (c l) * Kker a γ ma ρ mr (z i) (z l)
      = (∑ _u : Unit, (a : ℂ) * (c i * conj (c l)))
        + ∑ k, (ma k : ℂ) * (c i / (z i - Complex.I * (γ k : ℂ))
              * conj (c l / (z l - Complex.I * (γ k : ℂ))))
        + (∑ j, (mr j : ℂ) * (c i / (z i - ρ j) * conj (c l / (z l + conj (ρ j))))
          + ∑ j, (mr j : ℂ) * (c i / (z i + conj (ρ j)) * conj (c l / (z l - ρ j)))) := by
    intro i l
    rw [kernel_identity a γ ma ρ mr hρ (z i) (z l) (hz i) (hz l) (hzρ i) (hzρ l)]
    rw [mul_add, mul_add, Finset.mul_sum, Finset.mul_sum, ← Finset.sum_add_distrib]
    congr 1
    · congr 1
      · simp; ring
      · refine Finset.sum_congr rfl fun k _ => ?_
        rw [map_div₀]
        generalize z i - Complex.I * (γ k : ℂ) = A
        generalize conj (z l - Complex.I * (γ k : ℂ)) = B
        ring
    · refine Finset.sum_congr rfl fun j _ => ?_
      simp only [map_div₀, map_add, map_sub, Complex.conj_conj]
      generalize z i - ρ j = A
      generalize conj (z l) + ρ j = B
      generalize z i + conj (ρ j) = A'
      generalize conj (z l) - conj (ρ j) = B'
      ring
  unfold gform
  simp_rw [key, Finset.sum_add_distrib]
  rw [sum3 (fun _ : Unit => (a : ℂ)) (fun _ i => c i) (fun _ l => c l),
    sum3 (fun k => (ma k : ℂ)) (fun k i => c i / (z i - Complex.I * (γ k : ℂ)))
      (fun k l => c l / (z l - Complex.I * (γ k : ℂ))),
    sum3 (fun j => (mr j : ℂ)) (fun j i => c i / (z i - ρ j))
      (fun j l => c l / (z l + conj (ρ j))),
    sum3 (fun j => (mr j : ℂ)) (fun j i => c i / (z i + conj (ρ j)))
      (fun j l => c l / (z l - ρ j))]
  simp

theorem kform_im_eq_zero (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    (hρ : ∀ j, 0 < (ρ j).re) {n : ℕ} (z : Fin n → ℂ) (c : Fin n → ℂ)
    (hz : ∀ i, 0 < (z i).re) (hzρ : ∀ i j, z i ≠ ρ j) :
    (kform a γ ma ρ mr z c).im = 0 := by
  rw [kform_eq_gform, gform_decomp a γ ma ρ mr hρ z c hz hzρ, ← Finset.sum_add_distrib]
  simp only [Complex.add_im, Complex.im_sum]
  have hsq : ∀ x : ℂ, ∀ r : ℝ, ((r : ℂ) * (x * conj x)).im = 0 := by
    intro x r; rw [Complex.mul_conj]; simp [← Complex.ofReal_mul]
  rw [hsq, Finset.sum_eq_zero (fun k _ => hsq _ _), Finset.sum_eq_zero]
  · simp
  · intro j _
    have : ∀ x y : ℂ, ∀ r : ℝ, ((r : ℂ) * (x * conj y)).im + ((r : ℂ) * (y * conj x)).im = 0 := by
      intro x y r; simp [Complex.mul_im]; ring
    exact this _ _ _

/-- Upper bound: at most `κ` negative squares. -/
theorem form_nonneg_of_constraints (a : ℝ) (ha : 0 ≤ a) (γ ma : Fin m → ℝ) (hma : ∀ k, 0 < ma k)
    (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (hρ : ∀ j, 0 < (ρ j).re)
    {n : ℕ} (z : Fin n → ℂ) (c : Fin n → ℂ)
    (hz : ∀ i, 0 < (z i).re) (hzρ : ∀ i j, z i ≠ ρ j)
    (hc : ∀ j, ∑ i, c i / (z i - ρ j) = 0) :
    0 ≤ (kform a γ ma ρ mr z c).re := by
  rw [kform_eq_gform, gform_decomp a γ ma ρ mr hρ z c hz hzρ]
  simp only [hc, zero_mul, mul_zero, map_zero, Finset.sum_const_zero, add_zero]
  have hsq : ∀ x : ℂ, ∀ r : ℝ, ((r : ℂ) * (x * conj x)).re = r * Complex.normSq x := by
    intro x r; rw [Complex.mul_conj, ← Complex.ofReal_mul, Complex.ofReal_re]
  simp only [Complex.add_re, Complex.re_sum, hsq]
  refine add_nonneg (mul_nonneg ha (Complex.normSq_nonneg _)) (Finset.sum_nonneg fun k _ => ?_)
  exact mul_nonneg (hma k).le (Complex.normSq_nonneg _)

/-- A relation `c0 + ∑ α i / (z - p i) = 0` on an infinite set forces `α i0 = 0` at every pole
`p i0` that is not repeated. -/
theorem pole_coeff_zero {ι : Type} [Fintype ι] [DecidableEq ι] (p α : ι → ℂ) (c0 : ℂ)
    (S : Set ℂ) (hS : S.Infinite) (hSp : ∀ z ∈ S, ∀ i, z ≠ p i)
    (hrel : ∀ z ∈ S, c0 + ∑ i, α i / (z - p i) = 0)
    (i0 : ι) (hi0 : ∀ l, l ≠ i0 → p l ≠ p i0) : α i0 = 0 := by
  classical
  let Q : Polynomial ℂ := Polynomial.C c0 * ∏ l, (Polynomial.X - Polynomial.C (p l))
    + ∑ i, Polynomial.C (α i) * ∏ l ∈ Finset.univ.erase i, (Polynomial.X - Polynomial.C (p l))
  have heval : ∀ x : ℂ, Q.eval x = c0 * ∏ l, (x - p l)
      + ∑ i, α i * ∏ l ∈ Finset.univ.erase i, (x - p l) := by
    intro x
    simp [Q, Polynomial.eval_prod, Polynomial.eval_finset_sum]
  have hroot : ∀ x ∈ S, Q.IsRoot x := by
    intro x hx
    have hne : ∀ i, x - p i ≠ 0 := fun i => sub_ne_zero.mpr (hSp x hx i)
    have hterm : ∀ i, α i * ∏ l ∈ Finset.univ.erase i, (x - p l)
        = α i / (x - p i) * ∏ l, (x - p l) := by
      intro i
      rw [← Finset.mul_prod_erase Finset.univ (fun l => x - p l) (Finset.mem_univ i)]
      field_simp [hne i]
    show Q.eval x = 0
    rw [heval, Finset.sum_congr rfl (fun i _ => hterm i), ← Finset.sum_mul, ← add_mul,
      hrel x hx, zero_mul]
  have hQ : Q = 0 := Polynomial.eq_zero_of_infinite_isRoot Q (hS.mono hroot)
  have h0 : Q.eval (p i0) = 0 := by rw [hQ]; simp
  rw [heval] at h0
  have hprod0 : ∏ l, (p i0 - p l) = 0 :=
    Finset.prod_eq_zero (Finset.mem_univ i0) (sub_self _)
  rw [hprod0, mul_zero, zero_add, Finset.sum_eq_single i0] at h0
  · rcases mul_eq_zero.mp h0 with h | h
    · exact h
    · exfalso
      rw [Finset.prod_eq_zero_iff] at h
      obtain ⟨l, hl, hl0⟩ := h
      exact hi0 l (Finset.ne_of_mem_erase hl) (sub_eq_zero.mp hl0).symm
  · intro i _ hi
    rw [Finset.prod_eq_zero (Finset.mem_erase.mpr ⟨Ne.symm hi, Finset.mem_univ i0⟩) (sub_self _),
      mul_zero]
  · intro h; exact absurd (Finset.mem_univ i0) h

/-- The poles of the finite model. -/
def poles (γ : Fin m → ℝ) (ρ : Fin κ → ℂ) : Fin m ⊕ (Fin κ ⊕ Fin κ) → ℂ :=
  Sum.elim (fun k => Complex.I * (γ k : ℂ)) (Sum.elim ρ (fun j => -conj (ρ j)))

/-- Evaluation vector at a point: the constant `1` and the simple fractions. -/
def evv (γ : Fin m → ℝ) (ρ : Fin κ → ℂ) (x : ℂ) : Option (Fin m ⊕ (Fin κ ⊕ Fin κ)) → ℂ :=
  fun o => Option.elim o 1 (fun i => 1 / (x - poles γ ρ i))

/-- Target values: `-1` on `1/(z - ρ j0)`, `+1` on `1/(z + conj ρ j0)`, `0` elsewhere. -/
def tgt (j0 : Fin κ) : Option (Fin m ⊕ (Fin κ ⊕ Fin κ)) → ℂ
  | some (Sum.inr (Sum.inl j)) => if j = j0 then -1 else 0
  | some (Sum.inr (Sum.inr j)) => if j = j0 then 1 else 0
  | _ => 0

def Om (ρ : Fin κ → ℂ) : Set ℂ := {x | 0 < x.re ∧ ∀ j, x ≠ ρ j}

theorem Om_infinite (ρ : Fin κ → ℂ) : (Om ρ).Infinite := by
  have h1 : {x : ℂ | 0 < x.re}.Infinite := by
    refine Set.infinite_of_injective_forall_mem (f := fun n : ℕ => ((n + 1 : ℕ) : ℂ)) ?_ ?_
    · intro a b h
      have := Nat.cast_injective (R := ℂ) h
      omega
    · intro n
      show 0 < (((n + 1 : ℕ) : ℂ)).re
      rw [Complex.natCast_re]; positivity
  have h2 : ({x : ℂ | 0 < x.re} \ Set.range ρ).Infinite := h1.diff (Set.finite_range ρ)
  refine h2.mono ?_
  rintro x ⟨hx, hx'⟩
  exact ⟨hx, fun j h => hx' ⟨j, h.symm⟩⟩

theorem Om_ne_pole (γ : Fin m → ℝ) (ρ : Fin κ → ℂ) (hρ : ∀ j, 0 < (ρ j).re) :
    ∀ x ∈ Om ρ, ∀ i, x ≠ poles γ ρ i := by
  rintro x ⟨hx, hx'⟩ i
  rcases i with k | j | j
  · intro h; have := congrArg Complex.re h; simp [poles] at this; linarith
  · exact hx' j
  · intro h; have := congrArg Complex.re h; have := hρ j; simp [poles] at *; linarith

theorem tgt_mem_span (γ : Fin m → ℝ) (ρ : Fin κ → ℂ) (hρ : ∀ j, 0 < (ρ j).re)
    (hinj : Function.Injective ρ) (j0 : Fin κ) :
    tgt (m := m) j0 ∈ Submodule.span ℂ (evv γ ρ '' Om ρ) := by
  classical
  by_contra hnot
  obtain ⟨φ, hφ, hmap⟩ := Submodule.exists_dual_map_eq_bot_of_notMem hnot inferInstance
  let α : Option (Fin m ⊕ (Fin κ ⊕ Fin κ)) → ℂ := fun o => φ (fun j => if o = j then 1 else 0)
  have hφv : ∀ v : Option (Fin m ⊕ (Fin κ ⊕ Fin κ)) → ℂ, φ v = ∑ o, v o * α o := by
    intro v
    rw [LinearMap.pi_apply_eq_sum_univ φ v]
    rfl
  have hzero : ∀ x ∈ Om ρ, φ (evv γ ρ x) = 0 := by
    intro x hx
    have : φ (evv γ ρ x) ∈ (Submodule.span ℂ (evv γ ρ '' Om ρ)).map φ :=
      Submodule.mem_map_of_mem (Submodule.subset_span ⟨x, hx, rfl⟩)
    rw [hmap] at this
    simpa using this
  have hrel : ∀ x ∈ Om ρ, α none + ∑ i, α (some i) / (x - poles γ ρ i) = 0 := by
    intro x hx
    have := hzero x hx
    rw [hφv, Fintype.sum_option] at this
    rw [← this]
    simp only [evv, Option.elim, one_mul]
    congr 1
    refine Finset.sum_congr rfl fun i _ => ?_
    ring
  have hα := fun i0 hi0 => pole_coeff_zero (poles γ ρ) (fun i => α (some i)) (α none) (Om ρ)
    (Om_infinite ρ) (Om_ne_pole γ ρ hρ) hrel i0 hi0
  have hu : α (some (Sum.inr (Sum.inl j0))) = 0 := by
    apply hα
    intro l hl
    rcases l with k | j | j
    · intro h; have := congrArg Complex.re h; have := hρ j0; simp [poles] at *; linarith
    · intro h; apply hl; simp [poles] at h; rw [hinj h]
    · intro h; have := congrArg Complex.re h; have := hρ j0; have := hρ j
      simp [poles] at *; linarith
  have hv : α (some (Sum.inr (Sum.inr j0))) = 0 := by
    apply hα
    intro l hl
    rcases l with k | j | j
    · intro h; have := congrArg Complex.re h; have := hρ j0; simp [poles] at *; linarith
    · intro h; have := congrArg Complex.re h; have := hρ j0; have := hρ j
      simp [poles] at *; linarith
    · intro h; apply hl; simp [poles] at h; rw [hinj ((starRingEnd ℂ).injective h)]
  apply hφ
  rw [hφv]
  refine Finset.sum_eq_zero fun o _ => ?_
  rcases o with _ | k | j | j
  · simp [tgt]
  · simp [tgt]
  · by_cases h : j = j0
    · subst h; rw [hu, mul_zero]
    · simp [tgt, h]
  · by_cases h : j = j0
    · subst h; rw [hv, mul_zero]
    · simp [tgt, h]

/-- Lower bound: at least `κ` negative squares (distinct zeros, positive weights). -/
theorem exists_negative_subspace (a : ℝ) (ha : 0 ≤ a) (γ ma : Fin m → ℝ) (hma : ∀ k, 0 < ma k)
    (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (hρ : ∀ j, 0 < (ρ j).re) (hmr : ∀ j, 0 < mr j)
    (hinj : Function.Injective ρ) :
    ∃ (n : ℕ) (z : Fin n → ℂ), (∀ i, 0 < (z i).re) ∧ (∀ i j, z i ≠ ρ j) ∧
      ∃ W : Submodule ℂ (Fin n → ℂ), Module.finrank ℂ W = κ ∧
        ∀ c ∈ W, c ≠ 0 → (kform a γ ma ρ mr z c).re < 0 := by
  classical
  have hex : ∀ j0 : Fin κ, ∃ (n : ℕ) (f : Fin n → ℂ) (x : Fin n → ℂ),
      (∀ i, x i ∈ Om ρ) ∧ ∑ i, f i • evv γ ρ (x i) = tgt (m := m) j0 := by
    intro j0
    obtain ⟨n, f, g, hg⟩ := Submodule.mem_span_set'.mp (tgt_mem_span γ ρ hρ hinj j0)
    choose x hx hxe using fun i => (g i).2
    exact ⟨n, f, x, hx, by simpa [hxe] using hg⟩
  choose N f x hx hsum using hex
  let P := Σ j : Fin κ, Fin (N j)
  let zP : P → ℂ := fun q => x q.1 q.2
  let T : (Fin κ → ℂ) → P → ℂ := fun t q => t q.1 * f q.1 q.2
  -- value of every functional on `T t`
  have hfun : ∀ (t : Fin κ → ℂ) o, ∑ q : P, T t q * evv γ ρ (zP q) o = ∑ j, t j * tgt (m := m) j o := by
    intro t o
    rw [Fintype.sum_sigma]
    refine Finset.sum_congr rfl fun j _ => ?_
    have := congrFun (hsum j) o
    simp only [Finset.sum_apply, Pi.smul_apply, smul_eq_mul] at this
    rw [← this, Finset.mul_sum]
    refine Finset.sum_congr rfl fun i _ => ?_
    simp only [T, zP]; ring
  have hA : ∀ t : Fin κ → ℂ, ∑ q : P, T t q = 0 := by
    intro t
    have := hfun t none
    simpa [evv, tgt] using this
  have hB : ∀ (t : Fin κ → ℂ) k, ∑ q : P, T t q / (zP q - Complex.I * (γ k : ℂ)) = 0 := by
    intro t k
    have := hfun t (some (Sum.inl k))
    simpa [evv, tgt, poles, div_eq_mul_inv] using this
  have hU : ∀ (t : Fin κ → ℂ) j, ∑ q : P, T t q / (zP q - ρ j) = - t j := by
    intro t j
    have := hfun t (some (Sum.inr (Sum.inl j)))
    simpa [evv, tgt, poles, div_eq_mul_inv] using this
  have hV : ∀ (t : Fin κ → ℂ) j, ∑ q : P, T t q / (zP q + conj (ρ j)) = t j := by
    intro t j
    have := hfun t (some (Sum.inr (Sum.inr j)))
    simpa [evv, tgt, poles, div_eq_mul_inv] using this
  have hzP : ∀ q, 0 < (zP q).re := fun q => (hx q.1 q.2).1
  have hzPρ : ∀ q j, zP q ≠ ρ j := fun q j => (hx q.1 q.2).2 j
  have hform : ∀ t : Fin κ → ℂ, (gform a γ ma ρ mr zP (T t)).re
      = -2 * ∑ j, mr j * Complex.normSq (t j) := by
    intro t
    rw [gform_decomp a γ ma ρ mr hρ zP (T t) hzP hzPρ]
    simp only [hA, hB, hU, hV, zero_mul, mul_zero, Finset.sum_const_zero, zero_add, map_neg,
      neg_mul, mul_neg, Finset.sum_neg_distrib, Complex.mul_conj]
    simp only [← Complex.ofReal_mul, ← Complex.ofReal_sum]
    simp only [Complex.add_re, Complex.neg_re, Complex.ofReal_re]
    ring
  let e : P ≃ Fin (Fintype.card P) := Fintype.equivFin P
  let TL : (Fin κ → ℂ) →ₗ[ℂ] (Fin (Fintype.card P) → ℂ) :=
    { toFun := fun t i => T t (e.symm i)
      map_add' := by intro s t; ext i; simp only [T, Pi.add_apply]; ring
      map_smul' := by intro r t; ext i; simp only [T, Pi.smul_apply, smul_eq_mul, RingHom.id_apply]; ring }
  have hTLinj : Function.Injective TL := by
    rw [← LinearMap.ker_eq_bot, LinearMap.ker_eq_bot']
    intro t ht
    have hT0 : ∀ q, T t q = 0 := by
      intro q
      have := congrFun ht (e q)
      simpa [TL] using this
    ext j
    have := hU t j
    simp only [hT0, zero_div, Finset.sum_const_zero] at this
    simpa using this.symm
  have hre : ∀ t : Fin κ → ℂ, kform a γ ma ρ mr (fun i => zP (e.symm i)) (TL t)
      = gform a γ ma ρ mr zP (T t) := by
    intro t
    unfold kform gform
    exact Fintype.sum_equiv e.symm _ _ (fun i => Fintype.sum_equiv e.symm _ _ (fun l => rfl))
  refine ⟨Fintype.card P, fun i => zP (e.symm i), fun i => hzP _, fun i j => hzPρ _ j,
    LinearMap.range TL, ?_, ?_⟩
  · rw [LinearMap.finrank_range_of_inj hTLinj]; simp
  · rintro c ⟨t, rfl⟩ hc
    rw [hre, hform]
    have ht : t ≠ 0 := by rintro rfl; exact hc (map_zero TL)
    obtain ⟨j, hj⟩ : ∃ j, t j ≠ 0 := by
      by_contra h; push_neg at h; exact ht (funext h)
    have hpos : 0 < ∑ j, mr j * Complex.normSq (t j) :=
      Finset.sum_pos' (fun i _ => mul_nonneg (hmr i).le (Complex.normSq_nonneg _))
        ⟨j, Finset.mem_univ j, mul_pos (hmr j) (Complex.normSq_pos.mpr hj)⟩
    linarith

end

#print axioms kernel_identity
#print axioms kform_im_eq_zero
#print axioms form_nonneg_of_constraints
#print axioms exists_negative_subspace
