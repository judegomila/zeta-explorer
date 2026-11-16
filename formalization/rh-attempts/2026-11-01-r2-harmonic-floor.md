# RH attempt, round 2 (1 November 2026): a harmonic floor for the compressed Weil operator

**Outcome: the attempt fails. No proof of RH, no new zero-free region, no change to any Λ bound. NO QED.**
Internal working note; not externally refereed; nothing committed.

The attempt (Section 3) uses the fact that the finite Euler product ζ_X has no zeros in Re s > 0, so that log|ξ_X| is
harmonic in the critical strip. It writes the actual compressed Weil form q_λ (λ² = X) exactly as a positive-kernel
average of an odd harmonic potential H_X on the line σ = ½ + η, with η = κ/log X (Theorem H2). All primes stay
coupled inside one harmonic function. The attempt then tries to prove a floor for that potential (the Harmonic Floor
Lemma, Step 4) by an archimedean anchor at large height, the minimum principle and Harnack's inequality. If Step 4
held, the compressed form would satisfy ε₀(λ) ≥ −C(1 + log λ)^m, which is RH by the V7 floor (atlas §10; round-1
operator Theorem C).

## The line where it fails

**Step 4, part (4d) (Section 3.4): the anchor line.** The minimum principle and Harnack's inequality only move a lower
bound from one vertical line to another. Some line has to carry a bound that is proved independently, and there is
none:

1. **Far-line floors only get worse (Theorem H3, PROVED).** For every completion g, the normalized floor
   m_g(η) = inf_t H_g(½ + η + it)/η is non-increasing in η, and m_g(0) = inf_t σ_g(t) is the round-1 pointwise symbol
   floor. So any far-line floor implies the round-1 pointwise floor (EP_m). Its t = 0 slice is the one-sided Chebyshev
   bound Σ_{n<X} Λ(n) n^{−1/2} ≤ 2√X + C(log X)^m, which is RH by Landau (round-1 Theorem E). Moving to the far line
   gains nothing and loses the factor sinh(ηW)/(ηW) at the band edge. Measured: for the sharp completion at η = 0.4,
   inf H/η = −12.0, −29.1, −53.4 at X = 10², 10³, 10⁴, against (sinh(0.4W)/(0.4W))·inf σ^♭ = −12.4, −30.6, −52.4.
2. **No line at distance ≫ 1/log X is controlled, even under RH.** On such lines the potential is the band-edge
   amplification of the Dirichlet lobes of the zeros (item 1). The lines where the Euler product is controlled
   (σ ≥ 1 + ε) cost X^{1/2+ε} to transport, which is the trivial floor p = 1. A zero-free strip of width c used as an
   anchor costs X^c, which is at best the V7 exponent p = 2c, so nothing is gained. This is the "expected stop" of the
   round-1 synthesis, confirmed and made quantitative.
3. **The harmonic premise carries no arithmetic.**
   * **DH test (Section 4.5).** The coefficients Λ(n), n < X, can be completed to the entire, zero-free function
     ζ^♭_X = exp(Σ_{n<X} Λ(n) n^{−s}/log n). It has the same compressed form as ζ_X. The same construction works for
     every Dirichlet series, so Theorems H1–H3 hold verbatim for Davenport–Heilbronn (identity checked to 3.7·10⁻¹³).
     DH's Weil form has Rayleigh quotients −3.09, −10.5, −24.4, −53.0 at support 2a = 6, 8, 10, 12, so Step 4 is false
     for DH.
   * **Fake test (Section 4.6).** A genus-2 "zeta" over F₅, P(T) = 1 + 11T² + 25T⁴, has an off-line quadruple at
     Re s = 0.6378 with non-real ordinate (arg β = π/2). It also has all of the following:
     - closed-point counts a_d ≥ 0;
     - zero-free finite Euler products;
     - a functional equation and rationality;
     - no real zeros.
     The harmonic identities hold for it, while its compressed floor falls like −3.4·(1.248)^N. Step 4 and its box
     (Landau) slice are false for it. An RH-true control has compressed floor 0 and only polynomially negative
     pointwise floors.

So Step 4 needs an input that DH and the genus-2 fake both lack: a one-sided arithmetic estimate on the actual rational
primes. That is the first item of the atlas closing line ("a genuine all-scale signed arithmetic estimate"). Harmonic
analysis of finite Euler products does not supply it. RH is open, and Platt–Trudgian Λ ≤ 0.2 stands.

Grades:
* **PROVED**: a complete argument written here, checked by the author only. No independent referee ran in this round.
  The argument failed, so there is no surviving claim that would need one.
* **PROVED-A**: proved here from results the audit records as accepted, each cited by module and section.
* **STANDARD**: classical, cited, not re-derived.
* **NUMERIC**: IEEE double / numpy / scipy / mpmath; not interval arithmetic.
* **ARGUED**: reasoning that is not fully written out.
* **CONDITIONAL**: depends on a named unrefereed input.

Files:
* Scripts: `tmp/rha-harmonic-floor-{lib,identity,infscan,fakesearch,fake,dh,extra,t0}.py`.
* Outputs: `tmp/rha-harmonic-floor-out/*.json`.
* Environment: `.venv-arb/bin/python -I`; one process per script, each under 90 s and under 1 GB.

---

## 0. Relation to the audit (PR #27) and to round 1

### 0.1 What was read

The following were read before this file was written:
* The audit snapshots `/tmp/atlas-snap-*.md`. The round-1 synthesis checked them byte-identical to `refs/pr/27`.
* The atlas §§1–12 with its closing line, and PUBLICATION_SCOPE_2026-10-30.
* The module notes: arithmetic foundation, spectral head, signed complement, whole-even certificate, spectral repair,
  Suzuki recurrence, prime memory, finite Suzuki certificate.
* The round-1 synthesis and all five round-1 files, in particular `2026-11-01-operator.md`, whose objects are reused
  here.
* The headers of the four round-2 sibling files: density profile, modular tower, phase alignment, Stepanov.
* The wall modules: `src/data/flow-blindness-no-go.js`, `src/data/imp-95530-native-span-arithmetic-input-rigidity.js`,
  `formalization/paper/mv-cap-theorem.md` with the route-42 corrections, and
  `research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`.
* The fifty-route synthesis.

### 0.2 The round-1 operator failure and what is different here

Round 1 built the multiplier M_X with symbol σ_X and tried to prove the pointwise bound σ_X ≥ −C(log X)^m. It failed at
its Step (4b), which split the primes at Y(t) and bounded the large primes pointwise from a mean-square estimate. That
inference is invalid (MV-CAP). The referee also argued that the split is false for large X.

This attempt differs in four ways:
* **No prime split.** Every inequality in Sections 2–3 is applied to one harmonic function containing all primes
  p ≤ X (or all n < X).
* **No mean value.** No step infers a pointwise bound from a mean-square bound. No mean-value theorem is used anywhere.
* **The target is the compressed form, not the pointwise symbol.** Two tools are used:
  - the null freedom of the compression: any completion of the coefficients Λ(n), n < X, gives the same form
    (Theorem H1);
  - an exact harmonic transport of the form to a line at distance η ≍ 1/log X (Theorem H2). This distance matches the
    resolution of support log X, as the round-1 synthesis proposed.
* **The DH and fake tests were run first**, as the synthesis asked. The fake used is a genus-2 one with non-real
  off-line zeros. The round-1 F₅ fake has a real off-line zero, which is the exceptional case of round-1 Theorem F.

Round 1 also showed that the t = 0 slice of the pointwise floor is RH (its Theorem E). The new results here locate the
harmonic route relative to that slice. Theorem H3 shows that every harmonic far-line floor contains the round-1
pointwise floor; the transport does not weaken it. Sections 4.5–4.6 show that the harmonic and Euler-product-soft
ingredients hold for DH and for the fake, where the floor is false.

### 0.3 Overlap table (atlas sections cited for every overlap)

| Ingredient | Atlas / module overlap | What is different here |
|---|---|---|
| Compressed operator H_λ, 5/4 normalization, symbol σ_X | spectral head §1; whole-even §1; round-1 operator §§1–2 | Reused unchanged (round-1 Theorems A, B, C, E). |
| Odd harmonic potential H_X; zero-freeness of ζ_X | atlas §2 (twin ladder, shifted kernel, Hermite–Biehler) | §2 asks for strict shifted-kernel positivity (RH-equivalent) and records that "passive finite products ... do not supply this". Here no positivity of H is claimed: polylogarithmic negativity is allowed, the shift is the strip width η = κ/log X and not a fixed a, and the Hermite–Biehler property of ξ_X is shown to fail (§4.4). No part of the argument uses passive or contractive finite products. |
| Null freedom of the compression | §9 (null-symbol duals, completeness) | §9's exact dual sup_W inf_t (V_L + W) = ε₀ is used as stated. New: harmonic far-line certificates form a sub-cone of the §9 certificates and are never better (Theorem H3, Remark H3.1). Euler completions with more primes are strictly worse at t = 0 (§4.2). |
| Floor ⇒ half-plane | §10 (V7 `03-landau.tex`); arithmetic foundation §2 | Used through round-1 Theorem C. The harmonic transport reproduces the V7 exponent relation p = 2c and gains nothing (§4.3). |
| t = 0 slice: one-sided Chebyshev | arithmetic foundation §2; Suzuki §4 / prime memory (signed credit prefix); round-1 Theorem E | Theorem H5 gives a Harnack-principle version: RH ⟺ the corrected Euler products log\|ζ_Y\| − Re E_Y are bounded above at real points. It is the same Landau target in log-modulus form, not a new lever. |
| Positivity of the Euler data | §3 (positive Gibbs data blind to the absolute floor); §11 (gamma bulk; Markov no-go) | Harnack needs a positive harmonic function. The natural ones are circular (§4.4). Positivity of a_d and of Λ is fake-valid (§4.6). |
| Uniform positive margin | §11 ("the wrong RH target") | The target allows −C(log X)^m. Under RH the actual form is ≥ 0, while every pointwise and far-line floor is negative (§4.6 control). |
| Off-line zeros in the harmonic picture | route 48 (phase retrieval, Hilbert-transform wall) | New Proposition H6: in the Riesz decomposition, off-line zeros add *positive* Poisson bumps to the symbol, so q_λ ≥ q^♮_λ with equality iff RH. The outer form q^♮ is a functional of \|ζ\| on the critical line, which is route 48's object. |
| Fakes and DH | round-1 operator §4.4 (F₅ fake); round-1 synthesis §2 (DH bites three attempts); round-2 phase alignment, Theorem NFT (torus validity) | New fake: genus 2, non-real off-line ordinate, a_d ≥ 0 (6587 such fakes found for q ≤ 13). New observation: zero-free completions exist for every Dirichlet series, so harmonicity is DH-valid. NFT says that Euler-product consequences are torus-valid. Here: harmonic + Euler-soft consequences are fake-valid. |
| One-sided prime sums, parity | round-2 Stepanov, Theorem P | Quoted in §4.4: the Harnack-principle target is a one-sided prime count. Upper-bound sieves miss it by the parity factor. |

---

## 1. Setting and target

### 1.1 Notation

The notation follows round-1 operator §1.1, which follows atlas whole-even §1 and spectral head §1:
* X ≥ 2, W = log X, ℓ = W/2, λ = √X.
* f̂(t) = ∫ f(y) e^{−ity} dy, ‖f‖² = (1/2π)∫|f̂|², R_f(r) = ∫ \bar f(y) f(y + r) dy.
* α(t) = Re ψ(5/4 + it/2) − log π.
* q_λ is the actual supported even Weil form (round-1 (1.1)), H_λ its operator, ε₀(λ) = inf spec H_λ.
* q^{full}_λ and ε₀^{full}(λ) are the same form and its infimum on all of L²[−ℓ, ℓ], not only the even part.

The functions:
* γ(s) := ½ s(s − 1) π^{−s/2} Γ(s/2).
* ξ_g := γ·g for a completion g (Section 2).
* ζ_X(s) = ∏_{p≤X} (1 − p^{−s})^{−1}.
* ζ^♭_X(s) := exp(Σ_{n<X} Λ(n) n^{−s}/log n), the sharp completion, which is entire and zero-free.
* P_X(t) := 2Re[X^{1/2+it}/(½ + it)].
* c_X(t) = 2Re[(X^{1/2+it} − 1)/(½ + it)] = P_X(t) − 4/(1 + 4t²).

For a completion g the symbol is

  σ_g(t) := α(t) + c_X(t) + 2Re (g′/g)(½ + it) = 2∂_σ log|ξ_g(σ + it)|_{σ=1/2} + P_X(t).   (1.1)

The second equality uses Re[1/s + 1/(s − 1)] = 0 on the critical line and 2∂_σ log|γ| = Re ψ(¼ + it/2) − log π =
α(t) − 4/(1 + 4t²) there (round-1 §2.3). Write σ_X := σ_{ζ_X} and σ^♭_X := σ_{ζ^♭_X}; these are round-1's σ_X and σ^♭_X.

Kernels:
* P_η(a) = η/(π(η² + a²)) (Poisson).
* k_η(t) = (π/(4η²)) sech²(πt/(2η)).
* Q_{a,b}(t) = sin(πa/b)/(2b(cosh(πt/b) + cos(πa/b))), for 0 < a < b.

### 1.2 Target

**Theorem HP (target).** There are C, m with ε₀(λ) ≥ −C(1 + log λ)^m for all λ ≥ 1.

By round-1 Theorem C (PROVED-A from the audit-accepted Suzuki box identity and the one-sided Landau theorem of
arithmetic foundation §2), Theorem HP implies RH. In fact the normalized box direction alone suffices. Conversely, RH
gives ε₀ ≥ 0 by Weil's criterion. Polylogarithmic negativity is allowed on purpose (atlas §11).

### 1.3 Inputs used, with status

* Round-1 Theorem A (compression identity; PROVED there, with numeric check).
* Round-1 Theorem C (floor ⇒ half-plane; PROVED-A).
* Round-1 Theorem E (the t = 0 slice of the pointwise floor is RH; PROVED there).
* STANDARD:
  - the strip Poisson kernel;
  - the Phragmén–Lindelöf principle for harmonic functions in a strip;
  - Harnack's inequality and Harnack's principle;
  - Landau's lemma (recalled in arithmetic foundation §2);
  - the canonical factorization of H^∞ functions in a half-plane (Garnett, *Bounded analytic functions*, Ch. II).
* Odlyzko-type zeros are not used in this file.

---

## 2. The harmonic toolkit (what is proved)

### 2.1 Completions and the odd potential

**Definition.** The completions at level X are 𝒢_X := {ζ_Y : Y ≥ X} ∪ {ζ^♭_X}. Each g ∈ 𝒢_X has these properties:
* It is holomorphic and zero-free on Re s > 0. For ζ_Y, every factor (1 − p^{−s})^{−1} is holomorphic and nonzero
  there. ζ^♭_X is the exponential of an entire function.
* It is real on the real axis.
* −g′/g = Σ_n b_n n^{−s} with b_n = Λ(n) for every n < X. Every prime power n = p^k < X has p < X ≤ Y.

**Theorem H1 (odd potential; null freedom; PROVED).** For g ∈ 𝒢_X put

  U_g(s) := log|ξ_g(s)| − log|ξ_g(1 − \bar s)|,  Π_X(s) := Re Ei(s log X) − Re Ei((1 − \bar s) log X),  H_g := U_g + Π_X.

Then:
* (i) H_g is harmonic in the open strip S = {0 < σ < 1}, H_g(½ + it) = 0, and H_g(1 − \bar s) = −H_g(s).
* (ii) ∂_σ H_g(½ + it) = σ_g(t).
* (iii) q_λ[f] = (1/2π) ∫ σ_g(t) |f̂(t)|² dt for every f in the form domain and every g ∈ 𝒢_X.
* (iv) For 0 < η < ½: sup_{0≤x≤η} |H_g(½ + x + it)| = O_{X,η}(log(2 + |t|)).

*Proof.*
* (i)
  - ½s(s − 1)Γ(s/2) is holomorphic on S and does not vanish there: sΓ(s/2) → 2 at s = 0, and the zero at s = 1 lies
    on ∂S. With g zero-free, log|ξ_g| is harmonic on S.
  - The map s ↦ 1 − \bar s is the anticonformal reflection of S across σ = ½, so log|ξ_g(1 − \bar s)| is also harmonic.
  - Re Ei(z) = γ_E + log|z| + Re Σ_{k≥1} z^k/(k·k!) is single-valued and harmonic on ℂ \ {0}. Both s log X and
    (1 − \bar s) log X are nonzero on S.
  - On σ = ½ we have 1 − \bar s = s, so H_g = 0 there. Oddness holds by construction.
* (ii) d/dσ of F(1 − σ + it) is −F_σ(1 − σ + it), so ∂_σ U_g(½ + it) = 2∂_σ log|ξ_g|(½ + it). Also
  d/ds Ei(s log X) = X^s/s, so ∂_σ Π_X(½ + it) = 2Re[X^{1/2+it}/(½ + it)] = P_X(t). Now apply (1.1).
* (iii)
  - For g = ζ_X this is round-1 Theorem A.
  - For any g ∈ 𝒢_X, σ_g − σ_X = 2Re[(g′/g − ζ_X′/ζ_X)(½ + it)]. This is an absolutely convergent cosine series with
    frequencies log n ≥ W. For ζ_Y the series consists of the atoms of the primes X < p ≤ Y and of their powers. For
    ζ^♭_X it consists of the atoms p^k ≥ X, p ≤ X, of ζ_X, with the opposite sign. In both cases the coefficient sum is
    at most Σ_{p≤Y, k≥1} log p · p^{−k/2} < ∞.
  - R_f is supported in [−W, W] with R_f(±W) = 0, so ∫ cos(t log n) |f̂|² dt = π(R_f(log n) + R_f(−log n)) = 0 for
    log n ≥ W.
  - Dominated convergence then gives (iii).
* (iv)
  - Gamma part: by Stirling, |U_γ(½ + x + it)| ≤ x(log(2 + |t|) + C) for |x| ≤ η.
  - The g-part is bounded for fixed X: by Σ_{p≤Y} |log(1 − p^{−1/2+η})| for ζ_Y, and by Σ_{n<X} n^{−1/2+η} for ζ^♭_X.
  - Π_X is bounded on {½ ≤ σ ≤ ½ + η}. ∎

**Remark H1.1 (the premise is not arithmetic).** The harmonic argument uses exactly one analytic property of ζ_X: the
completion has no zeros. That property also holds for ζ^♭_X, which is built from the numbers Λ(n), n < X, alone. The
same construction applies to any coefficient sequence. By (iii), the compressed form does not distinguish ζ_X from
ζ^♭_X; the Euler product affects only the null part (atoms at n ≥ X). Section 4.5 turns this into the DH test.

### 2.2 Exact transport across a strip of width η

**Theorem H2 (strip transport with positive kernels; PROVED + NUMERIC).** For g ∈ 𝒢_X and 0 < η₁ < η₂ < ½:

  H_g(½ + η₁ + it) = ∫ Q_{η₁,η₂}(t − u) H_g(½ + η₂ + iu) du,   (2.1)

  σ_g(t) = ∫ k_{η₂}(t − u) H_g(½ + η₂ + iu) du.   (2.2)

Here Q_{a,b} > 0 with ∫ Q_{a,b} = a/b, and k_η > 0 with ∫ k_η = 1/η. Consequently, for every f in the form domain
and 0 < η < ½,

  q_λ[f] = (1/2π) ∫ H_g(½ + η + it) (k_η ∗ |f̂|²)(t) dt,  k_η ∗ |f̂|² ≥ 0,  ∫ k_η ∗ |f̂|² = (2π/η) ‖f‖².   (2.3)

*Proof.* Fix b = η₂ and write h(u) = H_g(½ + b + iu).
* **The kernel.** For 0 < x < b, Q_{x,b} is the Poisson kernel of the strip {0 < x < b} for the edge x = b, with zero
  data on x = 0. Its Fourier transform is Q̂_{x,b}(r) = sinh(x|r|)/sinh(b|r|). The pair
  ∫ e^{irt} sinh(xr)/sinh(br) dr = (π/b) sin(πx/b)/(cosh(πt/b) + cos(πx/b)) is STANDARD; it was checked numerically
  to 2.4·10⁻⁸ (`extra.json`).
* **The harmonic extension.** Put V(x, t) := ∫ Q_{x,b}(t − u) h(u) du. The kernel decays like e^{−π|t|/b} and
  h = O(log(2 + |u|)) by H1(iv). So V is harmonic in the strip, extends continuously with V(0, ·) = 0 and
  V(b, ·) = h, and is O(log(2 + |t|)).
* **Uniqueness.** D(x, t) := H_g(½ + x + it) − V(x, t) is harmonic, continuous on the closed strip, zero on both
  edges, and O(log(2 + |t|)). By the Phragmén–Lindelöf principle for a strip, a harmonic function that vanishes on
  both edges and grows like o(e^{π|t|/b}) is zero. So D ≡ 0, which is (2.1).
* **Derivative at the line.** ∂_x Q̂_{x,b}(r) at x = 0 equals |r|/sinh(b|r|) = k̂_b(r), and
  (1/2π) ∫ e^{irt} r/sinh(br) dr = (π/(4b²)) sech²(πt/(2b)) is STANDARD. Differentiating under the integral is allowed
  because ∂_x Q_{x,b} decays exponentially, uniformly for x ∈ [0, b/2]. Together with H1(ii) this gives (2.2).
* **Positivity and mass.** Since 0 < πa/b < π, sin(πa/b) > 0 and cosh(πt/b) + cos(πa/b) > 0. The masses are
  Q̂_{a,b}(0) = a/b and k̂_b(0) = 1/b.
* **(2.3).** Insert (2.2) into H1(iii) and apply Fubini. This is allowed because k_η ≥ 0, H_g grows logarithmically,
  and k_η ∗ |f̂|² has a finite log-moment whenever |f̂|² does. ∎

NUMERIC (`identity.json`):
* (2.2) at X = 10², 10³, κ = ½, 1, 2 (η = κ/log X), six values of t: maximum error 3.6·10⁻¹³.
* ∂_σ H_g − σ_g ≤ 1.6·10⁻⁸ (central differences).
* H_g = 0 on the line exactly.
* The phase-velocity form of Remark H2.1 holds to 7.5·10⁻⁸.

**Remark H2.1 (phase-velocity form).** By Cauchy–Riemann for the holomorphic function log ξ_g on S,
2∂_σ log|ξ_g|(½ + it) = 2 d/dt arg ξ_g(½ + it). So σ_g = 2θ_g′ + P_X with θ_g(t) = arg ξ_g(½ + it). The symbol is
twice the phase velocity of the completed finite product along the critical line, plus the pole term. For the true ξ
the phase is constant between zeros and jumps by π at each zero; for ξ_g the jumps are smeared over a scale 1/log X.
If ξ_g were Hermite–Biehler in σ > ½, its phase velocity would be positive. Section 4.4 shows that it is not.

### 2.3 Far-line floors only get worse

**Theorem H3 (PROVED).** For g ∈ 𝒢_X put m_g(0) := inf_t σ_g(t) and m_g(η) := inf_t H_g(½ + η + it)/η for
0 < η < ½. Then

  m_g(η₂) ≤ m_g(η₁) ≤ m_g(0) ≤ ε₀(λ)  for 0 < η₁ < η₂ < ½.

*Proof.*
* By (2.1) and the positivity and mass of Q, H_g(½ + η₁ + it) ≥ (η₁/η₂) inf_u H_g(½ + η₂ + iu). Divide by η₁.
* By (2.2), σ_g(t) ≥ (1/η) inf_u H_g(½ + η + iu).
* The last inequality holds because the compression is bounded below by the infimum of its symbol (H1(iii)). ∎

So a far-line floor H_g(½ + η + it) ≥ −ηM implies σ_g ≥ −M pointwise, which is round-1's (EP_m) for σ_g. It is never
easier.

**Remark H3.1 (a sub-cone of the §9 certificates).** By (2.3), a far-line floor H_g(½ + η + ·) ≥ −ηM certifies
σ_g + M = k_η ∗ (H_g(½ + η + ·) + ηM), the image under k_η∗ of a nonnegative function of logarithmic growth. Here
σ_g − σ_X has Fourier support in |r| ≥ W, so this is a
null-symbol certificate in the sense of atlas §9. The certificates reachable this way are the §9 certificates whose
shifted symbol lies in the image of the nonnegative cone under k_η∗. Their value never exceeds the §9 dual
sup_W inf_t (V_L + W) = ε₀, and by Theorem H3 never exceeds the plain symbol floor inf σ_g.

NUMERIC (`infscan.json`). Grid minima on t ∈ [0, T] with step 1/(12 log X), hence upper bounds for the infima on that
range. Every η used satisfies η < ½.

| X (T) | m(0), Euler | m at κ = ¼, ½, 1, 2, Euler | m(0), sharp | m at κ = ¼, ½, 1, 2, sharp | sharp at η = 0.1, 0.25, 0.4 | (sinh(0.4W)/(0.4W))·m^♭(0) |
|---|---|---|---|---|---|---|
| 10² (2000) | −8.26 | −8.35, −8.73, −10.39, −43.40 | −7.41 | −7.49, −7.71, −8.63, −13.08 | −7.66, −9.04, −11.96 | −12.38 |
| 10³ (2000) | −10.86 | −10.97, −11.30, −12.79, −34.06 | −10.75 | −10.85, −11.18, −12.54, −18.83 | −11.58, −16.53, −29.15 | −30.70 |
| 10⁴ (600) | −10.50 | −10.76, −11.55, −15.16, −39.09 | −9.71 | −9.82, −10.15, −11.51, −17.71 | −11.23, −20.80, −53.38 | −52.41 |

Observations:
* For the sharp completion, m^♭(η)/m^♭(0) agrees with the band-edge multiplier sinh(ηW)/(ηW) to within 6% in every
  entry.
* The Euler completion is worse at larger η, for two reasons. Its null atoms p^k ≥ X are amplified by
  sinh(ηk log p)/(k log p). And the reflected point ½ − η approaches the poles of ζ_X on σ = 0.
* At X = 10⁵, with t ≤ 60 only, the Euler value at η = 0.4 is −2056.

### 2.4 The even transport is an average over modulations

**Theorem H4 (PROVED).** Let σ^{(η)}_g := P_η ∗ σ_g. For the prime part, this is the Euler product evaluated on the
line σ = ½ + η. For every f ∈ L²[−ℓ, ℓ] with finite log-moment,

  (1/2π) ∫ σ^{(η)}_g |f̂|² dt = ∫ P_η(a) q^{full}_λ[e^{iay} f] da ≥ ε₀^{full}(λ) ‖f‖².

*Proof.* (P_η ∗ |f̂|²)(t) = ∫ P_η(a) |f̂(t − a)|² da and f̂(t − a) = (e^{iay} f)^(t). Apply Fubini and H1(iii) on the
full space. ∎

The inequality goes one way only.
* Undoing the smoothing multiplies the band |r| ≤ W by e^{η|r|}.
* The kernel e^{η|x−y|} on [−ℓ, ℓ]² is not positive semidefinite: its 2×2 minor is 1 − e^{2η|x−y|} < 0.
* So a floor for the smoothed far-line form does not give a floor for q_λ.

The two harmonic transports therefore do different things:
* The even transport (H4) smooths, but replaces the form by a weaker one.
* The odd transport (H2, H3) is exact, but de-smooths.

Neither carries a lower bound from a weaker statement to the floor.

### 2.5 Harnack's principle for corrected Euler products

Write li₂(x) := ∫_2^x du/log u, E_Y(s) := ∫_2^Y u^{−s} du/log u (entire in s), and
u_Y(s) := log|ζ_Y(s)| − Re E_Y(s), which is harmonic on Re s > 0.

**Theorem H5 (PROVED; classical in substance).** The following are equivalent.
* (a) RH.
* (b) For every compact K ⊂ {σ > ½}: sup_{Y≥2} sup_{s∈K} u_Y(s) < ∞.
* (c) For every real σ ∈ (½, 1): sup_{Y≥2} [Σ_{p≤Y} p^{−σ} − ∫_2^Y u^{−σ} du/log u] < ∞.

*Proof.*
* **(a ⇒ b).**
  - Under RH, π(x) − li₂(x) = O(√x log x) (von Koch; STANDARD).
  - For s ∈ K, Σ_{p≤Y} p^{−s} − E_Y(s) = ∫_{2⁻}^{Y} u^{−s} d(π − li₂)(u)
    = [u^{−s}(π − li₂)(u)]_{2⁻}^{Y} + s ∫_2^Y u^{−s−1}(π − li₂)(u) du. This converges uniformly on K as Y → ∞, since
    σ ≥ σ_K > ½ there.
  - log ζ_Y(s) − Σ_{p≤Y} p^{−s} = Σ_{p≤Y} Σ_{k≥2} p^{−ks}/k converges absolutely and uniformly on K.
  - So u_Y converges uniformly on K and is bounded on K uniformly in Y.
* **(b ⇒ a), by Harnack's principle.**
  - On σ > 1 the Euler product converges absolutely and E_∞(s) = ∫_2^∞ u^{−s} du/log u = E₁((s − 1) log 2). So u_Y
    converges locally uniformly there to u_∞ := log|ζ| − Re E₁((s − 1) log 2).
  - By (b), the family {u_Y} is locally uniformly bounded above on the domain Ω = {σ > ½}. Harnack's principle
    (STANDARD) then says: every sequence u_{Y_j} has a subsequence converging locally uniformly on Ω either to a
    harmonic function or to −∞.
  - −∞ is excluded, because the limit on σ > 1 is finite. Every limit is harmonic and equals u_∞ on σ > 1; since Ω is
    connected, all subsequential limits coincide. So u_Y → v locally uniformly, v harmonic on Ω.
  - E₁(z) = −γ_E − log z − Σ_{k≥1} (−z)^k/(k·k!). Hence h := v + Re E₁((s − 1) log 2) + log|s − 1| is harmonic on Ω,
    and h = log|F| on σ > 1, with F(s) := (s − 1)ζ(s) entire.
  - Let h̃ be a harmonic conjugate of h on the simply connected domain Ω, and put G := F e^{−(h + ih̃)}. G is
    holomorphic on Ω and |G| = 1 on σ > 1. So G is a unimodular constant on Ω.
  - Then |F| = e^h > 0 on Ω, and ζ has no zeros in σ > ½.
* **(b ⇒ c).** Take K = {σ}. The terms with k ≥ 2 are bounded for σ > ½.
* **(c ⇒ a), by Landau.**
  - Fix σ₀ ∈ (½, 1) and C with I(Y) := Σ_{p≤Y} p^{−σ₀} − ∫_2^Y u^{−σ₀} du/log u ≤ C for all Y ≥ 2. Then
    A(Y) := C − I(Y) ≥ 0.
  - For Re z > 1 − σ₀, by Fubini, ∫_2^∞ A(Y) Y^{−z−1} dY = z^{−1}[C 2^{−z} − (𝒫(σ₀ + z) − E₁((σ₀ + z − 1) log 2))],
    where 𝒫(s) := Σ_p p^{−s}.
  - 𝒫 = log ζ − R with R holomorphic on σ > ½, and −E₁((s − 1) log 2) = log(s − 1) + (entire). So the bracket is
    log F(σ₀ + z) plus a function holomorphic for Re(σ₀ + z) > ½.
  - For real s = σ₀ + z > ½, F(s) = (s − 1)ζ(s) > 0, because ζ < 0 on (0, 1), ζ > 0 on (1, ∞), and F(1) = 1. So the
    right side is holomorphic near every real z > 0.
  - By Landau's lemma (arithmetic foundation §2), the abscissa of the left side is ≤ 0, so the left side is
    holomorphic on Re z > 0. Hence log F continues holomorphically to Re s > σ₀, and F has no zeros there.
  - σ₀ ∈ (½, 1) was arbitrary. ∎

NUMERIC (`extra.json`). The RH limit of u_Y(σ) is log|ζ(σ)| + Ei((1 − σ) log 2). The differences u_Y(σ) − limit at
Y = 10³, 10⁴, 10⁵, 10⁶, 10⁷:

| σ | Y = 10³ | 10⁴ | 10⁵ | 10⁶ | 10⁷ |
|---|---|---|---|---|---|
| 0.6 | 0.147 | 0.113 | 0.078 | 0.046 | 0.033 |
| 0.75 | 0.036 | 0.019 | 0.0087 | 0.0029 | 0.0014 |
| 0.9 | 0.0093 | 0.0036 | 0.0011 | 0.0002 | 7·10⁻⁵ |

This is consistent with RH and proves nothing.

**Remark H5.1.** H5(c) is the Landau target of arithmetic foundation §2 and round-1 Theorem E, written for log-moduli at
real points.
* It asks for a one-sided upper bound on the positive prime sum Σ_{p≤Y} p^{−σ}, with an O(1) error against a main term
  of size Y^{1−σ}/((1 − σ) log Y).
* Upper-bound sieves give such bounds only up to a constant factor (the parity factor 2). Round-2 Stepanov, Theorem P,
  shows this for Type-I majorants in the (★) normalization.
* So Harnack's principle reduces harmonic compactness to exactly the one-sided prime estimate already on record. It adds
  no lever. It is the only use of Harnack in this file that yields an equivalence with RH; the inequality form is
  discussed in §4.4.

### 2.6 The Riesz–Herglotz split

Notation:
* Ω = {σ > ½}.
* For a zero ρ = β + iγ with β > ½: 𝒫(t; ρ) := (1/π)(β − ½)/((β − ½)² + (t − γ)²).
* w_b(t) := log|ζ_X(½ + it)| − log|ζ(½ + it)|. It is locally integrable, with singularities +∞ at the ordinates of
  zeros on the line.
* P_Ω is the Poisson extension into Ω. ∂_σ⁺ is the one-sided normal derivative from Ω, in the sense of distributions.

**Proposition H6 (PROVED, author-checked only; the weakest proved item).** As functions of t,

  σ_X(t) = S^♮_X(t) + 4π Σ_{β>½} 𝒫(t; ρ),  S^♮_X := P_X − 8/(1 + 4t²) + 2𝒩[w_b].   (2.4)

The sum runs over zeros with multiplicity. 𝒩[w_b] is the absolutely continuous part of ∂_σ⁺ P_Ω[w_b]; the singular part
is −π Σ_{β=½} δ_γ. Let q^♮_λ be the compression of S^♮_X. Then

  q_λ[f] = q^♮_λ[f] + 2 Σ_{β>½} ∫ 𝒫(t; ρ) |f̂(t)|² dt ≥ q^♮_λ[f].   (2.5)

The added term is twice the Poisson extension of |f̂|² evaluated at the off-line zeros. If RH holds, q_λ = q^♮_λ. If
RH fails, q_λ[f] > q^♮_λ[f] for every f ≠ 0. Hence RH holds if and only if q^♮_λ ≥ −C(1 + log λ)^m for all λ.

*Proof.*
1. **Factorization of ζ.** F(s) := (s − 1)ζ(s)/(s + 1)² is bounded and holomorphic on a neighbourhood of Ω̄, by the
   convexity bound |(s − 1)ζ(s)| ≪ |s|^{5/4+ε} on σ ≥ ½. So F ∈ H^∞(Ω).
   - The canonical factorization (STANDARD; Garnett Ch. II, moved to Ω by z = i(s − ½)) gives
     log|F| = Σ_{ρ∈Ω} log|B_ρ| + P_Ω[log|F_b|] + log|S| − c(σ − ½), where B_ρ(s) = (s − ρ)/(s − ρ*) and ρ* := 1 − \bar ρ.
   - c = −lim_{σ→∞} log|F(σ)|/σ = 0.
   - S ≡ 1: F is holomorphic across ∂Ω, and a singular inner factor needs a singular boundary measure.
   - With P_Ω[log|s − 1|_b] = log|s| and P_Ω[log|s + 1|_b] = log|s + 1| (each pair agrees on σ = ½, the right sides are
     harmonic in Ω, and the growth is the same):
     log|ζ| = P_Ω[log|ζ_b|] − Σ_{ρ∈Ω} G_Ω(·, ρ) + G_Ω(·, 1), where G_Ω(s, z) := log|(s − z*)/(s − z)| ≥ 0 is the Green
     function of Ω.
2. **Subtract the Euler product.** log|ζ_X| is bounded and harmonic near Ω̄, so log|ζ_X| = P_Ω[log|ζ_{X,b}|]. Hence
   w := log|ζ_X/ζ| = P_Ω[w_b] + Σ_{ρ∈Ω} G_Ω(·, ρ) − G_Ω(·, 1).
3. **Normal derivatives of the Green functions.** ∂_σ G_Ω(½ + it, z) = 2Re(z − ½)/|½ + it − z|² = 2π𝒫(t; z). For the
   pole, 4π𝒫(t; 1) = 8/(1 + 4t²).
4. **Assemble on the line.** By (1.1), σ_X − P_X = 2∂_σ log|ξ_X| = 2∂_σ⁺ log|ξ| + 2∂_σ⁺ w as distributions on the
   line. (log|ξ_X| is smooth; log|ξ| and w have opposite logarithmic singularities at the zeros on the line.)
   - log|ξ(½ + x + it)| is even in x, so ∂_σ⁺ log|ξ| = π Σ_{β=½} δ_γ. This comes from
     ∂_x log √(x² + u²) = x/(x² + u²) → πδ(u).
   - P_Ω[w_b] contains −log|s − (½ + iγ)| near each zero on the line. So the singular part of ∂_σ⁺ P_Ω[w_b] is
     −π Σ_{β=½} δ_γ.
   - The deltas cancel, which gives (2.4). Every other term in (2.4) is smooth, and Σ_ρ γ^{−2} < ∞, so 𝒩[w_b] is a
     smooth function.
5. **The form.** Integrate (2.4) against |f̂|²/(2π) and use H1(iii). 𝒫 > 0 gives (2.5). The inequality is strict for
   f ≠ 0 when there is an off-line zero, because the Poisson extension of a nonnegative function that is not a.e. zero
   is positive.
6. **The equivalence.** "If": by (2.5) and round-1 Theorem C. "Only if": under RH, q^♮ = q ≥ 0. ∎

**What H6 shows and what it does not.**
* In the canonical harmonic decomposition, an off-line zero contributes to the symbol a positive Poisson bump of height
  4/(β − ½) at its ordinate.
* Its effect on the form, which can be negative, comes only through the outer part 𝒩[w_b], that is, through |ζ| on the
  critical line.
* So the harmonic route can at best reduce RH to a floor for the outer form q^♮. By (2.5) that floor is RH-equivalent,
  and q^♮ is a functional of |ζ(½ + it)| and of the Euler product.
* Route 48: |ζ| on the critical line determines ζ only up to independent flips of off-line zeros across the line,
  because Blaschke factors are unimodular there. So the outer data alone do not locate zeros.
* (2.5) also shows that the harmonic decomposition loses nothing under RH. The failure in §4 is not a loss in the
  harmonic analysis. It is that the harmonic analysis contains no arithmetic.

---

## 3. The argument

The aim is Theorem HP for the compressed operator. Steps 1–3 and 5 are proved. Step 4 is the step that must carry the
arithmetic, and it fails (Section 4). Throughout, η = κ/log X with a fixed κ > 0, and X is large enough that η ≤ ¼.

### 3.1 Step 1: compression, with all completions allowed (PROVED)

By Theorem H1(iii), for every g ∈ 𝒢_X and every f in the form domain, q_λ[f] = (1/2π) ∫ σ_g |f̂|² dt. The choice of g
is free. It changes only the part of the symbol at frequencies |r| ≥ W, which the support constraint removes (atlas §9).

### 3.2 Step 2: exact harmonic transport (PROVED)

By Theorem H2 (2.3), q_λ[f] = (1/2π) ∫ H_g(½ + η + it) (k_η ∗ |f̂|²)(t) dt. The weight is nonnegative and has total
mass (2π/η)‖f‖². All primes p ≤ X (or all n < X) enter through the single harmonic function H_g. The width η = κ/log X
of the strip matches the frequency resolution 1/W of support W.

### 3.3 Step 3: reduction to a floor for the potential (PROVED)

If H_g(½ + η + it) ≥ −ηM for all real t, then by Step 2 q_λ[f] ≥ −(1/2π) ηM (2π/η) ‖f‖² = −M‖f‖². That is,
ε₀(λ) ≥ −M.

### 3.4 Step 4: the Harmonic Floor Lemma (THE STEP TO BE PROVED; FAILS)

**Claim (HFL).** There are κ > 0 and C, m ≥ 0 such that for every X ≥ X₀ some g ∈ 𝒢_X satisfies

  H_g(½ + κ/log X + it) ≥ −C (κ/log X) (1 + log X)^m  for all t ∈ ℝ.

**Proposed proof.** Four parts. Parts (4a)–(4c) are proved. Part (4d) is the claimed step.

**(4a) Archimedean anchor at large height (PROVED).** Take g ∈ {ζ_X, ζ^♭_X} and 0 < η ≤ ¼. Put
S_g(η) := sup{|∂_σ log|g(σ + it)|| : |σ − ½| ≤ η, t ∈ ℝ}. Then
* S_g(η) ≤ Σ_{n<X} Λ(n) n^{−1/2+η} for ζ^♭_X;
* S_g(η) ≤ Σ_{p≤X} log p · p^{−1/2+η}/(1 − p^{−1/2+η}) for ζ_X;
* in both cases S_g(η) ≤ (2 + o(1)) e^{κ} √X.

*Lemma 3.1.* Let t\*(X, η) := max(10, X^{1/2+η}, 2π exp(2.6 + 2S_g(η))). For |t| ≥ t\* and 0 ≤ x ≤ η,
H_g(½ + x + it) ≥ 0.

*Proof.* H_g(½ + x + it) = ∫_0^x ∂_v H_g(½ + v + it) dv. The integrand is

  ∂_σ log|ξ_g|(½ + v + it) + ∂_σ log|ξ_g|(½ − v + it) + ∂_v Π_X(½ + v + it).

Each term is bounded below:
* **Gamma terms.** ∂_σ log|γ(σ + it)| = ½ Re ψ((σ + it)/2) − ½ log π + Re[1/s + 1/(s − 1)]. For |t| ≥ 10 and
  |σ − ½| ≤ ¼, Stirling's formula with remainder (STANDARD) gives Re ψ((σ + it)/2) ≥ log(|t|/2) − 0.15, and
  |Re[1/s + 1/(s − 1)]| ≤ 0.2. So each gamma term is ≥ ½ log(|t|/2π) − 0.3, and the two together are
  ≥ log(|t|/2π) − 0.6.
* **g terms.** Together they are ≥ −2S_g(η).
* **Π term.** It is ≥ −2X^{1/2+η}/|t| ≥ −2.

So the integrand is ≥ log(|t|/2π) − 2.6 − 2S_g(η) ≥ 0. ∎

This is the potential-level form of round-1 Step 3. It covers |t| ≥ e^{O(e^κ √X)}.

**(4b) Minimum principle (PROVED; STANDARD).** Let η ≤ η′ ≤ ¼ and R := [½, ½ + η′] × [−t\*′, t\*′], with
t\*′ = t\*(X, η′). On ∂R:
* H_g = 0 on the left side;
* H_g ≥ 0 on the horizontal sides, by (4a);
* the right side is the far line.

The minimum principle on R therefore gives

  H_g(½ + η + it) ≥ min(0, inf_{|t|≤t\*′} H_g(½ + η′ + it))  for |t| ≤ t\*′,

and H_g(½ + η + it) ≥ 0 for |t| ≥ t\*′.

**(4c) Harnack comparison (PROVED; STANDARD).** If H_g + A ≥ 0 on a disc D(s₀, 2r) ⊂ S, then
H_g(s) + A ≥ (H_g(s₀) + A)/3 for |s − s₀| ≤ r (Harnack's inequality with ratio (2r − r)/(2r + r)). Chains of such discs
carry a lower bound along the far line from points where H_g is known to be large, for example from the region of
(4a), into the compact range. Each step loses a fixed factor.

**(4d) The anchor line (THE CLAIMED STEP).** There is η′ ∈ [η, ¼] such that

  H_g(½ + η′ + it) ≥ −η′ M  for |t| ≤ t\*′,

with M ≤ C(1 + log X)^m. Here either η′ = κ′/log X, or η′ = c is a fixed number.

*Proposed justification:*
* On the line σ = ½ + η′, every term of the Dirichlet polynomial is damped by n^{−η′}.
* By Theorem H5 (a ⇒ b), the corrected Euler products converge on σ ≥ ½ + η′, at least under RH.
* The functional equation makes the odd potential of the true ξ vanish: log|ξ(s)| − log|ξ(1 − \bar s)| ≡ 0.
* So H_g(½ + η′ + it) should be close to 0, up to the pole term and a controlled error.

**Conclusion of the proposed proof.** By (4b) and (4d), H_g(½ + η + it) ≥ −η′M = −(η′/η)·ηM. This is HFL with C
replaced by C·η′/η, which is polylogarithmic in X whenever η′/η is.

### 3.5 Step 5: conclusion if Step 4 held (PROVED)

Steps 3 and 4 give ε₀(λ) ≥ −C(η′/η)(1 + 2 log λ)^m. If η′/η is at most polylogarithmic, this is Theorem HP, and round-1
Theorem C gives RH. Step 4 fails, so nothing is concluded.

---

## 4. Where it fails

### 4.1 The exact line

**Step 4, part (4d): the anchor line.** The proposed justification compares two different odd potentials.
* H_g(½ + η′ + it) uses ξ_g at the reflected point ½ − η′ + it, which lies to the left of the critical line.
* "H_g ≈ odd potential of ξ ≡ 0" therefore requires the Euler product to approximate ζ on σ = ½ − η′.
* That is false even under RH. Theorem H5 controls the corrected products only on σ > ½; on σ < ½ they diverge.

Theorem H2 makes this quantitative. On the band |r| ≤ W,

  H_g(½ + η′ + ·) = (sinh(η′|D|)/|D|) σ_g,

so the part of σ_g at the band edge |r| ≈ W is amplified by sinh(η′W)/(η′W). Under RH this band-edge part is the
Dirichlet lobes of the zeros: round-1 Theorem B gives σ^♭_X = Σ_γ D_L(γ − t) + τ_X with D_L(u) = 2 sin(uL)/u, and
D_L's Fourier transform is the sharp indicator of [−L, L]. Neither the minimum principle (4b) nor Harnack (4c) can
supply the missing bound. Both only move a lower bound that is already known somewhere.

### 4.2 What Step 4 would contain

* **It contains round 1's pointwise floor.** By Theorem H3, every version of (4d), and HFL itself, implies σ_g ≥ −M′
  with M′ = C(η′/η)(1 + log X)^m. That is round-1 (EP_m) for σ_g.
* **The choice of completion does not help at t = 0.**
  - For g = ζ_X: σ_X(0) = α(0) − 4 − 2G⁻(X) − T_X(0), where G(X) = Σ_{n≤X} Λ(n) n^{−1/2} − 2√X (round-1 §4.2).
    So Step 4 forces G(X) ≤ C′(1 + log X)^m, which is RH (round-1 Theorem E).
  - For g = ζ^♭_X: σ^♭_X(0) = α(0) − 4 − 2G⁻(X). The same conclusion.
  - For g = ζ_Y with Y > X, the extra primes all have phase 0 at t = 0, so
    σ_{X,Y}(0) = σ_X(0) − 2Σ_{X<p≤Y} log p/(√p − 1) ≈ σ_X(0) − 4(√Y − √X). NUMERIC (`extra.json`), at X = 10² with
    Y = 10², 10³, 10⁴, 10⁵: −5.90, −94.6, −370.5, −1237. Larger Euler completions only make t = 0 worse.
  - So for the best completions (Y = X, or the sharp one), Step 4 implies the one-sided Chebyshev bound. For g = ζ_Y
    it is false as soon as 4(√Y − √X) exceeds the allowed polylogarithmic loss.
* **Explicit t = 0 form (PROVED; checked to 6·10⁻¹⁴ in `t0.json`).** For the sharp completion, with
  w_η(u) := sinh(η log u)/log u > 0,

    H^♭_X(½ + η) = U_γ(½ + η) + log((½ + η)/(½ − η)) − 2 [Σ_{n<X} Λ(n) n^{−1/2} w_η(n) − ∫_1^X u^{−1/2} w_η(u) du],

  and U_γ(½ + η) + log((½ + η)/(½ − η)) = η α(0) + O(η³).
  - Derivation: Π_X(½ + η) = ∫_{X^{1/2−η}}^{X^{1/2+η}} du/log u = 2∫_1^X u^{−1/2} w_η(u) du + log((½ + η)/(½ − η)).
    The logarithm appears because splitting the convergent integral into two divergent ones moves their lower limits
    by different amounts. (An earlier draft omitted it; the numerical check found the gap 0.4413 against
    log(0.6086/0.3914) = 0.4414.)
  - So the t = 0 instance of HFL is a one-sided Chebyshev bound with positive weight w_η:
    Σ_{n<X} Λ(n) n^{−1/2} w_η(n) ≤ ∫_1^X u^{−1/2} w_η(u) du + ½η(α(0) + M) + O(η³).
  - As η → 0, H^♭_X(½ + η)/η → σ^♭_X(0) = α(0) − 4 − 2G⁻(X), and the bound becomes G⁻(X) ≤ (M + α(0) − 4)/2. That is
    round-1 Theorem E's slice.
* **Uniformly in t**, (EP_m) needs pointwise control at heights up to e^{O(√X)}. Round-1 §4.3 argues (ARGUED there)
  that this is beyond what RH gives by known methods.

### 4.3 No anchor line exists

* **(a) Lines with η′ log X → ∞.** The far-line floor is worse than the critical-line floor by about sinh(η′W)/(η′W).
  - Measured, sharp completion at η′ = 0.4: the factor is 1.67, 2.86, 5.40 at X = 10², 10³, 10⁴, and the measured
    ratio tracks it to within 6% (§2.3 table).
  - Under RH the critical-line floor is a negative polylogarithm. Round 1 measured min σ_X between −5.4 and −13.2 for
    X ≤ 10⁴; this file measures −7.4 to −10.9.
  - So at a fixed distance c, the far-line floor is about −(sinh(cW)/(cW))·|m^♭(0)| ≈ −X^c |m^♭(0)|/(2cW). This is a
    power of X, even under RH. No line at fixed distance can be the anchor.
* **(b) Lines with η′ ≍ 1/log X.** There (4d) is HFL itself, up to the factor η′/η.
* **(c) Lines where the Euler product is controlled (σ ≥ 1 + ε).**
  - The odd potential there needs the reflected line σ ≤ −ε. That line is outside the strip: ζ_Y has poles on σ = 0,
    and ζ^♭_X has no relation to ζ there.
  - The plain potential log|ξ_g| is controlled on σ ≥ 1 + ε. But transporting it to σ = ½ multiplies the band by up to
    e^{(1/2+ε)W} = X^{1/2+ε}. That is the trivial floor p ≥ 1, the level −S_X ≈ −4√X of round-1 §4.5.
* **(d) A zero-free strip as the anchor.**
  - If ζ has no zeros in σ > ½ + c, then the true log|ξ| is harmonic on σ > ½ + c and can serve as the anchor there.
  - Transport to the critical line multiplies the band by e^{cW} = X^c = λ^{2c}. At best this gives a floor of
    exponent p = 2c, which is the V7 relation (atlas §10) read backwards. Nothing is gained.
  - This is ARGUED: turning the band bound into a bound for the form also needs growth control of ζ′/ζ on
    σ = ½ + c + ε, which a bare half-plane does not give. Compare round-1 §6 on the converse of V7.
  - This is the "expected stop" of the round-1 synthesis ("the Poisson boundary data at σ = ½ + η is a zero-free-strip
    statement"), now with its cost made explicit.

### 4.4 Harnack cannot create the anchor

Harnack's inequality needs a positive harmonic function. The candidates are:
* **(i) H_g + A.** This needs A ≥ −inf H_g, which is circular.
* **(ii) A Herglotz function from a Hermite–Biehler property of ξ_g in σ > ½.** For E(z) = ξ_g(½ − iz), the
  Hermite–Biehler inequality |E(\bar z)| < |E(z)| for Im z > 0 says exactly U_g > 0 on σ > ½. It fails already at t = 0.
  - U_g(½ + η) = H_g(½ + η) − Π_X(½ + η), where Π_X(½ + η) = ∫_{X^{1/2−η}}^{X^{1/2+η}} du/log u ≈ 4η√X.
  - Meanwhile H_g(½ + η) = O(η log X). Measured, at κ = ¼: H_{ζ_X}(½ + η)/η = −8.29 (X = 10³) and −10.76 (X = 10⁴),
    while H^♭(½ + η)/η lies between −0.35 and +0.84 for X = 10² to 10⁵ (`infscan.json`). So U_g < 0 near t = 0 for
    both completions.
  - Even the weaker requirement H_g ≥ 0, which allows for the pole term, fails. For the Euler completion
    σ_X(0) = −log X + O(1), because the atoms beyond the support give T_X(0) = log X + O(1) (round-1 §2.1). For the
    sharp completion σ^♭ reaches −10.75 at X = 10³.
  - The Hermite–Biehler property of the shifted true ξ is atlas §2's shifted-kernel criterion. It is RH-equivalent
    for all a > 0 and is not supplied by finite products.
* **(iii) Harnack's principle (Theorem H5).** It applies to families bounded above, and it leads to the one-sided
  prime sum H5(c). That is the Landau target, and sieve methods miss it by the parity factor (Remark H5.1).

(4c) itself is correct, but it only moves a lower bound between points, losing a factor at each step. It needs a
starting bound, that is, an anchor.

### 4.5 The DH test: Step 4 is false without an Euler product, while Steps 1–3 and (4a)–(4c) still hold

**Setup.**
* f = (L(s, χ) + W L(s, \bar χ))/(1 + W), with χ mod 5 and χ(2) = i.
* Completed function F(s) = (5/π)^{(s+1)/2} Γ((s + 1)/2) f(s), with F(1 − s) = F(s).
* The off-line zero recomputed: ρ = 0.808517 + 85.699348i.
* Λ_f(n) are the coefficients of −f′/f. They are signed and not supported on prime powers.

**The harmonic machinery applies to DH.**
* f^♭_X(s) := exp(Σ_{n<X} Λ_f(n) n^{−s}/log n) is entire and has no zeros.
* The odd potential of (5/π)^{(s+1)/2} Γ((s + 1)/2) f^♭_X has normal derivative
  σ_DH(t) = Ω₅(t) − 2Σ_{n<X} Λ_f(n) n^{−1/2} cos(t log n) on the line, where Ω₅(t) = log(5/π) + Re ψ(¾ + it/2). There
  is no pole term, since f is entire.
* The compression of σ_DH at support log X is DH's Weil form.
* H1–H3, (4a), (4b) and (4c) hold, with the same proofs: replace γ(s) by (5/π)^{(s+1)/2} Γ((s + 1)/2) and drop the
  pole term Π_X. NUMERIC: (2.2) for DH at X = e⁸ holds to 3.7·10⁻¹³ (`dh.json`).

**Step 4 is false for DH.**
* DH's Weil form on the matched filter e^{−iHu} sinh(du) 1_{|u|≤a} (d = 0.3085, H = 85.699):

  | support 2a | 6 | 8 | 10 | 12 |
  |---|---|---|---|---|
  | value W | −6.27 | −57.68 | −310.04 | −1420.56 |
  | Rayleigh quotient | −3.09 | −10.50 | −24.44 | −52.95 |

  This is independent code, and it agrees with round-2 phase-alignment `dh.json` to all printed digits.
* So ε₀^{DH} → −∞, and by H3 the far-line floor fails for DH at every η. Measured min U_η/η (κ = 1) in a window around
  H: −20.5, −46.3, −100.6, −208.2, below the Rayleigh quotients as H3 requires.

**Conclusion.** Zero-freeness of a completion, and with it harmonicity of its log-modulus, is available for every
Dirichlet series with a functional equation. Steps 1–3 and (4a)–(4c) use nothing more. A proof of (4d) therefore has to
use the Euler product, and in some way other than the zero-freeness of a completion, which DH also has.

### 4.6 The fake test: Step 4 is false for an Euler product with nonnegative integer local data

**Dictionary.**
* T = q^{−s}. The critical circle is |T| = q^{−1/2}, the angle is θ = t log q, support N corresponds to W = N log q, and
  η = κ/(N log q).
* Zero-side coefficients s_n = Σ_i β_i^n, with β_i = α_i/√q.
* The compressed form at support N is the Toeplitz matrix [s_{|j−k|}]_{0≤j,k≤N}. This is exact; the form is
  finite-dimensional.
* Euler completion by the closed points of degree ≤ N:
  - s̃_n = s_n for |n| ≤ N, and s̃_n = q^{−|n|/2}(1 − N^{(N)}_{|n|}) for |n| > N, with N^{(N)}_n = Σ_{d|n, d≤N} d a_d;
  - symbol σ^{EP} = Σ_n s̃_n e^{inθ};
  - far-line odd potential H_η/η = Σ_n s̃_n [sinh(η r_n)/(η r_n)] e^{inθ}, with r_n = |n| log q.
* This is the exact analogue of (1.1). Put ξ_N(s) := q^{(g−1)s}(1 − q^{−s})(1 − q^{1−s}) ∏_{d≤N} (1 − q^{−ds})^{−a_d}.
  It is holomorphic and zero-free in the open strip 0 < σ < 1. Then
  σ^{EP} = (2/log q) ∂_σ log|ξ_N| + P_N on the critical line, with the pole term
  P_N(θ) = 4 + 2Σ_{n=1}^{N} q^{n/2} cos nθ + 2Σ_{n≥1} q^{−n/2} cos nθ.
* H1–H4 hold. The proofs are Fourier-multiplier identities. The strip becomes the annulus q^{−1} < |T| < 1.

**Fake A: q = 5, P(T) = 1 + 11T² + 25T⁴.**
* α = ±2.7913i and ±1.7913i; |β| = 1.2483 and 0.8011; arg β = ±π/2. The off-line real part is
  ½ + log|β|/log q = 0.6378.
* Properties:
  - a_d ≥ 0 for all d. Directly, min a_d = 6 for d ≤ 160. For d > 160, a log-space tail inequality applies, since
    max|α| = 2.79 < q.
  - The functional equation is built in, and the zeta function is rational.
  - P(T) ≥ 1 on [0, 1], so there are no real zeros.
* **Exact witnesses (PROVED).** Since β ∈ {±ir, ±i/r} with r = 1.2483, s_n = 2cos(nπ/2)(r^n + r^{−n}), and
  s₂ = (q² + 1 − N₂)/q = −22/5 gives r² + r^{−2} = 11/5.
  - For even N = 2m take f = e₀ − (−1)^m e_N. Then the form is 2s₀ + 2(−1)^{m+1} s_N = 8 − 4u_m and ‖f‖² = 2, where
    u_m := r^{2m} + r^{−2m}.
  - The u_m are rational: u₀ = 2, u₁ = 11/5, u_{m+1} = (11/5)u_m − u_{m−1}.
  - Hence ε₀(2m) ≤ 4 − 2u_m, which tends to −∞ like −2r^{2m}.
  - At N = 2 this gives −2/5, the vector (1, 0, 1) with form −4/5. At N = 4 it gives −1.68, which equals the computed
    λ_min. At N = 36 it gives −5864, against the computed −9940.

`fake.json`. D_F(N) := −Σ_{n≤N} (N + 1 − n) s_n is the box (Landau) analog.

| N | ε₀(N) | min σ^{EP} | min H_η/η (κ = 1) | D_F(N) | r^N |
|---|---|---|---|---|---|
| 4 | −1.68 | −8.86 | −12.06 | 7.52 | 2.43 |
| 8 | −9.81 | −30.7 | −36.7 | 14.6 | 5.90 |
| 12 | −34.6 | −95.8 | −111.3 | 20.3 | 14.3 |
| 16 | −100.2 | −273.9 | −315.2 | 22.9 | 34.8 |
| 20 | −265.0 | −737.3 | −845.6 | 17.7 | 84.4 |
| 24 | −670.9 | −1913 | −2192 | −6.39 | 205 |
| 30 | −2605 | −7688 | −8820 | 266.3 | 776 |
| 36 | −9940 | −30140 | −34640 | −708 | 2934 |

* ε₀(N)/r^N → −3.4. The floor exponent is p = 2 log r/log q = 0.2756, which by V7 corresponds to Re s = 0.6378 ✓.
* D_F changes sign, with amplitude about 0.24–0.34 r^N. So the one-sided Landau bound also fails for fake A, as
  round-1 Theorem F predicts when the off-line ordinate is not 0.

**Other data.**
* **Fake B** (q = 13, P = 1 − 11T + 150T² − 143T³ + 169T⁴, off-line real part 0.9624, arg β = 1.1305):
  ε₀(36) = −7.0·10¹⁸.
* **F₅** (genus 1, real off-line zero at 0.799): ε₀(36) = −5.4·10⁷. But its box analog is always negative
  (−2.3·10⁸ at N = 36), so the one-sided box bound holds for it. This is the t = 0 exception of round-1 §4.4.
* **RH-true control** (q = 5, P = 1 + 10T² + 25T⁴, |β| = 1):
  - ε₀(N) = 0, with |ε₀| ≤ 1.4·10⁻¹⁴; the matrix is a sum of four rank-one positive semidefinite terms;
  - min σ^{EP} ≈ −N (from −5.6 to −34), and min H_η/η ≈ −1.4N (from −8.4 to −48.7).
  So the pointwise floors are polynomially negative while the compressed floor is exactly 0. This is the function-field
  image of the Dirichlet-lobe loss.
* **Search** (`fakesearch.json`): for q ≤ 13 and c₂ < 6q², there are 6587 genus-2 fakes with non-real off-line
  quadruples and all a_d ≥ 0. Their off-line real parts reach 0.9624.

**Theorem F2 (fake transfer; PROVED for the fake).** The proof uses three facts: the exact witnesses above, a_d ≥ 0
(checked exactly for d ≤ 160, with a certified tail beyond), and H3, which gives inf H_η/η ≤ ε₀. Step 4 is not a
consequence of the following properties, and neither is its box (t = 0) slice:
* zero-free finite Euler products with nonnegative integer exponents;
* a functional equation;
* rationality;
* absence of real zeros;
* harmonic analysis on the strip (H1–H4, the minimum principle, Harnack).

Fake A has all of these properties and violates Step 4 by an exponential amount. This is a statement about proofs, not
about ζ. A proof of Step 4 for ζ must use a property of ℚ that fake A lacks.

For the box direction, the archimedean factor contributes aW + T(W) to Ψ(W) (Suzuki module §1). That is negligible at
polylogarithmic precision. So for the box slice, the missing property must lie in the distribution of the rational
primes themselves, or in a structure the fake lacks. Route 27 identifies such a structure for curves: the Hodge index
theorem on C × C, which the fake does not have.

### 4.7 What a working Step 4 would need

A one-sided estimate, at square-root precision, for the actual von Mangoldt function:

  Σ_{n<X} Λ(n) n^{−1/2} w(n) ≤ ∫_1^X u^{−1/2} w(u) du + C(log X)^m

for positive weights such as w_η (this is t = 0), together with its twisted versions uniformly in t up to e^{O(√X)}.
At t = 0 this is the one-sided Landau target: arithmetic foundation §2, the Suzuki §4 signed credit prefix, round-1
Theorem E, and H5(c). It is the first item of the atlas closing line. Neither DH nor fake A satisfies it. Proposition H6
shows that the harmonic decomposition itself loses nothing under RH (q = q^♮). What is missing is arithmetic, not
harmonic analysis.

---

## 5. The four walls and vortex trapping

**(1) Flow-blindness (`src/data/flow-blindness-no-go.js`, SL2). Not blocked literally; blocked by two analogues proved
here.**
* Step 4 is a statement about prime data: ξ_g is built from Λ(n), n < X. The flowed function Ξ_ε = H_{−ε} has no
  Dirichlet series, so Step 4 has no flowed version, and SL2 does not apply to it as stated.
* The harmonic ingredients themselves (Poisson, Dirichlet-to-Neumann, minimum principle, Harnack) are soft.
* The DH test (§4.5) plays the role of SL2 for Dirichlet series. The identities of §2 hold for every Dirichlet series
  with a functional equation, through the zero-free exp-completion, so they cannot force a floor that DH violates.
* The fake test (§4.6) extends this to Euler products with nonnegative integer local data, a functional equation,
  rationality and no real zeros.

**(2) NS-RIGID (`src/data/imp-95530-...`). Not the obstruction, but the same dichotomy appears.**
* The native span uses real nodes s_i > 1 and the Pick matrix of ξ′/ξ. This attempt works in the critical strip,
  outside the span, in NS-RIGID's loophole class (inputs that use the coefficients on the critical line).
* Within that class NS-RIGID's dichotomy "soft, or RH itself" reappears. Everything proved in §2 is soft, being both
  DH-valid and fake-valid. The only arithmetic step, the t = 0 slice of Step 4, is RH by Landau (round-1 Theorem E;
  H5).

**(3) Verified-height wall (Route I ceiling; RES-T B1, T_X = 3.88 at X = 3·10¹²). Not the obstruction for the cofinal
target.**
* The anchor (4a) lies at |t| ≥ t\* = e^{O(e^κ √X)}. That exceeds 3·10¹² once X ≥ 37 (round-1 (3)), and the compact
  range of (4b) contains heights far above the verified height. So Step 4 at fixed X is not a consequence of the
  verified height, and the cofinal statement is RH.
* The harmonic floors are also weaker than the actual form where positivity is known. σ_X(0) = −3.72 at λ² = 4 and
  m_g(η) ≤ m_g(0) by H3, whereas ε₀ > 0 for λ² ≤ 16.001 (whole-even certificate). So the harmonic route cannot even
  reproduce the accepted finite certificates.

**(4) Pointwise / MV-CAP (route 42; `formalization/paper/mv-cap-theorem.md`). Avoided as an inference; the pointwise
wall is met in its sharpest form.**
* No mean value is used, so the MV-CAP inference (every window from averages) never occurs. Round-1's failing step
  (4b)(i) is avoided.
* The obstruction that is met is pointwise at one point, t = 0, at bounded height, where the statement needed is a
  one-sided prime count (Landau; parity).
* The "local negative mass" repair of §7 would be an every-window statement and would meet MV-CAP.

**Vortex trapping (`research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`).**
* No collision, winding or box input is used.
* The global target here is RH-equivalent (Theorem HP ⟺ RH). This is consistent with that note's Theorem A, which
  shows that global statements of this kind are RH.

**The audit's three boundaries (PUBLICATION_SCOPE).**
* A negative lower surrogate is not a negative actual form. Pointwise and far-line negativity are never read as
  negative Weil vectors; the RH-true control (§4.6) shows a compressed floor of exactly 0 next to pointwise floors of
  about −N.
* Summable errors do not bound signed supply. No summable-error argument is used.
* "Accepted" is not "replayed". Round-1 Theorem C is used with the audit's status of its inputs: the Suzuki box identity
  and the one-sided Landau theorem.

---

## 6. The levers named in the task

* **V7 floor (atlas §10).** This is the target, used through round-1 Theorem C. In the anchor analysis (§4.3(d)) the
  harmonic transport reproduces the V7 relation between the exponent p and the strip width c (p = 2c). It moves nothing.
* **7/8 half-plane** (openai/math family 003; Lean-built locally; not peer-reviewed). It would anchor the true log|ξ|
  at distance c = 3/8. The transport costs X^{3/8} = λ^{3/4}, so at best the V7 exponent p = 3/4 (ARGUED, with the
  caveat of §4.3(d)). It does not anchor the odd potential of a finite product (§4.1). CONDITIONAL on the 7/8 result.
* **PR #14 / Xu–Sang, B = 0.87488665** (CONDITIONAL on the imported analytic estimates and closure lemma). The same
  reading gives c = B − ½ and at best the exponent 2B − 1 = 0.7497733. Like 7/8, it enters only as a half-plane, that
  is, an anchor at a fixed distance with transport cost X^c. The round-1 bootstrap (Theorem S) records that Xu–Sang's
  own iteration stops at 0.874886647.
* **Dirichlet-coefficient positivity: Levinson–Conrey, Alpöge–Furman ≥ 2/3 (route 16).** These are proportion
  statements. One off-line pair changes such counts by at most 2 outside a window and by at most 19.3 inside it
  (MV-CAP Theorem C; about 36 in the route-42 referee's corrected κ = 1 variant). The same pair moves the compressed floor by an amount growing like X^δ, with δ = β − ½. In the H6
  picture these inputs constrain the outer data on average, whereas Step 4 needs every point.
* **Function-field dictionary (route 27).** The fake test isolates what a curve has and fake A lacks. It is not:
  - the Euler product;
  - the functional equation;
  - rationality;
  - harmonic analysis on the strip.
  Curve and fake share all four. What the curve has in addition is its geometric origin, through the Hodge index theorem
  on C × C. Over ℚ the corresponding object is the missing Spec ℤ × Spec ℤ, which the round-2 modular-tower attempt
  approaches through X₀(N) × X₀(N).

---

## 7. Repairs considered

1. **Optimize the completion (null part).** By H3 and Remark H3.1, no completion's far-line floor is better than
   inf σ_g ≤ ε₀. Larger Euler products are worse at t = 0 (§4.2). The optimum over all null symbols equals ε₀ (atlas §9
   completeness) but has no closed form; atlas §9 records that the lattice relaxations fail at L = 11/20.
2. **Use the even (smoothing) transport.** By H4 it replaces q_λ by the modulation average q_η ≥ ε₀^{full}. That does
   not give a floor for q_λ.
3. **Green's identity with a subharmonic weight.** Put φ(s) := f̂(−i(s − ½)), so that Δ|φ|² = 4|φ′|² ≥ 0. Green's
   second identity on {½ < σ < ½ + η} gives (STANDARD)

     (1/2π) ∫_{σ=1/2} |φ|² ∂_σ H_g dt = (1/2π) [4 ∫_{1/2<σ<1/2+η} H_g |φ′|² dA + ∫_{σ=1/2+η} (|φ|² ∂_σ H_g − H_g ∂_σ |φ|²) dt].

   * The interior term is one-sided in H_g, with a positive weight.
   * The far-line term needs two-sided control of both H_g and ∂_σ H_g.
   * Letting η grow does not remove it, because |φ(σ + it)|² grows like e^{(σ−1/2)W}.
   So this only moves the problem to another line. (ARGUED; the identity is standard.)
4. **Control the local negative mass.** One has q_λ[f] ≥ −(1/2π) ∫ H_g^− (k_η ∗ |f̂|²). Using this needs two things:
   * (i) every window of length 1/W, at every height up to t\*, carries negative mass at most polylog·η/W. That is an
     every-window statement, and MV-CAP applies.
   * (ii) a pointwise comparison of k_η ∗ |f̂|² with its local averages. That fails near the zeros of f̂.
5. **Littlewood's lemma / Jensen** (zero density from ∫ log|ζ| on vertical lines). It yields "few" zeros, never "none"
   (NS-RIGID candidate (b); MV-CAP).
6. **Riesz–Herglotz (H6).** Exact under RH. It reduces RH to a floor for the outer form, which is RH-equivalent by (2.5).
7. **Harnack's principle (H5).** It reduces RH to one-sided real prime sums, which the parity barrier blocks (round-2
   Stepanov, Theorem P).

---

## 8. Numerical record

All results are NUMERIC: IEEE double, numpy/scipy, and mpmath at 25 digits for the DH zero. None of this is interval
arithmetic. Environment: `.venv-arb/bin/python -I` (numpy 2.5.3, scipy 1.18.1, mpmath 1.3.0). One process per script;
each finished in under 90 s and under 1 GB.

| Script | Output | What it checks | Result |
|---|---|---|---|
| `tmp/rha-harmonic-floor-lib.py` | — | σ_X, σ^♭_X, U_g, Π_X, H_g, k_η | library |
| `tmp/rha-harmonic-floor-identity.py` | `identity.json` | H1(i), (ii); (2.2); phase-velocity form | H_g = 0 on the line; ∂_σ H_g − σ_g ≤ 1.6·10⁻⁸; (2.2) ≤ 3.6·10⁻¹³; phase-velocity form ≤ 7.5·10⁻⁸ |
| `tmp/rha-harmonic-floor-infscan.py` | `infscan.json` | m_g(η) against m_g(0), Euler and sharp completions, X = 10² to 10⁵, all η < ½ | §2.3 table; ratio m^♭(η)/m^♭(0) within 6% of sinh(ηW)/(ηW) |
| `tmp/rha-harmonic-floor-t0.py` | `t0.json` | explicit t = 0 identity (sharp completion) | ≤ 6·10⁻¹⁴, after adding the term log((½ + η)/(½ − η)) |
| `tmp/rha-harmonic-floor-extra.py` | `extra.json` | closed form of the kernel Q; H5 numerics; σ_{X,Y}(0) | 2.4·10⁻⁸; §2.5 table; −5.90, −94.6, −370.5, −1237 |
| `tmp/rha-harmonic-floor-fakesearch.py` | `fakesearch.json` | genus-2 fakes with non-real off-line quadruples and a_d ≥ 0 | 6587 found (q ≤ 13, c₂ < 6q²); off-line real parts up to 0.9624 |
| `tmp/rha-harmonic-floor-fake.py` | `fake.json` | fakes A and B, F₅, RH-true control: ε₀(N), min σ^{EP}, min H_η/η, D_F(N); a_d ≥ 0 with tail certificate; no real zeros | §4.6 table |
| `tmp/rha-harmonic-floor-dh.py` | `dh.json` | DH exp-completion identity; matched-filter Weil values at 2a = 6–12 | 3.7·10⁻¹³; Rayleigh quotients −3.09, −10.50, −24.44, −52.95 |

Not done:
* No interval-arithmetic certificate.
* Grid minima are only upper bounds for the infima on the scanned ranges.
* The X = 10⁵ scans cover only t ≤ 60.

Nothing numerical is used as a premise of a proof. The numerics check identities and conventions, and measure the
quantities that the failure analysis refers to.

---

## 9. Adversarial self-check

No independent referee was available in this run. The argument failed, so no surviving claim needs one. The proved
items below should be re-derived by a fresh referee before anyone cites them.

**Checked by the author.**
* **H1.** Numerically: the potential vanishes on the line, its normal derivative equals the symbol, and the phase
  velocity agrees. The oddness and harmonicity claims rest only on zero-freeness and on the reflection
  s ↦ 1 − \bar s.
* **H2.**
  - The closed forms of k_η and Q_{a,b} were checked numerically.
  - The growth condition for Phragmén–Lindelöf (O(log|t|) against the threshold e^{π|t|/η}) follows from Stirling's
    formula and from boundedness of the finite-product part at fixed X.
  - Positivity of Q needs 0 < a < b; this was checked.
* **H3.** A two-line consequence of H2 and of the compression inequality.
* **H4.** Fubini, plus the negative 2×2 minor of e^{η|x−y|}.
* **H5.**
  - (c ⇒ a) uses (s − 1)ζ(s) > 0 for real s > 0. It also uses that the transform of A ≥ 0 is holomorphic near every
    real point beyond its abscissa. Both were checked.
  - (b ⇒ a) uses Harnack's principle in the form "locally uniformly bounded above implies normal, with limits harmonic
    or −∞". The −∞ alternative is excluded by convergence on σ > 1.
* **H6.** The sign of ∂_σ G_Ω, the constant 8/(1 + 4t²) from the pole, and the cancellation of the deltas at zeros on
  the line were each checked once.
* **The t = 0 identity.** A first draft omitted the term log((½ + η)/(½ − η)). The numerical check found the missing
  0.4414, and the identity now holds to 6·10⁻¹⁴.
* **Fakes.**
  - a_d is integral (asserted in exact integer arithmetic).
  - The tail positivity certificate is a log-space inequality valid for d ≥ 160, given max|α| < q.
  - Exact witness: −4/5 at N = 2.
  - The RH-true control has compressed floor 0, as it must.
* **DH.** An independent re-implementation reproduces the round-2 matched-filter values to all printed digits.

**Weakest points.**
1. **H6** relies on the canonical factorization in a half-plane and on identifying the boundary distribution at zeros
   on the line. Both are written here once, by the author. The conclusion RH ⟺ (q^♮ floor) depends only on (2.5),
   whose direction is fixed by the sign of the Green-function normal derivative. H6 is not used in the failure
   analysis except as an interpretation.
2. **§4.3(a)** ("even under RH, the far-line floor at fixed distance is a power of X"). The amplification factor is an
   operator identity (H2). That the band-edge part of σ_g has the size of the lobes under RH rests on round-1 Theorem B
   and Corollary B2 plus the numerics; no lower bound for the lobes at all X is proved here. ARGUED + NUMERIC. The
   failure of Step 4 does not depend on this point: H3 alone puts Step 4 above round-1's pointwise floor and its
   RH-equivalent t = 0 slice.
3. **§4.3(d) and §6** (the 7/8 and Xu–Sang anchors give at best p = 2c) are ARGUED. The converse direction of V7 is not
   established (round-1 §6).
4. **Theorem F2** is a statement about proof templates. It shows that Step 4 does not follow from the listed properties
   as they hold in both settings. It does not show that Step 4 is false for ζ. Step 4 may be true for ζ, and it would
   imply RH.
5. The claim that the uniform-in-t form of (EP_m) is beyond RH by known methods is inherited from round-1 §4.3 (ARGUED
   there).
6. H5 is classical in substance. The attributions (von Koch's error term under RH, Landau's lemma, Harnack's principle,
   the H^∞ factorization) are to standard sources and were not re-checked against the originals in this session.

---

## 10. Status

RH is open. NO QED. Platt–Trudgian Λ ≤ 0.2 stands. There is no new zero-free region and no Λ bound.

What is proved here (same-model, author-checked only, classical in substance; novelty not claimed):
* H1: the odd harmonic potential, and null freedom over the completions 𝒢_X.
* H2: exact strip transport with positive kernels k_η and Q.
* H3: normalized far-line floors are non-increasing in η, and bounded above by the round-1 pointwise symbol floor.
* H4: the even (smoothing) transport is an average over modulations, giving a one-way inequality.
* H5: Harnack's principle for corrected Euler products ⟺ one-sided real prime sums ⟺ RH.
* H6: the Riesz–Herglotz split. Off-line zeros add positive Poisson bumps to the symbol, and q_λ ≥ q^♮_λ with equality
  iff RH.
* The explicit t = 0 identity.
* Theorem F2, with fake A (genus 2, non-real off-line zeros, a_d ≥ 0) and the search finding 6587 such fakes.
* The observation that every Dirichlet series has a zero-free completion, so harmonic identities are DH-valid.

The useful outcome is the location of the failure. Harmonic transport of the compressed Weil form across a strip of
any width comes in two kinds:
* the odd transport is exact but de-smooths, multiplying the band edge by sinh(ηW)/(ηW);
* the even transport smooths but replaces the form by a weaker one.

The minimum principle and Harnack's inequality only move lower bounds between lines. They need an anchor. The anchor
needed is a one-sided estimate on the actual rational primes at square-root precision. Its t = 0 instance is the
Landau target already on record. The genus-2 fake violates even the t = 0 analogue. DH violates the uniform version:
its floor fails at height 85.7. The premise "ζ_X has no zeros, so log|ζ_X| is harmonic" carries no arithmetic
information about the compressed operator.
