# c2-cutoff-hecke-defect: the Hecke defect at the cutoff, in the square-root form

Date: 2026-11-17/18. Kind: combine (g-spinor-square-root x Hecke dilations, ROUND_LOG row c2).
Nothing here proves or refutes RH. No bound moves. No statement about zeros of zeta is claimed.
Labels: PROVED (argument in this note, from refereed identities), CLASSICAL, MEASURED
(python-flint ball arithmetic, quadrature error outside the balls), ARGUED, OPEN.

## 0. Verdict

**Precise obstruction. The decisive first test kills the idea; the expected stop is reached and the
reduction is proved.**

1. `D_p = [Q_c, V_p] = -V_p 1_(c, c+2 log p] = -P_c V_p Q_c` (Lemma 1). Its range is all of
   `L^2(c - 2 log p, c]`. The only datum of the prime in it is the length `2 log p`.
2. In f-space (where `M_c` lives) the defect form is `<D_p v, M_c D_q w> = -<Gamma_- D_p v, Gamma_- D_q w>`
   (Lemma 2). It is negative semidefinite for every even kernel of order one, of rank at most
   `rank Gamma_-`, and it vanishes identically iff `Gamma_- = 0`. On-line zeros contribute nothing; off-line
   pairs contribute a negative semidefinite Pick-type form at the right-half-plane zeros of `F + alpha F'`.
   This is the PP block of G6 sampled on windows. With Euler weights it becomes
   `-||[T_Z, T_S] v||^2`, a commutator of Wiener-Hopf operators; `RH <=> [T_S, T_{V_p}] = 0 for one p`
   `<=> the same with any translation of any positive length` (Proposition 2'). The primes can be replaced
   by any positive lengths; the prime weights are not forced to be multiplicative; one prime suffices.
3. In a-space the Gram matrix of `{D_p y_gamma}` in the `H_c` form is a restriction of the compression of
   `H_c` to `L^2(c - 2 log P, c]`, which is `alpha (Gamma_1 Gamma_0 + Gamma_0 Gamma_1)` with `Gamma_j` the
   Hankel operator of kernel `x^j kappa(x)` on `(0, inf)` (Lemma 3). It does not depend on `c`. It equals
   the Weil form on the one-sided tests `Q_c(kappa * D_p v)` (Proposition 4): lesson 1. By the Weil
   explicit formula its prime side contains the function only through `Lambda(n)`; on the theta side
   it contains the coefficients only through the bilinear sum `sum a(m) a(n) (mn)^-1/2 M_{m,n}`, in which
   `a(mn) = a(m) a(n)` is not used.
4. Decisive test (section 3, MEASURED). Zeta: positive definite on every window `p <= 97`, 183 to 222
   nodes, all pivots resolved (down to `10^-389`). **DH: positive definite as well** on every window, up
   to 222 nodes and pivots down to `10^-392`; its off-line zeros are not seen at any depth reached.
   Backward heat `tau = -2`: positive definite (183 nodes). The form fails early for the Liouville
   twist (2 negative directions at relative size `10^-8`), the seed alone (2), T-NR (4, 6, 14 as the node
   count grows 28, 55, 111), `E_a` (3 with 14 nodes) and heat `tau = -40` (10 to 24). The count of
   negative directions is fixed in `P` for `p >= 2` (seed, Liouville, T-NR) and grows with the number
   of nodes: it measures the off-line zeros resolved by the dimension of the test space. The literal
   5000-vector family `{D_p K_gamma}` (zeta, float64) has numerical rank 4 at relative `10^-13`.
5. The test separates by the functional equation and by the height of the lowest off-line zero. It
   does not separate by the Euler product: the non-multiplicative even kernel (DH) passes; the
   completely multiplicative kernel without functional equation (Liouville) fails at `10^-8`.

Flags: R1 no, R2 no, R3 no, R4 no. Pivot: the Wiener-Hopf commutator form (item 2), which is the
strongest adjacent statement; it is prime-blind by the same proof, so no second lane is opened.

## 1. Plan; what is new against the map

Sources read: BRIEF; OBSTRUCTION_MAP rows G6, G14, P21, P2, Q14 and controls section; RESULT and REFEREE
of `g-spinor-square-root` (errata 1-5, in particular the domain of `y_gamma`), `c1-spinor-hecke-primitive`
(with the referee's correction of Lemma 3(a)), `c1-shear-hecke-fricke`.

Not re-run: `V_p* H_c V_p = p^-1 H_{c+2 log p}` and the window form (G14, T4); the joint Moebius
decomposition (c1 Lemmas 1-5); the eigen-defect order (c1-shear).

New here: (i) the range statement for `D_p` and its consequence that the f-space defect form is the
PP block; (ii) the Wiener-Hopf commutator identity `Gamma_- [Q_c, Z] = -[T_Z, T_S]`; (iii) the closed
form `alpha(Gamma_1 Gamma_0 + Gamma_0 Gamma_1)` of the left compression of `H_c`, its independence of
`c`, and a ball-arithmetic inertia computation of it that needs no zero list and treats all kernels with
one code path; (iv) the measured outcome that DH and small backward heat pass it at every depth reached.

Notation (lane G6 / T1). `F(z) = xi(1/2 + z) = int kappa(u) e^{zu/2} du`,
`kappa(u) = sum_n (2 pi^2 n^4 e^{9u/4} - 3 pi n^2 e^{5u/4}) exp(-pi n^2 e^u)` (even),
`h_+- = (1 +- alpha u/2) kappa`, `A = h_+ *`, `A* = h_- *`, `S` = multiplier `N/D`, `D = F + alpha F'`,
`N = F - alpha F'`, `Q_c = 1_(c,inf)`, `P_c = 1 - Q_c`, `Gamma_- = Q_c S P_c`, `Gamma_+ = P_c S Q_c`,
`M_c = Q_c - S* Q_c S` (so `H_c = A* M_c A`), `V_n a(u) = n^-1/2 a(u + 2 log n)`. Transform
`g^(z) = int g(u) e^{zu/2} du`. The assignment's window `(c, c + log p]` is `(c, c + 2 log p]` in this
variable.

## 2. Work

**Lemma 1 (defect; PROVED, kernel-free).** Let `W_{c,p} = 1_(c, c+2 log p]`, `l = log p`.
(a) `D_p := [Q_c, V_p] = -V_p W_{c,p} = -P_c V_p Q_c`, and `Q_c V_p P_c = 0`.
(b) `ran D_p = L^2(c - 2l, c]`, `ker D_p = {v : v = 0 on (c, c + 2l]}`; `D_p* = -W_{c,p} V_p*`.
(c) `D_mn = D_m V_n + V_m D_n`. For `Z_w = sum_n w_n V_n` with `sum |w_n| n^-1/2 < inf`:
`[Q_c, Z_w] = -P_c Z_w Q_c`.
(d) `(D_p v)^(w) = -p^{-1/2-w} R_{c,p}(w)[v]`, `R_{c,p}(w)[v] = int_c^{c+2l} v(r) e^{wr/2} dr`.
Proof. `(Q V v - V Q v)(u) = p^-1/2 v(u + 2l) [1_{u>c} - 1_{u+2l>c}] = -p^-1/2 v(u + 2l) 1_{c-2l<u<=c}`.
The rest is substitution; (c) is the derivation property of a commutator. QED.
MEASURED (`check_lemma3.py`): (a) holds exactly on a grid.
Consequence. Every function in `L^2(c - 2l, c]` is `D_p v` for some `v`. The family `{D_p v}` carries no
information about `p` beyond the length of the interval, and none about the kernel.

**Lemma 2 (f-space: the literal form `<D_p v, M_c D_q w>`; PROVED from G6 (2.1)).**
For all `v, w in L^2(R)`, all primes `p, q`, every `c` and every `alpha > 0`:

    <D_p v, M_c D_q w> = -<Gamma_- D_p v, Gamma_- D_q w>.

Hence every Gram matrix `[<D_{p_i} v_i, M_c D_{p_j} v_j>]` is negative semidefinite of rank at most
`rank Gamma_-`; it is zero for all `v` and one fixed `p` iff `Gamma_- = 0` iff RH.
Proof. `ran D_p` lies in `ran P_c` (Lemma 1) and the PP block of `M_c` is `-Gamma_-* Gamma_-` (G6 (2.1),
referee-confirmed). If the form vanishes on `ran D_p = L^2(c - 2l, c]` then `(S g)(r) = 0` for `r > c` and
all smooth `g` supported in `(c - 2l, c)`. With `s` the convolution kernel of `S` (a tempered distribution),
`(S g)(r) = <s, g(r - .)>`, and the functions `g(r - .)`, `r > c`, are all test functions supported in an
interval of length `< 2l` inside `(0, inf)`. By a partition of unity `s = 0` on `(0, inf)`, so `Gamma_- = 0`.
`Gamma_- = 0 <=> RH` is G6 consequence 2. QED.

Explicit form (PROVED when `F` has finitely many zeros in `Re z > 0` and the zeros `w_k` of `D` there are
simple; this is the Kronecker case of G6 consequence 4). For `g` supported in `(-inf, c]` and `r > c`,
closing the contour to the right, `(S g)(r) = -(1/2) sum_k rho_k g^(w_k) e^{-w_k r/2}`, `rho_k = Res_{w_k} S`.
With Lemma 1(d):

    <D_p v, M_c D_q w> = -(1/2) sum_{k,k'} conj(rho_k p^{-1/2-w_k} R_{c,p}(w_k)[v])
                          * rho_k' q^{-1/2-w_k'} R_{c,q}(w_k')[w] * e^{-(conj w_k + w_k') c/2} / (conj w_k + w_k').

The matrix `[1/(conj w_k + w_k')]` is a positive definite Pick matrix. Answers to the assignment:
- *Definite sign from off-line pairs that on-line zeros do not give:* yes in this form, and only there.
  The form is `<= 0`, each off-line pair adds one to its rank, on-line zeros contribute nothing. This is the
  statement "`Gamma_- = 0` iff RH" of G6 evaluated on windows; it adds no inequality.
- *Are the prime weights forced to be multiplicative:* no. For weights `c_p` the joint vector is
  `sum c_p D_p v`, with transform `-sum c_p p^{-1/2-w} R_{c,p}(w)[v]` at the points `w_k`. Any single
  nonzero weight detects `Gamma_- != 0`. The function enters through `w_k`, `rho_k` only.
- For infinitely many off-line zeros (DH) the left side and the identity of Lemma 2 stand; the explicit
  sum is not justified here (OPEN, same gap as referee erratum 4 of G6).

**Proposition 2' (joint Euler weights; PROVED).** Let `Z = sum_n w_n V_n` as in Lemma 1(c),
`T_X = Q_c X Q_c` on `L^2(c, inf)`. Then `T_Z T_S = T_{ZS}` and

    Gamma_- [Q_c, Z] = -Q_c S P_c Z Q_c = -[T_Z, T_S],
    <[Q_c, Z] v, M_c [Q_c, Z] v> = -||[T_Z, T_S] Q_c v||^2.

So `RH <=> [T_S, T_{V_p}] = 0` for one prime `p` `<=> [T_S, T_tau] = 0` for one left translation by any
`tau > 0`.
Proof. `Q Z P = 0`, so `T_Z T_S = Q Z (Q + P) S Q = T_{ZS}` and `T_S T_Z = T_{SZ} - Q S P Z Q`; `S` and `Z`
commute. The equivalence is Lemma 2 with `Z = V_p`; the proof of Lemma 2 uses only that `P_c V Q_c` has
range `L^2(c - tau, c]`. QED.
Reading. This is the statement that the commutant of the truncated shift consists of the one-sided
(causal) Toeplitz operators (Brown-Halmos, Sarason; CLASSICAL). The Euler product
`Z_P = prod_{p<=P} (1 - V_p)^-1` enters `[Q_c, Z_P]` only through the Leibniz rule of Lemma 1(c). The
identity is the same for Beurling "primes" (any lengths), for DH and for every control with an even
kernel of order one.

**Lemma 3 (a-space: the compression of `H_c` to the left of the cut; PROVED).** For `a, b` supported in
`(-inf, c]`, in the coordinate `x = c - u >= 0`:

    <a, H_c b> = alpha * int_0^inf int_0^inf conj a(x) M(x, y) b(y) dx dy,
    M(x, y) = int_0^inf (2r + x + y) kappa(r + x) kappa(r + y) dr,
    P_c H_c P_c = alpha (Gamma_1 Gamma_0 + Gamma_0 Gamma_1),   Gamma_j = Hankel operator on L^2(0,inf), kernel k_j(x + y), k_j(t) = t^j kappa(t).

Proof. `<a, H_c a> = ||Q_c h_+ * a||^2 - ||Q_c h_- * a||^2` (PR 43 (2.1), quoted in G6 section 1) and
`h_+(X) h_+(Y) - h_-(X) h_-(Y) = alpha (X + Y) kappa(X) kappa(Y)` with `X = r + x`, `Y = r + y`. QED.
MEASURED (`check_lemma3.py`): direct `||Q f||^2 - ||Q g||^2` against `alpha a^T M a`, two parameter sets:
relative difference `1.2e-15`, `6.5e-15`.
Consequences. (i) The compression does not depend on `c`. "Every `c`" is translation covariance in the
position variable; it is not a statement about heights. (ii) Only `kappa` on `(0, inf)` enters. For a kernel
`kappa = sum a(n) V_n g0` one has `M = sum_{m,n} a(m) a(n) (mn)^-1/2 M_{m,n}`, with `M_{m,n}` built from the seed
at the arguments shifted by `2 log m` and `2 log n` separately; `M_{m,n}` is not a function of `mn`, so
`a(mn) = a(m) a(n)` is not used. For `x >= 0` the terms `n >= 2` are below `27 exp(-3 pi e^x)` of the seed
term (`2.2e-3` at `x = 0`). (iii) By Lemma 1(b) the Gram matrix of any family `{D_p x_j}`, `p <= P`, in the
`H_c` form is a restriction of `M` to `(0, 2 log P]`; its negative index is at most that of `M` on
`(0, 2 log P]` (Sylvester).
(iv) Unimodular twist `n^{-i theta}`: `F_theta(z) = F(z + i theta)`, `kappa_theta = e^{i theta u/2} kappa`,
`H_c^theta = E* H_c E` with `E` = multiplication by `e^{i theta u/2}`, and `E* V_p E = p^{i theta} V_p`. Every
Gram matrix of this note is unitarily congruent to the zeta one (PROVED; not run).

**Proposition 4 (reduction to the Weil form on a one-sided test; PROVED from G6 (3.1), P21).**
For `a` supported in `(-inf, c]` put `g = Q_c (kappa * a)`. Then `g(c + r) = int_0^inf kappa(r + x) a(c - x) dx`
is smooth on `r > 0` with decay `exp(-pi e^r)`, `y_gamma(a; c) = int_0^inf g(c + r) e^{i gamma r/2} dr` converges
for every complex `gamma` (this removes the domain problem of referee erratum 4 on this subspace), and

    <a, H_c a> = alpha sum_gamma y_gamma conj(y_gammabar) = alpha sum_rho G(rho) conj G(-conj rho),   G = transform of g,

the Weil functional of `g * g~` (eq48's `Q_L`; map row P21). For a defect vector `a = D_p v`:
`g_{p,v}(c + r) = -p^-1/2 int_c^{c+2 log p} kappa(r + c + 2 log p - s) v(s) ds`. So the Gram matrix of the
defect vectors is the Weil form on the one-sided tests `g_{p,v}`. By the Weil explicit formula (CLASSICAL;
`g * g~` is continuous, piecewise smooth, with super-exponential decay; hypotheses not re-audited here) the
same number is the archimedean term minus `sum_n Lambda(n) n^-1/2` times the correlations of `g` at lag
`2 log n`. The form is expressible with `Lambda` alone. This is lesson 1.

Remark (ARGUED; supported by the measurement in 3.4). Integrating by parts, `y_gamma(a; c)` has the
asymptotic expansion `sum_k (2i/gamma)^{k+1} (-1)^k g^{(k)}(c+)` (up to the sign convention); the
exponentially small oscillating part is beyond all orders. So the vectors representing `y_gamma` on tests
left of the cut are, to relative `1/gamma`, all proportional to `kappa`, and the Gram matrix over zeros
is a moment (power-sum) form in `1/gamma`. This is the Taylor-block form of P21 and explains its large
detection order.

## 3. Decisive first test (run first; local, `scripts/memcap.sh 8`, python-flint 0.9.0 in a venv inside the slug directory)

Object. The inertia of `[M(x_i, x_j)]` at nodes `x_i = (i + 1/2) h` in `(0, 2 log p]` (point masses; `M` is
continuous, so these are limits of `L^2` bumps and a negative direction on point masses gives one in
`L^2`). By Lemma 1(b) and Lemma 3(iii) this bounds the signature of every Gram matrix of `{D_p y}` on
that window, for any choice of vectors `y`, with equality when the vectors span the node space. No zero
list is used. Code: `defect_gram.py` (arb balls, 300 to 1000 digits; composite Gauss-Legendre in `r` on a
graded mesh; pivoted `LDL^T` with 1x1 and 2x2 pivots on the diagonally scaled matrix; a pivot is counted
only if its ball excludes 0; "unresolved" and "uncertain" were 0 in every run).

Validation. `kappa(-x) = kappa(x)` to 25 digits for zeta and for the DH kernel
`e^{3u/4} sum a(n) n exp(-pi n^2 e^u / 5)` (`check_even.py`). `M(x_0, x_0)`, `M(x_0, x_5)` against
`mpmath.quad`: agreement to the 40 digits computed. Two quadratures (100 nodes, panel 0.25, 300 digits;
150 nodes, panel 0.17, 400 digits): the five probe entries agree to all 60 printed digits after a rounding
bug in the panel endpoints was fixed (before the fix the difference was `3e-18`; every run reported here is
after the fix). The quadrature truncation error is not inside the balls: the inertia is MEASURED.

### 3.1 Table (h = 0.05; windows `(0, 2 log p]`; entries are the number of negative directions; "min" is log10 of the smallest resolved scaled pivot at p = 97)

| kernel | p=2 (28 nodes) | p=3 (44) | p=5 (64) | p=7 (78) | p=13 (103) | p=47 (154) | p=97 (183) | min | negative pivots (log10, p = 97) |
|---|---|---|---|---|---|---|---|---|---|
| zeta | 0 | 0 | 0 | 0 | 0 | 0 | 0 | -80 | none |
| DH | 0 | 0 | 0 | 0 | 0 | 0 | 0 | -80 | none |
| heat `tau = -2` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | -80 | none |
| heat `tau = -40` | 10 | 16 | 20 | 22 | 22 | 24 | 24 | -84 | -9.5, -11.0, -15.8, -17.2, ... |
| Liouville twist (symmetrised, see 4) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | -80 | -8.0, -11.6 |
| seed (n = 1 term only) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | -80 | -9.4, -12.9 |
| T-NR `xi(s)(2^z + 2^-z + 2.05)` | 4 | 4 | 4 | 4 | 4 | 4 | 4 | -79 | -4.1, -6.6, -12.1, -18.0 |

`E_a`, `a = 0.2` (`kappa_a` by direct convolution, validated against the Bessel-K double sum and `mpmath.quad` at two points to
20 digits; 14 nodes, h = 0.1, window p = 2, 60 digits): 3 negative directions, pivots `10^-11.3, 10^-13.8, 10^-25.9`.

### 3.2 Depth runs

| kernel | window | h | nodes | negative | smallest resolved pivot (log10) |
|---|---|---|---|---|---|
| zeta | p <= 13 | 0.025 | 205 | 0 | -153 |
| DH | p <= 13 | 0.025 | 205 | 0 | -154 |
| zeta | p = 2 | 0.00625 | 222 | 0 | -389 |
| DH | p = 2 | 0.00625 | 222 | 0 | -392 |
| T-NR | p = 2 | 0.025 | 55 | 6 | -89 (negatives -4.1, -6.8, -12.3, -18.9, -66.1, -76.7) |
| T-NR | p = 2 | 0.0125 | 111 | 14 | -187 |

### 3.3 Reading

- Zeta is positive definite at every size. This is the value RH predicts; it is not evidence for RH
  (DH gives the same table).
- DH is positive definite at every size and depth reached. Its first off-line pair is at height 85.70
  (`0.8085 + 85.699i`). The signature does not count DH's off-line zeros in any window `p <= 97` at these
  dimensions. This agrees with P21 (DH Taylor blocks positive through order 164) and with the Pick result
  (finite orders are Euler-blind). The assignment's question "does the signature change count them" has the
  answer no at accessible depth; by Lemma 3(iii) and G6 it must become yes at some larger dimension, which
  was not reached (OPEN at which dimension).
- The failures are fixed in `P` and grow with the node count (T-NR: 4, 6, 14). The form counts the off-line
  zeros that the dimension of the test space resolves, lowest first. T-NR's off-line zeros are at heights
  `4.53 (2k+1)`; successive negative pivots fall by `10^-2.5`, `10^-5.5`, `10^-6.0` per step of 9.06 in height,
  compare `|F(i gamma)|^2 ~ e^{-pi gamma/2} = 10^{-0.68 gamma}`.
- Primes larger than 2 add nothing measurable for zeta, DH, seed, Liouville, T-NR: the kernel on
  `x > 2 log 2` is the seed up to a relative `27 exp(-3 pi e^x) < 10^-14` there.

### 3.4 Literal family (zeta only, float64; `literal_zeta.py`)

Vectors `D_p K_gamma = -p^-1/2 1_(0, 2 log p] K_gamma`, `K_gamma(x) = int_0^inf kappa(x + r) e^{i gamma r/2} dr`,
25 primes `p <= 97`, the first 200 zeta zeros: a 5000 x 5000 Gram matrix in the `H_c` form (midpoint rule,
h = 0.05). Eigenvalues: max `2.0045e-4`, min `-2.7e-19` (relative `-1.4e-15`, rounding); numbers of
eigenvalues above `10^-6, 10^-10, 10^-13` of the maximum: 2, 3, 4; none below the negatives of these.
The 5000 vectors are numerically 4-dimensional, as the Remark after Proposition 4 predicts. The literal
family for DH was not run (no DH zero list was computed); by Lemma 1(b) its signature is bounded by the
DH rows of 3.1 and 3.2, which are positive definite.

## 4. Controls

| control | outcome in this lane | step where it differs from zeta |
|---|---|---|
| DH | Lemmas 1-3, Props 2', 4 hold verbatim. Passes the decisive test at all depths reached (MEASURED). | none in this lane; only "`Gamma_- = 0`", which is the location of its zeros |
| backward heat, `tau = -2` | same; passes (MEASURED, 183 nodes) | none reached; `tau = -40` fails with 10 to 24 negative directions |
| sign twist (Liouville) | `kappa_lambda = sum lambda(n) V_n g0` is not even and does not decay at `-inf` (pole of `zeta(1+2z)` at `z = 0`), so `A*` is not `h_- *` and `H_c` is not defined on `L^2`. The Hankel form of Lemma 3 with `kappa_lambda` on `(0, inf)` is defined; it has 2 negative directions at `10^-8` (MEASURED) | the functional equation (evenness of `kappa`), not multiplicativity |
| unimodular twist | unitarily congruent to zeta (Lemma 3(iv), PROVED) | none; correct, its zeros are on the line |
| `zeta(s+a) zeta(s-a)`, a = 0.2 | 3 negative directions with 14 nodes (MEASURED) | zeros off the line from height 14.13 |
| T-NR | 4 / 6 / 14 negative directions (MEASURED) | zeros at `Re z = +-0.322` from height 4.53 |
| Beurling | Lemma 1, Lemma 2, Prop 2' hold with `2 log p` replaced by any lengths (PROVED) | none |
| phase-rotated transfer operator, `theta^w` | not run | not examined |

No positivity argument exists in this lane, so no control "fails at a step of the argument". The measured
test passes DH and small backward heat, where the conclusion is false.

## 5. Requirement flags

- **R1: no.** Evidence: Lemma 1 (kernel-free, the prime enters as a length); Proposition 2' (one prime or
  any translation suffices; weights arbitrary); Proposition 4 (expressible with `Lambda` alone); Lemma 3(ii)
  (bilinear in `a(n)`, `a(mn) = a(m)a(n)` unused); measured: DH (not multiplicative) passes, Liouville
  (completely multiplicative) fails.
- **R2: no.** The identities hold for every `c` and every window length, but by Lemma 3(i) the dependence
  on `c` is translation covariance; no height localisation occurs. The measured sensitivity to an off-line
  pair at height `gamma` decays like `e^{-pi gamma/2}` or faster, and DH is not detected at all.
- **R3: no.** See section 4: no argument to fail; DH and heat `tau = -2` pass the test.
- **R4: no.** No bound in `P` is produced. The compression is a finite-stage object: the count of negative
  directions is set by the dimension of the test space, not by `P`.

## 6. Three weakest steps

1. The inertia is certified in ball arithmetic only relative to the computed matrix. The `r`-quadrature
   truncation error is outside the balls; it was checked by a second quadrature to 60 digits at 64 nodes,
   not at the depth `10^-390` of the 222-node runs. A spurious sign at that depth is not excluded by a proof,
   though none of 222 pivots was negative for either kernel.
2. "DH passes" is a statement about the node families tried (uniform nodes, h from 0.05 to 0.00625). The
   dimension at which the left compression first detects DH's off-line pair was not found; the link to the
   order 165 of P21 is by analogy (different test family), not by computation.
3. The explicit residue formula after Lemma 2 is proved only for finitely many off-line zeros with simple
   zeros of `F + alpha F'`; the Remark after Proposition 4 (moment form) is argued, with one float64
   measurement behind it. The Weil explicit formula for the one-sided test class in Proposition 4 is quoted
   and its hypotheses were not re-audited.

## 7. Files

`defect_gram.py` (main), `literal_zeta.py`, `check_even.py`, `check_lemma3.py`, `check_ea.py`, `check_ea2.py`,
`out_*.json` (inertia, pivots, probe entries), `literal_zeta.json`, `logs/`. `.venv/` is a local
python-flint environment (ignored by git). The compute server was not used.
