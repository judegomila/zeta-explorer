"""prep.py -- input file for rows.c: completed cubic theta rows (manuscript (5.30)) with sign weights.

Row (paper.txt (5.30), with the complex conjugate on alpha as in D(s, Psi), L0(s, Psi) of Proposition 5.1):
    C_V(Z; m, w) = sum_{c squarefree, n; c, n primary; (cn, 6) = 1}
                   gamma_2(c) conj(alpha(c n^3)) w(c n^3) chi_{c n^3}(m) q_c^{-1/2} q_n^{-1} V(q_c q_n^3 / Z),
alpha(a) = a/|a|, chi = sextic symbol (zero at non-units), S = {2, lambda}.
Tests V(e^u):   G  (1/(2 sqrt pi)) exp(-u^2/4) * taper (1 for u <= 3.5, C-infinity to 0 at u = 4)
                C  exp(1 - 1/(1 - (u/1.5)^2)) on |u| < 1.5
Weights (index, name): see WEIGHTS. Multiplicative weights are completely multiplicative on prime ideals.
Usage: python prep.py table.npz Z test out.bin [alpha_variant]
       alpha_variant: 'bar' (default, manuscript) or 'plain' (control: alpha instead of conj alpha)
"""
import sys, os, math
import numpy as np
from scipy.special import expi

WEIGHTS = ['one', 'e99', 'e97', 'e95', 'e90', 'e60', 'rm95a', 'rm95b', 'liou', 'd75', 'd50', 'iid', 'shuf95', 'rm90']
NW = len(WEIGHTS)
SQ3 = math.sqrt(3.0)

def splitmix(x, salt):
    """deterministic uniform(0,1) from int64 array x and integer salt (independent of table size)."""
    z = (x.astype(np.uint64) + np.uint64(0x9E3779B97F4A7C15) * np.uint64(salt + 1)) & np.uint64(0xFFFFFFFFFFFFFFFF)
    z = (z ^ (z >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
    z = (z ^ (z >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
    z = z ^ (z >> np.uint64(31))
    return (z >> np.uint64(11)).astype(np.float64) / float(1 << 53)

def Lfun(x, b):
    return 0.5 * (expi(b * np.log(x)) - expi(b * math.log(2.0)))

def thin_set(p1, b):
    """greedy rule of c4 (split variant): p1 = increasing rational primes = 1 mod 3. Returns boolean membership."""
    fl = np.floor(Lfun(p1.astype(float), b)).astype(np.int64)
    n = np.arange(1, len(p1) + 1)
    c = n + np.minimum(0, np.minimum.accumulate(fl - n))
    mem = np.diff(np.concatenate([[0], c])) == 1
    return mem

def prime_signs(pa, pb, pp, pinert):
    """int8 array [NW, nprimes] of weight values at the prime ideals of the table (multiplicative weights only)."""
    npr = len(pp)
    s = np.ones((NW, npr), dtype=np.int8)
    split = ~pinert
    up = pb > 0                                   # the prime ideal with b > 0 above a split p
    p1 = np.unique(pp[split])                     # rational primes 1 mod 3 (table is complete up to X)
    assert p1[0] == 7
    pos = np.searchsorted(p1, pp)
    for name, b in (('e99', 0.99), ('e97', 0.97), ('e95', 0.95), ('e90', 0.90), ('e60', 0.60)):
        mem = thin_set(p1, b)
        s[WEIGHTS.index(name), split & up & mem[np.minimum(pos, len(p1) - 1)]] = -1
    for name, b, salt in (('rm95a', 0.95, 11), ('rm95b', 0.95, 12), ('rm90', 0.90, 13)):
        inS = splitmix(p1, salt) < p1.astype(float) ** (b - 1.0)
        side = splitmix(p1, salt + 100) < 0.5
        sel = split & inS[np.minimum(pos, len(p1) - 1)] & (up == side[np.minimum(pos, len(p1) - 1)])
        s[WEIGHTS.index(name), sel] = -1
    s[WEIGHTS.index('liou'), :] = -1
    key = pp.astype(np.int64) * 4 + up.astype(np.int64) * 2 + pinert.astype(np.int64)
    s[WEIGHTS.index('d75'), splitmix(key, 21) < 0.75] = -1
    s[WEIGHTS.index('d50'), splitmix(key, 22) < 0.50] = -1
    return s

def Vtest(u, test):
    u = np.asarray(u, dtype=float)
    if test == 'G':
        v = np.exp(-u * u / 4.0) / (2.0 * math.sqrt(math.pi))
        x = (u - 3.5) / 0.5
        t = np.ones_like(u)
        mid = (x > 0) & (x < 1)
        xm = x[mid]
        f1 = np.exp(-1.0 / (1.0 - xm)); f0 = np.exp(-1.0 / xm)
        t[mid] = f1 / (f0 + f1)
        t[x >= 1] = 0.0
        return v * t
    if test == 'C':
        y = u / 1.5
        out = np.zeros_like(u)
        ins = np.abs(y) < 1
        out[ins] = np.exp(1.0 - 1.0 / (1.0 - y[ins] ** 2))
        return out
    raise ValueError(test)

UMAX = {'G': 4.0, 'C': 1.5}

def zmul(x, y):
    a, b = x; c, d = y
    return (a * c - b * d, a * d + b * c - b * d)

def main():
    path, Z, test, out = sys.argv[1], int(float(sys.argv[2])), sys.argv[3], sys.argv[4]
    variant = sys.argv[5] if len(sys.argv) > 5 else 'bar'
    Xmax = int(math.floor(Z * math.exp(UMAX[test])))
    d = np.load(path)
    assert Xmax <= int(d['X']), (Xmax, int(d['X']))
    N = d['N']
    keep = np.flatnonzero(N <= Xmax)
    nn = len(keep)
    print(f"Z = {Z}, test {test}, Xmax = {Xmax}, nodes {nn}; planned arrays < {nn * 60 / 1e9:.2f} GB", flush=True)
    remap = np.full(len(N), -1, dtype=np.int64); remap[keep] = np.arange(nn)
    na = d['na'][keep]; nb = d['nb'][keep]; Nk = N[keep]
    parent = remap[np.maximum(d['parent'][keep], 0)].astype(np.int32); parent[0] = -1
    assert (parent[1:] >= 0).all() and (parent[1:] < np.arange(1, nn)).all()
    pq = d['pq']; pk = np.flatnonzero(pq <= Xmax); npr = len(pk)
    assert (pk == np.arange(npr)).all()           # primes are sorted by norm
    last = d['last'][keep].astype(np.int32)
    assert last[1:].max() < npr
    pa = d['pa'][:npr]; pb = d['pb'][:npr]; pp = d['pp'][:npr]; pinert = d['pinert'][:npr]; pw = d['pw'][:npr].copy()
    pw[pinert] = -1
    g2 = d['g2'][keep]; depth = d['depth'][keep]
    alpha = (na - nb / 2.0 + 1j * nb * SQ3 / 2.0) / np.sqrt(Nk)
    base = g2 * (np.conj(alpha) if variant == 'bar' else alpha) / np.sqrt(Nk)
    # ---- weights on nodes
    ps = prime_signs(pa, pb, pp, pinert)
    sg = np.ones((NW, nn), dtype=np.int8)
    for L in range(1, int(depth.max()) + 1):
        lev = np.flatnonzero(depth == L)
        sg[:, lev] = sg[:, parent[lev]] * ps[:, last[lev]]
    nodekey = (na.astype(np.int64) + 5000) * 20011 + (nb.astype(np.int64) + 5000)
    sg[WEIGHTS.index('iid')] = np.where(splitmix(nodekey, 31) < 0.5, -1, 1)
    order = np.argsort(Nk, kind='stable')
    e95 = sg[WEIGHTS.index('e95')][order].copy()
    rnk = splitmix(nodekey[order], 32) + (np.arange(nn) // 64)      # permute within blocks of 64 consecutive norms
    perm = np.argsort(rnk, kind='stable')
    sh = np.empty(nn, dtype=np.int8); sh[order] = e95[perm]
    sh[0] = 1
    sg[WEIGHTS.index('shuf95')] = sh
    neg = (sg < 0)
    patA = np.zeros(nn, dtype=np.uint8); patB = np.zeros(nn, dtype=np.uint8)
    for w in range(NW):
        if w < 7: patA |= (neg[w].astype(np.uint8) << w)
        else: patB |= (neg[w].astype(np.uint8) << (w - 7))
    frac = neg.mean(axis=1)
    print("fraction of nodes with weight -1: " + ", ".join(f"{WEIGHTS[w]} {frac[w]:.3f}" for w in range(NW)), flush=True)
    # ---- n = 1 values
    u1 = np.log(Nk / Z)
    bv = base * Vtest(u1, test)
    # ---- n >= 2 terms: primary n coprime to 2, q_n^3 <= Xmax
    qmax = int(math.floor(Xmax ** (1.0 / 3.0) + 1e-9))
    nlist = []
    B = int(math.sqrt(4 * qmax / 3.0)) + 4
    for a in range(-2 * B, 2 * B + 1):
        if a % 3 != 1: continue
        for b in range(-2 * B, 2 * B + 1):
            if b % 3 != 0: continue
            q = a * a - a * b + b * b
            if q < 2 or q > qmax or q % 2 == 0: continue
            if q ** 3 > Xmax: continue
            nlist.append((q, a, b))
    nlist.sort()
    prime_of = {(int(pa[k]), int(pb[k])): k for k in range(min(npr, 4000)) if pq[k] <= qmax}
    coef = []; wsign = []; facptr = [0]; facprime = []; facexp = []; listptr = [0]; listidx = []; listbv = []
    for q, a, b in nlist:
        # factor n over primary primes
        rem = (a, b); fac = []
        for (xa, xb), k in prime_of.items():
            qn = int(pq[k]); e = 0
            while True:
                num = zmul(rem, (xa - xb, -xb))
                if num[0] % qn == 0 and num[1] % qn == 0 and (rem[0] ** 2 - rem[0] * rem[1] + rem[1] ** 2) % qn == 0:
                    cand = (num[0] // qn, num[1] // qn)
                    rem = cand; e += 1
                else:
                    break
            if e: fac.append((k, e))
        assert rem == (1, 0), (a, b, rem, fac)        # primary n is a product of primary primes
        al = complex(a - b / 2.0, b * SQ3 / 2.0) / math.sqrt(q)
        al3 = (np.conj(al) if variant == 'bar' else al) ** 3
        coef.append(al3 / q)
        ws = np.ones(NW, dtype=np.int8)
        for k, e in fac:
            if e % 2: ws *= ps[:, k]
        key = np.array([(a + 5000) * 20011 + (b + 5000)], dtype=np.int64)
        ws[WEIGHTS.index('iid')] = -1 if splitmix(key, 41)[0] < 0.5 else 1
        ws[WEIGHTS.index('shuf95')] = -1 if splitmix(key, 42)[0] < float(frac[WEIGHTS.index('e95')]) else 1
        wsign.append(ws)
        for k, e in fac:
            facprime.append(k); facexp.append(e)
        facptr.append(len(facprime))
        idx = np.flatnonzero(Nk * (q ** 3) <= Xmax)
        un = np.log(Nk[idx] * float(q ** 3) / Z)
        vv = base[idx] * Vtest(un, test)
        nzv = np.abs(vv) > 0
        listidx.append(idx[nzv].astype(np.int32)); listbv.append(vv[nzv])
        listptr.append(listptr[-1] + int(nzv.sum()))
    nterm = len(nlist)
    print(f"n-terms (n != 1): {nterm}, q_n <= {qmax}, total list entries {listptr[-1]}", flush=True)
    with open(out, 'wb') as f:
        np.array([0x52354335, Z, npr, nn, NW, nterm, listptr[-1], len(facprime)], dtype=np.int64).tofile(f)
        pp.astype(np.int64).tofile(f); pw.astype(np.int64).tofile(f)
        parent.tofile(f); last.tofile(f); bv.astype(np.complex128).tofile(f); patA.tofile(f); patB.tofile(f)
        np.array(coef, dtype=np.complex128).tofile(f)
        (np.array(wsign, dtype=np.int8).reshape(nterm, NW) if nterm else np.zeros((0, NW), np.int8)).tofile(f)
        np.array(facptr, dtype=np.int32).tofile(f); np.array(facprime, dtype=np.int32).tofile(f); np.array(facexp, dtype=np.int32).tofile(f)
        np.array(listptr, dtype=np.int64).tofile(f)
        (np.concatenate(listidx) if nterm else np.zeros(0, np.int32)).astype(np.int32).tofile(f)
        (np.concatenate(listbv) if nterm else np.zeros(0, np.complex128)).astype(np.complex128).tofile(f)
    # side data for the analysis: diagonal and Mertens-type sums
    import json
    side = {'Z': Z, 'test': test, 'variant': variant, 'Xmax': Xmax, 'nodes': int(nn), 'nprimes': int(npr), 'nterms': nterm,
            'frac_neg': {WEIGHTS[w]: float(frac[w]) for w in range(NW)},
            'diag_n1': float((np.abs(bv) ** 2).sum()),
            'mertens': {}, 'mertens_abs': float((np.abs(bv) * np.sqrt(Nk / Z) ** 0).sum())}
    mu = np.where(depth % 2 == 0, 1.0, -1.0)
    vv1 = Vtest(u1, test) / np.sqrt(Nk)
    for w in range(NW):
        side['mertens'][WEIGHTS[w]] = float((mu * sg[w] * vv1).sum())
    json.dump(side, open(out + '.side.json', 'w'), indent=1)
    print("mertens-type sums sum mu(c) w(c) q_c^-1/2 V(q_c/Z): " + ", ".join(f"{k} {v:.4f}" for k, v in side['mertens'].items()), flush=True)
    print(f"wrote {out}", flush=True)

if __name__ == '__main__':
    main()
