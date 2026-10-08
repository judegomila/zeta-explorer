/-
Route 40 (b9) — wol-pd lemma L2 (log-positivity of the b_n), formal version.

Source: formalization/paper/wol-pd-lemmas.md §2, Lemmas 2.1 and 2.3(a),(b).
Compiled against Mathlib d13f23b7 / Lean 4.34.1 (tree /tmp/qrh-verify/lean).

PROOF ROUTE (differs from the paper).  The paper proves Lemma 2.3(a) from the cluster expansion
(Lemma 2.2).  Here we use the heat equation in the Dirichlet ring instead:
  G_t(n) = exp(t log²n / 4) satisfies ∂_t G = ¼ D²G (D = multiplication by log n, a derivation of
  Dirichlet convolution), and the log-derivative coefficients β(t), defined by β * G = DG, satisfy
     4 ∂_t β = D²β + 2 β * Dβ,
  i.e. 4 β_n' = log²n β_n + 2 Σ_{de=n} β_d (log e) β_e.  Since β_1 = 0, the convolution only involves
  β_d with d < n, so by strong induction on n every β_n(t) is ≥ 0 and nondecreasing on t ≥ 0,
  starting from β(0) = Λ (von Mangoldt) ≥ 0.

Formalised statements:
* `D_mul`                : D is a derivation of Dirichlet convolution
* `b_mul_G`, `b_unique`  : β(t) is the unique arithmetic function with β * G_t = D G_t
* `b_zero_eq_vonMangoldt`: β(0) = Λ
* `hasDerivAt_b`         : 4 ∂_t β_n = (D²β + 2 β * Dβ)_n  (for every real t)
* `b_nonneg`, `b_monotoneOn` : β_n(t) ≥ 0 and nondecreasing on [0, ∞)            (Lemma 2.3(a), β part)
* `twist_mul`, `twist_D`  : twisting by a completely multiplicative χ                (Lemma 2.1)
* `logDeriv_eq_of_agree`  : β(a)_n depends only on a_d for d ≤ n                       (truncation step)
* `lemma_2_3_b`           : for the truncated coefficients a_n(t) of §0.1 and n ≤ N0,
                            b_n(t) = n^{-(1+h)/2 - tL/4} β_n(t) ≥ 0                    (Lemma 2.3(b))
Not formalised: strict positivity for t > 0 and real-analyticity (not used by the certificate).
-/
import Mathlib

open ArithmeticFunction Finset Real Set

namespace Route40.L2

/-! ### The derivation D -/

/-- `D f (n) = (log n) f(n)`. -/
noncomputable def D (f : ArithmeticFunction ℝ) : ArithmeticFunction ℝ := ArithmeticFunction.log.pmul f

lemma D_apply (f : ArithmeticFunction ℝ) (n : ℕ) : D f n = Real.log n * f n := by
  simp [D, pmul_apply]

lemma D_add (f g : ArithmeticFunction ℝ) : D (f + g) = D f + D g := by
  ext n; rw [D_apply, ArithmeticFunction.add_apply, ArithmeticFunction.add_apply, D_apply, D_apply,
    mul_add]

lemma af_sub_apply (f g : ArithmeticFunction ℝ) (n : ℕ) : (f - g) n = f n - g n := by
  rw [sub_eq_add_neg, ArithmeticFunction.add_apply, ArithmeticFunction.neg_apply, ← sub_eq_add_neg]

/-- `D` is a derivation of Dirichlet convolution. -/
lemma D_mul (f g : ArithmeticFunction ℝ) : D (f * g) = D f * g + f * D g := by
  ext n
  rw [D_apply, ArithmeticFunction.add_apply, ArithmeticFunction.mul_apply,
    ArithmeticFunction.mul_apply, ArithmeticFunction.mul_apply]
  simp only [D_apply]
  rw [Finset.mul_sum, ← Finset.sum_add_distrib]
  refine Finset.sum_congr rfl (fun x hx => ?_)
  obtain ⟨hxn, hn⟩ := Nat.mem_divisorsAntidiagonal.mp hx
  have h1 : x.1 ≠ 0 := by rintro h; rw [h, zero_mul] at hxn; exact hn hxn.symm
  have h2 : x.2 ≠ 0 := by rintro h; rw [h, mul_zero] at hxn; exact hn hxn.symm
  have hlog : Real.log (n : ℕ) = Real.log x.1 + Real.log x.2 := by
    rw [← hxn, Nat.cast_mul, Real.log_mul (by exact_mod_cast h1) (by exact_mod_cast h2)]
  rw [hlog]; ring

/-! ### Splitting a convolution at n -/

lemma conv_split (f g : ArithmeticFunction ℝ) {n : ℕ} (hn : n ≠ 0) :
    (f * g) n = f n * g 1 + ∑ d ∈ n.properDivisors, f d * g (n / d) := by
  rw [mul_apply, Nat.sum_divisorsAntidiagonal (fun a b => f a * g b),
    ← Nat.cons_self_properDivisors hn, Finset.sum_cons, Nat.div_self (Nat.pos_of_ne_zero hn)]

/-- Cancellation: if `G 1 = 1` then `X * G = Y * G` implies `X = Y`. -/
lemma cancel_right (X Y G : ArithmeticFunction ℝ) (hG : G 1 = 1) (h : X * G = Y * G) : X = Y := by
  ext n
  induction n using Nat.strong_induction_on with
  | _ n ih =>
    rcases Nat.eq_zero_or_pos n with rfl | hpos
    · simp only [ArithmeticFunction.map_zero]
    have hn : n ≠ 0 := hpos.ne'
    have e := congrArg (fun F : ArithmeticFunction ℝ => F n) h
    rw [conv_split X G hn, conv_split Y G hn, hG] at e
    have hs : ∑ d ∈ n.properDivisors, X d * G (n / d) = ∑ d ∈ n.properDivisors, Y d * G (n / d) :=
      Finset.sum_congr rfl (fun d hd => by rw [ih d (Nat.mem_properDivisors.mp hd).2])
    linarith

/-! ### G_t and the log-derivative coefficients β(t) -/

/-- `G_t(n) = exp(t log²n/4)` (`n ≥ 1`). -/
noncomputable def G (t : ℝ) : ArithmeticFunction ℝ :=
  ⟨fun n => if n = 0 then 0 else Real.exp (t * Real.log n ^ 2 / 4), by simp⟩

lemma G_apply (t : ℝ) {n : ℕ} (hn : n ≠ 0) : G t n = Real.exp (t * Real.log n ^ 2 / 4) := by
  simp [G, hn]

lemma G_one (t : ℝ) : G t 1 = 1 := by simp [G]

lemma G_pos (t : ℝ) {n : ℕ} (hn : n ≠ 0) : 0 < G t n := by rw [G_apply t hn]; exact Real.exp_pos _

/-- Coefficient recursion for β(t): `β_n = (log n) G_n - Σ_{d | n, d < n} β_d G_{n/d}`. -/
noncomputable def bf (t : ℝ) : ℕ → ℝ
  | n => if n = 0 then 0 else
      Real.log n * G t n - ∑ d ∈ n.properDivisors.attach, bf t d.1 * G t (n / d.1)
termination_by n => n
decreasing_by exact (Nat.mem_properDivisors.mp d.2).2

lemma bf_eq (t : ℝ) {n : ℕ} (hn : n ≠ 0) :
    bf t n = Real.log n * G t n - ∑ d ∈ n.properDivisors, bf t d * G t (n / d) := by
  rw [bf, if_neg hn]
  congr 1
  exact Finset.sum_attach n.properDivisors (fun d => bf t d * G t (n / d))

lemma bf_zero (t : ℝ) : bf t 0 = 0 := by rw [bf]; simp

/-- `β(t)` as an arithmetic function. -/
noncomputable def b (t : ℝ) : ArithmeticFunction ℝ := ⟨bf t, bf_zero t⟩

lemma b_apply (t : ℝ) (n : ℕ) : b t n = bf t n := rfl

lemma b_one (t : ℝ) : b t 1 = 0 := by
  rw [b_apply, bf_eq t one_ne_zero]; simp

/-- `β(t) * G_t = D G_t`. -/
theorem b_mul_G (t : ℝ) : b t * G t = D (G t) := by
  ext n
  rcases Nat.eq_zero_or_pos n with rfl | hpos
  · simp
  have hn : n ≠ 0 := hpos.ne'
  rw [conv_split _ _ hn, G_one, D_apply, b_apply, bf_eq t hn]
  simp only [b_apply]
  ring

/-- Uniqueness: any `β'` with `β' * G_t = D G_t` equals `β(t)`. -/
theorem b_unique (t : ℝ) (β' : ArithmeticFunction ℝ) (h : β' * G t = D (G t)) : β' = b t :=
  cancel_right β' (b t) (G t) (G_one t) (h.trans (b_mul_G t).symm)

/-- `β(0) = Λ`. -/
theorem b_zero_eq_vonMangoldt : b 0 = ArithmeticFunction.vonMangoldt := by
  have hG0 : G 0 = ((ArithmeticFunction.zeta : ArithmeticFunction ℕ) : ArithmeticFunction ℝ) := by
    ext n
    rcases Nat.eq_zero_or_pos n with rfl | hpos
    · simp
    rw [G_apply 0 hpos.ne', natCoe_apply, zeta_apply_ne hpos.ne']
    simp
  have hD : D (G 0) = ArithmeticFunction.log := by
    ext n
    rw [D_apply, hG0, natCoe_apply, log_apply]
    rcases Nat.eq_zero_or_pos n with rfl | hpos
    · simp
    rw [zeta_apply_ne hpos.ne']; simp
  symm
  apply b_unique
  rw [hD, hG0, ArithmeticFunction.vonMangoldt_mul_zeta]

/-! ### The heat equation for β -/

/-- `4 ∂_t β = D²β + 2 β * Dβ`, right-hand side as an arithmetic function. -/
noncomputable def R (t : ℝ) : ArithmeticFunction ℝ :=
  D (D (b t)) + (b t * D (b t) + b t * D (b t))

/-- Ring identity: `R * G = D³G - β * D²G`. -/
theorem R_mul_G (t : ℝ) : R t * G t = D (D (D (G t))) - b t * D (D (G t)) := by
  have H1 : D (G t) = b t * G t := (b_mul_G t).symm
  have h2 : D (D (G t)) = D (b t) * G t + b t * (b t * G t) := by
    rw [H1, D_mul, H1]
  have h3 : D (D (D (G t))) = D (D (b t)) * G t + D (b t) * (b t * G t) +
      (D (b t) * (b t * G t) + b t * (D (b t) * G t + b t * (b t * G t))) := by
    rw [h2, D_add, D_mul, D_mul, D_mul, H1]
  rw [h3, h2, R]
  ring

lemma hasDerivAt_G (n : ℕ) (t : ℝ) :
    HasDerivAt (fun s => G s n) (Real.log n ^ 2 / 4 * G t n) t := by
  rcases Nat.eq_zero_or_pos n with rfl | hpos
  · simp only [ArithmeticFunction.map_zero, mul_zero]; exact hasDerivAt_const t 0
  have hn : n ≠ 0 := hpos.ne'
  have hfun : (fun s => G s n) = fun s => Real.exp (s * Real.log n ^ 2 / 4) := by
    funext s; exact G_apply s hn
  rw [hfun, G_apply t hn]
  have h : HasDerivAt (fun s : ℝ => s * Real.log n ^ 2 / 4) (Real.log n ^ 2 / 4) t := by
    simpa using ((hasDerivAt_id t).mul_const (Real.log n ^ 2)).div_const 4
  convert h.exp using 1
  ring

/-- **Heat equation for β**: `∂_t β_n(t) = R_n(t)/4` for every `n` and every real `t`. -/
theorem hasDerivAt_b (n : ℕ) : ∀ t : ℝ, HasDerivAt (fun s => b s n) (R t n / 4) t := by
  induction n using Nat.strong_induction_on with
  | _ n ih =>
    intro t
    rcases Nat.eq_zero_or_pos n with rfl | hpos
    · simp only [ArithmeticFunction.map_zero, zero_div]; exact hasDerivAt_const t 0
    have hn : n ≠ 0 := hpos.ne'
    have hfun : (fun s => b s n) =
        fun s => Real.log n * G s n - ∑ d ∈ n.properDivisors, b s d * G s (n / d) := by
      funext s; rw [b_apply, bf_eq s hn]; rfl
    rw [hfun]
    have hsum : HasDerivAt (fun s => ∑ d ∈ n.properDivisors, b s d * G s (n / d))
        (∑ d ∈ n.properDivisors, (R t d / 4 * G t (n / d) +
          b t d * (Real.log (n / d : ℕ) ^ 2 / 4 * G t (n / d)))) t := by
      have := HasDerivAt.fun_sum (u := n.properDivisors)
        (A := fun d s => b s d * G s (n / d))
        (fun d hd => (ih d (Nat.mem_properDivisors.mp hd).2 t).mul (hasDerivAt_G (n / d) t))
      simpa using this
    have hmain := ((hasDerivAt_G n t).const_mul (Real.log n)).sub hsum
    convert hmain using 1
    -- algebra: evaluate R_mul_G at n
    have e := congrArg (fun F : ArithmeticFunction ℝ => F n) (R_mul_G t)
    rw [af_sub_apply] at e
    rw [conv_split _ _ hn, conv_split _ _ hn, G_one] at e
    have hD2G1 : D (D (G t)) 1 = 0 := by simp [D_apply]
    rw [hD2G1] at e
    simp only [D_apply] at e
    have hs : ∑ d ∈ n.properDivisors, (R t d / 4 * G t (n / d) +
          b t d * (Real.log (n / d : ℕ) ^ 2 / 4 * G t (n / d))) =
        (∑ d ∈ n.properDivisors, R t d * G t (n / d) +
          ∑ d ∈ n.properDivisors, b t d * (Real.log (n / d : ℕ) *
            (Real.log (n / d : ℕ) * G t (n / d)))) / 4 := by
      rw [← Finset.sum_add_distrib, Finset.sum_div]
      refine Finset.sum_congr rfl (fun d _ => ?_)
      ring
    rw [hs]
    linarith

/-! ### Positivity and monotonicity (Lemma 2.3(a), β part) -/

/-- Cross terms of `R`: `R_n - log²n β_n = 2 Σ_{de=n} β_d (log e) β_e`. -/
lemma R_apply (t : ℝ) (n : ℕ) :
    R t n = Real.log n * (Real.log n * b t n) +
      2 * ∑ x ∈ n.divisorsAntidiagonal, b t x.1 * (Real.log x.2 * b t x.2) := by
  rw [R, ArithmeticFunction.add_apply, ArithmeticFunction.add_apply, D_apply, D_apply,
    ArithmeticFunction.mul_apply]
  simp only [D_apply]
  ring

theorem b_nonneg_and_mono (n : ℕ) :
    (∀ t, 0 ≤ t → 0 ≤ b t n) ∧ MonotoneOn (fun t => b t n) (Ici 0) := by
  induction n using Nat.strong_induction_on with
  | _ n ih =>
    rcases Nat.eq_zero_or_pos n with rfl | hpos
    · simp only [ArithmeticFunction.map_zero]
      exact ⟨fun _ _ => le_rfl, fun _ _ _ _ _ => le_rfl⟩
    have hn : n ≠ 0 := hpos.ne'
    set c : ℝ := Real.log n ^ 2 / 4 with hc
    -- derivative lower bound: R t n / 4 ≥ c β_n(t) for t ≥ 0
    have hcross : ∀ t, 0 ≤ t →
        0 ≤ ∑ x ∈ n.divisorsAntidiagonal, b t x.1 * (Real.log x.2 * b t x.2) := by
      intro t ht
      refine Finset.sum_nonneg (fun x hx => ?_)
      obtain ⟨hxn, -⟩ := Nat.mem_divisorsAntidiagonal.mp hx
      have h1 : x.1 ≠ 0 := by rintro h; rw [h, zero_mul] at hxn; exact hn hxn.symm
      have h2 : x.2 ≠ 0 := by rintro h; rw [h, mul_zero] at hxn; exact hn hxn.symm
      have hlog : 0 ≤ Real.log x.2 := Real.log_nonneg (by exact_mod_cast Nat.one_le_iff_ne_zero.mpr h2)
      by_cases e1 : x.2 = 1
      · rw [e1]; simp
      by_cases e2 : x.1 = 1
      · rw [e2, b_one]; simp
      have hlt1 : x.1 < n := by
        rw [← hxn]
        exact lt_mul_of_one_lt_right (Nat.pos_of_ne_zero h1)
          (by omega)
      have hlt2 : x.2 < n := by
        rw [← hxn]
        exact lt_mul_of_one_lt_left (Nat.pos_of_ne_zero h2) (by omega)
      have b1 := (ih x.1 hlt1).1 t ht
      have b2 := (ih x.2 hlt2).1 t ht
      exact mul_nonneg b1 (mul_nonneg hlog b2)
    have hderlb : ∀ t, 0 ≤ t → c * b t n ≤ R t n / 4 := by
      intro t ht
      rw [R_apply, hc]
      have := hcross t ht
      nlinarith
    -- β_n(0) = Λ(n) ≥ 0
    have h0 : 0 ≤ b 0 n := by rw [b_zero_eq_vonMangoldt]; exact ArithmeticFunction.vonMangoldt_nonneg
    -- φ(t) = e^{-ct} β_n(t) is monotone on [0, ∞)
    have hφ : MonotoneOn (fun t => Real.exp (-(c * t)) * b t n) (Ici 0) := by
      have hd : ∀ t, HasDerivAt (fun t => Real.exp (-(c * t)) * b t n)
          (-(c * 1) * Real.exp (-(c * t)) * b t n + Real.exp (-(c * t)) * (R t n / 4)) t := by
        intro t
        have he : HasDerivAt (fun t => Real.exp (-(c * t))) (Real.exp (-(c * t)) * (-(c * 1))) t :=
          (((hasDerivAt_id t).const_mul c).neg).exp
        have := he.mul (hasDerivAt_b n t)
        convert this using 1
        ring
      refine monotoneOn_of_hasDerivWithinAt_nonneg (convex_Ici 0)
        (fun t _ => (hd t).continuousAt.continuousWithinAt)
        (fun t _ => (hd t).hasDerivWithinAt) ?_
      intro t ht
      rw [interior_Ici] at ht
      have := hderlb t (le_of_lt ht)
      have hepos := Real.exp_pos (-(c * t))
      nlinarith
    have hnn : ∀ t, 0 ≤ t → 0 ≤ b t n := by
      intro t ht
      have := hφ (Set.mem_Ici.mpr le_rfl) (Set.mem_Ici.mpr ht) ht
      simp only [mul_zero, neg_zero, Real.exp_zero, one_mul] at this
      have hepos := Real.exp_pos (-(c * t))
      by_contra hneg
      push Not at hneg
      have : Real.exp (-(c * t)) * b t n < 0 := mul_neg_of_pos_of_neg hepos hneg
      linarith
    refine ⟨hnn, ?_⟩
    refine monotoneOn_of_hasDerivWithinAt_nonneg (convex_Ici 0)
      (fun t _ => (hasDerivAt_b n t).continuousAt.continuousWithinAt)
      (fun t _ => (hasDerivAt_b n t).hasDerivWithinAt) ?_
    intro t ht
    rw [interior_Ici] at ht
    have h1 := hderlb t (le_of_lt ht)
    have h2 := hnn t (le_of_lt ht)
    have hc0 : 0 ≤ c := by rw [hc]; positivity
    nlinarith [mul_nonneg hc0 h2]

/-- **Lemma 2.3(a) (β part).** `β_n(t) ≥ 0` for every `n` and `t ≥ 0`. -/
theorem b_nonneg (n : ℕ) (t : ℝ) (ht : 0 ≤ t) : 0 ≤ b t n := (b_nonneg_and_mono n).1 t ht

/-- **Lemma 2.3(a) (β part).** `t ↦ β_n(t)` is nondecreasing on `[0, ∞)`. -/
theorem b_monotoneOn (n : ℕ) : MonotoneOn (fun t => b t n) (Ici 0) := (b_nonneg_and_mono n).2

/-! ### Lemma 2.1 (twisting) and the truncation step -/

/-- Twist by `χ`: `(χ f)(n) = χ(n) f(n)`. -/
noncomputable def twist (χ : ℕ → ℝ) (f : ArithmeticFunction ℝ) : ArithmeticFunction ℝ :=
  ⟨fun n => χ n * f n, by simp⟩

lemma twist_apply (χ : ℕ → ℝ) (f : ArithmeticFunction ℝ) (n : ℕ) : twist χ f n = χ n * f n := rfl

/-- **Lemma 2.1.** For completely multiplicative `χ` (on positive integers), twisting is
multiplicative for Dirichlet convolution. -/
theorem twist_mul (χ : ℕ → ℝ) (hχ : ∀ m n, m ≠ 0 → n ≠ 0 → χ (m * n) = χ m * χ n)
    (f g : ArithmeticFunction ℝ) : twist χ (f * g) = twist χ f * twist χ g := by
  ext n
  rw [twist_apply, ArithmeticFunction.mul_apply, ArithmeticFunction.mul_apply, Finset.mul_sum]
  simp only [twist_apply]
  refine Finset.sum_congr rfl (fun x hx => ?_)
  obtain ⟨hxn, hn⟩ := Nat.mem_divisorsAntidiagonal.mp hx
  have h1 : x.1 ≠ 0 := by rintro h; rw [h, zero_mul] at hxn; exact hn hxn.symm
  have h2 : x.2 ≠ 0 := by rintro h; rw [h, mul_zero] at hxn; exact hn hxn.symm
  rw [← hxn, hχ _ _ h1 h2]
  ring

lemma twist_D (χ : ℕ → ℝ) (f : ArithmeticFunction ℝ) : D (twist χ f) = twist χ (D f) := by
  ext n; simp only [D_apply, twist_apply]; ring

/-- The log-derivative of a twisted `G_t` is the twisted `β(t)`. -/
theorem logDeriv_twist (χ : ℕ → ℝ) (hχ : ∀ m n, m ≠ 0 → n ≠ 0 → χ (m * n) = χ m * χ n)
    (hχ1 : χ 1 = 1) (t : ℝ) (β' : ArithmeticFunction ℝ)
    (h : β' * twist χ (G t) = D (twist χ (G t))) : β' = twist χ (b t) := by
  apply cancel_right β' (twist χ (b t)) (twist χ (G t)) (by rw [twist_apply, hχ1, G_one]; ring)
  rw [h, ← twist_mul χ hχ, b_mul_G, twist_D]

/-- Truncation step: if `β * a = D a`, `β' * a' = D a'`, `a 1 = a' 1 = 1`, and `a = a'` on
`[1, N]`, then `β = β'` on `[1, N]`. -/
theorem logDeriv_eq_of_agree (a a' β β' : ArithmeticFunction ℝ) (ha : a 1 = 1) (ha' : a' 1 = 1)
    (hβ : β * a = D a) (hβ' : β' * a' = D a') (N : ℕ) (hagree : ∀ m, m ≤ N → a m = a' m) :
    ∀ n, n ≤ N → β n = β' n := by
  intro n
  induction n using Nat.strong_induction_on with
  | _ n ih =>
    intro hnN
    rcases Nat.eq_zero_or_pos n with rfl | hpos
    · simp
    have hn : n ≠ 0 := hpos.ne'
    have e := congrArg (fun F : ArithmeticFunction ℝ => F n) hβ
    have e' := congrArg (fun F : ArithmeticFunction ℝ => F n) hβ'
    rw [conv_split _ _ hn, ha, D_apply] at e
    rw [conv_split _ _ hn, ha', D_apply] at e'
    have hs : ∑ d ∈ n.properDivisors, β d * a (n / d) = ∑ d ∈ n.properDivisors, β' d * a' (n / d) := by
      refine Finset.sum_congr rfl (fun d hd => ?_)
      have hd' := Nat.mem_properDivisors.mp hd
      rw [ih d hd'.2 (by omega), hagree (n / d) ((Nat.div_le_self n d).trans hnN)]
    rw [hagree n hnN] at e
    linarith

/-! ### Lemma 2.3(b) -/

/-- The twisting character `χ(n) = n^{-σ}` written as `exp(-σ log n)`. -/
noncomputable def chiPow (σ : ℝ) (n : ℕ) : ℝ := Real.exp (-σ * Real.log n)

lemma chiPow_mul (σ : ℝ) (m n : ℕ) (hm : m ≠ 0) (hn : n ≠ 0) :
    chiPow σ (m * n) = chiPow σ m * chiPow σ n := by
  unfold chiPow
  rw [Nat.cast_mul, Real.log_mul (by exact_mod_cast hm) (by exact_mod_cast hn), ← Real.exp_add]
  ring_nf

/-- The truncated coefficients of §0.1:
`a_n(t) = exp(t v(v - L)/4 - (1+h) v/2)` for `1 ≤ n ≤ N0`, `v = log n`, and `0` beyond. -/
noncomputable def aTrunc (N0 : ℕ) (t h L : ℝ) : ArithmeticFunction ℝ :=
  ⟨fun n => if n = 0 ∨ N0 < n then 0 else
    Real.exp (t * Real.log n * (Real.log n - L) / 4 - (1 + h) * Real.log n / 2), by simp⟩

/-- **Lemma 2.3(b).** Let `β'` be the log-derivative coefficients of the truncated sequence
(`β' * a = D a`, which determines `β'` uniquely).  For `1 ≤ n ≤ N0`:
`β'_n = n^{-(1+h)/2 - tL/4} β_n(t)`, hence `β'_n ≥ 0` when `t ≥ 0`. -/
theorem lemma_2_3_b (N0 : ℕ) (hN0 : 1 ≤ N0) (t h L : ℝ) (β' : ArithmeticFunction ℝ)
    (hβ' : β' * aTrunc N0 t h L = D (aTrunc N0 t h L)) (n : ℕ) (hn : n ≤ N0) :
    β' n = chiPow ((1 + h) / 2 + t * L / 4) n * b t n ∧ (0 ≤ t → 0 ≤ β' n) := by
  set σ := (1 + h) / 2 + t * L / 4 with hσ
  set χ := chiPow σ with hχdef
  have hχ : ∀ m n, m ≠ 0 → n ≠ 0 → χ (m * n) = χ m * χ n := chiPow_mul σ
  have hχ1 : χ 1 = 1 := by simp [hχdef, chiPow]
  -- the untruncated twisted sequence and its log-derivative
  have hfull : twist χ (b t) * twist χ (G t) = D (twist χ (G t)) := by
    rw [← twist_mul χ hχ, b_mul_G, twist_D]
  have hagree : ∀ m, m ≤ N0 → aTrunc N0 t h L m = twist χ (G t) m := by
    intro m hm
    rcases Nat.eq_zero_or_pos m with rfl | hpos
    · simp
    have hm0 : m ≠ 0 := hpos.ne'
    simp only [aTrunc, twist_apply, coe_mk, hχdef, chiPow, G_apply t hm0]
    rw [if_neg (by omega), ← Real.exp_add, hσ]
    congr 1
    ring
  have ha1 : aTrunc N0 t h L 1 = 1 := by
    rw [hagree 1 hN0, twist_apply, hχ1, G_one]; ring
  have hfull1 : twist χ (G t) 1 = 1 := by rw [twist_apply, hχ1, G_one]; ring
  have heq := logDeriv_eq_of_agree _ _ _ _ ha1 hfull1 hβ' hfull N0 hagree n hn
  rw [heq, twist_apply]
  refine ⟨rfl, fun ht => ?_⟩
  exact mul_nonneg (Real.exp_pos _).le (b_nonneg n t ht)

/-! ### Existence (non-vacuity of the hypothesis `β' * a = D a`) -/

/-- Log-derivative recursion for a general `a` with `a 1 = 1`. -/
noncomputable def ldf (a : ArithmeticFunction ℝ) : ℕ → ℝ
  | n => if n = 0 then 0 else
      Real.log n * a n - ∑ d ∈ n.properDivisors.attach, ldf a d.1 * a (n / d.1)
termination_by n => n
decreasing_by exact (Nat.mem_properDivisors.mp d.2).2

noncomputable def ldA (a : ArithmeticFunction ℝ) : ArithmeticFunction ℝ :=
  ⟨ldf a, by rw [ldf]; simp⟩

lemma ldA_apply (a : ArithmeticFunction ℝ) (n : ℕ) : ldA a n = ldf a n := rfl

/-- Every `a` with `a 1 = 1` has log-derivative coefficients: `∃ β, β * a = D a`. -/
theorem logDeriv_exists (a : ArithmeticFunction ℝ) (ha : a 1 = 1) :
    ∃ β : ArithmeticFunction ℝ, β * a = D a := by
  refine ⟨ldA a, ?_⟩
  ext n
  rcases Nat.eq_zero_or_pos n with rfl | hpos
  · simp
  have hn : n ≠ 0 := hpos.ne'
  rw [conv_split _ _ hn, ha, D_apply]
  simp only [ldA_apply]
  rw [ldf, if_neg hn, Finset.sum_attach n.properDivisors (fun d => ldf a d * a (n / d))]
  ring

lemma aTrunc_one (N0 : ℕ) (hN0 : 1 ≤ N0) (t h L : ℝ) : aTrunc N0 t h L 1 = 1 := by
  simp only [aTrunc, coe_mk]
  rw [if_neg (by omega)]
  simp

/-- **Lemma 2.3(b), existence form.** The truncated sequence has log-derivative coefficients, and
for `n ≤ N0` they equal `n^{-(1+h)/2 - tL/4} β_n(t)` and are `≥ 0` for `t ≥ 0`. -/
theorem lemma_2_3_b_exists (N0 : ℕ) (hN0 : 1 ≤ N0) (t h L : ℝ) :
    ∃ β' : ArithmeticFunction ℝ, β' * aTrunc N0 t h L = D (aTrunc N0 t h L) ∧
      ∀ n, n ≤ N0 → β' n = chiPow ((1 + h) / 2 + t * L / 4) n * b t n ∧ (0 ≤ t → 0 ≤ β' n) := by
  obtain ⟨β', hβ'⟩ := logDeriv_exists _ (aTrunc_one N0 hN0 t h L)
  exact ⟨β', hβ', fun n hn => lemma_2_3_b N0 hN0 t h L β' hβ' n hn⟩

end Route40.L2
