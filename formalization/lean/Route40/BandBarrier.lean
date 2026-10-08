/-
Route 40 (b9) — band barriers BB1/BB2: formal core of Theorem BB (lemma-B-two-band.md §6.1).

Compiled against Mathlib d13f23b7 / Lean 4.34.1 (tree /tmp/qrh-verify/lean).

What is formalised:
* `expNeg_bounds`      : A_{2j+1}(x) ≤ e^{-x} ≤ A_{2j}(x) for all x ≥ 0 and all j, where
                         A_m(x) = Σ_{i≤m} (-x)^i/i!  (the Leibniz bounds A₁₇ ≤ e^{-x} ≤ A₁₈ of §6.1.1;
                         proved for every x ≥ 0, not only 0 ≤ x < 1)
* `barrier_hasDerivAt` : B(t) = (q + 2/c) e^{-c(t - t_k)} - 2/c solves B' = -2 - c B      (B-i)
* `barrier_step_upper`, `barrier_substep_bounds` : (B-ii), (B-iv)
* `first_contact`      : scalar first-contact barrier theorem (Steps 2, 3, 5 of Theorem BB for one
                         smooth trajectory Q(t) = (Im z(t))² against a lower semicontinuous, piecewise
                         C¹ barrier with left derivatives)
* `lemmaC_rate`        : the algebra of Lemma C (a)–(e): Q' < -2 - c_k Y*²
* `selfpair_sharp`, `selfpair_catalogue`, `selfpair_high` : the self-pair cap identities of E2
* `H2_mu1`, `H2_mu3`, `H2_mu5_sharp` : the leading Taylor coefficients μ₁, μ₃, μ₅ of Lemma H2
* `H2_tail_series`     : Σ_{n≥N} n x^{n-1} ≤ N x^{N-1}/(1-x)²  (used for E_N(D) in Lemma H2)

What is NOT formalised (kept as named hypotheses or left to the paper):
the zero-set reduction (Hurwitz, P15-3.1 branch velocity formula, backward Hermite splitting at a
multiple zero), the Hadamard probe identity, the source floors (F), the kernel certificates (K),
the consumer checks E1–E8 and the exact rational check μ_lead D_W² > E_N(D_W).
-/
import Mathlib

open Real Set Filter Topology Finset

namespace Route40

/-! ### Leibniz bounds for e^{-x} -/

/-- `A m x = Σ_{i=0}^{m} (-x)^i / i!`. -/
noncomputable def A (m : ℕ) (x : ℝ) : ℝ := ∑ i ∈ range (m + 1), (-x) ^ i / (i.factorial : ℝ)

lemma A_zero_at (m : ℕ) : A m 0 = 1 := by
  unfold A
  rw [Finset.sum_range_succ']
  simp

lemma A_succ (m : ℕ) (x : ℝ) : A (m + 1) x = A m x + (-x) ^ (m + 1) / ((m + 1).factorial : ℝ) := by
  unfold A
  rw [Finset.sum_range_succ]

/-- `d/dx A (m+1) = - A m`. -/
lemma A_hasDerivAt (m : ℕ) (x : ℝ) : HasDerivAt (A (m + 1)) (-A m x) x := by
  induction m generalizing x with
  | zero =>
    have : A 1 = fun x => 1 - x := by
      funext y; unfold A; simp [Finset.sum_range_succ]; ring
    rw [this]
    have hA0 : A 0 x = 1 := by unfold A; simp
    rw [hA0]
    simpa using (hasDerivAt_id x).const_sub 1
  | succ m ih =>
    have hfun : A (m + 2) = fun y => A (m + 1) y + (-y) ^ (m + 2) / ((m + 2).factorial : ℝ) := by
      funext y; exact A_succ (m + 1) y
    rw [hfun]
    have h2 : HasDerivAt (fun y : ℝ => (-y) ^ (m + 2) / ((m + 2).factorial : ℝ))
        (((m + 2 : ℕ) : ℝ) * (-x) ^ (m + 1) * (-1) / ((m + 2).factorial : ℝ)) x := by
      have := ((hasDerivAt_neg x).pow (m + 2)).div_const ((m + 2).factorial : ℝ)
      simpa using this
    have key : -A (m + 1) x = -A m x +
        ((m + 2 : ℕ) : ℝ) * (-x) ^ (m + 1) * (-1) / ((m + 2).factorial : ℝ) := by
      rw [A_succ m x]
      have hf : ((m + 2).factorial : ℝ) = ((m + 2 : ℕ) : ℝ) * ((m + 1).factorial : ℝ) := by
        rw [Nat.factorial_succ]; push_cast; ring
      rw [hf]
      have h1 : ((m + 1).factorial : ℝ) ≠ 0 := by positivity
      have h3 : ((m + 2 : ℕ) : ℝ) ≠ 0 := by positivity
      field_simp
      ring
    rw [key]
    exact (ih x).add h2

lemma A_continuous (m : ℕ) : Continuous (A m) := by
  unfold A
  fun_prop

/-- Sign of the Taylor remainder: `(-1)^(m+1) (e^{-x} - A m x) ≥ 0` for `x ≥ 0`. -/
theorem expNeg_remainder_sign (m : ℕ) : ∀ x : ℝ, 0 ≤ x → 0 ≤ (-1) ^ (m + 1) * (exp (-x) - A m x) := by
  induction m with
  | zero =>
    intro x hx
    have hA0 : A 0 x = 1 := by unfold A; simp
    rw [hA0]
    have : exp (-x) ≤ 1 := by rw [exp_le_one_iff]; linarith
    norm_num
    linarith
  | succ m ih =>
    -- S(x) = (-1)^(m+2) (e^{-x} - A (m+1) x) has derivative (-1)^(m+1)(e^{-x} - A m x) ≥ 0
    set S : ℝ → ℝ := fun x => (-1) ^ (m + 2) * (exp (-x) - A (m + 1) x) with hS
    have hder : ∀ x, HasDerivAt S ((-1) ^ (m + 1) * (exp (-x) - A m x)) x := by
      intro x
      have h1 : HasDerivAt (fun x => exp (-x)) (-exp (-x)) x := by
        simpa using (hasDerivAt_neg x).exp
      have h2 := (h1.sub (A_hasDerivAt m x)).const_mul ((-1 : ℝ) ^ (m + 2))
      convert h2 using 1
      rw [pow_succ]; ring
    have hmono : MonotoneOn S (Ici 0) := by
      refine monotoneOn_of_hasDerivWithinAt_nonneg (convex_Ici 0)
        (fun x _ => (hder x).continuousAt.continuousWithinAt)
        (fun x _ => (hder x).hasDerivWithinAt) ?_
      intro x hx
      rw [interior_Ici] at hx
      exact ih x (le_of_lt hx)
    intro x hx
    have h0 : S 0 = 0 := by simp [hS, A_zero_at]
    have := hmono (Set.mem_Ici.mpr le_rfl) hx hx
    rw [h0] at this
    exact this

/-- **Leibniz bounds.** For every `x ≥ 0` and `j`: `A (2j+1) x ≤ e^{-x} ≤ A (2j) x`.
In particular `A 17 x ≤ e^{-x} ≤ A 18 x` (§6.1.1 of lemma-B-two-band.md). -/
theorem expNeg_bounds (j : ℕ) (x : ℝ) (hx : 0 ≤ x) :
    A (2 * j + 1) x ≤ exp (-x) ∧ exp (-x) ≤ A (2 * j) x := by
  constructor
  · have h := expNeg_remainder_sign (2 * j + 1) x hx
    have : ((-1 : ℝ)) ^ (2 * j + 1 + 1) = 1 := by
      rw [show 2 * j + 1 + 1 = 2 * (j + 1) by ring, pow_mul]; norm_num
    rw [this, one_mul] at h
    linarith
  · have h := expNeg_remainder_sign (2 * j) x hx
    have : ((-1 : ℝ)) ^ (2 * j + 1) = -1 := by
      rw [pow_succ, pow_mul]; norm_num
    rw [this] at h
    linarith

theorem A17_le_expNeg_le_A18 (x : ℝ) (hx : 0 ≤ x) : A 17 x ≤ exp (-x) ∧ exp (-x) ≤ A 18 x := by
  have h8 := expNeg_bounds 8 x hx
  have h9 := expNeg_bounds 9 x hx
  norm_num at h8 h9
  exact ⟨h8.1, h9.2⟩

/-! ### The barrier on one substep -/

/-- (B-i): `B(t) = (q + 2/c) e^{-c(t - tk)} - 2/c` satisfies `B' = -2 - c B`. -/
theorem barrier_hasDerivAt (q c tk t : ℝ) (hc : c ≠ 0) :
    HasDerivAt (fun t => (q + 2 / c) * exp (-(c * (t - tk))) - 2 / c)
      (-2 - c * ((q + 2 / c) * exp (-(c * (t - tk))) - 2 / c)) t := by
  have h1 : HasDerivAt (fun t => -(c * (t - tk))) (-(c * 1)) t :=
    (((hasDerivAt_id t).sub_const tk).const_mul c).neg
  have h2 := (h1.exp.const_mul (q + 2 / c)).sub_const (2 / c)
  convert h2 using 1
  field_simp
  ring

/-- (B-ii): with `q + 2/c ≥ 0`, `c > 0`, `δ ≥ 0`, the substep end value is at most the
`A₁₈` enclosure the consumer stores. -/
theorem barrier_step_upper (q c δ : ℝ) (hq : 0 ≤ q + 2 / c) (hc : 0 < c) (hδ : 0 ≤ δ) :
    (q + 2 / c) * exp (-(c * δ)) - 2 / c ≤ (q + 2 / c) * A 18 (c * δ) - 2 / c := by
  have := (A17_le_expNeg_le_A18 (c * δ) (by positivity)).2
  nlinarith

/-- (B-iv): on a substep `t ∈ [tk, tk + δ]`, `L_k ≤ B(t) ≤ q` with
`L_k = (q + 2/c) A₁₇(cδ) - 2/c`. -/
theorem barrier_substep_bounds (q c δ tk t : ℝ) (hq : 0 ≤ q + 2 / c) (hc : 0 < c)
    (ht0 : tk ≤ t) (ht1 : t ≤ tk + δ) :
    (q + 2 / c) * A 17 (c * δ) - 2 / c ≤ (q + 2 / c) * exp (-(c * (t - tk))) - 2 / c ∧
      (q + 2 / c) * exp (-(c * (t - tk))) - 2 / c ≤ q := by
  have hδ : 0 ≤ δ := by linarith
  have hA := (A17_le_expNeg_le_A18 (c * δ) (by positivity)).1
  have hmono : exp (-(c * δ)) ≤ exp (-(c * (t - tk))) := by
    apply exp_le_exp.mpr
    have : c * (t - tk) ≤ c * δ := mul_le_mul_of_nonneg_left (by linarith) hc.le
    linarith
  have hle1 : exp (-(c * (t - tk))) ≤ 1 := by
    rw [exp_le_one_iff]
    have : 0 ≤ c * (t - tk) := mul_nonneg hc.le (by linarith)
    linarith
  constructor
  · nlinarith
  · have : (q + 2 / c) * exp (-(c * (t - tk))) ≤ (q + 2 / c) * 1 :=
      mul_le_mul_of_nonneg_left hle1 hq
    linarith

/-! ### First contact (scalar form of Theorem BB, Steps 2, 3, 5) -/

/-- If `f(x₀) = 0` and `f` has left derivative `f' > 0` at `x₀`, then `f < 0` just to the left. -/
lemma neg_left_of_pos_deriv (f : ℝ → ℝ) (x₀ f' : ℝ) (hf : HasDerivWithinAt f f' (Iic x₀) x₀)
    (h0 : f x₀ = 0) (hpos : 0 < f') : ∀ᶠ y in 𝓝[<] x₀, f y < 0 := by
  have hIio : HasDerivWithinAt f f' (Iio x₀) x₀ := hf.mono Iio_subset_Iic_self
  rw [hasDerivWithinAt_iff_tendsto_slope' (show x₀ ∉ Iio x₀ from lt_irrefl x₀)] at hIio
  have hev := hIio.eventually (lt_mem_nhds hpos)
  filter_upwards [hev, self_mem_nhdsWithin] with y hy hyl
  rw [slope_def_field, h0, sub_zero] at hy
  have hd : y - x₀ < 0 := sub_neg.mpr hyl
  by_contra hc
  push Not at hc
  have : f y / (y - x₀) ≤ 0 := div_nonpos_of_nonneg_of_nonpos hc hd.le
  linarith

/-- **First-contact barrier theorem (scalar).**
`Q` continuous on `[τ₀, tₑ]`, `B` lower semicontinuous on `[τ₀, tₑ]` with a left derivative
`b' t` at every `t ∈ (τ₀, tₑ]` (so `B` is left-continuous; upward jumps are allowed), and
`Q(τ₀) < B(τ₀)`.  If at every contact `t ∈ (τ₀, tₑ]` with `Q t = B t` the trajectory has a left
derivative strictly below `b' t`, then `Q < B` on all of `[τ₀, tₑ]`.

In Theorem BB, `Q(t) = (Im z(t))²` along the topmost zero branch, `b' t = -2 - c_k B(t)` (B-i),
and the contact hypothesis is Lemma C (`lemmaC_rate`). -/
theorem first_contact (Q B b' : ℝ → ℝ) (τ₀ tₑ : ℝ)
    (hQc : ContinuousOn Q (Icc τ₀ tₑ)) (hBl : LowerSemicontinuousOn B (Icc τ₀ tₑ))
    (hBd : ∀ t ∈ Ioc τ₀ tₑ, HasDerivWithinAt B (b' t) (Iic t) t)
    (hcontact : ∀ t ∈ Ioc τ₀ tₑ, Q t = B t →
      ∃ q', HasDerivWithinAt Q q' (Iic t) t ∧ q' < b' t)
    (h0 : Q τ₀ < B τ₀) :
    ∀ t ∈ Icc τ₀ tₑ, Q t < B t := by
  by_contra hcon
  push Not at hcon
  set F : Set ℝ := {t ∈ Icc τ₀ tₑ | B t ≤ Q t} with hF
  have hne : F.Nonempty := by
    obtain ⟨t, ht, hle⟩ := hcon
    exact ⟨t, ht, hle⟩
  -- F is closed: B - Q is lsc on the closed set Icc
  have hlsc : LowerSemicontinuousOn (fun t => B t - Q t) (Icc τ₀ tₑ) := by
    have hQ' : LowerSemicontinuousOn (fun t => -Q t) (Icc τ₀ tₑ) :=
      (hQc.neg).lowerSemicontinuousOn
    simpa [sub_eq_add_neg] using hBl.add hQ'
  have hclosed : IsClosed F := by
    obtain ⟨v, hv, hveq⟩ := (lowerSemicontinuousOn_iff_preimage_Iic.mp hlsc) 0
    have hset : F = Icc τ₀ tₑ ∩ (fun t => B t - Q t) ⁻¹' Iic 0 := by
      ext t; simp [hF]
    rw [hset, hveq]; exact isClosed_Icc.inter hv
  have hbdd : BddBelow F := ⟨τ₀, fun t ht => ht.1.1⟩
  set ts := sInf F with hts
  have hts_mem : ts ∈ F := hclosed.csInf_mem hne hbdd
  have hts_ne : ts ≠ τ₀ := by
    intro h; have := hts_mem.2; rw [h] at this; linarith
  have hts_gt : τ₀ < ts := lt_of_le_of_ne hts_mem.1.1 (Ne.symm hts_ne)
  have hts_Ioc : ts ∈ Ioc τ₀ tₑ := ⟨hts_gt, hts_mem.1.2⟩
  -- before ts: Q < B
  have hbefore : ∀ t, τ₀ ≤ t → t < ts → Q t < B t := by
    intro t ht1 ht2
    by_contra hc
    push Not at hc
    have : t ∈ F := ⟨⟨ht1, by linarith [hts_mem.1.2]⟩, hc⟩
    have := csInf_le hbdd this
    linarith
  -- left continuity of B - Q at ts gives B ts - Q ts ≥ 0, hence equality
  have hBcont : ContinuousWithinAt B (Iic ts) ts := (hBd ts hts_Ioc).continuousWithinAt
  have hQcont : ContinuousWithinAt Q (Icc τ₀ ts) ts :=
    (hQc ts hts_mem.1).mono (Icc_subset_Icc le_rfl hts_mem.1.2)
  have hge : 0 ≤ B ts - Q ts := by
    have hc : ContinuousWithinAt (fun t => B t - Q t) (Ico τ₀ ts) ts :=
      (hBcont.mono (fun t ht => ht.2.le)).sub (hQcont.mono Ico_subset_Icc_self)
    have hcl : ts ∈ closure (Ico τ₀ ts) := by
      rw [closure_Ico (ne_of_lt hts_gt)]; exact ⟨hts_gt.le, le_rfl⟩
    exact ContinuousWithinAt.closure_le hcl continuousWithinAt_const hc
      (fun t ht => by have := hbefore t ht.1 ht.2; linarith)
  have heq : Q ts = B ts := by linarith [hts_mem.2]
  obtain ⟨q', hq'd, hq'lt⟩ := hcontact ts hts_Ioc heq
  -- (B - Q) has left derivative b' ts - q' > 0 and vanishes at ts
  have hd : HasDerivWithinAt (fun t => B t - Q t) (b' ts - q') (Iic ts) ts :=
    (hBd ts hts_Ioc).sub hq'd
  have hev := neg_left_of_pos_deriv (fun t => B t - Q t) ts (b' ts - q') hd
    (by simp [heq]) (by linarith)
  -- but just to the left of ts (and to the right of τ₀) B - Q > 0
  have hev2 : ∀ᶠ t in 𝓝[<] ts, τ₀ < t := by
    have : Ioi τ₀ ∈ 𝓝 ts := Ioi_mem_nhds hts_gt
    exact nhdsWithin_le_nhds this
  have hev3 : ∀ᶠ t in 𝓝[<] ts, t < ts := self_mem_nhdsWithin
  obtain ⟨t, h1, h2, h3⟩ := (hev.and (hev2.and hev3)).exists
  have := hbefore t h2.le h3
  linarith

/-! ### Lemma C: the rate at a contact (algebra of steps (a)–(e)) -/

/-- **Lemma C, algebraic core.**  `Q' = -2 - 4 Y Σ'`, the summed pairwise inequality
`2 Σ' ≥ lam (Y/h)(P - Kself)` (steps (c), (d)), the floor `P > ℓ` (step (e), source floors),
the self-pair cap `Kself ≤ cap/h` (E2) and the rate identity `c = (2 lam/h)(ℓ - cap/h)` (E3)
give `Q' < -2 - c Y²`. -/
theorem lemmaC_rate (Q' Y h lam T P Kself ℓ cap c : ℝ) (hY : 0 < Y) (hh : 0 < h) (hlam : 0 < lam)
    (hQ : Q' = -2 - 4 * Y * T) (hpair : lam * (Y / h) * (P - Kself) ≤ 2 * T)
    (hfloor : ℓ < P) (hcap : Kself ≤ cap / h) (hc : c = 2 * lam / h * (ℓ - cap / h)) :
    Q' < -2 - c * Y ^ 2 := by
  have h1 : ℓ - cap / h < P - Kself := by linarith
  have h2 : 0 < 2 * lam * Y ^ 2 / h := by positivity
  have h3 : 2 * lam * Y ^ 2 / h * (ℓ - cap / h) < 2 * lam * Y ^ 2 / h * (P - Kself) :=
    mul_lt_mul_of_pos_left h1 h2
  have h4 : 2 * lam * Y ^ 2 / h * (P - Kself) = 2 * Y * (lam * (Y / h) * (P - Kself)) := by
    field_simp
  have h5 : 2 * Y * (lam * (Y / h) * (P - Kself)) ≤ 2 * Y * (2 * T) :=
    mul_le_mul_of_nonneg_left hpair (by positivity)
  have h6 : c * Y ^ 2 = 2 * lam * Y ^ 2 / h * (ℓ - cap / h) := by rw [hc]; field_simp
  rw [hQ, h6]
  linarith

/-! ### Self-pair caps (E2) -/

/-- The pair kernel `K_c(d, b) = (c - b)/(d² + (c - b)²) + (c + b)/(d² + (c + b)²)`. -/
noncomputable def Kc (c d b : ℝ) : ℝ := (c - b) / (d ^ 2 + (c - b) ^ 2) + (c + b) / (d ^ 2 + (c + b) ^ 2)

/-- Sharp law (AF Part II eq. (3)): with `a² = (h² - y²)/3`, `h K_h(a, y) = 6/(4 - y²/h²)`. -/
theorem selfpair_sharp (h y a : ℝ) (hh : 0 < h) (hy : 0 ≤ y) (hyh : y < h)
    (ha : a ^ 2 = (h ^ 2 - y ^ 2) / 3) :
    h * Kc h a y = 6 / (4 - y ^ 2 / h ^ 2) := by
  unfold Kc
  rw [ha]
  have e1 : (h ^ 2 - y ^ 2) / 3 + (h - y) ^ 2 = (h - y) * (4 * h - 2 * y) / 3 := by ring
  have e2 : (h ^ 2 - y ^ 2) / 3 + (h + y) ^ 2 = (h + y) * (4 * h + 2 * y) / 3 := by ring
  rw [e1, e2]
  have p1 : 0 < h - y := by linarith
  have p2 : 0 < 4 * h - 2 * y := by linarith
  have p3 : 0 < h + y := by linarith
  have p4 : 0 < 4 * h + 2 * y := by linarith
  have p5 : 0 < 4 - y ^ 2 / h ^ 2 := by
    have : y ^ 2 / h ^ 2 < 1 := by
      rw [div_lt_one (by positivity)]; nlinarith
    linarith
  have p6 : 0 < 4 * h ^ 2 - y ^ 2 := by nlinarith
  have t1 : (h - y) / ((h - y) * (4 * h - 2 * y) / 3) = 3 / (4 * h - 2 * y) := by
    field_simp
  have t2 : (h + y) / ((h + y) * (4 * h + 2 * y) / 3) = 3 / (4 * h + 2 * y) := by
    field_simp
  rw [t1, t2, show (4 : ℝ) - y ^ 2 / h ^ 2 = (4 * h ^ 2 - y ^ 2) / h ^ 2 by field_simp]
  rw [div_add_div _ _ p2.ne' p4.ne', div_div_eq_mul_div, mul_div_assoc',
    div_eq_div_iff (by positivity) p6.ne']
  ring

/-- Catalogue self-pair: `h K_h(r h, s h) = 2(1 + r² - v)/((1 + r² - v)² + 4 r² v)`, `v = s²`. -/
theorem selfpair_catalogue (h r s : ℝ) (hh : 0 < h) (hr : 0 < r) :
    h * Kc h (r * h) (s * h) =
      2 * (1 + r ^ 2 - s ^ 2) / ((1 + r ^ 2 - s ^ 2) ^ 2 + 4 * r ^ 2 * s ^ 2) := by
  unfold Kc
  have hrh : 0 < (r * h) ^ 2 := by positivity
  have d1 : 0 < (r * h) ^ 2 + (h - s * h) ^ 2 := add_pos_of_pos_of_nonneg hrh (sq_nonneg _)
  have d2 : 0 < (r * h) ^ 2 + (h + s * h) ^ 2 := add_pos_of_pos_of_nonneg hrh (sq_nonneg _)
  have hprod : ((r * h) ^ 2 + (h - s * h) ^ 2) * ((r * h) ^ 2 + (h + s * h) ^ 2) =
      h ^ 4 * ((1 + r ^ 2 - s ^ 2) ^ 2 + 4 * r ^ 2 * s ^ 2) := by ring
  have d3 : 0 < (1 + r ^ 2 - s ^ 2) ^ 2 + 4 * r ^ 2 * s ^ 2 := by
    have := mul_pos d1 d2
    rw [hprod] at this
    exact pos_of_mul_pos_right this (by positivity)
  rw [div_add_div _ _ d1.ne' d2.ne', mul_div_assoc', div_eq_div_iff (by positivity) d3.ne']
  ring

/-- High-probe self-pair: `K_c(0, y) = 2c/(c² - y²)` for `0 ≤ y < c`. -/
theorem selfpair_high (c y : ℝ) (hy : 0 ≤ y) (hyc : y < c) :
    Kc c 0 y = 2 * c / (c ^ 2 - y ^ 2) := by
  unfold Kc
  have p1 : 0 < c - y := by linarith
  have p2 : 0 < c + y := by linarith
  have p3 : c ^ 2 - y ^ 2 = (c - y) * (c + y) := by ring
  rw [p3]
  field_simp
  ring

/-! ### Lemma H2: leading coefficients and the tail series -/

/-- `M_n` of Lemma H2 (catalogue / sharp form), with probe weight `k = λ y/(2h)`. -/
noncomputable def Mn (n : ℕ) (k y b h a : ℝ) : ℂ :=
  2 * (Complex.I * (y - b)) ^ n + 2 * (Complex.I * (y + b)) ^ n -
    (k : ℂ) *
      (((Complex.I * (h - b) - a) ^ n + (Complex.I * (h + b) - a) ^ n) +
       ((Complex.I * (h - b) + a) ^ n + (Complex.I * (h + b) + a) ^ n))

/-- `Im M₁ = (4 - 2λ) y` when `k = λ y/(2h)`, i.e. `μ₁ = 4 - 2λ`. -/
theorem H2_mu1 (lam y b h a k : ℝ) (hk : k * (2 * h) = lam * y) :
    (Mn 1 k y b h a).im = (4 - 2 * lam) * y := by
  unfold Mn
  simp [Complex.mul_im, Complex.ofReal_im]
  linear_combination (-2) * hk

/-- `λ = 2` (so `k h = y`), any displacement `a`: `Im M₃ = 4 y (h² - y² - 3a²)`; with `a = r h`
this is `μ₃ = 4h²(1 - 3r² - y²/h²)` (no dependence on the far height `b`). -/
theorem H2_mu3 (y b h a k : ℝ) (hk : k * h = y) :
    (Mn 3 k y b h a).im = 4 * y * (h ^ 2 - y ^ 2 - 3 * a ^ 2) := by
  unfold Mn
  simp [pow_succ, Complex.mul_im, Complex.mul_re, Complex.ofReal_im, Complex.ofReal_re]
  linear_combination (-4 * (3 * a ^ 2 - 3 * b ^ 2 - h ^ 2)) * hk

/-- Sharp law (`λ = 2` so `k h = y`, and `a² = (h² - y²)/3`): `Im M₃ = 0` and
`Im M₅ = (16/9) y (h² - y²)(4h² - y²)`, i.e. `μ₃ = 0`, `μ₅ = (16/9)(h² - y²)(4h² - y²)`. -/
theorem H2_mu5_sharp (y b h a k : ℝ) (hk : k * h = y) (ha : a ^ 2 = (h ^ 2 - y ^ 2) / 3) :
    (Mn 3 k y b h a).im = 0 ∧
      (Mn 5 k y b h a).im = 16 / 9 * y * (h ^ 2 - y ^ 2) * (4 * h ^ 2 - y ^ 2) := by
  constructor
  · rw [H2_mu3 y b h a k hk, ha]; ring
  · unfold Mn
    simp [pow_succ, Complex.mul_im, Complex.mul_re, Complex.ofReal_im, Complex.ofReal_re]
    linear_combination
      (-4 * (5 * a ^ 4 - 30 * a ^ 2 * b ^ 2 - 10 * a ^ 2 * h ^ 2 + 5 * b ^ 4 + 10 * b ^ 2 * h ^ 2
        + h ^ 4)) * hk + (20 * y * (-3 * a ^ 2 + 18 * b ^ 2 + 5 * h ^ 2 + y ^ 2) / 3) * ha

/-- Tail series of Lemma H2: `Σ_{k≥0} (N+k) x^{N+k-1} ≤ N x^{N-1}/(1-x)²` for `0 ≤ x < 1`,
`N ≥ 1`. -/
theorem H2_tail_series (N : ℕ) (hN : 1 ≤ N) (x : ℝ) (hx0 : 0 ≤ x) (hx1 : x < 1) :
    ∑' k : ℕ, ((N + k : ℕ) : ℝ) * x ^ (N + k - 1) ≤ N * x ^ (N - 1) / (1 - x) ^ 2 := by
  have hnx : ‖x‖ < 1 := by rw [Real.norm_eq_abs, abs_of_nonneg hx0]; exact hx1
  have hg : Summable (fun k : ℕ => x ^ k) := summable_geometric_of_lt_one hx0 hx1
  have hkg : Summable (fun k : ℕ => (k : ℝ) * x ^ k) := by
    simpa using (summable_pow_mul_geometric_of_norm_lt_one 1 hnx)
  have hterm : ∀ k : ℕ, ((N + k : ℕ) : ℝ) * x ^ (N + k - 1) =
      x ^ (N - 1) * ((N : ℝ) * x ^ k + (k : ℝ) * x ^ k) := by
    intro k
    have : N + k - 1 = (N - 1) + k := by omega
    rw [this, pow_add]; push_cast; ring
  simp_rw [hterm]
  rw [tsum_mul_left, (hg.mul_left (N : ℝ)).tsum_add hkg, tsum_mul_left,
    tsum_geometric_of_lt_one hx0 hx1, tsum_coe_mul_geometric_of_norm_lt_one hnx]
  have h1x : 0 < 1 - x := by linarith
  have hxN : 0 ≤ x ^ (N - 1) := pow_nonneg hx0 _
  rw [show (N : ℝ) * x ^ (N - 1) / (1 - x) ^ 2 = x ^ (N - 1) * (N / (1 - x) ^ 2) by ring]
  apply mul_le_mul_of_nonneg_left _ hxN
  have hN' : (1 : ℝ) ≤ N := by exact_mod_cast hN
  have e : (N : ℝ) * (1 - x)⁻¹ + x / (1 - x) ^ 2 = (N * (1 - x) + x) / (1 - x) ^ 2 := by
    field_simp
  rw [e]
  apply div_le_div_of_nonneg_right _ (by positivity)
  nlinarith

end Route40
