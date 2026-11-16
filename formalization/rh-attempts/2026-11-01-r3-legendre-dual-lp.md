# RH attempt R3, 1 November 2026: dual rigidity of the Legendre LP

**Outcome: the attempt fails. No proof of RH. NO QED.**

**Goal.** Prove RH by proving the dual-rigidity bound

  (DR)  every dual-feasible point of the Legendre LP at x has objective ≤ C√x (log x)^A, for all x ≥ x₀.

By LP duality (DR) is Claim 5C of round 2 (Stepanov Branch C): ν₁(x) ≤ C√x(log x)^A. By round-2 Proposition 6.2,
Lemma 1.2 and Theorem 1.1 it implies ψ(x) ≤ x + C√x(log x)^{A+1}, hence RH. In the language of the brief: bound
ψ_b(x) − (density)·x by √x·polylog for **every** nonnegative pseudo-prime system b that respects the ⌊x/k⌋ sawtooth
constraints, using no sieve majorant.

**What the attempt establishes.**

1. **The decisive test fails to kill the route: a planted off-line zero cannot be carried.** A planted term at
   ρ₀ = β₀ + iγ₀ shows up in the sawtooth (Chebyshev) data with the factor ζ(ρ₀) (Lemma 2.1).
   * Theorem PZ: for fixed ρ₀ with ζ(ρ₀) ≠ 0 and every plant on [T₀, x], √x ≤ T₀ ≤ x^{1−η}, the plant changes the dual
     objective by O(κ(ρ₀)/|ζ(ρ₀)| + κ(ρ₀)) for x ≥ x₀(ρ₀, η), with κ explicit. That is bounded in x, while the
     unsuppressed planted term grows like x^{β₀}/|ρ₀|. The explicit onset x₀ is very large. PROVED.
   * Theorem RIG (continuum form): a nonnegative system whose sawtooth data are smooth up to O(y^ε) at every real scale
     has pseudo-prime Dirichlet series B(s) = s·[a/(s−1)² + c/(s−1) + R̂(s)]/ζ(s), R̂ holomorphic in Re s > 0. Its
     poles off s = 1 are zeros of ζ. PROVED.
   * Measured (LP with the plant direction free, x = 10⁵, 10⁶, 10⁷): fake-zero gains are 0.02–2.8 and stay ≤ 1.0 at
     10⁶–10⁷. Four of five rows are flat or falling; one (0.6 + 30i) rises from 0.56 to 0.99. Over 10⁶ → 10⁷ the
     unsuppressed size x^{β₀}/|ρ₀| grows by factors of 3.6–7.9.
2. **But the suppressing mechanism is ζ itself.** The dual carries exactly the zeros of ζ (Theorem RIG). A bound for
   every dual point is therefore a bound in terms of the zeros of ζ, and the push to (DR) reaches the following:
   * **Theorem S (exponent sandwich), PROVED.** With Θ := sup Re ρ and ν* := limsup log ν₁(x)/log x,
     Θ ≤ ν* ≤ 1/(2 − Θ). Under RH, 1/2 ≤ ν* ≤ 2/3. Unconditionally ν₁(x) ≪ x·exp(−c√(log x)). This improves round 2's
     ν₁ ≤ (6/π² + o(1))x, but only to PNT strength.
   * **Theorem E (sign-blind barrier), PROVED lower bound + MEASURED equality.** The minimal ℓ¹ norm of an *exact*
     certificate (the dual without y ≥ 0) is at least Σ_{k≤s} μ(k)² + Σ_{M≤mmax} |Mert(x/M) − Mert(x/(M+1))|. At
     x = 10⁴, 3·10⁴, 10⁵, 3·10⁵ and 10⁶ it equals this sum to 10⁻¹² relative, with u = v = 0 at the optimum. So any argument that
     does not use positivity y ≥ 0 must control the Mertens function on the hyperbolic tiling of (√x, x].
3. **The failing line is Step 7 (Section 3):** the tail claim |Σ_{k>√x} μ(k)e_k − u·m(x) − v(β(x)+1)| ≪ √x(log x)^A
   for every dual point.
   * At the true-prime dual point it is equivalent to RH in the form ψ(x) − x ≪ √x·polylog (Proposition 4.1).
   * Without positivity it needs the hypothesis (HM) of Section 4.3, a Mertens-type statement on the tiling. (HM)
     implies RH and is not known to follow from RH.
   * Positivity is what keeps ν₁ near √x numerically: the valid LP is 3.3–4.3× below the exact one. No argument
     converts positivity into the bound; Section 4.4 records what positivity provably gives (a ratchet and a staircase
     cone) and why that is not enough.
4. **Numerical lead (round 2, "ν₁ ≈ (1.01 ± 0.03)√x") at larger x.** ν₁(x)/√x = 1.0360 (10⁶), 1.0455 (3·10⁶),
   1.0881 (10⁷); scans in Section 5. Reproduced where round 2 computed: 320.5114484 (10⁵) and 1035.9895 (10⁶), agreeing to 9 digits.
   Scan means: 1.013 (x ≤ 2·10⁵, n = 72), 1.057 (x ≈ 10⁶, n = 24), 1.093 (x ≈ 10⁷, n = 8). The ratio drifts slowly
   upward, and on 10⁴–1.5·10⁷ the data cannot distinguish polylog growth from a small power.

RH is open. PT Λ ≤ 0.2 stands. No zero-free region, Λ bound or V7 floor exponent changes.

**Grades.**
* **PROVED**: complete argument written here, checked by its author only.
* **PROVED-A**: proved from results recorded as accepted by the audit or by rounds 1–2, each cited.
* **STANDARD**: classical, cited from memory, not re-verified here.
* **MEASURED**: IEEE double precision, scipy/HiGHS LP; not interval arithmetic. LP values are reported with the
  solver's feasibility tolerance, about 1e-7 relative. The rescaled dual points are strictly feasible in floating point
  (column "lower bound" in Section 5).
* **ARGUED**: standard mechanism, not written out in full.
* **HEURISTIC**.

**Review status.** This file is written and self-attacked by one context (Section 8). The new theorems (PZ, RIG, S, E
and Lemmas 1.3–1.5, 2.1) have **not** been seen by a fresh referee. No argument survived, so no candidate goes to a
second referee.

**Files** (all in `tmp/`, outputs in `tmp/rha-legendre-dual-lp-out/`).
* `rha-legendre-dual-lp-lib.py`: reduced dual in block-mass form, with cutting planes over all k ≤ x.
* `rha-legendre-dual-lp-check.py`: reduced dual against the full primal LP; agreement ≤ 1e-11 at x ≤ 10⁴.
* `rha-legendre-dual-lp-structure.py`: structure of the optimal dual (density, discrepancy, head/tail).
* `rha-legendre-dual-lp-compact.py`: compact cumulative form, about 7x^{3/4} nonzeros; used for x ≥ 10⁶.
* `rha-legendre-dual-lp-plant.py`: the decisive planted-zero LP test.
* `rha-legendre-dual-lp-signfree.py`: valid against exact certificates (Theorem E).
* `rha-legendre-dual-lp-checks.py`: plant expansion, PZ constants, tail inequality, a priori bounds.
* `rha-legendre-dual-lp-scan.py`: ν₁ scans near 10⁶ and 10⁷.
* `rha-legendre-dual-lp-regress.py`: pooled regression of ν₁/√x (round-2 scans plus this round's).
* `rha-legendre-dual-lp-decomp.py`: head/tail/normalization split of the optimum (Lemma 1.3).
* `rha-legendre-dual-lp-thmE.py`: explicit sign-free dual point of Theorem E(i), checked at every k ≤ x.
* `rha-legendre-dual-lp-check1e7.py`: Lemmas 1.3–1.5 at the x = 10⁷ optimum.
* `rha-legendre-dual-lp-tiling.py`: Mertens tiling sums Σ_M |ΔMert'_M| and Σ_M W_M up to 3·10⁷.
* `rha-legendre-dual-lp-fill5.py`, `rha-legendre-dual-lp-final-edits.py`: assembled §5 of this file from the logs.
* `rha-legendre-dual-lp-run.py`, `rha-legendre-dual-lp-debug.py`: timing at 10⁶, cutting-plane diagnosis.

---

## 0. Relation to the audit (PR #27) and to rounds 1–2

### 0.1 What governs this attempt

* **Atlas closing line.** The open task is "a genuine all-scale signed arithmetic estimate, a cofinal actual-form
  floor, or an exhaustive theta boundary/collision certificate". (DR) is an instance of the first item. The failing
  Step 7 is a signed all-scale estimate: the Möbius-weighted sawtooth over the hyperbolic tiling.
* **Atlas §9 (fixed-support positivity, null-symbol duals).** "This is completeness, not an effective all-support
  construction." The same split appears here.
  * LP duality is exact (Lemma 1.1): (DR) holds if and only if a primal certificate of ℓ¹ norm ≪ √x·polylog exists
    for every x.
  * Existence of the dual optimum is not a construction.
  * §9's caution, "negative lower surrogates are not negative actual forms", has a mirror here: a large *sign-free*
    dual value (Theorem E) is not a large *valid* dual value. Section 4.3 keeps the two apart.
* **Atlas §10 (V7 floor).** ε₀(λ) ≥ −C(1+log λ)^m λ^p with p < 1 gives no zeros in Re s > (1+p)/2.
  * (DR) gives the p = 0 floor in first-moment form, as in round-1 operator Theorem E.
  * Theorem S transfers exponents with a loss: a zero-free half-plane Re s > Θ yields only ν₁ ≪ x^{1/(2−Θ)+ε}.
  * PR #14 / Xu–Sang (B = 0.87488665, conditional) and the openai/math 7/8 half-plane enter only through Θ. In
    Theorem S, Θ = 7/8 gives ν* ≤ 8/9 and Θ = B gives ν* ≤ 0.8888...; neither is a lever.
* **Atlas §11.** "A uniform strictly positive scalar margin is not the right RH target." (DR) claims no margin. It
  allows +C√x(log x)^A, and under RH the true-prime point has objective (ψ(x)−x)/K of both signs.
* **Atlas §7 (finite-prime rigidity).** Theorem PZ is a planted-perturbation rigidity, but by a different mechanism.
  §7 changes finitely many prime coefficients and forces a negative finite matrix. Here an infinite planted term is
  suppressed by the value ζ(ρ₀), read off the sawtooth data through Mellin inversion against the fixed integers.
* **Arithmetic foundation §2.** One-sided Landau continuation; (DR) ⟹ RH goes through it.
* **Arithmetic foundation §4.** "Better lattice quadrature does not establish the remaining arithmetic cancellation."
  Theorem E is a quantitative version for this LP: dropping the sign constraint leaves exactly the Mertens tiling sum.

### 0.2 Round-1 and round-2 inputs used

* **Round-2 Stepanov** (`2026-11-01-r2-stepanov.md`).
  * The primal and dual (§6.3).
  * Proposition 6.2: ψ(x) ≤ x + ‖c‖₁K(x) and ν₁ ≥ (ψ(x) − x)₊/K(x).
  * Proposition 6.3: the rescaled primes are dual-feasible.
  * Proposition 6.4: forced Möbius head.
  * Proposition 6.6: exponent transfer Θ ≤ ν*.
  * Proposition 6.8: the sawtooth vanishes in F_q[t].
  * The referee measurement ν₁(x) = (1.01 ± 0.03)√x on 8·10³ ≤ x ≤ 10⁶.
* **Round-2 synthesis §4 item 1** (this assignment): "plant-a-zero test ... if it is feasible at x ≤ 10⁶, the route is
  dead. Expected stop: the dual extreme points are the Mertens / pointwise wall in x-space."
* **Round-2 phase alignment, Theorem MT.** On the torus the Euler product alone puts no constraint on short-length
  phases: a multiplicative twin can carry a planted zero. The contrast is the point of Section 2. In the Legendre LP
  the integers are fixed by the floor function, so ζ itself is fixed, and a planted zero costs |ζ(ρ₀)|.
* **Rounds 1–2 terminal objects.** Every earlier failure landed on the one-sided Landau bound or on the pointwise
  wall. Step 7 lands on both: Proposition 4.1 (Landau at b = Λ) and Theorem E (pointwise on the tiling).

### 0.3 Overlap table

| Ingredient | Overlap | What is different |
|---|---|---|
| Target (DR) = Claim 5C ⟹ RH | round-2 Prop. 6.2; arithmetic foundation §2; NS-RIGID candidate (c) | Same target. Here it is attacked through the dual, with the plant-a-zero test first. |
| Dual LP, rescaled primes feasible | round-2 §6.3, Prop. 6.3 | New: pseudo-prime form with scale invariance (Lemma 1.1); Möbius identity for every dual point (Lemma 1.3); range structure and a priori bounds (Lemmas 1.4–1.5). |
| Planted zero | round-2 phase alignment Theorem MT (torus twin carries it); atlas §7 (finite perturbations) | Theorem PZ / RIG: with the integers fixed, a planted zero is suppressed by ζ(ρ₀). Measured in the LP itself. |
| Exponent transfer | round-2 Prop. 6.6 (Θ ≤ ν*) | Upper bound ν* ≤ 1/(2−Θ) (Theorem S); unconditional ν₁ ≪ x e^{−c√log x}. |
| Exact certificates | round-2 Prop. 6.4 (forced head, Mertens-increment tail; "ARGUED for general valid c") | Theorem E: the exact-certificate LP value is bounded below by the Mertens tiling sum; equality measured. Shows that positivity, not the floor structure, carries the √x behaviour. |
| Mertens / pointwise wall | MV-CAP (route 42); round-2 synthesis "expected stop" | The wall is reached in a precise form: (HM) of Section 4.3, a pointwise-in-x statement on √x specific intervals. |

---

## 1. The LP, its dual, and the target

### 1.1 Notation

* x ≥ 10 is an integer. J_x = {⌊x/m⌋ : 1 ≤ m ≤ x}. s = max{j : j(j+1) ≤ x}, mmax = ⌊x/(s+1)⌋.
  * J_x = {1, …, s} ⊔ {⌊x/m⌋ : 1 ≤ m ≤ mmax}. The second set lies in [s+1, x] and its values are distinct, since
    x/m − x/(m+1) ≥ 1 for m ≤ s.
  * |J_x| = s + mmax ≤ 2√x.
* For j ∈ J_x the *block* of j is B_j = {m ∈ ℤ : ⌊x/m⌋ = j} = (x/(j+1), x/j] ∩ ℤ, which is nonempty.
  * Blocks with j ≤ s are intervals of length ≈ x/j² ≥ 1, with m > x/(s+1) ≈ √x ("long blocks"; near j ≈ s they
    have length ≈ 1).
  * Blocks with j > s are single integers m ≤ mmax ("short blocks").
* For 1 ≤ M ≤ mmax the k-range I'_M = {k ∈ (s, x] : ⌊x/k⌋ = M}. These ranges partition (s, x].
* Mert(y) = Σ_{k≤y} μ(k), m(x) = Σ_{k≤x} μ(k)/k, β(x) = Σ_{k≤x} μ(k)(log k)/k, Q(s) = Σ_{k≤s} μ(k)².
* K(x) = ½ log(2πx) + log(x+1) + 1/12 (round 2).
* ΔMert'_M = Σ_{k∈I'_M} μ(k), and W_M = max_{k∈I'_M} |Σ_{k'∈I'_M, k'≤k} μ(k')|.

### 1.2 Primal, dual, pseudo-prime form

* **Primal** (round 2, §4.4–4.5, with full support N = x):
  ν₁(x) = min{ ‖c‖₁ : f_c(j) := Σ_k c_k⌊j/k⌋ ≥ 1 (j ∈ J_x), Σ c_k/k = 0, Σ c_k (log k)/k = −1 }.
* **Dual** (round 2, §6.3):
  max{ Σ_{j∈J} y_j − v : y ≥ 0, |T_y(k) + u/k + v(log k)/k| ≤ 1 (1 ≤ k ≤ x) }, with T_y(k) := Σ_j y_j⌊j/k⌋.
* The *constraint values* are e_k := T_y(k) + u/k + v(log k)/k ∈ [−1, 1], and h(k) := (u + v log k)/k.

**Lemma 1.1 (LP duality, pseudo-prime form, scale invariance; PROVED).**

(a) Both programs are feasible (c = μ restricted to [1, x] with Lemma 4.4 of round 2; y = 0). Their optimal values are
equal and attained.

(b) A dual vector y ≥ 0 is the same thing as a nonnegative measure b on {1, …, x} up to aggregation over blocks:
y_j = b(B_j). Put ψ_b(t) = Σ_{m≤t} b(m) and T_b(Y) := Σ_{m≤Y} b(m)⌊Y/m⌋ = Σ_{n≥1} ψ_b(Y/n). Then
* Σ_j y_j = ψ_b(x);
* T_y(k) = T_b(x/k);
* T_b(x/k) only involves ψ_b at the points ⌊x/(kn)⌋ ∈ J_x.

(c) With τ > 0, a ∈ ℝ, c ∈ ℝ, put v = ax/τ and u = −x(a log x + c)/τ. Then (y, u, v) = (b-blocks/τ, u, v) is
dual-feasible if and only if

  D_x(b; a, c) := max_{k≤x} |T_b(x/k) − a(x/k)log(x/k) − c(x/k)| ≤ τ,

and the dual objective is (ψ_b(x) − ax)/τ. Hence

  ν₁(x) = max over b ≥ 0 and a, c of (ψ_b(x) − ax) / D_x(b; a, c).

In words: ν₁(x) is the largest *excess-to-sawtooth-discrepancy ratio* of a nonnegative pseudo-prime system on
[1, x], with the density a and the linear term c chosen freely.

(d) b = Λ with a = 1, c = −1 has T_Λ(Y) = log⌊Y⌋! and D_x ≤ K(x) (round 2, Prop. 6.3). So ν₁(x) ≥ (ψ(x) − x)/K(x).

*Proof.*
* (a): finite LPs.
* (b): ⌊⌊x/m⌋/k⌋ = ⌊x/(mk)⌋ and Σ_m b(m)⌊Y/m⌋ = Σ_n Σ_{m≤Y/n} b(m).
* (c): u/k + v(log k)/k = −(1/τ)[a(x/k)log(x/k) + c(x/k)].
* (d): Stirling, as in round 2. ∎

**Measured structure of the optimum** (`structure-small.log`, x = 10⁴, 3·10⁴, 10⁵; Section 5 for larger x).
* At the optimum v ≈ (4.7–6.6)·x/K(x). The optimal system has 5–7 times the prime density.
* Rescaled to density 1, its sawtooth discrepancy is D* = x/v = 2.26, 3.48, 3.38. For the primes (a = 1, c = −1) it
  is about 0.37K(x): 5.5 at x = 10⁴ (round-2 check, largest entry 0.373).
* Its excess ψ_b(x) − x is 2.35√x, 3.37√x, 3.42√x.
* Its small pseudo-primes (m ≤ √x) are not prime-like. 44–56% of their mass sits on non-prime-powers, and their ℓ¹
  distance from Λ is 0.98–1.29 times their total mass.
* The head constraints (k ≤ s) are 67–79% active (x = 10⁴–10⁷) and correlate with μ(k) (correlation 0.68–0.74 at
  x ≤ 10⁵).
* The Möbius identity below splits the value into head 0.48√x, tail 0.43√x and normalization 0.10√x (x = 10⁵).
* The density is capped by the floor steps. Put w = u + v log x. On I'_M the smooth part h varies by about
  |v(1 + log M) − w|/x, and Lemma 1.4 forces this to be ≤ 2 for every M ≤ mmax. So v = O(x/log x). Measured:
  (v/x)·log x = 4.08, 3.41, 3.01, 2.86 at x = 10⁴, 10⁵, 10⁶, 10⁷.

### 1.3 The target and its content

**(DR)** There are C, A, x₀ such that for every x ≥ x₀ every dual-feasible point has Σ y − v ≤ C√x(log x)^A.

**Proposition 1.2 (PROVED-A).**

(i) (DR) ⟺ ν₁(x) ≤ C√x(log x)^A, i.e. Claim 5C of round 2. It implies ψ(x) ≤ x + CK(x)√x(log x)^A, hence RH
(round 2, Prop. 6.2, Lemma 1.2, Theorem 1.1).

(ii) (DR) restricted to the single dual point b = Λ (Lemma 1.1(d)) reads ψ(x) − x ≤ CK(x)√x(log x)^A. That already
implies RH by Landau, and is implied by RH.

So **a proof of (DR) is a proof of RH**. The LP has to supply a mechanism that bounds every dual point at once. By (a)
of Lemma 1.1 that mechanism is a primal certificate with ‖c‖₁ ≪ √x(log x)^A for every x. ∎

### 1.4 Three exact facts valid for every dual point

**Lemma 1.3 (Möbius identity; PROVED).** For every y ∈ ℝ^{J_x} (of any sign) and all u, v,

  Σ_j y_j − v = Σ_{k≤x} μ(k) e_k − u·m(x) − v·(β(x) + 1).

*Proof.*
* Σ_{k≤x} μ(k)T_y(k) = Σ_j y_j Σ_{k≤j} μ(k)⌊j/k⌋ = Σ_j y_j. The inner sum is 1 by round-2 Theorem 3.4(i), and
  ⌊j/k⌋ = 0 for k > j.
* Substitute T_y(k) = e_k − u/k − v(log k)/k. ∎

**Lemma 1.4 (range structure; PROVED).** Let y ∈ ℝ^{J_x} have any sign, and put b_m := y_{⌊x/m⌋} for m ≤ mmax.

(i) For k > s, T_y(k) = 𝒯(⌊x/k⌋), where 𝒯(M) := Σ_{m≤M} b_m⌊M/m⌋. So on every range I'_M, e_k = 𝒯(M) + h(k).

(ii) If |e_k| ≤ 1 for all k ∈ I'_M, then |Σ_{k∈I'_M} μ(k)e_k| ≤ 5W_M.

*Proof.*
* (i): j ∈ J_x with j ≥ k > s means j = ⌊x/m⌋ with m ≤ mmax, and ⌊⌊x/m⌋/k⌋ = ⌊x/(mk)⌋ = ⌊⌊x/k⌋/m⌋.
* (ii), setup: write I'_M = [k₀, k₁] and S(k) = Σ_{k₀≤k'≤k} μ(k'). Abel summation gives
  Σ μ(k)e_k = e_{k₁}S(k₁) − Σ_{k₀≤k<k₁} S(k)(e_{k+1} − e_k).
* On I'_M, e_{k+1} − e_k = h(k+1) − h(k). Here h′(k) has the sign of v(1 − log k) − u, which is monotone in k. So h
  is unimodal, and its total variation on I'_M is at most twice its oscillation.
* Since e_k − h(k) is constant on I'_M and |e_k| ≤ 1, the oscillation of h there is ≤ 2.
* Hence |Σ μ(k)e_k| ≤ W_M(1 + 4). ∎

**Lemma 1.5 (a priori bounds; PROVED).** If |e_k| ≤ 1 for k ∈ (x/2, x] and x ≥ 10³, then |v| ≤ 35x and
|u + v log x| ≤ 46x.

*Proof.*
* For k ∈ (x/2, x] the only j ∈ J_x with j ≥ k is j = x, and ⌊x/k⌋ = 1. So T_y(k) = y_x, and |h(k) − h(k′)| ≤ 2
  on (x/2, x].
* With w = u + v log x and k = θx: x(h(θx) − h(x)) = w(1/θ − 1) + v(log θ)/θ.
* At θ = 3/4 and θ = 1/2 this is a 2×2 system with determinant (2 log 2 − 4 log(4/3))/3 = −0.078522, the same
  determinant as round-2 Lemma 4.4.
* Its inverse has row sums 1.7699/0.078522 and 1.3333/0.078522. Integer rounding of θx changes the entries by O(1/x).
* So |w| ≤ 2x·22.55 and |v| ≤ 2x·16.99 for x ≥ 10³. ∎

Checks (`checks.json`, `check1e7.py`, at the LP optima for x = 10⁴, 10⁵, 10⁶, 10⁷):
* Lemma 1.3 holds to 2·10⁻¹⁰ (6·10⁻⁹ at 10⁷).
* The ratio |Σ_{I'_M} μ e|/W_M is at most 1.34, 1.10, 1.41, 1.58 (the bound is 5).
* v/x = 0.44, 0.30, 0.22, 0.18 and w/x = 0.80, 0.66, 0.55, 0.48.

---

## 2. The decisive test: planting an off-line zero

The round-2 synthesis set the test: build, from ψ, a dual-feasible point carrying one planted off-line zero. If it
carries the zero at growing amplitude, the route is dead. Here a "growing amplitude" means an objective contribution
of the size of the unsuppressed term x^{β₀}/|ρ₀|.

Read literally ("feasible at x ≤ 10⁶"), the test is always passed: at any fixed x the prime point has slack, so a plant
of small enough amplitude is feasible. The test only means something asymptotically: does the plant's contribution
grow with x as an off-line zero's would? That is the question answered below.

### 2.1 The planted term and its sawtooth data

Fix ρ₀ = β₀ + iγ₀ with 0 < β₀ < 1, an integer T₀, and A ∈ ℂ. Define on J_x (cumulative form G(t) = ψ_b(t)):

  π_A(t) = −2 Re[A (t^{ρ₀} − T₀^{ρ₀})/ρ₀] for t ≥ T₀, and π_A(t) = 0 for t < T₀.

With A = 1 and T₀ → 1 this is the explicit-formula contribution −2 Re(t^{ρ₀}/ρ₀) of a zero pair {ρ₀, ρ̄₀}. The
amplitude A rescales and rotates it, and T₀ switches it on. Its sawtooth data are Π(k) := Σ_{n≥1} π_A(⌊x/(kn)⌋), the
change of T_y(k).

**Lemma 2.1 (sawtooth data of a plant; PROVED).** Let √x ≤ T₀ ≤ x. Then Π(k) = 0 for k > x/T₀. For k ≤ x/T₀, with
Y = x/k,

  Π(k) = −2 Re[(A/ρ₀) ζ(ρ₀) Y^{ρ₀}] − 2 Re[A T₀^{ρ₀−1}/(1−ρ₀)]·Y + r_k,  |r_k| ≤ c₁(ρ₀)|A|T₀^{β₀},

with c₁(ρ₀) = 20 + 2/|ρ₀| + 2/β₀.

*Proof.*
1. The terms with ⌊Y/n⌋ ≥ T₀ are exactly n ≤ N := ⌊Y/T₀⌋. So Π(k) = Σ_{n≤N} π_A(⌊Y/n⌋), and Π(k) = 0 if N = 0.
2. *Floor error.* We have |π_A′(t)| ≤ 2|A|t^{β₀−1}, and ⌊t⌋ ≥ t/2 for t ≥ 2. So
   |π_A(⌊t⌋) − π_A(t)| ≤ 2^{2−β₀}|A|t^{β₀−1}. Summing over n ≤ N with N + 1 ≤ 2Y/T₀:
   Σ_{n≤N}(Y/n)^{β₀−1} ≤ 2^{2−β₀} Y T₀^{β₀−2} ≤ 2^{2−β₀} T₀^{β₀}, using T₀² ≥ x ≥ Y. Total ≤ 16|A|T₀^{β₀}.
3. *Main sum.* Σ_{n≤N} π_A(Y/n) = −2 Re[(A/ρ₀)(Y^{ρ₀} Σ_{n≤N} n^{−ρ₀} − N T₀^{ρ₀})].
4. Euler–Maclaurin for integer N ≥ 1 and Re s = σ > 0, s ≠ 1:
   Σ_{n≤N} n^{−s} = ζ(s) + N^{1−s}/(1−s) + E, with |E| ≤ N^{−σ}(½ + |s|/(2σ)).
   Since N ≥ Y/(2T₀), |Y^{ρ₀}E| ≤ T₀^{β₀}(1 + |ρ₀|/β₀).
5. Write N = Y/T₀ − θ with θ ∈ [0, 1), and ε = θT₀/Y ∈ [0, ½). Then:
   * Y^{ρ₀}N^{1−ρ₀} = YT₀^{ρ₀−1}(1 − ε)^{1−ρ₀} = YT₀^{ρ₀−1} − (1−ρ₀)θT₀^{ρ₀} + R₂, where
     |R₂| ≤ 2|1−ρ₀||ρ₀| YT₀^{β₀−1}ε² ≤ 2|1−ρ₀||ρ₀|T₀^{β₀};
   * N T₀^{ρ₀} = YT₀^{ρ₀−1} − θT₀^{ρ₀}.
   The θ-terms cancel, leaving Y^{ρ₀}N^{1−ρ₀}/(1−ρ₀) − NT₀^{ρ₀} = YT₀^{ρ₀−1}ρ₀/(1−ρ₀) + O(2|ρ₀|T₀^{β₀}).
6. Multiplying by −2A/ρ₀ and adding the errors gives the display. ∎

Check (`checks.json`):
* The remainder r_k at A = 1 satisfies |r_k|/T₀^{β₀} ≤ 0.20 in all 12 cases: x = 10⁶, 10⁷, 10⁸, T₀ = x^{3/4},
  ρ₀ ∈ {0.75+10i, 0.6+30i, 0.9+5i, 0.75+20i}, k ≤ 9.
* The ζ(ρ₀)-term is 13–550 times larger than the remainder.

**Reading.** The sawtooth constraints see the planted term only through ζ(ρ₀). The reason is that T_b is the
hyperbola sum Σ_n ψ_b(Y/n): in Mellin terms it multiplies the plant's Dirichlet series by ζ(s), and evaluating at the
pole s = ρ₀ gives the factor ζ(ρ₀). The integers are fixed by the floor function, so ζ is fixed. Round-2 Theorem MT
lived on the torus, where the function itself could be changed; that is not possible here.

### 2.2 Theorem PZ: fake zeros are suppressed

For q ≥ 2 put w_q = (1 − q^{1−ρ₀})². Assume Im(w₂ w̄₃) ≠ 0. This fails only for a discrete set of γ₀; for real ρ₀ one
triple suffices. Set

  κ(ρ₀) = (18|w₃| + 32|w₂|)/|Im(w₂ w̄₃)|,  κ₂(ρ₀) = (9|w₃| + 16|w₂|)/|Im(w₂ w̄₃)|.

**Theorem PZ (PROVED).** Let ζ(ρ₀) ≠ 0. Let two dual-feasible points at x differ by a plant: G′ − G = π_A on J_x, with
√x ≤ T₀ ≤ x/9 and arbitrary Δu, Δv. Put C := −2Aζ(ρ₀)x^{ρ₀}/ρ₀ and R := c₁(ρ₀)|A|T₀^{β₀}.

(i) |C| ≤ κ(ρ₀) + κ₂(ρ₀)R.

(ii) Suppose (x/T₀)^{β₀} ≥ max(κ₂c₁|ρ₀|, 2κ c₁|ρ₀|)/|ζ(ρ₀)|. Then the change of the dual objective satisfies

  |Δ(Σ y − v)| ≤ 2κ(ρ₀)(1 + (T₀/x)^{β₀})/|ζ(ρ₀)| + 3.65(3 + 2κ(ρ₀)).

(iii) Consequently, for fixed ρ₀, fixed η > 0 and T₀ ≤ x^{1−η}, a planted fake zero moves the dual objective by
O_{ρ₀}(1), uniformly for x ≥ x₀(ρ₀, η). Indeed (i) forces |A| ≤ κ(ρ₀)|ρ₀|/(|ζ(ρ₀)|x^{β₀}): the amplitude must
decay like x^{−β₀}, so the planted term itself, of size ≍ |A|x^{β₀}/|ρ₀|, never exceeds O(1/|ζ(ρ₀)|).

*Proof.*
1. Δe_k := e′_k − e_k = Π(k) + Δu/k + Δv(log k)/k, and |Δe_k| ≤ 2.
2. For k ≤ 9 ≤ x/T₀, Lemma 2.1 gives Δe_k = Re(Ck^{−ρ₀}) + α′/k + Δv(log k)/k + r_k, with
   α′ := Δu − 2x·Re[AT₀^{ρ₀−1}/(1−ρ₀)].
3. Multiply by k: kΔe_k = Re(Ck^{1−ρ₀}) + α′ + Δv log k + kr_k. The second difference over the geometric triple
   (1, q, q²), F ↦ F(1) − 2F(q) + F(q²), kills α′ + Δv log k and gives
   Re(C w_q) = D_q[kΔe_k] − D_q[kr_k], with |D_q[kΔe_k]| ≤ 2(1+q)² and |D_q[kr_k]| ≤ (1+q)²R.
4. Take q = 2, 3. For z ∈ ℂ, writing Re(zw) = (zw + z̄w̄)/2, one checks the identity
   Re(zw₂)w₃ − Re(zw₃)w₂ = −i z̄ Im(w₂w̄₃). Hence |z| ≤ (|Re(zw₂)||w₃| + |Re(zw₃)||w₂|)/|Im(w₂w̄₃)|. This gives (i).
5. For (ii): |A| = |C||ρ₀|/(2|ζ(ρ₀)|x^{β₀}), so R = c₁|ρ₀|(T₀/x)^{β₀}|C|/(2|ζ(ρ₀)|) ≤ |C|/(2κ₂). Then (i) gives
   |C| ≤ 2κ, and R ≤ 1.
6. The gain in G(x) is π_A(x), with |π_A(x)| ≤ 2|A|(x^{β₀} + T₀^{β₀})/|ρ₀| = |C|(1 + (T₀/x)^{β₀})/|ζ(ρ₀)|.
7. For Δv: step 2 at k = 1 gives |α′| ≤ 2 + |C| + R. At k = 3 it gives |α′/3 + Δv(log 3)/3| ≤ 2 + |C| + R. Hence
   |Δv| ≤ 4(2 + |C| + R)/log 3 ≤ 3.65(3 + 2κ).
8. Combining steps 6 and 7 gives (ii). (iii) follows. ∎

Constants (`checks.json`):

| ρ₀ | \|ζ(ρ₀)\| | κ(ρ₀) | 2κ/\|ζ\| (bound on the G(x)-gain) |
|---|---|---|---|
| 0.75 + 10i | 1.466 | 46.6 | 63.6 |
| 0.75 + 20i | 1.026 | 18.2 | 35.5 |
| 0.60 + 30i | 0.567 | 23.9 | 84.2 |
| 0.90 + 5i | 0.773 | 68.0 | 176 |
| 0.55 + 40i | 1.252 | 190 | 304 |
| 0.70 + 14.1347i (0.2 off ρ₁) | 0.146 | 16.2 | 220 |

These bounds do not depend on x. Over 10⁵ ≤ x ≤ 10⁷ the unsuppressed sizes x^{β₀}/|ρ₀| run up to 3.9·10⁵.

**Onset.** (i) holds for every x, but it bounds |C| only after R has been absorbed. The absorption condition in (ii) is
explicit but very late with these crude constants. For ρ₀ = 0.6 + 30i and T₀ = x^{3/4},
κ₂c₁|ρ₀|/|ζ(ρ₀)| ≈ 1.5·10⁴ and 2κc₁|ρ₀|/|ζ(ρ₀)| ≈ 5.9·10⁴, so (ii) needs x/T₀ ≳ 10⁷–10⁸, i.e. x ≳ 10²⁸–10³². The cause is the remainder bound c₁ ≈ 23, against
a measured remainder ≤ 0.2 (Lemma 2.1 check). So Theorem PZ is an asymptotic statement. The LP (Section 2.4) shows the
suppression already at x = 10⁵–10⁷.

**At a genuine zero** (ζ(ρ₀) = 0) we have C = 0 and the argument gives nothing. The plant is then limited only by the
remainder: |A|T₀^{β₀} ≲ 1 and gain ≲ (x/T₀)^{β₀}/|ρ₀|. The dual can re-weight the true zeros, but only by the cutoff
amount, and for T₀ ≥ √x this is ≲ x^{β₀/2}. **Plants with T₀ < √x** enter the short blocks. With the prime base these
blocks carry no mass at composites, so positivity forces an oscillating plant to vanish there. This is measured: at
T₀ = x/(s+1) the LP returns amplitude 0 for every ρ₀, true zero included. A plant can enter the short blocks only on
prime powers, or on a base that already has composite mass. Prime-supported plants carry secondary oscillations at the
shifted points ρ + ρ₀ − 1. Under RH these are of lower order (ARGUED, not written out). Unconditionally their size is
that of the PNT error and is not controlled here. Theorem RIG below covers every plant in the continuum limit.

### 2.3 Theorem RIG: the continuum dual carries only the zeros of ζ

**Theorem RIG (PROVED).** Let b ≥ 0 be a locally finite Borel measure on [1, ∞) with ψ_b(t) = b([1, t]). Put
T_b(Y) = Σ_{n≥1} ψ_b(Y/n). Suppose that for some a, c ∈ ℝ and every Y ≥ 1,

  |T_b(Y) − aY log Y − cY| ≤ τ(Y), with τ(Y) = O_ε(Y^ε) for every ε > 0.

Then:

(i) B(s) := ∫ t^{−s} db(t) converges for Re s > 1, and ζ(s)B(s) = s[a/(s−1)² + c/(s−1) + R̂(s)], where
R̂(s) = ∫_1^∞ (T_b(Y) − aY log Y − cY) Y^{−s−1} dY is holomorphic in Re s > 0.

(ii) B continues meromorphically to Re s > 0. Its poles lie at s = 1 (simple, residue a) and at zeros of ζ, with
order ≤ multiplicity. **At every ρ₀ with ζ(ρ₀) ≠ 0 and Re ρ₀ > 0, B is holomorphic.**

(iii) If B has a pole at ρ with Re ρ > ½ (necessarily ζ(ρ) = 0), then ψ_b(t) − at = Ω_±(t^{Re ρ−ε}) by Landau's
oscillation theorem (STANDARD). This uses that the Mellin transform B(s)/s − a/(s−1) is holomorphic on the real axis
s > 0, since ζ has no real zeros in (0, 1). Conversely, a one-sided bound ψ_b(t) − at ≤ Ct^θ forces B to be
holomorphic in Re s > θ except at s = 1. The hypothesis b ≥ 0 is used only in (i): for ψ_b ≤ T_b, and for Tonelli.

*Proof.*
1. ψ_b(Y) ≤ T_b(Y) = O(Y log Y), so B converges for Re s > 1.
2. For real s > 1, Tonelli gives ∫_1^∞ ψ_b(t)t^{−s−1} dt = B(s)/s and
   ∫_1^∞ T_b(Y)Y^{−s−1} dY = Σ_n n^{−s} ∫ ψ_b(t)t^{−s−1} dt = ζ(s)B(s)/s, using ψ_b = 0 on [0, 1).
3. Also ∫_1^∞ (aY log Y + cY)Y^{−s−1} dY = a/(s−1)² + c/(s−1).
4. Both sides are analytic in Re s > 1, which gives (i). (ii) follows by dividing by ζ. (iii) is Landau's theorem. ∎

**Reading of the decisive test.**
* A nonnegative system whose sawtooth data are smooth to O(Y^ε) at every scale has singularities only at the zeros of
  ζ.
* At finite x, Theorem PZ is the quantitative form: the cost of a fake zero is the value |ζ(ρ₀)|.
* So no dual-feasible sequence carries a fake off-line zero, and **the route survives the test.**
* But the same theorems say what the dual *does* carry: all the zeros of ζ, including any off-line ones. A bound for
  every dual point is therefore a statement about the zeros of ζ, and Section 4 makes this exact.

### 2.4 Measurements: the plant LP

`rha-legendre-dual-lp-plant.py`. The LP has variables λ (multiple of ψ on J_x), Re A, Im A, u, v. Constraints are
imposed at every k ≤ x (cutting planes), with G nondecreasing on J_x (positivity). T₀ = x^{3/4}. "Gain" is the
increase of the LP value over the best λψ-ray point without the plant. These are dual-feasible points, so every value
is a lower bound for ν₁(x), which is about 3·10² to 3·10³ here.

| ρ₀ | \|ζ(ρ₀)\| | gain x=10⁵ | gain 10⁶ | gain 10⁷ | x^{β₀}/\|ρ₀\| at 10⁵ / 10⁶ / 10⁷ |
|---|---|---|---|---|---|
| 0.75 + 10i | 1.466 | 2.789 | 0.018 | 0.018 | 561 / 3153 / 17730 |
| 0.75 + 20i | 1.026 | 0.440 | 0.198 | 0.200 | 281 / 1580 / 8885 |
| 0.60 + 30i | 0.567 | 0.787 | 0.559 | 0.987 | 33 / 133 / 528 |
| 0.90 + 5i | 0.773 | 1.515 | 0.288 | 0.289 | 6225 / 49440 / 392700 |
| 0.55 + 40i | 1.252 | 0.946 | 0.149 | 0.088 | 14 / 50 / 177 |
| 0.5 + 14.1347i (true zero ρ₁) | 7e-16 | 0.558 | 2.853 | 5.324 | 22 / 71 / 224 |
| 0.55 + 14.1347i | 0.039 | 0.547 | 3.334 | 6.170 | 40 / 141 / 501 |
| 0.70 + 14.1347i | 0.146 | 0.500 | 5.100 | 5.617 | 224 / 1120 / 5613 |
| 0.75 + 14.1347i | 0.180 | 0.479 | 4.670 | 5.089 | 397 / 2234 / 12560 |

(Planted term at x at the optimal amplitude: 0.04–11.4 in every row; `plant-075.log`.)

*Robustness in T₀* (`plant-085-1e6.log`). With T₀ = x^{0.85} at x = 10⁶ the same picture holds:
* the five fake zeros gain 0.016, 0.271, 0.143, 0.285, 0.222;
* the true zero gains 0.62, and the three near-zero points 0.82, 1.52, 1.58.
Shrinking the plant range lowers the true-zero gain (2.85 at T₀ = x^{0.75}), as the cutoff limit predicts. The fake-zero
gains stay at the same small level.

**Reading.**
* Fake zeros (first five rows) gain O(1) and stay ≤ 1.0 at 10⁶–10⁷.
  * Four rows are flat or falling; 0.6 + 30i rises from 0.56 to 0.99.
  * Over the same range the unsuppressed size grows 3.5–8 times.
  * This is the behaviour Theorem PZ predicts asymptotically. The gains are far below its bounds, which are not yet in
    force at these x (Onset, Section 2.2).
* The true zero and the points near it gain more, and the gain grows slowly. This is cutoff-limited re-weighting of a
  genuine zero (Section 2.2). For the near-zero points the planted term is ≈ 5–11, against unsuppressed sizes of
  500–12560.
* The ψ-ray with a plant reaches at most 3.6 + 6.2 ≈ 10 at x = 10⁷, against ν₁(10⁷) = 3440.8. **The size of the
  dual optimum has nothing to do with planted zeros.** Section 4 locates where it does come from: the head, and the
  Mertens-weighted tail.

---

## 3. The argument (attempted proof)

**Theorem 3.0 (attempted).** (DR) holds. Hence (Proposition 1.2) ψ(x) ≤ x + C√x(log x)^{A+1} and RH holds.

Fix x ≥ 10³ and a dual-feasible point (y, u, v). Let b, ψ_b, 𝒯, e_k, h be as in Section 1.

**Step 1 (reduction).** By Proposition 1.2, RH follows from (DR). [PROVED-A]

**Step 2 (Möbius identity).** Σ y − v = Σ_{k≤s} μ(k)e_k + Σ_{k>s} μ(k)e_k − u·m(x) − v(β(x)+1) (Lemma 1.3).
[PROVED]

**Step 3 (head).** |Σ_{k≤s} μ(k)e_k| ≤ Q(s) ≤ √x, since |e_k| ≤ 1. [PROVED]

**Step 4 (range structure and a priori bounds).**
* For k > s, e_k = 𝒯(⌊x/k⌋) + h(k), and |Σ_{k∈I'_M} μ(k)e_k| ≤ 5W_M (Lemma 1.4).
* |v| ≤ 35x and |u| ≤ 46x + 35x log x (Lemma 1.5). [PROVED]

**Step 5 (no fake zeros).** The pseudo-prime system cannot carry a planted zero at a point where ζ ≠ 0 (Theorem PZ). In
the continuum limit its Dirichlet series is s[a/(s−1)² + c/(s−1) + R̂(s)]/ζ(s) with R̂ holomorphic in Re s > 0
(Theorem RIG). [PROVED, in the stated forms]

**Step 6 (positivity).** b ≥ 0. Hence 𝒯(M) = Σ_{m≤M} b_m⌊M/m⌋ is nondecreasing and superadditive, and the tail values
e_k − h(k) = 𝒯(⌊x/k⌋) are nonincreasing in k on (s, x]. [PROVED, elementary]

**Step 7 (tail; claimed).** |Σ_{k>s} μ(k)e_k − u·m(x) − v(β(x)+1)| ≤ C√x(log x)^A.

*Proposed justification.*
1. By Step 5 the tail is governed by the singularities of B/s·(Mellin of the tail constraint profile), and these lie
   only at the zeros of ζ: no fake zero contributes, and the smooth parts (pole at s = 1, Step 4) cancel the
   normalization terms.
2. So the tail is a sum Σ_ρ x^ρ·(bounded weight)/(ρζ′(ρ)) over the zeros, plus O(√x).
3. Step 6 keeps the weights nonnegative-structured, so the tail is O(√x Σ_ρ |weight|/|ρζ′(ρ)|) = O(√x(log x)^A).

**Step 8 (conclusion).** Steps 2, 3 and 7 give Σ y − v ≤ √x + C√x(log x)^A for every dual point. That is (DR).
[PROVED given Step 7]

**Status of each step.**

| Step | Status |
|---|---|
| 1 | PROVED-A (round 2, Prop. 6.2, Lemma 1.2, Thm 1.1) |
| 2–4 | PROVED (Lemmas 1.3–1.5); sign-blind (y of any sign) |
| 5 | PROVED (Theorems PZ, RIG) |
| 6 | PROVED (elementary) |
| **7** | **Unproved; RH-hard; beyond RH as far as known. The failing line (Section 4).** |
| 8 | PROVED given Step 7 |

---

## 4. Attack on Step 7

### 4.1 At the true primes, Step 7 is RH

**Proposition 4.1 (PROVED-A).** At the dual point b = Λ (a = 1, c = −1, τ = K(x)), Step 7 holds for all large x if
and only if ψ(x) − x ≪ K(x)√x(log x)^A. The right side follows from RH (with A = 1) and implies RH (Landau, round-2
Theorem 1.1).

*Proof.* At b = Λ the objective is (ψ(x) − x)/K(x) (Lemma 1.1(d)). By Steps 2–3 the objective equals the head, which
is ≤ √x in absolute value, plus the quantity bounded in Step 7. ∎

So the proposed justification has to be an argument about the zeros of ζ that does not already assume their location.
It fails at three points.

* **(a) Circularity of step 7.1–7.2.** Theorem PZ/RIG excludes *fake* zeros (points where ζ ≠ 0). It says nothing
  about where the zeros of ζ are. At b = Λ, B = −ζ′/ζ has its poles exactly at the zeros of ζ, wherever they lie;
  RIG(ii) holds for Λ whether or not RH is true. Writing "all ρ in the sum have Re ρ = ½" is RH.
* **(b) Magnitudes, step 7.3.** Grant RH. A bound O(√x Σ_ρ |weight|/|ρζ′(ρ)|) = O(√x polylog) needs control of small
  values of ζ′(ρ), of Gonek–Hejhal type. That is not known to follow from RH. This is the same gap that separates RH
  from M(x) ≪ √x·polylog. The weights here come from the sawtooth discrepancy R and are only bounded, not decaying.
* **(c) Sign-blindness.** Steps 2–4 hold for y of any sign. The positivity of Step 6 is used in the proposed
  justification only as a slogan. Theorem E (Section 4.3) shows that every bound valid for y of any sign must be at
  least the Mertens tiling sum. So (b) cannot be avoided without a genuine use of positivity, and none is available
  (Section 4.4).

### 4.2 What Steps 1–6 do prove: Theorem S

**Theorem S (exponent sandwich).**

(i) ν* ≥ Θ. [PROVED-A: round-2 Proposition 6.6 (true primes dual-feasible, Landau/Littlewood Ω-theorems).]

(ii) For every x ≥ 10³ [PROVED],

  ν₁(x) ≤ Q(s) + 5 Σ_{M≤mmax} W_M + (46 + 35 log x)·x·|m(x)| + 35x·|β(x)+1|,

with W_M ≤ min( x/(M(M+1)) + 1, 2 max_{y≤x/M} |Mert(y)| ).

(iii) If ζ(s) ≠ 0 for Re s > θ (½ ≤ θ < 1), then ν₁(x) ≪_ε x^{1/(2−θ)+ε}. Hence Θ ≤ ν* ≤ 1/(2 − Θ). [PROVED, with
STANDARD inputs]
* Under RH: ½ ≤ ν* ≤ ⅔.
* Under the 7/8 half-plane (openai/math, Lean-checked locally, not peer-reviewed): 7/8 ≤ ν* ≤ 8/9.
* Under PR #14 / Xu–Sang (conditional): ν* ≤ 1/(2 − 0.87488665) = 0.88880.

(iv) Unconditionally, ν₁(x) ≪ x·exp(−c√(log x)). This improves round-2 Lemma 4.4's ν₁ ≤ (6/π² + o(1))x. [PROVED,
STANDARD inputs]

*Proof.*
* (ii): Step 2 with Step 3, Lemma 1.4(ii) summed over the partition {I'_M} of (s, x], and Lemma 1.5. Also
  |I'_M| = ⌊x/M⌋ − ⌊x/(M+1)⌋ ≤ x/(M(M+1)) + 1, and W_M ≤ |Mert(k)| + |Mert(k₀ − 1)| ≤ 2 max_{y≤x/M}|Mert(y)|.
* (iii), inputs. A zero-free half-plane Re s > θ gives Mert(y) ≪ y^{θ+ε}, m(x) ≪ x^{θ−1+ε} and
  β(x) + 1 ≪ x^{θ−1+ε} (STANDARD: Titchmarsh ch. 14, with ½ replaced by θ; partial summation from 1/ζ(1) = 0 and
  (1/ζ)′(1) = 1).
* (iii), sum. Split Σ_M min(x/M², (x/M)^{θ+ε}) at M₁ = x^{(1−θ)/(2−θ)}. Both pieces are ≪ x^{1/(2−θ)+ε}. The other
  terms are ≪ √x + x^{θ+ε}log x ≤ x^{1/(2−θ)+ε}, since θ(2−θ) ≤ 1.
* (iv): the classical zero-free region gives Mert(y) ≪ y·e^{−c√(log y)}, and the same for m and β + 1. Split at
  M₁ = e^{c√(log x)/2}. ∎

**Reading.**
* Steps 1–6 convert a zero-free half-plane into a certificate exponent, with a loss: θ ↦ 1/(2−θ). The loss comes from
  the Möbius sums over the medium ranges I'_M, M ≈ x^{1/3}. These are intervals of length ≈ x^{1/3} at height ≈ x^{2/3},
  where RH gives only the pointwise bound (x/M)^{1/2+ε}.
* Combined with round-2 Proposition 6.6 (Θ ≤ ν*), the certificate exponent is pinned to within (1−Θ)²/(2−Θ) of the
  zero exponent. The LP is a lossy but faithful zero detector.

### 4.3 Theorem E: the sign-blind barrier

Let ν₁^ex(x) be the least ℓ¹ norm of an **exact** normalized certificate (f_c = 1 on J_x). Its dual is the dual LP
without y ≥ 0.

**Theorem E.**

(i) ν₁^ex(x) ≥ Q(s) + Σ_{M≤mmax} |ΔMert'_M| = Q(s) + Σ_{M≤mmax} |Mert(⌊x/M⌋) − Mert(⌊x/(M+1)⌋)|. [PROVED]

(ii) Equality holds if the normalization target (−m(s), −1 − β(s)) lies in the zonotope
Z_x = Σ_M ΔMert'_M · conv{(1/k, (log k)/k) : k ∈ I'_M}. [PROVED]
* Measured: equality at x = 10⁴, 3·10⁴, 10⁵, 3·10⁵ and 10⁶, to 10⁻¹² relative.
* The LP's dual optimum has u = v = 0 there.
* Values ν₁^ex/√x = 3.47, 3.16, 3.52, 4.39, 4.16, against ν₁/√x = 1.04, 0.97, 1.01, 1.01, 1.04.

(iii) Every upper bound for the dual objective that is valid for y of every sign is ≥ ν₁^ex(x). Hence it is
≥ Q(s) + Σ_M |ΔMert'_M| ≥ |Mert(x) − Mert(⌊x/2⌋)|.

*Proof.*
* (i), primal: an exact certificate has c_k = μ(k) for k ≤ s (round-2 Proposition 6.4(i)). For j = ⌊x/m⌋ with
  m ≤ mmax, f_c(j) depends on the tail only through the range sums C_M = Σ_{k∈I'_M} c_k (Lemma 1.4(i)). The matrix
  [⌊M/m⌋]_{M,m≤mmax} is unitriangular, so f_c ≡ 1 forces C_M = ΔMert'_M. Hence
  ‖c‖₁ ≥ Q(s) + Σ_M |C_M| = Q(s) + Σ_M |ΔMert'_M|.
* (i), dual: put u = v = 0. Choose b by triangular solution so that 𝒯(M) = sgn ΔMert'_M, then z by triangular
  solution so that T_y(k) = μ(k) for k ≤ s. Then e_k ∈ {−1, 0, 1}, and by Lemma 1.3 the objective is
  Σ_k μ(k)e_k = Q(s) + Σ_M |ΔMert'_M|.
* (ii): put the mass C_M on I'_M with constant sign. The normalization is attainable exactly when the target lies in
  Z_x.
* (iii): such a bound bounds the sign-free dual, whose value is ν₁^ex. Also I'_1 = (x/2, x]. ∎

**(HM) and where Claim 5C sits.** Let **(HM)** be the hypothesis

  Σ_{M≤mmax} W_M + x log x·|m(x)| + x·|β(x)+1| ≤ C√x(log x)^A for all large x.

**Proposition 4.3 (PROVED).** (HM) ⟹ (DR) ⟹ RH, and (HM) ⟹ RH directly.

*Proof.*
* The first implication is Theorem S(ii); the second is Proposition 1.2.
* Directly: W_1 ≥ |Mert(x) − Mert(⌊x/2⌋)|. Summing over dyadic blocks (the sum of √(x/2^i) converges) gives
  Mert(x) ≪ √x(log x)^A, which implies RH (Littlewood). ∎

Whether RH implies (HM) is not known, to my knowledge.
* The term x|m(x)| is the analogue of M(x). M(x) ≪ √x·polylog is believed but is known only under hypotheses beyond
  RH. As recalled, not verified: Ng (Proc. LMS 2004) obtains M(x) ≪ √x(log log x)^{3/2} under RH plus
  J_{−1}(T) ≪ T.
* The term Σ_M W_M needs square-root cancellation of μ over the √x specific intervals of the hyperbolic tiling at x.
  RH gives only Σ_M W_M ≪ x^{2/3+ε} pointwise in x (Theorem S).
* Heuristically (random model) Σ_M W_M ≍ √x log x. Measured (`tiling.log`):
  * Σ_M W_M/(√x log x) = 0.445, 0.440, 0.435, 0.450, 0.453, 0.457 at x = 10⁴, 10⁵, 10⁶, 3·10⁶, 10⁷, 3·10⁷;
  * Σ_M |ΔMert'_M|/(√x log x) = 0.25–0.32 on the same range.

  So on this range the tiling sum is c√x log x with c ≈ 0.45, and (HM) at A = 1 holds numerically, as the random
  model predicts. That is no evidence for (HM) at all x. The valid ν₁/√x rises about 40 times more slowly in log x
  (Section 5.3).

So, as far as is known, Claim 5C sits strictly between RH and (HM). By (iii), any argument that does not use y ≥ 0
needs (HM)-type input.

### 4.4 What positivity gives, and why it is not enough

Positivity is what separates ν₁ from ν₁^ex. The measurements:
* ν₁^ex/ν₁ = 3.3–4.3 on 10⁴ ≤ x ≤ 10⁶.
* ν₁/√x is at most weakly correlated with Σ_M |ΔMert'_M|/√x at fixed scale: correlation 0.268 over 32 points at
  x ≥ 5·10⁵. By contrast ν₁^ex/√x equals Q(s)/√x plus the tiling sum exactly (Theorem E).

So positivity largely decorrelates the dual from the Mertens function on the tiling. It does not remove the tail,
however (Section 5.4): the tail share of ν₁ grows from 0.35√x to 0.83√x on 10⁴–10⁷.

What positivity gives provably:

* **Ratchet** (Step 6). On (s, x], e_k − h(k) is nonincreasing in k. In terms of M the tail level
  ē_M := 𝒯(M) + h(k_M) can fall by at most the smooth increment |v(1 + log M) − w|/x ≤ 2 per step, and can rise
  arbitrarily.
* **Staircase cone.** 𝒯 ∈ cone{⌊·/m⌋ : m ≤ mmax}, so 𝒯(M+M′) ≥ 𝒯(M) + 𝒯(M′), and also
  𝒯(M+M′) ≤ 𝒯(M) + 𝒯(M′) + ψ_b(M+M′) (Chebyshev's inequalities).
  * Against the smooth part these give ē(M+M′) ≥ ē(M) + ē(M′) − Δ_S(M, M′), with
    Δ_S ≈ (v/x)(M+M′)·H(M/(M+M′)) (binary entropy).
  * Since Δ_S < 1 only for M + M′ ≲ x/v ≍ log x, superadditivity constrains ē only on M ≲ log x.
* **No fake zeros** (Theorems PZ, RIG).

Why this does not give Step 7.
* The large Mertens increments sit on the long ranges (small M, |ΔMert'_M| ≈ √x/M). For M ≳ log x neither the ratchet
  (drop ≤ 2 per step) nor superadditivity rules out a level pattern ē_M that is partially aligned with sgn ΔMert'_M.
* The constraint coupling the tail to the head rows (each head row contains Σ_m b_m⌊x/(mk)⌋) is the only remaining
  mechanism. The LP measures its net effect but there is no analytic handle on it.
* And no positivity argument can be RH-free: by Proposition 4.1 it would bound ψ(x) − x at the dual point b = Λ.

### 4.5 The exact failing line

**Step 7: the tail-plus-normalization bound |Σ_{k>√x} μ(k)e_k − u·m(x) − v(β(x)+1)| ≪ √x(log x)^A for every
dual-feasible point.**

* At b = Λ it is RH, in the form ψ(x) − x ≪ √x·polylog (Proposition 4.1).
* Over sign-free dual points the Step-7 quantity reaches Σ_M |ΔMert'_M| exactly. At the point of Theorem E(i) the
  head is Q(s), u = v = 0, and the tail is Σ_M |ΔMert'_M|. So a sign-blind proof of Step 7 needs (HM)-type input,
  which is not known to follow from RH (Proposition 4.3).
* The proposed derivation from "no fake zeros" (Theorems PZ, RIG) is circular: those theorems exclude zeros that ζ does
  not have, and leave the location of the zeros ζ does have untouched.
* Steps 1–6 prove the exponent sandwich Θ ≤ ν* ≤ 1/(2−Θ) (Theorem S), and nothing below it.

This matches the expected stop recorded in the round-2 synthesis ("the dual extreme points are the Mertens / pointwise
wall in x-space"). It is now made exact: Theorem E is the Mertens tiling sum, and Theorem S is the pointwise loss.

---

## 5. The numerical lead at larger x

### 5.1 Validation of the solvers

* **Block-mass reduced dual** (`lib.py`): about 3√x constraints (all k ≤ s plus the two endpoints of each I'_M), with
  cutting planes over every k ≤ x.
  * Against the full primal LP (x columns): 17.8391346592 (x = 200), 28.2469355297 (10³), 54.4437776059 (3·10³),
    103.929075628 (10⁴). Agreement ≤ 5·10⁻¹².
* **Compact cumulative form** (`compact.py`): G = ψ_b on J_x, hyperbola-grouped rows, about 7x^{3/4} nonzeros.
  * Against the block-mass form: 103.92907562805 against 103.92907562803 (10⁴); 320.51144842380 against
    320.51144842379 (10⁵).
  * Against the round-2 referee: 320.511448424 (10⁵), 555.808496744 (3·10⁵), 1035.98948596 (10⁶).
* Cutting planes stop when the remaining violations (≤ 3·10⁻⁸) lie on rows already imposed, i.e. within HiGHS
  tolerance.
* The dual point divided by max_k|e_k| is strictly feasible in floating point. Its value is listed as the lower bound.
* One cutting-plane subtlety: the critical point exp(1 − u/v) of h falls inside a range (at x = 10⁴, k* ≈ 4330 ∈ I'_2).
  Its neighbours are added explicitly.

### 5.2 ν₁ up to 10⁷

| x | ν₁(x) | ν₁/√x | rescaled lower bound | rows | time | peak RSS |
|---|---|---|---|---|---|---|
| 10⁴ | 103.92908 | 1.0393 | 103.92908 | 296 | 0.1 s | 0.08 GB |
| 3·10⁴ | 167.65005 | 0.9679 | (block-mass solver) | — | — | — |
| 10⁵ | 320.51145 | 1.0135 | 320.51145 | 900 | 0.4 s | 0.10 GB |
| 3·10⁵ | 555.80850 | 1.0148 | (block-mass solver) | — | — | — |
| 10⁶ | 1035.98949 | 1.0360 | 1035.98946 | 2838 | 11 s | 0.23 GB |
| 3·10⁶ | 1810.90878 | 1.0455 | 1810.90875 | 4904 | 49 s | 0.53 GB |
| 10⁷ | 3440.81503 | 1.0881 | 3440.81494 | 8950 | 283 s | 1.21 GB |

### 5.3 Scans and the trend

Pooling the round-2 referee scans (72 random x in [8·10³, 2·10⁵], `/tmp/referee-r2-stepanov/scan_*.log`) with this
round's scans (24 random x in [5·10⁵, 2·10⁶] and 8 in [5·10⁶, 1.5·10⁷]; `scan-1e6.log`, `scan-1e7.log`):

| x range | n | mean ν₁/√x | sd | mean log x |
|---|---|---|---|---|
| [8·10³, 3·10⁴) | 38 | 1.0158 | 0.0346 | 9.83 |
| [3·10⁴, 2·10⁵) | 34 | 1.0094 | 0.0262 | 10.97 |
| [5·10⁵, 2·10⁶) | 24 | 1.0573 | 0.0137 | 13.96 |
| [5·10⁶, 1.5·10⁷) | 8 | 1.0934 | 0.0150 | 15.98 |

Fits (`regress.py`, all points):
* ν₁/√x = 0.8879 + 0.0121·log x; R² = 0.446, residual sd 0.0280, n = 104.
* ν₁/√x = 0.8899 + 0.0120·log x + 0.1020·E + 0.0563·M(x)/√x; R² = 0.575, n = 104.
* log(ν₁/√x) = -0.1084 + 0.0117·log x (power form: ν₁ ∝ x^{0.512}); R² = 0.440.
* At x ≥ 5·10⁵ the correlation of ν₁/√x with Σ_M |ΔMert'_M|/√x is 0.268 (n = 32).
  * In the regression on Σ|ΔMert'|/√x, E and M its coefficient is 0.0107, while Σ|ΔMert'|/√x spreads with sd 0.38.
  * In the regression on log x, E and M at x ≥ 5·10⁵ the E-coefficient is 0.050, against 0.118 in round 2
    (x ≤ 2·10⁵).

**Reading.**
* The round-2 statement "ν₁ = (1.01 ± 0.03)√x with no log growth" does not survive the extension to 1.5·10⁷.
  * The mean ratio rises from 1.013 to about 1.093.
  * The scatter falls (sd 0.026–0.035 → 0.014–0.015).
  * The slope is about 0.0121 per unit of log x.
* Round 2's correlation with log x (+0.054) was measured on 8·10³–2·10⁵. There its two bins (1.016, 1.009) show no
  rise: the fitted slope predicts ≈ 0.04 over that range, comparable to the scatter.
* The data fit ν₁ ≈ √x(0.888 + 0.0121 log x) and ν₁ ≈ 0.90·x^{0.512} about equally well. The first is consistent
  with (DR) at A = 1; the second would make (DR) false. This range cannot separate them.
* Local slope between the last two bins: 0.0179 per unit of log x.

### 5.4 Where the growth sits: the Möbius decomposition of the optimum

Lemma 1.3 at the LP optimum (`decomp.py`; identity residual ≤ 6·10⁻⁹):

| x | ν₁/√x | head Σ_{k≤s} μe /√x | head/Q(s) | tail Σ_{k>s} μe /√x | −u m − v(β+1), /√x | active tail k /√x |
|---|---|---|---|---|---|---|
| 10⁴ | 1.039 | 0.517 | 0.85 | 0.354 | +0.169 | 0.57 |
| 10⁵ | 1.014 | 0.476 | 0.78 | 0.438 | +0.099 | 0.63 |
| 10⁶ | 1.036 | 0.419 | 0.69 | 0.730 | −0.113 | 0.95 |
| 3·10⁶ | 1.046 | 0.436 | 0.72 | 0.645 | −0.036 | 1.31 |
| 10⁷ | 1.088 | 0.417 | 0.68 | 0.828 | −0.157 | 1.87 |

* The head is flat or declining (≤ Q(s) ≈ 0.61√x).
* Tail plus normalization grows: 0.52, 0.54, 0.62, 0.61, 0.67 (·√x).
* The number of active tail constraints grows faster than √x.
* So the drift sits in the tail, the part Section 4 identifies as the failing Step 7.

HEURISTIC explanation, not proved:
* The ratchet lets the tail level align with sgn ΔMert'_M only on ranges where the per-step drop allowance
  |v(1 + log M) − w|/x is about 1. That is a positive proportion of log M ∈ [0, ½ log x].
* Each such range contributes in proportion to |ΔMert'_M| ≍ √x/M (random model).
* This gives a tail of order c√x·log x with small c, i.e. polylog growth consistent with (DR) under RH and the random
  model, not a power.

### 5.5 Valid against exact certificates

| x | ν₁/√x (valid, y ≥ 0) | ν₁^ex/√x (exact, sign-free) | Q(s)/√x + Σ_M\|ΔMert'_M\|/√x | ratio |
|---|---|---|---|---|
| 10⁴ | 1.039 | 3.470 | 0.610 + 2.860 = 3.470 | 3.34 |
| 3·10⁴ | 0.968 | 3.164 | 0.600 + 2.563 = 3.164 | 3.27 |
| 10⁵ | 1.014 | 3.523 | 0.610 + 2.912 = 3.523 | 3.48 |
| 3·10⁵ | 1.015 | 4.389 | 0.612 + 3.777 = 4.389 | 4.32 |
| 10⁶ | 1.036 | 4.162 | 0.608 + 3.554 = 4.162 | 4.02 |

The explicit dual point of Theorem E(i) (`thmE.py`) was built by exact triangular solves and checked at every k ≤ x. It
has max|e_k| = 1 and value exactly 347, 548, 1114, 2404, 4162 = Q(s) + Σ|ΔMert'_M| at x = 10⁴, 3·10⁴, 10⁵, 3·10⁵,
10⁶. The last equals the sign-free LP value 4.162√x. Its entries reach ±5478 (at 10⁶), with both signs.

---

## 6. The four walls, the unblocked inputs, and the levers

### 6.1 Why the attempt is not blocked a priori, and where it stops

| Wall | Does it block the attempt? | Why |
|---|---|---|
| (1) Flow-blindness (`src/data/flow-blindness-no-go.js`, SL2) | **No** | The LP is built from the floor function on ℤ: Legendre/Chebyshev, Λ ∗ 1 = log, with the integers fixed. It is not a hypothesis on the profile Φ. The backward-flowed Ξ_ε has no Dirichlet series and so no Legendre LP. Theorem RIG states the non-softness exactly: the dual can carry singularities only at the zeros of the specific function ζ. The failure (Section 4) is arithmetic and quantitative, not soft. |
| (2) NS-RIGID (`src/data/imp-95530-…js`) | **No** in form, **reached** in content | No Hermitian form on E_V(S) and no Pick matrix appears, so dichotomy (A4) does not apply. The LP consumes the Dirichlet coefficients directly, through Legendre's formula: NS-RIGID's loophole class, at the summatory level. Its one-sided content is candidate (c), "ψ(x) − x = O(x^{1/2+ε}) = RH". Proposition 4.1 shows the failing Step 7 at b = Λ is exactly that statement. No intermediate object was found. |
| (3) Verified-height wall (Route I ceiling, crossover 2a = 7.764, RES-T (B1)) | **No**, but it describes the computable part | No fixed-support Weil form and no fixed-time Λ object. The LP solutions (x ≤ 1.5·10⁷) are finite computations that certify ψ-bounds only at the computed x, far below what verified RH gives. (DR) is cofinal in x. |
| (4) Pointwise / MV-CAP (route 42; `formalization/paper/mv-cap-theorem.md`) | **Yes** in content | The window counter-models ζ_W are not Dirichlet series and have no Legendre LP, so the formal MV-CAP theorem does not apply. But the failing step needs pointwise-in-x control of Möbius sums over the √x specific intervals of the hyperbolic tiling ((HM), Theorem E). Sign-blind arguments sit exactly on it. |
| Global vortex trapping = RH (`research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`) | not involved | No heat-flow object. |
| Sieve parity (round 2, Theorem P) | not involved | No sieve majorant, as the brief requires. The certificate is lossless (Legendre). |

### 6.2 Unblocked inputs and levers

* **Dirichlet-coefficient positivity** (Λ ≥ 0, and y ≥ 0 in the dual). Used.
  * It gives ψ ≤ log M_c in the primal.
  * It is what separates ν₁ from ν₁^ex: a factor 3.3–4.3, and the decorrelation from the Mertens tiling (Section 4.4).
  * It was not converted into Step 7.
* **Levinson–Conrey; Alpöge–Furman ≥ 2/3 (route 16).** These are proportion statements. Step 7 needs every zero:
  Proposition 4.1, and Θ ≤ ν*. One off-line zero forces ν₁ = Ω(x^{Θ−ε}). No use.
* **openai/math, ζ ≠ 0 for Re s > 7/8** (Lean-checked locally, not peer-reviewed). Enters as Θ ≤ 7/8 in Theorem S,
  giving ν* ≤ 8/9: transported with loss, not amplified.
* **PR #14 / Xu–Sang, B = 0.87488665** (conditional on arXiv 2610.15291). ν* ≤ 0.88880. Same role. The sixth-phase
  filter's retained eigenvalue one plays no role.
* **V7 floor reduction (atlas §10).** (DR) gives the p = 0 floor. Theorem S turns a zero-free half-plane θ into the
  certificate exponent 1/(2−θ), hence ψ(x) − x ≪ x^{1/(2−θ)+ε}. That is weaker than the input, so the transfer loses
  and cannot amplify.
* **Function-field dictionary (route 27; round-2 Prop. 6.8).** In F_q[t] the Legendre identity is exact
  (ψ_q(n) = qⁿ). The analogue of the Mertens tiling sum vanishes because the lattice-point counts are exact. The
  ℚ-obstruction of Theorem E is the archimedean sawtooth {x/k}, reappearing as Möbius sums on the hyperbolic tiling.
  The missing object is the same one round 2 identified: a non-archimedean degree (S5).

### 6.3 Atlas §7 and round-2 Theorem MT

* **Atlas §7** perturbs finitely many prime coefficients and forces a negative matrix. Theorem PZ perturbs by an
  infinite planted term and forces a constraint violation of size ≍ |A||ζ(ρ₀)|x^{β₀}/|ρ₀|.
* **Round-2 Theorem MT** built a completely multiplicative unimodular f carrying a planted zero on the torus. There the
  "integers" are twisted along with the primes. In the Legendre LP the integers are untouchable (they are the floor
  function), so the zeta function is fixed. That is why planting fails here and succeeded there.

---

## 7. What survives

1. **Lemma 1.1.** Pseudo-prime form of the dual and scale invariance: ν₁(x) = max_b (ψ_b(x) − ax)/D_x(b; a, c).
   PROVED.
2. **Lemmas 1.3–1.5.** Möbius identity for every dual point (any sign); range structure with the per-range bound 5W_M;
   a priori bounds |v| ≤ 35x, |u + v log x| ≤ 46x. PROVED.
3. **Lemma 2.1 and Theorem PZ.** A planted zero enters the sawtooth data through ζ(ρ₀); a fake zero moves the dual
   objective by O(κ(ρ₀)/|ζ(ρ₀)| + κ(ρ₀)) uniformly for x ≥ x₀(ρ₀, η). This is an asymptotic statement with explicit
   but very late onset; constants are given. PROVED.
4. **Theorem RIG.** Nonnegative systems that are Chebyshev-regular at every scale have B = s[…]/ζ. PROVED.
5. **Theorem S.** Θ ≤ ν* ≤ 1/(2−Θ); under RH ν* ∈ [½, ⅔]; unconditionally ν₁ ≪ x·exp(−c√log x). PROVED (upper half
   new; lower half PROVED-A).
6. **Theorem E and Proposition 4.3.** Exact certificates cost at least the Mertens tiling sum, with equality measured;
   (HM) ⟹ (DR) ⟹ RH. PROVED.
7. **Measurements.**
   * ν₁ at 10⁶, 3·10⁶, 10⁷, and scans near 10⁶ and 10⁷: the round-2 lead is revised to slow growth.
   * Head/tail decomposition: the growth is in the tail.
   * Valid versus exact certificates; the plant LP tables, robust to the cutoff T₀.
   * The Mertens tiling sum Σ_M W_M ≈ 0.45√x·log x on 10⁴–3·10⁷.
   * The compact LP formulation (about 7x^{3/4} nonzeros), which reaches 10⁷ in under 5 minutes.
8. **Structural conclusion.**
   * The Legendre dual is ζ-rigid (it cannot be fooled by fake zeros) but not ζ-blind (it carries the zeros ζ has).
   * Bounding it is bounding the zeros of ζ, plus a Mertens-type magnitude.
   * The push loses exactly on the hyperbolic tiling (Theorems S, E).
   * Positivity is the one extra resource. It is numerically decisive (factor ≈ 4) and has no analytic handle.

---

## 8. Self-attack and honesty statement

### 8.1 What was checked, and how

This file was written and attacked in one context. That is weaker than the rounds-1/2 standard of a fresh-context
referee.
* **Re-derived after drafting:**
  * Lemma 1.1(c) (the u, v substitution);
  * Lemma 1.3 (Möbius identity, any sign);
  * Lemma 1.4 (block bijection on J_x; ⌊⌊x/m⌋/k⌋ = ⌊⌊x/k⌋/m⌋; unimodality of h; TV ≤ 4);
  * Lemma 1.5 (2×2 determinant −0.078522, row sums 1.7699 and 1.3333);
  * Lemma 2.1: the θ-cancellation in step 5 and the Euler–Maclaurin constant. The measured remainder is
    ≤ 0.20·T₀^{β₀} against the bound c₁ ≈ 22–24;
  * Theorem PZ: the identity Re(zw₂)w₃ − Re(zw₃)w₂ = −iz̄ Im(w₂w̄₃), and the Δv bound;
  * Theorem RIG: Mellin bookkeeping; the residue at s = 1 equals a;
  * Theorem S(iii) exponent arithmetic: the split at x^{(1−θ)/(2−θ)}, and θ(2−θ) ≤ 1;
  * Theorem E(i), by both a primal and a dual proof.
  Two corrections were made during this pass:
  * RIG(iii) originally misplaced the use of b ≥ 0;
  * the density-cap statement in §1.2 was replaced by the measured (v/x)·log x.
* **Numerics cross-validated:**
  * block-mass reduced dual against the full primal LP, agreeing to ≤ 5·10⁻¹² at x ≤ 10⁴;
  * the compact form against the block-mass form at 10⁴ and 10⁵ (≤ 2·10⁻¹¹), and against the round-2 referee values
    at 10⁵, 3·10⁵ and 10⁶ (to 9 digits);
  * at the LP optima for 10⁴–10⁷: Lemma 1.3 to 6·10⁻⁹, Lemma 1.4(ii) with ratio ≤ 1.58, and Lemma 1.5. The Lemma 1.5
    constants were recomputed with integer rounding: ≤ 45.32x and 34.17x at x = 10³;
  * the explicit Theorem E(i) dual point, checked at every k ≤ x for x ≤ 10⁶.

### 8.2 Weak points

* **Theorem PZ covers plants with T₀ ≥ √x.** Plants entering the short blocks must sit on prime powers, or on a base
  with composite mass. Their secondary terms (at ρ + ρ₀ − 1) are controlled only under RH (ARGUED). Unconditionally
  they are of PNT-error size and are not controlled here. RIG covers every plant, but in the continuum limit, i.e.
  with sawtooth data at all real scales, not only at x/k.
* **κ(ρ₀) degenerates** when Im(w₂w̄₃) = 0, a discrete set of γ₀. Other geometric triples repair this; not written.
* **Theorem S(iii)** uses the standard implication "zero-free half-plane Re s > θ ⟹ Mert(y) ≪ y^{θ+ε}" without
  reproving it.
* **Theorem E(ii) equality** is measured at five values of x only (10⁴–10⁶).
* **All LP numbers are double precision.** The lower bounds are rescaled dual points, strictly feasible in floating
  point but not interval-certified.
* **The trend.**
  * The fit ν₁/√x ≈ 0.888 + 0.0121 log x has R² = 0.45 (n = 104; only 8 points at x ≥ 5·10⁶; §5.3).
  * On 10⁴–1.5·10⁷ it cannot distinguish √x·polylog from x^{0.512}.
  * The first is consistent with (DR); the second would make (DR) false.
* **Literature recollections** (Ng 2004; Titchmarsh ch. 14; Landau/Littlewood Ω-theorems) are from memory. Nothing was
  looked up off the machine.

### 8.3 What would overturn the verdict

* An explicit, analytically verifiable family of valid normalized certificates with ‖c^{(x)}‖₁ ≪ √x(log x)^A for all
  large x. That proves RH.
* A positivity argument proving Step 7 for every nonnegative dual point. That proves RH (Proposition 4.1).
* In the other direction, an unconditional construction of nonnegative dual points with objective ≫ √x(log x)^A for
  every A would make Claim 5C **false** (route dead even if RH is true). The measured slow growth of ν₁/√x leaves this
  open.

### 8.4 Novelty

* No novelty is claimed for: the Landau, Littlewood and Möbius-inversion inputs; Chebyshev's inequalities; the
  Euler–Maclaurin formula for partial zeta sums; the LP itself, which is round 2's.
* Lemma 1.1(c), Lemmas 1.3–1.5, Lemma 2.1, Theorems PZ, RIG, S, E, Proposition 4.3, the compact LP and all
  measurements are new in this repository. They have not been checked against the literature.

---

## 9. Status

RH is open. **NO QED.** The dual-rigidity attempt fails at Step 7.

* **The decisive test does not kill the route.** No dual-feasible sequence carries a planted off-line zero at a point
  where ζ ≠ 0: the plant is suppressed by |ζ(ρ₀)| (Theorem PZ, RIG), and in the LP fake-zero gains stay O(1) up to
  10⁷.
* **The push to the bound stops at Step 7.**
  * At the true-prime point Step 7 is RH (Proposition 4.1).
  * Without positivity it is the Mertens tiling hypothesis (HM), which is beyond RH as far as known (Theorem E,
    Proposition 4.3).
  * Steps 1–6 prove only Θ ≤ ν* ≤ 1/(2−Θ) (Theorem S); under RH, ν* ≤ 2/3.
* **The round-2 numerical lead does not hold as stated.** ν₁/√x is not flat. It rises slowly, from 1.013
  (x ≈ 10⁴–10⁵) to about 1.093 (x ≈ 10⁷), at about 0.0121 per unit of log x (first fit of Section 5.3). The rise sits in the
  tail and is only weakly correlated with the Mertens tiling sum at fixed scale. It cannot yet be told apart from a
  small power, x^{0.512}.

PT Λ ≤ 0.2 stands. No zero-free region, Λ bound or V7 floor exponent changes. Every PROVED item here is checked by its
author only and needs a fresh referee, and external review, before any use.
