import Mathlib

/-!
# The attractive Calogero–Moser flow, the trapping functional `Θ`, and its exact derivative

Vocabulary for the minimal-gap trap threshold problem (the `theta_trap` setting):
attractive CM flow `dx_k/ds = -2 ∑_{j ≠ k} 1/(x_k - x_j)`, adjacent pair gap `g`,
environment weights `T_j = 1/((x_k - x_j)(x_{k+1} - x_j)) > 0`, envelope `E = ∑_j T_j`,
trapping functional `Θ = g² E / 2`.

Main results here:

* `ThetaTrap.Tv_pos` : positivity of the environment weights;
* `ThetaTrap.lemma2` : the exact `Θ`-derivative along the flow;
* `ThetaTrap.cap_of_minimal_gap` (TARGET S2): the minimal-gap hypothesis caps `μ_j = g² T_j`
  at `1/2`.
-/

open scoped BigOperators

namespace ThetaTrap

/-- A configuration `y` of `N` particles is ordered. -/
def Ordered (N : ℕ) (y : ℕ → ℝ) : Prop := ∀ i j, i < j → j < N → y i < y j

/-- Indices of the environment particles of the tracked pair `(k, k+1)`. -/
def envIdx (N k : ℕ) : Finset ℕ := ((Finset.range N).erase k).erase (k + 1)

/-- The environment weight `T_m = 1/((y_k - y_m)(y_{k+1} - y_m))`. -/
noncomputable def Tv (y : ℕ → ℝ) (k m : ℕ) : ℝ := 1 / ((y k - y m) * (y (k + 1) - y m))

/-- The envelope `E = ∑_m T_m`. -/
noncomputable def envE (N : ℕ) (y : ℕ → ℝ) (k : ℕ) : ℝ := ∑ m ∈ envIdx N k, Tv y k m

/-- The gap `g = y_{k+1} - y_k` of the tracked adjacent pair. -/
def gapv (y : ℕ → ℝ) (k : ℕ) : ℝ := y (k + 1) - y k

/-- The trapping functional `Θ = g² E / 2`. -/
noncomputable def Thetav (N : ℕ) (y : ℕ → ℝ) (k : ℕ) : ℝ := (gapv y k) ^ 2 * envE N y k / 2

/-- The CM velocity field `v_i = -2 ∑_{j ≠ i} 1/(y_i - y_j)`. -/
noncomputable def vel (N : ℕ) (y : ℕ → ℝ) (i : ℕ) : ℝ :=
  -2 * ∑ j ∈ (Finset.range N).erase i, 1 / (y i - y j)

/-- The exact rate of change of `Θ` along the flow. -/
noncomputable def ThetaDot (N : ℕ) (y : ℕ → ℝ) (k : ℕ) : ℝ :=
  -(4 * Thetav N y k * (2 - Thetav N y k)) / (gapv y k) ^ 2
    + 6 * (gapv y k) ^ 2 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 2
    + 2 * (gapv y k) ^ 4 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 3

/-- The rate of change of the environment weight `T_m` along the flow. -/
noncomputable def Tdotv (N : ℕ) (y : ℕ → ℝ) (k m : ℕ) : ℝ :=
  -((vel N y k - vel N y m) / (y k - y m) + (vel N y (k + 1) - vel N y m) / (y (k + 1) - y m))
    * Tv y k m

/-- The configuration of the flow `x` at time `t`. -/
def cfg (x : ℕ → ℝ → ℝ) (t : ℝ) : ℕ → ℝ := fun i => x i t

/-- `x` is an attractive Calogero–Moser flow of `N` particles on the time interval `[0, tc)`. -/
structure IsCMFlow (N : ℕ) (tc : ℝ) (x : ℕ → ℝ → ℝ) : Prop where
  ordered : ∀ t ∈ Set.Ico (0 : ℝ) tc, Ordered N (cfg x t)
  hasDeriv : ∀ t ∈ Set.Ico (0 : ℝ) tc, ∀ i < N, HasDerivAt (x i) (vel N (cfg x t) i) t

/-! ### Basic facts about the environment -/

lemma mem_envIdx_iff {N k m : ℕ} : m ∈ envIdx N k ↔ m < N ∧ m ≠ k ∧ m ≠ k + 1 := by
  simp [envIdx, Finset.mem_erase, Finset.mem_range]
  tauto

/-- The environment weights are positive for an ordered configuration. -/
lemma Tv_pos {N : ℕ} {y : ℕ → ℝ} {k m : ℕ} (hord : Ordered N y) (hk : k + 1 < N)
    (hm : m ∈ envIdx N k) : 0 < Tv y k m := by
  rw [mem_envIdx_iff] at hm
  obtain ⟨hmN, hmk, hmk1⟩ := hm
  rw [Tv]
  apply div_pos one_pos
  rcases lt_or_gt_of_ne hmk with h | h
  · have h1 : y m < y k := hord m k h (by omega)
    have h2 : y m < y (k + 1) := hord m (k + 1) (by omega) hk
    have e1 : (0 : ℝ) < y k - y m := by linarith
    have e2 : (0 : ℝ) < y (k + 1) - y m := by linarith
    positivity
  · have h1 : y k < y m := hord k m h hmN
    have h2 : y (k + 1) < y m := hord (k + 1) m (by omega) hmN
    nlinarith

lemma gapv_pos {N : ℕ} {y : ℕ → ℝ} {k : ℕ} (hord : Ordered N y) (hk : k + 1 < N) :
    0 < gapv y k := sub_pos.mpr (hord k (k + 1) (Nat.lt_succ_self k) hk)

/-! ### The exact `Θ`-derivative -/

/-- Antisymmetrisation: a doubly-indexed family whose transpositions sum to `-4 T_m T_n`
has an off-diagonal sum expressible through `∑ T` and `∑ T²`. -/
lemma pair_cancel {ι : Type*} [DecidableEq ι] (E : Finset ι) (F : ι → ι → ℝ) (T : ι → ℝ)
    (hF : ∀ m ∈ E, ∀ n ∈ E, m ≠ n → F m n + F n m = -4 * (T m * T n)) :
    ∑ m ∈ E, ∑ n ∈ E.erase m, F m n = -2 * (∑ m ∈ E, T m) ^ 2 + 2 * ∑ m ∈ E, (T m) ^ 2 := by
  have hswap : ∑ m ∈ E, ∑ n ∈ E.erase m, F m n = ∑ m ∈ E, ∑ n ∈ E.erase m, F n m := by
    rw [Finset.sum_comm' (t' := E) (s' := fun j => E.erase j)]
    intro i j
    simp [Finset.mem_erase]
    tauto
  have hdouble : ∑ m ∈ E, ∑ n ∈ E.erase m, (F m n + F n m)
      = 2 * ∑ m ∈ E, ∑ n ∈ E.erase m, F m n := by
    simp only [Finset.sum_add_distrib]
    rw [← hswap]; ring
  have hpair : ∑ m ∈ E, ∑ n ∈ E.erase m, (F m n + F n m)
      = ∑ m ∈ E, ∑ n ∈ E.erase m, (-4 * (T m * T n)) :=
    Finset.sum_congr rfl fun m hm => Finset.sum_congr rfl fun n hn =>
      hF m hm n (Finset.mem_of_mem_erase hn) (Ne.symm (Finset.ne_of_mem_erase hn))
  have hinner : ∀ m ∈ E, ∑ n ∈ E.erase m, (-4 * (T m * T n))
      = -4 * T m * ((∑ n ∈ E, T n) - T m) := by
    intro m hm
    rw [show (fun n => -4 * (T m * T n)) = (fun n => (-4 * T m) * T n) by funext n; ring,
      ← Finset.mul_sum, Finset.sum_erase_eq_sub hm]
  have hlast : ∑ m ∈ E, (-4 * T m * ((∑ n ∈ E, T n) - T m))
      = -4 * (∑ m ∈ E, T m) ^ 2 + 4 * ∑ m ∈ E, (T m) ^ 2 := by
    rw [show (fun m => -4 * T m * ((∑ n ∈ E, T n) - T m))
        = (fun m => (-4 * (∑ n ∈ E, T n)) * T m + 4 * (T m) ^ 2) by funext m; ring,
      Finset.sum_add_distrib, ← Finset.mul_sum, ← Finset.mul_sum]
    ring
  rw [hpair, Finset.sum_congr rfl hinner, hlast] at hdouble
  linarith [hdouble]

/-- The algebraic core of the derivative identity: an abstract computation with the tracked
pair at `a < b` and environment positions `z m`. -/
lemma theta_deriv_algebra {ι : Type*} [DecidableEq ι] (E : Finset ι) (a b : ℝ) (z : ι → ℝ)
    (va vb : ℝ) (vz : ι → ℝ) (hab : a - b ≠ 0)
    (hu : ∀ m ∈ E, a - z m ≠ 0) (hw : ∀ m ∈ E, b - z m ≠ 0)
    (hz : ∀ m ∈ E, ∀ n ∈ E, m ≠ n → z m - z n ≠ 0)
    (hva : va = -2 * (1 / (a - b)) - 2 * ∑ m ∈ E, 1 / (a - z m))
    (hvb : vb = -2 * (1 / (b - a)) - 2 * ∑ m ∈ E, 1 / (b - z m))
    (hvz : ∀ m ∈ E, vz m = -2 * (1 / (z m - a)) - 2 * (1 / (z m - b))
      - 2 * ∑ n ∈ E.erase m, 1 / (z m - z n)) :
    (b - a) * (vb - va) * (∑ m ∈ E, 1 / ((a - z m) * (b - z m)))
        + (b - a) ^ 2 / 2 * ∑ m ∈ E, (-((va - vz m) / (a - z m) + (vb - vz m) / (b - z m))
            * (1 / ((a - z m) * (b - z m))))
      = -4 * (∑ m ∈ E, 1 / ((a - z m) * (b - z m)))
        + (b - a) ^ 2 * (∑ m ∈ E, 1 / ((a - z m) * (b - z m))) ^ 2
        + 6 * (b - a) ^ 2 * ∑ m ∈ E, (1 / ((a - z m) * (b - z m))) ^ 2
        + 2 * (b - a) ^ 4 * ∑ m ∈ E, (1 / ((a - z m) * (b - z m))) ^ 3 := by
  have hba : b - a ≠ 0 := fun hc => hab (by linarith [sub_eq_zero.mp hc])
  -- the boundary rate of the gap
  have hgap : vb - va = -4 / (b - a) + 2 * (b - a) * ∑ m ∈ E, 1 / ((a - z m) * (b - z m)) := by
    have h : (∑ m ∈ E, 1 / (a - z m)) - (∑ m ∈ E, 1 / (b - z m))
        = (b - a) * ∑ m ∈ E, 1 / ((a - z m) * (b - z m)) := by
      rw [Finset.mul_sum, ← Finset.sum_sub_distrib]
      refine Finset.sum_congr rfl fun m hm => ?_
      have h1 := hu m hm
      have h2 := hw m hm
      field_simp
      ring
    have hinv : 1 / (a - b) = -(1 / (b - a)) := by
      rw [show a - b = -(b - a) by ring, one_div, one_div, inv_neg]
    have hfour : -4 / (b - a) = -4 * (1 / (b - a)) := by ring
    rw [hva, hvb, hinv, hfour]
    linarith [h]
  -- the rate of each environment weight, split into a diagonal and a pair part
  have hTdot : ∀ m ∈ E, (-((va - vz m) / (a - z m) + (vb - vz m) / (b - z m))
        * (1 / ((a - z m) * (b - z m))))
      = 10 * (1 / ((a - z m) * (b - z m))) ^ 2
        + 4 * (b - a) ^ 2 * (1 / ((a - z m) * (b - z m))) ^ 3
        + ∑ n ∈ E.erase m, (-2 * (1 / ((a - z m) * (b - z m))) * (1 / ((a - z n) * (b - z n)))
            * ((a - z n) + (b - z n)) / (z m - z n)) := by
    intro m hm
    have h1 := hu m hm
    have h2 := hw m hm
    have hca : z m - a ≠ 0 := fun h => h1 (by linarith [sub_eq_zero.mp h])
    have hcb : z m - b ≠ 0 := fun h => h2 (by linarith [sub_eq_zero.mp h])
    have hva' : va = -2 * (1 / (a - b)) - 2 * (1 / (a - z m))
        - 2 * ∑ n ∈ E.erase m, 1 / (a - z n) := by
      rw [hva, ← Finset.add_sum_erase E (fun n => 1 / (a - z n)) hm]; ring
    have hvb' : vb = -2 * (1 / (b - a)) - 2 * (1 / (b - z m))
        - 2 * ∑ n ∈ E.erase m, 1 / (b - z n) := by
      rw [hvb, ← Finset.add_sum_erase E (fun n => 1 / (b - z n)) hm]; ring
    have hcross : ∑ n ∈ E.erase m, (-2 * (1 / ((a - z m) * (b - z m)))
          * (1 / ((a - z n) * (b - z n))) * ((a - z n) + (b - z n)) / (z m - z n))
        = -2 * (1 / ((a - z m) * (b - z m))) *
          (((∑ n ∈ E.erase m, 1 / (z m - z n)) - (∑ n ∈ E.erase m, 1 / (a - z n))) / (a - z m)
           + ((∑ n ∈ E.erase m, 1 / (z m - z n)) - (∑ n ∈ E.erase m, 1 / (b - z n)))
              / (b - z m)) := by
      rw [← Finset.sum_sub_distrib, ← Finset.sum_sub_distrib, Finset.sum_div, Finset.sum_div,
        ← Finset.sum_add_distrib, Finset.mul_sum]
      refine Finset.sum_congr rfl fun n hn => ?_
      have hnE : n ∈ E := Finset.mem_of_mem_erase hn
      have h3 := hu n hnE
      have h4 := hw n hnE
      have h5 : z m - z n ≠ 0 := hz m hm n hnE (Ne.symm (Finset.ne_of_mem_erase hn))
      field_simp
      ring
    rw [hcross, hva', hvb', hvz m hm]
    set P := ∑ n ∈ E.erase m, 1 / (a - z n)
    set Q := ∑ n ∈ E.erase m, 1 / (b - z n)
    set Z := ∑ n ∈ E.erase m, 1 / (z m - z n)
    field_simp
    ring
  -- the pair parts cancel down to the square of the envelope
  have hcross := pair_cancel E
    (fun m n => -2 * (1 / ((a - z m) * (b - z m))) * (1 / ((a - z n) * (b - z n)))
      * ((a - z n) + (b - z n)) / (z m - z n))
    (fun m => 1 / ((a - z m) * (b - z m)))
    (by
      intro m hm n hn hmn
      have h1 := hu m hm
      have h2 := hw m hm
      have h3 := hu n hn
      have h4 := hw n hn
      have h5 : z m - z n ≠ 0 := hz m hm n hn hmn
      have h6 : z n - z m ≠ 0 := hz n hn m hm (Ne.symm hmn)
      field_simp
      ring)
  have hsum : ∑ m ∈ E, (-((va - vz m) / (a - z m) + (vb - vz m) / (b - z m))
        * (1 / ((a - z m) * (b - z m))))
      = 10 * (∑ m ∈ E, (1 / ((a - z m) * (b - z m))) ^ 2)
        + 4 * (b - a) ^ 2 * (∑ m ∈ E, (1 / ((a - z m) * (b - z m))) ^ 3)
        + (-2 * (∑ m ∈ E, 1 / ((a - z m) * (b - z m))) ^ 2
            + 2 * ∑ m ∈ E, (1 / ((a - z m) * (b - z m))) ^ 2) := by
    rw [Finset.sum_congr rfl hTdot, Finset.sum_add_distrib, Finset.sum_add_distrib,
      ← Finset.mul_sum, ← Finset.mul_sum, hcross]
  rw [hsum, hgap]
  field_simp
  ring

/-! ### Splitting the CM velocity into the tracked pair and the environment -/

lemma erase_k_eq {N k : ℕ} (hk : k + 1 < N) :
    (Finset.range N).erase k = insert (k + 1) (envIdx N k) := by
  ext j
  simp [envIdx, Finset.mem_erase, Finset.mem_range]
  omega

lemma erase_k1_eq {N k : ℕ} (hk : k + 1 < N) :
    (Finset.range N).erase (k + 1) = insert k (envIdx N k) := by
  ext j
  simp [envIdx, Finset.mem_erase, Finset.mem_range]
  omega

lemma erase_m_eq {N k m : ℕ} (hk : k + 1 < N) (hm : m ∈ envIdx N k) :
    (Finset.range N).erase m = insert k (insert (k + 1) ((envIdx N k).erase m)) := by
  rw [mem_envIdx_iff] at hm
  ext j
  simp [envIdx, Finset.mem_erase, Finset.mem_range]
  omega

lemma vel_k_eq {N : ℕ} {y : ℕ → ℝ} {k : ℕ} (hk : k + 1 < N) :
    vel N y k = -2 * (1 / (y k - y (k + 1))) - 2 * ∑ m ∈ envIdx N k, 1 / (y k - y m) := by
  rw [vel, erase_k_eq hk, Finset.sum_insert (by simp [mem_envIdx_iff])]
  ring

lemma vel_k1_eq {N : ℕ} {y : ℕ → ℝ} {k : ℕ} (hk : k + 1 < N) :
    vel N y (k + 1) = -2 * (1 / (y (k + 1) - y k))
      - 2 * ∑ m ∈ envIdx N k, 1 / (y (k + 1) - y m) := by
  rw [vel, erase_k1_eq hk, Finset.sum_insert (by simp [mem_envIdx_iff])]
  ring

lemma vel_env_eq {N : ℕ} {y : ℕ → ℝ} {k m : ℕ} (hk : k + 1 < N) (hm : m ∈ envIdx N k) :
    vel N y m = -2 * (1 / (y m - y k)) - 2 * (1 / (y m - y (k + 1)))
      - 2 * ∑ n ∈ (envIdx N k).erase m, 1 / (y m - y n) := by
  have h1 : k ∉ insert (k + 1) ((envIdx N k).erase m) := by simp [mem_envIdx_iff]
  have h2 : (k + 1) ∉ (envIdx N k).erase m := by simp [mem_envIdx_iff]
  rw [vel, erase_m_eq hk hm, Finset.sum_insert h1, Finset.sum_insert h2]
  ring

/-- Distinct particles of an ordered configuration occupy distinct positions. -/
lemma pos_ne {N : ℕ} {y : ℕ → ℝ} {m n : ℕ} (hord : Ordered N y) (hm : m < N) (hn : n < N)
    (hmn : m ≠ n) : y m - y n ≠ 0 := by
  rcases lt_or_gt_of_ne hmn with h | h
  · have := hord m n h hn; intro hc; linarith [sub_eq_zero.mp hc]
  · have := hord n m h hm; intro hc; linarith [sub_eq_zero.mp hc]

/-- The pointwise form of the derivative identity for an ordered configuration. -/
lemma theta_dot_identity {N : ℕ} {y : ℕ → ℝ} {k : ℕ} (hord : Ordered N y) (hk : k + 1 < N) :
    gapv y k * (vel N y (k + 1) - vel N y k) * envE N y k
        + (gapv y k) ^ 2 / 2 * ∑ m ∈ envIdx N k, Tdotv N y k m
      = ThetaDot N y k := by
  have hab : y k - y (k + 1) ≠ 0 := pos_ne hord (by omega) hk (by omega)
  have hu : ∀ m ∈ envIdx N k, y k - y m ≠ 0 := fun m hm =>
    pos_ne hord (by omega) (mem_envIdx_iff.mp hm).1 (Ne.symm (mem_envIdx_iff.mp hm).2.1)
  have hw : ∀ m ∈ envIdx N k, y (k + 1) - y m ≠ 0 := fun m hm =>
    pos_ne hord hk (mem_envIdx_iff.mp hm).1 (Ne.symm (mem_envIdx_iff.mp hm).2.2)
  have hz : ∀ m ∈ envIdx N k, ∀ n ∈ envIdx N k, m ≠ n → y m - y n ≠ 0 := fun m hm n hn hmn =>
    pos_ne hord (mem_envIdx_iff.mp hm).1 (mem_envIdx_iff.mp hn).1 hmn
  have key := theta_deriv_algebra (envIdx N k) (y k) (y (k + 1)) y (vel N y k) (vel N y (k + 1))
    (fun m => vel N y m) hab hu hw hz (vel_k_eq hk) (vel_k1_eq hk)
    (fun m hm => vel_env_eq hk hm)
  have hg : gapv y k ≠ 0 := ne_of_gt (gapv_pos hord hk)
  have hTheta : -(4 * Thetav N y k * (2 - Thetav N y k)) / (gapv y k) ^ 2
      = -4 * envE N y k + (gapv y k) ^ 2 * (envE N y k) ^ 2 := by
    rw [Thetav]
    field_simp
    ring
  rw [ThetaDot, hTheta]
  simp only [envE, Tv, Tdotv, gapv] at key ⊢
  exact key

/-- **Lemma 2**: the exact `Θ`-derivative along the attractive CM flow. -/
theorem lemma2 {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} {k : ℕ} (hf : IsCMFlow N tc x)
    (hk : k + 1 < N) {s : ℝ} (hs : s ∈ Set.Ico (0 : ℝ) tc) :
    HasDerivAt (fun t => Thetav N (cfg x t) k) (ThetaDot N (cfg x s) k) s := by
  have hord := hf.ordered s hs
  have hkN : k < N := by omega
  have hgap : HasDerivAt (fun t => gapv (cfg x t) k)
      (vel N (cfg x s) (k + 1) - vel N (cfg x s) k) s :=
    (hf.hasDeriv s hs (k + 1) hk).sub (hf.hasDeriv s hs k hkN)
  have hT : ∀ m ∈ envIdx N k,
      HasDerivAt (fun t => Tv (cfg x t) k m) (Tdotv N (cfg x s) k m) s := by
    intro m hm
    have hmN := (mem_envIdx_iff.mp hm).1
    have hune : cfg x s k - cfg x s m ≠ 0 :=
      pos_ne hord hkN hmN (Ne.symm (mem_envIdx_iff.mp hm).2.1)
    have hwne : cfg x s (k + 1) - cfg x s m ≠ 0 :=
      pos_ne hord hk hmN (Ne.symm (mem_envIdx_iff.mp hm).2.2)
    have h1 : HasDerivAt (fun t => x k t - x m t)
        (vel N (cfg x s) k - vel N (cfg x s) m) s :=
      (hf.hasDeriv s hs k hkN).sub (hf.hasDeriv s hs m hmN)
    have h2 : HasDerivAt (fun t => x (k + 1) t - x m t)
        (vel N (cfg x s) (k + 1) - vel N (cfg x s) m) s :=
      (hf.hasDeriv s hs (k + 1) hk).sub (hf.hasDeriv s hs m hmN)
    have hinv := (h1.mul h2).inv (mul_ne_zero hune hwne)
    rw [show (fun t => Tv (cfg x t) k m)
        = (fun t => ((x k t - x m t) * (x (k + 1) t - x m t))⁻¹) by
      funext t; rw [Tv, one_div]; rfl]
    convert hinv using 1
    rw [Tdotv, Tv]
    have hu' : cfg x s k - cfg x s m ≠ 0 := hune
    have hw' : cfg x s (k + 1) - cfg x s m ≠ 0 := hwne
    show _ = -((vel N (cfg x s) k - vel N (cfg x s) m) * (cfg x s (k + 1) - cfg x s m)
        + (cfg x s k - cfg x s m) * (vel N (cfg x s) (k + 1) - vel N (cfg x s) m))
      / ((cfg x s k - cfg x s m) * (cfg x s (k + 1) - cfg x s m)) ^ 2
    field_simp
  have hE : HasDerivAt (fun t => envE N (cfg x t) k)
      (∑ m ∈ envIdx N k, Tdotv N (cfg x s) k m) s := by
    rw [show (fun t => envE N (cfg x t) k) = (fun t => ∑ m ∈ envIdx N k, Tv (cfg x t) k m) by
      funext t; rw [envE]]
    exact HasDerivAt.fun_sum hT
  have hsq : HasDerivAt (fun t => (gapv (cfg x t) k) ^ 2)
      (2 * gapv (cfg x s) k * (vel N (cfg x s) (k + 1) - vel N (cfg x s) k)) s := by
    have := hgap.pow 2
    convert this using 1
    ring
  have hfin := (hsq.mul hE).div_const 2
  rw [show (fun t => Thetav N (cfg x t) k)
      = (fun t => (gapv (cfg x t) k) ^ 2 * envE N (cfg x t) k / 2) by funext t; rw [Thetav]]
  convert hfin using 1
  rw [← theta_dot_identity hord hk]
  ring

/-! ### TARGET S2: the minimal-gap cap -/

/-- In an ordered configuration whose minimal gap is realised at `k`, particles separate at
speed at least `g` per index. -/
lemma gap_telescope {N : ℕ} {y : ℕ → ℝ} {k : ℕ}
    (hmin : ∀ i, i + 1 < N → gapv y k ≤ gapv y i) :
    ∀ i j, i < j → j < N → ((j - i : ℕ) : ℝ) * gapv y k ≤ y j - y i := by
  intro i j
  induction j with
  | zero => omega
  | succ j ih =>
    intro hij hjN
    rcases Nat.lt_or_ge i j with h | h
    · have h1 := ih h (by omega)
      have h2 : gapv y k ≤ gapv y j := hmin j hjN
      have hc : ((j + 1 - i : ℕ) : ℝ) = ((j - i : ℕ) : ℝ) + 1 := by
        have hji : j + 1 - i = (j - i) + 1 := by omega
        rw [hji]; push_cast; ring
      rw [hc]
      have hgj : gapv y j = y (j + 1) - y j := rfl
      linarith
    · have hij' : i = j := by omega
      subst hij'
      have h2 : gapv y k ≤ gapv y i := hmin i hjN
      have hc : ((i + 1 - i : ℕ) : ℝ) = 1 := by
        have hii : i + 1 - i = 1 := by omega
        rw [hii]; norm_num
      rw [hc]
      have hgi : gapv y i = y (i + 1) - y i := rfl
      linarith

/-- **TARGET S2** (cap from the minimal-gap hypothesis).  If the tracked pair `(k, k+1)`
realises the global minimal gap `g`, then every environment weight satisfies
`μ_m = g² T_m ≤ 1/2`. -/
theorem cap_of_minimal_gap {N : ℕ} {y : ℕ → ℝ} {k m : ℕ} (hord : Ordered N y) (hk : k + 1 < N)
    (hmin : ∀ i, i + 1 < N → gapv y k ≤ gapv y i) (hm : m ∈ envIdx N k) :
    (gapv y k) ^ 2 * Tv y k m ≤ 1 / 2 := by
  have hg : 0 < gapv y k := gapv_pos hord hk
  have htel := gap_telescope (N := N) (y := y) (k := k) hmin
  rw [mem_envIdx_iff] at hm
  obtain ⟨hmN, hmk, hmk1⟩ := hm
  have key : 2 * (gapv y k) ^ 2 ≤ (y k - y m) * (y (k + 1) - y m) := by
    rcases lt_or_gt_of_ne hmk with h | h
    · have h1 := htel m k h (by omega)
      have h2 := htel m (k + 1) (by omega) hk
      have c1 : (1 : ℝ) ≤ ((k - m : ℕ) : ℝ) := by
        have hc : 1 ≤ k - m := by omega
        exact_mod_cast Nat.one_le_cast.mpr hc
      have c2 : (2 : ℝ) ≤ ((k + 1 - m : ℕ) : ℝ) := by
        have hc : 2 ≤ k + 1 - m := by omega
        exact_mod_cast Nat.ofNat_le_cast.mpr hc
      have hA : gapv y k ≤ y k - y m := by nlinarith
      have hB : 2 * gapv y k ≤ y (k + 1) - y m := by nlinarith
      nlinarith [mul_le_mul hA hB (by linarith : (0:ℝ) ≤ 2 * gapv y k)
        (by linarith : (0:ℝ) ≤ y k - y m)]
    · have h1 := htel k m h hmN
      have h2 := htel (k + 1) m (by omega) hmN
      have c1 : (2 : ℝ) ≤ ((m - k : ℕ) : ℝ) := by
        have hc : 2 ≤ m - k := by omega
        exact_mod_cast Nat.ofNat_le_cast.mpr hc
      have c2 : (1 : ℝ) ≤ ((m - (k + 1) : ℕ) : ℝ) := by
        have hc : 1 ≤ m - (k + 1) := by omega
        exact_mod_cast Nat.one_le_cast.mpr hc
      have hA : 2 * gapv y k ≤ y m - y k := by nlinarith
      have hB : gapv y k ≤ y m - y (k + 1) := by nlinarith
      nlinarith [mul_le_mul hA hB (by linarith : (0:ℝ) ≤ gapv y k)
        (by linarith : (0:ℝ) ≤ y m - y k)]
  have hD : 0 < (y k - y m) * (y (k + 1) - y m) := by nlinarith
  rw [Tv, mul_one_div, div_le_iff₀ hD]
  nlinarith [key]

end ThetaTrap
