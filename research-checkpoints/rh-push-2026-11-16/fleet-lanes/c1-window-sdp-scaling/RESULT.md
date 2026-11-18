# c1-window-sdp-scaling: joint window SDP (finite-order Pick + explicit formula), exclusion radius delta*(T, L, K)

Date: 2026-11-18. Scope: `tmp/research-2026-11-16/push/c1-window-sdp-scaling/` and `~/rh-push/c1-window-sdp-scaling/` on the
compute server (units started through `rhrun`, stopped at the end). Nothing committed or pushed. No RH claim, no bound moves.
Labels: PROVED (argument given here), CLASSICAL, CERTIFIED (sign of an Arb ball, python-flint 0.9.0),
GRID-CERTIFIED (every sampled value is an Arb bound; the region between sample points is not covered),
MEASURED (float64), OPEN.

## Verdict

**Lead 23 closes: precise obstruction. The joint SDP equals the explicit-formula LP. delta*_joint(T, L, K) = delta*_EF(T, L)
for every T in {1e2, ..., 1e6}, every L, every K in {6, 12, 24}; the Pick block is inactive and the optimal dual has zero
matrix multiplier.** Both closing conditions of the assignment hold: joint = min of the separate values, and the exclusion
pattern is present for sign-twisted prime data as well.

1. **Structure (PROVED, section 2).** With real nodes the Pick matrix is linear in the zero-counting measure. Every on-line
   pair contributes a positive semidefinite rank-2 term. A quartet contributes `D(sigma, t) = 2 P_t + R(sigma, t)`, with
   `P_t` the on-line term at the same height and `R = sum_{k>=1} (-1)^k sigma^{2k}/(2k)! d^{2k}/dt^{2k} (2 P_t)`. So the Pick
   LMI is monotone in on-line mass, does not contain the prime data at all, and can only be violated through the
   remainders `R`. If `S_out` (Pick matrix of the zeros outside the window) dominates the remainders,
   `eps * (number of quartets) < 1`, the LMI holds for every window configuration and the SDP reduces to the LP.
2. **Decoupling constant (GRID-CERTIFIED, section 3).** `eps(T, K) = max over sigma <= 1/2 and t in the window of
   ||S_out^{-1/2} R(sigma, t) S_out^{-1/2}||_F`. Largest value over five node families: 1.65e-2 at (T, K) = (100, 24), then
   1.1e-7 at (1000, 24), 6.3e-11 at (1e4, 24), 4.7e-14 at (1e5, 24). Times the largest admissible number of quartets
   `(N_win + 7)/2`: 0.32 at (100, 24), below 4e-6 for T >= 1000. Fit: `eps = c sigma^2 T^{-4.0}` for nodes of size O(1),
   `T^{-3.1..-3.5}` for node families that grow with T. An adversarial search over
   node sets (48 hill climbs) raised (100, 24) to 2.06e-2 (product 0.40) and (1000, 24) to 1.9e-8. No node set with product
   >= 1 was found.
3. **Direct confirmation (CERTIFIED, section 5).** Every LP-feasible configuration saved by the sweep (zeta data; up to 139
   units of off-line mass in the window) was inserted into the Pick matrix at K = 6, 12, 24 and passed an Arb Cholesky test:
   445 of 445 PASS. The joint SDP is feasible wherever the LP is.
4. **Table (MEASURED thresholds, GRID-CERTIFIED duals; section 4).** For `L <= L*(T)/2`: nothing is excluded at any T, in any
   model (delta* = model limit). For `L = L*(T)`: nothing is excluded at close pairs when other window zeros may be off the
   line; some exclusion at the largest gap for T >= 1e4. For `L = 2 L*(T)`: every displacement is excluded at the largest gap;
   at the closest pair the threshold is 0.27 to 0.35 (strip 1/2) when `gap * L / pi < 1` and "all" when it is above 1.
   The threshold follows the local gap in units of `pi/L`, not `1/log T`. This reproduces stack-feasibility with five more heights.
5. **Controls.** Davenport-Heilbronn at its off-line quartet: LP feasible at the true delta = 0.30852 for every bandwidth,
   and it is the only feasible delta of the scan at L = 5; Pick K <= 24 positive definite (CERTIFIED): the SDP is feasible at the
   true configuration, as required. Sign twists (random completely multiplicative signs; Liouville): the LP produces
   exclusion sets of the same kind as for zeta, and the Pick block is identical because it never sees the primes.
   `E_a`, a = 0.2: LP feasible at its true configuration in the strip model; real-node Pick is positive definite at K = 6 and
   fails at order 8 (CERTIFIED negative pivot) for K = 12, 24, through the lowest quartet at ordinate 14.13, not through the window.

Requirement flags: R1 false, R2 false, R3 false, R4 false (section 7).

## 0. Plan: what is new relative to the obstruction map

| Item | Before | Here |
|---|---|---|
| OBSTRUCTION_MAP section 6 item 10: semidefinite coupling of Pick with the explicit formula in one window, "not attempted" | open lead 23 | attempted; reduces to the LP by a proved monotonicity plus a certified constant |
| stack-feasibility section 6: Pick K = 12 slack by 14 to 90 orders against plain insertion | MEASURED, plain insertion only, T = 1000 and 3e12 | bound against every window configuration (window zeros removed), Arb, five heights, three orders |
| stack-feasibility threshold L*(gamma) from three heights | MEASURED | five more heights 1e2..1e6, same threshold; pair threshold tied to `gap * L/pi` |
| Q16 gap 4/(3 log(T/2 pi)) | PROVED there | not improved; the SDP has no exclusion below L* at all, so there is no quantity to compare with the gap |
| P2 (no margin on finite tests) | PROVED | consistent: the LMI margin is 1 - O(sigma^2 T^-4), i.e. the constraint is inactive, not tight |

## 1. The SDP

Centered zeros `z = sigma + i t` of `xi(1/2 + z)`. For a symmetric configuration `Z` put `L_Z(x) = sum_{z in Z} 1/(x - z)`
(for zeta: `L(x) = xi'/xi(1/2 + x)`, CLASSICAL). Real nodes `0 < x_1 < ... < x_K`, Pick matrix
`P[Z]_ij = (L_Z(x_i) + L_Z(x_j))/(x_i + x_j)`.

Variables: a nonnegative measure `mu` on the window `[T - 35, T + 35] x [0, sigma_max]` (relaxed multiplicities), plus one
quartet `(+-delta, +-(T + tq))`. Zeros outside the window are zeta's.

- Explicit formula rows (linear): for tests `h_j(t) = Bhat(t - T - tau_j)`, `Bhat(z) = (sin(az)/(az))^6`, `a = L/6`
  (transform supported in `[-L, L]`, so the prime side uses `Lambda(n)`, `n <= e^L`, only), centres `tau_j` in `[-5, 5]` at spacing
  `min(pi/(2L), 1)`: `|sum mu kern_j + Q_j(delta) - c_j| <= eta`, `eta = 1e-5`. Here `c_j` = prime side minus the contribution of the
  outside zeros. By the explicit formula `c_j = sum over zeta's window zeros of Bhat(gamma - T - tau_j)`; this is how `c_j` is
  computed (zeros from `acb.zeta_zeros`). For twisted prime data `c_j` is shifted by the difference of the two prime sums.
- Count row: `|mass(mu) + 2 - N_win| <= 7`.
- Pick LMI (order K): `S_out + int P[atom] d mu + D(delta, T + tq) >= 0`, `S_out = P[zeta] - sum_{window} P_gamma`.
- Models: M1 (`sigma_max = 0`), M2(3/8), M2(1/2). Positions: "pair" = midpoint of the closest pair with `|tau| < 4`,
  "gap" = midpoint of the largest gap.

`delta*` = infimum of the excluded displacements at that position. "none": feasible at the model limit. "all": infeasible
down to the bisection floor 0.0005.

Planned allocation sizes (printed by the jobs): kernel matrix at most 78 x 367521 float64 = 0.23 GB per worker, LP matrix at
most twice that; 12 workers; unit limit 24 GB. Arb jobs: below 1 GB.

## 2. Structure of the Pick block (PROVED)

**Lemma 1.** The on-line pair `+- i gamma` has `L(x) = 2x/(x^2 + gamma^2)` and
`P_gamma = 2 (u u^T + v v^T)`, `u_i = x_i/(x_i^2 + gamma^2)`, `v_i = gamma/(x_i^2 + gamma^2)`. So `P_gamma >= 0`, rank <= 2.
Proof: `(2x_i/(x_i^2+g^2) + 2x_j/(x_j^2+g^2))/(x_i+x_j) = 2 (x_i x_j + g^2)/((x_i^2+g^2)(x_j^2+g^2))`.

**Lemma 2.** `gamma -> P_gamma` extends holomorphically to `|Im gamma| < x_1`, and the quartet `(+-sigma, +-t)` has
`D(sigma, t) = P_{t + i sigma} + P_{t - i sigma} = 2 P_t + R(sigma, t)`,
`R(sigma, t) = 2 sum_{k >= 1} (-1)^k sigma^{2k}/(2k)! d^{2k} P_t/dt^{2k}`.
Proof: the four poles `+-sigma +- i t` are `+- i (t -+ i sigma)`, i.e. two "on-line pairs" at complex heights `t -+ i sigma`;
Taylor expansion in the height. (For `sigma >= x_1` the identity `D = P_{t+i sigma} + P_{t-i sigma}` still holds; only the series
is not used.)

**Proposition D (decoupling).** Suppose `S_out = C C^T` is positive definite and put
`eps = sup ||C^{-1} R(sigma, t) C^{-T}||` over the allowed `(sigma, t)`. For any window configuration with on-line measure
`mu_0 >= 0` and quartets `(sigma_k, t_k)` with multiplicities `m_k >= 0`:

    P[configuration] = S_out + int P_t d mu_0 + sum_k m_k (2 P_{t_k} + R_k)  >=  S_out + sum_k m_k R_k  >=  (1 - eps sum_k m_k) S_out.

If `eps * sum m_k < 1` the LMI holds. Consequences when `eps * (N_win + 7)/2 < 1`:
(a) the feasible set of the SDP equals the feasible set of the LP; (b) `delta*_joint = delta*_EF`; (c) a dual optimal solution of
the SDP is the LP dual with matrix multiplier 0; (d) the statement does not involve the prime data, so it is the same for
any right-hand side `c_j` (twists included).

**Remark (where the LMI could act).** By Lemma 1 the LMI is monotone: adding on-line mass never hurts. A joint exclusion
that the LP does not give therefore needs `S_out + sum m_k R_k` to be indefinite, which is the separate Pick test applied
to the configuration with the window emptied. By the horizon law of r2-pick-euler-entry (first indefinite order about
3.5 to 4.4 per on-line zero below the quartet) this needs K above roughly 4 x (number of zeros below T - 35): about 56 at
T = 100 and about 2500 at T = 1000. In that regime Pick positivity of that order is not a known property of zeta (it is known
for K <= 12 from verified height; all K is RH).

**Remark (complex nodes).** The Pick form with respect to the half-plane `Re z > a_0`, kernel denominator
`z_i + conj z_j - 2 a_0`, is positive semidefinite for every configuration supported in `|sigma| <= a_0`: for one pole `w`,
`(1/(z_i - w) + conj(1/(z_j - w)))/(z_i + conj z_j - 2a_0) = a_i conj(a_j) (1 + 2(a_0 - Re w)/(z_i + conj z_j - 2a_0))`, `a_i = 1/(z_i - w)`,
a rank-one positive matrix plus its Schur product with a Szego kernel. So the versions of Pick positivity that are known
for nodes near the window (`a_0 = 1/2`; `3/8` on the unrefereed half-plane input) are implied by the support constraint
already in the LP. Nodes with `0 < Re z < a_0` near height T would act locally (one node at `a + i t_q`, `a < delta`, excludes
`delta` when `2a/(delta^2 - a^2)` exceeds the background `~ (1/2) log(T/2 pi)`), but positivity there is the statement to be
proved, not an available constraint.

## 3. Decoupling constant (`pickdec.py`, `pickdec_table.jsonl`; GRID-CERTIFIED)

Arb, 3000 bits. `L(x)` from `zeta`, `zeta'`, digamma; window zeros from `acb.zeta_zeros` at the same precision; `S_out` and
`S_true` pass an Arb Cholesky test (all pivots certified positive) in every row. `eps` = Arb upper bound of the Frobenius norm
of `C^{-1} R C^{-T}`, maximised over `sigma in {0.02, 0.05, 0.1, 0.2, 0.3, 0.375, 0.5}` and `t - T in {-35, -34, ..., 35}`. In every
row the maximum is at `sigma = 1/2` and `eps` is proportional to `sigma^2` within 1e-3.
Node families: lin = 0.6, 1.1, ...; small = K equally spaced nodes in (0, 0.48]; geo = geometric from 0.1 to 2T;
top = linear from T/4 to 4.25 T; conf1 = cluster of relative width 1/4 at x = 1.

| T | K | N_win | zeros below | lin | small | geo | top | conf1 | max eps x (N_win+7)/2 |
|---|---|---|---|---|---|---|---|---|---|
| 100 | 6 | 32 | 14 | 2.37e-05 | 2.36e-05 | 2.22e-05 | 1.21e-05 | 2.36e-05 | 4.6e-04 |
| 100 | 12 | 32 | 14 | 1.33e-04 | 1.31e-04 | 2.20e-04 | 1.34e-04 | 1.31e-04 | 4.3e-03 |
| 100 | 24 | 32 | 14 | 1.65e-02 | 1.46e-02 | 1.18e-02 | 7.26e-03 | 1.46e-02 | 3.2e-01 |
| 1000 | 6 | 57 | 620 | 1.90e-10 | 1.89e-10 | 6.12e-10 | 1.75e-09 | 1.89e-10 | 5.6e-08 |
| 1000 | 12 | 57 | 620 | 3.75e-10 | 3.71e-10 | 1.60e-09 | 1.22e-08 | 3.71e-10 | 3.9e-07 |
| 1000 | 24 | 57 | 620 | 7.89e-10 | 7.69e-10 | 6.64e-09 | 1.08e-07 | 7.70e-10 | 3.5e-06 |
| 10000 | 6 | 82 | 10102 | 1.67e-14 | 1.66e-14 | 2.13e-13 | 1.10e-12 | 1.66e-14 | 4.9e-11 |
| 10000 | 12 | 82 | 10102 | 3.43e-14 | 3.39e-14 | 4.59e-13 | 7.64e-12 | 3.40e-14 | 3.4e-10 |
| 10000 | 24 | 82 | 10102 | 7.78e-14 | 7.63e-14 | 1.88e-12 | 6.28e-11 | 7.63e-14 | 2.8e-09 |
| 100000 | 6 | 108 | 138015 | 1.65e-18 | 1.64e-18 | 9.66e-17 | 8.25e-16 | 1.64e-18 | 4.7e-14 |
| 100000 | 12 | 108 | 138015 | 3.39e-18 | 3.35e-18 | 3.08e-16 | 5.77e-15 | 3.35e-18 | 3.3e-13 |
| 100000 | 24 | 108 | 138015 | 7.72e-18 | 7.57e-18 | 1.03e-15 | 4.71e-14 | 7.57e-18 | 2.7e-12 |
| 1e+06 | 6 | 134 | 1747079 | 1.65e-22 | 1.64e-22 | 4.76e-20 | 6.62e-19 | 1.64e-22 | 4.7e-17 |
| 1e+06 | 12 | 134 | 1747079 | 3.38e-22 | 3.35e-22 | 2.30e-19 | 4.65e-18 | 3.35e-22 | 3.3e-16 |
| 1e+06 | 24 | 134 | 1747079 | 7.71e-22 | 7.56e-22 | 6.90e-19 | 3.80e-17 | 7.56e-22 | 2.7e-15 |

Fit, K = 24, T = 1e3, 1e4, 1e5, 1e6. lin (also small, conf1): `log10 eps = -9.10, -13.11, -17.11, -21.11`, slope -4.00 per
decade, `eps ~ 3e3 sigma^2 T^-4`. geo: slopes -3.55, -3.26, -3.17. top (nodes of size T): slopes -3.24, -3.12, -3.09. In all
families `eps (N_win + 7)/2` is below 4e-6 for T >= 1000 and decreases with T. T = 100 with K = 24 is the only cell of the
grid where the product is within a factor 10 of 1; there `S_out` rests on the 14 zeros below 65 and the zeros above 135.

Adversarial node search (`nodesearch.py`, server, `ns_*.log`; screen: Arb bounds at the node sets found, the supremum over
all node sets is not certified). Hill climbing in log-node space on `[0.02, 5T]`, 60 moves per start, `sigma = 1/2`,
eight heights in the window:

| T | K | starts | S_out not positive definite | max eps | x (N_win + 7)/2 |
|---|---|---|---|---|---|
| 100 | 24 | 24 | 0 | 2.06e-2 | 0.40 |
| 100 | 12 | 12 | 0 | 3.3e-4 | 6.4e-3 |
| 1000 | 24 | 12 | 0 | 1.9e-8 | 6.0e-7 |

## 4. Exclusion radius table

Since section 3 gives decoupling in every cell, the entries below are `delta*_joint(T, L, K)` for K = 6, 12, 24 alike.
Separate values: `delta*_EF` = the same entries; `delta*_Pick` = none (plain insertion keeps the K <= 24 Pick matrices positive
definite: `eps_true` column of `pickdec_table.jsonl`, at most 1.7e-4 at T = 100). So joint = min(separate) = `delta*_EF`.

`ef_lp.py`, `sweep.py`, `out/lp_*.json`, `lp_tables.md` (MEASURED; HiGHS, column generation until the dual function is
>= -s/(20 mass) on the fine grid: t step 0.004, 21 sigma levels). `L*(T) = (1/2) log(T/2 pi)`. n/c = column generation did not converge.

### 4.1 zeta

| T | L/L* | L | e^L | M1 pair | M1 gap | M2(3/8) pair | M2(3/8) gap | M2(1/2) pair | M2(1/2) gap |
|---|---|---|---|---|---|---|---|---|---|
| 1e2 | 0.25 | 0.35 | 1.4 | none | none | none | none | none | none |
| 1e2 | 0.5 | 0.69 | 2.0 | none | none | none | none | none | none |
| 1e2 | 1 | 1.38 | 4.0 | none | n/c | none | none | none | none |
| 1e2 | 2 | 2.77 | 15.9 | all | all | all | all | all | all |
| 1e3 | 0.25 | 0.63 | 1.9 | none | none | none | none | none | none |
| 1e3 | 0.5 | 1.27 | 3.6 | none | none | none | none | none | none |
| 1e3 | 1 | 2.53 | 12.6 | none | > 0.421 | none | none | none | none |
| 1e3 | 2 | 5.07 | 159 | all | all | all | all | all | all |
| 1e4 | 0.25 | 0.92 | 2.5 | none | none | none | none | none | none |
| 1e4 | 0.5 | 1.84 | 6.3 | none | none | none | none | none | none |
| 1e4 | 1 | 3.69 | 39.9 | none | all | none | all | none | all |
| 1e4 | 2 | 7.37 | 1592 | all | all | > 0.228 | all | > 0.326 | all |
| 1e5 | 0.25 | 1.21 | 3.4 | none | none | none | none | none | none |
| 1e5 | 0.5 | 2.42 | 11.2 | none | none | none | none | none | none |
| 1e5 | 1 | 4.84 | 126 | n/c | n/c | none | > 0.172 | none | > 0.380 |
| 1e5 | 2 | 9.68 | 15915 | all | all | > 0.141 | all | > 0.272 | all |
| 1e6 | 0.25 | 1.50 | 4.5 | none | none | none | none | none | none |
| 1e6 | 0.5 | 2.99 | 20.0 | none | none | none | none | none | none |
| 1e6 | 1 | 5.99 | 399 | > 0.320 | all | none | > 0.029 | none | > 0.345 |
| 1e6 | 2 | 11.98 | 159155 | all | all | > 0.238 | all | > 0.348 | all |

The base model (no quartet) is feasible in every row where it was solved.

T-dependence.
- `L <= L*/2` (rows 0.25 and 0.5): `delta*` = model limit at all five heights, all models, both positions. No exclusion,
  no dependence on T. The prime side has at most 20 terms there.
- `L = L*`: in M2 nothing is excluded at the closest pair at any height. At the largest gap the entries are none, none, all,
  0.380, 0.345 (strip 1/2); no monotone law.
- `L = 2 L*`: at the largest gap "all" at every height. At the closest pair (strip 1/2): all, all, 0.326, 0.272, 0.348 for
  pair gaps 1.72, 0.86, 0.27, 0.28, 0.10, i.e. `gap * L/pi` = 1.52, 1.39, 0.63, 0.87, 0.39. "all" exactly when `gap * L/pi > 1`.
  A fit `delta* = A + B/log(T/2 pi)` to the three numerical entries gives no usable slope (0.326, 0.272, 0.348 against
  `1/log` = 0.136, 0.103, 0.083); the variable that orders the entries is the local gap, as in stack-feasibility 3.1.
- The threshold bandwidth is between `L*` and `2 L*` at all five heights, as at 1000, 15000 and 3e12 in stack-feasibility.
  Below `L*` the joint SDP has no exclusion to compare with the Q16 gap `4/(3 log(T/2 pi))` (0.48, 0.26, 0.18, 0.14, 0.11 at
  these heights).

### 4.2 Sign twists (same windows, same outside zeros, prime side replaced)

`twist`: `eps_p` = seeded random signs with `eps_2 = -1`, `eps_{p^k} = eps_p^k`. `liou`: `eps_p = -1` for all p.
Full tables in `lp_tables.md`. Summary:

| | rows 0.25, 0.5 | row 1 | row 2 |
|---|---|---|---|
| zeta | none | mixed (above) | pair: all / 0.27..0.35; gap: all |
| twist | none | M1: all or > 0.18..0.36; M2(1/2): none or > 0.41, 0.48 | all, or gap > 0.20, 0.28; base M1 infeasible at 1e4, 1e5 (s* = 2.8e-4, 6.9e-4) |
| liou | none | M1 pair: all; M2(1/2) pair: > 0.46..0.48 | pair: all; gap: all or > 0.32..0.34 |

The base model in the strip (M2(1/2)) is feasible for both twists in all 40 rows, and exclusion sets of the same kind and
size appear from the same bandwidth. The LP treats the prime side as a list of numbers. Outside-true zeros plus a twisted
prime side is not the data of any function; the point of the control is that the program does not detect this below `2 L*`.

## 5. Certificates (`cert_arb.py`, `cert_arb_run1.log` for T <= 1e5, `cert_arb_1e6.log`, server)

(a) LP duals, Proposition C of stack-feasibility. For every infeasibility at a reported threshold of the zeta sweep, the
dual `(u, v, c_+, c_-)` is re-evaluated in Arb (128 bits): `c_j` from Arb zeros, `G(quartet)`, the bound, and `G` on the fine grid
of the allowed region (17501 heights x 1 or 21 sigma levels). PASS iff `G(quartet) - bound - (N_win + 7) max(0, -min G) > 0`
with certified sign. GRID-CERTIFIED: 40 of 40 PASS. Smallest margin 7.6e-9 (a row at its bisection threshold); margins at
"all" rows 1e-3 to 1.2.

(b) Primal joint feasibility. For every saved LP-feasible configuration (largest feasible delta of each bisection, or the
model limit in "none" rows), the Pick matrix of {outside zeros of zeta} + {LP atoms with their weights} + {quartet} is
formed in Arb (3000 bits) at (K, nodes) = (6, lin), (12, lin), (24, lin), (24, geo), (24, small) and tested by Cholesky.
CERTIFIED: 445 of 445 PASS (350 at 3000 bits for T <= 1e5; 95 at 800 bits for T = 1e6, `cert_arb_1e6.log`). The configurations include up to 139 units of off-line mass in the window (37 at T = 100, where
the atoms sit at sigma = 3/8 and 1/2). These are explicit feasible points of the joint SDP.

Together: at each threshold the SDP is infeasible just above (LP dual, matrix multiplier 0) and feasible just below
(explicit point), so the SDP value equals the LP value there.

## 6. Controls

| Control | Run | Outcome | Step that fails / reason |
|---|---|---|---|
| Davenport-Heilbronn | `run_dh.py` (LP at gamma = 85.6993, L = 2.1, 4.2, 5; L = 0.53, 1.05 have e^L < 3 and the script's prime table is empty), `ctrl_pick.py` | LP: L = 2.1 everything feasible; L = 4.2 feasible for delta in [0.25, 0.3085], infeasible for all-on-line and delta >= 0.32; L = 5 feasible only at 0.30852. Pick: positive definite at K = 6, 12, 24 on four node sets (CERTIFIED) | The SDP accepts DH's quartet with DH's data: no step uses the Euler product. Correctness check passes |
| Sign twist (multiplicative) | section 4.2 | same kind of exclusion sets; Pick block unchanged | Proposition D(d): the LMI does not contain the primes; the LP uses the prime side as numbers |
| `E_a`, a = 0.2 | `ef_lp.py Ea`, `ctrl_pick.py` | LP in the strip: feasible at every true ordinate for every scanned delta (0.05..0.4) at all 20 (T, L): the LP cannot attribute sigma to one zero when the others are free. M1 (others on line): infeasible at `2 L*` for T >= 1e4. Pick: positive definite at K = 6; first non-positive pivot at order 8 for K = 12, 24 on four node sets (8 of 8 CERTIFIED negative) | Real-node Pick rejects `E_a` from order 8 through the lowest quartet (ordinate 14.13, nothing below it). This is the low-height horizon effect, not a window effect; the joint SDP for `E_a` with its own outside zeros was not solved |
| Backward heat, unimodular twist, T-NR, Beurling, phase-rotated transfer, theta^w | not run | by Proposition D the Pick block depends on the zero configuration only and is inactive at these (T, K); the LP outcome is covered by stack-feasibility section 5 (a short backward flow is an LP-feasible surgery below `L*`) | no structural failure step exists: R3 not met |

## 7. Requirement flags

- **R1 (multiplicativity essential): false.** Proposition D(d): the LMI is independent of the prime data; the LP reads the
  prime side as numbers `c_j`. Twisted data give the same kind of table (4.2).
- **R2 (height-uniform, every window): false.** No exclusion at any T for `L <= L*/2`; exclusion starts between `L*` and `2 L*`,
  i.e. `e^L` between `sqrt(T/2 pi)` and `T/2 pi`: a per-window computation whose size grows with T.
- **R3 (fails for every control for a structural reason): false.** DH is accepted (correctly); twists are not separated.
- **R4 (reaches the critical line): false.** Finite windows, finite K; the joint value equals the LP value.

## 8. Three weakest steps

1. Proposition D is proved, but its hypothesis `eps (N_win + 7)/2 < 1` is certified at grid points (7 sigma levels, 71 heights)
   and for five node families plus 48 hill climbs, not for the continuum of `(sigma, t)` nor for all K-node sets. The margin
   at (T, K) = (100, 24) is a factor 2.5 only. A node set with larger `eps` there would reopen that one cell (and only for
   configurations with about 20 quartets at sigma near 1/2); for T >= 1000 the margin is at least 1e5.
2. The LP thresholds are float64 and depend on model choices (`eta = 1e-5`, count slack 7, window half-width 35, outside zeros
   fixed to zeta's, sextic sinc tests, two positions per window). For `L <= L*/2` the tests are wider than the window, so
   "none" there says only that such tests do not resolve single zeros. Dual certificates are grid-certified, not interval-verified
   between grid points. Three cells of the zeta table did not converge.
3. "Joint = LP" is established for real-node Pick matrices of order <= 24 and for the half-plane kernels of the Remark. An LMI
   built from a positivity statement that is both known for zeta and not implied by on-line monotonicity or by the support
   constraint is not covered; none is known (the sector matrices `P +- B` of stack-feasibility section 6 were not re-run
   here, and their on-line terms are not sign-definite in general).

## 9. Server use

Units (all through `rhrun`, cores 16-47, GPU not used): `rh-c1sweep-1118060327` (12 cores, 24 GB limit, 80 LP tasks, 12 min),
`rh-c1nodes-1118060327` (4 cores, 6 GB), `rh-c1cert-1118061523` (10 cores, 16 GB; stopped by me after it had finished T <= 1e5, because zero refinement at 3000 bits
at height 1e6 was slow), `rh-c1cert2-1118070519` (4 cores, 8 GB; the T = 1e6 files at 800 bits). Two first launches failed in 11 ms because
the code had not been copied (an rsync path typo on the local side); nothing ran. All units stopped or finished at the end.

## Files

All under `tmp/research-2026-11-16/push/c1-window-sdp-scaling/`.
- `pickdec.py`, `pickdec_table.jsonl`: decoupling constant. `nodesearch.py`, `ns_*.log`: node search.
- `ef_lp.py`, `sweep.py`, `sweep.log`, `out/lp_{zeta,twist,liou,Ea}_{T}_{L/L*}.json`, `table.py`, `lp_tables.md`: LP sweep.
- `cert_arb.py`, `cert_arb_run1.log`, `cert_arb_1e6.log`: Arb re-verification of duals and primal Pick checks.
- `ctrl_pick.py`, `ctrl_pick.log`, `ctrl_pick.json`: Pick matrices of DH and `E_a`. `run_dh.py`, `dh_lp.log`, `dh_*.json`: DH LP
  (script copied from stack-feasibility). `lib.py`, `lp.py`: copied from stack-feasibility.
