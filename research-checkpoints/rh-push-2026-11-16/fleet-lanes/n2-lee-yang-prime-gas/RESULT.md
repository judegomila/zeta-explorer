# n2-lee-yang-prime-gas: Lee-Yang prime gas as a zero-free approximant to 1/zeta

Status labels: PROVED (in this file), CLASSICAL, MEASURED, OPEN. No statement about zeros of zeta is claimed.

## Verdict

**Precise obstruction; the lane is closed.** The Lee-Yang lemma is correct and is written out below. The last step ("1/Theta_S locally bounded on Re s > 1/2, then Hurwitz") is **false unconditionally, for every coupling matrix and every exhausting sequence of prime sets**, because of the pole of zeta at s = 1 (Theorem 5). For the stated mean-field coupling the failure is quantitative at every point of the strip: Theta_S(s) = (1+o(1)) prod_{p<=x}(1-p^{-s}) on Re s > 1/2 (Theorem 3), so log|Theta_S zeta| = -Re Ei((1-s) log x) + O(1), which is unbounded in both directions (Corollary 4; measured to x = 3e5 for Theta_S and x = 1e8 for the product).

Three structural facts explain why no repair inside the lane can work:

1. The position of the Lee-Yang line is an input. The coefficient e^{c log^2 n / L} puts all zeros on Re s = c for any c >= 0; c = 0 is the plain truncated Euler product. The line carries no information about zeta (Lemma 2(iii); verified numerically for c = 0.3, 0.5, 0.8).
2. A ferromagnetic gas with single-prime coefficient 1 has coefficients mu(n) e^{Q(n)} with Q >= 0: it can only enlarge the coefficients of the truncated Euler product, never damp them (Lemma 2(ii)). The coupling changes Theta_S by a factor governed by sum_p p^{-2 sigma} log p (the l^2 threshold, Re s = 1/2), while the divergence in 1/2 < Re s < 1 is the first-order sum sum_{p<=x} p^{-s} (the l^1 threshold, Re s = 1). This is wall 4 of the map (Q10): the gas is located exactly at the l^2 threshold and does not touch the l^1 term.
3. Zero-free approximants are not the missing ingredient: prod_{p<=x}(1-p^{-s}) is already zero-free for Re s > 0. The whole content of the Hurwitz step is the uniform bound, and that bound is a statement about sum_{p<=x} eps_p p^{-s}: false for zeta (pole), true exactly when the twisted L-function satisfies its own Riemann hypothesis and has no pole or zero at 1 (chi_4 twist and random signs: bounded in the runs).

Pivot (one, as allowed): Gaussian cutoff in log p, which confines the effect of the pole to the triangle |t| < 1 - sigma. Outside the triangle, boundedness of the inverse is equivalent to RH by the classical contour shift; it is a restatement of the target, and it needs no coupling (section 6).

## 1. Plan and what is new against the map

- New relative to F2 (heat cocycle), G10/Q10-Q13 (passive cascade, prime chain), S4 (hard cap), L1 (local temperedness): the multi-affine (Lee-Yang) structure in the site variables z_p = -lambda_p p^{-s}; the general-coupling classification (Lemma 1, 2); the exact Gaussian representation Theta_S(s) = E_g prod_p (1 - p^{-s+g/sqrt L}) (forward heat flow of the truncated Euler product in the real direction, with the line moved from Re s = 0 to Re s = 1/2 by a Cameron-Martin shift); Theorem 3 and Theorem 5.
- Order of work as assigned: first lemma, first test (1), first test (2), controls, then the single pivot.

## 2. First lemma (Lee-Yang, general coupling) — PROVED / CLASSICAL

**Lemma 1 (Lee-Yang; Asano contraction).** Let S be a finite set, |S| >= 2, a_pq = a_qp real in [-1,1] for p != q, and
Z(z) = sum_{A subset S} prod_{p in A} z_p prod_{p in A, q notin A} a_pq.
Then Z(z) != 0 if |z_p| < 1 for all p, and Z(z) != 0 if |z_p| > 1 for all p.

Proof.
(L1.1) Two sites: f(u,v) = 1 + a(u+v) + uv, a in [-1,1]. If a = ±1, f = (1±u)(1±v). If |a| < 1 and f = 0 then u = -(1+av)/(a+v) and |1+av|^2 - |a+v|^2 = (1-a^2)(1-|v|^2) > 0 for |v| < 1, so |u| > 1. Hence f != 0 on the open bidisc.
(L1.2) F = prod over unordered pairs {p,q} of f_pq(u_pq, u_qp), one variable u_pq per ordered pair, is nonzero on the open polydisc.
(L1.3) Asano contraction. If G = A + Bx + Cy + Dxy is nonzero for |x|,|y| < 1 (other variables fixed in their discs), then A + Dz != 0 for |z| < 1: A != 0 (take x = y = 0); if D = 0 done; otherwise A + (B+C)x + Dx^2 has no root in |x| < 1, so the product of its roots has modulus |A/D| >= 1, and the root z = -A/D of A + Dz has |z| >= 1.
(L1.4) For each site p contract the variables u_pq (q != p) one after another into a single variable z_p. A monomial survives iff for every p either all u_pq occur or none; with A the set of p for which all occur, the pair {p,q} contributes 1 (neither in A), u_pq u_qp (both in A), or a_pq u_pq (exactly p in A). The contracted polynomial is Z(z), nonzero on the open polydisc.
(L1.5) Z(z) = (prod_p z_p) Z(1/z) (replace A by its complement; a is symmetric). This gives the region |z_p| > 1. QED

**Remark (signs and phases) — PROVED.** If N is the graph of pairs with a_pq < 0, then prod_{p in A, q notin A} sgn(a_pq) = (-1)^{cut_N(A)} = prod_{p in A} (-1)^{deg_N(p)}, because cut_N(A) = sum_{p in A} deg_N(p) - 2 e_N(A). So couplings in [-1,0) are the couplings |a_pq| together with a completely multiplicative sign twist eps_p = (-1)^{deg_N(p)}. Hermitian phases a_pq = |a_pq| e^{i phi_pq}, phi antisymmetric, likewise reduce to a unimodular twist of the z_p. The class "a_pq in [-1,1]" is therefore the class "a_pq in [0,1], times a completely multiplicative unimodular twist".

**Lemma 2 (prime gas).** Let S be a finite set of real numbers p > 1 (primes or Beurling primes), P = prod S, lambda_p > 0, a_pq = e^{-J_pq} in (0,1], R_p = sum_{q != p} J_pq, and
Theta(s) = Z(z) at z_p = -lambda_p p^{-s}, i.e. Theta(s) = sum_{n | P} mu(n) c(n) n^{-s}, c(n) = prod_{p|n} lambda_p prod_{p|n, q|P/n} a_pq.
(i) Theta(s) != 0 where lambda_p p^{-sigma} < 1 for all p and where lambda_p p^{-sigma} > 1 for all p. If lambda_p = p^c then all zeros lie on Re s = c and Theta(s) = mu(P) P^{c-s} Theta(2c - s) (from L1.5).
(ii) c(n) = prod_{p|n} (lambda_p e^{-R_p}) · exp(Q(n)), Q(n) = 2 sum_{{p,q} subset n} J_pq. The normalisation c(p) = 1 is R_p = log lambda_p; with lambda_p = p^c this is the row-sum condition R_p = c log p. Then c(n) = e^{Q(n)} with 0 <= Q(n) <= c log n: every coefficient has modulus >= 1 and <= n^c.
(iii) The assigned example is J_pq = log p log q/(2L), lambda_p = p^{1/2}, c(n) = e^{log^2 n/(2L)}. Replacing 1/2 by any c > 0, c(n) = e^{c log^2 n / L} gives zeros on Re s = c and the same coefficientwise limit mu(n). c = 0 is prod_{p in S}(1 - p^{-s}) with zeros on Re s = 0.
(iv) Relaxation: if lambda_p <= p^{1/2} only (row sums c_p log p with c_p <= 1/2, or extra weights w_p in (0,1]), Theta is still zero-free for Re s > 1/2; the zeros lie in min c_p <= Re s <= max c_p.
(v) If J_pq -> 0 for each fixed pair along a sequence of sets exhausting the primes, then Theta_S -> 1/zeta locally uniformly on Re s > 3/2 (dominated convergence with |c(n)| <= n^{1/2}); for the mean-field example on Re s > 1.
Proof: (i) is Lemma 1 with |z_p| = lambda_p p^{-sigma}; (ii) from sum_{p in A, q notin A} J_pq = sum_{p in A} R_p - 2 sum_{pairs in A} J_pq; the rest is direct. QED

**Which hypothesis each control violates.**

| control | hypothesis of Lemma 1/2 | outcome |
|---|---|---|
| backward heat (coefficient e^{t log^2 n}, t < 0) | a_pq = e^{2|t| log p log q} > 1: step L1.1 fails (the Moebius map sends the disc into the disc) | zeros leave the line. MEASURED k = 8: 100 zeros in the box, 32 within 0.02 of the formal line |
| Davenport-Heilbronn | not a multi-affine polynomial in independent site variables z_p: it is a linear combination of two Euler products; the Lee-Yang property is not preserved under sums (no product sites) | not formulable as one gas |
| E_a = zeta(s+a) zeta(s-a) | two sites per prime with fields p^{-a}, p^{+a}; "all |z| < 1" holds only for sigma > 1/2 + a, "all |z| > 1" only for sigma < 1/2 - a | strip of width 2a. MEASURED k = 7, mean-field coupling over the 14 sites: a = 0.2: all 124 zeros within 0.02 of the line (the forward heat flow contracts them, de Bruijn); a = 0.45 and a = 0.8: 0 of 124 within 0.02 of the line |
| completely multiplicative sign twist | none (|z_p| unchanged) | passes; MEASURED 101/101 zeros on the line |
| Beurling prime systems | none (any reals p > 1) | passes; MEASURED 102/102 on the line |
| c-family (line at Re s = c) | none | passes for every c; MEASURED c = 0.3: 101/101, c = 0.8: 102/102 |

(selftest.py, selftest2.py; zero counts by argument change on rectangles, 0.37 < t < 40 resp. 30. The two E_a rows printed by selftest.py use a wrong site weight and are superseded by selftest2.py.)

## 3. First test (1): the mean-field gas against 1/zeta

Statistic: D(S) = sup |log|Theta_S(s) zeta(s)|| over sigma in {0.6, 0.7, 0.8, 0.9}, t in [0,60] (step 0.2 for exact sums, step 1 for the Gaussian evaluation). Convergence Theta_S -> 1/zeta would be D -> 0; local boundedness of log|Theta_S| would be D = O(1).

Exact sums over all 2^k divisors (t1.py; largest allocation printed: k = 22, 4 194 304 terms, exp chunk 537 MB):

| k | p_max | L | sup abs(log abs(Theta)) | D | D, t > 10 | sup abs(log(Theta/Euler_S)) |
|---|---|---|---|---|---|---|
| 4 | 7 | 5.35 | 2.261 | 1.792 | 1.268 | 1.102 |
| 8 | 19 | 16.09 | 2.911 | 2.266 | 1.286 | 0.787 |
| 12 | 37 | 29.64 | 3.511 | 2.842 | 0.809 | 0.812 |
| 16 | 53 | 44.93 | 3.937 | 3.268 | 0.680 | 0.798 |
| 20 | 71 | 61.59 | 4.280 | 3.611 | 0.699 | 0.698 |
| 22 | 79 | 70.25 | 4.433 | 3.764 | 0.580 | 0.628 |

(all k = 4..22 in t1.log; D is attained at s = 0.6 for k >= 9.) Log-log slope of D against L: 0.291 (k = 4..22), 0.322 (k = 12..22).

Gaussian evaluation (t1b.py). Identity (PROVED, Hubbard-Stratonovich): e^{log^2 n/(2L)} = E[n^{g/sqrt L}], g standard normal, hence
Theta_S(s) = E_g prod_{p in S} (1 - p^{-s + g/sqrt L}).
Checked against the exact 2^22 sum: max difference of log|Theta| 1.4e-13 on 244 points; cancellation factor of the quadrature <= 1.17.

| x | k | L | D | D at sigma = 0.6 / 0.7 / 0.8 / 0.9 (t = 0) | Ei((1-sigma) log x), sigma = 0.6 / 0.7 / 0.9 | sup abs(log(Theta/Euler)) |
|---|---|---|---|---|---|---|
| 79 | 22 | 70 | 3.764 | 3.764 / 2.597 / 1.481 / 0.387 | 4.076 / 2.752 / 0.239 | 0.617 |
| 1e3 | 168 | 956 | 8.060 | 8.060 / 5.083 / 2.904 / 1.022 | 8.465 / 5.226 / 1.038 | 0.552 |
| 1e4 | 1229 | 9896 | 15.481 | 15.481 / 8.396 / 4.377 / 1.677 | 15.788 / 8.465 / 1.680 | 0.420 |
| 1e5 | 9592 | 99685 | 29.914 | 29.914 / 13.467 / 6.162 / 2.307 | 30.126 / 13.496 / 2.308 | 0.291 |
| 3e5 | 25997 | 299047 | 41.344 | 41.344 / 16.878 / 7.180 / 2.612 | 41.534 / 16.901 / 2.612 | 0.239 |

Growth fit: D = Ei(0.4 log x) + O(1) with remainder -0.31, -0.41, -0.31, -0.21, -0.19; in terms of L (= theta(x) ~ x): D ~ L^{0.4}/(0.4 log L), measured log-log slope 0.285 (all rows), 0.288 (last four), which is the local exponent of Ei at these sizes. **Unbounded.**

Away from the real axis (t5.py; truncated Euler product, which Theorem 3 identifies with Theta_S up to 1+o(1)), sigma = 0.6, 20 <= t <= 60:

| x | sup abs(log abs(E_x zeta)) | x^{0.4}/(abs(1-s) log x) at t = 20 |
|---|---|---|
| 1e5 | 0.443 | 0.434 |
| 1e6 | 0.911 | 0.909 |
| 1e7 | 1.838 | 1.957 |
| 1e8 | 4.195 | 4.300 |

(The column "pred_amp" in t5.json uses abs(Ei) of a complex argument, which contains a constant pi from the branch; the table uses the leading term instead.) The growth is the same pole term at every height; it is not confined to the real axis.

**Theorem 3 (mean-field gas = truncated Euler product on Re s > 1/2) — PROVED (inputs: Chebyshev bounds).** Let S = {p <= x}, |eps_p| <= 1, Theta^eps_S(s) = sum_{n|P} mu(n) eps(n) e^{log^2 n/(2L)} n^{-s}, E^eps_S(s) = prod_{p<=x}(1 - eps_p p^{-s}). For every compact K in Re s > 1/2, Theta^eps_S/E^eps_S -> 1 uniformly on K as x -> infinity.
Proof. Theta(s) = E_g E_S(s - u), u = g/sqrt L. Let sigma_0 = min Re K, delta = (sigma_0 - 1/2)/2, phi = log E_S.
(3.1) |u| <= delta: |phi(s-u) - phi(s)| <= |u| sup |phi'| <= |u| C sum_{p<=x} p^{-(sigma_0-delta)} log p <= C |u| x^{max(1-sigma_0+delta, 0)} log x. With L >= x/2, |u| <= sqrt 2 |g| x^{-1/2}, so the difference is <= |g| eta_x with eta_x = C' x^{-delta} log x -> 0, and E[|e^{phi(s-u)-phi(s)} - 1|; |u| <= delta] <= E[|g| eta_x e^{|g| eta_x}] -> 0.
(3.2) |u| > delta: 1/|E_S(s)| <= exp(C x^{1-sigma_0} + C) = e^{o(L)}; |E_S(s-u)| <= 2^{pi(x)} e^{L (u - sigma)_+} with pi(x) = o(L). For u <= sigma the Gaussian weight is <= e^{-delta^2 L/2}; for u > sigma the exponent is L(u - sigma - u^2/2) + o(L) <= L(1/2 - sigma_0) + o(L). Both contributions tend to 0. QED
The proof uses only theta(x) ~ x-type bounds, so it holds for every twist and for Beurling systems with theta_B(x) of order x. Measured ratio: 0.617 -> 0.239 for zeta (x = 79 .. 3e5, dominated by sigma = 0.6 where the rate is x^{-0.1}); 0.16 -> 1.3e-4 for the chi_4 twist.

**Corollary 4 — PROVED (CLASSICAL input: prime number theorem with de la Vallee-Poussin error).** For eps = 1 and K compact in 1/2 < Re s < 1: sum_{p<=x} p^{-s} = Ei((1-s) log x) + C(s) + O(|s| x^{1-sigma} e^{-c sqrt(log x)}), hence log|Theta_S(s) zeta(s)| = -Re Ei((1-s) log x) + O_K(1) + o(x^{1-sigma}/log x). On every K containing a real point, or two points with different t, sup_K |log|Theta_S|| >= c x^{1-sigma}/log x for all large x; both sup|Theta_S| and sup 1/|Theta_S| tend to infinity on K if K has interior.

## 4. First test (2): non-rank-one couplings

Setting: J = D M D (symmetric scaling of a pattern M, zero diagonal) with exact row sums (1/2) log p (residual <= 2e-12); coefficients mu(n) e^{Q(n)}. All rank-one patterns M give the same J, so "smooth cutoff in p" must be non-rank-one or act on the row sums. Statistic D as above with t step 0.5 (t2.py families):

| family | k=6 | 8 | 10 | 12 | 14 | 16 | 18 | D on sigma = 1.2, k=18 | max J, k=18 |
|---|---|---|---|---|---|---|---|---|---|
| bare Euler product (J = 0, line at 0) | 2.502 | 2.891 | 3.198 | 3.456 | 3.681 | 3.882 | 4.062 | | |
| mean-field (M = 1) | 1.763 | 1.986 | 2.341 | 2.624 | 2.862 | 3.071 | 3.257 | 0.328 | 0.174 |
| band in log p, width 0.5 | 1.501 | 1.555 | 1.755 | 1.997 | 2.198 | 2.375 | 2.530 | 0.511 | 0.440 |
| band in log p, width 1.5 | 1.715 | 1.903 | 2.229 | 2.485 | 2.698 | 2.884 | 3.048 | 0.373 | 0.227 |
| index distance 1/(1+abs(i-j))^2 | 1.571 | 1.705 | 2.015 | 2.257 | 2.459 | 2.635 | 2.792 | 0.429 | 0.913 |
| top-soft (weight 1 if a prime in the top third, else 0.05) | 1.794 | 2.023 | 2.414 | 2.728 | 2.924 | 3.151 | 3.351 | 0.317 | 0.230 |
| bipartite-soft small/large | 1.838 | 2.110 | 2.476 | 2.773 | 3.017 | 3.234 | 3.426 | 0.307 | 0.191 |
| max(p,q)^{-1} | 1.706 | 1.901 | 2.240 | 2.508 | 2.733 | 2.931 | 3.107 | 0.359 | 0.253 |
| min(p,q)^{-1} | 1.799 | 2.047 | 2.408 | 2.698 | 2.942 | 3.154 | 3.344 | 0.315 | 0.150 |
| smooth cutoff of row sums, c_p = (1/2)(1 - log p/log 2p_max), M = 1 | 1.842 | 2.229 | 2.536 | 2.801 | 3.034 | 3.243 | 3.430 | 0.332 | 0.047 |

Every family grows, with the same increment per step as the bare Euler product (k = 16 -> 18: 0.16 to 0.20 for all rows; Euler 0.18). The families differ by an offset of at most 1.5 that does not grow. The exactly bipartite and exactly top-coupled patterns have no admissible scaling (the row-sum constraints are infeasible), so soft versions were used. MEASURED.

Free search (t2.py opt; all k(k-1)/2 entries free, row sums exact, L-BFGS on a p = 24 norm surrogate, four starts, 60 iterations):

| k | parameters | best D | D at the mean-field start | D on sigma = 1.2 at the optimum (mean-field: 0.58, 0.50, 0.44) | max J at the optimum |
|---|---|---|---|---|---|
| 6 | 15 | 1.409 | 1.763 | 0.687 | 0.92 |
| 8 | 28 | 1.424 | 1.986 | 0.561 | 0.58 |
| 10 | 45 | 1.296 | 2.341 | 0.657 | 0.78 |

The optimiser lowers D to about 1.3-1.45 at these sizes by concentrating coupling on a few pairs (max J 0.6 to 0.9, against 0.29 to 0.43 for mean-field at the same k), which worsens the fit on sigma = 1.2, where convergence is required. These sizes do not decide the limit; Theorem 5 does. **No family stays bounded as S grows**, and none can.

Why the coupling cannot help (first order, PROVED; all orders OPEN): with w_p = -p^{-s}/(1-p^{-s}), the first cluster term of log(Theta_S/E_S) is sum over pairs of (e^{2J_pq} - 1) w_p w_q, and sum_{pairs} 2 J_pq |w_p w_q| <= sum_p R_p |w_p|^2 = (1/2) sum_p |w_p|^2 log p, which converges for sigma > 1/2 uniformly in S and in the coupling. The coupling acts at the l^2 level; the divergent term sum_{p<=x} p^{-s} is at the l^1 level.

**Theorem 5 (pole obstruction; any coupling, any exhaustion) — PROVED.** Let H = {Re s > 1/2} and let F_j be analytic and zero-free on H with F_j -> 1/zeta locally uniformly on a nonempty open set W in {Re s > 1} (Lemma 2(v): W = {Re s > 3/2} for every gas with J -> 0 pairwise, W = {Re s > 1} for the mean-field gas).
(a) If gamma is a Jordan curve in H whose interior contains 1 and meets W (for W = {Re s > 1}: any Jordan curve in H around 1), then sup_gamma 1/|F_j| -> infinity.
(b) For the same gamma, sup_gamma |F_j| -> infinity.
(c) If the F_j are real and positive on the real axis (true for every gas with real couplings and no twist, since Theta_S(sigma) is real, nonzero for sigma > 1/2 and tends to 1), then |F_j| is unbounded on every connected open U in H that meets both W and the real segment (1/2, 1).
Proof. (a) Suppose 1/|F_j| <= M on gamma along a subsequence. 1/F_j is analytic inside gamma, so 1/|F_j| <= M inside; by Montel a further subsequence converges inside to an analytic G, and G = zeta on the part of the interior where F_j -> 1/zeta, hence everywhere inside off s = 1. But zeta is unbounded near 1. (b) Suppose |F_j| <= M on gamma; then inside as well, a subsequence converges to an analytic F with F = 1/zeta, so F(1) = 0 and F is not identically 0; by Hurwitz F_j has a zero near 1 for large j, contradicting zero-freeness. (c) If |F_j| <= M on U, a subsequence converges on U to F = 1/zeta; at a real point sigma_0 of U in (1/2,1), F(sigma_0) = lim F_j(sigma_0) >= 0, but 1/zeta(sigma_0) < 0. QED
Only the pole of zeta at 1 is used. For a twist whose L-function is analytic and nonzero at 1 the theorem gives no obstruction.

## 5. Controls

Same statistic, Gaussian evaluation (t1b.py, t3.py). Targets: chi_4 twist (eps_2 = +1, eps_p = chi_4(p)): Theta -> (1-2^{-s})/L(s,chi_4); Liouville twist (eps_p = -1): Theta -> zeta(s)/zeta(2s).

| x | zeta: D | Liouville twist: D | chi_4 twist: D | chi_4: per sigma 0.6/0.7/0.8/0.9 | random signs: sup abs(log abs(Theta)) | Beurling p_j(1+0.1 sin j): sup abs(log abs(Theta)) | Beurling b_j = 1.5 + j^{1.2} |
|---|---|---|---|---|---|---|---|
| 79 | 3.764 | 5.837 | 0.637 | 0.637/0.326/0.196/0.118 | | | |
| 1e3 | 8.060 | 9.472 | 0.384 | 0.384/0.125/0.056/0.027 | 3.159 | 8.630 | 11.086 |
| 1e4 | 15.481 | 16.440 | 0.247 | 0.247/0.061/0.020/0.007 | 2.044 | 16.067 | 22.500 |
| 1e5 | 29.914 | 30.544 | 0.171 | 0.171/0.035/0.009/0.003 | 3.071 | 30.535 | 43.175 |
| 3e5 | 41.344 | 41.855 | 0.156 | 0.156/0.028/0.006/0.001 | | | |

c-family, exact sums, D at k = 8, 12, 16, 20: c = 0: 2.891, 3.456, 3.882, 4.226; c = 0.1: 2.724, 3.289, 3.716, 4.063; c = 0.3: 2.485, 3.039, 3.462, 3.807; c = 0.5: 2.242, 2.842, 3.268, 3.611. Same growth for every position of the line.

Reading:
- The Lee-Yang step (zeros on a line, functional equation, zero-free approximant) is identical for zeta, every completely multiplicative sign twist, every Beurling system and every c. It is twist-blind and Beurling-blind, and it is not needed: J = 0 already gives zero-free approximants.
- The boundedness step is not twist-blind, but in the wrong direction: it **fails for zeta and for the Liouville twist** (pole or zero of the target at s = 1) and for Beurling systems with a pole, and it **holds in the runs for the chi_4 twist** (D decreasing 0.64 -> 0.16) and stays O(1) for random signs (2.0 to 3.2; sum eps_p p^{-s} converges almost surely for sigma > 1/2).
- For a twist with no pole or zero at 1, Theorem 3 gives: log|Theta^eps_S| bounded on compacts of Re s > 1/2 iff Re sum_{p<=x} eps_p p^{-s} is bounded there uniformly in x. For Dirichlet characters this is the convergence of the Euler product in Re s > 1/2, which is equivalent to GRH for that character (CLASSICAL). The statement is TARGET-type: true exactly when the conclusion is true, with no independent handle.
- Relation to S4: boundedness is a largest-value (sup-norm, every point) bound on a prime sum, not a mean square, so it is of the kind required by filter (c) of the map. It is not the lemma L3 of S4: L3 is one-sided, at length about t, with cap (1/2) log(t/2 pi) + C; here the bound is two-sided O(1) at fixed height with length x -> infinity, i.e. the error term of the (twisted) prime number theorem at power-saving level 1/2 (the second ingredient named in Q13). For zeta itself it is false before any such question arises.
- Place on the map: wall 4 (Q10: l^1 on Re s > 1, l^2 on Re s > 1/2), with the additional unconditional failure at the pole. Multiplicativity enters (product sites), but it acts through |z_p| only, which every twist and every Beurling system shares.

## 6. Pivot (one): Gaussian cutoff in log p

The pole term can be confined. Take weights w_p = exp(-log^2 p/(2 Lam)) and E_Lam(s) = prod_p (1 - w_p p^{-s}); by Lemma 2(iv) any ferromagnetic coupling may be added without losing zero-freeness on Re s > 1/2, but E_Lam is already zero-free on Re s >= 0, so none is needed. Then log E_Lam(s) = -sum_p w_p p^{-s} + (terms analytic on Re s > 1/2), and by the Mellin-Gauss contour shift (sketch, CLASSICAL type) the pole of zeta contributes a term of modulus about sqrt(2 pi Lam) exp(((1-sigma)^2 - t^2) Lam/2)/(|1-s| Lam): it grows inside the triangle T = {|t| < 1 - sigma} and decays outside. A zero rho = beta + i gamma with beta > sigma contributes the same shape in the cone |t - gamma| < beta - sigma. Hence: 1/E_Lam is locally bounded on {Re s > 1/2} minus the closed triangle T as Lam -> infinity iff RH. The domain is connected, so Hurwitz applies there, and Theorem 5(a) is respected because every curve around 1 crosses T.

MEASURED (t4.py, primes <= 1e7, weights below 8e-15 at the cutoff, Lam <= 4; points sigma in {0.6, 0.75, 0.9}, t in {0, 0.2, 0.5, 1, 2, 5, 10, ..., 60}):

| Lam | zeta: sup abs(log abs(E zeta)) inside T | zeta: outside T, t >= 1 | chi_4 twist: inside T | chi_4 twist: t >= 1 |
|---|---|---|---|---|
| 1 | 1.363 | 0.631 | 0.172 | 0.585 |
| 2 | 1.241 | 0.494 | 0.066 | 0.441 |
| 3 | 1.721 | 0.371 | 0.022 | 0.342 |
| 4 | 2.129 | 0.307 | 0.010 | 0.271 |

Consistent with the prediction within the small range of Lam that is reachable (the cutoff needs primes up to exp(sqrt(60 Lam))). This is a restatement of the target (smoothed prime sums against log zeta), identical for every twist, with RH replaced by the twist's own hypothesis. It gives no handle and the Lee-Yang structure plays no role in it. The lane stops here.

## 7. Answers to the assignment's questions

- Lemma: correct; proof in section 2, general coupling included; negative couplings are sign twists.
- sup of |log|Theta_S|| for k = 4..22: grows from 2.26 to 4.43; against 1/zeta, D grows from 1.79 to 3.76, and to 41.3 at x = 3e5; D = Ei(0.4 log x) + O(1), i.e. order L^{0.4}/log L.
- Non-rank-one couplings: nine families all grow at the rate of the bare Euler product; free optimisation at k <= 10 reaches 1.3 to 1.45 only by leaving the regime J -> 0; Theorem 5 excludes a bounded family.
- Controls: the Lee-Yang step is twist-blind and Beurling-blind; boundedness fails for zeta and holds for pole-free twists exactly under their own GRH.
- S4: boundedness is a largest-value bound on a prime sum (PNT error-term type, Q13's second ingredient), not S4's lemma L3.

## 8. Three weakest steps

1. General couplings away from the real axis. Theorem 5 forces blow-up on every curve around 1 and on every neighbourhood of a real point of (1/2,1), for every coupling. That Theta_S is the truncated Euler product times a bounded factor for every admissible coupling (hence unbounded at every height) is PROVED only for the mean-field coupling (Theorem 3); for other couplings it rests on the first-order pair bound and on nine families at k <= 18. A coupling that confines the blow-up to a neighbourhood of the real segment is not excluded by proof; by section 6 such a confinement would still leave a statement equivalent to RH.
2. Section 6. The triangle statement and the equivalence with RH are a contour-shift sketch, not a written proof (uniformity in Lam of the sum over zeros is not checked), and the numerics reach only Lam <= 4.
3. Search and controls are finite. The free search uses a smooth surrogate, a local optimiser, four starts and k <= 10. "Bounded for the chi_4 twist" is measured to x = 3e5 only; its equivalence with GRH(chi_4) is quoted as classical, not reproved. Constants in Theorem 3 are not tracked, and the rate at sigma = 0.6 is slow (x^{-0.1}).

## 9. Files and compute

All runs local, single process, through scripts/memcap.sh 8 with .venv-arb/bin/python; no ssh. Longest run 129 s (t1.py); largest allocation about 600 MB.
lib.py (subset sums, pair form, row scaling, winding counts); selftest.py, selftest2.py (Lemma checks); t1.py/.log/.json (exact sums k = 4..22); t1b.py/.log/.json (Gaussian evaluation to x = 3e5, three targets); t2.py, t2_families.log/.json, t2_opt_k{6,8,10}.log/.json (couplings); t3.py/.log/.json (c-family, Beurling, random signs); t4.py/.log/.json (pivot); t5.py/.log/.json (Euler product to 1e8 away from the real axis).
One error was made and corrected during the work: the first pass of t1/t1b/t2 added log|1/zeta| instead of log|zeta| to log|Theta|; lib.py was fixed and all affected runs were repeated. All numbers above are from the corrected runs.
