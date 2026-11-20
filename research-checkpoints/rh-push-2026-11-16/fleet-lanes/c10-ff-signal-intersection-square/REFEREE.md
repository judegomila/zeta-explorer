# REFEREE (lens: general) for c10-ff-signal-intersection-square/RESULT.md

2026-11-18. Adversarial referee. Only this file was written in the lane directory. All runs local through
`scripts/memcap.sh 8`; the compute server was not used. Referee code: `/tmp/ref_c10/ref.py` (own implementation:
residue symbol by exponentiation mod F, squarefree A' by trial division, cop_k by brute-force gcd counts, own Gram
G_jk = q^min(j,k) t_|j-k|; nothing imported from `sq.py`).

## Verdict

**Holds, with four corrections.** The claimed verdict (precise obstruction; model only; no statement about zeta;
all requirement flags false) is confirmed. The proved steps were re-derived. One sentence of verdict item 3 is
false as written, one word of item 2 is wrong, one attribution (h > 1) is not established in this lane, and the
case counts overstate the amount of independent evidence. None of these changes the verdict.

## Re-derivations

1. **Lemma 1 (PROVED): confirmed.** The summand of S_cop depends on A' through its factorisation type (mu, the
   count of prime factors of degree lam, cop_k). The sum of nu_F over squarefree A' of a fixed type is a polynomial
   in the prime power sums; odd ones are polynomials in a of weighted degree equal to the prime degree (from
   log L), even ones count primes other than F (for deg F = 3 this changes only the count in degree 3, by the
   constant 1). Total degree <= N in a, hence a linear form in t_0..t_N. No gap found. The closed form at k = 0,
   lam > N is immediate (cop_0 = 1, no factor of degree lam): S_cop(0) = -pi(lam) h_N(alpha, alphabar).
2. **Proposition 2 (PROVED): confirmed, by the algebraic route.** G_jk = q^j + q^k - Gamma_j.Gamma_k =
   q^min(j,k) t_|j-k| = sum over roots of alpha^k (q/alpha)^j (the diagonal uses t_0 = 2g). Hence
   -D.D = sum over roots of x(alpha) x(q/alpha), and with x(z) = z^N f(z), f(z) = f(q/z): -D.D = 2 q^N f(alpha)^2
   in genus 1. This uses no property of c and no property of a. The elliptic-curve reading (F^j + V^j = [t_j],
   -P_phi.P_phi = 2 deg phi, additivity of phi -> P_phi) is consistent: Gamma_phi.Gamma_phi = 0, Gamma_phi.(E x pt)
   = 1, Gamma_phi.(pt x E) = deg phi.
3. **4(c) (PROVED, elementary): confirmed.** -D.D = 2 q^N sum_m phi_m^2 and (sum phi)^2 =
   g sum phi^2 - sum_{m<n} (phi_m - phi_n)^2. For g = 2, N = 1: gap = 2 t_2 + 8q - t_1^2.
4. **Indefiniteness of the fakes: confirmed.** x = a P_0 - 2 P_1 gives -x.x = 2a^2 - 4a^2 + 8q = 8q - 2a^2,
   negative exactly for |a| >= 6 at q = 7. M_N at a = -6: -6, 29, -132: confirmed by hand.
5. **Genus 2, h_N and partial fractions: confirmed.** sum over squarefree A' of mu nu is the coefficient of
   prod_P (1 - nu(P) u^deg P) = 1/L, so M_N = h_N of the 2g eigenvalues; h_2 = (p_1^2 + p_2)/2.

## Reruns with different cases (referee code)

| check | cases | outcome |
|---|---|---|
| Lemma 1 and square identity, q = 7, lam in {4, 5, 9}, k = 0..4 (none of these lam, and no k = 4, in the lane) | 45 vectors, 112 prime cubics | S_cop depends on F only through a: 45/45; fit on the three or four largest traces reproduces the other traces: 0 mismatches; square identity 0 mismatches; closed form 0 mismatches. Example (2, 9, 4): c = (-32296062288, 0, -9227446368) |
| same, q = 5 (q = 1 mod 4), lam in {0, 2, 3, 6}, k = 0..3 | 48 vectors, 40 prime cubics | 0 mismatches in all four checks (N = 3 has no free trace at q = 5: four traces, four coefficients) |
| same, q = 11, lam in {0, 1, 5}, k = 0..2 | 27 vectors, 440 prime cubics | 0 mismatches in all four checks |
| square identity with random rational c, random integer a in [-30, 30], q in {2..13}, N <= 5 | 2000 | 0 failures |
| genus 2, q = 5, all 624 prime quintics; M_1 and M_2 computed as Moebius sums over squarefree A' (the lane defines M_2 as L_1^2 - L_2 and does not compute the sum) | 624 | direct M_1 = t_1: 624; direct M_2 = L_1^2 - L_2 and 2 M_2 = t_1^2 + t_2: 624; genus-1 form of the equality: 0 of 624; gap between 5 and 61, never 0, never negative |

Stored outputs: `main.json` has 84 C rows and 52 D rows with 0 failures; `controls.json` matches the table of
section 5.

## Errors and corrections

1. **Verdict item 3, last sentence, is false as written.** "The squared signal is the square (P_0 . D)^2 of an
   intersection number with the diagonal class." With G_0k = t_k: -P_0.D = sum_j c_j (t_(N+j) + q^j t_(N-j)) =
   t_N S_cop, so (P_0.D)^2 = t_N^2 S^2, not S^2. Check at N = 2, a = 1, c = (7/2, 0, 1): -P_0.D = t_4 + 7 t_2 +
   98 = 71 - 91 + 98 = 78 = (-6)(-13), while S^2 = 36. The correct statement: S = -(1/2) P_0 . P_[m] for the
   class P_[m] = sum_j c_j (P_(F^j) + P_(V^j)) of the graph of multiplication by m; D is its translate by F^N, and
   pairing D with P_0 brings in the factor t_N. The conclusion drawn from the sentence (no index theorem is needed
   for the sign) is unaffected: it follows from Proposition 2.
2. **"Positive rational kappa_k" (item 2) should be "non-negative".** wt_k^2 = 0 outside the active classes. Of
   the 52 reproduced round-9 values, 20 are exactly 0 (all kappa_k = 0); 32 are non-zero, 17 exceed 1.
3. **The evidence counts overstate what was tested.**
   - The square identity holds for every vector c and every real quadratic (re-derivation 2; 2000 random cases).
     "9408 of 9408", "84 of 84", "3444 of 3444" and the column "equal to the intersection-number expression" in
     part D test nothing beyond Lemma 1. The note says so in 4(a); section 0 item 2 still presents it as the
     decisive test with outcome "equal". The decisive content is Lemma 1 alone.
   - Lemma 1's check has 6 distinct traces at q = 7 (a is odd for a prime cubic), so each vector has
     6 - (N + 1) = 4, 3, 2 free comparisons, plus the fact that S_cop is the same for curves with equal a. The
     lemma is proved, so this affects the description only.
   - The B_coh comparison with round 9 is a float comparison at relative 1e-9 with the weight function copied
     from `predict.py`; "exactly" applies to the S_cop integers (equal to the stored `ffx sc` values), not to an
     independent B_coh.
   - "2 M_2 = t_1^2 + t_2 (80 of 80)" is an identity of the lane's definition M_2 := L_1^2 - L_2 (Newton); the
     Moebius sum was not computed there. The referee run above supplies it.
4. **"h > 1 comes from the sixth-power count of the probe rows" is not established in this lane.** It is a
   reading of the round-8 law B_coh (measured for r <= 5, extrapolated for r >= 6), which this lane evaluates but
   does not test (weakest step 2 of the note says this). What is established here: inside that law the
   target-dependent factor is S_cop^2 <= pi(lam)^2-scaled Weil bound, so growth of B_coh with r can only come from
   wt_k^2. The claim should carry the label "within the round-8 law (MEASURED/extrapolated)".
5. **Attribution in 4(c).** The first inequality l^2 <= (g/2)(-D.D)/q^N needs only that every
   phi_m = f(alpha_m) is real. That holds for any polynomial whose roots pair as (beta, q/beta) with
   beta + q/beta real, including roots off the circle; it is not the index theorem. The index theorem (|alpha| =
   sqrt q) enters at the second step, -D.D <= 2 g q^N max over |z| = sqrt q of f^2. The composite bound is the
   Weil bound, as stated. No genus-2 fake was run for 4(c). For g >= 2 and N >= 2 the probe signal is not linear
   in the traces, so 4(c) does not apply to it; the bound there is |h_N| <= binom(N + 2g - 1, N) q^(N/2) directly.
6. **Untested sentence in the controls table.** "The signal sits on the span of the fibre classes H, V, where the
   form has signature (1, 1)" (trivial target) is ARGUED; no computation supports it.
7. **Scope of "multiplicativity enters at Lemma 1".** The random-sign control shows that a non-multiplicative
   sign pattern has no curve-independent c. The converse is not true in either direction: random completely
   multiplicative signs also have no c (the lane's own control), and nu_F times any function of the
   factorisation type has a c without being multiplicative (the probe's own weight (pi(lam) - #...) cop_k is of
   this kind). What Lemma 1 uses is "sums over primes of nu_F are Frobenius traces". R1 = false is correct.

## Other checks

- Nothing assumes RH for zeta or a number-field L-function. The Riemann hypothesis for the targets is Weil's
  theorem and is used only as the upper bound of item 4.
- No verified-height statement.
- No known theorem is presented as new: deg[m] = m^2, F + V = [a] and 1/L = sum h_N u^N are named as classical or
  elementary.
- Controls: no zeta-only mechanism and no positivity or zero statement is claimed, so Davenport-Heilbronn,
  backward heat and the remaining controls have nothing to act on; "not run" is acceptable. The model controls
  that were run (fakes, Liouville-twisted target, aligned vector) pass the identity, which is the reason R3 is
  false.
- The section 6 statement about Z (weights 1/(rho zeta'(rho))) is labelled ARGUED and is not used.

## Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | model identity; holds for non-multiplicative type-weighted vectors and fails for random multiplicative signs; no attack step |
| R2 | false | fixed q, N <= 3; no statement about zeros or windows |
| R3 | false | genus-1 fakes with zeros off the line, the Liouville-twisted target and the aligned vector pass |
| R4 | false | no passage to the critical line; the identity is algebraic and carries no positivity |

## Surviving claim

Model only (F_q[T], prime cubic conductor, N <= 3, exact; checked at q = 5, 7, 11). The Moebius sum of the probe
is S_cop(k) = sum_j c_j t_j with c = c(q, N, lam, k) independent of the curve (proved; at k = 0, lam > N it is
-pi(lam) h_N(alpha, alphabar)). For every vector c and every real quadratic 1 - a u + q u^2, on or off the
circle, (sum_j c_j t_j)^2 = -D.D/(2 q^N) with D = sum_j c_j (P_(N+j) + q^j P_(N-j)); the equality is algebraic
(deg[m] = m^2 on an elliptic curve), uses no index theorem and carries no positivity; B_coh of the round-8 law is
a non-negative combination of such numbers. In genus 2 the equality fails (0 of 80 at q = 7; 0 of 624 at q = 5)
and is replaced by l^2 = (g/2)(-D.D)/q^N - sum (phi_m - phi_n)^2 for trace-linear signals; M_N = h_N is not
trace-linear for g >= 2, N >= 2. The Riemann hypothesis of the target enters only as the Weil upper bound on the
signal. Within the round-8 law (measured, extrapolated for r >= 6) the growth of B_coh comes from wt_k^2. No new
input is named; no statement about zeta.
