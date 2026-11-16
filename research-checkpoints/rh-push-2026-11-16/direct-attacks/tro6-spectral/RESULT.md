# tro6-spectral: spectral attack on TRO6^♮ (sextic theta coefficients against the cubic rows)

2026-11-16. Scope: `tmp/research-2026-11-16/push/tro6-spectral/` only. Nothing committed or pushed.

**Verdict.** TRO6^♮(η) is not proved for any η > 0. θ stays 7/8 (unrefereed manuscript). The spectral route is
obstructed, and the obstruction is now located precisely: the binding part of the theta–row form is the pairing of the
rows with the *constant term* (cusp growth) of θ₆, which sums to Q^{5/6}/L(5/6+t, η). L²-spectral tools (spectral gap,
decay of matrix coefficients, Kuznetsov) act only on the complement, which is already below threshold. New items: a
measured polar law for sextic-character twists of the sextic theta coefficients (§3), an exact two-scale homogeneity
lemma (§4), and a stated averaged form (§7, open, gives a density statement, not a lower θ). NO QED.

Labels: PROVED / PROVED-rel X / CLASSICAL / MEASURED / HEURISTIC / OPEN.

---

## 1. Plan and what is new

Target: |𝔅^{♮,J}_{σ,v}(Z)| ≪ Z^{−ηb/12+ε} M^♮_σ(cQ)^{1/2}‖B^J‖_Q (`sextic-theta-proof.md` §2), by spectral theory of
the 6-fold cover of GL₂ over Q(ω), using only an inner-product bound and no Hecke multiplicativity of ρ^♮.

Against the atlas (PR #27 `historical-routes.md`) and prior notes:
* The atlas has no metaplectic / Kubota / Kuznetsov route; its only entry near this is the PR #14 energy target for
  B = 0.8748. Not a re-run.
* `sextic-theta-proof.md` §7 treats the functional equation, large sieve, Kazhdan–Patterson, WMDS/CFH,
  Dunn–Radziwiłł. It lists "twisted sums in the conductor aspect" as gap G3 (literature note §5: "no estimate, no
  written Voronoi formula") and labels the link "arithmetic of ρ^♮ = Poisson in m = high side" HEURISTIC. §3 below
  fills the main term of G3 numerically and makes that link explicit.
* Walls: DH control in §6. MV-CAP applies to §7 (a mean-value statement cannot give the every-target statement).
  Flow-blindness and verified height are not touched (no Λ claim).

## 2. Dictionary

**D1 (rows are Möbius-twisted conjugate sextic Kubota series)** [PROVED-rel manuscript (4.7), §7.2, (7.10)].
For squarefree c prime to S and (m, c) = 1, g̃(m, c) = conj(χ_c(m))γ₁(c), so χ_c(m)/γ₁(c) = conj(g̃(m, c)).
The manuscript's coefficient computation (7.10) shows that, after the inserted α, G, R, Ξ phases cancel, the corrected
row carries (−1)^{e₀}γ₁^{−e₀}η(p)^{e₀} at each prime. So the squarefree part of the row is

  B_m(Z) ≈ (1/2πi)∫ Z^tΦ(t) Σ_{c sf} μ(c)η(c)·conj(g̃(m, c))·N(c)^{−1/2−t} dt.

The same object is automorphic only on the 3-fold cover, through γ₁γ₂ = μαG: there it is a cubic Kubota series with a
Hecke twist that depends on m through the quadratic symbol (m/c)₂.

**D2 (the form as a sum of twisted theta sums)** [PROVED, rearrangement, given D1].
𝔅 = Σ_c β_c·L_Q(θ₆ ⊗ χ_c), with β_c = μ(c)η(c)conj(γ₁(c))N(c)^{−1/2−t} and
L_Q(θ₆ ⊗ χ_c) := Σ_m ρ^♮(−e₀m)ξ(m)χ_c(m)Ω(N(m)/Q)(N(m)/Q)^{−iv}. The inner sum is a smooth partial sum of the
coefficients of θ₆ twisted by a sextic character of conductor c, of length Q.

**D3 (no single-cover Rankin–Selberg integral)** [assessment, not a theorem].
* Genuine characters: θ₆ has ε, a cubic form ε^{±2}, a quadratic form ε³. The only triple products with trivial
  character are θ₆·E₃·E₂ and θ₆·conj(E₆)·E₁. Unfolding gives Σ_m ρ₆(m)τ₃(m)N(m)^{−w} or Σ_m ρ₆(m)conj(τ₆(m))N(m)^{−w}.
* The rows are neither τ₃(m) (they carry the m-dependent quadratic twist) nor conj(τ₆(m)) (they carry μ(c), and g̃(m, ·)
  is only twisted-multiplicative, so inserting μ is not a Hecke operation on the 6-fold cover).
* The factor μ(c) is the whole content: without it the pairing has no 1/L(s, η).

## 3. The polar law and the signal

**P (polar law).** For primary c prime to 6 and one sign of the sextic twist,

  Σ_m ρ^♮(m)χ_c(m)W(N(m)/Q) = K·u_c·N(c)^{−1/3}·Ŵ(5/6)·Q^{5/6} + (non-polar part),  |u_c| = 1,

and no Q^{5/6} term for the conjugate twist or for the cubic and quadratic twists χ_c^k, k = 2, 3, 4.

*Derivation* [HEURISTIC; uses CLASSICAL facts, cusp bookkeeping for the level-12 group, ξ and e₀ not traced].
θ₆ is the residue of the Kubota Eisenstein series, with constant term ∝ v^{5/6} and Fourier terms ρ(m)vK_{1/6}(4π|m|v),
ρ(m) = ρ^♮(m)N(m)^{1/12}. Hence L(w, θ₆) has its pole at w = 5/6 in the ρ^♮ normalisation (first moment Q^{5/6},
consistent with mean square Q^{5/6}). Write χ_c(m) through additive characters d/c. By θ₆(γz) = κ(γ)θ₆(z), θ₆ near
the cusp d/c is κ(d, c)·(N(c)v)^{−5/6}, κ a sextic symbol in d. The sum over d of conj(χ_c(d))κ(d, c)^{±1} is φ(c)
for the matching sign and 0 otherwise. Normalising by the Gauss sum gives N(c)^{−1/2}·φ(c)·N(c)^{−5/6} = N(c)^{−1/3}.

*Test* [MEASURED; `twisted_first_moment{,2,3}.py`, logs alongside; data `tmp/sextic/conj_rows_800.npz`, 2904 rows
N(m) ≤ 796, stripped class-σ coefficients ρ_σ(−e₀m); statistic = rms over the 12 classes of |Σ_mρ_σχ_π^k|/‖ρ_σ‖;
phase-randomised null mean 0.98, 99% ≈ 1.5].

| N(π) | k=0 | k=1 | k=2 | k=3 | k=4 | k=5 | k=1 × N^{1/3} |
|---|---|---|---|---|---|---|---|
| 7 | 6.38 | **4.59** | 0.32 | 0.37 | 0.30 | 0.49 | 8.8 |
| 13 | 6.60 | **3.90** | 0.31 | 0.61 | 0.38 | 0.35 | 9.2 |
| 37 | 6.83 | **3.03** | 0.91 | 0.77 | 0.73 | 0.63 | 10.1 |
| 97 | 6.85 | **2.49** | 0.99 | 0.82 | 0.83 | 0.57 | 11.4 |
| 199 | 6.92 | **1.78** | 0.83 | 1.09 | 1.09 | 0.88 | 10.4 |

* All 21 primes 7 ≤ N(π) ≤ 199: k = 1 is coherent at every prime; k = 2..5 are at the null level at every prime.
* Exponent over 37 primes N(π) ≤ 400: −0.279 (−0.295 for N ≥ 60); predicted −1/3. Not corrected for the noise floor,
  and N(π) > Q^{1/2} = 28 is outside the range where the cusp approximation is clean.
* Composite c = π₁π₂ (15 pairs from {7,…,43}): χ_{π₁}χ_{π₂} gives 0.99–2.09 (9 of 15 above the single-prime 99% null
  level 1.5; weaker evidence than the prime case); mixed and conjugate sign pairs give 0.57–1.21 (none above 1.5).
* This is a zero-independent law at first-moment level. It does not contradict the computation note's "no Gauss-sum
  law at prime indices": that concerned ρ at individual prime indices, this concerns sums over m against χ_c(m).
  It corrects conjecture note §4.4(2): the coherent first moment does not "pair only with an m-independent component of
  B"; through χ_c-twists it is the channel that carries the signal.

**S (the polar parts sum to the manuscript's signal)** [exponents PROVED by comparison with manuscript (7.5), (7.13);
the identification of P with the residue is HEURISTIC]. Insert P in D2:

  𝔅_polar = K′Q^{5/6}·(1/2πi)∫Z^tΦ(t)Σ_cμ(c)η(c)N(c)^{−5/6−t}dt = K′Q^{5/6}·(1/2πi)∫Z^{x−5/6}Φ(x−5/6)/L^S(x, η)dx.

With I^θ = Q^{−1/2}Y^{−1/3}𝔅 this is (Q/Y)^{1/3}Z^{x−5/6}/L = X^{1/3}Z^{x−5/6}/L(x, η), which is the weight
X^{1/2−z}Z^{x+z−1}Y^{w−1} of (7.5) at the manuscript's principal residue point (w, z) = (1, 1/6). The weight dependence
also matches: the block depends on (W₀, W₁) only through the Mellin convolution K = W₀ ⋆ r^{1/6}W₁, and
K̂(5/6) = Ŵ₀(5/6)Ŵ₁(1), the pair that the principal residue carries (M(1/6) is Ŵ₀(5/6) up to the Fourier Γ-factor).

## 4. Two-scale homogeneity

**Lemma H** [PROVED-rel Theorem A and Theorem D(i) of `sextic-theta-proof.md`; explicit for the base probe (6.2); for
the compensated probe it assumes B^J and c_J carry no separate X, Y dependence, as (12.5) is quoted in the notes, not
re-read]. Fix Z, λ ≍ 1. Under (X, Y) → (X/λ, λY), Q is fixed, B is unchanged and A^θ_m is multiplied by λ^{−1/3}. So

  Θ_ϑ[X/λ, λY; Z] = λ^{−1/3}Θ_ϑ[X, Y; Z] exactly, and
  I_mod[X/λ, λY; Z] − λ^{−1/3}I_mod[X, Y; Z] = O(Z^{17/96+ε}).

*Consequences.*
* Every high-side term above Z^{17/96} lies on z + w = 7/6 (weight X^{1/2−z}Y^{w−1} must scale as λ^{−1/3}). The
  principal point (1, 1/6) satisfies this. This is an unconditional check that the signal is inside the theta block,
  independent of (H_{σ₀}) and of the SKETCH parts of Prop E.
* Differencing in the s-scale, or any redesign of W₁, removes block and signal together. This closes "filter by
  varying Y or W₁" as a lever.

## 5. Why the spectral tools do not reach it

* **Spectral gap / matrix coefficients.** The Z^{C(β)} growth comes from the polar term of §3, i.e. from the non-L²
  part of θ₆ at the cusps d/c, weighted by μ(c)η(c). A gap bounds the non-polar parts of L_Q(θ₆ ⊗ χ_c). Those are the
  nonprincipal rows of the manuscript, already ≤ −m_hi relative to C(7/8). The best conceivable L²-input (Lindelöf for
  every L(w, θ₆ ⊗ χ_c)) would act on m_hi, not on the low exponent [assessment].
* **Kuznetsov with sextic Kloosterman sums.** It handles smooth sums over moduli of Kloosterman-type sums. Here the
  modulus sum carries μ(c). After (4.7) it is a cubic Kubota sum, whose spectral theory is what Lemma 15.1 already
  uses.
* **Rankin–Selberg.** D3.
* **Shifted convolution.** Opening |𝔅|² gives Σρ^♮(m)conj(ρ^♮(m′)) against the row Gram; its diagonal is the
  Cauchy–Schwarz bound and its off-diagonal main term is again the polar term squared.
* **Equivalence.** By Theorem D(ii) the aggregated bound is the improved low bound. With §3: 𝔅/(CS bound) is, at the
  paper geometry, a sum of Z^{ρ₀−7/8} over zeros of L(s, ϑ). A power saving is the absence of zeros in
  (7/8 − η/96, 7/8]. No inner-product bound independent of ϑ's zeros can give it.

## 6. DH control

The probe and 𝔅 are linear in the target. For f = c₁η₁ + c₂η₂ the signal is c₁/L(s, η₁) + c₂/L(s, η₂), not
1/(c₁L₁ + c₂L₂). The step that uses the Euler product is Σ_cμ(c)η(c)N(c)^{−s} = 1/L(s, η) (complete multiplicativity
of η), together with (4.7) (CRT multiplicativity of Gauss sums). Nothing here says anything about zeros of a
Davenport–Heilbronn combination, and no claim is made beyond the manuscript's.

## 7. Pivot (one): the averaged form

**Statement** [OPEN]. For targets ϑ₁,…,ϑ_R (distinct characters, or shifts ϑN^{iτ_j} with |τ_j − τ_k| ≥ 1) and fixed
(J, σ, v), Bessel/Halász gives

  Σ_j|𝔅_j|² ≤ M^♮_σ(cQ)·(max_j‖B_j‖² + (R−1)max_{j≠k}|⟨B_j, B_k⟩|).

If the rows are quasi-orthogonal, |⟨B_j, B_k⟩| ≪ Z^{−δ₁}‖B‖² uniformly, then TRO6^♮ holds on average over R ≤ Z^{δ₁}
targets with saving R^{−1/2}. With Theorem C's bookkeeping (a zero at 7/8 − δ forces |𝔅| ≳ CS·Z^{−δ}), the number of
targets in the family with a zero in Re s > 7/8 − δ is ≪ Z^{2δ} for 2δ < δ₁: a density estimate whose exponent tends
to 0 at the 7/8 edge.

*Status.*
* Quasi-orthogonality of completed cubic rows for different targets: OPEN, zero-independent, the bilinear form of
  Lemma 5.8. Toy check [MEASURED, `row_gram.py`]: normalised Gram of the nine stored toy rows (twists αG, α, 1; lengths
  10⁴–10⁶; 1452 rows prime to 6 off the Kummer coset) has off-diagonal entries 0.003–0.080 against a random level
  0.026.
* Uniformity of all constants in conductor and height (needed to turn Z^{2δ} into a power of the conductor): OPEN.
* Passage from per-tuple forms to the aggregated Θ_ϑ: not written.
* **θ it gives: none.** θ is a supremum over the family; a density bound does not move it (MV-CAP). The Λ chain uses θ
  only, so Λ is unchanged.

## 8. θ

| statement | status | θ |
|---|---|---|
| TRO6^♮(η), any η > 0 | not proved | 7/8 (unrefereed manuscript) |
| TRO6^♮(0.0219) + (H_{σ₀}) | conditional, unchanged from Theorem C | 0.8747719 |
| averaged form (§7) | open; density only | 7/8 |

## 9. Three weakest steps

1. **Polar law derivation.** Heuristic: the cusp classes of the level-12 group, the class restriction σ, ξ and e₀ are
   not traced, K is not computed, and the test uses stripped coefficients at N(m) ≤ 796 with fitted exponent −0.28
   against −1/3.
2. **"L²-spectral tools act only on nonprincipal rows".** An assessment based on §3's identification of polar part
   with principal row; the identification is by exponent and weight matching, not a term-by-term proof.
3. **Averaged form.** Rests on an open quasi-orthogonality bound, open uniformity in the conductor, the unrefereed 7/8
   manuscript, and toy evidence only; and it yields no θ.

## 10. Reproduction

`PY=.venv-arb/bin/python; $PY twisted_first_moment.py tmp/sextic` (also `…2.py`, `…3.py`, `row_gram.py`); each < 1 min,
< 1 GB. Logs: `twisted_first_moment{,2,3}.log`, `row_gram.log`.
