# s6-flow-grade-kappa-landing-heatop: screening of four heat-flow combinations

Lane `s6-flow-grade-kappa-landing-heatop`, 2026-11-20. Screening arm. Labels: PROVED (short argument here or in the cited node), CLASSICAL,
MEASURED (precision stated per line), STRUCTURAL (follows from the definition of the control), ARGUED (heuristic). No claim about RH or about
Lambda of zeta. No bound moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | statistic | sizes reached | zeta | comparison L-functions | DH | heat tau < 0 | zeta(s+a)zeta(s-a) | T-NR | sign twist / unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | grade kappa(Strip) = (2 theta - 1)^2/2 against Lambda(F) (flow-criticality grade, half-plane substitution, de Bruijn strip to Lambda) | landing time T of an off-line pair over de Bruijn's Y^2/2, Y = 2(beta - 1/2); Lambda_H/kappa_H by height; pairs planted on zeta | function side: Taylor tables at 10000 bits, pairs to height 1267 (63 pairs: DH 26, heat 24, T-NR 6, E_a 5, planted 2); zero ODE: controls to 5e4 (tables of `s5`), DH to 1e5 in one flow (147,407 real zeros + 8138 pairs, 1417 force evaluations); planted pairs on zeta at heights 1e3 .. 1e12, 4 depths, 4 local configurations | planted pair, Y = 1: T/(Y^2/2) = 0.55, 0.41, 0.32, 0.29, 0.26 at heights 1e3 .. 4e6 (pair added); 0.77 .. 0.41 (pair replacing two zeros); 0.56 .. 0.28 (all zeros within 12 spacings moved off the line); at 1e9 and 1e12: 0.19 and 0.14 (added), 0.28 and 0.20 (replacing), 0.21 and 0.16 (row). The ratio follows Y times the density of zeros | no off-line pair in the lists; planted pairs not run (same construction, density log(qT/2 pi)) | Lambda >= 0.230607362 (pair at 240.40, function side at 1700 bits; ODE of `s5`: 0.230607). Lambda_H/kappa_H = 0.927, 0.844, 0.729, 0.658 at H = 126, 258, 4542, 3.9e4: kappa_H grows with the deepest pair found, Lambda_H does not; 0.604 at H = 8e4. No pair below 1e5 lands later (next: 0.2232 at 2442.5); the deepest pair (49,688, beta - 1/2 = 0.4371, de Bruijn 0.3820) lands at 0.1392 | first 12 pairs of H_{-0.1}: all land before 0.0752; of H_{-0.5}: before 0.3306 | a = 0.3: 0.177842793 (ratio 0.9880); a = 0.45: 0.394296017 (0.9736). In height bands the ratio falls from 0.99 to 0.59 at 1.6e4 | q = 3: 0.313490635 (0.9615), band ratio 0.96 to 0.41 at 1.6e4. q = 1000003: 0.001997309 (0.9688) | sign twist: no entire function, not formulable. unimodular twist: translate of zeta | CLOSED. Zeros only. The grade is sharp only where the density of zeros is small (lowest zeros). At height the gap between kappa and the landing time is the pull of the neighbouring zeros, the same for zeta with a planted pair and for every control |
| 2 | critical heat time of Jensen polynomials (Hermite-Poulain shift, polynomial de Bruijn, GORZ, heat family) | t*(d, n) = least t with e^{-t D^2} J^{d,n} real-rooted (isolated root balls, ball coefficients); degree d_pair at which the Jensen root continuing an off-line zero turns real | grid d <= 400 (24 degrees), n <= 2000 (15 shifts) on 7 objects, 360 cells each, 4000-bit table (Mac); degrees 8, 100, 400 with n to 10000 (17 shifts) on 13 objects, 10000-bit tables; pair tracking in d to 6.3e6 for 35 DH pairs (10000-bit table) | t* = 0 in all 360 cells (certified) | L(chi_-4), L(chi_5): t* = 0 in all 51 cells (d = 8, 100, 400; n to 10000) | t* = 0 in all 360 cells. First failure d = 20786 at n = 0 (cone bound 19291); at n = 1, 2 none of the 35 tracked pairs gives a non-real root | covered by the cone bound for d <= 400 (first pairs at 415.3 and 111.7); run: t* = 0 in all 51 cells for both | a = 0.45 (no zero on the line): t* > 0 only at n = 0, d >= 256 (d_pair = 250); t* = 0 at every n >= 1. a = 0.3: d_pair = 558 | q = 3 and q = 1000003: t* > 0 only at n = 0, d >= 16 (d_pair = 14); t* = 0 in all 336 cells with n >= 1 | sign twist: not entire. unimodular twist: translate of zeta | CLOSED. Coefficients as functions of the zeros. Each failure cell is a failure cell of zeta with the control's zero planted (d_pair 14 against 14; 20786 against 19984 and 22117). One derivative in z^2 removes every tracked off-line pair, so the surface with n >= 1 passes T-NR, E_a and DH |
| 3 | twistor heat compatibility, Burgers identity, zero ODE, Gaussian convolution | M_t = -H_t'/H_t from prime powers <= P against direct evaluation, t = -0.1, 0, +0.1, lines Im z = 1.2 and 2; Burgers defect | P = 1e9 (50,851,223 prime powers), x to 1e8, 7 heights, 8 objects | t = 0: 4e-6 to 7e-6 (line 1.2), 7e-10 to 2e-9 (line 2); t = -0.1: 1e-10 to 3e-6; t = +0.1: not available from primes (0.14 to 0.91 of M comes from the part of the integral inside the strip on line 1.2) | L(chi_-4), L(chi_5): 5e-7 to 2.4e-6 and 2e-10 to 4e-10 | from its two Euler products: 4e-7 to 2.9e-6. From its own -F'/F coefficients (n <= 1e7): 4e-4 to 4e-3 on Re s = 1.1 | is the object at t = -0.1 | a = 0.02: 8e-6 | q = 1000003: as zeta. q = 3: 7e-3 to 4e-2 on line 1.2 (series ratio 0.81, zeros at Re s = 0.904) | Liouville twist: as zeta for t <= 0; t > 0 not defined (not entire) | CLOSED, target-blind. The Lean statements quantify over all maps and all polynomial heat flows; the prime side is the Euler product on Re s > 1 and holds for each object with its own coefficients |
| 4 | backward leaving rate (Dyson ODE, jet lemma, winding monotonicity) | D(tau, T) = real zeros of H_0 minus real zeros of H_{-tau}, over 2 P2(sqrt(8 tau)(1 - tau B)) with the Bogomolny-Keating two-point function (primes to 1e6) and the sine-kernel triple term | direct count: T = 1e4 .. 1e10, up to 4.0e6 zeros per T; lists: 1.0e7 zeros, 1.0e8 zeros (first zeros), 1.0e6 at 1e9 and at 1e12; tau = 1e-6 .. 1e-2 | tau = 1e-2: 1.0018 +- 0.0036 (1e7), 1.0094 +- 0.0050 (1e8), 1.0054 +- 0.0070 (1e9), 1.024 +- 0.011 (1e10); 1e7 list: 1.0097 +- 0.0023; tau = 1e-3: 0.989 +- 0.012 | L(chi), L(chibar) mod 5: 1.0145 +- 0.0077, 1.0121 +- 0.0077 | 115, 28, 5.6, 2.1, 0.77 at tau = 1e-6 .. 1e-2 (on-line list, 8.5e5 zeros) | lists at tau0 = -1e-4, -1e-2: 2.1 and 12 at tau = 1e-4 | no real zero | q = 1000003: 1.00 at tau = 1e-3, 1.28 to 1.34 at tau = 1e-2 (T = 1e5 .. 1e7); q = 3: 1.026 against 1.022 for zeta on the same blocks | no line / translate | CLOSED. Zeros only. T-NR at q = 3 passes at every tau; at q = 1000003 it leaves 1 at tau of the order of the unfolded landing time of its pairs; DH and the heat lists leave 1 through the small-gap law of lists that have lost zeros |

How each object enters. Combination 1: through the positions of its zeros (the landing time is reproduced by the zero ODE to 9e-5 or better
and by the Taylor coefficients, which are symmetric functions of the zeros). Combination 2: through the Taylor coefficients at the centre,
all of them together; no prime enters separately. Combination 3: through the Dirichlet coefficients on Re s > 1, and not at all in the
Lean statements. Combination 4: zero side through the zeros; the prediction through all primes (two-point function), heuristic.

The pattern of the brief holds in all four. Three points came out of the runs:
- one derivative in the variable z^2 turns every tracked off-line pair of DH (35 pairs), of T-NR and of zeta(s+a)zeta(s-a) into real zeros, so
  the Jensen surface with shift n >= 1 and d <= 400 is passed by functions with no zero on the line at all (E_a, a = 0.45);
- the backward leaving rate is passed at every tau by T-NR at q = 3 (off-line zeros from height 2.86, depth 0.40), and separates T-NR at
  q = 1000003 only for tau above about depth^2/2 in unfolded units;
- the two-point function with arithmetic terms and a triple correction predicts the number of real zeros lost by H_{-tau} for zeta at
  tau = 1e-2 to 0.9 % with the sine-kernel value of the triple term and to 0.1 % with the measured one (1.0e8 zeros; GUE alone is off
  by 9 to 18 %).

## 1. What would have counted as survival (written before the runs)

1. Grade against Lambda: zeta with planted pairs keeps landing time / (Y^2/2) near 1 at every height, and a control family shows a ratio that
   falls with height for a reason tied to its coefficients (not to the number of zeros near the pair).
2. Critical heat time of Jensen polynomials: t*(d, n) = 0 for zeta on the whole grid, and a control has t*(d, n) > 0 in a cell where zeta with
   the control's first off-line zero planted has t* = 0.
3. Prime-side Burgers: the prime-side M_t of zeta agrees with direct evaluation at the three t, and a control disagrees on a line where its
   F'/F converges by more than the truncation of its own series explains.
4. Backward leaving rate: measured D over prediction is 1 within the counting error for zeta at two sizes, and every control leaves 1 at a
   tau below the scale at which its off-line pairs act on the real zeros (their depth squared over 2, unfolded), in windows that hold no
   off-line pair or far fewer than the statistic needs.

## 2. What was run, where, sizes

| computation | size | where |
|---|---|---|
| Taylor coefficients at the centre of the strip (moments of the theta kernels, trapezoid rule): zeta, heat t = -0.1 and -0.5, tilts a = 0.3 and 0.45, DH, L(chi_-4), L(chi_5) | 10000 bits, orders to 20900 (k <= 10450), 10,575 to 12,500 nodes, 1.1e9 multiplications for the zeta variants | server, 8 workers, 59 min (7 min more for the second step size) |
| the same at 4000 bits, k <= 3450; second copy with the corrected kernel cut (section 3) | 3,761 to 4,530 nodes | Mac |
| combination 1, function side (`c1_arbland.py`): landing time of an off-line zero from the heat series of the Taylor table | 63 pairs of DH, heat, T-NR, E_a, planted zeta; precision 600 + 6 x height bits, up to 8204 bits; 94 to 1441 s per pair above height 400 | server (heat, T-NR, E_a, planted), Mac (DH, 26 pairs below 900) |
| combination 1, zero ODE with planted pairs on zeta (`c1_plant.py`): 20 to 40 sites per height, 4 depths, 4 configurations, windows of 300 zeros each side | heights 1e3 .. 4e6 (Mac); 1e3 .. 4e7 on the list of 1.0e8 zeros, 1e9 and 1e12 on the windows of `s2` and `s3` (server) | Mac, server |
| combination 1, Lambda_H/kappa_H from the per-pair landing tables of `s5-heat-landing-collision-scaling` (read only) and from a new flow of DH to height 1e5 (`c1_flow.py` of `s5`, 163,683 particles, 5.4e10 pair terms per evaluation, 26 min on 8 cores, server) | DH 3700 pairs below 5e4, T-NR q = 3 (3497), q = 1000003 (6596), E_a (22491) | Mac |
| combination 2, surface t*(d, n): 24 degrees d = 2 .. 400, 15 shifts n = 0 .. 2000 | 360 cells x 7 objects (zeta, DH, T-NR q = 3 and 1000003, zeta with either T-NR pair planted, E_a a = 0.45); degree-400 root isolation about 110 s per cell | Mac, 6 workers |
| combination 2, surface with n to 10000 (17 shifts), degrees 8, 100, 400 : zeta and DH on the corrected tables, L(chi_-4), L(chi_5), heat -0.1 and -0.5, zeta with the DH zero and with either T-NR pair planted (51 cells each); T-NR q = 3 and 1000003, E_a a = 0.3 and 0.45 at n = 5000 and 10000 (6 cells each; the series of these objects need a polynomial product of 1.7 GB per worker) | 483 cells | Mac, 2 to 6 workers (the server units queued for this were stopped, see below) |
| combination 2, pair tracking in the degree (`c2_track.py`): DH 84 pairs below 2000 (35 resolved, to height 1155), T-NR, E_a, planted zeta | degrees to 6.3e6; up to 6320 terms, 4848 bits of cancellation | server and Mac (10000-bit table) |
| combination 3 (`c3.py`): prime-power sums by class mod 20 and parity of the exponent, 93 nodes on each line and 141 abscissae on the vertical line per point | P = 1e9: 50,851,223 prime powers; x0 = 1e2 .. 1e8 (zeta, Liouville, T-NR, E_a), 1e2 .. 1e4 (L(chi_-4), L(chi_5), DH); P = 1e8 for all | Mac (single thread, 3 runs); server, 8 cores, 4.5 min (same sizes; the two machines agree to the digits shown on line 1.2) |
| combination 3, DH with its own coefficients (`c3_dhser.py`) | n <= 1e7 | Mac |
| combination 4, direct count (`c4_count.py`): Riemann-Siegel sum with C0..C2 and the heat factor, 4 samples per mean spacing | T = 1e4, 1e5, 1e6 (all zeros of [T, 2T]: 11,776; 150,726; 1,901,033), 1e7 (4,000,214), 1e8 (2,000,011), 1e9 (1,000,007), 1e10 (400,004); tau = 1e-4, 1e-3, 1e-2 | Mac, 5 to 6 workers; server: 2,000,112, 1,000,010, 400,004 and 150,004 zeros at 1e7 .. 1e10 (second sample) |
| combination 4, T-NR (`tnr_samples`): the same sum with the factor c + 2 cos(w log q) carried through the flow | q = 1000003: T = 1e4, 1e5, 1e6 (400,292 zeros), 1e7 (100,009); q = 3: T = 1e5 (150,726) | Mac |
| combination 4, lists (`c4_lists.py`): pair criterion on stored ordinates | zeta first 1.0e7 zeros; L(chi), L(chibar) mod 5 (9.5e5 each); DH and alt on-line (8.5e5, 7.0e5); heat lists at 1e7 (1.0e6 each); zeta first 100,115,548 zeros, windows at 1e9 (1,019,907) and 1e12 (999,904), heat lists of 4.0e6 zeros (server) | Mac, server |

Local runs went through `scripts/memcap.sh 8`. Server runs went through `rhrun` only: units `rh-s6-mom-1120115012` (moments, 8 cores,
12 GB cap, 2.7 GB peak), `rh-s6fgk-stage2-1120122728`, `rh-s6fgk-stage3-1120131543`, `rh-s6fgk-stage4-1120132828` (10 GB cap each, 8 cores,
run one after the other). The moment unit and stage 2 ran to their end (stage 2: 12:56 to 15:07 UTC); stages 3 and 4 were stopped by unit name before their first command, when the Mac became idle and their work (corrected tables, surfaces with n to 10000, DH landing times) was moved there; two small units `rh-s6fgk-plantz-*` (2 cores, 4 GB) ran the planted pairs on the list of 1.0e8 zeros (the first was stopped and relaunched after a fix). No unit of this lane is active. The server refused new units for about 35 minutes (less than 50 GB available on the machine, load
average 110 to 128), and ssh timed out several times; during that time the Mac was used for the smaller sizes, and later for the sizes in
the table when it was idle. GPU 1 was at 100 % utilisation with 92 GB in use by other jobs; no GPU stage was run. One step of my own unit
(the first DH landing run, which had the bug described in section 3) was stopped by process id inside the unit's control group.

## 3. Methods and validation

**Taylor tables** (`mom.py`, `jl.py`). With s = 1/2 + i w, Xi_F(w) = int_R K_F(v) e^{iwv} dv, K_F real and even:
K = sum_n (4 pi^2 n^4 e^{9v/2} - 6 pi n^2 e^{5v/2}) exp(-pi n^2 e^{2v}) for zeta; K = 2 e^{3v/2} sum_n a(n) n exp(-pi n^2 e^{2v}/q) for an odd
character or for DH (a = (1, k, -k, -1, 0) mod 5, k = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1)); K = 2 e^{v/2} sum_n a(n) exp(-pi n^2 e^{2v}/q)
for an even character. F(X) = sum_k c_k X^k with X = z^2, s = 1/2 + z, c_k = M_2k/(2k)!, M_j = int K v^j dv; gamma(k) = k! c_k.
Heat: K -> K e^{t v^2/4} (t = de Bruijn time, z_dB = 2w, d_t H = -H_zz). E_a: Xi(w - ia) Xi(w + ia) from the moments of K e^{av}.
T-NR: Xi(w)(c + 2 cos(w log q)), c = 2.2. Planted pair: Xi(w)(1 - w^2/rho^2)(1 - w^2/conj rho^2), optionally divided by two zeta zeros.
Checks:
- evenness K(v) = K(-v) (the functional equation) for zeta, L(chi_-4), L(chi_5) and DH: difference below 4e-89 at 300 bits;
- Xi(0) = 0.4971207781883141...; Xi = 0 at gamma_1, gamma_10, at 6.0209489047 (chi_-4), 6.6484533447 (chi_5), and at the DH off-line zero
  0.808517182 + 85.699348485 i (7.6e-38 against 3.1e-28 at a point 1 % away);
- heat table against the t-series of the plain table: equal to 25 digits shown; E_a series against the product; T-NR zero and Xi(0);
- two trapezoid steps (1/2000 and 1/2500 at 1500 bits; 1/2500 and 1/3200 at 10000 bits): identical tables at 1500 bits; at 10000 bits the two steps differ by at most 2^-2322, which is the cut error described next (the node sets differ).

**Error found during the run and its repair.** Version 1 of the kernel routine cut the theta sum at an absolute size, which sets K = 0 beyond
v_cut = (1/2) log((lim + 60) q/pi) (3.86 for zeta at 10000 bits). The high moments are therefore truncated: the 10000-bit table has relative
error 2^-8453 at k = 862, 2^-7121 at k = 2000, 2^-4814 at k = 5000, 2^-2322 at k = 10450 (measured between the two steps: 2^-2322;
predicted by exp(g(v_cut) - max g): 2^-2330). "3000 digits" holds only for k below about 300; the table has at least 699 digits at every
order and at least 1449 digits for k <= 5000. Repair: `jl.Tables.arbs` attaches to every entry a ball of that radius (times 2^20), and all
root counts were made with ball coefficients; a corrected table (version 2, relative cut) at 4000 bits has every value inside the ball
assigned to the version-1 value (0 violations in 13,803 entries) and reproduces the predicted differences (2^-2766 at k = 862 against
2^-2759 predicted). The same check at 10000 bits (corrected tables for zeta and DH, Mac, 4 minutes): 0 of 20,902 values outside the assigned balls; differences 2^-8214 (k = 1045), 2^-4668 (5225), 2^-2323 (10450) for zeta and 2^-8524, 2^-5308, 2^-3033 for DH.
A second error: two convergence tests compared against 2.0 ** (-prec/3) in floating point, which is 0 above 3225 bits; pairs above height
420 were reported as unresolved and a series cut never triggered. Both were corrected (tolerance 2^-900, cut in ball arithmetic) and the
affected runs repeated; the pair tracking of DH then resolves 35 pairs instead of 9.

**Landing time on the function side** (`c1_arbland.py`): Xi_t(w) = sum_k (-1)^k M_2k(t) w^2k/(2k)!, M_2k(t) = sum_j (t/4)^j M_{2k+2j}/j!; the
off-line zero is followed by Newton in t and the landing time is found by bisection on "the continued root is non-real" to 1e-10 relative.
No zero list and no ODE enter. Agreement with the zero ODE of `s5`: T-NR q = 3: 0.313490635 against 0.313491; E_a, a = 0.3: 0.177842793
against 0.177843; DH pair at 85.70: 0.176505378 against 0.1765; DH pair at 240.40: 0.230607362 against 0.230607; T-NR q = 1000003:
0.001997309 against 0.001997. The values are not enclosed (Newton at 900 bits or more beyond the cancellation).

**Planted pairs by the zero ODE** (`c1_plant.py`, flow class of `s5` in `hl.py`): window of 300 zeta ordinates each side of the site, the
zeros outside replaced by a constant density on both sides, Dormand-Prince at relative tolerance 1e-9. Against the function side for a pair
added to zeta with beta - 1/2 = 0.3: 0.144612881 against 0.144600323 at height 166.36, 0.132758134 against 0.132755990 at height 544.98
(relative 9e-5 and 1.6e-5; the constant-density tail is the difference).

**Real-root counts** (`jl.real_root_count`): `acb_poly.roots` isolates all roots in disjoint balls for every polynomial with coefficients in
the input balls; a ball that meets the real axis and whose mirror image meets no other ball holds a real root. Precision ladder 700, 2400,
table precision. All 3003 cells of the two grids were certified (the three surfaces first made without error balls were repeated with them; same counts). Known answers: T-NR is hyperbolic at d = 13 and not at d = 16 (the pair tracking gives
d_pair = 14 for both q and for zeta with the pair planted); the cone bound of `jensen-hyperbolicity` Lemma 1 is 13.05.

**Pair tracking in the degree** (`c2_track.py`): P_{d,n}(x) = J^{d,n}(x/d) -> F^(n)(x) as d -> infinity; the root is followed from the
off-line zero by Newton down in d, with bisection on integers. Winding-number check of the statement "the zero of F' continued from the
off-line zero is real" (`val_fprime.py`): in the disc of radius 1.6 Im X_rho around X_rho, F has 2 non-real zeros and F', F'' have none,
for the DH pairs at 85.70 and 240.40 and for the first pair of T-NR.

**Prime side** (`c3.py`, `psum.c`): sums over n = p^k <= P of n^-s/k and of log p n^-s, by class of n mod 20 and parity of k, with the phase
t log n reduced mod 2 pi by an exact product. Objects are assembled from the classes; DH from its two Euler products. Direct values from
Arb at 160 bits (zeta by Riemann-Siegel, L by Hurwitz). The archimedean factor is the same computed number on both sides.

**T-NR under the flow** (`c4_count.tnr_samples`): with lam = log q,
Xi^TNR_t(w) = c Xi_t(w) + e^{t lam^2/4} [e^{i lam w} Xi_t(w - i lam t/2) + e^{-i lam w} Xi_t(w + i lam t/2)] (PROVED: Fourier multiplier;
checked against the Taylor tables to 1e-170, `val_tnr_heat.py`). In the Riemann-Siegel sum the n-th term acquires the factors
e^{+-d k_n}, k_n = (1/2) log(w/2 pi) - log n, d = lam t/2. Checks: at t = 0 the real zeros are the zeta zeros (15,476 and 14,666 in two
blocks, largest shift 1e-9); against quadrature of the exact function on [10000, 10120] (`val_tnr_model.py`): 141, 139, 135 real zeros at
tau = 1e-3, 3e-3, 1e-2 in both, positions equal up to the common translation pi t/8 (rms 0.0012, 0.0038, 0.0135).

**Leaving count and pair criterion** (`c4_count.py`, `c4lib.py`): the direct count D and the criterion "2 x pairs with
tau_c(g, B) <= tau", tau_c = -log(1 - g^2 B/2)/(4B), agree: 5558 against 5534 (T = 1e5), 73,114 against 73,000 (1e6), 157,680 against
157,522 (1e7), 81,332 against 81,256 (1e8), 41,166 against 41,144 (1e9) at tau = 1e-2, and to +-6 at tau = 1e-3. The dispersion of the
ratio over 49 chunks of 2e5 zeros is 0.0886 at tau = 1e-3 (Poisson: 0.0863) and 0.0147 at tau = 1e-2 (0.0162).

## 4. Combination 1: grade kappa against Lambda

Nodes: flow-criticality-grade-kappa, flow-criticality-degree, lean-halfplane-substitution, start-substitution-lemma,
mem-de-bruijn-strip-to-lambda, lambda-rh-ledger. Statement tested: kappa(Strip_Y) = Y^2/2 is the supremum of Lambda over the de Bruijn class
with zeros in the strip (witness (z^2 + Y^2) cos(cz), Lambda = (sqrt(1 + 4c^2Y^2) - 1)/(4c^2), which tends to Y^2/2 only as c -> 0).

**Lambda(F)/kappa(theta_F) and the height that realises it** (function side, MEASURED at 600 to 8204 bits; table C1a):

| object | Lambda(F) (lower bound: largest landing time found) | realised at | de Bruijn Y^2/2 there | ratio |
|---|---|---|---|---|
| T-NR q = 3 | 0.313490635 | first pair, height 2.86 | 0.326033 | 0.9615 |
| T-NR q = 1000003 | 0.001997309 | first pair, height 0.227 | 0.002062 | 0.9688 |
| E_a, a = 0.3 | 0.177842793 | first pair, height 14.13 | 0.18 | 0.9880 |
| E_a, a = 0.45 | 0.394296017 | first pair, height 14.13 | 0.405 | 0.9736 |
| heat t = -0.1 (first 12 pairs) | 0.075126307 | height 1054.94 | 0.079210 | 0.9484 (every pair before 0.1) |
| heat t = -0.5 (first 12 pairs) | 0.330541741 | height 334.08 | 0.368661 | 0.8966 (every pair before 0.5) |
| DH (function side: 26 pairs below 900; zero ODE: all 8138 pairs below 1e5) | 0.230607362 | height 240.40, beta = 0.8695 | 0.273106 | 0.8444 |

For T-NR and E_a the lowest pair realises Lambda and the ratio to kappa of the family's own strip is 0.96 to 0.99 (it tends to 1 as
a -> 0: `s5` has 1 - 5e-5 at a = 0.02). The grade is sharp there. For DH the strip is wider than the pair that realises Lambda:
kappa_H grows with H as deeper pairs appear (beta - 1/2 up to 0.4371 below 1e5; DH has zeros with Re s > 1 at greater height,
CLASSICAL, so kappa(theta_DH) > 1/2), and those pairs land early.

**By height** (table C1b; per-pair landing tables of `s5`):

| object | Lambda_H/kappa_H at the first and last H | landing/de Bruijn in height bands (median) | largest landing time in the last band |
|---|---|---|---|
| T-NR q = 3 | 0.9615 at every H (first pair) | 0.96, 0.81, 0.72, 0.61, 0.60, 0.54, 0.50, 0.46, 0.43, 0.41 from height 3 to 1.6e4 | 0.196 against 0.3135 |
| E_a, a = 0.3 | 0.988 at every H | 0.99, 0.97, 0.94, 0.91, 0.87, 0.82, 0.78, 0.73, 0.70, 0.66, 0.63, 0.59 from height 14 to 1.6e4 | 0.127 against 0.1778 |
| T-NR q = 1000003 | 0.9688 | 0.969 to 0.954 (depth 0.064 x density) | 0.0020 |
| DH, flow to 1e5 (this lane) | 0.927 (H = 126), 0.844 (258 .. 2217), 0.729 (4542 .. 1.9e4), 0.658 (3.9e4), 0.604 (8e4) | 0.95, 0.94, 0.91, 0.91, 0.90, 0.90, 0.89, 0.88, 0.88, 0.87 from height 86 to 8e4; smallest value in a band 0.29 | 0.191 against 0.2306 at height 240 |

**zeta with planted pairs** (table C1c; landing time over Y^2/2, median over the sites, [min, max] in the tables):

| height | Y x density of zeros | pair added, Y = 0.2 / 0.6 / 1 | pair replacing two zeros (as in DH), Y = 0.2 / 0.6 / 1 | all zeros within 12 spacings at depth Y, Y = 1 | pair added in the largest gap of the sample, Y = 1 | mean-field value, Y = 1 |
|---|---|---|---|---|---|---|
| 1e3 | 0.40 | 0.947 / 0.720 / 0.545 | 0.987 / 0.895 / 0.768 | 0.563 | 0.670 | 0.398 |
| 1e4 | 0.59 | 0.896 / 0.582 / 0.408 | 0.971 / 0.805 / 0.626 | 0.429 | 0.550 | 0.315 |
| 1e5 | 0.77 | 0.821 / 0.472 / 0.321 | 0.954 / 0.724 / 0.525 | 0.359 | 0.461 | 0.263 |
| 1e6 | 0.95 | 0.804 / 0.434 / 0.287 | 0.938 / 0.661 / 0.452 | 0.312 | 0.400 | 0.226 |
| 4e6 | 1.06 | 0.756 / 0.398 / 0.262 | 0.923 / 0.616 / 0.412 | 0.283 | 0.366 | 0.208 |
| 1e7 | 1.14 | 0.695 / 0.355 / 0.239 | 0.912 / 0.582 / 0.378 | 0.266 | 0.330 | 0.198 |
| 4e7 | 1.25 | 0.692 / 0.334 / 0.218 | 0.891 / 0.537 / 0.342 | 0.247 | 0.307 | 0.184 |
| 1e9 | 1.50 | 0.638 / 0.295 / 0.188 | 0.856 / 0.463 / 0.281 | 0.209 | 0.242 | 0.159 |
| 1e12 | 2.05 | 0.496 / 0.221 / 0.142 | 0.773 / 0.349 / 0.200 | 0.163 | 0.181 | 0.123 |

Mean-field value: Y' = -1/Y - 2 pi rho with rho = log(T/2 pi)/(4 pi) zeros per unit z gives T = Y/(2 pi rho) - log(1 + 2 pi rho Y)/(2 pi rho)^2.

Readings.
- The fail condition of the task (a ratio that stays below 1 by a factor growing with height) is met by every object, including zeta with a
  planted pair: at Y = 1 (the edge of the critical strip) the landing time is 0.26 to 0.41 of Y^2/2 at height 4e6, depending on the local
  configuration, 0.14 to 0.20 at height 1e12 (landing time 0.07 to 0.10 for a pair on the edge of the strip), and falls like 1/(Y log T). The cause is the pull of the other zeros on the pair: real zeros, and also off-line zeros below
  it (the "row" column has no real zero within 12 spacings and behaves like the added pair).
- The quantity that fills the gap between kappa and the landing time is the number of zeros near the pair. For zeta, DH and T-NR that
  number is fixed by the archimedean factor (Riemann-von Mangoldt) up to the local fluctuation; it is not a property of the primes that DH
  lacks. DH pairs sit in gaps of the on-line list (they replace two zeros), which is the "hole" column: their ratio 0.87 to 0.95 (band medians) at
  heights to 8e4 with Y around 0.6 matches 0.90 to 0.72 for the hole variant on zeta at the same Y x density (0.24 to 0.46).
- No control fails where zeta passes: the statistic is a function of the zero configuration within a few mean spacings, and zeta with the
  same configuration gives the same number (function side against zero ODE: 9e-5).
- What a bound on Lambda from this would need (ARGUED): for the highest zero of H_t, every other zero pulls it down by at least
  2Y/(dX^2 + 4Y^2) per zero, so a lower bound for the number of zeros (on or off the line) in every window of bounded length at every
  height above the verified range would give Lambda below kappa. With the unconditional count N(T + h) - N(T) and an explicit bound for
  S(T) at height 3e12 this gives about 0.25 for Y = 1 (not better than the existing 0.2), it needs the same count for H_t along the flow,
  and the count is available for DH as well. Every-window counts beyond the S(T) bound are the MV-CAP wall.

Classification: CLOSED. Enters through the zeros only. Height of the pair that realises Lambda: the lowest pair (T-NR, E_a) or a low pair
(DH: 240.40, the fifth). Onset of the "gap": none below the height where Y times the density is of order 1; it is present for zeta with a
planted pair at the same height.

## 5. Combination 2: critical heat time of Jensen polynomials

Nodes: hermite-poulain-shift, poly-de-bruijn-heatop-lean, gorz-jensen-hyperbolicity, heat-family-h-tau.
J^{d,n}(X) = sum_j binom(d, j) gamma(n + j) X^j; heatOp_t = e^{-t D^2} in X; t* is reported as theta* = t*/s^2 with s = gamma(n)/gamma(n+1)
(variable Y = X/s). Monotonicity in t (PROVED, the Lean node): real-rooted at t implies real-rooted at every larger t, so bisection applies.
Hyperbolicity at (d, n) implies it at (d - 1, n) (CLASSICAL), so a certified cell (400, n) covers every d <= 400 at that n.

**Surface, d <= 400** (table C2a, C2b; MEASURED, certified root isolation with ball coefficients):

| object | off-line zeros | cells with t* > 0 | where | n >= 1 |
|---|---|---|---|---|
| zeta | none below 3e12 | 0 of 360 | | all t* = 0 |
| DH | from 85.70, one pair per 17 on-line zeros | 0 of 360 | | all t* = 0 |
| T-NR q = 3 | from 2.86, depth 0.404 | 15 | n = 0, d = 16 .. 400; theta* = 1.75e-4 (d = 16), 2.2e-5 (100), 9.7e-6 (400); 2 non-real roots to d = 100, 4 from d = 128 | all 336 cells t* = 0 |
| T-NR q = 1000003 | from 0.227, depth 0.032 | 15 | n = 0, d = 16 .. 400; theta* = 1.57e-4, 1.92e-5, 8.6e-6 | all t* = 0 |
| zeta with the first pair of T-NR q = 3 planted | one pair | 15 | n = 0, d = 16 .. 400; theta* = 1.34e-4, 1.51e-5, 1.04e-6 | all t* = 0 |
| zeta with the first pair of T-NR q = 1000003 planted | one pair | 15 | n = 0, d = 16 .. 400; theta* = 1.17e-4, 1.26e-5, 8.7e-7 | all t* = 0 |
| E_a, a = 0.45 | every zero, depth 0.45 | 3 | n = 0, d = 256, 320, 400; theta* = 6.0e-8, 3.3e-7, 3.7e-7 | all t* = 0 |
| zeta, DH (corrected 10000-bit tables); L(chi_-4), L(chi_5), heat -0.1, heat -0.5; zeta with the DH zero at 85.70 added | | 0 of 51 each (d = 8, 100, 400; n = 0 .. 10000) | | all t* = 0 |
| zeta with either T-NR pair planted, n to 10000 | | 2 of 51 each | n = 0, d = 100, 400 | all t* = 0 |
| T-NR q = 3, q = 1000003; E_a a = 0.3, 0.45 at n = 5000, 10000 | | 0 of 6 each | | all t* = 0 |

L(chi_-4), L(chi_5), heat t = -0.1, -0.5 and E_a at a = 0.3 are covered for d <= 400 by the cone bound of `jensen-hyperbolicity`
Theorem A (PROVED there): the smallest cone value is 555 (E_a, a = 0.3), 5.3e4 (heat -0.5), 9.3e7 (heat -0.1). They were also run (table above).

**Beyond d = 400: the degree at which a pair appears** (table C2c; MEASURED, Newton at 900 bits or more beyond the cancellation):

| object | off-line zero (height, beta - 1/2) | cone bound D0 | d_pair(n = 0): J^{d,0} has a non-real root for d >= | d_pair/D0 | n = 1, n = 2 |
|---|---|---|---|---|---|
| DH | 85.699, 0.3085 | 19,291 | 20,786 | 1.078 | zero of F' real |
| DH | 240.405, 0.3695 | 105,810 | 125,280 | 1.184 | zero of F' real |
| DH | 114.163, 0.1508 | 143,225 | 146,366 | 1.022 | zero of F' real |
| DH, 35 pairs to height 1155 | | | smallest 20,786 (first pair); ratio to D0: 1.001 to 1.285, median 1.085 | | zero of F' real for all 35 |
| zeta with the DH zero at 85.699 added | | 19,291 | 22,117 | 1.147 | real |
| zeta with the DH zero at 85.699 replacing the zeros 84.735 and 87.425 | | 19,291 | 19,984 | 1.036 | real |
| T-NR q = 3, pairs 1 and 2 | 2.860 and 8.579, 0.4038 | 13.05, 113 | 14, 118 | 1.073, 1.041 | real |
| T-NR q = 1000003, pairs 1 and 2 | 0.2274 and 0.6822, 0.0321 | 13.05, 113 | 14, 117 | 1.073, 1.032 | real |
| zeta with the first T-NR pair planted | 2.860, 0.4038 | 13.04 | 14 | 1.073 | real |
| E_a, a = 0.3; a = 0.45 | 14.135 | 555; 247 | 558; 250 | 1.005; 1.012 | real |

The 49 DH pairs above height 1190 are not resolved by the 10000-bit table (its error balls, section 3, exceed the tolerance after 5000
bits of cancellation); their cone bounds are above 1.8e6, so they do not change the smallest value.

Readings.
- Premise on zeta: t* = 0 in every cell reached (d <= 400 covers d <= 8; n to 2000 on the 24-degree grid, n to 10000 at d = 8, 100, 400). This is contained in the known range
  d <= 9.0e24 (OBSTRUCTION_MAP P17) and adds nothing.
- DH has t*(d, n) = 0 on the whole surface d <= 400 and first fails at d = 20,786, n = 0. The same test on zeta with that zero planted
  fails from d = 19,984 (zero replacing two zeros) or 22,117 (zero added): DH lies between the two. The series for J^{20786,0} near the
  root has its largest term at 2^198 and needs about 540 terms for full precision, so the Taylor coefficients in play resolve the zero at
  85.7 to 38 digits (section 3). The fail condition (a control failing before its zero is resolved) does not occur: the onset is the cone
  angle of the first off-line zero, d ~ (height/(2 x depth))^2 x (1.00 to 1.29).
- T-NR fails at d = 14 with 15 coefficients. Its first off-line zero is at height 2.86 (or 0.227), inside the disc where 15 coefficients
  already give the function; zeta with that zero planted fails at the same d.
- In the direction of n the test loses the controls: for every tracked pair (DH 35, T-NR, E_a) the zero of F' = dF/dX continued from the
  off-line zero is real, so the cells with n >= 1 are passed by T-NR (off-line zeros every 0.455 from height 0.227), by E_a at a = 0.45
  (no zero on the line) and by DH. The rule of `jensen-hyperbolicity` section 4 (one derivative lowers the depth by about one mean spacing
  over pi) accounts for it: all these depths are below spacing/pi at the heights reached. A pass of the n >= 1 surface is therefore no
  evidence about zeros on the line.

Classification: CLOSED. Enters through the Taylor coefficients, that is through all zeros at once; every positive t* is located at the cone
angle of an identified off-line zero and is reproduced by zeta with that zero planted.

## 6. Combination 3: twistor heat compatibility and the Burgers identity

Nodes: twistor-heat-compat, burgers-heat-identity-lean, zero-ode-ht, mem-gaussian-conv-negative-time.

**Dependence on the object** (read from the Lean sources, `formalization/lean-aristotle/permutation-calculus/twistor_heat_compat/` and
`burgers_heat_identity/`). `heat_compat_on_range`: K is any commutative ring, the four spaces are arbitrary K-modules, and R, F_+, F_-, I_K,
hat-A_+, hat-A_-, A_+, A_- are universally quantified linear maps; the conclusion follows from the three intertwining hypotheses by a
five-step diagram chase. None of R, A_+-, F_+- is defined from an L-function. `burgers_identity`: for any family of real polynomials of
bounded degree with d_s P = d_z^2 P, M = -P'/P satisfies d_s M = d_z^2 M - 2 M d_z M. The object enters only through the choice of P (or H);
both statements hold for every control. In de Bruijn time (d_t H = -H_zz): d_t M = 2 M M' - M''.

**Finite test** (table C3; z = x0 - i c, Re s = 1/2 + c/2 = 1.1 and 1.5; M_0 has size 0.1 to 3 on these lines).

| object | abs(M_0 prime - direct), c = 1.2 / c = 2, P = 1e9 | abs(M_-0.1 prime - direct), c = 1.2 | t = +0.1: part of M from the strip, c = 1.2 / c = 2 | prime side against the same truncated integral |
|---|---|---|---|---|
| zeta, x0 = 1e2, 1e3, 1e4, 1e5 | 3.8e-6, 4.0e-6, 5.7e-6, 7.5e-6 / 6.6e-10, 7.8e-10, 1.1e-9, 1.7e-9 | 1.4e-10, 6.0e-10, 3.3e-9, 1.2e-8 | 0.91, 0.65, 0.43, 0.40 / 0.040, 0.023, 0.0091, 0.0061 | 4.5e-7 to 6.4e-7 |
| zeta, x0 = 1e6, 1e7, 1e8 | 2.9e-6, 5.8e-6, 1.9e-6 / 1.3e-10, 7.1e-10, 1.6e-10 (server, long double logs) | 3.3e-9, 1.4e-8, 2.5e-8 | 0.38, 0.26, 0.14 / 0.0042, 0.0021, 0.00069 | |
| Liouville twist zeta(2s)/zeta(s), x0 = 1e2 .. 1e4 | 3.8e-6 to 5.7e-6 / 6.5e-10 to 1.1e-9 | 7.1e-11 to 1.9e-9 | 1.14, 0.85, 0.59 (as a formal integral; the function is not entire) | 4.7e-7 to 5.8e-7 |
| T-NR q = 1000003, x0 = 1e2, 1e3 | 4.2e-6, 4.9e-6 / 6.6e-10, 7.8e-10 | 1.4e-10, 6.0e-10 | 5.1, 3.1 | 5.1e-7, 5.6e-7 |
| T-NR q = 3, x0 = 1e2 .. 1e5 | 6.6e-3, 3.0e-2, 7.9e-3, 4.5e-2 / 1.8e-6 to 4.5e-6 | 4.2e-7 to 6.3e-4 | 1.08, 0.44, 0.52, 0.087 | 8.2e-4 to 2.9e-3 |
| E_a, a = 0.02, x0 = 1e2, 1e3 | 8.3e-6, 8.8e-6 | 1.3e-9, 1.3e-8 | - | - |
| L(chi_-4), L(chi_5), x0 = 1e2 .. 1e4 (P = 1e8) | 2.4e-6 to 1.9e-5 / 2.8e-9 to 1.0e-8 | 8.3e-9 to 5.0e-8 | 0.38 to 1.05 / 0.0072 to 0.046 | 2.2e-7 to 2.3e-6 |
| DH from its two Euler products (P = 1e8) | 8.3e-6, 1.3e-5, 1.8e-5 / 4.8e-9, 6.2e-9, 7.2e-9 | 1.1e-8, 2.6e-8, 6.1e-8 | 0.63, 0.58, 0.56 / 0.023, 0.015, 0.0096 | 9.4e-7 to 1.7e-6 |
| L(chi_-4), L(chi_5), x0 = 1e2 .. 1e4 (P = 1e9) | 5.1e-7 to 2.4e-6 / 2.1e-10 to 3.7e-10 | 2.9e-11 to 2.4e-9 | as above | 5.9e-8 to 2.5e-7 |
| DH from its two Euler products (P = 1e9) | 2.2e-6, 2.9e-6, 4.0e-7 / 6.9e-10, 7.7e-10, 9.7e-11 | 5.1e-10, 1.4e-9, 3.8e-10 | as above | 4.0e-8 to 3.0e-7 |

Zeta at P = 1e8 for comparison: 1.2e-5 to 2.6e-5 on c = 1.2, so the difference falls like P^(1/2 - sigma) times a slowly varying factor
(the truncated explicit formula; the pole term P^(1-s)/(s-1) is included on the prime side).

- t = 0 and t = -0.1: the prime side agrees with direct evaluation for zeta, the two L-functions, DH, the Liouville twist, E_a and T-NR
  at q = 1000003, with the same size of difference. T-NR at q = 3 differs by 7e-3 to 4.5e-2 on Re s = 1.1 with all powers 3^j <= 1e9:
  its series in 3^(-js) has ratio alpha 3^(1/2 - sigma) = 0.81 on that line because its zeros sit at Re s = 0.904. This is slower
  convergence at the rate set by the real part of the off-line zeros, on a line to the right of 1: the second half of the known pattern.
- DH with its own coefficients c(n) of -F'/F (not supported on prime powers; max abs c(n) per decade 5.9, 18.5, 75, 349, 2098, 13984 up
  to n = 1e7): the partial sums differ from the direct value by 4.4e-4, 3.7e-4, 4.2e-3 at t = 50, 500, 5000 on Re s = 1.1 (L(chi_-4):
  9.0e-5, 5.6e-5, 8.1e-5) and by 6e-7 to 5e-6 on Re s = 1.5 (1.0e-7 to 1.2e-7).
- t = +0.1: e^{-t d^2} H_0(z) = int H_0(z + i v) G(v) dv crosses the strip. From prime powers only the part with Re s >= 1.02 is available;
  it agrees with the same truncated integral of the direct values (5e-7), and the part inside the strip carries 0.14 to 0.91 of M on line
  1.2 and 7e-4 to 4e-2 on line 2, for every object alike. The termwise series diverges for t > 0 (factor n^(t log n/4)); the continuation
  comes from the theta kernel, not from the primes.
- Burgers defect at t = -0.1 on the prime side: 5e-6 to 2e-5 of d_t M (finite difference in t with step 0.004), for every object and both
  lines, except where the line passes near a zero of H_{-0.1} (T-NR q = 3 at x0 = 1e5, line 1.2: M is of size 700). The identity holds for
  the Gaussian convolution of any function.

Classification: CLOSED, target-blind. Enters through the coefficients on Re s > 1 only; no finite consequence of the two Lean statements
distinguishes an object.

## 7. Combination 4: backward leaving rate

Nodes: debruijn-family-dyson-ode, debruijn-jet-lemma-no-liftoff, winding-monotone-backward-heat, winding-monotone-under-heat,
mem-winding-monotone-classical. D(tau, T) >= 0 and is twice the number of pairs that have collided by backward time tau (PROVED in the
nodes). tau is in unfolded units: t = 16 pi^2 tau/log^2(T/2 pi) in de Bruijn time.

**Prediction.** An adjacent pair of unfolded gap g with environment sum B = sum_j 1/((a - x_j)(b - x_j)) obeys (g^2)' = -8 + 4 B g^2 and
collides at tau_c = (g^2/8)(1 + g^2 B/4 + ..). Per zero, D/N = 2 P2(s_eff), s_eff = sqrt(8 tau)(1 - tau Bbar), with
P2(s) = int_0^s r2 the pair term (Bogomolny-Keating / Conrey-Snaith two-point function, prime products to 1e6, `rmt.py` of `s1`/`s3`) and
Bbar = int rho_c(r)/r^2 dr = 2.6319 the triple term, rho_c(r) = 1 - S(r)^2 - 3 S'(r)^2/pi^2 the sine-kernel density of the other points
given a coincident pair (PROVED: limit of R_3/R_2). The measured mean of B over close pairs is 2.38 (zeta, heights 7.5e4 to 5e6),
2.27 (L mod 5); using it would raise the prediction at tau = 1e-2 by 0.8 %. The prediction is HEURISTIC.

**zeta** (table C4a, C4b; MEASURED, float64):

| T | zeros | tau = 1e-2: D, D/prediction | tau = 1e-3 | tau = 1e-4 | D/GUE at tau = 1e-2 |
|---|---|---|---|---|---|
| 1e4 .. 2e4 | 11,776 | 399, 1.070 +- 0.076 | 8, 0.64 +- 0.32 | 0 | 0.714 |
| 1e5 .. 2e5 | 150,726 | 5558, 1.022 +- 0.019 | 194, 1.03 +- 0.10 | 2 | 0.780 |
| 1e6 .. 2e6 | 1,901,033 | 73,114, 1.0096 +- 0.0053 | 2290, 0.900 +- 0.027 | 66, 0.81 +- 0.14 | 0.824 |
| 1e7 | 4,000,214 | 157,680, 1.0018 +- 0.0036 | 5548, 0.997 +- 0.019 | 188, 1.06 +- 0.11 | 0.846 |
| 1e8 | 2,000,011 | 81,332, 1.0094 +- 0.0050 | 2798, 0.978 +- 0.026 | 88, 0.96 +- 0.14 | 0.872 |
| 1e9 | 1,000,007 | 41,166, 1.0054 +- 0.0070 | 1410, 0.967 +- 0.036 | 44, 0.94 +- 0.20 | 0.883 |
| 1e10 | 400,004 | 16,956, 1.024 +- 0.011 | 622, 1.05 +- 0.06 | 16, 0.85 +- 0.30 | 0.909 |
| first 1.0e7 zeros (list, pair criterion) | 9,999,291 | 385,752, 1.0097 +- 0.0023 | 13,292, 0.989 +- 0.012 | 420, 0.978 +- 0.068; tau = 1e-5: 20, 1.47 +- 0.46 | 0.828 |
| first 1.0e8 zeros (list, heights 7.5e4 .. 4.27e7) | 100,115,548 | 3,989,774, 1.0086 +- 0.0007 | 139,392, 0.9955 +- 0.0038 | 4436, 0.990 +- 0.021; tau = 1e-5: 126, 0.89 +- 0.11; tau = 1e-6: 4, 0.85 +- 0.60 | 0.855 |
| window at 1e9 (list) | 1,019,907 | 42,132, 1.0089 +- 0.0070 | 1442, 0.970 +- 0.036 | 44, 0.92 +- 0.20 | 0.886 |
| window at 1e12 (list) | 999,904 | 42,314, 1.0080 +- 0.0069 | 1454, 0.969 +- 0.036 | 48, 1.00 +- 0.20 | 0.908 |

On the first 1.0e8 zeros the ratio at tau = 1e-2 is 1.0086 +- 0.0007, outside the counting error: this resolves the approximation of the
triple term. With the measured mean of B (2.424) and the exact pair formula g^2 = (2/B)(1 - e^{-4 B tau}) the prediction is 0.77 % larger
and the ratio is 1.0009 +- 0.0007 (1.0007 +- 0.0023 on the first 1.0e7 zeros with B = 2.380). At 1e10 the ratio is 2.1 standard errors
above 1 in both samples (the server sample of 150,004 zeros is contained in the Mac sample).
The low value 0.900 at tau = 1e-3 on [1e6, 2e6] is two adjacent chunks of the list (0.925 and 0.876 on 9.8e5 .. 1.7e6); the dispersion
over all 49 chunks equals the Poisson value. With the pair term alone the ratio at tau = 1e-2 is 0.927 to 0.934 at 1e7 to 1e9; with GUE
0.846 to 0.883. Premise: holds at every size, to the accuracy of the triple term (0.9 % at tau = 1e-2, below the counting error at smaller tau).

**Controls** (pair criterion on stored on-line lists; prediction with conductor 5 where applicable):

| list | zeros | tau = 1e-6 | 1e-5 | 1e-4 | 1e-3 | 1e-2 |
|---|---|---|---|---|---|---|
| L(chi) mod 5 | 945,479 | - | - | 0.85 +- 0.21 | 0.986 +- 0.041 | 1.0145 +- 0.0077 |
| L(chibar) mod 5 | 945,479 | - | - | 0.64 +- 0.18 | 1.013 +- 0.041 | 1.0121 +- 0.0077 |
| DH on-line | 846,753 | 115 +- 81 (D = 4) | 28 +- 7 | 5.56 +- 0.57 | 2.10 +- 0.06 | 0.771 +- 0.007 |
| alt on-line (Z_chi - Z_chibar) | 698,151 | - | 13.6 +- 5.5 | 4.58 +- 0.57 | 1.76 +- 0.06 | 0.669 +- 0.007 |
| heat list tau0 = -1e-4 (as an object) | 1,001,374 | - | 7.1 +- 3.2 | 2.11 +- 0.31 | 1.129 +- 0.040 | 1.018 +- 0.007 |
| heat list tau0 = -1e-2 | 961,876 | 134 +- 77 | 47 +- 8 | 12.3 +- 0.8 | 4.12 +- 0.08 | 1.596 +- 0.009 |

T-NR (direct count of the real zeros of its own H_{-tau}, zeta on the same blocks in brackets):

| object, T | zeros | tau = 1e-3 | 3e-3 | 1e-2 | depth of the pairs in mean spacings; depth^2/2 |
|---|---|---|---|---|---|
| q = 1000003, 1e4 | 11,776 | 12 (8) | 94 (75) | 482 (399): 1.29 +- 0.08 | 0.038; 7e-4 |
| q = 1000003, 1e5 | 150,726 | 192 (194) | 1232 (964): 1.28 +- 0.05 | 7164 (5558): 1.318 +- 0.022 | 0.049; 1.2e-3 |
| q = 1000003, 1e6 | 400,292 | 550 (494) | 3090 (2586): 1.14 +- 0.03 | 20,276 (15,364): 1.337 +- 0.013 | 0.061; 1.9e-3 |
| q = 1000003, 1e7 | 200,015 (server) | 282 (276) | 1588 (1408): 1.127 +- 0.040 | 10,108 (7900): 1.286 +- 0.018 | 0.073; 2.7e-3 |
| q = 3, 1e5 | 150,726 | 194 (194) | 970 (964) | 5578 (5558): 1.026 +- 0.019 | 0.62; 0.19 |

Readings.
- zeta and the two L-functions pass. The prediction uses all primes together through the two-point function.
- T-NR at q = 3 passes at every tau reached, with off-line zeros from height 2.86 at depth 0.40: its 5578 lost zeros against 5558 for
  zeta is inside the counting error. T-NR at q = 1000003 equals zeta at tau = 1e-3 (192 against 194 at 1e5) and loses 27 to 34 % more
  zeros at tau = 1e-2. The onset moves with height as depth^2/2 in unfolded units (the unfolded landing time of its pairs, Lambda/Dz^2):
  the backward flow by tau reaches off-line zeros within about sqrt(2 tau) mean spacings of the line and no others.
- DH, alt and the heat lists leave 1 at the smallest tau, by factors up to 100: their on-line lists have the quadratic small-gap law of
  lists that have lost zeros (`s1`, `s5`). The counts behind the first columns are 4 to 30 pairs in 8.5e5 zeros; the list contains about
  1e5 off-line zeros at that size, and the window needed to see 10 excess pairs at tau = 1e-4 holds about 5000 of them.
- E_a has no real zero: D = 0 against a positive prediction. Unimodular twist: translate. Sign twist: no line.

Classification: CLOSED. The zero side is the full zero configuration of the window (the ODE is exact), the failure of each control is the
presence of its off-line zeros within sqrt(2 tau) spacings (T-NR) or the small-gap law of a list that has lost zeros (DH, heat), at window
sizes holding thousands of off-line zeros. One control (T-NR, q = 3) passes.

## 8. Control onsets against the heights of the off-line zeros

| control | first off-line zero | combination 1 | combination 2 | combination 3 | combination 4 |
|---|---|---|---|---|---|
| DH | 85.70 | ratio 0.84 to 0.93 at its low pairs; gap to kappa from deeper pairs at larger height | none for d <= 400; d = 20,786 at n = 0 = cone angle of the zero at 85.70; none at n >= 1 (35 pairs) | none (two Euler products); own coefficients: slower by 5 to 50 | every tau, at list sizes with about 5000 or more off-line zeros |
| heat t < 0 | 415.3 (t = -0.1), 111.7 (t = -0.5) | every pair before abs(t) | none for d <= 400 (cone bound 9.3e7, 5.3e4) | is the t = -0.1 object | every tau (list tau0 = -1e-2); tau <= 1e-3 (tau0 = -1e-4) |
| zeta(s+a)zeta(s-a) | 14.13 (every zero) | ratio 0.99 at the first pair, 0.59 at 1.6e4 | n = 0, d >= 250 (a = 0.45), 558 (a = 0.3); none at n >= 1 | none | no real zero |
| T-NR q = 3 | 2.86 | 0.96 at the first pair, 0.41 at 1.6e4 | n = 0, d >= 14; none at n >= 1 | 7e-3 to 4.5e-2 on Re s = 1.1 at every height (zeros at Re s = 0.904) | none (passes) |
| T-NR q = 1000003 | 0.227 | 0.969 to 0.954 | n = 0, d >= 14; none at n >= 1 | none for P >= q | tau >= about depth^2/2 (1e-3 to 3e-3) |
| sign twist | no line | not formulable | not entire | none for t <= 0; t > 0 not defined | no line |
| unimodular twist | none (translate) | as zeta | as zeta in the variable w | as zeta at x + alpha | as zeta |

No control fails at a size much smaller than the height of its off-line zeros would explain. The failures are located at the cone angle of
an identified zero (2), at the real part of the off-line zeros through the convergence rate to the right of 1 (3), or in windows that
contain the off-line zeros (4). Two tests are passed by a control with off-line zeros at every height (2 with n >= 1; 4 for T-NR q = 3).

## 9. Three weakest steps

1. The Taylor tables. The first version of the kernel cut truncated the high moments (section 3); the repair is an error ball derived
   from the size of the cut tail and checked against a corrected 4000-bit table and a corrected 10000-bit table for zeta and DH (0 of 34,705 values outside their balls). "3000 digits" is not reached above
   k of about 300 in the 10000-bit table (699 digits at k = 10450). The trapezoid error is not enclosed; it is far below the cut error
   (two steps agree to every bit at 1500 bits). The d_pair values and the landing times are Newton limits, not enclosures.
2. The prediction of combination 4 is heuristic: the two-point function of Bogomolny-Keating with prime products cut at 1e6, a first-order
   pair equation with B replaced by its sine-kernel mean (the measured mean is 10 % smaller), no arithmetic correction in the triple
   term. The direct count is a Riemann-Siegel model sum (C0..C2) with the heat factor, not the integral defining H_t; for T-NR the
   amplitude ratio A(w - i d)/A(w) is replaced by e^{i pi d/4}. It was checked against exact quadrature on one block of 141 zeros.
3. Combination 1 at height uses planted pairs with the zeros outside the window replaced by a constant density, at 20 to 40 sites per
   height, in float64. DH above 5e4 rests on the list of `s3-heat-zero-velocity-channels` (not certified complete); the flow to 1e5 agrees with the flow to 5e4 of `s5` to 1.0e-8 on the 1646 pairs below 25,000. The L-function
   rows of combination 1 rest on the construction, not on a run. The function-side landing times stop at height 1267 (cost grows like
   height^2.5); above it the landing times are float64 ODE values. The direct counts of combination 4 used 4.0e5 to 4.0e6 zeros per T,
   not 1e7 (the lists supply 1.0e8 zeros below 4.27e7 and 1.0e6 at 1e9 and at 1e12).

## 10. Files

Code (this directory): `mom.py` (moment tables), `jl.py` (series of each object, Jensen polynomials, heat operator, certified real-root
count), `val_mom.py`, `val_v2.py`, `val_fprime.py`, `val_plant.py`, `val_tnr_heat.py`, `val_tnr_model.py` (checks); `c1_arbland.py`,
`c1_plant.py`, `c1_grade.py`, `c1_flow.py`, `hl.py`, `kern.c`, `kern2.c`, `build.sh` (the last five copied from `s5`); `c2_surface.py`,
`c2_track.py`; `c3.py`, `c3_dhser.py`, `psum.c`, `build3.sh`; `c4_count.py`, `c4_lists.py`, `c4_chunks.py`, `c4lib.py`, `rmt.py` (from
`s3`), `zgen/` (sampler of `s1`); `mk_tables.py`, `summ2.py`, `summ3.py`, `summ4.py`; run scripts `run_*.sh`.
Outputs: `out/` (Mac), `out_server/` (server), `out/tables.md` (all tables C1a .. C4b generated from the json files).
Data: `data/dh_pairs_2000.json`, `data/heat_pairs_*.json` (from `c12-control-battery-harness`), `data/mom_local.pkl`,
`data/mom_local_v2.pkl`, `data/mom_main.pkl` (343 MB, copy of the server table), `data/mom_v2.pkl` (corrected tables for zeta and DH); the
`.pkl`, `.so` and `.o` files are listed in `.gitignore`. `surf_dlist.txt` (degrees used by `c2_surface.py` when present: 8, 100, 400) and
`arbland_maxg.txt` (height cap of `c1_arbland.py`: 900) are run-time switches left in place. Server copy: `~/rh-push/s6-flow-grade-kappa-landing-heatop/`.
