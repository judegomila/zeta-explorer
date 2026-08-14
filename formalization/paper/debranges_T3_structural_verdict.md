# FABLE-DEBRANGES — Structural verdict on the T3 residual route

**Verdict-direction (one sentence).** The T3 residual route, pursued to its analytic endpoint, is the classical zero-free-strip ladder in operator clothing — fixed-a positivity ⟺ Ξ(·+ia) ∈ Hermite–Biehler ⟺ ζ zero-free in Re s > ½+a — so the controlled quantity is *quantized* (it equals 1 or +∞, never 1−δ), the cos(ps)−1 cancellation is the finite-basis shadow of exact boundary unimodularity with identically zero estimate slack, the a→0 uniformization is margin-forbidden by Rodgers–Tao Λ ≥ 0, and everything the route can actually *certify* collapses back into the frozen-rung ⟺ Platt–Trudgian inertia ceiling: **REDUCES-TO-WALL, but the wall is zero-location / Euler-product input (a zero-free strip), strictly beyond — and on a different axis from — Montgomery pair correlation.**

Status labels used below: **[PROVED-HERE]** = complete argument in this document (modulo routine algebra), **[PROVABLE-NOW]** = precise sub-lemma we can formalize immediately, **[HEURISTIC]** = explicitly flagged scaling argument, **[LITERATURE]** = known theorem with citation.

---

## 0. Notation anchoring (repo conventions)

From `src/data/three-attacks-section.js:103-107`:

- Φ(u) = Σ_{n≥1} (2π²n⁴e^{9u} − 3πn²e^{5u}) e^{−πn²e^{4u}}  (de Bruijn profile; Φ(u) = Φ̃(2u) for Riemann's classical Φ̃),
- X(w) = 8∫₀^∞ Φ(u) cosh(2wu) du,
- A_a(z) = 8∫₀^∞ Φ(u) cosh(2au) cos(2zu) du,
- B_a(z) = 8∫₀^∞ Φ(u) sinh(2au) sin(2zu) du.

Define Ξ(λ) := 8∫₀^∞ Φ(u) cos(2λu) du, so Ξ(λ) = c·ξ(½ + iλ) for an irrelevant positive constant c (the factor-2 in cos(2λu) exactly absorbs the u→2u substitution between Φ and Riemann's Φ̃). Zeros of ξ at ρ = β+iγ correspond to zeros of Ξ at λ = γ − i(β−½); in particular RH ⟺ all zeros of Ξ real, and

**|Im λ| ≤ a for every zero λ of Ξ  ⟺  ζ(s) ≠ 0 for Re s > ½ + a.**

The elementary identity cos(2(z+ia)u) = cosh(2au)cos(2zu) − i·sinh(2au)sin(2zu) gives immediately

**E_a(z) := A_a(z) − i B_a(z) = Ξ(z + ia).**  (†)

So the repo's (A_a, B_a) pair is *literally* the standard Hermite–Biehler decomposition E = A − iB of the a-shifted completed ξ. The kernel decomposition K_a = K_{a,0} + D_{a,R} + K_a^{(S)} (passive diagonal with density m(τ) = (1/2π)Φ(τ)² sinh(2aτ); antisymmetric Wronskian shear Φ(u)Φ(v)sinh(a(u−v)) with p = Φcosh, q = Φsinh; symmetric indefinite channel) is exactly the frequency-side expansion of the de Branges reproducing kernel of E_a: expanding cos(2(z±ia)u)·cos(2(w̄∓ia)v) produces the cosh(a(u+v))-diagonal (→ K_{a,0}), the symmetric sinh(a(u+v)) channel (→ K_a^{(S)}), and the antisymmetric sinh(a(u−v)) channel (→ Gshear/D_{a,R}). The three-channel split is a basis convenience, not structure; the structural object is the single kernel

K^{E_a}(z,w) = [B_a(z)·conj(A_a(w)) − A_a(z)·conj(B_a(w))] / (π(z − w̄)),

the reproducing kernel of the would-be de Branges space H(E_a) (de Branges 1968, §19–22).

**Factor-audit caveat (referee finding, load-bearing for the (1)⟺(2) leg only).** The three-channel data quoted above (p = Φcosh(at), q = Φsinh(at), shear sinh(a(u−v)), diagonal sinh(2aτ); `imp-3382-rawdiagonal-R-degree-growth-law.js:18-23`) are internally consistent with the E-shift **a/2** in the repo's canonical factor-2 convention (`three-attacks-section.js:106-107` uses cosh(**2**au)); the exact expansion of K^{E_a} produces sinh(2a(u±v)) channels and diagonal sinh(4aτ)/2. This is precisely the trap the program already retracted once (imp-2424, `omittedTransformArgumentFactor: 2`, verdict "SURROGATE / INVALID FOR T3", `three-attacks-section.js:175-232`). The identification below is therefore stated up to the relabeling a ↦ a/2, which is harmless for every structural conclusion (the strip ladder is shift-covariant; only the rung label on any given numeric moves) — but SL0 in §7 must be run before any T3 numeric is quoted at a named rung. Additionally, the *implemented* D_{a,R} uses a regularized pseudo-inverse of Gpass (resolvable block only; cutoff-dependent, cf. imp-3420), which is strictly weaker than the exact kernel statement: positivity through the implemented D_{a,R} is silent on the discarded near-null directions. Everything in this document about "T3" means the exact ideal kernel.

---

## 1. Reclassification Lemma: what T3 *is* — **[PROVABLE-NOW as SL1, with two audited caveats]**

**Lemma SL1 (T3 ⟺ zero-free strip).** For each a > 0 *outside a countable exceptional set Z_Ξ* (see the degeneracy caveat below), and with T3 read as the exact kernel statement at shift a (mod the a↦a/2 factor audit, §0), the following are equivalent:

1. (T3 at level a) D_{a,R} + K_a^{(S)} + K_{a,0} ⪰ 0 on every finite test set in C₊;
2. K^{E_a} is a positive-semidefinite kernel on C₊ × C₊;
3. E_a = Ξ(·+ia) is of Hermite–Biehler class (|E_a(z̄)| ≤ |E_a(z)| for Im z > 0, no zeros in C₊);
4. every zero λ of Ξ has |Im λ| ≤ a;
5. ζ(s) ≠ 0 for Re s > ½ + a.

*Proof sketch.* (1)⟺(2) is the channel-assembly identity of §0 (finite algebra in the shifted-Legendre truncation, then exhaustion) — this is the leg carrying the factor-audit and exact-vs-regularized caveats of §0. (2)⟺(3): with Θ_a := E_a*/E_a (E_a*(z) := conj(E_a(z̄)) = Ξ(z − ia), using Ξ real-even), one has the standard identity

K^{E_a}(z,w) = E_a(z)·conj(E_a(w)) · [1 − Θ_a(z)·conj(Θ_a(w))] / (−2πi(z − w̄)),

so PSD of K^{E_a} ⟺ Θ_a is in the Schur class of C₊ (analytic and |Θ_a| ≤ 1) ⟺ E_a ∈ HB. (3)⟺(4): the zero-set direction is the conjugate-pair symmetry of the real-even Ξ; the modulus inequality |E_a*| ≤ |E_a| in C₊ does **not** follow from Cartwright/Krein-class boilerplate — Ξ has order 1 *maximal* type (|ξ(½−y)| ~ exp((y/2)log y)), so it is not of finite exponential type. The correct argument (referee-supplied, and the right one to formalize): Ξ is even of genus ≤ 1 with Σ|λ_k|⁻² < ∞, so Ξ(λ) = Ξ(0)·∏(1 − λ²/λ_k²), whence Θ_a = ∏_k g_k with g_k(z) = (λ_k² − (z−ia)²)/(λ_k² − (z+ia)²); when |Im λ_k| ≤ a each g_k is a finite Blaschke product for C₊ (its poles are exactly the conjugates of its zeros), so |g_k| ≤ 1 there, and g_k − 1 = O(|λ_k|⁻²) makes the product converge. The growth at infinity cancels *exactly*, factor by factor — no escape at infinity. (4)⟺(5): the λ ↔ s dictionary above. ∎

**Degeneracy caveat (referee finding — real, but measure-zero in a).** The fixed-a chain (2)⟹(3) can fail on a countable set Z_Ξ of a-values: if Ξ had two off-strip zeros vertically aligned at the same γ with imaginary parts symmetric about a (λ₀ = γ+i(a+δ), λ₁ = γ+i(a−δ)), the Θ_a-pole from λ₀ is cancelled by the numerator zero from λ̄₁; Θ_a stays Schur, K^{E_a} stays PSD (the offending row degenerates to 0), yet the strip fails. So SL1 as a *fixed-a* biconditional holds for a ∉ Z_Ξ; and since positivity along any a_n ↓ 0 forces the strip for every a' > inf a_n via a non-exceptional rung below it, **the T26/RH endpoint and every structural conclusion in this document are unaffected**. Whether Z_Ξ is even nonempty for ζ requires two off-line zeros sharing an ordinate — no such configuration is known or expected.

**Failure certificate is (generically) a single point.** If Ξ has a zero λ₀ with Im λ₀ > a and no cancelling partner as above, then Θ_a has a pole at z₀ = λ₀ − ia ∈ C₊ and the *diagonal* kernel entry K^{E_a}(z,z) = |E_a(z)|²(1−|Θ_a(z)|²)/(4π Im z) is negative near z₀ (verified directly: if E_a(z₀) = 0 ≠ E_a*(z₀) then K(z₀,z₀) = −|B_a(z₀)|²/(π Im z₀) < 0). So T3 never fails "diffusely": failure at level a is witnessed by one test point sitting just below one off-strip zero. This single fact reorganizes the entire empirical record (§5, §6).

**T26 restated.** Positivity along any a_n ↓ 0 = a nested family of zero-free strips shrinking to the critical line = RH. Correct as stated, and now visibly the classical statement.

**Consequences of one rung.** Even a single fixed a₀ ∈ (0, ½) is a quasi-Riemann hypothesis: it gives ψ(x) = x + O(x^{½+a₀+ε}) uniformly — beyond every known method. The strongest unconditional zero-free region (Vinogradov–Korobov) has width c/(log T)^{2/3}(log log T)^{1/3} shrinking with height; *no fixed-width strip is known*, and even the best modern density estimates (Ingham; Huxley; Guth–Maynard 2024) bound N(σ,T) without ever emptying a strip.

---

## 2. Q1 — The cancellation-sensitive Volterra estimate, as far as it goes

### 2.1 The exact quantity that must be controlled

By SL1 the target functional is

**σ(a) := sup_{z ∈ C₊} |Θ_a(z)|,  Θ_a(z) = Ξ(z−ia)/Ξ(z+ia) = E_a*(z)/E_a(z),**

and T3 at level a ⟺ σ(a) ≤ 1. Every estimate in the residual program — the crude ‖R‖ bound, the second-order cos(ps)−1 expansion, the imp-1258 Volterra collapse ‖V_{a,Φ}‖ ≤ 1 — is an upper-bound scheme for σ(a) in some basis.

### 2.2 The rigidity: σ(a) is quantized — **[PROVED-HERE, via the Hadamard product]**

For real x, Ξ(x−ia) = conj(Ξ(x+ia)) (Ξ is real-entire), hence **|Θ_a(x)| ≡ 1 identically on ℝ** (removable and unimodular even at real zeros, by conjugate multiplicity matching). One cannot quote bounded-type/Cartwright theory here (Ξ has maximal type; see §1), but the quadruple-Blaschke factorization Θ_a = ∏ g_k of §1 gives the dichotomy directly, with no escape at infinity (checked independently along iℝ: |Θ_a(iy)| ~ πᵃ·Γ((½+y−a)/2)/Γ((½+y+a)/2) ~ (y/2)^{−a} → 0):

- Θ_a has no poles in C₊ ⇒ every g_k is Schur ⇒ σ(a) = 1 (the boundary value, attained on ℝ);
- Θ_a has a pole in C₊ (⟸ an uncancelled off-strip zero; ⟹ some off-strip zero) ⇒ σ(a) = +∞.

**σ(a) ∈ {1, +∞}. There is no configuration with σ(a) = 1 − δ.** The controlled quantity carries *identically zero margin*: the tangential boundary data on ℝ — |Θ_a| and all its tangential derivatives, and every finite-order, finite-precision Gram/moment functional built from boundary integrals — is exactly consistent with both cases. (Normal derivatives off ℝ do see φ_a′ and can detect *low* off-strip zeros; §2.3 quantifies exactly when that detection fails. And of course the boundary values determine Θ_a by continuation — the point is that no *estimate-shaped*, finite-information functional separates the cases.) This is the precise sense in which "the cancellation must bring the constant to exactly 1, not below": it is not a constant that can be ground down from 1.33 toward 1 by sharper quadrature, better bases, or a cleverer Volterra kernel bound; the gap between 1.33 and 1 is the gap between a *norm* (which can sit above 1 harmlessly forever) and a *pole-freeness assertion* (which no norm estimate on boundary data reaches).

The repo's cos(ps)−1 second-order structure is the finite-basis shadow of this boundary saturation: |Θ_a| = 1 on ℝ means the first-order term in the form vanishes identically (that is the "genuine cancellation"), and the surviving second-order term near the boundary is

1 − |Θ_a(x+iy)|² = 2y·φ_a′(x) + O(y²),   φ_a′ = phase velocity of Θ_a on ℝ,

so positivity of the form for test points *near* ℝ is exactly φ_a′ ≥ 0 — a genuinely estimable, local quantity. This is how far the cancellation-sensitive estimate goes, and it does go that far: it proves the form is positive on any test family within o(1) of the boundary, with margin ∝ depth × φ_a′.

### 2.3 Where it stops: high zeros hide under the phase background — **[HEURISTIC, explicit constants]**

Could a boundary differential inequality (φ_a′ ≥ 0, or any local refinement) be *equivalent* to the strip and hence a viable estimate target? No. The phase velocity of Θ_a decomposes over zeros as a sum of Poisson kernels: on-strip zeros at height ≈ T contribute a positive background φ_a′(x) ≈ log(T/2π) + O(1) (twice the de Branges E-phase density — Θ-convention, referee-corrected), while a hypothetical off-strip pair {λ₀, λ̄₀}, λ₀ = γ + ib, b > a, contributes +2(b+a)/((x−γ)²+(b+a)²) − 2(b−a)/((x−γ)²+(b−a)²): a *negative* lobe of peak −2/(b−a) at x = γ. The lobe wins — i.e., φ_a′ < 0 somewhere, i.e., boundary data detects the zero — only when

b − a ≲ 2/log(γ/2π).

An off-strip zero with fixed excess width at height γ ≥ e^{4/(b−a)} is **invisible to every boundary-local functional**: the growing phase background swamps it. So the Volterra/derivative estimate, pushed to its exact limit, proves "positivity near the boundary + no off-strip zeros in a log-thin sliver above the strip *where boundary data can see*" and can never, by any refinement, exclude off-strip zeros at large height with the fixed excess that the strip statement is about. Detection at depth requires test points at that height and depth — a pointwise pole hunt, which is zero *location*, not estimation.

**Answer to Q1.** The O(1) residual + cancellation is *not* a route to a uniform sub-threshold bound. The cancellation is real and fully identified (boundary unimodularity of Θ_a); the exact quantity to control is σ(a) = sup_{C₊}|Θ_a|; and that quantity is quantized {1, ∞} with unimodular boundary data, leaving no foothold for any estimate that consumes boundary/kernel/Gram data. The measured facts are reinterpreted, not contradicted, by this (see §6).

---

## 3. Q2 — What the controlled quantity reduces to (it is NOT the PCC wall)

**σ(a) ≤ 1 is equivalent to off-line zero exclusion (a zero-free strip), which is a different — and in practice harder — axis than Montgomery pair correlation.**

- Montgomery's pair-correlation theorem and conjecture (Montgomery 1973) are statements about the *spacing statistics of zeros already on the critical line*, and the theorem's proved range |α| < 1 is itself conditional on RH. PCC neither implies nor is implied by a zero-free strip by any known argument. The "Montgomery PCC obstruction" that blocks the ESY-closure routes in this program (v52 audit) is a *spacing-information* wall; T3's wall is a *location* wall. Conflating them would misdiagnose the frontier: no amount of pair-correlation input, even conjectural GUE statistics, delivers Re s > ½ + a zero-freeness, and conversely a strip says nothing about GUE.
- The a→0 endpoint (all-a uniformity) is RH itself, where PCC-type and location-type information merge; but at every positive rung the reduction target is the strip, full stop.

**Is there an independent mechanism (monotonicity, Volterra-kernel positivity, entire-function/HB argument) that bounds it without zero locations? No — provably not from the hypothesis classes the T3 apparatus uses.** Two blindness lemmas:

**Lemma SL2 (Flow-blindness; kills the a→0 tail for all "soft" proofs). [PROVABLE-NOW, rides on Rodgers–Tao]** For ε > 0 let Φ_ε(u) := e^{−εu²}Φ(u) (backward de Bruijn heat flow; de Bruijn 1950). Then Φ_ε is even, strictly positive, doubly-exponentially decaying, and its transform Ξ_ε is real-entire of the same order and symmetry class. Yet by Rodgers–Tao (Λ ≥ 0; Forum of Mathematics Pi, 2020), Ξ_ε has a non-real zero for every ε > 0, so **"T3(a) for all a > 0" is FALSE for Φ_ε** — indeed false for all a below some b(ε) > 0. Consequence: any proof of T3-for-all-a whose hypotheses on Φ are stable under the family {Φ_ε : 0 < ε < ε₀} — and *every* positivity/monotonicity/total-positivity/decay/symmetry hypothesis in the current apparatus is — proves a false statement. A valid proof must use a property of Φ that distinguishes it from its own ε-backward-heat deformations. No soft property does; what distinguishes them is the exact arithmetic identity behind Φ (Jacobi theta / Euler product). This is Newman's "the Riemann hypothesis, if true, is only barely so" (Newman 1976) upgraded from aphorism to a formal no-go: **the counterexample family is not a contrived bump — it is an arbitrarily small deformation of the actual Φ.**

**Lemma SL3 (Fixed-a blindness). [PROVABLE-NOW]** For each fixed a₀ ∈ (0,½) there exist even, positive, super-exponentially decaying kernels Ψ (smooth two-bump constructions) whose E_a₀ fails HB; and separately, in the *functional-equation* class, the Davenport–Heilbronn function (1936) satisfies a degree-1 functional equation yet has zeros of unbounded height off any strip — some even in the half-plane of absolute convergence. (The two examples block different hypothesis clauses: positivity+decay is blocked by the bump construction; functional-equation symmetry is blocked by D–H. D–H is *not* claimed to have a positive kernel — its theta-analogue has mixed-sign character weights.) So fixed-a₀ positivity is also unreachable from the soft hypothesis class. This is the 100-year-old boundary of Pólya's kernel program (Pólya 1926–1927; Csordas–Norfolk–Varga 1986–1988 for the specific de Bruijn Φ): only very special kernels have transforms with only real zeros, and no positivity/decay class characterizes them.

**Division of labor between the two lemmas:** SL2 rigorously blocks soft proofs of the a→0 tail (the RH-carrying part, via Rodgers–Tao); SL3 blocks soft proofs at each fixed rung. Together: **there is no independent mechanism inside the current axioms.** Any continuation must import the prime side — e.g., grafting Weil-explicit-formula positivity (the only classical device that converts prime information into zero-location information) onto the Volterra channel. Nothing in the T3 apparatus currently touches an Euler product.

**Answer to Q2.** The controlled quantity does *not* reduce to PCC. It is equivalent to zero-free-strip information — which you also cannot get without essentially new arithmetic input, but for a different reason and along a different axis than the PCC wall. The "independent mechanism" option is refuted at the level of hypothesis classes (SL2/SL3), not merely unavailable.

---

## 4. The no-margin barrier at a→0 — why "no uniform margin" is forced, not an artifact

The measured fact "λ_d ↓ 0, NO UNIFORM MARGIN" has two layers:

1. **Trivial layer:** truncation eigenvalue floors of a fixed PSD kernel always ↓ 0. Says nothing about sign. (User's measured fact (2) — correct.)
2. **Structural layer [PROVED-HERE, via SL2]:** no *relative* margin can exist either. A uniform-in-a relative gap (effective residual ≤ 1−δ, equivalently form ⪰ δ·core) provable from flow-stable hypotheses would apply equally to Φ_ε for small ε, contradicting Rodgers–Tao. And directly: σ(a) ∈ {1,∞} means the natural normalized functional *admits no value in (1−δ, 1)* — margin is not merely unproved, it is not a thing this problem has. RH sits exactly on the boundary of the de Bruijn–Newman flow (0 = Λ_lower ≤ Λ ≤ 0.1788… in this program's ledger; ≤ 0.22 Polymath15), and the T3 family inherits that boundary-case rigidity at its a→0 end.

So the honest reading of "no uniform margin": it is a *consistency check of Rodgers–Tao*, and simultaneously the death certificate for every "prove ≤ 1−δ uniformly, then take limits" plan, including any future refinement of the 1.33 → sub-1 program.

---

## 5. Q3 — Reconciliation with frozen-rung ⟺ Platt–Trudgian (inertia locking)

**Formally outside, materially inside; the ceiling re-derives itself.**

- *Outside in form:* the inertia-preservation argument (Sylvester/Krein–Langer congruence) applies to congruence-transported **finite spectral data** — frozen rungs. A hypothetical *analytic* uniform bound on σ(a) is not such data; the inertia theorem does not, by itself, forbid it. So the residual route is not literally capped by the frozen-rung proposition.
- *Inside in content:* by SL1's (generic) single-point failure certificate, **every certificate the T3 route can actually produce is a finite-test-set PSD verification, and such a verification carries — up to Poisson tails from unresolved heights — the information content of a zero count below the height resolved by that test set** (a failed check locates an off-strip zero; a passed check is necessary-but-not-sufficient evidence, swampable by the §2.3 mechanism) — i.e., Platt–Trudgian-type information, and inertia locking applies to it with full force. The Arb-verified jet positivity through d = 16, and any finite-D residual computation at any precision, is *implied by* the already-verified zeros (X ≈ 3·10¹²) and carries zero information beyond them. The measured ‖R‖ plateau, the resolvable-block analysis, the excision budgets — all of it lives below the verified height.
- *The pincer:* the route's numerical content is PT-locked (inertia); the route's hoped-for analytic surplus is precisely a zero-free strip, unreachable from its hypothesis class (SL2/SL3) and margin-free at the RH end (§4). The frozen-rung ⟺ PT theorem and the T3 analysis are therefore *the same wall seen from two sides*: "only lever = verified height" (the PT-floor audit conclusion) is re-derived here from de Branges rigidity rather than from Sylvester inertia.

---

## 6. The two measured facts, reinterpreted

1. **‖R‖ plateau ≈ 0.75 → 1.33 (well-posed, regularized).** Real and correctly de-artifacted — and *expected*. The crude bound |form(shear)| ≤ ‖R‖·form(core) is a *sufficient* condition whose failure (‖R‖ > 1) is compatible with truth of PSD; if the strip holds at the resolved heights (it does — verified zeros), the effective form constant is ≤ 1 while the crude antisymmetric-norm sits above 1 indefinitely. The Gram-area formula for the rank-2 shear (‖R‖² = |p̂|²|q̂|² − ⟨p̂,q̂⟩², p̂,q̂ the core-normalized cosh/sinh vectors, asymptotically parallel — the finite plateau *is* a first cancellation) explains the O(1) scale. The creep 0.75 → 1.33 with D is the sup over deepening test configurations and is not a trend toward failure; it is a trend toward the rigid regime where norms stop being informative. **Do not spend further compute grinding 1.33 toward 1: no value below the quantum {1,∞} exists to be measured.**
2. **λ_d ↓ 0, sign stays ≥ 0 through d = 16 (Arb).** The sign staying non-negative is exactly quasi-RH at resolved heights, guaranteed by verified zeros (SL1 certificate direction); the decay to 0 with no margin is forced (§4). Both facts carry no forward information about RH; they are backward-consistent with PT data.

---

## 7. Grade and concrete next steps

**Grade: REDUCES-TO-WALL — but the wall is the zero-free strip + flow-rigidity, not PCC.** Against the offered taxonomy:

- *Not* LIVE-WITH-CONCRETE-NEXT-STEP toward RH: no estimate-shaped continuation exists (§2.2, §3, §4).
- *Not* REDUCES-TO-PCC-WALL: the reduction target is off-line exclusion, provably a different axis (§3); labeling it PCC would misdirect effort toward spacing statistics that cannot help.
- Effectively GENUINELY-OPEN-FROM-HERE for the estimate program, with the sharpening that the openness is *located*: everything short of new arithmetic (prime-side) input is closed off by SL1–SL3, not merely unfinished.

**Provable sub-lemmas worth formalizing now (architectural value — they prevent burning compute, they do not advance RH):**

- **SL0 (Factor-2 shift audit — run FIRST).** Re-derive the imp-3382 three-channel data (p, q, shear, diagonal) from K^{E_a} in the canonical `three-attacks-section.js` factor-2 convention and pin whether the implemented rung label a means E-shift a or a/2; simultaneously state exactly what the regularized pseudo-inverse D_{a,R} certifies relative to the exact kernel (which near-null directions are discarded, cutoff dependence per imp-3420). This is the imp-2424 trap class; every quoted T3 numeric inherits its resolution. Pure bookkeeping, one sitting.
- **SL1 (T3 Reclassification).** As stated in §1, in repo normalization (†), for a outside the countable degenerate set Z_Ξ, conditional on SL0 for the (1)⟺(2) leg. The (3)⟺(4) leg must be formalized via the even genus-1 Hadamard product / quadruple-Blaschke factorization (§1) — *not* Cartwright-class citations, which are invalid for the maximal-type Ξ. Aristotle-formalizable in pieces (channel assembly is pure algebra; the Blaschke-factor Schur bound is elementary).
- **SL2 (Flow-blindness no-go).** As stated in §3, with Rodgers–Tao as an input axiom. This is the theorem-grade form of "no uniform margin" and should be recorded next to the frozen-rung ⟺ PT proposition as its analytic twin.
- **SL3 (Fixed-a blindness).** A two-bump positive even Schwartz kernel with a computed non-real transform zero (finite computation certifies it via a winding-number/argument-principle box count) — one page, closes the "maybe total positivity of THIS Volterra kernel does it" escape hatch for every fixed rung.

**Ledger recommendations.** (i) Re-label T3 in the roadmap from "Hermitian-form inequality / residual bound" to "zero-free-strip ladder (quasi-RH at each rung; RH at a→0)"; T26 becomes the trivial statement that strips shrink to the line. (ii) Retire the sub-1 uniform-residual numerical program (§6.1). (iii) The only admissible continuation *within* T3: import the prime side — a Weil-explicit-formula positivity term grafted into the Volterra channel, i.e., an inequality whose hypotheses are NOT satisfied by Φ_ε or bump kernels. That is a research program, not a next step; it should be costed as such. (iv) The program-level conclusion of the PT-floor audit ("only lever = verified height") is independently re-derived here and should be marked as doubly confirmed.

---

## References

- L. de Branges, *Hilbert Spaces of Entire Functions*, Prentice-Hall, 1968 (esp. the kernel [B(z)Ā(w)−A(z)B̄(w)]/π(z−w̄) and HB ⟺ PSD).
- L. de Branges, "The convergence of Euler products," J. Funct. Anal. 107 (1992) — the positivity approach; see next item for its numerical refutation in the strong form.
- J. B. Conrey, X.-J. Li, "A note on some positivity conditions related to zeta and L-functions," IMRN 2000:18 — de Branges' sufficient positivity condition fails for ζ; cautionary precedent for positivity schemes.
- H. L. Montgomery, "The pair correlation of zeros of the zeta function," Proc. Sympos. Pure Math. 24, AMS, 1973 — the PCC wall referenced in §3 (proved range itself RH-conditional).
- J. C. Lagarias, "Hilbert spaces of entire functions and Dirichlet L-functions," in *Frontiers in Number Theory, Physics, and Geometry I*, Springer, 2006 — de Branges structures for ζ/L-functions and their zero-location meaning.
- B. Rodgers, T. Tao, "The de Bruijn–Newman constant is non-negative," Forum of Math. Pi 8 (2020) — Λ ≥ 0; engine of SL2 and §4.
- C. M. Newman, "Fourier transforms with only real zeros," Proc. AMS 61 (1976) — Λ exists, conjectured Λ ≥ 0, "barely true."
- N. G. de Bruijn, "The roots of trigonometric integrals," Duke Math. J. 17 (1950) — the heat flow; real zeros for t ≥ ½.
- D. H. J. Polymath, "Effective approximation of heat flow evolution of the Riemann ξ-function, and a new upper bound for the de Bruijn–Newman constant," Res. Math. Sci. 6 (2019) — Λ ≤ 0.22 (this program's ledger: conditional 0.1788 candidate).
- H. Davenport, H. Heilbronn, "On the zeros of certain Dirichlet series," J. London Math. Soc. 11 (1936) — functional equation without Euler product, off-line zeros; SL3.
- G. Pólya, "Bemerkung über die Integraldarstellung der Riemannschen ξ-Funktion," Acta Math. 48 (1926) — the kernel-reality program bounding SL3's hypothesis class.
- G. Csordas, T. S. Norfolk, R. S. Varga, "The Riemann Hypothesis and the Turán inequalities," Trans. AMS 296 (1986) — properties of the de Bruijn Φ (positivity, decay); none suffice for reality of zeros.
- L. Guth, J. Maynard, "New large value estimates for Dirichlet polynomials," 2024 — state of the art in zero-density; density ≠ zero-free strip (§1).
- Repo anchors: `src/data/three-attacks-section.js:103-107` (Φ, X, A_a, B_a conventions used in (†)); frozen-rung ⟺ PT proposition (commits 06e21f6a3, 164db7e5f, 3c90b778b); PT-floor audit page `/pt-floor-audit`.

---

## Appendix — Adversarial referee findings (incorporated)

An independent adversarial referee pass was run on the draft before finalization. Survived intact: the identity (†) and zero dictionary (checked against the repo's own `E_a(z) = X(a−iz)` at `three-attacks-section.js:105`); the σ(a) ∈ {1,∞} dichotomy's conclusion (with the along-iℝ check |Θ_a(iy)| ~ (y/2)^{−a} → 0); SL2 flow-blindness including the exact t = −ε time correspondence in the cos(2zu) convention (no factor-4 issue; the memory note "t = −4τ_repo" concerns a different proxy convention) and the de Bruijn-ray logic making Λ ≥ 0 yield a non-real zero for *every* t < 0; and all thirteen citations, including the Davenport–Heilbronn zeros in σ > 1.

Repaired per referee: (a) **degenerate pole-cancellation** — the fixed-a chain (2)⟹(3) can fail on a countable exceptional set Z_Ξ of a-values (two off-strip zeros vertically aligned, Im-parts symmetric about a); SL1 now excludes Z_Ξ, and the T26/RH endpoint is unaffected; (b) **factor-2 shift audit** — the (1)⟺(2) channel-assembly identification was unaudited against the repo's implemented kernels (imp-3382 channels are consistent with E-shift a/2 in the canonical convention; the imp-2424 retraction precedent) and equivocated between exact and regularized-pseudo-inverse D_{a,R}; now flagged in §0 and split out as SL0; (c) **proof-technique repair** — Cartwright/bounded-type citations replaced by the even genus-1 Hadamard / quadruple-Blaschke argument (Ξ has maximal type); (d) constant fixes in the §2.3 heuristic (Θ-convention background log(T/2π), detection threshold 2/log γ) and a rephrased §2.2 boundary-data claim (tangential/finite-precision functionals, not "every derivative"); (e) SL3's Davenport–Heilbronn clause no longer implies D–H has a positive kernel; (f) §5's "exactly" softened to "up to Poisson tails".

Referee's closing assessment, quoted: "None of the holes rescues the T3 residual route: the strategic conclusion (REDUCES-TO-WALL, wall = zero-free strip, retire the sub-1 grind) is robust to every defect found."
