# s6-sextic-rows-zero-free-input-audit: screening of four combinations (2026-11-20)

Scope: `tmp/research-2026-11-16/push/s6-sextic-rows-zero-free-input-audit/` only. Nothing committed or pushed. No statement about
zeros of zeta is claimed. Labels: PROVED (elementary argument given), CLASSICAL (cited), MEASURED (float64 unless stated; the
extremes of combination 4 were recomputed with 128-bit ball arithmetic), MODEL (exponent bookkeeping, no certificate), N (not
formulable). Verdict: **four combinations tested, no survivor.**

In one paragraph. (1) Sums of sextic Gauss sums against cubic rows built from an object's coefficients have the same exponent in X
for zeta, two Dirichlet characters, Davenport-Heilbronn (DH), two sign twists, the unimodular twist and random coefficients, within
the block scatter; the only object-dependent effect is a polar term that is present when the coefficients have a non-zero mean
(zeta, E_a) and absent for the Dirichlet characters, which sit with the controls. (2) The theta-dual identity holds exactly on all
282,269 squarefree moduli of norm up to 1e6 and has no target factor; the slot quantity weighted by an object's coefficients equals
the unweighted one times mean |a(p)|^2 to within 1% for the characters, DH, the hash twist and random phases; vectors that are
nearly constant over the slot (zeta, unimodular twist, E_a) show an excess of up to 1.5 in three slots. (3) Of the
inputs of the B = 17497733/20000000 system, the mean-value inputs (large sieve, low estimate, theta mean square) are the same for
DH and for a sign twist as for zeta; DH fails the inverse-polynomial identity at n = 4 and the sign twist fails the duality in the
target variable from x = 10, both by their coefficients; this is the definition of the two controls, read at the first index where it
shows. B(delta) is tabulated on 200 values in three models. (4) The prime-side Poisson strength of the lane audit stays positive for
zeta, chi_-4 and chi_5 at every height to 1e12 and every q down to 0.01; DH and the heat controls turn negative at their first
off-line zero to the right of the abscissa and not before; the T-NR control passes everywhere; the sign-twisted primes pass the
chain's budget at q >= 0.09 at the same heights as zeta.

## 0. What was run

| item | size reached | where |
|---|---|---|
| Sextic Gauss sums against rows (combination 1; large sieve of combination 3) | all 2,822,619 squarefree primary moduli c coprime to 6 with N(c) <= 1e7 (exact table `tmp/sextic/data/sf_1e7.npz`); 6,045 columns (all primary n coprime to 6, N(n) <= 2e4); 3 multipliers, 5 row powers, 10 objects | Mac, 2 processes, 7 min |
| Extension of the Gauss-sum table past 1e7 | started for primes up to 3.2e7, then up to 2e7, on the server; stopped (section 7) | server, `rhrun`, 7 cores requested |
| Theta-dual identity (combination 2) | all 282,269 squarefree moduli with N(m) <= 1e6, 24 pairs (s, mu): 5,647,036 exact checks | Mac |
| Slot quantity with object coefficients (combination 2) | levels U = 1e3, 1e4, 1e5, 1e6; squarefree rows (282,269 at 1e6); 9 coefficient vectors; slots of 4 to 512 primes | Mac, 4 runs |
| Inverse-polynomial defect, smooth sums (combination 3) | every n <= 1e8 (defect), x <= 3.16e7 (smooth sums, n <= 6.3e7) | Mac, 15 s |
| B(delta) (combination 3) | 200 values of delta in [0, 1], three models | Mac, 10 min and 2 min |
| Prime-side Poisson strength (combination 4) | 50,851,223 prime powers <= 1e9; 9 windows of 524,288 samples (step 0.05, length 26,214) centred at 1.4e4, 1e5, ..., 1e12; 8 values of q; 7 channels and T-NR | windows 1e10, 1e11, 1e12, 1.4e4: server (`rhrun`, 1 core, 80-bit phases, 29 min); windows 1e5 to 1e9: Mac |
| DH evaluated directly (combinations 3 and 4) | windows at 13,117 (from T = 9.8), 1e5, 1e6; 524,288 samples each; smoothed Dirichlet series to n <= 1.6e7 | Mac |
| DH prime side | Lambda_DH(n) for n <= 1e7; windows at 13,117 and 1e6 | Mac |
| Heat controls, zero side | battery tables (height 2000), T = 20..1900 step 0.01 | Mac |
| 128-bit recheck | 4 extreme samples (heights 1.0e9, 1.0e10, 1.0e11, 1.0e12), all 50,851,223 terms | Mac, 35 s each |

Server use: `rhrun` units only (`rh-s6sx-*`), at most 8 cores requested at any time, at most 11 GB per unit. The server load average
was 101 to 127 on 48 cores during the session. The GPU stage did not run: device 1 had 83 GB in use and the first allocation of
0.9 GB failed (`rh-s6sx-desc-1120115102`); the same code ran on the CPU. All units of this lane are stopped or finished
(`rhstatus` shows none). Local runs went through `scripts/memcap.sh 8`.

## 1. Shared code and its validation

| file | role |
|---|---|
| `t1/rows.py`, `t1/objs1.py`, `t1/rows_an.py`, `t1/rows_extra.py` | combination 1 and the large sieve: shell sums of mult(c) chi_c(n)^j per column, rows R_F(c) per object, fits |
| `t1/gauss6.c`, `t1/run7.sh`, `t1/replan.py` | Gauss periods beyond 1e7 (unchanged copy of `tmp/sextic/gauss6.c`); not completed |
| `t2/ident.py`, `t2/slot_obj.py` | combination 2: identity check; slot model of lane e2-ms-slot-capacity with the battery's coefficient vectors added |
| `t3/audit.py`, `t3/bdelta.py` | combination 3: defect of the inverse polynomial, smooth sums; B(delta) |
| `t4/desc.py`, `t4/collect.py`, `t4/recheck.py`, `t4/validate.py` | combination 4: non-uniform FFT of the smoothed von Mangoldt sum, tables, 128-bit recheck, known-answer check |
| `t4/dh_direct.py`, `t4/dh_prime.py`, `t4/dh_lambda.py`, `t4/heat_zero.py` | combination 4 controls: DH by direct evaluation, DH prime side, growth of Lambda_DH, heat from zero tables |

Checks against known answers (all MEASURED):

| check | result |
|---|---|
| cubic Gauss sums, index 1: exponent of the first moment (Patterson: 5/6) | 0.832 [0.826, 0.836], chi2/dof 133/196; constant 0.1964 +- 0.0024 |
| sextic Gauss sums, index 1 (Kubota: 2/3); fixed random phases | 0.696 [0.642, 0.756]; random: no exponent determined, constant 0.15 +- 0.35 |
| vanishing at exponent 5 (index n^5): mean of abs(c_n)^2 / se^2 over the 6,045 columns | 0.97 (noise level 1; random multiplier 0.93); index n: 9.45, n^2: 3.53, n^3: 1.48, n^4: 1.09 |
| debiased sum of abs(c_n)^2 over N(n) <= L (theta mean square, Theorem A (MS): L^(5/6)) | 1.34, 3.95, 10.27, 29.5, 52.6 at L = 300, 1e3, 3e3, 1e4, 2e4: exponent 0.87 |
| rows R_F(c) (complex64, summed per modulus) against the per-column shell sums | relative difference <= 8e-7 for all 10 objects |
| identity (a), (b) of lane e2-theta-dual-mseries-fe | largest difference 8.3e-15 on 20,000 moduli and 1.7e-15 on 5,647,036 checks |
| slot model, coefficient vector 1, against lane e2 (`I(1)/tr`) | same code; object vectors added after the Gram matrix; liou (a = -1) reproduces zeta to all digits |
| Mertens function from the sieve of `audit.py` | M(1e6) = 212 |
| non-uniform FFT against direct summation (24 values per window, 50,851,223 terms) | relative difference <= 1.9e-6 in every window (half-width 7; 7.3e-10 with half-width 10 on a small case) |
| smoothed sum against zeta: sum Lambda(n)(1 - log n/log N) n^(-s) = -zeta'/zeta(s) - (zeta'/zeta)'(s)/log N + N^(1-s)/((1-s)^2 log N) - sum_rho N^(rho-s)/((rho-s)^2 log N) - (trivial zeros), N = 1e6, 200 zeros, 30 digits | differences 1.5e-8, 2.5e-8, 1.2e-7, 7.7e-7, 2.9e-6 at five points with sigma from 0.875 to 0.55 |
| 128-bit recheck of the minimum of P at q = 0.01 | 1.650701 against 1.650700 (1.0e9); 2.272833 / 2.272833 (1.0e10); 2.740986 / 2.740986 (1.0e11); 3.204741 / 3.204740 (1.0e12); the last three against the server's 80-bit values |
| DH by direct evaluation: cut-off 10 and 20 times 5T/2pi | same values (-22.7157 and -22.7157 at T = 2442.5); first negative P at T in [85.45, 85.95] (known zero 0.8085 + 85.699i) |
| chi_5 by the same direct code | P > 0 at all 1,572,864 samples and every q (minimum 0.039) |
| pi(1e9) from the sieve of `desc.py` | 50,847,534 |

## 2. Table

"pass" = no failure found up to the stated size (never a proof). Controls: DH; heat tau < 0; sign-twisted primes (hash sign twist,
completely multiplicative; Liouville twist); unimodular twist n^(-i alpha), alpha = 1.2393; E_a = zeta(s+a) zeta(s-a); T-NR at
q = 1000003 (c = 2.2). Comparison L-functions: chi_-4 and chi_5.

| combination | statistic | sizes reached | zeta | comparison L-functions | DH | heat (tau < 0) | sign-twisted primes | unimodular twist | E_a | T-NR | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. exceptional term x 7/8 half-plane x metric R1 | exponent in X of S_F(X) = sum over N(c) <= X of gamma_1(c) R_F(c), R_F(c) = sum over N(n) <= L of a_F(N n) N(n)^(-1/2) chi_c(n)^j; block slope +- scatter; free exponent | N(c) <= 1e7 (2.82e6 moduli), L <= 2e4 (6,045 columns) | cubic rows, L = 1e3: 0.78 +- 0.19 (j = 2), 0.82 +- 0.07 (j = 4); saving against Cauchy-Schwarz 0.37 and 0.31 | chi_-4: 0.69 +- 0.20, 0.67 +- 0.14; chi_5: 0.56 +- 0.16, 0.68 +- 0.11 | 0.63 +- 0.12, 0.62 +- 0.12; saving 0.38, 0.37 | N (no coefficients) | hash: 0.62 +- 0.17, 0.69 +- 0.14; Liouville: 0.60 +- 0.08, 0.56 +- 0.14 | 0.59 +- 0.12, 0.90 +- 0.18 | a = 1/4: 0.91 +- 0.39, 0.90 +- 0.09 | identical to zeta (columns have norm < q) | CLOSED: equal exponents within scatter for random rows (0.76 +- 0.09, 0.67 +- 0.09 and 0.71 +- 0.20, 0.75 +- 0.12): blind to the target. The object-dependent part is a polar term that reads the mean of the coefficients; the Dirichlet characters behave as DH and the random rows |
| 2. theta-dual m-series x slot condition x silent cell U6 (c) | (i) the identity; (ii) I(a_F)/(mean abs(a)^2 tr G): slot quantity with a_p = a_F(N p) over its random-phase average | identity: N(m) <= 1e6; slot: U <= 1e6, 4 to 512 mark primes | identity exact (1.7e-15), no target factor; slot 0.998..1.003 in five of the seven slots at U = 1e6; 1.16 and 1.52 in the slots (0.4, 0.45) and (0.3, 0.3) | chi_-4, chi_5: 0.995..1.009; no excess in the two small slots (0.948..1.009) | 0.988..1.007 | N | hash 0.994..1.002; Liouville = zeta exactly (global sign) | 1.001..1.003; excess 1.16, 1.47 as zeta | 0.999..1.004; excess 1.13, 1.51 | identical to zeta (marks < q) | CLOSED, target-blind: the weighted count is the unweighted one times mean abs(a(p))^2. The excess in small slots belongs to vectors that are nearly constant over the slot (zeta, Liouville, unimodular, E_a); the two characters are on the other side |
| 3. B = 0.87488665 certificate x symmetric strip x structural map | first imported estimate numerically false for DH, and the size; B(delta) on 200 values | large sieve: as row 1; defect: n <= 1e8; smooth sums: x <= 3.16e7; DH directly at heights to 1.013e6 | all inputs hold (pole in the smooth sums) | all inputs hold | large sieve 0.94..0.98 (zeta 0.96..1.08); inverse-polynomial identity false at n = 4 (defect -1.0807), sum of abs(D)^2/n = 38.7 at 1e8; duality holds (smooth sums <= 1e-12) | N | large sieve 0.88..0.96; inverse identity exact; duality false from x = 10 (smooth sums 0.05..1.1 sqrt x where chi gives 1e-13) | all inputs hold (it is zeta on a shifted line) | inverse identity false at n = 4 (defect -1); abs(a(2)) = 2.03 > 1 | local roots 1.558 and 0.642 at n = q, not unimodular | CLOSED as a separator: no mean-value input fails for any control; each control fails one coefficient axiom at the first index where it differs. That reads coefficients, but it is a single-index statement and restates what the control is |
| 4. flow-descent hypothesis x Lambda slope per theta x conditional Lambda | min over samples of P = mean - Re sum Lambda_F(n) w(n) n^(-s) at Re s = 1/2 + sqrt(q)/2; q*(X; p) = least q with min P >= p | primes to 1e9, heights to 1e12, 524,288 samples per window, q = 0.5625..0.01 | min P > 0 in every window and every q; q*(X; 4.37) = 0.36, 0.25, 0.16, 0.09, 0.04 at X = 1e8..1e12; q*(X; 2.17) = 0.56, 0.25, 0.16, 0.04, 0.04, 0.01 at X = 1e5..1e10 | same within one grid step: q*(X; 4.37) = 0.36, 0.25, 0.16, 0.09, 0.04, 0.0225 at 1e7..1e12 | direct: first negative P at T = 85.45..85.95 for every q <= 0.36 and at 2442.5 for q = 0.5625; none below. Prime side (n <= 1e7): first negative at 83.75..85.3 for q <= 0.16, none below 80 | zero side: first negative P within 0.15 of the first pair with offset above sqrt(q)/2 (tau = -0.1: 540.4..1329.1; tau = -0.5: 111.5..295.2); none before | hash: q*(X; 4.37) = 0.56, 0.25, 0.16, 0.16, 0.09 at 1e8..1e12 (zeta's values, at most one grid step behind); min P < 0 only at small q (only q = 0.01 at 1e12) | identical to zeta at heights shifted by alpha | a = 1/4: negative for q <= 0.09, positive at q = 0.16 < 4a^2 = 0.25; a = 1/8: negative only at q = 0.01 < 4a^2 = 0.0625 | passes every q and every window (min P 4.6..23.3) | CLOSED: the budget at q >= 0.09 is met by sign-twisted primes at the same heights as zeta (it reads the size of the prime sum against log T); where zeta separates (P >= 0 at small q) the statement is that all zeros near the sample are on the line; DH and heat fail at their first off-line zero and not before; T-NR passes |

## 3. Combination 1: the exceptional term as a sum over moduli (MEASURED)

Nodes: `mem-qrh-7-8`, `qrh-seven-eighths`, `mem-campaign-metric-r1-r4`. Source definitions: `formalization/paper/sextic-theta-proof.md`
sections 1 and 2 (complete Gauss sums g~(y, c) = conj(chi_c(y)) gamma_1(c) for squarefree c prime to y; theta-row form; TRO6), and
`tmp/sextic/` for the exact table.

Finite consequence tested. If the exceptional term carried information about the target, the sum

    S_F(X) = sum over squarefree primary c, (c, 6) = 1, N(c) <= X of gamma_1(c) R_F(c),
    R_F(c) = sum over primary n, (n, 6c) = 1, N(n) <= L of a_F(N(n)) N(n)^(-1/2) chi_c(n)^j

(gamma_1 the normalised sextic Gauss sum, chi_c the sextic symbol; j = 2 and 4 are the two cubic rows, j = 5 the sextic row; exchanging
the sums, gamma_1(c) chi_c(n)^j = g~(n^(6-j), c), so S_F is a row-weighted sum of first moments of sextic Gauss sums at the indices
n^4, n^2, n) would have an exponent in X that differs between zeta and the controls, and random coefficients of the same modulus
would give a third value. Survival would need zeta and the two characters to agree, and every control to differ by more than the
scatter between dyadic blocks. Objects act on the columns through the norm, as in lane s4: a_F(m) = 1; chi_-4(m); chi_5(m); DH's
coefficients (period 5); the hash sign twist and the Liouville function; m^(-i alpha); the coefficients of zeta(s+1/4) zeta(s-1/4);
a random completely multiplicative unimodular function; an independent random phase per column. Heat: N. T-NR: identical to zeta
because every column norm is below q.

Statistics: (A) sup of abs S_F on the 8 dyadic blocks (X/2^(i+1), X/2^i], slope of log2 sup against the block index, and the standard
error of the 7 local slopes ("scatter"); the free exponent of a weighted fit on 100 geometric shells with its Delta chi^2 = 1
interval; (B) the saving against Cauchy-Schwarz, s = log(count sqrt(l2) / abs S_F(X)) / log X with l2 = sum abs(a)^2/N (0.5 minus
a correction is the square-root value; 0.46 here because count = 0.28 X); (C) the theta-row correlation against Cauchy-Schwarz,
r_CS(F, L) = abs(sum a_F(n) N(n)^(-1/2) c_n) / (sqrt(l2) sqrt(sum abs(c_n)^2 - K se^2)), c_n the fitted X^(2/3) constant of
column n (the stripped sextic theta coefficient at index n^(6-j) in the first-moment normalisation, standard error 0.032 each).

(A), (B): block slope +- scatter; free exponent [interval]; saving s. X = 1e7.

| rows, L | zeta | chi_-4 | chi_5 | DH | hash | Liouville | unimodular | E_a (1/4) | random mult. | random indep. |
|---|---|---|---|---|---|---|---|---|---|---|
| cubic j = 2 (index n^4), L = 1e3 | 0.78 +- 0.19; 0.77 [0.69, 0.86]; 0.371 | 0.69 +- 0.20; 0.72 [0.62, 0.85]; 0.400 | 0.56 +- 0.16; 0.78 [0.68, 0.91]; 0.377 | 0.63 +- 0.12; 0.69 [0.62, 0.78]; 0.383 | 0.62 +- 0.17; 0.55 [0.47, 0.63]; 0.432 | 0.60 +- 0.08; 0.65 [0.58, 0.72]; 0.390 | 0.59 +- 0.12; 0.73 [0.63, 0.86]; 0.391 | 0.91 +- 0.39; 0.94 [0.78, 1.00]; 0.396 | 0.76 +- 0.09; 0.77 [0.70, 0.86]; 0.366 | 0.67 +- 0.09; 0.71 [0.64, 0.78]; 0.369 |
| cubic j = 2, L = 2e4 | 0.76 +- 0.16; 0.87 [0.77, 1.00]; 0.373 | 0.71 +- 0.23; 0.69 [0.59, 0.80]; 0.405 | 0.53 +- 0.22; 0.80 [0.69, 0.99]; 0.376 | 0.67 +- 0.09; 0.69 [0.62, 0.79]; 0.390 | 0.50 +- 0.21; 0.45 [0.36, 0.54]; 0.426 | 0.73 +- 0.09; 0.67 [0.60, 0.76]; 0.390 | 0.50 +- 0.09; 0.56 [0.45, 0.67]; 0.415 | 0.70 +- 0.36; 1.00 [0.85, 1.00]; 0.420 | 0.68 +- 0.07; 0.66 [0.59, 0.76]; 0.394 | 0.73 +- 0.09; 0.75 [0.68, 0.84]; 0.367 |
| cubic j = 4 (index n^2), L = 1e3 | 0.82 +- 0.07; 0.78 [0.75, 0.81]; 0.307 | 0.67 +- 0.14; 0.68 [0.63, 0.73]; 0.359 | 0.68 +- 0.11; 0.72 [0.63, 0.83]; 0.383 | 0.62 +- 0.12; 0.64 [0.59, 0.70]; 0.370 | 0.69 +- 0.14; 0.73 [0.66, 0.83]; 0.374 | 0.56 +- 0.14; 0.53 [0.46, 0.59]; 0.413 | 0.90 +- 0.18; 0.80 [0.73, 0.88]; 0.352 | 0.90 +- 0.09; 0.82 [0.79, 0.85]; 0.300 | 0.71 +- 0.20; 0.66 [0.55, 0.80]; 0.420 | 0.75 +- 0.12; 0.69 [0.62, 0.78]; 0.376 |
| cubic j = 4, L = 2e4 | 0.93 +- 0.12; 0.88 [0.84, 0.92]; 0.298 | 0.56 +- 0.10; 0.61 [0.58, 0.64]; 0.350 | 0.74 +- 0.13; 0.83 [0.72, 0.98]; 0.382 | 0.63 +- 0.14; 0.66 [0.59, 0.73]; 0.390 | 0.73 +- 0.12; 0.76 [0.69, 0.86]; 0.373 | 0.58 +- 0.16; 0.54 [0.48, 0.61]; 0.409 | 0.89 +- 0.34; 0.71 [0.63, 0.82]; 0.389 | 1.06 +- 0.21; 1.00 [0.95, 1.00]; 0.300 | 0.65 +- 0.30; 0.70 [0.53, 0.96]; 0.439 | 0.94 +- 0.18; 0.83 [0.71, 0.98]; 0.385 |
| sextic j = 5 (index n), L = 2e4 | 0.89 +- 0.09; 0.77 [0.76, 0.78]; 0.226 | 0.73 +- 0.11; 0.74 [0.65, 0.85]; 0.385 | 0.51 +- 0.27; 0.50 [0.32, 0.69]; 0.482 | 0.64 +- 0.15; 0.69 [0.61, 0.79]; 0.393 | 0.94 +- 0.30; 0.76 [0.66, 0.90]; 0.397 | 0.40 +- 0.14; 0.31 [0.30, 0.44]; 0.481 | 0.90 +- 0.26; 0.94 [0.91, 0.98]; 0.293 | 1.17 +- 0.28; 0.81 [0.80, 0.81]; 0.205 | 0.79 +- 0.17; 0.75 [0.70, 0.82]; 0.360 | 0.54 +- 0.09; 0.62 [0.40, 0.96]; 0.452 |
| random multiplier in place of gamma_1, j = 2, L = 2e4 (null) | 0.52 +- 0.20; s = 0.509 | 0.40 +- 0.34; 0.476 | 0.38 +- 0.37; 0.485 | 0.38 +- 0.23; 0.483 | 0.62 +- 0.19; 0.458 | 0.39 +- 0.31; 0.483 | 0.31 +- 0.18; 0.496 | 0.54 +- 0.43; 0.471 | 0.44 +- 0.22; 0.483 | 0.37 +- 0.24; 0.490 |
| cubic Gauss sums gamma_2 in place of gamma_1, j = 4, L = 1e3 (calibration, 5/6) | 0.86 +- 0.02; 0.85 [0.84, 0.85] | 0.84 +- 0.02; 0.83 | 0.84 +- 0.03; 0.83 | 0.84 +- 0.03; 0.83 | 0.84 +- 0.03; 0.83 | 0.82 +- 0.03; 0.83 | 0.84 +- 0.03; 0.83 | 0.87 +- 0.03; 0.85 | 0.83 +- 0.02; 0.83 | 0.83 +- 0.02; 0.83 |

(C): r_CS(F, L), X = 1e7.

| index, L (columns) | zeta | chi_-4 | chi_5 | DH | hash | Liouville | unimodular | E_a | random mult. | random indep. | random-phase rows (rms of 300) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| n, 300 (88) | 0.387 | 0.147 | 0.097 | 0.153 | 0.081 | 0.067 | 0.225 | 0.464 | 0.167 | 0.053 | 0.133 |
| n, 3,000 (908) | 0.260 | 0.030 | 0.002 | 0.045 | 0.041 | 0.023 | 0.049 | 0.317 | 0.054 | 0.022 | 0.047 |
| n, 20,000 (6,045) | 0.203 | 0.016 | 0.006 | 0.015 | 0.013 | 0.007 | 0.058 | 0.272 | 0.024 | 0.006 | 0.020 |
| exponent in L, 300 to 2e4 | -0.15 | -0.53 | -0.69 | -0.55 | -0.43 | -0.55 | -0.32 | -0.13 | -0.46 | -0.51 | -0.45 |
| n^2, 300 | 0.360 | 0.156 | 0.177 | 0.176 | 0.064 | 0.104 | 0.208 | 0.378 | 0.159 | 0.198 | 0.168 |
| n^2, 20,000 | 0.106 | 0.063 | 0.028 | 0.031 | 0.035 | 0.028 | 0.029 | 0.095 | 0.013 | 0.027 | 0.031 |
| n^4, 300 | 0.339 | 0.262 | 0.319 | 0.316 | 0.276 | 0.299 | 0.296 | 0.191 | 0.372 | 0.367 | 0.298 |
| n^4, 20,000 | 0.161 | 0.120 | 0.163 | 0.149 | 0.113 | 0.153 | 0.112 | 0.057 | 0.145 | 0.198 | 0.139 |

Reading.

1. Exponent. With the cubic rows every object, including the two kinds of random coefficients, has a block slope between 0.50
   and 1.06 with scatter 0.07 to 0.39, and a saving against Cauchy-Schwarz between 0.30 and 0.44 (random multiplier: 0.45 to
   0.63). At index n^4 (j = 2) no object differs from the random rows by more than the scatter, and the theta constants themselves
   are at the noise level there (mean abs(c_n)^2/se^2 = 1.09). The term has a power saving for every row tried: the finite model
   does not see the Cauchy-Schwarz loss that defines the exceptional term, for any object.
2. The one object-dependent effect. At the indices n and n^2 the rows of zeta and of E_a keep a correlation with the theta
   constants that decays like L^(-0.15) and L^(-0.3) (0.20 and 0.11 at L = 2e4), while the rows of chi_-4, chi_5, DH, both sign
   twists and both random rows decay like L^(-1/2) and sit at the random-phase value. The same objects show a larger fitted exponent
   in X at L = 2e4 (0.77 to 1.00 against 2/3). This is the polar term of lanes `r2-tro6-polar-theorem` and `tro6-spectral` (pole
   at 5/6 of the series of theta coefficients): it is present when the column weights have a non-zero mean, that is when the object
   has a pole at s = 1, and for a long row it includes the dual part of the truncated row (Gauss-sum duality in c for smooth
   weights). It reads the mean of the coefficients. The two Dirichlet comparisons are on the controls' side of it, so it does not
   separate objects with zeros on the line from objects with zeros off it.
3. The unimodular twist follows zeta at the index n with a smaller constant (r_CS 0.058, exponent 0.94 [0.91, 0.98] at L = 2e4):
   slowly varying weights keep part of the polar term.
4. Metric R1 (multiplicativity used essentially) is not met at this step: a random multiplicative row and an independent random row
   give the same exponents and the same savings as DH and the characters.

Classification: CLOSED. Equal exponents within scatter for random rows; the term is blind to the target apart from the mean of its
coefficients. The object enters through its coefficients (their mean), not through its zeros.

Size. The assignment asked for X to 3e8. The sextic Gauss sum at a prime of norm p costs p steps (the cube-root ambiguity of the
cubic Gauss sum has no faster evaluation known to this lane), so the table to X costs X^2/(4 log X) steps: 1.2e15 at 3e8, about 43
core-days at the measured 3.3 ns per step on the server. X = 1e7 is the size of the existing exact table. An extension to 3.2e7 and
then to 2e7 was started with 7 processes; the unit received 4.0 and then 1.7 cores, which put completion at 3 to 5 hours, and it
was stopped. The row length L, which is the variable of reading 2, was taken to 2e4.

## 4. Combination 2: theta-dual identity and the slot condition (MEASURED)

Nodes: `theta-dual-mseries-is-twisted-kubota`, `ms-slot-condition-is-reflected-dual-length`,
`silent-u6c-gl3-cover-global-whittaker-constants`. Sources: lanes `e2-theta-dual-mseries-fe` (Lemma 1) and `e2-ms-slot-capacity`
(section 1: r + 2z <= m is the reflected dual length T_d <= F with the mark primes in the conductor, squared; section 3: the
reduced model). The third node is a read class with no computation on file; no test was formulated for it.

(i) Identity. On every squarefree m with N(m) <= 1e6 (282,269 moduli) and 24 pairs (s, mu),
gamma_1(m) gamma_3(m) conj(chi_m(s)) chi_m(mu)^3 = G(m) g~(4^5 s mu^3, m) with G(m) = conj(chi_m(4)) gamma_3(m): largest difference
1.7e-15 on 5,647,036 checks; the product formula over the primes of m: 8.3e-15 on 20,000 moduli. Neither side contains a
coefficient of a target function.

(ii) Slot. In the model of lane e2 (rows u squarefree coprime to 6, N(u) <= U; inverse polynomial M_u of length U^r; one slot of
split primes with U^z/4 < N(p) <= U^z; m = 1), the quantity of manuscript Lemma 17.1 with coefficients a_p is
I_w(a) = (1/R) sum_u w_u abs(n^(-1/2) sum_p a_p chi_p(u))^2. The target can enter only as a_p = a_F(N(p)). Statistic:
I(a_F)/(mean abs(a_F)^2 tr G), where tr G is the average over random phases; the factor mean abs(a)^2 is what the size of the
coefficients predicts. Configurations inside the condition (r + 2z <= 1), in the window 1 - 2z < r < 1 - z, and outside (r + z > 1).

| U, (r, z), primes in slot, position | zeta | chi_-4 | chi_5 | DH | hash | unimodular | E_a | random phase |
|---|---|---|---|---|---|---|---|---|
| 1e6, (0, 0.5), 110, inside | 0.998 | 0.999 | 1.001 | 0.999 | 1.001 | 0.999 | 0.999 | 0.999 |
| 1e6, (0.2, 0.4), 36, inside | 1.001 | 0.998 | 1.003 | 1.005 | 1.001 | 1.002 | 1.002 | 0.998 |
| 1e6, (0.3, 0.3), 10, inside | 1.516 | 0.997 | 0.948 | 0.988 | 0.994 | 1.471 | 1.506 | 1.018 |
| 1e6, (0.3, 0.5), 110, window | 1.003 | 0.995 | 1.003 | 0.998 | 1.002 | 1.003 | 1.004 | 0.999 |
| 1e6, (0.4, 0.45), 64, window | 1.164 | 1.009 | 0.990 | 0.992 | 0.997 | 1.156 | 1.128 | 0.992 |
| 1e6, (0.2, 0.6), 384, window | 1.002 | 0.996 | 0.996 | 1.007 | 0.999 | 1.001 | 1.002 | 0.997 |
| 1e6, (0.5, 0.6), 384, outside | 1.003 | 1.002 | 0.996 | 1.004 | 0.998 | 1.003 | 1.004 | 0.998 |
| 1e5, (0.3, 0.75), 512, outside | 1.070 | 0.979 | 0.984 | 0.990 | 0.990 | 1.053 | 1.069 | 0.998 |
| 1e5, (0.4, 0.45), 24, window | 1.200 | 0.965 | 0.982 | 0.988 | 1.026 | 1.197 | 1.169 | 0.993 |

The Liouville twist equals zeta in every cell (a = -1 is a global sign). The mean of abs(a)^2 for DH is 0.43 to 0.63 in the slots
with 10 or more primes (0.540 for equidistributed residues, abs(a(p)) in {1, 0.284}); the mean of a(p) over a slot is 0.00 to 0.33
in modulus for chi_5 and DH and up to 0.60 for the hash twist in a slot of 10 primes.

Reading. For chi_-4, chi_5, DH, the hash twist and random phases every ratio at U = 1e6 is within 0.9% of 1 (5.2% in the slot of
10 primes), on both sides of the slot condition and in the window: the weighted count is the unweighted count times
mean abs(a(p))^2. The excess 1.07 to 1.52 in the slots (0.3, 0.3), (0.4, 0.45) and (0.3, 0.75) is the effect recorded by lane e2 for a = 1 (the inverse polynomial and the prime sum of the same character
are correlated); it appears for the vectors that are nearly constant over the slot (zeta, Liouville, unimodular twist, E_a) and
not for chi_-4, chi_5, DH, the hash twist or random phases. The slot condition itself is a condition on lengths and has no
coefficient in it.

Classification: CLOSED, recorded as target-blind. No control differs from zeta by more than the factor abs(a(p)) predicts, except
through the mean of a(p) over the slot, and there the Dirichlet comparisons are with the controls. The object enters through its
coefficients at the mark primes (size and mean), not through its zeros.

## 5. Combination 3: audit of the imported estimates by control (MEASURED), and B(delta) (MODEL)

Nodes: `pr14-boundary-certificate`, `qrh-symmetric-strip-lean`, `fifty-routes-structural-map`. Sources:
`formalization/paper/zf-campaign-synthesis.md`, lane `r2-xs-lowestimate-audit` (step table of the Xu-Sang chain),
`sextic-theta-proof.md` (Theorem A).

| # | imported estimate | how the target enters | finite test | zeta | chi_-4, chi_5 | DH | hash sign twist | others |
|---|---|---|---|---|---|---|---|---|
| 1 | cubic / sextic large sieve (Heath-Brown type; manuscript Lemmas 14.2, 15.1; Xu-Sang Prop 3.1) | not at all (l2 norm of the coefficients) | sum over N(c) <= 1e7 of abs R_F(c)^2 / (count l2), cubic rows, L = 300, 1e3, 2e4 | 0.959, 1.027, 1.078 | 0.959, 0.887, 0.879 and 0.959, 0.886, 0.848 | 0.977, 0.942, 0.936 | 0.959, 0.887, 0.878 | Liouville 0.829..0.959; unimodular 0.959..0.998; E_a 0.918..0.957; random 0.88..0.97. Holds for every object |
| 2 | low estimate (Prop 15.2 with the exceptional term, Cauchy-Schwarz) | through abs(a(p)) <= 1 only | rows 1 and 2 of the table of section 2 | holds | holds | holds, same exponents | holds, same exponents | random rows: same exponents |
| 3 | theta mean square M(Q) << Q^(5/6) (Theorem A (MS)) | not at all | debiased sum of abs(c_n)^2, N(n) <= 2e4 | exponent 0.87 (object-independent) | - | - | - | - |
| 4 | inverse polynomial M_u = sum mu(n) psi_u(n) (Lemma 17.1), mollified moments | through complete multiplicativity: (mu a) * a = delta | D_F = (mu a) * a - delta for n <= 1e8 (DH), 1e7 (chi_5, hash) | exact | chi_5: 0 defects below 1e7 (chi_-4: exact by complete multiplicativity, not run) | false at n = 4: D(4) = a(4) - a(2)^2 = -1.0807; 11,468,648 defects below 1e8; sup 69.2; sum over n <= x of abs(D)^2/n = 3.6, 11.3, 23.0, 38.7 at x = 1e2, 1e4, 1e6, 1e8 (0.114 log^2 x) | exact (0 defects) | E_a: D(4) = -1 and abs(a(2)) = 2.03; T-NR: non-unimodular local roots at n = q; unimodular: exact |
| 5 | duality in the target variable (functional equation of the twisted L-function, used when sums with the target are reflected) | through the functional equation | T_F(x) = sum a_F(n) W(n/x), W a smooth bump on [1/2, 2], x = 10..3.16e7 | 0.869 x (pole) | abs <= 1e-9 for x >= 1e3, <= 1.4e-12 at 3.16e7 | abs <= 5e-10 for x >= 1e3, <= 7e-13 at 3.16e7 | 2.27 at x = 10; -236 at 1e6; 6187 at 3.16e7 (0.05 to 1.1 times sqrt x) | unimodular: 0.821 x (pole at 1 - i alpha) |
| 6 | detection of a zero by the prime polynomial (hypothesis (H) and the high side) | through the zeros | section 6: P at heights to 1.013e6 | no failure | no failure | fails at its off-line zeros, first at 85.45..85.95 | (section 6) | heat: at its off-line pairs |

Mean-value behaviour of DH at height (the task's "heights to 1e6"): in the three windows the mean square of DH is 1.30, 1.74 to
1.76 and 3.43 to 4.00 on Re s = 0.875, 0.7, 0.55, against 1.85, 2.74 to 2.77 and 5.82 to 6.93 for L(chi_5) (`t4/outdh/dh_*.json`,
field `meansq_F`); no mean-value estimate
fails for DH, as expected of a linear combination of two L-functions.

Statistic. The first imported estimate that is numerically false for DH is number 4, the inverse-polynomial identity, at n = 4;
the reason is the coefficient relation a(4) != a(2)^2. For the sign twist it is number 5, at x = 10. Neither failure involves a
zero, and both occur below the first off-line zero of DH (ordinate 85.7). By the wording of the assignment this "reads
coefficients, not zeros". It is not counted as a survivor: (a) the statistic is a relation at a single index, not a statistic
using all primes together; (b) it is the definition of the control (DH has no Euler product; the sign twist has no functional
equation) read at the first index where it shows; (c) the heat control has no coefficients and is not reached, and the unimodular
twist passes every row; (d) every estimate that carries analytic content (rows 1 to 3) holds for all objects alike. What the audit
adds to the record is the control row of the 7/8 architecture: the mean-value inputs are target-blind, and the target is used in
exactly two places, complete multiplicativity (row 4) and the functional equation (row 5), plus the bound abs(a(p)) <= 1.

B(delta). delta = saving exponent in the sextic theta-row correlation (exceptional term P_a^((1-delta)/6)); 200 values
delta = i/199. All three are exponent models, not certificates; the rational certificate of PR #14 exists only at delta = 0.

| delta | (P) paper system, geometry re-optimised (`tmp/sextic/conj_reopt.py`, c15 = 4) | (XS-o) Xu-Sang scalar system, count rows only | (XS-g) with the gates of Remark 14.1 |
|---|---|---|---|
| 0 | 0.8750000 | 0.8749457 | 0.8749457 |
| 0.0050 | 0.8749418 | 0.8749070 | 0.8749097 |
| 0.0101 | 0.8748801 | 0.8748664 | 0.8748725 |
| 0.0201 | 0.8747824 | 0.8747849 | 0.8747981 |
| 0.0503 | 0.8744827 | 0.8744868 | 0.8745747 |
| 0.1005 | 0.8739385 | 0.8738427 | no feasible point (from delta = 0.0603) |
| 0.2010 | 0.8728496 | 0.8720666 | - |
| 0.3015 | 0.8717652 | 0.8699746 | - |
| 0.3467 | 0.8712786 | 0.8689010 (last feasible) | - |
| 0.5025 | 0.8695843 | no feasible point (from delta = 0.3518) | - |
| 1 | 0.8640936 | - | - |

(P) is decreasing on the whole grid, slope -0.0116 per unit delta at 0 (= -b/12) and -0.0111 at 1; active constraints: Lemma 15.1
range (delta <= 0.02), adaptive bins (0.01 to 0.3), floor bin (20.5) (from 0.1). It agrees with the values 0.873944 (delta = 0.1) and
0.8640936 (delta = 1) of the synthesis. (XS) is the float LP of `push/r3-critical-count/caps.py` with the objective
11/12 - l/4 - delta b/12 and the fixed point kappa = max(13/18, 2B - 1), on a count grid of 101 x 301 (its value at delta = 0 is
3.2e-5 above that lane's 201 x 601 value 0.8749133 and 5.9e-5 above the exact 0.8748866; the differences in delta are the content).
Beyond delta = 0.35 (count rows) and 0.055 (gates) the linear program has no feasible point at the fixed point: the model does not
extend there without a new geometry. Full grids: `t3/bdelta_P.json`, `t3/bdelta_XS.json`.

Classification: CLOSED as a separator; the control row is recorded. The object enters rows 1 to 3 not at all or through
abs(a(p)) only, rows 4 and 5 through its coefficients, row 6 through its zeros.

## 6. Combination 4: flow descent as a pointwise von Mangoldt sum (MEASURED)

Nodes: `lane-audit-h-desc`, `lambda-slope-per-theta`, `mem-lambda-theta-table`, `qrh-conditional-lambda`,
`lambda-conditional-qrh-0116091`. Source: `src/data/lane-arithmetic-input-audit-2026-09-22.js` (read as text): hypothesis
H_desc(p) asks, at a non-real zero z = x + iy of H_t, for P(z) = sum over real zeros x_j of 2y/((x - x_j)^2 + y^2) >= p, with
p_req(t0, y0) solving int_{y0}^{1} Y/(1 + pY) dY = t0 (4.37 for the 0.145 design, 2.17 for the Polymath15 headline row).

Finite consequence. With s = 1/2 + y/2 + i x/2 and all zeros near the height on the line, P(z) = Re xi'/xi(s) =
(1/2) log(T/2 pi) + Re zeta'/zeta(s) + O(1/T), T = x/2. So the budget P >= p is the one-sided bound
Re sum Lambda(n) n^(-s) <= (1/2) log(cond T/2 pi) - p at Re s = 1/2 + sqrt(q)/2, q = y^2 (q = 0.5625 is the abscissa 7/8). Statistic:

    D_F(q; T) = sum over n <= N of Lambda_F(n) (1 - log n/log N) n^(-s),   P_w = mean(T) - Re D_F,   mean = (1/2) log(cond T/2 pi),

N = 1e9, on 524,288 heights per window. The weight makes D_F a smoothed version of -F'/F (identity in section 1, checked to
3e-6); the kernel has width about 1/log N = 0.048 in the abscissa, so at q = 0.01 (distance 0.05 from the line) the statistic is a
smoothed Poisson strength, not the exact one. q*(X; p) = least q of the grid such that min P_w >= p at q and at every larger q, in
the window at X. Budgets: p = 2.17 and 4.37, and p_req(q) with the start abscissa sqrt(q) in place of 1 (0.145 design: 2.11 at
q = 0.5625, 0.64 at 0.36, 0 for q <= 0.29). Survival would need zeta and the characters to pass, and every control to fail at heights
below its first off-line zero, or to have q* above (2 theta_F - 1)^2 there.

Minimum of P_w over the window (columns q = 0.5625, 0.36, 0.25, 0.16, 0.09, 0.04, 0.0225, 0.01):

| window centre | mean (zeta) | zeta | chi_5 | hash sign twist (zeta's mean) | T-NR |
|---|---|---|---|---|---|
| 1.4e4 | 3.85 | 0.90 0.75 0.65 0.55 0.44 0.33 0.28 0.22 | 1.47 1.25 1.09 0.92 0.74 0.56 0.46 0.35 | -0.31 -0.88 -1.57 -2.70 -4.32 -6.72 -8.36 -10.44 | 14.56 .. 4.64 |
| 1e5 | 4.84 | 2.27 1.94 1.69 1.43 1.16 0.87 0.71 0.55 | 2.97 2.55 2.25 1.92 1.57 1.20 0.99 0.75 | 1.17 0.28 -0.48 -1.38 -2.44 -4.20 -5.64 -7.81 | 15.92 .. 4.97 |
| 1e6 | 5.99 | 3.05 2.62 2.30 1.96 1.59 1.21 1.00 0.78 | 3.90 3.39 3.01 2.58 2.11 1.61 1.33 1.02 | 2.56 1.76 1.08 0.24 -0.92 -3.08 -4.54 -6.32 | 16.76 .. 5.23 |
| 1e7 | 7.14 | 4.00 3.47 3.07 2.63 2.16 1.64 1.36 1.03 | 5.00 4.43 3.98 3.46 2.87 2.22 1.87 1.47 | 3.87 3.18 2.38 1.25 -0.34 -2.63 -4.14 -6.01 | 17.69 .. 5.59 |
| 1e8 | 8.29 | 5.10 4.48 4.00 3.46 2.86 2.18 1.82 1.44 | 5.95 5.30 4.78 4.18 3.50 2.74 2.34 1.89 | 4.94 4.19 3.52 2.53 1.16 -0.92 -2.43 -4.35 | 18.83 .. 5.91 |
| 1e9 | 9.44 | 5.92 5.22 4.67 4.04 3.34 2.56 2.13 1.65 | 6.93 6.20 5.60 4.90 4.10 3.18 2.68 2.15 | 6.27 5.46 4.72 3.63 2.05 -0.25 -1.79 -3.70 | 19.76 .. 6.34 |
| 1e10 | 10.59 | 7.18 6.42 5.79 5.06 4.24 3.32 2.83 2.27 | 8.33 7.63 7.04 6.29 5.35 4.21 3.54 2.83 | 7.26 6.51 5.86 4.96 3.75 1.62 -0.12 -2.33 | 20.84 .. 6.68 |
| 1e11 | 11.75 | 8.27 7.50 6.85 6.07 5.13 4.02 3.40 2.74 | 9.19 8.34 7.60 6.72 5.68 4.48 3.83 3.05 | 8.36 7.52 6.81 5.90 4.13 1.65 0.05 -2.02 | 21.92 .. 7.17 |
| 1e12 | 12.90 | 9.58 8.75 8.04 7.16 6.08 4.78 4.04 3.20 | 10.62 9.78 9.04 8.11 6.94 5.49 4.66 3.76 | 9.21 8.23 7.35 6.21 4.63 2.42 0.97 -0.77 | 23.27 .. 7.72 |

chi_-4 is within 0.42 of chi_5 in every cell (`t4/collect.txt`). The Liouville twist is within 1.4 of the hash twist.

q*(X; p), per window:

| object, p | 1.4e4 | 1e5 | 1e6 | 1e7 | 1e8 | 1e9 | 1e10 | 1e11 | 1e12 |
|---|---|---|---|---|---|---|---|---|---|
| zeta, 2.17 | fails at 0.5625 | 0.5625 | 0.25 | 0.16 | 0.04 | 0.04 | 0.01 | 0.01 | 0.01 |
| zeta, 4.37 | fails | fails | fails | fails | 0.36 | 0.25 | 0.16 | 0.09 | 0.04 |
| chi_5, 4.37 | fails | fails | fails | 0.36 | 0.25 | 0.16 | 0.09 | 0.04 | 0.0225 |
| hash sign twist, 4.37 | fails | fails | fails | fails | 0.5625 | 0.25 | 0.16 | 0.16 | 0.09 |
| Liouville twist, 4.37 | fails | fails | fails | fails | 0.5625 | 0.25 | 0.25 | 0.16 | 0.09 |
| T-NR, 4.37 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |
| zeta, 0 (P >= 0) | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 | 0.01 |
| hash sign twist, 0 | fails | 0.36 | 0.16 | 0.16 | 0.09 | 0.09 | 0.04 | 0.0225 | 0.0225 |

Fraction of samples with P_w < 4.37, zeta against the hash twist, at q = 0.5625 / 0.16 / 0.01: 1e6: 0.0204 / 0.1204 / 0.3346
against 0.0195 / 0.1081 / 0.2837; 1e8: 0 / 0.0012 / 0.1106 against 0 / 0.0017 / 0.0848; 1e12: 0 / 0 / 0.0008 against 0 / 0 / 0.0014.
With the start-dependent budget p_req(q) of the 0.145 design, zeta has no failing sample in any window from 1e5 on.

Controls evaluated outside the prime-side channel:

| control | method | result |
|---|---|---|
| DH, direct | F and F' by smoothed Dirichlet series (n <= 1.6e7 at 1e6); windows [9.8, 26224], [86893, 113107], [986893, 1013107] | q <= 0.36: first negative P at T = 85.45..85.95 (zero 0.8085 + 85.699i); q = 0.5625: first at 2442.45; no negative sample below 85. Negative runs per window: 8 (q = 0.5625) to 1610 (q = 0.01) at 1.3e4; 11 to 2485 at 1e6; fraction of negative samples 4e-5 to 0.017. Minimum of P: -82 to -1354 |
| DH, prime side | Lambda_DH(n), n <= 1e7 (non-zero at n = 6, the first n that is not a prime power; block maxima grow like n^0.75, rms like n^0.30) | T < 80: min P_w = 0.42, 0.26, 0.09 at q = 0.5625, 0.16, 0.01 (no failure); first negative sample at 85.3 (q = 0.16) and 83.75 (q = 0.01); at q = 0.5625 no negative sample to 26224 and in the 1e6 window (min 4.01) although the direct P is negative on 8 and 11 runs there: with n <= 1e7 the zeros just right of 7/8 are not resolved |
| heat tau = -0.1 | zero table to height 2000 | negative only for q <= 0.16; first negative T = 1329.10, 750.80, 564.28, 564.26, 540.44 for q = 0.16..0.01, against the first pair with offset above sqrt(q)/2 at 1329.17, 750.85, 564.37, 564.37, 540.47 |
| heat tau = -0.5 | zero table to height 2000 | first negative T = 295.21, 185.37, 169.54, 111.56, 111.51, 111.48, 111.47, 111.47 for q = 0.5625..0.01, against first pairs at 295.36, 185.51, 169.61, 111.69 (five times) |
| E_a, prime side (mean term doubled) | channel of `desc.py` | a = 1/4 ((2 theta_F - 1)^2 = 0.25): min P_w = -8 to -135 for q <= 0.09 in every window, positive at q = 0.16 (0.4 to 5.3) and above; a = 1/8 (0.0625): negative only at q = 0.01 (-2.7 to -3.5), positive at 0.0225 and 0.04. q* is below (2 theta_F - 1)^2 in both cases: zeros closer to the abscissa than 1/log N are not resolved |
| T-NR | zeta channel plus the exact local factor and its conductor term log q | min P_w between 4.64 and 23.27; passes every budget in every window. Its off-line zeros (offset 0.0321, ordinates 0.2274 (2k+1)) are left of every abscissa used |
| unimodular twist | - | zeta(s + i alpha): the same values at heights shifted by 1.24 |

Reading.

1. Premise on zeta: holds at every size. min P_w > 0 in all nine windows and all eight q, and q*(X; p) decreases with X for both
   fixed budgets (the mean term grows like (1/2) log T while the fluctuation of the smoothed sum is stable: sup of Re D at
   q = 0.5625 is 2.3 to 3.5 from 1.4e4 to 1e12).
2. The comparison L-functions behave like zeta, one grid step ahead because of their conductor.
3. At q >= 0.09 the budget is not a statement about zeros. The sign-twisted primes, which have no functional equation and no zero
   set tied to a mean density, meet p = 4.37 from the same window as zeta at q = 0.5625 and 0.25 and within one grid step
   elsewhere, with nearly the same fraction of failing samples at every height. There the statistic reads the size of a prime sum
   with coefficients of modulus 1 against (1/2) log T.
4. Where zeta does separate from the sign twists (small q: P_w >= 0 for zeta, min P_w down to -10 for the twists), the statement
   is P >= 0, which holds because every zero near the sample is on the line; an off-line zero to the right of the abscissa makes P
   negative (DH, heat, E_a). That is the location of the zeros at that height.
5. DH and both heat controls fail at their first off-line zero to the right of the abscissa, to within 0.25 in height, and at no
   sample below it. The fail criterion of the assignment (a control above (2 theta_F - 1)^2 below its first off-line zero) is met
   by no control. E_a fails only where its zeros are farther from the abscissa than the resolution 1/log N.
6. T-NR, a control with off-line zeros at every height, passes every budget: the hypothesis is about zeros to the right of the
   abscissa 1/2 + sqrt(q)/2 and T-NR has none for q >= 0.01.

Classification: CLOSED. The object enters through its zeros (sign of P) and through the size of its coefficients (budget at
q >= 0.09). No control fails earlier than its off-line zeros explain; one control passes; the sign twists pass the budget where it
is not tied to zeros. For zeta the trend is the growth of the mean term with height.

## 7. Not run, and limits of what was run

1. Combination 1 at X = 3e8 or beyond 1e7: not reached (cost in section 3; two server units started and stopped). The statements
   of section 3 are for N(c) <= 1e7; the fitted exponents have block scatter 0.07 to 0.39 and do not distinguish 2/3 from 0.75.
2. Combination 1 uses one-slot rows a_F(N(n)) on all primary n. The manuscript's rows B^J are sums over prime tuples with marks
   and completions; they were not built. The model shares with them only the pairing of sextic Gauss sums with a row in the modulus.
3. The theta constants c_n are those of the stripped series (moduli prime to n, squarefree) and carry noise 0.032 each; at the
   index n^4 they are at the noise level, so the r_CS values of that row are upper bounds set by noise.
4. Combination 2, third node (global Whittaker constants on the double cover of GL(3)): no computation exists and none was made.
5. Combination 3: rows 1 to 3 were tested in the finite models of combinations 1 and 2, not on the manuscript's objects; row 5 was
   tested on plain smooth sums, not on the twisted sums of the manuscript; the mollified moment of Xu-Sang was not evaluated at
   height, only the coefficient identity it rests on. B(delta) is a model in all three columns.
6. Combination 4: samples are nine windows of length 26,214, not all heights up to X; "q*(X)" is per window. The statistic is the
   smoothed sum with N = 1e9; at q <= 0.0225 it is not the exact Poisson strength. H_desc concerns zeros of H_t for 0 <= t <= t0
   at heights above 3e12; only t = 0 and heights to 1e12 were sampled. Float64 phases for the windows up to 1e9 (error at most
   5e-6 rad per term), 80-bit for 1e10 to 1e12; four extremes recomputed at 128 bits.
7. GPU: not used (device memory unavailable). Interval arithmetic: none; every number is MEASURED.

## 8. Files and reproduction

* `t1/out/r1e7L_B.npz` (per-column shell sums), `r1e7L_R.npz` (rows), `r1e7L_an.json`, `r1e7L_extra.json`; `r1e7_*` the L = 3000 run.
  `scripts/memcap.sh 8 .venv-arb/bin/python t1/rows.py tmp/sextic/data/sf_1e7.npz t1/out/r1e7L 20000 2`, then `rows_an.py`, `rows_extra.py`.
* `t2/ident.json`, `t2/slotobj_sf_U*.json`, `t2/log_sf_U*.txt`; `t2/run.sh`.
* `t3/audit_1e8.json`, `t3/audit_1e7.json`, `t3/bdelta_P.json`, `t3/bdelta_XS.json`.
* `t4/out9lo*/desc_summary.json` (windows 1e5 to 1e9), `t4/out9hi/desc_summary.json` (server: 1.4e4, 1e10, 1e11, 1e12),
  `t4/collect.txt`, `t4/recheck_1e9.jsonl`, `t4/recheck_hi.jsonl`, `t4/outdh/`, `t4/outdh20/`, `t4/outdhp/`, `t4/heat_zero.json`,
  `t4/dh_lambda_1e+07.json`. Server: `~/rh-push/s6-sextic-rows-zero-free-input-audit/` (code, the four value arrays of the high
  windows, partial Gauss-period files); log of the completed unit in `logs/rh-s6sx-descH-1120115329.log`.
* `logs/`: all run logs.
