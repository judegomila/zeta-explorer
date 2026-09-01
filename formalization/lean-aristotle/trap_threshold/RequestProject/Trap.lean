import RequestProject.Static
import RequestProject.Flow

/-!
# Theorem B: the sharp minimal-gap trap threshold `Θ_b = (√73 - 5)/8`

Abstract (Grönwall-type) trapping lemmas, and the dynamic minimal-gap trap theorem.
-/

open scoped BigOperators

namespace ThetaTrap

/-- Abstract trapping with a band: if `ψ s₀ ≤ 0` and `ψ' s ≤ 0` at every point of `[s₀,s₁]`
where `0 ≤ ψ s ≤ ε`, then `ψ ≤ 0` on `[s₀,s₁]`.  The boundary rate is allowed to be
*nonstrict*. -/
theorem trap_band {psi psi' : ℝ → ℝ} {s0 s1 eps : ℝ} (heps : 0 < eps)
    (hd : ∀ s ∈ Set.Icc s0 s1, HasDerivAt psi (psi' s) s)
    (h0 : psi s0 ≤ 0)
    (hrate : ∀ s ∈ Set.Icc s0 s1, 0 ≤ psi s → psi s ≤ eps → psi' s ≤ 0) :
    ∀ s ∈ Set.Icc s0 s1, psi s ≤ 0 := by
  by_contra hcon
  push_neg at hcon
  obtain ⟨s2, hs2mem, hs2⟩ := hcon
  obtain ⟨hs0s2, hs2s1⟩ := hs2mem
  have hsub2 : Set.Icc s0 s2 ⊆ Set.Icc s0 s1 := Set.Icc_subset_Icc le_rfl hs2s1
  have hcont : ∀ s ∈ Set.Icc s0 s1, ContinuousAt psi s := fun s hs => (hd s hs).continuousAt
  have hcontOn2 : ContinuousOn psi (Set.Icc s0 s2) :=
    fun s hs => (hcont s (hsub2 hs)).continuousWithinAt
  set v : ℝ := min eps (psi s2) with hv
  have hv0 : 0 < v := lt_min heps hs2
  set A : Set ℝ := {s ∈ Set.Icc s0 s2 | v ≤ psi s} with hAdef
  have hAclosed : IsClosed A := by
    have hAeq : A = Set.Icc s0 s2 ∩ psi ⁻¹' (Set.Ici v) := by ext s; simp [hAdef]
    rw [hAeq]; exact hcontOn2.preimage_isClosed_of_isClosed isClosed_Icc isClosed_Ici
  have hAne : A.Nonempty := ⟨s2, ⟨hs0s2, le_rfl⟩, min_le_right _ _⟩
  have hAbdd : BddBelow A := ⟨s0, fun s hs => hs.1.1⟩
  set s3 := sInf A with hs3def
  have hs3A : s3 ∈ A := hAclosed.csInf_mem hAne hAbdd
  obtain ⟨⟨hs0s3, hs3s2⟩, hs3v⟩ := hs3A
  have hlt : ∀ s, s0 ≤ s → s < s3 → psi s < v := by
    intro s hs hlt3
    by_contra hcon2
    push_neg at hcon2
    have hmem : s ∈ A := ⟨⟨hs, le_trans hlt3.le hs3s2⟩, hcon2⟩
    exact absurd (csInf_le hAbdd hmem) (not_le.mpr hlt3)
  set B : Set ℝ := {s ∈ Set.Icc s0 s3 | psi s ≤ 0} with hBdef
  have hsub3 : Set.Icc s0 s3 ⊆ Set.Icc s0 s1 := Set.Icc_subset_Icc le_rfl (le_trans hs3s2 hs2s1)
  have hcontOn3 : ContinuousOn psi (Set.Icc s0 s3) :=
    fun s hs => (hcont s (hsub3 hs)).continuousWithinAt
  have hBclosed : IsClosed B := by
    have hBeq : B = Set.Icc s0 s3 ∩ psi ⁻¹' (Set.Iic 0) := by ext s; simp [hBdef]
    rw [hBeq]; exact hcontOn3.preimage_isClosed_of_isClosed isClosed_Icc isClosed_Iic
  have hBne : B.Nonempty := ⟨s0, ⟨le_rfl, hs0s3⟩, h0⟩
  have hBbdd : BddAbove B := ⟨s3, fun s hs => hs.1.2⟩
  set sp := sSup B with hspdef
  have hspB : sp ∈ B := hBclosed.csSup_mem hBne hBbdd
  obtain ⟨⟨hs0sp, hsps3⟩, hsp0⟩ := hspB
  have hpos : ∀ s, sp < s → s ≤ s3 → 0 < psi s := by
    intro s h1 h2
    by_contra hcon3
    push_neg at hcon3
    have hmem : s ∈ B := ⟨⟨le_trans hs0sp h1.le, h2⟩, hcon3⟩
    exact absurd (le_csSup hBbdd hmem) (not_le.mpr h1)
  have hanti : AntitoneOn psi (Set.Icc sp s3) := by
    have hsub : Set.Icc sp s3 ⊆ Set.Icc s0 s1 := Set.Icc_subset_Icc hs0sp (le_trans hs3s2 hs2s1)
    refine antitoneOn_of_deriv_nonpos (convex_Icc _ _)
      (fun s hs => (hcont s (hsub hs)).continuousWithinAt) ?_ ?_
    · intro s hs
      rw [interior_Icc] at hs
      exact ((hd s (hsub (Set.mem_Icc_of_Ioo hs))).differentiableAt).differentiableWithinAt
    · intro s hs
      rw [interior_Icc] at hs
      have hmem : s ∈ Set.Icc s0 s1 := hsub (Set.mem_Icc_of_Ioo hs)
      have hd' := hd s hmem
      rw [hd'.deriv]
      refine hrate s hmem (hpos s hs.1 hs.2.le).le ?_
      have hsv := hlt s (le_trans hs0sp hs.1.le) hs.2
      have hve : v ≤ eps := min_le_left _ _
      linarith
  have hfin := hanti (Set.left_mem_Icc.mpr hsps3) (Set.right_mem_Icc.mpr hsps3) hsps3
  linarith

/-- Abstract trapping (Grönwall-type): a nonstrict boundary rate of the form
`φ' ≤ L (φ - c)` inside a band above the level `c` traps `φ` below `c`. -/
theorem trap_abstract {phi phi' : ℝ → ℝ} {s0 s1 c L eps : ℝ} (hL : 0 ≤ L) (heps : 0 < eps)
    (hd : ∀ s ∈ Set.Icc s0 s1, HasDerivAt phi (phi' s) s)
    (h0 : phi s0 ≤ c)
    (hrate : ∀ s ∈ Set.Icc s0 s1, c ≤ phi s → phi s ≤ c + eps → phi' s ≤ L * (phi s - c)) :
    ∀ s ∈ Set.Icc s0 s1, phi s ≤ c := by
  set psi : ℝ → ℝ := fun t => (phi t - c) * Real.exp (-(L * (t - s0))) with hpsi
  set psi' : ℝ → ℝ := fun t => (phi' t - L * (phi t - c)) * Real.exp (-(L * (t - s0))) with hpsi'
  have hdpsi : ∀ s ∈ Set.Icc s0 s1, HasDerivAt psi (psi' s) s := by
    intro s hs
    have h1 : HasDerivAt (fun t => phi t - c) (phi' s) s := (hd s hs).sub_const c
    have h2 : HasDerivAt (fun t : ℝ => Real.exp (-(L * (t - s0))))
        (Real.exp (-(L * (s - s0))) * -(L * 1)) s :=
      (((hasDerivAt_id s).sub_const s0).const_mul L).neg.exp
    have h3 := h1.mul h2
    rw [hpsi, hpsi']
    convert h3 using 1
    ring
  have hb := trap_band (psi := psi) (psi' := psi') (s0 := s0) (s1 := s1)
    (eps := eps * Real.exp (-(L * (s1 - s0)))) (by positivity) hdpsi
    (by simp [hpsi]; linarith) ?_
  · intro s hs
    have hbs := hb s hs
    have hE : 0 < Real.exp (-(L * (s - s0))) := Real.exp_pos _
    rw [hpsi] at hbs
    nlinarith [hbs, hE]
  · intro s hs h1 h2
    have hE : 0 < Real.exp (-(L * (s - s0))) := Real.exp_pos _
    have hc : c ≤ phi s := by
      rw [hpsi] at h1
      nlinarith [h1, hE]
    have hband : phi s ≤ c + eps := by
      rw [hpsi] at h2
      have e1 : Real.exp (-(L * (s1 - s0)))
          = Real.exp (L * (s - s1)) * Real.exp (-(L * (s - s0))) := by
        rw [← Real.exp_add]; ring_nf
      rw [e1] at h2
      have h3 : (phi s - c) ≤ eps * Real.exp (L * (s - s1)) := by
        have h4 : (phi s - c) * Real.exp (-(L * (s - s0)))
            ≤ (eps * Real.exp (L * (s - s1))) * Real.exp (-(L * (s - s0))) := by
          calc (phi s - c) * Real.exp (-(L * (s - s0)))
              ≤ eps * (Real.exp (L * (s - s1)) * Real.exp (-(L * (s - s0)))) := h2
            _ = (eps * Real.exp (L * (s - s1))) * Real.exp (-(L * (s - s0))) := by ring
        exact le_of_mul_le_mul_right h4 hE
      have h5 : Real.exp (L * (s - s1)) ≤ 1 := by
        rw [Real.exp_le_one_iff]
        have := hs.2
        nlinarith
      nlinarith [h3, h5]
    have hr := hrate s hs hc hband
    rw [hpsi']
    nlinarith [hE, hr]

/-! ### From the static core to the dynamic rate bound -/

/-- The total mass of the profile `μ_m = g² T_m` is `2Θ`. -/
lemma sum_mu_eq (N : ℕ) (y : ℕ → ℝ) (k : ℕ) :
    ∑ m ∈ envIdx N k, (gapv y k) ^ 2 * Tv y k m = 2 * Thetav N y k := by
  rw [← Finset.mul_sum, Thetav, ← envE]
  ring

/-- `ThetaDot` is the boundary rate of the profile `μ_m = g² T_m`, divided by `g²`. -/
lemma ThetaDot_eq_rate (N : ℕ) (y : ℕ → ℝ) (k : ℕ) (hg : gapv y k ≠ 0) :
    ThetaDot N y k = rate (envIdx N k) (fun m => (gapv y k) ^ 2 * Tv y k m) / (gapv y k) ^ 2 := by
  have h2 : ∑ m ∈ envIdx N k, ((gapv y k) ^ 2 * Tv y k m) ^ 2
      = (gapv y k) ^ 4 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 2 := by
    rw [Finset.mul_sum]
    exact Finset.sum_congr rfl fun m _ => by ring
  have h3 : ∑ m ∈ envIdx N k, ((gapv y k) ^ 2 * Tv y k m) ^ 3
      = (gapv y k) ^ 6 * ∑ m ∈ envIdx N k, (Tv y k m) ^ 3 := by
    rw [Finset.mul_sum]
    exact Finset.sum_congr rfl fun m _ => by ring
  rw [rate, ← Finset.mul_sum, h2, h3, ThetaDot, Thetav, ← envE]
  field_simp
  ring

/-- Static core in dynamic clothing: under the minimal-gap hypothesis, `Θ ≤ Θ_b` forces the
exact rate `ThetaDot` to be nonpositive. -/
theorem ThetaDot_nonpos {N : ℕ} {y : ℕ → ℝ} {k : ℕ} (hord : Ordered N y) (hk : k + 1 < N)
    (hmin : ∀ i, i + 1 < N → gapv y k ≤ gapv y i) (hTh : Thetav N y k ≤ ThetaB) :
    ThetaDot N y k ≤ 0 := by
  have hg : 0 < gapv y k := gapv_pos hord hk
  have h0 : ∀ m ∈ envIdx N k, 0 ≤ (gapv y k) ^ 2 * Tv y k m := fun m hm =>
    le_of_lt (mul_pos (by positivity) (Tv_pos hord hk hm))
  have hcap : ∀ m ∈ envIdx N k, (gapv y k) ^ 2 * Tv y k m ≤ 1 / 2 := fun m hm =>
    cap_of_minimal_gap hord hk hmin hm
  have hsum : ∑ m ∈ envIdx N k, (gapv y k) ^ 2 * Tv y k m ≤ 2 * ThetaB := by
    rw [sum_mu_eq]; linarith
  have hr := rate_nonpos_of_sum_le (envIdx N k) (fun m => (gapv y k) ^ 2 * Tv y k m) h0 hcap hsum
  rw [ThetaDot_eq_rate N y k (ne_of_gt hg)]
  exact div_nonpos_of_nonpos_of_nonneg hr (by positivity)

/-- Quantitative version above the threshold. -/
theorem ThetaDot_le {N : ℕ} {y : ℕ → ℝ} {k : ℕ} (hord : Ordered N y) (hk : k + 1 < N)
    (hmin : ∀ i, i + 1 < N → gapv y k ≤ gapv y i) (hThB : ThetaB ≤ Thetav N y k)
    (hTh : Thetav N y k ≤ 1 / 2) :
    ThetaDot N y k ≤ 16 * (Thetav N y k - ThetaB) / (gapv y k) ^ 2 := by
  have hg : 0 < gapv y k := gapv_pos hord hk
  have h0 : ∀ m ∈ envIdx N k, 0 ≤ (gapv y k) ^ 2 * Tv y k m := fun m hm =>
    le_of_lt (mul_pos (by positivity) (Tv_pos hord hk hm))
  have hcap : ∀ m ∈ envIdx N k, (gapv y k) ^ 2 * Tv y k m ≤ 1 / 2 := fun m hm =>
    cap_of_minimal_gap hord hk hmin hm
  have hge : 2 * ThetaB ≤ ∑ m ∈ envIdx N k, (gapv y k) ^ 2 * Tv y k m := by
    rw [sum_mu_eq]; linarith
  have hle : ∑ m ∈ envIdx N k, (gapv y k) ^ 2 * Tv y k m ≤ 1 := by
    rw [sum_mu_eq]; linarith
  have hr := rate_le_of_sum_ge (envIdx N k) (fun m => (gapv y k) ^ 2 * Tv y k m) h0 hcap hge hle
  rw [sum_mu_eq] at hr
  rw [ThetaDot_eq_rate N y k (ne_of_gt hg)]
  have hrr : rate (envIdx N k) (fun m => (gapv y k) ^ 2 * Tv y k m)
      ≤ 16 * (Thetav N y k - ThetaB) := by linarith
  exact (div_le_div_iff_of_pos_right (by positivity)).mpr hrr

/-- **Theorem B** (minimal-gap trap, dynamic form).  Along an attractive CM flow, if the tracked
adjacent pair `(k, k+1)` realises the global minimal gap throughout `[s₀,s₁] ⊆ [0,t_c)`, then
every level `Θ* ≤ Θ_b = (√73-5)/8` is trapping: `Θ(s₀) ≤ Θ*` implies `Θ(s) ≤ Θ*` on `[s₀,s₁]`. -/
theorem theoremB {N : ℕ} {tc : ℝ} {x : ℕ → ℝ → ℝ} {k : ℕ} (hf : IsCMFlow N tc x)
    (hk : k + 1 < N) {s0 s1 : ℝ} (hs0 : 0 ≤ s0) (hs01 : s0 ≤ s1) (hs1 : s1 < tc)
    (hmin : ∀ s ∈ Set.Icc s0 s1, ∀ i, i + 1 < N → gapv (cfg x s) k ≤ gapv (cfg x s) i)
    {Ts : ℝ} (hTs : Ts ≤ ThetaB) (hinit : Thetav N (cfg x s0) k ≤ Ts) :
    ∀ s ∈ Set.Icc s0 s1, Thetav N (cfg x s) k ≤ Ts := by
  have hIco : ∀ s ∈ Set.Icc s0 s1, s ∈ Set.Ico (0 : ℝ) tc := fun s hs =>
    ⟨le_trans hs0 hs.1, lt_of_le_of_lt hs.2 hs1⟩
  have hd : ∀ s ∈ Set.Icc s0 s1,
      HasDerivAt (fun t => Thetav N (cfg x t) k) (ThetaDot N (cfg x s) k) s :=
    fun s hs => lemma2 hf hk (hIco s hs)
  -- the gap is continuous and positive on the compact interval, hence bounded below
  have hcontg : ContinuousOn (fun s => gapv (cfg x s) k) (Set.Icc s0 s1) := by
    intro s hs
    have h1 : ContinuousAt (x k) s := (hf.hasDeriv s (hIco s hs) k (by omega)).continuousAt
    have h2 : ContinuousAt (x (k + 1)) s :=
      (hf.hasDeriv s (hIco s hs) (k + 1) hk).continuousAt
    exact ((h2.sub h1)).continuousWithinAt
  obtain ⟨sm, hsm, hminOn⟩ := IsCompact.exists_isMinOn (isCompact_Icc (a := s0) (b := s1))
    ⟨s0, Set.left_mem_Icc.mpr hs01⟩ hcontg
  set gmin : ℝ := gapv (cfg x sm) k with hgmin
  have hgmin_pos : 0 < gmin := gapv_pos (hf.ordered sm (hIco sm hsm)) hk
  have hgle : ∀ s ∈ Set.Icc s0 s1, gmin ≤ gapv (cfg x s) k := fun s hs => hminOn hs
  set L : ℝ := 16 / gmin ^ 2 with hLdef
  have hL0 : 0 ≤ L := by positivity
  have hTshalf : Ts < 1 / 2 := lt_of_le_of_lt hTs ThetaB_lt_half
  refine trap_abstract (phi := fun s => Thetav N (cfg x s) k)
    (phi' := fun s => ThetaDot N (cfg x s) k) (c := Ts) (L := L) (eps := 1 / 2 - Ts)
    hL0 (by linarith) hd hinit ?_
  intro s hs hge hband
  have hord : Ordered N (cfg x s) := hf.ordered s (hIco s hs)
  have hgs : 0 < gapv (cfg x s) k := gapv_pos hord hk
  by_cases hcase : Thetav N (cfg x s) k ≤ ThetaB
  · have h := ThetaDot_nonpos hord hk (hmin s hs) hcase
    have : 0 ≤ L * (Thetav N (cfg x s) k - Ts) := mul_nonneg hL0 (by linarith)
    linarith
  · push_neg at hcase
    have h := ThetaDot_le hord hk (hmin s hs) hcase.le (by linarith)
    have hnum : 0 ≤ 16 * (Thetav N (cfg x s) k - ThetaB) := by linarith
    have hsq : gmin ^ 2 ≤ (gapv (cfg x s) k) ^ 2 := by
      have := hgle s hs
      nlinarith [hgmin_pos]
    have hdiv : 16 * (Thetav N (cfg x s) k - ThetaB) / (gapv (cfg x s) k) ^ 2
        ≤ 16 * (Thetav N (cfg x s) k - ThetaB) / gmin ^ 2 :=
      div_le_div_of_nonneg_left hnum (by positivity) hsq
    have hLeq : L * (Thetav N (cfg x s) k - Ts)
        = 16 * (Thetav N (cfg x s) k - Ts) / gmin ^ 2 := by
      rw [hLdef]; ring
    have hmono : 16 * (Thetav N (cfg x s) k - ThetaB) / gmin ^ 2
        ≤ 16 * (Thetav N (cfg x s) k - Ts) / gmin ^ 2 := by
      exact (div_le_div_iff_of_pos_right (by positivity)).mpr (by linarith)
    linarith [h, hdiv, hmono, hLeq.ge, hLeq.le]

end ThetaTrap
