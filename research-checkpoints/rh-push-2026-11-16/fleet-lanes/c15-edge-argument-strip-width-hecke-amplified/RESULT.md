# c15-edge-argument-strip-width-hecke-amplified: the Eisenstein edge argument at a zero inside the strip, with a Hecke amplifier

Date: 2026-11-19. Kind: explore, stage A (paper first), class U1 of `campaign/CHECKPOINT_R14_DRAFT.md`.
Nothing here proves or refutes RH. No zero-free region and no Lambda bound changes. No new statement about zeros
of zeta is made: the one zero-free statement that the device yields (section 3) is weaker than the classical one.
Labels: PROVED (argument written here), CLASSICAL (literature, recalled, not opened in this lane), ARGUED,
MEASURED (mpmath 25 digits or float64, not interval-certified), OPEN.
Runs: `checks.py`, `spectral.py`, `ref_checks.py`, local, each through `scripts/memcap.sh 8` with
`.venv-arb/bin/python`. The server was not used.

## Verdict

**Precise obstruction. The decisive first test kills the idea: the Hecke amplifier changes constants only, and
with the truncation height it needs (T >= N) it changes nothing at all.**

1. Lemma 1 (PROVED from CLASSICAL Maass-Selberg): at a zero `rho = 1 - delta + i gamma` the truncated norm of
   `f = E*(z, rho/2)` is exactly `M(T) = abs(xi(2 - rho))^2 T^delta / delta`, and at `T = 1` the inequality of the
   device is the identity `M(1) = L + S` with `L` the Fourier-coefficient energy in `y > 1` and `S >= 0` the mass of
   `F` below `y = 1`. MEASURED: defect below 4e-11 at the first five zeros.
2. Proposition A (PROVED): for `T >= N` the amplified norm is `M(T)` times a Hermitian form `x* K x` that depends
   on `(gamma, delta)` only; on the truncated series `T_n` acts through dilations of the truncation height. The
   gain `abs(lambda_x)^2 / (x* K x)` is at most `N^delta`, and the amplified inequality is never stronger than the
   unamplified one at `T = 1`. MEASURED: maximal gain between 0.957 and 0.999 times `N^delta` (30 cases).
   For `T < N` the bound on the gain is argued, with one measured case (first zero, `N = 8`, `T = 1`: gain 2.728
   against `N^delta` = 2.828); the lower-bound side for `T < N` was not computed.
3. Width (section 3): the device gives `delta >= c / log^5 gamma` (ARGUED; sieve step and the bound on `zeta'`
   CLASSICAL). The exponent is set by two inputs that the amplifier does not touch.
4. Proposition C (PROVED): with any lower-bound input that is bounded in `gamma`, the inequality of the device is
   implied by absolute convergence alone when `delta >= (log log gamma + C)/log gamma`. No width independent of
   `gamma` can come out.
5. Controls: the non-arithmetic Eisenstein series (EIS-w) passes Lemma 1, Lemma 2 and Proposition A verbatim and
   fails at steps S4 and S5; BLS passes every step that can be written for it.

Score 0. Flags: R1 false, R2 false, R3 false, R4 false (section 7).

## 0. Plan, sources, what is new against the record

Read: BRIEF; `c14-x2-step-catalogue-zero-indexed-objects` section 4 (Proposition E) and entry E7; map rows G26,
G31, G35, D9 and the controls paragraph (Lemma P, BLS, EIS-w); `c14-laxphillips-hecke-norm-outside-l2` (verdict
and Lemma Q); `campaign/CHECKPOINT_R14_DRAFT.md` (class U1 and items (i) to (iv)).

Proposition E (b) records that inside the strip the constant term of `E*(z, rho/2)` keeps one exponent and the
object is not square-integrable. Row G31 records the truncated mass `Y^(2 sigma - 1)/(2 sigma - 1)`. Entry E7
records that the untruncated object is not a term of a spectral side. Not on file before this lane: (a) the
quantitative inequality at a zero with every term explicit; (b) the amplified truncated norm, which exists (the
truncated series is in `L^2`) and is computed here in closed form; (c) the cap of Proposition C.

Pre-filter, on paper, before any work:
- Q-P (is every step S1 to S3 of Lemma P): yes. S1, S2, S3 below are identities or positivity of a norm; S4 is a
  lower bound over a positive proportion of primes (a condition away from any one prime); S5 is a size bound.
  Lemma P then predicts that T-NR passes. It does: section 5.
- Q-B (does the inequality survive a Blaschke factor on the scattering coefficient): the scattering-level part
  (Lemma 1, Proposition A) does, for every scattering function with `phi(s') = 0`. Predicted: BLS passes.
- Q-S (does the target enter linearly or by division): it enters as the one number `abs(xi(2 - rho))^2`, linearly
  in the norm, and through `xi(rho) = 0`.
- Items (i) to (iv) of U1: the step that joins the functional equation and the local data is Lemma 1, an exact
  identity (item (i)); the scattering-level form is stable under Blaschke factors (item (iii)). So the device is
  not a member of class U1: the functional equation enters S1 and S5, the local parameters enter S4, and the two
  are joined by an identity, not by a one-sided step.

The pre-filter predicts closure. The decisive test was run all the same because the assignment asks whether the
amplifier changes the exponent.

## 1. Notation

`Gamma = PSL(2, Z)`, `F` the standard fundamental domain, `d mu = dx dy / y^2`.
`xi(s) = pi^(-s/2) Gamma(s/2) zeta(s)` (no factor `s(s-1)`). `E*(z, s) = xi(2s) E(z, s)` with
`E*(z, s) = xi(2s) y^s + xi(2s - 1) y^(1-s) + 4 sqrt(y) sum_(n>=1) tau_nu(n) K_nu(2 pi n y) cos(2 pi n x)`,
`nu = s - 1/2`, `tau_nu(n) = sum_(ab=n) (a/b)^nu` (CLASSICAL).
Zero: `rho = beta + i gamma`, `delta = 1 - beta > 0`, `s = rho/2`, `nu = (-delta + i gamma)/2`,
`s' = 1 - s = 1/2 + delta/2 - i gamma/2`, `mu0 = s' - 1/2 = -nu`, `t0 = gamma/2`.
`A = xi(rho) = 0`, `B = xi(rho - 1) = xi(2 - rho)` (functional equation), with `Re(2 - rho) = 1 + delta`.
`f = E*(z, rho/2) = B E(z, s')`, `phi(s') = 0`, constant term `B y^(s')`, of modulus `abs(B) y^(1/2 + delta/2)`.
`Lambda^T` = truncation at height `T`: `Lambda^T f = f - E(z | c_0 1_(y>T))`, the subtraction of the
`Gamma`-invariant extension of the constant term above `T`. For `T >= 1` it is the usual truncation on `F`.
`T_n g(z) = n^(-1/2) sum over ad = n, b mod d of g((az+b)/d)`; `T_n f = lambda(n) f`, `lambda(n) = tau_nu(n)`.

## 2. First lemma: the inequality at a zero with every term explicit

**Lemma 1 (PROVED from CLASSICAL Maass-Selberg).** For `T >= 1`,

    ||Lambda^T f||^2 = M(T) := abs(xi(2 - rho))^2 T^delta / delta.                                  (1)

For a general parameter `s = sigma + it` with constant term `A y^s + B y^(1-s)` the relation is
`(abs(A)^2 T^(2 sigma - 1) - abs(B)^2 T^(1 - 2 sigma))/(2 sigma - 1) + Im(A conj(B) T^(2it))/t`; put `A = 0`,
`2 sigma - 1 = -delta`. Also, for `T_1, T_2 >= 1`,

    <Lambda^(T_1) f, Lambda^(T_2) f> = M(min(T_1, T_2)),                                            (2)

because `Lambda^(T_1) f` has zero constant term above `T_1` and the two truncations differ by a function of `y`
supported above `min`.

Lower bound. The strip `{abs(x) <= 1/2, y > 1}` lies in `F`, and there `Lambda^1 f` is the non-constant part of
`f`. By Parseval in `x`:

    L := 8 sum_(n>=1) abs(tau_nu(n))^2 J(2 pi n),   J(a) = int_a^inf abs(K_nu(u))^2 du/u,
    M(1) = L + S,   S = int over F with y < 1 of abs(f)^2 d mu >= 0.                                (I)

So the inequality of the device, `L <= abs(xi(2 - rho))^2 / delta`, is an identity with the explicit non-negative
defect `S`.

Where `xi(2 - rho)` enters. `L` does not contain `B`. `M` is `abs(B)^2/delta`. The inequality is therefore a
lower bound for `abs(xi(2 - rho))` at the point `2 - rho = 1 + delta - i gamma` of the region of absolute
convergence: `abs(xi(1 + delta + i gamma))^2 >= delta L`. Non-vanishing of `xi(2 - rho)` (Euler product) is what
makes `f != 0`; the device asks for more than non-vanishing, namely size.

Sizes. `abs(K_nu(u))^2` carries `e^(-pi gamma/2)` for `u < t0` and is negligible for `u > t0 + O(t0^(1/3))`
(CLASSICAL), so `e^(pi gamma/2) J(a)` is of order `(1/gamma) log(gamma/a)` for `a < t0/2` and the sum runs over
`n <= gamma/(4 pi)`. By Stirling `e^(pi gamma/2) abs(B)^2 = 2 pi^(-delta) (gamma/2)^delta abs(zeta(1 + delta + i gamma))^2 (1 + O(1/gamma))`.
Normalised quantities below carry the factor `e^(pi gamma/2)`.

**Lemma 2 (PROVED; the covering bound is CLASSICAL, Iwaniec, Spectral Methods, Lemma 2.10, not opened).** For
`T >= 1` and `y > 1/T` the function `Lambda^T f` has the non-constant Fourier modes of `f` (a translate
`Im(g z) > T` with `g` outside the stabiliser needs `y < 1/T`). The strip `y > 1/T` covers `F` at most `1 + 10 T`
times. Hence

    8 sum_(n>=1) abs(tau_nu(n))^2 J(2 pi n / T) + abs(B)^2 (T^delta - T^(-delta))/delta <= (1 + 10 T) M(T).   (3)

In normalised form: for every `X >= gamma/(8 pi)`,
`(1/X) sum_(n<=X) abs(tau_nu(n))^2 <= C (8 pi X/gamma)^delta e^(pi gamma/2) M(1)` with an absolute `C` (the Bessel
asymptotics for the constant are ARGUED). The weights are flat in `n`; harmonic weights do not arise, because the
low range `n <= gamma` is seen at one scale only.

MEASURED (`checks.json` P1, normalised by `e^(pi gamma/2)`), actual zeros, `delta = 1/2`, `T = 1`:

| zero | gamma | abs(B)^2/delta = M | L | S (quadrature over F, y < 1) | abs(L + S - M)/M | term n = 1 of L |
|---|---|---|---|---|---|---|
| 1 | 14.1347 | 1.77754 | 1.20859 | 0.56896 | 3.8e-11 | 1.20858 |
| 2 | 21.0220 | 3.22600 | 2.63071 | 0.59529 | 3.2e-11 | 2.60725 |
| 3 | 25.0109 | 4.42347 | 3.27782 | 1.14564 | 3.8e-11 | 2.81851 |
| 4 | 30.4249 | 4.02247 | 3.73284 | 0.28963 | 2.3e-11 | 2.72096 |
| 5 | 32.9351 | 4.41819 | 3.81684 | 0.60135 | 3.2e-11 | 2.78522 |

Hypothetical `delta` (P2): at `1 - delta + i gamma_k` with `delta = 0.3, 0.1, 0.03` the point is not a zero; the
general Maass-Selberg value `M_gen` satisfies `M_gen = L + S` (defect 3.7e-11 at `gamma_1`), and the value
`M_hyp = abs(B)^2/delta` that a zero there would give exceeds `L` in all 15 cases (ratio `M_hyp/L` from 1.11 to
6.7): no contradiction at these parameters. Lemma 2 (`ref_checks.json` R1): strip total over `M(T)` is 0.68, 2.85,
4.60 at `T = 1, 2, 4` (zero 1) against the bounds 11, 21, 41.

## 3. What width the inequality gives

Steps of the device, in order:

- S0. Object: `f = E*(z, rho/2) = B E(z, s')` with `phi(s') = 0`.
- S1. Identity (1). Reads: the functional equation (`xi(rho - 1) = xi(2 - rho)`), the zero (`A = 0`).
- S2. Positivity of a norm on part of the surface: (I) and (3).
- S3. Bessel weights: flat mean of `abs(tau_nu(n))^2` over `n <= X`, any `X >= gamma/(8 pi)`, at cost `(X/gamma)^delta`.
- S4. A lower bound `l` for that flat mean, proved without reference to the zero. Reads: the prime-indexed
  coefficients `tau_nu(p) = p^nu + p^(-nu)` and that `p -> p^(i gamma)` is a smooth function of `p`.
- S5. An upper bound for `abs(B)` from the zero: `1 + delta + i gamma` and `rho` are `2 delta` apart on a
  horizontal segment, so `abs(zeta(1 + delta + i gamma)) <= 2 delta sup abs(zeta')`. Reads: SIZE.

Output: `l <= C (X/gamma)^delta (gamma/2 pi)^delta abs(zeta(1 + delta + i gamma))^2 / delta <= C' gamma^(O(delta)) delta sup abs(zeta')^2`.

S4 in detail (ARGUED). Hecke relations alone do not give a flat lower bound better than `X^(-1/2)`: for the
completely multiplicative parameters `alpha_p = i p^(-delta/2)` one has `tau(p) = 0`, the coefficient is supported
on squares and the flat mean is of order `X^(-1/2)`; the recursion from `abs(tau(p))^2 + abs(tau(p^2))^2 >= 1/2`
reproduces the same exponent. A bound of size `1/log X` needs the archimedean form of the parameter:
`abs(tau_nu(p))^2 >= p^(-delta) (2 + 2 cos(gamma log p)) - O(delta log p)`, and the primes `p <= X = gamma^2`
with `cos(gamma log p) < -1 + eps` lie in intervals of relative length `sqrt(eps)/gamma`, whose prime count is
bounded by Brun-Titchmarsh (CLASSICAL) by a small proportion. This gives `l >= c / log gamma` at `X = gamma^2`
for `delta <= 1/log gamma`.
S5 with `zeta'(sigma + it) << log^2 t` for `sigma >= 1 - 1/log t` (CLASSICAL): `c/log gamma <= C delta log^4 gamma`.

**Width (ARGUED): `delta >= c / log^5 gamma`.** Source form: Sarnak, "Nonvanishing of L-functions on Re(s) = 1"
(2004) states `abs(zeta(1 + it)) >> (log t)^(-3)` by this method; relative to source, not opened. The classical
width is `c/log gamma`, and `c (log gamma)^(-2/3) (log log gamma)^(-1/3)` by Vinogradov-Korobov. The device is
weaker than both.

The exponent has two sources: the size of `l` (S4) and the size of `sup abs(zeta')` (S5). Neither is a statement
about the norm of `Lambda^T f`.

## 4. Decisive first test: the Hecke-amplified norm

Amplifier: `A_x = sum_(n<=N) x_n T_n`, `lambda_x = sum x_n lambda(n)`, vector `A_x Lambda^T f`.

**Proposition A (PROVED from (2) and the CLASSICAL action of `T_n` on incomplete Eisenstein series).**

(a) `T_m` commutes with `psi -> E(z | psi)`, with `(T_m psi)(y) = m^(-1/2) sum_(ad=m) d psi(ay/d)`. Applied to
`psi = B y^(s') 1_(y>T)`:

    T_m Lambda^T f = sum_(ad=m) (a/d)^(mu0) Lambda^(T d/a) f.                                       (4)

On the truncated series a Hecke operator is a combination of truncations at the dilated heights `T d/a`. (Same
structure as row G26 and `c14-laxphillips` Lemma Q: on the Eisenstein channel `T_n` is a function of the dilation.)

(b) For `T >= N` all heights are at least 1, and by (2)

    ||A_x Lambda^T f||^2 = M(T) x* K x,
    K(m, n) = sum_(ad=m) sum_(a'd'=n) (a/d)^(mu0) conj((a'/d')^(mu0)) min(d/a, d'/a')^delta.          (5)

`K` depends on `(gamma, delta, N)` only. `abs(B)^2` and `T` factor out. The same form is the norm of the step
profiles `sum_m x_m sum_(ad=m) (a/d)^(mu0) y^(s') 1_(y <= T d/a)` in `L^2((0, inf), dy/y^2)`.

(c) `x* K x >= N^(-delta) abs(lambda_x)^2` for every `x`. Proof: on `0 < y <= T/N` every indicator in the profile
equals 1, so the profile is `lambda_x y^(s')` there, and `int_0^(T/N) y^(delta - 1) dy = (T/N)^delta/delta`.
So the gain `G(x) = abs(lambda_x)^2 / (x* K x)` is at most `N^delta`.

(d) Lower-bound side. For `T >= N` the profile of `A_x psi` is supported in `y > T/N >= 1`, so in `y > 1` the
non-constant modes of `A_x Lambda^T f` are `lambda_x` times those of `f`, and the constant mode is
`lambda_x B y^(s')` for `1 < y <= T/N`. Hence

    M(T) x* K x >= abs(lambda_x)^2 [ L + abs(B)^2 ((T/N)^delta - 1)/delta ],
    i.e.  L <= (abs(B)^2/delta) [ 1 + T^delta ( x* K x / abs(lambda_x)^2 - N^(-delta) ) ].            (6)

By (c) the bracket is at least 1. **For every amplifier and every `T >= N`, inequality (6) is implied by (I).**
The amplified inequality is never stronger than the unamplified one; not in the exponent, not in the constant.

(e) Spectral form, valid for all `T >= 1` and all `N` (PROVED from CLASSICAL: `Lambda^T f` is orthogonal to cusp
forms; Maass-Selberg with two parameters):

    ||A_x Lambda^T f||^2 = (1/4 pi) int abs(c(t))^2 abs(sum x_n tau_(it)(n))^2 dt + (3/pi) abs(<Lambda^T f, 1>)^2 abs(sum x_n tau_(1/2)(n))^2,
    c(t) = B T^(mu0) [ T^(-it)/(mu0 - it) + phi(1/2 - it) T^(it)/(mu0 + it) ],   <Lambda^T f, 1> = B T^(s'-1)/(s'-1).

The spectral measure of `Lambda^T f` is two Lorentzians of half-width `delta/2` at `t = -t0, +t0` (Poisson
kernels at the point `t0 + i delta/2`), plus a cross term carrying `phi` on the unitary line of relative size
`O((delta/gamma) log(gamma/delta))`, plus the constant function. The amplifier asks `t -> sum x_n tau_(it)(n)`,
a function of exponential type `log N`, to be large at `t0 + i delta/2` and small on the real axis near `t0`:
the ratio is at most `e^(type x height) = N^(delta/2)` in modulus. This is (c) again and it shows where the
bound comes from: the eigenvalue of the non-tempered parameter exceeds the tempered ones by `n^(delta/2)` only.
For `T < N` the cross term does not vanish; its size bounds the change of the gain by a relative
`O(N^delta (delta/gamma) log gamma)` times `(sum abs(x_n) d(n))^2 / abs(lambda_x)^2` (ARGUED).

Why an amplifier cannot help here, in one sentence: an amplifier isolates one term of a spectral sum of
non-negative terms; here the vector is one explicit vector whose norm is known exactly by (1), and the loss of the
device is in S4 and S5, which are not statements about that norm.

Answer to the test. With `delta <= c_1/log gamma` (the range where the device says anything, Proposition C) and
`N <= gamma^k`, `N^delta <= e^(c_1 k)`: constants only. To move the exponent by `log^j gamma` the amplifier needs
`N^delta >= log^j gamma`; then `T >= N` costs `T^delta = N^delta` in `M(T)` and (6) shows the two cancel exactly.

MEASURED.
- `checks.json` P3: first five zeros, `delta = 0.5` (actual), `0.1`, `0.03` (hypothetical), `N = 8, 32`; `K` from
  (5) at 25 digits; maximal gain `lambda* K^(-1) lambda`. All 30 cases: `max G / N^delta` between 0.9567 and
  0.9990, never above 1. Example: zero 1, `delta = 0.5`, `N = 32`: 5.4586 against 5.6569; zero 5, `delta = 0.03`,
  `N = 32`: 1.10846 against 1.10957. `K` Hermitian to 2e-25, smallest eigenvalue positive (5.9e-4 to 6.6e-2).
- `spectral.json` (zero 1, `N = 8`, float64, 38,536 quadrature nodes to height 1200). At the actual zero
  (`delta = 0.5`): the spectral Gram of (e) at `T = N` agrees with (5) to relative 3.6e-4 (the tail of the
  integral, of this size, is not added); at `T = 1` the total mass is `1/delta` to 1.3e-4 and the maximal gain is
  2.7283, against 2.7098 for `T >= N` and `N^delta = 2.8284`. So at `T = 1 < N` the gain is larger than at
  `T >= N` by 0.7 per cent and stays below `N^delta`. The rows `delta = 0.1, 0.03` of that file are formal:
  formula (e) omits the terms with `phi(s')`, which vanish only at a zero, so at a hypothetical `delta` it
  describes no automorphic function; its mass misses `1/delta` by 6e-3 and 2.5e-3 and its "gain" (1.2296, 1.0646
  against `N^delta` = 1.2311, 1.0644) is not a check. They are kept in the file and not used. (The quadrature
  grid itself integrates the two Lorentzians to 1e-11; the misfit is the missing terms.)
- `ref_checks.json` R2: see section 8.

## 5. Proposition C: no width independent of the height

**Proposition C (PROVED, given Lemma 1, Lemma 2 and Stirling).** Let the lower-bound input of S4 satisfy
`l <= C_0` for all `gamma` (the inputs on file satisfy `l <= 1`). The inequality of the device at scale
`X >= gamma/(8 pi)` reads `l <= C (X/gamma)^delta M'`, `M' = e^(pi gamma/2) abs(xi(1 + delta + i gamma))^2/delta`.
For every `gamma` and every `delta > 0`, zero or not,

    abs(zeta(1 + delta + i gamma)) >= zeta(2 + 2 delta)/zeta(1 + delta) >= c delta          (absolute convergence),
    so  M' >= c' delta (gamma/2 pi)^delta.

Hence the inequality holds, with no hypothesis, as soon as `delta gamma^delta >= C_0/(C c')`, in particular for
`delta >= (log log gamma + C_1)/log gamma`. In that range the device cannot contradict a zero: its inequality is
true at every point of the strip and for every Dirichlet series with an Euler product of unimodular or smaller
local parameters. The set of `(delta, gamma)` the device can exclude lies inside
`delta < (log log gamma + C_1)/log gamma`.

To exclude a zero at fixed `delta` the input `l` would have to be of size `delta gamma^delta`. By (I) and the
Rankin-Selberg asymptotics at a zero (row G35: one pole, at `w = 1 + delta`, residue proportional to
`abs(zeta(1 + delta + i gamma))^2 zeta(1 + 2 delta)`), that is the true size of the mean at a zero: such an `l`
is the main term itself, and (I) with it is the identity `M = L + S`.

MEASURED (`ref_checks.json` R3): the lower bound `m(delta, gamma)` on `M'` from absolute convergence; see section 8.

## 6. Controls

Named steps as in section 3.

| control | outcome | step |
|---|---|---|
| EIS-w (Eisenstein series of a non-arithmetic cofinite group at a zero `s'` of `phi`, `Re s' = 1/2 + eta`) | passes S0, S1, S2 and Proposition A verbatim: (1), (2) use only `phi(s') = 0`; the family of combinations of truncations at dilated heights in (4) exists for every group, and (5), (c), (6) hold for it with `delta = 2 eta`. Fails at S4 (no formula `p^nu + p^(-nu)` for the coefficients, no lower bound `l` relative to the constant-term coefficient) and at S5 (the constant-term pair is `(1, phi)`: no single function of bounded derivative takes the two values at points `2 delta` apart, which for zeta is the shift-by-one rule with the functional equation). The conclusion (a width) is false for it relative to Phillips-Sarnak deformation theory (resonances at distance `O(eps^2)` from the unitary axis at bounded height; CLASSICAL-rel, not opened) | S4, S5 |
| BLS (Blaschke factor on the scattering coefficient) | the scattering-level content is (1), (2), (5), (c) and the spectral form (e): all hold for every unitary `phi` with `phi(s') = 0` (PROVED: none of them reads anything else). S2, S3, S4 are not formulable (no Fourier coefficients). BLS passes every step that can be written for it; this is row D9 again | not formulable from S2 on |
| T-NR | as a scattering function with `c > 2`: a member of BLS, same line. As a Dirichlet series: no Eisenstein series. Its extra zeros lie on `Re s = 1/2 +- b`, at fixed distance `1/2 - b` from the edge, outside the range of Proposition C: the conclusion of the device is true for it and the device is silent there. Lemma P predicted a pass (Q-P) | none (passes; conclusion true) |
| E_a = `zeta(s + a) zeta(s - a)` | the device relative to its edge `Re s = 1 + a` is the device for zeta shifted; conclusion true | none (passes; conclusion true) |
| DH | no Hecke eigen-object and no Eisenstein series with this constant term: not formulable at S0. It has zeros right of 1, so it would also fail the statement `B != 0` of S1 | S0 |
| sign twists, U, THIN | no automorphic object (S0); the Dirichlet-series shadow of S4 fails for the parameters `alpha_p = i` (section 3) | S0, S4 |
| backward heat, theta^w, phase-rotated transfer operator, Beurling | not formulable at S0; not run | - |

No control passes every step of the full device, because S4 and S5 are specific. But the part of the device that
the assignment adds (the amplified norm) is passed verbatim by EIS-w and by BLS, and the conclusion that the
specific steps give is the classical kind of width, true for T-NR and E_a. The device is closed by the test of
section 4 and by Proposition C, not by a control.

## 7. Requirement flags

| requirement | flag | evidence |
|---|---|---|
| R1 (all primes together, multiplicativity essential) | false | The amplifier, which carries the joint eigen-relation, is shown inessential (Proposition A (d)). Multiplicativity enters S4 only through the coefficients at primes, and Hecke relations alone give `X^(-1/2)` there; the usable bound reads the archimedean smoothness of `p^(i gamma)` |
| R2 (height-uniform, every window) | false | Width `c/log^5 gamma` (ARGUED); Proposition C caps any version at `(log log gamma + C)/log gamma` |
| R3 (fails for every control for a structural reason) | false | EIS-w fails at S4 and S5 (named). BLS passes every formulable step; T-NR and E_a pass with a true conclusion; five controls are not formulable. Not established for every control |
| R4 (reaches the critical line) | false | The inequality is a statement at distance `o(1)` from `Re s = 1`; for `delta >= (log log gamma + C)/log gamma` it is implied by absolute convergence |

Not a statement about zeros of zeta beyond a width weaker than the classical zero-free region.

## 8. Second pass (same agent, separate code; not an independent referee)

File `REFEREE.md`. An independent referee could not be started from this lane (no agent-launch tool in this
session); the debt is recorded in the lane line. Checks rerun with different code paths (`ref_checks.py`):
Lemma 2 by `mp.quad` instead of Gauss-Legendre panels; the amplified norm by piecewise integration of the step
profile instead of formula (5), on 40 amplifiers per case (one trivial, 39 complex Gaussian); the table of
Proposition C. Results are in `REFEREE.md`.

## 9. Closed device row (proposed text for the map; this lane does not edit the map)

| id | device | outcome | status | controls | source |
|---|---|---|---|---|---|
| G37 (proposed) | Quantitative Eisenstein edge argument at a zero inside the strip: truncated norm of `E*(z, rho/2)` against the Fourier-coefficient energy, with a Hecke amplifier `sum x_n T_n` on the truncated series (campaign round 15; class U1 as posed) | At `xi(rho) = 0`, `delta = 1 - beta`: `norm^2 = abs(xi(2 - rho))^2 T^delta/delta` exactly, and at `T = 1` the inequality is the identity `M = L + S`. On the truncated series `T_m = sum_(ad=m) (a/d)^(mu0) Lambda^(T d/a)`: a combination of dilated truncations. For `T >= N` the amplified norm is `M(T) x*Kx` with `K` a function of `(gamma, delta)`; gain at most `N^delta`; the amplified inequality is implied by the unamplified one. Width from the device: `c/log^5 gamma` (argued), set by the sieve lower bound for the divisor-type mean and by `sup abs(zeta')`. With a bounded lower-bound input the inequality follows from absolute convergence for `delta >= (log log gamma + C)/log gamma`. Not a member of U1: the functional equation and the local data are joined by an identity. Not covered: amplifiers with `T < N` on the lower-bound side (Fourier modes of truncations at heights below 1); a lower bound of size `delta gamma^delta` for the divisor-type mean (the main term itself) | PROVED (Lemma 1, Lemma 2, Proposition A (a)-(d), Proposition C); width ARGUED; `T < N` gain MEASURED at one zero; one same-agent second pass, no independent referee | EIS-w and BLS pass the amplified-norm part verbatim; EIS-w fails at the coefficient lower bound and at the size bound for the constant term; T-NR, E_a pass with a true conclusion; DH and sign twists not formulable | `c15-edge-argument-strip-width-hecke-amplified` |

## 10. Three weakest steps

1. Section 3, S4 and the width `c/log^5 gamma`: argued, with Brun-Titchmarsh and the bound on `zeta'` recalled and
   Sarnak's paper not opened. The exponent 5 is this lane's count and may differ from the source. The verdict does
   not depend on the exponent: Proposition A and Proposition C do not use S4.
2. Proposition A for `T < N`. Parts (b), (c), (d) need `T >= N`. For `T < N` the gain bound rests on the size of
   the cross term in (e) (argued) and on one measured case (`N = 8`, zero 1, actual `delta = 1/2`, agreement
   3.6e-4; no valid measurement at small `delta`, where no zero is available). The lower-bound side for `T < N` (non-constant modes of truncations at heights below
   1, which involve Ramanujan-type sums linear in `B`) was not computed. What is proved covers it only through the
   remark that the norm is known exactly in every case, so the only loss to recover is `S/M` (measured 7 to 32
   per cent at the first five zeros), a constant.
3. Proposition C assumes `l <= C_0`. This holds for every input on file, but it is a hypothesis on the input, not
   a theorem about all conceivable lower bounds; the text after the proposition (an input of size
   `delta gamma^delta` is the main term) is argued from row G35, whose Rankin-Selberg asymptotics at scale
   `X ~ gamma^2` were not checked here. The EIS-w line also rests on Phillips-Sarnak theory, not opened.

## Files

`RESULT.md`, `REFEREE.md`, `checks.py`, `checks.log`, `checks.json`, `spectral.py`, `spectral.log`,
`spectral.json`, `ref_checks.py`, `ref_checks.log`, `ref_checks.json`.
