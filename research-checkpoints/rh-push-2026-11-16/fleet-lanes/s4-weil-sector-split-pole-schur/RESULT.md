# s4-weil-sector-split-pole-schur: screening of four Weil-form combinations against the control battery

Date 2026-11-19/20. Internal working note, not refereed. Nothing here proves RH, moves a Lambda bound or gives a zero-free region.
Labels: PROVED (elementary, argument given), CLASSICAL, MEASURED (numerics of this lane), OPEN.

## Verdict

**No survivor. All four combinations are closed.** Each of the four statistics is, by an exact identity, a function of the sign or size of the lowest eigenvalue of the supported Weil form of the object, so none of them can change sign before the Weil form does; the measurements agree with the identities to the grid resolution.

| # | combination | statistic | sizes reached | zeta | comparison L-function | DH (own form) | T-NR(q), c = 2.2 (own form) | E_a = zeta(s+a) zeta(s-a) (own form) | sign twist / unimodular twist (zeta's gamma factor and pole) | heat tau < 0 | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | odd-sector-pole-term + weil-sector-split + whole-even-coercivity | lowest eigenvalue of the even-sector and odd-sector forms (full, and pole-free), Legendre-Galerkin | N = 320 modes, 768-bit, 2a = ln 2 .. 3.6 step 0.1, 23 objects; N = 400, 1024-bit, 2a = 3.4 .. 4.61; N = 600 modes, 1500-bit (451 digits), lambda^2 = 100, 200, 400 (2a = 4.61, 5.30, 5.99) | both sectors positive at every support (lambda^2 = 400, N = 600: even 1.34e-369, odd 5.13e-366, no negative pivot); the even sector is the smaller one at every support | L(chi_-3), L(chi_5): both sectors positive at every support (lambda^2 = 400: 4.1e-269, 1.1e-225) | even sector negative from 2a in (3.42, 3.44], odd sector from (3.44, 3.46] | even first: q = 2: 1.0 / 1.1; q = 3: 1.3 / 1.4; q = 5: 1.8 / 1.9; q = 7: 2.1 / 2.2; q = 11: 2.5 / 2.7 (even / odd, first grid support) | a = 1/8: 1.0 / 1.1; a = 1/4: 0.9 / 1.0 | Liouville, flip at 2, random signs: 0.8 / 0.8; flip at p: first grid point after log p in both sectors; unimodular (real part): 1.0 / 0.9 and 0.9 / 0.8 | not formulable (no prime side) | closed: W = W_e + W_o forces full onset = min(even onset, odd onset); DH's odd onset is 0.02 later than its even onset |
| 2 | gamma-bulk-identity + scalar-comparison-target + dyadic-near-frequency-target | largest eigenvalue of (G_W + mu)^{-1/2} V_W (G_W + mu)^{-1/2}, mu = 1e-2, 1e-4, 1e-6, on step functions | mesh 0.004: W up to log 1e6 (m = 3454, 78,498 primes and 236 higher prime powers); mesh 0.001: W = log 1e5, 3e5, 1e6 (m = 13816, GPU float64); mesh 0.002 for the first exceedances | below 1 at every W: 0.381 (W = log 4) to 0.711 (W = log 1e6, mesh 0.004) and 0.763 (mesh 0.001) | own form: L(chi_-3) 0.292 .. 0.821, L(chi_5) 0.178 .. 0.619: below 1 | first exceedance W = 3.958 (mesh 0.002), (3.94, 3.96] in the Legendre basis; its Weil form is negative from 3.43; top dyadic block n in [16, 32) | exceeds at log q + 0.21, 0.04, 0.01, 0.006, 0.003 for q = 2, 3, 5, 7, 101 (top block = the block of q) | own form: a = 1/8 at W = 13.37, a = 1/4 at W = 7.89 (their a_0 is -11.3, -13.4); with zeta's G: 1.68, 1.66 | 1.32 (Liouville, random signs), 1.97 (flip at 2), 1.89 .. 2.06 (unimodular, WT); top block n in [2,4) or [4,8) | not formulable (no charge d nu) | closed: the bound is equivalent to lambda_min(q_W) >= a_0 - mu, a weakening of Weil positivity by 1.372; every control exceeds at or after its Weil onset |
| 3 | pole-term-schur-complement + schur-charge-payment + signed-complement-bound | Schur complement S = E - B* D^{-1} B of the pole block over the pole-free form, per sector (rank 1 each), and of the literal block {cosh(x/2), x sinh(x/2)} (rank 2, even sector) | N = 320, 768-bit, 2a = ln 2 .. 3.6 step 0.1 | S > 0 at every support: even 1.7e-3 (ln 2) .. 4.9e-111 (3.2); odd 8.5e-2 .. 5.5e-106; literal block both eigenvalues > 0 | no pole block. Formal block {cosh(x/2)} / {sinh(x/2)}: S > 0 | no pole block: the test is empty. Formal block: S > 0 up to 3.42; S < 0 with D > 0 only at 3.44, 3.46 (its own onset) | S < 0 with D > 0 on 2a = 1.0 .. 1.3 (q = 2), 1.3 .. 1.5 (q = 3), 1.8 .. 1.9 (q = 5), 2.1 .. 2.2 (q = 7), 2.5 .. 2.7 (q = 11) | rank 4. S < 0 with D > 0 on 1.0 .. 1.4 (a = 1/8), 0.9 .. 1.3 (a = 1/4) | S < 0 with D > 0 from 0.8 (first grid point after ln 2) for every twist that changes the prime 2; flips at 3, 5, 7: never (D and the full form change sign together) | not formulable | closed: sign(S) = sign of the full form whenever D > 0 (inertia additivity); the test is empty for DH; T-NR(q) fails only at 2a > log q |
| 4 | nonlocal-pole-term-bridge + mem-concentration-dip-open + ri-confined-well | mu = largest share of abs(ghat)^2 in the wells; N_max = depth-weighted maximum; P_min = least positive mass; crude margin P_min - N_max; exact margin 1 - sup N/P | 2a = 0.5 .. 2.2 step 0.1, 17 objects, N = 128 and 256 Legendre modes, wells up to t = 60 and 120 | crude margin positive up to 2a = 1.0 (0.0086), negative from 1.1; exact margin positive throughout | L(chi_-3): crude margin negative from 1.2; L(chi_5): from 1.5 | crude margin negative from 1.6 (later than zeta); exact margin positive throughout | crude from 1.2 / 1.4 / 1.7 .. 1.9; exact margin negative from 1.3 / 1.5 / 1.9 (q = 2, 3, 5) | crude from 1.3; exact from 1.4 | crude from 1.1; exact from 1.1 .. 1.4 | not formulable | closed: zeta's crude margin is the first to fail among the objects with a functional equation; the exact margin is negative iff the pole-free form is |

Heat deformation: not run in any combination. It has no Dirichlet series, hence no prime side, no charge d nu, no symbol with atomic rungs; its Weil functional exists only as a sum over a zero table (c12 battery: first off-line pair of HEAT -0.1 at height 415.26, offset 0.0216), which is verified height by construction. Reported as not formulable for these four statistics.

Float64 on GPU 1 was used for combination 2 only (dense symmetric eigenproblems up to 13816 x 13816). The pass / fail statements of combination 2 were re-checked in the ball-arithmetic Legendre basis (section 3). Combinations 1 and 3 are ball arithmetic throughout; combination 4 is float64 on matrices assembled in ball arithmetic (its conclusions are O(0.01 .. 1) quantities).

## 0. Definitions (sources)

- Weil form of an object F with completed function Q^s prod_j pi^{-s/2} Gamma((s + kappa_j)/2) F(s), poles of F at 1/2 +- p, for real g in L^2(-a,a), h = g * g~ (CLASSICAL):
  W_F(g) = sum_p 2 ghat(ip) ghat(-ip) + (1/2 pi) int w_arch(t) abs(ghat(t))^2 dt - sum_n n^{-1/2} Re c(n) (h(log n) + h(-log n)),
  w_arch(t) = 2 log Q + sum_j (Re psi(1/4 + kappa_j/2 + it/2) - log pi), c = coefficients of -F'/F.
- Sector split (nodes weil-sector-split, odd-sector-pole-term; route 44, route 15; PROVED): for real g = g_e + g_o, W(g) = W(g_e) + W(g_o); ghat(ip) ghat(-ip) = (int g cosh(px))^2 - (int g sinh(px))^2, so the pole term is +2 (int g cosh(px))^2 on even g and **-2 (int g sinh(px))^2** on odd g. "Pole-free" = restriction to int g cosh(px) = 0 (even), int g sinh(px) = 0 (odd).
- Even-sector coercivity to lambda = sqrt(33/2) (node whole-even-coercivity, PR 28): support [-log lambda, log lambda], i.e. 2a = log(33/2) = 2.8034. lambda^2 = 400 is 2a = 5.9915.
- Scalar comparison (atlas section 11): a(t) = Re psi(5/4 + it/2) - log pi, a_0 = a(0) = psi(5/4) - log pi = -1.372183; G = A - a_0 (symbol a(t) - a_0 >= 0, node gamma-bulk-identity); d nu = sum Lambda(n) n^{-1/2} delta_{log n} - e^{r/2} dr; V_W[f] = 2 Re int_[0,W) R_f d nu; q_W = G + a_0 - V_W. q_W equals the Weil form above (the 5/4 symbol and the charge -e^{r/2} dr together equal the 1/4 symbol and the pole term 2 ghat(i/2) ghat(-i/2); checked to 1.2e-13 entrywise, section 1).
- Pole block (imp-97076): PW_a = P0 + span of the pole directions. In the g variable the pole directions are cosh(x/2) (even sector) and sinh(x/2) (odd sector); the source writes the block as {cosh(x/2), x sinh(x/2)}, which are the two functionals on the autocorrelation h of an even g (hhat has a double zero at i/2). Both versions were computed: the natural block (rank 1 per sector) and the literal block (rank 2 in the even sector). E = form on the block, D = form on its orthogonal complement, B = cross term, S = E - B* D^{-1} B. For E_a the pole block has rank 2 per sector (poles 1/2 +- a), rank 4 in total.
- Wells (node ri-confined-well, imp-97501): sigma_2(t) = (t^2 + 1/4)^2 w_1(t), w_1 the symbol with the rung p = 2 only; negative on [0, 3.306] u [6.945, 10.532], minimum -4336 at t = 9.35. On the pole-free subspace the form is (1/2 pi) int w abs(ghat)^2, so the wells of w are the wells of sigma_2. For 2a > ln 3 the symbol gains rungs; the wells of the symbol with all rungs log n < 2a were used, and for zeta also the fixed wells of sigma_2.
- Objects. Own form: zeta; L(chi_-3) (odd, conductor 3); L(chi_5) (even, conductor 5); DH (odd gamma factor, conductor 5, coefficients (1, kappa, -kappa, -1, 0), c(n) by Dirichlet recursion, no pole); T-NR(q, c) = zeta(s)(1 + c q^{1/2-s} + q^{1-2s}) with Q = q, c = 2.2 (off-line zeros at heights (2k+1) pi / log q) and c = 1.0 (zeros on the line, extra positive comparison); E_a = zeta(s+a) zeta(s-a), a = 1/8, 1/4 (gamma parameters 1/4 +- a/2, poles 1/2 +- a). Zeta's gamma factor and pole with a changed prime side (no functional equation): Liouville; flip of the sign at one prime p = 2, 3, 5, 7; random completely multiplicative signs SGN-00, SGN-01 (numpy PCG64 seeds 440000, 440001); unimodular twists U-00, U-01 (c(p^k) = e^{ik theta_p} log p, seeds 450000, 450001); WT = Lambda(n) n^{-i alpha}, alpha = 1.2393; DH's coefficients in zeta's form. For real g only Re c(n) enters, so the unimodular objects are tested through their real parts.

## 1. Method and validation

Legendre-Galerkin in the orthonormal basis phi_i = sqrt((2i+1)/(2a)) P_i(x/a); even sector = even i, odd sector = odd i; time-domain assembly as in s2-weil-coefficient-rigidity (its `wlib.py` is copied unchanged), but with one Gauss panel on [0,2] and N + (digits ln 10)/(2 ln rho) nodes, rho the Bernstein parameter of the singularities u = +- i pi of the gamma kernel (rho = 2.97 at 2a = 6), so that the quadrature error is below 10^-digits. python-flint; all matrices are midpoints of balls.

Eigenvalues and Schur complements. float64 when abs(lambda) > 1e-7. Otherwise: LDL^T without pivoting in midpoint arithmetic (inertia = number of negative eigenvalues), inverse iteration with that factorisation; for a negative eigenvalue of size below 1e-7 the shift is bracketed by inertia counts. Pole-free quantities are computed from the factorisation of the pole-less form A (arch minus primes), with U an orthonormal basis of the block, T = U^T A^{-1} U and K = sum_p (+-2)(U^T c_p)(U^T c_p)^T (PROVED, Woodbury / inertia of bordered matrices):

  S = T^{-1} + K,  D^{-1} b = y - (A^{-1} U) T^{-1} U^T y with y = A^{-1} b,  neg(D) = neg(A) + pos(T) - rank(U).

A first version used `arb_mat.solve` / `inv` on the pole-free block after an orthogonal change of basis. That loses about three times the digits of the condition number: at N = 128, 2a = 3.2, 640 bits it returned 1.8e-22 for an eigenvalue equal to 1.4758e-64 (mpmath `eigsy`). Every number in this note is from the LDL version, which reproduces the mpmath values (full 3.0223e-71 / 9.0395e-68, pole-free 1.4758e-64 / 4.8475e-62, S 1.5006e-70 / 3.4309e-66) at 640 bits. One server unit launched with the first version was stopped and its output discarded.

A Ritz value is an upper bound for the infimum over L^2(-a,a). Negative values are negative values of the form; positive values are not certificates. The Galerkin spaces at fixed N are not nested in a, and the values are not converged in N at large support (zeta, full even: 5.9e-30 / 5.7e-30 at 2a = 2.0 for N = 128 / 320; 2.6e-61 / 1.3e-77 at 2.8; 5.8e-80 / 2.3e-138 at 3.6).

| check | known value | this code |
|---|---|---|
| box entry of the even full zeta form = 2 Psi(2a)/(2a) (PR 21 closed form), 2a = 1, 2 | 0.08801461047370505, 0.05334112417185567 | the same 16 digits |
| even test (1 - x^2/a^2)^3: matrix form against 2 sum over 80 zeta zeros of abs(ghat(gamma))^2, 2a = 1, 2 | 1.3272713e-5, 2.44721744e-6 | 1.3272717e-5, 2.44721749e-6 |
| **odd** test x (1 - x^2/a^2)^3, same comparison (pole term 8.1e-5 and 5.3e-3 in size) | 1.5485263321e-4, 7.163972195e-6 | 1.5485263412e-4, 7.163972258e-6 |
| full even residual at 2a = ln 3 (imp-96091) | 5.633814e-8 | 5.6355e-8 (N = 32), 5.53e-8 (N = 320) |
| pole-free even / odd at 2a = ln 3 (moment ladder) | 9.5e-4 / 0.0334 | 9.45e-4 / 0.0331 |
| DH own form, 2a = 3.4 / 3.5 (s2, N = 320) | 8.997e-29, 6.228e-25 / -2.540e-23, -7.673e-21 | identical digits (independent eigen-solver) |
| Toeplitz box form against 2 Psi(W)/W, W = 4.6, mesh 0.01 | 0.024266099475913 | 0.024266099475909 (5/4 normalisation), 0.024266099475739 (1/4 normalisation with the pole term) |
| pencil identity: (lambda_max > 1) iff (lambda_min(q) < a_0 - mu), three mu | | consistent in every row of every run |
| wells of the p = 2 symbol; minimum of sigma_2 | [0, 3.306] u [6.945, 10.532]; -4336 at 9.35 | [0, 3.3050] u [6.9449, 10.5310]; -4336.198 at 9.35 |
| Parseval for the basis transforms on [0, 3000] plus the 1/t^2 tail | 1 | 1.0000 (six modes) |
| pole-free form: time domain against (1/pi) int_0^3000 w abs(ghat)^2 plus the tail | 0.434037 | 0.434088 |

**Sign of the odd-sector pole term.** The third row decides it: the odd-sector pole term is -2 (int g sinh(x/2))^2. `run_weil.py` of s2-weil-coefficient-rigidity adds +(1/2)(col . c)^2 on both parity blocks (and P P^T for its complex objects), which is abs(ghat(ip))^2 + abs(ghat(-ip))^2 and has the wrong sign on odd g. Its even-sector and pole-free numbers are unaffected (they agree with this note); its "full" values for objects with a pole are the even-sector values only where the even sector is the smaller one, and its full odd blocks should not be quoted.

Local runs (Mac, `scripts/memcap.sh 8`): validation; N = 32, 64, 128 small cases; N = 320 sweep (6 processes, 3.1 GB, 8 min); N = 320 DH refinements; N = 400 at five supports (5 processes, 16 min); combination 4. Server runs (through `rhrun` only): see section 6.

## 2. Combination 1: even and odd sector separately

Finite consequence tested: lambda_min of the even-sector and the odd-sector form of each object, as functions of the support. Survival would have needed: zeta positive in both sectors at every size, and every control negative in one sector at a support well below the onset of its full form.

That cannot happen (PROVED): W(g) = W(g_e) + W(g_o) and the two sectors are orthogonal invariant subspaces, so the full form is the orthogonal sum of the sector forms, lambda_min(full) = min(lambda_min(even), lambda_min(odd)), and the onset of the full form is the smaller of the two sector onsets. The sector split does not lower any onset; what it can show is which sector carries it.

MEASURED (N = 320, 768-bit, grid step 0.1; DH also on step 0.02; files `out_local/secA_N320*.{json,md}`, `out_local/secDH_N320.*`). First support with a negative lowest eigenvalue:

| object | full, even | full, odd | pole-free, even | pole-free, odd |
|---|---|---|---|---|
| zeta | > 3.6 | > 3.6 | > 3.6 | > 3.6 |
| L(chi_-3), L(chi_5), T-NR(2, c = 1.0) | > 3.6 | > 3.6 | > 3.6 | > 3.6 |
| DH | (3.42, 3.44] | (3.44, 3.46] | no pole | no pole |
| T-NR q = 2 / 3 / 5 / 7 / 11 (c = 2.2) | 1.0 / 1.3 / 1.8 / 2.1 / 2.5 | 1.1 / 1.4 / 1.9 / 2.2 / 2.7 | 1.3 / 1.6 / 2.0 / 2.3 / 2.8 | 1.4 / 1.5 / 1.9 / 2.2 / 2.7 |
| E_1/8 / E_1/4 | 1.0 / 0.9 | 1.1 / 1.0 | 1.4 / 1.4 | 1.5 / 1.4 |
| Liouville, flip at 2, SGN-00, SGN-01 | 0.8 | 0.8 | 1.1 | 1.4 |
| flip at 3 / 5 / 7 | 1.2 / 1.7 / 2.0 | 1.2 / 1.7 / 2.0 | 1.2 / 1.7 / 2.0 | 1.2 / 1.7 / 2.0 |
| U-00 / U-01 (real part) | 1.0 / 0.9 | 0.9 / 0.8 | 1.4 / 1.2 | 1.2 / 1.5 |
| WT (real part) | 0.9 | 0.8 | 2.2 | > 3.6 |
| DH coefficients in zeta's form | 0.9 | 0.8 | 1.7 | 1.6 |

Zeta, lowest eigenvalue (N = 320; converged in N up to about 2a = 2.4):

| 2a | full even | full odd | pole-free even | pole-free odd |
|---|---|---|---|---|
| ln 2 | 1.33e-03 | 7.32e-02 | 5.47e-01 | 8.43e-01 |
| ln 3 | 5.53e-08 | 1.49e-05 | 9.45e-04 | 3.31e-02 |
| 1.6 | 1.64e-17 | 1.55e-14 | 5.31e-12 | 9.77e-10 |
| 2.0 | 5.72e-30 | 1.44e-26 | 1.34e-23 | 7.90e-21 |
| 2.4 | 6.73e-49 | 4.16e-45 | 8.12e-42 | 1.06e-38 |
| 2.8 | 1.27e-77 | 1.86e-73 | 9.19e-70 | 2.83e-66 |
| 3.2 | 9.56e-112 | 1.30e-107 | 8.11e-104 | 7.69e-101 |
| 3.6 | 2.28e-138 | 4.50e-134 | 2.96e-130 | 7.89e-127 |

Readings.
- Zeta: the negative pole term of the odd sector does not make the odd sector the binding one. The odd full margin exceeds the even full margin at every support, by a factor growing from 55 (ln 2) to 1.8e4 (3.3).
- DH: the two sectors change sign within 0.02 of each other, the even one first (3.42 < 2a <= 3.44 against 3.44 < 2a <= 3.46). No sector sees DH earlier than the full form does.
- T-NR and E_a: even sector first, by one grid step. The onset of T-NR(q) is log q + 0.2 .. 0.3: below log q its form is zeta's form plus 2 log q (PROVED: c(n) = Lambda(n) for n < q, Q = q).
- Objects without a functional equation: both sectors fail at the first grid point after the first changed rung; the odd sector is first by one step only for the unimodular twists, WT and the mismatch probe.

Larger supports (lambda^2 = e^{2a} up to 400). N = 400, 1024-bit (local) and N = 600, 1500-bit = 451 digits, quadrature target 400 digits (server). "neg" = number of negative pivots of the LDL^T factorisation of the full sector matrix (its inertia); files `out_local/secM_N400.json`, `out_server/secC_N600.json`, `out_server/secD_N600.json`, `out_server/big_table.md`.

| N | 2a | lambda^2 | object | full even | full odd | pole-free even | pole-free odd | neg (even, odd) |
|---|---|---|---|---|---|---|---|---|
| 400 | 3.4000 | 30.0 | zeta | 2.80e-137 | 3.99e-133 | 3.70e-129 | 1.28e-125 | 0, 0 |
| 400 | 4.0000 | 54.6 | zeta | 6.51e-181 | 1.76e-176 | 1.67e-172 | 4.27e-170 | 0, 0 |
| 400 | 4.6052 | 100 | zeta | 6.66e-215 | 5.08e-212 | 4.74e-208 | 1.94e-205 | 0, 0 |
| 600 | 4.6052 | 100 | zeta | 1.36e-278 | 7.16e-275 | 1.21e-270 | 2.46e-267 | 0, 0 |
| 600 | 5.2983 | 200 | zeta | 4.01e-329 | 1.86e-325 | 3.57e-321 | 1.97e-317 | 0, 0 |
| 600 | 5.9915 | 400 | zeta | 1.34e-369 | 5.13e-366 | 1.01e-361 | 6.91e-358 | 0, 0 |
| 600 | 4.6052 | 100 | L(chi_-3) | 1.87e-161 | 8.84e-157 | 2.31e-152 | 3.50e-148 | 0, 0 |
| 600 | 5.2983 | 200 | L(chi_-3) | 6.03e-222 | 4.71e-217 | 1.37e-212 | 4.51e-209 | 0, 0 |
| 600 | 5.9915 | 400 | L(chi_-3) | 4.06e-269 | 1.79e-264 | 4.77e-260 | 7.56e-256 | 0, 0 |
| 600 | 4.6052 | 100 | L(chi_5) | 1.26e-106 | 1.03e-101 | 2.99e-97 | 5.70e-93 | 0, 0 |
| 600 | 5.2983 | 200 | L(chi_5) | 5.69e-174 | 4.12e-169 | 1.24e-164 | 2.76e-160 | 0, 0 |
| 600 | 5.9915 | 400 | L(chi_5) | 1.12e-225 | 8.94e-221 | 2.69e-216 | 5.09e-212 | 0, 0 |
| 400 | 3.4000 | 30.0 | DH | 8.85e-29 | 6.19e-25 | (formal) | (formal) | 0, 0 |
| 400 | 3.4400 | 31.2 | DH | -8.36e-30 | 7.15e-27 | | | 1, 0 |
| 400 | 3.5000 | 33.1 | DH | -2.60e-23 | -7.73e-21 | | | 1, 1 |
| 400 | 4.0000 | 54.6 | DH | -0.712 | -0.766 | | | float64 |
| 600 | 4.6052 | 100 | DH | -1.43 | -1.41 | | | float64 |

Zeta, L(chi_-3) and L(chi_5) have no negative direction in either sector in the 600-mode space up to lambda^2 = 400; the even sector is the smaller one in every row, by a factor between 3.8e3 (zeta) and 8e4 (L(chi_5)). The Schur complements at lambda^2 = 400 are 2.09e-368 (even) and 1.59e-363 (odd) for zeta; the literal rank-2 block has a positive definite complement there by inertia (full even form and its D both without negative pivot). The lowest Ritz value at lambda^2 = 400 is 1.34e-369, which leaves 80 digits below it at 1500 bits and 30 digits above the quadrature target. DH at N = 400 repeats the N = 320 values to two digits (-8.36e-30 against -8.32e-30 at 2a = 3.44; -2.60e-23 against -2.54e-23 at 3.5): its sector onsets are converged in N, even sector first. The zeta values are not converged in N (6.7e-215 at N = 400 against 1.4e-278 at N = 600 for lambda^2 = 100): each is an upper bound for the true infimum, and positivity of a Ritz value is not a certificate. N = 600 at 2a = 2.80, 3.4, 3.5, 4.0 was started and withdrawn for time (section 6); those supports are covered at N = 320 and N = 400.

The node's own example of an odd-first object (Epstein zeta of the principal form of discriminant -23: odd 1.662 against even (1.679, 1.689], route 15) was not recomputed. It is consistent with the identity: its full onset is the odd onset.

Classification: **closed**. The statement "odd-sector onset well below the onset of the full form" contradicts the sector identity; the measured sector onsets of every control coincide with its full-form onset to one grid step, and DH's are its zero-resolved onset 3.43 (source prediction 2a = 3.49).

## 3. Combination 2: scalar comparison (G_W + mu)^{-1/2} V_W (G_W + mu)^{-1/2} <= I

Finite consequence tested: lambda_max of the pencil on step functions of mesh h and support W = m h, with V_W built from every prime power below e^W. Survival would have needed: zeta bounded by 1 at every W, and every control above 1 at a W well below its Weil onset.

Reduction (PROVED, two lines): V_W <= G_W + mu iff q_W = G_W + a_0 - V_W >= a_0 - mu. So

  lambda_max((G_W + mu)^{-1/2} V_W (G_W + mu)^{-1/2}) <= 1  iff  lambda_min(q_W) >= a_0 - mu = -1.3722 - mu,

with q_W the Weil form (section 0). The comparison is Weil positivity weakened by the constant 1.372 + mu; the three values of mu move the threshold by at most 0.01. lambda_min(q_W) is nonincreasing in W (nested supports), so an object exceeds 1 only at or after the support where its Weil form turns negative, and the first exceedance was located by bisection. Row P10 of the obstruction map already records that a bound q_W >= -C norm^2 on a cofinal family is RH itself.

Discretisation: box basis h^{-1/2} 1_[ih,(i+1)h); every form is a Toeplitz matrix with entries K_d = int tent_d(r) k(r) dr: gamma part k = sum_k [delta/(k+z) - e^{-2(k+z) abs(r)}] (closed sums with a trigamma tail), prime part sum_n c(n) n^{-1/2} tent((log n - d h)/h), pole charge e^{abs(r)/2} in closed form. The step functions are a subspace of L^2(0,W): a value above 1 is an exceedance in L^2; a value below 1 is not a proof. float64; dense `eigh` on the GPU.

MEASURED. Zeta and the two comparison L-functions (own forms), largest eigenvalue of the pencil for mu = 1e-2 / 1e-4 / 1e-6 and lowest eigenvalue of q_W on the same space:

| W | e^W | zeta, mesh 0.004 (m <= 3454) | zeta lambda_min(q_W) | L(chi_-3), mesh 0.004 | L(chi_5), mesh 0.004 |
|---|---|---|---|---|---|
| 1.388 | 4 | 0.3814 / 0.3831 / 0.3831 | 5.0e-05 | 0.2917 / 0.2935 / 0.2935 | 0.1775 / 0.1779 / 0.1779 |
| 2.304 | 10 | 0.5748 / 0.5765 / 0.5765 | 1.4e-05 | 0.5947 / 0.5967 / 0.5967 | 0.3113 / 0.3118 / 0.3118 |
| 3.400 | 30 | 0.6575 / 0.6589 / 0.6589 | 6.2e-06 | 0.7185 / 0.7202 / 0.7202 | 0.4380 / 0.4386 / 0.4386 |
| 4.604 | 100 | 0.6647 / 0.6661 / 0.6661 | 3.3e-06 | 0.7549 / 0.7564 / 0.7564 | 0.5225 / 0.5231 / 0.5231 |
| 6.908 | 1e3 | 0.6759 / 0.6773 / 0.6773 | 1.7e-06 | 0.7605 / 0.7619 / 0.7620 | 0.5454 / 0.5460 / 0.5460 |
| 9.212 | 1e4 | 0.6915 / 0.6929 / 0.6929 | 1.1e-06 | 0.7702 / 0.7715 / 0.7716 | 0.5509 / 0.5515 / 0.5515 |
| 11.512 | 1e5 | 0.7014 / 0.7027 / 0.7027 | 9.7e-07 | 0.7761 / 0.7774 / 0.7774 | 0.5648 / 0.5653 / 0.5653 |
| 13.816 | 1e6 | 0.7111 / 0.7124 / 0.7124 | 8.3e-07 | 0.7807 / 0.7820 / 0.7820 | 0.5726 / 0.5731 / 0.5731 |

Mesh 0.001 (m = 11513, 12612, 13816; 1.5 GB per dense matrix; GPU float64):

| W | e^W | zeta | zeta lambda_min(q_W) | L(chi_-3) | L(chi_5) |
|---|---|---|---|---|---|
| 11.513 | 1e5 | 0.7574 / 0.7586 / 0.7586 | 1.75e-08 | 0.8175 / 0.8187 / 0.8187 | 0.6171 / 0.6177 / 0.6177 |
| 12.612 | 3e5 | 0.7614 / 0.7626 / 0.7626 | 1.52e-08 | 0.8192 / 0.8204 / 0.8204 | 0.6181 / 0.6187 / 0.6187 |
| 13.816 | 1e6 | 0.7628 / 0.7640 / 0.7640 | 1.37e-08 | 0.8213 / 0.8224 / 0.8224 | 0.6190 / 0.6196 / 0.6196 |

No exceedance for zeta, L(chi_-3), L(chi_5) at any W reached. A first run of this table evaluated cosh(ph) - 1 by direct subtraction in the pole kernel; that loses 1e-9 relative accuracy at h = 0.001 and gave lambda_min(q_W) = -4.3e-08 for zeta at W = log 1e6. With 2 sinh^2(ph/2) the value is +1.37e-08 and the box check agrees with the closed form to 4e-15. The pencil values and every first exceedance are identical in the two runs to the digits shown; the first run is kept in `out_server/prefix/`.


First exceedance of each control (mesh 0.002, W up to 6.9; mesh 0.004 up to log 1e6 agrees to one mesh step; file `out_server/scalar_tables.md`). "Own" = the object's own G, a_0 and poles; "zeta frame" = zeta's G and pole charge with the control's coefficients, which is the literal "replace d nu by the control's charge".

| object | frame | first W with lambda_min(q_W) < 0 | first W with pencil > 1 | pencil max there (mu = 1e-2 / 1e-4 / 1e-6) | dyadic block of n with the largest share of V at the maximiser |
|---|---|---|---|---|---|
| DH | own (a_0 = -0.621) | 3.656 (3.43 in L^2) | 3.958 | 1.0002 / 1.0022 / 1.0023 | [16, 32): 1.66 of 4.81 |
| DH coefficients | zeta frame | 0.756 | 1.606 | 1.0028 / 1.0137 / 1.0139 | [4, 8) |
| L(chi_-3), L(chi_5) coefficients | zeta frame | 0.724 | 1.906, 1.316 | 1.002 / 1.015 / 1.015 | [4, 8), [2, 4) |
| T-NR q = 2 / 3 / 5 / 7 / 101 | zeta frame | 0.706 / 1.106 / 1.612 / 1.948 / 4.616 | 0.900 / 1.140 / 1.622 / 1.952 / 4.618 | 1.001 .. 1.70 | the block of q |
| T-NR q = 2 / 3 / 5 / 7 / 101 | own (a_0 = -1.372 + 2 log q > 0) | 0.902 / 1.244 / 1.718 / 2.042 / 4.668 | 0.900 / 1.140 / 1.622 / 1.952 / 4.618 | same | the block of q |
| E_1/8, E_1/4 | own (a_0 = -11.28, -13.43) | 1.180, 0.996 | 13.37, 7.89 (mesh 0.004) | 1.0006, 1.0019 | [2^17, 2^18), [2^9, 2^10) |
| E_1/8, E_1/4 | zeta frame | 0.728 | 1.684, 1.662 | 1.002 / 1.011 / 1.011 | [2, 4) |
| Liouville, SGN-00, SGN-01 | zeta frame | 0.724 | 1.316 | 1.002 / 1.012 / 1.012 | [2, 4) |
| flip at 2 | zeta frame | 0.724 | 1.972 | 1.0001 / 1.0097 / 1.0097 | [2, 4) |
| U-00, U-01 (real part), WT | zeta frame | 0.878, 0.736, 0.782 | 2.062, 1.886, 1.952 | 1.001 .. 1.015 | [4, 8) |

Re-check in the ball-arithmetic Legendre basis (N = 320; `out_local/secA_N320.json`, `out_local/secDHx_N320.json`): DH own form lambda_min = -0.562 at 2a = 3.94 and -0.655 at 3.96, threshold a_0 - 0.01 = -0.631: first exceedance in (3.94, 3.96], against 3.958 on the mesh. Zeta-frame objects, first grid support below -1.3822: Liouville and random signs 1.4 (mesh 1.316), flip at 2: 2.0 (1.972), U-00 2.1 (2.062), U-01 1.9 (1.886), WT 2.0 (1.952), DH coefficients 1.7 (1.606). Zeta: lambda_min >= 0 > a_0 - mu at every support of section 2.

Readings.
- Zeta stays below 1 with room: the maximum grows from 0.38 to 0.71..0.76 between W = log 4 and log 1e6. Under RH it is at most sup (G + a_0)/(G + mu) < 1, and on a mesh h the largest value of G is of order log(1/h), which is why the finer mesh gives the larger number. The statistic does not approach 1 through arithmetic; it approaches 1 through high-frequency test functions.
- DH exceeds at W = 3.96, later than its Weil onset 3.43 and far later than the supports at which the objects without a functional equation exceed (1.3 .. 2.1). The latter fail through the block of the first changed prime: the mismatch between zeta's gamma factor and the coefficients, row by row the same mechanism as in s2-weil-coefficient-rigidity.
- The own-frame threshold a_0 depends on the conductor. For T-NR(q) it is positive, so the own-frame comparison asks for more than positivity and is exceeded before the form is negative; for E_a it is -11.3 and -13.4, so the comparison is exceeded only at W = 13.4 and 7.9 although the form is negative from W = 1.2 and 1.0. The fixed-mu target is tied to zeta's normalisation.
- The near-frequency block carrying the exceedance is the lowest dyadic block that contains a changed coefficient ([2,4) or [4,8)), [16,32) for DH and the block of q for T-NR(q).

Classification: **closed**. The statistic is a monotone function of lambda_min of the Weil form with a fixed offset; it is weaker than Weil positivity and inherits its control behaviour (obstruction map rows P2, P10).

## 4. Combination 3: Schur complement of the pole block

Finite consequence tested: sign of S = E - B* D^{-1} B for 2a from ln 2 to 3.2 (run to 3.6). Survival would have needed: zeta S >= 0, and every control S < 0 with D > 0 at 2a < 2.

Structure (PROVED): with D > 0, the full sector form is congruent to D + S (Haynsworth inertia additivity), so S >= 0 iff the full sector form is >= 0. The Schur complement carries the sign of the full form and no other information; "S < 0 with D > 0" says that the full form turns negative before the pole-free form does, i.e. that the first negative direction has a component along the pole direction.

MEASURED (N = 320, 768-bit; table `out_local/secA_N320_tables.md`). Zeta, natural block (rank 1 per sector) and literal block {cosh(x/2), x sinh(x/2)}:

| 2a | S even | S odd | E even | E odd | S/E even | S/E odd | literal block: eigenvalues of the 2x2 complement | lambda_min of its D |
|---|---|---|---|---|---|---|---|---|
| ln 2 | 1.68e-03 | 8.52e-02 | 0.187 | 0.268 | 9.0e-03 | 3.2e-01 | 1.33e-03, 8.17e-01 | 1.06 |
| ln 3 | 9.56e-08 | 3.74e-05 | 0.128 | 0.141 | 7.5e-07 | 2.7e-04 | 5.91e-08, 3.25e-03 | 0.412 |
| 1.6 | 3.90e-17 | 9.44e-14 | 0.089 | 0.110 | 4.4e-16 | 8.6e-13 | 2.03e-17, 9.03e-11 | 1.32e-07 |
| 2.0 | 1.69e-29 | 1.57e-25 | 0.062 | 0.124 | 2.7e-28 | 1.3e-24 | 8.07e-30, 6.36e-22 | 2.72e-18 |
| 2.4 | 2.43e-48 | 7.54e-44 | 0.065 | 0.078 | 3.8e-47 | 9.7e-43 | 1.08e-48, 9.26e-40 | 1.10e-35 |
| 2.8 | 5.52e-77 | 5.29e-72 | 0.050 | 0.089 | 1.1e-75 | 6.0e-71 | 2.31e-77, 2.25e-67 | 6.44e-63 |
| 3.2 | 4.94e-111 | 5.50e-106 | 0.040 | 0.097 | 1.2e-109 | 5.7e-105 | 1.95e-111, 3.87e-101 | 2.37e-97 |
| 3.6 | 1.39e-137 | 2.69e-132 | 0.035 | 0.095 | 3.9e-136 | 2.8e-131 | 5.15e-138, 2.52e-127 | 2.71e-123 |

The pole block energy E stays of order 0.04 .. 0.3 while S falls with the margin: the cross term B* D^{-1} B pays all but a fraction S/E of the block energy (9e-3 at ln 2, 7.5e-7 at ln 3, 1e-109 at 3.2). In the odd sector E is positive although the pole term is negative.

Controls: supports (grid step 0.1) with S < 0 while D > 0.

| object | pole block | even sector | odd sector | first support with the full form negative | first support with D negative |
|---|---|---|---|---|---|
| L(chi_-3), L(chi_5) | none (formal block) | none | none | none | none |
| DH | none (formal block) | 3.44, 3.46 | 3.46, 3.48 | 3.44 | 3.48 / 3.50 |
| T-NR q = 2 | rank 1 + 1 | 1.0 .. 1.2 | 1.1 .. 1.3 | 1.0 | 1.3 |
| T-NR q = 3 | rank 1 + 1 | 1.3 .. 1.5 | 1.4 | 1.3 | 1.5 |
| T-NR q = 5 | rank 1 + 1 | 1.8 .. 1.9 | none | 1.8 | 1.9 |
| T-NR q = 7 | rank 1 + 1 | 2.1 .. 2.2 | none | 2.1 | 2.2 |
| T-NR q = 11 | rank 1 + 1 | 2.5 .. 2.7 | none | 2.5 | 2.7 |
| T-NR q = 2, c = 1.0 | rank 1 + 1 | none | none | none | none |
| E_1/8 | rank 2 + 2 | 1.0 .. 1.3 | 1.1 .. 1.4 | 1.0 | 1.4 |
| E_1/4 | rank 2 + 2 | 0.9 .. 1.3 | 1.0 .. 1.3 | 0.9 | 1.4 |
| Liouville, flip at 2, SGN-00, SGN-01 | rank 1 + 1 | 0.8 .. 1.0 | 0.8 .. 1.3 | 0.8 | 1.1 |
| flip at 3 / 5 / 7 | rank 1 + 1 | none | none | 1.2 / 1.7 / 2.0 | 1.2 / 1.7 / 2.0 |
| U-00, U-01 (real part) | rank 1 + 1 | 1.0 .. 1.3, 0.9 .. 1.1 | 0.9 .. 1.1, 0.8 .. 1.4 | 0.9, 0.8 | 1.2, 1.2 |
| WT (real part) | rank 1 + 1 | 0.9 .. 2.1 | 0.8 .. 3.6 | 0.8 | 2.2 |
| DH coefficients in zeta's form | rank 1 + 1 | 0.9 .. 1.6 | 0.8 .. 1.5 | 0.8 | 1.6 |

Readings.
- The criterion "S < 0 with D > 0 at 2a < 2" holds for T-NR(2), T-NR(3), T-NR(5), E_1/8, E_1/4 and for every twist that changes the prime 2. It fails for T-NR(q) with q >= 7 (the window starts at log q + 0.2), for the flips at 3, 5, 7 (D and the full form fail together), and it is **empty for DH and for every entire L-function**: without a pole there is no pole block. With the formal block {cosh(x/2)}, {sinh(x/2)} DH shows S < 0 with D > 0 only inside its own onset window 3.44 .. 3.48.
- Where the criterion holds, the support is the full-form onset of that object (combination 1), nothing earlier.
- For E_a the gap between the full-form onset (0.9 .. 1.0) and the pole-free onset (1.4) is the size of zeta's own margin: E_a's form is zeta's bilinear form evaluated at (e^{ax} g, e^{-ax} g), which is not a square, and it turns negative once zeta's lowest eigenvalue (9e-7 at 2a = 1.0) is small against the O(a) asymmetry. This is the two-sided pinning of s2-weil-coefficient-rigidity, not an arithmetic effect.

Classification: **closed**. Schur complement sign = full-form sign (inertia); the pole block does not exist for DH; the node's own statement stands (the complement is the content of the bridge and no finite-rank device pays it past ln 2).

## 5. Combination 4: concentration in the wells

Finite consequence tested: for g in the pole-free subspace of L^2(-a,a), per sector,
mu = sup (1/2pi) int_wells abs(ghat)^2 / norm(g)^2 (a prolate problem for the well set), N_max = sup of the depth-weighted well mass (1/2pi) int_wells abs(w) abs(ghat)^2, P_min = inf of the complementary mass P = W + N, crude margin = P_min - N_max (the estimate an operator-concentration bound would deliver: node mem-concentration-dip-open), and exact margin = 1 - sup N/P. Survival would have needed: zeta's margin positive on 0.5 <= 2a <= 2.2 and every control's margin crossing zero below 2 for a reason other than its Weil onset.

Structure (PROVED): W = P - N on the pole-free subspace, so the exact margin is positive iff the pole-free form is positive definite; its zero crossing is the pole-free onset of the object, whatever well set is used. Only the crude margin is a different statistic, and it is a sufficient condition only.

MEASURED (N = 128 with wells up to t = 60; N = 256 with wells up to t = 120 gives the same onsets, except T-NR(5) (crude margin negative from 1.7 with the cut at 60, from 1.9 with the cut at 120), and the same values to 2 digits; files `out_local/wells_tables.md`, `out_local/wells_tables_N256.md`). The symbol beyond the cut (shallow wells of depth < 0.4 out to t of order 5000 at 2a = 2.2) is kept, signed, in P.

| object | first 2a with crude margin < 0 (even / odd) | first 2a with exact margin < 0 (even / odd) | mu at 2a = 1.0 / 2.2 (even) | N_max, P_min at 2a = 1.0 (even) |
|---|---|---|---|---|
| zeta | 1.1 / 1.2 | > 2.2 | 0.535 / 0.637 | 0.226, 0.234 |
| zeta, fixed wells of sigma_2 | 1.1 / 1.2 | > 2.2 | 0.535 / 0.882 | 0.226, 0.234 |
| L(chi_-3) | 1.2 / 1.5 | > 2.2 | 0.497 / 0.630 | 0.072, 0.091 |
| L(chi_5) | 1.5 / 1.9 | > 2.2 | 0.243 / 0.500 | 0.336, 0.395 |
| DH | 1.6 / 2.1 | > 2.2 | 0.434 / 0.526 | 0.240, 0.533 |
| T-NR q = 2 / 3 / 5 (c = 2.2) | 1.2 / 1.4 / 1.7 .. 1.9 (either sector) | 1.3 / 1.5 / 1.9 (either sector) | at 1.0: 0.518, 0.001, 0.000 | |
| T-NR q = 2, c = 1.0 | 1.7 / 1.7 | > 2.2 | 0.320 / 0.536 | 0.133, 1.22 |
| E_1/8, E_1/4 | 1.3 / 1.4 | 1.4 / 1.4 .. 1.5 | 0.253 / 0.632 | 0.21, 1.57 |
| Liouville, flip at 2, SGN-00 | 1.1 / 1.3 | 1.1 / 1.4 | 0.443 / 0.82 .. 0.90 | 0.342, 0.461 |
| flip at 3 | 1.1 / 1.1 | 1.2 / 1.2 | 0.535 / 0.725 | 0.226, 0.234 |
| U-00 (real part) | 1.1 / 1.2 | 1.4 / 1.2 | 0.532 / 0.919 | 0.213, 0.228 |
| WT (real part) | 1.4 / 1.8 | 2.2 / > 2.2 | 0.487 / 0.529 | 0.104, 0.177 |

Crude margin of zeta by support (minimum of the two sectors): 0.87, 0.69, 0.52, 0.22, 0.060, 0.0086 at 2a = 0.5 .. 1.0, then -0.029 (1.1), -0.088 (1.2), -0.29 (1.4), -0.62 (2.0). DH: 0.93 (0.5), 0.29 (1.0), 0.028 (1.4), 0.007 (1.5), -0.004 (1.6).

Readings.
- The share mu is far below 1 (0.47 .. 0.64 for zeta) and the depth-weighted maximum is small (0.2 at 2a = 1.0 against a nominal depth 6.35) because the pole-free condition ghat(+-i/2) = 0 removes the mass near t = 0, where the first well is deep. This is the quantity the open lemma asks for.
- The concentration estimate nevertheless stops at 2a = 1.0 .. 1.1 for zeta: P_min and N_max are attained on different functions, and from 2a = 1.1 on their difference is negative while the form is positive (exact margin 3.7e-3 at 1.1, 2.4e-11 at 1.6; float64 resolves the exact margin down to about 1e-12, and for 2a >= 1.8 the sign for zeta is taken from the ball-arithmetic values of section 2). The open sub-gap 0.96 < 2a < ln 3 of the source is exactly the range where this crude margin dies.
- Among the objects with a functional equation zeta's crude margin fails **first** (1.1), then L(chi_-3) (1.2), L(chi_5) (1.5), DH (1.6). The statistic orders the objects by the depth of their symbol near t = 0 (zeta has the pole and the most negative w(0)), not by their zeros. DH, which has off-line zeros, keeps a positive crude margin longer than zeta.

Classification: **closed**. The exact margin is the pole-free Weil form; the crude margin does not separate (zeta fails it before DH) and cannot be extended past 2a = 1.1 without the cancellation between the two extremal functions, which is the signed complement bound itself.

## 6. Server runs

All through `rhrun`; GPU 1 (wrapper default) for the float64 job only. The server was loaded (load average above 100, 27 units in rh.slice), and a unit received about 0.6 to 0.85 of a core per process.

| unit | what | cores / GB asked | wall | outcome |
|---|---|---|---|---|
| rh-s4-secA-1120040827 | sectors.py N = 320, 32 supports, 23 objects | 8 / 12 | stopped after about 12 min | void: ball-solve version; rerun locally (N = 320 fits the local limits: 6 processes, 3.1 GB, 8 min) |
| rh-s4-scalar-1120041145 | scalar.py validate + sweeps + mesh 0.001 | 2 / 12, GPU 1 | stopped after 24 min | first version of the pole kernel (cancellation); kept in `out_server/prefix/` |
| rh-s4-scalar-1120043518 | same, corrected kernel: validate (mesh 0.004), sweep mesh 0.002 to W = 6.9, sweep mesh 0.004 to W = log 1e6, dense 11513 / 12612 / 13816 at mesh 0.001 | 2 / 12, GPU 1 (largest dense matrix 1.53 GB, about six live) | 56 min | used; stopped by hand after the last own-form row (the remaining rows were zeta-frame L-function rows, not needed) |
| rh-s4-secB-1120042110, rh-s4-secB1..B4-1120043616 | sectors.py N = 600 at eight, then seven supports | 8 / 12 in total | stopped after 15 and 30 min | withdrawn: at the available share the assembly needed more than 3 hours |
| rh-s4-c599p0..4-1120050642, rh-s4-c599s2-1120055251 | N = 600, 1500-bit, 2a = 5.9915: assembly of 1032 Gauss nodes split over five single-core units, then eigenvalue stage | 5 x (1 / 2), then 2 / 4 | 45 min + 21 min | used |
| rh-s4-c530p0..2-1120050642, rh-s4-c530s2-1120061620 | N = 600, 2a = 5.2983, 1005 nodes over three units | 3 x (1 / 2), then 2 / 4 | 69 min + 13 min | used |
| rh-s4-d460p0..4, rh-s4-d460s2-1120062951 | N = 600, 2a = 4.6052 with DH, 976 nodes over five units | 5 x (1 / 2), then 2 / 4 | 34 min + 13 min | used |

Peak use of this lane: 8 single-core units and one 2-core GPU unit; memory below 1 GB per assembly process and 1.5 GB for an eigenvalue stage. Temporary partial sums (0.8 GB) were deleted from the server. All units of this lane are inactive.

## 7. Files

`wlib.py` (copy from s2), `slib.py` (sector assembly, midpoint LDL, Schur identities), `sectors.py` (combinations 1 and 3), `scalar.py` + `run_scalar.sh` (combination 2), `wells.py` (combination 4), `validate.py`, `dbg_spec.py` (mpmath reference spectrum), `sec_table.py`, `scalar_table.py`, `wells_table.py`; outputs in `out_local/` and `out_server/`.

## 8. Three weakest points

1. Positive Ritz values are not certificates, and at fixed N the values are not converged for 2a above about 2.4 (N = 320); at lambda^2 = 100 the N = 400 and N = 600 values differ by 63 orders of magnitude. The zeta rows say "no negative direction in this polynomial space", nothing more. Negative values are negative values of the form up to the matrix accuracy (quadrature error below 1e-200 for N = 320).
2. Onsets are located on a grid of step 0.1 (0.02 for DH). "Even first by one step" is a statement at that resolution.
3. Combination 4's crude margin depends on the cut of the well set (t <= 60 or 120) and on which part of the symbol is called positive mass; the ordering zeta < L(chi_-3) < L(chi_5) < DH was stable under the two cuts tried but no other splitting was tested. Unimodular twists were tested through real test functions only (their real parts).
