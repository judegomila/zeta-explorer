# c17-u6f-isogenous-points-norm-jensen-gap: non-linear reads of the complex isogenous points of theta under T_{p^2}

Date: 2026-11-19 (campaign round 17). Kind: deepen (cell U6 (f) of `c16-qa-filter-silent-cells-geometric-nodes`, map row G33).
Nothing here proves or refutes RH, no bound moves, and no statement about zeros of zeta is made.
Labels: PROVED (in this note, elementary), CLASSICAL (cited from memory), MEASURED (python-flint ball arithmetic; signs
reported are certified by balls at the grid points; quadrature values are ball-enclosed sums of a trapezoid rule whose
discretisation error is estimated, not enclosed), ARGUED, OPEN.

## 0. Verdict

**Precise obstruction; cell U6 (f) is closed for the three reads (N), (J), (D).** For theta the three non-linear reads
of the `p^2 + p - 2` complex isogenous points do not contain the complex points any more:

- **(N)** the norm is `N_p(x) = theta(x)^(p^2+p) / (theta(x/p^2) theta(p^2 x))` (Lemma N, PROVED; checked at 200 points
  for five primes to relative error below 1e-300). `log N_p` lies in the dilation module of `log theta`; its Mellin
  transform is `(p^2 + p - p^(2u) - p^(-2u)) G(u)`, `G(u) = pi^(-u) Gamma(u) zeta(u) zeta(u+1) (2 - 2^(-u)) (1 - 2^(1-u))`:
  a multiplier of T-NR shape (zeros on `Re u = +-arccosh((p^2+p)/2)/(2 log p)`, outside `0 <= Re u <= 1`) times the
  transform of `log theta` of lane n3. A module identity.
- **(J)** `J_p >= 0` is false. `J_p(x) < 0` for every `x > 0` and every odd prime `p`, with `J_p -> log(p/(p+2))` as
  `x -> 0` (Lemma J, PROVED in four lines from the sum identity, the norm identity and monotonicity of theta on the arc).
  It is not an inequality beyond the sum relation in the sense asked: it follows from two identities and `theta' < 0`.
  The Epstein control `theta(x) theta(n x)`, `n = 5, 6` (class number 2), satisfies both identities and `J_p < 0` at
  every prime inert in `Q(sqrt(-n))` (PROVED; measured at `p = 11, 13` for `n = 5` and `p = 13` for `n = 6`). At a
  fixed prime a control passes the read. The Mellin transform of `J_p` contains `zeta(u) zeta(u+1)` only as the
  additive term `-(1/n) (p^2 + p - p^(2u) - p^(-2u)) G(u)`; the other term, `M[log A_p]`, decays like `exp(-phi_p |t|)`
  with `phi_p = 1.375 .. 1.425 < pi/2` (MEASURED), so the zeta term is `10^(-15)` (p = 3) to `10^(-10.4)` (p = 13) of
  `M[J_p]` at `|t| = 200` on all six lines computed.
- **(D)** the sign of the discriminant is `(-1)^((p+2)(p-1)/2)` or `D = 0` for every function with real Fourier
  coefficients (Lemma D, PROVED: the points come in conjugate pairs). Measured for theta, both twins and both Epstein
  forms: parity at every decided grid point. Every real control passes.

Registered outcome: "a twin or a module identity passes each read (map row; cell closed)". The twins of row G33 pass
(D) and the positivity of (N), satisfy the sum identity and fail the norm identity; `J < 0` fails for them at `p = 3`
(both twins) and `p = 11` (twin with the G33 constant), certified signs. The literal wording of the second registered
outcome ("an inequality no control passes at a named step") is not claimed: `J_p < 0` is a corollary of identities
with no stated consequence, the Epstein control passes it prime by prime, and four controls of the assignment are not
formulable here (section 4). No pivot is taken: the adjacent reads (elementary symmetric functions of the point values
of degree at least 3) are modular forms of level `4 p^2` outside the dilation module with no candidate inequality.

## 1. Plan

New relative to the sources: row G33 closed linear reads, dilation-covariant quadratic forms, single points and the
second moment, and left "a functional of the unsummed complex points that is neither linear nor a second moment".
Cell U6 (f) named the input: an inequality among the point values that uses the Hecke correspondence beyond
`R_p + C_p = 1 + 1/p`. This lane takes the three candidate reads of the assignment, proves the first lemma, runs the
controls and the decisive test on the server, and computes the Mellin transform of (J).

Conventions. `theta(tau) = sum_n e(n^2 tau)`; arc `tau = i x/2`, `theta(x) = sum_n exp(-pi n^2 x)`. Complex
isogenous points of `T_{p^2}` at `tau` on the arc (row G33, Lemma 1): family 1, `(tau + b)/p^2`, `b = 1..p^2 - 1`;
family 2, `tau + b/p`, `b = 1..p - 1`; `n = p^2 + p - 2` points with values `v_j`. Reads:
`N = prod v_j`; `A = (1/n) sum v_j`; `J = log|A| - (1/n) sum log|v_j|`; `D = prod_{i<j} (v_i - v_j)^2`.
Mellin transform in this note: `M[g](u) = int_0^inf g(x) x^(u-1) dx` (so `u = s/2` in the convention of row G33;
`zeta(u)` has its critical line at `Re u = 1/2`).

## 2. Lemmas

**Lemma N (PROVED; the eta-quotient norm formula is CLASSICAL).** Write `L = log theta = sum_m c(m) e(m tau)` on the
upper half-plane (theta has no zero there; Jacobi triple product). By lane n3, `sum c(m) m^(-u) =
zeta(u) zeta(u+1) (2 - 2^(-u)) (1 - 2^(1-u))`, so `c = sigma_{-1} * phi_2` with `phi_2` supported on `{1, 2, 4}`. For
odd `p`, `sigma_{-1}(p m) = (1 + 1/p) sigma_{-1}(m) - (1/p) sigma_{-1}(m/p)` gives
`c(p m) = (1 + 1/p) c(m) - (1/p) c(m/p)`, hence

    sum_{b mod p} L((tau + b)/p) = (p + 1) L(tau) - L(p tau),      prod_{b mod p} theta((tau+b)/p) = theta(tau)^(p+1) / theta(p tau).

Applying it twice and once at `p tau`:

    family 1 with b = 0 included:  prod_{b mod p^2} theta((tau+b)/p^2) = theta(tau)^(p^2+p+1) / theta(p tau)^(p+1),
    family 2 with b = 0 included:  prod_{b mod p} theta(tau + b/p)     = theta(p tau)^(p+1) / theta(p^2 tau).

Removing the two real points (`theta(x/p^2)` and `theta(x)`), the factors `theta(p tau)^(p+1)` cancel:

    N_p(x) = theta(x)^(p^2+p) / ( theta(x/p^2) theta(p^2 x) ),     log N_p = (p^2 + p - D_{p^-2} - D_{p^2}) log theta.

Mellin transform (convergent for `Re u > 0` after the usual treatment of `-(1/2) log x` at 0; `M[g(l x)] = l^(-u) M[g]`):

    M[log N_p](u) = (p^2 + p - p^(2u) - p^(-2u)) G(u),   G(u) = pi^(-u) Gamma(u) zeta(u) zeta(u+1) (2 - 2^(-u)) (1 - 2^(1-u)).

The multiplier is `-(2 cosh(2u log p) + c')` with `c' = -(p^2 + p)`; since `(p^2+p)/2 > cosh(2 log p)`, its zeros have
`|Re u| > 1`. This is the additive Hecke relation on `log theta`: an identity in the dilation module of `log theta`,
equivalent to multiplicativity of `sigma_{-1}` at `p`. MEASURED: the four product identities hold at 200 points
`x in [1e-3, 1e3]` for `p = 3, 5, 7, 11, 13` with relative error below `1e-300` (1536 bits); the quadrature of the
second difference of `(log N_p)/n` agrees with the formula at 2406 values of `u` per prime
(`Re u in {0.15, 0.25, 0.3, 0.35, 0.5, 0.7}`, `0 <= t <= 200`, step 0.5) to relative error at most `1.9e-156`.

**Sum identity (row G33, restated without Hecke weights; PROVED).**
`sum v_j = (p^2 - 1) theta(x) - theta(x/p^2) + p theta(p^2 x) =: n A_p(x)`. Checked with Lemma N in the same runs.

**Lemma J (PROVED).** Put `beta = theta(x/p^2)/theta(x)`, `gamma = theta(p^2 x)/theta(x)`. Then

    J_p(x) = log( (p^2 - 1 - beta + p gamma)/n ) + (log beta + log gamma)/n.

(i) `1 < beta < p` and `1/p < gamma < 1` (theta decreasing on the arc; `theta(x/p^2) = p x^(-1/2) theta(p^2/x) <
p x^(-1/2) theta(1/x) = p theta(x)`). (ii) The right side increases in `gamma`, so `J_p < psi(beta)` with
`psi(beta) = log((n + 1 - beta)/n) + (log beta)/n`. (iii) `psi(1) = 0` and
`psi'(beta) = (n+1)(1 - beta) / (n beta (n + 1 - beta)) < 0` for `1 < beta < n + 1`. Hence `J_p(x) < 0` for all `x > 0`.
Limits: `J_p -> 0` as `x -> inf`; `beta -> p`, `gamma -> 1/p` and `J_p -> log(p/(p+2))` as `x -> 0`.
Inputs used: the sum identity, the norm identity, `theta' < 0`. No further property of theta enters.
MEASURED: `J_p < 0` certified at 200 of 200 points for the five primes; `J_p(1e-3)` = -0.510826, -0.336472, -0.251314,
-0.167054, -0.143101 against `log(p/(p+2))` = -0.510826, -0.336472, -0.251314, -0.167054, -0.143101.

Corollary (PROVED). Let `f > 0` be decreasing on the arc, with real coefficients, satisfying the sum identity and the
norm identity with the same exponents, and `f(x/p^2) < p^2 f(x)`. Then `J_p < 0` (possibly `-inf`): if the sum
`S = p^2 - 1 - beta + p gamma` is positive the proof above applies; if `S <= 0` then `|S| < 1` and
`J_p < -log n + (2 log p)/n < 0`. `f = theta(x) theta(n x)` with `p` inert in `Q(sqrt(-n))` and `p` not dividing `2n`
satisfies all hypotheses: `p | a^2 + n b^2` forces `p | a, b`, which gives `U_{p^2} f = f` and
`sum_b f(tau + b/p) = p f(p^2 tau)`; the norm identity holds because `log f = (1 + D_n) log theta`.

**Lemma D (PROVED).** Let `f` have real Fourier coefficients, so `f(-conj z) = conj f(z)`. The complex points come in
pairs `b, -b` (`p` odd) with conjugate values. Then
`D = prod_{pairs} (v - conj v)^2 * prod_{other} |v_i - v_j|^2 = (-4)^(n/2) prod Im(v)^2 * (positive)`:
`sign D = (-1)^(n/2)`, `n/2 = (p+2)(p-1)/2`, unless a point value is real or two values coincide, where `D = 0` without
change of sign. The sign read of (D) is a parity count and does not depend on `f`. `N = prod |v|^2 >= 0` by the same
pairing.

**Mellin transform of (J) (PROVED identity; decay statement ARGUED + MEASURED).**
`M[J_p](u) = M[log A_p](u) - (1/n)(p^2 + p - p^(2u) - p^(-2u)) G(u)` for `Re u > 0` (double poles at `u = 0` cancel;
`J_p -> log(p/(p+2))` leaves a simple pole). `zeta` enters at the arguments `u` and `u + 1`: for `0 < Re u < 1` the
first is inside the strip. It enters additively. `A_p` is a combination of dilates of theta with zeros in the open
right half-plane of `x` (winding count along rays, float: none for `arg x <= 1.35`, first zero in `1.35 < arg x < 1.40`
for `p = 3, 5`, in `1.40 < arg x < 1.45` for `p = 7`, near `|x| = 0.87 .. 0.93`); `log theta` is analytic in the whole
half-plane. Hence `M[log A_p](sigma + it)` decays like `exp(-phi_p |t|)`, `phi_p` the argument of the first zero, and
`G` like `exp(-pi |t|/2)`. `J_p < 0` gives, by Bochner, that `t -> -M[J_p](sigma + it)` is positive definite for each
`sigma > 0`: a cone read of a positive function on the arc (closed family, STRATEGY 3.1 item 4 as cited in row G33).

## 3. Decisive test (server)

Runs: `rhrun` units `rh-c17u6f-grid-1120003902` (4 cores, 6 GB), `rh-c17u6f-gridx-1120004101` (4 cores, 6 GB),
`rh-c17u6f-mellin-1120004433` (8 cores, 10 GB); all finished, none left running. Code `job.py`; outputs
`grid_*.json`, `mellin_*.json`; tables `grid_summary.txt`, `mellin_summary.txt`. Grid: 200 points,
`x = 10^(-3 + 6k/199)`, 1536 bits. Functions: theta; twin G33 `g = (q^(-1/2) D_{q^-2} + q^(1/2) D_{q^2} + c) theta`
with `c = -(q^(3/2) + q^(1/2))`; twin with `c = -2.2` (extra zeros inside the strip); Epstein `theta(x) theta(5x)`,
`theta(x) theta(6x)`. For the twins `q = 3` (`q = 5` when `p = 3`) and the points are taken at `b q^2` (the twin has
period `q^2`). The twin at the same prime `q = p` has no well-defined set of points with these representatives and
was not run.

Sign patterns over the 200 points (`+a -b`: run lengths along increasing x; all signs certified by balls):

| function | p | sum id. | norm id. (max log defect) | sign N | sign A | sign J | max J | sign D (decided points) |
|---|---|---|---|---|---|---|---|---|
| theta | 3, 5, 7, 11, 13 | holds | holds (< 1e-300) | + | + | -200 | < 0 | parity, 184/168/168/168/168 |
| twin G33 | 3 | holds | fails (4.89) | + | - | -117 +15 -68 | 0.00802 at x = 3.87 | parity, 200 |
| twin G33 | 5, 7, 13 | holds | fails (25.8, 54.7, 242) | + | - | -200 | < 0 | parity, 200 |
| twin G33 | 11 | holds | fails (161) | + | - | -156 +3 -41 | 0.00253 at x = 50.5 | parity, 200 |
| twin c = -2.2 | 3 | holds | fails (2.01) | + | + | -52 +4 -88 +7 -49 | 0.0859 at x = 25.2 | parity, 200 |
| twin c = -2.2 | 5, 7, 11, 13 | holds | fails (53.7 .. 523) | + | + | -200 | < 0 | parity, 200 |
| Epstein n = 5 | 11, 13 (inert) | holds | holds | + | -54 +146, -51 +149 | -200 | < 0 | parity, 184 |
| Epstein n = 5 | 3, 7 (split) | fails (rel. 1.0) | holds | + | + | +97 -103, +90 -110 | 0.275, 0.470 | parity, 184 |
| Epstein n = 6 | 13 (inert) | holds | holds | + | -50 +150 | -200 | < 0 | parity, 184 |
| Epstein n = 6 | 5, 7, 11 (split) | fails (rel. 1.0) | holds | + | + | +94 -106, +92 -108, +91 -109 | 0.401, 0.462, 0.540 | parity, 184 |
| Epstein n = 5, p = 5; n = 6, p = 3 (ramified) | | fails | fails | + | + | -200 | < 0 | parity |

Undecided points of D for theta and Epstein are at the two ends of the grid, where the imaginary parts are below
the working precision. Real-value events (a conjugate pair of point values crossing the real axis, where `D = 0`)
occur between grid points for every function (theta: 1, 7, 27, 105, 145 pairs for the five primes; counted from sign
changes of imaginary parts, not enclosed). Family reads: for theta `J < 0` also for each family separately
(family 2 undecided at the 26 largest x, below precision).

Mellin transform of `J_p` for theta (trapezoid in `log x`, step 0.01, 1100 bits, first difference in `log x` to
remove the limit at 0; agreement between step 0.01 and 0.02 for `t <= 100` better than `1e-68`):

| p | decay rate of abs(M[J]) on t in [150, 200] (pi/2 = 1.5708) | log10 abs(M[J]) at t = 0, 14, 50, 100, 200 (Re u = 0.5) | log10 (zeta term / M[J]) at the same t |
|---|---|---|---|
| 3 | 1.3749 | -0.08, -8.62, -30.66, -60.69, -120.45 | 0.33, -1.23, -2.93, -7.09, -14.93 |
| 5 | 1.3949 | -0.22, -9.00, -31.09, -61.55, -122.18 | 0.48, -0.83, -2.60, -6.14, -13.05 |
| 7 | 1.4065 | -0.31, -8.96, -31.33, -62.05, -123.18 | 0.58, -0.83, -2.48, -5.71, -12.17 |
| 11 | 1.4203 | -0.43, -9.16, -31.62, -62.65, -124.38 | 0.71, -0.65, -2.17, -5.05, -10.93 |
| 13 | 1.4249 | -0.48, -9.36, -31.71, -62.85, -124.78 | 0.76, -0.44, -2.07, -4.85, -10.54 |

The rate is the same on all six lines (`Re u` = 0.15, 0.25, 0.3, 0.35, 0.5, 0.7); the other lines are in
`mellin_summary.txt`. The zeta term dominates only near `t = 0`. For the twins the transform of `J` is carried by the
norm term. Converged cases (step-halving agreement for `t <= 100`): twin G33 at p = 3, 5 (3e-18, 1e-17), decay rates
0.353 and 0.33 to 0.34; twin G33 at p = 7 and twin c = -2.2 at p = 3 (8e-9, 6e-9), decay rates 0.15 to 0.17. Not
converged, and not reported as numbers: twin c = -2.2 at p >= 5 and twin G33 at p = 11, 13 (relative difference 1e-3
to above 1). The slow decay means the twin's point values vanish at complex `x` close to the arc.

## 4. Controls

| control | (N) | (J) | (D) | step |
|---|---|---|---|---|
| T-NR twin of row G33, `c = -(q^(3/2) + q^(1/2))` | positivity passes; identity fails (MEASURED) | sum identity passes; `J < 0` fails at p = 3, 11 (certified signs), holds at 5, 7, 13 on the grid | passes (Lemma D) | fails at the norm identity: `log abs(g)` is not in an additive Hecke module |
| T-NR twin, `c = -2.2` | same | `J < 0` fails at p = 3, holds at 5, 7, 11, 13 on the grid | passes | same |
| Epstein `theta(x) theta(n x)`, n = 5, 6 (row G33 control) | identity passes for p not dividing 2n (PROVED) | passes at inert p (PROVED, Corollary); fails at split p (sum identity fails; `J > 0` for x below about 0.5 to 0.8, MEASURED) | passes | at one inert prime it passes every step; over all primes it fails at the sum identity at split primes |
| NR-q (`q = 1 + sqrt 2`) | not formulable: `theta(tau/q^2)` has no integer period, the set of points depends on the representatives `b`, and the sum over `b` does not project (ARGUED, no run) | - | Lemma D applies to any choice of symmetric representatives | fails at the definition of the points |
| ZQ | no theta realisation: `zeta(s) m(s)` with `m` rational in `s(1-s)` is an integral operator on the arc, not a function with a Fourier expansion on the upper half-plane. Not formulable; no test | - | - | - |
| E_a (real a) | the carrier is a real-analytic Eisenstein series: sum identity holds for `T_p`, no product formula, so the norm identity is not available (ARGUED, no run) | not run | all point values are real, so `D >= 0`: differs from the parity value, by reality and not by arithmetic | fails at the norm identity |
| backward heat | not formulable off the arc (as in row G33; ARGUED) | - | - | - |
| DH, sign twist, unimodular twist, Beurling, phase-rotated transfer operator, theta^w | not run. theta^w satisfies the norm identity with exponents scaled by `w` and fails the sum identity (ARGUED) | | | |

Reading of the table. At a fixed prime, each read is passed by a control or is a module identity: (N) and (D) by
every real control (positivity, parity) and (N) as an identity by Epstein; (J) by Epstein at inert primes. The
conjunction "sum identity at every p and norm identity at every p" is the statement that `f` is a Hecke eigenform
with a product formula; it identifies `f` up to the finite list of such eta quotients and is not an inequality.

## 5. Requirement flags

- **R1 (all primes together, multiplicativity essential): false.** Lemma N uses multiplicativity of `sigma_{-1}` at one
  prime; nothing is used jointly over primes. The joint statement over all `p` is an identification, not a step of an
  argument.
- **R2 (height-uniform, every window): false.** `J_p < 0` is a pointwise statement on the arc; on the Mellin side it
  is positive-definiteness of a transform in which the zeta term is exponentially subdominant in `t`. No statement
  at height `t` is obtained.
- **R3 (every control fails for a structural reason): false.** The twins fail at the norm identity (measured), but
  Epstein passes all three reads at each inert prime (proved), and NR-q, ZQ, backward heat are not formulable; E_a,
  DH and five others were not run.
- **R4 (reach the critical line): false.** `zeta(u)` appears in `M[log N_p]` with `0 < Re u < 1` as a factor of a module
  identity, and in `M[J_p]` as an additive term. No inequality constrains its zeros.

## 6. What is added to the record

1. `prod_{b mod p} theta((tau+b)/p) = theta(tau)^(p+1)/theta(p tau)` and
   `N_p = theta^(p^2+p) / (D_{p^-2} theta * D_{p^2} theta)` on the arc (PROVED; classical in type).
2. `J_p(x) < 0` on the whole arc, limit `log(p/(p+2))` at the cusp (PROVED).
3. `sign D = (-1)^((p+2)(p-1)/2)` for every real function (PROVED).
4. Epstein `n = 5, 6` passes (N), (J), (D) and both identities at inert primes (PROVED), fails at split primes
   (MEASURED).
5. `M[J_p] = M[log A_p] - (1/n)(p^2+p-p^(2u)-p^(-2u)) G(u)`; decay rates 1.375 to 1.425 of the first term (MEASURED).

Proposed map wording (for the record lane; row G33, last clause): "Non-linear reads of the unsummed complex points:
norm = module identity in the dilation module of log theta (multiplier `p^2 + p - p^(2u) - p^(-2u)` on
`zeta(u) zeta(u+1)`); Jensen gap = pointwise function of three dilates, negative by monotonicity, passed by Epstein
at inert primes; discriminant sign = parity of the number of conjugate pairs. Not excluded: symmetric functions of
degree at least 3 of the point values (modular forms of level 4 p^2 outside the module; no candidate inequality)."

## 7. Three weakest steps

1. **Twin point sets.** The twin was evaluated at `q != p` with representatives `b q^2`. The twin of row G33 at the
   same prime (`q = p`) has no canonical set of complex points and was not run; the statement "the twin fails
   `J < 0`" rests on `p = 3` (both constants) and `p = 11` (one constant), certified at grid points only, and the
   twin passes on the grid at the other primes.
2. **Mellin decay and the zeros of `A_p`.** The rates 1.375 to 1.425 are slopes on `t in [150, 200]` of trapezoid sums
   whose discretisation error is not enclosed (step-halving agreement is shown only for `t <= 100`); the location of
   the first zero of `A_p` is a float winding count on eight rays, not an enclosure, and the identification of the
   rate with its argument is argued. Six of the ten twin transforms are not converged.
3. **Controls not run or not formulable.** E_a, DH, sign twist, unimodular twist, Beurling, phase-rotated transfer
   operator and theta^w were not computed; NR-q, ZQ and backward heat are recorded as not formulable on an argument
   without a run. The claim that the Epstein forms `n = 5, 6` have off-line zeros is taken from row G33, not
   re-measured here. Lemma N cites lane n3 for the Dirichlet series of `log theta`; the factorisation is confirmed
   here only through the numerical agreement of `M[(log N_p)/n]` with the formula.

Referee: not started by this lane; see `REFEREE_REQUEST.md`.
