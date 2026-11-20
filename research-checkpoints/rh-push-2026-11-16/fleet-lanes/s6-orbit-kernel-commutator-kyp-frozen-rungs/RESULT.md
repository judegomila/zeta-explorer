# s6-orbit-kernel-commutator-kyp-frozen-rungs: RESULT

Date 2026-11-20. Kind: screening (compute). Four combinations screened. **Survivors: 0.**
Labels: PROVED (short argument here) / CLASSICAL / MEASURED ("ball": the sign or value is that of a python-flint ball; rounding is enclosed, quadrature truncation and the heat-kernel window are not; "float64" where stated) / NOT RUN.
No statement about the zeros of zeta is made. No bound moves.

## 0. Verdict

| # | combination (nodes) | statistic | sizes reached | zeta | comparison L-functions | controls | classification |
|---|---|---|---|---|---|---|---|
| 1a | orbit-pair-kernel + xi-centered-x | inertia of M_nm = int_0^inf kappa_nm phi_n phi_m dh; sign of A_N(a) = sum a(n) a(m) M_nm | ball inertia to N = 400 (12,000 bits, smallest pivot 10^-295.5); float64 spectrum at N = 2,000, 5,000, 10,000 (server CPU) and 20,000 (Mac CPU); A_N for 9 coefficient sequences and 6,000 random ones | inertia (N-1, 0, 1) for every N >= 2 (PROVED given one ball sign); A = 13.05554930257 > 0 | chi_-4 13.1753208, chi_5 13.2951288, chi_-3 13.2951285: > 0 | DH 13.1412924, Liouville 13.2951288, unimodular twist 13.0831922 (t = 1), first term alone 13.1753205: all > 0; 6,000 of 6,000 random coefficient sequences > 0. Own completed kernels of DH, E_a, T-NR, heat: A = int_R Phi'^2 > 0 (PROVED) | CLOSED by proof. The matrix contains no coefficient; its inertia is the same for every object. The quadratic form is 2 int psi'^2 + psi(0) psi'(0): positive for every even kernel and for every real sequence with a(1) = 1, abs(a(n)) <= 1. Enters through the first coefficients, not through zeros or primes |
| 1b | silent-u8-kernel-conditions-beyond-searched-range | signs of translation minors det[Phi(x_i - y_j)] and Hankel minors det[Phi(u0 + (i+j)h)], orders 3..10, three node ranges (bulk, near-confluent, far: differences up to 10) | 10,152,000 minors, 13,500 per cell, 16 kernels, 1,536-bit balls, 0 undecided | one-signed (0 of 13,500 opposite) in: translation bulk and far, orders 3..10; near-confluent orders 3, 4; Hankel orders 3, 4 in all three ranges | chi_-4 has opposite signs already at order 3 in every range except translation far; chi_5 from order 4 or 6; chi_-3 from order 4 or 7 | E_a passes every cell where zeta is one-signed (Lemma E of map row P55, here measured); heat tau = -0.5, -2: 0 or 1 opposite sign in those cells; DH fails rarely (1 to 14 of 13,500 in the far range, orders 6..10); T-NR fails in the far range for q = 1000003 and everywhere for q = 3, at the same rate for c = 1.9 (all zeros on the line) and c = 2.2 | CLOSED. No cell is shared by zeta and both L-functions and broken by DH, E_a and T-NR. The only cell shared by zeta, chi_-4, chi_5 and chi_-3 (translation minors, far nodes, orders 3..9) is passed by E_a and heat; T-NR fails it through the separation log q of its three bumps, with or without off-line zeros |
| 2 | commutator-diagonal-split + shear-gram-hollow-antisymmetric + silent-u6d | rho = norm(K - D)_F / norm(D)_F, K = de Branges kernel of E = Xi(. + ia)/2 on real frequency nodes, D = diagonal channel | n to 500 (zeta, 2,200-bit balls), 200 (other objects, 1,200 bits), 2,000 (log-prime-power nodes, float64); a = 0.05, 0.5, 2; 10 objects; 4 to 6 node sets each | own ordinates: rho = 1 - 1.6e-8 (n = 500); K_nn/d(0) = 10^-540 at n = 500. Log prime powers: rho = 0.650, 0.688, 0.740, 0.777, 0.805, 0.830 at n = 10, 50, 200, 500, 1,000, 2,000 | chi_-4, chi_5 own ordinates: 1 - 1.0e-5, 1 - 1.8e-6 (n = 200); log prime powers 0.767, 0.775 | DH own ordinates 1 - 2.5e-5; heat 1 - 5e-8; T-NR and E_b 1 to the 8 digits printed (tr K/tr D = 1e-9, 2e-13); log-prime-power nodes: DH 0.788, T-NR 0.757 (c = 2.2) and 0.757 (c = 1.9), heat 0.740, 0.742, Liouville 0.745 | CLOSED. D is a positive-definite function of the frequency difference built from the measure Phi^2 du alone (PROVED); K decays like exp(-pi w/4), so the remainder is -D to 10^-540 at height. An arithmetic-free node set with the counting function of the prime powers gives 0.7732 against 0.7773 (n = 500), 0.8288 against 0.8305 (n = 2,000): the statistic follows the node density, not the arithmetic of the nodes |
| 3 | cdb-exist + mem-t3-equals-strip + mem-v52-unaudited-kyp + entropy-rate-balance | number of poles of the Loewner-pencil realisation of Theta_a on the wrong side (= negative index of the storage matrix, CLASSICAL); first negative leading minor of the boundary Pick matrix | realisations of order 6..300 at 2,000 to 4,000 bits; windows [5, 60], [5, 237], [60, 100], [5, 100], [0.05, 5] and the stated 4,000 samples on [2.5, 10^4]; Pick matrices to 300 nodes (6,500 bits); a = 0.02, 0.1, 0.25, 0.4; 10 objects | stated sampling: 17..24 of 50, 46..56 of 100, 101..102 of 200, 142..147 of 300 poles on the wrong side, fit error O(1): the premise fails. Resolved windows: 0 wrong-side poles once r >= 16 (13 zeros in window) or 128 (100 zeros); 2..6 and 13..41 below that. Pick: positive to 300 nodes at every a | chi_-4, chi_5: same (0 wrong-side poles from r = 32 on [5, 60]; 47..49 of 100 on the stated sampling); Pick positive to 200 and 300 nodes | resolved windows: the count of wrong-side poles equals the count of zeros right of 1/2 + a in the window: E_b = 0.3: 13 of 13; DH: 1 (ordinate 85.70) from r = 32 on [60, 100], 64 on [5, 100]; heat tau = -2: 1 (pair at 49.72) for a = 0.1, 0 for a = 0.25; T-NR(1000003, 2.2): 13, its on-line member c = 1.9: 0; Liouville: 14..19, no convergence; unimodular twist: 0 (passes). Pick from height 0: DH 76 (spacing 1), 86..92 (spacing 2); heat tau = -0.5: 79, tau = -2: 28; E_b: 6; T-NR: 0.2 | CLOSED. Verified height in another form: a realisation is on the right side only when its order exceeds the count of zeros in the sampled window by a factor about 1.2, for zeta as for every control; below that order zeta itself is indefinite. The realised decay rate is the shift a (all in-window poles at distance a to 1 %), unrelated to R = 2 min(sigma, 1 - sigma) |
| 4 | frozen-rung-pt-equivalence + zr-zero-repulsion + rz-pen-symbol-pencil-floor | (ZR) as written in the Lean source; least mesh density h* at which the Schur-kernel Gram matrix of zeta with a planted quadruple at 1/2 +- delta +- ig is indefinite; N* = g/h* against N(g) | (ZR) premise: 36,000 nodes to height 4.27e7 (192 bits); detection: g = 10^2..10^5, delta = 0.4..10^-3, three mesh lines, 32 nodes, 768 bits (130 cases), fine ladder with 16, 32, 64 nodes at 1,024 bits; confined windows to 160 nodes and 14,000 bits | (ZR) false at every node (max log abs Theta = -1.8e-5), as it must be without a zero right of 1/2 + a. Planted pair: h* x (zero density) = 0.707 or 0.841 on the coarse ladder (step 2^{1/4}) for every delta and g, between 0.85 and 1.00 with 64 nodes; N*/N(g) = 1.33..2.15, not below 1 in any of the 84 cases | chi_-4, chi_5 with a planted pair: h* x (own zero density) = 0.66..0.90 | arithmetic-free twin (zeta's ordinates within the window moved to the smooth ordinates): the same h* in 13 of 14 cases, one ladder step larger in one. DH's own off-line zero: h* x (own density) = 0.96 (zeta with the same pair planted: 0.84). E_b, T-NR, Liouville (a displaced zero at every ordinate): (ZR) holds on the coarsest mesh tried. Unimodular twist: Schur, never detected | CLOSED. The mesh must carry about as many nodes as there are zeros in its window (nodes minus zeros: -1 to 4 at delta = 0.2, 8 to 10 at delta = 10^-3): the frozen-rung certificate costs one evaluation per zero, which is the counting form of the Platt-Trudgian equivalence. Nodes confined below the pole also detect it, with 3 to 6 times N(g) nodes and 57 to 230 digits |

Known pattern to beat: not beaten. Combinations 1 and 2 do not read zeros at all (first coefficients, the measure Phi^2 du, node density). Combinations 3 and 4 read zeros through values of the completed function and separate a control exactly when the number of evaluations exceeds the number of its zeros up to the off-line one; the same holds for a pair planted in zeta, in an L-function, and in a copy of zeta whose nearby ordinates were replaced by arithmetic-free ones. No statistic of the batch uses primes.

Batch rule ("a statistic counts only if it changes when the node set or the coefficients are replaced by arithmetic-free ones"): 1a does not change in sign (6,000 random sequences); 1b changes with the coefficients, in both directions inside the Euler-product class; 2 changes by 0.2 to 0.5 % under the replacement of log prime powers by nodes with the same counting function; 4 does not change (twin: 13 of 14 cases identical). None counts.

## 1. Objects, code, validation, compute

Coordinates. s = 1/2 + z. Lambda_F: completed object. Theta_{F,a}(z) = Lambda_F(1/2 + z - a)/Lambda_F(1/2 + z + a) (the bridge R_a of `src/data/frozen-rung-pt-equivalence-2026-07-31.js`). A zero at s = 1/2 + delta + ig is a pole of Theta at z = (delta - a) + ig, in Re z > 0 iff delta > a. Kernel convention of `slib.py` (copied from `s5-volterra-shear-phi-kernel-norms`): x = e^{4u}, Xi_F(w) = int Phi_F(u) e^{iwu} du, so w = -2iz; for zeta Xi(w) = xi(1/2 + iw/2)/4 (checked).

| key | object | role |
|---|---|---|
| zeta | xi(s) | target |
| chi-4, chi5 (chi-3 in 1) | (q/pi)^{(s+k)/2} Gamma((s+k)/2) L(s, chi) | positive comparison |
| E_b | xi(s + b) xi(s - b) | control: every zero at distance b from the line |
| NR(q, c) | xi(s)(q^{s-1/2} + q^{1/2-s} + c), q = 1000003 | control for c = 2.2 (zeros at Re s = 1/2 +- 0.03211, heights 0.2274 (2k+1)); c = 1.9 is the member with all zeros on the line |
| DH | Davenport-Heilbronn, conductor 5, odd | control: zero at 0.808517 + 85.699348 i |
| heat tau | kernel e^{tau u^2} Phi, tau = -0.5, -2 (quadrature on [0, 1.5]) | control: first off-line pairs at heights 111.69 and 49.72 (values of the earlier lanes) |
| liou | zeta(2s)/zeta(s) (1b, 2: kernel 4 e^u sum lambda(n) exp(-pi n^2 e^{4u}), u >= 0) | sign-twisted primes; no functional equation |
| uni=t | xi(s + it) | unimodular twist |
| F + plant(g, delta) | Theta_F times the four factors (z - a - l)/(z + a - l), l = +-delta +- ig | pair planted at a chosen height and offset |
| twin | Theta of zeta times the factor that moves each ordinate within a window W of g to the solution of theta(t)/pi + 1 = k - 1/2 | arithmetic-free node set |

Files (this directory): `olib.py` (Lambda_F, Theta, Schur Gram, pivots), `slib.py`, `selftest.py`, `c1a.py`, `c1a_gpu.py`, `c1b.py`, `c2.py`, `c2_free.py`, `c34.py` (modes pick, pickwin, loewner, zr, detect), `detect_fine.py`, `reach.py`, task lists `tasks_*.json`, analysis `an_*.py`. Outputs: `out_server/` (server), `*_local.json*` (Mac).

Validation (known answers):
- xi, chi_-4, chi_5, DH: functional equation to 5e-76 at 256 bits; DH vanishes at 0.808517 + 85.699348 i to 8.6e-7 of its size nearby (six-digit zero).
- Schur Gram of a Blaschke product of degree 6 on 14 nodes: 6 positive pivots, then exact zeros (rank 6); the same divided by two more factors: 6 positive, 2 negative (negative index = number of right-half-plane poles).
- Null controls of the detection test: zeta, chi_5 and the twin without a planted pair: no negative pivot at any mesh density down to the precision limit (`detect_null_local.jsonl`).
- Loewner realisation: for zeta on [5, 60] the 13 in-window poles are found at distance a from the axis to 1 % at r >= 24 for each a (the 13 zeros between 14.13 and 59.35), fit error at midpoints 5e-8 to 1e-6 at r = 24 and 2e-40 to 8e-39 at r = 48. A rational test function was not usable: the pencil is singular when r exceeds the degree.
- Minors: Gaussian kernel: every translation minor positive and every Hankel minor of sign (-1)^{r(r-1)/2} (324,000 + 324,000 minors); 1/(1 + u^2): mixed signs; E_b: no opposite sign wherever zeta has none (Lemma E).
- Orbit matrix: sum of M_nm against 16 int_0^inf Phi'(u)^2 du by quadrature: relative difference 1.5e-119 (600 bits).
- Source number of the task: imp-3252 (kernel as typed there, 10 terms, midpoint grid on [0, 6], a = 0.5): least eigenvalue of i G_shear = -4.7904312e-3 at 160 points and -2.5282398e-2 at 800; scaled values 1.7964e-4 and 1.8962e-4, limit 1.9003e-4 at 6,400 points (source: 4.79e-3, 2.53e-2, 1.796e-4, 1.896e-4). The figure -4.8e-6 of the node is not reproduced by any of these (it is 4.79e-3 times an unrecorded factor; the source module says the same).

Compute. Server through `rhrun`, at most 8 cores and 12 GB requested in total: `rh-s6-c1b-1120115147` (6 cores, 10.15 million minors, about 9 minutes), `rh-s6-c1a-1120115147` and `rh-s6-c1a400-1120131404` (1 core each), `rh-s6-zrdet-1120115603` (1 core, 162 tasks), `rh-s6-loew-1120120055` (3 cores; orders 300 and 200), `rh-s6-c2-1120120055` (2 cores), `rh-s6-pick-1120120055` and `rh-s6-pick2-1120122305` (1 and 2 cores), `rh-s6-c1agpu-1120115147` and `...115603` (float64 spectrum). All units are stopped or finished. Mac through `scripts/memcap.sh 8`: validation, the fine detection ladder, the confined-window runs, Loewner orders up to 200, the remaining Pick rows, the N = 20,000 spectrum, five objects of combination 2.

Deviations from the task text:
1. GPU. Device 1 was full for the whole session (96.9 of 97.9 GB in use by other jobs): cusolver failed to initialise in the first unit and cupy ran out of memory in the second. The float64 spectrum ran on CPU: N = 2,000, 5,000, 10,000 on the server; the N = 20,000 step was killed by the 12 GB unit limit (three host copies of a 3 GB matrix). The code was changed to one in-place copy; the wrapper then refused new units three times (41 to 48 GB free on the machine), so N = 20,000 ran on the Mac (peak about 4 GB, 405 s).
2. The server was at load 110 on 48 cores for an hour and one ssh session timed out. The Pick rows with 200 to 400 nodes and the Loewner orders 90..200 were moved to the Mac; the server Pick unit was stopped. Loewner order 300 completed on the server for a = 0.02, 0.1, 0.25 (73 minutes each); a = 0.4 at order 300 was stopped unfinished.
3. Combination 2 at order 2,000 on zeta's own ordinates (6,000-bit quadrature) did not start before the units were stopped. Order 500 is the largest ball run on ordinates; order 2,000 was run on the log-prime-power nodes in float64 (section 3).
4. Combination 3 at "4,000-bit balls, order 300 from 4,000 samples to height 10^4" was run as stated; the eigenvalues of the pencil are floating approximations at 4,000 bits (`acb_mat.eig(algorithm="approx")`), not enclosures.
5. Combination 4: "the first 1e8 zeta zeros" were not loaded. The (ZR) premise was sampled at random nodes up to the height of zero number 10^8 (4.27e7); the detection runs use the zeros near each g from `acb.zeta_zero`.
6. Stopped unfinished on the Mac when the write-up was closed: the confined-window runs for DH at Y = 20 and the precision ladder for DH at Y = 40; chi_-4 with a pair planted at 400 was not started.
7. A first version of the Pick elimination returned "undecided" for zeta at 400 nodes and 4,000 bits (ball radii grow by about 14 bits per elimination step). Those two rows are discarded; the rows reported use 6,500 bits at 300 nodes.

## 2. Combination 1: orbit-pair kernel, and minors outside the recorded ranges

### 2.1 Orbit-pair matrix (source: PR 40, `PRIOR_DRIFT_ORBIT_PAIR_OBSTRUCTION_20261103.md`, equations 4, 5, 20 to 22)

phi_n(h) = 4 z_n (2 z_n - 3) e^{h/2 - z_n}, z_n = pi n^2 e^{2h}; psi = sum phi_n = 4 Phi(h/2); sigma_n = phi_n'/phi_n; kappa_nm = -((sigma_n - sigma_m)^2 + sigma_n' + sigma_m')/2; M_nm = int_0^inf kappa_nm phi_n phi_m dh.

**PROVED.**
(a) kappa_nm phi_n phi_m = phi_n' phi_m' - (phi_n phi_m'' + phi_n'' phi_m)/2, hence, integrating by parts,
    M_nm = 2 int_0^inf phi_n' phi_m' dh + (phi_n(0) phi_m'(0) + phi_m(0) phi_n'(0))/2 = 2 G' + (b c^T + c b^T)/2.
(b) G' is a Gram matrix of independent functions (positive definite); b c^T + c b^T has one eigenvalue <= 0 and one >= 0. By Weyl's inequalities M has at most one negative eigenvalue and its second eigenvalue is at least the least eigenvalue of 2G' > 0. The leading 2 x 2 determinant is negative (ball: -1.47177740266e11 in the scaling e^{pi(n^2+m^2)}). By interlacing the inertia is (N - 1, 0, 1) for every N >= 2.
(c) With coefficients a(n) the matrix is D_a M D_a: a congruence when no a(n) vanishes, a principal submatrix otherwise. Every 2 x 2 principal minor with n < m <= 400 is negative (balls), so every index set inside 1..400 with two or more elements gives one negative eigenvalue. The inertia does not depend on the object.
(d) A(a) = sum a(n) conj a(m) M_nm = 2 int_0^inf abs(psi_a')^2 + Re(conj psi_a(0) psi_a'(0)), psi_a = sum a(n) phi_n. For any smooth even kernel the boundary term vanishes and A = int_R Phi'^2 = (1/2 pi) int w^2 abs(Xi(w))^2 dw > 0: this covers the completed kernels of zeta, every L(s, chi), DH, E_a, T-NR and the heat family.
(e) With zeta's orbits and a real sequence, a(1) = 1, abs(a(n)) <= 1: phi_n(0) > 0, phi_1'(0) > 0 and phi_n'(0) < 0 for n >= 2 (sigma_1(0) = 0.0443, sigma_n(0) < 0), so sum a(n) phi_n'(0) >= sum phi_n'(0) = psi'(0) = 0 and sum a(n) phi_n(0) > 0. The boundary term is >= 0 with equality only for a = 1 (zeta: the ratio phi_2'(0)/phi_1'(0) is -0.9999979), and A > 0.

**MEASURED** (`out_server/c1a_400_12000.json`, `out_server/c1a.json`, `out_server/c1a_spectrum_server_log.txt`, `c1a_spectrum_20000_local.json`).
- Signs of the entries, n, m <= 400: diagonal > 0, off-diagonal < 0 (as in source equation 22).
- Pivots of the diagonally normalised matrix (balls, 12,000 bits): N = 2, 3, 4, 5, 8, 10, 20, 40, 60, 80, 120, 160, 200, 300, 400: (N - 1) positive, 1 negative, 0 undecided; smallest pivot 10^-24.0, 10^-144.0, 10^-295.5 at N = 40, 200, 400. At 3,000 bits the pivots are decided to N = 216 only.
- float64 spectrum of the normalised matrix (tolerance 1e-11 of the largest eigenvalue): N = 2,000: 1 below, 29 above, 1,970 inside; 5,000: 1, 30, 4,969; 10,000: 1, 30, 9,969; 20,000: 1, 30, 19,969. float64 resolves 31 eigenvalues; the inertia is the proved one.
- A_N for the coefficient sequences (N = 30; the value is converged at N = 5 because M_nm carries e^{-pi(n^2+m^2)}):

| sequence | A | 2 int psi'^2 | boundary term |
|---|---|---|---|
| zeta (a = 1) | 13.05554930257055843539 | 13.0555493026 | 0 (5e-1300) |
| chi_-4 | 13.17532077206211779183 | 13.0344751575 | 0.140845614582 |
| chi_5 | 13.29512883045521225880 | 13.0140511663 | 0.281077664157 |
| chi_-3 | 13.29512854315056533163 | 13.0140511726 | 0.281077370576 |
| DH | 13.14129238592600939877 | 13.0403957693 | 0.100896616660 |
| Liouville | 13.29512883045521225880 | 13.0140511663 | 0.281077664157 |
| n^{-i} (unimodular, t = 1) | 13.08319221049154493349 | 13.0507612225 | 0.0324309879481 |
| n^{-14.1347 i} | 13.28690719218445478113 | 13.0154752578 | 0.271431934348 |
| first term only | 13.17532048461116534062 | 13.0344751645 | 0.140845320109 |

  Every value lies within 1 % of the first-term value. chi_5 and Liouville agree to all digits shown (they differ from n = 5 on, weight e^{-25 pi}).
- Arithmetic-free coefficients (12 terms): 2,000 real uniform, 2,000 random signs, 2,000 random phases: 6,000 positive, 0 negative.

Classification: CLOSED. "Inertia with the object's coefficients" is one inertia for all objects; the sign of A_N is fixed by parity of the kernel or by the first coefficient.

### 2.2 Minors of orders 3 to 10 outside the recorded ranges (cell U8)

Recorded ranges: map rows G36 (orders 2 to 4, nodes in [-2.6, 2.6]) and G43 (orders 5, 6, nodes in [-4, 4], three canonical lifts). Proved exclusions: Lemma E (E_a inherits every Polya-frequency order of Phi), Lemma L (T-NR with c >= 2 on one lattice).

Test. Kernel Phi_F(u) of section 1 on the grid of step 1/64. Translation minors det[Phi(x_i - y_j)], x and y increasing; Hankel minors det[Phi(u0 + (i + j) h)]. Ranges: bulk (nodes in [-1.5, 1.5]: differences up to 3, kernel values down to e^{-511,000}), cluster (nodes in a random window of width 1/2), far (nodes in [-5, 5], Hankel arguments up to 10: kernel values down to 10^{-3.2e17}). One-sided kernels (liouville, zeta_os): x >= 0 >= y. Reference signs: + for translation minors, (-1)^{r(r-1)/2} for Hankel minors (the Gaussian kernel has them at every order). 13,500 random tuples per cell; `arb_mat.det`, and for badly scaled matrices elimination in balls after permuting columns by the maximum-weight assignment of log abs a_ij. 0 undecided in 10,152,000 minors. E_b is run in bulk and cluster only (NOT RUN in the far range).

Count of minors with the sign opposite to the reference, of 13,500, orders 3, 4, 5, 6, 7, 8, 9, 10 (`out_server/c1b.json`):

```
translation, bulk
  gauss                   0      0      0      0      0      0      0      0
  cauchy                422   2876    552   3411    550   4004    541   4537
  zeta                    0      0      0      0      0      0      0      0
  zeta, n = 1 term        0      0      0      0      0      0      2      0
  chi-4                   1      1     15     50    145    387    730   1200
  chi5                    0      0      0      1     15     73    183    369
  chi-3                   0      0      0      0      1      5     14     81
  DH                      1     13     55    221    564   1093   1687   2274
  E_b=0.25                0      0      0      0      0      0      0      0
  NR(1000003,2.2)         0      0      0      0      0      0      0      1
  NR(3,2.2)            1737   3264   4427   5047   5568   5841   6056   6135
  NR(3,1.9)            1643   3334   4527   5040   5649   5814   5981   6067
  heat-0.5                0      0      0      0      0      0      0      1
  heat-2                  0      0      0      0      0      0      0      0
  liouville (one-sided)   0      0      0      0      0      0      0      0
  zeta (one-sided)        0      0      0      0      0      0      0      0
translation, cluster
  gauss                   0      0      0      0      0      0      0      0
  zeta                    0      0     13   1437   3581    401    420   4683
  zeta, n = 1 term        0     35    457   2599   5478   5859   6684   6674
  chi-4                 432   6616      7   2572   3775    223   3259   2398
  chi5                    0   1329   5292    222   8038      0   2884   2320
  chi-3                   0     10   5069   1846    900   6205    808   7228
  DH                   4392   2713    468   4327      0   5675     50   5097
  E_b=0.25                0      0      0      0      0    253   1330      1
  NR(1000003,2.2)         0      0     14   1458   3550    360    418   4689
  NR(3,2.2)               2   3885    240   2181   3727    200   1635   3254
  NR(3,1.9)               2   4098    247   2424   3601    193   2020   2873
  heat-0.5                0      0      9   1217   3622    485    332   4442
  heat-2                  0      0      2    751   3669    928    124   3597
  liouville, zeta (one-sided)   0 at every order
translation, far
  gauss, zeta, zeta n = 1 term, chi5, chi-3, heat-0.5, heat-2, one-sided kernels: 0 at every order
  chi-4                   0      0      0      0      0      0      0      1
  DH                      0      0      0      1      4      3     14     11
  NR(1000003,2.2)      3810   6527   5406   6699   6098   6760   6458   6632
  NR(3,2.2)              64    194    427    753   1245   1797   2397   2926
  NR(3,1.9)              64    204    426    794   1307   1789   2331   2970
Hankel, bulk
  gauss                   0      0      0      0      0      0      0      0
  zeta                    0      0     39     64     42    133    123    177
  zeta, n = 1 term        0     35     49    115    115    243    239    361
  chi-4                  57    188    316    735   1706   1658   1580   2388
  chi5                    0    105    340    413    964   1980   1945   2129
  chi-3                   0     41    179    234    542    944   1192   1884
  DH                    190    309    629   1753   2343   1515   3506   2963
  E_b=0.25                0      0      0      0      0    138    106    145
  NR(1000003,2.2)         0      0     44     43     42    119    111    181
  NR(3,2.2)             952    949   1918   2072   2030   1856   2672   1907
  NR(3,1.9)             872    915   1972   2032   1997   1973   2401   1995
  heat-0.5                0      0     41     43     47    108    133    195
  heat-2                  0      0     24     35     38     78    116    107
  liouville               0      0      0      0      0      0      0      0
  zeta (one-sided)        0      0      0      0      0     46      0      0
Hankel, cluster
  gauss                   0      0      0      0      0      0      0      0
  zeta                    0      0    368      0      0    469    293      0
  zeta, n = 1 term       73    338    145    378    285    543    375    669
  chi-4                 501      0    496    389    158    947    271    851
  chi5                    0    526    785      0    669    798    756    661
  chi-3                   0    564      0      0    936    534    171    758
  DH                    950      0    956    317    665    379    901   1123
  E_b=0.25                0      0      0      0      0    577      0      0
  NR(1000003,2.2)         0      0    361      0      0    418    294      0
  NR(3,2.2)               0   1822    818   1887      0   3052    367   1608
  NR(3,1.9)               0   1914    833   1947      0   2939    380   1520
  heat-0.5                0      0    298      0      0    441    293      0
  heat-2                  0      0    211      0      0    251    417      0
  liouville               0      0      0      0      0      0      0      0
  zeta (one-sided)        0      0      0      0      0    167      0      0
Hankel, far
  gauss                   0      0      0      0      0      0      0      0
  zeta                    0      0      0      5      1      8      3      8
  zeta, n = 1 term        0      0      3      5      5     13      8     14
  chi-4                   5      9     18     27     23     42     58     76
  chi5                    0      4     21     13     24     33     52     69
  chi-3                   0      6     10     12     17     22     26     40
  DH                     13      6     16     27     36     43     87     73
  NR(1000003,2.2)         0   4669      3   3378      2   3184     13   3620
  NR(3,2.2)              38     50    108    233    142    115    186    159
  NR(3,1.9)              25     60    122    185    162    146    171    179
  heat-0.5                0      0      1      3      2      4      6      7
  heat-2                  0      0      2      3      1      6      6      3
  liouville, zeta (one-sided)   0 at every order
```

Reading.
- Premise on zeta: one sign in the translation families (bulk and far) at orders 3..10; in the cluster range at orders 3 and 4 only (order 5: 13 opposite; consistent with map row G4, kappa is not PF_5); Hankel at orders 3 and 4.
- Positive comparisons: chi_-4 has opposite signs at order 3 in translation bulk (1), cluster (432), Hankel bulk (57), cluster (501), far (5). chi_5 holds order 3 everywhere and fails order 4 in cluster (1,329) and Hankel (105, 526, 4). The cell shared by zeta and all three L-functions is: translation minors, far range, orders 3 to 9 (chi_-4: 1 opposite sign at order 10).
- Controls in that cell: E_a passes (PROVED, Lemma E, given zeta's sign; in the bulk and cluster ranges E_b has 0 opposite signs in every cell where zeta has 0). Heat tau = -0.5, -2: 0. Liouville: 0. DH: 0, 0, 0, 1, 4, 3, 14 at orders 3..9 (rates 7e-5 to 1e-3). T-NR(1000003, 2.2): 28 % to 50 %; T-NR(3): the same counts for c = 1.9 and c = 2.2 at every order of every family (differences within sampling noise), so the T-NR failure does not depend on zeros off the line: it reads the three bumps of the kernel at distance (log q)/2.
- Far range: the sign of a minor with widely spaced nodes is the sign of its dominant permutation, decided by the log-concavity of the tail exp(-pi n^2 e^{4u}/q) of the first theta term. It is positive for every kernel with one dominant term; nothing arithmetic enters.

Classification: CLOSED. No sign pattern is shared by zeta and L(chi) and broken by DH, E_a and T-NR. The cell U8 stays silent beyond: nodes off the grid of step 1/64, dilation minors, the kernel with polar terms, complex kernels.

Unimodular twist: det[Phi(x_i - y_j) e^{ic(x_i - y_j)}] = e^{ic(sum x - sum y)} det[Phi(x_i - y_j)] and the Hankel analogue: the modulus is unchanged and a sign is not defined (PROVED; NOT RUN).

## 3. Combination 2: commutator form on frequency nodes

Definition (source `imp-commutator-diagonal-positivity.js`, section 25). A_a(z) = int_0^inf Phi cosh(au) cos(zu) du, B_a(z) = int_0^inf Phi sinh(au) sin(zu) du, so A + iB = int_0^inf Phi cos((z - ia)u) du = Xi(z - ia)/2. Kernel K(w, z) = (A(z) B(conj w) - B(z) A(conj w))/(pi (conj w - z)): the de Branges kernel of E = A - iB = Xi(. + ia)/2. On real nodes K_jk = (A_j B_k - B_j A_k)/(pi (w_k - w_j)), K_jj = (A_j B_j' - A_j' B_j)/pi. Diagonal channel of the source: D(w, z) = (1/(2 pi)) int_0^inf Phi(u)^2 sinh(2au) sin((conj w - z)u)/(conj w - z) du. Remainder R = K - D. Statistic: rho = norm(R)_F/norm(D)_F; also tr K/tr D.

**PROVED.**
(a) D_jk = d(w_j - w_k), d(t) = int_0^inf cos(ts) m(s) ds with m(s) = (1/(2 pi)) int_s^inf Phi(u)^2 sinh(2au) du >= 0. By Bochner D is positive semidefinite on every node set, and it is a functional of the measure Phi^2 du alone (the class closed by `s5-volterra-shear-phi-kernel-norms`: unchanged by any sign change of Phi, including one that creates an off-line zero).
(b) K(w, w) = abs(E(w))^2 (phase derivative)/pi, and abs(Xi(w + ia)) decays like e^{-pi w/8} up to powers: K decays like e^{-pi w/4} along the nodes while d(0) is a constant. The "split" is not a decomposition into comparable parts; at height R = -D up to an exponentially small term and rho tends to 1 for every object and every node set that leaves the origin.

**MEASURED** (`out_server/c2.jsonl`, `c2_local.jsonl`, `c2_free_local*.json`). Values at a = 0.5; a = 0.05 and a = 2 differ in the third digit of 1 - rho (K11/d(0) = 6.08e-5, 6.12e-5 for zeta at a = 0.05, 0.5).

| object | nodes (n) | frequency range | rho | tr K / tr D | K at first node / d(0) |
|---|---|---|---|---|---|
| zeta | own ordinates (500) | [28.27, 1622.4] | 0.99999998 | 1.22e-7 | 6.1e-5; last node 10^-540 |
| zeta | smooth ordinates (500), arithmetic-free | [29.04, 1622.9] | 0.99999999 | 7.9e-8 | 3.9e-5 |
| zeta | equispaced (500) | [3.24, 1622.4] | 0.99916 | 1.57e-3 | 0.326 |
| zeta | log prime powers (500) | [0.69, 8.10] | 0.77733 | 0.2230 | 0.361 |
| zeta | equispaced on that range (500) | [0.69, 8.10] | 0.70804 | 0.2888 | 0.361 |
| chi_-4 | own ordinates (200) | [12.04, 591.6] | 0.99998998 | 4.4e-5 | 8.7e-3 |
| chi_-4 | log prime powers (200) | [0.69, 6.94] | 0.76722 | 0.2430 | 0.607 |
| chi_5 | own ordinates (200) | [13.30, 567.9] | 0.99999824 | 8.0e-6 | 1.6e-3 |
| chi_5 | log prime powers (200) | [0.69, 6.94] | 0.77527 | 0.2366 | 0.634 |
| DH | own on-line ordinates (200) | [10.19, 589.9] | 0.99997512 | 9.8e-5 | 1.9e-2 |
| DH | log prime powers (200) | [0.69, 6.94] | 0.78811 | 0.2267 | 0.654 |
| T-NR(1000003, 2.2) | zeta ordinates (200) | [28.27, 792.8] | 1.00000000 (8 digits printed) | 1.3e-9 | 2.6e-7 |
| T-NR(1000003, 2.2) / (1.9) | log prime powers (200) | [0.69, 6.94] | 0.75695 / 0.75659 | 0.2638 / 0.2640 | 0.386 / 0.386 |
| heat tau = -0.5 / -2 | zeta ordinates (200) | [28.27, 792.8] | 0.99999995 / 0.99999994 | 3.2e-7 / 3.8e-7 | 6.4e-5 / 7.6e-5 |
| heat tau = -0.5 / -2 | log prime powers (200) | [0.69, 6.94] | 0.74045 / 0.74159 | 0.2591 / 0.2579 | 0.360 / 0.355 |
| Liouville (one-sided kernel) | log prime powers (200) | [0.69, 6.94] | 0.74511 | 0.2542 | 0.323 |
| E_b = 0.25 (a = 0.05) | zeta ordinates (200) | [28.27, 792.8] | 1.00000000 (8 digits printed) | -2.1e-13 | -4.2e-11 |

Zeta on log prime powers against arithmetic-free nodes with the same counting function (log x_j with sum_k li(x_j^{1/k}) = j - 1/2), float64 (the n = 500 value agrees with the ball run to 7 digits):

| n | log prime powers | same counting function, arithmetic-free | equispaced on the same range |
|---|---|---|---|
| 50 | 0.68770 | 0.67949 | 0.66908 |
| 200 | 0.74008 | 0.73372 | 0.69196 |
| 500 | 0.77733 | 0.77324 | 0.70804 |
| 1,000 | 0.80464 | 0.80196 | 0.72007 |
| 2,000 | 0.83048 | 0.82880 | 0.73214 |

Reading. On ordinates the ratio is 1 to 5 to 13 digits for every object: the statistic contains nothing. On low nodes it is a smooth function of where the nodes sit (K(w, w)/d(0) falls from 0.36 at w = 0.69 to 0.2 at w = 8); replacing prime powers by a smooth sequence of the same density moves it by 0.2 to 1.2 %, decreasing with n. T-NR with zeros off the line (c = 2.2) and on the line (c = 1.9): 0.75695 against 0.75659. The diagonal entries of K change sign for the heat kernels, E_b and Liouville on high nodes: that is the Hermite-Biehler test of E, which is the Pick matrix of combination 3, not a property of the split.

Silent cell U6 (d) (rank >= 2 squares without a Hecke rule): the numerator of K is the rank-2 antisymmetric form A (x) B - B (x) A; nothing here supplies a square with content beyond (a).

Classification: CLOSED. The object enters the diagonal channel through Phi^2 du and the remainder through values of Xi at distance a from the real axis; the nodes enter through their density. Fail condition of the task (separates a control on its own nodes but not on arithmetic-free nodes): not met in either part.

## 4. Combination 3: bounded-real realisation of Theta_a

Finite consequence tested. T3(a) holds iff Theta_a is analytic and bounded by 1 in Re z > 0. For a rational interpolant H of boundary samples the storage (Lyapunov) matrix of a minimal realisation has as many negative eigenvalues as H has poles in Re z > 0 (CLASSICAL: Ostrowski-Schneider inertia theorem). So "P indefinite" is counted as the number of poles of the Loewner-pencil interpolant on the wrong side. In the variable y = z/i a zero on the line at ordinate g is a pole at y = g + ia, and a zero at 1/2 + delta + ig with delta > a is a pole at g - i(delta - a). Interpolant: 2r samples H(y_i) = Theta(i y_i), alternately left and right data, L = [(v_j - w_k)/(mu_j - la_k)], Ls = [(mu_j v_j - la_k w_k)/(mu_j - la_k)], poles = eigenvalues of L^{-1} Ls. Second form: the Schur Gram (Pick) matrix on nodes 2^-64 + i j h, j = 1..r, and its first negative leading minor (balls).

**MEASURED** (`loewner_local.jsonl`, `loewner_local_mid.jsonl`, `out_server/loewner.jsonl`, `out_server/pick*.jsonl`, `pick_local.jsonl`).

(i) Premise on zeta, sampling as stated in the task (4,000 samples of spacing 2.5 on [2.5, 10^4]; 2r of them, equally spaced; about 10,140 zeros in the window):

| r | a = 0.02 | a = 0.1 | a = 0.25 | a = 0.4 | chi_-4 (a = 0.1, 0.25) | E_b = 0.3 (a = 0.1, 0.25) |
|---|---|---|---|---|---|---|
| 50 | 18 | 17 | 19 | 24 | | |
| 100 | 51 | 56 | 52 | 46 | 48, 49 | 55, 51 |
| 200 | 101 | 101 | 102 | 102 | | |
| 300 | 145 | 142 | 147 | stopped | | |

(poles on the wrong side; fit error at midpoints 1.4 to 14). Half of the poles are on each side for zeta, an L-function and a control alike. The premise "P definite for zeta" is false in this form at both sizes and at every size; by the order of the task the stated form stops here.

(ii) Resolved windows (premise at two sizes: 13 zeros in [5, 60], 100 zeros in [5, 237]):

| window | r | wrong-side poles, a = 0.02 / 0.1 / 0.25 / 0.4 | in-window poles within 1 % of distance a |
|---|---|---|---|
| [5, 60] | 6, 8, 10, 12, 13, 14 | 2/2/2/2, 4/4/4/4, 4/4/5/4, 6/6/5/6, 5/5/4/3, 4/4/4/4 | 0, 0, 0, 1, 3, 3 |
| [5, 60] | 16, 20, 24, 32, 48 | 0 at every a | 7, 12, 13, 13, 13 |
| [5, 237] | 90, 110 | 38/38/39/41, 13/14/14/21 | 24, 56..62 |
| [5, 237] | 128 | 0/0/0/0 | 99, 99, 99, 100 |

Zeta is indefinite at every order below the number of zeros in the window, and definite from about 1.2 times that number.

(iii) L-functions and controls on resolved windows:

| object | window | converged r | wrong-side poles in window | off-line zeros right of 1/2 + a in window |
|---|---|---|---|---|
| chi_-4, chi_5 (a = 0.1, 0.25) | [5, 60] | 32, 48 | 0 (below r = 32: 3 to 15) | 0 |
| E_b = 0.3 (a = 0.1, 0.25) | [5, 60] | 48 | 13, at distance b - a; the mirror zeros at distance b + a = 0.4, 0.55 | 13 |
| DH (a = 0.1, 0.25) | [60, 100] | 32, 48, 64 | 1 (27 poles in window) | 1 (85.70) |
| DH (a = 0.1, 0.25) | [5, 100] | 64 | 1 (55 poles in window); r = 16..48: 5 to 23 | 1 |
| heat tau = -2 | [5, 60] | 24..48 | a = 0.1: 1; a = 0.25: 0, with one pole at distance 0.0014 | pair at 49.72 displaced by 0.2486 |
| T-NR(1000003, 2.2), a = 0.02 | [0.05, 5] | 32 | 13 (the two beyond the 11 expected were not identified) | 11 (heights 0.227 (2k+1)) |
| T-NR(1000003, 1.9), a = 0.02 | [0.05, 5] | 32 | 0 | 0 |
| Liouville | [5, 60] | none (fit error O(1) to r = 48) | 14 to 19 | a pole at distance a right of the axis at every ordinate |
| unimodular twist xi(s + i) | [5, 60] | 24 | 0; 14 poles at distance a | 0 (passes) |

Least r at which the realisation is reliably indefinite for a control = least r resolving the window that contains its first off-line zero: 32 for DH on [60, 100] (27 zeros), 64 on [5, 100] (55 zeros). At smaller r every object is indefinite, zeta included. There is no r at which a control is indefinite and zeta is definite except r above the count of zeros of the window containing the off-line zero.

(iv) Decay rate. In every converged row the in-window poles lie at distance a from the axis (0.02, 0.1, 0.25, 0.4 to 1 %; to 1e-4 in the median). The rate of the realised semigroup is the shift parameter. R = 2 min(sigma, 1 - sigma) of the damping model at sigma = 1/2 - a is 1 - 2a (0.96, 0.8, 0.5, 0.2): no relation, as the source of `entropy-rate-balance` states (no zero-location content).

(v) Pick matrix, nodes nested from height 0 (first negative leading minor; 0 = none):

| object | spacing | nodes | a = 0.02 | a = 0.1 | a = 0.25 | a = 0.4 |
|---|---|---|---|---|---|---|
| zeta | 1 and 0.5 | 300 | 0 | 0 | 0 | 0 |
| chi_-4 | 1 | 300 (a = 0.02), 200 | 0 | 0 | 0 | 0 |
| chi_5 | 1 | 300 (a = 0.02), 200 | 0 | 0 | 0 | 0 |
| unimodular twist | 1 | 200 | 0 | 0 | 0 | 0 |
| E_b = 0.3 | 1 | 80 | 6 | 6 | 7 | 0 |
| T-NR(1000003, 2.2) | 0.1 | 80 | 2 | 0 | 0 | 0 |
| T-NR(1000003, 2.2) | 1 | 80 | 43 | 0 | 0 | 0 |
| DH | 2 | 100 | 43 (height 86) | 46 (height 92) | 0 | 0 |
| DH | 1 | 200 | 76 | 76 | 77 | 0 |
| heat tau = -0.5 | 1 | 140 | 79 | 79 | 133 | 0 |
| heat tau = -2 | 1 | 140 | 28 | 28 | 35 | 35 |
| Liouville | 1 | 60 | 1 | 1 | 1 | 1 |
| zeta + plant(g, 0.3), a = 0.15: g = 50, 100, 200, 400 | 1 | 1.15 g | 35, 76, 165, 364 | | | |
| zeta + plant(g, 0.05), a = 0.025: same g | 1 | 1.15 g | 37, 78, 170, 366 | | | |
| chi_-4 + plant(g, 0.3) / (g, 0.05): g = 50, 100, 200 | 1 | 1.15 g | 45, 91, 191 / 46, 95, 195 | | | |

Controls pass exactly where a exceeds their displacement (E_b at a = 0.4; T-NR at a >= 0.1; DH at a = 0.4). Failure heights: DH 0.89 g at spacing 1 and 1.0 g at spacing 2; planted pairs 0.70 to 0.92 g for zeta (rising with g: 0.70, 0.76, 0.83, 0.91) and 0.90 to 0.98 g for chi_-4 (higher zero density); heat 0.71 g and 0.56 g. Node counts at failure against zeros below the off-line zero: DH at spacing 2: 43 nodes, about 44 zeros of DH below 85.7 (main term (T/2 pi) log(5T/2 pi e)); at spacing 1: 76 nodes. Zeta + plant(100): 76 nodes against 29 zeros; plant(200): 165 against 79; plant(400): 364 against 197.

Classification: CLOSED. Verified height in another form. The object enters through values of Lambda_F on the line Re s = 1/2 +- a, that is through its zeros; the count of evaluations at failure is at least the count of zeros up to the off-line one.

## 5. Combination 4: (ZR) and the detection modulus

Statement from the Lean source (`formalization/lean-aristotle/frozen-rung/Kernels.lean`, `l2_detection_modulus`):

    schurKernel Theta z w = (1 - Theta z * conj (Theta w)) / (2 pi (z + conj w))
    (ZR)  exists i, 0 < (zs i).re  and  1 < norm (Theta (zs i))
    theorem: (ZR) implies 1 <= negIndex (gramMatrix (schurKernel Theta) zs)

(ZR) is a hypothesis about the mesh and an object with a zero right of 1/2 + a: some mesh node carries modulus above 1. For an object with no such zero the modulus is below 1 at every node of Re z > 0 and (ZR) is false. The name "zero repulsion" is the label of the hypothesis in the engine graph; the Lean statement contains no statement about spacings of zeros.

(i) Premise (`out_server/zr_detect.jsonl`, mode zr; 192 bits; nodes x in {0.002, 0.01, 0.05, 0.1, 0.25, 0.5}, y uniform):

| object | heights | nodes per a | max log abs Theta, a = 0.02 / 0.1 / 0.25 / 0.4 |
|---|---|---|---|
| zeta | [14, 10^3], [10^3, 10^5], [10^5, 4.27e7] | 3,000 each | -1.8e-5, -4.2e-4, -1.1e-3 / -9.2e-5, -2.1e-3, -5.5e-3 / -2.3e-4, -4.9e-3, -1.3e-2 / -3.6e-4, -6.9e-3, -1.6e-2 |
| chi_-4 | [10, 10^4] | 400 | -3.0e-4 / -1.5e-3 / -3.4e-3 / -4.9e-3 |
| chi_5 | [10, 10^4] | 400 | -3.9e-4 / -1.9e-3 / -4.5e-3 / -6.4e-3 |
| DH | [1, 80] | 1,000 | -1.7e-5 / -8.3e-5 / -2.1e-4 / -3.3e-4 |
| DH | [80, 90] | 3,000 | +0.63 / +0.93 / +2.33 / -3.3e-3 |
| E_b = 0.3 | [10, 10^3] | 3,000 | +0.74 / +0.66 / +5.32 / -3.4e-4 |

The maxima for zeta are attained at the smallest x. (ZR) holds on a random mesh only for the controls, near their off-line zeros, and for a < displacement.

(ii) Detection modulus. Mesh z_j = x0 + i(g + (j + off) h), 32 nodes centred at g, offsets 0.5 and 0.23; a = delta/2; x0 in {delta/2 (the line through the pole), 2 delta, 0.25}; h on the ladder 4/(density) x 2^{-m/4}, density = log(g/2 pi)/2 pi; h* = largest h with a negative pivot at both offsets; N* = g/h*; N(g) = (g/2 pi) log(g/2 pi e) + 7/8. 768-bit balls. Zeta with a planted quadruple (`out_server/zr_detect.jsonl`):

| delta | g = 10^2 | 10^3 | 10^4 | 10^5 |
|---|---|---|---|---|
| 0.4, 0.2 | 0.841 (1.81) | 0.841 (1.48) | 0.841 (1.38) | 0.841 (1.33) |
| 0.1 | 0.707 (2.15) | 0.707 (1.76) | 0.707 (1.64); 0.841 at x0 = 0.25 | 0.841 (1.33) |
| 0.03 | 0.707 (2.15) | 0.707 (1.76) | 0.707 (1.64) | 0.841 (1.33); 0.707 at x0 = 0.25 |
| 0.01, 0.003, 0.001 | 0.707 (2.15) | 0.707 (1.76) | 0.707 (1.64) | 0.707 (1.58) |

Entries: h* x density (N*/N(g)); the three mesh lines agree except where noted. 84 cases. No case has a node with abs Theta > 1 at h*: the Gram matrix detects without (ZR). Null runs (no planted pair; zeta, chi_5, twin): no negative pivot at any h.

Fine ladder (`detect_fine_local.jsonl`; four offsets; K nodes; h x density in {1.30, 1.15, 1.08, 1.04, 1.00, 0.97, 0.94, 0.91, 0.88, 0.85, 0.80, 0.70}). Largest h x density with a negative pivot at an offset other than 0.02, and the number of zeta zeros inside the mesh span at that density:

| g | delta | K = 16 | K = 32 | K = 64 |
|---|---|---|---|---|
| 10^3 | 0.2 | 0.88 (14 zeros) | 0.94 (30) | 0.94 (61) |
| 10^4 | 0.2 | 0.88 (14) | 0.94 (30) | 0.94 (60) |
| 10^5 | 0.2 | 1.00 (17) | 1.00 (33) | 1.00 (63) |
| 10^3 | 0.001 | none down to 0.70 | 0.70 (23) | 0.85 (54) |
| 10^4 | 0.001 | none | 0.70 (22) | 0.85 (54) |
| 10^5 | 0.001 | none | 0.70 (22) | 0.88 (56) |

Detection needs about as many nodes as there are zeros in the mesh span. Nodes minus zeros at the largest detecting density: 2, 2, 3 and 2, 2, 4 at delta = 0.2 for g = 10^3, 10^4 (K = 16, 32, 64); -1, -1, 1 at g = 10^5, where one of the three offsets detects at density 1.00; 9, 10 and 10, 10 and 10, 8 at delta = 0.001 (K = 32, 64). The difference does not grow with K, so the critical density tends to the zero density as the window grows and N*/N(g) tends to 1, within the fluctuation of the zero count. With offset 0.02 (a node at distance 0.02 h from the pole, on the line through it) detection occurs at every density up to 1.15 for delta = 0.2 (at 1.30 in 6 of 9 cases) and gains at most one ladder step for delta = 0.001: consistent with (ZR) holding in a disc around the pole whose radius shrinks with delta (the modulus at that node was not recorded in this run).

Fail condition of the task (N*/N(g) below 1 by a margin that grows with g): not met. N*/N(g) is 2.15, 1.76, 1.64, 1.58 at delta <= 0.01 and 1.81, 1.48, 1.38, 1.33 at delta >= 0.2 for g = 10^2..10^5; the decrease is the factor log(g/2 pi)/(log(g/2 pi) - 1) between g x density and N(g). The round-5 constant c < 0.45 (support of a Weil test function against log(gamma/2 pi), for deep zeros) is a different statistic and has no counterpart here: the mesh density at detection does not depend on delta between 0.4 and 0.2 and falls by one ladder step below.

(iii) Comparisons and controls.

| object | g | delta | h* x density of zeta | h* x own density | (ZR) at h* |
|---|---|---|---|---|---|
| arithmetic-free twin of zeta + plant | 10^3, 10^4 | 0.4 .. 0.001 (14 cases) | identical to zeta in 13; 0.841 against 0.707 at delta = 0.1, g = 10^4 | | no |
| chi_-4 + plant | 10^2 / 10^3 | 0.4, 0.1, 0.01 | 0.500 / 0.707, 0.595, 0.595 | 0.75 / 0.90, 0.76, 0.76 | no |
| chi_5 + plant | 10^2 / 10^3 | 0.4, 0.1, 0.01 | 0.500, 0.500, 0.420 / 0.595, 0.595, 0.500 | 0.79, 0.79, 0.66 / 0.78, 0.78, 0.66 | no |
| DH, own zero | 85.70 | 0.3085 | 0.595 | 0.96 | no |
| zeta + plant at DH's zero | 85.70 | 0.3085 | 0.841 | 0.84 | no |
| E_b (b = 0.4, 0.1), a = b/2 | 98.83, 999.79 | b | 4.0 (coarsest tried) | | yes |
| E_b = 0.01 | 999.79 | 0.01 | 0.841 | | no |
| T-NR(1000003, 2.2), a = 0.016 | 99.83, 999.86 | 0.0321 | 3.36, 4.0 | | yes |
| Liouville (pole at distance a right of the axis at every ordinate) | 98.83, 999.79 | | 4.0 | | yes |
| unimodular twist | | | no pole in Re z > 0 | | |

A planted pair is detected at a mesh density between 0.66 and 0.96 of the object's own zero density (ladder step 19 %) in zeta, in two L-functions, in zeta with arithmetic-free ordinates and for DH's own zero (own density = log(q g/2 pi)/2 pi). E_b, T-NR and Liouville have a pole at every ordinate on the mesh line and satisfy (ZR) on any mesh along it; their off-line zeros start at heights 14.13, 0.227 and 14.13, so their early failure is the one their zeros explain.

(iv) Nodes confined below the pole (`reach_local.jsonl`, `out_server/pick2.jsonl`; Pick matrix on r nodes at heights Y j/r; zeta + planted pair, a = 0.1; precision raised until the first negative pivot is decided):

| object | g | N(g) | Y | r | index of first negative pivot | size of that pivot | bits needed |
|---|---|---|---|---|---|---|---|
| zeta + plant(40, 0.3) | 40 | 6 | 10 | 64 | 34 | 10^-96.6 | 1,000 |
| zeta + plant(85.70, 0.3085) | 85.7 | 23 | 60 | 96 | 75 | 10^-86.1 | 1,500 |
| same | | | 60 | 64 | none | | |
| same | | | 40 | 96 | 82 | 10^-128.1 | 1,500 |
| same | | | 20 | 96 | 91 | 10^-201.4 | 2,000 |
| same | | | 20 | 128 | 93 | 10^-229.9 | 2,000 |
| DH (own zero) | 85.7 | about 44 | 60 | 96 | 95 | 10^-57.2 | 1,500 |
| DH | 85.7 | | 40 | 128 | 117 (none at r = 96) | | 6,000 (one run) |
| zeta + plant(160, 0.3) | 160 | 57 | 20 and 40 | 160 | none | | to 14,000 |
| zeta + plant(1000, 0.2) | 1000 | 649 | 100 | 160 | none | | 6,000 |
| E_b = 0.3 | 14.13 | 0 | 0.5, 2, 4, 6 | 16, 8 | 7 | 10^-34.4, 10^-26.2 | 500 |
| zeta alone | | | 20 | 160 | none | | 9,000 |

A pole can be detected from evaluations far below it (analytic continuation), with 3.3 to 5.7 times N(g) nodes (2.2 to 2.7 times for DH) and 57 to 230 correct digits of Theta; the digits grow as the window recedes (86, 128, 201 for Y = 60, 40, 20). More evaluations than zeros, at higher precision: not below the count explained by the height.

Floor A_unif4(2) = 1.997 of the block symbol pencil (RZ-PEN chain): a bound on a 2 x 2 block symbol; no quantity measured here is a multiple of it, and the measured critical density is 1 zero spacing, not 2. NOT COMPARED further.

Classification: CLOSED. Frozen-rung detection is the count of evaluations against the count of zeros; (ZR) is sufficient and not necessary; nothing depends on the arithmetic of the ordinates.

## 6. Where each object enters; onsets against heights of off-line zeros

| combination | zeros | coefficients | not at all |
|---|---|---|---|
| 1a inertia | | | matrix is the same for every object |
| 1a sign of A_N | | first coefficient and parity of the kernel | |
| 1b minors | | first theta terms (conductor, a(2), a(3)); T-NR: the lattice log q | |
| 2 diagonal channel | | measure Phi^2 du | |
| 2 remainder | values of Xi at distance a from the axis, exponentially small at height | | node density |
| 3 realisation, Pick | all zeros in the sampled window, through values of Lambda_F | | |
| 4 detection | zeros near the mesh, through their local count | | arithmetic of the ordinates (twin) |

| control | first off-line zero | onset in 3 (Pick from 0, spacing 1) | onset in 3 (Loewner, resolved window) | onset in 4 |
|---|---|---|---|---|
| DH | 85.70 (about 44 zeros below) | node 76 (height 76) | r = 32 with 27 zeros in window | mesh density 1.04 x own zero density at height 85.7 |
| heat tau = -0.5 | 111.69 | node 79 | NOT RUN | NOT RUN |
| heat tau = -2 | 49.72 | node 28 | r = 16 to 24 with 13 poles in window | NOT RUN |
| E_b = 0.3 | 14.13 | node 6 | r = 48 with 26 poles in window | (ZR) on the coarsest mesh |
| T-NR(1000003, 2.2) | 0.227 | node 2 at spacing 0.1 | r = 32 with 24 poles in window | (ZR) on the coarsest mesh |
| Liouville | 14.13 (pole at every ordinate) | node 1 | no convergence | (ZR) on the coarsest mesh |
| unimodular twist | none | passes | passes | passes |

No control fails at a size much smaller than its off-line zeros explain. The Pick matrix fails 11 % to 58 % below the height with an oversampled mesh (DH 11 %, heat 29 % and 44 %, E_b 58 %), at a node count at or above the zero count.

## 7. Three weakest points

1. Combination 4: the "excess" law (nodes minus zeros in the span, 2 to 10, independent of K) rests on 18 fine-ladder cases with 16, 32, 64 nodes and four offsets; the limit N*/N(g) -> 1 is an extrapolation from it, and no proof of the lower direction (no detection with fewer nodes than zeros) is given. Three cases at g = 10^5 detect at density 1.00 with nodes minus zeros equal to -1, -1, 1; the coarse ladder has step 19 %.
2. Combination 3: pole locations come from floating eigenvalue approximations at 2,000 to 4,000 bits, not from enclosures, and "wrong side" is the sign of an approximate imaginary part. Poles within 1e-3 of the axis (heat tau = -2 at a = 0.25: 0.0014) are not certified to be on either side. The heat kernels are truncated to [0, 1.5] by quadrature. The stated-sampling run at r = 300, a = 0.4 did not finish.
3. Combination 1b is a sample of 13,500 tuples per cell on one grid; a cell with 0 opposite signs is not proved one-signed, and rates near 1e-4 (DH in the far range, chi_-4 at order 10) are at the resolution of the sample. The far range was not run for E_b (covered by Lemma E only under zeta's constant sign, which is measured). Combination 2 at order 2,000 on ordinates was not run.
