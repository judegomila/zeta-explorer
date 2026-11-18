# e1-rs-torus-laguerre-orbit: Riemann-Siegel main sum on the prime-phase torus x theta'(t) = log N x Laguerre inequality

Verdict: **precise obstruction** (the combination is closed at the first decisive test; no pivot taken, see section 6).
Labels: PROVED / CLASSICAL / MEASURED / ARGUED / OPEN. Nothing here gives information on the location of any zeta zero.

Files: `lag.py` (torus Monte Carlo + orbit scan), `lag2.py` (DH exact function, true Z at the bad points, translated orbits), `lag3.py` (amplitude tilt on the orbit), `lag_results.json`, `lag2_results.json`, `lag3.log`. Scripts are run from the repo root with `.venv-arb/bin/python` (lag2.py reads lag_results.json from the working directory). All runs local through `scripts/memcap.sh 8`, float64, total about 2.5 minutes. The compute server was not used.

## 1. Plan

Nodes combined: `dbn-prime-torus-phase-closure`, `euler-product-torus-parametrisation` (Lemma E), `bridge-winding-equals-NT`, `laguerre-hierarchy`, open lemma `euler-fe-coupling-at-height`.

New relative to the map: rows S4/Q13 treat the prime chain (log-derivative side) on the Bohr torus; no row puts the Riemann-Siegel main sum of Z itself, with theta as an extra torus coordinate, against the order-1 Laguerre set. The object is exact at one height and contains all n <= N and the functional-equation phase.

Setup. Torus T = (R/2 pi)^{1 + pi(N)} with coordinates (theta, Phi = (phi_p)_{p <= N}), phi_n = sum_p v_p(n) phi_p.

- f_N(theta, Phi) = Re[e^{i theta} sum_{n<=N} n^{-1/2} e^{-i phi_n}].
- Flow V_N = (log N, (log p)_p). Then V^k acts on the n-th term as multiplication by (i log(N/n))^k: all frequencies log(N/n) lie in [0, log N], and the term n = N is stationary.
- Lag_N = (V f)^2 - f V^2 f, B_N = {Lag_N < 0}.
- True orbit: t -> (theta(t), (t log p)_p), t in I_N = [2 pi N^2, 2 pi (N+1)^2], Z(t) = 2 f_N(orbit(t)) + R(t), R(t) = (-1)^{N-1} (t/2 pi)^{-1/4} Psi(frac sqrt(t/2 pi)) + O(t^{-3/4}) (CLASSICAL, Riemann-Siegel). theta'(t) = (1/2) log(t/2 pi) + O(t^{-2}) lies in [log N, log(N+1)] on I_N.

## 2. Exact statement: off-line pair -> Lag < 0 on the orbit

(a) CLASSICAL. F(t) = xi(1/2 + it) is real entire of order 1, even, so -(F'/F)'(t) = sum over zeros tau of (t - tau)^{-2}. For real t, with real zeros gamma_k and off-line quadruples gamma_j +- i beta_j (0 < beta_j < 1/2):

Lag[F](t)/F(t)^2 = sum_k (t - gamma_k)^{-2} + sum_j 2((t - gamma_j)^2 - beta_j^2)/((t - gamma_j)^2 + beta_j^2)^2.

Z = F/g with g real, zero-free, (log abs g)'' = O(1/t). Hence at t = gamma_0 of an off-line pair:

Lag[Z](gamma_0)/Z(gamma_0)^2 = -2/beta_0^2 + S(gamma_0) + O(1/gamma_0), S = the sum over all other zeros.

So an off-line pair forces Lag[Z](gamma_0) < 0 **if and only if 2/beta_0^2 > S(gamma_0) + O(1/gamma_0)**. It is not forced in general: with mean zero density log(t/2 pi)/2 pi the lattice value of S is log^2(t/2 pi)/12 (ARGUED), which exceeds the smallest possible 2/beta^2 = 8 once log(t/2 pi) > 9.8. Order-1 Laguerre therefore detects only pairs with beta below about sqrt(24)/log(t/2 pi); the full statement needs every level L_n of the hierarchy (or Lag at complex points). This is a first loss before any torus argument.

(b) PROVED (algebra). With Z = 2f + R along the orbit (f = f_N on the orbit, derivatives in t):

Lag[Z] = 4 Lag[f] + 2(2 f'R' - f R'' - R f'') + Lag[R].

On I_N, R' = O(N^{-3/2}), R'' = O(N^{-5/2}) (Psi is a smooth function of frac sqrt(t/2 pi), speed 1/(4 pi N)), and the frozen-speed Lag_N differs from the true-time Lag[f] by O(log N / N) relative. So

Lag[Z] = 4 Lag_N(orbit(t)) - 2 R(t) f''(t) + O(N^{-3/2} log^2 N).

Consequence: a detectable off-line pair (2/beta^2 > S) puts the orbit in the enlarged set B_N^R = {Lag_N < (1/2) abs(R) abs(V^2 f) + O(N^{-3/2} log^2 N)}, not in B_N. The converse fails in both directions: the orbit can be in B_N with Lag[Z] > 0 (section 4.2), and Lag[Z] can be < 0 with the main sum outside B_N only inside the same tolerance.

Check of (a) on DH (MEASURED, mpmath, exact Hurwitz form): at gamma = 85.6993484854, beta = 0.3085172: Lag/Z^2 = -20.16 against -2/beta^2 = -21.01 (S = 0.85); at gamma = 114.1633427308, beta = 0.1508301: Lag/Z^2 = -86.9 against -87.9 (S = 1.0).

## 3. First lemma: the set B_N

- N = 1: V = 0. N = 2: f = cos theta + 2^{-1/2} cos(theta - phi_2), theta - phi_2 is V-invariant, Lag_2 = (log 2)^2 (1 + 2^{-1/2} cos(theta - phi_2) cos theta) >= (log 2)^2 (1 - 2^{-1/2}) > 0. **B_1 and B_2 are empty (PROVED).**
- N = 3: f = cos a + 2^{-1/2} cos b + 3^{-1/2} cos c with c invariant; the constant 3^{-1/2} cos c lifts a negative local minimum of the first two terms above zero. **B_N is non-empty for N >= 3** (MEASURED measure 0.022 at N = 3; open set, so positive measure once non-empty).
- Measure (MEASURED, 2 x 10^5 uniform points, s.e. about 5 x 10^-4): 0.012 (N=4), 0.033 (5), 0.032 (10), 0.043 (20), 0.049 (50), 0.053 (100), 0.057 (200), 0.059 (300). Slow growth, no sign of saturation at N = 300.
- Position relative to the true segment: section 4.

## 4. First decisive test (N = 2..300)

Orbit scans use step 0.01 in t, exact t-derivatives of the main sum with theta', theta''; "bad" = critical point of the main sum with f f'' > 0 (positive local minimum or negative local maximum), which is inside B_N.

### 4.1 Torus measure against orbit fraction (MEASURED)

| N | meas B_N (zeta) | zeta orbit: crit / bad / time fraction in B | DH function: meas B | DH orbit (q=5): crit / bad / fraction | sign twist eps_2 = -1 orbit: bad |
|---|---|---|---|---|---|
| 10 | 0.032 | 99 / 2 / 0.0032 | 0.019 | 19 / 0 / 0 | 2 |
| 20 | 0.043 | 248 / 0 / 0 | 0.024 | 49 / 2 / 0.020 | 27 |
| 50 | 0.049 | 792 / 7 / 0.0015 | 0.032 | 156 / 4 / 0.013 | 101 |
| 100 | 0.053 | 1853 / 3 / 0.00021 | 0.035 | 371 / 16 / 0.019 | 225 |
| 200 | 0.057 | 4251 / 13 / 0.00038 | 0.039 | 842 / 31 / 0.015 | 563 |
| 300 | 0.059 | 6858 / 11 / 0.00013 | 0.041 | 1343 / 56 / 0.018 | 901 |

The zeta segment spends 10 to 450 times less time in B_N than a uniform torus point; the DH segment about half the uniform value; the sign-twisted orbit (the same torus function translated by pi in phi_2, hence the same B_N up to translation) the uniform value. Sign twist with no theta (Re sum eps_n n^{-1/2-it}, flow (log p) only): torus measure 0.11 to 0.25.

### 4.2 The zeta segment does enter B_N (MEASURED)

First entry N = 5, t = 221.070 (2 f = -0.028). Entries occur for 18 of the 21 scanned N >= 5 (none at N = 6, 20, 22). At 15 bad points checked with mpmath `siegelz` (N = 5, 10, 16, 50, 100, 300): the true Z has Lag[Z] > 0 throughout a window of +-0.3, with 2 or 3 real sign changes in 14 of 15 cases; 2 abs(f) at the bad point is 0.005 to 0.17, below the remainder scale (t/2 pi)^{-1/4} = 0.41 to 0.058. Smallest true normalised Lag met: 0.0004 (t = 63137.2). So the statement "the true segment avoids B_N" is **false**; the true statement is avoidance of a set defined with the tolerance abs(R) of section 2(b), and at those points the sign is decided by R, not by the main sum.

### 4.3 DH (MEASURED)

Z_DH = e^{i theta_5} f_DH(1/2 + it), theta_5 = arg[(5/pi)^{it/2} Gamma(3/4 + it/2)], verified real to 1e-15. Main sum of length sqrt(5t/2 pi), coefficients (1, xi, -xi, -1, 0) mod 5 = c_1 g(Phi + alpha) + c_2 g(Phi - alpha), two character-shifted points of the 5-free torus sum. Segment N = 8 ([80.4, 101.8]): one bad critical point at t = 85.707, min normalised Lag -0.145. Segment N = 9 ([101.8, 125.7]): one bad point at t = 114.160, min -0.234. The true Z_DH has Lag < 0 on [85.45, 85.95] and [114.06, 114.26]. The orbit enters B at both off-line heights, as required. DH's B is empty for N <= 5 in the Monte Carlo and non-empty from N = 6.

### 4.4 Does a torus property using theta' = log N exclude B_N for zeta and not for DH? No.

1. theta_5'(t) = (1/2) log(5t/2 pi) = log of the DH main-sum length. **The relation "speed of theta = top frequency" holds identically for DH** (CLASSICAL: it holds for every approximate functional equation with conductor q, length sqrt(qt/2 pi)). It encodes the functional equation only. In the flow it says: frequencies are log(N/n) >= 0 and the top term is stationary; both hold for DH and for the sign-twisted orbit.
2. The property that separates zeta from the controls in table 4.1 is the position of the single orbit, to within a tolerance that shrinks with N. Translated orbits (MEASURED, bad critical points out of the same number):

| N | theta + 0 | + 0.03 | + 0.1 | + 0.3 | + 1.0 | phi_2 + 0.03 | + 0.1 | + 0.3 | + pi |
|---|---|---|---|---|---|---|---|---|---|
| 50 (792 crit) | 7 | 8 | 13 | 34 | 107 | 5 | 11 | 38 | 101 |
| 100 (1853) | 3 | 3 | 22 | 97 | 261 | 3 | 22 | 103 | 225 |
| 200 (4251) | 13 | 20 | 57 | 232 | 642 | 15 | 72 | 254 | 563 |

A translation by 0.1 rad in theta or in one prime phase multiplies the count by 4 to 7 at N >= 100; by 0.3 rad, by 18 to 34. The tolerance (about 0.03 to 0.1 rad at N = 50..200) is the size of R, about N^{-1/2}. An invariant or translation-robust torus statement (measure, symmetry, a neighbourhood of the orbit of fixed width) cannot exclude B_N: B_N has measure 0.05, the segment has length 4 pi N against an equidistribution time exponential in pi(N), and translates of the segment at distance 0.1 enter B_N at many times the rate. What remains is a statement about f_N and its two flow derivatives at each individual orbit point with no margin: the largest-value / one-point form of rows S4 and Q13.
3. Lehmer pairs: the true normalised Lag reaches 0.0004 inside N = 100 already, and the main sum is on the wrong side of zero at such points. No positive lower bound for Lag on the orbit is available in the limit.

**The combination is closed here.** Reason in one line: on the torus the coupling theta' = log N is shared by DH, the Euler product enters only as the identity of one point of T (Lemma E), and the exclusion of B_N is true only for that point, only after adding R, and with no margin.

## 5. Controls

| Control | Formulation here | Outcome |
|---|---|---|
| DH | q = 5 main sum, two shifted torus points, theta_5' = log(length) | same coupling; orbit enters B at 85.707 and 114.160 and at fraction about 0.015 of time for N up to 300; separation from zeta is only through the coefficients at each orbit point |
| Sign twist (eps_2 = -1, completely multiplicative), with theta | same torus function, orbit translated by pi in phi_2 | orbit fraction in B equals the torus measure (0.057 to 0.063); no torus-invariant statement separates it from zeta |
| Sign twist, no theta | flow (log p) only | measure of B 0.11 to 0.25; no functional-equation coordinate, Lag has no reason to be positive |
| Unimodular twist theta -> theta + c | translated orbit | c = 0.1 already 4 to 7 times the zeta count; c = pi/2: 15 to 100 times |
| Amplitude tilt n^{-1/2} e^{c log^2 n} (heat-type) | same torus, same orbit, tilted coefficients | c = +0.05: torus measure 0.12 to 0.23, orbit bad 112/790, 396/1823, 1098/4073 (N = 50, 100, 200); c = +0.02: 39, 131, 453. c = -0.02: 4, 3, 18 bad; c = -0.05: 4, 6, 18 bad (N = 50, 100, 200), the same level as zeta (7, 3, 13). The test does not distinguish zeta from the c < 0 tilts, and the tilt family has no step in this construction that uses an Euler product. Assignment of c > 0 to the backward direction is ARGUED (relative weight moved towards n near N), not derived |
| theta^w, T-NR, Beurling, E_a, phase-rotated transfer operator | not run | theta^w and the transfer operator have no main sum of this form; E_a and Beurling would need their own approximate functional equations |

## 6. Verdict

Precise obstruction. Established:

1. PROVED: B_1, B_2 empty; identity of section 2(b). CLASSICAL: the Laguerre partial-fraction criterion 2/beta^2 > S for order-1 detection.
2. MEASURED: B_N non-empty from N = 3, measure 0.02 to 0.06 for N <= 300; the zeta main-sum segment enters B_N (first at t = 221.07) and is rescued by R at all 15 points checked; the DH segment enters B at 85.707 and 114.160; translated orbits at 0.1 rad lose the avoidance.
3. The coupling theta' = log N is not a zeta-specific input: it is the functional equation and holds for DH with N = sqrt(5t/2 pi).
4. End point: the same as rows S4/Q13. The required lemma is a one-point, no-margin statement about the main sum plus remainder at each height; it is equivalent in strength to the absence of detectable off-line pairs at that height, and order-1 Laguerre does not even detect all pairs.

No pivot was taken: the adjacent combinations (higher Laguerre levels L_n on the same torus; replacing f_N by the smoothed approximate functional equation to remove R) keep the two facts that close this one, the shared coupling and the zero margin at Lehmer pairs.

Usable by-product for the engine: the pair (time fraction of the true segment in B_N) / (torus measure of B_N) is a cheap numerical discriminator of "real-zero" orbits: about 0.002 to 0.1 for zeta, 0.4 to 0.8 for DH, 1 for sign-twisted and phase-shifted orbits. It is a diagnostic of verified height, not an input to a proof.

## 7. Three weakest steps

1. Section 2(a), "not forced in general": the value S = log^2(t/2 pi)/12 is the equally-spaced heuristic; the true S(gamma_0) near a hypothetical off-line pair is unknown and could be smaller (zeros repelled from the pair). The detection threshold beta < sqrt(24)/log(t/2 pi) is ARGUED only.
2. Section 4.4 item 2 is numerical, for N <= 200, float64, step 0.01, with bad points located by linear interpolation of f'; counts of order 3 to 13 for zeta carry large relative fluctuation, and narrow excursions into B_N between critical points are counted only through the time fraction. No theorem "no translation-robust torus property excludes B_N" is proved; the closure rests on the measured loss at 0.1 rad plus the classical size of R.
3. The heat control is an amplitude tilt in log n, not the de Bruijn-Newman family (whose coefficients depend on t through log(t/4 pi n^2)); the c < 0 result (test passed at the zeta level) and the direction assignment were not checked against H_t itself. theta^w, T-NR, Beurling, E_a and the transfer-operator control were not run.
