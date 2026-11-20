"""fscreen: float64 pre-screen of FE-symmetrised truncations (cupy on one GPU if available, else numpy).

Object (same normalisation as lylib): s = 1/2 + i z,
    F(z) = G(s) D(s) + G(1-s) D(1-s),   D = weighted Dirichlet polynomial (scheme 'afe') or Euler product ('euler').
The screen evaluates F~ = F / exp(Re log G(1/2 + i Re z)) (positive normaliser: same zeros, same phase) and,
for consecutive blocks [x_k, x_k + B] of the real axis, computes by float phase sums
    n_up   = number of zeros with eta < Im z < Y            (winding of the rectangle [x_k,x_k+B] x [eta,Y])
    n_band = number of zeros with |Im z| < eta              (winding of [x_k,x_k+B] x [-eta,eta], by symmetry)
    n_real = sign changes of F on the real grid             (lower bound for real zeros)
A block is 'bad' when n_up > 0 or n_band != n_real, 'suspect' when a phase step exceeded 2 rad or a winding sum
is not within 0.15 of an integer.  NOTHING here is a verdict: float64, no error control.  Survivors and failures
go to cert.py (Arb).
"""
import math, os, sys, time
import numpy as np

try:
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_GPU_GB', '24')) * 1024 ** 3)
    xp.zeros(1)
    GPU = True
except Exception:                                            # noqa
    xp = np
    GPU = False

CHUNK_BYTES = int(float(os.environ.get('RH_CHUNK_GB', '1.0')) * 1024 ** 3)   # per temporary matrix


# ----------------------------------------------------------------------------- coefficients (float64, numpy)
def primes_upto(P):
    sv = np.ones(P + 1, bool)
    sv[:2] = False
    for p in range(2, int(P ** 0.5) + 1):
        if sv[p]:
            sv[p * p::p] = False
    return np.nonzero(sv)[0]


def kappa_dh():
    s5 = math.sqrt(5)
    return (math.sqrt(10 - 2 * s5) - 2) / (s5 - 1)


def coefs(inp, N):
    """a_1..a_N as float64 (index 0 unused = 0)."""
    k = inp.split(':')[0]
    a = np.zeros(N + 1)
    n = np.arange(N + 1)
    if k == 'zeta':
        a[1:] = 1
    elif k == 'dh':
        kp = kappa_dh()
        a = np.array([0, 1, kp, -kp, -1.0])[n % 5]
        a[0] = 0
    elif k in ('tw2m', 'tw2h', 'tw3m'):
        p, e = {'tw2m': (2, -1.0), 'tw2h': (2, 0.5), 'tw3m': (3, -1.0)}[k]
        a[1:] = 1
        q = p
        while q <= N:
            a[q::q] *= e
            q *= p
    elif k == 'liou':
        om = np.zeros(N + 1, int)
        for p in primes_upto(N):
            q = int(p)
            while q <= N:
                om[q::q] += 1
                q *= int(p)
        a = (-1.0) ** om
        a[0] = 0
    elif k == 'ea':
        al = float(inp.split(':')[1])
        for d in range(1, N + 1):
            m = np.arange(d, N + 1, d)
            a[m] += (d * d / m) ** al
    elif k == 'chi4':                                        # extra reference input: L(s, chi_-4) (true L-function)
        a = np.array([0, 1, 0, -1.0])[n % 4]
    else:
        raise ValueError('no Dirichlet coefficients for ' + inp)
    return a


def weights(kind, N):
    n = np.arange(N + 1, dtype=float)
    n[0] = 1
    lg = np.log(n) / math.log(N + 1)
    if kind == 'sharp':
        w = np.ones(N + 1)
    elif kind.startswith('riesz'):                           # (1 - log n / log(N+1))^k
        w = (1 - lg) ** float(kind[5:])
    elif kind.startswith('lin'):                             # Cesaro-type (1 - n/(N+1))^k
        w = (1 - n / (N + 1)) ** float(kind[3:])
    elif kind == 'cos':                                      # cos^2(pi/2 * log n/log(N+1))
        w = np.cos(math.pi / 2 * lg) ** 2
    elif kind.startswith('gaus'):                            # exp(-c (log n/log(N+1))^2) (not vanishing at the cut)
        w = np.exp(-float(kind[4:]) * lg ** 2)
    elif kind == 'selb':                                     # Selberg-type P(x)=1-x for lower half, flat first half
        w = np.minimum(1.0, 2 * (1 - lg))
    else:
        raise ValueError(kind)
    w[0] = 0
    return w


def gtype(inp):
    k = inp.split(':')[0]
    return {'dh': 'd', 'ea': 'ea', 'chi4': 'c4'}.get(k, 'z')


def poles(inp):
    """(location, residue) of the poles of the Dirichlet series of the input (None: not formulable here)."""
    k = inp.split(':')[0]
    if k == 'zeta':
        return [(1.0, 1.0)]
    if k == 'tw2m':
        return [(1.0, 1 / 3)]
    if k == 'tw2h':
        return [(1.0, 2 / 3)]
    if k == 'tw3m':
        return [(1.0, 0.5)]
    if k in ('dh', 'chi4'):
        return []
    if k == 'ea':
        import mpmath
        a = float(inp.split(':')[1])
        return [(1 + a, float(mpmath.zeta(1 + 2 * a))), (1 - a, float(mpmath.zeta(1 - 2 * a)))]
    return None


def ymax(scheme, inp):
    if scheme == 'afep':
        return 0.49 - (float(inp.split(':')[1]) if gtype(inp) == 'ea' else 0.0)
    if scheme == 'euler':
        return 0.45 if gtype(inp) != 'ea' else max(0.02, 0.45 - float(inp.split(':')[1]))
    return {'z': 1.9, 'd': 1.4, 'ea': 1.9, 'c4': 1.4}[gtype(inp)]


# ----------------------------------------------------------------------------- special functions on the device
_L2PI = 0.5 * math.log(2 * math.pi)


def lgam(w):
    """log Gamma(w) modulo 2 pi i (valid inside exp).  Shift by 12 and Stirling with 5 terms."""
    acc = xp.zeros_like(w)
    for k in range(12):
        acc += xp.log(w + k)
    v = w + 12
    v2 = 1 / (v * v)
    ser = (1 / v) * (1 / 12 - v2 * (1 / 360 - v2 * (1 / 1260 - v2 * (1 / 1680 - v2 / 1188))))
    return (v - 0.5) * xp.log(v) - v + _L2PI + ser - acc


def logGz(s):
    return xp.log(s) + xp.log(s - 1) - math.log(2) - (s / 2) * math.log(math.pi) + lgam(s / 2)


def logG(inp, s):
    t = gtype(inp)
    if t == 'z':
        return logGz(s)
    if t == 'd':
        return (s / 2) * math.log(5 / math.pi) + lgam((s + 1) / 2)
    if t == 'c4':
        return (s / 2) * math.log(4 / math.pi) + lgam((s + 1) / 2)
    a = float(inp.split(':')[1])
    return logGz(s + a) + logGz(s - a)


class Obj:
    def __init__(self, scheme, inp, size, weight='sharp'):
        self.scheme, self.inp, self.size, self.weight = scheme, inp, size, weight
        self.corr = []
        if scheme == 'afep':
            # pole-corrected mean: D(s) - sum_poles r k! M^(beta-s) / ((beta-s)^(k+1) log^k M), M = N+1
            if not (weight == 'sharp' or weight.startswith('riesz')):
                raise ValueError('afep needs sharp or riesz weights')
            pl = poles(inp)
            if pl is None:
                raise ValueError('afep not formulable for ' + inp)
            kk = 0.0 if weight == 'sharp' else float(weight[5:])
            self.corr = [(b, r * math.gamma(kk + 1) / math.log(size + 1) ** kk, kk) for b, r in pl]
        if scheme in ('afe', 'afep'):
            c = coefs(inp, size) * weights(weight, size)
            idx = np.nonzero(c)[0]
            self.c = xp.asarray(c[idx].astype(np.complex128))
            self.L = xp.asarray(np.log(idx.astype(float)))
            self.nterm = len(idx)
        elif scheme == 'euler':
            ps = primes_upto(size)
            self.L = xp.asarray(np.log(ps.astype(float)))
            k = inp.split(':')[0]
            e = np.ones(len(ps))
            if k == 'tw2m':
                e[ps == 2] = -1
            elif k == 'tw2h':
                e[ps == 2] = 0.5
            elif k == 'tw3m':
                e[ps == 3] = -1
            elif k == 'liou':
                e[:] = -1
            elif k not in ('zeta', 'ea'):
                raise ValueError('no Euler product for ' + inp)
            self.e = xp.asarray(e)
            self.nterm = len(ps) * (2 if k == 'ea' else 1)
        else:
            raise ValueError(scheme)

    def D(self, s):
        M = s.shape[0]
        out = xp.empty(M, dtype=xp.complex128)
        per = max(1, CHUNK_BYTES // (16 * max(1, self.nterm)))
        for i in range(0, M, per):
            ss = s[i:i + per, None]
            if self.scheme in ('afe', 'afep'):
                out[i:i + per] = xp.exp(-ss * self.L[None, :]) @ self.c
            elif gtype(self.inp) == 'ea':
                a = float(self.inp.split(':')[1])
                lg = xp.log(1 - xp.exp(-(ss - a) * self.L[None, :])) + xp.log(1 - xp.exp(-(ss + a) * self.L[None, :]))
                out[i:i + per] = xp.exp(-lg.sum(axis=1))
            else:
                lg = xp.log(1 - self.e[None, :] * xp.exp(-ss * self.L[None, :]))
                out[i:i + per] = xp.exp(-lg.sum(axis=1))
        lM = math.log(self.size + 1)
        for b, c, kk in self.corr:
            out = out - c * xp.exp((b - s) * lM) / (b - s) ** (kk + 1)
        return out

    def F(self, z):
        """Normalised object at a 1-d complex device array z."""
        s = 0.5 + 1j * z
        nrm = logG(self.inp, 0.5 + 1j * z.real).real
        return xp.exp(logG(self.inp, s) - nrm) * self.D(s) + xp.exp(logG(self.inp, 1 - s) - nrm) * self.D(1 - s)


# ----------------------------------------------------------------------------- block counts
def _dphi(a, b):
    return xp.angle(b * xp.conj(a))


def screen_range(obj, x0, nblk, B=1.0, hx=0.004, eta=0.02, Y=None, nv=96, nvl=12):
    """Counts for nblk consecutive blocks starting at x0.  Returns numpy arrays n_up, n_band, n_real, suspect."""
    Y = Y or ymax(obj.scheme, obj.inp)
    m = int(round(B / hx))
    npt = nblk * m + 1
    planned = (3 * npt + (nblk + 1) * (nv + nvl)) * 16 * 6 / 2 ** 20
    x = x0 + xp.arange(npt, dtype=xp.float64) * (B / m)
    R = obj.F(x.astype(xp.complex128)).real
    E = obj.F(x + 1j * eta)
    Tp = obj.F(x + 1j * Y)
    xb = x[::m]                                              # nblk+1 boundaries
    yl = xp.linspace(0.0, eta, nvl + 1)
    yh = xp.linspace(eta, Y, nv + 1)
    Vl = obj.F((xb[:, None] + 1j * yl[None, :]).ravel()).reshape(nblk + 1, nvl + 1)
    Vh = obj.F((xb[:, None] + 1j * yh[None, :]).ravel()).reshape(nblk + 1, nv + 1)
    dE = _dphi(E[:-1], E[1:]).reshape(nblk, m)
    dT = _dphi(Tp[:-1], Tp[1:]).reshape(nblk, m)
    dVl = _dphi(Vl[:, :-1], Vl[:, 1:])
    dVh = _dphi(Vh[:, :-1], Vh[:, 1:])
    sE, sT, sVl, sVh = dE.sum(1), dT.sum(1), dVl.sum(1), dVh.sum(1)
    up = (sE + sVh[1:] - sT - sVh[:-1]) / (2 * math.pi)
    band = 2 * (sVl[1:] - sE - sVl[:-1]) / (2 * math.pi)
    sg = xp.sign(R)
    chg = (sg[:-1] * sg[1:] < 0).reshape(nblk, m).sum(1)
    big = xp.maximum(xp.abs(dE).max(1), xp.abs(dT).max(1))
    bigv = xp.maximum(xp.abs(dVl).max(1), xp.abs(dVh).max(1))
    big = xp.maximum(big, xp.maximum(bigv[1:], bigv[:-1]))
    upr, bandr = xp.rint(up), xp.rint(band)
    susp = (big > 2.0) | (xp.abs(up - upr) > 0.15) | (xp.abs(band - bandr) > 0.3) | ~xp.isfinite(up) | ~xp.isfinite(band)
    g = (lambda a: xp.asnumpy(a)) if GPU else (lambda a: np.asarray(a))
    return g(upr).astype(int), g(bandr).astype(int), g(chg).astype(int), g(susp), planned


def screen(obj, T0, T1, B=1.0, hx=0.004, eta=0.02, Y=None, blocks_per_call=None, refine=True):
    """Screen [T0, T1].  Returns a summary dict (first bad block, totals, lists)."""
    Y = Y or ymax(obj.scheme, obj.inp)
    nblk_tot = int(math.ceil((T1 - T0) / B))
    m = int(round(B / hx))
    if blocks_per_call is None:
        blocks_per_call = max(1, min(1000, 400000 // m))
    bad, suspects, n_up_tot, n_real_tot, n_band_tot = [], [], 0, 0, 0
    k = 0
    t0 = time.time()
    while k < nblk_tot:
        nb = min(blocks_per_call, nblk_tot - k)
        up, band, real, susp, planned = screen_range(obj, T0 + k * B, nb, B, hx, eta, Y)
        if k == 0 and os.environ.get('RH_VERBOSE'):
            print('[screen] %s %s N=%d w=%s  blocks/call=%d  planned device arrays about %.0f MB + term-matrix temporaries up to %.0f MB'
                  % (obj.scheme, obj.inp, obj.size, obj.weight, nb, planned, 3 * CHUNK_BYTES / 2 ** 20), flush=True)
        flagged = np.nonzero(susp | (up != 0) | (band != real))[0]
        for j in flagged:
            xj = T0 + (k + j) * B
            u, b, r, s = int(up[j]), int(band[j]), int(real[j]), bool(susp[j])
            if refine and (s or b != r):
                u2, b2, r2, s2, _ = screen_range(obj, xj, 1, B, hx / 16, eta, Y, nv=768, nvl=96)
                u, b, r, s = int(u2[0]), int(b2[0]), int(r2[0]), bool(s2[0])
                up[j], band[j], real[j] = u, b, r
            if s:
                suspects.append(round(xj, 6))
            if u != 0 or b != r:
                bad.append([round(xj, 6), u, b, r, int(s)])
        n_up_tot += int(up.sum())
        n_real_tot += int(real.sum())
        n_band_tot += int(band.sum())
        k += nb
    clean_bad = [b for b in bad if not b[4]]
    return dict(T0=T0, T1=T0 + nblk_tot * B, B=B, hx=hx, eta=eta, Y=Y, n_up=n_up_tot, n_band=n_band_tot,
                n_real=n_real_tot, n_bad=len(bad), n_bad_clean=len(clean_bad), n_suspect=len(suspects),
                first_bad=(bad[0] if bad else None), first_bad_clean=(clean_bad[0] if clean_bad else None),
                bad=bad[:40], suspects=suspects[:40], seconds=round(time.time() - t0, 2), gpu=GPU)


if __name__ == '__main__':
    # quick comparison against lylib (run locally): python fscreen.py
    import lylib as L
    from flint import acb, ctx
    ctx.prec = 200
    for sch, inp, N, w in (('afe', 'zeta', 7, 'sharp'), ('afe', 'dh', 12, 'riesz1'), ('afe', 'ea:0.25', 9, 'riesz2'),
                           ('euler', 'liou', 13, 'sharp'), ('euler', 'ea:0.25', 7, 'sharp'), ('afe', 'tw2h', 6, 'sharp')):
        o = Obj(sch, inp, N, w)
        F, _, _ = L.make_object(sch, inp, N, {'weight': w})
        zs = np.array([3.3 + 0.2j, 17.0, 40.1 + 0.4j, 71.7 + 0.02j])
        v = o.F(xp.asarray(zs))
        v = xp.asnumpy(v) if GPU else v
        worst = 0
        for z, val in zip(zs, v):
            ref = complex(F(acb(z.real, z.imag)))
            nrm = math.exp(float(L.Gfac(inp, acb(0.5, z.real)).abs_lower().log()))
            worst = max(worst, abs(val - ref / nrm) / abs(ref / nrm))
        print('fscreen vs lylib', sch, inp, N, w, 'max rel diff %.2e' % worst, 'ok' if worst < 1e-8 else 'MISMATCH')
    o = Obj('afe', 'zeta', 3, 'sharp')
    print(screen(o, 0.5, 30.5))
    o = Obj('afe', 'zeta', 3, 'riesz1')
    print(screen(o, 0.5, 30.5))
