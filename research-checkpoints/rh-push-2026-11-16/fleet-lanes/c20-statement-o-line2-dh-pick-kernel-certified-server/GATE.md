# GATE.md: pre-registration (written before any computation of this lane)

Lane `c20-statement-o-line2-dh-pick-kernel-certified-server`, 2026-11-20. Certified conversion for Statement O
line 2. Nothing here is a statement about zeros of zeta. All code is written for this lane; the source scripts
(`c1-missing-controls/partC_dh_cert.py`, `r2-pick-euler-entry/rchain.py`, `euler/*.py`) were not opened. Only the
definitions and the reported numbers in the RESULT files of those lanes were read.

## Objects

- k0 = (sqrt(10 - 2 sqrt 5) - 2)/(sqrt 5 - 1); a(n) = (1, k0, -k0, -1, 0) for n = 1, 2, 3, 4, 0 mod 5.
- DH kernel: theta(x) = sum_n a(n) n exp(-pi n^2 x/5), kappa(u) = e^{3u/4} theta(e^u), L = log kappa.
- DH function: f(s) = sum a(n) n^{-s} = 5^{-s} sum_{r=1..4} a(r) zeta(s, r/5);
  F_DH(z) = (5/pi)^{s/2} Gamma((s+1)/2) f(s), s = 1/2 + z;
  L_DH(z) = F'/F = (1/2) log(5/pi) + (1/2) psi((s+1)/2) + f'(s)/f(s).
- ZETA: L_xi(z) = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2) + zeta'(s)/zeta(s).
- NEG-Q30: xi(1/2+z) (z^2 - w^2)(z^2 - conj(w)^2), w = 3/10 + 30 i. L = L_xi + 2z/(z^2-w^2) + 2z/(z^2-conj(w)^2).
- NEG-Q85: same with w = 0.3085171825 + 85.6993484854 i (the position of DH's first off-line zero).
- NEG-REAL: xi(1/2+z) (z^2 - x0^2), x0 = 1/2 (a real zero pair off the line, inside the node range).
- Pick kernel K(x,y) = (L(x) + L(y))/(x + y). Confluent form at anchor a: P[i][j] = coefficient of s^i t^j of
  K(a+s, a+t), computed from (2a + s + t) K = L(a+s) + L(a+t), i.e.
  2a P[i][j] + P[i-1][j] + P[i][j-1] = l_i [j=0] + l_j [i=0], l_k the Taylor coefficients of L at a.

## Part 1 (local, python-flint 0.9.0, 256 bits; memcap 8 GB)

Method (own derivation, no arb_series): D = d/du = x d/dx. D^j e^{-y} = e^{-y} sum_k S(j,k) (-y)^k (Stirling
numbers of the second kind), y = (pi/5) n^2 x. theta_j = D^j theta as plain ball sums over n <= 30 plus a tail
radius. g = theta_1/theta, g^(n) = (theta_{n+1} - sum_{k<n} C(n,k) g^(k) theta_{n-k})/theta, L' = 3/4 + g,
L^(n+1) = g^(n). On an interval I = [m - r, m + r] the mean-value form f(I) in f(m) + [-r, r] f'(I) is used.

- Region A = [0, 0.6]: certify theta > 0, L'' < 0, L'''' < 0. With L'(0) = L'''(0) = 0 (evenness) this gives
  L''' < 0 on (0, 0.6] and h = u L'' - L' = int_0^u s L'''(s) ds < 0 on (0, 0.6].
- Region B = [0.25, 3]: certify theta > 0, L'' < 0, h < 0 directly.
- Tail [3, infinity): analytic bound with x >= e^3, constants enclosed by balls.
- Truncation: for n > M = 30 and x >= 1: |n S_j^abs(y) e^{-y}| <= n B_j e^{-y/2}, B_j = sum_k S(j,k)(2k/e)^k,
  and sum_{n>M} n e^{-b n^2} <= e^{-b M^2}/(2b), b = pi/10.
- Adaptive bisection, start width 1/64, minimum width 2^-20. Every interval not certified at minimum width is
  reported.
- Evenness check: theta(1/x) - x^{3/2} theta(x) contains 0 at x = 0.5, 0.25, 0.8; L'(0), L'''(0) contain 0.

Predicted: theta > 0, L'' < 0 on [0, inf); L'''' < 0 on [0, 0.6] with L''''(0) = -1.97620 (source value);
h < 0 on [0.25, inf). Predicted number of uncertified subintervals: 0.
Failure reading: any subinterval with a certified opposite sign refutes Part C of the source; an undecided
subinterval at minimum width is reported as NOT CERTIFIED and the label stays MEASURED there.

## Part 2 (server through rhrun, 8 cores, 12 GB requested; python-flint balls)

Decision method: ball LDL^T without pivoting (right-looking Schur complement). d_k = (leading minor k)/(leading
minor k-1). A pivot is decided only if its ball excludes 0. If all d_1..d_N are decided, the number of negative
pivots is the number of negative eigenvalues. This is a third algorithm (sources: Levinson on a Toeplitz form;
Richards chain).

Runs and predicted signs.

| run | function | nodes | order | bits | predicted |
|---|---|---|---|---|---|
| C1-DH | DH | confluent a = 1 | 256 | 12000 | d_1..d_148 > 0; d_149 < 0, d_150 < 0; d_151..d_217 > 0; d_218 < 0, d_219 < 0; d_220..d_230 > 0; d_231..d_256 no prediction (from r_148, r_150, r_217, r_219 < 0 in `r2-pick-euler-entry`, sign d_k = prod_{j<k} sign r_j). Orders 160 and 200: exactly 2 negative pivots. Order 256: at least 4 |
| C1-ZETA | zeta | confluent a = 1 | 256 | 12000 | all d_k > 0 |
| C1-Q30 | NEG-Q30 | confluent a = 1 | 60 | 12000 | first negative pivot d_21 (r_20 < 0 in the source) |
| C1-Q85 | NEG-Q85 | confluent a = 1 | 130 | 12000 | first negative pivot d_101 |
| C1-REAL | NEG-REAL | confluent a = 1 | 20 | 12000 | first negative pivot d_2 |
| C2-DH | DH | confluent a = 1/2 (anchor not in the sources) | 200 | 12000 | first negative pivot d_149 (all source anchors a <= 3 give 149) |
| C2-ZETA | zeta | confluent a = 1/2 | 200 | 12000 | all positive |
| C3-DH | DH | distinct nested: x_k = exp(log 0.01 + v_k (log 0.5 - log 0.01)), v_k = base-2 van der Corput, k = 1..256, order of the sequence | 256 | 10000 | d_1..d_100 > 0 (euler/RESULT.md, measured). First negative pivot: predicted in [149, 200]; this is a guess with no source |
| C3-ZETA | zeta | same | 256 | 10000 | all positive |
| C3-Q30 | NEG-Q30 | same | 60 | 10000 | first negative pivot between 10 and 25 (euler table: gamma = 20: 13; gamma = 40: 34) |
| C4-DH | DH | distinct nested, same rule on [0.1, 10] | 256 | 10000 | first negative pivot in [149, 256]; guess |
| C4-ZETA | zeta | same | 256 | 10000 | all positive |

Precision rule: if a pivot ball contains 0 before the registered order is reached, the run is repeated at
double the bits (at most twice). An undecided pivot after that is reported as UNDECIDED and nothing is claimed
at or beyond that order. Planned memory per run: N^2 balls of (bits/8) * 2.5 bytes; N = 256, 12000 bits:
65536 * 3750 B = 0.25 GB per matrix copy, two copies at most.

Reading of outcomes.
- "DH passes order N" in this lane means: on the stated node configuration every pivot d_1..d_N is a ball > 0.
  It is not a statement about all N-node configurations.
- Orders 160, 200, 256 at confluent anchors are predicted INDEFINITE for DH. The assignment's phrase "DH Pick
  matrices at orders above 148" is therefore registered as: certified sign pattern at those orders, with the
  first failure order compared against 149.
- Named failures: (F1) a certified negative pivot for DH at order <= 148 at a = 1 or a = 1/2 (contradicts the
  membership clause of line 2 at that anchor); (F2) DH positive at order 149 at a = 1 (contradicts P7);
  (F3) zeta with a non-positive pivot (code or precision error; run void); (F4) a negative comparison passes
  its registered order range (the test does not detect; run void); (F5) a certified opposite sign in Part 1.

## Part 3 (paper)

Question: can "finite Pick orders are Euler-blind" be stated without reference to the order reached?
Registered candidates, to be proved or to have the missing step named:
- (A) domination: a Dirichlet series G = zeta * B with B a Dirichlet polynomial with functional equation,
  non-multiplicative coefficients and all zeros on Re s = 1/2, so that K_G = K_xi + K_B with K_B >= 0 at every
  order and every node set.
- (B) finite range for DH from its located off-line zero (Pick-Nevanlinna), with the certified pair
  (pass, fail) at the anchors run here.
- (C) the form with off-line zeros at every order ("for every N a function without Euler product, with an
  off-line zero, passes order N on all node sets"): expected to need a node-uniform margin; the missing step is
  to be named.

Registered outcomes: line 2 PROVED relative to certified runs with two independent derivations; or a named
failure (F1..F5). The requirement score cannot rise from this lane.

## Addendum 1 (2026-11-20, written while the registered batch `rh-c20pick-1120083208` was running and before any of its output was read; before the runs below were launched)

Part 3 candidate (C) changed form after paper work: with E(z) = 6^{z/2} + 6^{-z/2} + c ((3/2)^{z/2} + (3/2)^{-z/2}),
c = 1/2 (the completed form of the Dirichlet polynomial B(s) = 1 + c sqrt2 2^{-s} + c sqrt3 3^{-s} + sqrt6 6^{-s}),
the function D_m = f_DH * B^m has completed function F_DH * E^m (up to a constant) and Pick kernel
K_DH + m K_E. Claim to be proved on paper: for every N and every compact node range there is m with all Pick
matrices of order <= N positive definite, while D_m keeps every zero of DH.

Supplementary certified runs (same code, function `dhe<m>`: L = L_DH + m E'/E):

| run | nodes | order | bits | predicted |
|---|---|---|---|---|
| X-DHE1 | confluent a = 1 | 256 | 12000 | first negative pivot later than 149 (guess: 150 to 200) |
| X-DHE8 | confluent a = 1 | 256 | 12000 | first negative pivot later than for m = 1, or none |
| X-DHE64 | confluent a = 1 | 256 | 12000 | all positive (guess) |
| X-DHE4096 | confluent a = 1 | 256 | 12000 | all positive |
| X3-DHE64 | nested [0.01, 0.5] | 256 | 10000 | all positive (guess) |

If X-DHE4096 has a negative pivot, the monotonicity "first failure order is non-decreasing in m" is checked
against the proof (K_E >= 0 gives monotonicity of positivity, so a failure at larger m with a pass at smaller m
at the same order would be an error).

## Addendum 2 (2026-11-20, after reading X-DHE1, X-DHE8, X-DHE64, X-DHE4096; before the runs below were launched)

Read so far: the first negative pivot of F_DH E^m at a = 1 is 210, 217, 219, 221 for m = 1, 8, 64, 4096. The
registered guess "X-DHE64 all positive at order 256" is false. Powers of one factor add no new zero ordinates,
so the needed m grows very fast with the order. Changed family, same proof: products of distinct factors
B_q(s) = 1 + sqrt(q) q^{-s}, q a 3-smooth integer (zeros at 1/2 + i pi (2k+1)/log q, all on the line; completed
factor E_q(z) = q^{z/2} + q^{-z/2}; E_q'/E_q = (log q / 2) tanh(z log q / 2)). D_Q = f_DH * prod_{q in Q} B_q.

| run | Q | nodes | order | bits | predicted |
|---|---|---|---|---|---|
| X-Q2 | {2, 3, 4, 9} | confluent a = 1 | 256 | 12000 | first negative pivot above 221, or none (guess) |
| X-Q3 | {2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 27, 32} | confluent a = 1 | 256 | 12000 | all positive (guess from 2.5 orders per added zero below height 85.7) |
| X-Q4 | all 3-smooth q in [2, 128] (21 values) | confluent a = 1 | 256 | 12000 | all positive |
| X3-Q3 | as X-Q3 | nested [0.01, 0.5] | 256 | 10000 | all positive (guess) |
