# tro6-period: TRO6^♮ as a period of the sextic theta function

2026-11-16. Internal working note. Nothing committed or pushed. Files: `RESULT.md`, `check_L1.py`, `check_L1.log`
(this directory only).

**Verdict: precise obstruction.** No η > 0 is proved. One exact identity is new (Lemma L, PROVED and checked).
It turns the theta–row form into a Möbius-weighted sum of Rankin–Selberg periods of θ₆ against the *conjugate
sextic* Kubota series, so the "cubic rows" are sextic objects with a μ(c) weight. The period for each fixed
modulus c is automorphic; the sum over c is not, because of μ(c). Optimal (Lindelöf-strength) bounds for every
individual period do not beat Cauchy–Schwarz. The missing bound is stated in §4 (MB). RH open. NO QED.

Labels: PROVED / PROVED-rel X / CLASSICAL / SKETCH / HEURISTIC / CITED / OPEN.

---

## 1. Plan, and what is new against the atlas and walls

* Atlas (PR #27 `historical-routes.md`) §10 records the 7/8 boundary and PR #14; it has no period formulation of the
  P_a^{1/6} block. The 2026-11-03 sextic-theta notes proved Theorem A and Theorem D (block = probe) and listed
  "realise 𝔅 as a period / multiple Dirichlet series" as not done (literature note §7 items 1–3; proof note §7.4
  "UNPROVED"). This note does that step.
* Literature note §7 item 2 said a Voronoi formula for θ₆ would turn the sextic twist into a cubic twist
  ("χ^j ↦ χ^{−j−1}, cubic at j = 1"). That is the wrong orientation for the rows (§3 below): the row twist is the
  inverse of the Kubota index character, so the Kubota multiplier cancels and the dual sum carries Ramanujan sums,
  not cubic Gauss sums. This is a correction to that HEURISTIC item.
* Walls respected: nothing here is a finite certificate or a mean value used pointwise. The only arithmetic input is
  the Möbius weight μ(c)Ψ_ϑ(c), which is where the Euler product sits (§6).

## 2. Lemma L: the cubic rows are Möbius-twisted conjugate sextic Kubota coefficients

Notation of `sextic-theta-proof.md` §1: χ_c sextic symbol, γ_j(c) normalised Gauss sum of χ_c^j,
g̃(m, c) = N(c)^{−1/2}Σ_{d mod c}χ_c(d)e(md/c), α(c) = c/|c|, G(c) = conj(χ_c(4))γ₃(c).

**Lemma L [PROVED-rel manuscript (4.7); EXACT check].** For every squarefree primary c prime to S and every m ∈ O:

  γ₂(c) = μ(c)α(c)G(c)·conj(γ₁(c)),     γ₂(c)χ_c(m) = μ(c)α(c)G(c)·conj(g̃(m, c)).

*Proof.* (4.7) gives γ₂³ = μα and γ₁ = Gγ₂² with |γ₂| = |G| = 1. So γ₂ = γ₂³·conj(γ₂²) = μα·conj(γ₁·conj G)
= μαG·conj(γ₁). For (m, c) = 1, g̃(m, c) = conj(χ_c(m))γ₁(c). For (m, c) ≠ 1 both sides vanish (χ_c(m) = 0, and
g̃(m, c) = 0 because the additive character is trivial on a prime factor carrying a nontrivial character). ∎

Check: `check_L1.py`, brute force over 87 squarefree moduli (1–3 prime factors, norm ≤ 9000, one inert prime):
max error 6.2e-14 (first identity), 2.1e-12 (second), 3.1e-13 (vanishing at non-coprime index).

**Corollary L′ [PROVED-rel L, on the n = 1 part of the rows].** With Ψ := α²G²ν (target ϑ inside ν; α² is an
infinity type, G² is S-data), the row series T(t + 1/2, νχ_•(m)) restricted to n = 1 equals

  Σ_{c sf} μ(c)Ψ(c)·conj(g̃(m, c))·N(c)^{−1/2−t}.

So the theta–row form is

  𝔅 = Σ_c μ(c)Ψ(c)a_c · P_c,   P_c := Σ_m b(m)ρ^♮_σ(−e₀m)·conj(g̃(m, c)),              (2.1)

with a_c the smooth c-weight and b(m) = Ω(q_m/Q)ξ(m)(q_m/Q)^{−iv}. The n³ part multiplies by the quadratic
character χ_n(m)³ with absolutely convergent weight q_n^{−1−3t} [SKETCH: not carried through].

## 3. The period

**3.1 Without μ: a Rankin–Selberg period [CLASSICAL unfolding; SKETCH for the S-local bookkeeping].**
Let E₆(z, s; Ψ) be the Ψ-twisted Kubota Eisenstein series on the 6-fold cover with the same multiplier κ as θ₆, and
P_b the incomplete (non-metaplectic) Poincaré/Eisenstein series built from b. Then θ₆·conj(E₆) is non-genuine and

  Σ_c Ψ(c)N(c)^{−s}P_c = ⟨θ₆·P_b, E₆(·, s̄; Ψ̄)⟩   (up to S-local factors).

This is the diagonal Rankin–Selberg pairing of θ₆ with the Eisenstein series it is a residue of. Its continuation
and poles come from E₆ alone: no 1/L(s, ϑ). A power saving for the μ-free form is available from the continuation.
(The triple product θ₆·θ₃·θ₂ of literature note §7 item 1 is a different integral: it unfolds to index-coupled
coefficients ρ₆(m)·conj ρ₂(m) (the CFH pairing), not to the χ_c(m)-coupled form the rows have.)

**3.2 Each P_c is a closed-horocycle period [SKETCH; orientation checked against Patterson's cubic theorem].**
conj(g̃(m, c)) = N(c)^{−1/2}Σ_d conj(χ_c(d))e(−md/c), so P_c = N(c)^{−1/2}Σ_d conj(χ_c(d))Θ_b(−d/c), where
Θ_b(x) = Σ_m b(m)ρ(m)e(mx). The Eisenstein series whose m-th coefficient is Σ_c g̃(m, c)N(c)^{−u} has multiplier
κ(γ) = conj(χ_c(d)) on lower row (c, d). Hence θ₆(−d/c + iy) = χ_c(d)·θ₆(d̄/c + i/(|c|²y)): the factor χ_c(d) cancels
conj(χ_c(d)), and

  P_c = ε_c·N(c)^{−1/2}·(Q/N(c))·Σ_{m} ρ(m)·r_c(m)·b̃(N(m)Q/N(c)²)  +  P_c⁰,          (3.1)

with r_c(m) = Σ_{δ | (c, m)} μ(c/δ)N(δ) the Ramanujan sum, b̃ a Bessel transform, dual length X = N(c)²/Q, and P_c⁰ the
constant-term contribution, which depends on c only through N(c) and its class.
Orientation check: for n = 3 the same computation predicts that twisting τ₃ by the inverse of the Kubota index
character gives τ₃ at multiples; Patterson's τ₃(m) ∝ conj g₃(1, m) and twisted multiplicativity give
τ₃(mπ) ∝ χ_π(m)τ₃(m). Consistent.

**3.3 Dual form [SKETCH, from (2.1), (3.1)].** Since μ(c)μ(c/δ) = μ(δ) for squarefree c = δc′:

  𝔅 = 𝔅⁰ + Σ_{c′} μ²(c′)Ψ(c′) Σ_{δ} μ(δ)Ψ(δ)·w(δ, c′)·Σ_{m′} ρ(δm′)·b̃(·),               (3.2)

* 𝔅⁰ = Σ_c μ(c)Ψ(c)a_cP_c⁰ is a smooth Möbius sum: its Mellin transform is an explicit factor times 1/L^S(s, Ψ).
* The c′-sum is a smooth sum of a fixed nontrivial Hecke character: short by contour shift (unconditional).
* What remains is a **Möbius-weighted Type-I average of θ₆ over multiples of the level δ**.
* Applying the same step to Σ_{δ | m} returns (2.1). The identity is an involution; it does not shorten the form.

## 4. Sizes, and the exact missing bound

Rankin–Selberg normalisation ρ̃(m) = ρ(m)N(m)^{1/12} (mean square 1). Rows have length C in c, a_c ≍ N(c)^{−1/2};
Lemma 15.1 gives ‖B‖² ≪ Q^{1+ε}. Cauchy–Schwarz target: |𝔅| ≤ Q^{1+ε}; TRO6^♮(η) asks for Q·Z^{−ηb/12}.

**Proposition 4.1 [PROVED, bookkeeping].** If every period satisfies the square-root bound P_c ≪ Q^{1/2+ε}
(Lindelöf strength for the twisted L-series of θ₆ in the conductor aspect), summing (2.1) termwise gives
|𝔅| ≪ C^{1/2}Q^{1/2+ε}. Since the rows need C ≥ Q^{1−ε}, this is never below the Cauchy–Schwarz bound, and at the
manuscript's ratio log C/log Q ≈ (1 + ℓ)/M = 1.4 it is above it by Q^{0.2}. The same count in the dual form (3.2)
(A := N(δ) ≍ C, B ≍ C/Q, X = AB) gives the same Q^{1.2}. So subconvexity, or even Lindelöf, for the individual
periods gives no η > 0. Convexity-breaking "on average over c" in mean square is Theorem A (MV)/(MS) and is what
Cauchy–Schwarz already uses.

**Remark 4.2 [HEURISTIC: assumes Σ_δ|S_δ|² ≫ AB^{1−ε}].** A bound for (3.2) uniform in bounded coefficients α_δ in
place of μ(δ)Ψ(δ) is false at the needed strength: choosing α_δ as the conjugate phase of S_δ := Σ_{m′}ρ̃(δm′)b̃ gives
Σ_δ|S_δ| ≈ AB^{1/2}. So the cancellation has to come from the oscillation of μ(δ)Ψ_ϑ(δ) against δ ↦ S_δ.

**(MB) The exact missing bound [OPEN].** With A ≍ C, B ≍ C/Q, X = AB = C²/Q, uniformly in the target ϑ:

  Σ_{N(δ) ≍ A} μ(δ)Ψ_ϑ(δ) Σ_{N(m′) ≍ B} ρ̃^♮_σ(δm′)·W(m′, δ)  ≪  X·(Q/C)·Z^{−ηb/12}.

At log C/log Q = 1.4 this is level of distribution A = X^{7/9} for θ₆ with a saving X^{2/9+} over the trivial bound
X (square-root cancellation in both variables would be X^{1/2}). Equivalent undualised form: power saving for
Σ_c μ(c)Ψ_ϑ(c)a_cP_c beyond ‖a‖·(Σ|P_c|²)^{1/2}-type bounds, i.e. cancellation of μ(c)Ψ_ϑ(c) against the
closed-horocycle periods of θ₆. By Theorem D of the proof note this is the improved low bound for the probe.

## 5. Literature (web, 2026-11-16)

* **Dunn, "Metaplectic cusp forms and the large sieve", Algebra Number Theory 19 (2025) 1823–1880, arXiv:2403.13151**
  [CITED, statements read via the arXiv HTML]. For a fixed *cubic cusp* form f: bilinear form
  Σ μ²(a)α_aβ_bρ_f(ab) ≪ ((AB)^{1/2} + A^{3/2}B^{1/4})‖α‖_∞‖β‖₂ (Thm 1.5, useful for X^{2/3} ≪ B ≪ X^{1−ε}), and an
  averaged Type-I estimate ≪ (AX)^{1/3}‖μ²α‖₂ (Prop 1.6) that passes the level-2/3 bottleneck; prime sums with saving
  X^{−1/578}. Tools: Browning–Vishe circle method, Voronoi, Gauss–Ramanujan sums, Hecke operators T_{ν³}, cuspidality.
  This is the only located result with the shape of (MB) (kernel ρ(δm′), squarefree level weights). Transposed to (MB):
  at A = X^{7/9}, Prop 1.6 would save X^{1/54}; (MB) needs X^{2/9}. It is for n = 3 and cusp forms; for n = 6 the
  Hecke algebra acts only at sixth powers and the Whittaker space is not one-dimensional (Kazhdan–Patterson).
* **David–Dunn–Hamieh–Lin, arXiv:2306.11875** (quartic Gauss sums over primes): Type I/II via the quadratic large sieve
  and Suzuki's evaluation at squares. No odd-index input. [CITED, abstract]
* **Friedberg–Ginzburg arXiv:1403.3929, 1403.3930; Chinta–Friedberg–Hoffstein; Bröker–Hoffstein arXiv:1312.0568;
  Cai arXiv:1602.06614**: global integrals of theta functions against Eisenstein series on covers; all produce
  index-coupled Dirichlet series (Whittaker coefficient × Whittaker coefficient). None has a Möbius weight on Kubota
  moduli, and none treats θ₆ at odd indices. [CITED]
* Searched, not located: any 2024–2026 result on GL₂^{(6)} theta coefficients, any triple-product or period formula
  across covers of different degree beyond CFH/FG, any bilinear or Type-I estimate for n ≥ 4 theta coefficients.

## 6. DH control

The step that uses the Euler product is Lemma L: γ₁γ₂ = μαG is Hasse–Davenport, and it puts μ(c)Ψ_ϑ(c), the
coefficients of 1/L(s, Ψ_ϑ), on the Kubota moduli. For a Davenport–Heilbronn combination L = aL(Ψ₁) + bL(Ψ₂) the
coefficients of 1/L are not μ times a character, the rows are not Gauss-sum series, and (2.1) has no analogue. The
μ-free period of §3.1 exists for any coefficients and carries no zeros. So an argument for (MB) that does not use
multiplicativity of μ(δ)Ψ_ϑ(δ) would apply to bounded α_δ, which Remark 4.2 excludes (HEURISTIC) and Theorem D
excludes for any ϑ with a zero in the window (PROVED-rel, given (H_{σ₀})).

## 7. Verdict

Precise obstruction. A period identity exists and is exact at the Gauss-sum level (Lemma L): TRO6^♮ is the
statement that μ(c)Ψ_ϑ(c) is power-orthogonal to the closed-horocycle periods P_c of θ₆, equivalently (MB). No
triple-product or Rankin–Selberg identity for a single automorphic period gives it, and Lindelöf for each period
misses by (C/Q)^{1/2}. The one adjacent idea found (single pivot, not pursued): a Dunn-type bilinear large sieve for
the kernel ρ̃₆(δm′), which is target-blind in β but needs a Type-II decomposition of μ(δ)Ψ(δ); the required saving
X^{2/9} at level X^{7/9} is far from the X^{1/54} known in the cubic cuspidal case.

## 8. Three weakest steps

1. **(3.1)–(3.2) are SKETCH.** The cancellation of the Kubota multiplier is derived for the full-level multiplier
   and checked only against the cubic case. Ray classes σ, the S-unit e₀, the completion ρ^♮ (non-squarefree moduli),
   cusps other than ∞, and the Bessel transform are not carried through. The constant-term piece 𝔅⁰ is not sized.
2. **The row length C.** Proposition 4.1 uses C ≥ Q^{1−ε} and the toy ratio 1.4 from the conjecture note §4.3; the
   manuscript's rows are Mellin integrals with an n³ part, and the exponents 7/9, 2/9, 1/54 depend on that ratio.
3. **Remark 4.2** assumes a lower bound for the mean square of the Type-I sums S_δ that is not proved; and the
   claim in §3.1 that the μ-free form has a power saving is read off the expected polar structure of E₆, not proved.
