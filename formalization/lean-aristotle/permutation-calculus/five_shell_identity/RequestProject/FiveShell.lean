import Mathlib

/-!
# The exact five-shell identity for the `P97` cocycle

Formalization of `job12_five_shell_identity.tex`.

We work with finite coefficient vectors: `V = (ℕ → ℂ)`, of which only the values on
`{1, …, N}` are ever used (through the evaluation functional `L N` and the inner
product `ip N`).  For a prime `p`, the projection `Proj p` kills the modes divisible
by `p`.  `R97` is the product of `Proj p` over the 25 primes `p ≤ 97`, the cuts
`(0,5,10,17,25)` split those primes into four blocks, `grp g` is the group projection
of block `g`, and `Y`, `Z` are the live/killed shells.

Main results:
* `Proj_comm`, `Proj_idem`, `Proj_selfadjoint`, `grp_idem`, `grp_comm`,
  `grp_selfadjoint`, `grp_comp_eq_R97` (Lemma 1);
* `shell_step`, `telescope`, `Y_four_eq_R97` (Lemma 2);
* `ip_Z_Z`, `ip_Z_Y4` (Lemma 3);
* `five_shell_identity` (Theorem 4, the boxed identity).
-/

namespace P97

open Finset
open scoped Classical

/-- Coefficient vectors.  Only the values on `{1, …, N}` are used. -/
abbrev V := ℕ → ℂ

/-- `Proj p` retains precisely the modes not divisible by `p`. -/
def Proj (p : ℕ) (c : V) : V := fun n => if p ∣ n then 0 else c n

/-- The product of the projections `Proj p` for `p` in the list `l`. -/
def projList (l : List ℕ) (c : V) : V := l.foldr Proj c

/-- The 25 primes `≤ 97`, in decreasing order. -/
def primesLE97 : List ℕ :=
  [97, 89, 83, 79, 73, 71, 67, 61, 59, 53, 47, 43, 41, 37, 31, 29, 23, 19, 17, 13, 11, 7, 5, 3, 2]

/-- `R97 = ∏_{p ≤ 97} Π_p`: the diagonal projection onto the integers coprime to
every prime `p ≤ 97`. -/
def R97 : V → V := projList primesLE97

/-- The cuts `(b₀, b₁, b₂, b₃, b₄) = (0, 5, 10, 17, 25)` of the paper. -/
def cut : ℕ → ℕ
  | 0 => 0
  | 1 => 5
  | 2 => 10
  | 3 => 17
  | _ => 25

/-- The group projection `𝓡_g = ∏_{b_{g-1} < j ≤ b_g} Π_{p_j}`. -/
def grp (g : ℕ) : V → V := projList ((primesLE97.take (cut g)).drop (cut (g - 1)))

/-- The live shells `Y_g = 𝓡_g Y_{g-1}`, with `Y₀ = c`. -/
def Y (c : V) : ℕ → V
  | 0 => c
  | g + 1 => grp (g + 1) (Y c g)

/-- The killed shells `Z_g = (I - 𝓡_g) Y_{g-1}`. -/
def Z (c : V) (g : ℕ) : V := Y c (g - 1) - grp g (Y c (g - 1))

/-- Evaluation of the kernel at `θ = 0`: `L(c) = ∑_{n=1}^N c(n)`. -/
noncomputable def L (N : ℕ) (c : V) : ℂ := ∑ n ∈ Finset.Icc 1 N, c n

/-- The inner product `⟨c, d⟩ = ∑_{n=1}^{N} c(n) conj (d(n))`. -/
noncomputable def ip (N : ℕ) (c d : V) : ℂ :=
  ∑ n ∈ Finset.Icc 1 N, c n * (starRingEnd ℂ) (d n)

/-- The residual cocycle `E₉₇ = L(M_A c)` with `M_A = R₉₇ - A₉₇ I`. -/
noncomputable def E97 (N : ℕ) (A : ℂ) (c : V) : ℂ := L N (R97 c - A • c)

/-! ## Basic description of the projections -/

@[simp] lemma Proj_apply (p : ℕ) (c : V) (n : ℕ) :
    Proj p c n = if p ∣ n then 0 else c n := rfl

lemma projList_apply (l : List ℕ) (c : V) (n : ℕ) :
    projList l c n = if ∃ p ∈ l, p ∣ n then 0 else c n := by
  induction l with
  | nil => simp [projList]
  | cons a l ih =>
      have h : projList (a :: l) c n = Proj a (projList l c) n := rfl
      rw [h, Proj_apply, ih]
      by_cases ha : a ∣ n
      · simp [ha]
      · by_cases hl : ∃ p ∈ l, p ∣ n
        · obtain ⟨p, hp, hpn⟩ := hl
          simp only [ha, if_false]
          rw [if_pos ⟨p, hp, hpn⟩, if_pos ⟨p, List.mem_cons_of_mem _ hp, hpn⟩]
        · rw [if_neg ha, if_neg hl, if_neg]
          rintro ⟨p, hp, hpn⟩
          rcases List.mem_cons.1 hp with rfl | hp
          · exact ha hpn
          · exact hl ⟨p, hp, hpn⟩

lemma R97_apply (c : V) (n : ℕ) :
    R97 c n = if ∃ p ∈ primesLE97, p ∣ n then 0 else c n := projList_apply _ _ _

/-- `primesLE97` really is the list of all primes `≤ 97`. -/
lemma mem_primesLE97_iff (p : ℕ) : p ∈ primesLE97 ↔ p.Prime ∧ p ≤ 97 := by
  constructor
  · intro hp
    fin_cases hp <;> exact ⟨by norm_num, by norm_num⟩
  · rintro ⟨hp, h97⟩
    interval_cases p <;> revert hp <;> decide

/-- `R97` is the diagonal projection onto the integers coprime to every prime `p ≤ 97`. -/
lemma R97_apply' (c : V) (n : ℕ) :
    R97 c n = if ∀ p : ℕ, p.Prime → p ≤ 97 → ¬ p ∣ n then c n else 0 := by
  rw [R97_apply]
  by_cases h : ∃ p ∈ primesLE97, p ∣ n
  · obtain ⟨p, hp, hpn⟩ := h
    rw [if_pos ⟨p, hp, hpn⟩, if_neg]
    intro hall
    exact hall p ((mem_primesLE97_iff p).1 hp).1 ((mem_primesLE97_iff p).1 hp).2 hpn
  · rw [if_neg h, if_pos]
    intro p hp h97 hpn
    exact h ⟨p, (mem_primesLE97_iff p).2 ⟨hp, h97⟩, hpn⟩

/-! ## Lemma 1: projection algebra -/

lemma Proj_add (p : ℕ) (c d : V) : Proj p (c + d) = Proj p c + Proj p d := by
  funext n; by_cases h : p ∣ n <;> simp [Proj, h]

lemma Proj_smul (p : ℕ) (a : ℂ) (c : V) : Proj p (a • c) = a • Proj p c := by
  funext n; by_cases h : p ∣ n <;> simp [Proj, h]

lemma Proj_comm (p q : ℕ) (c : V) : Proj p (Proj q c) = Proj q (Proj p c) := by
  funext n; by_cases hp : p ∣ n <;> by_cases hq : q ∣ n <;> simp [Proj, hp, hq]

lemma Proj_idem (p : ℕ) (c : V) : Proj p (Proj p c) = Proj p c := by
  funext n; by_cases hp : p ∣ n <;> simp [Proj, hp]

lemma Proj_selfadjoint (N p : ℕ) (c d : V) : ip N (Proj p c) d = ip N c (Proj p d) := by
  unfold ip
  refine Finset.sum_congr rfl fun n _ => ?_
  by_cases hp : p ∣ n <;> simp [Proj, hp]

lemma projList_add (l : List ℕ) (c d : V) :
    projList l (c + d) = projList l c + projList l d := by
  induction l with
  | nil => rfl
  | cons a l ih => show Proj a (projList l (c + d)) = _; rw [ih, Proj_add]; rfl

lemma projList_smul (l : List ℕ) (a : ℂ) (c : V) :
    projList l (a • c) = a • projList l c := by
  induction l with
  | nil => rfl
  | cons b l ih => show Proj b (projList l (a • c)) = _; rw [ih, Proj_smul]; rfl

lemma projList_idem (l : List ℕ) (c : V) : projList l (projList l c) = projList l c := by
  funext n
  simp only [projList_apply]
  by_cases h : ∃ p ∈ l, p ∣ n <;> simp [h]

lemma projList_comm (l m : List ℕ) (c : V) :
    projList l (projList m c) = projList m (projList l c) := by
  funext n
  simp only [projList_apply]
  by_cases hl : ∃ p ∈ l, p ∣ n <;> by_cases hm : ∃ p ∈ m, p ∣ n <;> simp [hl, hm]

lemma projList_selfadjoint (N : ℕ) (l : List ℕ) (c d : V) :
    ip N (projList l c) d = ip N c (projList l d) := by
  unfold ip
  refine Finset.sum_congr rfl fun n _ => ?_
  simp only [projList_apply]
  by_cases h : ∃ p ∈ l, p ∣ n <;> simp [h]

lemma projList_append (l m : List ℕ) (c : V) :
    projList (l ++ m) c = projList l (projList m c) := by
  simp [projList, List.foldr_append]

/-- The order of the factors is irrelevant: a product of the projections `Proj p` depends
only on the set of primes involved (the paper's remark that all `25!` orders are
algebraically identical). -/
lemma projList_perm {l m : List ℕ} (h : l.Perm m) (c : V) : projList l c = projList m c := by
  funext n
  simp only [projList_apply, h.mem_iff]

/-- Each group projection is linear. -/
lemma grp_add (g : ℕ) (c d : V) : grp g (c + d) = grp g c + grp g d := projList_add _ _ _

lemma grp_smul (g : ℕ) (a : ℂ) (c : V) : grp g (a • c) = a • grp g c := projList_smul _ _ _

/-- Each group projection is idempotent. -/
lemma grp_idem (g : ℕ) (c : V) : grp g (grp g c) = grp g c := projList_idem _ _

/-- The group projections commute. -/
lemma grp_comm (g h : ℕ) (c : V) : grp g (grp h c) = grp h (grp g c) := projList_comm _ _ _

/-- Each group projection is self-adjoint. -/
lemma grp_selfadjoint (N g : ℕ) (c d : V) : ip N (grp g c) d = ip N c (grp g d) :=
  projList_selfadjoint _ _ _ _

/-- `𝓡₄ 𝓡₃ 𝓡₂ 𝓡₁ = R₉₇`. -/
lemma grp_comp_eq_R97 (c : V) : grp 4 (grp 3 (grp 2 (grp 1 c))) = R97 c := by
  have hperm :
      (((primesLE97.take (cut 4)).drop (cut (4 - 1))) ++
        ((primesLE97.take (cut 3)).drop (cut (3 - 1))) ++
          ((primesLE97.take (cut 2)).drop (cut (2 - 1))) ++
            ((primesLE97.take (cut 1)).drop (cut (1 - 1)))).Perm primesLE97 := by
    decide
  show projList _ (projList _ (projList _ (projList _ c))) = _
  rw [← projList_append, ← projList_append, ← projList_append, projList_perm hperm]
  rfl

/-! ## Lemma 2: exact shell telescoping -/

lemma cut_mono (g : ℕ) : cut g ≤ cut (g + 1) := by
  match g with
  | 0 => decide
  | 1 => decide
  | 2 => decide
  | 3 => decide
  | (_ + 4) => simp [cut]

lemma cut_le {a b : ℕ} (hab : a ≤ b) : cut a ≤ cut b := by
  induction b with
  | zero => simp [Nat.le_zero.1 hab]
  | succ b ih =>
      rcases Nat.eq_or_lt_of_le hab with rfl | h
      · exact le_rfl
      · exact (ih (Nat.lt_succ_iff.1 h)).trans (cut_mono b)

lemma take_cut_subset {a b : ℕ} (hab : a ≤ b) :
    primesLE97.take (cut a) ⊆ primesLE97.take (cut b) :=
  List.take_subset_take_left _ (cut_le hab)

lemma take_cut_succ (g : ℕ) :
    primesLE97.take (cut (g + 1)) =
      primesLE97.take (cut g) ++ (primesLE97.take (cut (g + 1))).drop (cut g) := by
  conv_lhs => rw [← List.take_append_drop (cut g) (primesLE97.take (cut (g + 1)))]
  congr 1
  rw [List.take_take, min_eq_left (cut_mono g)]

/-- The live shell `Y_g` kills exactly the modes divisible by one of the first `b_g` primes. -/
lemma Y_apply (c : V) (g n : ℕ) :
    Y c g n = if ∃ p ∈ primesLE97.take (cut g), p ∣ n then 0 else c n := by
  induction g with
  | zero => simp [Y, cut]
  | succ g ih =>
      show grp (g + 1) (Y c g) n = _
      have hg : grp (g + 1) = projList ((primesLE97.take (cut (g + 1))).drop (cut g)) := by
        simp [grp]
      rw [hg, projList_apply, ih]
      conv_rhs => rw [take_cut_succ g]
      by_cases h2 : ∃ p ∈ (primesLE97.take (cut (g + 1))).drop (cut g), p ∣ n
      · obtain ⟨p, hp, hpn⟩ := h2
        rw [if_pos ⟨p, hp, hpn⟩, if_pos ⟨p, by simp [hp], hpn⟩]
      · rw [if_neg h2]
        by_cases h1 : ∃ p ∈ primesLE97.take (cut g), p ∣ n
        · obtain ⟨p, hp, hpn⟩ := h1
          rw [if_pos ⟨p, hp, hpn⟩, if_pos ⟨p, by simp [hp], hpn⟩]
        · rw [if_neg h1, if_neg]
          rintro ⟨p, hp, hpn⟩
          rcases List.mem_append.1 hp with hp' | hp'
          · exact h1 ⟨p, hp', hpn⟩
          · exact h2 ⟨p, hp', hpn⟩

/-- `Y_{g-1} = Y_g + Z_g`. -/
lemma shell_step (c : V) (g : ℕ) : Y c g = Y c (g + 1) + Z c (g + 1) := by
  have h : Z c (g + 1) = Y c g - grp (g + 1) (Y c g) := rfl
  rw [h]
  show _ = grp (g + 1) (Y c g) + (Y c g - grp (g + 1) (Y c g))
  ring

/-- Exact telescoping: `Y₀ = Y₄ + ∑_{g=1}^{4} Z_g`. -/
lemma telescope (c : V) : c = Y c 4 + ∑ g ∈ Finset.Icc 1 4, Z c g := by
  have hsum : ∑ g ∈ Finset.Icc 1 4, Z c g = Z c 1 + Z c 2 + Z c 3 + Z c 4 := by
    rw [show (Finset.Icc 1 4 : Finset ℕ) = {1, 2, 3, 4} from rfl]
    norm_num [Finset.sum_insert, add_assoc]
  have e3 : Y c 4 + Z c 4 = Y c 3 := (shell_step c 3).symm
  have e2 : Y c 3 + Z c 3 = Y c 2 := (shell_step c 2).symm
  have e1 : Y c 2 + Z c 2 = Y c 1 := (shell_step c 1).symm
  have e0 : Y c 1 + Z c 1 = c := (shell_step c 0).symm
  rw [hsum]
  symm
  calc Y c 4 + (Z c 1 + Z c 2 + Z c 3 + Z c 4)
      = Y c 4 + Z c 4 + Z c 3 + Z c 2 + Z c 1 := by abel
    _ = c := by rw [e3, e2, e1, e0]

/-- `Y₄ = R₉₇ Y₀`. -/
lemma Y_four_eq_R97 (c : V) : Y c 4 = R97 c := by
  funext n
  rw [Y_apply, R97_apply]
  have h : primesLE97.take (cut 4) = primesLE97 := by simp [cut, primesLE97]
  rw [h]

/-! ## Lemma 3: disjoint supports / orthogonality -/

/-- Explicit description of a killed shell: it is supported on the modes that survive the
first `g` blocks but are killed by block `g + 1`. -/
lemma Z_apply (c : V) (g n : ℕ) :
    Z c (g + 1) n =
      if (¬ ∃ p ∈ primesLE97.take (cut g), p ∣ n) ∧
          (∃ p ∈ primesLE97.take (cut (g + 1)), p ∣ n) then c n else 0 := by
  have hZ : Z c (g + 1) n = Y c g n - Y c (g + 1) n := rfl
  rw [hZ, Y_apply, Y_apply]
  by_cases h1 : ∃ p ∈ primesLE97.take (cut g), p ∣ n
  · have h2 : ∃ p ∈ primesLE97.take (cut (g + 1)), p ∣ n := by
      obtain ⟨p, hp, hpn⟩ := h1
      exact ⟨p, take_cut_subset (Nat.le_succ g) hp, hpn⟩
    rw [if_pos h1, if_pos h2, sub_self, if_neg (fun hc => hc.1 h1)]
  · rw [if_neg h1]
    by_cases h2 : ∃ p ∈ primesLE97.take (cut (g + 1)), p ∣ n
    · rw [if_pos h2, if_pos ⟨h1, h2⟩, sub_zero]
    · rw [if_neg h2, if_neg (fun hc => h2 hc.2), sub_self]

lemma Y4_apply (c : V) (n : ℕ) :
    Y c 4 n = if ∃ p ∈ primesLE97.take (cut 4), p ∣ n then 0 else c n := Y_apply c 4 n

/-- Different killed shells have disjoint supports. -/
lemma Z_mul_Z_eq_zero (c d : V) {g h : ℕ} (hgh : g ≠ h) (n : ℕ) :
    Z c (g + 1) n * (starRingEnd ℂ) (Z d (h + 1) n) = 0 := by
  -- the shell with the smaller index is supported where the other one vanishes
  have key : ∀ (u w : V) (a b : ℕ), a + 1 ≤ b →
      Z u (a + 1) n * (starRingEnd ℂ) (Z w (b + 1) n) = 0 := by
    intro u w a b hab
    by_cases hA : (¬ ∃ p ∈ primesLE97.take (cut a), p ∣ n) ∧
        (∃ p ∈ primesLE97.take (cut (a + 1)), p ∣ n)
    · obtain ⟨p, hp, hpn⟩ := hA.2
      have hZb : Z w (b + 1) n = 0 := by
        rw [Z_apply, if_neg (fun hc => hc.1 ⟨p, take_cut_subset hab hp, hpn⟩)]
      rw [hZb]
      simp
    · have hZa : Z u (a + 1) n = 0 := by rw [Z_apply, if_neg hA]
      rw [hZa]
      simp
  rcases Nat.lt_or_ge g h with hlt | hge
  · exact key c d g h hlt
  · have hlt : h + 1 ≤ g := by omega
    have h0 := key d c h g hlt
    have := congrArg (starRingEnd ℂ) h0
    simpa [mul_comm] using this

/-- Killed shells with different indices are orthogonal. -/
lemma ip_Z_Z (N : ℕ) (c : V) {g h : ℕ} (hg : 1 ≤ g) (hh : 1 ≤ h) (hgh : g ≠ h) :
    ip N (Z c g) (Z c h) = 0 := by
  obtain ⟨g', rfl⟩ : ∃ g', g = g' + 1 := ⟨g - 1, by omega⟩
  obtain ⟨h', rfl⟩ : ∃ h', h = h' + 1 := ⟨h - 1, by omega⟩
  unfold ip
  refine Finset.sum_eq_zero fun n _ => ?_
  exact Z_mul_Z_eq_zero c c (by omega) n

/-- Each killed shell is orthogonal to the live shell `Y₄`. -/
lemma ip_Z_Y4 (N : ℕ) (c : V) {g : ℕ} (hg : 1 ≤ g) (hg4 : g ≤ 4) :
    ip N (Z c g) (Y c 4) = 0 := by
  obtain ⟨g', rfl⟩ : ∃ g', g = g' + 1 := ⟨g - 1, by omega⟩
  unfold ip
  refine Finset.sum_eq_zero fun n _ => ?_
  by_cases hA : (¬ ∃ p ∈ primesLE97.take (cut g'), p ∣ n) ∧
      (∃ p ∈ primesLE97.take (cut (g' + 1)), p ∣ n)
  · obtain ⟨p, hp, hpn⟩ := hA.2
    have hY : Y c 4 n = 0 := by
      rw [Y4_apply, if_pos ⟨p, take_cut_subset (show g' + 1 ≤ 4 by omega) hp, hpn⟩]
    rw [hY]
    simp
  · have hZ : Z c (g' + 1) n = 0 := by rw [Z_apply, if_neg hA]
    rw [hZ]
    simp

/-! ## Theorem 4: the exact five-shell identity -/

lemma L_add (N : ℕ) (c d : V) : L N (c + d) = L N c + L N d := by
  simp [L, Finset.sum_add_distrib]

lemma L_smul (N : ℕ) (a : ℂ) (c : V) : L N (a • c) = a * L N c := by
  simp [L, Finset.mul_sum]

lemma L_sum (N : ℕ) (s : Finset ℕ) (f : ℕ → V) :
    L N (∑ g ∈ s, f g) = ∑ g ∈ s, L N (f g) := by
  classical
  induction s using Finset.induction with
  | empty => simp [L]
  | insert a s ha ih => rw [Finset.sum_insert ha, L_add, ih, Finset.sum_insert ha]

/-- **Theorem 4 (exact five-shell identity, paper eq. (12)).**
`E₉₇ = (1 - A₉₇) Y₄(0) - A₉₇ ∑_{g=1}^{4} Z_g(0)`. -/
theorem five_shell_identity (N : ℕ) (A : ℂ) (c : V) :
    E97 N A c = (1 - A) * L N (Y c 4) - A * ∑ g ∈ Finset.Icc 1 4, L N (Z c g) := by
  have hR : L N (R97 c) = L N (Y c 4) := by rw [Y_four_eq_R97]
  have hc : L N c = L N (Y c 4) + ∑ g ∈ Finset.Icc 1 4, L N (Z c g) := by
    conv_lhs => rw [telescope c]
    rw [L_add, L_sum]
  have hsub : L N (R97 c - A • c) = L N (R97 c) - A * L N c := by
    have h : R97 c - A • c = R97 c + (-A) • c := by
      funext n; simp [sub_eq_add_neg]
    rw [h, L_add, L_smul]
    ring
  rw [E97, hsub, hR, hc]
  ring

end P97
