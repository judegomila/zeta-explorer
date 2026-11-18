# REFEREE: e1-cofinal-legendre-dual

**Outcome: the verdict "precise obstruction" holds. The PROVED steps were re-derived and are correct. Five
statements need correction (Section 3); none of them carries the verdict. Two of them are in the controls and in
the measured range, both of which are in the claimed summary.**

Referee scripts and logs are in `/tmp/ref-e1/` (`big.py`, `chk.py`, `ctl.py`; not kept in the repo). All runs
local, through `scripts/memcap.sh 8`, interpreter `.venv-arb/bin/python`. The compute server was not used.
No repo data module was imported.

---

## 1. PROVED steps, re-derived

| step | result | notes |
|---|---|---|
| Form (1) of the constraint | correct | u/k + v log k/k = γY − αY log Y with Y = x/k. |
| Lemma 1 (restriction) | correct | ⌊x/(kn)⌋ = ⌊X/(qkn)⌋; h_X(qk) = (u′ + v′ log k)/k; α, γ unchanged; objective G(x) − v/q. Checked numerically for odd q (Section 2). |
| Lemma 2 (density bound) | correct | Oscillation of φ on [M, M+1] is ≤ 2 + o(1) for M = o(√x). Subtracting M = 1 from M = ⌊x^{1/2−δ}⌋ gives \|α\|(log M + 1 − 2 log 2) ≤ 4 + o(1). The O(α) term from M = 1 is o(1) only after α → 0 is known, which the same inequality gives. The bound on γ holds with an additive O(1/x) that the statement omits. |
| Density-1 discrepancy ≥ (1/8 − o(1)) log x | correct | Direct from Lemma 2. |
| Theorem 2(a)-(f) | correct | (a) needs only the source's Lemma 1.5 (or Lemma 2). (b) limit along k_i = ⌈x_i/Y⌉. (c) ε_M ∈ [\|γ*\| − 1, 1]. (d) Chebyshev identity T(Y) − 2T(Y/2) = Σ(−1)^{n+1}ψ(Y/n); bound 3 for Y ≥ 2; base case ψ(t) = b*(1) ≤ 1 + \|γ*\| ≤ 3 on [1, 2). (e) partial sums of 1 ∗ b* are T_{b*}(M); E = ζ(B* − \|γ*\|). (f) monotone in X along a divisibility chain by Lemma 1. |
| Proposition 3 | correct, classical | (a) Möbius inversion with β(x) = Σ μ(k) log k/k as in the source. (c), (d) restate source Theorem RIG (iii). The constant in (b) is κ + O(\|a\| + \|c\|), not κ (Stirling remainder and (c + a){Y} enter the partial sums of δ). |
| Proposition 5 (DH) | correct given the real-axis input | Landau with nonnegative coefficients; real-axis input re-run on a finer grid (Section 2). |
| Proposition 4 | ARGUED, as labelled | The sketch is plausible: on a block of unit length in w = log Y, sup ≤ κ log Y and variation O(Y log Y) give an H^ε norm ≲ Y^{1−2σ} log² Y per block for ε < 1/2, summable for σ > 1/2. Not a proof. The comparison (1 + 2Θ)/3 ≥ 1/(2 − Θ) is correct ((2Θ − 1)(Θ − 1) ≤ 0). |

Nothing assumes RH. Θ is used as an unknown. No statement restates verified height.

---

## 2. Numeric re-runs (different cases)

**LP at new points** (`big.py`): x = 5·10⁴, 10⁵, 10⁶, 2·10⁶, 10⁷.

| x | ν₁/√x | α | γ | v log x / x |
|---|---|---|---|---|
| 5·10⁴ | 0.9681 | 0.3027 | 0.6644 | 3.275 |
| 10⁵ | 1.0135 | 0.2963 | 0.6567 | 3.411 |
| 10⁶ | 1.0360 | 0.2176 | 0.5495 | 3.007 |
| 2·10⁶ | 1.0612 | 0.2110 | 0.5393 | 3.061 |
| 10⁷ | 1.0881 | 0.1777 | 0.4847 | **2.864** |

Agrees with the source's values (3.41, 3.01, 2.86 at 10⁵, 10⁶, 10⁷). max_k \|e_k\| ≤ 1 + 3·10⁻⁸ in each run.

**Restriction** (`chk.py`), cases not in the result: q = 3 (3·10⁶ → 10⁶, 6·10⁶ → 2·10⁶), q = 6, q = 20, q = 30,
and q = 2 at other x. Zero violations in all 11 cases, max\|e\| ≤ 1 + 5·10⁻⁸. Restricted objective: q = 2:
−0.39 to −0.52 √x; q = 3: −0.47, −0.49; q = 4: −0.02; q = 6: +0.23; q = 20: +0.10; q = 30: −0.15.

**Profile law out of sample** (m = 5, 7, 10, 11, 13, 14, 15, 30 at x = 10⁶, 2·10⁶, 3·10⁶, 6·10⁶). The sign is
μ(m) in all 32 squarefree entries. Sizes against E(1)μ(m)√m/σ(m): within 10% at m = 2, 3, 5; off by 15-25% at
m = 7, 10, 11, 14; off by 30-45% at m = 15; off by a factor 1.5-2.2 at m = 30 (measured −0.12 to −0.17,
predicted −0.08). At m = 20 (μ = 0) the entry is +0.10.

**Chebyshev finite form and γ**: left minus right ≤ −2.08 at all five new x. G_x(1) = G_x(2) = G_x(3) = 0 at
all. γ_x equals the proved bound min_M[1/(M+1) + α log(M+1)] to within 2·10⁻³ at every x (0.5123 against
0.5124 at 6·10⁶): the optimum has 𝒯(M) = 0 for M ≤ 4, so γ_x > 0 is a consequence of G_x vanishing at the
first few integers, and γ_x → 0 at the rate of the bound.

**ext and cof at x = 2·10⁴** (not in the result): ext/√x = 0.980, 0.893, 0.836, 0.755, 0.696, 0.663, 0.635 for
X/x = 1..64; ext·log X/√x = 9.71 → 8.82 → 8.93. cof·(1 + log X)/√x = 5.13, 5.05, 5.05, 4.95, 4.90, 4.90 for
X/x = 1..32. Same behaviour as reported.

**DH on the real axis** (`ctl.py`, 30 digits, step 0.0025 on (0, 4], σ = 1 excluded and approached to 10⁻⁶):
min 0.657885 at σ = 0.0025 (limit 0.6 + 0.2ξ = 0.656816 at 0), f(1 ± 10⁻⁶) = 0.92280, no sign change, largest
finite-difference slope 0.43 (largest drop between grid points 0.0011). Not interval-certified. For σ > 4 the
series is positive termwise-dominated. The result's own run has a NaN at σ = 1 (`controls.log`: "f(1) nan";
the Hurwitz terms have poles there), so its sign-change test skipped the two intervals adjacent to 1; the
conclusion is unaffected.

---

## 3. Errors and corrections

**E1. The measured range in the summary is not stable (verdict item 2).** "v log x/x stays in [2.94, 3.44] with
no monotone drift" omits the source's own value at 10⁷, 2.86, which this referee reproduced (2.864) and which
is below the stated range. On decades the sequence is 4.08, 3.41, 3.01, 2.86: monotone decreasing with
shrinking steps. The first five grid points of the result are all ≥ 3.20 and the last five all ≤ 3.22.
Correct statement: v log x/x decreases from 4.08 to 2.86 over 10⁴..10⁷ with fluctuations of ±0.2 between
doublings; the data do not decide between a positive limit and slow decay to 0. Nothing proved depends on it.

**E2. E_a does not pass "Λ_a ≥ 0 with logarithmic discrepancy" (verdict item 4, control row E_a).** For
a(n) = n^{−a}σ_{2a}(n) the true point has sawtooth Σ_{n≤Y} a(n) log n, whose jumps are a(n) log n ≥ n^a log n.
Its discrepancy against any smooth target is therefore ≥ ½Y^a log Y. Measured for a = 0.2 (`ctl.py`, Y ≤ 2·10⁶):
the unweighted discrepancy has rms 4.5 → 42.9 over 2¹⁰..2²⁰ (local exponent 0.39 → 0.28) and maximum 261 at
Y ≈ 10⁶, against 1 + log Y = 14.8; the log-weighted discrepancy reaches 3765. So Λ_{E_a} is outside the
analogue of 𝒞, for the same reason as the Beurling row. What survives: Λ_{E_a} ≥ 0 and its discrepancy is
O(Y^θ′) with θ′ < 1/2 + a, so RIG's remainder is holomorphic past the line 1/2 + a and the chain returns the
exponent 1/2 + a. Correct statement of the separating step: Λ_a ≥ 0 with sawtooth discrepancy of exponent
below the target. Logarithmic discrepancy is a property of the integers (Stirling), it fails for E_a, and it is
not what the chain uses.

**E3. "Lemma 1, Theorem 2, Propositions 3-4 hold with ζ replaced by E_a" is asserted, not proved.** Theorem 2(d)
uses the identity T(Y) − 2T(Y/2) = Σ(−1)^{n+1}ψ(Y/n), which belongs to the weight a(n) = 1. No replacement is
given for the weight n^{−a}σ_{2a}(n). Grade: ARGUED at most.

**E4. Sign-twist row: "Lemma 1 fails" is wrong.** The restriction rule uses only ⌊x/(kn)⌋ = ⌊X/(qkn)⌋ and the
form of the smooth part; it holds for any weights a(n). Only Theorem 2(d) (and 2(a), which uses G ≤ 𝒯) needs
a(n) ≥ 0. Also, "the same Landau argument gives the corresponding statement for θ³ and for the Liouville twist"
is unsupported: for f = ζ(2s)/ζ(s) the quotient sR̂/f = sR̂ζ(s)/ζ(2s) can have a real pole at s = 1, so Landau
gives convergence only for Re s > 1 unless R̂(1) = 0; for θ³ the real zeros of the Epstein zeta function were not
examined.

**E5. "Single measure b on [1, ∞)" in the consequence of Lemma 2 needs integer support.** T_b is constant on
[M, M+1) only if b is carried by the integers. Counterexample otherwise: b = a·dt has
T_b(Y) = aY log Y + (γ_Euler − 1)aY + O(a), bounded discrepancy at density a > 0. The LP's b is integer-supported,
so Lemma 2 and Theorem 2 are unaffected; the class 𝒞 in Section 4 should say "b ≥ 0 on the integers".

Smaller points.
* Novelty. The density cap is in the source (`2026-11-01-r3-legendre-dual-lp.md`, Section 1.2, last bullet:
  "Lemma 1.4 forces this to be ≤ 2 for every M ≤ mmax. So v = O(x/log x)", with the same measured column).
  Lemma 2 adds the constant 8 and the γ bound; it should cite that bullet. Proposition 3(c), (d) are the
  source's RIG (iii). The result does not list either as new; the plan's list of new items is accurate.
* `check_restrict.py` objectives are the profile entries E_X(q) and are not independent evidence: the
  restricted objective is G_X(X/q) − α X/q = E_X(q)√x by definition. One measurement, reported twice.
* The profile law is a small-m approximation (Section 2). "Follows μ(m)√m/σ(m)" should read: sign μ(m) for
  squarefree m ≤ 30 tested; size within 25% for m ≤ 14; not zero at non-squarefree m (m = 20: +0.10).
  The inconsistency between x and 2x needs only the sign at m = 2 and is confirmed at eight x.
* Not tested, as the result states: backward heat, T-NR, phase-rotated transfer operator. The unimodular-twist
  row is argued from the sign-twist row and has the same defect as E4 for Lemma 1.

---

## 4. Checks requested by the assignment

* RH assumed anywhere: no.
* Verified height restated: no.
* Known theorem presented as new: no; two unattributed overlaps with the source listed above.
* Zeta-only mechanism claimed: none. The result states that no step separates ζ from E_a. After E2 the
  accurate form is: logarithmic discrepancy holds for ζ and fails for E_a, but the chain does not use it;
  the exponent returned for E_a is 1/2 + a.
* Three requirements: not met by any statement here, as the result says (Proposition 4 is a mean value;
  Theorem 2 is an obstruction).

---

## 5. Surviving claim

PROVED (author and this referee): dual-feasible points of the Legendre LP restrict along divisibility chains;
α log x ≤ 8 + o(1); every limit point is feasible at every real scale, has density 0,
ψ(t) ≤ 3 log₂ t + 3, and Dirichlet transform \|γ*\| + E/ζ holomorphic in Re s > 0; at density 1 the discrepancy
is ≥ (1/8 − o(1)) log x for integer-supported b. MEASURED (10⁴..10⁷): v log x/x falls from 4.08 to 2.86 with
±0.2 fluctuations; the optimum vanishes at fixed t; its excess at x/m has sign μ(m) and the optimum at qx
restricted to x has objective −0.39 to −0.52 √x at q = 2, 3 against +1.0 √x. Pivot statements as in the
result, Proposition 4 ARGUED. Controls: Λ_a ≥ 0 fails for DH, Liouville, θ³; Beurling and E_a have Λ_a ≥ 0 but
power-size sawtooth discrepancy; for E_a the chain returns the exponent 1/2 + a and nothing separates it from ζ
at the level of exponents. No statement about zeros of ζ.
