"""Exact check of the identity R_N(m; mu) = kappa_N * conj( sum_{A sf, (A,m)=1} g_6(m, A) ), |kappa_N| = 1 (Lemma G + |g_6(1,A)|^2 = q^N)."""
from analyze import RR, cache, TG
from exact import z6red
import os
q = 7; R = RR(q); tot = bad = 0
for d, N in ((4, 1), (4, 2), (4, 3), (4, 4), (5, 2), (5, 4)):
    nm = q ** d
    C = {}
    for line in open(cache('ck', q, d, N)):
        t = [int(x) for x in line.split()]
        if t and t[1] == N: C[t[0]] = z6red(t[2:8])          # key e1 = N: squarefree A coprime to m (fast path)
    fn = cache('row', q, d, N, 0, 4, 0, 0, 0, 0)
    Rw = {}
    for line in open(fn):
        t = [int(x) for x in line.split()]
        if t: Rw[t[0]] = z6red(t[1:7])
    g1 = R.red(R.Gpow(1, N)); g2 = R.red(R.Gpow(2, N))
    el = lambda z, g: R.rmul(g, R.rz6(z))
    cm = {m: el(C.get(m, (0, 0)), g1) for m in range(nm)}; rm = {m: el(Rw[m], g2) for m in range(nm)}
    m0 = next(m for m in range(nm) if any(cm[m]))
    n0 = R.rmul(cm[m0], R.rconj(cm[m0])); p0 = R.rmul(rm[m0], cm[m0])
    b = 0
    for m in range(nm):
        nmn = R.rmul(cm[m], R.rconj(cm[m]))
        if R.rmul(R.rmul(rm[m], cm[m]), n0) != R.rmul(p0, nmn): b += 1
        if R.rmul(rm[m], R.rconj(rm[m])) != nmn: b += 1
    k2 = R.rabs2(p0) / R.rabs2(n0)
    tot += nm; bad += b
    print('d=%d N=%d: m tested %d, violations %d, |kappa|^2 = %s' % (d, N, nm, b, k2))
print('TOTAL', tot, 'violations', bad)
