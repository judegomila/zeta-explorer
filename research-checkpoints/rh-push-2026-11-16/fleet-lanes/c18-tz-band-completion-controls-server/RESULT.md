# c18-tz-band-completion-controls-server: the band forms of N(theta) on zeta and the controls, 1/2 < theta <= 1

Date: 2026-11-20. Kind: compute (heavy server lane). Sources: `push/c17-window-information-law-ctheta-u5/RESULT.md` (section 3, Remark K, section 5), map rows P45, Q30, S12b and the control table, `BRIEF.md`.
Labels: PROVED (argument in this note; author only, not refereed), CLASSICAL, MEASURED (sign certified as described in section 3 unless a line says float), ARGUED, NOT RUN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves. The headline score is unchanged.

## 0. Verdict

**Precise obstruction for the candidate, in the formalisation registered in `PREREG.md`. Outcomes (c) and (b), not (a).**

1. Outcome (c) for the completed form (Form C: data up to u = theta log t, reflected atoms n -> t/(2 pi n) above u, test band log(t/2 pi)). zeta fails it at tolerance M = 0 and M = 1 in 600 of 600 window cells that contain a reflected atom (heights 1e6 to 1e12, theta = 0.55 to 0.85), with smallest eigenvalue between -0.16 and -1.73 times log(t/2 pi) (median -0.26 to -1.18). The component at fault is the reflected part: its operator norm is 0.68 to 2.5 times log(t/2 pi) (medians 0.68 to 2.0), larger than the reserve in every cell except (1e8, 0.85). The 24 sign chains and the Liouville twist give the same picture (medians -0.31 to -1.15; they fail at M = 1 in 14987 of 15000 cells). The completed form does not separate anything; the completion is wrong as a positive extension.
2. Outcome (b) for the data form (Form D = N(theta) itself, on 96 consecutive Fourier modes of [0, u]). zeta is positive in all 640 cells with theta <= 0.85 (certified; margin 0.22 to 0.26 of log(t/2 pi) in the median at theta = 0.55, 0.012 to 0.025 at theta = 0.85, not shrinking with t) and equals 0 within the certification radius above the Nyquist band (theta >= 0.95). The controls do not all fail:
   - random multiplicative sign chains pass at theta = 0.55 in 3829 of 3840 cells at M = 1 and 3777 of 3840 at M = 0, with the same median margin as zeta (0.22 to 0.27); at theta = 0.65 in 3682 of 3840 at M = 1; at theta = 0.75 in 75 percent; at theta = 0.85 in 34 percent; at theta >= 0.95 in 2 to 6 percent. No chain fails in every window below theta = 0.95;
   - the Liouville twist passes at M = 1 in 40, 40, 40, 40 of 40 windows at theta = 0.55 (1e6 to 1e12) and in 29 to 34 of 40 at theta = 0.75;
   - ZQ with eta = 0.05 passes at M = 1 in every window at theta <= 0.75 up to 1e10 (38 of 40 at 1e12), as c17 Theorem 2 (c) predicts;
   - E_a with a = 0.1 passes at theta = 0.55 at 1e6, 1e8, 1e10 (40, 40, 39 of 40) and fails at 1e12 (11 of 40); DH passes in 33 of 40 windows at (1e6, 0.55) and fails at larger theta and height.
   - Failing in every window at every cell run: E_a with a = 0.3, T-NR (3, 2.2); ZQ with eta = 0.25 from theta = 0.75 on.
3. Pivot (one, section 6): the zero completion (data truncated at u, tested at band log(t/2 pi), no atoms added). zeta is negative at M = 0 in most windows (median -0.006 to -0.09) and passes at M = 1 in 18 to 40 of 40; chains pass it at M = 1 in 12 to 72 percent. No separation.
4. Consequence for lane `c18-tz-one-sided-bound-fe-reserve-bridge`: the linearised reflected completion is not a positive extension of zeta's own data, and N(theta) at theta = 0.55 to 0.65 with M = 1 is satisfied by sign chains in almost every window, so no inequality of the form N(theta) with M of order 1 can separate zeta from a multiplicative sign chain in the lower part of the band. In the upper part (theta >= 0.95, above the Nyquist band) the chains fail in 94 to 98 percent of cells and zeta is at 0: there the statement is exact positivity with no margin, which is the target itself in a window (c17 Theorem 4).
5. Requirement flags: R1 no, R2 no, R3 no, R4 no.

Not run: backward heat tau = -1 (no object at these heights); theta = 0.95 and 1.0 at 1e12 (prime sums to 2.5e11 and 1e12; stopped after the measured CPU share fell to 0.15 core per unit); DH where t^theta > 1e8; the GPU screen (not needed: the matrices are 96 x 96).

## 1. Plan and what is new against the sources

c17 lane 5 proved the frame (every band-u positivity device is the form of T_Z on L^2 of an interval of length u), named the input N(theta) (2 Re <h, A h> <= <h, (Arch + 2M) h>), and recorded two things as not done: the complete device was not run on the prime side for chains, and frame bounds of zeta's ordinates in a window were not computed. It named a completion candidate (the reflected half n -> t/(2 pi n)) without a formula.

Done here:
- N(theta) evaluated on the prime side, with exact Arch and pole terms, for zeta and eight control classes at four heights, 40 windows each, six theta, two tolerances: 44600 certified cells (section 4);
- the lower frame bound of zeta's zeros on the window space (the margin s), with a certified enclosure, for theta <= 0.85 (section 4.1);
- one explicit formula for the reflected completion (Form C), registered before the runs, and its test (section 5);
- a structural identity used by the code: on consecutive Fourier modes every band form is a Loewner matrix (section 2).

`PREREG.md` was written before any run. It states that Form C is this lane's formalisation; a verdict on it is a verdict on that formula.

## 2. Operators

Window space: U > 0, tau_j = t_w + (j - (m-1)/2) Delta, Delta = 2 pi/U, h_j(s) = e^(i tau_j s) on [0, U], j = 0..m-1, m = 96. These are orthogonal with norm^2 = U. All forms are divided by U. A negative Rayleigh quotient is a violation by an explicit vector of L^2[0, U]; a positive smallest eigenvalue is a statement about this 96-dimensional space only.

**Lemma L (Loewner form). PROVED.** For a measure mu on (0, U) with F(tau) = int e^(-i tau a) d mu(a), the operator A_mu = int C_a d mu(a) (C_a the compression of the shift by a) satisfies <h_j, A_mu h_k> = (F(tau_k) - F(tau_j))/(i (k - j) Delta) for j != k and <h_j, A_mu h_j> = int (U - a) e^(-i tau_j a) d mu. Hence 2 Re A_mu has the real entries 2 (Im F(tau_k) - Im F(tau_j))/(tau_k - tau_j) off the diagonal: it is the Loewner matrix of the function 2 Im F on the nodes, with the Fejer sum 2 Re int (U - a) e^(-i tau_j a) d mu on the diagonal. On the zero side the same form is sum over zeros z of N(z)/((tau_j - z)(tau_k - z)), N(z) = 2 - w e^(-i z U) - conj(w) e^(i z U), w = e^(i tau_0 U); for a real zero N = 4 sin^2(U (gamma - tau_0)/2) >= 0.
Proof. int_a^U e^(-i tau_j s) e^(i tau_k (s - a)) ds = e^(-i tau_k a)(1 - e^(i (k-j) Delta a))/(i (k-j) Delta), because (tau_k - tau_j) U is a multiple of 2 pi; integrate in mu. The Hermitian part: A_jk + conj(A_kj) = 2 Re[(F_k - F_j)/(i (k-j) Delta)]. Zero side: <h_j, v_z><v_conj(z), h_k> with g_k(z) = (w e^(-i z U) - 1)/(i (tau_k - z)). QED.
Reading: Form D on the window space is the Loewner (Pick) matrix on 96 lattice nodes of the function W(tau) = sum_z N(z)/(z - tau); it is positive for every m and every placement exactly when the weights attached to non-real zeros do not occur. This is the finite Pick positivity of the earlier Pick lanes, on lattice nodes and with the weights N(z); DH passing it at low theta (section 4.2) agrees with the earlier record that finite Pick orders are Euler-blind.

Components (all computed as in `tz.py`):
- prime part: mu = sum over n <= t^theta of c_F(n) n^(-1/2) delta_(log n), sign -;
- Arch: the multiplier const + sum Re psi(lambda + i x/2), compressed exactly: diagonal U (const + Re psi(z_j)) + 2 U Re E_j + 2 Re(psi'(z_j)/4 - i E'_j), off-diagonal (Im psi(z_k) - Im psi(z_j) + 2 Im(E_k - E_j))/(tau_k - tau_j), z_j = lambda + i tau_j/2, E(tau) = e^(-(2 lambda + i tau) U) sum_k e^(-2kU)/(2k + 2 lambda + i tau). (PROVED from psi(z) = -gamma + int_0^inf (e^(-v) - e^(-zv))/(1 - e^(-v)) dv and Lemma L applied to the density e^(-2 lambda a)/(1 - e^(-2a)); checked by K2.)
- pole: the rank-one formula at z = +-i/2 (zeta), +-i(1/2 +- a) (E_a), sign +;
- reflected part (Form C only): atoms r_n = e^(-i omega_w) c_F(n) n^(-1/2) (Lg - log n)/log n at Lg - log n, 2 <= n <= e^(Lg - u), sign -.

Form D: U = u = theta log T0; Q_D = Arch + pole - 2 Re A_prime. For zeta Q_D is T_Z on the window space (explicit formula; K2).
Form C: U = Lg = log(t_w/2 pi); Q_C = Arch + pole - 2 Re A_(prime, n <= t^theta) - 2 Re A_reflected.
Statistic: s = lambda_min(Q/U)/Lg. Pass at tolerance M: lambda_min(Q/U) + 2M >= 0.

## 3. Method, sizes, certification

Prime sums. `engine.c` (C, quad-precision phases T0 log n, segmented sieve) accumulates for each object and window the moments sum c(n) n^(-1/2) e^(-i t_w log n)(log n - a_c)^q, q = 0..7, on cells of width 1/512 in log n; D(tau) and its log-weighted companion at any node follow by an eight-term expansion. Ranges: all prime powers up to 1e6, 1e8, 1e10 at those heights (26 objects), up to 1e12^0.85 = 1.58e10 at 1e12 (26 objects; 7.1e8 primes). DH: all n <= 1e8, coefficients of -F'/F by the convolution recursion. Planned and used memory: moments at most 1.57 GB per height; matrices 96 x 96.
Certification. Each matrix is assembled in python-flint balls at 128 bits. Arch, pole and zero terms are ball computations. Each prime sum enters as a ball with an a-priori radius (2e-14 + 2.4e-16 min(X/512, 1.3 2^21/log X)) times sum abs(c(n)) n^(-1/2) (rounding of block sums, phase error, expansion remainder). This radius is derived by hand and is not machine-checked; K3 compares the engine with a direct ball sum at 1e6 (difference 2e-14 to 5e-13, radius 1e-9 or larger). "Pass" (lambda_min + 2M >= 0): LDL factorisation of the exact midpoint matrix shifted by 2M - d, with d = 96 times the largest entry radius (an upper bound for the norm of the radius part), every pivot a positive ball. "Fail": the ball value of v^T (Q/U + 2M) v / v^T v is negative for the float eigenvector v. The first version of the pass test (LDL of the ball matrix itself) lost every positive cell to interval growth and was replaced before any production run. For zeta at theta <= 0.85 the smallest eigenvalue is enclosed by both tests in 640 of 640 cells, with absolute tolerance at most 1e-2 (1e10, 1e12; Lg is 21 to 26) and at most 2e-7 at 1e6.
Undecided cells: 229 of 44600. 227 are zeta at theta >= 0.95 and M = 0, where the eigenvalue is 0 within d (float values between -8e-10 and 4e-4 times Lg); 2 are chains at (1e10, 0.85).

Controls of the code (logs in `logs/rh-c18tz-step1-*`, `-step2-*`):
- K1 (two c17 section 5.3 reference entries, by bisection on this lane's matrices on the window space plus the two vectors v_z, v_conj(z), in balls): theta = 1/2, M = 0, tight background: 0.390110 (c17: 0.3901). theta = 2, M = 1, pair alone: 0.023598 (c17: 0.0236). On the 96 modes alone: 0.391600 and 0.023696: the window space loses 0.4 percent of the one-pair reach. The rank-one code path agrees with an independent numpy pair matrix to 3e-15.
- K2 (explicit formula): Form D for zeta at T0 = 1e4 from the prime side against the zero side (35673 Arb zeros below 3e4 on both signs, smooth tail): largest entry difference 2.2e-9 (theta = 1) and 3.6e-9 (theta = 0.55); smallest eigenvalues 1.207600 on both sides at theta = 0.55. This checks Arch, pole, signs and normalisation.
- K3: above. K4: every object has max abs D on the nodes at least 8.6 (chains), 15.5 (DH), 42 (T-NR atoms); DH: sum c(n) n^(-3) over n <= 1e8 = -0.00141876726662426 against -F'/F(3) = -0.00141876726662425921 from the Hurwitz form.

Deviations from `PREREG.md`: (i) the radius factor was reduced from the registered 1e-11 to the formula above after K3; (ii) the float nodes and the ball nodes differ by at most 1e-14, not included in the radius (effect below 1e-6 of the radius at the heights run, by the size of D'); (iii) at eight of the 24 (height, theta) pairs t^theta was rounded up instead of down, which can add one integer with log n within 1e-10 of u (entry change below 1e-9); (iv) theta = 0.95 and 1.0 at 1e12 not run; (v) T-NR is run with zeta's pole term; (vi) the pivot of section 6 was not registered as a form (its numbers were produced by the registered Form C run as "without reflected").

## 4. Form D (N(theta) itself)

Full table: `tables.txt` (per height, theta, object: cells, passes at M = 0 and M = 1, certified failures, s min, median, max).

### 4.1 zeta

| T0 | theta | u/Lg | s min | s median | s max | lambda_max/Lg median | norm prime part/Lg |
|---|---|---|---|---|---|---|---|
| 1e6 | 0.55 | 0.634 | 0.0988 | 0.223 | 0.320 | 1.72 | 0.79 |
| 1e8 | 0.55 | 0.611 | 0.1087 | 0.227 | 0.415 | 1.73 | 0.81 |
| 1e10 | 0.55 | 0.598 | 0.1594 | 0.260 | 0.365 | 1.74 | 0.76 |
| 1e12 | 0.55 | 0.589 | 0.0769 | 0.263 | 0.439 | 1.72 | 0.77 |
| 1e6 | 0.65 | 0.750 | 0.0402 | 0.119 | 0.203 | 1.86 | 0.91 |
| 1e12 | 0.65 | 0.696 | 0.0359 | 0.151 | 0.314 | 1.86 | 0.89 |
| 1e6 | 0.75 | 0.865 | 0.0144 | 0.052 | 0.106 | 2.01 | 1.01 |
| 1e12 | 0.75 | 0.803 | 0.0169 | 0.075 | 0.185 | 1.97 | 0.97 |
| 1e6 | 0.85 | 0.980 | 0.0041 | 0.012 | 0.031 | 2.14 | 1.14 |
| 1e12 | 0.85 | 0.911 | 0.0053 | 0.025 | 0.078 | 2.09 | 1.09 |
| 1e6, 1e8, 1e10 | 0.95, 1.0 | 1.03 to 1.15 | 0 within d | | | 2.27 to 2.40 | 1.27 to 1.40 |

- Positive in 640 of 640 cells at theta <= 0.85 (it must be: Q_D = T_Z on the window space and the zeros to this height are on the line; a failure would have been a code error). MEASURED.
- The margin does not shrink with t at fixed theta (median at 1e12 is 1.18, 1.27, 1.46, 2.1 times the median at 1e6 for theta = 0.55, 0.65, 0.75, 0.85; the ratio u/Lg decreases with t at fixed theta, which explains the direction). It decreases with theta and is 0 within the radius above the Nyquist band, as predicted.
- Arch = log(t/2 pi) Id to 3e-6 (1e6) and 8e-13 (1e12) in norm; pole norm at most 1.2e-9 of Lg. The prime part has norm 0.76 to 1.40 times Lg: the form is positive with the prime part of the size of the reserve, not small against it.
- New against c17 (its weakest step 1): the lower frame bound of zeta's ordinates on a 96-mode window, 0.22 to 0.26 of the lattice value at u/Lg near 0.6, 0.05 to 0.08 near 0.8 to 0.87, 0.012 to 0.025 near 0.91 to 0.98.

### 4.2 Controls (cells passing at M = 1 / at M = 0, of 40 windows, or of 960 for the 24 chains)

| object | theta | 1e6 | 1e8 | 1e10 | 1e12 |
|---|---|---|---|---|---|
| chains (24) | 0.55 | 959 / 939 | 959 / 949 | 959 / 950 | 952 / 939 |
| chains (24) | 0.65 | 926 / 701 | 924 / 798 | 924 / 825 | 908 / 841 |
| chains (24) | 0.75 | 734 / 273 | 726 / 386 | 708 / 435 | 717 / 485 |
| chains (24) | 0.85 | 335 / 32 | 334 / 59 | 331 / 105 | 318 / 121 |
| chains (24) | 0.95 | 61 / 1 | 66 / 8 | 49 / 5 | not run |
| chains (24) | 1.0 | 24 / 0 | 25 / 1 | 13 / 1 | not run |
| Liouville | 0.55 | 40 / 39 | 40 / 39 | 40 / 40 | 40 / 40 |
| Liouville | 0.75 | 34 / 8 | 29 / 19 | 29 / 15 | 29 / 22 |
| Liouville | 0.95 | 0 / 0 | 3 / 0 | 2 / 0 | not run |
| E_a, a = 0.1 | 0.55 | 40 / 40 | 40 / 40 | 39 / 35 | 11 / 5 |
| E_a, a = 0.1 | 0.65 | 39 / 31 | 21 / 3 | 0 / 0 | 0 / 0 |
| E_a, a = 0.1 | >= 0.75 | 14 / 0 at 0.75, then 0 | 0 | 0 | 0 |
| E_a, a = 0.3 | all | 0 | 0 | 0 | 0 |
| T-NR (3, 2.2) | all | 0 | 0 | 0 | 0 |
| ZQ, eta = 0.25 | 0.55 | 38 / 30 | 8 / 4 | 0 | 0 |
| ZQ, eta = 0.25 | 0.65 | 6 / 3 | 0 | 0 | 0 |
| ZQ, eta = 0.25 | >= 0.75 | 0 | 0 | 0 | 0 |
| ZQ, eta = 0.05 | 0.55, 0.65 | 40 / 40 | 40 / 40 | 40 / 40 | 40 / 40, 40 / 38 |
| ZQ, eta = 0.05 | 0.75 | 40 / 36 | 40 / 35 | 40 / 31 | 38 / 28 |
| ZQ, eta = 0.05 | 0.85 | 40 / 6 | 40 / 9 | 32 / 7 | 22 / 7 |
| ZQ, eta = 0.05 | 0.95 | 40 / 0 | 40 / 0 | 9 / 0 | not run |
| DH | 0.55 | 33 / 29 | 12 / 7 | 5 / 1 | 5 / 5 |
| DH | 0.65 | 12 / 6 | 4 / 2 | 1 / 1 | 0 |
| DH | >= 0.75 | 2, 1, 0, 0 | 0 | 1 at 0.75; not run above | not run |

Readings.
1. Sign chains at theta = 0.55 are not separated from zeta by N(theta), at M = 1 or at M = 0: 98.4 percent of cells pass at M = 0, and the median margin (0.22, 0.25, 0.27, 0.27) is zeta's (0.22, 0.23, 0.26, 0.26). 23 of 24 chains pass in all 40 windows at 1e6, 1e8, 1e10 (16 of 24 at 1e12). The registered prediction (at least 50 percent failing at 0.55 and 90 percent from 0.65) was wrong: the heuristic treated the form as multiplication by the symbol Lg - 2 Re D, which it is not at the resolution 2 pi/u.
2. The failure rate of the chains rises with theta and is height-independent to within a few percent: 0.3, 4, 25, 66, 94, 98 percent at M = 1 for theta = 0.55, ..., 1.0. Every chain fails in at least one of 40 windows from theta = 0.75; no chain fails in every window below theta = 0.95. So for 0.75 <= theta <= 0.85 an every-window form of N(theta) with M = 1 does exclude each of the 24 chains at each height (MEASURED, 24 seeds), and zeta holds it with a margin of 0.012 to 0.075 of Lg in the median. This is the only place in the table where zeta and the chain class differ in an every-window sense with a margin, and the margin goes to 0 as theta increases to the Nyquist value.
3. Liouville behaves as a typical chain.
4. ZQ: one pair at eta = 0.05 is invisible up to theta = 0.75 at all four heights and visible in a growing share of windows above; eta = 0.25 is visible from theta = 0.65. This is c17 Theorem 2 (c) with the measured background in place of the lattice (the form sees u eta: up to 1.0 passes in at least 38 of 40 windows, 1.9 still passes in 38 of 40 at 1e6, 2.2 and more fails in most). A control with zeta's own functional equation and Euler atoms passes N(theta) with tolerance at every theta of the band when eta is small enough. PROVED in c17; MEASURED here.
5. E_a at a = 0.1 passes at low theta and low height and fails as a u grows (a u up to about 1.3 passes in most windows; from 1.5 on it fails in most); a = 0.3 fails everywhere. T-NR (3, 2.2) fails everywhere: its row has spacing 2 pi/log 3, visible for u > log 3.
6. DH passes in 33 of 40 windows at (1e6, 0.55) and fails in most windows elsewhere; its failures are zero location (off-line zeros seen through the window), no step about coefficients.

## 5. Form C (the reflected completion)

| T0 | theta | reflected atoms | norm reflected/Lg (median) | zeta: s min, median, max | zeta pass M = 1 | chains: s median | chains pass M = 1 (of 960) |
|---|---|---|---|---|---|---|---|
| 1e6 | 0.55 | 31 prime powers | 1.74 | -1.61, -1.03, -0.78 | 0 of 40 | -0.93 | 0 |
| 1e6 | 0.65 | 12 | 1.64 | -1.31, -0.95, -0.60 | 0 | -0.85 | 0 |
| 1e6 | 0.75 | 4 | 1.35 | -0.85, -0.66, -0.51 | 0 | -0.66 | 0 |
| 1e6 | 0.85 | 0 | 0 | 0.003, 0.008, 0.029 | 40 (no atom: band-Lg data form) | -0.24 | 278 |
| 1e8 | 0.55 to 0.75 | | 1.81, 1.71, 1.51 | medians -0.98, -0.90, -0.76 | 0 | -1.04, -0.96, -0.81 | 0 |
| 1e8 | 0.85 | 1 (n = 2) | 0.68 | -0.31, -0.26, -0.16 | 0 | -0.33 | 12 |
| 1e10 | 0.55 to 0.85 | | 1.98, 1.91, 1.75, 1.35 | medians -1.18, -1.10, -0.96, -0.63 | 0 | -1.10, -1.05, -0.92, -0.63 | 0 |
| 1e12 | 0.55 to 0.85 | | 1.99, 1.94, 1.77, 1.37 | medians -1.09, -1.07, -0.98, -0.71 | 0 | -1.15, -1.11, -1.00, -0.69 | 0 |

- zeta fails Form C in 600 of 600 cells with at least one reflected atom, at both tolerances, certified. Outcome (c).
- Component at fault: the reflected part. Prediction held (it was registered that zeta would fail for theta <= 0.75; it fails at 0.85 as well wherever an atom exists). Even one atom (n = 2 at (1e8, 0.85), weight (Lg - log 2)/sqrt 2 = 0.68 Lg) makes the form negative, because the data form on the same band has almost no margin there.
- Why (ARGUED). The atoms are the terms of frequency Lg - log n of the first phase harmonic -(1/pi) d/dx sin(2 vartheta + 2 arg), linearised in the prime amplitudes. For shifts a > U/2 the operators C_a are nilpotent of order 2, so -2 Re A has the spectrum +- (singular values of A); the atoms have weights Lambda(n)(Lg - log n)/(sqrt(n) log n), of total size above Lg from n = 2, 3 on. The products of prime amplitudes that the linearisation drops are of the same order (arg zeta has standard deviation above 1 at these heights), and no identity makes the truncated sum a positive measure. Reflection is exact only for a measure on a lattice of spacing 2 pi/Lg; zeta's zeros are not one, and the difference is the whole prime part.
- The chains give the same failure. Form C separates nothing.

## 6. Pivot (one): zero completion

Data truncated at u, no atoms above, tested at band Lg ("without reflected" in `tables.txt`). For zeta the smallest eigenvalue has median -0.006 to -0.093 of Lg over the 15 cells with u < Lg; it is certified positive at M = 0 in 1 to 13 of 40 windows and at M = 1 in 18 to 40 of 40 (40 of 40 at theta = 0.85 at 1e8, 1e10, 1e12 and at theta = 0.65, 0.75 at 1e6). The chains pass at M = 1 in 12 to 72 percent of cells, the more the smaller theta. So truncation at u is not a positive extension either (zeta is negative at M = 0), and with M = 1 it does not exclude the chains in the lower band. The pivot is closed. No further pivot.

## 7. Controls: outcome per class and the step at which each fails or passes

| Control | Form D (N(theta), M = 1) | Step |
|---|---|---|
| Davenport-Heilbronn | passes in 33 of 40 windows at (1e6, 0.55); fails in most windows elsewhere | zero location only (Lemma L: Loewner matrix with complex poles); no coefficient step |
| E_a, a = 0.1 | passes in most windows for a u up to about 1.3 | pair density equal to the zero density (c17 Theorem 6 type); fails by size of e^(a u) |
| E_a, a = 0.3 | fails everywhere | same, a u >= 2.3 |
| T-NR (3, 2.2) | fails everywhere | row spacing 2 pi/log 3 visible for u > log 3 (c17 Theorem 6); with q >= t^theta it would pass (PROVED there; not run) |
| ZQ, eta = 0.05 | passes at theta <= 0.75 | one pair below the one-pair threshold (c17 Theorem 2 (c)) |
| ZQ, eta = 0.25 | fails from theta = 0.65 | above the threshold |
| 24 random multiplicative sign chains | pass at theta = 0.55 like zeta; fail in 94 to 98 percent of cells at theta >= 0.95 | no functional equation; the reserve Lg is not theirs; they have the truncated Euler product exactly (c17 Lemma E), which does not help them or zeta |
| Liouville twist | as a chain | same |
| Backward heat tau = -1 | NOT RUN | no Dirichlet series; no zero table at these heights; in this frame zero location only |
| Unimodular twist, zeta(s+a)zeta(s-a) other a, Beurling, phase-rotated transfer operator, theta^w | NOT RUN | not in the assignment's object list beyond E_a |

R3 is not met: ZQ, E_0.1, DH and the chains pass in parts of the band, and the classes that fail do so through zero location or through the absence of the functional equation, not at a step that uses multiplicativity.

## 8. Requirement flags

- R1 (multiplicativity essential): no. Every chain in the table is completely multiplicative, and at theta = 0.55 chains and zeta are indistinguishable. Where they differ (theta >= 0.75) the difference is that zeta's coefficients belong to the reserve log(t/2 pi) (the functional equation), not multiplicativity. Nothing is proved.
- R2 (height-uniform, every window): no. The cells are 40 windows at four heights. The measured pass rates are stable across the heights; that is a measurement.
- R3 (every control fails at a named structural step): no (section 7).
- R4 (reaches the critical line): no. Form D is the Weil functional on a window; its positivity for zeta was read off the verified zeros. Form C, the proposed route from the data band to the full band, fails for zeta.

## 9. Three weakest steps

1. Form C is one formalisation of "completion by the reflected half": linearised first harmonic, frozen phase, atoms only above u, test band exactly Lg. The sibling lane may mean a different object (for example the counting measure of the real zeros of the Riemann-Siegel main sum, which is positive by construction and whose defect against the data is the thing to bound; not run here). The verdict (c) is for the registered formula only.
2. The window space is 96 Fourier modes; passes are statements about that space (K1: 0.4 percent loss of one-pair reach against the full space, in the lattice model only), and 40 windows per height with 24 seeds are samples. The radius of the prime sums is an a-priori bound derived by hand, supported by K3 at 1e6 only; at 1e10 and 1e12 no direct ball sum was made, so signs there are certified relative to that bound. The margins of zeta at theta = 0.85 (0.004 to 0.08 of Lg) are at least 16 times the enclosure tolerance at 1e12.
3. Coverage: theta = 0.95 and 1.0 at 1e12, DH above n = 1e8, backward heat, and Form C for E_a, T-NR, ZQ, DH were not run; the chains use this lane's hash-seeded signs, not the battery arrays; T-NR is fixed at (3, 2.2). The "why" paragraph of section 5 is argued, not proved.

## 10. Units, files

All server work through rhrun; unit names in `units.txt` and `logs/` (68 logs). At most 16 units of this lane at a time (one core each; the first launches used multi-thread units of 6 + 10 + 4 requested cores for a few minutes, with about 1 core obtained); memory at most 2 GB per unit, 3 GB requested once. Units stopped by name: rh-c18tz-e10-1120050525 (replaced by single-thread chunks after it obtained 1.1 cores of 10), rh-c18tz-e12b-0/1 and rh-c18tz-e12c-0..11 (the extension to 2.5e11 at 1e12; CPU share 0.15 core per unit, about 2 hours projected). No unit of this lane is running. One gcc compile was run directly over ssh (seconds). Moments (5.3 GB) remain in `~/rh-push/c18-tz-band-completion-controls-server/` on the server. No local numerical run (no python-flint locally); `aggregate.py` is text processing.
Files: `PREREG.md`, `engine.c`, `tz.py`, `run.py`, `selftest.py`, `zq_zeros.py`, `launch.sh`, `chunks.sh`, `runsplit.sh`, `aggregate.py`, `res_*.jsonl` (44600 cells plus not-run records), `tables.txt`, `zq_*.json`, `logs/`, `lanes.jsonl`.

Proposed map text (addendum to rows Q30 and P45; no new closed route beyond the candidate): "N(theta) on 96 Fourier modes of [0, theta log t], prime side, 1e6 to 1e12, 40 windows: zeta positive with margin 0.22 to 0.26 Lg at theta = 0.55 and 0.012 to 0.025 Lg at 0.85, zero above the Nyquist band; random multiplicative sign chains pass at theta = 0.55 like zeta (98 percent at M = 0) and fail in 94 to 98 percent of cells at theta >= 0.95; ZQ at eta = 0.05 passes to theta = 0.75. The reflected completion n -> t/(2 pi n) (linearised first harmonic) is not a positive extension: zeta fails it in 600 of 600 cells. MEASURED, certified signs. `c18-tz-band-completion-controls-server`."
