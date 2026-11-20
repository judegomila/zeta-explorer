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
   multiplicativity enters. Controls: Davenport-Heilbronn (functional equation, no Euler product),
   `omega = 1/10`, `nu = 1`, passes for `t <= 1.716` (margin `1e-29` at `t = 1.70`, `8e-32` at `1.716`) and
   has an eigenvalue beyond 1 from `t = 1.718` on, in degrees that resolve its off-line zero at height
   85.7 (for `omega = 1/4` the first failure is in `(1.74, 1.80]`); the sign twist at the prime 2 (Euler product kept, functional equation lost) fails at
   `t = 0.362` (`nu = 1`) and `t = 0.380` (`nu = 5`), just after its first coefficient enters at
   `t = (log 2)/2 = 0.347`. At finite `t` the determinant criterion tests compatibility of the first
   coefficients with the functional equation, not the Euler product.
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
5. Numerically (MEASURED) both determinants are positive for zeta for `t <= 3` at `(1/4, 5)`,
   `t <= 2` at `(1/4, 9)`, and no eigenvalue leaves `(-1, 1)` for `nu = 1` up to `t = 1.5`. These runs
   resolve zeros up to height about `p/t` only (section 4), so for zeta they restate low-zero data.

Nothing in items 2 to 5 separates zeta from Davenport-Heilbronn before `t = 1.716`, where DH's margin
is already below `1e-31`. That is the obstruction: the finite-`t` determinant is Euler-blind, flow-stable, and
has no slack.

## 0. Plan; what is new against the atlas and the walls

| Atlas item / wall | Overlap | New here |
|---|---|---|
| Atlas section 8 (`H_{a,L}`, kernel `h_a(xy)`; certified `||H_{1/4,L}|| <= 1 - 5e-7` for `L <= 8/5`; all-window boundedness iff Schur with cancellation) | Same operator as Suzuki 2012 with `nu = 1`, `L = e^t` | Not re-run. Used as an input. New: transfer to every `nu` (Lemma C), reduction of Suzuki's 2020 criterion to the norm (Lemma A), window identity with the bridge (Lemma B), Nehari form (Lemma D), numerics to `t = 3` (`L = 20`, Ritz, not certified), controls. |
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

## 4. Numerical method (MEASURED; not an interval certificate)

Code: `suz.py` (float64 prototype), `suzmp.py` (python-flint `arb` used as multiprecision floats, 100 to 170
digits), `check.py`, `aux.py`, `tab.py`. Motherbox, CPU only, at most 8 processes. The GPU was not used:
the margins are below double precision from `t ~ 1` on, so the linear algebra has to be multiprecision.

- Kernel. `K(x) = sum_{n <= e^x} q(n) n^{-1/2} G(x - log n)`. `q` = Dirichlet coefficients of
  `(zeta(s-omega)/zeta(s+omega))^nu` (or the DH / twisted analogue), exact arithmetic recursions.
  `G` = inverse Laplace transform of `(gamma(s-omega)/gamma(s+omega))^nu`,
  `gamma(s) = (s-1) pi^{-s/2} Gamma(s/2+1)` for zeta and `(5/pi)^{s/2} Gamma((s+1)/2)` for DH, by the
  Weideman-Trefethen modified Talbot contour (error about `3.89^{-N}`, `N` up to 310 nodes), tabulated as
  `G(w) = w^{nu omega - 1} A(w)` with `A` in Chebyshev panels of width 1/4 (reported coefficient tails
  `1e-119` to `1e-158`).
- Checks (`check.py`): for `nu = 1` Talbot agrees with Suzuki's closed form `e^{-w/2} g_omega(e^{-w})`
  (zeta) and with `(5/pi)^{-omega} (2/Gamma(omega)) y^{1-omega}(1-y^2)^{omega-1}` (DH) to `3e-23` or better at 30
  test points; the Dirichlet series of the coefficients reproduce `(zeta(s-omega)/zeta(s+omega))^nu` and the
  DH quotient at `s = 6` to 14 digits; the DH function vanishes at `0.808517 + 85.699348 i` to `6.5e-7`.
- Discretization. Galerkin (Ritz) compression `M_p` of `K[t]` to polynomials of degree `< p` on `(-t, t)`
  (orthonormal Legendre basis). `M_ij = int_0^{2t} K(u) C_ij(u) du` with `C_ij` a polynomial of degree
  `<= 2p - 1`; the integral is evaluated exactly up to rounding from the Legendre moments of `K`, which are
  computed term by term in `n` with the endpoint singularity `w^{nu omega - 1}` removed by `w = h x^b`
  (`b` = denominator of `omega`) and Gauss-Legendre rules. Nestedness check: the leading `40 x 40` block
  of `M_60` equals `M_40` to `2e-78` at 80 digits.
- What a Ritz value proves. Eigenvalues of `M_p` interlace those of `K[t]`: `lam_max(M_p) <= lam_max(K[t])`.
  So `1 - lam_max(M_p)` is an **upper bound** for the margin, and `lam_max(M_p) > 1` shows
  `||K[t]|| > 1` (up to rounding). A Ritz computation cannot show `||K[t]|| < 1`.
- Resolution. Degree `p` on a half-length `t` resolves frequencies up to about `p/t`. A pole of `Theta` at
  height `u_0` is invisible unless `p > u_0 t`. This was seen directly: the DH off-line zero at height 85.7
  is not detected with `p <= 130` at `t = 1.8 to 2.1` and is detected with `p = 200` (section 6). For zeta
  every run below tests only the low zeros. This is the verified-height wall in this setting.
- Determinants. For `nu omega > 1` the eigenvalues decay about like `i^{-(nu omega + 1)}`, so `log det(1 +/- M_p)`
  converges slowly in `p`. The exact trace `tr K[t] = (1/2) int_0^{2t} K(u) du` is used to correct the
  first-order term; the remaining drift is of order `sum_{i>p} lam_i^2`. `log gamma(t) = 2 log(det(1+K)/det(1-K))`
  is odd in `K` and converges much faster. Convergence is shown by listing two degrees. For `nu = 1`,
  `omega <= 1/2` the operator is not trace class and only the spectrum is reported.
- Bug found and fixed during the run: eigenvalues were first sorted through float64, which cannot order
  values within `1e-16` of 1. All tables below come from the corrected runs.

## 5. Tables for zeta

`k_min` is the least `k` with `sum_i lam_i^{2k} < 1` over the 28 eigenvalues nearest `+/-1` (a lower
estimate of the trace-certificate depth of Lemma E).

### 5.1 `(omega, nu) = (1/4, 5)`: determinants, Hamiltonian, margin

`zeta`, omega=0.25, nu=5; degrees p=[40, 80, 120, 130]
| t | 1-lam_max (p_lo / p_hi) | 1+lam_min (p_hi) | log det(1+K) (p_mid / p_hi) | log det(1-K) (p_hi) | log gamma(t) (p_mid / p_hi) | k_min |
|---|---|---|---|---|---|---|
| 0.1 | 4.893e-01 / 4.893e-01 | 8.158e-01 | 0.2588 / 0.2587 | -0.6179 | 1.75337 / 1.75337 | 1 |
| 0.2 | 1.496e-01 / 1.496e-01 | 5.719e-01 | 0.1369 / 0.1368 | -1.7492 | 3.77181 / 3.77181 | 1 |
| 0.3 | 1.944e-02 / 1.944e-02 | 2.918e-01 | -0.4874 / -0.4879 | -3.8086 | 6.64145 / 6.64145 | 3.1 |
| 0.4 | 1.114e-03 / 1.114e-03 | 4.266e-02 | -2.3317 / -2.3328 | -7.1125 | 9.55952 / 9.55952 | 31 |
| 0.5 | 1.356e-04 / 1.356e-04 | 3.810e-03 | -5.1378 / -5.1403 | -10.8820 | 11.48327 / 11.48327 | 3.2e+02 |
| 0.6 | 5.809e-06 / 5.808e-06 | 5.847e-04 | -8.6189 / -8.6240 | -16.3407 | 15.43345 / 15.43346 | 2.9e+03 |
| 0.7 | 2.385e-07 / 2.383e-07 | 2.170e-05 | -13.9547 / -13.9645 | -23.1833 | 18.43767 / 18.43768 | 7.7e+04 |
| 0.8 | 2.336e-08 / 2.334e-08 | 1.085e-06 | -20.4655 / -20.4840 | -30.6956 | 20.42305 / 20.42322 | 1.3e+06 |
| 0.9 | 1.416e-09 / 1.411e-09 | 1.576e-07 | -27.6175 / -27.6497 | -39.6046 | 23.90966 / 23.90978 | 1.1e+07 |
| 1 | 2.212e-11 / 2.169e-11 | 6.145e-09 | -36.5866 / -36.6386 | -50.8042 | 28.33092 / 28.33123 | 3.4e+08 |
| 1.1 | 1.649e-12 / 1.642e-12 | 1.086e-10 | -47.7978 / -47.8939 | -62.9365 | 30.08417 / 30.08531 | 1.4e+10 |
| 1.2 | 1.347e-13 / 1.313e-13 | 1.355e-11 | -59.6608 / -59.7955 | -76.3006 | 33.00640 / 33.01024 | 1.3e+11 |
| 1.3 | 3.516e-15 / 3.050e-15 | 1.022e-12 | -72.6875 / -72.9452 | -91.5894 | 37.29345 / 37.28847 | 2.1e+12 |
| 1.4 | 6.507e-17 / 5.760e-17 | 1.187e-14 | -88.3438 / -88.7502 | -109.1301 | 40.75885 / 40.75994 | 1.7e+14 |
| 1.5 | 6.574e-18 / 5.870e-18 | 4.324e-16 | -105.4892 / -106.0472 | -127.3781 | 42.64731 / 42.66194 | 3.7e+15 |
| 1.6 | 3.722e-19 / 1.461e-19 | 4.934e-17 | -123.2890 / -124.5492 | -148.0752 | 47.05141 / 47.05195 | 4.4e+16 |
| 1.7 | 8.513e-21 / 5.200e-21 | 1.343e-18 | -143.1947 / -144.9774 | -170.1901 | 50.44567 / 50.42537 | 1.5e+18 |
| 1.8 | 2.124e-21 / 2.553e-23 | 1.775e-20 | -165.0104 / -167.6823 | -195.7548 | 56.16628 / 56.14509 | 1.4e+20 |
| 1.9 | 1.076e-22 / 3.404e-25 | 1.541e-22 | -190.0808 / -193.6890 | -223.9815 | 60.20543 / 60.58484 | 1.5e+22 |
| 2 | 3.957e-24 / 3.289e-27 | 1.873e-24 | -217.9983 / -222.0424 | -254.5057 | 64.75028 / 64.92670 | 1.3e+24 |
| 2.25 | 2.317e-32 / 1.499e-32 | 1.160e-29 | -296.7566 / -306.9886 | -345.7786 | 77.47102 / 77.57996 | 2.2e+29 |
| 2.5 | 1.980e-37 / 2.056e-38 | 2.823e-35 | -391.8205 / -412.6564 | -458.3010 | 90.30681 / 91.28921 | 9.8e+34 |
| 2.75 | 8.083e-43 / 3.688e-45 | 6.101e-42 | -498.1443 / -546.0210 | -599.9136 | 100.38759 / 107.78523 | 4.7e+41 |
| 3 | 5.500e-45 / 2.019e-52 | 3.622e-49 | -603.3700 / -707.9637 | -769.7678 | 109.23552 / 123.60813 | 7.9e+48 |

Reading. Both determinants are positive on the whole range (no eigenvalue of `M_p` outside `(-1, 1)`,
all `p`). `det(1 - K)` is the smaller one. Converged in `p` (two degrees agree): margins to 2 to 4 digits for
`t <= 1.7`; `log gamma(t)` to 6 digits for `t <= 0.7`, 4 digits to `t = 1.2`, 3 digits to `t = 1.7`;
`log det` to 3 digits for `t <= 1.2`. For `t >= 2` the entries are Ritz upper bounds for the margin and
are not converged (resolution `p/t` between 43 and 65, so only the zeros below that height are
represented). The margin falls by a factor of about `e^{-30}` to `e^{-40}` per unit `t`:
`1e-3` at 0.4, `2e-11` at 1.0, `3e-27` (bound) at 2.0, `2e-52` (bound) at 3.0.

### 5.2 `(omega, nu) = (1/4, 9)` (smoother kernel, better convergence)

`zeta`, omega=0.25, nu=9; degrees p=[40, 80, 120]
| t | 1-lam_max (p_lo / p_hi) | 1+lam_min (p_hi) | log det(1+K) (p_mid / p_hi) | log det(1-K) (p_hi) | log gamma(t) (p_mid / p_hi) | k_min |
|---|---|---|---|---|---|---|
| 0.2 | 3.493e-01 / 3.493e-01 | 8.087e-01 | 0.3326 / 0.3326 | -0.9271 | 2.51943 / 2.51943 | 1 |
| 0.4 | 7.406e-03 / 7.406e-03 | 1.707e-01 | -0.8785 / -0.8785 | -4.6458 | 7.53466 / 7.53466 | 6.4 |
| 0.6 | 5.379e-05 / 5.379e-05 | 3.901e-03 | -5.1795 / -5.1795 | -11.6925 | 13.02599 / 13.02599 | 4e+02 |
| 0.8 | 3.733e-07 / 3.733e-07 | 1.962e-05 | -13.6686 / -13.6687 | -22.5725 | 17.80765 / 17.80765 | 7.4e+04 |
| 1 | 6.281e-10 / 6.279e-10 | 8.264e-08 | -26.2015 / -26.2020 | -38.4086 | 24.41309 / 24.41310 | 2.2e+07 |
| 1.2 | 3.485e-12 / 3.473e-12 | 5.483e-10 | -43.1329 / -43.1356 | -58.1022 | 29.93301 / 29.93308 | 3.4e+09 |
| 1.4 | 1.027e-14 / 1.020e-14 | 8.744e-13 | -65.5823 / -65.5948 | -83.3066 | 35.42339 / 35.42363 | 1.9e+12 |
| 1.6 | 1.202e-17 / 1.014e-17 | 2.595e-15 | -92.7298 / -92.7899 | -114.1005 | 42.62050 / 42.62118 | 8e+14 |
| 1.8 | 9.381e-20 / 7.263e-20 | 1.139e-17 | -125.3354 / -125.4987 | -149.4763 | 47.95575 / 47.95534 | 1.6e+17 |
| 2 | 4.771e-22 / 3.436e-23 | 8.560e-21 | -164.3993 / -164.8734 | -192.4559 | 55.18485 / 55.16515 | 2.4e+20 |

Converged: `log det(1 +/- K)` to 4 to 5 digits for `t <= 1.2`, `log gamma` to 6 digits for `t <= 1.4`.
The margin for `nu = 9` is larger than for `nu = 5` at the same `t` (Lemma C direction).

### 5.3 `nu = 1` (the sharpest test; spectrum only)

`zeta`, omega=0.25, nu=1; degrees p=[60, 100]
| t | 1-lam_max by p | 1+lam_min by p | #ev>1, #ev<-1 (p_hi) |
|---|---|---|---|
| 0.4055 | 3.75e-05 / 3.75e-05 | 3.19e-03 / 3.19e-03 | 0, 0 |
| 0.47 | 1.38e-06 / 1.38e-06 | 2.56e-04 / 2.56e-04 | 0, 0 |
| 0.6 | 4.36e-10 / 4.34e-10 | 1.61e-07 / 1.61e-07 | 0, 0 |
| 0.8 | 4.77e-18 / 4.65e-18 | 4.55e-15 / 4.42e-15 | 0, 0 |
| 1 | 9.90e-29 / 1.79e-30 | 1.39e-25 / 4.71e-27 | 0, 0 |
| 1.2 | 2.35e-33 / 3.86e-44 | 8.00e-31 / 1.31e-40 | 0, 0 |
| 1.4 | 1.14e-36 / 2.86e-52 | 3.06e-34 / 3.96e-49 | 0, 0 |
| 1.5 | 2.98e-37 / 1.23e-54 | 3.73e-34 / 9.22e-52 | 0, 0 |

`zeta`, omega=0.1, nu=1; degrees p=[60, 100]
| t | 1-lam_max by p | 1+lam_min by p | #ev>1, #ev<-1 (p_hi) |
|---|---|---|---|
| 0.5 | 9.45e-08 / 9.44e-08 | 1.96e-05 / 1.96e-05 | 0, 0 |
| 0.75 | 3.82e-16 / 3.74e-16 | 3.50e-13 / 3.44e-13 | 0, 0 |
| 1 | 3.99e-29 / 6.40e-31 | 5.18e-26 / 1.70e-27 | 0, 0 |
| 1.25 | 7.42e-35 / 3.00e-47 | 4.34e-32 / 4.16e-44 | 0, 0 |
| 1.5 | 7.46e-38 / 4.12e-55 | 9.77e-35 / 2.71e-52 | 0, 0 |

At `t = log(3/2)` and `t = log(8/5)` the Ritz margins `3.75e-5` and `1.38e-6` are converged in `p` and lie
above the atlas certificate margins `2e-5` and `5e-7`, as they must (consistency check of both; the
certificate is within a factor 3 of sharp). For `t >= 1` the entries are upper bounds only:
`1 - ||K^{1/4,1}[1]|| <= 1.8e-30`, `<= 3e-52` at `t = 1.4`. The screw-canonical lane measured `5.8e-30`
at support 2 in the limit `omega -> 0`; same scale.

## 6. Controls

### 6.1 Davenport-Heilbronn

`f(s) = 5^{-s}[zeta(s,1/5) + kappa zeta(s,2/5) - kappa zeta(s,3/5) - zeta(s,4/5)]`, completed by
`(5/pi)^{s/2} Gamma((s+1)/2)`; same functional equation; zero at `0.808517 + 85.699348 i`, so
`Theta_omega` has a pole in the upper half-plane for `omega < 0.3085` with `v_0 = 0.3085 - omega`.

`nu = 1`, `omega = 1/10` and `omega = 1/4`, degrees that resolve height 85.7 (`p > 86 t`). A negative entry
means an eigenvalue beyond `+/-1`:

`dh`, omega=0.1, nu=1; degrees p=[200, 280]
| t | 1-lam_max by p | 1+lam_min by p | #ev>1, #ev<-1 (p_hi) |
|---|---|---|---|
| 1.6 | 4.73e-24 / 4.63e-24 | 3.84e-20 / 3.76e-20 | 0, 0 |
| 1.7 | 1.03e-29 / 9.86e-30 | 7.55e-26 / 7.40e-26 | 0, 0 |
| 1.71 | 1.26e-30 | 2.31e-26 | 0, 0 |
| 1.716 | 7.82e-32 | 8.08e-27 | 0, 0 |
| 1.718 | -6.57e-32 | 5.28e-27 | 1, 0 |
| 1.72 | -1.48e-31 | 3.29e-27 | 1, 0 |
| 1.74 | -3.05e-26 | -4.18e-28 | 1, 1 |
| 1.76 | -7.31e-25 | -1.29e-22 | 1, 1 |
| 1.78 | -2.60e-20 | -3.78e-18 | 1, 1 |
| 1.8 | -4.66e-16 / -5.02e-16 | -2.79e-14 / -3.08e-14 | 1, 1 |
| 1.9 | -1.35e-02 / -1.49e-02 | -1.36e-02 / -1.42e-02 | 2, 1 |
| 2 | -5.41e-02 / -5.56e-02 | -6.01e-02 / -6.12e-02 | 2, 2 |
| 2.2 | -1.03e-01 / -1.04e-01 | -1.03e-01 / -1.04e-01 | 2, 2 |

`dh`, omega=0.25, nu=1; degrees p=[200, 240]
| t | 1-lam_max by p | 1+lam_min by p | #ev>1, #ev<-1 (p_hi) |
|---|---|---|---|
| 1.7 | 3.27e-29 | 2.67e-25 | 0, 0 |
| 1.716 | 2.26e-30 | 2.81e-26 | 0, 0 |
| 1.718 | 1.58e-30 | 2.03e-26 | 0, 0 |
| 1.74 | 1.01e-32 | 3.69e-28 | 0, 0 |
| 1.8 | -2.88e-22 | -5.37e-24 | 1, 1 |
| 2 | -1.82e-02 | -1.96e-02 | 1, 1 |
| 2.2 | -6.29e-02 | -6.22e-02 | 1, 1 |

`nu = 1`, lower degrees (pole not resolved for `t >= 1.5`; kept to show the resolution effect):

`dh`, omega=0.1, nu=1; degrees p=[60, 90, 120]
| t | 1-lam_max by p | 1+lam_min by p | #ev>1, #ev<-1 (p_hi) |
|---|---|---|---|
| 1 | 3.53e-06 / 3.51e-06 / 3.51e-06 | 1.23e-03 / 1.23e-03 / 1.23e-03 | 0, 0 |
| 1.2 | 7.77e-10 / 7.61e-10 / 7.56e-10 | 8.04e-07 / 7.96e-07 / 7.92e-07 | 0, 0 |
| 1.4 | 1.53e-15 / 1.48e-15 / 1.44e-15 | 3.27e-12 / 3.14e-12 / 3.08e-12 | 0, 0 |
| 1.5 | 5.73e-19 / 3.14e-19 / 3.06e-19 | 1.40e-15 / 1.17e-15 / 1.13e-15 | 0, 0 |
| 1.6 | 3.98e-22 / 6.27e-24 / 5.48e-24 | 1.08e-18 / 4.27e-20 / 4.01e-20 | 0, 0 |
| 1.7 | 3.39e-25 / 1.78e-28 / 1.16e-29 | 1.30e-21 / 1.08e-24 / 1.01e-25 | 0, 0 |
| 1.8 | 1.80e-26 / 5.08e-32 / 9.25e-36 | 2.90e-23 / 5.90e-29 / 8.12e-32 | 0, 0 |
| 1.9 | 2.80e-28 / 5.48e-35 / 4.40e-40 | 2.71e-25 / 1.55e-31 / 3.27e-37 | 0, 0 |
| 2 | 1.08e-29 / 4.87e-38 / 5.92e-44 | 2.61e-26 / 1.52e-34 / 2.27e-40 | 0, 0 |
| 2.1 | 1.12e-30 / 1.18e-40 / 2.38e-47 | 1.49e-27 / 2.73e-37 / 5.67e-44 | 0, 0 |
| 2.2 | 5.32e-32 | 1.24e-28 | 0, 0 |

`(omega, nu) = (1/4, 5)`:

`dh`, omega=0.25, nu=5; degrees p=[60, 100]
| t | 1-lam_max (p_lo / p_hi) | 1+lam_min (p_hi) | log det(1+K) (p_mid / p_hi) | log det(1-K) (p_hi) | log gamma(t) (p_mid / p_hi) | k_min |
|---|---|---|---|---|---|---|
| 0.5 | 4.117e-01 / 4.117e-01 | 8.308e-01 | 0.3280 / 0.3280 | -0.8062 | 2.26831 / 2.26831 | 1 |
| 1 | 1.937e-02 / 1.937e-02 | 2.239e-01 | -0.6367 / -0.6374 | -3.7324 | 6.18997 / 6.18997 | 3.9 |
| 1.5 | 1.429e-04 / 1.429e-04 | 8.890e-03 | -4.3247 / -4.3312 | -10.1927 | 11.72279 / 11.72281 | 1.7e+02 |
| 2 | 7.449e-07 / 7.447e-07 | 1.132e-04 | -11.8852 / -11.9070 | -20.6436 | 17.47297 / 17.47323 | 1.6e+04 |
| 2.5 | 6.931e-09 / 6.908e-09 | 8.221e-07 | -24.1173 / -24.3856 | -35.6048 | 22.43692 / 22.43829 | 2.1e+06 |
| 3 | 1.392e-11 / 1.379e-11 | 1.117e-09 | -43.2035 / -43.9678 | -57.8992 | 27.96316 / 27.86278 | 1.5e+09 |
| 3.25 | 1.352e-12 / 1.203e-12 | 2.011e-10 | -53.4411 / -55.0267 | -70.8416 | 31.45341 / 31.62989 | 9.4e+09 |
| 3.5 | 5.662e-15 / 5.181e-15 | 2.286e-12 | -67.0603 / -69.6040 | -87.9661 | 36.67295 / 36.72421 | 1e+12 |

Reading.
- `(1/10, 1)`: no eigenvalue outside `(-1, 1)` at `t = 1.716` (margin `7.8e-32`); one eigenvalue above 1 at
  `t = 1.718` (excess `6.6e-32`), and one on each side beyond `+/-1` from `t = 1.74`. So `det(1 - K[t])` first
  vanishes for `t` in `(1.716, 1.718]`. The excess grows to `1.4e-2` at `t = 1.9` and `0.10` at `t = 2.2`.
  Degrees 200 and 280 agree at `t = 1.6, 1.7, 1.8, 1.9, 2.0`.
- `(1/4, 1)`: no eigenvalue outside `(-1, 1)` at `t = 1.74` (margin `1.0e-32`); one on each side beyond `+/-1` at
  `t = 1.80`. First vanishing in `(1.74, 1.80]`. The screw-canonical lane found the `omega -> 0` threshold at
  `t` in `(1.70, 1.75)`. The threshold increases with `omega`, as the pole height `v_0 = 0.3085 - omega` decreases.
- Before failing, DH has margin `1e-29` at `t = 1.70`. Zeta at `(1/10, 1)` and `t = 1.0` already has margin
  below `1e-30`. A small margin does not signal a violation.
- `(1/4, 5)`: no eigenvalue leaves `(-1, 1)` for `t <= 3.5` at `p <= 100`. That degree resolves heights up to
  about 29 only, so it says nothing about the zero at 85.7. By Corollary C2 the first vanishing is not
  earlier than `1.74`. A run with `p > 86 t` at `nu = 5` was not made.
- Every lemma of sections 2 and 3 holds verbatim for DH. On `[0, T*_DH)` DH has a canonical system in
  Suzuki's sense, built from its own non-multiplicative coefficients.

### 6.2 Sign twist `Lambda(n) -> eps_n Lambda(n)`, `eps = -1` on powers of 2

The Euler factor at 2 of `zeta(s-omega)/zeta(s+omega)` is inverted; coefficients stay multiplicative;
`q(2)` changes sign (`+/-1.7416` for `(1/4,5)`, `+/-0.3483` for `(1/4,1)`). The kernel coincides with the
zeta kernel for `2t < log 2`.

| `(omega, nu)` | first `t` with an eigenvalue `-1` (float64 bisection, `p = 60`) | `(log 2)/2` |
|---|---|---|
| `(1/4, 1)` | 0.36224 | 0.34657 |
| `(1/4, 5)` | 0.37958 | 0.34657 |

At `t = 0.5` the twisted `(1/4,5)` operator has eigenvalues `1.087` and `-2.027`; at `t = 1.4`, `3.89` and
`-3.98`. The twisted quotient is analytic in the half-plane but is not unimodular on the line (its modulus
reaches `((1 + 2^{omega-1/2})/(1 - 2^{-omega-1/2}))^{2 nu}`), so the limit of `||K[t]||` exceeds 1.
Twisting all `n` (`eps = -1` everywhere) gives the same first crossing, since only `q(2)` is involved there.

So the determinant criterion rejects the sign twist almost immediately. It is not a test of the size or
support of `Lambda`. What it tests is the functional equation: the twist keeps the Euler product and loses
unimodularity; DH keeps unimodularity and loses the Euler product, and passes until its off-line zero is
resolved.

### 6.3 Backward heat family (not computed)

`F_tau(z) = int e^{tau u^2/16} kappa(u) e^{zu/2} du`, `tau < 0`, has no Dirichlet series, so the prime-side
kernel does not exist; the causal kernel would have to be built from `F_tau(z - omega)/F_tau(z + omega)` on a
line above all its poles, which needs the locations of the non-real zeros of `F_tau`. Not attempted.
What Lemma A gives (PROVED): for fixed `T`, `||K[T]|| < 1` is an open condition in the kernel on `[0, 2T]`
(operator norm is continuous in the `L^1` norm of the kernel for `nu = 1`, in the sup norm for
`nu omega > 1`). ARGUED: for small `|tau|` the non-real zeros of `F_tau` lie at very large height, the kernel on
`[0, 2T]` moves by a small amount, and the determinants stay nonzero on `[0, T]`; the first vanishing time
tends to infinity as `tau -> 0^-`. So the finite-`t` statement is flow-stable and the all-`t` statement is not,
consistent with the flow-blindness wall.

## 7. Ranges: Suzuki, prime-data certificates, verified height

For `(omega, nu) = (1/4, 5)`:

| Source | Range of `t` with `det(1 +/- K[t]) != 0` | Status |
|---|---|---|
| Suzuki Thm 2.1 | `[0, tau)`, `tau > 0` not specified | CLASSICAL |
| Suzuki Prop. 4.2 argument made explicit (`M_v^2 e^{4vt} < 1`) | `t < 0.057` | MEASURED (grid in `v`, `u`) |
| Hilbert-Schmidt, `k = 1` of Lemma E | `t < 0.197` (interpolated) | MEASURED (`tr K^2 = 0.32` at `t = 0.1`, `1.03` at `t = 0.2`) |
| Trace certificate `tr K^{2k} < 1` | `t <= 0.3` with `k = 4`; `0.4` with `k ~ 31`; `0.5` with `k ~ 3e2`; `0.6` with `k ~ 3e3`; `1.0` with `k ~ 3e8`; `2.0` with `k > 1e24` | MEASURED |
| Corollary C1 (atlas certificate for `nu = 1` + Lemma C) | `t <= log(8/5) = 0.4700`, every `nu >= 5` | PROVED given the certificate |
| Ritz numerics | no eigenvalue outside `(-1,1)` for `t <= 3` | MEASURED, tests zeros below height `p/t` only |
| RH (or zero-free `Re s > 3/4`) | all `t` | conditional |

Does the series range exceed Suzuki's range? Yes: the series converges wherever `||K[t]|| < 1`, which is
measured on `[0, 3]` and proved on `[0, 0.47]`; Suzuki's explicit range is about `0.06`.
Is it provable from prime data alone? In principle for each fixed `t` (finite data, finite computation).
The cost is `k_min(t) ~ 1/(2 margin)`: the term `tr K^{2k}` is a sum over `2k`-tuples of integers below
`e^{2t}`. At `t = 1` that is `k ~ 3e8` with integers up to 7; at `t = 2`, `k > 1e24` with integers up to 54.
Truncating the series, or bounding terms in absolute value, fails: atlas section 8 already records that
the absolute-kernel norm exceeds one at the first window.

Verified height. I found no implication in either direction between a range of `t` and a verified
height. (i) `||K[T]|| < 1` gives a Schur completion of the finite data (Lemma D), not a zero-free
statement for zeta. (ii) Zeros on the line up to height `H` do not bound `||K[T]||` below 1 for any `T`
by an argument I could make rigorous: the contraction part has margin `1e-11` at `t = 1` and a pole term
at height above `3e12` acts on it only through a frequency that no test function of moderate degree
resolves. The DH run gives the scale: an off-line zero at height 85.7 with `v_0 = 0.21` first shows at
`t = 1.717`, when the margin is below `1e-30`, and only in degrees `p > 86 t`. OPEN: an explicit `T(H)`.

## 8. Verdict, DH statement, weakest steps

Verdict: **precise obstruction; one unconditional corollary; dictionary corrected.**

- Dictionary (section 2): PROVED. Suzuki's `K[t]` is the reflected window compression of the scattering
  multiplier; `det(1+K[t]) det(1-K[t]) = det(1_J K_c^2 1_J)`; the bridge `K_c` has no determinant.
- RH-equivalent statement: non-vanishing of `det(1 +/- K^{omega_n,nu_n}[t])` for all `t >= 0` along a
  sequence `omega_n -> 0` (Suzuki Thm 2.4 with condition (4) removed by Lemma A). Equivalent form:
  `||K^{omega,nu}[t]|| < 1` for all `t` and all small `omega`.
- Proved unconditionally: all `t` for `omega > 1/2` (Suzuki); `t < tau` unspecified for `omega <= 1/2`
  (Suzuki); `t <= 0.4700` for `omega = 1/4`, all `nu >= 5` (Corollary C1, given the atlas certificate).
- Numerical tables: section 5 (zeta), section 6 (controls).
- Series range: equal to `{t : ||K[t]|| < 1}`; convergence rate `||K[t]||^k`; prime-data depth `k_min(t)`
  tabulated. No use of the Euler product was found that survives the truncation `P_t`.

Which step uses the Euler product: none. Every statement here holds for DH until its off-line zero is
resolved, and the certificate hierarchy of Lemma E runs on DH coefficients in the same way. An argument for
all `t` must therefore contain a step that fails for DH at `t = 1.717` (for `omega = 1/10`) while its margin
just before is `1e-31`; no inequality with slack can do that. This agrees with the screw-canonical lane and the
Pick lanes, now for Suzuki's actual determinants.

Three weakest steps.
1. Lemma A(b) and the claim that Suzuki's condition (4) is redundant. The argument is short (bounded
   translation-invariant form, then a pole contradiction), and atlas section 8 has the same all-window
   statement for `nu = 1`, but I did not find the remark in Suzuki's papers and did not have it refereed.
   Check in particular the passage from `sup_t ||K[t]|| <= 1` to a bounded convolution operator on `L^2(R)`.
2. Corollary C1 rests on (i) the atlas `nu = 1` certificate, not replayed here, and (ii) Nehari's theorem
   for half-line Hankel operators with an integrable, compactly supported, weakly singular kernel
   (`omega = 1/4`, `nu = 1`). (ii) is classical for bounded Hankel operators; I did not look up a reference
   stating it for exactly this kernel class.
3. Numerics. Ritz values are one-sided and limited to heights below `p/t`; determinants converge
   algebraically in `p` (3 to 5 digits of `log det`, more for `log gamma`); nothing is interval-certified.
   The DH crossing is the firm part (an eigenvalue above 1 in a subspace is a lower bound for the norm);
   the zeta tables for `t >= 2` are bounds for the margin, not values.

Not done: backward-heat numerics; an interval certificate beyond `t = 0.47`; the residue formula of
section 2.3 with infinitely many poles.

## 9. Files

- `RESULT.md` (this file); `tables.txt` (all tables); `runs/*.json` (raw results: per `(t, p)` margins,
  log-determinants, traces, 14 extreme eigenvalue gaps on each side).
- `suz.py`, `suzmp.py`, `check.py`, `aux.py`, `dbg.py`, `post.py`, `tab.py`, `assemble.py`, `launch*.sh`; `RESULT_part1.md` and `rest_template.md` are the two halves `assemble.py` joins into this file; `runs/*.log` are the run logs.
- `dl/` : TeX sources of arXiv:1204.1827 and arXiv:1606.05726 (read, not executed).
- Motherbox copy: `~/rh-push/sq-canonical-det/`.

## Referee corrections (2026-11-16, see REFEREE.md)
- (a) Lemma B algebra holds, but needs innerness (unproved at omega = 1/4) and concerns the Hankel block of Theta^nu, not the bridge symbol S_alpha.
- (b) "Non-vanishing on [0,T] iff ||K[T]|| < 1" HOLDS. "(4) is automatic" is WRONG for a single omega; for strictly decreasing omega_n it is redundant by an accumulation-of-zeros argument not given above.
- (c) Lemma C (Nehari) holds for integer nu. Corollary C1 at t <= log(8/5) = 0.470 is NOT supported: the 8/5 certificate has no generator in PR 27 or the repo. Supported range: t <= log(3/2) = 0.4055 with bound (1 - 2e-5)^nu, given the in-house 3/2 certificate (replays; its analytic tail lemma not audited). The statement uses only the gamma factor and q(2); it carries no information about zeros.
