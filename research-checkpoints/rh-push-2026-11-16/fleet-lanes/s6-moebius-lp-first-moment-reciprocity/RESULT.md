# s6-moebius-lp-first-moment-reciprocity: Legendre-Riesz LP, Route M first moment and Cauchy-Schwarz chain, hole test

Date 2026-11-20. Screening lane, four combinations. Grades: PROVED (complete argument here, author only) /
CLASSICAL / MEASURED (float64 unless stated) / ARGUED / NOT RUN.

## Verdict

Four combinations tested, no survivor.

1. **Legendre-Riesz LP with the object's own Dirichlet inverse.** The LP reads the coefficients w(n), n <= X, and
   the sign (phase) of Lambda_F(n), and nothing else. Once D >= c sqrt X (c = 2.2 for zeta, E_a, T-NR; 5 to 10 for the
   other objects) its value is psi_k^F(X)/X^k for every object for which it is defined (MEASURED, gap below 1e-4 sqrt X,
   for zeta below 2e-9 sqrt X). The exponent statistic is therefore the explicit formula of the object:
   E_a with a = 0.02 differs from zeta by the factor cosh(a log X) (0.6 % at X = 1e3, 9.8 % at X = 1e10; three-digit
   agreement), T-NR at q = 1000003 is identical to zeta below X = q and jumps by c sqrt q log q at X = q. No control
   separates below gamma_off^2. The zeta form of the LP (one-sided, Lambda >= 0) is unbounded for Davenport-Heilbronn
   at X = 1e3 and also for L(chi_-4) and L(chi_5): the step that fails is the sign of Lambda_F, and it fails for the
   positive comparisons as well. With the signs of Lambda_F supplied the LP is pinned for every object, including
   Davenport-Heilbronn.
2. **First moment kappa_F(b).** Gram-only (function of abs(F(1/2+it)) alone; `s2` Lemmas 1 to 3). New cells:
   E_a (a = 0.02, 0.25) and the unimodular twist by quadrature for b <= 40, T-NR at q = 1000003 for b = 127, 251,
   the periodic objects at b = 199999.
   kappa_F(b) > 0 for every b and every object; no sign change of any part on a set of b.
3. **Cauchy-Schwarz chain.** T_F(M) = 2 sum Q_F(b)/b^2 grows like (12 s0_F/pi^2) log M and the Cauchy-Schwarz floor
   like (36 kappa_F^2/pi^2) log M for zeta (b <= 1e6), L(chi_-4), L(chi_5) and Davenport-Heilbronn (b <= 5000); the
   loss tends to s0_F/(3 kappa_F^2) (2.0117, 1.104, 2.050, 1.139). No object grows faster than log. E0(b) =
   Lambda(b)/2 + O(1/b) in closed form.
4. **Hole test.** zeta, L(chi_-4), L(chi_5): no gap above 3.51 mean spacings in 8.5e+04 to 1.7e+06 zeros per object
   and height; the largest certified zero-free stretch is 2.7 spacings. Davenport-Heilbronn has
   zero-free stretches of the critical line up to 9.0 mean spacings at T = 1e6 with max abs(Z) = 12.9 inside (rms
   2.7): every such stretch lies in a window with a deficit of real zeros (off-line pairs inside the window). In
   windows with a full count of real zeros Davenport-Heilbronn has the gap statistics of the L-functions. The
   mollified second moment separates Davenport-Heilbronn through the size of its Dirichlet inverse (not
   multiplicative, coefficients up to 1420 at y = 1e6). The source's factors (38 to 8e7 for holes of 7 to 17
   spacings) concern holes of that length; none occurs in zeta at the sizes reached.

RH content: none. No bound moves.

## 0. Sizes reached, machines, deviations

Server = Linux box through `rhrun` (units `rh-s6-*`, lane total at most 8 cores requested; load average 110 to 120
on 48 threads during the runs). Local = Mac, one process per run, `scripts/memcap.sh 8`.

| computation | size | where |
|---|---|---|
| periodic first and second moment with parts (L(chi_-4), L(chi_5), Davenport-Heilbronn) | b = 199999, every residue | server, 4 cores, 23 min |
| psi_k^F(X), k = 0, 1, 2, nine prime-supported objects, 100 checkpoints per decade | X <= 1e10 (segmented sieve, 80-bit sums); X <= 1e9 independently | server, 1 core, 10 min; local |
| LP-E zeta, D = 2.2 sqrt X | k = 0: X = 1e3 .. 3e6 (1e7: pinned, 3105 s); k = 1: 1e3 .. 3e5 (1e6: HiGHS numerical failure after 2140 s); k = 2: 1e3, 1e4 (1e5: HiGHS numerical failure; 3e5: time limit 800 s) | server and local |
| LP-R zeta, D = 2.2 sqrt X | k = 1: X = 1e3 .. 3e6 (602 s at 1e6); k = 2: 1e3 .. 3e5 (1e6: time limit 800 s); k = 0: 1e3 .. 1e6 | server and local |
| LP-E controls (E_a, T-NR, zeta_Q(i), zeta_Q(sqrt 5)) | X = 1e4 .. 3e5; T-NR X = 9e5, 1.1e6, 1.5e6 | local; server (stopped, see below) |
| LP-E phase-aware (L(chi_-4), L(chi_5), Liouville, random sign, twist, Davenport-Heilbronn with three sign rules) | X = 1e4, 3e4 (all rows); 1e5, 3e5 with cutting planes for chi_-4, chi_5 | local and server |
| Gram entries by quadrature (zeta check, E_a a = 0.02 and 0.25, twist alpha = 1) | every coprime pair with b <= 40; abs(t) <= 3000, step 0.01 | local |
| T-NR q = 1000003, first and second moment | b = 127, 251 (program of `s5`; larger b overflow its 64-bit moduli) | local |
| Cauchy-Schwarz chain | zeta every b <= 1e6; L(chi_-4), L(chi_5), Davenport-Heilbronn every b <= 5000 (arrays of `s5`, read as data) | local |
| E0(b), E1(b) | every b <= 3e6 (float64); primorials to 6469693230 (40 digits) | local |
| hole test: Z_F on the line, two mollifiers | see table T3 (zeta, L(chi_-4), L(chi_5), Davenport-Heilbronn; T = 1e6 .. 1e+12) | server, GPU 1 (cupy, float64); zeta at T = 1e6 also local CPU |

Deviations from the task text.

- X = 1e7 for the LP: reached for k = 0 only (X = 1e7, D = 6958, 11593 rows, 3105 s on the server, gap 1.5e-9 sqrt X). The LP-R run at X = 1e7 (planned matrix 3.4 GB) was ended by the 6 GB memory limit of its unit and was not repeated. For k = 1, 2 the pinned LP at D = 2.2 sqrt X is degenerate (optimal c up to
  1.8e5 at X = 3e5) and HiGHS returns "numerical failure" from X = 1e6 (k = 1) and X = 1e5 (k = 2). The statistic
  does not need the LP beyond the pin: the pinned value is psi_k^F(X)/X^k, which was computed to X = 1e10.
- Hole test, T = 1e12 with 1e5 windows: not reached: 5000 windows for zeta (85001 zeros, 1621 s on the shared GPU) and 2000 for Davenport-Heilbronn (858 s); at T = 1e10: 50000 windows for zeta, 20000 for the other three objects; 1e5 windows at T = 1e6 and 1e8 for all four. The full size at 1e12 needs about 9 GPU hours per object at the measured rate (7.5e8 phase evaluations per second on the shared card). The windows are contiguous (one block per object and height),
  not independent samples.
- Server. Five of my LP units were stopped by me before their lists ended (`rh-s6-zE2`, `-cpos`, `-zE1`, `-zR2`,
  `-csgn`: solver failures as above at the next sizes, or runs past their use), to stay within the lane's cores. The box did not answer ping or ssh for several intervals of minutes during the session; the
  units kept running. `rhrun` refused twice (machine available memory 38 and 43 GB, below request + 40 GB); the
  first GPU job started after that. GPU 1 was shared (100 % utilisation by another job, 52 to 97 GB in use); the
  cupy pool was limited to min(22 GB, 80 % of free memory). All my units were stopped at the end (section 6).
- Backward heat: not formulable in combinations 1 to 3 (no coefficient sequence, no fixed gamma factor; as in `s2`
  section 6 and `e2` section 5) and NOT RUN in combination 4 (no evaluator at heights above a few thousand).

## 1. Combination 1: robust Legendre-Riesz LP with the object's own inverse

Nodes: `legendre-riesz-sandwich-theorem-u`, `legendre-lp-hyperbola-pinning` (source: `e2-legendre-riesz-level-phase`).

### 1.1 Statement tested and survival rule

F(s) = sum w(n) n^-s, w(1) = 1, Lambda_F = w^-1 * (w log), psi_k^F(X) = sum_{n<=X} Lambda_F(n)(X-n)^k/k!.
f_w(t) = sum_{b<=1/t} w(b)(1-bt)^k/k!, tau(d) = sum_{m<=X/d} w(m) log m (1-md/X)^k/k!, r(n) = (1-n/X)^k/k!.

**Lemma A (PROVED).** Let u(n) be a number of modulus 1 or 0 with Lambda_F(n) = abs(Lambda_F(n)) u(n). If c is
supported on d <= D and Re[u(n)(phi_c(n) - r(n))] >= 0 for 2 <= n <= X, phi_c(n) = sum_d c_d f_w(nd/X), then
Re sum_d c_d tau(d) >= Re psi_k^F(X)/X^k. Proof: sum_n Lambda_F(n) f_w(nd/X) = tau(d) (from w * Lambda_F = w log),
so sum_d c_d tau(d) - psi_k^F/X^k = sum_n abs(Lambda_F(n)) u(n)(phi_c(n) - r(n)). QED. For u = 1 this is 2.1 of
`e2`. c = w^-1 on d <= X gives equality at every n. The measure abs(Lambda_F) is feasible for the dual at every D.

LP-E(F; X, D): minimise Re sum c_d tau(d) under the constraints of Lemma A (c real for real w, complex for the
twist). LP-R: the same with the sawtooth of tau(d) replaced by its bound (zeta only, constants of `e2` 2.2).

The LP uses: w(n) for n <= X and u(n). It uses nothing else (PROVED: these are its only data).

Finite consequence that would have had content: the LP value, or its robust version, of a control departing from
zeta's at X below gamma_off^2 (gamma_off = lowest off-line zero), for T-NR at q = 1000003 and E_a at a = 0.02.
Survival = zeta's excess stays O(sqrt X) at every X reached, the L-functions behave like zeta, and each control
departs below the scale that resolves its zeros or for a reason independent of them.

### 1.2 Code and checks

`c1/lp.py` (kernel, cutting planes, phase-aware constraints, optional box and feasibility tolerance),
`c1/objects.py`, `c1/run_e.py`, `c1/run_r.py`, `c1/truth.py`, `c1/analyse_truth.py`, `c1/validate.py`.

1. Identity sum_n Lambda_F(n) f_w(nd/X) = tau(d): relative error <= 4e-14 for nine objects, k = 0, 1, 2 (`validate.py`).
   Lambda_F from the Euler product against Lambda_F from Dirichlet inversion: <= 2e-13. phi_{w^-1} - r: <= 4e-11.
2. Zeta LP-E and LP-R reproduce `e2`: robust gap 0.0284 sqrt X at X = 1e3 and 0.0204 sqrt X at X = 1e5 (k = 1,
   D = X^0.7; `e2` table 3.3: 0.0284, 0.0204).
3. Sieve sums against direct sums at X = 1e3, 1e4, 1e5 (zeta, E_a, chi_5, Liouville; k = 0, 1, 2): <= 5e-10
   absolute. The local run to 1e9 and the server run to 1e10 agree on the common range.
4. Every LP optimum was checked on all n <= X (violations below 1e-9 max abs(c), or below the stated tolerance
   1e-7 for the two-sided systems).

### 1.3 Results in the order of the task

**(i) Premise on zeta.** LP-E at D = 2.2 sqrt X equals psi_k(X)/X^k:

| k | X: (LP - psi_k/X^k)/sqrt X |
|---|---|
| 0 | 1e3: 6e-14; 1e4: -3e-12; 1e5: 5e-12; 3e5: -1e-10; 1e6: -2e-10; 3e6: -1.2e-9; 1e7: 1.5e-9 |
| 1 | 1e3: -9e-14; 1e4: -2e-12; 1e5: -8e-12; 3e5: 1.3e-10; 1e6: solver failure (D = 2.2 sqrt X) |
| 2 | 1e3: 4e-13; 1e4: -6e-12; 1e5: solver failure; 3e5: time limit (800 s) |

The premise (pin at 2.2 sqrt X) holds at every size where the solver returns a vertex. New relative to `e2`:
k = 0 at X = 3e6 and 1e7, and the level 2.2 sqrt X itself for k = 1 to 3e5 (`e2` used X^0.6 and X^0.7).

LP-R at the same level is not pinned and is not O(sqrt X) on the range:

| k | X | D | robust gap / sqrt X | penalty / sqrt X | exact gap of the optimiser / sqrt X | l1 norm of c | where |
|---|---|---|---|---|---|---|---|
| 0 | 1e+03 | 70 | 1.8718 | 1.6878 | 0.5677 | 24.4 | local |
| 0 | 1e+04 | 221 | 2.5830 | 2.5484 | 0.6543 | 97.9 | local |
| 0 | 1e+05 | 696 | 3.2128 | 4.0487 | 0.7251 | 417 | local |
| 0 | 3e+05 | 1205 | 4.8422 | 6.1067 | 1.2859 | 1.02e+03 | local |
| 0 | 1e+06 | 2200 | 5.5084 | 7.3940 | 1.7822 | 2.09e+03 | local |
| 1 | 1e+03 | 70 | 0.0422 | 0.0260 | 0.0204 | 65.8 | local |
| 1 | 1e+04 | 221 | 0.0449 | 0.0301 | 0.0244 | 517 | local, server |
| 1 | 1e+05 | 696 | 0.0598 | 0.0566 | 0.0159 | 7.27e+03 | local, server |
| 1 | 3e+05 | 1205 | 0.1091 | 0.1134 | 0.0183 | 4.24e+04 | local |
| 1 | 1e+06 | 2200 | 0.1255 | 0.1077 | 0.0563 | 1.14e+05 | local, server |
| 1 | 3e+06 | 3811 | 0.1555 | 0.1570 | 0.0523 | 4.74e+05 | server |
| 2 | 1e+03 | 70 | 0.0020 | 0.0005 | 0.0015 | 85.3 | local |
| 2 | 1e+04 | 221 | 0.0033 | 0.0021 | 0.0014 | 1.11e+04 | local, server |
| 2 | 1e+05 | 696 | 0.0034 | 0.0035 | 0.0004 | 3.67e+05 | local, server |
| 2 | 3e+05 | 1205 | 0.0043 | 0.0042 | 0.0006 | 2.69e+06 | local |
| 2 | 1e+06 | 2200 | solver status 1 | | | | local |

For k = 1 the robust gap grows from 0.042 sqrt X (1e3) to 0.156 sqrt X (3e6); the fitted exponent over the range is
0.5 + 0.16 = 0.66 (k = 0: 0.66 on 1e3 .. 1e6; k = 2: 0.63 on 1e3 .. 3e5), single decades between 0.55 and 0.82. `e2` found a flat
0.02 to 0.03 sqrt X at D = X^0.7. Theorem U of `e2` gives exponent <= max(Theta, 1 - theta(1 - Theta)) = 3/4 at
theta = 1/2 (up to logarithms); the level 2.2 sqrt X, where the exact LP is first pinned, is the worst admissible
level for the robust form. This is a statement about the price of the sawtooth, not about zeros. LP-R was not
run for the controls: for T-NR below q it is the zeta LP (PROVED); for E_a the sawtooth of sum_{m<=y} w(m) is a
divisor-problem remainder, not O(log y) (`e2` section 5), so the robust form is not defined with a bounded penalty.

**(ii) L(chi_-4), L(chi_5).** The zeta form (u = 1) is not valid: Lambda_F = chi Lambda changes sign, and the LP
with one-sided constraints is unbounded (HiGHS status "unbounded" for both, k = 0, 1, X = 1e3, 1e4). The comparison
L-functions fail the premise at the same step as Davenport-Heilbronn. With u = chi (two-sided constraints):

| object | u(n) | D = 2.2 sqrt X | D = 5 sqrt X | D = 10 sqrt X |
|---|---|---|---|---|
| L(chi_-4) | chi(n) (no row for even n) | gap 0.10 to 1.8 sqrt X | k = 0: pinned at 1e4, 0.21 sqrt X at 3e4; k = 1: 0.016 to 0.091 sqrt X (1e4 .. 3e5) | pinned (abs(gap) < 7e-7 sqrt X), k = 0, 1, X = 1e4, 3e4, also at 20 and 40 sqrt X |
| L(chi_5) | chi(n) | gap 0.17 to 2.3 sqrt X | pinned k = 1 (1e4, 3e4, 1e5), k = 2 (1e4); k = 0: pinned at 1e4, 0.016 sqrt X at 3e4 | not run |
| zeta_Q(i) = zeta L(chi_-4) | 1 (Lambda(1 + chi) >= 0) | k = 1: pinned (1e4, 1e5); k = 0: 0.069, 0.0044 sqrt X | not run | not run |
| zeta_Q(sqrt 5) = zeta L(chi_5) | 1 | not pinned (0.005 to 2.1 sqrt X) | pinned, k = 0, 1 (1e4, 1e5), k = 2 (1e4) | not run |

"Pinned" for the two-sided systems means abs(gap) below 1e-5 sqrt X with the constraint tolerance 1e-7.
Rigidity (ARGUED; `c1_local_scan.txt`): with two-sided constraints there is no slack variable. On a hyperbola cell
X/(v+1) < n <= X/v the difference phi_c - r is a polynomial of degree <= k in n which must be >= 0 at the n with
u(n) = +1 and <= 0 at those with u(n) = -1; with enough alternations it vanishes identically, which forces
c_d = w^-1(d) for d up to a multiple of sqrt X. For zeta the coefficient c_1 is a slack (the kernel is positive).
The pinned values are psi_k(X, chi)/X^k; their size is in table T1: sup abs(excess)/sqrt X between 0.07 and 0.11
per decade from 1e4 to 1e10 for L(chi_-4) and from 1e5 for L(chi_5) (k = 1), no drift. With the signs supplied the L-functions behave like zeta.

**(iii) E_a = zeta(s+a) zeta(s-a) and T-NR at q = 1000003, c = 2.2.** Both have Lambda_F >= 0 for the X reached
(T-NR: Lambda_F(q) = c sqrt q log q > 0; the first negative value is at q^2 = 1e12), so the zeta form applies.

- E_a, a = 0.02: pinned at D = 2.2 sqrt X, abs(gap) <= 6.4e-5 sqrt X (k = 0: 1e4, 1e5, 3e5; k = 1: 1e4, 1e5;
  k = 2: 1e4; the runs carried a box bound 1e9 on c, which is active and limits the precision; solver failure
  for k = 1 at 3e5 and k = 2 at 1e5). a = 0.1: pinned at 1e5 for k = 0, 1.
- T-NR: for X < q the coefficient sequence is that of zeta, so the LP is the zeta LP (PROVED). X = 1.1e6 and
  1.5e6 > q: pinned to psi_k^F (k = 0 at 2.2 sqrt X: 1.7e-6, 1.3e-5 sqrt X; k = 1 at 4 sqrt X: 1.9e-5 sqrt X;
  k = 1 at 2.2 sqrt X: solver failure).

Since the LP value is psi_k^F(X)/X^k, the statistic nu(X) is read from the sieve (table T1, X <= 1e10):

k = 0

| decade of X | zeta | E_a, a = 0.02 (/2) | ratio to zeta | cosh(a log X) | E_a, a = 0.1 (/2) | ratio | cosh | T-NR q = 1000003 | L(chi_-4) | L(chi_5) | zeta_Q(i) | Liouville | random sign | twist alpha = 1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1e2..1e3 | 0.5645 | 0.5677 | 1.006 | 1.007 | 0.6520 | 1.155 | 1.170 | 0.5645 | 0.8209 | 1.2352 | 1.0962 | 0.7619 | 3.367 | 0.5115 |
| 1e3..1e4 | 0.5368 | 0.5427 | 1.011 | 1.013 | 0.6941 | 1.293 | 1.343 | 0.5368 | 1.3261 | 0.9700 | 1.1981 | 0.6928 | 4.037 | 0.5299 |
| 1e4..1e5 | 0.4377 | 0.4454 | 1.018 | 1.022 | 0.6888 | 1.574 | 1.587 | 0.4377 | 1.1673 | 0.9262 | 1.3213 | 0.4468 | 2.900 | 0.4273 |
| 1e5..1e6 | 0.5191 | 0.5361 | 1.033 | 1.032 | 1.0030 | 1.932 | 1.915 | 0.5191 | 1.1306 | 0.9605 | 1.5082 | 0.5433 | 3.711 | 0.5182 |
| 1e6..1e7 | 0.5414 | 0.5634 | 1.041 | 1.045 | 1.1873 | 2.193 | 2.345 | 30.1301 | 1.0119 | 0.8401 | 1.2492 | 0.5423 | 3.945 | 0.5419 |
| 1e7..1e8 | 0.6590 | 0.6986 | 1.060 | 1.060 | 1.9073 | 2.894 | 2.901 | 9.4414 | 1.0961 | 1.2187 | 1.3074 | 0.6601 | 2.622 | 0.6599 |
| 1e8..1e9 | 0.5264 | 0.5629 | 1.069 | 1.078 | 1.7187 | 3.265 | 3.610 | 3.4290 | 0.9414 | 0.8512 | 0.9928 | 0.5211 | 3.635 | 0.5272 |
| 1e9..1e10 | 0.5656 | 0.6154 | 1.088 | 1.097 | 2.6936 | 4.762 | 4.512 | 1.4730 | 1.0927 | 1.0320 | 1.5005 | 0.5650 | 2.851 | 0.5666 |

k = 1

| decade of X | zeta | E_a, a = 0.02 (/2) | ratio to zeta | cosh(a log X) | E_a, a = 0.1 (/2) | ratio | cosh | T-NR q = 1000003 | L(chi_-4) | L(chi_5) | zeta_Q(i) | Liouville | random sign | twist alpha = 1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1e2..1e3 | 0.0186 | 0.0187 | 1.005 | 1.007 | 0.0212 | 1.140 | 1.170 | 0.0186 | 0.1494 | 0.3615 | 0.3444 | 0.1949 | 1.456 | 0.1245 |
| 1e3..1e4 | 0.0178 | 0.0180 | 1.013 | 1.013 | 0.0238 | 1.336 | 1.343 | 0.0178 | 0.0810 | 0.2263 | 0.1256 | 0.0650 | 1.988 | 0.0481 |
| 1e4..1e5 | 0.0165 | 0.0168 | 1.017 | 1.022 | 0.0262 | 1.587 | 1.587 | 0.0165 | 0.0781 | 0.1369 | 0.0962 | 0.0408 | 0.349 | 0.0284 |
| 1e5..1e6 | 0.0214 | 0.0221 | 1.032 | 1.032 | 0.0410 | 1.917 | 1.915 | 0.0214 | 0.0930 | 0.1026 | 0.0866 | 0.0221 | 1.139 | 0.0237 |
| 1e6..1e7 | 0.0183 | 0.0192 | 1.049 | 1.045 | 0.0453 | 2.470 | 2.345 | 11.6954 | 0.0771 | 0.0855 | 0.0874 | 0.0199 | 1.608 | 0.0191 |
| 1e7..1e8 | 0.0222 | 0.0235 | 1.061 | 1.060 | 0.0647 | 2.917 | 2.901 | 8.6570 | 0.0845 | 0.0789 | 0.0964 | 0.0229 | 1.053 | 0.0223 |
| 1e8..1e9 | 0.0209 | 0.0225 | 1.081 | 1.078 | 0.0785 | 3.763 | 3.610 | 2.9974 | 0.0690 | 0.0854 | 0.0716 | 0.0213 | 0.985 | 0.0210 |
| 1e9..1e10 | 0.0199 | 0.0219 | 1.098 | 1.097 | 0.0907 | 4.557 | 4.512 | 0.9481 | 0.0946 | 0.0823 | 0.0992 | 0.0199 | 0.353 | 0.0201 |

k = 2

| decade of X | zeta | E_a, a = 0.02 (/2) | ratio to zeta | cosh(a log X) | E_a, a = 0.1 (/2) | ratio | cosh | T-NR q = 1000003 | L(chi_-4) | L(chi_5) | zeta_Q(i) | Liouville | random sign | twist alpha = 1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1e2..1e3 | 0.0026 | 0.0026 | 1.001 | 1.007 | 0.0027 | 1.027 | 1.170 | 0.0026 | 0.0420 | 0.1549 | 0.1278 | 0.0862 | 0.550 | 0.0603 |
| 1e3..1e4 | 0.0010 | 0.0010 | 1.013 | 1.013 | 0.0014 | 1.339 | 1.343 | 0.0010 | 0.0185 | 0.0832 | 0.0473 | 0.0299 | 0.737 | 0.0194 |
| 1e4..1e5 | 0.0011 | 0.0011 | 1.024 | 1.022 | 0.0018 | 1.663 | 1.587 | 0.0011 | 0.0108 | 0.0447 | 0.0174 | 0.0100 | 0.262 | 0.0066 |
| 1e5..1e6 | 0.0011 | 0.0011 | 1.033 | 1.032 | 0.0020 | 1.927 | 1.915 | 0.0011 | 0.0102 | 0.0221 | 0.0117 | 0.0032 | 0.369 | 0.0023 |
| 1e6..1e7 | 0.0009 | 0.0010 | 1.048 | 1.045 | 0.0023 | 2.437 | 2.345 | 4.3487 | 0.0097 | 0.0135 | 0.0097 | 0.0019 | 0.569 | 0.0012 |
| 1e7..1e8 | 0.0011 | 0.0012 | 1.061 | 1.060 | 0.0033 | 2.939 | 2.901 | 3.8934 | 0.0114 | 0.0096 | 0.0125 | 0.0013 | 0.536 | 0.0011 |
| 1e8..1e9 | 0.0010 | 0.0011 | 1.082 | 1.078 | 0.0039 | 3.801 | 3.610 | 1.4895 | 0.0097 | 0.0084 | 0.0103 | 0.0011 | 0.331 | 0.0010 |
| 1e9..1e10 | 0.0010 | 0.0011 | 1.099 | 1.097 | 0.0048 | 4.603 | 4.512 | 0.4791 | 0.0113 | 0.0093 | 0.0120 | 0.0010 | 0.241 | 0.0011 |

Excess = psi_k^F(X)/X^k minus the polar terms (zeta: X/(k+1)! - log 2pi/k!; E_a: the two terms at 1 +- a and the
constant; Liouville: -X/(k+1)! + sqrt X/((1/2)(3/2)...(k + 1/2)); others: none), divided by sqrt X (E_a also by 2).

Onsets.

| control | off-line zeros | gamma_off^2 | what the LP value does | onset | enters through |
|---|---|---|---|---|---|
| E_a, a = 0.02 | Re = 1/2 +- 0.02 at zeta's ordinates, from 14.13 | 200 | zeta's excess times cosh(a log X): 1.006 at 1e2..1e3, 1.03 at 1e5, 1.098 at 1e9..1e10 (MEASURED; predicted 1.007, 1.032, 1.097) | a log X of order 1, X about e^(1/a) = 5e21; ten per cent at 1e10 | zeros, by the explicit formula (equivalently the coefficients n^(+-a)) |
| E_a, a = 0.1 | Re = 0.6, 0.4 | 200 | ratio 1.14 (1e2..1e3) to 4.6 (1e9..1e10) | X about e^(1/a) = 2e4 | same |
| T-NR q = 1000003 | Re = 1/2 +- 0.0321 at (2j+1) pi/log q = 0.2274(2j+1) | 0.052 | identical to zeta for X < q; at X = q a jump c sqrt q log q = 30394 (30.1, 11.7, 4.35 sqrt X in the decade above q for k = 0, 1, 2; decays like X^(-1/2) until q^2) | X = q exactly, i.e. log X = pi/gamma_off | one coefficient (the zeros are the Fourier series of the atoms at q^j) |

Neither control separates at X below gamma_off^2. For E_a the LP is slower than the resolution of the zeros by any
direct method (the shift a is visible to a zero finder at height 14 with a few evaluations); for T-NR the LP is
blind until the single modified coefficient enters.

**(iv) Davenport-Heilbronn, heat, sign twist, unimodular twist.**

| control | LP form | outcome (MEASURED, X = 1e4, 3e4 unless stated) |
|---|---|---|
| Davenport-Heilbronn | zeta form (u = 1) | unbounded (k = 0, 1); Lambda_F(n) < 0 at 2049 of 1e4 and 5699 of 3e4 integers; solver error for k = 2 |
| Davenport-Heilbronn | u = chi_5 (sign pattern of a character) | unbounded (k = 0), infeasible (k = 1, 2); 2063 sign errors at 1e4 |
| Davenport-Heilbronn | u = sign of Lambda_F(n), computed (oracle) | infeasible or not pinned at 5 sqrt X; pinned at 10 sqrt X (abs(gap) < 1e-6 sqrt X; k = 0, 1 at 1e4, 3e4; k = 2 at 1e4) |
| Liouville twist, u = lambda(n) | two-sided | not pinned at 2.2 sqrt X (6 to 160 sqrt X); pinned at 5 sqrt X (abs(gap) <= 1.7e-5 sqrt X, k = 0, 1, 2) |
| random completely multiplicative sign, u = eps(n) | two-sided | not pinned at 2.2 sqrt X; pinned at 5 sqrt X (1e-6 sqrt X, k = 0, 1, 2) |
| unimodular twist zeta(s + i), u = n^-i | complex | pinned at 2.2 sqrt X for k = 0, 1 at X = 1e3, 1e4 (1e-5 sqrt X); k = 2: 0.02 sqrt X; solver failure or unbounded relaxation at 3e4 |
| backward heat | none | not formulable (no coefficient sequence) |

Davenport-Heilbronn fails at X = 1e3, far below gamma_off^2 = 85.7^2 = 7345, and for a reason that does not
involve its zeros: the sign of Lambda_F(n) is not a known function of n (it is nonzero at non-prime-powers, first
at n = 6). This does not make the test a survivor, for three reasons. (a) The same step fails for L(chi_-4) and
L(chi_5). (b) With the signs supplied, Davenport-Heilbronn passes: the LP is pinned to psi_k^DH, whose growth is
governed by the explicit formula (measured in `s5`, combination 3: the exponent departs at x about 1e5, the
envelope of the zero at height 85.7). (c) The sign twists pass with the signs supplied: the random sign has excess
of size sqrt X (0.3 to 4 sqrt X in every decade to 1e10, table T1) with no functional equation, and E_a passes
with Theta = 0.52.

### 1.4 Classification

CLOSED. The LP is a reconstruction of psi_k^F(X) from the coefficients n <= X and the signs of Lambda_F; it
contains the object through its coefficients (equivalently, through all zeros at once by the explicit formula).
The sandwich Theta <= min nu <= Theta + (1 - Theta)^2/(k + 2 - Theta) returns Theta of the object fed in. Control
onsets: E_a at log X about 1/a (above gamma_off^2 by twenty orders of magnitude for a = 0.02); T-NR at X = q
(log X = pi/gamma_off); Davenport-Heilbronn and the L-functions at the positivity premise. Pattern: explicit
formula; onset at the envelope of the zero or at the modified coefficient.

## 2. Combination 2: first moment with the object's own Gram entries

Nodes: `twist-modulus-reciprocity`, `route-m-vasyunin-gram`, `route-m-kappa-first-moment`, `mem-kappa-first-moment`.

Statistic: kappa_F(b) = F_F(b)/(phi(b) b), F_F(b) = sum_{a=2,(a,b)=1}^{b-1} I_F(a,b), I_F(a,b) = ab <v_a, v_b>;
for zeta the split into the arithmetic part (limit (3/2)C - 3/8 = 0.5704960511) and the cotangent part (limit 1/8).
Survival would have required a control whose cotangent part changes sign on a set of b of positive density.

What was already settled (read first; not recomputed): `s2` Lemma 1 (every Gram entry is a function of
abs(F(1/2+it)) only), Lemma 2 (an inserted off-line pair with a Blaschke factor leaves the Gram matrix unchanged),
Lemma 3 (kappa_F = (3/4pi) int W_F(t)/(9/4+t^2) dt > 0); `s4` (zeta: kappa(b) > 0.69 for every b >= 47, proved
plus a finite list; every b <= 1e6 computed; periodic objects every b <= 8000 and b = 30030, 100003, 510510;
T-NR q = 2, 3, 101 at b = 1e6, 9.7e6, 1e7). The split: zeta's cotangent part is positive for every 200 <= b <= 30000
(`s2`: 29801 moduli) and tends to 1/8; the value -0.0105 at b = 30 of the source is a small-b value. Periodic
objects have no arithmetic part; their fixed-modulus part is negative and their leaf part positive for every
b >= 200 (`s2`). The range b <= 2e5 of the task is bracketed by these runs (510510 > 2e5).

New cells (the "not run" entries of `s2`, `s4`, `s5`).

| object | method | kappa_F (limit) | kappa_F(b), b in [30, 40] | minimum over 3 <= b <= 40 | Cauchy-Schwarz loss, b in [30, 40] |
|---|---|---|---|---|---|
| zeta (check of the quadrature) | quadrature, abs(t) <= 3000 | 0.695496 (exact 0.6954960511) | [0.6847, 0.6947] | 0.4410 at b = 3 (exact 0.441104) | 1.33 to 1.80 |
| E_a, a = 0.02 | quadrature | 1.150476 | [1.1136, 1.1385] | 0.8135 at b = 3 | 1.40 to 2.13 |
| E_a, a = 0.25 | quadrature | 1.579073 (`s2`: 1.57907) | [1.5272, 1.5650] | 1.0985 at b = 3 | 1.42 to 2.25 |
| twist zeta(s + i) | quadrature (complex Gram, real part of the sum) | 0.350685 (`s2`: 0.350685) | [0.3480, 0.3534] | 0.2363 at b = 3 | 1.29 to 1.45 |
| T-NR q = 1000003, c = 2.2 | exact (program of `s5`, mode O) | not computed ((c^2 + 2) kappa_zeta = 4.757 plus the terms d = +-1, +-2) | 4.8102 (b = 127), 4.8098 (b = 251); b < q | | Q_F/phi = 133.9, 137.8 |

Periodic objects at the top of the task's range (server, program of `s5` compiled in this lane, mode PO, all
199997 residues 2 <= a < b; 266 to 626 s on 4 threads):

| object | b | fixed-modulus part | leaf part | kappa_F(b) | limit kappa_F | (kappa_F(b) - kappa_F) b | eps_F of `s2` times mu(b) | Q_F/phi(b) | s0_F |
|---|---|---|---|---|---|---|---|---|---|
| L(chi_-4) | 199999 (prime) | -0.224125 | +0.504748 | 0.2806229 | not tabulated | | | 0.260874 | 0.2608753 |
| L(chi_5) | 199999 | -0.436454 | +0.548548 | 0.1120942 | 0.1120952747 | -0.215 | -0.218 | 0.077273 | 0.0772737 |
| Davenport-Heilbronn | 199999 | -0.183306 | +0.590290 | 0.4069846 | 0.4069850721 | -0.094 | -0.092 | 0.566113 | 0.5661151 |

The parts have the signs and values found in `s2` at b <= 5500 (chi_5: -0.4364 + 0.5485; Davenport-Heilbronn:
-0.1833 + 0.5903), and the residual is the term -eps_F/b of the `s2` law to two digits.
Davenport-Heilbronn lies between the two L-functions in every column.

Accuracy of the quadrature (`c2/quad_gram.py`): pair values of zeta against Vasyunin's formula, I(2,5) = 3.16323
(exact 3.16405), I(3,7) = 4.63515 (4.63587), I(7,11) = 9.33348 (9.33401), I(5,12) = 7.77418 (7.77475): error 5e-4 to
8e-4, the resonant tail of abs(zeta)^2 (a/b)^(it)/t^2 beyond the taper, of size log T/(pi T). kappa_F(b) is
therefore good to about 1e-3; the sign of kappa_F(b) - kappa_F (the residual law of `s2`) is not resolved for
b > 10 and is not claimed. The zeta(s) values were checked against mpmath (1e-14 at t = 12, 9e-10 at
sigma = 0.52, t = 3000).

Outcome: kappa_F(b) > 0 for every b <= 40 and each new object, minimum at b = 3, within 3 % of the limit for
30 <= b <= 40. A split into arithmetic and cotangent parts does not exist for E_a and the twist (no finite
formula); the statistic "sign of the cotangent part" is defined only for zeta and T-NR.

Enters through: abs(F) on the critical line (a mean value); not zeros, not individual coefficients.
Control onsets: none; an off-line zero of any height leaves kappa_F(b) unchanged if abs(F) on the line is kept.
Classification: CLOSED (duplicate in substance of `s2` combination 1 and `s4` combination 1; the cells above are new).

## 3. Combination 3: Cauchy-Schwarz chain and Int(N)

Nodes: `route-m-arith-first-moment-constant`, `mem-route-m-cs-reduction`, `subleading-k-closed-form`.

Chain (imp-97071): Q(b) = sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 >= F(b)^2/S(b) >= 3 F(b)^2/b^3,
S(b) = sum a^2 over the same a; T(M) = 2 sum_{3<=b<=M} Q(b)/b^2 and T <= Int <= zeta(2) T (imp-96708). Survival
would have required a control with Int(N) growing faster than log N at N below the size that resolves its
off-line zeros through the Gram matrix.

Computed from the per-b arrays of `s5` (Q(b), F(b); zeta every b <= 1e6 from its Euclid-tree run, periodic
objects every b <= 5000) with S(b) and phi(b) from a Moebius sieve (`c3/cs_chain.py`, `out/cs_chain.json`).

| object | b up to | Cauchy-Schwarz violations | slope of T(M) in log M, last interval | 12 s0_F/pi^2 | slope of the floor 2 sum F^2/(b^2 S) | 36 kappa_F^2/pi^2 | slope of the crude floor 6 sum F^2/b^5 | loss Q S/F^2, top half of b: mean (max) | s0_F/(3 kappa_F^2) |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 1e6 | 0 | 3.5490 (1e5 .. 1e6) | 3.5494 | 1.7644 | 1.7644 | 1.2429 | 2.0116 (2.0117) | 2.0117 |
| L(chi_-4) | 5000 | 0 | 0.3171 (3000 .. 5000) | 0.3172 | 0.2872 | 0.2872 | 0.2024 | 1.1039 (1.1042) | 1.1043 |
| L(chi_5) | 5000 | 0 | 0.0940 | 0.0940 | 0.0458 | 0.0458 | 0.0323 | 2.0499 (2.0551) | 2.0499 |
| Davenport-Heilbronn | 5000 | 0 | 0.6881 | 0.6883 | 0.6042 | 0.6042 | 0.4257 | 1.1389 (1.1392) | 1.1392 |

T(M) for zeta: 16.5586, 24.6808, 32.8463, 41.0182 at M = 1e3, 1e4, 1e5, 1e6 (as in `s5`). The floor slope is
1.7644 = 36 kappa^2/pi^2 with kappa = 0.6954960511 (the value 1.767 of the task is the same number at three
digits of kappa). The crude floor has slope 1.2429 = 1.7644 x 0.7044 (the density of phi(b)^2/b^2 against phi(b)/b).
kappa(b) on (5e5, 1e6] lies in [0.695496, 0.695496].

Each object has T_F(M) = (12 s0_F/pi^2) log M + O(1) and floor (36 kappa_F^2/pi^2) log M + O(1): two constants,
a fourth and a second moment of abs(F) on the line. The loss converges to s0_F/(3 kappa_F^2). No object grows
faster than log M. For T-NR, W_F <= (c + 2)^2 W_zeta pointwise (`s2` Lemma 2), so T_F <= (c + 2)^4 T_zeta: also
logarithmic (not computed beyond b = 251). E_a and the twist: Q_F(b)/phi(b) at b = 37, 40 is 7.85, 7.18
(a = 0.02), 15.5, 14.1 (a = 0.25), 0.537, 0.523 (twist), against 2.53, 2.35 for zeta at the same b by the same
quadrature: bounded ratios at the sizes reached (b <= 40 only).

Remainders. L0(b) = sum_{a<b,(a,b)=1} log a, L1(b) = sum a log a, E0 = L0 - phi(b)(log b - 1),
E1 = L1 - phi(b) b((1/2) log b - 1/4).

- **E0 in closed form (PROVED; Stirling series of log n! under the Moebius sum).** For b >= 2,
  E0(b) = Lambda(b)/2 + (1/(12 b)) prod_{p|b}(1 - p) + R, abs(R) <= (1/360) sum_{d|b} mu(d)^2 (d/b)^3 <= 0.0033.
  Hence abs(E0(b)) <= (1/2) log b + 0.087,
  and E0(b)/(2^omega(b)(log b + 2)) has supremum 1/4 (primes). Checked: every b <= 3e6 (maximum of the ratio 0.2180
  at b = 2999999; closed form within 2.3e-3, attained at b = 2); primorials to 6469693230 at 40 digits
  (E0 = +-0.0113 to 0.026, ratio 4.5e-7 at p_10#).
- E1: ratio abs(E1(b))/(b 2^omega(b)(log b + 2)) <= 0.0242 (b = 7) for every b <= 3e6, 0.0079 for b >= 1e6;
  primorials: E1/b = 0.0494, -0.0308, 0.0204, -0.0145, 0.0100, -0.0068, 0.0042, -0.0021, 0.00048 for p_2# .. p_10#
  (the value at 223092870 agrees with `s5`: -0.002098461). Every b <= 1e9 was done in `s5` with the exact formula;
  the stated bounds hold with a factor of at least 40 to spare. (The float64 value 0.2500017 of max abs(E1)/b at
  b = 2565769 is rounding in a sum of size 5e13; `s5` proves abs(E1) <= b/4 for omega(b) <= 121.)

The node `subleading-k-closed-form` (K = 11/2 - 2 gamma - 3 pi^2/8 = 0.6444670198) belongs to a different object
(the accumulated total of imp-95983); the identity is arithmetic (-C_1 + (5/2)(1 - pi^2/12) with
-C_1 = 3 - 2 gamma - pi^2/6) and plays no role in the chain. No test was attached to it.

Enters through: abs(F) on the line (second and fourth moments). Onset: none.
Classification: CLOSED (Gram-only; duplicate in substance of `s5` combination 2, with the chain constants new).

## 4. Combination 4: hole test

Nodes: `mv-cap-function-side-open`, `mem-mollified-interval-sos`, `mem-wol-c`.

### 4.1 Statement tested and survival rule

Source (`formalization/paper/mv-cap-theorem.md`, Proposition E): in the heat-flow model the holes that defeat the
lane target span 7 to 17 mean spacings and raise abs(zeta) on the line by factors 38 to 8e7; explicit
second-moment information can see the large ones. Test: on windows of 7, 12, 17 mean spacings measure (a) the
largest stretch without a sign change of Z_F (true hole on the line), (b) max abs(Z_F) and the local mean J of
abs(F M)^2 with M_y(s) = sum_{n<=y} b_n (1 - log n/log y) n^-s, b = Dirichlet inverse of the coefficients
(mu for zeta, mu chi for L(chi)), y = T^(1/4), T^(1/2), (c) the largest stretch on which Re(F M) > 0 at every
sample and Z_F has no sign change (the certificate; on such a stretch F does not vanish on the line).
"Sum-of-squares certificate" is read as this sampled positivity certificate of Re(F M); no polynomial
sum-of-squares decomposition was computed, and the sampling (10 points per mean spacing) is not an interval proof.

Survival would have required: zeta with a law (hole length -> size of abs(F) or of J) at every height, the
L-functions the same, and a control violating the law in windows without off-line zeros.

### 4.2 Method and checks

`c4/hole.py`. Z_F(t) = e^(i theta_F(t)) F(1/2+it) for real q-periodic coefficients with root number 1 (zeta,
L(chi_-4), L(chi_5), Davenport-Heilbronn with gamma factor Gamma((s+1)/2), conductor 5) from the smoothed
approximate functional equation with test function exp(A u^2 - i pi u/4):

    Z_F(t) = 2 Re[ e^(i theta_F(t)) sum_n c_n n^(-1/2-it) (1/2) erfc( log(n/N0)/(2 sqrt A) ) ],  N0 = sqrt(q t/2 pi),

error O(A^(-3/4)/t) from the Stirling expansion of the gamma ratio (CLASSICAL form; derived in the file header).
Phases t log n are split as T0 log n (50 digits at primes, additive) + d log n. A = 0.01 at T = 1e6, 0.0025 above.

1. Against mpmath (siegelz; Hurwitz zeta for the periodic objects), 14 points per case: max error 5.9e-4 at
   T = 1e4, 6.7e-6 at 1e6, 1.9e-7 at 1e8 (zeta); 4.8e-4, 5.6e-4, 3.5e-4 at 1e4 and 1.5e-5, 4.2e-6 at 3e5
   (L(chi_-4), L(chi_5), Davenport-Heilbronn). e^(i theta) F is real to 1e-16 for Davenport-Heilbronn (the
   functional equation used is the right one).
2. GPU against CPU: zeta at T = 1e6, 1e5 windows (1.7e7 points), server cupy against local numpy: zero count,
   flagged minima, largest gap, max abs Z identical; mean Z^2 and mean abs(FM)^2 agree to 13 digits.
3. Zero count against the main term of N(T) (the grid is laid out in local mean spacings): zeta 1700000 counted,
   1700000 expected at T = 1e6; L(chi_-4), L(chi_5): +1 each (table T3).
4. Unresolved close pairs. A sample minimum of abs(Z) that does not cross zero is classified by the parabola
   through three samples: vertex beyond zero = two real zeros closer than one step (inserted in the zero list);
   vertex positive with half-distance eta below 0.06 spacings = marginal, counted as a real pair; otherwise a
   positive minimum (a conjugate pair near the line). For zeta at T = 1e8 one minimum had eta = 0.037 spacings; at
   30 digits (`c4/recheck_min.py`) Z has two sign changes there (minimum -7.2e-4 between two samples): a close
   real pair, not a positive minimum. This fixed the threshold at 0.06.

Sizes: table T3. Every number below is float64 (GPU for the sums); it is a screen in the sense of the brief.
The pass/fail statements of 4.3 that rest on single values were re-derived as stated in checks 1, 2, 4.

### 4.3 Results

| F | T | windows (17 sp.) | where | zeros counted | counted - expected | unresolved close pairs inserted | positive minima, eta >= 0.06 / 0.1 / 0.5 sp. | largest gap (sp.) | 99.99% gap | max abs Z | rms Z |
|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 1e+06 | 100000 | server GPU | 1700000 | +0 | 370 | 0 / 0 / 0 | 3.377 | 2.809 | 47.6 | 3.671 |
| L(chi_-4) | 1e+06 | 100000 | server GPU | 1700001 | +1 | 408 | 0 / 0 / 0 | 3.104 | 2.686 | 28.5 | 2.848 |
| L(chi_5) | 1e+06 | 100000 | server GPU | 1700001 | +1 | 387 | 0 / 0 / 0 | 3.129 | 2.722 | 46.6 | 3.562 |
| DH | 1e+06 | 100000 | server GPU | 1522171 | -177829 | 4065 | 70453 / 65220 / 10221 | 8.975 | 5.398 | 25.0 | 2.693 |
| zeta | 1e+08 | 100000 | server GPU | 1700000 | +0 | 421 | 0 / 0 / 0 | 3.511 | 2.845 | 90.7 | 4.212 |
| L(chi_-4) | 1e+08 | 100000 | server GPU | 1700000 | +0 | 392 | 0 / 0 / 0 | 3.167 | 2.757 | 47.4 | 3.203 |
| L(chi_5) | 1e+08 | 100000 | server GPU | 1700000 | +0 | 425 | 0 / 0 / 0 | 3.346 | 2.785 | 74.8 | 4.016 |
| DH | 1e+08 | 100000 | server GPU | 1511378 | -188622 | 3917 | 69380 / 64278 / 10788 | 8.854 | 5.607 | 41.4 | 3.018 |
| zeta | 1e+10 | 50000 | server GPU | 850000 | +0 | 215 | 0 / 0 / 0 | 3.402 | 2.871 | 122.5 | 4.726 |
| L(chi_-4) | 1e+10 | 20000 | server GPU | 339999 | -1 | 87 | 0 / 0 / 0 | 3.202 | 2.811 | 60.4 | 3.544 |
| L(chi_5) | 1e+10 | 20000 | server GPU | 340000 | +0 | 88 | 0 / 0 / 0 | 3.144 | 2.819 | 91.4 | 4.449 |
| DH | 1e+10 | 20000 | server GPU | 301065 | -38935 | 784 | 13600 / 12565 / 2133 | 7.820 | 5.953 | 54.8 | 3.333 |
| zeta | 1e+12 | 5000 | server GPU | 85001 | +1 | 19 | 0 / 0 / 0 | 3.161 | 2.845 | 125.9 | 5.187 |
| DH | 1e+12 | 2000 | server GPU | 29985 | -4015 | 63 | 1367 / 1279 / 229 | 6.779 | 5.725 | 62.7 | 3.631 |

| F | T | g in [1.5,1.75) | [2,2.25) | [2.5,2.75) | [3,3.25) | fit slope, intercept (g >= 1.5) | DH: gaps holding a positive minimum: [3,3.25) | [4,4.25) | [5,5.25) | [6,6.25) | largest such gap, max abs Z in it |
|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 1e+06 | 1.69 (124106) | 2.54 (18795) | 3.27 (1333) | 3.72 (30) | 1.658, -0.995 | - | - | - | - | 3.38, 47.6 |
| L(chi_-4) | 1e+06 | 1.64 (126584) | 2.35 (16902) | 2.91 (742) | 3.22 (5) | 1.401, -0.633 | - | - | - | - | 3.10, 24.8 |
| L(chi_5) | 1e+06 | 1.68 (126048) | 2.51 (16570) | 3.26 (826) | 3.74 (10) | 1.652, -1.007 | - | - | - | - | 3.13, 42.9 |
| DH | 1e+06 | 1.62 (100526) | 1.97 (15299) | 1.94 (2691) | 2.21 (327) | -0.067, 1.708 | 1.57 (10185) | 1.45 (568) | 1.99 (312) | 2.39 (6) | 8.98, 12.9 |
| zeta | 1e+08 | 1.71 (126622) | 2.56 (19461) | 3.38 (1463) | 4.03 (60) | 1.695, -1.043 | - | - | - | - | 3.51, 90.7 |
| L(chi_-4) | 1e+08 | 1.66 (128105) | 2.41 (18309) | 3.07 (1121) | 3.56 (13) | 1.477, -0.733 | - | - | - | - | 3.17, 47.4 |
| L(chi_5) | 1e+08 | 1.69 (128227) | 2.52 (18258) | 3.31 (1075) | 3.94 (27) | 1.651, -0.994 | - | - | - | - | 3.35, 57.2 |
| DH | 1e+08 | 1.65 (104865) | 1.99 (17654) | 1.96 (3325) | 2.18 (488) | -0.081, 1.768 | 1.56 (9826) | 1.42 (836) | 1.93 (342) | 1.58 (22) | 8.85, 8.4 |
| zeta | 1e+10 | 1.72 (63816) | 2.58 (9921) | 3.40 (748) | 4.14 (23) | 1.707, -1.051 | - | - | - | - | 3.40, 114.2 |
| L(chi_-4) | 1e+10 | 1.68 (25577) | 2.45 (3999) | 3.10 (246) | 3.79 (9) | 1.511, -0.766 | - | - | - | - | 3.20, 48.0 |
| L(chi_5) | 1e+10 | 1.70 (25631) | 2.53 (3839) | 3.32 (269) | 3.88 (5) | 1.651, -0.979 | - | - | - | - | 3.14, 28.6 |
| DH | 1e+10 | 1.67 (21796) | 2.02 (3758) | 1.95 (749) | 2.18 (121) | -0.093, 1.821 | 1.55 (1994) | 1.43 (179) | 1.81 (66) | 1.72 (3) | 7.82, 14.4 |
| zeta | 1e+12 | 1.72 (6435) | 2.64 (988) | 3.32 (81) | - | 1.755, -1.127 | - | - | - | - | 3.16, 125.9 |
| DH | 1e+12 | 1.69 (2254) | 2.05 (427) | 2.16 (86) | 2.05 (10) | -0.128, 1.908 | 1.47 (212) | 1.60 (17) | 1.82 (9) | - | 6.78, 3.8 |

| F | T | theta | y | mean abs(FM)^2 | fraction of the line with Re(FM) > 0 | largest certified hole (sp.) | certified share of gaps in [2,2.5) | of gaps >= 3 | largest gap, certified part |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 1e+06 | 0.25 | 32 | 4.023 | 0.817 | 2.00 | 0.63 | 0.33 | 3.38, 0.80 |
| zeta | 1e+06 | 0.5 | 1000 | 2.643 | 0.884 | 2.50 | 0.75 | 0.43 | 3.38, 1.40 |
| L(chi_-4) | 1e+06 | 0.25 | 32 | 4.209 | 0.811 | 1.80 | 0.58 | 0.52 | 3.10, 1.50 |
| L(chi_-4) | 1e+06 | 0.5 | 1000 | 2.788 | 0.873 | 2.20 | 0.73 | 0.39 | 3.10, 0.90 |
| L(chi_5) | 1e+06 | 0.25 | 32 | 4.240 | 0.810 | 1.90 | 0.58 | 0.53 | 3.13, 0.90 |
| L(chi_5) | 1e+06 | 0.5 | 1000 | 2.811 | 0.872 | 2.30 | 0.74 | 0.57 | 3.13, 1.40 |
| DH | 1e+06 | 0.25 | 32 | 4.928 | 0.792 | 1.70 | 0.43 | 0.30 | 8.98, 1.30 |
| DH | 1e+06 | 0.5 | 1000 | 4.393 | 0.843 | 2.20 | 0.45 | 0.35 | 8.98, 1.60 |
| zeta | 1e+08 | 0.25 | 100 | 4.171 | 0.812 | 2.20 | 0.62 | 0.30 | 3.51, 0.80 |
| zeta | 1e+08 | 0.5 | 10000 | 2.691 | 0.881 | 2.60 | 0.74 | 0.43 | 3.51, 0.70 |
| L(chi_-4) | 1e+08 | 0.25 | 100 | 4.330 | 0.807 | 1.90 | 0.58 | 0.35 | 3.17, 0.80 |
| L(chi_-4) | 1e+08 | 0.5 | 10000 | 2.805 | 0.873 | 2.40 | 0.72 | 0.36 | 3.17, 0.60 |
| L(chi_5) | 1e+08 | 0.25 | 100 | 4.354 | 0.807 | 2.00 | 0.58 | 0.33 | 3.35, 0.80 |
| L(chi_5) | 1e+08 | 0.5 | 10000 | 2.824 | 0.871 | 2.50 | 0.73 | 0.37 | 3.35, 1.30 |
| DH | 1e+08 | 0.25 | 100 | 5.614 | 0.784 | 1.90 | 0.43 | 0.30 | 8.85, 1.00 |
| DH | 1e+08 | 0.5 | 10000 | 7.044 | 0.833 | 2.40 | 0.43 | 0.34 | 8.85, 1.30 |
| zeta | 1e+10 | 0.25 | 316 | 4.317 | 0.808 | 2.30 | 0.60 | 0.32 | 3.40, 0.80 |
| zeta | 1e+10 | 0.5 | 100000 | 2.748 | 0.877 | 2.70 | 0.72 | 0.37 | 3.40, 0.70 |
| L(chi_-4) | 1e+10 | 0.25 | 316 | 4.449 | 0.804 | 2.00 | 0.58 | 0.33 | 3.20, 0.70 |
| L(chi_-4) | 1e+10 | 0.5 | 100000 | 2.841 | 0.871 | 2.60 | 0.72 | 0.35 | 3.20, 0.60 |
| L(chi_5) | 1e+10 | 0.25 | 316 | 4.470 | 0.804 | 2.10 | 0.58 | 0.32 | 3.14, 1.70 |
| L(chi_5) | 1e+10 | 0.5 | 100000 | 2.858 | 0.869 | 2.50 | 0.72 | 0.44 | 3.14, 1.20 |
| DH | 1e+10 | 0.25 | 316 | 6.544 | 0.778 | 1.90 | 0.43 | 0.30 | 7.82, 1.40 |
| DH | 1e+10 | 0.5 | 100000 | 15.429 | 0.821 | 2.50 | 0.42 | 0.33 | 7.82, 1.70 |
| zeta | 1e+12 | 0.25 | 1000 | 4.416 | 0.805 | 2.10 | 0.60 | 0.27 | 3.16, 0.80 |
| zeta | 1e+12 | 0.5 | 1000000 | 2.787 | 0.874 | 2.70 | 0.73 | 0.49 | 3.16, 1.50 |
| DH | 1e+12 | 0.25 | 1000 | 7.916 | 0.771 | 1.90 | 0.43 | 0.29 | 6.78, 0.90 |
| DH | 1e+12 | 0.5 | 1000000 | 46.222 | 0.808 | 2.20 | 0.41 | 0.32 | 6.78, 1.10 |

| F | T | w | windows | largest hole | clean windows | largest hole, clean | largest hole, other | other windows with hole >= 4: number, median max abs Z | median max abs Z, all | J(1/4) clean / other | J(1/2) clean / other | sd of J(1/2) | rho(hole, J(1/2)) | rho(hole, max abs Z) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 1e+06 | 7 | 242857 | 3.20 | 241670 | 3.20 | 2.90 | 0, - | 6.53 | 4.01 / 6.78 | 2.64 / 3.55 | 0.48 | 0.49 | 0.51 |
| zeta | 1e+06 | 17 | 100000 | 3.30 | 99844 | 3.30 | 2.90 | 0, - | 10.70 | 4.02 / 5.17 | 2.64 / 3.07 | 0.29 | 0.36 | 0.54 |
| L(chi_-4) | 1e+06 | 7 | 242857 | 3.10 | 242780 | 3.10 | 3.10 | 0, - | 5.93 | 4.21 / 9.26 | 2.79 / 4.95 | 0.53 | 0.50 | 0.57 |
| L(chi_-4) | 1e+06 | 17 | 100000 | 3.10 | 99963 | 3.10 | 2.80 | 0, - | 8.28 | 4.21 / 5.94 | 2.79 / 3.57 | 0.32 | 0.38 | 0.63 |
| L(chi_5) | 1e+06 | 7 | 242857 | 3.00 | 241899 | 3.00 | 3.00 | 0, - | 6.11 | 4.23 / 7.66 | 2.81 / 3.97 | 0.56 | 0.55 | 0.50 |
| L(chi_5) | 1e+06 | 17 | 100000 | 3.10 | 99803 | 3.10 | 2.80 | 0, - | 10.28 | 4.24 / 5.93 | 2.81 / 3.36 | 0.33 | 0.39 | 0.49 |
| DH | 1e+06 | 7 | 242857 | 7.00 | 165541 | 3.50 | 7.00 | 1709, 7.13 | 5.47 | 4.17 / 6.55 | 3.31 / 6.70 | 4.92 | 0.72 | 0.47 |
| DH | 1e+06 | 17 | 100000 | 7.90 | 33358 | 3.60 | 7.90 | 2525, 8.87 | 7.37 | 4.04 / 5.37 | 3.13 / 5.03 | 3.12 | 0.47 | 0.30 |
| zeta | 1e+08 | 7 | 242857 | 3.30 | 240066 | 3.30 | 3.30 | 0, - | 6.58 | 4.14 / 6.88 | 2.68 / 3.50 | 0.55 | 0.51 | 0.48 |
| zeta | 1e+08 | 17 | 100000 | 3.50 | 99596 | 3.50 | 2.90 | 0, - | 11.44 | 4.17 / 5.19 | 2.69 / 3.06 | 0.34 | 0.41 | 0.48 |
| L(chi_-4) | 1e+08 | 7 | 242857 | 3.10 | 242582 | 3.10 | 2.90 | 0, - | 6.21 | 4.32 / 9.99 | 2.80 / 4.97 | 0.59 | 0.52 | 0.54 |
| L(chi_-4) | 1e+08 | 17 | 100000 | 3.20 | 99929 | 3.10 | 3.20 | 0, - | 9.22 | 4.33 / 6.81 | 2.80 / 3.75 | 0.36 | 0.41 | 0.58 |
| L(chi_5) | 1e+08 | 7 | 242857 | 3.30 | 240425 | 3.30 | 3.10 | 0, - | 6.22 | 4.33 / 7.19 | 2.81 / 3.69 | 0.60 | 0.54 | 0.47 |
| L(chi_5) | 1e+08 | 17 | 100000 | 3.30 | 99637 | 3.30 | 2.80 | 0, - | 10.82 | 4.35 / 5.60 | 2.82 / 3.24 | 0.37 | 0.42 | 0.45 |
| DH | 1e+08 | 7 | 242857 | 7.00 | 165326 | 3.60 | 7.00 | 1902, 6.80 | 5.77 | 4.67 / 7.63 | 5.20 / 10.97 | 19.38 | 0.68 | 0.40 |
| DH | 1e+08 | 17 | 100000 | 8.90 | 35169 | 3.50 | 8.90 | 2882, 9.95 | 8.04 | 4.48 / 6.23 | 4.91 / 8.20 | 12.89 | 0.44 | 0.29 |
| zeta | 1e+10 | 7 | 121428 | 3.30 | 120137 | 3.30 | 3.00 | 0, - | 6.58 | 4.28 / 7.57 | 2.74 / 3.73 | 0.61 | 0.51 | 0.47 |
| zeta | 1e+10 | 17 | 50000 | 3.40 | 49607 | 3.40 | 3.00 | 0, - | 11.71 | 4.31 / 5.67 | 2.74 / 3.19 | 0.38 | 0.42 | 0.45 |
| L(chi_-4) | 1e+10 | 7 | 48571 | 3.20 | 48476 | 3.20 | 3.00 | 0, - | 6.37 | 4.44 / 10.81 | 2.84 / 5.14 | 0.65 | 0.52 | 0.52 |
| L(chi_-4) | 1e+10 | 17 | 20000 | 3.20 | 19979 | 3.20 | 2.80 | 0, - | 9.91 | 4.45 / 7.25 | 2.84 / 3.85 | 0.41 | 0.42 | 0.53 |
| L(chi_5) | 1e+10 | 7 | 48571 | 3.10 | 48398 | 3.10 | 2.70 | 0, - | 6.32 | 4.45 / 9.56 | 2.85 / 4.53 | 0.66 | 0.54 | 0.46 |
| L(chi_5) | 1e+10 | 17 | 20000 | 3.10 | 19932 | 3.10 | 2.70 | 0, - | 10.98 | 4.46 / 6.28 | 2.86 / 3.46 | 0.42 | 0.44 | 0.43 |
| DH | 1e+10 | 7 | 48571 | 7.00 | 33137 | 3.60 | 7.00 | 429, 6.58 | 6.00 | 5.36 / 9.09 | 11.68 / 23.48 | 85.43 | 0.63 | 0.34 |
| DH | 1e+10 | 17 | 20000 | 7.60 | 7138 | 3.60 | 7.60 | 657, 10.52 | 8.70 | 4.95 / 7.43 | 10.03 / 18.43 | 58.24 | 0.40 | 0.28 |
| zeta | 1e+12 | 7 | 12142 | 3.10 | 12024 | 3.10 | 3.10 | 0, - | 6.64 | 4.38 / 8.10 | 2.78 / 3.73 | 0.65 | 0.51 | 0.45 |
| zeta | 1e+12 | 17 | 5000 | 3.10 | 4952 | 3.10 | 3.00 | 0, - | 11.75 | 4.40 / 6.14 | 2.78 / 3.29 | 0.43 | 0.42 | 0.43 |
| DH | 1e+12 | 7 | 4857 | 5.70 | 3274 | 3.20 | 5.70 | 51, 5.50 | 6.33 | 6.18 / 11.51 | 30.45 / 78.84 | 526.87 | 0.60 | 0.28 |
| DH | 1e+12 | 17 | 2000 | 6.80 | 675 | 3.20 | 6.80 | 78, 10.74 | 9.08 | 5.87 / 8.96 | 52.03 / 43.27 | 297.02 | 0.39 | 0.24 |

"Clean" window = no positive minimum inside and at least w - 1 zeros counted: the available proxy for "no
off-line zero in the window". J = mean over the window of abs(F M)^2.

**(i) Premise on zeta, two sizes and more.** Zeta (T = 1e+06: 100000 windows, 1700000 zeros, largest gap 3.38, max abs Z 47.6, gap law slope 1.66; T = 1e+08: 100000 windows, 1700000 zeros, largest gap 3.51, max abs Z 90.7, gap law slope 1.70; T = 1e+10: 50000 windows, 850000 zeros, largest gap 3.40, max abs Z 122.5, gap law slope 1.71; T = 1e+12: 5000 windows, 85001 zeros, largest gap 3.16, max abs Z 125.9, gap law slope 1.75). The zero count equals the main term of N(T) to within 1 in every block, and no positive minimum with eta >= 0.06 spacings occurs (table T3). Mean of log max abs Z in a gap of g spacings: 1.66 g -1.00 at T = 1e6 (g >= 1.5), the same law at every height (slopes 1.66 to 1.75 on the blocks of at least 5000 windows). At g = 3.1 the mean is e^3.72 = 41, i.e. 11 times the rms of Z. Extrapolated, the law gives e^10.6 at g = 7 and e^27.2 at g = 17; the source's factors are 38 = e^3.6 and 8e7 = e^18.2 over the surrounding level (slope 1.46 per spacing). The direction and the size of the slope agree; holes of 7 spacings do not occur (the largest gap in 4.3e+06 zeros is 3.51 spacings), so the premise cannot be tested at its own lengths on zeta. Windows: rho(hole, max abs Z) = 0.43 to 0.54 and rho(hole, J(1/2)) = 0.36 to 0.51 (Spearman, 7 to 17 spacings): the longest zero-free stretch of a window is correlated with the size of abs F and of the mollified mean square, and the median J(1/2) of the windows holding the top one per cent of holes is 3.61 against 2.57 for all windows (w = 7, T = 1e6; standard deviation of J 0.48): a hole of about 3 spacings moves the window mean square by about two standard deviations. Certificate: Re(zeta M) > 0 on 88 % of the line for theta = 1/2 (82 % for 1/4); the largest certified zero-free stretch is 2.5, 2.6, 2.7, 2.7 spacings for theta = 1/2 and 2.0, 2.2, 2.3, 2.1 for theta = 1/4 at T = 1e+06, 1e+08, 1e+10, 1e+12; it covers on average 0.75 of a gap of 2 to 2.5 spacings and 0.43 of a gap of 3 or more.

**(ii) L(chi_-4), L(chi_5).** Same statistics as zeta at every height run: largest gap 3.10 to 3.35 spacings, gap law slope
1.40 to 1.65, no positive minimum with eta >= 0.06 spacings, certified holes up to 2.6 spacings,
J(1/2) = 2.79 to 2.85. The comparison behaves like zeta.

**(iii) E_a and T-NR at q = 1000003 (PROVED statements; one measurement for E_a).**

- T-NR: on the line F(1/2+it) = zeta(1/2+it)(2 cos(t log q) + c) with 2 cos + c in [0.2, 4.2]. The sign changes
  of Z_F are those of Z; for y < q the mollifier is zeta's (y <= 1e6 < q at every T used); Re(F M) has the sign
  of Re(zeta M). Every gap, every certified stretch and every clean/other label is identical to zeta's; max abs F
  changes by a factor at most 4.2 and J by the local mean of (2 cos + c)^2 (c^2 + 2 = 6.84 over a period
  2 pi/log q = 0.4548). Each window of 7 spacings contains 4 (T = 1e12) to 8 (T = 1e6) heights of off-line pairs of T-NR
  (at distance 0.032 from the line, spaced 0.4548 in height). The test returns zeta's answer.
- E_a: F(1/2+it) = chi(1/2 - a + it) abs(zeta(1/2 + a + it))^2, so Z_F = (t/2pi)^a abs(zeta(1/2+a+it))^2 (1 + O(1/t))
  has no sign change at all: the whole line is one hole, max abs F is not raised (it is abs(zeta)^2 on a
  neighbouring line), and every window contains its full count of zeros at distance a from the line. The clause
  "window without off-line zeros" is empty for both controls. MEASURED for a = 0.02 at T = 1e6 (`c4/ea_line.py`,
  local, 20000 windows = 340000 spacings; zeta(0.52+it) against mpmath: 2.1e-5): no sign change; 0.9927 local minima
  of abs F per mean spacing, median minimum 0.33 % of the mean of abs F, smallest 1.0e-6 of it; max abs F in a
  window of 7 spacings: median 0.82 rms, largest 37 rms. With M = M_y(s+a) M_y(s-a): Re(F M) > 0 on 52 % of the
  line (theta = 1/2; 50 % for 1/4) and the longest stretch with Re(F M) > 0 is 1.9 spacings (1.4), although the
  line has no zero at all; mean abs(F M)^2 = 14.1 (50.5). The certificate misses the hole, and the size of abs F
  does not indicate it.

**(iv) Davenport-Heilbronn; heat; sign twist; unimodular twist.** Davenport-Heilbronn. T = 1e+06 (100000 windows): 1522171 real zeros counted against 1700000 expected (deficit 10.5 %, about 88914 off-line pairs), 65220 positive minima with eta >= 0.1 spacings, largest zero-free stretch 8.98 spacings with max abs Z = 12.9 inside (rms 2.69); T = 1e+08 (100000 windows): 1511378 real zeros counted against 1700000 expected (deficit 11.1 %, about 94311 off-line pairs), 64278 positive minima with eta >= 0.1 spacings, largest zero-free stretch 8.85 spacings with max abs Z = 8.4 inside (rms 3.02); T = 1e+10 (20000 windows): 301065 real zeros counted against 340000 expected (deficit 11.5 %, about 19467 off-line pairs), 12565 positive minima with eta >= 0.1 spacings, largest zero-free stretch 7.82 spacings with max abs Z = 14.4 inside (rms 3.33); T = 1e+12 (2000 windows): 29985 real zeros counted against 34000 expected (deficit 11.8 %, about 2007 off-line pairs), 1279 positive minima with eta >= 0.1 spacings, largest zero-free stretch 6.78 spacings with max abs Z = 3.8 inside (rms 3.63). Windows of 17 spacings at T = 1e6: 33358 of 100000 are clean; the largest hole is 3.6 spacings in clean windows and 7.9 in the others; 2525 of the others have a hole of at least 4 spacings, with median max abs Z = 8.9 (median over all windows 7.4). In clean windows the gap statistics are those of the L-functions (table T6). The certificate reports at most 2.2, 2.4, 2.5, 2.2 spacings (theta = 1/2) at the heights run and covers 0.35 of a gap of 3 or more: it does not report the long stretches, which are true zero-free stretches of the line. It reports nothing that is not there. Every stretch of 4 spacings or more lies in a window that holds a positive minimum or whose count of real zeros is at least 2 short (MEASURED, all heights, w = 7, 12, 17): the largest hole in a clean window is 3.9 spacings, against 3.0 to 3.5 for zeta and the two L-functions. The failure named in the task (a missed true hole in a window without off-line zeros) does not occur. The share of missing real zeros grows slowly with the height (10.5, 11.1, 11.5, 11.8 per cent).

- Unimodular twist zeta(s + i alpha): abs F on the line is abs(zeta) at height t + alpha; all statistics are
  zeta's (PROVED).
- Sign twist: the Liouville form zeta(2s)/zeta(s) has poles, not zeros, at the zeros of zeta on the line and no
  zero on it; a random completely multiplicative sign has no continuation to the line. Not formulable as a hole
  test. Backward heat: NOT RUN.

### 4.4 Reading

- The line statistics see a zero only where it is: a zero on the line as a sign change, an off-line pair as a
  missing sign change (a positive minimum when the pair is near the line, a count deficit otherwise). Every
  departure of Davenport-Heilbronn from the L-functions in gap statistics is located in windows that contain
  off-line zeros. This is local resolution of zeros at 10 samples per mean spacing: verified height in the form
  of a sign-change count.
- The hole-to-size law (max abs Z grows like e^(1.66 g) in a gap of g spacings for zeta and the L-functions) is
  a law about stretches with no zero in the strip. A stretch of the line emptied by moving zeros off the line
  (Davenport-Heilbronn, E_a, T-NR) does not raise abs F: for Davenport-Heilbronn at T = 1e6 the 312 gaps of 5 to 5.25 spacings that hold a positive minimum have mean log max abs Z = 1.99, against 7.5 from zeta's law. So "large abs F" certifies neither a hole
  nor its absence on the line without the count.
- The certificate Re(F M) > 0 covers 0.75 of a gap of 2 to 2.5 spacings for zeta at theta = 1/2 and less of
  longer gaps (the mollifier must follow arg F through g pi); its largest certified stretch stays near 2.5
  spacings while the largest gap is 3.4 to 3.5. It never reports a stretch containing a sign change (by
  construction). It does not reach the 7 to 17 spacings of the source at any height.
- The mollified mean square separates Davenport-Heilbronn from the L-functions by constants that grow with y
  (y = 1000: J(1/2) = 3.31 in clean windows and 6.70 in the others for Davenport-Heilbronn, 2.79 and 2.81 for the L-functions; y = 10000: J(1/2) = 5.20 in clean windows and 10.97 in the others for Davenport-Heilbronn, 2.80 and 2.81 for the L-functions; y = 100000: J(1/2) = 11.68 in clean windows and 23.48 in the others for Davenport-Heilbronn, 2.84 and 2.85 for the L-functions; y = 1000000: J(1/2) = 30.45 in clean windows and 78.84 in the others for Davenport-Heilbronn, not run for the L-functions; max abs(b_n) = 11.6, 52.2, 267, 1420 for n <= 1e3, 1e4, 1e5, 1e6). The Dirichlet inverse of a function without Euler product is not bounded. This is a statement about
  coefficients (the mean square of the inverse coefficients); it does not use the position of any zero and is
  equivalent in content to the failure of multiplicativity, visible at n = 6. It does not carry over to the
  controls that have an Euler product: T-NR has zeta's mollifier for y < q and zeta's J times the local mean of
  (2 cos + c)^2; E_a with the product mollifier is an object of degree 2 (J = 14.1 at theta = 1/2) and is not
  comparable with the degree-1 values.

Classification: CLOSED. zeta and the L-functions pass at every size. T-NR returns zeta's answer identically.
E_a has no zero on the line, and neither the size of abs F nor the certificate shows it. Davenport-Heilbronn
departs in gap statistics only in windows containing its off-line zeros, and in the mollified mean square
through its inverse coefficients. No control fails in a window without off-line zeros for a reason tied to zeros.

## 5. Table

| combination | statistic | sizes reached | zeta | L(chi_-4), L(chi_5) | E_a | T-NR q = 1000003 | Davenport-Heilbronn | heat, sign twist, unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|
| 1 Legendre-Riesz LP, own inverse | LP value against psi_k^F(X)/X^k; excess/sqrt X per decade; robust gap | LP-E: X <= 1e7 (k = 0), 3e5 (k = 1), 1e4 (k = 2); LP-R: X <= 3e6; psi_k^F: X <= 1e10 | pinned at 2.2 sqrt X; excess sup 0.44 to 0.66 (k = 0), 0.017 to 0.022 (k = 1), 0.0009 to 0.0011 (k = 2, X >= 1e3) sqrt X; robust gap 0.04 to 0.16 sqrt X (k = 1), exponent 0.66 | zeta form unbounded; with signs chi(n): pinned from 5 to 10 sqrt X, excess 0.07 to 0.11 sqrt X (k = 1) | pinned; excess = zeta's x cosh(a log X): 1.006 (1e3), 1.098 (1e10) for a = 0.02 | identical to zeta for X < q; jump 30 sqrt X at X = q | zeta form unbounded at X = 1e3; pinned with oracle signs from 10 sqrt X | sign twists and unimodular twist: pinned with phases supplied, excess of size sqrt X; heat not formulable | CLOSED: the LP returns psi_k^F from the coefficients; explicit formula; no onset below gamma_off^2 |
| 2 first moment | kappa_F(b), sign of the parts | b <= 40 by quadrature (new objects); b = 127, 251 (T-NR); b = 199999 (periodic); prior lanes: zeta every b <= 1e6 | 0.6955, cotangent part positive for b >= 200 (`s2`, `s4`) | 0.2806 (b = 199999), 0.1121 > 0; parts -0.224 + 0.505, -0.436 + 0.549 | 1.1505 (a = 0.02), 1.5791 (a = 0.25); kappa(b) > 0.81, 1.09 | 4.8102, 4.8098 at b = 127, 251 | 0.4070 > 0; parts -0.183 + 0.590 (b = 199999) | twist: 0.3507, kappa(b) > 0.236; heat, Liouville not formulable | CLOSED: Gram-only, function of abs(F) on the line |
| 3 Cauchy-Schwarz chain | slopes of T(M) and of the floor in log M; loss; E0, E1 | zeta b <= 1e6; periodic b <= 5000; E0, E1 b <= 3e6 and primorials to 6.5e9 | 3.5490, 1.7644; loss 2.0117; E0 = Lambda(b)/2 + O(1/b) | 0.3171, 0.2872, loss 1.104; 0.0940, 0.0458, loss 2.050 | bounded ratio to zeta at b <= 40 | T_F <= (c+2)^4 T_zeta (proved) | 0.6881, 0.6042; loss 1.139 | twist: bounded ratio at b <= 40; others not formulable | CLOSED: two mean-value constants per object; nothing grows faster than log |
| 4 hole test | largest gap, gap law, certified stretch of Re(FM) > 0, window J | zeta: T = 1e+06 (100000 windows), T = 1e+08 (100000 windows), T = 1e+10 (50000 windows), T = 1e+12 (5000 windows); L(chi_-4): T = 1e+06 (100000 windows), T = 1e+08 (100000 windows), T = 1e+10 (20000 windows); L(chi_5): T = 1e+06 (100000 windows), T = 1e+08 (100000 windows), T = 1e+10 (20000 windows); DH: T = 1e+06 (100000 windows), T = 1e+08 (100000 windows), T = 1e+10 (20000 windows), T = 1e+12 (2000 windows) | largest gap 3.38, 3.51, 3.40, 3.16 sp. at T = 1e+06, 1e+08, 1e+10, 1e+12; law slope 1.66; certified 2.5 to 2.7 sp. (theta = 1/2) | same as zeta | no sign change at all (a = 0.02, T = 1e6, 3.4e5 spacings); certified stretch at most 1.9 sp.; abs F not raised | identical to zeta (proved) | gaps to 9.0 sp. with abs Z not raised, all in windows with missing real zeros; clean windows as L-functions | twist = zeta (proved); others not formulable or not run | CLOSED: off-line zeros seen only where the count is short; inverse-coefficient size for the mollifier |

## 6. Units

Started (all through `rhrun`): `rh-s6-zE0`, `-zE1`, `-zE2`, `-zR1`, `-zR2`, `-cpos`, `-csgn`, `-truth` (LP and
sieve, 1 core each, caps 4 to 6 GB), `rh-s6-holetest`, `rh-s6-hole` (GPU 1, 2 cores, caps 4 and 5 GB),
`rh-s6-per` (4 cores, 2 GB), `rh-s6-restat` (1 core, 4 GB). State at the end: every unit of this lane is inactive (`systemctl --user is-active` checked for the twelve unit names). Ended by themselves: `-zE0`, `-truth`, `-holetest`, `-hole`, `-per`, `-restat`. Stopped by me: `-zE1`, `-zE2`, `-zR2`, `-cpos`, `-csgn`. Ended by its own memory limit (6 GB): `-zR1`, during LP-R at X = 1e7. Two earlier launches of the eight LP units failed at once (the code had not arrived: a mistyped rsync target on my side) and left only log lines.
Units of other lanes whose names also begin with `rh-s6-` (`-c2`, `-loew`, `-mom`, `-pick`, `-zrdet`) were not
started by this lane and were not touched.

## 7. Three weakest steps

1. **The hole test is a float64 sampled screen.** Ten samples per mean spacing; zeros are sign changes plus
   parabola-inserted close pairs; "positive minimum" depends on the threshold 0.06 spacings, fixed after one
   30-digit recheck. "Clean window" is a proxy (count and minima), not a certificate that no off-line zero is
   inside; for Davenport-Heilbronn the off-line zeros themselves were not located at these heights. The
   certificate of 4.1 is a sampled positivity test, not a sum-of-squares decomposition and not an interval proof.
   The windows are contiguous blocks, and the block lengths at T >= 1e10 are below the 1e5 windows of the task.
2. **The LP statements are solver vertices.** "Pinned" means abs(gap) below the stated multiple of sqrt X; the
   control runs carried a box bound and a constraint tolerance 1e-7; for k = 1 from 1e6 and k = 2 from 1e5 HiGHS
   fails, so the pin for k >= 1 beyond 3e5 rests on `e2` (X^0.7) and on the mechanism, not on a solve. The level
   thresholds 5 and 10 sqrt X for the two-sided systems are from X <= 3e5 and are not laws; the rigidity argument
   is ARGUED. LP-R was run for zeta only.
3. **Combinations 2 and 3 add little.** The decisive facts are the lemmas of `s2`; the new cells for E_a and the
   twist stop at b = 40 with accuracy 1e-3 (truncation of the quadrature at abs(t) = 3000), which cannot resolve
   the residual sign law; T-NR at q = 1000003 stops at b = 251; the periodic chain at b = 5000. The closed form
   for E0 is elementary and unrefereed.

## 8. Files

`c1/` LP and sieve (`lp.py`, `objects.py`, `run_e.py`, `run_r.py`, `truth.py`, `analyse_truth.py`, `validate.py`,
`saw.py` copied from `e2`, run scripts). `c2/quad_gram.py`. `c3/cs_chain.py`, `c3/e0e1.py`. `c4/hole.py`,
`hole_stats.py`, `ea_line.py`, `validate_hole.py`, `recheck_min.py`, `find_viol.py`, `show_hole.py`, run scripts.
`c2/s5.c`, `gtab.h`, `tabs.h`: the program of `s5`, copied unchanged to compile it in this lane's server directory.
`RESULT.tmpl.md`, `gen_tables.py`, `make_fill.py`, `build_result.py`: this file is built from the result files.
`fetch.sh`: copies results back. `out/`: local results; `out/server/`: server logs,
`truth_1e10.json`, `h_*.json`, `per*_b199999.txt`. The sample arrays (`h_*.npz`, 3.0 GB in total) stay on the server in
`~/rh-push/s6-moebius-lp-first-moment-reciprocity/c4/`. `out/v1/` and `*_v1stats.json`: superseded first passes
(before the close-pair insertion), kept for the record.
