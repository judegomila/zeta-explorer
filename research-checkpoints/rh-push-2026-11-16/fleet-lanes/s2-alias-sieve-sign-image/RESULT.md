# s2-alias-sieve-sign-image: RESULT

Date 2026-11-19. Kind: screening (compute). Four combinations of twin-ladder / alias / sieve nodes of the idea graph, each turned into a finite statistic and run for zeta, two Dirichlet L-functions and the controls.
No statement about zeros of zeta is made. Labels: PROVED (elementary, argument given here), MEASURED (numerics; "40-digit checked" where an mpmath sum was compared), RECORD (taken from the cited repo file, read as text).

## 0. Verdict

**No survivor. 4 combinations tested, 4 closed.** In each one the statistic either cannot differ between objects at all (combination 2), or separates objects by a property that is not the location of zeros: the sign of the coefficients and the pole at s = 1 (combinations 1, 3 raw, 4), or the mean pair-correlation level of the zeros (combination 3 after pole removal). The control zeta(s+a) zeta(s-a) (zeros at 1/2 +- a + i gamma, off the line at every height) gives the same value as zeta to 6 digits in combinations 1 and 3 and passes with zeta in combinations 2 and 4 (leak 5.5e-10 against 3.3e-10 at q = 7, N = 1e10); the comparison L-functions fall on the side of the failing controls or between zeta and the controls. The T-NR control differs from zeta only in windows that contain a power of its prime q; there it fails through the size of one coefficient.

| # | combination (nodes) | statistic | sizes reached | zeta | L(s, chi) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | vonmangoldt-weighted-sign-image + residue-averaged-sign-image | theta_phys(p,k) with w = Lambda_F(n) x packet envelope; normaliser nu = sum w / sum abs(w); fail = theta >= 1 or nu <= 0 | 19 heights T = 1e6 .. 1.89e16; 2,975,143 packets (2,912,662 with p >= 3), p <= 97, all h, k <= 3; 5.5e10 prime powers; packet centres up to 4.6e13 at T = 3.0e12 and 1.5e16 at the top; DH at T = 1e6, 1e7 (1.2e6 windows) | positive envelope: 0 failures in 2,912,662 windows, max theta 0.4827 (p = 3), distance from the residue-uniform image at most 0.021 (T = 1e6) falling to 7e-5 (1.89e16); complex kernel n^(-iT): fails in 0.008 to 0.45 % of windows for T <= 1e13, in none of the 18,614 windows above | chi mod 5 and chi mod 101: fail in 48 to 52 % of windows at every height (1.46e6 and 1.49e6 failures) | SGN, UNI: fail in 49 to 52 %; DH (T = 1e6, 1e7): 54 to 55 %; E_a: identical to zeta, 0 failures; T-NR: 5,148 failures, all in windows holding a power of 3; Liouville: equals minus zeta on primes (nu = -1, theta unchanged); HEAT: not formulable | CLOSED. Separates "Lambda_F >= 0" from signed coefficients. L-functions fail; E_a passes |
| 2 | inertia-pcc-q-measurement + alpha-kh-pcc-gating-rigid | compression constant qPure = max_j abs(<phi(u_j), c>)/norm(c) on the 25-node model, defect vector D_j of the ladder with coefficients a_F(n); threshold 1.4326672; plus the share of measured weld mass on the alpha > 1 aliases | 21 seam points, N = 690988 .. 54799999 (T = 3.0e12 .. 1.89e16), up to 5.48e7 terms per point, 113-bit phases; 12 objects | sup 0.796, min 0.400, mean 0.527 (sd 0.125): not N-flat, no trend | 0.665 (chi5), 0.670 (chi101) | DH 0.738, Liouville 0.862, SGN 0.665, UNI 0.768, E_a 0.799, T-NR q=2: 0.934, q=3: 0.862, q=97: 0.988, HEAT 0.833. None can exceed 1 | CLOSED. qPure <= sqrt(K_max) <= 1 for every vector in C^25 (projection); the threshold 1.4327 is unreachable by any object. The measured alpha > 1 share is the same for all objects within sampling (0.05 to 0.11 at p = 7, 0.03 to 0.04 at p = 97) |
| 3 | localized-barrier-sum-akh + small-prime-weld-over-budget + ce17-carrier-contract-open-family | stationary-twist packet sum A_{k,h}, remainder R after removal of the pole term, r = abs(R)/M1, z = abs(R)/sqrt(M2); contract surrogate c_p = sqrt(sum_h m_h r_h^2) against R_ex = 0.27968819555 | same runs; in the contract window T >= 3.0e12: 12 heights, 150,548 packets; k = 1 statistics on 2.2e6 packets | no violation; max c_p 0.069 at 1e6, 3.2e-3 at 3.0e12, 3.9e-4 at 1.89e16; mean z^2 0.41 to 0.46 at all heights | no violation of R_ex; mean z^2 0.50 to 0.52 (chi5), 0.57 to 0.74 (chi101); above the matched threshold in 0.04 to 0.8 % (chi5) and 0.8 to 3 % (chi101) of windows | SGN, UNI: no violation of R_ex; mean z^2 0.96 to 1.05; above the matched threshold in 6 to 17 %; DH: no violation of R_ex, mean z^2 1.05 to 1.08; E_a: identical to zeta; T-NR: r = 1.000 in a window holding a power of 3, identical to zeta elsewhere | CLOSED. Fixed budget: no object fails except T-NR at powers of q. Matched threshold: a mean-square (pair-correlation, conductor) effect; E_a passes |
| 4 | alias-energy-in-sieve-algebra + five-shell-p97-identity + weld-commutator-alias-l2-collapse | sign of E_97(N,A,c) and leak = 1 - f_q, f_q = abs(sum_a c^(a/q))^2 / (phi(q) sum_a abs(c^(a/q))^2), on c = Lambda_F | N to 1e10 (4.55e8 primes), 40 coefficient vectors, q in {3,5,7,11,13,15,30,210,2310,30030,97}; DH to N = 1e8 | E_97 > 0 at all N; leak x N bounded (q = 7: 1 to 18; q = 97: 1.7e4 to 2.4e4; q = 30030: leak 0.9995 at 1e5, 0.022 at 1e10, N still below q phi(q)) | chi mod 101, 103, 107, 109: E_97 changes sign; leak 0.90 to 1.00 for q >= 7 | Liouville: E_97 < 0 at all N, leak as zeta; SGN, UNI (16 seeds each): E_97 changes sign, mean f equal to 0.88 to 1.5 times the no-pole value per q (pooled 1.09 and 0.99); DH: sign changes, leak 0.94 to 1.00 for q >= 7; E_a: as zeta; T-NR (q = 3): leak 0.77 falling to 0.094 at q = 7, 0.96 at q = 97 | CLOSED. Detects the pole at 1 and its sign; the decay rate of the leak is N^(2 Theta - 2) (zeros of L(s, chi mod q), verified height in another form) |

Two results that are new relative to the cited records (both MEASURED):
- The stationary-twist barrier sum with von Mangoldt weights is not a square-root-cancelling sum for zeta: abs(A_{k,h})/M1 = 0.3965 = (1 + 4 pi^2)^(-1/4) in every window (the pole term). After removing it, mean z^2 is 0.41 to 0.46 for zeta, 0.50 to 0.52 for chi mod 5, 0.57 to 0.74 for chi mod 101 and 0.96 to 1.05 for sign and unimodular twists, at every height from 1e6 to 1.89e16 (packets at n up to 1.5e16). The ordering and the sizes agree with the Goldston-Montgomery form of pair correlation on the prime side, variance proportional to log(q u/H) = log(q sqrt(T/2 pi)) against log u for uncorrelated signs (at T = 3.0e12: log sqrt(v) = 13.4, log 5 = 1.6, log 101 = 4.6, log u = 27 to 31). There is no change at alpha = 1: alpha > 1 aliases 0.36 to 0.45, alpha <= 1 aliases 0.41 to 0.47 for zeta, the difference being the larger log u.
- The measured share of the weld mass on the alpha > 1 aliases is 0.05 to 0.11 at p = 7 and 0.03 to 0.04 at p = 97 (all objects; T-NR differs below 1e11 through windows at powers of 3), against the majorant shares 0.237 and 0.296 (in the paired convention of the record: measured 0.22 to 0.37 and 0.17 to 0.24 against 0.474 and 0.593): the majorant overstates the alpha > 1 part by a factor 3.5 (p = 7) and 8.5 (p = 97), or 1.7 and 2.8 in the paired convention, because the relative remainder of a packet scales as H^(-1/2) and the alpha > 1 packets are the longest.

## 1. Definitions used (what was computed)

Sources read as text: `src/data/imp-95917-vonmangoldt-weighted-sign-image.js`, `imp-95898-single-window-sign-image-residue-average.js`, `imp-95519-localized-barrier-sum-prime-zero-nogo.js`, `imp-95217-inertia-pcc-q-measurement.js`, `imp-95540-alpha-over-one-fraction-table.js`, `imp-95548-per-prime-sbar-budget-viz-data.js`, `imp-95539-alias-energy-in-algebra-table.js`, `imp-95003-five-shell-identity.js`, `imp-95008-weld-alias-l2-collapse.js`. Several objects of the records are not fixed by them (the Fresnel-Airy packet psi_{k,h}, the carrier C_E,17, the constants C, K, norm(f), the evaluator convention of E_97: the record itself marks the anchor literal 0.2141254901198318 as blocked on convention). Each choice made here is stated; the classification does not depend on them, for the reasons in section 3.

**Objects.** Coefficients Lambda_F(n) of -F'/F: ZETA; CHI5 (complex character mod 5, chi(2) = i, the constituent of DH); CHI101 (Legendre symbol mod 101); SGN (eps_p = +-1 by a 64-bit hash of p, completely multiplicative on prime powers); UNI (e^{i theta_p}, hash); LIOU ((-1)^k log p at p^k); EA (Lambda(n)(n^a + n^-a), a = 1/4, i.e. zeta(s+a) zeta(s-a)); TNR (xi(s)(2 cosh((s - 1/2) log q) + c), q = 3, c = 2.2: Lambda(n) except Lambda_NR(q^k) = log q (1 - alpha^k - beta^k), alpha, beta = sqrt(q)(-c +- sqrt(c^2 - 4))/2, so abs(Lambda_NR(q^k)) grows like n^0.904); DH (Lambda_DH from the convolution recursion a * L = a log, a(n) = 1, kappa, -kappa, -1, 0 mod 5, computed for n <= 2^27, not supported on prime powers); HEAT: the backward heat family has no fixed Dirichlet series (map row 23), so no Lambda_F exists; it enters only combination 2 through the ladder factor exp((t/4) log^2 n) with t = -0.5.

**Packets.** For height T, v = T/(2 pi), alias (p, h, k): xi0 = k - h/p, centre c = v/xi0, width H = c/sqrt(v), psi(x) = exp(-x^2/2) cut at abs(x) <= 5, x = (n - c)/H. Kernel K(n) = (n/c)^(-sigma_B) psi(x) exp(-iT log(n/c)), sigma_B = 0.59045. Residue sums V_r = sum_{n = r mod p} Lambda_F(n) K(n) and P_r (same without the phase: the positive envelope), M1 = sum abs(Lambda_F) abs(K), M2 = sum abs(Lambda_F)^2 abs(K)^2. Windows on a common grid T_j = T0 + j dT, dT = 2 * 2 pi sqrt(v0) (centres 2H apart).

**(1) theta_phys.** G_ml the exact Gram of the port model of imp-95898 (mu = d^(1/3)/1.7, u = 2.3/d, d = k - h/p; all G_ml > 0). theta = sum_D g(D) (W^(D) + W^(-D))/2 / (S W^(0)), W^(D) = sum_r w_r e(-Dr/p), g(D) = sum of G_ml over h_m - h_l = D, S = sum G. Two weights: w = P (positive envelope) and w = V (the complex packet kernel). S depends on (p,k) only and is positive for every object; the quantity that can vanish is the normaliser, recorded as nu = Re W^(0)/M1. Fail = Re theta >= 1 or nu <= 0. Windows: every packet (p, h, k) is used as a window weight (p <= 97, all h, k = 1; k = 2, 3 for p <= 13). p = 2 has one alias and theta = 1 identically; p = 3 has cos(2 pi D/3) = -1/2 for both D, so theta is the residue-uniform value 0.4827 for every weight supported off 3 | n: for p = 3 only nu can fail.

**(3) A_{k,h}, remainder and contract surrogate.** A_{k,h} = sum_r V_r e(-hr/p): the twist that cancels the linear phase of n^(-iT) at the packet (the stationary alias). For an object with a pole at 1 the density-one model of Lambda gives A = I + R, I = e(xi0 c) H int (1+y)^(-sigma_B) psi(x) exp(-iT (log(1+y) - y)) dx, y = xH/c (PROVED as the all-integer sum: checked to 1e-10 by running the engine with a(n) = 1 on all integers). R = A - I for ZETA, EA (with its own factor), TNR; R = A for objects without a pole. r = abs(R)/M1, z = abs(R)/sqrt(M2). Surrogate of the contract abs(C_E,17) <= Q sqrt(Sbar) at unit weld constants: c_p(T) = sqrt(sum_{h=1}^{p-1} m_h r_h(T)^2), m_h = p^(-4/3) min(h, p-h)^(-2/3), so that r = 1 gives sqrt(Sbar_p) (0.630 at p = 2, the table of imp-95548) and the trivial bound is the majorant. Fixed budget: c_p < R_ex, and the cumulative sqrt(sum_p c_p^2) < R_ex. "Heat time lowered until zeta's margin is 10 %" was implemented as a matched threshold: tau_p = 1.1 max_j c_p(zeta; T_j), then the fraction of windows of each object above tau_p. (Lowering the heat time changes the smooth factor b_n = exp((t/4) log^2 n), which is constant across a packet to relative 1e-5 and cancels in r; a threshold rescaling is the only way to bring zeta's margin to 10 %.)

**(2) Q.** Nodes u_j = log p_j / log 97, span of 1, u, ..., u^17 on the 25 nodes, orthonormal basis Phi (60-digit Gram-Schmidt on Chebyshev columns). Ladder c_n = a_F(n) exp((t0/4) log^2 n) n^(-sigma_B - iT), t0 = 0.123637595, T = 2 pi (N^2 - t0/16 + w(2N+1)); defect D_j = sum of c_n over n <= N (or N+1) whose largest prime factor among the 25 primes is p_j (the eq.-(13) telescope, descending primes); Y_4 = sum over n coprime to all 25; E_97 = Y_4 - sum_j D_j. qPure = max_j abs(<phi(u_j), Phi^T D>)/norm(Phi^T D); inertia of Phi^T diag(Re D) Phi; ensemble density rho over the 21 points and qVN = sqrt(lambda_max(rho) K_max). a_F(n) = Dirichlet coefficients of F: 1; chi(n); Liouville; hash signs and phases (completely multiplicative); n^(-a) sigma_{2a}(n); T-NR 1 + c sqrt(q)[q | n] + q[q^2 | n] for q = 2, 3, 97; DH a(n); HEAT t = -0.5. The second term gamma(x) n^(-s_A) of the record's coefficient vector is omitted (its convention is not recoverable from the record), so abs(E_97) here is not the record's value.

**(4) Five-shell functional and sieve-algebra fraction.** c_n = Lambda_F(n), n <= N. Y_4 = sum over n coprime to the 25 primes, Z_g = sum over n whose smallest prime factor among the 25 lies in block g (blocks of sizes 5, 5, 7, 8); E_97(N, A, c) = (1-A) Y_4 - A sum_g Z_g, A in {0.1, 0.5, 0.9}. Alias vector c^(a/q) = sum_{n<=N} c_n e(an/q), a in (Z/q)^*; the sieve algebra contains only the Ramanujan direction c_q, so the in-algebra fraction of the level-q alias energy is f_q above. Reference values: 1/phi(q) for a single alias e(an/q) over a full period (Theorem U of the record); for a vector supported on integers coprime to q with no principal-character bias, E f_q = 1/sum_chi cond(chi) = 1/prod_{p | q}(1 + p(p-2)) (PROVED: Gauss-sum expansion, abs(tau(chi))^2 = cond(chi) for squarefree q), e.g. 1/36 at q = 7.

## 2. Validation and precision (all MEASURED)

`validate.py` (local and on the server, same numbers): (i) theta_phys reproduces the four recorded values of imp-95917 with its proxy weight (0.063451, 0.028574, 0.010205, 0.250922) and the four residue-uniform values of imp-95898 to 6 digits; (ii) engine with a(n) = 1 on all integers equals the pole term I to relative 2e-13 .. 8e-11, other twists below 1.4e-9; (iii) engine against 40-digit mpmath sums over all prime powers of a block, all 7 objects, all residues: error below 3e-13 of M1; (iv) hash-sign and hash-phase controls: mean z^2 = 1.13 and 1.07 on 400 windows (expected 1, standard error 0.05); on the full runs 0.96 to 1.05; (v) Lambda_DH: convolution identity to 9e-16, sum Lambda_DH(n) n^-3 against -f'/f(3) by Hurwitz zeta to 8e-14.
`mpcheck_big.py`, `mpcheck_theta.py`: float64 engine against 40-digit sums at the contract heights T = 3.0e12 and 2.38e14: r, z, theta, nu agree to 9 to 13 digits when the block holds no prime square (the 40-digit sums omit prime squares; with 2 to 3 prime squares in the block the difference is 1e-4 relative, as expected). These are the re-checks of the float64 results at higher precision; they cover a passing object (zeta) and failing ones (chi mod 101, hash signs).
Table front end against sieve front end (independent code paths for the set of n): zeta columns identical (0.0 difference in r and theta on 2600 shared windows; mean z^2 0.41493 by both at T = 1e6).
`q_seam.py`: the basis reproduces the recorded 1 - K(u_j) = 1.70e-18, 1.49e-15, 3.90e-12 at p = 2, 3, 5; telescope and five-shell identities hold to 1e-12 relative for all 12 objects; phases frac(v log n) computed in binary128.
GPU: not used. The cost is the segmented sieve (CPU) and scatter-adds into residue bins; the CPU engine reached 1e8 sieved integers per core-second and its float64 output is checked against 40-digit sums, so a float64 GPU stage would add no information.

## 3. Why each combination is closed

**(1) PROVED part.** With w >= 0 and G > 0, theta is a convex average of cosines: theta < 1. This uses only Lambda_F >= 0. It holds for E_a for every a (zeros at 1/2 +- a), so passing carries no information on zeros. With signed or complex weights the normaliser sum w has no main term (no pole at 1) and is of size sqrt(M2); theta is then a ratio of two fluctuating sums. MEASURED: every object without Lambda_F >= 0 fails in about half of all windows at every height from 1e6 to 1.89e16, including both L-functions, which are supposed to behave like zeta. With the complex packet kernel of the record zeta fails too for T <= 1e13 (table T1b, up to 0.45 % of windows); above 2e13 the untwisted sum of zeta is dominated by its pole term -I/(p-1) and theta settles at 0.55 to 0.95, while the objects without a pole keep failing in about 0.1 % of windows. The dividing property is again the pole. T-NR fails exactly in windows that hold an even power of 3 (nu = -0.9999 at 3^28, T = 2.96e12; `tnr_target.json`): one coefficient of size n^0.904 against a window mass of size H. That is the non-tempered local factor at q (map row 34), one prime, not all primes; the exponent 0.904 is the real part of the zeros of the cosh factor.

**(2) PROVED.** K(u_j) = sum_i phi_i(u_j)^2 is a diagonal entry of an orthogonal projection of rank 18 in C^25, so K <= 1 and qPure <= sqrt(K_max) <= 1 for every defect vector; the record states this itself. MEASURED: sup over 21 seam points between 0.665 and 0.988 for the 12 objects, none above 1; the largest is T-NR with q = 97 (0.988: the defect vector concentrates on the node p = 97, where K = 1 - 5.0e-5). Inertia: negative index between 4 and 14 at every point for every object (the compressed form is indefinite for all). The zeta value is not N-flat (0.40 to 0.80, no trend). The alpha_{k,h} > 1 fraction of the record is a property of h/p and 1/(2 pi) only, hence identical for all objects by construction; its measured counterpart (table T2b) is also the same for all objects.

**(3)** (a) PROVED: the statistic is local in n and homogeneous of degree 0 in the weights, so multiplying Lambda(n) by a factor that is smooth on the scale H (n^a + n^-a, exp((t/4) log^2 n)) changes r and z by O(a H/c) = O(a/sqrt(v)) <= 1e-3 .. 1e-8. MEASURED: the EA column equals the ZETA column to 6 digits at every height. Hence E_a, with zeros off the line at every height, passes wherever zeta passes; in absolute size at abscissa sigma_B its sums are larger by c^a, and with zeta's measured margin (c_p <= 3.2e-3 against 0.2797 at 3.0e12, decreasing like T^(-1/4)) E_a stays inside the fixed budget for a < log(87)/log(4.6e13) = 0.14 at 3.0e12, and since c_p falls like v^(-1/4) while c^a <= (97 v)^a, for every a < 1/4 at large T. (b) The fixed budget is not violated by any object: the contract concerns sums of 1e5 to 2.6e8 prime terms whose relative remainder is 1e-2 to 1e-5. With the pole term kept, zeta itself exceeds the cumulative budget (0.74 against 0.2797), which is the over-budget statement of imp-95548 with the factor 0.3965. (c) At the matched threshold the sign and unimodular twists exceed it in 6 to 17 % of windows and the L-functions in 0.04 to 3 %: this is the ratio of mean squares (1.00 : 0.62 : 0.51 : 0.45 at 3.0e12; mean c_p^2 relative to zeta 2.1 to 2.4, 1.2 to 1.8, 1.05 to 1.25), i.e. the pair-correlation level log(q sqrt(v))/log u of the zeros near T. It is a mean-value statement (MV-CAP: it bounds no single window), it orders objects by conductor, and it is blind to E_a. (d) T-NR: r = 0.99994 in a window on 3^28 or 3^29 (`tnr_target.json`), and equal to zeta in every window without a power of 3 (table T3d counts them).

**(4)** PROVED: for a vector supported on prime powers, sum over a in (Z/q)^* of c^(a/q) = mu(q) sum_{(n,q)=1} c_n, so f_q = abs(psi_F(N, chi_0))^2 / sum_chi cond-weighted abs(psi_F(N, chi))^2: the in-algebra part is the principal character, which is large exactly when -F'/F has a pole at 1. MEASURED: leak x N stays bounded for zeta, Liouville and E_a to N = 1e10 (rate N^(2 Theta - 2) with Theta = 1/2 for the characters mod q: a restatement of the low zeros of L(s, chi mod q), q <= 30030, being on the line); for the four L-functions, the 32 random twists and DH the leak is 0.90 to 1.00 for q >= 7 and the mean of f over seeds equals the no-pole value 1/prod(1 + p(p-2)) within a factor 0.88 to 1.5 (for q = 3, 5 the no-pole value of the leak is 0.75 and 0.94 and f is a ratio of two or four fluctuating sums); T-NR has leak 0.094 to 0.96 at N = 1e10 through the terms at powers of 3 (size N^0.904). The sign of E_97 is the sign of the residue of -F'/F at 1: + for zeta, E_a, T-NR; - for Liouville; changing for everything without a pole. The comparison L-functions fail both parts.

**Controls: where each one stopped.**

| control | (1) | (2) | (3) fixed budget / matched | (4) |
|---|---|---|---|---|
| Davenport-Heilbronn | fails, 54 to 55 % of windows (T = 1e6, 1e7; signed Lambda_DH) | passes (<= 1) | passes / mean z^2 1.05 to 1.08, mean c_p 1.8 to 2.5 x zeta | fails (no pole) |
| backward heat | not formulable (no Lambda_F) | passes (<= 1) | not formulable; the smooth factor cancels | not formulable |
| sign-twisted primes | hash signs: fails 49 to 52 %; Liouville: nu = -1 | passes | passes / fails 6 to 17 % | hash: fails; Liouville: wrong sign of E_97, leak as zeta |
| unimodular twist | fails 49 to 52 % | passes | passes / fails 6 to 17 % | fails |
| zeta(s+a) zeta(s-a), a = 1/4 | passes, identical to zeta | passes | passes / passes, identical to zeta | passes |
| T-NR | fails only at even powers of q | passes | fails only at powers of q | fails slowly (N^-0.096) |
| L(s, chi) (should pass) | fails 48 to 52 % | passes | passes / 0.04 to 3 % | fails |

No test meets the survivor definition: in (1) and (4) the comparison L-functions fail and E_a passes; in (2) nothing can fail; in (3) no control fails the fixed budget except T-NR at one prime, and the matched-threshold separation is a mean square that E_a passes.

## 4. Sizes and server use

All server work went through `rhrun`; `rhstatus` was read before each launch; requested at most 8 cores and 12 GB at any time. The server load average was 150 to 200 during the run and each unit received about 1.2 cores regardless of the request, so the packet plan was run at 0.3 of the planned sieve-length caps and split into units of 1 to 2 workers. Totals: 19 heights, 2,975,143 (window, alias) packets, 1.6e12 integers sieved, 5.5e10 prime powers accumulated; largest single block 2.0e8 prime powers (p = 97, h = 96 at T = 3.0e12, H = 6.7e7). One unit was killed by its memory limit (alias sieve, 3 GB: a 40 x 3.5e6 complex weight block); the block was cut to 4e5 primes and the job rerun inside the same limit, then extended to N = 1e10. Units: build (1), packets (4 first-pass, 4 second-pass at further contract heights), alias sieve, seam Q, DH table run (stopped after T = 1e7; the T = 1e8 pass had full alias sets only for p = 2, 3), analysis. All units are stopped.

Not done: DH above T = 1e7 in the packet tests (Lambda_DH needs all n up to 97 v); the cumulative contract over all 25 primes on more than 4 to 15 common windows above 1e11 (the p = 97 alias set limits the window count; per-prime pooled values are given instead); the top height T = 1.887e16 (N about 54,799,245; the exact seam value 2 pi 54799999^2 = 1.88687e16 was mistyped by 2.7e-5 relative) has full alias sets for p = 2, 3 only, 386 packets, largest centre 1.5e16; the record's own E_97 convention.

## 5. Tables

Totals: 19 heights, 2975143 (window, alias) pairs, sieved length 1.625e+12, prime powers processed 5.521e+10. In the contract window T >= 3.0e12: 12 heights, 150548 pairs.

### T1a. Combination (1), positive envelope: max Re theta_phys / fraction of windows failing (theta >= 1 or normaliser <= 0) / min normaliser nu  (p >= 3)

| T0 | windows | ZETA | CHI5 | CHI101 | SGN | UNI | EA | TNR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000e+06 | 604000 | 0.483 / 0 / 1 | 40.06 / 0.494 / -0.167 | 8227 / 0.51 / -0.433 | 1.552e+04 / 0.511 / -0.378 | 21.19 / 0.49 / -0.308 | 0.483 / 0 / 1 | 24.7 / 0.00589 / -0.988 |
| 1.000e+07 | 604000 | 0.4828 / 0 / 1 | 36.65 / 0.507 / -0.16 | 4.053e+04 / 0.51 / -0.234 | 4.288e+04 / 0.51 / -0.311 | 308 / 0.515 / -0.165 | 0.4828 / 0 / 1 | 50.37 / 0.00178 / -0.992 |
| 1.000e+08 | 604000 | 0.4828 / 0 / 1 | 222.5 / 0.497 / -0.087 | 1744 / 0.515 / -0.137 | 3.054e+04 / 0.51 / -0.176 | 26.5 / 0.497 / -0.148 | 0.4828 / 0 / 1 | 48.95 / 0.000652 / -0.996 |
| 1.000e+09 | 481560 | 0.4827 / 0 / 1 | 92.96 / 0.5 / -0.0602 | 4.795e+04 / 0.508 / -0.0905 | 1.141e+04 / 0.501 / -0.126 | 20.86 / 0.507 / -0.0913 | 0.4827 / 0 / 1 | 2.747 / 0.000201 / -0.998 |
| 1.000e+10 | 305520 | 0.4827 / 0 / 1 | 19.47 / 0.501 / -0.0425 | 7112 / 0.51 / -0.061 | 1.55e+04 / 0.503 / -0.0701 | 9.774 / 0.505 / -0.0527 | 0.4827 / 0 / 1 | 0.4827 / 7.86e-05 / -0.999 |
| 1.000e+11 | 137678 | 0.4827 / 0 / 1 | 20.98 / 0.502 / -0.0231 | 1.077e+04 / 0.507 / -0.0367 | 2064 / 0.504 / -0.0509 | 14.83 / 0.501 / -0.0314 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 1.000e+12 | 46146 | 0.4827 / 0 / 1 | 6.626 / 0.504 / -0.0129 | 197.7 / 0.511 / -0.0186 | 507.9 / 0.507 / -0.0251 | 15.86 / 0.499 / -0.017 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 3.000e+12 | 25402 | 0.4827 / 0 / 1 | 11.18 / 0.499 / -0.0106 | 588.3 / 0.509 / -0.0157 | 198.7 / 0.509 / -0.0182 | 27.69 / 0.501 / -0.0127 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 4.000e+12 | 21568 | 0.4827 / 0 / 1 | 4.304 / 0.499 / -0.00884 | 337.4 / 0.505 / -0.0143 | 486.3 / 0.503 / -0.0171 | 10.73 / 0.504 / -0.0138 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 5.000e+12 | 19054 | 0.4827 / 0 / 1 | 2.932 / 0.508 / -0.00935 | 113.8 / 0.503 / -0.0131 | 495 / 0.496 / -0.0184 | 2.921 / 0.502 / -0.0116 | 0.4827 / 0 / 1 | 0.4827 / 0.00021 / -1 |
| 6.000e+12 | 17204 | 0.4827 / 0 / 1 | 4.016 / 0.498 / -0.00837 | 162 / 0.507 / -0.0129 | 299.5 / 0.503 / -0.0161 | 5.295 / 0.499 / -0.0118 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 8.000e+12 | 14828 | 0.4827 / 0 / 1 | 10.29 / 0.503 / -0.00773 | 81.22 / 0.511 / -0.0109 | 220.5 / 0.501 / -0.0148 | 6.739 / 0.502 / -0.0101 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 1.000e+13 | 13088 | 0.4827 / 0 / 1 | 2.358 / 0.503 / -0.00701 | 47.92 / 0.506 / -0.0107 | 326.4 / 0.497 / -0.014 | 3.828 / 0.503 / -0.0107 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 2.000e+13 | 9062 | 0.4827 / 0 / 1 | 2.287 / 0.503 / -0.00553 | 371.6 / 0.504 / -0.00884 | 138.2 / 0.508 / -0.011 | 4.711 / 0.504 / -0.00859 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 1.000e+14 | 3942 | 0.4827 / 0 / 1 | 1.703 / 0.499 / -0.00364 | 31.68 / 0.504 / -0.00596 | 34.06 / 0.49 / -0.00824 | 1.993 / 0.501 / -0.00573 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 2.379e+14 | 2570 | 0.4827 / 0 / 1 | 2.195 / 0.489 / -0.00302 | 44.08 / 0.511 / -0.00516 | 657.4 / 0.512 / -0.00679 | 1.835 / 0.518 / -0.0048 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 5.000e+14 | 1570 | 0.4827 / 0 / 1 | 1.332 / 0.504 / -0.00234 | 5.125 / 0.508 / -0.00444 | 229.2 / 0.49 / -0.00478 | 1.006 / 0.49 / -0.00358 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 1.000e+15 | 1132 | 0.4827 / 0 / 1 | 1.049 / 0.515 / -0.0021 | 11.55 / 0.492 / -0.00303 | 65.1 / 0.505 / -0.00449 | 0.6692 / 0.504 / -0.00259 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |
| 1.887e+16 | 338 | 0.4827 / 0 / 1 | 1.075 / 0.479 / -0.000845 | 2.875 / 0.479 / -0.000989 | 2.361 / 0.485 / -0.00164 | 0.7166 / 0.515 / -0.00117 | 0.4827 / 0 / 1 | 0.4827 / 0 / 1 |

### T1b. Combination (1), complex packet kernel n^(-sigma_B - iT) psi: max Re theta / failing fraction

| T0 | ZETA | CHI5 | CHI101 | SGN | UNI | EA | TNR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000e+06 | 24.5 / 0.0032 | 58.7 / 0.00095 | 12.6 / 0.001 | 14.2 / 0.00097 | 41.1 / 0.00098 | 24.7 / 0.0032 | 24.5 / 0.0033 |
| 1.000e+07 | 194 / 0.0036 | 36.6 / 0.00093 | 31.3 / 0.001 | 34.6 / 0.001 | 33.6 / 0.00097 | 169 / 0.0036 | 194 / 0.0036 |
| 1.000e+08 | 84 / 0.004 | 20.8 / 0.00084 | 9.33 / 0.0011 | 15.6 / 0.001 | 50.9 / 0.001 | 84.4 / 0.004 | 84 / 0.004 |
| 1.000e+09 | 54.5 / 0.0045 | 29.6 / 0.00093 | 19.2 / 0.0011 | 17.5 / 0.0011 | 72.4 / 0.0012 | 54.6 / 0.0045 | 54.5 / 0.0045 |
| 1.000e+10 | 62.2 / 0.0031 | 20.9 / 0.00099 | 9.73 / 0.0011 | 14.7 / 0.0011 | 34 / 0.0011 | 62.4 / 0.0031 | 62.2 / 0.0031 |
| 1.000e+11 | 23 / 0.0031 | 13.4 / 0.0007 | 10.3 / 0.0011 | 6.66 / 0.0012 | 15 / 0.0011 | 23 / 0.0031 | 23 / 0.0031 |
| 1.000e+12 | 24.7 / 0.0016 | 15.2 / 0.0008 | 21.4 / 0.00078 | 12 / 0.00089 | 8.01 / 0.00078 | 24.7 / 0.0016 | 24.7 / 0.0016 |
| 3.000e+12 | 2.69 / 0.00071 | 58.4 / 0.00055 | 8.38 / 0.00083 | 4.27 / 0.0011 | 2.65 / 0.00075 | 2.69 / 0.00071 | 2.69 / 0.00071 |
| 4.000e+12 | 2.92 / 0.0006 | 6.27 / 0.00083 | 4.95 / 0.00083 | 2.39 / 0.00088 | 3.57 / 0.0013 | 2.92 / 0.0006 | 2.92 / 0.0006 |
| 5.000e+12 | 1.82 / 0.00058 | 2.23 / 0.001 | 3.08 / 0.00073 | 5.2 / 0.001 | 3.22 / 0.00094 | 1.82 / 0.00058 | 1.82 / 0.00058 |
| 6.000e+12 | 5.27 / 0.00052 | 6.12 / 0.00076 | 3.09 / 0.001 | 3.14 / 0.00093 | 6.98 / 0.0007 | 5.27 / 0.00052 | 5.27 / 0.00052 |
| 8.000e+12 | 1.72 / 0.00027 | 3.47 / 0.00067 | 3.51 / 0.00034 | 2.78 / 0.0011 | 1.94 / 0.00094 | 1.72 / 0.00027 | 1.72 / 0.00027 |
| 1.000e+13 | 1.16 / 7.6e-05 | 2.2 / 0.00084 | 6.39 / 0.00061 | 2.96 / 0.00076 | 3.82 / 0.00099 | 1.16 / 7.6e-05 | 1.16 / 7.6e-05 |
| 2.000e+13 | 0.946 / 0 | 1.86 / 0.00044 | 3.28 / 0.0013 | 2.24 / 0.00044 | 2.83 / 0.0012 | 0.946 / 0 | 0.946 / 0 |
| 1.000e+14 | 0.685 / 0 | 2.56 / 0.00076 | 2.46 / 0.00025 | 1.69 / 0.00076 | 3.29 / 0.0015 | 0.685 / 0 | 0.685 / 0 |
| 2.379e+14 | 0.626 / 0 | 2.09 / 0.0016 | 1.58 / 0.00039 | 3.63 / 0.00078 | 1.18 / 0.0012 | 0.626 / 0 | 0.626 / 0 |
| 5.000e+14 | 0.557 / 0 | 0.921 / 0 | 1.13 / 0.0013 | 2.2 / 0.0013 | 1.86 / 0.00064 | 0.557 / 0 | 0.557 / 0 |
| 1.000e+15 | 0.555 / 0 | 3.75 / 0.0018 | 1.55 / 0.00088 | 0.734 / 0 | 0.854 / 0 | 0.555 / 0 | 0.555 / 0 |
| 1.887e+16 | 0.554 / 0 | 0.483 / 0 | 0.524 / 0 | 0.821 / 0 | 1.02 / 0.003 | 0.554 / 0 | 0.554 / 0 |

### T3a. Normalised remainder of the stationary-twist packet sum, k = 1: mean z^2 (z = |R|/sqrt(M2)); alpha > 1 aliases / alpha <= 1 aliases in brackets

| T0 | pairs | ZETA | CHI5 | CHI101 | SGN | UNI | EA | TNR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000e+06 | 470000 | 0.415 (0.357 / 0.425) | 0.509 (0.454 / 0.518) | 0.738 (0.684 / 0.748) | 1.018 (0.974 / 1.025) | 1.017 (1.019 / 1.017) | 0.415 (0.357 / 0.425) | 0.422 (0.364 / 0.432) |
| 1.000e+07 | 470000 | 0.408 (0.369 / 0.415) | 0.509 (0.457 / 0.518) | 0.729 (0.630 / 0.746) | 0.989 (1.017 / 0.984) | 1.010 (0.999 / 1.012) | 0.408 (0.369 / 0.415) | 0.410 (0.373 / 0.417) |
| 1.000e+08 | 470000 | 0.422 (0.383 / 0.429) | 0.510 (0.467 / 0.517) | 0.673 (0.619 / 0.683) | 1.002 (0.996 / 1.003) | 1.000 (1.002 / 0.999) | 0.422 (0.383 / 0.429) | 0.423 (0.385 / 0.429) |
| 1.000e+09 | 347560 | 0.427 (0.393 / 0.432) | 0.510 (0.471 / 0.516) | 0.662 (0.616 / 0.670) | 0.999 (1.009 / 0.997) | 0.996 (1.002 / 0.995) | 0.427 (0.393 / 0.432) | 0.427 (0.394 / 0.433) |
| 1.000e+10 | 182762 | 0.436 (0.409 / 0.440) | 0.508 (0.473 / 0.514) | 0.645 (0.604 / 0.651) | 1.002 (0.998 / 1.003) | 0.999 (0.996 / 1.000) | 0.436 (0.409 / 0.440) | 0.436 (0.410 / 0.440) |
| 1.000e+11 | 76452 | 0.444 (0.418 / 0.448) | 0.506 (0.477 / 0.510) | 0.636 (0.590 / 0.642) | 0.998 (1.006 / 0.997) | 0.996 (1.001 / 0.995) | 0.444 (0.418 / 0.448) | 0.444 (0.418 / 0.448) |
| 1.000e+12 | 25962 | 0.449 (0.411 / 0.454) | 0.507 (0.486 / 0.509) | 0.623 (0.591 / 0.627) | 0.997 (1.031 / 0.992) | 0.999 (1.002 / 0.998) | 0.449 (0.411 / 0.454) | 0.449 (0.411 / 0.454) |
| 3.000e+12 | 13906 | 0.448 (0.417 / 0.453) | 0.500 (0.478 / 0.503) | 0.628 (0.588 / 0.634) | 0.979 (0.966 / 0.981) | 1.011 (1.009 / 1.011) | 0.448 (0.417 / 0.453) | 0.448 (0.417 / 0.453) |
| 4.000e+12 | 11617 | 0.443 (0.392 / 0.450) | 0.510 (0.473 / 0.515) | 0.616 (0.574 / 0.622) | 0.999 (0.947 / 1.006) | 1.007 (1.015 / 1.006) | 0.443 (0.392 / 0.450) | 0.443 (0.392 / 0.450) |
| 5.000e+12 | 10160 | 0.450 (0.413 / 0.454) | 0.509 (0.471 / 0.514) | 0.624 (0.587 / 0.629) | 0.981 (0.979 / 0.982) | 0.999 (0.962 / 1.003) | 0.450 (0.413 / 0.454) | 0.450 (0.413 / 0.454) |
| 6.000e+12 | 9094 | 0.447 (0.413 / 0.451) | 0.496 (0.451 / 0.502) | 0.620 (0.577 / 0.626) | 0.982 (0.974 / 0.983) | 0.998 (0.992 / 0.999) | 0.447 (0.413 / 0.451) | 0.447 (0.413 / 0.451) |
| 8.000e+12 | 7795 | 0.453 (0.450 / 0.453) | 0.499 (0.481 / 0.502) | 0.613 (0.585 / 0.617) | 0.991 (1.065 / 0.981) | 1.002 (0.935 / 1.011) | 0.453 (0.450 / 0.453) | 0.453 (0.450 / 0.453) |
| 1.000e+13 | 6803 | 0.442 (0.392 / 0.449) | 0.511 (0.495 / 0.513) | 0.609 (0.577 / 0.613) | 0.998 (1.006 / 0.997) | 1.010 (1.016 / 1.010) | 0.442 (0.392 / 0.449) | 0.442 (0.392 / 0.449) |
| 2.000e+13 | 4634 | 0.458 (0.421 / 0.464) | 0.517 (0.496 / 0.519) | 0.617 (0.572 / 0.623) | 1.000 (0.933 / 1.010) | 0.991 (1.061 / 0.981) | 0.458 (0.421 / 0.464) | 0.458 (0.421 / 0.464) |
| 1.000e+14 | 1981 | 0.457 (0.393 / 0.469) | 0.518 (0.473 / 0.526) | 0.611 (0.599 / 0.614) | 1.004 (0.994 / 1.006) | 1.020 (1.046 / 1.016) | 0.457 (0.393 / 0.469) | 0.457 (0.393 / 0.469) |
| 2.379e+14 | 1304 | 0.457 (0.438 / 0.460) | 0.504 (0.469 / 0.510) | 0.574 (0.519 / 0.584) | 1.015 (0.893 / 1.039) | 1.011 (0.997 / 1.013) | 0.457 (0.438 / 0.460) | 0.457 (0.438 / 0.460) |
| 5.000e+14 | 702 | 0.433 (0.411 / 0.437) | 0.507 (0.508 / 0.507) | 0.598 (0.576 / 0.603) | 0.955 (0.994 / 0.946) | 0.958 (0.923 / 0.966) | 0.433 (0.411 / 0.437) | 0.433 (0.411 / 0.437) |
| 1.000e+15 | 529 | 0.430 (0.444 / 0.426) | 0.510 (0.440 / 0.528) | 0.567 (0.500 / 0.584) | 1.045 (1.143 / 1.020) | 0.958 (0.925 / 0.966) | 0.430 (0.444 / 0.426) | 0.430 (0.444 / 0.426) |
| 1.887e+16 | 218 | 0.408 (0.000 / 0.408) | 0.521 (0.000 / 0.521) | 0.588 (0.000 / 0.588) | 1.053 (0.000 / 1.053) | 0.885 (0.000 / 0.885) | 0.408 (0.000 / 0.408) | 0.408 (0.000 / 0.408) |

### T3b. Contract surrogate per prime, pooled over the primes with a full alias set: max c_p / fraction of windows with c_p >= R_ex / fraction above the matched threshold 1.1 max c_p(zeta) / mean c_p^2 relative to zeta

| T0 | primes | windows | ZETA | CHI5 | CHI101 | SGN | UNI | EA | TNR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000e+06 | 25 | 19600 | 0.0693 / 0 / 0 / 1.00 | 0.0664 / 0 / 0.000408 / 1.21 | 0.081 / 0 / 0.0188 / 1.76 | 0.118 / 0 / 0.0993 / 2.37 | 0.0999 / 0 / 0.0807 / 2.33 | 0.0693 / 0 / 0 / 1.00 | 0.623 / 0.0046 / 0.161 / 3.45 |
| 1.000e+07 | 25 | 19600 | 0.0555 / 0 / 0 / 1.00 | 0.0442 / 0 / 0.00107 / 1.25 | 0.065 / 0 / 0.0298 / 1.77 | 0.06 / 0 / 0.135 / 2.33 | 0.0651 / 0 / 0.146 / 2.41 | 0.0555 / 0 / 0 / 1.00 | 0.626 / 0.0021 / 0.0529 / 1.94 |
| 1.000e+08 | 25 | 19600 | 0.0322 / 0 / 0 / 1.00 | 0.0318 / 0 / 0.00122 / 1.23 | 0.0356 / 0 / 0.0197 / 1.61 | 0.0466 / 0 / 0.167 / 2.35 | 0.0399 / 0 / 0.155 / 2.33 | 0.0322 / 0 / 0 / 1.00 | 0.628 / 0.00087 / 0.0203 / 1.58 |
| 1.000e+09 | 25 | 17874 | 0.0181 / 0 / 0 / 1.00 | 0.018 / 0 / 0.000727 / 1.21 | 0.0215 / 0 / 0.0105 / 1.57 | 0.0261 / 0 / 0.117 / 2.32 | 0.0265 / 0 / 0.106 / 2.31 | 0.0181 / 0 / 0 / 1.00 | 0.629 / 0.00039 / 0.00649 / 1.32 |
| 1.000e+10 | 25 | 13410 | 0.0115 / 0 / 0 / 1.00 | 0.0119 / 0 / 0.000522 / 1.17 | 0.013 / 0 / 0.0105 / 1.48 | 0.0172 / 0 / 0.0931 / 2.26 | 0.0156 / 0 / 0.0895 / 2.26 | 0.0115 / 0 / 0 / 1.00 | 0.63 / 0.00037 / 0.00179 / 1.72 |
| 1.000e+11 | 25 | 8016 | 0.00682 / 0 / 0 / 1.00 | 0.00578 / 0 / 0.000749 / 1.14 | 0.00738 / 0 / 0.00798 / 1.43 | 0.0117 / 0 / 0.0581 / 2.17 | 0.0093 / 0 / 0.0558 / 2.20 | 0.00682 / 0 / 0 / 1.00 | 0.00682 / 0 / 0 / 1.00 |
| 1.000e+12 | 25 | 4265 | 0.0047 / 0 / 0 / 1.00 | 0.00416 / 0 / 0.00258 / 1.18 | 0.00454 / 0 / 0.0108 / 1.44 | 0.00544 / 0 / 0.0621 / 2.22 | 0.00577 / 0 / 0.0607 / 2.28 | 0.0047 / 0 / 0 / 1.00 | 0.0047 / 0 / 0 / 1.00 |
| 3.000e+12 | 20 | 2590 | 0.00324 / 0 / 0 / 1.00 | 0.00309 / 0 / 0.00425 / 1.14 | 0.00385 / 0 / 0.0162 / 1.42 | 0.00402 / 0 / 0.0629 / 2.12 | 0.00509 / 0 / 0.068 / 2.19 | 0.00324 / 0 / 0 / 1.00 | 0.00324 / 0 / 0 / 1.00 |
| 4.000e+12 | 18 | 2235 | 0.00267 / 0 / 0 / 1.00 | 0.00257 / 0 / 0.00582 / 1.18 | 0.00312 / 0 / 0.0179 / 1.44 | 0.00377 / 0 / 0.0828 / 2.27 | 0.00376 / 0 / 0.0774 / 2.29 | 0.00267 / 0 / 0 / 1.00 | 0.00267 / 0 / 0 / 1.00 |
| 5.000e+12 | 17 | 1994 | 0.00254 / 0 / 0 / 1.00 | 0.00291 / 0 / 0.00451 / 1.16 | 0.00352 / 0 / 0.0186 / 1.41 | 0.00434 / 0 / 0.0712 / 2.25 | 0.00387 / 0 / 0.0722 / 2.21 | 0.00254 / 0 / 0 / 1.00 | 0.00254 / 0 / 0 / 1.00 |
| 6.000e+12 | 16 | 1816 | 0.00257 / 0 / 0 / 1.00 | 0.00244 / 0 / 0.00496 / 1.13 | 0.00287 / 0 / 0.0182 / 1.42 | 0.00351 / 0 / 0.0909 / 2.23 | 0.00384 / 0 / 0.087 / 2.26 | 0.00257 / 0 / 0 / 1.00 | 0.00257 / 0 / 0 / 1.00 |
| 8.000e+12 | 15 | 1571 | 0.00225 / 0 / 0 / 1.00 | 0.0024 / 0 / 0.00446 / 1.14 | 0.00256 / 0 / 0.014 / 1.41 | 0.00304 / 0 / 0.0834 / 2.18 | 0.0032 / 0 / 0.0885 / 2.19 | 0.00225 / 0 / 0 / 1.00 | 0.00225 / 0 / 0 / 1.00 |
| 1.000e+13 | 14 | 1400 | 0.00205 / 0 / 0 / 1.00 | 0.0023 / 0 / 0.00357 / 1.15 | 0.00255 / 0 / 0.0179 / 1.39 | 0.00294 / 0 / 0.0771 / 2.30 | 0.00298 / 0 / 0.0807 / 2.35 | 0.00205 / 0 / 0 / 1.00 | 0.00205 / 0 / 0 / 1.00 |
| 2.000e+13 | 12 | 982 | 0.00179 / 0 / 0 / 1.00 | 0.00172 / 0 / 0.00815 / 1.17 | 0.00253 / 0 / 0.0163 / 1.38 | 0.00288 / 0 / 0.0794 / 2.23 | 0.00264 / 0 / 0.0754 / 2.10 | 0.00179 / 0 / 0 / 1.00 | 0.00179 / 0 / 0 / 1.00 |
| 1.000e+14 | 7 | 426 | 0.00118 / 0 / 0 / 1.00 | 0.00145 / 0 / 0.00704 / 1.05 | 0.00154 / 0 / 0.00939 / 1.19 | 0.00163 / 0 / 0.0986 / 2.07 | 0.00149 / 0 / 0.0681 / 1.98 | 0.00118 / 0 / 0 / 1.00 | 0.00118 / 0 / 0 / 1.00 |
| 2.379e+14 | 7 | 276 | 0.000866 / 0 / 0 / 1.00 | 0.000982 / 0 / 0.00725 / 1.17 | 0.000969 / 0 / 0.0217 / 1.34 | 0.00138 / 0 / 0.116 / 2.26 | 0.00138 / 0 / 0.087 / 2.32 | 0.000866 / 0 / 0 / 1.00 | 0.000866 / 0 / 0 / 1.00 |
| 5.000e+14 | 6 | 185 | 0.000749 / 0 / 0 / 1.00 | 0.000688 / 0 / 0.0108 / 1.13 | 0.00101 / 0 / 0.0432 / 1.41 | 0.00111 / 0 / 0.141 / 2.20 | 0.00102 / 0 / 0.151 / 2.14 | 0.000749 / 0 / 0 / 1.00 | 0.000749 / 0 / 0 / 1.00 |
| 1.000e+15 | 5 | 127 | 0.000489 / 0 / 0 / 1.00 | 0.000672 / 0 / 0.063 / 1.29 | 0.000594 / 0 / 0.0709 / 1.45 | 0.000843 / 0 / 0.268 / 2.54 | 0.000778 / 0 / 0.236 / 2.35 | 0.000489 / 0 / 0 / 1.00 | 0.000489 / 0 / 0 / 1.00 |
| 1.887e+16 | 2 | 23 | 0.000388 / 0 / 0 / 1.00 | 0.000249 / 0 / 0 / 1.45 | 0.000218 / 0 / 0 / 1.25 | 0.000372 / 0 / 0.087 / 2.47 | 0.000443 / 0 / 0.13 / 2.79 | 0.000388 / 0 / 0 / 1.00 | 0.000388 / 0 / 0 / 1.00 |

### T3c. Cumulative over the primes with a full alias set (common windows): max C / raw max (pole term kept) ; budget R_ex = 0.2797, majorant value sqrt(sum Sbar_p) = 1.867 for all 25 primes

| T0 | primes | common windows | ZETA | CHI5 | CHI101 | SGN | UNI | EA | TNR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000e+06 | 25 | 400 | 0.102 / 0.764 | 0.106 / 0.106 | 0.126 / 0.126 | 0.156 / 0.156 | 0.153 / 0.153 | 0.102 / 0.764 | 0.621 / 0.933 |
| 1.000e+07 | 25 | 400 | 0.0652 / 0.756 | 0.07 / 0.07 | 0.0933 / 0.0933 | 0.097 / 0.097 | 0.0959 / 0.0959 | 0.0652 / 0.756 | 0.628 / 0.938 |
| 1.000e+08 | 25 | 400 | 0.0379 / 0.751 | 0.0433 / 0.0433 | 0.0504 / 0.0504 | 0.0657 / 0.0657 | 0.0599 / 0.0599 | 0.0379 / 0.751 | 0.333 / 0.801 |
| 1.000e+09 | 25 | 158 | 0.0235 / 0.745 | 0.0264 / 0.0264 | 0.0312 / 0.0312 | 0.0332 / 0.0332 | 0.0337 / 0.0337 | 0.0235 / 0.745 | 0.0869 / 0.747 |
| 1.000e+10 | 25 | 50 | 0.0136 / 0.743 | 0.014 / 0.014 | 0.0163 / 0.0163 | 0.0204 / 0.0204 | 0.0187 / 0.0187 | 0.0136 / 0.743 | 0.0136 / 0.743 |
| 1.000e+11 | 25 | 15 | 0.00736 / 0.741 | 0.00894 / 0.00894 | 0.00857 / 0.00857 | 0.0112 / 0.0112 | 0.011 / 0.011 | 0.00736 / 0.741 | 0.00736 / 0.741 |
| 1.000e+12 | 25 | 5 | 0.00506 / 0.741 | 0.00544 / 0.00544 | 0.00518 / 0.00518 | 0.00608 / 0.00608 | 0.00671 / 0.00671 | 0.00506 / 0.741 | 0.00506 / 0.741 |
| 3.000e+12 | 20 | 4 | 0.00324 / 0.716 | 0.00321 / 0.00321 | 0.00348 / 0.00348 | 0.00472 / 0.00472 | 0.00439 / 0.00439 | 0.00324 / 0.716 | 0.00324 / 0.716 |
| 4.000e+12 | 18 | 4 | 0.00316 / 0.704 | 0.00287 / 0.00287 | 0.00309 / 0.00309 | 0.00432 / 0.00432 | 0.00435 / 0.00435 | 0.00316 / 0.704 | 0.00316 / 0.704 |
| 5.000e+12 | 17 | 4 | 0.00265 / 0.697 | 0.00329 / 0.00329 | 0.00329 / 0.00329 | 0.00367 / 0.00367 | 0.00423 / 0.00423 | 0.00265 / 0.697 | 0.00265 / 0.697 |
| 6.000e+12 | 16 | 4 | 0.00326 / 0.689 | 0.00253 / 0.00253 | 0.00312 / 0.00312 | 0.00365 / 0.00365 | 0.00395 / 0.00395 | 0.00326 / 0.689 | 0.00326 / 0.689 |
| 8.000e+12 | 15 | 4 | 0.00259 / 0.681 | 0.00286 / 0.00286 | 0.003 / 0.003 | 0.00382 / 0.00382 | 0.00335 / 0.00335 | 0.00259 / 0.681 | 0.00259 / 0.681 |
| 1.000e+13 | 14 | 4 | 0.00329 / 0.672 | 0.00242 / 0.00242 | 0.00265 / 0.00265 | 0.00335 / 0.00335 | 0.00368 / 0.00368 | 0.00329 / 0.672 | 0.00329 / 0.672 |
| 2.000e+13 | 12 | 4 | 0.00183 / 0.652 | 0.00191 / 0.00191 | 0.00229 / 0.00229 | 0.00267 / 0.00267 | 0.00253 / 0.00253 | 0.00183 / 0.652 | 0.00183 / 0.652 |
| 1.000e+14 | 7 | 7 | 0.0013 / 0.566 | 0.00108 / 0.00108 | 0.00114 / 0.00114 | 0.00164 / 0.00164 | 0.00173 / 0.00173 | 0.0013 / 0.566 | 0.0013 / 0.566 |
| 2.379e+14 | 7 | 4 | 0.000889 / 0.565 | 0.000994 / 0.000994 | 0.00104 / 0.00104 | 0.00126 / 0.00126 | 0.00179 / 0.00179 | 0.000889 / 0.565 | 0.000889 / 0.565 |
| 5.000e+14 | 6 | 5 | 0.000903 / 0.56 | 0.000878 / 0.000878 | 0.000948 / 0.000948 | 0.00118 / 0.00118 | 0.00112 / 0.00112 | 0.000903 / 0.56 | 0.000903 / 0.56 |
| 1.000e+15 | 5 | 4 | 0.000621 / 0.53 | 0.000688 / 0.000688 | 0.000659 / 0.000659 | 0.001 / 0.001 | 0.00096 / 0.00096 | 0.000621 / 0.53 | 0.000621 / 0.53 |
| 1.887e+16 | 2 | 7 | 0.000334 / 0.368 | 0.00024 / 0.00024 | 0.00026 / 0.00026 | 0.000328 / 0.000328 | 0.000331 / 0.000331 | 0.000334 / 0.368 | 0.000334 / 0.368 |

### T3d. Windows of the T-NR control containing a power of q = 3, and worst single-prime contract value of T-NR

| T0 | T-NR windows with a power of 3 | of | max c_p (T-NR) | max c_p (zeta) |
| --- | --- | --- | --- | --- |
| 1.000e+06 | 9036 | 610000 | 0.623 | 0.0693 |
| 1.000e+07 | 2792 | 610000 | 0.626 | 0.0555 |
| 1.000e+08 | 996 | 610000 | 0.628 | 0.0322 |
| 1.000e+09 | 263 | 487560 | 0.629 | 0.0181 |
| 1.000e+10 | 85 | 311520 | 0.63 | 0.0115 |
| 1.000e+11 | 0 | 143678 | 0.00682 | 0.00682 |
| 1.000e+12 | 0 | 51837 | 0.0047 | 0.0047 |
| 3.000e+12 | 0 | 29308 | 0.00324 | 0.00324 |
| 4.000e+12 | 0 | 24949 | 0.00267 | 0.00267 |
| 5.000e+12 | 5 | 22079 | 0.00254 | 0.00254 |
| 6.000e+12 | 0 | 19965 | 0.00257 | 0.00257 |
| 8.000e+12 | 0 | 17220 | 0.00225 | 0.00225 |
| 1.000e+13 | 0 | 15227 | 0.00205 | 0.00205 |
| 2.000e+13 | 0 | 10574 | 0.00179 | 0.00179 |
| 1.000e+14 | 0 | 4617 | 0.00118 | 0.00118 |
| 2.379e+14 | 0 | 3007 | 0.000866 | 0.000866 |
| 5.000e+14 | 0 | 1871 | 0.000749 | 0.000749 |
| 1.000e+15 | 0 | 1345 | 0.000489 | 0.000489 |
| 1.887e+16 | 0 | 386 | 0.000388 | 0.000388 |

### T2b. Share of the measured weld mass sum_h m_h r_h^2 on the alpha > 1 aliases (k = 1, h > 0.8408 p), p = 7 and p = 97; majorant share in the same convention 0.2369 (p = 7), 0.2963 (p = 97); in the paired convention of the record 0.4738, 0.5926

| T0 | p | paired majorant | ZETA (all h / paired) | CHI5 (all h / paired) | CHI101 (all h / paired) | SGN (all h / paired) | UNI (all h / paired) | EA (all h / paired) | TNR (all h / paired) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000e+06 | 7 | 0.4738 | 0.064 / 0.256 | 0.067 / 0.266 | 0.069 / 0.268 | 0.072 / 0.279 | 0.074 / 0.275 | 0.064 / 0.256 | 0.165 / 0.395 |
| 1.000e+06 | 97 | 0.5926 | 0.034 / 0.212 | 0.036 / 0.212 | 0.036 / 0.223 | 0.038 / 0.222 | 0.041 / 0.228 | 0.034 / 0.212 | 0.260 / 0.577 |
| 1.000e+07 | 7 | 0.4738 | 0.071 / 0.286 | 0.070 / 0.275 | 0.063 / 0.262 | 0.074 / 0.274 | 0.073 / 0.279 | 0.071 / 0.286 | 0.313 / 0.535 |
| 1.000e+07 | 97 | 0.5926 | 0.034 / 0.220 | 0.035 / 0.217 | 0.034 / 0.211 | 0.041 / 0.240 | 0.040 / 0.233 | 0.034 / 0.220 | 0.327 / 0.469 |
| 1.000e+08 | 7 | 0.4738 | 0.067 / 0.271 | 0.067 / 0.266 | 0.068 / 0.270 | 0.073 / 0.287 | 0.073 / 0.275 | 0.067 / 0.271 | 0.308 / 0.640 |
| 1.000e+08 | 97 | 0.5926 | 0.035 / 0.214 | 0.035 / 0.219 | 0.036 / 0.223 | 0.038 / 0.227 | 0.040 / 0.235 | 0.035 / 0.214 | 0.443 / 0.557 |
| 1.000e+09 | 7 | 0.4738 | 0.066 / 0.262 | 0.070 / 0.272 | 0.068 / 0.272 | 0.077 / 0.295 | 0.074 / 0.291 | 0.066 / 0.262 | 0.593 / 0.658 |
| 1.000e+09 | 97 | 0.5926 | 0.036 / 0.216 | 0.035 / 0.218 | 0.036 / 0.220 | 0.039 / 0.231 | 0.039 / 0.229 | 0.036 / 0.216 | 0.306 / 0.406 |
| 1.000e+10 | 7 | 0.4738 | 0.069 / 0.276 | 0.066 / 0.263 | 0.066 / 0.259 | 0.069 / 0.269 | 0.072 / 0.272 | 0.069 / 0.276 | 0.069 / 0.276 |
| 1.000e+10 | 97 | 0.5926 | 0.035 / 0.216 | 0.035 / 0.221 | 0.036 / 0.217 | 0.039 / 0.229 | 0.038 / 0.225 | 0.035 / 0.216 | 0.783 / 0.852 |
| 1.000e+11 | 7 | 0.4738 | 0.069 / 0.282 | 0.068 / 0.273 | 0.069 / 0.276 | 0.074 / 0.284 | 0.071 / 0.272 | 0.069 / 0.282 | 0.069 / 0.282 |
| 1.000e+11 | 97 | 0.5926 | 0.035 / 0.215 | 0.034 / 0.214 | 0.035 / 0.220 | 0.038 / 0.227 | 0.039 / 0.227 | 0.035 / 0.215 | 0.035 / 0.215 |
| 1.000e+12 | 7 | 0.4738 | 0.069 / 0.276 | 0.085 / 0.307 | 0.073 / 0.298 | 0.070 / 0.294 | 0.077 / 0.288 | 0.069 / 0.276 | 0.069 / 0.276 |
| 1.000e+12 | 97 | 0.5926 | 0.033 / 0.209 | 0.036 / 0.229 | 0.036 / 0.221 | 0.040 / 0.234 | 0.038 / 0.233 | 0.033 / 0.209 | 0.033 / 0.209 |
| 3.000e+12 | 7 | 0.4738 | 0.067 / 0.277 | 0.073 / 0.276 | 0.068 / 0.273 | 0.079 / 0.295 | 0.067 / 0.271 | 0.067 / 0.277 | 0.067 / 0.277 |
| 3.000e+12 | 97 | 0.5926 | 0.036 / 0.222 | 0.034 / 0.219 | 0.036 / 0.220 | 0.035 / 0.205 | 0.038 / 0.227 | 0.036 / 0.222 | 0.036 / 0.222 |
| 4.000e+12 | 7 | 0.4738 | 0.064 / 0.238 | 0.065 / 0.281 | 0.066 / 0.263 | 0.069 / 0.264 | 0.068 / 0.266 | 0.064 / 0.238 | 0.064 / 0.238 |
| 4.000e+12 | 97 | 0.5926 | 0.033 / 0.209 | 0.031 / 0.206 | 0.032 / 0.205 | 0.035 / 0.209 | 0.037 / 0.223 | 0.033 / 0.209 | 0.033 / 0.209 |
| 5.000e+12 | 7 | 0.4738 | 0.075 / 0.300 | 0.066 / 0.276 | 0.068 / 0.301 | 0.081 / 0.275 | 0.070 / 0.258 | 0.075 / 0.300 | 0.075 / 0.300 |
| 5.000e+12 | 97 | 0.5926 | 0.032 / 0.206 | 0.033 / 0.208 | 0.033 / 0.219 | 0.037 / 0.225 | 0.037 / 0.228 | 0.032 / 0.206 | 0.032 / 0.206 |
| 6.000e+12 | 7 | 0.4738 | 0.078 / 0.318 | 0.058 / 0.239 | 0.052 / 0.224 | 0.075 / 0.307 | 0.070 / 0.269 | 0.078 / 0.318 | 0.078 / 0.318 |
| 6.000e+12 | 97 | 0.5926 | 0.035 / 0.216 | 0.034 / 0.213 | 0.036 / 0.212 | 0.035 / 0.204 | 0.036 / 0.217 | 0.035 / 0.216 | 0.035 / 0.216 |
| 8.000e+12 | 7 | 0.4738 | 0.070 / 0.291 | 0.063 / 0.284 | 0.079 / 0.298 | 0.094 / 0.293 | 0.059 / 0.249 | 0.070 / 0.291 | 0.070 / 0.291 |
| 8.000e+12 | 97 | 0.5926 | 0.042 / 0.239 | 0.035 / 0.223 | 0.036 / 0.218 | 0.044 / 0.233 | 0.034 / 0.206 | 0.042 / 0.239 | 0.042 / 0.239 |
| 1.000e+13 | 7 | 0.4738 | 0.066 / 0.252 | 0.076 / 0.296 | 0.081 / 0.281 | 0.071 / 0.276 | 0.066 / 0.249 | 0.066 / 0.252 | 0.066 / 0.252 |
| 1.000e+13 | 97 | 0.5926 | 0.030 / 0.200 | 0.037 / 0.220 | 0.033 / 0.220 | 0.039 / 0.219 | 0.041 / 0.219 | 0.030 / 0.200 | 0.030 / 0.200 |
| 2.000e+13 | 7 | 0.4738 | 0.054 / 0.222 | 0.079 / 0.279 | 0.049 / 0.218 | 0.057 / 0.222 | 0.067 / 0.246 | 0.054 / 0.222 | 0.054 / 0.222 |
| 2.000e+13 | 97 | 0.5926 | 0.035 / 0.216 | 0.035 / 0.224 | 0.036 / 0.221 | 0.031 / 0.186 | 0.039 / 0.241 | 0.035 / 0.216 | 0.035 / 0.216 |
| 1.000e+14 | 7 | 0.4738 | 0.073 / 0.346 | 0.067 / 0.306 | 0.079 / 0.256 | 0.092 / 0.253 | 0.103 / 0.296 | 0.073 / 0.346 | 0.073 / 0.346 |
| 1.000e+14 | 97 | 0.5926 | 0.026 / 0.173 | 0.038 / 0.245 | 0.034 / 0.212 | 0.028 / 0.200 | 0.038 / 0.213 | 0.026 / 0.173 | 0.026 / 0.173 |
| 2.379e+14 | 7 | 0.4738 | 0.059 / 0.273 | 0.064 / 0.264 | 0.099 / 0.341 | 0.044 / 0.217 | 0.110 / 0.346 | 0.059 / 0.273 | 0.059 / 0.273 |
| 2.379e+14 | 97 | 0.5926 | 0.036 / 0.200 | 0.032 / 0.208 | 0.033 / 0.176 | 0.030 / 0.213 | 0.029 / 0.174 | 0.036 / 0.200 | 0.036 / 0.200 |
| 5.000e+14 | 7 | 0.4738 | 0.072 / 0.346 | 0.062 / 0.241 | 0.053 / 0.220 | 0.085 / 0.355 | 0.061 / 0.228 | 0.072 / 0.346 | 0.072 / 0.346 |
| 1.000e+15 | 7 | 0.4738 | 0.105 / 0.374 | 0.062 / 0.253 | 0.046 / 0.188 | 0.107 / 0.341 | 0.084 / 0.208 | 0.105 / 0.374 | 0.105 / 0.374 |

### T4w. Windowed sieve-algebra fraction: mean of f (p-1) over windows, complex kernel / positive envelope. No-pole value (p-1)/(1 + p(p-2)): 0.167 at p = 7, 0.0104 at p = 97. For an object with a pole the positive envelope puts all the energy in the algebra (f (p-1) -> p-1) and the complex kernel puts it on the one stationary alias (f (p-1) -> 0.0244 at p = 7)

| T0 | p | ZETA | CHI5 | CHI101 | SGN | UNI | EA | TNR |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000e+06 | 7 | 0.0304 / 5.81 | 0.203 / 0.159 | 0.204 / 0.19 | 0.197 / 0.227 | 0.195 / 0.205 | 0.0304 / 5.81 | 0.0314 / 5.77 |
| 1.000e+06 | 97 | 0.00593 / 9.01 | 0.0108 / 0.00556 | 0.0107 / 0.00659 | 0.0106 / 0.0108 | 0.0106 / 0.0105 | 0.00593 / 9.01 | 0.00598 / 8.89 |
| 1.000e+07 | 7 | 0.0274 / 5.9 | 0.203 / 0.153 | 0.203 / 0.191 | 0.196 / 0.216 | 0.192 / 0.199 | 0.0274 / 5.9 | 0.028 / 5.88 |
| 1.000e+07 | 97 | 0.00391 / 16.6 | 0.0109 / 0.00615 | 0.011 / 0.00708 | 0.0105 / 0.0101 | 0.0106 / 0.0108 | 0.00391 / 16.6 | 0.00393 / 16.6 |
| 1.000e+08 | 7 | 0.0257 / 5.95 | 0.202 / 0.158 | 0.197 / 0.195 | 0.198 / 0.237 | 0.198 / 0.192 | 0.0257 / 5.95 | 0.0259 / 5.95 |
| 1.000e+08 | 97 | 0.00202 / 30.3 | 0.0103 / 0.00627 | 0.0102 / 0.00705 | 0.0106 / 0.011 | 0.0105 / 0.0105 | 0.00202 / 30.3 | 0.00203 / 30.3 |
| 1.000e+09 | 7 | 0.0249 / 5.98 | 0.196 / 0.161 | 0.199 / 0.208 | 0.194 / 0.23 | 0.194 / 0.198 | 0.0249 / 5.98 | 0.025 / 5.98 |
| 1.000e+09 | 97 | 0.000906 / 50.2 | 0.0106 / 0.0068 | 0.0105 / 0.00745 | 0.0105 / 0.0106 | 0.0105 / 0.0105 | 0.000906 / 50.2 | 0.00091 / 50.2 |
| 1.000e+10 | 7 | 0.0246 / 5.99 | 0.203 / 0.165 | 0.198 / 0.206 | 0.196 / 0.233 | 0.197 / 0.198 | 0.0246 / 5.99 | 0.0246 / 5.99 |
| 1.000e+10 | 97 | 0.0004 / 70.6 | 0.0105 / 0.0071 | 0.0106 / 0.00776 | 0.0105 / 0.0107 | 0.0106 / 0.0105 | 0.0004 / 70.6 | 0.000404 / 70.6 |
| 1.000e+11 | 7 | 0.0245 / 6 | 0.197 / 0.171 | 0.202 / 0.202 | 0.191 / 0.227 | 0.196 / 0.2 | 0.0245 / 6 | 0.0245 / 6 |
| 1.000e+11 | 97 | 0.000212 / 84.7 | 0.0105 / 0.00728 | 0.0107 / 0.00792 | 0.0105 / 0.0105 | 0.0105 / 0.0104 | 0.000212 / 84.7 | 0.000212 / 84.7 |
| 1.000e+12 | 7 | 0.0244 / 6 | 0.201 / 0.178 | 0.201 / 0.207 | 0.199 / 0.243 | 0.194 / 0.198 | 0.0244 / 6 | 0.0244 / 6 |
| 1.000e+12 | 97 | 0.000144 / 91.7 | 0.0104 / 0.00762 | 0.0104 / 0.00819 | 0.0105 / 0.0108 | 0.0106 / 0.0104 | 0.000144 / 91.7 | 0.000144 / 91.7 |
| 3.000e+12 | 7 | 0.0244 / 6 | 0.207 / 0.182 | 0.198 / 0.22 | 0.189 / 0.226 | 0.185 / 0.197 | 0.0244 / 6 | 0.0244 / 6 |
| 3.000e+12 | 97 | 0.000128 / 93.4 | 0.0106 / 0.00754 | 0.0105 / 0.00808 | 0.0107 / 0.0107 | 0.0106 / 0.0106 | 0.000128 / 93.4 | 0.000128 / 93.4 |
| 4.000e+12 | 7 | 0.0244 / 6 | 0.207 / 0.167 | 0.181 / 0.211 | 0.2 / 0.248 | 0.206 / 0.196 | 0.0244 / 6 | 0.0244 / 6 |
| 4.000e+12 | 97 | 0.000126 / 93.7 | 0.0103 / 0.00765 | 0.0111 / 0.00766 | 0.0104 / 0.0109 | 0.0103 / 0.0106 | 0.000126 / 93.7 | 0.000126 / 93.7 |
| 5.000e+12 | 7 | 0.0245 / 6 | 0.189 / 0.172 | 0.19 / 0.199 | 0.197 / 0.222 | 0.196 / 0.2 | 0.0245 / 6 | 0.0245 / 6 |
| 5.000e+12 | 97 | 0.000126 / 93.9 | 0.0107 / 0.00746 | 0.0109 / 0.00836 | 0.0105 / 0.011 | 0.0106 / 0.0106 | 0.000126 / 93.9 | 0.000126 / 93.9 |
| 6.000e+12 | 7 | 0.0244 / 6 | 0.205 / 0.189 | 0.192 / 0.215 | 0.201 / 0.26 | 0.189 / 0.192 | 0.0244 / 6 | 0.0244 / 6 |
| 6.000e+12 | 97 | 0.000123 / 94.1 | 0.0105 / 0.00759 | 0.0105 / 0.00783 | 0.0102 / 0.0108 | 0.0104 / 0.0104 | 0.000123 / 94.1 | 0.000123 / 94.1 |
| 8.000e+12 | 7 | 0.0244 / 6 | 0.198 / 0.176 | 0.19 / 0.213 | 0.2 / 0.243 | 0.205 / 0.195 | 0.0244 / 6 | 0.0244 / 6 |
| 8.000e+12 | 97 | 0.000122 / 94.3 | 0.0108 / 0.00739 | 0.0108 / 0.00788 | 0.0104 / 0.0105 | 0.0107 / 0.0105 | 0.000122 / 94.3 | 0.000122 / 94.3 |
| 1.000e+13 | 7 | 0.0244 / 6 | 0.2 / 0.176 | 0.217 / 0.178 | 0.19 / 0.244 | 0.189 / 0.205 | 0.0244 / 6 | 0.0244 / 6 |
| 1.000e+13 | 97 | 0.000118 / 94.5 | 0.0105 / 0.00743 | 0.0103 / 0.00849 | 0.011 / 0.0104 | 0.0106 / 0.0106 | 0.000118 / 94.5 | 0.000118 / 94.5 |
| 2.000e+13 | 7 | 0.0244 / 6 | 0.187 / 0.192 | 0.198 / 0.245 | 0.204 / 0.261 | 0.182 / 0.207 | 0.0244 / 6 | 0.0244 / 6 |
| 2.000e+13 | 97 | 0.000117 / 94.9 | 0.0104 / 0.0077 | 0.0107 / 0.0081 | 0.0106 / 0.0104 | 0.00992 / 0.0104 | 0.000117 / 94.9 | 0.000117 / 94.9 |
| 1.000e+14 | 7 | 0.0244 / 6 | 0.244 / 0.172 | 0.187 / 0.217 | 0.207 / 0.209 | 0.218 / 0.182 | 0.0244 / 6 | 0.0244 / 6 |
| 1.000e+14 | 97 | 0.000111 / 95.5 | 0.0104 / 0.00797 | 0.0102 / 0.00736 | 0.0108 / 0.0108 | 0.0107 / 0.01 | 0.000111 / 95.5 | 0.000111 / 95.5 |
| 2.379e+14 | 7 | 0.0244 / 6 | 0.191 / 0.183 | 0.225 / 0.185 | 0.24 / 0.278 | 0.206 / 0.237 | 0.0244 / 6 | 0.0244 / 6 |
| 2.379e+14 | 97 | 0.00011 / 95.6 | 0.0105 / 0.00812 | 0.0113 / 0.00947 | 0.00955 / 0.0103 | 0.0105 / 0.0108 | 0.00011 / 95.6 | 0.00011 / 95.6 |
| 5.000e+14 | 7 | 0.0244 / 6 | 0.214 / 0.165 | 0.232 / 0.237 | 0.14 / 0.242 | 0.186 / 0.195 | 0.0244 / 6 | 0.0244 / 6 |
| 5.000e+14 | 97 | 0.000108 / 95.7 | 0.0118 / 0.00574 | 0.013 / 0.0092 | 0.0149 / 0.00422 | 0.00882 / 0.00936 | 0.000108 / 95.7 | 0.000108 / 95.7 |
| 1.000e+15 | 7 | 0.0244 / 6 | 0.179 / 0.164 | 0.18 / 0.174 | 0.161 / 0.346 | 0.165 / 0.198 | 0.0244 / 6 | 0.0244 / 6 |
| 1.000e+15 | 97 | 0.000112 / 95.8 | 0.00765 / 0.00954 | 0.0141 / 0.00573 | 0.0123 / 0.0054 | 0.0133 / 0.00755 | 0.000112 / 95.8 | 0.000112 / 95.8 |
| 1.887e+16 | 7 | 0.0243 / 6 | 0.109 / 0.136 | 0.232 / 0.205 | 0.192 / 0.133 | 0.142 / 0.148 | 0.0243 / 6 | 0.0243 / 6 |
| 1.887e+16 | 97 | 0.000103 / 95.9 | 0.0062 / 0.00968 | 0.0129 / 0.0113 | 0.0142 / 0.0115 | 0.0133 / 0.00785 | 0.000103 / 95.9 | 0.000103 / 95.9 |

### TD. Davenport-Heilbronn through Lambda_DH (table front end, all n in the block); zeta by the same front end

| T0 | object | theta windows | theta fail fraction | max Re theta | min nu | complex-kernel fail fraction | mean z^2 (k=1) | mean r | max r | max c_p | c_p >= R_ex |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1e+06 | DH | 604000 | 0.543 | 4.211e+04 | -0.346 | 0.0420 | 1.047 | 0.0577 | 0.257 | 0.138 | 0 |
| 1e+06 | ZETA_table | 604000 | 0.000 | 0.483 | 1 | 0.0032 | 0.415 | 0.0308 | 0.194 | 0.0693 | 0 |
| 1e+07 | DH | 600000 | 0.546 | 4.112e+04 | -0.356 | 0.0494 | 1.079 | 0.0530 | 0.250 | 0.132 | 0 |
| 1e+07 | ZETA_table | 600000 | 0.000 | 0.4828 | 1 | 0.0035 | 0.409 | 0.0206 | 0.119 | 0.0555 | 0 |

### T2a. Combination (2): qPure over 21 seam points (threshold 1.4326672; bound 1 for every vector)

| object | sup qPure | min qPure | lambda_max(rho) | qVN | negative index range | five-shell / E_97 identity error (relative) |
|---|---|---|---|---|---|---|
| ZETA | 0.79625 | 0.40033 | 0.39136 | 0.62559 | 6..12 | 1.1e-12 / 3.1e-16 |
| CHI101 | 0.67004 | 0.35835 | 0.54000 | 0.73485 | 4..11 | 4.5e-13 / 1.8e-16 |
| CHI5 | 0.66479 | 0.41991 | 0.81552 | 0.90306 | 5..11 | 1.9e-13 / 2.0e-16 |
| DH | 0.73823 | 0.46102 | 0.72540 | 0.85170 | 6..12 | 8.2e-14 / 2.5e-16 |
| LIOU | 0.86183 | 0.31946 | 0.59678 | 0.77251 | 5..12 | 2.0e-13 / 1.5e-16 |
| SGN | 0.66461 | 0.32811 | 0.48784 | 0.69846 | 6..14 | 4.9e-13 / 1.7e-16 |
| UNI | 0.76754 | 0.34417 | 0.51606 | 0.71838 | 6..11 | 5.8e-13 / 1.6e-16 |
| EA | 0.79925 | 0.40006 | 0.41855 | 0.64696 | 5..11 | 3.6e-13 / 2.0e-16 |
| TNR2 | 0.93373 | 0.38978 | 0.46363 | 0.68090 | 6..11 | 2.5e-13 / 2.2e-16 |
| TNR3 | 0.86159 | 0.42409 | 0.56617 | 0.75244 | 4..11 | 3.7e-13 / 1.7e-16 |
| TNR97 | 0.98791 | 0.50196 | 0.94168 | 0.97040 | 5..12 | 8.7e-14 / 2.2e-16 |
| HEATm0.5 | 0.83267 | 0.60322 | 0.67341 | 0.82062 | 5..12 | 1.1e-13 / 2.0e-16 |

Zeta by seam point (N, w, extra term, qPure, node of the maximum): (690988, 0, 0, 0.4003, 11); (690988, 1, 0, 0.4779, 7); (690988, 1, 1, 0.4777, 7); (1432261, 0, 0, 0.5558, 17); (1432261, 1, 0, 0.4315, 7); (1432261, 1, 1, 0.4315, 7); (2968752, 0, 0, 0.4713, 3); (2968752, 1, 0, 0.4029, 13); (2968752, 1, 1, 0.4029, 13); (6153547, 0, 0, 0.4513, 13); (6153547, 1, 0, 0.7962, 2); (6153547, 1, 1, 0.7963, 2); (12754904, 0, 0, 0.6695, 2); (12754904, 1, 0, 0.4376, 5); (12754904, 1, 1, 0.4377, 5); (26438017, 0, 0, 0.5142, 11); (26438017, 1, 0, 0.6777, 3); (26438017, 1, 1, 0.6777, 3); (54799999, 0, 0, 0.6387, 2); (54799999, 1, 0, 0.4561, 5); (54799999, 1, 1, 0.4560, 5).
The record's zeta values (worst qPure 0.90487, qVN 0.78939) come from its own evaluator convention for the ladder, which includes a second term not reproduced here; the bound qPure <= 1 does not depend on the convention.

### T4a. Combination (4): leak = 1 - f_q on Lambda_F(n), n <= N

| N | q | phi(q) | 1 - 1/phi | no-pole leak | ZETA | LIOU | EA | TNR3 | CHI101 CHI103 CHI107 CHI109 | SGN mean f / no-pole (se) | UNI mean f / no-pole (se) | DH |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1e+05 | 7 | 6 | 0.833333 | 0.97222222 | 1.388e-04 | 4.435e-04 | 2.267e-04 | 7.656e-01 | 0.9780 0.9593 0.9992 0.9948 | 0.77 (0.23) | 0.45 (0.12) | 0.98275 |
| 1e+05 | 30 | 8 | 0.875000 | 0.98437500 | 2.298e-04 | 5.092e-04 | 3.824e-04 | 7.118e-01 | 0.9908 0.9939 0.9980 0.9972 | 0.64 (0.18) | 0.63 (0.18) | 1.00000 |
| 1e+05 | 30030 | 5760 | 0.999826 | 0.99999997 | 9.995e-01 | 9.995e-01 | 9.995e-01 | 1.000e+00 | 1.0000 1.0000 1.0000 1.0000 | 0.63 (0.16) | 0.49 (0.13) | 0.99993 |
| 1e+05 | 97 | 96 | 0.989583 | 0.99989149 | 1.677e-01 | 1.711e-01 | 1.958e-01 | 9.987e-01 | 0.9997 0.9998 1.0000 0.9999 | 1.00 (0.33) | 0.97 (0.25) | 0.99935 |
| 1e+07 | 7 | 6 | 0.833333 | 0.97222222 | 1.003e-06 | 3.041e-06 | 1.465e-06 | 4.368e-01 | 1.0000 0.9824 0.9564 0.9829 | 1.73 (0.55) | 1.21 (0.31) | 0.99858 |
| 1e+07 | 30 | 8 | 0.875000 | 0.98437500 | 2.649e-06 | 6.279e-06 | 3.993e-06 | 4.701e-01 | 1.0000 0.9931 0.9943 0.9950 | 1.25 (0.40) | 1.22 (0.32) | 1.00000 |
| 1e+07 | 30030 | 5760 | 0.999826 | 0.99999997 | 9.566e-01 | 9.568e-01 | 9.604e-01 | 1.000e+00 | 1.0000 1.0000 1.0000 1.0000 | 0.96 (0.26) | 1.10 (0.24) | 1.00000 |
| 1e+07 | 97 | 96 | 0.989583 | 0.99989149 | 2.351e-03 | 2.394e-03 | 2.762e-03 | 9.946e-01 | 1.0000 0.9999 1.0000 1.0000 | 0.95 (0.26) | 1.07 (0.22) | 0.99988 |
| 1e+08 | 7 | 6 | 0.833333 | 0.97222222 | 1.818e-07 | 6.636e-07 | 2.711e-07 | 2.813e-01 | 0.9993 0.9663 0.9968 0.9995 | 0.93 (0.32) | 0.54 (0.15) | 0.99250 |
| 1e+08 | 30 | 8 | 0.875000 | 0.98437500 | 4.988e-07 | 6.492e-07 | 7.770e-07 | 3.385e-01 | 0.9998 0.9945 0.9884 0.9993 | 1.11 (0.37) | 0.60 (0.13) | 1.00000 |
| 1e+08 | 30030 | 5760 | 0.999826 | 0.99999997 | 6.935e-01 | 6.937e-01 | 7.119e-01 | 1.000e+00 | 1.0000 1.0000 1.0000 1.0000 | 0.71 (0.25) | 0.50 (0.10) | 0.99999 |
| 1e+08 | 97 | 96 | 0.989583 | 0.99989149 | 1.836e-04 | 1.848e-04 | 2.141e-04 | 9.894e-01 | 1.0000 1.0000 1.0000 1.0000 | 0.73 (0.27) | 0.55 (0.11) | 0.99910 |
| 1e+09 | 7 | 6 | 0.833333 | 0.97222222 | 8.400e-09 | 3.148e-08 | 1.373e-08 | 1.667e-01 | 0.9836 0.9885 0.9996 0.9973 | 1.78 (0.71) | 1.35 (0.41) | - |
| 1e+09 | 30 | 8 | 0.875000 | 0.98437500 | 2.077e-08 | 1.569e-07 | 3.165e-08 | 2.241e-01 | 0.9842 0.9919 0.9998 0.9934 | 1.31 (0.23) | 1.64 (0.44) | - |
| 1e+09 | 30030 | 5760 | 0.999826 | 0.99999997 | 1.796e-01 | 1.798e-01 | 1.939e-01 | 1.000e+00 | 1.0000 1.0000 1.0000 1.0000 | 1.39 (0.36) | 1.14 (0.24) | - |
| 1e+09 | 97 | 96 | 0.989583 | 0.99989149 | 2.187e-05 | 2.224e-05 | 2.604e-05 | 9.794e-01 | 1.0000 1.0000 1.0000 1.0000 | 1.51 (0.40) | 1.15 (0.23) | - |
| 1e+10 | 7 | 6 | 0.833333 | 0.97222222 | 3.286e-10 | 2.788e-09 | 5.452e-10 | 9.375e-02 | 0.9471 1.0000 0.9808 0.9900 | 1.57 (0.53) | 0.98 (0.31) | - |
| 1e+10 | 30 | 8 | 0.875000 | 0.98437500 | 1.906e-09 | 1.342e-08 | 3.170e-09 | 1.384e-01 | 0.9942 1.0000 0.9948 0.9981 | 0.70 (0.20) | 0.77 (0.18) | - |
| 1e+10 | 30030 | 5760 | 0.999826 | 0.99999997 | 2.227e-02 | 2.227e-02 | 2.428e-02 | 1.000e+00 | 1.0000 1.0000 1.0000 1.0000 | 1.04 (0.35) | 0.80 (0.22) | - |
| 1e+10 | 97 | 96 | 0.989583 | 0.99989149 | 1.829e-06 | 1.868e-06 | 2.099e-06 | 9.609e-01 | 1.0000 1.0000 1.0000 1.0000 | 0.89 (0.27) | 0.80 (0.23) | - |

### T4b. Combination (4): zeta leak times N, and the sign of E_97

```
zeta leak * N (GRH scale: leak ~ q phi(q) c / N):
7 ['13.9', '8.29', '0.998', '10.6', '10', '3.19', '18.2', '7.85', '8.4', '6.14', '3.29']
97 ['1.68e+04', '2.2e+04', '1.69e+04', '2.24e+04', '2.35e+04', '2.1e+04', '1.84e+04', '2.23e+04', '2.19e+04', '2.25e+04', '1.83e+04']
30030 ['1e+05', '3.16e+05', '9.96e+05', '3.12e+06', '9.57e+06', '2.78e+07', '6.93e+07', '1.32e+08', '1.8e+08', '2.14e+08', '2.23e+08']

E_97(N,A) = (1-A) Y4 - A sum Z_g, normalised by N.  sign pattern over checkpoints for A = 0.1, 0.5, 0.9
ZETA    +++++++++++ +++++++++++ +++++++++++  Y4/N first 9.981e-01 last 1.000e+00 ; sumZ/N last 5.37e-08
LIOU    ----------- ----------- -----------  Y4/N first -9.939e-01 last -1.000e+00 ; sumZ/N last -5.77e-09
EA      +++++++++++ +++++++++++ +++++++++++  Y4/N first 1.429e+01 last 2.530e+02 ; sumZ/N last 3.24e-06
TNR3    +++++++++++ +++++++++++ +-+++++++++  Y4/N first 9.981e-01 last 1.000e+00 ; sumZ/N last -3.37e-02
CHI101  --++---++-- --++---++-- --+----++--  Y4/N first -6.262e-03 last -1.744e-05 ; sumZ/N last 2.24e-08
CHI103  --+---++--+ --+---++--+ --+---++--+  Y4/N first -5.494e-03 last 7.014e-07 ; sumZ/N last 2.53e-08
CHI107  -+--++--+++ ----++--+++ ----++--+++  Y4/N first -2.468e-03 last 1.521e-05 ; sumZ/N last 2.73e-08
CHI109  ++-++--+-++ ++-++--+-++ ----+--+-++  Y4/N first 1.844e-03 last 9.047e-06 ; sumZ/N last 2.30e-08
SGN0    +++-++-++++ +++-+--++++ +++-+--++++  Y4/N first 5.349e-03 last 3.402e-05 ; sumZ/N last 1.10e-08
SGN1    +-+++++--++ +-+++++--++ --+++++--++  Y4/N first 1.476e-03 last 4.339e-05 ; sumZ/N last 2.75e-08
SGN2    -+-+++++--- -+-+++++--- ---+++++---  Y4/N first -5.988e-03 last -1.068e-04 ; sumZ/N last 1.60e-08
SGN3    ----+++++++ ----+++++++ ----+++++++  Y4/N first -1.027e-02 last 2.171e-05 ; sumZ/N last 2.49e-08
UNI0    +++++-+---- +++++-+---- +++++-+----  Y4/N first 8.563e-03 last -2.836e-05 ; sumZ/N last -6.04e-09
UNI1    --+++-+++++ --+++-+++++ --+++-+++++  Y4/N first -1.997e-03 last 2.437e-05 ; sumZ/N last 1.74e-09
DH      +-++--- +-++--- +--+---  Y4/N ['1.41e-04', '-2.37e-04', '5.84e-05', '6.85e-05', '5.11e-05', '-1.50e-05', '6.69e-06'] ; sumZ/N ['-5.37e-04', '2.37e-03', '4.94e-05', '-1.35e-03', '8.51e-04', '1.31e-03', '3.18e-04']
```

## 6. Files

Code: `pk.c` (segmented sieve, windowed residue sums, Lambda_DH), `seam.c` (binary128 phases, multiplicative tables), `pklib.py` (grid, pole term, Gram, theta, statistics), `run_packets.py`, `run_dh.py`, `q_seam.py`, `alias_sieve.py`, `tnr_target.py`, `validate.py`, `mpcheck_big.py`, `mpcheck_theta.py`, `analyze_packets.py`, `analyze_dh.py`, `analyze_alias.py`, `mk_tables.py`, `build.sh`.
Data: `out/packets_summary.json` (all per-height statistics), `out/T*.npz` (per-window arrays for T >= 1e11; the five files for T <= 1e10 are on the server only, 0.5 GB), `dh/DH_T*.npz`, `dh/dh_summary.json`, `q_seam.json`, `alias.json`, `alias_summary.json`, `tnr_target.json`, `validate.json`, `mpcheck_big.json`, `mpcheck_theta.json`, `tables.md`.
Server directory: `~/rh-push/s2-alias-sieve-sign-image/`; logs `~/rh-push/logs/rh-s2alias-*.log`.
