/-
  MathlibBridge — the finite → analytic bridge that plain Lean 4 core CANNOT reach.

  The core-only project `DeBruijnNewman.RealRooted` proves the honest degenerate
  shadow of the Hermite–Poulain / heat-step real-rootedness fact, and documents (in
  its own comments) that the general-degree statement

      "the derivative of a real-rooted polynomial is real-rooted"

  is EXACTLY Rolle's theorem / root interlacing, is NOT closeable in plain core (it
  needs the mean value theorem and ℝ-completeness), and is even FALSE pointwise over
  the integers `ℤ` used there (e.g. `d/dx [X(X-1)(X-2)] = 3X² − 6X + 2` has the
  irrational roots `1 ± 1/√3`, so a ℤ-real-rooted cubic can have a derivative with no
  integer roots).

  This module discharges that exact obstruction over `ℝ` using mathlib's Rolle
  theorem (`exists_deriv_eq_zero`) and the polynomial-derivative bridge
  (`Polynomial.deriv`).  All results here are `sorry`-free and `#print axioms`-clean
  (only the standard mathlib axioms, plus the explicitly-declared entire-function
  stand-in `H`) EXCEPT the single deep-analytic `heat_preserves_LP`, which is reduced
  to the Hermite–Poulain / Pólya–Schur multiplier theorem that mathlib still lacks
  (an explicit, cited `sorry`).

  ## What is genuinely NEW here (real, not affine, shadow)

  * `MathlibBridge.hasOnlyRealRoots_derivative` — **the general-degree statement**:
    the derivative of a real-rooted real polynomial is real-rooted, counting roots
    with multiplicity (`HasOnlyRealRoots p → HasOnlyRealRoots p.derivative`).  This
    is the exact fact the core project could ONLY prove in the affine (degree ≤ 1)
    degenerate case (`RealRooted.heatStep_preserves_realRooted_of_affine`).  It is
    the true ℝ-analog of the Hermite–Poulain differentiation step, and is FALSE over
    the `ℤ` model the core project was forced to use.  Sorry-free, via mathlib Rolle.
  * The four DBN order-lemmas re-proved over the REAL predicate
    `HasOnlyRealZeros t := ∀ z : ℂ, H t z = 0 → z.im = 0` on the REAL time axis `ℝ`
    (the core project used an `opaque` predicate on the `ℤ` time axis).
-/
import Mathlib.Analysis.Calculus.LocalExtr.Rolle
import Mathlib.Analysis.Calculus.Deriv.Polynomial
import Mathlib.Analysis.Calculus.LocalExtr.Polynomial
import Mathlib.Analysis.SpecialFunctions.ExpDeriv
import Mathlib.Analysis.SpecialFunctions.PolynomialExp
import Mathlib.Analysis.Calculus.LocalExtr.Basic
import Mathlib.Topology.Order.Compact
import Mathlib.Order.Filter.AtTopBot.Field
import Mathlib.Analysis.SpecialFunctions.Gaussian.GaussianIntegral
import Mathlib.Topology.Algebra.Polynomial
import Mathlib.Data.Complex.Basic

open scoped Polynomial

namespace MathlibBridge

/-! ## 0. The Rolle bridge and heat-kernel positivity (finite → analytic upgrade) -/

/-- **Rolle bridge (root interlacing).**  If a real polynomial `p` vanishes at two
distinct points `a < b`, then its formal derivative `p.derivative` vanishes at some
strictly interior point `c ∈ (a, b)`.

This is the finite-dimensional → analytic upgrade of
`DeBruijnNewman.RealRooted.heatStep_preserves_realRooted_of_affine`: the honest
core project could only handle the affine (degenerate-degree) case because the
general case is precisely this Rolle/MVT step.  Here the mean value theorem
(`exists_deriv_eq_zero`) and the polynomial-derivative identity (`Polynomial.deriv`)
supply the missing analytic ingredient. -/
theorem derivative_hasRoot_between {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.eval a = 0) (hb : p.eval b = 0) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).eval c = 0 := by
  obtain ⟨c, hc, hc0⟩ :=
    exists_deriv_eq_zero hab p.continuousOn (ha.trans hb.symm)
  refine ⟨c, hc.1, hc.2, ?_⟩
  rwa [p.deriv] at hc0

/-- **Consecutive real roots interlace with a derivative root.**  A convenient
restatement: between any two roots `a < b` of `p`, the derivative `p.derivative` has
a genuine real root.  This is the atomic step from which mathlib's
`Polynomial.card_roots_le_derivative` (root-count interlacing) is assembled, and the
faithful ℝ-analog of the finite real-rootedness closure used in the LP-class chain. -/
theorem exists_derivative_root_of_two_roots {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.IsRoot a) (hb : p.IsRoot b) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).IsRoot c :=
  derivative_hasRoot_between hab ha hb

/-- **Gaussian heat-kernel positivity.**  The 1-D heat kernel
`G_t(x) = exp(−x²/(4t)) / √(4πt)` is strictly positive for every `x` and every
time `t > 0`.  This is the concrete real-analysis fact named in
`DeBruijnNewman.Basic` as "provable TODAY in mathlib, no `sorry`"; it is the
convolution kernel of the heat semigroup `H_t = Ξ ∗ G_t` that underlies
`heat_preserves_LP`. -/
theorem heatKernel_pos {t : ℝ} (ht : 0 < t) (x : ℝ) :
    0 < Real.exp (-(x ^ 2) / (4 * t)) / Real.sqrt (4 * Real.pi * t) := by
  have hπ : 0 < Real.pi := Real.pi_pos
  positivity

/-! ## 1. The DBN order-lemmas over the REAL predicate on the REAL time axis

The core project (`DeBruijnNewman.Basic`) modelled time as `ℤ` and kept
`HasOnlyRealZeros` an `opaque` `Int → Prop`, because plain Lean 4 core has neither
`ℝ` nor `ℂ` nor entire functions.  With mathlib we upgrade to:

* the REAL time axis `ℝ`;
* the GENUINE real-zero predicate
    `HasOnlyRealZeros t := ∀ z : ℂ, H t z = 0 → z.im = 0`
  where `H : ℝ → ℂ → ℂ` is the heat-flow family `H_t = Ξ ∗ G_t`.

`H` is declared as an `axiom`-level stand-in: defining the genuine Riemann Ξ and its
Gaussian convolution is a large entire-function-theory development still absent from
mathlib.  But — crucially — the *predicate is now real*: it is a literal statement
about the imaginary parts of the complex zeros of `H t`, not an opaque black box.
The four order-lemmas below are re-proved sorry-free against this real predicate. -/

/-- Heat-flow family `H_t = Ξ ∗ G_t : ℂ → ℂ`.  Declared as an `axiom`-level stand-in
for the genuine entire function (defining Ξ and the Gaussian convolution needs
entire-function theory not yet in mathlib).  The real-zero predicate below is stated
directly in terms of `H`, so it is a genuine analytic predicate, not an opaque one. -/
axiom H : ℝ → ℂ → ℂ

/-- **Genuine real-zero predicate.**  `HasOnlyRealZeros t` says every complex zero of
`H t` has zero imaginary part.  Unlike the core project's `opaque HasOnlyRealZeros`,
this is the real predicate `∀ z : ℂ, H t z = 0 → z.im = 0`. -/
def HasOnlyRealZeros (t : ℝ) : Prop := ∀ z : ℂ, H t z = 0 → z.im = 0

/-- `IsDBNConstant Λ` : the "good" times (those `t` with `H_t` having only real zeros)
are exactly the ray `[Λ, ∞)`.  Now over the REAL time axis `ℝ`. -/
def IsDBNConstant (Λ : ℝ) : Prop := ∀ t : ℝ, HasOnlyRealZeros t ↔ Λ ≤ t

/-- The Riemann Hypothesis in this framework: `H_0 = Ξ` has only real zeros. -/
def RiemannHypothesis : Prop := HasOnlyRealZeros 0

/-- **Uniqueness of the de Bruijn–Newman constant** (over `ℝ`).  Each candidate is
`≤` the other by evaluating the characterization at the other point; then `ℝ`
antisymmetry.  Ports verbatim from the `ℤ` version — uses only `le_antisymm`. -/
theorem dbn_unique {Λ₁ Λ₂ : ℝ}
    (h₁ : IsDBNConstant Λ₁) (h₂ : IsDBNConstant Λ₂) : Λ₁ = Λ₂ :=
  le_antisymm
    ((h₁ Λ₂).mp ((h₂ Λ₂).mpr le_rfl))
    ((h₂ Λ₁).mp ((h₁ Λ₁).mpr le_rfl))

/-- **de Bruijn monotonicity, as a formal consequence** (over `ℝ`).  If `H_t` has only
real zeros and `t ≤ s`, then so does `H_s`.  Uses only `le_trans`. -/
theorem monotone_of_dbn {Λ t s : ℝ}
    (h : IsDBNConstant Λ) (hts : HasOnlyRealZeros t) (hle : t ≤ s) :
    HasOnlyRealZeros s :=
  (h s).mpr (le_trans ((h t).mp hts) hle)

/-- **RH ⟺ Λ ≤ 0** (over `ℝ`).  Immediate specialization of the characterization at
`t = 0`, using `H_0 = Ξ`. -/
theorem RH_iff_lambda_nonpos {Λ : ℝ} (h : IsDBNConstant Λ) :
    RiemannHypothesis ↔ Λ ≤ 0 :=
  h 0

/-- **RH ⟺ Λ = 0** (over `ℝ`).  Given the Rodgers–Tao bound `0 ≤ Λ` (2020, Ann. of
Math.) as an explicit hypothesis `hRT`, the Riemann Hypothesis is equivalent to
`Λ = 0`.  Taking Rodgers–Tao as a *hypothesis* (rather than an internal `sorry`)
keeps this lemma genuinely sorry-free and `#print axioms`-clean; the deep analytic
content `0 ≤ Λ` is honestly surfaced as the hypothesis it is. -/
theorem RH_iff_lambda_eq_zero {Λ : ℝ} (h : IsDBNConstant Λ) (hRT : 0 ≤ Λ) :
    RiemannHypothesis ↔ Λ = 0 := by
  rw [RH_iff_lambda_nonpos h]
  constructor
  · intro hle; exact le_antisymm hle hRT
  · intro heq; rw [heq]

/-! ## 2. General-degree Laguerre–Pólya scaffolding (the REAL, not affine, shadow)

Here is the genuine advance over the core project's affine shadow.  We use mathlib's
Rolle-based root-count interlacing (`Polynomial.card_roots_le_derivative`) to prove
the FULL general-degree statement that differentiation preserves real-rootedness. -/

/-- **Real-rootedness predicate.**  `HasOnlyRealRoots p` says the real polynomial `p`
"has only real roots" (splits over `ℝ`): the number of its real roots, counted with
multiplicity, equals its degree.  Equivalently every complex root of `p` is real.
This is the genuine (multiplicity-aware) real predicate — the polynomial-level
Laguerre–Pólya membership — replacing the core project's `opaque InLaguerrePolya`. -/
def HasOnlyRealRoots (p : ℝ[X]) : Prop :=
  Multiset.card p.roots = p.natDegree

/-- **General-degree Hermite–Poulain differentiation step (REAL, sorry-free).**
The derivative of a real-rooted real polynomial is real-rooted, roots counted with
multiplicity.  This is the exact statement the core project could prove ONLY in the
affine (degree ≤ 1) case (`RealRooted.heatStep_preserves_realRooted_of_affine`) and
which is FALSE over its `ℤ` model.  It is now proved in full generality over `ℝ`.

Proof (three mathlib inputs, then `omega`):
* `Polynomial.card_roots'`          : `card p'.roots ≤ p'.natDegree`         (always);
* `Polynomial.card_roots_le_derivative` (Rolle, with multiplicity):
                                       `card p.roots ≤ card p'.roots + 1`;
* `Polynomial.natDegree_derivative_le` : `p'.natDegree ≤ p.natDegree − 1`.
With the hypothesis `card p.roots = p.natDegree`, linear arithmetic over `ℕ` forces
`card p'.roots = p'.natDegree`, i.e. `p'` is real-rooted.  (No char-zero hypothesis
is needed: `natDegree_derivative_le` holds unconditionally.) -/
theorem hasOnlyRealRoots_derivative {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (Polynomial.derivative p) := by
  have h1 : Multiset.card (Polynomial.derivative p).roots ≤ (Polynomial.derivative p).natDegree :=
    Polynomial.card_roots' _
  have h2 : Multiset.card p.roots ≤ Multiset.card (Polynomial.derivative p).roots + 1 :=
    Polynomial.card_roots_le_derivative p
  have h3 : (Polynomial.derivative p).natDegree ≤ p.natDegree - 1 :=
    Polynomial.natDegree_derivative_le p
  unfold HasOnlyRealRoots at hp ⊢
  omega

/-- **Iterated differentiation preserves real-rootedness** (sorry-free corollary).
Every formal derivative `D^n p` of a real-rooted real polynomial is real-rooted.
This is the finite Hermite–Poulain operator `D^n` — the honest, fully-proved core of
"the heat multiplier `e^{tD²} = ∑ (tᵏ/k!) D^{2k}` maps LP into LP"; only the infinite
sum / limit passage (below) remains a gap. -/
theorem hasOnlyRealRoots_iterate_derivative {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    ∀ n : ℕ, HasOnlyRealRoots (Polynomial.derivative^[n] p)
  | 0 => hp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply]
      exact hasOnlyRealRoots_derivative (hasOnlyRealRoots_iterate_derivative hp n)

/-! ### The atomic Hermite–Poulain shift `p ↦ p′ + c·p`

The heat-operator factorization `e^{−t·D²} = limₙ (1 − (t/n)·D²)ⁿ` decomposes (for
`t ≥ 0`) into linear real-shift factors `p ↦ p′ ± √(n/t)·p` (gap 1 of
`heat_preserves_LP`).  The two lemmas below discharge the *reachable* analytic core of
that shift and isolate the single genuinely-missing arithmetic fact.

The key device is the real function `g(x) = e^{c x}·p(x)`, whose derivative is
`g′(x) = e^{c x}·(p′(x) + c·p(x))`.  Since `e^{c x} > 0`, the real zeros of the shifted
polynomial `q := p′ + c·p` are exactly the zeros of `g′`. -/

/-- **Shifted-root interlacing (Rolle on `e^{c x}·p`, sorry-free).**  Between any two
distinct real roots `a < b` of `p`, the shifted polynomial `p′ + c·p` has a genuine
real root.  This is the faithful ℝ-analog of `derivative_hasRoot_between` for the
Hermite–Poulain shift operator: the exponential factor `e^{c x}` (which is *not* a
polynomial, so mathlib's polynomial Rolle lemmas do not apply directly) is handled by
mathlib's analytic Rolle theorem `exists_deriv_eq_zero` applied to the transcendental
auxiliary function `g x = e^{c x}·p(x)`.  Because `e^{c x} ≠ 0`, a zero of `g′` forces a
zero of `q = p′ + c·p`. -/
theorem exists_shifted_root_between (c : ℝ) {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.eval a = 0) (hb : p.eval b = 0) :
    ∃ z, a < z ∧ z < b ∧ (Polynomial.derivative p + c • p).eval z = 0 := by
  have hcont : ContinuousOn (fun x => Real.exp (c * x) * p.eval x) (Set.Icc a b) :=
    ((Real.continuous_exp.comp (continuous_const.mul continuous_id)).mul p.continuous).continuousOn
  have hI : (fun x => Real.exp (c * x) * p.eval x) a
      = (fun x => Real.exp (c * x) * p.eval x) b := by simp [ha, hb]
  obtain ⟨z, hz, hz0⟩ := exists_deriv_eq_zero hab hcont hI
  refine ⟨z, hz.1, hz.2, ?_⟩
  have h1 : HasDerivAt (fun x : ℝ => Real.exp (c * x)) (Real.exp (c * z) * c) z := by
    simpa using ((hasDerivAt_id z).const_mul c).exp
  have h2 : HasDerivAt (fun x => p.eval x) ((Polynomial.derivative p).eval z) z := p.hasDerivAt z
  have hval : Real.exp (c * z) * c * p.eval z + Real.exp (c * z) * (Polynomial.derivative p).eval z
      = Real.exp (c * z) * (Polynomial.derivative p + c • p).eval z := by
    rw [Polynomial.eval_add, Polynomial.eval_smul, smul_eq_mul]; ring
  have hd : HasDerivAt (fun x => Real.exp (c * x) * p.eval x)
      (Real.exp (c * z) * (Polynomial.derivative p + c • p).eval z) z := hval ▸ h1.mul h2
  rw [hd.deriv] at hz0
  rcases mul_eq_zero.mp hz0 with h | h
  · exact absurd h (Real.exp_ne_zero _)
  · exact h

open Filter Topology in
/-- **Root at `−∞` (the `n`-th root), case `c > 0`.**  If `a` is a root of `p` below which
`p` has no roots, then `q := p′ + c·p` has a root strictly below `a`.

Analytic content (the piece Rolle-between-roots cannot see): put `g x = e^{c x}·p(x)`, so
`g′ x = e^{c x}·q(x)` and `g(a) = 0`.  For `c > 0` the exponential decay beats the
polynomial, so `g → 0` at `−∞`; and `g` is nonzero just left of `a`.  Hence on a closed
interval `[b, a]` (with `b` far enough left that `g b` is small) `g` attains an *interior*
extremum `ξ ∈ (b, a)`, where Fermat's theorem gives `g′ ξ = 0`, i.e. `e^{c ξ}·q(ξ) = 0`,
i.e. `q(ξ) = 0` — a real root of `q` strictly below `a`. -/
theorem exists_shifted_root_atBot {c : ℝ} (hc : 0 < c) {p : ℝ[X]} {a : ℝ}
    (ha : p.eval a = 0) (hmin : ∀ x : ℝ, x < a → p.eval x ≠ 0) :
    ∃ z, z < a ∧ (Polynomial.derivative p + c • p).eval z = 0 := by
  classical
  set g : ℝ → ℝ := fun x => Real.exp (c * x) * p.eval x with hgdef
  have hcont : Continuous g :=
    (Real.continuous_exp.comp (continuous_const.mul continuous_id)).mul p.continuous
  have hderiv : ∀ x : ℝ,
      HasDerivAt g (Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x) x := by
    intro x
    have h1 : HasDerivAt (fun x : ℝ => Real.exp (c * x)) (Real.exp (c * x) * c) x := by
      simpa using ((hasDerivAt_id x).const_mul c).exp
    have h2 : HasDerivAt (fun x => p.eval x) ((Polynomial.derivative p).eval x) x := p.hasDerivAt x
    have hval : Real.exp (c * x) * c * p.eval x + Real.exp (c * x) * (Polynomial.derivative p).eval x
        = Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x := by
      rw [Polynomial.eval_add, Polynomial.eval_smul, smul_eq_mul]; ring
    exact hval ▸ h1.mul h2
  have hcne : c ≠ 0 := ne_of_gt hc
  have hlim : Tendsto g atBot (𝓝 0) := by
    have hφ : Tendsto (fun x : ℝ => -c * x) atBot atTop :=
      (tendsto_const_mul_atTop_of_neg (by linarith : -c < 0)).mpr tendsto_id
    have hcomp := (Polynomial.tendsto_div_exp_atTop
        (p.comp (Polynomial.C (-c⁻¹) * Polynomial.X))).comp hφ
    refine hcomp.congr (fun x => ?_)
    simp only [Function.comp_apply, Polynomial.eval_comp, Polynomial.eval_mul,
      Polynomial.eval_C, Polynomial.eval_X]
    have hxx : -c⁻¹ * (-c * x) = x := by field_simp
    rw [hxx, hgdef, show -c * x = -(c * x) by ring, Real.exp_neg, div_inv_eq_mul, mul_comm]
  have ha0 : g a = 0 := by simp [hgdef, ha]
  have hx0 : g (a - 1) ≠ 0 := by
    have hp1 : p.eval (a - 1) ≠ 0 := hmin _ (by linarith)
    exact mul_ne_zero (Real.exp_ne_zero _) hp1
  rcases lt_or_gt_of_ne hx0 with hlt | hgt
  · -- `g (a-1) < 0`: `g` has an interior minimum
    have hev : (g ⁻¹' Set.Ioi (g (a - 1))) ∈ atBot := hlim (Ioi_mem_nhds hlt)
    obtain ⟨N, hN⟩ := eventually_atBot.1 hev
    set b : ℝ := min N (a - 2) with hbdef
    have hbN : b ≤ N := min_le_left _ _
    have hba2 : b ≤ a - 2 := min_le_right _ _
    have hba : b < a := by linarith
    have hgb : g (a - 1) < g b := hN b hbN
    have hmem1 : a - 1 ∈ Set.Icc b a := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmin⟩ :=
      isCompact_Icc.exists_isMinOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hle1 : g ξ ≤ g (a - 1) := hξmin hmem1
    have hlea : g ξ ≤ g a := hξmin ⟨by linarith, le_refl a⟩
    have hleb : g ξ ≤ g b := hξmin ⟨le_refl b, hba.le⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hle1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hle1; linarith
    have hξIoo : ξ ∈ Set.Ioo b a :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξb h.symm), lt_of_le_of_ne hξmem.2 hξa⟩
    have hloc : IsLocalMin g ξ := hξmin.isLocalMin (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.2, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩
  · -- `g (a-1) > 0`: `g` has an interior maximum
    have hev : (g ⁻¹' Set.Iio (g (a - 1))) ∈ atBot := hlim (Iio_mem_nhds hgt)
    obtain ⟨N, hN⟩ := eventually_atBot.1 hev
    set b : ℝ := min N (a - 2) with hbdef
    have hbN : b ≤ N := min_le_left _ _
    have hba2 : b ≤ a - 2 := min_le_right _ _
    have hba : b < a := by linarith
    have hgb : g b < g (a - 1) := hN b hbN
    have hmem1 : a - 1 ∈ Set.Icc b a := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmax⟩ :=
      isCompact_Icc.exists_isMaxOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hge1 : g (a - 1) ≤ g ξ := hξmax hmem1
    have hgea : g a ≤ g ξ := hξmax ⟨by linarith, le_refl a⟩
    have hgeb : g b ≤ g ξ := hξmax ⟨le_refl b, hba.le⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hge1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hge1; linarith
    have hξIoo : ξ ∈ Set.Ioo b a :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξb h.symm), lt_of_le_of_ne hξmem.2 hξa⟩
    have hloc : IsLocalMax g ξ := hξmax.isLocalMax (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.2, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩

open Filter Topology in
/-- **Root at `+∞` (the `n`-th root), case `c < 0`.**  Mirror of `exists_shifted_root_atBot`:
if `a` is a root of `p` above which `p` has no roots, then `q := p′ + c·p` has a root
strictly above `a`.  Now `g x = e^{c x}·p(x) → 0` at `+∞` (as `c < 0`), giving the interior
extremum on some `[a, b]`. -/
theorem exists_shifted_root_atTop {c : ℝ} (hc : c < 0) {p : ℝ[X]} {a : ℝ}
    (ha : p.eval a = 0) (hmax : ∀ x : ℝ, a < x → p.eval x ≠ 0) :
    ∃ z, a < z ∧ (Polynomial.derivative p + c • p).eval z = 0 := by
  classical
  set g : ℝ → ℝ := fun x => Real.exp (c * x) * p.eval x with hgdef
  have hcont : Continuous g :=
    (Real.continuous_exp.comp (continuous_const.mul continuous_id)).mul p.continuous
  have hderiv : ∀ x : ℝ,
      HasDerivAt g (Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x) x := by
    intro x
    have h1 : HasDerivAt (fun x : ℝ => Real.exp (c * x)) (Real.exp (c * x) * c) x := by
      simpa using ((hasDerivAt_id x).const_mul c).exp
    have h2 : HasDerivAt (fun x => p.eval x) ((Polynomial.derivative p).eval x) x := p.hasDerivAt x
    have hval : Real.exp (c * x) * c * p.eval x + Real.exp (c * x) * (Polynomial.derivative p).eval x
        = Real.exp (c * x) * (Polynomial.derivative p + c • p).eval x := by
      rw [Polynomial.eval_add, Polynomial.eval_smul, smul_eq_mul]; ring
    exact hval ▸ h1.mul h2
  have hcne : c ≠ 0 := ne_of_lt hc
  have hlim : Tendsto g atTop (𝓝 0) := by
    have hφ : Tendsto (fun x : ℝ => -c * x) atTop atTop :=
      Tendsto.const_mul_atTop (by linarith : 0 < -c) tendsto_id
    have hcomp := (Polynomial.tendsto_div_exp_atTop
        (p.comp (Polynomial.C (-c⁻¹) * Polynomial.X))).comp hφ
    refine hcomp.congr (fun x => ?_)
    simp only [Function.comp_apply, Polynomial.eval_comp, Polynomial.eval_mul,
      Polynomial.eval_C, Polynomial.eval_X]
    have hxx : -c⁻¹ * (-c * x) = x := by field_simp
    rw [hxx, hgdef, show -c * x = -(c * x) by ring, Real.exp_neg, div_inv_eq_mul, mul_comm]
  have ha0 : g a = 0 := by simp [hgdef, ha]
  have hx0 : g (a + 1) ≠ 0 := by
    have hp1 : p.eval (a + 1) ≠ 0 := hmax _ (by linarith)
    exact mul_ne_zero (Real.exp_ne_zero _) hp1
  rcases lt_or_gt_of_ne hx0 with hlt | hgt
  · -- `g (a+1) < 0`: interior minimum on `[a, b]`
    have hev : (g ⁻¹' Set.Ioi (g (a + 1))) ∈ atTop := hlim (Ioi_mem_nhds hlt)
    obtain ⟨N, hN⟩ := eventually_atTop.1 hev
    set b : ℝ := max N (a + 2) with hbdef
    have hbN : N ≤ b := le_max_left _ _
    have hba2 : a + 2 ≤ b := le_max_right _ _
    have hba : a < b := by linarith
    have hgb : g (a + 1) < g b := hN b hbN
    have hmem1 : a + 1 ∈ Set.Icc a b := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmin⟩ :=
      isCompact_Icc.exists_isMinOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hle1 : g ξ ≤ g (a + 1) := hξmin hmem1
    have hlea : g ξ ≤ g a := hξmin ⟨le_refl a, hba.le⟩
    have hleb : g ξ ≤ g b := hξmin ⟨hba.le, le_refl b⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hle1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hle1; linarith
    have hξIoo : ξ ∈ Set.Ioo a b :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξa h.symm), lt_of_le_of_ne hξmem.2 hξb⟩
    have hloc : IsLocalMin g ξ := hξmin.isLocalMin (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.1, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩
  · -- `g (a+1) > 0`: interior maximum on `[a, b]`
    have hev : (g ⁻¹' Set.Iio (g (a + 1))) ∈ atTop := hlim (Iio_mem_nhds hgt)
    obtain ⟨N, hN⟩ := eventually_atTop.1 hev
    set b : ℝ := max N (a + 2) with hbdef
    have hbN : N ≤ b := le_max_left _ _
    have hba2 : a + 2 ≤ b := le_max_right _ _
    have hba : a < b := by linarith
    have hgb : g b < g (a + 1) := hN b hbN
    have hmem1 : a + 1 ∈ Set.Icc a b := ⟨by linarith, by linarith⟩
    obtain ⟨ξ, hξmem, hξmax⟩ :=
      isCompact_Icc.exists_isMaxOn (Set.nonempty_Icc.2 hba.le) hcont.continuousOn
    have hge1 : g (a + 1) ≤ g ξ := hξmax hmem1
    have hgea : g a ≤ g ξ := hξmax ⟨le_refl a, hba.le⟩
    have hgeb : g b ≤ g ξ := hξmax ⟨hba.le, le_refl b⟩
    have hξa : ξ ≠ a := fun h => by rw [h, ha0] at hge1; linarith
    have hξb : ξ ≠ b := fun h => by rw [h] at hge1; linarith
    have hξIoo : ξ ∈ Set.Ioo a b :=
      ⟨lt_of_le_of_ne hξmem.1 (fun h => hξa h.symm), lt_of_le_of_ne hξmem.2 hξb⟩
    have hloc : IsLocalMax g ξ := hξmax.isLocalMax (Icc_mem_nhds hξIoo.1 hξIoo.2)
    have hd0 : Real.exp (c * ξ) * (Polynomial.derivative p + c • p).eval ξ = 0 :=
      hloc.hasDerivAt_eq_zero (hderiv ξ)
    exact ⟨ξ, hξIoo.1, (mul_eq_zero.1 hd0).resolve_left (Real.exp_ne_zero _)⟩

open Finset in
/-- **The `n`-th-root count lower bound** — the last piece of the Hermite–Poulain shift.
For a real-rooted `p ≠ 0` and `c ≠ 0`, the shifted polynomial `q := p′ + c·p` has at least
`natDegree p =: n` real roots counted with multiplicity.

Proof (mirroring mathlib's `Polynomial.card_roots_le_derivative`, but *without* the `+1`
because the root at infinity supplies the missing `n`-th root):

* **Inherited multiplicity.** `p.rootMultiplicity x − 1 ≤ q.rootMultiplicity x` for every
  `x` (`rootMultiplicity_sub_one_le_derivative_rootMultiplicity` for `p′`,
  `roots_smul_nonzero` for `c·p`, combined by `rootMultiplicity_add`).
* **Interior + boundary distinct roots.** Writing `s := p.roots.toFinset` (the `k` distinct
  roots) and `t := q.roots.toFinset`, we show `s.card ≤ (t \ s).card`.  The `k − 1` interval
  gaps give roots of `q` in `t \ s` (`exists_shifted_root_between`), and the *root at
  infinity* (`exists_shifted_root_atBot` for `c > 0`, `exists_shifted_root_atTop` for
  `c < 0`) supplies one more, beyond the extreme root of `p`; feeding an auxiliary point
  past it into mathlib's `Finset.card_le_diff_of_interleaved` removes its `+1`.
* **Assembly.** `card p.roots = ∑_{x∈s}(rootMult x p − 1) + s.card ≤ ∑_{x∈s} rootMult x q +
  (t \ s).card ≤ ∑_{x∈t} rootMult x q = card q.roots`, and `card p.roots = n` since `p` is
  real-rooted.

Reference: N. Obreschkoff, *Verteilung und Berechnung der Nullstellen reeller Polynome*
(1963), Hermite–Poulain theorem; Rahman–Schmeisser, *Analytic Theory of Polynomials*
(2002), Thm 5.4.4. -/
theorem hermitePoulain_card_lower {c : ℝ} (hc : c ≠ 0) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) (hp0 : p ≠ 0) :
    p.natDegree ≤ Multiset.card (Polynomial.derivative p + c • p).roots := by
  classical
  set q : ℝ[X] := Polynomial.derivative p + c • p with hqdef
  -- `q ≠ 0`: its `natDegree p`-coefficient is `c * leadingCoeff p ≠ 0`.
  have hq0 : q ≠ 0 := by
    have hpd : (Polynomial.derivative p).coeff p.natDegree = 0 := by
      rcases Nat.eq_zero_or_pos p.natDegree with h0 | hpos
      · rw [Polynomial.derivative_of_natDegree_zero h0, Polynomial.coeff_zero]
      · exact Polynomial.coeff_eq_zero_of_natDegree_lt
          (lt_of_le_of_lt (Polynomial.natDegree_derivative_le p) (by omega))
    have hcoeff : q.coeff p.natDegree = c * p.leadingCoeff := by
      rw [hqdef, Polynomial.coeff_add, hpd, Polynomial.coeff_smul, smul_eq_mul, zero_add]
      rfl
    intro h
    rw [h, Polynomial.coeff_zero] at hcoeff
    exact (mul_ne_zero hc (Polynomial.leadingCoeff_ne_zero.2 hp0)) hcoeff.symm
  -- Inherited-multiplicity bound.
  have hmult : ∀ x : ℝ, p.rootMultiplicity x - 1 ≤ q.rootMultiplicity x := by
    intro x
    have h1 : p.rootMultiplicity x - 1 ≤ (Polynomial.derivative p).rootMultiplicity x :=
      Polynomial.rootMultiplicity_sub_one_le_derivative_rootMultiplicity p x
    have h2 : (c • p).rootMultiplicity x = p.rootMultiplicity x := by
      rw [← Polynomial.count_roots, ← Polynomial.count_roots, Polynomial.roots_smul_nonzero p hc]
    have h3 : min ((Polynomial.derivative p).rootMultiplicity x) ((c • p).rootMultiplicity x)
        ≤ q.rootMultiplicity x := Polynomial.rootMultiplicity_add x hq0
    have h4 : p.rootMultiplicity x - 1 ≤ min ((Polynomial.derivative p).rootMultiplicity x)
        ((c • p).rootMultiplicity x) := le_min h1 (by rw [h2]; omega)
    exact h4.trans h3
  -- Distinct-roots bound: `s.card ≤ (t \ s).card`.
  set s : Finset ℝ := p.roots.toFinset with hsdef
  set t : Finset ℝ := q.roots.toFinset with htdef
  -- interior interleaving (both orientations, from `exists_shifted_root_between`).
  have hmemt : ∀ z : ℝ, q.eval z = 0 → z ∈ t := by
    intro z hz; rw [htdef, Multiset.mem_toFinset, Polynomial.mem_roots hq0]; exact hz
  have hmems : ∀ {x : ℝ}, x ∈ s → p.eval x = 0 := by
    intro x hx; rw [hsdef, Multiset.mem_toFinset, Polynomial.mem_roots hp0] at hx; exact hx
  have hinterior : ∀ x ∈ s, ∀ y ∈ s, x < y → ∃ z ∈ t, x < z ∧ z < y := by
    intro x hx y hy hxy
    obtain ⟨z, hz1, hz2, hz3⟩ := exists_shifted_root_between c hxy (hmems hx) (hmems hy)
    exact ⟨z, hmemt z hz3, hz1, hz2⟩
  have hkey : s.card ≤ (t \ s).card := by
    -- The interior `k-1` roots plus the root at infinity give `k` roots of `q` off `s`.
    rcases s.eq_empty_or_nonempty with hsempty | hsne
    · simp [hsempty]
    · -- `s` is nonempty; pick the extreme root and the root beyond it.
      rcases lt_or_gt_of_ne hc with hcneg | hcpos
      · -- `c < 0`: the extra root sits *above* `max s`.
        set a : ℝ := s.max' hsne with hadef
        have hamem : a ∈ s := s.max'_mem hsne
        have hale : ∀ x ∈ s, x ≤ a := fun x hx => s.le_max' x hx
        obtain ⟨w, haw, hwq⟩ :=
          exists_shifted_root_atTop hcneg (hmems hamem)
            (fun x hax hpx => by
              have : x ≤ a := hale x (by
                rw [hsdef, Multiset.mem_toFinset, Polynomial.mem_roots hp0]; exact hpx)
              linarith)
        have hwt : w ∈ t := hmemt w hwq
        have hws : w ∉ s := fun h => by have := hale w h; linarith
        -- an auxiliary point above everything in `t`, off `t`.
        obtain ⟨u, huw, hut⟩ : ∃ u : ℝ, w < u ∧ ∀ z ∈ t, z < u := by
          refine ⟨(insert w t).max' ⟨w, mem_insert_self _ _⟩ + 1, ?_, fun z hz => ?_⟩
          · have := (insert w t).le_max' w (mem_insert_self _ _); linarith
          · have := (insert w t).le_max' z (mem_insert_of_mem hz); linarith
        have hus : u ∉ s := fun h => by have := hale u h; linarith
        have hut' : u ∉ t := fun h => lt_irrefl u (hut u h)
        have hinter' : ∀ x ∈ insert u s, ∀ y ∈ insert u s, x < y →
            (∀ z ∈ insert u s, z ∉ Set.Ioo x y) → ∃ z ∈ t, x < z ∧ z < y := by
          intro x hx y hy hxy _
          rcases mem_insert.1 hx with hxu | hxs
          · -- `x = u` is the maximum, so `x < y` is impossible.
            subst hxu
            rcases mem_insert.1 hy with hyu | hys
            · exact absurd (hyu ▸ hxy) (lt_irrefl _)
            · exact absurd (lt_trans hxy (lt_of_le_of_lt (hale y hys) (lt_trans haw huw))) (by
                have := hale y hys; linarith)
          · rcases mem_insert.1 hy with hyu | hys
            · -- `y = u`: use the root `w` with `x < w < u`.
              subst hyu
              refine ⟨w, hwt, ?_, huw⟩
              exact lt_of_le_of_lt (hale x hxs) haw
            · exact hinterior x hxs y hys hxy
        have hcard := Finset.card_le_diff_of_interleaved hinter'
        rw [Finset.card_insert_of_notMem hus, Finset.sdiff_insert,
          Finset.erase_eq_of_notMem (by simp [hut']), Nat.add_le_add_iff_right] at hcard
        exact hcard
      · -- `c > 0`: the extra root sits *below* `min s`.
        set a : ℝ := s.min' hsne with hadef
        have hamem : a ∈ s := s.min'_mem hsne
        have hage : ∀ x ∈ s, a ≤ x := fun x hx => s.min'_le x hx
        obtain ⟨w, hwa, hwq⟩ :=
          exists_shifted_root_atBot hcpos (hmems hamem)
            (fun x hxa hpx => by
              have : a ≤ x := hage x (by
                rw [hsdef, Multiset.mem_toFinset, Polynomial.mem_roots hp0]; exact hpx)
              linarith)
        have hwt : w ∈ t := hmemt w hwq
        have hws : w ∉ s := fun h => by have := hage w h; linarith
        obtain ⟨u, huw, hut⟩ : ∃ u : ℝ, u < w ∧ ∀ z ∈ t, u < z := by
          refine ⟨(insert w t).min' ⟨w, mem_insert_self _ _⟩ - 1, ?_, fun z hz => ?_⟩
          · have := (insert w t).min'_le w (mem_insert_self _ _); linarith
          · have := (insert w t).min'_le z (mem_insert_of_mem hz); linarith
        have hus : u ∉ s := fun h => by have := hage u h; linarith
        have hut' : u ∉ t := fun h => lt_irrefl u (hut u h)
        have hinter' : ∀ x ∈ insert u s, ∀ y ∈ insert u s, x < y →
            (∀ z ∈ insert u s, z ∉ Set.Ioo x y) → ∃ z ∈ t, x < z ∧ z < y := by
          intro x hx y hy hxy _
          rcases mem_insert.1 hx with hxu | hxs
          · -- `x = u` is the minimum: use the root `w` with `u < w < y`.
            subst hxu
            rcases mem_insert.1 hy with hyu | hys
            · exact absurd (hyu ▸ hxy) (lt_irrefl _)
            · refine ⟨w, hwt, huw, ?_⟩
              exact lt_of_lt_of_le hwa (hage y hys)
          · rcases mem_insert.1 hy with hyu | hys
            · -- `y = u` is the minimum, so `x < y` is impossible.
              subst hyu
              exact absurd (lt_trans (lt_of_lt_of_le (lt_trans huw hwa) (hage x hxs)) hxy)
                (lt_irrefl _)
            · exact hinterior x hxs y hys hxy
        have hcard := Finset.card_le_diff_of_interleaved hinter'
        rw [Finset.card_insert_of_notMem hus, Finset.sdiff_insert,
          Finset.erase_eq_of_notMem (by simp [hut']), Nat.add_le_add_iff_right] at hcard
        exact hcard
  -- Final assembly: `card p.roots = ∑ (rootMult p - 1) + s.card ≤ card q.roots`.
  have hsum_p : Multiset.card p.roots = (∑ x ∈ s, (p.rootMultiplicity x - 1)) + s.card := by
    rw [hsdef]
    conv_lhs => rw [← Multiset.toFinset_sum_count_eq p.roots]
    rw [Finset.card_eq_sum_ones, ← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl (fun x hx => ?_)
    rw [Polynomial.count_roots]
    have : 1 ≤ p.rootMultiplicity x := by
      rw [← Polynomial.count_roots]
      exact Multiset.one_le_count_iff_mem.2 (Multiset.mem_toFinset.1 hx)
    omega
  have hDcard : (t \ s).card ≤ ∑ x ∈ t \ s, q.rootMultiplicity x := by
    rw [Finset.card_eq_sum_ones]
    refine Finset.sum_le_sum (fun x hx => ?_)
    rw [← Polynomial.count_roots]
    exact Multiset.one_le_count_iff_mem.2 (Multiset.mem_toFinset.1 (Finset.mem_sdiff.1 hx).1)
  have hcard_q : Multiset.card q.roots = ∑ x ∈ t, q.rootMultiplicity x := by
    rw [htdef, ← Multiset.toFinset_sum_count_eq q.roots]
    exact Finset.sum_congr rfl (fun x _ => Polynomial.count_roots q)
  have hunion : ∑ x ∈ s ∪ t, q.rootMultiplicity x = ∑ x ∈ t, q.rootMultiplicity x :=
    (Finset.sum_subset Finset.subset_union_right (fun x _ hx =>
      Polynomial.rootMultiplicity_eq_zero (fun hroot => hx (hmemt x hroot)))).symm
  have hsplit : (∑ x ∈ s, q.rootMultiplicity x) + (∑ x ∈ t \ s, q.rootMultiplicity x)
      = Multiset.card q.roots := by
    rw [← Finset.sum_union Finset.disjoint_sdiff, Finset.union_sdiff_self_eq_union, hunion,
      hcard_q]
  have hfinal : Multiset.card p.roots ≤ Multiset.card q.roots := by
    rw [hsum_p, ← hsplit]
    have hle1 : (∑ x ∈ s, (p.rootMultiplicity x - 1)) ≤ ∑ x ∈ s, q.rootMultiplicity x :=
      Finset.sum_le_sum (fun x _ => hmult x)
    calc (∑ x ∈ s, (p.rootMultiplicity x - 1)) + s.card
        ≤ (∑ x ∈ s, q.rootMultiplicity x) + s.card := by omega
      _ ≤ (∑ x ∈ s, q.rootMultiplicity x) + (t \ s).card := by omega
      _ ≤ (∑ x ∈ s, q.rootMultiplicity x) + (∑ x ∈ t \ s, q.rootMultiplicity x) := by omega
  have hpe : Multiset.card p.roots = p.natDegree := hp
  exact hpe ▸ hfinal

/-- **Atomic Hermite–Poulain shift step** (`hermitePoulain_shift`, gap 1 of
`heat_preserves_LP`).  For every real `c`, the operator `p ↦ p′ + c·p` preserves
real-rootedness (roots counted with multiplicity).

Structure of the proof:
* `c = 0`: `p′ + 0·p = p′`, so this is exactly the already-proved
  `hasOnlyRealRoots_derivative`.
* `p = 0`: both sides are the zero polynomial (`0` real roots, degree `0`).
* `c ≠ 0, p ≠ 0`: the shifted polynomial `q := p′ + c·p` has `natDegree q = natDegree p`
  (the `c·p` term dominates the strictly-lower-degree `p′`), so `card q.roots ≤ natDegree q
  = natDegree p = card p.roots` (`Polynomial.card_roots'` + real-rootedness of `p`).  The
  matching lower bound `natDegree p ≤ card q.roots` is `hermitePoulain_card_lower`, whose
  only-missing ingredient (the root at infinity) is documented there.  The two bounds
  pin `card q.roots = natDegree q`, i.e. `q` is real-rooted. -/
theorem hermitePoulain_shift (c : ℝ) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (Polynomial.derivative p + c • p) := by
  rcases eq_or_ne c 0 with rfl | hc
  · have h0 : Polynomial.derivative p + (0 : ℝ) • p = Polynomial.derivative p := by
      rw [zero_smul, add_zero]
    rw [h0]; exact hasOnlyRealRoots_derivative hp
  rcases eq_or_ne p 0 with rfl | hp0
  · simp only [Polynomial.derivative_zero, smul_zero, add_zero, HasOnlyRealRoots,
      Polynomial.roots_zero, Polynomial.natDegree_zero, Multiset.card_zero]
  have hdeg : (Polynomial.derivative p + c • p).natDegree = p.natDegree := by
    rcases Nat.eq_zero_or_pos p.natDegree with h0 | hpos
    · rw [Polynomial.derivative_of_natDegree_zero h0, zero_add, Polynomial.natDegree_smul p hc]
    · have hside : (Polynomial.derivative p).natDegree < (c • p).natDegree := by
        rw [Polynomial.natDegree_smul p hc]
        exact Polynomial.natDegree_derivative_lt hpos.ne'
      rw [add_comm, Polynomial.natDegree_add_eq_left_of_natDegree_lt hside,
          Polynomial.natDegree_smul p hc]
  have hle : Multiset.card (Polynomial.derivative p + c • p).roots
      ≤ (Polynomial.derivative p + c • p).natDegree := Polynomial.card_roots' _
  have hge : p.natDegree ≤ Multiset.card (Polynomial.derivative p + c • p).roots :=
    hermitePoulain_card_lower hc hp hp0
  unfold HasOnlyRealRoots at hp ⊢
  omega

/-! ### The finite heat factor `1 − c·D²` (Task 1 & 2 — the FINITE side, sorry-free)

The heat operator is the `n → ∞` limit of the finite operator `(1 − (t/n)·D²)ⁿ`.  Each
factor `1 − c·D²` (for `c > 0`) is itself a *product of two real Hermite–Poulain shifts*
via `1 − c·D² = (1 + √c·D)(1 − √c·D)`.  Since `hermitePoulain_shift` is now fully
sorry-free, so is the statement that `1 − c·D²` (and every finite power of it) preserves
real-rootedness.  This closes the entire FINITE side of the polynomial de Bruijn theorem;
the sole remaining gap is the analytic `n → ∞` limit (Hurwitz), isolated below. -/

/-- **Scaling by a nonzero constant preserves real-rootedness.**  If `p` is real-rooted and
`a ≠ 0` then `a • p` is real-rooted: `roots (a • p) = roots p` (`roots_smul_nonzero`) and
`natDegree (a • p) = natDegree p` (`natDegree_smul`).  Sorry-free. -/
theorem hasOnlyRealRoots_smul {a : ℝ} (ha : a ≠ 0) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (a • p) := by
  unfold HasOnlyRealRoots at hp ⊢
  rw [Polynomial.roots_smul_nonzero p ha, Polynomial.natDegree_smul p ha]
  exact hp

/-- The finite heat factor `1 − c·D²` acting on `p`, i.e. `p − c·p″`.  For `t ≥ 0` the
`n`-th iterate `(1 − (t/n)·D²)ⁿ` converges to the heat operator `e^{−t·D²} = heatOp t`. -/
noncomputable def oneMinusCD2 (c : ℝ) (p : ℝ[X]) : ℝ[X] :=
  p - c • Polynomial.derivative (Polynomial.derivative p)

/-- **The finite heat factor preserves real-rootedness (Task 1, sorry-free).**  For `c > 0`,
`1 − c·D²` maps real-rooted polynomials to real-rooted polynomials.

Proof via the factorization `1 − c·D² = (1 + √c·D)(1 − √c·D)`, realised as a composition of
two `hermitePoulain_shift`s and a constant rescaling (all real, since `c > 0`).  Writing
`s := √c` (`s² = c`, `s ≠ 0`), the two shift factors and the scaling are:

* inner shift `q := p′ + (−1/s)·p`  — real-rooted by `hermitePoulain_shift (−1/s)`;
* outer shift `p′ + (1/s)·q` (`= D²p − (1/c)·p`) — real-rooted by `hermitePoulain_shift (1/s)`;
* scale by `−c` (nonzero) — real-rooted by `hasOnlyRealRoots_smul`.

The algebraic identity `p − c·p″ = (−c)·(q′ + (1/s)·q)` (the cross `p′` terms cancel because
the two shift constants `±1/s` sum to `0`, and `(−c)·(−1/c) = 1`) is discharged by the `module`
tactic after eliminating the two `s²=c` / `c≠0` scalar facts. -/
theorem oneMinusCD2_realRooted {c : ℝ} (hc : 0 < c) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (oneMinusCD2 c p) := by
  have hcne : c ≠ 0 := ne_of_gt hc
  set s : ℝ := Real.sqrt c with hsdef
  have hspos : 0 < s := Real.sqrt_pos.mpr hc
  have hs : s ≠ 0 := ne_of_gt hspos
  have hss : s * s = c := Real.mul_self_sqrt hc.le
  set q : ℝ[X] := Polynomial.derivative p + (-1/s) • p with hqdef
  have hq : HasOnlyRealRoots q := by
    rw [hqdef]; exact hermitePoulain_shift (-1/s) hp
  have hcomp : HasOnlyRealRoots (Polynomial.derivative q + (1/s) • q) :=
    hermitePoulain_shift (1/s) hq
  have hfin : HasOnlyRealRoots ((-c) • (Polynomial.derivative q + (1/s) • q)) :=
    hasOnlyRealRoots_smul (neg_ne_zero.mpr hcne) hcomp
  have hid : oneMinusCD2 c p = (-c) • (Polynomial.derivative q + (1/s) • q) := by
    have ecomp : Polynomial.derivative q + (1/s) • q
        = Polynomial.derivative (Polynomial.derivative p) + (-(1/c)) • p := by
      rw [hqdef, Polynomial.derivative_add, Polynomial.derivative_smul, smul_add, smul_smul,
        show (1/s) * (-1/s) = -(1/c) by
          rw [show (1/s) * (-1/s) = -(1/(s*s)) by ring, hss]]
      module
    rw [ecomp]
    unfold oneMinusCD2
    rw [smul_add, smul_smul, show (-c) * (-(1/c)) = 1 by
      rw [neg_mul_neg, mul_one_div, div_self hcne], one_smul]
    module
  rw [hid]; exact hfin

/-- **Every finite power `(1 − c·D²)ⁿ` preserves real-rootedness (Task 2, sorry-free).**
Induction on `n`, each step being `oneMinusCD2_realRooted`. -/
theorem oneMinusCD2_iterate_realRooted {c : ℝ} (hc : 0 < c) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : ∀ n : ℕ, HasOnlyRealRoots ((oneMinusCD2 c)^[n] p)
  | 0 => by simpa using hp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply]
      exact oneMinusCD2_realRooted hc (oneMinusCD2_iterate_realRooted hc hp n)

/-- **The finite heat factor preserves degree (Task 3 support, sorry-free).**  Because
`c·p″` has strictly smaller degree than `p` (or `p″ = 0` when `deg p = 0`), the leading term
of `p` survives: `(1 − c·D²)p` has the same degree as `p`.  This is the bounded-degree
bookkeeping the Hurwitz limit requires — the whole approximating sequence stays at degree
`natDegree p`. -/
theorem oneMinusCD2_natDegree (c : ℝ) (p : ℝ[X]) :
    (oneMinusCD2 c p).natDegree = p.natDegree := by
  unfold oneMinusCD2
  rcases Nat.eq_zero_or_pos p.natDegree with hN | hN
  · rw [Polynomial.derivative_of_natDegree_zero hN, Polynomial.derivative_zero, smul_zero,
      sub_zero]
  · have hd2 : (Polynomial.derivative (Polynomial.derivative p)).natDegree < p.natDegree := by
      have h1 := Polynomial.natDegree_derivative_le (Polynomial.derivative p)
      have h2 := Polynomial.natDegree_derivative_le p
      omega
    exact Polynomial.natDegree_sub_eq_left_of_natDegree_lt
      (lt_of_le_of_lt (Polynomial.natDegree_smul_le _ _) hd2)

/-- **Every finite power `(1 − c·D²)ⁿ` preserves degree (Task 3 support, sorry-free).**
The whole approximating family `(1 − (t/n)·D²)ⁿ p` therefore has constant degree `natDegree p`
in `n`, so the coefficient limit lands in the same bounded-degree stratum — exactly the
hypothesis the Hurwitz limit lemma needs. -/
theorem oneMinusCD2_iterate_natDegree (c : ℝ) (p : ℝ[X]) :
    ∀ n : ℕ, ((oneMinusCD2 c)^[n] p).natDegree = p.natDegree
  | 0 => by simp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply, oneMinusCD2_natDegree,
        oneMinusCD2_iterate_natDegree c p n]

/-! ### The heat / Laguerre–Pólya multiplier operator, made CONCRETE

The core project (and the previous version of this file) left the heat multiplier
`opaque`.  That made `heat_preserves_LP` *unfalsifiable*: nothing could be said about
a black box.  Here we replace it with the genuine finite differential operator and
prove its algebraic structure `sorry`-free, so the single remaining `sorry` isolates
exactly one deep analytic fact (de Bruijn 1950 / Pólya–Schur) about a concrete,
computable operator.

`heatOp t p = ∑ₖ ((−t)ᵏ/k!)·D^{2k} p` is the operator `e^{−t·D²}` (Fourier/Weierstrass
symbol `e^{−t x²}`).  The sum is genuinely finite: `D^{2k} p = 0` once `2k > deg p`,
so summing `k` over `range (natDegree p + 1)` captures every nonzero term.

**Why the sign.**  For `t ≥ 0` the symbol `e^{−t x²}` lies in the Laguerre–Pólya
class, so `e^{−t·D²}` is exactly the direction that PRESERVES real-rootedness (the
polynomial de Bruijn theorem).  The forward operator `e^{+t·D²}` does NOT: e.g.
`e^{t·D²}(X²−1) = X² + (2t−1)` acquires a conjugate pair of non-real roots for
`t > 1/2`.  This is why the preservation theorem carries the hypothesis `0 ≤ t`. -/

/-- Fixed-cutoff heat partial sum `∑_{k<N} ((−t)ᵏ/k!)·D^{2k} p`.  Introduced as a
separate definition (with an *explicit* cutoff `N`) so that additivity/`smul` can be
proved at a cutoff independent of `natDegree` — which changes under `+` and `•`. -/
noncomputable def heatPartial (N : ℕ) (t : ℝ) (p : ℝ[X]) : ℝ[X] :=
  ∑ k ∈ Finset.range N, ((-t) ^ k / (Nat.factorial k : ℝ)) • Polynomial.derivative^[2 * k] p

/-- Iterated formal derivative is additive (helper; mathlib has `iterate_derivative_sum`
and `iterate_derivative_smul` but no bare `iterate_derivative_add`). -/
theorem iterate_derivative_add (k : ℕ) (p q : ℝ[X]) :
    Polynomial.derivative^[k] (p + q)
      = Polynomial.derivative^[k] p + Polynomial.derivative^[k] q := by
  induction k with
  | zero => simp
  | succ k ih =>
      simp only [Function.iterate_succ_apply', ih, Polynomial.derivative_add]

/-- `heatPartial N t` is additive (at a fixed cutoff `N`). -/
theorem heatPartial_add (N : ℕ) (t : ℝ) (p q : ℝ[X]) :
    heatPartial N t (p + q) = heatPartial N t p + heatPartial N t q := by
  unfold heatPartial
  rw [← Finset.sum_add_distrib]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [iterate_derivative_add, smul_add]

/-- `heatPartial N t` is `ℝ`-homogeneous (at a fixed cutoff `N`). -/
theorem heatPartial_smul (N : ℕ) (t c : ℝ) (p : ℝ[X]) :
    heatPartial N t (c • p) = c • heatPartial N t p := by
  unfold heatPartial
  rw [Finset.smul_sum]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [Polynomial.iterate_derivative_smul]
  exact smul_comm _ _ _

/-- **Cutoff stability.**  Enlarging the cutoff `N` beyond `natDegree p + 1` adds only
zero terms (`D^{2k} p = 0` for `2k > natDegree p`), so `heatPartial` is independent of
`N` once `N ≥ natDegree p + 1`.  This is what makes `heatOp` well-defined and lets
additivity transfer from the fixed-cutoff `heatPartial`. -/
theorem heatPartial_stable {N : ℕ} {t : ℝ} {p : ℝ[X]} (h : p.natDegree + 1 ≤ N) :
    heatPartial N t p = heatPartial (p.natDegree + 1) t p := by
  unfold heatPartial
  refine (Finset.sum_subset (Finset.range_subset.mpr h) ?_).symm
  intro k _ hk
  simp only [Finset.mem_range, not_lt] at hk
  rw [Polynomial.iterate_derivative_eq_zero (by omega : p.natDegree < 2 * k), smul_zero]

/-- **The heat / Laguerre–Pólya multiplier operator** `e^{−t·D²}` on `ℝ[X]`, as a
genuine (finite, computable) polynomial map — the concrete replacement for the former
`opaque heatMultiplier`. -/
noncomputable def heatOp (t : ℝ) (p : ℝ[X]) : ℝ[X] := heatPartial (p.natDegree + 1) t p

/-- `heatOp 0 = id`: at `t = 0` every `k ≥ 1` term vanishes and the `k = 0` term is `p`.
Sorry-free. -/
@[simp] theorem heatOp_zero (p : ℝ[X]) : heatOp 0 p = p := by
  unfold heatOp heatPartial
  rw [Finset.sum_eq_single (0 : ℕ)]
  · simp
  · intro k _ hk
    rw [neg_zero, zero_pow hk, zero_div, zero_smul]
  · intro h
    exact absurd (Finset.mem_range.mpr (Nat.succ_pos _)) h

/-- `heatOp t` is additive.  Sorry-free (transfers from `heatPartial_add` via cutoff
stability at a common cutoff). -/
theorem heatOp_add (t : ℝ) (p q : ℝ[X]) :
    heatOp t (p + q) = heatOp t p + heatOp t q := by
  obtain ⟨N, hpq, hp, hq⟩ :
      ∃ N, (p + q).natDegree + 1 ≤ N ∧ p.natDegree + 1 ≤ N ∧ q.natDegree + 1 ≤ N :=
    ⟨(p + q).natDegree + p.natDegree + q.natDegree + 1, by omega, by omega, by omega⟩
  unfold heatOp
  rw [← heatPartial_stable hpq, ← heatPartial_stable hp, ← heatPartial_stable hq,
      heatPartial_add]

/-- `heatOp t` is `ℝ`-homogeneous.  Sorry-free. -/
theorem heatOp_smul (t c : ℝ) (p : ℝ[X]) :
    heatOp t (c • p) = c • heatOp t p := by
  obtain ⟨N, hcp, hp⟩ : ∃ N, (c • p).natDegree + 1 ≤ N ∧ p.natDegree + 1 ≤ N :=
    ⟨(c • p).natDegree + p.natDegree + 1, by omega, by omega⟩
  unfold heatOp
  rw [← heatPartial_stable hcp, ← heatPartial_stable hp, heatPartial_smul]

/-- **`heatOp` preserves degree.**  `heatOp t p = p + (lower-degree terms)`: the `k = 0`
term is `p` and every `k ≥ 1` term has degree `≤ natDegree p − 2 < natDegree p`.  So
`(heatOp t p).natDegree = p.natDegree`.  Sorry-free.  (In particular `heatOp t` sends
nonzero polynomials to nonzero polynomials of the same degree — a genuine multiplier
property, and exactly the degree bookkeeping the LP-preservation statement needs.) -/
theorem heatOp_natDegree (t : ℝ) (p : ℝ[X]) : (heatOp t p).natDegree = p.natDegree := by
  have hrw : heatOp t p =
      (∑ k ∈ Finset.range p.natDegree,
        ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
          • Polynomial.derivative^[2 * (k + 1)] p) + p := by
    unfold heatOp heatPartial
    rw [Finset.sum_range_succ']
    congr 1
    simp
  rcases Nat.eq_zero_or_pos p.natDegree with hN | hN
  · rw [hrw]; simp [hN]
  · have hlt : (∑ k ∈ Finset.range p.natDegree,
          ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p).natDegree < p.natDegree := by
      have hbound : (∑ k ∈ Finset.range p.natDegree,
            ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
              • Polynomial.derivative^[2 * (k + 1)] p).natDegree ≤ p.natDegree - 1 := by
        refine Polynomial.natDegree_sum_le_of_forall_le (Finset.range p.natDegree)
          (fun k => ((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p) (fun k _ => ?_)
        show (((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p).natDegree ≤ p.natDegree - 1
        have h1 : (((-t) ^ (k + 1) / (Nat.factorial (k + 1) : ℝ))
            • Polynomial.derivative^[2 * (k + 1)] p).natDegree
            ≤ (Polynomial.derivative^[2 * (k + 1)] p).natDegree :=
          Polynomial.natDegree_smul_le _ _
        have h2 : (Polynomial.derivative^[2 * (k + 1)] p).natDegree ≤ p.natDegree - 2 * (k + 1) :=
          Polynomial.natDegree_iterate_derivative _ _
        omega
      omega
    rw [hrw, add_comm]
    exact Polynomial.natDegree_add_eq_left_of_natDegree_lt hlt

/-! ### The remaining honest gap: the analytic `n → ∞` limit (Hurwitz)

With `heatOp` concrete AND the whole FINITE side now closed sorry-free, the ONE deep
analytic fact still missing from mathlib is crisply isolated below.  The finite
ingredients are all proved sorry-free above:

* `hasOnlyRealRoots_derivative` / `hasOnlyRealRoots_iterate_derivative` — `Dⁿ` preserves LP;
* `hermitePoulain_shift` — the atomic real shift `p ↦ p′ + c·p` preserves LP;
* `oneMinusCD2_realRooted` / `oneMinusCD2_iterate_realRooted` — the **entire finite heat
  factor `(1 − c·D²)ⁿ`** preserves LP (Tasks 1 & 2), together with degree preservation
  `oneMinusCD2_iterate_natDegree`;
* the whole `heatOp` algebra (`heatOp_add`, `heatOp_smul`, `heatOp_natDegree`, …).

What remains is a SINGLE analytic passage: `heatOp t p = limₙ (1 − (t/n)·D²)ⁿ p`
coefficient-wise, and real-rootedness survives that coefficient limit (Hurwitz's theorem).
The reality does NOT follow termwise (a sum of real-rooted polynomials need not be
real-rooted), which is why the finite-factor closure above does not by itself finish. -/

/-- **Heat semigroup preserves the (polynomial) Laguerre–Pólya class** — `heat_preserves_LP`.

For `t ≥ 0`, if `p` has only real roots then so does `e^{−t·D²} p = heatOp t p`.  This
is the polynomial case of de Bruijn's theorem (equivalently the Pólya–Schur
characterization of the LP-multiplier `e^{−t x²}`).  It is now a genuine, falsifiable
statement about a CONCRETE operator (`heatOp`), not the former opaque black box.

**The FINITE side is now fully closed (Tasks 1 & 2, sorry-free).**  The standard proof
factors the symbol and passes to a limit:

  `e^{−t·D²} = limₙ (1 − (t/n)·D²)ⁿ`,   and for `t ≥ 0, n > 0`,
  `1 − (t/n)·D² = (1 + √(t/n)·D)(1 − √(t/n)·D)`  (real shifts, since `t ≥ 0`).

The finite operator `(1 − (t/n)·D²)ⁿ` is now PROVED to preserve real-rootedness sorry-free:

* the atomic shift `p ↦ p′ + c·p` (`hermitePoulain_shift`);
* one factor `1 − c·D² = (1 + √c·D)(1 − √c·D)` (`oneMinusCD2_realRooted`, `c > 0`), a
  composition of two shifts and a nonzero rescaling;
* every power `(1 − c·D²)ⁿ` (`oneMinusCD2_iterate_realRooted`), by induction.

**The single remaining `sorry` — precise missing mathlib input (the `n → ∞` limit,
Hurwitz).**  Instantiate `qₙ := (1 − (t/n)·D²)ⁿ p` (for `t > 0`; the `t = 0` case is
`heatOp_zero`).  Then:
  1. every `qₙ` is real-rooted — `oneMinusCD2_iterate_realRooted` (PROVED);
  2. `natDegree qₙ = natDegree p` for all `n` — `oneMinusCD2_iterate_natDegree` (PROVED);
  3. `(qₙ).coeff m → (heatOp t p).coeff m` as `n → ∞`, for every `m` — the classical
     coefficient-wise `(1 − x/n)ⁿ → e^{−x}` (NOT in mathlib as a `roots`/coefficient bridge);
  4. real-rootedness passes to the coefficient limit of a bounded-degree family — **Hurwitz's
     theorem on continuity of roots** (mathlib has `Polynomial.coeff_le_of_roots_le` /
     `coeff_bdd_of_roots_le` and continuity of `eval`, but NO continuity of the `roots`
     multiset in the coefficients, and NO `tendsto_roots`).

Steps 3–4 are the entire content of this `sorry`; steps 1–2 are discharged sorry-free
above.  This is exactly the polynomial Hurwitz limit, absent from mathlib as of v4.22.0. -/
theorem heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (heatOp t p) := by
  -- FINITE side (sorry-free): for every n, qₙ := (1 − (t/n)·D²)ⁿ p is real-rooted of degree
  -- natDegree p (`oneMinusCD2_iterate_realRooted`, `oneMinusCD2_iterate_natDegree`).  The ONLY
  -- gap is the analytic n → ∞ coefficient limit + Hurwitz continuity of roots (steps 3–4).
  sorry

/-! ## 3. Axiom audit -/

-- Sorry-free lemmas (each should report ONLY the standard mathlib axioms
-- `propext`, `Classical.choice`, `Quot.sound`, plus the declared stand-in `H`
-- for the DBN-flow lemmas).  No `sorryAx`.
#print axioms derivative_hasRoot_between
#print axioms exists_derivative_root_of_two_roots
#print axioms heatKernel_pos
#print axioms dbn_unique
#print axioms monotone_of_dbn
#print axioms RH_iff_lambda_nonpos
#print axioms RH_iff_lambda_eq_zero
#print axioms hasOnlyRealRoots_derivative
#print axioms hasOnlyRealRoots_iterate_derivative
#print axioms exists_shifted_root_between

-- Gap 1 (Hermite–Poulain shift) is now FULLY CLOSED and `sorry`-free.  The "root at
-- infinity" (`exists_shifted_root_atBot` / `exists_shifted_root_atTop`, EVT + Fermat +
-- exp-beats-polynomial decay) supplies the missing `n`-th root, so `hermitePoulain_card_lower`
-- and hence `hermitePoulain_shift` report ONLY the standard mathlib axioms — no `sorryAx`.
#print axioms exists_shifted_root_atBot
#print axioms exists_shifted_root_atTop
#print axioms hermitePoulain_card_lower
#print axioms hermitePoulain_shift

-- Tasks 1 & 2 — the ENTIRE finite heat factor `(1 − c·D²)ⁿ` (and its degree bookkeeping)
-- now preserves real-rootedness sorry-free (built from `hermitePoulain_shift`).  These MUST
-- report ONLY the standard mathlib axioms — no `sorryAx`.
#print axioms hasOnlyRealRoots_smul
#print axioms oneMinusCD2_realRooted
#print axioms oneMinusCD2_iterate_realRooted
#print axioms oneMinusCD2_natDegree
#print axioms oneMinusCD2_iterate_natDegree

-- The concrete heat-operator algebra (all sorry-free).
#print axioms iterate_derivative_add
#print axioms heatPartial_add
#print axioms heatPartial_smul
#print axioms heatPartial_stable
#print axioms heatOp_zero
#print axioms heatOp_add
#print axioms heatOp_smul
#print axioms heatOp_natDegree

-- The single deep-analytic gap: this SHOULD report `sorryAx` (polynomial de Bruijn /
-- Pólya–Schur LP-multiplier theorem, not in mathlib).
#print axioms heat_preserves_LP

end MathlibBridge
