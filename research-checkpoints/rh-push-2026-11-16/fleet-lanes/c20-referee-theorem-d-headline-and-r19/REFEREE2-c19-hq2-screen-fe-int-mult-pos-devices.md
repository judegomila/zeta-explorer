# REFEREE 2: c19-hq2-screen-fe-int-mult-pos-devices (Lemmas N, S, F, C)

Date: 2026-11-20. Lane: `c20-referee-theorem-d-headline-and-r19`. Each lemma was derived from its statement
before the lane's proof was read. Checks: `r19_checks.py` / `.log` (exact rational series, local). Nothing here
is a statement about a zero of zeta.

**Verdict: holds.** All four lemmas are correct as stated. Two remarks on domain and one shorter proof.

Notation: q prime, v = log q, u = q^(1/2 - s), m = R(u), G = zeta m, nu the coefficients of -G'/G.

## Lemma N (local Landau)

Domain of the positivity hypothesis: nu(q^k) >= 0 **for every k >= 1**; R rational with R(0) = 1; R has a zero in
abs u < 1.

Derivation. -m'/m = v u R'(u)/R(u). Each zero z contributes u/(u - z) = - sum_{k >= 1} (u/z)^k and each pole p
contributes + sum (u/p)^k, so u R'/R = sum c_k u^k with c_k = sum over poles of p^-k - sum over zeros of z^-k, and
nu(q^k) = v (1 + q^(k/2) c_k). The hypothesis gives c_k + q^(-k/2) >= 0. The function
Phi(x) = sum (c_k + q^(-k/2)) x^k = x R'(x)/R(x) + x q^(-1/2)/(1 - x q^(-1/2)) has non-negative coefficients, so
its radius r is a singular point (Pringsheim). Its singularities are the zeros and poles of R and x = sqrt q;
a zero lies in abs x < 1 < sqrt q, so r < 1 and x = r is a zero or a pole of R of least modulus. If x = r were a
zero of multiplicity k, Phi(x) would tend to -infinity as x -> r from the left (principal part k r/(x - r));
but Phi >= 0 on [0, r). So x = r is a pole, real, in (0, 1), with r <= abs z for every zero z. In s: a real pole
at 1/2 + log(1/r)/v, at real part >= that of every zero of the factor. PROVED.

This replaces the lane's Cesaro-mean step by one line (sign of Phi near r); the lane's step is also correct.
The hypothesis "zero in abs u < 1" is used only to get r < sqrt q; "a zero or pole in abs u < sqrt q" suffices.

Instances (exact series to k = 40 or 60): HQ1, q = 3, eps = 5 (zeros real, off the circle, poles on the circle):
first negative nu at k = 2. HQ1, eps = 3 (zeros on the circle): no negative nu for k <= 40 (c_k = 2 - 2 cos k theta,
re-derived). R = (1 + u^2/0.36)/(1 - 2u) (real pole 0.5 inside the zeros at 0.6 i): nu >= 0 for k <= 60, as the
lemma allows. R = (1 + u^2/0.16)/(1 - 2u) (zeros at 0.4 i inside the pole): first negative nu at k = 4, as the
lemma requires. HQ2, q = 3: first negative at k = 8, 13, 22 for eps = 1, 0.1, 0.01 (the control case must reach
that k).

## Lemma S

R(u) = R(1/u) and no zero or pole in abs u <= 1 give none in abs u >= 1, the point at infinity included
(R(infinity) = R(0) = 1); a rational function without zeros or poles on the sphere is constant. The Selberg-axiom
clause: log R = sum d_k u^k with d_k << q^(k (theta - 1/2)) converges on abs u < q^(1/2 - theta), a disc containing the
closed unit disc, so R has neither zero nor pole there. PROVED. Domain: R rational is taken from c18 Lemma Q
(not re-derived here; "relative to").

## Lemma F

Derivation. For p in S the divisor D_p of R_p(p^(1/2 - s)) is a finite integer combination of full lattices
{1/2 - (log u_0 + 2 pi i k)/log p}. A lattice of p and a lattice of p' != p share at most one point (two common
points would make log p/log p' rational). s -> 1 - s maps a p-lattice to a p-lattice (u_0 -> 1/u_0). The symmetry of
m gives sum over p of E_p = 0 with E_p = D_p - sigma(D_p). If some E_p != 0 its support is infinite (distinct
lattices of one prime are disjoint), while the support of the sum over the other primes meets it in finitely
many points. So every E_p = 0, R_p(u)/R_p(1/u) has no zero or pole on C minus {0} and equals c_p u^(k_p);
prod c_p p^(k_p (1/2 - s)) = 1 forces sum k_p log p = 0, hence every k_p = 0 (unique factorisation) and prod c_p = 1;
applying the relation twice gives c_p^2 = 1. PROVED. A factor with c_p = -1 has R_p(1) = -R_p(1): a zero or a pole
at u = 1, on the critical line, as the lane notes.

## Lemma C

Derivation. m = G/zeta = prod over p in S of (1 - y_p)/prod_j (1 - alpha_(p,j) y_p), y_p = p^-s, a finite product,
m(s) = m(1 - s). If no alpha_(p,j) equals 1 for some p, the lattice 2 pi i k/log p of zeros of 1 - y_p survives up
to finitely many points (poles of the same prime sit at y_p = 1/alpha != 1; lattices of other primes meet it in at
most one point each): infinitely many zeros on Re s = 0, hence by symmetry on Re s = 1, where m has none (all
zeros of m come from factors 1 - y_p'). So each p in S has some alpha = 1 (in particular d_p >= 1); after
cancelling, m is a product of factors (1 - alpha y_p)^-1. If one remains, abs(m(sigma + it)) -> 0 as sigma -> -infinity
uniformly in t, while m(sigma + it) = m(1 - sigma - it) -> 1. So m = 1. PROVED. Domain: finitely many modified
primes; "zeta's functional equation" used in the form m(s) = m(1 - s) only. The lane's list "each hypothesis is
needed" (gauge twins without the functional equation; HQ1 to HQ4 without the geometric shape) is consistent
with the control table.

## Flags and reading

R1 false: Lemma C is an identification for finitely many modified primes; Lemma N uses one local factor.
R2, R3, R4 false. The reading relevant to `REFEREE2_c1-leeyang-krein-limit.md`: the step that rejects every
one-prime twin is "each local Euler factor is zero-free and pole-free in Re s >= 1/2", a local size condition,
not multiplicativity.
