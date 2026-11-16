# sq-canonical-det: Suzuki's Fredholm determinants det(1 +/- K[t]) and the bridge square root

Date 2026-11-16. Scope: `tmp/research-2026-11-16/push/sq-canonical-det/` only; motherbox work in
`~/rh-push/sq-canonical-det/`. Nothing committed or pushed. Nothing here proves or refutes RH.
Labels: PROVED (argument given here) / CLASSICAL / MEASURED (multiprecision Ritz-Galerkin, not an
interval certificate) / ARGUED / OPEN.

## Verdict

**Precise obstruction, one small unconditional corollary, and a corrected dictionary.**

1. The task premise needs two corrections, both from the papers themselves (TeX sources of
   arXiv:1204.1827 and arXiv:1606.05726 read in full for the relevant sections).
   (a) Suzuki's operator `K[t]` is not a truncation of the bridge Hankel operator `K_c = R_c Gamma_+`
   (which is not compact; `det(1 +/- K_c)` does not exist). It is the reflected finite-window
   compression of the scattering multiplier. The exact link is `1 - K[t]^2 = 1_J K_c^2 1_J`
   (Lemma B): Suzuki's determinant product is the Fredholm determinant of the bridge square-root
   energy compressed to a window of length `2t` next to the cut.
   (b) Suzuki does not state "RH iff the determinants do not vanish". His Theorem 2.4 needs
   non-vanishing for all `t` **and** a limit condition (4), for a sequence `omega_n -> 0`. Lemma A
   below shows (4) is implied: non-vanishing on `[0,T]` is equivalent to `||K[T]|| < 1`, and for all
   `T` to `Theta_omega` being inner. The unconditional statements in the papers are: all `t` for
   `omega > 1/2`, and an unspecified `tau > 0` for `omega <= 1/2`.
2. `||K[t]|| < 1` is, by Nehari's theorem, the statement that the finite data
   (gamma factor, `q(n)` for `n < e^{2t}`) has a completion to a Schur function (Lemma D). No
   multiplicativity enters. Controls: Davenport-Heilbronn (functional equation, no Euler product)
   passes at every `t` reached; the sign twist at the prime 2 (Euler product kept, functional
   equation lost) fails at `t = 0.362` (`nu = 1`) and `t = 0.380` (`nu = 5`), just after its first
   coefficient enters at `t = (log 2)/2 = 0.347`. At finite `t` the determinant criterion tests
   compatibility of the first coefficients with the functional equation, not the Euler product.
3. The margin `1 - ||K[t]||` for zeta collapses at least exponentially (table in section 5). The trace
   series `log det(1 +/- K[t]) = -sum_k (-/+1)^k tr K[t]^k / k` converges exactly where `||K[t]|| < 1`,
   at rate `||K[t]||^k`. A prime-data certificate `tr K[t]^{2k} < 1` needs `k ~ 1/(2 margin)`; the
   depth needed is tabulated. The `k = 1` (Hilbert-Schmidt) certificate reaches `t < 0.197` for
   `(omega, nu) = (1/4, 5)`.
4. New unconditional corollary (Lemma C + atlas section 8 certificate): for `omega = 1/4` and every
   `nu >= 5`, `det(1 +/- K_zeta^{1/4,nu}[t]) != 0` for `0 <= t <= log(8/5) = 0.4700`, with
   `||K^{1/4,nu}[t]|| <= (1 - 5e-7)^nu`. Suzuki's own argument (Prop. 4.2), made explicit, gives
   `tau ~ 0.057` for `(1/4, 5)`. This extends the range by a factor of about 8. It rests on the
   in-house `nu = 1` certificate, which I did not replay; my numbers are consistent with it.
5. Numerically (MEASURED) the determinants are nonzero for zeta on the whole computed range; tables
   in section 5.

Nothing in items 2 to 5 separates zeta from Davenport-Heilbronn on the computed range. That is the
obstruction: the finite-`t` determinant is Euler-blind, flow-stable, and has no slack.

## 0. Plan; what is new against the atlas and the walls

| Atlas item / wall | Overlap | New here |
|---|---|---|
| Atlas section 8 (`H_{a,L}`, kernel `h_a(xy)`; certified `||H_{1/4,L}|| <= 1 - 5e-7` for `L <= 8/5`; all-window boundedness iff Schur with cancellation) | Same operator as Suzuki 2012 with `nu = 1`, `L = e^t` | Not re-run. Used as an input. New: transfer to every `nu` (Lemma C), reduction of Suzuki's 2020 criterion to the norm (Lemma A), window identity with the bridge (Lemma B), Nehari form (Lemma D), numerics to `t = 3` (`L = 20`), controls. |
| screw-canonical lane (screw kernel, `omega -> 0` limit, DH passes to support 3.4) | Same phenomenon in the limit `omega -> 0` | Finite `omega`, Suzuki's actual determinants and Hamiltonian `gamma(t)`. |
| g-spinor-square-root (quoted Suzuki from memory) | Section 4.1 there | Corrected dictionary from the papers. |
| pick / euler lanes (finite Pick orders are Euler-blind) | Same conclusion | Continuous Nehari version with the exact data set `n < e^{2t}`. |
| DH wall | Every lemma holds verbatim for DH | Stated per lemma; DH run. |
| Sign-twist wall | - | The criterion fails for the twist at `t = 0.36 to 0.38`: it does see the sign of `Lambda(2)`, through loss of the functional equation. |
| Flow-blindness | - | Lemma A: for fixed `T` the condition is open in the kernel on `[0,2T]`. Not computed for the heat family (section 6). |
| Verified height | - | No implication in either direction was found between a `t`-range and a verified height (section 7). |

## 1. What the papers say (CLASSICAL, read from the TeX sources)

Notation of both papers: `s = 1/2 - iz`, `E^omega(z) = xi(1/2 + omega - iz)`,
`Theta_omega(z) = xi(1/2 - omega - iz)/xi(1/2 + omega - iz)`; `|Theta_omega| = 1` on the real line.

**arXiv:1204.1827 (zeta, `nu = 1`, multiplicative variable).**
`h_omega(x) = (1/x) sum_{n <= x} c_omega(n) g_omega(n/x)` for `x > 1`, zero for `x < 1`, with
`c_omega(n) = n^omega prod_{p|n}(1 - p^{-2 omega})` (coefficients of `zeta(s-omega)/zeta(s+omega)`) and
`g_omega(y) = (2 pi^omega/Gamma(omega)) [ y^{2-omega}(1-y^2)^{omega-1} - omega y^{omega-1} int_{y^2}^1 u^{1/2-omega}(1-u)^{omega-1} du ]`
on `(0,1)`. `H_{omega,a} = P_a H_omega P_a` on `L^2(0,a)`, kernel `h_omega(xy)`.
- Prop. 1.2: `zeta(s) != 0` for `Re s > 1/2 + omega_0` iff `Theta_omega` is inner for every `omega > omega_0`.
- Lemmas 4.2, 4.4 (`omega > 1/2`, unconditional): `H_{omega,a}` is Hilbert-Schmidt, `= 0` for `a <= 1`, and `||H_{omega,a}|| < 1` for every `a`.
- Theorem 2.3 (`omega > 1`, unconditional): `m(a) = det(1 + H_{omega,a})/det(1 - H_{omega,a})` and the canonical system `-a d/da (A,B)^T = z J diag(m^{-2}, m^2)(A,B)^T` has an explicit solution with `(A_1, B_1) = (A^omega, B^omega)`.
- Section 5: the range `0 < omega < 1/2` is "expected" under RH; nothing is proved there. There is no "small `t`" statement in this paper.

**arXiv:1606.05726 (Selberg class, powers `nu`, additive variable).**
`K(x) = (1/2 pi) int Theta_omega(u+iv)^nu e^{-ix(u+iv)} du` for `v` large; `K = 0` on `x < 0`;
`K(x) = sum_{n <= e^x} q(n) n^{-1/2} G(x - log n)` (eq. (2.7)); `K[t] f(x) = 1_{x<t} int_{-inf}^t K(x+y) f(y) dy`.
For zeta, `K(x) = e^{x/2} h_omega(e^x)` when `nu = 1`, and `a = e^t`.
- Theorem 2.1 (needs `nu omega d_L > 1`): `K[t]` is Hilbert-Schmidt with continuous kernel, `K[t] = 0` for `t <= 0`, and there is `tau > 0` with `det(1 +/- K[t]) != 0` on `[0, tau)`. Unconditional. `tau` is not computed; the proof (Prop. 4.2) gives non-vanishing when `M_v^2 e^{4vt} < 1` for some `v > 1/2 + omega`, `M_v = sup_u |Theta(u+iv)|^nu`.
- Prop. 4.4: if `E^{omega,nu}` is in the Hermite-Biehler class (unconditional for `omega > 1/2`; under GRH for `omega <= 1/2`) then `||K[t]|| < 1` for every `t >= 0`.
- `H(t) = diag(1/gamma(t), gamma(t))`, `gamma(t) = (det(1 + K[t])/det(1 - K[t]))^2` (eq. (2.10)).
- Theorem 2.4: GRH(L) iff there is a sequence `(omega_n, nu_n)`, `omega_n` decreasing to 0, `nu_n omega_n d_L > 1`, with (3) `det(1 +/- K^{omega_n,nu_n}[t]) != 0` for all `t >= 0` and (4) `lim_{t -> inf} J^{omega_n,nu_n}(t; z, z) = 0` for all `z` in the upper half-plane. Theorem 7.1 is the same for zero-free half-planes `Re s > 1/2 + omega_0`.

So: the RH-equivalent statement in the literature is (3) and (4) for a sequence `omega_n -> 0`.
Proved unconditionally: (3) for all `t` when `omega > 1/2`; (3) on `[0, tau)` with unspecified `tau > 0` when `omega <= 1/2`.

## 2. Dictionary with the bridge objects

Bridge (g-spinor-square-root): `F(z) = xi(1/2 + z)`, `S = (F - alpha F')/(F + alpha F')`, unitary on the
imaginary axis; position variable `r` (`F(z) = int kappa(u) e^{zu/2} du`); `P_c = 1_{(-inf,c)}`,
`Q_c = 1_{(c,inf)}`; `Gamma_+ = P S Q`, `Gamma_- = Q S P`; RH iff `Gamma_- = 0` iff `S` maps `L^2(-inf,c)` to itself.

| Bridge | Suzuki | Relation |
|---|---|---|
| spectral variable `z = s - 1/2` | `z_S`, `s = 1/2 - i z_S` | `z = -i z_S`; right half-plane <-> upper half-plane |
| position `r` | `x` (`e^{i z_S x}`) | `x = -r/2`. The preserved half-line is `(-inf, c)` for the bridge and `(b, inf)` for Suzuki. |
| symbol `S_alpha = (1 - alpha L)/(1 + alpha L)`, `L = F'/F` | `Theta_omega(z) = F(z - omega)/F(z + omega)` | Different functions. `Theta_omega = S_omega + O(omega^3)` on compacts. `S_alpha` is the Cayley transform of `alpha L`; `Theta_omega` is the finite shift. `Theta_omega^nu` is a gamma factor times a Dirichlet series, so its causal kernel on `[0, 2t)` uses only `n < e^{2t}`; `S_alpha` has no such finite-support property. |
| RH iff `S_alpha` inner for one `alpha > 0` | `Theta_omega` inner iff no zeros with `Re s > 1/2 + omega` (up to cancellation, Lemma A) | `omega` grades the difficulty; `omega >= 1/2` is unconditional; RH is `omega -> 0`. |
| cutoff `c` | none | `Gamma_+` at cutoff `c` is a translate of `Gamma_+` at 0. `c` is not Suzuki's `t`. |
| `K_c = R_c Gamma_+` on `L^2(c, inf)`, `K_c^2 = Gamma_+^* Gamma_+` | not used by Suzuki | Not compact (under RH its square is `Q - S_QQ^* S_QQ`, with infinite-dimensional eigenvalue-1 space). `det(1 +/- K_c)` is not defined. |
| window `J = (c, c + l)`, `W = 1_J S 1_J` | `K[t]`, `2t = l/2` in Suzuki units | `K[t] = W R_J` on `L^2(J)`, `R_J` the reflection about the midpoint of `J` (Lemma B). |
| `1_J K_c^2 1_J` | `1 - K[t]^2` | equal under innerness (Lemma B). |
| `Gamma_-` (rank = number of off-line pairs) | residue part of the causal kernel | `K = K_0 - i sum_j Res(Theta e^{-ixz}; z_j)`: section 2.3. |

### 2.1 Lemma A (reduction of the determinant condition) - PROVED

Let `nu omega > 1` (zeta; `nu omega d_L > 1` in general), so `K` is continuous, `K[t]` is compact and
self-adjoint on `L^2(-t, t)`, `K[0] = 0`, and `t -> K[t]` is norm-continuous.

(a) `det(1 + K[t]) det(1 - K[t]) != 0` for all `t` in `[0,T]` iff `||K[T]|| < 1`.

(b) This holds for every `T` iff `Theta_omega` is bounded and analytic in the upper half-plane (inner), i.e.
iff every zero `rho` of `xi` with `Re rho > 1/2 + omega` is cancelled by a zero at `rho - 2 omega` of at least
the same multiplicity. Suzuki's condition (4) is then automatic.

Proof. (a) `K[t] = P_t K[t'] P_t` for `t < t'`, so `||K[t]||` is non-decreasing and continuous, starting at 0.
A compact self-adjoint operator has `+||K||` or `-||K||` as an eigenvalue. If `||K[T]|| >= 1`, the intermediate
value theorem gives `t_0 <= T` with `||K[t_0]|| = 1`, so `det(1 - K[t_0]) det(1 + K[t_0]) = 0`. Conversely
`||K[t]|| <= ||K[T]|| < 1` on `[0,T]`.
(b) If `sup_t ||K[t]|| <= 1`, the form `(f, g) -> int int K(x+y) f(x) g(y)` is bounded by `||f|| ||g||` on compactly
supported `L^2` functions, so convolution with `K` is a bounded translation-invariant operator on `L^2(R)`:
a Fourier multiplier `m` with `|m| <= 1`. `K` is supported on `[0, inf)`, so for a test function `f`, `K * f` is in
`L^2` of a half-line and its Fourier-Laplace transform `g` is analytic in the upper half-plane. For `Im z` large
`g = Theta^nu fhat`. Choosing `fhat(z_0) != 0` at a putative pole `z_0` gives a contradiction. Hence `Theta^nu`
is analytic in the upper half-plane, bounded there (Suzuki's Lemma 3.1, Phragmen-Lindelof), unimodular on
the line: inner. Then `|Theta| < 1` in the open half-plane, `E^{omega,nu}` is Hermite-Biehler, and Suzuki's
Theorem 2.3 gives (4). The converse is his Prop. 4.4. The cancellation clause is the pole count of
`xi(s - omega)/xi(s + omega)`. QED.

Remarks. The `nu = 1` all-window statement is already in atlas section 8. What (a) adds: the determinant
condition on `[0,T]` is a single number, `||K[T]||`, of a truncated Hankel operator, and non-vanishing for
all `t` is exactly innerness, without the extra limit condition. DH: Lemma A holds verbatim (it uses only
`|Theta| = 1` on the line and the causal definition of `K`).

### 2.2 Lemma B (window identity) - PROVED

Assume `Theta = Theta_omega^nu` is inner. Let `U` be convolution with `K` on `L^2(R)` (unitary; maps
`L^2(b, inf)` into itself), `R f(x) = f(-x)`, `I = (-t, t)`, `W = 1_I U 1_I`. Then on `L^2(I)`

    K[t] = W R,      K[t]^2 = W W^*,      1 - K[t]^2 = B^* B,   B = 1_{(-inf,-t)} U^* 1_I.

`B` is the restriction to inputs supported in `I` of the adjoint of the non-vanishing Hankel block
`Q_{-t} U P_{-t}` at the cut `-t`. In bridge orientation (mirror `x = -r/2`, `S` in place of `U`):
`1 - K[t]^2` is unitarily equivalent to `1_J Gamma_+^* Gamma_+ 1_J = 1_J K_c^2 1_J`, `J = (c, c + l)`. Hence

    det(1 + K[t]) det(1 - K[t]) = det( 1_J K_c^2 1_J ).

Proof. `(K f)(x) = int K(x - y') f(-y') dy' = (U R f)(x)`. For `f` in `L^2(-inf, t)`, `R f` is in `L^2(-t, inf)`
and so is `U R f`; `P_t` cuts it to `I`; inputs supported in `(-inf, -t)` are annihilated. Self-adjointness
of `K[t]` gives `W^* = R W R`, so `K[t]^2 = W R W R = W W^*`. Then
`1_I - W W^* = 1_I U (1 - 1_I) U^* 1_I`; `U^*` maps `L^2(-inf, t)` into itself, so the part of `1 - 1_I`
on `(t, inf)` contributes zero and the rest is `B^* B`. QED.

So Suzuki's determinants are finite-window determinants of the square-root energy, not determinants of the
square root itself. The split into `det(1 + K)` and `det(1 - K)` comes from the reflection `R_J` about the
window midpoint (parity of the window), not from the reflection `R_c` about the cut that defines `K_c`.

### 2.3 Without innerness (ARGUED: residue calculus, convergence of the pole sum not addressed)

Moving the contour from `Im z = v` to the real line: `K(x) = K_0(x) - i sum_j Res(Theta^nu e^{-ixz}; z_j)`,
`K_0` the kernel of the unitary real-line multiplier (the bridge `S`), sum over poles `z_j` in the upper
half-plane. A simple pole contributes `-i c_j e^{-i z_j (x+y)}`: a rank-one kernel of norm about
`|c_j| e^{2 v_j t}/(2 v_j)` on `(-t, t)`, `v_j = Im z_j = Re rho_j - 1/2 - omega`. The window compression of `K_0`
is a contraction; the pole terms grow. This is the bridge statement "negative index = rank `Gamma_-`" in
Suzuki's coordinates, and it is why `||K[t]||` must cross 1 at a finite `T*` when a pole exists.

## 3. Lemmas C, D, E: what a proof from prime data can and cannot use

### 3.1 Lemma D (Nehari form) - PROVED from CLASSICAL Nehari

With `x = t - x'`, `y = t - y'`, `K[t]` is the Hankel operator on `L^2(0, inf)` with kernel function
`k(r) = K(2t - r)`, supported in `(0, 2t]`. Nehari's theorem on the half-line gives

    ||K[t]|| = min { ||Phi||_inf : Phi in H^inf(upper half-plane), inverse transform of Phi equals K on [0, 2t) }.

So `||K[t]|| < 1` iff the data (gamma factor, `q(n)` for `n < e^{2t}`) has a completion to a function of
sup norm `< 1` in the half-plane. Under RH `Theta^nu` is a completion of norm 1 and the strict inequality
is Suzuki's Prop. 4.4. Any other completion serves equally. The completion need not have an Euler product,
a functional equation, or a Dirichlet series beyond `e^{2t}`.

### 3.2 Lemma C (powers) and Corollary C1 - PROVED (C1 conditional on the atlas certificate)

**Lemma C.** For every `omega > 0`, `nu >= 1`, `t >= 0`: `||K^{omega,nu}[t]|| <= ||K^{omega,1}[t]||^nu`.
(For `nu = 1`, `omega <= 1/2` the kernel has integrable singularities `|x - log n|^{omega-1}`; the operator is
bounded and compact, not Hilbert-Schmidt.)

Proof. Let `r = ||K^{omega,1}[t]||` and `Phi` a Nehari completion with `||Phi||_inf = r`. `Phi^nu` is in
`H^inf` with norm `r^nu`, and its inverse transform is the `nu`-fold convolution of that of `Phi`. Convolution
powers of distributions supported in `[0, inf)`, restricted to `[0, 2t)`, depend only on the restriction to
`[0, 2t)`; there they equal the `nu`-fold convolution of `K^{omega,1}`, which is `K^{omega,nu}` (Laplace
transforms multiply). The easy direction of Nehari gives the bound. QED.

**Corollary C1 (unconditional, explicit).** Atlas section 8 records the certified bound
`||H_{1/4,L}|| <= 1999999/2000000` for `1 < L <= 8/5`; `H_{1/4,L}` is `K_zeta^{1/4,1}[log L]`. Hence for every
`nu >= 5`:

    ||K_zeta^{1/4,nu}[t]|| <= (1 - 5e-7)^nu < 1   and   det(1 +/- K_zeta^{1/4,nu}[t]) != 0   for 0 <= t <= log(8/5) = 0.4700.

So Suzuki's `tau(zeta; 1/4, nu) >= 0.4700` for all `nu >= 5`, and his canonical system for
`E = xi(3/4 - iz)^nu` exists unconditionally on `[0, 0.47]`. For comparison (MEASURED, `aux.py`): his
Prop. 4.2 argument yields `tau ~ 0.057` for `(1/4, 5)`, `0.055` for `(2/5, 3)`, `0.10` for `(1/4, 9)`
(sup over a grid of `v`); the Hilbert-Schmidt bound yields `t < 0.197` for `(1/4, 5)`.
Status: the certificate is an "accepted finite result" in the atlas; I did not replay it. My Ritz values
(section 5.3) lie below its bounds, as they must.

**Corollary C2.** The first vanishing time `T*(omega, nu)` of a control satisfies `T*(omega, nu) >= T*(omega, 1)`.
Measured for the sign twist: 0.3622 (`nu = 1`) and 0.3796 (`nu = 5`). Taking powers `nu` (needed for a
continuous kernel when `omega <= 1`) weakens the test.

### 3.3 Lemma E (trace expansion) - PROVED (elementary)

For `nu omega > 1` (trace class: MEASURED eigenvalue decay about `i^{-(nu omega + 1)}`, marginal at 1.25),

    log det(1 + eps K[t]) = sum_{k>=1} (-1)^{k+1} eps^k tr K[t]^k / k,     eps = +/-1,

converges iff `||K[t]|| < 1`, with terms of size `N_eff ||K[t]||^k / k`. On the prime side

    tr K[t]^k = sum_{n_1..n_k} prod_i q(n_i) n_i^{-1/2} V_k(t; log n_1, .., log n_k),
    V_k = int_{(-t,t)^k} prod_i G(x_i + x_{i+1} - log n_i) dx,   x_{k+1} = x_1,

and `V_k = 0` unless every `n_i < e^{2t}` and `n_1 ... n_k < e^{2kt}`. The frequency side of the same trace is
the `k`-fold explicit formula: `K[t]` is the gamma factor times the product over primes of the local
convolution combs, compressed by `P_t`.

Certificate hierarchy. `||K||^{2k} <= tr K^{2k} <= N ||K||^{2k}` for a self-adjoint trace-class `K`, so
`||K[t]|| < 1` iff `tr K[t]^{2k} < 1` for some `k`, and the least such `k` is `k_min(t) ~ log N_eff / (2 (1 - ||K[t]||))`.
`k = 1` is the Hilbert-Schmidt test `int_0^{2t} K(u)^2 (2t - u) du < 1`.

Where the Euler product is. Nowhere in Lemmas A to E. The truncation `P_t` does not commute with the
individual Euler factors, and no single factor is a contraction on the critical line:
`|(1 - p^{-s-omega})/(1 - p^{-s+omega})|` on `Re s = 1/2` ranges over
`[(1 - p^{-1/2-omega})/(1 + p^{-1/2+omega}), (1 + p^{-1/2-omega})/(1 - p^{-1/2+omega})]`, and the gamma quotient has
a pole at `s = 1 - omega`. Only the full product is unimodular, and that is the functional equation.
A term-by-term bound of the multi-prime sums therefore loses a factor exponential in `k`, while the
margin leaves room for none (section 5).

