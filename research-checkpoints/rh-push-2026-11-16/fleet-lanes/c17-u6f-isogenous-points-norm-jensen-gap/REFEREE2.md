# REFEREE2 (second, independent): c17-u6f-isogenous-points-norm-jensen-gap

Date 2026-11-20. Written by lane `c18-referee-r17-independent-sources`. Scope set by the assignment: the norm identity, the Jensen-gap limit log(p/(p+2)), the Epstein rows at n = 5, 6 with a numeric non-vanishing check. Derived before the first referee file was opened; compared afterwards. Numerics: `push/c18-referee-r17-independent-sources/ref2_checks.py`, `ref2_checks.json` (mpmath, 40 digits, direct q-series of theta, point values summed and multiplied one by one; local, memcap 8 GB; not ball arithmetic). No statement about zeros of zeta is made by the lane or here.

## Verdict: HOLDS WITH CORRECTIONS (one reading of the Epstein row). No PROVED label in scope breaks.

## Norm identity (Lemma N): holds

Own derivation, without lane n3: theta = eta(2 tau)^5/(eta(tau)^2 eta(4 tau)^2) and log eta(tau) = pi i tau/12 - sum_m sigma_(-1)(m) q^m give log theta = sum_m c(m) q^m with c(m) = 2 sigma_(-1)(m) - 5 sigma_(-1)(m/2) + 2 sigma_(-1)(m/4) (the linear terms in tau cancel: 10 - 2 - 8 = 0), Dirichlet series zeta(u) zeta(u+1)(2 - 2^-u)(1 - 2^(1-u)). For odd p, sigma_(-1)(pm) = (1 + 1/p) sigma_(-1)(m) - (1/p) sigma_(-1)(m/p) passes to c. Then
sum_(b mod p) L((tau+b)/p) = p sum_m c(pm) q^m = (p+1) L(tau) - L(p tau);
p^2 c(p^2 m) = (p^2+p+1) c(m) - (p+1) c(m/p), so sum_(b mod p^2) L((tau+b)/p^2) = (p^2+p+1) L(tau) - (p+1) L(p tau);
sum_(b mod p) L(tau + b/p) = (p+1) L(p tau) - L(p^2 tau) (the first formula at p tau).
Adding, the terms (p+1) L(p tau) cancel; removing the two real points theta(x/p^2) and theta(x): log N_p = (p^2+p) L(x) - L(x/p^2) - L(p^2 x). The product form needs no choice of branch. Sum identity: sum_(b mod p^2) theta((tau+b)/p^2) = p^2 theta(tau), sum_(b mod p) theta(tau + b/p) = p theta(p^2 tau); minus the real points, (p^2-1) theta(x) - theta(x/p^2) + p theta(p^2 x).
Numeric (p = 3, 5; x = 0.37, 2.1; all n = 10 and 28 point values computed): sum identity relative defect <= 5e-41, log-norm defect <= 3.1e-39.

## Jensen gap (Lemma J) and the limit: holds

J = log((p^2 - 1 - beta + p gamma)/n) + (log beta + log gamma)/n from A = theta (p^2 - 1 - beta + p gamma)/n and N = theta^n/(beta gamma). 1 < beta < p from theta decreasing and theta(x) = x^(-1/2) theta(1/x); 1/p < gamma < 1 by the same bound at p^2 x. Increasing in gamma, so J < psi(beta) = log((n + 1 - beta)/n) + (log beta)/n, psi(1) = 0, psi' = (n+1)(1 - beta)/(n beta (n + 1 - beta)) < 0. As x -> 0: beta -> p, gamma -> 1/p, J -> log((p^2 - p)/(p^2 + p - 2)) = log(p/(p+2)).
Numeric at x = 1e-3: J = -0.5108256238, -0.3364722366, -0.2513144283 for p = 3, 5, 7; log(p/(p+2)) agrees to the 10 digits printed.

## Epstein rows, n = 5, 6

Inert primes rechecked by Legendre symbols: (-5/11) = (-5/13) = -1, (-5/3) = (-5/7) = +1; (-6/13) = -1, (-6/5) = (-6/7) = (-6/11) = +1. For p inert and not dividing 2n, p | a^2 + n b^2 forces p | a, b, which gives both sum relations; log f = (1 + D_n) log theta and p not dividing n give the norm identity at every p not dividing 2n. Corollary re-derived: with 1 < beta < p^2 and 1/p^2 < gamma < 1, S = p^2 - 1 - beta + p gamma > -1 + 1/p; if S > 0 then beta < n + 1 and J < psi(beta) < 0; if S <= 0 then abs(S) < 1 and J < -log n + (2 log p)/n < 0. Holds.

Numeric (all point values, x = 0.02, 0.3, 1.7):

| form, prime | sum identity (rel. defect) | norm identity (log defect) | A | J | min abs(v_j) |
|---|---|---|---|---|---|
| n = 5, p = 11 (inert) | <= 2.9e-36 | <= 1.2e-23 | -0.0873, 0.4128, 0.7717 | -5.533, -1.474, -0.242 | 6.0e-3, 3.7e-21, 2.5e-20 |
| n = 5, p = 13 (inert) | holds | holds | -0.0520 at x = 0.02 | -6.053 at x = 0.02 | 9.5e-5 at x = 0.02 |
| n = 5, p = 3 (split) | fails (3.4 at x = 0.3) | holds (3e-40) | 1.981 at x = 0.3 | +0.1996 at x = 0.3 | 0.40 |
| n = 6, p = 5 (split) | fails (2.8 at x = 0.3) | holds (1e-38) | 2.037 at x = 0.3 | +0.1848 at x = 0.3 | 5.8e-3 |

(Complete rows, including n = 6, p = 13, in `ref2_checks.json`.) These agree with the lane's table (signs of A and J, identity pattern).

Non-vanishing check, three parts.
1. Point values. theta has no zero in the upper half-plane, so every v_j is non-zero and N_p > 0 (PROVED). Numerically the smallest point values are of size 1e-21 to 1e-20 at x = 0.3 and 1.7 (n = 5, p = 11): the points (i x/2 + b)/p^2 with b/p^2 close to 1/2 lie high in the cusp where theta vanishes. They are non-zero, and the norm identity holds to 1e-23 with them, but a float64 evaluation would not separate them from 0. The lane's 1536-bit runs are adequate; a certified sign for these values needs at least 100 bits.
2. The mean A_p. Correction E-A: for the Epstein forms at inert primes A_p vanishes on the arc. Zero found at x = 0.0406538725 (n = 5, p = 11), 0.0344009099 (n = 5, p = 13), 0.0314031055 (n = 6, p = 13); one sign change each on 1e-3 <= x <= 10. At that point J_p = -infinity. "Epstein passes (J)" is therefore true only as the inequality J_p < 0 with the value -infinity allowed, which the Corollary states ("possibly -inf") and section 0 does not. As a read (log abs A) it is singular for the control and regular for theta (A_p > 0 on the whole arc for theta, since beta < p). The read therefore distinguishes theta from the Epstein control by the sign of A_p near the cusp, not by the sign of J_p. This sign condition is S > 0, i.e. f(x/p^2) < (p^2 - 1) f(x) + p f(p^2 x); it holds for theta through beta < p and fails for a weight-1 form (beta -> p^2). It is a weight statement (theta has weight 1/2), not an arithmetic one; it gives no flag.
3. The controls have off-line zeros (the lane took this from row G33 without re-measuring). The Epstein zeta function of [1, 0, n] alone is Z_5 = zeta(s) L(s, chi_-20) + L(s, chi_-4) L(s, chi_5) and Z_6 = zeta(s) L(s, chi_-24) + L(s, chi_-3) L(s, chi_8) (genus characters; checked against the direct double sum at s = 4 to 12 digits). Zeros found by Newton iteration at 20 digits (not ball-certified): Z_5 at 0.932969697485 + 15.6682495313 i, 0.9376669067 + 29.9833952352 i, 0.696927045312 + 36.3740636864 i; Z_6 at 0.803749128556 + 15.1175785331 i, 0.825614931321 + 33.5923301259 i; abs(Z) < 1e-21 at each. So the control that passes (N), (J), (D) at inert primes has zeros off its critical line: R3 is not met, as the lane says.

## Comparison with the first referee

Same verdict. Item 2 (zero of A_p for the control and the reading of "passes (J)") and item 3 (off-line zeros re-measured) are additional. Not checked by this referee: Lemma D, the Mellin decay rates, the twin rows.

## Flags

R1 false, R2 false, R3 false, R4 false. Referee count for the lane: 2, both hold.
