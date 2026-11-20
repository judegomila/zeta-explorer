## 5. Item D: pole counts of the renormalised stages (line 12)

Object (Test 3 of `push/c1-leeyang-krein-limit`, alpha = 1): the Curie-Weiss stage D(s) = sum over squarefree n | M of
a(n) exp(l_n^2/(2L) - s l_n) (M the product of the primes up to P, L = log M, l_n = log n), s = 1/2 + z,
L~ = A + D'/D + r with A = 1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2) and r the logarithmic derivative of the
renormaliser (zeta phases: a = 1, r = -P^(1-s)/(s-1); control U_s0, s0 = 3/4 + 20i: a(p) = p^(20i) e^(+-i phi_p),
r = +P^(s0-s)/(s-s0)), S~ = (1 - L~)/(1 + L~). The source lane counted poles of S~ in Re z > 0, 10 < Im z < 30 by
Newton iteration from the stage zeros and labelled the counts lower bounds.

Certificate. Poles of S~ at points with D != 0 are the zeros of N := (1 + A + r) D + D' (zeta phases), resp.
N := (s - s0)[(1 + A) D + D'] + P^(s0-s) D (U_s0; the pole of r at s0 is cleared and N(s0) = D(s0)); at such a zero
1 - L~ = 2, so it is a pole of S~ of the same multiplicity. N is analytic on the boxes (poles of A at s = 0, 1 and of
psi(s/2) are outside). Three argument-principle counts (Lemma W on adaptive dyadic bisections of the four sides;
enclosures = direct ball evaluation intersected with the mean-value form; A uses Arb's digamma, not the asymptotic
series of the source code):

    n1 = zeros of N in (0, 4) x (10, 30),   n2 = zeros of N in (1/64, 4) x (10, 30),   n3 = zeros of D in (1/64, 4) x (10, 30).

If n1 = n2 and n3 = 0, then N has no zero with 0 < Re z <= 1/64 in the window, D has none with Re z >= 1/64, and S~ has
exactly n1 poles (with multiplicity) in the box 0 < Re z < 4, 10 < Im z < 30. Not covered: Re z >= 4 (the source lane
found no pole with Re z > 0.56) and the lines Im z = 10, 30 themselves (N is certified non-zero on them).

| phases | P | terms | bits | n1 | n2 | n3 | certified poles in the box | Newton count on file | stage zeros in window (on file) | leaves (n1 contour) | wall s |
|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | 13 | 64 | 128 | 32 | 32 | 0 | 32 | 27 | 32 | 1062 | 2 |
| zeta | 13 | 64 | 256 | 32 | 32 | 0 | 32 | 27 | 32 | 1108 | 5 |
| zeta | 19 | 256 | 128 | 51 | 51 | 0 | 51 | 46 | 50 | 1811 | 14 |
| zeta | 19 | 256 | 256 | 51 | 51 | 0 | 51 | 46 | 50 | 1840 | 24 |
| zeta | 29 | 1024 | 128 | 71 | 71 | 0 | 71 | 62 | 71 | 2788 | 64 |
| zeta | 29 | 1024 | 256 | 71 | 71 | 0 | 71 | 62 | 71 | 2807 | 98 |
| zeta | 37 | 4096 | 128 | 94 | 94 | 0 | 94 | 83 | 94 | 4333 | 397 |
| zeta | 37 | 4096 | 256 | 94 | 94 | 0 | 94 | 83 | 94 | 4360 | 608 |
| zeta | 47 | 32768 | 128 | 130 | 130 | 0 | 130 | 118 | 130 | 7152 | 2414 |
| U_s0 | 13 | 64 | 128 | 34 | 34 | 0 | 34 | 29 | 33 | 1156 | 2 |
| U_s0 | 13 | 64 | 256 | 34 | 34 | 0 | 34 | 29 | 33 | 1215 | 5 |
| U_s0 | 19 | 256 | 128 | 52 | 52 | 0 | 52 | 47 | 51 | 2013 | 8 |
| U_s0 | 19 | 256 | 256 | 52 | 52 | 0 | 52 | 47 | 51 | 2041 | 20 |
| U_s0 | 29 | 1024 | 128 | 73 | 73 | 0 | 73 | 67 | 72 | 3271 | 95 |
| U_s0 | 29 | 1024 | 256 | 73 | 73 | 0 | 73 | 67 | 72 | 3302 | 118 |
| U_s0 | 37 | 4096 | 128 | 96 | 96 | 0 | 96 | 88 | 94 | 4978 | 406 |

Outcome: **enclosed** (exact integers) for the rows listed; 128-bit and 256-bit runs agree wherever both exist.
P = 47 (32768 terms): certified for the zeta phases at 128 bits (row above); U_s0 at P = 47 and the 256-bit rerun at P = 47 were not run (time).
Reading (MEASURED relation between certified integers, no proof of a law): the certified count is 5 to 12 larger than
the Newton count on file in every row, so the Newton counts were lower bounds as the source lane said; the certified
count is within 2 of the number of stage zeros in the window in every row (zeta phases: 32/32, 51/50, 71/71, 94/94, 130/130;
U_s0: 34/33, 52/51, 73/72, 96/94). The source lane's statement "about one pole in Re z > 0 per stage zero, same for
zeta phases and for the control U_s0" is consistent with these integers; the control U_s0 has 1 or 2 more poles than
the zeta phases at every P <= 37. The derivative formulas used by the mean-value enclosures were checked against a central
difference at one point per row (relative difference below 1e-21).

