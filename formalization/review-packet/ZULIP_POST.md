# Zulip post — ready to submit

**Where:** [leanprover.zulipchat.com](https://leanprover.zulipchat.com/) → stream **`#mathlib4`**,
start a **new topic** named `real-rootedness preservation (Hermite–Poulain / heat operator)`.
(Alternatively `#Is there code for X?` if you only want the existence check first.)

**Code link (done):** unlisted gist with the source + REVIEW + writeup + build files:
**https://gist.github.com/judegomila/7fcce4803c58844a166d04123b0f2aae** (already inserted in the
message below). It's unlisted (shareable by link, not indexed); make it public later if you prefer.

---

## Copy-paste message

> **Topic:** real-rootedness preservation (Hermite–Poulain / heat operator)
>
> Hi all — I'd like to check whether a small body of classical *real-rootedness preservation* lemmas
> is wanted in mathlib before I split it into PRs. I have a self-contained, **`sorry`-free** file
> (~1150 lines, builds on mathlib `v4.22.0`) — code: **https://gist.github.com/judegomila/7fcce4803c58844a166d04123b0f2aae**.
>
> **What it proves.** Closure properties of real-rooted real polynomials (the polynomial part of the
> Laguerre–Pólya class) under a family of operators:
> - `D` (differentiation) preserves real-rootedness — a multiplicity-counting Rolle;
> - the **Hermite–Poulain shift** `p ↦ p' + c·p`, for every real `c`;
> - the finite heat factor `1 − c·D²` and the **heat operator** `e^{−t·D²}` (`t ≥ 0`) — the
>   polynomial case of Pólya–Schur 1914 / de Bruijn 1950;
> - **real-rootedness is closed under coefficient-wise limits** (fixed degree + leading coeff) — a
>   real-variable, root-vector-compactness form of Hurwitz (Cauchy bound + Bolzano–Weierstrass +
>   Vieta continuity, **no complex analysis**).
>
> mathlib has the Rolle root-count interlacing (`Polynomial.card_roots_le_derivative`) and `Splits`,
> but none of these preservation statements, no Hermite–Poulain operators, and no polynomial Hurwitz
> lemma — so this looks like a genuine gap. Would it be welcome?
>
> **The API question (the main thing I'd want a ruling on).** I currently use a predicate
> `HasOnlyRealRoots p : Prop := Multiset.card p.roots = p.natDegree`. Over a field this is *already*
> equiv to `p.Splits (RingHom.id ℝ)` (via `splits_iff_card_roots`), so I can instead state everything
> through the existing `Splits` API and drop the bespoke predicate (or keep it as a thin `ℝ`-specific
> abbreviation). Which spelling do you prefer? And target files — I'm thinking
> `Analysis/Calculus/LocalExtr/Polynomial` for the Rolle/derivative results, a new
> `HermitePoulain`/`HeatOperator` file (under `RingTheory/Polynomial` or `Analysis/SpecialFunctions`,
> since the shift proof uses `exp` + EVT), and `Topology/Algebra/Polynomial` for the Hurwitz lemma.
>
> **Cleanliness.** `sorry`-free with only the standard axioms — `#print axioms` on the headline
> `heat_preserves_LP` reports `[propext, Classical.choice, Quot.sound]`; `#lint` passes; imports
> minimal (6). I'll split into ~4 small single-theme PRs once the API/naming is settled.
>
> **Full disclosure:** the proofs were drafted with substantial AI assistance and then checked by the
> Lean kernel (the `#print axioms` output is the guarantee, and I can walk through any proof). Happy
> to adapt naming/structure to whatever you'd prefer.

---

## Have ready for when someone replies
- **Code:** the gist above (or point them at the review packet / a branch).
- **Split plan:** the 4-PR breakdown in `SUBMISSION.md` §(b) (Rolle/derivative → Hermite–Poulain →
  heat operator → polynomial Hurwitz), landable in dependency order.
- **If they say "use `Splits`":** that's a mechanical refactor of `HasOnlyRealRoots` throughout —
  expect it, and it's fine.
- **If they ask about a specific proof:** the two non-obvious steps are the *root-at-infinity* in
  `hermitePoulain_shift` (EVT/Fermat on `e^{cx}·p`) and *Hurwitz via compactness* — both written up in
  `POLYNOMIAL_DE_BRUIJN.md`.
