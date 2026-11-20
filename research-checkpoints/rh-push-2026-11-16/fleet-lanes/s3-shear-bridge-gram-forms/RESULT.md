# s3-shear-bridge-gram-forms: RESULT

Date 2026-11-20. Kind: screening (compute). Four combinations screened. **Survivors: 0.**
Labels: PROVED / CLASSICAL / MEASURED (float64, or mpmath at the stated number of digits; no interval enclosures) / OPEN.
No statement about the zeros of zeta is made.

## 0. Verdict

| # | combination (nodes) | statistic | sizes reached | zeta | comparison L-functions | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | mu-pass-overflow + endpoint-bridge-mass + degree0-normalized-r | (i) degree-0 overflow share ov0 = max(0, 1 - arcsinh(1)/(aU)); (ii) off-endpoint share off(a, 0.1) of the raw shear mass; (iii) covering share cov(a, 0.05); (iv) A-weighted overflow share | a in [0.01, 20] (80 values on the server, 40 locally), 14 kernels + 13 further characters; scale c = 1..1000 | off: 0.5465 (a <= 0.1) to 0.8280 (a = 20); cov: 0.283 to 0.484 | chi_-3: 0.771..0.985; chi_-4: 0.823..0.995; chi_5: 0.826..0.996; chi_-7: 0.887..0.999; chi_-23: 0.947..1.000; chi_-43, chi_-67, chi_-163: above 1 (signed autocorrelation) | DH 0.854..0.998 (between chi_5 and chi_-7 at every a); E_b 0.733..0.980 (between zeta and chi_-3); T-NR 0.949..1.000 (between chi_29 and chi_-43); heat tau = +0.05, -0.05, -0.2: zeta's curve + 0.0003, - 0.0003, - 0.0013 (to within 0.0001 over the a-grid); Liouville twist 0.371..0.645 | CLOSED. (i) contains no kernel (PROVED from the source formula). (ii)-(iv) are functionals of the one-sided autocorrelation of the kernel; they order the kernels by width (conductor), every control with a functional equation lies inside the range of the L-function class, and heat flow moves zeta's value continuously through it. No threshold exists. Scale invariance holds to 6e-16 |
| 2 | skew-toeplitz-pair-ladder + shear-gram-rank-two + shear-norm-plateau | pair splitting abs(lambda_{2j-1} - lambda_{2j})/lambda_1, j <= 6; ladder residual of -log(lambda_{2j-1}/lambda_1) against C (j^2 - 1); C against the symbol prediction | N = 200..6400 (GPU dense, float64), 12800 and 20000 (CPU band solver), 14 kernels; 40-digit mpmath at N = 200 (8 kernels) and N = 400 (zeta, DH) | splitting <= 6.5e-16 (float64), 3e-40 (40 digits); ladder residual 1.1e-6 at N = 20000; C N^2 = 271.26; C/C_pred = 0.99956 | chi_-3, chi_-4 (N = 20000): splitting <= 7e-16, residual 3e-6, 5e-6; chi_5, chi_-7 (N = 6400): residual 4e-5, 8e-5 | DH, heat (3 values), E_b (2 values), T-NR, Liouville twist: splitting <= 1e-15, residual 2e-8 to 4e-5 at N = 20000, C/C_pred 0.998..0.9997; unimodular twist: spectrum identical to zeta's (unitary equivalence, 3e-15) | CLOSED. Every kernel passes. Pairing is PROVED for every real kernel (real skew-symmetry). The ladder is the edge asymptotics of a banded Hermitian Toeplitz matrix at a nondegenerate maximum of its symbol (CLASSICAL), and the constant is C = pi^2 abs(g''(theta_0))/(M (N+1)^2), MEASURED to 4 digits for all 14 kernels |
| 3 | ka-offdiagonal-hankel-g7 + ka-positivity-residual + scalar-cover-trace-bound | norm and trace of R = G_pass^{-1/2} G_sym G_pass^{-1/2} | degrees 4..200; s = aU in [0.05, 120]; kernel-weighted variant: 14 kernels, a in [0.05, 20] | source object: no kernel in it. Kernel-weighted variant: norm 0.040 (a = 0.05, d = 4) to 103 (a = 20, d = 200); exceeds 1 from d = 16 at a = 0.5 | chi_-3, chi_-4, chi_5, chi_-7: 0.061..0.084 to 90..96; exceed 1 from d = 8 at a = 0.5 | DH, E_b, T-NR: same pattern, exceed 1 from d = 8 (T-NR: d = 4) at a = 0.5; heat: zeta's values to 3 digits | CLOSED, kernel-blind. The object coded in the sources depends on (s, degree) only (PROVED; MEASURED at four (a, U) pairs with s = 3: norm 4.617014 each). With the diagonal core the norm exceeds 1 for zeta itself and grows linearly in the degree; with the full passive Gram it is at most tanh(a U) < 1 for every kernel with nonnegative autocorrelation (PROVED). In neither form does zeta separate from a control |
| 4 | zv-bridge-vs-reference-form-comparison + zv-annulus-boundary-conditions + zv-bridge-pick-congruence | lambda_min of the pencil (K^P, K^S), K^P the ratio-Pick form (congruent to K^b), K^S the Szego form; number of negative eigenvalues of K^P | float64: n = 16..2048 nodes, a = 0.01..0.5, node heights to 1 000 205 (zeta) and 100 256 (chi_-3); mpmath 400 digits: n = 32..128 | no negative value: minimum over all windows -1.6e-14 (roundoff), positive margin up to 0.99 at height 1e6; 400 digits: 0 negative eigenvalues in every valid case | chi_-3, chi_-4: same (roundoff -1.5e-14; margin up to 0.98) | DH: negative from window top 83.9 (zero at 85.70) in float64; at 400 digits two negative eigenvalues of relative size 10^(-6.3) to 10^(-61.2) for window tops 1.7 to 15.7 below the zero; E_b = 0.35, T-NR, heat tau = -2: same pattern; Liouville and unimodular twists: negative at n = 2 (no functional equation) | CLOSED. Verified height in another form. The sign of the pencil minimum does not depend on the reference form (PROVED, Sylvester). The number of negative eigenvalues is the number of off-line zeros with beta > 1/2 + a that the node set resolves; resolution from a distance d below the zero costs about 3.9 d decimal digits (DH). The Euler-product control E_b fails like DH; E_b = 0.2 at a = 0.25 passes, as it must |

Known pattern to beat: not beaten. Combinations 1, 2, 3 never see a zero or a prime. Combination 4 separates a control exactly when the node set resolves its off-line zeros (directly, or by analytic continuation at an exponential cost in digits), or at once for controls without a functional equation.

## 1. Objects, code, validation of the shared kernels

Convention x = e^{4u}; Xi_F(w) = int_R Phi_F(u) e^{iwu} du. Kernels (`glib.py`, float64; formulas of `s1-kernel-shear-norms/klib.py`):

| key | kernel | role |
|---|---|---|
| zeta | canonical Phi(u) = sum (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}) | target |
| zeta_repo | kernel as typed in the repo sources (prefactors e^{4u}, e^{2u}) | replay of source numbers only |
| chi-3, chi-4, chi5, chi-7 | 4 e^{(1+2 delta)u} sum chi(n) n^delta exp(-pi n^2 e^{4u}/q) | positive comparison |
| DH | same with b = (1, kappa, -kappa, -1, 0) mod 5 | control |
| heat+0.05, heat-0.05, heat-0.2 | e^{tau u^2} Phi | control (tau < 0) |
| E_b=0.2, E_b=0.35 | (Phi e^{2bu}) * (Phi e^{-2bu}), kernel of xi(s+b) xi(s-b) | control |
| T-NR(3,2.2) | Phi(u + l/2) + Phi(u - l/2) + c Phi(u), l = log 3, c = 2.2 | control |
| liouville | 4 e^u sum lambda(n) exp(-pi n^2 e^{4u}), u >= 0 | sign-twisted primes |
| unimodular twist | Phi(u) e^{2iu} (zeta(s + i)) | combination 2 and 4 only (complex kernel) |

Checks (`glib.py` self-test): Phi(0) = 0.446696900467; int Phi_b = (int Phi e^{2bu})^2 to 4.6e-13 relative, and int Phi e^{2bu} = xi(1/2 + b)/4 to 13 digits; T-NR kernel transform = xi-transform times (2 cos(w l/2) + c) to 16 digits; DH Fourier identity at t = 3.7 to 12 digits. All 14 real kernels are nonnegative on [0, 3]. The convolution kernel is evaluated through a degree-512 Chebyshev interpolant of its logarithm (relative error 3e-11).

Files: `glib.py`; `c1.py`, `c1_check.py`, `c1_more.py`; `c2.py`, `c2b.py`, `c2_mp.py`; `c3.py`; `c4.py`; `summarise.py`; `run_*.sh` (server launch scripts); `out/` (local outputs, `out/summary.txt` = all tables); `out_server/` (server outputs: `c1.json`, `c2.json`, `c2b_*.json`, `c3.json`, `c4_A.json`, `c4_B.json`, `c4_B400.json`, `c4_Bscan.json`, `c4_heat.json`); `server_logs/`.

Compute: local runs through `scripts/memcap.sh 8`. Server: units `rh-s3-*` through `rhrun`, 1 to 5 cores each with 8 cores as the target for the lane (for about ten minutes the summed core quotas of the running units were 10), memory limits 4 to 12 GB per unit with actual use below 4 GB in total; GPU 1 for the dense eigensolves up to N = 6400. The server load average was about 165 on 48 cores during the runs, which set the wall times. The dense run at N = 12800 was refused by the GPU (card nearly full with other jobs: 7 GB free), so N = 12800 and N = 20000 were done on CPU with a band solver, which agrees with the GPU values at N = 3200 and 6400 to all printed digits. All units stopped.

## 2. Combination 1: degree-0 overflow share and endpoint mass

**Definitions from the sources.** `imp-mu-pass-overflow-quantification.js`: nu(tau) = sinh(a tau), mu_diag(tau) = 1 on the lag range [0, U]; the degree-0 overflow share is the fraction of [0, U] with sinh(a tau) > 1, that is ov0 = max(0, 1 - arcsinh(1)/(aU)). `imp-endpoint-bridge-mass.js`: shear density w(u, v) = Phi(u) Phi(v) sinh(a(v - u)) on 0 <= u <= v; off(a, eps) = share of the mass with v - u >= eps; cov(a, delta) = share of the covering mass with both endpoints at distance >= delta from the covered point. With A(g) = int_0^inf Phi(u) Phi(u + g) du: off = int_eps^inf A sinh(a g) dg / int_0^inf A sinh(a g) dg, cov = int_{2 delta}^inf (g - 2 delta) A sinh / int g A sinh.

**Finite consequence tested.** A threshold that the curves a -> statistic of zeta and of Dirichlet L-functions stay under for all a in [0.01, 20] and that a control crosses. Survival would need such a threshold for every control, not explained by kernel width.

**Result (i), PROVED.** ov0 contains no kernel: it is a function of s = aU. At the source cell (a, U) = (0.5, 6) it is 0.7062. The value 0.64 quoted in the node corresponds to s = 2.448 and is not produced by any formula in the cited modules (the module says it brackets it). Nothing to compare between kernels.

**Validation.** Replay of the source table with the kernel as typed there (`c1_check.py`): off(a, 0.1) = 0.4487, 0.4489, 0.4495, 0.4521, 0.4698, 0.5313 at a = 0.1, 0.5, 1, 2, 5, 10 against the source's 0.4528, 0.4530, 0.4537, 0.4562, 0.4740, 0.5353; cov(a, 0.05) = 0.2304..0.2872 against 0.2310..0.2879. The source states 2 significant figures for off (plain grid sum with a sharp window, 4000 points per axis); the present values use Gauss-Legendre panels split at the window edge. The 45% and 54% of the node belong to the kernel as typed in the sources; the canonical Phi gives 54.6% and 82.8% (a = 20).

**Results (ii)-(iv), MEASURED** (`out_server/c1.json`, 80 values of a; a local run with 40 values, `out/c1_local.json`, agrees; `out/c1_more.txt`). off(a, 0.1):

| kernel | support lag U_F | a = 0.01 | a = 1.013 | a = 5.20 | a = 10.20 | a = 20 | cov(a, 0.05), min..max |
|---|---|---|---|---|---|---|---|
| zeta | 0.596 | 0.5465 | 0.5474 | 0.5719 | 0.6395 | 0.8280 | 0.283..0.484 |
| chi_-3 | 0.824 | 0.7714 | 0.7728 | 0.8057 | 0.8809 | 0.9847 | 0.482..0.725 |
| chi_-4 | 0.893 | 0.8233 | 0.8247 | 0.8578 | 0.9259 | 0.9946 | 0.538..0.768 |
| chi_5 | 0.933 | 0.8264 | 0.8279 | 0.8622 | 0.9316 | 0.9961 | 0.548..0.784 |
| chi_-7 | 1.028 | 0.8870 | 0.8884 | 0.9207 | 0.9722 | 0.9994 | 0.625..0.824 |
| DH | 0.946 | 0.8542 | 0.8557 | 0.8884 | 0.9497 | 0.9977 | 0.576..0.794 |
| heat +0.05 | 0.596 | 0.5468 | 0.5477 | 0.5723 | 0.6398 | 0.8284 | 0.283..0.484 |
| heat -0.05 | 0.596 | 0.5461 | 0.5471 | 0.5716 | 0.6391 | 0.8277 | 0.282..0.484 |
| heat -0.2 | 0.596 | 0.5452 | 0.5462 | 0.5707 | 0.6381 | 0.8268 | 0.282..0.483 |
| E_b = 0.2 | 0.930 | 0.7327 | 0.7341 | 0.7681 | 0.8503 | 0.9796 | 0.453..0.730 |
| E_b = 0.35 | 0.930 | 0.7326 | 0.7340 | 0.7680 | 0.8502 | 0.9796 | 0.453..0.730 |
| T-NR(3, 2.2) | 1.137 | 0.9491 | 0.9509 | 0.9794 | 0.9974 | 1.0000 | 0.777..0.860 |
| Liouville twist | 0.561 | 0.3705 | 0.3712 | 0.3904 | 0.4467 | 0.6448 | 0.190..0.370 |
| zeta, kernel as typed in the sources | 0.577 | 0.4487 | 0.4495 | 0.4715 | 0.5344 | 0.7357 | 0.230..0.423 |

Checked on the full grid of 80 values of a (server run): DH lies between chi_5 and chi_-7 at every a; E_b between zeta and chi_-3 at every a; T-NR above chi_-7 at every a; the Liouville twist below zeta at every a; heat tau = +0.05, -0.05, -0.2 differ from zeta by +0.00031..+0.00035, -0.00035..-0.00031, -0.0014..-0.0012.

Further real primitive characters, off at a = 0.01, 1, 5, 20 (`c1_more.py`): chi_8 0.878, 0.880, 0.911, 0.999; chi_-11 0.918, 0.919, 0.946, 1.000; chi_13 0.919, 0.920, 0.948, 1.000; chi_29 0.940, 0.941, 0.968, 1.000; chi_-23 0.947, 0.949, 0.975, 1.000; chi_-19 0.807, 0.804, 0.457, 1.000 (autocorrelation changes sign, min/max = -0.06); chi_-43 1.084, 1.076, 1.014, 1.000; chi_-67 1.050, 1.045, 1.007, 1.000; chi_-163 1.030, 1.026, 1.002, 1.000 (signed autocorrelation; the share exceeds 1).

A-weighted overflow share (mass of A beyond arcsinh(1)/a) at a = 1.013, 5.20, 10.20, 20: zeta 4e-43, 0.065, 0.325, 0.599; DH 1e-10, 0.343, 0.618, 0.794; chi_-7 3e-8, 0.408, 0.663, 0.819; same ordering as off.

Scale invariance Phi -> c Phi, c = 3, 10, 100, 1000: largest change of off over the whole a-grid 4.4e-16 (zeta), 5.6e-16 (DH).

**Why it is closed.**
- Every statistic is a ratio of two integrals of the same function A(g) (degree 2 in Phi; hence the exact scale invariance). It reads the width of the kernel against the fixed window 0.1: the values increase with the support lag U_F, which for Dirichlet-type kernels is set by the conductor (shift of the kernel by (log q)/4).
- At every a, DH (conductor 5) lies between chi_5 and chi_-7; E_b between zeta and chi_-3; T-NR between chi_29 and chi_-43. A threshold that zeta and the L-functions stay under does not exist: the L-function class itself fills the range from 0.5465 to above 1.
- The only controls outside the range of the tested L-functions are the Liouville twist (below zeta: its kernel is narrower, n = 1 theta term with a negative n = 2 term) and heat with tau < 0 (below zeta by 0.0003 to 0.0014). Heat moves the value continuously through zeta's (tau = +0.05 is above by 0.0003), so zeta's own curve is not a threshold with any margin.
- No zero and no prime enters: the Liouville and zeta kernels differ only by the signs of the n >= 2 theta terms.

## 3. Combination 2: skew-Toeplitz shear sections

**Definition (source assembly, `scripts/imp-3668-dense-fifth-pair-offline.mjs`).** u_i = (i + 1/2) H0, H0 = 0.025, U = N H0; R_k = H0 sum_i Phi(u_i) Phi(u_{i+k}); T_ij = a (u_j - u_i) R_{|j-i|} H0, a = 1; S = T^T T. T is real, skew-symmetric, Toeplitz, and banded (R_k = 0 beyond the kernel width: 53 to 87 lags for the kernels here).

**Finite consequence tested.** Exact pairing lambda_{2j-1} = lambda_{2j} and the ladder -log(lambda_{2j-1}/lambda_1) = C (j^2 - 1), C ~ N^-2, are properties of the zeta kernel; a control would show a splitting above the roundoff floor or another ladder. Survival would need this for all controls.

**PROVED (pairing for every real kernel).** T real and T^T = -T: if T x = i sigma x then T conj(x) = -i sigma conj(x), and x, conj(x) are orthogonal eigenvectors of S = -T^2 with the same eigenvalue sigma^2. Every nonzero eigenvalue of S has even multiplicity. No property of Phi is used.

**PROVED (unimodular twist).** For the kernel Phi(u) e^{2iu} the matrix is D* T D with D = diag(e^{2 i u_j}) unitary; the spectrum of S is unchanged.

**CLASSICAL (ladder for every kernel with a nondegenerate symbol maximum).** iT is a Hermitian banded Toeplitz matrix with symbol g(theta) = -2 sum_{m>0} t_m sin(m theta), t_m = a m H0^2 R_m, odd in theta. If abs(g) has a unique nondegenerate maximum M at theta_0 in (0, pi), the j-th largest eigenvalue of the section is M - (abs(g''(theta_0))/2)(j pi/(N+1))^2 + o(N^-2) (Toeplitz edge asymptotics), the j-th smallest is its negative, and so -log(lambda_{2j-1}/lambda_1) = C (j^2 - 1) + o(N^-2) with C_pred = pi^2 abs(g''(theta_0))/(M (N+1)^2). The "Dirichlet-Laplacian ladder doubled by skew-symmetry" of the node is this statement; the hypothesis the node calls "selected by measured ratios, not derived" is the nondegenerate maximum of the symbol.

**Validation.** Source value -log(lambda_3/lambda_1) = 0.0009625430796462755 at N = 800 (kernel as typed there): here 0.0009625430796359. GPU dense and CPU band solvers agree at N = 3200 and 6400 (zeta: C N^2 = 270.511289 and 270.958453 from both). 40-digit mpmath eigenvalues of iT (`c2_mp.py`): N = 200: splitting 2e-41 to 5e-40 for zeta, the repo-typed kernel, chi_-3, DH, T-NR, E_b = 0.35, Liouville, heat -0.2, and C N^2 equal to the float64 values to the 9 digits printed (zeta 257.952191, DH 943.898522, E_b 518.621334); N = 400: zeta 3.0e-40, C N^2 = 264.4518052; DH 2.5e-40, 985.5848404.

**Results (MEASURED; `out_server/c2.json`, `c2b_*.json`).**

| kernel | theta_0 | band (lags) | largest N | max splitting over all N | C N^2 at largest N | C/C_pred at N = 800, 6400, largest | ladder residual at largest N | L3/L2, L4/L2, L5/L2, L6/L2 at largest N |
|---|---|---|---|---|---|---|---|---|
| zeta | 0.2693 | 53 | 20000 | 6.5e-16 | 271.2637 | 0.98942, 0.99864, 0.99956 | 1.1e-6 | 2.66667, 5.00000, 8.00001, 11.66668 |
| zeta, kernel as typed in the sources | 0.3028 | 53 | 20000 | 5.9e-16 | 207.6625 | 0.99083, 0.99884, 0.99963 | 4.1e-7 | 2.66667, 5.00000, 8.00000, 11.66667 |
| chi_-3 | 0.1755 | 64 | 20000 | 6.0e-16 | 649.3256 | 0.98268, 0.99779, 0.99930 | 3.1e-6 | 2.66667, 5.00001, 8.00002, 11.66670 |
| chi_-4 | 0.1543 | 67 | 20000 | 7.1e-16 | 850.3293 | 0.98007, 0.99743, 0.99918 | 4.6e-6 | 2.66667, 5.00001, 8.00002, 11.66672 |
| chi_5 | 0.1500 | 69 | 6400 | 3.5e-16 | 890.2889 | 0.97940, 0.99733 | 4.3e-5 | 2.66668, 5.00008, 8.00022, 11.66717 |
| chi_-7 | 0.1231 | 72 | 6400 | 8.2e-16 | 1354.5665 | 0.97475, 0.99672 | 8.3e-5 | 2.66670, 5.00016, 8.00043, 11.66763 |
| DH | 0.1405 | 69 | 20000 | 5.6e-16 | 1033.1459 | 0.97798, 0.99713, 0.99907 | 6.0e-6 | 2.66667, 5.00001, 8.00003, 11.66674 |
| heat +0.05 | 0.2692 | 53 | 20000 | 4.8e-16 | 271.5229 | 0.98943, 0.99866, 0.99958 | 1.1e-6 | 2.66667, 5.00000, 8.00001, 11.66668 |
| heat -0.05 | 0.2695 | 53 | 20000 | 6.5e-16 | 271.0048 | 0.98944, 0.99866, 0.99957 | 1.1e-6 | 2.66667, 5.00000, 8.00001, 11.66668 |
| heat -0.2 | 0.2698 | 53 | 20000 | 4.9e-16 | 270.2308 | 0.98946, 0.99866, 0.99957 | 1.1e-6 | 2.66667, 5.00000, 8.00001, 11.66668 |
| E_b = 0.2 | 0.1865 | 87 | 20000 | 8.3e-16 | 557.2765 | 0.98384, 0.99794, 0.99934 | 1.8e-6 | 2.66667, 5.00000, 8.00001, 11.66669 |
| E_b = 0.35 | 0.1866 | 87 | 20000 | 9.7e-16 | 557.0882 | 0.98386, 0.99796, 0.99936 | 1.8e-6 | 2.66667, 5.00000, 8.00001, 11.66669 |
| T-NR(3, 2.2) | 0.0774 | 75 | 20000 | 1.0e-15 | 3812.3915 | 0.96174, 0.99465, 0.99827 | 4.3e-5 | 2.66668, 5.00008, 8.00022, 11.66716 |
| Liouville twist | 0.3345 | 53 | 20000 | 7.3e-16 | 165.0824 | 0.99195, 0.99899, 0.99968 | 2.4e-8 | 2.66667, 5.00000, 8.00000, 11.66667 |

Exact ladder ratios: 8/3, 5, 8, 35/3. "Ladder residual" = max over j = 3..6 of abs(L_j/(C (j^2 - 1)) - 1), L_j = -log(lambda_{2j-1}/lambda_1), C = L_2/3. Unimodular twist at N = 400: largest relative change of the top 12 eigenvalues against zeta 2.7e-15.

**Reading.**
- The splitting is at the few-ULP floor for every kernel and vanishes at 40 digits: the pairing is the skew-symmetry and nothing else.
- The ladder holds for every kernel with the same exact ratios, and the measured constant converges to the symbol prediction (1 - C/C_pred falls like 1/N; zeta: 2.1e-2 at N = 400, 1.4e-3 at N = 6400, 4.4e-4 at N = 20000). C differs between kernels (165 to 3812) because the symbol differs; it is two numbers of the kernel's autocorrelation (abs(g'') and M at theta_0).
- T-NR converges more slowly (residual 0.23 at N = 200, 4e-5 at N = 20000): its symbol has a second local maximum at 0.40 of the global one and a larger curvature. A control built to have two equal symbol maxima would show a different ladder; that would be a statement about its autocorrelation, not about zeros.
- The node "shear-gram-rank-two" (antisymmetric two-point Gram p q^T - q p^T, rank 2 for every kernel) and "shear-norm-plateau" (norm^2 = |p|^2 |q|^2 - <p,q>^2, a function of Phi^2 moments; closed in `s1-kernel-shear-norms` combination 1) add no kernel-specific input.

## 4. Combination 3: passive-normalised endpoint-Hankel norm

**Definition from the sources (`imp-33685`, `imp-33705`).** Basis phi_j(tau) = (tau/U)^j, j = 0..d; G_sym,jk = int_0^U sinh(a tau) phi_j phi_k dtau; G_pass = diag(int_0^U cosh(a tau) phi_j^2 dtau); R = G_pass^{-1/2} G_sym G_pass^{-1/2}. The sources call this the "representative truncation" and state that it is not the section-26 Gram; no kernel enters it.

**Finite consequence tested.** norm(R) <= 1 for zeta and L(chi) at every degree and a, norm(R) > 1 for a control at an a larger than its zero displacement requires. Survival would need a kernel-dependent norm that stays at most 1 for zeta.

**PROVED (kernel-blind).** With x = tau/U both Gram matrices are U times integrals over [0, 1] of sinh(s x), cosh(s x) against x^{j+k}, s = aU; U cancels in R. R depends on (s, d) only. MEASURED: (a, U) = (0.5, 6), (1, 3), (3, 1), (0.1, 30) all give norm 4.617014, trace 4.848499, off-diagonal Frobenius norm 4.081529, largest diagonal entry 0.990918 at d = 4 (source: 4.617, 4.85, 4.082).

**MEASURED (source object, `out_server/c3.json`).** norm(R), diagonal core:

| s = aU | d = 4 | 8 | 16 | 32 | 64 | 100 | 150 | 200 | full core, d = 200 |
|---|---|---|---|---|---|---|---|---|---|
| 0.05 | 0.182 | 0.352 | 0.697 | 1.392 | 2.787 | 4.357 | 6.538 | 8.719 | 0.049957 |
| 0.1 | 0.363 | 0.702 | 1.390 | 2.778 | 5.560 | 8.692 | 13.043 | 17.395 | 0.099664 |
| 0.3 | 1.071 | 2.063 | 4.079 | 8.137 | 16.271 | 25.427 | 38.146 | 50.866 | 0.291303 |
| 0.6 | 2.027 | 3.873 | 7.606 | 15.102 | 30.109 | 46.995 | 70.447 | 93.899 | 0.537034 |
| 1.2 | 3.385 | 6.312 | 12.170 | 23.862 | 47.202 | 73.436 | 109.857 | 146.270 | 0.833642 |
| 3 | 4.617 | 8.237 | 15.363 | 29.445 | 57.409 | 88.775 | 132.286 | 175.772 | 0.995054 |
| 6 | 4.862 | 8.612 | 15.938 | 30.287 | 58.585 | 90.214 | 134.023 | 177.774 | 0.999988 |
| 12 | 4.952 | 8.823 | 16.387 | 31.109 | 59.858 | 91.775 | 135.820 | 179.716 | 1.000000 |
| 30 | 4.990 | 8.954 | 16.789 | 32.129 | 61.947 | 94.741 | 139.629 | 184.113 | 1.000000 |
| 120 | 4.999 | 8.996 | 16.977 | 32.866 | 64.290 | 99.095 | 146.642 | 193.484 | 1.000000 |

The norm grows linearly in the degree at fixed s (0.87 (d + 1) at s = 3, d = 200) and tends to d + 1 as s grows: the normalised monomials become parallel. The trace bound of the node (norm <= trace = sum of the diagonal ratios) is within 14% of the norm at every cell. "Full core" = largest generalised eigenvalue of (G_sym, cosh-Gram): PROVED at most sup tanh(s x) = tanh(s) < 1 on any subspace, because sinh <= tanh(s) cosh pointwise; the measured values approach tanh(s) from below (0.049957 against 0.049958 at s = 0.05; 0.995054 against 0.995055 at s = 3).

**Kernel-weighted variant (the only way a kernel can enter).** Lag weight A_F(tau) = autocorrelation of the kernel: G_sym,jk = int sinh(a tau) A_F(tau) tau^{j+k} dtau, diagonal core int cosh(a tau) A_F tau^{2j}. MEASURED norm at d = 4, 16, 64, 200:

| kernel | a = 0.05 | a = 0.5 | a = 2 | a = 20 | full core d = 200 (a = 0.5, 2, 20) | first d with norm > 1 at a = 0.05, 0.5, 2, 20 |
|---|---|---|---|---|---|---|
| zeta | 0.040, 0.204, 0.941, 3.826 | 0.402, 2.012, 9.137, 36.455 | 1.517, 6.881, 26.089, 90.115 | 4.314, 12.049, 32.876, 103.426 | 0.376, 0.918, 1.000 | 100, 16, 4, 4 |
| chi_-3 | 0.061, 0.295, 1.301, 4.541 | 0.601, 2.881, 12.369, 41.928 | 2.139, 8.785, 30.349, 86.977 | 4.589, 12.962, 35.259, 95.709 | 0.476, 0.969, 1.000 | 64, 8, 4, 4 |
| chi_-4 | 0.068, 0.325, 1.410, 4.703 | 0.675, 3.162, 13.316, 42.997 | 2.343, 9.297, 31.360, 85.453 | 4.658, 13.258, 35.986, 93.404 | 0.503, 0.976, 1.000 | 64, 8, 4, 4 |
| chi_5 | 0.071, 0.340, 1.481, 4.880 | 0.698, 3.301, 13.917, 44.306 | 2.399, 9.487, 31.842, 85.557 | 4.671, 13.336, 36.300, 93.229 | 0.520, 0.980, 1.000 | 64, 8, 4, 4 |
| chi_-7 | 0.084, 0.387, 1.631, 5.062 | 0.826, 3.734, 15.193, 45.379 | 2.721, 10.191, 33.098, 83.649 | 4.755, 13.787, 37.379, 90.374 | 0.553, 0.986, 1.000 | 64, 8, 4, 4 |
| DH | 0.074, 0.349, 1.497, 4.838 | 0.734, 3.386, 14.060, 43.893 | 2.497, 9.668, 32.087, 84.553 | 4.701, 13.476, 36.544, 91.981 | 0.523, 0.981, 1.000 | 64, 8, 4, 4 |
| heat +0.05 / -0.05 / -0.2 | 0.040, 0.204 (0.203 at -0.2), 0.941, 3.83 | 0.402, 2.01, 9.14, 36.4 | 1.52, 6.88, 26.1, 90.1 | 4.31, 12.05, 32.9, 103.4 | 0.375, 0.918, 1.000 | 100, 16, 4, 4 |
| E_b = 0.2 / 0.35 | 0.059, 0.308, 1.483, 6.664 | 0.586, 2.996, 13.725, 59.01 | 2.080, 8.709, 29.104, 104.30 | 4.50, 12.33, 32.56, 114.19 | 0.565, 0.988, 1.000 | 64, 8, 4, 4 |
| T-NR(3, 2.2) | 0.121, 0.474, 1.805, 5.173 | 1.182, 4.537, 16.668, 45.896 | 3.518, 11.611, 34.816, 81.699 | 4.863, 14.510, 38.976, 86.935 | 0.582, 0.990, 1.000 | 64, 4, 4, 4 |
| Liouville twist | 0.034, 0.189, 0.913, 3.912 | 0.344, 1.866, 8.866, 37.352 | 1.312, 6.450, 25.480, 93.644 | 4.095, 11.638, 32.301, 107.980 | 0.366, 0.912, 1.000 | 100, 16, 4, 4 |

**Why it is closed.**
- The statement "norm <= 1 for the genuine Phi" is false for zeta in the diagonal-core form (4.617 at the source cell; 2.01 at a = 0.5, d = 16 in the weighted variant) and true for every kernel with A_F >= 0 in the full-core form (PROVED: G_sym <= tanh(a U_F) G_pass as quadratic forms). Neither form has zeta on one side and a control on the other.
- In the weighted variant the values follow the kernel width (same ordering as combination 1); DH lies between chi_-4 and chi_-7 at every (a, d) in the table (at d = 200 and a >= 2 the ordering in width is reversed for all kernels alike).
- "Residual deficit 0" and "diagonals pinned below 1" hold for every kernel (R_jj = ratio of a sinh-moment to the cosh-moment of the same nonnegative weight).

## 5. Combination 4: bridge form against a positive reference form

**Definitions.** G(z) = F(1/2 + z) completed; U = G(u + a), V = G(u - a), R = V/U. K^b_ij = (U_i conj U_j - V_i conj V_j)/(2 pi (u_i + conj u_j)); K^P_ij = (1 - R_i conj R_j)/(u_i + conj u_j); K^b = D K^P D*, D = diag(U_i)/sqrt(2 pi) (the node zv-bridge-pick-congruence). Reference: Szego form K^S_ij = 1/(u_i + conj u_j), the Pick form of the fixed inner function 0. Nodes: u = delta + i t and its conjugate (orbits of the reflection R of the Klein group). The other generator D: u -> -u sends the node set to Re u < 0 and, when G(-z) = +-G(z), sends R to 1/R and K^P to a congruent copy of itself; it adds no condition. Functions: zeta (xi), chi_-3, chi_-4 (completed), DH (completed), E_b = xi(s + b) xi(s - b), T-NR, heat (transform of e^{tau u^2} Phi by quadrature), Liouville twist zeta(2s)/zeta(s) and unimodular twist zeta(s + i), both with zeta's gamma factor.

**Finite consequence tested.** lambda_min(K^P, K^S) >= 0 for zeta and L(chi) on every node set; negative for a control on node sets whose heights lie below its first off-line zero. Survival would need the failure at heights far below the zero for a reason other than analytic continuation, for every control.

**PROVED (the reference does not matter).** For positive definite K^ref the pencil (K^b, K^ref) has a negative eigenvalue iff K^b has one (Sylvester). The annulus Dirichlet form with the Klein boundary conditions, the Szego form and the Pick form of any inner function give the same verdict on every node set; only the size of lambda_min changes. With the Szego reference, lambda_min = 1 - (norm of the adjoint of multiplication by R restricted to the span of the Szego kernels of the nodes)^2.

**CLASSICAL.** K^P >= 0 on all node sets iff R is a Schur function in Re u > 0 iff G has no zero with real part above a (for these functions, where abs(R) = 1 on the imaginary axis). If R has kappa poles in Re u > 0 (kappa off-line zeros with beta > 1/2 + a, counted with conjugates), K^P has at most kappa negative eigenvalues and exactly kappa on sufficiently rich node sets (Krein-Langer). When R is inner (for zeta: unconditional at a = 1/2; for smaller a it is the statement that no zero has beta > 1/2 + a), K^P is the Gram matrix of the projections of the Szego kernels onto the model space of R, and its numerical rank is the number of zeros of R that the node set resolves. ARGUED, in agreement with the measurements: lambda_min is at roundoff whenever the node set has more nodes per unit height than zeta has zeros (all runs at delta = 0.1; delta = 0.5 at heights below 1124), and positive (0.03 to 0.99) when it has fewer (delta = 0.5 at heights 1e4 and above, where the zero density (1/2 pi) log(t/2 pi) exceeds 1).

**Validation (`c4.py check`).** abs(G(z)/G(-z)) = 1.000000000000 at z = 0.3 + 7.7i for zeta, chi_-3, chi_-4, DH, E_b, T-NR; 0.9106 for the Liouville twist and 1.3719 for the unimodular twist (no functional equation). DH vanishes at 0.8085171825 + 85.6993484854i (6e-11). Heat tau = -2 vanishes at z = 0.2485774 + 49.7154476i (3.5e-23 against 5e-15 one unit away); heat tau = 0 equals xi/4 to 15 digits. A Blaschke product with zeros at 0.3 +- 5i gives pencil minimum -6e-15 and maximum 0.998; its inverse gives -469. E_b = 0.2 at a = 0.25 (no zero beyond a) passes on every window; at a <= 0.1 it fails.

**Test A (float64 screen, MEASURED; `out_server/c4_A.json`, `c4_heat.json`).** Heights t_k = T0 + (k + 1/2) h, growing prefixes. Values of R from flint/mpmath at 30 digits (60 for heat); eigenvalues in float64; condition number of K^S at most 530 (2.3e5 for T-NR). A value is counted negative when below -1e-9; the roundoff level is 1e-14.

zeta and comparison L-functions: no negative value in any of the 63 configurations.

| function | a | delta, h | T0 | largest n, top height | minimum of lambda_min over prefixes |
|---|---|---|---|---|---|
| zeta | 0.01, 0.05, 0.25, 0.5 | 0.1, 0.2 | 0, 1e2, 1e4, 1e6 | 2048; 204.7, 304.7, 10 204.7, 1 000 204.7 | -2.8e-15 to -1.6e-14 (roundoff) |
| zeta | 0.05, 0.25, 0.5 | 0.5, 1.0 | 0, 1e2 | 2048; 1023.5, 1123.5 | -3.8e-15 to -1.2e-14 (roundoff) |
| zeta | 0.05, 0.25, 0.5 | 0.5, 1.0 | 1e4, 1e6 | 2048; 11 023.5, 1 001 023.5 | +0.031, +0.246 (a = 0.05); +0.230, +0.840 (a = 0.25); +0.576, +0.988 (a = 0.5) |
| chi_-3 | 0.01, 0.05, 0.25, 0.5 | 0.1, 0.2 | 0, 1e2, 1e4 (n = 2048), 1e5 (n = 512) | 204.7 .. 100 051.1 | -2.2e-15 to -1.5e-14 (roundoff) |
| chi_-3 | 0.05, 0.25, 0.5 | 0.5, 1.0 | 0, 1e2 | 2048; 1023.5, 1123.5 | -2.8e-15 to -1.3e-14 (roundoff) |
| chi_-3 | 0.05, 0.25, 0.5 | 0.5, 1.0 | 1e4 (n = 2048), 1e5 (n = 512) | 11 023.5; 100 255.5 | +0.104, +0.229; +0.535, +0.816; +0.863, +0.977 |
| chi_-4 | 0.01 (delta = 0.1 only), 0.05, 0.25, 0.5 | 0.1, 0.2 and 0.5, 1.0 | 0 | 2048; 204.7, 1023.5 | -2.7e-15 to -1.5e-14 (roundoff) |

Controls (delta = 0.1, h = 0.2 from height 0; T-NR delta = h = 0.05):

| control | first off-line zero | a | first prefix with lambda_min < -1e-9 | prefix before it | lambda_min at the largest window |
|---|---|---|---|---|---|
| DH | 0.8085 + 85.699i | 0.01, 0.05, 0.1, 0.25 | top 83.9: -2.5e-6, -1.1e-5, -1.5e-5, -2.0e-6 | top 81.9: -1.9e-11, -8.2e-11, -1.0e-10, -4.7e-12 | top 139.9: -2.4, -20.8, -56.7, -44.6 |
| E_b = 0.35 | 0.85 + 14.135i (every zero is off the line) | 0.01, 0.05, 0.1, 0.25 | top 9.9, 8.9, 8.9, 8.9: -1.3e-8, -2.4e-9, -4.3e-9, -4.0e-9 | one unit lower: -2e-10 to -5e-10 | top 29.9: -0.90, -11.6, -43.9, -247 |
| E_b = 0.2 | 0.70 + 14.135i | 0.01, 0.05, 0.1 | top 9.9: -1.0e-9, -4.6e-9, -6.4e-9 | top 8.9: -8e-11 to -4e-10 | -2.1, -39.8, -122 |
| E_b = 0.2 | no zero with beta > 1/2 + a | 0.25 | none | | -7e-15 (passes) |
| T-NR(3, 2.2) | 0.904 + 2.8596i | 0.01, 0.05, 0.1, 0.25 | top 0.38: -3.0e-9, -1.5e-8, -2.7e-8, -3.8e-8 | top 0.18: -2e-11 to -2e-10 | top 6.0: -114, -2.9e3, -1.2e4, -8.9e4 |
| heat tau = -2 | 0.7486 + 49.715i | 0.05, 0.2 | top 45.9: -2.8e-8, -9.3e-9 | top 43.9: -2.1e-10, -3.5e-11 | top 63.9: -23.7, -40.0 |
| heat tau = -0.2 | none below height 64 (first off-line zero near height 334 in `s1-kernel-shear-norms`) | 0.05, 0.2 | none | | top 63.9: -5.3e-15, -1.1e-14 (passes) |
| heat tau = +0.05 | none (forward flow) | 0.05, 0.2 | none | | top 63.9: -4.4e-15, -8.4e-15 (passes) |
| Liouville twist | no functional equation | 0.01, 0.05, 0.1, 0.25 | n = 2 (one orbit at height 0.1): -0.74, -13.9, -129, -1.9e3 | | |
| unimodular twist | no functional equation | 0.01, 0.05, 0.1, 0.25 | n = 2: -0.065, -0.37, -0.89, -4.6 | | |

**Test B (mpmath, 400 digits, MEASURED; `out_server/c4_Bscan.json`, `c4_B400.json`; the 150-digit run `c4_B.json` agrees on every case where its smallest eigenvalue is above its working precision).** Dense equispaced heights in a window strictly below the first off-line zero; a = 0.05; eigenvalues of K^P. A count is reported only when the smallest abs(eigenvalue)/largest is at least 1e-375.

DH (zero at height 85.699), windows of length 24, delta = 0.1:

| window | top below the zero by | n = 32 | n = 64 | n = 128: negative eigenvalues, lambda_min/lambda_max |
|---|---|---|---|---|
| [60, 84] | 1.7 | 0 | 2, -3.6e-8 | 2, -4.8e-7 |
| [58, 82] | 3.7 | 0 | 2, -6.4e-17 | 2, -2.4e-13 |
| [56, 80] | 5.7 | 0 | 0 | 2, -4.1e-20 |
| [53, 77] | 8.7 | 0 | 0 | 2, -1.3e-31 |
| [50, 74] | 11.7 | 0 | 0 | 2, -4.0e-44 |
| [46, 70] | 15.7 | 0 | 0 | 2, -6.7e-62 |
| [1, 60] | 25.7 | 0 | 0 | 0 (smallest eigenvalue +8.7e-121) |

log10 of the relative size at n = 128: -6.3, -12.6, -19.4, -30.9, -43.4, -61.2 at distances 1.7, 3.7, 5.7, 8.7, 11.7, 15.7: about 3.9 decimal digits per unit of height.

E_b = 0.35 (zeros at heights 14.13, 21.02, 25.01, ...), windows [1, T], delta = 0.1: n = 32: 8 negative eigenvalues; n = 64: 18; n = 128: 36 (T = 13, 11, 9, 7; for T <= 5 the smallest eigenvalue at n = 128 is below the working precision and no count is reported). lambda_min/lambda_max at n = 64: -5.0e-4 (T = 13), -1.1e-6 (11), -4.7e-9 (9), -4.7e-11 (7), -2.9e-13 (5), -2.0e-16 (3).
T-NR (zeros at heights 2.86, 8.58, ...), windows [0.05, T], delta = 0.05: n = 32: 8 negative eigenvalues; n = 64: 14; lambda_min/lambda_max at n = 64: -0.109 (window [0.1, 2.6]), -2.6e-3 (2.0), -7.5e-5 (1.5), -3.8e-6 (1.0), -4.7e-8 (0.5).
zeta: 0 negative eigenvalues on [60, 84] (n = 32, 64, 128; smallest eigenvalue 1.5e-10, 3.2e-41, 1.2e-142), [1, 13] (n = 64, 128; 5.8e-151, 3.5e-350), [1, 9] (n = 32, 64), [0.05, 1.5] (n = 32, 64). chi_-3: 0 on [60, 84] (n = 64, 128; 2.0e-29, 4.4e-101) and [1, 9] (n = 32, 64, 128; 9.8e-62, 1.3e-148, 5.1e-350).
Liouville twist on [1, 6]: 63 of 64 and 124 of 128 eigenvalues negative. Unimodular twist: 32 of 64 and 64 of 128.

**Why it is closed.**
- The controls with a functional equation fail only through negative eigenvalues whose number equals the number of resolved off-line zeros with beta > 1/2 + a (2 for DH's conjugate pair; 8, 18, 36 for E_b as more of its zeros are resolved) and whose size decays exponentially with the distance from the node set to the zero. A window ending 15.7 below DH's zero still detects it, at relative size 1e-61 with 128 nodes and 400 digits; a window ending 25.7 below it does not at this size. This is analytic continuation of R from the node set to the pole: verified height in another form, at a cost in digits proportional to the distance. In float64 the failure appears when the window top is within about 2 units of the zero (DH), 4 units (heat tau = -2), 5 units (E_b, displacement 0.35).
- The Euler-product control E_b and the multiplicative T-NR fail in the same way as DH; E_b = 0.2 passes at a = 0.25 because its zeros lie within a of the line. The test reads the zero set only.
- zeta passing on every node set reached says that no pole of R lies within continuation range of the nodes at the precision used. A finite matrix certifies nothing above that range: DH passes on [1, 60] with 128 nodes at 400 digits.
- The Liouville and unimodular twists fail at one orbit because abs(R) differs from 1 on the imaginary axis (no functional equation s <-> 1 - s). The symmetry defect abs(G(z)/G(-z)) - 1 is -0.089 and +0.372 at z = 0.3 + 7.7i and zero to 12 digits for every function with a functional equation. This is a reason that does not depend on zeros, but it removes only the two controls without a functional equation; DH, E_b, T-NR and heat have defect zero.
- Map rows P3, P5 (finite Pick orders are Euler-blind) and G1, G2 (a bound over all tests is RH-strength) apply as stated in the nodes; the reference form does not change either.

## 6. Limits of this lane

1. Float64 was used as a screen in combinations 2 and 4. Every pass or fail reported for combination 2 was repeated at 40 digits at N = 200 and 400 only; the statements at N up to 20000 rest on float64 and on the proof of pairing. For combination 4 the controls' failures and zeta's passes were repeated at 400 digits for n <= 128; the windows at heights 1e4 to 1e6 are float64 only, with a roundoff floor of 1e-14 that hides any eigenvalue smaller than that.
2. No interval arithmetic was used. The kernel quadratures of combinations 1 and 3 are Gauss-Legendre in float64, checked against the source tables (agreement within the sources' stated accuracy) and against closed forms (tanh(s), s-only dependence).
3. Heat was run at tau = +0.05, -0.05, -0.2 in combinations 1 to 3 and at tau = -2, -0.2, +0.05 in combination 4 (tau = -2 because its first off-line zero, at height 49.7, is within reach of quadrature; for tau = -0.2 the first off-line zero is near height 334 and was not reached). The distance scan of Test B was done for DH, E_b and T-NR, not for heat. The "annulus Dirichlet form" reference was not built; the Sylvester argument covers it.
