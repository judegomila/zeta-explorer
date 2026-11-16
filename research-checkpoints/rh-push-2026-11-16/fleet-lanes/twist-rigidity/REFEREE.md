# Referee report: twist-rigidity/RESULT.md (2026-11-16)

Verdict: the PROVED claims (T1-T4, Corollary) survive re-derivation, with one hypothesis to add to Theorem 3 and
three wording errors. The "precise obstruction" verdict stands, but only for the class the author names in weakest
step 1. Nothing about zeros of zeta is claimed and nothing assumes RH or restates verified height.

## Re-derivations

* T1. Linearity + orthogonality; correct. The condition includes n = q^k (c^(q^k) = c_{chi_0}), so it forces e^T < q.
* T2. Fejer argument correct: int z^j dmu = c^(p^j) = 0 for 1 <= |j| <= k (c real), int F_k dmu = sum c_chi,
  F_k(1) = k+1. Equality in case (ii) with d = k+1. Correct.
* T3. Re-derived: sum of arch terms >= g(0)[(d-1) log q - d log pi + d psi(1/4)], psi(1/4) = -gamma - pi/2 - 3 log 2,
  giving -d log(8 pi e^{gamma+pi/2}); Re psi(sigma+it) increasing in |t| (series form); pole bound
  2|fhat(i/2)||fhat(-i/2)| <= 2 g(0) sqrt((1-e^{-T})(e^T-1)) = 4 sinh(T/2) g(0). Correct.
  DEFECT (statement): "T below the least prime power in H" must read "e^T <= min(least prime power in H, q)".
  q is ramified, zeta_K has a prime of norm q, and q is not in H, so the stated hypothesis does not exclude it. For
  d >= 6 the least prime power in H can exceed q in principle. The proof (via T1) and inert_search.py already use
  min(log p_H, d log 2, log q); both explicit instances are unaffected.
* T4. Items 1-3 correct; item 3 is a rewriting of W_zeta = pole + arch - P_zeta through item 2 (a tautology, as the
  author says).

## Errors and gaps

1. T3 statement omits e^T < q (above).
2. Corollary: "sum_{chi != chi_0} W_chi(g_0) = Arch_K(g_0) + N" drops the pole term unless Arch_K silently includes
   it (Section 1 defines arch and pole separately; the script folds pole into arch_z). Correct form:
   pole(g_0) + sum_chi arch_chi(g_0) + N. Also "N is at most P_zeta(|g_0|)" should be
   N = P_zeta - pole - arch_zeta, and arch_zeta can be negative (psi(1/4) - log pi = -5.37 per unit g(0) at low t).
3. T4 item 3: "which item 2 saturates" is wrong for d > 2. Item 2 gives sum_{chi != chi_0} P_chi = -P_zeta, i.e.
   mean P_chi = -P_zeta/(d-1); only d = 2 saturates |P_chi| <= P_zeta(|g|).
4. The summary sentence "a sign for W_zeta needs a constant-1 upper bound on twisted zero sums" is true only inside
   the class {non-negative weights, one test for all members, orthogonality, explicit formula}. It is not a theorem
   about all uses of the family.
5. Section 5: "the family zero sum is purely archimedean and positive" needs r large (even members contribute
   log(5r/pi) + psi(1/4)-type terms, negative for small r at low t). FE check re-derived: the twist maps to the
   psibar-twin at 1-s and the condition is chi_5(r)^2 = 1, r = +-1 mod 5; agrees. "H contains small composite n
   with c_f(n) != 0" is asserted, no n exhibited. Neither is numerically checked (author says so).
6. Novelty: T3 is the Weil/Odlyzko-Poitou explicit formula for zeta_K with no prime terms in the support. The
   device of using inert small primes to empty the prime side is standard in discriminant-bound work. Treat as known.

## Numeric reruns (different cases; .venv-arb python, script /tmp/ref-twist/chk.py)

* q = 11, d = 5 (quintic field, H = {1, 10}), f = x^3 (L-x)^4 (1+x), L = 2.25 < log 10: family zero side
  28.0766823418, arch only 28.0766823423, residual -4.7e-10; P_zeta = 9.1875, sum of the four P_chi = -9.1875
  (0.3696 x2, -4.9634 x2), total 3.6e-15. Each single explicit formula closes to 1e-10.
* q = 13, d = 3, f = x^4 (L-x)^3 e^{-x}, L = 1.58 < log 5: family residual -1.4e-13.
* Negative control q = 13, d = 3, L = 1.9 > log 5 (5 is in H): family residual -4.0413e-05 = -P_family
  (4.0413e-05). The identity fails by exactly the prime term in H, as it should.
* Instances: 87403 prime, = 1 mod 7, least primes in H 271, 283, 397; only prime power <= 2^7 in H is 2^7 itself
  (boundary, g(T) = 0); margin 8.2138. 91841: least prime in H 131, margin 7.8902. Constant 215.3325. Confirmed.

## DH control

Consistent. Case (i) holds for DH (so it is Euler-blind), case (ii) uses "log-derivative supported on prime powers"
and fails for DH, and by T4 it still gives nothing for zeta. Since the verdict is negative, no step needs to fail
for DH. No RH assumption; no verified-height restatement (T3 follows from the explicit formula alone).

## Is the obstruction real

Real for linear, same-test, non-negative-weight combinations. One way around not excluded: the Corollary says an
off-line zero of zeta forces the surplus N in the non-principal zero sums of every cyclic K with inert range past
e^T, for all d and infinitely many q at once. A zero-repulsion or log-free density bound restricted to that thin
family (not the full large sieve over q <= Q of Section 4) would be independent sign information. Obstacle seen
here: N is at most about 4 e^{T/2} g(0) while Arch_K is about (d-1) log q g(0), and unconditionally/GRH these are
of the same order or Arch_K larger, so the bound would need relative precision N / Arch_K; no known estimate has
it. Section 4 is order-of-magnitude only (I re-checked: since e^T < q <= Q the Q^2 term dominates and the
large-sieve constraint is satisfied trivially).
