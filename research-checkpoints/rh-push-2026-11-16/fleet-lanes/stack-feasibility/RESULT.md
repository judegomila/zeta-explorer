# stack-feasibility: joint feasibility of constraints (i)-(vi) for one off-line quartet

Date: 2026-11-16. Scope: `tmp/research-2026-11-16/push/stack-feasibility/` only (plus `~/rh-push/stack-feasibility/` on the
motherbox). Nothing committed or pushed. No RH claim, no bound moves.
Labels: PROVED (argument given here), CLASSICAL, MEASURED (float64 / mpmath, not interval-certified), OPEN.

## Verdict

**Every stack stays feasible beyond verified height, except by a window computation whose size grows with the height.
No new result.** Precisely:

1. In the finite model, stacking does change the excluded set. Example found (MEASURED, dual certificate in section 4):
   at ordinate `t0 + 0.0133`, `t0 = 3000192779652.13` (1.7e7 above the Platt-Trudgian height), the stack
   {window count, explicit formula with `Lambda(n)` for `n <= e^14 = 1.2e6`, half-plane `|Re rho - 1/2| <= 3/8`} excludes a
   quartet with `delta` in `(0.346, 0.375]`. The explicit formula with the trivial strip excludes only `delta > 0.481` there,
   and the half-plane alone excludes only `delta > 0.375`. So the conjunction excludes a region that no single constraint
   excludes.
2. This is not a result beyond verified height in the sense of the task. The exclusion appears only when the bandwidth
   reaches `L = log N ~ L*(gamma) = (1/2) log(gamma/2 pi)` (13.45 here, `N* = sqrt(gamma/2 pi) = 691010`). It needs the prime
   sums evaluated at that one ordinate, and it is a statement about one window. With the same primes the Riemann-Siegel sum
   evaluates `Z(t)`; in this window it shows 1112 sign changes against 1112.8 expected (MEASURED). The stack restates
   "verified height in a window" at higher cost and with weaker conclusions. The half-plane constraint lowers the needed
   bandwidth by about one unit of `L` (a factor `e` to `e^2` in `N`); it does not change the scaling in `gamma`.
3. Below that bandwidth the stack is feasible. Explicit counter-configuration (section 5): zeta's zeros near `t0`, the
   closest pair (gap 0.0352) replaced by a quartet with `delta = 0.30`, 800 neighbouring on-line zeros shifted by at most
   0.24. It reproduces the prime side built from `Lambda(n)`, `n <= 403`, to 7.6e-11 in all 39 tests, keeps Pick K=12 and both
   sector matrices positive with relative margin `1 - 4e-43`, lies in the 7/8 half-plane, and lands on the line at heat
   time `tau* ~ 0.061 < 0.2`. Same for `delta = 0.16` with `n <= 2981`, and `delta = 0.02` with `n <= 22026`.
4. The freedom that has to be removed is the position of individual zeros at the scale of the mean spacing near `gamma`,
   which `Lambda(n)`, `n <= N`, does not determine while `log N < (1/2) log(gamma/2 pi)`. The constraint that removes it is
   (ii) at bandwidth above `L*(gamma)`, which is a verification computation at height `gamma`, or a bound on
   `sum Lambda(n) n^{-1/2-i gamma} w(log n)` that is uniform in `gamma`, which is a zero-free-region theorem. With all `n`
   and exact values, (ii) is the statement "the function is zeta" (Proposition A) and the question is RH itself.
5. Constraints (iii), (v), (vi) on finite node sets exclude nothing above ordinate about 30 (section 6). They do not
   interact with (ii): their slack at height 3e12 is 43 to 110 orders of magnitude larger than the perturbation.
6. Calibration passes. At heights 1000 and 15000 the model excludes every tested quartet once `L` is 1.6 to 2.6 times `L*`.
   On Davenport-Heilbronn data with `N = 148` it rejects "all zeros on the line", rejects `delta = 0.30` and `0.32`, and
   accepts the true `delta = 0.30852` (section 3.3).

## 0. Plan: what is new relative to the atlas and the walls

| Item | Status before | Here |
|---|---|---|
| Atlas PR 27, finite certificates restate verified height | wall | Not circumvented. Quantified: bandwidth threshold `L*(gamma)`, and the gain from adding the half-plane |
| euler/RESULT.md, pick-induction: finite Pick orders are Euler-blind | known | Used. Relative perturbation of the K=12 matrices by a quartet computed at each height |
| route-30: rung detectors carry no zero-location content | known | Confirmed inside the stack: sign-twisted prime data stay feasible at every bandwidth tested |
| "Constraints may stack" | untested | Tested as an LP with dual certificates. Stacking is real in the finite model and bounded by the same bandwidth threshold |

Not attempted: an SDP coupling of (iii)/(vi) with (ii). Section 6 shows the margins make it unnecessary at these heights.

## 1. Model

Centered zeros `rho = 1/2 + sigma + i t`. Unknown configuration: zeta's zeros with ordinate up to the verified height, one
quartet `(1/2 +- delta, +-(t0 + tq))`, and a free configuration elsewhere.

Tests. `Bhat(z) = (sin(a z)/(a z))^6`, `a = L/6`; `B` = its inverse transform, a B-spline of order 6 supported on `[-L, L]`.
Test `j` is `h_j(t) = Bhat(t - t0 - tau_j) + Bhat(t + t0 + tau_j)`, centres `tau_j` in `[-5, 5]` at spacing `pi/(2L)`.

(ii) Explicit formula (CLASSICAL, Weil), terms below 1e-6 relative dropped:

    sum_{Im rho > 0} Bhat(t_rho - t0 - tau_j) = B(0) log((t0+tau_j)/2 pi) - 2 sum_{n <= e^L} Lambda(n) n^{-1/2} B(log n) cos((t0+tau_j) log n) =: b_j

An on-line zero contributes `Bhat(t - t0 - tau_j)`, an off-line pair at `(+-sigma, t)` contributes
`2 Re Bhat(t - t0 - tau_j + i sigma)`. The right side uses `Lambda(n)` only for `n <= N = e^L`. Checked against zeros:
`|prime side - zero side| <= 5e-7` at `t0 = 1000`, `<= 1e-9` at 15000, `<= 3e-12` at 3e12 (`check_ef.py`, `cg_*.log`).

LP (window model). Variables: a nonnegative measure of zeros on a grid of the window `[t0-35, t0+35] x [0, sigma_max]`
(relaxation of integer multiplicities). Rows:
- (0) window count within `E +- 7`, `E = 70 x density` (Riemann-von Mangoldt; a consequence of (i));
- (ii) `|sum_window kernel_j + Q_j(delta) - b_j| <= tail + eta`, `Q_j = 2 Re Bhat(tq - tau_j + i delta)`, `tail` = allowance for
  zeros outside the window, `eta = 1e-5` = evaluation allowance;
- (iv) `sigma_max = 3/8`; without (iv) `sigma_max = 1/2`.

Three models: **M1** all other zeros in the window on the line (`sigma_max = 0`); **M2(3/8)**; **M2(1/2)**.
Elastic form: minimise the violation `s`; `s* > 0` means infeasible and the LP dual is the certificate. Column generation
(`run_cg.py`) adds grid points until the dual function is nonnegative on the full fine grid (t step 0.004, 21 sigma levels).

Three exact statements frame what the LP can and cannot show.

**Proposition A (CLASSICAL).** If a symmetric multiset in the strip satisfies the explicit formula for every even test with
`c(n) = Lambda(n)` for all `n`, it is the zero multiset of zeta. (Take `g(u) = e^{-(s-1/2)|u|}`: the formula becomes equality
of `sum 1/(s - rho)` with `xi'/xi(s)` on `Re s > 1`, hence everywhere.) So the full constraint (ii) is feasible for a quartet
if and only if zeta has that quartet. The multiplicative relations (prime-power support, `Lambda * 1 = log`, the route-30
Toeplitz inequalities) are identities of the data `c = Lambda`; once the values are imposed they add nothing.

**Proposition B (PROVED).** A configuration that differs from zeta's zeros in finitely many points violates (ii) on every
interval of `u = log n`, including `(0, log 2)` where the prime side is empty. Proof: the two zero sides differ by
`int g(u) E(u) du`, `E(u) = sum_added e^{(rho-1/2)u} - sum_removed e^{(rho-1/2)u}`, a nonzero exponential polynomial, hence
real-analytic and not identically zero on any interval. So an exact counter-configuration must move infinitely many
zeros. A finite one can only make `sup |E|` small.

**Proposition C (PROVED, weak duality).** Let `G(z) = sum_j y_j kernel_j(z) + kappa x mass(z)`. If `G >= 0` on the allowed
region and `G(quartet) > sum_j (u_j (b_j + tail) - v_j (b_j - tail)) + c_+ (E + 7) - c_- (E - 7)` (with `y = u - v`,
`kappa = c_+ - c_-`, all multipliers nonnegative), no configuration satisfying (0), (ii), (iv) contains the quartet.

## 2. What each constraint excludes alone

| Constraint | Excludes a quartet at `(delta, gamma)`, `gamma > 3e12` | Source |
|---|---|---|
| (i) functional equation | nothing | DH control |
| (ii) at bandwidth `L`, others on the line (M1) | `delta > delta_1(gamma, L)`, table 3.1 | this note, MEASURED |
| (ii) at bandwidth `L`, others anywhere in the strip (M2(1/2)) | nothing for `L <= 13`; `delta > 0.45..0.49` for `L = 14..16` | this note, MEASURED |
| (ii) with only `Lambda >= 0`, uniform in `gamma` | `delta > 1/2 - c/log gamma` (de la Vallee Poussin; it is a dual certificate of this type with frequencies 0, gamma, 2 gamma) | CLASSICAL |
| (iii) sectors `P +- B`, 12 nodes | nothing above ordinate ~30 | section 6, MEASURED |
| (iv) 7/8 half-plane | `delta > 3/8` | brief |
| (v) wall-height / channel laws on `tau >= tau_0` | nothing with landing time below `tau_0`; all `delta <= 1/2` land by 0.10 | section 6, MEASURED |
| (vi) Pick K <= 12 | nothing above 3e12 (pick/NEXT_STAGE.md: K <= 12 positivity follows from verified height for any such configuration) | PROVED there |

## 3. Feasibility maps

Entries: the set of `delta` excluded. "all" = every `delta >= 0.001`; "none" = feasible up to the model limit
(1/2 for M1 and M2(1/2), 3/8 for M2(3/8)). Two quartet positions per window: "pair" = midpoint of the closest pair of
zeros, "gap" = midpoint of the largest gap. The base model (no quartet) is feasible in every row.

### 3.1 Above verified height: `t0 = 3000192779652.13`, `L* = 13.45`, `N* = 691010` (`run_cg.py high`, MEASURED)

Pair gap 0.0352 at `tau = 0.3101`; largest gap 0.5583 at `tau = 0.0133`; mean gap 0.2336.

| L | N = e^L | M1 pair | M1 gap | M2(3/8) pair | M2(3/8) gap | M2(1/2) pair | M2(1/2) gap |
|---|---|---|---|---|---|---|---|
| 4, 6 (coarse grid run) | 55, 403 | none | none | none | none | none | none |
| 8 | 2.98e3 | > 0.367 | > 0.310 | none | none | none | none |
| 10 | 2.2e4 | > 0.236 | > 0.125 | none | none | none | none |
| 12 | 1.63e5 | > 0.156 | all | none | none | none | none |
| 13 | 4.42e5 | > 0.132 | all | none | > 0.368 | none | none |
| 14 | 1.2e6 | > 0.114 | all | > 0.374 | > 0.346 | > 0.493 | > 0.481 |
| 15 | 3.27e6 | > 0.101 | all | > 0.358 | > 0.329 | > 0.478 | > 0.466 |
| 16 | 8.89e6 | > 0.091 | all | > 0.345 | > 0.314 | > 0.464 | > 0.452 |

Readings.
- M2 (no assumption on the other zeros) excludes nothing until `L` reaches about `L*`. This holds with or without (iv).
- Stacking effect: for `L >= 13` the column M2(3/8) excludes `delta` that neither M2(1/2) nor (iv) excludes. At `L = 16`:
  `(0.314, 0.375]` at the gap, `(0.345, 0.375]` at the pair.
- M1 (RH assumed for the other zeros in the window) excludes large `delta` from `L = 8` on. At a close pair the threshold
  decays like `1.5/L`; resolving `delta -> 0` there needs `L` of order `pi/gap`, about 90 for this pair.
- Least mass of other off-line zeros that hides the quartet (relaxed, `min_offline.json`): at `L = 14`, `delta = 3/8`, strip
  1/2: 1.6 zeros (pair), 2.3 zeros (gap). At `L = 10`, strip 3/8: 2.4 and 3.4. For `delta <= 0.1` and `L <= 15` at the pair
  position: zero.

### 3.2 Calibration at low height, where the answer is known (`run_cg.py low1000 / low15000`, MEASURED)

`t0 = 1000` (`L* = 2.53`, `sqrt(t0/2 pi) = 12.6`):

| L | N | M1 pair | M1 gap | M2(3/8) pair | M2(3/8) gap | M2(1/2) pair | M2(1/2) gap |
|---|---|---|---|---|---|---|---|
| 2 | 7 | none | none | none | none | none | none |
| 3 | 20 | > 0.404 | all | none | all | none | > 0.051 |
| 4 | 55 | all | all | all | all | > 0.207 | all |
| 6 | 403 | all | all | all | all | all | all |
| 8 | 2981 | all | all | all | all | all | all |

`t0 = 15000` (`L* = 3.89`, `sqrt(t0/2 pi) = 48.9`; the `L = 5` run did not converge and is omitted):

| L | N | M1 pair | M1 gap | M2(3/8) pair | M2(3/8) gap | M2(1/2) pair | M2(1/2) gap |
|---|---|---|---|---|---|---|---|
| 3 | 20 | none | > 0.331 | none | none | none | none |
| 4 | 55 | none | all | none | all | none | all |
| 6 | 403 | > 0.063 | all | > 0.314 | all | > 0.412 | all |
| 8 | 2981 | all | all | > 0.193 | all | > 0.292 | all |
| 10 | 22026 | all | all | > 0.125 | all | > 0.229 | all |

The known infeasibility is recovered once `L` is about 1.6 to 2.6 times `L*`, first at gaps, last at close pairs. The
same pattern as 3.1 with `L*` rescaled. The same stacking effect is visible (M2(3/8) ahead of M2(1/2) by one or two
units of `L`).

### 3.3 Davenport-Heilbronn calibration (`run_dh.py`, MEASURED)

Prime side from `c_DH(n)` (`c(2) = kappa ln 2`, `c(6) = 1.93635607662` as in route-30), window around the known quartet
`(delta, gamma) = (0.30852, 85.6993)`, `L* ~ 2.1`. Model M1 plus one quartet at height `gamma`:

| L (N) | all on line | delta = 0.05 .. 0.30 | delta = 0.30852 | delta = 0.32 .. 0.45 | true delta, height + 0.3 |
|---|---|---|---|---|---|
| 3 (20) | feasible | feasible | feasible | feasible | feasible |
| 5 (148) | infeasible (s* = 9.3e-3) | infeasible (1.1e-2 .. 1.4e-4) | **feasible** | infeasible (6.5e-3 .. 1.3e-1) | infeasible (1.7e-1) |

The model does not exclude a quartet that exists, and it locates it. So the model is not biased toward exclusion.

## 4. The stacking example and its dual certificate

Data: `t0 = 3000192779652.1297936846789225 = 2 pi (691010.5)^2`, `tq = 0.013304384667515`, `L = 14`, `m = 3`, 90 tests,
`delta = 3/8`, strip `|sigma| <= 3/8`, `eta = 1e-4`, count slack 30 (`cert2.py`, `cert2_L14_d0.375.json` holds `u, v, c_+, c_-`,
`b`, `Q`).

**Statement (MEASURED).** Suppose a zero configuration satisfies
- (H0) the number of zeros with ordinate in `[t0 - 35, t0 + 35]` is within 30 of `E = 299.60`;
- (Htail) zeros outside that window change each test by at most 1e-4 (the model value is 5e-9, from the `t^-6` decay of
  `Bhat`, a density allowance of 3 times the mean and `|sigma| <= 3/8`);
- (ii) the explicit formula of section 1 with `Lambda(n)` for `n <= e^14 = 1202604`;
- (iv) every zero in the window has `|Re rho - 1/2| <= 3/8`.

Then it has no quartet at `1/2 +- 3/8 +- i (t0 + tq)`.

**Proof from the certificate (Proposition C).** The dual solution uses 44 of the 90 tests, `sum |y_j| = 1`,
`c_+ = 2.3e-7`, `c_- = 0`. Evaluated numbers:

    G(quartet) = 1.158628        bound on sum over window zeros of G = 1.114037        margin = 0.044591
    min G over the allowed region (grid t step 1e-4, 121 sigma levels) = -1.14e-6;  mass bound 329.6
    margin - mass x |min G| = 0.044216 > 0

Summing `G` over the zeros in the window gives at most 1.114037 + 329.6 x 1.14e-6 by (H0), (Htail), (ii); it is at least
`G(quartet) = 1.158628` because `G >= -1.14e-6` elsewhere by (iv). Contradiction. Robustness (`cert.py`): margin 0.0447,
0.0446, 0.0447, 0.0437 for `(eta, count slack) = (1e-5, 7), (1e-4, 7), (1e-5, 30), (1e-3, 30)`.

Without (iv) the same LP with `sigma_max = 1/2` is feasible (`s* = 0`), so (0)+(ii) at this bandwidth do not exclude the
quartet. (iv) alone allows `delta = 3/8`. Minimal stack: {(ii) with `N >= 4.4e5` (gap) or `1.2e6` (pair), (iv)}, with the
count (0) entering at multiplier 2.3e-7 (removal of (0) was not tested). Dropping (ii) or (iv) restores feasibility.

**Why this is not a new result.**
- It is one ordinate. Each other ordinate needs its own prime sum, and `N` must exceed about `sqrt(gamma/2 pi)`.
- It is conditional on float arithmetic, on (H0)/(Htail) without explicit constants, and on the 7/8 half-plane.
- With `n <= 691010` the Riemann-Siegel sum gives `Z(t)` directly. In `[t0 - 130, t0 + 130]` it has 1112 sign changes
  (expected 1112.8; two zeros re-checked with `mpmath.siegelz`, `|Z| < 5e-14`). A Turing-method count would turn that into
  RH for the window, which contains this statement.
- The certificate does not use multiplicativity. With `Lambda(n)` replaced by `eps_n Lambda(n)` (random signs) the base
  model stays feasible at every `L <= 16` in all three models (27 of 27 rows), so the LP cannot tell arithmetic prime
  data from non-arithmetic data.

## 5. Explicit feasible counter-configuration (`surgery2.py`, `summarize.py`, MEASURED)

Construction. Take the 1112 computed zeros near `t0`. Remove the closest pair (ordinates `t0 + 0.2925`, `t0 + 0.3277`). Insert
the quartet `(1/2 +- delta, +-(t0 + 0.310085))`. Shift the `K` nearest on-line zeros on each side by real `eps_k`, chosen by
Gauss-Newton with continuation in `delta`, to minimise the demodulated difference of zero sides

    E(u) = 2 cosh(delta u) + sum_k e^{i(x_k + eps_k)u} - sum_{k, pair} e^{i x_k u},   0 <= u <= L.

For every test `g` supported in `[-L, L]` the change of the zero side is at most `||g||_1 sup |E|`.

Best `sup |E|` over `K` in {40, 150, 400}; in brackets `max |eps_k|` (mean gap 0.234):

| delta | L=6 | L=8 | L=10 | L=12 | L=13 | L=14 | L=16 |
|---|---|---|---|---|---|---|---|
| 0.010 | 3.1e-11 (0.00) | 3.6e-10 (0.00) | 1.7e-10 (0.02) | 1.4e-03 | 4.1e-03 | 2.1e-02 | 5.0e-02 |
| 0.020 | 5.6e-11 (0.00) | 2.0e-10 (0.00) | 9.2e-11 (0.02) | 3.7e-03 | 7.2e-03 | 3.7e-02 | 9.0e-02 |
| 0.050 | 1.5e-10 (0.01) | 1.9e-09 (0.01) | 8.5e-03 | 2.7e-02 | 4.9e-02 | 1.5e-01 | 4.6e-01 |
| 0.100 | 5.3e-10 (0.02) | 2.7e-08 (0.06) | 8.3e-02 | 9.3e-02 | 3.1e-01 | 4.7e-01 | 1.4 |
| 0.160 | 1.8e-09 (0.06) | 5.5e-08 (0.17) | 2.1e-01 | 5.2e-01 | 1.5 | 1.9 | 5.9 |
| 0.200 | 4.4e-09 (0.09) | 1.5e-02 | 6.4e-01 | 1.5 | 2.8 | 4.8 | 15 |
| 0.300 | 3.4e-08 (0.24) | 3.0e-01 | 4.5 | 11 | 23 | 38 | 98 |
| 0.375 | 8.0e-06 (0.45) | 2.8 | 15 | 47 | 84 | 140 | 370 |

Residual against `K` (40 / 150 / 400): `L=6, delta=0.3`: 1.9e-4 / 1.1e-6 / 3.4e-8. `L=10, delta=0.02`: 8.9e-5 / 9.9e-9 / 9.2e-11.
`L=12, delta=0.02`: 5.3e-3 / 4.5e-3 / 3.7e-3. `L=14, delta=0.02`: 5.6e-2 / 3.7e-2 / 3.8e-2. Below about `L = 10` the residual
falls with `K` to the float64 floor; at `L >= 12` it does not fall for `K <= 400`.

Direct check of three configurations against all LP tests (prime side from `Lambda(n)`, `n <= e^L`):

| L, N | delta | max over tests of zero side minus prime side | same for zeta's own zeros | plain insertion, no compensation | max shift | min gap of shifted zeros |
|---|---|---|---|---|---|---|
| 6, 403 | 0.30 | 7.6e-11 | 1.5e-11 | 2.2 | 0.240 | 0.0013 |
| 8, 2981 | 0.16 | 1.2e-10 | 2.7e-12 | 2.1 | 0.173 | 0.0001 |
| 10, 22026 | 0.02 | 7.6e-13 | 7.4e-13 | 2.0 | 0.024 | 0.0009 |

Each is a configuration with integer multiplicities, all other zeros on the line and simple, symmetric under (i), inside
the 7/8 half-plane, with the window count unchanged. Its status under each constraint:

| Constraint | Status of the configuration |
|---|---|
| (i) | exact |
| (ii), `n <= N` | to 1e-10 in every test (5 orders below the model allowance); not exact, by Proposition B |
| (iii) `P +- B`, 12 nodes | positive; relative change at most 4e-43 (`pick_margin.log`) |
| (iv) | `delta <= 0.30 < 3/8` |
| (v) | lands at `tau* ~ 0.061` (`delta = 0.3`), 0.077 (`delta = 3/8`); laws on `tau >= 0.2` unaffected (`landing.py`, frozen-neighbour estimate) |
| (vi) Pick K = 12 | positive; relative change at most 1.8e-43; also implied by pick/NEXT_STAGE.md |

Between the surgery reach and the M1 threshold (for example `L = 8`: surgery to 0.16, LP exclusion above 0.367) the model is
undecided: the relaxed LP is feasible, the local optimiser finds no integer on-line configuration.

Which freedom this exhibits. The compensating shifts change the prime-side data only at `log n > L`. The model has no
row there. A zero set of local density `D = log(gamma/2 pi)/2 pi` can absorb a bandlimited perturbation of bandwidth `L`
while `L < pi D = L*(gamma)` (Beurling-Landau density heuristic; not proved here for zeta's zeros). At a fixed `N` the
density grows with `gamma`, so the construction gets easier with height.

## 6. Constraints (iii), (v), (vi) at finite order

`P_ij = (L_i + L_j)/(x_i + x_j)`, `B_ij = -(L_i - L_j)/(x_i - x_j)`, `L = xi'/xi(1/2 + x)`, 12 real nodes, mpmath 280 digits
(`pick_margin.py`). For a changed configuration each matrix is `S_true + Delta` with `Delta` in closed form; the constraint
holds iff `lam = min eig(S^{-1/2} Delta S^{-1/2}) > -1`. Values of `lam` for plain insertion of one quartet, nodes
0.6, 1.1, ..., 6.1 (nodes 0.04, ..., 0.48 agree to the digits shown in sign and order):

| delta | gamma | Pick `P` | `P + B` | `P - B` |
|---|---|---|---|---|
| 0.1 | 20 | -0.053 | -2.1e6 | -2.0e5 |
| 0.1 | 30 | -2.2e-4 | -0.28 | -0.24 |
| 0.1 | 50 | -4.7e-6 | -2.4e-4 | -1.4e-4 |
| 0.375 | 20 | -1.21 | -3.2e11 | -1.6e10 |
| 0.375 | 30 | -3.1e-3 | -202 | -43 |
| 0.375 | 50 | -6.6e-5 | -3.4e-3 | -2.0e-3 |
| 0.375 | 1000 | -2.0e-14 | -4.8e-14 | -2.8e-12 |
| 0.375 | 3.0002e12 | -3.0e-90 | -8.2e-109 | -4.2e-88 |

A value below -1 means the constraint excludes the quartet. Pick K=12 excludes `delta = 3/8` at ordinate 20 and nothing at
30. The sectors exclude both `delta` at 20, `delta = 3/8` at 30, nothing at 50. Smallest eigenvalues of the true matrices on
the first node set: 1.2e-33 (`P`), 1.5e-59 (`P + B`), 3.1e-56 (`P - B`), all positive.

(v): frozen-neighbour integration of `d' = -1/(4d) - (1/2) sum_k d/((gamma - gamma_k)^2 + d^2)` at the pair position gives
landing times 0.0008, 0.015, 0.038, 0.061, 0.077, 0.102 for `delta` = 0.02, 0.1, 0.2, 0.3, 0.375, 0.5. Every quartet in the
strip at this height lands before 0.2, so laws certified on `tau >= 0.2` exclude none of them.

Consequence for the stack: (iii), (v), (vi) at these orders are satisfied with margin by every configuration that (ii)
and (iv) leave feasible above 3e12. The joint problem decouples into the LP of section 3.

## 7. Controls

- **Davenport-Heilbronn.** Run (section 3.3). The stack accepts DH's quartet with DH's prime data. No step uses the
  Euler product: (ii) enters through the numbers `b_j` only.
- **Sign twist.** Run. Base model feasible for `eps_n Lambda(n)` at every bandwidth. The stack has no multiplicative
  content, in line with the three lanes cited in the brief.
- **Backward heat.** Not run numerically. The surgery configuration is of the same kind as a short backward flow near a
  close pair (the pair leaves the line, neighbours relax by a fraction of a gap), which is why flow-stable constraints
  cannot exclude it.

## 8. Three weakest steps

1. The LP and its certificate are float64. The tail allowance and the window-count slack are modelling assumptions
   without explicit constants. The dual function is checked on a grid (1e-4 by 121 levels), not by interval arithmetic.
   The zeros near `t0` come from Riemann-Siegel sign changes without a Turing count.
2. The feasibility side is not exact. The surgery reaches 1e-10, not zero (Proposition B forbids zero for finite `K`).
   Exact feasibility with infinitely many shifts rests on a density heuristic. For `10 < L < L*` the optimiser fails with
   `K <= 400`, so the bandwidth at which on-line compensation stops working is located only as "between 10 and 13.45".
   M2 feasibility is for relaxed (fractional) measures; no integer configuration with other off-line zeros was built.
3. One window above verified height, two quartet positions, one test family. Thresholds depend on these choices. The
   scaling `L ~ L*(gamma)` rests on three heights (1000, 15000, 3e12).

## Files

All under `tmp/research-2026-11-16/push/stack-feasibility/`.
- `lib.py`, `lp.py`: tests, explicit formula, kernels. `check_ef.py`: explicit-formula check at low height.
- `rs_zeros.py`, `zeros_3e12.json`, `rs_validate.log`: zeros near `t0`.
- `run_cg.py`, `cg_*.json`, `cg_*.log`: feasibility maps with column generation. `table.py`: tables.
- `run_high2.py`, `min_offline.json`: least off-line mass.
- `cert.py`, `cert2.py`, `cert_L14_d0.375.json`, `cert2_L14_d0.375.json`, `cert2.log`: dual certificate.
- `run_dh.py`, `dh_3.json`, `dh_5.json`: Davenport-Heilbronn calibration.
- `run_high_coarse.log`: first map on the coarse grid (rows `L = 4, 6` and the sign-twist base feasibility come from it; its
  thresholds are superseded by `cg_*.json`).
- `surgery2.py`, `surgery2*.json`, `summarize.py`: counter-configurations.
- `pick_margin.py`, `pick_margin.log`, `landing.py`: constraints (iii), (v), (vi).
