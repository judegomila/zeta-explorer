# e1-burgers-cascade-anticausal: heat-flow evolution of the anticausal Hankel block

Date 2026-11-17. Scope: this directory only. Labels: PROVED (argument given here, author-checked, unrefereed) /
CLASSICAL / MEASURED / ARGUED / OPEN. Nothing here proves or refutes RH; no zero-free region or Lambda bound changes.

## Verdict

**Precise obstruction.** The first decisive test kills the combination as assigned and locates the reason.

1. No unitarily invariant norm of `Gamma_-(t)` is monotone along the heat flow, in either direction (Proposition 2,
   PROVED by the one-pair model; exact and 50-digit witnesses between collisions, including a bare quartet).
2. Strictly monotone functionals of the anticausal data exist (Proposition 3, PROVED):
   `Phi_alpha(t) = sum of Re p over the poles p of S_t in Re z > 0` decreases strictly along the forward flow, for every
   `alpha > 0`, and is continuous through collisions. It is not a norm of `Gamma_-`; it is the real trace of the
   translation generator on the range of `Gamma_-`.
3. Every functional of this kind is forward-decreasing (Proposition 4, PROVED for polynomials): it bounds the value at
   `t = 0` from above by backward-heat values only, and those are not small (row F1). This is the expected stop.
4. Its `t`-derivative is a Burgers flux through a contour (Proposition 5, PROVED; checked to 7.9e-31). On the prime
   side the flux is taken through a line `Re z = X > sigma_0(alpha)`, where it holds for every sign twist; the quantity
   needed is the flux through `Re z = 0+`. The difference is the residue sum over the off-line poles. This is row Q4
   differentiated once in `t`; the Euler product does not enter beyond non-vanishing to the right.
5. Controls: every step holds for DH and `E_a`; nothing in the chain uses multiplicativity. No pivot produced a lever
   (section 7).

## 0. Plan; what is new relative to the map

- Combination: Burgers equation for `L_t = F_t'/F_t` (graph nodes `resolvent-burgers-identity`,
  `cole-hopf-viscous-burgers`) x square-root lane (map section 4 items 11-12, rows Q1-Q7) x prime cascade (item 16,
  rows Q4, Q10) x monotone discriminant (`discriminant-gradient-flow`).
- Not re-run: Q1 (closed form of `Gamma_-` at fixed `t`), Q7 (spectral flow of the index in the two-zero model),
  F1 (escape law), F2 (coefficient cocycle).
- New here: the evolution equations of `S_t` and of the pole data of `Gamma_-(t)`; the sign test of `d/dt` for nine
  functionals over 1e4 configurations; the monotone functional `Phi_alpha` with proof; the direction no-go; the flux
  identity and its prime-side reading.

## 1. Setting and evolution equations

`F` polynomial (or class (H) of `sq-krein-index`) with zero set symmetric under `rho -> -conj rho`; "even" means also
symmetric under `rho -> -rho`. The axis is `Re z = 0`. Flow: `d_t F = (1/4) F_zz` (forward de Bruijn direction;
`z^2 - sigma^2` goes to `z^2 - sigma^2 + t/2`). `L = F'/F`, `D = F + alpha F'`, `N = F - alpha F'`, `S = N/D`,
`M = D'/D`, `W = N'D - N D'`.

**Lemma 1 (PROVED; direct computation).**
- (a) `d_t L = (1/4)(L_zz + 2 L L_z)` (viscous Burgers; `F''/F = L' + L^2`).
- (b) `D` and `N` solve the same linear heat equation. `S_z = W/D^2`, `S_t = W'/(4 D^2)`. Equivalently
  `S_t = (1/4)(S_zz + 2 M S_z)`, and `M = L - S_z/(1+S)`, `L = (1-S)/(alpha(1+S))`, so in closed form
  `S_t = (1/4)[ S_zz - 2 S_z^2/(1+S) + 2(1-S) S_z/(alpha(1+S)) ]`.
- (c) `M` solves the same Burgers equation as `L`: `d_t M = (1/4)(M_z + M^2)_z` (conservation form).
- (d) The poles `p_j` of `S_t` are the zeros of `D_t`; they move by
  `p_j' = -D''(p_j)/(4 D'(p_j)) = -(1/2) sum_{i != j} 1/(p_j - p_i)`, the sum over all zeros of `D_t` in both
  half-planes. Zeros of `F_t` obey the same law (`alpha = 0`).
- (e) `Gamma_-(t)` has kernel `k_t(u - v)`, `u < c < v`, `k_t(w) = sum_{Re p_j > 0} r_j e^{p_j w}`,
  `r_j = 2 F_t(p_j)/D_t'(p_j)`; `d_t Gamma_- = Q (W'/(4D^2)) P`, with double poles at the same `p_j`. Nonzero spectrum
  of `Gamma_-* Gamma_-` = spectrum of `T = R* A R conj(A)`, `A_jk = 1/(conj p_j + p_k)`, `R = diag(r_j)` (Q1).
  Normalisation check: one pair `+-sigma` gives `T = alpha^2/(alpha^2 + sigma^2)`.

## 2. First lemma: no unitarily invariant norm is monotone

**Proposition 2 (PROVED).** For `F = z^2 - sigma_0^2`: `sigma(t)^2 = sigma_0^2 - t/2`, the single singular value of
`Gamma_-(t)` is `s(t) = alpha/sqrt(alpha^2 + sigma(t)^2)`, strictly increasing on `[0, 2 sigma_0^2)` with limit `1`,
and `Gamma_-(t) = 0` for `t >= 2 sigma_0^2`. A unitarily invariant norm is an increasing function of `s` on rank-one
operators, so it increases and then drops to `0`: not monotone in either time direction. The same holds for
`det(1 - Gamma_-* Gamma_-)` (decreases to `0`, then equals `1`).

Between collisions the sign is also indefinite (section 3). Smallest witness, one bare quartet
`F` with zeros `+-33/20 +- 19i/20`, 50 digits: `d/dt ||Gamma_-||_HS^2 = +0.0029884` at `alpha = 0.3`,
`-0.0013128` at `alpha = 1`, `-0.0029303` at `alpha = 10`. A class-(H) witness with one pair:
zeros `+-39/20 + i`, `17i/20`: `+0.0029550`, `-0.00067297`, `-0.00041880` at the same `alpha`.

## 3. First decisive test (run first)

`test1.py`, 1e4 random configurations (seed 1), degree <= 12, half class (H) with 1-3 pairs, half even with one or two
quartets or real pairs; zeros are Gaussian rationals with denominators <= 20. Part A is exact arithmetic in `Q(i)`
(sign of an exact rational). Part B is float64 with central differences on the exactly flowed polynomial; witnesses
re-checked at 50 digits (`verify.py`). 21 of 30000 Part B evaluations skipped (pole count changed within the step).

| Functional | negative | positive | status |
|---|---|---|---|
| A: `sum_{j,k in RHP} (rho_j + conj rho_k)^{-2}` (`alpha -> 0` limit of HS^2/4 alpha^2) | 50 | 9950 | exact; indefinite (all negatives have >= 3 right-half-plane zeros) |
| A: log det of the same Gram form | 269 | 9731 | exact; indefinite |
| A: `log abs Disc(F)`, derivative `-4 sum_k (rho_k')^2` | 3489 | 6511 | exact; indefinite |
| A: `min Re rho` over the right half-plane | 9739 | 261 | exact; indefinite |
| A: `max Re rho` | 10000 | 0 | exact; CLASSICAL (de Bruijn) |
| A: `sum_{RHP} Re rho` | 10000 | 0 | exact; PROVED below |
| A: `sum_{RHP} (Re rho)^2` | 10000 | 0 | exact; PROVED below |
| B: HS^2, `alpha` = 0.3 / 1 / 10 | 225 / 513 / 782 | 9768 / 9480 / 9211 | MEASURED; indefinite |
| B: operator norm^2 | 321 / 767 / 1078 | 9672 / 9226 / 8914 | MEASURED; indefinite |
| B: nuclear norm | 165 / 323 / 569 | 9828 / 9670 / 9424 | MEASURED; indefinite |
| B: `log det Gamma_-* Gamma_-` | 369 / 481 / 625 | 9624 / 9512 / 9368 | MEASURED; indefinite |
| B: `log det(1 - Gamma_-* Gamma_-)` | 9747 / 9398 / 9037 | 246 / 595 / 956 | MEASURED; indefinite |
| B: `Phi_alpha = sum_{Re p > 0} Re p` (`test2.py`) | 10000 / 10000 / 10000 | 0 | MEASURED; PROVED below |

The largest eigenvalue of `Gamma_-* Gamma_-` seen is 0.99998888 (< 1, as required by `abs S = 1`). In the even
stratum with one real pair and axis zeros, 4000 further configurations gave no negative HS derivative at `alpha = 1`
(not a proof); with one quartet, 459 of 2977 had a negative HS or operator-norm derivative. The discriminant is
monotone only when all zeros are on the axis: off-axis velocities enter `-4 sum (rho')^2` with the opposite sign.

Outcome: the norms of `Gamma_-` fail; three zero-configuration functionals pass.

## 4. The monotone functionals

**Proposition 3 (PROVED).** Let `D` be any polynomial with simple zeros `p_j`, none on the axis, at least one in each
open half-plane, evolving by `D_t = D_zz/4`. Then

    d/dt sum_{Re p_j > 0} Re p_j = -(1/2) sum_{Re p_j > 0} sum_{Re p_i < 0} Re 1/(p_j - p_i) < 0,
    d/dt sum_{Re p_j > 0} (Re p_j)^2 < 0.

*Proof.* By Lemma 1(d) the pairs with both indices in the right half-plane cancel in the first sum
(`1/(p_j - p_i)` is antisymmetric) and contribute `-(1/2)(x_j - x_i)^2/abs(p_j - p_i)^2 <= 0` in the second
(`x = Re p`). For `Re p_i < 0 < Re p_j`, `Re 1/(p_j - p_i) > 0`. QED.

Consequences.
- With `D = F + alpha F'`: the number of zeros of `D` in `Re z > 0` equals `kappa` = number of distinct zeros of `F`
  there (Q6; 0 mismatches in 30000 float checks), and `D` has zeros on the axis only at multiple zeros of `F` on the
  axis. So `Phi_alpha(t) = sum_{Re p > 0} Re p` is strictly decreasing while positive, continuous in `t` (a pole
  leaves through the axis with `Re p -> 0`), and `Phi_alpha = 0` iff `Gamma_- = 0`.
- `alpha -> 0`: `Phi_0 = sum_{Re rho > 0} Re rho` and `-d Phi_0/dt >= (1/4) sum_{Re rho > 0} 1/Re rho` (the partner
  term; exact check, 0 failures in 1e4). With one pair this is `sigma(t)^2 <= sigma_0^2 - t/2`: de Bruijn's bound
  on the collision time. CLASSICAL content: it is the mechanism of `Lambda <= 1/2`.
- In terms of the operator: the closed range of `Gamma_-` is the span of `e^{p_j u} 1_{u < c}`; left translation
  compressed to it has generator with eigenvalues `p_j`; `Phi_alpha` is the real part of its trace. It is not a
  function of the singular values.

**Proposition 4 (direction; PROVED for polynomials).** Let `G >= 0` be a functional of the zero configuration,
continuous along the flow, with `G = 0` on configurations with all zeros on the axis. If `G` is monotone along the
forward flow on every trajectory, it is nonincreasing. *Proof.* Every polynomial trajectory reaches the axis in time at
most `2 max (Re rho)^2` (de Bruijn; Proposition 3 with the partner term) and stays; a nondecreasing `G` would be `0`
throughout. QED. Hence a monotone functional gives `G(0) <= G(-tau)` and `G(0) >= G(tau) >= 0` and nothing else. For
`xi`, `G(-tau)` for `tau > 0` involves zeros outside every strip (F1), and `G(tau) = 0` for `tau >= Lambda`. The
statement `G(0) = 0` is flow-critical, and monotonicity transports information only from `t < 0` to `t = 0`, where the
conclusion is false. A lower bound on the decay rate gives upper bounds for `Lambda` from zero-free input (F3, F4), not
the converse.

## 5. Derivative on the prime side

**Proposition 5 (flux identity; PROVED, residue theorem).** Let `R` be a rectangle with no zero of `D_t` on its
boundary. Then

    d/dt sum_{p in R} p(t) = -(1/4) (1/(2 pi i)) oint_{dR} M^2 dz,     M = D'/D = L + alpha L'/(1 + alpha L).

*Proof.* At a simple zero `p`, `M = 1/(z-p) + c_0 + ...` with `2 c_0 = D''(p)/D'(p)`; the residue of `M^2` is `2 c_0`
and `p' = -D''(p)/(4D'(p))`. Equivalently `sum p = (1/2 pi i) oint z M` and Lemma 1(c). QED. Numerical check
(`test2.py`, degree 10, three zeros in the box): both sides `-5.23781370590245`, difference 7.9e-31.

Reading at `t = 0` for `F = xi(1/2 + z)`, window `R = [eps, X] x [T_1, T_2]`:
- Right edge `Re z = X > sigma_0(alpha)` (Q4): `L = G - P`, `P = sum_n Lambda(n) n^{-1/2-z}`, and
  `M^2` expands in the convolution powers `Lambda^{*m}` with archimedean coefficients (the Cayley expansion of Q4
  applied to `alpha L'/(1 + alpha L)`). All primes enter, through `Lambda * Lambda` and higher. PROVED-rel Q4.
- The integrand is analytic to the right of `X`, so the right-edge flux is equal to horizontal-edge terms further
  right: the prime side assigns flux zero to every pole, for every sign twist (the expansion uses only
  `abs Lambda(n) <= log n`). ARGUED (same argument as Q4; edge terms not bounded here).
- The left edge `Re z = eps` and the parts of the horizontal edges with `Re z <= sigma_0` carry the rest. Together
  with the right edge they give `oint M^2 = -8 pi i (d/dt) sum_{p in R} p`, which is the residue sum. No prime expansion converges there.
- The heat flow at `t != 0` does not act on Dirichlet coefficients except through the cocycle `2t log m log n` (F2), which
  is the same for zeta, DH and twists; the `t`-derivative at `t = 0` on `Re s > 1` is
  `d_t L = (1/4)(G'' - P'' + 2(G - P)(G' - P'))`, causal, with no anticausal part.

The inequality requested between prime data and `Gamma_-` therefore reads `0 >= d Phi/dt` with the prime side
contributing `0` identically: the residue theorem, exact and empty (wall S1 of the map, section 5 item 3).

## 6. Controls

| Control | Lemma 1 | Prop. 2 | Prop. 3 (monotone `Phi_alpha`) | Prop. 5 prime side | Step that fails |
|---|---|---|---|---|---|
| DH | holds (class (H), order one) | holds | holds; `Phi > 0` at `t = 0` | no prime chain (parallel junction); flux identity holds | none of the proved steps; the conclusion `Phi(0) = 0` is false and nothing proved here asserts it |
| HEAT (backward) | holds | holds | holds; `Phi` increases backward | same cocycle | none; the functional is flow-critical by construction and gives only `Phi(0) <= Phi(-tau)` |
| TW+, TW- | `S` not unimodular on the axis (no functional equation); Lemma 1(a)-(d) still hold for any entire heat solution | not formulable (`Gamma_-` blocks not defined by a unitary symbol) | Prop. 3 holds for any polynomial `D` | right-edge expansion identical in form and size | prime side is causal for every twist (Q4) |
| `E_a` | holds | holds | holds; `Phi(0) > 0` (zeros at `Re z = +-a`) | Euler product and `Lambda >= 0` present; flux through `Re z = X` still assigns zero | none |
| NR, B, phase-rotated transfer operator, `theta^w` | not run | not run | Prop. 3 needs only a polynomial / class (H) heat solution | not run | not examined |

Three requirements. (i) All primes together: they enter only through the right-edge flux, where the contribution to
the anticausal data is zero. Not met. (ii) Uniform in height, every window: Proposition 5 is windowed and exact, but it
is an identity. (iii) Fails for controls for a structural reason: no proved step fails for DH or `E_a`. Not met.

## 7. Pivot (one)

Adjacent combination examined: replace the norm by the flux functional and ask for a rate inequality that uses the
prime chain, i.e. a lower bound for `-d Phi_R/dt` at `t = 0` from prime data that is incompatible with `Phi_R(0) > 0`.
Result: by Proposition 4 any such bound yields an upper bound on the extinction time (a `Lambda` bound given the
off-line depth), which is the direction of F3; with `Phi_R(0) > 0` the rate `-(d/dt)Phi_R >= (1/4) sum 1/Re rho` is
positive and consistent, so no contradiction arises at `t = 0`. A contradiction would need a second, independent
evaluation of the axis flux from prime data, which is the transport across `0 < Re z <= sigma_0` (wall S1). No lever.
The other adjacent object, the exact linear law `sum_k rho_k(t)^2 = sum_k rho_k(0)^2 - n(n-1)t/2` (power sums are
polynomial in `t`), is the moment/Jensen route and was not pursued.

## 8. Three weakest steps

1. Part B of the test (finite `alpha` norms) is float64 with finite differences; only the listed witnesses were
   re-checked at 50 digits, and nothing is interval-certified. The exact claims are Part A, Proposition 2 and
   Proposition 3.
2. Everything is proved for polynomials. For `xi` the Dyson law with infinitely many zeros, the continuity of
   `Phi_alpha` (which may be infinite if RH fails badly), the general statement that a singular value tends to `1` at
   a collision (proved here only in the one-pair model; Q7 argues it beyond), and Proposition 4 (which uses finite
   extinction time; for `xi` it uses `Lambda < infinity`) were not written out.
3. The prime-side reading in section 5 is argued from Q4, not computed: no numerics on zeta, DH or `E_a` were run in
   this lane, the horizontal-edge terms are not bounded, and the control entries in section 6 are inferences from the
   class (H) hypotheses, with NR, Beurling, the phase-rotated transfer operator and `theta^w` not examined.

## Files

`test1.py`, `test1_seed1.log`, `test1_seed1.json` (sign counts, exact witnesses); `verify.py`, `verify.log` (50-digit
witness checks); `test2.py`, `test2.log` (`Phi_alpha` counts, rate bound, flux identity). All runs local through
`scripts/memcap.sh 8`; the compute server was not used.
