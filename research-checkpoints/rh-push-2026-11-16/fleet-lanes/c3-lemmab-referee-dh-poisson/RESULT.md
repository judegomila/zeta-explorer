# c3-lemmab-referee-dh-poisson: full proof of Lemma B, its Poisson dual, DH and Liouville forms, size of the residue sum

Date: 2026-11-18. Kind: deepen (source: `push/c2-euler-at-zeros/RESULT.md` section 5 and its REFEREE.md).
Nothing here proves or refutes RH or moves any bound. No statement about zeros of zeta is made.
Labels: PROVED (argument given here, unrefereed), CLASSICAL, MEASURED (float64 and python-flint midpoints, not interval), OPEN.
All runs local under `scripts/memcap.sh 8` with `.venv-arb`; the compute server was not used (no units to stop).

## 0. Verdict

**Restatement (closed).** The decisive test came out "yes".

- Lemma B is correct and is now proved in full (section 2), including the k = 0 residue in closed form for |S| = 1
  (tested at T = 0, where it is the dominant term) and the exact Diophantine input.
- **Poisson dual (section 3, PROVED for |S| = 1, MEASURED).** The residue sum is, term by term, a sum over Lambda(n) with
  log n in the shifts j log p of the support: it equals Weil's "pole term minus prime sum" for the test
  `g = Z_p w = sum_j p^(-j/2) w(. - j log p)`, truncated at n <= e^Y on both sides and taken to the limit. The lattice
  samples of zeta'/zeta on Re s = 1 are the Fourier coefficients of that regularised prime sum. For general S the same
  statement holds as a limit eps -> 0+ of the classical explicit formula for the tests with coefficients m^(-1/2-eps).
  Lemma B carries no information beyond the explicit formula on a class of non-compactly supported tests.
- The identity holds for DH (8 cases, relative 4e-12, with off-line pairs carrying up to 61% of the zero side) and has a
  form for zeta(2s)/zeta(s) (5 cases, 2e-11 to 2e-10) that is not a Krein sum.
- Size (section 5): for p <= 1000, T <= 2e4, `|E| = |R_S - Obar| <= 2.60` (rms 0.66 to 1.17). The bound `2 sqrt(p) M` of
  Corollary B1 is 5 to 110; the loss is the factor sqrt(p), which comes from a worst-case estimate of the profile and
  not from zeta. With the exact Parseval factor `kappa_b(p)` (1.00 to 1.20 for the sin^6 profile) the bound is
  `2 kappa_b M` = 2.75 to 5.14, at best a factor 1.4 above the measured value. Corrected Corollary B1': section 5.
- No inequality step was found that is false for DH and for the unimodular twist for a structural reason; the only
  inequality (zeta'/zeta(1+it) = o(log t)) is the classical zero-free region. All four requirement flags are false.
- Pivot (one, section 6): the shifted multiplier `zeta_p(s - theta)`, 0 < theta < 1/2, moves the lattice samples to
  Re s = 1 - theta inside the strip (identity verified, 21 cases, relative <= 4e-9). Its Poisson dual converges only in
  the zero-free half-plane, and its positivity is implied by, and of the same type as, `Re xi'/xi > 0` right of the
  critical line. Restatement; closed.

## 1. Plan; what is new against the source and the map

Read: BRIEF; OBSTRUCTION_MAP rows P10, P13, wall 3 and corollary (a)-(c); `c2-euler-at-zeros` RESULT section 5 and
REFEREE (which left the k = 0 residue and the small-divisor bound unchecked and the DH form not run).
New here: (i) complete proof with the horizontal segments and the named Diophantine theorem; (ii) the k = 0 residue
for |S| = 1 in closed form and a numerical test in which it is not negligible; (iii) the Poisson identity and the
identification with the regularised Weil formula; (iv) the DH and Liouville forms, run; (v) measured size against
the bound, and the corrected constant; (vi) the theta-family (pivot).
Not re-run: the depletion statistics and Gaussian-window tables of c2.

Notation as in c2: `z = s - 1/2`, `W(z) = int w(t) e^(-zt) dt`, `W#(-z) = conj W(-conj z)`, `V(z) = W(z) W#(-z) = int C_w(y) e^(-zy) dy`
with `C_w(y) = int w(v+y) conj w(v) dv` (support |y| <= T_w), `Phi = zeta_S(1/2+z) zeta_S(1/2-z) V(z)`,
`L(z) = xi'/xi(1/2+z) = G(z) + zeta'/zeta(1/2+z)`, `G = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2)`, `2 Re G(i tau) = Omega(tau)`.
For S = {p}: `L_p = log p`, `t_k = 2 pi k/L_p`, `h(y) = e^(-y/2) C_w(y)`, `F(t) = V(1/2+it) = W(1/2+it) conj W(-1/2+it) = int h(y) e^(-ity) dy`.

## 2. Lemma B: full proof

**Lemma B. PROVED.** S a finite set of primes, `N_S = prod p`, w smooth with support in an interval of length T_w. Then

    sum_rho Phi(rho - 1/2) = (1/2pi) int Omega |zeta_S W|^2 d tau
       + 2 Re sum_{p in S} sum_{k != 0} (1/log p) zeta_S(1+it_k) zeta_{S-p}(-it_k) (zeta'/zeta)(1+it_k) V(1/2+it_k)       [t_k = 2 pi k/log p]
       + 2 (-1)^(|S|+1) Re sum_{n >= 2; m, m' in N_S; N_S m m' n <= e^T_w} Lambda(n) (N_S m/(m' n))^(1/2) C_w(-log(N_S m m' n))
       - 2 Re Res_{z = 1/2} [ Phi(z) (zeta'/zeta)(1/2+z) ].

The residue sum converges absolutely. The third line is empty for `T_w < log(2 N_S)`.

Proof.
(a) *Zero side.* For a zero rho = beta + i gamma, `|1 - q^(-(1-beta) - i gamma)| >= 1 - q^(-(1-beta)) >> (1-beta) log q >> 1/log|gamma|`
(classical zero-free region), so `|zeta_S(1/2 +- (rho - 1/2))| << (log|gamma|)^|S|`; V decays faster than any power on
vertical strips; `N(T) << T log T`. The zero sum converges absolutely.
(b) *Rectangle.* Fix c > 1/2. There are `U_n in [n, n+1]` with (i) `|| U_n log q/(2 pi) || >= delta_S` for every q in S and
(ii) `|U_n - gamma| >= c_0/log n` for all ordinates gamma. Measure count: the set violating (i) for a given q has measure
at most `2 delta (1 + 2 pi/log q)` in a unit interval; the set violating (ii) has measure at most `2 c_0 N(n, n+1)/log n`; choose
delta_S and c_0 so that the total is below 1. No Diophantine input is used here. On `Im z = +-U_n`, `|Re z| <= c`:
`|1 - r e^(i phi)| >= min(1, |sin phi|)` for every r > 0, so `|zeta_S(1/2 +- z)| <= (4 delta_S)^(-|S|)`; `L << log^2 n` (CLASSICAL,
Titchmarsh 9.6); V is `O(n^-A)`. The horizontal integrals tend to 0.
(c) *Residue theorem.* The poles of `Phi L` in `|Re z| < c` are the zeros (residue `Phi(rho - 1/2)` with multiplicity) and the
poles of Phi: `z = +-(1/2 + it)`, `t = 2 pi k/log p`. For k != 0 they are simple: `k log q = k' log p` with k k' != 0 is
impossible for distinct primes (unique factorisation). No zero lies on Re s = 1 (CLASSICAL), so L is finite there.
Hence `sum_rho Phi = lim_n (1/2 pi i) [int_(c) - int_(-c)]_{|Im z| < U_n} Phi L dz - sum_{poles of Phi, |Im| < U_n} Res(Phi L)`.
(d) *Symmetry.* `Phi(-conj z) = conj Phi(z)`, `L(-conj z) = -conj L(z)`. So the left line is the conjugate of the right line, and
`Res_{-conj z_0} = conj Res_{z_0}`: `sum_rho Phi = 2 Re [ J - sum_{Re z_0 = 1/2} Res(Phi L) ]`, `J = (1/2 pi i) int_(c) Phi L dz`.
(e) *Right line, Dirichlet part.* For Re z = c > 1/2: `zeta_S(1/2 - z) = (-1)^|S| N_S^(1/2-z) zeta_S(z - 1/2)` (local functional
equation), and `zeta_S(z - 1/2)`, `zeta_S(1/2+z)`, `zeta'/zeta(1/2+z)` are absolutely convergent series:
`Phi zeta'/zeta = (-1)^(|S|+1) sum Lambda(n) (N_S m)^(1/2) (m' n)^(-1/2) (N_S m m' n)^(-z) V(z)`, with
`sum Lambda(n) (N_S m)^(1/2-c) (m' n)^(-1/2-c) < inf` and `int |V(c + i tau)| d tau < inf`. Termwise,
`(1/2 pi i) int_(c) x^(-z) V(z) dz = C_w(-log x)`, zero for `log x > T_w`. This gives half of line 3; `x >= 2 N_S` always.
(f) *Right line, archimedean part.* `Phi G` is moved from Re z = c to Re z = 0 over the same segments (`G << log`):
`J_G = (1/2pi) int Phi(i tau) G(i tau) d tau + sum_{Re z_0 = 1/2} Res(Phi G)`. `Phi(i tau) = |zeta_S W|^2 >= 0`, and the real part gives line 1.
(g) *Residues.* (d)-(f) leave `-2 Re sum Res(Phi zeta'/zeta(1/2 + .))`. At `z_0 = 1/2 + it_k`, k != 0:
`(1 - p^(z-1/2))^-1 = -1/((z - z_0) log p) + O(1)`, so the residue is `-(1/log p) zeta_S(1+it_k) zeta_{S-p}(-it_k) (zeta'/zeta)(1+it_k) V(1/2+it_k)`: line 2.
At z = 1/2 all |S| factors and zeta'/zeta have poles: order |S|+1, line 4.
(h) *Convergence of the residue sum.* As a limit over `|t_k| < U_n` it converges because every other term does. Absolute
convergence: `|zeta_S(1+it)| <= prod p/(p-1)`, `zeta'/zeta(1+it) << log|t|`, V decays faster than any power, and
`|zeta_{S-p}(-it_k)| = prod_{q != p} |1 - q^(i t_k)|^-1`, `|1 - q^(it_k)| = 2 |sin(pi k log q/log p)| >= 4 || k log q/log p ||`.
**Diophantine input used:** a lower bound for the linear form `Lambda = k log q - k' log p != 0` that is a *power* of
`B = max(|k|, |k'|)`: `|Lambda| >= B^(-kappa(p,q))`. This is Fel'dman's form of Baker's theorem (1968); an explicit version
is Baker-Wustholz (1993): `log|Lambda| > -C(n,d) h'(alpha_1) h'(alpha_2) log B` with n = 2, d = 1,
`C(2,1) = 18 * 3! * 2^3 * 32^4 * log 4` (about 1.26e9; constant quoted from memory, to be checked against the source), so
`kappa = C(2,1) log p log q`. The two-logarithm bounds of Laurent-Mignotte-Nesterenko type, `exp(-C (log B)^2)`, are *not*
sufficient for a general smooth w (they are not dominated by "faster than any power"). For |S| = 1 there are no small
divisors and nothing is needed. QED.

Corrections to the source statement. (1) The k = 0 term is not bounded by "a polynomial in T_w times |W(1/2) W(-1/2)|"
in general; it involves `V^(j)(1/2)`, j <= |S|, i.e. the moments `int y^j e^(-y/2) C_w(y) dy`, and is bounded by
`C_S (1 + T_w)^|S| int e^(-y/2) |C_w(y)| dy`, or by `C_S r^(-|S|) max_{|z - 1/2| = r} |V(z)|` (which is `O_b(T^-A)` for `w = e^(iTt) b`).
(2) The pairwise incommensurability hypothesis is automatic (referee's remark, confirmed).

**k = 0 term for S = {p}. PROVED; MEASURED check.** With `eps = z - 1/2`: `(1 - p^eps)^-1 = -1/(eps L_p) + 1/2 + O(eps)`,
`zeta'/zeta(1+eps) = -1/eps + gamma + O(eps)`, `zeta_p(1+eps) V(1/2+eps) = (p/(p-1)) [F(0) - eps (L_p F(0)/(p-1) + int y h(y) dy)] + O(eps^2)`:

    line 4 = 2 (p/(p-1)) Re [ F(0) (gamma/L_p + 1/2 + 1/(p-1)) + (1/L_p) int y h(y) dy ].

Test at T = 0 (w = sin^6 real; `poisson_test.py`, `poisson_test.json`): the k = 0 term is the largest term on the right.

| p | T_w | zero side (20000 zeros, both signs) | arch | residues k != 0 | k = 0 term | third line | zero - right side |
|---|---|---|---|---|---|---|---|
| 2 | 0.65 | 1.14880583e-2 | -0.304360946 | -0.068281815 | +0.384130819 | 0 | 6.0e-12 |
| 3 | 1.05 | 2.77401467e-3 | -0.492002683 | +0.004796097 | +0.489980600 | 0 | 5.3e-12 |
| 2 | 1.3 | 4.19996194e-4 | -1.494672668 | -0.030989007 | +1.526081671 | 0 | 3.1e-11 |
| 5 | 1.6 | 1.38403405e-5 | -0.778762919 | +0.093890009 | +0.684886750 | 0 | -4.4e-12 |
| 2 | 2.5 | 4.20885505e-9 | -5.503694048 | +0.000039977 | +5.501133317 | +0.00252076 (8 terms) | -1.3e-11 |

The differences are absolute and at the float64 cancellation level (terms of size 0.3 to 5.5). Without the k = 0 term
the identity fails by factors 33 to 1.3e9 of the zero side. Rows 3 and 5 also test `log p < T_w < log(2p)` and `T_w > log(2p)`.

## 3. Decisive test: Poisson summation in k (S = {p})

**By hand.** Let `D(t) = -zeta'/zeta(1+it) - 1/(it)` (t != 0), `D(0) = -gamma`. For every real t,
`D(t) = lim_Y [ sum_{n <= e^Y} Lambda(n) n^(-1-it) - (1 - e^(-itY))/(it) ]` (CLASSICAL, prime number theorem with remainder; the
partial expressions are `O(1 + |t|)` uniformly in Y). For fixed Y, Poisson summation for the Schwartz function F and the
finite measure `dE_Y = sum_{n <= e^Y} (Lambda(n)/n) delta_{log n} - 1_[0,Y] dy` gives
`(1/L_p) sum_k F(t_k) int e^(-it_k y) dE_Y(y) = int H(y) dE_Y(y)`, `H(y) = sum_j h(j L_p - y)` (L_p-periodic, smooth).
Dominated convergence in k (F decays faster than any power) and `(1/L) sum_{k != 0} e^(-it_k x)/(it_k) = {x/L} - 1/2` give

**Proposition P (Poisson dual). PROVED.** For S = {p}, every T_w:

    (1/L_p) sum_{k != 0} (zeta'/zeta)(1+it_k) F(t_k) = - P_reg - (gamma/L_p) F(0) - int h(x) ({x/L_p} - 1/2) dx,

    P_reg = lim_{Y -> inf} [ sum_{n <= e^Y} Lambda(n) n^(-1/2) sum_{j in Z} p^(-j/2) C_w(j L_p - log n)  -  int_0^Y H(y) dy ].

With the k = 0 term of section 2, lines 2 + 4 of Lemma B equal `2 (p/(p-1)) Re [ -P_reg + int h(x) floor(x/L_p) dx + (p/(p-1)) F(0) ]`.
The terms j < 0 have weight `p^(|j|/2)`; line 3 of Lemma B equals
`2 (p/(p-1)) Re sum_n sum_{J >= 1} Lambda(n) n^(-1/2) (p^(J/2) - p^(-J/2)) C_w(-J L_p - log n)` and converts them to `p^(-|j|/2)`. Result:

    sum_rho Phi = (1/2pi) int Omega |zeta_p W|^2
                  - lim_Y [ Prime_Y(g) - 2 (p/(p-1)) Re int_0^Y H ]  +  2 (p/(p-1)) Re [ (p/(p-1)) F(0) + int h floor(x/L_p) dx ],
    Prime_Y(g) = 2 Re sum_{n <= e^Y} Lambda(n) n^(-1/2) C_g(log n),   C_g(x) = (p/(p-1)) sum_j p^(-|j|/2) C_w(j L_p - x),   g = Z_p w.

`Prime_Y(g)` is the Weil prime sum of the test g, truncated. It diverges like `(Y/L_p) F(0)`, which is the divergence of
the Weil pole term `2 Re int C_g(x) e^(-x/2) dx = 2 (p/(p-1)) Re sum_j p^(-|j|/2 - j/2) F(0)` over j <= 0. So Lemma B for |S| = 1 is
Weil's explicit formula for `g = Z_p w` with pole term and prime sum truncated together: **the answer to the test is yes.**
The numbers `(zeta'/zeta)(1+it_k)` enter only as Fourier coefficients of the L_p-periodised prime measure.

**General S. PROVED (by uniqueness, not termwise).** For eps > 0 let `g_eps = sum_{m in N_S} m^(-1/2-eps) w(. - log m)`. Then
`g_eps * g_eps~ = O(e^(-(1/2+eps') |x|))`, Weil's explicit formula applies (CLASSICAL) with convergent pole term and prime sum,
and the zero side and the archimedean term are continuous at eps = 0 (bounds of step (a)). Hence
`lines 2 + 3 + 4 of Lemma B = lim_{eps -> 0+} [ Pole(g_eps) - Prime(g_eps) ]`. A termwise Poisson identity for |S| >= 2 needs Abel
summation in the variables of `zeta_{S-p}(-it)` (boundary of convergence) and was not written.

**Numerically** (`poisson_test.py`; `zeta'/zeta(1+it_k)` from python-flint at 34 to 70 lattice points; primes to 1e8, 100 MB sieve).
Left side against right side with the sharp cut-off X = e^Y:

| p | T_w | T | left side | abs diff at X = 1e5 | 1e6 | 1e7 | 1e8 | diff * sqrt(X) at 1e8 |
|---|---|---|---|---|---|---|---|---|
| 2 | 0.65 | 0 | -0.0170704537 | 4.6e-5 | 6.0e-5 | 6.4e-6 | 8.8e-7 | 0.009 |
| 3 | 1.05 | 0 | +0.0015986991 | 4.6e-6 | 1.0e-7 | 3.0e-6 | 2.3e-7 | 0.002 |
| 2 | 1.3 | 0 | -0.0077472518 | 8.3e-5 | 1.2e-4 | 3.5e-5 | 2.9e-6 | 0.029 |
| 5 | 1.6 | 0 | +0.0375560038 | 1.7e-4 | 5.5e-6 | 5.4e-5 | 3.7e-7 | 0.004 |
| 2 | 2.5 | 0 | +0.0000099942 | 5.0e-4 | 3.6e-4 | 1.3e-4 | 1.7e-5 | 0.168 |
| 2 | 0.65 | 40 | -0.0861468 + 0.0090297 i | 1.7e-5 | 8.8e-5 | 1.0e-5 | 9.4e-6 | 0.094 |
| 3 | 1.05 | 100 | -0.1497033 + 0.0396857 i | 2.6e-4 | 1.1e-4 | 4.4e-5 | 3.5e-6 | 0.035 |
| 7 | 1.9 | 60 | -0.0938912 - 0.0727832 i | 1.0e-3 | 2.7e-4 | 1.3e-4 | 7.5e-6 | 0.075 |

The difference times sqrt(X) stays between 0.002 and 0.41 over three decades: convergence at the rate `X^(-1/2)` of the
truncated prime sum (the size of the zero terms `x^(rho-1)`), as expected of an identity. Agreement at X = 1e8: 4 to 6
digits of the terms involved (`(1/L) sum |F(t_k)|` is 0.09 to 1.2); in row 5 the left side itself is 1e-5 after
cancellation and only its order is resolved. The sawtooth identity for the pole samples agrees to 1e-15.

Consequence. The lead "residue sum on Re s = 1 as a new handle" is closed: it is the prime side of the explicit
formula in the Fourier basis of the lattice, convergent because the pole term is subtracted at the same truncation.

## 4. DH form and Liouville form (run)

**DH. PROVED form; MEASURED.** f = Davenport-Heilbronn function of conductor 5, `xi_f(s) = (5/pi)^(s/2) Gamma((s+1)/2) f(s) = xi_f(1-s)`,
entire, `-f'/f = sum_{n >= 2} Lambda_f(n) n^-s` (all integers n; `Lambda_f(2..7) = 0.1969, -0.3121, -1.4422, 0, 1.9364, 0.5528`),
absolutely convergent for `Re s >= sigma_1`. The proof of section 2 applies with c > sigma_1 - 1/2 (to the right of all zeros,
including those in Re s > 1): steps (b)-(g) use only the symmetry of `xi_f'/xi_f`, the series on the right line, and the
local functional equation of the test factor. The lattice points must avoid zeros of f on Re s = 1 (otherwise a
double pole). Result: Lemma B with `Omega_f(tau) = log(5/pi) + Re psi(3/4 + i tau/2)`, `f'/f(1+it_k)`, `Lambda_f` in line 3, the zero
sum over all nontrivial zeros, and a k = 0 pole of order |S| only. `dh_form.py`, zeros from `c2-euler-at-zeros/dh_zeros_1000.json`
(848 on-line, 28 off-line pairs, none with Re s > 1 below height 1000), `w = e^(iTt) sin^6`:

| S | T_w | log(2 N_S) | T | zero side | of which off-line pairs | arch | residues | line 3 | rel. diff | R / Obar |
|---|---|---|---|---|---|---|---|---|---|---|
| {2,3} | 2.4 | 2.485 | 500 | 12.35160214 | -2.4e-14 (14 pairs) | 11.78399191 | 0.56761023 | 0 | 4.4e-12 | 6.27 / 5.98 |
| {7} | 2.5 | 2.639 | 500 | 4.29090404 | 1.5e-11 (13) | 3.93864819 | 0.35225585 | 0 | 4.4e-12 | 6.52 / 5.99 |
| {2,3,5} | 3.3 | 4.094 | 450 | 14.06781558 | -5.4e-8 (9) | 11.34724240 | 2.72057318 | 0 | 3.9e-12 | 7.30 / 5.89 |
| {2,3,5} | 3.3 | 4.094 | 560 | 18.89532245 | -8.4e-4 (10) | 16.17075183 | 2.72457062 | 0 | 4.3e-12 | 7.13 / 6.10 |
| {5} | 1.55 | 2.303 | 500 | 2.68921535 | 2.7e-9 (17) | 2.61637952 | 0.07283583 | 0 | 4.6e-12 | 6.15 / 5.99 |
| {2} | 2.5 | 1.386 | 500 | 9.32158334 | 8.2e-12 (13) | 8.17564180 | 1.14623123 | -2.897e-4 (8 terms) | 4.2e-12 (-3.1e-5 without) | 6.82 / 5.98 |
| {3} | 3.2 | 1.792 | 520 | 8.26857428 | **5.06255** (10) | 7.42296894 | 0.84584380 | -2.385e-4 (8) | 4.3e-12 (-2.9e-5 without) | 6.71 / 6.03 |
| {2,3} | 4.0 | 2.485 | 400 | 24.10112626 | 1.6e-9 (5) | 22.33231972 | 1.76890744 | -1.009e-4 (20) | 4.5e-12 (-4.2e-6 without) | 6.22 / 5.76 |

The identity holds for DH to 4e-12 in all 8 cases, including one where the off-line pairs are 61% of the zero side and
three with line 3 built from `Lambda_f` at non-prime-powers (n = 6: 1.936). So the identity does not separate
(R3 fails at the identity, now measured). In these windows `max |f'/f(1+it_k)| <= 4.66` and the Krein sum is positive with
`R > Obar` (E > 0 in all 8; for zeta the mean of E is negative).

**Liouville, zeta(2s)/zeta(s). PROVED form; MEASURED.** Divisor in the strip: zeros at rho/2, poles at rho, pole at s = 1/2, zero at
s = 1. It is not invariant under `z -> -conj z`, so step (d) is not available: both lines are evaluated separately, the left
one with the functional equation of zeta applied to each factor (`g(s) = log pi - psi(s/2)/2 - psi((1-s)/2)/2`). For
`T_w < log(2 N_S)`, with `B_k = (1/log p) zeta_S(1+it_k) zeta_{S-p}(-it_k) V(1/2+it_k)` and up to terms at z = 0 and k = 0 of size
`|W(0)|^2` and `max_{|z-1/2|=r} |V|`:

    sum_rho Phi(rho/2 - 1/2) - sum_rho Phi(rho - 1/2)
        = -(1/2pi) int Phi(i tau) [2 g(1 + 2 i tau) + Omega(tau)] d tau - 2 Re sum B_k (zeta'/zeta)(1+it_k)
          + 2 sum [ B_k (zeta'/zeta)(2+2it_k) + conj( B_k (zeta'/zeta)(1+2it_k) ) ].

The second zero sum with the Omega term and the first residue sum is Lemma B. The remaining zeta(2s) part was checked
(`liouville_form.py`; zeros up to height 2(T + X) from the Arb list):

| S | T_w | T | sum_rho Phi(rho/2 - 1/2) | arch part | residue part | abs diff | rel |
|---|---|---|---|---|---|---|---|
| {2} | 0.65 | 3000 | 3.3402998 - 0.1522541 i | 4.0245088 - 0.0000489 i | -0.6842090 - 0.1522052 i | 9.5e-11 | 2.8e-11 |
| {3} | 1.05 | 2000 | 4.3622638 - 0.0462118 i | 4.5877259 - 0.0000888 i | -0.2254621 - 0.0461230 i | 1.1e-10 | 2.5e-11 |
| {2,3} | 1.7 | 3000 | 8.5050047 - 0.6082673 i | 9.9662450 - 0.0001210 i | -1.4612403 - 0.6081462 i | 2.4e-10 | 2.8e-11 |
| {2,3,5} | 3.3 | 4000 | 8.7444077 - 12.5200969 i | 127.2788287 - 0.0011134 i | -118.5344210 - 12.5189835 i | 6.2e-10 | 4.0e-11 |
| {7} | 2.5 | 5000 | 9.0793788 + 0.8712807 i | 9.7015508 - 0.0000658 i | -0.6221720 + 0.8713465 i | 2.0e-9 | 2.2e-10 |

The identity exists and uses data on Re s = 1 and Re s = 2 only; the zero sum is complex (not Hermitian) and there is no
positivity statement to test. Liouville fails at step (d): no functional equation pairing the divisor with itself.

## 5. Size of the residue sum against the Cauchy-Schwarz bound (S = {p}, T_w = log p)

For `T_w <= L_p`: `Den = (p/(p-1)) ||w||^2` exactly, `E = R_S - Obar = (2/||w||^2) Re (1/L_p) sum_k (zeta'/zeta)(1+it_k) F(t_k)` (k = 0 term `O(T^-A)`), and
`(1/L_p) sum_k |F(t_k)| <= kappa_b(p) ||w||^2`, `kappa_b(p) = (int |w|^2 e^-t int |w|^2 e^t)^(1/2) / ||w||^2` (Cauchy-Schwarz and exact Parseval).

**Corollary B1' (corrected constant). PROVED from Lemma B.** `|E| <= 2 kappa_b(p) M + O_b(T^-A)`, `M = max |zeta'/zeta(1+it)|` over the lattice
points carrying the weight. `kappa_b(p) <= sqrt(p)` always (the bound used in c2), but for a fixed profile scaled to `[0, log p]` it
is the square root of the product of the moment generating function of `|b|^2` at +-1: 1.002 (p = 2) to 1.203 (p = 997) for
sin^6, and tends to 1 if the support is shortened. The threshold `T_0 >= exp(c p^(3/2))` stated in c2 is a property of the
bound `sqrt(p)`, not of the class: with `kappa_b` the condition is `2 kappa_b(p) M(T) < Obar(T)`.

MEASURED (`sizes.py`, `sizes.json`): all 168 primes p <= 1000, 48 heights T in [100, 20009.1] (16 spread values and 8 translates
by 0.37 to 9.1 at each of 1e3, 5e3, 1e4, 2e4), 49 lattice points per case (tail weight below 1e-16), 8064 cases.
`M` = max of `|zeta'/zeta(1+it)|` over `|t - T| <= 12` (grid 0.02) and the weighted lattice points: between 1.37 and 2.14.

| p range | cases | max abs E | rms E | mean E | `2 kappa_b M` (median) | `2 sqrt(p) M` (median) | c2 constant (median) | min / median of `2 sqrt(p) M / abs E` | `kappa_b` |
|---|---|---|---|---|---|---|---|---|---|
| 2-7 | 192 | 2.55 | 1.17 | -1.00 | 3.52 | 6.7 | 21.4 | 2.0 / 7 | 1.002-1.015 |
| 11-47 | 528 | 1.98 | 0.66 | -0.28 | 3.47 | 17.7 | 25.9 | 6.1 / 42 | 1.023-1.059 |
| 53-199 | 1488 | 1.90 | 0.72 | +0.03 | 3.65 | 37.8 | 45.0 | 13.5 / 70 | 1.063-1.115 |
| 211-499 | 2352 | 2.31 | 0.88 | +0.04 | 3.80 | 63.5 | 70.5 | 21.4 / 99 | 1.117-1.161 |
| 503-997 | 3504 | 2.60 | 1.01 | +0.06 | 3.93 | 92.6 | 99.5 | 29.1 / 125 | 1.162-1.203 |

- True size: `|E| <= 2.60` in all 8064 cases (largest: p = 971, T = 5004.1, E = -2.598). The rms grows slowly with p (about
  0.66 to 1.07 from p = 11 to 997) because the window in height narrows like `2 pi/log p`; the mean follows `-2 log p/(p-1)`
  (p = 2: -1.30 against -1.39) and is 0 within noise for p > 50.
- `2 sqrt(p) M` overstates by a factor 2 to 125 that grows like sqrt(p); `2 kappa_b M` is 2.75 to 5.14, and the tightest case
  has ratio 1.4 (p = 977, T = 200). The remaining loss is the phase alignment of 49 samples.
- `2 kappa_b M < log(T/2 pi)` in every case with T >= 700 and in 67% of the cases with 100 <= T <= 400. With a certified M this
  would give `R_S > 0` on the class for those (p, T) without any zero input. M was measured, not certified.
- Under translation of the height by 0.4 to 9 (p = 997, T = 1e4): E = +1.08, +1.67, +1.47, -0.22, -0.56, +0.56, +1.23, -0.54, -1.38;
  E is an oscillating quantity of size 1, as expected of a regularised prime sum with phases `n^(-iT)`.
- The j = 1 block of the Poisson form taken in absolute value, `(2/||w||^2) sum_n Lambda(n) (np)^(-1/2) |C_b(L_p - log n)|`, is 0.69 (p = 2)
  to 7.09 (p = 997) and grows like a power of p: a height-uniform bound for E cannot come from absolute values of the
  prime side; the blocks j >= 2 do not converge absolutely at all.

For |S| >= 2 (question left by c2): in the range `T_w < log(2 N_S)` the residue sum divided by Den is E, whose long-average
mean is `-2 sum_{p in S} log p/(p-1)` (c2 Lemma A; -3.94 for S = {2,3,5,7}, with single-window values E = -2.03 and -2.15 against
Obar 6.17 and 7.56 at T = 3000 and 12000 in c2's `test2.json`). It is not small
against log T for large S; a bound `o(log T)` at fixed S is OPEN and, by section 3, is a bound for a regularised prime sum on
Re s = 1 with small-divisor weights.

## 6. Controls: the step that fails for each

Steps of the argument "Lemma B, then Corollary B1": (I-a) symmetric contour (functional equation); (I-b) right line
evaluated by an absolutely convergent Dirichlet series and the local functional equation of the test factor;
(II) Poisson dual (Dirichlet series plus prime number theorem on Re s = 1); (III) the inequality `zeta'/zeta(1+it) = o(log t)`
(classical zero-free region: Euler product, Lambda >= 0, the pole); (IV) Cauchy-Schwarz and Parseval.

| Control | Step that fails | Kind | Evidence |
|---|---|---|---|
| DH (conductor 5) | (III), and (II) | inequality step; structural: without an Euler product f has zeros in Re s > 1 (CLASSICAL) and no 3-4-1 argument; `-f'/f` has no convergent series on Re s = 1 | (I) holds: 8 cases at 4e-12, MEASURED. (III) false by citation; below height 1000 the lattice values are bounded (max 4.66), so the failure is not seen in the run |
| E_a = zeta(s+a) zeta(s-a) | (III) is unproved; the conclusion `R > 0` on the class is not refuted | the samples are `zeta'/zeta(1 +- a + it_k)`, one line inside the strip; on RH they are `O((log t)^(2a))` and positivity holds although E_a has its zeros off its line | by hand (this is the theta-family of section 7 with theta = a); not run. The class does not detect the off-line zeros of E_a |
| backward heat, tau = -0.5 | (I-b) | structural: no Dirichlet series, the right line does not reduce to a finite sum | by hand; not run |
| Liouville zeta(2s)/zeta(s) | (I-a) | structural: divisor not symmetric; the identity exists but its zero sum is complex | 5 cases at 2e-11 to 2e-10, MEASURED |
| unimodular twist U | height shift `p^(-i alpha)`: nothing fails (Lemma B holds verbatim with `t_k + alpha`, since only `L(-conj z) = -conj L(z)` is used; its zeros are on the line and (III) holds). Generic unimodular completely multiplicative u: (I-a), no functional equation | U passes the inequality step | by hand |
| window translate | nothing fails | every term depends on w through `C_w` only, which is translation invariant; a height translate changes E by O(1) (section 5) | PROVED (one line); MEASURED for height translates |
| non-multiplicative multiplier in place of zeta_S | (I-b) has no analogue (no lattice of poles); a finite Dirichlet polynomial gives the classical formula with a finite prime sum, and `R > 0` at large height holds for it trivially | not an inequality step | by hand |

Scoring rule of the assignment. R3 would rise only for an inequality step false for DH and for U for a structural
reason. The only inequality step is (III); it is false for DH and true for U (height shift), and it is the classical
zero-free region (map row P13, wall 3). R3 does not rise. R1 would rise only if that step were false for a
non-multiplicative multiplier in place of zeta_S; step (III) does not involve the multiplier. R1 does not rise.

## 7. Pivot: the theta-family (lattice samples inside the strip)

Replace the multiplier by `zeta_p(s - theta)`, 0 < theta < 1/2 (test `g = sum_j p^(j(theta - 1/2)) w(. - j log p)`, still in L^2). The poles of
`Phi_theta = zeta_p(1/2 - theta + z) zeta_p(1/2 - theta - z) V(z)` are at `z = +-(1/2 - theta + it_k)`; the proof of section 2 goes through unchanged
(the pole of G at z = 1/2 is now separate and gives the Weil pole term). **PROVED; MEASURED.** For `T_w < log(2p)`:

    sum_rho Phi_theta(rho - 1/2) = (1/2pi) int Omega |zeta_p(1/2 - theta + i tau) W|^2 d tau + 2 Re [ zeta_p(1-theta) zeta_p(-theta) F(0) ]
        + 2 Re sum_{k in Z} (1/L_p) zeta_p(1 - 2 theta + it_k) (zeta'/zeta)(1 - theta + it_k) V(1/2 - theta + it_k).

`theta_family.py`: p in {2, 3, 7}, theta in {1e-9, 0.1, 0.2, 0.3, 0.4, 0.45, 0.49}, T in {3000, 9000, 5000}: 21 cases, relative difference
3.5e-11 to 4.4e-9. As theta -> 1/2 the samples approach the critical line: for p = 7, T = 5000, theta = 0.49 the largest sample is
`|zeta'/zeta(0.51 + it_k)| = 89.3`, E = +68.0, R = 74.7 against Obar = 6.68; for p = 2, T = 3000, theta = 0.49: E = -6.05, R = 0.12.

Assessment.
- It is the same explicit formula: for theta < 0 (multiplier `zeta_p(s + eps)`) the samples lie in Re s > 1, the Poisson dual
  converges absolutely and is Weil's formula for `g_eps` term by term. For theta > 0 the Poisson dual
  `lim_Y [sum_{n <= e^Y} Lambda(n) n^(theta - 1) H(log n) - main term]` exists only if `psi(x) - x = o(x^(1 - theta))` on the relevant frequencies,
  i.e. in the zero-free half-plane; otherwise zeros with `beta > 1 - theta` contribute explicit growing terms. The prime side
  does not cross into the strip; the lattice samples do, but they are values of `zeta'/zeta` inside the strip, which are not
  prime-side data (wall 3).
- Inequality step: `zeta'/zeta(1 - theta + it) = o(log t)` holds for `theta < 1 - Theta` when zeta has no zeros in `Re s > Theta` (CLASSICAL
  method, Titchmarsh 14.5; not re-derived). With the Lean-checked region `Re s > 7/8` this gives `R > 0` on the theta-class at large
  height for theta < 1/8: a consequence of that region, with no gain.
- A zero `rho_0 = beta_0 + i gamma_0` with `1 - theta` slightly below `beta_0` and `gamma_0` near a lattice point gives a large negative sample; the
  same pole appears on the zero side in the Krein weight `zeta_p(1 - theta - rho_0)`. Positivity of the right side for all
  (p, theta, w) is a statement of the type `Re xi'/xi > 0` right of the critical line (known equivalent of RH), sampled on
  lattices. The equivalence was not proved here; the direction "RH implies positivity" is immediate.
Closed as a restatement; no further pivot.

## 8. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | No new inequality. Multiplicativity enters twice: the local functional equation of the test factor (an identity step) and the classical zero-free region behind step (III). Proposition P shows the lattice samples are Fourier coefficients of the usual prime sum. |
| R2 (height-uniform, every window) | false | The measured `abs E <= 2.60` is a finite range (p <= 1000, T <= 2e4). The proved bound is `2 kappa_b M(T)` with M unbounded in T as far as is known; the absolute value of the j = 1 prime block grows like a power of p and the higher blocks diverge. |
| R3 (every control fails at a named structural step) | false | The identity holds for DH (8 cases, 4e-12) and for the height-shift twist; the inequality step (III) is true for the twist and its conclusion is not refuted for E_a. |
| R4 (reaches the critical line) | false | Lemma B uses Re s = 1 only. The theta-family samples Re s = 1 - theta, but as values of `zeta'/zeta` inside the strip; its prime-side form converges only in the zero-free half-plane. |

## 9. Three weakest steps

1. Proposition P rests on a uniform `O(1 + |t|)` bound for the truncated sums on Re s = 1 (stated as classical, not written
   out) and is checked numerically only to 4-6 digits, limited by the `X^(-1/2)` convergence at X = 1e8; one of the eight rows
   resolves only the order of magnitude. The general-S statement is proved by uniqueness (limit eps -> 0+ of the classical
   formula), not termwise, and was not checked numerically.
2. Step (h): the Baker-Wustholz constant is quoted from memory and the attribution of the power-type bound to Fel'dman
   1968 should be checked against the sources. The failure of step (III) for DH is by citation; in the measured range (height
   <= 1000, no DH zero with Re s > 1 in the list) the DH lattice values are bounded and DH passes every numerical test,
   including positivity of the Krein sum in the 8 windows.
3. Section 5 uses a local maximum M (|t - T| <= 12 and the lattice), float64 midpoints of Arb balls, one profile (sin^6) and
   T_w = log p only; "bound below Obar for T >= 700" is a measured statement about M, not a certified one. The controls
   E_a, backward heat and the generic unimodular twist were treated by hand and not run; the equivalence of the theta-family
   positivity with RH is asserted in one direction only.

## 10. Files

`lib3.py` (helpers); `poisson_test.py` -> `poisson_test.json`, `logs/poisson_test.log` (86 s); `dh_form.py` -> `dh_form.json`, `logs/dh_form.log`;
`liouville_form.py` -> `liouville_form.json`, `logs/liouville_form.log`; `sizes.py` -> `sizes.json`, `logs/sizes.log` (174 s);
`theta_family.py` -> `theta_family.json`, `logs/theta_family.log`; `lanes_line.jsonl` (record for `campaign/lanes.jsonl`, not appended by this lane).
Data read: `pick/zeros_20000.json` (Arb enclosures), `push/c2-euler-at-zeros/dh_zeros_1000.json`.
