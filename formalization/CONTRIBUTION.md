# Mathlib contribution: preservation of real-rootedness (Hermite–Poulain / heat operator)

This document accompanies `formalization/mathlib-pr/RealRootedPreservation.lean`, a
self-contained, `sorry`-free Lean 4 + Mathlib file extracting the **general-purpose,
mathlib-worthy** results from the project file `MathlibBridge.lean`. It is prepared for
submission to [mathlib4](https://github.com/leanprover-community/mathlib4). **No PR has been
opened** — that requires the user's GitHub account and mathlib maintainer review.

> **For the turn-key submission process** (ready-to-post Zulip draft, PR breakdown,
> PR description template, and the pre-submit checklist) see the companion file
> `formalization/SUBMISSION.md`. This document covers the *mathematics*; that one
> covers the *process*.

## Honest scope

These are **classical** results. Nothing here is new mathematics and nothing here concerns
the Riemann Hypothesis. The differentiation step is Rolle's theorem; the shift/heat results
are the **Hermite–Poulain theorem** and the polynomial case of the **Pólya–Schur** (1914) /
**de Bruijn** (1950) theory of the Laguerre–Pólya class. The value of the contribution is
purely that **mathlib currently lacks these lemmas**: it has `Polynomial.card_roots_le_derivative`
(Rolle root-count interlacing) and `Polynomial.Splits`, but no statement that the derivative,
the Hermite–Poulain shift `p ↦ p' + c·p`, the factor `1 − c·D²`, or the heat operator
`e^{−t·D²}` preserve real-rootedness, and no polynomial Hurwitz lemma (real-rootedness closed
under coefficient limits). This fills that gap.

The whole file compiles against mathlib at Lean `v4.22.0` and every listed lemma is
`#print axioms`-clean (only `propext`, `Classical.choice`, `Quot.sound`; no `sorryAx`).

## The real-rootedness predicate

```lean
def Polynomial.HasOnlyRealRoots (p : ℝ[X]) : Prop := Multiset.card p.roots = p.natDegree
```

Over a field `K`, `Multiset.card p.roots = p.natDegree` is **already** equivalent to
`p.Splits (RingHom.id K)` via the existing `Polynomial.splits_iff_card_roots`. During review,
maintainers may prefer to **drop the bespoke predicate** and phrase every statement below in
terms of `p.Splits (RingHom.id ℝ)` (adding, where convenient, a `HasOnlyRealRoots`
abbreviation or a `Real`-specific spelling). The proofs are unaffected: they only use the
`card = natDegree` characterization. This is the single most likely API request, so it is
flagged up front.

## Mathlib-worthy lemmas, statements, and suggested locations

Names below are as they appear in the file, namespaced under `Polynomial`. Suggested mathlib
files are grouped by theme; a reviewer may prefer one new file
(`Mathlib/Analysis/SpecialFunctions/Polynomials/RealRooted.lean` or
`Mathlib/RingTheory/Polynomial/HermitePoulain.lean`) for the whole bundle.

### Group 1 — Rolle interlacing with an explicit interior root

Suggested location: `Mathlib/Analysis/Calculus/LocalExtr/Polynomial.lean`
(next to the existing `Polynomial.card_roots_le_derivative`).

```lean
theorem Polynomial.derivative_hasRoot_between {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.eval a = 0) (hb : p.eval b = 0) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).eval c = 0

theorem Polynomial.exists_derivative_root_of_two_roots {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.IsRoot a) (hb : p.IsRoot b) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).IsRoot c
```

Why: mathlib has the *counting* interlacing lemma but not the *existential* "there is a
derivative root strictly between two roots", which is a natural, reusable Rolle corollary.

### Group 2 — differentiation preserves real-rootedness

Suggested location: same file as Group 1, or a new `RealRooted.lean`.

```lean
theorem Polynomial.hasOnlyRealRoots_derivative {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (Polynomial.derivative p)

theorem Polynomial.hasOnlyRealRoots_iterate_derivative {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) (n : ℕ) : HasOnlyRealRoots (Polynomial.derivative^[n] p)
```

Why: the headline "derivative of a real-rooted polynomial is real-rooted". Three-line proof
from existing mathlib primitives (`card_roots'`, `card_roots_le_derivative`,
`natDegree_derivative_le`), but a fact users will look for by name.

### Group 3 — the Hermite–Poulain shift `p ↦ p' + c·p`

Suggested location: new file `Mathlib/RingTheory/Polynomial/HermitePoulain.lean`
(or `Mathlib/Analysis/SpecialFunctions/Polynomials/HermitePoulain.lean`, since the proofs use
real analysis — `exp`, Rolle, EVT).

```lean
theorem Polynomial.exists_shifted_root_between (c : ℝ) {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.eval a = 0) (hb : p.eval b = 0) :
    ∃ z, a < z ∧ z < b ∧ (Polynomial.derivative p + c • p).eval z = 0

theorem Polynomial.exists_shifted_root_atBot {c : ℝ} (hc : 0 < c) {p : ℝ[X]} {a : ℝ}
    (ha : p.eval a = 0) (hmin : ∀ x : ℝ, x < a → p.eval x ≠ 0) :
    ∃ z, z < a ∧ (Polynomial.derivative p + c • p).eval z = 0

theorem Polynomial.exists_shifted_root_atTop {c : ℝ} (hc : c < 0) {p : ℝ[X]} {a : ℝ}
    (ha : p.eval a = 0) (hmax : ∀ x : ℝ, a < x → p.eval x ≠ 0) :
    ∃ z, a < z ∧ (Polynomial.derivative p + c • p).eval z = 0

theorem Polynomial.hermitePoulain_card_lower {c : ℝ} (hc : c ≠ 0) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) (hp0 : p ≠ 0) :
    p.natDegree ≤ Multiset.card (Polynomial.derivative p + c • p).roots

theorem Polynomial.hermitePoulain_shift (c : ℝ) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (Polynomial.derivative p + c • p)
```

Why: `hermitePoulain_shift` is the atomic Hermite–Poulain operation and the workhorse of the
whole Laguerre–Pólya theory. The three `exists_shifted_root_*` lemmas (analytic Rolle / EVT on
`g x = e^{c x}·p x`, using exponential-beats-polynomial decay for the root "at infinity") are
independently reusable and are the genuinely non-trivial analytic content.

### Group 4 — the finite heat factor `1 − c·D²` and the heat operator

Suggested location: continue the HermitePoulain file, or a new
`Mathlib/Analysis/SpecialFunctions/Polynomials/HeatOperator.lean`.

```lean
theorem Polynomial.hasOnlyRealRoots_smul {a : ℝ} (ha : a ≠ 0) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (a • p)

def Polynomial.oneMinusCD2 (c : ℝ) (p : ℝ[X]) : ℝ[X] :=
  p - c • Polynomial.derivative (Polynomial.derivative p)

theorem Polynomial.oneMinusCD2_realRooted {c : ℝ} (hc : 0 < c) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (oneMinusCD2 c p)
-- + oneMinusCD2_iterate_realRooted, oneMinusCD2_natDegree, oneMinusCD2_iterate_natDegree,
--   oneMinusCD2_leadingCoeff, oneMinusCD2_iterate_leadingCoeff

def Polynomial.heatOp (t : ℝ) (p : ℝ[X]) : ℝ[X] := heatPartial (p.natDegree + 1) t p
  -- heatPartial N t p = ∑ k ∈ range N, ((-t)^k / k!) • D^[2k] p

-- heatOp_zero, heatOp_add, heatOp_smul, heatOp_natDegree
-- coefficient bridge: oneMinusCD2_iterate_eq_sum, choose_mul_pow_tendsto,
--                     oneMinusCD2_iterate_tendsto_heatOp

theorem Polynomial.heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (heatOp t p)
```

Why: `heat_preserves_LP` is the polynomial de Bruijn / Pólya–Schur multiplier theorem
(`e^{−t·D²}` preserves the Laguerre–Pólya class for `t ≥ 0`). The `oneMinusCD2 …` and
`heatOp …` names are internal-ish and reviewers may rename (e.g. `heatOp` → `Polynomial.expNegDeriv2`
or similar); the `heatPartial`/`oneMinusCD2` helpers may be marked `private` or folded in.

### Group 5 — polynomial Hurwitz (real-rootedness closed under coefficient limits)

Suggested location: `Mathlib/Topology/Algebra/Polynomial.lean`, or a new
`Mathlib/Analysis/Polynomial/Hurwitz.lean`.

```lean
theorem Polynomial.continuous_prod_X_sub_C_coeff {d : ℕ} (s : Finset (Fin d)) (k : ℕ) :
    Continuous (fun w : Fin d → ℝ => (∏ i ∈ s, (X - C (w i))).coeff k)

theorem Polynomial.hasOnlyRealRoots_of_tendsto_coeff {d : ℕ} {a : ℝ} (ha : a ≠ 0)
    {P : ℕ → ℝ[X]} {p : ℝ[X]}
    (hPdeg : ∀ n, (P n).natDegree = d) (hPlead : ∀ n, (P n).leadingCoeff = a)
    (hPrr : ∀ n, HasOnlyRealRoots (P n)) (hpdeg : p.natDegree = d)
    (hlim : ∀ m, Tendsto (fun n => (P n).coeff m) atTop (𝓝 (p.coeff m))) :
    HasOnlyRealRoots p
```

Why: a real-variable, root-vector-compactness version of Hurwitz's theorem (no complex
analysis): each `P n = C a · ∏ (X − rₙᵢ)` with real roots uniformly bounded by Cauchy's bound
(`Polynomial.IsRoot.norm_lt_cauchyBound`); Bolzano–Weierstrass (`tendsto_subseq_of_bounded`)
extracts a convergent subsequence of root vectors and continuity of Vieta closes it. Very
reusable; `continuous_prod_X_sub_C_coeff` is a useful standalone lemma.

## What was deliberately left out (project-specific, not mathlib-worthy)

From `MathlibBridge.lean`, the following were **excluded** because they are project scaffolding,
not general results:

- `axiom H : ℝ → ℂ → ℂ` — an axiom-level stand-in for the Riemann `Ξ ∗ Gaussian` flow.
- `HasOnlyRealZeros`, `IsDBNConstant`, `RiemannHypothesis`, `dbn_unique`, `monotone_of_dbn`,
  `RH_iff_lambda_nonpos`, `RH_iff_lambda_eq_zero` — de Bruijn–Newman order-lemmas stated
  against the `axiom H` stand-in. These are about the RH/DBN framework, not general polynomials.
- `heatKernel_pos` — a one-line `positivity` fact about the Gaussian kernel, unrelated to the
  polynomial real-rootedness chain.

## Style / API checklist before opening the PR

- [ ] Decide `HasOnlyRealRoots` vs. `Splits (RingHom.id ℝ)` (see above) with a maintainer.
- [x] Trim imports to the minimum. **Done**: the import list was minimized from 18 to 6 by
      greedy one-by-one removal with re-verification (`lake env lean`); the file still compiles
      and all 30 declarations remain `#print axioms`-clean. Final set:
      `Analysis.Calculus.LocalExtr.Polynomial`, `Analysis.SpecialFunctions.ExpDeriv`,
      `Analysis.SpecialFunctions.PolynomialExp`, `Analysis.Polynomial.CauchyBound`,
      `Topology.MetricSpace.Sequences`, `Data.Nat.Factorial.BigOperators`. When the code lands in
      real mathlib files, re-run `lake exe shake` since the surrounding imports differ.
- [ ] Add copyright header with the real author(s) and confirm Apache-2.0 (already stubbed).
- [ ] Confirm module docstring format (`/-! # … -/`), `## Main definitions`, `## References`,
      `## Tags` — already present.
- [ ] Ensure every declaration has a docstring (already present) and passes the mathlib
      doc-string / naming linters (`#lint`).
- [ ] Remove the `#print axioms …` audit block (dev-only) before submitting, or keep it in a
      separate test file.
- [ ] Consider generalizing `hasOnlyRealRoots_derivative` beyond `ℝ` where the proof allows
      (`natDegree_derivative_le` is unconditional; the interlacing input is real-analytic, so
      the shift/heat results stay over `ℝ`).
- [ ] Split into ≤ ~500-line PRs: (A) Groups 1–2, (B) Group 3, (C) Groups 4, (D) Group 5.
      Mathlib prefers small, single-theme PRs.

## Concrete submission steps

1. **Zulip announcement.** Post in
   [`#mathlib4 > new members` / `#Is-there-code-for-X?`](https://leanprover.zulipchat.com/)
   describing the intended contribution ("real-rootedness / Laguerre–Pólya preservation:
   derivative, Hermite–Poulain shift, heat operator, polynomial Hurwitz"), link this file, and
   ask whether the community prefers `Splits`-phrasing and where the files should live. This
   avoids duplicated effort and gets naming buy-in *before* the PR.
2. **Fork & branch.** Fork `leanprover-community/mathlib4`, branch per sub-PR
   (e.g. `real-rooted-derivative`, `hermite-poulain-shift`, `heat-operator-LP`,
   `polynomial-hurwitz`).
3. **Place the code** in the agreed files, adjust namespaces/imports, run
   `lake exe cache get && lake build` and `lake exe mk_all`, then `./scripts/lint-style.sh`
   and `#lint` on the new files.
4. **Open the PR(s)** with the `t-analysis` / `t-algebra` labels as appropriate, a short
   description citing Pólya–Schur (1914), de Bruijn (1950), Obreschkoff (1963),
   Rahman–Schmeisser (2002), and request review (`awaiting-review`). Keep each PR
   single-theme and small.
5. **Address review** (likely: `Splits` API, generalization, import trimming, lemma naming),
   iterate until a maintainer marks `ready-to-merge`.
