# Li coefficients: positivity range from verified height + zero-free half-plane, and where the Euler product enters

Working note, 2026-11-16. Slug: li-coefficients. Scope: this directory only. No RH claim, no new zero-free region.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (mpmath, not interval-certified), ARGUED, OPEN.

## Verdict

Partial result plus a precise obstruction.

* PROVED (Theorem A): an exact decomposition of lambda_n over zero classes, an unconditional positive mass
  Q_n >= 0.146 n log n that does not depend on where the zeros are, and an explicit positivity range
  lambda_n >= 0 for all n <= n*(H, theta). With H = 3.0001753328e12 (Platt-Trudgian) the evaluated bound is
  n* = 6.86e26 with theta = 1 and n* = 9.22e26 with theta = 7/8. The commonly quoted range is n <= H^2 = 9.0e24.
* The half-plane enters only through c = 2 theta - 1. Its gain is the constant factor 1/(2 theta - 1) = 4/3. The
  expectation in the task text ("far larger than classical") is false. The range is n ~ (2/c) H^2 log H to leading order,
  and Theorem B shows no argument using only (H, theta, zero counting) can pass (4/c) H^2 log H (1 + o(1)).
* Structural lemmas (C, D): a Toeplitz form of Li's criterion with an exact indefinite rank-one defect per off-line
  quadruple; and the arithmetic part at any base a > 1 as an alternating binomial transform of a Stieltjes moment
  sequence. Lambda(n) >= 0 gives Hankel positivity of the moments, and the alternation removes it. No induction or
  generating-function positivity was found; section 5 says why.

## 0. Plan and relation to the atlas and walls

The atlas (PR 27, historical-routes.md) has no Li-coefficient section (grep: none). The nearest items are section 8
(Hankel/Schur), the eq48 note (all finite positive tests are one Weil functional) and euler/RESULT.md (finite Pick orders
are DH-blind). New here: the same verified-height wall written in the index n of Li's criterion, with an explicit range
and a sharpness statement, and the exact place where the half-plane enters. Walls respected: Theorem A is a
verified-height statement (it restates H and theta and gives no zero information); it holds verbatim for DH with DH's
own H and theta (section 6).

## 1. Setup (CLASSICAL)

lambda_n = sum_rho [1 - (1 - 1/rho)^n], conjugate-paired sum (Bombieri-Lagarias). RH iff lambda_n >= 0 for all n >= 1
(Li). Write rho = beta + i gamma and z_rho = 1 - 1/rho = (rho - 1)/rho.

**(1.1) PROVED.** For gamma > 0: z_rho = r e^{i phi} with
r^2 = ((1-beta)^2 + gamma^2)/(beta^2 + gamma^2), phi = arctan((1-beta)/gamma) + arctan(beta/gamma), so
1/gamma - 1/(3 gamma^3) <= phi <= 1/gamma. The functional-equation mirror 1 - conj(rho) has z = 1/conj(z_rho), i.e.
modulus 1/r and the same phase phi.

**(1.2) Exact class contributions. PROVED.**
* On-line pair {1/2 +- i gamma}: 2 (1 - cos n phi).
* Off-line quadruple {rho, conj rho, 1 - rho, 1 - conj rho}, beta > 1/2:
  4 (1 - cos n phi) - 2 (r^n + r^{-n} - 2) cos n phi  >=  4 (1 - cos n phi) - 8 sinh^2( (n/2) log(1/r) ).
* log(1/r) = (1/2) log(1 + (2 beta - 1)/((1-beta)^2 + gamma^2)) <= (2 beta - 1)/(2 gamma^2).

So every zero with gamma > 0, on or off the line, carries the same nonnegative term 2 (1 - cos n phi_rho), and the only
negative term is second order in (2 beta - 1) n / gamma^2:

  lambda_n >= Q_n - E_n,
  Q_n = sum_{gamma > 0} 2 (1 - cos n phi_rho),
  E_n = sum_{gamma > H, beta != 1/2} 4 sinh^2( n (2 beta - 1) / (4 gamma^2) )   (each zero with gamma > 0 counted once).

Numerical check of (1.2) on three sample quadruples: agreement to 12 digits (check.py). MEASURED.

## 2. Theorem A (explicit range)

Inputs. (i) N(T) = F(T) + R(T), F(T) = (T/2pi) log(T/2pi e) + 7/8, |R(T)| <= R*(T) = 0.137 log T + 0.443 log log T + 1.588
for T >= 2 (Rosser 1941, CLASSICAL). (ii) All zeros with 0 < gamma <= H are on the line (verified height). (iii) No
zeros with beta > theta; c = 2 theta - 1.

**Step 1 (positive mass, location-free). PROVED.** Keep only zeros with gamma >= n, n >= 100. Then n phi <= 1 and
2(1 - cos x) >= x^2 (1 - x^2/12), so each such zero gives at least 0.9166 n^2/gamma^2. Stieltjes integration against N:

  Q_n >= 0.9166 [ n (log(n/2pi) + 1)/(2 pi) - 2.05 R*(n) ]  =: Q_low(n)        (>= 0.146 n log n for large n).

This uses zero counting only. It does not use (ii) or (iii): the zeros that supply the mass sit at height >= n, far above
H. (Under RH the true size is (n/2) log n; the lost constant only moves n* through a logarithm.)

**Step 2 (negative part). PROVED.** With g(t) = 4 sinh^2(n c/(4 t^2)) decreasing, and all zeros above H allowed to be
off-line at beta = theta,

  E_n <= int_H^inf g(t) [ log(t/2pi)/(2pi) + R*'(t) ] dt + 2 g(H) R*(H)  =: E_up(n).

**Step 3 (all n in the range). PROVED.** E_up(n)/n^2 is increasing in n (sinh(x)/x increasing). Q_low(n)/n^2 is
decreasing for n >= 100. So E_up(n*) < Q_low(n*) implies lambda_n > 0 for 100 <= n <= n*. For n < 100 positivity is
CLASSICAL (direct computation; Keiper, Maslanka).

**Theorem A.** lambda_n > 0 for all n <= n*(H, theta), where n* is the largest n with E_up(n) <= Q_low(n).
Asymptotically n* = (2 H^2/c) (log H + O(log log H)).

Evaluation (range2.py, mpmath 25 digits, bisection; MEASURED evaluation of a PROVED inequality):

| input | c | L* = n* c/(2H^2) | n* | n*/(H^2 log H) |
|---|---|---|---|---|
| theta = 1 (strip only) | 1 | 38.085 | 6.856e26 | 2.651 |
| theta = 7/8 | 0.75 | 38.394 | 9.216e26 | 3.564 |
| theta = 0.874887 (unrefereed follow-ups) | 0.749774 | 38.394 | 9.218e26 | 3.565 |

Reference: the range usually quoted from verified height alone is n <= H^2 = 9.0e24 (Bombieri-Lagarias / Oesterle;
quoted from memory, not re-derived). The factor of about 76 between 9.0e24 and 6.86e26 comes from the log H term and the
second-order form (1.2), not from the half-plane. The half-plane contributes the factor 1.344.

## 3. Theorem B (sharpness; the half-plane cannot give more than a constant)

Let C(H, theta) be the class of zero sets that are conjugate- and FE-symmetric, satisfy the counting bound (i), lie on
the line up to H and in beta <= theta. Theorem A holds on the whole class, since its proof uses nothing else.

**Theorem B.** PROVED given RH for zeta; if RH fails for zeta the question is moot, because then lambda_n < 0 for some
n by Li. Replace two neighbouring on-line pairs of zeta just above H by one quadruple theta +- i gamma_0,
1 - theta +- i gamma_0. The new set is in C(H, theta) (R changes by at most 2). Its coefficients are

  lambda~_n = lambda_n - [two on-line terms in [0, 8]] + 4 - 2 (r^n + r^{-n}) cos n phi_0.

Since phi_0 ~ 1/gamma_0, cos n phi_0 >= 1/2 on a set of n of positive density in every window of length 2 pi gamma_0,
while r^{-n} changes by a factor 1 + O(1/gamma_0) across such a window. Under RH lambda_n = (n/2) log n + O(n). So
lambda~_n < 0 for some n <= n_1 = (2 gamma_0^2/c) log(n log n) (1 + o(1)) = (4/c) H^2 log H (1 + o(1)).
Evaluated: n_1 = 1.17e27 (theta = 1), 1.57e27 (theta = 7/8). MEASURED.

A dense twin (all zeros in [H, H(1 + 1/L)] moved off-line with phases aligned for one n; the alignment grid
2 pi gamma^2/n ~ 0.08 is finer than the mean zero gap 0.23, so the counting bound allows it) reaches the constant 2/c of
Theorem A. ARGUED, not written out.

Consequence: within the information (H, theta, zero counting) the positivity range is Theta(H^2 log H / (2 theta - 1)).
Lowering theta from 1 to 7/8 gives 4/3. Any theta > 1/2 gives a finite range. Density estimates (N(sigma, T) <<
T^{A(1 - sigma)}, non-explicit) only change the constant: the binding abscissa is sigma = theta because
(2 - A(1 - sigma))/(2 sigma - 1) is decreasing in sigma for A < 4. ARGUED.

## 4. Lemma C (Toeplitz form of Li's criterion)

Set lambda_0 = 0 and lambda_{-m} = lambda_m (functional equation). For real c_1..c_N and P(z) = sum c_j (1 - z^j):

  T_N(c) := sum_{j,k} c_j c_k (lambda_j + lambda_k - lambda_{j-k}) = sum_rho P(z_rho) P(1/z_rho).   PROVED.

* On-line pair: 2 |P(e^{i phi})|^2 >= 0.
* Off-line quadruple: 2|P(z)|^2 + 2|P(1/conj z)|^2 - 2 |D(z)|^2, D(z) = sum c_j e^{i j phi}(r^{-j} - r^{j}).

So RH iff T_N is positive semidefinite for all N (necessity from the display; sufficiency because the diagonal is
2 lambda_j). T_N is the Weil functional on the span of the Li test functions, hence the same target as the eq48
equivalence. Novelty against the literature not checked; treat as a restatement. The defect -2|D|^2 has the same
exponential size e^{n c/gamma^2} as in (1.2), so the range of N in which T_N >= 0 follows from (H, theta) is the same
order as n*. No extension of range is gained from the matrix form. ARGUED for the matrix range; not computed.

## 5. Lemma D (where Lambda(n) >= 0 enters, and why it gives no sign)

Use base a > 1 and z = (s - a)/(s + a - 1), which maps Re s = 1/2 to |z| = 1 and s = a to 0 (a = 1 is Li's map).
lambda_n(a) := n [z^n] log xi(s(z)) = sum_rho [1 - z_a(rho)^{-n}]; positivity for all n is again equivalent to RH
(CLASSICAL, generalized Li). Since s = a + (2a - 1) z/(1 - z) and exp(-u z/(1 - z)) = sum L_n^{(-1)}(u) z^n:

  lambda_n^{arith}(a) = -(2a - 1) sum_m Lambda(m) m^{-a} L_{n-1}^{(1)}((2a - 1) log m)                       PROVED
                      = - sum_{k=0}^{n-1} (-1)^k C(n, k+1) (2a - 1)^{k+1} M_k(a)/k!,   M_k(a) = sum_m Lambda(m) m^{-a} (log m)^k,

absolutely convergent for a > 1 (no regularization, unlike the Bombieri-Lagarias a = 1 form). Checked numerically for
a = 3, n = 1..4 against Taylor coefficients of log zeta(s(z)) (check.py; agreement to the truncation error). MEASURED.

* **Euler-product statement.** Lambda >= 0 iff (M_k(a))_k is a Stieltjes moment sequence for one (every) a > 1, i.e.
  both Hankel matrices [M_{j+k}] and [M_{j+k+1}] are positive semidefinite (Bernstein; CLASSICAL). This is true for zeta
  and false for DH at a finite Hankel order.
* **Why it does not reach Li.** lambda_n^{arith}(a) is the alternating binomial transform of M_k. By the Laguerre
  asymptotics L_{n-1}^{(1)}(u) ~ pi^{-1/2} e^{u/2} u^{-3/4} n^{1/4} cos(2 sqrt(n u) - 3 pi/4) for u << 4n,

    lambda_n^{arith}(a) ~ -C n^{1/4} sum_{log m << 4n/(2a-1)} Lambda(m) m^{-1/2} (log m)^{-3/4} cos(2 sqrt(n (2a-1) log m) - 3pi/4).

  The weight is m^{-1/2} times an oscillation, on all m up to exp(4n/(2a - 1)). Li positivity at index n is therefore a
  one-sided bound for a signed prime sum at the square-root scale, at every scale up to exp(4n/(2a-1)). That is item (1)
  of the atlas closing line (all-scale signed arithmetic estimate) and round-2 Theorem H5. Lambda >= 0 bounds the sum
  only by sum Lambda(m) m^{-1/2}, which is exponentially larger than the archimedean term (n/2) log n. ARGUED
  (asymptotic step not made uniform).
* The local frequency of the phase in log m is t = sqrt(n (2a-1)/log m). A zero at height gamma is seen at
  log m = n (2a-1)/gamma^2, where m^{beta - 1/2} = exp(n (2a-1)(2 beta-1)/(2 gamma^2)). This is the factor r^{-n} of (1.2).
  The prime side and the zero side give the same threshold. PROVED at the level of the identity, ARGUED for the
  stationary-phase reading.
* **Induction / moment structure.** Under RH, lambda_n = int (1 - cos n phi) d mu(phi) with mu = sum of point masses at
  phi_rho, a trigonometric (Levy-Khinchine type) moment structure; Lemma C is its finite form. It is equivalent to RH
  at all orders and Euler-blind at each finite order in the same way as the Pick ladder (euler/RESULT.md). The Hankel
  structure that Lambda >= 0 does give lives in the variable log m at base a > 1; the map to Li's coordinate is the
  alternating transform above, and no positivity-preserving map between the two was found. OPEN, with no lead.

## 6. DH control

* Theorem A's proof uses: the Hadamard sum, the functional equation (mirror zero has modulus 1/r, same phase), a counting
  bound, H and theta. None of these is the Euler product. For DH (conductor 5) with H_DH < 85.699 and
  theta_DH >= 0.808517 the same theorem gives positivity of the DH Li coefficients up to an index of order
  (2/c) gamma^2 log, and the first off-line quadruple 0.808517 +- 85.699348 i makes them negative near n ~ 3.3e5
  (estimate from (1.2) with main term (n/2) log(5n/2pi); ARGUED, DH coefficients not computed).
* So the only Euler-product input in the proved range is inside the two imported numbers: H (zeta-specific
  computation) and theta = 7/8 (openai/math half-plane, whose proof uses multiplicativity). The Li-coordinate argument
  itself is Euler-blind and must be: it holds on the whole class C(H, theta), which contains non-Euler twins.
* Lemma D's Hankel positivity is the one statement here that fails for DH. It does not imply any Li sign.

## 7. Three weakest steps

1. Numerics are mpmath evaluations, not interval-certified; n* values are good to the digits shown only in that sense.
   Rosser's constant and the Platt-Trudgian height are imported. The n < 100 range is by citation.
2. Theorem B is proved for a single quadruple under RH for zeta; the dense twin that would match the constant 2/c is
   only argued. The true sharp constant lies in [2/c, 4/c] times H^2 log H.
3. The "classical n <= H^2" reference and the novelty of Lemma C and of the log H gain are from memory; no literature
   search was run. Lemma D's asymptotic reading is not uniform in n and m.

## 8. Next step

None on this route for zero information. If a number is wanted: interval-certify n* (python-flint) and record
"lambda_n > 0 for n <= 9.2e26 (theta = 7/8), 6.8e26 (strip)" as a verified-height corollary. The route gives no lever on
RH or on Lambda.

Files: range2.py (Theorem A/B evaluation, about 2 min), check.py (identity checks).
