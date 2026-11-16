# r2-tro6-type12-split: Type I / Type II decomposition of the theta–row form

2026-11-16, round 2. Internal working note. Nothing committed or pushed. Not refereed.
Files (this directory only): `RESULT.md`, `ident.py` + `ident.log` (exact identities, independent code),
`typeII_measure.py` + `.log` + `.json` (operator norm of the Type-II matrix), `orient_test.py` + `.log`
(test of the dual formula's orientation).

Labels: PROVED / PROVED-rel X / EXACT (identity checked numerically by independent code) / CITED / CONDITIONAL-on X /
MEASURED / HEURISTIC / OPEN.

**Verdict: precise obstruction.** TRO6^♮(η) is not proved for any η > 0. θ = 7/8 unchanged. RH open. NO QED.

What is established:

1. **[PROVED + EXACT] Index-shift twisted multiplicativity (§2).** For coprime squarefree primary a, b prime to 6 and
   every m: g̃(m, ab) = R(a, b)·g̃(m, a)·g̃(m a⁴, b). Hence the μ-normalised row kernel k(m; c) = Ψ(c)·conj g̃(m, c)
   satisfies k(m; ab) = R(a, b)^{e+1}·k(m; a)·k(m a⁴; b) for Ψ = α²G^eν. A Type-I sum at level a is a Kubota series
   at the shifted index m a⁴. No dual formula is needed for the split.
2. **[EXACT, correction to round 1] The weight.** The manuscript row (paper.txt l. 2721) is γ₂(c)α(A)Ψ(A)**G(A)**: the
   row carries one G and Lemma L supplies a second. On the n = 1 part the weight is Ψ = α²G²ν, and G² is a character
   (R² = 1). The referee's "G, not multiplicative" applies to the conjecture note's shorthand row without G. For that
   variant (e = 1) the factor R(a, b)² = 1 cancels in the split. For the manuscript row (e = 2) one R(a, b) remains;
   it is a quadratic character of the class of b mod 4 determined by the square class of a (4 cases).
   G itself is a sum of 4 characters mod 4, not 12 (§2, I5).
3. **[PROVED bookkeeping, PROVED-rel (LB)] Range map in the original normalisation (§6–§7).** Type II is consistent
   only for Q^{0.4+2η} ≤ N(a), N(b) ≤ Q^{1−2η} (toy geometry N(c) ≍ Q^{7/5}). Outside it the required inequality
   contradicts the size of the entries. Type I must therefore reach level Q^{0.4}.
4. **[CONDITIONAL-on (RS)] Type I (§5).** The pieces are Rankin–Selberg sums θ₆ × conj E₆^{Γ₀(a)}. Convexity in the level
   aspect with conductor N(a)² gives a saving for N(a) ≤ Q^{1/2−η}. This is not proved here: the continuation and the
   conductor exponent are a hypothesis, stated in §5.
5. **[OPEN] Type II (§6).** The exact inequality (BIL) is stated. No known large sieve gives it in any sub-range:
   the sextic large sieve gives Q^{0.8} against the required Q^{1/2−η}.
6. **[CITED + PROVED arithmetic] Dunn arXiv:2403.13151v5 (TeX source read).** His Prop 1.6 is "Voronoi, then the cubic
   large sieve" applied to the cubic analogue of our **primal** form (his (1.14)). Transposed to n = 6 it is the
   passage dual → primal followed by a bound weaker than Lemma 15.1. His Thm 1.5 has diagonal term (AB)^{1/2}, which is
   sharp; in the dual form it leaves no admissible range (§6.4).
7. **[MEASURED]** At Q = 3199 the Type-II matrix, after removing the polar part, has operator norm at the
   random-matrix level in every box tested (§6.5). The polar part is rank one with exponent −0.31 to −0.33.

---

## 1. Plan; what is new against the atlas, the walls and round 1

* Atlas (PR #27 §10): 7/8 boundary; no Type I/II analysis of the P_a^{1/6} block. Round 1: `tro6-period` (Lemma L,
  dual sketch (3.1)–(3.2), (MB)); `tro6-sieve` (Prop S: rows of length < Q^{1/2}, any coefficients; large sieves
  cannot cover the range); `tro6-numerics` and `tro6-spectral` (polar law). Not done there: the Vaughan split, the
  Type-I objects, the Type-II inequality and its admissible window, a line-by-line reading of Dunn.
* Not duplicated: Prop S and the polar law are used as inputs. The numerics here reuse `tro6-numerics` data
  (ρ^♮ for N(m) ≤ 3199, symbols for N(c) ≤ 10⁵) for two new measurements; the identity checks use new code.
* Walls. DH: §8. MV-CAP: the target is a bilinear statement, not a mean value used pointwise. Flow-blindness and
  verified height: not engaged.

Toy geometry used for all exponents: rows m with N(m) ≍ Q, n = 1 moduli c with N(c) ≍ D = Q^{7/5} (D = Z^{7/6},
Q = Z^{5/6}), a_c ≍ N(c)^{−1/2}, ρ = ρ^♮_σ(−e₀·) with Σ_{N(m)≤Q}|ρ|² ≍ Q^{5/6}, ‖B‖² ≪ Q (Lemma 15.1).
Cauchy–Schwarz: |𝔅| ≤ Q^{11/12}. Target: Q^{11/12−η_Q}; Z^{−ηb/12} = Q^{−η/80}, so η = 80η_Q (capped at 1).

## 2. Exact identities

Notation of `sextic-theta-proof.md` §1. χ_c sextic symbol, g̃_j(m, c) = N(c)^{−1/2}Σ_{d mod c}χ_c(d)^j e(md/c),
γ_j(c) = g̃_j(1, c), α(c) = c/|c|, G(c) = conj(χ_c(4))γ₃(c), R = r of manuscript (4.4).

**Lemma 2.1 [PROVED; EXACT I1, I2].** Let a, b be coprime primary elements prime to 6, b arbitrary, a squarefree.
For every m ∈ O:

  g̃(m, ab) = R(a, b)·g̃(m, a)·g̃(m a⁴, b).

*Proof.* CRT with d = d₁b + d₂a gives g̃(m, ab) = χ_a(b)χ_b(a)g̃(m, a)g̃(m, b). Manuscript Lemma 4.4:
χ_b(a) = R(a, b)χ_a(b), so χ_a(b)χ_b(a) = R(a, b)χ_b(a)². For (k, b) = 1, g̃(mk, b) = conj(χ_b(k))g̃(m, b); with
k = a⁴, conj χ_b(a⁴) = χ_b(a)². ∎

**Corollary 2.2 [PROVED; EXACT I3].** With f_j(m; c) := γ₂(c)α(c)G(c)^jχ_c(m) (row coefficient; j = 1 is the
manuscript, j = 0 the conjecture-note shorthand) and k_e(m; c) := α(c)²G(c)^e conj g̃(m, c):

  f_j = μ·k_{j+1} (Lemma L),  f_j(m; ab) = R(a,b)^j f_j(m; a) f_j(m a⁴; b),  k_e(m; ab) = R(a,b)^{e+1} k_e(m; a) k_e(m a⁴; b).

So the row kernel is twisted-multiplicative with the twist "replace m by m a⁴" (a cubic character of b). A Hecke
character ν multiplies through. For j = 1 the remaining R(a, b) = r(sqclass a, sqclass b) is one of 4 characters of
b mod 4.

**Lemma 2.3 [EXACT I1, I5].** G depends only on c mod 4. G(ab) = G(a)G(b)R(a, b), and G² is multiplicative.
G = ψ₃·½(1 + ε_λ + iε_{−1} − iε_{−1}ε_λ), where ψ₃ is one cubic character of (O/4)^× and ε_{−1}, ε_λ are the two
quadratic characters on the square-class generators: 4 nonzero Fourier coefficients, each of modulus 1/2.

**Lemma 2.4 [EXACT I4].** Vaughan for μ on primary elements: for all c and U ≥ 1,
μ(c) = 2μ(c)1_{N(c)≤U} − Σ_{abd=c; N(a),N(b)≤U}μ(a)μ(b) + Σ_{ab=c; N(a),N(b)>U}μ(a)κ_U(b), κ_U(b) = −Σ_{d|b, N(d)≤U}μ(d).

**Lemma 2.5 [EXACT I6] (n³ part).** χ_{cn³}(m) = χ_c(m)χ_n(m)³, G(cn³) = G(c)G(n³)R(c, n), G(p³) = γ₃(p).

Checks (`ident.log`; own Z[ω] arithmetic, brute-force Gauss sums over complete residue systems, no import of
`tmp/sextic`): 229 squarefree moduli of norm ≤ 2600 built from both conjugates of the split primes ≤ 97 and inert
−5, −11; 518 coprime pairs (244 with R = −1); 1554 triples (a, b, m) including m sharing a prime with a or with b.

| identity | max error |
|---|---|
| I0 Lemma L, both forms, all m | 7.7e-15, 3.1e-14 |
| I1 χ_b(a)/χ_a(b) = r(a,b); G(ab) = G(a)G(b)R; G² multiplicative; G class function mod 4 (12 classes) | 0 (exact sign), 5.1e-15, 1.0e-14, 6.4e-15 |
| I2 g̃(m,ab) = R g̃(m,a) g̃(m a⁴,b) | 4.0e-14 |
| I3 f_j, j = 0, 1; k_e, e = 1, 2 | 7.6e-15, 8.4e-15; 4.0e-14, 4.0e-14 |
| I4 Vaughan, 627 cases, U = 5, 12, 26 | 0 failures (integers) |
| I5 Fourier expansion of G | 4 nonzero coefficients, Σ|ĝ|² = 1.000000 |
| I6 n³ part, 898 cases | 1.6e-15, 2.3e-16 |

## 3. The dual formulas (3.1)–(3.2): what is carried, what is conditional

**3.1 Status.** (3.1) is a Voronoi formula for θ₆ at moduli prime to S. It is not proved here. Hypothesis:

> **(V) [OPEN; cubic cuspidal analogue CITED: Dunn Prop 8.17 and (1.14)].** For squarefree primary c prime to S,
> (d, c) = 1, a smooth radial w and ρ̃ = ρ^♮N(·)^{1/12}:
> Σ_m w(N(m)/Q)ρ̃_σ(−e₀m)e(md/c) = χ_c(d)·(Q/N(c))·Σ_τ ε_{σ,τ}(c mod M₀)·Σ_m ρ̃*_τ(m)e(−m d̄ u_τ/c)·w̃_τ(N(m)Q/N(c)²) + C_σ(c),
> with finitely many dual coefficient systems ρ̃*_τ (theta coefficients at the cusps with moduli divisible by the
> level; mean square ≪ X^{1+ε}), a fixed modulus M₀ supported on S, units u_τ, Bessel transforms w̃_τ of rapid decay,
> and a constant-term contribution C_σ(c) depending on c only through N(c) and c mod M₀.

Dunn's (1.14) is this statement for a cubic cusp form read from the other side: Σ_{n ≡ 0 (a)}ρ_f(n) equals
(X/A²)·conj g(a)·Σ_{N(ν)≪A²/X}ρ_f(ν)(ν/a)₃. The multiples of the modulus correspond to the twist by the residue symbol
with the Gauss sum, which is the orientation of (3.1). For θ₆ the differences are the constant terms (θ₆ is residual,
not cuspidal) and the degree of the cover.

**3.2 Corrected (3.1)–(3.2) [CONDITIONAL-on (V)].** Summing (V) against conj χ_c(d) the multiplier cancels and

  P_c = N(c)^{−3/2}Q·Σ_τ ε_{σ,τ}(c)·Σ_m ρ̃*_τ(m)·r_c(m)·w̃_τ(N(m)Q/N(c)²)·Q^{−1/12} + P_c⁰,  r_c(m) = Σ_{δ|(c,m)}μ(c/δ)N(δ).

Insert in 𝔅 = Σ_c μ(c)Ψ(c)a_cP_c with c = δc′, μ(c)μ(c/δ) = μ(δ)μ²(c′):

  𝔅 = 𝔅⁰ + Q^{11/12}Σ_{classes (s, s′) mod M₀}ε(ss′)Σ_τ Σ_{δ ∈ s}μ(δ)Ψ(δ)N(δ)Σ_{m′}ρ̃*_τ(δm′)·K_{s′}(δ, N(δm′)),   (3.2′)
  K_{s′}(δ, y) := Σ_{c′ ∈ s′, (c′,δ)=1}μ²(c′)Ψ(c′)R(δ, c′)^e·a_{δc′}N(δc′)^{−3/2}·w̃_τ(yQ/N(δc′)²).

Changes against round 1: (i) the class function ε(c) is not multiplicative, so the classes of δ and c′ are fixed
(finite sum); (ii) R(δ, c′)^e with e the G-exponent of Ψ: absent for the manuscript weight (e = 2), a quadratic
character of c′ for e = 1; (iii) G expands over 4 characters when e = 1; (iv) the sum over c′ is a smooth sum of the
Hecke character Ψ·R(δ,·)^e (infinity type α², not trivial), so K ≪ (N(c′)-length)^{1/2}·N(δ)^{−2}·(conductor)^{1/4}
by convexity for L(1/2+it, Ψ).

**3.3 Which (δ, m′) matter [CONDITIONAL-on (V); PROVED arithmetic].** Put N(c′) ≍ Y′, N(δ) ≍ D/Y′,
N(m′) ≍ Y′D/Q, X := D²/Q = Q^{9/5}. The piece is ≍ (Q/(DY′^{1/2}))·Σ_δΣ_{m′}ρ̃*(δm′) in the ρ̃ normalisation where the
target is Q^{1−η_Q}. Cauchy–Schwarz in δ gives (QD)^{1/2}/Y′ = Q^{1.2}/Y′. So:

* Y′ ≥ Q^{0.2+η_Q}: covered (convexity in c′ only).
* Y′ ≤ Q^{0.2}: open. This is δ ∈ [X^{2/3}, X^{7/9}], m′ ∈ [X^{2/9}, X^{1/3}], and the required bound is
  Σ_δ μΨ(δ)Σ_{m′}ρ̃*(δm′)W ≪ X^{7/9}Y′^{1/2}Q^{−η_Q}  (this is (MB) with the class restriction and the factor Y′^{1/2}).

The dual form is Q^{0.2} above Cauchy–Schwarz before anything is tried (referee's point). Everything below is
therefore done in the primal form, where Lemma 2.1 makes the split exact and (V) is not needed.

**3.4 Orientation test [MEASURED, inconclusive] (`orient_test.log`).** With a smooth m-weight, Im P̃_c (P̃_c := P_cχ_c(−e₀);
the polar part and the estimator self-term are real) samples the non-polar remainder. Units: random level 1.00,
estimator-noise level 0.20.

| prime c, N(c) in | n | mean (Im P̃)²/‖ρw‖² |
|---|---|---|
| (16, 57] (below Q^{1/2}) | 9 | 0.056 ± 0.012 |
| (57, 160] | 23 | 0.234 ± 0.071 |
| (160, 480] | 53 | 0.717 ± 0.094 |
| (480, 1280] | 116 | 0.376 ± 0.048 |
| (1280, 3199] | 243 | 0.810 ± 0.080 |
| (3199, 10⁵] | 9153 | 0.75 – 0.94 |

* N(c) < Q^{1/2}: remainder absent. This confirms Prop S of `tro6-sieve` on data (MEASURED).
* (V) predicts, for prime c, only the δ = 1 term (few dual terms, transient) and the δ = c term (onset near N(c) ≍ Q).
  The non-monotone profile (rise, dip at 480–1280, rise) is compatible with that and is not what a cubic-twisted
  dual sum would give (monotone onset at Q^{1/2}), but the onset scales depend on the Bessel transform and were not
  computed. No conclusion is drawn. (V) stays OPEN.

**3.5 The n³ part [PROVED reduction; SKETCH for uniformity].** By Lemma 2.5 and Lemma L the full row is

  B_m = Σ_n α(n)³G(n³)ν(n)³·χ_n(m)³·q_n^{−1−3t}·Σ_{c sf}μ(c)α(c)²G(c)²ν(c)R(c, n)·conj g̃(m, c)·q_c^{−1/2−t}V(q_cq_n³/D).

For each n this is the n = 1 form with: m-weight b(m)χ_n(m)³ (periodic mod n, a quadratic character for squarefree
n), row length D_n = D/q_n³, and Ψ replaced by Ψ·R(·, n) (one of 4 characters mod 4). After the shift to Re t = 0
the weights are q_n^{−1}: the sum over n is not absolutely small, Σ_{q_n ≤ D^{1/3}}q_n^{−1} ≍ log D.

* Consequence: the n-sum cannot be truncated by the triangle inequality. Each n needs the saving, or the tail needs
  an n-resolved form of Lemma 15.1 (‖Σ_{q_n>N₀}(…)‖² ≪ Q^{1+ε}N₀^{−1}), which is not in the manuscript. [OPEN, minor;
  `tro6-numerics` measures 2.5–6.9% of ‖B‖² in the n³ part, consistent with it.]
* Prop S of `tro6-sieve` uses only the period of the row term in m. The period of χ_{cn³} is q_cq_n, not q_cq_n³.
  So Prop S covers the terms with q_cq_n ≤ Q^{1/2−3δ} [PROVED-rel Theorem A, same proof]. With D_n = D/q_n³ this is
  q_n ≥ Q^{0.45+}; with the trivial bound for the norm of that sub-row the net saving exists only for
  q_n ≥ Q^{0.464}, against the maximum D^{1/3} = Q^{0.467}. A sliver.
* For q_n = Q^{ν} with ν < 0.45: the Type I/II map of §7 applies with D replaced by D_n = Q^{1.4−3ν} and with the
  m-vector ρ replaced by ρ·χ_n³ (a quadratic twist of conductor q_n; same norm). The Type-II window becomes
  max(1, D_n/Q) ≤ N(a), N(b) ≤ min(Q, D_n), and the Vaughan combinatorics close as in §7 because D_n/Q ≤ Q^{0.4}.
  What is not controlled is the dependence on q_n: (RS) and (BIL) are needed for the twisted vector uniformly in
  q_n ≤ Q^{0.45}, and the conductor in (RS) grows with q_n. [PROVED arithmetic; uniformity OPEN.]

## 4. Vaughan in the original normalisation [PROVED, exact]

By Lemma 2.4 and Corollary 2.2, for every U ≥ 1 and every m:

  μ(c)k(m; c) = 2μ(c)k(m; c)1_{N(c)≤U} − Σ_{a₁a₂b=c; N(a_i)≤U}μ(a₁)μ(a₂)·ϱ·k(m; a₁a₂)k(m(a₁a₂)⁴; b)
               + Σ_{ab=c; N(a),N(b)>U}μ(a)κ_U(b)·ϱ·k(m; a)k(m a⁴; b),      ϱ = R(·,·)^{e+1} ∈ {±1},

on squarefree c (the kernel vanishes otherwise when (m, c) = 1; moduli sharing primes with m are the completion
corrections of proof note (3.9)). No Euler product of an L-function is used: the identity is the Dirichlet inverse of
the constant function, transported by a twisted-multiplicative kernel.

* Type I, level A: Σ_{N(a)≍A}α_a·N(a)^{−1/2}ν(a)… Σ_m b(m)ρ(m)·k(m; a)·[Σ_b Ψ(b)ϱ(a,b)N(b)^{−1/2−t}V(N(ab)/D)·conj g̃(m a⁴, b)].
* Type II: Σ_{N(a)≍A}Σ_{N(b)≍B}α_aβ_b·ϱ(a,b)·Σ_m b(m)ρ(m)k(m; a)k(m a⁴; b), AB ≍ D.

## 5. Type I: θ₆ × Kubota–Eisenstein at level a

**5.1 Identification [PROVED from Lemma 2.1].** The inner b-sum is a smooth sum of the conjugate sextic Kubota series
at index m a⁴, twisted by the Hecke character Ψϱ(a,·), over moduli prime to a (stripped; converted to complete
series at indices m a⁴c₁⁴ by proof note (3.9)). Equivalently N(a)^{u}Σ_{c ≡ 0 (a)}conj g̃(m, c)N(c)^{−u}: the m-th
coefficient of the conjugate Kubota Eisenstein series for Γ₀(a). So the Type-I sum at level a is the Rankin–Selberg
sum Σ_m b(m)·ρ^♮(m)·conj(coefficient of E₆^{Γ₀(a)}(·, 1/2 + t + u)), integrated against Ṽ(u)(D/N(a))^u.

**5.2 Polar terms [PROVED-rel Theorem A at index m a⁴; sizes HEURISTIC].**
* u-pole at 2/3 (b-aspect): N(a)^{−1/2}(D/N(a))^{1/6}·Σ_m b(m)ρ(m)·conj(g̃(m, a)ρ^{str}(m a⁴)). By proof note (3.9) the
  inner product is the c₁ = a term of a mean square of theta coefficients, of size N(a)^{−1/3}Q^{5/6}. So the term is
  ≍ Q^{5/6}D^{1/6}N(a)^{−1}, and with weights α_a the level-A piece is Q^{5/6}D^{1/6}Σ_aα_aN(a)^{−1}: above the target by
  up to Q^{0.15} piece by piece. These terms recombine over the Vaughan pieces into the polar part of the full form,
  Q^{5/6}·Σ_c μ(c)Ψ(c)u_cN(c)^{−5/6−t}V(N(c)/D) (polar law of `tro6-spectral`/`tro6-numerics`, MEASURED, not proved).
  They must be removed before the split.
* Given the polar law and a zero-free half-plane Re s > σ₀ for L(s, Ψψ) (ψ over the finite class characters), the
  polar part is ≪ Q^{5/6}D^{σ₀−5/6+ε}. With σ₀ = 7/8: Q^{5/6+7/120} = Q^{0.892}, i.e. η_Q = 1/40. [CONDITIONAL-on polar law
  and the manuscript's 7/8.] Caveat in §9 item 2.

**5.3 Level [CONDITIONAL-on (RS)].**

> **(RS) [OPEN].** For squarefree a, 𝒵_a(u, w) := Σ_m ρ^♮(m)ξ(m)·conj(g̃(m, a)D^{(a)}(m a⁴; u))·N(m)^{−w} continues in w
> from Re w > 11/12 to Re w ≥ 5/12 with at most the polar-law pole, and on Re u = 1/2, Re w = 5/12 satisfies the
> convexity bound ≪ (N(a)^{κ}(1+|u|)(1+|w|))^{1/4+ε}·(1+|u|+|w|)^{O(1)} with κ = 2.

Reason for κ = 2: 𝒵_a is the unfolding of ∫θ₆·conj E₆^{Γ₀(a)}(u)·E^{Γ₀(a)}(w) against the non-metaplectic Eisenstein
series; level 1 × level a gives conductor N(a)². Continuation in w comes from E^{Γ₀(a)}(w) alone (scattering matrix of
Γ₀(a)∩Γ, Hecke L-functions; no 1/L of the target). None of this is carried out here.

**Proposition 5.1 [PROVED-rel (RS)].** The non-polar Type-I piece at level A with |α_a| ≤ 1 is
≪ Σ_{N(a)≍A}N(a)^{−1/2}·Q^{5/12}N(a)^{κ/4+ε} = Q^{5/12+ε}A^{1/2+κ/4}. It is below Q^{11/12−η_Q} iff A ≤ Q^{(1/2−η_Q)/(1/2+κ/4)}:
A ≤ Q^{1/2−η_Q} for κ = 2 (A ≤ Q^{1/3} if κ were 4). Largest level reached by continuation plus convexity:
**Q^{1/2} = D^{5/14}**. Lindelöf on average over a would give Q^{1−}; subconvexity in the level aspect is not available
for these objects.

**What is actually proved about Type I:** only Prop S of `tro6-sieve` (rows of c-length < Q^{1/2}, all coefficients).
The functional-equation length of the b-sum at index m a⁴ is Q^{1/2}N(a), so Lemma R + Poisson (the proof of Prop S)
is at its boundary already at a = 1 and gives no saving for any level. [PROVED arithmetic]

## 6. Type II

**6.1 The inequality.** Let R(c) := P_c − P_c^{pol} (non-polar remainder of P_c = Σ_m b(m)ρ^♮_σ(−e₀m)conj g̃(m, c)).

> **(BIL)(η_Q; A, B) [OPEN].** For all complex α, β supported on squarefree primary a, b prime to S with N(a) ≍ A,
> N(b) ≍ B, AB ≍ D = Q^{7/5}, uniformly in the class data and (1+|v|)^{O(1)}:
>
>   |Σ_aΣ_b α_aβ_b·ϱ(a, b)·R(ab)| ≪ Q^{1/2−η_Q+ε}·‖α‖₂‖β‖₂·(Σ_{N(m)≤CQ}|ρ^♮_σ(−e₀m)|²)^{1/2}.

Kernel form: R(ab) = Σ_m b(m)ρ(m)·conj(g̃(m, a)g̃(m a⁴, b))·R(a,b) − polar; the phase is χ_a(m)χ_b(m)·conj χ_a(b)²
up to separable factors. In the dual form (CONDITIONAL-on (V)) the kernel is ρ̃*(δm′) with δ = ab, and the
corresponding statement is Σ_aΣ_bΣ_{m′}α_aβ_bρ̃*(abm′)W ≪ X^{7/9}Y′^{1/2}Q^{−η_Q}·sup|α|·sup|β| on the ranges of §3.3.

**6.2 Admissible window [PROVED-rel (LB)].** (LB): Σ_{N(a)≍A, N(b)≍B}|R(ab)|² ≫ AB·Σ|ρ|² (entries of typical size ‖ρ‖;
MEASURED: mean |z|² = 1.83 against 2 for random, §6.5). The operator norm of an n_A × n_B matrix is at least its
Frobenius norm divided by min(n_A, n_B)^{1/2}. So ‖K‖_op ≫ max(A, B)^{1/2}‖ρ‖, and (BIL)(η_Q) forces

  **Q^{0.4+2η_Q} ≤ A, B ≤ Q^{1−2η_Q}**   (D/Q = Q^{0.4}).

Outside the window no bilinear inequality with ℓ² norms can hold; those ranges must be Type I. At A = B = Q^{0.7} the
slack between the required Q^{1/2} and the lower bound Q^{0.35} is Q^{0.15}.

**6.3 What known sieves give [PROVED arithmetic from CITED bounds].**
* Sextic large sieve in (m | c = ab) (manuscript Lemma 9.1; (Q + D + (QD)^{2/3})^{1/2}): Q^{0.8}‖α‖‖β‖‖ρ‖. Short by Q^{0.3+η_Q},
  uniformly in the split. It ignores the bilinear structure.
* Cubic large sieve in (a | b) for each m (kernel conj χ_a(b)²): loses the whole m-sum, factor Q^{1/2}·(A+B+(AB)^{2/3})^{1/2}.
* Cauchy–Schwarz in a, then orthogonality in a against the pair (m, b): operator norm (QB)^{1/2} at best: short by B^{1/2}.
* Any bound uniform in the vector ρ is false at the required strength: ρ_m = conj χ_{c₀}(m) gives one entry of size
  Q^{1/2}‖ρ‖. (BIL) is a statement about θ₆.
No sub-range of the window is covered.

**6.4 Dunn, arXiv:2403.13151v5, read from the TeX source [CITED].**
* **Thm 1.5** (label `type2a`): for a cubic cusp form f on Γ₂, A, B ≥ 10, X ≍ AB,
  Σ_{ab ≡ u (v)}μ²(a)α_aβ_bρ_f(λ^{−3}ab)W_K(N(λ^{−3}ab)/X) ≪ (XKN(v))^ε K⁸N(v)⁴((AB)^{1/2} + A^{3/2}B^{1/4})‖μ²α‖_∞‖β‖₂.
  Proof (§10): Cauchy–Schwarz in b (Lemma `convolutionsums`); Prop `conv1`: Σ_{a₁,a₂}α ᾱ·Σ_bρ_f(a₁b)conj ρ_f(a₂b) ≪
  (AB + A³B^{1/2})‖α‖²_∞ by the Browning–Vishe circle method (moduli N(c) ∼ B^{1/2}), two Voronoi summations at levels
  a₁, a₂, Cauchy–Schwarz + Rankin–Selberg for the off-diagonal (AB^{1/2} per pair) and the average over a₁, a₂ for the
  diagonal. Used: automorphy (Voronoi), cuspidality ("since the forms are cuspidal, zero frequencies contribute
  nothing"), Σ|ρ_f|² ≪ X^{1+ε}, squarefree a. Not used: Hecke multiplicativity of ρ_f, any pointwise bound.
* **Prop 1.6** (label `type1avgbd`): Σ_{ab ≡ u (v)}μ²(a)α_aρ_f(λ^{−3}ab)W_K ≪ (XKN(v))^ε K^{14/3}N(v)^{17/6}(AX)^{1/3}‖μ²α‖₂.
  Proof (§9): Voronoi in b gives (1.14) = (X/A²)ΣΣμ²(a)conj g(a)α_aρ_f(ν)(ν/a)₃, N(ν) ≪ A²/X; then Heath-Brown's cubic
  large sieve (Cor 4.2: M^{1/6}(M^{1/2}+N^{1/2})).

Transposition to n = 6 [PROVED arithmetic; the n = 6 statements themselves OPEN]:
* (1.14) is the cubic analogue of our primal form (a ↔ c, ν ↔ m, A²/X ↔ Q, so X ↔ D²/Q, A = X^{7/9}). Prop 1.6 for
  θ₆ would be "(V), then the sextic large sieve on the primal form": X^{53/54} with the cubic exponents, against the
  target X^{7/9}. In primal units this is the Q^{0.8} of §6.3, weaker than Lemma 15.1 + Cauchy–Schwarz (Q^{0.5}),
  which the manuscript already has because its coefficients are μΨ·smooth. No sub-range.
* Thm 1.5 for θ₆, applied to the dual Type-II sum with δ = ab, n = b m′ (A′ = N(a), X = A′N): bound
  X/A′^{1/2} + A′^{3/4}X^{3/4}. The target X^{7/9}Y′^{1/2} needs A′ ≥ X^{4/9}/Y′ from the first term and A′ ≤ X^{1/27}Y′^{2/3}
  from the second. Empty for every Y′ ≤ Q^{0.2} = X^{1/9}. The first term is the diagonal and is sharp for sup-norm α,
  so even an ideal diagonal-only theorem covers only max(N(a), N(b)) ≥ X^{4/9} = Q^{0.8} and leaves
  Q^{0.6} < N(a), N(b) < Q^{0.8} uncovered.
* Could Thm 1.5 be proved for θ₆? The steps that are not degree-specific: Cauchy–Schwarz, circle method, Voronoi with
  the sextic Kubota multiplier (needs (V) with additive twists at two levels), Rankin–Selberg mean square (true for
  ρ̃: Theorem A (MS)). The step that fails as written: cuspidality. θ₆ has constant terms at every cusp; the zero
  frequencies give main terms (the polar law is one of them) which have to be computed and removed. The Hecke
  algebra and Whittaker multiplicity (the round-1 objection) are not used in Thm 1.5 at all. So a θ₆ version of Thm
  1.5 with the same diagonal term is plausible, but by the previous item it does not reach the starting line.

**6.5 Measurement [MEASURED] (`typeII_measure.log`).** z(c) := (P̃_c − κN(c)^{−b})/‖ρ_{σ(c)}‖ with the leave-one-out
correction of `tro6-numerics`; K = (z(ab)) on boxes inside and at the edge of the window; N(ab) ≤ 10⁵ ≈ 1.24·Q^{1.4}.
Polar fit exponent b = 0.334, 0.327, 0.313 at Q = 800, 1600, 3199 (heuristic 1/3). Q = 3199 (11454 generic rows):

| box N(a) × N(b) | n_A × n_B | s₁ raw | s₁, s₂, s₃ (polar removed) | rms·(√n_A+√n_B) | phase-null s₁ | s₁/√rows |
|---|---|---|---|---|---|---|
| (158,316]² | 46 × 46 | 53.7 | 16.4, 15.3, 14.5 | 17.4 | 16.3 ± 0.3 | 0.15 |
| (53,316]² | 77 × 77 | 117.2 | 22.1, 21.2, 20.8 | 22.4 | 21.4 ± 0.3 | 0.21 |
| (50,100] × (500,1000] | 14 × 139 | 53.0 | 20.2, 18.8, 18.2 | 21.0 | 19.7 ± 0.3 | 0.19 |
| (17,100] × (167,1000] | 24 × 234 | 115.5 | 26.0, 24.5, 23.3 | 25.9 | 24.9 ± 0.3 | 0.24 |
| (16,32] × (1581,3162] | 5 × 445 | 61.9 | 29.3, 29.1, 27.5 | 31.1 | 29.6 ± 0.4 | 0.27 |
| (5,32] × (527,3162] | 9 × 742 | 125.4 | 37.9, 37.4, 36.3 | 39.1 | 37.4 ± 0.4 | 0.36 |
| (1,316]² | 91 × 91 | 194.3 | 24.6, 23.7, 23.7 | 24.0 | 22.7 ± 0.3 | 0.23 |

* Raw: one large singular value, 3–8 times the bulk. It is the polar part (rank one, positive).
* Polar removed: s₁ is between −0.7 and +6.6 phase-null standard deviations from the null (largest excess 8%, in
  the full box (1,316]², which contains small norms where the one-parameter polar fit is least accurate), and below
  the random-matrix value rms·(√n_A+√n_B) in 5 of 7 boxes; s₁ ≈ s₂ ≈ s₃ (no outlier). Same at Q = 800, 1600. The
  variant with the sign R(a, b) agrees within 5%.
* Reading: no low-rank structure is visible in the remainder at this size. The bound required by (BIL) corresponds
  to s₁ ≲ √rows·Q^{−η_Q}; the measured ratios 0.15–0.36 are the values max(n_A, n_B)^{1/2}·rms/√rows of a random
  matrix. Limits: 20% of ‖ρ̂‖² is estimator noise (random by construction); n_A, n_B ≤ 742; a structured component
  smaller than the bulk edge is not detectable; exponents cannot be resolved at Q = 3199.

## 7. Range map (toy geometry D = Q^{7/5}; exponents of Q; η = 80η_Q)

Primal split c = ab, N(a) = Q^{θ}:

| piece | range | status | saving it would give |
|---|---|---|---|
| polar part | all c | CONDITIONAL: polar law (MEASURED) + zero-free 7/8 | η_Q = 1/40 (see §9.2) |
| rows of length < Q^{1/2} (n³ sliver, short pieces) | q_cq_n ≤ Q^{1/2−} | PROVED-rel Thm A (Prop S, `tro6-sieve`; period remark §3.5) | (q_cq_n)²/Q to the 1/12 |
| Type I, smooth b | θ ≤ 1/2 − η_Q | CONDITIONAL-on (RS), κ = 2 | η_Q = 1/2 − θ |
| Type I, smooth b | 1/2 < θ < 1 | OPEN; needs Lindelöf on average over a | — |
| Type II | 0.4 + 2η_Q ≤ θ ≤ 1 − 2η_Q | OPEN = (BIL); MEASURED random-like at Q = 3199 | η_Q of (BIL) |
| Type II | θ < 0.4 or θ > 1 | impossible, PROVED-rel (LB) | — |

Combinatorics [PROVED]: Vaughan with U = Q^{u}, 0.4 + 2η_Q ≤ u ≤ 1/2 − η_Q. First term: Type I at level ≤ U. Second
term (a = a₁a₂ ≤ U², b smooth): Type I if N(a) ≤ Q^{1/2−η_Q}, otherwise Type II with θ ∈ (1/2, 2u] ⊂ window and
N(b) ≥ D/U² ≥ Q^{0.4}. Third term: Type II with θ ∈ [u, 1.4 − u] ⊂ window. So (RS) + (BIL) on the window + the polar
law give TRO6^♮ on the n = 1 part with η_Q = min of the three savings. The interval for u is nonempty iff
η_Q ≤ 1/30. Any η_Q ≥ 0.00027 is the whole fixed-geometry prize (η* = 0.0219).

Dual split (CONDITIONAL-on (V)), δ = c/c′, N(c′) = Y′, X = Q^{9/5}:

| (δ, m′) range | status |
|---|---|
| N(δ) ≤ X^{2/3−}, N(m′) ≥ X^{1/3+} (Y′ ≥ Q^{0.2+η_Q}) | covered: convexity for L(1/2+it, Ψ) in c′ |
| N(δ) ∈ [X^{2/3}, X^{7/9}], N(m′) ∈ [X^{2/9}, X^{1/3}] | open; target X^{7/9}Y′^{1/2}Q^{−η_Q} |
| same, by Dunn Prop 1.6 for θ₆ | X^{53/54}: not covered (it is the primal large sieve) |
| same, by Dunn Thm 1.5 for θ₆ on δ = ab | empty: needs N(a) ≥ X^{4/9}/Y′ and N(a) ≤ X^{1/27}Y′^{2/3} |

## 8. DH control

* The Möbius factor comes from the Gauss-sum cube γ₂³ = μα (Hasse–Davenport), not from the target. The target
  enters only through the character ν in Ψ. The Vaughan identity of §4 is the inverse of the constant function 1
  and uses no Euler product. Lemma 2.1 uses only the multiplicativity of ν in the split Ψ(ab) = Ψ(a)Ψ(b)R^e.
* 𝔅 is linear in ν. For a Davenport–Heilbronn combination ν = c₁ν₁ + c₂ν₂ the form is c₁𝔅(ν₁) + c₂𝔅(ν₂), and every
  statement of §4–§7 holds for it if it holds for ν₁ and ν₂. So (RS) and (BIL), which are target-free, do not
  distinguish DH from an Euler product, and they need not: they would give TRO6^♮ for ν₁ and ν₂ separately.
* The step that fails for a non-multiplicative target is outside TRO6: μ(c)ν(c) is the coefficient of 1/L(s, ν) only
  for completely multiplicative ν. For the combination, μ(c)(c₁ν₁ + c₂ν₂)(c) are the coefficients of c₁/L₁ + c₂/L₂,
  not of 1/(c₁L₁ + c₂L₂). The manuscript's probe (Prop 2.1, tuple coefficients ϑ(p_{J^c})) turns a bound for 𝔅 into
  zero information through 1/L(s, ϑ); for DH the same bound gives information about the zeros of L₁ and L₂, not of
  the combination. The polar part shows it directly: it is Q^{5/6}·(truncated c₁/L₁ + c₂/L₂ at 5/6 + t).

## 9. Verdict and the three weakest steps

Precise obstruction. The split is exact in the primal form (Lemma 2.1), the missing factor R is accounted for, and
the problem is reduced to three target-free statements about θ₆: the polar law, (RS) at level ≤ Q^{1/2}, and (BIL)
on Q^{0.4} ≤ N(a), N(b) ≤ Q. (BIL) is the content; no existing large sieve covers any part of its window, and a
Dunn-type theorem for θ₆, even in ideal form, does not help in the dual form. No η > 0.

Weakest steps:

1. **(RS) and κ = 2 are not derived.** The continuation of the triple integral θ₆·conj E₆^{Γ₀(a)}·E^{Γ₀(a)}, its polar
   terms, the bound on Re w > 11/12 uniformly in a, and the conductor exponent are asserted from the shape of the
   objects. If κ = 4 the Type-I level is Q^{1/3} < Q^{0.4} and the Vaughan combinatorics of §7 do not close
   (a Heath-Brown identity with more variables would be needed, and the gap Q^{1/3}–Q^{0.4} would be Type II outside
   the admissible window, i.e. impossible).
2. **Toy geometry and the zero channel.** All exponents use D = Q^{7/5}, n = 1, one scale. In this toy the polar part
   at a zero β₀ = 7/8 is Q^{−1/40} below Cauchy–Schwarz, whereas Theorem D of the proof note says the aggregated form
   reaches the Cauchy–Schwarz size exactly at β₀ = 7/8. So either the toy scales are not the manuscript's (slots,
   tuples, n³, Y′), or zeros enter the remainder through a coherent term not identified here. Until this is
   reconciled, the row "polar part: η_Q = 1/40" and the claim that (RS) + (BIL) + polar law suffice are statements
   about the toy, not about Θ_ϑ(Z).
3. **(LB), (V) and the measurements.** The window of §6.2 rests on a lower bound for Σ|R(ab)|² that is measured, not
   proved. (V) (orientation, constant terms, ray classes, e₀, Bessel transform) is not derived; the orientation test
   is inconclusive. The Type-II measurement is at Q = 3199 with matrices of at most 742 columns and 20% estimator
   noise; it excludes a large low-rank component, nothing finer.
