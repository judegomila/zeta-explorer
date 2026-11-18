# c1-shear-hecke-fricke: Hecke commutator with the bridge shear at tau -> 0, and Fricke w_4 on the base

Date: 2026-11-17. Nothing here proves or refutes RH. No bound moves. No statement about zeros of zeta is claimed.
Labels: PROVED (argument in this note, elementary), CLASSICAL (cited), MEASURED (scripts in this
directory, float64 / mpmath seeds, not interval-certified), OPEN.

## 0. Verdict

**Lane killed by its decisive first test; one pivot taken; the pivot ends in a precise obstruction.**

1. The commutator `[V_p, G_tau]` is computed exactly (Lemma 1). Its `tau -> 0` term is the inner
   derivation `ad(u^2/16)`, which on the Hecke algebra is `delta(V_n) = (log n / 8) {u, V_n}`. Its
   kernel is trivial for each single `p` (on functions) and is the scalars (in the algebra). It is
   not characterised by the `T_p` jointly. The answer to the first-lemma question is negative.
2. The eigen-defect has `tau`-order exactly 1 when the coefficients are completely multiplicative
   at `p` and exactly 0 otherwise (Lemma 2). No order above 1 occurs for any kernel. MEASURED for
   `p <= 47`: zeta has order 1.00 at all 15 primes with coefficient `(log p / 4) * 0.31356`
   (prediction and measurement agree to 4 digits).
3. Zeta is not separated from the controls by this order. Completely multiplicative sign twists
   (random signs, Liouville), `zeta(s + 0.3)`, the unimodular twist `n^(-0.7i)` and a Beurling
   system with its own primes all have order 1 at every prime. T-NR has order 1 at every prime
   except `q`. DH, a single Epstein class with `h = 2` and the backward heat kernel have order 0
   at a positive proportion of primes. The first aliveness condition (higher order for zeta than
   for every control) is false.
4. The statement obtained is an equality (`a(pm) = lambda a(m)` for all `m`). It is complete
   multiplicativity of an ordinary Dirichlet series restated. It is not an inequality. The second
   aliveness condition is false.
5. Fricke `w_4` on the arc of `X_0(4)(R)` is `u -> -u`. The shear is `exp(tau d^2/16)` with `d` the
   hyperbolic distance from the `w_4`-fixed point, so it is `w_4`-invariant. The `w_4`-fixed locus
   on the arc is one point. It gives evenness of `F` and nothing about `Re s = 1/2` beyond that. It
   does not carry any statement to the critical line (section 5).
6. Pivot (section 6): on the transform side the sheared Hecke operator is a multiplier composed
   with a real translation, `F(z) -> n^(-1/2-z) e^(tau l^2/4) F(z - tau l/2)`, `l = log n`
   (PROVED, MEASURED to 1e-15). For `tau < 0` this gives a prime expansion of `H_tau` that
   converges absolutely at every `z`, including the critical line (MEASURED to 1e-10 or better at
   `tau = -2, -1.2, -0.8`). For `tau = 0` it converges for `Re s > 1`. For `tau > 0` no term of it
   exists. The convergent side `tau < 0` is the side where non-real zeros exist (Rodgers-Tao,
   CLASSICAL). So the position `tau = 0` is the boundary of the domain of the expansion, reached
   from the side where the conclusion is false, with `l^1` size growing like `exp(1/(4|tau|))`.

## 1. Plan

Sources read: BRIEF.md; OBSTRUCTION_MAP.md sections 2, 3.2, 5, 6 (item 11); RESULT.md and
REFEREE.md of g-torus-modular, h-hecke-torus-symmetry, h-klein-fricke, g-klein-bottle-seam.

Objects (from h-hecke-torus-symmetry Theorem 1, referee-confirmed). `kappa(u) = sum_n V_n g0`,
`V_n = n^(-1/2) T_(-2 log n)`, `(T_h a)(u) = a(u - h)`, `F(z) = xi(1/2 + z) = int kappa(u) e^(zu/2) du`,
`J a(u) = a(-u)`, `J kappa = kappa`. Shear: `G_tau` = multiplication by `exp(tau u^2/16)`, so
`G_tau kappa` is the kernel of the de Bruijn-Newman function `H_tau` (the HEAT control at `tau < 0`).
"Real-shear torus" is `xi(s + w) xi(s - w)` with real `w` (the `E_a` control).

New relative to the earlier lanes: none of them computed `[V_p, G_tau]`, fitted the order of the
eigen-defect in `tau`, ran the sign twist in a Hecke lane, or placed the shear on the base arc.

Aliveness conditions set by the assignment: (A) the defect vanishes to higher order for zeta than
for every control; (B) the resulting statement is an inequality.

## 2. First lemma: the commutator

**Lemma 1 (PROVED).** For every `n >= 1`, with `l = log n`:

(a) `G_tau V_n G_tau^-1 = M_(n,tau) V_n`, where `M_(n,tau)` is multiplication by `exp(-tau l (u + l)/4)`.

(b) `[V_n, G_tau] = G_tau (exp(tau l (u + l)/4) - 1) V_n = tau (l/4)(u + l) V_n + O(tau^2)` on functions of
Gaussian-exponential decay, and `(u + l) V_n = (1/2){u, V_n}`. So the first-order term is
`tau * delta(V_n)` with `delta = ad(u^2/16)` restricted to the Hecke algebra:
`delta(V_n) = (log n / 8) {u, V_n}`.

(c) `delta` is a derivation, `delta(V_m V_n) = delta(V_m) V_n + V_m delta(V_n)`, and its weight
`log n` is additive in `n`. For each `n > 1` the operator `delta(V_n)` is injective on `L^2(R)`.
For a finite combination, `delta(sum c_n V_n) = 0` iff `c_n = 0` for all `n > 1`.

(d) Transform side. With `Fhat(z) = int a(u) e^(zu/2) du`:
`(M_(n,tau) V_n a)^(z) = n^(-1/2 - z) e^(tau l^2/4) Fhat(z - tau l/2)`.

Proof. (a) `(G V_n G^-1 a)(u) = e^(tau u^2/16) n^(-1/2) e^(-tau (u+2l)^2/16) a(u + 2l)` and
`u^2 - (u + 2l)^2 = -4l(u + l)`. (b) `V_n G = G (G^-1 V_n G)` and (a) with `tau -> -tau`; also
`V_n (u a) = (u + 2l) V_n a`, so `u V_n + V_n u = 2(u + l) V_n`. (c) `ad` of any operator is a
derivation. `(u + l) V_n a = 0` forces `a(u + 2l) = 0` almost everywhere. The operators
`{u, V_n}`, `n > 1`, shift supports by distinct amounts `2 log n`, so a vanishing combination has
all coefficients zero. (d) Substitute `v = u + 2l`. QED.
MEASURED (`transport2.py`): (d) applied to `kappa` holds with relative error at most `1.1e-15` for
`tau = -0.4, 0.25`, `p = 2, 3, 7, 47`, `z = 0.15 + 6.3i`.

Reading. The pair (`G_tau`, `V_n`) is a Weyl pair. `tau = 0` is the only shear at which `V_n` is a
translation, that is a scalar Fourier multiplier `n^(-1/2-z)`; at shear `tau` it is the multiplier
composed with the real translation `z -> z - tau (log n)/2`. The lead is correct as a statement
about operators. The leading term of the commutator annihilates nothing, for each single `p`
(part (c)). It selects no subspace, so no property is "characterised by its kernel".

## 3. Second lemma: the eigen-defect and its order

For a kernel `K = sum_nu c(nu) nu^(-1/2) g(u + 2 log nu)` let `K_p` be the sub-sum over frequencies
divisible by `p` and `K^(p) = K - K_p`. Define

    d_p(tau)[K] = min over complex lambda of || (1 - lambda V_p) G_tau K - G_tau K^(p) || / || G_tau K_p ||.

**Lemma 2 (PROVED for whole-line L^2 norms; the numerics use a window).**
(a) `d_p(0) = 0` iff `c(p m) = lambda c(m)` for all `m` (complete multiplicativity at `p`).
(b) If `d_p(0) = 0` then `d_p(tau) = |tau| (log p / 4) sigma + O(tau^2)`, where `sigma` is the standard
deviation of `u` under the density `|K_p|^2`. For a completely multiplicative kernel `K_p` is a
translate of `K`, so `sigma = sigma_K` for every `p`. `sigma > 0` always, so the order is exactly 1.
(c) If `d_p(0) > 0` the order is 0.
(d) With the sheared operators `V_p^tau = G_tau V_p G_tau^-1` in place of `V_p` the defect equals
`d_p(0)` for every `tau`.

Proof. (a) `(1 - lambda V_p) K - K^(p) = sum_m (c(pm) - lambda c(m)) (pm)^(-1/2) g(u + 2 log pm)` and the
translates of a seed with non-vanishing transform are linearly independent (uniqueness of Dirichlet
series). (b) By Lemma 1 the residual is `G_tau K_p (1 - lambda' exp(tau L u/4))` with
`lambda' = lambda exp(tau L^2/4)`; expand and minimise over `lambda'`. (c) Continuity. (d) Conjugation.
QED.

Consequence. The order is 0 or 1 for every kernel. "Vanishes to higher order than every control"
can hold only against controls that are not completely multiplicative at some prime.

## 4. Decisive first test (MEASURED)

`defect.py` (mpmath seeds at 30 digits, float64 least squares; window `u in [-11, 5]`, 161 points;
`tau in {0, 0.3, 0.1, 0.03, 0.01}`; 15 primes `p <= 47`; run through `scripts/memcap.sh 8`, 108 s).
Output `defect.log`, `defect.json`. `d1` is `d_p` above; `d2` is the same with a second free
coefficient on `V_p^2` (degree-2 Hecke polynomial).

| kernel | `d1(0)` | order of `d1` | `d2(0)` | order of `d2` | separated from zeta |
|---|---|---|---|---|---|
| zeta | 0 (<= 2e-16), all `p` | 1.00, all `p` | 0 | 1.00 | |
| DH (mod 5) | 1.00 at `p = +-2 mod 5`; 0 at `p = +-1 mod 5` | 0 resp. 1.00 | 0.76 to 1.00 resp. 0 | 0 resp. 1.00 | yes, at `p = +-2 mod 5` |
| Epstein single class `[1,0,5]`, `h = 2` | 0.030, 0.037, 0.058, 0.13, 0.20, 0.21 at `p = 2, 3, 7, 23, 43, 47` | 0 (fit 0.1 to 0.2) | 0.024 to 0.20 | 0 | yes, at ramified and non-principal split primes |
| Epstein class sum (Euler product, degree 2) | 0.39 to 0.82 at inert `p` | 0 | 0, all `p` | about 1 | only in degree 1 |
| real-shear torus `E_w`, `w = 0.3` | 0.011, 0.0098, 0.0058 at `p = 2, 3, 5` | mixed | 0, all `p` | about 1 | only in degree 1 |
| TW-: completely multiplicative random signs | 0, all `p` | 0.81 to 1.04 | 0 | same | **no** |
| TW-: Liouville | 0, all `p` | 0.73 to 1.19 | 0 | same | **no** |
| real shift `zeta(s + 0.3)` | 0 (<= 1e-15), all `p` | 0.85 to 1.08 | 0 | same | **no** |
| unimodular twist `n^(-0.7i)` | 0, all `p` | 0.79 to 0.97 | 0 | same | **no** |
| T-NR, `q = 2`, `c = 2.1` | 0.733 at `p = 2`; 0 at the other 14 primes | 0 resp. 1.00 | 0.619 resp. 0 | 0 resp. 1.00 | only at the single prime `q` |
| Beurling (5 replaced by 5.5), own primes | 0, all | 1.09 to 1.23 | 0 | same | **no** |
| Beurling, translations by rational `log p` | 0.303 at `p = 5`; 0 elsewhere | 0 resp. 1.1 to 1.2 | 0.301 | 0 | only at the changed prime |
| HEAT: zeta at `tau0 = -0.5`, defect from `tau0` | 0.027 to 0.149, growing with `p` | 0 | same | 0 | yes for `V_p`; no for `V_p^tau` (Lemma 2(d)) |

Checks. Zeta: `d1(0.01)/0.01 = 0.054342, 0.086130, 0.152558, 0.245820, 0.301848` at
`p = 2, 3, 7, 23, 47`; Lemma 2(b) with `sigma_kappa = 0.3135608` (`sigma_check.py`) gives
`0.054336, 0.086120, 0.152540, 0.245792, 0.301814`. The raw commutator norm
`||[V_p, G_tau] K|| / ||G_tau K_p||` has order 0.8 to 1.0 for every kernel including DH: it is
kernel-blind, as Lemma 1 says.

Caveats on the table. (i) Fitted orders between 0.7 and 1.2 for the non-even kernels come from four
`tau` values up to 0.3 and a finite window; Lemma 2 gives exactly 1. (ii) For degree-2 kernels and
`p >= 17` the `p^2`-part lies at `u < -11`, outside the window, so `d1(0)` is under-resolved there
(Epstein split principal primes, `E_w` at large `p`); the entries quoted are for resolved primes.
(iii) The HEAT fit slope of -0.25 is the effect of measuring from `tau0`; the defect is O(1).

**Outcome against the aliveness conditions.**
(A) False. Zeta has order 1. Every completely multiplicative ordinary or Beurling series has
order 1 at every prime, including sign twists and a function whose zeros lie on `Re s = 0.2`.
(B) False. The vanishing of `d_p(0)` for all `p` is the identity `c(pm) = lambda_p c(m)`. With
`J kappa = kappa` it is Hamburger uniqueness at conductor 1 (OBSTRUCTION_MAP section 2, input
level note): it identifies the function and contains no inequality. Its analytic consequence is
the Euler product on `Re s > 1`.

## 5. Controls, and the Fricke involution

### 5.1 Control table (R3)

| control | outcome | step |
|---|---|---|
| DH | fails | eigen-property at `p = +-2 mod 5` (`V_p` maps it to the twin with sign -1); an identity step (multiplicativity), not an inequality |
| Epstein single class, `h > 1` | fails | eigen-property at non-principal primes; same kind of step |
| backward heat | fails for translations `V_p`, passes for `V_p^tau` | "Hecke operators are translations" (ordinary Dirichlet series); the eigen-property itself is transported by the flow (Lemma 2(d)) |
| sign twist, completely multiplicative | **passes every step** | none: order 1 at all primes; what it lacks is `J`-evenness, which this lane does not use in any inequality |
| unimodular twist `n^(i alpha)` | **passes** | none |
| `zeta(s + a) zeta(s - a)` (real-shear torus) | fails in degree 1, **passes** in degree 2 | separated only by fixing the Hecke polynomial `1 - V_p`, i.e. by naming the function |
| T-NR | fails at the single prime `q` only | a single-prime local condition (wall 5.5) |
| Beurling | **passes** with its own primes; fails with rational translations at the changed primes | integrality of the frequency set |
| phase-rotated transfer operator, `theta^w` | not run | not formulable as a kernel `sum c(n) V_n g` in this lane |

R3 is not met. Four controls pass the full mechanism, and for those that fail, the failing step
is the multiplicativity identity.

### 5.2 Base-side loading and `w_4` (R4)

CLASSICAL (h-klein-fricke Prop 1, referee-confirmed): on the arc `tau_E in i R_+` of `X_0(4)(R)` the
coordinate `x = e^u` is the modulus along the geodesic; `w_4` acts by `x -> 1/x`, i.e. `u -> -u = J`;
completed zeta is the Mellin transform of theta along the arc.

PROVED here (one line each).
- `u` is hyperbolic arclength along the geodesic measured from the `w_4`-fixed point `x = 1`. So
  `G_tau = exp(tau d^2/16)` with `d` = distance from the Fricke point. `G_tau` commutes with `w_4`.
- `V_p` is the dilation `x -> p^2 x` of the arc (level raising). It moves the Fricke point by
  `2 log p`, and `w_4 V_p w_4 = V_p^*`. The commutator of Lemma 1 is this displacement:
  `d^2` is not invariant under a translation of the geodesic.
- The `w_4`-fixed locus on the arc is the single point `u = 0`. Invariance under `w_4` is evenness
  of `F`; with reality of `kappa` it makes `F` real on the imaginary axis. The line `Re s = 1/2` is
  the fixed set of `s -> 1 - conj(s)`, which is `w_4` composed with complex conjugation on the
  transform side. Evenness and reality hold for DH (with its own Fricke involution), T-NR, `E_a` and
  every `H_tau`. They pair zeros `rho, 1 - conj(rho)` and do not place any zero on the line.

Statement required by the assignment: the `w_4`-fixed locus on `X_0(4)(R)` does not carry the
statement to `Re s = 1/2`. Loading on the base instead of the fibre changes the name of `J` and
identifies the shear as radial about the Fricke point. It adds no input beyond the functional
equation. The proper half-integral weight Hecke operator `T(p^2)` uses points off the arc; by the
h-hecke-torus-symmetry referee its eigen-equation on theta is equivalent to `c(pm) = c(m)`, so it
returns Lemma 2(a).

## 6. Pivot (one): the sheared Hecke operator as horizontal transport

Idea. By Lemma 1(d), at shear `tau != 0` a Hecke operator moves the transform horizontally by
`tau (log p)/2`. For `tau < 0` this links the critical line to points on its right, which is the
shape of an R4 step. Test: does the resulting expansion reach the critical line in a regime where
the conclusion can be true?

**Proposition 3 (PROVED; classical in content, the series is the Polymath15-type expansion of `H_t`).**
Let `ghat_tau(w) = int e^(tau u^2/16) g0(u) e^(wu/2) du`.
(a) `tau < 0`: `ghat_tau` is entire and for every complex `z`
`H_tau(z) = sum_(n>=1) n^(-1/2-z) e^(tau l_n^2/4) ghat_tau(z - tau l_n/2)`, `l_n = log n`, absolutely convergent.
(b) `tau = 0`: the series is `zeta(1/2 + z) ghat_0(z)`, absolutely convergent iff `Re z > 1/2`.
(c) `tau > 0`: `e^(tau u^2/16) g0(u)` is not integrable at `u -> -inf` (`g0 ~ -3 pi e^(5u/4)` there), so
`ghat_tau` is not defined and no term of the series exists. The single-prime relation
`(G_tau V_p kappa)^(z) = p^(-1/2-z) e^(tau L^2/4) H_tau(z - tau L/2)` still holds, because `kappa`
decays doubly exponentially in both directions.
(d) For `tau < 0` the `p`-part of the expansion is `sum_k (V_p^tau)^k`, with coefficients
`p^(-k/2) e^(tau k^2 L^2/4)`: a theta-type sum in `k` in place of a geometric series. The coefficient
`e^(tau l^2/4)` is not multiplicative: its cocycle is `exp(tau log m log n / 2)`.

Proof. (a) `G_tau V_n g0 = e^(-tau l(u+l)/4) V_n (G_tau g0)` by Lemma 1, then Lemma 1(d) gives the
`n`-th term as the transform of `G_tau V_n g0`. Absolute convergence: put
`S(u) = sum_n n^(-1/2) |g0(u + 2 l_n)|`. `|g0(v)| <= C e^(5v/4)` for `v <= 0` and
`|g0(v)| <= C e^(9v/4) exp(-pi e^v)` for all `v`. For `u >= 0`, `S` decays doubly exponentially. For
`u < 0`, the terms with `n <= e^(-u/2)` contribute at most `C e^(5u/4) sum n^2 <= C e^(-u/4)`, and the
terms with `n > e^(-u/2)` contribute `O(e^(-u/4))` by comparison with the integral in `m = n e^(u/2)`.
So `S(u) = O(e^(-u/4))` at `-inf`, and `int e^(tau u^2/16) S(u) e^(Re z u/2) du` is finite for `tau < 0`.
By Tonelli the series of transforms converges absolutely and sums to `H_tau(z)`. (b) Theorem 1 of
h-hecke-torus-symmetry. (c), (d) direct. QED.

MEASURED (`transport2.py`, float64 trapezoid; `transport_mp_partial.log` has the first two rows
from an independent mpmath quadrature run that was stopped for time):

| `tau` | `z` | `H_tau(z)` | abs. error of series | terms | sum of abs. terms |
|---|---|---|---|---|---|
| -2 | 14.134725i | 8.589445e-4 | 4.5e-14 | 1998 | 7.08e-3 |
| -2 | 3i | 0.39750575 | 2.4e-12 | 1998 | 1.413 |
| -1.2 | 14.134725i | 5.018413e-4 | 1.3e-12 | 9897 | 8.98e-3 |
| -1.2 | 3i | 0.39974707 | 1.3e-10 | 9897 | 2.051 |
| -0.8 | 14.134725i | 3.299627e-4 | 1.3e-11 | 49020 | 1.168e-2 |
| -0.8 | 3i | 0.40087892 | 2.2e-9 | 49020 | 2.884 |
| -0.8 | 0.3 + 21i | (-4.743072e-6, -6.774041e-6) | 8e-15 | 49020 | 8.50e-5 |

Coefficient chain: `sum_n n^(-1/2) e^(tau l_n^2/4) = 2.508, 4.002, 7.495, 13.97` at
`tau = -2, -1, -0.5, -0.3`, against the Gaussian-integral model `sqrt(4 pi/|tau|) exp(1/(4|tau|)) = 2.840,
4.552, 8.265, 14.89` (ratio 0.88 to 0.94). The `l^1` size at the critical line grows like
`exp(1/(4|tau|))` as `tau -> 0-` (MEASURED against the model; not proved as an asymptotic here).

**Obstruction (PROVED from Proposition 3 and CLASSICAL inputs).**
- CLASSICAL (Rodgers-Tao 2020, `Lambda >= 0`): for every `tau < 0`, `H_tau` has non-real zeros.
- So the set of shears at which the prime expansion converges on the critical line is `tau < 0`,
  and at every such shear the conclusion "all zeros real" is false. Any inequality proved from the
  termwise expansion with constants that stay bounded as `tau -> 0-` would hold at some `tau < 0`
  and would be false there. An argument through this expansion needs a bound that degenerates
  exactly at `tau = 0`; the available size is `exp(1/(4|tau|))`, with no margin.
- The expansion uses the coefficients only through absolute values. It holds verbatim for DH,
  every sign twist, `E_a` and T-NR (replace `1` by `a(n)`, `|a(n)| <<_eps n^eps` or `n^a`).
  Multiplicativity enters only in rewriting the `p`-part as `sum_k (V_p^tau)^k`, an identity.
- The horizontal transport of Lemma 1(d) is therefore not an R4 step. It moves `H_tau`, not `xi`,
  and it moves it on the side of `tau` where the target statement fails.

This is the Hecke-language form of the HEAT wall (OBSTRUCTION_MAP section 3.6 and G19): `tau = 0`
is the common boundary of (i) the shears where Hecke operators are scalar multipliers, (ii) the
domain of the prime expansion in the shear, and (iii) the shears where the zeros can all be real.
The three facts are consistent and none implies another with an inequality.

No second pivot is taken.

## 7. Requirement flags

| flag | value | evidence |
|---|---|---|
| R1 (all primes jointly, multiplicativity essential) | not established | The only place multiplicativity enters is the identity `c(pm) = lambda_p c(m)` (Lemma 2(a)); there is no inference from it to a zero statement. The leading commutator term has trivial kernel for each single `p` (Lemma 1(c)); nothing is characterised jointly. |
| R2 (height-uniform, every window) | not established | No inequality in `t` is produced. Lemma 2 is a kernel-side `L^2` identity. |
| R3 (fails for every control at a structural step) | not established; refuted for this mechanism | Completely multiplicative sign twists, the unimodular twist, `zeta(s + 0.3)` and Beurling pass every step (section 4 table). T-NR fails at one prime only. |
| R4 (reaches the critical line) | not established | `w_4` gives evenness only (5.2). The sheared expansion reaches the line only for `tau < 0`, where the conclusion is false (section 6). |

## 8. Three weakest steps

1. Reading of "bridge shear". This note takes the shear to be the Gaussian multiplier `G_tau`
   (the Heisenberg shear of G19 / the HEAT control), which is the reading under which "Hecke
   operators act as scalar multipliers only at `tau = 0`" is a true statement, and treats the real
   shift `w` of g-torus-modular as the `E_w` control. If the lead meant a third object (theta at
   `Re tau_mod != 0` off the arc, with the full `T(p^2)`), that object was not computed here; only
   the referee equivalence `T(p^2)`-eigen iff `c(pm) = c(m)` is cited for it.
2. Numerics are float64 on a finite window with four `tau` values; fitted orders for non-even
   kernels scatter in 0.7 to 1.2, and degree-2 defects are under-resolved for `p >= 17`. The
   conclusions rest on Lemma 2, whose proof is elementary, and the numerics agree with its
   leading coefficient to 4 digits only for the zeta kernel. The proof of absolute convergence in
   Proposition 3(a) has no explicit constants; the growth rate
   `exp(1/(4|tau|))` is measured against a model.
3. The obstruction in section 6 excludes arguments whose constants are bounded as `tau -> 0-`. It
   does not exclude an argument that uses the expansion at `tau < 0` together with a quantitative
   zero-motion law back to `tau = 0`; that is the `Lambda` programme, where no converse from the
   flow to zero location is known (OBSTRUCTION_MAP 6 item 12), and it was not examined here.

## 9. Files

- `defect.py`, `defect.log`, `defect.json`: decisive test (13 kernels, 15 primes, 5 shears).
- `sigma_check.py`: `sigma_kappa` and the first-order coefficient check.
- `transport2.py`, `transport.log`, `transport.json`: Lemma 1(d), Proposition 3, coefficient chain.
- `transport_mp_partial.log`: two rows of Proposition 3 from the stopped mpmath run.
No server job was started; all runs were local under `scripts/memcap.sh 8`.
