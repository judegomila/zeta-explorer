# Direct RH attempts, 2026-11-01: synthesis

Internal working note. Not externally refereed, not committed upstream. Data module:
`src/data/rh-direct-attempts-2026-11-01.js` (`RH_DIRECT_ATTEMPTS_ASSERTIONS`).

**Verdict.** Five complete written attempts at RH were made and each was attacked by a fresh-context referee. All five
fail. No argument survived, so none needed a second referee and none is reported as a candidate. RH is open,
Platt–Trudgian Λ ≤ 0.2 stands, no Λ bound and no zero-free region changes. NO QED.

## 0. Was the PR #27 audit read?

Yes. The audit (PR #27: route atlas §§1–12 with its closing line, PUBLICATION_SCOPE_2026-10-30, and the module notes on
the arithmetic foundation, spectral head, signed complement, whole-even certificate, spectral-denominator repair and the
three Suzuki / prime-memory notes) was read before each final write-up. The `/tmp/atlas-snap-*.md` snapshots were checked
byte-identical to `refs/pr/27` (SHA-256). PR #14 (README, SIGNED_PHASE_FILTER) and `03-landau.tex` (V7) were read too.

What happened in order:

* All five first drafts (12:48–13:22) were written **before** the audit snapshots existed (13:40) and did not cite it.
  The first operator draft repeated a route the atlas already records as failed (§2: "passive finite products ... do not
  supply this").
* All five were rewritten after reading the audit. Each final file has an atlas-overlap table that cites the section for
  every overlap and states what is different. Pre-audit drafts are kept in `tmp/`.
* The referees checked the citations and found them accurate, with two wording corrections: the contradiction attempt's
  Suzuki row writes "⟺" where the module states only an implication, and the operator attempt did not credit the
  Suzuki-recurrence §4 / prime-memory "signed prime-credit prefix" as the same object as its t = 0 endpoint.

Final files (all cite atlas sections and PR #27):

| attempt | file | lines |
|---|---|---|
| W100 window certificate | `2026-11-01-window-100.md` | 1132 |
| QRH bootstrap | `2026-11-01-bootstrap-qrh.md` | 717 |
| arithmetic surface | `2026-11-01-arith-surface.md` | 996 |
| contradiction from one off-line zero | `2026-11-01-contradiction.md` | 997 |
| Euler-product operator | `2026-11-01-operator.md` | 597 |

## 1. The five attempts

### 1.1 W100: Alpöge–Furman window certificate pushed to every window

* **Claim.** The lossless form of the AF certificate (window inertia N_θ(G_J) ≥ N(Z_c)) applied to every window gives
  RH ∧ SZC.
* **Failing step (referee).** Line 5.3, Proposition 5′: no input bounds the zeros just outside each window well enough to
  give the margin θ_J ≥ ‖E‖ that Corollary 1 needs. QRH 7/8, PR #14/Xu–Sang 0.87488665 (conditional) and fixed-p V7
  floors are half-plane statements, so an off-line pair of any allowed depth can sit at the edge. Referee re-test with
  Odlyzko zeros: at T = 2·10⁴ to 5·10⁵ the adversarial edge term exceeds λ_N(G_true) by factors 44–306 at QRH depth;
  the depth threshold is 0.09–0.17. PR #14 changes those ratios by 0.2–0.3%. Line 6.1 (local Weil inertia at support
  B_J log T at every height) is a second, strictly stronger stop.
* **Reduces to.** 5.3: a box hypothesis |β − ½| ≤ O(log log T / log T) next to every window (MV-CAP wall; atlas §5).
  6.1: RES-T (B3) above T_X, i.e. atlas §9's missing signed all-support lower bound in counting form; by Proposition R it
  contains RH ∧ SZC. The RH-only rescue (Theorem L) is the V7 floor at p = 0 (atlas §10).
* **Salvage.** Lemma 1 / Corollary 1 (exact inertia criterion, a verification tool at cost ≍ T^B per window);
  Proposition R (open, zero-side-sound window certificates certify RH ∧ SZC and never RH alone); Proposition S (over
  F_q, inertia fails when Frobenius eigenvalues repeat: Hodge index gives positivity, not inertia); Lemma 4′ / Theorem L.
* **Referee corrections.** E1 needs T₀ ≤ 3·10¹²; Littlewood's unconditional gap bound is 1/log log log T; minor
  omissions in Prop R step 5 and D_out. None reverses the verdict.

### 1.2 Bootstrapping the quasi-Riemann half-plane

* **Claim.** If the family has no zeros in Re s > θ, then none in Re s > θ − δ(θ); iterate to ½.
* **Failing step (referee).** First unproved step in order: Step I.3 applies OAI-7/8 Lemma 18.1 at κ = 2θ − 1 < 3/4,
  outside its stated range 3/4 ≤ κ ≤ 1 (paper.txt l.9354; proof uses 6κ − 1 ≥ 7/2). With κ floored at 3/4 the negative
  result gets stronger. First false claim: Lemma II.4 (graded EXACT) fails for density exponent A > 2. Counterexample
  A = 12/5, θ = 0.95: θ′ = 0.926136 < σ_A = 1 − 1/(6A) = 0.930556. Its conclusion θ′ ≥ σ_A survives with a corrected
  proof. Terminal lines confirmed: I.6, I′.3, II.3 (inequality (**) at V ≍ 1), III.4.
* **Reduces to.** Theorem S: a capacity-form bootstrap stops at its self-consistent point. Xu–Sang stopping point in
  (0.874886646840, 0.874886649040), contraction 0.00302 per step; binding rows have zeros at real part ≈ 0.69–0.76, which
  no half-plane input reaches (MV-CAP family-to-single passage). The Möbius route needs a twisted mean square that at
  V ≍ 1 is the conclusion. The Landau levers (V7 floor, discrepancy, energy, Suzuki reserve, Type II) are each at least
  as strong as the improved half-plane (Corollary III.5).
* **Salvage.** Theorem S; Lemma I.4 (zero-blind floor 13/15); Xu–Sang bracket (lower end exact on PR #14's encoding;
  stage 3 at 0.8748866471489, 2.85e-9 below PR #14, conditional on Xu–Sang lemmas at κ ≈ 0.74977, outside PR #14's
  admitted range); Lemma II.7 (sextic filters keep every global sixth power at eigenvalue one); Theorem III.1
  (α₊ = α₋ = Θ − ½).

### 1.3 Arithmetic surface ("Spec Z × Spec Z") and two Hodge-index arguments

* **Claim.** A pairing on graph classes built from prime atoms represents the Weil form exactly; prove Hodge index by a
  Riemann–Roch argument (I) or by a finite-support head/complement argument (II).
* **Failing step (referee).** Argument I, Theorem 5.1 Step 2 ((R2) at L = nD, D primitive) is RH itself, and Theorem 6.2
  shows no Riemann–Roch datum exists on S_Q, whether or not RH holds. Argument II, Theorem 7.2 hypothesis (B) (complement
  floor) is RH given the atlas head theorem T1; on the box vector it is Suzuki's criterion D(W) ≤ C(1+W)^m. First false
  claimed result: Proposition 8.1's headline (sign-only certificates work "exactly on λ ≤ √2"). The norm test dies at √2,
  but a weighted Schur/Zariski test reaches λ ≈ 1.43 (Ritz values +1.17e-3 even at 1.42; −0.058 odd at 1.45), and A_λ is
  already indefinite at λ ≈ 1.5 odd / 1.55 even, not 1.6.
* **Reduces to.** RH: the one-sided Landau bound on the box vector, the atlas's "cofinal actual-form floor" (spectral-head
  §8, signed-complement remaining task, Suzuki-recurrence §4).
* **Salvage.** Theorem 2.1 / Lemma 2.2 (pairing = atlas actual form q_λ, confirmed to ≤ 2.6e-13); Corollary 2.3;
  Proposition 4.2 (function-field fakes satisfy the soft axioms and fail Hodge index); Theorem 6.2; Lemma 7.1 (head = window
  traces of Tate principal classes); Proposition 9.2 (Ψ(W) = −½P(B_W)², box defect exponent Θ − ½). Theorem 3.4 is true
  but subsumed by Faltings–Hriljac / Moriwaki.

### 1.4 Contradiction from a single off-line zero

* **Claim.** Assume ρ₀ = ½ + δ₀ + iγ₀, 0 < δ₀ ≤ 3/8; with the optimal test function e^{−iγ₀u} sinh(δ₀u) and rigorous
  zero-side majorants, one prime-side inequality (★_min) gives a contradiction.
* **Failing step (referee).** Step 5: (★_min)_a, a bound at the single height γ₀ on a von Mangoldt polynomial of length
  (c log γ₀)^{1/δ₀}, is not proved. In the fixed-support chain the isolation hypothesis (Iso_D) of Proposition 5 is also
  unproved and comes first. Torus bound gap at γ₀ = 3·10¹² is 3.03 (δ₀ = 3/8) to 2966 (δ₀ = 0.1), recomputed. The
  Davenport–Heilbronn twin violates the analogue of (★_min) (W/(2m²) ≈ −0.76 to −0.99 for 2a = 6..12), so any proof must
  use the Euler product at height γ₀.
* **Reduces to.** Fixed support: RES-T (B3), the pointwise/MV-CAP wall, atlas §9. All supports: by Lemma L (re-derived
  in both directions by the referee) the V7 floor of atlas §10, i.e. a half-plane at θ < δ₀; over all δ₀ this is RH.
* **Salvage.** Lemma 2 (exact visibility law: negative direction iff sinh(2aδ)/δ − 2a > Ω); Lemmas 3–4 and Proposition 5
  under (Iso_D); Lemma L as a one-height RH equivalence (standard Landau mechanism on a matched sinh direction).
* **Referee corrections.** Proposition 5's error term is too crude as written but the true size (≈ 0.4) is negligible;
  the all-support (★_min) needs δ̄ = θ; the 106,000-height phase test is forced by Platt–Trudgian and is not evidence
  about provability.

### 1.5 Operator built from the finite Euler product

* **Claim.** The self-adjoint multiplier M_X with symbol σ_X = 2∂_σ log|ξ_X| + 2Re[X^{1/2+it}/(1/2+it)] compresses to the
  atlas actual Weil operator H_λ; prove the floor ε₀(λ) ≥ −C(log λ)^m from the symbol.
* **Failing step (referee).** Step 4 (4b): a pointwise bound on the large-prime part of the symbol for every |t| ≤ t*(X).
  The inference from a mean-square bound is invalid (MV-CAP). At t = 0 the step is RH (Theorem E). The referee went
  further: by the moment method at heights e^{X^c}, the large-prime polynomial has excursions of order X^{c/2}(log X)^{1/2},
  so (4b) is **false** for large X with or without RH (argued, not written out in full; Gaussian moment premise checked at
  X = 10⁴ to 3.2%).
* **Reduces to.** Σ_{n≤X} Λ(n) n^{−1/2} ≤ 2√X + C(log X)^m, equivalent to RH by Landau's lemma: the arithmetic-foundation
  §2 one-sided target at α = 0, the Suzuki §4 signed credit prefix, the first open item of the atlas closing line.
* **Salvage.** Theorems A, B (σ_X = Z_X − T_X + τ_X, checked against 2,001,052 zeros to 5.2e-5), C, D (given T1), E, F;
  any proof must keep α(t) coupled to all the primes, since the split (4a)+(4b) cannot work.
* **Referee corrections.** Theorem E(ii) constant is −1, not −2; B1's power growth holds along a sequence of X.

## 2. What the five failures have in common

1. **Every attempt reduces to the same short list**, none of which is new:
   * the one-sided Landau / V7 floor at p = 0 (W100 rescue, arith-surface II, contradiction all-support, operator t = 0,
     bootstrap Corollary III.5);
   * a pointwise Euler-product bound at a single height (W100 6.1, contradiction fixed support, operator 4b);
   * an object that does not exist on Q (arith-surface I: no Riemann–Roch datum on S_Q, Theorem 6.2).
2. **The Davenport–Heilbronn test bites in three attempts** (W100, contradiction, operator): the needed inequality is false
   for a function with the same functional equation and no Euler product, so the Euler product must be used pointwise.
   None of the attempts found an identity that does this.
3. **Half-plane levers do not help.** QRH 7/8 and PR #14/Xu–Sang enter only as half-planes. Xu–Sang's bootstrap
   self-limits at 0.874886647 (Theorem S), and its edge effect in W100 is 0.2–0.3%.
4. **New structural facts** (all same-model, referee-checked where stated): Proposition R and S (W100), Theorem S
   (bootstrap), Theorem 6.2 and the corrected Proposition 8.1 (arith-surface), Lemma L (contradiction), the referee's
   falsity of the split (4a)+(4b) (operator).

These match the atlas closing line: the open task is "a genuine all-scale signed arithmetic estimate, a cofinal actual-form
floor, or an exhaustive theta boundary/collision certificate". No attempt supplied any of the three.

## 3. Next five attempts

Each is chosen to avoid the specific failure found today. None has been run; all are proposals.

1. **Harmonic coupled floor for the compressed operator.** Since ζ_X is entire and zero-free, log|ξ_X| minus the Γ part is
   harmonic in the whole plane. Prove the floor of the *compression* of M_X (not the pointwise symbol) using Poisson /
   Harnack control of ∂_σ log|ζ_X| across a strip of width ≍ 1/log X, which matches the frequency resolution of support
   log X. *Avoids:* the operator split (4a)+(4b), which the referee showed false; keeps α(t) coupled to all primes; does
   not read a negative symbol value as a negative form (atlas §9). *Expected stop:* the Poisson boundary data at
   σ = ½ + η is a zero-free-strip statement; test against DH and the F₅ fake first.
2. **Stepanov-type auxiliary Dirichlet polynomial for the one-sided Chebyshev bound.** Stepanov's method proves the
   one-sided bound N ≤ q + O(g√q) for curves using only dimension counts of polynomial spaces, no Hodge index. Build an
   auxiliary Dirichlet polynomial vanishing to high order at prime powers up to X and derive
   Σ_{n≤X} Λ(n) n^{−1/2} ≤ 2√X + C(log X)^m, which is RH by Landau (Theorem E). *Avoids:* arith-surface Theorem 6.2 (no
   Riemann–Roch datum on S_Q needed) and Proposition S (targets a one-sided count, not inertia). *Expected stop:* the
   Frobenius substitution x ↦ x^q that makes the auxiliary polynomial vanish at all rational points has no known analogue
   on Q; also the sieve parity barrier for one-sided prime bounds. Check against atlas §7 (prime-coefficient rigidity).
3. **Density-state bootstrap.** Replace the scalar capacity κ by the full density profile A(σ) as the iterated state, and
   feed it into the central bins (real parts 0.69–0.76) that bind the openai/math Part II and Xu–Sang architectures.
   *Avoids:* Theorem S, which applies only when the input enters through one monotone scalar; the corrected Lemma II.4
   (θ′ ≥ σ_A) applies to the Möbius route, not to the central-bin row counts. *Expected stop:* a fixed point of the profile
   map above ½; the restricted fourth moment U^{39/40+ε} that PR #14's target needs.
4. **Arithmetic-surface tower with Faltings–Hriljac positivity.** Instead of the non-existent S_Q, approximate Weil-form
   graph classes by Hecke-correspondence divisors on genuine arithmetic surfaces (X₀(N) × X₀(N) or products of modular
   curves), where the arithmetic Hodge index theorem is proved, and pass to a limit. *Avoids:* Theorem 6.2 (Riemann–Roch
   exists on each finite level) and Proposition S (uses positivity only, not inertia). *Expected stop:* representability
   and convergence of the archimedean Green's-function terms as N → ∞ (route 27 obstruction O3; atlas §11 coupled-field
   door).
5. **Zero-induced phase alignment.** From a hypothetical zero ρ₀ off the line, use the Euler product (not only the
   approximate functional equation) to force alignment of the phases γ₀ log p at short lengths, and contradict Lemma 2's
   visibility law at a support where the needed bound is provable. *Avoids:* the contradiction attempt's unproved (★_min),
   which asks for non-alignment at length (c log γ₀)^{1/δ₀} without using ρ₀; uses the Euler product at height γ₀, which
   the DH test requires. *Expected stop:* DH has a zero there and satisfies its own approximate functional equation, so
   the argument must use multiplicativity beyond it; Selberg's log-ζ approximation fails near a zero.

## 4. Status

RH open. NO QED. Platt–Trudgian Λ ≤ 0.2 stands. No new zero-free region and no Λ bound. All new results are same-model
checks (author plus one fresh-context referee per attempt) and need external review before any use.
