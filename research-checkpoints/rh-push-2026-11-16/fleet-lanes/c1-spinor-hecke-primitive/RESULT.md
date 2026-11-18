# c1-spinor-hecke-primitive: jointly p-primitive tests in the square-root / Weil form

Date: 2026-11-17. Kind: combine (square-root lane x Hecke-defect lead, OBSTRUCTION_MAP section 6 item 6).
Nothing here proves or refutes RH. No bound moves. Labels: PROVED (argument given here), CLASSICAL,
MEASURED (float64, non-interval), OPEN.

## 0. Verdict

**Precise obstruction.** The combination does not produce a lower bound, and the reason is exact:

1. For a finite set S of primes the joint primitive decomposition is the Moebius inversion
   `v = sum_{n in N_S} U_n w`, `w = M_S v = prod_{p in S}(1 - U_p) v`. `M_S` is bounded and boundedly
   invertible on `L^2(0,inf)` and maps the test domain onto itself. On the zero module it acts by the
   invertible diagonal `diag(m_S(rho))`. So `Q_L o M_S` is congruent to `Q_L`: same negative index, and
   "Q_L >= -C norm^2 on jointly S-primitive tests" is the same statement as P10 on all tests (Lemma 3).
   This holds verbatim for DH, E_a, T-NR and the sign twist.
2. The orthogonalisation step (Gram matrix of the dilations `U_n w`) depends only on the semigroup and on
   the test. It does not contain the Dirichlet coefficients of the function. It is the same matrix for zeta
   and for every control, so no control can fail there (Lemma 1). The divergent product is replaced by
   `prod (1 - 1/p)^-1 ~ e^gamma log P` only in mean over height; in sup over height the product
   `prod (1 - p^-1/2)^-2` is attained exactly (Kronecker). The l^1 wall stays for any every-window statement.
3. For all primes at once the decomposition `v = sum_n U_n w` exists only for `v` in the range of
   `Z = sum_n U_n`, and that range lies in the radical of `Q_L` (`Q_L(x + Zw) = Q_L(x)`, this is P12 in
   Hecke form). The fully primitive coordinates see the form as identically zero (Lemma 4).
4. In the bridge parametrisation (`H_c`, tests `a`, Weil test `g = Q_c(kappa * a)`) the cutoff does not
   commute with `M_S`; the exact formula for `Gamma_-`/`D_c` on a jointly primitive test is the scalar
   action plus a Moebius sum of window transforms over `(c, c + 2 log d]`, `d | prod S` (Lemma 5). The
   formula uses only that `A` is a convolution; it holds for DH with the same proof.

Decisive test (section 3): on spans of dimension 12 to 400, zeta has minimum eigenvalue 0 to rounding
(`|min| <= 3.2e-10`) on full and on jointly primitive spans; DH, the Liouville twist, E_a and T-NR are
negative on both, with the same negative index on primitive and full spans where the index is finite (DH:
1, 2, 4 and 1, 2, 4 at T = 9), and the negative part grows with the support length T, not with the
dimension at fixed T. The controls fail at the identity (location of zeros or poles of `L`), not at the
orthogonalisation step. Under the assignment's scoring rule this is 0: no bound, and the only step that is
specific to this lane is control-blind.

## 1. Plan; what is new against the atlas and the map

- Sources read: BRIEF (square-root lane), `g-spinor-square-root`, `sq-hankel-traces`, `sq-krein-index`,
  `h-hecke-channels`, `h-hecke-torus-symmetry` (T1, T4 and referee errata 2, 4), `cc-latest` (Theorem B = P10),
  `eq48`, OBSTRUCTION_MAP sections 2, 3.3, 5, 6.
- Not re-run: the single-prime window form (T4), the norm-convergent product on weighted L^2 (T7 and its
  erratum), the chain defect (Q10), Nyman-Beurling rates.
- New here: (i) the joint Moebius decomposition and its exact action on the zero module and on the Weil
  kernel (Lemmas 1-3, including the collapse of each prime ladder to one lag on primitive tests); (ii) the
  exact norms and the mean/sup split of the Gram symbol; (iii) the statement that the all-prime Hecke sum
  lies in the radical, read as the degenerate limit of the decomposition; (iv) the defect formula for `D_c`
  on jointly primitive tests; (v) a prime-side computation of `Q_L` in an orthonormal basis that needs no zero
  list and treats zeta and four controls with one code path.

## 2. Work

Notation. `F(z) = xi(1/2 + z)`, `L = F'/F`. Tests `v` in `L^2(0,inf)`, `V(z) = int_0^inf v(t) e^{-zt} dt`,
`J rho = -conj(rho)`. `Q(v) = sum_rho V(rho) conj V(J rho) = <K, v * v~>`, where `K` is the even distribution
whose one-sided Laplace transform is `L`:

    K(u) = 2 cosh(u/2) - e^{-|u|/2}/(1 - e^{-2|u|}) [regularised at 0] - log(pi) delta_0
           - sum_n Lambda(n) n^{-1/2} (delta_{log n} + delta_{-log n}).

On finite exponential sums this is eq48's `Q_L`. Domain: compactly supported tests with
`int log(2+|tau|) |V(i tau)|^2 d tau < inf`. Hecke operators in this variable:
`U_n v(t) = n^{-1/2} v(t - log n)` (multiplier `n^{-1/2-z}`, the `V_n` of T1), `U_m U_n = U_mn`, and they
preserve one-sided support. `Q` and the `L^2` norm are translation invariant and `U_n` commutes with
translations, so the cutoff `c` of a one-sided test (support in `(c, inf)`) plays no role on this side:
every number below is the same for c = 0, 1, 2 (PROVED; one run covers the three values).

**Lemma 1 (joint primitive decomposition and its Gram matrix). PROVED (Kronecker: CLASSICAL).**
Let S be a finite set of primes, `N_S` the semigroup it generates, `M_S = prod_{p in S}(1 - U_p)
= sum_{d | prod S} mu(d) U_d`, `Z_S = sum_{n in N_S} U_n`.
(a) `Z_S` converges in operator norm on `L^2(0,inf)`, `Z_S M_S = M_S Z_S = 1`. Every `v` has the unique
decomposition `v = sum_{n in N_S} U_n w` with `w = M_S v`.
(b) `||M_S|| = prod_S (1 + p^-1/2)`, `||Z_S|| = prod_S (1 - p^-1/2)^-1` (H^inf norms of the multipliers
`m_S(z) = prod (1 - p^{-1/2-z})` and `1/m_S`; the first by Kronecker, the second attained at `tau = 0`).
Both diverge as S grows (`sum p^-1/2 = inf`).
(c) Gram matrix of the components: `<U_m w, U_n w> = (mn)^-1/2 C_w(log m - log n)`, and
`||Z_S w||^2 = (1/2pi) int |zeta_S(1/2 + i tau)|^2 |W(i tau)|^2 d tau`. The mean of the symbol over `tau` is
`sum_{n in N_S} 1/n = prod_S (1 - 1/p)^-1`; its sup is `prod_S (1 - p^-1/2)^-2`.
(d) Nothing in (a)-(c) depends on the function whose zeros are studied.

Reading. Orthogonalising the components does replace `exp(2 sum p^-1/2)` by `e^gamma log P`, but only for
the average over height. A bound uniform in every window needs the sup, which is the divergent product.
MEASURED (`kron.py`): for P = 100, `max_{[0,H]} |m_P(i tau)|^2` = 79.8, 330, 966, 1018, 1633 at
H = 1e2, 1e3, 1e4, 1e5, 1e6; Kronecker sup 15709; mean 5.06. For P = 7: 21.7, 27.6, 28.1, 28.7, 28.83;
sup 28.83; mean 2.74. The constant is height-dependent and not bounded uniformly in P.

**Lemma 2 (exact formula on the zero side and on the prime side). PROVED.**
(a) `Q(M_S v) = sum_rho m_S(rho) conj(m_S(J rho)) V(rho) conj V(J rho)`. On an on-line zero the weight is
`|m_S(i gamma)|^2 > 0`; on an off-line pair the weights are `lambda, conj(lambda)` with `lambda != 0`
(`m_S` vanishes only on `Re z = -1/2`).
(b) Kernel form: the kernel of `Q o M_S` is `M_S* M_S K`. For each `p in S` the ladder
`-log p sum_{k>=1} p^{-k/2} (delta_{k log p} + delta_{-k log p})` is mapped by `(1 - U_p)*(1 - U_p)` to
`-p^{-1/2} log p (delta_{log p} + delta_{-log p}) + (2 log p / p) delta_0`. So

    Q(M_S v) = Q_{no S}(M_S v) + sum_{p in S} log p [ (2/p) ||x_p||^2 - 2 p^{-1/2} Re <S_{log p} x_p, x_p> ],
    x_p = M_{S minus p} v,

where `Q_{no S}` has the primes of S deleted from `K`. This is the window identity T4(b) on the Weil side:
on a `p`-primitive test the `p`-part of the form lives at the single lag `log p`.
(c) Each bracket in (b) is bounded below only by `-2 log p (p^-1/2 - 1/p) ||x_p||^2`, and
`sum_p p^-1/2 log p = inf`: summing the brackets is the l^1 wall with an extra `log p`.

**Lemma 3 (congruence; equivalence with P10). PROVED.**
`M_S` maps the domain onto itself, with bounded inverse. Hence
(a) the class of jointly S-primitive tests `M_S(domain)` is the whole domain;
(b) the negative index of `Q` on `M_S(E)` equals the negative index of the form
`sum_rho m_S(rho) conj(m_S(J rho)) V(rho) conj V(J rho)` on `E`, for any subspace `E`; on the full domain it
equals the number of off-line pairs (Sylvester; `g-spinor-square-root` (3.1) for the index);
(c) `inf Q(w)/||w||^2` over jointly S-primitive `w` equals `inf Q(v)/||v||^2` over all `v`. By P10 the
value is 0 or `-inf`, so the conditioning of `M_S` does not enter;
(d) (a)-(c) hold for every function with a kernel `K` of this type: DH, E_a, T-NR, the heat family,
and (with `L` in place of the zero sum) the sign twists.

So the bound `Q >= -C ||v||^2` on jointly primitive tests for finitely many primes is P10, which is RH.

**Lemma 4 (all primes: the decomposition lands in the radical). PROVED for the stated class.**
Let `w` be smooth with compact support in `(0,inf)` and `W(1/2) = 0`. Then `Zw = sum_n U_n w` is in
`L^2(0,inf)`, its transform is `zeta(1/2+z) W(z)` (entire), and `Q(x + Zw) = Q(x)` for every test `x`.
Proof: for `Re z > 1/2` the transform of `sum_n U_n w` is `zeta(1/2+z) W(z)`. `W` is entire, rapidly
decreasing on vertical lines, and `W(1/2) = 0` cancels the pole, so `zeta(1/2+z) W(z)` is entire, is in
`H^2` of `Re z > 0` (zeta is polynomially bounded there after the pole is removed), and is the transform
of `Zw` in `L^2(0,inf)`. It vanishes at every zero `rho` and at `J rho`, so every term of the zero sum
containing `Zw` is 0. QED.
A test is "jointly primitive for all `p`" in the sense of the assignment when it is of the form `Zw`. On
that class the form is identically zero, for zeta, and for any control with `Z` replaced by its own
`sum a(n) U_n`. The class is in the radical; it is not a class on which a bound carries information.
OPEN, not used: whether `Q(Z_S w) -> 0` as S grows for fixed `w` (it is `sum_gamma |zeta_S(1/2 + i gamma)|^2
|W(i gamma)|^2` under RH; this is the behaviour of partial Euler products at zeros).

**Lemma 5 (bridge side: `D_c` and `Gamma_-` on jointly primitive tests). PROVED from T1 and referee
erratum 4 of `h-hecke-torus-symmetry`.** With the lane's notation (`u`-variable, `V_d = d^-1/2 T_{-2 log d}`,
`y_z(a;c) = int_c^inf (kappa*a)(r) e^{z(r-c)/2} dr`, `R_{c,d}(z) = int_c^{c+2 log d} (kappa*a)(r) e^{z(r-c)/2} dr`):

    y_z(V_d a; c) = d^{-1/2-z} [ y_z(a;c) - R_{c,d}(z) ],
    y_z(M_S a; c) = m_S(z) y_z(a;c) - sum_{d | prod S, d > 1} mu(d) d^{-1/2-z} R_{c,d}(z).

The first term is the congruence of Lemma 3. The second is the Hecke defect: a Moebius sum of
`2^|S| - 1` window transforms, the window for `d` being the chain of prime windows of T4(b). On the
operator side, for a multiplier `U` with `Q_c U P_c = 0` (shift away from the cut),
`Gamma_- U = (Q_c U Q_c) Gamma_-`; for the opposite shift
`Gamma_- U = Gamma_- (P_c U P_c) + (Q_c S Q_c)(Q_c U P_c)`, and `Q_c U_p P_c` is supported on the window.
Also, since `kappa * a = Z h` with `h = g0 * a`:
`y_z(a;c) = sum_n n^{-1/2-z} int_{c + 2 log n}^inf h(r) e^{z(r-c)/2} dr` (absolutely convergent, every `z`).
Each formula uses only that `A` is a convolution and that the kernel is a Dirichlet sum of translates of a
seed; with `a(n)` inserted they hold for DH.
Remark. In the bridge normalisation `H_c` is a bounded operator, so `H_c >= -C ||a||^2` is true for every
kernel including DH. The P10 bound is relative to the norm of the Weil test, not of `a`.

## 3. Decisive test (run first; local, memcap 8 GB, float64)

Setup (`plib.py`, `run_prime.py`). Orthonormal tests `v_m(t) = T^-1/2 e^{i w_m t} 1_[0,T](t)`,
`w_m = 85.7 + 2 pi m / T`, `m = 0, 1, -1, 2, ...` (nested spans; the centre is the height of the first
off-line DH zero). For these, `Q(S_s v_j, v_k) = [E_s(w_k) - E_s(w_j)] / (2 pi i (m_j - m_k))` with
`E_s(w) = <K(y), sgn(y-s) e^{i w (y-s)} 1_{|y-s|<T}>`: a Loewner matrix of one function of `w`, computed
from the kernel (all prime powers up to `e^{T + log 210}`, the archimedean part by Gauss-Legendre with the
`1/(2|u|)` term regularised). No zero list is used. Jointly primitive span: `M_S v_m`, S = {2,3,5,7}
(81 shifts `log(d/e)`), generalised eigenvalues of `(Q(M v_j, M v_k), <M v_j, M v_k>)`.
S = primes up to 100 (25 primes, `2^25` shifts) is not reachable on the prime side; it was run on the zero
side (`run_zero.py`, half-sine modes, 330 zeta zeros, Gram by trapezoid on a band-limited integrand) for the
three functions whose zeros come from zeta zeros.

Functions: zeta; DH (`-f'/f` coefficients by the divisor recursion, gamma factor `Gamma((s+1)/2)`,
conductor 5); TW = Liouville twist `Lambda(n) -> lambda(n) Lambda(n)` (completely multiplicative signs,
archimedean and pole terms kept); E_a with a = 0.2; T-NR `xi(s)(2^z + 2^-z + 2.05)` (zeros at
`Re z = +-0.322`).

Validation. (i) zeta is PSD to `3e-10` from primes alone at all 18 (T, N) cells; an error in any constant
of `K` breaks this. (ii) `crosscheck.py`: prime-side matrix against the zero sum on smooth combinations,
zeta, E_a, NR at T = 6, 9: max difference `9e-14` to `3e-12` on scale 7 to 20.

Minimum eigenvalue of `Q` relative to the norm (full span | jointly primitive span, S = {2,3,5,7});
negative index in brackets. Prime side.

| function | T | N = 25 | N = 100 | N = 400 |
|---|---|---|---|---|
| zeta | 6 | -5e-14 [0] / -7e-13 [0] | -1e-13 [0] / -2e-12 [0] | -5e-12 [0] / -2e-11 [0] |
| zeta | 9 | -2e-13 [0] / -7e-12 [0] | -3e-13 [0] / -1e-11 [0] | -1e-11 [0] / -4e-11 [0] |
| zeta | 12 | -2e-12 [0] / -3e-11 [0] | -2e-12 [0] / -9e-11 [0] | -1e-10 [0] / -3e-10 [0] |
| DH | 6 | -3.46 [1] / -0.52 [1] | -3.63 [2] / -0.62 [2] | -5.24 [7] / -6.05 [7] |
| DH | 9 | -15.5 [1] / -2.94 [1] | -16.2 [2] / -3.13 [2] | -16.4 [4] / -10.8 [4] |
| DH | 12 | -49.2 [1] / not run | -52.1 [2] / not run | -52.8 [4] / not run |
| DH | 15 | -138.1 [1] / not run | -147.1 [2] / not run | -149.4 [3] / not run |
| TW | 6 | -4.04 [6] / -4.49 [8] | -4.44 [25] / -6.99 [35] | -30.9 [98] / -9.53 [135] |
| TW | 9 | -6.10 [7] / -7.76 [7] | -7.30 [28] / -9.00 [29] | -165.2 [126] / -12.6 [129] |
| TW | 12 | -8.19 [5] / -10.5 [5] | -10.7 [22] / -12.2 [22] | -783.2 [114] / -15.6 [115] |
| E_a | 6 | -2.96 [12] / -5.61 [12] | -3.43 [43] / -10.2 [43] | -4.01 [149] / -10.6 [150] |
| E_a | 9 | -7.53 [8] / -15.8 [8] | -10.7 [32] / -21.6 [31] | -12.5 [108] / -26.4 [107] |
| E_a | 12 | -21.0 [8] / -35.1 [9] | -25.2 [25] / -44.5 [25] | -29.6 [78] / -49.1 [80] |
| T-NR | 6 | -4.45 [3] / -13.8 [3] | -4.66 [12] / -16.2 [13] | -5.01 [47] / -19.3 [47] |
| T-NR | 9 | -17.2 [3] / -8.61 [3] | -18.3 [9] / -67.1 [10] | -18.9 [36] / -67.6 [36] |
| T-NR | 12 | -58.1 [4] / -51.7 [4] | -70.2 [9] / -195.1 [9] | -72.3 [26] / -199.7 [26] |

Zero side, T = 9, half-sine modes, S = none | {2,3,5,7} | all 25 primes up to 100, minimum generalised
eigenvalue (negative index):

| function | N = 25 | N = 100 | N = 200 |
|---|---|---|---|
| zeta | -2e-15 (0) / -2e-15 (0) / -8e-14 (0) | -3e-14 / -3e-13 / -8e-13 (0) | -2e-13 / -1e-12 / -4e-12 (0) |
| E_a | -7.04 (10) / -15.6 (10) / -90.1 (10) | -10.4 (31) / -21.5 (31) / -103.9 (31) | -10.8 (56) / -21.8 (57) / -105.6 (57) |
| T-NR | -17.1 (5) / -28.7 (5) / -60.4 (3) | -18.0 (12) / -66.8 (11) / -122.4 (10) | -18.5 (19) / -67.3 (19) / -448.1 (18) |

The zeta rows of the zero-side table are positive semidefinite by construction (every zero used is on the
line); they check the code, not zeta. The independent zeta statement is the prime-side table.

Reading.
- zeta: bounded below (minimum 0 to rounding) on full and primitive spans. This is verified height: tests
  of bandwidth 200 and length 12 to 17 cannot see a zero above `3e12`. It is not evidence about RH.
- Every control is negative on full and on primitive spans. For DH the negative index is the number of
  off-line pairs in the band and is the same on both spans in all twelve cells with a primitive run (T = 6, 9; N = 12 to 400), consistent
  with Lemma 3(b) (which gives equality on the full domain, not on each finite span). For controls
  with infinitely many off-line pairs the two finite-span indices differ by at most 3 except for TW at
  T = 6 (98 against 135 at N = 400; the primitive tests are longer by `log 210 = 5.35` and resolve more poles).
- At fixed T the minimum saturates in N; it grows with T (DH, N = 400: -5.2, -16.4, -52.8, -149.4 at
  T = 6, 9, 12, 15, a factor about 3 per 3 units of length). On `L^2[0,T]` every one of these forms is
  bounded below by `-C(T)`; unboundedness is a statement about long tests. The jump of TW at N = 400 is
  the band reaching `w = 0`, where the uncancelled pole of `L_TW` at `z = 1/2` acts with weight `e^{T/2}`.
- Passing to primitive spans changes the constants in both directions (DH smaller at small N, E_a and T-NR
  larger; with 25 primes E_a goes from -10.8 to -105.6). It does not change the sign for any function.

## 4. Controls

| step | zeta | DH | TW (Liouville) | E_a | T-NR | backward heat |
|---|---|---|---|---|---|---|
| Lemma 1: decomposition, norms, Gram of dilations | holds | holds (same matrix) | holds (same matrix) | holds | holds | holds |
| Lemma 2(a), 3: congruence, inertia | holds | holds | holds with `L` (no involution) | holds | holds | holds (not run) |
| Lemma 2(b): `p`-ladder collapses to one lag | holds | **fails at `p = +-2 mod 5`** (no ladder: `c(n)` not supported on prime powers; first defect `n = 6`) | holds with sign `-1` | holds, weight `p^a + p^-a` | holds for `p != 2` | fails (sheared) |
| Lemma 4: Hecke sum in the radical | holds | holds with `a(n)` | n/a (no zero sum) | holds | holds | n/a |
| Lemma 5: defect formula for `D_c` | holds | holds with `a(n)` | n/a | holds | holds | holds |
| orthogonalisation gives a bound | no (mean only) | no | no | no | no | no |
| `Q >= -C norm^2` | iff RH (P10) | fails: off-line pair at 85.70 (measured index 1) | fails: poles of `L` with residue -1 on the axis and an uncancelled pole at 1/2 | fails: all zeros at `Re z = +-a` | fails: zeros at `Re z = +-0.322` | fails (zeros off the line) |

The only row where a control fails for a structural reason is Lemma 2(b), which is the Euler product at
`p` restated (T3 of `h-hecke-torus-symmetry`). The row that would give the bound holds or fails
identically for all columns. The required pattern (bound fails for DH and the twist at the
orthogonalisation step) does not occur: that step never sees the function. Backward heat column: inferred
from R3 of `h-hecke-channels`, not run here. Beurling, unimodular twist, phase-rotated transfer operator
and theta^w were not run.

## 5. Requirement flags

- R1 (all primes, multiplicativity essential): **false**. Multiplicativity enters only Lemma 2(b), an
  identity. Lemmas 1, 3, 4, 5 and the bound question are independent of the coefficients. Evidence: the
  Gram matrix is literally the same array for all five functions in `run_prime.py`.
- R2 (height-uniform, every window): **false**. The identities hold at all heights, but they are
  restatements; the only quantitative gain (Gram mean `~ log P`) is a mean over height, and the sup is the
  divergent product (Lemma 1(b), `kron.json`).
- R3 (fails for every control for a structural reason): **false**. No conclusion is reached that a
  control could fail; the specific step is control-blind (section 4).
- R4 (reaches the critical line): **false**. Lemma 3 shows the bound on primitive tests is P10 itself.

## 6. Three weakest steps

1. Lemma 3(a) and Lemma 4 are stated for compactly supported tests with a logarithmic weight. The domain
   on which `Q` is closable is not characterised here, and the identification of the zero sum with the
   kernel form for `Zw` (not compactly supported) uses the continuation of the transform; P12 treats the
   same point and is unrefereed. A different notion of "jointly primitive" (for example a support condition
   on `kappa * a` in windows, as in T6(a)) is not covered; the referee of `h-hecke-torus-symmetry` showed
   that requiring it for all `p` forces `y = 0`.
2. The numerics are float64 and not interval. The DH negative index (1, 2, 4, 7) was not matched against an
   independent count of off-line DH zeros in each band; only the first two (85.70, 114.16) are known to
   this lane. The S = primes up to 100 case was run for zeta, E_a and T-NR only (zero side); DH and TW at
   25 primes were not run and rest on Lemma 3.
3. Lemma 5 is written in the notation of `g-spinor-square-root` and `h-hecke-torus-symmetry` and was not
   checked numerically in the `u`-variable; the remark that `H_c >= -C ||a||^2` is vacuous does not settle
   whether a bound relative to `||Q_c(kappa*a)||^2` on the bridge class is equivalent to RH (not needed
   for the verdict; OPEN).

## 7. Pivot

Not taken. The adjacent question that survives is the OPEN item of Lemma 4: the size of
`sum_gamma |zeta_S(1/2 + i gamma)|^2 |W(i gamma)|^2` relative to `||Z_S w||^2` as S grows, i.e. partial
Euler products sampled at zeros against their mean. It is a largest-value question on the critical line
(wall section 5 part 4) and nothing here gives a handle on it.

## 8. Files

- `plib.py`: kernels for the five functions, Loewner assembly, Moebius ratio table.
- `run_prime.py`, `runall.sh`, `out_<fn>_T<T>_P<7|0>.json`, `logs/`: prime-side runs (2.8 s to 134 s each).
- `run_zero.py`, `zero_<fn>_T9_P<0|7|100>.json`, `zeros.py`, `zeta_zeros_330.json`: zero-side runs.
- `crosscheck.py`: prime side against zero sum (needs the `_Qfull.npy` files, which `run_prime.py` writes;
  they were deleted after the check to save space).
- `kron.py`, `kron.json`: extremes of the Gram symbol by height.
- All runs local through `scripts/memcap.sh 8`. The compute server was not used.
