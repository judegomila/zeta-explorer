# RH attempt R3 (1 November 2026): a parity-breaking one-sided Landau bound from Type-II (bilinear) input

Internal working note. Not externally refereed, not committed. Branch `editorial-redesign`. Scripts
`tmp/rha-type2-parity-*.py`, outputs `tmp/rha-type2-parity-out/`. Proposal N4 of the round-2 synthesis
(`2026-11-01-r2-synthesis.md` §4, item 4).

**Verdict (author's attack; a fresh referee has not yet run).** The argument fails. The first unproved
claim is Step 4, claim (K): a contraction bound for the bilinear (Type-II) renewal operator. As stated,
(K) is **false**: the operator has eigenvalue exactly 1 on every zero mode, whatever the real part of the
zero (Theorem C, checked numerically to 6·10⁻¹⁴ at the first ten zeros). The two weaker routes to the
same step also fail. Cauchy–Schwarz in the long variable loses a factor ≍ M^{1/2} ≥ X^{1/8} even if RH is
granted on the other side (Theorem CS0). Dispersion leaves a frequency-0 mean square J(N), and a bound for
J(N) at square-root precision is equivalent to the zero-free half-plane Re s > ½ (Theorem J). Every one-sided
Type-II bound with exponent α is equivalent to the half-plane Re s > ½ + α (Theorem OS), so taking only one
side gains nothing. RH is open. Platt–Trudgian Λ ≤ 0.2 stands. No Λ bound and no zero-free region changes.
NO QED.

**What the attempt does avoid.** In the identity form used here, the Type-I part is square-root precise
without any hypothesis (Proposition 2.2; measured errors ≤ 0.022 for 10⁶ ≤ X ≤ 10¹⁰). So the parity factor of
round-2 Theorem P never appears, and no zero is counted, so the 13/15 floor never appears. All of the
difficulty sits in one bilinear quantity, and its size is measured: the Type-II piece must be evaluated with
a saving of 1.5·10³ (X = 10⁶) to 3.4·10⁵ (X = 10¹⁰) over its trivial size. Asymptotically that is X^{1/2}
up to logarithms. The best known saving at frequency 0 is exp(c(log X)^{3/5−o(1)}) unconditionally, and
X^{1/8} from the 7/8 half-plane (Lean-checked locally, not peer reviewed).

Grades: **PROVED** (complete argument written here; internal check only), **STANDARD** (classical, cited),
**RECALLED** (literature statement recalled, not re-checked on this machine), **MEASURED** (IEEE double, not
interval-certified), **ARGUED**, **HEURISTIC**.

---

## 0. The PR #27 audit and rounds 1–2

### 0.1 Was the audit read first?

Yes. The snapshots `/tmp/atlas-snap-*.md` (route atlas §§1–12 and closing line; PUBLICATION_SCOPE_2026-10-30;
arithmetic foundation; Suzuki recurrence; prime memory; finite Suzuki certificate; signed complement;
spectral head; spectral-denominator repair; whole-even certificate) were read before any part of this file
was written. So were the round-1 and round-2 syntheses and these round files:
* round-2 Stepanov, Theorem P/P′ and §5.4;
* round-2 density profile, Theorem P/Q;
* round-2 harmonic floor, Remark H5.1 and its referee correction;
* round-1 bootstrap, Lemma III.4, Corollary III.5 and Theorem III.1;
* round-1 operator, Theorem E.

For the walls I read:
* `src/data/flow-blindness-no-go.js` (the SL2 statement);
* `src/data/imp-95530-native-span-arithmetic-input-rigidity.js` (NS-RIGID, RES-T and the loophole class);
* `formalization/paper/mv-cap-theorem.md` (route 42), including the referee corrections it quotes from
  `src/data/route-42-formal-mv-cap-2026-10-10.js`. That JS module was not opened separately.

The vortex-blocker README was not needed and was not read.

### 0.2 Overlap table (every overlap cites its section; what is different)

| object used here | where it already is | what this file adds |
|---|---|---|
| Landau one-sided theorem (Step 1) | arithmetic foundation §2; round-1 operator Theorem E | the exponent form, Proposition 1.2 (a short corollary) |
| exact Vaughan centering (Step 2) | arithmetic foundation §4: "retains the signed Type-I/Type-II terms and subtracts the continuum main term once"; "replacing the centered signed remainder by independent absolute values is not the theorem's hypothesis" | the square-root scale U = V = X^{1/4}, with explicit Type-I error constants (Proposition 2.2), and measurements up to X = 10¹⁰ |
| Type II carries every zero | bootstrap Lemma III.4: residue −m(ρ) because 1 − ζM_U = 1 at ρ | the same fact as a renewal operator on R(X) = S(X) − 2√X, with resolvent 1/(ζM_U) (Theorem C(iii)), and measured at the first ten zeros |
| no bootstrap through Landau functionals | bootstrap Corollary III.5 and Theorem III.1 | the one-sided Type-II version for this split (Theorem OS) |
| "Type II at frequency 0 is Möbius cancellation at all scales" (ARGUED) | round-2 Stepanov §5.4 | written out: Theorem CS0 (the Cauchy–Schwarz loss), Theorem J (dispersion leads to a zero-free region), and the needed-versus-known table of §4 |
| parity cap of Type-I majorants | round-2 Stepanov Theorem P/P′ | avoided by using an identity. The λ-twisted majorant (Proposition L) breaks the factor 2 down to 1.08 but keeps an excess of 0.16√X (MEASURED) |
| 13/15 floor | round-2 density Theorem P/Q | avoided: no zero is counted (§5.4) |
| square-root precision is a zero-free-region statement | round-2 harmonic floor Remark H5.1 (referee correction) | made quantitative: Theorems OS and J |
| visibility length of an off-line zero | round-1 contradiction Lemma 2; round-2 phase alignment N_vis | Remark 3.6: the zero becomes visible only at scales where every Type-II box is outside the large-sieve range |
| V7 floor dictionary p ↔ (1 + p)/2; PR #14/Xu–Sang B = 0.87488665 (conditional) | atlas §10 | the Type-II exponent α corresponds to the half-plane ½ + α and to p = 2α (§4) |
| a uniform positive margin is the wrong target | atlas §11 | (★) has no margin: R(X) oscillates about −ζ′/ζ(½) = −2.686 under RH. No margin is claimed |
| the open task: "a genuine all-scale signed arithmetic estimate" | atlas closing line | the Type-II input of Step 4 is exactly the first item of that line (Theorem OS) |
| FKS explicit PNT, \|ψ(x) − x\| ≤ 9.22022x(log x)^{3/2}e^{−0.8476836√log x} | prime-memory module §1 | used as the explicit "known" row of §4 |

Nothing in this file repeats a recorded failure without saying what differs. The pieces closest to earlier
work are Theorem C, which is bootstrap Lemma III.4 in renewal form, and Theorem OS, which is a one-sided
corollary of bootstrap Theorem III.1 and arithmetic foundation §2. Both are re-derived because Step 4 is
attacked through them.

---

## 1. Target and notation

* Λ is the von Mangoldt function, μ the Möbius function, λ(n) = (−1)^{Ω(n)} the Liouville function.
* S(X) = Σ_{n≤X} Λ(n) n^{−1/2} and R(X) = S(X) − 2√X, for real X ≥ 1.
* M_U(s) = Σ_{d≤U} μ(d) d^{−s}, m(U) = M_U(1), L_V(s) = Σ_{ℓ≤V} Λ(ℓ) ℓ^{−s}.
* ZF(θ) means that ζ(s) ≠ 0 for Re s > θ.

**(★)** There are C, m, X₀ with R(X) ≤ C(log X)^m for every real X ≥ X₀.

**Theorem 1.1 (Landau; PROVED in arithmetic foundation §2 and round-1 operator Theorem E).** (★) implies RH.
Conversely, RH implies R(X) = O(log² X).

**Proposition 1.2 (exponent form; PROVED).** Let 0 ≤ α < ½. Suppose R(X) ≤ C X^α (1 + log X)^m for X ≥ X₀.
Then ZF(½ + α). Conversely, ZF(½ + α) with α > 0 implies |R(X)| ≪_ε X^{α+ε}.

*Proof.* Put D(W) = Σ_{n<e^W} Λ(n)n^{−1/2}(W − log n) − (4e^{W/2} − 2W − 4), the discrepancy of the arithmetic
foundation §1. Then D(0) = 0 and dD/dW = R(e^W) + 2 almost everywhere, so D(W) = ∫₀^W (R(e^r) + 2) dr.
The hypothesis gives D(W) ≤ C′(1 + W)^{m+1} e^{αW} for W ≥ 0. The theorem of arithmetic foundation §2
then gives ZF(½ + α). For the converse, ψ(x) − x ≪ x^{½+α+ε} under ZF(½ + α) (truncated explicit formula),
and partial summation in R(X) = −1 + (ψ(X) − X)/√X + ½∫₁^X (ψ(u) − u)u^{−3/2} du gives the bound. ∎

The constant here is −1, not −2. This is the round-1 referee's correction to Theorem E(ii), and round-2
Stepanov §1 also writes −2. It follows from 2√X = X·X^{−1/2} + ½∫₁^X u^{−1/2} du + 1. With −1, the mean value
under RH is −1 + ½·[2(−ζ′/ζ)(½) + 2] = −ζ′/ζ(½) = −2.686, which agrees with the Mellin residue below.

**Numerics (MEASURED; `tmp/rha-type2-parity-vaughan.py`).**

| X | 10⁶ | 10⁷ | 10⁸ | 10⁹ | 10¹⁰ |
|---|---|---|---|---|---|
| R(X) | −3.0932 | −3.1435 | −2.8673 | −2.6419 | −2.2622 |

* The 10⁶–10⁸ values are direct sieve sums. They agree with the identity of §2 to ≤ 3.1·10⁻¹¹ and with
  round-2 Stepanov §1 (−3.0932 at 10⁶, −3.143 at 10⁷).
* The 10⁹ and 10¹⁰ values come from the identity of §2 alone, which uses primes up to X^{3/4} and μ up to
  X^{1/4}. They are not independently checked.
* Under RH, R oscillates about the constant −ζ′/ζ(½) = −2.686. That constant is the residue at s = 0 of the
  Mellin transform (1/s)(−ζ′/ζ)(s + ½) − 2/(s − ½) of R.
* These values are consistent with RH and prove nothing (atlas §11).

---

## 2. The argument (attempted proof of RH)

**Theorem (target).** RH.

The plan is as follows.
* Reduce RH to (★) (Step 1).
* Write S(X) by Vaughan's identity at the square-root scale (Step 2). Every Type-I piece is then evaluated
  exactly up to O(1), so R(X) is the centred Type-II piece up to O(1).
* Write the Type-II piece as a renewal equation for R (Step 3).
* Use a bilinear (Type-II) estimate, the parity-breaking input, to show the renewal operator contracts
  (Step 4).
* Close by induction on X (Step 5).

### Step 1 (reduction; PROVED)

By Theorem 1.1 it suffices to prove (★).

### Step 2 (Vaughan's identity at the square-root scale; PROVED)

For X ≥ 16 put U = V = ⌊X^{1/4}⌋, so that UV ≤ X^{1/2}. Vaughan's identity (STANDARD; arithmetic
foundation §4) is

  Λ = μ_{≤U} ∗ log − μ_{≤U} ∗ 1 ∗ Λ_{≤V} + Λ_{≤V} + a_U ∗ Λ_{>V},  a_U := μ_{>U} ∗ 1.

Here a_U(1) = 0, a_U(m) = −Σ_{d∣m, d≤U} μ(d) for m > 1, a_U(m) = 0 for 1 < m ≤ U, and |a_U(m)| ≤ τ(m).
Weighting by n^{−1/2} and summing over n ≤ X gives S(X) = I₁ − I₂ + I₃ + T(X), with

* I₁ = Σ_{d≤U} μ(d) d^{−1/2} Σ_{b≤X/d} b^{−1/2} log b,
* I₂ = Σ_{d≤U, ℓ≤V} μ(d) Λ(ℓ) (dℓ)^{−1/2} Σ_{b≤X/(dℓ)} b^{−1/2},
* I₃ = S(V) = L_V(½),
* T(X) = Σ_{U<m≤X/(V+1)} a_U(m) m^{−1/2} (S(X/m) − S(V)).

T(X) is the Type-II piece. It uses μ(d) only for d ≤ U, and Λ(n) only for n < X/U = X^{3/4}.

**Lemma 2.1 (Euler–Maclaurin with explicit constants; PROVED).** Let B₁(x) = x − ½. For real y ≥ 1, Re s > 0
and s ≠ 1,

  Σ_{b≤y} b^{−s} = ζ(s) − y^{1−s}/(s − 1) − B₁({y}) y^{−s} + s ∫_y^∞ B₁({u}) u^{−s−1} du.

Hence
* |Σ_{b≤y} b^{−1/2} − 2√y − ζ(½)| ≤ y^{−1/2}, and
* |Σ_{b≤y} b^{−1/2} log b − 2√y log y + 4√y + ζ′(½)| ≤ y^{−1/2}(2 + log y).

*Proof.* For Re s > 1, Σ_{b>y} b^{−s} = ∫_y^∞ u^{−s} d⌊u⌋. Insert ⌊u⌋ = u − ½ − B₁({u}) and integrate by parts.
The result continues analytically to Re s > 0.
* At s = ½ the error is at most ½y^{−1/2} + ½·½·2y^{−1/2}.
* Differentiate in s for the logarithmic sum. The three error terms are bounded by ½y^{−1/2} log y,
  ½·2y^{−1/2} and ¼(2y^{−1/2} log y + 4y^{−1/2}), using ∫_y^∞ u^{−3/2} log u du = 2y^{−1/2} log y + 4y^{−1/2}. ∎

The formulas were checked against direct sums. The asymptotic forms in the script agree to ≤ 6·10⁻¹² for
400 ≤ y ≤ 10⁵.

**Proposition 2.2 (square-root Type-I lemma; PROVED).** For X ≥ 16 and U = V = ⌊X^{1/4}⌋,

* I₁ = MT₁ + E₁, where MT₁ = 2√X Σ_{d≤U} (μ(d)/d)(log(X/d) − 2) − ζ′(½) M_U(½) and |E₁| ≤ U(2 + log X)/√X,
* I₂ = MT₂ + E₂, where MT₂ = 2√X m(U) L_V(1) + ζ(½) M_U(½) L_V(½) and |E₂| ≤ U ψ(V)/√X ≤ 1.04.

Consequently

  **R(X) = T(X) − MT_II(X) + E₁ − E₂**, with MT_II(X) := 2√X − MT₁ + MT₂ − S(V)
  and |E₁ − E₂| ≤ X^{−1/4}(2 + log X) + 1.04.

*Proof.* Apply Lemma 2.1 with y = X/d in I₁ and y = X/(dℓ) in I₂. Since dℓ ≤ UV ≤ √X, every y is ≥ √X ≥ 1.
* The errors in I₁ sum to at most Σ_{d≤U} d^{−1/2}(d/X)^{1/2}(2 + log X) ≤ U(2 + log X)/√X.
* The errors in I₂ sum to at most Σ_{d≤U, ℓ≤V} Λ(ℓ)(dℓ)^{−1/2}(dℓ/X)^{1/2} ≤ Uψ(V)/√X.
* ψ(V) < 1.03883 V (Rosser–Schoenfeld, STANDARD) and UV ≤ √X give the bound 1.04 for E₂.
* The main terms are collected by algebra. ∎

| X | U | E₁ | bound | E₂ | bound | identity residual (direct S) |
|---|---|---|---|---|---|---|
| 10⁶ | 31 | −2.1·10⁻² | 0.49 | 3.8·10⁻³ | 0.99 | 3.4·10⁻¹² |
| 10⁷ | 56 | 1.2·10⁻³ | 0.32 | 1.0·10⁻² | 0.95 | 3.1·10⁻¹¹ |
| 10⁸ | 100 | −2.8·10⁻³ | 0.20 | 3.9·10⁻³ | 0.94 | −1.1·10⁻¹¹ |
| 10⁹ | 177 | 6.3·10⁻⁴ | 0.13 | −1.1·10⁻³ | 0.98 | (identity only) |
| 10¹⁰ | 316 | −5.4·10⁻⁴ | 0.08 | −2.6·10⁻⁴ | 1.00 | (identity only) |

**Remark 2.3 (why Theorem P does not appear; PROVED).**
* Round-2 Theorem P is about Type-I *majorants*: W ≥ 0, W(p) ≥ 1. A majorant of level ≤ X^{1−ε} certifies at
  best 4√X.
* Here the Type-I pieces are parts of an *identity*, and at level UV ≤ √X they are exact up to O(1). The
  sawtooth errors, of size (X/d)^{−1/2}, sum to O(1) when weighted by d^{−1/2} over d ≤ √X.
* So in an identity the parity barrier is not a constant factor. It returns as one requirement:
  T(X) − MT_II(X) must be O(polylog). By Proposition 2.2 that is (★) up to an additive 2.
* MEASURED: T − MT_II = −3.068, −3.135, −2.861, −2.644, −2.262 at X = 10⁶ … 10¹⁰. The trivial size of T is
  T_triv := Σ |a_U(m)| m^{−1/2}(S(X/m) − S(V)) = 4.50·10³, 1.71·10⁴, 6.20·10⁴, 2.18·10⁵, 7.69·10⁵. Hence
  T_triv ≈ 0.33 √X log X.
* So the Type-II piece must be evaluated with a saving factor T_triv/|R| of 1.45·10³, 5.44·10³, 2.16·10⁴,
  8.25·10⁴ and 3.40·10⁵. That growth is ≈ X^{0.57–0.62} per decade, i.e. X^{1/2} up to logarithms.

**Remark 2.4 (the usual Type-II main term is wrong at this precision; PROVED; sizes MEASURED).**
* The usual main term of a Type-II sum replaces Λ(n) by its mean 1:
  T⁰ := Σ_{m>U, n>V, mn≤X} a_U(m)(mn)^{−1/2}.
* T − T⁰ has Dirichlet series A_U(s)·[−ζ′/ζ(s) − L_V(s) − ζ(s) + Z_V(s)], with A_U = 1 − ζM_U and
  Z_V(s) = Σ_{n≤V} n^{−s}.
* At s = 1, −ζ′/ζ − ζ = −2γ + O(s − 1) is regular, while A_U has a simple pole with residue −m(U). So the
  product has a simple pole with residue

  δ_{UV} := m(U)(2γ + L_V(1) − Z_V(1)) = m(U)(ε₁(V) + O(1/V)),  ε₁(V) := L_V(1) − log V + γ.

* Hence T − T⁰ contains the term 2√X δ_{UV}. Unconditionally this term is ≪ √X e^{−c√log X}. Under RH it is
  ≪ X^{1/2} U^{−1/2+ε} V^{−1/2+ε} = X^{1/4+ε}.
* MEASURED: 2√X δ_{UV} = −8.83, 0.20, −29.46, 1.89, −4.65 at X = 10⁶ … 10¹⁰, against |R| ≈ 3.
* So at square-root precision the Type-II main term depends on the fluctuations of the Möbius sum m(U) and
  the Mertens sum ε₁(V). They are explicit finite sums, so this is not an error, but "explicit" does not
  mean "small". The explicit pieces are larger than R and cancel against the bilinear term (Step 3).

### Step 3 (renewal form of the Type-II piece; PROVED, exact)

For U < m ≤ X/(V + 1), S(X/m) − S(V) = (2√(X/m) − 2√V) + (R(X/m) − R(V)). Hence T = T_sm + K_X[R], with

  T_sm(X) = Σ_{U<m≤X/(V+1)} a_U(m) m^{−1/2}(2√(X/m) − 2√V),
  K_X[r] = Σ_{U<m≤X/(V+1)} a_U(m) m^{−1/2}(r(X/m) − r(V)).

With Proposition 2.2 this gives the exact renewal identity

  **R(X) = Ξ(X) + K_X[R] + E₁ − E₂,  Ξ(X) := T_sm(X) − MT_II(X).**

* Ξ(X) is explicit. It depends only on μ(d) for d ≤ U, on Λ(ℓ) for ℓ ≤ V, and on ζ(½), ζ′(½).
* K_X uses R only on [V, X/U), that is, at scales ≤ X^{3/4}.

| X | 10⁶ | 10⁷ | 10⁸ | 10⁹ | 10¹⁰ |
|---|---|---|---|---|---|
| Ξ(X) | 7.870 | −2.798 | 23.499 | −3.704 | 3.144 |
| K_X[R] | −10.938 | −0.337 | −26.359 | 1.060 | −5.406 |
| R(X) | −3.093 | −3.143 | −2.867 | −2.642 | −2.262 |
| κ_abs(X) := Σ \|a_U(m)\| m^{−1/2} | 140.9 | 323.6 | 749.3 | 1726 | 4042 |

(MEASURED; `vaughan-*.json`.) Ξ and K_X[R] are each up to ten times larger than R, and they cancel.

**Proposition 3.1 (leading term of the explicit forcing; PROVED; checked numerically).**

  Ξ(X) = −2√X m(U) ε₁(V) + R(V)(1 − ζ(½)M_U(½)) − ζ′(½)M_U(½) + O(1),  ε₁(V) = L_V(1) − log V + γ.

*Proof.*
* Evaluate T_sm with Σ_{U<m≤Y} a_U(m)/m = 1 − Σ_{d≤U} (μ(d)/d) H(Y/d), where H(z) = Σ_{k≤z} 1/k =
  log z + γ + O(1/z), and with Lemma 2.1 for Σ_{U<m≤Y} a_U(m) m^{−1/2}. Here Y = X/(V + 1). The
  Euler–Maclaurin errors total O(UV/√X) = O(1).
* Subtract MT_II.
* The two O(√X m(U)/V) terms, from log(V + 1) − log V and from 2√(V/(V + 1)) − 2, cancel at first order.
  The rest is algebra. ∎

Check against the measured values:
* At X = 10⁸ the formula gives 26.36 − 1.39 − 1.49 = 23.48; measured Ξ = 23.50.
* At X = 10⁶ it gives 10.84 + 1.14 − 4.08 = 7.90; measured 7.87.

So the forcing is dominated by a product of two square-root-scale fluctuations. Under RH,
m(U) ≪ U^{−1/2+ε} and ε₁(V) ≪ V^{−1/2+ε}, so the product has typical size X^{1/2}(UV)^{−1/2} = X^{1/4}
(HEURISTIC as a lower bound; it would need joint Ω-information on m and ε₁). K_X[R] = R − Ξ + O(1) then has
the same size.

### Step 4 (the Type-II input; this is where parity is to be broken)

**Claim (K).** There are η ∈ (0, 1), m ≥ 0 and C₀ such that, for every large X and every r on [V, X/U) with
|r(y)| ≤ B(1 + log y)^m:
* (K-i) |Ξ(X)| ≤ C₀(1 + log X)^m;
* (K-ii) |K_X[r]| ≤ (1 − η)B(1 + log X)^m + C₀(1 + log X)^m, at least for r = R.

*Justification offered (the mollifier reading of Type II).*
* (K-i) is Type-I data at level ≤ X^{3/4} with explicit main terms.
* For (K-ii), the kernel a_U(m)m^{−1/2} has Dirichlet series A_U(s + ½), with A_U = 1 − ζM_U. This is small
  wherever M_U mollifies ζ. The m-sum in K_X runs over the long range (U, X^{3/4}] where a_U oscillates, so
  K_X should damp every oscillating component of r: a bilinear contraction.
* The parity-sensitive input is the Möbius cancellation in a_U against the prime-supported Λ_{>V} inside R.
  No Type-I majorant can see it (Theorem P).

**Claim (K′) (box-wise form of (K-ii), via Cauchy–Schwarz and dispersion).** For each dyadic box
(M, 2M] ⊂ (U, X/V],

  |B_M| ≤ C₀(log X)^{m−1},  B_M := Σ_{M<m≤2M} a_U(m) m^{−1/2}(R(X/m) − R(V)).

Summing the O(log X) boxes gives |K_X[R]| ≤ C₀(log X)^m, and (K-ii) follows directly.

*Justification offered.* Apply Cauchy–Schwarz in m:

  |B_M|² ≤ (Σ_{m∼M} a_U(m)²/m)·Σ_{m∼M} |R(X/m) − R(V)|².

The first factor is O(1): it is 0.307 per box, MEASURED. In the second, write
R(X/m) − R(V) = Σ_{V<n≤X/m} (Λ(n) − 1)n^{−1/2} + O(V^{−1/2}), open the square, and sum over m by Poisson
summation (Linnik's dispersion). Only the frequency-0 mean square of the n-polynomial is left:

  J(N) := ∫_{−1}^{1} |P_N(t)|² dt,  P_N(t) := Σ_{N<n≤2N} (Λ(n) − 1) n^{−1/2−it},

and a polylogarithmic bound for J would be fed back in.

### Step 5 (closing the induction; PROVED given Step 4)

Assume (K). Choose B ≥ max_{y≤y₀} |R(y)|/(1 + log y)^m with ηB ≥ 2C₀ + 2. Suppose |R(y)| ≤ B(1 + log y)^m
for V ≤ y < X. Step 3 gives

  |R(X)| ≤ C₀(1 + log X)^m + (1 − η)B(1 + log X)^m + C₀(1 + log X)^m + 2 ≤ B(1 + log X)^m.

By induction over X, (★) holds, and Theorem 1.1 gives RH. ∎ (conditional on Step 4)

### Status of each step

| step | status |
|---|---|
| 1 | PROVED (arithmetic foundation §2; Theorem 1.1) |
| 2 | PROVED (Lemma 2.1, Proposition 2.2; measured to X = 10¹⁰) |
| 3 | PROVED (exact identity; measured) |
| **4** | **First unproved step; the contraction form of (K-ii) is FALSE** (Theorem C: eigenvalue exactly 1 on every zero mode). (K′) fails by a factor ≍ M^{1/2} even granting RH on the n-side (Theorem CS0). The dispersion input J(N) ≪ polylog is equivalent to RH (Theorem J). (K-i) is not supplied by Type-I data: by Proposition 3.1, Ξ(X) = −2√X m(U)ε₁(V) + O(…), of size X^{1/4} under RH (HEURISTIC; MEASURED 23.5 at 10⁸). It cancels only against K_X[R] |
| 5 | PROVED given (K) |

---

## 3. The attack on Step 4

### 3.1 Criticality of the Type-II renewal operator

**Theorem C (PROVED).** Let U ≥ 1 and a_U = μ_{>U} ∗ 1.

1. A_U(s) := Σ_m a_U(m) m^{−s} = 1 − ζ(s)M_U(s) for Re s > 1. It continues meromorphically to ℂ with at most
   a simple pole at s = 1, of residue −m(U).
2. **A_U(ρ) = 1 at every zero ρ of ζ**, for every U and whatever Re ρ is.
3. For φ_σ(x) = ½ erfc((log x)/σ) (σ > 0), every zero ρ, every Y ≥ 1 and every c > 0:

   Σ_m a_U(m) m^{−ρ} φ_σ(m/Y) = 1 − m(U) φ̃_σ(1 − ρ) Y^{1−ρ} + O_{U,σ,ρ,c}(Y^{−c}),  φ̃_σ(w) = e^{σ²w²/4}/w.

4. (Resolvent form.) Extend R by 0 on (0, 1) and let K_∞[r](X) := Σ_{m>U} a_U(m) m^{−1/2} r(X/m). Write
   𝓜r(s) = ∫₁^∞ r(y) y^{−s−1} dy. Then
   * 𝓜R(s) = s^{−1}(−ζ′/ζ)(s + ½) − 2/(s − ½);
   * 𝓜(K_∞R) = A_U(s + ½)·𝓜R;
   * 𝓜((1 − K_∞)R) = M_U(s + ½)·[−ζ′(s + ½)/s − 2ζ(s + ½)/(s − ½)], which is holomorphic except at s = 0
     and s = ½.

   So R = (1 − K_∞)^{−1}F with F free of zero information, and the resolvent (1 − K_∞)^{−1} acts by
   1/(ζ(s + ½)M_U(s + ½)). Every zero of ζ, on or off the line, is a pole of the resolvent, with the same
   local structure.

*Proof.*
1. a_U = μ_{>U} ∗ 1, so for Re s > 1, A_U = ζ·Σ_{d>U} μ(d)d^{−s} = ζ·(1/ζ − M_U). Continuation is that of ζ.
2. Immediate from 1, since ζ(ρ) = 0.
3. Since φ̃_σ has a simple pole at 0 with residue 1,
   Σ_m a_U(m) m^{−s} φ_σ(m/Y) = (2πi)^{−1}∫_{(c₀)} A_U(s + w) φ̃_σ(w) Y^w dw for c₀ > 1 − Re s. Move the line to
   Re w = −c. The residues are A_U(s) at w = 0 and −m(U) φ̃_σ(1 − s) Y^{1−s} at w = 1 − s. A_U grows
   polynomially in vertical strips (ζ does, and M_U is a Dirichlet polynomial), and φ̃_σ decays like a
   Gaussian, so the remaining integral is O(Y^{−c}). Put s = ρ and use 2.
4. Termwise Mellin transforms for Re s large; then 1 − A_U = ζM_U. ∎

Theorem C is bootstrap Lemma III.4 (residue −m(ρ) of the Type-II series because 1 − ζM_U = 1 at ρ), restated
as a statement about the operator in Step 3.

**Measured (`tmp/rha-type2-parity-critical.py`; σ = 0.8).**

| U | Y | terms | max over first 10 zeros of \|A_φ(ρ) − 1\| | at 9 mid-points between zeros | t = 0 |
|---|---|---|---|---|---|
| 10 | 10⁴ | – | ≤ 3.3·10⁻¹⁴ | A_φ = 1 − ζM_U to ≤ 5·10⁻¹⁴; values from −1.18 to +1.23 | pole term 18.8 matches to 7·10⁻¹⁵ |
| 100 | 10⁵ | 4.18·10⁶ | 5.9·10⁻¹⁴ | \|A_φ\| ∈ [0.11, 1.71], equal to 1 − ζM_U | pole term 20.5 matches to 4·10⁻¹⁵ |

At the zeros the pole term is below 10⁻¹⁴ because φ̃_σ(1 − ρ) ≈ e^{−σ²γ²/4}.

**Corollary C1 ((K-ii) is false in its contraction form; PROVED).**
* Under RH (the only case in which (★) can hold), R(y) = −ζ′/ζ(½) − Σ_ρ y^{ρ−½}/(ρ − ½) + O(y^{−1/2})
  (STANDARD explicit formula, with the zero sum taken symmetrically). The zero modes y^{iγ} are its
  oscillating components, and by Theorem C each of them is reproduced by K_∞ with factor exactly 1.
* No norm in which those modes are bounded vectors can make K_X a contraction with η > 0 on R.
* The same holds off the line: a mode y^{β−½+iγ} with β > ½ is also reproduced with factor 1. So the renewal
  identity holds unchanged whether or not RH is true. It is an identity of the Dirichlet-series algebra,
  blind to where the zeros are, just as the backward heat flow is blind to them in SL2.

**Remark C2 (the mollifier reading fails even on average; RECALLED).**
* The justification of (K-ii) assumed |A_U| = |1 − ζM_U| < 1 "where M_U mollifies ζ". Take a smoothed
  mollifier M(s) = Σ_{d≤y} μ(d) P(log(y/d)/log y) d^{−s}, with P(0) = 0, P(1) = 1 and y = T^θ, θ < ½.
* Balasubramanian–Conrey–Heath-Brown (1985) give T^{−1}∫_T^{2T} |ζM(½ + it)|² dt → 1 + θ^{−1}∫₀¹ P′(x)² dx.
  The diagonal gives T^{−1}∫ ζM → 1.
* Hence T^{−1}∫_T^{2T} |1 − ζM|² → θ^{−1}∫₀¹ P′² ≥ θ^{−1} > 1, since ∫₀¹ P′² ≥ (P(1) − P(0))² = 1. The sharp
  truncation μ_{≤U} has P ≡ 1, which is outside the class above. That it does worse is ARGUED, not recalled.
* So on the critical line the Type-II symbol exceeds 1 in mean square, and on the zeros it equals 1. There is
  no frequency band where the contraction could come from.

**Remark C3 (cancellation is present, contraction is not; MEASURED).**
* K_X[R] is much smaller than its absolute bound. At X = 10¹⁰, |K_X[R]| = 5.4, while the absolute bound
  Σ_m |a_U(m)| m^{−1/2}|R(X/m) − R(V)|, summed over all 17 boxes, is 818.
* So the m-sum cancels by a factor ≈ 150. The cancellation does not damp R. It rebuilds R's zero sum and
  cancels the explicit forcing Ξ (Proposition 3.1).

### 3.2 The Cauchy–Schwarz route (K′) loses √M even granting RH

**Theorem CS0 (PROVED; the constant MEASURED).** Let (M, 2M] ⊂ (U, X/(V + 1)] be a Type-II box, with
x_m = a_U(m)m^{−1/2} and y_m = R(X/m) − R(V).

1. The Cauchy–Schwarz bound CS(M) := ‖x‖₂‖y‖₂ satisfies ‖x‖₂² ≥ Σ_{M<p≤2M} 1/p ≥ (log 2)/(2 log M) for
   large M, because a_U(p) = −1 for primes p > U.
2. Hence (K′) can be certified this way only if Σ_{M<m≤2M} y_m² ≤ 2(log M)C₀²(log X)^{2m−2}/log 2. That says
   R(y) − R(V) has mean square ≤ (log X)^{O(1)}/M over the sample points y = X/m ∈ [X/(2M), X/M).
3. In every box at every X tested, the mean of y_m² lies in [0.045, 0.31], and ‖x‖₂² ≈ 0.307 per dyadic box
   (MEASURED). Hence CS(M) ≈ 0.136√M, while the actual |B_M| ≤ 1.52 (X = 10¹⁰):

| X = 10¹⁰: M | 316 | 5056 | 80 896 | 1.29·10⁶ | 1.04·10⁷ |
|---|---|---|---|---|---|
| B_M (actual) | 0.219 | −0.117 | −0.145 | −0.391 | −1.521 |
| Σ\|x_m y_m\| | 1.77 | 5.54 | 15.3 | 57.9 | 195.6 |
| CS(M) | 2.69 | 11.0 | 38.4 | 135.0 | 449.7 |

4. Under RH the logarithmic mean square of R is asymptotically a positive constant (Cramér; RECALLED), so (2)
   fails on average over X for every M ≥ (log X)^{C}. If RH fails, R is larger. Either way, the
   Cauchy–Schwarz route cannot certify (K′) for the large boxes.
5. The summed bound is dominated by the largest box M ≍ X/V. So the best this route can certify, even with
   RH-quality input inside the boxes, is R(X) ≪ (X/V)^{1/2}(log X)^c = X^{3/8}(log X)^c. By
   Proposition 1.2 that is ZF(7/8).

*Proof.* (1) is Mertens' theorem for primes in (M, 2M]. (2) is (1) rearranged. (5) adds the box bounds. ∎

**Remark CS1 (the other order, and other splits; ARGUED).**
* Applying Cauchy–Schwarz over n instead leaves the inner sums Σ_{M<m≤Y} a_U(m)m^{−1/2}. By Lemma 2.1 these
  equal −2m(U)(√Y − √M) + O(U/√M). Under RH they have size √(M/U) + U/√M, and the summed bound is again
  ≍ √(X/U) = X^{3/8} for the largest boxes.
* With a general split U = X^{u₁}, V = X^{u₂} (u₁ + u₂ ≤ ½ for Proposition 2.2), the cap is
  X^{(1 − max(u₁, u₂))/2} ≥ X^{1/4}, which is at best ZF(3/4).
* A single Cauchy–Schwarz throws away the oscillation of the outer variable. What it leaves are
  frequency-0 partial sums whose size, even under RH, is the square root of a length times a Möbius-scale
  fluctuation.
* The value 7/8 at u = 1/4 coincides with the openai/math half-plane and with V7 floor exponent p = 3/4
  (atlas §10). No connection between the mechanisms is claimed.

### 3.3 Dispersion leads to the frequency-0 mean square, which is the zero-free region

Smoothing the m-cutoff and evaluating the m-sum by Poisson summation (Linnik's dispersion) leaves
∫ |P_N(t)|² w(t) dt for a weight w concentrated on |t| ≲ 1, with w ≥ c > 0 on [−1, 1].

**Theorem J (PROVED).** Let J(N) = ∫_{−1}^{1} |P_N(t)|² dt, with P_N(t) = Σ_{N<n≤2N} (Λ(n) − 1)n^{−1/2−it}, and
let 0 ≤ α < ½.

* (i) ZF(½ + α) implies J(N) ≪_ε N^{2α+ε}. RH implies J(N) ≪ (log N)⁴.
* (ii) If J(N) ≤ C N^{2α}(log N)^c for all real N ≥ N₀, then ZF(½ + α). The same holds with J replaced by
  ∫ |P_N|² w for any w ≥ c > 0 on [−1, 1].

*Proof.*
* (i) Partial summation against ψ(u) − ⌊u⌋ ≪ u^{½+α+ε}.
* (ii) Let k₀ ∈ L²[−1, 1] and k(t) = k₀(t)e^{it log N}. Cauchy–Schwarz gives
  |∫_{−1}^{1} P_N k| ≤ ‖k₀‖₂√J(N). The left side is
  F_h(N) := Σ_{N<n≤2N} (Λ(n) − 1)n^{−1/2}h(log(n/N)), with h = k̂₀.
* The substitution N = ne^{−u} gives ∫₀^∞ F_h(N) N^{−s−1} dN = C(s)H(s), with
  C(s) = −ζ′/ζ(s + ½) − ζ(s + ½) and H(s) = ∫₀^{log 2} h(u)e^{su} du = ∫_{−1}^{1} k₀(t) g_s(t) dt, where
  g_s(t) = (2^{s−it} − 1)/(s − it).
* The bound on F_h makes C·H holomorphic on Re s > α. A zero ρ₀ with Re ρ₀ − ½ =: Re s₀ > α is a pole of C
  (residue −m(ρ₀)), so H(s₀) = 0 for every k₀.
* But g_{s₀} has no zeros on [−1, 1], because 2^{s₀−it} = 1 would force Re s₀ = 0. Taking
  k₀ = conj(g_{s₀}) gives H(s₀) = ‖g_{s₀}‖₂² > 0. Contradiction. ∎

**Measured (`tmp/rha-type2-parity-j0.py`; 48-node Gauss–Legendre; 33 values of N in [10³, 10⁷]; decade means).**

| decade of N | 10³ | 10⁴ | 10⁵ | 10⁶ | 10⁷ (one N) |
|---|---|---|---|---|---|
| mean J(N) | 0.30 | 0.12 | 0.40 | 0.14 | 0.69 |
| max J(N) | 1.09 | 0.38 | 1.95 | 0.46 | 0.69 |
| mean-value scale Σ_{n∼N}(Λ(n) − 1)² | 2.6·10⁴ | 3.4·10⁵ | 4.2·10⁶ | 4.9·10⁷ | 1.6·10⁸ |
| planted zero ρ₀ = 0.75 + 30i: mean J | 1.06 | 2.31 | 6.53 | 23.9 | 44.5 |

* J(N) is O(1), consistent with RH. The mean-value theorem (window 2 ≪ length N) overestimates it by a factor
  ≍ N log N: 1.6·10⁸ against 0.69.
* The planted model Λ′ = Λ − 2Re n^{ρ₀−1} grows like N^{2β₀−1} = N^{1/2} (×3.2 per decade).
* Planted zeros with β₀ − ½ ≤ 0.1 at heights 30–100 are invisible for N ≤ 10⁷. Their J values are dominated
  by the true fluctuation (the `J_planted_b0.6`/`b0.55` columns in `j0.json`).
* So the frequency-0 input that dispersion needs is the zero-free region itself (Theorem J). The large sieve,
  whose window must be at least as long as the polynomial, carries no information at frequency 0.

### 3.4 Taking only one side gains nothing

**Theorem OS (PROVED).** Let U = V = ⌊X^{1/4}⌋ and 0 ≤ α < ½.
* If T(X) − MT_II(X) ≤ C X^α(log X)^m for all large X, then ZF(½ + α).
* Conversely, ZF(½ + α) with α > 0 implies |T(X) − MT_II(X)| ≪_ε X^{α+ε}. RH implies
  |T(X) − MT_II(X)| ≪ (log X)².

*Proof.* By Proposition 2.2, R(X) = T(X) − MT_II(X) + E₁ − E₂ with |E₁ − E₂| ≤ 2 for large X. Apply
Proposition 1.2 (one-sided, via Landau and the positivity Λ ≥ 0) and its converse (Theorem 1.1 at α = 0). ∎

So a one-sided Type-II estimate at square-root precision is RH, and one with exponent α is the half-plane
½ + α. The only thing gained from one-sidedness is Landau's lemma, which already uses Λ ≥ 0. Bootstrap
Corollary III.5 states the same for the discrepancy D and the other Landau functionals; this is the version
for the Type-II piece of this split.

### 3.5 The exact failing line

> **Step 4, Claim (K-ii)/(K′): "the bilinear Type-II sum K_X[R] = Σ_{U<m≤X/V} a_U(m)m^{−1/2}(R(X/m) − R(V))
> contracts R (or is box-wise O(polylog))".**

* The contraction form is false: the operator reproduces every zero mode with factor exactly 1, on or off the
  line (Theorem C, Corollary C1). This does not depend on RH.
* The box-wise form cannot be reached by Cauchy–Schwarz: the loss is ≍ √M, capping the route at X^{3/8}, i.e.
  ZF(7/8), even with RH-quality inner input (Theorem CS0).
* It cannot be reached by dispersion either: what dispersion leaves at square-root precision is RH
  (Theorem J).
* What the step needs, in any form, is a one-sided Type-II bound at square-root precision. That is equivalent
  to RH (Theorem OS). It is the first item of the atlas closing line, "a genuine all-scale signed arithmetic
  estimate".

The first claim in the written chain that is unproved is (K). The first false one is (K-ii) as a contraction.

**Remark 3.6 (visibility mismatch: why Type-II technology cannot see an off-line zero; ARGUED, elementary).**
* An off-line zero ρ₀ = ½ + δ + iγ₀ adds −X^{δ+iγ₀}/(ρ₀ − ½) to R(X). It breaks (★) only once
  X^δ/|γ₀| ≫ (log X)^m, that is, at X ≥ X_vis ≈ (|γ₀|(log|γ₀|)^{m})^{1/δ}. This is the visibility length of
  round-1 contradiction Lemma 2 and round-2 phase alignment, in this normalization.
* At such X every Type-II box has N ≥ X^{1/4} ≥ |γ₀|^{1/(4δ)}, which is ≫ |γ₀| whenever δ < ¼.
* Large-sieve and mean-value bounds save only on windows of length T ≳ N. The zero's frequency γ₀ is far
  shorter than N, so it sits inside the window |t − γ₀| ≲ 1 where those bounds are trivial (Theorem J and its
  measurement).
* So the zeros that (★) must exclude are, at the scale where they become visible, outside the range of
  every bilinear estimate. This is wall 4 at the frequency-0 window.

**Remark 3.7 (Heath-Brown's identity; ARGUED).**
* With Heath-Brown's identity of order k ≥ 3 and z = X^{1/k}, every piece ζ^{j−1}ζ′M_z^j is holomorphic except
  at s = 1. The zeros enter only through the truncation n ≤ X, so no single piece carries the zero sum.
* The contour integrals on Re s = ½ have size X^{1/2} times moments of |ζM_z|. These moments exceed 1 on
  average, as in Remark C2.
* So the zero sum comes out as a cancellation between pieces each far larger than R. Square-root precision
  needs that cancellation exactly. Proposition 3.1 shows the same phenomenon for Vaughan's identity.

---

## 4. The Type-II saving: needed versus known

### 4.1 Normalization

By Theorem OS, a bound for the Type-II error T − MT_II is the same thing as a bound for R. Measure every input
by the relative error ρ(X) := (bound on |R(X)|)/√X. The trivial Type-II bound is T_triv ≈ 0.33√X log X
(MEASURED, Remark 2.3). The exponent dictionary is:
* a bound R ≪ X^α corresponds to ZF(½ + α) (Proposition 1.2 and its converse);
* it also corresponds to V7 floor exponent p = 2α, since atlas §10 / bootstrap Lemma III.2 give
  p ⟹ ZF((1 + p)/2).

### 4.2 The table

| input | how it acts on the Type-II piece at frequency 0 | bound on R(X) | ρ(X) at X = 10¹⁰⁰ / 10¹⁰⁰⁰ | half-plane | status |
|---|---|---|---|---|---|
| bilinear methods proper (Cauchy–Schwarz, large sieve, mean-value theorem) | no oscillation at frequency 0; MVT loses the factor N (§3.3 table) | trivial, ≍ √X log X | ≍ log X | none | Theorems CS0, J. Vaughan's minor-arc bound Σ_{n≤N} Λ(n)e(αn) ≪ (Nq^{−1/2} + N^{4/5} + N^{1/2}q^{1/2})(log N)⁴ is trivial at q = 1 (STANDARD) |
| the same, with RH-quality inner sums | Cauchy–Schwarz loses √M | X^{3/8}(log X)^c (U = V = X^{1/4}); X^{1/4} for the best split | 10^{−12.5} / 10^{−125} | 7/8 (3/4) | Theorem CS0, Remark CS1. The inner input is itself RH-strength (Theorem J) |
| Vinogradov–Korobov zero-free region | via ζ, not via bilinear forms on the integers | √X exp(−c(log X)^{3/5}(log log X)^{−1/5}) | sub-power | none | STANDARD |
| FKS Corollary 1.4 (explicit) | via an explicit zero-free region and finite computation | ≈ 2·9.22022(log X)^{3/2}e^{−0.8476836√log X}·√X | 0.17 / 4.4·10⁻¹² | none | prime-memory module §1. Trivial (2ε ≥ 1) for X ≤ 10⁶⁶ (computed). The factor 2 comes from the two terms of R in Proposition 1.2 |
| openai/math 7/8 half-plane | half-plane | X^{3/8+ε} | 10^{−12.5} / 10^{−125} | 7/8 | Lean-checked locally (`lake build`, `#print axioms`; official comparator not run; not peer reviewed) |
| PR #14 / Xu–Sang | half-plane | X^{0.37488665+ε} | 10^{−12.5} / 10^{−125.1} | 0.87488665 | conditional on imported analytic lemmas (atlas §10) |
| **needed: (★)** | one-sided, square-root precision | **(log X)^m** | **10^{−50} / 10^{−500}, up to polylog** | **½ (RH)** | Theorem OS |

How to read the table:
* Every input that gives a power saving at frequency 0 gives it as a zero-free half-plane. The known rows
  give at best ½ + 3/8 (Lean-checked 7/8) or ½ + 0.37489 (conditional).
* The gap to (★) is the strip ½ < Re s < 7/8. In exponent terms the Type-II saving still missing is X^{3/8}
  beyond the 7/8 input, and X^{1/2} beyond what bilinear methods alone give.
* The Cauchy–Schwarz route lands on the same 7/8 for this split (Theorem CS0(5)), and only after assuming
  RH-strength input inside the boxes.

### 4.3 A parity-breaking majorant: λ-twisting beats Theorem P but not the square root

**Proposition L (PROVED).** Let D < X and let W : ℕ → [0, ∞) satisfy W(p) ≥ 1 for every prime p ∈ (D, X].
Put w(n) = n^{−1/2} log n, B = Σ_{n≤X} W w and T = Σ_{n≤X} W w λ. Then

  Σ_{D<p≤X} w(p) ≤ B₋(W) := Σ_{n≤X, λ(n)=−1} W(n)w(n) = ½(B − T).

*Proof.* W ≥ 0, 1 − λ ∈ {0, 2} and λ(p) = −1. ∎

* Theorem P says a Type-I majorant certifies only B ≥ (4 − o(1))√X. The reason is that Type-I data cannot
  evaluate T, which has no main term because ζ(2s)/ζ(s) vanishes at s = 1.
* B₋ uses T, so it is a parity-breaking majorant. Evaluating T is Type-II information: it needs the Liouville
  sums Σ_{m≤Y} λ(m)m^{−1/2} at every Y ≥ X/D².

**Measured** (Selberg Λ²-weights at level D² = X^θ; round-2 script `tmp/rha-stepanov-parity.py`, re-run into
`tmp/rha-type2-parity-out/lamtwist-1e7-*.json`; X = 10⁷; truth = Σ_{D<p≤X} w(p)):

| θ | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0 |
|---|---|---|---|---|---|---|
| B/truth (Type-I; Theorem P limit 2/θ) | 2.663 | 2.301 | 2.039 | 1.830 | 1.664 | 1.530 |
| **B₋/truth (λ-twisted)** | 1.372 | 1.216 | 1.125 | **1.081** | 1.084 | 1.113 |
| (B₋ − truth)/√X | 0.741 | 0.431 | 0.249 | **0.161** | 0.165 | 0.222 |

At θ = 1, B₋/truth = 1.1205, 1.1170 and 1.1133 at X = 10⁵, 10⁶ and 10⁷ (round-2 outputs, re-read).

Reading:
* The λ-twist breaks the parity factor, from 1.83 to 1.08 at θ = 0.8. Parity-sensitive information does what
  Friedlander–Iwaniec-type inputs are known to do.
* The excess stays ≈ 0.16√X and falls very slowly (12.1% → 11.3% of truth over two decades at θ = 1).
  (★) needs an excess of O(polylog).
* The excess sits on the λ = −1 composites (P₃, P₅, …) in the support of W, a second parity layer
  (HEURISTIC). Removing it needs W exact on rough numbers, that is, level X: round-2 Branch C, the Mertens
  problem.
* Even with the excess removed, T would be needed at square-root precision. That means Liouville sums at
  polylog precision, with cancellation across the sieve coefficients. Such bounds are not known to follow even
  from RH: the best RH-conditional bounds for M(x)/√x lose exp((log x)^{1/2+o(1)}) (Soundararajan 2009;
  RECALLED).

---

## 5. The four walls, the two floors, and the twin tests

### 5.1 Why the attempt is not blocked a priori, and where it actually stops

| wall | blocked a priori? | reason |
|---|---|---|
| (1) Flow-blindness, SL2 (`src/data/flow-blindness-no-go.js`) | **no** | The inputs are Λ = μ ∗ log (Vaughan), the integer sawtooth (Lemma 2.1, Euler–Maclaurin over ℤ) and Λ ≥ 0 (Landau). None is a hypothesis on the profile Φ. The flowed Ξ_ε = H_{−ε} has no Dirichlet series, so SL2 does not apply. **However**, Theorem C plays the role of SL2 for this attempt. The renewal identity uses only ζ·(1/ζ) = 1 and holds for every zero configuration, so it cannot locate zeros. Everything that would locate them is in Step 4. |
| (2) NS-RIGID (`src/data/imp-95530-…`) | **no** | No Hermitian form on the twin-ladder native span is built. The inputs are Dirichlet coefficients (μ, Λ, λ), the loophole class the module names. Its dichotomy, "soft or RH itself", reappears exactly. The Type-I part (Proposition 2.2) is soft: it is Euler–Maclaurin and carries no zero information. The Type-II part is RH (Theorem OS). |
| (3) Verified-height wall (Route I ceiling, crossover 2a = 7.764; RES-T) | **no** | No fixed support and no fixed heat time: (★) quantifies over all scales X → ∞. The finite data (X ≤ 10¹⁰, zeros only in aggregate) are verified-height-type evidence and prove nothing (atlas §11). |
| (4) Pointwise / MV-CAP (route 42; `mv-cap-theorem.md`) | **this is where it stops** | Type-II technology consists of mean-value statements: Cauchy–Schwarz plus a mean-value theorem or the large sieve. At frequency 0 the relevant t-window is the single window \|t\| ≲ 1. Theorem J shows the frequency-0 mean square is the zero-free region. Theorem CS0 shows Cauchy–Schwarz loses √M. Remark 3.6 shows an off-line zero becomes visible only at scales where its frequency is far shorter than every Type-II box. Caveat: the route-42 theorem is proved for zero-side statistics and explicitly **not** for function-side large-sieve mean values (its referee correction 2). Theorems CS0 and J supply the function-side statement this route needs. |
| global vortex trapping = RH | not used | — |

### 5.2 The two size-only floors are avoided, and what replaces them

* **Round-2 Theorem P** (Type-I majorants capped at 4√X).
  * Avoided in two ways. Step 2 is an identity, not a majorant, and its Type-I part is exact up to O(1)
    (Remark 2.3). The λ-twisted majorant of Proposition L goes below the cap (1.08 × truth at θ = 0.8).
  * Neither reaches square-root precision.
* **The 13/15 density floor** (round-2 density Theorem P/Q).
  * That floor is the zero-blind low side of a count-times-size architecture. Nothing here counts zeros:
    every quantity is a signed sum.
  * The price is that the signed sum must itself be bounded at square-root precision, with nothing averaged
    away.
* **What replaces both** is Theorem OS: a one-sided Type-II bound with exponent α is the half-plane ½ + α.
  * This is not a size-only floor. It is an equivalence, valid at every α, so no fixed numerical barrier
    stops the route.
  * The route just needs the conclusion as its input.

### 5.3 Twin tests

* **Davenport–Heilbronn (ARGUED).**
  * Vaughan's identity and Theorem C are identities of Dirichlet series. With μ_DH the coefficients of
    1/L_DH (convergent in some right half-plane), A = 1 − L_DH M_U equals 1 at every zero of L_DH, including
    the off-line ones.
  * So Steps 2–3 hold formally for DH. Lemma 2.1 has no DH analogue in the same form; DH's coefficients are
    periodic, and its partial sums have their own Euler–Maclaurin expansion.
  * The step that actually excludes DH is Step 1: Landau's lemma needs Λ ≥ 0, i.e. the Euler product.
  * Any proof of Step 4 must therefore use the Euler product in a way that bilinear size bounds do not, since
    those bounds see only coefficient sizes, which DH shares.
* **Beurling generalized primes (RECALLED; not checked here).**
  * Diamond–Montgomery–Vorhauer (Math. Ann. 2006) construct g-prime systems with N(x) = Ax + O(x^θ) for some
    θ < 1 and ψ(x) − x = Ω(x exp(−c√log x)).
  * Lemma 2.1 is where the exact counting ⌊x⌋ = x + O(1) of the integers enters. Systems with θ > ½ already
    fail Proposition 2.2.
  * Whether some Beurling system with θ ≤ ½ has a zero off the line was not checked.
* **Function-field dictionary (route 27).**
  * Over F_q[t] the analogue of (★) holds exactly: Gauss's formula, and the zeta function has no zeros.
  * For a curve C of genus g the same Vaughan algebra gives A = 1 − Z_C M_U = 1 at every Frobenius-eigenvalue
    point.
  * RH for curves comes from the Hodge index theorem on C × C, or from Stepanov's method, not from bilinear
    estimates. The dictionary agrees with Theorem C: the renewal identity does not see the geometry.

---

## 6. What survives

These are same-model results; a fresh referee has not checked them.

1. **Proposition 2.2** (square-root Type-I lemma). In Vaughan's identity with UV ≤ √X, the Type-I pieces are
   exact up to |E₁| + |E₂| ≤ X^{−1/4}(2 + log X) + 1.04. Measured ≤ 0.022 for 10⁶ ≤ X ≤ 10¹⁰. So parity, in
   identity form, sits entirely in the Type-II piece.
2. **Remark 2.4 and Proposition 3.1.** At square-root precision the Type-II main term contains
   2√X m(U)ε₁(V), a product of Möbius and Mertens fluctuations, of size X^{1/4} under RH. Measured up to 29
   while |R| ≈ 3. The explicit forcing and the bilinear term cancel.
3. **The exact renewal identity** R = Ξ + K_X[R] + O(1), with measured components to X = 10¹⁰.
4. **Theorem C** (criticality: A_U(ρ) = 1 at every zero; resolvent 1/(ζM_U)). Measured to 6·10⁻¹⁴. This is
   bootstrap Lemma III.4 in operator form.
5. **Remark C2** (RECALLED BCHB): the mean of |1 − ζM|² on the critical line is ≥ 1/θ − o(1) > 1 for every
   admissible mollifier. Type-II symbols do not contract even on average.
6. **Theorem CS0 and Remark CS1.** Cauchy–Schwarz caps the U = V = X^{1/4} route at X^{3/8} (ZF(7/8)), and any
   split at X^{1/4} (ZF(3/4)), even with RH-quality inner input.
7. **Theorem J.** The frequency-0 mean square J(N) ≪ N^{2α+o(1)} is equivalent to ZF(½ + α). Measured J = O(1)
   against the mean-value scale N log N, and a planted-zero model grows like N^{2β₀−1}.
8. **Theorem OS.** A one-sided Type-II bound at exponent α is equivalent to ZF(½ + α).
9. **Proposition L** and its θ-profile. The λ-twisted majorant breaks the parity factor (1.83 → 1.08 at
   X = 10⁷) but leaves an excess of ≈ 0.16√X.
10. **The needed-versus-known table** (§4.2). Needed X^{1/2}; known X^{1/8} (Lean-checked 7/8), X^{0.1251}
    (conditional Xu–Sang), exp(c(log X)^{3/5−o(1)}) (unconditional); bilinear methods alone give 1.
11. **Correction.** The partial-summation constant in R is −1, and the mean of R under RH is −ζ′/ζ(½) = −2.686.

---

## 7. Honesty statement

* **No QED.** Step 4 fails, and every repair considered here needs a zero-free half-plane as input.
* This file contains the author's own attack. A fresh-context referee has not yet checked it. All PROVED
  grades are internal.
* **Novelty: none claimed.** Vaughan's identity, Landau's lemma, Cauchy–Schwarz, Linnik's dispersion,
  Cramér's mean square and the Balasubramanian–Conrey–Heath-Brown mollifier asymptotics are classical.
  Theorem C restates bootstrap Lemma III.4. Theorem OS is a corollary of arithmetic foundation §2 and
  bootstrap Theorem III.1. Proposition L is one line.
* **Recalled, not re-checked here:**
  * Balasubramanian–Conrey–Heath-Brown (1985), the mollified mean value;
  * Cramér's mean-square theorem under RH;
  * Soundararajan (2009), M(x) ≪ √x exp((log x)^{1/2}(log log x)^{14}) under RH;
  * Diamond–Montgomery–Vorhauer (2006);
  * Vaughan's minor-arc bound;
  * Rosser–Schoenfeld, ψ(x) < 1.03883x;
  * the FKS constant, taken from the prime-memory module.
* **Numerics** are IEEE double and are not interval-certified:
  * the identity residual is ≤ 3.1·10⁻¹¹ against direct sums for X ≤ 10⁸;
  * the X = 10⁹ and 10¹⁰ values are identity-only;
  * the J(N) quadrature uses 48 Gauss–Legendre nodes, with the "−1" part by Euler–Maclaurin (error
    O(N^{−3/2})).
* **What would overturn the verdict.** A bilinear estimate at frequency 0 whose saving does not come from a
  zero-free region. By Theorem OS, any such estimate with exponent α would itself be a new zero-free region
  ZF(½ + α) obtained by a new method. Nothing here supplies one, and Theorem C shows the Type-II algebra
  cannot supply one by itself.

**Scripts and outputs** (`tmp/`, `tmp/rha-type2-parity-out/`):

| script | computes | outputs |
|---|---|---|
| `rha-type2-parity-vaughan.py X [direct]` | exact Vaughan decomposition at U = V = ⌊X^{1/4}⌋; Euler–Maclaurin Type-I errors; renewal components Ξ, K_X[R]; dyadic boxes with Cauchy–Schwarz and absolute bounds | `vaughan-1e+06.json` … `vaughan-1e+10.json`, `vaughan-1e10.log` |
| `rha-type2-parity-critical.py U Y σ` | smoothed A_U at the first 10 zeros, 9 mid-points and t = 0, against 1 − ζM_U and the pole term | `critical-U10-Y1e+04.json`, `critical-U100-Y1e+05.json` |
| `rha-type2-parity-j0.py 7` | J(N) on 33 values of N in [10³, 10⁷], the mean-value scale, three planted-zero models, decade summaries | `j0.json`, `j0.log` |
| `rha-stepanov-parity.py 1e7 out θ` (round-2 script, reused unmodified) | Selberg Λ² majorant, B, B±, T | `lamtwist-1e7-{0.5,…,1.0}.json` |

---

## 8. Status

RH is open. NO QED. Platt–Trudgian Λ ≤ 0.2 stands. No new zero-free region and no Λ bound.
* The parity-breaking Type-II route to the one-sided Landau bound needs a one-sided bilinear estimate at
  square-root precision (saving X^{1/2}/polylog). That estimate is equivalent to RH (Theorem OS), the renewal
  form cannot contract (Theorem C), and the known bilinear technology gives no saving at frequency 0
  (Theorems CS0, J).
* The best known inputs give the 7/8 half-plane (Lean-checked, not peer reviewed) or 0.87488665 (conditional).
  That is a Type-II saving of X^{1/8}, against X^{1/2} needed.
