import Route41ArbReplay.LegE_cT200N240Full
import Mathlib.Analysis.Complex.ExponentialBounds
import Mathlib.Analysis.Real.Pi.Bounds
import Mathlib.Analysis.SpecificLimits.Basic

/-!
# ARB-LEGE leg (D) arithmetic for (T, N) = (200, 240), Lean-checked

The writeup bounds the Galerkin tail by the Hilbert-Schmidt estimate (paper-level, NOT formalized here)

  ||K Q_N||^2 ≤ (2 Φ^2 / π) ∑_{n ≥ N} (a T)^{2n+1} / ((2n+1)!!)^2,   a = (ln 3)/2,  Φ = sup_[0,T] |w - m_T|.

This file proves in Lean that the right-hand side is ≤ (10^-30)^2 for T = 200, N = 240 and every
Φ ∈ [0, 8.8381] (Arb: Φ ≤ 8.838065298), using only Mathlib facts (log 2 < 0.6931471808, log x ≤ x - 1,
3 < π, geometric series), and then feeds it into the N = 240 assembly, so the tail hypothesis becomes
"KQ^2 ≤ HS sum" (paper) + "Φ ≤ 8.8381" (Arb) instead of a trusted number.
-/

open Real

namespace ArbReplay

/-- `dfact m = (2m+1)!!` -/
def dfact : ℕ → ℕ
  | 0 => 1
  | m + 1 => (2 * m + 3) * dfact m

theorem dfact_pos (m : ℕ) : 0 < dfact m := by
  induction m with
  | zero => simp [dfact]
  | succ m ih => simp only [dfact]; positivity

/-- the n-th Hilbert-Schmidt tail term `x^(2n+1) / ((2n+1)!!)^2` -/
noncomputable def hsTerm (x : ℝ) (n : ℕ) : ℝ := x ^ (2 * n + 1) / ((dfact n : ℝ) ^ 2)

theorem hsTerm_nonneg {x : ℝ} (hx : 0 ≤ x) (n : ℕ) : 0 ≤ hsTerm x n := by
  unfold hsTerm; positivity

theorem hsTerm_succ (x : ℝ) (n : ℕ) :
    hsTerm x (n + 1) = hsTerm x n * (x ^ 2 / ((2 * n + 3 : ℝ) ^ 2)) := by
  unfold hsTerm
  simp only [dfact]
  push_cast
  have h1 : (dfact n : ℝ) ≠ 0 := by exact_mod_cast (dfact_pos n).ne'
  have h2 : (2 * (n : ℝ) + 3) ≠ 0 := by positivity
  have e : 2 * (n + 1) + 1 = (2 * n + 1) + 2 := by ring
  rw [e, pow_add]
  field_simp

theorem hsTerm_geom {x r : ℝ} (hx : 0 ≤ x) (N : ℕ) (hr : x ^ 2 / ((2 * N + 3 : ℝ) ^ 2) ≤ r) :
    ∀ k, hsTerm x (N + k) ≤ hsTerm x N * r ^ k := by
  intro k
  induction k with
  | zero => simp
  | succ k ih =>
    rw [← add_assoc, hsTerm_succ]
    have hq : x ^ 2 / ((2 * ((N + k : ℕ) : ℝ) + 3) ^ 2) ≤ r := by
      refine le_trans ?_ hr
      apply div_le_div_of_nonneg_left (sq_nonneg x) (by positivity)
      push_cast
      have : (0 : ℝ) ≤ k := Nat.cast_nonneg k
      have : (0 : ℝ) ≤ N := Nat.cast_nonneg N
      nlinarith
    have h0 := hsTerm_nonneg hx (N + k)
    have hq0 : 0 ≤ x ^ 2 / ((2 * ((N + k : ℕ) : ℝ) + 3) ^ 2) := by positivity
    calc hsTerm x (N + k) * (x ^ 2 / ((2 * ((N + k : ℕ) : ℝ) + 3) ^ 2))
        ≤ hsTerm x (N + k) * r := mul_le_mul_of_nonneg_left hq h0
      _ ≤ (hsTerm x N * r ^ k) * r := mul_le_mul_of_nonneg_right ih (le_trans hq0 hq)
      _ = hsTerm x N * r ^ (k + 1) := by ring

theorem hs_tail_le {x r : ℝ} (hx : 0 ≤ x) (N : ℕ) (hr : x ^ 2 / ((2 * N + 3 : ℝ) ^ 2) ≤ r)
    (hr0 : 0 ≤ r) (hr1 : r < 1) :
    ∑' k, hsTerm x (N + k) ≤ hsTerm x N / (1 - r) := by
  have hg : Summable (fun k : ℕ => hsTerm x N * r ^ k) :=
    (summable_geometric_of_lt_one hr0 hr1).mul_left _
  have hf : Summable (fun k : ℕ => hsTerm x (N + k)) :=
    Summable.of_nonneg_of_le (fun k => hsTerm_nonneg hx _) (hsTerm_geom hx N hr) hg
  calc ∑' k, hsTerm x (N + k) ≤ ∑' k, hsTerm x N * r ^ k :=
        Summable.tsum_le_tsum (hsTerm_geom hx N hr) hf hg
    _ = hsTerm x N * (1 - r)⁻¹ := by rw [tsum_mul_left, tsum_geometric_of_lt_one hr0 hr1]
    _ = hsTerm x N / (1 - r) := by rw [div_eq_mul_inv]

theorem hsTerm_mono {x y : ℝ} (hx : 0 ≤ x) (hxy : x ≤ y) (n : ℕ) : hsTerm x n ≤ hsTerm y n := by
  unfold hsTerm
  apply div_le_div_of_nonneg_right (pow_le_pow_left₀ hx hxy _) (by positivity)

theorem log3_half_le : Real.log 3 / 2 ≤ 5966 / 10000 := by
  have h2 := Real.log_two_lt_d9
  have h32 : Real.log (3 / 2) ≤ 3 / 2 - 1 := Real.log_le_sub_one_of_pos (by norm_num)
  have hsplit : Real.log 3 = Real.log 2 + Real.log (3 / 2) := by
    rw [← Real.log_mul (by norm_num) (by norm_num)]; norm_num
  rw [hsplit]; norm_num at h2 h32 ⊢; linarith

theorem log3_pos : 0 < Real.log 3 := Real.log_pos (by norm_num)

/-- exact rational comparison helper -/
theorem nat_ratio_le (a b c d : ℕ) (hb : 0 < b) (hd : 0 < d) (h : a * d ≤ c * b) :
    (a : ℝ) / b ≤ c / d := by
  rw [div_le_div_iff₀ (by exact_mod_cast hb) (by exact_mod_cast hd)]
  exact_mod_cast h

/-- `(119.32)^481 / (481!!)^2 ≤ 10^-80`, by one exact natural-number comparison (`decide +kernel`). -/
theorem hsTerm_240_val : hsTerm (11932 / 100) 240 ≤ 1 / 10 ^ 80 := by
  have e : hsTerm (11932 / 100) 240
      = ((2983 ^ 481 : ℕ) : ℝ) / ((25 ^ 481 * dfact 240 ^ 2 : ℕ) : ℝ) := by
    unfold hsTerm
    have : 2 * 240 + 1 = 481 := rfl
    rw [this]; push_cast
    rw [show (11932 / 100 : ℝ) = 2983 / 25 by norm_num, div_pow, div_div]
  have e2 : (1 / 10 ^ 80 : ℝ) = ((1 : ℕ) : ℝ) / ((10 ^ 80 : ℕ) : ℝ) := by push_cast; ring
  rw [e, e2]
  apply nat_ratio_le _ _ _ _ (by have := dfact_pos 240; positivity) (by positivity)
  decide +kernel

/-- **leg (D) arithmetic, T = 200, N = 240** -/
theorem hsTail_T200N240 (Φ : ℝ) (hΦ0 : 0 ≤ Φ) (hΦ : Φ ≤ 88381 / 10000) :
    2 * Φ ^ 2 / π * ∑' k, hsTerm (Real.log 3 / 2 * 200) (240 + k) ≤ (1 / 10 ^ 30) ^ 2 := by
  set x := Real.log 3 / 2 * 200 with hxdef
  have hx0 : 0 ≤ x := by have := log3_pos; positivity
  have hx1 : x ≤ 11932 / 100 := by have := log3_half_le; rw [hxdef]; linarith
  have hr : x ^ 2 / ((2 * ((240 : ℕ) : ℝ) + 3) ^ 2) ≤ 7 / 100 := by
    rw [div_le_iff₀ (by positivity)]
    have : x ^ 2 ≤ (11932 / 100) ^ 2 := pow_le_pow_left₀ hx0 hx1 2
    push_cast; nlinarith
  have hS := hs_tail_le hx0 240 hr (by norm_num) (by norm_num)
  have hT : hsTerm x 240 ≤ hsTerm (11932 / 100) 240 := hsTerm_mono hx0 hx1 240
  have hval : hsTerm (11932 / 100) 240 ≤ 1 / 10 ^ 80 := hsTerm_240_val
  have hsum : ∑' k, hsTerm x (240 + k) ≤ (1 / 10 ^ 80) / (1 - 7 / 100) := by
    refine hS.trans ?_
    apply div_le_div_of_nonneg_right (hT.trans hval) (by norm_num)
  have hsum0 : 0 ≤ ∑' k, hsTerm x (240 + k) := tsum_nonneg (fun k => hsTerm_nonneg hx0 _)
  have hpi : 3 < π := Real.pi_gt_three
  have hc : 2 * Φ ^ 2 / π ≤ 2 * (88381 / 10000) ^ 2 / 3 := by
    rw [div_le_div_iff₀ (by linarith) (by norm_num)]
    have : Φ ^ 2 ≤ (88381 / 10000) ^ 2 := pow_le_pow_left₀ hΦ0 hΦ 2
    nlinarith [sq_nonneg Φ]
  have hc0 : 0 ≤ 2 * Φ ^ 2 / π := by positivity
  calc 2 * Φ ^ 2 / π * ∑' k, hsTerm x (240 + k)
      ≤ (2 * (88381 / 10000) ^ 2 / 3) * ((1 / 10 ^ 80) / (1 - 7 / 100)) :=
        mul_le_mul hc hsum hsum0 (by norm_num)
    _ ≤ (1 / 10 ^ 30) ^ 2 := by norm_num

/-- **ARB-LEGE (T=200, N=240) with the tail leg's arithmetic Lean-checked.**  Compared with
`arbLege_cT200N240Full_assembly`, the trusted hypothesis `KQ ≤ 10^-30` is replaced by the paper-level
Hilbert-Schmidt inequality `KQ^2 ≤ (2Φ^2/π) ∑_{n≥240} (aT)^{2n+1}/((2n+1)!!)^2` (a = ln3/2, T = 200)
and the Arb bound `Φ ≤ 8.8381`. -/
theorem arbLege_cT200N240Full_withTail
    (Ae Ao : ℕ → ℕ → ℝ) (ce co : ℕ → ℝ)
    (hAe : ∀ i < 120, ∀ j < 120, |Ae i j - (cT200N240FullEven.Aat i j : ℝ) / 2 ^ 60| ≤ (cT200N240FullEven_rhoA : ℝ))
    (hce : ∀ i < 120, |ce i - (cT200N240FullEven.cat i : ℝ) / 2 ^ 60| ≤ (cT200N240FullEven_rhoc : ℝ))
    (hAo : ∀ i < 120, ∀ j < 120, |Ao i j - (cT200N240FullOdd.Aat i j : ℝ) / 2 ^ 60| ≤ (cT200N240FullOdd_rhoA : ℝ))
    (hco : ∀ i < 120, |co i - (cT200N240FullOdd.cat i : ℝ) / 2 ^ 60| ≤ (cT200N240FullOdd_rhoc : ℝ))
    (mT KQ etaT Φ : ℝ) (hmT : (113628610410482173228995326111 / 1000000000000000000000000000000 : ℝ) ≤ mT)
    (hΦ0 : 0 ≤ Φ) (hΦ : Φ ≤ 88381 / 10000) (hKQ0 : 0 ≤ KQ)
    (hKQ : KQ ^ 2 ≤ 2 * Φ ^ 2 / π * ∑' k, hsTerm (Real.log 3 / 2 * 200) (240 + k))
    (heta : etaT ≤ (1 / 1000000000000000000000000000000 : ℝ))
    (xe xo : ℕ → ℝ) (hxe : ∑ i ∈ Finset.range 120, ce i * xe i = 0)
    (hxo : ∑ i ∈ Finset.range 120, co i * xo i = 0) :
    (410221848579 / 500000000000000 : ℝ) * (nsq 120 xe + nsq 120 xo)
      ≤ mT * (nsq 120 xe + nsq 120 xo) + qf 120 Ae xe + qf 120 Ao xo
        - (2 * KQ + etaT) * (nsq 120 xe + nsq 120 xo) := by
  have h1 := (hKQ.trans (hsTail_T200N240 Φ hΦ0 hΦ))
  have hKQle : KQ ≤ (1 / 1000000000000000000000000000000 : ℝ) := by
    have h2 : (0 : ℝ) ≤ 1 / 10 ^ 30 := by norm_num
    have := (pow_le_pow_iff_left₀ hKQ0 h2 (by norm_num : (2 : ℕ) ≠ 0)).mp h1
    norm_num at this ⊢; exact this
  exact arbLege_cT200N240Full_assembly Ae Ao ce co hAe hce hAo hco mT KQ etaT hmT hKQle heta xe xo hxe hxo

end ArbReplay
