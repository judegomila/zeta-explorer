# A machine-checked proof of the polynomial de Bruijn / Pólya–Schur theorem

**Result.** In Lean 4 (+ mathlib), fully `sorry`-free and axiom-clean: the heat operator
`e^{−t·D²}` (`D = d/dx`) maps every real-rooted real polynomial to a real-rooted real
polynomial, for all `t ≥ 0`. This is the polynomial case of de Bruijn's 1950 theorem and of the
Pólya–Schur (1914) theory of multiplier sequences.

```
theorem heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (heatOp t p)
```
where `HasOnlyRealRoots p := Multiset.card p.roots = p.natDegree` (p splits over ℝ, with
multiplicity) and `heatOp t p = Σₖ ((−t)ᵏ/k!)·D^{2k} p` (a finite sum: `D^{2k}p = 0` once `2k > deg p`).

> **Honest scope.** This is the **polynomial** theorem for the concrete operator `heatOp`. It is
> **not** the Riemann Hypothesis and **not** `Λ ≥ 0`. The RH-relevant statement requires lifting to
> *entire* functions — the Laguerre–Pólya class on `ℂ→ℂ`, the actual Riemann `Ξ`, its Gaussian
> convolution flow `H_t = Ξ ∗ G_t`, and Rodgers–Tao `Λ ≥ 0` — none of which is claimed here. What is
> claimed is exactly the machine-checked statement above: a real classical theorem that mathlib did
> not previously contain.

---

## Toolchain, location, verification

- **Project:** `formalization/lean-mathlib-probe/` — Lean toolchain **v4.22.0** + mathlib.
  (A separate core-only `formalization/lean/` on v4.9.0 holds the order-theoretic scaffolding; see
  `formalization/README.md`. The v4.9.0 mathlib cache binary aborts on macOS 26.x — a linker, not a
  signature issue — so v4.22.0 is used for all analytic work.)
- **File:** `MathlibBridge.lean`.
- **Verify (independent axiom audit):**
  ```
  cd formalization/lean-mathlib-probe && lake build
  echo 'import MathlibBridge
  #print axioms MathlibBridge.heat_preserves_LP' | lake env lean /dev/stdin
  ```
  Output: `'MathlibBridge.heat_preserves_LP' depends on axioms: [propext, Classical.choice, Quot.sound]`
  — the three standard classical axioms, **no `sorryAx`**. A clean `#print axioms` transitively
  certifies the entire dependency chain below is `sorry`-free.

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

## Distance to the Riemann-relevant statement (honest)

Formalized here: the **polynomial** multiplier theorem, sorry-free.

Not here, and each a substantial standalone development (mathlib lacks them):
1. **Laguerre–Pólya class on entire functions** `ℂ→ℂ` (as locally-uniform limits of real-rooted
   real polynomials, or via Hadamard genus ≤ 1). The polynomial theorem is the finite section.
2. **Lifting** `heat_preserves_LP` from polynomials to LP entire functions (preservation under
   locally-uniform limits — needs holomorphic Hurwitz / normal families).
3. **The actual Riemann `Ξ`** and its heat flow `H_t = e^{−tD²}Ξ` — NOTE: not the forward
   convolution `Ξ ∗ G_t`, which realises `e^{+tD²}` and destroys real-rootedness (wrong sign; see
   ENTIRE_ROADMAP §3 and imp-34813). Use de Bruijn's order-≤2 power-series representation
   `Σₖ ((−t)ᵏ/k!)·Ξ^{(2k)}(z)`, connecting `heatOp` to the real de Bruijn–Newman flow
   (the `axiom H` stand-in in the DBN order-lemmas is a placeholder for this).
4. **Rodgers–Tao `Λ ≥ 0`** (2020) — currently an explicit hypothesis (`hRT`), not internalized.

The order-theoretic layer (`dbn_unique`, `monotone_of_dbn`, `RH_iff_lambda_nonpos`,
`RH_iff_lambda_eq_zero`) is proved against the *real* zero predicate `∀ z, H t z = 0 → z.im = 0`,
axiom-clean modulo the declared `H` stand-in and the `hRT` hypothesis.

---

## Citations
- G. Pólya, J. Schur, *Über zwei Arten von Faktorenfolgen in der Theorie der algebraischen
  Gleichungen*, J. Reine Angew. Math. 144 (1914).
- N. G. de Bruijn, *The roots of trigonometric integrals*, Duke Math. J. 17 (1950).
- N. Obreschkoff, *Verteilung und Berechnung der Nullstellen reeller Polynome* (1963).
- Q. I. Rahman, G. Schmeisser, *Analytic Theory of Polynomials* (2002), Ch. 5.
- (Lift, future) B. Ya. Levin, *Distribution of Zeros of Entire Functions*.

*No claim of proving RH or `Λ ≥ 0` is made. Platt–Trudgian `Λ ≤ 0.2` remains the rigorous SOTA.*
