"""Author's referee check (independent evaluation path, mpmath 40 digits, formulas re-typed; not an independent referee).
Samples float64-decided entries of the grid sign matrices on pairs with exactly known parameters (positives and
training control pairs) and recomputes the sign. Character values and seeds are taken from the object definitions;
everything else (kernel series, omega from the Gauss sum, twists, derivatives by mp.diff, functionals) is recomputed.
usage: ref_check.py <outdir> <n per family>"""
import json
import math
import os
import sys
import numpy as np
import mpmath as mp
import kern
import jf
import jan
import jobj

mp.mp.dps = 40
out, NPER = sys.argv[1], int(sys.argv[2])
ob = json.load(open(os.path.join(out, 'objects.json')))
names, groups = ob['names'], ob['groups']
CH = {c.name: c for c in jobj.char_objs(3, 40)}
PR = jobj.primes_upto(4000)
LOG = {}


def chi_val(c, n):
    v = complex(c.vals[n % c.q])
    return mp.mpc(0) if abs(v) < 1e-9 else mp.expj(mp.atan2(mp.mpf(v.imag), mp.mpf(v.real)) if False else 2 * mp.pi * mp.mpf(round(math.atan2(v.imag, v.real) / (2 * math.pi) * 5040)) / 5040)


def omega(c):
    """omega^2 = eps = tau(chi)/(i^d sqrt q), Re omega > 0 (sign rule of the lane)."""
    if c.name not in LOG:
        tau = sum(chi_val(c, a) * mp.expj(2 * mp.pi * a / c.q) for a in range(1, c.q))
        eps = tau / ((1j) ** c.d * mp.sqrt(c.q))
        om = mp.sqrt(eps)
        if om.real < 0 or (abs(om.real) < mp.mpf(10) ** -30 and om.imag < 0):
            om = -om
        LOG[c.name] = om
    return LOG[c.name]


def gsum(u, coef, A1, beta):
    """e^(beta u) sum_{n>=1} coef(n) exp(-A1 n^2 e^(2u))"""
    w = A1 * mp.exp(2 * u)
    s = mp.mpc(0)
    n = 1
    while w * n * n < 0.6932 * mp.mp.prec + 40 + w:      # follows the working precision (mp.diff raises it)
        c = coef(n)
        if c != 0:
            s += c * mp.exp(-w * n * n)
        n += 1
    return s * mp.exp(beta * u)


def K_zeta(u):
    return mp.exp(u / 2) * mp.jtheta(3, 0, mp.exp(-mp.pi * mp.exp(2 * u)))


def _S(t):
    return 2 * mp.exp(t / 2) * mp.nsum(lambda n: mp.exp(-mp.pi * n * n * mp.exp(2 * t)), [1, mp.inf]) if False else gsum(t, lambda n: 2, mp.pi, mp.mpf(1) / 2).real


def K3_zeta(u):
    """(D^2 - 1/4) of the lattice sum without its polar term, at |u| (K3 is even): no cancellation at |u|."""
    v = abs(u)
    return mp.diff(_S, v, 2) - _S(v) / 4


def K_chi_tw(c, a, dG, NG):
    d = (dG + c.d) % 2
    return lambda u: mp.conj(omega(c)) * gsum(u, lambda n: 2 * a(n) * chi_val(c, n) * n ** d, mp.pi / (NG * c.q), mp.mpf(1) / 2 + d)


def K_chi(c):
    """K(-u) = conj K(u) (classical functional equation with the Gauss-sum root number): the series is summed at |u|."""
    f = K_chi_tw(c, lambda n: 1, 0, 1)
    return lambda u: f(u) if u >= 0 else mp.conj(f(-u))


def cm(valp):
    cache = {}

    def a(n):
        if n not in cache:
            v = mp.mpc(1)
            m = n
            for p in PR:
                if p * p > m:
                    break
                while m % p == 0:
                    v *= valp(int(p))
                    m //= p
            if m > 1:
                v *= valp(int(m))
            cache[n] = v
        return cache[n]
    return a


def beu_ints(delta, X):
    res = []

    def rec(i0, nu, fac):
        for i in range(i0, len(PR)):
            v = nu * (int(PR[i]) + delta)
            if v > X:
                break
            res.append((v, fac + [int(PR[i])]))
            rec(i, v, fac + [int(PR[i])])
    res.append((mp.mpf(1), []))
    rec(0, mp.mpf(1), [])
    return res


def make_pair(name):
    """-> (KA(u, pol), KB(u)) or None when the pair is outside the check"""
    a, b = name.split('|')
    if a == 'ZETA' or a.startswith('chi'):
        KA = (lambda u, pol: K_zeta(u) if pol else K3_zeta(u)) if a == 'ZETA' else (lambda u, pol, f=K_chi(CH[a]): f(u))
        return KA, K_chi(CH[b])
    g, cn = b.rsplit('x', 1)
    c = CH[cn]
    if a == 'DH':
        c5 = CH['chi5.2c']
        z = lambda n: (mp.conj(omega(c5)) * chi_val(c5, n)).real
        sg = 1 if z(1) > 0 else -1
        ag = lambda n: sg * z(n)
        KA = lambda u, pol: gsum(u, lambda n: 2 * ag(n) * n, mp.pi / 5, mp.mpf(3) / 2).real
        return KA, K_chi_tw(c, ag, 1, 5)
    if a.startswith('TNR'):
        l = mp.log(3)
        cc = mp.mpf('2.2') if False else mp.mpf(2.2)
        f = K_chi(c)
        x = chi_val(c, 3)
        KZ = lambda u, pol: K_zeta(u) if pol else K3_zeta(u)
        return (lambda u, pol: KZ(u + l, pol) + cc * KZ(u, pol) + KZ(u - l, pol)), (lambda u: mp.conj(x) * f(u - l) + cc * f(u) + x * f(u + l))
    if a.startswith('HEAT'):
        tau = mp.mpf(float(a[4:]))
        f = K_chi(c)
        return (lambda u, pol: None if pol else mp.exp(tau * u * u / 4) * K3_zeta(u)), (lambda u: mp.exp(tau * u * u / 4) * f(u))
    if a.startswith('BLS'):
        br, bi = a[3:-1].split('+')
        bb = mp.mpc(float(br), float(bi))
        p2, p0 = -2 * (bb * bb).real, abs(bb) ** 4
        f = K_chi(c)
        P = lambda F, u: mp.diff(F, u, 4) + p2 * mp.diff(F, u, 2) + p0 * F(u)
        S3 = lambda t: mp.diff(_S, t, 2) - _S(t) / 4
        PB = lambda u: P(lambda v: f(v).real, u) + 1j * P(lambda v: f(v).imag, u)
        return (lambda u, pol: P(K_zeta, abs(u)) if pol else P(S3, abs(u))), (lambda u: PB(u) if u >= 0 else mp.conj(PB(-u)))
    if a.startswith('EA'):
        al = mp.mpf(float(a[2:]))
        xis = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
        sig = lambda n: sum(mp.mpf(dd) ** (-2 * al) for dd in range(1, n + 1) if n % dd == 0)

        def KA(u, pol):
            if not pol:
                return None
            y = mp.exp(abs(u))
            s = xis(1 + 2 * al) * y ** (mp.mpf(1) / 2 + al) + xis(2 * al) * y ** (mp.mpf(1) / 2 - al)
            n = 1
            while 2 * mp.pi * n * y < 100:
                s += 4 * mp.sqrt(y) * n ** al * sig(n) * mp.besselk(al, 2 * mp.pi * n * y)
                n += 1
            return s

        def raw(u):
            y = mp.exp(u)
            s = mp.mpc(0)
            n = 1
            while 2 * mp.pi * n * y / c.q < 100:
                x = chi_val(c, n)
                if x != 0:
                    s += 4 * x * n ** (al + c.d) * sig(n) * mp.besselk(al, 2 * mp.pi * n * y / c.q)
                n += 1
            return s * y ** (mp.mpf(1) / 2 + c.d)
        om2 = omega(c) ** 2            # root number of the product is eps(chi)^2; the lane takes Re sqrt > 0 of the measured eps
        o = mp.sqrt(om2)
        if o.real < 0:
            o = -o
        return KA, (lambda u: mp.conj(o) * raw(u) if u >= 0 else mp.conj(mp.conj(o) * raw(-u)))
    if a.startswith('U-'):
        seed = 120000 + int(a[2:])
        up = np.random.Generator(np.random.PCG64(seed)).random(len(PR))
        dd = dict(zip(PR.tolist(), up.tolist()))
        au = cm(lambda p: mp.expj(2 * mp.pi * mp.mpf(dd[p])))
        KA = lambda u, pol: (mp.exp(u / 2) + gsum(u, lambda n: 2 * au(n), mp.pi, mp.mpf(1) / 2)) if pol else None
        return KA, K_chi_tw(c, au, 0, 1)
    if a.startswith('BEU'):
        delta = mp.mpf(float(a[3:]))

        def KA(u, pol):
            if not pol:
                return None
            A = mp.pi * mp.exp(2 * u)
            X = mp.sqrt(110 / A) + 1
            return mp.exp(u / 2) * (1 + sum(2 * mp.exp(-A * v * v) for v, _ in beu_ints(delta, X)))

        def KB(u):
            A = mp.pi * mp.exp(2 * u) / c.q
            X = mp.sqrt(110 / A) + 1
            s = mp.mpc(0)
            for v, fac in beu_ints(delta, X):
                x = mp.mpc(1)
                for p in fac:
                    x *= chi_val(c, p)
                s += 2 * x * v ** c.d * mp.exp(-A * v * v)
            return mp.conj(omega(c)) * s * mp.exp((mp.mpf(1) / 2 + c.d) * u)
        return KA, KB
    return None


def fval(kind, pol, row, KA, KB):
    m, x = int(row['m']), int(row['x'])
    a, b, c = mp.mpf(float(row['a'])), mp.mpf(float(row['b'])), mp.mpf(float(row['c']))
    A = lambda u: KA(u, pol)
    if kind == 'JA':
        cols = jf.COLSETS[m][x // 2]
        M = mp.matrix(m, m)
        for i in range(m):
            for j, n in enumerate(cols):
                u = a + i * b + i * i * c + mp.log(int(n))
                M[i, j] = A(u) if (i + x % 2) % 2 == 0 else KB(u)
        return mp.re(mp.det(M))
    if kind in ('JB1', 'JB2'):
        Mf = lambda u: mp.cos(c) * KB(u) + mp.sin(c) * A(u)
        if kind == 'JB1':
            U = [i * a + i * i * b for i in range(m)]
            H = mp.matrix(m, m)
            for i in range(m):
                H[i, i] = mp.re(Mf(mp.mpf(0)))
                for j in range(i):
                    H[i, j] = Mf(U[i] - U[j])
                    H[j, i] = mp.conj(H[i, j])
            return mp.re(mp.det(H))
        return m * mp.re(Mf(mp.mpf(0))) + sum(2 * (m - d) * mp.re(mp.expj(b * d) * Mf(d * a)) for d in range(1, m))
    if kind == 'JC1':
        s = -1 if x == 1 else 1
        return mp.re(A(a - s * b) * KB(a + s * b) - c * A(a) * KB(a))
    return mp.re(A(a - b) * mp.conj(A(a + b))) * abs(KB(a)) ** 2 - c * abs(A(a)) ** 2 * mp.re(KB(a - b) * mp.conj(KB(a + b)))


ok_cols = [j for j, (n, g) in enumerate(zip(names, groups)) if g in ('P', 'PX') or (g[0] == 'C' and not n.startswith(('THW', 'THIN')))]
res = {}
tot = dict(agree=0, disagree=0, skipped=0)
for fam in jf.FAMS:
    kind, pol = jf.fam_info(fam)
    g, s1, idx2, S = jan.load(out, fam)
    tab = dict(np.load(os.path.join(out, fam + '_params.npz')))
    r = np.random.Generator(np.random.PCG64(149000 + jf.FAMS.index(fam)))
    c = dict(agree=0, disagree=0, skipped=0, bad=[])
    done = 0
    ctl = 0
    while done < NPER:
        i = int(r.integers(0, len(S)))
        # half of the sample from control pairs
        j = int(r.choice([q for q in ok_cols if groups[q][0] == 'C'])) if ctl < NPER // 2 else int(r.choice(ok_cols))
        if S[i, j] == 0:
            continue
        ctl += 1
        pr = make_pair(names[j])
        row = {k: tab[k][idx2[i]] for k in tab}
        try:
            v = fval(kind, pol, row, pr[0], pr[1]) if pr else None
        except TypeError:
            v = None
        done += 1
        if v is None:
            c['skipped'] += 1
            continue
        if (v > 0) == (S[i, j] > 0):
            c['agree'] += 1
        else:
            c['disagree'] += 1
            c['bad'].append((names[j], int(idx2[i]), float(v), int(S[i, j])))
    res[fam] = c
    for k in tot:
        tot[k] += c[k]
    print(fam, c, flush=True)
print('REF-TOTAL', tot)
json.dump(dict(total=tot, families=res), open('ref_check.json', 'w'), indent=1)
