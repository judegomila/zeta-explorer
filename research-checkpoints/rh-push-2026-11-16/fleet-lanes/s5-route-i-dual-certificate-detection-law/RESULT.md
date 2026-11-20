# s5-route-i-dual-certificate-detection-law: screening of four Route I combinations (2026-11-19/20)

Scope: `tmp/research-2026-11-16/push/s5-route-i-dual-certificate-detection-law/` only. Nothing committed or pushed. No statement about the zeros of zeta is claimed and no bound moves.
Labels: PROVED (elementary argument written here, no referee pass), CLASSICAL, MEASURED (numerics of this lane), ARGUED.
Reading rule for the numbers: every eigenvalue below is a Ritz value (an upper bound for the infimum of the form). A negative Ritz value is a negative value of the form on an explicit test function; a positive Ritz value is not a certificate of positivity. "Ball" means python-flint midpoint arithmetic at the stated precision (entry radii not propagated); "float64" values are a screen.

## Verdict

**Four combinations tested, no survivor.** All four reduce to one statistic, the infimum lambda_min(F, 2a) of the Weil form of the object F on L^2(-a, a). Its behaviour on the controls is the known pattern in every case: Davenport-Heilbronn turns negative only when the quadruple of off-line zeros at height 85.70 is resolved; E_b and planted quadruples follow a detection law written in the height and displacement of the off-line zeros; T-NR turns negative exactly when the support passes log q, by its coefficient at n = q; sign and unimodular twists fail by gamma-factor mismatch at 2a about 1.05.

| # | combination (nodes) | statistic | sizes reached | zeta | comparison L-functions | DH | zeta(s+b) zeta(s-b) | T-NR | sign twist | unimodular twist | heat tau < 0 | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | mem-positive-extension-certificate + mem-krein-certificate-lemma + krein-degree4-atom-cap + route-i-krein-certificate | optimal margin m(2a) of the dual certificate w_F + phihat >= m for the full form | LP (HiGHS, float64) for 11 object/support cases, 2a = 0.8 .. 1.6, up to 481 atoms and 9601 constraints; beyond that through the identity m <= lambda_min and the lambda_min tables of rows 2 and 3 (to 2a = 3.8 in balls, to log 1e5 in float64) | m_LP = 0.2005 (2a = 0.8) and 0.0078 (2a = 1.0) against lambda_min = 0.2252 and 0.0119 (pole-free form); m <= lambda_min <= 3.6e-220 at 2a = 3.8 | chi_5: 0.0863 against 0.0901; chi_-4: 0.1347 against 0.1400 (2a = 1.0) | m_LP = 0.2009 against 0.2087 at ln 3; lambda_min > 0 up to 3.42, negative from 3.43 (0.8 x 3.43 = 2.74: no failure below it) | negative from 0.82 .. 1.28 depending on b; 0.5 log(14.13/2 pi) = 0.405: no failure below it | m_LP < lambda_min < 0 (q = 2); q = 1000003: positive for every 2a <= log q (PROVED relative to zeta >= 0 there) | m_LP = -0.187 against lambda_min = -0.178 (Liouville, 1.2) | m_LP = -0.833 against -0.736 (1.3; cosine atoms only) | not formulable from coefficients | closed: m(2a) <= lambda_min(2a) (PROVED), equality ARGUED and supported by the LP; the test is combination 2 |
| 2 | q65-coercivity + kato-temple-coupling-sqrt3-over-2 + krein-uniform-n-lower-bound-open + krein-csharp-floor + krein-csharp-lower-bracket | c(L) = lambda_min of Q_L, L = a; log c against L | zeta: L = 1.2, 1.25 at 160, 320, 640 modes per sector (448 bits); L = 1.5, 1.7, 1.9 at 1000, 800, 1000 modes (700 to 1150 bits). chi_-4, chi_5, DH: 23 supports 2a = 2.6 .. 4.0 at 600 modes (512 bits), DH bracket repeated at 1200 modes. Upper bracket only; the Lehmann-Goerisch lower bracket was not produced | Q_{6/5}: 6.77e-49 (640 modes; recorded certificate 1e-55). L = 5/4: 4.68e-55, positive (the recorded failure at 5/4 was a failed comparison, as the source says). Pole-free: 8.18e-42, 6.58e-89, 2.96e-141, 3.58e-220 at 2a = 2.4, 3.0, 3.4, 3.8; slope of log10 c in e^{2a}: -5.14, -5.22, -5.30, -5.36 on successive intervals | chi_-4: 8.3e-15 (2.6) to 7.0e-70 (4.0), slope -1.327; chi_5: 7.0e-13 to 2.6e-57, slope -1.080; slope x conductor = -5.31, -5.40 | slope -1.054 (x 5 = -5.27) on 2.6 .. 3.4, within a factor 85 of chi_5 throughout; +2.0e-31 at 3.42, -7.3e-30 at 3.43 (1200 modes), -0.766 at 4.0. Its prime-power-restricted form is negative earlier (from 1.85 .. 1.90), not later | b = 0.4, 0.25, 0.1, 0.01, 0.001: last positive / first negative support 0.80/0.82, 0.86/0.88, 0.94/0.96, 1.12/1.14, 1.26/1.28 | see 4 | negative from 1.05 .. 1.10 (lane s4; reproduced at 1.2: -0.178) | same | not formulable | closed: the constant is the zero-counting law (slope x conductor = -5.3 for zeta, two characters and DH alike); DH is positive wherever chi_5 is, until its zero at 85.70 is resolved (T* = 2 pi e e^{2a}/5 = 105 at the onset) |
| 3 | pw-polefree-de-branges-isometry + ri-bathtub-floor + ri-rkhs-floor-linear-in-a + ri-well-capture-tradeoff + ri-w1-no-pointwise-margin + ri-sigma2-symbol | full-prime symbol w_F: bathtub floor, negative-to-positive mass ratio, Ritz value on the frame space | 9 objects x 10 supports 2a = 2 .. log 1e5 = 11.513; symbol on [0, min(5e4, T*)] with step <= 0.02 (up to 2.5e6 points, up to 1e5 coefficients); Ritz in float64 on GPU 1, space dimension 8193 (2a < 6) and 16385 (2a >= 6); dimension 32769 for four objects at log 1e5 (section 7) | Ritz value within float noise of 0 at every support (-1.5e-14 .. -3.0e-11); mass ratio 0.071 .. 0.097 for 2a <= 8 (0.123, 0.148 at 10, 11.5 on the truncated window); L^2 floor -5.7 (2a = 2) to -854 (11.5); sigma_2 floor -1.9e8 to -1.1e20, set by the window edge | chi_-4, chi_5: within noise of 0 at every support; mass ratio 0.024 .. 0.121 | negative from 3.43 (balls), -0.77, -2.4, -5.3, -21, -54, -108 at 2a = 4, 5, 6, 8, 10, 11.5; mass ratio 0.076 at the onset, inside zeta's range | b = 0.1: negative at every support of the table (-0.022 at 2.0 to -7.9 at 11.5); mass ratio 0.077 .. 0.100 for 2a <= 5 | q = 2, c = 2.2: -0.58 to -1412; mass ratio 0.20 .. 0.98, outside zeta's range | Liouville: -1.3 to -12.5; random signs: -1.4 to -15.5; mass ratio 0.071 .. 0.106 for 2a <= 8, equal to zeta's to within 8 per cent | -1.5 to -16.5; mass ratio as zeta's | not formulable | closed: the mass ratio and the floors depend on the sizes of the coefficients only (sign and unimodular twists have zeta's values and are negative by O(1)); the floor/Ritz ratio is not a finite number for the full-prime symbol; the sign of the Ritz value is rows 1, 2 |
| 4 | mem-detector-uncertainty + exact-witness-quadratic-cosine + lean-weil-small-support + weil-small-support-lean + flow-criticality-kappa | smallest support 2a* at which the form of zeta + planted quadruple (1/2 +- b +- i gamma) is negative, minimised over the frame span; c = 2a*/log(gamma/2 pi) | gamma = 1e2, 1e3, 1e4, 1e5, 1e6, 1e9, 1e12; b = 0.5, 0.4, 0.3, 0.2, 0.1, 0.01; 12 positions of the quadruple per case; supports 0.4 .. 16.5 in steps of 0.05 (prime powers up to 1.47e7), 1721 eigenproblem batches; band half-width 40 around gamma (whole low band for gamma = 100), repeated at half-width 80 | band minimum of zeta alone: never below -5.8e-12; positive (0.08 .. 0.32) at 2a = log(gamma/2 pi) and within noise of 0 from about 1.1 to 1.25 log(gamma/2 pi) | not run for planted quadruples (the form of L(chi) differs from zeta's by the conductor shift of log gamma only) | own form: 2a* in (3.42, 3.43], c = 0.81 with log(5 x 85.70/2 pi) = 4.22; the quadruple at 85.70 carries the negative value (-0.81 of -0.27 at 3.8, the rest of the form +0.54) | b = 0.4 .. 0.001: 2a* = 0.81 .. 1.27, c = 1.00 .. 1.57 against log(14.13/2 pi) | q = 1000003: 2a* in (log q, log q + 0.05] for c = 2.2, lambda_min -> (2 - c) log q = -2.76; c = 2.01: +0.0008 at log q + 0.40, tending to -0.138; c = 1.0 (zeros on the line): positive | no functional equation: negative from 1.05 .. 1.10 (lane s4) | same | represented by the small-displacement quadruple b = 0.01: c = 1.05 .. 1.17 | closed: 2a* = min(solution of sinh(2ab)/b - 2a = log(gamma/2 pi), about 1.05 to 1.17 log(gamma/2 pi)); c < 0.45 occurs (0.27 .. 0.41 for b >= 0.3 at gamma = 1e9, 1e12) and is the crossover formula of lane b-toeplitz-beyond, measured here on the real zeros; the witness is localised at frequency gamma in every case |

## 0. Conventions, objects, and how each object enters

Weil form (convention of lanes s2, s4; CLASSICAL): for g in L^2(-a, a), h(u) = int g(x) conj g(x - u) dx,

    W_F(g) = int_{-2a}^{2a} K_F(u) h(u) du,
    K_F = K_arch + 2 log Q delta_0 + sum over poles 2 cosh(p u) - sum_n c(n) n^(-1/2) (delta_{log n} + conjugate at -log n),

with c the coefficients of -F'/F, completed function Q^s prod_j pi^(-s/2) Gamma((s + kappa_j)/2) F(s), poles of F at 1/2 +- p. lambda_min(F, 2a) = inf W_F(g)/norm(g)^2. "Pole-free" = restriction to ghat(+-ip) = 0 with the pole term dropped (the form T_a[sigma_2] of the Route I nodes up to the normalisation of the basis; signs agree). L of combination 2 is a (Q_{6/5} uses the prime powers 2, 3, 4, 5, 7, 8, 9, 11, i.e. 2a = 2.4).

| code | object | form | enters through |
|---|---|---|---|
| ZETA | zeta | own; with pole, or pole-free | - |
| CHI-4, CHI5 | L(s, chi_-4), L(s, chi_5) | own gamma factor and conductor | positive comparison |
| DH | Davenport-Heilbronn, coefficients (1, kappa, -kappa, -1, 0) mod 5 | own (odd gamma factor, conductor 5) | its zeros: the quadruple at 0.8085 + 85.6993 i (section 3.3) |
| EA b | zeta(s + b) zeta(s - b) | own (two gamma factors, poles at 1/2 +- (1/2 +- b)) | its zeros (all displaced by b; lowest at height 14.13) |
| TNR:q:c | zeta(s)(1 + c q^(1/2 - s) + q^(1 - 2s)); off-line zeros for abs(c) > 2 at heights (2k+1) pi/log q, displacement arccosh(c/2)/log q | own (2 log Q = 2 log q, pole) | its coefficient at n = q, not its zeros (section 5.3) |
| LIOU, SGNR | c(p^k) = (-1)^k log p; c(p^k) = eps_p^k log p with random signs (seed 120000) | zeta's gamma factor, pole-free | not through zeros: no functional equation, the gamma factor does not match |
| UNI | c(p^k) = e^{ik theta_p} log p, random phases (seed 120000) | zeta's gamma factor, pole-free | same |
| planted | zeta with an added quadruple 1/2 +- b +- i gamma0: K = K_zeta + 4 cosh(bu) cos(gamma0 u) | zeta's | its zeros, by construction |
| heat tau < 0 | backward heat deformation | not formulable: no coefficient vector; the form exists only as a sum over a zero table | represented by the planted quadruple with small b (its off-line zeros are close pairs moved off the line by a small displacement) |

## 1. Shared code and validation

Method (new in this lane; PROVED by direct computation of H_kl below). In the frame e_nu(x) = e^{i nu x} on [-a, a], h(u) = sum c_k conj(c_l) H_kl(u) with H_kl(u) = (e^{ida} e^{i nu_l u} - e^{-ida} e^{i nu_k u})/(i d), d = nu_k - nu_l, symmetric in (k, l). Hence with the one-sided symbols

    A(nu) = int_0^{2a} K(u) e^{i nu u} du,   B(nu) = int_0^{2a} K(u) (2a - u) e^{i nu u} du,

the form matrix is M_lk = 2 Re[(e^{ida} A(nu_l) - e^{-ida} A(nu_k))/(i d)], M_kk = 2 Re B(nu_k), Gram_lk = 2 sin(da)/d: a Loewner matrix of the symbol, real symmetric for every object. A and B are closed forms: for a gamma factor with z = 1/4 + kappa/2, A = (psi(z - i nu/2) - log pi)/2 + sum_j e^{-2a s_j}/s_j, s_j = 2z + 2j - i nu, and B = a(psi - log pi) + psi'(z - i nu/2)/4 - sum_j e^{-2a s_j}/s_j^2; exponentials for poles and planted zeros; A = -sum c(n) n^{-1/2 + i nu} for the coefficients. One object and one support cost one Dirichlet polynomial per frame element; no quadrature. The space is the whole of L^2(-a, a) in the limit of the frame (lattice nu_k = pi k/(a os), os = 2 with Gram whitening in float64, os = 1 orthogonal lattice in balls, where e^{ida} = +-1 and the matrix needs only Im A and Re B).

Files: `symlib.py` (float64, numpy/cupy), `arbsym.py` (python-flint balls, parity sectors, lowest eigenvalue by inverse subspace iteration of `wlib.eigmin_subspace`), `wlib.py` (copy of the Legendre-Galerkin library of lanes s2/s4: coefficient tables, ball eigen-solvers, cross-check assembly), `detect.py`, `symstats.py`, `lp_dual.py`.

| check | known value | this lane |
|---|---|---|
| explicit formula: prime side of the frame code against the sum over zeros, g = e^{i g0 x} cos^2(pi x/2a), (g0, 2a) = (20, 2), (20, 4), (30, 6) with 300 zeros; (1000, 2), (1000.3, 4), (1000, 6) with the 351 zeros in 785.7 .. 1219.6 (`validate_zero_side.py`) | equal | 0.8876858224, 2.2810599692, 7.2625492197, 3.8813716320, 7.1889317560 (zero side ...7559), 10.8684777734: agreement to 10 digits |
| DH coefficients c(2), c(3), c(4), c(6), c(7) (route 30; lane s4) | 0.19690858829, -0.31209, -1.44223196461, 1.93635607662, 0.5528 | 0.196908588294, -0.312092728516, -1.442231964606, 1.936356076621, 0.552792294543 |
| lambda_min against the Legendre-Galerkin ball values of lane s4 (N = 200): DH at 1.0, ln 3, 2.0, 2.6; chi_5 at 1.0, 2.0; chi_-3 at 1.5; zeta pole-free at 1.0, 1.2; zeta with pole at 1.0; Liouville pole-free at 1.2, 2.0; T-NR(2, 2.2) at 1.0; T-NR(3, 1.0) at 2.3 (`validate.py`, float64, band 240, os = 2) | 0.299, 0.20871, 3.43e-5, 2.33e-11; 0.0901, 2.01e-6; 4.08e-5; 0.0119, 6.61e-5; 9.34e-7; -0.178, -1.33; -0.105; 0.131 | 0.29917, 0.20872, 3.434e-5, 2.319e-11; 0.09013, 2.014e-6; 4.079e-5; 0.011867, 6.623e-5; 9.340e-7; -0.17829, -1.32857; -0.10532; 0.13064 |
| same in balls, orthogonal lattice, 150 modes per sector, 448 bits (`arb_val.jsonl`): zeta with pole at 2.6; zeta pole-free at 2.6 | 9.34e-62; 3.14e-54 (N = 200), 2.32e-54 (N = 400) | 8.89e-62; 2.93e-54 |
| independent Legendre assembly from `wlib.py` (N = 48) against the frame, T-NR(2, 2.2) at 1.9, 2.0, 2.1 (`chk_tnr.py`) | - | -0.57295 / -0.57312, -0.57943 / -0.57950, -0.58141 / -0.58145 |
| server GPU run (4096 modes per sector) against local CPU run (600 modes) of `symstats.py`, DH at 2.0 and 3.6; ball value at 3.6 (600 modes) | same up to the band | 3.4286e-5 / 3.4310e-5; -2.7103e-7 / -2.6844e-7; balls -2.7053e-7 |

One discrepancy with lane s4 is recorded: its table gives lambda_min(T-NR(2, 2.2), 2a = 2.0) = -0.533; the frame code and the independent Legendre assembly both give -0.5328 in the even sector and -0.5795 in the odd sector, so the minimum over the two sectors is -0.5795. Nothing in either lane depends on it.

## 2. Combination 1: dual certificate for the full form

Finite consequence tested. phi even, phi = alpha cosh(u/2) + beta u sinh(u/2) on abs(u) < 2a (alpha = 2, beta = 0 fixed for the form with pole; both free for the pole-free form), free outside; w(t) + phihat(t) >= m for all t, where w = Fourier transform of K_F cut at abs(u) = 2a (the full-prime symbol with every prime power below e^{2a}). Statistic: the optimal m(2a). Survival would need m > 0 for zeta and L(chi) at every support and m <= 0 for the controls below the stated thresholds.

**Lemma D (weak duality, PROVED).** If w + phihat >= m with phi as above then W_F(g) >= m norm(g)^2 for every g in L^2(-a, a) (pole-free g in the pole-free case). Proof: int phi h = 0 for every autocorrelation h supported in [-2a, 2a] (for the pole-free class, int h(u) e^{+-u/2} du = ghat(+-i/2) conj(ghat(-+i/2)) = 0 and int h(u) u e^{+-u/2} du is the derivative of a product of two vanishing factors), so W_F(g) = (1/2 pi) int (w + phihat) abs(ghat)^2 >= m norm(g)^2. Hence **m(2a) <= lambda_min(F, 2a)** for every object and support.

**Equality (ARGUED, not proved here).** The dual of the programme is min int w dmu over positive measures mu of mass 1 whose inverse transform is supported in [-2a, 2a]; such a measure is a non-negative integrable function of exponential type 2a, hence abs(ghat)^2/(2 pi) with g in L^2(-a, a) (Akhiezer-Krein factorisation), so the dual value is lambda_min. Absence of a duality gap for the class of distributions involved was not checked.

**LP check (MEASURED; `lp_dual.py`, `lp_dual.log`).** Atoms 2 cos(x t), x in [2a, 2a + span] step 0.05; constraints on t in [0, T] step 0.05; (T, span) = (120, 6), (240, 12), (480, 24); HiGHS, float64.

| object, form | 2a | m_LP at (120, 6) | (240, 12) | (480, 24) | lambda_min | m_LP/lambda_min at the largest size |
|---|---|---|---|---|---|---|
| DH, own | ln 3 | 0.19140 | 0.19937 | 0.20087 | 0.20872 | 0.962 |
| DH, own | 1.6 | -0.00253 | 0.00278 | 0.00485 | 0.00659 | 0.736 |
| chi_5 | 1.0 | 0.08126 | 0.08501 | 0.08628 | 0.09013 | 0.957 |
| chi_-4 | 1.0 | 0.12711 | 0.13281 | 0.13471 | 0.14005 | 0.962 |
| zeta, pole-free | 0.8 | 0.19127 | 0.19809 | 0.20048 | 0.22525 | 0.890 |
| zeta, pole-free | 1.0 | 0.00378 | 0.00679 | 0.00783 | 0.01187 | 0.660 |
| Liouville, pole-free | 1.2 | -0.20274 | -0.19109 | -0.18695 | -0.17829 | below |
| zeta(s + 1/4) zeta(s - 1/4) | 1.5 | -0.13975 | -0.08080 | -0.05784 | -0.04065 | below |
| unimodular (cosine atoms only) | 1.3 | -0.85734 | -0.83941 | -0.83313 | -0.73642 | below |
| T-NR(2, 2.2), with pole | 1.0 | -0.23694 | -0.25146 | -0.45023 | -0.10532 | below, not converging |
| T-NR(2, 2.2), with pole | 1.5 | -0.76621 | -1.04769 | -1.06892 | -0.22759 | below, not converging |

In every case m_LP < lambda_min; where the form is positive m_LP rises towards lambda_min as atoms are added (66 to 96 per cent reached). The l1 norm of the certificate grows linearly with the span (15, 29, 44 for DH at ln 3). The programmes are grid relaxations: at the largest size the certificate dips below m between grid points (fine-grid minimum 0.070 against m = 0.201 for DH at ln 3), so the numbers are LP values and not verified certificates.

Consequence. The margin of the dual certificate is the coercivity constant of combination 2 seen from below. The table asked for (m(2a) from 0.5 to log 1e6) is bounded by the table of lambda_min: m(2a) <= 6.6e-89 at 2a = 3.0 and <= 3.6e-220 at 3.8 for zeta, and by the measured law (section 3) m(log 1e6) is below 10^(-5e6). No LP or interval check exists at that scale in any arithmetic; the LP was not run beyond 2a = 1.6. Pass/fail in the terms of the task: zeta and L(chi) have positive Ritz values at every support reached in balls (2a <= 3.8 and 4.0); DH is not negative below 0.8 x 3.43 = 2.74 (its first negative support is 3.43); E_b is not negative below 0.405; T-NR(q) is not negative below log q. No control fails early.

Classification: closed (the combination is a restatement of the coercivity constant; obstruction row P19).

## 3. Combination 2: the coercivity constant c(L)

Finite consequence tested. c(L) = lambda_min of Q_L, L = a; reproduce Q_{6/5} and the L = 5/4 comparison; statistic log c against L; fail = c < 0 for a control where zeta, L(chi) and the control's prime-power-restricted form are positive, below the full-form onset.

### 3.1 Premise on zeta (MEASURED, balls)

| 2a (L) | form | modes per sector | bits | Ritz value (even sector; the odd sector is higher) |
|---|---|---|---|---|
| 2.4 (6/5) | with pole | 160 / 320 / 640 | 448 | 7.82e-49 / 7.06e-49 / 6.77e-49 |
| 2.4 (6/5) | pole-free | 160 / 320 / 640 | 448 | 9.35e-42 / 8.61e-42 / 8.18e-42 |
| 2.5 (5/4) | with pole | 160 / 320 / 640 | 448 | 5.27e-55 / 4.80e-55 / 4.68e-55 |
| 2.5 (5/4) | pole-free | 160 / 320 / 640 | 448 | 1.12e-47 / 9.98e-48 / 9.65e-48 |
| 3.0 (1.5) | pole-free | 500 / 1000 | 700 | 7.03e-89 / 6.58e-89 |
| 3.4 (1.7) | pole-free | 800 | 1000 | 2.96e-141 |
| 3.8 (1.9) | pole-free | 1000 | 1150 | 3.58e-220 |

- The recorded certificate Q_{6/5} >= 1e-55 is consistent with the Ritz value 6.8e-49 (the certificate is 6.8e6 times below the value). At L = 5/4 the Ritz value is positive (4.7e-55): the recorded failure there is a failure of the sufficient comparison, as the atlas says, not a negative vector. The 1.1 GB certificate bundle is not available and was not rebuilt.
- log10 c against e^{2a}: slopes -5.14 (2.4 to 2.6, with the N = 400 value 2.32e-54 of lane s4 at 2.6), -5.22 (2.6 to 3.0), -5.30 (3.0 to 3.4), -5.36 (3.4 to 3.8); linear fit on 2.4 .. 3.8: log10 c = -5.30 e^{2a} + 17.8. The slope steepens slowly; lane s4 measured -4.49 on 1.0 .. 2.0 and the source chord is -4.82.
- Not reached: L from 2 to 3 (2a = 4 .. 6). At 2a = 6 the law gives c of order 10^(-2100): 7000 bits and a space that resolves the zeros below T* = 2 pi e e^6 = 6900, i.e. about 13000 modes per sector; one sector matrix alone is over 150 GB. The largest zeta run made (3.8, 1000 modes, 1150 bits) took 20 minutes of one core.
- Lehmann-Goerisch lower bracket: not produced. All values are upper brackets. A lower bracket needs a bound on the complement of the Ritz space, which is the open lemma `krein-uniform-n-lower-bound-open`; nothing here changes its status.

### 3.2 Comparison L-functions and DH (MEASURED, balls, 600 modes per sector, 512 bits, server)

| 2a | chi_-4 | chi_5 | DH |
|---|---|---|---|
| 2.6 | 8.32e-15 | 6.96e-13 | 2.31e-11 |
| 2.8 | 1.04e-18 | 4.72e-16 | 1.31e-14 |
| 3.0 | 1.54e-23 | 6.13e-20 | 2.76e-18 |
| 3.2 | 2.00e-29 | 1.00e-24 | 4.19e-23 |
| 3.4 | 1.10e-36 | 1.05e-30 | 8.81e-29 |
| 3.41 | 4.47e-37 | 5.28e-31 | 2.91e-29 |
| 3.42 | 1.68e-37 | 2.66e-31 | 5.82e-31 (1200 modes: 2.02e-31) |
| 3.43 | 6.64e-38 | 1.40e-31 | -7.17e-30 (1200 modes: -7.26e-30) |
| 3.45 | 9.18e-39 | 3.10e-32 | -1.40e-26 |
| 3.5 | 6.54e-41 | 4.36e-34 | -7.72e-21 |
| 3.6 | 1.47e-45 | 6.89e-38 | -2.71e-7 |
| 3.8 | 1.51e-56 | 1.60e-46 | -0.273 |
| 4.0 | 6.95e-70 | 2.63e-57 | -0.766 |

(All 23 supports: `tables_all.md`.) Fits of log10 c in e^{2a} on 2.6 .. 3.4: chi_-4: -1.327 e^{2a} + 3.84; chi_5: -1.080 e^{2a} + 2.46; DH: -1.054 e^{2a} + 3.51. Slope times conductor: -5.31, -5.40, -5.27, against -5.2 .. -5.3 for zeta on the same range.

- **DH onset: (3.42, 3.43]**, stable from 600 to 1200 modes. This is the full-form onset 3.43 of rounds 2-4, now from ball arithmetic with values of size 1e-30 resolved; the float64 screens could not exclude an earlier sign change hidden below 1e-11, and there is none: DH is positive at every support from 2.6 to 3.42 and tracks chi_5 within a factor 85.
- T* = 2 pi e e^{2a}/5 = 105 at the onset; the off-line quadruple is at height 85.70.

### 3.3 The negative value of DH is carried by the quadruple at 85.70 (MEASURED, float64, `dh_witness.py`)

W_DH(g) is the sum over zeros; the contribution of the quadruple (1/2 +- 0.3085 +- 85.6993 i) to the ground vector is c^T M_quad c with the planted-zero symbol.

| 2a | lambda_min | contribution of the quadruple at 85.70 | at 114.16 | all other zeros | share of abs(ghat)^2 in 75 < t < 96 |
|---|---|---|---|---|---|
| 3.6 | -2.70e-7 | -5.71e-6 | -3.0e-9 | +5.45e-6 | 0.000 (the mass sits below t = 40) |
| 3.8 | -0.271 | -0.806 | -0.0044 | +0.539 | 0.909 |
| 4.0 | -0.766 | -0.943 | -0.0030 | +0.180 | 0.888 |
| 4.5 | -1.338 | -1.399 | -0.0005 | +0.062 | 0.973 |

Just past the onset the test function has its L^2 mass at low frequency and reaches the quadruple through the factor cosh(2ab); from 3.8 on it is concentrated at 85.70. In both regimes the negative part is that one quadruple and everything else is positive. DH enters through its zeros.

### 3.4 Prime-power-restricted DH form (MEASURED, float64, `dhpp.py`)

DH with the coefficients at composite indices that are not prime powers removed: +5.7e-4 at 1.85, -0.031 at 1.90, -0.125 at 2.0, -0.57 at 3.0 (lane s4: 1.87 .. 1.90). It is negative from ln 6 + 0.06 on, 1.5 units of support before the full form. The criterion of the task (control negative where its prime-power-restricted form is positive) therefore has the two forms in the wrong order: the full DH form is positive on (1.90, 3.42] where the restricted one is negative. The restricted form is negative because c(6) = 1.936 is non-zero (lane s4, combination 1), a coefficient statement.

### 3.5 E_b = zeta(s + b) zeta(s - b) (MEASURED, balls, 300 modes, 448 bits, `arb_ea_K300.jsonl`)

| b | last positive 2a | first negative 2a | value at the first negative support | T* = 2 pi e e^{2a} there |
|---|---|---|---|---|
| 0.4 | 0.80 | 0.82 | -1.3e-5 | 38.8 |
| 0.25 | 0.86 | 0.88 | -1.1e-5 | 41.2 |
| 0.1 | 0.94 | 0.96 | -1.4e-6 | 44.6 |
| 0.01 | 1.12 | 1.14 | -8.5e-9 | 53.4 |
| 0.001 | 1.26 | 1.28 | -6.1e-11 | 61.4 |

The onset moves by 0.14 to 0.18 per decade of b. ARGUED: W_{E_b}(g) = sum_gamma 2 Re hhat(gamma + ib) = 2 sum abs(ghat(gamma))^2 - b^2 sum (abs(ghat)^2)''(gamma) + O(b^4), so the form turns negative when lambda_min of zeta's form falls below a constant times b^2; with log10 lambda_min = -4.5 e^{2a} + 10.8 (lane s4, range 1.0 .. 2.0) this gives 2a*(b) = log((10.8 + 2 log10(1/b))/4.5) = 0.97, 1.05, 1.19, 1.32 for b = 0.25, 0.1, 0.01, 0.001, within 0.11 of the measured values. The onsets are above 0.5 log(14.13/2 pi) = 0.405 and at each of them T* exceeds the height 14.13 of the lowest (displaced) zero by a factor 2.7 to 4.3. E_b is not negative early. E_b has an Euler product and the functional equation s -> 1 - s; it enters through its zeros.

Classification: closed. The statistic log c(L) is the zero-counting law of the object (slope times conductor = -5.3 for zeta, chi_-4, chi_5 and DH); DH has no sign change below the resolution of its first off-line zero; the stated fail criterion is not met and its ordering premise is false (3.4).

## 4. Combination 3: symbol statistics against the Ritz value

Finite consequence tested. w_F(t) = arch(t) + 2 log Q - 2 Re sum_{n < e^{2a}} c(n) n^{-1/2 + it} (full-prime symbol, pole term excluded); bathtub floor = (a/pi) int of w_F over its deepest sub-level set of measure pi/a (L^2 normalisation; valid lower bound for the pole-free form because abs(ghat)^2/2 pi <= a/pi for norm(g) = 1); the same with sigma_2 = (t^2 + 1/4)^2 w_F; negative-to-positive mass ratio on [0, T], T = min(5e4, T*), T* = 2 pi e e^{2a}/q; Ritz value on the frame space. Fail = sign change of the Ritz value of a control at a support where its mass ratio is inside zeta's range.

MEASURED (server, GPU 1, float64, `symstats_gpu.jsonl`; all tables in `tables_all.md`):

| 2a | space dimension | ZETA | CHI-4 | CHI5 | DH | EA 0.1 | TNR:2:2.2 | LIOU | SGNR | UNI |
|---|---|---|---|---|---|---|---|---|---|---|
| lambda_min, 2.0 | 8193 | -1.5e-14 | 6.06e-7 | 2.01e-6 | 3.43e-5 | -0.0224 | -0.580 | -1.33 | -1.42 | -1.50 |
| 3.4 | 8193 | -2.2e-14 | -3.4e-15 | -2.6e-15 | -2.8e-15 | -0.173 | -3.40 | -3.02 | -2.52 | -3.99 |
| 4.0 | 8193 | -5.3e-14 | -7.5e-15 | -5.8e-15 | -0.767 | -0.277 | -6.60 | -3.89 | -2.65 | -4.99 |
| 6.0 | 16385 | -1.3e-12 | -3.3e-13 | -3.8e-13 | -5.27 | -1.08 | -34.7 | -6.18 | -5.93 | -7.26 |
| 8.0 | 16385 | -1.6e-11 | -6.4e-12 | -3.1e-12 | -21.2 | -2.90 | -146 | -8.24 | -9.17 | -9.01 |
| 11.513 | 16385 | -3.0e-11 | -2.7e-11 | -3.2e-11 | -108 | -7.88 | -1412 | -12.5 | -15.5 | -16.5 |
| mass ratio, 2.0 | | 0.0973 | 0.0303 | 0.0237 | 0.0226 | 0.0996 | 0.198 | 0.1002 | 0.1055 | 0.1023 |
| 3.4 | | 0.0738 | 0.0635 | 0.0608 | 0.0758 | 0.0796 | 0.335 | 0.0759 | 0.0784 | 0.0774 |
| 4.0 | | 0.0735 | 0.0671 | 0.0657 | 0.0827 | 0.0819 | 0.439 | 0.0743 | 0.0758 | 0.0759 |
| 6.0 | | 0.0746 | 0.0731 | 0.0722 | 0.1087 | 0.0951 | 0.710 | 0.0716 | 0.0740 | 0.0741 |
| 8.0 | | 0.0767 | 0.0757 | 0.0750 | 0.1384 | 0.1154 | 0.886 | 0.0712 | 0.0752 | 0.0753 |
| 11.513 (window 5e4 < T*) | | 0.1484 | 0.1212 | 0.1167 | 0.2832 | 0.2602 | 0.985 | 0.1715 | 0.1706 | 0.1708 |
| L^2 floor, 2.0 / 4.0 / 8.0 / 11.513 | | -5.7 / -16.6 / -134 / -854 | -1.5 / -4.8 / -14.6 / -20.3 | -1.2 / -5.1 / -13.5 / -20.2 | -1.3 / -8.3 / -73 / -520 | -11.6 / -34.5 / -331 / -2679 | -5.5 / -26.5 / -425 / -4225 | -3.6 / -11.2 / -120 / -810 | -3.4 / -9.6 / -30 / -44 | -4.7 / -10.1 / -27 / -45 |
| sigma_2 floor, 2.0 / 4.0 / 8.0 | | -1.9e8 / -2.6e12 / -7.7e19 | -4.1e5 / -7.0e9 / -2.9e17 | -1.1e5 / -2.8e9 / -1.2e17 | -2.1e3 / -4.6e9 / -5.1e17 | -3.9e8 / -5.8e12 / -2.1e20 | -4.4e6 / -4.7e10 / -1.1e19 | -1.4e8 / -3.2e12 / -1.1e20 | -3.5e8 / -4.4e12 / -1.1e20 | -2.8e8 / -3.5e12 / -1.2e20 |

1. Premise on zeta: the float64 Ritz value is within noise of zero at every support (the true value is 10^(-5.3 e^{2a}); balls reach 2a = 3.8, section 3.1). The L^2 floor of zeta is the well at t = 0 (w_F(0) is about -4 e^a), which the pole-free constraint removes; it grows like e^a. The sigma_2 floor is taken at the edge of the window in every row (the minimum of sigma_2 sits at t = 109 of 126, 875 of 933, 49377 of 50000): with every prime power below e^{2a} in the symbol, w_F stays sign-indefinite up to heights of order e^{4 e^a}, the weight (t^2 + 1/4)^2 puts the deepest set at the largest such t, and the floor has no finite value. The source ratio (about 12 at p = 2, where the symbol is negative on one bounded interval) has no analogue for the full-prime symbol: the ratio floor/Ritz is a window-dependent number divided by 10^(-5.3 e^{2a}).
2. The mass ratio is a statistic of the sizes abs(c(n)): Liouville, random signs and random phases have zeta's mass ratio to within 8 per cent at every support up to 8 (0.0707 .. 0.1055 against 0.0707 .. 0.0973) and are negative by -1.3 to -16.5. The comparison L-functions are lower at small support (0.024 .. 0.030 at 2.0) and converge to zeta's value. DH: 0.0758 at 3.4 and 0.0713 at 3.6, inside zeta's range at its onset.
3. So the fail criterion as written is met by DH, by E_b, by the sign twists and by the unimodular twist, and it is met trivially: the mass ratio does not constrain the sign of the form (zeta at ratio 0.074 is non-negative, the Liouville object at ratio 0.074 has -3.9). It carries no information beyond rows 1 and 2, where the control onsets are the resolution of zeros (DH, E_b) or the gamma-factor mismatch (twists). T-NR(2, 2.2) has a different mass ratio (0.2 .. 0.98) because its coefficient at 2^k has size 2.2 x 2^(k/2) log 2.
4. Spectral centroid of the ground vector: DH 0.8, 1.0, 6.1 at 2a = 2, 3, 3.4 (positive branch), then 85.2 at 4.0 (the quadruple at 85.70), 241 at 5 and 6, 2442 at 8 .. 11.5 (higher off-line zeros take over as the support grows; not identified individually).
5. Space dimension: 16385 at 2a >= 6. The 32769-dimensional run (sector size 16385) was started only after GPU 1 had 30 GB free and only for ZETA, CHI5, DH, LIOU at 2a = log 1e5; its result is in section 7: the same signs, DH unchanged to five digits.

Classification: closed. Arb on the ground vector: the negative values of the controls are confirmed in balls up to 2a = 4.0 for DH (section 3.2) and 1.4 for E_b; the values at 2a >= 5 are float64 values of size 0.6 to 1400 and were not recomputed in balls.

## 5. Combination 4: the detection law

Finite consequence tested. Plant the quadruple 1/2 +- b +- i gamma0 in zeta (kernel + 4 cosh(bu) cos(gamma0 u)); 2a* = smallest support with a negative value, minimised over the frame span; fit c = 2a*/log(gamma/2 pi). Source value c about 0.9. Fail in the sense of the definition needs c < 0.45, or a negative value whose witness has no mass at frequency gamma.

### 5.1 Planted quadruples (MEASURED, server, float64; `pair_full.json`, `tables_pair.md`)

Frame: nu_k = gamma + pi k/(2a), abs(nu_k - gamma) <= 40 (gamma >= 1e3; complex test functions with positive frequencies near gamma; W(g) = W(Re g) + W(Im g)), whole band abs(nu) <= gamma + 40 for gamma = 100. Phases gamma log n reduced in long double (64-bit mantissa) before the float64 sum. Twelve positions gamma0 = gamma + (j/6 - 1) x mean spacing. "Negative" = below -1e-7. Model = solution of sinh(2ab)/b - 2a = log(gamma/2 pi) (lane b-toeplitz-beyond, Theorem 1: extremal test against a uniform background of on-line zeros).

| gamma | L = log(gamma/2 pi) | b = 0.5: 2a* median (min .. max), c, model | b = 0.4 | b = 0.3 | b = 0.2 | b = 0.1 | b = 0.01 |
|---|---|---|---|---|---|---|---|
| 1e2 | 2.767 | 2.65 (2.55 .. 2.90), 0.96, 3.81 | 2.78, 1.00, 4.46 | 2.90, 1.05, 5.45 | 3.00, 1.08, 7.21 | 3.05, 1.10, 11.6 | 3.25 (3.20 .. 3.75), 1.17, 54.7 |
| 1e3 | 5.070 | 4.45 (4.10 .. 4.60), 0.88, 4.55 | 4.90, 0.97, 5.33 | 5.20, 1.03, 6.54 | 5.35, 1.06, 8.68 | 5.50, 1.09, 14.0 | 5.65 (5.35 .. 6.05), 1.11, 66.8 |
| 1e4 | 7.372 | 4.97 (4.35 .. 5.05), 0.68, 5.05 | 5.72, 0.78, 5.93 | 6.62, 0.90, 7.29 | 7.53, 1.02, 9.71 | 7.80, 1.06, 15.8 | 8.07 (7.90 .. 9.20), 1.10, 75.5 |
| 1e5 | 9.675 | 5.32 (5.10 .. 5.50), 0.55, 5.44 | 6.10, 0.63, 6.40 | 7.38, 0.76, 7.88 | 9.27, 0.96, 10.5 | 10.05, 1.04, 17.1 | 10.20 (10.20 .. 10.50), 1.05, 82.5 |
| 1e6 | 11.978 | 5.80 (5.70 .. 5.90), 0.48, 5.76 | 6.70, 0.56, 6.78 | 8.12, 0.68, 8.36 | 9.95, 0.83, 11.2 | 12.30, 1.03, 18.3 | 12.57 (12.50 .. 12.85), 1.05, 88.4 |
| 1e9 | 18.885 | 6.38 (6.15 .. 6.65), **0.34**, 6.47 | 7.35, **0.39**, 7.64 | 9.15, 0.49, 9.46 | 12.00, 0.64, 12.7 | 15.75 (5 of 12 positions; the others not below 16.5), 0.83, 20.9 | none up to 16.5 |
| 1e12 | 25.793 | 7.07 (6.95 .. 7.10), **0.27**, 6.98 | 8.47, **0.33**, 8.27 | 10.57, **0.41**, 10.25 | 13.88, 0.54, 13.8 | none up to 16.5 | none up to 16.5 |

- **Law.** 2a*(gamma, b) = min(X(b, L), c_0 L) with X the model solution and c_0 = 1.05 .. 1.17 (1.17 at gamma = 100, 1.05 at 1e5 and 1e6). In the first regime the measured median is 0.94 to 1.03 times the model for L >= 9.7 and b >= 0.3. In the second regime (small b) the support passes log(gamma/2 pi): there the test function can vanish on all on-line zeros near gamma and any displacement is detected. The single constant c about 0.9 of the source node is the crossing of the two regimes; c is not a constant.
- **c < 0.45 occurs**: 0.34, 0.39 (gamma = 1e9; b = 0.5, 0.4) and 0.27, 0.33, 0.41 (gamma = 1e12; b = 0.5, 0.4, 0.3), with prime powers up to e^{7.1} .. e^{10.6} only. It is the model value: X(b, L) is about (1/b) log(2bL) for large L, so c tends to 0 at fixed b.
- Zeta alone in the same bands: lambda_min = 0.32, 0.15, 0.082, 0.145 at 2a = L for gamma = 1e3 .. 1e6 and within noise of 0 (never below -5.8e-12) from about 1.1 L to 1.25 L; at gamma = 1e9 and 1e12 it is 0.77 and 5.07 at the top of the scan (2a = 16.5 < L).
- Witness. For gamma >= 1e3 the frame is the band of half-width 40 around gamma, so the witness is at frequency gamma by construction; within one mean spacing of gamma0 it carries 3 to 39 per cent of its mass in the model regime and less than 1 per cent in the small-b regime. Doubling the band to half-width 80 (gamma = 1e4, 1e6, 1e12; step 0.1; `pair_omega80.json`) moves no threshold by more than one grid step. For gamma = 100 (whole low band, `witness100.py`): at the onset the mass is split between the windows around +-gamma0 and frequencies below 60 (5 + 5 per cent and 41 per cent at b = 0.4, gamma0 = 100.0; 45 + 45 per cent at gamma0 = 101.1); no witness without mass at gamma was found among the cases inspected.
- Background dependence (`moved_pair.py`, MEASURED): a quadruple that replaces two neighbouring on-line zeros (zeros 999.79 and 1001.35 deleted, quadruple at their midpoint) is detected earlier than an added one: 2a* = 4.10, 4.40, 4.65, 4.95, 5.15 against 5.35, 5.40, 5.45, 5.50, 5.60 for b = 0.4, 0.3, 0.2, 0.1, 0.01 (c = 0.81 .. 1.02 against 1.06 .. 1.10); at 9999.46: 4.90, 5.25, 5.70, 6.55, 7.40 against 5.75, 7.45, 7.70, 7.80, 7.90. The DH value c = 3.425/4.22 = 0.81 (b = 0.3085) is of this kind and inside this range.

### 5.2 Why c < 0.45 is not a survivor

1. It is not "every control": the small-displacement quadruples (the model of the backward heat control) have c = 1.05 .. 1.17; DH has 0.81; E_b has 1.00 .. 1.57; T-NR is detected at log q.
2. It is a statement about heights. The form on support 2a is negative as soon as an off-line quadruple (gamma, b) with sinh(2ab)/b - 2a > log(gamma/2 pi) exists (measured above on the real zeros; the model version is PROVED in lane b-toeplitz-beyond). Read the other way: positivity of zeta's form on support 2a is a zero-free statement for displacement b up to height H(2a, b) = 2 pi exp(sinh(2ab)/b - 2a), and nothing more. For b = 1/2: H = 11.7 at 2a = 2.4 (the certified range of the sources), 97 at 2a = 3.8 (the largest zeta Ritz run here), 3e12 at 2a = 7.05.
3. The zeta side cannot be computed where the statement would be new. The margin is 10^(-5.3 e^{2a}) (section 3.1): 10^(-6100) at 2a = 7.05 with a space resolving the 22000 zeros below T* = 1.97e4, and with the 7/8 half-plane as input (b <= 3/8) the first support with new content is 8.77 (margin 10^(-34000), T* = 1.1e5). Positivity below those supports is implied by the verified height; this is obstruction row P19 and the crossover of lane b-toeplitz-beyond, whose numbers 7.051 and 8.767 are reproduced by the measured law (2a* = 7.07 at gamma = 1e12, b = 0.5; model 6.98).
4. The cheapness is in the support, not in the frequency: the witness is e^{i gamma0 x} times an envelope, and evaluating its prime side uses n^{i gamma0}; zeta "passing" for all gamma0 at once is the single support-2a positivity statement of point 3.

### 5.3 T-NR at large q (PROVED for 2a <= log q relative to zeta's form; MEASURED beyond)

**Lemma T.** For 2a <= log q, W_{T-NR(q,c)}(g) = W_zeta(g) + 2 log q norm(g)^2 for every g in L^2(-a, a) and every c. Proof: the coefficients of -F'/F agree with zeta's for n < q, h vanishes at log q, and the conductor term is 2 log Q = 2 log q. So T-NR(q, c) with abs(c) > 2, whose off-line zeros start at height pi/log q with displacement arccosh(c/2)/log q, has lambda_min = lambda_min(zeta) + 2 log q on every support up to log q.

MEASURED (`tnr_1000003.json`, q = 1000003, log q = 13.8155, band 40, prime powers up to 7.4e6, float64):

| 2a - log q | zeta (noise) | c = 2.2 | c = 2.01 | c = 1.0 |
|---|---|---|---|---|
| -0.40 .. 0.00 (9 supports) | -5e-12 .. -3e-10 | 27.63103 = 2 log q | 27.63103 | 27.63103 |
| +0.05 | -1e-12 | -0.089 | 2.391 | 15.514 |
| +0.10 | -9e-13 | -1.686 | 0.902 | 14.585 |
| +0.20 | -9e-13 | -2.155 | 0.450 | 14.245 |
| +0.40 | -3e-10 | -2.619 | 0.0008 | 13.916 |
| limit (q = 101 run: reached to 12 digits) | | (2 - c) log q = -2.763 | -0.138 | +13.816 |

ARGUED: for g = f(x + (log q)/2) + f(x - (log q)/2) with f supported in an interval of length s, W = 2 W_zeta(f) + (4 - 2c) log q norm(f)^2 + cross terms of zeta's kernel near log q (pole and prime terms, which cancel on average), so lambda_min tends to (2 - c) log q and the onset is log q + s(q, c) with lambda_min(zeta, s) = (c - 2) log q. The sign of the limit is the sign of 2 - abs(c), i.e. whether the local factor at q has its roots on the circle abs(alpha) = sqrt(q). T-NR enters through its coefficient at n = q: the test is blind to it below log q (13.8 here, whatever the zeros do) and sees it within 0.05 above. This is the T-NR invariance of the prefilter lanes; it is a failure "for a reason that does not depend on resolving zeros", and it is equally a statement that the statistic needs support log q to see a prime q, so zeta gains nothing from it.

Classification: closed.

## 6. Survivors

None. The four combinations are one statistic. On it: zeta and the two Dirichlet L-functions are positive at every support reached in balls and within float noise of zero beyond; DH first fails at (3.42, 3.43], when its off-line quadruple at 85.70 is resolved, and that quadruple carries the negative value; E_b and the planted quadruples follow the detection law of section 5.1, which is written in heights and displacements; T-NR fails at log q through one coefficient; sign and unimodular twists fail through the gamma factor. The event c < 0.45 exists for large displacement at large height and is the known crossover formula.

## 7. Sizes, machines, units

- Compute server, `rhrun` units only, never more than 8 cores and 12 GB requested in total at one time; GPU 1 only.
  - `rh-s5pair-1120074713` (6 cores, 6 GB): `detect.py pair`, 7 heights x 6 displacements x 12 positions, 1721 support batches, prime powers up to 1.47e7; 285 s.
  - `rh-s5arbA-1120074749` (2 cores), stopped by this lane after 6 results and restarted as `rh-s5arbA-1120075434` (6 cores, 6 GB): `arbsym.py`, DH, chi_5, chi_-4, 23 supports, 600 modes, 512 bits; 2930 s.
  - `rh-s5gpu-1120075733` (KMAX 16384), stopped by this lane after 30 s because GPU 1 had 17 GB free; `rh-s5gpu-1120075802` (2 cores, 10 GB, cupy pool limit 10 GB): `symstats.py`, 9 objects x 10 supports, space dimension 8193 / 16385; about 55 minutes.
  - `rh-s5pairB-1120084348` (5 cores): band half-width 80 check; 552 s. `rh-s5arbB-1120084348` (1 core): DH at 3.42, 3.43 with 1200 modes (also run locally, 428 s; the local values are the ones quoted).
  - `rh-s5gpuB-1120085431` (2 cores, 10 GB, pool limit 16 GB, started when GPU 1 had 30 GB free): space dimension 32769 at 2a = log 1e5 for ZETA, CHI5, DH, LIOU. Result (`symstats_gpu_K16384.jsonl`; 11 minutes): lambda_min = -6.7e-11 (ZETA, noise), -6.1e-11 (CHI5, noise), -107.90 (DH; -107.90 at dimension 16385), -13.14 (LIOU; -12.51 at dimension 16385). The symbol statistics of that file use a shorter window (T = 2000) and are not quoted.
- Local (Mac), every run through `scripts/memcap.sh 8`, single process unless noted: validation; the LP (8 minutes); zeta in balls at 2.4, 2.5 (160, 320, 640 modes), 3.0 (500 and 1000 modes; 45 s and 702 s), 3.4 (800 modes, 391 s), 3.8 (1000 modes, 1150 bits, 1186 s); E_b ladder (180 cases, 255 s); T-NR(1000003) (61 supports); DH witness, moved-pair and prime-power side checks. Three short validation runs (under 10 s each) used a pool of 4 to 6 processes.
- Under the load of the server (load average 50 to 95 on 48 cores) a ball run of the same size was 3 to 5 times slower per core than on the Mac, so the zeta ladder was run locally.
- Not run: zeta in balls beyond 2a = 3.8; the dual LP beyond 2a = 1.6; any interval-certified (radius-propagating) evaluation; Lehmann-Goerisch lower brackets; the heat control with its own zero table; planted quadruples in L(chi).
- Units at the end of the lane: all eight units of this lane inactive (`rh-s5pair-1120074713`, `rh-s5arbA-1120074749`, `rh-s5arbA-1120075434`, `rh-s5gpu-1120075733`, `rh-s5gpu-1120075802`, `rh-s5pairB-1120084348`, `rh-s5arbB-1120084348` (stopped by this lane after its first of two results, which equals the local value 2.0150e-31), `rh-s5gpuB-1120085431`), checked with `systemctl --user is-active`. Units named `rh-s5-...` belong to other lanes and were not touched. `~/rh-push/s5-route-i-dual-certificate-detection-law/` holds code and JSON outputs only (16 MB). No local process of this lane is running.

## 8. Three weakest steps

1. Equality m(2a) = lambda_min(2a) in section 2 is argued (factorisation of non-negative band-limited functions plus a separation argument) and supported by LP values that reach 66 to 96 per cent of lambda_min; only the inequality m <= lambda_min is proved. The LP values are grid relaxations in float64 and are not verified certificates. If the equality failed, combination 1 would have a smaller margin than combination 2, which does not help it.
2. All positive values are Ritz upper bounds with midpoint balls; no lower bracket was produced. The classifications use only negative values (which are values of the form on explicit vectors, up to the accuracy of the closed-form symbols evaluated at 448 to 1150 bits, radii not propagated) and the measured laws. The DH bracket (3.42, 3.43] rests on values of size 2e-31 and -7e-30 that are stable from 600 to 1200 modes; the lower end is an upper bound for the infimum, so the true onset could be earlier than 3.42 only if the frame space of 1200 modes per sector misses the minimiser.
3. Section 5.1 uses a frame restricted to a band of half-width 40 around gamma for gamma >= 1e3 (checked against half-width 80 at three heights) and float64 with a threshold of -1e-7; "detected" means a negative value in that band, which is a negative value of the form, while "not detected" is a statement about the band only. The law 2a* = min(X(b, L), c_0 L) is a description of 42 measured cells, not a theorem; the model X is proved in lane b-toeplitz-beyond for a uniform background only, and section 5.1 shows a spread of up to 1.0 in 2a* over the twelve positions.

## 9. Files

Code: `symlib.py`, `arbsym.py`, `wlib.py` (copy from lanes s2/s4), `detect.py`, `symstats.py`, `lp_dual.py`, `validate.py`, `validate_zero_side.py`, `chk_tnr.py`, `dhpp.py`, `dh_witness.py`, `witness100.py`, `moved_pair.py`, `ea_float.py`, `mk_tables.py`, `an_pair.py`.
Outputs: `pair_full.json`, `pair_omega80.json`, `pair_small.json`, `tables_pair.md`; `arb_ctrl_K600.jsonl`, `arb_ctrl_K1200_local.jsonl`, `arb_zeta_local.jsonl`, `arb_q65.jsonl`, `arb_ea_K300.jsonl`, `arb_val.jsonl`, `arb_dh_local.jsonl`; `symstats_gpu.jsonl`, `symstats_gpu_K16384.jsonl`, `symstats_local.jsonl`; `tnr_1000003.json`, `tnr_small.json`; `lp_dual.json`, `lp_dual.log`; `dh_witness.log`, `moved_pair.log`; `tables_all.md` (all ladders and symbol tables).
