"""Combination 1, prime-side data: Taylor data at s = 1/2 + a from truncated Euler products / Dirichlet series.
  python trunc.py a n prec outdir [maxexp=7] [workers]
Objects (log-derivative = exact gamma-factor part + truncated arithmetic part):
  ZETA-EUL   xi factor s(s-1)pi^(-s/2)Gamma(s/2), Euler product over p <= P
  LCHI4-EUL  (4/pi)^(s/2) Gamma((s+1)/2), chi_-4, Euler product
  SGN-EUL    completely multiplicative eps(p) = +-1 (numpy PCG64 seed 121000, 1 - 2*integers(0,2), one draw per prime), pi^(-s/2)Gamma(s/2)
  U-EUL      completely multiplicative chi(p) = e(u_p), u_p uniform (seed 120000), pi^(-s/2)Gamma(s/2); complex Hermitian Toeplitz
  ZETA-DIR   xi factor, sum_{n<=X} n^-s
  DH-DIR     (5/pi)^(s/2) Gamma((s+1)/2) 5^... Dirichlet series sum_{n<=X} a(n) n^-s, a = (1, kappa, -kappa, -1, 0) mod 5
Checkpoints P, X = 10^2..10^maxexp. Output: for each object and checkpoint the first Levinson index with E_n <= 0."""
import sys, json, math, time, os
import numpy as np
from multiprocessing import Pool
from flint import arb, acb, ctx, arb_series, acb_series
import core

a_str = sys.argv[1]; n = int(sys.argv[2]); prec = int(sys.argv[3]); outdir = sys.argv[4]
maxexp = int(sys.argv[5]) if len(sys.argv) > 5 else 7
W = int(sys.argv[6]) if len(sys.argv) > 6 else int(os.environ.get('RH_WORKERS', '4'))
dmaxexp = int(sys.argv[7]) if len(sys.argv) > 7 else maxexp
DIG = int(prec * 0.30103) + 10


def S(x): return x.str(DIG, radius=False)


def primes_upto(N):
    s = np.ones(N + 1, dtype=bool); s[:2] = False
    for i in range(2, int(N ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]


def euler_chunk(args):
    lo, hi, plist, sg, up = args
    ctx.prec = prec; ctx.cap = n + 2
    s0 = arb(1) / 2 + arb(a_str)
    t = arb_series([0, 1], prec=n)
    tot = {k: arb_series([0], prec=n) for k in ('ZETA-EUL', 'LCHI4-EUL', 'SGN-EUL')}
    totU = acb_series([0], prec=n)
    for p, e, u in zip(plist, sg, up):
        lp = arb(int(p)).log()
        ser = (t * (-lp)).exp() * (-s0 * lp).exp()            # p^-(s0+t)
        tot['ZETA-EUL'] = tot['ZETA-EUL'] - lp * ser / (1 - ser)
        c4 = 0 if p == 2 else (1 if p % 4 == 1 else -1)
        if c4: tot['LCHI4-EUL'] = tot['LCHI4-EUL'] - lp * (c4 * ser) / (1 - c4 * ser)
        tot['SGN-EUL'] = tot['SGN-EUL'] - lp * (int(e) * ser) / (1 - int(e) * ser)
        chi = (acb(0, 2) * arb.pi() * arb(float(u))).exp()
        cs = acb_series(list(ser.coeffs()), prec=n) * chi
        totU = totU - lp * cs / (1 - cs)
    out = {k: [S(x) for x in v.coeffs()] for k, v in tot.items()}
    out['U-EUL'] = [[S(x.real), S(x.imag)] for x in totU.coeffs()]
    return lo, hi, out


def dir_chunk(args):
    lo, hi = args
    ctx.prec = prec; ctx.cap = n + 2
    s0 = arb(1) / 2 + arb(a_str)
    kap = core.kappa(); cf = (arb(0), arb(1), kap, -kap, arb(-1))
    z = [arb(0)] * n; d = [arb(0)] * n
    thr = arb(2) ** (-prec - 40)
    for m in range(lo, hi):
        lm = -arb(m).log()
        e = (s0 * lm).exp()
        r = m % 5
        for k in range(n):
            z[k] += e
            if r: d[k] += cf[r] * e
            e = e * lm / (k + 1)
            if k > 8 and abs(e) < thr: break
    return lo, hi, {'ZETA-DIR': [S(x) for x in z], 'DH-DIR': [S(x) for x in d]}


def gam_logder(kind):
    ctx.cap = n + 4
    s = arb_series([arb(1) / 2 + arb(a_str), 1], prec=n + 1)
    if kind == 'xi': G = s * (s - 1) * core.gam0(s)
    elif kind == 'gam0': G = core.gam0(s)
    elif kind == 'chi4': G = core._powc(arb(4) / arb.pi(), s / 2) * ((s + 1) / 2).gamma()
    elif kind == 'dh': G = core._powc(arb(5) / arb.pi(), s / 2) * ((s + 1) / 2).gamma()
    g = list(G.coeffs())
    return arb_series(g, prec=n + 1).derivative() / arb_series(g[:n], prec=n)


def lev_complex(c):
    """Levinson for the Hermitian Toeplitz [c_{i-j}], c_{-k} = conj c_k, c_0 real. Returns first n with E_n <= 0 or None."""
    cm = lambda x: acb(x.real.mid(), x.imag.mid())
    N = len(c); a = [acb(1)]; E = c[0].real.mid()
    for m in range(1, N):
        acc = acb(0)
        for j in range(m): acc += a[j] * c[m - j]
        k = cm(-acc / E)
        a = [acb(1)] + [cm(a[j] + k * a[m - j].conjugate()) for j in range(1, m)] + [k]
        E = (E * (1 - (k * k.conjugate()).real)).mid()
        if not (E > 0): return m, core._l2(E)
    return None, core._l2(E)


if __name__ == '__main__':
    ctx.prec = prec; ctx.cap = n + 4
    os.makedirs(outdir, exist_ok=True)
    a = arb(a_str)
    cps = [10 ** e for e in range(2, maxexp + 1)]
    P = primes_upto(cps[-1])
    rng_s = np.random.Generator(np.random.PCG64(121000)); sg = 1 - 2 * rng_s.integers(0, 2, size=len(P))
    rng_u = np.random.Generator(np.random.PCG64(120000)); up = rng_u.random(len(P))
    # chunks aligned with checkpoints
    jobs = []; djobs = []
    prev_i = 0; prev_x = 1
    for cp in cps:
        i = int(np.searchsorted(P, cp, side='right'))
        step = max(1, (i - prev_i + 4 * W - 1) // (4 * W))
        for lo in range(prev_i, i, step):
            hi = min(i, lo + step); jobs.append((lo, hi, P[lo:hi], sg[lo:hi], up[lo:hi]))
        if cp <= 10 ** dmaxexp:
            dstep = max(1, (cp + 1 - prev_x + 4 * W - 1) // (4 * W))
            for lo in range(prev_x, cp + 1, dstep): djobs.append((lo, min(cp + 1, lo + dstep)))
        prev_i = i; prev_x = cp + 1
    t0 = time.time()
    with Pool(W) as pool:
        eres = pool.map(euler_chunk, jobs, chunksize=1)
        print('euler chunks done', round(time.time() - t0, 1), flush=True)
        dres = pool.map(dir_chunk, djobs, chunksize=1)
        print('dirichlet chunks done', round(time.time() - t0, 1), flush=True)
    res = {}
    zs = arb_series([0], prec=n)
    def lev_real(L, tag):
        c = core.moments_from_L(L, a, n)
        json.dump(dict(c=[S(x) for x in c]), open(os.path.join(outdir, 'mom_%s.json' % tag), 'w'))
        r = core.levinson(c)
        m, k, E = r[-1]
        return (m if not (E > 0) else None), core._l2(E)
    # Euler objects
    acc = {k: arb_series([0], prec=n) for k in ('ZETA-EUL', 'LCHI4-EUL', 'SGN-EUL')}; accU = acb_series([0], prec=n)
    gl = {'ZETA-EUL': gam_logder('xi'), 'LCHI4-EUL': gam_logder('chi4'), 'SGN-EUL': gam_logder('gam0')}
    glU = gam_logder('gam0')
    eres.sort(key=lambda r: r[0]); j = 0
    for cp in cps:
        i = int(np.searchsorted(P, cp, side='right'))
        while j < len(eres) and eres[j][1] <= i:
            o = eres[j][2]
            for k in acc: acc[k] = acc[k] + arb_series([arb(x) for x in o[k]], prec=n)
            accU = accU + acb_series([acb(arb(x), arb(y)) for x, y in o['U-EUL']], prec=n)
            j += 1
        for k in acc:
            res['%s:%d' % (k, cp)] = lev_real(gl[k] + acc[k], '%s_%d' % (k, cp))
            print(k, cp, res['%s:%d' % (k, cp)], flush=True)
        res['SGNX-EUL:%d' % cp] = lev_real(gl['ZETA-EUL'] + acc['SGN-EUL'], 'SGNX-EUL_%d' % cp); print('SGNX-EUL (xi factor)', cp, res['SGNX-EUL:%d' % cp], flush=True)
        # complex object: moments by the same binomial sum with acb
        l = list((acb_series(list(glU.coeffs()), prec=n) + accU).coeffs()); l += [acb(0)] * (n - len(l))
        from flint import fmpz
        u = [l[q] * (2 * a) ** q for q in range(n)]
        c = [acb((4 * a * l[0]).real)]; row = [fmpz(1)]
        for k in range(1, n):
            s_ = acb(0)
            for q in range(k): s_ += u[q + 1] * row[q]
            c.append(2 * a * s_)
            nr = [fmpz(1)] * (k + 1)
            for q in range(1, k): nr[q] = row[q - 1] + row[q]
            row = nr
        res['U-EUL:%d' % cp] = lev_complex(c); print('U-EUL', cp, res['U-EUL:%d' % cp], flush=True)
    # Dirichlet objects
    dres.sort(key=lambda r: r[0]); j = 0
    az = [arb(0)] * n; ad = [arb(0)] * n
    gz = gam_logder('xi'); gd = gam_logder('dh')
    for cp in [c_ for c_ in cps if c_ <= 10 ** dmaxexp]:
        while j < len(dres) and dres[j][1] <= cp + 1:
            o = dres[j][2]
            az = [x + arb(y) for x, y in zip(az, o['ZETA-DIR'])]; ad = [x + arb(y) for x, y in zip(ad, o['DH-DIR'])]
            j += 1
        for tag, coef, g in (('ZETA-DIR', az, gz), ('DH-DIR', ad, gd)):
            # coefficients of D(s0+t): sum a(m) m^-s0 (-log m)^k/k!  ->  log-derivative, minus log 5 for DH's 5^-s (kept inside gamma part: none needed)
            D = arb_series(coef + [arb(0)], prec=n + 1)
            Dn = arb_series(coef, prec=n)
            Ld = arb_series(list(D.coeffs()), prec=n + 1).derivative() / Dn
            res['%s:%d' % (tag, cp)] = lev_real(g + Ld, '%s_%d' % (tag, cp)); print(tag, cp, res['%s:%d' % (tag, cp)], flush=True)
    # exact rows
    for code in ('ZETA', 'LCHI4', 'DH', 'LIOU', 'LIOUX'):
        c = core.moments(code, a, n)
        r = core.levinson(c); m, k, E = r[-1]
        res['%s:exact' % code] = ((m if not (E > 0) else None), core._l2(E)); print(code, 'exact', res['%s:exact' % code], flush=True)
        if code == 'ZETA':
            res['ZETA:log2E'] = {r_[0]: round(core._l2(r_[2]), 2) for r_ in r}
    json.dump(dict(a=a_str, n=n, prec=prec, checkpoints=cps, results=res, seconds=round(time.time() - t0, 1)), open(os.path.join(outdir, 'trunc_a%s.json' % a_str), 'w'), indent=1)
    print('DONE', round(time.time() - t0, 1))
