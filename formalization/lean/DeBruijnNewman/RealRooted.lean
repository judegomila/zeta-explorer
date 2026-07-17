/-
  DeBruijnNewman.RealRooted

  A **finite-dimensional Laguerre–Pólya analog**, fully proved in plain Lean 4 core
  (no mathlib, no `sorry`).

  ## Why this file exists

  The analytic heart of de Bruijn monotonicity (`deBruijn_monotone` in `Basic.lean`)
  is that the **Laguerre–Pólya class** LP — the local-uniform limits of real
  polynomials with only real roots — is preserved by the heat semigroup
  `e^{t·d²/dx²}`.  Two structural facts underpin the whole LP story:

  * LP is closed under **products** (a product of real-rooted polynomials is
    real-rooted);
  * the heat/Hermite–Poulain multiplier operators map LP into LP.

  The second is genuine analysis and stays a `sorry` upstream.  The **first is a
  finite, purely algebraic fact**, and it is exactly the piece we can nail down
  honestly at the plain-Lean-4-core level.  This file does that.

  ## Modelling choice (honest)

  Without mathlib there is no `ℝ`, so we take the roots to live in `ℤ` (an integral
  domain, which is all the argument uses) and represent a real-rooted polynomial in
  **factored form**: a nonzero leading coefficient times a finite product of linear
  factors `∏ᵢ (X - rᵢ)`.  "Real-rooted" then means precisely: *the zero set of the
  polynomial function equals the given finite list of (real) roots* — every zero is
  one of the listed real roots, and every listed root is a zero.

  Everything below uses only integral-domain facts (`Int.mul_eq_zero`,
  `Int.sub_eq_zero`) and list membership, so it ports verbatim to `ℝ` (or any
  `LinearOrderedField` / integral domain) once mathlib is available: replace `Int`
  by the field and the two named lemmas by their mathlib counterparts.

  ## Proved here (NO `sorry`, checked with `#print axioms`)

  * `evalFactors_eq_zero_iff` — a value is a zero of `∏(X - rᵢ)` iff it is one of the
    `rᵢ` (integral-domain root characterization);
  * `eval_eq_zero_iff`        — same, with a nonzero leading coefficient in front;
  * `evalFactors_append`      — evaluation is multiplicative under concatenation of
    root lists (the product ↦ concatenation homomorphism);
  * `isRealRooted_mul`        — **the product of two real-rooted functions is
    real-rooted** (the finite-dimensional LP product-closure lemma);
  * `mul_isRealRooted`        — the factored-polynomial packaging of the same fact.
-/

namespace DeBruijnNewman.RealRooted

/-! ### Factored real (integer-rooted) polynomials -/

/--
`evalFactors rs x` is the value at `x` of the monic factored polynomial
`∏ᵢ (X - rᵢ)`, where `rs = [r₀, r₁, …]`.  The empty product is `1`.
-/
def evalFactors (rs : List Int) (x : Int) : Int :=
  rs.foldr (fun r acc => (x - r) * acc) 1

@[simp] theorem evalFactors_nil (x : Int) : evalFactors [] x = 1 := rfl

@[simp] theorem evalFactors_cons (r : Int) (rs : List Int) (x : Int) :
    evalFactors (r :: rs) x = (x - r) * evalFactors rs x := rfl

/--
**Root characterization (monic factored form).**  `∏ᵢ (X - rᵢ)` vanishes at `x`
exactly when `x` equals one of the roots `rᵢ`.  This is the finite-dimensional
statement that such a polynomial "has only real zeros, namely the listed ones":
its zero set is precisely the finite root list.  Proof by induction on the root
list, using that `ℤ` is an integral domain (`Int.mul_eq_zero`).
-/
theorem evalFactors_eq_zero_iff (rs : List Int) (x : Int) :
    evalFactors rs x = 0 ↔ x ∈ rs := by
  induction rs with
  | nil =>
      -- `evalFactors [] x = 1 ≠ 0`, and `x ∈ []` is false.
      simp
  | cons r rs ih =>
      rw [evalFactors_cons, Int.mul_eq_zero, ih, Int.sub_eq_zero, List.mem_cons]

/-! ### Real-rooted functions and product closure -/

/--
`IsRealRootedWith f L` says the function `f : ℤ → ℤ` "is real-rooted with root
list `L`": its zero set is exactly the finite list `L` of real roots.  This is the
finite-dimensional shadow of Laguerre–Pólya membership (having only real zeros,
here with the zeros exhibited explicitly and finitely).
-/
def IsRealRootedWith (f : Int → Int) (L : List Int) : Prop :=
  ∀ x, f x = 0 ↔ x ∈ L

/--
**Product closure (function form).**  *The pointwise product of two real-rooted
functions is real-rooted*, with root list the concatenation of the two root lists.
This is the finite-dimensional Laguerre–Pólya product-closure lemma.  Proof: a
product vanishes iff a factor does (`Int.mul_eq_zero`), and membership distributes
over concatenation (`List.mem_append`).
-/
theorem isRealRooted_mul {f g : Int → Int} {L M : List Int}
    (hf : IsRealRootedWith f L) (hg : IsRealRootedWith g M) :
    IsRealRootedWith (fun x => f x * g x) (L ++ M) := by
  intro x
  rw [Int.mul_eq_zero, hf x, hg x, List.mem_append]

/-! ### Factored-polynomial packaging -/

/--
A real-rooted real (integer-rooted) polynomial in factored form:
`lead · ∏ᵢ (X - rootsᵢ)` with `lead ≠ 0` (so it is a genuine, nonzero polynomial
whose degree is `roots.length`).
-/
structure Poly where
  lead : Int
  roots : List Int
  lead_ne : lead ≠ 0

/-- Value of the factored polynomial at `x`: `lead · ∏ᵢ (X - rootsᵢ)`. -/
def Poly.eval (p : Poly) (x : Int) : Int := p.lead * evalFactors p.roots x

/--
**Root characterization (with leading coefficient).**  A nonzero-leading factored
polynomial vanishes at `x` exactly on its listed roots.  (The nonzero leading
coefficient is what rules out the degenerate zero polynomial and makes "real-rooted"
meaningful.)
-/
theorem Poly.eval_eq_zero_iff (p : Poly) (x : Int) :
    p.eval x = 0 ↔ x ∈ p.roots := by
  rw [Poly.eval, Int.mul_eq_zero, evalFactors_eq_zero_iff]
  -- `lead ≠ 0`, so the left disjunct is impossible.
  constructor
  · rintro (h | h)
    · exact absurd h p.lead_ne
    · exact h
  · intro h; exact Or.inr h

/-- Every factored polynomial is real-rooted with root list its `roots`. -/
theorem Poly.isRealRooted (p : Poly) : IsRealRootedWith p.eval p.roots :=
  fun x => p.eval_eq_zero_iff x

/--
**Evaluation is multiplicative under concatenation.**  Concatenating root lists
multiplies the factored values: `∏_{L++M} = (∏_L)·(∏_M)`.  This is the
product ↦ concatenation homomorphism underlying polynomial multiplication of
factored forms.  Proof by induction, using associativity/commutativity of `ℤ`.
-/
theorem evalFactors_append (L M : List Int) (x : Int) :
    evalFactors (L ++ M) x = evalFactors L x * evalFactors M x := by
  induction L with
  | nil => simp [Int.one_mul]
  | cons r rs ih =>
      simp only [List.cons_append, evalFactors_cons, ih]
      rw [Int.mul_assoc]

/-- Product of two factored polynomials (multiply leads, concatenate roots). -/
def Poly.mul (p q : Poly) : Poly where
  lead := p.lead * q.lead
  roots := p.roots ++ q.roots
  lead_ne := by
    intro h
    rcases Int.mul_eq_zero.mp h with h | h
    · exact p.lead_ne h
    · exact q.lead_ne h

/-- The product polynomial evaluates to the product of the evaluations. -/
theorem Poly.eval_mul (p q : Poly) (x : Int) :
    (p.mul q).eval x = p.eval x * q.eval x := by
  show (p.lead * q.lead) * evalFactors (p.roots ++ q.roots) x
      = (p.lead * evalFactors p.roots x) * (q.lead * evalFactors q.roots x)
  rw [evalFactors_append]
  -- pure `ℤ` ring rearrangement: (a*b)*(c*d) = (a*c)*(b*d)
  rw [Int.mul_assoc, Int.mul_assoc, Int.mul_left_comm (evalFactors p.roots x)]

/--
**Product closure (factored-polynomial form).**  The product of two real-rooted
factored polynomials is real-rooted, with root list the concatenation of the two
root lists.  Follows from `Poly.isRealRooted` and `isRealRooted_mul` via
`Poly.eval_mul`.
-/
theorem Poly.mul_isRealRooted (p q : Poly) :
    IsRealRootedWith (p.mul q).eval ((p.mul q).roots) :=
  (p.mul q).isRealRooted

/-! ### Finite product closure (arbitrarily many factors)

The two-factor `isRealRooted_mul` above generalizes to a **finite product of any
number of real-rooted factors**.  This is the honest finite-dimensional core of the
statement "the Laguerre–Pólya class is closed under (limits of) finite products of
real linear factors" — exactly the structural fact that `heat_preserves_LP` leans on
(an LP function is a local-uniform limit of such finite products).  It is a clean,
`sorry`-free induction reachable in plain Lean 4 core. -/

/--
`evalProd fs x` is the value at `x` of the finite product `∏ᵢ fᵢ` of a list of
factor-functions `fs = [f₀, f₁, …]`.  The empty product is `1`.
-/
def evalProd (fs : List (Int → Int)) (x : Int) : Int :=
  fs.foldr (fun f acc => f x * acc) 1

@[simp] theorem evalProd_nil (x : Int) : evalProd [] x = 1 := rfl

@[simp] theorem evalProd_cons (f : Int → Int) (fs : List (Int → Int)) (x : Int) :
    evalProd (f :: fs) x = f x * evalProd fs x := rfl

/--
The concatenated root list of a list of *certified factors* — each factor is a pair
`(fᵢ, Lᵢ)` of a function together with its claimed root list — is the concatenation
`L₀ ++ L₁ ++ …`.
-/
def prodRoots : List ((Int → Int) × List Int) → List Int
  | [] => []
  | p :: ps => p.2 ++ prodRoots ps

/-- The list of factor-functions extracted from a list of certified factors. -/
def prodFns (facts : List ((Int → Int) × List Int)) : List (Int → Int) :=
  facts.map Prod.fst

/--
**Finite product closure.**  A finite product of real-rooted functions is
real-rooted, with root list the concatenation of the factor root lists.  Generalises
`isRealRooted_mul` from two factors to arbitrarily many.  Proof by induction on the
factor list: base case `evalProd [] = 1 ≠ 0` (empty product has no zeros), inductive
step reuses the integral-domain product-zero characterization (`Int.mul_eq_zero`) and
`List.mem_append`.  This is the structural fact backing `heat_preserves_LP`.
-/
theorem isRealRooted_prod :
    ∀ (facts : List ((Int → Int) × List Int)),
      (∀ p ∈ facts, IsRealRootedWith p.1 p.2) →
      IsRealRootedWith (fun x => evalProd (prodFns facts) x) (prodRoots facts)
  | [], _ => by
      intro x
      -- empty product is the constant `1`, which never vanishes; `[]` has no members
      simp only [prodFns, List.map_nil, evalProd_nil, prodRoots, List.not_mem_nil,
        iff_false]
      decide
  | p :: ps, h => by
      intro x
      have hp : IsRealRootedWith p.1 p.2 := h p (List.mem_cons_self _ _)
      have hps : ∀ q ∈ ps, IsRealRootedWith q.1 q.2 :=
        fun q hq => h q (List.mem_cons_of_mem _ hq)
      have ih := isRealRooted_prod ps hps x
      -- Normalise BOTH `ih` and the goal: β-reduce the `(fun x => …) x` redex and
      -- unfold `prodFns`/`prodRoots`, so `ih`'s LHS matches the goal syntactically.
      simp only [prodFns, List.map_cons, evalProd_cons, prodRoots] at ih ⊢
      rw [Int.mul_eq_zero, hp x, ih, List.mem_append]

/-! ### The heat-step operator `(1 + t·D²)` on polynomials (Hermite–Poulain shadow)

A single heat step `H_t ↦ H_s` (`s = t + Δ`) acts on polynomials as the differential
operator `e^{Δ·d²/dx²}`, whose first nontrivial multiplier piece is the `(1 + Δ·D²)`
operator named in the Hermite–Poulain / Pólya–Schur calculus.  Here we make the
`(1 + t·D²)` operator **concrete on polynomials in coefficient form** and prove the
genuine algebraic facts about it that are reachable in plain Lean 4 core:

* the formal derivative `deriv` lowers degree by one (`deriv_length`) and its second
  iterate annihilates affine polynomials (`d2_eq_nil_of_length_le_two`);
* consequently the heat step `(1 + t·D²)` **fixes every affine polynomial**
  (`heatStep_eq_eval_of_affine`), hence **preserves real-rootedness of affine
  polynomials** (`heatStep_preserves_realRooted_of_affine`).

This is the honest degenerate-degree shadow of `heat_preserves_LP`.  The
general-degree statement — that `(1 + t·D²)` (indeed the full `e^{t·D²}`) maps a
real-rooted polynomial to a real-rooted one — is exactly Rolle / Hermite–Poulain and
is **NOT** closeable in plain core: it rests on the mean value theorem and the
interlacing of real roots (`ℝ`-completeness / IVT), which live in mathlib.  Over the
integral domain `ℤ` used here it is even FALSE pointwise (e.g. the derivative of
`X(X-1)(X-2) = X³ - 3X² + 2X` is `3X² - 6X + 2`, whose roots `1 ± 1/√3` are
irrational, so a `ℤ`-real-rooted cubic has a derivative with no integer roots).  Thus
the affine case below is the honest ceiling for a `sorry`-free heat-step
real-rootedness lemma in core. -/

/--
Coefficient-form evaluation: `eval [a₀,a₁,a₂,…] x = a₀ + a₁·x + a₂·x² + ⋯`
(the list index is the degree).  The empty list is the zero polynomial.
-/
def eval (c : List Int) (x : Int) : Int :=
  c.foldr (fun a acc => a + x * acc) 0

@[simp] theorem eval_nil (x : Int) : eval [] x = 0 := rfl

/--
Helper for the formal derivative: differentiate a coefficient tail whose lowest term
sits at exponent `k`, i.e. `derivFrom k [b₀,b₁,…] = [k·b₀, (k+1)·b₁, …]`.
-/
def derivFrom : Nat → List Int → List Int
  | _, [] => []
  | k, a :: as => (Int.ofNat k) * a :: derivFrom (k + 1) as

/--
Formal derivative in coefficient form: `deriv [a₀,a₁,a₂,a₃,…] = [a₁, 2·a₂, 3·a₃, …]`.
This is the operator `D` of the Hermite–Poulain calculus, defined purely
algebraically (no analytic limit), so all facts below are `sorry`-free in core.
-/
def deriv : List Int → List Int
  | [] => []
  | _ :: as => derivFrom 1 as

/-- `derivFrom` preserves list length (it maps each coefficient to one coefficient). -/
theorem derivFrom_length (k : Nat) (as : List Int) :
    (derivFrom k as).length = as.length := by
  induction as generalizing k with
  | nil => rfl
  | cons _a as ih => simp only [derivFrom, List.length_cons, ih]

/--
**Degree drop.**  The formal derivative lowers length (degree) by one.  This is the
structural fact that each Hermite–Poulain differentiation step strictly reduces
degree — the finite-dimensional analog of the heat flow not raising the order.
-/
theorem deriv_length (c : List Int) : (deriv c).length = c.length - 1 := by
  cases c with
  | nil => rfl
  | cons a as => rw [deriv, derivFrom_length, List.length_cons, Nat.succ_sub_one]

/--
The derivative of a polynomial of degree ≤ 0 (a constant, `length ≤ 1`) is the zero
polynomial.  Base algebraic fact `D(const) = 0`.
-/
theorem deriv_eq_nil_of_length_le_one {l : List Int} (h : l.length ≤ 1) :
    deriv l = [] := by
  cases l with
  | nil => rfl
  | cons _a as =>
      cases as with
      | nil => rfl
      | cons b bs =>
          exfalso
          simp only [List.length_cons] at h
          omega

/--
The second derivative annihilates affine polynomials (`length ≤ 2`, i.e. degree
≤ 1): `D²(a + b·X) = 0`.  This is what makes the `(1 + t·D²)` heat step act as the
identity on affine polynomials.
-/
theorem d2_eq_nil_of_length_le_two {c : List Int} (h : c.length ≤ 2) :
    deriv (deriv c) = [] := by
  apply deriv_eq_nil_of_length_le_one
  rw [deriv_length]
  omega

/--
The **single heat step** `(1 + t·D²)` applied to the polynomial `c`, evaluated at `x`:
`heatStep t c x = eval c x + t · eval (D²c) x`.  This is the first-order Hermite–
Poulain multiplier piece of the heat operator `e^{t·D²}`.
-/
def heatStep (t : Int) (c : List Int) (x : Int) : Int :=
  eval c x + t * eval (deriv (deriv c)) x

/--
**The heat step fixes affine polynomials.**  For a polynomial of degree ≤ 1
(`length ≤ 2`), `D²c = 0`, so `(1 + t·D²)c = c` as functions.  (Honest degenerate
case of "the heat flow preserves the polynomial's leading behaviour".)
-/
theorem heatStep_eq_eval_of_affine {c : List Int} (h : c.length ≤ 2) (t x : Int) :
    heatStep t c x = eval c x := by
  unfold heatStep
  rw [d2_eq_nil_of_length_le_two h, eval_nil, Int.mul_zero, Int.add_zero]

/--
**Heat step preserves real-rootedness of affine polynomials.**  If the affine
polynomial `c` (degree ≤ 1) is real-rooted with root list `L`, then so is its image
`(1 + t·D²)c` under the single heat step — trivially, because the heat step fixes it.

This is the `sorry`-free finite-dimensional shadow of `heat_preserves_LP` in the
degenerate (affine) degree.  The general-degree version is Rolle / Hermite–Poulain
and needs mathlib's real analysis (see the section note above).
-/
theorem heatStep_preserves_realRooted_of_affine {c : List Int} {L : List Int}
    (hc : c.length ≤ 2) (t : Int) (hrr : IsRealRootedWith (eval c) L) :
    IsRealRootedWith (heatStep t c) L := by
  intro x
  rw [heatStep_eq_eval_of_affine hc t x]
  exact hrr x

end DeBruijnNewman.RealRooted
