# Backward Heat Preserves Real-Rooted Polynomials: A Lean 4 Formalization

**Result.** In Lean 4 (+ mathlib), fully `sorry`-free and axiom-clean: for every `t ≥ 0`, the finite
differential operator
```
heatOp t p = e^{-t D²} p = Σₖ ((−t)ᵏ / k!) · D^{2k} p          (D = d/dx)
```
maps every real-rooted real polynomial to a real-rooted real polynomial.

```lean
theorem Polynomial.heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (heatOp t p)
```
where `HasOnlyRealRoots p := Multiset.card p.roots = p.natDegree` (p splits over ℝ, with
multiplicity) and `heatOp t p` is the finite sum above (`D^{2k}p = 0` once `2k > deg p`).

## What this is — and the sign that matters

Here `e^{−t z²}` is the **constant-coefficient differential-operator symbol**, i.e. `heatOp t = φ(D)`
with `φ(z) = e^{−t z²}` on polynomials. Under the Fourier transform `D ↦ iξ`, the operator's
**Fourier multiplier is `φ(iξ) = e^{+t ξ²}`** — it amplifies high frequencies. So `e^{−tD²}` is the
**backward-heat** operator, *not* Gaussian smoothing. (Concretely: `heatOp t (X²) = X² − 2t`, whose
roots `±√(2t)` are real for `t ≥ 0`.) The **forward** heat operator `e^{+tD²}`, whose Fourier
multiplier is `e^{−tξ²}` (ordinary Gaussian convolution), does **not** in general preserve
real-rootedness — e.g. `e^{+tD²}(X²) = X² + 2t` has imaginary roots.

This result belongs to **Hermite–Poulain / Laguerre–Pólya hyperbolicity-preserver theory**: the entire
symbol `φ(z) = e^{−t z²}` lies in the Laguerre–Pólya class (`a = t ≥ 0`), so the differential operator
`φ(D)` preserves real-rootedness. The proof runs through the Hermite–Poulain transformation
`p ↦ p′ + c·p`, the factorization of `1 − c·D²`, finite Euler approximations, and closure of
fixed-degree real-rooted polynomials under coefficient limits.

> **This is *not* the classical Pólya–Schur multiplier-*sequence* theorem.** A Pólya–Schur multiplier
> sequence is a **diagonal** operator `T_γ(xⁿ) = γₙ xⁿ`; that is a different construction. Indeed the
> diagonal sequence whose exponential generating function is `e^{−tz²}` does *not* preserve
> real-rootedness (it sends `(x−1)(x−2)(x−3)(x+1)` to `12t²x⁴ − 10t x² − 6`, which has a nonreal
> conjugate pair). The operator formalized here is `φ(D)`, not `T_γ`.

> **Honest scope.** This is a **polynomial** hyperbolicity-preservation theorem and a
> finite-dimensional analogue of the zero-preservation mechanism in de Bruijn's work. It is **not** the
> Riemann Hypothesis, **not** `Λ ≥ 0`, and makes **no** claim about the sign of the de Bruijn–Newman
> constant. Platt–Trudgian `Λ ≤ 0.2` remains the rigorous state of the art.

---

## Toolchain, file, verification

- **Toolchain:** Lean **v4.22.0** + mathlib (pinned in `lean-toolchain` and `lakefile.toml`; exact
  dependency commits in `lake-manifest.json`).
- **File:** `RealRootedPreservation.lean` (self-contained, 6 imports).
- **License:** Apache-2.0 (`LICENSE`, included).
- **Verify (independent axiom audit):**
  ```
  lake exe cache get      # one-time mathlib oleans
  lake build              # compiles RealRootedPreservation.lean, exit 0
  echo 'import RealRootedPreservation
  #print axioms Polynomial.heat_preserves_LP' | lake env lean /dev/stdin
  ```
  Output: `'Polynomial.heat_preserves_LP' depends on axioms: [propext, Classical.choice, Quot.sound]`
  — the three standard classical axioms, **no `sorryAx`**. A clean `#print axioms` transitively
  certifies the entire dependency chain below is `sorry`-free. (All 30 declarations report the same
  three axioms.)

### A note on identifier names
The Lean identifiers use `heatOp` / `heat_preserves_LP` for the operator `e^{−tD²}`. For a mathlib
submission these would be renamed to reflect the backward-heat classification above — the intended
API is `backwardHeatOp` / `backwardHeatOp_preserves_realRooted` (and `backwardHeatEulerStep` for the
`1 − c·D²` factor) — and the public statement would be phrased through mathlib's `p.Splits (RingHom.id ℝ)`,
keeping `HasOnlyRealRoots` only as an internal cardinality lemma. The names below match the current
source so the audit commands reproduce verbatim.

---

## Proof architecture (the dependency chain)

Two genuinely hard ideas carry the proof; everything else is bookkeeping.

**1. The Hermite–Poulain shift** — `p ↦ p′ + c·p` preserves real-rootedness.
- `derivative_hasRoot_between` — Rolle interlacing for `p` (via mathlib MVT).
- `exists_shifted_root_between` — the shifted version, run on the *transcendental* auxiliary
  `g(x) = e^{cx}·p(x)` whose derivative is `e^{cx}·(p′+c·p)`; since `e^{cx} > 0`, zeros of `g′`
  give real roots of `p′+c·p`. (Polynomial Rolle lemmas don't apply — the `e^{cx}` factor is why.)
- `exists_shifted_root_atBot` / `atTop` — the **root at infinity**: for `c>0`, `g→0` at `−∞`
  (exp beats poly) while `g` vanishes at the least root of `p`, forcing an interior extremum below
  all roots (EVT `IsCompact.exists_isMinOn/MaxOn` + Fermat `IsLocalExtr.hasDerivAt_eq_zero`). This
  supplies the `n`-th root that plain interlacing (capped at `n−1`) cannot.
- `hermitePoulain_card_lower`, `hermitePoulain_shift` — assemble the root count; `deg(p′+c·p)=deg p`.
  (A caught subtlety: the count is **false** without the real-rootedness hypothesis, e.g. `X²+2`.)

**2. Real-rootedness is closed under coefficient limits** — *Hurwitz without complex analysis*.
- `hasOnlyRealRoots_of_tendsto_coeff`: if real-rooted `pₙ` of constant degree `d` with fixed
  nonzero leading coefficient converge coefficient-wise to `p`, then `p` is real-rooted. Route:
  each `pₙ = a·∏(X−rₙ,ᵢ)` with `rₙ,ᵢ ∈ ℝ`; the roots are uniformly bounded (`cauchyBound`, and
  convergent ⇒ bounded coefficients); Bolzano–Weierstrass (`tendsto_subseq_of_bounded`) extracts a
  convergent root-subvector `→ sᵢ ∈ ℝ`; Vieta continuity (`continuous_prod_X_sub_C_coeff`) +
  `tendsto_nhds_unique` identify `p = a·∏(X−sᵢ)`, all real.

**Combining them (the finish).**
- `oneMinusCD2_realRooted` — `(1−c·D²)` preserves real-rootedness via
  `1−cD² = (1+√c·D)(1−√c·D)`, i.e. a composition of two shifts (+ a scalar rescale).
- `oneMinusCD2_iterate_realRooted` — hence `(1−c·D²)ⁿ` does, by induction; degree constant.
- `oneMinusCD2_iterate_tendsto_heatOp` — `(1−(t/n)D²)ⁿ p → heatOp t p` coefficient-wise, via the
  operator binomial (`Commute.add_pow` in `Module.End`) and the `Nat.choose` asymptotic
  `C(n,j)(−t/n)ʲ → (−t)ʲ/j!` proved from first principles (`choose_mul_pow_tendsto`).
- **`heat_preserves_LP`** — the approximants `qₙ = (1−(t/n)D²)ⁿ p` are real-rooted (idea 1 chain)
  of constant degree, and converge to `heatOp t p` (limit); by idea 2, the limit is real-rooted. ∎

---

## Relation to the de Bruijn–Newman flow, and the honest distance to RH

The de Bruijn–Newman family is defined by
```
H_t(x) = ∫₀^∞ e^{t u²} Φ(u) cos(x u) du,
```
from which `∂_t H_t = −∂_x² H_t`, i.e. `H_t = e^{−(t−s) D²} H_s`. **Increasing the de Bruijn–Newman
parameter is backward heat** — it is *not* ordinary positive-time Gaussian convolution of `Ξ`. The
polynomial theorem here models the **upward-closure** implication
```
H_s real-rooted  ⟹  H_t real-rooted   (t ≥ s),
```
but it does **not** establish that any particular Riemann time slice is real-rooted (that is RH).

**Extending the polynomial operator to entire functions requires explicit growth and domain
conditions.** Local uniform convergence and Hurwitz's theorem alone are *insufficient*, because
`e^{−tD²}` is an infinite-order operator. Warning example:
```
f(z) = e^{−a z²} ∈ LP,   (e^{−tD²} f)(0) = Σ_{k≥0} C(2k,k) (a t)^k,
```
which **diverges for `t ≥ 1/(4a)`**. So the unrestricted statement "`e^{−tD²}` preserves every LP
entire function for all `t ≥ 0`" is *false*. A Riemann development must specialize directly to the
super-exponentially decaying kernel `Φ`, where `H_t` is well-defined, and carry the growth/order-and-type
control explicitly. Not present here, each a substantial standalone development mathlib lacks:
1. the Laguerre–Pólya class on entire functions `ℂ→ℂ` (Hadamard genus ≤ 1);
2. the lift of `heat_preserves_LP` to that class **on the correct growth space** (not via naive limits);
3. the actual Riemann `Ξ` and its flow `H_t`;
4. the Rodgers–Tao lower bound `Λ ≥ 0` (2020).

As partial progress toward (1)–(2) we have separately formalized (`sorry`-free) the `n`-th-order Cauchy
derivative/coefficient estimates `‖f⁽ⁿ⁾(c)‖ ≤ n!·C/Rⁿ`, `‖aₙ‖ ≤ M_f(R)/Rⁿ` — but the entire lift is
realistically a matter of months and does not by itself approach RH.

---

## Citations
- N. G. de Bruijn, *The roots of trigonometric integrals*, Duke Math. J. 17 (1950).
- E. Laguerre; and the Hermite–Poulain theorem — see Rahman–Schmeisser Ch. 5 below.
- N. Obreschkoff, *Verteilung und Berechnung der Nullstellen reeller Polynome* (1963).
- Q. I. Rahman, G. Schmeisser, *Analytic Theory of Polynomials* (2002), Ch. 5 (Hermite–Poulain,
  Laguerre–Pólya class).
- B. Rodgers, T. Tao, *The de Bruijn–Newman constant is non-negative*, Forum Math. Pi 8 (2020).
- G. Pólya, J. Schur (1914) — for historical context on the *multiplier-sequence* program, a
  **distinct** (diagonal) construction; not the theorem proved here.
- (Lift, future) B. Ya. Levin, *Distribution of Zeros of Entire Functions*.

*No claim of proving RH or `Λ ≥ 0` is made. Platt–Trudgian `Λ ≤ 0.2` remains the rigorous SOTA.*
