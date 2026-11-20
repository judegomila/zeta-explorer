# s4-floor-exponent-moebius-cubic-rows: screening of four combinations (2026-11-20)

Scope: `tmp/research-2026-11-16/push/s4-floor-exponent-moebius-cubic-rows/` only. Nothing committed or pushed. No statement about
zeros of zeta is claimed. Labels: PROVED (elementary argument given), CLASSICAL (cited), MEASURED (float64, long double or 60-digit
mpmath; not interval-certified), N (not formulable). Verdict: **four combinations tested, no survivor.**

In one paragraph. (1) The floor exponent of the compressed Weil operator returns 2 beta_max - 1 for every control and nothing else;
DH and the heat controls fail only when support times number of modes resolves their lowest off-line pair. (2) Moebius sums: the
unimodular twist and a random sign twist pass, DH fails exactly as its off-line zeros dictate; the Riesz function passes DH to
x = 1e13 because it weights a zero at height gamma by exp(-pi gamma/4). (3) The restricted fourth moment at block m* gives the same
exponent for sign-twisted and thinned columns and shows no stable positive saving on the sextic rows up to U = 1e8. (4) Prime sums of
cubic Gauss sums show square-root cancellation uniformly in 5,445 dual indices after the polar term, to norm 1e7; the dual-term
correlation of lane e2 disappears when the Gauss-sum table is permuted, so it comes from the theta coefficients. None of the four
separates zeta from the controls for a reason other than their zeros, poles or changed coefficients.

## 0. What was run

| item | size reached | where |
|---|---|---|
| Weil form, coefficient side (combination 1) | 14 objects, X = 2..1e7 (support up to 16.1), 450 functions per parity sector, prime powers to 1e7 | server, 2 cores, 135 s (run B); run A (400 per sector, X <= 1e6) 53 s |
| Weil form, 60 digits | zeta, E_a, T-NR, Liouville twist; 24 functions per sector; supports 2.72, 3.72, 4.74 | Mac, mpmath, 18 min |
| Weil form, zero side | zeta, DH, heat tau = -0.5 and -0.1 from the battery zero tables (height 2000); up to 700 functions per sector, support <= 7.2 | Mac, numpy |
| Moebius sieve with control columns (combination 2) | every n <= 1e12 for mu, mu chi_-4, mu chi_-3, abs(mu) (59,605 segments of 2^24); every n <= 9.9992e10 for the hash sign twist, mu(n) n^(-i alpha) and the two E_a columns; 4,119 checkpoints | server (`rhrun`, 2 to 6 cores) and Mac (range runs) |
| Inverse coefficients of DH and of E_a (a = 1/8, 1/4) | n <= 1e9 each (8 to 9 GB) | server, 2 cores |
| Riesz sums | coefficients to 2e9; 761 values of x up to 1e13 (zeta, two characters, Liouville, hash sign twist); DH and E_a from the 1e9 tables; T-NR from zeta's values | server, 2 cores, under 10 minutes in total |
| Sextic prime-conductor rows (combination 3) | every row with U <= p < 2U for U = 1e4, 3.16e4, ..., 1e8 (5,316,922 rows at 1e8), five column weightings; a sixth (independent signs) to U = 3.16e7 | server, 2 cores, about 15 minutes |
| Prime sums of cubic Gauss sums (combination 4a) | 332,194 primes p = 1 mod 3 below 1e7 (existing table), 5,445 dual indices, three variants of the table | server, 2 cores, 6 minutes |
| Dual-term pipeline on a permuted table (combination 4b) | Q = 3750: rows N(m) <= 3750, 2,822,619 nodes, 7,190 conductors | server, 2 cores, 6 GB, 64 minutes |

Server use: `rhrun` units only, at most 8 cores of quota computing at any time (units queued behind a predecessor and only
waiting are not counted; with them the requested total was 10 to 12 for parts of the session), at most 12 GB per unit (11 GB for
the 1e9 coefficient tables), CPU only (no GPU stage was needed: every kernel is integer or sieve arithmetic). The slice was oversubscribed for the whole
session (load average 110 to 160 on 48 cores); units received between a quarter and a half of the cores they requested.
A six-thread unit for the whole range to 1e12 was stopped at 40% after 96 minutes; the range (1e11, 1e12] of the four integer columns was then sieved on the Mac in nine single-thread range runs of 11 minutes each (three at a time, 38 MB each), and the control columns on (1e10, 1e11] in three server units. All units of this lane are stopped (`rh-s4floorA/B`, `rh-s4mobA/B/C1/C2/C3`, `rh-s4small`, `rh-s4series`, `rh-s4gsum`, `rh-s4rowsA`, `rh-s4chain`, `rh-s4rows6`, `rh-s4perm`: none active). Local runs went through `scripts/memcap.sh 8`.

## 1. Shared code and its validation

| file | role |
|---|---|
| `wf.py`, `objs.py` | Weil-form engine and objects of lane s2-control-census-onsets (copied; scipy calls replaced, G-stack built in place). Validated there against the zero side |
| `floor.py`, `floor_an.py`, `floor_modes.py`, `floor_lowmodes.py` | combination 1: lambda_min against X, fits, number of basis functions needed |
| `floor_mp.py` | combination 1: 60-digit mpmath re-computation (own polynomial basis, Gauss-Legendre, eigenvalues by `mp.eigsy`) |
| `zeroside.py`, `zeroside_heat.py` | combination 1: the same form from zero tables (battery tables of lanes c12/c13), used for the heat controls |
| `mob.c`, `mob_an.py` | combination 2: segmented Moebius sieve (OpenMP) with control columns, block suprema, fits |
| `riesz.c`, `dser.c`, `riesz_an.py`, `dh_pred.py`, `ea_pred.py` | combination 2: Riesz sums with tail correction; inverse coefficients of DH and E_a; explicit-formula amplitudes |
| `rows4.c`, `rows6.c`, `rows4_an.py` | combination 3: sextic prime-conductor rows, block sums, class statistics |
| `gsum.py` | combination 4: prime sums of cubic Gauss sums with the dual index |
| `mkperm.py`, `permrun.sh` | combination 4: permuted-table rerun of the dual-term pipeline of lanes r2/e2 |

Checks against known answers (all MEASURED):

| check | result |
|---|---|
| `mob.c`: M(10^k), k = 6..12 | 212, 1037, 1928, -222, -33722, -87856, 62366: all equal (published values); squarefree counts Q(1e6) = 607926, Q(1e8) = 60792694 |
| `mob.c`: all nine columns against a brute-force factorisation for every checkpoint n <= 30000 | integer columns identical; float columns within 3e-12 |
| `mob.c`: sieve without the product array ("lean") against the sieve with it ("rich"), 3395 checkpoints to 3e8 | identical |
| `riesz.c`: zeta's Riesz function | abs R(x) x^(-1/4) <= 7.8e-5 on [1e9, 1e13] (the known amplitude of the first-zero term); Liouville column: R(x)/sqrt x = 0.538761 = (6/pi^2)(sqrt pi/2) |
| `dser.c`: (sum b(n) n^-3)(sum a(n) n^-3) for DH; for E_a against zeta(3+a) zeta(3-a) | 1 to 15 digits; partial sums of the E_a column equal those of `mob.c` (12031.7171 at 1e6) |
| `dser.c`: lowest-zero amplitude of the DH Riesz sum | bounded 0.046 x^(1/4), as the weight Gamma(1 - rho/2) of its lowest zero (ordinate 5.094) gives |
| `wf.py` against `floor_mp.py` (60 digits), 24 functions per sector, 4 objects, 3 supports | agreement to every printed digit for the controls (section 3) |
| `zeroside.py` against the coefficient side for DH | lambda_min -1.2554 / -1.2554 (a = 2.2), -4.5071 / -4.5068 (a = 3.2); s2 lane value at a = 2.2: -1.2542 with a smaller basis |
| `floor.py`: DH onset | support in (3.39, 3.63]; lanes route 44 / s2: 3.562 |
| `rows4.c` against lane e2 `restricted4.py` | rows 5690, 10722, 20424 at U = 2^16, 2^17, 2^18; omega (plain) 0.3408, 0.3546, 0.3721 against 0.341, 0.355, 0.372 |
| `gsum.py`: abs g~(pi) = 1 and g~(pi)^3 = -pi/abs(pi) | 1.1e-9 and 3.4e-9 on 332,194 primes; S(1; X) log X / X^(5/6) stable at 0.75 (Patterson term) |

Error found and corrected during the run: the first version of `riesz.c` added Taylor terms of order x^2 and x^3 of the tail beyond the
cutoff; their coefficients are differences of numbers of size 1 known to 1e-19, so the terms were pure rounding (-8.1e4 at x = 1e8).
They are bounded by x^2 n_hi^(-3.5) and were removed; only the leading tail term x (1/zeta(2) - compensated partial sum) is kept. Without
any tail term the truncation error at n_hi = 400 sqrt x is 1.3e-4 x^(1/4), larger than zeta's Riesz function itself.

## 2. Table

"pass" = no failure found up to the stated size (never a proof); N = not formulable; exponents are fitted over the stated ranges.

| combination | statistic | sizes reached | zeta | comparison L-function | DH | heat (tau < 0) | sign-twisted primes | unimodular twist | E_a | T-NR | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1. V7 floor x floor reduction x Euler-completed Weil multiplier | lambda_min of the Weil form on [-a, a], X = e^(2a); exponent p in -lambda_min ~ lambda^p; onset X | X = 2..1e7, 900 modes (float64); 48 modes at 60 digits; heat from zero tables to height 2000 | pass: no negative value above rounding (-4.3e-10 at X = 1e7); +1.5e-36, +5.0e-43, +4.4e-49 at 60 digits (X = 15, 41, 114) | chi_-4, chi_-3, chi_5: pass (>= -7.1e-12) | onset X in (29.6, 37.8], needs >= 56 modes per sector; p = 0.53..0.69 (0.617..0.739 from its zeros) | tau = -0.5: onset X in (11.0, 12.2]; tau = -0.1: X in (54.6, 66.7] with 700 modes per sector, none with 170 | onset X <= 2.55 (first prime); p = 0.88..1.04 (pole term without the cancelling prime sum) | onset X <= 2.55; p = 0.87..1.03 (pole misplaced; zeros on its line) | onset X <= 2.55; p = 0.28..0.46 (a = 1/8), 0.42..0.59 (a = 1/4) against 2a | onset X in (3.26, 4.17] = q; p = 0.72..0.88 against 0.808 | CLOSED: p = 2 beta_max - 1 within the logarithmic uncertainty; DH and heat fail when support times modes resolves their lowest off-line pair (s2 onset law within 2 rms); the others fail at the first prime where coefficients or the pole differ |
| 2. Moebius de-averaging x cofinal Moebius sum x Riesz criterion | exponent of block suprema of abs M_F(x); abs R_F(x) x^(-1/4) | M: n <= 1e12 (zeta, characters, Liouville, T-NR), 1e11 (hash sign, unimodular, E_a), 1e9 (DH); Riesz: x <= 1e13 for all | M: exponent 0.483 +- 0.019 on [1e9, 1e12], sup abs M/sqrt x = 0.571; Riesz: 7.8e-5 x^(1/4), exponent 0.27 | chi_-4: exponent 0.523 +- 0.024, sup 0.66 sqrt x; chi_-3: 0.506 +- 0.020, sup 0.53 sqrt x; Riesz bounded 0.023 and 0.0058 | M: exponent 0.84 on [1e5, 1e9], 38% to 70% of the envelope of its off-line zeros at every x; Riesz: passes to 1e13 (0.046 x^(1/4)) | N | Liouville: exponent 1.00 (zero at s = 1); hash sign twist: passes (exponent 0.39, 0.47, 0.56 on three windows, sup 1.6 sqrt x; Riesz 0.4 x^(1/4), exponent 0.25) | passes (exponent 0.499 +- 0.012, sup 0.52 sqrt x) | M: exponent 0.624 and 0.749 against 0.625 and 0.75, from x = 1e2 on (coefficient size); Riesz: 0.34 and 0.39 against 0.31 and 0.375 | M: exponent 0.905 +- 0.038 against 0.904, fails at x = 3 = q; Riesz: 0.47 against 0.45 | CLOSED: two controls pass M and two pass Riesz; DH fails M only as its zeros dictate; Riesz weights a zero by exp(-pi gamma/4), so DH would need x near 1e178 |
| 3. saddle pair-count saving x z_0 charge x Xu-Sang ceiling | omega = -log(share of the central fourth moment held by the k = rows^0.5903 rows with largest abs S_m*)/log(rows) | all sextic prime-conductor rows, U = 1e4..1e8 (5.3e6 rows) | (not a zeta statistic) rows: omega falls 0.38 -> 0.24; share constant near 3.3%; slope 0.05 +- 0.04 | N | N | N | columns twisted by hash sign, Liouville, THIN(0.9): same exponent (omega lower by 0.013..0.025); DEL(0.9): same trend, omega 0.29..0.31 at U >= 1e7 | N | N | N | CLOSED: the count behaves identically for sign-twisted and thinned columns and shows no stable positive omega; a non-multiplicative weight gives the independent value 0.41, so the statistic reads multiplicativity of the columns, not the primes |
| 4. dual-term lambda*c correlation x squarefull twist x (M1+) | (a) sup over 5,445 dual indices of abs(sum over primes of g~(m, pi))/count; (b) explained fraction R^2 of the non-polar remainder by theta estimators at index lambda c | (a) all primes of norm <= 1e7 (664,388); (b) Q = 3750, 7,190 conductors | (not a zeta statistic) (a) X^(-0.158) before and X^(-0.525) after removal of the polar term c_m X^(5/6)/log X; (b) R^2 = 0.424 against a null of 0.183 (lane e2); with the permuted table 0.187 against 0.183 | N | N | N | random cube roots: (a) X^(-0.47), no polar term | N | N | N | CLOSED as a separator (no control of the battery is formulable; a pass is what GRH for the cubic Hecke family predicts). Origin of the correlation: the permuted table removes it (0.187 against null 0.183), so it comes from the theta coefficients and not from the shared table; in (a) the permuted table keeps the polar term only at cube indices (0.17% of indices against 69%) |

## 3. Combination 1: floor exponent of the compressed Weil operator (MEASURED)

Nodes: `v7-floor-theorem-c`, `mem-v7-floor-reduction`, `euler-completed-weil-multiplier` (source
`formalization/rh-attempts/2026-11-01-operator.md`, Theorems A-C: H_lambda is the Weil form on functions supported in
[-l, l], l = log lambda, X = lambda^2; a floor eps_0(lambda) >= -C (1 + log lambda)^m lambda^p gives no zeros in Re s > (1+p)/2).

Finite consequence tested. If the floor exponent carried information not already in the location of zeros, then for every control the
fitted p would differ from 2 beta_max - 1, or the form would turn negative at a support, and with a number of test-function modes,
smaller than the control's off-line zeros require, while zeta and L(chi) show no negative value at any size. Survival would need:
zeta and L(chi) non-negative at every X and basis size reached; every control negative; the onset of each control not accounted for
by (support, modes) against its lowest off-line zero.

What was computed. lambda_min of the form on [-a, a] (X = e^(2a)) in the basis a^(-1/2) p_n(x/a)(1 - x^2/a^2)^3, 450 functions per
parity sector (degree up to 899), 64 values of X from 2 to 1e7 (run B; run A: 400 per sector, 40 values to 1e6), 14 objects with a
Dirichlet series (`floor.py`); the heat controls from their zero tables (`zeroside.py`, `zeroside_heat.py`). The assignment asked for
2000 modes at 300 digits; that was not run (see section 7). Reached instead: 900 modes in float64 to X = 1e7 (ten times the requested
X), plus a 60-digit re-computation with 24 functions per sector at three supports.

Zeta and Dirichlet L-functions.

| object | most negative value over 64 supports, X <= 1e7 | reading |
|---|---|---|
| zeta | -4.3e-10 at X = 1e7 (entries of the matrix up to 4.2) | rounding: grows like sqrt X (-1.2e-11, -3.7e-11, -1.3e-10, -4.3e-10 at X = 1e4, 1e5, 1e6, 1e7), the sector carrying it changes between run A and run B (odd at X = 1e6 in A: -2.9e-10; even in B: -1.3e-10) |
| L(s, chi_-4) | -7.1e-12 | rounding (no pole term, no cancellation between pole and prime sum) |
| L(s, chi_-3) | -6.7e-12 | rounding |
| L(s, chi_5) | -6.9e-12 | rounding |

60-digit re-check (`floor_mp.py`, mpmath, independent assembly of the same formula, 24 functions per sector):

| a (X) | zeta, even / odd sector | float64 at the same size | E_a(1/8) | T-NR(3, 2.2), zeta bridge | Liouville twist |
|---|---|---|---|---|---|
| 1.36 (15.2) | +1.4986e-36 / +7.8810e-34 | -1.0e-14 / -1.9e-14 | -0.070564 / -0.072516 | -3.07341 / -3.11644 | -1.95698 / -3.55903 |
| 1.86 (41.3) | +5.0195e-43 / +4.9013e-42 | -4.3e-14 / -3.8e-14 | -0.143415 / -0.161872 | -4.64579 / -4.41511 | -3.55224 / -7.07044 |
| 2.37 (114) | +4.4305e-49 / +2.5394e-47 | -2.8e-14 / -1.0e-13 | -0.250765 / -0.266905 | -6.74447 / -7.49828 | -4.70342 / -13.9518 |

The control values agree with float64 to every printed digit; zeta's smallest eigenvalue in these 24 functions is positive and far
below double precision. So "zeta: eps_0 >= 0 observed" holds in the sense: no negative value above rounding in float64 to X = 1e7
with 900 modes, and positive at 60 digits where that was run. Nothing here proves positivity at any X (a finite basis gives an upper
bound for lambda_min).

Controls (run B; "onset" = first grid point with lambda_min < -1e-8; fits of log(-lambda_min) against log lambda on the stated range;
m = 0 is a pure power, m = 1 divides by 1 + log lambda first).

| control | onset X (support 2a) | lambda_min at X = 1e3 / 1e5 / 1e7 | fitted p, m = 0 (X >= 1e3; >= 1e4) | fitted p, m = 1 | 2 beta_max - 1 | functions per sector needed |
|---|---|---|---|---|---|---|
| DH | (29.6, 37.8] (3.39..3.63; s2 lane: 3.562) | -9.3 / -56 / -256 | 0.690; 0.667 | 0.539; 0.529 | 0.617 for the lowest off-line zero 0.8085 + 85.70i; 0.739 for the largest beta below height 2000 (0.8695) | 56 to 78 at every support from 3.8 to 9; none negative with 32 up to X = 1e7 |
| heat tau = -0.5 (zero side) | (11.0, 12.2] (2.40..2.50) | -2.7 at X = 602 | not fitted (zero table to height 2000 limits a <= 3.2) | | zeros leave every strip | 300 used; lowest pair 0.243 + 111.69i |
| heat tau = -0.1 (zero side) | (54.6, 66.7] (4.0..4.2) | -0.017 at X = 602 | not fitted | | | 700 used; with 170: no negative value to X = 602; lowest pair 0.0216 + 415.26i |
| E_a, a = 1/8 | (2.0, 2.55] | -2.1 / -7.4 / -20.6 | 0.464; 0.419 | 0.313; 0.281 | 0.25 | 2 to 4 |
| E_a, a = 1/4 | (2.0, 2.55] | -9.9 / -44 / -168 | 0.588; 0.558 | 0.437; 0.420 | 0.50 | not measured |
| T-NR(3, 2.2), own bridge | (3.26, 4.17] | -18.7 / -146 / -913 | 0.877; 0.854 | 0.726; 0.716 | 0.808 | 2 |
| T-NR(3, 2.2), zeta's bridge | (2.55, 3.26] | -20.9 / -148 / -915 | 0.856; 0.844 | 0.706; 0.706 | 0.808 | 2 |
| T-NR(2, 2.05), own bridge | (2.55, 3.26] | -7.2 / -56 / -309 | 0.764; 0.724 | 0.613; 0.587 | 0.644 | not measured |
| Liouville sign twist zeta(2s)/zeta(s) | (2.0, 2.55] | -50 / -599 / -6296 | 1.032; 1.019 | 0.881; 0.881 | 1 (zero at s = 1 with zeta's pole term kept) | 2 |
| hash sign twist (random completely multiplicative +-1) | (2.0, 2.55] | -24 / -294 / -3148 | 1.042; 1.028 | 0.891; 0.891 | 1 (prime sum of size sqrt X with no pole behind it) | not measured |
| unimodular twist zeta(s + i alpha), alpha = 1.2393, zeta's bridge | (2.0, 2.55] | -14 / -216 / -2653 | 1.019; 1.033 | 0.868; 0.895 | 1 (pole at 1 - i alpha against a pole term at 1; its zeros are on the line) | not measured |
| random unimodular twist | (2.0, 2.55] | -26 / -303 / -3148 | 1.019; 1.009 | 0.868; 0.871 | 1 | not measured |

Reading.

1. The fitted exponent lies between the m = 1 and the m = 0 value for every control and brackets 2 beta_max - 1 (T-NR: 0.72..0.88
   around 0.808; DH: 0.53..0.69 around 0.617..0.739; E_a(1/4): 0.42..0.59 around 0.5; E_a(1/8): 0.28..0.46 around 0.25, where
   a log X <= 2 and the logarithmic factor is not yet separated). The exponent is the off-line abscissa and nothing else: the statistic
   returns 2 beta_max - 1 (Theorem C and its converse), with a logarithmic uncertainty of about 0.15 over five decades of X.
2. Onsets. Sign twists, unimodular twists, E_a and T-NR turn negative at the first support that contains a prime power at which their
   coefficients differ from an admissible set (log 2 = 0.69 or log 3 = 1.10), with two functions per sector. The sign and unimodular
   twists fail with exponent 1 because the pole term of zeta is kept while the prime sum no longer cancels it; for zeta(s + i alpha)
   all zeros are on its line, so this failure is a statement about the pole and the functional equation, not about zeros.
   T-NR(q, c) agrees with zeta below support log q (PROVED: equal coefficients), as the s2 lane recorded.
3. DH and the heat controls turn negative only when the basis resolves their lowest off-line zeros. DH: support 3.39..3.63 and at
   least 56 functions per sector; with 32 functions per sector its form shows no negative value at any X up to 1e7 (`floor_lowmodes.py`).
   Against the zero-side onset law of lane s2 (a* = -0.748 + 0.387 log gamma - 0.278 log(beta - 1/2) + 0.278 log q, rms 0.139):
   DH predicted 1.749, measured 1.69..1.82; heat tau = -0.5 predicted 1.470 (pair 0.243 + 111.69i), measured 1.20..1.25;
   heat tau = -0.1 predicted 2.250 (pair 0.140 + 564.37i; 2.652 from the lowest pair), measured 2.0..2.1. All within two rms of the
   law (the heat controls slightly early; several pairs act together).
   The zero side and the coefficient side agree for DH (a = 2.2: -1.2554 and -1.2554; a = 3.2: -4.5071 and -4.5068).
4. For zeta the same reading gives the reach of the computation: 900 polynomial modes on support 16 resolve ordinates up to
   roughly degree/a, about 110. An off-line zero of zeta, if any, lies above 3e12; the test cannot see it at any size that can be run.

Classification: CLOSED. Zeta and three Dirichlet L-functions pass at every size reached, every formulable control fails, and each
failure has its known cause: a changed coefficient at the first prime (twists, T-NR, E_a), the pole (unimodular twist), or the
resolution of an off-line zero by support times modes (DH, heat). The floor exponent equals 2 beta_max - 1. This is the pattern of
map rows on the Weil form and of lane s2-control-census-onsets, with the exponent added.

## 4. Combination 2: Moebius sums and the Riesz function (MEASURED)

Nodes: `mobius-deaveraging-price`, `cofinal-mobius-sum-equals-x-m`, `riesz-criterion`.

Finite consequence tested. For F = sum a(n) n^-s write 1/F = sum b_F(n) n^-s, M_F(x) = sum_{n <= x} b_F(n) and
R_F(x) = x sum_n b_F(n) n^-2 exp(-x/n^2) (for zeta this is the Riesz series sum (-1)^(k+1) x^k/((k-1)! zeta(2k))). If the two criteria
read more than the abscissa of the zeros, then the growth exponent of the block suprema would stay at 1/2 (M) and 1/4 (R) for zeta
and L(chi), and every control would show a larger exponent at an x below the one its off-line zeros give through the explicit
formula. Survival needs every control to fail in that way.

Inverse coefficients used. zeta: mu. L(chi): mu chi. Liouville twist zeta(2s)/zeta(s): abs(mu). Hash sign twist (completely
multiplicative eps(p) = +-1 from a 64-bit hash of p): mu eps. Unimodular twist zeta(s + i alpha), alpha = 1.2393: mu(n) n^(-i alpha).
E_a: multiplicative, b(p) = -(p^a + p^-a), b(p^2) = 1, b(p^k) = 0 for k >= 3. T-NR(3, 2.2): mu * h, h on powers of 3 with generating
function 1/(1 + 2.2 sqrt3 T + 3 T^2), so M_NR(x) = sum_k h_k M(x/3^k) and R_NR(x) = sum_k h_k R(x/9^k). DH: the Dirichlet inverse of
the period-5 coefficients, by direct convolution to 1e9. Heat: N.

### 4.1 M_F(x)

Sizes: zeta, the two characters and the Liouville twist: every n <= 1e12 (M(1e12) = 62366, the published value); hash sign twist, unimodular twist and E_a: every n <= 9.9992e10 (a segment boundary; written 1e11 below); T-NR: to 1e12 from M(x/3^k); DH: n <= 1e9. Block suprema: 16 blocks per decade of sup abs(M_F(x))/sqrt x over all x of the block (from the minimum and maximum of
the partial sums inside each sieve segment of 2^24 integers); DH: 32 blocks per decade to 1e9; T-NR and the float columns: on a grid of
32 points per decade.

| object | range | exponent of the block suprema of abs M | sup abs M / sqrt x on the range | predicted exponent (beta_max) |
|---|---|---|---|---|
| zeta | [1e9, 1e12]; [1e8, 1e12] | 0.483 +- 0.019; 0.489 +- 0.012 | 0.5712 (block bound; published maximum 0.570591 at x = 7766842813) | 1/2 |
| L(s, chi_-4) | [1e9, 1e12]; [1e8, 1e12] | 0.523 +- 0.024; 0.503 +- 0.016 | 0.660 | 1/2 |
| L(s, chi_-3) | [1e9, 1e12]; [1e8, 1e12] | 0.506 +- 0.020; 0.512 +- 0.014 | 0.529; 0.623 | 1/2 |
| Liouville twist | [1e9, 1e12] | 0.999 | 6.1e5 at 1e12 (M = (6/pi^2) x) | 1 (zero of zeta(2s)/zeta(s) at s = 1) |
| hash sign twist | [1e9, 1e11]; [1e8, 1e11]; [1e7, 1e10] | 0.560 +- 0.059; 0.470 +- 0.035; 0.386 +- 0.056 | 1.41; 1.61; 1.61 | none (no continuation of the series past Re s = 1; random multiplicative model: at most 1/2) |
| unimodular twist | [1e9, 1e11]; [1e7, 1e11] | 0.479 +- 0.032; 0.499 +- 0.012 | 0.516 | 1/2 (zeros of zeta translated; all on its line) |
| E_a, a = 1/8 | [1e9, 1e11]; [1e7, 1e11]; [1e3, 1e7] | 0.628 +- 0.031; 0.624 +- 0.011; 0.631 +- 0.011 | 37; 37; 12.8 | 0.625 |
| E_a, a = 1/4 | [1e9, 1e11]; [1e7, 1e11]; [1e3, 1e7] | 0.747 +- 0.028; 0.749 +- 0.011; 0.745 +- 0.011 | 433; 433; 52.8 | 0.75 |
| T-NR(3, 2.2) | [1e9, 1e12]; [1e8, 1e12]; [1e3, 1e7] | 0.908 +- 0.059; 0.905 +- 0.038; 0.915 +- 0.039 | 1.6e5; 1.6e5; 1189 | 0.9038 |
| DH | [1e7, 1e9]; [1e5, 1e9]; [1e3, 1e5] | 0.844 +- 0.007; 0.838 +- 0.003; 0.730 +- 0.019 | 29.4; 29.4; 1.91 | 0.8085 (lowest off-line zero, ordinate 85.70) to 0.8695 (largest real part below height 2000, ordinate 240.40) |
| heat | N | | | |

Where each control leaves the range of zeta (sup abs M / sqrt x of zeta is 0.5712 on [2^26, 1e12]):

- T-NR: abs(M_NR(x))/sqrt x = 4.5, 11.1, 23.4 at x = 10, 100, 1000. It fails at x = 3 = q (abs(M_NR(3)) = abs(M(3) + h_1 M(1)) = 4.81),
  the first integer where its coefficients differ from mu. Its off-line zeros are at height pi/log 3 = 2.86 and periodic; nothing is
  resolved, the local factor at 3 is read directly.
- E_a: explicit-formula amplitudes 2/(abs(rho + a) abs(zeta'(rho)) abs(zeta(rho + 2a))) of the first zero are 0.99 (a = 1/8) and 0.55
  (a = 1/4) against 0.18 for zeta (`ea_pred.py`); the suprema of abs M / x^(1/2 + a) are between 0.3 and 2 from x = 1e2 on. The exponent 1/2 + a is
  visible from the first decades because every zero is displaced and the coefficients themselves have size p^a.
- DH: abs M / sqrt x stays below 0.67 up to x = 5e3, reaches 1 near x = 2e4 and 29 below 1e9. The envelope from the 84 off-line pairs
  of the battery table, E_off(x) = sum 2 x^(beta - 1/2)/(abs(rho) abs(DH'(rho))) (`dh_pred.py`, DH'(rho) by mpmath), is 0.87 at 1e3,
  1.56 at 1e4, 2.93 at 1e5, 11.3 at 1e7, 47.9 at 1e9; the measured block suprema are 0.59, 0.83, 1.47, 6.0, 18 to 24 at the same x:
  between 38% and 70% of the envelope and never above it. The failure appears where the off-line zeros put it, not earlier.
- Liouville twist: exponent 1 from the start, because abs(mu) has mean 6/pi^2 (a zero of the control at s = 1, at height 0).
- Hash sign twist and unimodular twist: no failure. Block suprema of the hash twist are 0.26 to 1.6 sqrt x; the fitted exponent is 0.39, 0.47 or 0.56 depending on the window
  (consistent with 1/2, no growth); the unimodular twist is indistinguishable from zeta (0.52 against 0.57).

### 4.2 Riesz sums R_F(x), x = 10^(j/8) up to 1e13

Coefficients to 2e9 (zeta, characters, twists) and 1e9 (DH, E_a); direct sum over sqrt(x/50) <= n <= 400 sqrt x, plus the tail
x (B - partial sum to the cutoff) with B = 1/F(2) in long double and compensated summation (the tail is 1.3e-4 x^(1/4) in size, larger
than zeta's R itself; without it the result is wrong).

| object | sup abs R x^(-1/4) on [1e5, 1e9] | on [1e9, 1e13] | exponent of decade suprema, x >= 1e7 | predicted |
|---|---|---|---|---|
| zeta | 8.2e-5 | 7.8e-5 | 0.268 | 1/4 |
| L(chi_-4) | 0.0229 | 0.0229 | 0.247 | 1/4 |
| L(chi_-3) | 0.0058 | 0.0058 | 0.266 | 1/4 |
| Liouville twist | grows: R = 0.538761 sqrt x | | 0.509 | 1/2 |
| hash sign twist | 0.42 | 0.39 | 0.253 | none |
| DH | 0.0456 | 0.0453 | 0.268 | 0.404 from the zero at ordinate 85.70, with weight exp(-pi 85.70/4) |
| E_a, a = 1/4 | 0.0024 | 0.0078 | 0.393 | 0.375 |
| E_a, a = 1/8 | 0.0015 | 0.0024 | 0.342 | 0.3125 |
| T-NR(3, 2.2) | grows | grows | 0.474 | 0.452 |
| heat, unimodular twist | N; not run (zeta's zeros translated) | | | |

DH passes the Riesz test at every x reached. A zero rho enters R with weight Gamma(1 - rho/2), of size exp(-pi gamma/4): the off-line
zero of DH at ordinate 85.70 is weighted 3e-28 relative to its lowest zero (ordinate 5.09) and would reach the same size only near
x = 1e178. For the Riesz function the scale needed to see an off-line zero is exponential in its height: this is verified height in a
weaker form than a zero count. The hash sign twist also passes (bounded at 0.4 x^(1/4), an amplitude 5000 times zeta's, same exponent).

Classification: CLOSED for both statistics. M: the unimodular twist and the hash sign twist pass (exponent 1/2 within the scatter of the fit), so the
statistic does not fail every control; DH fails only at the x and with the size its off-line zeros give through the explicit formula;
T-NR and E_a fail from the first decades through their coefficients (local factor, size), and the Liouville twist through its zero
at s = 1. Riesz: DH and the hash sign twist pass to 1e13.

## 5. Combination 3: restricted fourth moment at block m* = 0.4183 (MEASURED)

Nodes: `saddle-pair-count-saving-equivalence`, `z0-charge-is-lemma-14-2-term-l`, `mem-xu-sang-ceiling` (source lane
`e2-two-scale-detector-moment`, sections 1-3: in the estimate system C1-C3 of the 7/8 method a saving U^(-omega) of the fourth
moment of the central block restricted to a class is the same statement as a count saving U^(-omega) on the rows whose plain witness
is the block m* = 0.418254; that lane measured U = 2^10..2^19).

Finite consequence tested. Rows: the prime ideals pi of Z[w] of norm p = 1 mod 3, U <= p < 2U (two per p), chi_pi the sextic
residue symbol. S_m(pi) = sum over primary n of chi_pi(n) N(n)^(-1/2) W(N(n)/U^m), W(x) = sin^2(pi log2 x) on [1, 2]. Class: the
k = ceil(rows^0.590332) rows with the largest abs S_m* (plain witness at the block m*). share = (sum over the class of
abs S_1/2 ^4)/(sum over all rows), omega = -log(share)/log(rows); a class independent of the central block has omega = 0.4097.
If the count saving had content tied to the primes, omega would be positive and stable in U for the sextic rows and would change
when the column weights are replaced by controls. Controls act on the columns through the norm: c(n) = eps(N(n)) with eps the hash
sign twist (SGN), the Liouville function (LIOU), the thin sign twist THIN (b = 0.9, greedy floor rule), the thin deletion DEL
(b = 0.9: columns with a norm divisible by a prime of the set are removed); and one weight that is not multiplicative, an independent
sign per element (IID), added to see what the statistic reads. DH, heat, E_a and T-NR have no row family here: N.

Sizes: all rows at each of U = 1e4, 3.16e4, ..., 1e8 (5,316,922 rows and 4,924 columns at U = 1e8); every symbol by one modular
power (Montgomery arithmetic), `rows4.c`, `rows6.c`.

| U | rows | k | TRUE omega | SGN | LIOU | THIN | DEL | IID | log share TRUE | correlation of log abs S_m* with log abs S_1/2 (TRUE; SGN; IID) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1e4 | 1,026 | 60 | 0.378 | 0.511 | 0.408 | 0.354 | 0.502 | 0.411 | -2.62 | 0.03; -0.05; -0.03 |
| 3.16e4 | 2,926 | 112 | 0.397 | 0.285 | 0.367 | 0.329 | 0.393 | 0.428 | -3.17 | 0.11; 0.11; 0.03 |
| 1e5 | 8,408 | 208 | 0.348 | 0.357 | 0.380 | 0.338 | 0.430 | 0.429 | -3.14 | 0.06; 0.03; -0.01 |
| 3.16e5 | 24,198 | 388 | 0.342 | 0.324 | 0.343 | 0.336 | 0.391 | 0.414 | -3.45 | 0.07; 0.05; -0.01 |
| 1e6 | 70,362 | 728 | 0.307 | 0.293 | 0.282 | 0.290 | 0.362 | 0.405 | -3.42 | 0.10; 0.10; 0.00 |
| 3.16e6 | 205,946 | 1,371 | 0.279 | 0.262 | 0.260 | 0.262 | 0.338 | 0.408 | -3.41 | 0.15; 0.14; 0.00 |
| 1e7 | 605,864 | 2,592 | 0.253 | 0.233 | 0.232 | 0.231 | 0.294 | 0.416 | -3.37 | 0.20; 0.20; 0.00 |
| 3.16e7 | 1,791,116 | 4,914 | 0.238 | 0.224 | 0.223 | 0.225 | 0.291 | 0.410 | -3.42 | 0.22; 0.22; 0.00 |
| 1e8 | 5,316,922 | 9,341 | 0.247 | 0.225 | 0.224 | 0.227 | 0.306 | (not run) | -3.83 | 0.19; 0.18; - |

Random classes of the same size (200 draws per cell): omega = 0.410 with standard deviation 0.036 (U = 1e4) down to 0.002 (U = 1e8).
Slope of log(share) against log(rows) for U >= 3.16e5 (six points): TRUE 0.049 +- 0.035, SGN 0.023 +- 0.029, LIOU 0.002 +- 0.041,
THIN 0.013 +- 0.037, DEL 0.111 +- 0.050; IID 0.414 +- 0.018 (five points).

Reading.

1. The premise "omega > 0 stable in U" fails for the sextic rows themselves. The per-U omega falls from 0.38 to 0.24, and the share
   of the fourth moment held by the class is nearly constant, 3.2% to 3.4% for U from 3.16e5 to 3.16e7 and 2.2% at 1e8. The local
   exponent is 0.05 +- 0.04: on these rows the plain-witness class at m* carries a fixed fraction of the central fourth moment. The
   mean of abs S_1/2 ^2 over the class is 1.1 times the overall mean at U = 1e4 and 4.2 times at U = 3.16e7.
2. Sign-twisted columns (SGN, LIOU, THIN) behave identically in exponent. They sit 0.013 to 0.025 below TRUE in omega at every
   U >= 1e6 (a factor 1.2 to 1.45 in the share, the same for the three twists to within 0.004 in omega), which is a constant and not a power of U. The classes
   themselves are different sets of rows (overlap with the TRUE class 0.3% to 15%). The deletion DEL keeps the trend at a higher level.
3. The non-multiplicative weight IID gives the random-class value at every U (0.405 to 0.429, slope 0.414, correlation 0.00, fourth
   moment ratio 2.00). So the statistic reads complete multiplicativity of the column weights (the short sum and the central sum of
   one row share the values of the character at the small primes, and extreme short sums come with large central sums); it does not
   read which primes carry which sign.
4. Agreement with the source lane where the sizes overlap: omega(TRUE) = 0.3408, 0.3546, 0.3721 at U = 2^16, 2^17, 2^18 against
   0.341, 0.355, 0.372 there (`analyse.log`, column "plain").
5. Hypothesis (H) of the 7/8 target concerns rows carrying an off-line zero; none is in the sample (lane e2 said the same). The
   measurement shows what generic rows do and cannot support (H).

Classification: CLOSED. The count passes identically (same exponent) for the sign-twisted and thinned columns, so it does not read
the primes; and the exponent it returns on the sextic rows is not a stable positive omega (slope 0.05 +- 0.04 against 0.41 for an
independent class).

## 6. Combination 4: cubic Gauss sums over primes with the dual index; the dual-term correlation

Nodes: `tro6-dual-term-lambda-c-correlation`, `tro6-lemma-s-squarefull-twist`, `m1plus-cubic-gauss-prime-sum-uniform` (source lanes
`e2-tro6-signed-csum-stratified` section 4 and `e2-below-level-mixed-moment`).

### 6.1 Sums over primes, uniform in the dual index (MEASURED)

Statistic. pi a primary prime of Z[w] of norm p = 1 mod 3, psi_pi the cubic residue character, g~(pi) = p^(-1/2) sum_x psi_pi(x) e(x/pi),
g~(m, pi) = conj(psi_pi(m)) g~(pi). S(m; X) = sum over both primes above each p <= X of g~(m, pi). Indices: all m with
1 <= N(m) <= 3000 modulo +-1 (5,445 indices; unit multiples are different indices because psi_pi(w) depends on p mod 9).
Table: the gauss6 table of `tmp/sextic/` (332,194 primes p = 1 mod 3 below 1e7, 664,388 prime elements). Norm 1e10 was not reached:
each Gauss sum costs p operations, so the table to X costs about X^2/(4 log X) operations, 2e18 at X = 1e10 (section 8).
Controls: R = each g~(pi) times an independent random cube root of unity (keeps g~(pi)^3, which is what the cubic character fixes);
P = the table permuted among primes inside blocks of 256 consecutive primes. Zeta controls (DH, heat, twists, E_a, T-NR): N.

Checks: abs g~ = 1 to 1.1e-9; g~(pi)^3 = -pi/abs(pi) to 3.4e-9 on all 332,194 primes.

| X | prime elements | TRUE sup_m abs S / count | TRUE rms over m | R sup | R rms | P sup | P rms | abs S(1; X) log X / X^(5/6) |
|---|---|---|---|---|---|---|---|---|
| 1e4 | 1,222 | 0.2012 | 0.0549 | 0.0997 | 0.0287 | 0.1515 | 0.0293 | 0.725 |
| 1e5 | 9,568 | 0.1501 | 0.0341 | 0.0339 | 0.0102 | 0.1030 | 0.0109 | 0.786 |
| 1e6 | 78,462 | 0.1017 | 0.0228 | 0.0106 | 0.0036 | 0.0709 | 0.0046 | 0.770 |
| 1e7 | 664,388 | 0.0684 | 0.0154 | 0.0037 | 0.0012 | 0.0474 | 0.0023 | 0.745 |

Exponents in X (25 checkpoints, X >= 1e4): sup/count: TRUE -0.158, R -0.466, P -0.164; rms over m: TRUE -0.180, R -0.456, P -0.374.
The supremum of the true table is attained at m = lambda = 1 + 2w at every X.

With the polar term removed per index (S(m; X) = c_m L(X) + R(m; X), L(X) = sum of 2 p^(-1/6) over the table, c_m fitted on X >= 1e4):

| table | exponent of sup_m abs R / count | of rms | sup abs R / sqrt(count) at X = 1e7 | rms / sqrt(count) | max abs c_m | share of indices with abs c_m > 0.1 |
|---|---|---|---|---|---|---|
| TRUE | -0.525 | -0.523 | 1.91 | 0.69 | 0.828 (m = lambda times a cube: N = 3, 81, 192, 1029, 2187) | 69.2% |
| R | -0.532 | -0.525 | 2.75 | 0.89 | 0.048 | 0 |
| P | -0.523 | -0.522 | 2.44 | 0.89 | 0.573 (m a cube: N = 1, 27, 64, 343, 729, 1728) | 0.17% |

Reading.

1. Before the polar term is removed the saving, uniform in the index, is X^(-1/6): the term of size X^(5/6)/log X of Patterson's
   conjecture (CLASSICAL as a conjecture; conditional proofs exist in the literature, not re-read here), with index-dependent constant
   c_m. c_1 = 0.573, c_lambda = 0.828, ratio 1.445 (3^(1/3) = 1.442).
2. After removal the remainder is at the square-root level for all 5,445 indices up to X = 1e7 (sup 1.9 sqrt(count), below the
   random-cube-root control at 2.7 sqrt(count)). At this size the data are compatible with the uniform cancellation (M1+) asks for,
   apart from the polar term, which (M1+) must be stated with.
3. Origin, decided by the permuted table: after permutation the polar term survives only where the twist conj(psi_pi(m)) is trivial
   for every pi (m a cube; 0.17% of the indices) and has the value of the untwisted sum; at the other 69% of indices it is gone. So
   the untwisted bias is a property of the table of values alone, and the index-dependent constants c_m (theta coefficients) come
   from the coupling of g~(pi) to psi_pi(m). Random cube roots remove both.
4. No control of the zeta battery can be formulated for this statistic, and a pass is what GRH for the Hecke L-functions behind
   these sums predicts. It carries no information on zeros of zeta beyond the 7/8 method's own use of (M1+).


### 6.2 The dual-term correlation with a permuted Gauss-sum table (MEASURED)

Lane e2-tro6-signed-csum-stratified measured that the non-polar remainder y_sigma(c) conj gamma_1(c) of the twisted sums is
correlated with theta estimators rho-hat_tau at the index lambda c (explained fraction R^2 about 0.25 above the permutation null),
and left open whether this comes from the theta coefficients or from the fact that both sides are built from one table of Gauss
sums. The control asked for here: rerun the same pipeline (the lane's `scale.py`, `dual_coef.py`, `dual_probe2.py`, unchanged apart
from one consistency assertion turned into a printed line) on a copy of the table in which the sextic Gauss sums gamma_1(n) of the
2,822,619 squarefree nodes are permuted inside blocks of 64 nodes of equal class mod 4 and neighbouring norm (`mkperm.py`: 98.4% of
the nodes moved, correlation of old and new values 0.016; the cubic and quadratic sums, mu and the prime arrays are kept).
If the correlation were produced by the shared table (two linear forms in the same unimodular vector with overlapping kernels), it
would survive, because that mechanism does not depend on which value sits at which node.

Q = 3750 (7,190 conductors with 4,500 < N(c) <= 30,000; 108 groups by (c mod 4, c mod 9), median size 67; null 12/n_g = 0.18):

| system (A, B, U) | true table (lane e2, same Q and conductors) | permuted table | permuted, null | permuted, estimator from moduli <= 2e6 / > 2e6 | permuted, conjugate conductor |
|---|---|---|---|---|---|
| (1, 0, 0): index lambda c | 0.424 (null 0.183..0.186; halves 0.415 / 0.388; conjugate 0.222) | 0.1869 | 0.1833 | 0.1844 / 0.1839 | 0.1831 |
| (3, 4, 5) | (not listed at this Q) | 0.1849 | 0.1833 | 0.1839 / 0.1844 | 0.1844 |
| (0, 0, 0): index c | (not listed at this Q) | 0.1823 | 0.1846 | 0.1857 / 0.1820 | 0.1810 |
| (5, 1, 0): index -e0 c | 0.228 | 0.1883 | 0.1839 | 0.1871 / 0.1888 | 0.1859 |

Correlation between the two half-estimators (moduli below and above 2e6), mean over classes: 0.80 for the true table (lane e2),
0.012 for the permuted table. The Moebius slice statistics of the permuted run are at the random level for every weight (mean t
0.89..1.20).

Reading. With the permuted table every system is at the null (largest excess 0.004 against 0.24 for the true table). The correlation
is therefore not an artefact of the shared table or of the pipeline; it needs the arithmetic link between gamma_1(n) and n, that is,
both sides estimate the same theta coefficients. This removes the caveat recorded with the node
`tro6-dual-term-lambda-c-correlation`. It remains a correlation between two finite estimators, not a Voronoi formula, and it gives
no bound.

Not done: Q = 1e6. The estimators use Gauss sums of squarefree moduli up to 1e7; the lane's geometry R = Q^1.4 with that table ends at
Q = 30000, and a table to the norm needed for Q = 1e6 (about 1e9 or more) is out of reach by the direct method (section 6.1). One
permutation seed, one Q.

Classification of combination 4: CLOSED as a screening test for RH (no control of the battery is formulable for either statistic,
and passes are what GRH for the cubic and sextic Hecke families predicts). Two measured facts are added for the 7/8 lanes:
uniform square-root cancellation in the prime sums after the polar term, for 5,445 dual indices up to norm 1e7; and the origin of
the dual-term correlation (theta coefficients, not the shared table).

## 7. Not run, and limits of what was run

- Combination 1 at 2000 modes and 300 digits: not run. Run instead: 900 modes in float64 to X = 1e7, and 48 modes at 60 digits at
  three supports. A 300-digit eigen-solve of a 2000 x 2000 matrix was not attempted because the classification does not depend on
  it: every control fails by amounts between 1e-2 and 6e3, and zeta's values are at the rounding level of the arithmetic used.
  Positivity of zeta's form is not claimed at any support.
- Combination 2 to x = 1e13: not reached for M(x). The slice was oversubscribed during the run (load average 120 to 160 on 48 cores; the
  six-thread unit received 1 to 3 cores). Reached: 1e12 for zeta, the characters, the Liouville twist and T-NR (M(1e12) = 62366, equal to the published value), 1e11 for the hash sign twist, the unimodular twist and E_a, 1e9 for DH (8 GB table). A sieve to 1e13 needs 5e4 to 9e4 core-seconds with this code; at the share the slice gave (about 1.4 cores for a six-thread unit) that is more than ten hours. The Riesz sums reach x = 1e13 for every object (they need the coefficients only up
  to 400 sqrt x).
- Heat controls in combinations 2 to 4: N (no Dirichlet series, no rows). In combination 1 they enter through their zero tables
  (height <= 2000), so the form is a lower bound up to the off-line pairs above 2000; supports a <= 3.6 only.
- DH has no zero with real part above 1 below height 2000 in the battery table (largest 0.8695 at ordinate 240.40); the growth of
  its inverse through zeros to the right of 1 is therefore not visible at x <= 1e9 and was not tested.
- Combination 3: the class is defined by rank (the source threshold class is empty at every U, as in lane e2); one seed for the hash
  sign twist; b = 0.9 only for THIN and DEL; IID not run at U = 1e8.
- Combination 4: Gauss sums to norm 1e7, not 1e10 (cost X^2/(4 log X)); the dual-term statistic at Q = 3750 only, not extended to
  Q = 1e6 (the estimators need Gauss sums of all squarefree moduli up to about Q^1.4 times the window, and the existing table stops
  at 1e7; Q = 30000 is its limit). One permutation seed.
- All numbers are MEASURED. No interval arithmetic was used. Fits over three to five decades carry logarithmic uncertainties of the
  size shown by the m = 0 / m = 1 columns of section 3.

## 8. Files and reproduction

All paths under `tmp/research-2026-11-16/push/s4-floor-exponent-moebius-cubic-rows/`; server copy `~/rh-push/s4-floor-exponent-moebius-cubic-rows/`.

| file | content |
|---|---|
| `floorA.json`, `floorB.json`, `floorB_fits.json` | combination 1: lambda_min per object and support (runs A, B); onsets and fits |
| `floor_mp.json`, `floor_mp.log` | 60-digit re-check |
| `floor_modes.json`, `floor_lowmodes.json` | basis functions needed per control; DH with at most 32 functions per sector up to X = 1e7 |
| `zeroside.json`, `zeroside.log`, `zeroside_heat.json` | zero-side forms (zeta, DH, heat) |
| `mobB.cp`, `mobB.seg`, `mobC*.cp/.seg`, `mobL_d*.cp/.seg`, `mobM.cp`, `mobM.seg`, `mobM_table.json` | combination 2: sieve outputs (checkpoint sums; per-segment base, minimum and maximum of the partial sums), merged run, fits |
| `riesz_2e9.txt`, `riesz_an.json`, `dh_1e9.*`, `ea25_1e9.*`, `ea125_1e9.*`, `dh_pred.json`, `ea_pred.json` | Riesz sums; DH and E_a partial sums, block suprema and Riesz sums; explicit-formula amplitudes |
| `rows_an_A.json`, `rows_an_B.json`, `rows6_an.json` | combination 3: class statistics per U and weighting (the row files `rows_*.bin`, 0.7 GB, stay on the server) |
| `gsum_3000.json` | combination 4a: suprema, rms, polar fits, per-index amplitudes |
| `perm_probe2.log`, `logs/rh-s4perm-*.log` | combination 4b: output of the lane-e2 probe on the permuted table |
| `logs/` | logs of every server unit of this lane |
| `cp.txt`, `cpL.txt`, `cpC.txt`, `xlist.txt` | checkpoint lists (32 per decade closed under division by 3; chunk boundaries) and the x grid of the Riesz sums |

Reproduction (server, inside the lane directory, each line through `rhrun <name> <GB> <cores> --`):
`gcc -O3 -march=native -fopenmp -o mob mob.c -lm` (same for `riesz.c`, `dser.c`, `rows4.c`, `rows6.c`);
`NB=450 XMAX=1e7 NPTS=64 FW=2 python floor.py floorB.json`; `./mob 1e11 1e10 cp.txt mobB`; `./mob 1e11 1e11 cpC.txt mobC1 596 2384`
(and the two further ranges); `./riesz 2e9 xlist.txt riesz_2e9.txt`; `./dser DH 1e9 cp.txt xlist.txt dh_1e9`;
`./dser EA 1e9 cp.txt xlist.txt ea25_1e9 0.25`; `./rows4 1e8 rows_1e8.bin`; `python rows4_an.py out.json rows_*.bin`;
`python gsum.py 3000 gsum_3000.json split_*.bin`; `./permrun.sh`.
Local: `scripts/memcap.sh 8 python3 floor_mp.py 24 floor_mp.json 1.36 1.86 2.37`; `zeroside.py`, `zeroside_heat.py`, `floor_modes.py`,
`floor_lowmodes.py`, `dh_pred.py`, `ea_pred.py`, `riesz_an.py`; `mob_local 1e12 0 cpL.txt mobL_dK SLO SHI` for the nine ranges (`clang -O2 -o mob_local mob.c -lm`, single thread);
`mob_merge2.py mobM withC`; `c2_table.py mobM 1e12 <X2>`.
