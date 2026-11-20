"""c15: pair objects = the c14 pair set with class 2 (T-NR) taken at a split prime (PREREG section 3)."""
import math
import numpy as np
import kern
import jk
import jobj

CLASSES = jobj.CLASSES
FE_CLASSES = [2, 3, 4, 8]
ALLC = list(range(1, 10))


def split_primes(chi, k=3, pmax=5000):
    out = []
    for p in jobj.primes_upto(pmax):
        p = int(p)
        if chi.q % p and abs(chi.vals[p % chi.q] - 1) < 1e-9:
            out.append(p)
            if len(out) == k:
                break
    return out


def tnr_c(p0, t):
    return 2 + t * (math.sqrt(p0) + 1 / math.sqrt(p0) - 2)


def build(info=None, skip=()):
    info = {} if info is None else info
    P = jobj.build(info, tuple(skip) + (2,))
    if 2 in skip:
        return P
    tr = jobj.char_objs(3, 13)
    by = {c.name: c for c in tr}
    chi8 = [c for c in tr if c.q == 8 and c.d == 0][0]
    tw5 = [by['chi3.2'], by['chi4.3'], by['chi5.2c'], by['chi7.2c'], chi8]
    H = jobj.char_objs(14, 40)
    rec = []
    for chi in tw5:
        p0 = split_primes(chi, 1)[0]
        c = tnr_c(p0, 0.5)
        g = kern.TNR(p0, c, 'TNR%d_%.5f' % (p0, c))
        P.append(jobj.Pair('C2', jk.W(g), jk.tnr_twist(chi, p0, c, g.name + 'x' + chi.name)))
        rec.append((chi.name, p0, c))
    r = jobj.rng(2)
    for j in range(24):
        chi = H[int(r.integers(0, len(H)))]
        p0 = split_primes(chi, 3)[int(r.integers(0, 3))]
        c = tnr_c(p0, r.uniform(0.05, 0.95))
        g = kern.TNR(p0, c, 'TNR%d_%.5f' % (p0, c))
        P.append(jobj.Pair('H2', jk.W(g), jk.tnr_twist(chi, p0, c, g.name + 'x' + chi.name)))
        rec.append((chi.name, p0, c))
    info['tnr_split'] = rec
    return P


def gidx(g):
    g = np.asarray(g)
    d = {k: np.nonzero(g == k)[0] for k in ('P', 'PX', 'PH')}
    for k in ALLC:
        d['C%d' % k] = np.nonzero(g == 'C%d' % k)[0]
        d['H%d' % k] = np.nonzero(g == 'H%d' % k)[0]
    return d
