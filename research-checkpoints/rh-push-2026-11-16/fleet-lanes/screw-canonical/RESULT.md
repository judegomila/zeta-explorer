# screw-canonical: the Suzuki screw kernel on [0,T), computed from the prime side

Date: 2026-11-16. Scope: `tmp/research-2026-11-16/push/screw-canonical/` only. Nothing committed or pushed.
No RH claim, no new zero-free region, no new proved T.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (python-flint ball arithmetic for rounding;
quadrature truncation not enclosed, so not a certificate), ARGUED (heuristic), OPEN.

## Verdict

**Precise obstruction (measured), no new T.** The angle asked for a primes-only proof that the screw
kernel `K(t,u) = Psi(t)+Psi(u)-Psi(|t-u|)` is nonnegative definite on `[0,T)` for `T` beyond the
Yoshida range. What was found instead:

1. The positivity margin `lam1(T) = inf q_T[f]/||f||^2` over `f in L^2[0,T]` collapses doubly
   exponentially: `lam1` = 1.3e-3 at `T = ln 2`, 5.5e-8 at `ln 3`, 5.8e-30 at `T = 2`, 7.9e-62 at
   `T = 2.6`. Fit on `1.8 <= T <= 2.6`: `log10 lam1 ~ 9.2 - 5.2 e^T`. (MEASURED)
2. Consequence (PROVED lemma + MEASURED numbers): with everything else fixed, the kernel on `[0,2)`
   stays nonnegative only if the coefficient at `log 2` lies within `[-2.5e-26, +5.8e-29]` of
   `(log 2)/sqrt 2`. At `T = 2.4` the window is below 2.5e-42. A primes-only proof on `[0,T)` therefore
   cannot contain any inequality with slack; it has to be an exact identity in
   `log 2, log 3, ..., psi(5/4), log pi` and the pole term.
3. The Davenport-Heilbronn (DH) function passes the same test with its own non-Euler coefficients
   (sign-changing, supported on all `n` coprime to 5) for every Ritz space tried up to `T = 3.4`, and
   fails at `T = 3.5`. Its margin collapses in the same way before failing (3.4e-5 at `T=2`, 2.8e-18
   at `T=3`, 9.7e-29 at `T=3.4`). So for `T <= 3.4` (prime powers up to 29) kernel positivity is not
   an Euler-product statement, and `Lambda(n) >= 0` is not what makes it true. (MEASURED)
4. The Krein-system data (Levinson reflection coefficients of the Toeplitz compression) are tame:
   `|alpha_k| <= 0.2` up to `T = 3`, with isolated spikes at `t = log p^k`. They show no sign or
   monotonicity structure beyond `|alpha_k| < 1`, which is the positivity statement itself. (MEASURED)

No step of this note uses the Euler product. That is the result: on the range that can be computed,
nothing Euler-specific is visible in the kernel, and the margin leaves no room for an estimate.

## 0. Plan and what is new against the atlas and the walls

| Atlas item / wall | Overlap | New here |
|---|---|---|
| Section 7 (Toeplitz compression, finite-prime rigidity, threshold 1.07e-5 at support 16 log 2 on a 256-cell mesh) | Same kernel, same idea of perturbing a prime coefficient | Continuum (spectrally resolved) margin and rigidity window as a function of T. The mesh value 1e-5 is a step-function artifact; the resolved window at T=2 is already 1e-26. |
| Section 8 (recorded `Q_{6/5} >= 1e-55`, failed sufficient comparison at L=5/4) | Same form at support 2.4 and 2.5 | An upper bound 6.9e-49 at T=2.4 (consistent with the recorded floor) and the law that explains the failure at 5/4: by the fit the margin drops from 1e-48 to about 1e-54 between T=2.4 and T=2.5. |
| Section 11 ("uniform positive scalar margin is not the right target"), eq48 Theorem 4 | Margin tends to zero | The rate. |
| Route I memory (Arb certificate to 2a <= ln 3; DH twin Euler-blind to 0.783 proved / 1.7 measured) | Same DH control idea | DH itself (not a twin) in the screw form: passes to 3.4, fails by 3.5. |
| euler/RESULT.md (Pick orders are Euler-blind to order 100) | Same conclusion in other coordinates | Support-length coordinate; DH failure located. |
| Verified-height wall | Finite T restates a finite height | Confirmed, with the precision cost quantified. |
| Flow-blindness, MV-CAP | Not addressed | The rigidity window is a direct every-window statement: mean-value input with any error term is excluded for T >= 1.4. |

## 1. Setup (CLASSICAL; normalization checked)

`Psi(t) = sum_gamma (1 - cos(gamma t))/gamma^2` over centered zeros, `Psi = -g` for Suzuki's screw
function `g` (arXiv:2206.03682). For real `f in L^2[0,T]` with autocorrelation
`R_f(r) = int f(x) f(x+r) dx`:

    q_T[f] = sum_gamma fhat(gamma) conj fhat(conj gamma)                                   (zero side)
           = a0 R_f(0) + 2 int_0^inf k(r) (R_f(0) - R_f(r)) dr
             - 2 sum_{n <= e^T} w_n R_f(log n) + 2 int_0^T e^{r/2} R_f(r) dr               (prime side)

with `a0 = psi(5/4) - log pi`, `k(r) = e^{-5r/2}/(1 - e^{-2r})`, `w_n = Lambda(n)/sqrt n`. This is
atlas section 11's `q_W` with the gamma symbol written in real space
(`a(t) - a0 = sum_m (2/b_m) t^2/(b_m^2+t^2)`, `b_m = 2m + 5/2`, summed to `k`). The kernel `K` is
nonnegative definite on `[0,T)` iff `q_T >= 0` on step functions on `[0,T]`
(`sum c_i c_j K(t_i,t_j) = (1/2) q_T[sum c_i 1_[0,t_i]]`). RH iff this holds for all T
(Suzuki; eq48 Theorem 3).

DH: `f = ((1 - i kappa)/2) L(s,chi) + conj`, chi mod 5, `chi(2) = i`. Completed function
`(5/pi)^{s/2} Gamma((s+1)/2) f(s)`. Then `a0 = psi(3/4) + log(5/pi)`, `k(r) = e^{-3r/2}/(1 - e^{-2r})`,
no pole term, `w_n = Lambda_f(n)/sqrt n` with `-f'/f = sum Lambda_f(n) n^{-s}`:
`Lambda_f(2..14) = 0.197, -0.312, -1.442, 0, 1.936, 0.553, 0.016, -2.286, 0, 2.398, -0.763, -0.729, -2.852`.

Checks.
- One-sided exponential `f = e^{-xt}` on `[0,inf)`: the prime side reduces by hand to `L(x)/x`,
  `L = (log of completed function)'` at `1/2 + x`, for both zeta and DH (digamma shift
  `psi(s/2)/2 + 1/s = psi(s/2+1)/2`). Agrees with eq48 Theorem 1. (PROVED, two lines)
- Box test, T=1: prime side `2 Psi(1) = 0.0880146`; 300 zeros plus density tail give 0.088021. (MEASURED)
- Minimizer at T=1 (section 2): zero-side partial sums over the first 150 zeros reach 8.88e-7 and
  increase toward the prime-side value 9.38e-7; the first zero contributes 9.5e-11. (MEASURED,
  `zerocheck.py`)

## 2. Margin of the form on [0,T] (MEASURED)

Method (`screw.py`, `scan.py`): Ritz space = polynomials of degree < N on `[0,T]`. `R_ij(r)` is an
explicit polynomial, so every matrix entry is one linear functional applied to monomials in `r`.
The archimedean moments use Gauss-Legendre with 550-1150 nodes at 360-750 digits; matrices are
converted to the orthonormal Legendre basis with exact integer coefficients. Results are unchanged
under a 1.5x to 1.6x precision increase (tested at zeta T=1 and DH T=3.5).

Every value is the smallest eigenvalue on the Ritz space, hence an **upper bound** for `lam1(T)`
(PROVED direction, numerics not interval-certified).

| T | e^T | zeta lam1 | N | change from smaller N |
|---|---|---|---|---|
| 0.5 | 1.65 | 3.3361e-2 | 180 | none (N=100) |
| ln 2 | 2 | 1.3301e-3 | 180 | none |
| 0.8 | 2.23 | 1.8133e-4 | 100 | - |
| 1.0 | 2.72 | 9.3357e-7 | 180 | 0.06% |
| ln 3 | 3 | 5.5365e-8 | 180 | 0.08% |
| 1.2 | 3.32 | 1.6038e-9 | 180 | 0.2% |
| 1.4 | 4.06 | 4.1694e-13 | 180 | 0.3% |
| 1.6 | 4.95 | 1.6437e-17 | 180 | 0.7% |
| 1.8 | 6.05 | 4.1104e-23 | 180 | 2% (N=110) |
| 2.0 | 7.39 | 5.8071e-30 | 180 | 8% (N=100) |
| 2.2 | 9.03 | 1.8902e-38 | 240 | single N |
| 2.4 | 11.02 | 6.8720e-49 | 240 | factor 750 from N=110 (N=110 does not resolve the band) |
| 2.6 | 13.46 | 7.8642e-62 | 240 | single N |

Slope of `log10 lam1` against `e^T`: -4.6 (1.0 to 1.2), -4.9, -4.9, -5.1, -5.1, -5.2, -5.2, -5.3
(2.4 to 2.6). The second and third eigenvalues are larger by factors of 1e3 to 1e4 and 1e6 to 1e8.

**Lemma 1 (PROVED).** `lam1(T)` is nonincreasing in T. Proof: `q_T[f]` depends on `f` only through
`R_f`, so extension by zero embeds the form on `[0,T]` into the form on `[0,T']` isometrically.

**Why the collapse (ARGUED).** On the zero side `q_T[f] = sum |fhat(gamma)|^2`. `fhat` has
exponential type T/2, i.e. Nyquist density `T/2pi`. The zeros have density `log(t/2pi)/2pi`, which
is below Nyquist for `|t| < 2 pi e^T`. In that band `fhat` can be made to vanish at every zero and
still have about `2 e^T` free dimensions; the cost is only the leakage of a band-limited,
time-limited function outside the band, which is exponentially small in the time-bandwidth product
`pi T e^T`. This gives `log lam1 ~ -c e^T` up to powers of T. The constant is not derived here.
The zero-side check at T=1 shows the mechanism directly: the minimizer has `|fhat(gamma_1)|^2 = 5e-11`.

Relation to recorded results: the atlas floor `Q_{6/5} >= 1e-55` (support 2.4) is below the upper
bound 6.9e-49, so the two are consistent. The fit gives about 1e-54 at support 2.5 (extrapolation), which is the
place where the atlas reports that the sufficient comparisons stopped closing.

## 3. Rigidity of a single prime coefficient

**Lemma 2 (PROVED).** Let `P_n[f] = R_f(log n)` and `q_T^eps = q_T - 2 eps P_n` (coefficient at
`log n` changed from `w_n` to `w_n + eps`). If `q_T > 0`, then `q_T^eps >= 0` iff
`-eps_- <= eps <= eps_+`, where `1/eps_+` and `-1/eps_-` are the largest and smallest values of
`2 P_n[f]/q_T[f]`. On a Ritz subspace the same quantities give numbers `eps_+^N >= eps_+`,
`eps_-^N >= eps_-`. Proof: Rayleigh quotient of the pencil; a subspace sees fewer directions.

MEASURED (N=110; upper bounds for the true window; units are those of `w_n`, `w_2 = 0.490`, `w_3 = 0.634`):

| T | n=2: eps_+ | n=2: eps_- | n=3: eps_+ | n=3: eps_- |
|---|---|---|---|---|
| 0.8 | 2.8e-2 | 1.1e-1 | - | - |
| 1.0 | 3.6e-5 | 5.9e-4 | - | - |
| 1.2 | 3.5e-8 | 1.4e-6 | 6.0e-4 | 2.3e-3 |
| 1.4 | 6.5e-12 | 5.1e-10 | 1.1e-8 | 1.2e-7 |
| 1.6 | 2.1e-16 | 2.9e-14 | 1.2e-13 | 3.1e-12 |
| 1.8 | 4.5e-22 | 1.3e-19 | 1.6e-19 | 8.7e-18 |
| 2.0 | 5.8e-29 | 2.5e-26 | 1.4e-26 | 1.3e-24 |
| 2.4 | 4.3e-45 | 2.4e-42 | 6.4e-43 | 8.4e-41 |

`eps_+` tracks `lam1` (the minimizer has `P_2 > 0`); `eps_-` tracks the second eigenvalue.

**Corollary (obstruction; PROVED from Lemma 2 given the table).** Let A be any argument that proves
`K >= 0` on `[0,T)` from the prime-side formula. If A remains valid when `Lambda(2)` is replaced by
`Lambda(2) + delta` with `|delta| > sqrt 2 * eps_-(T)`, then A is wrong. For T=2 this excludes
every argument that uses `Lambda(2)` to fewer than 25 digits. In particular it excludes arguments
that use only `Lambda(n) >= 0`, only the support of Lambda, Chebyshev or Mertens bounds, explicit
prime number theorem error terms, or mean values, once T >= 1.4 (window below 1e-9). The window shrinks
faster than any fixed power of `e^{-T}`, so no later range repairs this.

This is the form in which the Yoshida range is special: for `T <= ln 2` there is no prime term and
the margin is 1e-3 or larger; at `ln 3` the margin is 5.5e-8, which is why the certificate there
needed ball arithmetic.

## 4. DH control (MEASURED)

| T | DH lam1 on Ritz space | N |
|---|---|---|
| 2.0 | 3.4341e-5 | 180 |
| 3.0 | 2.8396e-18 | 180 |
| 3.1 | 1.5378e-20 | 200 |
| 3.2 | 4.3693e-23 | 200 |
| 3.3 | 7.8517e-26 | 200 |
| 3.4 | 9.6641e-29 | 200 |
| 3.5 | **-6.7876e-21** (second eigenvalue -2.0e-23) | 180, same at 1.5x precision |
| 4.0 | **-0.751** (second -0.688) | 180; +1.8e-39 at N=100, which cannot resolve frequency 85.7 |

A negative Ritz value is a genuine negative direction of the form (subspace argument, modulo the
numerics not being interval-certified). A positive Ritz value does not prove positivity. So:
`T_DH <= 3.5` (MEASURED, one-sided), and no negative direction was found for `T <= 3.4` with
polynomials of degree < 200. Independent path: Levinson recursion on the step-function Toeplitz
compression (`levinson.py`) gives the first `|alpha_k| > 1` for DH at `t = 3.72` on mesh 4.5/768
(stable from 300 to 1500 digits), at `t = 4.28` on mesh 6/384, and none below 4.5 on coarser meshes.
The lowest off-line DH zero is `0.8085 + 85.70 i`; the sub-Nyquist band for DH at T=3.5 is
`|t| < 2 pi e^T / 5 = 42`, so the failure appears before that zero is inside the band.

Where an Euler-product step would have to enter: nowhere for `T <= 3.4`. DH satisfies the same
statement there with coefficients that are neither nonnegative nor supported on prime powers. Any
all-T argument must separate zeta from DH using coefficients up to `n <= 33`, inside a window whose
width at T=3.5 is, by extrapolating the fit, of order 1e-160 for zeta.

## 5. Canonical system / Krein string (MEASURED, limited)

The Hamiltonian of the canonical system attached to the kernel on `[0,T)` is built from ratios of
nested Gram determinants; its positivity on `[0,T)` is the statement `lam1(t) > 0` for `t < T` and
has the same margin. As a concrete proxy the discrete Krein system was computed: Levinson
reflection coefficients `alpha_k` of the Toeplitz matrix of step functions with mesh `h`
(atlas section 7 matrix `H_{h,m}`), zeta, `T = 3`, `h = 1/128`:

- all `|alpha_k| < 0.2`; median 0.04; prediction errors `E_k` between 1.17 and 3.5;
- spikes at `k h ~ log n`: +0.095 (n=2), +0.078 (3), +0.043 (4), -0.157 (5), -0.177 (7), -0.059 (8),
  -0.094 (9), -0.200 (11), -0.159 (13), -0.055 (16), -0.136 (17), -0.191 (19);
- no monotone trend and no fixed sign.

The boundary Schur parameters therefore do not show the near-degeneracy of section 2: the small
eigenvalue lives in the interior (the minimizer vanishes at the endpoints because of the logarithmic
endpoint weight), and the step mesh does not resolve it. A sign or monotonicity property of the
Hamiltonian that would imply positivity was not found. OPEN: a resolved computation of the
continuum Hamiltonian; by section 2 it needs `5.2 e^T` digits.

## 6. Verdict and the three weakest steps

Verdict: **precise obstruction**. No T was proved. The aim "positive definiteness on [0,T) by primes
alone beyond ln 3" is, for T >= 2, a statement with margin below 1e-29 and a coefficient window
below 1e-26, shared by a non-Euler function up to T = 3.4. An estimate-based proof cannot exist;
an identity-based proof would have to encode the low zeros exactly.

Weakest steps.
1. Nothing is interval-certified. Rounding is in ball arithmetic, but the Gauss-Legendre truncation
   for the archimedean moments is checked only by precision and N stability and by the zero-side
   comparison at T=1. The DH failure at T=3.5 (-6.8e-21) rests on this.
2. The values for T >= 2.2 are single-N. They are upper bounds for `lam1` in any case, which is the
   direction the obstruction needs, but the fitted slope 5.2 could move. The rigidity table at
   T=2.4 uses N=110 and is under-resolved (true windows are smaller).
3. The collapse mechanism (section 2) is heuristic; no proof that `lam1(T) <= exp(-c e^T)` is given.
   "DH passes for T <= 3.4" is Ritz evidence only, not a proof of positivity.

## Files

- `screw.py` (form assembly), `scan.py` (margins and rigidity windows), `zerocheck.py` (zero-side
  check), `levinson.py` (discrete Krein system).
- Logs: `zeta_scan0.txt`, `zeta_scanA.txt`, `zeta_scanB.txt`, `zeta_rigid.txt`, `dh_scan.txt`,
  `dh_bracket.txt`, `dh_prec.txt`, `lev_*.json`.
- Interpreter: `.venv-arb/bin/python` (python-flint 0.9.0, mpmath 1.3.0).
