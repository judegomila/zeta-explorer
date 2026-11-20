# e2-cofinal-moebius-pointwise: pointwise bound for F_b(x) = Σ_k μ(k) r_b(x/k)

**Verdict: dead (restatement). No proof of RH. No bound changes. No statement about zeros is obtained.**

The item left open by lane e1 is not an independent lemma. For every b the Möbius sum has the closed form

  F_b(x) = ψ_b(x) − a·x[m(x) log x − β(x)] − c·x·m(x),  m(x) = Σ_{k≤x} μ(k)/k, β(x) = Σ_{k≤x} μ(k) log k / k,

and for the density-0 measures forced by e1 (a = 0) this is F_b(x) = ψ_b(x) − c·x·m(x) with 0 ≤ ψ_b(x) = O(log² x).
The sum is the classical function x·m(x) = Σ_{k≤x} μ(k) x/k up to a nonnegative polylog term. b ≥ 0 enters only
through that term. A one-sided bound F_b(x) ≤ Cx^θ (or ≥ −Cx^θ) for one such b with c > 0 is equivalent, up to ε, to
Θ ≤ θ (Θ = sup Re ρ): the one-sided exponent equals the two-sided one. The tail is an integral of M(x/u) − M(K)
against d r_b with no sign information. The first decisive test (x ≤ 10⁸) agrees: exponents 0.494 (max) and 0.494
(−min) for b = δ₁; 0.703 and 0.703 for the E_a control with a = 0.2.

Grades: PROVED = complete argument here, checked by its author only. CLASSICAL. MEASURED = float64, x ≤ 10⁸.
OPEN. Nothing here assumes RH; Θ is an unknown.

Sources read: BRIEF.md; e1-cofinal-legendre-dual/RESULT.md and REFEREE.md; OBSTRUCTION_MAP.md (controls, Q2,
closing statements 1-3, rows P13, P29); graph nodes cofinal-pointwise-mobius-sum, rig-continuum-sawtooth,
legendre-dual-limit-density-zero, spectral-head-mobius-poisson, mobius-interval-sign-reversal;
`formalization/rh-attempts/2026-11-01-r3-legendre-dual-lp.md` (Theorem RIG, Theorems S and E, Step 7);
PR 26 `research/rh/modules/spectral-head-theory.md` section 3 (read as text from refs/pr/26).

---

## 1. Plan

Combination: Theorem RIG × pointwise bound for F_b with one fixed cofinal b × finite Möbius-inverse head lemma ×
Landau (one-sided bound only).

1. First lemma: exact head + tail decomposition of F_b for three explicit density-0 b; identify what b ≥ 0
   controls.
2. First decisive test: F_b(x) for all x ≤ 10⁸, one-sided exponents of max F_b and of −min F_b, and the same for
   E_a weights, Liouville, a Beurling system and Davenport-Heilbronn.
3. Decide whether a one-sided exponent can differ from the two-sided one.

New relative to e1: the three explicit b, the tail written as an integral of M against d r_b, the equivalence
"one-sided bound for F_b ⇔ Θ ≤ θ" for density 0, the 10⁸ data, and the identification of the head lemma's
remainder with the same function.

---

## 2. Work

Notation (source, Theorem RIG): b ≥ 0 a locally finite measure on [1, ∞), ψ_b(t) = b([1, t]),
T_b(Y) = Σ_{n≥1} ψ_b(Y/n), r_b(Y) = T_b(Y) − aY log Y − cY, F_b(x) = Σ_{k≤x} μ(k) r_b(x/k).

### 2.1 The three measures (density 0)

| b | ψ_b(x) | T_b(Y) | c | r_b(Y) | sup \|r_b\|/(1 + log Y), sampled Y ≤ 2·10⁵ |
|---|---|---|---|---|---|
| b₁ = δ₁ | 1 | ⌊Y⌋ | 1 | −{Y} | 0.59 |
| b₂ = Σ_{j≥0} δ_{2^j} | ⌊log₂ x⌋ + 1 | Σ_{2^j≤Y} ⌊Y/2^j⌋ | 2 | −Σ_{2^j≤Y} {Y/2^j} − Y·2^{−⌊log₂Y⌋} | 1.77 |
| b₃ = dt/t | log x | ⌊Y⌋ log Y − log ⌊Y⌋! | 1 | −½ log Y + O(1) | 1.00 |

b₁ has bounded discrepancy (the class of e1 Theorem 2 with γ* = −1). b₂ (discrete, infinite support) and b₃
(absolutely continuous) have logarithmic discrepancy, the class 𝒞 of e1 Section 4 with a = 0. Theorem RIG applies
to all three.

### 2.2 Lemma 1: closed form (PROVED; it is e1 Proposition 3(a) solved for F_b)

For every locally finite b (no sign condition) and all real a, c, x ≥ 1:

  F_b(x) = ψ_b(x) − a·x[m(x) log x − β(x)] − c·x·m(x).   (1)

*Proof.* Σ_{k≤x} μ(k) T_b(x/k) = Σ_{kn≤x} μ(k) ψ_b(x/(kn)) = Σ_N ψ_b(x/N) Σ_{k|N} μ(k) = ψ_b(x).
Σ_{k≤x} μ(k)(x/k) = x m(x) and Σ_{k≤x} μ(k)(x/k) log(x/k) = x[m(x) log x − β(x)]. ∎

Check (`check_direct.py`, `check_direct.log`): F_b summed term by term from the definition of T_b against (1) at
x = 1000, 54321.5, 123456.789, 199999 for b₁, b₂, b₃ and for b = Λ (a = 1, c = −1): differences ≤ 7·10⁻¹⁰.
At x = 10⁸ and x = 99987655 for b₁: term-by-term sum −2046.416987 and −2126.159866, formula the same to the digits
printed (`main_1e8.log`).

### 2.3 Theorem A (PROVED / CLASSICAL): density 0

Let b ≥ 0 with a = 0 and |r_b(Y)| ≤ κ(1 + log Y) for all Y ≥ 1. Then:

(a) c ≥ 0 and F_b(x) = ψ_b(x) − c·x·m(x).
(b) 0 ≤ ψ_b(x) ≤ 3κ(1 + log x)(1 + log₂ x) + 2c + 2κ.
(c) If c > 0 and θ ∈ (0, 1): each of "F_b(x) ≤ Cx^θ for all large x" and "F_b(x) ≥ −Cx^θ for all large x" implies
  Θ ≤ θ. Conversely Θ ≤ θ implies |F_b(x)| ≪_ε x^{θ+ε}.
(d) F_b(x) = Ω_±(x^{1/2−ε}) for c > 0.

*Proof.* (a) is (1); c ≥ 0 since T_b ≥ 0. (b) T_b(Y) − 2T_b(Y/2) = Σ_n (−1)^{n+1} ψ_b(Y/n) ≥ ψ_b(Y) − ψ_b(Y/2)
(alternating sum of a nonincreasing sequence; this is where b ≥ 0 is used), and the left side equals
r_b(Y) − 2r_b(Y/2) ≤ 3κ(1 + log Y). Iterate down to [1, 2), where ψ_b ≤ T_b ≤ 2c + 2κ.
(c) ∫_1^∞ x m(x) x^{−s−1} dx = 1/((s − 1)ζ(s)) for Re s > 1. Suppose F_b ≤ Cx^θ. By (a), (b),
g(x) := C′x^θ + c·x·m(x) ≥ 0 for large x. Landau's theorem: the abscissa of convergence of ∫ g(x)x^{−s−1}dx is a
real singularity of C′/(s − θ) + c/((s − 1)ζ(s)). ζ has no zero on (0, 1) and 1/((s − 1)ζ(s)) is regular at s = 1,
so the only real singularity in s > 0 is s = θ. Hence 1/ζ is holomorphic in Re s > θ. The lower bound is the same
argument with C′x^θ − c·x·m(x), using ψ_b ≥ 0 only. Converse: M(x) ≪ x^{Θ+ε} (CLASSICAL) and
m(x) = −Σ_{k>x} μ(k)/k by partial summation. (d) from (c) and the existence of zeros on Re s = 1/2. ∎

Consequences.
* All three b give the same function: F_{b₁} = 1 − V, F_{b₂} = ⌊log₂x⌋ + 1 − 2V, F_{b₃} = log x − V, with
  V(x) := x·m(x) = 1 + Σ_{k≤x} μ(k){x/k}. No choice of density-0 b changes anything except the scalar c and a
  nonnegative term of size log² x.
* The one-sided statement "F_b(x) ≤ x^{1/2+ε}" for one such b is the classical RH-equivalent
  "m(x) ≥ −x^{−1/2+ε}". Landau gives its necessity for RH-type conclusions and nothing towards proving it.
* The one-sided exponent cannot differ from the two-sided one: both equal Θ.

### 2.4 Density a > 0 (class 𝒞 of e1)

By (1), F_b = e_b − a·U − c·V with e_b = ψ_b − ax, U(x) = x[m(x) log x − β(x) − 1], V = x·m(x). U and V do not depend
on b. A pointwise bound for F_b is a pointwise bound for e_b shifted by two universal Möbius sums of size
x^{Θ+ε} and Ω_±(x^{1/2−ε}). At b = Λ: F_Λ(x) = ψ(x) − x − U(x) + V(x), so "F_Λ ≪ x^{1/2+ε}" is RH (e1 and the
source, Proposition 4.1). For general b ∈ 𝒞 with a > 0 the statement stays OPEN and is not made easier by (1);
it is the statement e_b(x) ≪ x^{θ} itself.

### 2.5 Head and tail (PROVED identity; MEASURED sizes)

Put r_b(1⁻) := 0, so d r_b on [1, ∞) is dT_b − (smooth density) du with an atom T_b(1) − c at u = 1 (a = 0). For
1 ≤ K ≤ x:

  F_b(x) = H_K(x) + tail_K(x),  H_K = Σ_{k≤K} μ(k) r_b(x/k),
  tail_K = ∫_{[1, x/K)} (M(x/u) − M(K)) d r_b(u)
     = ∫_{[1, x/K)} (M(x/u) − M(K)) dT_b(u)  −  c·x·(m(x) − m(K))   (a = 0).   (2)

*Proof.* r_b(x/k) = ∫_{[1, x/k]} d r_b(u); interchange: Σ_{K<k≤x/u} μ(k) = M(x/u) − M(K). The smooth part is
Σ_{K<k≤x} μ(k)·c·x/k. ∎ For b₁ the first term is Σ_{j≤x/K} (M(x/j) − M(K)).

What b ≥ 0 controls: dT_b = d(1 ∗ b) is a nonnegative measure, so
|∫ (M(x/u) − M(K)) dT_b| ≤ sup_{K<v≤x} |M(v) − M(K)| · T_b(x/K). This is a size bound of order (c·x/K)·sup|M|, far
above F_b. The integrand M(x/u) − M(K) changes sign, the two terms of (2) cancel to relative 3·10⁻⁴ (table), and
positivity of dT_b gives no sign for the difference. The tail is a sum of M(x/j) against increments of r_b with
no sign information. It also contains nothing beyond (1): tail_K = ψ_b(x) − c·x·m(x) − H_K.

MEASURED (`main_1e8.log`), b₁, x = 10⁸, F = −2046.4170:

| K | H_K | tail_K | ∫ (M(x/u) − M(K)) dT_b | −c·x·(m(x) − m(K)) |
|---|---|---|---|---|
| 2⁴ | −0.07 | −2046.34 | −6 073 925 | +6 071 878.66 |
| 2¹⁰ | +4.34 | −2050.76 | +149 494 | −151 544.76 |
| 2¹⁴ | +4.95 | −2051.37 | +184 054 | −186 105.37 |
| 2¹⁶ | −61.77 | −1984.64 | −17 825 | +15 840.36 |
| 2²⁰ | −205.58 | −1840.84 | −23 899 | +22 058.16 |
| 2²⁴ | −167.99 | −1878.42 | −1 411 | −467.42 |
| 2²⁶ | −2305.37 | +258.95 | +1 599 | −1 340.05 |

(tail_K from the term-by-term sum and from (2) agree to the digits printed, at both x.)

* The head changes sign with K (−0.07, −1.41, −2.94, +4.34, −17.33, +4.95, …) and at the second point
  x = 99987655 the signs are different (+0.75, +1.90, +3.23, −3.12, +18.84, −19.77). This is the cutoff sign
  reversal of node mobius-interval-sign-reversal in the present sum.
* For K ≤ x/6 the head is at most about 10% of F (largest: 10.0% at K = 2²⁰). F is carried by k > x/6, where x/k < 6 and r_b(x/k) sees only the first
  five steps of the sawtooth: F is a combination of M(x/j), j ≤ 5, and smooth sums. No finite head approximates F.
* Proved pointwise bound for the head: |H_K| ≤ κ(1 + log x)·#{squarefree k ≤ K}. The measured values are of order
  √K at two points x only; that size is a mean-square statement over x and was not proved or measured as such.

### 2.6 The head lemma (spectral-head-mobius-poisson)

The remainder of that lemma is r(y) = M₁(λ/y)/(2y) with M₁(R) = Σ_{d≤R} μ(d)/d = m(R). So
r(y) = (1 − F_{b₁}(λ/y))/(2λ): the same function as F_{b₁}. The lemma uses only
‖r_even‖² = (2λ)⁻¹ ∫_1^{λ²} |m(R)|² dR = o(λ), a mean-square input of PNT strength, and concludes injectivity. It
supplies no pointwise and no one-sided information on m. Composed with Lemma 1 it adds nothing.

### 2.7 First decisive test (MEASURED)

`run_main.py`, log `main_1e8.log`, data `main_1e8.json`. Segmented sieve (segments of 10⁷), all integers x ≤ 10⁸
and the left limits x → n⁻ (for a = 0, F_b is ψ_b minus a function linear in x between integers, so for b₁ the
extremes are at these points). Planned memory printed: 2.1 GB of full-length arrays plus 1.1 GB per segment.
Check values: M(10⁸) = 1928 (known value), 10⁸·m(10⁸) = 2047.4170.

A first run was killed by the 8 GB cap (exit 137, `main_1e8_killed_by_cap.log`): the head/tail step built four
full-length float arrays. It was rewritten in chunks; the cap was not raised.

Extremes on blocks [10^e, 10^{e+1/4}), least-squares slope of log(block maximum) against log x over
10³ ≤ x ≤ 10⁸ (in brackets: slope of the running envelope):

| function | exponent of max F | exponent of −min F | expected |
|---|---|---|---|
| F_{b₁} = 1 − x m(x) | 0.494 (0.496) | 0.494 (0.494) | 1/2 both |
| F_{b₂} = ⌊log₂x⌋ + 1 − 2x m(x) | 0.473 (0.476) | 0.525 (0.524) | 1/2 both; the offset +ψ_b ≤ 27 tilts the fit |
| F_{b₃} = log x − x m(x) | 0.466 (0.469) | 0.540 (0.539) | 1/2 both; offset +log x |
| E_a, a = 0.2, b = δ₁ | 0.703 (0.702) | 0.703 (0.702) | 1/2 + a = 0.7 both |
| Liouville, target √Y/ζ(½), b = δ₁ | F/x → 0.8326 | F > 0 | linear term −12x/(π²ζ(½)) |
| Liouville, after removing the linear term | 0.241 (0.232) | 0.298 (0.301) | squarefree-count error, not Θ |
| Beurling (2 replaced by 2.5), b = δ₁ | 0.504 (0.502) | 0.508 (0.508) | 1/2 both |
| Davenport-Heilbronn, target 0 | F_b = ψ_b exactly | — | no remainder |

Normalised extremes of F_{b₁}: max F/√x ∈ [0.25, 0.46] and min F/√x ∈ [−0.43, −0.26] on every
quarter-decade block from 10³ to 10⁸ (√x taken at the upper end of the block). For b₂ and b₃ the difference between the two fitted exponents is the additive term ψ_b ≥ 0 at small x
(Theorem A(b)); max F/√x and −min F/√x for b₃ are within 0.01 of those of b₁ for x > 10⁶.

Decision: on x ≤ 10⁸ the one-sided growth exponents of max F_b and of −min F_b agree with each other and with
the two-sided exponent, for ζ and for E_a. This is what Theorem A(c) proves for every range.

---

## 3. Controls

Analogue for coefficients a(n) with inverse a⁻¹: T^a_b(Y) = Σ a(n) ψ_b(Y/n), smooth target S, and
F^a_b(x) = Σ_k a⁻¹(k)[T^a_b(x/k) − S-part] = ψ_b(x) − Σ_{k≤x} a⁻¹(k)·(smooth part at x/k). Lemma 1 holds verbatim for
every a(n) with a(1) = 1. `check_direct.py` confirms Σ_k a⁻¹(k) A(x/k) = 1 to 10⁻⁸ for DH, Liouville and E_a at
x = 10³, 54321, 2·10⁵.

| control | outcome | reason |
|---|---|---|
| E_a = ζ(s+a)ζ(s−a), a = 0.2 | **passes every step; returns 1/2 + a** | a⁻¹ multiplicative with a⁻¹(p) = −(p^a + p^{−a}), a⁻¹(p²) = 1. F = 1 − C₊x^{1+a}P₊(x) − C₋x^{1−a}P₋(x), P_±(x) = Σ_{k≤x} a⁻¹(k)k^{−(1±a)}. Measured exponents 0.703 / 0.703 on x ≤ 10⁸. Lemma 1, Theorem A and (2) do not separate ζ from E_a; the identity reports whatever the zeros are. |
| Davenport-Heilbronn | lemma is empty | f entire, target 0, r = T, so F_b = ψ_b identically for every b. sup_{Y≤2·10⁵} \|A(Y)\| = 1.284; Σ_{k≤x} \|a⁻¹(k)\| ≈ x^{1.04}. The Möbius-type sum has no remainder to bound; the content is whether b ≥ 0 with small \|T^{DH}_b\| exists, and e1 Proposition 5 gives ψ_b = O(x^ε) for all such b. Λ_DH is not ≥ 0 (no Euler product). |
| sign twist (Liouville) | different structure | a⁻¹ = μ² ≥ 0 (checked exactly for n ≤ 2·10⁵): the inverse sum has no cancellation. With target 0, F_b = ψ_b; with the polar target √Y/ζ(½), F has a linear term 0.8326x and a remainder with measured exponents 0.24 / 0.30 (error term of the squarefree count). The sawtooth weights have signs, so b ≥ 0 does not make T^a_b monotone and Theorem A(b) fails. |
| Beurling integers | passes with the same exponent in the case built | Built: odd integers times powers of 2.5, ζ_N = ζ(s)(1 − 2^{−s})/(1 − 2.5^{−s}), N(Y) − (5/6)Y = O(log Y). F = 1 − (5/6)x[m_odd(x) − m_odd(x/2.5)/2.5]; exponents 0.504 / 0.508. A Beurling system with N(Y) − ρY = Ω(Y^θ), θ > 1/2, was not built; by Lemma 1 its F is 1 − ρ·x·m_N(x) with exponent sup Re(zeros of ζ_N) (ARGUED, not run). |
| θ^w (w = 3) | not run | Lemma 1 holds; a⁻¹ has Σ\|a⁻¹\| ≍ X^{1.91} (e1). |
| unimodular twist ζ(s + iτ) | not run | a⁻¹(k) = μ(k)k^{−iτ}; F complex; exponent Θ by the same Mellin argument (ARGUED). |
| backward heat, T-NR, phase-rotated transfer operator | no analogue | no coefficient sequence a(n) fixed by the control. |

No step of this lane fails for a control for a structural reason tied to the zeros. The identity is true for every
coefficient sequence and returns the control's own exponent. Requirement 3 of the assignment is not met.

---

## 4. Where the three requirements and MV-CAP stand

* All primes together: yes (μ on all integers), but only through the classical function m(x).
* Uniform in height, every window: (1) and (2) are exact at every x. The bound needed is the pointwise bound on
  x·m(x); nothing here supplies it.
* Fails for the controls for a structural reason: no (Section 3).
* **Use of more than a mean-square bound: none.** The steps beyond identities are: Theorem A(b) (monotonicity,
  gives a polylog), Landau (converts an assumed one-sided bound into Θ ≤ θ; gives Ω_± in the other direction), the
  head lemma (mean square of m, PNT strength), e1 Proposition 4 (mean square given Θ). The required statement is
  pointwise in x. MV-CAP applies to every available input.

End point in the terms of the brief: the cofinal sum for a density-0 b is the Mertens-type function x·m(x); for
density a > 0 it is e_b itself. Nothing passes from the mean square to a single x.

---

## 5. Verdict

**Dead as an attack; recorded as a restatement.**

1. PROVED: F_b(x) = ψ_b(x) − a·x[m log x − β] − c·x·m(x) for every b; for a = 0 and b ≥ 0 with logarithmic
   discrepancy, F_b = −c·x·m(x) + O(log² x) with the O-term ≥ 0.
2. PROVED / CLASSICAL: for such b with c > 0, a one-sided bound F_b ≤ Cx^θ or F_b ≥ −Cx^θ implies Θ ≤ θ, and
   Θ ≤ θ implies |F_b| ≪ x^{θ+ε}. One-sided exponent = two-sided exponent = Θ.
3. PROVED: tail_K = ∫ (M(x/u) − M(K)) d r_b(u); b ≥ 0 bounds the dT_b part only in absolute value at size
   (x/K)·sup|M|. MEASURED: the two parts cancel to 3·10⁻⁴ at x = 10⁸; the head changes sign with K and with x.
4. MEASURED (x ≤ 10⁸): exponents 0.494 / 0.494 (b₁), 0.703 / 0.703 (E_a, a = 0.2), 0.504 / 0.508 (Beurling case).
5. The head lemma's remainder is the same function m; its input is a mean square.

Pivot: not taken. The adjacent variants (another b in 𝒞, another cut K, another smooth target, weights other than
μ) change F_b by ψ_b, by a rearrangement of (2), or by another universal sum Σ a⁻¹(k)(x/k)^w; each is covered by
Lemma 1.

Proposed graph update: node cofinal-pointwise-mobius-sum should change from open-lemma to restatement
("equals e_b minus universal Möbius sums; for density 0 equals −c·x·m(x) + O(log² x)"), with E_a as the control
that passes.

---

## 6. Three weakest steps

1. **Fitted exponents are finite-range.** Slopes over 10³-10⁸ on quarter-decade blocks have an uncertainty of a few
   hundredths (b₂, b₃ show 0.47 / 0.53 because of the offset ψ_b). They illustrate Theorem A(c); they do not
   establish an exponent. For E_a and the Liouville rows the extremes were taken at integers and left limits
   only, although F is not linear between integers there. float64 with exact segment carries (fsum); no interval
   arithmetic.
2. **Density a > 0 is not closed by a theorem.** Section 2.4 shows the statement for F_b is the statement for e_b
   shifted by universal sums; it does not prove that the one-sided exponent of F_b equals Θ for every b ∈ 𝒞 with
   a > 0 (Landau then requires the Mellin transform R̂_b to be nonzero at zeros of maximal real part, which was not
   examined for general b).
3. **Controls are partial.** The Beurling system built has O(log Y) discrepancy and the same zeros as ζ in the
   strip; the Ω(Y^θ) case, θ³, the unimodular twist and the operator controls were argued or not run. The head
   size "of order √K" rests on two values of x.

---

## Files

All in `tmp/research-2026-11-16/push/e2-cofinal-moebius-pointwise/`.
* `run_main.py`, `main_1e8.log`, `main_1e8.json`: segmented sieve to 10⁸, block extremes, fits, head/tail table.
  `main_1e8_killed_by_cap.log`: the first run, killed by the memory cap.
* `check_direct.py`, `check_direct.log`: term-by-term check of Lemma 1 for b₁, b₂, b₃, Λ; Dirichlet inverses and
  the inversion identity for DH, Liouville, E_a.
* All runs local through `scripts/memcap.sh 8`, interpreter `.venv-arb/bin/python`. The compute server was not used.
  No repo data module was imported or executed.
