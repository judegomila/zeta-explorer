"""c14 ball stage (python-flint; server). Ball kernels of the twisted members and the DJ functionals.
usage: jball.py validate | jball.py opt <outdir> <fams> | jball.py xcheck <outdir> <fams> <n>"""
import json
import math
import multiprocessing as mp
import os
import sys
import time
import numpy as np
from flint import arb, acb, ctx
import ballk
from ballk import _F, bdet, gauss_series
import kern
import jk
import jf
import jobj
import jan

PRECS = (256, 1024, 4096)
ORDER = [2, 8, 1, 6, 7, 9, 3, 4, 5]


def _c(x):
    return x if isinstance(x, acb) else acb(x)


class BW:
    def __init__(self, o):
        self.b = ballk.wrap(o)

    def val(self, u, pol):
        return self.b.jets(u, 0, pol)[0]


class BLin:
    def __init__(self, o):
        chi, p0, c = o.tnr
        self.b = ballk.BChi(chi)
        self.p0 = p0
        self.c = c

    def val(self, u, pol):
        x = self.b.chi(self.p0)
        l = arb(self.p0).log()
        return (x.conjugate() * _c(self.b.jets(u - l, 0, True)[0]) + _F(self.c) * _c(self.b.jets(u, 0, True)[0])
                + x * _c(self.b.jets(u + l, 0, True)[0]))


class BHeatX:
    def __init__(self, o):
        self.b = ballk.BChi(o.b.o)
        self.tau = o.tau

    def val(self, u, pol):
        return self.b.jets(u, 0, True)[0] * (_F(self.tau) * u * u / 4).exp()


class BBLS:
    def __init__(self, o):
        self.b = ballk.wrap(o.o)
        br, bi = _F(o.b.real), _F(o.b.imag)
        self.p2 = -2 * (br * br - bi * bi)
        self.p0 = (br * br + bi * bi) ** 2

    def val(self, u, pol):
        J = self.b.jets(u, 4, pol)
        return J[4] + self.p2 * J[2] + self.p0 * J[0]


class BGen:
    """general twist: conj(omega_chi) e^((1/2+d)u) sum 2 a(n) chi(n) n^d exp(-pi n^2 e^(2u)/(NG q))"""

    def __init__(self, o):
        t = o.tw
        self.chi = ballk.BChi(t['chi'])
        self.d = t['d']
        self.NG = t['NG']
        src = t['src']
        self.src = src
        self.nmax = None
        if isinstance(src, kern.DHType):
            self.g = ballk.BChi(src.chi)
            self.kind = 'dh'
        else:
            self.kind = 'u' if src.cplx else 'r'
            self.nf = ballk.BNoFE(src)
            self.nmax = len(src.a) - 1
        self._a = {}

    def a(self, n):
        if self.kind == 'r':
            v = int(round(float(self.src.a[n])))
            return None if v == 0 else acb(v)
        if self.kind == 'u':
            return self.nf.coef(n) / 2
        r = n % self.src.chi.q
        key = (ctx.prec, r)
        if key not in self._a:
            x = self.g.chi(r)
            if x is None:
                self._a[key] = None
            else:
                z = self.g.omega_conj() * x
                self._a[key] = acb((z.real if self.src.part == 'Re' else z.imag) * int(self.src.sgn))
        return self._a[key]

    def val(self, u, pol):
        def cf(n):
            x = self.chi.chi(n)
            if x is None:
                return None
            a = self.a(n)
            if a is None:
                return None
            return 2 * a * x * (n ** self.d)
        s = gauss_series(u, cf, arb.pi() / (self.NG * self.chi.q), arb(0.5 + self.d), 0, cplx=True, ncoef_max=self.nmax)[0]
        return self.chi.omega_conj() * s


class BEAX:
    """4 y^(1/2+d) sum chi(n) n^(a+d) sigma_(-2a)(n) K_a(2 pi n y/q) / omega; tail by K_a <= K_(1/2), sigma <= n."""

    def __init__(self, o):
        self.o = o
        self.chi = ballk.BChi(o.chi)
        self.a = o.a
        self.d = o.chi.d
        self.q = o.chi.q
        self._om = {}
        self._cf = {}

    def cf(self, n):
        key = (ctx.prec, n)
        if key not in self._cf:
            x = self.chi.chi(n)
            if x is None:
                self._cf[key] = None
            else:
                a = _F(self.a)
                sig = arb(0)
                for dd in range(1, n + 1):
                    if n % dd == 0:
                        sig += (-2 * a * arb(dd).log()).exp()
                self._cf[key] = 4 * x * ((a + self.d) * arb(n).log()).exp() * sig
        return self._cf[key]

    def raw(self, u):
        y = u.exp()
        x1 = 2 * arb.pi() * y / self.q
        need = ctx.prec * math.log(2) + 60
        N = int(need / float(x1.mid())) + 2
        a = acb(_F(self.a))
        tot = acb(0)
        for n in range(1, N + 1):
            c = self.cf(n)
            if c is None:
                continue
            tot += c * acb(x1 * n).bessel_k(a)
        # tail n > N: |term| <= 4 n^(2.5) sqrt(pi/(2 x1 n)) e^(-x1 n); ratio of consecutive bounds <= (1+1/N)^2.5 e^(-x1)
        n1 = N + 1
        first = 4 * arb(n1) ** 2.5 * (arb.pi() / (2 * x1 * n1)).sqrt() * (-x1 * n1).exp()
        ratio = (1 + arb(1) / N) ** 2.5 * (-x1).exp()
        assert ratio < 1
        T = first / (1 - ratio)
        r = float(abs(T).upper())
        return (tot + acb(arb(0, r), arb(0, r))) * ((arb(0.5) + self.d) * u).exp()

    def omega_conj(self):
        p = ctx.prec
        if p not in self._om:
            u0 = arb(0.2)
            eps = self.raw(-u0) / self.raw(u0).conjugate()
            om = eps.sqrt()
            if abs(complex(om) - complex(self.o.omega)) > 1e-6:
                om = -om
            assert abs(complex(om) - complex(self.o.omega)) < 1e-6
            self._om[p] = om.conjugate()
        return self._om[p]

    def val(self, u, pol):
        neg = bool(u < 0)
        v = self.omega_conj() * self.raw(-u if neg else u)
        return v.conjugate() if neg else v


def _beu_sum(delta, A, d, chi, X):
    """sum over generalised integers nu <= X of 2 chi_B(nu) nu^d exp(-A nu^2) (chi None: no character), balls."""
    dl = _F(delta)
    pr = [int(p) for p in jobj.primes_upto(int(X) + 2)]
    tot = [acb(0)]

    def term(nu, x):
        t = 2 * (-A * nu * nu).exp()
        if d:
            t = t * nu
        tot[0] += (x * t) if x is not None else t

    def rec(start, nu, x):
        for i in range(start, len(pr)):
            p = pr[i]
            v = nu * (p + dl)
            if v > X:
                break
            if not (v < X):
                raise RuntimeError('boundary')
            xx = None
            if chi is not None:
                c = chi.chi(p)
                if c is None:
                    continue
                xx = x * c
            term(v, xx)
            rec(i, v, xx)
    term(arb(1), acb(1) if chi is not None else None)
    rec(0, arb(1), acb(1) if chi is not None else None)
    return tot[0]


def _beu_X(A, d):
    """cut X with A X^2 >= prec ln 2 + 60 and the tail bound (2 X^(d+1) + X^(d-1)/A) e^(-A X^2) (the number of generalised
    integers <= x is at most x; the summand decreases beyond X)."""
    need = ctx.prec * math.log(2) + 60
    X = math.sqrt(need / float(A.mid())) + 1.37
    Xb = _F(X)
    T = (2 * Xb ** (d + 1) + Xb ** (d - 1) / A) * (-A * Xb * Xb).exp()
    return X, float(abs(T).upper())


class BBEU:
    def __init__(self, o):
        self.delta = o.delta

    def val(self, u, pol):
        A = arb.pi() * (2 * u).exp()
        X, r = _beu_X(A, 0)
        if pol:
            s = _beu_sum(self.delta, A, 0, None, X).real + arb(0, r)
            return (u / 2).exp() * (1 + s)
        # (D^2 - 1/4) e^(u/2) e^(-w) = e^(u/2) e^(-w) (4 w^2 - 6 w), w = A nu^2
        dl = _F(self.delta)
        pr = [int(p) for p in jobj.primes_upto(int(X) + 2)]
        tot = [arb(0)]

        def term(nu):
            w = A * nu * nu
            tot[0] += 2 * (-w).exp() * (4 * w * w - 6 * w)

        def rec(start, nu):
            for i in range(start, len(pr)):
                v = nu * (pr[i] + dl)
                if v > X:
                    break
                if not (v < X):
                    raise RuntimeError('boundary')
                term(v)
                rec(i, v)
        term(arb(1))
        rec(0, arb(1))
        w = A * _F(X) ** 2
        r3 = float(abs(r * (4 * w * w + 6 * w) * 4).upper())       # crude: polynomial factor at the cut times the tail, doubled twice
        return (u / 2).exp() * (tot[0] + arb(0, r3))


class BBEUX:
    def __init__(self, o):
        self.delta, chi, self.d = o.beu
        self.chi = ballk.BChi(chi)
        self.q = chi.q

    def val(self, u, pol):
        A = arb.pi() * (2 * u).exp() / self.q
        X, r = _beu_X(A, self.d)
        s = _beu_sum(self.delta, A, self.d, self.chi, X) + acb(arb(0, r), arb(0, r))
        return self.chi.omega_conj() * s * ((arb(0.5) + self.d) * u).exp()


class BThwX:
    def __init__(self, o):
        pass

    def val(self, u, pol):
        raise RuntimeError('theta^w twist: no ball evaluation (PREREG amendment B5)')


class BSynth:
    def __init__(self, o):
        self.o = o

    def val(self, u, pol):
        return (-_F(self.o.al) * u * u).exp() * (1 + _F(self.o.c) * u * u)


def bwrap(k):
    if isinstance(k, jk.W):
        return BW(k.o)
    if isinstance(k, jk.Lin):
        return BLin(k)
    if isinstance(k, jk.HeatX):
        return BHeatX(k)
    if isinstance(k, jk.BLS):
        return BBLS(k)
    if isinstance(k, jk.EAX):
        return BEAX(k)
    if isinstance(k, jk.BEU):
        return BBEU(k)
    if isinstance(k, jk.Synth):
        return BSynth(k)
    if isinstance(k, jk.GS):
        if hasattr(k, 'tw'):
            return BGen(k)
        if hasattr(k, 'beu'):
            return BBEUX(k)
        if hasattr(k, 'thw'):
            return BThwX(k)
    raise TypeError(type(k))


_BW = {}


def bk(k):
    if id(k) not in _BW:
        _BW[id(k)] = bwrap(k)
    return _BW[id(k)]


def value(kind, pol, row, A, B):
    """ball value of one functional on one pair; A, B ball kernels (val(u, pol))."""
    m = int(row['m'])
    x = int(row['x'])
    a, b, c = _F(float(row['a'])), _F(float(row['b'])), _F(float(row['c']))
    KA = lambda u: A.val(u, pol)
    KB = lambda u: B.val(u, True)
    if kind == 'JA':
        cols = jf.COLSETS[m][x // 2]
        alt = x % 2
        M = []
        for i in range(m):
            f = KA if (i + alt) % 2 == 0 else KB
            M.append([_c(f(a + i * b + (i * i) * c + arb(int(n)).log())) for n in cols])
        return bdet(M).real
    if kind in ('JB1', 'JB2'):
        ct, st = c.cos(), c.sin()
        Mf = lambda u: ct * _c(KB(u)) + st * _c(KA(u))
        if kind == 'JB1':
            U = [i * a + (i * i) * b for i in range(m)]
            M0 = acb(Mf(arb(0)).real)
            H = [[None] * m for _ in range(m)]
            for i in range(m):
                H[i][i] = M0
                for j in range(i):
                    v = Mf(U[i] - U[j])
                    H[i][j] = v
                    H[j][i] = v.conjugate()
            return bdet(H).real
        Q = m * Mf(arb(0)).real
        for d in range(1, m):
            Q = Q + 2 * (m - d) * (acb.exp_pi_i(acb(b * d) / arb.pi()) * Mf(d * a)).real
        return Q
    if kind == 'JC1':
        s = -1 if x == 1 else 1
        return (_c(KA(a - s * b)) * _c(KB(a + s * b)) - c * _c(KA(a)) * _c(KB(a))).real
    a1, a2, a3 = _c(KA(a - b)), _c(KA(a)), _c(KA(a + b))
    b1, b2, b3 = _c(KB(a - b)), _c(KB(a)), _c(KB(a + b))
    n2 = lambda z: z.real * z.real + z.imag * z.imag
    return (a1 * a3.conjugate()).real * n2(b2) - c * n2(a2) * (b1 * b3.conjugate()).real


def bsign(kind, pol, row, pair, precs=PRECS):
    """-> (sign, precision, error text or None); sign 0 = ball contains 0 at the last precision or no evaluation."""
    err = None
    for pr in precs:
        ctx.prec = pr
        try:
            v = value(kind, pol, row, bk(pair.A), bk(pair.B))
        except (ValueError, ZeroDivisionError, RuntimeError, AssertionError) as e:
            err = repr(e)[:80]
            if 'no ball evaluation' in err:
                break
            continue
        if v > 0:
            return 1, pr, None
        if v < 0:
            return -1, pr, None
        err = None
    return 0, precs[-1], err


PAIRS = None
G = None
D = None


def _init():
    global PAIRS, G, D
    PAIRS = jobj.build({})
    G = np.array([p.group for p in PAIRS])
    D = jan.gidx(G)


def opt_row(args):
    """resolve one optimistic row. -> dict"""
    fam, row, srow, mask, gi = args
    kind, pol = jf.fam_info(fam)
    srow = srow.copy()
    res = dict(i=int(gi), nball=0)
    pos = np.concatenate((D['P'], D['PX']))
    best = None
    for bit, s in ((1, 1), (2, -1)):
        if not (mask & bit):
            continue
        st = dict(s=s, pos='ok', fail=[], unresolved=[])
        # positives left undecided by float64
        for j in pos[srow[pos] == 0]:
            sg, pr, err = bsign(kind, pol, row, PAIRS[j])
            res['nball'] += 1
            srow[j] = sg if sg else 2          # 2 = ball-undecided
            if sg == -s:
                st['pos'] = 'opposite'
                break
            if sg == 0:
                st['pos'] = 'undecided'
                break
        if (srow[pos] == -s).any():
            st['pos'] = 'opposite'
        if st['pos'] == 'ok' and (srow[pos] == 2).any():
            st['pos'] = 'undecided'
        if st['pos'] == 'ok':
            for k in ORDER:
                C = D['C%d' % k]
                if (srow[C] == -s).any():
                    continue
                hit = False
                for j in C[srow[C] == 0]:
                    sg, pr, err = bsign(kind, pol, row, PAIRS[j])
                    res['nball'] += 1
                    srow[j] = sg if sg else 2
                    if sg == 0:
                        st['unresolved'].append(int(k))
                    if sg == -s:
                        hit = True
                        break
                if not hit:
                    st['fail'].append(int(k))
        res['s%+d' % s] = st
        alive_all = st['pos'] == 'ok' and not st['fail']
        alive_fe = st['pos'] == 'ok' and not [k for k in st['fail'] if k in jan.FE_CLASSES]
        if alive_all or alive_fe:
            best = (s, alive_all, alive_fe)
    if best is not None:
        # complete every object in balls where float64 is undecided, then the registered criterion is read by the caller
        for j in np.nonzero(srow == 0)[0]:
            sg, pr, err = bsign(kind, pol, row, PAIRS[j])
            res['nball'] += 1
            srow[j] = sg if sg else 2
        res['alive'] = dict(s=best[0], all=bool(best[1]), fe=bool(best[2]))
        res['row'] = [int(v) for v in srow]
    return res


def run_opt(out, fams):
    nw = int(os.environ.get('RH_WORKERS', '4'))
    _init()
    pool = mp.get_context('fork').Pool(nw)
    for fam in fams:
        t0 = time.time()
        g, s1, idx2, S = jan.load(out, fam)
        tab = dict(np.load(os.path.join(out, fam + '_params.npz')))
        masks = {}
        for tier in ('all', 'FE'):
            o = np.load(os.path.join(out, '%s_opt_PA_%s.npy' % (fam, tier)))
            for i, mk in zip(o[0], o[1]):
                masks[int(i)] = masks.get(int(i), 0) | int(mk)
        rows = sorted(masks)
        cap = int(os.environ.get('C14_OPT_CAP', '200000'))
        skipped = max(0, len(rows) - cap)
        rows = rows[:cap]
        pos2 = np.searchsorted(idx2, rows)
        jobs = [(fam, {k: tab[k][i] for k in tab}, S[p], masks[i], i) for i, p in zip(rows, pos2)]
        res = pool.map(opt_row, jobs, chunksize=max(1, len(jobs) // (nw * 20) + 1)) if jobs else []
        summ = dict(family=fam, optimistic_rows=len(rows) + skipped, not_processed=skipped, ball_evaluations=int(sum(r['nball'] for r in res)),
                    pos_opposite=0, pos_undecided=0, killed_by_class={}, killed_fe_by_class={}, unresolved_class_entries=0,
                    alive_all=[], alive_fe=[], full_survivors=[], full_survivors_fe=[])
        d = jan.gidx(g)
        for r in res:
            sts = [r[k] for k in ('s+1', 's-1') if k in r]
            if all(st['pos'] == 'opposite' for st in sts):
                summ['pos_opposite'] += 1
            elif all(st['pos'] != 'ok' for st in sts):
                summ['pos_undecided'] += 1
            for st in sts:
                if st['pos'] == 'ok':
                    if st['fail']:
                        k = st['fail'][0]
                        summ['killed_by_class'][k] = summ['killed_by_class'].get(k, 0) + 1
                    fe = [k for k in st['fail'] if k in jan.FE_CLASSES]
                    if fe:
                        summ['killed_fe_by_class'][fe[0]] = summ['killed_fe_by_class'].get(fe[0], 0) + 1
                    summ['unresolved_class_entries'] += len(st['unresolved'])
            if 'alive' in r:
                row = np.array(r['row'], dtype=np.int8)[None, :]
                row[row == 2] = 0
                for tier, classes, key in (('all', jan.ALLC, 'alive_all'), ('fe', jan.FE_CLASSES, 'alive_fe')):
                    if r['alive'][tier]:
                        R = jan.criterion(row, d, 'PA', 'strict', classes)
                        summ[key].append(dict(i=r['i'], s=r['alive']['s'], ttrain=bool(R['ttrain'][0]), tweak=bool(R['tweak'][0]), full=bool(R['full'][0]),
                                              heldout=[int(v) for v in R['hf'][0]], ph_same=int(R['ph_same'][0]),
                                              undecided_after_balls=int((np.array(r['row']) == 2).sum())))
                        if R['full'][0]:
                            summ['full_survivors' if tier == 'all' else 'full_survivors_fe'].append(r['i'])
        summ['seconds'] = time.time() - t0
        json.dump(summ, open(os.path.join(out, fam + '_ball.json'), 'w'), indent=1)
        print('%s: optimistic %d (not processed %d), ball evaluations %d, positives opposite %d / undecided %d, killed by class %s, FE tier killed %s, alive all %d FE %d, full survivors %d / FE %d, %.0fs'
              % (fam, summ['optimistic_rows'], skipped, summ['ball_evaluations'], summ['pos_opposite'], summ['pos_undecided'], summ['killed_by_class'],
                 summ['killed_fe_by_class'], len(summ['alive_all']), len(summ['alive_fe']), len(summ['full_survivors']), len(summ['full_survivors_fe']),
                 summ['seconds']), flush=True)
    pool.close()


def xc_job(args):
    fam, row, j, sf = args
    kind, pol = jf.fam_info(fam)
    sg, pr, err = bsign(kind, pol, row, PAIRS[j], precs=(256, 1024))
    return sf, sg, PAIRS[j].group, err


def run_xcheck(out, fams, n):
    nw = int(os.environ.get('RH_WORKERS', '4'))
    _init()
    pool = mp.get_context('fork').Pool(nw)
    tot = dict(agree=0, disagree=0, ball_undecided=0, no_ball=0)
    for fam in fams:
        g, s1, idx2, S = jan.load(out, fam)
        tab = dict(np.load(os.path.join(out, fam + '_params.npz')))
        r = np.random.Generator(np.random.PCG64(146000 + jf.FAMS.index('-'.join(fam.split('-')[:2]))))
        jobs = []
        tries = 0
        while len(jobs) < n and tries < 50 * n:
            tries += 1
            i = int(r.integers(0, len(S)))
            j = int(r.integers(0, S.shape[1]))
            if S[i, j] != 0:
                jobs.append((fam, {k: tab[k][idx2[i]] for k in tab}, j, int(S[i, j])))
        res = pool.map(xc_job, jobs, chunksize=4)
        c = dict(agree=0, disagree=0, ball_undecided=0, no_ball=0)
        bad = []
        for sf, sg, grp, err in res:
            if err and 'no ball' in err:
                c['no_ball'] += 1
            elif sg == 0:
                c['ball_undecided'] += 1
            elif sg == sf:
                c['agree'] += 1
            else:
                c['disagree'] += 1
                bad.append(grp)
        for k in c:
            tot[k] += c[k]
        json.dump(dict(c, disagree_groups=bad), open(os.path.join(out, fam + '_xcheck.json'), 'w'))
        print(fam, 'xcheck', c, bad, flush=True)
    print('XCHECK-TOTAL', tot, flush=True)
    pool.close()


def run_validate():
    """float64 kernels of the new twisted types against balls at 30 random window points; largest relative error."""
    P = jobj.build({})
    r = np.random.Generator(np.random.PCG64(148000))
    seen = {}
    for p in P:
        if p.group[0] in 'CH' and p.group != 'PH':
            for side, k in (('A', p.A), ('B', p.B)):
                key = (p.group[1:], side, type(k).__name__ + ('' if not isinstance(k, jk.GS) else ('-tw' if hasattr(k, 'tw') else '-beu' if hasattr(k, 'beu') else '-thw' if hasattr(k, 'thw') else '')))
                seen.setdefault(key, []).append(k)
    out = {}
    for key, ks in sorted(seen.items()):
        worst = 0.0
        nb = 0
        err = None
        t0 = time.time()
        for k in ks[:3]:
            u = r.uniform(-2.6, 2.6, 10)
            for pol in (True, False):
                K, N = k.val(u, pol)
                for x, kv in zip(u, K):
                    ctx.prec = 256
                    try:
                        bv = bk(k).val(_F(float(x)), pol)
                    except Exception as e:
                        err = repr(e)[:80]
                        break
                    z = complex(bv)
                    rad = float(abs(_c(bv) - acb(z)).upper())
                    den = abs(z)
                    if den > 0:
                        worst = max(worst, (abs(complex(kv) - z)) / den)
                        nb += 1
                        if rad > 1e-20 * den:
                            err = 'wide ball %.1e' % (rad / den)
        out['%s-%s-%s' % key] = dict(points=nb, max_rel_err=worst, note=err, seconds=time.time() - t0)
        print(key, nb, '%.2e' % worst, err, '%.0fs' % (time.time() - t0), flush=True)
    json.dump(out, open('validate.json', 'w'), indent=1)


if __name__ == '__main__':
    if sys.argv[1] == 'validate':
        run_validate()
    elif sys.argv[1] == 'opt':
        run_opt(sys.argv[2], sys.argv[3].split(','))
    elif sys.argv[1] == 'xcheck':
        run_xcheck(sys.argv[2], sys.argv[3].split(','), int(sys.argv[4]))
