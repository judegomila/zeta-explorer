# REFEREE: e2-legendre-riesz-level-phase

Referee verdict: **the claimed verdict (precise obstruction, no proof of RH, no zero information) holds.**
Every PROVED step was re-derived and confirmed. The MEASURED statements were reproduced with an independent
implementation at cases the author did not run. Seven corrections are listed in section 4; none changes the verdict.
Nothing in the result assumes RH without saying so, restates verified height, or presents a known theorem as new
(the author states that every step is elementary and that the equivalence is a reformulation).

Referee code was run from a scratch directory (/tmp/ref_e2, not kept in the repo), through `scripts/memcap.sh 8`,
with the lane's venv. It does not import `lrlib.py`: dense matrices, all rows n = 2..X, no cutting planes.
The compute server was not used.

## 1. PROVED steps, re-derived

**2.1 Certificate inequality. Confirmed.** sum_n Lambda(n) f(nd/X) = sum_m log m (1 - md/X)_+^k / k!
= (d/X)^k T_k(X/d) by 1 * Lambda = log; f(nd/X) = 0 for nd > X, so only n <= X enters; Lambda >= 0 and Lambda(1) = 0
give V(c) >= psi_k(X)/X^k. c = mu on d <= X gives equality at every n (Moebius inversion in m = bd).
Numerical identity residual (referee): 7e-13 at X = 1500, k = 1.

**2.2 Sawtooth. Confirmed.** Residues of -zeta'(s) y^(s+k)/(s(s+1)...(s+k)): at s = 1 (double pole)
y^(k+1)(log y - H_(k+1))/(k+1)!; at s = -j, (-1)^(j+1) zeta'(-j) y^(k-j)/(j!(k-j)!), using
prod_{i != j}(i - j) = (-1)^j j!(k-j)!. b_k = 1/2, 1/12, sqrt3/216 are sup|B_(k+1)|/(k+1)! on [0,1]. For k = 1 the
O(1/y) part of s_0 is B_2({y})/(2 floor y) to leading order, which has mean zero over a period, so its integral
converges and the constant is the residue constant; no extra log y term appears. Referee check in 40-digit
arithmetic, 64 fractional parts, y in [1, 600): max(|s_k| - b_k log y) = 0.0811, 0.0035, 0.0037 (k = 0, 1, 2), all
attained at y = 1; on [20000, 20300): 4e-6, 1e-11, negative. The constant 0.1 is valid on the ranges tested.

**Main(c) and N(c) formulas. Confirmed.** N(c) <= (b_k log X + 0.1) max|c| D^(k+1)/X^k; below sqrt X for
theta < (2k+1)/(2k+2).

**4.1 Floor. Confirmed (classical).** Mellin transform of psi_k(x) x^(-s-k-1) on [1, inf) is
-zeta'/zeta(s)/(s(s+1)...(s+k)), residue 1/(k+1)! at s = 1. If the excess is <= C x^alpha for large x with
0 < alpha < 1, Landau's lemma applied to C x^(alpha+k) - (psi_k - x^(k+1)/(k+1)!) >= 0 gives holomorphy in
Re s > alpha because the only real singularities are at alpha and at s = 0, -1, ..., -k (zeta has no zero in (0,1)).
Hence alpha >= Theta. The step needs alpha > 0, which is the case of interest.

**4.2 Theorem U. Confirmed, line by line.**
- R(n) = sum_b sum_{D<d<=X/(nb)} mu(d)(1 - bnd/X)^k/k!; the weight is nonnegative, decreasing in d, <= 1/k!; Abel
  gives |inner sum| <= (2/k!) M*(X/(nb)).
- sum_{b<=B} b^(-kappa) <= B^(1-kappa)/(1-kappa) for B >= 1, so |R(n)| <= (2K/(k!(1-kappa)))(X/n) D^(kappa-1);
  R(n) = 0 for n > X/D.
- f(n/X) >= (X/n)(1 - n/X)^(k+1)/(k+1)! (sum of a decreasing function against its integral) >= (X/n) 2^(-k-1)/(k+1)!
  for n <= X/2. The stated eta = 2^(k+2)(k+1) K D^(kappa-1)/(1-kappa) is exactly what eta f(n/X) >= |R(n)| needs.
- V(c) - psi_k/X^k = eta tau(1) - sum Lambda(n) R(n); tau(1) <= X log X/(k+1)!; sum_{n<=X/D} Lambda(n)/n <= log X + O(1).
- Main + N <= V + 2N and N(c) <= (b_k log X + 0.1)(eta + D^(k+1))/X^k, inside the stated bound.

Referee numerical check with the PROVED eta (the author checked only the minimal eta), X = 2700, K = 1.000 for both
kappa = 0.5 and 0.7, k = 0, 1, 2, theta = 0.3, 0.6, 0.9: |R(n)| <= bound at every n; R(n) = 0 beyond X/D (<= 4e-13);
certificate feasible (min slack >= 0; exactly 0 at n = X for k >= 1 where r(X) = 0); (V - truth) divided by
K X D^(kappa-1)(log X + 1)/(1-kappa) = 3.07 to 3.10 (k = 0), 5.74 to 5.75 (k = 1), 5.45 (k = 2), independent of theta
and kappa. So C_k <= about 6 on this case, consistent with C_k ~ 2^(k+2)/k!. The proved eta exceeds the minimal eta
by factors 20 to 10^4: the theorem is correct and loose.

**4.3 Sandwich. Confirmed.** max(1 - theta(1-Theta), theta(k+1) - k) is minimised where the two are equal:
theta = (k+1)/(k+2-Theta) <= 1, value (1 + k Theta)/(k+2-Theta) = Theta + (1-Theta)^2/(k+2-Theta) (algebra checked).
Theta = 1/2 gives (k+2)/(2k+3) = 2/3, 3/5, 4/7. The equivalence: (<=) is the floor (any single (k, theta) with
exponent 1/2 + eps for every eps suffices); (=>) is Theorem U with kappa -> 1/2. It is a reformulation, as the
author says: the upper bound takes M(y) << y^(Theta+eps) as input.

## 2. Numeric checks rerun on different cases

Independent dense LP, all rows, X = 2700 (not in the author's grid):

| k | theta = 0.4 | 0.5 | 0.6 | 0.7 | 0.85 |
|---|---|---|---|---|---|
| 0, gap/sqrt X | 3.98 | 1.64 | 3e-14 | 2e-14 | 2e-14 |
| 1 | 0.131 | 0.0727 | 2e-13 | 4e-13 | 0 |
| 2 | 0.00804 | 0.00473 | 7e-14 | 1e-13 | 1e-14 |

Pinning to psi_k(X)/X^k at D >= X^0.6 = 2.2 sqrt X is reproduced for k = 0, 1, 2, and the unpinned values at
theta <= 1/2 fall between the author's X = 1e3 and 1e4 rows.

LP-R at X = 2700 (referee): robust gap/sqrt X = 0.0268 (k = 1, theta = 0.7), 0.0209 (k = 1, theta = 0.8),
0.0016 (k = 2, theta = 0.7); |tau(d) - Main term| <= penalty at every d (max ratio 0.87 and 0.29), so
LP-R >= LP-E holds on this case. Consistent with the author's tables.

Fits recomputed from the stored JSON (some JSON files hold fewer points than the logs): k = 0, theta = 0.5:
0.707 +- 0.013; k = 0, theta = 0.7: 0.536 +- 0.007; k = 1, theta = 0.6: 0.61 +- 0.03; k = 1, theta = 0.8: 0.52 +- 0.04.

## 3. Controls rerun (X = 1500, k = 1, all rows, independent code)

| control | theta | Lambda_w | result |
|---|---|---|---|
| zeta | 0.7 | >= 0 | LP - truth = 2e-11 |
| E_a, a = 0.15 | 0.5 / 0.7 | >= 0 | 25.0 (not pinned) / 3e-11 (pinned) |
| E_a, a = 0.3 | 0.5 / 0.7 | >= 0 | 45.6 / 4e-11 |
| Liouville | 0.5 / 0.7 / 0.9 | 248 negative values | infeasible / unbounded / unbounded |
| Davenport-Heilbronn | 0.5 / 0.7 / 0.9 | 360 negative, min -20 | unbounded at all three |
| chi_4 (referee addition) | 0.7 | 126 negative | unbounded |

The author's control statements are confirmed: E_a passes every step with new values of a; DH and Liouville fail
at Lambda_w >= 0. The identity w * Lambda_w = w log holds for all of them (residual <= 6e-14), so the only failing
step is the sign.

## 4. Errors and corrections

1. **The DH failure is not a zeros-off-the-line discriminator (strengthens "third requirement not met").** The
   referee ran L(s, chi_4), which has an Euler product: Lambda_w = chi_4 Lambda is signed and the LP is unbounded
   exactly as for DH. The step Lambda_w >= 0 rejects every system with a signed von Mangoldt function, with or
   without Euler product. Together with E_a passing, the method separates systems by the sign of Lambda_w and
   returns Theta of whatever is fed in; it has no step tied to the location of zeros. The controls table should say
   this for DH rather than leave "fails for DH" reading as a structural separation.
2. **"LP unbounded" is level-dependent.** Liouville at theta = 0.5 (D = 39, X = 1500) is infeasible, not unbounded.
   The row should read "infeasible or unbounded, depending on the level".
3. **Code gap in `lrlib.solve` for the controls.** It returns HiGHS status 3 from the initial row subset without
   adding rows; unboundedness on a subset of constraints does not imply unboundedness of the full LP. The referee's
   full-row runs confirm the DH and Liouville verdicts at theta = 0.7, so the reported result stands, but the
   author's run did not establish it.
4. **E_a wording assumes RH.** "The truth has zeros on Re s = 1/2 + a ... the LP returns 1/2 + a ... Theta_E = 1/2 + a"
   should read Theta_E = Theta + a (>= 1/2 + a unconditionally). Same in the summary line "returns 1/2+a".
5. **Sections 3.2 and 3.4 state pinning without its grade.** "For theta > 1/2 (large X) the exact LP value is
   psi_k(X)/X^k" and "LP-E equals psi_k(X)/X^k for theta > 1/2" are MEASURED for X <= 1e6 (k = 2: X <= 1e4) with an
   ARGUED mechanism; boundedness of D*/sqrt X is not established (the k = 2 ratio rises 1.75 -> 2.15). The header
   and section 6 carry the grade correctly; these two sentences do not. The consequence "its certified excess is
   O(sqrt X) iff RH" inherits the same grade for the "equals" part; the "iff" itself is classical for psi_k, k >= 1.
6. **Sawtooth constant coverage.** `saw.py` checks |s_k| <= b_k log y + 0.1 only for y < 2e5 (k = 2: y < 2e4) at
   seven fractional parts, and its `np.longdouble` is float64 on this machine (arm64), while LP-R was run with
   y = X/d up to 1e6. The inequality G^R >= G^E at X > 2e5 therefore rests on the asymptotic form (classical
   Euler-Maclaurin, remainder O(1/y)), not on the measurement. The referee's 40-digit check (section 1) supports the
   constant. Theorem U's robust line uses the same constant; its exponent consequence does not depend on it.
7. **"Fitted exponents 0.52-0.53, not distinguishable from 1/2" applies to k = 1, 2 at theta >= 0.7 only.**
   For k = 0, theta = 0.7 the fit is 0.536 +- 0.007 (drift 1.76 -> 2.26 in gap/sqrt X), and for k = 1, theta = 0.6
   it is 0.61. The author's tables show both; the summary sentence should carry the restriction. Minor: in 4.3 the
   max(Theta, .) in the LP-E bound is redundant since 1 - theta(1-Theta) >= Theta for theta <= 1.

Not checked by the referee: the pin thresholds D* of section 3.2 (only pinning at D = X^0.6 was reproduced); runs at
X >= 1e4; the Beurling row (argued by the author, citation from memory); the 74% dual-mass figure.

## 5. What survives

- PROVED and confirmed: the Riesz-order certificate inequality; the sawtooth decomposition; Theorem U; the sandwich
  Theta <= min_theta nu^R_k <= Theta + (1-Theta)^2/(k+2-Theta); the reformulation of RH as an O(X^(1/2+eps)) bound
  for the prime-free LP as k -> infinity. The reformulation has no content toward a zero-free region: its upper half
  takes the size of M(y) as input.
- CLASSICAL and confirmed: the floor at Theta for every certificate.
- MEASURED and reproduced: LP-E equals psi_k(X)/X^k at D >= about 2.2 sqrt X for k = 0, 1, 2 (referee: X = 2700);
  robust gap about 0.02 to 0.03 sqrt X (k = 1) and 0.0016 sqrt X (k = 2) at theta >= 0.7.
- Requirements: (1) all primes together: only through 1 * Lambda = log and Lambda >= 0; (2) uniformity in height:
  not obtained (each LP is at one X); (3) controls: not met. E_a passes every step, and the step that rejects DH
  also rejects chi_4.
- No statement about zeros, no bound changed.
