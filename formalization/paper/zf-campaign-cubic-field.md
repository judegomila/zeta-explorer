# Zero-free campaign, lever "new probe field: cubic". Second pass, after the PR #27 audit

Internal analysis, 2026-11-01. Branch `editorial-redesign`, nothing committed, nothing sent off the machine.

This file replaces the first pass of the same lever (written earlier on 2026-11-01, before the PR #27 audit snapshots were supplied to the campaign). The first-pass text is preserved byte-for-byte at `tmp/zf-cubic-field-first-pass.md`. Section 0.3 lists exactly what changed and why.

**On the audit.** The PR #27 route atlas (`/tmp/atlas-snap-historical-routes.md`), the publication-scope note and all eight module notes (spectral head, signed complement, whole-even certificate to λ ≤ √(16001/1000), spectral-denominator repair, Suzuki recurrence, prime memory, finite Suzuki certificate, arithmetic foundation) were read before this pass. So were the PR #14 sources it cites (`git show refs/pr/14:rigorous/mobius_bridge_reduction/{README,SIGNED_PHASE_FILTER,TARGET_0874}.md`). Section 1 maps every overlap with an atlas section and states what is different.

Sources:
* openai/math family 003. The 7/8 manuscript is `~/lean-deps/qrh-verify/paper.txt` and the 11/12 manuscript is `~/lean-deps/qrh-verify/paper2.txt`. Both are Lean-formalised by their authors and unrefereed. They are cited as "(7/8, x)" and "(11/12, x)".
* Prior analysis: `beat78-*.md`, `qrh-improvement-attempt-*.md`, `src/data/beat-seven-eighths-2026-10-08.js`, `src/data/beat78-prop152-2026-10-09.js`.

Scripts, all run with `.venv-arb/bin/python`. Logs are next to them.

| script | content | runtime |
|---|---|---|
| `tmp/zf-cubic-field-lib.py` | exact Z[ω] arithmetic, sextic tables, Gauss sums (first pass) | — |
| `tmp/zf-cubic-field-gauss.py` | Gauss identities, class ledger, parity rule (first pass, re-run: all pass) | 8 s |
| `tmp/zf-cubic-field-poisson.py` | cubic Poisson dual, brute force (first pass, re-run: all pass) | 6 s |
| `tmp/zf-cubic-field-duality.py --gram` | Kummer coherence k = 3, toy Gram (first pass, re-run: log identical) | 6 s |
| `tmp/zf-cubic-field-kubota.py` | sharp-cutoff class energies (first pass) | 13 s / 190 s |
| **`tmp/zf-cubic-field-model.py`** | corrected Framework-A model, cubic Framework-B model, dictionary | 65 s |
| **`tmp/zf-cubic-field-model-sens.py`** | sensitivity of the Framework-B count | 60 s |
| **`tmp/zf-cubic-field-filter.py`** | PR #14 phase filter at order k = 2, 3, 6, exact | 1 s |
| **`tmp/zf-cubic-field-eisenstein.py [X] [mod] [e1/e2p/e3]`** | smooth-weight tests of the Kubota–Eisenstein structure | 35–60 s each |

Labels:
* **[PROVED]**: complete argument given here.
* **[PROVED-rel]**: proved relative to identities of the 7/8 or 11/12 paper used as stated. These identities are also re-checked numerically.
* **[RECALLED]**: a literature fact quoted from memory, not re-derived and not checked against the source here.
* **[EXACT]**: exact integer or rational computation.
* **[NUMERICAL]**: floating-point check of a finite statement, or a measurement in a finite model.
* **[HEURISTIC]**: exponent bookkeeping or model reasoning. Not a proof.

---

## 0. Outcome

### 0.1 Result

* **No zero-free half-plane below Re s = 7/8 is obtained. No rigorous gain.**
* θ′ = 7/8 is unchanged. It is itself conditional on the unrefereed 7/8 manuscript.
* PT Λ ≤ 0.2 stands. The conditional Λ values derived from the 7/8 start are unchanged.
* RH is open. NO QED.

### 0.2 Answers to the lever's four questions

1. **Does Poisson → Gauss sums → automorphic object survive with cubic twists?**
   * *Automorphy survives; the twist conversion does not.* The Poisson dual of the cubic Möbius family is a modulus-sum of sextic Gauss sums (class x² in the ledger of §2.3), twisted by a cubic character.
   * Such sums are Fourier coefficients of Kubota's 6-fold metaplectic Eisenstein series, viewed as functions of its spectral parameter. They therefore have a functional equation (reflection **R2**, §3). The conductor is ≍ N(h)², the same dual length as in the 11/12 paper.
   * What fails is the theta-specific reflection **R1** of the 11/12 and 7/8 papers. R1 uses Patterson's index–modulus identity, which exists only for the cubic cover. It converts the sextic twist into a quadratic one, (11/12, 2.14): χ^{−1}χ^{−2} = χ^{−3}.
   * R2 keeps the cubic twist. Every variant (Möbius, von Mangoldt, Framework A, Framework B) therefore meets Heath-Brown's cubic large sieve and its cross term (MN)^{2/3}, instead of Goldmakher–Louvel's quadratic sieve.
2. **Resulting exponent.** All values here are [HEURISTIC]; none is proved.
   * Framework A (11/12 architecture): **8/9** with Heath-Brown's sieve, **5/6** with the conjectured optimal cubic sieve. It goes below 7/8 exactly when the cross exponent satisfies c < 8/13 (§4).
   * Framework B (7/8 architecture): a cubic probe is **formally constructible** from known objects (§5). Its exponent count in the first-pass reconstruction of the paper's constraints is **≈ 0.807**, with range 0.797–0.838 over the cubic-kernel variants of §5.5.
   * This last number is an exponent count on a reconstructed constraint set. It is not an estimate that has been proved or even fully derived.
3. **Duality obstruction.**
   * *Persists in Framework B.* For k = 3 the exceptional coset exists exactly when ξ³ = 1, which is the condition for the signal. The coherent coefficient is identically 1, and b cancels: σ₀ = 2/3 + M/6 − ℓ/3, independent of b.
   * *Does not bite in Framework A.* There the dual principal rows carry Σ μγ₂ = Σ αGγ̄₁, which has no theta main term. This is supported numerically (§3.4, E1). Framework A is capped at λ ≥ 1 anyway.
   * The PR #14 sixth-phase filter, run at order 3, keeps eigenvalue one on a blind set 2^K times larger, with 5/2 times the mean energy [EXACT, §6]. The blind set, the amplifier rows and the exceptional frequencies are the same Kummer coset.
4. **Other fields.**
   * No change. There are no cubic CM fields. Cubic residue symbols need μ₃ ⊂ K, hence K ⊇ Q(ω).
   * The density of trivialising rows is H^{1/k} in every field (first pass, Prop. 3.5).
   * Correction: Q(ζ₇) does not contain μ₃, so the first pass's list of sextic CM fields carrying the sextic architecture must drop it. Q(ζ₉) and Q(ω)·F₃⁺ remain.

### 0.3 What changed relative to the first pass

| first pass | second pass | reason |
|---|---|---|
| "No summation formula with explicit dual twists is available" for the class-x² dual (§2 item 2, §4.4) | **Wrong as stated.** R2 (Kubota's functional equation in the spectral variable) is such a formula. The missing piece is only the *twist-changing* reflection R1. | §3.1–3.3 |
| Framework A theta-free model: Heath-Brown → θ = 1 (trivial); optimal cubic sieve + convexity → exactly 7/8 (§4.3) | **Too pessimistic.** The model never combined the functional equation with the large sieve. Corrected values: Heath-Brown → 8/9; optimal → 5/6; threshold c < 8/13. | §4 |
| "No cubic Framework-B probe can be built from known objects" (§4.5) | **Wrong.** The probe needs a class-x² Dirichlet series in the Mellin variable with a functional equation, not a 6-fold *theta*. The 6-fold Kubota Eisenstein coefficient series supplies it. | §5 |
| Q(ζ₇) listed among sextic CM fields | Q(ζ₇) ∌ ζ₃ | elementary |
| Ledger, Poisson dual, Möbius absorption, duality for every k, parity rule | unchanged; scripts re-run, all checks pass, duality log byte-identical | §2, §6 |

### 0.4 Precise obstruction (short form)

* **Twist conversion.** No reflection known for the class-x² objects turns a cubic twist into a quadratic one.
  * R1 needs Patterson's index–modulus identity for the 6-fold cover. Kazhdan–Patterson non-uniqueness says local theory gives no such identity [RECALLED].
  * The cubic theta's own R1 maps cubic twists j_p ∈ {2, 4} to cubic or principal factors, never to quadratic ones (7/8, Prop. 5.1, item 2).
  * R2 preserves the twist.
  * So the cubic large sieve's cross term (MN)^{2/3} enters every route.
* **Framework A.** That cross term costs λ = 7/6 instead of 1 (θ = 8/9). Beating 7/8 needs a cross exponent c < 8/13 ≈ 0.615 for these sums. Heath-Brown has 2/3.
* **Framework B.**
  * The cubic kernel adds P_c = ½·max(0, M + 2ℓ/3 − 2/3) to the low exponent.
  * In the reconstructed constraint set the doubled amplifier density more than pays for it (≈ 0.807).
  * That count rests on an unverified high-side model and on a 200-page rebuild of the 7/8 paper with the 6-fold Eisenstein series. None of it is done. §5.6 lists the steps.
* **Duality.** The duality obstruction (b cancels) is untouched by the change of order. It is the same Kummer coset that PR #14's filter cannot see past.

---

## 1. Audit cross-check (PR #27)

The atlas classifies prior routes and states for each an "unresolved condition". This lever overlaps with the atlas as follows.

| atlas item | overlap with this lever | what is reused, and what is different |
|---|---|---|
| **§10, PR #14 / Xu–Sang** (B = 17497733/20000000 = 0.87488665, conditional on Xu–Sang v2 and its closure lemma) | Same architecture as Framework B. Xu–Sang's B = 11/12 − ℓ/4 is the k = 6 case of the line formula σ₀ = 1 − 1/(2k) − 3ℓ/(2k) on M + ℓ = 1. | Used as input: the k = 6 calibration of §5.5 reproduces the beat78 re-tune 0.874957. Xu–Sang's κ-bootstrap would be available verbatim in a cubic probe. Their open hypothesis (H), a restricted fourth moment saving U^{−1/40}, is a high-side input whose difficulty does not depend on k (§7.3). Not attempted. |
| **§10, sixth-phase filter "retains eigenvalue one"** | Directly. The eigenvalue-one subspace is the Kummer coset of the duality obstruction (§6). | Not re-attempted. §6 runs the filter at order 3 only to show that the change of order makes it strictly worse (energy ×5/2, blind set ×2^K) and to identify the blind set. No filter is proposed. |
| **§10, V7 discrepancy floor** (ε₀(λ) ≥ −C(1+log λ)^m λ^p, p < 1 ⇒ no zeros in Re s > (1+p)/2) | Dictionary only: p = 2θ − 1 (§7.1). | The floor is a statement about the Weil form of ζ alone. The amplifier is a family method: Poisson rows introduce Hecke twists, and θ_ζ ≥ θ_family inside the architecture (beat78 R10). So the floor is a target restatement, not a lever for this method. Not attempted. |
| **§10, "B = 0.874 needs U^{39/40+ε}"** | High side only. | Unchanged by the probe field (§7.3). |
| **§9, fixed-support positivity / null-symbol duals** | No methodological overlap. | Its logical rule is applied here: "a failed sufficient estimate is not a negative direction of the actual form". Every obstruction in this file (duality term, cubic-sieve penalty) obstructs a *sufficient estimate*. None of them is a lower bound for the actual probe, and none is evidence of a zero. |
| **§11, "a uniform strictly positive scalar margin is the wrong RH target"** | No overlap. | The target here is an upper bound for signed sums, not a positive margin. The positivity used (mean squares, Cauchy–Schwarz) is a sum of squares, not a margin. |
| **§§2–8** (twin ladder, information, synchronisation, vortices, theta certificates, curvature, twistor/Hankel) | None. | **Name collision.** "Theta" in atlas §§5–6 and the closing line is Riemann's Φ / H_τ heat-flow transform. "Theta" here is the Kubota–Patterson metaplectic theta function on a cover of GL(2) over Q(ω). They are unrelated. |
| **closing line** ("a genuine all-scale signed arithmetic estimate, a cofinal actual-form floor, or an exhaustive theta boundary/collision certificate") | This lever is a candidate of the **first** kind: the cubic family mean square for all D (Framework A), or the cubic probe's low and high bounds for all Z (Framework B). | Not supplied. §8 states what is missing. |
| **publication scope**: "a negative lower surrogate does not imply a negative actual form"; "a finite positive prefix does not prove an all-scale lower bound" | Applied. | The numerical tests of §3.4 are finite-height illustrations of structural claims. They prove nothing about all scales. |

---

## 2. Setting and the results kept from the first pass

### 2.1 Frameworks

**Framework A (11/12 paper).** The family is A_u(D) = Σ_n μ(n)ν(n)χ_n(u)^j W(N n/D) over squarefree primary n prime to S, with χ_n = (·/n)₆. The twist χ_n^j has order k = 6/gcd(j, 6).

**Proposition 2.1 (amplifier, any k) [PROVED; first pass Prop. 1.1].** If Σ_{0<N u≤H}|A_u(D)|² ≪ D^{1+ε}H at H = D^λ, then

  A₁(D) ≪ D^{θ + ε},  θ = max(1/2 + (1 − 1/k)λ/2, 1 − λ/k).

*Proof.* Use the rows u = p^k, Y/2 < N p ≤ Y = H^{1/k}. Then χ_n(p^k)^j = 1_{p∤n}, so A_{p^k} = A₁ + O(D/Y). Hence |A₁|² ≤ (2/J)Σ_p|A_{p^k}|² + O(D²/Y²) with J ≍ Y/log Y. ∎

At λ = 1 this gives θ = 1 − 1/(2k): 11/12 for k = 6 and 5/6 for k = 3.

**Framework B (7/8 paper).** With h = 1 − l_x + ℓ, b = l_y − l_x, M = l_x + l_y and an order-k probe:
* the signal is C(s) = s − 1 + l_x/2 + h/k, coming from the pole of ζ_F(kz) at z = 1/k;
* the exceptional term of the additive Gram bound is P_a^{1/k}, so the low exponent is l_x/2 + b/(2k).

The continuation criterion (7/8, Prop. 2.1) closes at

  σ₀ = 1 − h/k + b/(2k) = 1 − 1/k + M/(2k) − ℓ/k   (b cancels)   [EXACT].

On the line M + ℓ = 1 this is (2k − 1 − 3ℓ)/(2k). For k = 6 that is 11/12 − ℓ/4, Xu–Sang's relation. For k = 3 it is 5/6 − ℓ/2.

### 2.2 The cubic Poisson dual [PROVED-rel; re-verified]

For coprime squarefree primary n₁, n₂ the CRT phase of the cubic twist is c₂(n₁, n₂) = χ_{n₁}(n₂)²·conj(χ_{n₂}(n₁))² ≡ 1, by cubic reciprocity. Poisson summation in u (first pass §2.2, brute force to relative error 1.05·10⁻¹⁵, re-run) gives

  Σ_u Φ(u/√H)|A_u|² = (diagonal ≍ DH) + Σ_{y≠0} Σ_{n₁,n₂} [H·Φ̂(√H y/(n₁n₂))/N(n₁n₂)^{1/2}]·b_y(n₁)conj(b_y(n₂)),

with b_y(n) = μ(n)ν(n)γ₂(n)conj(χ_n(y))²W(N n/D). The dual family is therefore

  **B_y(D) = Σ_n μ(n)ν(n)γ₂(n)conj(χ_n(y))² W(N n/D)**   on N(y) ≪ H* = D²/H.

**Lemma 2.2 [PROVED-rel; re-verified].** On squarefree primary n prime to S:
* γ₁ = Gγ₂²;
* μγ₂ = αGconj(γ₁).

*Proof.* From (7/8, 4.7): γ₂³ = μα and γ₁γ₂ = μαG, all of modulus one. Here G = conj(χ_•(4))·Γ; the PDF loses a bar, as the first pass and `beat78-prop152-subtract.md` both found numerically. ∎

So B_y is a smoothed sum, over the **modulus** n, of normalised sextic Gauss sums conj(γ₁(n)). It is twisted by the weight-one Grössencharacter α, by a ray-class factor, and by the cubic character n ↦ conj(χ_n(y))², whose conductor is the squarefree kernel of y. Brute force gives max |μγ_{−2} − ᾱḠγ₁| = 3.8·10⁻¹⁵ (`gauss` E, re-run).

### 2.3 The Gauss-class ledger [PROVED-rel; first pass §3, unchanged]

Definitions:
* 𝓤 is the multiplicative group of functions from squarefree primary n prime to S into the unit circle.
* 𝓗 ⊂ 𝓤 is the subgroup of products ψ(n)F(n mod f), with ψ a unitary Grössencharacter of Q(ω) and F a unimodular function modulo a fixed ideal f.

**Lemma 2.3 [PROVED, standard inputs].**
* (i) A Grössencharacter that is constant on the primary primes of one ray class has finite order.
* (ii) μ ∉ 𝓗.

*Proof.* Both parts use only Hecke's theorem that L(s, χ) is holomorphic and non-zero on Re s = 1 for χ ≠ 1.

(i) Expand the indicator of the class into ray-class characters η. If ψ ≡ κ on the primes of the class, the prime sum Σ_{π∈c}N(π)^{−s} diverges as s → 1+. It equals |𝔊|^{−1}Σ_η conj(η(c))·log L(s, ψη) up to O(1), which stays bounded unless some ψη is trivial.

(ii) If μ = ψF, then F(c)Σ_{n∈c, sf}N(n)^{−s} = |𝔊|^{−1}Σ_η conj(η(c))/L^S(s, conj(ψ)η). The left side has a pole at s = 1 and the right side is bounded. ∎

**Theorem 2.4 (ledger) [PROVED-rel].** In 𝓤/𝓗 put x = [γ₂]. Then [γ_t] = x^{3−t} for t = 1, …, 5, [μ] = x³, and x has order exactly 6.

*Proof.*
* (7/8, 4.7) gives x³ = [μ] and [γ₁] = [μ]x^{−1} = x². Also γ₃ = χ_•(4)G ∈ 𝓗, and γ_{−t} = χ_•(−1)^t conj(γ_t).
* x³ ≠ 1 by Lemma 2.3(ii).
* Suppose x² = 1, i.e. γ₂² = ψF. Then α² = γ₂⁶ = ψ³F³. So ψ³α^{−2} is constant on classes, and by Lemma 2.3(i) it has finite order. Its infinity type 3m − 2 cannot vanish in Z, a contradiction. ∎

**Corollary 2.5 [PROVED-rel].** The Poisson coefficient μγ_{−j} of the χ^j-twisted Möbius family has class x^j.
* j = ±1 (sextic, density 1/6) lands on x^{±1}: Patterson's cubic theta.
* j = ±2 (cubic, density 1/3) lands on x^{±2}: sextic Gauss sums.
* j = 3 lands on [μ]: circular.

Confirmed numerically by the complementarity search over 3678 columns, with exactly one absorbing T per j ≠ 3, and by the 104-monomial parity rule (`gauss` C, D, re-run).

**Corollary 2.6 (reflection rule of the cubic theta) [PROVED-rel, read off (7/8, Prop. 5.1, item 2)].** Theta reflection maps a local twist χ_p^{j_p} to the factor χ_p^{−j_p−2} for j_p ≠ 0, 4, and to a Ramanujan factor for j_p = 4.
* It is quadratic exactly for j_p = 1 (and j_p = 5 for the conjugate theta).
* Cubic twists j_p ∈ {2, 4} go to χ_p² or to the principal factor, never to a quadratic one.

---

## 3. The two reflections

### 3.1 R1: theta reflection (twist-changing)

This is (11/12, Prop. 6.2) and (7/8, Prop. 5.1), with cusp coefficients from Dunn–Radziwiłł.

* **Applies to:** sums over the Fourier **index** of the cubic theta, twisted by a character of the index of conductor m.
* **Output:** dual length N(m)²/X and reflected local twist χ_p^{−j_p−2} (Corollary 2.6).
* **How the papers reach it:** the Poisson dual Σ_n (Hecke)γ₂(n)χ̄_n(h) is a sum over the *modulus* n. It becomes an index sum by Patterson's formula (11/12, 2.10), c_θ(nb³) = 3^{5/2}|b|χ_n(λ)²γ₂(n). This is the index–modulus identity: the theta coefficient at index n is a Gauss sum with modulus n.

R1 is therefore available exactly where such an identity exists: the cubic cover.
* The 6-fold theta's Whittaker model is not unique (Kazhdan–Patterson: unique only for n ∈ {r, r+1} on GL(r)) [RECALLED].
* Its coefficients are not known in terms of Gauss sums [RECALLED].

### 3.2 R2: Kubota Eisenstein reflection (twist-preserving)

Let K = Q(ω) and ψ a Grössencharacter. Consider

  𝓚_ψ(r, s) = Σ_{c primary} ψ(c)·g₆(r, c)·N(c)^{−s},  g₆(r, c) = Σ_{x mod c} (x/c)₆ e(rx/c).

**Fact R2 [RECALLED: Kubota 1969 for the spherical case; general Eisenstein theory on covering groups for nonspherical K-types].** 𝓚_ψ(r, ·) is, up to Gamma factors and a normalising Hecke L-function, the r-th Fourier coefficient of a 6-fold metaplectic Eisenstein series, as a function of its spectral parameter. Its completed form has meromorphic continuation and a functional equation s ↔ 1 − s (critical line Re s = 1 in this unnormalised form). The functional equation relates index r to a finite set of indices r·η_j in the same class modulo sixth powers. The theta pole occurs only for the spherical type.

Three consequences are used below.

* **Twist preserved.** For c coprime to r and squarefree, g₆(r, c) = conj(χ_c(r))·g₆(1, c) [EXACT]. So "twisting by a sextic character of the modulus" and "moving the index" are the same operation, and R2 keeps it.
* **Conductor.** By the twisting rule for a degree-2 object [HEURISTIC, with the numerical support of E3 below], a twist of conductor h gives conductor ≍ N(h)², so the dual length is ≍ N(h)²/D. This is the same as R1's "N(h)²/X".
* **Squarefree moduli are automatic.** For a prime π ∤ r and k ≥ 2, g₆(r, π^k) = 0: the character is constant mod π and the additive sum over π^{k−1}-lifts vanishes [PROVED]. The normalising L-function is absorbed by completing with sixth-power parts, exactly as (11/12, 2.16)–(2.18) complete the theta with cube parts.

### 3.3 Application to the cubic family

Lemma 2.2 gives B_y = Σ_n αGν·conj(γ₁(n))·conj(χ_n(y))²·W(N n/D). With conj(γ₁) = χ_•(−1)γ₅:

* **(i) The dual is an R2 object.** B_y is a smoothed partial sum of an α-twisted 𝓚 series for the conjugate 6-fold symbol at an index in the sixth-power class of y⁴. Equivalently it is the index-1 series twisted by the cubic character χ_•(y)⁴ of conductor y. R2 reflects it with dual length ≍ N(y)²/D. The reflected sums are again cubic-character sums in y.
* **(ii) R1 is unavailable.** It would need a modulus–index identity for 6-fold Gauss sums.
* **(iii) The von Mangoldt variant ends at the same place** (first pass §4.6, unchanged). Λ makes the dual coefficient a cubic theta coefficient at primes. Vaughan's identity then produces:
  * type II bilinear forms in cubic characters (Heath-Brown's sieve);
  * type I theta sums with cubic twists, which R1 maps to cubic or principal factors (Corollary 2.6).

**Proposition 3.1 (where the chain breaks) [PROVED-rel modulo R2 as RECALLED].** In every variant of the cubic Möbius or von Mangoldt family over K ⊇ μ₆, with either reflection, the reflected row sums carry a cubic or principal character of the row variable, never a quadratic one. The quadratic large sieve therefore never applies to the reflected rows, and the cubic large sieve (Heath-Brown [7/8 ref. 17, Thm 2], quoted as (7/8, 14.6)) does. Its form is

  Σ_{a ≤ U}^* |Σ_{b ≤ V}^* c_b (b/a)₃|² ≪ (UV)^ε{U + V + (UV)^{2/3}}·Σ|c_b|².

The 7/8 paper's own Lemma 9.1 proves the same shape for the exponents j ∈ {1, 2, 4} (D_j norms).

*Proof.* (i)–(iii) above. Corollary 2.6 covers R1 and the twist-preservation statement covers R2. The quadratic conversion χ^{−1}χ^{−2} = χ^{−3} needs j_p = 1, which is the sextic twist. ∎

### 3.4 Numerical checks of the Eisenstein structure [NUMERICAL]

Setup:
* Script `tmp/zf-cubic-field-eisenstein.py`, all squarefree primary n with good prime factors and N(n) ≤ 10⁵ (28 223 columns, 9601 primes).
* Smooth weight W(x) = exp(1 − 1/(1 − u²)), u = log₂x, supported on [1/2, 2].
* Normalised energy e = |Σ f W|²/ΣW² (summed over residue classes where stated), so random phases give e ≈ 1.

**E1. Main terms at h = 1**, 108 classes mod 36. The slope is that of log e against log D for D ∈ [1500, 50000]. The noise level is the spread of the slope over 8 independent random controls: std 0.034.

| sequence | e(D) at D = 1500 … 50000 | slope | expected |
|---|---|---|---|
| γ₂ (cubic theta coefficients) | 1.63 → 10.9 | **+0.535** | +2/3 (Patterson X^{5/6}) |
| γ₁ (sextic Gauss sums, no twist) | 0.90 → 1.67 | **+0.205** | +1/3 (6-fold theta residue X^{2/3}) |
| μγ₂ = αGconj(γ₁) (**cubic dual**, h = 1) | 0.76 … 0.99 | **+0.044** | no main term |
| αγ₂ (sextic-family dual, (11/12, 2.7)) | 0.85 → 0.58 | **−0.143** | no main term |
| random control | ≈ 1 | +0.054 | 0 |

Reading:
* The α-twisted series show no main term.
* The untwisted ones do. γ₂ is clearly visible; γ₁ is about 6σ above noise.
* This supports the step "residue (theta-pole) terms are absent from the cubic dual" used in §4. The same contrast, γ₁ with a main term and αγ̄₁ without, explains why the exceptional term of Framework B is a genuine main term (§6.1) while Framework A's dual principal rows are harmless.

**E2p. Small conductor ⇒ small smoothed sum.** Single sums with no class decomposition, f = αconj(γ₁) = μγ₂Ḡ, D = 5·10⁴.
* h = 1: e = 0.052. This is about 20 times below generic, consistent with an empty dual and only sub-square-root normalising-L terms.
* Twists with N(h) < 30 (7 primes): mean e ≈ 0.40, against 0.96 for the random control.
* N(h) ≥ 250: e ≈ 1.0–1.25 (random ≈ 0.9–1.25).

**E3. Collapse test for the conductor exponent.** e_h(D) for the 24 smallest split primes, averaged over both primes above p and three weight shapes, was tabulated against D/p and D/p².
* Against D/p up to 10³: no suppression; column means 0.88–1.16 over 13–24 primes.
* Against D/p² ≥ 10²: e = 0.515 (p = 7, D/p² ∈ [300, 10³)), 0.433 (p = 13) and 0.255 (p = 19). The fourth such cell, p = 7 at D/p² ∈ [100, 300), is not suppressed (1.09).
* At h = 1, e ≤ 0.35 at 14 of the 16 grid points with D ≥ 10³; the other two are 0.63 and 0.71.
* This favours conductor ∝ N(h)² over ∝ N(h). But only 3 primes reach the decisive cells, so E3 is an illustration, not a test with power.

**Not tested.** The precise exponent of the sub-square-root terms. If the normalising L-function's zeros lie on its critical line, they contribute D^{5/12}: poles at Re s'' = (2 + ½)/6 in the normalisation Σγ(n)N(n)^{−s''}. The measured h = 1 values are too few and too oscillatory to fit an exponent.

**An earlier E2 run was uninformative.** That run used class decomposition mod 12: all bins ≈ 1 except the smallest. The cause is that ray-class characters mod 12 raise the conductor by up to N(12)² ≈ 2·10⁴. At D = 5·10⁴ almost every twist is then already in the non-empty-dual regime. Its log is kept (`tmp/zf-cubic-field-eisenstein.log`).

---

## 4. Framework A, corrected

### 4.1 Model

Assumptions:
* (A1) Σ_u|A_u|² ≼ DH + (H/D)·𝔅, with 𝔅 = Σ_{0<N y≪H*}|B_y|² and H* = D²/H (§2.2).
* (A2) Rows y = y₀a³ with y₀ cube-free satisfy B_{y₀a³} = B_{y₀} up to coprimality, so the multiplicity of y₀ is (H*/N y₀)^{1/3}.
* (A5) |A₁|² ≤ Σ_u|A_u|²/H^{1/3} + D²/H^{2/3}.

These three are unchanged from the first pass. The first pass's (A3) (pointwise convexity) and (A4) (large sieve on the length-D sums) are replaced by one of the following:

* **A-CL (critical line).** Shift to Re s'' = 1/2, where the normalising L-function is non-zero: it is evaluated at 6s'' − 2 = 1 + 6it. The argument 6s'' − 2 is inferred by analogy with the n = 2, 3 cases and is not checked. Bound Σ_{y₀∼R}|L_{y₀}(1/2+it)|² through the approximate functional equation, which has two sums of length √(conductor) = R, and the cubic sieve with cross exponent c. This gives

  Σ_{y₀∼R}|B_{y₀}|² ≼ D(R + R^{2c}).

* **A-V (Voronoi).** Use R2 with dual length R²/D, after sixth-power completion. Remove the completion by Möbius inversion and the transfer recursion, as in (11/12, 2.16)–(2.22), with H_c⁶ in place of H_c³. Normalising T_y as in (11/12, 2.12), so that |B_y|² = D|T_y|²:

  Σ_{y₀∼R}|T_{y₀}|² ≼ R + R²/D + (R·R²/D)^c,   (cubic analogue of (11/12, 2.15)).

  The direct sieve on the length-D sums is used when it is smaller.

### 4.2 Results [HEURISTIC; grid optimisation confirms the closed forms to 2·10⁻³, `model` A]

**A-V:** θ_A = ½ + max(1, 2 − (1+c)/(3c))/3, attained at λ* = max(1, 2 − (1+c)/(3c)).

| cubic cross exponent c | λ* | θ_A |
|---|---|---|
| 2/3 (Heath-Brown) | 7/6 | **8/9 = 0.8889** |
| 8/13 | 9/8 | 7/8 |
| 0.60 | 10/9 | 0.8704 |
| 1/2 (conjectured optimal) | 1 | **5/6** |

**A-CL:** θ_A = 7/6 − 1/(6c). This gives 11/12 at c = 2/3, 7/8 at c = 4/7, and 5/6 at c = 1/2.

**Calibration.** The same A-V bookkeeping for the sextic family has R1 reflection, so the reflected twist is quadratic (c = 1/2 effectively) and the multiplicity is (H*/R)^{1/6}. It returns 11/12 at λ = 1, which is the 11/12 paper.

**First-pass model, re-run.** θ = 1.000 (Heath-Brown) and 0.87478 (c = 1/2, κ = 1/2), as the first pass reported. The difference comes from the reflect-then-sieve step: on rows y₀ ∼ R ≤ D the reflected sums have R²/D columns instead of D.

**Where 8/9 comes from.** With H ≥ D all dual rows have R ≤ H* ≤ D. The binding term is the cross term at R = H*:
* (H/D)·D^{1/3}H*² ≤ DH ⟺ H ≥ D^{7/6}.
* The amplifier then gives θ = ½ + (2/3)(7/6)/2 = 8/9.
* The sixth-power removal needs H_c > 1, i.e. λ slightly above 7/6, exactly as the 11/12 paper needs ϑ > 0. So the limit is 8/9 from above.

### 4.3 What Framework A would need

* R2 written out, with cusp data and Gamma factors, for the α-twisted, ray-class-twisted 6-fold Kubota series over Q(ω). This is the analogue of Dunn–Radziwiłł's cusp expansions for the cubic theta.
* The sixth-power completion and the transfer recursion of (11/12, §5).
* Even then 8/9 > 7/8. To go below 7/8, Framework A needs a cubic-sieve cross exponent c < 8/13 for sums whose coefficients are sextic Gauss sums. No such bound is known to the author of this note [RECALLED status]. Heath-Brown conjectured c = 1/2 for the general sieve.

---

## 5. Framework B with cubic twists: a formal construction

### 5.1 The probe

Mirror (7/8, 6.1) with three replacements.

**(a) Twist.** Replace the sextic twist χ_A(m) by the cubic twist χ_A(m)², and the averaging Gauss sum g_{χ_s}(s, −m) by g_{χ_s²}(s, −m).

**(b) Automorphic factor.** Replace the theta coefficient γ₂(c) by the sextic Gauss sum γ₁(c). The row series becomes

  T^{(3)}_{m,s,η}(t) = Σ_{c sf, b} γ₁(c)·ᾱ(cb⁶)·η(cb⁶)Ξ₃(cb⁶)^{−1}R₃(cb⁶, s)·χ_{cb⁶}(m)²·q_c^{−1/2−t}·w(b)q_b^{−6t−κ₀}.

  Here (w(b), κ₀) are the sixth-power completion weights of the nonspherical 6-fold Eisenstein coefficient. They are not determined in this note. As a function of t, T^{(3)} is (up to fixed finite factors) the completed Fourier coefficient at an index in the class of m^{−2} of an ᾱ-twisted 6-fold Kubota Eisenstein series. Its reflection is R2.

**(c) Probe character.** Choose ξ of order dividing 3. The duality theorem (§6.1) forces ξ³ = 1, otherwise there is no signal. This creates one technical gap. At λ, F₃^× has no character of order 3, so ξ_λ = 1. The paper's device "the primitive Gauss sum at b* removes all frequencies meeting S, including H = 0" (7/8, §7.1) then fails at λ. The H = 0 term and the frequencies divisible by λ must be handled by a separate mask. This is not done here.

### 5.2 High side

* **Möbius appears** [PROVED-rel]. At a prime p | c the Poisson coefficient contains g_{χ_p²}(p, ·) = √Q·γ₂(p)·conj(χ_p(·))² (first pass Lemma 2.1(iii), verified to 7·10⁻¹⁵). Multiplied by γ₁(p) from T this gives

  γ₁γ₂ = μαG   (7/8, 4.7).

  This is the same identity as in the paper, with the roles of γ₁ and γ₂ exchanged. The ᾱ of T removes α, as the paper's α(A) does (7/8, §7.2: "γ₂(c) = μ(c)α(c)G(c)/γ₁(c)"). So the c-sum gives 1/L^S(s, η·χ̄_•(u)²·(finite)).
* **Frequency rows.** These are H = ua³ with u cube-free, because χ_s(H)²conj(χ_A(H))² is trivial on cubes. Every row twist is a cubic twist of the target, so it lies in the family of (7/8, 2.1).
* **Principal row and signal.** The principal row carries ζ_F(3z), with a pole at z = 1/3. The residue weight M(1/3) > 0 holds by the proof of (7/8, 7.2), which works for every σ ∈ (0, 1). The signal is Z^{h/3}.
* **Slot marks.** For the compensation of Part II one needs the marks. Twisted multiplicativity together with sextic reciprocity (7/8, Lemma 4.4, χ_p(c′) = R(c′, p)χ_{c′}(p)) gives [PROVED-rel]

  γ₁(pc′) = R(c′, p)χ_{c′}(p)²γ₁(p)γ₁(c′)   (twisted multiplicativity verified on 417 composites, `gauss` B).

  So restricting the modulus to p | c twists the series by the cubic character χ_•(p)². The marks are cubic characters, as in the paper (where they are χ_P(n)^{−2}), and R2 preserves them.

### 5.3 Low side and the cubic-kernel penalty

After R2 the reflected rows in m carry cubic characters (Proposition 3.1). In the reflected-energy formula (7/8, 14.14),

  E_ref = O/2 + max(H, v + ℓ_b) − S₀ − B₀ + z_a − u − ℓ_b − 2e_λ/3 − ½(T_d − v − 3ℓ_b − e_λ)₊,

the term max(H, v + ℓ_b) is the rows-plus-columns factor (K + NB) of the quadratic sieve (5.28). A cubic kernel replaces it by

  max(H, v + ℓ_b, (2/3)(H + v + ℓ_b))   (Heath-Brown's (UV)^{2/3}).

In the first branch of the proof of (7/8, Lemma 15.1) take u = z_a and ℓ_b = e_λ = 0. The quadratic bound, maximised over the dual length v ≤ T_d, is O/2 + H + z_a − u. The cubic-kernel energy at dual length v exceeds it by

  max(H, (2/3)(H + v)) − H − ½(T_d − v).

This is increasing in v, so its maximum is at v = T_d, where it equals (2/3)(H + T_d) − H when positive.

Inputs from that proof:
* H = M′ = M − 2d;
* z_a ≤ ℓ′;
* the retained dual range T_d = 2H + 2z_a − 1 − ℓ′ ≤ 2M + ℓ − 1 − 5d, the completed length being N* = 1 + ℓ′.

The excess is largest at d = 0, where it equals M + 2ℓ/3 − 2/3. It enters the low exponent with weight ½:

  **P_c(M, ℓ) = ½·max(0, M + 2ℓ/3 − 2/3)**   [HEURISTIC; the second branch gives an excess of the same size to first order].

Exact values [EXACT]:
* At the paper's geometry (M, ℓ) = (5/6, 1/6): P_c = 5/36 and σ₀^{cubic} = 2/3 + 5/36 − 1/18 + 5/36 = **8/9**. This coincides with Framework A's Heath-Brown value.
* On the first-pass line M + ℓ = 1: σ₀ = 1 − 2ℓ/3.

### 5.4 Duality

The first pass's Theorem 5.1 holds for k = 3 and was re-run (§6.1). The column coefficient of A_m = Σ_s c(s)ω(s)g(χ_s², −m) is a Kummer character exactly when ξ³ = 1, which is the condition for the signal. The coherent frequencies e₀a³ then give P_a^{1/3}. So the low exponent is l_x/2 + b/6 + P_c + (L2 loss), and b cancels in σ₀ = 2/3 + M/6 − ℓ/3 + P_c + (L2 loss).

### 5.5 Exponent count [HEURISTIC]

This is the first pass's reconstruction of the 7/8 paper's constraint set (`tmp/beat78-amplifier-sensitivity.py`), with its k-dependent high-side changes: Lemma 17.6 slope 1 − 1/k, Lemma 18.1 capacity 2/(kκ), low loss b/(2k). The penalty P_c is added. SLSQP is run from 10 starts.

| scenario | σ₀ | (l_x, b, ℓ), M | binding |
|---|---|---|---|
| k = 6, paper (calibration) | 0.874957 | (0.3548, 0.1236, 0.1668), 0.833 | L1, H1 |
| k = 3, quadratic-quality low side (first pass; unavailable) | 0.742826 | (0.3275, 0.1640, 0.1810), 0.819 | L1, H1 |
| **k = 3, cubic kernel P_c** | **0.806636** | (0.3281, 0.0537, 0.1400), 0.710 | H1, H2 |
| k = 3, cubic kernel, penalty weight 1 (pessimistic) | 0.835750 | (0.2948, 0.0722, 0.1469), 0.662 | |
| k = 3, P_c with the dual range enlarged by 0.05 / 0.10 | 0.822 / 0.838 | | |
| k = 3, no prime slots (ℓ = 0) | 0.797 | (0.227, 0.242, 0), 0.696 | |
| k = 3, high-side constants left at their sextic values | 0.809–0.815 | | |
| k = 3, cubic kernel and hard cubic-L1 3M/2 + ℓ ≤ 1 | infeasible | | |

Reading [HEURISTIC]:
* With the cubic kernel the optimum leaves the old L1 line (M + ℓ = 0.85 < 1) to shrink the dual range, and pays in the high-side row counts H1/H2.
* The doubled amplifier density (signal h/3 instead of h/6) more than compensates for the cubic-sieve penalty in this model.
* What the model leaves out. The reconstruction is calibrated only near the paper's geometry. Constraints the paper imposes at its own point are not modelled:
  * the length bounds l_x − d ≥ 3/16 and l_y − d ≥ 5/16 of Prop. 15.3. At d = ℓ the k = 3 optimum has l_y − ℓ = 0.242 < 5/16, violating the second, while l_x − ℓ = 0.188 just meets the first;
  * the λ-adic gap of §5.1(c);
  * the slot-normaliser constants of §20.1 at k = 3.
* **0.807 should be read as "the cubic lever is not excluded by any exponent identity found here", not as an estimate of what a proof would give.**

### 5.6 Steps that would need proof (none is done)

1. R2 for the ᾱ-twisted, ray-class-twisted, sixth-power-completed 6-fold Kubota Eisenstein coefficient series over Q(ω). It is needed with explicit cusp data, Gamma factors and coefficient bounds, playing the role of (7/8, Prop. 5.1) and of Dunn–Radziwiłł §5.
2. The cubic-kernel versions of (7/8, Lemma 5.5, 14.2, 14.3, 15.1) with Heath-Brown's sieve, giving the corrected L1/L2.
3. The additive Gram bound (Prop. 15.2) for cubic Gauss sums, with exceptional frequencies e₀a³.
4. The λ-adic device of §5.1(c).
5. The high side at density 1/3: (7/8, §§7–10, 16–20), with the row counts in cubic characters (Lemma 9.1 covers D₂, D₄) and amplification over u·a³.
6. A rational endpoint certificate in the style of (7/8, Lemma 20.2) at the new geometry.

---

## 6. Duality and the PR #14 filter: one Kummer coset

### 6.1 Duality at k = 3 [PROVED-rel; first pass Theorem 5.1, re-run]

Kummer theory and reciprocity give, for any k and any K ⊇ μ_k:

  signal (pole of ζ(kz)) ⟺ ξ^k = 1 ⟺ the column coefficient is a Kummer character χ_•(e₀)^{−1} ⟺ the exceptional coset e₀a^k is non-empty.

Checks for k = 3 (log byte-identical on re-run):
* Cubic reciprocity holds on 7381 prime pairs.
* There are exactly 2 solutions ±e₀ for every cubic ξ in the toy probe.
* The coherent coefficient c(s₁)conj(c(s₂))F₃(s₁, s₂; e₀a³) is ≡ 1 on all 5105 coprime (pair, a) cases (deviation 9·10⁻¹⁶).
* A non-exceptional frequency gives a mean coefficient of modulus 0.024.
* In the toy Gram model the coherent excess grows with local slope 0.326 (cubic) against 0.188 (sextic).

E1 shows that the exceptional coefficient sums (Σ_s ω(s)γ₁(s) for k = 6, Σ_s ω(s)γ₂(s) for k = 3, no α) have genuine main terms (slopes +0.205 and +0.535). This agrees with `beat78-prop152-subtract.md` (the P_a^{1/6} term is a dual main term) and with the matching constants of Theorem 5.1(e).

### 6.2 The PR #14 filter at order k [EXACT, `tmp/zf-cubic-field-filter.py`]

PR #14 defines F(ξ) = (ξ + … + ξ⁵)/5 on sixth roots, f_p(n) = F(χ_p(n)), and A(n) = K^{−1}Σ_p f_p(n). The same construction at order k uses F_k(ξ) = (ξ + … + ξ^{k−1})/(k − 1).

| quantity | k = 6 (PR #14) | k = 3 | k = 2 |
|---|---|---|---|
| values | 1, −1/5 (×5) | 1, −1/2 (×2) | 1, −1 |
| mean square (optimal under F(1) = 1, zero mean) | 1/5 | 1/2 | 1 |
| Σ_{n mod p} f_p², Σ f_p | (p−1)/5, 0 | (p−1)/2, 0 | p−1, 0 |
| complete-period energy, 37 primes p ≡ 1 (6), p ≤ 400 | 0.005325611397 (= PR #14) | 0.013314028492 | 0.026628056985 |
| integer rows N = 200 000 | 0.005331929730 (= PR #14) | 0.013315629109 | — |
| eigenvalue-one set (simultaneous k-th power residues), fraction of Z/MZ | 9.19·10⁻³⁰ | 1.26·10⁻¹⁸ | — |

Further exact checks:
* Complete-period Gram orthogonality holds for k = 3 and 6.
* The ratio of the k = 3 to the k = 6 energy at N = 200 000 is 2.4973; the complete-period value is 5/2.
* The blind set at k = 3 is exactly 2³⁷ times the k = 6 one.
* On Z/MZ for the first three primes, |A(n)| = 1 exactly on the simultaneous k-th power residues (k = 3, 6).
* Among the integers n ≤ 10⁶, those blind for all 37 primes are exactly the k-th powers coprime to the set: 9 sixth powers and 63 cubes, with no other integers.

### 6.3 Identification

The following sets coincide, globally up to the finite group E of S-units modulo k-th powers (Kummer and Chebotarev, `beat78-prop152-restrict.md` Lemma K):
* PR #14's eigenvalue-one subspace;
* the amplifier rows u = m^k of Proposition 2.1;
* the high-side signal rows ua^k with u = 1;
* the exceptional frequencies e₀a^k of the additive Gram bound.

All four are the principal Kummer coset of k-th powers. Per prime the density is (p − 1)/k residues out of p − 1.

Changing k moves them together:
* the amplifier gains (density 1/k);
* the exceptional term grows in step (P_a^{1/k}), so b cancels for every k;
* the filter's blind set grows by the factor (6/k)^K.

The probe field changes none of this.

---

## 7. V7 floor and Xu–Sang as inputs

### 7.1 Dictionary p = 2θ − 1 (atlas §10) [EXACT arithmetic on the listed θ; the θ values themselves are as labelled]

| source | θ | p | status |
|---|---|---|---|
| 11/12 paper | 0.916667 | 0.833333 | unrefereed manuscript |
| 7/8 paper | 0.875 | 0.75 | unrefereed manuscript |
| Xu–Sang v2 + PR #14 certificate | 0.87488665 | 0.7497733 | conditional on imported analytic estimates |
| cubic Framework A, Heath-Brown (A-V) | 0.888889 | 0.777778 | HEURISTIC |
| cubic Framework A, Heath-Brown (A-CL) | 0.916667 | 0.833333 | HEURISTIC |
| cubic Framework A, optimal cubic sieve | 0.833333 | 0.666667 | HEURISTIC, needs a conjecture |
| cubic Framework B, cubic kernel (model) | 0.806636 | 0.613271 | HEURISTIC, unverified model |

**Λ context, hypothetical only.** `src/data/qrh-theta-and-improvement-2026-10-08.js` gives about 0.003 of conditional Λ per 0.01 of θ near 7/8; the local slope is 0.29–0.34 on 0.80–0.875. It also gives θ ≈ 0.815 ↔ Λ < 0.10 on the Raymond chain. None of these θ values is proved, so no Λ statement follows.

### 7.2 Why the V7 floor is not a lever here

The floor concerns the supported Weil form of ζ. A floor with exponent p is equivalent, through Landau's one-sided lemma (atlas, arithmetic-foundation module), to the zero-free half-plane Re s > (1+p)/2. The amplifier proves the latter for the whole family of Hecke L-functions over Q(ω) at once. Its Poisson rows introduce the twists, and inside the architecture a ζ-only version is no easier (beat78 R10, Proposition D).

So a cubic-twist mechanism cannot be inserted into ζ's Weil form. The floor is the same target expressed differently, and this lever would reach it only through a family zero-free region.

### 7.3 Xu–Sang

* **The line formula.** Their B = 11/12 − ℓ/4, at ℓ = 2506801/15000000 ≈ 0.16712 with κ = 29991/40000 bootstrapped from 69991/80000, lies on the k = 6 line. A cubic probe would use the same κ-bootstrap (Lemma 18.1's capacity uses the previous half-plane), with capacity 2/(3κ).
* **Their hypothesis (H).** It asks for Σ_{u∈𝓑}|S_m(u)|⁴|Q_sel(u)|² ≪ U^{39/40+ε} on detected classes. It is a joint detector/numerator correlation on the high side. Its abstract obstruction (TARGET_0874.md: U^R entries of size U^{(1−R)/4} saturate Hölder) is independent of the order of the twist. Nothing in the cubic setting helps with it.

---

## 8. Precise obstruction, and what would be needed

1. **Twist conversion (Proposition 3.1).**
   * The cubic family's Poisson dual is a class-x² object. The objects that carry it (6-fold Kubota Eisenstein coefficients) have a twist-preserving functional equation, R2.
   * The twist-changing reflection R1 exists only for the cubic theta, through Patterson's index–modulus identity. It turns the sextic twist into a quadratic one; it does not do this for cubic twists (Corollary 2.6).
   * So every cubic route reaches the cubic large sieve, whose cross term (MN)^{2/3} is the binding cost.
2. **Framework A** (HEURISTIC). The cost is λ = 7/6, giving θ = 8/9. Below 7/8 needs c < 8/13 for sieves with sextic-Gauss-sum coefficients, or c < 4/7 on the critical-line route.
3. **Framework B** (HEURISTIC).
   * The probe is formally constructible: the 6-fold Kubota Eisenstein series as T; (4.7) with γ₁ and γ₂ exchanged; ζ(3z) signal; R2 low side.
   * The cubic kernel adds P_c. The model count is ≈ 0.807.
   * The gap between this count and a theorem is the list in §5.6, and especially item 1: R2 with explicit cusp data for twisted nonspherical 6-fold Eisenstein series. That item is the analogue of the unconditional input the 7/8 paper imports from Dunn–Radziwiłł for the cubic theta.
4. **Duality.** For every order and field, the exceptional coset is the signal coset (§6.3). b cancels; the PR #14 filter cannot see past it; changing to cubic twists enlarges it.

**What would move the bound**, in order of how concrete the target is:
* (a) a cubic large sieve with cross exponent c < 8/13 for coefficient sequences of sextic Gauss sums (Framework A). This is a reduction of 2/39 ≈ 0.051 from Heath-Brown's 2/3, about 7.7 %;
* (b) items 1–2 of §5.6 followed by an honest re-run of the endgame with derived (not modelled) k = 3 constants;
* (c) a reflection for class-x² objects that changes the twist, which is equivalent to a usable 6-fold Patterson identity and is excluded by local theory [RECALLED].

---

## 9. Self-check

| claim | status | evidence |
|---|---|---|
| Prop. 2.1, amplifier exponent for order k | PROVED | elementary |
| Poisson dual of the cubic family; Lemma 2.2 | PROVED-rel | brute force 1e-15 (re-run) |
| Theorem 2.4, ledger cyclic of order 6; Cor. 2.5 | PROVED-rel (Hecke non-vanishing on Re s = 1) | complementarity and parity (re-run) |
| Cor. 2.6, cubic-theta reflection rule | PROVED-rel (7/8, Prop. 5.1) | — |
| R2, functional equation of twisted 6-fold Kubota series | RECALLED | E1–E3 consistent, not proofs |
| g₆(r, π^k) = 0 for π ∤ r, k ≥ 2 | PROVED | elementary |
| conductor ≍ N(h)² | HEURISTIC (twisting rule) | E3, weak |
| Proposition 3.1, every cubic route meets the cubic sieve | PROVED-rel modulo R2 | — |
| no theta main term in μγ₂ = αGγ̄₁ sums | NUMERICAL | E1 slope +0.044 ± 0.034 vs γ₁ +0.205, γ₂ +0.535 |
| Framework A: 8/9 (Heath-Brown), 5/6 (optimal), threshold 8/13 | HEURISTIC | closed forms + grid; calibration 11/12 |
| first-pass Framework-A model too pessimistic | EXACT within models | re-run gives first-pass values 1 and 0.87478 |
| cubic Framework-B probe formally constructible | PROVED-rel for the high-side identity; RECALLED for R2; λ-gap open | §5.1–5.2 |
| slot marks become cubic characters | PROVED-rel (Lemma 4.4, twisted multiplicativity) | `gauss` B |
| P_c and σ₀ ≈ 0.807 (range 0.797–0.838) | HEURISTIC | `model` B, `model-sens` |
| σ₀^{cubic}(5/6, 1/6) = 8/9 exactly | EXACT within the model | Fractions |
| duality at k = 3, b cancels | PROVED-rel; EXACT checks | `duality` (byte-identical re-run) |
| PR #14 filter at k = 3: energy ×5/2, blind set ×2^K, blind integers = k-th powers | EXACT | `filter` |
| V7 dictionary p = 2θ − 1 | EXACT arithmetic | atlas §10 |

No step proves a zero-free region. The 7/8 boundary, the PT Λ ≤ 0.2 bound and the recorded conditional Λ values are unchanged.

---

## 10. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/zf-cubic-field-gauss.py                       # ledger, Moebius absorption (8 s)
.venv-arb/bin/python tmp/zf-cubic-field-poisson.py                     # cubic Poisson dual (6 s)
.venv-arb/bin/python tmp/zf-cubic-field-duality.py --gram              # Kummer coherence k = 3, toy Gram (6 s)
.venv-arb/bin/python tmp/zf-cubic-field-filter.py                      # PR #14 filter at k = 2, 3, 6 (1 s)
.venv-arb/bin/python tmp/zf-cubic-field-model.py                       # Framework A/B exponent models (65 s)
.venv-arb/bin/python tmp/zf-cubic-field-model-sens.py                  # Framework B sensitivity (60 s)
.venv-arb/bin/python tmp/zf-cubic-field-eisenstein.py 100000 36 e1     # E1, 108 classes (35 s)
.venv-arb/bin/python tmp/zf-cubic-field-eisenstein.py 100000 12 e2p    # E2p, no classes (35 s)
.venv-arb/bin/python tmp/zf-cubic-field-eisenstein.py 100000 12 e3     # E3, collapse test (36 s)
```

Logs: `tmp/zf-cubic-field-{model,model-sens,filter,eisenstein,eisenstein-mod36,eisenstein-e2p,eisenstein-e3}.log`.
