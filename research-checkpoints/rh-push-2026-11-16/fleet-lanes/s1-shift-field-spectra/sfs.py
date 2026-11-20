"""s1-shift-field-spectra: shared code for the four screens (values of F at s+a, s-a on vertical lines).

Engines (each returns, for a block of ordinates t, the raw values F and F' on the lines SIG):
  arb : python-flint balls (80 bits), every object, low heights (multiprocess)
  rs  : zeta by the Riemann-Siegel formula with the first correction term, float64, numpy or cupy (screen only)
  per : periodic coefficients mod 5 (L(s, chi_5 real) and Davenport-Heilbronn) by a smoothed direct sum, float64
Statistics: class Acc (tests 1-4).  Output: one json per band.  Nothing here is a verdict on zeros.
"""
import os, sys, json, math, time
import numpy as np

try:
    if os.environ.get('SFS_NOGPU'):
        raise ImportError('gpu disabled')
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('SFS_POOL_GB', '14')) * 1024 ** 3))
    cp.zeros(1)
    GPU = True
except Exception:
    cp = None
    GPU = False

SIG = [0.5, 0.51, 0.55, 0.6, 0.65, 0.7, 0.8, 0.9, 1.0]
NS = len(SIG)
LINE4 = {0.01: 1, 0.05: 2, 0.2: 5}                       # test 4: a -> index of 1/2 + a
T2_PHASE = {0.05: 2, 0.1: 3, 0.2: 5, 0.5: 8}             # test 2, a -> 0: x -> index of 1/2 + x
T2_PAIR = [(0.05, 0.05, 0, 3), (0.1, 0.05, 2, 4), (0.15, 0.05, 3, 5), (0.2, 0.1, 3, 6)]   # (x, a, idx-, idx+)
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
TNR_Q, TNR_C = 3.0, 2.2
HEAT_TAUS = [-0.1, -0.5]
TWO_PI = 2 * math.pi


# ---------------------------------------------------------------- special functions (float64, numpy or cupy)
def lgam(z, xp):
    acc = xp.log(z)
    for k in range(1, 8):
        acc = acc + xp.log(z + k)
    w = z + 8
    return (w - 0.5) * xp.log(w) - w + 0.5 * math.log(TWO_PI) + 1 / (12 * w) - 1 / (360 * w ** 3) + 1 / (1260 * w ** 5) - acc


def digam(z, xp):
    acc = 1 / z
    for k in range(1, 8):
        acc = acc + 1 / (z + k)
    w = z + 8
    w2 = w * w
    return xp.log(w) - 1 / (2 * w) - 1 / (12 * w2) + 1 / (120 * w2 * w2) - 1 / (252 * w2 * w2 * w2) - acc


def gamma_info(kind, s, xp):
    """(log gamma-factor, its logarithmic derivative) of the completed function; s complex array."""
    if kind == 'zeta':          # s(s-1) pi^(-s/2) Gamma(s/2)
        return (xp.log(s) + xp.log(s - 1) - 0.5 * s * math.log(math.pi) + lgam(s / 2, xp),
                1 / s + 1 / (s - 1) - 0.5 * math.log(math.pi) + 0.5 * digam(s / 2, xp))
    if kind == 'even5':         # (5/pi)^(s/2) Gamma(s/2)
        return (0.5 * s * math.log(5 / math.pi) + lgam(s / 2, xp), 0.5 * math.log(5 / math.pi) + 0.5 * digam(s / 2, xp))
    if kind == 'odd5':          # (5/pi)^(s/2) Gamma((s+1)/2)
        return (0.5 * s * math.log(5 / math.pi) + lgam((s + 1) / 2, xp), 0.5 * math.log(5 / math.pi) + 0.5 * digam((s + 1) / 2, xp))
    if kind == 'tnr':
        a, b = gamma_info('zeta', s, xp)
        return a + s * math.log(TNR_Q), b + math.log(TNR_Q)
    if kind.startswith('ea'):
        a = float(kind[2:])
        lg = (xp.log(s + a) + xp.log(s + a - 1) + xp.log(s - a) + xp.log(s - a - 1) - s * math.log(math.pi)
              + lgam((s + a) / 2, xp) + lgam((s - a) / 2, xp))
        gl = (1 / (s + a) + 1 / (s + a - 1) + 1 / (s - a) + 1 / (s - a - 1) - math.log(math.pi)
              + 0.5 * digam((s + a) / 2, xp) + 0.5 * digam((s - a) / 2, xp))
        return lg, gl
    raise KeyError(kind)


# ---------------------------------------------------------------- arithmetic tables
def mobius(n):
    mu = np.ones(n + 1, dtype=np.int64)
    isp = np.ones(n + 1, dtype=bool)
    for p in range(2, n + 1):
        if isp[p]:
            isp[2 * p::p] = False
            mu[p::p] *= -1
            mu[p * p::p * p] = 0
    mu[0] = 0
    return mu


def dirichlet_inverse(a):
    """b with a*b = delta, a[1] = 1, arrays indexed by n (index 0 unused)."""
    n = len(a) - 1
    b = np.zeros(n + 1)
    b[1] = 1.0
    for d in range(1, n + 1):
        if b[d] != 0.0:
            for m in range(2, n // d + 1):
                b[d * m] -= a[m] * b[d]
    return b


def dconv(a, b):
    n = len(a) - 1
    c = np.zeros(n + 1)
    for d in range(1, n + 1):
        if a[d] != 0.0:
            c[d::d][:n // d] += a[d] * b[1:n // d + 1]
    return c


def periodic(vals, n):
    a = np.zeros(n + 1)
    idx = np.arange(1, n + 1)
    a[1:] = np.asarray(vals)[(idx - 1) % 5]
    return a


CHI5 = [1.0, -1.0, -1.0, 1.0, 0.0]
DHC = [1.0, KAPPA, -KAPPA, -1.0, 0.0]


def mollifiers(obj, y):
    """dict name -> coefficient array b(n) P(n) (n <= y, index n), P = 1 - log n / log y."""
    y = max(int(y), 2)
    n = np.arange(y + 1)
    P = np.zeros(y + 1)
    P[1:] = 1 - np.log(n[1:]) / math.log(y)
    mu = mobius(y).astype(float)
    out = {}
    if obj in ('ZETA', 'HEAT-0.1', 'HEAT-0.5'):
        out['mu'] = mu
    elif obj == 'LCHI':
        out['own'] = mu * periodic(CHI5, y)
    elif obj == 'DH':
        out['own'] = dirichlet_inverse(periodic(DHC, y))
        out['muchi'] = mu * periodic(CHI5, y)
    elif obj == 'TNR':
        out['mu'] = mu
        loc = np.zeros(y + 1); loc[1] = 1.0
        k = 1
        while TNR_Q ** k <= y:
            loc[int(TNR_Q ** k)] = (TNR_C if k == 1 else 0.0) * math.sqrt(TNR_Q) + (TNR_Q if k == 2 else 0.0)
            k += 1
        out['own'] = dconv(mu, dirichlet_inverse(loc))
    elif obj.startswith('EA'):
        a = {'EA18': 0.125, 'EA14': 0.25}[obj]
        m1 = mu.copy(); m1[1:] *= n[1:] ** (-a)
        m2 = mu.copy(); m2[1:] *= n[1:] ** (a)
        out['own'] = dconv(m1, m2)
        out['mu'] = mu
    elif obj == 'LIOU':
        out['own'] = mu * mu
    return {k: v * P for k, v in out.items()}


# ---------------------------------------------------------------- statistics
class Acc:
    """Streaming statistics of one object on one band [T, T+U]."""

    def __init__(self, name, T, dt, cs, L):
        self.name, self.T, self.dt, self.cs, self.L = name, T, dt, cs, L
        self.n = 0
        self.negW = np.zeros(NS); self.negF = np.zeros(NS)
        self.firstW = [None] * NS; self.firstF = [None] * NS
        self.minW = [float('inf')] * NS; self.minWt = [None] * NS
        self.runs = np.zeros(NS); self.last = np.zeros(NS, dtype=bool)
        self.nser = len(T2_PHASE) + len(T2_PAIR)
        self.cum = np.zeros(self.nser)
        self.ct = []; self.cc = []
        self.mom = {}
        self.tanh2 = np.zeros(len(T2_PAIR))

    def update(self, xp, t, F, ld, cd, cla, V0, F0, psis):
        """t (K,), F raw (K,NS), ld raw log-derivative, cd completed log-derivative, cla completed log-modulus
        (consistent across the columns at fixed t), V0 = Levinson function on the 1/2-line (raw normalisation),
        F0 raw on the 1/2-line, psis dict name -> (K,) mollifier values."""
        K = int(t.shape[0])
        w = cd.real
        negw = w < 0
        negw[:, 0] = False                                   # the 1/2-line itself is excluded
        negf = F.real < 0
        cw = xp.asnumpy(negw.sum(axis=0)) if xp is not np else negw.sum(axis=0)
        cf = xp.asnumpy(negf.sum(axis=0)) if xp is not np else negf.sum(axis=0)
        self.negW += cw; self.negF += cf
        for j in range(1, NS):
            if cw[j] > 0 and self.firstW[j] is None:
                self.firstW[j] = float(t[int(xp.argmax(negw[:, j]))])
            if cf[j] > 0 and self.firstF[j] is None:
                self.firstF[j] = float(t[int(xp.argmax(negf[:, j]))])
            k = int(xp.argmin(w[:, j])); m = float(w[k, j])
            if m < self.minW[j]:
                self.minW[j] = m; self.minWt[j] = float(t[k])
            prev = xp.concatenate([xp.asarray([bool(self.last[j])]), negw[:-1, j]])
            self.runs[j] += float((negw[:, j] & ~prev).sum())
            self.last[j] = bool(negw[-1, j])
        # test 2: cumulative integrals, coarse samples
        cols = [ld[:, i].real for i in T2_PHASE.values()]
        for q, (x, a, im, ip) in enumerate(T2_PAIR):
            th = xp.tanh(cla[:, ip] - cla[:, im])
            cols.append(th / (2 * a))
            self.tanh2[q] += float((1 - th * th).sum())
        g = xp.stack(cols, axis=1)
        c = xp.cumsum(g, axis=0) * self.dt + xp.asarray(self.cum)[None, :]
        idx = np.arange(self.n, self.n + K)
        sel = np.nonzero(idx % self.cs == 0)[0]
        if len(sel):
            csel = c[xp.asarray(sel)]
            self.cc.append(xp.asnumpy(csel) if xp is not np else np.array(csel))
            tt = t[xp.asarray(sel)]
            self.ct.append(xp.asnumpy(tt) if xp is not np else np.array(tt))
        last = c[-1]
        self.cum = xp.asnumpy(last) if xp is not np else np.array(last)
        # test 1
        aF = (F0.real ** 2 + F0.imag ** 2); aV = (V0.real ** 2 + V0.imag ** 2)
        d = self.mom.setdefault('none', [0.0, 0.0, 0.0])
        d[0] += float(aF.sum()); d[1] += float(aV.sum()); d[2] += K
        for kname, ps in psis.items():
            ap = ps.real ** 2 + ps.imag ** 2
            d = self.mom.setdefault(kname, [0.0, 0.0, 0.0])
            d[0] += float((ap * aF).sum()); d[1] += float((ap * aV).sum()); d[2] += float(ap.sum())
        self.n += K

    def result(self):
        ct = np.concatenate(self.ct) if self.ct else np.zeros(0)
        cc = np.concatenate(self.cc) if self.cc else np.zeros((0, self.nser))
        if self.dt > 0.06:                                    # sparse sampling: means and fractions only
            ct = np.zeros(0); cc = np.zeros((0, self.nser)); self.runs[:] = float('nan')
        return dict(name=self.name, T=self.T, n=self.n, dt=self.dt, L=self.L,
                    negW_frac=(self.negW / max(self.n, 1)).tolist(), negF_frac=(self.negF / max(self.n, 1)).tolist(),
                    firstW=self.firstW, firstF=self.firstF, minW=self.minW, minWt=self.minWt,
                    runs=self.runs.tolist(), height=self.n * self.dt,
                    mom={k: dict(F=v[0] / max(self.n, 1), V=v[1] / max(self.n, 1), psi2=v[2] / max(self.n, 1)) for k, v in self.mom.items()},
                    sech2=(self.tanh2 / max(self.n, 1)).tolist(),
                    windows=window_stats(ct, cc))


def window_stats(ct, cc):
    """variance over window centres t0 of C(t0+h) - C(t0-h), h = sqrt(t0/2 pi), after linear detrending."""
    out = dict(series=['phase x=%g' % x for x in T2_PHASE] + ['B x=%g a=%g' % (x, a) for (x, a, _, _) in T2_PAIR])
    M = len(ct)
    if M < 40:
        out['var'] = None
        return out
    delta = (ct[-1] - ct[0]) / (M - 1)
    h = np.sqrt(ct / TWO_PI)
    j = np.maximum(1, np.rint(h / delta).astype(int))
    i = np.arange(M)
    ok = (i - j >= 0) & (i + j < M)
    i = i[ok]; j = j[ok]
    if len(i) < 20:
        out['var'] = None
        return out
    J = cc[i + j] - cc[i - j]
    t0 = ct[i]
    z = (t0 - t0.mean()) / max(t0.max() - t0.mean(), 1e-9)
    A = np.stack([np.ones_like(z), z], axis=1)
    coef, *_ = np.linalg.lstsq(A, J, rcond=None)
    res = J - A @ coef
    out['var'] = res.var(axis=0).tolist()
    A3 = np.stack([np.ones_like(z), z, z * z, z ** 3], axis=1)
    coef3, *_ = np.linalg.lstsq(A3, J, rcond=None)
    out['var3'] = (J - A3 @ coef3).var(axis=0).tolist()          # cubic detrending (for the B_a series, whose mean drifts)
    out['ms0'] = (J * J).mean(axis=0).tolist()                    # no detrending (for the zero-mean a -> 0 series)
    uj, cj = np.unique(j, return_counts=True)
    out['hvals'] = [(uj * delta).tolist(), cj.tolist()]
    out['mean'] = J.mean(axis=0).tolist()
    out['h_mid'] = float(np.median(h[i])); out['centres'] = int(len(i))
    out['independent'] = float((t0[-1] - t0[0]) / (2 * np.median(h[i])))
    out['delta'] = float(delta)
    return out


def levinson(F0, dF0, gl0, L):
    """V = F + alpha F'/(1 + alpha gamma'/gamma), alpha = 2/L: |completed D| / |gamma (1 + alpha gamma'/gamma)|."""
    al = 2.0 / L
    if gl0 is None:
        return F0 + dF0 / L
    return F0 + dF0 * al / (1 + al * gl0)


def band_L(kind, T):
    if kind is None:
        kind = 'zeta'
    s = np.array([complex(0.5, T)])
    return float(2 * gamma_info(kind, s, np)[1].real[0])


def feed_std(acc, xp, t, F, dF, kind, psis, interior):
    """object with raw values and a gamma factor (kind) or none."""
    s = xp.asarray(SIG)[None, :] + 1j * t[:, None]
    with np.errstate(all='ignore'):
        ld = dF / F
    if kind is None:
        cd = ld; cla = xp.log(xp.abs(F)); gl0 = None
    else:
        lg, gl = gamma_info(kind, s, xp)
        cd = ld + gl; cla = xp.log(xp.abs(F)) + lg.real; gl0 = gl[:, 0]
    V0 = levinson(F[:, 0], dF[:, 0], gl0, acc.L)
    sl = interior
    acc.update(xp, t[sl], F[sl], ld[sl], cd[sl], cla[sl], V0[sl], F[sl, 0], {k: v[sl] for k, v in psis.items()})


def feed_heat(acc, xp, t, Fz, dFz, tau, psis, interior, dt):
    """backward heat deformation: F_tau(sigma + it) = E xi(sigma + i(t + Y)), Y ~ N(0, |tau|/2), on every line."""
    s = xp.asarray(SIG)[None, :] + 1j * t[:, None]
    lg, gl = gamma_info('zeta', s, xp)
    c0 = float(lg.real[0, 0] + math.pi * float(t[0]) / 4)
    X = Fz * xp.exp(lg + (math.pi / 4) * t[:, None] - c0)             # xi e^(pi t/4 - c0)
    X1 = X * (dFz / Fz + gl) if True else None                        # xi' e^(...)
    K = int(t.shape[0])
    v = abs(tau) / 2
    m = int(math.ceil(6 * math.sqrt(v) / dt))
    yk = xp.arange(-m, m + 1) * dt
    ker = dt / math.sqrt(TWO_PI * v) * xp.exp(-yk * yk / (2 * v) - (math.pi / 4) * yk)
    kf = xp.zeros(K); kf[:m + 1] = ker[m:]; kf[K - m:] = ker[:m]
    # F_tau(t_k) = sum_j ker_j X(t_k + y_j): correlation -> conj trick on the kernel spectrum
    KF = xp.conj(xp.fft.fft(kf))[:, None]
    Y = xp.fft.ifft(xp.fft.fft(X, axis=0) * KF, axis=0)
    Y1 = xp.fft.ifft(xp.fft.fft(X1, axis=0) * KF, axis=0)
    cd = Y1 / Y
    cla = xp.log(xp.abs(Y))
    raw = Y / xp.exp(lg + (math.pi / 4) * t[:, None] - c0)           # F_tau / gamma-factor of xi
    ld = cd - gl
    al = 2.0 / acc.L
    V0 = raw[:, 0] * (1 + al * cd[:, 0]) / (1 + al * gl[:, 0])
    sl = interior
    acc.update(xp, t[sl], raw[sl], ld[sl], cd[sl], cla[sl], V0[sl], raw[sl, 0], {k: v_[sl] for k, v_ in psis.items()})


def tnr_from_zeta(xp, t, F, dF):
    s = xp.asarray(SIG)[None, :] + 1j * t[:, None]
    lq = math.log(TNR_Q)
    z1 = xp.exp((0.5 - s) * lq); z2 = z1 * z1
    m = 1 + TNR_C * z1 + z2
    dm = -lq * (TNR_C * z1 + 2 * z2)
    return F * m, dF * m + F * dm


def psi_values(xp, t, coefs, phase0=None, logn=None):
    """mollifier values sum b(n) n^(-1/2 - it); coefs dict name -> array indexed by n."""
    out = {}
    if not coefs:
        return out
    y = max(len(c) for c in coefs.values()) - 1
    n = np.arange(1, y + 1)
    ln = xp.asarray(np.log(n))
    ph = t[:, None] * ln[None, :]
    E = xp.cos(ph) - 1j * xp.sin(ph)
    for k, c in coefs.items():
        out[k] = E @ xp.asarray(c[1:] / np.sqrt(n))
    return out


# ---------------------------------------------------------------- engine: arb
def _arb_chunk(args):
    ts, want = args
    from flint import acb, arb, acb_series, ctx
    ctx.prec = 80
    K = len(ts)
    res = {o: np.zeros((2, K, NS), dtype=complex) for o in want}
    l5 = arb(5).log()
    fifth = [arb(k) / 5 for k in range(1, 5)]

    def cz(y):
        return complex(y[0]), complex(y[1])
    for i, t in enumerate(ts):
        for j, sg in enumerate(SIG):
            x = acb_series([acb(sg, t), 1], prec=2)
            z = None
            if 'ZETA' in want or 'LIOU' in want:
                z = x.zeta()
                if 'ZETA' in want:
                    res['ZETA'][0, i, j], res['ZETA'][1, i, j] = cz(z)
            if 'LIOU' in want:
                x2 = acb_series([acb(2 * sg, 2 * t), 2], prec=2)
                y = x2.zeta() / z
                res['LIOU'][0, i, j], res['LIOU'][1, i, j] = cz(y)
            if 'LCHI' in want or 'DH' in want:
                hz = [x.zeta(a) for a in fifth]
                pw = (-x * l5).exp()
                if 'LCHI' in want:
                    y = (hz[0] - hz[1] - hz[2] + hz[3]) * pw
                    res['LCHI'][0, i, j], res['LCHI'][1, i, j] = cz(y)
                if 'DH' in want:
                    y = (hz[0] + KAPPA * hz[1] - KAPPA * hz[2] - hz[3]) * pw
                    res['DH'][0, i, j], res['DH'][1, i, j] = cz(y)
            for nm, a in (('EA18', 0.125), ('EA14', 0.25)):
                if nm in want:
                    y = (x + a).zeta() * (x - a).zeta()
                    res[nm][0, i, j], res[nm][1, i, j] = cz(y)
    return res


KIND = {'ZETA': 'zeta', 'LCHI': 'even5', 'DH': 'odd5', 'EA18': 'ea0.125', 'EA14': 'ea0.25', 'LIOU': None, 'TNR': 'tnr'}


def run_arb(T, U, dt, out, want):
    from multiprocessing import Pool
    workers = int(os.environ.get('RH_WORKERS', '4'))
    pad = int(math.ceil(6 * 0.5 / dt)) + 2
    K = int(round(U / dt))
    t = T + dt * (np.arange(-pad, K + pad))
    assert t[0] > 0.5
    print('arb band T=%g U=%g dt=%g points=%d (pad %d) objects=%s; planned arrays %.2f GB' % (
        T, U, dt, len(t), pad, want, len(want) * 2 * len(t) * NS * 16 / 1e9), flush=True)
    chunks = [(list(map(float, c)), want) for c in np.array_split(t, max(workers * 8, len(t) // 2000 + 1))]
    t0 = time.time()
    with Pool(workers) as pool:
        parts = pool.map(_arb_chunk, chunks, chunksize=1)
    print('arb values done %.1f s' % (time.time() - t0), flush=True)
    vals = {o: (np.concatenate([p[o][0] for p in parts]), np.concatenate([p[o][1] for p in parts])) for o in want}
    interior = slice(pad, pad + K)
    cs = max(1, int(round(min(0.1, math.sqrt(T / TWO_PI) / 16) / dt)))
    y = max(2, int(math.sqrt(T / TWO_PI) * math.sqrt(TWO_PI)))          # y = T^(1/2)
    results = {}
    objs = list(want)
    if 'ZETA' in want:
        objs += ['TNR', 'HEAT-0.1', 'HEAT-0.5']
    for o in objs:
        if o.startswith('HEAT'):
            L = band_L('zeta', T)
        else:
            L = band_L(KIND[o], T)
        acc = Acc(o, T, dt, cs, L)
        psis = psi_values(np, t, mollifiers(o, y))
        if o.startswith('HEAT'):
            F, dF = vals['ZETA']
            feed_heat(acc, np, t, F, dF, float(o[4:]), psis, interior, dt)
        elif o == 'TNR':
            F, dF = tnr_from_zeta(np, t, *vals['ZETA'])
            feed_std(acc, np, t, F, dF, 'tnr', psis, interior)
        else:
            F, dF = vals[o]
            feed_std(acc, np, t, F, dF, KIND[o], psis, interior)
        results[o] = acc.result(); results[o]['y'] = y
    json.dump(dict(engine='arb', T=T, U=U, dt=dt, results=results), open(out, 'w'))
    print('wrote', out, flush=True)


# ---------------------------------------------------------------- engine: Riemann-Siegel (zeta), float64
class ZetaRS:
    """zeta and zeta' on the lines SIG for t = T0 + u, 0 <= u <= span (span/T0 <= 0.05)."""

    def __init__(self, T0, span, xp, order=18):
        from flint import acb, arb, acb_series, ctx
        ctx.prec = 200
        self.T0, self.xp = T0, xp
        assert span / T0 <= 0.0501
        self.nmax = int(math.sqrt((T0 + span) / TWO_PI)) + 1
        n = np.arange(1, self.nmax + 1)
        T0a = arb(T0)                                         # exact double
        two_pi = 2 * arb.pi()
        ph = np.zeros(self.nmax)
        for k in range(2, self.nmax + 1):
            v = T0a * arb(k).log()
            ph[k - 1] = float(v - two_pi * (v / two_pi).floor())
        self.phi = xp.asarray(ph)
        self.logn = xp.asarray(np.log(n))
        ln = np.log(n)
        cols = []
        for sg in SIG:
            cols += [n ** (-sg), ln * n ** (-sg), n ** (sg - 1), ln * n ** (sg - 1)]
        self.W = xp.asarray(np.stack(cols, axis=1))           # (nmax, 4 NS) real
        self.Wnp = np.stack(cols, axis=1)
        # log chi(sigma + i T0 + w) Taylor coefficients in w
        self.cf = []
        lpi = arb.pi().log()
        for sg in SIG:
            x = acb_series([acb(arb(sg), T0a), 1], prec=order)
            lc = (x - arb(1) / 2) * lpi + ((1 - x) / 2).lgamma() - (x / 2).lgamma()
            co = []
            for k in range(order):
                c = lc[k]
                if k == 0:
                    im = c.imag - two_pi * (c.imag / two_pi).floor()
                    co.append(complex(float(c.real), float(im)))
                else:
                    co.append(complex(float(c.real), float(c.imag)))
            self.cf.append(co)
        ctx.prec = 53
        self.extra = {}

    def add_columns(self, name, coef):
        """extra real weight columns (mollifiers): coef indexed by n, applied with n^(-1/2)."""
        v = np.zeros(self.nmax)
        m = min(self.nmax, len(coef) - 1)
        v[:m] = coef[1:m + 1] / np.sqrt(np.arange(1, m + 1))
        self.extra[name] = v
        self.Wx = self.xp.asarray(np.stack(list(self.extra.values()), axis=1))

    def block(self, u):
        xp = self.xp
        t = self.T0 + u
        a = xp.sqrt(t / TWO_PI)
        N = xp.floor(a)
        Nlo = int(N.min()); Nhi = int(N.max())
        P = self.phi[None, :Nlo] + u[:, None] * self.logn[None, :Nlo]
        C = xp.cos(P)
        S = xp.sin(P, out=P)
        del P
        R = (C @ self.W[:Nlo]) - 1j * (S @ self.W[:Nlo])       # sum n^-it w_n
        psis = {}
        if self.extra:
            Rx = (C @ self.Wx[:Nlo]) - 1j * (S @ self.Wx[:Nlo])
            for k, nm in enumerate(self.extra):
                psis[nm] = Rx[:, k]
        del C, S
        for n in range(Nlo + 1, Nhi + 1):                      # terms present only for part of the block
            mask = (N >= n)
            e = xp.exp(-1j * (self.phi[n - 1] + u * self.logn[n - 1])) * mask
            R = R + e[:, None] * self.W[n - 1][None, :]
        F = xp.zeros((u.shape[0], NS), dtype=complex); dF = xp.zeros_like(F)
        w = 1j * u
        p = a - N
        c2 = xp.cos(TWO_PI * p)
        c2 = xp.where(xp.abs(c2) < 1e-9, 1e-9, c2)
        Psi = xp.cos(TWO_PI * (p * p - p - 1.0 / 16)) / c2
        lt = xp.log(t / TWO_PI)
        phase = xp.exp(-1j * (0.5 * t * lt - 0.5 * t - math.pi / 8))
        sign = 1 - 2 * ((N - 1) % 2)
        for j, sg in enumerate(SIG):
            co = self.cf[j]
            lc = xp.zeros_like(w) + co[-1]
            dlc = xp.zeros_like(w)
            for k in range(len(co) - 2, -1, -1):
                dlc = dlc * w + lc
                lc = lc * w + co[k]
            chi = xp.exp(lc)
            A = R[:, 4 * j]; A1 = R[:, 4 * j + 1]; B = xp.conj(R[:, 4 * j + 2]); B1 = xp.conj(R[:, 4 * j + 3])
            rem = sign * xp.exp(-0.5 * sg * lt) * phase * Psi
            F[:, j] = A + chi * B + rem
            dF[:, j] = -A1 + chi * (dlc * B + B1) - 0.5 * lt * rem
        return t, F, dF, psis


def run_rs(T, U, dt, out, objs):
    xp = cp if GPU else np
    budget = float(os.environ.get('SFS_ELEMS', '1.2e8' if GPU else '2e7'))
    L = band_L('zeta', T)
    y = int(math.sqrt(T / TWO_PI))                              # mollifier length (T/2pi)^(1/2) (= RS length)
    h = math.sqrt(T / TWO_PI)
    cs = max(1, int(round(min(0.1, h / 32) / dt))) if T < 1e4 else max(1, int(round(h / 32 / dt)))
    pad = int(math.ceil(6 * 0.5 / dt)) + 2 if any(o.startswith('HEAT') for o in objs) else 0
    K = int(round(U / dt))
    accs = {o: Acc(o, T, dt, cs, band_L('tnr', T) if o == 'TNR' else L) for o in objs}
    seg = 0.04 * T
    done = 0
    t0 = time.time()
    nb = 0
    print('rs band T=%g U=%g dt=%g points=%d gpu=%s objs=%s y=%d' % (T, U, dt, K, GPU, objs, y), flush=True)
    while done < K:
        segK = min(K - done, int(seg / dt))
        T0 = T + done * dt - pad * dt
        eng = ZetaRS(T0, (segK + 2 * pad) * dt + 1.0, xp)
        mcoef = {}
        for o in objs:
            for k, c in mollifiers(o, y).items():
                mcoef[o + ':' + k] = c
        for k, c in mcoef.items():
            eng.add_columns(k, c)
        bk = max(64, int(budget / eng.nmax))
        if nb == 0:
            print('planned: block %d points x %d terms, 3 real matrices = %.2f GB' % (bk + 2 * pad, eng.nmax, 3 * (bk + 2 * pad) * eng.nmax * 8 / 1e9), flush=True)
        i = 0
        while i < segK:
            kb = min(bk, segK - i)
            u = (xp.arange(i, i + kb + 2 * pad)) * dt          # relative to T0 (already shifted by pad)
            t, F, dF, psis = eng.block(u)
            interior = slice(pad, pad + kb)
            for o in objs:
                ps = {k.split(':')[1]: v for k, v in psis.items() if k.startswith(o + ':')}
                if o == 'ZETA':
                    feed_std(accs[o], xp, t, F, dF, 'zeta', ps, interior)
                elif o == 'TNR':
                    F2, dF2 = tnr_from_zeta(xp, t, F, dF)
                    feed_std(accs[o], xp, t, F2, dF2, 'tnr', ps, interior)
                else:
                    feed_heat(accs[o], xp, t, F, dF, float(o[4:]), ps, interior, dt)
            i += kb; nb += 1
            if nb % 200 == 1:
                print('block %d, %d/%d points, %.0f s' % (nb, done + i, K, time.time() - t0), flush=True)
        done += segK
    res = {o: a.result() for o, a in accs.items()}
    for o in res:
        res[o]['y'] = y
    json.dump(dict(engine='rs', gpu=GPU, T=T, U=U, dt=dt, seconds=time.time() - t0, results=res), open(out, 'w'))
    print('wrote', out, '%.0f s' % (time.time() - t0), flush=True)


# ---------------------------------------------------------------- engine: periodic coefficients mod 5 (smoothed direct sum)
def per_block(xp, t, tmax, cache):
    """L(s, chi_5) and DH with derivatives on SIG at the ordinates t (all <= tmax)."""
    key = tmax
    if cache.get('key') != key:
        from math import erfc
        base = 5 * max(tmax, 300.0) / TWO_PI
        M = int(2.6 * base) + 1
        n = np.arange(1, M + 1)
        from scipy.special import erfc as serfc
        wt = 0.5 * serfc((n - 2.0 * base) / (0.2 * base))
        ln = np.log(n)
        cols = []
        for vals in (CHI5, DHC):
            a = np.asarray(vals)[(n - 1) % 5] * wt
            for sg in SIG:
                cols += [a * n ** (-sg), -a * ln * n ** (-sg)]
        cache.update(key=key, W=xp.asarray(np.stack(cols, axis=1)), ln=xp.asarray(ln), M=M)
    W, ln, M = cache['W'], cache['ln'], cache['M']
    P = t[:, None] * ln[None, :]
    R = xp.cos(P) @ W
    R = R - 1j * (xp.sin(P, out=P) @ W)
    del P
    out = {}
    for q, nm in enumerate(('LCHI', 'DH')):
        blk = R[:, q * 2 * NS:(q + 1) * 2 * NS]
        out[nm] = (blk[:, 0::2], blk[:, 1::2])
    return out


def run_per(T, U, dt, out):
    xp = cp if GPU else np
    budget = float(os.environ.get('SFS_ELEMS', '1.2e8' if GPU else '2e7'))
    K = int(round(U / dt))
    y = max(2, int(math.sqrt(T)))
    h = math.sqrt(T / TWO_PI)
    cs = max(1, int(round(min(0.1, h / 16) / dt))) if T < 1e4 else max(1, int(round(h / 32 / dt)))
    accs = {'LCHI': Acc('LCHI', T, dt, cs, band_L('even5', T)), 'DH': Acc('DH', T, dt, cs, band_L('odd5', T))}
    mc = {o: mollifiers(o, y) for o in accs}
    cache = {}
    t0 = time.time(); i = 0; nb = 0
    print('per band T=%g U=%g dt=%g points=%d gpu=%s y=%d' % (T, U, dt, K, GPU, y), flush=True)
    while i < K:
        tcur = T + i * dt
        kseg = int(math.floor(math.log(tcur / T) / math.log(1.02) + 1e-9))
        tend = T * 1.02 ** (kseg + 1)
        tmax = tend + 20
        M = int(2.6 * 5 * max(tmax, 300.0) / TWO_PI) + 1
        kb = max(1, min(K - i, int(budget / M) + 1, int(math.ceil((tend - tcur) / dt))))
        if nb == 0:
            print('planned: block %d points x %d terms, 3 real matrices = %.2f GB' % (kb, M, 3 * kb * M * 8 / 1e9), flush=True)
        t = T + dt * xp.arange(i, i + kb)
        vals = per_block(xp, t, tmax, cache)
        for o, kind in (('LCHI', 'even5'), ('DH', 'odd5')):
            F, dF = vals[o]
            feed_std(accs[o], xp, t, F, dF, kind, psi_values(xp, t, mc[o]), slice(0, kb))
        i += kb; nb += 1
        if nb % 200 == 1:
            print('block %d, %d/%d points, %.0f s' % (nb, i, K, time.time() - t0), flush=True)
    res = {o: a.result() for o, a in accs.items()}
    for o in res:
        res[o]['y'] = y
    json.dump(dict(engine='per', gpu=GPU, T=T, U=U, dt=dt, seconds=time.time() - t0, results=res), open(out, 'w'))
    print('wrote', out, '%.0f s' % (time.time() - t0), flush=True)


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'arb':
        T, U, dt = map(float, sys.argv[2:5])
        want = sys.argv[6].split(',') if len(sys.argv) > 6 else ['ZETA', 'LCHI', 'DH', 'EA18', 'EA14', 'LIOU']
        run_arb(T, U, dt, sys.argv[5], want)
    elif mode == 'rs':
        T, U, dt = map(float, sys.argv[2:5])
        objs = sys.argv[6].split(',') if len(sys.argv) > 6 else ['ZETA', 'TNR', 'HEAT-0.1', 'HEAT-0.5']
        run_rs(T, U, dt, sys.argv[5], objs)
    elif mode == 'per':
        T, U, dt = map(float, sys.argv[2:5])
        run_per(T, U, dt, sys.argv[5])
