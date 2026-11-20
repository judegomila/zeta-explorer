# REFEREE 2: c19-d10-xd-determinant-pole-term-lemma-q (Lemma 1; Theorems 2, 3, 4)

Date: 2026-11-20. Lane: `c20-referee-theorem-d-headline-and-r19`. Each statement was derived by hand from the
definitions in the lane's sections 2 and 3 before its proofs were read; then checked in exact rational
arithmetic with code written here (`r19_checks2.py` / `.log`; Python Fractions; no code of the lane or of c18).
Nothing here is a statement about a zero of zeta.

**Verdict: holds with corrections.** Lemma 1 and Theorems 2, 3, 4 are correct. One correction of scope: the
statements X(d) (section 2) and NL(d) (section 3.5) are printed without "d even"; both are false for odd d
(exact counterexamples below). The verdict line of the lane and the first referee already restrict to even d.

Notation as in the lane: psi(x) = b(x_1) b(x_2) b(x_12), a(nu) = 1/(nu_1 nu_2), L(x, y) = [b(x) b(y) - b(-x) b(-y)]/(x + y),
W = S_3 acting by s_1 (z_1, z_2) = (-z_1, z_12), s_2 (z_1, z_2) = (z_12, -z_2), c_1 = (z_2, -z_12), c_2 = (-z_12, z_1),
w_0 = (-z_2, -z_1).

## Lemma 1

Expanding the two Bezoutians: L(x_1, y_1) L(x_2, y_2) b(-x_12) b(-y_12) = sum over e of e_1 e_2 psi_e(x) psi_e(y) a(x + y),
psi_e(x) = b(e_1 x_1) b(e_2 x_2) b(-x_12). Checked by hand: psi_(-,+) = psi o c_1, psi_(+,-) = psi o c_2, psi_(-,-) = psi o w_0
(w_0 = s_1 s_2 s_1 is a reflection), and psi_(+,+) is invariant under the rotations. For F = (phi o v)(x)(phi o v)(y) a(x + y)
the substitution w -> v^-1 w, w' -> v^-1 w' gives S[F] = chi chi'(v) S[phi phi (a o v^-1)]. a o w_0 = a;
a o c_1 = -1/(nu_2 nu_12), a o c_2 = -1/(nu_1 nu_12), sum -a; so the two rotated patterns (coefficient -1 each) give
+S[psi psi a], the w_0 pattern gives chi chi'(w_0) S[psi psi a], and the invariant pattern gives
(1/3) S[psi_dag psi_dag (a + a o c_1 + a o c_2)] = 0. Total (1 + chi chi'(w_0)) S[psi psi a]. The second line is the same
with s_1, s_2 (a o s_1 + a o s_2 = -a). PROVED.

Exact check: 8 random real b of degree 2 to 5, random rational lam, mu, all four pairs (chi, chi'), both lines:
64 identities, 0 failures. In particular the mixed pairs vanish and (sgn, sgn) gives 2N.

## Theorem 2

Q(j^-, j^-) = 2N, Q(j^+, j^+) = 2N^+, Q(j^+, j^-) = 0 are Lemma 1, line 1. Inertia of L_b for b = (u - 1) g, Re a_j > 0,
a_j != 1: (x - 1)(y - 1)(x + y) L_g - 2 (x + y) g(-x) g(-y) = b(x) b(y) - b(-x) b(-y) (expanded by hand), so L_b is a positive
semidefinite form of rank d (Hermite, g Hurwitz stable; degree-1 case 2a > 0 checked) minus a rank-one form, and
has rank d + 1 because b(x), b(-x) are coprime exactly when a_j != 1; inertia (d, 1); Q = L (x) L has inertia
(d^2 + 1, 2d). The linear-algebra step (R = J cap J^perp of dimension z; R^perp/R = J/R + J^perp/R orthogonally with
inertia (p - z, q - z)) is standard and correct. Hence neg(N) + neg(N^+) + z <= 2d. PROVED.

Exact check (inertia by rational congruence, 1x1 and hyperbolic 2x2 pivots): five real sets in general position,
d = 2, 2, 3, 3, 4 ({1/3, 5/3}, {2/7, 4/9}, {1/5, 3/7, 5/2}, {3/2, 7/3, 5/4}, {1/6, 2/9, 3/11, 9/2}): neg(N) + neg(N^+) = 4, 4, 6, 6, 8 against 2d = 4, 4, 6, 6, 8; rank N =
n(n-1)/2 and rank N^+ = n(n+1)/2 in all five (equality cases, as the lane measured).

## Theorem 3 and the crossing identity

For a root r of b, L(x, r) = -b(-x) b(-r)/(x + r). Then Q(ev_p_ij, j^-_mu) = b(-r_i) b(-r_j) A_mu[psi(w_0 x)/((x_1 + r_i)(x_2 + r_j))]
= -b(-r_i) b(-r_j) A_mu[psi(x)/((x_1 - r_j)(x_2 - r_i))] (x -> w_0 x, sign -1). On the other side, of the six images of
(r_i, r_j) only w_0 (r_i, r_j) = (-r_j, -r_i) has psi != 0 (each of the other five has a coordinate or the sum equal to a
root: checked one by one), so N(p_ij, mu) = -D_ij A_mu[psi(x)/((x_1 - r_j)(x_2 - r_i))]. Hence N(p_ij, mu) = b(-r_i - r_j) Q(ev_p_ij, j^-_mu):
derived here without c18 Theorem G. Likewise j^+_p + j^-_p = 2 b(-r_i - r_j) ev_p (the two non-trivial rotations have
coefficient b(r_i) = 0 or b(r_j) = 0).

Theorem 3: Jt_0 = ev_1 (x) ev_1 + ev_1 (x) P + P (x) ev_1 with L(1, 1) = -b(-1)^2/2 < 0 and P positive definite of
dimension d, so Q on Jt_0 has inertia (1, 2d); ev_p_a = u'_a + u''_a with u' in J^-, u'' in (J^-)^perp when
beta_a = b(-r_i - r_j) != 0, which is the hypothesis a_j not in {1, 2}, a_j + a_k != 1 (beta_00 = -3 g(-2);
beta_0j = (a_j - 2) g(a_j - 1)); G = G' + G'' and subadditivity of the negative index give 2d <= neg(G') + neg(G'') <=
2d - z. So z = 0 and neg(N) = neg(G'). PROVED. Domain: simple zeros, conjugate-closed, Re a_j > 0, a_j not in {1, 2},
a_j + a_k != 1 for all j, k. Only the negative index is claimed and only that is equal.

Exact check: the five sets above. neg(N) on random points / neg of the (2d+1) x (2d+1) crossing matrix:
1/1, 2/2, 2/2, 0/0, 4/4. Crossing identity: 0 failures over all 2d + 1 crossing points in each set. (The positive
indices differ, e.g. (4, 2) against (3, 2), as they may.)

## Section 3.4, Lemma 4, Theorem 4

Symmetric set: g(-1 - u) = g(u), so b(a_j - 1) = (a_j - 2) g(-a_j) = 0; N(p_0j, .) = 0 and j^-_p_0j = -j^+_p_0j lies in R.
The three surviving terms of j^-_p_0k were recomputed term by term and agree with the display. The test
polynomials f_k separate them (f_k vanishes at (-1, .); at (1 - a_j, a_j) either the product or the last factor
vanishes; at (a_j, -1) only j = k survives), so z >= d. Theorem 4: neg(N) <= d - neg(N^+). PROVED.

Remark: the proof of Lemma 4 does not need "a = 1/2 excluded"; with a simple zero at 1/2 (odd d) the same f_k
work (the last factor vanishes at j = k). Lemma 4 and the inequality of Theorem 4 hold for odd d as well.

Exact check: symmetric sets {1/3, 2/3}, {1/5, 4/5, 2/7, 5/7}: N(p_0j, mu) = 0 at all tested mu; N has inertia
(1, 0), (6, 0) (rank d(d-1)/2, positive semidefinite); N^+ has (2, 2), (7, 4); N^+ on 2n + 9 points of the pole
line has (1, d) in both, as the lane found at d = 6..16.

## Correction: d even

Odd d, exact:

| symmetric set | N | N^+ | N^+ on the pole line | Theorem 4 |
|---|---|---|---|---|
| {1/4, 3/4, 1/2} (d = 3) | (1, 2) | (6, 1) | (3, 1) | 2 <= 3 - 1 |
| {1/6, 5/6, 1/3, 2/3, 1/2} (d = 5) | (6, 4) | (15, 1) | (5, 1) | 4 <= 5 - 1 |
| {1/2} (d = 1) | (0, 0) | (1, 1) | (1, 1) | 0 <= 0 |

In the two examples with d = 3 and d = 5 (simple zero at 1/2), N is not positive semidefinite and N^+ has one negative square, not d.
So "X(d): N is positive semidefinite for every symmetric set of d zeros" (section 2) and "NL(d): for every
symmetric set of d simple zeros ... N^+ has at least d negative squares" (section 3.5) need "d even" in the
statement. With that, nothing else changes: all 220 lane configurations have even d, and the first referee
lists odd-degree examples as out of scope. In both odd examples Theorem 4 holds with equality.

## What is not established

X(d) for general even d, and NL(d), remain open, as the lane says. Lemma 5 (pole-line identity) was not
refereed here. dim J^+ + dim J^- = n^2 is measured (by the lane, and in the five sets here), not proved.

## Flags

R1, R2, R3, R4 false. The statement is about a model kernel; no arithmetic input is used.
