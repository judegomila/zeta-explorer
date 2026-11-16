# REFEREE: b-route-m-first-moment

Date 2026-11-16. Adversarial referee pass on RESULT.md. Scripts: /tmp/ref-routem/r1.py, r2.py, r3.py
(independent code, different cases from check1/check2).

## Verdict

holds = true. Every step labelled PROVED was re-derived by hand and confirmed. No fatal error found.
Defects are in labelling and wording (below), not in the mathematics. No RH content, no Lambda bound
moves, nothing assumes RH, nothing restates verified height.

## Re-derivation, step by step

- L1 (CLASSICAL). Not re-derived from Vasyunin's paper. Re-checked numerically on 8 pairs not in
  check1.py: (4,9), (13,21), (9,4), (17,100), (1,1), (1,23), (29,30), (8,15). Vasyunin closed form at
  30 digits lies inside a rigorous two-sided bracket of a b int {t/a}{t/b} dt/t^2 (exact piecewise
  integration to T = 400ab, tail bracketed by Hurwitz zeta; bracket width ~1.6e-6). Symmetry
  I(4,9) = I(9,4) confirmed. A(1) = 2C = log 2pi - gamma confirmed.
- L2. Confirmed. Lower: {t}{lambda t} = lambda t^2 on t < 1. Upper: three ranges give
  lambda + lambda log(1/lambda) + lambda. Numerically a <= I(a,b) <= a(2 + log(b/a)) for all coprime
  a < b <= 1400.
- L3. Confirmed, including lambda = 0 (A(0) = 0) and the bad-set count n <= mu T. Total
  h(1 + log T) + h(1 + log(mu T)) + h <= h(3 + 2 log(1/h)). Numerically worst ratio 0.42 over 4e5
  random pairs of Farey points of order 1400.
- L4. Confirmed. omega(h) = h(3 + 2 log(1/h)) has derivative 1 + 2 log(1/h) > 0 on (0,1]; cell error
  <= omega(1/n); Moebius sum has at most 2^omega(b) nonzero terms.
- L5. Confirmed. int_0^t {v} dv = ([t] + {t}^2)/2; J2, J3 summands checked by quadrature at n = 3
  (agree to 28 digits); J2, J3 sums and K = 0.69549605113085946722 agree with the closed forms to
  28 digits.
- Theorem 1. Confirmed. (i) sum of reduced residues is b phi(b)/2 for b >= 3, minus the a = 1 term.
  (ii) b A(1/b) <= 2 + log b. kappa(3) = 0.4411 >= 1/3. Run on all 3 <= b <= 1400: floor never
  violated (min slack 0.65), worst ratio of (ii) 0.045.
- Corollary 1. Confirmed. f(u) = C(1+u) + (1/2)(1-u) log u is increasing, int_0^1 f = (3/2)C - 3/8.
  The quoted identity sum_{a coprime} V(a,b) = 0 follows from g(m) = sum_a {ma/b} being invariant
  under m -> b - m while cot is odd; V(1,b) = O(b log b). Numerically sum_a V(b,a)/(b phi(b)) =
  -0.079584 at b = 1260 against -1/(4 pi) = -0.079577; error/(2^omega b log b) <= 0.082 for
  50 < b <= 1400. The O-constant is not explicit (the note says so).
- Section 3. Confirmed against the repo definitions: imp-96708 T(M) = sum over coprime 2 <= a,b <= M
  of I^2/(a^2 b^2) = 2 sum_b Q(b)/b^2, and G(ka,kb) = I(a,b)/(k a b), so Int >= T is the k = 1 part.
  Q(b) >= phi(b) - 1 confirmed for all b <= 1400.
- Theorem 2. Confirmed. |g(mu) - g(lambda)| <= (5 + 3 log n)/j with g = A(lambda)/lambda, and
  g <= 2 + log n on [1/n, 1]. First-cell integral formula correct. Plancherel constant correct:
  int_0^inf A^2 lambda^-2 d lambda = 2 s0 by A(lambda) = lambda A(1/lambda), Mellin transform
  zeta(w) zeta(1-w)/(w(1-w)) on Re w = 1/2. Frobenius slope 2 s0 = zeta(2) * 12 s0/pi^2 is consistent
  with the imp-96708 sandwich upper end. Worst bound ratio 0.026 for b <= 1400. Measured Frobenius
  increment on [700,1400]: 5.80 (prediction 5.84).
- s0. Independent quadrature with a different panel layout: 2.9192914 (to T = 60), 2.9193026
  (to T = 250); note value 2.9193029 (to T = 400). Farey trapezoid of (A/lambda)^2 at order 1400 gives
  about 2.914 with the log^2 head under-counted. Consistent. The value is float quadrature without an
  error enclosure, and the tail bound uses an unreferenced |zeta(1/2+it)| <= 3 t^(1/4). Label MEASURED
  is correct. No inequality in the note depends on the numerical value of s0.
- Theorem 3. Confirmed. Schur test with p_n = n^-1/2; envelope e^(-|u|/2)(2+|u|) is decreasing in |u|;
  x -> env(m/x)/x is decreasing on both sides of x = m; first term m^-1/2 (2 + log m) <= 2; integral
  = 16. Independent Gram build at N = 350, 700, 1400: lam_max = 5.079, 5.362, 5.615; Schur row max
  5.58, 5.93, 6.24. All below 18 and consistent with the note's table.

## Errors and overstatements

1. Section 5 and section 8 item 3 call 8.5305 <= lim lam_max "PROVED at sketch level" and "the proved
   two-sided statement". Only the upper bound 18 is written out. The lower limit is a sketch. I checked
   that the sketch can be completed (Rayleigh quotient with c_n = n^-1/2; rows with
   log N <= m <= N/log N carry 1 - o(1) of the harmonic weight and their truncated row sums converge to
   int k d lambda/lambda by dominated Riemann sums), so the statement is true, but its grade in the
   note should be SKETCH, not PROVED.
2. Section 7 says "the same proofs run" for Davenport-Heilbronn. Not verbatim. L2's lower bound uses
   {t} = t on (0,1); the DH summatory function vanishes on (0,1), so the floor I >= min(a,b) and the
   constant 1/2 do not transfer as written. Control run here: DH partial sums over a period are
   0, 1, 1.284, 1, 0, which are >= 0, and A_DH(lambda)/lambda = 0.593, 0.573, 0.584, 0.776, 0.831,
   0.985 at lambda = 0.05, 0.2, 0.3333, 0.5, 0.7071, 0.99. So a DH analogue with kappa > 0 is
   supported numerically with different constants. The conclusion (Euler-blind, no RH content) stands;
   the DH statement itself is MEASURED, not proved.
3. Verdict label "proved-new-result": new relative to the repo only. The ingredients (A continuous,
   its Mellin transform, the Gram matrix as a function of m/n) are in Baez-Duarte, Balazard, Landreau,
   Saias 2005. The note says no literature search was done for the corollaries. The floor
   I(a,b) >= min(a,b) is a one-line observation. Accurate label: proved, elementary, new to the repo,
   novelty in the literature unchecked.
4. L1 carries the whole note and is CLASSICAL plus numerics. Now checked on 16 pairs in total and
   implicitly on all coprime pairs up to 1400 through the L2 sandwich. Not a defect, but it is not a
   proof inside the note.
5. Minor: Corollary 1 and "closes the imp-97096 remainder sub-gap" have no explicit constants.

## What survives

- PROVED: F(b) >= b phi(b)/2 - 1 for b >= 3; |F(b) - K b phi(b)| <= b 2^omega(b)(3 + 2 log b) + 2 + log b
  with K = (3/4)(log 2pi - gamma) - 1/4; kappa_cot -> 1/8; Int(N) >= (36 K^2/pi^2) log N - O(1);
  Q(b) >= phi(b) - 1; Q(b) = s0 phi(b) + O(2^omega(b) log^3 b) with explicit constant; slopes 12 s0/pi^2
  and 2 s0; lam_max(G_N) <= 18 for all N.
- MEASURED: s0 = 2.9193.
- SKETCH (completable): lim lam_max(G_N) >= 4 zeta(1/2)^2.
- OPEN: sup_m sigma_m = 4 zeta(1/2)^2.
- All conditional on L1 (classical Vasyunin/BBLS identity).
- Mean-value statements about the Nyman-Beurling Gram matrix. No statement about lam_min, d_N or zeros.
