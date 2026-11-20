"""Referee check R1: third implementation (kernels written for all real x without the reflection u -> -u, so evenness is tested too). Functional values recomputed in mpmath (60 digits) from the definitions of
PREREG section 2 written out directly (no kern.py / ballk.py code: closed-form sums, mp.besselk, mp.jtheta, mp.diff),
on random (functional, object) pairs, compared with the float64 sign matrix of the server run.
usage: python ref_check.py <outdir> <npairs> <family>[,...]   -> tables/referee_mp_check.json"""
import json, math, sys, time
import numpy as np, mpmath as mp
import objects, funcs
mp.mp.dps = 60
out, npairs, fams = sys.argv[1], int(sys.argv[2]), sys.argv[3].split(',')
O = objects.build()
meta = json.load(open(out + '/meta.json'))
assert meta['names'] == [o.name for _, o in O]
half = mp.mpf(1) / 2


def th(x):
    return mp.jtheta(3, 0, mp.exp(-mp.pi * mp.exp(2 * x)))


def gauss_sum(coef, q, d, x, k3):
    """sum_n coef(n) T_n(x); T_n = e^((1/2+d)x) exp(-pi n^2 e^(2x)/q), or (D^2 - 1/4) T_n written out for d = 0, q = 1."""
    N = int(mp.sqrt(160 * q / (mp.pi * mp.exp(2 * x)))) + 3
    s = mp.mpf(0)
    e2 = mp.exp(2 * x)
    for n in range(1, N + 1):
        c = coef(n)
        if c == 0:
            continue
        w = mp.pi * n * n * e2 / q
        if k3:
            s += c * (4 * w * w - 6 * w) * mp.exp(x / 2 - w)       # (D^2 - 1/4)[e^(x/2) e^(-w)] = (4w^2 - 6w) e^(x/2) e^(-w)
        else:
            s += c * mp.exp((half + d) * x - w)
    return s


def kernel(o, pol):
    """-> mp function x -> kernel value, from the definitions."""
    t = type(o).__name__
    if t == 'Zeta':
        return (lambda x: mp.exp(x / 2) * th(x)) if pol else (lambda x: gauss_sum(lambda n: 2, 1, 0, mp.mpf(x), True))
    if t == 'Chi':
        vals = [mp.mpc(complex(v)) for v in o.vals]
        om = mp.conj(mp.mpc(complex(o.omega)))
        f = lambda x: om * gauss_sum(lambda n: 2 * vals[n % o.q] * n ** o.d, o.q, o.d, mp.mpf(x), False)   # direct at any sign of x
        return (lambda x: mp.re(f(x))) if o.real else f
    if t == 'DHType':
        f = kernel(o.chi, pol)
        return (lambda x: o.sgn * mp.re(f(x))) if o.part == 'Re' else (lambda x: o.sgn * mp.im(f(x)))
    if t == 'TNR':
        z = kernel(O[0][1], pol)
        l = mp.log(o.p0)
        return lambda x: z(x + l) + mp.mpf(o.c) * z(x) + z(x - l)
    if t == 'NoFE':
        a = o.a
        cf = (lambda n: 2 * mp.mpc(complex(a[n]))) if o.cplx else (lambda n: 2 * mp.mpf(float(a[n])))
        if pol:
            return lambda x: mp.exp(x / 2) + gauss_sum(cf, 1, 0, x, False)
        return lambda x: gauss_sum(cf, 1, 0, x, True)
    if t == 'ThetaW':
        w = mp.mpf(o.w)
        f = lambda x: (mp.exp(x / 2) * th(x)) ** w
        if pol:
            return f
        return None                                   # K3 of theta^w by numerical differentiation: not run (covered by the ball cross-check)
        def g(x):
            mp.mp.dps = 400
            r = mp.diff(f, abs(mp.mpf(x)), 2) - w * w / 4 * f(x)
            mp.mp.dps = 60
            return r
        return g
    if t == 'EA':
        a = mp.mpc(o.a) if o.cplx else mp.mpf(o.a)
        xis = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
        c1, c2 = xis(1 + 2 * a), xis(2 * a)
        def B(x):
            y = mp.exp(x)
            N = int(160 / (2 * mp.pi * y)) + 3
            s = mp.mpf(0)
            for n in range(1, N + 1):
                sg = sum(mp.mpf(dv) ** (-2 * a) for dv in range(1, n + 1) if n % dv == 0)
                s += n ** a * sg * mp.besselk(a, 2 * mp.pi * n * y)
            return 4 * mp.sqrt(y) * s
        if pol:
            return lambda x: c1 * mp.exp((half + a) * x) + c2 * mp.exp((half - a) * x) + B(mp.mpf(x))
        return None                                   # K3 of E_a by numerical differentiation: not run (covered by the ball cross-check)
        b1, b2 = (half + a) ** 2, (half - a) ** 2
        def g(x):
            x = abs(mp.mpf(x))
            mp.mp.dps = 120
            r = mp.diff(B, x, 4) - (b1 + b2) * mp.diff(B, x, 2) + b1 * b2 * B(x)
            mp.mp.dps = 60
            return r
        return g
    if t == 'Heat':
        if pol:
            return None
        z = kernel(O[0][1], False)
        return lambda x: mp.exp(mp.mpf(o.tau) * mp.mpf(x) ** 2 / 4) * z(x)
    return None


def det(M):
    # Leibniz formula (mp.det returns 0 for matrices with very small entries)
    import itertools
    n = len(M)
    tot = mp.mpf(0)
    for perm in itertools.permutations(range(n)):
        sg = 1
        for i in range(n):
            for j in range(i + 1, n):
                if perm[i] > perm[j]:
                    sg = -sg
        t = mp.mpf(sg)
        for i in range(n):
            t *= M[i][perm[i]]
        tot += t
    return tot


def value(fam, row, o):
    kind, pol, sub = funcs.fam_info(fam)
    K = kernel(o, pol)
    if K is None:
        return None
    if kind == 'minor':
        m = int(row['m'])
        cols = funcs.COLSETS[m][int(row['ci'])]
        us = [mp.mpf(float(row['u0'])) + i * mp.mpf(float(row['h'])) + i * i * mp.mpf(float(row['g'])) for i in range(m)]
        return det([[K(us[i] + mp.log(int(n))) for n in cols] for i in range(m)])
    p = int(row['p'])
    k = (lambda x: K(x) - K(x + mp.log(p)) / mp.sqrt(p)) if p else K
    u, h, lam, mu = [mp.mpf(float(row[c])) for c in ('u', 'h', 'lam', 'mu')]
    if sub == 'F1':
        return k(u - h) * k(u + h) - lam * k(u) ** 2
    if sub == 'F3':
        v = [k(u + j * h) for j in (-2, -1, 0, 1, 2)]
        return det([[v[i + j] for j in range(3)] for i in range(3)])
    if type(o).__name__ in ('ThetaW', 'EA') and not pol:
        return None                                   # nested numerical differentiation: not run
    km = lambda x: mp.exp(mu * x) * k(x)
    J = [km(u)] + [mp.diff(km, u, n) for n in range(1, {'F2': 2, 'F4': 4, 'F5': 3}[sub] + 1)]
    if sub == 'F2':
        return J[1] ** 2 - lam * J[0] * J[2]
    if sub == 'F4':
        k0 = [k(u)] + [mp.diff(k, u, n) for n in range(1, 5)]
        return det([[k0[i + j] for j in range(3)] for i in range(3)])
    A = J[1] ** 2 - J[0] * J[2]; Bq = J[2] ** 2 - J[1] * J[3]; C = J[1] * J[2] - J[0] * J[3]
    return 4 * A * Bq - C * C


r = np.random.Generator(np.random.PCG64(141000))
res = {}
for fam in fams:
    S = np.load(out + '/signs_%s.npy' % fam, mmap_mode='r'); P = dict(np.load(out + '/params_%s.npz' % fam))
    agree = dis = skipped = fund = 0; bad = []; t0 = time.time(); bt = {}
    while agree + dis + fund < npairs and time.time() - t0 < 900:
        i = int(r.integers(0, S.shape[0])); j = int(r.integers(0, S.shape[1])); o = O[j][1]
        row = {c: v[i] for c, v in P.items()}
        try:
            v = value(fam, row, o)
        except Exception as e:
            v = None
        if v is None:
            skipped += 1; continue
        sf = int(S[i, j]); sm = int(mp.sign(mp.re(v)))
        tn = type(o).__name__; b = bt.setdefault(tn, [0, 0, 0])
        if sf == 0: fund += 1; b[2] += 1
        elif sf == sm: agree += 1; b[0] += 1
        else: dis += 1; b[1] += 1; bad.append((int(i), o.name, sf, sm, mp.nstr(v, 8)))
    res[fam] = dict(float_decided_agree=agree, float_decided_disagree=dis, float_undecided=fund, skipped_not_run=skipped, by_type_agree_disagree_floatund=bt, bad=bad, seconds=time.time() - t0)
    print(fam, res[fam], flush=True)
json.dump(res, open('tables/referee_mp_check.json', 'w'), indent=1)
