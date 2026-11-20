#!/usr/bin/env python3
"""pass2.py -- per row m (N(m) <= Qmax, index range [i0,i1)):
  (i)  sextic exponents of chi_c(m) for all squarefree c prime to 6 with N(c) <= CM (int8, -1 if not coprime) -> spectrum
  (ii) the n != 1 part of the toy completed cubic row with A = c n^3:
         Bn[key] = sum_{n sf, n != 1, (n, 6m) = 1} psi(n^3) chi_n(m)^3 N(n)^{-1} sum_{c sf} gamma_2(c) psi(c) chi_c(m) N(c)^{-1/2} V(N(c) N(n)^3 / R)
       (c, n may share primes; non-squarefree n omitted: first omitted norm 49, relative weight 1/49)
usage: pass2.py Qmax i0 i1 out_prefix
"""
import sys, os, math, time
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
Z6 = Z.ZETA6
CM = 100000
def main():
    Qmax, i0, i1, pref = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    t0 = time.time()
    T = A.SFTable(SX + '/data/sf_1e7.npz')
    Nf = T.N.astype(float)
    alpha = ((T.na - T.nb / 2.0) + 1j * (T.nb * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
    Gc = T.G()
    psis = {'aG': alpha * Gc, 'a': alpha, '1': np.ones(T.n, complex)}
    psin = {'aG': alpha ** 3, 'a': alpha ** 3, '1': np.ones(T.n, complex)}
    Rs = (10 ** 4, 10 ** 5, 10 ** 6)
    terms = []      # (key index, n node, idx array, coefficient array incl. psi(n^3)/N(n))
    keys = [(name, R) for R in Rs for name in psis]
    order = T.order; Ns = T.Ns
    for R in Rs:
        nmax = (R * math.exp(2.2)) ** (1 / 3.0)
        nn = [int(x) for x in np.flatnonzero((T.N > 1) & (T.N <= nmax))]
        for nd in nn:
            Reff = R / float(T.N[nd]) ** 3
            lo = np.searchsorted(Ns, Reff * math.exp(-2.2), 'left'); hi = np.searchsorted(Ns, Reff * math.exp(2.2), 'right')
            idx = np.sort(order[lo:hi])
            if len(idx) == 0: continue
            lx = np.log(Nf[idx] / Reff); w = np.exp(-2 * lx ** 2) / np.sqrt(Nf[idx])
            for name in psis:
                terms.append((keys.index((name, R)), nd, idx, T.g2[idx] * psis[name][idx] * w * psin[name][nd] / Nf[nd]))
    print(f"n-terms: {len(terms)}; total c-terms {sum(len(t[2]) for t in terms)}", flush=True)
    small = np.flatnonzero(T.N <= CM)
    Rr = int(math.isqrt(4 * Qmax // 3)) + 2
    ms = sorted([(a, b) for a in range(-Rr, Rr + 1) for b in range(-Rr, Rr + 1) if (a, b) != (0, 0) and Z.norm((a, b)) <= Qmax],
                key=lambda t: (Z.norm(t), t))
    i1 = min(i1, len(ms)); ms = ms[i0:i1]; n = len(ms)
    E = np.zeros((n, len(small)), np.int8); Bn = np.zeros((n, len(keys)), complex)
    for i, m in enumerate(ms):
        em = T.node_exponents(m)
        E[i] = em[small]
        for (kj, nd, idx, cf) in terms:
            en = em[nd]
            if en < 0: continue
            e = em[idx]
            Bn[i, kj] += Z6[(3 * en) % 6] * (cf * np.where(e >= 0, Z6[np.maximum(e, 0)], 0)).sum()
        if (i + 1) % 500 == 0 or i + 1 == n:
            print(f"  {i+1}/{n}, {time.time()-t0:.0f}s", flush=True)
    np.savez(pref + '.npz', ms=np.array(ms), E=E, Bn=Bn, keys=np.array([f"{k[0]}|{k[1]}" for k in keys]),
             cN=T.N[small], cna=T.na[small], cnb=T.nb[small], cg2=T.g2[small], cm4=T.m4[small], cm9=T.m9[small], cdepth=T.depth[small])
    print(f"done {time.time()-t0:.1f}s", flush=True)
main()
