# s1-primon-kinetic-truncation: screening of four finite-prime combinations

Date: 2026-11-19. Lane: screener. Status labels: PROVED (elementary, derived here), CLASSICAL, MEASURED (float64 with long-double prefix sums; the checks are listed in section 6), OPEN.

Verdict: 4 combinations tested, 0 survivors. Each statistic is, after its main term is removed, the sum over zeros of the explicit formula at cutoff P. Controls separate from zeta in exactly two ways: (i) through the pole at s = 1 (the mean density of the prime weights) or the missing functional equation, where the positive comparison L(s, chi_4) separates from zeta in the same way; (ii) through the term P^(rho - s) of an off-line zero, at the scale the zero's position fixes. The T-NR twin is identical to zeta in tests 1 and 4 and passes tests 2 and 3 outside narrow windows at its zero heights.

## 1. Code, runs, sizes

Shared code (this directory): `psums.c` (segmented sieve, OpenMP; for every prime p <= P, a list of complex points s and six prime classes it accumulates L p^-s, L^2 p^-s, L x/(1 -+ x), L^2 x/(1 -+ x)^2, -log|1 -+ x| with x = p^-s, L = log p; checkpoints 12 per decade), `points.py`, `lib.py`, `analyze.py` (tests 1 to 4), `scan.py` (test 3 fine scan in t, cupy), `kyp64.py` (test 4 with 2, 5, 64 primes, dense frequency grid, Arb at the maximiser), `dh.py` (Davenport-Heilbronn in n-indexed form), `validate.py`, `check_identity.py`.

| Run | Where | Size | Wall time |
|---|---|---|---|
| A (tests 1, 2) | server, rhrun unit `rh-s1pk-sums-1119182631`, 8 cores, 6 GB cap (0.7 GB used) | P = 1e11, pi(P) = 4,118,054,813, 44 points, 121 checkpoints | 618 s |
| B (tests 3, 4) | same unit | P = 1e10, pi(P) = 455,052,511, 743 points, 109 checkpoints | 1528 s (machine load average about 120) |
| V (validation) | same unit | P = 1e7, 763 points | 2 s |
| scan (test 3b) | server, unit `rh-s1pk-scan-1119183756`, GPU 1 (cupy), 3 GB cap | X = 1e8, 5,762,859 prime powers, 801 heights x 9 abscissae x 2 windows | 11 s of sums |
| kyp64, dh (N = 1e7), check_identity, X = 1e6 scan | Mac, `scripts/memcap.sh 8` | see sections 4, 5 | under 3 min each |

Not run: the fine scan at X = 1e9 (GPU 1 had 91 of 98 GB in use by other jobs and the machine had 42 GB available, below what rhrun requires for a 5 GB job). All units of this lane are stopped; the one failed unit (an aborted first launch, a bug in the validation script) was cleared with `reset-failed`.

Controls built from the same prime sums. Classes: chi_4 and chi_3 (positive comparison; p = 2, respectively p = 3, removed); Liouville twist eps_p = -1 (`lio`, the function zeta(2s)/zeta(s)); two random completely multiplicative sign twists, hash seeds 12345 and 12346 (`rnd`, `rnd2`); thin sign twist THIN with b = 0.75 (`thin`: eps_p = -1 on the set S, 4,958,231 primes below 1e11, rule "first prime at which (1/2) int_2^p t^(b-1) dt/log t passes an integer"; real zero at s = 0.75) and thin deletion DEL on the same set (`del`); unimodular twist p^(-3i) (`U`, the function zeta(s + 3i) with zeta's archimedean factor at s); E_a = zeta(s + a) zeta(s - a) with a = 0.08 (`EA`, zeros on Re s = 0.42 and 0.58); T-NR twin xi(s)(2 cosh((s - 1/2) log 2) + c), c = 2 cosh(0.1 log 2) (`NR`, zeros at 1/2 +- 0.1 + i pi (2k+1)/log 2, first height 4.5324). Davenport-Heilbronn (DH): its Lambda_DH is not supported on prime powers (Lambda_DH(6) = 1.936, Lambda_DH(12) = -0.763), so the p-indexed statistics do not exist; the n-indexed analogues with cutoff n <= N = 1e7 were computed. Backward heat family: it has no Dirichlet series; none of the four statistics is defined for it (not run).

## 2. Result table

| # | Combination | Statistic | Size | zeta | L(s, chi_4) | Controls | Class |
|---|---|---|---|---|---|---|---|
| 1 | truncated-kinetic-mertens-law + zpo-divergence-law-at-half | K_P(beta) = sum_{p<=P} L^2 p^-beta/(1 - p^-beta)^2; rate exponent theta_eff of the residual after the pole term and the prime-square term | P = 1e11 | offset(1e11) = -0.187444 (limit -c0 = -0.187546); residual 1.59e-5; theta_eff 0.58 | theta_eff 0.55 (same; but the law "(log P)^2/2 - c0" itself fails for it: no pole) | NR: identical to zeta to all digits. U 0.57, lio 0.58, rnd 0.59, rnd2 0.56: same as zeta. thin 0.81, del 0.81, EA 0.65, DH (n-indexed, N = 1e7) 0.89: differ, each by the term P^(rho-s) of its zero | CLOSED: zero sum of the explicit formula; blind to T-NR |
| 2 | route-a-primon-reflection-gram + zpo-kinetic-equals-logzeta-dd | lambda_min of the 8-node Pick Gram of F_P = A - sum_{p<=P} eps_p L/(p^s - eps_p); exponent in P | P = 1e11 (source: 9973) | -4.99e6; exponent 0.444 over the top two decades (0.422 over 1e3..1e5), predicted 0.45 | -48.2; exponent 0.03 to -0.03 (no growth) | NR -4.99e6, 0.444; thin, del 0.446, 0.445; lio 0.498; U 0.34; EA 0.519 (= 0.45 + a); rnd, rnd2: no growth | CLOSED: the exponent is the pole at s = 1 seen through the cutoff (PNT); the comparison L-function does not have it |
| 2' | same, pole term P^(1-s)/(1-s) and prime-square term removed | lambda_min of the corrected Gram | P = 1e11 | -0.039 (1e6), -0.73 (1e9), -1.36 (1e11) | -0.17 (1e6), -6.7 (1e9), -0.012 (1e11) | NR -1.08; EA -11.8; chi_3 -0.08; thin -1135, del -566 (growth 0.32 per unit log P: the zero at 0.75); U, lio, rnd: -130 to -750, constant in P (pole mismatch) | CLOSED: noise of the zero sum of size P^(-0.05) amplified by the Gram; zeta, chi, NR, EA not separated |
| 3 | twin-sync-dissipation + prime-delay-domination-18-2 | margin Re[A(s) - sum_{n<=X} Lambda(n) n^-s (1 - log n/log X)], raw and pole-corrected, 71 grid points 0 < Re w <= 1/2 | X = 1e10 | raw: negative at 26 of 71 points, minimum -6782. Corrected: positive at 71 of 71 for every X in 1e4..1e10, minimum 0.0043 | corrected: 71 of 71 positive, minimum 0.0142 | EA, NR: 71 of 71 positive at every X (minima 0.0082, 0.0203). U, lio, rnd, rnd2: 31 to 47 negative points from X = 1e4 (minimum -10 to -22, at w = 0.4; pole mismatch). thin, del: 15 to 21 negative. DH: negative only at heights 85 to 86.5 and Re w <= 0.2 | CLOSED: zeta-FE controls with off-line zeros pass; they fail only inside a window of width about 2 pi/log X at a zero height, with Re w below the displacement |
| 4 | kyp-bounded-real-prime-delay + restricted-mobius-delay-lift | sup over frequency of log abs Theta_{a,N}(i omega), Theta = xi_N(1/2 + w - a)/xi_N(1/2 + w + a), N = 2, 5, 64 primes and P to 1e10; a = 0.001 to 0.1 | N = 64 dense grid; P = 1e10 on 12 frequencies | sup/(2a) = 39.0 (N = 64), 2.0e5 (P = 1e10), at omega = 0: bounded-real fails at every a | fails at every a (6.3 at N = 64, 11.3 at P = 1e10) | NR: identical to zeta on the axis (proved). U, lio, rnd, thin, del, EA: fail at every a | CLOSED: fails for every function including zeta and the comparison; sup/(2a) does not depend on a, so there is no threshold in a |

## 3. Statements and mechanism per combination

Notation: c0 = gamma^2 + 2 gamma_1 = 0.18754623; "explicit formula" is the Perron/Riemann-von Mangoldt formula for the sharp or Fejer cutoff (CLASSICAL).

### Test 1

Finite consequence tested: with r(P) = K_P(beta) - [regular part of (log F)''(beta)] - [pole term] - [prime-square term], abs(r(P)) P^(beta - 1/2)/log P stays bounded for zeta and should grow like a power of P for a control "with real content". Survival would have required every control to show a different exponent at P below the scale its zeros explain.

- PROVED (from the explicit formula): K_P(beta) = reg(beta) + M(P, beta) + int_{sqrt P}^{P} 2 log t t^(-2 beta) dt - sum_rho P^(rho - beta)(log P/(rho - beta) - 1/(rho - beta)^2) + O(P^(1 - 2 beta) log P + P^(1/3 - beta) log P), M(P, 1) = (log P)^2/2. At beta = 1 the prime-square term is (log P + 2)/sqrt P; it is positive and explains why offset(P) approaches -c0 from above.
- MEASURED: offset(P) + c0 = 3.66e-3 (1e7), 1.74e-3 (1e8), 7.56e-4 (1e9), 3.51e-4 (1e10), 1.02e-4 (1e11). After the prime-square term the residual at 1e11 is 1.59e-5, and abs(r) P^(beta-1/2)/log P is at most 0.437 over the last decade for beta = 1, 1.25 and 2 (0.4368, 0.4344, 0.4333: the same zero sum). Node value offset(1e7) = -0.18389 reproduced (-0.183888).
- Controls, own main terms subtracted, fitted exponent theta_eff = beta + slope of log(max over a decade of abs(r(10^(1/4) P) - r(P))), decades 1e4..1e11, beta = 1 / 1.25 / 2: zeta 0.583 / 0.583 / 0.582; chi_4 0.549 / 0.544 / 0.537; chi_3 0.548 / 0.537 / 0.510; NR equal to zeta; U 0.569 / 0.568 / 0.561; lio 0.583 / 0.583 / 0.582; rnd 0.594 / 0.581 / 0.543; rnd2 0.560 / 0.561 / 0.543; thin 0.810 at all three; del 0.806; EA 0.651 / 0.650 / 0.650. The value 0.58 instead of 0.5 for zeta is the factor log P of the zero sum.
- T-NR: its K_P differs from zeta's by the fixed function (log N)''(beta); r(P) is identical (PROVED; the numbers agree to all printed digits). The test cannot see its zeros at any P.
- Random signs: the tail is a random walk of the same order P^(1/2 - beta); same exponent as zeta, amplitude 5 to 8 against 0.4 to 0.6.
- Blind form (every control scored against zeta's law offset -> -c0): at P = 1e11 the value offset + c0 is 1.0e-4 for zeta and NR, -320.8 for chi_4, -637.6 for lio, -316 for U and rnd, -15.3 for thin, -8.0 for del, +1145.6 for EA. This separates at P = 1e3, but it reads only the coefficient of (log P)^2/2, that is the pole of order one at s = 1, and the comparison L-function fails it.
- DH (n-indexed, cutoff n <= N): increments 0.026, 0.016, 0.0077, 0.014 per decade at beta = 1 up to N = 1e7, theta_eff 0.89 (0.83 at beta = 1.25): the term N^(rho - 1) of the zero 0.8085 + 85.70i. The size at which it shows, N about 1e5, is far below exp(85.7) and is the size the zero fixes: N^(0.31) of the order of its height.

Classification: CLOSED. thin, del, EA and DH separate by the term of their own off-line zero at P of the order (height)^(1/(beta_0 - 1/2)) or exp(c/(beta_0 - 1/2)); NR, U, lio, rnd, chi do not separate. The task's criterion "below exp of the off-line height" is met by DH and EA, but the correct scale for a sharp cutoff is a power of the height, and at that scale the test is the evaluation of the zero's term.

### Test 2

Finite consequence tested: lambda_min of G_ij = (F(1/2 + nu_i) + conj F(1/2 + nu_j))/(nu_i + nu_j), nodes nu in {0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 1.0, 1.5}, is negative with -lambda_min proportional to P^(1/2 - nu_min) = P^0.45 for zeta, and the exponent changes for a control.

- MEASURED: zeta lambda_min = -1621.7 (1e3), -4213.2 (1e4), -30666.5 (1e6), -644495 (1e9), -4989702 (1e11); local exponent 0.4216 (1e3..1e5), 0.4444 (1e9..1e11). Negativity at P = 1e11 certified in Arb for every control (quadratic form of the float eigenvector, entries with relative radius 1e-7).
- PROVED: F_P(s) = xi'/xi(s) - P^(1-s)/(1-s) - int_{sqrt P}^{P} t^(-2s) dt + sum_rho P^(rho-s)/(rho-s) + smaller terms. The growth P^(1/2 - nu) is the pole of zeta at 1. Hence: chi_4, chi_3 and random signs have no growth (lambda_min between -46 and -73 for chi, -217 to -517 for rnd, at all P); NR, thin, del have zeta's exponent; EA has 0.45 + a; lio has it with the sign of F reversed.
- Pole-corrected Gram (2'): lambda_min is negative and of irregular size for zeta, chi_4, chi_3, NR and EA at every P (values in the table); the entries carry the zero sum of size P^(-nu), which at nu = 0.05 is 0.28 at P = 1e11, and the Gram of the limit function is singular to 1e-31 (eigenvalues of the limit Gram of xi'/xi at 40 digits: 3.4e-31, 7.9e-26, 9.3e-21, ...). No sign information on the limit can be read at any reachable P.
- Limit Grams at 40 digits: zeta, chi_4 and EA positive (smallest eigenvalues 3.4e-31, 4.7e-26, 3.5e-31); T-NR has two negative eigenvalues -1.65e-12 and -4.5e-15. The 8-node Pick matrix of the limit function sees the T-NR zeros at relative size 1e-12 and does not see the EA zeros. This is the known finite-Pick-order result (verified height in the form of node precision).

Classification: CLOSED. The exponent law is a statement about the pole; with the pole removed the statistic is the zero sum plus a singular Gram.

### Test 3

Finite consequence tested (derived here): for X >= 2 and s = 1/2 + w,
M_X(s) := Re[A(s) - S_X(s) + (X^(1-s) - 1)/((1-s)^2 log X) - T_X(s)] = Re xi'/xi(s) + Re sum_rho (X^(rho-s) - 1)/((rho-s)^2 log X),
with S_X the Fejer-weighted sum over n <= X, A(s) = 1/s + 1/(s-1) - (log pi)/2 + psi(s/2)/2 and T_X the term of the trivial zeros (PROVED; checked against 300 zeros at four points, agreement 2.3e-4, equal to the computed tail of the zero list). Under RH, with x = Re w > 0: M_X(s) >= Re xi'/xi(s) (1 - (1 + X^-x)/(x log X)), positive when x log X > 1.2785 (PROVED under RH). The raw margin of the task (no pole term) is not positive for zeta: it is negative at 16 to 26 of the 71 grid points for X from 1e4 to 1e10 and its minimum decreases to -6782.

- MEASURED, corrected margin on the grid x in {0.05, 0.1, 0.2, 0.3, 0.4, 0.5}, y in {0, 1, 2, 4.5324, 7, 10, 13.597, 14.1347, 17, 21.022, 25, 30}: zeta positive at all points for X = 1e4, 1e5, ..., 1e10 (minima 0.0073, 0.0060, 0.0053, 0.0049, 0.0051, 0.0044, 0.0043), including the points with x log X < 1.2785. chi_4, chi_3 (their own A and trivial zeros, no pole): positive at all points.
- EA and NR (own archimedean factor, same pole): positive at all 71 points for every X, although the grid contains the NR zero heights 4.5324 and 13.597 and the EA zero height 14.1347 with x below the displacement. Reason (PROVED): at the height of the zero the term (X^(delta - x) - 1)/((delta - x)^2 log X) is real and positive.
- Fine scan (step 0.01 in t, windows of length 8 around 14.1347 and 4.5324): at x = 0.02 and X = 1e6 the minimum is -0.040 for EA (t = 13.695, 10 negative heights) and -0.34 for NR (t = 4.112, 89 negative heights); at X = 1e8: EA -0.383 (t = 13.815, 50 negative heights), NR -1.20 (t = 4.232, 114 negative heights); zeta stays positive (minimum 0.0030). At x = 0.05 and x = 0.2 all three are positive at both sizes. The negative values sit at a distance about 2 pi/log X from the zero height.
- U, lio, rnd, rnd2: negative at 31 to 47 points from X = 1e4 on, minimum -10.2 (U), -22.5 (lio), -12.1 (rnd), -11.3 (rnd2), all at w = 0.4, with no dependence on X. Reason: A(s) contains 1/(s - 1) and the prime side of these controls has no pole at s = 1 with residue 1 (U has it at 1 - 3i, lio with residue -1, rnd none). thin and del: 15 to 21 negative points (minimum -1.2 to -3.0): no functional equation, and the zero at 0.75.
- DH (n-indexed, A of the odd character mod 5, N up to 1e7): negative at 3 to 10 of 66 points, all at heights 85, 85.3, 86.1, 86.5 with x <= 0.2 (minimum -10.2 at X = 1e6); positive at the zero height 85.699 itself (+57 at x = 0.05) and at the heights 0, 5, 20, 60, 114.16, 114.6.

Classification: CLOSED. The corrected margin is Weil's explicit formula for one test function per (X, s). The two controls with Euler product, zeta-type functional equation and pole (EA, NR) fail only where the test resolves their zeros: height within about 2 pi/log X and x log X-scale below the displacement. The controls that fail at small X fail through the pole term or the missing functional equation, not through a property of the prime side that zeta has and they lack beyond its mean density.

### Test 4

The repository pilot (imp-1204, imp-1207) cannot be reproduced as stated: for p(z) = 1 + c z + z^2 with real c, p^#(z) = p(z), so Theta^lift = p^#/p is identically 1; the recorded mesh values 0.74 to 0.99 are not values of that ratio, and the script `scripts/compute-imp1207-app-S-conditioning.mjs` builds a model Gram in the basis sinh(a t)^k of the kernel Phi, not a Gram of the bridge ratio. The test run here is the sharp finite version of the same node: Theta_{a,N}(w) = xi_N(1/2 + w - a)/xi_N(1/2 + w + a), xi_N(s) = (1/2) s (s-1) pi^(-s/2) Gamma(s/2) prod_{p <= p_N} (1 - eps_p p^-s)^-1 (N prime-delay sections; N = 64 is the "degree 64" case). For a function analytic in Re w > 0 the KYP inequality is feasible exactly when sup over the axis of abs(Theta) is at most 1 (bounded real lemma, CLASSICAL), so the semidefinite program was replaced by the supremum over omega in [0, 3000] (step 0.002 up to 60, 0.02 above), with an Arb evaluation at the maximiser. No semidefinite program was solved.

- PROVED: log abs Theta_{a,N}(i omega) = -int_{-a}^{a} Re (xi_N'/xi_N)(1/2 + x + i omega) dx. The integrand is odd in x only if xi_N satisfies the functional equation, which no finite product does. At omega = 0 every factor of zeta's product and the gamma factor contribute positively, so abs(Theta_{a,N}(0)) > 1 for every N >= 0 and every a in (0, 1/2).
- MEASURED: sup log abs Theta/(2a) for zeta: 9.38 (N = 5), 39.03 (N = 64), 205 (P = 1e4), 2007 (1e6), 20010 (1e8), 200027 (1e10), all at omega = 0, the same to 3 digits for a = 0.001 and a = 0.025 (40.66 at a = 0.1, N = 64). chi_4: 2.03 (N = 5, omega = 14.42), 6.27 (N = 64, omega = 2820.56), 11.3 (P = 1e10, omega = 0). U 6.28, lio 22.5, rnd 10.75, thin 27.3, EA 84.3 (N = 64). The fraction of the frequency grid with abs(Theta) > 1 at N = 64 is 0.18 to 0.26 for all of them. Arb intervals at the maximisers are positive for all 105 rows (file `kyp64.json`).
- T-NR: the factor N(s) = 2 cosh((s - 1/2) log 2) + c satisfies abs(N(1/2 - a + i omega)) = abs(N(1/2 + a + i omega)), so its axis values equal zeta's (PROVED); it differs only by poles of Theta in Re w > 0 when a < 0.1, a statement about its zeros.

Classification: CLOSED. The truncated bridge ratio is not bounded-real for zeta, for the comparison L-function or for any control, at any a; the quantity sup/(2a) is the same for all a <= 0.025, so the "passes at a = 0.025, fails at a <= 0.015" pattern of the pilot has no counterpart. The axis condition for small a is Re xi_N'/xi_N(1/2 + i omega) >= 0, which is test 3 at Re w = 0 with a sharp cutoff. A bounded-real statement for a rational interpolant of the true Theta_a is a finite Pick test (closed: `pick/NEXT_STAGE.md`, `euler/RESULT.md`).

## 4. Why nothing here is a survivor

Survivor definition of the brief: zeta passes at every size, every control fails at a size much smaller than its off-line zeros explain or for a reason independent of resolving zeros, and the statistic uses all primes.

- Tests 1, 2 (uncorrected) and 4: a control fails for a reason independent of zeros only through the pole at s = 1 or the missing functional equation; L(s, chi_4) fails the same way in tests 1 (blind) and 2, and zeta itself fails test 4. T-NR passes tests 1 and 4 identically.
- Tests 2' and 3 (pole-corrected): zeta and L(s, chi_4) pass test 3 at all sizes; EA and T-NR also pass, on the fixed grid at every X up to 1e10, and fail only in the fine scan near their zero heights. That is the known pattern.
- Common reason (PROVED): each statistic is a linear functional of the sums sum_{p <= P} eps_p L p^-s and their k >= 2 companions; the explicit formula turns it into [main terms from poles] + [sum over zeros of P^(rho - s) times a fixed kernel]. A finite modification of local factors (T-NR) changes it by a P-independent function. A statistic of this type cannot contain more than the pole data and the zero sum at resolution 1/log P in height.

## 5. Checks

1. `validate.py` on the server at P = 1e7: C sums against a direct numpy evaluation at 40 sampled points, all 6 classes, all quantities: worst relative difference 2.4e-11; two entries against mpmath at 30 digits: differences 2.9e-15 and 1.2e-13; class counts equal to an independent sieve and hash; pi(1e7) = 664,579, pi(1e10) = 455,052,511, pi(1e11) = 4,118,054,813, pi(1e11; 4, 3) = 2,059,034,532.
2. Known value: offset(1e7) = -0.183888 (node: -0.18389); source value lambda_min = -4213.156 at N = 1229 (p_N = 9973, the largest prime below 1e4) reproduced at the checkpoint P = 1e4: -4213.156.
3. `check_identity.py`: the identity of test 3 against 300 zeros (four points).
4. Limits: for zeta, chi_4, U, lio, EA the residual of test 1 against the mpmath limit function is 1.6e-5, 5.6e-6, 1.6e-5, 1.6e-5, 1.2e-4 at P = 1e11 and beta = 1, and 2e-16 to 1.3e-15 at beta = 2.
5. Arb (python-flint 0.9, 200 bits): sign of the Gram quadratic forms (test 2) and of log abs Theta at the maximisers (test 4).

Not interval-certified: the prime sums themselves (float64 terms, per-segment float64 sums, long-double prefix sums); every reported sign has a margin at least 1e6 times the validation error, except the pole-corrected Gram values of test 2', which are reported as noise and carry no verdict.

## 6. Three weakest steps

1. THIN and DEL are implemented with a trapezoid rule restarted per sieve segment; the set S (4,958,231 primes below 1e11, 976,161 below 1e10) has the stated density, but the continuation and the zero at s = 0.75 are taken from the map (control THIN, PROVED-rel a short-interval prime theorem), not rechecked. The measured exponent 0.81 = 0.75 + log factor is consistent with it.
2. Test 4 replaces the LMI by the supremum on a frequency grid up to 3000 (N <= 64) and by 12 frequencies for P up to 1e10. This is sufficient for the verdict "infeasible" (one frequency with abs(Theta) > 1 suffices and omega = 0 is proved), but it gives no supremum for the controls whose maximum is not at 0.
3. The fitted exponents of test 1 use 7 decades and a per-decade maximum; the log factor shifts them by about 0.06 to 0.08, and the difference EA minus zeta (0.07) is of the same size as the scatter between zeta, chi and rnd (0.04). The EA separation in test 1 is therefore weak evidence; the thin, del and DH separations are not affected.

## 7. Files

`resA.json` (tests 1, 2 at P = 1e11), `resB.json` (tests 3, 4 at P = 1e10), `scan_1e6.json`, `scan_1e8.json`, `kyp64.json`, `kyp64.log`, `dh_1e7.json`, `dh_1e7.log`, `outA.bin`, `outB.bin` (checkpoint prefix sums), `SprimesA.txt` (the THIN set below 2e7), point lists `ptsA.*`, `ptsB.*`, `ptsS.*`.
