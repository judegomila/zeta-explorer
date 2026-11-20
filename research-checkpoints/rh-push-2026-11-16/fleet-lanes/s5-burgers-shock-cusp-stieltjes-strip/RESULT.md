# s5-burgers-shock-cusp-stieltjes-strip: screening of four Burgers-shock / cusp / Stieltjes-strip combinations

Lane `s5-burgers-shock-cusp-stieltjes-strip`, 2026-11-19/20. Screening arm. Labels: PROVED (short argument in this file), CLASSICAL,
MEASURED (float64 unless a line says 30 digits), STRUCTURAL (follows from the definition of the control). No claim about RH or Lambda.
No bound moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | what the finite test turned out to measure | classification |
|---|---|---|---|
| 1 | fold moduli C_ren = y_N^{3/2} abs(m'), C_curv = y_N^{5/2} abs(m'') at the reading strip y_N = sqrt(2 pi/N) | the fixed window (2.2214, 3.3322) is a property of the model density abs(x)^{-1/2} (reproduced to 7 digits). For a zero list the value depends on the reading point: at z0* = i y_N it is y_N^{3/2} times the constant 2 sum 1/gamma^2 = 0.0462100 (decays as N^{-3/4}); at a zero it is y_N^{-1/2} for every list (grows as N^{1/4}); at the closest pair it is a function of g_min/y_N (range 3e-4 to 26 for zeta) | CLOSED: premise false for zeta at every N in 1e3 .. 1.0e8, in every reading; no control fails where zeta passes because zeta does not pass |
| 2 | fold ratio rho -> 2/3 with K = 8 sqrt2/(9 pi), phase winding -(1 + alpha), monotone crossing-time field tau*(y) | rho and K are model facts (reproduced: 0.400140 against 0.4001406). For zero lists rho is 1/2 at a zero, grows like N at i y_N, and ranges over 4e-5 .. 6.3 at the closest pair. The winding rate is -3 on arcs around a zero (triple pole of m'') and +1 on arcs enclosing no zero. tau*(y) is strictly increasing for every real list (PROVED, one line); with off-line zeros it fails only within about 2 b of an off-line pair at height b | CLOSED: premise false for zeta (rho, K, winding); the monotonicity test is passed by every real list and its failure locates an off-line zero to within 2 b |
| 3 | per-N rate of abs(t_c(m_N) - t_c(m_inf)) and proxy residual R_A | t_c(m_N) = 1/(2 M_inf) is the atomic self term: exponent -1/2 for every list (measured -0.48 .. -0.54), the object does not enter. The true collision time is g_min^2/8 of the closest pair (exponent -0.94 for zeta on N = 1e3 .. 1.0e8). R_A = t_proxy - t_c has exponent -1/2, so R_A N^{3/2} grows like N: the bound C_HO/(L N^{3/2}) is false for zeta with any fixed C_HO. D(N) of a control differs from zeta's only through its missing on-line zeros | CLOSED: R_A premise false for zeta; the Route-B rate holds for every list with slack growing like N^{1/4}; the D(N) exponent of DH is its off-line count |
| 4 | Poisson mass of real zeros M(x, Y) against p_req = 4.37426 | M = (1/2) Re xi'/xi(1/2 + Y/2 + i x/2) for zeta. At Y = 0.165, 0.33, 0.4 zeta is below p_req in every window reached (heights 4e7, 1e9, 1e12 from zeros; 1e9, 1e12, 1e15 from primes <= 1e10; minima re-checked with 30 digits). At Y = 1 (the line sigma = 1) zeta is above p_req from height 1e12 on, and so are L(chi_-4), L(chi_5), the sign twist, the unimodular twist, the Liouville twist and T-NR | CLOSED: premise false for zeta inside the strip; at sigma = 1 every Euler-type control passes with zeta |

One further statistic appeared in the data of combination 4 and is recorded in section 5 because it separates some controls: the sign of
the prime-side mass at Y = 0.165. Zeta, L(chi_-4), L(chi_5): 0 negative samples of 1.34e8 at each height. Sign twist, unimodular twist,
Liouville twist: a fraction 3.6e-4 to 3.9e-4 negative at height 1e12. It is the classical criterion Re xi'/xi > 0 on Re s > 1/2 (equivalent
to RH); T-NR and E_a pass it whenever the reading line is to the right of their off-line zeros, so it is not a survivor.

## 1. What was run, where, sizes

| object | size | where |
|---|---|---|
| zeta, first zeros (list of `s1-zero-flow-dynamics`, read only) | 100,116,297 zeros, heights 14.13 to 4.27e7 | server |
| zeta windows at 1e9 (list of `s2-heat-root-drift-forces`) and 1e12 (list of `s3-dyson-burgers-zero-flow`), read only | 1,020,007 and 1,000,004 zeros | server |
| L(s, chi), L(s, chibar) mod 5; DH and alt on-line lists (lists of `s1`) | 946,483 each; 847,701; 698,848; heights to 5.0e5 | server, Mac |
| heat windows at 1e7, tau = 0, -1e-4, -2e-3, -1e-2 (on-line lists of `s1`) | 3.86e6 to 4.02e6 zeros each | server |
| full zero sets below height 2000 (tables of `c12-control-battery-harness`, 30 digits): zeta (1517), DH (1861 + 84 pairs, first off-line ordinate 85.70), heat -0.1 (1435 + 41 pairs, first 415.3), heat -0.5 (929 + 294 pairs, first 111.7), T-NR q = 3, c = 2.2 (1517 + 350 pairs, first 2.86), E_a with a = 1/4 (1517 pairs) | up to 3034 points | Mac (`scripts/memcap.sh 8`) and server |
| primes | all 455,052,511 primes and 10,084 prime powers below 1e10 (segmented sieve, 30 s on 4 cores); log p and T log p mod 2 pi in 80-bit long double for T = 1e9, 1e12, 1e15 | server |
| prime side, per run | 134,217,728 sample points t_j = T + 0.02 j (window of length 2.68e6), one non-uniform FFT of size 2^28 per width on GPU 1 | server |
| prime-side runs | zeta at T = 1e9, 1e12, 1e15 (widths Y = 0.165, 0.33, 0.4, 1); zeta at 1e12 with first and second derivative at distances 2.5e-4 (y_N for N = 1e8), 7.9e-3 (N = 1e5), 0.0825, 0.2, 0.5; L(chi_-4), L(chi_5), sign twist, unimodular twist, Liouville twist at 1e12; L(chi_5) and sign twist at 1e15 | server |
| combination 1, 2 ladders | N = 1e3 .. 1.0e8 (17 rungs + full list), four readings, arcs of 193 points; fine ladder of 2001 values of N; all lists above; tables | server (GPU 1 for the sums), Mac |
| combination 3 | collision time of the N-particle flow for N = 1e3 .. 1.0e8 (zeta, 17 rungs), to 9.5e5 (chi, chibar), 8.5e5 (DH), 7.0e5 (alt): block of 501 zeros around each of the 12 best candidate pairs, the other zeros frozen (linearised field of the 4e5 nearest); full pairwise flow at N = 50 .. 1e4 for validation; full complex-particle flows of the tables | server (zeta), Mac (other lists) |
| combination 4, zero side | 1.95e7 to 3.66e7 grid points per list (step 0.0125 in t), four widths, 256 zeros on each side exactly and the rest by the smooth density | server (GPU 1) |
| 30-digit re-checks (mpmath, Riemann-Siegel) | minima at heights 1e9 (4 points), 1e12 (8 points), 1e15 (3 points) | server, Mac |

Server through `rhrun` only, units `rh-s5bs-*`, at most 8 cores and 12 GB in total at any time, cupy pool 6 to 24 GB. The server load
average was 80 to 105 on 48 cores during the runs.

Not reached, stated and not estimated:
- Combination 3 at N = 1e8 was reached on the third unit: the first was killed by its 7 GB memory limit, the second ran N = 5e7, the
  third ran the full list under the same limit after the counting function and the candidate array were computed in blocks. The
  particle flow itself is not a full pairwise flow above N = 1e4 (block method, validated at N <= 1e4 only).
- T-NR at q = 1000003 on the GPU: two attempts ended with a device out-of-memory error (GPU 1 was at 63 to 65 GB of 98 with other jobs).
  Its statistic is the zeta column plus a closed-form term, which is computed exactly in `tnr_factor.py` (section 4.4).
- DH and heat full zero sets above height 2000: off-line zeros are tabulated only below 2000, so "far from every off-line pair" is
  decided only there. The DH and heat lists above 2000 are on-line lists.
- Derivative columns (combination 1 prime side) for the twisted objects were not run.

## 2. Definitions used and validation

Sources read as text: `src/data/imp-33645-h3-curvature-divergence-scoping.js`, `imp-36082-routeB-perN-rate-form-and-bridge-consumability.js`,
`imp-95372-ra-proxy-true-gap-assessment.js`, `dyson-burgers-shock.js`, `rh-bridge-mirror-descent-2026-09-25.js`, the node records of
`engine/IDEA_GRAPH.json`, and `push/s3-dyson-burgers-zero-flow/RESULT.md` (its combination 2 and 4 already established that C_ren at the
closest pair is a closest-pair statistic and that the sup-norm discrepancy at y_N is an atom reading; this lane adds C_curv, rho, the
phase, the reading point i y_N, the prime side, the collision-time rates and the Poisson mass).

- m_N(z) = sum_{k <= N} 1/(gamma_k - z), m' = sum 1/(gamma - z)^2, m'' = 2 sum 1/(gamma - z)^3, y_N = sqrt(2 pi/N),
  C_ren = y_N^{3/2} abs(m'), C_curv = y_N^{5/2} abs(m''), rho = C_ren/C_curv.
- Readings: O: z0* = i y_N with the symmetric set (gamma and -gamma); P: z0* = x* + i y_N, x* the midpoint of the closest pair among the
  first N; Z: z0* = gamma_{N/2} + i y_N; Ms: z0* = midpoint near gamma_{N/2} + i (8 mean spacings).
- Arc: z = x* + y_N e^{i theta}, theta in [0.02 pi, 0.98 pi], winding rate = slope of arg(-m'') in theta.
- tau*(y) = y/(2 Im m(x + i y)).
- Flow: dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j); t_c(N) = first collision time; M_inf(N) = sup_x Im m_N(x + i y_N);
  t_proxy = 1/(2 M_inf) = t_c(m_N); R_A = abs(t_c - t_proxy); D(N) = pi max_{k <= N} abs(S(gamma_k)) / (N y_N) (the Koksma-Hlawka form of
  imp-36082 with the measured maximum of abs(S) in place of C log gamma_N); C_W(N) = t_proxy/sqrt(D) (since t_c(m_inf) = 0).
- Coordinates of H_t: zeros r = 2 gamma, x = 2 t, Y = 2 delta. M(x, Y) = sum_r Y/((x - r)^2 + Y^2)
  = (1/2) sum_gamma delta/((t - gamma)^2 + delta^2), mean (1/4) log(q t/2 pi). When all zeros are real, M = (1/2) Re xi'/xi(1/2 + delta + i t).
  The mirror kernel of the source, 2y/(Delta^2 + 4y^2) at y0 = 0.165, is the Poisson kernel of width Y = 0.33; the widths of the task
  (0.165, 0.4, 1) and Y = 0.33 were all run.
- Prime side: G_k(s) = sum_{n = p^j <= X} eps(n) Lambda(n) (log n)^k n^{-s} w(log n/log X), X = 1e10, w = 1 on [0, 2/3] and C-infinity
  decreasing to 0 on [2/3, 1]. PROVED (contour shift; K(z) = (1 + E(z log X))/z, E(zeta) = int w'(v) e^{-zeta v} dv, abs(E) <= e^{-(2/3) Re zeta}):

      sum_rho K(s - rho) = -G_0(s) + K(s - 1) + 1/s - (1/2) log pi + (1/2) psi(s/2),      sum_rho K'(s - rho) = G_1(s) + O(1/t),      sum_rho K''(s - rho) = -G_2(s) + O(1/t^2).

  So M_K(t) := (1/2) Re sum_rho K(s - rho) = (1/2)[(1/2) log(q t/2 pi) - Re G_0] and M = M_K - (1/2) Re sum_rho E((s - rho) log X)/(s - rho).
  The correction is a sum over the zeros within a few units of t and has relative size X^{-(2/3) delta}: 2e-4 at Y = 1, 0.05 at Y = 0.4,
  0.08 at Y = 0.33, 0.28 at Y = 0.165. The primes to 1e10 compute the K-smoothed mass exactly; it equals the Poisson mass only when
  delta log X is large.
- Twists: chi_-4, chi_5 = Legendre symbol mod 5; sign twist eps_p = +-1 from a fixed 64-bit hash of p, completely multiplicative on
  prime powers; unimodular twist eps_p = e^{2 pi i h(p)} from the same hash; Liouville eps = -1 (the object zeta(2s)/zeta(s)). For the
  twisted objects M_K is formed with zeta's archimedean term.

Validation (all pass):

| check | result |
|---|---|
| model density abs(x)^{-1/2} on [-1, 1] (`c12.py model`) | eps^{5/2} abs(m'') -> 3.332162 (source 3.3322); eps^{3/2} abs(m') -> 2.221441 = pi/sqrt 2; rho -> 0.66666667; (rho - 2/3)/eps^{3/2} -> 0.400140 (closed form 0.4001406); winding rate of the m' amplitude -1.4999995 (source -(1 + alpha) = -3/2), of m'' -2.5000000; arg(-A) at pi/2: 1e-16 |
| reading O against the completed function (`origin_fs.py`, mpmath 30 digits, derivatives of log xi at 1/2 + y_N) | C_curv: 6.254e-08, 1.978e-11, 1.1123e-16 at N = 1e3, 1e5, 1e8; zero side 6.254e-08, 1.978e-11, 1.112e-16. C_ren: 1.0312e-03, 3.2611e-05, 1.8339e-07; zero side 9.991e-04, 3.258e-05, 1.834e-07 (the difference is the tail 2 sum_{gamma > gamma_N} gamma^{-2}) |
| collision time against the recorded values (`c3.py validate`, full pairwise flow) | N = 50, 100, 200, 500, 2458: 0.0957472909, 0.0701183035, 0.0326830478, 0.0123271237, 0.00119231277 against 0.0957473, 0.0701183, 0.0326830, 0.0123271, 0.00119231 (relative 1e-7 to 2e-6) |
| block method against the full flow | relative 3e-14, 6e-15, 3e-5, 2e-7, 8e-11 at N = 50 .. 2458; 1.4e-9 at N = 5000; 7e-11 at N = 1e4 |
| zero-side Poisson mass against mpmath Re xi'/xi (`c4.py validate`) | 16 points at heights 2e4 .. 4e4, four widths: differences 1e-7 to 2e-6 |
| non-uniform FFT against direct sums over all 4.55e8 primes | 4 points per run, 12 runs: at most 1.9e-6 |
| explicit formula, small case (X = 1e6, T = 1000, zeros below 4000 + mpmath) | prime side against sum_rho K(s - rho): 9e-6 (Y = 1), 3e-4 (Y = 0.4), 1.2e-3 (Y = 0.165) |
| explicit formula at height 1e12 and 1e9 (`c4.py cmp`, 1500 random points inside the zero windows) | M_K from primes against M_K from zeros: max 2e-5 (Y = 0.165), 4e-5 (0.33), 5e-5 (0.4), 1.1e-4 (1) at 1e12; 1e-5 to 5e-5 at 1e9. First derivative: max 4.9e-4 on values of size 2 to 151. Second derivative: max 3.7e-3 on values of size 10 to 2334 |
| 30-digit re-check of the minima | 1e9: list 0.71372768, 1.38133590, 1.64203644, 3.21910827 against mpmath 0.71372770, 1.38133596, 1.64203650, 3.21910840. 1e12, Y = 1, prime-side minimum (outside the zero window): 4.793999 against mpmath 4.793988. 1e15, Y = 1: 6.498272 against 6.498213 |
| prime count | 455,052,511 = pi(1e10) |

## 3. Results table

Sizes: zero side to N = 1.0e8 (first zeros) and windows of 1e6 zeros at 1e9 and 1e12; prime side X = 1e10, 1.34e8 samples per window at
1e9, 1e12, 1e15. "same as zeta (S)" = structurally identical because the on-line list of the control is zeta's list.

| combination | statistic | sizes | zeta | L(chi) | zeta(s+a)zeta(s-a) | T-NR | DH | heat tau < 0 | sign / unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | C_ren, C_curv at i y_N (reading O) | N = 1e3 .. 1.0e8 | 9.99e-4 -> 1.83e-7; 6.25e-8 -> 1.11e-16 (exponents -3/4, -7/4) | chi mod 5, N = 1e3 .. 9.5e5: 3.79e-3 -> 2.25e-5; 1.64e-6 -> 1.0e-11 | analytic at the origin: same power laws (S) | same as zeta times an analytic factor (S) | on-line list: 4.29e-3 -> 2.76e-5; 2.94e-6 -> 2.2e-11 | not run at the origin (windows at 1e7) | no zero list; prime side at distance y_N: K-smoothed values only | premise false for zeta |
| 1 | C_ren, C_curv at the closest pair (P) | same; fine ladder 2001 values of N | 3.2e-4 .. 26.4; 0.58 .. 62.9; inside [2.2215, 2.2510]: 0.35 % of N; C_curv within 10 % of 3.3322: 6.1 % | 7e-6 .. 11.6; 0.009 .. 19.7; 0.55 %; 3.7 % | no real zeros | same as zeta (S) | 4.8 .. 33.6; 4.9 .. 58.5; 0 %; 0 % | tau = -1e-2: 7.1 .. 55.6; 14.2 .. 110; 0 %; 0 % | not defined | premise false for zeta |
| 1 | C_ren, C_curv at a zero (Z) | same | y_N^{-1/2}: 3.51 -> 63.16; 2 y_N^{-1/2}: 7.10 -> 126.3 | 3.33 -> 19.7; 7.04 -> 39.4 | no real zeros | same as zeta (S) | 3.44 -> 19.2; 7.09 -> 38.3 | 3.05 -> 28.0; 6.84 -> 56.0 | not defined | the object does not enter |
| 1 | prime side against zero side at distance y_N (T = 1e12) | 1.34e8 samples; 1500 comparison points | prime side = K-smoothed zero sum to 5e-4 (m'), 4e-3 (m''). Against the atoms: C_ren median 5.8e-4 (primes) and 1.3e-3 (atoms), maximum 1.8e-3 and 45.5; ratio atoms/primes up to 1.7e5 for m' and 5.3e7 for m'' at y_N(1e8); median ratio 1.0001 only at distance 0.5 | not run with derivatives | - | - | - | - | not run with derivatives | agreement at y_N needs log X of order 1/y_N = sqrt(N/2 pi) |
| 2 | rho | N = 1e3 .. 1.0e8 | O: 1.6e4 -> 1.6e9; Z: 0.494 -> 0.500; P: 4.3e-5 .. 6.3, within 10 % of 2/3 for 3.2 % of N | Z 0.5; P 1.4e-6 .. 579, 2.7 % | - | same as zeta (S) | Z 0.5; P 0.51 .. 1.93, 12.8 % | Z 0.5; P 0.50 .. 0.56 (tau = -1e-2), 0 % | - | premise false for zeta |
| 2 | winding rate of arg(-m'') | same; tables | O: +1.00 (total +3.016 rad); Z: -3.000; P: -4.67 .. +0.45; midpoint arcs enclosing no zero (height < 2000): median +0.997, range 0.06 .. 0.999. Never -(1 + alpha) = -3/2 (m') or -5/2 (m'') | Z -3.00; P -4.66 .. -0.42 | arcs below an off-line zero: +1.06 (radius 0.5 b), -5.06 (1.1 b) | midpoint arcs: median +0.988 | Z -3.00; midpoint arcs median +0.997; around an off-line zero: +1.06 inside, -5.06 once the arc encloses it | same pattern | - | premise false for zeta; a change of winding = a zero enclosed |
| 2 | monotone tau*(y) | tables, 300 x per list; 76 to 315 off-line pairs | monotone at 300 of 300 x (PROVED for every real list) | PROVED | not monotone at every x (off-line pairs at every ordinate, b = 1/4) | non-monotone within 1 b of a pair (315 of 315 at 0, 90 at 1 b, 0 at 2 b and beyond); 0 of 455 far points | non-monotone at 76 of 76 pairs at horizontal offset 0, 0.5 b, 1 b; 58 at 2 b; 0 at 3 b, 5 b; violation heights y <= 1.43 b; 0 of 1382 points further than 5 b from every pair | tau = -0.1: 39 of 39 up to 2 b, 0 at 3 b; 0 of 1473 far points | - | failure = an off-line zero within about 2 b |
| 3 | exponent of t_proxy = t_c(m_N) | N = 1e3 .. 1.0e8 (zeta), .. 9.5e5 | -0.492; M_inf y_N in [1.06, 1.46] | -0.477, -0.500 | no real zeros | same as zeta (S) | -0.501; M_inf y_N in [1.64, 1.99] | not run (windows) | - | atomic self term; the object does not enter |
| 3 | exponent of the true t_c; R_A N^{3/2} | same | -0.94; t_c = g_min^2/8 to 0.1 %; R_A N^{3/2}: 930 (N = 1e3), 1.0e5 (1e5), 1.13e7 (1e7), 1.05e8 (1e8) | -0.88, -1.03; 9.8e5, 1.06e6 at 9.5e5 | - | same as zeta (S); with the factor zeros (q = 3 table) t_c changes by 2.8e-3 | -0.99; 5.5e5 at 8.5e5; full set below 2000: t_c changes by 4e-7 | table tau = -0.1: 5e-7; -0.5: 1.6e-4 | - | R_A bound false for every list including zeta |
| 3 | D(N), C_W = t_proxy/sqrt(D) | same | max abs S 1.23 -> 2.14; D exponent -0.45; C_W 0.148 -> 0.0064 (exponent -0.27) | S 1.28 -> 1.86; -0.44; C_W 0.11 -> 0.022 | - | zeta's values against zeta's main term (S) | on-line list: S = -67 (N = 1e3), -957 (1e4), -98,780 (8.5e5); D exponent +0.56; below 2000: max abs S 167.9 on-line, 1.22 with the 84 off-line pairs added back | not run | - | D differs only through the missing on-line zeros |
| 4 | min M, fraction below p_req, Y = 0.165 / 0.33 / 0.4 | zeros: 4e7, 1e9, 1e12 (2e7 to 3e7 points each); primes: 1.34e8 points at 1e9, 1e12, 1e15 | 1e12 zeros: min 1.24 / 2.36 / 2.78, below p_req 19.5 % / 2.55 % / 0.84 %, every block of 65536 points fails; 1e15 primes (M_K): 2.6 % / 9.8e-5 / 2.0e-6, 2048 / 1572 / 52 of 2048 blocks fail | chi_5, 1e12 primes: 9.8 % / 0.84 % / 0.16 %; 1e15: min 1.44 / 3.80 / 4.383 (Y = 0.4: 0 of 1.34e8 K-smoothed samples below; the kernel correction at this width is up to 0.14) | no real zeros: M_real = 0; full set negative on 30 % / 24 % / 19 % of x (a = 1/4) | real zeros = zeta's (S); full set adds 3.43 .. 15.6 / 5.53 .. 8.70 / 6.02 .. 7.95 | on-line list at 4e5 .. 5e5: mean 0.894 of the full mean, min at a gap of 8.7 mean spacings; below 2000 the far-point minimum is lower than zeta's and lies in the gap of an off-line pair (4.4) | tau = -1e-2: mean 0.961 of the mean, min at a gap of 8.2 | sign: 13.7 % / 2.29 % / 0.80 %, min -4.48 / 0.60 / 1.70; unimodular: 13.7 % / 2.28 % / 0.80 % | premise false for zeta |
| 4 | same, Y = 1 | same | below p_req: 92 % at 4e7, 14 % at 1e9, 0 at 1e12 (min 4.9535 zeros, 4.7940 primes; 30 digits: 4.95346, 4.79399), 0 at 1e15 (min 6.498) | 0 at 1e12 (chi_-4 min 5.43, chi_5 min 5.32) and 1e15 (7.04) | full set positive, mean doubled | passes: adds 6.89 .. 6.92 | cannot be decided at 1e12 (no list); at 5e5 the mean is below p_req for every object | same | sign: 0 below, min 4.80; unimodular: min 4.74; Liouville: min 4.77 | at sigma = 1 every Euler-type control passes with zeta |

## 4. Per combination

### 4.1 Combination 1: C_ren and C_curv

Finite consequence tested: both constants inside a fixed window for N = 1e3 .. 1e8. Survival would have needed zeta inside the window at
every N and a control outside it below its off-line count.

1. Model. The window values come from rho(x) = abs(x)^{-1/2} on [-1, 1] read at i eps: eps^{3/2} abs(m') -> pi/sqrt 2 = 2.221441 and
   eps^{5/2} abs(m'') -> 3.332162 (reproduced). The density of zeta zeros, log(T/2 pi)/(2 pi), has no point with a Hoelder-1/2 cusp.
2. Reading O (z0* = i y_N, the literal reading). s = 1/2 + y_N is real and at distance 14.13 from every zero, so m is analytic there:
   m'(i y) -> 2 sum_{gamma > 0} gamma^{-2} = 0.04620999 (CLASSICAL; equal to (log xi)''(1/2), computed here to 30 digits) and
   m''(i y) = 12 i y sum_{gamma>0} gamma^{-4} (1 + O(y^2)). Hence C_ren = 0.0462 y_N^{3/2} and C_curv is of order y_N^{7/2}: both tend to 0 (PROVED).
   Measured: C_ren 9.99e-4 at N = 1e3, 1.83e-7 at N = 1.0e8; C_curv 6.25e-8 and 1.11e-16. The object enters through two constants of its
   completed function at the centre; every control that is analytic and non-zero at s = 1/2 has the same power laws.
3. Reading Z (at a zero). One atom at distance y_N: m' = -1/y_N^2 + O(rho^2), so C_ren = y_N^{-1/2} (1 + O((y_N rho)^2)) and C_curv = 2 y_N^{-1/2}:
   3.51 and 7.10 at N = 1e3, 63.16 and 126.3 at N = 1.0e8, for every list (zeta, chi, DH, heat) to three digits. The object does not enter.
4. Reading P (closest pair). Two atoms at -g/2, +g/2: closed form in g/y_N, which reproduces the full sum to 1 % on the rungs checked (2.288 against 2.29 and 62.92 against 62.9 at N = 1.0e8). Zeta:
   C_ren between 3.2e-4 and 26.4 and C_curv between 0.58 and 62.9 over 2001 values of N; inside the band of the source for 0.35 % of N.
5. Mesoscopic reading (8 mean spacings above the line): C_ren 0.06 .. 0.25, C_curv 0.06 .. 0.72 with no power law; the smooth density
   contributes pi rho'(x), which is of order 1/x.
6. Prime side at distance y_N from the line (T = 1e12, primes <= 1e10, 1.34e8 points). The prime sums G_1, G_2 equal the K-smoothed zero
   sums (verified: 5e-4 and 4e-3 on 1500 points). At delta = y_N(1e8) = 2.5e-4 the K-smoothed values are C_ren median 5.8e-4, maximum
   2.3e-3 over 1.34e8 points; the atom values at the same points are median 1.3e-3, maximum 45.5 (1500 points), and the ratio atoms/primes
   reaches 1.7e5 (m') and 5.3e7 (m''). Median ratio atoms/primes for m': 1.0001 at delta = 0.5, 1.05 at 0.2, 1.83 at 0.0825, 3.6 at 7.9e-3,
   3.3 at 2.5e-4 (for m'': 1.0002, 1.23, 3.2, 4.4, 3.9).
   Agreement at y_N needs y_N log X of order 1, that is log X of order sqrt(N/2 pi): X = e^{4000} at N = 1e8 (PROVED from the bound on E).

Controls and onsets. T-NR and E_a have zeta's on-line list or no on-line list. DH and the heat lists differ from zeta in reading P because
their closest pairs are closer (g/y_N 0.4 to 0.7 for DH, 0.03 to 0.15 for tau = -1e-2, against 0.9 to 2.7 for zeta): the small-gap law of
pairs about to leave the line, as in `s1-zero-flow-dynamics` and `s3-dyson-burgers-zero-flow`. No control fails where zeta passes.

### 4.2 Combination 2: rho, K, phase, tau*

1. rho and K. Model: rho -> 2/3 and (rho - 2/3)/eps^{3/2} -> 0.400140 = 8 sqrt2/(9 pi); the eps^{3/2} term is the truncation of the
   density at abs(x) = 1 (tail of m' of relative size (4/3) eps^{3/2}/(pi/sqrt 2); the tails of m'' cancel by parity). Zero lists: rho = 1/2 at a
   zero (0.494 at N = 1e3, 0.500 from N = 1e5 on), rho proportional to N at i y_N (1.6e4 .. 1.6e9), and at the closest pair
   rho = g^2/(24 y_N^2) (1 + ...) for g >> y_N (PROVED from the two-atom form), measured 4.3e-5 .. 6.3. There is no coefficient K to reproduce:
   rho - 2/3 is not small. The discrepancy bound does not help, because at height y_N the transform is not within the discrepancy of the
   smooth one (it is one or two atoms).
2. Phase. Model: arg(-A) = 3 pi/4 - 3 theta/2 for the m' amplitude (rate -1.4999995) and rate -5/2 for m''. Zero lists: -3.000 on arcs
   around a zero for every list (a triple pole), +1.00 at i y_N (m'' is proportional to z there), median +0.997 on arcs of radius y_N
   around gap midpoints that enclose no zero, and between -4.67 and +0.45 at the closest pair. For full sets with off-line zeros the rate on
   an arc centred below an off-line zero is +1.06 at radius 0.5 b and -5.06 at radius 1.1 b: the rate changes when the arc encloses the
   zero (argument principle for m''). On arcs that enclose none of its off-line zeros a control has the same rates as zeta.
3. tau*(y). PROVED: for real points tau*(y) = 1/(2 sum_k 1/((x - gamma_k)^2 + y^2)), and every term of the sum decreases in y, so tau* is
   strictly increasing for every real list and every x. The object does not enter. With an off-line pair gamma0 +- i b the two terms are
   (y - b)/((x - gamma0)^2 + (y - b)^2) + (y + b)/(...), and monotonicity fails only for abs(x - gamma0) below about 2 b and y below 1.43 b
   (measured on DH, heat -0.1, T-NR: 100 % of pairs at offsets 0 .. 1 b for DH and heat, 76 % at 2 b for DH, 0 at 3 b and 5 b; the isolated
   failures at 10 b and 20 b are points that lie within 2 b of another pair; for heat -0.5, with 294 pairs below 2000 and b up to 0.67,
   6 % to 21 % of the offsets 3 b .. 20 b fail for the same reason). 0 failures among 1382 (DH), 1473 and 773 (heat), 455 (T-NR) points further than
   5 b from every pair. A failure of monotonicity at (x, y) therefore exhibits an off-line zero within distance 2 b: verified height.

### 4.3 Combination 3: collision-time rates

| list | N range | exponent of t_proxy | exponent of t_c | exponent of R_A | R_A N^{3/2} at the top | exponent of D | C_W at bottom / top | first collision = closest pair |
|---|---|---|---|---|---|---|---|---|
| zeta | 1e3 .. 1.0e8 | -0.492 | -0.943 | -0.487 | 1.05e8 | -0.454 | 0.148 / 0.0064 | 15 of 17 rungs |
| chi | 1e3 .. 9.5e5 | -0.477 | -0.881 | -0.470 | 9.8e5 | -0.444 | 0.111 / 0.0219 | 7 of 10 |
| chibar | 1e3 .. 9.5e5 | -0.500 | -1.029 | -0.478 | 1.06e6 | -0.451 | 0.155 / 0.0238 | 8 of 10 |
| DH on-line | 1e3 .. 8.5e5 | -0.501 | -0.992 | -0.500 | 5.5e5 | +0.561 | 0.0134 / 6.1e-5 | 9 of 10 |
| alt on-line | 1e3 .. 7.0e5 | -0.538 | -1.231 | -0.533 | 4.9e5 | +0.451 | 0.0053 / 4.4e-5 | 7 of 10 |

1. t_c(m_N) = 1/(2 M_inf(N)) with M_inf(N) = sup_x sum_k y_N/((x - gamma_k)^2 + y_N^2) >= 1/y_N. Measured M_inf y_N between 1.06 and 1.46 for
   zeta and between 1.6 and 2.0 for DH (a second atom at distance of order y_N). So t_proxy = c(N) sqrt(pi/(2N)) with c in [0.5, 0.9]: the
   exponent is -1/2 for every list and the constant is the closest pair measured in units of y_N. The Route-B bound
   abs(t_c(m_N) - t_c(m_inf)) <= C' sqrt(log gamma_N) N^{-1/4} holds on the ladder with t_proxy N^{1/4}/sqrt(log gamma_N) = 0.068 (N = 1e3)
   decreasing to 0.0025 (N = 1e8). C_W = t_proxy/sqrt(D) is 0.148 at N = 1e3, 0.0064 at N = 1e8, and decreases like N^{-1/4}: any constant above 0.15 works for
   zeta on this ladder, and the bound is not sharp at any N (the left side is the atomic term, not a fold modulus).
2. True collision time: the first collision is the closest pair on 15 of 17 rungs for zeta and t_c = g_min^2/8 to 0.1 % on those rungs
   (t_c = 3.383e-8 at N = 1e8, closest pair of length 5.2e-4 at index 41,820,580, height about 1.9e7). Exponent -0.94 for zeta on N = 1e3 .. 1e8 (the minimal gap among N zeros; the GUE small-gap law gives -2/3 in unfolded units plus the
   growth of the density).
3. R_A = t_proxy - t_c is within 1 % of t_proxy from N = 1e5 on (t_c is 100 to 3000 times smaller), so its exponent is -1/2 and
   R_A N^{3/2} = 930, 9.2e3, 1.0e5, 1.07e6, 1.13e7, 1.05e8 at N = 1e3 .. 1e8. A bound C_HO/(L N^{3/2}) with fixed C_HO is false for zeta (MEASURED;
   it follows from M_inf y_N <= 2 and t_c <= g_min^2/6). The proxy and the particle time are different objects at every N.
4. D(N). Zeta and chi: max abs(S) between 1.2 and 1.95, D exponent -0.45. DH on-line list against the full main term: S(gamma_N) = -67,
   -957, -10,823, -98,780 at N = 1e3, 1e4, 1e5, 8.5e5, so D grows like N^{0.56}. Below height 2000, where the off-line zeros are tabulated:
   max abs(S) = 167.9 for the on-line list and 1.22 after adding 2 for each of the 84 off-line pairs; D = 4.88 and 0.035. D(N) for DH
   differs from zeta's only through the missing on-line zeros (MEASURED below 2000, STRUCTURAL above). The exponent of D for DH differs
   from zeta's from the first rung, N = 1e3, which is above its first off-line pair (ordinate 85.7, on-line index about 44): the onset is
   the off-line count itself.
5. Full sets with off-line pairs (complex-particle flow, tables): t_c changes by 4e-7 (DH), 5e-7 (heat -0.1), 1.6e-4 (heat -0.5), 2.8e-3
   (T-NR q = 3) relative to the on-line list alone, and the colliding pair is the same. The collision time does not see the off-line zeros.

### 4.4 Combination 4: Poisson mass of real zeros

Finite consequence tested: min over x of M(x, Y) >= p_req = 4.37426 in every window above the height where the mean (1/4) log(x/4 pi)
exceeds p_req (x > 5.0e8, t > 2.5e8). Survival would have needed that for zeta at every height reached and a control deficit further
than 5 Y from every off-line pair.

Zeta, zero side (grid step 0.0125 in t; minima re-checked with 30 digits at 1e9 and 1e12):

| window | mean | Y = 0.165: min, below p_req | Y = 0.33 | Y = 0.4 | Y = 1 |
|---|---|---|---|---|---|
| 4.2e7 (last 1e6 of the first 1.0e8 zeros; mean below p_req) | 3.93 | 0.527, 61 % | 1.026, 65 % | 1.224, 70 % | 2.491, 92 % |
| 1e9 | 4.72 | 0.714, 48 % | 1.381, 36 % | 1.642, 33 % | 3.219, 14 % |
| 1e12 | 6.45 | 1.242, 19.5 % | 2.359, 2.55 % | 2.776, 0.84 % | 4.9535, 0 |

Zeta, prime side (X = 1e10, 1.34e8 samples per window; K-smoothed mass, which differs from M by the local correction of section 2):

| window | mean | Y = 0.165 | Y = 0.33 | Y = 0.4 | Y = 1 |
|---|---|---|---|---|---|
| 1e9 | 4.72 | min 0.286, 39 % | 1.337, 34 % | 1.617, 33 % | 3.176, 14.1 % |
| 1e12 | 6.45 | 0.757, 13.8 % | 2.293, 2.51 % | 2.677, 0.86 % | 4.7940, 0 |
| 1e15 | 8.18 | 1.261, 2.6 % | 3.341, 9.8e-5 | 3.872, 2.0e-6 | 6.4983, 0 |

At Y = 0.33 the two sides give 2.55 % (zeros) and 2.51 % (primes) at 1e12; standard deviations 1.0365 and 1.0273. The 30-digit values at
the prime-side minima are 2.2800 (Y = 0.33, 1e12), 2.6631 (Y = 0.4, 1e12), 3.3159 and 3.8538 (1e15): below p_req in exact arithmetic.

1. Inside the strip (Y = 0.165, 0.33, 0.4) zeta fails the premise at every height reached, including 1e15. The standard deviation of M
   does not depend on the height (2.04 to 2.10, 1.03 to 1.04, 0.85 at the three heights) while the mean grows like (1/4) log t; the minimum sits in the
   largest gap of the window (3.2 to 3.8 mean spacings). In particular the all-x lower bound M >= p_req at the mirror width Y = 0.33
   (node `mirror-descent-b1`, y0 = 0.165) is false at t = 0 on 2.55 % of x at height 1e12 and on 1e-4 of x at 1e15 (MEASURED, minima
   exact). The source already records the constant-p form as needing a local surplus; this is the direct measurement.
2. At Y = 1 (sigma = 1) zeta passes from 1e12 on: min 4.95 (zeros), 4.79 over 1.34e8 samples (primes), 6.50 at 1e15. The statement is
   -Re zeta'/zeta(1 + i t) <= (1/2) log(t/2 pi) - 8.75, a bound on the line sigma = 1, where the Euler-type prime sum controls the function.
3. Controls at Y = 1, height 1e12: L(chi_-4) min 5.43, L(chi_5) 5.32, sign twist 4.80, unimodular twist 4.74, Liouville twist 4.77
   (zeta(2s)/zeta(s), which has poles and no zeros on the critical line), T-NR: zeta's mass plus 6.89 to 6.92. All pass. The statistic at
   sigma = 1 does not distinguish zeros on the line from poles on the line or from no functional equation.
4. DH and heat. On-line lists: the mean of M is 0.894 of the full mean for DH at heights 3.6e5 .. 5e5 and 0.9961, 0.9606 for
   tau = -2e-3, -1e-2 at 1e7 (the on-line fraction); minima sit in gaps of 8.2 to 8.7 mean spacings, where pairs have left the line.
   Below 2000, at points further than 5 Y from every off-line pair (`far_min.py`): mean ratio 0.949 / 0.971 / 0.976 / 0.990
   (Y = 0.165 / 0.33 / 0.4 / 1) for DH against 1.000 for zeta. Minimum ratio at far points: DH 0.043 / 0.102 / 0.141 / 0.529,
   heat -0.1 0.021 / 0.043 / 0.057 / 0.358, heat -0.5 0.007 / 0.014 / 0.018 / 0.206; over all x on the same heights zeta has
   0.066 / 0.132 / 0.159 / 0.377 and L(chi mod 5) has 0.085 / 0.169 / 0.203 / 0.463. So by the letter of the criterion DH and heat do show
   a deficit at far points for Y <= 0.4. Its location: in all nine cases the minimum lies in the same gap of real zeros as an off-line
   pair, at 0.37 to 0.99 mean spacings from it, and that gap is 3.0 to 8.2 mean spacings long (the longest gap of zeta and of L(chi) on
   these heights is 1.95). At heights below 2000 the mean spacing is about 1 and 5 Y is 0.4 to 1.0 in t, so "further than 5 Y" is still
   inside the gap the pair left. At Y = 1 the far minimum of DH (0.529) is above the minimum of L(chi) (0.463); for heat -0.1 it is 0.358
   against 0.377 for zeta, at 2.6 in t from a pair, where the Lorentz tail of the missing pair is 0.064 of the mean. The deficit is the
   missing pair counted in a window of a few mean spacings. Full sets: the mass including off-line zeros is negative only near pairs with b > delta (1.3 % of x for DH at
   Y = 0.165) and at no point further than 5 Y from every pair (one grid point of 138,000 for heat -0.5 at Y = 0.165).
5. Palm baseline. Mass of real zeros at the ordinate of an off-line pair, in units of the mean: DH 0.064 / 0.126 / 0.152 / 0.338
   (72 pairs; maximum 0.115 / 0.219 / 0.258 / 0.479); heat -0.1: 0.046 / 0.091 / 0.110 / 0.258. The pair-excluded mass at the midpoint of
   an adjacent real pair is 0.051 / 0.100 / 0.121 / 0.281 for DH and 0.044 / 0.088 / 0.106 / 0.253 for zeta at the same heights. So around
   the off-line zeros of DH the real-zero mass is 1.20 to 1.26 times the pair-excluded baseline (heat -0.1: 1.07 to 1.08) and 5 % to 34 % of
   the mean; the surplus factor 1.73 of the source is not present at any of the 72 + 39 pairs (at these heights the mean itself is below
   p_req, so only the ratios are meaningful).
   For zeta the hypothesis concerns off-line zeros, of which there are none in the range reached: it is vacuous there.
6. E_a, a = 1/4: no real zeros, M_real = 0 at every x; every x is within 5 Y of an off-line pair, so the criterion of the task does not
   apply. The full mass is M_zeta(Y - 1/2) + M_zeta(Y + 1/2), negative on 30 % / 24 % / 19 % of x at Y < 1/2.
7. T-NR, q = 1000003, c = 2.2: off-line zeros at b = 0.0321 (Y = 0.064), ordinates (2k + 1) 0.2274. Real zeros = zeta's. The factor adds
   between 3.43 and 15.56 (Y = 0.165), 5.53 and 8.70 (0.33), 6.02 and 7.95 (0.4), 6.89 and 6.92 (1) to the full mass: T-NR passes
   wherever zeta passes, at every height, because every width of the test is to the right of its off-line zeros. It would differ only
   for Y < 0.064, that is by a reading to the left of its zeros.

How the object enters: through its zeros (local Poisson sum plus the smooth density) and equally through its coefficients (prime sum with
the archimedean term); the two computations agree to 1e-4 at 1e12 when the kernel is the same.

## 5. Why none is a survivor, and the one statistic that separates some controls

- 1, 2: the premise is a property of the model density and is false for zeta at every size. Where a control differs from zeta the
  statistic is the closest-pair gap (small-gap law of the on-line list) or the enclosure of an off-line zero.
- 3: the proxy rate is the atomic self term, identical for every list; the particle time is the closest pair; D(N) is the count deficit.
- 4: false for zeta inside the strip; true at sigma = 1 for zeta and for every Euler-type control.

Sign of the prime-side mass at Y = 0.165 (delta = 0.0825), all primes to 1e10 together, 1.34e8 samples per window:

| object | height | min M_K | fraction of samples with M_K < 0 | max of Re G_0 against (1/2) log(q t/2 pi) | min of Re G_0 |
|---|---|---|---|---|---|
| zeta | 1e9 | 0.286 | 0 | 8.87 against 9.44 | -19.59 |
| zeta | 1e12 | 0.757 | 0 | 11.38 against 12.90 | -21.01 |
| zeta | 1e15 | 1.261 | 0 | 13.83 against 16.35 | -20.43 |
| L(chi_-4) | 1e12 | 0.791 | 0 | 12.01 against 13.59 | -20.20 |
| L(chi_5) | 1e12 | 0.849 | 0 | 12.00 against 13.70 | -20.05 |
| L(chi_5) | 1e15 | 1.439 | 0 | 14.28 against 17.16 | -20.52 |
| sign twist | 1e12 | -4.481 | 3.6e-4 | 21.86 against 12.90 | -20.63 |
| sign twist | 1e15 | -3.227 | 1.0e-5 | 22.80 against 16.35 | -21.21 |
| unimodular twist | 1e12 | -4.143 | 3.6e-4 | 21.18 against 12.90 | -20.36 |
| Liouville twist | 1e12 | -4.212 | 3.9e-4 | 21.32 against 12.90 | -12.91 |

The distribution of Re G_0 is one-sided for zeta and the Dirichlet L-functions (maximum below the archimedean term, minimum near -20),
symmetric for the sign and unimodular twists, and mirrored for the Liouville twist. This is the statement Re xi'/xi(s) > 0 for
Re s > 1/2, which is equivalent to RH (CLASSICAL): M = (1/2) sum over zeros of delta-type kernels, each positive when the zero is on or
to the left of the reading line. Reasons it is not a survivor:
1. Zeta passes because its zeros up to these heights are on the line: at a point where M < 0 there is a zero to the right of the
   reading line within distance of order delta. A pass on a window is a zero-free statement for the strip beyond delta in that window.
2. Not every control fails. T-NR (q = 1000003) passes at every width tested, at every height, because its off-line zeros are at
   Y = 0.064, to the left of the reading line. E_a passes for Y > 2a. DH and heat fail only near pairs with b > delta (measured below
   2000: 0 negative points further than 5 Y from every pair for DH).
3. The twists fail because their prime sum is compared with the archimedean term of a functional equation they do not have; the same
   happens with any test that uses the functional equation (table of `stack-combinator`). The random sign product has no zeros in
   Re s > 1/2 almost surely, so its failure carries no information about zeros.
4. The K-smoothed mass is not sign-definite even under RH (the correction is 28 % at this width for X = 1e10); the zero count of
   negative samples for zeta is an observation, not a consequence of RH for M_K.

## 6. Not reached, and weakest steps

- N = 1e9 for the first-N ladders: the lists on disk end at 1.0e8 zeros.
- 1. Controls with off-line zeros are full sets only below height 2000 (tables of `c12-control-battery-harness`, MEASURED off-line lists,
  not certified complete in their source). All "far from every off-line pair" statements rest on 39 to 315 pairs per control.
- 2. The prime side is float64 with long-double phases: the phase error is about 3e-3 rad per prime at T = 1e15. It was checked against
  30-digit values at the three minima of the 1e15 run (differences 6e-5 at Y = 1, 0.02 at Y = 0.4 and 0.33, the latter being the
  kernel correction) and against zeros at 1e9 and 1e12; there is no zero list at 1e15, so the K-smoothed fractions there are a screen.
- 3. "Zeta passes at Y = 1 from 1e12 on" rests on 1.34e8 samples in a window of length 2.7e6 at each of 1e12 and 1e15 and on 1.95e7
  grid points in the zero window; the grid step is 0.02 against a kernel width 0.5. It is not a statement for all x.
- The sign and unimodular twists are single seeded realisations.

## 7. Files

Code: `zf.py` (copy of the list loader and flow integrator of `s3-dyson-burgers-zero-flow`), `c12.py` (combinations 1, 2: model, ladders,
tables), `c3.py` (combination 3), `c4.py` (combination 4 zero side, tables, prime-against-zero comparison, re-check), `p4.py` (sieve,
long-double phases, non-uniform FFT, statistics, self-test), `origin_fs.py`, `tnr_factor.py`, `far_min.py`, `recheck12.py`, `recheck15.py`,
`summ_*.py` (printers), `run_*.sh` (server units).
Outputs: `out_server/` (server: `c12_*.json`, `c4_*.json`, `c4_cmp_*.log`, `p4_*.json`, `c3_*.json` with `c3_zeta8_full.json` = the ladder to 1.0e8, `c4_recheck_*.json`, logs), `out/` (Mac: `c12_model.json`,
`c12_tables.json`, `c12_origin_function_side.json`, `c3_*.json`, `c4_tables.json`, `c4_far_min.json`, `c4_tnr_factor.json`, `p4_selftest.json`, re-check logs).
Server directory: `~/rh-push/s5-burgers-shock-cusp-stieltjes-strip/` (`prim/`: log p and phases of all primes below 1e10 for
T = 1e9, 1e12, 1e15, 14.6 GB; `out/*.npz`: slices of the prime-side arrays).
