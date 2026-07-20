# External review packet — a Lean 4 formalization of the polynomial de Bruijn / Pólya–Schur theorem

## What this is (in one sentence)
A self-contained, `sorry`-free Lean 4 + mathlib formalization proving that the heat operator
`e^{−t·D²}` (`D = d/dx`) preserves real-rootedness of real polynomials for `t ≥ 0` — the polynomial
case of **de Bruijn's 1950 theorem** and of the **Pólya–Schur (1914)** theory of the multiplier
`e^{−t x²}` — together with its supporting classical lemmas (Rolle interlacing, the Hermite–Poulain
shift, and a real-variable Hurwitz theorem).

## What it is NOT
It is **not** the Riemann Hypothesis, and **not** `Λ ≥ 0` (the Rodgers–Tao lower bound on the
de Bruijn–Newman constant). It is a classical real-analysis / polynomial result that fills a gap in
mathlib. No claim beyond the exact statements below is made. (For context: this file was extracted
from a larger private research project on the de Bruijn–Newman constant; that project reached an
adversarially-verified *no-go* conclusion — it does not prove RH — and this formalization is its one
clean, independently-valuable by-product.)

## The headline result (exact Lean statement)
```lean
/-- For `t ≥ 0`, the heat operator `e^{-t D²}` preserves real-rootedness. -/
theorem Polynomial.heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]}
    (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (heatOp t p)
```
where `HasOnlyRealRoots p := Multiset.card p.roots = p.natDegree` (p splits over `ℝ`, multiplicities
counted) and `heatOp t p := ∑ₖ ((−t)ᵏ/k!) • D^{2k} p` (a finite sum: `D^{2k}p = 0` once `2k > deg p`).

## The five lemma families (30 declarations, all `sorry`-free)
1. **Rolle interlacing** — `derivative_hasRoot_between`.
2. **Differentiation preserves real-rootedness** — `hasOnlyRealRoots_derivative`,
   `hasOnlyRealRoots_iterate_derivative` (general degree, with multiplicity).
3. **Hermite–Poulain shift** `p ↦ p′ + c·p` — `hermitePoulain_shift` (incl. the "root at infinity"
   via EVT/Fermat on `e^{cx}·p`).
4. **Finite heat factor + operator** — `oneMinusCD2_realRooted` (`1−cD² = (1+√c D)(1−√c D)`), the
   `heatOp` algebra, and the coefficient limit `(1−(t/n)D²)ⁿ → e^{−tD²}`.
5. **Real-variable Hurwitz** — `hasOnlyRealRoots_of_tendsto_coeff`: real-rootedness is closed under
   coefficient-wise limits in a fixed-degree, fixed-leading-coefficient family, proved by
   **root-vector compactness (Bolzano–Weierstrass + Vieta), with no complex analysis**.

## The two ideas worth a reviewer's attention
- The **root at infinity** in the Hermite–Poulain shift: plain Rolle interlacing gives only `n−1` of
  the `n` needed roots; the `n`-th comes from an extremum of `e^{cx}·p` on an unbounded interval
  (its decay at `∓∞`), located by the extreme-value theorem + Fermat.
- **Hurwitz without complex analysis**: rather than root-continuity via the argument principle
  (absent from mathlib), we use that the root-vector is bounded (Cauchy bound) and extract a
  convergent subsequence, then match coefficients by Vieta continuity.

## How to verify it yourself (independently — please do)
This packet is self-contained. With `elan` installed:
```
# in this directory
lake exe cache get          # downloads the mathlib v4.22.0 oleans (multi-GB, one-time)
lake build                  # compiles RealRootedPreservation.lean; must exit 0

# axiom audit — confirm no `sorry` and only the standard classical axioms:
echo 'import RealRootedPreservation
#print axioms Polynomial.heat_preserves_LP' | lake env lean /dev/stdin
# expected: 'Polynomial.heat_preserves_LP' depends on axioms:
#           [propext, Classical.choice, Quot.sound]      -- NO sorryAx
```
Toolchain is pinned in `lean-toolchain` (`leanprover/lean4:v4.22.0`) and `lakefile.toml`
(mathlib `git#v4.22.0`). All 30 declarations report `[propext, Classical.choice, Quot.sound]`;
`#lint` (mathlib's linter) passes clean.

## Open questions for the reviewer / before any mathlib PR
1. **API choice**: use the ad-hoc `HasOnlyRealRoots p := card p.roots = p.natDegree`, or express
   everything through mathlib's existing `p.Splits (RingHom.id ℝ)` API (`splits_iff_card_roots`)?
2. **Naming/placement**: `heatOp` / `oneMinusCD2` (`CD2` abbreviation) need mathlib-conforming names;
   suggested homes are in `SUBMISSION.md` / `CONTRIBUTION.md` (shipped alongside).
3. **Correctness**: independent confirmation of the two non-obvious steps above.

## Provenance / honesty disclosure
This formalization was produced by AI agents (Claude) under human direction, then compiled and
axiom-audited by the Lean kernel. **The proof of correctness is the kernel, not the author** — the
`#print axioms` output above is the guarantee; please re-run it. Contents:
`RealRootedPreservation.lean` (source), `POLYNOMIAL_DE_BRUIJN.md` (paper-grade writeup with proof
architecture + citations: Pólya–Schur 1914, de Bruijn 1950, Obreschkoff, Rahman–Schmeisser Ch. 5),
`lean-toolchain`, `lakefile.toml`.
