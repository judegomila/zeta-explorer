/-
Route 40 (b9) — wol-pd Lemma 3.3(a) (grid maxima of a one-prime cosine polynomial), formal version.

Source: formalization/paper/wol-pd-lemmas.md §3, Lemma 3.3(a):
  f(φ) = Σ_{k=1}^{K} M_k (1 - cos kφ), φ_i = iπ/(G-1), g = π/(G-1):
  max_{[0,π]} f ≤ max_i f(φ_i) + (g²/8) Σ_k k² |M_k|.
Compiled against Mathlib d13f23b7 / Lean 4.34.1 (tree /tmp/qrh-verify/lean).
-/
import Mathlib

open Real Set Finset

namespace Route40

/-- Second-order bound at a critical point: if `f' p = 0` and `|f''| ≤ M`, then
`f p - f ψ ≤ M (ψ - p)²/2` for every `ψ`. -/
theorem crit_taylor (f f' f'' : ℝ → ℝ) (M : ℝ) (hf : ∀ x, HasDerivAt f (f' x) x)
    (hf' : ∀ x, HasDerivAt f' (f'' x) x) (hM : ∀ x, |f'' x| ≤ M) (p : ℝ) (hp : f' p = 0) :
    ∀ ψ, f p - f ψ ≤ M * (ψ - p) ^ 2 / 2 := by
  -- |f' x| ≤ M |x - p|
  have hlip : ∀ x, |f' x| ≤ M * |x - p| := by
    intro x
    have := Convex.norm_image_sub_le_of_norm_hasDerivWithin_le (f := f') (f' := f'') (C := M)
      (s := univ) (fun y _ => (hf' y).hasDerivWithinAt) (fun y _ => by
        rw [Real.norm_eq_abs]; exact hM y) convex_univ (mem_univ p) (mem_univ x)
    simpa [hp, Real.norm_eq_abs] using this
  set w : ℝ → ℝ := fun x => f x - f p + M * (x - p) ^ 2 / 2 with hw
  have hwd : ∀ x, HasDerivAt w (f' x + M * (x - p)) x := by
    intro x
    have h1 := ((hf x).sub_const (f p))
    have h2 : HasDerivAt (fun x => M * (x - p) ^ 2 / 2) (M * (x - p)) x := by
      have := (((hasDerivAt_id x).sub_const p).pow 2).const_mul M |>.div_const 2
      convert this using 1
      · funext y; simp
      · simp; ring
    exact h1.add h2
  have hwp : w p = 0 := by simp [hw]
  intro ψ
  have key : 0 ≤ w ψ := by
    rcases le_total p ψ with h | h
    · have hmono : MonotoneOn w (Ici p) := by
        refine monotoneOn_of_hasDerivWithinAt_nonneg (convex_Ici p)
          (fun x _ => (hwd x).continuousAt.continuousWithinAt)
          (fun x _ => (hwd x).hasDerivWithinAt) ?_
        intro x hx
        rw [interior_Ici] at hx
        have hx' : p < x := hx
        have := hlip x
        rw [abs_of_pos (sub_pos.mpr hx')] at this
        have := neg_abs_le (f' x)
        nlinarith
      have := hmono (mem_Ici.mpr le_rfl) (mem_Ici.mpr h) h
      linarith
    · have hanti : AntitoneOn w (Iic p) := by
        refine antitoneOn_of_hasDerivWithinAt_nonpos (convex_Iic p)
          (fun x _ => (hwd x).continuousAt.continuousWithinAt)
          (fun x _ => (hwd x).hasDerivWithinAt) ?_
        intro x hx
        rw [interior_Iic] at hx
        have hx' : x < p := hx
        have := hlip x
        rw [abs_of_neg (sub_neg.mpr hx')] at this
        have := le_abs_self (f' x)
        nlinarith
      have := hanti (mem_Iic.mpr h) (mem_Iic.mpr le_rfl) h
      linarith
  simp only [hw] at key
  linarith

/-- Nearest grid point: for `0 ≤ p ≤ (G-1) g` with `g > 0` there is `i < G` with
`|p - i g| ≤ g/2`. -/
lemma nearest_grid (G : ℕ) (hG : 2 ≤ G) (g : ℝ) (hg : 0 < g) (p : ℝ) (hp0 : 0 ≤ p)
    (hp1 : p ≤ ((G : ℝ) - 1) * g) : ∃ i ∈ range G, |p - i * g| ≤ g / 2 := by
  set x := p / g with hx
  have hx0 : 0 ≤ x + 1 / 2 := by positivity
  refine ⟨⌊x + 1 / 2⌋₊, ?_, ?_⟩
  · rw [Finset.mem_range]
    have hxle : x ≤ (G : ℝ) - 1 := by rw [hx, div_le_iff₀ hg]; exact hp1
    have : x + 1 / 2 < (G : ℝ) := by linarith
    exact (Nat.floor_lt hx0).mpr this
  · have h1 := Nat.floor_le hx0
    have h2 := Nat.lt_floor_add_one (x + 1 / 2)
    have hpx : p = x * g := by rw [hx]; field_simp
    rw [hpx, ← sub_mul, abs_mul, abs_of_pos hg]
    have : |x - ⌊x + 1 / 2⌋₊| ≤ 1 / 2 := by
      rw [abs_le]; constructor <;> linarith
    nlinarith [abs_nonneg (x - ⌊x + 1 / 2⌋₊)]

/-- Abstract grid-maximum lemma: `f` with `|f''| ≤ M` on ℝ, grid `φ_i = i g`, `g = π/(G-1)`. -/
theorem grid_max_abstract (f f' f'' : ℝ → ℝ) (M : ℝ) (hf : ∀ x, HasDerivAt f (f' x) x)
    (hf' : ∀ x, HasDerivAt f' (f'' x) x) (hM : ∀ x, |f'' x| ≤ M) (G : ℕ) (hG : 2 ≤ G) :
    ∀ φ ∈ Icc 0 π, f φ ≤ (range G).sup' (by simp; omega) (fun i => f (i * (π / (G - 1)))) +
      (π / (G - 1)) ^ 2 / 8 * M := by
  set g : ℝ := π / (G - 1) with hgdef
  have hG1 : (1 : ℝ) < G := by exact_mod_cast hG
  have hg : 0 < g := div_pos pi_pos (by linarith)
  have hG1' : (G : ℝ) - 1 ≠ 0 := by linarith
  have hpiG : ((G : ℝ) - 1) * g = π := by rw [hgdef]; field_simp [hG1']
  have hne : (range G).Nonempty := by simp; omega
  set S := (range G).sup' hne (fun i => f (i * g)) with hS
  have hgrid : ∀ i ∈ range G, f (i * g) ≤ S := fun i hi =>
    Finset.le_sup' (fun i : ℕ => f ((i : ℝ) * g)) hi
  have hcont : Continuous f := continuous_iff_continuousAt.mpr (fun x => (hf x).continuousAt)
  obtain ⟨p, hpI, hpmax⟩ := (isCompact_Icc (a := (0 : ℝ)) (b := π)).exists_isMaxOn
    (nonempty_Icc.mpr pi_pos.le) hcont.continuousOn
  have hM0 : 0 ≤ M := (abs_nonneg _).trans (hM 0)
  have hbound : f p ≤ S + g ^ 2 / 8 * M := by
    have hslack : 0 ≤ g ^ 2 / 8 * M := by positivity
    rcases eq_or_lt_of_le hpI.1 with h0 | h0
    · -- p = 0 is the grid point i = 0
      have := hgrid 0 (by simp; omega)
      rw [← h0]; simp at this; linarith
    rcases eq_or_lt_of_le hpI.2 with h1 | h1
    · -- p = π is the grid point i = G - 1
      have hi : G - 1 ∈ range G := by simp; omega
      have := hgrid (G - 1) hi
      have hcast : ((G - 1 : ℕ) : ℝ) * g = π := by
        rw [Nat.cast_sub (by omega), Nat.cast_one]; exact hpiG
      rw [hcast] at this
      rw [h1]; linarith
    -- interior maximum: f' p = 0
    have hloc : IsLocalMax f p :=
      hpmax.isLocalMax (Icc_mem_nhds h0 h1)
    have hcrit : f' p = 0 := hloc.hasDerivAt_eq_zero (hf p)
    obtain ⟨i, hi, hdist⟩ := nearest_grid G hG g hg p hpI.1 (by rw [hpiG]; exact hpI.2)
    have ht := crit_taylor f f' f'' M hf hf' hM p hcrit (i * g)
    have hsq : (i * g - p) ^ 2 ≤ (g / 2) ^ 2 := by
      rw [← sq_abs, abs_sub_comm]
      exact pow_le_pow_left₀ (abs_nonneg _) hdist 2
    have := hgrid i hi
    nlinarith
  intro φ hφ
  exact (hpmax hφ).trans hbound

/-- **Lemma 3.3(a).** For `f(φ) = Σ_{k=1}^{K} M_k (1 - cos kφ)` and `G ≥ 2` grid points
`φ_i = iπ/(G-1)`: `f φ ≤ max_i f(φ_i) + (g²/8) Σ_k k²|M_k|` for every `φ ∈ [0, π]`. -/
theorem lemma_3_3_a (K G : ℕ) (hG : 2 ≤ G) (M : ℕ → ℝ) :
    ∀ φ ∈ Icc 0 π,
      ∑ k ∈ Icc 1 K, M k * (1 - Real.cos (k * φ)) ≤
        (range G).sup' (by simp; omega)
          (fun i => ∑ k ∈ Icc 1 K, M k * (1 - Real.cos (k * (i * (π / (G - 1)))))) +
        (π / (G - 1)) ^ 2 / 8 * ∑ k ∈ Icc 1 K, (k : ℝ) ^ 2 * |M k| := by
  set f : ℝ → ℝ := fun φ => ∑ k ∈ Icc 1 K, M k * (1 - Real.cos (k * φ)) with hfdef
  set f' : ℝ → ℝ := fun φ => ∑ k ∈ Icc 1 K, M k * ((k : ℝ) * Real.sin (k * φ)) with hf'def
  set f'' : ℝ → ℝ := fun φ => ∑ k ∈ Icc 1 K, M k * ((k : ℝ) ^ 2 * Real.cos (k * φ)) with hf''def
  have hf : ∀ x, HasDerivAt f (f' x) x := by
    intro x
    have := HasDerivAt.fun_sum (u := Icc 1 K) (A := fun k φ => M k * (1 - Real.cos (k * φ)))
      (A' := fun k => M k * ((k : ℝ) * Real.sin (k * x))) (fun k _ => by
        have h := (((hasDerivAt_id x).const_mul (k : ℝ)).cos.const_sub 1).const_mul (M k)
        convert h using 1
        · funext y; simp
        · simp only [id]; ring)
    exact this
  have hf' : ∀ x, HasDerivAt f' (f'' x) x := by
    intro x
    have := HasDerivAt.fun_sum (u := Icc 1 K) (A := fun k φ => M k * ((k : ℝ) * Real.sin (k * φ)))
      (A' := fun k => M k * ((k : ℝ) ^ 2 * Real.cos (k * x))) (fun k _ => by
        have h := (((hasDerivAt_id x).const_mul (k : ℝ)).sin.const_mul (k : ℝ)).const_mul (M k)
        convert h using 1
        · funext y; simp
        · simp only [id]; ring)
    exact this
  have hM : ∀ x, |f'' x| ≤ ∑ k ∈ Icc 1 K, (k : ℝ) ^ 2 * |M k| := by
    intro x
    refine (Finset.abs_sum_le_sum_abs _ _).trans (Finset.sum_le_sum (fun k _ => ?_))
    rw [abs_mul, abs_mul, abs_of_nonneg (by positivity : (0 : ℝ) ≤ (k : ℝ) ^ 2)]
    have := Real.abs_cos_le_one (k * x)
    have h0 : 0 ≤ |M k| * (k : ℝ) ^ 2 := by positivity
    nlinarith
  exact grid_max_abstract f f' f'' _ hf hf' hM G hG

end Route40
