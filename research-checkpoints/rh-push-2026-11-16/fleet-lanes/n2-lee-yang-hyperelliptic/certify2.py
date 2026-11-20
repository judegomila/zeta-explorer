"""(A) arb-certified off-circle roots in the self-dual family at a rational real point (q=13, n=5).
(B) exact Schur-Cohn grid check of the original family on the real cube for n=3: zeros in |u|<r, r<q^{-1/2} rational."""
import itertools, math, json, numpy as np
from fractions import Fraction as F
import flint
from lylib import *
from schur import G, schur_cohn_count
flint.ctx.prec = 300
out = {}
# ---------- (A)
q, n, es = 13, 5, [0, 1, 4, 8, 9]; m = n+1
zr = [F(-1), F(3, 8), F(-1), F(-1), F(1), F(3, 8)]
chi = chi_table(q)
idx = np.arange(q**n, dtype=np.int64); digs = [(idx // q**j) % q for j in range(n)]
V = np.zeros((q**n, q), dtype=np.int64)
for j in range(n-1, -1, -1): V = (V*np.arange(q)[None, :] + digs[j][:, None]) % q
st = np.array([0, 1, 2])[chi]
eta = [int(chi[int(np.prod([(e-o) % q for o in es if o != e]) % q)]) for e in es] + [1]
sq = flint.arb(q).sqrt()
def Q(fr): return flint.arb(flint.fmpq(fr.numerator, fr.denominator))
w = [[(1+Q(z))/2*(1+eta[i]*sq), flint.arb(1), Q(z)] for i, z in enumerate(zr)]     # states 0, R, N
Em1 = flint.arb(1)
for i in range(m): Em1 *= w[i][0]
Ek = []
for k in range(n):
    sl = slice(0, q**(k+1))
    S = np.concatenate([st[V[sl][:, es]], st[digs[k][sl]][:, None]], axis=1)
    bc = np.bincount((S * 3**np.arange(m)[None, :]).sum(axis=1), minlength=3**m)
    acc = flint.arb(0)
    for p in np.nonzero(bc)[0]:
        t = flint.arb(int(bc[p]))
        for i in range(m): t *= w[i][(int(p) // 3**i) % 3]
        acc += t
    Ek.append(acc)
P = [flint.arb(0)]*(n+2); base = [Ek[k]-Em1 for k in range(n)] + [flint.arb(0), flint.arb(0)]
for j in range(n+2):
    P[j] = base[j] - (q+1)*(base[j-1] if j >= 1 else 0) + q*(base[j-2] if j >= 2 else 0)
h = flint.arb(q)**3      # q^{(n+1)/2}, n=5
P[n] += Em1*(h-1); P[n+1] += Em1*(q-h)
roots = sorted(flint.acb_poly([flint.acb(c) for c in P]).roots(), key=lambda u: float(abs(u).mid()))
mods = [abs(u)*sq for u in roots]
out['A'] = {'q': q, 'n': n, 'es': es, 'eta': eta, 'z': [str(z) for z in zr], 'roots': [u.str(22, radius=False) for u in roots],
            'abs_u_sqrt_q': [x.str(22, radius=False) for x in mods],
            'certified_strictly_inside': sum(1 for x in mods if x < 1), 'certified_strictly_outside': sum(1 for x in mods if x > 1)}
print(json.dumps(out['A'], indent=1), flush=True)
# ---------- (B)
tot = 0; viol = 0; degen = 0; maxc = 0
for q in (5, 7, 11, 13):
    n = 3; chi = chi_table(q); vals = value_tables(q, n-1)
    r = F(math.isqrt(10**24 // q), 10**12)
    for es in [s for s in itertools.combinations(range(q), n) if s[0] == 0 and s[1] == 1]:
        cnt = counts(q, list(es), vals, chi)
        for zt in itertools.product([F(k, 6)-1 for k in range(13)], repeat=3):
            if all(z == 1 for z in zt): continue
            co = Ncoeffs(q, n, cnt, [G(z, 0) for z in zt], one=G(1, 0))
            try: c = schur_cohn_count(co, r)
            except ValueError: degen += 1; continue
            tot += 1; maxc = max(maxc, c); viol += c > 1
out['B'] = {'grid': 'z in {-1,-5/6,...,1}^3, n=3, q in 5,7,11,13, all sets {0,1,e}', 'points_tested': tot, 'degenerate_skipped': degen,
            'max_zeros_in_disc': maxc, 'points_with_more_than_one_zero_in_disc': viol}
print(json.dumps(out['B'], indent=1))
json.dump(out, open('certify2.json', 'w'), indent=1)
