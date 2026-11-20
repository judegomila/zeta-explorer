# g-channel-geometry: separated carriers, the separated-tail bound, and the signed channel target

Date: 2026-11-16. Scratch research note, single author, not reviewed. No RH claim.
Sources read (read-only refs): PR 29 `research/rh/modules/channel-geometry.md`,
`SEPARATED_GOOD_CARRIERS_AND_SIGNED_CHANNEL_TEST.md`, `TRIANGLE_TO_SIGNED_CHANNEL_TEST.md`;
PR 44 `rigorous/theta-propagation-2026-11-08/theta_separated_tail.md` and README;
`tmp/research-2026-11-16/eq48/RESULT.md`, `pick/NEXT_STAGE.md`, `euler/RESULT.md`; BRIEF.md.

Labels: PROVED (argument given here), CLASSICAL, IMPORTED (a PR statement used as stated, inputs re-read
but not re-audited line by line), MEASURED (double precision or mpmath, not interval-certified), ARGUED, OPEN.

## Verdict

**Precise obstruction, with three small proved statements.**

1. The separated-carrier theorem (PR 29 section 4) does close an infinite family of tests that verified
   height does not: carriers at heights `t in [e^{2b}, 2e^{2b}]` for every `b >= b_0`. This is
   Proposition 2 below. The family is non-explicit (good set by Markov, threshold `b_0` unevaluated).
2. That family carries no information that separates zeta from objects with an off-line resonance.
   **Theorem C**: the PR 29 proof is invariant under `Lambda(n) -> eps_n Lambda(n)` for every real
   `|eps_n| <= 1`. For `eps_n = cos(t0 log n)` the coefficients are those of the Euler product
   `F_t0(s) = [zeta(s+it0) zeta(s-it0)]^{1/2}`. The sparse-span theorem holds for the prime form of `F_t0`,
   and the carrier at `t = t0` is negative for that form, by `-c e^b`. So the method cannot be extended to
   the exceptional carriers. The only property of `Lambda` it uses is `|Lambda(n)| <= log n`. It uses
   neither `Lambda(n) >= 0` nor multiplicativity.
3. The separated-tail theorem (PR 44) is Euler-blind. **Theorem B**: it holds, with the same sech main
   term and the same or better constants, for the Davenport-Heilbronn theta kernel. It depends only on
   the leading term `e^{at - lambda e^t}` of the theta kernel. It closes no test whose sign depends on
   zero locations.
4. The two theorems live in different coordinates (far translates of `h_+-` in the theta tail; paired
   wave packets in Weil coordinates). I found no combination that closes a family neither closes alone.
5. Structure found (**Theorem A**): on any channel family the signed matrix is
   `Z = M* J M`, with `J` = identity on on-line zeros plus one hyperbolic plane per off-line zero pair.
   The number of negative eigenvalues of any channel matrix, and the rank of the positive part of
   `T*T - I` for the relative coupling `T = D^{-1/2} B E^{-1/2}`, is at most the number of off-line
   zero pairs. Under RH the triangle phase `Phi` of PR 29 section 6 is the Bargmann (Pancharatnam)
   invariant of three vectors in the zero space. This answers the open item "no identity identifying
   `Phi` with a holonomy has been established": the holonomy is that of projective zero space, not of
   the prime-curvature cylinder `g_D`. It is a restatement, not a positivity mechanism.

Nothing here moves a bound. The surviving target is the Weil form, as the eq48 note says.

## 0. Plan: what is new relative to the atlas and the walls

| Item | Overlap | New here |
|---|---|---|
| PR 29 sections 3-4, 7-8 | Sparse span proved; "exceptional carriers uncontrolled" stated as a boundary | A countermodel inside the Euler-product class with the same size bounds, where an exceptional carrier is negative (Theorem C). The boundary is a wall for the method, not an unfinished estimate. |
| PR 44 separated tail | Uniform-cardinality positivity far in the tail | DH passes the same theorem with explicit constants (Theorem B). |
| eq48 (target == Weil form) | Used throughout | Channel tests written in the same zero-sum coordinates (section 1); inertia bound (Theorem A). |
| Pick K <= 12 | Finite real-node Pick orders follow from verified height | Scope comparison with carriers (section 5). |
| MV-CAP wall | "Mean-value inputs cannot certify every-window statements" | Theorem C is a concrete instance in the carrier coordinates, with the missing input named. |
| DH wall | Required | Theorem B (DH passes PR 44); section 4.3 (the PR 29 proof fails for DH at the Chebyshev step; DH has negative carriers, MEASURED). |
| Flow-blindness, verified height | Not re-run | Proposition 2 separates the carrier family from verified height by a twin. |

## 1. Channel geometry in zero-sum (one-sided Weil) coordinates

Notation of eq48: `F(w) = xi(1/2+w)`, centered zeros `rho` (so RH is `Re rho = 0`), and for a test `v`
with Laplace transform `V(z) = int v(x) e^{-zx} dx`,

    Q(v, w) = sum_rho conj(V(-conj rho)) W(rho),      Q(v) = Q(v, v).                         (1.1)

On one-sided exponential sums this is the residual target `Q_L` (eq48 Theorem 1). `Q` is translation
invariant: `v -> v(. - c)` multiplies `V(rho)` by `e^{-c rho}` and `conj V(-conj rho)` by `e^{c rho}`.
PROVED (one line).

**Carriers.** PR 29: `0 < delta < (log 2)/2`, even envelopes `psi` supported in `(-delta, delta)`,
`J_b psi = [psi(.+b) + psi(.-b)]/sqrt 2`, window `ell = b + 2 delta`. Put `Psi(z) = int psi e^{-zx} dx`
(entire, even). The transform of `J_b psi` is `sqrt 2 cosh(bz) Psi(z)`. Shifting by `ell` gives a
one-sided test supported in `[0, 2 ell]` with `V(z) = sqrt 2 e^{-ell z} cosh(bz) Psi(z)`. With (1.1):

    Z_jk := H_ell[J_b psi_j, J_b psi_k] = 2 sum_rho cosh^2(rho b) conj(Psi_j(conj rho)) Psi_k(rho).   (1.2)

PROVED from (1.1), evenness of `Psi_j`, and `conj cosh(-b conj rho) = cosh(b rho)`. The identification of
`H_ell` (prime side, PR 29 section 2) with (1.1) is the explicit formula. CLASSICAL. A consistency check:
for `psi = N_t u`, the mean of `2 cos^2(gamma b)` is 1, the zero density is `log t / 2 pi`, and
`int |Psi(i gamma)|^2 d gamma = 2 pi ||psi||^2 = pi ||u||^2`, which gives `(1/2) log t ||u||^2`. This is
the PR 29 value `A[N_t u]`.

- On-line zero `rho = i gamma`: the term is `2 cos^2(gamma b) conj(Psi_j(i gamma)) Psi_k(i gamma)`,
  a positive semidefinite rank-one matrix.
- Off-line quartet `+-sigma +- i gamma`, `sigma > 0`, real `psi`: the diagonal contribution is
  `4 Re[(1 + cosh(2 rho b)) Psi(rho)^2] ~ 2 e^{2 sigma b} |Psi(rho)|^2 cos(2 gamma b + 2 arg Psi(rho))`.
  With `T = e^{2b}` the amplification is `T^sigma`.

**Coherent channel geometry statement (PR 29, extracted).** (i) exact pullback
`J_b* H_ell J_b = A - Delta_b - C_b` with all prime powers kept; (ii) for `t` in a good set `G_b` of
relative measure `>= 1 - C r/b` in `[T, 2T]`, `T = e^{2b}`, each carrier sector `N_t U` has floor
`(1/8) log T`; (iii) for an `L`-separated subset of `G_b`, `L = e^{eps b}`, the common span of dimension
`r m >= r e^{(2 - eps) b}/4` has floor `(1/16) log T`, cross terms retained; (iv) transfer to the physical
complement with floor `(1/32) log T`.

**Good carriers.** `t in G_b` means `||Re_H D_b(t)|| <= (1/2) log T`, where
`D_b(t) = sum_{|s_n| < 2 delta} a_n e^{i t s_n} B(s_n)`, `a_n = Lambda(n)/sqrt n`, `s_n = log n - 2b`.
In zero coordinates this is a two-sided statement: the local zero sum (1.2) lies in
`[1/2, 3/2]` times its mean. It is a finite computation for each given `(b, t, u)`.

**Failed routes (PR 29 section 7, all re-read, none revived).** Intensity without phase; lossless
evolution implies contraction; positive scalar function implies positive kernel; Gauss-Bonnet angle
cancellation; all triangle tests suffice; absolute transport closes the signed prime bound.

**Surviving signed-channel target.** With `D` the certified sparse block and `E, B` the blocks on any
complement,

    E - B* D^{-1} B >= 0     <=>     ||D^{-1/2} B E^{-1/2}|| <= 1  (when E > 0).              (1.3)

In the coordinates (1.1): for every one-sided `v` and every `d` in the sparse span,
`|Q(v, d)|^2 <= Q(v) Q(d)`. Because `D > 0`, (1.3) on the full complement is equivalent to `Q >= 0` on
the whole window, hence (all windows) to the Weil form and to RH (eq48 Theorem 3). Certifying a larger
`D` does not weaken the remaining statement. PROVED (Schur complement) + IMPORTED (eq48).

## 2. Theorem A: zero-space factorization and the inertia bound

Let `psi_1, ..., psi_N` be any finite family of even envelopes as above (any `b`), `Z` as in (1.2).

**Theorem A.** Suppose `F` has finitely many off-line zeros in the sense of pairs
`{rho, -conj rho}`, `Re rho > 0`, counted with multiplicity (`nu` pairs; this holds for a twin of xi with
finitely many zeros moved, and with `nu = 0` under RH). Then `Z` has at most `nu` negative eigenvalues.
If `Z = [[D, B*],[B, E]]` with `D > 0`, `E > 0` and `T = D^{-1/2} B E^{-1/2}`, then `T*T - I` has at most
`nu` positive eigenvalues.

Proof. Write `w_rho = (conj Psi_j(conj rho))_j`, a column vector. By (1.2),
`Z = sum_rho 2 cosh^2(rho b) w_rho w_{-conj rho}^*`, since `(w_{-conj rho})_k^* = Psi_k(-rho) = Psi_k(rho)`.
On-line zeros give `2 cos^2(gamma b) w w^*`, which is PSD. The two terms of an off-line pair
`{rho, -conj rho}` are adjoint to each other, and their sum `c w_rho w_{rho'}^* + conj(c) w_{rho'} w_rho^*`
has at most one negative eigenvalue. The on-line series converges (smooth envelopes), so `Z` is a PSD
matrix plus `nu` Hermitian matrices each of negative index at most 1. Negative index is subadditive.
For the second claim, `Z` is congruent to `[[I, T*],[T, I]]`, whose negative eigenvalues are
`1 - s_i` over singular values `s_i > 1` of `T`. PROVED.

Consequences.
- Under RH every channel matrix is a Gram matrix in the Hilbert space `l^2` over zeros with weights
  `2 cos^2(gamma b)`. The three-channel invariant `z_12 z_23 z_31 = r_12 r_23 r_31 e^{i Phi}` of PR 29
  section 6 is then the Bargmann invariant of three vectors, and `Phi` is the Pancharatnam phase, the
  holonomy of the Fubini-Study connection around the geodesic triangle in projective zero space.
  PROVED (definition of the Bargmann invariant) conditional on RH. Without RH the same statement holds
  in a Pontryagin space of negative index `nu`.
- RH is the statement that the zero space is a Hilbert space and not a Pontryagin or Krein space.
  This is the Weil criterion again. It gives no mechanism.
- The abstract four-channel countermodel of PR 29 (`Z_ii = 1, Z_ij = -2/5`) has one negative
  eigenvalue. By Theorem A it needs at least one off-line pair to be realized by actual channels.

## 3. Theorem B: the separated-tail theorem is Euler-blind

PR 44 uses the kernel only through the envelope (2.1) and two exponents. General form:

**Theorem B.** Let `kappa(t) = c e^{a t - lambda e^t} L(t)` for `t >= 0`, with `c, lambda > 0`,
`a >= 1/2`, and `1 - d_R <= L(t) <= 1 + d_R` for `t >= R >= 1`, `d_R < 1`. Let
`H(U,V) = alpha int_0^infty (U + V + 2s) kappa(U+s) kappa(V+s) ds` for `U, V >= 0`. Put `p = 2a - 1`,

    c_R = p e^{-R}/(2 lambda),   b_R = e^{-R}/(2 lambda R),
    eta_R = ((1 + d_R)/(1 - d_R))^4 [1/(1 - c_R) + b_R/(1 - c_R)^2] - 1,

and `ell_delta`, `E_{R,delta}` as in PR 44 with this `eta_R`. If `c_R < 1` and
`E_{R,delta} < ell_delta`, then for every finite configuration `U_j >= R` with mutual spacing
`>= delta` and all complex `a`,

    sum conj(a_i) a_j H(U_i, U_j) >= (ell_delta - E_{R,delta}) sum |a_i|^2 H(U_i, U_i) > 0.

Proof. Substituting `q = Lambda (e^s - 1)`, `Lambda = lambda (e^U + e^V)`:
`J(U,V) := Lambda H(U,V)/(alpha (U+V) kappa(U) kappa(V))
 = int_0^infty e^{-q} (1 + q/Lambda)^p [1 + 2 log(1 + q/Lambda)/(U+V)] L(U+s)L(V+s)/(L(U)L(V)) dq`.
Using `(1+x)^p <= e^{px}`, `log(1+x) <= x`, `Lambda >= 2 lambda e^R`, `U + V >= 2R`:
`((1-d_R)/(1+d_R))^2 <= J <= ((1+d_R)/(1-d_R))^2 [1/(1-c_R) + b_R/(1-c_R)^2]`. The normalized kernel is
`C(U,V) = (U+V)/(2 sqrt(UV)) sech((U-V)/2) J(U,V)/sqrt(J(U,U) J(V,V))`. The sech factor is
`2 e^{(U+V)/2}/(e^U + e^V)` and does not depend on `a`, `lambda`, `c`. The rest is PR 44 sections 3-5
verbatim. PROVED given PR 44 sections 4-5 (IMPORTED; elementary, re-read). For zeta, `a = 9/4`,
`lambda = pi`, `p = 7/2` reproduce PR 44's `c_R`, `b_R`.

**DH instance.** `f = (1/2 cos theta)[e^{-i theta} L(s, chi) + e^{i theta} L(s, conj chi)]`, `chi` mod 5,
`chi(2) = i`; coefficients `a_n = 1, kappa_0, -kappa_0, -1, 0` (period 5), `kappa_0 = 0.2840...`.
`(5/pi)^{s/2} Gamma((s+1)/2) f(s) = const * int kappa_f(u) e^{(s - 1/2) u/2} du` with

    kappa_f(u) = e^{3u/4} sum_{n>=1} n a_n e^{-pi n^2 e^u/5}.

CLASSICAL (Mellin transform of the odd theta series). So `a = 3/4`, `lambda = pi/5`, `p = 1/2`, and
`|L(t) - 1| <= sum_{n>=2} n |a_n| e^{-(pi/5)(n^2-1) e^t} <= 0.6 exp(-(3 pi/5) e^R) =: d_R` for
`t >= R >= 1`. PROVED (the `n = 2` term is `0.568 e^{-(3 pi/5) e^t}`; `n = 3, 4` add less than `0.1%`
at `t = 1`; `a_5 = 0`).

| spacing delta | start R | DH margin `ell - E` | zeta margin (PR 44) |
|---:|---:|---:|---:|
| 8 | 8 | 2.477e-2 | 2.47e-2 |
| 4 | 20 | 9.014e-3 | 9.01e-3 |
| 2 | 100 | 6.585e-4 | 6.58e-4 |
| 1 | 2000 | 1.141e-6 | 1.14e-6 |
| 0.5 | 1,200,000 | 1.196e-11 | 1.19e-11 |

MEASURED (`dh_constants.py`, double precision). The margins agree with zeta's because both are
dominated by the kernel-independent term `32/(e^2 R^2 (e^{delta/4} - 1))`.

Numerical check of the DH kernel itself (`dh_separated_tail.py`, mpmath): `kappa_f(u)/kappa_f(-u) = 1`
to 16 digits at `u = 0.3, 1, 2` (functional equation); `L(1) - 1 = 3.38e-3 <= d_1 = 3.57e-3`;
normalized DH kernel matrices on separated configurations (8 to 10 points, equispaced and jittered)
have smallest eigenvalue `0.93` (`R = 8, delta = 8`), `0.55` (`R = 20, delta = 4`), `0.107`
(`R = 100, delta = 2`), with row-sum deviation from the sech Gram matrix `1.6e-3`, `1.6e-3`, `2.0e-4`.
A configuration outside the proved range (`R = 2, delta = 1`) is also positive (`2.1e-3`). The last
configuration in the script (`R = 1, delta = 0.5`) had not finished when this note was written.

**Consequence.** DH has zeros off the line, so its full kernel is not PSD (PR 44 localization argument,
which is kernel-generic; ARGUED for DH, not re-proved here). The separated-tail positivity holds for it
all the same. The reason is visible in the proof: for `U_i >= R` the form compares the leakage of
translates of `h_+ = (1 + alpha u/2) kappa` and `h_- = (1 - alpha u/2) kappa` back across the cutoff, a
quantity of size `e^{-2 lambda e^R}` governed by the `n = 1` theta term. No zero enters. **The step of
PR 44 that would have to use the Euler product does not exist: there is none.** The theorem cannot
contribute to the complement test (1.3).

## 4. Theorem C: the separated-carrier theorem uses only |Lambda(n)| <= log n

### 4.1 Statement and proof

For a real sequence `eps = (eps_n)`, `|eps_n| <= 1`, let `H^eps_ell` be `H_ell` with `Lambda(n)` replaced
by `eps_n Lambda(n)` in the prime sum, gamma and pole terms unchanged. In the pullback of PR 29
section 2 the term `C_b` is the gamma cross term between the two packets and the `e^b` term is the pole;
neither involves the primes. On exactly neutral envelopes

    H^eps_ell[J_b psi] = Gamma_{1/4}[psi] - X^eps_b[psi] - C_b[psi],
    X^eps_b = (1/2) sum_{|s_n| < 2 delta} eps_n a_n (S_{s_n} + S_{s_n}^*).                   (4.1)

**Theorem C.**
(i) PR 29 sections 3-4 through its display (12) hold for `H^eps_ell` for every such `eps`, with a good
set `G^eps_b` of relative measure `>= 1 - C_delta r/b`, the same floors and the same span dimension.
(ii) Let `U` contain a real even `u_0 >= 0`, `||u_0|| = 1`. For all large `b` there is
`t0 in [T, 2T]`, `T = e^{2b}`, with `2 b t0 in 2 pi Z`, such that for `eps_n = cos(t0 log n)`

    H^eps_ell[J_b N_{t0} u_0] <= (1/2) log t0 + O(1) - c e^b < 0,     c = c(u_0, delta) > 0.

(iii) `eps_n Lambda(n) = Lambda(n) cos(t0 log n)` are the coefficients of `-F'/F` for the Euler product
`F_t0(s) = prod_p (1 - p^{-s-it0})^{-1/2} (1 - p^{-s+it0})^{-1/2} = [zeta(s+it0) zeta(s-it0)]^{1/2}`
in `Re s > 1`. They are real, supported on prime powers, and bounded by `Lambda(n)`.

Proof. (i) The proof in PR 29 uses the primes through three upper bounds only:
`sum a_n^2 = O(b)`, `sum n a_n^2 = O(e^{2b} b)`, `M_b = sum a_n = O(e^b)` over the annulus, followed by
Montgomery-Vaughan for arbitrary complex coefficients, Markov, and smooth-packet separation. Each bound
is monotone in `|a_n|`. (The transfer (13) to `Q_ell` uses an action bound for the actual head and is
not claimed for `H^eps`.)
(ii) By PR 29 (2), `X^eps_b[N_t u] = (1/2) sum eps_n a_n cos(t s_n) R_u(s_n) + O_K(M_b t^{-K})`, since
`<u, Re_H(e^{its} B(s)) u> = cos(ts) R_u(s)` for real `u`. With `2 b t0 in 2 pi Z`,
`cos(t0 log n) = cos(t0 s_n)`, so the sum is `sum a_n cos^2(t0 s_n) R_{u_0}(s_n)`, with every term
`>= 0` because `u_0 >= 0`. Fix `s* > 0` with `R_{u_0}(s) >= 1/2` on `|s| <= s*`. Average
`cos^2(t0 s_n) = 1/2 + (1/2) cos(2 t0 s_n)` over the lattice points `t0 = 2 pi k/(2b)` in `[T, 2T]`:
for `s*/2 <= |s_n| <= s*` the mean of the cosine is `O(b/(T s*))`. So some `t0` has
`sum_{s*/2 <= |s_n| <= s*} a_n cos^2(t0 s_n) >= (1/4) M*`, with
`M* = sum_{s*/2 <= |s_n| <= s*} a_n >= c' e^b` by the prime number theorem in a fixed multiplicative
interval (CLASSICAL). Hence `X^eps_b[N_{t0} u_0] >= (c'/16) e^b`, and
`Gamma_{1/4}[N_{t0} u_0] = (1/2) log t0 + O(1)`, `C_b >= 0`. (iii) Direct. PROVED, given PR 29 (1)-(2)
(IMPORTED).

### 4.2 What it means

- The sparse-span theorem is true for `F_t0` on a set of carriers of relative measure `-> 1`, and false
  at the carrier `t0`. So no argument that sees the primes only through `|Lambda(n)|`, or through any
  statistic invariant under `Lambda -> eps Lambda` (Chebyshev, Brun-Titchmarsh, mean values over `t`,
  large sieve), can certify the exceptional carriers. This is MV-CAP in carrier coordinates, with a
  witness. PROVED.
- What distinguishes zeta from `F_t0` is a singularity of `F_t0'/F_t0` at `1 +- i t0`. In the centered
  variable that is a resonance at `sigma = 1/2` and height `t0`, amplified by `T^{1/2} = e^b`. The
  neutral condition `m_{1/2}(psi) = 0` removes only the resonance at height 0. For zeta the resonance on
  `Re s = 1` is absent, and the classical proof of that uses `Lambda(n) >= 0` (3-4-1 inequality).
  A zero at `1/2 + sigma + i gamma` is a resonance of strength `T^sigma` with either sign, by (1.2).
- So certifying the carrier at height `t` for all `b` is the pointwise bound
  `sum_{|s_n| < 2 delta} a_n cos(t s_n) R_u(s_n) <= log(t/2 pi) + O(1)` for a Dirichlet polynomial of
  length `X = e^{2b}`, for every `X`. With a zero-free half-plane `Re s > theta` the available bound is
  `X^{theta - 1/2}` times logarithms: `e^{0.75 b}` at `theta = 7/8`. That does not reach `log t`. ARGUED.
- `Lambda(n) >= 0` is not used anywhere in PR 29 sections 2-4. Multiplicativity is not used. The size
  bound `|Lambda(n)| <= log n` is the only arithmetic input.

### 4.3 Controls (MEASURED, `carrier_signblind.py`)

`delta = 0.3`, `u` = standard bump on `(-delta, delta)`, `r = 1`, prime side,
`rho(t) = H[J_b N_t u]/||N_t u||^2 ~ m(t) - P(t)`, `m(t) = Re psi(1/4 + it/2) - log pi`,
`P(t) = sum c_n cos(t s_n) R_u(s_n)/||u||^2`; 3000 random `t` in `[T, 2T]`.

| object | b | sum c_n^2 | rms P | max abs P | fraction abs P > (1/2) log T | smallest sampled rho |
|---|---:|---:|---:|---:|---:|---:|
| zeta | 5 | 12.01 | 1.21 (MV 1.27) | 3.78 | 0 | +4.73 |
| zeta | 6 | 14.39 | 1.30 (MV 1.39) | 4.78 | 0 | +6.12 |
| `F_t0`, typical t | 5 | 6.00 | 1.18 | - | 0.0013 | - |
| `F_t0`, t = t0 = 30176.25 | 5 | | | P = +33.39 (predicted 33.10) | | **-24.91** |
| `F_t0`, typical t | 6 | 7.22 | 0.93 | - | 0 | - |
| `F_t0`, t = t0 = 222974.02 | 6 | | | P = +90.06 (predicted 89.94) | | **-79.58** |
| DH | 5 | 84.12 | 3.40 | 26.74 | 0.121 | **-16.97** |
| DH | 6 | 255.45 | 5.76 | 60.73 | 0.178 | **-19.80** |

DH row: `c_n = Lambda_f(n)/sqrt n` with `Lambda_f` the formal log-derivative coefficients of the DH
Dirichlet series (`max |Lambda_f(n)|` in the annulus is 206 at `b = 5` and 958 at `b = 6`, against
`log n ~ 10.6, 12.6`), and `m_DH ~ log(5t/2 pi)`.

**DH control for the carrier theorem.** The step that fails for DH is the Chebyshev step:
`sum a_n^2 = O(b)` needs `|Lambda(n)| <= log n`, which is a consequence of the Euler product. For DH
`Lambda_f(n)` grows like a power of `n` (DH has zeros in `Re s > 1`), the mean square in the annulus
grows (84 -> 255), the exceptional fraction grows (12% -> 18%), and sampled carriers are negative.
So the PR 29 theorem does separate zeta from DH. Theorem C shows that this separation stops at the size
bound: `F_t0` has the size bound and still has a negative carrier.

## 5. Does anything here close an infinite family that verified height does not?

**Proposition 2 (yes, for separated carriers).** Let `H_0` be any verified height and `b` with
`e^{2b} > H_0`. The statement "the sparse span of PR 29 at `b` is positive" does not follow from
{functional equation, gamma factor, all zeros of height `<= H_0` on the line}.

Proof. Take the twin of `xi` in which two on-line pairs at heights `gamma_1, gamma_2 in [T, 2T]` near a
selected carrier `t_j` are replaced by one quartet `+-sigma +- i gamma'`, with `gamma'` within `O(1)` of
`t_j` and chosen so that `cos(2 gamma' b + 2 arg Psi(rho')) = -1` for `psi = N_{t_j} u`, `u` real. By
(1.2) its form on that carrier is at most `Q_zeta + (6 - 2 e^{2 sigma b}) |Psi(rho')|^2` (the two removed
on-line terms are nonnegative and are dropped), and `Q_zeta <= ((3/4) log T + O(1)) ||u||^2` on a good
carrier, while `|Psi(rho')| >= c ||u||` for `gamma' - t_j = O(1)`. For `T^sigma = e^{2 sigma b}` larger
than a constant times `log T` this is negative. The twin satisfies the three
hypotheses. PROVED (the twin's form is defined by its zero sum).

So the PR 29 family is outside what verified height controls, for every `b > (1/2) log H_0`, and it is
infinite. IMPORTED (PR 29 theorem) + PROVED (independence). Three qualifications:

1. It is an existence statement. `G_b` is not explicit and `b_0` is not evaluated. For a named
   `(b, t, u)` membership is a finite prime sum of length `e^{2b + 2 delta}`; at `b = 5, 6` all 3000
   sampled carriers pass with `r = 1` (MEASURED, table above).
2. By Theorem C the same family is closed for `F_t0`, and by taking `eps = 0` for the gamma form alone.
   The closure is a statement about typical carriers at the scale `X = T`. Proposition 2 and Theorem C
   together say: the family is not a consequence of verified height, and it is not evidence about the
   exceptional carriers either.
3. Verified height closes a different, larger region below `H_0`: for carriers `t <= H_0/2` and every
   `b` up to a power of `log H_0` times a constant depending on the envelope's Fourier decay, the
   off-line tail in (1.2) is negligible and the form is nonnegative up to that tail. ARGUED (tail bound
   not written out). The two regions do not overlap usefully: PR 29 needs `b = (1/2) log T` with
   `T >= e^{2 b_0}`.

**Separated tail (PR 44): no.** By Theorem B its tests have a sign that does not depend on zero
locations. "Verified height does not close them" is true only in the sense that nothing about zeros
enters at all.

**Combination: none found.** PR 44 tests are finite combinations of far translates
`h_+(. - U_i)`, `U_i >= R`, of one fixed function, measured by leakage across a cutoff; the governing
scale is `e^{-2 lambda e^R}`. PR 29 tests are paired packets at `+-b` with carrier `t ~ e^{2b}`. A
separated-tail configuration is not a carrier span and its Gram data do not enter (1.3) for the
carrier block. ARGUED.

**Pick K <= 12 and the channel tests.** Pick order `K` is positivity of `Q` on spans of `K` real
exponentials `e^{-x t}`, `x > 1/2`. It gives: every channel family made of at most 12 real exponentials
is positive; in particular the three-channel determinant test of PR 29 section 6 passes for them, and a
collective defect of the type of the four-channel countermodel needs at least 13 such channels.
PROVED from the K <= 12 theorem (IMPORTED). It does not reach the carriers: a carrier `N_t u` at
`t ~ 10^4` is not in the span of 12 exponentials, and I have no form-norm approximation estimate.
Conversely carriers say nothing about order 13. The two-box test
`[Psi(a+b) - Psi(|a-b|)]^2 <= Psi(2a) Psi(2b)` over all widths contains the scalar condition
`Psi >= 0`, which is RH-equivalent by Suzuki, so no finite input closes it for all widths. CLASSICAL.

## 6. DH control summary

| Mechanism | DH outcome | Step that uses the Euler product |
|---|---|---|
| PR 44 separated tail | passes (Theorem B, explicit constants) | none; Euler-blind |
| PR 29 separated carriers | proof fails; sampled DH carriers negative | Chebyshev `|Lambda(n)| <= log n` only |
| Theorem A inertia bound | holds for DH with `nu = infinity` (vacuous) | none; it is a zero-side identity |
| Exceptional carriers | not closed for zeta; `F_t0` (Euler product, size bound) fails | would need the sign of `Lambda` or a zero-free statement at the carrier height |

Against the eq48 fact: every statement above is a statement about `Q` of (1.1) on a subfamily.
Sections 1 and 5 use that the complement test is `Q >= 0` and so equals the Weil form.

## 7. Verdict

Precise obstruction. Proved: Theorem A (zero-space factorization, inertia bound, Bargmann phase),
Theorem B (separated tail holds for DH), Theorem C (sign-blindness of the separated-carrier proof, with
an Euler-product countermodel at an exceptional carrier), Proposition 2 (the carrier family is
independent of verified height). Not proved: anything about exceptional carriers of zeta.

The channel picture does produce one usable reading. A carrier is exceptional exactly when the zeros
within `O(1/delta)` of `t` resonate with the lattice `(pi/b)(Z + 1/2)` or an off-line zero sits there
with amplification `T^sigma`. A proof that closes exceptional carriers has to tell zeta from `F_t0`,
so it has to use `Lambda >= 0` or Hecke structure at the carrier height. Size bounds and mean values
do not.

No pivot was needed; the lane question has a definite answer.

## 8. Three weakest steps

1. **Imported asymptotics.** Theorems C and Proposition 2 rely on PR 29 (1)-(2) (the exact pullback and
   the product-to-sum formula with `O_K(M_b t^{-K})` error). I re-read them and the numerics agree with
   the predicted `P(t0)` to 1%, but I did not re-derive the error terms, and PR 29 itself reports that
   its annular precursor was only partly recovered.
2. **DH non-PSD and the localization argument.** In section 3 the claim that the full DH kernel is not
   PSD rests on PR 44's localization argument being kernel-generic. That is argued, not proved here.
   Theorem B itself does not depend on it.
3. **Theorem A with infinitely many off-line zeros, and Proposition 2's twin.** The inertia bound is
   stated for finitely many off-line pairs. For DH it is vacuous. In Proposition 2 the twin is defined
   by its zero sum and is not shown to come from a Dirichlet series; that is enough for independence
   from the three listed hypotheses but not from further arithmetic hypotheses. Region 3 of section 5
   (what verified height closes below `H_0`) is argued without an explicit tail bound.

## Files

- `RESULT.md` (this file)
- `carrier_signblind.py`, `carrier_signblind.log`: carrier form for zeta, `F_t0`, DH
- `dh_separated_tail.py`, `dh_separated_tail.log`: DH theta kernel, evenness, normalized Gram matrices
- `dh_constants.py`, `dh_constants.log`: Theorem B constants for DH
