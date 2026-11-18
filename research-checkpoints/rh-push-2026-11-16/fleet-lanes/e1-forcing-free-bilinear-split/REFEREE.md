# REFEREE: e1-forcing-free-bilinear-split

Referee verdict: **the claim does not hold as stated.** One step labelled PROVED is false (Theorem R(iii), the
"parity cap at restricted level"), one sub-claim of Theorem R(ii) is false ("only dual certificate"), and two
numerical summaries are wrong (mass ratio "5 to 8"; bound "4.7e-7 by proof"). The core of the result is confirmed:
Proposition G, Corollary F, section 4.1, Theorem R(i), the full-level part of R(ii), and section 4.3 (one-sided
bound equivalent to RH). RH open; nothing in the file assumes RH or restates verified height.

Scratch code for this report: /tmp/e1ref/{chk1.py,chk2.py,lp.py,dual.py} (not kept in the repo). All runs local,
through `scripts/memcap.sh 8`, peak planned allocation 0.64 GB. The compute server was not used.

## 1. Steps re-derived and confirmed

| step | status | note |
|---|---|---|
| (Leg) sum_{b<=y} b^{-1/2} S(y/b) = sum_{k<=y} k^{-1/2} log k | confirmed | 1 * Lambda = log, exact |
| W(y) = -(4+2 gamma) sqrt y - zeta'(1/2) + e(y), abs e <= (6 + log y)/sqrt y | confirmed | source Lemma 2.1 gives (2 + log y)/sqrt y; abs(H(y) - log y - gamma) <= 2/y for real y >= 1 gives 4/sqrt y |
| Proposition G | confirmed | abs E <= sum abs(mu'(d)) (6 + log(X/d))/sqrt X; needs X >= D |
| Corollary F | confirmed | c(1) = 1, c(m) = -a'(m) for m >= 2; det = 0.052973, abs c2 + abs c3 <= 24.25 abs m(U) + 15.73 abs M_U(1/2); abs M_U(1/2) <= 2 sqrt U |
| 4.1 symbol A'(rho) = 1 | confirmed | with M'(1) = 0 the partial sums of a' are O(norm mu'), so the Dirichlet series of a' converges for Re s > 0 and the truncated symbol tends to 1 at every zero |
| Mellin remark (residues at 1/2 and 0) | confirmed | at s = 1/2 the two contributions 2 dM'/ds(1) and -2 dM'/ds(1) cancel when M'(1) = 0 |
| Theorem R(i) | confirmed | restatement of the proof of Proposition G |
| Theorem R(ii), unitriangular system, no LP gap at full level | confirmed | trivial: the system has one solution |
| 4.3 one-sided polylog bound on K'[R] equivalent to RH | confirmed | Landau on -zeta'/zeta(s+1/2)/s - 2/(s-1/2); zeta has no real zero in (1/2, 1); converse from RH by partial summation |

Independent numeric check (new code, new cases; non-integer X, U not tied to X^{1/4}, random real mollifier,
alternative gauge on delta_5, delta_7):

| X | U | mollifier | LHS of Prop. G | prediction | E | proved bound |
|---|---|---|---|---|---|---|
| 3000000.5 | 70 | mu_{<=U} | -16.030839 | -16.035475 | 4.6e-3 | 0.53 |
| 3000000.5 | 70 | gauge (2,3) | 0.011684 | 0 | 1.2e-2 | 0.64 |
| 3000000.5 | 70 | random real, sup. [1,70] | 8070.125905 | 8070.140307 | -1.4e-2 | 0.59 |
| 3000000.5 | 70 | gauge (5,7) | -0.017110 | 0 | -1.7e-2 | 0.75 |
| 20000003 | 300 | mu_{<=U} | 238.886183 | 238.885873 | 3.1e-4 | 0.93 |
| 20000003 | 300 | gauge (2,3) | -0.003779 | 0 | -3.8e-3 | 0.99 |
| 20000003 | 300 | random real | 24493.634304 | 24493.646269 | -1.2e-2 | 1.11 |

Proposition G and Corollary F hold in every case tried.

## 2. Errors

### E1 (substantive). Theorem R(iii) is false: restricted-level (Leg) with Lambda >= 0 is not parity-capped

Statement in RESULT: "If (Leg) is used only at levels y = X/d, d <= D, with Lambda >= 0, the certificate is a Type-I
majorant and is capped at (4 - o(1)) sqrt X for D <= X^{1-eps} (round-2 Stepanov Theorem P)". Repeated in the verdict
summary ("parity-capped at restricted level"), in 4.2 ("loses the parity factor 2"), 4.4 and section 6.

Two independent defects.

(a) The import does not apply. Round-2 Theorem P concerns W(n) = sum_{u | n, u <= L} c_u with W >= 0 on all n <= X,
W(p) >= 1, and the extra hypothesis sum abs(c_u)/u <= (log X)^A (dropped in RESULT). A (Leg) certificate is
S(X) <= sum_n Lambda(n) n^{-1/2} phi(X/n), phi(z) = sum_{d<=D} y_d G(z/d), G(z) = sum_{b<=z} b^{-1/2}, phi >= 1 on
[1, X]. This is the Chebyshev class (weights depend on X/n, evaluated through 1 * Lambda = log), not the sieve class
(divisor sums in n). The source files say so: r3-type2-parity Remark 2.3 and r3-legendre-dual-lp section 6.1 row
"Sieve parity (round 2, Theorem P): not involved".

(b) The conclusion is false. Half-weight Chebyshev certificate, computed here (lp.py, float64 HiGHS, not interval
verified): choose y on d <= D with sum y_d d^{-1/2} = 0, phi(j) >= 1 for all integers j <= J, and
zeta(1/2) sum y_d - sum abs(y_d) sqrt(d/J) >= 1 (which gives phi(j) >= 1 for j > J by Lemma 2.1). Then for all X >= D

    S(X) <= c_D sqrt X + O(1),   c_D = -2 sum_{d<=D} y_d d^{-1/2} log d.

| D | J | c_D | sum y_d | norm y_1 |
|---|---|---|---|---|
| 6 | 20000 | 2.3197 | -0.817 | 2.82 |
| 30 | 20000 | 2.0691 | -0.756 | 5.23 |
| 100 | 20000 | 2.0549 | -0.766 | 6.02 |
| 300 | 40000 | 2.0448 | -0.763 | 6.76 |

D = 6: y = (1, -0.48706, -0.27891, -0.46304, -0.58936, 0.00127). Six levels and positivity give 2.32 sqrt X, below
the claimed cap 4 sqrt X; the truth is 2 sqrt X. Finite-X LP (minimise sum y_d L(X/d) subject to phi >= 1 at every
n <= X, no knowledge of which n are prime powers):

| X | D | LP bound / sqrt X | S(X) / sqrt X | LP bound - S(X) |
|---|---|---|---|---|
| 1e4 | 6 | 2.2828 | 1.9747 | 30.8 |
| 1e4 | 100 (X^0.50) | 1.9955 | 1.9747 | 2.08 |
| 1e4 | 1000 (X^0.75) | 1.9747 | 1.9747 | < 5e-4 |
| 1e5 | 30 | 2.0585 | 1.9920 | 21.0 |
| 1e5 | 316 (X^0.50) | 2.0025 | 1.9920 | 3.3 |
| 1e5 | 3162 (X^0.70) | 1.9920 | 1.9920 | < 5e-4 |
| 1e6 | 30 | 2.0655 | 1.9969 | 68.6 |
| 1e6 | 1000 (X^0.50) | 2.0040 | 1.9969 | 7.1 |

At D = X^{0.7} and X^{0.75} the restricted system already pins S(X): floor(X/n) takes about 2 sqrt X values, so D
constraints with D well above sqrt X determine the block sums. So the dichotomy "full level: vacuous; restricted
level: factor 2 lost" is wrong on both sides of the boundary. The correct statement is that the restricted-level
positivity cut is the half-weight Legendre/Chebyshev LP of r3-legendre-dual-lp, whose gap is not parity-limited and
whose polylog bound (DR) is RH-hard by that file's Theorem S and Proposition 4.1.

Consequence: the sentence "the Legendre positivity cut is ... parity-capped on any restricted one" must be removed.
The obstruction for this lane is not parity; it is that the gap of the Chebyshev LP at polylog precision is the
target. The LP gap at D = sqrt X (2.1, 3.3, 7.1 at X = 1e4, 1e5, 1e6) is a measured quantity the RESULT does not
have and wrongly rules out. This does not give anything toward RH; it removes a false closure.

### E2. Theorem R(ii): "its only dual certificate is Mobius inversion" is false when Lambda >= 0 is in the programme

With x >= 0 the dual is {y : A^T y >= 1}, and optimal y need equality only on the support of Lambda. At every n that
is not a prime power the constraint may be slack. Check (dual.py, N = 30): a second optimal dual with value
8.32022948483934 (= S(30) = 8.32022948483936), slack 120.4 at n = 6, distance 50.9 from the Mobius dual. The value
statement (no gap) stands; the uniqueness statement holds only when positivity is not used. The optimal face has
dimension equal to the number of non-prime-powers <= X.

### E3. Mass ratio "5 to 8" contradicts the table

kappa'_abs / kappa_abs from the RESULT's own files: 7.57 (1e5), 10.31 (1e6), 8.00 (1e7), 5.31 (1e8), 7.38 (1e8, h).
New cases: 8.36 (X = 3000000.5, U = 70), 10.44 (X = 20000003, U = 300). Range is 5.3 to 10.4.

"Growth about X^{0.44}": local exponents between consecutive rows are 0.63, 0.37, 0.31, so no exponent is measured.
The mass is 2 sqrt X (abs c2 /3 + abs c3 /6 + abs(c2 + c3)/6) plus the untuned mass (checked at X = 1e8: 35680 +
remainder against 40168), i.e. order sqrt X times a factor that follows M_U(1/2) (c2 = 4.31, 5.86, 4.33, 2.72 in the
four rows). 0.44 is a fit through that fluctuation. The RESULT states "order sqrt X" in the same sentence; the
exponent should be 1/2.

### E4. "bounded by 4.7e-7 at X = 1e32, by proof"

4.7e-7 is Q(U)(4 + log X)/sqrt X with the unproved constant 4 (script comment and code use 4). With the proved
constant 6: 4.84e-7 using Q(1e8) = 60792694. The closed form quoted in the claim, (U + 32 sqrt U + 25)(6 + log X)/sqrt X,
gives 7.99e-7. The whole "bound at top of decade" column of the second table has the same factor. The RESULT flags
this for the first table only. Size of the error: 2.6 percent; no conclusion changes.

### E5. Remark 2.4 (order k >= 2)

"A'(1)^k = 1 in place of M'(1) = 0": with M'(1) = 0, A'(1) = 1 - dM'/ds(1), which is not 1 in general. The Type-I
terms zeta' zeta^{j-1} M'^j keep a simple pole at s = 1 for every j (order j+1 pole against order j zero), so the
number and form of the conditions for k >= 2 is not established. Labelled ARGUED; not used elsewhere.

### E6. Beurling row

"the error in Prop. G is at least of order X^{theta - 1/2}" is an upper-bound size, not a proved lower bound; it
depends on the system. Should read "is not known to be smaller than".

## 3. Controls

No zeta-only mechanism is claimed, and the RESULT states correctly that the proved steps do not separate zeta from
E_a or structured TW+. One control was run (the RESULT ran none):

TW+ with eps_n = (1 + cos(a log n))/2, same gauge-fixed kernel (U = 70), remainder recentred at 1 only:

| a | X = 1000000.5 | 2000000.5 | 3000000.0 | sqrt X / abs(1/2 + ia) at 3e6 |
|---|---|---|---|---|
| 14.134725 | 3.90 | -23.96 | -0.007 | 122 |
| 5.0 | 147.5 | -351.8 | -243.9 | 345 |
| 1.0 | 27.4 | -101.6 | -202.2 | 1549 |
| 0.3 | -63.4 | -54.5 | -40.6 | 2970 |

and -169.9 at X = 20000003, U = 300, a = 14.134725. The forcing-free property fails for the twisted sequence with an
oscillating term of amplitude about sqrt X abs(zeta(1+ia) M'(1+ia)) / (2 abs(1/2+ia)), as the row says. (The -0.007
entry is a zero crossing of that oscillation, not a cancellation; not investigated further.) The E_a, Beurling and
DH rows were checked by reading only: c_E * Lambda_E = c_E log is correct; DH has no Lambda >= 0, so only Landau
excludes it.

## 4. Other checks

- Assumes RH: no. The M_U(1/2) range and c2, c3 sizes are labelled MEASURED.
- Restates verified height: no.
- Known theorem presented as new: no; RESULT says every step is elementary. Normalising a mollifier by M'(1) = 0 is
  standard. The missing known theorem is Chebyshev's method (and Diamond-Erdos for constants near 1), which is what
  E1 is.
- Not re-run: closed_form_1e32.py (1e8 sieve), the 27024 sign-change count, the increment form 2.3, the comparison
  with the source referee's ratios 0.34 to 0.41 (still unreconciled, as the RESULT says).

## 5. Surviving claim

For any finitely supported mu' on [1, D] and X >= D: sum_m (1 * mu')(m) m^{-1/2} R(X/m) =
-(4 + 2 gamma) sqrt X M'(1) - zeta'(1/2) M'(1/2) + E, abs E <= norm mu'_1 (6 + log X)/sqrt X. Hence with two linear
conditions R(X) = K'_X[R] + Xi', abs Xi' <= (U + 32 sqrt U + 25)(6 + log X)/sqrt X (7.99e-7 at X = 1e32; 4.84e-7
with Q(U) in place of U). The Vaughan X^{1/4} forcing is a normalisation. The kernel symbol is 1 at every zero. The
kernel absolute mass is of order sqrt X (5.3 to 10.4 times the untuned mass in seven measured cases). At full level
the (Leg) system has the single solution Lambda, so positivity adds nothing there. A one-sided polylog bound on
K'[R] is equivalent to RH. Positivity is used only in Landau's lemma. E_a and structured TW+ are not excluded by any
proved step.

Not surviving: the parity cap at restricted level (false; six levels and positivity give 2.32 sqrt X, and the LP
is exact at D = X^{0.7} for X = 1e4, 1e5); uniqueness of the dual certificate; "5 to 8"; "X^{0.44}"; "4.7e-7 by
proof". The restricted-level positivity cut is the half-weight Chebyshev/Legendre LP, an open quantity whose polylog
bound is RH-hard by r3-legendre-dual-lp, not a closed parity case.
