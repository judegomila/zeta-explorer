# n2-landau-even-moment-family: even-moment family transfer (Deligne/Rankin transplant)

Date 2026-11-17. Author check only, unrefereed. No statement about zeros of zeta or of any L-function is proved here. Labels: PROVED / CLASSICAL / ARGUED / MEASURED / RECALLED / OPEN.

Verdict: **precise obstruction; lane closed at the first test.** The transfer lemma is correct and trivial. The d-Poisson duality is an exact involution, holds for arbitrary coefficients, has fixed point a = k (the Heath-Brown point, where the output is Re s > 1), and its only extra terms are the diagonal and the square classes. No pivot was run.

## 0. Plan and what is new against the map

- Map rows read: P23 (family positivity gives nothing on a single member), Z1, Z5 (bounds valid for arbitrary coefficients are capped), Z16 (bootstrap f(theta) = theta), T2 (function-field closure transplants, the certified bound does not), section 5 part 1 (MV-CAP).
- Difference from P23: here the family sum is of even powers of the member's own prime sum, so positivity does give an every-member bound. That part works (section 1).
- Test: whether the family sum can be evaluated below the large-sieve point a = k by duality in d (section 2).

Notation. d runs over odd squarefree integers >= 1; chi_d(l) = (d/l) (Jacobi), l odd. psi(x, chi_d) = sum over odd prime powers l <= x of Lambda(l) chi_d(l). E_d(x) = psi(x, chi_d) - x for d = 1 and psi(x, chi_d) for d > 1. Zeta enters as the member d = 1: E_1(x) = psi(x) - x + O(log x). Theta_d = sup of real parts of zeros of L(s, chi_d) (zeta for d = 1). M_2k(X, x) = sum_{d <= X} E_d(x)^{2k}. Trivial bound: abs(E_d(x)) <= 1.04 x.

## 1. Landau transfer (first lemma)

**L1 (finite form). PROVED.** Let a > 0, k >= 1, eta >= 0, C, x_0 be such that M_2k(x^a, x) <= C x^{a+k+eta} for all x >= x_0. Put theta = 1/2 + (a + eta)/(2k). Then for every d and every x >= x_1 := max(x_0, d^{1/a}):
abs(E_d(x)) <= C^{1/2k} x^{theta},
and for sigma = Re s > theta (sigma != 1):
abs( L'/L(s, chi_d) + delta_{d=1} s/(s-1) ) <= abs(s) [ 1.04 (x_1^{1-sigma} - 1)/(1 - sigma) + C^{1/2k} x_1^{theta-sigma}/(sigma - theta) ].
Hence L(s, chi_d) has no zero in Re s > theta, for every d, zeta included.
Proof. Each term of M_2k is >= 0, so E_d(x)^{2k} <= M_2k(x^a, x) once d <= x^a. Then -L'/L(s, chi_d) = s int_1^inf psi(x, chi_d) x^{-s-1} dx; split at x_1, use the trivial bound below x_1.

**L2 (integral form with non-negative integrand). PROVED, using CLASSICAL explicit-formula bounds for (ii).** I_d(u) = int_1^inf E_d(x)^{2k} x^{-u-1} dx, in [0, inf].
(i) If I_d(u) < inf then for sigma > u/(2k), with q = 2k/(2k-1): int_1^inf abs(E_d) x^{-sigma-1} dx <= I_d(u)^{1/2k} (q (sigma - u/2k))^{-1/q} (Hoelder). So Theta_d <= u/(2k), with no loss.
(ii) I_d(u) < inf for u > 2k Theta_d. So the abscissa of I_d is exactly 2k Theta_d and, by Landau's theorem for Mellin transforms of non-negative functions, u = 2k Theta_d is a singular point of I_d.
(iii) Family form. Z_a(u) = int_1^inf M_2k(x^a, x) x^{-u-1} dx = sum_d c_d(u), c_d(u) = int_{d^{1/a}}^inf E_d^{2k} x^{-u-1} dx >= 0. As a Dirichlet series: D_u(w) = sum_d c_d(u) d^{-w}, non-negative coefficients; for u > 2k, c_d(u) <= 1.04^{2k} d^{(2k-u)/a}/(u-2k), so D_u converges for w > 1 + (2k-u)/a. By Landau, if D_u continues analytically to a neighbourhood of the real segment [0, w_0] from w > w_0, it converges at w = 0, and then sup_d Theta_d <= u/(2k). Known: u_c(a,k) <= k + max(a, k) (Heath-Brown large sieve, CLASSICAL), which for a <= k is u/(2k) <= 1.

**L3 (position of the hypothesis). PROVED.** Let U(theta, a): abs(E_d(x)) <= C x^{theta} for all d <= x^a, x >= x_0. Then
U(1/2 + e, a) => H(a, k) with exponent a + k + 2k e => U(1/2 + e + a/(2k), a).
So "H(a, k) with x^{eps} for all k at one fixed a" is equivalent to "GRH for every member" (using CLASSICAL GRH => E_d(x) << x^{1/2} log^2(dx)). Already in (i): finiteness of one c_d(u) is the zero-free statement for member d. The sum over d adds information only if some tool evaluates the sum without evaluating members.

**MV-CAP check. PROVED.** Positivity does make H(a,k) an every-member, every-x statement; this is consistent with MV-CAP because H(a,k) for a < k is not a mean-value statement obtainable from mean-value tools: any inequality sum_{d<=X} abs(sum_{n<=N} a_n chi_d(n))^2 <= Delta sum abs(a_n)^2 valid for all coefficient sequences has Delta >= c N (witness a_n = chi_{d_0}(n)), and with N = x^k that returns the trivial bound x^{2k}. For the specific coefficients Lambda^{*k} the same witness exists exactly when a member has an off-line zero.

## 2. First test: the Poisson/reciprocity duality in d

Weight: w Schwartz, real; w^(xi) = int w(t) e(-t xi) dt = C(xi) - i S(xi) (cosine and sine transforms). For the duality statement the family is all integers d with weight w(d/X) (the squarefree sieve is a standard additional step, not done here).

**Lemma P. PROVED; MEASURED to 1e-15 (7 moduli, squarefree and not).** For odd m >= 1:
sum_{d in Z} w(d/X) (d/m) = (X/m) sum_{h in Z} w^(hX/m) tau_h(m), tau_h(m) = sum_{b mod m} (b/m) e(bh/m).
tau_0(m) = phi(m) if m is a square, else 0. For m squarefree: tau_h(m) = (h/m) eps_m sqrt(m), eps_m = 1 or i for m = 1 or 3 mod 4. Combining h and -h:
eps_m sum_{h != 0} w^(hX/m) (h/m) = sum_{h >= 1} [ chi_h(m) (C+S)(hX/m) + chi_{-h}(m) (C-S)(hX/m) ],
where chi_{+-h} = (+-h / .) is, by quadratic reciprocity, a real Dirichlet character of modulus dividing 4h.

**Proposition D1 (k = 1, primes). PROVED in the tau-form; MEASURED abs(M - D - OD) <= 1.6e-11 on four (x, X).** With P_h(s) = sum_{p <= x} (log p) chi_h(p) p^{-s}:
sum_d w(d/X) ( sum_{p<=x} log p (d/p) )^2 = D_1 + OD_1,
D_1 = sum_p log^2 p sum_{p not| d} w(d/X) = w^(0) X sum_p (1 - 1/p) log^2 p + O(X^{-A}) (the h = 0 term; only m = square),
OD_1 = X sum_{p != q} (log p log q)/sqrt(pq) sum_{h>=1} [ chi_h(pq)(C+S)(hX/pq) + chi_{-h}(pq)(C-S)(hX/pq) ].
Mellin-separated form (ARGUED: standard, error terms not written): with K~ the Mellin transform of C+-S and 0 < c small,
OD_1 = X sum_{+-} sum_{h>=1} (1/2 pi i) int_{(c)} K~_{+-}(s) (hX)^{-s} [ P_{+-h}(1/2 - s)^2 - sum_p log^2 p chi_{+-h}(p)^2 p^{2s-1} ] ds,
effective range h <= x^{2+eps}/X, abs(Im s) <= x^{eps}.

**Proposition D2 (k = 2, and general k). Structure PROVED from Lemma P; coincidence bookkeeping ARGUED.** psi^k = sum_n c_k(n)(d/n), c_k the k-fold convolution of Lambda on [1,x]^k. M = sum_m c_2k(m) (X/m) sum_h w^(hX/m) tau_h(m). For k = 2, m = p_1 p_2 q_1 q_2:
- two coincidences (m square): D_2 = 3 w^(0) X (sum log^2 p)^2 (1 + o(1)), size X x^2 log^2 x;
- one coincidence (6 pairings): 6 (sum_r log^2 r) times a copy of OD_1 with r not| d;
- no coincidence: OD_2 = X sum_{+-} sum_{h>=1} (1/2 pi i) int K~_{+-}(s) (hX)^{-s} [P_{+-h}(1/2 - s)^4]_{distinct} ds, effective range h <= x^{4+eps}/X.
General k: effective dual range h <= H = x^{2k}/X, dual summand P_h(1/2 - s)^{2k}.

**Answer to the test.**
1. The dual is a 2k-th power sum over the same family (real characters chi_{+-h}), of length H = x^{2k}/X, at the central point, hybrid in a bounded t-range. Scaling: M(X) <-> (X/x^k) M*(x^{2k}/X). Fixed point X = x^k, i.e. a = k. PROVED/ARGUED as above.
2. It is not literally non-negative: the summand is P_h(1/2 - c - it)^{2k} (a power, not a modulus) against (hX)^{-s} K~(s). It is bounded in modulus by the non-negative dual moment. PROVED.
3. Extra terms: h = 0 <-> m = square (the diagonal); h = square <-> d = square (principal-character members, size x^{2k} sqrt X on both sides; MEASURED ratio dual(h = j^2)/primal(d = j^2) = 0.50, 0.36, 0.49, 0.28 at small sizes, same order; for an even weight only m = 1 mod 4 contributes at h > 0, about half the pairs). There is no further main term. PROVED for the list of terms; the matching of the two square classes is MEASURED to a factor only.
4. No sign structure specific to Lambda^{*k} survives. The prime-pair reciprocity sign (p/q)(q/p) is absorbed in eps_{pq} = function of pq mod 4 and splits into the two characters chi_h, chi_{-h}. Lemma P and D1, D2 hold verbatim for any coefficients c(n) on odd integers, in particular for eps(l) Lambda(l) with any sign eps. PROVED.
5. Direction of the map. For a < k the dual family is longer than x^k. Inserting GRH for every dual member in absolute value (P_h(1/2 + it) << x^{eps}) gives abs(OD) <= X H x^{eps} = x^{2k+eps}, the trivial bound. The primal target X x^k then requires cancellation in the h-sum by a factor x^{k-a}, and undoing that cancellation is Poisson again. Output = input. PROVED (the involution), ARGUED (the size count).

**Missing bound, stated.** (MB) For some a < k: sum over non-square m of c_2k(m) sum_d w(d/X)(d/m) << X x^{k+eps} with X = x^a; i.e. a power saving in character sums over d of length m^{a/2k} < m^{1/2}, averaged over m with weights Lambda^{*2k}. Summing over m first, the left side is sum_d psi(x, chi_d)^{2k} minus the diagonal: (MB) is H(a,k) itself. By L3 it is implied by GRH and implies the zero-free region it was meant to prove. OPEN, and of the strength of the conclusion.

**Why the function-field model works and this does not. RECALLED (Deligne Weil I, Katz's 2015 note on curves; not re-read).** There the sum over the base is over all points of U(F_{q^r}) and the trace function of V^{tensor 2k} has conductor bounded independently of r: the base sum is complete, Lefschetz gives poles only from H^2_c = coinvariants, and H(a,k) holds for every k with a = dim of the base fixed. Over Z, d -> psi(x, chi_d)^{2k} is a combination of functions of d with periods m up to x^{2k}; the sum over d <= X is complete only for a >= 2k (output Re s > 3/2), Heath-Brown reaches a = k (output Re s > 1), and the transplant needs a = o(k). The missing object is a constant-field extension: a way to lengthen x without lengthening the periods in d.

## 3. Numerics (size only). MEASURED

`moments.py` (numpy float64, peak < 100 MB, 65 s total, run through `scripts/memcap.sh 8`). R4 = mean over odd squarefree 1 < d <= x^a of psi(x, chi_d)^4 / x^2. "rand": Lambda(l) -> eps(l) Lambda(l), eps random completely multiplicative sign (mean of 3 seeds). "chi_21": eps = chi_21. a = 2 for x >= 2000 uses a random sample of d (1.0e6 to 1.5e6 values).

| a | x | #d | R4 real | R4/log^2 x | max abs(psi)/sqrt x | R4 rand | R4 chi_21 twist |
|---|---|---|---|---|---|---|---|
| 1 | 1000 | 403 | 27.0 | 0.57 | 4.9 | 117 | 2320 |
| 1 | 5000 | 2026 | 57.4 | 0.79 | 7.3 | 201 | 12183 |
| 1 | 20000 | 8103 | 98.1 | 1.00 | 8.3 | 274 | 48995 |
| 1.5 | 1000 | 12814 | 59.2 | 1.24 | 7.5 | 124 | 151 |
| 1.5 | 5000 | 143298 | 106.6 | 1.47 | 9.9 | 196 | 295 |
| 1.5 | 20000 | 1146315 | 165.1 | 1.68 | 11.4 | 281 | 529 |
| 2 | 1000 | 405285 | 91.5 | 1.92 | 10.3 | 121 | 104 |
| 2 | 5000 | 1.46e6 (sample) | 156.6 | 2.16 | 11.8 | 196 | 174 |
| 2 | 20000 | 1.5e6 (sample) | 231.4 | 2.36 | 13.1 | 281 | 257 |

Readings.
- Real primes: the second moment R2 is linear in log x (2.42 to 5.99 at a = 1, slope about 0.97 per unit of log x), R4 is 0.76 to 0.91 of 3 R2^2. No power growth is visible for a = 1, 1.5, 2 up to x = 2e4. This is consistent with H(a, 2) and cannot distinguish x^{eps} from a small power. Full table: `moments.log`, `moments.json`.
- Random multiplicative sign: R4 about 2.8 log^2 x for every a; larger than the real value for a < 2 (the real family has a negative off-diagonal part when X < x^2).
- chi_21 twist (member d = 21 becomes principal, psi about 0.997 x): R4 increases by x^2/#d: 48995 at a = 1, x = 2e4; by 364 at a = 1.5; by about 2.5 at a = 2 (x <= 1000, full family). One member with a zero at 1 moves the fourth moment by the factor x^{k-a}: visible for a < k, O(1) at a = k. This is the fixed point of section 2 in numbers.
- `poisson_check.py` (pure Python, < 50 MB): Lemma P and D1 checks quoted above; output in `poisson_check.json`.

## 4. Controls

| Control | Transfer L1/L2 | d-duality (Lemma P, D1, D2) | Hypothesis H(a,k) | Failing step |
|---|---|---|---|---|
| DH | holds (twisting by a completely multiplicative chi is a ring homomorphism of Dirichlet series, so Lambda_{f x chi} = Lambda_f chi for any f; PROVED) | holds verbatim | false for a < k(2 sigma* - 1) = 1.2407 k, sigma* = 1.1203625 (map value): by L2(i) the d = 1 term alone is not O(x^{2k sigma* - eps}) | size of the coefficients: Lambda_DH is not supported on prime powers and sum_{n<=x} abs(Lambda_DH(n))^2 is not O(x^{2 sigma* - 1 - eps}) = x^{1.2407 - eps} (Cauchy-Schwarz), against x log x for zeta. The large-sieve input at a = k already fails. |
| TW- random multiplicative sign | holds | holds verbatim | holds (MEASURED; the conclusion is also true almost surely) | none; not a counterexample |
| TW- with eps = chi_{d0}, or eps built so that sum eps(p) log p ~ x^{theta_0} | holds | holds verbatim (d is untouched; eps chi_d is still periodic in d) | false for a < k(2 theta_0 - 1) (MEASURED for chi_21) | no step of the lane sees the difference: positivity, coefficient size, support and the d-duality are identical. A proof of H(a,k), a < k, must use structure in the l-variable (the functional equation of each member), which the family does not supply. |
| E_b = zeta(s+b) zeta(s-b) | holds | holds | fails at the diagonal: sum Lambda_E^2 ~ x^{1+2b}, diagonal X x^{k(1+2b)} | size normalisation, at the diagonal. With the hypothesis rescaled to X times diagonal, L1 returns 1/2 + b + a/(2k), consistent with the true zeros. |
| Beurling | no family (chi_d needs the additive structure of Z) | not formulable | - | not formulable; no quantitative handle |
| HEAT, NR | not run | not run | - | - |

Q1-Q3 of the map. Q2: the hypothesis is uniform and every-window by construction; that is its cost (L3). Q3: multiplicativity enters only through chi_d(l_1 ... l_k) = prod chi_d(l_i) (complete multiplicativity of the twist, which every control with a Dirichlet series has) and through quadratic reciprocity in Lemma P (a statement about the family, not about Lambda). Nothing in the lane uses the Euler product of the member to the left of Re s = 1.

## 5. Verdict

- PROVED: L1, L2, L3 (transfer with constants; "H(a,k) for all k" is equivalent to GRH for the family including zeta); Lemma P; the tau-form of the duality for k = 1 and the term structure for k = 2; coefficient-blindness of the duality; sharpness of any coefficient-uniform large sieve at Delta >= cN.
- Obstruction: the duality in d is an involution with fixed point a = k and with no term specific to Lambda; for a < k the dual statement requires more than GRH for each dual member in absolute value. The missing bound (MB) is the hypothesis itself. Same type as Z16 (output = input) and Z1/Z5 (valid for arbitrary coefficients, hence capped at the large-sieve point).
- No new statement about zeros. Lead strength: low. Pivot not used: the adjacent idea (a base sum that is complete relative to the periods, the analogue of constant-field extension) has no candidate construction for GL(1) twists.

## 6. Three weakest steps

1. The Mellin-separated dual forms (D1 second display, D2) and the effective truncation h <= x^{2k+eps}/X are ARGUED, without error terms; prime powers, the prime 2 and the squarefree sieve are omitted from the duality; the k = 2 coincidence bookkeeping is not expanded. The exact tau-form is what was checked numerically, for k = 1 only.
2. The function-field comparison (Deligne/Katz, complete base sums, H^2_c) is recalled from memory and not re-read; the statement "a = dim of the base" is a dictionary, not a theorem here.
3. The DH row uses sigma* from the obstruction map and an Omega-statement for partial sums of Lambda_DH that was not computed; the d-twists of DH were not examined for a functional equation. Numerics are size-only at x <= 2e4, a = 2 sampled for x >= 2000, and the square-class matching in section 2 item 3 is confirmed to a factor of about 2 to 4 only.

## Files

`poisson_check.py`, `poisson_check.json`, `moments.py`, `moments.log`, `moments.json` in this directory.
