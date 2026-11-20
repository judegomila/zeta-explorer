# s3-dbn-barrier-mollified-triangle: screening of four combinations (mollified triangle bound, covering identity, defect packets, margin and derivative cap)

Lane: screener, 2026-11-19/20. Verdict: 4 combinations tested, 0 survivors.

Labels: PROVED (elementary, written here), CLASSICAL, MEASURED (float64 unless a precision is stated), ARGUED, OPEN.

Outcome in one paragraph. All four combinations are parts of the machinery that certifies H_t(x + iy) != 0 for large x in the de Bruijn-Newman lane. Each of them is a statement about absolute values of heat-weighted coefficients a(n) exp((t/4) log^2 n) n^(-sigma) to the right of the effective 1-line, and none depends on the height x except through N = floor(sqrt(x/4 pi + t/16)). (1) The mollified triangle margin is exactly invariant under every completely multiplicative unimodular twist (PROVED), so the sign twist and the unimodular twist pass wherever zeta passes; Davenport-Heilbronn passes with a 96-term mollifier at a smaller time than zeta at every N tested (t* = 0.336 / 0.237 / 0.181 / at most 0.151 against 0.378 / 0.258 / 0.194 / above 0.158 for zeta under the same optimiser at N = 1e3 / 1e4 / 1e5 / 690988); zeta itself fails at t0 for every N below 637,495 although H_t0 has no zeros there. (2) Sign and monotonicity of c_n^F(t) hold for T-NR and for zeta(s+1/4) zeta(s-1/4) (both with zeros off the line) and fail for L(chi) and for the sign twists; the one-cutoff reduction uses only the absolute values and survives for every completely multiplicative twist. (3) The ratio rho = abs(sum D_j) / sum abs(D_j) has no bound below 1 for zeta (running supremum 0.647, 0.836, 0.871, 0.904, 0.912 over 1e2, 1e3, 1e4, 1e5, 5e5 samples); zeta meets the budget R_ex at every sampled x with N >= 690988 and exceeds it at every sampled x below 1e9; the twists and L(chi) have the same distribution as zeta; DH and T-NR exceed the budget at every height because the multiplier is of Euler form, which their coefficients are not. (4) For zeta the margin is positive and increasing from N = 690,988 on in every test and is a sawtooth in N -> N + 1 below N about 1e5; DH with a fixed optimised mollifier is positive and increasing from N = 330,760; T-NR decreases in about one of eight consecutive windows at every N, also where its margin is positive; functions fail the margin at heights where their approximant has no zeros in the tested rectangles, zeta included.

## Controls

| code | function | coefficients a(n) | multiplicative | off-line zeros |
|---|---|---|---|---|
| ZETA | zeta(s) | 1 | completely | none below 3e12 |
| LCHI5, CHIM3, CHIM4 | L(s, chi): chi mod 5 odd with chi(2) = i; chi_-3; chi_-4 (positive comparisons) | chi(n) | completely | none known |
| DH | Davenport-Heilbronn | (1, kappa, -kappa, -1, 0) mod 5, kappa = 0.28408 | no | yes (also to the right of 1) |
| TNR | zeta(s)(1 + c sqrt3 3^-s + 3 9^-s), c = 2.2 (T-NR single-prime family) | 1 + c sqrt3 [3 divides n] + 3 [9 divides n] | no (one modified local factor) | Re s = 1/2 +- 0.404 |
| EA | zeta(s + 1/4) zeta(s - 1/4) | n^(-1/4) sigma_(1/2)(n) | yes, not completely | all |
| SGN, LIOU | completely multiplicative signs: random at primes (seed 20261119; the draw gives +1 at 2, 3, 5, 7, 11 and -1 at 13), and Liouville | eps(n) | completely | no functional equation |
| U, UA | unimodular twists: random phases at primes; n^(-i) | u(n) | completely | no functional equation (UA: a shift of x) |
| HEAT | backward heat deformation | same sum at time t0 + tau | - | this is the t-axis of the test: see t*(N) |

For the controls the reflected ladder uses the modulus bound of zeta's gamma factor at the same N (the functional takes only abs(gamma) <= g(N); for a conductor q the map between x and N changes and the bound in terms of N is the same expression; ARGUED, the analogue of Polymath Theorem 1.3 for conductor q was not derived). The error term E = e_A + e_B + e_C0 is zeta's for every function.

## Table

| # | combination | statistic | sizes reached | ZETA | L(chi) | DH | other controls | classification |
|---|---|---|---|---|---|---|---|---|
| 1 | dbn-native-triangle-binding + lemma-cg-lambda-euler-weights + dbn-finite-lane-margins | T(N) = (1 - g - sum_(n>=2)(abs b_n + g abs a0_n) n^-sigma)/M - corr, margin T - E, and t*(N) = smallest t with positive margin at y0 = 0.18727 | zeta ladder: 244 values of N in [1e3, 3.84e6] x 7 Euler families (primes up to 3 .. 19); t*(N) at 10 values of N x 6 families; controls at N = 1e3, 1e4, 1e5, 690988, 3.84e6; optimised 96-term mollifiers at N = 1e3, 1e4, 1e5, 690988 | T(690988) = 7.9137e-7 with primes <= 11 (source floor 7.91366e-7), margin 5.5787e-7. At t0 negative for all N < 690988 (primes <= 11) and all grid N < 637,495 (primes <= 19). t* = 0.3899 / 0.2636 / 0.1966 / 0.16125 / 0.1388 at N = 1e3 / 1e4 / 1e5 / 690988 / 3.84e6 | t* = 0.3698 / 0.2525 / 0.1896 / 0.1562 / 0.1348 (chi mod 5); 0.3380 .. 0.1294 (chi_-4): below zeta at every N | passes. Optimised mollifier: t* in (0.3350, 0.3375], (0.2363, 0.2375], (0.1801, 0.1810], (0.1480, 0.1506] at N = 1e3, 1e4, 1e5, 690988; zeta with the same optimiser: (0.3775, 0.38], (0.2575, 0.2588], (0.1938, 0.1947], (0.1586, 0.16125]. At N = 690988, t0: T_DH = 0.2091, T_zeta = 0.0272. With the mollifier of N = 690988 kept fixed DH is positive at t0 from N = 330,760 (300 sampled N); without any mollifier from N = 1,316,066 | SGN, LIOU, U, UA: identical to zeta (PROVED; measured difference 6e-17 at N = 690988). TNR own factor: t* = 0.4817 / 0.3151 / 0.2297 / 0.1857 / 0.1582 (passes at t0 from N about 3.2e6). EA own factors: none / 0.4065 / 0.3038 / 0.2496 / 0.2152 | CLOSED. A modulus-only functional right of the effective 1-line: twist-invariant, passes DH earlier than zeta, fails zeta below N = 6.4e5 where H_t0 has no zeros |
| 2 | dbn-tail-contraction-lemma + lean-cg-covering-identity + lemma-cg-covering-identity | sign and monotonicity in t of c_n^F(t) = sum_(d divides (n,30)) mu(d) w(d) beta_d(t) a_F(n/d) b_t(n/d); contraction D_F(N) for N >= 3.84e6 with the tail mollifier | n <= 1e9 for the periodic families and n^-i; n <= 2e7 for LIOU, SGN, EA; 7 time values in [0, 0.3]; D_F at 7 values of N in [3.84e6, 2e7] | 0 negative, 0 non-monotone among 1e9; D = 0.4097 at N*, decreasing | fails the sign: chi_-3: 444,444,444 negative (first n = 2); chi_-4: 374,999,999; complex chi mod 5: not real. Modulus monotone: 0 violations. D = 0.353 / 0.320 / 0.304: passes | sign fails at 480,000,000 n (first n = 2); modulus non-monotone in 10,336,157 (n, time step) instances (zeta weights); D = 1.254 with the zeta table (fails), 0.707 with no mollifier (passes) | TNR: 0 negative, 0 non-monotone among 1e9 (passes the sign test; D = 1.509 with the zeta table). EA zeta weights: 0 negative, 0 non-monotone among 2e7. LIOU, SGN: half negative; modulus 0 violations; D identical to zeta with the twisted table | CLOSED. The sign test is passed by two controls with off-line zeros and failed by every L(chi); it reads the sign of a(n) and the primes 2, 3, 5 only. The reduction needs abs c_n only |
| 3 | route7-cost-exponential + dbn-projective-macrocell-014 + modulus-last-normal-form | rho(x) = abs(sum_j D_j) / sum_j abs(D_j) over the 25 packets (primes 97 .. 2), pilot = sum abs(D_j) against R_ex = 0.27969; row t = 0.12364, y = 0.1809 | 500,001 values of x, log-uniform in [1e6, 1e13] (N = 282 .. 892,061; 5.5e10 terms per function), 7 coefficient / multiplier choices, CPU with exact phase reduction; 20,000 further values locally | rho: inf 0.0001, median 0.286, 99th percentile 0.726, sup 0.912 (at x = 7.8e11); sup per decade 0.81, 0.78, 0.81, 0.84, 0.88, 0.91, 0.91. Budget: sum abs D_j > R_ex in 100 %, 100 %, 100 %, 97.5 %, 67.8 %, 10.3 %, 0.003 % of the samples of the seven decades (last excess at x = 1.13e12, N = 300,033); for N >= 690988 (15,882 samples): sup 0.2159, no excess | chi mod 5: rho median 0.311, sup 0.926; budget excess 100 %, 100 %, 99.8 %, 92.2 %, 47.7 %, 2.7 %, 0; N >= 690988: sup 0.1934 | q_p = chi(p): rho median 0.418, sup 0.975; pilot > R_ex in 100 % of every decade (for N >= 690988: min 0.471, median 0.881). q_p = a_DH(p): median 0.504, sup 0.972; excess in 51 % of the top decade (42 % for N >= 690988) | SGN: median 0.286, sup 0.918, excess fractions 100 %, 100 %, 100 %, 97.5 %, 68.1 %, 10.5 %, 0.004 %; U: median 0.286, sup 0.926, the same fractions to 0.4 points (both: no excess for N >= 690988, sup 0.220 and 0.217). TNR (q_3 of zeta): median 0.747, sup 0.983, excess 100 % everywhere. Null models from zeta's packets: random signs sup 0.967, random phases sup 0.880 | CLOSED. No constant below 1 bounds rho for zeta; the budget is met by zeta only above x about 1.1e12 (cost law); twists equal zeta; DH and T-NR exceed the budget because the multiplier is of Euler form at 25 primes, a property of the coefficients; DH passes the corresponding modulus test with a free mollifier (row 1) |
| 4 | w3-tail-lemma + i2-i3-same-obstruction + derivative-cap-route-comparison | delta(N, y) = max over families of T - E; D_I (differentiated cap), D_II (Cauchy cap); monotonicity of delta in N; zero count of f_t in rectangles | zeta: 11,351 distinct N in [1e3, 3.84e6] at y0 (log-uniform, four families) and 167 N at each of y = 0.03, 0.10, 0.1809, 0.30, 0.40; blocks of 40 consecutive N at ten starting points; controls: 302 N at y0; zero counts in 112 rectangles | delta > 0 exactly from N = 690,988 on (largest sampled N with delta <= 0: 690,940); 0 decreases between consecutive sampled N above 104,179 and 0 in consecutive windows at N >= 3e5; 626 decreases (at most 0.0032) below, all with delta < 0. D_II/D_I = 6.5 .. 19.7. Panel density D_I/(pi delta): 5.9e6 at N = 690988, 28 at 1.0e6, 4.6 at 3.84e6 | first positive N = 495,840 (chi mod 5), 412,594 (chi_-3), 298,262 (chi_-4) among 302 sampled; no decrease above N = 1481 in the sample; 9 of 40 consecutive windows decrease at N = 1e5, none at N >= 3e5 | optimised mollifier of N = 690988 kept fixed: delta > 0 from N = 330,760 (last sampled non-positive N: 319,209), 0.209 at 690988, 0.511 at 3.84e6; no decrease above N = 2551 in the sample, none in consecutive windows at N >= 690988. No mollifier: positive from 1,316,066 | SGN, LIOU, U, UA: equal to zeta (PROVED). TNR own factor: positive from N = 3,208,854; decreases in 4 or 5 of 40 consecutive windows at every block up to 2e6. EA: negative at every N <= 3.84e6 (-13.1 at 690988), 71 decreases among 301 steps. Zero counts at t0 in [x, x+40] x [y0, 1]: 0 for every function at N = 1e4, 1e5, 690988 (TNR 1 and EA 7 at N = 1e3) | CLOSED. Above its first positive N the margin increases for zeta, L(chi) and DH; only T-NR is non-monotone there (5 of 40 consecutive windows at N = 3.84e6; a(n) = 7.81 on multiples of 9); negative margins occur without zeros for zeta as well; caps and margin depend on abs a(n) only |

All numbers MEASURED unless marked. Files are listed at the end.

## 0. Shared functional, code and validation

Source definitions (text of `dbn-lambda-01787854-candidate-audit/NATIVE_BINDING.md`, `src/lemma_sweep_p235711_triangle_stored.c`, `CANDIDATE_PARAMETERS.md`, `independent/prop410/prop410_proof.py`). With x_N = 4 pi (N^2 - t/16), L = log(x_N/4 pi), b_t(m) = exp((t/4) log^2 m):

    sigma = (1+y)/2 + (t/4) L - t max(0, 1 - 3y + 4y(1+y)/x_N^2)/(2 x_N^2),   K = t y/(2(x_N - 6)),   g = exp(0.02 y - (y/2) L)
    b(n) = sum_{d in S, d | n, n/d <= N} lambda_d a(n/d) b_t(n/d),      a0(n) = the same sum with the extra factor (n/d)^y
    T(N) = (1 - g - sum_{n >= 2} (|b(n)| + g |a0(n)|) n^(-sigma)) / sum_d |lambda_d| d^(-sigma)  -  g sum_{m=2}^{N} |a(m)| b_t(m) (m^K - 1) m^(y - sigma)

a = 1 and lambda the Euler mollifier prod_{p in P}(1 - b_t(p) p^(-s)) give the stored value of the source; T(N) > E(N) = e_A + e_B + e_C0 implies f_t != 0, hence H_t != 0, on the whole window x_N <= x < x_(N+1) at height y. The code (`lib.py`, class `Tri`) organises the sum over n <= D N by G = gcd(n, D), n = G j with gcd(j, D/G) = 1, so that one evaluation costs prod_p (2 + 1/p) N operations for a squarefree support (57 N for primes <= 11) instead of D N (2310 N).

Validation (MEASURED).
- N = 690988, primes <= 11, t0 = 129/800, y0 = sqrt(87677/2500000): T = 7.913667453e-7; the Arb-certified stored floor of the source is 0.000000791366. E = 2.334946e-7 (source: 2.33494905e-7). Margin 5.5787e-7 (source: 5.5787e-7).
- The first N with positive margin in each family reproduces the ladder of the source: 1,028,000 (primes 2, 3), 819,000 (2, 3, 5), 729,000 (2, 3, 5, 7), 690,988 (2 .. 11) on the 244-point grid, which contains these four values; at the three later anchors T exceeds the stored floors by 5.3e-8 to 5.6e-8 (the stored values are lower bounds over a t-box with frozen weights).
- Tail mollifier of `TAIL_LEMMA.md`: sum abs(lambda_d) d^-sigma = 1.608289 at N* = 3,840,000 (source: M_max < 1.608290).
- Independent implementation in ball arithmetic (`recheck_arb.py`, python-flint, 128 bits, accumulation by n in a dictionary, no gcd structure): zeta, primes <= 11, N = 2000: T = 0.09258638941981105 at t = 0.36 and -0.06955828594007442 at t = 0.33 (float64 code: 0.09258638941981111, -0.06955828594007465). DH with its optimised mollifier: N = 1000, t = 0.3575: T = 0.10646287697182 (positive, ball radius 1e-34); N = 10000, t = 0.2575: T = 0.18419966842208 (positive); N = 10000, t = 0.2075: -0.39321921694038. Float64 agrees to 15 digits in all six cases.
- Gradient of the smoothed objective against finite differences: 3.32657144e-2 / 3.32657144e-2 (d = 15), 5.78262e-6 / 5.78260e-6 (d = 2310).

## 1. Mollified triangle margin and the smallest certifiable time

Finite consequence tested. For a function F with coefficients a_F: (a) the sign of T_F(N) - E(N) at (t0, y0) on N = 1e3 .. 3.84e6 with the best mollifier available; (b) t*_F(N) = inf{t : T_F(N; t, y0) > E}. Stated before the run: survival needs zeta positive at every N reached, every control negative for every mollifier at N where the control's H_t0 has no zeros, and L(chi) behaving like zeta.

### 1.1 What the functional can see (PROVED / CLASSICAL)

(i) Twist invariance (PROVED). Let u be completely multiplicative with abs(u(n)) = 1. Replace a by a u and lambda_d by lambda_d u(d). Then b(n) becomes u(n) b(n) and a0(n) becomes u(n) a0(n), because u(d) u(n/d) = u(n); the normaliser and the correction term contain abs only. So T is unchanged: for SGN, LIOU, U, UA the margin, t*(N) and every quantity of this section equal those of zeta. Measured: T(690988) = 7.913667453e-7 for ZETA, SGN, LIOU, U (differences below 1e-16), and t* equal to 5 digits at the five values of N. If abs(u(p)) <= 1 (a character), abs b can only decrease and M decreases: T_chi >= T_zeta whenever the numerator is positive.

(ii) The functional is a half-plane test (PROVED). If T > 0 for some mollifier, then with P(s) = sum_{m <= N} a(m) b_t(m) m^(-s) one has E(s) P(s) = 1 + sum_{n >= 2} b(n) n^(-s) and sum abs(b(n)) n^(-sigma) < 1, so P(s) != 0 for every s with Re s >= sigma, at every height, and on the whole torus of prime phases z_p (replace p^(-i tau) by independent unimodular z_p). The height x enters only through N. Conversely (CLASSICAL, Hewitt-Williamson 1957) a Dirichlet polynomial bounded away from zero in a closed half-plane has an absolutely convergent Dirichlet-series inverse there, so for the direct ladder alone a mollifier with sum abs(b(n)) n^(-sigma) < 1 exists exactly when P has no zero on the torus at abscissa >= sigma (the reflected ladder, weight g <= 0.28, and the finite support cost a finite amount on top: at N = 1e4 torus zeros stop at t = 0.168 and the best mollifier found needs t = 0.258).

(iii) Consequence. A control can fail this test only through a zero of its window polynomial on the torus at effective abscissa sigma_N - (t/4) log n >= 1.13 (t0, N = 690988); such zeros are not zeros of the control near height x.

### 1.2 Zeta: ladder and t*(N)

At t0 the margin of every Euler family is negative at N = 1000 (T = -4.01 .. -3.01) and increases with N (0 decreases among 243 consecutive grid pairs in each of the 7 families). First positive grid value: 1,028,000 / 819,000 / 729,000 / 690,988 / 683,079 / 659,894 for primes up to 3 / 5 / 7 / 11 / 13 / 17 and 637,495 for primes up to 19 (ladder only; the t* rows of that family were not finished). For 1000 <= N < 637,495 zeta fails the test at t0 with every Euler family up to 19, and with the optimised 96-term mollifier at N = 1e3, 1e4, 1e5 (t* = 0.378, 0.258, 0.194 > t0). In that range H_t0 has no zeros with y >= y0 (verified height and the barrier theorem of the source). The failure is the cost law, not zeros.

t*(N) (26 bisection steps; the margin is increasing in t on 8 grid values above t* in all 60 cases):

| N | primes <= 3 | <= 5 | <= 7 | <= 11 | <= 13 | <= 17 |
|---|---|---|---|---|---|---|
| 1,000 | 0.41044 | 0.39874 | 0.39267 | 0.38992 | 0.38786 | 0.38654 |
| 10,000 | 0.27584 | 0.26885 | 0.26526 | 0.26364 | 0.26245 | 0.26168 |
| 100,000 | 0.20475 | 0.20007 | 0.19770 | 0.19663 | 0.19584 | 0.19534 |
| 690,988 | 0.16736 | 0.16383 | 0.16205 | 0.16125 | 0.16066 | 0.16029 |
| 1,000,000 | 0.16165 | 0.15828 | 0.15659 | 0.15583 | 0.15527 | 0.15492 |
| 3,840,000 | 0.14366 | 0.14081 | 0.13939 | 0.13875 | 0.13828 | 0.13799 |

(rows 3000, 30000, 300000, 2e6 in `c1_tstar.jsonl`). t*(690988) = 0.16125 = t0 for primes <= 11 reproduces the source's choice of the first window. Fit over the ten values of N: log N = 1.771/t* + 2.45 (primes <= 11, residual <= 0.09), that is log N1*(t, y0) = (2 c0 - y0)/t + const with c0 = 0.979. Six more primes in the mollifier move t* by 0.007. The time is fixed by log N.

### 1.3 Controls

t* with each function's own Euler-type mollifier (primes <= 11; EA primes <= 7 with both local roots; TNR with the exact inverse local factor at 3 truncated at 3^6); 14 bisection steps.

| function / mollifier | N = 1e3 | 1e4 | 1e5 | 690988 | 3.84e6 | T at t0, N = 690988 |
|---|---|---|---|---|---|---|
| ZETA | 0.38995 | 0.26368 | 0.19664 | 0.16127 | 0.13875 | 7.91e-7 |
| SGN, LIOU, U, UA (own) | 0.38995 | 0.26368 | 0.19664 | 0.16127 | 0.13875 | 7.91e-7 |
| LCHI5 | 0.36976 | 0.25249 | 0.18959 | 0.15615 | 0.13476 | 0.0948 |
| CHIM3 | 0.35472 | 0.24469 | 0.18484 | 0.15277 | 0.13214 | 0.161 |
| CHIM4 | 0.33798 | 0.23626 | 0.17982 | 0.14921 | 0.12942 | 0.245 |
| DH, no mollifier | 0.41490 | 0.28046 | 0.20888 | 0.17107 | 0.14703 | -0.249 |
| DH, zeta's mollifier | 0.50863 | 0.33860 | 0.24977 | 0.20354 | 0.17445 | -0.593 |
| DH, optimised (96 terms) | (0.3350, 0.3375] | (0.2363, 0.2375] | (0.1801, 0.1810] | (0.1480, 0.1506] | not run | 0.2091 |
| ZETA, optimised (96 terms) | (0.3775, 0.3800] | (0.2575, 0.2588] | (0.1938, 0.1947] | (0.1586, 0.16125] | not run | 0.0272 |
| TNR, own factor | 0.48172 | 0.31507 | 0.22972 | 0.18571 | 0.15818 | -0.413 |
| TNR, zeta's mollifier | 0.56928 | 0.36939 | 0.26662 | 0.21385 | 0.18106 | -1.23 |
| EA, own factors | none below 0.6 | 0.40651 | 0.30377 | 0.24962 | 0.21523 | -13.1 |

Optimised mollifiers. Support: all divisors of 72072 = 2^3 3^2 7 11 13 for DH (96 terms; its coefficients vanish on multiples of 5) and of 27720 = 2^3 3^2 5 7 11 for zeta (96 terms); real lambda_d, lambda_1 = 1; minimisation of sum w_n (abs b + g abs a0) + corr sum abs(lambda_d) d^-sigma with abs smoothed at 1e-3 .. 1e-7 (L-BFGS, warm starts down a time grid, then bisection). The numbers are the best found: upper bounds for the true t* on that support.

Reading.
1. DH passes. With a free 96-term mollifier its certifiable time is below zeta's at every N tested (0.336 / 0.237 / 0.181 / 0.151 against 0.378 / 0.258 / 0.194 / above 0.158 at N = 1e3 / 1e4 / 1e5 / 690988, with the same optimiser and the same number of terms), and at the source's binding window (N = 690988, t0) its margin is 0.209 where zeta's is 7.9e-7 (Euler) or 0.027 (optimised). Its coefficients have mean absolute value 0.51 against 1.
2. The twists pass identically; the characters pass earlier than zeta.
3. TNR and EA have larger t*: their coefficients are larger (TNR: 4.81 on multiples of 3, 7.81 on multiples of 9; EA: of size n^(1/4)). The difference is the size of a(n).
4. HEAT control: the test is monotone in t and fails for t < t*(N) for every function; for zeta at N < 6.6e5 it fails at t0 itself.

### 1.4 Torus zeros (mollifier-independent side)

`c1_torus.py` minimises abs(P(z)) over the phases of all primes <= N (L-BFGS, 14 starts). A zero certifies that no mollifier of any support has a positive margin (1.1 (ii)); "no zero found" is not a certificate.

| N | ZETA: zero found for t up to | DH | LCHI5 | TNR | best mollifier t* (zeta / DH) |
|---|---|---|---|---|---|
| 1,000 | 0.2275 | 0.2144 | 0.2125 | 0.3175 | 0.378 / 0.336 |
| 10,000 | 0.1675 | 0.1609 | 0.1645 | 0.2206 | 0.258 / 0.237 |
| 100,000 | 0.1344 | 0.1294 | 0.1291 | 0.1666 | 0.194 / 0.181 |

At N = 10,000 and t0 = 0.16125 the minimisation reaches abs P = 5e-7 for zeta (sum of moduli 6.97; a numerical zero, not certified by a degree argument): then no mollifier whatever certifies that window, while H_t0 has no zero there. DH has the smaller threshold at each N. The thresholds are functions of (N, t, y) and of the moduli abs a(p^k) only.

Why closed. Invariance (i) alone excludes survival: SGN and U pass. In addition DH passes earlier than zeta, and zeta fails where it has no zeros. This is the known pattern "only to the right of 1" with the effective abscissa (1+y)/2 + (t/4) log N of the last term between 1.12 and 1.27 at t* (N = 3.84e6 .. 1e3). N = 690988 was not run for the torus search.

## 2. Covering identity with control coefficients

Definitions (text of `formalization/paper/cg-monotonicity.md`): c_n(t) = sum_{d | (n,30)} mu(d) beta_d(t) b_t(n/d), beta_d = prod_{p | d} b_t(p); Lemma CG: 0 <= c_n(t') <= c_n(t) for 0 <= t' <= t and all n. With a_F: c_n^F(t) = sum mu(d) w(d) beta_d(t) a_F(n/d) b_t(n/d), w = 1 ("zeta weights") or w(d) = a_F(d) ("own weights").

Finite consequence tested. For each F, the number of n <= n_max with c_n^F(t0) < 0; with c_n^F(t') > c_n^F(t) for consecutive times in {0, 0.02, 0.05, 0.10, t0, 0.20, 0.30}; with abs c_n^F(t') > abs c_n^F(t). Survival would need: zeta and L(chi) pass, every control fails.

PROVED remarks. For completely multiplicative unimodular a_F and own weights, c_n^F = a_F(n) c_n: the modulus is c_n, the sign or phase is that of a_F(n). With zeta weights, abs c_n^F = abs(sum_{d | g} mu(d) conj(a_F(d)) beta_d b_t(n/d)): for Liouville every term has the same sign.

Result (n_max = 1e9 for ZETA, CHIM3, CHIM4, LCHI5, DH, TNR, UA on the GPU in float64 with a relative cancellation floor 1e-12; n_max = 2e7 for LIOU, SGN, EA by sieve):

| F (weights) | c_n(t0) < 0 | first n | non-monotone (real), summed over 6 time steps | abs non-monotone | passes sign and monotonicity |
|---|---|---|---|---|---|
| ZETA | 0 | - | 0 | 0 | yes |
| TNR (zeta) | 0 | - | 0 | 0 | yes |
| EA (zeta), n <= 2e7 | 0 | - | 0 | 0 | yes |
| EA (own), n <= 2e7 | 443 | 4 | 8,700,346 | 2,203,194 | no |
| CHIM3 (zeta / own) | 444,444,444 / 333,333,331 | 2 / 8 | 2,666,666,664 / 1,999,999,986 | 0 / 0 | no |
| CHIM4 (zeta / own) | 374,999,999 / 249,999,999 | 2 / 7 | 2,249,999,994 / 1,499,999,994 | 0 / 0 | no |
| LCHI5 (zeta / own) | complex | - | - | 0 / 0 | modulus only |
| UA (zeta / own) | complex | - | - | 0 / 0 | modulus only |
| DH (zeta / own = chi-type weights a(d)) | 480,000,000 / 399,999,999 | 2 / 4 | 2,879,999,999 / 2,399,999,994 | 10,336,157 / 0 | no |
| LIOU (zeta / own), n <= 2e7 | 10,002,255 / 10,002,252 | 2 / 7 | 60,013,530 / 60,013,512 | 0 / 0 | no |
| SGN (own), n <= 2e7 | 9,996,371 | 13 | 59,978,226 | 0 | no |

Ball recheck (`recheck_arb.py`, 128 bits, 20,000 random n <= 1e9, times 0.10 and t0, zeta weights): DH 9561 negative and the same 9561 with c_n(0.10) > c_n(t0), CHIM4 7481 and 7481, ZETA 0 and 0; no undecided sign.

One-cutoff reduction (`c2_tail.py`): contraction D_F(N) = g + sum_{n >= 2}(abs b + g abs a0) n^-sigma with the fixed tail mollifier (support {1, 2, 3, 4, 5, 6, 7, 10, 11, 13, 14}), N = 3.84e6, 4.05e6, 5e6, 7e6, 1e7, 1.5e7, 2e7, at (t0, y0). The source bound D < 0.999721 is an upper bound over a y-box with 153,814 exact head coefficients and analytic caps; the direct sum at y0 is 0.4097.

| F / mollifier | D(3.84e6) | D(2e7) | D decreasing in N | T(3.84e6) |
|---|---|---|---|---|
| ZETA | 0.4097 | 0.1873 | yes | 0.3671 |
| SGN, twisted table | 0.4097 | 0.1873 | yes | 0.3671 |
| SGN, untwisted table (wrong sign at 13) | 0.4378 | 0.2045 | yes | 0.3496 |
| LCHI5 / CHIM3 / CHIM4, twisted table | 0.3529 / 0.3203 / 0.3044 | 0.1654 / 0.1524 / 0.1505 | yes | 0.4222 / 0.4765 / 0.5552 |
| DH, zeta's table | 1.2544 | 0.8773 | yes | -0.158 |
| DH, no mollifier | 0.7066 | 0.4553 | yes | 0.2934 |
| TNR, zeta's table | 1.5092 | 0.8898 | yes | -0.317 |
| EA, zeta's table | 17.70 | 7.03 | yes | -10.4 |

Reading. (a) The sign statement c_n >= 0 is positivity of the coefficients after the 2, 3, 5 mollifier: TNR and EA (zeta weights), both with zeros off the line, satisfy it for all n tested with monotonicity, and every L(chi) violates it at n = 2 or 7 or 8. It separates "a(n) >= 0 with a mild local structure at 2, 3, 5" from the rest, and puts the positive comparison on the failing side. (b) It uses the primes 2, 3, 5 only. (c) The reduction of all N >= N* to one cutoff uses that D_F(N) decreases in N; this holds in every case computed, with or without the sign property, and D_F < 1 holds for DH with no mollifier. In the source the sign property is used to evaluate sum abs(c_n) in closed form and to enclose time boxes, not for the contraction itself.

Why closed. Failure is coefficient sign (as predicted in the assignment); two controls with off-line zeros pass, L(chi) fails; three primes only.

## 3. Modulus-last against modulus-first

Definitions (text of `native/gate2-lane-a/main.c`, locked convention; `src/data/viz-freeze-flow-phasors.js`): row t = 24727519/200000000, y = 0.1809; chart sigma_B = (1+y)/2 + (t/4) log(N^2 - t/16), sigma_A = sigma_B - y, gamma = exp(0.02 y - (y/2) log(N^2 - t/16)); carrier c_n = a(n) b_n n^(-sigma_B) e^(-i theta_n) + gamma conj(a(n)) b_n n^(-sigma_A) e^(+i theta_n), theta_n = (x/2) log n; classes by smallest prime factor (class j = 1..25 for 97 .. 2; class 0 = no prime factor <= 97); G_j = classes 0..j, H_j = class j, q_p = w(p) b_p p^(-sigma_B) e^(-i theta_p), A_(<j) = prod_{i<j}(1 - q_i); D_j = A_(<j)(q_j G_j - H_j). Telescope (PROVED, any a and any w): sum_j D_j = C - A F, C = class 0, F = all classes.

Validation. At the witness x = 6.0000039166e12 (N = 690988) the 25 packets agree with the stored double-double values to 4.0e-14 (local run) and 2.8e-8 on the server (logarithms from 80-bit long double, phase error up to 3e-6 rad at x = 6e12) (server); abs E97 = 0.181497207134319 (stored 0.181497207134323), sum abs D_j = 0.243754142526489 (stored 0.243754142526558). Phases (x/2) log n are reduced with exact split products (error below 1e-10 turns); maximal telescope error 3.6e-15 over all samples and functions.

Finite consequence tested. For zeta: sup over x of rho(x) below a fixed constant < 1 and sum abs D_j < R_ex at every x. For the controls: rho -> 1 or budget exceeded at heights unrelated to zeros. Survival would need all of: zeta below the budget at every x reached, every control above it, the twists included.

Result (`c3_packets.py` in three parts on the server, merged by `c3_merge.py`; 500,001 samples; `out_c3_merged.txt`, `out_c3_top.txt`).

| function, multiplier | rho: inf / median / 99 % / 99.99 % / sup | sup of rho per decade of x (1e6 .. 1e13) | fraction with sum abs D_j > R_ex per decade | N >= 690988 (15,882 samples): sum abs D_j min / median / sup |
|---|---|---|---|---|
| ZETA | 0.0001 / 0.286 / 0.726 / 0.863 / 0.912 | 0.81 0.78 0.81 0.84 0.88 0.91 0.91 | 1, 1, 1, 0.975, 0.678, 0.103, 2.8e-5 | 0.041 / 0.138 / 0.216 |
| LCHI5, q_p = chi(p) | 0.0005 / 0.311 / 0.748 / 0.874 / 0.926 | 0.74 0.78 0.84 0.86 0.88 0.90 0.93 | 1, 1, 0.998, 0.922, 0.477, 0.027, 0 | 0.043 / 0.123 / 0.193 |
| SGN, own | 0.0003 / 0.286 / 0.725 / 0.863 / 0.918 | 0.80 0.78 0.84 0.85 0.87 0.92 0.92 | 1, 1, 1, 0.975, 0.681, 0.105, 4.2e-5 | 0.036 / 0.138 / 0.220 |
| U, own | 0.0004 / 0.286 / 0.725 / 0.860 / 0.926 | 0.77 0.78 0.82 0.85 0.87 0.90 0.93 | 1, 1, 1, 0.975, 0.674, 0.104, 2.8e-5 | 0.053 / 0.138 / 0.217 |
| DH, q_p = chi(p) | 0.001 / 0.418 / 0.857 / 0.945 / 0.975 | 0.96 0.97 0.97 0.95 0.97 0.97 0.98 | 1 in every decade | 0.471 / 0.881 / 2.283 |
| DH, q_p = a_DH(p) | 0.0002 / 0.504 / 0.901 / 0.955 / 0.972 | 0.92 0.94 0.95 0.94 0.96 0.96 0.97 | 1, 1, 1, 0.980, 0.859, 0.694, 0.510 | 0.116 / 0.264 / 0.675 |
| TNR, zeta's q_p | 0.004 / 0.747 / 0.936 / 0.969 / 0.983 | 0.93 0.93 0.96 0.94 0.97 0.98 0.98 | 1 in every decade | 0.751 / 0.884 / 1.687 |
| zeta's packets with random signs | 0.0007 / 0.313 / 0.754 / 0.892 / 0.967 | 0.83 0.85 0.85 0.91 0.91 0.93 0.97 | (as zeta) | - |
| zeta's packet moduli with random phases | 0.0007 / 0.336 / 0.699 / 0.833 / 0.880 | 0.81 0.83 0.81 0.82 0.87 0.87 0.88 | (as zeta) | - |

Running supremum of rho for zeta over random subsamples of size 1e2, 1e3, 1e4, 1e5, 5e5: 0.647, 0.836, 0.871, 0.904, 0.912; 8e-6 of the samples have rho > 0.9. The local run of 20,000 other samples gives sup 0.904 for zeta and the same decade fractions (1, 1, 1, 0.978, 0.669, 0.097, 0). UA (a(n) = n^-i) is zeta at x + 2 for the direct ladder and was not run separately.

Reading.
1. rho for zeta is not bounded by a constant below 1 on this evidence: its supremum grows with the number of samples as for 25 packets with independent phases (the null model with random signs reaches 0.967, with random phases 0.880). The four largest packets (p = 2, 3, 5, 7) carry 0.198 of the 0.244 at the witness; when their phases align rho is near 1.
2. Budget. Zeta is above R_ex at every sampled x < 1e9 and in 97.5 % / 67.8 % / 10.3 % of the samples of the decades starting at 1e9 / 1e10 / 1e11; the last excess is at x = 1.13e12 (N = 300,033); for N >= 690988 the sampled supremum is 0.216 (the source's optimised supremum on the first window is 0.2438). Below N about 3e5 zeta has no zeros off the line and exceeds the budget: this is the cost law of section 1.2 (log N1* = 1.77/t + 2.45 at y0 and, from the first positive N at five heights y at t0, d log N1*/dy = -11.8 = -1.91/t0; the node's form (2 c0 - y)/t has coefficient 1 on y), not zeros.
3. SGN and U are indistinguishable from zeta in every column (PROVED for the direct ladder: a torus translation; the reflected ladder carries conj(a)); L(chi) is slightly below zeta.
4. DH and T-NR exceed the budget at all heights, including N >= 690988. The identity sum D_j = C - A F holds for every a and every q; what is small for zeta is the right side, the defect of the Euler-form multiplier prod(1 - q_p) against the sum over n with a prime factor <= 97. For DH no choice of 25 numbers q_p makes H_j = q_j G_j hold (a(pm) != a(p) a(m): a(4) = -1, a(2)^2 = 0.081); for T-NR the factor at 3 is not 1 - q_3. The excess is visible in the coefficients a(n), n <= 9.

Why closed. The sign twist and the unimodular twist pass with zeta, so not every control fails. The two controls that fail do so because their coefficients are not completely multiplicative, a property read off finitely many coefficients; with a free mollifier DH passes the corresponding modulus test earlier than zeta (section 1.3). Zeta does not pass at every size: it exceeds the budget below N about 3e5. rho has no gap below 1.

## 4. Margin, derivative caps, monotonicity in N

Definitions. delta(N, y) = max over Euler families (primes up to 3, 5, 7, 11) of T(N) - E(N) at t0. Route I (differentiated additive cap, leading order; d/dx of n^(-s*) has modulus (log n)/2 and the reflected term gamma n^(i x/2 log n) has rate (L - log n)/2): D_I = (1/2) sum abs(a) b_t n^-sigma log n + g sum abs(a) b_t n^(y - sigma)(L - log n)/2. Route II (Cauchy with M(r) <= M(0) e^(w r), w = L/2, r* = 1/w): D_II = e w M(0), M(0) = sum abs(a) b_t n^-sigma (1 + g n^y). Panel density D/(pi delta). These caps are MEASURED leading-order forms, not the certified caps of the source.

Finite consequence tested. delta increasing in N above the barrier for zeta; for a control, a negative or non-monotone margin at N where its approximant has no zeros (argument principle on [x, x + 40] x [y0, 1], same evaluator).

Zero-count code and validation (`c4_wind.py`). f_t(x + iy) of Polymath (14) by direct summation, s*, kappa, gamma from mpmath at 40 digits, exact phase reduction. At t = 0 the sum is the Riemann-Siegel main sum of zeta((1 + y - ix)/2): winding numbers on [2T + 0.3, 2T + 40.3] x [-0.6, 0.6] are 23, 30, 37 at T = 1e4, 1e5, 1e6, equal to the number of zeros of zeta with ordinate in the range (mpmath `nzeros`); value error 6.5e-2, 2.6e-2, 1.6e-2 (no Riemann-Siegel correction term).

Result, zeta (`c4_margin.py`, six local runs merged by `c4_merge.py`; `c4_consec.py`). At y0 on 11,351 distinct N: delta(N) > 0 from N = 690,988 on and delta <= 0 at every sampled N <= 690,940, in agreement with the source (first window 690,988). Between consecutive sampled N the best-family margin decreases 626 times, the largest decrease 0.0032, the largest N of a decrease 104,179; all of these have delta < 0. In blocks of 40 consecutive windows (primes <= 11): 16, 13, 14, 8, 9 decreasing steps at N0 = 1e3, 3e3, 1e4, 3e4, 1e5 (largest 2.9e-3 .. 5.3e-7) and none at N0 = 3e5, 690988, 1e6, 2e6, 3.84e6. So the margin is increasing above the barrier in every test made, and it is a sawtooth in N -> N + 1 below N about 1e5 (one new term of size b_t(N+1)(N+1)^-sigma against the gain from sigma).

| y | first N with delta > 0 (167 sampled N; y0: 11,351) | decreases between sampled N | D_II/D_I range | panel density D_I/(pi delta) at 690988 / 3.84e6 |
|---|---|---|---|---|
| 0.03 | none up to 3.84e6 (delta = -0.339 there) | 6 (N <= 1439) | 5.6 .. 6.5 | - |
| 0.10 | 2,644,000 | 0 | 5.9 .. 10.4 | - / 36.8 |
| 0.1809 | 817,355 | 0 | 6.4 .. 18.9 | - / 5.03 |
| 0.18727 (y0) | 690,988 | 626 (N <= 104,179) | 6.5 .. 19.7 | 5.9e6 / 4.58 |
| 0.30 | 200,880 | 0 | 7.3 .. 39.7 | 5.41 / 1.40 |
| 0.40 | 71,100 | 0 | 8.1 .. 61.0 | 2.16 / 0.749 |

Route I against Route II: D_I = 10.37, D_II = 129.0 at N = 690988; 5.17 and 102.0 at 3.84e6. With these leading-order forms the Cauchy cap is 6.5 to 20 times the differentiated cap at y0 (the node records "a few percent" for the panel counts of imp-35832 .. 36141, which use the certified caps and an optimised radius; that comparison was not reproduced). The coupling of the node holds in the form: the panel count is D/(pi delta) and diverges as delta -> 0 at the first window (5.9e6 panels per unit of x at N = 690988).

Result, controls (302 sampled N at y0; `c4_controls_summary.json`, `c4_consec.json`).

| function / mollifier | delta at N = 1e3 | 690988 | 3.84e6 | first sampled N with delta > 0 | largest N of a decrease (sample) | decreasing steps in 40 consecutive windows at N0 = 1e5 / 690988 / 2e6 |
|---|---|---|---|---|---|---|
| ZETA, primes <= 11 | -3.152 | 5.58e-7 | 0.359 | 690,988 | 1481 | 9 / 0 / 0 |
| LCHI5 | -2.706 | 0.0948 | 0.414 | 495,840 | 1481 | 9 / 0 / 0 |
| CHIM3 | -2.518 | 0.161 | 0.469 | 412,594 | 1481 | - |
| CHIM4 | -2.448 | 0.245 | 0.555 | 298,262 | 1481 | - |
| DH, optimised mollifier of (690988, t0), fixed | -2.524 | 0.209 | 0.511 | 330,760 | 2551 | 11 / 0 / 0 |
| DH, no mollifier | -5.687 | -0.249 | 0.293 | 1,316,066 | 1481 | 0 / 0 / 0 |
| DH, real part of the chi-mollifier coefficients | -5.540 | -0.339 | 0.210 | 1,805,711 | 1481 | - |
| TNR, own factor | -5.378 | -0.413 | 0.041 | 3,208,854 | 2075 | 4 / 4 / 5 (and 5 of 40 at N0 = 3,839,960, where delta > 0; largest drop 1.1e-8 against a mean step 4.6e-8) |
| EA, own factors | -27.1 | -13.1 | -6.04 | none | 7893 (71 decreases) | - |

D_II/D_I lies in 5.8 .. 23.6 for every function. SGN, LIOU, U, UA: equal to the zeta row (section 1.1 (i)).

Zero counts of the two-ladder sum in [x, x + 40] x [0.1873, 1], x at fraction 0.37 of window N (for the controls this sum has zeta's gamma factor and window length: a formal object at small t, dominated by the direct ladder at t0 where abs(gamma) <= 0.30 at N = 1000 and 0.08 at N = 690988):

| function | N = 1e3: t0 / 0.10 / 0.05 / 0 | N = 1e4 | N = 1e5 | N = 690988 | min abs f on the boundary at t0 (four N) |
|---|---|---|---|---|---|
| ZETA | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | 0.41, 0.44, 0.55, 0.63 |
| DH | 0 / 0 / 3 / 5 | 0 / 0 / 0 / 5 | 0 / 0 / 0 / 4 | 0 / 0 / 0 / 3 | 0.30, 0.48, 0.61, 0.70 |
| TNR | 1 / 4 / 6 / 8 | 0 / 3 / 7 / 13 | 0 / 0 / 7 / 19 | 0 / 0 / 4 / 18 | 0.007, 0.14, 0.23, 0.32 |
| EA | 7 / 16 / 16 / 15 | 0 / 6 / 16 / 23 | 0 / 2 / 24 / 33 | 0 / 0 / 19 / 36 | 0.011, 0.17, 0.32, 0.42 |
| LCHI5, SGN, U (formal sum) | 0 / 0 / 0..4 / 3..7 | 0 / 0 / 0 / 6..9 | 0 / 0 / 0 / 1..4 | 0 / 0 / 0 / 1..6 | 0.34 .. 0.61 |

Largest step of the argument between consecutive boundary points: at most 0.12 for zeta; up to 3.1 for the controls at t <= 0.05 (those counts are not reliable to +-1); at t0 at most 0.5 except TNR (1.45) and EA (2.18) at N = 1000.

Reading. At t0 the sampled rectangles are free of zeros for every function at N >= 1e4, while the margin at t0 is negative there for zeta (N < 6.4e5), DH (N = 1e5 with its optimised mollifier; N < 330,760 with the fixed one), TNR (N < 3.2e6) and EA (all N). "Negative margin with no zero nearby" holds for zeta and for the controls alike.

Why closed. The margin, both caps and the panel density are functions of abs a(n), N, t, y. They are equal for zeta and every unimodular completely multiplicative twist (PROVED, section 1.1). Monotonicity above the first positive window holds for zeta, L(chi) and DH alike; it fails for T-NR because of the size of its coefficients on multiples of 3 and 9 (a property of a(n)), and E_a never reaches a positive margin.

## 5. Not run, limits

- The gamma factor and window length of each control's own functional equation (conductor 5 for DH and L(chi mod 5), 9 for T-NR, degree 2 for E_a) were not implemented in the evaluator of section 4 or in E; the triangle functional takes only the modulus bound g(N).
- Optimised mollifiers: one support (96 divisors) per function, a local optimiser; larger supports can only lower t*. N = 3.84e6 not run for the optimiser.
- Section 3: 500,001 of the planned 1e6 samples (three of six parts; the server was at load 170 on 48 cores and GPU 1 had under 5 GB free, so the sums ran on CPU). Section 4: the 1e4-point scan was run locally in six parts (11,351 distinct N) after the GPU job on the server produced no output in 55 minutes and was stopped; other heights y on 167 N only.
- Torus search (1.4) at N = 690988: not run. Family "primes <= 19": ladder only.
- The caps D_I and D_II are leading-order forms; the certified caps and the per-panel constant of the source nodes were not reproduced.
- The float64 values of sections 3 and 4 are not interval-certified; the decisive signs of sections 1 and 2 were rechecked in ball arithmetic at N <= 10,000 (section 0) and the zeta value at N = 690988 against the source's Arb certificate. The DH margin 0.209 at N = 690988 is float64 only (far from zero; the same code agrees with the ball computation to 15 digits at N <= 10,000).

## 6. Server use

Compute server through `rhrun` only; units named rh-s3c1*, rh-s3c2*, rh-s3c3p*, rh-s3c4*, rh-s3dh*, rh-s3tor*, rh-s3ctrl*; none left running (checked with `systemctl --user list-units` at the end; two kinds of units were stopped by hand: a GPU job without output and the first, slower optimiser jobs). The server was at load average 170 to 178 on 48 cores and GPU 1 at 85 to 97 GB of 98 GB during the run, and unreachable for about two minutes at 01:41 UTC (it had not rebooted; the units were still running). GPU: section 2 (n <= 1e9) and the zero counts of section 4; the rest on CPU. Local runs through `scripts/memcap.sh 8`.

## Files

`lib.py` (functional, coefficient tables, optimiser); `c1_validate.py`, `c1_run.py` (ladder, t*, controls, optimised mollifiers), `c1_torus.py`, `c2_cover.py`, `c2_tail.py`, `c3_packets.py`, `c4_margin.py`, `c4_wind.py`, `recheck_arb.py`; results `c1_ladder.jsonl`, `c1_tstar.jsonl`, `c1_controls.jsonl`, `c1_dh_*.jsonl`, `dh_lam_690988_t0.json`, `zeta_lam_690988_t0.json`, `c1_torus_*.json`, `c2_cover_1e+09.json`, `c2_cover_2e+07_sieve.json`, `c2_tail.json`, `c3_*_summary.json`, `c3_*.npz`, `c4_wind.json`, `c4_controls_summary.json`, `local_c4/`, `recheck_arb.json`; logs `out_*.txt`.
