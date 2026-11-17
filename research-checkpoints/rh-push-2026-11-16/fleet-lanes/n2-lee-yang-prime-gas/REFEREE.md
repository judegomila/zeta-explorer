# REFEREE: n2-lee-yang-prime-gas

Referee pass of 2026-11-17 (internal, adversarial; no external review). Claimed verdict: precise-obstruction.

## Outcome

**holds = true, with four corrections to wording and one narrowing of scope.** Every step labelled PROVED was re-derived by hand and confirmed. No step assumes RH, with one exception in the summary lines (item E1). Nothing restates verified height. No statement about zeros of zeta is made. The lemmas are classical and are labelled so; the lane claims novelty only relative to the internal map.

## 1. Re-derivation of the PROVED steps

| step | result | notes |
|---|---|---|
| L1.1 two-site polynomial | confirmed | abs(1+av)^2 - abs(a+v)^2 = (1-a^2)(1-abs(v)^2); a+v = 0 gives 1+av = 1-a^2 != 0, so no root is lost |
| L1.3 Asano contraction | confirmed | set y = x; product of roots A/D has modulus >= 1 |
| L1.4 contraction to Z(z) | confirmed | pair factor contributes 1, a_pq u_pq, or u_pq u_qp; for abs(S) = 2 no contraction is needed |
| L1.5 inversion | confirmed | complement A, symmetry of a |
| Remark, signs | confirmed | cut_N(A) = sum deg - 2 e_N(A). Checked numerically: coefficient difference exactly 0 on a random sign graph, k = 8 |
| Remark, Hermitian phases | confirmed | sum over p in A, q notin A of phi_pq = sum over p in A of Phi_p, because the antisymmetric sum over ordered pairs inside A is 0 |
| Lemma 2(i), functional equation | confirmed | 1/z_p = -p^{c-(2c-s)}; prod z_p = mu(P) P^{c-s} |
| Lemma 2(ii) | confirmed | Q(n) = sum over p in A of sum over q in A, q != p of J_pq <= sum R_p |
| Lemma 2(iii) | confirmed with a remark (E3) | with L = log P the mean-field example has c(p) = e^{log^2 p/(2L)}, not 1 |
| Lemma 2(iv) | confirmed | checked numerically, case A3 below |
| Lemma 2(v) | confirmed for Re s > 3/2; the Re s > 1 claim needs Theorem 3 (E4) | |
| Theorem 3 | confirmed | (3.1): exponent 1/2 - sigma_0 + delta = -delta; (3.2): 1+y <= 2 max(1,y); max of u - sigma - u^2/2 is 1/2 - sigma at u = 1 and the Gaussian integral is <= e^{L(1/2-sigma_0)}; pi(x) log 2 = o(L). Uses Chebyshev only. No RH |
| Corollary 4, as stated in section 3 | confirmed, except the two-point clause (E2) | error term O(abs(s) x^{1-sigma} e^{-c sqrt(log x)}) from partial summation of pi - li; this is o(x^{1-sigma}/log x), not O(1) |
| First-order pair bound (section 4) | confirmed | 2 abs(w_p w_q) <= abs(w_p)^2 + abs(w_q)^2 |
| Theorem 5(a) | confirmed | interior of gamma lies in H; identity theorem on interior minus {1}; G bounded near 1 |
| Theorem 5(b) | confirmed | holds whether or not zeta has zeros inside gamma (a zero of zeta inside would be a pole of the limit, also a contradiction). No RH |
| Theorem 5(c) | confirmed | zeta < 0 on (0,1) |

## 2. Errors and corrections

**E1 (substantive; the only place where RH enters silently).** The Verdict paragraph and the lane summary state log abs(Theta_S zeta) = -Re Ei((1-s) log x) + O(1). The O(1) is not proved and is not provable without RH: sum_{p<=x} p^{-s} - Ei((1-s) log x) bounded uniformly on compacts of 1/2 < Re s < 1 implies convergence of the integral of t^{-s} d(pi - li)(t) for Re s > 1/2, hence analytic continuation of log((s-1) zeta(s)) to Re s > 1/2, i.e. RH. The proved statement is the one in the body of Corollary 4: remainder O_K(1) + O(abs(s) x^{1-sigma} e^{-c sqrt(log x)}). The conclusion "unbounded" is unaffected, since the main term has modulus about x^{1-sigma}/(abs(1-s) log x). The measured remainders (-0.31 to -0.19 in the result; 0.38, 0.29, 0.19 at s = 0.6 and below 0.04 at five complex points in my run) are MEASURED at x <= 3e5 and are consistent with verified height; they are not evidence for the O(1).

**E2 (minor, false clause).** Corollary 4: "on every K containing ... two points with different t, sup_K >= c x^{1-sigma}/log x for all large x". Counterexample: K = {s, conj(s)}. abs(Theta_S) takes the same value at both points and Re Ei((1-s) log x) changes sign infinitely often in x, with jumps of the prime sum of size p^{-sigma}. For two points with rationally independent t the phases (t_1 log x, t_2 log x) are dense mod pi, so the lower bound with a fixed c also fails along a sequence of x. Correct forms: K contains a real point (all large x), or K has interior (all large x), or a single non-real point (limsup only).

**E3 (minor, inconsistency).** Two different objects are called "mean-field". Section 3 uses c(n) = e^{log^2 n/(2L)}, L = log P, for which R_p = (1/2) log p (1 - log p/L) and c(p) = e^{log^2 p/(2L)} > 1; this is outside the normalisation c(p) = 1 of Lemma 2(ii). Section 4 uses M = 1 rescaled to exact row sums (1/2) log p. This explains D = 2.266 (section 3) against 1.986 (section 4) at k = 8. Both satisfy Lemma 2(i); the conclusions do not change. The sentence "admissible coefficients are mu(n) e^{Q(n)}, Q >= 0" holds under the normalisation c(p) = 1; in general c(n) = prod_{p|n} c(p) e^{Q(n)}.

**E4 (minor, proof gap).** Lemma 2(v): "for the mean-field example on Re s > 1" does not follow from the stated dominated convergence (abs(c(n)) <= n^{1/2} gives Re s > 3/2 only). It follows from Theorem 3 plus convergence of the Euler product on Re s > 1. Theorem 3 does not use Lemma 2(v), so there is no circle; the reference should be added.

**E5 (misprint).** Control table, backward heat row: with the convention Q = 2 sum J, the coefficient e^{t log^2 n}, t < 0, corresponds to a_pq = e^{abs(t) log p log q}, not e^{2 abs(t) log p log q}. Still > 1; the row's conclusion is unchanged.

**E6 (scope of the verdict).** "False unconditionally for every coupling matrix and every exhausting sequence" is proved for the step as formulated (local boundedness on all of Re s > 1/2), and needs the hypothesis of Theorem 5 that F_j -> 1/zeta on an open set (pairwise J -> 0 with normalised single-site coefficients). Theorem 5 does not exclude boundedness of 1/Theta_S on the slit domain {Re s > 1/2} minus (1/2, 1], which is simply connected and on which Hurwitz would still give RH. That case is closed by proof only for the mean-field coupling (Theorem 3 with Corollary 4: blow-up at every point of 1/2 < Re s < 1). For general couplings it is ARGUED (first-order bound, nine families at k <= 18, free search at k <= 10). The result says this in weakest step 1; the Verdict paragraph and the summary line "so the Hurwitz step is false" should carry the same restriction. "None can" at the end of the free-search paragraph refers to Theorem 5 and is correct only for domains containing a curve around 1 or a real point of (1/2, 1).

**E7 (section 6, as labelled).** The triangle statement and "iff RH" are a sketch. I checked the exponent: the continuation is (sqrt(Lam/2 pi)/i) times the integral over Re w = c of e^{Lam (s-w)^2/2} P(w) dw, and the branch point at w = 1 gives modulus e^{Lam((1-sigma)^2 - t^2)/2}; a zero at beta + i gamma contributes only if beta > sigma, in the cone abs(t - gamma) < beta - sigma. The shape is right. Uniformity of the sum over zeros in Lam is not shown. It is a restatement of RH and is presented as such.

## 3. Numerical rerun (different cases)

Script /tmp/ref_n2/ref.py, independent brute-force code (does not import lib.py), run as `scripts/memcap.sh 8 .venv-arb/bin/python /tmp/ref_n2/ref.py`; 4 s, largest allocation 159 MB. Zero counts by argument change on rectangles, 0.37 < t < 30.

| case (not in the result) | outcome |
|---|---|
| A1: 8 random Beurling reals in (1.3, 21.3), random non-rank-one J (exponential entries), random negative-coupling graph, c = 0.37 | 85 zeros in the box, 85 within 0.01 of Re s = 0.37 |
| A2: 8 primes, a_pq random in [0,1] with entries 0, +1, -1 included, c = 1/2 | 76 of 76 within 0.01 of the line |
| A3: relaxation, lambda_p = p^{c_p}, c_p random in [0.132, 0.411] | 76 of 76 in the strip min c_p <= Re s <= max c_p; 0 with Re s > 0.501 |
| Mean-field coefficient formula mu(n) chi(n) e^{log^2 n/(2L)} against the gas definition | agreement 3e-12 |
| Theorem 3, zeta, abs(Theta/E - 1) at s = 0.6; x = 2e3, 2e4, 2e5 | 0.675, 0.461, 0.293 |
| same at 0.65+7.3i, 0.8+0.8i, 0.7+5i, 0.55+3i, 0.75+14.5i; x = 2e5 | 1e-4, 9e-4, 4e-4, 1.8e-2, 1e-4 |
| Corollary 4, s = 0.6: log abs(Theta zeta); Ei(0.4 log x) | -9.825, -18.820, -36.665; 10.208, 19.111, 36.854 |
| chi_3 twist (new control), log abs(Theta L(s,chi_3)/(1-3^{-s})) at s = 0.6 | -0.133, -0.098, -0.088 |
| chi_3 twist at 0.55+3i | 0.002, -0.013, -0.031 (not monotone; rate x^{-0.05} at best; does not contradict the result) |

The value -36.665 at x = 2e5 lies between the result's 29.914 (x = 1e5) and 41.344 (x = 3e5). Reproduced.

## 4. Controls run by the referee

The result does not claim a zeta-only mechanism; it claims the Lee-Yang step is control-blind and the boundedness step fails for zeta because of the pole. Both statements were tested.

| control | my run | agrees with the result |
|---|---|---|
| Backward heat, coefficient e^{t log^2 n}, k = 8, formal line Re s = tL | t = -0.01: 30 of 74 zeros within 0.01 of the line; t = -0.03: 20 of 74. Forward t = +0.02: 75 of 75 | yes: a_pq > 1 breaks L1.1 |
| Davenport-Heilbronn type: sum of two gases with twists chi, conj(chi) mod 5, primes 2, 3, 7, ..., 23, mean-field coupling | chi gas alone: 84 of 84 on the line. alpha Theta^chi + conj(alpha) Theta^conj(chi) with alpha^2 = conj(chi(P)) (this sum has the functional equation f(s) = mu(P) P^{1/2-s} f(1-s)): 70 of 76 on the line, 6 off. DH weights (1 -+ i kappa)/2: 48 of 84 within 0.01 (max argument step 3.0 on the thin rectangle, so this count is approximate; the box count 84 is clean) | yes: the Lee-Yang property is lost under sums although the functional equation is kept. The lemma fails for DH at L1.2 (no product over sites) |
| Sign twist | A1 above includes a random sign graph; chi_3 and chi mod 5 gases have all zeros on the line | yes: twist-blind |
| Beurling | A1 | yes: Beurling-blind |
| Boundedness for a pole-free twist | chi_3: abs(log abs(Theta/target)) <= 0.14 at x <= 2e5 on six points | yes (MEASURED only) |

Consequence, as the result says: the Lee-Yang step carries no arithmetic information (it holds for sign twists, Beurling systems and every line Re s = c), and it fails exactly on the controls that are not products over independent sites. The step that separates zeta from its twists is the prime sum sum_{p<=x} eps_p p^{-s}, and there zeta is on the failing side.

## 5. RH, verified height, novelty

- RH is not assumed in any PROVED step. It enters only through the "+O(1)" wording of E1.
- Nothing restates verified height. The bounded-remainder measurements at x <= 3e5 would be explained by verified height and are not used in any proof.
- Known results (from memory; no literature search was run): Lemma 1 is the Lee-Yang circle theorem with Asano's proof (Lee-Yang 1952, Asano 1970, Ruelle 1971). The Gaussian average Theta_S = E_g E_S(s - g/sqrt L) is a Polya-de Bruijn universal factor acting on the truncated Euler product, so zeros on a line for the rank-one coupling also follow from de Bruijn 1950. Divergence of the truncated Euler product of zeta in the critical strip through the pole term is classical (it is the term removed in the Gonek and Gonek-Hughes-Keating finite Euler product models). Convergence of the Euler product of L(s, chi) for Re s > 1/2 being equivalent to GRH(chi) is classical (Conrad 2005). Theorem 5 is a direct Montel-Hurwitz argument. The result labels these PROVED / CLASSICAL and does not present them as new to the literature. The combination (gas = Euler product times 1+o(1) on Re s > 1/2 for the mean-field coupling) I did not find stated elsewhere, but it is a short computation, not a new method.

## 6. Surviving claim

1. Lemma 1, the Remark, and Lemma 2(i)-(iv): PROVED (classical). Lemma 2(v): PROVED on Re s > 3/2; on Re s > 1 for the mean-field coupling via Theorem 3.
2. Theorem 3: PROVED, Chebyshev input, any twist with abs(eps_p) <= 1.
3. Corollary 4, corrected: log abs(Theta_S zeta) = -Re Ei((1-s) log x) + O_K(1) + O(abs(s) x^{1-sigma} e^{-c sqrt(log x)}); unbounded at every point of 1/2 < Re s < 1 (limsup), and for all large x at real points and on sets with interior. "+O(1)" is equivalent to RH and is not claimed.
4. Theorem 5: PROVED for sequences converging to 1/zeta on an open set; it forces blow-up on curves around 1 and near real points of (1/2, 1). It does not by itself exclude boundedness on {Re s > 1/2} minus (1/2, 1].
5. For general couplings, growth away from the real segment is MEASURED (k <= 18) and ARGUED at first order, not proved.
6. Section 6 is a sketch and a restatement of RH.

The lane's verdict (precise obstruction; no route to RH; the missing input is the uniform every-window bound on the prime sum, wall 4 of the map) stands.
