# Runs B and C: zeros of D_P right of the line, Littlewood identity, joint prime-phase statistics.
# float64 with long-double phases; MEASURED (not ball arithmetic). See PREREG.md.
import os, sys, json, math, time
for v in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'): os.environ[v] = '1'
import numpy as np
from multiprocessing import Pool
DELTA = 1.0 / 32; K = 24; HW = 50.0; EXT = 0.3; LEFT = 0.15; GRID = 0.03; XB = 11.5
NPMAX = 1100000
LD = np.longdouble
TWOPI_LD = LD(8) * np.arctan(LD(1))
CLS_ID = {'zeta': 0, 'TNR': 1, 'ZQ': 2, 'EA': 3, 'DH': 4, 'HQ2': 5}
ETA = 0.1

def primes_upto(N):
    s = np.ones(N + 1, dtype=bool); s[:2] = False
    for p in range(2, int(N ** 0.5) + 1):
        if s[p]: s[p * p::p] = False
    return np.nonzero(s)[0]

def P_of(t, th): return int(math.floor((t / (2 * math.pi)) ** th + 1e-9))

def coeffs(cls, P):
    a = np.ones(P + 1); a[0] = 0
    if cls == 'TNR':
        q, c = 3, 2.2
        a[q::q] += c * math.sqrt(q); a[q * q::q * q] += q
    elif cls == 'EA':
        al = 0.1; a[:] = 0
        for d in range(1, int(math.isqrt(P)) + 1):
            e = np.arange(d, P // d + 1, dtype=float)
            r = (e / d) ** al
            v = r + 1 / r; v[0] = 1.0
            a[d * d::d][:len(e)] += v
    elif cls == 'DH':
        k = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
        per = np.array([0, 1, k, -k, -1])
        a = per[np.arange(P + 1) % 5].astype(float); a[0] = 0
    elif cls == 'HQ2':
        j = 2
        while 2 ** j <= P:
            a[2 ** j::2 ** j] += 0.01 * math.comb(j + 1, 3) * 2 ** (j / 2); j += 1
    return a

def additive_theta(P, pr, th):
    """Theta(n) = sum_p v_p(n) th_p for n <= P"""
    T = np.zeros(P + 1)
    r = math.isqrt(P)
    small = pr <= r
    for p, t in zip(pr[small].tolist(), th[small].tolist()):
        if t == 0.0: continue
        pk = p
        while pk <= P:
            T[pk::pk] += t; pk *= p
    big = pr[~small]; tb = th[~small]
    for m in range(1, r + 1):
        k = np.searchsorted(big, P // m, side='right')
        if k == 0: break
        T[m * big[:k]] += tb[:k]
    return T

def moments(tw, P, A):
    u = math.log(P); J = int(round(u / DELTA)) + 1
    M = np.zeros((J, K), dtype=complex)
    twl = LD(tw); CH = 2000000
    for n0 in range(1, P + 1, CH):
        n1 = min(P + 1, n0 + CH)
        ln = np.log(np.arange(n0, n1, dtype=LD))
        ph = np.fmod(twl * ln, TWOPI_LD).astype(float)
        lnf = ln.astype(float)
        c = np.exp(-0.5 * lnf - 1j * ph) * A[n0:n1]
        j = np.rint(lnf / DELTA).astype(np.int64)
        d = (ln - j.astype(LD) * LD(DELTA)).astype(float)
        cr = c.real.copy(); ci = c.imag.copy()
        for k in range(K):
            if k > 0:
                cr *= d / k; ci *= d / k
            M[:, k] += np.bincount(j, weights=cr, minlength=J) + 1j * np.bincount(j, weights=ci, minlength=J)
    return M, np.arange(J) * DELTA

class Fn:
    def __init__(self, M, om, P, zq=None):
        self.M = M; self.om = om; self.Mw = om[:, None] * M; self.u = math.log(P); self.zq = None
        if zq is not None:
            y1, y2 = zq
            z1, z2 = 1j * y1, 1j * y2; zb = 1j * (y1 + y2) / 2; zp, zm = ETA + zb, -ETA + zb
            self.zq = [(z1, (z1 - zp) * (z1 - zm) / (z1 - z2), self.D(np.array([z1]))[0][0]),
                       (z2, (z2 - zp) * (z2 - zm) / (z2 - z1), self.D(np.array([z2]))[0][0])]
    def D(self, z, deriv=False):
        f = np.empty(len(z), dtype=complex); g = np.empty(len(z), dtype=complex) if deriv else None
        B = 3000
        for i in range(0, len(z), B):
            zz = z[i:i + B]
            E = np.exp(-np.outer(zz, self.om))
            G = E @ self.M
            mz = -zz; pw = np.ones(len(zz), dtype=complex); acc = np.zeros(len(zz), dtype=complex)
            if deriv:
                G2 = E @ self.Mw; acc2 = np.zeros(len(zz), dtype=complex); pwm = np.zeros(len(zz), dtype=complex)
            for k in range(K):
                acc += G[:, k] * pw
                if deriv: acc2 += -G2[:, k] * pw - k * G[:, k] * pwm
                pwm = pw; pw = pw * mz
            f[i:i + B] = acc
            if deriv: g[i:i + B] = acc2
        return f, g
    def __call__(self, z, deriv=False):
        f, g = self.D(z, deriv)
        if self.zq is None: return f, g
        F = f.copy(); G = g.copy() if deriv else None
        for zj, rj, Dj in self.zq:
            ex = np.exp(self.u * (zj - z)) * Dj
            q = (f - ex) / (z - zj)
            F += rj * q
            if deriv: G += rj * ((g + self.u * ex) / (z - zj) - q / (z - zj))
        return F, G

def newton(F, z, box, it=30):
    xlo, xhi, ylo, yhi = box
    z = z.astype(complex).copy(); alive = np.ones(len(z), dtype=bool); step = np.full(len(z), np.inf)
    for _ in range(it):
        if not alive.any(): break
        f, g = F(z[alive], True)
        with np.errstate(all='ignore'):
            dz = f / g
        zn = z[alive] - dz
        bad = ~np.isfinite(zn) | (zn.real < xlo - 0.6) | (zn.real > xhi + 0.6) | (zn.imag < ylo - 0.6) | (zn.imag > yhi + 0.6)
        idx = np.nonzero(alive)[0]
        z[idx[~bad]] = zn[~bad]; step[idx[~bad]] = np.abs(dz[~bad]); step[idx[bad]] = np.inf
        alive[idx[bad]] = False
    ok = alive & (step < 1e-10)
    return z[ok]

def dedupe(z, tol=1e-6):
    if len(z) == 0: return z
    z = z[np.argsort(z.imag)]
    keep = []
    for v in z:
        if not any(abs(v - w) < tol for w in keep[-10:]): keep.append(v)
    return np.array(keep)

def winding(F, box, hb=0.002):
    xlo, xhi, ylo, yhi = box
    for tr in range(3):
        nx = int((xhi - xlo) / hb) + 1; ny = int((yhi - ylo) / hb) + 1
        bx = np.linspace(xlo, xhi, nx); by = np.linspace(ylo, yhi, ny)
        pts = np.concatenate([bx + 1j * ylo, xhi + 1j * by[1:], bx[::-1][1:] + 1j * yhi, xlo + 1j * by[::-1][1:]])
        f, _ = F(pts)
        da = np.angle(f[1:] / f[:-1])
        mx = float(np.abs(da).max())
        if mx < 1.0: break
        hb /= 5
    return int(round(da.sum() / (2 * math.pi))), mx

def find_zeros(F, box):
    xlo, xhi, ylo, yhi = box
    xs = np.arange(xlo, xhi + GRID / 2, GRID); ys = np.arange(ylo, yhi + GRID / 2, GRID)
    Z = (xs[None, :] + 1j * ys[:, None])
    A = np.abs(F(Z.ravel())[0]).reshape(Z.shape)
    Ap = np.pad(A, 1, constant_values=np.inf)
    mn = np.ones(A.shape, dtype=bool)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dx or dy: mn &= A <= Ap[1 + dy:1 + dy + A.shape[0], 1 + dx:1 + dx + A.shape[1]]
    inb = lambda z: z[(z.real > xlo) & (z.real < xhi) & (z.imag > ylo) & (z.imag < yhi)]
    zs = dedupe(inb(newton(F, Z[mn], box)))
    w, mx = winding(F, box)
    stage = 0
    if len(zs) != w:
        stage = 1
        thr = np.quantile(A, 0.15)
        zs = dedupe(np.concatenate([zs, inb(newton(F, Z[A < thr], box))]))
    if len(zs) != w:
        stage = 2
        zs = dedupe(np.concatenate([zs, inb(newton(F, Z.ravel(), box))]))
    return zs, w, mx, stage

def simpson(y, h):
    n = len(y) - 1
    assert n % 2 == 0
    return h / 3 * (y[0] + y[-1] + 4 * y[1:-1:2].sum() + 2 * y[2:-1:2].sum())

def littlewood(F, zs):
    h = 0.002; n = int(round(2 * HW / h)); y = np.linspace(-HW, HW, n + 1)
    f, _ = F(1j * y)
    la = np.log(np.abs(f))
    near = zs[np.abs(zs.real) < LEFT]
    an = 0.0
    for b, g in zip(near.real, near.imag):
        la -= 0.5 * np.log((y - g) ** 2 + b * b)
        prim = lambda v: 0.5 * (v * np.log(v * v + b * b) - 2 * v + 2 * b * np.arctan(v / b))
        an += prim(HW - g) - prim(-HW - g)
    Iline = simpson(la, h) + an
    yy = np.linspace(-HW, HW, 2001)
    Iright = np.trapz(np.log(np.abs(F(XB + 1j * yy)[0])), yy) if hasattr(np, 'trapz') else np.trapezoid(np.log(np.abs(F(XB + 1j * yy)[0])), yy)
    hx = 0.0005; x = np.linspace(XB, 0.0, int(round(XB / hx)) + 1)
    A = []; mxd = 0.0
    for yv in (HW, -HW):
        f, _ = F(x + 1j * yv)
        da = np.angle(f[1:] / f[:-1]); mxd = max(mxd, float(np.abs(da).max()))
        arg = np.angle(f[0]) + np.concatenate([[0.0], np.cumsum(da)])
        A.append(float(((arg[1:] + arg[:-1]) / 2).sum() * hx))
    H = 2 * HW
    L = Iline / (2 * math.pi * H)
    E = (-Iright + A[0] - A[1]) / (2 * math.pi * H)
    return L, E, mxd

def cstats(b, gam, pr50, thx):
    n = len(b)
    if n < 6: return None
    ph = thx[None, :] - np.outer(gam, np.log(pr50))
    e = np.exp(1j * ph); m = e.mean(0)
    cm = (e.T @ e.conj()) / n - np.outer(m, m.conj())
    cp = (e.T @ e) / n - np.outer(m, m)
    iu = np.triu_indices(len(pr50), 1)
    Q1 = float((np.abs(cm[iu]) ** 2 + np.abs(cp[iu]) ** 2).mean())
    d = b - b.mean()
    Q2 = float((np.abs((d[:, None] * e).mean(0)) ** 2).mean() / d.var())
    Q0 = float((np.abs(m) ** 2).mean())
    return {'Q0': Q0, 'Q1': Q1, 'Q2': Q2}

def job(spec):
    t, th, cls, kind, idx, w, zqz = spec
    t0 = time.time()
    P = P_of(t, th); tw = t + 200.0 * w; u = math.log(P)
    base = 'zeta' if cls in ('chain', 'ZQ') else cls
    a = coeffs(base, P)
    pr = primes_upto(P)
    thp = np.zeros(len(pr))
    if cls == 'chain':
        thp = math.pi * np.random.default_rng(121000 + idx).integers(0, 2, size=NPMAX)[:len(pr)].astype(float)
    if kind == 'haar':
        thp = 2 * math.pi * np.random.default_rng(770000 + 1000 * CLS_ID[cls] + idx).random(NPMAX)[:len(pr)]
    if cls == 'chain':
        A = a * np.rint(np.cos(additive_theta(P, pr, thp)))
    elif kind == 'haar':
        A = a * np.exp(1j * additive_theta(P, pr, thp))
    else: A = a
    # sigma_R
    absa = np.abs(a[2:]); lnn = np.log(np.arange(2, P + 1, dtype=float))
    lo, hi = 1.02, 6.0
    for _ in range(9):
        mid = (lo + hi) / 2
        if (absa * np.exp(-mid * lnn)).sum() < 1: hi = mid
        else: lo = mid
    sR = hi + 0.02 + (0.8 if cls == 'ZQ' else 0.0)
    del absa, lnn
    M, om = moments(tw, P, A)
    del A, a
    F = Fn(M, om, P, zq=(zqz[0] - tw, zqz[1] - tw) if cls == 'ZQ' else None)
    box = (-LEFT, sR - 0.5, -HW - EXT, HW + EXT)
    zs, wn, mx, stage = find_zeros(F, box)
    right = zs[(zs.real > 0) & (np.abs(zs.imag) <= HW)]
    S = float(right.real.sum() / (2 * HW))
    L, E, mxd = littlewood(F, zs)
    pr50 = pr[pr <= 50]
    cs = cstats(right.real, tw + right.imag, pr50.astype(float), thp[:len(pr50)])
    out = {'t': t, 'theta': th, 'cls': cls, 'kind': kind, 'idx': idx, 'w': w, 'P': P, 'u': u, 'sigma_R': sR,
           'n_ext': int(len(zs)), 'wind_ext': wn, 'complete': bool(len(zs) == wn), 'max_darg': mx, 'stage': stage,
           'N_R': int(len(right)), 'frac_right': float(len(right) / (2 * HW * u / (2 * math.pi))),
           'S': S, 'L': float(L), 'E': float(E), 'resid': float(S - L - E), 'edge_darg': mxd,
           'max_re': float(right.real.max() + 0.5) if len(right) else None,
           'C': cs, 'zeros_right': [[float(x), float(y)] for x, y in zip(right.real, right.imag)],
           'sec': time.time() - t0}
    return out

def zq_pairs(ts):
    import flint
    flint.ctx.prec = 100
    out = {}
    for t in ts:
        n0 = int(t / (2 * math.pi) * math.log(t / (2 * math.pi * math.e)) + 7 / 8)
        g = [float(flint.acb.zeta_zero(n).imag) for n in range(max(1, n0 - 3), n0 + 5)]
        k = min(range(len(g) - 1), key=lambda i: abs((g[i] + g[i + 1]) / 2 - t))
        out[t] = (g[k], g[k + 1])
    return out

def build_jobs(cells, nz=8, nch=24, nh=24, nh2=12):
    zq = zq_pairs(sorted({t for t, _ in cells}))
    jobs = []
    for t, th in cells:
        for w in range(nz): jobs.append((t, th, 'zeta', 'real', 0, w, None))
        for j in range(nch): jobs.append((t, th, 'chain', 'real', j, 0, None))
        for c in ('TNR', 'ZQ', 'EA', 'DH', 'HQ2'): jobs.append((t, th, c, 'real', 0, 0, zq[t]))
        for m in range(nh): jobs.append((t, th, 'zeta', 'haar', m, 0, None))
        for c in ('TNR', 'ZQ', 'EA', 'DH', 'HQ2'):
            for m in range(nh2): jobs.append((t, th, c, 'haar', m, 0, zq[t]))
    return jobs, zq

if __name__ == '__main__':
    tag = sys.argv[1]
    cells = [(float(x.split(':')[0]), float(x.split(':')[1])) for x in sys.argv[2].split(',')]
    sizes = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else [8, 24, 24, 12]
    nw = int(os.environ.get('RH_WORKERS', '4'))
    jobs, zq = build_jobs(cells, *sizes)
    done = set()
    fn = 'resBC_%s.jsonl' % tag
    import glob
    for f in glob.glob('resBC_*.jsonl'):
        for l in open(f):
            r = json.loads(l); done.add((r['t'], r['theta'], r['cls'], r['kind'], r['idx'], r['w']))
    jobs = [j for j in jobs if j[:6] not in done]
    jobs.sort(key=lambda j: -P_of(j[0], j[1]))
    print('jobs', len(jobs), 'workers', nw, 'zq', zq, 'planned memory per worker about %.2f GB' % (max(P_of(*c) for c in cells) * 8 * 7 / 1e9 + 0.3), flush=True)
    t0 = time.time()
    with Pool(nw, maxtasksperchild=4) as pool, open(fn, 'a') as fo:
        for i, r in enumerate(pool.imap_unordered(job, jobs)):
            fo.write(json.dumps(r) + '\n'); fo.flush()
            if i % 20 == 0 or not r['complete'] or abs(r['resid']) > 1e-4:
                print(i, r['t'], r['theta'], r['cls'], r['kind'], r['idx'], r['w'], 'P', r['P'], 'N_R', r['N_R'], 'n/w', r['n_ext'], r['wind_ext'], 'stage', r['stage'],
                      'S %.5f L %.5f E %.5f resid %.2e' % (r['S'], r['L'], r['E'], r['resid']), 'sec %.1f' % r['sec'], 'elapsed %.0f' % (time.time() - t0), flush=True)
    print('done', time.time() - t0, flush=True)
