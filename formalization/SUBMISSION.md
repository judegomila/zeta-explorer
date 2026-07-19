# Turn-key mathlib submission guide

This is the step-by-step guide for submitting
`formalization/mathlib-pr/RealRootedPreservation.lean` to
[mathlib4](https://github.com/leanprover-community/mathlib4). It complements
`CONTRIBUTION.md` (which explains the mathematics and lemma-by-lemma rationale);
this file is the **process** — what to post, how to slice the PRs, and the exact
checklist to run.

The file is self-contained, `sorry`-free and `axiom`-free, compiles against
mathlib at Lean `v4.22.0`, and every one of its 30 declarations is
`#print axioms`-clean (only `propext`, `Classical.choice`, `Quot.sound`).

**Honest scope.** These are *classical* results (Rolle, Hermite–Poulain,
Pólya–Schur 1914 / de Bruijn 1950 for the polynomial case, a real-variable
Hurwitz). Nothing here is new mathematics and **nothing here is about the Riemann
Hypothesis.** The contribution is gap-filling: mathlib has the Rolle root-count
lemma (`Polynomial.card_roots_le_derivative`) and `Polynomial.Splits`, but not the
statements that differentiation, the shift `p ↦ p' + c·p`, the factor `1 − c·D²`,
or the heat operator `e^{−t·D²}` preserve real-rootedness, nor a polynomial
Hurwitz (real-rootedness closed under coefficient limits).

---

## (a) Zulip announcement draft — "Is there code for X?"

Post this in the [Leanprover Zulip](https://leanprover.zulipchat.com/), stream
`#mathlib4` (or `#Is there code for X?`), **before** opening any PR, to get naming
buy-in and avoid duplicated effort. Copy-paste ready:

> **Title:** Real-rootedness preservation: derivative / Hermite–Poulain / heat operator / polynomial Hurwitz
>
> I have a self-contained, `sorry`-free file (~1150 lines, all `#print axioms`-clean
> on mathlib `v4.22.0`) proving the classical closure properties of *real-rooted*
> real polynomials — the polynomial part of the Laguerre–Pólya class — under a
> family of differential operators: differentiation `D` (a multiplicity-counting
> Rolle), the Hermite–Poulain shift `p ↦ p' + c·p`, the finite heat factor
> `1 − c·D²`, and the heat operator `e^{−t·D²}` (the polynomial case of
> Pólya–Schur 1914 / de Bruijn 1950). The passage to the limit uses a real-variable,
> root-vector-compactness form of Hurwitz (Cauchy's root bound + Bolzano–Weierstrass
> + continuity of Vieta — no complex analysis). mathlib currently has the Rolle
> root-count interlacing lemma (`Polynomial.card_roots_le_derivative`) and
> `Polynomial.Splits`, but none of these preservation statements, and no polynomial
> Hurwitz lemma. Would this be a welcome contribution?
>
> One API question up front. I phrase "has only real roots" as a predicate
> `HasOnlyRealRoots p : Prop := Multiset.card p.roots = p.natDegree`. Over a field
> this is *already* equivalent to `p.Splits (RingHom.id ℝ)` via
> `splits_iff_card_roots`, so I could instead state everything in terms of `Splits`
> (dropping the bespoke predicate, or keeping it as a thin `Real`-specific
> abbreviation). Which spelling do maintainers prefer, and where should the files
> live — `Mathlib/Analysis/Calculus/LocalExtr/Polynomial.lean` for the Rolle/derivative
> results, a new `Mathlib/RingTheory/Polynomial/HermitePoulain.lean` (or under
> `Analysis/SpecialFunctions/`, since the proofs use `exp`/EVT) for the shift and
> heat operator, and `Mathlib/Topology/Algebra/Polynomial.lean` for the Hurwitz
> lemma? I'll split into small single-theme PRs.

---

## (b) Recommended PR breakdown

Mathlib strongly prefers small, single-theme PRs (rule of thumb ≲ few hundred
lines each). Split the file along the five families of `CONTRIBUTION.md`. Suggested
order lets each PR depend only on already-merged ones.

| PR | Theme | Declarations | Suggested target file | Label |
|----|-------|--------------|-----------------------|-------|
| **1** | Rolle interlacing + differentiation preserves real-rootedness | `derivative_hasRoot_between`, `exists_derivative_root_of_two_roots`, `HasOnlyRealRoots` (def), `hasOnlyRealRoots_derivative`, `hasOnlyRealRoots_iterate_derivative` | `Mathlib/Analysis/Calculus/LocalExtr/Polynomial.lean` (next to `card_roots_le_derivative`) | `t-analysis` |
| **2** | Hermite–Poulain shift `p ↦ p' + c·p` | `exists_shifted_root_between`, `exists_shifted_root_atBot`, `exists_shifted_root_atTop`, `hermitePoulain_card_lower`, `hermitePoulain_shift`, `hasOnlyRealRoots_smul` | new `Mathlib/RingTheory/Polynomial/HermitePoulain.lean` (or `Mathlib/Analysis/SpecialFunctions/Polynomials/HermitePoulain.lean` — proofs use `exp`, Rolle, EVT) | `t-analysis` / `t-algebra` |
| **3** | Finite heat factor `1 − c·D²` and the heat operator `e^{−t·D²}` | `oneMinusCD2` (def) + its `realRooted`/`natDegree`/`leadingCoeff` lemmas (and iterates), `heatPartial`/`heatOp` (defs), `iterate_derivative_add`, `heatPartial_*`, `heatOp_*`, and the coefficient bridge `oneMinusCD2_iterate_eq_sum`, `choose_mul_pow_tendsto`, `oneMinusCD2_iterate_tendsto_heatOp`, `heat_preserves_LP` | new `Mathlib/Analysis/SpecialFunctions/Polynomials/HeatOperator.lean` (continues the HermitePoulain file) | `t-analysis` |
| **4** | Polynomial Hurwitz (real-rootedness closed under coefficient limits) | `continuous_prod_X_sub_C_coeff`, `hasOnlyRealRoots_of_tendsto_coeff` | `Mathlib/Topology/Algebra/Polynomial.lean` or new `Mathlib/Analysis/Polynomial/Hurwitz.lean` | `t-topology` / `t-analysis` |

Notes on ordering and dependencies:

- PR 1 introduces `HasOnlyRealRoots` (or its agreed `Splits` spelling) — everything
  downstream depends on the naming decision, so land PR 1 first.
- PR 3 depends on PR 2 (`hermitePoulain_shift` is used in `oneMinusCD2_realRooted`)
  and on PR 4 (`heat_preserves_LP` uses `hasOnlyRealRoots_of_tendsto_coeff`). If you
  prefer, submit PR 4 (Hurwitz — a standalone, generally useful lemma) *before* PR 3.
- **`iterate_derivative_add`** is a general, standalone `Polynomial` lemma
  (confirmed absent from mathlib `v4.22.0`) that belongs in
  `Mathlib/Algebra/Polynomial/Derivative.lean` and could be its own trivial PR to
  land first — mathlib already has `iterate_derivative_sum` and
  `iterate_derivative_smul` but not the bare `_add`.
- The trailing `#print axioms …` audit block is **dev-only**; delete it before
  submitting each PR (or move it to a `MathlibTest/` file).

---

## (c) PR description template

```markdown
<!-- PR title, e.g.: feat(Analysis/Calculus): differentiation preserves real-rootedness -->

This PR adds <one-line summary of the theme>.

## What

- `Polynomial.<lemma>` — <one line>
- `Polynomial.<lemma>` — <one line>

## Why

mathlib has `Polynomial.card_roots_le_derivative` (Rolle root-count interlacing)
and `Polynomial.Splits`, but not <the specific gap this PR fills>. These are the
classical closure properties of the real-rooted (Laguerre–Pólya) polynomials.

## Notes / open questions

- `HasOnlyRealRoots p := Multiset.card p.roots = p.natDegree` is defeq-equivalent
  to `p.Splits (RingHom.id ℝ)` via `splits_iff_card_roots`; happy to switch to the
  `Splits` spelling if preferred (see Zulip thread <link>).
- <any renames the reviewer suggested, e.g. heatOp → …>

## References

- G. Pólya, J. Schur, *Über zwei Arten von Faktorenfolgen …*, J. Reine Angew. Math.
  **144** (1914), 89–113.
- N. G. de Bruijn, *The roots of trigonometric integrals*, Duke Math. J. **17**
  (1950), 197–226.
- N. Obreschkoff, *Verteilung und Berechnung der Nullstellen reeller Polynome*,
  VEB, 1963 (Hermite–Poulain).
- Q. I. Rahman, G. Schmeisser, *Analytic Theory of Polynomials*, Oxford, 2002,
  Thm 5.4.4.

---

Open in `awaiting-review`. This is classical gap-filling — no new mathematics,
unrelated to the Riemann Hypothesis.
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## (d) Pre-submit checklist

Run per PR, in a fresh clone/fork of mathlib:

```bash
# 0. Fork leanprover-community/mathlib4 on GitHub, then:
git clone https://github.com/<you>/mathlib4.git && cd mathlib4
git remote add upstream https://github.com/leanprover-community/mathlib4.git
git fetch upstream && git checkout -b real-rooted-derivative upstream/master

# 1. Get the prebuilt mathlib cache (do NOT rebuild from scratch)
lake exe cache get

# 2. Place the declarations into the agreed target file(s) (see table above),
#    adjusting namespaces/imports; register any NEW file with:
lake exe mk_all

# 3. Build only what you touched
lake build Mathlib.Analysis.Calculus.LocalExtr.Polynomial   # (etc. per PR)

# 4. Lint — both the style linter and the declaration linter
lake exe lint-style                    # import order, copyright header, line length
#    and add `#lint` at the end of the new file (or run the `env-linter`),
#    then remove it before committing — checks docstrings, names, simpNF, etc.

# 5. Confirm no sorry / no new axioms
#    (#print axioms <headline lemma> should be [propext, Classical.choice, Quot.sound])
grep -rn "sorry" <touched files>       # must be empty

# 6. Commit and push
git commit -am "feat(...): <summary>"
git push origin real-rooted-derivative
```

Then open the PR against `leanprover-community/mathlib4:master`:

- [ ] Fork made, branch per sub-PR (`real-rooted-derivative`,
      `hermite-poulain-shift`, `heat-operator-LP`, `polynomial-hurwitz`).
- [ ] `lake exe cache get` then `lake build` (touched modules) exits 0.
- [ ] `lake exe lint-style` passes; `#lint` on the new file is clean (docstrings on
      every public decl, no unused variables, names follow conventions).
- [ ] No `sorry`, no new `axiom`; headline lemmas `#print axioms`-clean.
- [ ] `#print axioms` audit block and any dev-only `#lint`/`#check` removed.
- [ ] Copyright header has the real author(s), Apache-2.0.
- [ ] Module docstring present (`/-! # … -/` with `## Main definitions`,
      `## Implementation notes`, `## References`, `## Tags`).
- [ ] PR description cites Pólya–Schur (1914), de Bruijn (1950), Obreschkoff (1963),
      Rahman–Schmeisser (2002); notes the `HasOnlyRealRoots`-vs-`Splits` question.
- [ ] Correct topic label (`t-analysis` / `t-algebra` / `t-topology`), state set to
      `awaiting-review`, linked to the Zulip thread.
- [ ] Keep each PR single-theme and small; land PR 1 (naming decision) first.

---

## Naming / API findings (for reviewers)

Grep of mathlib `v4.22.0` for direct name collisions — **none found** for the new
declarations. Details and the conventions to raise in review:

1. **`HasOnlyRealRoots` (biggest open question).** No name collision, but it is
   *semantically redundant* with existing API: over a field,
   `Multiset.card p.roots = p.natDegree ↔ p.Splits (RingHom.id ℝ)`
   (`Polynomial.splits_iff_card_roots`). Reviewers will very likely ask to state
   everything via `Splits (RingHom.id ℝ)` and drop or thin the predicate. The proofs
   only use the `card = natDegree` characterization, so this is a mechanical change.
   **Flag for maintainers, do not pre-decide.**

2. **`heatOp` / `oneMinusCD2` / `heatPartial` (definitions).** No collision, but the
   names use abbreviations/numerals (`CD2`) that mathlib naming conventions
   discourage. Expect rename requests — e.g. `heatOp` → something like
   `expNegSMulDerivSq` / `Polynomial.heatFlow`, and `oneMinusCD2` folded in or made
   `private`. Leave the final names to the reviewer.

3. **`iterate_derivative_add`.** Confirmed **absent** from mathlib `v4.22.0`
   (`iterate_derivative_sum` and `iterate_derivative_smul` exist; the bare `_add`
   does not). Safe to add; it is a natural standalone lemma for
   `Mathlib/Algebra/Polynomial/Derivative.lean`.

4. **`continuous_prod_X_sub_C_coeff`.** No collision. It sits in the existing
   `prod_X_sub_C_coeff` family (Vieta, `Mathlib/RingTheory/Polynomial/Vieta.lean`
   and `Mathlib/Algebra/Polynomial/BigOperators.lean`), so the name is
   convention-consistent; a reviewer may want it placed alongside that family.

5. **`hermitePoulain_shift` / `hermitePoulain_card_lower`.** No collision. mathlib
   has an unrelated `Polynomial.hermite` (Hermite polynomials,
   `Mathlib/RingTheory/Polynomial/Hermite/Basic.lean`); "Hermite–Poulain" is a
   distinct proper-noun concept, so no conflict, but this suggests the shift/heat
   material could live under `Mathlib/RingTheory/Polynomial/` near the Hermite files.

---

## What you (the user) do, step by step

1. Read `CONTRIBUTION.md` (the math) and section (a) above.
2. Post the Zulip draft (a); wait for the `HasOnlyRealRoots`-vs-`Splits` +
   file-location answer.
3. Fork mathlib, and for the first PR only, copy the PR-1 declarations (table (b))
   into the agreed file, apply the naming decision from step 2, delete the
   `#print axioms` block, add the copyright author.
4. Run the checklist (d); open PR 1 with template (c).
5. After PR 1 merges, repeat for PRs 2→4 in order.

Everything above is prepared; the only judgment calls left are the ones that
*require* a maintainer (the `Splits` API decision, final file paths, any renames).
