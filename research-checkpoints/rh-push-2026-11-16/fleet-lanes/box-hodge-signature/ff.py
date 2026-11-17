# Function-field calibration.  C/F_q of genus g; classes on C x C:  H = C x pt, V = pt x C, G_k = graph of Frobenius^k (k = 0..n).
#   H.H = V.V = 0, H.V = 1, G_k.H = q^k, G_k.V = 1, G_j.G_k = q^min(j,k) N_|j-k| (j != k), G_k.G_k = q^k (2 - 2g),  N_m = #C(F_{q^m}).
# Exact integer Gram matrix; inertia from the characteristic polynomial (all roots real, so Descartes' count is exact).
# Hodge index <=> exactly one positive eigenvalue.  Also the "fakes": N_m from a polynomial with roots off |alpha| = sqrt q.
# Second route (same code as zeta): normalised Toeplitz lags -Z_k = -sum_j (alpha_j/sqrt q)^k in arb -> bh.certify.
import sys, os, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from flint import fmpz_mat, fmpz, fmpq, arb
import bh

def count_points(p, f, ext):
    """#points of y^2 = f(x) (f odd degree, squarefree, coefficients in F_p, list low->high) over F_{p^ext}, ext in (1,2), plus 1 at infinity."""
    if ext == 1:
        sq = [0]*p
        for y in range(p): sq[y*y % p] += 1
        return 1 + sum(sq[sum(c*pow(x, i, p) for i, c in enumerate(f)) % p] for x in range(p))
    nr = next(a for a in range(2, p) if pow(a, (p-1)//2, p) == p-1)      # F_{p^2} = F_p[w]/(w^2 - nr)
    mul = lambda a, b: ((a[0]*b[0] + nr*a[1]*b[1]) % p, (a[0]*b[1] + a[1]*b[0]) % p)
    cnt = {}
    for y in itertools.product(range(p), repeat=2):
        s = mul(y, y); cnt[s] = cnt.get(s, 0) + 1
    tot = 1
    for x in itertools.product(range(p), repeat=2):
        acc = (0, 0); pw = (1, 0)
        for c in f:
            acc = ((acc[0] + c*pw[0]) % p, (acc[1] + c*pw[1]) % p); pw = mul(pw, x)
        tot += cnt.get(acc, 0)
    return tot

def power_sums(e, m):
    """e = [e1, e2, ..., ed] elementary symmetric functions of the alpha_j; returns p_1..p_m (Newton)."""
    d = len(e); ps = []
    for k in range(1, m+1):
        s = 0
        for i in range(1, min(k, d+1)):
            s += (-1)**(i-1)*e[i-1]*ps[k-i-1]
        if k <= d: s += (-1)**(k-1)*k*e[k-1]
        ps.append(s)
    return ps

def gram(q, g, psums, n):
    N = lambda m: q**m + 1 - psums[m-1]
    size = n + 3
    G = [[0]*size for _ in range(size)]
    G[0][1] = G[1][0] = 1
    for k in range(n+1):
        G[0][k+2] = G[k+2][0] = q**k
        G[1][k+2] = G[k+2][1] = 1
        for j in range(n+1):
            G[j+2][k+2] = q**k*(2-2*g) if j == k else q**min(j, k)*N(abs(j-k))
    return G

def descartes_inertia(G):
    n = len(G)
    cp = fmpz_mat(n, n, [x for r in G for x in r]).charpoly()
    c = [int(cp[i]) for i in range(n+1)]
    zero = 0
    while c[zero] == 0: zero += 1
    c = c[zero:]
    nz = [x for x in c if x != 0]
    pos = sum(1 for a, b in zip(nz, nz[1:]) if a*b < 0)
    return pos, n - zero - pos, zero

def report(label, q, g, e, n):
    ps = power_sums(e, n+1)
    G = gram(q, g, ps, n)
    pos, neg, zero = descartes_inertia(G)
    # first size at which a second positive eigenvalue appears
    first = None
    for m in range(0, n+1):
        Gm = [row[:m+3] for row in G[:m+3]]
        if descartes_inertia(Gm)[0] > 1: first = m; break
    # same pipeline as zeta: normalised lags in arb, Levinson midpoint + certificate, for the first 2g stages (rank is 2g)
    bh.setprec(60)
    sq = arb(q).sqrt()
    t = [-(arb(2*g) if k == 0 else arb(ps[k-1])/sq**k) for k in range(2*g)]
    rows = bh.levinson_mid(t)
    mc, d, worst = bh.certify(bh.toeplitz_mat(t), rows)
    sg = ''.join('+' if x > 0 else '-' for x in d[:mc])
    print('%-46s q=%d g=%d  N_1..N_3=%s | classes H,V,G_0..G_%d: inertia (+,-,0) = (%d,%d,%d) | rank bound 2g+2=%d | first k with i_+ > 1: %s | arb pipeline, -Z Toeplitz pivots 1..2g: %s (certified %d/%d)' % (
        label, q, g, [q**m + 1 - ps[m-1] for m in (1, 2, 3)], n, pos, neg, zero, 2*g+2, first, sg, mc, 2*g))
    return pos, neg, zero, first

n = int(sys.argv[1]) if len(sys.argv) > 1 else 12
print('# genuine curves')
for p, f, name in [(5, [1, 1, 0, 1], 'y^2=x^3+x+1 / F_5'), (7, [3, 0, 0, 1], 'y^2=x^3+3 / F_7'), (11, [6, 1, 0, 1], 'y^2=x^3+x+6 / F_11'), (13, [1, 2, 0, 1], 'y^2=x^3+2x+1 / F_13')]:
    N1 = count_points(p, f, 1); a = p + 1 - N1
    report(name, p, 1, [a, p], n)
for p, f, name in [(5, [1, 1, 0, 0, 0, 1], 'y^2=x^5+x+1 / F_5'), (7, [1, 1, 0, 0, 0, 1], 'y^2=x^5+x+1 / F_7'), (11, [2, 0, 1, 0, 0, 1], 'y^2=x^5+x^2+2 / F_11'), (13, [1, 3, 0, 0, 0, 1], 'y^2=x^5+3x+1 / F_13')]:
    # squarefree check
    from math import gcd
    N1 = count_points(p, f, 1); N2 = count_points(p, f, 2)
    e1 = p + 1 - N1                      # sum alpha
    p2 = p*p + 1 - N2                    # sum alpha^2
    e2 = (e1*e1 - p2)//2
    report(name, p, 2, [e1, e2, p*e1, p*p], n)
print('# fakes: reciprocal polynomial with the functional equation alpha -> q/alpha and integer coefficients, roots off the circle')
report('fake g=1: 1 - 5T + 5T^2 (a=5 > 2 sqrt 5)', 5, 1, [5, 5], n)
report('fake g=1: 1 - 6T + 7T^2', 7, 1, [6, 7], n)
report('fake g=1: 1 + 5T + 5T^2', 5, 1, [-5, 5], n)
report('fake g=2: (1-5T+5T^2)(1-T+5T^2)', 5, 2, [6, 15, 30, 25], n)
report('fake g=2: (1-5T+5T^2)^2', 5, 2, [10, 35, 50, 25], n)
report('fake g=2: 1 + 0T - 9T^2 + 0T^3 + 25T^4 (complex quartet)', 5, 2, [0, -9, 0, 25], n)
report('fake g=2: 1 - T - 4T^2 - 5T^3 + 25T^4', 5, 2, [1, -4, 5, 25], n)
