import RequestProject.Basic

/-!
# Lemma L2, the Main Theorem and the Corollary

`L2_minus` / `L2_plus` are the two branch brackets, the Main Theorem is
`Fsharp_sub_gammaN_antitoneOn` (together with `Fsharp_le` and `Fsharp_lt`), and the
transfer corollary is `NumSharp_monotoneOn` / `NumSharp_ge_of_anchor`.
-/

open Filter Set Topology

namespace SharpMass

variable {t : ℝ} {P : Finset ℕ} {N n : ℕ} {ylo yhi y : ℝ}

/-! ### Derivatives of the two branch arguments -/

/-- `φ(y) = B - γ(y) A(y)` has derivative `-γ (g_N A + A')`. -/
lemma hasDerivAt_branchMinus (hq : 0 < qN t N) (hn : 2 ≤ n) (y : ℝ) :
    HasDerivAt (fun z => Bcoef t P N n - gammaN t N z * Acoef t P N n z)
      (-(gammaN t N y * (gN t N * Acoef t P N n y + Aderiv t P N n y))) y := by
  have h1 := (hasDerivAt_gammaN (t := t) (N := N) hq y).mul
    (hasDerivAt_Acoef (t := t) (P := P) (N := N) (n := n) hn y)
  exact ((hasDerivAt_const y (Bcoef t P N n)).sub h1).congr_deriv (by ring)

/-- `θ(y) = B + γ(y) A(y)` has derivative `γ (g_N A + A')`. -/
lemma hasDerivAt_branchPlus (hq : 0 < qN t N) (hn : 2 ≤ n) (y : ℝ) :
    HasDerivAt (fun z => Bcoef t P N n + gammaN t N z * Acoef t P N n z)
      (gammaN t N y * (gN t N * Acoef t P N n y + Aderiv t P N n y)) y := by
  have h1 := (hasDerivAt_gammaN (t := t) (N := N) hq y).mul
    (hasDerivAt_Acoef (t := t) (P := P) (N := N) (n := n) hn y)
  exact ((hasDerivAt_const y (Bcoef t P N n)).add h1).congr_deriv (by ring)

lemma continuous_u1 (hq : 0 < qN t N) (hn : 2 ≤ n) : Continuous (u1 t P N n) := by
  have : (u1 t P N n) = fun z => |Bcoef t P N n - gammaN t N z * Acoef t P N n z| := rfl
  rw [this]
  exact (continuous_const.sub ((continuous_gammaN hq).mul (continuous_Acoef hn))).abs

lemma continuous_u2 (hq : 0 < qN t N) (hn : 2 ≤ n) : Continuous (u2 t P N n) := by
  have : (u2 t P N n) = fun z =>
      cfun (gammaN t N z) * |Bcoef t P N n + gammaN t N z * Acoef t P N n z| := rfl
  rw [this]
  exact (continuous_cfun_gammaN hq).mul
    ((continuous_const.add ((continuous_gammaN hq).mul (continuous_Acoef hn))).abs)

/-! ### Lemma L2 -/

/-- **Lemma L2**, first branch: `D⁺(u₁ w)(y) ≤ w(y) Φ⁻_{N,n}(y)` on `[ylo, yhi)`. -/
theorem L2_minus (hq : 0 < qN t N) (hG3 : G3 t N ylo yhi) (hn : 2 ≤ n)
    (hy : y ∈ Ico ylo yhi) :
    DiniUpper (fun z => u1 t P N n z * wgt t N n z) y
      ≤ ((wgt t N n y * PhiMinus t P N n y : ℝ) : EReal) := by
  set φ : ℝ → ℝ := fun z => Bcoef t P N n - gammaN t N z * Acoef t P N n z
  have hφ := hasDerivAt_branchMinus (t := t) (P := P) (N := N) (n := n) hq hn y
  have habs : |(-(gammaN t N y * (gN t N * Acoef t P N n y + Aderiv t P N n y)))|
      = gammaN t N y * |gN t N * Acoef t P N n y + Aderiv t P N n y| := by
    rw [abs_neg, abs_mul, abs_of_pos (gammaN_pos hq y)]
  have key := DiniUpper_mul_weight_le (u := u1 t P N n) (w := wgt t N n)
    (p := fun z => |φ z - φ y|) (b := yhi) (k := Real.log n / 2)
    (m := |(-(gammaN t N y * (gN t N * Acoef t P N n y + Aderiv t P N n y)))|)
    hy.2 (fun z _ => abs_nonneg _) (wgt_pos hn y)
    (fun z hz => wgt_le_of_G3 hG3 hn hy.1 hz.1.le hz.2)
    (fun z _ => abs_sub_abs_le_abs_sub _ _)
    (tendsto_abs_slope hφ)
  refine key.trans_eq ?_
  have : wgt t N n y
      * (|(-(gammaN t N y * (gN t N * Acoef t P N n y + Aderiv t P N n y)))|
          - Real.log n / 2 * u1 t P N n y)
      = wgt t N n y * PhiMinus t P N n y := by
    rw [habs, PhiMinus, u1]
  exact_mod_cast congrArg (fun r : ℝ => (r : EReal)) this

/-- **Lemma L2**, second branch: `D⁺(u₂ w)(y) ≤ w(y) Φ⁺_{N,n}(y)` on `[ylo, yhi)`. -/
theorem L2_plus (hq : 0 < qN t N) (hG1 : G1 t N ylo yhi) (hG3 : G3 t N ylo yhi) (hn : 2 ≤ n)
    (hy : y ∈ Ico ylo yhi) :
    DiniUpper (fun z => u2 t P N n z * wgt t N n z) y
      ≤ ((wgt t N n y * PhiPlus t P N n y : ℝ) : EReal) := by
  set θ : ℝ → ℝ := fun z => Bcoef t P N n + gammaN t N z * Acoef t P N n z with hθdef
  set cc : ℝ → ℝ := fun z => cfun (gammaN t N z) with hccdef
  have hθ := hasDerivAt_branchPlus (t := t) (P := P) (N := N) (n := n) hq hn y
  have hcc := hasDerivAt_cfun_gammaN (t := t) (N := N) hq y
  have hyI : y ∈ Icc ylo yhi := ⟨hy.1, hy.2.le⟩
  have hccy : 0 ≤ cc y := cfun_nonneg (hG1 y hyI).1 (hG1 y hyI).2
  have habs : |gammaN t N y * (gN t N * Acoef t P N n y + Aderiv t P N n y)|
      = gammaN t N y * |gN t N * Acoef t P N n y + Aderiv t P N n y| := by
    rw [abs_mul, abs_of_pos (gammaN_pos hq y)]
  -- the dominating increment
  set p : ℝ → ℝ := fun z => (cc z - cc y) * |θ z| + cc y * |θ z - θ y| with hpdef
  have hp : ∀ z ∈ Ioc y yhi, u2 t P N n z - u2 t P N n y ≤ p z := by
    intro z _
    have h1 : |θ z| - |θ y| ≤ |θ z - θ y| := abs_sub_abs_le_abs_sub _ _
    have h2 : cc y * (|θ z| - |θ y|) ≤ cc y * |θ z - θ y| :=
      mul_le_mul_of_nonneg_left h1 hccy
    have : u2 t P N n z - u2 t P N n y = (cc z - cc y) * |θ z| + cc y * (|θ z| - |θ y|) := by
      simp only [u2, hccdef, hθdef]; ring
    rw [this]
    linarith
  have hlim : Tendsto (fun z => p z / (z - y)) (𝓝[>] y)
      (𝓝 (cdotN t N y * |θ y| + cc y * |gammaN t N y
        * (gN t N * Acoef t P N n y + Aderiv t P N n y)|)) := by
    have hA : Tendsto (fun z => (cc z - cc y) / (z - y)) (𝓝[>] y) (𝓝 (cdotN t N y)) :=
      (hasDerivAt_iff_tendsto_slope.1 hcc).mono_left
        (nhdsWithin_mono _ fun x hx => ne_of_gt hx) |>.congr
        (fun z => by rw [slope_eq_div])
    have hB : Tendsto (fun z => |θ z|) (𝓝[>] y) (𝓝 (|θ y|)) := by
      have : Continuous fun z => |θ z| :=
        (continuous_const.add ((continuous_gammaN hq).mul (continuous_Acoef hn))).abs
      exact (this.tendsto y).mono_left nhdsWithin_le_nhds
    have hC := tendsto_abs_slope hθ
    have := (hA.mul hB).add ((tendsto_const_nhds (x := cc y) (f := 𝓝[>] y)).mul hC)
    refine this.congr fun z => ?_
    simp only [hpdef]
    ring
  have key := DiniUpper_mul_weight_le (u := u2 t P N n) (w := wgt t N n)
    (p := p) (b := yhi) (k := Real.log n / 2)
    (m := cdotN t N y * |θ y| + cc y * |gammaN t N y
        * (gN t N * Acoef t P N n y + Aderiv t P N n y)|)
    hy.2 (fun z hz => mul_nonneg (cfun_nonneg (hG1 z ⟨le_trans hy.1 hz.1.le, hz.2⟩).1
      (hG1 z ⟨le_trans hy.1 hz.1.le, hz.2⟩).2) (abs_nonneg _)) (wgt_pos hn y)
    (fun z hz => wgt_le_of_G3 hG3 hn hy.1 hz.1.le hz.2) hp hlim
  refine key.trans_eq ?_
  have : wgt t N n y
      * (cdotN t N y * |θ y| + cc y * |gammaN t N y
          * (gN t N * Acoef t P N n y + Aderiv t P N n y)| - Real.log n / 2 * u2 t P N n y)
      = wgt t N n y * PhiPlus t P N n y := by
    rw [habs, PhiPlus, u2, hθdef, hccdef]
    ring
  exact_mod_cast congrArg (fun r : ℝ => (r : EReal)) this

/-! ### The summand is nonincreasing -/

/-- Each weighted summand `max(u₁, u₂) w` of the sharp mass is nonincreasing on `I`.
This is L1 + L2 + (G4) + L3. -/
theorem summand_antitoneOn (hq : 0 < qN t N) (hG1 : G1 t N ylo yhi) (hG3 : G3 t N ylo yhi)
    (hn : 2 ≤ n)
    (hG4 : ∀ y ∈ Icc ylo yhi, PhiMinus t P N n y ≤ 0 ∧ PhiPlus t P N n y ≤ 0) :
    AntitoneOn (fun y => max (u1 t P N n y) (u2 t P N n y) * wgt t N n y) (Icc ylo yhi) := by
  have hmax : (fun y => max (u1 t P N n y) (u2 t P N n y) * wgt t N n y)
      = fun y => max (u1 t P N n y * wgt t N n y) (u2 t P N n y * wgt t N n y) :=
    funext fun y => max_mul_of_nonneg _ _ (wgt_pos hn y).le
  rw [hmax]
  refine antitoneOn_of_DiniUpper_nonpos ?_ ?_
  · exact (((continuous_u1 hq hn).mul (continuous_wgt hn)).max
      ((continuous_u2 hq hn).mul (continuous_wgt hn))).continuousOn
  · intro z hz
    have hzI : z ∈ Icc ylo yhi := ⟨hz.1, hz.2.le⟩
    refine (DiniUpper_max_le _ _ z).trans (max_le ?_ ?_)
    · refine (L2_minus hq hG3 hn hz).trans ?_
      have : wgt t N n z * PhiMinus t P N n z ≤ 0 :=
        mul_nonpos_of_nonneg_of_nonpos (wgt_pos hn z).le (hG4 z hzI).1
      exact_mod_cast EReal.coe_le_coe_iff.2 this
    · refine (L2_plus hq hG1 hG3 hn hz).trans ?_
      have : wgt t N n z * PhiPlus t P N n z ≤ 0 :=
        mul_nonpos_of_nonneg_of_nonpos (wgt_pos hn z).le (hG4 z hzI).2
      exact_mod_cast EReal.coe_le_coe_iff.2 this

/-! ### Main theorem -/

/-- **Main Theorem (sharp-mass `y`-monotonicity).** Under (G1)–(G4) the function
`F♯_N - γ_N` is nonincreasing on `I = [ylo, yhi]`. -/
theorem Fsharp_sub_gammaN_antitoneOn (hq : 0 < qN t N)
    (hG1 : G1 t N ylo yhi) (hG3 : G3 t N ylo yhi) (hG4 : G4 t P N ylo yhi) :
    AntitoneOn (fun y => Fsharp t P N y - gammaN t N y) (Icc ylo yhi) := by
  have hsum : (fun y => Fsharp t P N y - gammaN t N y)
      = fun y => ∑ n ∈ Finset.Icc 2 (Dnum P * N),
          max (u1 t P N n y) (u2 t P N n y) * wgt t N n y := by
    funext y; rw [Fsharp]; ring
  rw [hsum]
  intro a ha b hb hab
  refine Finset.sum_le_sum fun m hm => ?_
  rw [Finset.mem_Icc] at hm
  exact summand_antitoneOn hq hG1 hG3 hm.1
    (fun z hz => hG4 m hm.1 hm.2 z hz) ha hb hab

/-- **Main Theorem**, first displayed inequality:
`F♯_N(y') ≤ F♯_N(y) + (γ_N(y') - γ_N(y)) ≤ F♯_N(y)`. -/
theorem Fsharp_le (hq : 0 < qN t N) (hG1 : G1 t N ylo yhi) (hG2 : G2 t N)
    (hG3 : G3 t N ylo yhi) (hG4 : G4 t P N ylo yhi)
    {y y' : ℝ} (hy : ylo ≤ y) (hyy : y ≤ y') (hy' : y' ≤ yhi) :
    Fsharp t P N y' ≤ Fsharp t P N y + (gammaN t N y' - gammaN t N y) ∧
      Fsharp t P N y + (gammaN t N y' - gammaN t N y) ≤ Fsharp t P N y := by
  have hmono := Fsharp_sub_gammaN_antitoneOn hq hG1 hG3 hG4
    (a := y) ⟨hy, le_trans hyy hy'⟩ (b := y') ⟨le_trans hy hyy, hy'⟩ hyy
  refine ⟨by linarith, ?_⟩
  have : gammaN t N y' ≤ gammaN t N y := gammaN_antitone hq hG2 hyy
  linarith

/-- **Main Theorem**, strict form: `F♯_N(y') < F♯_N(y)` when `y < y'` (strictness comes from
the strictly decreasing factor `γ_N`, by (G2)). -/
theorem Fsharp_lt (hq : 0 < qN t N) (hG1 : G1 t N ylo yhi) (hG2 : G2 t N)
    (hG3 : G3 t N ylo yhi) (hG4 : G4 t P N ylo yhi)
    {y y' : ℝ} (hy : ylo ≤ y) (hyy : y < y') (hy' : y' ≤ yhi) :
    Fsharp t P N y' < Fsharp t P N y := by
  have hmono := Fsharp_sub_gammaN_antitoneOn hq hG1 hG3 hG4
    (a := y) ⟨hy, le_trans hyy.le hy'⟩ (b := y') ⟨le_trans hy hyy.le, hy'⟩ hyy.le
  have : gammaN t N y' < gammaN t N y := gammaN_strictAnti hq hG2 hyy
  linarith

/-- `F♯_N` itself is nonincreasing on `I`. -/
theorem Fsharp_antitoneOn (hq : 0 < qN t N) (hG1 : G1 t N ylo yhi) (hG2 : G2 t N)
    (hG3 : G3 t N ylo yhi) (hG4 : G4 t P N ylo yhi) :
    AntitoneOn (Fsharp t P N) (Icc ylo yhi) := fun _ ha _ hb hab =>
  (Fsharp_le hq hG1 hG2 hG3 hG4 ha.1 hab hb.2).1.trans
    (Fsharp_le hq hG1 hG2 hG3 hG4 ha.1 hab hb.2).2

/-! ### Corollary: upward transfer of a sharp anchor -/

/-- **Corollary.** Under (G1)–(G4), `Num♯_N = 1 - F♯_N` is nondecreasing on `I`. -/
theorem NumSharp_monotoneOn (hq : 0 < qN t N) (hG1 : G1 t N ylo yhi) (hG2 : G2 t N)
    (hG3 : G3 t N ylo yhi) (hG4 : G4 t P N ylo yhi) :
    MonotoneOn (NumSharp t P N) (Icc ylo yhi) := by
  intro a ha b hb hab
  have := Fsharp_antitoneOn hq hG1 hG2 hG3 hG4 ha hb hab
  simp only [NumSharp]
  linarith

/-- **Corollary.** A positive sharp anchor at the bottom edge transfers upwards: if
`Num♯_N(ylo) ≥ τ` then `Num♯_N(y) ≥ τ` for every `y ∈ I`. -/
theorem NumSharp_ge_of_anchor (hq : 0 < qN t N) (hG1 : G1 t N ylo yhi) (hG2 : G2 t N)
    (hG3 : G3 t N ylo yhi) (hG4 : G4 t P N ylo yhi) (hle : ylo ≤ yhi) {τ : ℝ}
    (hanchor : τ ≤ NumSharp t P N ylo) :
    ∀ y ∈ Icc ylo yhi, τ ≤ NumSharp t P N y := fun _ hy =>
  hanchor.trans (NumSharp_monotoneOn hq hG1 hG2 hG3 hG4 ⟨le_rfl, hle⟩ hy hy.1)

end SharpMass
