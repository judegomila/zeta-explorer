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

{{ZETA5}}

Reading. Both determinants are positive on the whole range (no eigenvalue of `M_p` outside `(-1, 1)`,
all `p`). `det(1 - K)` is the smaller one. Converged in `p` (two degrees agree): margins to 2 to 4 digits for
`t <= 1.7`; `log gamma(t)` to 6 digits for `t <= 0.7`, 4 digits to `t = 1.2`, 3 digits to `t = 1.7`;
`log det` to 3 digits for `t <= 1.2`. For `t >= 2` the entries are Ritz upper bounds for the margin and
are not converged (resolution `p/t` between 43 and 65, so only the zeros below that height are
represented). The margin falls by a factor of about `e^{-30}` to `e^{-40}` per unit `t`:
`1e-3` at 0.4, `2e-11` at 1.0, `3e-27` (bound) at 2.0, `2e-52` (bound) at 3.0.

### 5.2 `(omega, nu) = (1/4, 9)` (smoother kernel, better convergence)

{{ZETA9}}

Converged: `log det(1 +/- K)` to 4 to 5 digits for `t <= 1.2`, `log gamma` to 6 digits for `t <= 1.4`.
The margin for `nu = 9` is larger than for `nu = 5` at the same `t` (Lemma C direction).

### 5.3 `nu = 1` (the sharpest test; spectrum only)

{{ZETA1A}}

{{ZETA1B}}

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

{{DHHP}}

`nu = 1`, lower degrees (pole not resolved for `t >= 1.5`; kept to show the resolution effect):

{{DH110}}

`(omega, nu) = (1/4, 5)`:

{{DH5}}

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
