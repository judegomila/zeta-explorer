# c2-euler-cone-fe-rigidity: Euler cone C intersected with the functional equation A

Date: 2026-11-17/18. Scope: this directory only. All numerics local, float64, through `scripts/memcap.sh 8`; the compute
server was not used. Labels: PROVED (argument given here), CLASSICAL, MEASURED (float64 LP, not certified), ARGUED, OPEN.
No statement about zeros of zeta is made.

## Verdict

**Precise obstruction. No new result; the idea does not give a route to R2 or R4.**

1. Exact intersection (first lemma): `C intersect A = {zeta}`. This is Hamburger's theorem and uses neither the cone nor
   multiplicativity (CLASSICAL). The cone relaxation adds no element: geometric means of translates
   `prod zeta(s + i a_j)^{w_j}` lie in C and fail A at the gamma factor (PROVED, section 2).
2. The stability version fails in one window, for a structural reason (PROVED to leading order, MEASURED in the model):
   the translates `zeta(s + i alpha_k)`, `alpha_k = 2 pi k / log(T/2 pi)`, are unitary degree-1 elements of C and satisfy
   zeta's functional equation in a window `[T, T+H]` with defect `<= (|alpha| H/(2T) + alpha^2/(2T)) |zeta|`. Their values at
   `3/4 + i t0` differ from zeta's by O(1). At fixed tolerance the feasible diameter therefore does not shrink with T; it
   grows. The same holds for shifted Dirichlet L-functions (MEASURED: `L(s + i alpha, chi_5)` at height `T/5` passes the
   window test with residual about `50/T`).
3. Decisive test (MEASURED): in the finite model the cone slice through zeta is pinned at `T = 1e2, 1e3` and is not pinned
   at `T = 1e4, 1e5, 1e6` (feasible deviation of `F(3/4 + i t0)` from zeta: 4e-7, 3e-4, 0.61, 2.8, 3.8 at `H = 2`,
   `N = 3.2 sqrt(T/2 pi)`, tolerance 1e-5). A prescribed zero at `3/4 + i t0` is feasible in exact cone slices at
   `T = 1e5` (H = 2 and H = 20) and `T = 1e6` (H = 2), including at tolerance 1e-8 with the residual checked off the design grid. The constraint rank of a
   window is about 30 (H = 2) to 35 (H = 20) real conditions, independent of T; the number of free primes grows like
   `sqrt(T)/log T`. Increasing N at fixed T shrinks the slice slowly (T = 1e4: 1.13 to 0.18 for `N/sqrt(T/2 pi)` from 1.7 to 16,
   coarse grid) and the first-order width with all primes free does not shrink. The shrink rate depends on T with the wrong sign
   for R2.
4. Pivot (MEASURED): imposing the functional equation in windows at all dyadic heights `T/2^j >= 100` pins the cone:
   the feasible width is linear in the tolerance, with constant `kappa(T)` about 2, 4.4, 15 (slice) and 3.9, 8.1, 31
   (first order, all primes) at `T = 1e3, 1e4, 1e5`. Without multiplicativity the constant is 127, 518 and the set is
   unpinned at `T = 1e5`. So multiplicativity matters in the finite model (it reduces N unknowns to pi(N)), but the pinned
   statement is "F equals zeta in the window", and `inf_t |zeta(3/4 + it)| = 0` (CLASSICAL, Bohr-Courant), so no
   distance-to-zeta constant, uniform in T or not, excludes a zero of F in every window.

Requirement flags: R1 false, R2 false, R3 false, R4 false (evidence in section 7).

## 0. Plan (as executed)

What is asked: determine `C intersect A` exactly; then test stability in a finite model (unknown rung measures `mu_p`,
`p <= N`; functional equation imposed through a smoothed approximate functional equation in a window `[T, T+H]`): maximise the
distance from zeta at `sigma = 3/4`, test feasibility of a prescribed zero, for `T = 1e2, 1e3, 1e4` and N around
`sqrt(T/2 pi)`. No R4 answer was expected, and none is obtained.

Relative to the map: row L1 (rung Toeplitz PSD iff unimodular local parameters), L2 (Euler-at-p identifies the function),
S5 (`Lambda(n), n <= N` does not fix zeros while `log N < (1/2) log(gamma/2 pi)`), and the note "at conductor 1, FE + INT is
Hamburger uniqueness, with no inequality". New here: the exact statement of what the cone relaxation adds (nothing), the
window-translate lemma, a finite model with exact cone elements and LP feasibility, the T-scaling of pinning, and the
multi-height stability constant.

## 1. Definitions

- Rung moments `m_k(p) = c(p^k)/log p`, `-F'/F = sum c(n) n^{-s}`. C: `m_k(p) = int z^k d mu_p(z)` for a probability measure
  `mu_p` on the unit circle, every p (equivalently the Toeplitz matrices `[m_{|i-j|}(p)]` are positive semidefinite,
  Herglotz; CLASSICAL). Then `log F = sum_p int -log(1 - z p^{-s}) d mu_p(z)`. A unitary degree-1 factor is a point mass.
  C is convex in the coefficients of `log F`. `|a(n)| <= 1` for F in C.
- A: `F(s) = chi(s) F~(1-s)`, `chi(s) = g(1-s)/g(s)`, `g(s) = pi^{-s/2} Gamma(s/2)`, `F~` the series with conjugated
  coefficients, with `(s-1)F(s)` entire of finite order.
- Structural remark (PROVED, immediate): A is linear in the coefficients `a(n)` of F, not in those of `log F`. C is convex in
  `log F`, not in `a(n)`. There is no variable in which the picture "convex cone intersect affine space" holds. In the
  finite model the map `mu -> a(n)` is linear only in the first moments `a(p)` of primes `p > sqrt(N)`.

## 2. First lemma: the exact intersection

**Lemma 1 (CLASSICAL, Hamburger 1921).** If `F(s) = sum a(n) n^{-s}` converges absolutely somewhere, `(s-1)F(s)` is entire of
finite order and `g(s)F(s) = g(1-s)G(1-s)` with G a Dirichlet series, then `F = a(1) zeta`. Hence `C intersect A = {zeta}`.

The proof does not use the Euler product. The cone enters nowhere. This is the closed device named in the assignment
(uniqueness, no inequality).

**Lemma 1b (PROVED).** Let `F = prod_j zeta(s + i a_j)^{w_j}`, `w_j > 0`, `sum w_j = 1`, distinct real `a_j` (rung measure
`sum_j w_j delta_{p^{-i a_j}}`, an element of C). Its formal functional equation has factor `prod_j chi(s + i a_j)^{w_j}`.
Logarithmic derivative: `sum_j w_j (chi'/chi)(s + i a_j)`. `chi'/chi(s) = log pi - (1/2) psi(s/2) - (1/2) psi((1-s)/2)` has
poles exactly at `s = -2n` and `s = 1 + 2n`, `n >= 0`. The sum has poles at `-2n - i a_j` with residue proportional to `w_j`.
Equality with `chi'/chi(s)` forces every `a_j = 0`. So no mixture of translates (and no averaged twist of the form
`int zeta(s + i a)^{dw(a)}`, same argument with the support of w) satisfies A, also when A is read on `log F` and branch
points are allowed. Separately such an F has branch points at the zeros and the pole of each factor.

Answer to "does the relaxation to general `mu_p` admit other elements": no.

## 3. Window lemma: translates pass the functional equation in a window

**Lemma 2 (PROVED to leading order in 1/T).** `F_alpha(s) = zeta(s + i alpha)` lies in C (point masses at `p^{-i alpha}`) and
satisfies `F_alpha(s) = chi(s + i alpha) F~_alpha(1 - s)` exactly. On `s = 1/2 + it`, `chi = e^{-2 i theta(t)}`,
`theta'(t) = (1/2) log(t/2 pi) + O(t^{-2})`, `theta''(t) = 1/(2t) + O(t^{-3})`. For `alpha log(Tc/2 pi) in 2 pi Z`,
`Tc = T + H/2`:

`chi(s + i alpha)/chi(s) = exp(-i [alpha (t - Tc)/Tc + alpha^2/(2 Tc) + O(alpha H^2/T^2 + alpha^3/T^2)])`,

so the defect of zeta's functional equation in the window is at most `(|alpha| H/(2T) + alpha^2/(2T)) |zeta(1/2 + i(t+alpha))|`
to leading order. For fixed k, H and tolerance eps the translate `alpha_k` is eps-feasible for all large T, and so is every
lattice translate with `|alpha| <~ eps T / H`. Consequence: at fixed eps and H,

`sup { |F(s0) - zeta(s0)| : F in C, window defect <= eps } >= sup_{|alpha_k| <= c eps T/H} |zeta(s0 + i alpha_k) - zeta(s0)|`,

which does not tend to 0 and is unbounded as T grows (values of zeta on `sigma = 3/4` are unbounded; CLASSICAL).
To exclude the nearest translate the tolerance must be below about `pi H |zeta| / (T log T)`.

Model check (MEASURED, `slices.py`, translate residual, H = 2, k = 1): 1.5e-1, 6.3e-3, 2.7e-4, 4.0e-5, 2.0e-6 at
`T = 1e2 .. 1e6`; leading-order scale `|alpha| H/(2T) + alpha^2/(2T)`: 4.8e-2, 2.0e-3, 1.2e-4, 8.6e-6, 6.6e-7 (to be multiplied by
the size of zeta in the window). Ratio 2 to 5 at every T.

**Lemma 3 (ARGUED, MEASURED).** For chi even primitive mod q, `L(s + i alpha, chi)` with `alpha = -Tc(1 - 1/q) + delta`
has functional-equation phase with the same t-derivative as zeta's at Tc (analytic conductor `q (t+alpha)/2 pi = t/2 pi`);
second-order mismatch `(q-1)(H/2)^2/(2T)`. `ltranslate.py`, q = 5 (Legendre symbol), H = 2, best delta: model residual
4.7e-2, 5.1e-3, 8.7e-4, 5.8e-5 at `T = 1e3 .. 1e6` (about 50/T; the leading-order prediction 2e-3 .. 2e-6 is 25 times
smaller; the excess is attributed to the height dependence of the smoothing weights and was not derived). This element uses
the relaxation at one prime (`mu_5` uniform, `a(5^k) = 0`). A window at height T does not separate zeta from `L(., chi_5)` at
height `T/5`.

## 4. Finite model

`afe.py`. For F in A, any `X > 0` (pole terms below `e^{-beta t^2}`, dropped):

`F(s) = sum a(n) n^{-s} V_s(n/X) + chi(s) sum conj(a(n)) n^{s-1} W_s(nX)`,
`V_s(y) = (1/2 pi i) int_(c) g(s+u)/g(s) y^{-u} e^{beta u^2 - i pi u/4} du/u`, `W_s` the same with `1-s` and `+ i pi u/4`.

The factor `e^{-+ i pi u/4}` cancels the exponential growth of the gamma ratio, which allows `beta = 0.003` (cut-off
transition of relative width about 1.6). Weights by trapezoid quadrature. Validation against `mpmath.zeta`:
`max_X |A_X(s) - zeta(s)| <= 1.4e-11` for `T = 1e2, 1e3, 1e4`, `sigma = 1/2, 3/4`, five values of X.

Model `(T, H, N, eps)`: unknown `a(n)`, `n <= N`; `q = sqrt(T/2 pi)`; X on a log-uniform grid of J points in `[1/R, R]`,
`R = N/(1.6 q)` (both sums then end below N; no admissible X when `N < 1.6 q`, where the model has no constraint). Constraint:
`|Re, Im (A_X(s_k) - A_1(s_k))| <= eps` at `s_k = 1/2 + i t_k`, K points in `[T, T+H]`, and at `s0 = 3/4 + i(T + H/2)`.
Value: `F(s0) := A_1(s0)[a]`; it depends only on `a(n)`, `n <= 1.6 q`. Zeta's own residual in the model: 4e-9 to 2e-9
(truncation).

Variants (`cone_lp.py`, `slices.py`):
- relaxed: `a(n)` free in the box `|Re|, |Im| <= 1` (contains the disk), no multiplicativity. Outer bound.
- cone slice through a completely multiplicative base `n^{-i alpha}`: `p <= sqrt(N)` fixed, `a(p) = p^{-i alpha} c_p` for
  `sqrt(N) < p <= N` with `c_p` in the 64-gon inscribed in the unit disk (for these primes only `m_1` enters; the 64-point
  discretisation of `mu_p` is exactly this polygon). Every feasible point is an exact element of C. Linear program.
- tangent cone at zeta, all primes free: `mu_p = (1 - sum w) delta_1 + sum_i w_i delta_{z_i}` on the 64th roots of unity,
  first order in w. Linear program; first-order only.
- small-prime alternatives at p = 2 (point mass at -1, uniform, half-half, random 64-point measure): feasibility only.

The full problem in the measures of the primes `p <= sqrt(N)` is not convex and was not solved. Slice results are inner bounds
on the feasible set; "pinned" refers to the slice and to first order.

## 5. Decisive test: results

### 5.1 Fixed `N = 3.2 q`, tolerance 1e-5, dense design (H = 2: J = 25, dt = 0.1; H = 20: J = 13, dt = 0.2). `dense.jsonl`

| T | H | primes <= N (free in slice) | window rank / relaxed dim | relaxed width (re, im) | slice through zeta: max dev | zero at s0 in zeta slice | translate slices feasible (k = +-1, +-5) | zero in a translate slice |
|---|---|---|---|---|---|---|---|---|
| 1e2 | 2 | 6 (4) | 19/24 | 0.28, 0.91 | 1.6e-7 | no | none | - |
| 1e3 | 2 | 12 (9) | 29/78 | 4.5, 12.6 | 3.3e-4 | no | none | - |
| 1e4 | 2 | 31 (26) | 30/254 | 20.2, 11.7 | 0.61 | not found | all 4 | not found |
| 1e5 | 2 | 79 (71) | 30/806 | 32.6, 16.3 | 2.83 | not found | all 4 | yes (k = +1, -5) |
| 1e6 | 2 | 206 (195) | 30/2552 | 23.6, 47.4 | 3.79 | yes | all 4 | yes (k = +5, -5) |
| 1e2 | 20 | 6 (4) | 21/24 | 0.44, 4.16 | 4.0e-7 | no | none | - |
| 1e3 | 20 | 12 (9) | 34/78 | 7.5, 10.5 | 5.5e-5 | no | none | - |
| 1e4 | 20 | 31 (26) | 35/254 | 14.5, 17.4 | 0.53 | not found | all 4 | not found |
| 1e5 | 20 | 79 (71) | 35/806 | 33.5, 13.1 | 1.88 | not found | all 4 | yes (k = -1) |

`T = 1e6, H = 20` was not run. The coarse design (J = 7, dt = 0.4; `coarse/`) gave the same pattern with somewhat larger
widths (section 5.4).

"Not found" means the LP did not return a feasible point (HiGHS status infeasible or numerical difficulty); it is not a
certificate of infeasibility of the nonconvex problem.

First-order width with all primes free (H = 2; re, im): below 1e-3 (T = 1e2); 0.026, 0.089 (1e3); 2.3, 2.0 (1e4);
11.9, 7.2 (1e5); 7.0, 11.3 (1e6).

Small-prime twists at T = 1e2, H = 20 (`run_T1e2.jsonl`, N = 7 .. 255; first-pass code `cone_lp.py`, 16-gon, default LP
tolerances): `mu_2 = delta_{-1}` is infeasible at every N except N = 32 (undecided); the random 64-point measures are infeasible
or undecided; `mu_2` uniform is feasible only at N = 7 (width 1.6e-3) and infeasible or undecided for N >= 10; half-half is
infeasible or undecided. At this height the big primes cannot compensate a change at p = 2.

Reading: the window constraint has a rank that depends on H and the X-range and not on T. The unknowns that enter `F(s0)` are
the `a(p)`, `p <= 1.6 sqrt(T/2 pi)`. The slice is pinned while twice the number of free primes is below the rank (T <= 1e3)
and is free above it (T >= 1e4). Pinning in one window needs H of order `sqrt(T)/log T` at the measured slope of about 0.3 real
conditions per unit H at R = 2. That is the Riemann-Siegel length: a verification-size computation, as in S5.

### 5.2 N-sweep at fixed T (coarse design, H = 20, tolerance 1e-5). `coarse/nsweep.jsonl`

| T | N/q | primes | zeta-slice max dev | first-order width, all primes (re, im) |
|---|---|---|---|---|
| 1e3 | 1.7 | 8 | 0.19 | 1.5, 1.6 |
| 1e3 | 2.5 | 11 | 6e-5 | 0.31, 0.25 |
| 1e3 | 5 | 18 | 8e-5 | 0.033, 0.027 |
| 1e3 | 8 | 26 | 2e-4 | 0.020, 0.020 |
| 1e4 | 1.7 | 19 | 1.13 | 3.8, 6.7 |
| 1e4 | 2.5 | 25 | 0.87 | 2.4, 4.7 |
| 1e4 | 3.2 | 31 | 0.75 | 2.2, 4.4 |
| 1e4 | 5 | 46 | 0.34 | 1.8, 3.8 |
| 1e4 | 8 | 66 | 0.26 | n/a, 4.1 |
| 1e4 | 16 | 115 | 0.18 | 2.0, n/a |

Below `N = 1.6 q` the model has no admissible X and no constraint (diameter = the whole cone). Above it the diameter shrinks
with N at T = 1e3 (collapse by `N/q = 2.5`) and only slowly at T = 1e4. Part of the slice shrink at T = 1e4 is an artefact: the
frozen set `p <= sqrt(N)` grows with N (primes up to 7 at N = 68, up to 23 at N = 638). With all primes free the first-order
width at T = 1e4 stays between 3.8 and 4.7 (imaginary part) for `N/q` from 2.5 to 16. Answer to the assignment's question:
the feasible diameter starts to shrink once N exceeds about `1.6 sqrt(T/2 pi)`, and the shrink rate decreases as T grows.
This matches stack-feasibility item 4 and adds that the cone does not change the scaling.

### 5.3 Zero witnesses. `witness.py`, `witness.jsonl`, `witness_*.npy`

`T = 1e5, H = 2`, slice k = +1 (small primes `p <= 20` at `p^{-i alpha_1}`, 71 free primes), dense design:

| tolerance | status | max abs c_p | abs F(s0) (zeta: 1.332) | residual on design grid | residual on 4x finer grid (max, median) |
|---|---|---|---|---|---|
| 1e-5 | feasible | 1 + 4e-9 | 1.4e-5 | 1.1e-5 | 3.1e-5, 9.9e-6 |
| 1e-8 | feasible | 1 + 2e-10 | 1.4e-8 | 1.2e-8 | 7.7e-8, 1.8e-8 |

So an exact element of the finite-stage cone satisfies the windowed functional equation to 1e-8 on X in `[1/2, 2]` and has
`F(3/4 + i t0) = 0` to 1e-8. The freedom is not an effect of the tolerance. Same search in the zeta slice (k = 0):
undecided at T = 1e5 (HiGHS status 4), no feasible point at T = 1e4.

### 5.4 Design-grid check

With the coarse design (J = 7, dt = 0.4) the same witness had residual 2.4e-3 off the grid at tolerance 1e-5: the coarse design
undersamples. The dense design holds off the grid to 3x the tolerance. Dense and coarse agree qualitatively (rank 18 -> 30 at
H = 2; zeta-slice max dev at T = 1e4: 1.02 -> 0.61; at T = 1e5: 2.85 -> 2.83). Section 5.2 is coarse and is indicative only.

### 5.5 Pivot: all dyadic heights. `multiwin.py`, `multiwin.jsonl`

Windows `[T_j, T_j + 2]`, `T_j = T/2^j >= 100`, same unknowns, `N = 3.2 sqrt(T/2 pi)`, J = 13, dt = 0.2. Width of `F(s0)` at
the top window (real part; the imaginary part is similar):

| T | windows | tolerance | relaxed (no multiplicativity) | cone slice through zeta | tangent, all primes |
|---|---|---|---|---|---|
| 1e3 | 4 | 1e-5 | 3.2e-4 (im 1.3e-3) | 5.0e-6 (im 2.0e-5) | 2.4e-5 (im 3.9e-5) |
| 1e3 | 4 | 1e-6 | 3.3e-5 (im 1.3e-4) | 5.0e-7 (im 2.0e-6) | 2.5e-6 (im 3.9e-6) |
| 1e4 | 7 | 1e-5 | 5.2e-3 | 4.4e-5 | 8.1e-5 |
| 1e4 | 7 | 1e-6 | 5.3e-4 | 4.4e-6 | 8.1e-6 |
| 1e5 | 10 | 1e-5 | 3.5 (unpinned, rank 378/806) | 1.5e-4 | 3.1e-4 |

Width is linear in the tolerance where pinned. `kappa = width/tolerance`: slice 2.0, 4.4, 15; tangent 3.9, 8.1, 31; relaxed
127, 518, unpinned. The functional equation at all heights up to T pins `a(p)`, `p <= N`, in the cone, with a constant that
grows with T on three points (roughly `T^{0.4}`; not a fitted law). This is Hamburger stability at finite stage. It says
"F is zeta in the window to `kappa eps`". It cannot exclude a zero of F at `3/4 + i t0` unless `kappa eps < |zeta(3/4 + i t0)|`,
and `inf_t |zeta(3/4 + it)| = 0` because the values of zeta on a line `1/2 < sigma <= 1` are dense in C (CLASSICAL,
Bohr-Courant 1914). The pivot ends here: the stable statement is the identity of the function, and its use for zeros is the
evaluation of zeta in the window (verified height).

### 5.6 Run log

All runs: `scripts/memcap.sh 8`, single process, peak planned allocation below 250 MB (printed before allocation). Longest
runs: `T = 1e5, H = 20` dense, 1614 s; `T = 1e6, H = 2` dense, 1417 s. No run was killed by the cap. Two coarse runs stopped on an unhandled `None` (an LP with
non-optimal status); fixed in the dense version.

## 6. Controls

Exact level (`C intersect A`): every control is excluded, by uniqueness, which is an identity and not an inequality.

| Control | In C? | In A? | Named step |
|---|---|---|---|
| DH | no: rung Toeplitz at p = 2, K = 2 has `lambda_min = -1.156` (cited from `b-euler-detector`, not recomputed) | no: its functional equation has conductor 5 and odd gamma factor, not zeta's | fails both; "DH in A" holds only for the conductor-5 space, where `C intersect A_5 = {L(chi), L(chi-bar)}` by Lemma A of `b-euler-detector` |
| HEAT | not formulable (no fixed-frequency Dirichlet series) | - | not a quantitative handle |
| TW- (unimodular completely multiplicative twist) | yes (point masses) | no (Hamburger) | exact level only. **In one window the control passes**: `n^{-i alpha_k}` (Lemma 2, section 5.1), and slices through it carry zero witnesses |
| TW+ (`eps_{p^k} = r^k`, Poisson measure) | yes | no (Hamburger) | exact level only; at T = 1e2 twists at p = 2 are infeasible in the model; at T >= 1e4 not tested beyond the slices |
| E_a = zeta(s+a) zeta(s-a) | no (degree 2; parameters `p^{+-a}` off the circle) | no (gamma factor) | both |
| T-NR | no (non-tempered at q for abs c > 2; not an ordinary Dirichlet series: term `q^{s}`) | functional equation of zeta's type holds | cone at the prime q (row L1) |
| Beurling | cone can be defined over Beurling primes | no functional equation | A |
| phase-rotated transfer operator, theta^w | not formulable in (C, A) | - | not a quantitative handle |
| `L(s + i alpha, chi_5)` (extra) | yes (uniform measure at p = 5) | no (conductor) | exact level only; passes one window (Lemma 3) |

Conclusion for R3: at the exact level the exclusions are by Hamburger uniqueness (closed device). In the only version that
carries an inequality (one window, tolerance eps) the unimodular twist control passes. R3 is not met.

## 7. Requirement flags

- **R1 (multiplicativity essential): false.** The exact lemma is Hamburger's theorem and does not use the Euler product.
  In the finite model multiplicativity reduces N unknowns to pi(N) and changes the outcome (multi-height model at T = 1e5:
  cone pinned, relaxed unpinned; one window at T = 1e2: cone pinned, relaxed width 4). That is a measured dimension count,
  not an essential step of a proof.
- **R2 (height-uniform, every window): false.** One window: the feasible diameter grows with T (Lemma 2; table 5.1). All
  heights: `kappa(T)` = 2, 4.4, 15 grows (measured, three points), and a distance constant cannot give a uniform statement
  because `inf |zeta(3/4 + it)| = 0`.
- **R3 (every control fails at a named structural step): false.** TW- passes the window version (Lemma 2 and the witnesses).
- **R4 (reaches the critical line): false.** A prescribed zero at `3/4 + i t0` is feasible at fixed `N/sqrt(T/2 pi) = 3.2`
  for T = 1e5 and 1e6, so it is not excluded for large T at fixed relative size. Nothing is claimed about zeros of zeta.

## 8. Three weakest steps

1. **The finite model is one choice among many, and only slices of it were solved.** `F(s0)` is the truncated functional
   `A_1(s0)[a]`, the constraint is X-independence on `[1/R, R]` with `N = 3.2 q`, and the small primes are frozen in each
   slice. "Pinned" at T <= 1e3 is a statement about slices and first order; the nonconvex problem in the measures of the
   primes `p <= sqrt(N)` could contain feasible points not seen. Zero witnesses are finite-stage objects (71 or 195 free
   coefficients), not Dirichlet series with a functional equation.
2. **Lemma 2 and Lemma 3 are leading-order.** The error terms of the phase expansion are stated, not bounded with explicit
   constants; the measured translate residuals are 2 to 5 times the leading-order scale (size of `|zeta|` in the
   window not separated out). Lemma 3's measured residual `50/T` is 25 times the leading-order prediction and the excess is
   attributed, not derived.
3. **Float64 LP, no certificates; `kappa(T)` rests on three points.** HiGHS tolerances were set to 1e-9 after a first pass
   returned points with `|c_p| = 1.005`; the dense design was introduced after the coarse design was found to undersample.
   "Not found" entries are not infeasibility certificates. The growth of `kappa` depends on the window set (dyadic, H = 2)
   and was not explored. The `lambda_min = -1.156` for DH is cited, not recomputed.

## 9. Files

`afe.py` (weights, validation), `cone_lp.py` (model, first pass at T = 1e2: `run_T1e2.jsonl`), `slices.py` (translates,
slices, tangent cone), `run_dense.sh`, `dense.jsonl`, `dense.log`, `coarse/` (first-pass coarse design and N-sweep),
`witness.py`, `witness.jsonl`, `witness_*.npy`, `ltranslate.py`, `ltranslate.jsonl`, `multiwin.py`, `multiwin.jsonl`,
`multiwin_1e5.log`.
