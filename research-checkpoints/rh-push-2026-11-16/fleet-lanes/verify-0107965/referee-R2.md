# Referee report R2: finite head (sec 2.2; Lemma 2.2, Props 2.3, 2.4)

Object: hexagon:2611.00460v1 (Raymond). Part: stationary wall at X = 6000000185827, N = 690988,
T_w = 41/250, and the Platt-Trudgian localisation of the finite head.
Date 2026-11-17. All runs local, through `scripts/memcap.sh 8`, Python `-I`, own code only
(`referee-R2-work/`). No packet script was executed for this report.

## Verdict: verified-with-corrections

Lemma 2.2, Prop 2.3 and Prop 2.4 are correct as stated. Every step was re-derived; the finite
hypothesis (20) was replayed with own interval code; the wall was tested directly against zeta values
at 15 points. The corrections are to attribution and to two unstated one-line arguments. None changes
a number. The margin is large: the stated floor is 697/900 = 0.774, the smallest value of
|H_t/B_t| seen at the wall is 1.59.

## 1. What was checked, step by step

### 1.1 Parameters and guards (19)
Own arb computation (192 bits): sqrt(X/4pi) = 690988.3096... >= N; sqrt(X/4pi + T_w/16) < N+1;
log N < L/2 with L = 26.891756369158...; theta_0 = -1.0770881540652740321414, inside (-11/10, -1).
theta_0 was computed from the log M_0 formula, a different route from the author's factorised product;
it agrees with the author's recorded value to all 24 digits compared. So Polymath's cutoff
floor(sqrt(x/4pi + t/16)) equals N for all t in [0, T_w].

### 1.2 Lemma 2.2 (Abel transfer). Re-derived, correct.
- Cells [t_j - r, t_j + r], j = 0..3, r = 41/2000, are [0,.041],[.041,.082],[.082,.123],[.123,.164]: they cover [0, T_w].
- d psi_n/dt = -pi(L - 2 v_n)/16, and L - 2 v_n > 0 for n <= N by (19), so
  |cos psi_n(t) - cos psi_n(t_j)| <= r pi (L - 2v_n)/16. Hence (20) gives C_J(t) > 79/100 for every J <= N and
  every t in the closed cell. Direction correct (lower bound minus Lipschitz term).
- Re F_id = 2 e^{-yL/4} sum c_n(t) w_{t,y}(v_n): checked termwise
  (e^{-yv/2} + e^{-y(L-v)/2} = 2 e^{-yL/4} cosh(y(L-2v)/4)).
- w_{t,y} > 0 and nonincreasing on [0, log N]: d/dv [v(L-v)] = L - 2v > 0, and cosh of a nonnegative
  decreasing argument. Holds also at t = 0 and y = 0 (factor constant).
- Abel: sum c_n w_n = C_N w_N + sum_{n<N} C_n (w_n - w_{n+1}) > (79/100) w_1, strict because w_N > 0.
  w_1 = cosh(yL/4); 2 e^{-yL/4} cosh(yL/4) = 1 + e^{-yL/2} >= 1.
- No endpoint issue: the conclusion holds on the closed set [0,T_w] x [0,1]. No sampling in t or y.

### 1.3 Hypothesis (20): all 4N = 2,763,952 prefix inequalities. Replayed, all hold.
`referee-R2-work/prefix_replay.py` (own code, python-flint 0.9.0 arb, 192 bits, 3.6 s), result
`prefix_replay.json`: 0 failures, 0 undecided (every comparison is a strict ball comparison).
Smallest margin over 79/100, per cell: 0.010597, 0.078985, 0.101753, 0.077836, each attained at n = 1
(author's recorded minima 0.80060, 0.86899, 0.89175, 0.86784: same). Final prefix sums
C_N(t_j) = 39.67, 37.54, 34.80, 31.48 against a final Lipschitz term 26.58.
Remark: (20) requires partial sums of sum n^{-1/2} cos(...) that grow to more than 27. That is a
special property of this X (a large value of zeta: |zeta(1/2 + iX/2)| = 80.99), the same device as
Polymath's choice of barrier location. It is a finite fact about one number and it is true.

### 1.4 Model identification. Re-derived, correct.
With s_+ = (1+y-iX)/2, s_- = 1 - s_+, Polymath's f_t (Theorem 1.3, eq. (ft-def)) is
sum b_n n^{-s_+ - (t/2)alpha(s_+)} + gamma sum b_n n^{-s_- - (t/2)alpha(s_-)}, gamma = M_t(s_-)/M_t(s_+).
Substituting alpha = L/2 -+ i pi/4 and log gamma = -yL/2 + i(theta_0 + pi t L/8) gives exactly
e^{i phi} F_id with phi = theta_0/2 + pi t L/16 and psi_n as in the paper. (alpha = M_0'/M_0 was
re-derived; at y = 0, s_- is the conjugate of s_+, so arg gamma_0 = theta_0 exactly.)
|H/B| >= Re(e^{-i phi} H/B) is used in the right direction.

### 1.5 Error budget (25)-(27)
- d_alpha = 5/X: own evaluation gives max X |alpha(s_+-) - (L/2 -+ i pi/4)| = 4.0 on y in [0,1]
  (analytic bound: 1/X + 2/X + 1/X). Correct.
- eps_s bounds the exponent change of each term (|t delta v/2| <= T_w d_alpha v_N/2). Correct.
- eps_gamma: the heat part (t/4)|alpha_-^2 - alpha_+^2 - i pi L/2| <= t d_alpha (A_alpha + d_alpha/2) with
  A_alpha = L/2 + 1 >= |L/2 + i pi/4|; the y-drift |d/dy log gamma_0 + L/2| <= d_alpha gives 5/X. Both
  re-derived. The remaining term T_w A_alpha / X in eps_gamma is not needed by this derivation; it only
  enlarges the bound.
- E_id = 2 sqrt N [(e^{eps_s}-1) + (e^{eps_s+eps_gamma}-1)]: amplitude of every leading term is <= n^{-1/2}
  on both branches, sum_{n<=N} n^{-1/2} <= 2 sqrt N. Value 8.38e-9 (own), against the allowance 1/100.
- E_AB: this is Polymath (eab-bound) with log^2(x/4pi n^2) <= L^2 and |gamma| N^{|kappa|} n^y <= e^{0.021}.
  Own value of the paper's expression 2.06e-9; own direct sum of Polymath's (eab-bound) <= 3.5e-10.
  Allowance 1e-6.
- E_C: see 1.6. Paper's bound 4 e^{1/10} (X/4pi)^{-1/4} = 0.005318 < 2/369 = 0.005420. Checked.
  7X/88 > 820^4 and e^{1/10} < 10/9 hold.
- 79/100 - 1/100 - 1/180 = 697/900 exactly; 2/369 + 1e-6 < 1/180.

### 1.6 The remainder E_C and the 11/12 constant
The wall has y in [0,1], so the two Riemann-Siegel remainders are at real parts (1 -+ y)/2 in [0,1].
That is the range of Polymath's published Proposition 6.4 and Theorem 1.3 (0 <= sigma <= 1, T >= 100,
0 < t <= 1/2). **The wall therefore does not need the author's extension to sigma in [-1,2]**; the
paper's sentence "the corrected broad-height transfer in the source supplement gives (27)" cites more
than is required. Polymath's (ec-bound) gives e_{C,0} <= 0.001203 e^{-tL^2/16} at y = 0, a factor
4.4 below the paper's charge.

The 11/12: I read Polymath's proof of Prop. 6.4 (arXiv:1904.12438v2 source). It bounds the Stirling
error 1/(12(T'/2 - 0.33)) by (1/3)/(4(T-3)). That inequality is false (at T = 100: 0.001678 vs
0.000859); the correct bound is (2/3)/(4(T-3)). With 2/3 the square completion is
(u^2 + 6|u| + 2/3)/(4D) <= (u^2 + 11/12)/D, difference 3(|u|-1)^2/(4D). So the paper's 11/12 is right
and the published 5/6 is a slip in Polymath. The effect on Polymath's constants is of relative size
1/x (about 1e-12 here). Also checked: the closed form (src:gaussian) for the Gaussian average
(by hand, and by quadrature at three parameter sets, 15 digits); the wall bracket
G_2(0)/2 + 0.2 G_2(log 9)/(N-0.865) + 0.029 G_{-1}(-log 2)/(N-0.353) = 0.50003 < 1 at t = 1/5
(G_2(0) - 1 = 1.7e-12, G_2(log 9) = 103.1 < 110). With |C_0(p)| <= 1/2 each remainder is at most
e^{t pi^2/64} |M_0(iT')|, two of them at most twice that.

Normalisation: own evaluation of log[e^{t pi^2/64}|M_0(iT')| / |M_t(s_+)|] + (1+y)L/4 + tL^2/16 at 18
points (t in {0,.01,.041,.082,.164,.2}, y in {0,.5,1}): between -1.3e-14 and +3.4e-26. The paper's
"positive correction t pi^2/32" inside the reserve 1/10 does not occur (the factor e^{-pi T'/4}
cancels it); the reserve is an over-charge, harmless. So the two remainders together are at most
1.0001 e^{-(1+y)L/4 - tL^2/16}; the paper charges 4.42 times that.

### 1.7 Direct numerical test of Prop 2.3 (not a proof; 15 points)
`referee-R2-work/direct_wall.py`: H_t(X+iy) computed from mpmath zeta (45 digits) by the heat-kernel
integral H_t(z) = pi^{-1/2} int e^{-r^2} H_0(z + 2i sqrt(t) r) dr (trapezoid on a grid of 91 zeta values,
truncation terms < 1e-22), divided by B_t; t = 0 uses zeta directly. Compared with Polymath's f_t
(exact alpha, flint) and with F_id. Results (`direct_wall.json`):

| t | y | abs(H_t/B_t) | Re dephased | Re F_id | abs(H/B - f_t) | leading e_C0 | paper E_C |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 80.9876 | 80.9876 | 80.9881 | 5.40e-4 | 1.203e-3 | 5.318e-3 |
| 0 | 0.3 | 20.0726 | 19.6966 | 19.6967 | 7.18e-5 | 1.60e-4 | 7.08e-4 |
| 0 | 1 | 5.0713 | 5.0476 | 5.0476 | 6.49e-7 | 1.45e-6 | 6.40e-6 |
| 0.01 | 0 | 60.0063 | 60.0063 | 60.0066 | 3.44e-4 | 7.66e-4 | 3.38e-3 |
| 0.041 | 0 | 26.2115 | 26.2115 | 26.2115 | 8.46e-5 | 1.89e-4 | 8.34e-4 |
| 0.082 | 0 | 11.3405 | 11.3405 | 11.3405 | 1.33e-5 | 2.96e-5 | 1.31e-4 |
| 0.164 | 0 | 4.2468 | 4.2468 | 4.2468 | 3.26e-7 | 7.26e-7 | 3.21e-6 |
| 0.164 | 0.3 | 2.0489 | 1.8905 | 1.8905 | 4.34e-8 | 9.66e-8 | 4.27e-7 |
| 0.164 | 1 | 1.5893 | 1.4817 | 1.4817 | 3.92e-10 | 8.74e-10 | 3.86e-9 |

(6 further rows in the JSON, same pattern.) At every point the true error is 0.449 times the leading
remainder size, below Polymath's bound and below the paper's; |f_t - e^{i phi} F_id| <= 4.3e-12
(allowance E_id = 1/100); |H/B| > 697/900 with a wide margin. This test is independent of Polymath's
derivation and of the author's code. It includes t = 0.

### 1.8 No real zero crosses x = X
This is the case y = 0 of Prop 2.3, which is inside the closed range of Lemma 2.2 and of Polymath's
region (0 <= y <= 1). H_t(X) != 0 for all t in [0, 41/250]. Confirmed at the 5 sampled times.

### 1.9 Platt-Trudgian clearance
Checked against the text of arXiv:2004.09765v1, Theorem 1: "The Riemann hypothesis is true up to
height 3 000 175 332 800. That is, the lowest 12 363 153 437 138 non-trivial zeroes have real part 1/2."
A zero of H_0 at x + iy corresponds to s = (1-y)/2 + ix/2, so abs(Re z) <= X means ordinate at most
X/2 = 3000000092913.5. 3000175332800 - (X+1)/2 = 175239886 exactly. Note X/2 > 3*10^12: the rounded
height in the title of [4] would not suffice; the exact endpoint is required, and the paper says so.
Ordinate 0 is covered by (12) (H_0(iy) > 0); negative ordinates by symmetry.

### 1.10 Prop 2.4 (continuation of reality). Re-derived, correct.
- Boundary of the rectangle abs(Re z) <= X, abs(Im z) <= 2 is zero-free for all t in [0, T_w]:
  de Bruijn (Thm 2.1 with a = 1, from the classical strip; the 7/8 theorem is not needed here) gives
  abs(Im) <= 1; Prop 2.3 gives the edges Re z = X, 0 <= y <= 1; conjugation and evenness give the rest.
- All-real is closed in t (Hurwitz: a zero at t_1 inside is a limit of zeros at earlier times, which are
  inside and real) and open to the right: a simple real zero stays the unique zero in a
  conjugation-symmetric disk, hence real; at a real zero of order m >= 2 the forward heat polynomial is
  (z-z_0)^m -> eps^{m/2} 2^{m/2} He_m(w / sqrt(2 eps)) (re-derived from d_t = -d_zz), with m distinct real
  roots, error O(eps) against separation of order sqrt(eps); each branch is alone in a symmetric disk,
  hence real. Polymath Prop. 3.1(ii) states this expansion for t on both sides of t_0 (read in source).
  No zero can enter or leave the rectangle. The supremum argument closes.
- Simplicity for t > 0: backward branch z_0 + i sqrt(2 eps) lambda_k + O(eps); He_m has a nonzero root for
  every m >= 2, so a nonreal zero would exist inside the rectangle at t_0 - eps > 0. Contradiction. Correct.
  Multiple zeros at t = 0 are allowed and handled by the forward expansion.
- Collisions of real zeros and multiple zeros are therefore covered.

## 2. Corrections (none changes a number)

1. **Attribution of E_C.** For the wall, cite Polymath Theorem 1.3 / Prop. 6.4 (range 0 <= sigma <= 1)
   with the Stirling constant corrected from 1/3 to 2/3 (hence 5/6 -> 11/12). The wall does not depend
   on the unpublished sigma in [-1,2] extension. State explicitly that the 11/12 corrects a slip in the
   published proof of Polymath Prop. 6.4, not only in the author's earlier note.
2. **Endpoint t = 0.** Polymath's region is 0 < t <= 1/2; Prop 2.3 is stated on the closed interval.
   The missing line: for fixed z = X + iy, H_t, B_t, f_t (N constant by (19)) and the error bounds are
   continuous in t on [0, T_w], so the non-strict approximation inequality passes to t = 0; the wall
   inequality is strict with margin. (The packet note 08 says this; sec 2.2 does not.) Confirmed
   numerically at t = 0 (row 1-3 of the table).
3. The reserve term t pi^2/32 in (28) is not a real contribution (sec 1.6). Harmless.
4. eps_gamma contains a term T_w A_alpha / X with no stated source. Harmless.
5. Prop 2.3 displays the bound for abs(H/B); what is proved is the stronger Re(e^{-i phi} H/B) > 697/900.

## 3. Failure modes looked for

| Failure mode | Finding |
|---|---|
| bound proved on an open range, used at an endpoint | t = 0 (Polymath needs t > 0): closed by continuity, correction 2. y = 0 and y = 1 and t = T_w are inside closed ranges. |
| supremum at infinity treated as attained | none in this part: all sums finite, all sets compact |
| real-zero collision or multiple zero not covered | covered (1.10) |
| interchange of limit and maximum | none; the Lipschitz step is uniform on each closed cell |
| remainder valid only for large argument | Polymath needs x >= 200, T >= 100; here T = 3e12 |
| appeal to an earlier preprint for a step not reproved | the E_C sentence points to the supplement; not needed for the wall (correction 1) |
| inequality used in the wrong direction | none found |

## 4. Not checked

- Arias de Reyna's Riemann-Siegel expansion and coefficient bounds (Polymath Prop. 6.3) and
  |C_0(p)| <= 1/2: taken from the literature.
- The remaining proofs in Polymath sec 6.3 (Prop. 6.6 (i)-(iii),(vi)) were not re-derived line by line;
  their conclusions were used as published and cross-checked numerically (1.5-1.7). The Stirling slip
  found in Prop. 6.4 also perturbs the published constants 3.58, 6.92, 10.44 at relative size 1/x; I
  did not recompute them. The paper's own charge (4.42 times leading) does not rely on them.
- The extension of the remainder to sigma outside [0,1] (in particular the negative-tail term delta_3
  for sigma < 0) and everything at probe heights up to 6.01: that is part R4.
- de Bruijn's Theorem 13 and the Platt-Trudgian computation itself; the published (journal) wording
  of [4] Theorem 1 (only arXiv v1 was read).
- The author's `wall` stage was read in full but not executed; the same inequalities were replayed
  with own code instead.
- The direct test covers 15 points (t,y), not the continuum; the continuum statement rests on the
  analytic argument.
- How Prop 2.4 is used later (contact has abs(x) > X; source needed at x >= X - 2): part R3.

## 5. Files

- `referee-R2-work/prefix_replay.py`, `prefix_replay.json`: guards, theta_0, 4N prefix tests.
- `referee-R2-work/scalars.py`: E_id, E_AB, Polymath bounds, clearance.
- `referee-R2-work/ratio_gauss.py`: remainder normalisation, Gaussian identity, Stirling constant, bracket.
- `referee-R2-work/direct_wall.py`, `direct_wall.json`, `direct_wall.log`: direct test (22 min).
- `referee-R2-work/polymath_src/debruijn.tex`: Polymath arXiv source (reference only).
- `referee-R2-work/pt/pt.txt`: Platt-Trudgian arXiv v1 text (reference only).
