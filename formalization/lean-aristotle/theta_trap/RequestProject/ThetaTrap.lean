/-
# The `Θ`-trap package for the attractive Calogero–Moser flow

Formalization of `job17_theta_trap.tex`.

Standing setup.  `N ≥ 2` particles `x 0 (s) < x 1 (s) < ⋯ < x (N-1) (s)` evolve on a
time interval `[0, t_c)` under the *attractive* Calogero–Moser system

  `dx k / ds = -2 ∑_{j ≠ k} 1 / (x k - x j)`,

with the strict ordering (no collision) maintained on `[0, t_c)`.  Existence of such a
solution is a hypothesis, never a conclusion.

For a fixed adjacent pair `(x k, x (k+1))` we set

  `g = x (k+1) - x k`,
  `T j = 1 / ((x k - x j) * (x (k+1) - x j))`   for `j ∉ {k, k+1}`,
  `E = ∑ j, T j`,   `Θ = g^2 * E / 2`.
-/
import Mathlib

open scoped BigOperators
open Set

set_option maxHeartbeats 2000000

namespace ThetaTrap

/-! ## Configurations and the Calogero–Moser velocity field -/

/-- The Calogero–Moser velocity of particle `i` in the configuration `y` of `N` particles. -/
noncomputable def vel (N : ℕ) (y : ℕ → ℝ) (i : ℕ) : ℝ :=
  -2 * ∑ j ∈ (Finset.range N).erase i, (y i - y j)⁻¹

/-- The particles of a configuration are pairwise distinct. -/
def Distinct (N : ℕ) (y : ℕ → ℝ) : Prop :=
  ∀ i < N, ∀ j < N, i ≠ j → y i ≠ y j

/-- The particles of a configuration are strictly increasing. -/
def Ordered (N : ℕ) (y : ℕ → ℝ) : Prop :=
  ∀ i < N, ∀ j < N, i < j → y i < y j

theorem Ordered.distinct {N : ℕ} {y : ℕ → ℝ} (h : Ordered N y) : Distinct N y := by
  intro i hi j hj hij
  rcases lt_or_gt_of_ne hij with h1 | h1
  · exact ne_of_lt (h i hi j hj h1)
  · exact ne_of_gt (h j hj i hi h1)

/-- The *environment* of the adjacent pair `(k, k+1)`: all other indices. -/
def envIdx (N k : ℕ) : Finset ℕ := ((Finset.range N).erase k).erase (k + 1)

theorem mem_envIdx {N k j : ℕ} : j ∈ envIdx N k ↔ j < N ∧ j ≠ k ∧ j ≠ k + 1 := by
  simp only [envIdx, Finset.mem_erase, Finset.mem_range]
  tauto

/-- `T j`, the environment term of the index `j` for the adjacent pair `(k, k+1)`. -/
noncomputable def Tv (y : ℕ → ℝ) (k j : ℕ) : ℝ := ((y k - y j) * (y (k + 1) - y j))⁻¹

/-- `E = ∑_j T j`. -/
noncomputable def envE (N : ℕ) (y : ℕ → ℝ) (k : ℕ) : ℝ := ∑ j ∈ envIdx N k, Tv y k j

/-- The gap `g = x (k+1) - x k` of the adjacent pair `(k, k+1)`. -/
noncomputable def gapv (y : ℕ → ℝ) (k : ℕ) : ℝ := y (k + 1) - y k

/-- `Θ = g^2 E / 2`. -/
noncomputable def Thetav (N : ℕ) (y : ℕ → ℝ) (k : ℕ) : ℝ :=
  (gapv y k) ^ 2 * envE N y k / 2

/-- The configuration of the moving system at time `s`. -/
noncomputable def cfg (x : ℕ → ℝ → ℝ) (s : ℝ) : ℕ → ℝ := fun i => x i s

/-- A `C¹` collision-free solution of the attractive Calogero–Moser system on `[0, tc)`. -/
structure IsCMFlow (N : ℕ) (tc : ℝ) (x : ℕ → ℝ → ℝ) : Prop where
  hasDeriv : ∀ s ∈ Ico (0 : ℝ) tc, ∀ k < N, HasDerivAt (x k) (vel N (cfg x s) k) s
  ordered : ∀ s ∈ Ico (0 : ℝ) tc, Ordered N (cfg x s)

/-! ## Non-degeneracy of the relevant differences -/

section Static

variable {N k : ℕ} {y : ℕ → ℝ}

theorem gap_ne_zero (hk : k + 1 < N) (hd : Distinct N y) : y (k + 1) - y k ≠ 0 :=
  sub_ne_zero_of_ne (hd _ hk _ (Nat.lt_of_succ_lt hk) (Nat.succ_ne_self k))

theorem sub_k_ne_zero (hk : k + 1 < N) (hd : Distinct N y) {j : ℕ} (hj : j ∈ envIdx N k) :
    y k - y j ≠ 0 := by
  rw [mem_envIdx] at hj
  exact sub_ne_zero_of_ne (hd _ (Nat.lt_of_succ_lt hk) _ hj.1 (Ne.symm hj.2.1))

theorem sub_k1_ne_zero (hk : k + 1 < N) (hd : Distinct N y) {j : ℕ} (hj : j ∈ envIdx N k) :
    y (k + 1) - y j ≠ 0 := by
  rw [mem_envIdx] at hj
  exact sub_ne_zero_of_ne (hd _ hk _ hj.1 (Ne.symm hj.2.2))

theorem sub_env_ne_zero (hd : Distinct N y) {m j : ℕ} (hm : m ∈ envIdx N k)
    (hj : j ∈ envIdx N k) (hmj : m ≠ j) : y m - y j ≠ 0 := by
  rw [mem_envIdx] at hm hj
  exact sub_ne_zero_of_ne (hd _ hm.1 _ hj.1 hmj)

/-! ## Splitting the index sets -/

theorem erase_k_eq (hk : k + 1 < N) :
    (Finset.range N).erase k = insert (k + 1) (envIdx N k) := by
  rw [envIdx, Finset.insert_erase]
  simp only [Finset.mem_erase, Finset.mem_range]
  exact ⟨Nat.succ_ne_self k, hk⟩

theorem erase_k1_eq (hk : k + 1 < N) :
    (Finset.range N).erase (k + 1) = insert k (envIdx N k) := by
  have : envIdx N k = ((Finset.range N).erase (k + 1)).erase k := by
    rw [envIdx, Finset.erase_right_comm]
  rw [this, Finset.insert_erase]
  simp only [Finset.mem_erase, Finset.mem_range]
  exact ⟨(Nat.succ_ne_self k).symm, Nat.lt_of_succ_lt hk⟩

theorem erase_m_eq (hk : k + 1 < N) {m : ℕ} (hm : m ∈ envIdx N k) :
    (Finset.range N).erase m = insert k (insert (k + 1) ((envIdx N k).erase m)) := by
  rw [mem_envIdx] at hm
  have hkN : k < N := Nat.lt_of_succ_lt hk
  ext i
  simp only [Finset.mem_insert, Finset.mem_erase, Finset.mem_range, envIdx]
  constructor
  · rintro ⟨hi, hiN⟩
    by_cases h1 : i = k
    · exact Or.inl h1
    by_cases h2 : i = k + 1
    · exact Or.inr (Or.inl h2)
    exact Or.inr (Or.inr ⟨hi, h2, h1, hiN⟩)
  · rintro (rfl | rfl | ⟨hi, _, _, hiN⟩)
    · exact ⟨Ne.symm hm.2.1, hkN⟩
    · exact ⟨Ne.symm hm.2.2, hk⟩
    · exact ⟨hi, hiN⟩

theorem k1_not_mem_env : k + 1 ∉ envIdx N k := by
  simp [mem_envIdx]

theorem k_not_mem_env : k ∉ envIdx N k := by
  simp [mem_envIdx]

/-! ## Expansions of the velocities -/

theorem vel_k_eq (hk : k + 1 < N) :
    vel N y k = 2 * (y (k + 1) - y k)⁻¹ - 2 * ∑ j ∈ envIdx N k, (y k - y j)⁻¹ := by
  rw [vel, erase_k_eq hk, Finset.sum_insert k1_not_mem_env]
  have : (y k - y (k + 1))⁻¹ = -(y (k + 1) - y k)⁻¹ := by
    rw [← neg_sub, inv_neg]
  rw [this]; ring

theorem vel_k1_eq (hk : k + 1 < N) :
    vel N y (k + 1) = -(2 * (y (k + 1) - y k)⁻¹) - 2 * ∑ j ∈ envIdx N k, (y (k + 1) - y j)⁻¹ := by
  rw [vel, erase_k1_eq hk, Finset.sum_insert k_not_mem_env]
  ring

theorem vel_m_eq (hk : k + 1 < N) {m : ℕ} (hm : m ∈ envIdx N k) :
    vel N y m = 2 * (y k - y m)⁻¹ + 2 * (y (k + 1) - y m)⁻¹
      - 2 * ∑ j ∈ (envIdx N k).erase m, (y m - y j)⁻¹ := by
  have hkm : k ∉ insert (k + 1) ((envIdx N k).erase m) := by
    simp only [Finset.mem_insert, Finset.mem_erase]
    push_neg
    exact ⟨(Nat.succ_ne_self k).symm, fun _ => k_not_mem_env⟩
  have hk1m : (k + 1) ∉ (envIdx N k).erase m := fun h => k1_not_mem_env (Finset.mem_of_mem_erase h)
  rw [vel, erase_m_eq hk hm, Finset.sum_insert hkm, Finset.sum_insert hk1m]
  have e1 : (y m - y k)⁻¹ = -(y k - y m)⁻¹ := by rw [← neg_sub, inv_neg]
  have e2 : (y m - y (k + 1))⁻¹ = -(y (k + 1) - y m)⁻¹ := by rw [← neg_sub, inv_neg]
  rw [e1, e2]; ring

/-! ## Lemma E, pointwise form -/

/-- The exact pair identity underlying Lemma E:
`ẋ_{k+1} - ẋ_k = -4/g + 2 g E`. -/
theorem lemmaE_point (hk : k + 1 < N) (hd : Distinct N y) :
    vel N y (k + 1) - vel N y k = -(4 * (gapv y k)⁻¹) + 2 * gapv y k * envE N y k := by
  have key : (∑ j ∈ envIdx N k, (y k - y j)⁻¹) - ∑ j ∈ envIdx N k, (y (k + 1) - y j)⁻¹
      = gapv y k * envE N y k := by
    rw [envE, Finset.mul_sum, ← Finset.sum_sub_distrib]
    refine Finset.sum_congr rfl fun j hj => ?_
    have h1 := sub_k_ne_zero hk hd hj
    have h2 := sub_k1_ne_zero hk hd hj
    rw [Tv, gapv]
    field_simp
    ring
  rw [vel_k_eq hk, vel_k1_eq hk, gapv] at *
  linarith [key]

/-! ## Lemma 1: the exact environment identity -/

/-- A single cross term appearing in the expansion of `dT_m/ds`. -/
noncomputable def Pterm (y : ℕ → ℝ) (k m j : ℕ) : ℝ :=
  ((y k - y j) * (y m - y j))⁻¹ + ((y (k + 1) - y j) * (y m - y j))⁻¹

/-- The total cross-term contribution attached to the environment particle `m`. -/
noncomputable def Psum (N : ℕ) (y : ℕ → ℝ) (k m : ℕ) : ℝ :=
  ∑ j ∈ (envIdx N k).erase m, Pterm y k m j

/-- Expansion of `dT_m/ds` along the flow. -/
theorem Tdot_expand (hk : k + 1 < N) (hd : Distinct N y) {m : ℕ} (hm : m ∈ envIdx N k) :
    -(Tv y k m) ^ 2 * ((vel N y k - vel N y m) * (y (k + 1) - y m)
        + (y k - y m) * (vel N y (k + 1) - vel N y m))
      = 10 * (Tv y k m) ^ 2 + 4 * (gapv y k) ^ 2 * (Tv y k m) ^ 3
        - 2 * (Tv y k m * Psum N y k m) := by
  have ha : y k - y m ≠ 0 := sub_k_ne_zero hk hd hm
  have hb : y (k + 1) - y m ≠ 0 := sub_k1_ne_zero hk hd hm
  have hg : y (k + 1) - y k ≠ 0 := gap_ne_zero hk hd
  set Sa : ℝ := ∑ j ∈ (envIdx N k).erase m, ((y m - y j)⁻¹ - (y k - y j)⁻¹) with hSa
  set Sb : ℝ := ∑ j ∈ (envIdx N k).erase m, ((y m - y j)⁻¹ - (y (k + 1) - y j)⁻¹) with hSb
  have hsa : ∑ j ∈ envIdx N k, (y k - y j)⁻¹
      = (y k - y m)⁻¹ + ∑ j ∈ (envIdx N k).erase m, (y k - y j)⁻¹ :=
    (Finset.add_sum_erase _ _ hm).symm
  have hsb : ∑ j ∈ envIdx N k, (y (k + 1) - y j)⁻¹
      = (y (k + 1) - y m)⁻¹ + ∑ j ∈ (envIdx N k).erase m, (y (k + 1) - y j)⁻¹ :=
    (Finset.add_sum_erase _ _ hm).symm
  have hA : vel N y k - vel N y m
      = 2 * (y (k + 1) - y k)⁻¹ - 4 * (y k - y m)⁻¹ - 2 * (y (k + 1) - y m)⁻¹ + 2 * Sa := by
    rw [vel_k_eq hk, vel_m_eq hk hm, hsa, hSa, Finset.sum_sub_distrib]
    ring
  have hB : vel N y (k + 1) - vel N y m
      = -(2 * (y (k + 1) - y k)⁻¹) - 2 * (y k - y m)⁻¹ - 4 * (y (k + 1) - y m)⁻¹ + 2 * Sb := by
    rw [vel_k1_eq hk, vel_m_eq hk hm, hsb, hSb, Finset.sum_sub_distrib]
    ring
  have hP : Psum N y k m = Sa * (y k - y m)⁻¹ + Sb * (y (k + 1) - y m)⁻¹ := by
    rw [Psum, hSa, hSb, Finset.sum_mul, Finset.sum_mul, ← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl fun j hj => ?_
    have hjm : j ∈ envIdx N k := Finset.mem_of_mem_erase hj
    have hjne : j ≠ m := Finset.ne_of_mem_erase hj
    have h1 : y k - y j ≠ 0 := sub_k_ne_zero hk hd hjm
    have h2 : y (k + 1) - y j ≠ 0 := sub_k1_ne_zero hk hd hjm
    have h3 : y m - y j ≠ 0 := sub_env_ne_zero hd hm hjm (Ne.symm hjne)
    rw [Pterm]
    field_simp
    ring
  rw [hA, hB, hP, Tv, gapv]
  field_simp
  ring

/-- Symmetrization of the cross terms: `∑_m T_m P_m = E² - ∑_m T_m²`. -/
theorem Psum_sum (hk : k + 1 < N) (hd : Distinct N y) :
    ∑ m ∈ envIdx N k, Tv y k m * Psum N y k m
      = (envE N y k) ^ 2 - ∑ m ∈ envIdx N k, (Tv y k m) ^ 2 := by
  classical
  set s := envIdx N k with hs
  set F : ℕ → ℕ → ℝ := fun m j => Tv y k m * Pterm y k m j with hF
  have hdiag : ∀ m, F m m = 0 := by
    intro m
    simp [hF, Pterm]
  have hE : envE N y k = ∑ j ∈ s, Tv y k j := by rw [hs, envE]
  have hL : ∀ m ∈ s, Tv y k m * Psum N y k m = ∑ j ∈ s, F m j := by
    intro m hm
    show Tv y k m * Psum N y k m = ∑ j ∈ s, Tv y k m * Pterm y k m j
    rw [← Finset.mul_sum, Psum, ← hs, Finset.sum_erase_eq_sub hm]
    have hz : Pterm y k m m = 0 := by simp [Pterm]
    rw [hz, sub_zero]
  have hkey : ∀ m ∈ s, ∀ j ∈ s, m ≠ j → F m j + F j m = 2 * (Tv y k m * Tv y k j) := by
    intro m hm j hj hmj
    have h1 : y k - y j ≠ 0 := sub_k_ne_zero hk hd hj
    have h2 : y (k + 1) - y j ≠ 0 := sub_k1_ne_zero hk hd hj
    have h3 : y k - y m ≠ 0 := sub_k_ne_zero hk hd hm
    have h4 : y (k + 1) - y m ≠ 0 := sub_k1_ne_zero hk hd hm
    have h5 : y m - y j ≠ 0 := sub_env_ne_zero hd hm hj hmj
    have h6 : y j - y m ≠ 0 := sub_env_ne_zero hd hj hm (Ne.symm hmj)
    simp only [hF, Pterm, Tv]
    field_simp
    ring
  have hper : ∀ m ∈ s, ∑ j ∈ s, (F m j + F j m)
      = 2 * Tv y k m * envE N y k - 2 * (Tv y k m) ^ 2 := by
    intro m hm
    have h0 : ∑ j ∈ s, (F m j + F j m)
        = (F m m + F m m) + ∑ j ∈ s.erase m, (F m j + F j m) :=
      (Finset.add_sum_erase _ _ hm).symm
    have h1 : ∑ j ∈ s.erase m, (F m j + F j m)
        = ∑ j ∈ s.erase m, 2 * (Tv y k m * Tv y k j) := by
      refine Finset.sum_congr rfl fun j hj => ?_
      exact hkey m hm j (Finset.mem_of_mem_erase hj) (Ne.symm (Finset.ne_of_mem_erase hj))
    have h2 : ∑ j ∈ s.erase m, 2 * (Tv y k m * Tv y k j)
        = 2 * Tv y k m * (envE N y k - Tv y k m) := by
      rw [hE, ← Finset.sum_erase_eq_sub hm, Finset.mul_sum]
      exact Finset.sum_congr rfl fun j _ => by ring
    rw [h0, hdiag m, h1, h2]
    ring
  have hsum1 : ∑ m ∈ s, ∑ j ∈ s, (F m j + F j m)
      = 2 * ∑ m ∈ s, ∑ j ∈ s, F m j := by
    have : ∑ m ∈ s, ∑ j ∈ s, (F m j + F j m)
        = (∑ m ∈ s, ∑ j ∈ s, F m j) + ∑ m ∈ s, ∑ j ∈ s, F j m := by
      rw [← Finset.sum_add_distrib]
      exact Finset.sum_congr rfl fun m _ => Finset.sum_add_distrib
    rw [this, Finset.sum_comm (f := fun m j => F j m)]
    ring
  have hsum2 : ∑ m ∈ s, ∑ j ∈ s, (F m j + F j m)
      = 2 * (envE N y k) ^ 2 - 2 * ∑ m ∈ s, (Tv y k m) ^ 2 := by
    have hre : ∀ m ∈ s, 2 * Tv y k m * envE N y k - 2 * (Tv y k m) ^ 2
        = 2 * envE N y k * Tv y k m - 2 * (Tv y k m) ^ 2 := fun m _ => by ring
    rw [Finset.sum_congr rfl hper, Finset.sum_congr rfl hre, Finset.sum_sub_distrib,
      ← Finset.mul_sum, ← Finset.mul_sum, hE]
    ring
  have hL' : ∑ m ∈ s, Tv y k m * Psum N y k m = ∑ m ∈ s, ∑ j ∈ s, F m j :=
    Finset.sum_congr rfl hL
  rw [hL']
  have := hsum1.symm.trans hsum2
  linarith [this]

/-- **Lemma 1** (exact environment identity), pointwise form. -/
theorem lemma1_point (hk : k + 1 < N) (hd : Distinct N y) :
    ∑ m ∈ envIdx N k, (-(Tv y k m) ^ 2 * ((vel N y k - vel N y m) * (y (k + 1) - y m)
        + (y k - y m) * (vel N y (k + 1) - vel N y m)))
      = -2 * (envE N y k) ^ 2 + 12 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 2
        + 4 * (gapv y k) ^ 2 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 3 := by
  have h1 : ∑ m ∈ envIdx N k, (-(Tv y k m) ^ 2 * ((vel N y k - vel N y m) * (y (k + 1) - y m)
        + (y k - y m) * (vel N y (k + 1) - vel N y m)))
      = ∑ m ∈ envIdx N k, (10 * (Tv y k m) ^ 2 + 4 * (gapv y k) ^ 2 * (Tv y k m) ^ 3
        - 2 * (Tv y k m * Psum N y k m)) :=
    Finset.sum_congr rfl fun m hm => Tdot_expand hk hd hm
  rw [h1, Finset.sum_sub_distrib, Finset.sum_add_distrib, ← Finset.mul_sum, ← Finset.mul_sum,
    ← Finset.mul_sum, Psum_sum hk hd]
  ring

/-- The exact value of `dE/ds` given by Lemma 1. -/
noncomputable def envEdot (N : ℕ) (y : ℕ → ℝ) (k : ℕ) : ℝ :=
  -2 * (envE N y k) ^ 2 + 12 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 2
    + 4 * (gapv y k) ^ 2 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 3

/-- The exact value of `dΘ/ds` given by Lemma 2. -/
noncomputable def ThetaDot (N : ℕ) (y : ℕ → ℝ) (k : ℕ) : ℝ :=
  -(4 * Thetav N y k * (2 - Thetav N y k)) / (gapv y k) ^ 2
    + 6 * (gapv y k) ^ 2 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 2
    + 2 * (gapv y k) ^ 4 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 3

/-! ## Positivity for an adjacent pair -/

theorem gapv_pos (hk : k + 1 < N) (ho : Ordered N y) : 0 < gapv y k :=
  sub_pos.mpr (ho k (Nat.lt_of_succ_lt hk) (k + 1) hk (Nat.lt_succ_self k))

/-- For an *adjacent* pair every environment term is strictly positive: `x j` lies on the
same side of both members of the pair. -/
theorem Tv_pos (hk : k + 1 < N) (ho : Ordered N y) {j : ℕ} (hj : j ∈ envIdx N k) :
    0 < Tv y k j := by
  rw [mem_envIdx] at hj
  obtain ⟨hjN, hjk, hjk1⟩ := hj
  rw [Tv, inv_pos]
  rcases lt_or_gt_of_ne hjk with h | h
  · have h1 : y j < y k := ho j hjN k (Nat.lt_of_succ_lt hk) h
    have h2 : y j < y (k + 1) := ho j hjN (k + 1) hk (Nat.lt_trans h (Nat.lt_succ_self k))
    exact mul_pos (sub_pos.mpr h1) (sub_pos.mpr h2)
  · have hj1 : k + 1 < j := lt_of_le_of_ne h (Ne.symm hjk1)
    have h1 : y k < y j := ho k (Nat.lt_of_succ_lt hk) j hjN (Nat.lt_trans (Nat.lt_succ_self k) hj1)
    have h2 : y (k + 1) < y j := ho (k + 1) hk j hjN hj1
    exact mul_pos_of_neg_of_neg (sub_neg.mpr h1) (sub_neg.mpr h2)

theorem envE_nonneg (hk : k + 1 < N) (ho : Ordered N y) : 0 ≤ envE N y k :=
  Finset.sum_nonneg fun _ hj => (Tv_pos hk ho hj).le

theorem Thetav_nonneg (hk : k + 1 < N) (ho : Ordered N y) : 0 ≤ Thetav N y k := by
  rw [Thetav]
  have := envE_nonneg hk ho
  positivity

theorem envE_eq (hk : k + 1 < N) (ho : Ordered N y) :
    envE N y k = 2 * Thetav N y k / (gapv y k) ^ 2 := by
  have hg : gapv y k ≠ 0 := ne_of_gt (gapv_pos hk ho)
  rw [Thetav]
  field_simp

/-- Termwise bound `g² T_j ≤ 2Θ`. -/
theorem gapSq_Tv_le (hk : k + 1 < N) (ho : Ordered N y) {j : ℕ} (hj : j ∈ envIdx N k) :
    (gapv y k) ^ 2 * Tv y k j ≤ 2 * Thetav N y k := by
  have h : (gapv y k) ^ 2 * Tv y k j ≤ ∑ m ∈ envIdx N k, (gapv y k) ^ 2 * Tv y k m :=
    Finset.single_le_sum (f := fun m => (gapv y k) ^ 2 * Tv y k m)
      (fun m hm => by have := (Tv_pos hk ho hm).le; positivity) hj
  refine h.trans (le_of_eq ?_)
  rw [← Finset.mul_sum, ← envE, Thetav]
  ring

/-- The differential-inequality bound behind Theorem A. -/
theorem ThetaDot_le (hk : k + 1 < N) (ho : Ordered N y) :
    ThetaDot N y k
      ≤ 4 * Thetav N y k * (Thetav N y k + 2) * (4 * Thetav N y k - 1) / (gapv y k) ^ 2 := by
  have hgpos : 0 < gapv y k := gapv_pos hk ho
  have hg2 : (0 : ℝ) < (gapv y k) ^ 2 := by positivity
  have hThnn : 0 ≤ Thetav N y k := Thetav_nonneg hk ho
  have hbnd : ∀ j ∈ envIdx N k, Tv y k j ≤ 2 * Thetav N y k / (gapv y k) ^ 2 := by
    intro j hj
    rw [le_div_iff₀ hg2, mul_comm]
    exact gapSq_Tv_le hk ho hj
  have hnn : ∀ j ∈ envIdx N k, 0 ≤ Tv y k j := fun j hj => (Tv_pos hk ho hj).le
  have hc : (0 : ℝ) ≤ 2 * Thetav N y k / (gapv y k) ^ 2 := by positivity
  have h2 : ∑ m ∈ envIdx N k, (Tv y k m) ^ 2
      ≤ (2 * Thetav N y k / (gapv y k) ^ 2) * (2 * Thetav N y k / (gapv y k) ^ 2) := by
    calc ∑ m ∈ envIdx N k, (Tv y k m) ^ 2
        ≤ ∑ m ∈ envIdx N k, (2 * Thetav N y k / (gapv y k) ^ 2) * Tv y k m := by
          refine Finset.sum_le_sum fun m hm => ?_
          rw [pow_two]
          exact mul_le_mul_of_nonneg_right (hbnd m hm) (hnn m hm)
      _ = (2 * Thetav N y k / (gapv y k) ^ 2) * (2 * Thetav N y k / (gapv y k) ^ 2) := by
          rw [← Finset.mul_sum, ← envE, envE_eq hk ho]
  have h3 : ∑ m ∈ envIdx N k, (Tv y k m) ^ 3
      ≤ (2 * Thetav N y k / (gapv y k) ^ 2) ^ 2 * (2 * Thetav N y k / (gapv y k) ^ 2) := by
    calc ∑ m ∈ envIdx N k, (Tv y k m) ^ 3
        ≤ ∑ m ∈ envIdx N k, (2 * Thetav N y k / (gapv y k) ^ 2) ^ 2 * Tv y k m := by
          refine Finset.sum_le_sum fun m hm => ?_
          have : (Tv y k m) ^ 3 = (Tv y k m) ^ 2 * Tv y k m := by ring
          rw [this]
          refine mul_le_mul_of_nonneg_right ?_ (hnn m hm)
          exact pow_le_pow_left₀ (hnn m hm) (hbnd m hm) 2
      _ = (2 * Thetav N y k / (gapv y k) ^ 2) ^ 2 * (2 * Thetav N y k / (gapv y k) ^ 2) := by
          rw [← Finset.mul_sum, ← envE, envE_eq hk ho]
  have c2 : 6 * (gapv y k) ^ 2 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 2
      ≤ 24 * (Thetav N y k) ^ 2 / (gapv y k) ^ 2 := by
    have h := mul_le_mul_of_nonneg_left h2 (show (0 : ℝ) ≤ 6 * (gapv y k) ^ 2 by positivity)
    refine h.trans_eq ?_
    field_simp
    ring
  have c3 : 2 * (gapv y k) ^ 4 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 3
      ≤ 16 * (Thetav N y k) ^ 3 / (gapv y k) ^ 2 := by
    have h := mul_le_mul_of_nonneg_left h3 (show (0 : ℝ) ≤ 2 * (gapv y k) ^ 4 by positivity)
    refine h.trans_eq ?_
    field_simp
    ring
  have hfin : -(4 * Thetav N y k * (2 - Thetav N y k)) / (gapv y k) ^ 2
      + 24 * (Thetav N y k) ^ 2 / (gapv y k) ^ 2 + 16 * (Thetav N y k) ^ 3 / (gapv y k) ^ 2
      = 4 * Thetav N y k * (Thetav N y k + 2) * (4 * Thetav N y k - 1) / (gapv y k) ^ 2 := by
    field_simp
    ring
  rw [ThetaDot, ← hfin]
  linarith

end Static

/-! ## The identities along the flow -/

section Dynamic

variable {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} {k : ℕ} {s : ℝ}

theorem hasDerivAt_gap (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => gapv (cfg x t) k)
      (vel N (cfg x s) (k + 1) - vel N (cfg x s) k) s :=
  (hf.hasDeriv s hs (k + 1) hk).sub (hf.hasDeriv s hs k (Nat.lt_of_succ_lt hk))

theorem gap_ne_zero' (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc) :
    gapv (cfg x s) k ≠ 0 :=
  gap_ne_zero hk (hf.ordered s hs).distinct

/-- **Lemma E** (exact pair identity): `dg/ds = -(4/g)(1 - Θ)`. -/
theorem lemmaE (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => gapv (cfg x t) k)
      (-(4 / gapv (cfg x s) k) * (1 - Thetav N (cfg x s) k)) s := by
  have hd := (hf.ordered s hs).distinct
  have hg : gapv (cfg x s) k ≠ 0 := gap_ne_zero hk hd
  have h := hasDerivAt_gap hf hk hs
  rw [lemmaE_point hk hd] at h
  convert h using 1
  rw [Thetav]
  field_simp
  ring

/-- **Lemma E**, squared-gap form: `d(g²)/ds = -8(1 - Θ)`. -/
theorem lemmaE_sq (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => (gapv (cfg x t) k) ^ 2) (-8 * (1 - Thetav N (cfg x s) k)) s := by
  have hg : gapv (cfg x s) k ≠ 0 := gap_ne_zero' hf hk hs
  have h := (lemmaE hf hk hs).pow 2
  convert h using 1
  field_simp
  ring

theorem hasDerivAt_Tv (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc)
    {m : ℕ} (hm : m ∈ envIdx N k) :
    HasDerivAt (fun t => Tv (cfg x t) k m)
      (-(Tv (cfg x s) k m) ^ 2 *
        ((vel N (cfg x s) k - vel N (cfg x s) m) * (cfg x s (k + 1) - cfg x s m)
          + (cfg x s k - cfg x s m) * (vel N (cfg x s) (k + 1) - vel N (cfg x s) m))) s := by
  have hmN : m < N := (mem_envIdx.mp hm).1
  have hd := (hf.ordered s hs).distinct
  have ha : cfg x s k - cfg x s m ≠ 0 := sub_k_ne_zero hk hd hm
  have hb : cfg x s (k + 1) - cfg x s m ≠ 0 := sub_k1_ne_zero hk hd hm
  have hu : HasDerivAt (fun t => (cfg x t k - cfg x t m) * (cfg x t (k + 1) - cfg x t m))
      ((vel N (cfg x s) k - vel N (cfg x s) m) * (cfg x s (k + 1) - cfg x s m)
        + (cfg x s k - cfg x s m) * (vel N (cfg x s) (k + 1) - vel N (cfg x s) m)) s :=
    ((hf.hasDeriv s hs k (Nat.lt_of_succ_lt hk)).sub (hf.hasDeriv s hs m hmN)).mul
      ((hf.hasDeriv s hs (k + 1) hk).sub (hf.hasDeriv s hs m hmN))
  have hne : (cfg x s k - cfg x s m) * (cfg x s (k + 1) - cfg x s m) ≠ 0 := mul_ne_zero ha hb
  have h := hu.inv hne
  convert h using 1
  rw [Tv]
  field_simp

/-- **Lemma 1** (exact environment identity) along the flow. -/
theorem lemma1 (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => envE N (cfg x t) k) (envEdot N (cfg x s) k) s := by
  have hd := (hf.ordered s hs).distinct
  have h : HasDerivAt (fun t => envE N (cfg x t) k)
      (∑ m ∈ envIdx N k, (-(Tv (cfg x s) k m) ^ 2 *
        ((vel N (cfg x s) k - vel N (cfg x s) m) * (cfg x s (k + 1) - cfg x s m)
          + (cfg x s k - cfg x s m) * (vel N (cfg x s) (k + 1) - vel N (cfg x s) m)))) s := by
    simp only [envE]
    exact HasDerivAt.fun_sum fun m hm => hasDerivAt_Tv hf hk hs hm
  rwa [lemma1_point hk hd] at h

/-- **Lemma B** (`dΘ/ds` decomposition). -/
theorem lemmaB (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => Thetav N (cfg x t) k)
      (-(8 * Thetav N (cfg x s) k * (1 - Thetav N (cfg x s) k)) / (gapv (cfg x s) k) ^ 2
        + (gapv (cfg x s) k) ^ 2 / 2 * envEdot N (cfg x s) k) s := by
  have hg : gapv (cfg x s) k ≠ 0 := gap_ne_zero' hf hk hs
  have h := ((lemmaE_sq hf hk hs).mul (lemma1 hf hk hs)).div_const 2
  convert h using 1
  rw [Thetav]
  field_simp

/-- **Lemma 2** (exact `Θ` identity). -/
theorem lemma2 (hf : IsCMFlow N tc x) (hk : k + 1 < N) (hs : s ∈ Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => Thetav N (cfg x t) k) (ThetaDot N (cfg x s) k) s := by
  have hg : gapv (cfg x s) k ≠ 0 := gap_ne_zero' hf hk hs
  have h := lemmaB hf hk hs
  convert h using 1
  rw [ThetaDot, envEdot, Thetav]
  field_simp
  ring

end Dynamic

/-! ## A Grönwall-type trapping lemma -/

/-- If `u a ≤ 0` and `u' ≤ C u` on `[a, b)` with `C ≥ 0` continuous, then `u ≤ 0` on `[a, b)`. -/
theorem trap_abstract {a b : ℝ} {u u' C : ℝ → ℝ}
    (hu : ∀ t ∈ Ico a b, HasDerivAt u (u' t) t)
    (hCc : ContinuousOn C (Ico a b))
    (hCnn : ∀ t ∈ Ico a b, 0 ≤ C t)
    (hle : ∀ t ∈ Ico a b, u' t ≤ C t * u t)
    (h0 : u a ≤ 0) : ∀ t ∈ Ico a b, u t ≤ 0 := by
  intro s hs
  have hab : a ≤ s := hs.1
  have hsub : Icc a s ⊆ Ico a b := fun t ht => ⟨ht.1, lt_of_le_of_lt ht.2 hs.2⟩
  have hcont : ContinuousOn u (Icc a s) := fun t ht =>
    ((hu t (hsub ht)).continuousAt).continuousWithinAt
  obtain ⟨p, hp, hpmax⟩ := (isCompact_Icc (a := a) (b := s)).exists_isMaxOn
    ⟨a, left_mem_Icc.mpr hab⟩ (hCc.mono hsub)
  set M : ℝ := C p with hMdef
  have hM0 : 0 ≤ M := hCnn p (hsub hp)
  have hCle : ∀ t ∈ Icc a s, C t ≤ M := fun t ht => hpmax ht
  have key : ∀ ε > (0 : ℝ), u s ≤ ε * Real.exp ((M + 1) * (s - a)) := by
    intro ε hε
    have hBpos : ∀ t : ℝ, 0 < ε * Real.exp ((M + 1) * (t - a)) := fun t => by positivity
    have hB : ∀ t : ℝ, HasDerivAt (fun r : ℝ => ε * Real.exp ((M + 1) * (r - a)))
        (ε * ((M + 1) * Real.exp ((M + 1) * (t - a)))) t := by
      intro t
      have h1 : HasDerivAt (fun r : ℝ => (M + 1) * (r - a)) (M + 1) t := by
        simpa using ((hasDerivAt_id t).sub_const a).const_mul (M + 1)
      have h2 := (h1.exp).const_mul ε
      convert h2 using 1
      ring
    have hmain := image_le_of_deriv_right_lt_deriv_boundary hcont
      (fun t ht => (hu t (hsub (Ico_subset_Icc_self ht))).hasDerivWithinAt)
      (le_trans h0 (hBpos a).le) hB ?_
    · exact hmain (right_mem_Icc.mpr hab)
    · intro t ht hteq
      have htIcc : t ∈ Icc a s := Ico_subset_Icc_self ht
      have h1 : u' t ≤ C t * u t := hle t (hsub htIcc)
      have h2 : C t * u t ≤ M * u t := by
        rw [hteq]
        exact mul_le_mul_of_nonneg_right (hCle t htIcc) (hBpos t).le
      have h3 : M * u t < (M + 1) * u t := by
        rw [hteq]
        have := hBpos t
        nlinarith
      have h4 : (M + 1) * u t
          = ε * ((M + 1) * Real.exp ((M + 1) * (t - a))) := by rw [hteq]; ring
      linarith [h4 ▸ h3]
  by_contra hcon
  push_neg at hcon
  set K : ℝ := Real.exp ((M + 1) * (s - a)) with hK
  have hKpos : 0 < K := Real.exp_pos _
  have := key (u s / (2 * K)) (by positivity)
  rw [div_mul_eq_mul_div, mul_comm, mul_div_assoc] at this
  have hKne : K ≠ 0 := ne_of_gt hKpos
  have heq : K * (u s / (2 * K)) = u s / 2 := by field_simp
  rw [heq] at this
  linarith

/-! ## Theorem A: the unconditional trap at `Θ* = 1/4` -/

section TheoremA

variable {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} {k : ℕ}

/-- **Theorem A** (unconditional trap at `Θ* = 1/4`).  For *every* adjacent pair, with no
minimal-gap or density hypothesis: if `Θ(s₀) ≤ 1/4` then `Θ(s) ≤ 1/4` for all `s ∈ [s₀, t_c)`. -/
theorem theoremA (hf : IsCMFlow N tc x) (hk : k + 1 < N) {s0 : ℝ} (hs0 : s0 ∈ Ico (0 : ℝ) tc)
    (hinit : Thetav N (cfg x s0) k ≤ 1 / 4) :
    ∀ s ∈ Ico s0 tc, Thetav N (cfg x s) k ≤ 1 / 4 := by
  have hsub : Ico s0 tc ⊆ Ico (0 : ℝ) tc := fun t ht => ⟨le_trans hs0.1 ht.1, ht.2⟩
  set C : ℝ → ℝ := fun t =>
    16 * Thetav N (cfg x t) k * (Thetav N (cfg x t) k + 2) / (gapv (cfg x t) k) ^ 2 with hC
  have hthc : ContinuousOn (fun t => Thetav N (cfg x t) k) (Ico s0 tc) := fun t ht =>
    ((lemma2 hf hk (hsub ht)).continuousAt).continuousWithinAt
  have hgc : ContinuousOn (fun t => gapv (cfg x t) k) (Ico s0 tc) := fun t ht =>
    ((hasDerivAt_gap hf hk (hsub ht)).continuousAt).continuousWithinAt
  have hCc : ContinuousOn C (Ico s0 tc) := by
    refine ContinuousOn.div ?_ (hgc.pow 2) ?_
    · exact (continuousOn_const.mul hthc).mul (hthc.add continuousOn_const)
    · exact fun t ht => pow_ne_zero 2 (gap_ne_zero' hf hk (hsub ht))
  have hres := trap_abstract (u := fun t => Thetav N (cfg x t) k - 1 / 4)
    (u' := fun t => ThetaDot N (cfg x t) k) (C := C)
    (fun t ht => (lemma2 hf hk (hsub ht)).sub_const _) hCc ?_ ?_ (by linarith)
  · intro s hs
    have := hres s hs
    linarith
  · intro t ht
    have h1 : 0 ≤ Thetav N (cfg x t) k := Thetav_nonneg hk (hf.ordered t (hsub ht))
    have h2 : (0 : ℝ) < (gapv (cfg x t) k) ^ 2 :=
      pow_pos (gapv_pos hk (hf.ordered t (hsub ht))) 2
    rw [hC]
    positivity
  · intro t ht
    have ho := hf.ordered t (hsub ht)
    have hg : gapv (cfg x t) k ≠ 0 := ne_of_gt (gapv_pos hk ho)
    have hb := ThetaDot_le hk ho
    refine hb.trans (le_of_eq ?_)
    rw [hC]
    field_simp
    ring

end TheoremA

/-! ## Corollaries E1 and A1 -/

section Corollaries

variable {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} {k : ℕ}

/-- Grönwall on Lemma E: if `Θ ≤ Θ*` along the flow then `g²` decreases at least linearly. -/
theorem gapSq_le_of_Theta_le (hf : IsCMFlow N tc x) (hk : k + 1 < N) {Ts : ℝ}
    (hTs : ∀ s ∈ Ico (0 : ℝ) tc, Thetav N (cfg x s) k ≤ Ts) :
    ∀ s ∈ Ico (0 : ℝ) tc,
      (gapv (cfg x s) k) ^ 2 ≤ (gapv (cfg x 0) k) ^ 2 - 8 * (1 - Ts) * s := by
  intro s hs
  have hsub : Icc (0 : ℝ) s ⊆ Ico (0 : ℝ) tc := fun t ht => ⟨ht.1, lt_of_le_of_lt ht.2 hs.2⟩
  have hcont : ContinuousOn (fun t => (gapv (cfg x t) k) ^ 2) (Icc 0 s) := fun t ht =>
    ((lemmaE_sq hf hk (hsub ht)).continuousAt).continuousWithinAt
  have hBd : ∀ t : ℝ,
      HasDerivAt (fun r : ℝ => (gapv (cfg x 0) k) ^ 2 - 8 * (1 - Ts) * r) (-(8 * (1 - Ts))) t := by
    intro t
    simpa using (hasDerivAt_const t ((gapv (cfg x 0) k) ^ 2)).sub
      ((hasDerivAt_id t).const_mul (8 * (1 - Ts)))
  have hBc : ContinuousOn (fun r : ℝ => (gapv (cfg x 0) k) ^ 2 - 8 * (1 - Ts) * r) (Icc 0 s) :=
    fun t _ => ((hBd t).continuousAt).continuousWithinAt
  have hmain := image_le_of_deriv_right_le_deriv_boundary
    (f := fun t => (gapv (cfg x t) k) ^ 2)
    (f' := fun t => -8 * (1 - Thetav N (cfg x t) k))
    (B := fun r : ℝ => (gapv (cfg x 0) k) ^ 2 - 8 * (1 - Ts) * r)
    (B' := fun _ => -(8 * (1 - Ts)))
    hcont
    (fun t ht => (lemmaE_sq hf hk (hsub (Ico_subset_Icc_self ht))).hasDerivWithinAt)
    (by simp) hBc (fun t _ => (hBd t).hasDerivWithinAt)
    (fun t ht => by
      have := hTs t (hsub (Ico_subset_Icc_self ht))
      linarith)
  exact hmain (right_mem_Icc.mpr hs.1)

/-- **Corollary E1** (conditional collision bound), fixed-pair form.

The `\TeX` source states E1 for the running minimal gap under two parenthetical assumptions
(absolute continuity of `g_min`, and that its a.e. derivative is that of an active minimal pair).
As the source itself allows, we formalize instead the fixed-pair form, which needs neither:
for a *fixed* adjacent pair whose `Θ` stays `≤ Θ* < 1` on `[0, t_c)`, one has
`t_c ≤ g(0)² / (8(1 - Θ*))`.  Instantiating at the pair realizing the minimal gap at time `0`
gives the ledger's formula `t_c ≤ g_min(0)² / (8(1 - Θ*))`. -/
theorem corollaryE1 (hf : IsCMFlow N tc x) (hk : k + 1 < N) {Ts : ℝ} (hTs1 : Ts < 1)
    (hTs : ∀ s ∈ Ico (0 : ℝ) tc, Thetav N (cfg x s) k ≤ Ts) :
    tc ≤ (gapv (cfg x 0) k) ^ 2 / (8 * (1 - Ts)) := by
  have hpos : (0 : ℝ) < 8 * (1 - Ts) := by linarith
  have hTsne : (1 : ℝ) - Ts ≠ 0 := by linarith
  by_contra hcon
  push_neg at hcon
  have hbnn : (0 : ℝ) ≤ (gapv (cfg x 0) k) ^ 2 / (8 * (1 - Ts)) := by positivity
  have hmem : (gapv (cfg x 0) k) ^ 2 / (8 * (1 - Ts)) ∈ Ico (0 : ℝ) tc := ⟨hbnn, hcon⟩
  have h1 := gapSq_le_of_Theta_le hf hk hTs _ hmem
  have h2 : (0 : ℝ) < (gapv (cfg x ((gapv (cfg x 0) k) ^ 2 / (8 * (1 - Ts)))) k) ^ 2 :=
    pow_pos (gapv_pos hk (hf.ordered _ hmem)) 2
  have h3 : 8 * (1 - Ts) * ((gapv (cfg x 0) k) ^ 2 / (8 * (1 - Ts))) = (gapv (cfg x 0) k) ^ 2 := by
    field_simp
  linarith

/-- **Corollary A1** (unconditional level, fixed-pair tracking).

If the tracked adjacent pair has `Θ(0) ≤ 1/4`, then Theorem A keeps `Θ ≤ 1/4`, Lemma E gives
`d(g²)/ds ≤ -6`, and `t_c ≤ g(0)² / 6`.

The source's parenthetical "adjacency persists" clause is not needed here: we track the *fixed*
index pair `(k, k+1)`, and the standing no-collision hypothesis of `IsCMFlow` keeps the particles
strictly ordered, hence that index pair adjacent, throughout `[0, t_c)`. -/
theorem corollaryA1 (hf : IsCMFlow N tc x) (hk : k + 1 < N) (htc : 0 < tc)
    (hinit : Thetav N (cfg x 0) k ≤ 1 / 4) :
    tc ≤ (gapv (cfg x 0) k) ^ 2 / 6 := by
  have h0 : (0 : ℝ) ∈ Ico (0 : ℝ) tc := ⟨le_refl 0, htc⟩
  have hA := theoremA hf hk h0 hinit
  have hTs : ∀ s ∈ Ico (0 : ℝ) tc, Thetav N (cfg x s) k ≤ 1 / 4 := fun s hs => hA s ⟨hs.1, hs.2⟩
  have h := corollaryE1 hf hk (by norm_num : (1 : ℝ) / 4 < 1) hTs
  norm_num at h
  exact h

end Corollaries

/-! ## Sharpness: the symmetric triplet sits exactly at `Θ = 1/4` -/

section Sharpness

theorem env3 : envIdx 3 0 = {2} := by decide

/-- All the data of a symmetric triple `{-r, 0, r}` with `r > 0`. -/
theorem triple_facts {r : ℝ} (hr : 0 < r) {y : ℕ → ℝ}
    (h0 : y 0 = -r) (h1 : y 1 = 0) (h2 : y 2 = r) :
    Ordered 3 y ∧ vel 3 y 0 = 3 / r ∧ vel 3 y 1 = 0 ∧ vel 3 y 2 = -(3 / r) ∧
      Thetav 3 y 0 = 1 / 4 ∧ gapv y 0 = r := by
  have hne : r ≠ 0 := ne_of_gt hr
  have e0 : (Finset.range 3).erase 0 = {1, 2} := by decide
  have e1 : (Finset.range 3).erase 1 = {0, 2} := by decide
  have e2 : (Finset.range 3).erase 2 = {0, 1} := by decide
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro i hi j hj hij
    interval_cases i <;> interval_cases j <;> simp_all
  · rw [vel, e0, Finset.sum_pair (by norm_num : (1 : ℕ) ≠ 2), h0, h1, h2,
      show (-r - 0 : ℝ) = -r from by ring, show (-r - r : ℝ) = -(2 * r) from by ring,
      inv_neg, inv_neg]
    field_simp
    ring
  · rw [vel, e1, Finset.sum_pair (by norm_num : (0 : ℕ) ≠ 2), h0, h1, h2,
      show ((0 : ℝ) - -r) = r from by ring, show ((0 : ℝ) - r) = -r from by ring, inv_neg]
    ring
  · rw [vel, e2, Finset.sum_pair (by norm_num : (0 : ℕ) ≠ 1), h0, h1, h2,
      show (r - -r : ℝ) = 2 * r from by ring, show (r - (0 : ℝ)) = r from by ring]
    field_simp
    ring
  · rw [Thetav, envE, env3, Finset.sum_singleton, Tv, gapv, h0, h1, h2,
      show ((0 : ℝ) - -r) = r from by ring,
      show ((-r - r : ℝ) * (0 - r)) = 2 * r ^ 2 from by ring]
    field_simp
    ring
  · rw [gapv, h0, h1]
    ring

/-- The symmetric triplet `{-r(s), 0, r(s)}` with `r(s) = √(a² - 6s)`: the exact solution of
the attractive Calogero–Moser system for `N = 3` that collides at `s = a²/6`. -/
noncomputable def symTriplet (a : ℝ) : ℕ → ℝ → ℝ
  | 0 => fun s => -Real.sqrt (a ^ 2 - 6 * s)
  | 1 => fun _ => (0 : ℝ)
  | _ => fun s => Real.sqrt (a ^ 2 - 6 * s)

variable {a s : ℝ}

theorem symTriplet_cfg0 : cfg (symTriplet a) s 0 = -Real.sqrt (a ^ 2 - 6 * s) := rfl
theorem symTriplet_cfg1 : cfg (symTriplet a) s 1 = 0 := rfl
theorem symTriplet_cfg2 : cfg (symTriplet a) s 2 = Real.sqrt (a ^ 2 - 6 * s) := rfl

/-- The symmetric triplet really is a solution of the attractive Calogero–Moser system,
collision-free on `[0, a²/6)`. -/
theorem symTriplet_isCMFlow : IsCMFlow 3 (a ^ 2 / 6) (symTriplet a) := by
  have hrpos : ∀ t ∈ Ico (0 : ℝ) (a ^ 2 / 6), 0 < a ^ 2 - 6 * t := by
    intro t ht
    have h := ht.2
    rw [lt_div_iff₀ (by norm_num : (0:ℝ) < 6)] at h
    linarith
  refine ⟨?_, fun t ht => ?_⟩
  · intro t ht i hi
    have hr := hrpos t ht
    have hrs : 0 < Real.sqrt (a ^ 2 - 6 * t) := Real.sqrt_pos.mpr hr
    have hne : Real.sqrt (a ^ 2 - 6 * t) ≠ 0 := ne_of_gt hrs
    have hu : HasDerivAt (fun q : ℝ => a ^ 2 - 6 * q) (-6) t := by
      simpa using (hasDerivAt_const t (a ^ 2)).sub ((hasDerivAt_id t).const_mul (6 : ℝ))
    have hsq : HasDerivAt (fun q : ℝ => Real.sqrt (a ^ 2 - 6 * q))
        (-6 / (2 * Real.sqrt (a ^ 2 - 6 * t))) t := hu.sqrt (ne_of_gt hr)
    obtain ⟨-, v0, v1, v2, -, -⟩ :=
      triple_facts hrs symTriplet_cfg0 symTriplet_cfg1 symTriplet_cfg2
    have hhalf : -6 / (2 * Real.sqrt (a ^ 2 - 6 * t)) = -(3 / Real.sqrt (a ^ 2 - 6 * t)) := by
      field_simp
      norm_num
    rw [hhalf] at hsq
    interval_cases i
    · rw [v0]
      simpa using hsq.neg
    · rw [v1]
      exact hasDerivAt_const t 0
    · rw [v2]
      exact hsq
  · exact (triple_facts (Real.sqrt_pos.mpr (hrpos t ht))
      symTriplet_cfg0 symTriplet_cfg1 symTriplet_cfg2).1

/-- The symmetric triplet sits exactly at `Θ = 1/4`. -/
theorem symTriplet_Theta (hr : 0 < a ^ 2 - 6 * s) :
    Thetav 3 (cfg (symTriplet a) s) 0 = 1 / 4 :=
  (triple_facts (Real.sqrt_pos.mpr hr) symTriplet_cfg0 symTriplet_cfg1 symTriplet_cfg2).2.2.2.2.1

/-- **Sharpness of Theorem A**: along the symmetric triplet `Θ ≡ 1/4` and `dΘ/ds ≡ 0`, so the
trap level `1/4` cannot be raised. -/
theorem symTriplet_ThetaDot {t : ℝ} (ht : t ∈ Ico (0 : ℝ) (a ^ 2 / 6)) :
    ThetaDot 3 (cfg (symTriplet a) t) 0 = 0 := by
  have hopen : IsOpen {q : ℝ | 0 < a ^ 2 - 6 * q} := isOpen_lt (by fun_prop) (by fun_prop)
  have hmem : t ∈ {q : ℝ | 0 < a ^ 2 - 6 * q} := by
    have h := ht.2
    rw [lt_div_iff₀ (by norm_num : (0:ℝ) < 6)] at h
    simp only [Set.mem_setOf_eq]
    linarith
  have heq : (fun q => Thetav 3 (cfg (symTriplet a) q) 0) =ᶠ[nhds t] (fun _ => (1 : ℝ) / 4) :=
    Filter.eventuallyEq_of_mem (hopen.mem_nhds hmem) fun q hq => symTriplet_Theta hq
  have h1 : HasDerivAt (fun q => Thetav 3 (cfg (symTriplet a) q) 0) 0 t :=
    (hasDerivAt_const t ((1 : ℝ) / 4)).congr_of_eventuallyEq heq
  have h2 := lemma2 symTriplet_isCMFlow (by norm_num : 0 + 1 < 3) ht
  exact h2.unique h1

/-- The initial gap of the symmetric triplet is `a`. -/
theorem symTriplet_gap0 (ha : 0 < a) : gapv (cfg (symTriplet a) 0) 0 = a := by
  rw [gapv, symTriplet_cfg0, symTriplet_cfg1,
    show a ^ 2 - 6 * (0 : ℝ) = a ^ 2 by ring, Real.sqrt_sq ha.le]
  ring

/-- **Sharpness of Corollary A1**: the symmetric triplet collides exactly at `t_c = a²/6`,
which is exactly the bound `g(0)²/6` of Corollary A1. -/
theorem symTriplet_collision_sharp (ha : 0 < a) :
    (gapv (cfg (symTriplet a) 0) 0) ^ 2 / 6 = a ^ 2 / 6 := by
  rw [symTriplet_gap0 ha]

end Sharpness

end ThetaTrap

/-! ## Notes on the flagged judgment calls of the source

* Flow existence, `C¹` regularity and absence of collisions on `[0, t_c)` are explicit
  hypotheses, packaged in `ThetaTrap.IsCMFlow`; they are never concluded.  The structure is
  non-vacuous: `ThetaTrap.symTriplet_isCMFlow` exhibits an explicit solution.
* Corollary E1 is formalized in the fixed-pair form (`ThetaTrap.corollaryE1`), which the source
  explicitly allows; this avoids assuming absolute continuity of the running minimal gap and the
  a.e. identification of its derivative with that of an active minimal pair.
* Corollary A1's "adjacency persists" clause is not assumed: `ThetaTrap.corollaryA1` tracks the
  fixed index pair `(k, k+1)`, which the standing ordering hypothesis keeps adjacent.
* Only the trap level `1/4` is claimed.  The source refutes persistence at "some absolute
  `Θ* < 1`", and nothing of that kind is asserted here.
-/

/-! ## Axiom audit -/

section AxiomCheck
#print axioms ThetaTrap.lemmaE
#print axioms ThetaTrap.lemmaE_sq
#print axioms ThetaTrap.lemma1
#print axioms ThetaTrap.lemmaB
#print axioms ThetaTrap.lemma2
#print axioms ThetaTrap.theoremA
#print axioms ThetaTrap.corollaryE1
#print axioms ThetaTrap.corollaryA1
#print axioms ThetaTrap.symTriplet_isCMFlow
#print axioms ThetaTrap.symTriplet_Theta
#print axioms ThetaTrap.symTriplet_ThetaDot
#print axioms ThetaTrap.symTriplet_collision_sharp
end AxiomCheck
