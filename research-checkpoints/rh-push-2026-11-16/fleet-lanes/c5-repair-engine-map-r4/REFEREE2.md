# Second check of Theorem 2 (and its corollary) of c5-repair-engine-map-r4

2026-11-18. Written by lane `c6-repair-referee-debts-r5`. Scope: section 2.3, Theorem 2 and the Corollary.
Result: **Theorem 2 holds as stated; the Corollary holds for the largest real zero** (first referee's E1 confirmed).
Numerical check with a chi not used before: `push/c6-repair-referee-debts-r5/thm2_check.py`, `.json` (local,
`scripts/memcap.sh 8`, float64, X = 2e5).

## Re-derivation (every constant)

Setting: chi unimodular completely multiplicative, g = chi * mu, B(y) = sum_(d<=y) abs(g(d)) <= C y^beta, beta < 1.
- c = sum g(d)/d converges absolutely; tail sum_(d>y) abs(g(d))/d <= C y^(beta-1)/(1-beta) (Stieltjes integral,
  boundary term negative). Euler factor of g at q: 1 + ((chi(q)-1)/q)/(1 - chi(q)/q) = (1 - 1/q)/(1 - chi(q)/q),
  never zero, so c != 0. abs(c) <= 1 because abs(S(x)) <= x.
- (i) For p not dividing a: n = dm = a mod p forces p not dividing d and m = a d^-1; count X/(dp) + O*(1).
  S(X; p, a) = (X/p) c_p(X) + r_a, abs(r_a) <= B(X). Class 0: chi(p) S(X/p) (complete multiplicativity).
- (ii) T(k/p) = chi(p) S(X/p) - (X/p) c_p(X) + O*((p-1) B(X)), and
  chi(p) c X/p - (X/p) c (p - chi(p))/(p - 1) = c X (chi(p) - 1)/(p - 1). Error:
  abs(E(X/p)) + C X^beta (1/(p(1-beta)) + p - 1) <= abs(E(X/p)) + C_1 p X^beta. Correct.
- (iii) T(xi) = c (1 - e(-xi X))/(2 pi i xi) + e(-xi X) E(X) + 2 pi i xi Ehat(xi) (E(0) = 0). With abs(c) <= 1 the
  first term is at most p/(pi abs(k)) at xi = k/p. Correct.
- (iv) For F = fhat, f supported on an interval of length X: abs(F(xi_r))^2 <= delta^-1 int_(I_r) abs(F)^2 +
  int_(I_r) abs(F F'), I_r the interval of length delta centred at xi_r; summing over disjoint I_r and using
  norm(F') <= pi X norm(f) after centring gives (pi X + 1/delta) norm(f)^2. Points k/p: spacing >= 1/(p p') >=
  Q^-2 for different primes, >= 1/p for the same prime. Correct.
- (v) (max(0, a-b))^2 >= a^2/2 - b^2 (equivalent to (a - 2b)^2 >= 0 when a >= b). sum_(0<abs(k)<p/2) (p/(2 pi k))^2
  lies in [p^2/(2 pi^2), p^2/12]. a-part >= abs(c)^2 X^2 abs(chi(p)-1)^2/(4 pi^2). b^2 <= 4(2M^2 + C_1^2 p^2
  X^(2 beta) + p^2/pi^2). For Q <= X^(1/2): (pi + 1 + 2/3) X^2 M^2 < 5 X^2 M^2 and sum p^4 <= Q^5. With
  Q^5 = X^(2-2 beta) (and 2(1-beta)/5 < 1/2): the stated inequality. Correct.

Corollary: beta > (1 + b)/2 from Theorem 1 by Cauchy-Schwarz (sum abs(1-chi(p)) p^-sigma <= (sum abs(1-chi(p))^2
p^-sigma')^(1/2) (sum p^(-(2 sigma - sigma')))^(1/2), sigma' > b, 2 sigma - sigma' > 1) and Rankin's bound for B;
V(y) << y^(5 theta/(1-beta)); 1 - Re z^k <= k^2 (1 - Re z); C6 at sigma_0 = b. Both uses of b need b to be the
largest real zero. Statement proved: **the largest real zero b of F in (theta, 1) satisfies b(1 - b) <= 10 theta.**
The exponent-zero statement (no real zero in (0, 1) when E(x) << x^eps for every eps) is unaffected.

## Numerical check (MEASURED, float64)

chi(p) = exp(2 pi i j/5), j in {1, 2, 3, 4} in turn, on 94 primes p = 1 mod 4 chosen by a square-root counting rule
(first members 5, 29, 73, 149, 257, 389), chi(p) = 1 elsewhere; X = 200000. chi = 1 * g verified at three x.
c = 0.730330 + 0.155117 i, B(X) = 476.6, sup abs(E) = 66.94. Step (ii) at p = 3, 5, 13, 17, 29, 37, 101, 211 and
three k each: abs(T - main) between 11.6 and 83.4 in all 24 cases, against main terms 43885 (p = 5) and 10144
(p = 29) and 0 for p outside the set; all within the proved error bound. Assembled inequality of step (v) with the
measured B(X) and tail in place of C_1 X^beta: holds at Q = 10, 30, 100, 300, 447 with ratio lhs/rhs between 1.8e-9
and 3.1e-6 (the inequality is far from sharp at this size; the check confirms consistency, not the exponent).

Status after this note: Theorem 2 PROVED (author, two referee passes); map section 4 entry 49 and row P46 corrected
to "largest real zero" by this lane. No bearing on zeros of zeta.
