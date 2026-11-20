# Rational toy base M_toy(u) = (u+1)/(u-1) (pole at 1, residue 2, M(0) = -1) and base M = 1: numerical rank and inertia of the apex kernel K_0
# for Blaschke insertions. n = 60 random points, 1500 bits; a pivot is counted as zero when its ratio to the largest pivot is below 1e-300.
# MEASURED (rank by threshold; signs of the non-zero pivots are certified balls).
import random, math, json
from flint import acb, arb, ctx
import k2
ctx.prec = 1500
rng = random.Random(3)
pts_raw = [(complex(rng.uniform(0.05, 1.5), rng.uniform(-4, 4)), complex(rng.uniform(0.05, 1.5), rng.uniform(-4, 4))) for _ in range(60)]
def inertia(base, zs, T=(0, 0)):
    pts = [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in pts_raw]
    G = k2.gram(pts, k2.make_M(base, zs), T)
    # pivoted LDL, stop when the remaining diagonals are all below threshold
    n = len(G); A = [r[:] for r in G]; pos = neg = 0; dmax = None
    for k in range(n):
        best = max(range(k, n), key=lambda i: abs(float(A[i][i].real.mid())) if abs(A[i][i].real.mid()) > 0 else 0.0)
        logs = [float(abs(A[i][i].real.mid()).log()) / math.log(10) if abs(A[i][i].real.mid()) > 0 else -9999 for i in range(k, n)]
        l = max(logs); best = k + logs.index(l)
        if dmax is None: dmax = l
        if l < dmax - 300: break
        A[k], A[best] = A[best], A[k]
        for r in range(n): A[r][k], A[r][best] = A[r][best], A[r][k]
        d = A[k][k].real
        if d > 0: pos += 1
        elif d < 0: neg += 1
        else: return ('undecided', pos, neg)
        for i in range(k+1, n):
            f = A[i][k]/d
            for j in range(i, n):
                A[i][j] = A[i][j] - f*A[j][k].conjugate()
                if j > i: A[j][i] = A[i][j].conjugate()
    return (pos + neg, pos, neg)
out = []
cases = [('M = 1', k2.M_one, []), ('M = 1, quartet(0.3,3)', k2.M_one, [('q', 0.3, 3.0)]), ('M = 1, left pair 0.2+-3i', k2.M_one, [complex(0.2, 3), complex(0.2, -3)]),
         ('M = 1, real pair (0.2)', k2.M_one, [('rp', 0.2)]),
         ('toy', k2.M_toy, []), ('toy, real pair (0.2)', k2.M_toy, [('rp', 0.2)]), ('toy, quartet(0.3,3)', k2.M_toy, [('q', 0.3, 3.0)]),
         ('toy, two quartets', k2.M_toy, [('q', 0.3, 3.0), ('q', 0.1, 1.0)]),
         ('toy, left pair 0.2+-3i', k2.M_toy, [complex(0.2, 3), complex(0.2, -3)]), ('toy, right pair 0.8+-3i', k2.M_toy, [complex(0.8, 3), complex(0.8, -3)]),
         ('toy, mis-paired quartet (0.3,3; 1e-6)', k2.M_toy, [('qd', 0.3, 3.0, 1e-6)]), ('toy, real left pair {0.3,0.2}', k2.M_toy, [complex(0.3, 0), complex(0.2, 0)])]
for name, base, zs in cases:
    r = inertia(base, zs)
    print('%-42s rank %s  positive %s  negative %s' % (name, r[0], r[1], r[2])); out.append(dict(case=name, rank=r[0], pos=r[1], neg=r[2]))
json.dump(out, open('toy_rank.json', 'w'), indent=1)
