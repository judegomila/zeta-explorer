# Theorem 6 (concentration) on the 60 non-symmetric control configurations: negative index of the Gram of N on integer points of the two
# pole lines (1,z), (z,1) and (1,1), against the full exact negative index from the campaign run. Also counts simple-zero symmetric configs.
import json, sys
from fractions import Fraction as Fr
from xd import *
from campaign import tasks, predict, zeros
full = {}
for fn in sys.argv[1:]:
    for l in open(fn):
        r = json.loads(l); full[r['id']] = r
T = tasks(); ok = tot = hyp = 0; rows = []
for t in T:
    if t['kind'] != 'nonsym' or t['id'] not in full: continue
    specs = [tuple(s) for s in t['specs']]; b = bpoly(specs, 'pole'); n = len(b)-1
    L = bezout(b); Lm = fmpz_mat(n, n, [x for r in L for x in r]); bev = lambda u: sum(c*u**k for k, c in enumerate(b))
    def th(p):
        acc = [[0]*n for _ in range(n)]
        for (x, sg) in orbit(p):
            w = sg*bev(-(x[0]+x[1]))
            if w == 0: continue
            for i in range(n):
                for j in range(n): acc[i][j] += w*x[0]**i*x[1]**j
        return fmpz_mat(n, n, [v for r in acc for v in r])
    K = n+6; pts = [(1, 1)]+[(1, z) for z in range(2, 2+K)]+[(z, 1) for z in range(2, 2+K)]
    Tm = [th(p) for p in pts]; KK = [Lm*X*Lm.transpose() for X in Tm]; M = len(pts)
    G = fmpz_mat(M, M, [sum((Tm[i][a, c]*KK[j][a, c] for a in range(n) for c in range(n)), fmpz(0)) for i in range(M) for j in range(M)])
    pos, neg, rk = inertia_int(G); Z = zeros(specs)
    generic = all(m == 1 for m in Z.values()) and not any(((1-re, im) in Z) for (re, im) in Z)
    tot += 1; ok += (neg == full[t['id']]['neg']); hyp += generic; rows.append(dict(id=t['id'], line_neg=neg, full_neg=full[t['id']]['neg'], hypothesis=generic))
print('non-symmetric configs', tot, 'pole-line negative index == full negative index:', ok, '; configs meeting the hypothesis of Theorem 6 (simple zeros, no partner pair):', hyp,
      '; agreement among those:', sum(r['line_neg'] == r['full_neg'] for r in rows if r['hypothesis']))
S = [t for t in T if t['kind'] == 'sym']
simple = sum(all(m == 1 for m in zeros([tuple(s) for s in t['specs']]).values()) for t in S)
print('symmetric configs', len(S), 'with simple zeros', simple, 'confluent', len(S)-simple)
json.dump(rows, open('check_t6.json', 'w'))
