# REFEREE.md: c16-amplifier-below-truncation-eisw-compute

This file has two parts. Part I is the independent adversarial referee report (lens: general, 2026-11-19),
written by a different agent from the lane author with its own derivations and its own scripts. Part II is the
lane author's earlier same-agent second pass, kept unchanged below for the record.

# Part I. Independent referee report

Verdict of this referee: **holds, with corrections to the wording of the closure** (section 5). Every step
labelled PROVED was re-derived and confirmed. The measured tables were recounted from the jsonl files and
agree. No statement about zeros of zeta is made, nothing assumes RH, nothing restates verified height.
Requirement flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## 1. PROVED steps, re-derived by hand

| step | re-derivation | result |
|---|---|---|
| Lemma U (a) | `T_m psi(y) = m^(-1/2) sum_(ad=m) sum_(b mod d) psi(ay/d) = sum_(ad=m) (a/d)^(-1/2) psi(ay/d)`; for `psi = y^e 1_(y>T)` this is `sum (a/d)^(e-1/2) y^e 1_(y>Td/a)`; `e = w` gives `(a/d)^nu`, `e = 1-w` gives `(a/d)^(-nu)`. `T_m` commutes with the sum over `Gamma_inf \ Gamma` (classical). (U1) follows from `T_m f = lambda(m) f` | confirmed |
| Lemma U (b) | `Im gz = y/((cx+d)^2 + c^2 y^2)`; integrating x over R absorbs d/c, leaving phi_E(c) classes; `Im gz <= 1/(c^2 y)` gives support `y < 1/(c^2 h)` | confirmed |
| Lemma U (c), (U2) | `x^2 = y(1 - c^2 u y)/(c^2 u)`, two branches, `dx = sqrt(y) du / (c u^(3/2) sqrt(1 - c^2 u y))`; substitution `t = c^2 u y`, exchange of the t and y integrals: `I = c^(-2a)/(bbar-a) [ (c^2 h_j)^(a-bbar) Bq(bbar-1/2) - h_i^(bbar-a) Bq(a-1/2) ]`. The denominators `bbar - a` are `-2i Im w` or `+-(1 - 2 Re w)`, non-zero for sigma != 1, t != 0. The 2F1 form of Bq follows from the binomial series of `(1-r)^(e-1)`. The code `amp.py` uses the roles of `h_i, h_j` swapped against the text and is consistent with the formula | confirmed |
| crossing rule | region `{y > h_i, u > h_j, c^2 u y < 1}` is non-empty iff `c^2 h_i h_j < 1`; the three listed consequences (`m <= T^2`, `m <= T`, `N <= T`) follow from the smallest height products `T^2/m`, `T^2/m^2`, `T^2/N^2` | confirmed |
| Lemma U (d), (G) | `sum_(ad=m) (a/d)^(-nu) = lambda(m)` so `Psi_m = lambda(m) c0` above `y = H >= TN`, hence `v_m = lambda(m) Lambda^H f + E(Phi_m)`; constant term of `Lambda^H f` equals `c0` on `(1/H, H]`; `supp Phi_m` in `[T/N, H]` and `H >= N/T`; the upper cut H does not enter crossing terms because `u < 1/(c^2 h_j) <= N/T <= H`; Maass-Selberg at `H >= 1` | confirmed |
| Proposition T | for T >= N all heights are >= 1; on F the non-trivial cosets have `Im gz <= 1`, so `v = lambda_x f` on F below y = 1 and `g_x` depends on y alone on the strip; `c_x = 0`, `q = abs(lambda_x)^2 (S + L) + p_x`, `S + L = M` | confirmed |
| Proposition CAP | at kappa = 1 the amplified inequality is `q - norm(v)^2_Sigma >= 0`, true since Sigma is inside F; along the true ray the excluded set is an interval from 0 not containing 1 (both signs of `q - p_x` checked); worst phase is no larger; divide by `r_0^2 = L/M` | confirmed; see remark 5.3: the statement is the fact that a valid lower bound cannot exceed the true value |
| `G_opt <= MS(T)/MS(T/N)` for T >= N | `norm(v)^2 >= abs(lambda_x)^2 [mass of f on F below T/N + mass of Nc above T/N] = abs(lambda_x)^2 MS(T/N)` by orthogonality of Nc to functions of y | confirmed (this is the c15 statement) |

## 2. Numerical checks run by this referee (scripts in a scratch directory outside the repo; local, `scripts/memcap.sh 8`)

**2.1 Hecke relations on the closed-form Gram matrix (new test, not in the lane).** `T_n` is self-adjoint and
`T_m T_n = sum_(d | (m,n)) T_(mn/d^2)`, so formula (G) must satisfy
`P[m,n] = sum_(d | (m,n)) P[mn/d^2, 1]`. This compares different configurations of truncation heights and
different crossing cosets, and uses neither quadrature nor the lane's direct code. Run with `amp.gram`, 300 bits,
N = 24, the 20 pairs `2 <= m <= n`, `mn <= 24`, at four points (zero 7; `0.85 + i gamma_5`; `1/2 + 23.7i`; the
formal point `0.95 + i gamma_9` with A = 0) and T in {1, 3/2, 2, 7/3} (non-integer T is not in the lane's grid):
largest relative defect `1.5e-82` over 16 runs (up to 40808 crossing terms per run). Formula (G) passes.

**2.2 (U2) against the defining double integral in (x, y), different cases.** mpmath, 25 digits, zero 7,
sigma in {0.5, 0.93}, `(c, h_y, h_u)` in {(1, 3/7, 5/4), (2, 1/9, 4/3), (5, 1/30, 1), (3, 1/6, 1/3)}, four exponent
pairs: 32 values, largest relative difference `2.1e-14` (limited by the nested quadrature). Passes.

**2.3 Gain in cells outside the lane's grid (arb, 400 bits).**

| T | N | zero | G_opt/N^delta | factor against T >= N |
|---|---|---|---|---|
| 3 | 12 | 1, 2, 20, 37 | 0.94175, 0.94704, 0.92290, 0.95206 | 1.00470, 1.00167, 0.99949, 0.99992 |
| 3/2 | 9 | 1, 5, 60 | 0.96120, 0.96734, 0.94259 | 0.99999, 0.99824, 1.00001 |
| 1 | 16 | 1, 2, 3 | 0.96032, 0.95942, 0.95743 | 1.00411, 1.00072, 0.99926 |
| 1 | 64 | 1, 2 | 0.97302, 0.98060 | 1.00807, 1.00478 |

All balls below 1. All factors inside the claimed interval [0.987, 1.0094].

**2.4 Control EIS-w, run by this referee in new cells.** (3, 12): `0.97 + i gamma_3` gives 1.3370 `N^delta`
(0.765 of `R_gen`); midpoint 20/21 gives 0.9498; t = 30 gives 0.9705. (1, 16): midpoint 20/21 gives 1.154,
t = 30 gives 1.075, `0.7 + i gamma_20` gives 1.0026 (0.830 of `R_gen`), `0.97 + i gamma_3` gives 1.5285 (0.551
of `R_gen`). (12, 12), regime T >= N: `0.97 + i gamma_3` gives 1.1397 (0.761 of `R_gen`). The formal point
`0.97 + i gamma_3` with A = 0 gives 0.99675, 0.99734, 0.99674. Same pattern as RESULT.md section 4.3: the control
exceeds `N^delta` at some points and stays below `MS(T)/MS(T/N)` where that is defined.

**2.5 Recount of the tables from the jsonl files (own script).** `grid.jsonl`: 660 rows; 132 Z rows, all certain
below 1, largest upper end 0.991924; 528 control rows, 394 certain above 1, none undecided; 438 rows with
`R_gen` defined, largest `G_opt/R_gen` 0.92088; crossing factor at Z rows 0.98686 to 1.00846. `grid_extz.jsonl`:
844 Z rows below 1 (largest 0.992116), 56 errors; 841 E rows, 343 above, 498 below, 56 errors.
`grid_formal.jsonl`: 463 rows below 1, largest 0.999836. `grid_extn.jsonl`: 12 rows below 1, largest 0.992357.
`s2.jsonl`: 117 rows, largest `sup R2` 1.46351, largest `sup R2true / cap` 0.99987, largest L defect 3.6e-12.
All counts in RESULT.md agree.

## 3. Code reading

- `checks.py` C1 is not circular: M from Maass-Selberg (arb), L from a Bessel tail integral, S from
  two-dimensional quadrature; three separate computations.
- `s2.py`: the two quadratics and their roots match Proposition CAP's set-up (`a r^2 + 2 b r - c`, worst phase;
  `a r^2 - 2 b_t r - c`, true phase). `d['delta']` is `1/M`, so the normaliser is `L/M = r_0^2`; correct, the
  variable name is misleading.
- `run_grid.py`: at Z points A is set to 0 exactly and t is the ball from `acb.zeta_zero`; the verdict is a
  ball comparison. No float64 enters S1.

## 4. Scope checks required by the assignment

- RH assumed anywhere: no. The on-line zeros are the first 300 computed zeros; formal rows are labelled as values
  under a hypothesis.
- Verified height restated: no.
- Known theorem presented as new: Lemma U is an assembly of classical facts (Hecke action on pseudo-Eisenstein
  series, constant term by Bruhat cells, Maass-Selberg); RESULT.md labels the ingredients CLASSICAL. The closed
  form (U2) is a routine computation; it is presented as a lemma of the lane, not as a theorem about zeta. Acceptable.
- Zeta-only mechanism claimed: none. The lane states the opposite (EIS-w shares every effect). Controls other than
  EIS-w were not run; R3 is false.

## 5. Errors and overstatements found

5.1 **"Item closes" is stronger than the evidence.** For T < N the bound `G_opt <= N^delta` at a zero is measured,
not proved. Coverage: T <= 4, N <= 128, on-line zeros with gamma <= 541 (zeros 1 to 271 complete, 272 to 300 with
56 failures), formal rows only at heights gamma_1 to gamma_12 (t <= 56.5) with delta >= 0.01. The c15 device
operates at large gamma with `delta < (log log gamma + C)/log gamma`; that regime (small delta together with
large height, and N growing with gamma) is not sampled by any row. The correct record is "no gain beyond
`N^delta` in the measured range; closure for all N and all heights is OPEN", not "closes". RESULT.md says this in
weakest step 1 but the verdict line and the claim line do not.

5.2 **The registered decision rule fired and was overridden by the lane itself.** `PREREG.md` section 7 names
"R2 > 1 by more than the quadrature error at some zero" as a stage-A candidate; it occurred at 12 of 12 zeros in
every T < N cell. The lane's reasons for setting it aside are sound in substance (5.3 and the EIS-w rows), but a
lane cannot retire its own registered clause. The campaign record should read: "registered stage-A clause fired;
disposition proposed by the lane and accepted by referee N" rather than "no candidate".

5.3 **Proposition CAP carries no information beyond validity.** `R2true <= M/L` says only that a valid lower
bound for `abs(xi(2 - rho))^2` cannot exceed the true value, written in units of the unamplified bound. It is
correct, but "PROVED cap" should not be read as a structural limit on the amplifier: the content is that the
unamplified device loses the factor `M/L` at its positivity step and the amplified one can recover part of it.
Whether `M/L` stays bounded at large height or at a hypothetical zero with small delta is not examined (12 zeros
only); if `S/M` tended to 1 the recoverable factor would be unbounded. The sentence that S4 and S5 of c15 set the
exponent and are unaffected is taken from c15 and was not re-derived here or by this referee.

5.4 **Trend statement at zero 1, T = 1 is not monotone.** RESULT.md reads the margins 0.0356, 0.0279, 0.0252 at
N = 8, 32, 128 as "shrinks slowly" and the factors 1.0066, 1.0074, 1.0094 as "grows slowly". With the referee's
cells N = 16 and 64 the sequences are: margin 0.0356, 0.0397, 0.0279, 0.0270, 0.0252; factor 1.0066, 1.0041,
1.0074, 1.0081, 1.0094. Five points, not monotone; no extrapolation in N is supported in either direction.

5.5 **"EIS-w exceeds N^delta in 394 of 528 rows" is a comparison against the wrong scale for the control.** Off
a zero `N^delta` is not the bound the argument gives; the count mixes the generic effect with small `MS(1)` at
midpoints (up to 5.93). The statement that carries weight is `G_opt <= MS(T)/MS(T/N)`, which is PROVED only for
T >= N, MEASURED for T < N, and undefined in 90 of 528 rows. For R3 purposes this is one control, passing; it
shows no step reads `phi = 0`. It does not show an obstruction for the other controls.

5.6 **Minor.** (i) The claim line says "matches quadrature to 1e-14"; the lane's own C3 values reach 2.7e-14
at (1, 8) and 6.4e-14 at (2, 16). (ii) The interval [0.987, 1.0094] combines the registered grid (0.98686 to
1.00846) with the (1, 128) extension (1.0094); the claim line attributes it to the 132 cells. (iii) Registered
targets C2 (1e-20) and C6 (20 values) were not met; reported by the lane. (iv) S2 is float64 with a local
optimiser, N <= 8; every `sup` is a lower bound; the finding `R2 > 1` is robust to that, the sizes are not
certified. (v) The (1, 512) probe is empty and 56 + 56 extension rows failed; reported by the lane.

None of 5.1 to 5.6 breaks a PROVED step.

## 6. Surviving claim (as this referee would enter it)

No statement about zeros of zeta. PROVED: Lemma U (action of `T_m` on `Lambda^T E*(z, s/2)`; crossing rule
`c^2 h_i h_j < 1`; closed Gram formula (G) for all T >= 1, N, sigma != 1), Proposition T (`R2 = 1` for T >= N),
Proposition CAP (`R2 <= M/L`, a validity statement). Formula (G) additionally satisfies the Hecke relations to
1e-82 (referee check). MEASURED (arb balls): `G_opt < N^delta` at on-line zeros in every computed row with
T <= 4, N <= 128, gamma <= 541, and in 463 formal rows with delta >= 0.01 at t <= 56.5; crossing factor within
[0.987, 1.0094]. MEASURED (float64): `sup R2` between 1.04 and 1.46 for T < N, N <= 8, also at EIS-w points.
OPEN: `G_opt <= N^delta` for all N with T < N; the large-height small-delta regime; boundedness of `M/L`.
Family 31 item "T < N": computed, no gain beyond `N^delta` found in the stated range; closed as a measured
obstruction on that range, not as a proved one. The registered stage-A clause fired; disposition needs a decision
outside the lane.

## 7. Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | Hecke multiplicativity is used to compute, not to reach a conclusion; the outcome is that the amplifier adds bounded constants |
| R2 | false | finite grid of heights and N; no uniform statement |
| R3 | false | one control run (EIS-w), and it passes every step; no control fails |
| R4 | false | nothing reaches the critical line; the device's range is unchanged |

---

# Part II. Same-agent second pass (lane author; kept unchanged)

# REFEREE.md: second pass on c16-amplifier-below-truncation-eisw-compute

Status: **same-agent second pass with separate code paths. Not an independent referee.** No agent-launch tool
was available in this session; the debt (one independent referee before any row is entered in the map) is
recorded in `lane_line.json`.

## What was rechecked, and how

| item | method (different from the first pass) | result |
|---|---|---|
| R-1. Verdict cells of S1 | `ref_checks.py`: the Gram matrix by direct two-dimensional quadrature over F (Fourier expansion with K-Bessel values, explicit coset sums; no Maass-Selberg, no unfolding, no incomplete beta), `G_opt` by a float64 solve, compared with the arb rows of `grid.jsonl`. Cells (1, 2), (2, 4), (1, 8); 12 zeros, 3 E points, 2 O points each (51 rows) | largest `abs(ratio_quadrature - ratio_grid)` = 3.7e-11 (`ref_checks_small.json`). The norm `||Lambda^T f||^2` in the numerator was also taken from quadrature |
| R-2. Formula (U2) for the crossing term | `ref_u2.py`: mpmath, 30 digits, the defining double integral in the original coordinates (x, y) against the closed form with `Bq` by `mp.quad`; c in {1, 2, 3}, four exponent pairs, four parameter sets (16 values) | largest relative difference 3.9e-17 (`ref_u2.json`) |
| R-3. Lemma U (a) | first-pass check C2 already works from the definition of `T_m` (sum over `(az + b)/d`, reduction to F); reread: the reduction uses only automorphy of `Lambda^T f` for `T >= 1` and the uniqueness of the coset with `Im g z > 1` | holds; 1e-14 |
| R-4. Proposition T | `s2.py` at (2, 2), zero 1 and E point 1: `R2 = 1.0000000000000002` for the named amplifiers, optimiser cannot leave 1 (1 + 8e-15) | holds |
| R-5. Proposition CAP | reread of the proof (below); scan of `s2.jsonl` for rows with `sup R2true` above `M/L` | proof holds; no row above the cap (117 rows) |
| R-6. Counts in RESULT.md | recomputed from the jsonl files by `analyse.py`, `analyse_ext.py`, `analyse_s2.py` | one count was wrong in the draft (370 for 394 rows exceeding `N^delta` at control points) and was corrected before this file was written |

## Reading of the proofs

Lemma U (b), (c). The constant term of a pseudo-Eisenstein series with compactly supported bounded psi is a
finite sum per y; the change of variable from x to `u = Im g z` at fixed y is two-to-one, with
`dx = y / (c^2 u^2 abs(x)) du` on each branch; the algebra to (U2) was redone by hand and agrees with R-2.
The condition `c^2 h_i h_j < 1` is the non-emptiness of `{y > h_i} cap {y < 1/(c^2 h_j)}`. Holds.

Lemma U (d). Three things are used: (i) `Lambda^H f` is the classical truncation for `H >= 1` (true: at most one
coset has `Im g z > 1`); (ii) its constant term is `c0` on `(1/H, H]`; (iii) `Phi_m` is supported in `[T/m, H]` and
`T/N >= 1/H`. With `H = max(TN, N/T)`, (iii) holds with equality allowed at the endpoint, which has measure
zero. The independence of H (C4, 1e-122) is a strong check of (ii) and (iii) together. Holds.

Proposition CAP. The step "the true kappa is never excluded" needs `Sigma` inside F (true) and nothing else.
The step `r_x <= r_x^true` compares two quadratics with the same leading and constant coefficients and linear
coefficients `+2b` and `-2 b_t`, `abs(b_t) <= b`; the first is the larger on `r > 0`, so it leaves the negative
range first. If the leading coefficient `q - p_x` is not positive the excluded set along a ray is still an
interval starting at 0 that cannot contain 1. Holds. The proposition does not say that `M/L` is bounded in the
height; RESULT.md says so (weakest step 2).

## Points a referee should press

1. **The registered decision rule.** `PREREG.md` section 7 names "R2 > 1 at some zero" as a stage-A candidate.
   That event occurred. RESULT.md reports it and argues that the clause was mis-specified (no cap, no control
   comparison). A referee may disagree about whether a lane may set aside its own registered clause; the facts
   are not in dispute: `R2 > 1`, bounded by `M/L`, present at EIS-w points.
2. **S1 at zeros is not a theorem for T < N.** 132 + 844 + 12 ball statements and 463 formal ones. The margin at
   zero 1, T = 1 shrinks with N (0.036, 0.028, 0.025) and the crossing factor grows (1.0066, 1.0074, 1.0094). The
   text "holds in every cell" must not be read as "holds for all N".
3. **E points.** At midpoints of zeros `MS(1)` can be small (the truncated mass at T = 1 off resonance), which
   inflates G (up to 5.93 `N^delta`). The count "394 of 528" mixes this effect with the generic one. The
   statement that survives is the comparison with `MS(T)/MS(T/N)`, which is proved only for T >= N.
4. **Formal rows.** They use A = 0 at a point that is not a zero. They are the values of formula (G) under a
   hypothesis and are labelled so; they are not checks.
5. **S2 optimiser.** Local, float64, 43 starts. Every `sup` is a lower bound. Since the finding is `sup R2 > 1`
   and the upper bound is the proved cap, a better optimiser can only move the values toward the cap.
6. **56 + 56 failed extension rows** (zeros and midpoints 272 to 300, "singular matrix in solve" at 400 bits): the
   loss of precision comes from 2F1 with a large imaginary parameter. Not rerun.
7. **Server use.** Up to 12 cores for about half an hour against 8 in the assignment (grid 8 + S2 4, then
   extensions 4 + 4 + S2 4). Memory stayed below 5 GB in total.

## Verdict of the second pass

The lemma, the two propositions and the ball-certified table hold as stated in RESULT.md. The classification
"precise obstruction; item closes" rests on point 1 above being accepted. No statement about zeros of zeta.
