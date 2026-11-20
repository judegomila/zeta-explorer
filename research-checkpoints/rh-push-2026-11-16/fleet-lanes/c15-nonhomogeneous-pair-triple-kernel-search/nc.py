"""c15 product families (PREREG sections 3, 4 and amendment A1): triples (F, F x chi, F x chi^2) for cubic chi (kind T),
product pairs (F, F x chi) for quadratic chi (kind Q). Product kernel C by convolution or by the theta-side series.
usage: nc.py <outdir> [T,Q]"""
import json
import math
import multiprocessing as mp
import os
import sys
import time
import numpy as np
import kern
import jk
import jobj
import nobj
import nsolve

PI = math.pi
UL = -1.0 + np.arange(116) / 32.0            # lattice (1/32) Z in [-1, 2.59375]
LC = 11.0                                    # convolution grid [-LC, LC], step 1/64
T0, DT, NT = -20.0, 1.0 / 256, 24 * 256 + 1  # Phi tables on [T0, 4]
_TAB = {}
_RW = {}


# ---------- characters ----------
def is_cubic(c):
    v = c.vals[np.abs(c.vals) > 0.5]
    return (not c.real) and bool(np.max(np.abs(v ** 3 - 1)) < 1e-9)


def sq(c):
    return kern.Chi(c.q, c.vals ** 2, c.name + '^2')


def mul(a, b):
    q = a.q * b.q
    n = np.arange(q)
    return kern.Chi(q, a.vals[n % a.q] * b.vals[n % b.q], a.name + '*' + b.name)


# ---------- Phi tables ----------
def phi(beta, t):
    return np.exp(beta * t - PI * np.exp(2 * t))


def table(bA, op, bs):
    key = (bA, op, tuple(bs))
    if key in _TAB:
        return _TAB[key]
    t = T0 + DT * np.arange(NT)
    w = PI * np.exp(2 * t)
    fA = phi(bA, t) * (4 * w * (w - bA - 1) if op else 1.0)
    f2 = phi(bs[0], t)
    X = DT * np.convolve(fA, f2)
    Xd = DT * np.convolve(fA, (bs[0] - 2 * w) * f2)
    start = 2 * T0
    if len(bs) == 2:
        f3 = phi(bs[1], t)
        X = DT * np.convolve(X, f3)
        Xd = DT * np.convolve(Xd, f3)
        start = 3 * T0
    i0 = int(round((-19.0 - start) / DT))
    i1 = int(round((4.0 - start) / DT))
    F, Fd = X[i0:i1 + 1].copy(), Xd[i0:i1 + 1].copy()
    big = np.nonzero(np.abs(F) > 1e-24 * np.abs(F).max())[0]
    tcut = -19.0 + DT * big[-1]
    _TAB[key] = (F, Fd, tcut)
    return _TAB[key]


def herm(tab, t):
    F, Fd, tcut = tab
    x = (np.clip(t, -19.0, 4.0 - 1e-9) + 19.0) / DT
    i = np.floor(x).astype(np.int64)
    s = x - i
    h00 = (1 + 2 * s) * (1 - s) ** 2
    h10 = s * (1 - s) ** 2
    h01 = s * s * (3 - 2 * s)
    h11 = s * s * (s - 1)
    v = h00 * F[i] + h10 * DT * Fd[i] + h01 * F[i + 1] + h11 * DT * Fd[i + 1]
    return np.where((t > tcut) | (t < -19.0), 0.0, v)


# ---------- theta-side atoms ----------
def rw(w, M):
    if w not in _RW or len(_RW[w]) <= M:
        _RW.clear()
        _RW[w] = jk.theta_w_coeffs(w, M)
    return _RW[w]


def atoms(k, Y, primes=None):
    """member -> dict(lat ('n' | 'm' | None), idx or nu, w (weights), S (half log scale), beta, op)"""
    o = k.o if isinstance(k, jk.W) else k
    n = np.arange(1, Y + 1)
    if isinstance(o, kern.Zeta):
        return dict(lat='n', w=2.0 * n ** -0.5, S=0.0, beta=0.5, op=True)
    if isinstance(o, kern.Chi):
        b = 0.5 + o.d
        return dict(lat='n', w=np.conj(o.omega) * 2.0 * o.vals[n % o.q] * n.astype(float) ** (o.d - b) * o.q ** (b / 2), S=0.5 * math.log(o.q), beta=b, op=False)
    if isinstance(o, kern.NoFE):
        return dict(lat='n', w=2.0 * np.asarray(o.a)[1:Y + 1] * n ** -0.5, S=0.0, beta=0.5, op=True)
    if isinstance(o, kern.DHType):
        b = 0.5 + o.chi.d
        a = jk.dh_coeffs(o, Y)[1:]
        return dict(lat='n', w=2.0 * a * n.astype(float) ** (o.chi.d - b) * o.chi.q ** (b / 2), S=0.5 * math.log(o.chi.q), beta=b, op=False)
    if isinstance(o, kern.ThetaW):
        b = o.w / 2.0
        return dict(lat='m', w=rw(o.w, Y)[1:Y + 1] * n ** (-b / 2), S=0.0, beta=b, op=True)
    if isinstance(o, jk.BEU):
        ints = jk.beu_integers(o.delta, float(Y), primes)[1:]
        nu = np.array([v for v, _ in ints])
        return dict(lat=None, nu=nu, w=2.0 * nu ** -0.5, S=0.0, beta=0.5, op=True)
    if isinstance(o, jk.GS) and hasattr(o, 'tw'):
        chi, d, NG, src = o.tw['chi'], o.tw['d'], o.tw['NG'], o.tw['src']
        a = np.asarray(src.a)[1:Y + 1] if hasattr(src, 'a') else jk.dh_coeffs(src, Y)[1:]
        b = 0.5 + d
        Ns = NG * chi.q
        return dict(lat='n', w=np.conj(chi.omega) * 2.0 * a * chi.vals[n % chi.q] * n.astype(float) ** (d - b) * Ns ** (b / 2), S=0.5 * math.log(Ns), beta=b, op=False)
    if isinstance(o, jk.GS) and hasattr(o, 'thw'):
        w, chi = o.thw
        b = w / 2.0
        return dict(lat='m', w=np.conj(chi.omega) * rw(w, Y)[1:Y + 1] * chi.vals[n % chi.q] * (chi.q / n) ** (b / 2), S=0.5 * math.log(chi.q), beta=b, op=False)
    if isinstance(o, jk.GS) and hasattr(o, 'beu'):
        delta, chi, d = o.beu
        ints = jk.beu_integers(delta, float(Y), primes)[1:]
        nu = np.array([v for v, _ in ints])
        x = np.array([np.prod([chi.vals[p % chi.q] for p in fac]) for _, fac in ints], dtype=np.complex128)
        b = 0.5 + d
        return dict(lat=None, nu=nu, w=np.conj(chi.omega) * 2.0 * x * nu ** (d - b) * chi.q ** (b / 2), S=0.5 * math.log(chi.q), beta=b, op=False)
    raise TypeError(type(o))


def member_S(k):
    o = k.o if isinstance(k, jk.W) else k
    if isinstance(o, kern.Chi):
        return 0.5 * math.log(o.q)
    if isinstance(o, kern.DHType):
        return 0.5 * math.log(o.chi.q)
    if isinstance(o, jk.GS) and hasattr(o, 'tw'):
        return 0.5 * math.log(o.tw['NG'] * o.tw['chi'].q)
    if isinstance(o, jk.GS) and (hasattr(o, 'thw') or hasattr(o, 'beu')):
        return 0.5 * math.log((o.thw[1] if hasattr(o, 'thw') else o.beu[1]).q)
    return 0.0


def member_lat(k):
    o = k.o if isinstance(k, jk.W) else k
    if isinstance(o, kern.ThetaW) or (isinstance(o, jk.GS) and hasattr(o, 'thw')):
        return 'm'
    if isinstance(o, jk.BEU) or (isinstance(o, jk.GS) and hasattr(o, 'beu')):
        return None
    return 'n'


def member_beta(k):
    o = k.o if isinstance(k, jk.W) else k
    if isinstance(o, kern.Chi):
        return 0.5 + o.d, False
    if isinstance(o, kern.DHType):
        return 0.5 + o.chi.d, False
    if isinstance(o, kern.ThetaW):
        return o.w / 2.0, True
    if isinstance(o, jk.GS) and hasattr(o, 'thw'):
        return o.thw[0] / 2.0, False
    if isinstance(o, jk.GS) and hasattr(o, 'tw'):
        return 0.5 + o.tw['d'], False
    if isinstance(o, jk.GS) and hasattr(o, 'beu'):
        return 0.5 + o.beu[2], False
    return 0.5, True


def dconv(a, b, Y):
    """Dirichlet convolution of weight arrays indexed 1..Y (a[0] is index 1)."""
    out = np.zeros(Y, dtype=np.result_type(a, b, np.float64))
    for i in range(1, Y + 1):
        x = a[i - 1]
        if x != 0:
            k = Y // i
            out[i - 1::i][:k] += x * b[:k]
    return out


def theta_product(members, primes=None):
    """C on UL by the theta-side series; -> (C, noise, info)"""
    bb = [member_beta(m) for m in members]
    tab = table(bb[0][0], bb[0][1], [b for b, _ in bb[1:]])
    tcut = tab[2]
    S0 = sum(member_S(m) for m in members)
    lat = member_lat(members[0])
    p = 1.0 if lat == 'm' else 2.0
    Y = int(math.exp((2.0 / p) * (tcut - UL[0] + S0))) + 2
    print('    theta route: lattice %s, Y = %d, planned %.0f MB' % (lat, Y, Y * 16 * 4 / 1e6 + 116 * 20000 * 8 * 10 / 1e6 + (1200.0 * Y / 1e6 if lat == 'm' else 0)), flush=True)
    at = [atoms(m, Y, primes) for m in members]
    assert all(len(a['w']) == Y for a in at if a['lat'] is not None), ('coefficient table too short', Y)
    C = np.zeros(len(UL), dtype=np.complex128)
    Nz = np.zeros(len(UL))
    if lat is not None:
        c = at[0]['w']
        for a in at[1:]:
            c = dconv(c, a['w'], Y)
        s = (p / 2.0) * np.log(np.arange(1, Y + 1)) - S0
        for i in range(0, Y, 20000):
            v = herm(tab, UL[:, None] + s[None, i:i + 20000])
            C += v @ c[i:i + 20000]
            Nz += np.abs(v) @ np.abs(c[i:i + 20000])
    else:
        nu = at[0]['nu']
        w = at[0]['w']
        for a in at[1:]:
            nn, ww = [], []
            for i in range(0, len(nu), 500):          # chunked outer product: at most 500 x len(a) entries at a time
                P = np.multiply.outer(nu[i:i + 500], a['nu'])
                ok = P <= Y
                ww.append(np.multiply.outer(w[i:i + 500], a['w'])[ok])
                nn.append(P[ok])
            nu = np.concatenate(nn)
            w = np.concatenate(ww)
        s = np.log(nu) - S0
        for i in range(0, len(s), 20000):
            v = herm(tab, UL[:, None] + s[None, i:i + 20000])
            C += v @ w[i:i + 20000]
            Nz += np.abs(v) @ np.abs(w[i:i + 20000])
        Y = len(s)
    return C, 1e-6 * Nz + 1e-300, dict(route='theta', Y=int(Y), tcut=float(tcut))


def conv_product(members):
    g = np.arange(-int(LC * 64), int(LC * 64) + 1) / 64.0
    K = [np.asarray(m.val(g, False)[0]) for m in members]
    X = np.convolve(K[0], K[1]) / 64.0
    A = np.convolve(np.abs(K[0]), np.abs(K[1])) / 64.0
    if len(K) == 3:
        X = np.convolve(X, K[2]) / 64.0
        A = np.convolve(A, np.abs(K[2])) / 64.0
    idx = np.round((UL + len(K) * LC) * 64).astype(int)
    edge = max(float(np.abs(k[[0, -1]]).max() / np.abs(k).max()) for k in K)
    return X[idx], 1e-13 * A[idx] + 1e-300, dict(route='conv', edge=edge)


class Obj:
    def __init__(self, group, members, route, name):
        self.group = group
        self.members = members
        self.route = route
        self.name = name


def compute(o, primes=None, both=False):
    t = time.time()
    C, N, info = (conv_product(o.members) if o.route == 'conv' else theta_product(o.members, primes))
    M = []
    Mn = []
    for i, m in enumerate(o.members):
        K, Nk = m.val(UL, False if i == 0 else True)
        M.append(np.asarray(K, dtype=np.complex128))
        Mn.append(np.asarray(Nk, dtype=np.float64))
    info['seconds'] = time.time() - t
    if both:
        C2, N2, _ = theta_product(o.members, primes)
        sc = np.abs(C).max()
        info['both_maxdiff_rel_to_max'] = float(np.abs(C - C2).max() / sc)
        info['both_maxdiff_pointwise'] = float(np.max(np.abs(C - C2) / np.maximum(np.abs(C), 1e-6 * sc)))
    return dict(C=C, N=N, M=np.array(M), Mn=np.array(Mn), info=info)


# ---------- objects ----------
def build(kind, info=None):
    info = {} if info is None else info
    tr = jobj.char_objs(3, 13)
    H = jobj.char_objs(14, 40)
    if kind == 'T':
        ctr = [c for c in tr if is_cubic(c)]
        cho = [c for c in H if is_cubic(c)]
    else:
        ctr = [c for c in tr if c.real]
        cho = [c for c in H if c.real]
    info['train_chi'] = [c.name for c in ctr]
    info['heldout_chi'] = [c.name for c in cho]
    Z = jk.W(kern.ZETA)
    O = []

    def tw(c):
        return [c, sq(c)] if kind == 'T' else [c]

    def Lmem(a, c):
        if a is None:
            return [Z] + [jk.W(x) for x in tw(c)]
        return [jk.W(a)] + [jk.W(mul(a, x)) for x in tw(c)]
    for c in ctr:
        O.append(Obj('P', Lmem(None, c), 'conv', 'Z;' + c.name))
    for c in ctr:
        for a in tr:
            if math.gcd(a.q, c.q) == 1:
                O.append(Obj('PX', Lmem(a, c), 'conv', a.name + ';' + c.name))
    r = np.random.Generator(np.random.PCG64(150000 + (0 if kind == 'T' else 50)))
    nz = min(len(cho), 3 if kind == 'T' else 9)
    for i in np.sort(r.choice(len(cho), nz, replace=False)):
        O.append(Obj('PH', Lmem(None, cho[i]), 'conv', 'Z;' + cho[i].name))
    n = 0
    while n < 24 - nz:
        c = cho[int(r.integers(0, len(cho)))]
        a = tr[int(r.integers(0, len(tr)))]
        if math.gcd(a.q, c.q) == 1:
            O.append(Obj('PH', Lmem(a, c), 'conv', a.name + ';' + c.name))
            n += 1
    pr = jobj.primes_upto(6000)
    cplx = [(c, part) for c in jobj.char_objs(7, 24) if not c.real for part in ('Re', 'Im')]
    by = {c.name: c for c in tr}

    def ctrl(k, par, c, grp):
        X = tw(c)
        if k == 1:
            g = kern.DHType(par[0], par[1], 'DH%s%s' % (par[0].name, par[1]))
            return Obj(grp, [jk.W(g)] + [jk.dh_twist(g, x, g.name + 'x' + x.name) for x in X], 'theta', g.name + ';' + c.name)
        if k == 2:
            p0, cc = par
            g = kern.TNR(p0, cc, 'TNR%d_%.5f' % (p0, cc))
            return Obj(grp, [jk.W(g)] + [jk.tnr_twist(x, p0, cc, g.name + 'x' + x.name) for x in X], 'conv', g.name + ';' + c.name)
        if k == 3:
            return Obj(grp, [jk.W(kern.EA(par, 'EA%.5f' % par))] + [jk.EAX(par, x, 'EAx' + x.name) for x in X], 'conv', 'EA%.5f;%s' % (par, c.name))
        if k == 4:
            return Obj(grp, [jk.W(kern.Heat(par, 'HEAT%.5f' % par))] + [jk.HeatX(x, par, 'HEATx' + x.name) for x in X], 'conv', 'HEAT%.5f;%s' % (par, c.name))
        if k == 5:
            return Obj(grp, [jk.W(kern.ThetaW(par, 'THW%.5f' % par))] + [jk.thw_twist(par, x, 'THWx' + x.name) for x in X], 'theta', 'THW%.5f;%s' % (par, c.name))
        if k in (6, 7):
            o = jobj.u_obj(par, 'U-%d' % par) if k == 6 else jobj.thin_obj(par, 'THIN-%s' % par)
            return Obj(grp, [jk.W(o)] + [jk.general_twist(o.a, x, 0, 1, o.name + 'x' + x.name, src=o) for x in X], 'theta', o.name + ';' + c.name)
        if k == 8:
            return Obj(grp, [jk.BLS(kern.ZETA, par, 'BLS')] + [jk.BLS(x, par, 'BLSx' + x.name) for x in X], 'conv', 'BLS%.4f+%.4fi;%s' % (par.real, par.imag, c.name))
        g = jk.BEU(par, pr, 'BEU%.5f' % par)
        return Obj(grp, [g] + [jk.beu_twist(par, pr, x, g.name + 'x' + x.name) for x in X], 'theta', g.name + ';' + c.name)
    chi5 = kern.Chi(5, by['chi5.2c'].vals, 'chi5.2c')
    TRPAR = {1: [(chi5, 'Re'), (chi5, 'Im')], 3: [0.125, 0.25], 4: [-0.1, -0.5], 5: [0.5, 3.0], 6: [120000, 120001], 7: [0.9, 0.75],
             8: [0.25 + 2j, 0.1 + 5j], 9: [0.5, 0.25]}
    for k in range(1, 10):
        pool = [c for c in ctr if (k != 1 or c.q % 5)]
        tws = [(pool[i % len(pool)], i // len(pool) if kind == 'T' else 0) for i in range(5)] if kind == 'T' else [(c, 0) for c in pool[:5]]
        for c, j in tws:
            if k == 2:
                sp = nobj.split_primes(c, 2)
                par = (sp[j], nobj.tnr_c(sp[j], 0.5))
            else:
                par = TRPAR[k][j]
            O.append(ctrl(k, par, c, 'C%d' % k))
        r = np.random.Generator(np.random.PCG64(150000 + k + (0 if kind == 'T' else 50)))
        for j in range(24):
            if k == 1:
                g = cplx[int(r.integers(0, len(cplx)))]
                cand = [c for c in ctr if math.gcd(c.q, g[0].q) == 1]
                c = cand[int(r.integers(0, len(cand)))]
                par = g
            elif k == 2:
                c = cho[int(r.integers(0, len(cho)))]
                sp = [p for p in nobj.split_primes(c, 3) if p <= 150]
                p0 = sp[int(r.integers(0, len(sp)))]
                par = (p0, nobj.tnr_c(p0, r.uniform(0.05, 0.95)))
            elif k == 3:
                cand = [c for c in cho if c.q <= 24]
                c = cand[int(r.integers(0, len(cand)))]
                par = float(r.uniform(0.03, 0.47))
            elif k == 4:
                c = cho[int(r.integers(0, len(cho)))]
                par = float(-10 ** r.uniform(-1.7, 0.3))
            elif k == 5:
                cand = [c for c in ctr if c.q >= 7]
                c = cand[int(r.integers(0, len(cand)))]
                while True:
                    par = float(r.uniform(0.25, 6))
                    if min(abs(par - x) for x in (1, 2, 4)) >= 0.05:
                        break
            elif k == 6:
                c = cho[int(r.integers(0, len(cho)))]
                par = 123000 + j
            elif k == 7:
                c = cho[int(r.integers(0, len(cho)))]
                par = round(float(r.uniform(0.55, 0.98)), 4)
            elif k == 8:
                c = cho[int(r.integers(0, len(cho)))]
                par = complex(r.uniform(0.05, 0.45), r.uniform(0.5, 8))
            else:
                c = cho[int(r.integers(0, len(cho)))]
                par = float(r.uniform(0.1, 0.9))
            O.append(ctrl(k, par, c, 'H%d' % k))
    return O, pr


# ---------- families ----------
def node_list():
    iu, ih = np.meshgrid(np.arange(116), np.arange(0, 116), indexing='ij')
    iu, ih = iu.ravel(), ih.ravel()
    ok = (iu - ih >= 0) & (iu + ih <= 115)
    return iu[ok], ih[ok]


def family_values(R, iu, ih):
    """R: list of per-object dicts -> dict fam -> (V1, E1, V2, E2) (nodes, nobj)"""
    n = len(R)
    F = len(iu)
    out = {f: [np.full((F, n), np.nan) for _ in range(4)] for f in ('c1', 'c2', 'c3')}
    from nf import logabs
    for j, o in enumerate(R):
        C, N, M, Mn = o['C'], o['N'], o['M'], o['Mn']
        if len(M) == 3:
            sel = [iu - ih, iu, iu + ih]
        else:
            sel = [iu - ih, iu + ih]
        Pi = np.ones(F, dtype=np.complex128)
        rel = np.zeros(F)
        with np.errstate(divide='ignore', invalid='ignore', over='ignore'):
            for m, mn, s in zip(M, Mn, sel):
                Pi = Pi * m[s]
                rel = rel + mn[s] / np.abs(m[s])
            Pn = np.abs(Pi) * rel
            out['c1'][0][:, j] = C[iu].real
            out['c1'][1][:, j] = N[iu]
            out['c1'][2][:, j] = Pi.real
            out['c1'][3][:, j] = Pn
            Q = C[iu] / Pi
            bad = ~np.isfinite(Q) | ~(rel < 1e-3)
            out['c2'][0][:, j] = np.where(bad, np.nan, Q.real)
            out['c2'][1][:, j] = np.where(bad, np.nan, (N[iu] + np.abs(Q) * Pn) / np.abs(Pi))
            out['c2'][2][:, j] = 1.0
            out['c2'][3][:, j] = 0.0
        lc, ec = logabs(C, N)
        L = lc[iu - ih] - 2 * lc[iu] + lc[iu + ih]
        E = ec[iu - ih] + 2 * ec[iu] + ec[iu + ih]
        Ls = 0
        Es = 0
        for m, mn in zip(M, Mn):
            lm, em = logabs(m, mn)
            Ls = Ls + lm[iu - ih] - 2 * lm[iu] + lm[iu + ih]
            Es = Es + em[iu - ih] + 2 * em[iu] + em[iu + ih]
        z = ih == 0
        out['c3'][0][:, j] = np.where(z, np.nan, L)
        out['c3'][1][:, j] = np.where(z, np.nan, E)
        out['c3'][2][:, j] = np.where(z, np.nan, Ls)
        out['c3'][3][:, j] = np.where(z, np.nan, Es)
    return out


OBJS = None
PR = None


def _w(i):
    o = OBJS[i]
    both = o.group == 'P' or (o.group == 'PX' and i % 7 == 0)
    try:
        return i, compute(o, PR, both), None
    except Exception as e:           # reported, not hidden
        import traceback
        return i, None, traceback.format_exc()[-600:]


def main():
    global OBJS, PR
    out = sys.argv[1]
    kinds = sys.argv[2].split(',') if len(sys.argv) > 2 else ['T', 'Q']
    os.makedirs(out, exist_ok=True)
    nw = int(os.environ.get('RH_WORKERS', '4'))
    for kind in kinds:
        t0 = time.time()
        info = {}
        OBJS, PR = build(kind, info)
        G = np.array([o.group for o in OBJS])
        d = nobj.gidx(G)
        print('kind %s: %d objects built in %.0fs; groups %s' % (kind, len(OBJS), time.time() - t0, {k: len(v) for k, v in d.items()}), flush=True)
        print('planned: per object complex128[5 x 116]; Phi tables 2 x float64[%d]; convolution grids complex128[%d]; theta^w lists as registered; workers %d'
              % (int(23 / DT) + 1, 3 * int(2 * LC * 64) + 1, min(nw, 8)), flush=True)
        ctx = mp.get_context('fork')
        R = [None] * len(OBJS)
        errs = []
        with ctx.Pool(min(nw, 8)) as pool:
            for i, res, err in pool.imap_unordered(_w, range(len(OBJS))):
                R[i] = res
                if err:
                    errs.append((OBJS[i].name, err))
        if errs:
            print('ERRORS', len(errs), errs[:3], flush=True)
            raise SystemExit(1)
        val = [dict(name=OBJS[i].name, **{k: v for k, v in R[i]['info'].items()}) for i in range(len(OBJS))]
        both = [v for v in val if 'both_maxdiff_rel_to_max' in v]
        print('kind %s: products done %.0fs; two-route check on %d positives: max diff / max|C| = %.2e; conv edge max %.1e'
              % (kind, time.time() - t0, len(both), max(v['both_maxdiff_rel_to_max'] for v in both), max(v.get('edge', 0) for v in val)), flush=True)
        np.savez(os.path.join(out, 'c%s_objects.npz' % kind), C=np.array([r['C'] for r in R]), N=np.array([r['N'] for r in R]),
                 M=np.array([np.concatenate((r['M'], np.zeros((3 - len(r['M']), 116)))) for r in R]), groups=G)
        iu, ih = node_list()
        V = family_values(R, iu, ih)
        summ = {}
        for f in ('c1', 'c2', 'c3'):
            keep = np.nonzero(ih >= 1)[0] if f == 'c3' else np.arange(len(iu))
            V1, E1, V2, E2 = [x[keep] for x in V[f]]
            s, rows = nsolve.analyse(V1, E1, V2, E2, d, nobj.ALLC, nobj.FE_CLASSES)
            for rr in rows:
                rr['u'] = float(UL[iu[keep[rr['row']]]])
                rr['h'] = float(ih[keep[rr['row']]] / 32.0)
            for k in list(s):
                if k.endswith('rows_feas') or k.endswith('rows_und'):
                    s[k] = s[k].tolist()
            tt, fl = nsolve.shuffle_test(V1, E1, V2, E2, G, nobj.ALLC, 200, 153000, nobj.gidx)
            s['shuffle'] = dict(n=200, ttrain=int(tt.sum()), full=int(fl.sum()))
            ideal = np.where(np.isin(G, ['P', 'PX', 'PH']), 0.0, 1.0)[None, :].repeat(5, 0)
            s2, _ = nsolve.analyse(ideal, np.full_like(ideal, 1e-12), np.ones_like(ideal), np.zeros_like(ideal), d, nobj.ALLC, nobj.FE_CLASSES)
            s['planted_ok'] = bool(s2['PA/all']['full'] == 5)
            summ[f] = dict(summary=s, rows=rows)
            pa, fe, pz = s['PA/all'], s['PA/FE'], s['PZ/all']
            print('%s-%s: nodes=%d | PA ttrain=%d und=%d full=%d rej=%s nrej_hist=%s best=%d | FE ttrain=%d und=%d full=%d best=%d | PZ ttrain=%d und=%d full=%d best=%d | shuffle=%s planted=%s und_share=%.4f'
                  % (f, kind, s['nodes'], pa['ttrain'], pa['undecided'], pa['full'], pa['rejected'], pa['nrej_hist'], pa['best_min_heldout'], fe['ttrain'], fe['undecided'], fe['full'], fe['best_min_heldout'],
                     pz['ttrain'], pz['undecided'], pz['full'], pz['best_min_heldout'], s['shuffle'], s['planted_ok'], s['und_share']), flush=True)
        json.dump(dict(kind=kind, info=info, groups=G.tolist(), names=[o.name for o in OBJS], validation=val, families=summ),
                  open(os.path.join(out, 'c%s_summary.json' % kind), 'w'))
    print('C-DONE', flush=True)


if __name__ == '__main__':
    main()
