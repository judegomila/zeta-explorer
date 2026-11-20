# s2-weil-coefficient-rigidity: screening of four Weil-form combinations against the control battery

Date 2026-11-19/20. Internal working note, not refereed. Nothing here proves RH, moves a Lambda bound or gives a zero-free region.
Labels: PROVED (elementary, stated with proof), CLASSICAL, MEASURED (numerics of this lane), OPEN.

## Verdict

**No survivor. All four combinations are closed.** Tested: 4 combinations, 9 supports 2a = ln 3 .. ln 11 plus 10 supports in [0.9, 1.6], Suzuki cell matrices to support log 10^7 at seven mesh levels.

One pattern explains all four. For a fixed gamma factor (and pole), the set of coefficient vectors c(2..K) for which the form on support ln(K+1) is nonnegative is a convex body that contracts onto one point at the rate of the form's margin, **from both sides in every coordinate**. For zeta's gamma factor that point is Lambda (admissible interval of c(2) - log 2, pole-free: [-1.2, 4.4e-3] at ln 3, [-6.1e-4, 9.4e-7] at ln 4, [-5.3e-13, 5.7e-15] at ln 6, [-2.0e-40, 4.4e-38] at ln 11). So every object that keeps zeta's gamma factor and changes any coefficient n <= K fails with a negative eigenvalue of order 0.1 to 1 once 2a exceeds log n by about 0.02 to 0.4. That failure does not involve zeros, but it is not arithmetic either: the same two-sided contraction holds for Davenport-Heilbronn in its own form around its own non-multiplicative coefficients, and for L(chi_-3), L(chi_5) around theirs. The statistic measures compatibility of (gamma factor, pole, coefficients n <= K) with a positive zero-counting measure, which is the low-lying-zero moment problem. The controls that have a functional equation fail exactly where their zero configuration says: DH passes every support up to 2a = 3.4 and turns negative between 3.4 and 3.5 (source prediction a = 1.746); T-NR(q) fails at log q + 0.06..0.22 (its off-line zeros are a lattice of period 2 pi / log q, visible to the form only at shifts k log q); E_a (no on-line zeros at all) fails near 2a = 1.

| # | combination | statistic | sizes reached | zeta | comparison L-function | controls with a functional equation (own form) | controls without one (zeta's gamma factor) | classification |
|---|---|---|---|---|---|---|---|---|
| 1 | cramer-null-breaks-weil + multi-rung-weil-symbol + arb-lege-margins-decay | lambda_min of T_a[w_K], pole-free, 2a = ln(K+1), K = 2..10 | Galerkin N = 160 (all K), N = 320 (K = 3..6), 320/384-bit balls | positive, 9.5e-4 (K=2) .. 1.2e-41 (K=10) | L(chi_-3) 9.7e-3 .. 3.8e-16; L(chi_5) 4.3e-2 .. 3.2e-10: positive | DH positive at every K (0.21 .. 7.7e-9). T-NR(q, c=2.2) negative for every K >= q (q = 2,3,5,7). T-NR c = 1.0 positive. E_1/8, E_1/4 negative at every K | every sign pattern that differs from Lambda on an active rung (8 of 8 at K = 2, 15 of 15 from K = 7), Liouville, 8 of 8 unimodular, WT: negative for every K >= 2. THIN-0.9 from K = 5 (first flipped prime), DEL from the K of the first deleted prime. Cramer model: P(negative) = 0 (K=2), 0.09 (K=3), 1 (K >= 4) | closed: FE/gamma mismatch for the controls without FE; Euler-blind (DH passes); zero-resolution for T-NR, E_a |
| 2 | mem-cc-scaling-site-cancellation + route-h-arch-p2-cancellation-curve + scaling-site-arch-p2-cancellation | residual/P_2 on the even minimiser of the full form, c(2) replaced by x log 2; then all c(n), n <= 5 jointly | a = 0.5, (ln 3)/2, ln 2, (ln 5)/2, (ln 6)/2; N = 160, 320 | depth 4.1 / 5.5 / 10.6 / 15.6 / 20.8 digits | L(chi_-3), L(chi_5): positive, P_2 < 0 on the minimiser (no cancellation needed) | DH positive (residual 0.30 / 0.21 / 0.041, P_2 > 0, depth < 1 digit); T-NR q=2 negative; E_a negative | x = -1, 0, DH's 0.284, E_a's 2.01, T-NR's 4.11 in zeta's form: negative at every a; admissible x - 1 in [-2.6e-2, 7.4e-5] at a = 0.5, [-1.7e-7, 2.4e-11] at ln 2; at 2a = ln 6 all c(n), n <= 5 pinned jointly | closed: same mechanism as 1 (two-sided pinning is a property of the gamma factor, shared by DH) |
| 3 | finite-prime-rigidity + suzuki-finite-certificate | least eigenvalue of the cell matrices H_{h,m} of Psi_F, h = log 2 / 2^k, k = 0..6, support m h <= log 10^7; eps*(support, p) | coefficients n <= 10^7 (665,134 prime powers), m up to 1488, 50-digit Psi | positive on every cell matrix (k = 6, m = 1488: 6.7e-7); eps* (p=2, k=4, m=256) = 1.0685380e-5 | L(chi_-3), L(chi_5): positive on every cell matrix | DH: first negative support 14.0 / 10.1 / 7.84 / 5.59 / 3.89 for k = 2..6 (limit 3.4..3.5 in L^2); T-NR(q): 0.910, 1.256, 1.733, 2.058, 4.679 for q = 2,3,5,7,101 = log q + 0.217, 0.157, 0.124, 0.112, 0.064; E_1/8: 2.00, E_1/4: 1.28 (k = 6) | sign twists, U, WT: 0.73..1.13 (with zeta's pole), 1.04..1.13 (pole-free step functions); THIN 1.625 (first flip at 5), DEL-0.75 1.635 (5), DEL-0.9 1.137 (3) | closed: T-NR support is log q + O(0.2), not slower; DH fails only on cells that reach its zero resolution |
| 4 | vanishing-moment-subfamily-past-crossing + mem-weil-moment-ladder + weil-gram-margin-conditioning | lambda_min on pole-free subfamilies with k = 0..3 vanishing moments, 2a in [0.9, 1.6] | 10 supports, N = 160 | positive for every k and support | positive for every k and support | DH positive for every k and support (4.0e-1 .. 6.6e-3 at k = 0); T-NR q=2 negative from 1.3 (pole-free), q=3 from 1.5; E_1/8 from ln 4 (pole-free; from 1.0 with its poles) | still fail with the pole projected out: flip at 2 from 2a in (1.0, ln 3]; flip at 3 and deletion of 3 from (ln 3, 1.16]; unimodular from (1.0, ln 3]. Moments delay the failure (flip at 2 passes k = 1 to 1.3, k = 2 to 1.5, k = 3 to 1.6) and never bring it forward | closed: DH does not fail below its onset; failures of the others are those of 1 |

Float64 on GPU 1 was not used: the largest dense matrix in this lane is 1488 x 1488 (float64 eigenvalues) and 320 x 320 (balls). Nothing here is GPU-shaped.

## 0. Definitions used (sources)

- Weil form of an object F with completed function Q^s prod_j pi^{-s/2} Gamma((s + kappa_j)/2) F(s) and poles of F at 1/2 +- p, on g in L^2(-a,a), h = g * g~ (CLASSICAL):
  W_F(g) = sum_poles (|ghat(ip)|^2 + |ghat(-ip)|^2) + (1/2 pi) int w(t)|ghat(t)|^2 dt - sum_n n^{-1/2} (c(n) h(log n) + conj c(n) h(-log n)),
  w(t) = 2 log Q + sum_j (Re psi(1/4 + kappa_j/2 + it/2) - log pi), c = coefficients of -F'/F. Only n < e^{2a} enter (multi-rung symbol, route 11). "Pole-free" = restriction to ghat(+-ip) = 0. "k vanishing moments" = g orthogonal to polynomials of degree < k (imp-96130 / pencil high-res map).
- Combination 2 (imp-96091): full form (pole kept), even block, residual = lambda_min, P_2 = c(2) 2^{-1/2} (h(log 2) + h(-log 2)) on the minimiser.
- Combination 3 (PR 21 suzuki-recurrence, PR 27 atlas section 7): Psi_F(W) = (W/2) W_F(e_0), e_0 the normalised box of width W; H_{h,m} = Toeplitz(q), q_0 = 2 Psi(h)/h, q_d = (Psi((d+1)h) - 2 Psi(dh) + Psi((d-1)h))/h; this is the Weil form on step functions of mesh h and support mh. For a general object (derived here by the same computation as PR 21, PROVED):
  Psi_F(W) = (W/2)(2 log Q + sum_j (psi(z_j) - log pi)) + sum_j sum_{k>=0} (1 - e^{-2(k+z_j)W})/(4 (k+z_j)^2) + sum_poles 2(cosh(pW) - 1)/p^2 - sum_n c(n) n^{-1/2} (W - log n)_+ , z_j = 1/4 + kappa_j/2.
- Combination 4: mu_max(D_S, L_S) < 1 iff W > 0 on the subfamily, since W = L_S - D_S and L_S > 0 (semilocal Sonine identity, trace side >= 0.0650). The Sonine remainder D_S exists only for an Euler factor at 2, so for the controls the sign of lambda_min(W) on the subfamily is what was computed (L^2-normalised, not L_S-normalised). The numbers 0.392 and 0.291 of the source are L_S-normalised and are not reproduced; the crossing of the p = 2-only form is (section 1).
- Objects. With functional equation, own form: zeta; L(chi_-3) (odd, conductor 3); L(chi_5) (even, conductor 5); DH (odd gamma factor, conductor 5, coefficients (1, kappa, -kappa, -1, 0), c(n) by Dirichlet recursion, no pole); T-NR(q, c) = zeta(s)(1 + c q^{1/2-s} + q^{1-2s}), Q = q, c(q^k) = (1 - alpha^k - beta^k) log q with alpha + beta = -c sqrt q, alpha beta = q; c = 2.2 has zeros off the line, c = 1.0 has them on the line (extra positive comparison); E_b = zeta(s+b) zeta(s-b), gamma parameters 1/4 +- b/2, poles p = 1/2 +- b, c(n) = Lambda(n)(n^b + n^-b), b = 1/8, 1/4. Without functional equation, tested in zeta's form (zeta's gamma factor, zeta's pole or the pole projected out): the 15 non-trivial completely multiplicative sign patterns on p = 2,3,5,7 (includes Liouville); random signs SGN-00, SGN-01 (battery seeds) for combination 3; unimodular U-00..U-07 (battery seed rule) and WT = Lambda(n) n^{-i alpha}, alpha = 1.2393; THIN-0.9, DEL-0.75, DEL-0.9 (battery sets; first primes affected: 5; 5,7; 3,5,7); Cramer model as every subset R of {3..K} with weight prod 1/log n, c(n) = log n on R, c(2) = log 2 (exact enumeration, 2^(K-2) subsets, instead of sampling).
- Backward heat deformation: not run in any combination. It has no coefficient vector and no atomic prime side; its Weil functional is available only as a sum over a zero table, whose truncation error (about 1e-3 at height 2000) exceeds every margin in this note. Reported as not formulable for these four statistics.

## 1. Method and validation

Galerkin in the orthonormal Legendre basis of L^2(-a,a), N functions, time-domain assembly (no truncation in t). With S(v) = C(v) + C(v)^T, C(v)_{ij} = sqrt((2i+1)(2j+1))/2 int_{-1+v}^{1} P_i(s) P_j(s-v) ds (so h(u) corresponds to C(u/a)), the Gauss integral for psi gives (PROVED, checked below)

  Arch_z = int_0^2 (2I - S(v))/(2v) dv - (gamma + log 4a + log pi) I - a int_0^2 r_z(av) S(v) dv,  r_z(u) = e^{-2zu}/(1 - e^{-2u}) - 1/(2u),

rungs n^{-1/2} S(log n / a), pole vectors int phi_i e^{+-px}. All integrands are polynomial times analytic; Gauss-Legendre with N + 56 nodes per panel is exact for the polynomial part. python-flint balls at 320 bits (N = 160) and 384 bits (N = 320); Legendre recurrences in midpoint arithmetic (entry radii 1e-92). Eigenvalues: float64 when |lambda| > 1e-7; otherwise inverse subspace iteration and Rayleigh-Ritz in ball arithmetic. A Ritz value is an upper bound for the infimum over L^2, so every negative value in this note is a negative value of the form (up to the 1e-90 matrix accuracy); positive values are not certificates.

| check | known value | this code |
|---|---|---|
| [0,0] entry of the full zeta form = 2 Psi(2a)/(2a) (PR 21 formula), a = (ln 3)/2, ln 2, 0.5, (ln 5)/2 | closed form | agreement to 22 digits |
| full even residual, a = 0.5 / (ln 3)/2 (imp-96091, N = 32) | 9.403924e-7 / 5.633814e-8 | 9.403924e-7 / 5.633814e-8 at N = 32 |
| P_2 at a = 0.5; residual/P_2 at a = ln 2 | 1.2504e-2; 2.70e-11 | 1.2504e-2; 2.43e-11 (N = 160) |
| pole-free margins, certified lower bounds (ARB-LEGE) at ln 4, ln 5, ln 6 | 8.55e-8, 2.25e-12, 6.25e-17 | Ritz upper values 9.85e-8, 3.13e-12, 8.18e-17 (N = 160); 9.84e-8, 3.11e-12, 8.06e-17 (N = 320) |
| moment ladder at 2a = ln 3 | 9.5e-4, 0.0334, 0.414, 0.799 | 9.45e-4, 0.0331, 0.413, 0.798 |
| p = 2-only pole-free form changes sign (odd sector) | 2a* = 1.1316 | +0.0107 at 1.12, -0.0227 at 1.16 (linear interpolation 1.133); k >= 2 subfamily stays positive (0.260 at 1.16, 0.178 at 1.20) |
| Suzuki eps*, p = 2, k = 4, m = 256 | 1.0685379e-5 < eps* < 1.0685380e-5 | 1.068537961e-5 |
| DH own form positive to ln 11 | recorded Euler-blind to ln 11 | 7.7e-9 at ln 11 |
| DH Weil onset | a = 1.746 (2a = 3.49) | positive at 2a = 3.4, negative at 3.5 |

N-convergence (K = 3..6, N = 160 against 320): zeta margins change by 0.2 to 3 per cent, admissible edges by at most 3 per cent, O(1) negative values in the fourth digit. N = 32 is not converged for K >= 5 (pole-free K = 5: 1.1e-13 at N = 32, 8.2e-17 at N = 160). Convergence is algebraic because the minimisers have kinks at x = +-a -+ log n.

Small local case (Mac, `scripts/memcap.sh 8`): N = 24, 32, 48 validation and K = 2, 5, 6 runs; Suzuki with X = 70000, k <= 4. Server runs through `rhrun` only: units s2w-n160c (4 cores, 5 GB, 39 min), s2w-n320b (4 cores, 7 GB, 49 min), s2w-suz (4 cores, 10 GB, 22 min), s2w-dh (4 cores, 5 GB, 8 min). Two earlier units are void and not used: one was stopped for speed, one (N = 320 with ball-arithmetic Legendre recurrences) lost all precision to radius growth (1 + sqrt 2)^N and gave a negative zeta value; it was rerun with midpoint recurrences.

## 2. Combination 1: which coefficient vectors keep lambda_min > 0

Finite consequence tested: for 2a = ln(K+1), lambda_min of the pole-free form with zeta's symbol and coefficient vector c stays positive for c = Lambda and is negative for each control's c. Survival would have needed: every control negative at 2a <= ln 6 while a non-Euler object with a functional equation cannot pass in its own form.

Lambda_min (Ritz, N = 160). Columns 3..7 and the last two are own forms; the middle columns are zeta's gamma factor with the pole projected out.

| K | 2a = ln(K+1) | zeta, pole-free | zeta, full | L(chi_-3) own | L(chi_5) own | DH own | sign patterns < 0 (pole-free) | Liouville | DEL-0.9 | U-00..07 < 0 | WT | Cramer P(<0) | T-NR q<=K, c=2.2 (own) | E_1/8 (own) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 1.0986 | 9.45e-04 | 5.54e-08 | 9.7e-03 | 4.3e-02 | 2.1e-01 | 8 of 8 | -8.4e-02 | 9.5e-04 | 8 of 8 | -9.2e-02 | 0.00 | q2: -1.3e-01 | -9.0e-06 |
| 3 | 1.3863 | 9.85e-08 | 7.55e-13 | 2.5e-04 | 5.2e-03 | 4.1e-02 | 12 of 12 | -3.7e-01 | -8.3e-02 | 8 of 8 | -1.6e-01 | 0.09 | q2: -1.4e-01; q3: -1.9e-01 | -2.5e-03 |
| 4 | 1.6094 | 3.13e-12 | 9.25e-18 | 7.6e-06 | 6.8e-04 | 6.0e-03 | 12 of 12 | -1.1e+00 | -3.7e-01 | 8 of 8 | -1.9e-01 | 1.00 | q2: -2.6e-01; q3: -2.2e-01 | -1.1e-02 |
| 5 | 1.7918 | 8.18e-17 | 7.28e-23 | 1.3e-07 | 4.9e-05 | 7.2e-04 | 14 of 14 | -1.2e+00 | -4.2e-01 | 8 of 8 | -2.2e-01 | 1.00 | q2: -3.9e-01; q3: -2.2e-01; q5: -1.9e-01 | -1.6e-02 |
| 6 | 1.9459 | 1.05e-21 | 6.71e-28 | 3.1e-09 | 4.9e-06 | 8.6e-05 | 14 of 14 | -1.3e+00 | -4.9e-01 | 8 of 8 | -2.4e-01 | 1.00 | q2: -5.1e-01; q3: -2.2e-01; q5: -2.9e-01 | -3.2e-02 |
| 7 | 2.0794 | 1.37e-26 | 4.14e-33 | 5.5e-11 | 6.1e-07 | 7.2e-06 | 15 of 15 | -1.4e+00 | -5.2e-01 | 8 of 8 | -2.6e-01 | 1.00 | q2: -5.5e-01; q3: -2.2e-01; q5: -3.1e-01; q7: -1.4e-01 | -4.2e-02 |
| 8 | 2.1972 | 1.28e-31 | 2.68e-38 | 1.2e-12 | 4.8e-08 | 7.4e-07 | 15 of 15 | -1.4e+00 | -6.2e-01 | 8 of 8 | -2.8e-01 | 1.00 | q2: -1.1e+00; q3: -2.2e-01; q5: -3.2e-01; q7: -3.2e-01 | -5.3e-02 |
| 9 | 2.3026 | 1.41e-36 | 1.62e-43 | 1.8e-14 | 3.3e-09 | 8.2e-08 | 15 of 15 | -1.4e+00 | -7.2e-01 | 8 of 8 | -3.1e-01 | 1.00 | q2: -1.4e+00; q3: -3.5e-01; q5: -3.2e-01; q7: -3.6e-01 | -5.5e-02 |
| 10 | 2.3979 | 1.22e-41 | 1.05e-48 | 3.8e-16 | 3.2e-10 | 7.7e-09 | 15 of 15 | -1.7e+00 | -7.6e-01 | 8 of 8 | -3.3e-01 | 1.00 | q2: -1.5e+00; q3: -4.2e-01; q5: -3.2e-01; q7: -3.7e-01 | -6.2e-02 |

Admissible set around the base vector. One coefficient moved, the others fixed; the interval is given relative to the base value. Ritz sets contain the true sets, so the true intervals are no wider. "Widest of 16 random directions" is the largest half-width found along 16 random unit directions in R^(K-1).

| K | zeta pole-free: c(2) | c(3) | c(K) | widest of 16 random directions | zeta full: c(2) | DH own: c(2) | DH own: c(3) | DH: widest of 16 | L(chi_-3) own: c(2) |
|---|---|---|---|---|---|---|---|---|---|
| 2 | [-1.2e+00, 4.4e-03] |  | [-1.2e+00, 4.4e-03] | 1.2e+00 | [-1.3e-03, 2.1e-06] | [-2.0e+00, 4.4e-01] |  | 2.0e+00 | [-3.8e-01, 4.0e-02] |
| 3 | [-6.1e-04, 9.4e-07] | [-1.9e-04, 7.2e-06] | [-1.9e-04, 7.2e-06] | 2.5e+00 | [-1.2e-07, 1.7e-11] | [-1.6e+00, 6.4e-02] | [-2.0e+00, 3.1e-01] | 2.5e+00 | [-4.9e-02, 7.1e-04] |
| 4 | [-3.5e-08, 6.3e-11] | [-9.7e-09, 1.2e-10] | [-1.2e-06, 1.1e-07] | 4.5e-03 | [-3.6e-12, 1.6e-16] | [-1.3e+00, 8.4e-03] | [-8.2e-01, 3.3e-02] | 4.0e+00 | [-2.3e-03, 1.9e-05] |
| 5 | [-5.3e-13, 5.7e-15] | [-3.9e-13, 2.4e-15] | [-3.3e-08, 4.5e-09] | 7.0e-10 | [-9.3e-17, 1.1e-21] | [-7.0e-01, 9.7e-04] | [-2.1e-01, 3.5e-03] | 3.0e+00 | [-9.9e-05, 3.0e-07] |
| 6 | [-1.1e-19, 1.1e-18] | [-7.5e-18, 2.7e-20] | [-1.2e-09, 2.2e-10] | 3.3e-11 | [-1.2e-21, 9.4e-27] | [-2.4e-01, 1.1e-04] | [-4.6e-02, 3.9e-04] | 3.5e+00 | [-2.7e-06, 7.0e-09] |
| 7 | [-4.9e-25, 2.2e-23] | [-1.4e-22, 3.1e-25] | [-8.5e-11, 1.6e-11] | 1.3e-15 | [-1.5e-26, 5.5e-32] | [-4.9e-02, 9.4e-06] | [-7.3e-03, 3.2e-05] | 2.6e+00 | [-8.0e-08, 1.2e-10] |
| 8 | [-3.1e-30, 2.9e-28] | [-1.9e-27, 2.7e-30] | [-6.3e-12, 1.4e-12] | 1.6e-24 | [-1.4e-31, 3.4e-37] | [-6.4e-03, 9.5e-07] | [-8.2e-04, 3.2e-06] | 1.2e+00 | [-1.9e-09, 2.6e-12] |
| 9 | [-2.7e-35, 4.2e-33] | [-2.8e-32, 2.9e-35] | [-7.4e-13, 1.7e-13] | 1.5e-28 | [-1.6e-36, 2.0e-42] | [-8.9e-04, 1.0e-07] | [-1.0e-04, 3.4e-07] | 2.7e+00 | [-5.2e-11, 3.8e-14] |
| 10 | [-2.0e-40, 4.4e-38] | [-2.9e-37, 2.4e-40] | [-8.0e-14, 2.2e-14] | 9.2e-24 | [-1.3e-41, 1.2e-47] | [-1.5e-04, 9.8e-09] | [-1.5e-05, 3.2e-08] | 2.4e+00 | [-9.9e-13, 8.2e-16] |

Facts (MEASURED unless marked):

1. (PROVED) The admissible set A = {c : lambda_min(c) >= 0} is closed and convex (lambda_min is an infimum of affine functions of c), and its projection decreases with the support. Each test vector v cuts a half-space sum_n c(n) g_n(v) <= Arch(v), g_n(v) = n^{-1/2}(h_v(log n) + h_v(-log n)); g_n takes both signs, so the cuts come from both sides.
2. Lambda is an interior point at every K (zeta passes), at distance of the order of the margin from the boundary in **both** directions of every coordinate. The body is thinnest in c(2) and widest in c(K): at 2a = ln 6, c(2) in log 2 + [-5.3e-13, 5.7e-15], c(5) in log 5 + [-3.3e-8, 4.5e-9]; over 16 random directions the widest half-width is 7e-10. With the pole kept the intervals are narrower by the ratio of the margins (c(2) upper edge 1.1e-21 at ln 6).
3. Consequence for the controls without functional equation: any change of a coefficient n <= K by more than these widths gives a negative form. All sign patterns, Liouville, the unimodular twists, WT, deletions and the Cramer model are negative by 0.08 to 1.7 from the first K at which a changed coefficient is active. The Cramer failure probability is 0 at K = 2, 0.09 at K = 3 (the event "3 is not chosen") and 1 from K = 4 on because the model has no prime powers: the true primes with c(4) = 0 already give -0.10 at 2a = ln 5. The source figure of 53-66 per cent (other test functions, full form) is not reproduced by this statistic.
4. The same holds for objects that are not Euler products. In DH's own form the admissible interval of c(2) around the DH value is [-0.70, +9.7e-4] at ln 6 and [-1.5e-4, +9.8e-9] at ln 11; for L(chi_-3) it is [-9.9e-13, +8.2e-16] at ln 11. The width follows the margin of the form (DH 7.7e-9, L(chi_5) 3.2e-10, L(chi_-3) 3.8e-16, zeta 1.2e-41 at ln 11), i.e. the conductor and parity of the gamma factor, not multiplicativity.
5. Controls with a functional equation: DH positive at every K. T-NR(q, 2.2) negative for every K >= q; T-NR(q, 1.0) positive. E_1/8 negative from 2a = 1.0 (+1.8e-5 at 0.9, -8.0e-6 at 1.0); E_1/4 negative already at 0.9 (-2.8e-5).

Why this is not a survivor. The controls that fail at 2a <= ln 6 are (a) those without functional equation, which fail because zeta's gamma factor and pole admit one coefficient vector only: a statement about the pair (gamma factor, coefficients), which the control never claimed to satisfy; (b) T-NR and E_a, whose lowest zeros are off the line (T-NR: lattice of pairs at heights (2m+1) pi / log q, seen by the form exactly at shifts k log q; E_a: every zero displaced, no on-line background, so the pair threshold sinh(2a delta)/delta - 2a > 0 holds for every a). DH, the control built to defeat Euler-blind tests, passes at every K in its own form and shows the same coefficient rigidity around its own vector. The rigidity is therefore the uniqueness part of a truncated moment problem for the zero-counting measure. It restates "the low zeros are on the line" and belongs to P19 (finite Weil certificates below the crossover) and to the lessons "positivity/support of Lambda plus FE cannot suffice".

## 3. Combination 2: cancellation depth across u = ln 2 as a function of the coefficient at 2

Finite consequence tested: on the even minimiser of the full form, residual/P_2 has many digits for c(2) = log 2 and fewer than 2 digits (or a negative residual) for each control's value at 2.

| a | 2a | residual (zeta) | P_2 | residual/P_2 | digits | admissible c(2)/log 2 - 1, full form | sign twist x = -1 | x = 0 | DH value x = 0.284 | E_1/8 value x = 2.0075 | T-NR value x = 4.11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.5000 | 1.0000 | 9.34e-07 | 1.25e-02 | 7.46e-05 | 4.1 | [-2.6e-02, 7.4e-05] | -6.8e-01 | -2.5e-01 | -1.4e-01 | -4.7e-01 | -1.5e+00 |
| 0.5493 | 1.0986 | 5.54e-08 | 1.79e-02 | 3.10e-06 | 5.5 | [-1.9e-03, 3.1e-06] | -8.0e-01 | -3.4e-01 | -2.1e-01 | -4.9e-01 | -1.5e+00 |
| 0.6931 | 1.3863 | 7.55e-13 | 3.10e-02 | 2.43e-11 | 10.6 | [-1.7e-07, 2.4e-11] | -9.2e-01 | -4.4e-01 | -3.1e-01 | -4.9e-01 | -1.5e+00 |
| 0.8047 | 1.6094 | 9.25e-18 | 3.95e-02 | 2.34e-16 | 15.6 | [-5.2e-12, 2.3e-16] | -1.2e+00 | -5.8e-01 | -4.1e-01 | -6.8e-01 | -2.1e+00 |
| 0.8959 | 1.7918 | 7.28e-23 | 4.53e-02 | 1.61e-21 | 20.8 | [-1.3e-16, 1.6e-21] | -1.3e+00 | -6.7e-01 | -4.7e-01 | -7.0e-01 | -2.2e+00 |

(Columns 8..12: lambda_min over both parities of zeta's full form with c(2) = x log 2 and the other coefficients zeta's.) Scan at a = ln 2: x = 0.9999 gives -6.4e-6 and x = 1.0001 gives -4.9e-5, so the 10.6 digits exist for one value of x only; the residual is negative on both sides of it. Depth as a function of x at a = 0.5: 1.2 digits at x = 0.99, 2.9 at 0.999, 3.8 at 0.9999, 4.1 at 1, negative for x <= 0.9 and x >= 1.0001. Full scans: `tables_N160.md`, Table 4.

Own forms:

| object | form | a = 0.5 | (ln 3)/2 | ln 2 |
|---|---|---|---|---|
| L(chi_-3), own gamma factor | c(2)/log 2 = -1.000 | res 2.1e-02, P_2 -1.3e-01 | res 9.7e-03, P_2 -1.6e-01 | res 2.5e-04, P_2 -2.4e-01 |
| L(chi_5), own gamma factor | c(2)/log 2 = -1.000 | res 9.0e-02, P_2 -1.7e-01 | res 4.3e-02, P_2 -2.3e-01 | res 5.2e-03, P_2 -3.2e-01 |
| DH, own | c(2)/log 2 = 0.284 | res 3.0e-01, P_2 6.8e-02 | res 2.1e-01, P_2 8.8e-02 | res 4.1e-02, P_2 1.3e-01 |
| T-NR q = 2, own | c(2)/log 2 = 4.111 | res -1.1e-01, P_2 2.0e+00 | res -1.3e-01, P_2 2.0e+00 | res -1.4e-01, P_2 2.0e+00 |
| E_1/8, own | c(2)/log 2 = 2.008 | res -8.0e-06, P_2 2.4e-02 | res -9.0e-06, P_2 1.6e-02 | res -2.5e-03, P_2 7.7e-01 |
| E_1/4, own | c(2)/log 2 = 2.030 | res -4.2e-05, P_2 1.9e-02 | res -7.5e-04, P_2 5.6e-01 | res -2.3e-02, P_2 5.1e-01 |

- With the gamma factor of L(chi_-3) or L(chi_5) and c(2) = -log 2 the form is positive and P_2 is negative on the minimiser: the prime term adds to the archimedean term, there is no cancellation to measure. The admissible interval of c(2) is still two-sided (L(chi_-3): [-4.9e-2, +7.1e-4] at ln 4).
- DH: positive, P_2 > 0, residual/P_2 = 4.4, 2.4, 0.32: depth below one digit. Under the stated criterion (fail = depth < 2 digits) DH "fails", but so does L(chi_5); depth measures how close the support is to the first zero-resolution scale of the object (conductor 5 has margins 0.04 where zeta has 1e-12), not the presence of an Euler product. As a pass/fail statistic the sign of the residual is the meaningful one, and DH passes it.
- Joint pinning at u = ln 3, ln 4, ln 5 (2a = ln 6, full form): c(2), c(3), c(4), c(5) in Lambda + [-9.3e-17, 1.1e-21], [-4.5e-15, 4.8e-19], [-2.5e-12, 1.4e-15], [-3.0e-8, 8.8e-11]. All four are pinned simultaneously, from both sides.

Classification: closed, same mechanism as combination 1. The "exact archimedean versus p = 2 cancellation" pins the coefficient at 2 because the gamma factor leaves one admissible value; DH's gamma factor pins DH's value.

## 4. Combination 3: Suzuki screw function and dyadic cell matrices

Finite consequence tested: every cell matrix of Psi_zeta is positive while each control has a negative cell matrix at a support that grows more slowly than log q (T-NR) or lies below its zero resolution (DH). Coefficients to 10^7 for every object (DH by Dirichlet recursion), Psi on the grid d log 2 / 64, d <= 1488, at 50 digits; eigenvalues in float64 from 50-digit entries; every first-negative matrix with m <= 400 was re-evaluated as a 50-digit Rayleigh quotient of the float eigenvector and agrees to 12 digits; positive verdicts have lambda_min >= 6.7e-7 against a float error of about 1e-10. "/zpole" = zeta's gamma factor and pole; "/pf" = no pole term and step vectors orthogonal to e^{+-x/2}.

| object | k = 2 (h = 0.1733) | k = 3 (h = 0.0866) | k = 4 (h = 0.0433) | k = 5 (h = 0.0217) | k = 6 (h = 0.0108) |
|---|---|---|---|---|---|
| ZETA | pos (4.5e-05) | pos (2.1e-05) | pos (4.1e-06) | pos (1.9e-06) | pos (6.7e-07) |
| ZETA/pf | pos (4.3e-04) | pos (3.6e-04) | pos (3.5e-05) | pos (2.4e-05) | pos (2.2e-06) |
| CHI-3 | pos (2.2e-04) | pos (1.2e-04) | pos (2.0e-05) | pos (1.2e-05) | pos (1.3e-06) |
| CHI5 | pos (3.5e-04) | pos (5.7e-05) | pos (2.1e-05) | pos (8.9e-06) | pos (1.4e-06) |
| DH | neg from W = 14.036 | neg from W = 10.051 | neg from W = 7.841 | neg from W = 5.588 | neg from W = 3.888 |
| EA-0.125 | neg from W = 7.278 | neg from W = 6.498 | neg from W = 4.202 | neg from W = 2.946 | neg from W = 2.004 |
| EA-0.25 | neg from W = 5.372 | neg from W = 3.986 | neg from W = 2.729 | neg from W = 1.863 | neg from W = 1.278 |
| TNR-q2-c2.2 | neg from W = 1.213 | neg from W = 1.040 | neg from W = 0.953 | neg from W = 0.910 | neg from W = 0.910 |
| TNR-q3-c2.2 | neg from W = 1.733 | neg from W = 1.473 | neg from W = 1.343 | neg from W = 1.278 | neg from W = 1.256 |
| TNR-q5-c2.2 | neg from W = 2.253 | neg from W = 1.993 | neg from W = 1.776 | neg from W = 1.755 | neg from W = 1.733 |
| TNR-q7-c2.2 | neg from W = 2.426 | neg from W = 2.339 | neg from W = 2.123 | neg from W = 2.079 | neg from W = 2.058 |
| TNR-q101-c2.2 | neg from W = 5.199 | neg from W = 4.852 | neg from W = 4.765 | neg from W = 4.700 | neg from W = 4.679 |
| TNR-q3-c1.0 | pos (1.8e-04) | pos (8.8e-05) | pos (3.5e-05) | pos (1.0e-05) | pos (9.9e-07) |
| TNR-q101-c1.0 | pos (8.9e-04) | pos (3.9e-04) | pos (1.5e-04) | pos (2.6e-05) | pos (1.0e-05) |
| SGN-LIOU/zpole | neg from W = 0.866 | neg from W = 0.780 | neg from W = 0.736 | neg from W = 0.736 | neg from W = 0.726 |
| SGN-00/zpole | neg from W = 0.866 | neg from W = 0.780 | neg from W = 0.736 | neg from W = 0.736 | neg from W = 0.726 |
| SGN-01/zpole | neg from W = 1.213 | neg from W = 1.126 | neg from W = 1.126 | neg from W = 1.126 | neg from W = 1.126 |
| U-00/zpole | neg from W = 0.866 | neg from W = 0.780 | neg from W = 0.736 | neg from W = 0.736 | neg from W = 0.736 |
| WT/zpole | neg from W = 0.866 | neg from W = 0.866 | neg from W = 0.780 | neg from W = 0.758 | neg from W = 0.758 |
| THIN-0.9/zpole | neg from W = 1.733 | neg from W = 1.646 | neg from W = 1.646 | neg from W = 1.625 | neg from W = 1.625 |
| DEL-0.75/zpole | neg from W = 1.733 | neg from W = 1.733 | neg from W = 1.646 | neg from W = 1.646 | neg from W = 1.635 |
| DEL-0.9/zpole | neg from W = 1.213 | neg from W = 1.213 | neg from W = 1.170 | neg from W = 1.148 | neg from W = 1.137 |
| SGN-LIOU/pf | neg from W = 1.386 | neg from W = 1.126 | neg from W = 1.083 | neg from W = 1.083 | neg from W = 1.072 |
| SGN-00/pf | neg from W = 1.213 | neg from W = 1.126 | neg from W = 1.083 | neg from W = 1.083 | neg from W = 1.072 |
| SGN-01/pf | neg from W = 1.560 | neg from W = 1.213 | neg from W = 1.170 | neg from W = 1.126 | neg from W = 1.126 |
| U-00/pf | neg from W = 1.213 | neg from W = 1.126 | neg from W = 1.083 | neg from W = 1.083 | neg from W = 1.061 |
| WT/pf | neg from W = 1.560 | neg from W = 1.213 | neg from W = 1.083 | neg from W = 1.040 | neg from W = 1.040 |
| THIN-0.9/pf | neg from W = 1.733 | neg from W = 1.733 | neg from W = 1.646 | neg from W = 1.646 | neg from W = 1.625 |
| DEL-0.75/pf | neg from W = 2.253 | neg from W = 1.733 | neg from W = 1.690 | neg from W = 1.646 | neg from W = 1.635 |
| DEL-0.9/pf | neg from W = 1.560 | neg from W = 1.473 | neg from W = 1.213 | neg from W = 1.148 | neg from W = 1.137 |

Thresholds for zeta: least eps with a negative direction of Psi - eps(|r| - log p)_+ (first number) and of Psi + eps(|r| - log p)_+ (second number):

| k | m | support/log 2 | lambda_min(H) zeta | p=2 | p=3 | p=5 | p=7 | p=101 |
|---|---|---|---|---|---|---|---|---|
| 4 | 32 | 2.00 | 3.078e-03 | 4.1360e-03 / 1.4e-02 | 2.3763e-02 / 3.9e-02 |  |  |  |
| 4 | 64 | 4.00 | 7.896e-04 | 5.1306e-04 / 6.6e-03 | 7.4458e-04 / 3.7e-03 | 1.4529e-03 / 3.5e-03 | 2.6920e-03 / 5.4e-03 |  |
| 4 | 128 | 8.00 | 1.774e-04 | 9.5248e-05 / 5.0e-03 | 1.0558e-04 / 2.2e-03 | 1.2766e-04 / 1.5e-03 | 1.5025e-04 / 1.1e-03 | 1.8083e-03 / 3.0e-03 |
| 4 | 192 | 12.00 | 4.094e-05 | 2.1167e-05 / 3.3e-03 | 2.2194e-05 / 1.7e-03 | 2.4173e-05 / 9.0e-04 | 2.5955e-05 / 6.5e-04 | 6.8133e-05 / 3.9e-04 |
| 4 | 256 | 16.00 | 2.096e-05 | 1.0685e-05 / 2.3e-03 | 1.0993e-05 / 1.3e-03 | 1.1593e-05 / 5.0e-04 | 1.2135e-05 / 3.4e-04 | 2.3631e-05 / 1.4e-04 |
| 4 | 320 | 20.00 | 9.842e-06 | 4.9836e-06 / 1.9e-03 | 5.0746e-06 / 9.8e-04 | 5.2430e-06 / 3.3e-04 | 5.3880e-06 / 2.2e-04 | 7.8300e-06 / 1.1e-04 |
| 4 | 372 | 23.25 | 4.060e-06 | 2.0488e-06 / 1.7e-03 | 2.0764e-06 / 7.6e-04 | 2.1281e-06 / 2.8e-04 | 2.1727e-06 / 2.0e-04 | 2.8901e-06 / 7.7e-05 |
| 6 | 128 | 2.00 | 2.954e-04 | 4.4525e-04 / 1.3e-03 | 3.4172e-03 / 6.1e-03 |  |  |  |
| 6 | 256 | 4.00 | 5.910e-05 | 3.9190e-05 / 6.1e-04 | 5.9081e-05 / 3.1e-04 | 1.2744e-04 / 2.8e-04 | 2.6191e-04 / 4.3e-04 |  |
| 6 | 512 | 8.00 | 1.255e-05 | 6.7598e-06 / 4.6e-04 | 7.5294e-06 / 1.7e-04 | 9.1764e-06 / 9.7e-05 | 1.0834e-05 / 8.8e-05 | 2.1009e-04 / 2.0e-04 |
| 6 | 768 | 12.00 | 2.955e-06 | 1.5277e-06 / 2.7e-04 | 1.6029e-06 / 1.2e-04 | 1.7510e-06 / 8.0e-05 | 1.8872e-06 / 5.9e-05 | 5.5906e-06 / 2.6e-05 |
| 6 | 1024 | 16.00 | 1.466e-06 | 7.4779e-07 / 2.1e-04 | 7.7063e-07 / 9.5e-05 | 8.1567e-07 / 6.3e-05 | 8.5661e-07 / 4.3e-05 | 1.7532e-06 / 8.1e-06 |
| 6 | 1280 | 20.00 | 9.189e-07 | 4.6538e-07 / 2.0e-04 | 4.7439e-07 / 7.8e-05 | 4.9176e-07 / 4.5e-05 | 5.0709e-07 / 2.9e-05 | 7.8235e-07 / 6.3e-06 |
| 6 | 1488 | 23.25 | 6.665e-07 | 3.3636e-07 / 1.9e-04 | 3.4105e-07 / 6.8e-05 | 3.5008e-07 / 3.6e-05 | 3.5800e-07 / 2.4e-05 | 4.9217e-07 / 4.8e-06 |

- Zeta, L(chi_-3), L(chi_5), T-NR(c = 1.0): positive on every cell matrix reached.
- eps*: the source value is reproduced. eps_plus is close to lambda_min(H)/2 for every p (the minimiser is slowly varying), so it measures the least eigenvalue of the step-function compression: it falls from 4e-3 (support 2 log 2) to 2.0e-6 (23.25 log 2) at k = 4 and by a further factor 6 to 14 from k = 4 to k = 6. It is mesh-limited: the L^2 value at support ln 6 is 1e-21 (section 2). The threshold in the decreasing direction is larger by a factor 3 (support 2 log 2) to 800 (support 23.25 log 2). Rigidity on cell matrices is two-sided as well.
- T-NR(q, 2.2): first negative support minus log q = 0.217, 0.157, 0.124, 0.112, 0.064 for q = 2, 3, 5, 7, 101 (k = 6). The support grows like log q + o(1). Below log q the T-NR form equals zeta's plus 2 log q times the identity, so no test of this type can fail earlier. The survival condition "slower than log q" fails.
- DH: negative only for k >= 2 and at supports 14.0, 10.1, 7.84, 5.59, 3.89 as the mesh is refined; the L^2 limit (own form, Galerkin N = 320, below) lies between 3.4 and 3.5. The first off-line zero is at 0.8085 + 85.70i; the mean zero spacing there is 2 pi / log(5 * 85.7 / 2 pi) = 1.49, and 2 pi / 3.45 = 1.82. DH fails when the support reaches the scale that resolves individual zeros at that height, and only on meshes fine enough to carry frequency 85.7 (h < pi/85.7 = 0.037, i.e. k >= 5 for the sharp value). No cell below that resolution is negative.

| 2a | DH even | DH odd | L(chi_-3) even | L(chi_-3) odd |
|---|---|---|---|---|
| 2.4 | 7.30e-09 | 7.67e-06 | 3.50e-16 | 5.17e-13 |
| 2.8 | 1.31e-14 | 2.79e-11 | 8.43e-26 | 3.40e-22 |
| 3.0 | 2.79e-18 | 1.05e-14 | 2.66e-32 | 1.84e-28 |
| 3.2 | 4.25e-23 | 3.59e-19 | 3.25e-40 | 3.03e-36 |
| 3.4 | 9.00e-29 | 6.23e-25 | 6.11e-50 | 9.69e-46 |
| 3.5 | -2.54e-23 | -7.67e-21 | 1.43e-55 | 2.50e-51 |
| 3.6 | -2.69e-07 | -8.99e-09 | 8.08e-62 | 1.68e-57 |
| 3.8 | -2.71e-01 | -2.51e-01 | 3.57e-76 | 1.01e-71 |
| 4.0 | -7.11e-01 | -7.66e-01 | 1.42e-89 | 2.68e-85 |
| 4.5 | -1.33e+00 | -1.34e+00 | 2.60e-20 | 2.04e-37 |

(DH and L(chi_-3) own forms on L^2(-a,a), N = 320, 384 bits. The value at 3.5 is negative with matrix accuracy 1e-90; the positive value at 3.4 is a Ritz upper bound, so the onset is at most 3.5 and, as far as N = 320 resolves it, above 3.4. L(chi_-3) at 4.5 is not converged at this N.)

- E_1/8, E_1/4: negative from supports 2.00 and 1.28 at k = 6, decreasing with k (L^2: near 1.0, section 2).
- Controls without functional equation: negative from 0.73 to 1.13 with zeta's pole and from 1.04 to 1.14 on pole-free step vectors when the coefficient at 2 or 3 is changed; THIN-0.9 and DEL-0.75 from 1.62 to 1.65 (first changed prime 5, log 5 = 1.609).

Classification: closed. P9 and P6 stand: the cell matrices are the Weil form on step functions and inherit sections 2 and 3.

## 5. Combination 4: pole-free and vanishing-moment subfamilies, 2a in [0.9, 1.6]

Finite consequence tested: with the pole projected out and k moments removed, zeta stays positive and each control turns negative at a support far below its Weil onset (DH: 2a = 3.49).

lambda_min (N = 160), k = 0..3 vanishing moments; zeta-form objects pole-free; own-form objects with their own poles projected out where they have poles.

| object | k | 0.9 | 1 | 1.099 | 1.12 | 1.16 | 1.2 | 1.3 | 1.386 | 1.4 | 1.5 | 1.6 | 1.609 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 0 | 6.6e-02 | 1.2e-02 | 9.5e-04 | 5.8e-04 | 2.1e-04 | 6.6e-05 | 2.3e-06 | 9.9e-08 | 5.5e-08 | 7.4e-10 | 5.3e-12 | 3.1e-12 |
|  | 1 | 4.8e-01 | 1.9e-01 | 3.3e-02 | 2.0e-02 | 8.4e-03 | 3.3e-03 | 1.8e-04 | 1.1e-05 | 6.5e-06 | 9.2e-08 | 9.8e-10 | 6.3e-10 |
|  | 2 | 8.7e-01 | 7.4e-01 | 4.1e-01 | 3.1e-01 | 1.6e-01 | 7.5e-02 | 8.4e-03 | 6.0e-04 | 4.0e-04 | 9.2e-06 | 1.3e-07 | 8.3e-08 |
|  | 3 | 8.7e-01 | 8.4e-01 | 8.0e-01 | 7.8e-01 | 7.3e-01 | 5.6e-01 | 1.4e-01 | 1.9e-02 | 1.3e-02 | 6.3e-04 | 1.1e-05 | 7.6e-06 |
| zeta, p = 2 only | 0 | 6.6e-02 | 1.2e-02 | 9.5e-04 | 7.9e-04 | -2.3e-02 | -4.7e-02 | -7.8e-02 | -8.3e-02 | -8.3e-02 | -1.7e-01 | -2.5e-01 | -2.6e-01 |
|  | 1 | 4.8e-01 | 1.9e-01 | 3.3e-02 | 1.1e-02 | -2.3e-02 | -4.7e-02 | -7.8e-02 | -8.3e-02 | -8.3e-02 | -1.4e-01 | -1.6e-01 | -1.6e-01 |
|  | 2 | 8.7e-01 | 7.4e-01 | 4.1e-01 | 3.6e-01 | 2.6e-01 | 1.8e-01 | 2.4e-02 | -6.6e-02 | -7.7e-02 | -1.4e-01 | -1.6e-01 | -1.6e-01 |
|  | 3 | 8.7e-01 | 8.4e-01 | 8.0e-01 | 7.6e-01 | 6.7e-01 | 5.8e-01 | 3.7e-01 | 2.1e-01 | 1.9e-01 | 4.1e-02 | -9.7e-02 | -1.1e-01 |
| sign flip at 2 | 0 | 4.7e-01 | 2.0e-01 | -8.4e-02 | -1.7e-01 | -3.6e-01 | -5.3e-01 | -7.9e-01 | -9.2e-01 | -9.4e-01 | -1.1e+00 | -1.2e+00 | -1.2e+00 |
|  | 1 | 5.4e-01 | 5.1e-01 | 4.9e-01 | 4.8e-01 | 4.6e-01 | 4.4e-01 | 1.3e-01 | -2.2e-01 | -2.5e-01 | -4.4e-01 | -6.7e-01 | -6.9e-01 |
|  | 2 | 6.1e-01 | 5.1e-01 | 4.9e-01 | 4.8e-01 | 4.8e-01 | 4.7e-01 | 4.6e-01 | 3.8e-01 | 3.3e-01 | 1.4e-02 | -6.6e-02 | -7.1e-02 |
|  | 3 | 1.0e+00 | 6.5e-01 | 4.9e-01 | 4.8e-01 | 4.8e-01 | 4.7e-01 | 4.6e-01 | 4.1e-01 | 3.9e-01 | 2.9e-01 | 4.6e-02 | 3.6e-02 |
| sign flip at 3 | 0 | 6.6e-02 | 1.2e-02 | 9.5e-04 | -5.4e-03 | -8.1e-02 | -1.3e-01 | -1.8e-01 | -2.6e-01 | -3.0e-01 | -6.4e-01 | -8.5e-01 | -8.7e-01 |
|  | 1 | 4.8e-01 | 1.9e-01 | 3.3e-02 | -5.4e-03 | -8.1e-02 | -1.3e-01 | -1.8e-01 | -2.5e-01 | -2.7e-01 | -3.9e-01 | -4.1e-01 | -4.4e-01 |
|  | 2 | 8.7e-01 | 7.4e-01 | 4.1e-01 | 3.8e-01 | 3.3e-01 | 2.6e-01 | -5.3e-02 | -2.5e-01 | -2.7e-01 | -3.9e-01 | -4.1e-01 | -4.3e-01 |
|  | 3 | 8.7e-01 | 8.4e-01 | 8.0e-01 | 7.2e-01 | 6.0e-01 | 5.5e-01 | 5.1e-01 | 2.9e-01 | 2.5e-01 | -8.7e-02 | -4.1e-01 | -4.3e-01 |
| Liouville | 0 | 4.7e-01 | 2.0e-01 | -8.4e-02 | -1.2e-01 | -1.5e-01 | -1.8e-01 | -2.5e-01 | -3.7e-01 | -4.1e-01 | -7.8e-01 | -1.0e+00 | -1.1e+00 |
|  | 1 | 5.4e-01 | 5.1e-01 | 4.9e-01 | 4.4e-01 | 2.5e-01 | 1.3e-01 | 6.3e-03 | -1.2e-02 | -1.2e-02 | -9.5e-02 | -2.3e-01 | -2.6e-01 |
|  | 2 | 6.1e-01 | 5.1e-01 | 4.9e-01 | 4.7e-01 | 4.3e-01 | 4.2e-01 | 1.9e-01 | 2.8e-02 | 5.1e-03 | -9.5e-02 | -1.8e-01 | -1.9e-01 |
|  | 3 | 1.0e+00 | 6.5e-01 | 4.9e-01 | 4.7e-01 | 4.3e-01 | 4.2e-01 | 3.4e-01 | 2.7e-01 | 2.4e-01 | 3.7e-02 | -1.8e-01 | -1.9e-01 |
| DEL-0.9 | 0 | 6.6e-02 | 1.2e-02 | 9.5e-04 | 7.9e-04 | -2.3e-02 | -4.7e-02 | -7.8e-02 | -8.3e-02 | -8.3e-02 | -2.4e-01 | -3.6e-01 | -3.7e-01 |
|  | 1 | 4.8e-01 | 1.9e-01 | 3.3e-02 | 1.1e-02 | -2.3e-02 | -4.7e-02 | -7.8e-02 | -8.3e-02 | -8.3e-02 | -1.7e-01 | -1.9e-01 | -1.9e-01 |
|  | 2 | 8.7e-01 | 7.4e-01 | 4.1e-01 | 3.6e-01 | 2.6e-01 | 1.8e-01 | 2.4e-02 | -6.6e-02 | -8.1e-02 | -1.7e-01 | -1.9e-01 | -1.9e-01 |
|  | 3 | 8.7e-01 | 8.4e-01 | 8.0e-01 | 7.6e-01 | 6.7e-01 | 5.8e-01 | 3.7e-01 | 2.1e-01 | 1.9e-01 | 5.6e-02 | -1.4e-01 | -1.6e-01 |
| U-00 | 0 | 3.8e-01 | 1.6e-01 | -1.1e-01 | -1.8e-01 | -3.5e-01 | -5.0e-01 | -7.4e-01 | -8.5e-01 | -8.7e-01 | -9.8e-01 | -1.1e+00 | -1.1e+00 |
|  | 1 | 5.1e-01 | 4.1e-01 | 3.9e-01 | 3.8e-01 | 3.7e-01 | 3.5e-01 | 8.4e-02 | -2.5e-01 | -2.9e-01 | -5.6e-01 | -7.5e-01 | -7.7e-01 |
|  | 2 | 6.4e-01 | 5.5e-01 | 4.2e-01 | 4.0e-01 | 3.7e-01 | 3.5e-01 | 2.9e-01 | 2.4e-01 | 2.2e-01 | -9.6e-04 | -2.6e-01 | -2.8e-01 |
|  | 3 | 9.9e-01 | 6.7e-01 | 5.5e-01 | 5.4e-01 | 5.2e-01 | 4.8e-01 | 3.4e-01 | 2.4e-01 | 2.2e-01 | 1.4e-01 | 2.6e-02 | 1.3e-02 |
| WT | 0 | 1.3e-01 | 3.4e-02 | -9.2e-02 | -1.1e-01 | -1.2e-01 | -1.4e-01 | -1.5e-01 | -1.6e-01 | -1.6e-01 | -1.8e-01 | -1.9e-01 | -1.9e-01 |
|  | 1 | 4.8e-01 | 2.3e-01 | 1.1e-01 | 9.3e-02 | 4.6e-02 | -1.9e-02 | -1.0e-01 | -1.3e-01 | -1.3e-01 | -1.4e-01 | -1.5e-01 | -1.5e-01 |
|  | 2 | 7.9e-01 | 7.1e-01 | 4.0e-01 | 3.2e-01 | 2.0e-01 | 1.4e-01 | 5.8e-02 | -6.3e-02 | -7.3e-02 | -1.1e-01 | -1.2e-01 | -1.2e-01 |
|  | 3 | 8.9e-01 | 7.7e-01 | 7.5e-01 | 7.4e-01 | 6.9e-01 | 5.1e-01 | 1.7e-01 | 9.3e-02 | 8.6e-02 | -4.6e-02 | -9.1e-02 | -9.3e-02 |
| T-NR q=2 (own, pf) | 0 | 5.9e-01 | 3.0e-01 | 2.1e-01 | 2.0e-01 | 1.4e-01 | 3.9e-02 | -7.4e-02 | -1.0e-01 | -1.0e-01 | -1.2e-01 | -1.3e-01 | -1.3e-01 |
|  | 1 | 5.9e-01 | 3.0e-01 | 2.1e-01 | 2.0e-01 | 1.4e-01 | 6.0e-02 | -1.9e-03 | -3.3e-02 | -4.7e-02 | -1.2e-01 | -1.3e-01 | -1.3e-01 |
|  | 2 | 1.1e+00 | 6.7e-01 | 3.8e-01 | 2.9e-01 | 1.4e-01 | 6.0e-02 | -1.9e-03 | -3.1e-02 | -4.3e-02 | -8.6e-02 | -1.1e-01 | -1.2e-01 |
|  | 3 | 1.3e+00 | 9.9e-01 | 7.1e-01 | 6.8e-01 | 6.2e-01 | 4.7e-01 | 8.8e-02 | -3.1e-02 | -4.3e-02 | -8.6e-02 | -1.1e-01 | -1.1e-01 |
| T-NR q=3 (own, pf) | 0 | 2.3e+00 | 2.2e+00 | 2.2e+00 | 1.4e+00 | 7.5e-01 | 5.7e-01 | 3.6e-01 | 6.0e-02 | 3.6e-02 | -2.5e-02 | -8.4e-02 | -9.0e-02 |
|  | 1 | 2.7e+00 | 2.4e+00 | 2.2e+00 | 1.7e+00 | 1.5e+00 | 1.0e+00 | 3.6e-01 | 6.0e-02 | 3.6e-02 | -2.5e-02 | -8.2e-02 | -8.8e-02 |
|  | 2 | 3.1e+00 | 2.9e+00 | 2.6e+00 | 1.7e+00 | 1.5e+00 | 1.1e+00 | 8.1e-01 | 4.5e-01 | 3.9e-01 | 4.8e-02 | -8.2e-02 | -8.8e-02 |
|  | 3 | 3.1e+00 | 3.0e+00 | 3.0e+00 | 2.6e+00 | 1.5e+00 | 1.1e+00 | 8.2e-01 | 6.1e-01 | 6.0e-01 | 3.4e-01 | 7.8e-02 | 5.7e-02 |
| E_1/8 (own, pf) | 0 | 1.7e+00 | 1.5e+00 | 8.2e-01 | 6.2e-01 | 3.1e-01 | 1.4e-01 | 1.3e-02 | -1.8e-03 | -2.1e-03 | -4.2e-03 | -1.0e-02 | -1.1e-02 |
|  | 1 | 1.7e+00 | 1.7e+00 | 1.6e+00 | 1.6e+00 | 1.4e+00 | 1.1e+00 | 2.7e-01 | 3.2e-02 | 1.9e-02 | -4.2e-03 | -7.5e-03 | -7.6e-03 |
|  | 2 | 2.0e+00 | 1.7e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.2e+00 | 4.9e-01 | 3.8e-01 | 2.8e-02 | -7.5e-03 | -7.6e-03 |
|  | 3 | 2.6e+00 | 1.9e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.5e+00 | 1.3e+00 | 1.2e+00 | 3.7e-01 | 2.0e-02 | 8.6e-03 |
| DH (own) | 0 | 4.0e-01 | 3.0e-01 | 2.1e-01 | 1.9e-01 | 1.6e-01 | 1.4e-01 | 8.2e-02 | 4.1e-02 | 3.7e-02 | 1.7e-02 | 6.6e-03 | 6.0e-03 |
|  | 1 | 1.5e+00 | 1.4e+00 | 1.4e+00 | 1.3e+00 | 1.3e+00 | 1.3e+00 | 1.1e+00 | 1.0e+00 | 9.9e-01 | 7.1e-01 | 4.5e-01 | 4.3e-01 |
|  | 2 | 1.8e+00 | 1.7e+00 | 1.7e+00 | 1.7e+00 | 1.7e+00 | 1.7e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 |
|  | 3 | 2.2e+00 | 2.0e+00 | 1.9e+00 | 1.9e+00 | 1.8e+00 | 1.8e+00 | 1.7e+00 | 1.7e+00 | 1.7e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 |
| L(chi_-3) (own) | 0 | 4.2e-02 | 2.1e-02 | 9.7e-03 | 8.0e-03 | 5.4e-03 | 3.5e-03 | 9.3e-04 | 2.5e-04 | 2.0e-04 | 4.1e-05 | 9.4e-06 | 7.6e-06 |
|  | 1 | 5.8e-01 | 3.9e-01 | 2.6e-01 | 2.3e-01 | 1.9e-01 | 1.6e-01 | 8.2e-02 | 3.3e-02 | 2.8e-02 | 7.5e-03 | 1.6e-03 | 1.5e-03 |
|  | 2 | 1.6e+00 | 1.3e+00 | 1.0e+00 | 9.7e-01 | 8.8e-01 | 8.0e-01 | 6.2e-01 | 4.8e-01 | 4.6e-01 | 2.5e-01 | 8.4e-02 | 7.2e-02 |
|  | 3 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.5e+00 | 1.4e+00 | 1.2e+00 | 1.1e+00 | 1.1e+00 | 1.0e+00 | 8.8e-01 | 8.6e-01 |
| L(chi_5) (own) | 0 | 1.5e-01 | 9.0e-02 | 4.3e-02 | 3.7e-02 | 2.7e-02 | 2.0e-02 | 9.5e-03 | 5.2e-03 | 4.8e-03 | 2.1e-03 | 7.6e-04 | 6.8e-04 |
|  | 1 | 1.1e+00 | 9.0e-01 | 7.6e-01 | 7.2e-01 | 6.4e-01 | 5.5e-01 | 3.4e-01 | 2.0e-01 | 1.9e-01 | 1.1e-01 | 6.0e-02 | 5.7e-02 |
|  | 2 | 2.1e+00 | 1.8e+00 | 1.5e+00 | 1.5e+00 | 1.5e+00 | 1.4e+00 | 1.4e+00 | 1.3e+00 | 1.2e+00 | 8.5e-01 | 5.9e-01 | 5.7e-01 |
|  | 3 | 2.2e+00 | 2.1e+00 | 2.1e+00 | 2.0e+00 | 1.9e+00 | 1.7e+00 | 1.6e+00 | 1.6e+00 | 1.6e+00 | 1.5e+00 | 1.4e+00 | 1.4e+00 |

- Zeta and both L-functions: positive for every k at every support. Zeta's ladder at ln 3 reproduces the source (9.45e-4, 0.0331, 0.413, 0.798).
- Sign and unimodular twists, pole projected out: they still fail. Flip at 2 (and Liouville, U-00, WT): positive at 2a = 1.0 (0.20, 0.20, 0.16, 0.035), negative at ln 3 (-0.084, -0.084, -0.105, -0.092). Flip at 3 and deletion of 3: positive at ln 3, negative from 1.12 and 1.16. The earlier record "fail through pole mismatch only" is therefore incomplete: with the pole removed they fail through the gamma factor, about 0.1 to 0.4 later in 2a.
- Moments move the failure outward, never inward: flip at 2 is positive for k = 1 through 2a = 1.3 (negative from ln 4), for k = 2 through 1.5 (negative at 1.6), for k = 3 through 1.6; flip at 3 is negative for k <= 1 from 1.12, for k = 2 from 1.3, for k = 3 from 1.5. A subfamily is a subspace, so its minimum can only be larger (min-over-subset identity of imp-96085); it removes the direction that detects the mismatch.
- T-NR q = 2: negative from 1.3 pole-free (from 1.0 with its pole); q = 3: positive through 1.4 pole-free, negative from 1.5 (from 1.3 with its pole). E_1/8 pole-free: negative from ln 4.
- DH: positive for every k at every support in the range; its onset is 3.4..3.5 (section 4), the predicted one. No subfamily makes it fail early.

Classification: closed. The subfamilies only weaken the test.

## 6. Limits and weakest steps

1. Positive values for zeta, the L-functions and DH are Ritz upper bounds, not certificates. They agree with the certified lower bounds where those exist (ln 4, ln 5, ln 6: ratio 1.15 to 1.3) and are stable from N = 160 to 320 for K <= 6. For K = 7..10 only N = 160 was run; the admissible widths there are upper bounds of unknown tightness (the K <= 6 comparison suggests a few per cent).
2. The admissible body was probed along coordinate axes, the scaling direction and 16 random directions per K, not enclosed. "Contracts onto one point" is measured along those directions; the proof of uniqueness in the limit is the cited finite-prime rigidity theorem (atlas section 7), not this computation.
3. The DH onset bracket (3.4, 3.5] rests on one basis size (N = 320); the lower end is not certified.
4. Combination 4 was computed L^2-normalised; the L_S-normalised margins of the source (0.392, 0.291) were not recomputed because D_S is not defined for objects without an Euler factor at 2. Signs are unaffected.
5. Backward heat: not run (section 0). Random-sign and unimodular controls with seeds other than those listed were not run in the Galerkin part; the 15 sign patterns on p <= 7 are exhaustive for K <= 10.

## 7. Files (all under this directory)

- `wlib.py` (assembly, eigen-solvers, coefficient generators), `validate.py`, `run_weil.py` (combinations 1, 2, 4), `suzuki.py` (combination 3), `dh_onset.py`, `mk_tables.py`, `show.py`.
- `weil_N160.json`, `weil_N320.json`, `suzuki_1e7.json`, `dh_onset_N320.json`; full tables `tables_N160.md` (includes all scans of combination 2 and every Suzuki level), `tables_N320.md`; local runs `weil_N32_local.json`, `suzuki_local.json`, `validate_N*.json`; logs `logs_*.log`.
- `set_*.npy`: copies of the battery sets (THIN-0.9, DEL-0.75, DEL-0.9).
- Server copy: `~/rh-push/s2-weil-coefficient-rigidity/`. All units of this lane have exited; none is running.
