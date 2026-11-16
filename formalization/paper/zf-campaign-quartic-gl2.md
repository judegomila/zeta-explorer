# Zero-free campaign, lever "new probe field": quartic (Q(i)) and GL(2) twists, revised against the route-atlas audit

Date: 2026-11-01. Branch `editorial-redesign`. Nothing committed, nothing pushed, nothing sent off the machine.

**Revision note.** This file replaces the draft written at 13:01 today. That draft was produced before the route-atlas audit
(PR #27) was read and does not cite it. This version reads the audit first, cites the atlas section for every overlap,
and adds the audit's levers (PR #14 / Xu–Sang, the V7 floor). The mathematical content kept from the draft was
re-checked: both of its fast scripts were re-run in this session and pass. Section 1 lists what changed.

**Audit read (in full) before anything else:**
* `research/rh/modules/historical-routes.md` (atlas §§1–12 and the review ledger; the snapshot `/tmp/atlas-snap-historical-routes.md` is byte-identical to `git show refs/pr/27:research/rh/modules/historical-routes.md`);
* `research/rh/PUBLICATION_SCOPE_2026-10-30.md`;
* the module notes arithmetic-foundation, spectral-head-theory, signed-complement, whole-even-certificate, spectral-denominator-repair, suzuki-recurrence, prime-memory, finite-suzuki-certificate.

PR #14 was also read from `refs/pr/14`: `rigorous/mobius_bridge_reduction/{README.md, SIGNED_PHASE_FILTER.md, TARGET_0874.md, Mobius_Bridge_Reduction.pdf, signed_phase_filter.py}`.

**Sources:**
* the 7/8 manuscript `~/lean-deps/qrh-verify/paper.txt` and the 11/12 manuscript `~/lean-deps/qrh-verify/paper2.txt` (openai/math family 003; Lean-formalised by their authors; unrefereed);
* prior analysis `src/data/beat-seven-eighths-2026-10-08.js`, `src/data/beat78-prop152-2026-10-09.js`, `src/data/qrh-theta-and-improvement-2026-10-08.js`, `formalization/paper/beat78-*.md`, `formalization/paper/qrh-improvement-attempt-{a,b}.md`.

Equation and lemma numbers such as (12.1), Lemma 15.1 and Prop 3.1 refer to those manuscripts. Xu–Sang v2
(arXiv:2610.15291) is not available offline. It is used only through PR #14's description and exact checkers, and it is
not verified here.

**Labels.**
* **[PROVED]**: complete argument written here.
* **[PROVED-rel]**: proved relative to stated lemmas of the manuscripts or of this note.
* **[EXACT]**: exact rational, integer or cyclotomic computation of a finite statement.
* **[CONDITIONAL]**: valid if the named hypothesis holds.
* **[RECALLED]**: literature statement used without re-derivation.
* **[HEURISTIC]**: exponent counting or a model, not a proof.
* **[NUMERICAL]**: floating-point evidence at toy scale. It is not evidence of an all-scale bound (PUBLICATION_SCOPE: "a finite positive prefix does not prove an all-scale lower bound").

---

## 0. Objective and outcome

**Objective.** Prove a zero-free half-plane Re s > θ′ for ζ with θ′ < 7/8 using a quartic probe field (Q(i), quartic
residue symbols, quartic theta and Suzuki-type metaplectic forms) or a GL(2) twist (Möbius sums twisted by Hecke
eigenvalues). If Xu–Sang v2 is correct, the bar is θ′ < 0.87488665 (atlas §10). The deliverable is a proof, a refutation
of the route, or a precise obstruction.

**Outcome: no rigorous gain. Each probe stops at a precise obstruction (§9).** No zero-free half-plane below 7/8 is
claimed. The atlas states that a zero-free half-plane below 7/8 would be a major theorem, and nothing here comes close
to supplying one.

### Deliverable: per probe

| probe | amplifier cost | mean-square input needed | known? | exponent |
|---|---|---|---|---|
| **Quartic, Framework A** (11/12-paper architecture over Q(i)) | rows p⁴, density 1/4: \|A₁\|² ≼ D·H^{3/4} | Σ_{N(u)≤D^{1+ϑ}} \|A_u\|² ≼ D^{2+ϑ}. This needs either (i) a quartic large sieve M + N + (MN)^c with c ≤ 1/2 at M ≈ N, or (ii) Σ_{N(h)≪H*} \|P_h\|² ≼ D for the μ-absorbed dual, which consists of index-h³ quartic Gauss sums | **open.** Known: c = 2/3 (Blomer–Goldmakher–Louvel Thm 1.3, Heath-Brown cubic shape). The optimal M + N is known only for quadratic symbols (Heath-Brown; Goldmakher–Louvel) | **7/8 (tie)** with the open input; 3/8 + c for 1/2 ≤ c < 5/8; **nothing** with the known c = 2/3 |
| **Quartic with a theta reflection** (biquadratic theta, Suzuki-type forms) | 1/4 | a GL(2)-cover form whose squarefree coefficients lie in the absorbed class y (§4.4) | **no such form**: Kazhdan–Patterson non-uniqueness; Suzuki relates τ(π)², not τ(π), to Gauss sums [RECALLED]. The available reflections have degree ≥ 3 | 7/8 at best (degree 2, hypothetical); θ ≥ 1 for degree 3 or 4 |
| **Quartic Part II** (port of the 7/8 architecture) | density 1/4 plus prime slots of length ℓ | everything above, plus quartic analogues of Lemmas 14.3, 15.1, 17.1, 18.1, Prop 15.2 and the endgame, plus a first stage κ₄ ≤ 3/4 over Q(i) (§6.2) | open | **13/16** at ℓ = 1/6; 0.81233 at Xu–Sang's ℓ; model 0.80986 [all HEURISTIC]. With known tools: nothing |
| **GL(2), spectral rows** (Möbius twisted by λ_g, g in a Kuznetsov family) | density 0 (Lemmas D, E) | Kuznetsov off-diagonal = Möbius in progressions mod c | circular | none (θ = 1) |
| **GL(2) column weights** (target 1/L(s, f ⊗ ·)) | 1/k, unchanged | Rankin–Selberg-type dual of degree 4 | no | none; and no ζ information unless f is Eisenstein |
| **GL(2) Hecke-relation copies** (rows A_m = Σμ(n)λ_f(nm)) | copy density 1, but the rows are parallel | the mean square equals the target | circular | none |
| **Families in which every row carries ζ** (e.g. L(f × f̄)) | signal density 1 | fixed-family mean square ≼ \|F\|·D | RH-strength | circular |
| **V7 floor / one-sided Landau**, applied to all of the above | — | a one-sided bound with p = 2B − 1 | amplifier inputs are sign-symmetric (Lemma S), so no gain; Rankin–Selberg positivity gives a strictly stronger hypothesis (Lemma RS) | none |

### New in this revision

| item | grade | content |
|---|---|---|
| Lemma P | [PROVED] + [EXACT] | Phase-filter duality for every residue degree k. Any residue-character filter that preserves the principal response has eigenvalue one on the whole k-th-power class. That class is also where the amplifier copies, the Prop 15.2 exceptional frequencies and the ζ_F(kz) signal live. This generalises atlas §10's sixth-phase finding. Quartic constants: filter energy 1/3 (sextic 1/5), blind index 4^K (sextic 6^K); matched Euler lines erase half of the quartic phases. PR #14's sextic table is reproduced to 12 digits. |
| Gauss-class ledger over Z[i] | [PROVED-rel] | Cyclic of order 4, generated by y = [γ₁], with [μ] = y². The χ^j-twisted Möbius family has absorbed dual in class y^j: quartic Gauss sums for j = ±1, Möbius again (circular) for j = 2. |
| First-stage dependency | [PROVED-rel] for k = 6, [HEURISTIC] for k = 4 | Part II runs on bins δ ≤ κ ≤ α, with κ = 2β\* − 1 = p and α = 1 − 1/k (§19.2). A quartic Part II therefore needs a quartic Part I at 7/8. That in turn needs the open input, since the 7/8 theorem does not cover Hecke L-functions over Q(i). |
| Lemma S, Lemma RS | [PROVED] | The V7 one-sided reduction cannot lower the exponent of any amplifier argument. Rankin–Selberg positivity replaces the ζ target by a strictly stronger one. |
| Dictionary | [EXACT] | B ↔ θ ↔ p = κ = 2B − 1 (V7 floor, 7/8-paper κ, PR #14 block energy) ↔ α_L = B − 1/2. Xu–Sang's B = 11/12 − ℓ/4 is exactly the 7/8 paper's L1-tight formula with ℓ pushed past 1/6 by 2267/5000000. |

**Λ status.** Nothing in this note changes any Λ value.
* PT Λ ≤ 0.2 stands.
* The values computed from the 7/8 start are unaffected: 0.118505710922701 (Raymond chain) and 0.116091488672439 (route P). The latter is recorded in `papers/lambda-qrh-0.116091` as a computer-assisted upper bound that depends on two unrefereed results: the 7/8 half-plane and Raymond's construction.
* Per atlas §1 and §12, a boundary B for Re ρ is not a bound on Newman Λ. The "Λ prices" below are chain outputs that a *proved* half-plane would feed. They are not bounds.
* RH is open. No QED.

---

## 1. Audit cross-reference (PR #27 atlas)

Every component of this lever was checked against the atlas.

| atlas item | what the atlas records | relation to this lever | what is different here / not repeated |
|---|---|---|---|
| §1 coordinate guide | B (boundary for Re ρ) ≠ Newman Λ; symbols kept distinct | used throughout | Λ appears only as a labelled chain price (§2, §6.6) |
| §§2–8 (twin ladder, information, synchronization, vortices, theta certificates, discrete curvature, twistor/Hankel) | finite certificates and failed sufficient routes for Weil/theta objects | no overlap: this lever is a residue-symbol / automorphic-family construction | none of these is re-attempted. **Name collision:** "theta" here means metaplectic theta functions on covers of GL(2)/GL(3) (Kubota–Patterson). §6's theta certificates concern H_τ / Φ. |
| §9 fixed-support positivity, null-symbol duals | "a negative lower surrogate is not a negative actual form"; signed all-support lower bounds needed | methodological overlap | Our quartic obstruction (c = 2/3 gives nothing; reflection degree 3) is the failure of a *sufficient surrogate*, not evidence that the actual dual mean square is large. The toy numerics (§4.7) indicate the actual quartic dual has optimal size. The gap is proof technology. |
| §10 Möbius energy and the 7/8 boundary; PR #14 | Xu–Sang v2 reaches B = 0.87488665 conditionally; the sixth-phase filter "retains eigenvalue one"; matched Euler lines erase the detector; differentiation restores the removed coefficients; V7 floor p ↔ (1+p)/2; B = 0.874 needs the unproved restricted fourth moment U^{39/40+ε} | **direct overlap** | (a) The filter computation is redone for k = 4, and its eigenvalue-one finding is proved for every k (Lemma P, §5). This tests whether the quartic field escapes §10's obstruction. It does not. (b) Xu–Sang's formula is identified with the 7/8-paper L1-tight formula, and its quartic transplant is computed (§6). (c) The V7 floor is treated as a lever (§7). (d) The restricted fourth moment (H) belongs to the high-side lever (`zf-campaign-high-side.md`) and is not attempted here. Its quartic analogue would be an additional open input (§6.4). |
| §11 curvature cylinder, gamma bulk, Suzuki reserve | a uniform strictly positive scalar margin is the wrong RH target | not used | Every target here is a growth exponent (D^θ, λ^p), never a uniform margin, so §11's caution does not bite. **Name collision:** "Suzuki" in §11 is M. Suzuki's screw function (arXiv 2206.03682). Here it is T. Suzuki's 1983 work on the biquadratic theta series. |
| §12 Newman Λ | statuses; B is not Λ; Rodgers–Tao Λ ≥ 0 | Λ status line above | — |
| arithmetic foundation §2 | one-sided Landau theorem: D(W) ≤ C(1+W)^m e^{αW} ⇒ no zeros in Re s > 1/2 + α | the V7 floor lever | Lemma S (§7.2): amplifier inputs are sign-symmetric, so one-sidedness gains nothing. Lemma RS (§7.3): Rankin–Selberg positivity. |
| arithmetic foundation §4; signed-complement closing | "replacing the centered signed remainder by independent absolute values is not the hypothesis"; "a positive clipping norm discards the cancellation" | same lesson | Lemma D (§3.3): a family-blind (μ-blind) large sieve cannot feed an amplifier. Discarding the Möbius sign structure kills the gain. |
| closing line | open task = "a genuine all-scale signed arithmetic estimate, a cofinal actual-form floor, or an exhaustive theta boundary/collision certificate" | the quartic lever's missing input is a specific all-scale signed arithmetic estimate | It is an optimal balanced-point quartic large sieve, or Lindelöf on average for index-h³ quartic Kubota series. Both are open (§4.6). |
| PUBLICATION_SCOPE | three boundaries (surrogates; summable debt ≠ signed supply; accepted ≠ replayed) | followed | finite numerics are labelled toy-scale; Xu–Sang is not treated as verified |

**Name collision (PR #14).** "Eisenstein rows" in Xu–Sang/PR #14 means rows indexed by Eisenstein *integers* Z[ω]. In §8
(GL(2)), "Eisenstein-series rows" means the continuous spectrum of a Kuznetsov family. The two are unrelated.

**Changes from the 13:01 draft.**
1. Sections 1, 2, 5, 6.2, 7, §4.4 (ledger) and G4 (§8.4) are new.
2. Notation: the dual frequency is now h, not k, because k is the residue degree.
3. The Λ framing has been updated to the 2026-10-19 wording.
4. The quartic Part II value 13/16 is now stated together with its two-layer conditionality (§6.2).

Lemmas Q2–Q4, D and E, Prop Q1, and the toy numerics are retained after re-checking.

---

## 2. Exponent dictionary [EXACT; `tmp/zf-quartic-gl2-dictionary.py`, 28 checks]

One number B describes every zero-free statement that appears in the audit, the manuscripts and this note:

* **B**: zeros have Re ρ ≤ B.
* **θ = B**: the twisted Möbius sum A₁(D) = Σμ(n)ν(n)W(N n/D) is ≪ D^{θ+ε}. This is the Mellin step, §3 of the 11/12 paper.
* **p = 2B − 1**: the V7 floor exponent, ε₀(λ) ≥ −C(1+log λ)^m λ^p (atlas §10). It is also
  * the 7/8 paper's **κ := 2β\* − 1** ((12.1)), and
  * PR #14's block-energy exponent (∫_j^{j+1}\|S\|² ≪ e^{(2B−1)j}).
* **α_L = B − 1/2**: the one-sided Landau exponent of the atlas arithmetic foundation §2.

| source | B | p = 2B − 1 | Λ price (Raymond chain at PT, interpolated) |
|---|---|---|---|
| RH | 1/2 | 0 | — |
| 11/12 paper (Part I, k = 6) | 0.91666667 | 5/6 (= the 7/8-paper bin cap κ ≤ 5/6) | — |
| 7/8 paper (unrefereed) | 0.875 | 3/4 | 0.118506 |
| Xu–Sang first stage (1+κ)/2 | 0.8748875 | κ = 29991/40000 | 0.118473 |
| Xu–Sang v2 retuned by PR #14 (conditional on imported analysis) | 0.87488665 | 0.7497733 | 0.118473 |
| PR #14 Möbius-bridge target | 0.8748 | 0.7496 | 0.118448 |
| PR #14 TARGET_0874 (needs unproved (H)) | 0.874 | 0.748 | 0.118216 |
| sextic architecture, density-hypothesis cap | 13/15 | 11/15 | 0.116095 |
| quartic Framework A ceiling (open input) | 7/8 | 3/4 | 0.118506 |
| quartic Part II transplant, ℓ = 1/6 [HEURISTIC] | 13/16 | 5/8 | 0.099216 |
| quartic transplant at Xu–Sang's ℓ [HEURISTIC] | 0.81232998 | 0.62466 | 0.099159 |
| quartic re-optimised density-1/4 model [HEURISTIC] | 0.80986 | 0.61972 | 0.098330 |

**Exact identities checked.**
* (1+κ)/2 = 69991/80000 with κ = 29991/40000. In the dictionary, Xu–Sang's moment parameter κ is the p of its first-stage boundary, just as the 7/8 paper's κ = 2β\* − 1. Their first-stage mechanism is not known offline.
* 11/12 − ℓ_XS/4 = 17497733/20000000 with ℓ_XS = 2506801/15000000. This is **exactly** the 7/8 paper's L1-tight formula σ₀ = 1 − (1+3ℓ)/12 (beat78-amplifier §4.2). It gives 11/12 at ℓ = 0 and 7/8 at ℓ = 1/6.
* 7/8 − B_XS = (ℓ_XS − 1/6)/4 = 2267/20000000.
  - PR #14's parameter names and endgame constants (b, ℓ, κ, α = 5/6, c = 1/(3κ), δ ∈ [0, 5/6], x ∈ [0, 1/2]) match the 7/8 paper's Lemma 20.2 endgame (beat78-amplifier §5.1).
  - So in exponent terms, Xu–Sang is the 7/8 architecture with the prime-slot length pushed past 1/6 by 2267/5000000 = 4.53·10⁻⁴. The paper's own inequalities cap the re-tune at ℓ ≈ 1/6 + 1.7·10⁻⁴ (σ₀\* = (1507 − 2√921)/1653).
* TARGET_0874 is ℓ = 64/375, giving 437/500.
* If Xu–Sang's imported analysis holds, it moves the chain value by 3.3·10⁻⁵.

---

## 3. Template: Framework A and what a probe field must supply

### 3.1 Framework A in general form

* Residue degree k, a field K ⊇ μ_k, and χ_n(u) = (u/n)_k.
* The family is A_u(D) = Σ_n μ(n)ν(n)χ_n(u)W(N n/D), with rows 0 < N(u) ≤ H = D^λ.

**Amplifier cost [PROVED; 11/12 paper (3.2) with 6 → k].**
* Rows u = p^k with Y/2 < N(p) ≤ Y = H^{1/k} satisfy χ_n(p^k) = 1_{p∤n}. Hence A_{p^k} = A₁ + O(D/Y).
* There are J ≍ Y/log Y such rows. Therefore |A₁|² ≤ (2/J)Σ_{N(u)≤H}|A_u|² + O(D²/Y²).
* A mean square ≼ D·H gives θ_A(k, λ) = 1/2 + (1 − 1/k)λ/2. In particular θ_A(6, 1) = 11/12 and θ_A(4, 1) = 7/8.

**λ ≥ 1 is forced by the dual diagonal [PROVED as bookkeeping; dictionary script (D4)].**
* Poisson in u gives Σ_u|A_u|² ≼ DH + H·Σ_{N(h)≪H*}|P_h(D)|², with H* = D²/H and P_h a normalised dual column sum of length D.
* For λ < 1 the dual diagonal contributes H·H* = D², so |A₁|² ≼ D^{2−λ/k} and θ = 1 − λ/(2k) > 1 − 1/(2k).
* So **Framework A's ceiling is θ = 1 − 1/(2k) for every reflection degree and every sieve**: 7/8 for k = 4, 11/12 for k = 6.
* This is a limit of the duality architecture, not of the truth. Under GRH each |A_u| ≪ D^{1/2+ε} (n ↦ ν(n)χ_n(u) is a Hecke character by reciprocity), so the mean square is ≼ DH for every H. A failed sufficient method is not a failed estimate (atlas §9).

### 3.2 The three mechanisms of the 11/12 proof

1. **(P) Poisson in the row variable.** It produces Gauss sums at the column modulus n. These are twisted-multiplicative in n.
2. **(Abs) Möbius absorption.** μ(n)γ₋₁(n) = (finite)·(Hecke)·(automorphic coefficient). In the sextic case the "−1" at each prime is carried by J(χ², χ²) = −π (paper (4.5)).
3. **(Refl) Reflection.** The cubic-theta automorphy gives dual length N(h)²/X with a *quadratic* reflected twist χ_h³ ((2.13)–(2.14)). The quadratic large sieve then applies without the (ML)^{2/3} term ((2.15); the 11/12 paper explicitly notes that this "avoids the additional term (ML)^{2/3}" of BGL Thm 1.3).

### 3.3 Lemma D: a family-blind sieve cannot feed an amplifier [PROVED]

**Lemma D.**
* Setting: R and N finite, K: R × N → C with |K| ≤ 1, and Σ_{r∈R}|Σ_n a_nK(r,n)|² ≤ Δ‖a‖² for all a.
* Repeated rows: fix r₀ and N₀ ⊆ N with |K(r₀, n)| = 1 on N₀, and let R₀ = {r : K(r, ·) = K(r₀, ·) on N₀}.
* Conclusion: |R₀|·|N₀| ≤ Δ.

*Proof.* Take a = conj(K(r₀, ·))·1_{N₀}. The left side is at least |R₀||N₀|². The right side is Δ|N₀|. ∎

**Corollary D′.** An amplifier fed by a family-blind bound gains nothing. With M₂ = Σ|μ(n)W|² ≍ D and |N₀| ≍ D, the amplified bound is (2/|R₀|)·Δ·M₂ ≥ 2|N₀|M₂ ≍ D², which is the trivial bound.

So the mean-square bound must use the coefficients μ(n). This is the atlas arithmetic-foundation §4 lesson in a different
setting: replacing the signed coefficients by arbitrary ones (absolute values, a family-blind norm) discards exactly the
structure that the estimate needs. `tmp/zf-quartic-gl2-exponents.py` (F) checks it on a toy quartic kernel:
‖K‖² = 3421 ≥ |R₀||N₀| = 730.

### 3.4 Requirements on a probe field

* **(R1) Amplifier.** A positive density of rows reproduces the target. For residue symbols the density is 1/k.
* **(R2) Absorption.** μ(n) times the Poisson kernel is (finite)·(Hecke)·(automorphic coefficient).
* **(R3) Contraction.** The absorbed dual admits a reflection of degree 2, with a reflected twist simple enough for an optimal sieve. Alternatively, an optimal sieve at the balanced point replaces the reflection.

---

## 4. The quartic probe over Q(i)

### 4.1 Set-up

* O = Z[i].
* An odd element is primary if it is ≡ 1 mod (2+2i).
* χ_n(x) = (x/n)₄, ψ(z) = exp(2πi·Tr z), g_j(n) = Σ_{x mod n}χ_n(x)^jψ(x/n), γ_j = g_j/√N(n), α(n) = n/|n|.
* Family: A_u^{(4)}(D) = Σ_n μ(n)ν(n)χ_n(u)W(N(n)/D) over squarefree primary n prime to 2 and to the conductor of ν.

### 4.2 Amplifier cost and the conditional theorem

**Proposition Q1 [PROVED, CONDITIONAL].**
* Hypothesis: for every ϑ > 0 and every smooth W, Σ_{0<N(u)≤D^{1+ϑ}}|A_u^{(4)}(D)|² ≼ D^{2+ϑ}.
* Conclusion: every finite-order Hecke L-function over Q(i), and every Dirichlet L-function, is zero-free in Re s > 7/8.

*Proof.*
1. Rows u = p⁴, Y = H^{1/4}. Then |A₁|² ≼ D^{1+ε}H^{3/4} + D²H^{−1/2}, so A₁ ≪ D^{7/8+3ϑ/8+ε}. Let ϑ → 0.
2. The Mellin argument of §3 of the 11/12 paper continues 1/L^S(s, ν) to Re s > 7/8 + 3ϑ/8. It is field-independent.
3. L_{Q(i)}(s, χ∘N) = L(s, χ)L(s, χχ₋₄). The only possible pole–zero cancellation at s = 1 is excluded by L(1, χ₋₄) = π/4. ∎

**Consequence.** The quartic Framework A can at best **tie** 7/8.

### 4.3 Absorption and the index flip [PROVED; `tmp/zf-quartic-gl2-identities.py`, re-run: ALL CHECKS PASS, 10 s]

**Lemma Q2 (quartic Gauss–Jacobi).** Let n be squarefree primary and odd, and π a primary prime.
* (a) J(χ_π, χ_π) = −χ_π(−1)π.
* (b) γ₁(π)² = μ(π)χ_π(−1)α(π)γ₂(π).
* (c) γ₂(a + bi) = (−1)^{b/2} at split π, and γ₂(−q) = 1 at inert π = −q. γ₂ is completely multiplicative on squarefree primary n, so it is a character of (Z[i]/4)^×.
* (d) γ_j(ab) = γ_j(a)γ_j(b)(χ_a(b)χ_b(a))^j, with (χ_a(b)χ_b(a))² = 1 by quartic reciprocity.
* (e) μ(n)γ₋₁(n) = conj(α(n))·conj(γ₂(n))·γ₁(n).

*Proof.*
* (a) is the classical evaluation.
* (b) follows from g(χ)² = J(χ, χ)g(χ²).
* (c): Z[i]/π ≅ F_p and ψ(t/π) = e(2at/p), so g₂ = (2a/p)√p.
  - (a/p) = (p/|a|) = (b²/|a|) = 1 by quadratic reciprocity (p ≡ 1 mod 4, p = a² + b²).
  - (2/p) = (−1)^{b/2}, since p ≡ 1 + b² mod 8.
  - Inert π = −q (q ≡ 3 mod 4): Z[i]/q ≅ F_{q²}, Frobenius is complex conjugation, and ψ(x/π) = e(−Tr_{F_{q²}/F_q}(x)/q).
    The quadratic character of F_{q²} is η_q∘N and η(−1) = 1, so by the Davenport–Hasse lifting theorem g₂ = −(g_{F_q})² = −(i√q)² = q.
    Hence γ₂(−q) = q/N(π)^{1/2} = 1. (I4) checks this numerically.
* (e) holds at primes by (b) and |γ₁| = 1. It is exactly multiplicative by (d), because conj(c)²c = conj(c) for c = ±1. ∎

Numerical checks (max errors): (I1) 0; (I2) 6.2e−15; (I3) 4.9e−15 at 116 split and 9 inert primes, and 2.5e−14 at 433 squarefree composites; (I7) quartic reciprocity on 6246 ordered prime pairs, 0 failures.

**Lemma Q3 (index flip) [PROVED].** μ(n)·g(χ_n, h) = α(n)γ₂(n)·g(conj χ_n, h³) for h prime to n.
(Check (I8): 20 cases, max error 1.4e−15.)

**Lemma Q4 (parity) [PROVED].** No identity g(χ⁻¹) = c·g(χ²)^e with c ∈ Q(i), e ∈ Z holds, because Galois invariance would need χ(b)^{1+2e} = 1 for all b. The mixed ratio g(χ⁻¹)g(χ²)/g(χ) = μ(π)conj(π) ∈ Z[i].

**The quartic Poisson dual.**
* After Poisson in u, separation of the finite-modulus reciprocity factor and Cauchy–Schwarz (the quartic transcription of §4 of the 11/12 paper; sketched, not written out):

  Σ_{N(u)≤H}|A_u|² ≼ DH + H·Σ_{N(h)≪D²/H}|P_h(D)|²,
  P_h(D) = D^{−1/2}Σ*_{N(n)≍D} α(n)γ₂(n)ξ(n)·g(conj χ_n, h³)/√N(n)·U(N(n)/D).

### 4.4 The Gauss-class ledger over Z[i] [PROVED-rel; new]

**Setting.**
* Let 𝒮 be the set of squarefree primary n coprime to a fixed finite set.
* Let 𝓗 be the group of unimodular functions on 𝒮 of the form λ·φ, with λ the restriction of a Hecke Grössencharacter of Q(i) and φ periodic in n modulo a fixed modulus.
* Write [f] for the class of f modulo 𝓗.

**Lemma L4.**
* (i) The classes of γ₁, γ₂, γ₃ and μ generate a cyclic group of order 4 with generator y = [γ₁]:
  - [γ_t] = y^{2−t} (t mod 4), so [γ₂] = 1 and [γ₃] = y⁻¹;
  - [μ] = y².
* (ii) The Poisson coefficient μγ₋ⱼ of the χ^j-twisted Möbius family has class y^j:
  - j = ±1 (rows p⁴, density 1/4) lands on quartic Gauss sums;
  - j = 2 (rows p², density 1/2) lands on [μ], so the dual is a Möbius family again (circular).

*Proof.*
1. **[γ₂] = 1** by Lemma Q2(c).
2. **[γ₃] = [γ₁]⁻¹.** γ₃ = γ₋₁ = χ_n(−1)·conj(γ₁), with |γ₁| = 1. And χ_n(−1) = (−1)^{(N n−1)/4} is periodic.
3. **[γ₁]² = [μ].** By Q2(b) and Q2(d), γ₁(n)² = μ(n)χ_n(−1)α(n)γ₂(n) on 𝒮. Both sides are multiplicative on squarefree n because (χ_a(b)χ_b(a))² = 1. Here α is a Grössencharacter, and χ_n(−1) and γ₂ are periodic.
4. **[μ] ≠ 1.** Suppose μ = λφ, with φ q-periodic and q a multiple of the conductor of λ's finite part.
   * Take primary primes π₁ ≠ π₂ ≡ 1 mod q. Then φ(π₁) = φ(π₂) = φ(π₁π₂) = φ(1).
   * μ(π_i) = −1 and μ(π₁π₂) = +1 give λ(π_i) = −1/φ(1) and 1/φ(1)² = 1/φ(1). So φ(1) = 1, and λ(π) = −1 for every prime π ≡ 1 mod q.
   * For such π, λ(π) = (π/|π|)^m·N(π)^{iτ}, a unitary Grössencharacter evaluated on generators ≡ 1 mod q. If (m, τ) = (0, 0) this is 1.
   * Otherwise, by the prime ideal theorem for Hecke L-functions [STANDARD], the average of λ(π) over primes π ≡ 1 mod q with N(π) ≤ x tends to 0 (m ≠ 0) or has modulus → 1/|1 + iτ| < 1 (m = 0, τ ≠ 0). It is therefore not constantly −1. Either way we have a contradiction.
5. Hence y has order exactly 4, since y⁴ = [μ]² = 1 and y² ≠ 1.
6. For (ii): [μγ₋ⱼ] = y²·y^{2+j} = y^j. ∎

**Comparison.**
* Over Z[ω] the same ledger is cyclic of order 6, generated by x = [γ₂] (the class of cubic Gauss sums = Patterson cubic theta coefficients), with [μ] = x³ (`zf-campaign-cubic-field.md`, Thm 3.3). The sextic twist j = ±1 lands on x^{±1}, a class with a GL(2) theta.
* Over Z[i] the reachable non-circular classes are y^{±1}, the quartic Gauss sums themselves. Absorption lowers the metaplectic order 6 → 3 in the sextic case. In the quartic case it leaves the order at 4.
* The dictionary script (D5) records the bookkeeping. The mathematics is the lemma.

**Suzuki-type forms [HEURISTIC consistency, RECALLED input].**
* As recalled (not re-checked offline): T. Suzuki (1983) relates τ(π)², not τ(π), of the biquadratic theta series to quartic Gauss sums, and Eckhardt–Patterson (1992) report that τ(π) itself is not given by Gauss sums.
* In the ledger, [τ]² = y^{±1}, and an odd power of the generator has no square root in Z/4. So τ's class lies outside ⟨y⟩, consistent with Eckhardt–Patterson.
* To reach the absorbed class y from biquadratic theta coefficients one needs τ², a *quadratic* expression in GL(2)-cover coefficients. Its natural L-function has degree 3 (symmetric-square type) or 4 (Rankin–Selberg type).
* So Suzuki-type forms land in degree ≥ 3, as do the other two heuristics of §4.5.

### 4.5 The reflection degree, and why the conclusion does not depend on it

Three independent heuristics put the absorbed quartic dual (index h³) at degree 3:
1. **Claim K [RECALLED: Kubota 1969, Patterson 1977].** The Kubota series ψ(s, r) = Σ_c g(r, c)N(c)^{−s} of the 4-fold cover has a functional equation with conductor N(r). At r = h³ this is N(h)³.
2. **Kazhdan–Patterson [RECALLED].** On GL(r) the theta representation is distinguished only for n ∈ {r, r+1}. The natural home of n-th order Gauss sums is the n-fold cover of GL(n − 1). For quartic sums that is GL(3), degree 3. For cubic sums it is GL(2), degree 2.
3. **Suzuki's τ² (above).** It gives a symmetric-square-type object, degree 3.

A degree-r reflection shortens the dual only for λ > 2 − 2/r (dictionary (D6)):
* r = 2 (hypothetical): λ > 1, θ_A = 7/8.
* r = 3: λ > 4/3, θ_A = 1.
* r = 4: λ > 3/2, θ_A = 17/16.

**Robust conclusion [PROVED as bookkeeping, §3.1].** Framework A's ceiling θ = 1 − 1/(2k) = 7/8 holds for *every* reflection degree and sieve. So the quartic Framework A cannot go below 7/8 whatever the true conductor is. The draft's conductor measurement (`tmp/zf-quartic-gl2-conductor.py`) was inconclusive. It is not needed.

### 4.6 The mean-square input that would be needed, and its status

Without a degree-2 reflection, the dual must be bounded by a large sieve over (h, n) applied to fourth-power-free h. The
rows h = m⁴h₀ repeat h₀; by Lemma D they must be treated separately, through the polar terms of §4.7 (N1). For a sieve of
shape M + N + (MN)^c the optimum is λ = 1 (exponents script (B2), exact):

  θ_quartic(c) = 7/8 for c ≤ 1/2;  3/8 + c for 1/2 ≤ c < 5/8;  trivial (≥ 1) for c ≥ 5/8.

**Known [RECALLED; the bibliographies of both manuscripts confirm what they use].**
* BGL Theorem 1.3 (ref. [4] of the 7/8 paper, [5] of the 11/12 paper): the n-th order large sieve with M + N + (MN)^{2/3}, the shape of Heath-Brown's cubic sieve.
* The 7/8 paper's Lemma 9.1 runs the sextic version with (KD)^{2/3} via the BGL recursion.
* So the quartic sieve with c = 2/3 is available, and it gives **nothing**.
* The optimal (M + N)^{1+ε} is known only for quadratic symbols: Heath-Brown 1995; Goldmakher–Louvel over number fields.
* To my knowledge no c < 2/3 is known at M ≈ N for any order n ≥ 3 in the symmetric residue-symbol family. Gao–Zhao's quartic sieve concerns quartic Dirichlet characters over Q; its shape was not re-checked offline.

**Needed (either one; both open).**
* (i) A quartic large sieve over Z[i] with c ≤ 1/2 at M ≈ N. This is equivalent at the balanced point to the conjectured optimal bound.
* (ii) Σ_{N(h)≪D^{1−ϑ}}|P_h(D)|² ≼ D for the index-h³ Gauss-sum family. This is Lindelöf on average for the index-h³ Kubota series.

In the atlas's terms, (i) and (ii) are "genuine all-scale signed arithmetic estimates": (ii) keeps the actual coefficients
α γ₂ ξ.

### 4.7 Numerical evidence that the actual input is true [NUMERICAL, toy scale; draft outputs, not re-run]

The output is `tmp/zf-quartic-gl2-meansquare.out` (run: `meansquare.py 300000 4000 4000`, 95 s).

* **(N1) Theta poles.** Over squarefree primary c with N(c) ≤ 3·10⁵, Σ conj χ_c(r)γ₁(c) grows like X^{3/4} (slopes 0.73–0.76) for r ∈ {i, i³, (1+i)²·units, (1+i)³·units}. This is the theta pole of the quartic Kubota series (Patterson type). For the actual dual coefficient conj(α)conj(γ₂)γ₁ the slope is 0.41: no main term is detected.
* **(N2) Mean square.** For the quartic analogue of Prop 3.1 at D = 4000, mean square/(#rows·#cols) = 0.849, 0.861, 0.888, 0.897 for H/D = 1/4, 1/2, 1, 2. That is square-root cancellation on average.
* **(N3) Dual sieve constant.** The effective sieve constant of the quartic dual is 0.08–0.80 times (R + C) for H = X^{1/2}…X, with no (RC)^{2/3} growth. Random coefficients give the same ratios.

Per atlas §9, the failure of the *surrogate* (the BGL bound) says nothing against the actual mean square. At this scale
the actual mean square behaves optimally. These are finite toy measurements, not an all-scale statement.

---

## 5. The quartic phase filter and Lemma P (atlas §10) [new; `tmp/zf-quartic-gl2-phasefilter.py`, 50 checks, ALL CHECKS PASS, 1 s]

Atlas §10 records that PR #14's sixth-phase filter F(ξ) = (ξ + … + ξ⁵)/5 has zero mean and energy 1/5, but that "the
simultaneous local sixth-power residue subspace retains eigenvalue one". The question for this lever is whether the
quartic probe field escapes that obstruction.

### 5.1 Lemma P (phase-filter duality, every residue degree) [PROVED]

**Setting.**
* k ≥ 2, P a finite set of primes p ≡ 1 mod k, M = Π_{p∈P} p, and χ_p a character of (Z/p)^× of exact order k.
* A residue-character filter is any A(n) = Φ((χ_p(n))_{p∈P}) on (Z/M)^×, with Φ: μ_k^P → C arbitrary.
* T is the convolution operator on Z/MZ with Fourier multiplier A (zero at non-units, as in PR #14 §5).

**Lemma P.** If Φ(1, …, 1) = 1 (the principal response is preserved), then:
* (a) A(u^k n) = A(n) for all units u, n.
* (b) A ≡ 1 on G_k = ((Z/M)^×)^k = {n : χ_p(n) = 1 ∀p}, a subgroup of order Π(p−1)/k and index k^{|P|}.
* (c) ‖T‖ ≥ 1, and eigenvalue one has multiplicity ≥ Π(p−1)/k. For the balanced filter F_k(ξ) = (ξ + … + ξ^{k−1})/(k−1), the eigenvalue-one set is exactly G_k.

*Proof.*
* (a): χ_p(u^k) = 1.
* (b): (Z/p)^× is cyclic of order divisible by k, so ker χ_p (index k) equals the k-th powers. By CRT, G_k = Π ker χ_p, and A = Φ(1, …, 1) = 1 there.
* (c): the multiplier values are the eigenvalues. For F_k with k ≥ 3, |F_k(ξ)| = 1/(k−1) < 1 for ξ ≠ 1, so |A(n)| = 1 forces every phase to be principal. ∎

**Optimality** (as PR #14 §2, every k). Among filters with F(1) = 1 and zero phase average, the minimum mean squared
modulus is 1/(k−1), attained only by F_k.

### 5.2 One class, four roles

The k-th-power class G_k (globally: μ_k·(K^×)^k) is simultaneously:
1. the **amplifier copies** of Framework A (χ_n(p^k) = 1, §3.1);
2. the **exceptional frequencies** h = a^k e of the additive Gram bound, Prop 15.2 (Gram coefficient identically 1; `beat78-prop152` S2);
3. the source of the **signal**: the pole of ζ_F(kz) at z = 1/k comes from summing over a^k, and its residue survives iff ξ^k = 1 (`beat78-prop152` S5);
4. the **eigenvalue-one subspace** of every principal-preserving residue-character filter (Lemma P). PR #14's subspace is the local shadow of the global k-th powers.

So the atlas §10 finding is a third, independent manifestation of the duality obstruction (exceptional term ⇔ signal).
**It does not depend on k.** Changing the field from Q(√−3) to Q(i) changes only the index of the class.

### 5.3 Quartic constants (exact, computed in Q(ζ_k) with Fractions)

| quantity | k = 4 (Q(i)) | k = 6 (PR #14) | general k |
|---|---|---|---|
| optimal principal-preserving filter energy | **1/3** | 1/5 | 1/(k−1) |
| blind subgroup index for K primes | **4^K** | 6^K | k^K |
| matched Euler line (1 − ξ̄t)/(1 − ξt): phases erased | ξ = ±1: **half** of the phases | ξ = ±1: one third | the real k-th roots |
| \|ξ − ξ̄\|² on the other phases | 4 | 3 | 4 sin²(2πj/k) |
| phase average of \|coefficient\|² | 2 | 2 | 2 (k ≥ 3) |
| derivative coefficient m ξ^m − (m−1)ξ̄ξ^{m−1} | ξ^m at ξ = ±1; phase average 2m² − 2m + 1 | same | same (k ≥ 3) |

* The local algebra was checked for k = 3, 4, 6, 8, 12 and m = 1…12.
* Quartic filter energy / sextic = 5/3 exactly.
* In the quartic case the matched lines erase exactly the "quadratic-residue" phases (ξ² = 1). The derivative restores the removed coefficients, as atlas §10 records for k = 6.

### 5.4 Integer-row diagnostics (PR #14 §7 format, rational integer rows, primes p ≡ 1 mod k up to 400) [EXACT]

| N | k = 6 mean square of A (= PR #14, reproduced to 12 digits) | k = 6 signed off-diagonal | **k = 4 mean square of A** | k = 4 signed off-diagonal |
|---|---|---|---|---|
| 1,000 | 0.008622176771 | 0.003267728269 | 0.013353055758 | 0.004481454427 |
| 10,000 | 0.005640593134 | 0.000314179693 | 0.009442999757 | 0.000582826069 |
| 100,000 | 0.005340472462 | 0.000014788605 | 0.008871882964 | 0.000012708384 |
| 200,000 | 0.005331929730 | 0.000006252155 | 0.008863317913 | 0.000004172551 |
| complete period | 0.005325611397 | — | 0.008859069041 | — |

* Both prime sets have K = 37 (k = 6: 7…397; k = 4: 5…397).
* The general-k interval bound (1/N)Σ|A|² ≤ 1/((k−1)K) + ((k−2)/(k−1))√P(1+log P)/(KN) + (1 − 1/K)P(1+2 log P)/N (PR #14 §4 with 5 → k − 1, from f² = (1/(k−1))1 + ((k−2)/(k−1))f) holds at every N.
* Lemma P was brute-forced:
  - k = 4, M = 5·13·17: eigenvalue one on exactly 12 of 768 units, the fourth powers;
  - k = 6, M = 7·13·19: 6 of 1296 units;
  - random filters with principal value 1 equal 1 on every k-th power and are invariant under n ↦ u^k n.

### 5.5 Conclusion for the quartic field

The quartic probe does not escape atlas §10's obstruction. Lemma P is k-independent, and the quartic constants are
worse: filter energy 1/3 vs 1/5, and the blind class has index 4^K vs 6^K. The larger blind class is the same thing as the
larger amplifier density (1/4 vs 1/6), so the gain and the obstruction move together.

---

## 6. Part II port (7/8 architecture) and the Xu–Sang lever

### 6.1 The L1-tight formula and its transplant

* For k = 6 (beat78-amplifier §4.1–4.2, from Def. 10.1, (10.3), Prop 15.2–15.3): σ₀ = 1 − h/6 + b/12. On M + ℓ = 1 this is **σ₀ = 1 − (1+3ℓ)/12 = 11/12 − ℓ/4**, which is Xu–Sang's B formula (§2).
  - It reproduces the paper's displayed exponents at ℓ = 0 (11/12) and ℓ = 1/6 (7/8). At other ℓ it is an extrapolation of the displayed formulas (beat78-synthesis R1).
  - Xu–Sang's admissibility system, as checked exactly by PR #14, is consistent with it at ℓ_XS.
* Transplanted to residue degree k [HEURISTIC]:
  - the low-side exceptional loss becomes P_a^{1/k};
  - the signal becomes the ζ_F(kz) pole at z = 1/k;
  - the row-count slope becomes α_k = 1 − 1/k;
  - the asymmetry b still cancels on M + ℓ = 1;
  - result: **B_k(ℓ) = 1 − (1+3ℓ)/(2k)**, with dB/dℓ = −3/(2k).
* Quartic values:
  - B₄(0) = 7/8 (Part I alone ties);
  - B₄(1/6) = 13/16;
  - B₄(ℓ_XS) = 0.81232998;
  - B₄(64/375) = 0.811;
  - the re-optimised density-1/4 model of beat78-amplifier §6 gives 0.80986.
* Xu–Sang's increment ℓ_XS − 1/6 would be worth 1.70·10⁻⁴ at k = 4 against 1.13·10⁻⁴ at k = 6 (slope ratio 3/2). This is negligible next to the density effect, 7/8 − 13/16 = 1/16.

### 6.2 First-stage dependency [PROVED-rel for k = 6; HEURISTIC for k = 4; new]

**Sextic case (from the text).**
* Part II is a contradiction argument at β\* > target, with κ := 2β\* − 1 ((12.1)).
* Its bins satisfy δ ≤ κ ≤ α = 5/6 (§19.2: "α is the fixed slope from sixth-power amplification … Equation (12.2) gives δ ≤ κ ≤ α"). The cap κ ≤ 5/6 comes from Part I (β\* ≤ 11/12).
* The endgame certificate (Lemma 20.2, and the Xu–Sang/PR #14 certificate) lives on 0 ≤ δ ≤ 5/6, and the count formula (20.8) contains the factor (α − δ).

**General k.**
* The Framework A Part I gives exactly κ ≤ 2(1 − 1/(2k)) − 1 = 1 − 1/k = α_k. The first stage supplies precisely the bin cap the second stage runs on.
* So a quartic Part II needs κ₄ ≤ α₄ = 3/4, i.e. β\* ≤ 7/8 **for Hecke L-functions over Q(i)**.

**Quartic case.**
* The 7/8 theorem does not supply this cap. Its family is the Hecke characters of Q(√−3) and their Dirichlet transfers (Prop 11.3). Quartic Hecke characters of Q(i) (dihedral forms induced from Q(i)) are not covered.
* The quartic first stage is the quartic Part I, which needs the open input of §4.6. With the known BGL sieve there is no first stage at all (κ₄ ≤ 1 only; dictionary (D4)).
* **The quartic Part II is conditional at two layers:** on the open balanced-point input for Part I, and again on the same input in every reflection-based Part II estimate.

### 6.3 Inputs a quartic Part II would need

Quartic analogues of:
* the marked reflection and reflected energy (Prop 5.1, Lemmas 14.3, 15.1); reflection-based, so they need §4.6 (i) or (ii);
* the inverse moment (Lemma 17.1) and the fourth moments (Lemma 18.1);
* the fourth-power amplification of rows (Lemma 17.6 with e(r) = max{1, (1 + 3r)/4});
* the exceptional term (Prop 15.2 with P_a^{1/4});
* the row counts (Prop 9.2/19.2). These port with the known BGL shape, as Lemma 9.1 already does for k = 6;
* a new rational endpoint certificate in the style of Lemma 20.2.

### 6.4 The restricted fourth moment

PR #14's TARGET_0874 shows that ℓ = 64/375 needs the open hypothesis (H): Σ_{u∈𝓑}|S_m(u)|⁴|Q_sel(u)|² ≪ U^{39/40+ε} on
the detected class. A quartic Part II pushed past its own re-tune ceiling would need a quartic (H) as well. Nothing about
the quartic field helps with (H): its difficulty is the joint detector/numerator correlation, not the residue degree. It is
left to the high-side lever.

### 6.5 Duality persists

The quartic exceptional coset exists exactly when ξ⁴ = 1, which is also the condition for the ζ_F(4z) pole that carries
the signal (§5.2). The quartic field changes the density, not the duality.

### 6.6 With known tools; Λ prices

* With known tools, crude transfer [HEURISTIC]: under the degree-3 structure the quartic Part I gives h_eff = 0, and the Part II length gain gives 15/16. Nothing.
* Λ prices of unproved half-planes (dictionary (D7)):
  - 13/16 → 0.099216;
  - 0.80986 → 0.098330;
  - 7/8 → 0.118506.

---

## 7. The V7 floor / one-sided Landau lever (audit item) [new]

### 7.1 What the lever offers

Atlas §10 and arithmetic foundation §2 say that a **one-sided** bound suffices. A floor ε₀(λ) ≥ −C(1+log λ)^m λ^p, or
D(W) ≤ C(1+W)^m e^{α_L W}, gives no zeros in Re s > (1+p)/2 = 1/2 + α_L.

The same Landau argument works for Möbius sums [PROVED, standard]. Write m(W) = Σ_{n≤e^W}μ(n)(W − log n).
* Its Laplace transform is 1/(q²ζ(q)), which is holomorphic near every positive real q (ζ ≠ 0 on (0, 1) and 1/ζ has a zero, not a pole, at 1).
* So m(W) ≤ C(1+W)^k e^{αW} already gives no zeros in Re s > α.

The question is whether a quartic or GL(2) family can produce a one-sided bound more cheaply than a two-sided one.

### 7.2 Lemma S (sign-blindness) [PROVED]

**Lemma S.** Let 𝒞 be the set of configurations (coefficient vectors a, row values A_u) consistent with a list of
inputs, each of which is invariant under a ↦ −a: mean squares, large-sieve inequalities, copy relations A_{um^k} − A_u =
O(·), Gram bounds, |·| lower bounds on signals. Then 𝒞 = −𝒞. Hence sup_𝒞 Re A₁ = sup_𝒞 (−Re A₁), and any one-sided
bound derivable from these inputs alone is also a two-sided bound.

*Proof.* Every input is invariant under negation of the whole configuration. ∎

**Consequence.**
* Every amplifier argument here (Framework A, the Prop 15.3 Gram step, Lemma 17.6) and the Framework B contradiction (which compares |I_η| from the low and high sides) uses only sign-invariant inputs.
* So the V7 one-sided relaxation cannot lower the exponent they reach, for the sextic, quartic or GL(2) families.
* A one-sided gain needs an input that distinguishes a from −a: a positivity statement or a main term with known sign.

### 7.3 Are such inputs available? [PROVED implication + RECALLED]

**Sieve.** A sieve gives upper bounds for primes only up to a constant factor ≥ 2 (Selberg's parity barrier [RECALLED]).
The floor needs the main term 4√x to be correct to a power saving. No sieve input applies.

**Lemma RS (Rankin–Selberg positivity).**
* Setting: π a unitary cuspidal representation of GL(2)/Q, unramified at every finite prime (level one, so non-dihedral).
  - At every p the coefficient of p^{−js} in −L′/L(s, π×π̃) is log p·|α₁^j + α₂^j|² ≥ 0.
  - L(s, π×π̃) = ζ(s)L(s, Ad π), with L(s, Ad π) entire (Gelbart–Jacquet) [STANDARD].
  - Σ_{n≤x}Λ_{π×π̃}(n) ≪ x, so the discrepancy is O(e^{W/2}) as in the arithmetic foundation.
* Statement: a floor ψ_{π×π̃}-discrepancy ≥ −C(1+W)^m e^{α_L W} implies L(s, π×π̃) ≠ 0 for Re s > 1/2 + α_L. In particular ζ and L(s, Ad π) are both zero-free there.

*Proof.*
* Run the arithmetic-foundation §2 argument with f = P + D ≥ 0.
* Nonreal zeros: as there.
* A real zero β₀ > 1/2 + α_L would give the transform a real pole with residue −m/q₀² < 0.
* A nonnegative function's Laplace transform cannot have a negative-residue pole at its real abscissa, and cannot be holomorphic there either (Landau). That is a contradiction. ∎

**Consequence.** The hypothesis is strictly stronger than what the ζ statement needs: it also forces L(Ad π) to be
zero-free. Routing through GL(2) positivity replaces the target by a harder one.

### 7.4 Conclusion

The V7 floor is a correct and useful reformulation (atlas arithmetic foundation §2). But neither the quartic nor the
GL(2) family supplies a one-sided input. Lemma S covers every sign-invariant argument, and the available one-sided inputs
are either lossy (sieve) or stronger than the target (Lemma RS). **No gain.**

---

## 8. GL(2) twists (re-checked from the draft; G4 is new)

### 8.1 G1: Hecke eigenforms as rows (Möbius twisted by λ_g, g in a Kuznetsov family)

**Mean square [RECALLED, Deshouillers–Iwaniec].** The family-blind optimal bound is (T² + N)^{1+ε}‖a‖².

**Amplifier: density 0.**
* By Lemma D, a set of rows agreeing with one row on ≍ D columns has size ≪ (T² + D)^{1+ε}/D = D^ε at T² ≍ D.
* No cusp form has λ_g ≡ 1.

**Lemma E [PROVED].**
* Write A_t(D) = Σμ(n)τ_{it}(n)W(n/D). Then A_t(D) = (2πi)⁻¹∫Ŵ(w)D^w G_t(w)/(ζ(w−it)ζ(w+it))dw, where G_t(w) = Π_p(1 − p^{−2w}/((1 − p^{−w+it})(1 − p^{−w−it}))) is holomorphic and bounded in Re w ≥ 1/2 + δ, uniformly in t.
* A zero ρ enters only through w = ρ ± it, with the factor Ŵ(ρ ± it) = O((1 + |γ ± t|)^{−A}).
* So only Eisenstein-series rows with |t ∓ γ| ≪ D^ε see ρ. That set has t-measure D^ε, and the sieve then gives only the trivial bound.

**Beyond the diagonal.**
* The Kuznetsov off-diagonal involves Σμ(n₁)μ(n₂)S(n₁, n₂; c)(…).
* μ enters through its distribution in residue classes mod c ≲ D/T, and a power saving there is a zero-free statement for Dirichlet L-functions mod c. This is circular.
* Davenport's uniform bound saves only (log x)^{−A}.
* (R2) fails: the Kuznetsov dual is additive in n, while Poisson in the row variable gives twisted-multiplicative Gauss sums.
* Same verdict as the spectral entry of `zf-campaign-new-probe.md`.

**Exponent: none.**

### 8.2 G2: a GL(2) eigenvalue as a column weight (target 1/L(s, f ⊗ ·))

* Absorption still works, but λ_f survives. The dual column is λ_f(n)·(class-x or class-y coefficient)·χ_n(h).
* This is a Rankin–Selberg-type product of degree 4. Its reflection contracts only for λ > 3/2, where θ_A = 9/8 (k = 6) or 17/16 (k = 4) [HEURISTIC length count].
* There is no ζ information:
  - for Eisenstein f, L(s, f) = ζ_F(s)², with the same zeros;
  - for f dihedral from E, the family is the Hecke family over E again (§4 when E = Q(i));
  - for f cuspidal non-dihedral, the conclusion would concern L(s, f), not ζ.
* No GL(2) form can replace the cubic theta (G0): non-metaplectic Hecke eigenvalues are multiplicative, while μγ₋₁ is twisted-multiplicative with equidistributed arguments [RECALLED, Heath-Brown–Patterson].
* "Möbius–Hecke orthogonality" results (Σμ(n)λ_f(n)e(nα) ≪ x·exp(−c√log x), Fouvry–Ganguly type [RECALLED]) are log-power savings from classical zero-free regions of L(s, f ⊗ χ). They carry no power saving and no ζ information.

**Exponent: none.**

### 8.3 G3: families in which every row carries ζ

* Take A_f = Σ μ_{f×f̄}(n)W(n/D), where L(f × f̄) = ζ·L(sym² f).
* Fixed family [PROVED]: Σ_{g∈F}|A_g|² ≼ |F|·D gives A_f ≪ D^{1/2+ε}, which gives RH. So the needed input has RH strength.
* In one-sided form this is Lemma RS (§7.3).

**Circular.**

### 8.4 G4: Hecke-relation copies [PROVED; new]

**Copies.** Let f be a level-one Hecke eigenform and A_m = Σ_n μ(n)λ_f(nm)W(n/D).
* For a prime ℓ ∈ (L, 2L] and ℓ ∤ n, Hecke multiplicativity gives λ_f(nℓ) = λ_f(ℓ)λ_f(n).
* The terms with ℓ | n number ≪ D/L, and |λ_f| ≪ τ by Deligne.
* So A_ℓ = λ_f(ℓ)·A₁ + O(D^{1+ε}/L): every prime row is a scalar copy of the target.

**But they are parallel vectors.**
* Σ_ℓ|A_ℓ|² = |A₁|²Σ_ℓ|λ_f(ℓ)|² + O(·). So an upper bound B on the mean square is equivalent, up to the error term, to |A₁|² ≲ B/Σ|λ_f(ℓ)|².
* No bound on B is available that does not already bound A₁: the rows carry no orthogonality.
* Amplification needs copies *and* near-orthogonality across the family (G1 of `zf-campaign-new-probe.md`). Hecke relations supply the first and none of the second.

**Circular.**

---

## 9. Obstructions (precise)

* **O-Q1 (ceiling) [PROVED as bookkeeping].** Framework A over Q(i) cannot go below 1 − 1/(2·4) = 7/8, for any reflection degree or sieve (§3.1, §4.5). It ties 7/8 only with an open input.
* **O-Q2 (input) [RECALLED status].**
  - Tying 7/8 needs either a balanced-point quartic large sieve with c ≤ 1/2, or Lindelöf on average for index-h³ quartic Kubota series. Both are open.
  - Any nontrivial quartic exponent needs c < 5/8.
  - Known: c = 2/3 (BGL), which gives nothing.
* **O-Q3 (no degree-2 reflection) [PROVED-rel + RECALLED].**
  - By Lemma L4 the absorbed dual sits in the quartic Gauss-sum class y^{±1}.
  - The available homes of that class have degree ≥ 3: Kubota at index h³, the GL(3) 4-fold theta, and Suzuki's τ² (τ itself lies outside ⟨y⟩).
  - A GL(2)-cover form with class-y coefficients is excluded by Kazhdan–Patterson non-uniqueness [RECALLED].
* **O-Q4 (duality) [PROVED, Lemma P].**
  - Every principal-preserving residue-character filter has eigenvalue one on the k-th-power class, for every k.
  - That class carries the signal, the copies and the exceptional frequencies.
  - The quartic constants are worse than the sextic ones (1/3 vs 1/5; 4^K vs 6^K).
  - Atlas §10's sixth-phase result is the k = 6 instance.
* **O-Q5 (two-layer conditionality) [PROVED-rel for k = 6, HEURISTIC for k = 4].**
  - A quartic Part II needs κ₄ ≤ 3/4 over Q(i), i.e. the quartic Part I at 7/8. The 7/8 theorem does not supply it.
  - Every reflection-based Part II estimate then needs O-Q2's input again.
  - Heuristic value 13/16; with known tools, nothing.
* **O-V7 [PROVED].**
  - All amplifier and Framework B inputs are sign-invariant (Lemma S), so the one-sided Landau reduction gains nothing.
  - The available one-sided inputs are lossy (sieve parity) or stronger than the target (Lemma RS).
* **O-XS.**
  - Xu–Sang is the 7/8 architecture with ℓ = 1/6 + 4.53·10⁻⁴. The formulas are identical [EXACT]; the parameters are identified by matching names and endgame constants (§2).
  - Its quartic transplant changes only the slope (−3/8 vs −1/4).
  - Going further needs the open (H) (PR #14, TARGET_0874), whose quartic analogue is equally open.
* **O-G1.** GL(2) spectral rows: amplifier density 0 (Lemmas D, E). The off-diagonal is Möbius in progressions (circular).
* **O-G2.** GL(2) column weights: degree 4, no contraction, no ζ information.
* **O-G3.** Signal density 1: RH-strength mean square.
* **O-G4.** Hecke-relation copies are parallel rows: the mean square is the target.

**Residue degrees over imaginary quadratic fields** (μ_k ⊂ K only for k ∈ {2, 3, 4, 6}):

| k | density | absorbed class (ledger) | home / degree | status |
|---|---|---|---|---|
| 2 | 1/2 | [μ] (circular) | — | dead |
| 3 | 1/3 | μ not absorbed (`beat78-amplifier` C2); x^{±2} in `zf-campaign-cubic-field` | no theta known | dead |
| **4** | **1/4** | **y^{±1} = quartic Gauss sums** | **GL(3) 4-fold cover, degree 3** | **ties 7/8 at best (Framework A), with an open input** |
| 6 | 1/6 | x^{±1} = cubic Gauss sums | Patterson cubic theta, GL(2), degree 2 | 11/12; 7/8 (manuscripts); Xu–Sang 0.87488665 (conditional) |

---

## 10. What would be needed, and next steps

1. **To tie 7/8 by a second route (Hecke L-functions over Q(i), hence Dirichlet L-functions and ζ).** One of:
   * a balanced-point quartic large sieve over Z[i] (M + N + (MN)^{1/2});
   * Lindelöf on average for index-h³ quartic Kubota series.

   Each is an open problem of independent interest. The payoff is only a tie. If Xu–Sang holds, the result would be strictly weaker than the current conditional boundary.
2. **To go below 7/8 with the quartic field.** Item 1, *and* quartic analogues of Lemmas 14.3, 15.1, 17.1, 17.6, 18.1, Prop 15.2 and a new endpoint certificate. The heuristic value is 13/16 (price ≈ 0.0992). This is not a realistic campaign item while item 1 is open.
3. **GL(2).** No version has a positive-density amplifier together with an absorbing dual and ζ information. Drop it.
4. **V7 floor.** Keep it as a reformulation. It becomes a lever only if a genuinely one-sided arithmetic input appears; none exists in the residue-symbol or GL(2) families (Lemmas S, RS).
5. **Campaign recommendation.** Close the probe-field lever with the obstructions of §9. The remaining levers are inside the sextic architecture:
   * a non-Cauchy–Schwarz estimate of the exceptional piece ⟨A^E, B⟩. Lemma P rules out doing this with any filter that depends only on residue-character values: such a filter cannot tell the target from the k-th-power class. An estimate has to use information beyond those values;
   * the high-side row counts together with the slack range 2M ≥ 1 + 3ℓ (`zf-campaign-high-side.md`);
   * PR #14's restricted fourth moment (H).

---

## 11. Reproduction

```
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/zf-quartic-gl2-phasefilter.py  > tmp/zf-quartic-gl2-phasefilter.out   # NEW: Lemma P, quartic filter, PR #14 table reproduced (1 s)
.venv-arb/bin/python tmp/zf-quartic-gl2-dictionary.py   > tmp/zf-quartic-gl2-dictionary.out    # NEW: exact dictionary, Xu-Sang identity, transplant, ledgers, prices (<1 s)
.venv-arb/bin/python tmp/zf-quartic-gl2-identities.py                                          # re-run: Lemmas Q2-Q4, (I1)-(I8), ALL CHECKS PASS (10 s)
.venv-arb/bin/python tmp/zf-quartic-gl2-exponents.py                                           # re-run: 54 exact exponent checks, Lemma D toy (<1 s)
.venv-arb/bin/python tmp/zf-quartic-gl2-meansquare.py 300000 4000 4000                         # draft: (N1)-(N3) toy numerics (95 s; not re-run)
.venv-arb/bin/python tmp/zf-quartic-gl2-gausscache.py 300000                                   # draft: gamma_1 cache (100 s; not re-run)
.venv-arb/bin/python tmp/zf-quartic-gl2-conductor.py                                           # draft: inconclusive conductor test (not needed, §4.5)
```

Saved outputs: `tmp/zf-quartic-gl2-{phasefilter,dictionary,identities,exponents,meansquare,gausscache,conductor}.out`.
PR #14's own checker (`git show refs/pr/14:rigorous/mobius_bridge_reduction/signed_phase_filter.py`, standard library)
gives the k = 6 numbers that the new script reproduces.
