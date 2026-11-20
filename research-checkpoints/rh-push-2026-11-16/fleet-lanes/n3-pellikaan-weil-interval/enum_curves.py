"""Enumerate (N_1..N_g) realised by hyperelliptic curves y^2=f(x) of genus g over F_q (q odd).
f squarefree of degree 2g+1 or 2g+2, leading coefficient in {1, nonresidue} (all curves up to y-scaling).
Output: JSON {tuple: count}.  usage: enum_curves.py q g out.json"""
import sys, json, itertools
import numpy as np
from flint import nmod_poly
q, g = int(sys.argv[1]), int(sys.argv[2]); out = sys.argv[3]
nr = next(a for a in range(2, q) if all((b*b - a) % q for b in range(q)))

def field(k):
    """F_{q^k}: return (pw, chi) with pw[i][j][x] = i-th coordinate of x^j, chi[idx] quadratic character."""
    n = q**k
    if k == 1:
        mod = [0, 1]
    else:
        for tail in itertools.product(range(q), repeat=k):
            m = list(tail) + [1]
            if not m[0]: continue
            fa = nmod_poly(m, q).factor()[1]
            if len(fa) == 1 and fa[0][1] == 1: mod = m; break
    def mul(a, b):
        r = [0]*(2*k-1)
        for i, x in enumerate(a):
            if x:
                for j, y in enumerate(b): r[i+j] = (r[i+j] + x*y) % q
        for d in range(2*k-2, k-1, -1):
            c = r[d]
            if c:
                for i in range(k): r[d-k+i] = (r[d-k+i] - c*mod[i]) % q
        return r[:k]
    els = [[(x // q**i) % q for i in range(k)] for x in range(n)]
    enc = lambda v: sum(c*q**i for i, c in enumerate(v))
    chi = np.full(n, -1, dtype=np.int64); chi[0] = 0
    for e in els[1:]: chi[enc(mul(e, e))] = 1
    D = 2*g + 3
    pw = np.zeros((k, D, n), dtype=np.int64)
    for x, e in enumerate(els):
        cur = [1] + [0]*(k-1)
        for j in range(D):
            for i in range(k): pw[i, j, x] = cur[i]
            cur = mul(cur, e)
    return pw, chi

fields = {k: field(k) for k in range(1, g+1)}
res = {}
total = 0
for deg in (2*g+1, 2*g+2):
    for lead in (1, nr):
        nlow = q**deg
        print(f"q={q} g={g} deg={deg} lead={lead}: {nlow} polys; chunk alloc <= {20000*q**g*8/1e6:.0f} MB", flush=True)
        for start in range(0, nlow, 20000):
            idx = np.arange(start, min(nlow, start+20000), dtype=np.int64)
            C = np.empty((len(idx), deg+1), dtype=np.int64)
            t = idx.copy()
            for j in range(deg): C[:, j] = t % q; t //= q
            C[:, deg] = lead
            # squarefree filter
            keep = np.zeros(len(idx), dtype=bool)
            for r in range(len(idx)):
                f = nmod_poly([int(c) for c in C[r]], q)
                keep[r] = f.gcd(f.derivative()).degree() == 0
            C = C[keep]
            Ns = []
            for k in range(1, g+1):
                pw, chi = fields[k]
                code = np.zeros((C.shape[0], q**k), dtype=np.int64)
                for i in range(k):
                    code += ((C @ pw[i, :deg+1, :]) % q) * q**i
                aff = (1 + chi[code]).sum(axis=1)
                if deg % 2: inf = 1
                else: inf = 2 if (lead == 1 or k % 2 == 0) else 0
                Ns.append(aff + inf)
            Ns = np.stack(Ns, axis=1)
            u, cnt = np.unique(Ns, axis=0, return_counts=True)
            for row, c in zip(u, cnt):
                key = ",".join(str(int(v)) for v in row)
                res[key] = res.get(key, 0) + int(c)
            total += C.shape[0]
print("curves (models):", total, "distinct tuples:", len(res))
json.dump({"q": q, "g": g, "models": total, "tuples": res}, open(out, "w"))
