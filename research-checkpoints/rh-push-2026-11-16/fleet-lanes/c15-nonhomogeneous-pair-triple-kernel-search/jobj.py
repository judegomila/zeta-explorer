"""c14: pair objects (PREREG sections 3, 4, 8). build() -> list of Pair; groups 'P' (zeta, chi) training,
'PX' (chi, chi') training, 'PH' held-out positives, 'C<k>' training pairs of class k, 'H<k>' held-out pairs."""
import math
import os
import sys
import numpy as np
import kern
import jk

CLASSES = {1: 'DH', 2: 'T-NR', 3: 'E_a', 4: 'HEAT', 5: 'theta^w', 6: 'U', 7: 'THIN', 8: 'BLS', 9: 'BEU'}
FE_KEPT = {1: False, 2: True, 3: True, 4: True, 5: False, 6: False, 7: False, 8: True, 9: False}   # PREREG section 2 (expected)
NCOEF = 4000
HERE = os.path.dirname(os.path.abspath(__file__))


class Pair:
    def __init__(self, group, A, B, name=None, meta=None):
        self.group = group
        self.A = A
        self.B = B
        self.name = name or ('%s|%s' % (A.name, B.name))
        self.meta = meta or {}


def rng(k):
    return np.random.Generator(np.random.PCG64(140000 + k))


def primes_upto(N):
    s = np.ones(N + 1, dtype=bool)
    s[:2] = False
    for p in range(2, int(N ** 0.5) + 1):
        if s[p]:
            s[p * p::p] = False
    return np.nonzero(s)[0]


PR = primes_upto(NCOEF)


def cm_coeffs(vals_at_primes):
    a = np.zeros(NCOEF + 1, dtype=np.result_type(vals_at_primes, np.float64))
    a[1] = 1
    spf = np.zeros(NCOEF + 1, dtype=np.int64)
    for p in PR[::-1]:
        spf[p::p] = p
    val = dict(zip(PR.tolist(), vals_at_primes.tolist()))
    for n in range(2, NCOEF + 1):
        p = int(spf[n])
        a[n] = a[n // p] * val[p]
    return a


def u_obj(seed, name):
    u = np.random.Generator(np.random.PCG64(seed)).random(len(PR))
    o = kern.NoFE(cm_coeffs(np.exp(2j * np.pi * u)), name)
    o.up = dict(zip(PR.tolist(), u.tolist()))
    return o


_SETS = None


def thin_obj(b, name):
    global _SETS
    if _SETS is None:
        import sets as _SETS          # needs scipy and python-flint (server)
    S, st = _SETS.build(PR.astype(np.int64), repr(b), repr(0.5))
    S = np.asarray(S)
    o = kern.NoFE(cm_coeffs(np.where(np.isin(PR, S), -1.0, 1.0)), name)
    o.S = S
    return o


def char_objs(qlo, qhi):
    out = []
    for q in range(qlo, qhi + 1):
        for m, v, real in kern.primitive_reps(q):
            out.append(kern.Chi(q, v, 'chi%d.%d%s' % (q, m, '' if real else 'c')))
    return out


def build(info=None, skip=()):
    info = {} if info is None else info
    P = []
    Z = jk.W(kern.ZETA)
    tr = char_objs(3, 13)
    assert len(tr) == 23, len(tr)
    trw = [jk.W(c) for c in tr]
    for c in trw:
        P.append(Pair('P', Z, c))
    for i, a in enumerate(trw):
        for j, b in enumerate(trw):
            if i != j:
                P.append(Pair('PX', a, b))
    H = char_objs(14, 40)
    Hw = [jk.W(c) for c in H]
    info['pool_H'] = len(H)
    r = rng(0)
    idx = np.sort(r.choice(len(H), 12, replace=False))
    for i in idx:
        P.append(Pair('PH', Z, Hw[i]))
    idx2 = r.choice(len(H), 24, replace=False)
    for k in range(12):
        P.append(Pair('PH', Hw[idx2[2 * k]], Hw[idx2[2 * k + 1]]))
    by = {c.name: c for c in tr}
    chi8 = [c for c in tr if c.q == 8 and c.d == 0][0]
    tw5 = [by['chi3.2'], by['chi4.3'], by['chi5.2c'], by['chi7.2c'], chi8]
    tw3 = [by['chi3.2'], by['chi5.2c'], chi8]
    info['tw5'] = [c.name for c in tw5]
    fe = {}

    def add(group, A, B, **meta):
        p = Pair(group, A, B, meta=meta)
        P.append(p)
        return p

    # 1 DH
    if 1 not in skip:
        chi5 = kern.Chi(5, by['chi5.2c'].vals, 'chi5.2c')
        dh = kern.DHType(chi5, 'Re', 'DH')
        for psi in tw5:
            if psi.q != 5:
                add('C1', jk.W(dh), jk.dh_twist(dh, psi, 'DHx' + psi.name))
        pool = []
        for c in char_objs(7, 24):
            if not c.real:
                pool.append((c, 'Re'))
                pool.append((c, 'Im'))
        r = rng(1)
        idx = np.sort(r.choice(len(pool), 24, replace=False))
        tr13 = tr
        for i in idx:
            c, part = pool[i]
            g = kern.DHType(c, part, 'DH%s%s' % (c.name, part))
            cand = [x for x in tr13 if math.gcd(x.q, c.q) == 1]
            psi = cand[int(r.integers(0, len(cand)))]
            add('H1', jk.W(g), jk.dh_twist(g, psi, g.name + 'x' + psi.name))
    # 2 T-NR
    if 2 not in skip:
        g = kern.TNR(3, 2.2, 'TNR3_2.2')
        for chi in tw5:
            if chi.q % 3:
                add('C2', jk.W(g), jk.tnr_twist(chi, 3, 2.2, g.name + 'x' + chi.name))
        r = rng(2)
        for j in range(24):
            p0 = int(r.choice([2, 3, 5, 7, 11, 13]))
            t = r.uniform(0.05, 0.95)
            c = 2 + t * (math.sqrt(p0) + 1 / math.sqrt(p0) - 2)
            cand = [x for x in H if x.q % p0]
            chi = cand[int(r.integers(0, len(cand)))]
            g = kern.TNR(p0, c, 'TNR%d_%.5f' % (p0, c))
            add('H2', jk.W(g), jk.tnr_twist(chi, p0, c, g.name + 'x' + chi.name))
    # 3 E_a
    if 3 not in skip:
        for a in (0.125, 0.25):
            g = jk.W(kern.EA(a, 'EA%.3f' % a))
            for chi in tw5:
                add('C3', g, jk.EAX(a, chi, 'EA%.3fx%s' % (a, chi.name)))
        r = rng(3)
        H24 = [x for x in H if x.q <= 24]
        info['pool_H24'] = len(H24)
        for j in range(24):
            a = r.uniform(0.03, 0.47)
            chi = H24[int(r.integers(0, len(H24)))]
            add('H3', jk.W(kern.EA(a, 'EA%.5f' % a)), jk.EAX(a, chi, 'EA%.5fx%s' % (a, chi.name)))
    # 4 HEAT
    if 4 not in skip:
        for tau in (-0.1, -0.5):
            g = jk.W(kern.Heat(tau, 'HEAT%.2f' % tau))
            for chi in tw5:
                add('C4', g, jk.HeatX(chi, tau, 'HEAT%.2fx%s' % (tau, chi.name)))
        r = rng(4)
        for j in range(24):
            tau = -10 ** r.uniform(-1.7, 0.3)
            chi = H[int(r.integers(0, len(H)))]
            add('H4', jk.W(kern.Heat(tau, 'HEAT%.5f' % tau)), jk.HeatX(chi, tau, 'HEAT%.5fx%s' % (tau, chi.name)))
    # 5 theta^w
    if 5 not in skip:
        for w in (0.5, 3.0):
            g = jk.W(kern.ThetaW(w, 'THW%.2f' % w))
            for chi in tw5[:3]:
                add('C5', g, jk.thw_twist(w, chi, 'THW%.2fx%s' % (w, chi.name)))
        r = rng(5)
        c713 = [x for x in tr if x.q >= 7]
        for j in range(24):
            while True:
                w = r.uniform(0.25, 6)
                if min(abs(w - k) for k in (1, 2, 4)) >= 0.05:
                    break
            chi = c713[int(r.integers(0, len(c713)))]
            add('H5', jk.W(kern.ThetaW(w, 'THW%.5f' % w)), jk.thw_twist(w, chi, 'THW%.5fx%s' % (w, chi.name)))
    # 6 U
    if 6 not in skip:
        for j in range(3):
            o = u_obj(120000 + j, 'U-%02d' % j)
            for chi in tw3:
                add('C6', jk.W(o), jk.general_twist(o.a, chi, 0, 1, o.name + 'x' + chi.name, src=o))
        r = rng(6)
        for j in range(24):
            o = u_obj(123000 + j, 'UH-%02d' % j)
            chi = H[int(r.integers(0, len(H)))]
            add('H6', jk.W(o), jk.general_twist(o.a, chi, 0, 1, o.name + 'x' + chi.name, src=o))
    # 7 THIN
    if 7 not in skip:
        for b in (0.9, 0.75):
            o = thin_obj(b, 'THIN-%s' % b)
            if b == 0.9:
                f = os.path.join(HERE, '..', 'c12-control-battery-harness', 'tables', 'set_THIN-0.9.npy')
                if os.path.exists(f):
                    Bt = np.load(f)
                    info['thin_set_matches_battery'] = bool(np.array_equal(Bt[Bt <= NCOEF], o.S))
            for chi in tw3:
                add('C7', jk.W(o), jk.general_twist(o.a, chi, 0, 1, o.name + 'x' + chi.name, src=o))
        r = rng(7)
        for j in range(24):
            b = round(float(r.uniform(0.55, 0.98)), 4)
            o = thin_obj(b, 'THIN-%.4f' % b)
            chi = H[int(r.integers(0, len(H)))]
            add('H7', jk.W(o), jk.general_twist(o.a, chi, 0, 1, o.name + 'x' + chi.name, src=o))
    # 8 BLS
    if 8 not in skip:
        for b in (0.25 + 2j, 0.1 + 5j):
            g = jk.BLS(kern.ZETA, b, 'BLS%.2f+%.2fi' % (b.real, b.imag))
            for chi in tw5:
                add('C8', g, jk.BLS(chi, b, g.name + 'x' + chi.name))
        r = rng(8)
        for j in range(24):
            b = complex(r.uniform(0.05, 0.45), r.uniform(0.5, 8))
            chi = H[int(r.integers(0, len(H)))]
            g = jk.BLS(kern.ZETA, b, 'BLS%.4f+%.4fi' % (b.real, b.imag))
            add('H8', g, jk.BLS(chi, b, g.name + 'x' + chi.name))
    # 9 BEU
    if 9 not in skip:
        pr = primes_upto(600)
        g = jk.BEU(0.5, pr, 'BEU0.5')
        for chi in tw5:
            add('C9', g, jk.beu_twist(0.5, pr, chi, 'BEU0.5x' + chi.name))
        r = rng(9)
        for j in range(24):
            delta = r.uniform(0.1, 0.9)
            chi = H[int(r.integers(0, len(H)))]
            g = jk.BEU(delta, pr, 'BEU%.5f' % delta)
            add('H9', g, jk.beu_twist(delta, pr, chi, 'BEU%.5fx%s' % (delta, chi.name)))
    return P


def build_synth():
    r = np.random.Generator(np.random.PCG64(145000))

    def al():
        return math.exp(r.uniform(math.log(0.3), math.log(3)))
    P = []
    for g, n in (('P', 23), ('PX', 60), ('PH', 24)):
        for _ in range(n):
            a, b = al(), al()
            P.append(Pair(g, jk.Synth(a, 0.0, 'G%.4f' % a), jk.Synth(b, 0.0, 'G%.4f' % b)))
    for k in range(1, 10):
        for g, n in (('C%d' % k, 5), ('H%d' % k, 24)):
            for _ in range(n):
                a, b = al(), al()
                c = b * r.uniform(2.5, 6)
                P.append(Pair(g, jk.Synth(a, 0.0, 'G%.4f' % a), jk.Synth(b, c, 'S%.4f_%.4f' % (b, c))))
    return P


def fe_table(P):
    """Lemma T data: measured functional-equation residual of the twisted member of every control pair."""
    rows = []
    for p in P:
        if p.group[0] in 'CH' and p.group != 'PH':
            rows.append(dict(group=p.group, name=p.name, **jk.fe_residual(p.B)))
    return rows


if __name__ == '__main__':
    import json
    import time
    from collections import Counter
    t = time.time()
    skip = tuple(int(x) for x in sys.argv[1].split(',')) if len(sys.argv) > 1 and sys.argv[1] else ()
    info = {}
    P = build(info, skip)
    print(Counter(p.group for p in P), info, 'build %.1fs' % (time.time() - t))
    rows = fe_table(P)
    for k in range(1, 10):
        rk = [x for x in rows if x['group'] in ('C%d' % k, 'H%d' % k)]
        if rk:
            print(k, CLASSES[k], 'n', len(rk), 'herm residual min/median/max %.2e %.2e %.2e' % (
                min(x['herm'] for x in rk), float(np.median([x['herm'] for x in rk])), max(x['herm'] for x in rk)),
                'bil max %.2e' % max(x['bil'] for x in rk), '| count herm<1e-8:', sum(x['herm'] < 1e-8 for x in rk))
    ea = [p.B.eps_check for p in P if isinstance(p.B, jk.EAX)]
    print('E_a twist: eps two-point consistency max %.2e, | |eps| - 1 | max %.2e' % (max(x[0] for x in ea), max(x[1] for x in ea)))
    info['eax_eps_check'] = [max(x[0] for x in ea), max(x[1] for x in ea)]
    json.dump(dict(info=info, rows=rows), open(os.path.join(HERE, 'fe_table_%s.json' % ('local' if skip else 'full')), 'w'), indent=0)
