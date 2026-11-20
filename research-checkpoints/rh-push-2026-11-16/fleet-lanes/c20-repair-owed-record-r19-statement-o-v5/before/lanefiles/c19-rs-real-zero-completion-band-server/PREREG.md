# PREREG: c19-rs-real-zero-completion-band-server (written before any run of this lane)

Date: 2026-11-19 (local). Sources read: BRIEF to the end; c18-tz-band-completion-controls-server (RESULT, REFEREE E1 to E6); c18-tz-one-sided-bound-fe-reserve-bridge (RESULT, FOR_NUMERICS_LANE); GATE.md of c18-referee-r17-independent-sources. Only a capability check of python-flint (unit rh-c19rs-cap-1120063512) was run before this file.

Reading rule (GATE): every form below is the form of N_all restricted to a named finite set of vectors (m consecutive Fourier modes of an interval). Only "N_all implies the sub-device" is available. A positive smallest eigenvalue is a statement about that m-dimensional space.

## 1. Object

Notation of the c18 lanes. I = [0, U]; v_x(s) = e^(isx); g(x) = int_I h(s) e^(-isx) ds; C_a the compression of the shift by a.
- Data form (Form D, band u = theta log T0): Q_D(u) = Arch + pole - 2 Re A_P, A_P = sum over n <= T0^theta of c(n) n^(-1/2) C_(log n), on L^2[0, u]. For zeta Q_D = T_Z on L^2[0, u] (explicit formula; CLASSICAL, checked by K2 of the c18 lane).
- Completion measure. Z_RS(x) = 2 Re[ e^(i vartheta(x)) sum_(n <= N) n^(-1/2 - ix) ], N = floor(sqrt(t_w/2 pi)) frozen at the window centre. G = set of real zeros (sign changes) of Z_RS in J = [t_w - 720, t_w + 720], located in float64. rho(x) = vartheta'(x)/pi (the Arch density); rho_J = the chord of rho on J (rho is concave, so rho - rho_J >= 0 on J).
      sigma = sum over g in G of delta_g + (rho - rho_J 1_J) dx.
  sigma is a positive measure for every choice of the point set G (no property of G is used for positivity). T_sigma(U) = int |v_x><v_x| d sigma(x) = Arch(U) + sum_G |v_g><v_g| - int_J rho_J |v_x><v_x| dx.
- Defect of the completion against the data: E(u) = Q_D(u) - T_sigma(u) = pole - 2 Re A_P - sum_G |v_g><v_g| + int_J rho_J |v_x><v_x| dx (Arch cancels).
- Completed (hybrid) form on the full band U = Lg = log(t_w/2 pi): kernel = data kernel on abs(a) < u, kernel of sigma on u <= abs(a) < Lg. This is Form C of the c18 lane with the additive reflected atoms replaced by the part of sigma above u.
      Q_C = T_sigma(Lg) + E_u, E_u = form on L^2[0, Lg] of the band-u part of (data kernel - kernel of sigma) = -2 Re A_P - [band-u part of sum_G and of rho_J].
  The pole term is dropped in Q_C (its norm on these vectors is below 2e-9 Lg at 1e6 by the c18 lane's measurement at band u; ARGUED same order for the band-limited part; all thresholds below are 1e7 times larger).

## 2. First lemma (paper; proved before any run)

**Lemma P.** Let sigma be a positive Borel measure on R with sigma([x, x+1]) = O(log(2 + abs(x))), and h in H^1_0(I).
(i) <h, T_sigma(U) h> = int abs(g(x))^2 d sigma(x) >= 0 for every U, and k_sigma(a) = int e^(iax) d sigma(x) is a positive definite tempered distribution on R. If k_sigma equals the data kernel on (-u, u), then for every U >= u the form T_sigma(U) restricted to L^2[0, u] is Q_D(u): T_sigma(U) is a positive extension of the data.
(ii) In general Q_D(u) = T_sigma(u) + E(u), hence <h, Q_D(u) h> >= lambda_min(E(u)) norm(h)^2: the sub-device N(theta) holds on the test space with tolerance 2M = max(0, -lambda_min(E(u))).
(iii) Q_C = T_sigma(Lg) + E_u, hence lambda_min(Q_C) >= lambda_min(E_u), and the restriction of Q_C to L^2[0, u] is Q_D(u).
Proof. (i) abs(g(x))^2 = O(x^(-2)) for h in H^1_0, so the integral converges; it is an integral of a non-negative function against a positive measure. Positive definiteness: Bochner-Schwartz, trivial direction. Restriction: the form of a kernel on L^2[0, u] reads the kernel on (-u, u) only. (ii), (iii): linearity; T_sigma >= 0 by (i); the kernel of Q_C minus the kernel of sigma is supported in abs(a) < u by construction. QED.
The lemma is one-sided: only lambda_min of the defect enters. It uses nothing about G.

**Lemma Z (zero-side reading and the ZQ control, paper).** For zeta, E(u) = T_Z(u) - T_sigma(u) = form of the signed measure (zero counting measure of zeta) - sigma (explicit formula). (a) A real zero of zeta not in G contributes +|v><v| >= 0. (b) A point of G that is not a zero contributes -|v_g><v_g| (norm u). (c) A zero displaced by d from its point of G contributes a rank-two form of norm at most about u^2 abs(d). (d) A non-real pair gbar +- i eta contributes the pair form, whose smallest eigenvalue is at least -mu(eta, u), mu = u (sinh(u eta)/(u eta) - 1) (c17 Theorem 2 (c)), and mu -> 0 as eta -> 0.
Consequence, before any run: for ZQ (two adjacent ordinates g1, g2 replaced by gbar +- i eta; its real zero set is zeta's minus {g1, g2}; completion G minus the two points r1, r2 nearest g1, g2) E_ZQ = E_zeta + (|v_r1><v_r1| + |v_r2><v_r2| - |v_g1><v_g1| - |v_g2><v_g2|) + pair form, so lambda_min(E_ZQ) >= lambda_min(E_zeta) - (swap) - mu(eta, u). **On the one-sided statistic ZQ passes for eta small enough at every theta and height; outcome (b) is forced on paper for eta -> 0.** The runs measure the threshold and the other classes. The two-sided statistic norm(E(u)) is at least about 2u for ZQ at every eta, but for zeta "norm(E) small" says that the zero counting measure equals the sign-change measure of Z_RS at the resolution of the window, which excludes every off-line pair: it is the target in the window (plus simplicity at the resolution of the Riemann-Siegel remainder), not a weaker input. Both statistics are reported; only the one-sided one enters Lemma P.

## 3. Registered grid

- theta in {0.75, 0.80, 0.85}; heights T0 in {1e6, 1e9, 1e12}; windows t_w = T0 + 128 w, w in {0, 5, 10, 15, 20, 25, 30, 35} (8 per height); mode counts m in {96, 192, 384}, every count reported; nodes tau_j = t_w + (j - (m-1)/2) 2 pi/U, U = u for D, E; U = Lg for Q_C, E_u.
- Prime sums: engine.c of the c18 lane (moments; existing files at 1e6 and 1e12, new run at 1e9; X_theta = floor(T0^theta); boundary cells for theta = 0.80 by an extra run). Radius of prime sums: the c18 hand-derived formula (flagged by its referee E5: certified relative to that radius).
- Zeros of Z_RS: grid of step 2 pi/(32 Lg), local degree-7 interpolation, sub-grid 1/8, bisection on the interpolant. Check: direct evaluation of Z_RS at a sample of located points. GPU 1 (float64) is used only for the grid values. The located points enter the ball computation as exact floats; Lemma P does not need them to be zeros.
- Statistics (all divided by U and then by Lg): s_D = lambda_min(Q_D(u)); e_min, e_max = extreme eigenvalues of E(u); s_C = lambda_min(Q_C); f_min, f_max of E_u; t_min = lambda_min(T_sigma) (must be >= 0: code check).
- Certification: python-flint balls, 128 bits. Enclosure of extreme eigenvalues: C = V^T A V in balls with the float eigenvector matrix V; A - c >= 0 is certified by strict diagonal dominance of V^T (A - c) V (which also shows V invertible); the other side by a ball Rayleigh quotient. Relative acceptance test: an eigenvalue is "enclosed" if the certified interval has width at most max(1e-6 Lg, 1e-3 abs(value)); otherwise the cell is "undecided".

## 4. Classes, each on its own zero configuration

| Class | Data | Completion |
|---|---|---|
| zeta | prime side, Arch, pole | G of Z_RS (main sum). Variant RS1: main sum plus the first correction term C0 (reported at band u only) |
| 24 multiplicative sign chains (c18 hash seeds 121000 + j) and Liouville | chain prime side, zeta's Arch, no pole | G of 2 Re[e^(i vartheta) sum_(n <= N) eps(n) n^(-1/2 - ix)], eps completely multiplicative; same rho |
| ZQ, eta in {0.25, 0.05, 0.01} | zeta data, two Arb zeros nearest the centre replaced by the pair | G minus the two nearest points |
| E_a, a in {0.1, 0.3} | its prime side, Arch, poles | empty (xi(1/2+a+ix) xi(1/2-a+ix) = abs(xi(1/2+a+ix))^2 has no real zero); statistic = s_D |
| DH (1e6, 1e9; not 1e12: coefficient array above the memory plan) | its prime side (all n), its Arch | G of 2 Re[e^(i vartheta_5) sum_(n <= sqrt(5 t_w/2 pi)) a_n n^(-1/2 - ix)], rho_5 = vartheta_5'/pi |
| T-NR (3, 2.2) | zeta data plus the row at powers of 3 (c18 formula) | zeta's G (the local factor has no real zero) |
| HQ2 truncation (q = 2, eps = 0.01), zeta(s)(1 + eps w^2/(1 - w)^4), w = q^(1/2 - s) | zeta data plus the row -2 Re sum_(k log 2 < u) k log 2 c_k C_(k log 2), log(1 + eps w^2/(1-w)^4) = sum c_k w^k | zeta's G (the factor is real and positive on the line, with quadruple poles) |

Hybrid Q_C: zeta, Liouville and chains only.

## 5. Decomposition and prediction per part

1. zeta, s_D: positive at every m (verified height); decreasing in m; at m = 96 equal to the c18 values (0.05 to 0.075 at 0.75; 0.012 to 0.025 at 0.85, medians). Prediction for m = 384: between 0.3 and 0.8 of the m = 96 value.
2. zeta, defect E(u): e_min in [-0.05, 0] and shrinking with height (Riemann-Siegel remainder (t/2 pi)^(-1/4): 0.050, 0.0089, 0.0016); predicted size of -e_min about u (t/2 pi)^(-1/4) abs(1/Z') scale, that is 1e-1, 1e-2, 1e-3 at the three heights within a factor 5. e_max larger than -e_min at 1e6 (missed close pairs, each +u/Lg), small at 1e12. RS1 smaller than RS by the factor (t/2 pi)^(-1/2) to within 10.
3. zeta, hybrid: t_min >= 0 and below 1e-3 (band Lg is the Nyquist band); s_C = 0 within norm(E_u); norm(E_u) of the size of norm(E(u)) times at most log m (sharp cut at u).
4. chains: e_min below -0.25 in at least 90 percent of cells (no functional equation: the sign changes of the chain's main sum are not its data). s_D as in the c18 lane at m = 96, falling with m.
5. ZQ: e_min(ZQ) >= e_min(zeta) - mu(eta, u)/Lg - 0.02. At eta = 0.01 it passes wherever zeta passes; at 0.25 it fails. e_max(ZQ) >= 1.5 u/Lg at every eta.
6. E_a: s_D negative in every window for a = 0.3; for a = 0.1 negative in at least 90 percent of windows at 1e9 and 1e12 and at m = 384 at 1e6.
7. DH: s_D negative in most windows; e_min negative (off-line zeros seen by the window); e_min(DH) explained by the pair forms of its off-line zeros (not computed: no zero list at these heights).
8. T-NR and HQ2: e_min below -0.25 in every window (row of poles; HQ2: -4 u/Lg per pole on the line less the background).

## 6. Thresholds and registered outcomes

- zeta "holds": -e_min <= 0.05 in every cell at every m, and median(-e_min) at 1e12 <= 1.5 times the median at 1e6.
- a control "fails": e_min <= -0.25 (and s_D < 0 where s_D is its statistic) in every window (deterministic classes) or in at least 90 percent of cells (chains).
- a control "passes": -e_min <= 0.05 in at least half of its windows at some registered (height, theta) at every m.
- (a) zeta holds and every control fails at a size not explained by resolving its zeros (for ZQ: e_min(ZQ) below e_min(zeta) - mu(eta, u)/Lg - 0.05): the device is a lead (MEASURED; no score).
- (b) ZQ or E_a passes: device closed.
- (c) zeta's verdict or a control's verdict changes between m = 96, 192, 384: undecided; state the count needed.
- Prediction of this lane (Lemma Z): (b) through ZQ at eta = 0.01 and 0.05.

## 7. Owed items of FOR_NUMERICS_LANE.md

- Item 1 (ZQ exchange threshold): heights 1e6, 1e9, 1e12; theta' = u/Lg in {0.6, 0.8, 0.95}; M = 0; pair = the two Arb zeros nearest the centre, and a pair adjacent to the gap longer than 2 pi/u nearest the centre; eta* = sup{eta : lambda_min(Q_D - |v_g1><v_g1| - |v_g2><v_g2| + pair(eta)) >= 0} on m = 96, 192, 384 modes, float bisection, bracket ends certified in balls (relative width 2 percent). Compared with the root of u (sinh(u eta)/(u eta) - 1) = Lg (1 - theta' - sin(pi theta')/pi). Prediction: between 0.3 and 1.2 of the lattice root; smaller next to the long gap. (1e12, 0.95) needs primes to 4.4e10: run if the engine extension finishes, else NOT RUN.
- Item 4 (E_a Fejer value): heights 1e6, 1e9; a in {0.1, 0.3}; theta' in {0.5, 0.75, 1}; value(tau) = 2 Lg - 2 Re sum_(n <= P) Lambda(n)(n^a + n^(-a)) n^(-1/2 - i tau)(1 - log n/u), P = floor((T0/2 pi)^theta'), u = log P; lowest value over tau in the 8 windows, abs(tau - t_w) <= 60, step 0.01 (float), sign at the minimiser in balls. Prediction of the paper lane: negative, size P^a/(a^2 u).
- Item 5 (sign chains, complete device): theta' in {0.6, 0.8, 1}; smallest eigenvalue of Lg - 2 Re A_P^eps on m modes of L^2[0, u], P = floor((T0/2 pi)^theta'); 24 chains; 40 windows at m = 96 and the 8 windows at m = 192, 384; fraction in violation at M = 0 and M = 1. Fejer vector alone: fraction of tau (step 0.01) with Lg - Fejer value < 0. (1e12, theta' = 1) needs chain sums to 1.6e11: NOT RUN.
