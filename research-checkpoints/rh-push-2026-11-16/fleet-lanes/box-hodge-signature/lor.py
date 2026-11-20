# Lorentzian test (Braenden-Huh) of the quadratic generating polynomial f(x) = sum_{a,b} <C_a, C_b> x_a x_b of the form on the classes
# C = (fibre classes H_i, V_i; D_0..D_{n-1}).  For degree 2 the definition reads: (i) all coefficients >= 0, (ii) support M-convex,
# (iii) the Hessian (= 2 Gram; the only derivative of order d-2 = 0) has at most one positive eigenvalue.
# Entries are arb balls (bh.py); signs and inertia are certified.  Also the "nef-shifted" basis D_j + a(H+V) (a >= 0 minimal on a grid),
# which changes (i) but not (iii).
import sys, os, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bh
from flint import arb, arb_mat

def mconvex(supp, nv):
    S = set(supp)
    for a in supp:
        for b in supp:
            for i in range(nv):
                if a[i] > b[i]:
                    ok = False
                    for j in range(nv):
                        if a[j] < b[j]:
                            c = list(a); c[i] -= 1; c[j] += 1
                            if tuple(c) in S: ok = True; break
                    if not ok: return False
    return True

def full_gram(obj, xs, s, dps):
    """order: D_0, then fibre classes, then D_1.. (so that elimination without pivoting starts on a nonzero pivot)"""
    v, amp, c0 = bh.consts(s)
    n = len(xs); dmax = float((xs[-1]-xs[0]).mid()) + 0.01
    ps = bh.PrimeSide(obj, v, dmax, dps); ar = [bh.Arch(z, v, dmax, dps) for z in obj.gam]
    def I(d):
        d = abs(d) if not (d < 0) else -d
        A = obj.cond*amp*(-(d*d)/(2*v)).exp()
        for a in ar: A += a.at(d, c0)
        return ps.at(d, amp) - A
    names = ['D0']; vec = []
    fib = []
    for i, tau in enumerate(obj.poles):
        pre = c0.sqrt()*(v*tau*tau/4).exp()
        fib.append(('H%d' % i, [pre*(tau*x).exp() for x in xs])); fib.append(('V%d' % i, [pre*(-tau*x).exp() for x in xs]))
    names += [f[0] for f in fib] + ['D%d' % j for j in range(1, n)]
    N = len(names); nf = len(fib)
    G = [[arb(0)]*N for _ in range(N)]
    idx = [0] + list(range(nf+1, N))          # positions of D_0..D_{n-1}
    for a in range(n):
        for b in range(a+1):
            e = I(xs[a]-xs[b]); G[idx[a]][idx[b]] = G[idx[b]][idx[a]] = e
    for f in range(nf):
        for a in range(n): G[1+f][idx[a]] = G[idx[a]][1+f] = fib[f][1][a]
    for i in range(len(obj.poles)): G[1+2*i][2+2*i] = G[2+2*i][1+2*i] = arb(1)
    return names, G, nf, idx

def analyse(label, names, G, nf, idx, base):
    N = len(names)
    L = bh.ldl_mid(G)
    Xm = arb_mat(N, N, [x for r in L for x in r]).inv()
    mc, piv, worst = bh.certify(arb_mat(N, N, [x for r in G for x in r]), [[Xm[i, j].mid() for j in range(i+1)] for i in range(N)])
    pos = sum(1 for p in piv[:mc] if p > 0); neg = mc - pos
    def signs(Gm):
        ng = und = zero = 0; supp = []
        for a in range(N):
            for b in range(a, N):
                e = Gm[a][b]
                if e > 0:
                    m = [0]*N; m[a] += 1; m[b] += 1; supp.append(tuple(m))
                elif e < 0: ng += 1; m = [0]*N; m[a] += 1; m[b] += 1; supp.append(tuple(m))
                elif e == 0 and e.rad() == 0: zero += 1
                else: und += 1
        return ng, und, zero, supp
    ng, und, zero, supp = signs(G)
    mcx = mconvex(supp, N)
    lor = (ng == 0 and und == 0 and mcx and pos <= 1 and mc == N)
    # nef shift: D_j -> D_j + a (sum of fibre classes)
    ashift = None
    if nf:
        for a10 in range(0, 400):
            a = arb(a10)/10
            ok = True
            for x in idx:
                for y in idx:
                    e = G[x][y] + a*sum(G[1+f][x] + G[1+f][y] for f in range(nf)) + a*a*2*(nf//2)
                    if not (e > 0): ok = False; break
                if not ok: break
            if ok: ashift = a10/10; break
    print('%-34s classes %2d | certified inertia (+,-) = (%d,%d) of %d (expected + = %d iff positivity) | negative coefficients %d, undetermined %d, exact zeros %d | support M-convex %s | Lorentzian as given: %s | minimal shift a making all coefficients > 0: %s -> Lorentzian after shift: %s' % (
        label, N, pos, neg, N, base, ng, und, zero, mcx, lor, ashift, (ashift is not None and pos <= 1 and mc == N)), flush=True)

dps = 50
objs = ['zeta', 'DH', 'tw-_2', 'tw+_2', 'liouville', 'drop2', 'EA_0.2', 'EA_0.01']
for hs, n in [('0.1', 8), ('0.1', 14), ('0.03', 10), ('0.03', 40)]:
    for o in objs:
        bh.setprec(dps); obj = bh.make_obj(o)
        h = arb(hs); s = h*arb('0.75')
        xs = [h*j for j in range(n)]
        names, G, nf, idx = full_gram(obj, xs, s, dps)
        analyse('%s uniform h=%s n=%d' % (o, hs, n), names, G, nf, idx, obj.base)
for X in (16, 50):
    for o in objs:
        bh.setprec(dps); obj = bh.make_obj(o)
        qs = [1] + [q for q, p, k in bh.prime_powers(X)]
        xs = [arb(q).log() for q in qs]
        names, G, nf, idx = full_gram(obj, xs, arb('0.05'), dps)
        analyse('%s prime powers <= %d, s=0.05' % (o, X), names, G, nf, idx, obj.base)
