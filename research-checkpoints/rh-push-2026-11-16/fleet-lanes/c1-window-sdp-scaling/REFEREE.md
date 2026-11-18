# REFEREE (adversarial, lens: general): c1-window-sdp-scaling

Date: 2026-11-18. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction (Lead 23 closes; joint window
SDP = explicit-formula LP). All referee runs local, python-flint Arb at 3000 to 4000 bits, through `scripts/memcap.sh 8`;
scratch scripts in `/tmp/ref-c1/` (a.py .. g.py), nothing written in the repo except this file. The compute server was not used.

## Outcome

**The verdict (obstruction, no exclusion gained from the Pick block) holds, with one error in the supporting certificate
and a narrowed scope.**

- PROVED steps (Lemma 1, Lemma 2, Proposition D as a conditional statement, the complex-node remark): re-derived, confirmed.
- **Error E1 (substantive).** The hypothesis of Proposition D, `eps (N_win+7)/2 < 1`, is false at (T, K) = (100, 24) for
  node sets outside the five families of section 3. Nodes of size comparable to T give products 3.7 to 6.4. The statement
  "No node set with product >= 1 was found" reflects a weak search, not the absence of such sets. By the result's own
  weakest-step 1, the cell (100, 24) is reopened as far as the Proposition D certificate is concerned.
- **The conclusion survives E1 by a different criterion** (referee, section 3 below): the LMI holds for every window
  configuration iff `S_out + M D(sigma, t) >= 0` at every single `(sigma, t)`, with `M` the quartet cap. On 22 node sets
  including the ones that break Proposition D, the critical multiplicity of the full quartet term is 61 to 253 against a
  cap of 19.5 (grid values).
- Requirement flags: R1 false, R2 false, R3 false, R4 false. Agree with the result.

## 1. PROVED steps re-derived

**Lemma 1.** `2x_i/(x_i^2+g^2) + 2x_j/(x_j^2+g^2) = 2(x_i+x_j)(x_i x_j+g^2)/((x_i^2+g^2)(x_j^2+g^2))`. Dividing by `x_i+x_j` gives
`2(u_i u_j + v_i v_j)`. Correct. Numerical check (Arb, 5 nodes, gamma = 37/3): difference 0.

**Lemma 2.** `+- i(t - i sigma) = +-(sigma + i t)` and `+- i(t + i sigma) = +-(-sigma + i t)`: the four quartet poles. `P_gamma` has
poles in gamma only at `+- i x_k`, so the Taylor series in the height about real `t` has radius `sqrt(t^2 + x_1^2) > sigma`
(larger than the `x_1` the lemma states; the stated domain is sufficient). `R = P_{t+i sigma} + P_{t-i sigma} - 2 P_t` gives the
stated series. Numerical check: direct four-pole sum equals `Lq` of `pickdec.py` (difference 0); `R / (-sigma^2 P_t'')` = 0.9990
at sigma = 0.3, t = 12.3 (the next term is of relative order sigma^2/t^2). Correct.

**Proposition D.** The chain `S_out + int P_t d mu_0 + sum m_k (2P_{t_k} + R_k) >= S_out + sum m_k R_k >= (1 - eps sum m_k) S_out`
is valid: the first step drops PSD terms, the second uses `-R_k <= ||C^{-1} R_k C^{-T}||_op S_out` and op <= Frobenius.
The count convention matches the LP code (`massF = 2` for an off-line atom, `qm = 2` for the quartet), so the number of
quartets is at most `(N_win + 7)/2`. Correct as a conditional statement. Note the bound is one-sided in nature (only the
negative part of `R` matters) and discards `2P_t`; both losses matter in section 2 below.

**Complex-node remark.** With `a_i = 1/(z_i - w)`: `a_i + conj(a_j) = a_i conj(a_j)(z_i + conj z_j - 2 Re w)`, so the kernel is
`a_i conj(a_j)(1 + 2(a_0 - Re w)/(z_i + conj z_j - 2a_0))`, PSD for `Re w <= a_0 < Re z_i` (Schur product with a Szego kernel).
Correct.

**"The LMI never contains the primes."** True of the formula: the LMI is a function of the zero configuration. Two
qualifications. (i) `S_out` is computed from `zeta'/zeta`, `digamma`: the outside zeros are fixed to zeta's, so prime
data enter through the model, not through the variables. (ii) In the twist control the Pick block is "identical" by
construction (same outside zeros, twisted prime side), so that line of the control table is a tautology, not a test.
The result says as much in 4.2 ("not the data of any function").

Novelty: Lemma 1 is the classical statement that each on-line pair is a positive-real (Pick/Loewner) summand; the
remark is the classical Szego-kernel computation. They are labelled PROVED, not presented as new theorems. Acceptable.

RH is not assumed anywhere. Zeros up to height 1e6 + 35 from `acb.zeta_zeros` are inside verified height and are used as
model data only.

## 2. Numeric rerun with different cases

Reproduction and new cases of `pickdec.run` (3000 bits, sigma in {0.13, 0.41, 0.5}, off the result's sigma grid):

| T | K | nodes | N_win | eps max | at | product |
|---|---|---|---|---|---|---|
| 100 | 24 | lin (t step 0.25) | 32 | 1.6535e-2 | (0.5, -26) | 0.322 (reproduces the table entry) |
| 300 | 12 | lin | 44 | 8.36e-8 | (0.5, -35) | 2.1e-6 |
| 300 | 24 | top | 44 | 9.31e-6 | (0.5, -35) | 2.4e-4 |
| 3000 | 24 | top | 69 | 2.89e-9 | (0.5, -35) | 1.1e-7 |

`eps` proportional to `sigma^2` confirmed at the off-grid sigma values (ratios 0.0676, 0.672 against 0.13^2/0.25, 0.41^2/0.25).
The new heights 300 and 3000 fit between the tabulated rows.

**E1. Node sets outside the five families (referee `b.py`, `d.py`, `e.py`; T = 100, K = 24, sigma = 1/2, Arb 3000-4000 bits).**
A 70-member scan of linear and geometric families, then four hill climbs:

| nodes (K = 24) | eps (Frobenius, Arb upper bound) | product eps x 19.5 |
|---|---|---|
| 65, 66, ..., 88 | 0.292 | 5.7 |
| 100, 100.2, ..., 104.6 | 0.237 | 4.6 |
| 80, 82, ..., 126 | 0.216 | 4.2 |
| geometric 65 .. 135 | 0.205 | 4.0 |
| hill climb from 65 + i | 0.327 | 6.4 |

The one-sided quantity that Proposition D actually needs fails too: for nodes 65 + i, `S_out + m R(1/2, T - 32)` stops
being positive definite at m = 4.8; for 55 + i/2 at m = 5.7; ten of sixteen linear families tested have a critical m
below 19.5. So this is not an artefact of the Frobenius norm: the step "drop `2P_t`, dominate `R` by `S_out`" is not
available at (100, 24) for these node sets. `S_out` and `S_true` are positive definite at these nodes (Arb Cholesky).

The result's own search at T = 1000, K = 24 returned max eps 1.87e-8, below the 1.08e-7 of its own `top` family at the
same cell: the hill climb underperforms a two-parameter family by a factor 6, so its T = 100 maximum (0.40) was not
evidence about the supremum. At T = 1000, K = 24 the near-T families give eps = 3.4e-7 (nodes 965 + i, 1000 + 0.2 i,
965 + 3i), product 1.1e-5: the statement "below 4e-6 for T >= 1000" holds for the five families only; over node sets it is
exceeded by a factor 3. The margin there is still five orders of magnitude and critical multiplicities are about 7e6.

At K = 12, T = 100 the same node sets give products 0.018 to 0.023: that cell stands.

## 3. What survives at (100, 24): a direct criterion

The set `{(m_k) : S_out + sum m_k D(sigma_k, t_k) >= 0}` is convex and on-line mass only adds PSD terms. Hence the LMI holds
for every window configuration with at most `M` quartets iff `S_out + M D(sigma, t) >= 0` for every single `(sigma, t)` in
the window region. This keeps the `2P_t` term that Proposition D discards and needs no norm.

Referee runs (`f.py`, `g.py`; Arb Cholesky at the lower bisection endpoint; t on the integer grid; cap M = 19.5):

| nodes (T = 100, K = 24) | min over t of critical m, sigma = 1/2 | sigma = 3/8 | sigma = 0.2 |
|---|---|---|---|
| 65 + i | 69.6 | 124.8 | 442 |
| 55 + i/2 | 63.1 | 113.2 | 401 |
| 0.6 + i/2 (the result's `lin`) | 253 | | |
| 19 further linear families, start 10 .. 135, step 0.1 .. 6 | 60.8 .. 183 | | |

All 22 node sets pass with margin at least 3.1. In addition the 17 saved LP-feasible configurations at T = 100
(`out/lp_zeta_100_*.json`, up to 37 units of off-line mass) pass Arb Cholesky at K = 12 and 24 on nodes 65 + i and 55 + i/2
(68 of 68, plus 34 of 34 on `lin` as a reproduction of the result's check).

Status of the cell (100, 24) for arbitrary node sets: the Proposition D certificate fails; the direct criterion passes
on every node set tried (grid values, margin 3.1); a node-uniform statement is OPEN. For T >= 1000 nothing changes in
substance.

## 4. Controls rerun

- Davenport-Heilbronn: `ctrl_pick.log` re-read: positive definite at K = 6, 12, 24 on four node sets; the DH LP log shows
  the true delta = 0.3085 feasible at L = 2.1, 4.2, 5 and the only feasible scanned delta at L = 5. The program accepts
  DH with DH's data, so no step separates zeta from DH. Consistent with R3 false. Not re-solved here.
- Structural rerun: the direct criterion of section 3 depends on the zero configuration only, so it is the same
  computation for any prime side; the decoupling at near-T nodes (my runs) used no prime-side input beyond `S_out`.
- Sign twist: the LP tables in `lp_tables.md` show exclusion sets from the same bandwidth; the Pick line of the control is
  tautological (section 1).
- `E_a`: the real-node Pick failure at order 8 comes from the lowest quartet, as stated; the joint SDP for `E_a` was not
  solved, as stated.
- Backward heat, unimodular twist, T-NR, Beurling, phase-rotated transfer, theta^w: not run in the result. Not needed for
  a negative verdict; R3 is false in any case.

## 5. Other findings

1. **Counts.** The logs contain 47 dual lines and 469 primal lines; after removing the T = 1e6 entries that appear in
   both logs the unique counts are 40 of 40 and 445 of 445, all PASS, maximum off-line mass 139.0. The stated counts are right.
2. **Bisection assumes a monotone excluded set.** The DH log at L = 4.2 is feasible on [0.25, 0.3085] and infeasible on
   both sides, so excluded sets are not up-sets in general. `delta*` as "infimum of excluded displacements" obtained by
   bisection is MEASURED and model-dependent; the result labels thresholds MEASURED, but the equality "joint = LP at each
   threshold" in section 5 covers one delta per cell, the rest rests on Proposition D (or on section 3 above).
3. **Meaning of "all".** The base model is feasible in those rows, and delta -> 0 is a double on-line zero at the midpoint.
   "all" therefore says that no additional pair, on or off the line, fits at that position within count slack 7. It is a
   position-resolution statement, not an exclusion radius around an existing zero. The text is consistent with this
   but the heading "exclusion radius" overstates it.
4. **Threshold law.** "all exactly when gap x L/pi > 1" rests on five entries (1.52, 1.39 -> all; 0.63, 0.87, 0.39 -> numbers).
   Consistent, MEASURED, not a law.
5. **Grid.** `pickdec.py` defaults to t step 5 when run from the command line; the table's argmax values (-26, -27, -11)
   show step 1 was used, as stated. My t step 0.25 rerun returns the same maximum at (100, 24, lin).
6. `Ltrue` is non-finite at x = 1/2 (s = 1); a node set containing 0.5 exactly reports as "not positive definite or
   non-finite". Not hit by the result's families.

## 6. Requirement flags (set by the referee)

- R1 false. No step uses multiplicativity; the LMI sees zeros only and the LP reads the prime side as numbers.
- R2 false. Per-window computation; no exclusion below `L*`; cost grows with T.
- R3 false. DH is accepted at its true configuration; twisted prime sides give the same kind of exclusion sets.
- R4 false. Finite windows, finite order; no passage to the critical line.

## 7. Surviving claim

Lead 23 closes as an obstruction: in the model of section 1 (outside zeros fixed to zeta's), the real-node Pick LMI of
order K <= 24 adds nothing to the explicit-formula LP. Established: PROVED structure (linearity, on-line monotonicity,
`D = 2P_t + R`); GRID-CERTIFIED domination for the five node families at all 15 cells (product 0.32 at (100, 24), below
4e-6 for T >= 1000); CERTIFIED 445 of 445 LP-feasible points pass Pick, 40 of 40 duals on the grid. Corrections: at
(100, 24) the Proposition D hypothesis fails for node sets near T (product up to 6.4), and the T >= 1000 bound over node
sets is 1.1e-5 rather than 4e-6; at (100, 24) the conclusion rests on the direct single-quartet criterion
(critical multiplicity >= 61 against cap 19.5 on 22 node sets, grid values), and node-uniformity there is OPEN.
No statement about zeros of zeta is made or supported.
