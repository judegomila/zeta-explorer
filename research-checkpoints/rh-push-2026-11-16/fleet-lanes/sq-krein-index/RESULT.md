# sq-krein-index: inertia theorem, index formula, and the alpha-family versus Levinson

Date 2026-11-16. Follow-up to `g-spinor-square-root` (RESULT + REFEREE). Labels: PROVED / CLASSICAL / MEASURED / OPEN.
Nothing here proves or refutes RH, and no unconditional zero count is improved.

## Verdict

1. **Inertia theorem: PROVED, with one correction to the earlier lane.** For every even real entire `F` of order
   at most one (and for the order-two control), every `alpha > 0` and every cutoff `c`:
   negative index of `H_c` = rank `Gamma_-` = number of poles of `S = N/D` in `Re z > 0` (with multiplicity)
   = number of **distinct** zeros of `F` in `Re z > 0`, as an element of `{0,1,2,...,infinity}`.
   The count is of distinct zeros, not zeros with multiplicity (finite model: 6 distinct, 12 with multiplicity,
   index 6). The proof is self-contained (Hadamard partial fractions, an isotropic-subspace lemma, the argument
   principle, partial fractions for the Hankel block). It gives the bounded-type structure explicitly:
   `S = S_0/B`, `B` a finite Blaschke product of degree `kappa`, `S_0` inner in `Re z > 0`.
2. **Index formula: it is the argument principle, and it is `(N - N_0)/2`.** The winding of `S` along the axis
   over a height window equals `-N_0` (number of sign changes of `f`) up to an explicit error of modulus `< 1`,
   unconditionally and for every `alpha`. The winding of `D` on a contour `Re z = X >= 1/2` is the gamma-factor
   term plus a prime sum bounded by `log zeta(1/2+X)/pi`. The difference of the two is `2*kappa` plus horizontal
   edge terms. The Gohberg-Krein theorem does not apply to `T_S`: `T_S` is injective with infinite-dimensional
   cokernel (index `-infinity`); `0` is an eigenvalue of infinite multiplicity of `M_c`; the family
   `tau -> M_c(tau)` along the heat flow is not norm-continuous at a collision (the negative eigenvalue tends to
   `-1`, not to `0`). `kappa` is a relative index `ind T_{conj B}` that needs the factor `S_0` as input.
3. **Levinson/Conrey: same count; the alpha-freedom is already used.** `F = (D+N)/2` and `f = Re D` on the axis
   is Levinson's decomposition with `D = xi + alpha xi'`. With `L = log T`, `alpha` corresponds to the linear
   Conrey polynomial `Q(x) = 1 - lambda x`, `lambda = alpha L/(1 + alpha L/2)`; Levinson's choice is
   `alpha = 2/L`. The argument-principle step of Levinson's method is an equality up to `O(log T)` (this is the
   windowed inertia theorem). All loss is in the mean-value step. Optimising `alpha` gives the known linear-`Q`
   (simple-zero) constants (measured from Conrey's formula: 0.3563 at `theta = 1/2`, 0.4022 at `theta = 4/7`,
   optimum `lambda ~ 1.03-1.04`, i.e. `alpha ~ 2.15/log T`). Height-dependent `alpha` and integration over
   `alpha` give nothing beyond the best fixed `lambda`. **No unconditional count improves.**

## 0. Plan: what is new relative to the atlas, the walls and the earlier lane

- Atlas section 5 (vortices, local collision index, PR 16/19) treats the degree of `(h, h_x)` at heat collisions and
  boundary winding on boxes; it is not re-run. The object here is a different index (negative inertia of the
  bridge form), and the outcome for the heat flow is consistent with the atlas: "nonvanishing alone is not zero
  winding".
- Earlier lane: proved `neg index = rank Gamma_-` (referee) and `neg index <= #pairs` in the finite case, measured
  equality, quoted Kronecker/Krein-Langer without hypotheses. New here: the equality in general including
  `kappa = infinity`; the distinct-zero correction; the explicit factorisation `S = S_0/B`; the exact axis-winding
  identity; non-Fredholmness of `T_S`; the closed-form Hankel norm `alpha/sqrt(alpha^2+sigma^2)` for an isolated pair;
  the dictionary to Levinson's `lambda`.
- Walls: every identity holds for DH, for the backward heat family and under the sign twist (section 6). No step uses
  `Lambda(n) >= 0`, multiplicativity or Hecke structure. The Euler product appears once, as a bounded term on the far
  contour (section 4.3), where its sign pattern is irrelevant.

## 1. Setting

Class `(H)`: `F` entire, `conj F(-conj z) = F(z)` (so `f(t) = F(it)` is real), and

    L(z) := F'(z)/F(z) = a z + sum_rho m_rho/(z - rho),   a >= 0,                                   (1.0)

sum over the distinct zeros `rho` with multiplicities `m_rho`, in symmetric order `|rho| < R -> infinity`, with
`sum m_rho |rho|^{-2} < infinity`. CLASSICAL (Hadamard): this holds with `a = 0` for every even real entire function
of order at most one with `F(0) != 0`, in particular `xi(1/2+z)`, the completed DH function, and every heat-flowed
`F_t(z) = int e^{t u^2} Phi(u) cosh(2zu) du`, `t` real. It holds with `a = 1/8` for the PR 56 control `k_0`.

`kappa := #{distinct zeros rho : Re rho > 0}` in `{0,1,...,infinity}`. `D = F + alpha F'`, `N = F - alpha F'`,
`S = N/D = (1 - alpha L)/(1 + alpha L)`, `alpha > 0`. On the axis `L(it)` is purely imaginary away from poles
(axis zeros contribute `m/(i(t-gamma))`; a pair `rho, -conj rho` with `rho = sigma + i beta` contributes
`-2i(t-beta)/(sigma^2+(t-beta)^2)`), so `Re(1 + alpha L) = 1` and `|S| = 1` there. (PROVED.)

## 2. Inertia theorem

### Theorem A (kernel). PROVED.
Let `F` satisfy (H). The Hermitian kernel `K(z,w) = (L(z) + conj L(w))/(z + conj w)` on
`Omega = {Re z > 0} minus zeros of F` has exactly `kappa` negative squares.

*Proof.* The map `rho -> -conj rho` is a bijection of the zero set preserving `m_rho` and `|rho|`, so
`conj L(w) = a conj w + sum m_rho/(conj w + rho)` in the same symmetric order. Termwise
`1/(z-rho) + 1/(conj w+rho) = (z+conj w)/((z-rho)(conj w+rho))`, hence

    K(z,w) = a + sum_rho m_rho g_rho(z) conj(g_{-conj rho}(w)),   g_rho(z) = 1/(z-rho),             (2.1)

absolutely and locally uniformly convergent. Let `V` be the space of finitely supported complex measures on `Omega`
and `V^` the span of `V` and the residue functionals `lambda_j(phi) = (1/2 pi i) oint_{|z-rho_j|=eps} phi`, with the
form `[mu,nu] = mu_z conj(nu_w) K`. From (2.1)

    [mu,mu] = a|mu(1)|^2 + sum_{Re rho = 0} m_rho |mu(g_rho)|^2 + sum_{Re rho_j > 0} 2 m_j Re( mu(g_{rho_j}) conj mu(g_{-conj rho_j}) ).

*Upper bound.* If `kappa < infinity`, the form is `>= 0` on `{mu : mu(g_{rho_j}) = 0, j <= kappa}`, a subspace of
codimension `<= kappa`; so the negative index of `V^` (and of `V`) is `<= kappa`.

*Lemma (isotropic subspaces).* If a Hermitian form has finite negative index `q` and `N` is a subspace on which the
form vanishes identically with `N ∩ rad = 0`, then `dim N <= q`. Proof: take a maximal negative definite `V_-`
(`dim q`); `V_+ = V_-^perp` is positive semidefinite and `V = V_- + V_+`. If `n` in `N ∩ V_+`, then `[n,n] = 0`, so by
Cauchy-Schwarz `n perp V_+`, and `n perp V_-`, so `n` in `rad`, so `n = 0`. Hence the projection `N -> V_-` is injective.

*Lower bound.* Take distinct zeros `rho_1..rho_m` in `Re > 0` and `N = span(lambda_j)`. `lambda_j(g_rho) = 1` if
`rho = rho_j`, else `0`; `lambda_j(1) = 0`. Then `[lambda_j, lambda_k] = m_j conj(lambda_k(g_{-conj rho_j})) = 0`
because `-conj rho_j` lies in the left half-plane. For `lambda = sum c_j lambda_j` and a point mass `delta_w`,
`[lambda, delta_w] = sum_j c_j m_j/(conj w + rho_j)`, which vanishes for all `w` only if `c = 0` (distinct poles; this
is the linear independence of the zero functionals). So `N` is isotropic of dimension `m` with `N ∩ rad = 0`, and the
Lemma gives negative index of `V^ >= m` (trivially if it is infinite). Finally `V` and `V^` have the same negative
index: a finite-dimensional negative definite subspace of `V^` stays negative definite when the contour integrals are
replaced by Riemann sums. ∎

Multiplicity enters (2.1) only as the weight `m_rho`, so a zero of multiplicity `m` in `Re > 0` contributes one
negative square, not `m`.

### Theorem B (factorisation; alpha-independence). PROVED.
Let `F` satisfy (H) with `kappa < infinity`. For every `alpha > 0`:
(i) `1 + alpha L` has no zeros on the axis and exactly `kappa` zeros in `Re z > 0`, with multiplicity;
(ii) with `B` the Blaschke product of these zeros, `S_0 := S B` is inner in `Re z > 0` (`|S_0| <= 1`, `|S_0| = 1`
on the axis) and `S_0 != 0` at the zeros of `B`. So `S = S_0/B` is of bounded type with exactly `kappa` poles.

*Proof.* Write `L = L_+ + R`, `R(z) = sum_{j<=kappa} m_j [1/(z-rho_j) + 1/(z+conj rho_j)]` (rational, `R -> 0` at
infinity), `L_+ = az + sum_{axis} m/(z - i gamma)`, `Re L_+ = a Re z + sum m Re z/|z - i gamma|^2 >= 0` in `Re z >= 0`.
Take the half-disc `{Re z > 0, |z| < R_n}` indented by small right semicircles at the axis zeros. On the axis
`Re(1+alpha L) = 1`; on the indentations `Re L > 0`; on the large arc `Re(1+alpha L) >= 1 - alpha|R(z)| > 0`. The image
of the contour lies in `Re > 0`, so zeros minus poles of `1+alpha L` inside is `0`; the poles inside are the `kappa`
simple poles `rho_j`. This is (i). For (ii): where `alpha|R| <= 1/2` one has `Re(alpha L) >= -1/2`, and the Möbius map
`w -> (1-w)/(1+w)` is bounded by `3` on `Re w >= -1/2`; so `S_0` is bounded outside a compact set, analytic on it
(poles cancelled by `B`; at zeros of `F`, `S -> -1`), hence bounded, continuous up to the axis with modulus one there,
hence `|S_0| <= 1` (Phragmén-Lindelöf). At a zero `b` of `B`, `1 - alpha L(b) = 2`. ∎

Consequence: the number of zeros of `F + alpha F'` in `Re z > 0` that are not zeros of `F` equals the number of distinct
zeros of `F` there, for every `alpha > 0` (Hermite-Biehler with index; the windowed form is Speiser/Levinson-Montgomery
type). A zero of `F` of multiplicity `m >= 2` is also a zero of `D` and of `N` of multiplicity `m-1`; it cancels in `S`.

### Theorem C (operator). PROVED.
Let `F(z) = int kappa_0(u) e^{zu/2} du` with `kappa_0` real, even, `|kappa_0(u)| <= C_k e^{-k|u|}` for all `k`, and (H).
With `A, A*, C_0, Q_c, P_c, M_c, H_c, Gamma_-` as in the square-root lane, for every `alpha > 0` and real `c`:

    negative index of H_c = negative index of M_c = rank Gamma_- = kappa      (in {0,1,...,infinity}).

*Proof.* (1) `neg(M_c) = rank Gamma_-`: on `ran P` the form is `-|Gamma_- P f|^2`; and `M_c = Q - S*QS >= 0` on
`{f : Gamma_- P f = 0}`, of codimension `rank Gamma_-`. (2) `neg(H_c) = neg(M_c)`: `H_c = A* M_c A`, `A` bounded, injective,
dense range; finite-dimensional negative subspaces transfer in both directions. (3) `kappa < infinity`: under
`a -> int a(u) e^{zu/2} du`, `ran P_c = e^{zc/2} H^2(Re z > 0)`, `ran Q_c = e^{zc/2} H^2(Re z < 0)`, and `Gamma_-` is
`phi -> P_-(S phi)`, `phi` in `H^2(Re>0)`. By Theorem B, `S phi = psi/B`, `psi = S_0 phi` in `H^2(Re>0)`. Let `r` be the
sum of the principal parts of `psi/B` at the zeros of `B`: `r` is rational, `O(1/z)`, poles in `Re > 0`, so `r` in
`H^2(Re<0)`; `rB` is in `H^2(Re>0)`; `psi - rB` is in `H^2(Re>0)` and divisible by `B`. So `P_-(S phi) = r`. The range is
the `kappa`-dimensional space of principal parts, and all of it is attained because `S_0 != 0` at the zeros of `B` and
`phi` has arbitrary finite jets there. (4) Any `kappa`: for `Re z > 0` the truncations `e_z 1_{(-n,infinity)}` are in `L^2`
and `Q_c A` of them converges in `L^2` to `D(z) Q_c e_z` (decay of `kappa_0`); so Gram matrices of `H_c` converge to
those of the kernel (1.1) of the square-root lane, `4 alpha e^{-(z+conj w)c/2} F(z) conj F(w) K(z,w)`, which is congruent
to `K` on points of `Omega`. By Theorem A, `neg(H_c) >= kappa`, including `kappa = infinity`. ∎

The proof does not use `l^2(zeros)`, so the referee's open point (boundedness of the zero-transform without RH) is not
needed. For the control `k_0` (`a = 1/8`) Theorem A gives the extra positive constant `a`, matching the referee's
Gaussian rank-one term.

### Checks (MEASURED, `toy_inertia.py`, 120 digits)
Model with 8 axis zeros, a simple quartet, a double quartet and a triple quartet: distinct zeros in `Re > 0`: 6;
with multiplicity: 12. Zeros of `1 + alpha L` in `Re > 0` for `alpha = 0.01, 0.3, 1, 7, 300`: 6 each (none on the
axis). Gram matrix of `K` on 24 and 30 random points: 14 positive, 6 negative, remainder below `1e-70` (rank
`8 + 2*6 = 20`).

## 3. The index along the de Bruijn-Newman flow

`F_t(z) = int_0^inf e^{t u^2} Phi(u) cosh(2zu) du` (`F_0 = xi(1/2+z)/8`; `H_t(x) = F_t(ix/2)`); `kappa(t)` = number of
distinct zeros of `F_t` in `Re z > 0`.

- Theorem C applies to every real `t`: `kappa(t) = neg(H_c(t)) = rank Gamma_-(t)`. (PROVED.)
- `kappa(t) = 0` for `t >= Lambda`; `0 <= Lambda <= 0.2`. (CLASSICAL: de Bruijn, Rodgers-Tao, Polymath 15.)
- `kappa(t) < infinity` for every `t > 0`. (CLASSICAL: Ki-Kim-Lee 2009, quoted, not re-audited.) So for `t > 0` the
  index is a finite integer and `S_t = S_{0,t}/B_t` with a finite Blaschke product.
- Monotone nonincreasing in `t`. At a finite collision this is local: a real zero of multiplicity `k >= 2` at time
  `t_0` is resolved by the rescaled Hermite polynomial `He_k`, real simple zeros for `t > t_0` and non-real for
  `t < t_0` (CLASSICAL: de Bruijn; Csordas-Smith-Varga). Exclusion of zeros entering from infinity on `t > 0` is quoted
  from Ki-Kim-Lee and was not re-derived. (CLASSICAL, partly unaudited.)

**Spectral-flow form, and why it is not a Fredholm index.**
- PROVED: for `kappa < infinity`, `ker M_c` contains `conj(S_0) H^2(Re<0)` (for `f = conj(S_0) g`, `S f = g/B` stays in
  `H^2(Re<0)` and `M_c f = f - S*S f = 0`). So `0` is an eigenvalue of infinite multiplicity; `kappa` counts the
  negative eigenvalues of a non-Fredholm operator.
- PROVED (two-zero model `L = 1/(z-rho) + 1/(z+conj rho)`, `rho = sigma + i beta`): the pole of `S` is at
  `b = i beta - alpha + sqrt(alpha^2+sigma^2)`, at distance `~ sigma^2/(2 alpha)` from the axis; `Gamma_-` has rank one and
  norm `|Res_b S|/(2 Re b) = alpha/sqrt(alpha^2 + sigma^2)`, and the negative eigenvalue of `M_c = Q - S*QS` is
  `-alpha/sqrt(alpha^2+sigma^2)`. (Checked numerically to 15 digits.) As the pair approaches the axis the eigenvalue tends
  to `-1`, the eigenvector spreads to width `2 alpha/sigma^2` and converges weakly to zero, and after the collision the
  eigenvalue is absent. The family `t -> M_c(t)` is strongly but not norm continuous at a collision.
- Reading: `kappa(t)` is a step function with downward jumps at collision times. It is not the spectral flow of a
  norm-continuous Fredholm family; no homotopy-invariance statement is available that would evaluate it without
  locating the zeros. The detection scale is `alpha ~ sigma`: with `alpha << sigma` the negative eigenvalue is `~ alpha/sigma`.

## 4. Index formula

### 4.1 Axis winding of `S` equals `-N_0`. PROVED.
On the axis `D(it) = f(t) - i alpha f'(t)`. Between consecutive real zeros of `f`, `Re D = f` has one sign, so `D`
stays in one open half-plane. At a simple real zero `gamma`, `D = -i alpha f'(gamma) != 0`, and `f'/f -> -infinity` before
`gamma`, so `D` reaches the imaginary axis at the end from which a counterclockwise rotation continues into the other
half-plane. Hence, with `beta(t) = arctan(-alpha f'(t)/f(t))` in `(-pi/2, pi/2)`,

    (1/pi) Delta_{[T1,T2]} arg D(it) = N_0(T1,T2) + (beta(T2) - beta(T1))/pi,      (1/2 pi) Delta arg S = -(1/pi) Delta arg D,   (4.1)

where `N_0` counts sign changes of `f`. This holds for every `alpha > 0` without RH, for DH and for `F_t`. The Laguerre
expression `d/dt arg D = alpha (f'^2 - f f'')/|D|^2` can be negative near off-line zeros, but the net change per gap is `pi`.
MEASURED: zeta `t=0`, `[5,51.4]`: `N_0 = 10`, `Delta arg D/pi = 10.04, 10.14, 10.04`; DH `[80,120]`: `N_0 = 24`,
`23.98, 23.81, 23.95, 24.00`; backward heat `t=-2`: `N_0 = 8`, `7.99, 7.92, 7.91`.

### 4.2 Toeplitz index theorem does not apply. PROVED (given that `D` has infinitely many zeros).
For `kappa < infinity`, on the axis `S = S_0 conj(B)`, so `T_S = T_{conj B} T_{S_0}`. `D` has infinitely many zeros when
`F` is not of exponential type (for `xi`: otherwise `F = (D+N)/2` would be of exponential type), and only `kappa` in
`Re > 0`; the zeros of `S_0` are the reflections of the left zeros of `D`, so `S_0` is an infinite inner function. Then
`ker T_S = {phi : S_0 phi in K_B} = 0` (a nonzero element of the finite-dimensional rational space `K_B` cannot vanish
at infinitely many points) and `coker T_S` contains `H^2 ⊖ S_0 H^2`, infinite-dimensional. `T_S` is left-invertible
with index `-infinity`. Consistently, by (4.1) the winding of `S` over `[-T,T]` is `-2N_0(T) + O(1)`, unbounded; `S` is
in `H^inf + C` but not invertible there (Douglas). The finite index present is `ind T_{conj B} = kappa`
(Gohberg-Krein for the continuous symbol `conj B`), i.e. `kappa = dim H^2/{phi : S phi in H^2}`. Extracting `conj B`
from `S` requires the outer/inner data `S_0`, which is the zero configuration itself.

### 4.3 Windowed formula and the shifted contour. PROVED up to the CLASSICAL edge bound.
Box `R = {0 < Re z < X, T1 < Im z < T2}`, `X >= 1/2` (in general: `X` at least the supremum of `Re rho`), `T_i` not ordinates of zeros. Argument principle for `1 + alpha L`:
left edge: `Re = 1`; right edge: `Re L = sum Re 1/(z-rho) > 0` since all zeros have `Re rho < 1/2`. So

    Z_D(R) = kappa(R) + E,    |E| <= 1 + (1/2 pi)(variation of arg(1+alpha L) on the two horizontal edges),            (4.2)

`Z_D(R)` = zeros of `1+alpha L` in `R`, `kappa(R)` = distinct zeros of `F` in `R`. The horizontal variation is
`O_alpha(log T)` by the standard Jensen argument (CLASSICAL, not rewritten here). `D` has no zeros in `Re z >= 1/2`
(PROVED, same inequality). For `D` itself, with `s = 1/2 + X + it`, `X > 1/2`:

    2 pi Z_D(R) = [theta_X(T2) - theta_X(T1)]  +  [Im log zeta(s)]_{T1}^{T2}  -  pi N_0(T1,T2)  +  horizontal terms + O(1),   (4.3)

`theta_X(t) = Im log( s(s-1) pi^{-s/2} Gamma(s/2)/2 )`, `Im log zeta(s) = -sum_n Lambda(n) n^{-1/2-X} sin(t log n)/log n`.

Answers to the lane questions:
- The far-contour winding is arithmetic, but the prime sum is bounded by `log zeta(1/2+X)` (0.48 at `X = 3/2`): less
  than one zero of information per window. The main term is the gamma factor.
- (4.3) is `kappa_T = (N(T) - N_0(T))/2` with `N(T)` from Riemann-von Mangoldt. The term that would have to be computed
  arithmetically is the axis winding `-N_0`, and the axis is not a contour on which the Euler product converges or a
  boundary of a known zero-free region.
- What is lost in the shift `Re z = X > 1/2 -> Re z = 0`: exactly `2 pi kappa(R)` plus the horizontal edge terms.
  `D` is zero-free on `Re z >= 1/2`, and its zeros in `0 < Re z < 1/2` number exactly `kappa`. The shift identity is a
  tautology: evaluating it requires the unknown.
- With horizontal terms bounded only by `O(log T)` (the `S(T)` scale), a window identity cannot resolve an integer;
  this is the MV-CAP / verified-height wall in this language.

## 5. Comparison with Levinson and Conrey

- Same decomposition (PROVED, trivial): `F = (D+N)/2`, and on the axis `N = conj D`, so `f = Re D`. Real zeros are the
  points where `arg D = pi/2 mod pi`. This is Levinson's device with `D = xi + alpha xi'` in place of his `H zeta + ...`.
- Dictionary (PROVED, leading order): `xi = H zeta`, `H'/H ~ L/2`, `L = log T`. `D = H[(1 + alpha L/2) zeta + alpha zeta']`,
  proportional to `Q(-(1/L) d/ds) zeta` with `Q(x) = 1 - lambda x`, `lambda = alpha L/(1 + alpha L/2)` in `(0,2)`.
  Levinson 1974 is `lambda = 1`, `alpha = 2/L`. `alpha -> infinity` is `xi'` (`lambda = 2`). `alpha -> 0` is `D -> xi`.
  The alpha-family is the linear slice of Conrey's family `Q(0) = 1`, `Q'(x) = Q'(1-x)`. The linear slice is the one that
  counts simple zeros, which matches Theorem A counting distinct zeros and (4.1) counting sign changes.
- Same count (PROVED modulo the edge bound): Levinson's inequality `N_0 >= N - 2 Z_D + O(log T)` is, by (4.1)-(4.2), an
  equality up to `O(log T)`: the argument-principle step loses nothing, for every `alpha`.
- Where Levinson loses (CLASSICAL): `Z_D` is bounded by Littlewood's lemma on a box with left edge `Re z = -R/L`,
  applied to `D psi` with a mollifier `psi` of length `T^theta`: (i) the zeros of `D` in `-R/L < Re z < 0` are counted;
  `D` has about `N(T)` zeros in `Re z < 0` and `lambda` controls how far left they sit; (ii) zeros of `psi` are counted;
  (iii) `int log|D psi| <= (T/2) log(mean square)`; (iv) `theta < 4/7` (Conrey) for this mollifier class. All four are
  mean-value steps.
- The alpha-freedom (MEASURED from Conrey's formula, `levinson_alpha.py`; formula quoted from Conrey 1989 /
  Bui-Conrey-Young, validated by reproducing Levinson's 0.342 at `lambda = 1, P = x, R = 1.3`):

  | theta | lambda = 1 (Levinson), P optimised (deg 4) | best lambda, P optimised | best lambda | alpha L |
  |---|---|---|---|---|
  | 1/2 | 0.3486 | 0.3563 | 1.043 | 2.18 |
  | 4/7 | 0.3990 | 0.4022 | 1.028 | 2.12 |

  For comparison: `lambda = 0.75` gives 0.036 / 0.111 and `lambda = 1.25` gives 0.207 / 0.233. These are the known
  simple-zero constants (Conrey 1989 states 0.4013 for simple zeros). The gain from freeing `alpha` is 0.008 / 0.003
  and is already in the literature.
- Height-dependent `alpha`: the method is local in `[T, 2T]` and scale-invariant in `lambda`; the optimum is the same
  `lambda*` at every height, i.e. `alpha(T) = 2.15/log T`. An analytic `alpha(s)` of higher order is Conrey's
  higher-degree `Q`, which gives the current records (0.4077 and later, up to 5/12) for all zeros but leaves this
  inertia framework: `Q(d/dz)F` of higher degree is not `F + alpha F'`, and no inertia theorem is proved here for it. (OPEN.)
- Integrating over `alpha`: by Theorem B the integer bounded is the same for every `alpha`, so each `alpha` gives an
  upper bound `B(alpha)` for one quantity; any average of the bounds is `>= min B`. A mixture
  `int D_alpha d mu(alpha) = D_{mean alpha}` stays in the family. (PROVED, trivial.) No gain.

## 6. The three controls

| Control | What was run | Outcome |
|---|---|---|
| DH (`dh_window.py`, 30 digits) | window `80 < t < 120`, `|Re z| < 3`: `N = 28`, `N_0 = 24`, `(N-N_0)/2 = 2`; zeros of `D` in the right box for `alpha = 0.02, 0.5, 5, 100` | `Z_D = 2` for all four `alpha`; axis winding `23.98..24.00` versus `N_0 = 24`. Theorems A-C and (4.1)-(4.3) hold for DH with `kappa > 0`. Nothing fails; nothing claims `kappa = 0`. |
| zeta, same window | same | `N = 17`, `N_0 = 17`, `Z_D = 0` for all four `alpha`; axis winding `17.01, 17.24, 17.84, 17.99` (within the `< 1` error of (4.1)). |
| Backward heat (`heat_index.py`, 45 digits), box `5 < Im z < T2`, `|Re z| < X` | `t = 0, -2, -5, -10, -20, -40`; `alpha = 0.3, 2, 20` | `kappa(R)` / `Z_D`: `t=0`: 0 / 0,0,0. `t=-2`: 1 / 1,1,1. `t=-5`: 2 / 2,2,2 (`T2 = 45.5`), 3 / 3,3,3 (`T2 = 58.2`), 3 / 3,2,2 (`T2 = 51.4`, a zero of `D` sits near the top edge). `t=-10`: 2 / 2,2,2. `t=-20`: 3 / 3,3,3 with `X = 9`; with `X = 4` the box gives 1 / 2,2,2 because two zeros of `F_t` have `Re z > 4` (for `t < 0` the right edge must lie beyond all zeros). `t=-40`: 0 / 0,0,0 in the box. The framework reports `kappa > 0` where the conclusion is false. All mismatches are box-edge terms of (4.2). |
| Sign twist (`sign_twist.py`) | far-edge prime term with `eps_n = +1`, random `+-1`, `-1`, `sigma = 2, 1.5, 1.1`, `t <= 2000` | max `|E|` = 0.136/0.140/0.136, 0.230/0.234/0.230, 0.376/0.402/0.376; bound `log zeta(sigma)/pi`. The only arithmetic term in the index formula is sign-blind and below one unit. |

No argument for RH is made, so no step has to fail on a control. The controls confirm that the index formalism is
an exact count valid for every member of the three families, and so carries no arithmetic constraint by itself.

## 7. Verdict

- Delivered: Theorems A, B, C (PROVED, self-contained); identity (4.1) (PROVED); non-applicability of
  Gohberg-Krein and the relative-index statement (PROVED); the isolated-pair Hankel norm (PROVED for the model);
  dictionary to Levinson (PROVED at leading order).
- Index formula: `kappa(window) = (N - N_0)/2 + edge`, with `N` from the gamma factor plus a bounded prime term and
  `-N_0` the axis winding of `S`. It is the argument principle; it cannot be evaluated arithmetically without the
  zeros.
- Alpha-freedom: equals Levinson's linear parameter; optimum already known; no unconditional count improves.
- The angle closes as a precise obstruction. No pivot was taken: the adjacent idea found (an inertia theorem for
  higher-degree `Q(d/dz)F`, which would put Conrey's full family in Krein form) would not change the mean-value
  nature of the loss.

## 8. Three weakest steps

1. Heat-flow monotonicity and finiteness of `kappa(t)` for `t > 0` rely on Ki-Kim-Lee and de Bruijn /
   Csordas-Smith-Varga, quoted from memory; entry of non-real zeros from infinity was not excluded by an argument
   written here.
2. The `O(log T)` bound for the horizontal edges in (4.2), and hence "Levinson's argument step is an equality up to
   `O(log T)`", is the standard Jensen argument but was not written out, and its uniformity in `alpha` was not
   checked. The Conrey mean-value formula is quoted from memory; it was validated only by reproducing 0.342 and the
   order of the known simple-zero constants.
3. The "not norm-continuous" spectral-flow statement is proved only in the two-zero model; for a pair inside the
   full zero set it is expected (same local structure) but not proved. Numerics are high-precision floating point
   with argument-principle sampling, not interval-certified; the `alpha = 100` DH contour was under-resolved
   (large phase steps flagged), although the integer agreed.

## Files

- `tmp/research-2026-11-16/push/sq-krein-index/RESULT.md`
- `toy_inertia.py` / `.log`, `dh_window.py` / `.log`, `heat_index.py` / `heat_index*.log`, `levinson_alpha.py` / `.log`,
  `sign_twist.py` / `.log` in the same directory.
