# Pre-registration (written before any r = 5 run; 2026-11-18)

Object: exact dual decomposition J' = Diag + Princ + NP of the F_q[T] probe (round 8, `dual.py`), q = 7,
(k, N') = (6, 6) (even blocks: principal row present), geometries (N, lam) = (6,0), (5,1), (4,2), (3,3), (2,4).
Size 1: d = 7 (r = 4, about 2800 rows). Size 2: d = 6 (r = 5, about 19,600 rows). Extra if time: d = 8 (r = 3), d = 5 (r = 6).

Statistic: theta_w = log(T1 / |NP|) / log U (T1 = sum of |c_u| over non-principal rows, U = number of non-zero rows).
Secondary (reported, not used for the decision): |NP| / RMS.

Weights: (a) targets a, b (W = quadratic character; the Moebius factor of 1/L is in the kernel);
(b) lnu = mu nu_a; (c) rm:1..8 random completely multiplicative signs, rma:1..8 = nu_a times such signs;
(d) n:1..8 random +-1 not multiplicative, g:1..4 random integers in {-3..3};
(e) aligned vector of Lemma A: W = mu (mu(A') W = mu^2: reciprocal zeta/zeta(2s), pole at s = 1); also t (W = 1).

Decision rule. Geometries used: N >= 3 (for N <= 2 several weights coincide). At each size:
  E = mean over geometries of theta_a  -  max( mean over geometries and seeds of theta_rm, same for theta_n ),
  S = max over the classes rm, n of the standard deviation over seeds of (mean over geometries of theta).
Target excess is REAL iff E > S at size 1 and at size 2 (same for target b; both targets must pass).
Otherwise ABSENT. Records with NP = 0 for a weight are excluded for that weight and counted.
