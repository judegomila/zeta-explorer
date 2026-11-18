# REFEREE (lens: general) for c5-thin-walk-replay/RESULT.md

Date 2026-11-18. Claimed verdict: partial-result. Referee verdict: **holds as a partial result, with the corrections
E1-E6 below.** No statement about zeros of zeta is made in the result and none is made here.
Flags set by the referee: R1 = R2 = R3 = R4 = false.

Manuscript passages were read as text from `~/lean-deps/qrh-verify/paper.txt` (lines 381-470, 2775-2990, 2360-2575,
3040-3365, 3690-3712). Nothing was executed from the repo data modules. The compute server was not used.

## 1. Steps re-derived

| step | outcome |
|---|---|
| Lemma 1* upper bound D_{k,C} <= 0 | confirmed (n_C <= floor L_{k,C} at each inclusion, L increasing) |
| Lemma 1* lower bound | confirmed relative to H_K(theta). After the last y with n_C = floor L_{k,C}(y) every class-C prime is included (a refused prime would restore equality). Dyadic pieces have h = left end, inside [x^theta, x]; class-C count >= c h/log x' >= L-increment h x'^(b-1)/(2 h_k log x') because x'^(b-1) <= X_k^(b-1) <= 2 c_{m_k}; last short piece <= x^(theta+b-1). Ties at equal norm are covered by the constant 2 |
| Corollary | confirmed. Targets telescope to (L(x) - L(X_{k_0}))/h_q; stage-j error <= (h_j/h_q)(2 + x^(b-eta)) <= (2 + x^(b-eta)) log x by (c); completed stages sum geometrically by (d) (the factor 2 is not exact for the constant terms: sum_j 2 log X_{j+1} <= 4 log x; harmless) |
| Theorem 2 (i) | confirmed factor by factor |
| Theorem 2 (ii) | confirmed: log G_psi = -2 sum_{j odd} (1/j) sum_{p in S} psi(p)^j Np^(-js); j >= 3 terms converge for Re s > b/3; j = 1 term by partial summation with D_psi = O_q(x^(b-eta) log x) (orthogonality on the ray class group mod q); G_psi = exp(analytic) has no zero |
| Theorem 2 (iii), (iv) | confirmed: int x^(-s) dL = -(1/2) log(s-b) + analytic, so G = (s-b) W. zeta(b) < 0 on (0,1); L(s, chi_-3) > 0 on [1/2, 1] checked numerically (minimum 0.4809 at s = 1/2, step 0.005) |
| Lemma G1 | confirmed against the text of Proposition 2.1: C has slope one, omega = (beta* - sigma_0')/2 < Delta_0', H holomorphic on the smaller half-plane, (2.5) is relative to C(beta*) and unchanged. If sigma_0 + lambda >= 1 the conclusion is trivial |
| Lemma G2 (Cauchy-Schwarz step) | confirmed against the proof of Proposition 6.3: Q^(-1/2) (Q/Y)^(1/2) Z^(E/2) = Z^(-1/4 + E/2) at X = Y = Z^(1/2); Lemma 6.2 contains no target. That (6.2) holds for a non-character weight was not re-derived by the referee (label REPLAYED stays) |
| Lemma G3 | confirmed for squarefree rows and squarefree c: Minkowski over n, then (9.1) with K = D = Z gives Z^(4/3); coefficients depend on n, not on the row |
| Proposition G algebra | confirmed: E <= max(1 + 2 kappa, tau_0 - 2e), abscissa 5/12 + E/2. See E1 for the value of tau_0 |
| e = (1-b) delta/2 | confirmed: eps(c) = prod_{p in S, p | c} (1 - 2); a_2(c) != 0 forces S-part of norm > D; sum_{d in <S>, q_d > D} 1/q_d << D^(b-1+epsilon) by Rankin (sum_{p in S} Np^(-s) converges for s > b) |
| kappa = (1+b) delta | arithmetic of the Minkowski sum confirmed (Z^(1/2) sum_{q_d <= D} 2^omega(d) q_d << Z^(1/2 + (1+b) delta + epsilon)); the per-d energy Z^(1 + 2 delta_d) is read from the statement of Lemma 5.7 (T_0 = 2H + 2A_0 - N - N_0 - 3B_0 with N_0 = B_0 = 0) and stays ARGUED |
| g_THIN closed form | confirmed: vertex at delta = 1/(3(3+b)); 401/372, 505/468, 1025/948, 13/12 reproduce; derivative of g - b is negative |
| (N) | confirmed as an implication of Proposition D + Lemma G2 under its stated hypotheses. See E3 |
| O1 | confirmed from the text: rho = chi_p(u/p^j) (line 3103), W_loc = rho Q^-w, row 4 of (7.16) and (7.9), (7.10) give rho^(k-t) = rho^-1, while the lemma sets D = eta(p) chi_p(u) Q^-x = eta(p) rho Q^-x. E_p then keeps eta(p)(rho - rho^-1) Q^-x |
| degree audit of (7.16), b_p^3 = a_p^2 | confirmed against lines 3104-3106 and the table: eta enters (7.4) as the scalar eta(A) |

## 2. Numeric checks rerun, different cases (own code)

Script `/tmp/ref-c5-walk/chk.py` (outside the lane directory), run through `scripts/memcap.sh 8`, `.venv-arb` python,
planned memory printed first (< 100 MB), run time under 1 minute.

1. **Stagewise class greedy (toy over Q; the lane has no numeric test of Theorem 2).** b = 0.92, primes to 4e6,
   stage 1 = classes mod 7 on (100, 1e4], stage 2 = classes mod 35 on (1e4, 4e6]. D_{k,C} over all times:
   in [-0.999, 0] (stage 1), [-1.385, 0] (stage 2). Coarse classes on the union: mod 5 count - L/h in
   [-3.72, -1.72] (target 11413.7 per class); mod 7 in [-3.15, -2.15] (target 7662.1); mod 35 in [-1.29, -0.29].
   sup over x of abs(D_psi(x)) for a character of order 6 mod 7: 7.2 with 45958 primes in S. Consistent with
   Lemma 1*, the Corollary and D_psi = O(x^(b-eta) log x). This is the rational analogue, not Z[omega]; it tests the
   combinatorics of the rule, not H_K(theta).
2. **Local factor, other parameters** (eta(p) in {-1, i}; rho in {zeta_6, zeta_3, zeta_3^2, zeta_6^5}, never real;
   Q = 43, 211, 2003, 49999, 1000003; imaginary parts to 200; 3000 points per Q).
   Region (7.15), D = eta rho^-1 Q^-x: sup abs(H_p - 1) Q^(363/200) = 2.32, 2.29, 1.55, 1.51, 1.09 (bounded).
   Region (7.15), D as printed: 62, 268, 2195, 45195, 754953 (growth about Q^0.94).
   Region (7.14) (not sampled in the lane), D = eta rho^-1 Q^-x: sup abs(H_p - 1) Q^1.02 = 1.26, 1.36, 1.05, 1.05,
   1.00. As printed: 14, 29, 85, 431, 1986: in the first region the printed D leaves H_p - 1 of size Q^(-Re x),
   which is not summable at Re x = 51/100. O1 reproduces in both regions.
3. **g_THIN, exact rationals, other b** (vertex computed independently): b = 22/25: 1255/1164; b = 93/100:
   5095/4716; b = 977/1000: 51655/47724; b = 3/5: 115/108. All equal the closed form; g - b > 1/12.
   With tau_0 = 3/2: g = 11/12 + (1+b)/(2(3+b)) (1.1589 at b = 22/25); with tau_0 = 2: 11/12 + (1+b)/(3+b).

## 3. Controls

No zeta-only mechanism is claimed, so no control has to fail. Sanity: S empty gives G_psi = 1; with the corrected D
the bounds of Lemma 7.1 hold for eta(p) = -1 and for a non-real unit phase alike, so the local identity does not
separate THIN from a Hecke character (as the result says). The control table of section 4 is classification by
clause (starred entries are inference); it is not a replay and adds no verified control outcome.

## 4. Errors and corrections

**E1 (Proposition G: the value tau_0 = 4/3 is not established for the row set of (6.2)).** Identity (6.2) sums over
all m != 0 with q_m <= C Q. Lemma 9.1 is stated for squarefree rows only, and Lemma G3 is proved for squarefree rows
and squarefree c only. So "g = max(11/12 + kappa, 13/12 - e)" and "g_THIN(b) = 11/12 + (1+b)/(3(3+b))" are the
abscissa of a squarefree-row model, not of the argument. The value tau_0 = 3/2 for rows with a powerful part is
stated without proof ("the same method"); the proved value is the trivial one. With tau_0 = 3/2 the formula is
11/12 + (1+b)/(2(3+b)). The result notes monotonicity in tau_0 and lists the restriction among the weakest steps, so
the consistency inequality g >= b is not affected, but the verdict item 3 and the headline numbers (401/372 to 13/12)
must carry "squarefree rows only". Proposition G should not be labelled PROVED-rel for tau_0 = 4/3.

**E2 (the consistency test is vacuous; "decisive test" is a misnomer).** For every admissible (kappa, e) reached
here g > 1 >= b, and Proposition 2.1 requires sigma_0 < 1. "g_THIN(b) - b >= 1/12" follows from g >= 1.06 and b <= 1
without any use of the construction. The result says this ("not sharp", "proves nothing for THIN"); it should not be
listed as a passed test. No information about THIN or about the manuscript follows from item 3 as it stands.

**E3 ((N): hypotheses and the delta = 1 step).** (a) (N) depends on the high comparison (2.5) for I_eps, on (2.2)
for H_eps (bounds sampled, not proved, in this lane), on Theorem 2 (so on H_K(theta)) for the twist-closed family,
and on (6.2) for a non-character weight. None of the first three is established; (N) is an implication. (b) It has
content only for b > 11/12 (for b <= 11/12 the character value E = 1 already satisfies E >= 2b - 5/6).
(c) "With e(delta) = (1-b) delta/2 the second term exceeds b for all delta < 1 ... so (N) binds only at delta = 1":
at delta = 1 the formula still gives 7/12 + b/2 > b. The constraint kappa(1) >= b - 11/12 comes from a_2 = 0
(e = infinity) once D exceeds the support of the c-sum, not from e(1). With a Gaussian test V the c-sum is not
supported in q_c <= Z, so D = Z^(1+epsilon) and a tail estimate are needed. The conclusion is unchanged; the sentence
should be rewritten.

**E4 ("No conductor uniformity [PROVED for this construction]").** What is shown is that the proof gives no
uniform bound (the constant contains the non-explicit thresholds). That uniformity fails for the constructed set is
not shown. Label: not obtained; OPEN.

**E5 (Theorem 2 is conditional and non-effective).** H_K(theta) with theta independent of the modulus is not located
(the result says so; weakest step 1). The referee did not locate it either; it is the expected consequence of a
zero-density estimate for Hecke L-functions of a fixed field with exponent independent of the character, plus a
fixed-character zero-free region, but no statement was checked. The thresholds x_q, c_q are not explicit, so the
set S of Theorem 2 is not computable from the proof and the numerics of c4 (single-class rule) do not apply to it.
The twist-closure is under finite-order ray class characters only, which is the manuscript's family (2.1). Without
H_K(theta) (Balog-Ono exponents) the twisted members continue only to Re s >= b, as the result states.

**E6 (scope of "HOLDS" in the replay table).** The referee confirmed from the text: target enters (7.4) only as
eta(A); table (7.16) exponents of rho and eta; (7.17) numerically; the size bounds with the corrected D; the
Cauchy-Schwarz step of Proposition 6.3; target-freeness of Lemma 6.2 and Lemma 9.1. Not confirmed here: the
absolute-convergence claim for (6.1) and the identity (6.2) for a non-character weight (sections 5.5 and 6.1 were
not re-derived), and (2.2) with an actual constant (3.48 is a sampled supremum; P_0 = 43 is an illustration). The
row "(2.2) HOLDS" should read "holds given the O(Q^(-15/8)) bound of Lemma 7.1, which is uniform in the unit phase".
The "continuation clause" row gives meromorphy only: no bound for 1/G_psi in b - eta < Re x < b uniform in q_u,
so later steps that use growth of the reciprocal (Lemma 4.8, Section 8) are not covered; the result says this.

Minor.
* O1 is a statement about the text extraction. PDF and Lean statement were not compared by the lane or by the
  referee. It may be a lost overline; it should not be reported as an error in the manuscript.
* Baker-Harman-Pintz constant and Huxley in progressions are recalled in the result; not re-read here.
* Prime-altering constructions with a prescribed zero are of a known type; Theorem 2 is a control, not a new theorem
  about L-functions. Lemma G1 is a corollary of Proposition 2.1.
* `replay_local.py` and `replay2.py` print an unsimplified sympy residual for (7.17) at j = 0; only `replay3.py`
  (numeric) supports that case.

## 5. Checks on framing

RH assumed: no. Verified height restated: no. Unrefereed 7/8 manuscript used as a proved input: no (used as text;
the implication (N) is stated relative to it). Known theorem presented as new: no, with the minor points above.
No claim about zeros of zeta.

## 6. Flags

* R1 false: no mechanism with essential multiplicativity is established. The replay shows the local identity of
  Lemma 7.1 holds for a completely multiplicative unimodular weight with a zero at b.
* R2 false: no height-uniform statement.
* R3 false: no attack; one control walked through some steps, others classified by clause.
* R4 false: nothing passes to the critical line.

## 7. What survives

Relative to H_K(theta) (a Hoheisel exponent in ray classes of Q(sqrt(-3)) independent of the modulus; not located):
a stagewise greedy set S of prime ideals with pi_S(x; C) = L(x)/h_q + O_q(x^(b-eta) log x) in every ray class, and
L(s, eps_K psi) = L(s, psi) G_psi(s) with G_psi analytic and zero-free on Re s > max(b-eta, b/3) for non-principal
psi, G = (s-b) W for principal psi; no conductor uniformity obtained. The combinatorial part (Lemma 1*, Corollary)
is confirmed and reproduces in a toy case over Q. In the extracted text of the 7/8 manuscript, Lemma 7.1's identity
and size bounds hold for eta(p) = +-1 (and any unit phase) provided D = eta(p) chi_p(u)^-1 Q^-x; with D as printed
the bounds fail for non-real chi_p(u) in both regions. Lemma G1 and the Cauchy-Schwarz link (energy exponent E gives
abscissa 5/12 + E/2) hold. The formula g(kappa, e) = max(11/12 + kappa, 13/12 - e) and g_THIN(b) hold for a
squarefree-row model only, with kappa argued; g_THIN > 1, so the consistency check carries no information. (N) is a
conditional implication with content only for b > 11/12.
