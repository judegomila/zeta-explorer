#!/usr/bin/env python3
"""Pole-lattice census for 1/R_S in Arb ball arithmetic. See PREREG.md."""
import sys, os, json, math, random, time, argparse
from multiprocessing import Pool
from flint import arb, fmpz, ctx

LEX = 1500.0
CUT = 90.0
SMALLP = None

def small_primes(n=5000):
    s = bytearray([1]) * (n + 1); s[0] = s[1] = 0
    for i in range(2, int(n ** .5) + 1):
        if s[i]:
            s[i * i::i] = bytearray(len(s[i * i::i]))
    return [i for i in range(n + 1) if s[i]]

def isprime(n):
    z = fmpz(n)
    if n.bit_length() <= 400:
        return z.is_prime()
    return z.is_probable_prime()

def nearest_prime_log(Lfun, Lf):
    """nearest prime to exp(L); Lfun() recomputes L at the current precision; returns (arb log q, int q)"""
    global SMALLP
    if SMALLP is None:
        SMALLP = small_primes()
    old = ctx.prec
    ctx.prec = int(Lf / math.log(2)) + 200
    try:
        x = Lfun().exp()
        n = x.floor().unique_fmpz()
        assert n is not None
        n = int(n)
        W = int(30 * Lf) + 200
        def scan(start, step):
            # first prime among start, start+step, ... (step = +-1)
            c = start
            for _ in range(W):
                if c >= 2:
                    ok = True
                    if c > 5000:
                        for p in SMALLP:
                            if c % p == 0:
                                ok = False; break
                    if ok and isprime(c):
                        return c
                c += step
            return None
        pu = scan(n + 1, 1)
        pl = scan(n, -1)
        assert pu is not None
        if pl is None:
            q = pu
        else:
            du = arb(pu) - x; dl = x - arb(pl)
            q = pl if bool(dl < du) else pu
            assert bool(dl < du) or bool(du < dl)
        ctx.prec = old
        return arb(q).log(), q
    finally:
        ctx.prec = old

def fval(kind, x):
    """arb f(x) for arb x"""
    if kind == 'S0': return x.exp()
    if kind == 'S1': return (x / 2).exp()
    if kind == 'S2': return x * x * x
    if kind == 'S3': return x * x
    if kind == 'S4': return x * x.sqrt()
    raise ValueError

def fder(kind, k):
    if kind == 'S0': return math.exp(k)
    if kind == 'S1': return 0.5 * math.exp(k / 2)
    if kind == 'S2': return 3.0 * k * k
    if kind == 'S3': return 2.0 * k
    if kind == 'S4': return 1.5 * math.sqrt(k)

def build_set(kind, jmax, rand_seed=None, single=None):
    """returns dict with Ls (arb), fl (float lower envelope f(k)), exact flags, ks"""
    k0 = 0 if kind in ('S0', 'S1') else 1
    Lmax = CUT * 2.0 ** jmax
    rng = random.Random(rand_seed) if rand_seed is not None else None
    Ls, fl, ex, ks, qs = [], [], [], [], []
    seen = set(); dups = []
    k = k0
    while True:
        fk = float(fval(kind, arb(k)).mid())
        if fk > Lmax: break
        if rng is not None:
            u = rng.getrandbits(53)
            Lfun = lambda k=k, u=u: fval(kind, arb(k) + arb(u) / arb(2) ** 53)
        else:
            Lfun = lambda k=k: fval(kind, arb(k))
        La = Lfun()
        Lf = float(La.mid())
        if Lf <= LEX:
            lg, q = nearest_prime_log(Lfun, Lf)
            if q in seen:
                dups.append((k, q)); k += 1; continue
            seen.add(q)
            Ls.append(lg); ex.append(True); qs.append(q)
        else:
            Ls.append(La + arb(0, 0.08 / (Lf * Lf))); ex.append(False); qs.append(None)
        fl.append(fk); ks.append(k)
        k += 1
    if single is not None:
        i = single
        Ls, fl, ex, ks, qs = [Ls[i]], [fl[i]], [ex[i]], [ks[i]], [qs[i]]
        kend = None
    else:
        kend = k
    return dict(kind=kind, Ls=Ls, fl=fl, ex=ex, ks=ks, qs=qs, dups=dups, kend=kend, single=single)

G = {}

def prepare(S, mode, jmin, jmax):
    Ls, fl = S['Ls'], S['fl']
    n = len(Ls)
    js = list(range(jmin, jmax + 1))
    act = []; rtab = []; tails = []
    for j in js:
        d = 2.0 ** (-j)
        if mode in ('half', 'minus'):
            Kj = n
            for i in range(n):
                if d * fl[i] > CUT:
                    Kj = i; break
            dj = arb(2) ** (-j)
            row = []
            for i in range(Kj):
                e = -((-dj * Ls[i]).expm1())      # e = 1 - r, computed without cancellation
                row.append((arb(1) - e, e * e))
            rtab.append(row)
            # tail: primes with index >= Kj (in the set) and beyond the set
            if S['single'] is not None:
                tb = 0.0
            else:
                kk = S['ks'][Kj] if Kj < n else S['kend']
                ff = float(fval(S['kind'], arb(kk)).mid())
                tb = 2.04 * math.exp(-d * ff) * (1.0 + 1.0 / (d * fder(S['kind'], kk)))
            tails.append(tb + 1e-35)
        else:
            Kj = 0; rtab.append([]); tails.append(1e-35)
        act.append(Kj)
    # numerators: primes with fl <= 200 (plus any exact ones), with table of q^(-1/2-delta)
    nnum = 0
    for i in range(n):
        if fl[i] <= 200.0: nnum = i + 1
    ntab = []
    for j in js:
        dj = arb(2) ** (-j)
        rown = []
        for i in range(nnum):
            w = (-(dj + arb(1) / 2) * Ls[i]).exp()
            rown.append((w, (arb(1) - w) ** 2))
        ntab.append(rown)
    xs = [arb(j) * arb(2).log() for j in js]
    def ols(idx):
        xb = sum((xs[i] for i in idx), arb(0)) / len(idx)
        den = sum(((xs[i] - xb) ** 2 for i in idx), arb(0))
        return [(xs[i] - xb) / den for i in idx]
    m = len(js); h = m // 2
    G.update(S=S, mode=mode, js=js, act=act, rtab=rtab, tails=tails, nnum=nnum, ntab=ntab,
             w_all=ols(range(m)), w_lo=ols(range(0, h + 1)), w_hi=ols(range(h, m)), h=h,
             ln2=arb(2).log(), nmaxact=max(act) if act else 0)

SPECS = {}

def nonneg(x):
    """ball for a quantity known to be >= 0: cut the enclosure at 0 (up to rounding of order 2^-prec)"""
    if bool(x > 0):
        return x
    half = x.upper() / 2
    return half + half * arb(0, 1)

def eval_point(key):
    """SPECS[name][i] = (label, t as arb, pole_index or None, zero_all flag, full flag).
    v2: every factor is written as (1 - r)^2 + r * 4 sin^2(th/2) (or 4 cos^2 for the + sign), th = t log q,
    with the trigonometric square cut at 0, so that no enclosure of a positive factor contains 0."""
    label, t, pidx, t0, full = SPECS[key[0]][key[1]]
    S = G['S']; mode = G['mode']; Ls = S['Ls']
    ncos = max(G['nmaxact'], G['nnum'])
    one = arb(1); zero = arb(0); four = arb(4)
    need_c = mode in ('minus', 'thin')
    if t0:
        s2 = [zero] * ncos; co2 = [four] * ncos
    else:
        s2 = []; co2 = []
        for i in range(ncos):
            h = t * Ls[i] / 2
            sn = h.sin()
            s2.append(nonneg(4 * sn * sn))
            if need_c:
                cn = h.cos()
                co2.append(nonneg(4 * cn * cn))
        if pidx is not None and pidx < ncos:
            s2[pidx] = zero
            if need_c: co2[pidx] = four
    ys = []
    for a, j in enumerate(G['js']):
        num = one
        for i, (w, e2) in enumerate(G['ntab'][a]):
            num = num * (e2 + w * s2[i])
        if mode == 'half':
            den = one
            for i, (r, e2) in enumerate(G['rtab'][a]):
                den = den * (e2 + r * s2[i])
            y = (num.log() - den.log()) / 2
        elif mode == 'minus':
            den = one
            for i, (r, e2) in enumerate(G['rtab'][a]):
                den = den * (e2 + r * co2[i])
            y = (num.log() - den.log()) / 2
        elif mode == 'del':
            y = num.log() / 2
        elif mode == 'thin':
            den = one
            for i, (w, e2) in enumerate(G['ntab'][a]):
                den = den * (e2 + w * co2[i])
            y = (num.log() - den.log()) / 2
        y = y + arb(0, G['tails'][a])
        ys.append(y)
    m = len(ys); h = G['h']
    b_all = sum((w * y for w, y in zip(G['w_all'], ys)), arb(0))
    b_lo = sum((w * y for w, y in zip(G['w_lo'], ys[:h + 1])), arb(0))
    b_hi = sum((w * y for w, y in zip(G['w_hi'], ys[h:])), arb(0))
    b_sec = (ys[-1] - ys[0]) / ((m - 1) * G['ln2'])
    mr = lambda x: [float(x.mid()), float(x.rad())]
    out = dict(label=label, t=float(t.mid()), ols=mr(b_all), sec=mr(b_sec), lo=mr(b_lo), hi=mr(b_hi),
               y0=mr(ys[0]), yh=mr(ys[h]), y1=mr(ys[-1]),
               ymax=max(float(y.mid()) for y in ys), ymin=min(float(y.mid()) for y in ys))
    if full:
        out['y'] = [mr(y) for y in ys]
    return out

def hq1_literal(tlist, jmin, jmax, eps=1.0):
    from flint import acb
    res = []
    L3 = arb(3).log()
    for label, t in tlist:
        ys = []
        for j in range(jmin, jmax + 1):
            s = acb(arb(1) / 2 + arb(2) ** (-j), t)
            u = (-(s - acb(arb(1) / 2)) * L3).exp()
            v = 1 + eps * u / (1 - u) ** 2
            ys.append(abs(v).log())
        b = (ys[-1] - ys[0]) / ((jmax - jmin) * arb(2).log())
        res.append(dict(label=label, t=float(t.mid()), sec=[float(b.mid()), float(b.rad())],
                        y0=float(ys[0].mid()), y1=float(ys[-1].mid())))
    return res

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--kind', required=True)
    ap.add_argument('--mode', default='half')
    ap.add_argument('--jmin', type=int, default=4)
    ap.add_argument('--jmax', type=int, default=40)
    ap.add_argument('--prec', type=int, default=192)
    ap.add_argument('--ngen', type=int, default=10000)
    ap.add_argument('--rand', type=int, default=None)
    ap.add_argument('--single', type=int, default=None)
    ap.add_argument('--zeros', default=None)
    ap.add_argument('--poleset', default=None, help='kind whose pole points to use (default: own)')
    ap.add_argument('--out', required=True)
    ap.add_argument('--workers', type=int, default=int(os.environ.get('RH_WORKERS', '1')))
    ap.add_argument('--hq1lit', action='store_true')
    ap.add_argument('--parts', default='abc')
    a = ap.parse_args()
    ctx.prec = a.prec
    t0 = time.time()
    S = build_set(a.kind, a.jmax, rand_seed=a.rand, single=a.single)
    n = len(S['Ls'])
    print('set', a.kind, 'mode', a.mode, 'n primes', n, 'exact', sum(S['ex']), 'dups', S['dups'],
          'build s', round(time.time() - t0, 1), flush=True)
    prepare(S, a.mode, a.jmin, a.jmax)
    tot = sum(G['act']) + len(G['js']) * G['nnum']
    print('planned table entries (arb pairs):', tot, 'approx MB', round(tot * 320 / 1e6, 1),
          'max tail', max(G['tails']), 'prep s', round(time.time() - t0, 1), flush=True)
    # points
    pi2 = 2 * arb.pi()
    if a.poleset and a.poleset != a.kind:
        PS = build_set(a.poleset, 4)  # only small primes needed (L <= 1440)
        own = False
    elif a.single is not None:
        PS = S; own = True
    else:
        PS = S; own = True
    exidx = [i for i in range(len(PS['Ls'])) if PS['ex'][i]]
    pidxs = exidx[:5] + [i for i in exidx[-3:] if i not in exidx[:5]]
    specs_a = [('k0', arb(0), None, True, True)]
    for i in pidxs:
        for k in (1, 2, 3, 5, 8, 13, 21):
            specs_a.append(('p%d(k=%d)_k%d' % (i, PS['ks'][i], k), pi2 * k / PS['Ls'][i], i if own else None, False, True))
    rng = random.Random(20261120)
    specs_b = []
    for i in range(a.ngen):
        m = rng.getrandbits(53)
        specs_b.append(('g%d' % i, arb(m) * 1000 / arb(2) ** 53, None, False, False))
    specs_c = []
    if a.zeros:
        zs = json.load(open(a.zeros))
        for i, z in enumerate(zs):
            specs_c.append(('z%d' % (i + 1), arb(z) + arb(0, 1e-25), None, False, True))
    res = {}
    SPECS.update(a=specs_a, b=specs_b, c=specs_c)
    with Pool(a.workers) as pool:
        for name, specs in (('a', specs_a if 'a' in a.parts else []), ('b', specs_b if 'b' in a.parts else []), ('c', specs_c if 'c' in a.parts else [])):
            t1 = time.time()
            cs = max(1, min(50, len(specs) // (4 * a.workers) + 1))
            res[name] = pool.map(eval_point, [(name, i) for i in range(len(specs))], chunksize=cs) if specs else []
            print('part', name, len(specs), 'points', round(time.time() - t1, 1), 's', flush=True)
    meta = dict(kind=a.kind, mode=a.mode, jmin=a.jmin, jmax=a.jmax, prec=a.prec, n=n, n_exact=sum(S['ex']),
                dups=S['dups'], rand=a.rand, version=2, parts=a.parts, single=a.single, act=G['act'], tails=G['tails'],
                poleset=a.poleset or a.kind,
                first_primes=[str(q) if q is not None and q < 10 ** 40 else None for q in S['qs'][:12]],
                Ls_first=[float(x.mid()) for x in S['Ls'][:12]], ks_first=S['ks'][:12],
                pole_idx=pidxs, seconds=round(time.time() - t0, 1))
    if a.hq1lit:
        tl = [(s[0], s[1]) for s in specs_a] + [(s[0], s[1]) for s in specs_b[:200]]
        res['hq1lit'] = hq1_literal(tl, a.jmin, a.jmax)
    json.dump(dict(meta=meta, res=res), open(a.out, 'w'))
    print('done', a.out, round(time.time() - t0, 1), 's', flush=True)

if __name__ == '__main__':
    main()
