# REFEREE: e2-cofinal-moebius-pointwise

**Outcome: the verdict "dead (restatement)" holds. Every PROVED step was re-derived and is correct. Six
corrections, none changing the verdict. No step assumes RH, none uses verified height, and the Landau step is
labelled CLASSICAL in the body.**

Referee run: own script (whole-array sieve, not the lane's segmented code), N = 3·10⁷, through
`scripts/memcap.sh 8`, 4 s, planned memory about 2 GB printed. The script was kept outside the repo
(`/tmp/ref_e2/ref.py`); only this file was written here. The compute server was not used.

## 1. PROVED steps, re-derived

| step | status | note |
|---|---|---|
| Lemma 1, F_b = ψ_b − a·x[m log x − β] − c·x·m | correct | Σ_k μ(k)T_b(x/k) = Σ_N ψ_b(x/N)Σ_{k\|N}μ(k) = ψ_b(x) (needs ψ_b = 0 below 1, which holds). The other two sums are direct. It is e1 Proposition 3(a) rearranged, as stated. |
| Table 2.1 | correct | b₂: T = 2Y − Y·2^{−J} − Σ{Y/2^j}, c = 2. b₃: Stirling gives T = Y − ½log(2πY) + o(1), c = 1; ratio 1.00 is attained at Y = 1 (r = −1). |
| Theorem A(a) | correct | c ≥ 0 from T_b ≥ 0 and r_b = O(log Y). |
| Theorem A(b) | correct | T_b(Y) − 2T_b(Y/2) = Σ(−1)^{n+1}ψ_b(Y/n) ≥ ψ_b(Y) − ψ_b(Y/2); the cY terms cancel; at most log₂x iterations; on [1, 2) ψ_b ≤ T_b ≤ 2c + 2κ. |
| Theorem A(c) | correct conclusion; proof text has the two directions swapped (item E1) | ∫₁^∞ x·m(x)x^{−s−1}dx = 1/((s−1)ζ(s)) checked termwise. C′/(s−θ) has a pole at θ that the second term cannot cancel, there is no other real singularity in s > θ, so the Landau abscissa is θ and 1/ζ is holomorphic in Re s > θ. Converse: m(x) = −Σ_{k>x}μ(k)/k (uses Σμ(k)/k = 0, PNT) and M ≪ x^{Θ+ε}. |
| Theorem A(d) | correct | from (c) and zeros on Re s = 1/2 (Hardy; unconditional). |
| Section 2.4 | correct | F_b = e_b − aU − cV checked; T_Λ = log⌊Y⌋! gives a = 1, c = −1 and F_Λ = ψ − x − U + V. |
| Identity (2) | correct | Σ_{K<k≤x}μ(k)r_b(x/k) = ∫_{[1,x/K)}(M(x/u) − M(K))dr_b(u); second line = Σ_{K<k≤x}μ(k)T_b(x/k) − c·x(m(x) − m(K)). Table rows re-added: dT part + smooth part = tail and head + tail = F in every row. |
| Section 2.6 | correct | PR 26 text has r(y) = M₁(λ/y)/(2y), M₁ = m, and ‖r_even‖² = (2λ)⁻¹∫|M₁|² = o(λ); (1 − F_{b₁}(λ/y))/(2λ) = m(λ/y)/(2y). |

## 2. Numeric rerun (different cases)

| check | lane | referee |
|---|---|---|
| M(3·10⁷) | −1157 | −1157 |
| F_{b₁} block max / min, all 20 quarter-decade blocks 10² to 10⁷ | as logged | identical to 4 decimals (independent code) |
| E_a | a = 0.2: 0.703 / 0.703 (expected 0.7) | **a = 0.1**, x ≤ 10⁷: 0.616 / 0.630 (expected 0.6) |
| Beurling | 2 → 2.5: 0.504 / 0.508 | **3 → 3.5** (ρ = 14/15, N(Y) − ρY ∈ [−1.4, 0] at 10³, 10⁵, 10⁷), x ≤ 10⁷: 0.495 / 0.516 |
| Lemma 1 term by term | b₁..b₃, Λ at four x | **b₂ at x = 777777.25**: direct −63.48945212, closed form −63.48945212 |
| Identity (2) for a non-trivial dT_b | b₁ only | **b₂, x = 777777.25, K = 1000**: head −22.903877, tail from (2) −40.585575 (dT part −6820, smooth +6779.4144), sum −63.489452 |
| unimodular twist, τ = 3, x = 10⁵ | not run | inversion sum 1.0000000; F direct −3.59747622 − 14.70557592i, closed form the same to 9 digits (item E3) |

The referee fits use a shorter range (10³ to 10⁷) and have the same few-hundredths spread the lane states.

## 3. Errors and corrections

**E1 (proof text, Theorem A(c)).** The roles are swapped. From F_b ≤ Cx^θ one gets c·x·m ≥ ψ_b − Cx^θ ≥ −Cx^θ:
this direction uses ψ_b ≥ 0 only. From F_b ≥ −Cx^θ one gets c·x·m ≤ ψ_b + Cx^θ ≤ C′x^θ: this direction needs
the bound (b). The text assigns (a), (b) to the first and "ψ_b ≥ 0 only" to the second. The statement is
unaffected.

**E2 (novelty wording).** Section 1 lists the equivalence "one-sided bound for F_b ⇔ Θ ≤ θ" among items new
relative to e1. It is new only relative to e1. Mathematically it is the classical Landau one-sided theorem for
m(x) (equivalently M(x)) plus the polylog term of A(b). The body grades it PROVED / CLASSICAL, which is right;
the summary line should carry the same grade. Nothing here is a new theorem.

**E3 (unimodular twist is exact, not "not run / ARGUED").** For a(n) = n^{−iτ}: a⁻¹(k) = μ(k)k^{−iτ} and the
smooth part is Y^{1−iτ}/(1−iτ), so k^{−iτ}·k^{−(1−iτ)} = 1/k and

  F^τ(x) = 1 − x^{1−iτ}·m(x)/(1−iτ),  |F^τ(x) − 1| = x·|m(x)|/|1−iτ|.

The control returns the same function m(x) as ζ, for every τ. Verified numerically (table above). This control
passes every step; it should be recorded as such.

**E4 (Liouville row).** "Squarefree-count error, not Θ" is imprecise. The remainder is
√x·[Σ_{k≤x}μ²(k)k^{−1/2} − (12/π²)√x]; the Dirichlet series ζ(s+½)/ζ(2s+1) has its constant term
ζ(½)/ζ(1) = 0 and poles at s = (ρ−1)/2, so the remainder has exponent Θ/2. This is the control's own zero set
(ζ(2s)/ζ(s) vanishes at ρ/2). The measured 0.24 / 0.30 is consistent with 1/4. The row therefore agrees with
the lane's general statement ("returns the control's own exponent") rather than being an exception to it. The
constant 0.8326 = −12/(π²ζ(½)) was confirmed.

**E5 (head statements rest on two points).** "For K ≤ x/6 the head is at most about 10% of F" and "No finite
head approximates F" are read off x = 10⁸ and x = 99987655 only. K = 2²⁴ = 16 777 216 is slightly above
x/6 = 16 666 667 (its value, 8.2%, does not change the statement). What is exact: for K ≥ x/6 the tail is
Σ_{j≤5}(M(x/j) − M(K)) plus the smooth sum. The two sentences should be graded MEASURED at two x.

**E6 (minor).** (i) In 2.5 the "smooth density" part must carry an atom −c at u = 1 for the first line of (2) to
match r_b(1) = T_b(1) − c; the second line of (2), computed directly, is correct. (ii) For b₁ the sum range
"j ≤ x/K" and the integration range [1, x/K) agree because the j = x/K term is zero. (iii) For b₃ the maximum
between integers can be interior (log x is concave); the excess over the endpoint values is below 1/x. (iv) The
Beurling row takes values at integers only (no left limits, no jumps at 2.5·j); the function jumps there.
None changes a reported digit that matters.

## 4. Controls

No zeta-only mechanism is claimed, so there is no claim of separation to test. Checked instead that the stated
non-separation is real:

* E_a: reproduced with a different a (0.616 / 0.630 against 0.6). Passes every step.
* Unimodular twist: passes identically (E3).
* Beurling with O(log Y) discrepancy: reproduced with a different system. Passes with exponent about 1/2.
* Liouville: returns Θ/2 (E4).
* Davenport-Heilbronn: "F_b = ψ_b identically" follows from choosing target 0 (entire function, bounded
  partial sums). It is a convention, not a finding: the lemma does not engage the control. The lane says
  "lemma is empty", which is accurate; the summary line should not be read as DH failing for a structural
  reason.
* Not run by lane or referee: Beurling with Ω(Y^θ) discrepancy, θ³, backward heat, T-NR, phase-rotated
  transfer operator. The lane states this.

Requirement 3 (fails for the controls for a structural reason) is not met; the lane says so.

## 5. Other checks

* RH assumed: no. Θ is treated as unknown throughout; (d) uses Hardy's theorem; the converse of (c) uses PNT.
* Verified height: not used.
* Known theorem presented as new: no, subject to E2.
* Density a > 0: left OPEN by the lane, correctly. Section 2.4 is an identity, not a closure.
* MV-CAP statement in Section 4 is accurate: the inputs beyond identities are monotonicity (polylog), Landau
  (conditional conversion) and mean squares.

## 6. Surviving claim

For every b, F_b(x) = ψ_b(x) − a·x[m(x) log x − β(x)] − c·x·m(x) (PROVED; rearrangement of e1 Proposition 3(a)).
For b ≥ 0 of density 0 with logarithmic discrepancy, F_b = −c·x·m(x) + ψ_b with 0 ≤ ψ_b = O(log² x) (PROVED).
For c > 0 a one-sided bound of exponent θ on F_b is equivalent up to ε to Θ ≤ θ (CLASSICAL, Landau). The tail
identity (2) holds and positivity of b gives it no sign (PROVED). MEASURED exponents are confirmed on a second
range and with different control parameters. The cofinal pointwise Möbius sum is a restatement of the pointwise
bound on x·m(x) (density 0) or of e_b itself (density a > 0, OPEN). E_a, the unimodular twist and the
O(log Y) Beurling systems pass every step. No statement about zeros is obtained.
