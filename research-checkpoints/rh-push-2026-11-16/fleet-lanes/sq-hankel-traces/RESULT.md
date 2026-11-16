# sq-hankel-traces: trace identities for the anticausal Hankel block Gamma_-

Date 2026-11-16. Lane: square-root lane follow-up (g-spinor-square-root). Scope: this directory only.
Nothing here proves or refutes RH; no zero-free region, density bound or Lambda bound changes.
Labels: PROVED (argument given here, author-checked only) / CLASSICAL / MEASURED (floating point, not
interval-certified) / OPEN.

## Verdict

**Precise obstruction, with four exact identities.**

1. Every trace of `Gamma_-` is an explicit positive functional of the off-line data alone (Theorem 1):
   `tr (Gamma_-* Gamma_-)^m = tr (R* A R conj(A))^m`, `A_jk = 1/(conj z_j + z_k)`, `R = diag(r_j)`, where
   `z_j` are the solutions of `xi'/xi(1/2+z) = -1/alpha` in `Re z > 0` and `r_j = 2/(alpha L'(z_j))`.
   For an isolated off-line zero at distance `beta` from the line the singular value is
   `alpha / sqrt(alpha^2 + beta^2)`.
2. The two classical trace identities for a unimodular symbol give
   `||Gamma_+||^2 - ||Gamma_-||^2 = N_0` (number of critical-line zeros) and
   `||Gamma_+||^2 + ||Gamma_-||^2 =` Besov energy of the boundary phase (Theorem 2). Neither isolates `Gamma_-`.
3. The anticausal part can be computed locally on the critical line and shifted to any line `Re z = x`:
   a Gaussian-windowed anticausal transform equals the off-line pole sum up to an explicit Gaussian
   remainder (Theorem 3). This gives a windowed RH criterion; measured, it separates zeta from DH by a
   factor 2.9e7 at one window.
4. The prime side exists and is exact (Theorem 4): in `Re z > sigma_0` the symbol is
   `S = -1 + 2 sum_m alpha^m P^m / (1 + alpha G)^{m+1}`, with `P^m = sum_n Lambda^{*m}(n) n^{-1/2-z}`.
   (`sigma_0 = sigma_0(alpha) > 1/2`). Its transform is supported on `u >= 0`. **The prime-side value of the anticausal kernel is
   identically zero, and it is zero for every sign twist of Lambda.** The identity
   "zero side = prime side" for `||Gamma_-||_HS^2` therefore reads
   `[positive sum over off-line poles] = [boundary functional on Re z = 0] != [0 from Re z > sigma_0]`;
   the difference between the last two is the residue sum itself. It is the residue theorem, not a lever.

No density theorem follows. The structural hypotheses used by the identities admit arbitrary off-line
pole sets (Proposition 5), and DH satisfies all of them with `>> T` off-line zeros.

Multiplicativity enters at exactly one place: the Euler product gives non-vanishing in `Re s > 1`, hence
`Delta_F <= 1/2` and `|S| <= 1` in `Re z > 1/2`. The Cayley expansion itself (Theorem 4) needs only the
size bound `|Lambda(n)| <= log n`.

## 0. Plan; what is new relative to the atlas, the walls and the square-root lane

- g-spinor-square-root (refereed) proved `H_c >= 0 <=> Gamma_- = 0 <=> RH`, the Krein square, and quoted
  `rank Gamma_- = #off-line zeros`. It did not compute `Gamma_-`. New here: the kernel of `Gamma_-`
  in closed form, the residue formula `r_j = 2/(alpha L'(z_j))`, all traces, the single-zero singular
  value, the windowed contour-shift identity, the Cayley/Dirichlet-convolution expansion and its support
  statement, and the run of the three controls against each step.
- Atlas section 2 (shift bridge `R_a = X(w-a)/X(w+a)`, threshold `a >= Delta`) is the finite-shift
  version of the same symbol (`S` is `R_a` to first order in `a = alpha`). Not re-run. g-passive-cascade
  Proposition 2 (`|R_a| < 1` in `Re w > 1/2 + a` carries no zero information) is the shift-version of
  Theorem 4(c) here.
- Walls. DH: section 6. Backward heat: section 6. Sign twist: section 6. MV-CAP: section 5 (the only
  route from these identities to a density bound is a mean value of a function of `zeta'/zeta` inside
  the strip). Verified height: Theorem 3 is a finite-window statement and restates it.

## 1. Setup and normalisation

`F(z) = xi(1/2+z)` (even, real on the real axis, order one), `L = F'/F`, `alpha > 0`,
`D = F + alpha F'`, `N = F - alpha F'`, `S = N/D = (1 - alpha L)/(1 + alpha L)`.
`F` even gives `N(z) = D(-z)`, so `S(z) S(-z) = 1`; with reality, `|S(it)| = 1`.
On the line, `f(t) = F(it)` real, `L(it) = -i f'/f`, `S(it) = exp(2i arctan(alpha f'(t)/f(t)))`.

`S` acts on `L^2(R, dx)` as the Fourier multiplier `S(it)`, i.e. convolution with
`k(u) = (1/2 pi) int S(it) e^{itu} dt` (a distribution). `P_+ = 1_{(0,inf)}`, `P_- = 1_{(-inf,0)}`.

    Gamma_- : L^2(0,inf) -> L^2(-inf,0),  (Gamma_- phi)(x) = int_0^inf k(x - y) phi(y) dy   (uses k on u < 0),
    Gamma_+ : L^2(-inf,0) -> L^2(0,inf),  kernel k(x - y), u = x - y > 0.

If `S` is bounded analytic in `Re z > 0` then `k` vanishes on `u < 0` and `Gamma_- = 0`. The cutoff
position `c` and the PR 43 scaling `e^{zu/2}` are a translation and a dilation; Hankel spectra and
Hilbert-Schmidt norms are invariant under both. `Delta_F := sup { Re rho : F(rho) = 0 }`.

Hadamard (CLASSICAL): `L(z) = sum_rho 1/(z - rho)` with `rho, -rho` paired, absolutely convergent, so
`Re L(z) > 0` and `|S(z)| < 1` for `Re z > Delta_F`. For zeta `Delta_F <= 1/2` (CLASSICAL).

## 2. Theorem 1: Gamma_- in closed form (PROVED for finitely many off-line zeros)

Let `Z_+ = { z : Re z > 0, 1 + alpha L(z) = 0 }` (the poles of `S` in the right half-plane).

**(a) Location.** `Z_+` lies in `0 < Re z < Delta_F`. No pole lies on the axis unless `f` has a
multiple real zero (then `N` vanishes there too). *Proof.* `Re L > 0` for `Re z > Delta_F`;
`D(it) = f(t) - i alpha f'(t)`.

**(b) Residue.** At a simple pole, `r_j := Res_{z_j} S = 2 / (alpha L'(z_j))`.
*Proof.* `N = 2F - D`, so `r_j = 2F/(F' + alpha F'')` at `z_j`. There `F' = -F/alpha` and
`F''/F = L' + L^2 = L' + alpha^{-2}`, so `F' + alpha F'' = alpha F L'`. Here `L' = -sum_rho (z-rho)^{-2}`.

**(c) Kernel.** If `Z_+` is finite and the poles simple, `S = S_0 + sum_j r_j/(z - z_j)` with `S_0` bounded
analytic in `Re z > 0`, and

    k(u) = - sum_{z_j in Z_+} r_j e^{z_j u}     (u < 0).

*Proof.* `1/(z - z_j)` on the axis is the transform of `-e^{z_j u} 1_{u<0}`; `S_0` contributes nothing to
`u < 0` (Paley-Wiener).

**(d) Traces.** With `a_j(x) = e^{z_j x} 1_{x<0}`, `b_j(y) = e^{-conj(z_j) y} 1_{y>0}`:
`Gamma_- = - sum_j r_j |a_j><b_j|`, Gram matrices `<a_j,a_k> = 1/(conj z_j + z_k) =: A_jk`,
`<b_j,b_k> = conj(A_jk)`. Hence `rank Gamma_- = |Z_+|` (Kronecker), the nonzero spectrum of
`Gamma_-* Gamma_-` is the spectrum of the matrix `R* A R conj(A)`, `R = diag(r_j)`, and

    tr (Gamma_-* Gamma_-)^m = tr (R* A R conj(A))^m,
    ||Gamma_-||_HS^2 = sum_{j,k} conj(r_j) r_k / (conj z_j + z_k)^2
                     = (4/alpha^2) sum_{j,k} 1 / ( conj(L'(z_j)) L'(z_k) (conj z_j + z_k)^2 )
                     = int_0^inf u |k(-u)|^2 du.

The quadratic form is positive definite (Gram matrix of `u^{1/2} e^{-z_j u}`), so every trace is a
positive functional of the off-line data and vanishes iff `Z_+` is empty.

**(e) Single-zero weight.** For the two-zero local model `F ~ (w - beta)(w + beta)`, `w = z - i gamma`
(zero `rho = beta + i gamma` and its mirror `-conj rho`):
`S = (w^2 - beta^2 - 2 alpha w)/(w^2 - beta^2 + 2 alpha w)`, one pole in the right half-plane at
`w_+ = sqrt(alpha^2 + beta^2) - alpha`, residue `-2 alpha w_+ / sqrt(alpha^2+beta^2)`, singular value

    sigma = |r| / (2 w_+) = alpha / sqrt(alpha^2 + beta^2).

So an isolated off-line pair `{rho, conj rho}` contributes `2 alpha^2/(alpha^2 + beta^2)` to
`||Gamma_-||_HS^2`: `~ 2 (alpha/beta)^2` for `alpha << beta` and `-> 2` (a count) for `alpha -> inf`.
Interaction with other zeros changes the value (it enters through `L'(z_j)`), not the count.

MEASURED (`toy.py`, `toy.log`, rational `F`, double precision):

| Check | Result |
|---|---|
| RH toy (8 on-line zeros), alpha = 0.7 | 0 poles in RHP; `k(u)`, `u<0`, by quadrature `< 1e-5`; `||Gamma_+||^2 = 8` |
| one quartet (beta = 0.3) + 6 on-line zeros, alpha = 0.7 | 2 RHP poles; `k(-0.3), k(-1), k(-2.5)` quadrature 0.253627, -0.190507, 0.171062 vs pole formula 0.253637, -0.190507, 0.171061 |
| same, `||Gamma_-||_HS^2` | 1.1477384 (singular values^2 0.5937, 0.5540); Besov integral 8.295477 = `||G+||^2 + ||G-||^2` from poles 8.295477 |
| isolated quartet, (alpha, beta) = (0.7,0.3), (0.1,0.4), (3,0.2) | sigma = 0.9191450, 0.2425357, 0.9977852 vs `alpha/sqrt(alpha^2+beta^2)` = 0.9191450, 0.2425356, 0.9977852 |
| two quartets, alpha = 0.1 ... 1000 | `||Gamma_-||_HS^2` = 0.778, 3.763, 3.9974, 3.99997, 3.9999997 -> 4 = number of off-line zeros |

Infinitely many off-line zeros (the DH case): (a), (b) hold verbatim; (c), (d) need a summability
statement for `sum r_j/(z - z_j)` that is not proved here (OPEN, not needed below: Theorem 3 is local).

## 3. Theorem 2: the two global trace identities (CLASSICAL, specialised; MEASURED on the toy)

For a unimodular symbol with `S - S(inf)` in the Besov class `B^{1/2}_2`:

    ||Gamma_+||_HS^2 + ||Gamma_-||_HS^2 = (1/4 pi^2) int int |S(it) - S(is)|^2 / (t - s)^2 dt ds,
    ||Gamma_+||_HS^2 - ||Gamma_-||_HS^2 = -(1/2 pi i) int conj(S) dS = #{poles in LHP} - #{poles in RHP}.

The first is the Hilbert-Schmidt norm of the commutator `[P_+, S]`; the second is the index formula
(`tr(S*[P_+,S])`, argument principle; zeros of `S` in the RHP are the mirror images of its LHP poles).
By the Hermite-Biehler count with index (CLASSICAL; measured in the toy and in the square-root lane)
`#LHP - #RHP = N_0`, the number of zeros of `f` on the line. Toy: `-winding = 6.000000`, pole count `8 - 2 = 6`.

What they give:

- The difference identity is `N_0 = N - 2 N_off`, where `N` is computed by the argument principle
  (Riemann-von Mangoldt; the arithmetic input is `arg zeta` on `Re s > 1` and on the horizontal sides).
  It is the counting identity. It has no sign information beyond `N_off >= 0`.
- The sum identity bounds `||Gamma_-||^2` by the Besov energy of the boundary phase
  `2 arctan(alpha f'/f)`. On a window of height `T` that energy is of the order of the number of all
  zeros in the window (each zero is a full turn of the phase). So it yields `N_off-weight <= O(N)`: trivial.
- For zeta and DH both sides are infinite globally (infinitely many turns). The local phase derivative is
  `d/dt arg S(it) = 2 alpha (f'/f)' / (1 + alpha^2 (f'/f)^2)`; it is `< 0` for all `t` iff the Laguerre
  inequality `(f'/f)' < 0` holds on the line (CLASSICAL necessary condition for RH, not sufficient).

## 4. Theorem 3: windowed anticausal transform and contour shift (PROVED)

For `t0` real, `Dl > 0`, `u < 0` put `w(t) = exp(-(t-t0)^2/(2 Dl^2))`, `W(z) = exp((z - i t0)^2/(2 Dl^2))`,

    I(u) = I_{t0,Dl}(u) := int S(it) w(t) e^{itu} dt.

**Theorem 3.** Let `x > 0` be such that no pole of `S` lies on `Re z = x`. Then

    I(u) = -2 pi sum_{z_j in Z_+, Re z_j < x} r_j W(z_j) e^{z_j u}  +  Rem_x(u),
    |Rem_x(u)| <= sqrt(2 pi) Dl sup_{Re z = x} |S| exp(x u + x^2/(2 Dl^2)).

If `x >= Delta_F` then `sup |S| <= 1`; with `x = |u| Dl^2` the remainder is at most
`sqrt(2 pi) Dl exp(-u^2 Dl^2 / 2)`.

*Proof.* `I(u) = (1/i) int_{iR} S(z) W(z) e^{zu} dz`. Move the contour to `Re z = x`
(`|W(x+iy)| = exp((x^2 - (y-t0)^2)/(2 Dl^2))` gives decay on horizontal sides chosen between zeros of the
order-one function `D`; CLASSICAL minimum-modulus choice of heights). The rectangle is traversed
clockwise, giving `-2 pi i` times the residues `r_j W(z_j) e^{z_j u}`. On the new line
`|e^{zu}| = e^{xu}` and `int |W| dy = sqrt(2 pi) Dl e^{x^2/(2 Dl^2)}`.

**Corollary 3a (unconditional for zeta).** For `|u| Dl^2 >= 1/2`:
`I(u) = -2 pi sum_{Z_+} r_j W(z_j) e^{z_j u} + O(sqrt(2 pi) Dl e^{-u^2 Dl^2/2})`, constant 1.

**Corollary 3b (criterion).** RH `<=>` for one (equivalently every) window `(t0, Dl)` and all `u < 0`:
`|I(u)| <= sqrt(2 pi) Dl exp(-u^2 Dl^2/2)`.
*Proof.* `=>`: `|S| <= 1` in `Re z > 0`, take `x = |u| Dl^2`. `<=`: `I` is bounded and Gaussian-small on
`u < 0`, so `S(z)W(z) = (1/2 pi) int I(u) e^{-zu} du` extends analytically to `Re z > 0` (the `u<0` part is
entire, the `u>0` part converges for `Re z > 0`); `W` has no zeros, so `S` has no pole in `Re z > 0`,
i.e. `Z_+` is empty, i.e. no off-line zeros (count of section 3, CLASSICAL).

This answers "can the anticausal part be computed on a line `Re z = sigma > 1/2` and continued": on such
a line the anticausal part is zero (bounded by the Gaussian remainder in the windowed form), and the
continuation back to `Re z = 0` adds exactly the residue sum. The identity contains no inequality that
the zeros have to satisfy: it holds for any pole configuration.

MEASURED (`detector.py`, `detector.log`, mpmath 25 digits, `t0 = 85.699348`, `Dl = 1`, trapezoid step 0.01):

| `u` | Gaussian bound | zeta `|I|`, alpha=0.3 | DH `|I|` | DH `|pole sum|` | DH `|I - pole sum|` | zeta `|I|`, alpha=1 | DH `|I|` | DH `|I - pole sum|` |
|---|---|---|---|---|---|---|---|---|
| -0.5 | 2.212 | 1.045 | 1.451 | 1.069 | 0.465 | 0.728 | 0.603 | 1.075 |
| -1 | 1.520 | 0.693 | 1.313 | 0.998 | 0.356 | 0.517 | 0.342 | 0.693 |
| -2 | 0.3392 | 0.1522 | 0.9492 | 0.8711 | 0.0859 | 0.1159 | 0.4350 | 0.1466 |
| -3 | 0.02785 | 0.01256 | 0.76660 | 0.75995 | 0.00720 | 0.00941 | 0.51260 | 0.01183 |
| -4 | 8.409e-4 | 3.817e-4 | 0.663214 | 0.663010 | 2.19e-4 | 2.808e-4 | 0.495584 | 3.55e-4 |
| -6 | 3.818e-8 | 1.742e-8 | 0.50464428 | 0.50464427 | 9.9e-9 | 1.253e-8 | 0.44730386 | 1.6e-8 |

DH pole (one in the window, from the off-line zero 0.808517 + 85.699348i, `beta = 0.3085`):
alpha = 0.3: `z_j = 0.136468 + 85.724561i`, `r_j = -0.175137 + 0.043718i`, `|r_j|/(2 Re z_j) = 0.6614`
(two-zero model: `Re z_j = 0.1304`, `sigma = 0.6970`); alpha = 1: `z_j = 0.051527 + 85.743182i`,
`r_j = -0.095872 + 0.014395i`, `|r_j|/(2 Re z_j) = 0.9407` (model 0.0465, 0.9556).

Reading: for zeta `|I(u)|` is below the Gaussian bound at every `u` (ratio ~0.45 at alpha = 0.3, ~0.33 at
alpha = 1), consistent with no pole near this window. For DH `I(u)` equals the one-pole term to within the
Gaussian remainder at every `u` and decays only like `e^{-Re z_j |u|}`; at `u = -6` zeta and DH differ by a
factor `2.9e7`. This is zero detection at a height where the zeros are already known. It is the same
information as the inertia count of the square-root lane, in a form with an explicit error term.

## 5. Theorem 4: the prime side (PROVED in `Re z > sigma_0`) and why it is zero

`s = 1/2 + z`. `G(z) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2)` (gamma and pole part),
`P(z) = sum_n Lambda(n) n^{-1/2-z}` (`Re z > 1/2`), `L = G - P`.

**(a) Cayley expansion.** Where `alpha |P| < |1 + alpha G|`:

    S = -1 + 2/(1 + alpha G - alpha P) = -1 + sum_{m>=0} g_m(z) P(z)^m,   g_m = 2 alpha^m (1 + alpha G)^{-m-1},
    P^m = sum_n Lambda^{*m}(n) n^{-1/2} n^{-z}.

`Lambda^{*m}` is the m-fold Dirichlet convolution, supported on integers with at most `m` distinct prime
factors. Define `sigma_0(alpha)` as the least `sigma` with `alpha |P| < |1 + alpha G|` on `Re z >= sigma`;
it is finite because `|P| <= -zeta'/zeta(1/2 + Re z) -> 0` and `Re G -> inf` like `(1/2) log|z|`.
MEASURED (sufficient criterion `alpha (-zeta'/zeta)(1/2+sigma) < 1 + alpha min_y Re G(sigma+iy)`):
`sigma_0 <= 0.78, 1.26, 2.60` for `alpha = 0.3, 1, 10`. `G` is `>= 0.2208` on the real axis `z > 1/2`
(minimum at `z ~ 3.76`) but `Re G` is negative near `z = 1/2 + 0.7i` (-0.507 at `0.51 + 0.7i`), so
`sigma_0 > 1/2` in general. `S` is contractive in all of `Re z > 1/2` regardless (section 1); only the
expansion needs `sigma_0`.

**(b) Support.** Each `g_m` is bounded analytic in `Re z >= sigma_0`, so `g_m(z) n^{-z}` is the transform
of a distribution supported on `u >= log n`. Hence the transform `T` of `S` along `Re z = sigma >= sigma_0`
(with the weight `e^{sigma u}` removed) is

    T(u) = -delta(u) + sum_{m>=0} sum_n Lambda^{*m}(n) n^{-1/2} gcheck_m(u - log n),   supp gcheck_m in [0, inf),

and `T(u) = 0` for `u < 0`. **The prime-side anticausal kernel is identically zero.**

**(c) Size only.** (a) and (b) use `|Lambda(n)| <= log n` and nothing else. They hold verbatim with
`Lambda` replaced by `eps_n Lambda(n)`, `|eps_n| <= 1`.

**(d) The explicit formula for S (formal for the infinite sums; exact in windowed form by Theorem 3).**

    k(u) - T(u) = - sum_{poles z_j of S, 0 < Re z_j < sigma} r_j e^{z_j u}   for all u.

On `u < 0` this is Theorem 1(c). On `u > 0`, using `k(u) = sum_{Re z_j < 0} r_j e^{z_j u}`:

    T(u) = sum_{all poles of S} r_j e^{z_j u},   u > 0,

the explicit formula of the Lagarias function `xi + alpha xi'` in Cayley form. On-line poles contribute
decaying modes `e^{-|Re z_j| u}` (infinitely many, conditionally convergent); off-line poles contribute
growing modes `e^{Re z_j u}`. An off-line zero is visible on the prime side only as exponential growth of
`T(u)` as `u -> +inf`, i.e. `T(u) = O(e^{eps u})` in mean iff RH. This is the Cayley transform of
`psi(x) - x = O(x^{1/2+eps})` and has the same content.

**(e) No prime-side expression for the traces.** `||Gamma_-||_HS^2 = int_0^inf u |k(-u)|^2 du` is a
functional of `k` on `u < 0`, where `T = 0`. Any formula for it in terms of `T` must go through (d), i.e.
through the growing modes of `T` on `u > 0`, which are not separated from the on-line modes by any
positive weight: the on-line sum is an infinite conditionally convergent exponential sum (MV-CAP wall:
second moments of `T` on `[U, 2U]` control mean growth, not the presence of a single growing mode of
small residue).

**Proposition 5 (no density bound from the structural hypotheses; PROVED by example).** Let
`S = B_1/B_2` with `B_2` a Blaschke product (finite, or satisfying the Blaschke condition) over any
conjugation-symmetric set `{zeta_j}` in `0 < Re z < 1/2 - delta`, and `B_1` the Blaschke product over
`{zeta_j + delta}`. Then `S` is unimodular on the axis, real, `S(z)S(-z) = 1`, `|S| <= 1` in
`Re z >= 1/2`, and has poles exactly at `{zeta_j}`.
*Proof.* For a Blaschke factor `b_zeta(z) = (z - zeta)/(z + conj zeta)`: `b_zeta(-z) = 1/b_{conj zeta}(z)`,
and `1 - |b_zeta(z)|^2 = 4 Re z Re zeta / |z + conj zeta|^2` is increasing in `Re zeta` while
`Re zeta < Re z`. So the hypotheses {unitarity on the line, functional equation, contractivity right of
1/2, vanishing prime-side anticausal kernel} put no constraint on the number or position of off-line
poles. A density bound needs input on `L = F'/F` itself.
The remaining structure (`L` has simple poles with positive integer residues) is shared by DH, whose
off-line zeros number `>> T` in `1/2 < Re s < 1` and in `Re s > 1` (CLASSICAL: Davenport-Heilbronn,
Voronin). So no chain of DH-valid steps from these identities gives better than `N(sigma, T) = O(T)`
(Bohr-Landau strength), and the identities here do not give even that without a mean value of a function
of `zeta'/zeta` inside the strip, which is not available unconditionally.

## 6. The three controls

| Step | DH | backward heat (`tau < 0`) | sign twist `eps_n Lambda(n)` |
|---|---|---|---|
| Setup: `F` even real order <= 1, `S` unimodular on the axis | holds | holds | **fails**: no functional equation; for random signs `P_eps` has `Re z = 0` as natural boundary (CLASSICAL, a.s.), for `eps = lambda` (Liouville) `L_eps = G - zeta'/zeta(s) + 2 zeta'/zeta(2s)` has residues `-1` at the zeros of zeta and a pole from `zeta(2s)` at `s = 1/2` |
| Thm 1 (kernel, residues, traces) | holds; `Z_+` infinite | holds (toy E: `tau = -0.05` gives 4 non-real zeros, 2 RHP poles, `||Gamma_-||^2 = 1.753`; `tau >= 0`: 0) | not defined |
| Thm 2 (index, Besov) | holds | holds | not defined |
| Thm 3 (window identity) | holds; Gaussian remainder only for `x >= Delta_DH > 1/2` | holds with `Delta_{F_tau}` (finiteness of `Delta_{F_tau}` not checked here, OPEN) | not defined on the axis |
| Thm 4 (a)-(c): Cayley expansion, `T = 0` on `u < 0` | holds right of the abscissa of `f_DH'/f_DH`, which is `> 1/2` because DH has zeros in `Re s > 1`; coefficients are not supported on prime powers and not `O(log n)` | **fails**: `F_tau` is not gamma times a Dirichlet series (flow-euler-defect: coefficient cocycle `exp(2 tau log m log n)`); no `sigma_0` from this route | **holds verbatim** |
| "`Delta_F <= 1/2`" | **fails** (this is the only step using the Euler product) | not available | not meaningful |
| `Gamma_- = 0` | false | false | false / undefined |

Reading. The zero side (Theorems 1-3) uses only the functional equation and holds for DH and backward
heat, where `Gamma_- != 0`. The prime side (Theorem 4) uses only `|Lambda(n)| <= log n` and holds for every
sign twist, where there is no `Gamma_-`. The two sides share no hypothesis. The link between them is the
analytic continuation of `S` from `Re z > 1/2` to `Re z = 0`, and the traces of `Gamma_-` are exactly the
data that continuation adds. Multiplicativity is used once, for `Delta_F <= 1/2`. A proof through this
lane would need a second, essential use: cancellation in `sum_n Lambda^{*m}(n) n^{-1/2-z}` for
`0 < Re z < 1/2` uniform in `m`, which is the content of the 7/8-type results and is not produced by any
trace identity here.

## 7. Verdict and what the identities give

- Delivered: closed form of `Gamma_-` and all its traces (Thm 1); the positive weight of an off-line zero
  `alpha^2/(alpha^2+beta^2)`; the index and Besov identities (Thm 2); a local, contour-shift form with an
  explicit remainder and a single-window RH criterion (Thm 3); the Cayley/Dirichlet-convolution expansion
  and the vanishing of the prime-side anticausal kernel (Thm 4); a structural no-density proposition (Prop 5).
- Not delivered, with reason: an identity `[positive sum over off-line zeros] = [arithmetic expression]`.
  The arithmetic expression obtained is `0`, and the identity it would sit in is false as stated; the
  correct statement has the residue sum on both sides.
- No pivot is taken: the adjacent idea (density from the windowed identity) is closed by Proposition 5 and
  the DH count in the same section.

## 8. Three weakest steps

1. Theorem 1(c),(d) are proved for finitely many simple off-line poles. For infinitely many (DH) the
   decomposition `S = S_0 + sum r_j/(z-z_j)` and the meaning of `||Gamma_-||_HS` (possibly infinite) are not
   treated; only the windowed Theorem 3 is claimed there. The count `|Z_+| = #off-line zeros in Re z > 0`
   is quoted (Hermite-Biehler with index) and measured, as in the square-root lane.
2. Theorem 3: the choice of horizontal sides (minimum modulus of `D` between its zeros) is quoted as
   classical, not written. Theorem 4(d),(e) are formal for the infinite pole sums; (e) is an argued
   obstruction (no positive weight separates growing from conditionally convergent decaying modes), not a
   no-go theorem. The values of `sigma_0(alpha)` are grid evaluations of a sufficient criterion.
3. Numerics are floating point (double for the toy, 25 digits for zeta/DH), one window, two values of
   `alpha`; nothing is interval-certified. The backward-heat row uses a polynomial toy, not the theta
   kernel family; finiteness of `Delta_{F_tau}` for the true family was not checked.

## Files

- `tmp/research-2026-11-16/push/sq-hankel-traces/RESULT.md`
- `tmp/research-2026-11-16/push/sq-hankel-traces/toy.py`, `toy.log`
- `tmp/research-2026-11-16/push/sq-hankel-traces/detector.py`, `detector.log`
