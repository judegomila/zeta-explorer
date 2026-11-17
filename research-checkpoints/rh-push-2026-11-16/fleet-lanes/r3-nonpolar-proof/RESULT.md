# r3-nonpolar-proof: c-aspect bounds for the twisted theta series, then a sieve over c

2026-11-16, round 3. Internal working note. Nothing committed or pushed. Not refereed.
Files (this directory only): `RESULT.md`, `eta_price.py`, `eta_price.log`.

**Verdict: precise obstruction.** The proposed route (bound each twisted first moment in the c-aspect, then sum
over c in mean square with a large sieve) does not prove TRO6^♮(η) for any η > 0. Its exponent deficit is exact:
it ends at Q^{+1/5} above Cauchy–Schwarz with ideal inputs (Lindelöf for every modulus and an optimal large sieve),
at Q^{+3/10} with the sextic large sieve that exists, and at Q^{+7/10} with convexity. The deficit (D/Q)^{1/2} is
structural and does not depend on the quality of the per-modulus bound. θ = 7/8 unchanged. RH open. NO QED.

Everything is in the toy geometry of the round-2 notes (n = 1 part, S′ = ∅, D = Q^{7/5}). Any abscissa below is a
MODEL value relative to the unrefereed 7/8 manuscript and the unrefereed follow-ups (Liu 2610.12234, Xu–Sang
2610.15291, Liu 2610.26835).

Labels: PROVED / PROVED-rel X / CITED / SKETCH (derivation in outline, not checked numerically) / MEASURED (by a
sibling note, quoted) / MODEL / HEURISTIC / OPEN.

---

## 0. Plan; what differs from the closed lanes

Read: BRIEF, CRITIC_R1, atlas §10, and RESULT + REFEREE of the 13 listed lanes.

* Not repeated: Type I/II split with arbitrary coefficients (`r2-tro6-type12-split`, obstruction (BIL)); termwise
  Lindelöf for the periods (`tro6-period` Prop 4.1); the ledger of sieves on the μ-variable (`tro6-shifted-conv`).
* What this note does that those did not:
  1. the c-aspect route is run with the polar term removed and with the functional equation applied before the
     sieve; each step gets an exponent (§2);
  2. the deficit is shown to be independent of the per-modulus input: it is the factor (D/Q)^{1/2} lost by
     Cauchy–Schwarz in the longer variable (§3, Proposition F, relative to a measured lower bound);
  3. the conductor of the twist is examined term by term with the method of Theorem P. For a prime modulus the
     non-polar remainder is negligible up to N(p) ≤ Q^{1−δ}, not Q^{1/2−δ}; the remainder is carried by divisor
     pairs of c (§4, SKETCH). The same computation gives the leading dual term without metaplectic Voronoi and
     fixes its orientation (theta coefficients at multiples of c, exponent 1);
  4. the price of η in the abscissa is computed at small η (§5).
* Outcome against the ledger of `tro6-shifted-conv/REFEREE.md`: the two mean-square variants of this route are its
  rows U2 (η-units −16) and U1 (−24). The route is those rows reached from the c-side. Removing the polar term and
  applying the functional equation first change no exponent.

## 1. Setting and normalisation

Notation of `r2-tro6-polar-theorem`. ρ(m) = ρ^♮_σ(−e₀m), Σ_{N(m)≤Q}|ρ(m)|² ≍ Q^{5/6} (Theorem A (MS); lower bound
not proved, see the polar referee E1). T(c) = Σ_m W(N(m)/Q)χ_c(m)ρ(m), P(c) its polar term (Theorem P),
R(c) = T(c) − P(c). Row weight β_c with |β_c| = a_c ≍ N(c)^{−1/2} on N(c) ≍ D = Q^{7/5}, so ‖β‖₂ ≍ 1.

  𝔅_R = Σ_c β_c R(c),  β_c = μ(c)Ψ(c)a_c·(unit).

Cauchy–Schwarz in m with Lemma 15.1 (‖B‖² ≪ Q^{1+ε}): |𝔅| ≪ Q^{11/12}. Target: Q^{11/12−η_Q}; η = 80η_Q.
Sizes: rms of T(c) is ‖ρW‖ ≍ Q^{5/12}; |P(c)| ≍ Q^{5/6}N(c)^{−1/3} = Q^{0.367} at N(c) = Q^{1.4}.

A_c(w) := Σ_m ρ(m)χ_c(m)N(m)^{−w} (absolutely convergent for Re w > 11/12; critical line Re w = 5/12).

## 2. The route, step by step

### 2.1 Continuation and conductor [PROVED-rel Theorem P, with its O(Q^{−A}) uniform in c]

For Re w large, A_c(w)Ŵ(w) = ∫₀^∞ T(c; Q)Q^{−w−1}dQ. Split at Q₀ = N(c)^{2+δ}. For Q > Q₀ Theorem P gives
T = P·Q^{5/6} + O(Q^{−A}); for Q < Q₀ use |T(c; Q)| ≪ Q^{11/12}. Hence A_c(w)Ŵ(w) minus one simple pole at w = 5/6
is entire, and for σ = Re w < 11/12

  A_c(w)Ŵ(w) − pole ≪ N(c)^{(2+δ)(11/12−σ)}.

So the conductor exponent of the twist is at most 2 (dual length N(c)²/Q), without a functional equation.
This bound returns T(c; Q) ≪ Q^{σ}N(c)^{2(11/12−σ)}, which for Q < N(c)² is smallest at σ = 11/12: the trivial bound.

### 2.2 Convexity and subconvexity for one modulus [arithmetic; the functional equation (V) is OPEN]

With a functional equation w ↔ 5/6 − w of conductor N(c)² (hypothesis (V) of `r2-tro6-type12-split`):
A_c(5/12 + it) ≪ N(c)^{1/2+ε}, and with a hypothetical saving δ_s: N(c)^{1/2−δ_s}. Then

  T(c; Q) ≪ min(Q^{11/12}, Q^{5/12}N(c)^{1/2−δ_s}).

The rows have Q = N(c)^{5/7} < N(c): the sum is shorter than the square root of the conductor. At N(c) = Q^{7/5}:

| per-modulus input | bound for T(c) | compared with |
|---|---|---|
| convexity (δ_s = 0) | Q^{5/12+0.7}: above the trivial bound Q^{11/12} by Q^{1/5} | gives nothing |
| subconvexity δ_s | Q^{5/12+0.7−1.4δ_s} | below trivial iff δ_s > 1/7 |
| Lindelöf (δ_s = 1/2) | Q^{5/12} | equals the rms size |

Summing |β_c||R(c)| over N(c) ≍ D multiplies by D^{1/2} = Q^{0.7}:

| per-modulus input | bound for 𝔅_R | exponent above Cauchy–Schwarz Q^{11/12} |
|---|---|---|
| trivial or convexity | Q^{0.7+11/12} | +7/10 |
| subconvexity δ_s | Q^{0.7+5/12+0.7−1.4δ_s} | +9/10 − 1.4δ_s (for δ_s ≥ 1/7) |
| Lindelöf | Q^{0.7+5/12} | +1/5 |

Beating Cauchy–Schwarz this way needs δ_s > 9/14 > 1/2, i.e. |R(c)| below Q^{5/12−1/5} for every c. That
contradicts the measured mean square (§3). No subconvexity bound for twists of θ₆ is known in any case.

### 2.3 Mean square over c with a large sieve [PROVED arithmetic from CITED sieves]

|𝔅_R| ≤ ‖β‖₂(Σ_{N(c)≍D}|R(c)|²)^{1/2}, and Σ_c|T(c)|² ≤ Δ(Q, D)·‖ρW‖².

| sieve | Δ at D = Q^{7/5} | bound for 𝔅_R | above Cauchy–Schwarz | η-units |
|---|---|---|---|---|
| sextic large sieve, manuscript Lemma 9.1: Q + D + (QD)^{2/3} | Q^{1.6} | Q^{0.8+5/12} | +3/10 | −24 |
| optimal form Q + D (not known for sextic characters) | Q^{1.4} | Q^{0.7+5/12} | +1/5 | −16 |

Removing P(c) first changes nothing: Σ_c|P(c)|² ≍ Q^{5/3}D^{1/3} = Q^{2.13} against D‖ρW‖² = Q^{2.23}.

### 2.4 Functional equation first, then the sieve [CONDITIONAL-on (V); §4 supports its shape]

Dual form of R(c): N(c)^{−3/2}Q·Σ_{δ|c}μ(c/δ)N(δ)Σ_{m′}ρ̃*(δm′)w̃(N(δm′)Q/N(c)²)·Q^{−1/12}. With c = δc′, N(c′) ≍ Y′,
Cauchy–Schwarz in δ gives Q^{1.2}/Y′ in the normalisation where the target is Q^{1−η_Q}
(`r2-tro6-type12-split` §3.3, re-derived). At Y′ = 1 this is +1/5 again. A large sieve in the pair (δ | m′) cannot
do better than Cauchy–Schwarz in δ, because the kernel ρ̃*(δm′) has no character structure in δ.

### 2.5 Total

The route never beats Cauchy–Schwarz. Best case +1/5 (η-units −16); with existing tools +3/10 (−24).
η = 0.01 corresponds to η_Q = 1.25·10⁻⁴; the route misses that by Q^{0.2001}.

## 3. Why the deficit is (D/Q)^{1/2} for every input

**Proposition F [PROVED-rel (LB)].** Suppose (LB): Σ_{N(c)≍D, c squarefree}|R(c)|² ≥ c₀·D·‖ρW‖². Then every bound of
the form |𝔅_R| ≤ ‖β‖₂·(upper bound for Σ_c|R(c)|²)^{1/2}, and every bound Σ_c|β_c|·M with M a bound for |R(c)| valid
for all c in the dyadic block (convexity, subconvexity and Lindelöf bounds are of this kind), is
≫ D^{1/2}‖ρW‖ ≍ Q^{11/12}(D/Q)^{1/2}. In the toy geometry (D/Q)^{1/2} = Q^{1/5} = Z^{1/6}.

*Proof.* The first form is at least ‖β‖₂(Σ|R(c)|²)^{1/2} ≥ c₀^{1/2}D^{1/2}‖ρW‖, since ‖β‖₂ ≍ 1. For the second,
M ≥ max|R(c)| ≥ (#{c}^{−1}Σ|R(c)|²)^{1/2} ≥ c₀^{1/2}‖ρW‖ and Σ_c|β_c| ≍ D^{1/2}. ∎

* (LB) is MEASURED, not proved: mean |R(c)|²/‖ρ‖² = 1.7–1.9 on non-resonant cells for N(c) up to 10⁷ at Q = 30000
  (`r2-tro6-nonpolar-scale` §4.1), 1.82–1.83 at Q = 2400, 3199 (`r2-tro6-type12-split` §6.5 and its referee). It is a
  theorem only for D ≥ Q^{2+ε} (the off-diagonal character sums are then longer than their conductor).
* Reading. The m-variable has length Q, the c-variable length D = Q^{1.4}. Cauchy–Schwarz in m with the reflected
  energy bound ‖B‖² ≪ Q is the efficient direction; any ℓ² or ℓ¹ treatment of the c-sum pays (D/Q)^{1/2}. A proof of
  (RB_η) has to keep the sign of μ(c)Ψ(c) in the c-sum. That is the Type I/II problem closed as an obstruction in
  round 2, or a prime-sum type statement for θ₆ (§4.3).

## 4. Pivot (single): which moduli carry the remainder, by the method of Theorem P [SKETCH]

Inputs: Lemma F and Steps 1–5 of `r2-tro6-polar-theorem` (Poisson in m, Hecke L-functions in the Kubota modulus s),
Lemma A.0 of `sextic-theta-proof.md`, and the Kazhdan–Patterson relations ρ(mp⁵) = 0, ρ(mp⁴) ∝ G₅(m, p)ρ(m)
(CITED in `sextic-theta-literature.md` §2.3 "in the heuristic setting that ignores bad primes").
Nothing in this section was checked numerically.

### 4.1 Term-by-term conductor

In Step 5 of Theorem P write s = δs′ (δ | c, (s′, c) = 1) and remove (s′, c/δ) = 1 by Möbius: s′ = es″, e | c/δ.
For the pair (δ, e) the s″-sum has length X/N(δe); the frequency n ranges to N(n) ≲ XN(c)/(N(δ)Q); the s″-character
χ_•(nδ/e₀) has conductor ≲ N(n)N(δ). So the non-resonant part of the pair (δ, e) is O(Q^{−A}) as soon as

  **N(c)·N(δe) ≤ Q^{1−ε}.**

Theorem P's condition N(c)² ≤ Q^{1−2δ} is the worst pair δe = c. The pair (1, 1) (all s, no coprimality) needs only
N(c) ≤ Q^{1−ε}.

### 4.2 Prime moduli

For c = p prime the pairs are (1, 1), (1, p), (p, 1) (+ its Möbius partner). For Q^{1/2+δ} ≤ N(p) ≤ Q^{1−δ}:
* (1, 1): resonant frequencies give the polar term; the rest is O(Q^{−A}).
* (1, p), frequencies prime to p: the Poisson transform of Σ_m W(N(m)N(p)²/Q)·(p-coprime residue at index m). The sum
  is empty when N(p)² > Q/inf(supp W). For N(p)² ≤ Q^{1−δ} it is a c = 1 first moment (polar, relative size N(p)^{−3/2}).
* (1, p), frequencies n = pn′: a first moment of the p-coprime residue at index mp⁵, which vanishes by ρ(mp⁵) = 0 and
  the 1 × 1 block (5, 5) of Lemma A.0.
* (p, ·): exactly γ₁(p)conj χ_p(−e₀)N(p)^{−2/3}Σ_{p∤m}W(N(m)/Q)·v₄(−e₀m), v₄ the p-coprime residue at index mp⁴
  (Lemma 2.1 of `r2-tro6-type12-split`). By the relation 0 ↔ 4 it is O(N(p)^{−4/3}) times a moment of the same type.

> **Statement P′ [SKETCH].** For prime p ∤ 6 with N(p) ≤ Q^{1−δ}, outside the window N(p)² ≍ Q:
> T_σ(p) = P_σ(p)·(1 + O(N(p)^{−1})) + O(Q^{−A}). In the window there is one further explicit term with finitely many m.

* The effective conductor of the twist by χ_p is N(p), not N(p)². This agrees with the Ramanujan-sum shape of (V)
  (terms δ = 1 and δ = p only) and with the non-monotone profile measured on prime moduli in
  `r2-tro6-type12-split` §3.4 (rise near Q^{1/2}, dip, rise near Q). It does not agree with a reading of
  `r2-tro6-polar-theorem` §5.3 in which the residual above Q^{1/2} is a non-polar remainder for all c; on prime c
  that residual would be the transient term and estimator noise. Not tested.
* For composite squarefree c the remainder below Q comes only from pairs with N(δe) ≥ Q^{1−ε}/N(c); each such pair is
  a twisted moment for the modulus c/(δe) at a shorter length.
* None of this reaches the rows: at N(c) ≍ Q^{7/5} the pair (1, 1) itself is outside the range.

### 4.3 The pair (1, 1) above Q: leading dual term and its orientation

For N(c) > Q the s-character χ_•(n/e₀) has conductor N(n) up to XN(c)/Q > X. Poisson in s modulo n produces the
Gauss sum γ₁(n) and the dual character conj χ_n(s̃), N(s̃) ≲ N(c)/Q. With conj χ_c(n) = (unit)·conj χ_n(c) the n-sum
is Σ_n g̃(c s̃, n)·(smooth), a Kubota series at index c·s̃ of length XN(c)/Q, whose X^{2/3} term is the theta
coefficient. So

  R(c) ≈ (unit)·γ₁(c)·N(c)^{−1/2}Q^{11/12}·Σ_{N(s̃) ≲ N(c)/Q} ρ̃(u·c·s̃)·w̃(N(s̃)Q/N(c)) + (terms from proper divisors).

* The dual coefficient is θ₆ at index c·s̃ (exponent 1 at the primes of c), with no Gauss sum after multiplying by
  conj γ₁(c). This is the δ = c term of (V) and settles the orientation question left open in
  `r2-tro6-type12-split` §3.4 at the level of a sketch: Ramanujan sums, not cubic Gauss sums.
* Consequence (same as (MB) of `tro6-period`, now from two derivations): with n = c s̃, X = D²/Q = Q^{9/5},

    𝔅_R ≈ Σ_{N(s̃) ≲ X^{2/9}} (weight)·Σ_{n ≡ 0 (s̃), N(n) ≍ X} μ(n/s̃)Ψ(n/s̃)·ρ̃(n).

  Each inner sum is a Möbius-and-character twisted sum of θ₆ coefficients in a progression, of length X^{7/9}.
  The Cauchy–Schwarz level is X^{5/9} per progression. So (RB_η) is a prime-number-theorem type bound for θ₆ with
  saving exponent 2/7 of the length (square-root cancellation is 1/2), uniform over moduli up to length^{2/7}.
  Known results of that type (Dunn, arXiv:2403.13151, cubic cusp forms at primes) save X^{−1/578}.

## 5. Price of η [MODEL; relative to the unrefereed inputs]

`eta_price.py` reruns the comparison LP of `bypass-78/price_list.py` unchanged (Gram exponent b/12 → (1−η)b/12;
optimistic gates as stated there).

| η | abscissa | gain against 0.8748865 |
|---|---|---|
| 0.001 | 0.8748808 | 5.7·10⁻⁶ |
| 0.005 | 0.8748578 | 2.9·10⁻⁵ |
| 0.01 | 0.8748284 | 5.8·10⁻⁵ |
| 0.0219 | 0.8747534 | 1.3·10⁻⁴ |
| 0.05 | 0.8745513 | 3.4·10⁻⁴ |
| 0.1 | 0.8741034 | 7.8·10⁻⁴ |
| 0.2 | 0.8728704 | 2.0·10⁻³ |

Slope at η = 0: dB/dη = −0.00574. η = 0.01 is worth 5.8·10⁻⁵ in the abscissa and needs η_Q = 1.25·10⁻⁴.
No η is proved here, so no abscissa is claimed.

## 6. Controls

* **DH.** No positive statement is made. Every bound of §2 holds for arbitrary coefficients β_c of the same modulus,
  hence for a Davenport–Heilbronn combination of two targets; the route uses no Euler product, which is the reason
  it cannot succeed (Theorem D: TRO6 is equivalent to an improved zero-free region). The step that would have to use
  multiplicativity is the signed sum over c with μ(c)Ψ(c) (§4.3).
* **Sign twist, backward heat.** Not engaged: nothing here is a statement about zeros. A sign twist ε_c on β_c leaves
  every bound of §2 unchanged.
* **MV-CAP, verified height.** §2.3 is a mean value over c used for a single form, and Proposition F is the statement
  that this cannot work. No finite certificate.
* §4 concerns θ₆ and sextic characters only (no target).

## 7. Verdict

* Precise obstruction for the route "c-aspect bound per modulus, then large sieve over c": deficit Q^{+1/5} at best,
  Q^{+3/10} with the sextic large sieve, Q^{+7/10} with convexity; convexity is vacuous because Q < N(c).
* PROVED-rel Theorem P: A_c(w) minus its pole is entire with conductor exponent ≤ 2.
* PROVED-rel (LB) (measured): the deficit (D/Q)^{1/2} holds for every per-modulus or mean-square input.
* SKETCH: pairwise conductor condition N(c)N(δe) ≤ Q^{1−ε}; polar law for prime moduli up to Q^{1−δ}; leading dual
  term at index c·s̃; (RB_η) as a twisted prime-sum bound for θ₆ with exponent 2/7.
* MODEL: η = 0.01 would give 0.8748284.
* No η > 0. No change to θ or to any Λ value.

## 8. Three weakest steps

1. **§4 is a sketch.** The Möbius removal of coprimality, the un-Poisson step for the pair (1, p), the uniformity in
   n, the class twists R(s, c), units and the primes 2, λ are carried at the level of exponents only. The vanishing
   used for n = pn′ and the size of the (p, ·) term rest on Kazhdan–Patterson relations cited in a setting that
   ignores bad primes. Statement P′ has no numerical test; the stored estimator (sharp cutoff 10⁷) cannot test it.
2. **(LB) is measured**, with 20% estimator noise in the measured mean square, and only in the toy rows. Proposition F
   is conditional on it. Without (LB) the tables of §2 are still the exponents the named tools give.
3. **Toy geometry.** D = Q^{7/5}, n = 1, S′ = ∅, one scale. The polar referee (E1) notes that the row length and the
   lower bounds for ‖B‖ and M^♮ are not read from the manuscript. The deficit (D/Q)^{1/2} uses only D > Q, but its
   value 1/5 and the exponents 2/9, 2/7 of §4.3 depend on the ratio 7/5.

## 9. Reproduction

`.venv-arb/bin/python tmp/research-2026-11-16/push/r3-nonpolar-proof/eta_price.py` (40 s, single process; imports
`../bypass-78/price_list.py`). Output in `eta_price.log`.
