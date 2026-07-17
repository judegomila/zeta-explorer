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

/-! ### The remaining honest gap: the polynomial de Bruijn / Pólya–Schur theorem

With `heatOp` concrete, the ONE deep analytic fact still missing from mathlib is
crisply isolated below.  The finite ingredients are proved sorry-free above
(`hasOnlyRealRoots_derivative`, `hasOnlyRealRoots_iterate_derivative`, and the whole
`heatOp` algebra); what remains is the *reality of the roots of the finite sum*, which
does NOT follow termwise (a sum of real-rooted polynomials need not be real-rooted). -/

/-- **Heat semigroup preserves the (polynomial) Laguerre–Pólya class** — `heat_preserves_LP`.

For `t ≥ 0`, if `p` has only real roots then so does `e^{−t·D²} p = heatOp t p`.  This
is the polynomial case of de Bruijn's theorem (equivalently the Pólya–Schur
characterization of the LP-multiplier `e^{−t x²}`).  It is now a genuine, falsifiable
statement about a CONCRETE operator (`heatOp`), not the former opaque black box.

**The single remaining `sorry` — precise missing mathlib input.**  The standard proof
factors the symbol and passes to a limit:

  `e^{−t·D²} = limₙ (1 − (t/n)·D²)ⁿ`,   and for `t ≥ 0, n > 0`,
  `1 − (t/n)·D² = −(t/n)·(D − √(n/t))·(D + √(n/t))`  (real shifts, since `t ≥ 0`),

a Hermite–Poulain product of **linear real-shift factors** `p ↦ p′ ± √(n/t)·p`.  Two
mathlib gaps block a sorry-free finish, either of which is the smallest reachable
sub-step:

* **(atomic Hermite–Poulain step)** for real `c`, `p ↦ Polynomial.derivative p + c • p`
  preserves real-rootedness.  Mathlib has the *derivative* interlacing
  (`Polynomial.card_roots_le_derivative`, used above) but NOT the shifted operator
  `p′ + c·p` (its interlacing needs the sign/Rolle analysis of `e^{c x} p`, whose
  factor `e^{c x}` is not a polynomial).
* **(the limit)** continuity of `Polynomial.roots` under coefficient limits
  (Hurwitz's theorem) — mathlib has no `roots`-continuity / `ContinuousMultilinearMap`
  bridge from convergence of coefficients to convergence of the (real) root multiset.

Reference: N. G. de Bruijn, *The roots of trigonometric integrals*, Duke Math. J. 17
(1950), 197–226; Pólya–Schur, *J. reine angew. Math.* 144 (1914); N. Obreschkoff,
*Verteilung und Berechnung der Nullstellen reeller Polynome* (1963), Hermite–Poulain
theorem; Rahman–Schmeisser, *Analytic Theory of Polynomials* (2002), Ch. 5. -/
theorem heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (heatOp t p) := by
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
