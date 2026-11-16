# Where must the Euler product enter the real-Pick (theta) ladder? A DH-controlled measurement

Working note, 2026-11-16. Scope: tmp/research-2026-11-16/euler/ only. Nothing committed or pushed. No RH claim and no new
zero-free region. Labels: PROVED (short argument given here), CLASSICAL, MEASURED (mpmath, not interval-certified),
ARGUED (heuristic), OPEN.

## 0. Plan (written before the main computations)

### Target

The atlas closing line names three forms of the missing input: (1) an all-scale signed arithmetic estimate, (2) a cofinal
actual-form floor, (3) an exhaustive theta collision certificate. The most active lane since the atlas (PRs 48, 50, 54,
56) works in a fourth coordinate system: positivity of the real Pick matrices of

  L(z) = F'(z)/F(z),  F(z) = xi(1/2 + z),  K(x,y) = (L(x)+L(y))/(x+y),  x, y > 0.

All-order positivity of K on (0, inf) is equivalent to RH (PR 54 section 6; classical Pick/Hadamard, recalled in
section 1). The lane has proved orders 3, 4, 5 and has reduced order 6 to two mixed source signs. It does not say at which
order the Euler product has to enter. Every route closed in the atlas stopped at the first step that needed Euler-product
input (round 1-3 syntheses, section 2.2 in each). So the question for this lane is concrete:

  **Q.** What is the smallest order N at which real-Pick positivity fails for the Davenport-Heilbronn function (DH)?
  Below that order, every true statement about the N-node Pick matrices of xi is also true for DH. It therefore carries
  no Euler-product content, and no proof of it can supply the missing estimate.

Companion question: for xi with one zero pair moved off the line to 1/2 + delta +- i gamma (an entire FE-symmetric twin,
the round-3 "zeta_W" type), at what order N*(gamma, delta) does Pick positivity first fail? This measures the height
horizon of order N.

### What is new relative to the atlas and the walls

| Atlas item / wall | Overlap | What is new here |
|---|---|---|
| Section 2 (shifted bridge), section 8 (Schur/Hankel norm) | Positive-real/Schur reformulations of RH | A different object (real-node Pick matrices of F'/F) and a measured *order* at which DH first fails. The atlas measures widths and shifts, not Pick orders. |
| Sections 5-6 (theta collision; PR 17/18 finite boxes) | Finite theta certificates are verified-height statements | The same verdict, quantified in Pick-order coordinates: a horizon N*(gamma, delta) and an Euler-blind order N_DH |
| Section 9 (fixed-support floor), section 10 (V7 floor) | Floors are equivalent to half-planes (Lemma L, round 1) | Not used. The Pick ladder is graded by order, not support. |
| PR 50 conditional interpolation theorem | An off-axis zero gives a negative finite Pick test at *some* order, with no bound | Measured bounds: how the order grows with gamma, and a lower bound on the order at which DH fails |
| Flow-blindness | Soft hypotheses stable under small backward heat flow cannot give RH | Each finite order is an open condition, so it is flow-stable. This note measures how far each order sees. |
| DH twin (route I: Euler-blind to 2a >= 0.783 proved, ~1.7 measured) | The same control idea | The first DH-blindness measurement for the Pick/theta ladder |
| MV-CAP, NS-RIGID, verified height | Not addressed directly | The horizon N*(gamma) says how fast verified height has to grow with Pick order |

What this angle cannot do: it cannot prove RH or any form (1)-(3). The best possible outcome is a precise obstruction. That
outcome would say the lane's per-order tools are DH-blind up to an explicit order, and it would give the shape of the
height horizon. A secondary outcome would be a Pick order or node family at which DH fails *early* while xi passes. That
would point to where an Euler-product estimate could bite.

### Method

* DH: f = ((1-i kappa)/2) L(s,chi) + ((1+i kappa)/2) L(s,chi-bar), chi mod 5 with chi(2) = i. Lambda(s) =
  (5/pi)^{s/2} Gamma((s+1)/2) f(s) = Lambda(1-s). Real coefficients Re chi(n) + kappa Im chi(n).
* L at real nodes from mpmath (digamma + Dirichlet-series log-derivative), precision 40 + 8N digits. LDL^T of the
  unit-diagonal Pick matrix; the first nonpositive pivot gives the first indefinite order on a nested node sequence.
* Controls: zeta (must stay positive definite), DH (must fail at some order), planted twins (must fail at N*).
* Precision checks at two or three precisions for every reported sign.

## 1. Setup and the facts used

F is even, entire of order 1, real on R, F(0) != 0. This holds for xi(1/2+z) and for the DH completion
Lambda_DH(1/2+z); f_DH(1/2) = 0.8254. By Hadamard, L(z) = F'/F = sum over pairs {w, -w} of 2z/(z^2 - w^2), absolutely
convergent.

**(1.1) Kernel of one zero cluster (PROVED, two lines).** For real x, y > 0, write a_w(x) = 1/(x - w), S(x,y) = 1/(x+y)
(the Cauchy kernel, which is PSD), and t = 2 Re w.

* On-line zeros +-i gamma contribute 2 Re[a(x) conj a(y)] with a = a_{i gamma}. This is PSD of rank at most 2.
* An off-line zero w = delta + i gamma, together with its FE mirror -conj(w) and their conjugates, contributes
  2 Re[ a a^* + b b^* + 2 delta S o (b b^* - a a^*) ], where a = a_w, b = a_{-conj w}, and o is the Schur product.
  Since |a(x)| > |b(x)| for x > 0, the last term is indefinite, of size about delta^2/gamma^4 on bounded nodes.

**(1.2) Criterion (CLASSICAL; PR 54 section 6).** All zeros of F lie on iR if and only if K(x,y) = (L(x)+L(y))/(x+y) is
PSD on every finite subset of (0, inf). Necessity follows from (1.1). For sufficiency: positivity on a set with an
accumulation point gives a positive-real extension of L to Re z > 0 (Pick-Nevanlinna). That contradicts the pole of L at
an off-line zero. Write P_N for "every N-node real Pick matrix is PSD". RH is equivalent to P_N for all N. PRs 48/50/54
establish P_3, P_4, P_5 for xi and reduce P_6 to two mixed source signs.

**(1.3) Each order is open (PROVED for fixed nodes).** For the twin F_gamma = F Q/P (one on-line pair at +-i gamma moved
to +-delta +- i gamma), Q/P -> 1 locally uniformly as gamma -> inf. So L_gamma -> L with all derivatives on compact
subsets of (0, inf). Strict PD of a fixed N-node matrix for F therefore persists for gamma above some gamma(nodes). Making
this uniform over *all* node sets requires compactifying the configuration space (coalescence, x -> 0, x -> inf). That
step is not done here (OPEN). The numerics in section 2 measure the threshold directly.

**(1.4) Confluent limit at the symmetric point (CLASSICAL).** L is odd, with L(z) = sum_m l_{2m+1} z^{2m+1} and
l_{2m+1} = 2 (-1)^m s_{m+1}, where s_k = sum over pairs of (-w^2)^{-k}; under RH, s_k = sum gamma^{-2k}. The Taylor
block of K at 0 splits by parity into the Hankel matrices [s_{i+j+1}] and [s_{i+j+2}]. So nodes clustered at 0 test
whether (s_k) is a Stieltjes moment sequence of the measure sum delta_{1/gamma^2}. An off-line pair adds a non-real atom
at u = 1/(gamma - i delta)^2. That atom sits inside the real cloud, at relative imaginary offset about 2 delta/gamma.
This is the mechanism measured in section 2: resolving one complex atom inside a cloud of real atoms that accumulate at
u = 0.

**(1.5) Dictionary to the Weil form (PROVED, one line).** For h(t) = sum_i c_i e^{-x_i t} 1_{t>=0}, the quadratic form
of the N-node Pick matrix is sum c_i c_j K(x_i,x_j). Its spectral side is sum over zeros of the boundary values of
h-hat(tau) = sum c_i/(x_i - i tau), with the cluster weights from (1.1). So P_N is Weil positivity restricted to the
cone of N-term exponential sums on the half-line. On nodes x > 1/2, L(x) is given by an absolutely convergent
expression: 1/(s-1) + 1/s - (1/2)log pi + (1/2)psi(s/2) - sum_n Lambda(n) n^{-s}, with s = 1/2 + x. So the P_N
restricted to x_i > 1/2 are inequalities between absolutely convergent prime sums. By (1.2) they are still equivalent
to RH in aggregate. This is the Pick-matrix form of Lagarias' criterion (Acta Arith. 89 (1999)): RH holds iff
Re xi'/xi(s) > 0 on Re s > 1/2. In these coordinates the Euler product enters as the *positive* measure
sum Lambda(n) n^{-1/2} delta_{log n}, and it enters with a minus sign (atlas section 9). Positivity of Lambda points the
wrong way for a lower bound. That is the same sign problem as in every closed route.

## 2. Measurements

All runs: mpmath 1.3.0 (.venv-arb, Python -I), unit-diagonal Pick matrices, LDL^T without pivoting. The first
nonpositive pivot on a nested node sequence gives the first indefinite order. Nodes: van der Corput sequence in log x
on the stated interval. Precision 40 + 8 Nmax digits. Scripts: `pick.py`, `nested.py`, `twin2.py`, `optnodes.py`.

### 2.1 A precision trap, and what it shows (MEASURED)

The first DH run reported indefiniteness at N = 12-30, depending on the interval. The negative pivots were about 1e-41
and did not change across three working precisions. Cause: kappa was a module constant computed at 40 digits. At higher
working precision the function used was DH + O(1e-40) x (an FE-odd perturbation). Once kappa is recomputed at working
precision, DH is positive definite on the same nodes through N = 40 and beyond (section 3).

So an FE violation of relative size 1e-40 is detected at Pick order 12, while an off-line zero pair at height 60 is not
detected below order about 60 (section 2.2). The low orders of the ladder mainly test the exact functional equation and
analytic regularity. DH has both.

### 2.2 Height horizon of a planted off-line pair (MEASURED)

xi with one on-line pair moved to 1/2 +- delta +- i gamma ("move", at actual zeta ordinates) or with one off-line
quadruple added ("add"). Nodes nested in [0.01, 0.5], Nmax = 100, 840 digits. zeta itself: positive definite through
N = 100; pivots 3.9e-21 (N=5), 7.3e-118 (N=20), 8.6e-391 (N=60), 2.5e-683 (N=100).

| twin | gamma | delta | first indefinite order N* |
|---|---|---|---|
| move | 14.1347 (zero 1) | 0.3 | 7 |
| move | 21.0220 (zero 2) | 0.3 | 12 |
| move | 25.0109 (zero 3) | 0.3 | 15 |
| move | 32.9351 (zero 5) | 0.3 | 24 |
| move | 43.3271 (zero 8) | 0.3 | 34 |
| move | 56.4462 (zero 12) | 0.3 | 49 |
| move | 77.1448 (zero 20) | 0.3 | 81 |
| add | 14 | 0.03 | 15 |
| add | 20 | 0.3 / 0.03 | 13 / 18 |
| add | 40 | 0.3 / 0.03 | 34 / 41 |
| add | 50 | 0.3 | 44 |
| add | 60 | 0.3 | 65 |
| add | 80 | 0.3 | 92 |

Least-squares fit on the move family: N* = 0.150 gamma^1.441, maximum log-residual 0.037. The add family gives
0.181 gamma^1.422. The fit N* = c gamma log gamma is worse (relative error up to 21%). The dependence on delta is weak
(gamma = 40: 34 at delta = 0.3, 41 at delta = 0.03). An earlier Chebyshev-node run at 40 + 3N digits gave a spurious
N* of about 24 for every gamma. That was a precision floor, since zeta's own pivots fall below 10^{-dps} near N = 26.
It is discarded.
