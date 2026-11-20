# Second-referee check for Lemma HS / Theorem K of c7-probe-format-h-cap.
# (1) Theorem K identities as exact polynomial identities in (lx, ly, l, r) (Fractions on an affine basis; linear in the geometry,
#     so 4 affinely independent points per r prove each identity for that r; r = 2..40).
# (2) Block-stable form of Lemma HS: for any partition of rows into blocks I_i and columns into blocks J_j,
#     sum_ij ||A_i|| ||T_ij|| ||beta_j||  >=  (c^(1/2)/b1) ||A|| ||beta|| D^(1/2)   when D >= Q is not needed blockwise,
#     c = least proportion of unimodular entries in a block, |beta_n| <= b1 ||beta|| D^(-1/2).
#     Tested on Jacobi-symbol matrices (n/m), m odd, with random interval partitions and random arithmetic-progression partitions.
# Planned memory: one float64 matrix of at most 300 x 2400 = 5.8 MB.
from fractions import Fraction as F
import math, random
import numpy as np
random.seed(7); rng = np.random.default_rng(7)
ok = True
for r in range(2, 41):
    R = F(r)
    for (lx, ly, l) in ((F(0), F(0), F(0)), (F(1), F(0), F(0)), (F(0), F(1), F(0)), (F(0), F(0), F(1)), (F(2, 7), F(5, 3), F(11, 13))):
        h = 1 + l - lx; M = lx + ly
        Lp = 1 - h/R; LK = Lp + (M + l - 1)/2; H0 = F(1, 2) - ly/2 + h*(1 - 1/R) - l/2; H0p = F(1, 2) - ly/2 + h*(1 - 1/R)
        ok &= ((R-2)/R*Lp + LK/R + H0/R == 1 - 1/R + lx/(2*R))
        ok &= ((1 - 4/(3*R))*Lp + 2/(3*R)*LK + 2/(3*R)*H0p == 1 - 1/R + 2*lx/(3*R))
        for d in (2, 3, 4):
            LKd = Lp + ((d-1)*(M + l) - 1)/2
            ok &= ((1 - 1/R - 1/(R*(d-1)))*Lp + LKd/(R*(d-1)) + H0/R == 1 - F(d, 1)/(2*R*(d-1)) + lx/(2*R))
print('Theorem K identities (both high sides; degree d = 2, 3, 4), r = 2..40, exact:', ok)
def jacobi(a, n):
    a %= n; t = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): t = -t
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: t = -t
        a %= n
    return t if n == 1 else 0
def run(Q, D, kind):
    ms = [2*i + 3 for i in range(Q)]; ns = list(range(2, D + 2))
    T = np.array([[jacobi(n, m) for n in ns] for m in ms], dtype=float)
    A = rng.standard_normal(Q) + 0.3; beta = rng.choice([-1.0, 1.0], D)*rng.uniform(0.5, 1.0, D)
    b1 = np.abs(beta).max()*math.sqrt(D)/np.linalg.norm(beta)
    worst = 1e9
    for trial in range(40):
        if kind == 'intervals':
            rc = sorted(random.sample(range(1, Q), random.randint(0, 6))); cc = sorted(random.sample(range(1, D), random.randint(0, 12)))
            RI = [list(range(a, b)) for a, b in zip([0] + rc, rc + [Q])]; CJ = [list(range(a, b)) for a, b in zip([0] + cc, cc + [D])]
        else:
            g = random.choice((2, 3, 5)); g2 = random.choice((2, 3, 4, 7))
            RI = [[i for i in range(Q) if i % g == a] for a in range(g)]; CJ = [[j for j in range(D) if j % g2 == a] for a in range(g2)]
        tot = 0.0; cmin = 1.0
        for I in RI:
            for J in CJ:
                B = T[np.ix_(I, J)]; cmin = min(cmin, np.count_nonzero(B)/B.size)
                tot += np.linalg.norm(A[I])*np.linalg.norm(B, 2)*np.linalg.norm(beta[J])
        lower = math.sqrt(cmin)/b1*np.linalg.norm(A)*np.linalg.norm(beta)*math.sqrt(D)
        worst = min(worst, tot/lower)
    full = np.linalg.norm(T, 2)**2
    print('Q = %d rows, D = %d columns, %s partitions: ||T||^2 = %.0f (max(Q, D) = %d, Q + D = %d); min over 40 partitions of blockwise bound / lower bound = %.3f'
          % (Q, D, kind, full, max(Q, D), Q + D, worst))
for Q, D in ((60, 1200), (150, 2400), (300, 300), (300, 900)):
    run(Q, D, 'intervals'); run(Q, D, 'progression')
