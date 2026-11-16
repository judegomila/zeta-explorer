# Zero-free campaign, lever "a probe not built from residue characters" (revision 2: reads the route atlas)

Date: 2026-11-01. Branch `editorial-redesign`. Nothing committed, nothing pushed, nothing sent off the machine.

**Revision note.** The first version of this file was written at 13:09. The route-atlas audit (PR #27) reached this checkout at 13:39 (`refs/pr/27`), and its snapshots `/tmp/atlas-snap-*.md` were written at 13:40. The first version therefore does not use the audit. It is preserved unchanged at `tmp/zf-new-probe-preaudit-version.md`.

This revision does the following.
* **Reads the whole audit.** That means the route atlas (`atlas-snap-historical-routes.md`, §§1–12 and the closing ledger) and `atlas-snap-PUBLICATION_SCOPE_2026-10-30.md`. It also means the module notes: arithmetic foundation, spectral head, signed complement, whole-even certificate, spectral denominator repair, Suzuki recurrence, prime memory, finite Suzuki certificate. Finally it means the V7 source the atlas cites for the floor implication, `git show refs/pr/27:research/rh/foundation/source/03-landau.tex`.
* **Reads the PR #14 sources that atlas §10 cites:** `git show refs/pr/14:rigorous/mobius_bridge_reduction/{README.md,README.txt,SIGNED_PHASE_FILTER.md,TARGET_0874.md}`. The Xu–Sang paper itself (arXiv:2610.15291) is not available offline. Its content enters only through PR #14's description of it.
* **Maps every part of this attempt onto the atlas (§1.3).** No route that the atlas records as failed or open is re-attempted. Where a section overlaps an atlas route, it says what is different.
* **Adds new material.** That is §7 (PR #14's sixth-phase filter and the duality), §8 (the energy route, the V7 floor and the Xu–Sang import treated as levers) and Lemmas 2.8–2.9, with new scripts and logs.
* **Relabels the finite-model measurements of §5.3** under the atlas's surrogate rule (PUBLICATION_SCOPE, first boundary; atlas §9).

Sources:
* the 7/8 paper `~/lean-deps/qrh-verify/paper.txt` ("A Zero-Free Half-Plane Re s > 7/8", openai/math family 003);
* the 11/12 paper `~/lean-deps/qrh-verify/paper2.txt`.

Both are unrefereed and Lean-formalised by their authors. Equation and lemma numbers refer to the 7/8 paper unless stated otherwise.

Prior analysis used as input:
* `beat78-synthesis.md`, `beat78-amplifier.md` (Lemma A, Lemmas C1/C2), `beat78-prop152-restrict.md` (Theorems A–C, Lemma K, Prop D, Lemma R, Prop E′);
* data modules `src/data/beat-seven-eighths-2026-10-08.js` and `src/data/beat78-prop152-2026-10-09.js`;
* sibling campaign notes: `zf-campaign-high-side.md`, `zf-campaign-cubic-field.md` and `zf-campaign-quartic-gl2.md`, all in this directory.

Scripts and logs: `tmp/zf-new-probe-*` (§13).

Status labels:
* **[PROVED]**: a complete argument is given here.
* **[PROVED-rel]**: proved relative to lemmas of the 7/8 paper, or of the prior notes, used as stated.
* **[STANDARD]**: a classical result, cited, not re-derived.
* **[CITED]**: read in the audit or in PR #14 and used as stated there.
* **[EXACT]**: an exact finite identity or exact rational computation.
* **[NUMERICAL]**: a measurement in a finite model.
* **[HEURISTIC]**: exponent bookkeeping, an unproved model, or an inference not checked against a source.

---

## 0. Outcome

**Goal.** A zero-free half-plane Re s > θ′ with θ′ < 7/8, from a probe family not built from residue characters.

**Result.** **No θ′ < 7/8 is obtained, so there is no rigorous gain.** The lever is closed by the obstruction of §11.

The Λ bookkeeping is unchanged:
* PT Λ ≤ 0.2 stands.
* The conditional values from the 7/8 start (0.118506 Raymond chain, 0.116091 route P) remain conditional and are not bounds.
* RH is open. NO QED.

### 0.1 What the audit changes in the conclusion

1. **The duality has an independent confirmation.** Atlas §10 records that PR #14's principal-preserving sixth-phase filter "retains eigenvalue one" on the simultaneous local sixth-power residues.
   * Proposition P14 (§7) identifies the part of that set that survives every choice of primes: the global sixth powers. Their count in a norm ball of size P is ≍ P^{1/6}, the exponent of the exceptional term of Prop 15.2.
   * Measured with PR #14's own filter: with 12 or more of its primes, the eigenvalue-one set inside [1, 10⁷] consists of exactly the global sixth powers.
   * Theorem C of the prior note says the 7/8 low-side coefficients put a fixed fraction of their mean square on the corresponding coherent frequencies. So the power-saving criterion of PR #14 §5, transcribed to this probe, is false, not merely unproved.
2. **The other two audit levers restate the half-plane; they do not relax it.**
   * Proposition E1 (§8.1): the Möbius-energy target of atlas §10 is equivalent to the half-plane. The converse direction is proved here.
   * §8.2: V7's spectral floor implies the half-plane, and the half-plane is equivalent to the one-sided discrepancy bound.
   * Neither offers a probe an easier target.
3. **The Xu–Sang import leaves the low side unchanged.** PR #14's conditional boundary B = 0.87488665 is the same formula 11/12 − ℓ/4 as the 7/8 paper. Its gain comes from the high-side row ceiling κ, so the low side, where this lever acts, is untouched. The prize of this lever (remove the P_a^{1/6} term and keep the signal) is b/12 in the exponent model: 1/96 at the 7/8 geometry and 5769/800000 at PR #14's parameters.

### 0.2 New results in this revision

| id | statement | status |
|---|---|---|
| P14 | Any function of the sextic symbols at a finite set 𝒫 of good primes takes one value on each class {j·t⁶a⁶ : (ta, 𝒫) = 1}. On the coherent frequencies e₀t⁶a⁶ of Theorem B it is the single value A(e₀). That block has ≍ P^{1/6} members of norm ≤ P. | [PROVED] |
| P14c | Transcribed to the 7/8 low side, PR #14's criterion requires the coherent block to carry ≤ Z^{−δ} of the mean square. By Theorem C and Prop 15.2 it carries ≥ κZ^{−ε}. | [PROVED-rel] |
| P14d | For any realisation of the filter that multiplies both the coherent block and the high-side principal residue by A(e₀), the ratio signal²/coherent mass is unchanged. | [HEURISTIC]; consistent with Lemma R and Prop E′ |
| E1 | Take a pole-cancelling packet k ∈ C_c². If ζ ≠ 0 on Re s > (1+α)/2, then ∫_j^{j+1}\|S\|² ≪ e^{αj}. Conversely, that energy bound excludes every zero with Re ρ > (1+α)/2 at which K̃(ρ − ½) ≠ 0. Taken over all packets, the energy bound is equivalent to the half-plane. | [PROVED] |
| E2 | The archimedean family n^{−it}, \|t\| ≤ T, has copy weight J = O(1) + O(T^{3/2}D^{−1+ε}). Its family-blind mean square is the Montgomery–Vaughan theorem, so amplification over it gives the trivial bound. | [PROVED]; MV [STANDARD] |
| L2.8 | In a family of Hecke characters of F in the column variable, a member with a non-principal finite part or a nontrivial angle has mean ≪ 𝔠^{1/4+ε}D^{−1/2+ε}, where 𝔠 is its analytic conductor. Copies come only from members that are principal residue characters with trivial angle. | [PROVED]; convexity [STANDARD] |
| L2.9 | A row weight with \|w\| ≤ 1 never lowers the Cauchy–Schwarz low-side bound of Prop 15.3. A unimodular row twist leaves it exactly unchanged. | [PROVED] |
| F1 | A half-plane Re s > ½ + α is equivalent to D(W) ≪ e^{αW} + W. V7's floor with exponent p implies the half-plane at (1+p)/2. The converse for the floor is not established. | [PROVED] (classical explicit formula) + [CITED] |
| X | Exact bookkeeping of the Xu–Sang / PR #14 numbers and of this lever's prize. | [EXACT] |

### 0.3 Carried over from the first version

The proofs are unchanged; statements are tightened where noted. This covers:
* G1–G4: the amplifier ceiling, family-blind mean squares, additive kernels, Poisson-compatible multiplicative families;
* the candidate analyses of §3–§6;
* identities I1–I7;
* the copy-weight measurements;
* the Kloosterman toy model.

The two corrections made in the first version stay in force (§5).

### 0.4 Candidates

| candidate | amplification identity A_twist = A₁ + small? | copy weight J | μ-absorbing dual? | exponent | atlas overlap |
|---|---|---|---|---|---|
| angle Grössencharacters α^k, \|k\| ≤ K | no for k ≠ 0 [PROVED] | 1 + O(K^{2+ε}D^{−1+ε}) [PROVED] | no: Poisson in k gives a sector localisation | θ = 1 | §10 (archimedean analogue, §3.5) |
| archimedean twists N(n)^{−it}, \|t\| ≤ T | only near t = 0 (\|t\| ≲ 1) | O(1) [PROVED, E2] | no: the dual is the Dirichlet polynomial itself | θ = 1. With T ≍ 1 this is the Möbius-energy route, equivalent to the half-plane (E1) | §10 |
| additive e(nα), α ∈ C/O | only α ≡ 0 | exactly 1/\|N\| [PROVED] | trivially (diagonal only) | θ = 1, exactly trivial | none |
| Farey family x/s, q_s ≤ Q | row s carries A₁ with weight μ(s)/φ(s) [EXACT] | ≲ 1 + Q²/D [PROVED-rel] | no | θ = 1 | none |
| Kloosterman family μ(n)S(m,1;n) | only m = 0 | baseline | non-isometric (μ = c_n(1)) [PROVED] | θ = 1 | none |
| Kloosterman phase inside the 7/8 additive polynomial | high side: the w = 1 residue is lost [PROVED-rel] | low side: mass not removed in the finite model [NUMERICAL] | — | σ₀ ≥ 65/48 [HEURISTIC] | §9 surrogate rule applied |
| angle twist of the 7/8 row weight | the z = 1/6 residue is lost [PROVED-rel] | low side unchanged (L2.9) [PROVED] | — | σ₀ ≥ 97/96 [HEURISTIC] | none |
| spectral (Kuznetsov), level q, \|t\| ≤ T | no member equals A₁; Eisenstein members see ζ zeros at height ±t [PROVED] | O(1) [STANDARD] | no | θ = 1 | none (name collision only, §1.4) |
| PR #14 sixth-phase filter (built from residue characters; for comparison) | principal phase preserved | eigenvalue one on the global sixth powers [PROVED, P14] | — | no gain [PROVED-rel, P14c] | §10 |

---

## 1. Setting

### 1.1 The target and the two architectures

Fix a finite-order Hecke character ν of F = Q(√−3) and put

  A₁(D) = Σ_n μ(n)ν(n)W(N n/D),

with ideals coprime to 6 and the conductor. If A₁(D) ≪ D^{θ+ε} holds uniformly, every finite-order Hecke L-function over F is zero-free in Re s > θ, and so is ζ (11/12 paper, §3).

**Framework A (11/12 paper).**
* Rows u ∈ O with 0 < N(u) ≤ H, and A_u = Σ_n μ(n)ν(n)χ_n(u)W, where χ_n(u) = (u/n)₆.
* Prop 3.1 gives Σ_u \|A_u\|² ≪ D^{1+ε}H at H = D^{1+ϑ}.
* The rows u = p⁶ are copies: A_{p⁶} = A₁ + O(D/Y) (2.4).
* Hence \|A₁\|² ≪ D^{1+ε}H^{5/6}, giving θ = 11/12.

**Framework B (7/8 paper).**
* The probe is I_η = Σ_m A_m B_m (6.2).
  * A_m is the additive factor. It is a sum over columns s of the Gauss sums g_{χ_s}(s, −m), with coefficients c_σ(s) = 1_{s∈σ}χ_s(b∗)/(τξ(s)).
  * B_m is the completed row built from the cubic theta coefficients γ₂(c) and the target character η.
* Low side: the bound is ‖A‖·‖B‖. Prop 15.2 bounds ‖A‖ and Lemma 15.1 bounds ‖B‖.
* High side: Poisson in m. The frequencies are H = u·a⁶. The principal row u = 1 carries 1/L^S(x, η) and has residues at w = 1 (the s-series) and at z = 1/6 (the a-series ζ_F(6z)), see (7.13).
* The abscissa is σ₀ = 1 − h/6 + b/12 = 7/8.

In both frameworks the gain comes from copies:
* in Framework A, the rows u = a⁶;
* in Framework B, the dual frequencies H = a⁶.

The prior duality (`beat78-prop152-restrict.md`, Theorem B, Prop D, Prop E′) says that the low-side exceptional term of Prop 15.2 has the same sixth-power structure. It exists exactly when ξ⁶ = 1, which is also the condition for the high-side z-pole.

### 1.2 What the lever asks

Find a family {A_f} of twisted Möbius sums with
* (C1) many copies of A₁, meaning A_f = A₁ + small for many f;
* (C2) a provable square-root mean square Σ_f \|A_f\|² ≪ D^{1+ε}·#F;
* (C3) no residue characters.

For each proposed class, decide whether (C1) holds and what exponent results.

### 1.3 What the route atlas records, and how this attempt differs

The atlas's closing line names the open task as "a genuine all-scale signed arithmetic estimate, a cofinal actual-form floor, or an exhaustive theta boundary/collision certificate".

An amplified probe is a device for producing the first of these: a signed bound \|A₁(D)\| ≪ D^θ at every scale D. At θ = 7/8 the 7/8 paper supplies one; that paper is unrefereed, and atlas §10 explicitly does not certify it. This lever asks for one below 7/8.

| part of this attempt | atlas section or module | what the atlas records | overlap | what is different here |
|---|---|---|---|---|
| duality obstruction: Theorem B/C, Prop D, Prop E′ of the prior note, and §7 here | §10; PR #14 `SIGNED_PHASE_FILTER.md` §5 | "the simultaneous local sixth-power residue subspace retains eigenvalue one. Small mean energy is not a worst-case contraction." | the same phenomenon, reached through a different construction | PR #14's filter is not re-run as a route. §7 identifies the part of the eigenvalue-one set that survives every choice of primes (global sixth powers, ≍ P^{1/6} = the exceptional exponent; measured exactly for K ≥ 12, N ≤ 10⁷). It also shows by Theorem C that the 7/8 coefficients put a fixed fraction of their mass there, so PR #14 §5's overlap criterion fails for this probe. |
| angle and archimedean twist families (§3, §3.5) | §10, "Möbius energy" (PR #14 direct bridge) | the energy target ∫_j^{j+1}\|S\|² ≤ Ce^{0.7496 j} is unproved; the "small-common-divisor, large-separation signed correlations remain open" | the energy is the mean square of the archimedean family, which has no copies | The energy bound itself is not re-attempted. E2 shows the family has J = O(1), so no amplification is available. E1 proves the converse direction, so the energy target is equivalent to the half-plane, not a relaxation of it. |
| the baseline 7/8 and its conditional refinement | §10, PR #14 B = 17497733/20000000 (conditional on Xu–Sang v2) | conditional; B ≤ 0.8748 is infeasible in that admissibility system; B = 0.874 needs the unproved restricted fourth moment (H) | same architecture (B = 11/12 − ℓ/4) | §8.3: the import does not touch the low side. (H) is a high-side row-count estimate and lies outside this lever. |
| V7 discrepancy floor | §10, last paragraph; V7 `03-landau.tex` | ε₀(λ) ≥ −C(1+log λ)^m λ^p, p < 1, implies no zeros in Re s > (1+p)/2 | the floor is a lower bound over all test functions; a probe produces upper bounds for signed sums | §8.2: half-plane ⟺ one-sided D-bound ⟺ energy bound, and floor ⇒ half-plane. So the floor is no easier a target for a probe. |
| finite-model measurements (§5.3) | §9; PUBLICATION_SCOPE, first boundary | "a negative lower surrogate does not imply a negative actual form" | measurements of a Gram form in a finite model | Relabelled: they test identities (I1–I7, Theorem B/C) in a model. They are not bounds, upper or lower, for the paper's probe. |
| positivity of the Kuznetsov spectral side (Prop 6.3) | §11 | "a uniform strictly positive scalar margin is not the right RH target" | uses a positivity | Used only to bound one family member from above. No positive margin is targeted. |
| one-sided bounds | arithmetic-foundation module §2 | one-sided D-bounds suffice (Landau mechanism) | — | §8.2: amplification is two-sided by construction, since it works with squares. A one-sided route needs nonnegative coefficients (Λ) and then meets the sieve's parity loss [HEURISTIC]. |
| archimedean Dirichlet polynomials Σ n^{−1/2+it} | signed-complement module §1 | used as Weil test packets to refute the strong 4M clipping hypothesis | same polynomials | There they are test vectors, used for upper bounds on the form. Here they form an amplification family; E2 shows it carries no copies. |
| Suzuki scalar reserve, prime memory, finite Suzuki certificate; twin ladder, information, synchronization, vortices, theta certificates, discrete curvature, twistor/Hankel (§2–§8, §11) | — | — | none | not used |

### 1.4 Name collisions with the atlas

* **"theta".** Here this is the cubic or sextic Kubota–Patterson theta function on the metaplectic cover of GL(2) over Q(√−3). In atlas §5–§6 and the closing line, "theta" refers to Riemann's kernel Φ and the heat-deformed H_τ. They are unrelated.
* **"spectral".** Here this means automorphic spectral families (Kuznetsov, §6). The spectral-head and spectral-repair modules concern the prolate and fixed-support Weil operator. They are unrelated.
* **"B".** In the atlas this is the proposed boundary for Re ρ (PR #14's B). Here B_m is the completed row of (6.2). Where needed, the boundary is written B_{PR14}.
* **"rows".** Low-side rows are m in (6.2). High-side rows are u in H = u·a⁶. The "Eisenstein rows" of PR #14 are rows u ∈ Z[ω] on the high side.

---

## 2. General results

Notation: N is the finite column set, i.e. the support of the coefficients a_n = μ(n)ν(n)W(N n/D), with \|N\| ≍ D. Write A_u = Σ_n a_n f_u(n), the mean m_u := \|N\|⁻¹ Σ_{n∈N} f_u(n), and M₂ := Σ_u \|A_u\|².

**Lemma 2.1 (amplifier ceiling) [PROVED].** Let c ∈ C^U and C > 0 satisfy Σ_u c_u f_u(n) = C + e(n) on N, with (Σ_{n∈N} \|e(n)\|²)^{1/2} ≤ εC\|N\|^{1/2} for some 0 ≤ ε < 1. Then

  C/‖c‖₂ ≤ (1 − ε)⁻¹ J^{1/2},  J := Σ_u \|m_u\|².

The amplification inequality C\|A₁\| ≤ ‖c‖₂M₂^{1/2} + ‖a‖₂·εC\|N\|^{1/2} therefore never gives better than \|A₁\| ≤ (1 − ε)(M₂/J)^{1/2} + ε‖a‖₂\|N\|^{1/2}.

*Proof.*
* Average the identity over N: Σ_u c_u m_u = C + \|N\|⁻¹Σ e(n).
* The error term has absolute value at most \|N\|^{-1/2}‖e‖₂ ≤ εC, so \|Σ_u c_u m_u\| ≥ (1 − ε)C.
* By Cauchy–Schwarz, \|Σ_u c_u m_u\| ≤ ‖c‖₂J^{1/2}. ∎

J counts copies with weight \|mean\|². An exact copy (f_u ≡ 1 on N) contributes 1; a twist with mean zero contributes nothing. Lemma A of `beat78-amplifier.md` (the p⁶ amplifier is optimal) is the case where the copies are the sixth powers. Continuous families (u in a measure space) work verbatim with Σ_u replaced by an integral and c ∈ L².

*Weighted form.* The same proof works with a nonnegative column weight ω, for example ω_n = μ²(n)W(Nn/D):
* replace the counting measure by ω;
* replace m_u by m_u^ω := Σ_n ω_n f_u(n)/Σ_n ω_n;
* replace the error condition by ‖e‖_{ℓ²(supp ω)} ≤ εC‖ω‖₁/‖ω‖₂.

For ω ≤ ‖W‖_∞ the ratio ‖ω‖₁/‖ω‖₂ is ≍ \|N\|^{1/2}. All mean computations below use this weighted form, because smooth means are what the Mellin transform controls.

**Corollary 2.2 (family-blind mean squares give nothing) [PROVED].** Let Δ be a large-sieve constant for the family on N, i.e. Σ_u \|Σ_n b_n f_u(n)\|² ≤ Δ‖b‖² for all b.
* Then J = \|N\|⁻²Σ_u \|Σ_{n∈N} f_u(n)\|² ≤ Δ/\|N\|.
* If the only available bound on M₂ is M₂ ≤ Δ‖a‖², the best amplified bound is ≥ (1 − ε)(Δ‖a‖²·\|N\|/Δ)^{1/2} = (1 − ε)‖a‖₂\|N\|^{1/2}.

That is the Cauchy–Schwarz trivial bound for \|Σ a_n\|. Any gain must therefore come from a μ-specific mean-square bound that beats the large sieve, and the gain in \|A₁\|² is at most the factor by which it beats it. ∎

So amplification needs two things:
* **(R1) excess:** J ≫ 1 + #F/\|N\|, i.e. more copy weight than the random baseline;
* **(R2) a μ-specific mean square** that beats the family-blind large sieve.

In the 11/12 paper:
* (R1) is the H^{1/6} sixth powers.
* (R2) is Poisson in u, followed by the Gauss–Jacobi absorption μγ₋₁ = χ_n(−1)G⁻¹αγ₂ (11/12 paper, §2.3), the cubic theta reflection, and the quadratic large sieve applied to μ-free coefficients.

The sibling note `zf-campaign-cubic-field.md` (Theorem 3.3, Gauss-class ledger) shows that modulo Hecke characters times periodic functions, μ and the normalised Gauss sums generate a cyclic group of order 6. In that group only the sextic twist lands in the class of the cubic theta coefficients.

**Lemma 2.3 (additive kernels) [PROVED].**

*Setting.*
* Λ ⊂ R^d is a lattice and B ⊂ R^d a convex body symmetric about 0; put U = B∩Λ.
* φ: Λ → G is a group homomorphism, and f_u := φ(u).
* For g ∈ φ(U) let m(g) := #(U ∩ φ⁻¹(g)), and let e be the identity of G.

*Claim.* m(e)·#φ(U) ≤ #(2B∩Λ). Hence the multiplicity excess E_mult := m(e)#φ(U)/#U is at most #(2B∩Λ)/#(B∩Λ).

*Proof.*
* For each g ∈ φ(U) choose x_g ∈ U with φ(x_g) = g.
* The sets x_g + (ker φ ∩ U) lie in distinct cosets of ker φ, so they are disjoint.
* Each has m(e) elements and lies in (B + B)∩Λ = 2B∩Λ. ∎

For discs in O the ratio is 3.9755, 3.9876 and 3.9964 at radii² 10², 10³ and 10⁴ (`tmp/zf-new-probe-exponents.py`, X2), tending to 4.

*Consequence.* Suppose the distinct twists have small means, \|mean g\| ≤ η for g ≠ e. Then J ≤ m(e) + η²#U. A perfect mean square M₂ ≈ #U·‖a‖² gives \|A₁\|² ≲ (#φ(U)/E_mult)‖a‖². That is at most a factor 4 better than a square-root mean square over the distinct twists alone. Additive homomorphisms produce no amplification.

**Lemma 2.4 (Poisson-compatible multiplicative families are residue-character families) [PROVED].** For each column ideal n, let u ↦ f_u(n) satisfy:
* (P) there is an ideal 𝔪_n such that f_u(n) depends only on u mod 𝔪_n (the periodicity Poisson in u needs, for any period ideal; 𝔪_n = n in the 11/12 paper);
* (M) f_{uv}(n) = f_u(n)f_v(n);
* (U) \|f_u(n)\| = 1 for (u, 𝔪_n) = 1.

Then u ↦ f_u(n), restricted to (O/𝔪_n)^×, is a character of that finite group, i.e. a residue character modulo 𝔪_n.

*Proof.* (P) and (M) give a monoid homomorphism (O/𝔪_n, ·) → C. By (U) its restriction to the units is a homomorphism to S¹. ∎

**Proposition 2.5 (copies of bounded-order residue-character families) [PROVED].** Suppose the characters in Lemma 2.4 have order dividing k for every n ∈ N.
* Then f_{v^k}(n) = f_v(n)^k = 1 whenever (v, 𝔪_n) = 1.
* For a prime p with N(p) ≥ P₁ (a fixed constant), m_{p^k} = #{n ∈ N : p ∤ 𝔪_n}/\|N\| ≥ 1 − c/N(p) ≥ 1/2.
* Hence J ≥ (1/4)#{p prime : P₁ ≤ N(p) ≤ H^{1/k}} ≫ H^{1/k}/log H. Counting all k-th powers, the copy count is ≍ H^{1/k}.

At the natural range H ≍ \|N\|, the random baseline is 1 + H/\|N\| ≍ 1, so the excess is ≫ H^{1/k}/log H. For the sextic family these are the Y/log Y prime rows p⁶ of the 11/12 paper, (2.4)–(2.5). ∎

Measured at D = 3000 (n_eff = 313; `tmp/zf-new-probe-copycount-D3000.log`) [NUMERICAL]:

| H | rows | J | sixth-power rows and their J | rest of J | random baseline rows/n_eff |
|---|---|---|---|---|---|
| 1000 | 3642 | 12.18 | 2 rows, 2.000 | 10.18 | 11.62 |
| 30000 | 108786 | 327.6 | 3 rows, 3.000 | 324.6 | 347.0 |

* Each sixth-power row has mean exactly 1, since every column is coprime to it.
* The other rows sit at or below the random baseline; the five largest \|m_u\|² sum to 0.17.
* At these sizes the copy count is small next to the baseline H/n_eff. The excess H^{1/6} is a lattice count at the natural range, not a measured effect.

**Lemma 2.8 (column-multiplicative Hecke families) [PROVED; convexity bound STANDARD].** Let f be a unitary Hecke character of F (h_F = 1). On primary generators n of ideals coprime to 3𝔣_f,

  f(n) = ψ(n)·(n/\|n\|)^k·N(n)^{it}, with ψ a character of (O/𝔣′)^×, 𝔣′ = lcm(𝔣_f, (3)), and (k, t) ∈ Z × R.

Write 𝔠(f) := N(𝔣_f)(1 + \|k\| + \|t\|)² for the analytic conductor. With ω_n = μ²(n)W(Nn/D), the support coprime to 6𝔣_ν, W ∈ C_c^∞(0, ∞) nonnegative and nonzero, and W̃(s) = ∫W(x)x^{s−1}dx:

(i) if ψ is nonprincipal or k ≠ 0, then \|m^ω(f)\| ≪_{ε,W} 𝔠(f)^{1/4+ε}D^{−1/2+ε};

(ii) if ψ is principal and k = 0, then \|m^ω(f)\| ≤ C_F·\|W̃(1 + it)\|/W̃(1) + O(D^{−1/2+ε}(1 + \|t\|)^{1/2+ε}). Here C_F bounds the ratio of the Euler-factor corrections at 1 + it and at 1, and W̃(1 + it) decays faster than any power of \|t\|.

Consequently, for any family {f_u} of Hecke characters,

  J^ω = Σ_u \|m^ω(f_u)\|² ≤ 2C_F² Σ_{u : ψ_u principal, k_u = 0} \|W̃(1 + it_u)/W̃(1)\|² + O(Σ_u 𝔠(f_u)^{1/2+ε}D^{−1+ε}).

The copy weight comes only from members that are principal residue characters with trivial angle and \|t_u\| ≲ 1. A member "not built from residue characters" in the sense of the lever, i.e. with nontrivial infinity type, is never a copy. Its mean is bounded by its conductor.

*Proof.*
1. For squarefree n coprime to 6𝔣_ν, Σ_n μ²(n)f(n)N(n)^{−s} = L(s, f)/L(2s, f²) × (finitely many Euler factors at 2, 3 and 𝔣_ν). Primes dividing 𝔣_f drop out automatically, because ψ vanishes there.
2. Mellin inversion gives Σ_n ω_n f(n) = (2πi)⁻¹∫_{(2)} L(s,f)L(2s,f²)⁻¹·E(s)·W̃(s)D^s ds.
3. Shift the contour to Re s = 1/2 + ε.
   * In case (i), L(s, f) is entire [STANDARD, Hecke].
   * On the new line, \|L(2s, f²)⁻¹\| ≤ ζ_F(1+2ε)/ζ_F(2+4ε).
   * Phragmén–Lindelöf convexity gives L(1/2 + ε + iτ, f) ≪ (N(𝔣_f)(1 + \|k\| + \|t + τ\|)²)^{1/4+ε} [STANDARD].
   * W̃ decays rapidly in τ, so the τ-integral is ≪ 𝔠(f)^{1/4+ε}.
   * Divide by Σ ω_n ≍ D.
4. In case (ii), L(s, f) = ζ_F(s − it) up to finitely many Euler factors, since f(n) = N(n)^{it}.
   * The pole at s = 1 + it gives the main term D^{1+it}W̃(1 + it)·E(1 + it), where E(s) collects 1/ζ_F(2s − 2it) and the local factors. E is bounded above and below on Re s = 1.
   * Dividing by Σ ω_n = D·W̃(1)·E(1)·(1 + O(D^{−1/2+ε})) gives the main term of (ii).
   * The shifted integral is bounded as in step 3.
5. Summing \|m^ω\|² over the family, using \|x + y\|² ≤ 2\|x\|² + 2\|y\|², gives the bound for J^ω. ∎

Lemma 2.8 replaces the heuristic "local-limit" remark of the first version for torsion-free (Grössencharacter-exponent) parametrisations. Proposition 3.2 is the case f_u = α^{k_u}, and E2 (§3.5) is the case f_u = N^{it_u}.

**Lemma 2.9 (row twists are invisible to the low side) [PROVED].** In the separation (6.2), multiply the row weight Ω(q_m/Q)ξ(m)(q_m/Q)^{−iν} by a function w(m) with \|w(m)\| ≤ 1. Then:
* the Cauchy–Schwarz step of Prop 15.3 bounds the modified separation by the same quantity (Σ_m \|A_m\|²)^{1/2}(Σ_m \|B_m\|²)^{1/2} as before;
* the A-norm, which carries the P_a^{1/6} term, does not involve w.

If \|w\| ≡ 1, the bound is literally the same. This covers Hecke characters of m of any infinity type, additive characters e(mα), and Kloosterman-type phases in m. Theorem C of the prior note shows that the A-norm bound is attained for smooth radial row weights. So a row twist can lower σ₀ only through the high side.

*Proof.* \|Σ_m wΩξ(·)^{−iν}A_mB_m\| ≤ (Σ_m \|A_m\|²)^{1/2}(Σ_m \|w\|²\|B_m\|²)^{1/2} ≤ (Σ\|A_m\|²)^{1/2}(Σ\|B_m\|²)^{1/2}, with equality of the last factors when \|w\| ≡ 1. ∎

On the high side, a nontrivial unimodular twist moves or removes the principal Poisson residue:
* the angle twist (Prop 3.4): the z-pole is lost [PROVED-rel];
* additive twists e(mα) with α ∉ O^∨ = O: they shift every dual frequency, so the a-sum no longer runs over exact sixth powers and ζ_F(6z) is lost [HEURISTIC].

**Theorem 2.6 (where excess comes from).** For families indexed by the norm ball U_H = {u ∈ O : 0 < N(u) ≤ H}:
* an additive structure gives excess ≤ 4 + o(1) (Lemma 2.3) [PROVED];
* a Poisson-compatible multiplicative structure in the row variable is a residue-character family, with excess ≫ H^{1/k}/log H when the orders are bounded by k (Lemma 2.4, Prop 2.5) [PROVED];
* a Hecke structure in the column variable has its copies exactly at the members that are principal residue characters with trivial angle (Lemma 2.8) [PROVED].

Families with none of these structures have no structural source of copies. For the candidates below, J is computed directly.

The multiplicative case can carry excess because the row ball is an additive ball but a very poor multiplicative one: B·B = {N ≤ H²} has H times as many points. So the doubling argument of Lemma 2.3 gives no constraint there.

**Remark 2.7 (the excess belongs to the parametrisation).** Consider the sextic Kummer map u ↦ χ_•(u) = (u/·)₆.
* Its fibres are u₀·(K^×)⁶ ∩ U_H, with multiplicity ≍ (H/N(u₀))^{1/6}. This decreases with the conductor, so the trivial character has the largest fibre.
* A "Hecke family" listing every sextic character once has excess 1.
* The copies are therefore not a property of the set of twisted L-functions. They come from the Poisson-compatible parametrisation by u ∈ O, which is also what makes the mean square provable (Poisson in u).
* A family "not built from residue characters" has no parametrisation of this kind. By Lemma 2.8 its members of nontrivial infinity type are never copies.

---

## 3. Candidate 1: Hecke Grössencharacters of angle type

For primary n, put α(n) = n/\|n\|. Since the six units represent (O/3)^×, every ideal coprime to 3 has a unique primary generator. So for every k ∈ Z, α^k is a Hecke Grössencharacter of infinity type k with conductor dividing 9 [STANDARD]. Its L-function L(s, α^k) is entire for k ≠ 0 [STANDARD, Hecke]. The family is A_k = Σ_n μ(n)ν(n)α(n)^k W(N n/D) for \|k\| ≤ K.

**Proposition 3.1 (no amplification identity) [PROVED].** Let k ≠ 0.
* α(n)^k = 1 forces arg n ∈ (2π/k)Z, i.e. n lies on one of \|k\| rays through 0.
* A ray meets {\|n\| ≤ √D} in a one-dimensional sublattice segment with at most 2√D + 1 points.
* So α^k ≡ 1 holds on at most \|k\|(2√D + 1) columns, and A_k − A₁ = Σ μνW(α^k − 1) is a twisted Möbius sum over all the remaining columns, not an O(D/Y) error.
* Further, A_k is the smoothed coefficient sum of 1/L(s, να^k), a different L-function, so it does not detect the zeros of L(s, ν).

The angle family has one copy, k = 0.

**Proposition 3.2 (copy weight) [PROVED].** This is the case f_k = α^k of Lemma 2.8, with 𝔠 ≍ (1 + \|k\|)²:
* \|m_k\| ≪_ε (\|k\| + 1)^{1/2+ε}D^{-1/2+ε};
* J = 1 + O(K^{2+ε}D^{-1+ε});
* in particular J = 1 + o(1) for K ≤ D^{1/2−ε}.

For larger K the dual large sieve (Cor 2.2), combined with angular pair-correlation counting, gives J ≈ 1 + K/D up to logarithms; the ray contributions total O(D log D) pairs. [HEURISTIC in that range; measured below]

Measured at D = 3000 (`tmp/zf-new-probe-copycount-D3000.log`): 426 columns, effective size n_eff = 313.

| K | 10 | 30 | 100 | 300 | 1000 | 3000 |
|---|---|---|---|---|---|---|
| J | 1.004 | 1.015 | 1.193 | 2.623 | 7.062 | 18.938 |
| (2K+1)/n_eff (random baseline) | 0.067 | 0.195 | 0.641 | 1.917 | 6.383 | 19.142 |
| max_{k≠0} \|m_k\|² | 5.3e-4 | 1.1e-3 | 1.1e-2 | 3.0e-2 | 3.0e-2 | 4.7e-2 |

J minus the random baseline stays about 1, so the only copy is k = 0. No near-copies are hidden: max \|m_k\|² ≤ 0.047.

**Proposition 3.3 (the dual keeps μ) [PROVED].** Take a smooth weight Φ in k. Poisson in k gives

  Σ_k Φ(k/K)α(n)^k \overline{α(n′)}^k = K Σ_{j∈Z} Φ̂(K(θ_n − θ_{n′})/2π + Kj),

a bump kernel on \|θ_n − θ_{n′}\| ≲ 1/K. The mean square becomes the angular pair correlation of μ(n)ν(n), whose diagonal blocks are squares of sector-restricted Möbius sums. No Gauss sum appears, so μ is not absorbed. The family-blind (angular large sieve) range is K ≳ D, where Cor 2.2 gives only the trivial bound.

**Proposition 3.4 (angle twist inside the 7/8 probe) [PROVED-rel].** Multiply the row weight W₀ in (6.1) by (m/\|m\|)^k with k ≠ 0.
* *Low side.* By Lemma 2.9 the low-side bound is unchanged, exceptional term included.
* *High side.*
  * With the paper's pairing e(xy) = exp(4πi Im(xy)/√3), the planar Fourier transform of W₀(\|y\|²)(y/\|y\|)^k is (ξ/\|ξ\|)^{−k} times an order-\|k\| Hankel (Bessel J_k) transform of the radial profile.
  * The frequency H = u·a⁶ (a primary) carries (u/\|u\|)^{−k}(a/\|a\|)^{−6k}.
  * The a-series of (7.13) becomes L_F^S(6z, λ^{−6k}) with λ^{−6k}(a) = (a/\|a\|)^{−6k}. This is well defined on ideals because the units satisfy ε⁶ = 1, and it is entire for k ≠ 0.
  * So the z = 1/6 residue, which is the copy amplification, disappears.
  * By Prop E of `beat78-prop152-restrict.md`, §9, the continuation criterion then needs σ₀ ≥ 1 + b/12 = 97/96 at the paper geometry.

An angle twist removes the signal and keeps the exceptional term.

### 3.5 The archimedean family is the Möbius-energy route of atlas §10

Over F the angle family above has an archimedean companion, f_t(n) = N(n)^{−it}. Over Q the companion is n^{−it}. Atlas §10's direct Möbius bridge is a mean square over exactly this family.

Take S(u) = Σ Λ(n)n^{−1/2}k(log n − u). Its Fourier transform in u is K̃(it)·Σ_n Λ(n)n^{−1/2−it}, formally. Localising u to [j, j+1] localises n to e^{j ± (R+1)}. So, up to that localisation, Plancherel writes the block energy ∫_j^{j+1}\|S(u)\|²du as a mean square over t of the localised Dirichlet polynomial against the weight \|K̃(it)\|². [HEURISTIC description; Proposition E1 is the rigorous statement.]

Because K̃ decays rapidly, the effective family is \|t\| ≲ 1. The Möbius form of S is S(L) = Σ_d μ(d)d^{−1/2}F(L − log d), whose pair expansion is PR #14's "pair sum".

**Proposition E2 (no copies in the archimedean family) [PROVED; Montgomery–Vaughan STANDARD].** Take columns n with weight ω_n = μ²(n)W(n/D) and the family f_t(n) = n^{−it}, t ∈ [−T, T], with Lebesgue measure. The statement is over Q; over F the same argument gives (a) with T² in place of T^{3/2}.

(a) The copy weight is J_T := ∫_{−T}^{T}\|m_t^ω\|²dt = O_W(1) + O(T^{3/2}D^{−1+ε}).

(b) The family-blind mean square is the Montgomery–Vaughan mean value theorem:
  ∫_{−T}^{T}\|Σ_n b_n n^{−it}\|²dt = Σ_n \|b_n\|²(2T + O(n)) ≤ (2T + O(D))‖b‖².

(c) By Cor 2.2 in its continuous form, amplification over this family with (b) as its only mean-square input gives no better than the trivial bound \|A₁\| ≲ ‖a‖₂D^{1/2}. Any gain needs a μ-specific (or Λ-specific) mean value bound for Σ μ(n)ω_n n^{−it} over \|t\| ≤ T. When T ≍ 1, as in the energy route, that is a pointwise bound.

*Proof.*
* (a) This is the Q-analogue of Lemma 2.8(ii). Here Σ μ²(n)n^{−s} = ζ(s)/ζ(2s), and the pole of ζ(s + it) is at s = 1 − it. So \|m_t^ω\| ≤ C·\|W̃(1 − it)\|/W̃(1) + O(D^{−1/2+ε}(1 + \|t\|)^{1/4+ε}), where C bounds ζ(2)/\|ζ(2 − 2it)\| and the convexity exponent of ζ on Re s = 1/2 + ε is 1/4. Integrate \|·\|² over \|t\| ≤ T: the main term gives ≤ 2C²∫\|W̃(1 − it)/W̃(1)\|²dt = O_W(1), and the error gives O(T^{3/2+ε}D^{−1+2ε}).
* (b) [STANDARD].
* (c) As in Cor 2.2. ∎

**What this adds to atlas §10.**
* The direct Möbius bridge is the J = 1 case of the copy framework: no member besides t ≈ 0 reproduces the target. So the target mean square must be bounded directly.
* Proposition E1 (§8.1) shows that bounding it at exponent α is equivalent to the half-plane at (1+α)/2.
* So the open "small-common-divisor, large-separation signed correlations" carry the entire difficulty of the half-plane. No amplification over this family can supply them.

**Exponent.**
* In Framework A, J ≈ 1 + K/D gives θ = 1 (Cor 2.2 at the family-blind range K ≳ D).
* In Framework B, used as a twist, the angle family gives σ₀ ≥ 97/96.
* The archimedean family gives θ = 1 by E2.

**No zero-free half-plane.**

---

## 4. Candidate 2a: additive twists and Kloosterman families

**Proposition 4.1 (continuous additive family: exactly trivial) [PROVED].** Take the family f_α(n) = e(nα), α ∈ C/O, with Haar probability measure.
* O is self-dual for e(z) = exp(4πi Im z/√3) (§4 of the 7/8 paper), so the characters n ↦ e(nα) are orthonormal.
* Hence M₂ = ∫\|A_α\|²dα = Σ_n \|a_n\|² and J = ∫\|m_α\|²dα = \|N\|⁻²·\|N\| = \|N\|⁻¹.
* Lemma 2.1 gives \|A₁\|² ≤ M₂/J = \|N\|·Σ\|a_n\|², exactly the Cauchy–Schwarz bound.

**Proposition 4.2 (Farey family) [EXACT + PROVED-rel].** Take rows x/s with s primary, q_s ≤ Q and x ∈ (O/s)^×.
* By the Ramanujan sum over O (identity I1: c_s(1) = Σ_{x∈(O/s)^×} e(x/s) = μ(s), checked on 56 moduli to 6.7e-14), the rows over a fixed s average to μ(s)/φ(s) times a copy of A₁ (principal-character projection), plus nonprincipal characters mod s.
* The Ramanujan amplifier c_{x/s} = μ(s) gives C²/‖c‖² ≍ (Σ_s μ²(s))²/Σ_s μ²(s)φ(s) ≍ 1.
* The planar large sieve (Lemma 6.1 of the 7/8 paper, separation 1/Q) and Cor 2.2 give J ≤ C(1 + Q²/D).
* Measured: J(Q = 40) = 1.265 over 229 rows. The s = 1 row contributes 1.000 and the rest 0.265, against a random baseline of 0.730.

**Proposition 4.3 (Kloosterman family) [PROVED].** Put f_m(n) = μ(n)S(m, 1; n) on squarefree n.
* S(0, 1; n) = c_n(1) = μ(n), so f₀ = μ² = 1 on N and A_{f₀} = A₁.
* For every m, A_{f_m} = Σ_n μ²(n)ν(n)S(m, 1; n)W(N n/D). Here μ is absorbed, since μ² = 1.
* As a function of m, S(m,1;n) is the sum over the Farey points x/n of e(x̄/n)e(mx/n). Each column carries ℓ²-mass φ(n) instead of \|μ(n)\|² = 1.
* So Σ_{\|m\|≤M} \|A_{f_m}\|² ≍ M·Σ_n φ(n)\|νW\|² ≍ MD² for M ≫ D² (well-spaced Farey points), and typical members have size D.
* That is the trivial bound for \|A₁\|. With J = 1 + (family-size term), M₂/J ≳ D².

Measured over Z (D = 3000, \|m\| ≤ 3000): J = 14049, of which the m = 0 row contributes 1. A typical \|f_m(n)\|² is about n ≈ 2251, so the copy weight is 1/2251 of a typical row.

**Isometric absorption (structural).**
* Ramanujan's identity μ(n) = Σ_{x∈(O/n)^×} e(x/n) absorbs μ, but it inflates the dual mass by φ(n) per column.
* The Gauss–Jacobi absorption μ(n)γ₋₁(n) = χ_n(−1)G(n)⁻¹α(n)γ₂(n) has \|γ_j(n)\| = 1, so it is isometric.
* The dual family keeps square-root size √D only under isometric absorption.
* Among the absorptions examined, only the Gauss–Jacobi sign law is isometric. It exists because J(χ², χ²) = −π for primary π, and that "−1" is μ(p). Kloosterman sums obey no such sign law.

[PROVED as a statement about the two norms; "only" refers to the cases examined]

**Remark 4.4 (reciprocity makes Kloosterman fractions additive in disguise) [PROVED identity].** For coprime u, n:

  e(ū/n) = e(1/(un))·e(−n̄/u),

where ū is an inverse of u mod n and n̄ an inverse of n mod u. For large n the family n ↦ e(ū/n) is therefore an archimedean factor ≈ 1 times a combination of characters mod u in n̄. It is the additive Farey family again, with no new copies.

---

## 5. Candidate 2b: Kloosterman structure inside the 7/8 probe

This is the concrete form of "additive twists with Kloosterman structure" for the probe. Twist the Farey-point coefficients of the additive polynomial of Prop 15.2 by a phase φ_s(d):

  A^φ_m = Y′^{−3/2} Σ_s c(s)W₁(r_s)r_s^{−1+iν} Σ_{d mod s} χ_s(d)φ_s(d) e(−md/s).

By Lemma 2.9 this is the only place a twist can act on the low side, because row twists do not reach it. Prop 15.2 is stated only for fixed finite combinations of the ray coefficients ("No arbitrary row-dependent arithmetic coefficient is asserted"). So every statement below about the twisted polynomial is either an identity or a model measurement.

The cases studied are:
* φ ≡ 1 (the paper, called "Gauss");
* φ_s(d) = e(d̄/s) ("Kloosterman");
* random unimodular phases ("rand");
* a half/half mixture ("half").

**First-version corrections (still in force).**
1. "Kloosterman phases decohere the sixth-power dual frequencies of Prop 15.2." This is false; the measurement refuted it.
   * The cause is Kloosterman reciprocity (I6). At small frequencies j the extra phase is an archimedean factor times a function mod j.
   * Non-exceptional frequencies acquire nonzero complete means, which are twisted Kloosterman sums (I7).
2. "On the high side the Kloosterman twist kills the a⁶ copies." This is false in the paper's regime q_A ≈ Z ≫ q_s.
   * There the factor e(A·H̄/s) is periodic mod s, so every frequency, a⁶ included, is multiplied by the same Ramanujan factor μ(s)/φ(s).
   * The copies die only in the opposite regime q_A ≪ q_s, by μ(a⁶) = 0.

### 5.1 Exact identities

All are checked in `tmp/zf-new-probe-identities.py`, log `…-identities.log`.

| id | identity | check |
|---|---|---|
| I1 | c_s(1) = Σ_{x∈(O/s)^×} e(x/s) = μ(s) | 56 squarefree moduli, error 6.7e-14 |
| I2 | mean over units of e(x̄/s) = μ(s)/φ(s) | error 6.2e-16 |
| I3 | High-side coefficient: for coprime s, A, K^φ(s,A,H) := Σ_{m mod sA} T^φ_s(m)χ_A(m)e(mH/(sA)) = K¹·φ_s(H Ā), with K¹ = N(s)·g(χ_A)χ_s(H)\overline{χ_s(A)}\overline{χ_A(H)}χ_A(s). For the Kloosterman phase, φ_s(H Ā) = e(A H̄/s). | 6 prime pairs, random and Kloosterman phases, relative error 1.8e-13 |
| I4 | Low-side C = 1 correlation: F^φ(s₁,s₂;j) = F(s₁,s₂;j)·φ_{s₁}(j s̄₂)\overline{φ_{s₂}(−j s̄₁)}. For the Kloosterman phase the extra factor is e(s₂ j̄/s₁)e(s₁ j̄/s₂). | 6 pairs × 4 frequencies, error 8.2e-15 |
| I5 | Σ_{q_s≤Y} 1 = 281, 1414, 5646 grows like Y, while Σ μ(s)q_s/φ(s) = −42.9, −54.0, −46.2 stays bounded (Y = 10³, 5·10³, 2·10⁴) | exact sums |
| I6 | Reciprocity: e(s₂ j̄/s₁)e(s₁ j̄/s₂) = e((s₁/s₂ + s₂/s₁)/j)·e(−(s₁s̄₂ + s₂s̄₁)/j), with s̄_i inverses mod j | 300 triples, error 4.0e-14 |
| I7 | Complete mean at a good prime j = π: the Gauss phase gives 0 when 6 ∤ e; the Kloosterman phase gives (twisted Kloosterman sum)/φ(π) | 30 cases: Gauss ≤ 1.6e-16; Kloosterman \|mean\| ∈ [0.018, 0.583], within the Weil bound 2√p/(p−1) |

I6 follows from the CRT identity x̄^{(y)}/y + ȳ^{(x)}/x ≡ 1/(xy) (mod O), applied to (j, s₁) and (j, s₂).

### 5.2 High side [PROVED-rel]

In the paper's probe:
* the completed theta index has q_A ≈ Z, because the Gaussian Mellin weight Z^t e^{t²} localises q_c q_n³ near Z;
* q_s ≈ Y′ = Z^{l_y−d} ≤ Z^{23/48}.

So q_A ≫ q_s. By I3, the A-dependence of the principal-row coefficient acquires the factor e(A H̄/s). This is periodic in A mod s, and its projection onto the principal character mod s is μ(s)/φ(s) for every H coprime to s (I1, I2).
* The target 1/L(x, η) therefore appears with coefficient μ(s)/φ(s) times its Gauss value, for every frequency, a⁶ included.
* The remaining characters mod s become new rows L(x, ηRψ), ψ mod s, of conductor about Y′.

Consequences:
* **The a-series survives.** ζ_F(6z) keeps the common factor μ(s)/φ(s), so the z = 1/6 copy residue is intact.
* **The s-series loses its pole.** Schematically (cf. (7.13)):
  * it changes from Σ_s c_σ(s)χ_s(u)q_s^{−w}, which gives L^S(w, χ_•(1)) at u = 1 and has a pole at w = 1;
  * to Σ_s c_σ(s)μ(s)χ_s(u)/φ(s)·q_s^{−w}, which is about 1/L(w+1, ·) and holomorphic at w = 1.
* **The normalisation fails.** With the paper's c_σ, the normaliser becomes a Möbius-type sum in s with no lower bound, so the normalisation step of §20.1 fails. With the coherent choice c(s) := μ(s)c_σ(s), the pole moves to w = 0 and the signal is multiplied by Y′⁻¹. I5 shows the loss of coherence numerically.
* **The opposite regime q_A ≪ q_s.** The factor is e(A/(Hs))·e(−A s̄/H). The first factor is ≈ 1. The second is periodic mod H = a⁶, with principal component c_{a⁶}(−s̄)/φ(a⁶) = μ(a⁶)/φ(a⁶) = 0 for a non-unit. Only a = 1 survives, and the z-residue is lost.

### 5.3 Low side [NUMERICAL in a finite model; EXACT decomposition]

**Scope under the atlas's surrogate rule (atlas §9; PUBLICATION_SCOPE, first boundary).** The quantities below are values of a Gram form in a finite model. They test the identities I4–I7 and the coherent-term formula of Theorem B. They are not lower bounds (and not upper bounds) for the paper's probe, and the model does not reach the regime P ≥ 7⁶ in which good sixth powers a⁶ enter (see the caveat at the end of §5.3).

Finite model, `tmp/zf-new-probe-kl-toy.py`:
* columns: split primes of norm in (Y/2, Y], with P₀ = 1, so S = {λ, 2};
* weight a(s) = bump(q_s/Y)·Y/q_s;
* Gaussian rows; P = Y²/Q.

"ratio" is the off-diagonal mean square divided by the diagonal. The prediction is the exact C = 1 sum over the exceptional frequencies j = unit·λ^v·2^w, using I4 and no fitted parameter.

Y = 20000: 1026 columns, 150 000 rows; standard error 0.0026–0.0027.

| P | 16 | 64 | 256 | 1024 | 4096 |
|---|---|---|---|---|---|
| Gauss: measured | 0.0074 | 0.0168 | 0.0214 | 0.0356 | 0.0420 |
| Gauss: predicted (exceptional) | 0.0054 | 0.0168 | 0.0243 | 0.0371 | 0.0456 |
| Kloosterman: measured | 0.0029 | 0.0130 | 0.0153 | 0.0289 | **0.0475** |
| Kloosterman: predicted (exceptional only) | 0.0034 | 0.0105 | 0.0145 | 0.0211 | 0.0335 |
| random phase: measured | −0.0020 | 0.0003 | 0.0002 | −0.0018 | −0.0005 |

The exact Poisson split (`tmp/zf-new-probe-kl-poisson.py`) sums every frequency j with non-negligible kernel. It separates the exceptional j from the non-exceptional ones, i.e. those divisible by a good prime.

| Y, P | phase | exceptional | non-exceptional | total |
|---|---|---|---|---|
| 3000, 1024 | Gauss | 0.0413 | 0.0006 | 0.0419 |
| 3000, 1024 | Kloosterman | 0.0237 | **0.0086** | 0.0323 |
| 3000, 1024 | random | −0.0008 | 0.0018 | 0.0010 |
| 3000, 1024 | half | 0.0219 | −0.0014 | 0.0205 |
| 8000, 256 | Gauss / Kloosterman | 0.0260 / 0.0144 | −0.0004 / 0.0012 | 0.0256 / 0.0156 |
| 8000, 1024 | Gauss / Kloosterman | 0.0396 / 0.0203 | −0.0012 / 0.0070 | 0.0384 / 0.0272 |
| 8000, 2048 | Gauss / Kloosterman | 0.0452 / 0.0256 | −0.0009 / **0.0119** | 0.0443 / 0.0375 |

The Y = 3000 Monte Carlo run (40 000 rows) agrees with the exact split: for example Kloosterman 0.0405 ± 0.0051 against 0.0323 at P = 1024, and Gauss 0.0473 ± 0.0052 against 0.0419.

What the measurements show about the model:
* **The Kloosterman phase does not remove the exceptional mass.** At small j, I6 makes the extra phase an archimedean factor e((s₁/s₂ + s₂/s₁)/j) times a function of (s₁, s₂) mod j. For units and S-monomials the second factor is trivial or has tiny modulus, and the first is a smooth O(1) phase. The pair sum does not cancel.
* **Kloosterman phases create new coherent frequencies.** For a non-exceptional j, the complete mean over (s₁, s₂) mod j is a twisted Kloosterman sum K_χ(j)/φ(j). It is nonzero (I7), whereas the Gauss phase has complete mean exactly 0 (Prop 15.2). The non-exceptional Kloosterman mass grows with P: 0.0012, 0.0070, 0.0119 at Y = 8000.
* **Random phases remove everything:** both the exceptional mass and the signal, since \|m(φ)\| ≈ q_s^{−1/2} with incoherent signs.

Caveat. The model uses prime columns only (C = 1 pairs) and P < 7⁶, so its coherent mass comes from S-monomial frequencies, not from good a⁶. The asymptotic P_a^{1/6} law is Theorem C (proved relative to the paper), not a measurement.

**Asymptotic reading [HEURISTIC].**
* For exceptional j = e·a⁶ with a good, the Kloosterman factor averages to S(−1,−1; j)/φ(j), of size ≪ N(j)^{−1/2}. So the large-a part of P_a^{1/6} is suppressed.
* The non-exceptional frequencies with N(j) ≤ P_a contribute sums of twisted Kloosterman sums over moduli j:
  * Weil's bound gives only (Q/Y′)P_a^{1/2+ε}, which is worse than Prop 15.2's P_a^{1/6};
  * Kuznetsov-type cancellation in sums of Kloosterman sums would give about P_a^{1/6+ε}, the same exponent;
  * only a Linnik–Selberg-type bound would remove the term.
* Whichever holds, §5.2 has already cost the signal a factor Y′⁻¹.

### 5.4 Phase-twist bookkeeping [HEURISTIC]

Paper geometry (l_x, l_y, ℓ) = (17/48, 23/48, 1/6), b = 1/8, h = 13/16 (`tmp/zf-new-probe-exponents.py`, X4).

| phase | signal factor | exceptional mass | σ₀ |
|---|---|---|---|
| Gauss (paper) | 1 | P_a^{1/6} | 7/8 |
| Kloosterman, q_A ≫ q_s | μ(s)/φ(s): no w = 1 pole; Y′⁻¹ with coherent c(s) | retained or larger | ≥ 1 − h/6 + b/12 + l_y = **65/48** |
| Kloosterman, q_A ≪ q_s | only a = 1 (μ(a⁶) = 0) | retained | ≥ 1 + b/12 = 97/96 |
| random-type, mean \|m\| = Z^{−μ} | \|m\| (coherent choice of c(s)) | about \|m\|²P_a^{1/6} | 1 − h/6 + max(b/12, μ) ≥ 7/8 |
| random (μ = l_y/2) | about Y′^{−1/2} | about 0 | 53/48 |

* For random-type phases the ratio signal²/exceptional mass is invariant, because both scale with \|m\|². The low-side gain from decoherence is paid for exactly by the signal.
* Kloosterman phases are worse: their mass is retained by reciprocity while their mean is about 1/φ(s).
* Prop D of `beat78-prop152-restrict.md` already covers fixed-character twists θ(s).

**Conclusion of Section 5.** Inserting Kloosterman structure into the 7/8 probe is strictly worse on both sides. No phase examined breaks the duality between signal and exceptional term.

---

## 6. Candidate 3: spectral families (Kuznetsov)

The family is A_f = Σ_n μ(n)λ_f(n)W(n/D). Here f runs over Hecke–Maass forms of level q with \|t_f\| ≤ T, plus the continuous spectrum E(·, 1/2 + it), whose Hecke eigenvalues are τ_{it}(n) = Σ_{ab=n}(a/b)^{it}. The setting is over Q for definiteness; the same holds over F.

This family is unrelated to the spectral-head and spectral-repair modules of the audit, which concern the fixed-support Weil operator (§1.4). The sibling `zf-campaign-quartic-gl2.md` treats GL(2) eigenforms as rows (its Lemma D: an optimal family-blind spectral large sieve excludes a positive density of repeated rows; its Lemma E: the Eisenstein rows see a zeta zero only in a t-window of measure D^ε). That is consistent with what follows.

**Proposition 6.1 (no member equals A₁) [PROVED from STANDARD inputs].**
* For a cusp form, Rankin–Selberg and the prime number theorem for L(s, f) give Σ_n μ²(n)\|λ_f(n) − 1\|²W ≍ D. So A_f − A₁ is a full twisted Möbius sum.
* For the Eisenstein series, the Euler product gives Σ_n μ(n)τ_{it}(n)n^{−s} = G_t(s)/(ζ(s+it)ζ(s−it)).
  * Here G_t(s) = Π_p (1 − p^{−2s}(1 − p^{−s−it})^{−1}(1 − p^{−s+it})^{−1}) is holomorphic in Re s > 1/2.
  * It has no zeros there apart from the local factors at p ≤ 3, which are deleted as in the paper.
* So A_{E_t} detects the zeros of ζ at heights ≈ ±t. It is a zero-detecting copy of 1/ζ(s)² at a shifted height, not a copy of A₁.

**Proposition 6.2 (copy weight) [STANDARD].** In the Kuznetsov formula for Γ₀(q), the Eisenstein contribution per unit t-window has the same order of weight as a single cusp form: both are ≍ q⁻¹ up to logarithms, by the Plancherel and Weyl-law normalisations. With harmonic weights, J = O(1).

**Proposition 6.3 (positivity gives the trivial bound) [PROVED relative to the spectral large sieve, STANDARD: Deshouillers–Iwaniec 1982].**
* Bound the nonnegative Eisenstein term by the whole spectral side.
* That gives q⁻¹∫_{\|t−γ\|≤1} \|A_{E_t}\|²\|ζ(1+2it)\|^{−2}dt ≪ (T² + D^{1+ε}/q)D, which needs T ≥ \|γ\| + 1.
* Hence \|A_E\|² ≲ (qT² + D)D ≥ D², which is trivial.

The positivity used here is that of the spectral side, used for an upper bound on one member. No positive margin of the kind atlas §11 warns against is targeted.

**Amplification [HEURISTIC, standard bookkeeping; X5].**
* An amplifier of length L based on the Hecke relations gains L²/L in the amplified Eisenstein term.
* The amplified bilinear form has length DL, so the off-diagonal is negligible only if qT ≳ DL.
* The bound \|A_E\|² ≲ qT²D·log L/L is then ≥ D²γ log L. The gain L is cancelled exactly by the growth of the family.
* In the DFI subconvexity argument the off-diagonal is beaten by the Weil bound for Kloosterman sums. Here it carries Möbius coefficients, and no Weil-type input exists for μ.

**Off-diagonal circularity [HEURISTIC, structural].**
* The Kloosterman terms are Σ_{c≡0 (q)} c⁻¹ Σ_{m,n} μ(m)μ(n)S(m,n;c)H(4π√(mn)/c). Opening S gives Möbius sums twisted by e(mx/c) for c ≤ D/T, coupled through a Bessel phase.
* Their principal-character parts are μ(c)/φ(c) times Möbius sums of ζ at heights about √(mn)/c. Bounding them needs zero-free information at all heights up to D/T, i.e. the uniform half-plane itself.
* The unconditional "Möbius against trace functions" bounds (Fouvry–Kowalski–Michel) save about c^{−1/48} per modulus. That is far from the cancellation over c that would be needed. The required statement is a Linnik–Selberg-type bound with Möbius weights, which already contains the conclusion.

**Remarks.**
* In the scattering picture, the zeros of ζ(2s) are poles of the scattering matrix ξ(2s−1)/ξ(2s) at s = ρ/2, off the unitary axis. L²-spectral families see them only through analytic continuation, as Möbius sums do.
* On the sextic metaplectic cover, the exceptional term of Prop 15.2 and the z = 1/6 signal both come from the residual spectrum, the Kubota–Patterson theta. A spectral test function that vanishes at the theta's spectral parameter removes both. [HEURISTIC; consistent with Theorem C and Prop E′ of the prior note]

**Exponent.** θ = 1. **No zero-free half-plane.**

---

## 7. PR #14's sixth-phase filter and the duality

### 7.1 What PR #14 constructs [CITED: `refs/pr/14:rigorous/mobius_bridge_reduction/SIGNED_PHASE_FILTER.md`]

For ξ⁶ = 1, PR #14 puts F(ξ) = (ξ + ξ² + ξ³ + ξ⁴ + ξ⁵)/5: it equals 1 at ξ = 1 and −1/5 otherwise, with F(0) = 0. This is the minimum-energy filter among those with F(1) = 1 and zero phase average.

For rational primes p ≡ 1 (mod 6):
* f_p(n) = F(χ_p(n)), with χ_p an order-six character mod p;
* A(n) = K⁻¹Σ_{p∈𝒫} f_p(n).

PR #14 proves:
* exact complete-period Gram orthogonality;
* an incomplete-interval mean-square bound.

It identifies the eigenvalue-one subspace {n : n is a nonzero sixth power mod every p ∈ 𝒫}, of dimension Π_p (p−1)/6 per complete period. It states that a power saving would need a coefficient-specific bound ‖Π_bad a‖² ≤ N^{−δ}‖a‖² (its §5). Embedding the filter into the probe (its §6, steps 1–4) is left open.

Atlas §10 summarises this as: "the simultaneous local sixth-power residue subspace retains eigenvalue one. Small mean energy is not a worst-case contraction."

### 7.2 Proposition P14

Let 𝒫 be a finite set of good prime ideals of O (not above 2 or 3, outside S, and prime to the moduli in play). A *sextic-symbol filter* on 𝒫 is a function A: O → C of the form

  A(j) = Φ((χ_π(j))_{π∈𝒫}),  Φ: (μ₆ ∪ {0})^𝒫 → C,

with χ_π(j) = 0 when π \| j. PR #14's filter is the case Φ = K⁻¹Σ_π F(·_π), over Q.

**(a) [PROVED]** A(j·t⁶a⁶) = A(j) for all j ∈ O and all t, a ∈ O with (ta, ∏𝒫) = 1.

*Proof.* χ_π is completely multiplicative with values in μ₆ ∪ {0}. For π ∤ ta, χ_π(t)⁶ = χ_π(a)⁶ = 1, so χ_π(jt⁶a⁶) = χ_π(j). Every coordinate of the argument of Φ is unchanged. ∎

**(b) [PROVED]** Let e₀ be the coherent class of Theorem B (`beat78-prop152-restrict.md` §3: c_σ(s)χ_s(e₀) = 1/τ on σ). The filter is constant, equal to A(e₀), on

  𝒞_𝒫 := {e₀t⁶a⁶ : t an S-monomial, a good primary, (a, ∏𝒫) = 1}.

The number of such a with q_a⁶ ≤ P is ≍_𝒫 P^{1/6}. This is the exponent of the exceptional term of Prop 15.2.

*Proof.* Constancy is (a) with j = e₀: e₀ is an S-unit and t an S-monomial, both prime to every good π. For the count, the a-count of the prior note's Theorem C, Step 3, is #{a good, q_a ≤ A, (a, D′) = 1} = κ_S A φ(D′)/q_{D′} + O_S(2^{ω(D′)}(A^{1/2} + 1)). Apply it with D′ = ∏𝒫 and A = P^{1/6}. ∎

So every principal-preserving sextic-symbol filter (A(e₀) = 1) acts as the identity on a set of frequencies of exactly the exceptional size, for every choice of 𝒫. PR #14's complete-period count Π(p−1)/6 includes "accidental" residues. Those thin out as 𝒫 grows (measured, §7.3); the global sixth powers do not.

**(c) [PROVED-rel: Theorem C, Prop 15.2 and Prop 15.3's range]** PR #14's criterion transcribed to the 7/8 low side fails. The transcription is as follows.
* The role of the coefficient vector a is played by the row vector (A_m) of Prop 15.2.
* The role of its eigenvalue-one modes is played by the coherent Gram frequencies j ∈ 𝒞_𝒫 of the exact expansion (1.1) of the prior note, Σ_m ψ(m/√Q)\|A_m\|² = (Q/Y′³)Σ_{s₁,s₂}a(s₁)ā(s₂)Σ_j F(s₁,s₂;j)ψ̂(√Q j/(s₁s₂)).

The criterion would need the coherent part to be ≤ Z^{−δ} of the total. But:
* by Theorem C (Step 3, with the extra coprimality (a, ∏𝒫) = 1, which costs the constant factor Π_π(1 − 1/q_π)), Re 𝔈₁^{coh}[𝒞_𝒫] ≥ κ_𝒫(Q/Y′)P_a^{1/6} for Z ≥ Z₀;
* by Prop 15.2 in Prop 15.3's range, the total is ≪ (Q/Y′)P_a^{1/6}Z^ε.

Hence the coherent share is ≥ κ_𝒫Z^{−ε}. No coefficient-specific bound with a power saving holds on this block. PR #14 §5 itself notes that "an input vector supported on an eigenvalue-one mode saturates ‖Ta‖ = ‖a‖". Theorem C says the actual vector carries a fixed fraction of its mass on such modes.

**(d) [HEURISTIC]** Suppose a realisation of the filter multiplies the coherent block by A(e₀) and the high-side principal residue by the same factor. Then the ratio signal²/coherent mass is unchanged, whatever A(e₀) is.

This is the multiplier form of the duality. It is consistent with the two cases in which both sides were computed:
* Lemma R and Prop E′ of the prior note: a class restriction at an S-prime multiplies both sides by functions of (1 + τ_p c_L χ_p³(x)) that vanish on the same classes;
* the good-prime control of the prior note §7.3 and §8.4: the coherent mass is uniform over classes at good primes.

It is not proved for an arbitrary realisation.

**On realising the filter (PR #14's open step 1).** In PR #14's integer-row setting, T multiplies the Fourier modes of one coefficient vector. In the 7/8 low side, the Fourier modes of the row vector A_m are the Farey points d/s. There, a function of the sextic symbols of d at primes π ∤ s is not defined, since d is only a class mod s. The two well-defined transcriptions are:
1. a multiplier on the Gram frequencies j of (1.1), to which (a)–(c) apply;
2. a column twist θ(s) = Φ((χ_π(s))_π). By sextic reciprocity this is a combination of Kummer twists χ_s(π^k), so it falls under Prop D of the prior note with S enlarged by 𝒫:
   * each Kummer component carries its own coherent class (e₀π^{−k}) and its own signal row (u ∼ π^{6−k});
   * PR #14's F has no k = 0 component, so the original class and the original principal row both drop out together [HEURISTIC: Prop D is proved for conductors supported on S; the enlargement is not written out].

In neither transcription does the filter separate the signal from the exceptional term.

### 7.3 Measurements (`tmp/zf-new-probe-filter.py`, log `…-filter.log`, json `…-filter.json`; 0.7 s)

**A1. The implementation reproduces PR #14's published table exactly** (exact integer arithmetic, 37 primes p ≡ 1 mod 6 up to 400):

| N | mean square of A | PR #14 | signed off-diagonal | PR #14 |
|---|---|---|---|---|
| 1 000 | 0.008622176771 | 0.008622176771 | 0.003267728269 | 0.003267728269 |
| 10 000 | 0.005640593134 | 0.005640593134 | 0.000314179693 | 0.000314179693 |
| 100 000 | 0.005340472462 | 0.005340472462 | 0.000014788605 | 0.000014788605 |
| 200 000 | 0.005331929730 | 0.005331929730 | 0.000006252155 | 0.000006252155 |

The complete-period benchmark (5K²)⁻¹Σ(1 − 1/p) is 0.005325611397, as in PR #14.

**A2. The eigenvalue-one set inside [1, N]** is E_K(N) = #{n ≤ N : f_p(n) = 1 for the first K primes}. It splits into global sixth powers a⁶ with (a, ∏𝒫_K) = 1 and accidental members. The expected accidental count is N·Π_p (p−1)/(6p).

| K | N = 10⁴ | N = 10⁵ | N = 10⁶ | N = 10⁷ | accidental at N = 10⁷ (expected) |
|---|---|---|---|---|---|
| 1 | 1429 | 14286 | 142858 | 1428572 | 1428560 (1.43·10⁶) |
| 3 | 35 | 347 | 3471 | 34703 | 34692 (3.47·10⁴) |
| 5 | 4 | 11 | 92 | 908 | 897 (908) |
| 8 | 4 | 6 | 9 | 13 | 2 (3.98) |
| 12 | 4 | 6 | 9 | 11 | 0 (0.0029) |
| 20 | 4 | 6 | 9 | 11 | 0 (1.7·10⁻⁹) |
| 37 | 4 | 6 | 9 | 11 | 0 (9.2·10⁻²³) |

With K ≥ 12, the eigenvalue-one set inside [1, 10⁷] is exactly the global sixth powers {a⁶ ≤ N : (a, ∏𝒫) = 1}, counted 4, 6, 9, 11 ≍ N^{1/6}. Every global sixth power lies in the set at every K, which the script asserts.

**A3. Gram-optimal filter.** Minimise the energy over all weightings a_p with Σa_p = 1 (PR #14 §6). Each such filter has A(a⁶) = Σa_p = 1, so it pays at least #{a⁶ ≤ N}/N on the global sixth powers, and the optimum pays exactly that there.

| N | optimal energy | equal weights | floor #a⁶/N | optimal filter's energy on the a⁶ |
|---|---|---|---|---|
| 10⁴ | 5.622e-3 | 5.641e-3 | 4.0e-4 | 4.0e-4 |
| 10⁵ | 5.336e-3 | 5.340e-3 | 6.0e-5 | 6.0e-5 |
| 2·10⁵ | 5.328e-3 | 5.332e-3 | 3.0e-5 | 3.0e-5 |

For the unweighted integer-row vector, the floor is far below the achieved energy. What makes the floor bind in the 7/8 probe is (c): the actual coefficient vector concentrates on the eigenvalue-one frequencies.

**B1. Z[ω] identity.** χ_π(j t⁶a⁶) = χ_π(j) holds in 4684 random cases over 120 split primes of norm ≤ 3000, with the 7/8 paper's sextic symbols (`tmp/beat78-prop152-restrict-core.py`). There were 0 mismatches, and 4542 cases had χ_π(t) or χ_π(a) nontrivial.

### 7.4 Consequence, and what is different from PR #14

**What PR #14 established.**
* The eigenvalue-one subspace of its finite filter.
* That small mean energy does not imply contraction.
* Four open steps for embedding the filter.

**What this section adds.**
1. For every choice of selected primes, the part of that subspace that survives is the global sixth powers. They are exactly the frequencies that carry both the high-side z-pole (ζ_F(6z)) and the low-side coherent term (Theorem B).
2. Their count has the exceptional exponent 1/6.
3. In the 7/8 probe, the actual coefficient vector places a fixed fraction of its mean square on them (Theorem C). So PR #14 §5's coefficient-specific route to a power saving is closed for this probe's low side.

**What remains for the eigenvalue-one block.** It can be evaluated, but it cannot be bounded away. Evaluating it is the subtraction route (prior note §11.3): compute ⟨A^{coh}, B⟩ explicitly. That needs the sextic theta coefficients at squarefree indices, which are unknown (Kazhdan–Patterson non-uniqueness for n = 6 on GL(2), recalled).

---

## 8. The other audit levers

### 8.1 The Möbius-energy route is the half-plane (Proposition E1)

For k ∈ C_c²(R), real-valued with supp k ⊂ [−R, R], put

  K̃(q) := ∫k(v)e^{qv}dv,  S(u) := Σ_{n≥2}Λ(n)n^{−1/2}k(log n − u),  E(j) := ∫_j^{j+1}\|S(u)\|²du.

Call k *pole-cancelling* if K̃(1/2) = 0. This is the condition that removes the e^{u/2} main term (PR #14's packet is of this kind).

The PR #14 identity S(L) = Σ_d μ(d)d^{−1/2}F(L − log d), with F(y) = Σ_m (log m)m^{−1/2}k(log m − y), follows from μ ∗ log = Λ. So E(j) is PR #14's Möbius pair sum.

**Proposition E1 [PROVED].** Let 0 ≤ α < 1 and let k be pole-cancelling.

(i) If ζ(s) ≠ 0 for Re s > (1+α)/2, then E(j) ≪_k e^{αj} for j ≥ R + 1.

(ii) If E(j) ≪ e^{αj} for all large j, then every zero ρ with Re ρ > (1+α)/2 satisfies K̃(ρ − 1/2) = 0.

(iii) ζ(s) ≠ 0 for Re s > (1+α)/2 if and only if E_k(j) ≪_k e^{αj} for every real pole-cancelling k ∈ C_c²(R).

*Proof of (i).*
1. **The test function.** For u > R, h(x) := x^{−1/2}k(log x − u) is C² with compact support in (1, ∞). Its Mellin transform is H(s) = ∫h(x)x^{s−1}dx = e^{(s−1/2)u}K̃(s − 1/2).
2. **Decay of K̃.** Two integrations by parts give \|K̃(q)\| ≤ ‖k″‖₁e^{R\|Re q\|}\|q\|^{−2}.
3. **The contour shift.** Write Σ_nΛ(n)h(n) = (2πi)⁻¹∫_{(2)}(−ζ′/ζ)(s)H(s)ds and shift the contour to Re s = −M − 1/2.
   * Use horizontal segments at heights T_m ∈ [m, m+1] where \|ζ′/ζ\| ≪ log²T_m on −1 ≤ σ ≤ 2 [STANDARD].
   * For σ ≤ −1, use the functional-equation bound ζ′/ζ ≪ log(\|s\| + 2) away from the trivial zeros.
   * The horizontal contributions tend to 0 because \|H\| ≪ \|τ\|^{−2}.
   * The left line contributes ≪ e^{−(M+1)(u−R)}log M → 0 as M → ∞.
4. **The explicit formula.** The poles of −ζ′/ζ have residues +1 at s = 1, −m_ρ at the nontrivial zeros and −1 at s = −2m. So

   S(u) = K̃(1/2)e^{u/2} − Σ_ρ m_ρ K̃(ρ − 1/2)e^{(ρ−1/2)u} − Σ_{m≥1}K̃(−2m − 1/2)e^{−(2m+1/2)u}.

   The ρ-sum converges absolutely by step 2 and Σ_ρ\|ρ − 1/2\|^{−2} < ∞. The m-sum converges for u > R.
5. **The bound.** With K̃(1/2) = 0 and Re ρ ≤ (1+α)/2 for every ρ,

   \|S(u)\| ≤ e^{αu/2}‖k″‖₁e^{R/2}Σ_ρ m_ρ\|ρ − 1/2\|^{−2} + O_k(e^{−(u−R)/2}).

   Squaring and integrating over [j, j+1] gives E(j) ≪ e^{αj}. ∎

*Proof of (ii).*
1. By Cauchy–Schwarz, ∫_j^{j+1}\|S\| ≤ E(j)^{1/2} ≪ e^{αj/2}. So L(q) := ∫_{R}^{∞}S(u)e^{−qu}du converges absolutely and is holomorphic on Re q > α/2.
2. For Re q > 1/2, expand S and integrate termwise.
   * For log n ≥ 2R the inner integral is n^{−q}K̃(q).
   * The finitely many n with log n < 2R contribute an entire function, and so does the correction for removing them from the Dirichlet series.

   So L(q) = K̃(q)·(−ζ′/ζ)(q + 1/2) + P(q) with P entire.
3. The right side is meromorphic on Re q > α/2 and agrees with L on Re q > 1/2, so the two agree on the connected region Re q > α/2.
4. At q = 1/2 the simple pole of −ζ′/ζ is cancelled by K̃(1/2) = 0.
5. At q₀ = ρ − 1/2 with Re q₀ > α/2 and K̃(q₀) ≠ 0, the right side has a pole of residue −m_ρK̃(q₀) ≠ 0. That contradicts holomorphy of L. ∎

*Proof of (iii).*
* "Only if" is (i).
* For "if", take a zero ρ with Re ρ > (1+α)/2 and put q₀ = ρ − 1/2 ≠ 1/2. The functions e^{v/2}, e^{Re(q₀)v}cos(Im(q₀)v) and e^{Re(q₀)v}sin(Im(q₀)v) are linearly independent on any interval. (When Im q₀ = 0 the last one vanishes, but then Re q₀ ≠ 1/2 and the first two are already independent.) So the real-linear map k ↦ (K̃(1/2), Re K̃(q₀), Im K̃(q₀)) is onto, and some real k ∈ C_c^∞ has K̃(1/2) = 0 and K̃(q₀) ≠ 0.
* (ii) applied to this k excludes ρ. ∎

**Consequences.**
* For each fixed packet, the energy exponent is exactly α*(k) = max(0, 2β*(k) − 1), where β*(k) is the supremum of Re ρ over the zeros with K̃(ρ − 1/2) ≠ 0.
* The 7/8 paper (unrefereed) gives α* ≤ 3/4.
* PR #14's conditional B = 0.87488665 gives α* ≤ 0.7497733 (`tmp/zf-new-probe-audit-exponents.py`, X3b).
* PR #14's target 0.7496 is the statement B = 0.8748 (X3d, X3g).
* PR #14 derived direction (ii) for its packet. Direction (i), proved here, shows that controlling the open signed pairs at exponent α is equivalent to the half-plane at (1+α)/2; it is not a weaker sufficient condition.

**Numerical check of the identity in step 4** (`tmp/zf-new-probe-energy.py`, log `…-energy.log`, 13 s; 200 zeros of ζ computed by mpmath and cached in `tmp/zf-new-probe-zeros.json`) [NUMERICAL].
* **Identity.** With k(v) = exp(−1/(1 − v²)), the direct prime sum and the explicit-formula side agree to ≤ 5.8·10⁻¹⁰ for u = 3, …, 12. The residual is limited by double-precision rounding of S(12) ≈ 182.7; \|K̃(iγ₂₀₀)\| = 7.8·10⁻¹².
* **Pole-cancelling packet.** For k_pc = k − c·2k(2·) with c = 1.0148793493 (K̃_pc(1/2) = 0), the block energies are E(3), …, E(11) = 0.0030, 0.0031, 0.0030, 0.0030, 0.0030, 0.0028, 0.0027, 0.0027, 0.0027.

This checks the formula used in (i). With only computed zeros in play, it says nothing about any zero beyond them.

### 8.2 The V7 floor and one-sided bounds (F1)

**[CITED: V7 `03-landau.tex` via `refs/pr/27:research/rh/foundation/source/03-landau.tex`]** Write

  D(W) = Σ_{n<e^W}Λ(n)n^{−1/2}(W − log n) − (4e^{W/2} − 2W − 4),  with Laplace transform M(q) = q^{−2}[−ζ′/ζ(q+1/2) − 1/(q − 1/2)].

The cited results are:
* **One-sided outer bound.** D(W) ≤ C(1+W)^m e^{αW} for W ≥ W₀ implies ζ ≠ 0 on Re s > 1/2 + α. The proof is Landau's mechanism for nonnegative integrands.
* **Box identity and the floor.** The constant box e₀ satisfies Q_W[e₀] = A₀₀(W) − 2D(W)/W with 0 ≤ A₀₀ − a(0) < 0.8. So the floor ε₀(λ) ≥ −C(1+log λ)^mλ^p, with W = 2 log λ, implies the half-plane Re s > (1+p)/2.

**Converse for D [PROVED; classical, cf. the explicit formula for ψ₁].** Invert the Laplace transform on Re q = c > 1/2, where \|M(q)\| ≪ \|q\|^{−2}log\|q\|, and shift the contour left as in §8.1. The poles are a double pole at q = 0, simple poles at ρ − 1/2 and simple poles at −2m − 1/2; q = 1/2 is removable. This gives

  D(W) = c₀ + c₁W − Σ_ρ m_ρ e^{(ρ−1/2)W}/(ρ − 1/2)² − Σ_{m≥1}e^{−(2m+1/2)W}/(2m + 1/2)²,

with an absolutely convergent zero sum. Under ζ ≠ 0 on Re s > 1/2 + α this gives \|D(W)\| ≪ e^{αW} + W, two-sided.

**Hence:**
* half-plane (1/2 + α) ⟺ one-sided D-bound (α) ⟺ two-sided D-bound (α);
* by E1 these are also ⟺ the energy bound (2α);
* floor (p) ⇒ half-plane ((1+p)/2).

The converse for the floor is not established here. The floor is a statement about the whole supported form, while the half-plane controls only the box direction. So the floor is at least as strong a target as the half-plane, and it offers a probe nothing easier.

**One-sidedness and probes [HEURISTIC].** Landau's mechanism makes a one-sided bound sufficient. Amplification bounds \|A₁\|²; it is two-sided by construction, since positivity enters only through squares.
* For Möbius coefficients a positive amplifier cannot be transferred to a one-sided bound: Σ_n μ(n)W·P(n) with P ≥ 0 has no sign.
* A one-sided route needs nonnegative coefficients (Λ). It then uses sieve majorants, whose constant-factor loss (Selberg's parity example) is fatal at power-saving precision.

This is a statement about the methods examined, not a theorem about all one-sided methods.

### 8.3 The Xu–Sang import and the prize of this lever (X)

`tmp/zf-new-probe-audit-exponents.py`, log `…-audit-exponents.log` (29 exact lines):

| id | identity or value | status |
|---|---|---|
| X1a–b | σ₀ = 11/12 − ℓ/4 on M + ℓ = 1 gives 7/8 at ℓ = 1/6 and PR #14's B = 17497733/20000000 at ℓ = 2506801/15000000 | [EXACT] |
| X1c | Xu–Sang's displayed 0.8748867 minus PR #14's B = 1/20000000 | [EXACT] |
| X1d | (1 + κ)/2 = 69991/80000 at κ = 29991/40000: PR #14's first-stage licence of the row ceiling | [EXACT] |
| X1e, X1g | 7/8 − B = 2267/20000000; ℓ − 1/6 = 2267/5000000 | [EXACT] |
| X1f, X1h | on M = 1 − ℓ, Lemma 15.1's stated range 2M ≥ 1 + 4ℓ forces ℓ ≤ 1/6, and the range 2M ≥ 1 + 3ℓ allows ℓ ≤ 1/5 | [EXACT] |

**Reading.**
* The imported system has the same low-side structure as the 7/8 paper: b does not appear in B, so the P_a^{1/6} term is untouched.
* Its ℓ exceeds 1/6. On M + ℓ = 1 that is outside Lemma 15.1's stated range, so the import must use the wider zero-loss range 2M ≥ 1 + 3ℓ. That range was identified as available from the unused Z^{−d} slack of (15.8) in the beat78 analysis. [HEURISTIC inference from the parameter values; the source paper is not available offline.]
* The gain comes from a high-side bootstrap: a first-stage boundary licenses the row ceiling κ. Atlas §10 records the result as conditional on the imported analytic inputs.
* PR #14's (H) (`TARGET_0874.md`) is a restricted fourth moment on detected high-side rows. It lies outside this lever; the sibling `zf-campaign-high-side.md` treats row counts.

**The prize of this lever** (exponent model, `restrict` note E1: σ_low = 5/6 + M/12 − ℓ/6 − (1 − η)b/12, where η = 1 is Prop 15.2 as stated and η = 0 means the term is removed) [HEURISTIC]:

| geometry | η = 1 | η = 0 (low side only) | prize b/12 | rough Λ price at 0.003 per 0.01 of θ |
|---|---|---|---|---|
| 7/8 paper, (M, ℓ, b) = (5/6, 1/6, 1/8) | 7/8 | 83/96 = 0.8645833 | 1/96 | ≈ 0.0031 |
| PR #14 parameters, M = 1 − ℓ, b = 17307/200000 | 0.87488665 | 0.8676754 | 5769/800000 | ≈ 0.0022 |

In both cases the high side would have to be re-checked at the new point. The Λ prices are a linear extrapolation of a local rate, not bounds. Xu–Sang's own conditional gain over 7/8 is 1.13·10⁻⁴ in θ (X1e), about 3.4·10⁻⁵ in Λ at the same rate.

---

## 9. Mixed families

Take a product family with rows (u, k), u in the sextic family and k in the angle, archimedean, additive or spectral family.
* The copies are (a⁶, trivial). Every non-trivial factor family has J = O(1) (Prop 3.2, E2, Prop 4.1, Prop 6.2), so J_mixed ≈ J_sextic.
* The family size is multiplied by #(second family).
* At the natural range the excess is unchanged and the family is larger, so the result is no better than the sextic family alone. [HEURISTIC; immediate from Lemma 2.1]

The twists examined are all neutral or worse:
* angle twists of the row weight (Prop 3.4; Lemma 2.9 for the low side);
* the Kloosterman phase of the column coefficients (§5);
* fixed-character twists (prior Prop D);
* sextic-symbol filters (§7).

---

## 10. Exponent table [HEURISTIC; `tmp/zf-new-probe-exponents.py`, `tmp/zf-new-probe-audit-exponents.py`]

Framework A: \|A₁\|² ≲ M₂/J. With M₂ = D^{1+λ} (square root over #F = D^λ) and J = #F^κ,

  θ = 1/2 + λ(1 − κ)/2.

| family | κ (copy density) | natural-range θ | Framework B σ₀ (h_eff = 3/4 held fixed) |
|---|---|---|---|
| Kummer k = 2 (circular: quadratic Gauss sums do not absorb μ) | 1/2 | 3/4 | — |
| Kummer k = 3 (μ not absorbed, prior C2; cubic sibling, Gauss-class ledger) | 1/3 | 5/6 | 3/4 (prior re-optimised: 0.743) |
| Kummer k = 4 (quartic theta coefficients unknown; quartic sibling) | 1/4 | 7/8 | 13/16 (prior: 0.810) |
| **Kummer k = 6 (the paper)** | 1/6 | 11/12 | **7/8** |
| angle / archimedean / additive / Kloosterman / spectral | 0 (J ≈ 1 + #F/D) | 1 | 1 |

Beating 7/8 at the natural range needs κ > 1/4, i.e. J ≥ #F^{1/4}.

Under a hypothetical μ-specific square-root mean square at a sub-natural range λ < 1, a family with κ = 0 gives θ = (1 + λ)/2. That hypothesis is itself a statement of zero-free-region strength, and amplification adds nothing to it. For the archimedean family at T ≍ 1 (the energy route), E1 makes this exact: the mean-square exponent α and the half-plane (1 + α)/2 are equivalent.

Audit lines (X3):

| boundary B | energy exponent 2B − 1 = V7 floor exponent p | source |
|---|---|---|
| 7/8 | 3/4 | 7/8 paper (unrefereed) |
| 17497733/20000000 | 0.7497733 | PR #14, conditional on Xu–Sang v2 |
| 0.8748 | 0.7496 | PR #14 energy target (unproved) |
| 0.874 | 0.748 | PR #14 `TARGET_0874.md`, needs (H) (unproved) |
| 83/96 | 35/48 | this lever's model prize at the paper geometry (unproved) |

---

## 11. Precise obstruction

**Obstruction.** In the copy-amplification architecture (Frameworks A and B), a probe needs two things:
* (R1) an excess of copies of A₁ over the random baseline (Lemma 2.1, Cor 2.2);
* (R2) an isometric absorption of μ into coefficients that have a summation formula, so that the dual family obeys a family-blind large sieve at square-root size (Cor 2.2, §4).

**(R1) cannot come from:**
* additive structure in the rows (Lemma 2.3: excess ≤ 4);
* archimedean or angle structure (Lemma 2.8, Prop 3.2, E2: J = O(1));
* GL(2) spectral structure (Prop 6.2; quartic sibling Lemma D).

Under the Poisson compatibility that (R2) needs, (R1) must come from a bounded-order residue-character family (Lemma 2.4, Prop 2.5). In the column variable, copies sit only at members that are principal residue characters (Lemma 2.8).

**(R2)** then restricts the Gauss sums of those characters to factor through the cubic theta. By the prior Lemmas C1 (Galois parity) and C2 (μ-absorption), and the cubic sibling's Gauss-class ledger, that leaves exactly the sextic family over Q(√−3), with copy density 1/6.

**The three proposed families fail both requirements:**
* **angle and archimedean Grössencharacters:** J = 1 + o(1) or O(1), and the dual is a sector or frequency localisation that keeps μ;
* **additive / Kloosterman:** J is exactly or essentially the baseline, and the absorption is the non-isometric Ramanujan one;
* **spectral:** the Eisenstein members have the weight of one cusp form, and the off-diagonal is Möbius in progressions.

**Used as twists inside the 7/8 probe, they remove the signal and keep the exceptional mass:**
* any unimodular row twist leaves the low side unchanged (Lemma 2.9), and the angle twist loses the z-pole (Prop 3.4);
* the Kloosterman phase of the columns loses the w-pole, and Kloosterman reciprocity retains the exceptional mass (§5);
* a random phase removes both, in a fixed ratio (§5.4);
* sextic-symbol filters (PR #14) are constant on the coherent block, which is the block that carries the signal (§7, P14).

**The duality, now from two independent constructions.**
* The coherent frequencies e₀t⁶a⁶ carry the low-side exceptional term (Theorem B/C).
* The same global sixth powers carry the high-side z-pole (Prop E).
* They also form the persistent eigenvalue-one set of every principal-preserving sextic-symbol filter (P14; atlas §10).

The actual coefficients put a fixed fraction of their mean square on that block (Theorem C). So the block cannot be bounded away by any coefficient-specific estimate (P14c). It can only be evaluated.

**The audit's other levers do not change this.**
* The Möbius-energy target and the one-sided discrepancy bound are equivalent to the half-plane (E1, F1).
* The V7 floor implies it (F1).
* The Xu–Sang import changes only the high side (§8.3).

**What would be needed instead.** In the atlas's terms, this is an all-scale signed arithmetic estimate below 7/8. Concretely, one of the following:
1. A different summation formula in the row variable (not Poisson) under which multiplicative copies survive and μ is absorbed isometrically. No candidate is known; Kuznetsov (§6) and Voronoi-type formulas keep μ.
2. A theta function with explicit squarefree coefficients for a degree k ∈ {3, 4} cover. For n ≥ 4 on GL(2) the theta is not distinguished (Kazhdan–Patterson, recalled in the prior note and not re-checked). The cubic and quartic siblings treat this; it is a recalled obstruction, not a theorem proved here.
3. Evaluating, rather than bounding, the eigenvalue-one block: the subtraction route ⟨A^{coh}, B⟩ = signal + remainder. It needs the sextic theta coefficients at squarefree indices (prior note §11.3). This is the only option §7 leaves for that block, and this lever does not touch it.
4. Outside this lever, on the high side: PR #14's (H), or better row counts (sibling `zf-campaign-high-side.md`).

**Within this lever, nothing below 7/8 is reachable.**

---

## 12. Verified vs unverified

**Verified:**
* Lemma 2.1 (with its weighted form), Cor 2.2, Lemma 2.3, Lemma 2.4 (general period ideal), Prop 2.5, Lemma 2.8 and Lemma 2.9: complete proofs, using the convexity bound [STANDARD] in 2.8.
* Prop 3.1, Prop 3.2 for K ≤ D^{1/2−ε}, Prop 3.3, Prop 4.1, Prop 4.3, and E2: complete, from standard convexity, Parseval, Ramanujan sums and Montgomery–Vaughan.
* Prop 3.4 and §5.2, relative to (6.2), (7.13) and Prop 15.2/15.3 used as stated.
* P14(a), P14(b): complete. P14(c): relative to Theorem C and Prop 15.2.
* E1(i)–(iii): complete. The explicit formula of step 4 was checked numerically to 5.8·10⁻¹⁰.
* F1's converse for D: complete, classical. The forward implications are cited from V7 `03-landau.tex`, read in PR #27.
* Identities I1–I7 (exact finite sums), and the B1 Z[ω] identity (4684 cases).
* Measurements:
  * the copy weights of §2–§4;
  * the PR #14 table, reproduced exactly (A1);
  * the eigenvalue-one counts (A2);
  * the Gram-optimal floor (A3);
  * the toy model and exact Poisson split of §5.3, as model measurements only.
* The X lines of §8.3 and §10, by exact rational arithmetic.

**Unverified or heuristic:**
* J for the angle family at K ≫ D^{1/2} (measured only).
* P14(d) (the multiplier form of the duality for arbitrary realisations), and the column-twist transcription of PR #14's filter (Prop D with S enlarged, not written out).
* The asymptotic reading of the Kloosterman low side (§5.3), and the scaling of the exceptional mass as \|m\|² for random-type phases (measured for one random-phase family only).
* The spectral weights and DFI bookkeeping of §6 (standard but not re-derived here), the off-diagonal circularity, and the metaplectic reading.
* The inference in §8.3 that the Xu–Sang import uses the range 2M ≥ 1 + 3ℓ. It is drawn from the parameter values; Xu–Sang v2 itself was not read, since it is not available offline.
* The one-sidedness remark of §8.2 (parity), which concerns the methods examined only.
* The model prizes (83/96, 0.8676754) and all Λ prices.
* The toy model uses prime columns only (C = 1 pairs) and P < 7⁶, so the good-a⁶ exceptional frequencies are not in range.
* The whole 7/8 paper is unrefereed, and PR #14's boundary is conditional on imported, unverified analytic inputs.

---

## 13. Reproduction

All scripts are in `tmp/`. Run each with `.venv-arb/bin/python` from the repository root.

**From the first version (unchanged):**
* `zf-new-probe-identities.py`: I1–I7, about 4 s. Log: `zf-new-probe-identities.log`.
* `zf-new-probe-copycount.py 3000 1000,3000,10000,30000 10,30,100,300,1000,3000 5,10,20,40 3000`: J for the sextic, angle, additive and Kloosterman families. Log and json: `zf-new-probe-copycount-D3000.{log,json}`.
* `zf-new-probe-kl-toy.py 20000 150000 16,64,256,1024,4096 gauss,kloos,rand`: about 90 s. Log and json: `zf-new-probe-kl-toy-Y20000.{log,json}`. The Y = 3000 run (40 000 rows, four phases) is in `zf-new-probe-kl-toy-Y3000.{log,json}`.
* `zf-new-probe-kl-poisson.py 3000 64,256,1024 gauss,kloos,rand,half` (about 50 s) and `… 8000 256,1024,2048 gauss,kloos` (about 5 min): the exact Poisson split. Logs: `zf-new-probe-kl-poisson-Y{3000,8000}.{log,json}`.
* `zf-new-probe-exponents.py`: X1–X5 bookkeeping of the first version. Log: `zf-new-probe-exponents.log`.

**New in this revision:**
* `zf-new-probe-filter.py [Nmax]` (default 10⁷, 0.7 s): PR #14 filter table reproduction (A1), eigenvalue-one counts (A2), Gram-optimal floor (A3), Z[ω] identity (B1). Log and json: `zf-new-probe-filter.{log,json}`.
* `zf-new-probe-energy.py [NZ]` (default 200 zeros, 13 s; zeros cached in `zf-new-probe-zeros.json`): explicit-formula identity and pole-cancelled block energies for §8.1. Log and json: `zf-new-probe-energy.{log,json}`.
* `zf-new-probe-audit-exponents.py` (< 1 s): the X lines of §8.3 and §10 in exact rationals. Log: `zf-new-probe-audit-exponents.log`.

Library: `tmp/beat78-prop152-restrict-core.py` (Z[ω] arithmetic, sextic symbols, Gauss sums), unchanged.

The first version of this file is `tmp/zf-new-probe-preaudit-version.md`.

The audit sources read are:
* the snapshots `/tmp/atlas-snap-*.md`;
* `git show refs/pr/27:research/rh/foundation/source/03-landau.tex`;
* `git show refs/pr/14:rigorous/mobius_bridge_reduction/{README.md,README.txt,SIGNED_PHASE_FILTER.md,TARGET_0874.md}`.
