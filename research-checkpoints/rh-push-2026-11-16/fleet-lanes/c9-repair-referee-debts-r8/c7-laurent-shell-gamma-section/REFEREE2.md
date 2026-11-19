# REFEREE2 of this lane (third reading of the statement; referee of the second referee's proof): Lemma 2 of `c7-laurent-shell-gamma-section`, monomial case (proof of the second referee) and non-monomial case

2026-11-18, lane `c9-repair-referee-debts-r8`. Target: `push/c8-repair-engine-map-r7/c7-laurent-shell-gamma-section/REFEREE2.md`
sections 2 and 3. No file of either earlier lane was edited. Script `ref3_monomial.py`, log `ref3_monomial.log`
(mpmath only, own code, one local run through `scripts/memcap.sh 8`, 88 s). No server use. No statement about zeros
of zeta is made or checked: Lemma 2 is a mean value of zeta(1/2 + it) over the solutions of a phase equation.

## Outcome

| item | this pass |
|---|---|
| monomial m = c w^kappa, Cesaro mean and the weights r_j | **holds** (proof re-derived line by line; 4 new numerical cases) |
| monomial m, Abel weights: stated error O_q(delta^(-1/4 - eps)) | **holds narrowed**: the limit holds; the error term as stated is **broken** at the line "partial summation on dyadic blocks ... gives an error O_q(delta^(-1/4 - eps))": the remainder O(t^(-1/4)) of the approximate functional equation, summed with the Abel weights, gives O(delta^(-3/4)), which is the error the argument proves |
| non-monomial m (real-analytic, unimodular) | **not proved.** Reduced here to three sub-steps with exponents (section 3); the exact open sub-step is (S1), the truncation of the Poisson sum in k, written in outline only; no missing input beyond classical mean values was identified |
| m not continuous (DH with three or more primes) | not covered; the reduction does not start (no decay of the Fourier coefficients of m^k) |

No requirement flag changes (the monomial statement holds for any Dirichlet series with an approximate functional
equation; R1 = R2 = R3 = R4 = false).

## 1. Monomial case: steps checked

- Unimodular trigonometric polynomials are monomials (coefficient of m conj(m) at the difference of the extreme
  modes). Holds.
- Poles: 2 theta(t) + t log q - a = 2 pi j; derivative log(t/2 pi) + log q + O(t^-2) > 0 for t > t_1(q). At a pole
  X(1/2 + i g_j) = conj(c) q^(i g_j). Holds.
- Approximate functional equation with x = y = (t/2 pi)^(1/2), error O(t^(-1/4)) (Titchmarsh, Theorem 4.13 at
  sigma = 1/2; classical, not opened). Main terms: m = 1 of the first sum; qm = 1 of the second (iff 1/q = n is an
  integer), value conj(c) n^(-1/2). Agrees with 1 + conj(int F_P m dHaar): the coefficient of w^(-kappa) in F_P is
  n^(-1/2) iff q = 1/n.
- Other terms: S = sum_j e(lambda g_j/2 pi) over an interval of j, with f' = lambda/(log(g/2 pi) + log q + ..) monotone,
  abs(f') <= 3/4 for g > t_2(q) (since abs(lambda) <= (1/2) log(g/2 pi) + abs(log q)), abs(f') >= abs(lambda)/(2 log T). So the
  distance of f' from the integers is at least min(abs(lambda)/(2 log T), 1/4), and Kusmin-Landau gives
  abs(S) << log T/abs(lambda) + 1. abs(lambda) >= c(q) > 0 (q = a/b rational, qm != 1 gives abs(qm - 1) >= 1/b) and
  >= log 2 for all but finitely many m. Sum with the weights m^(-1/2), m <= (T/2 pi)^(1/2): O_q(T^(1/4) log T).
  The remainder of the approximate functional equation adds sum_j O(g_j^(-1/4)) = O(N T^(-1/4)). N is of order T log T.
  **The Cesaro statement holds.** The same with the monotone weights r_j (partial summation; Kusmin-Landau on every
  sub-interval).
- Abel weights r_j e^(-delta g_j) (monotone in j): the oscillating terms give O_q(delta^(-1/4)) up to logarithms, as
  stated; the remainder of the approximate functional equation gives sum_j r_j e^(-delta g_j) O(g_j^(-1/4)) =
  O(delta^(-3/4)), which the stated error omits. Against the main term 1/(pi delta) the relative error proved is
  O(delta^(1/4)), not O(delta^(3/4 - eps)). The limit delta -> 0 is unaffected. A smaller error needs further terms of the
  Riemann-Siegel expansion (not written).

## 2. Numerical check (new cases)

Poles by Newton iteration on the phase with mpmath's `siegeltheta`, t in (60, 4000], Cesaro means:

| m | q | predicted | mean up to 1000 / 2000 / 4000 (number of poles); rows 2 to 4: at 4000 only, the others are in the log | difference at 4000 |
|---|---|---|---|---|
| e^(2.1i) conj(w_2) | 1/2 | 0.64302 - 0.61038 i | 0.64411 - 0.61094 i (533) / 0.64101 - 0.60857 i (1292) / 0.64279 - 0.61157 i (3027) | 0.0012 |
| e^(2.1i) conj(w_3) | 1/3 | 0.70853 - 0.49837 i | 0.70766 - 0.49992 i (2772) | 0.0018 |
| e^(-0.9i) w_2 | 2 (1/q not an integer) | 1 | 1.00046 + 0.00014 i (3896) | 0.0005 |
| e^(-0.9i) w_2 conj(w_3) | 2/3 | 1 | 1.00112 + 0.00118 i (3207) | 0.0016 |

The predicted values are not zero and not equal to 1 in the first two cases (the second main term is present);
differences 0.0005 to 0.0027 at all three cut-offs, within O(T^(1/4) log T/N) = 0.02 at T = 4000. The conjugation
(conj(c), not c) is fixed by the first two cases.

## 3. Non-monomial m: reduction and the open sub-step

Setting: m real-analytic and unimodular on the torus T^P, analytic on the shell abs(log abs(w_p)) < sigma with
sup abs(log abs(m)) <= C_m sigma there (this covers m = -conj(F_P)/abs(F_P): F_P has no zero on the torus). phi = arg U,
U = X m(w(t)); phi' = -log(t/2 pi) + O_m(1) < 0 and phi'' = O_m(1) for t > t_m. Target:
sum_j r_j zeta(1/2 + i gamma_j) e^(-delta gamma_j) = (1/(pi delta)) (1 + conj(int F_P m) + o(1)).

(S1) **Truncation in k (OPEN: outline only).** In the variable s = phi(t)/(2 pi) the sum over poles is sum_j H(j),
H = (zeta e^(-delta t) r)(t(s)). Poisson: sum_j H(j) = sum_k H^(k), and abs(H^(k)) <= norm(H'')_1/(4 pi^2 k^2) plus boundary
terms at the starting point (a bounded sawtooth). norm(H'')_1 << int (abs(zeta'') + abs(zeta') + abs(zeta)) e^(-delta t) dt
<< delta^(-1) log^(5/2 + eps)(1/delta) by the classical mean squares of zeta and its derivatives on the critical line. So
the terms abs(k) > K(delta) = log^4(1/delta) contribute o(1/delta). Not written: the boundary terms, the dependence of the
change of variable on m, and the mean-square input with the Abel weight.
(S2) **Terms 0 < abs(k') <= K + 1 (k' = k or k + 1 the resulting power of X), high frequencies.** Expand
m^k = sum_kappa c^(k)_kappa w^kappa and use the approximate functional equation. Each term has phase with second
derivative -k'/t, so on a dyadic block [T, 2T] it is at most 8 (2T/abs(k'))^(1/2) (second-derivative test, monotone
amplitude). A stationary point needs abs(kappa . log p) >= (abs(k') - 1/2) log(T/2 pi) - C, where
abs(c^(k)_kappa) <= exp(abs(k) C_m sigma - sigma abs(kappa)_1) (analyticity of m^k on the shell: PROVED, one line). With
sum_{n <= T^(1/2)} n^(-1/2) << T^(1/4): contribution T^(3/4) exp(abs(k) C_m sigma - sigma (abs(k') - 1/2) log(T/2 pi)/log p_max) per block, times a power of log T
for the number of kappa. Since abs(k') >= max(1, abs(k) - 1), this is summable over k once log(T/2 pi) > 2 C_m log p_max, with sum
at most a constant times T^(3/4); summed over dyadic T <= (1/delta) log(1/delta) it is o(1/delta). Blocks below the threshold
height contribute O_m(K).
(S3) **Same k', low frequencies** abs(kappa . log p) < (abs(k') - 1/2) log(T/2 pi) - C: the phase derivative is at least
C in modulus, first-derivative test gives O(1/C) per term and block; the number of kappa is at most
(2 abs(k) log T/log 2 + 1)^P, each coefficient at most 1 in modulus; total over k <= K and blocks:
delta^(-1/4) times a power of log(1/delta). The remainder of the approximate functional equation gives K delta^(-3/4).
(S4) **k' = 0 (the two main terms), non-resonant frequencies.** int e^(-delta t) e^(-it log(q_kappa n^(+-1))) dt =
1/(delta + i log(q_kappa n^(+-1))). For fixed kappa at most one n has abs(log) < 1/(2 n); the others sum to
O(T^(1/4) log T). The nearest one contributes n^(-1/2) abs(c_kappa) min(1/delta, 1/abs(log)), which is o(1/delta) for each
kappa and dominated by abs(c_kappa)/delta with sum abs(c_kappa) < infinity: o(1/delta) by dominated convergence, with no
rate (small divisors log(q_kappa n) are not bounded below uniformly in kappa).

Status. (S2), (S3), (S4) are exponent counts with the tests named; (S1) is the step with content beyond the monomial
proof and is the exact open sub-step. All counts close with room (3/4 < 1), so no obstruction was found; the
statement for real-analytic m stays ARGUED until (S1) to (S4) are written line by line. The lane's sign conclusion
("no forced sign in the gamma-coupled class") still rests on this ARGUED case and on its measurements.

## 4. Weakest points

1. Section 3 is a plan with exponents, written quickly; the uniformity of the second-derivative test in (S2) near
   the ends of the summation range n <= (t/2 pi)^(1/2) (which moves with t) is asserted, not written.
2. The classical inputs (Titchmarsh 4.13, Kusmin-Landau, mean squares of zeta'') were used from their standard
   statements; no source was opened.
3. The numerical cases are Cesaro means to T = 4000; the Abel-weight statement was not rerun.
