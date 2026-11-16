# RH attempt, 1 November 2026: contradiction from a single off-line zero (revised after reading the route-atlas audit, PR #27)

**Outcome: the attempt fails. No proof of RH and no new zero-free region.** The argument in Section 2 is complete
except for one inequality, (★_min) in Step 5. It is a bound on a short von Mangoldt sum at the height γ₀ of the
hypothetical zero, and it can be required in two forms:

* **At one support** it is a pointwise statement about the numbers γ₀ log p mod 2π. The best bound that does not use
  those numbers misses at every support, by a factor of at least 3.03 for δ₀ = 3/8 at γ₀ = 3·10¹². The factor grows
  like (log γ₀)^{1/(2δ₀) − 1} (Table A). Mean values do not reach a single height (MV-CAP).
* **At all large supports** it lies, by the new Lemma L, between two zero-free half-planes valid at every height
  (offsets θ < δ₀ and δ₀). That is the V7 floor of atlas §10. Localising at γ₀ shortens the scale at which the zero
  becomes visible, but does not change the strength of the statement.

None of the available inputs supplies either form. These inputs are the 7/8 half-plane, Xu–Sang/PR 14, zero density
and the certified Weil positivity. RH is open. PT Λ ≤ 0.2 stands. Nothing here changes a Λ bound. NO QED.

**Revision note.** This file replaces the 12:55 draft of the same attempt. The draft is kept byte-identical at
`tmp/rha-contradiction-out/prior-draft-2026-11-01-1255-pre-audit.md` (SHA-256 `b874aa6a…5e11892`). It was written
before the user's audit of all prior attempts had been read: PR #27, snapshots `/tmp/atlas-snap-*.md`, 13:40. None of
the five 1 November attempt files cited the atlas (checked with grep). Changes:

1. **Audit read.** The audit was read in full (§0.2). Every step that overlaps a route the atlas records cites the
   atlas section and states what is different (§0.3).
2. **Step 5 corrected.** The draft required (★), Weil non-negativity in the test direction. That is more than the
   contradiction needs. The needed inequality is (★_min), which has an explicit slack s(a); in the continuous model it
   reads LHS_a < m(a). Table A shows that the Euler-blind gap is smallest at the minimal detecting support, so the
   draft's numbers (3.03 to 2966 at 3·10¹²) are the best case over all supports.
3. **New Lemma L (Landau transport, both directions, §3.3).** It connects the attempt to the one-sided Landau theorem
   and V7 floor (`03-landau.tex`, atlas §10, arithmetic-foundation module). Lemma L² does the same for the
   Möbius-energy form of PR 14.
4. **New levers entered.** PR 14/Xu–Sang (conditional B = 0.87488665) and the V7 floor are entered as inputs/levers,
   with their exponents (Table D).
5. **New measurements and a referee pass.** Three additions:
   * a phase test, actual against random-phase prime sums (§3.5);
   * the Lagarias identification of the large-support mean (Remark 3.3);
   * a same-agent referee pass with independent code (§6). It found and fixed one numerical error in its own check
     code, and one gap in the first write-up of the Lemma L proof (closed; the statement is unchanged). The draft's
     data were not affected.

Results of the draft that still stand are carried over with the same data files: Lemmas 1–4, Proposition 5, the
validation with the actual zeros, and Tables 1–3 and 5.

**Grades.**

* **PROVED**: complete argument written here, checked by the author only.
* **PROVED (standard)**: a classical mechanism written out for this setting.
* **CERTIFIED-FLOAT**: double-precision computation with the residual stated.
* **MEASURED**: numerics at proxy heights with the actual zeros 1..10⁶, or with the actual primes.
* **CONTINUOUS MODEL**: on-line zeros replaced by their mean density; exact inside that model.
* **HEURISTIC**.
* **CONDITIONAL**: depends on a stated unrefereed or unproved input.
* **[L]**: a literature statement, not re-verified here.

**Referee status.** No fresh independent referee was available in this run; this agent had no subagent tool.
Section 6 is an adversarial pass by the same agent, re-deriving the claims with independent code paths. Everything
labelled PROVED, and Lemma L in particular, still needs a fresh referee before it is cited as more than internally
checked.

**Scripts.** All run with `.venv-arb/bin/python -I`, one process each, under 2 min and under 1 GB.

* From the draft, unchanged: `tmp/rha-contradiction-lib.py`, `-explicit.py`, `-thresholds.py`, `-checks.py`.
* New in this revision:
  * `tmp/rha-contradiction-landau.py`: Lemma L kernels, residues, functional-equation check, Lagarias identification.
  * `tmp/rha-contradiction-minimal.py`: Tables A, B, B′, C.
  * `tmp/rha-contradiction-phase-test.py`: §3.5.
  * `tmp/rha-contradiction-referee.py`: §6.

Outputs are in `tmp/rha-contradiction-out/`: `explicit.json/.log`, `thresholds.json`, `checks.json`, `landau.json/.log`,
`minimal.json/.log`, `phase-test-A.json/.log`, `phase-test-B.json/.log`, `referee.json/.log`.

---

## The line where it fails

Let ρ₀ = 1/2 + δ₀ + iγ₀ with 0 < δ₀ ≤ 3/8 and γ₀ > 3·10¹². Take the test function f(u) = e^{−iγ₀u} sinh(δ₀u) on
[−a, a] (Step 3; it is optimal by Lemma 2). Then the contradiction needs, for **one** support a ≥ a₁(δ₀, γ₀):

    (★_min)_a    LHS_a(γ₀) := Σ_{n ≤ e^{2a}} Λ(n) n^{-1/2} w_{a,δ₀}(log n) cos(γ₀ log n)  <  β(γ₀) + s(a),

where:

* w_{a,δ}(v) = [sinh(δ(2a − |v|))/(2δ) − (2a − |v|) cosh(δv)/2] / m(a,δ), with m(a,δ) = sinh(2aδ)/(2δ) − a;
* β(γ₀) = (1/2) log(γ₀/2π) + O(γ₀⁻¹);
* s(a) = m − (M_on + M_far)/2 > 0 is the slack left by the rigorous zero-side majorants (Step 4).

In the continuous model the inequality reads LHS_a(γ₀) < m(a).

**At a fixed support (pointwise wall).**

* The best bound that does not use the position of (γ₀ log p mod 2π)_p is the Kronecker-torus bound
  T(a) = Σ Λ(n) n^{-1/2} |w(log n)|. It exceeds β + s(a) at **every** support a. In the continuous model the minimum
  over a is attained at the minimal detecting support, where it equals 3.03 (δ₀ = 3/8), 6.66 (0.3), 38.4 (0.2) and
  2966 (0.1) at γ₀ = 3·10¹². With the rigorous majorants the minimum is larger: 8.22, 47.6, 2902 and 4.4·10⁸. It
  grows like (log γ₀)^{1/(2δ₀) − 1} (Table A).
* Mean-value and density inputs bound the measure of the set of heights where the inequality fails, never the single
  height γ₀ (Table 3, MV-CAP).
* The 7/8 half-plane gives the inequality only at supports where it re-proves 7/8.

**At all large supports (Landau transport).** By Lemma L and Corollary L, "(★_min)_a for every large a" at the fixed
height γ₀ is sandwiched between two global half-planes:

* it is implied by "ζ(s) ≠ 0 for Re s > 1/2 + θ" with some θ < δ₀, at every height;
* it implies "ζ(s) ≠ 0 for Re s > 1/2 + δ₀", at every height.

This is the V7 floor of atlas §10 (and of `03-landau.tex`) in another trial direction. The available inputs give
θ = 3/8 (QRH, Lean-built) or θ = 0.37488665 (Xu–Sang/PR 14, conditional).

* If accepted, the conditional input removes δ₀ ∈ (0.37488665, 3/8] directly, since that is its own statement.
* For every remaining δ₀, both values of θ are at least δ₀. Neither gives θ < δ₀, which is what is needed.

So Step 5 is the zero-free statement being proved, written on the prime side, in either form. The argument converts
the problem into its prime-side dual and does not reduce it.

---

## 0. Goal, reading record, overlap with the audit

### 0.1 Goal and plan

**Goal.** Prove ζ(s) ≠ 0 for 1/2 < Re s ≤ 7/8. With (I2) and the functional equation this is RH. The boundary
Re s = 7/8 is included because (I2) excludes only Re s > 7/8.

**Plan.**

1. Assume ζ(ρ₀) = 0 with ρ₀ = 1/2 + δ₀ + iγ₀ and 0 < δ₀ ≤ 3/8.
2. Build a test function concentrated at γ₀ for which ρ₀ forces the Weil functional W(f) to be very negative
   (zero side).
3. Prove from the primes that W(f) is not that negative (prime side). That is a contradiction.

The deliverable is either a proof, or the exact line where it fails and why. Nothing is claimed beyond what is
established.

### 0.2 Reading record (this revision)

Read in full before revising:

* **Atlas snapshots.**
  * `/tmp/atlas-snap-historical-routes.md` (route atlas §§1–12, review ledger and closing line).
  * `/tmp/atlas-snap-PUBLICATION_SCOPE_2026-10-30.md`.
  * Module notes `/tmp/atlas-snap-{arithmetic-foundation, spectral-head-theory, signed-complement,
    spectral-denominator-repair, whole-even-certificate, suzuki-recurrence, prime-memory,
    finite-suzuki-certificate}.md`.
* **Sources inside PR 27 and PR 14.**
  * The V7 Landau section, `git show refs/pr/27:research/rh/foundation/source/03-landau.tex`.
  * The PR 14 package, `git show refs/pr/14:rigorous/mobius_bridge_reduction/{README.md, SIGNED_PHASE_FILTER.md}`.
* **The four wall modules.**
  * `src/data/flow-blindness-no-go.js`.
  * `src/data/imp-95530-native-span-arithmetic-input-rigidity.js`.
  * `formalization/paper/mv-cap-theorem.md` (with its referee box).
  * `research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`.
* **Other project material.** The wall summary of `formalization/routes/fifty-routes-synthesis-2026-10-15.md`, the
  route-16 and route-27 module headers, and the headers of the four sibling attempts of 1 November.

### 0.3 Where this attempt overlaps the atlas, and what is different

| Ingredient here | Atlas | What the atlas records | What is different here |
|---|---|---|---|
| Weil positivity at large support (the Step 5 target) | §9; whole-even certificate; spectral denominator repair; PR 15 ledger | Supported even positivity is certified only for λ² ≤ 16.001 and 16.1 (W = 2 log λ ≤ 2.779, even sector). PR 15's Q_{6/5} ≥ 10⁻⁵⁵ has an unavailable artifact. The failed X = 16.1 surrogate is **not** a negative vector. The null-symbol dual is completeness, not an all-support construction. Open: "actual signed all-support lower bounds". | Needs a lower bound in **one** direction family (f concentrated at γ₀), and only a negative floor W(f) > −2m·s(a), not positivity. The certified supports see no off-line zero above height ≈ 17 (Table C). The one-direction requirement is still RH-strength (Proposition 6, Lemma L). The zero-side negativity under ρ₀ is an actual value of the actual form, computed with rigorous majorants, not a surrogate. |
| 7/8 half-plane; V7 floor; PR 14/Xu–Sang | §10; arithmetic-foundation; `03-landau.tex` | ε₀(λ) ≥ −C(1+log λ)^m λ^p ⟹ no zeros in Re s > (1+p)/2; unproved for p < 3/4. PR 14 gives B = 0.87488665, conditional on Xu–Sang. The energy bound ∫_j^{j+1}\|S\|² ≤ Ce^{0.7496 j} is unproved. The sixth-phase filter retains eigenvalue one. | **Lemma L.** The floor along the concentrated direction at any single height is equivalent to the half-plane, with the converse. The attempt's all-scale form lies between two such statements, at offsets θ < δ₀ and δ₀ (Corollary L). Localisation at γ₀ shortens the visibility scale from (2 log γ₀)/δ₀ to (1/δ₀) log(2δ₀ log γ₀) (Table B) and does not change the strength. Lemma L² is the same for the PR 14 energy form. The eigenvalue-one obstruction (mean energy is not worst-case control) is the same mechanism as Table 3 and the phase test. |
| "No uniform positive margin" | §11 | A uniform strictly positive scalar margin is the wrong RH target, because of almost-periodic returns. | (★_min) asks for no positive margin. The large-support ratio Q[f]/‖f‖² is almost periodic in the support, with measured dips to 17–23% of its mean (Remark 3.3). |
| Shift positivity, threshold a ≥ Δ | §2 | Positivity for every positive shift is an RH-equivalent reformulation. | Lemma L is the analogue for the **exponent** of a floor: exponent δ + θ ⟺ half-plane at offset θ. This is a structural parallel, not a shared method. |
| Finite-prime rigidity | §7 | Changing finitely many prime coefficients breaks exact positivity in some finite matrix. | The floor of Lemma L (with C > 0) absorbs finite prime perturbations, which add O(e^{δW}). It is an asymptotic statement that neither exact positivity nor finite prime data certify. |
| G_L(ε) ≤ 1 for all supports | §4 | All supports and arbitrarily small ε are required. | The same quantifier problem, restricted to one direction family. |
| Near-null head; signed complement | spectral-head, signed-complement modules | A near-null head of dimension ~λ² exists. The physical-complement bound is open. | At γ₀ ≫ λ² the directions f lie far above the head's frequency range T₀ ≈ πλ²/log λ. They are in the complement, where the gamma symbol beats the trivial prime bound only once log(γ₀/2π) > 2T(a). (★_min) is a complement bound in one direction. |
| Suzuki recurrence; prime memory | modules | One-sided Landau ⟺ a lower bound for the signed credit sum G_N. Debts are summable; credits are uncontrolled. | The height-0 box keeps Λ(n) ≥ 0, which is the structure Suzuki uses. The localised direction replaces Λ(n) by the signed Λ(n) cos(γ₀ log n) and is equivalent in strength (Lemma L). For the all-scale route, the height-0 formulation is therefore the better one (§7). |
| Vortex/collision, theta certificates, twistor/Hankel, information tuning | §§3, 5, 6, 8 | — | Not used. Global vortex trapping is RH (vortex README) and is not used. |

---

## 1. Inputs

* **(I1) Weil explicit formula.** [L] Weil 1952; Guinand; Barner. For g continuous, compactly supported and of
  bounded variation, with ĝ(z) = ∫ g(u) e^{izu} du:

      Σ_ρ ĝ(γ_ρ) = ĝ(i/2) + ĝ(−i/2) + (1/2π) ∫ ĝ(r) Ω(r) dr − Σ_{n≥2} Λ(n) n^{-1/2} [g(log n) + g(−log n)].

  Here γ_ρ = (ρ − 1/2)/i and Ω(r) = Re ψ(1/4 + ir/2) − log π. Zeros are counted with multiplicity and summed
  symmetrically. The formula was re-verified numerically for the test functions used here (§2.4: 72 cases, relative
  residual ≤ 1.6·10⁻⁸; independently again in §6, R3).
* **(I2) QRH 7/8.** ζ(s) ≠ 0 for Re s > 7/8 (openai/math family 003). The Lean build was re-run locally on
  2026-10-07; the result is not peer-reviewed.
* **(I2′) Xu–Sang / PR 14.** No zeros with Re ρ > 0.87488665. **CONDITIONAL** on the analytic estimates and closure
  lemma imported from Xu–Sang (arXiv:2610.15291v2), which the PR 14 package does not prove (atlas §10). Unrefereed;
  not verified here.
* **(I3) Platt–Trudgian 2021.** Every zero with 0 < γ ≤ 3.0001753·10¹² has β = 1/2.
* **(I4) Zero counting.** Trudgian 2014, constants as quoted in `mv-cap-theorem.md`, not re-derived:
  |N(T) − M(T)| ≤ B(T) = 0.112 log T + 0.278 log log T + 2.510 for T ≥ e, where M(T) = (T/2π) log(T/2πe) + 7/8.
* **(I5) Zero density.** N(σ, T) ≤ T^{30(1−σ)/13 + o(1)} (Guth–Maynard). Explicit versions exist (Kadiri–Lumley–Ng).
  Not re-derived.
* **(I6) Certified fixed-support Weil positivity** (atlas whole-even and spectral-denominator-repair modules). The
  actual reflection-even supported form is coercive for 1 < λ ≤ √16.001; the repair extends this to √16.1. This is
  support width W = 2 log λ ≤ 2.779, and the even sector only.
* **(I7) V7 one-sided Landau theorem** (`03-landau.tex`, Theorem 3.2). If D(W) ≤ C(1+W)^m e^{αW} for W ≥ W₀, then
  there are no zeros in Re s > 1/2 + α. The theorem is proved there. Its hypothesis is unproved for α < 3/8.
* **Not an input:** Weil positivity at the supports of Step 3. That is what Step 5 must establish.

## 2. The argument

### Step 1 (normalisation)

By the functional equation and reality we may take β₀ > 1/2 and γ₀ > 0. By (I2), δ₀ := β₀ − 1/2 lies in (0, 3/8].
Under the conditional (I2′) it lies in (0, 0.37488665]. By (I3), γ₀ > 3.0001753·10¹². The zeros ρ₀, 1 − ρ̄₀, ρ̄₀ and 1 − ρ₀ give γ ∈ {γ₀ − iδ₀, γ₀ + iδ₀, −γ₀ − iδ₀, −γ₀ + iδ₀}.

### Step 2 (the Weil form)

For f ∈ L²(R) supported in [−a, a], put:

* f^*(u) = conj f(−u);
* g = f * f^*, which is supported in [−2a, 2a];
* F = f̂.

Then ĝ(z) = F(z) · conj F(z̄), which equals |F|² on R. (I1) reads

    W(f) := Σ_ρ ĝ(γ_ρ) = A(f) + P(f) − Pr(f),
    A(f) = (1/2π) ∫ |F(r)|² Ω(r) dr,   P(f) = 2 Re[F(i/2) conj F(−i/2)],
    Pr(f) = Σ_{n ≤ e^{2a}} Λ(n) n^{-1/2} · 2 Re g(log n).

Only prime powers n ≤ N := e^{2a} enter.

### Step 3 (the test function)

    f(u) = e^{−iγ₀u} sinh(δ₀u) · 1_{|u| ≤ a}.

**Lemma 1 (closed forms; PROVED, elementary; checked by quadrature, §6 R1 and `landau.json` C0).** Write
Φ_a(x) := F(γ₀ + x) and m = m(a, δ₀).

1. Φ_a(x) = sinh((δ₀ + ix)a)/(δ₀ + ix) − sinh((δ₀ − ix)a)/(δ₀ − ix). For real x this equals
   2i[δ₀ cosh(aδ₀) sin(ax) − x sinh(aδ₀) cos(ax)]/(δ₀² + x²).
2. Φ_a(iδ₀) = −m and Φ_a(−iδ₀) = m, where m = ‖f‖₂² = sinh(2aδ₀)/(2δ₀) − a.
3. ĝ(γ₀ + x) = −Φ_a(x)² for complex x.
   * For real x this is |Φ_a(x)|² ≥ 0.
   * The pair γ₀ ∓ iδ₀ contributes exactly −2m².
   * The pair −γ₀ ∓ iδ₀ contributes O(cosh²(2aδ₀)/γ₀²).
4. g(v) = e^{−iγ₀v} g₀(v), with g₀(v) = sinh(δ₀(2a − |v|))/(2δ₀) − (2a − |v|) cosh(δ₀v)/2 for |v| ≤ 2a and 0
   otherwise. Hence Pr(f) = 2 Σ_{n ≤ N} Λ(n) n^{-1/2} g₀(log n) cos(γ₀ log n), and g₀(0) = m.

*Proof.*

* (1) is ∫_{−a}^{a} sinh(δ₀u) e^{ixu} du.
* (2) follows from (1). At x = iδ₀ the first quotient tends to a and the second equals sinh(2aδ₀)/(2δ₀); at x = −iδ₀
  the roles swap.
* (3) uses conj Φ_a(x̄) = −Φ_a(x), so F(z) conj F(z̄) = −Φ_a(x)².
* (4) is ∫ sinh(δ₀(u + v)) sinh(δ₀u) du over the overlap [−a, a − v] for v ≥ 0, using
  sinh A sinh B = [cosh(A+B) − cosh(A−B)]/2. ∎

**Lemma 2 (this test function is optimal; PROVED in the continuous model).** Fix a > 0, δ ∈ (0, 1/2), H > 0 and
Ω > 0. Over all f ∈ L²[−a, a], the Hermitian form

    Q(f) = Ω ‖f‖² + ĝ(H − iδ) + ĝ(H + iδ)

takes a negative value if and only if

    sinh(2aδ)/δ − 2a > Ω.

The minimising direction is e^{−iHu} sinh(δu).

*Proof A (reproducing kernel).* This is the 12:55 draft's argument. The Gram matrix of the kernels of PW_a at
H ± iδ is [[s, c], [c, s]], with s = sinh(2aδ)/(2πδ) and c = a/π. It commutes with the pairing matrix J = [[0,1],[1,0]].
The negative branch ρ_H/(s − c) − 1 < 0, with ρ_H = Ω/2π, gives the law. The minimiser is K_{z₁} − K_{z₂}.

*Proof B (time domain; added in this revision).* Write f = e^{−iHu} h. Then

* F(H + iδ) = ⟨h, e₁⟩ with e₁ = e^{−δu};
* F(H − iδ) = ⟨h, e₂⟩ with e₂ = e^{δu};
* Q = Ω‖h‖² + 2 Re[⟨h, e₁⟩ conj ⟨h, e₂⟩].

Here e₁ and e₂ are real functions on [−a, a] with ‖e₁‖² = ‖e₂‖² = sinh(2aδ)/δ and ⟨e₁, e₂⟩ = 2a. The rank-two form
e₁e₂ᵀ + e₂e₁ᵀ has least eigenvalue ⟨e₁, e₂⟩ − ‖e₁‖‖e₂‖ = 2a − sinh(2aδ)/δ, with eigenvector e₁ − e₂ ∝ sinh(δu). ∎

Both proofs were checked against a 60-mode Legendre–Galerkin discretisation, which is a different basis from the
draft's 160-node collocation. The least eigenvalue matches Ω + 2a − sinh(2aδ)/δ to 1.2·10⁻¹¹, and the sign matches at
±2% around the onset in all five cases (§6 R2).

In the continuous model the on-line zeros near H contribute Ω(H)‖f‖² with Ω(H) ≈ log(H/2π). So an isolated
off-line pair of offset δ at height H is visible to some test function of support a **iff**

    sinh(2aδ)/δ − 2a > Ω(H).                                                        (D)

Consequences (continuous model; 12:55 draft, unchanged):

* The RES-T family of imp-95530 needs about 10% more support.
* At X = 3·10¹² the verified-height crossover is 2a = 7.051, against RES-T's 7.764. With δ ≤ 3/8 it is 2a = 8.767,
  against RES-T's 9.651.
* The matched test offset is optimal (`checks.json`, matched_filter).

### Step 4 (zero side: the zero forces W(f) < 0)

**Lemma 3 (on-line majorant; PROVED).** For real x, |Φ_a(x)|² ≤ 4 cosh²(aδ₀)/(δ₀² + x²). The largest ratio found on
dense grids is 0.90 (§6 R5). For H ≥ 10³,

    Σ_{γ > 0} δ₀/(δ₀² + (γ − H)²) ≤ (1/2) log(H/2π) + 2B(2H)/δ₀ + ε(H),   ε(H) ≤ (δ₀/H) log(H/δ₀) + O(H⁻¹).

So the on-line zeros contribute at most M_on · m to W(f), where

    M_on(a) = [4 cosh²(aδ₀)/(δ₀ m)] · [Ω(γ₀)/2 + 2B(2γ₀)/δ₀],

plus O(cosh²(aδ₀) log γ₀/(m γ₀)) from γ < 0.

*Proof.*

* The pointwise bound is Cauchy–Schwarz: (δ₀C sin ax − xS cos ax)² ≤ δ₀²C² + x²S² ≤ C²(δ₀² + x²), with
  C = cosh(aδ₀) ≥ S = sinh(aδ₀).
* For the sum, write N = M + E with |E| ≤ B (I4) and integrate φ(t) = δ₀/(δ₀² + (t − H)²) against dN by parts:
  * ∫ φ dM ≤ (1/2) log(H/2π) + ε(H);
  * ∫ E dφ is at most sup|E| times the total variation 2/δ₀ of φ, which is unimodal, on [0, 2H];
  * the tail beyond 2H is O(δ₀ log H/H²). ∎

**Lemma 4 (far off-line zeros; PROVED).** For |y| ≤ δ̄ and real x ≠ 0, |Φ_a(x + iy)| ≤ 2 cosh(a(δ₀ + |y|))/|x|. So an
off-line pair at ordinate γ with offset ≤ δ̄ and |γ − γ₀| = |x| > D contributes at most 8 cosh²(a(δ₀ + δ̄))/x² in
absolute value. Summing with (I4), all such pairs together contribute at most M_far · m, with

    M_far(a, D) = [8 cosh²(a(δ₀ + δ̄))/m] · [Ω(γ₀)/(πD) + 4B(2γ₀)/D²].

*Proof.* In Lemma 1(1) the two quotients have real parts δ₀ ∓ y in the argument of sinh. Use |sinh w| ≤ cosh(Re w)
and |δ₀ ∓ y ± ix| ≥ |x|, then sum with (I4) as in Lemma 3. ∎

**Proposition 5 (zero side; PROVED under (Iso_D)).** Let ρ₀ be as in Step 1, and assume:

> (Iso_D) every zero ρ ∉ {ρ₀, 1 − ρ̄₀} with |γ_ρ − γ₀| ≤ D has β_ρ = 1/2, and every zero has |β_ρ − 1/2| ≤ δ̄.

Then

    W(f) ≤ (M_on + M_far) m − 2m²,

up to O(e^{2a}/γ₀) from the pole terms and γ < 0. In particular W(f) < 0 once 2m > M_on + M_far.

*Proof.* W(f) = (on-line sum) + (far off-line sum) − 2m² + (γ < 0 terms), by Lemma 1(3) and Lemmas 3 and 4. ∎

Two choices of δ̄ are admissible:

* δ̄ = 3/8, from (I2);
* δ̄ = δ₀ (respectively δ₀ + ε), if ρ₀ is chosen with maximal (respectively ε-near-maximal) offset.

Let a_rig(δ₀, γ₀) be the root of 2m = M_on. Table 5 gives the isolation radius D.

**Table 5 (isolation radius D at a = 1.1 a_rig, M_far using at most half the slack; `checks.json`).**

| γ₀ | δ₀ | D with δ̄ = δ₀ | D with δ̄ = 3/8 |
|---|---|---|---|
| 3·10¹² | 0.1 / 0.2 / 0.3 / 0.375 | 9.5 / 31 / 66 / 100 | 2.1·10⁷ / 3.5·10³ / 257 / 100 |
| 10²⁰ | 0.1 / 0.2 / 0.3 / 0.375 | 13 / 47 / 101 / 155 | 7.4·10⁷ / 7.2·10³ / 434 / 155 |
| 10¹⁰⁰ | 0.1 / 0.2 / 0.3 / 0.375 | 51 / 196 / 433 / 670 | 1.2·10¹⁰ / 1.0·10⁵ / 2.7·10³ / 670 |

**Gap G1 (not closed; fixed-support version only).** Without (Iso_D) the single-pair test function can fail. Take a
second off-line pair with the same offset at distance x. Its contribution, relative to ρ₀'s −2m², is:

* −0.997 (x = 0.01), −0.72 (0.1), +0.74 (0.3), +1.20 (0.5) and −0.41 (1.0), for δ₀ = 3/8 and a = 4.38;
* up to +1.71 (x = 0.2) for δ₀ = 0.1 and a = 11.6.

So clusters at intermediate distances need a multi-point (Pick-matrix) test function, which is not done here. The
all-support version of Step 5 needs no isolation hypothesis, because Lemma L handles clusters and far zeros. G1 does
not affect the verdict: an isolated off-line zero is consistent with every input (§3.4), so any proof must handle
that case.

### Step 5 (prime side: the inequality needed)

By Step 2 and Lemma 1(4), W(f) = A + P − 2m · LHS_a(γ₀), with

    LHS_a(H) := Σ_{n ≤ e^{2a}} Λ(n) n^{-1/2} w_{a,δ₀}(log n) cos(H log n),   w = g₀/m,  w(0) = 1,  |w| ≤ 1,
    β(H) := (A + P)/(2m) = (1/2) log(H/2π) + O(H⁻¹).

For β: A = mΩ(H) + R with |R|/m ≤ 10⁻⁹ in every proxy case. The leading term of R cancels because
∫₀^∞ log|1 − t²| t⁻² dt = 0. The pole terms give P/m = O(e^{a}/H²); P ≈ 2·10⁻⁷ at H = 10⁴, a = 3 (§6 R3).

Combining with Proposition 5: if ρ₀ exists and (Iso_D) holds, then

    LHS_a(γ₀) ≥ β(γ₀) + s(a),    s(a) := m(a) − (M_on(a) + M_far(a))/2.                (5.1)

**The contradiction therefore needs a prime-side proof of**

    (★_min)_a    LHS_a(γ₀) < β(γ₀) + s(a)    for one a with s(a) > 0.

Remarks on (★_min):

* **(★) implies (★_min).** The 12:55 draft stated the target as (★)_a: LHS_a(γ₀) ≤ β(γ₀), which is W(f) ≥ 0, Weil
  non-negativity in this direction. That implies (★_min)_a whenever s(a) > 0, but it is more than needed.
* **(★_min) is a negative floor.** It is the statement W(f) > −2m·s(a), not positivity. This is consistent with
  atlas §11: no positive margin is required.
* **Continuous model.** There M_on = Ω, M_far = 0 and β = Ω/2, so β + s = m(a). The inequality (★_min)_a reads
  LHS_a(γ₀) < m(a). If ρ₀ exists, LHS_a(γ₀) ≈ m(a) in the continuous model.
* **Shape of the weight.**
  * The positive lobe w ≈ e^{−δ₀v} near v = 0 imitates −ζ′/ζ at ρ₀.
  * The negative lobe w ≈ −δ₀(2a − v)e^{−δ₀(2a−v)} near v = 2a imitates −ζ′/ζ at 1 − ρ̄₀.
  * For δ₀ > 1/4 the large value m(a) comes mainly from the negative lobe, i.e. from prime powers near e^{2a}.
* **Support freedom.** Any a with s(a) > 0 will do. Section 3 examines every such a (fixed supports in §3.1, all
  large supports in §3.3).

### Step 6 (conclusion, if (★_min) were available)

If (★_min)_a held at some a with s(a) > 0, then (5.1) would fail, so ρ₀ would not be a zero satisfying (Iso_D).
Running over all δ₀ ∈ (0, 3/8] and γ₀ > 3·10¹² needs (★_min) on a two-parameter family at supports
2a_rig(δ₀, γ₀) → ∞. Together with G1, that is Weil positivity in this family, i.e. RH (Proposition 6, Corollary L).

### 2.4 Validation with the real zeros

Grades: MEASURED / CERTIFIED-FLOAT. Data: `explicit.json` and `explicit.log` (12:55, unchanged), plus an independent
re-check in §6 R3.

Set-up: H_c is the midpoint of two consecutive zeros near 10⁴, 10⁵ and 5·10⁵; δ ∈ {0.1, 0.2, 0.3, 0.375}; six
supports each. The prime side is computed exactly from a sieve to 10⁸.

* **Identity (I1).** Zero side (all 10⁶ zeros plus a density tail) against A + P − Pr. The maximum absolute residual
  is 4.5·10⁻⁶ and the maximum relative residual 1.6·10⁻⁸, over 72 cases. An independent implementation (§6 R3:
  trial-division primes, Simpson archimedean integral, Gauss–Legendre pole terms) gives relative residuals 1.9·10⁻⁹
  and 2.6·10⁻⁹.
* **(★) for ζ.** LHS ≤ β in all 72 cases, with minimum margin 0.598 (H = 10⁵, δ = 0.1, a = 8.22). This is forced,
  since the zero side is Σ|F(γ)|² ≥ 0 at verified heights.
* **Counter-model** (window replacement, MV-CAP Remark A′). Remove the two zeros around H_c and insert the off-line
  pair 1/2 ± δ + iH_c. Its zero side becomes negative from a_meas onward and stays negative up to a = 80:

| H_c | δ | a_meas | a_ideal (D) | a_rig | LHS(ζ) at largest a | β | LHS that (★) would need for the counter-model |
|---|---|---|---|---|---|---|---|
| 9999.458 | 0.1 / 0.375 | 5.01 / 2.60 | 7.88 / 3.11 | 22.5 / 6.12 | 1.75 / −0.24 | 3.686 | 9.48 / 25.4 |
| 100000.222 | 0.1 / 0.375 | 5.46 / 2.85 | 8.56 / 3.35 | 22.8 / 6.23 | 3.61 / −0.76 | 4.838 | 10.1 / 35.0 |
| 500000.191 | 0.1 / 0.375 | 6.04 / 3.16 | 8.97 / 3.50 | 23.0 / 6.31 | 4.52 / −0.06 | 5.642 | 11.0 / 42.2 |

---

## 3. Attack on Step 5

### 3.1 At a fixed support: the torus bound fails at every support

|LHS_a(H)| ≤ T(a) := Σ_{n ≤ N} Λ(n) n^{-1/2} |w(log n)|.

The numbers log p are linearly independent over Q, so by Kronecker the vector (H log p mod 2π)_{p ≤ N} is dense in the
torus as H ranges over [H₀, ∞). Hence T is the supremum of LHS over all heights, up to prime-power terms. Any argument
that does not use the Diophantine position of γ₀ log p cannot do better than T.

T is evaluated by its PNT main term ∫_{log 2}^{2a} e^{v/2}|w(v)| dv. Against exact prime-power sums for N ≤ 3·10⁶ the
relative error is 0.02% to 0.46% (`minimal.json`).

**Lemma A (the best support for an Euler-blind bound is the smallest; CONTINUOUS MODEL + MEASURED).** In the
continuous model, β + s_cm(a) = m(a) for a ≥ a_ideal. The ratio T(a)/m(a) is increasing in a for every δ₀ ≤ 3/8 at all
four heights tested (`minimal.json`, flag `cm_ratio_monotone_increasing`; grid a_ideal + [0, 12], 241 points). So the
smallest torus gap over all supports is T(a_ideal)/β, the draft's Table 1 value. With the rigorous majorants, the
smallest gap is larger and attained above a_rig.

In no case is the gap below 1. For δ₀ = 1/2 (the anchor, β₀ = 1) the ratio decreases to 1 from above (1.000009 at
2a = 31 for γ₀ = 3·10¹²). The trivial bound is asymptotically exact there and still insufficient; the classical
exclusion of zeros on Re s = 1 uses the 3–4–1 positivity in addition.

**Table A (minimum over supports of T/(β + s); `minimal.json`).**

| γ₀ | δ₀ | 2a_ideal | min T/(β+s), continuous model (at 2a_ideal) | min T/(β+s), rigorous majorants (at 2a) |
|---|---|---|---|---|
| 3·10¹² | 0.1 | 23.13 | 2966 | 4.4·10⁸ (51.3) |
| 3·10¹² | 0.2 | 13.99 | 38.4 | 2902 (27.3) |
| 3·10¹² | 0.3 | 10.36 | 6.66 | 47.6 (19.7) |
| 3·10¹² | 0.37488665 | 8.77 | 3.033 | 8.24 (17.0) |
| 3·10¹² | 0.375 | 8.77 | 3.030 | 8.22 (17.0) |
| 3·10¹² | 0.45 / 0.5 | 7.64 / 7.05 | 1.667 (at 2a = 9.34, not monotone) / → 1⁺ as a → ∞ | 2.25 / → 1⁺ |
| 10²⁰ | 0.1 / 0.2 / 0.3 / 0.375 | — | 9416 / 59.3 / 7.87 / 3.20 | 1.2·10⁹ / 4282 / 56.9 / 9.02 |
| 10¹⁰⁰ | 0.1 / 0.2 / 0.3 / 0.375 | — | 1.2·10⁶ / 382 / 17.3 / 4.49 | 1.3·10¹¹ / 2.6·10⁴ / 129 / 13.6 |
| 10¹⁰⁰⁰ | 0.1 / 0.2 / 0.3 / 0.375 | — | 5.8·10⁹ / 9552 / 71.3 / 8.94 | 6.6·10¹⁴ / 6.5·10⁵ / 546 / 28.2 |

**Table 1 (draft, unchanged; γ₀ = 3.0001753·10¹², β = 13.446; `thresholds.json`).** κ = 2a/log log γ₀; the last
column is the Vinogradov–Korobov saving exponent at N = e^{2a}.

| δ₀ (β₀) | 2a optimal (D) | 2a RES-T | 2a rigorous | log₁₀ N (optimal) | κ | VK saving exponent |
|---|---|---|---|---|---|---|
| 0.1 (0.6) | 23.13 | 25.45 | 49.38 | 10.04 | 6.89 | 0.112 |
| 0.2 (0.7) | 13.99 | 15.40 | 25.07 | 6.08 | 4.17 | 0.025 |
| 0.3 (0.8) | 10.36 | 11.41 | 16.95 | 4.50 | 3.09 | 0.010 |
| 0.375 (7/8) | 8.767 | 9.651 | 13.70 | 3.81 | 2.61 | 0.0061 |
| 0.5 (1; anchor) | 7.051 | 7.764 | 10.43 | 3.06 | 2.10 | 0.0032 |

**Table 2 (growth of T/β with height at the optimal a; draft, unchanged).** The fitted exponent of Ω is compared with
the prediction 1/(2δ₀) − 1.

| δ₀ | 3·10¹² | 10²⁰ | 10¹⁰⁰ | 10¹⁰⁰⁰ | 10¹⁰⁰⁰⁰ | fitted exponent (predicted) |
|---|---|---|---|---|---|---|
| 0.375 | 3.03 | 3.20 | 4.49 | 8.94 | 19.0 | 0.328 (0.333) |
| 0.3 | 6.66 | 7.87 | 17.3 | 71.3 | 325 | 0.658 (0.667) |
| 0.1 | 2966 | 9416 | 1.2·10⁶ | 5.8·10⁹ | 5.1·10¹³ | 3.94 (4.0) |

### 3.2 Duality: (★_min) is the zero-free statement

**Proposition 6.**

1. *(★_min) excludes zeros (PROVED).* If (★_min)_{a,δ}(H) holds at some a with s(a) > 0 for every H ≥ X, then no zero
   of offset δ satisfying (Iso_D) lies above X. This is (5.1).
2. *Zero-freeness gives (★) (CONTINUOUS MODEL).* Suppose the off-line zeros near H are isolated and all have offset
   ≤ δ₁. Then (★)_{a,δ}(H), and hence (★_min), holds for every test offset δ whenever a < a_ideal(δ₁, H). This is
   Lemma 2: no f supported in [−a, a] sees such a zero below that support. Since a_ideal decreases in δ, the support
   needed for offset δ₀ < δ₁ is strictly larger than the support that zero-freeness at δ₁ provides.
3. *Scales (PROVED for (D); numerics for T).*
   * From (D), 2a_ideal = (1/δ) log(2δΩ(H)) + o(1), so N = e^{2a} ≈ (2δ log H)^{1/δ}.
   * The rigorous threshold changes only the constant: N ≈ (c_δ log H)^{1/δ}.
   * T/β ≍ Ω^{1/(2δ) − 1} at the detection support (Table 2).
4. *Dictionary (HEURISTIC in the constants).* Write N = (log H)^κ. Pointwise (★) at every large height, for all
   supports with N ≤ (log H)^κ, corresponds to the zero-free half-plane β < 1/2 + 1/κ. Anchors:
   * the trivial bound, κ = 2 ↔ β < 1 (nothing);
   * (I2), κ = 8/3 ↔ 7/8;
   * the 13/15 ceiling of the 7/8 architecture, κ = 30/11;
   * RH, κ = ∞.

### 3.3 At all large supports: Landau transport

Atlas §10 and `03-landau.tex` prove the one-sided theorem along the constant box at height 0. The next lemma is the
same mechanism along the concentrated direction at an arbitrary height, together with the converse. It answers the
question whether proving the floor only at the height of the hypothetical zero is easier. It is not.

Fix H ∈ R and δ ∈ (0, 1/2). For W > 0 let f_W(u) = e^{−iHu} sinh(δu) 1_{|u| ≤ W/2} (support a = W/2), and let

    U(W) := W(f_W) = Σ_ρ ĝ_W(γ_ρ) = A + P − Pr

be its Weil form.

**Lemma L (Landau transport along a concentrated direction; PROVED (standard mechanism), same-agent check only).**
For θ ∈ [0, 1/2) the following are equivalent:

* (a) there are C, m ≥ 0 and W₀ with U(W) ≥ −C (1+W)^m e^{(δ+θ)W} for all W ≥ W₀;
* (b) ζ(s) ≠ 0 for Re s > 1/2 + θ.

In (b) ⟹ (a) one may take m = 0 and C = C(δ, θ) log(|H| + 3).

*Proof.* Step (i) computes the Laplace transform of each zero's contribution; step (ii) assembles the transform of U
and lists its poles; step (iii) is the Landau argument for (a) ⟹ (b); step (iv) proves the converse.

**(i) Kernel of one zero.** For a zero ρ = 1/2 + θ_ρ + iγ put x_ρ := γ_ρ − H = (γ − H) − iθ_ρ. By Lemma 1(3),
ĝ_W(γ_ρ) = −Φ_{W/2}(x_ρ)². Write α_± = δ ± ix. Expanding Φ² with

* sinh²(αW/2) = (cosh αW − 1)/2,
* sinh(α₊W/2) sinh(α₋W/2) = (cosh δW − cos xW)/2,

and integrating termwise gives, for Re q > δ + |Im x|,

    κ(x; q) := ∫_0^∞ −Φ_{W/2}(x)² e^{−qW} dW = K[y_x](q),   y_x(q) := 2q/(q² + x²),
    K[y](q) := y(q)/(2(q² − δ²)) − [y(q − δ) + y(q + δ)]/(4q²).

The identity uses 1/(2q(q² − α²)) = [1/(q − α) + 1/(q + α)]/(4q²) for α = α_±. It was checked by quadrature to
3·10⁻¹⁸, including off-line x = 0.7 − 0.2i and the matched x = −iδ (`landau.json` C2).

**(ii) Transform of U.** For |θ_ρ| < 1/2,

    |ĝ_W(γ_ρ)| ≤ 4e^{(δ+1/2)W} min{δ⁻², 4|γ − H|⁻²}

by Lemma 1(1) and Lemma 4, and Σ_ρ min{1, |γ − H|⁻²} < ∞. So for Re q > δ + 1/2 Fubini gives L[U](q) = Σ_ρ κ(x_ρ; q).
Then

    Σ_ρ 2q/(q² + x_ρ²) = Σ_ρ [1/(s₊ − ρ) + 1/(s₋ − ρ)] = ξ′/ξ(s₊) + ξ′/ξ(s₋) =: Y(q),   s_± = 1/2 + q ± iH.

The steps are:

* 2q/(q² + x²) = 1/(q − ix) + 1/(q + ix);
* q − ix_ρ = s₊ − ρ and q + ix_ρ = s₋ − (1 − ρ);
* ρ ↦ 1 − ρ is a bijection of the zeros;
* ξ′/ξ(s) = Σ_ρ 1/(s − ρ) in symmetric summation;
* the regrouped series converges absolutely, since κ(x; q) = O(|x|⁻²).

Hence L[U] = K[Y], which is meromorphic on C. Its poles are:

* **q = ±δ.** From the kernel.
* **q = 0, at most simple.** Since ξ(s) = ξ(1 − s) gives Y(−δ) = −Y(δ); checked |Y(δ) + Y(−δ)| = 4·10⁻³¹.
* **q ∈ {±ix_ρ, δ ± ix_ρ, −δ ± ix_ρ}.** Here ±ix_ρ = ±(θ_ρ + i(γ − H)), so these poles are real exactly when γ = H.

Each branch ±ix of y_x has residue +1. So at any pole q₀ ∉ {0, ±δ} the residue of K[Y] is

    M₂/(2(q₀² − δ²)) − (M₁ + M₃)/(4q₀²),

where M₁, M₂ and M₃ count, with multiplicity, the zeros having q₀ − δ, q₀ and q₀ + δ respectively in {±ix_ρ}. The
residue −1/(4q*²) at a real pole q* = δ + θ was checked numerically.

**Non-cancellation.** If M₁ ≥ 1 and q₀² is not real, this residue is non-zero. Vanishing would need
q₀²(M₁ + M₃ − 2M₂) = δ²(M₁ + M₃) > 0, which forces q₀² to be real.

**(iii) (a) ⟹ (b).** Let f := (U + P_C)·1_{[W₀,∞)} with P_C(W) = C(1+W)^m e^{(δ+θ)W}. Then f ≥ 0, and
U(W) = O((1+W)e^{(1/2+δ)W}), so the abscissa satisfies σ_c ≤ 1/2 + δ. On Re q > 1/2 + δ,

    L_f = K[Y] + R − E,

where R = L[P_C] has its only pole at δ + θ and E is entire.

Suppose σ_c > δ + θ.

1. By the real-boundary-singularity lemma (Landau; `03-landau.tex` Lemma 3.1), L_f has no holomorphic continuation to a
   neighbourhood of σ_c. So σ_c is a pole of K[Y].
2. L_f is holomorphic on (σ_c, ∞). So σ_c is the largest real pole of K[Y] in (δ + θ, ∞).
3. Real poles in that interval come only from zeros of ordinate exactly H, including through the branch −ix_ρ of a
   left partner. The largest is σ_c = δ + θ₁, where θ₁ > θ is the largest offset among those zeros. A contribution
   to M₂ or M₃ at σ_c would need a zero of ordinate H with offset θ₁ + δ or θ₁ + 2δ, larger than θ₁. So M₂ = M₃ = 0
   there.
4. Its residue −M₁/(4σ_c²) is negative. Hence L_f(q) → −∞ as q decreases to σ_c, while L_f(q) = ∫ f e^{−qW} ≥ 0 for
   real q > σ_c. Contradiction.

So σ_c ≤ δ + θ. Then L_f is holomorphic on Re q > δ + θ, and so is K[Y] = L_f − R + E.

Now suppose ζ had a zero of offset θ₂ > θ at ordinate γ₂. Then q₀ = δ + θ₂ + i(γ₂ − H) has M₁ ≥ 1 and
Re q₀ > δ + θ.

* If γ₂ ≠ H, then q₀² is not real, and the residue at q₀ is non-zero by non-cancellation.
* If γ₂ = H, take θ₂ maximal at that ordinate; the real pole is then uncancelled, as in step 3.

Either way K[Y] has a pole in Re q > δ + θ. Contradiction.

**(iv) (b) ⟹ (a).** On-line zeros give ĝ = |Φ|² ≥ 0. An off-line zero and its partner 1 − ρ̄, which have x and x̄,
together give −2 Re Φ(x)², because Φ(x̄) = −conj Φ(x). For offsets ≤ θ:

* |Φ_{W/2}(x)| ≤ ∫_{−W/2}^{W/2} e^{(δ+θ)|u|} du ≤ 2e^{(δ+θ)W/2}/(δ+θ);
* for |Re x| ≥ 1, |Φ_{W/2}(x)| ≤ 4 cosh((δ+θ)W/2)/|Re x| (Lemma 4).

Summing with N(T+1) − N(T) = O(log T) gives U(W) ≥ −C(δ, θ) log(|H|+3) e^{(δ+θ)W}. ∎

Remarks on Lemma L:

* **No arithmetic input on the real axis.** `03-landau.tex` needs that ζ has no real zeros in (0, 1), because the
  constant box gives real zeros positive Weil energy. In Lemma L the matched sinh shape gives zeros of ordinate H a
  negative real pole, so no such input is needed.
* **Isolation is not needed.** Lemma L uses no isolation hypothesis; clusters and far zeros are covered.

**Lemma L² (energy version; PROVED, same-agent check only).** In the same setting, suppose that for every ε > 0

    ∫_{W₀}^∞ |U(W)|² e^{−2(δ+θ+ε)W} dW < ∞.

This holds, for example, if ∫_j^{j+1} |U|² ≤ C(1+j)^m e^{2(δ+θ)j} for all large j. Then ζ(s) ≠ 0 for
Re s > 1/2 + θ.

*Proof.* By Cauchy–Schwarz, L[U] converges absolutely on Re q > δ + θ, so K[Y] is holomorphic there. Conclude as at
the end of (iii). ∎

No positivity is used. This is the per-height analogue of the PR 14 implication from block energy to a zero-free
region (atlas §10). That implication is two-sided and L²; PR 14's open part is the signed correlations with small
common divisor and large separation.

**Corollary L (the all-support form of Step 5 is a global half-plane; PROVED from Lemma L and Proposition 5).**

* (i) If (★_min)_a holds at γ₀ for every a ≥ a₁, then ζ(s) ≠ 0 for Re s > 1/2 + δ₀, at every height.
* (ii) If ζ(s) ≠ 0 for Re s > 1/2 + θ with θ < δ₀, then (★_min)_a holds at every γ₀ for all large a.

*Proof.*

* (i) (★_min)_a is U(2a) > −2m s(a) ≥ −2m(a)², and 2m(a)² ≤ C e^{2δ₀·2a}. So (a) of Lemma L holds with δ = δ₀ and
  θ = δ₀ < 1/2.
* (ii) Lemma L gives U(W) ≥ −C log(γ₀ + 3) e^{(δ₀+θ)W}. The right side is o(m²) = o(e^{2δ₀W}). The terms M_on m and
  M_far m (with δ̄ = θ) are O(e^{(δ₀+θ)W} log γ₀). Hence U(W) > −2m² + (M_on + M_far) m = −2m s for large W. ∎

So "(★_min) for all large supports at the single height γ₀" lies between two global zero-free half-planes, at
offsets θ < δ₀ and δ₀. It is not localised at γ₀. In particular it is no easier than the same statement at H = 0,
which is the V7 floor (atlas §10) in a different trial direction. With W = 2 log λ, the floor exponent δ + θ of
Lemma L matches the V7 floor λ^p with θ = p/2.

**Table B (what localisation does buy: the scale at which ρ₀ becomes visible; `minimal.json`; MODEL).** W_loc = 2a_ideal
is for the concentrated direction. W_box solves 2e^{δ₀W}/γ₀² = Σ_{γ>0} 2/γ² = 0.0462, for the unlocalised box/D(W) of
V7, where a zero at height γ₀ enters with weight |ρ − 1/2|⁻² ≈ γ₀⁻².

| γ₀ | δ₀ | W_loc (x = e^W) | W_box (x = e^W) |
|---|---|---|---|
| 3·10¹² | 0.1 | 23.1 (10^10.0) | 537 (10^233) |
| 3·10¹² | 0.2 | 14.0 (10^6.1) | 268 (10^117) |
| 3·10¹² | 0.3 | 10.4 (10^4.5) | 179 (10^77.7) |
| 3·10¹² | 0.375 | 8.77 (10^3.8) | 143 (10^62.2) |
| 10¹⁰⁰ | 0.375 | 13.9 (10^6.0) | 1218 (10^529) |

Localisation lowers the visibility scale from (2 log γ₀)/δ₀ to (1/δ₀) log(2δ₀ log γ₀). The price is that the needed
bound is at the single height γ₀ (§3.1). Lemma L shows that if one instead asks for all scales, the price comes back
in full: the statement becomes global.

**Remark 3.3 (the large-support limit is Lagarias's quantity at a complex node).**

* **Residue of the kernel pole.** The kernel pole of K[Y] at q = δ has residue Y(δ)/(4δ) = Re ξ′/ξ(s₀)/(2δ), with
  s₀ = 1/2 + δ + iH.
* **Under RH.** All other poles have Re q ≤ δ. With m(W) ~ e^{δW}/(4δ) this gives

      U(W)/m(W) = 2 Re ξ′/ξ(s₀) + (almost-periodic terms with frequencies γ − H) + o(1),

  so the W-mean of U/m is 2 Re ξ′/ξ(s₀) = 2 Σ_ρ Re 1/(s₀ − ρ).

  Direct proof under RH (PROVED): by Lemma 1(1),

      |Φ_{W/2}(x)|²/m(W) = 4δ [Im((δ − ix) e^{iWx/2})]²/(δ² + x²)² + O(W e^{−δW}/(δ² + x²))

  uniformly in real x. The error comes from the e^{−aδ} parts of cosh and sinh, and from the −a in m. Here
  [Im z]² = (|z|² − Re z²)/2, and the W-mean of the second term is 0 for x ≠ 0. Summation over γ is dominated by
  Σ 1/(δ² + x²).
* **Measured.** The Hadamard sum over the actual zeros agrees with mpmath's 2 Re ξ′/ξ(s₀) to ≤ 4·10⁻⁹ relative, at
  four (H, δ) pairs with H up to 5·10⁵. The W-average of the near-zero part over W ∈ [10, 210] agrees with its
  prediction to 0.07–2.7%; the remainder is from the finite averaging range (`landau.json` L3).
* **Relation to Lagarias.** Lagarias (1999) [L]: RH ⟺ Re ξ′/ξ(s) > 0 for Re s > 1/2. So the direction family
  {f_{a,δ,H}} is the complex-node counterpart of NS-RIGID's real-node Carathéodory–Pick matrix (imp-95520/95530, A1).
  At each fixed node, the zero-side statement is flow-stable; only the whole family is flow-critical (§4).
* **No uniform margin.** Under RH and a linear-independence hypothesis on {γ − H}, Kronecker applied to the
  oscillating phases gives inf_W U(W)/m(W) = 0 (HEURISTIC). The measured minima over W ∈ [10, 210] are 0.17, 0.17
  and 0.23 of the mean. This is the "arbitrarily small returns" of atlas §11. (★_min) does not ask for a positive
  margin; its margin under RH is at least s(a) > 0, because W(f) ≥ 0 there.

### 3.4 What each input contributes

**Table D (levers, as zero-free offsets θ; with Lemma L each is a floor exponent δ + θ along every concentrated direction).**

| Input | Status | θ | Excludes single zeros with δ₀ > |
|---|---|---|---|
| (I2) QRH 7/8 | Lean-built locally; unrefereed | 3/8 | 3/8 |
| (I2′) Xu–Sang / PR 14 | CONDITIONAL on imported estimates; unrefereed | 0.37488665 | 0.37488665 |
| PR 14 energy target | hypothesis, unproved | 0.3748 | 0.3748 |
| PR 14 B = 0.874 target | needs an unproved restricted fourth moment U^{39/40+ε} | 0.374 | 0.374 |
| V7 floor with exponent p | proved implication, unproved floor for p < 3/4 | p/2 | p/2 |
| RH | — | 0 | all |

The contradiction needs θ < δ₀ for every δ₀ ∈ (0, 3/8]. Every available lever misses by 3/8 − δ₀, or by
0.37488665 − δ₀ for the conditional one.

**(I2) 7/8 and (I2′).**

* At a fixed support, (I2) supplies (★) only below a_ideal(3/8, H), i.e. N ≲ (log H)^{8/3} (Proposition 6.2). The
  matched-filter scan shows the same bootstrap neutrality.
* At all supports, Lemma L gives θ = 3/8.
* (I2′) moves 3/8 by 1.1·10⁻⁴. It changes Table A by less than 0.3% (rows 0.37488665 and 0.375: 3.033 against 3.030,
  8.24 against 8.22).
* The sibling note `2026-11-01-bootstrap-qrh.md` finds that bootstrapping the 7/8 architecture itself stalls (its
  bootstrap map is constant at 0.8749572, MODEL).

**(I5) Zero density.** Four uses, none of which reaches the single zero.

* (a) *Zero side.* Window replacement (MV-CAP Theorem C) changes density counts N(σ,T) by at most 1. So the
  counter-model ζ_W, which has the off-line zero, satisfies every density bound. Global density cannot give (Iso_D)
  either: Guth–Maynard at σ = 1/2 + δ₀/2 is weaker than the trivial count for δ₀ < 2/15, and it counts up to height
  T, not near γ₀.
* (b) *Prime side.* The Montgomery–Vaughan theorem controls moments of the Dirichlet polynomial behind LHS only up to
  order k ≤ log T/(2a). The order needed to exclude one bad window is 2.9–16.4 times that at the heights computed
  (Table 3, HEURISTIC).
* (c) *Bagchi* [L, as usually stated]: RH ⟺ ζ is strongly recurrent in 1/2 < Re s < 1.
  * Density plus Hurwitz show that a zero at ρ₀ makes the τ-density of ε-recurrences of ζ near ρ₀ equal to 0.
  * A contradiction would need positive density of recurrences near ρ₀, i.e. strong recurrence, which is RH.
  * So density is used essentially here, but the missing input is circular.
* (d) *Landau scale (HEURISTIC; the o(1) in Guth–Maynard and polylog factors dropped).*
  * Verified height T₀ = 3·10¹², plus 7/8, plus N(σ,T) ≤ T^{min(1, A(1−σ))} with A = 30/13, keeps the box floor of
    V7 (θ* = 0) up to W* ≈ 131 (x ≈ 10⁵⁷). The binding offset is 3/8.
  * The same inputs keep the floor at θ* = 0.1, 0.2 and 0.3 up to W* ≈ 179, 281 and 656.
  * A single zero at δ₀ = 3/8 above T₀ shows in the box only at W_box ≥ 143.
  * So the scale range covered is finite, and the single zero lies outside it (Table B′ in `minimal.json`).

**Table 3 (moment reach at the optimal a; draft, unchanged; HEURISTIC in the window-length conversion).**

| H | δ₀ | k_max (N^k ≤ H) | k needed for < 1 bad window | log₁₀(bad-window bound at k_max) |
|---|---|---|---|---|
| 10¹⁰⁰ | 0.375 / 0.3 / 0.2 / 0.1 | 16 / 13 / 9 / 5 | 52 / 59 / 77 / none | 62.1 / 70.7 / 81.6 / 92.1 |
| 10¹⁰⁰⁰ | 0.375 / 0.3 / 0.2 / 0.1 | 115 / 95 / 67 / 37 | 340 / 367 / 427 / 607 | 609 / 687 / 791 / 897 |
| 10¹⁰⁰⁰⁰ | 0.375 / 0.1 | 884 / 272 | 2538 / 3711 | 6113 / 8961 |

**(I6) Certified Weil positivity.** Table C applies the law (D) at the certified widths.

* At W ≤ log 16.1 = 2.779, an off-line pair of offset 3/8 is visible only below height ≈ 10.7, and offset 1/2 below
  ≈ 16.8. So the certificates exclude no off-line zero beyond what is classical: the first zero is at 14.13, and
  offset 1/2 is Re s = 1. The continuous model is not meaningful at these heights, where there is at most one zero.
  The point is only that nothing is visible at the heights that matter.
* As a lever, positivity at width W would exclude isolated zeros with δ₀ > δ_min(W, H):
  * W = 20: δ_min = 0.122 at 3·10¹², 0.147 at 10²⁰, 0.239 at 10¹⁰⁰;
  * W = 50: δ_min = 0.034, 0.041 and 0.075.
* This region shrinks as H grows at fixed W (RES-T B2). All heights need all widths.

**Table C (fixed-support reach, continuous model; `minimal.json`).** The last three columns are the offset needed for
the width to see a zero at that height ("—" means not visible even at offset 1/2).

| Width W | Label | Height below which offset 0.375 / 0.5 is visible | δ_min at 3·10¹² | δ_min at 10²⁰ | δ_min at 10¹⁰⁰ |
|---|---|---|---|---|---|
| 2.773 | whole-even certificate (λ² = 16.001) | 10.6 / 16.7 | — | — | — |
| 2.779 | spectral repair (λ² = 16.1) | 10.7 / 16.8 | — | — | — |
| 2.4 | PR 15 Q_{6/5} (artifact unavailable) | 8.8 / 11.7 | — | — | — |
| 8.767 | 7/8-visibility support at 3·10¹² | 3.0·10¹² / 6·10³¹ | 0.375 | 0.438 | — |
| 20 | — | ∞ / ∞ | 0.122 | 0.147 | 0.239 |
| 50 | — | ∞ / ∞ | 0.034 | 0.041 | 0.075 |

**(I7) V7 / Landau.** Lemma L extends it to every concentrated direction and adds the converse. The hypothesis is the
same unproved floor.

**Λ ≥ 0 positivity (positive trigonometric polynomials, the 3–4–1 method).**

* This is the one Euler-product input that is one-sided and not flow-stable. Applying it needs the height-0 term, and
  any non-negative P(θ) = Σ c_k cos kθ has c₀ > 0 and c₁ ≤ 2c₀.
* At σ = 1/2 the height-0 term includes the pole of ζ at s = 1, which costs c₀·T₀(a) with T₀(a) ~ e^a, against the
  zero's c₁·m(a) ~ e^{2aδ₀}.
* So it works only for δ₀ ≥ 1/2 − O(1/a). That is the classical region near Re s = 1. Table A's δ₀ = 1/2 row shows
  how close the trivial bound alone comes there.

**Pointwise exponential sums.** Vinogradov–Korobov gives savings exp(−(log N)³/(133.66 (log H)²)) (Ford's constant).
At N = e^{2a} the exponent is 0.0061 to 0.112 at 3·10¹² (Table 1), against needed factors 3.03 to 2966.

**Dirichlet-coefficient positivity (Levinson–Conrey, PRZZ, Alpöge–Furman ≥ 2/3; route 16).**

* These give proportion statements over [T, 2T].
* Under window replacement, critical counts drop by at most 2 outside the window and at most 19.3 inside it (about 36
  for the κ = 1 variant, MV-CAP referee correction 1). So they cannot exclude ρ₀.
* Localised to one window of length O(1) at γ₀, their mechanisms need short-interval mean values of mollified
  polynomials of length T^θ, whose Montgomery–Vaughan error O(T^θ) is far larger than the window.
* The sibling attempt `2026-11-01-window-100.md` locates the same wall at its line 6.1.

### 3.5 Can (★_min) hold? A test

* **At verified heights: yes, with margin.**
  * The draft found a minimum margin of 0.598 for (★) over 72 proxy cases (§2.4).
  * New phase test, A (`phase-test-A.json`; MEASURED): δ = 0.2, a = a_ideal = 5.50, N = 6.0·10⁴, 6138 prime powers,
    100,000 random heights in [4·10⁵, 6·10⁵]. The largest value of LHS − β is −0.733.
  * Phase test B (`phase-test-B.json`): δ = 0.15, N = 7.2·10⁵, 6000 heights. The largest value is −0.760. No
    exceedance.
* **For random phases: no.**
  * Replace γ₀ log p by independent uniform phases θ_p, with kθ_p on p^k (Bohr–Jessen model).
  * Exceedance rates: 3.2·10⁻⁴ for A (Gaussian prediction 3.35·10⁻⁴) and 3.0·10⁻³ for B (prediction 2.98·10⁻³).
  * The bulk statistics agree with the actual ones:
    * mean 0.011 / −0.005, std 1.653 / 1.659, skewness 0.014 / 0.016 for A;
    * std 2.048 / 2.055 for B.
  * The 0.999 quantile is 4.36 (actual) against 5.12 (random) for A.
  * So the actual and random sums agree in the bulk, but the actual upper tail stops below β. The inequality is a
    property of the actual phase vectors, not of generic points of the Kronecker torus.
  * At γ₀ ≈ 3·10¹², the Gaussian random model would predict about 10^9.2 (δ₀ = 0.1), 10^6.4 (0.15) and 10^3.1 (0.2)
    exceedances below the verified height, where there are none (HEURISTIC count). Montgomery–Vaughan controls only
    k ≤ 1–2 moments there.
* **For all heights: if and only if** the corresponding zero-free statements hold (Proposition 6, Corollary L).
* **For the counter-model ζ_W: no** (§2.4, last columns).
* **It needs the Euler product.** ζ_W violates the analogue. Davenport–Heilbronn-type functions (Dirichlet series and
  functional equation, no Euler product, off-line zeros) violate it at their off-line zeros; the route 15/44
  certificates are Weil-negative. A proof must use that Λ is supported on prime powers with values log p, at the
  specific height γ₀.
* **Under RH and linear independence:** (★_min) holds with margin at least s(a); (★) holds with almost-periodic dips
  (Remark 3.3).
* **Each instance is a finite computation.** At fixed (δ₀, H, a), LHS is a finite sum and β is computable with
  interval arithmetic. Covering H ∈ [X, 2X] at the detection support takes about X·(log X)^{O(1/δ₀)} operations,
  using the margin s(a) and |dLHS/dH| ≤ 2a·T(a) (HEURISTIC). This is a prime-side verification of "no zero with offset
  ≥ δ₀ up to X", i.e. verified-height information, wall 3.
* **Function-field analogue (interpretation; route 27).** Over F_q, log H corresponds to 2g log q and N to qⁿ. The
  analogue of (★) at every angle and every support is |α| = √q for all Frobenius eigenvalues, i.e. the Weil bound.
  Weil proves it from the Hodge index theorem on C × C. Route 27 identifies the twin-ladder Weil form with minus the
  intersection form on primitive Frobenius-graph classes. Over Q the source would be a Hodge index theorem on the
  missing Spec Z × Spec Z (route 27 O3; sibling attempt `2026-11-01-arith-surface.md`).

---

## 4. The walls

1. **Flow-blindness (SL2): not blocked, and not passed.**
   * Inputs (I2)–(I7) are soft. All of them are satisfied by the RH-false counter-model ζ_W. Route 43 gives
     κ(QRH 7/8) = 9/32, i.e. the 7/8 half-plane is compatible with Λ up to 9/32.
   * The only content that could prove anything is (★_min). It is a statement about Λ(n) at height γ₀, and the
     backward heat flow does not act on it, because H_{−ε} has no Dirichlet series.
   * Its zero-side equivalent at a fixed node (δ, H) is flow-stable (Remark 3.3); only the whole family is
     flow-critical.
   * So the argument is not refuted by SL2, and it does not supply the arithmetic input SL2 requires: that input is
     (★_min) itself.
2. **NS-RIGID: not applicable as stated.**
   * The test functions are modulated at height γ₀ ≥ 3·10¹²; their nodes s₀ = 1/2 + δ + iH are complex and lie in the
     strip, not on the real native span s_i > 1.
   * Remark 3.3 identifies the large-support limit with Lagarias's ξ′/ξ at these complex nodes, the counterpart of
     NS-RIGID A1.
   * The same dichotomy holds: each node is soft, and the whole family is RH (Proposition 6, Corollary L).
   * The attempt lands on RES-T (B3) of the same module, with the optimal test function (Lemma 2) in place of RES-T's.
3. **Verified height: passed by construction, and re-entered.**
   * For every admissible (δ₀, γ₀) the needed support exceeds the crossover 2a = 7.051 (7.764 for RES-T).
   * The certified Weil positivity (I6) sits far below it (Table C).
   * Each instance of (★_min) is a finite computation, so finite ranges of (★_min) are verified-height statements
     (§3.5).
4. **Pointwise / MV-CAP: this is where the fixed-support form stops.**
   * (★_min) is a pointwise-in-height bound on a prime Dirichlet polynomial of length (c log γ₀)^{1/δ₀}.
   * Density and mean values bound only the measure of the failure set (Table 3; §3.4 (I5)).
   * The torus-uniform bound misses at every support (Table A).
   * The phase test shows that the inequality is not a generic-phase property.
5. **All-scale form: the audit's open task, not a fifth wall.** By Lemma L the all-support form of Step 5 is the V7
   floor of atlas §10, the "cofinal actual-form floor" of the atlas's closing line. By Corollary L it lies between two
   zero-free half-planes at every height (offsets θ < δ₀ and δ₀). No input gives a half-plane below 3/8 (0.37488665
   conditionally).

The global vortex trapping (= RH; vortex README) is not used.

## 5. What survives (byproducts)

* **B1 (PROVED, continuous model).** Lemma 2, with a new three-line time-domain proof (rank-two form; Galerkin check
  1.2·10⁻¹¹). The optimal two-point test function is e^{−iHu} sinh(δu), with the exact visibility law (D).
* **B2 (continuous model).** The verified-height crossover is 2a = 7.051, not 7.764, and the 7/8-visibility support
  at 3·10¹² is 2a = 8.767, not 9.651. These describe the test-function method, not ζ.
* **B3 (PROVED).** Lemmas 1, 3 and 4 and Proposition 5: a rigorous single-zero detection criterion under (Iso_D),
  with explicit thresholds (Table 1) and isolation radii (Table 5).
* **B4 (PROVED one direction; continuous model the other).** Proposition 6 and the dictionary β < 1/2 + 1/κ.
* **B5 (CERTIFIED-FLOAT).** The explicit formula for this family to 1.6·10⁻⁸ (72 cases), and independently to
  2.6·10⁻⁹ (§6 R3).
* **B6 (HEURISTIC).** Table 3, the moment reach.
* **B7 (new; PROVED, same-agent check only).** Lemma L and its converse, Lemma L² and Corollary L. A floor along a
  concentrated direction at one height, for all large supports, is equivalent to a zero-free half-plane at all
  heights. This is the analogue of the one-sided theorem of `03-landau.tex` (atlas §10), whose trial vector is the
  constant box at height 0, for every height and every sinh-shaped direction. It needs no real-axis input, and it
  adds the converse. Consequence for the programme: localising at the hypothetical zero does not help the all-scale
  route. The height-0 box, which keeps Λ(n) ≥ 0 and the Suzuki recurrence, is the better object for it.
* **B8 (new).** The minimal inequality (★_min) and Table A. The Euler-blind gap is smallest at the minimal detecting
  support and is never below 1 for δ₀ ≤ 1/2.
* **B9 (new; MEASURED identity, PROVED residue).** Remark 3.3: the large-support mean of the direction family is
  2 Re ξ′/ξ(s₀), Lagarias's quantity at a complex node. The Hadamard identity is checked to 4·10⁻⁹ with the actual
  zeros.
* **B10 (new; MEASURED).** The phase test: actual prime phases respect (★) at 106,000 sampled heights, while
  random phases exceed β at the Gaussian rate, with matching bulk statistics.
* **B11 (new).** Table B (localisation shortens the visibility scale from (2 log γ₀)/δ₀ to (1/δ₀) log(2δ₀ log γ₀)),
  Table B′ (density reach W*, HEURISTIC) and Table C (fixed-support reach).

## 6. Referee pass

This is a same-agent adversarial pass with independent code paths. It is **not** a fresh independent referee.

**Checks run** (`referee.json`, `landau.json`):

| Check | What | Result |
|---|---|---|
| R1 | Lemma 1: Φ by direct quadrature (real, complex and matched x); g₀ by direct convolution quadrature | max error 6.2·10⁻¹⁶ |
| C0 | ĝ = −Φ² against the 12:55 library's F(z) conj F(z̄) | 1.1·10⁻¹³ |
| R2 | Lemma 2 by a Legendre–Galerkin basis (time-domain rank-two form) | λ_min matches Ω + 2a − sinh(2aδ)/δ to 1.2·10⁻¹¹; signs agree at ±2% of onset in 5/5 cases |
| R3 | Explicit formula, independent implementation (trial-division primes, Simpson for A, GL panels for P) | relative residuals 1.9·10⁻⁹ and 2.6·10⁻⁹ |
| C1, C2 | Lemma L kernels by quadrature, including complex and matched x | 1.1·10⁻¹⁹ and 2.6·10⁻¹⁸ |
| residues | real-pole residues −1/(4q*²) | −0.694444 / −2.77770 / −0.640000 against −0.694444 / −2.77778 / −0.640000 |
| FE | Y(δ) + Y(−δ) = 0 | 3.9·10⁻³¹ |
| L3 | Hadamard sum = 2 Re ξ′/ξ(s₀) with the actual zeros | ≤ 3.8·10⁻⁹ relative |
| R4 | Landau transport on a synthetic zero set: one off-line pair at a **different** ordinate (γ₁ − H = 7 or 40, offset 0.25 or 0.3) | U(W) < 0 from W = 28.2 / 32.6; U/e^{(δ+θ*)W} unboundedly negative for θ* = 0, 0.1, 0.2 < offset (minimum −1.4·10¹³ at θ* = 0). The floor at height H fails although the zero is not at H, at the scale W ≈ [2 log\|γ₁ − H\| + log(Ω/4δ)]/offset (23 and 31 predicted, 28 and 33 observed). |
| R5 | Lemma 3 majorant on dense grids | max \|Φ\|²/majorant = 0.90 |
| T(a) | PNT main term against exact prime-power sums | 0.02–0.46% |

**Error found and corrected in this pass.** The first R3 run gave relative residuals 1.4·10⁻⁴ and 1.8·10⁻³. Each was
exactly the size of the pole term P. The cause was mpmath's tanh-sinh quadrature applied to F(±i/2), whose integrand
has about 10⁴ oscillations on [−a, a]; it overstated |P| by a factor of about 10⁴ (3.3·10⁻³ against 2.1·10⁻⁷). With
dense Gauss–Legendre panels the residuals are 1.9·10⁻⁹ and 2.6·10⁻⁹. The bad value is kept in `referee.json` as
`poles_first_run_mpquad_unreliable`. The argument and the 12:55 data were not affected: the 12:55 library uses the
closed form, which R1 confirms.

**Gap found and closed in this pass (Lemma L proof).** The first write-up of steps (ii) and (iii) said that a pole
δ + θ + i(γ − H) can be cancelled only by zeros at the same ordinate γ. That is incomplete. Through the branch −ix_ρ,
a zero at ordinate 2H − γ also produces a pole at the same point. The proof now uses the residue formula
M₂/(2(q₀² − δ²)) − (M₁ + M₃)/(4q₀²). It cannot vanish when q₀² is not real, i.e. off the real axis. On the real
axis, maximality of the offset at ordinate H is used, counting partners through both branches. The conclusion of
Lemma L is unchanged.

**Adversarial questions and answers.**

1. *Is (★_min) really weaker than (★)?* Yes: (★_min) − (★) = s(a) > 0 on the right side. It changes no conclusion,
   because by Lemma A the best support for the torus comparison is still a_ideal.
2. *Does Lemma L need H ≠ 0 or "no real zeros"?* No. Real poles of K[Y] come only from zeros of ordinate exactly H,
   and their residues are negative (step (iii)). For H = 0 this also excludes real zeros.
3. *Does Lemma L assume RH anywhere?* No. The Hadamard expansion, the absolute convergence for Re q > δ + 1/2 and
   Landau's lemma are unconditional. The converse uses only the zero counting function.
4. *Is Corollary L(i) circular?* No. It is an implication from a prime-side hypothesis to a half-plane. Its point is
   that the hypothesis is not local.
5. *Could a cluster hide ρ₀ at all supports?* Not in the all-support form, since Lemma L needs no isolation. At fixed
   support, Gap G1 remains open and does not affect the verdict.
6. *Does the phase test prove anything about ζ?* No. It shows that the truth of (★) is not a property of generic
   phase vectors, so no Euler-blind or random-model argument can supply it. The 3·10¹² exceedance counts are a
   Gaussian extrapolation (HEURISTIC).
7. *Is the continuous-model identity β + s = m exact?* Inside the model, yes. The rigorous version uses the
   majorants, and its gap is larger (Table A, last column).
8. *Are the Xu–Sang/PR 14 and QRH inputs used beyond their status?* No. Both appear only as θ values, labelled
   CONDITIONAL or unrefereed, and neither changes the verdict.

## 7. What would be needed

One of the following two, which are the two forms of Step 5.

1. **Pointwise.** At every height H ≥ 3·10¹², a bound

       Σ_{n ≤ (c log H)^κ} Λ(n) n^{-1/2} w(log n) cos(H log n)  <  β(H) + s,    κ > 8/3,

   i.e. cancellation beyond the Kronecker-torus bound by a factor ≍ (log H)^{κ/2 − 1}, using the Euler product
   (counter-model, Davenport–Heilbronn and the phase test show that zero-side, mean-value, Euler-blind and random-phase
   inputs cannot give it). κ slightly above 8/3 would improve on 7/8; κ → ∞ is RH. Over F_q the inequality comes from
   Hodge index on C × C. No corresponding source over Q is known.
2. **All-scale.** A floor U(W) ≥ −C(1+W)^m e^{(δ+θ)W} along any one concentrated direction, at any one height, with
   θ < 3/8. By Lemma L this is a new zero-free half-plane. Its natural home is the height-0 box of V7 and Suzuki,
   whose open part is the lower bound for the signed credit sum G_N (Suzuki recurrence module), or the PR 14 energy
   bound (Lemma L²).

This is the atlas's closing requirement — "a genuine all-scale signed arithmetic estimate, a cofinal actual-form floor,
or an exhaustive theta boundary/collision certificate" — restated for this attempt. The attempt supplies none of them.

## 8. Reproduction

    .venv-arb/bin/python -I tmp/rha-contradiction-explicit.py 100000000   # ~2 min; validation with zeros 1..1e6 (tmp/routes-b5-r16-out/zeros.npy)
    .venv-arb/bin/python -I tmp/rha-contradiction-thresholds.py            # ~2 s; Tables 1-3
    .venv-arb/bin/python -I tmp/rha-contradiction-checks.py                # ~2 s; Lemma 2 brute force, matched filter, Table 5, Gap G1
    .venv-arb/bin/python -I tmp/rha-contradiction-landau.py                # ~2 s; Lemma L kernels, residues, FE, Remark 3.3
    .venv-arb/bin/python -I tmp/rha-contradiction-minimal.py               # ~20 s; Tables A, B, B', C
    .venv-arb/bin/python -I tmp/rha-contradiction-phase-test.py A          # ~15 s; phase test A (+ heuristic counts)
    .venv-arb/bin/python -I tmp/rha-contradiction-phase-test.py B          # ~10 s; phase test B
    .venv-arb/bin/python -I tmp/rha-contradiction-referee.py               # ~5 s; Section 6 (R1-R5)

The bisection in `-checks.py` emits a harmless overflow RuntimeWarning from its bracket a = 400.

## References

* A. Weil, Sur les "formules explicites" de la théorie des nombres premiers (1952).
* E. Landau, real-boundary singularity of Laplace transforms of non-negative functions; written out in
  `03-landau.tex`, Lemma 3.1.
* J. C. Lagarias, On a positivity property of the Riemann ξ-function, Acta Arith. 89 (1999) [L].
* B. Bagchi, Recurrence in topological dynamics and the Riemann hypothesis, Acta Math. Hungar. 50 (1987) [L].
* D. Platt, T. Trudgian, Bull. LMS 53 (2021).
* T. Trudgian, J. Number Theory 134 (2014).
* L. Guth, J. Maynard, arXiv:2405.20552.
* H. L. Montgomery, R. C. Vaughan, J. London Math. Soc. (2) 8 (1974).
* K. Ford, Proc. LMS 85 (2002) (explicit Vinogradov–Korobov constant, as quoted).
* H. Davenport, H. Heilbronn (1936).
* Y. Xu, H. Sang, arXiv:2610.15291v2 (unrefereed; CONDITIONAL use only).
* openai/math family 003 (7/8, unrefereed).

Project records:

* Route atlas and modules of PR #27: `/tmp/atlas-snap-*.md`; `refs/pr/27:research/rh/foundation/source/03-landau.tex`.
* PR 14: `refs/pr/14:rigorous/mobius_bridge_reduction/`.
* Wall modules and sibling attempts, cited inline.
