# Second check of Lemma A step (c) of c5-twisted-helson-arcs

2026-11-18. Written by lane `c6-repair-referee-debts-r5`. Scope: step (c) only (general M). Result: **holds**.

Hypotheses used: chi completely multiplicative with abs(chi(n)) = 1; for every prime p, abs(T(x; a/p)) <= C_p
x^theta for p not dividing a and x >= x_p, theta < 1; limsup abs(S(x))/x > 0. M is not used.

Re-derivation, u(x) = S(x)/x.
1. From (*): u(x) = chi(p) u(x/p) + O_p(x^(theta-1)) for x >= x_p. Since abs(chi(p)) = 1 this can be read in both
   directions: u(px) = chi(p) u(x) + o(1) and u(x/p) = chi(p)^-1 u(x) + o(1). For a fixed positive rational
   r = prod p^(e_p): u(rx) = chi(r) u(x) + o_r(1), finitely many primes involved.
2. For x' >= x: u(x') - u(x) = (S(x') - S(x))/x' + S(x)(1/x' - 1/x), so abs(u(x') - u(x)) <= 2(x'/x - 1) + 1/x'
   (uses abs(chi) <= 1).
3. p = 2: abs(u(2^k y)) = abs(u(2^(k-1) y)) + O((2^k y)^(theta-1)); the errors sum to O(y^(theta-1)) uniformly in
   k >= 0.
4. Fix eps and a finite set R of rationals in [1, 2] such that every t in [1, 2) has r in R with abs(t/r - 1) <
   eps. For z >= x write z = 2^k t x. Then abs(u(z)) = abs(u(2^k r x)) + O(eps) + O(1/x) (step 2)
   = abs(u(r x)) + O(eps) + o(1) (step 3) = abs(u(x)) + O(eps) + o_eps(1) (step 1, abs(chi(r)) = 1, R finite).
   Hence sup_(z >= x) abs(abs(u(z)) - abs(u(x))) -> 0 after eps -> 0: abs(u) converges, and its limit l equals
   limsup abs(u) > 0. The passage from limsup > 0 to l > 0 is correct.
5. For rationals r >= r' > 0: (chi(r) - chi(r')) u(x) = u(rx) - u(r'x) + o(1), and step 2 gives
   abs(chi(r) - chi(r')) l <= 2 (r/r' - 1). So chi is a uniformly continuous homomorphism from the positive
   rationals (topology of the positive reals) to the circle; it extends to a continuous character of the positive
   reals, r -> r^(-i alpha). QED

Remarks. (i) Unimodularity is used in steps 1 and 4; a chi with chi(p) = 0 for some p is outside the lemma.
(ii) The first referee's qualifier stands: the identification needs limsup abs(S(x))/x > 0; in the branch
S(x) = o(x) the strict hypothesis is the strip statement for all L(s, psi) (map row P14). (iii) The row proposed by
the lane under the number P44 collides with the existing map row P44 (Gonek stage); it is not entered in the map
by this lane. No statement about zeros.
