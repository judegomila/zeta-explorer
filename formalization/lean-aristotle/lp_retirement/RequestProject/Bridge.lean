import RequestProject.Defs
import RequestProject.GaussianLP

/-!
# Bridges between the probe-verbatim vocabulary and the package vocabulary

* `MathlibBridge.hasOnlyRealRoots_iff_of_ne_zero`: for a nonzero real polynomial, the
  probe's root-count predicate (`Multiset.card p.roots = p.natDegree`) is equivalent to
  the package's complex-root predicate (every complex root is real);
* `EntireLP.isLaguerrePolya_of_probe`: probe LP membership implies package LP membership
  (the direction needed to transfer the refutations to the probe's vocabulary);
* `EntireLP.gaussianScaled_probe_isLaguerrePolya`: the scaled Gaussian counterexample lies
  in the PROBE's Laguerre–Pólya class (conjugation symmetry proved directly, real-rooted
  approximants transported through the root-count bridge).
-/

open Filter Polynomial Topology

namespace MathlibBridge

/-- For a nonzero real polynomial the probe's multiplicity-counted root-count predicate
`Probe.HasOnlyRealRoots` coincides with the package's complex-root predicate
`MathlibBridge.HasOnlyRealRoots`.  (For `p = 0` the two genuinely differ: the zero
polynomial satisfies the root-count form but not the complex-root form.) -/
theorem hasOnlyRealRoots_iff_of_ne_zero (p : ℝ[X]) (hp : p ≠ 0) :
    Probe.HasOnlyRealRoots p ↔ HasOnlyRealRoots p := by
  classical
  have hinj : Function.Injective (algebraMap ℝ ℂ) := (algebraMap ℝ ℂ).injective
  have hpC : p.map (algebraMap ℝ ℂ) ≠ 0 := by
    simpa [Polynomial.map_eq_zero_iff hinj] using hp
  have heval : ∀ z : ℂ, Polynomial.aeval z p = (p.map (algebraMap ℝ ℂ)).eval z := by
    intro z
    rw [Polynomial.aeval_def, Polynomial.eval_map]
  constructor
  · -- root-count form ⇒ every complex root is real
    intro hcard z hz
    have hsplit : p.Splits := Polynomial.splits_iff_card_roots.mpr hcard
    have hroots : (p.map (algebraMap ℝ ℂ)).roots = p.roots.map (algebraMap ℝ ℂ) :=
      hsplit.roots_map_of_ne_zero hpC
    have hzC : (p.map (algebraMap ℝ ℂ)).eval z = 0 := by
      rw [← heval z]; exact hz
    have hzmem : z ∈ (p.map (algebraMap ℝ ℂ)).roots := Polynomial.mem_roots'.mpr ⟨hpC, hzC⟩
    rw [hroots, Multiset.mem_map] at hzmem
    obtain ⟨r, -, hr⟩ := hzmem
    rw [← hr]
    simp
  · -- every complex root is real ⇒ root-count form
    intro h
    have hub : Multiset.card p.roots ≤ p.natDegree := Polynomial.card_roots' p
    have hsplitC : (p.map (algebraMap ℝ ℂ)).Splits := IsAlgClosed.splits _
    have hcardC : Multiset.card (p.map (algebraMap ℝ ℂ)).roots = p.natDegree := by
      have hc := Polynomial.splits_iff_card_roots.mp hsplitC
      rwa [Polynomial.natDegree_map] at hc
    -- every complex root of `p` is real, with the SAME multiplicity as the real root
    have hle : (p.map (algebraMap ℝ ℂ)).roots ≤ p.roots.map (algebraMap ℝ ℂ) := by
      rw [Multiset.le_iff_count]
      intro b
      by_cases hb : b ∈ (p.map (algebraMap ℝ ℂ)).roots
      · have hbroot : Polynomial.aeval b p = 0 := by
          rw [heval b]; exact (Polynomial.mem_roots'.mp hb).2
        have him : b.im = 0 := h b hbroot
        have hbre : (algebraMap ℝ ℂ) b.re = b := by
          apply Complex.ext <;> simp [him]
        have h1 : Multiset.count b (p.map (algebraMap ℝ ℂ)).roots
            = Polynomial.rootMultiplicity b.re p := by
          rw [Polynomial.count_roots, Polynomial.eq_rootMultiplicity_map hinj b.re, hbre]
        have h2 : Multiset.count b (p.roots.map (algebraMap ℝ ℂ))
            = Polynomial.rootMultiplicity b.re p := by
          conv_lhs => rw [← hbre]
          rw [Multiset.count_map_eq_count' _ _ hinj, Polynomial.count_roots]
        rw [h1, h2]
      · rw [Multiset.count_eq_zero.mpr hb]
        exact Nat.zero_le _
    have hlb : p.natDegree ≤ Multiset.card p.roots := by
      calc p.natDegree = Multiset.card (p.map (algebraMap ℝ ℂ)).roots := hcardC.symm
        _ ≤ Multiset.card (p.roots.map (algebraMap ℝ ℂ)) := Multiset.card_le_card hle
        _ = Multiset.card p.roots := Multiset.card_map _ _
    exact le_antisymm hub hlb

end MathlibBridge

namespace EntireLP

/-- Probe Laguerre–Pólya membership implies package Laguerre–Pólya membership.  The
symmetry conjunct is dropped; the probe's root-count approximants are converted to
complex-root approximants, replacing any zero polynomial `P n` by the nonzero real-rooted
polynomial `(n+1)⁻¹ • X` (whose entire image is uniformly small on bounded sets, so local
uniform convergence survives: wherever `P n = 0` the limit is within `ε/2` of `0`). -/
theorem isLaguerrePolya_of_probe {f : ℂ → ℂ} (hf : Probe.IsLaguerrePolya f) :
    IsLaguerrePolya f := by
  classical
  obtain ⟨-, P, hroots, hconv⟩ := hf
  refine ⟨fun n => if P n = 0 then Polynomial.C (((n : ℝ) + 1)⁻¹) * Polynomial.X else P n,
    fun n => ?_, ?_⟩
  · -- the modified approximants have only real (complex) roots
    show MathlibBridge.HasOnlyRealRoots
      (if P n = 0 then Polynomial.C (((n : ℝ) + 1)⁻¹) * Polynomial.X else P n)
    by_cases hn : P n = 0
    · rw [if_pos hn]
      intro z hz
      have ha : (((n : ℝ) + 1)⁻¹ : ℝ) ≠ 0 := by positivity
      rw [map_mul, Polynomial.aeval_C, Polynomial.aeval_X, Complex.coe_algebraMap] at hz
      rcases mul_eq_zero.mp hz with h0 | h0
      · exact absurd h0 (Complex.ofReal_ne_zero.mpr ha)
      · simp [h0]
    · rw [if_neg hn]
      exact (MathlibBridge.hasOnlyRealRoots_iff_of_ne_zero _ hn).mp (hroots n)
  · -- the modified approximants still converge locally uniformly to `f`
    rw [Metric.tendstoLocallyUniformly_iff] at hconv ⊢
    intro ε hε x
    obtain ⟨t, ht, hev⟩ := hconv (ε / 2) (half_pos hε) x
    refine ⟨t ∩ Metric.ball x 1, Filter.inter_mem ht (Metric.ball_mem_nhds x one_pos), ?_⟩
    have htail : Tendsto (fun n : ℕ => (‖x‖ + 1) * ((n : ℝ) + 1)⁻¹) atTop (𝓝 0) := by
      have h0 : Tendsto (fun n : ℕ => 1 / ((n : ℝ) + 1)) atTop (𝓝 0) :=
        tendsto_one_div_add_atTop_nhds_zero_nat
      simpa [one_div] using h0.const_mul (‖x‖ + 1)
    filter_upwards [hev, htail.eventually (gt_mem_nhds (half_pos hε))] with n hn htn y hy
    obtain ⟨hyt, hyb⟩ := hy
    show dist (f y)
      (toEntire (if P n = 0 then Polynomial.C (((n : ℝ) + 1)⁻¹) * Polynomial.X else P n) y) < ε
    by_cases h0 : P n = 0
    · rw [if_pos h0]
      have hyn : ‖y‖ ≤ ‖x‖ + 1 := by
        have h1 : dist y x < 1 := Metric.mem_ball.mp hyb
        have h2 : ‖y‖ ≤ ‖x‖ + ‖y - x‖ := by simpa using norm_add_le x (y - x)
        rw [dist_eq_norm] at h1
        linarith
      have hval : toEntire (Polynomial.C (((n : ℝ) + 1)⁻¹) * Polynomial.X) y
          = ((((n : ℝ) + 1)⁻¹ : ℝ) : ℂ) * y := by
        simp [toEntire]
      have hpos : (0 : ℝ) < ((n : ℝ) + 1)⁻¹ := by positivity
      have hnorm : ‖((((n : ℝ) + 1)⁻¹ : ℝ) : ℂ) * y‖ ≤ (‖x‖ + 1) * ((n : ℝ) + 1)⁻¹ := by
        rw [norm_mul, Complex.norm_real, Real.norm_eq_abs, abs_of_pos hpos, mul_comm]
        exact mul_le_mul_of_nonneg_right hyn hpos.le
      have hf0 : dist (f y) 0 < ε / 2 := by
        have hy0 := hn y hyt
        rw [h0] at hy0
        simpa [toEntire] using hy0
      calc dist (f y) (toEntire (Polynomial.C (((n : ℝ) + 1)⁻¹) * Polynomial.X) y)
          ≤ dist (f y) 0 + dist 0 (toEntire (Polynomial.C (((n : ℝ) + 1)⁻¹) * Polynomial.X) y) :=
            dist_triangle _ _ _
        _ < ε / 2 + ε / 2 := by
            refine add_lt_add hf0 ?_
            rw [hval, dist_zero_left]
            exact lt_of_le_of_lt hnorm htn
        _ = ε := add_halves ε
    · rw [if_neg h0]
      exact lt_of_lt_of_le (hn y hyt) (half_le_self hε.le)

/-- The Gaussian approximants `(1 - (c²/n) X²)^n` are nonzero polynomials. -/
theorem gaussianApprox_ne_zero (c : ℝ) (n : ℕ) : gaussianApprox c n ≠ 0 := by
  rw [gaussianApprox]
  apply pow_ne_zero
  intro h0
  have h1 := congrArg (Polynomial.eval 0) h0
  simp at h1

/-- The Gaussian approximants satisfy the PROBE's root-count real-rootedness predicate. -/
theorem gaussianApprox_probe_hasOnlyRealRoots (c : ℝ) (n : ℕ) :
    Probe.HasOnlyRealRoots (gaussianApprox c n) :=
  (MathlibBridge.hasOnlyRealRoots_iff_of_ne_zero _ (gaussianApprox_ne_zero c n)).mpr
    (gaussianApprox_hasOnlyRealRoots c n)

/-- Conjugation symmetry (real on `ℝ`) of the scaled Gaussian. -/
theorem gaussianScaled_conj (c : ℝ) (z : ℂ) :
    gaussian ((c : ℂ) * starRingEnd ℂ z) = starRingEnd ℂ (gaussian ((c : ℂ) * z)) := by
  simp only [gaussian]
  rw [← Complex.exp_conj]
  congr 1
  rw [map_neg, map_pow, map_mul, Complex.conj_ofReal]

/-- **The scaled Gaussian lies in the PROBE's Laguerre–Pólya class**: it is conjugation
symmetric and is the locally uniform limit of the real polynomials `(1 - (c²/n) X²)^n`,
which satisfy the probe's root-count real-rootedness predicate. -/
theorem gaussianScaled_probe_isLaguerrePolya (c : ℝ) :
    Probe.IsLaguerrePolya (fun z : ℂ => gaussian ((c : ℂ) * z)) := by
  refine ⟨fun z => gaussianScaled_conj c z, gaussianApprox c,
    fun n => gaussianApprox_probe_hasOnlyRealRoots c n, ?_⟩
  have h := tendstoLocallyUniformly_gaussianScaled c
  refine h.congr fun n => ?_
  intro z
  exact (toEntire_gaussianApprox c n z).symm

end EntireLP
