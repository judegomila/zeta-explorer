# e1-forcing-free-bilinear-split: RESULT

Combination: `vaughan-sqrt-type1-exact` x `vaughan-forcing-law` x `landau-one-sided-target` x `legendre-lcm-identity`.
Source proposal: `formalization/rh-attempts/2026-11-01-r3-synthesis.md` section 4 item 4 (never run before).

**Verdict: precise obstruction.** The first decisive test passes, and passes for a trivial reason: the X^{1/4}
forcing is removed exactly by two linear conditions on the mollifier (Proposition G, Corollary F; unconditional,
|Xi'| <= (U + 32 sqrt U + 25)(6 + log X)/sqrt X, which tends to 0 for U = X^{1/4}). The forcing was a choice of
normalisation, not an obstruction. Removing it changes nothing at the zeros (the operator symbol is still exactly 1 at
every zero, on or off the line), multiplies the absolute mass of the kernel by 5 to 8, and shows that every identity
of this shape is a linear combination of one exact identity (half-weight Legendre). On that system the positivity
Lambda >= 0 is implied, so it cuts nothing (Theorem R). The one-sided bound on the bilinear term is still Theorem OS
of the source: equivalent to RH. No new information about zeros. RH open. NO QED.

Grades: PROVED (complete argument here; author only, unrefereed), CLASSICAL, MEASURED (IEEE double), ARGUED, OPEN.

## 1. Plan and what is new relative to the source

Notation of the source: S(X) = sum_{n<=X} Lambda(n) n^{-1/2}, R(X) = S(X) - 2 sqrt X (R = 0 on (0,1)),
M_U(s) = sum_{d<=U} mu(d) d^{-s}, m(U) = M_U(1). Source renewal: R = Xi + K_X[R] + O(1) with
Xi = -2 sqrt X m(U) eps_1(V) + ..., of size X^{1/4}.

1. First lemma: a split whose forcing is free of the X^{1/4} term, with explicit error (section 2).
2. First decisive test: size of the new forcing Xi' up to X = 1e32 (section 3).
3. If it passes: bound the residual operator one-sidedly using Lambda >= 0 and the Legendre cut (section 4).
4. Controls (section 5).

New relative to the source: Proposition G (general forcing formula for any finitely supported mollifier), Corollary F
(forcing-free gauge with explicit unconditional error), the increment form (section 2.3), Theorem R (the family is the
span of the half-weight Legendre identity; positivity is implied on it), and the measured mass cost. The source's
Theorems C, CS0, J, OS are used unchanged. Nothing here is claimed as novel mathematics: every step is elementary.

Deviation from the assignment: the assignment suggested Heath-Brown order k = 2 or 3. Order k = 1 with an adjusted
mollifier already removes the forcing exactly, so k = 1 was used; k >= 2 is covered by Remark 2.4 (ARGUED).

## 2. Work: the forcing-free split

### 2.1 Proposition G (forcing of an arbitrary Type-I gauge; PROVED)

Let mu' be supported on [1, D], M'(s) = sum_d mu'(d) d^{-s}, c = 1 * mu', ||mu'||_1 = sum |mu'(d)|. For X >= D:

    sum_{m<=X} c(m) m^{-1/2} R(X/m) = -(4 + 2 gamma) sqrt X M'(1) - zeta'(1/2) M'(1/2) + E,
    |E| <= ||mu'||_1 (6 + log X) / sqrt X.

Proof. The left side is sum_d mu'(d) d^{-1/2} W(X/d) with W(y) = sum_{b<=y} b^{-1/2} R(y/b). Since 1 * Lambda = log,

    (Leg)   sum_{b<=y} b^{-1/2} S(y/b) = sum_{k<=y} k^{-1/2} log k        (exact, every real y >= 1),

so W(y) = sum_{k<=y} k^{-1/2} log k - 2 sqrt y H(y), H(y) = sum_{k<=y} 1/k. Lemma 2.1 of the source gives
|sum_{k<=y} k^{-1/2} log k - 2 sqrt y log y + 4 sqrt y + zeta'(1/2)| <= y^{-1/2}(2 + log y), and
|H(y) - log y - gamma| <= 2/y for y >= 1. Hence W(y) = -(4 + 2 gamma) sqrt y - zeta'(1/2) + e(y),
|e(y)| <= y^{-1/2}(6 + log y). Sum over d with y = X/d >= 1. QED.

The forcing of every split of this shape is therefore two numbers: M'(1) (coefficient of sqrt X) and M'(1/2)
(constant). In Mellin form these are the residues at s = 1/2 and s = 0 of zeta M'(s + 1/2) times the transform of R.

### 2.2 Corollary F (forcing-free gauge; PROVED, unconditional)

Take mu' = mu_{<=U} - c2 delta_2 - c3 delta_3 with c2/2 + c3/3 = m(U) and c2/sqrt2 + c3/sqrt3 = M_U(1/2). Then
M'(1) = M'(1/2) = 0, c(1) = 1, and with a'(m) = a_U(m) + c2 [2|m] + c3 [3|m] (m >= 2), a_U = mu_{>U} * 1:

    R(X) = K'_X[R] + Xi'(X),   K'_X[r] = sum_{2<=m<=X} a'(m) m^{-1/2} r(X/m),
    |Xi'(X)| <= (Q(U) + |c2| + |c3|)(6 + log X)/sqrt X <= (U + 32 sqrt U + 25)(6 + log X)/sqrt X.

(Q(U) = number of squarefree d <= U; |c2| + |c3| <= 25 |m(U)| + 16 |M_U(1/2)|, |m(U)| <= 1, |M_U(1/2)| <= 2 sqrt U.)
So Xi' = O(1) for every U <= sqrt X / log X and Xi' -> 0 for U = X^{1/4}. No hypothesis is used.

The removed forcing has not disappeared. It is the non-oscillating part c2 [2|m] + c3 [3|m] of the kernel, whose
action on R is c2 W(X/2)/sqrt2 + c3 W(X/3)/sqrt3, i.e. two instances of (Leg). Forcing-free means: the forcing is
written as a Legendre identity inside the operator.

### 2.3 Increment form with the Vaughan truncation (MEASURED; proof sketch ARGUED)

With V = U and the source's truncation m <= X/V:

    R(X) - R(V) = sum_{2<=m<=X/V} a'(m) m^{-1/2} (R(X/m) - R(V)) + O(1).

Sketch: the partial sums P(Y) = sum_{m<=Y} a'(m) m^{-1/2} equal 1 - 2 sqrt Y M'(1) - zeta(1/2) M'(1/2) + O(||mu'||_1/sqrt Y)
= 1 + O(U/sqrt Y); summation by parts against R on [1, V] (total variation <= 4 sqrt V + O(1)) gives an error
O(UV/sqrt X). The same computation with the untuned mu_{<=U} gives the source's forcing (residual 26.58 at X = 1e8
against the source's Xi + R(V)-terms 23.50 + 3.10).

### 2.4 Remark (Heath-Brown order k >= 2; ARGUED)

For order k the operator symbol is A'^k with A' = 1 - zeta M'. If M'(1) != 0, A' has
a simple pole at 1 and A'^k a pole of order k: the forcing contains sqrt X m(U)^j (log X)^{j-1}, j <= k, no smaller
than for k = 1. If M'(1) = 0, A' is entire and the forcing vanishes under the same two conditions as in Corollary F
(with A'(1)^k = 1 in place of M'(1) = 0 at the second step), but the Type-I sums then involve divisor functions and
their errors are of divisor-problem type, which restricts the mollifier length (about z <= X^{1/8} for k = 2 with
exponent 1/3). At every k, A'(rho)^k = 1 at every zero. Higher order buys nothing that k = 1 does not have.

## 3. First decisive test (MEASURED; consistent with the proof)

Direct check from prime data (`verify_gauge.py`; Lambda sieved to X, kernel a' built to X, no closed form used):

| X | U | Xi' (gauge-fixed) | bound (constant 4) | untuned forcing, V = 1 | prediction of Prop. G | kappa'_abs | kappa_abs untuned |
|---|---|---|---|---|---|---|---|
| 1e5 | 18 | -0.0443 | 1.12 | -5.807 | -5.794 | 1953 | 258 |
| 1e6 | 32 | -0.0342 | 0.62 | 319.259 | 319.277 | 8351 | 810 |
| 1e7 | 56 | -0.0038 | 0.29 | 23.183 | 23.182 | 19695 | 2463 |
| 1e8 | 100 | -0.0036 | 0.15 | -1606.142 | -1606.140 | 40168 | 7559 |
| 1e8 | 542 (= sqrt X/log X) | -0.0007 | 0.76 | -256.040 | -256.041 | 51718 | 7007 |

(kappa_abs = sum |kernel(m)| m^{-1/2}. The bound column was computed with constant 4 instead of the proved 6;
multiply by at most 1.15.) Increment form (2.3): residual -0.022, -0.031, -0.012, -0.006 at X = 1e5..1e8 with
U = V = X^{1/4}; untuned residual 8.89 at 1e6 and 26.58 at 1e8.

Closed form for every U <= 1e8, X = U^4 <= 1e32 (`closed_form_1e32.py`; mu and Lambda sieved to 1e8):

| X decade | max abs Xi (untuned Vaughan, leading formula of source Prop. 3.1) | max abs Xi / X^{1/4} | M_U(1/2) range | max abs c2, c3 | bound on abs Xi' at top of decade |
|---|---|---|---|---|---|
| 1e4..1e8 | 34.2 | 0.36 | [-1.04, -0.28] | 5.9, 9.0 | 0.15 |
| 1e8..1e12 | 232 | 0.54 | [-1.11, -0.22] | 6.7, 10.1 | 2.0e-2 |
| 1e12..1e16 | 3554 | 0.55 | [-1.12, -0.25] | 6.9, 10.4 | 2.5e-3 |
| 1e16..1e20 | 3.91e4 | 0.63 | [-1.14, -0.24] | 7.1, 10.7 | 3.0e-4 |
| 1e20..1e24 | 3.11e5 | 0.59 | [-1.12, -0.24] | 7.0, 10.5 | 3.6e-5 |
| 1e24..1e28 | 3.47e6 | 0.49 | [-1.08, -0.26] | 6.8, 10.2 | 4.2e-6 |
| 1e28..1e32 | 3.06e7 at U = 76019521 | 0.65 | [-1.15, -0.28] | 7.2, 10.8 | 4.7e-7 |

Cross-check with the source referee: max |Xi| = 3.07e7 at U = 76019521 (here 3.06e7 at the same U, from the leading
formula only). The ratio column is the maximum of |Xi|/U over the decade and is larger than the referee's 0.34 to
0.41; the two were not reconciled (different statistic or the O(1) terms at small U).

Answer to the test: Xi' is not merely polylogarithmic; it is bounded by 4.7e-7 at X = 1e32 and tends to 0, by proof.
R itself stays in [-3.44, -1.96] for arguments up to 1e8. The gauge coefficients c2, c3 stay below 11 because
M_U(1/2) stays in [-1.15, -0.22] (MEASURED; not known to be bounded, not known to be polylogarithmic even on RH).

A second forcing-free gauge without adjusted coefficients: cut the mollifier at a sign change of m(U), where
|m(U)| <= 1/U. There are 27024 sign changes below 1e8 and consecutive ones above 100 differ by a factor at most 1.24
(MEASURED). This removes the sqrt X term up to (4 + 2 gamma) sqrt X / U and leaves the constant -zeta'(1/2) M_U(1/2).

## 4. The residual bilinear operator: where the combination stops

### 4.1 The symbol at the zeros is unchanged (PROVED)

A'(s) = 1 - zeta(s) M'(s) is entire (M'(1) = 0) and A'(rho) = 1 at every zero rho of zeta, whatever Re rho is.
This is the source's Theorem C for the new kernel; its Corollary C1 applies verbatim: K' reproduces every zero mode
y^{rho - 1/2} with factor exactly 1, so K' is not a contraction on R in any norm in which those modes are bounded, and
the identity R = K'[R] + o(1) holds for every configuration of zeros. Gauge fixing cannot change this: the value
at rho is 1 for every mollifier.

### 4.2 Theorem R (the family is one identity; positivity is implied on it; PROVED)

(i) Every identity of Proposition G, at every X and every mu', is the linear combination
sum_d mu'(d) d^{-1/2} (Leg at y = X/d) minus an explicit sum. Vaughan's split and the gauge-fixed split are two
members; the difference between them is two multiples of (Leg).

(ii) On integers j <= N the system (Leg) is unitriangular in the unknowns x_n = Lambda(n) n^{-1/2}:
(Leg at j) - (Leg at j-1) reads sum_{n | j} x_n (j/n)^{-1/2} = j^{-1/2} log j. Its only solution is the true Lambda.
Hence Lambda >= 0 is a consequence of the system, the linear programme "maximise S(X) subject to (Leg) at all levels
and Lambda >= 0" has value S(X) with no gap, and its only dual certificate is Mobius inversion at full level X:
R(X) = -(4 + 2 gamma) sqrt X m(X) - zeta'(1/2) M_X(1/2) + sum_{d<=X} mu(d) d^{-1/2} e(X/d). That is the Mertens problem at
square-root precision plus a Mobius-weighted sawtooth sum of trivial size sqrt X log X. This is the half-weight
form of the `legendre-lcm-identity` node (every dual point has total mass psi(x)).

(iii) If (Leg) is used only at levels y = X/d, d <= D, with Lambda >= 0, the certificate is a Type-I majorant and is
capped at (4 - o(1)) sqrt X for D <= X^{1-eps} (round-2 Stepanov Theorem P; imported, not re-proved here).

(iv) Using the gauge-fixed renewal at every X' <= X (induction) uses (Leg) at all levels, so case (ii) applies:
there is no slack for positivity to remove.

So the Legendre positivity cut has two regimes on the combined quantity: restricted level, where it is active and
loses the parity factor 2; full level, where it is vacuous.

### 4.3 What a one-sided bound would need (OPEN; equivalent to RH)

To bound K'_X[R] from above using only Lambda >= 0 one has the monotonicity of S. The kernel a' takes both signs and
its absolute mass is kappa'_abs = 1953, 8351, 19695, 40168 at X = 1e5..1e8 (growth about X^{0.44}; 5 to 8 times the
untuned mass, because the non-oscillating part c2 [2|m] + c3 [3|m] has mass of order sqrt X). Monotonicity therefore
gives a bound of size kappa'_abs sup|R|, worse than trivial. Any bound K'_X[R] <= C (log X)^m gives
R(X) <= C (log X)^m + o(1), which is (star) of the source, hence RH by Landau (source Theorem 1.1); conversely RH gives
it. This is Theorem OS for the new split, with the additive constant improved from 2 to o(1). The Type-II range is
where all primes enter jointly, and the statement needed there is exactly the target.

### 4.4 Where positivity enters

Only in Landau's lemma (source Step 1): Lambda >= 0 turns a one-sided bound for R into a half-plane of holomorphy.
In Proposition G, Corollary F and Theorem C nothing is used except 1 * Lambda = log and Euler-Maclaurin on the
integers. In the bilinear step positivity has no handle: on the full system it is implied (Theorem R(ii)), on a
restricted system it loses a factor 2 (Theorem R(iii)).

### 4.5 The three requirements

| requirement | status in this combination |
|---|---|
| uses all primes together | yes, in K'_X[R] only (Type-II range); the identity itself uses them only through 1 * Lambda = log |
| uniform in height, every window | the target is one-sided and uniform in X; nothing uniform is proved about K' |
| fails for controls for a structural reason | the proved steps do not separate zeta from E_a or structured TW+ (section 5) |

## 5. Controls

All rows ARGUED from the proofs above; none was computed.

| control | Prop. G / Cor. F (identity, forcing-free) | Landau step | outcome |
|---|---|---|---|
| TW+ (eps_n Lambda, 0 <= eps_n <= 1) | fails at the first line: 1 * (eps Lambda) is not log, so (Leg) is lost and the Type-I sums are not explicit. For structured eps (for example (1 + cos(a log n))/2) a twisted Legendre identity holds with main terms at 1 and 1 +- ia, and the renewal holds for the recentred remainder only | holds (Lambda >= 0 kept) | failing step named: the Type-I evaluation. The stated target is false; the identity never produces it |
| TW- (signed eps_n) | as TW+ | fails (no positivity) | two failing steps |
| Beurling | 1 * Lambda_B = log holds on the generalised integers, but Lemma 2.1 fails: with N(x) = x + O(x^theta), theta > 1/2, the error in Prop. G is at least of order X^{theta - 1/2}; the forcing is not O(1) | holds | failing step: Euler-Maclaurin on the integers |
| E_a = zeta(s+a) zeta(s-a) | holds in adjusted form: c_E * Lambda_E = c_E log exactly; main terms at 1 +- a; the forcing is removed by conditions at 1 +- a and 1/2; the Type-I error is of divisor-problem type, not O(y^{-1/2} log y) | holds (Lambda_E >= 0) | NOT excluded by any proved step. The recentred target is false for E_a (zeros at 1/2 +- a), so the missing bilinear bound is the step that must separate E_a from zeta, and it must use the size normalisation; nothing in this combination does |
| DH | formal identity with the coefficients of 1/L_DH; A = 1 at every zero including the off-line ones | fails (no Lambda >= 0) | excluded only by Landau, as in the source |

## 6. Why the combination stops, in one statement

The forcing is removable exactly, so it was never the obstruction. After removal the equation R = K'[R] + o(1) is a
restatement of 1 * Lambda = log with unit symbol at every zero; it is true for every zero configuration. The Legendre
positivity cut is implied by the full system and parity-capped on any restricted one. What remains is a one-sided
polylogarithmic bound for a bilinear sum of absolute mass about X^{0.44}, which is RH (Theorem OS). No pivot was
taken: the adjacent combinations found (higher Heath-Brown order, cutoff at sign changes of m(U), increment form)
have the same symbol and the same stop.

## 7. Three weakest steps

1. Proposition G and Corollary F are author-proved and unrefereed. The direct numerical check reaches X = 1e8 only;
   the X = 1e32 rows are the closed-form bound evaluated with sieved m(U), M_U(1/2), not an independent check. The
   increment form (2.3) is measured with a sketched proof.
2. Theorem R(iii) imports round-2 Theorem P without re-proving it, and Theorem R covers only linear use of
   Lambda >= 0 on (Leg). Non-linear uses of positivity (quadratic forms in Lambda, Cauchy-Schwarz with a positive
   weight, levels between X^{1-eps} and X) are not covered here; the source's Theorems CS0 and J cover the
   Cauchy-Schwarz and dispersion cases for the untuned kernel and were not redone for a'.
3. The control rows and Remark 2.4 (order k >= 2) are argued, not computed. The discrepancy with the referee's
   decade ratio 0.34 to 0.41 (here 0.36 to 0.65 from the leading formula) was not resolved.

## 8. Files

- `verify_gauge.py`, `verify_{q,h}_1e+05..1e+08.json`: direct check of Corollary F and the increment form.
- `closed_form_1e32.py`, `closed_form_1e32.json`: all U <= 1e8.
- Runs: local, through `scripts/memcap.sh 8`; a first version of the second script exceeded the cap and was
  rewritten in chunks (peak about 4 GB). The local numpy venv was removed after the runs. The compute server was not used.
