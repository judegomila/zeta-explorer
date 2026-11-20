"""Shared library, lane s1-zero-flow-dynamics.
Backend: cupy on one GPU when available (float64 screen), numpy otherwise.
Contents: Riemann-Siegel sampler for zeta (optionally with heat damping/amplification of the n-th mode),
root finding on a sampled band-limited function, pair statistics (Q, R_eff, B_p), the backward Dyson flow."""
import math, time, sys, os, numpy as np, mpmath as mp
from numpy.polynomial import chebyshev as Ch
import rsz as R
try:
    if os.environ.get('RH_BACKEND') == 'cpu': raise ImportError
    import cupy as cp
    if cp.cuda.Device().mem_info[0] < 10 * 1024 ** 3: raise ImportError('less than 10 GB free on the GPU')
    cp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_POOL_GB', '8')) * 1024 ** 3)
    cp.zeros(1)
    xp = cp; GPU = True
except Exception:
    xp = np; GPU = False

def asnp(a): return cp.asnumpy(a) if GPU else np.asarray(a)
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

# ---------------------------------------------------------------- zeta sampler
_PSI = None
_PH = {}
def sample_Z(T0, deltas, tau=0.0, budget=2.5e8):
    """Z(T0+delta), Riemann-Siegel main sum + C0..C2. tau != 0: n-th mode multiplied by exp(-tau*lambda(k_n)),
    lambda(k) = k(2pi-k), k_n = 2 pi log n / L (heat flow in unfolded time tau; tau < 0 is backward)."""
    global _PSI
    mp.mp.dps = 60
    T0m = mp.mpf(T0); dmax = float(deltas.max())
    Nmax = int(math.floor(math.sqrt((T0 + dmax) / (2 * math.pi)))) + 1
    c = _PH.get(T0)
    if c is None or len(c) < Nmax + 1:
        th0 = mp.siegeltheta(T0m); twopi = 2 * mp.pi
        c = np.empty(Nmax + 1)
        for n in range(1, Nmax + 1):
            v = th0 - T0m * mp.log(n); c[n] = float(v - twopi * mp.floor(v / twopi))
        _PH.clear(); _PH[T0] = c
    if _PSI is None: _PSI = R.psi_tables()
    C0, C1, C2 = _PSI
    n_all = xp.arange(1, Nmax + 1, dtype=xp.float64)
    logn = xp.log(n_all); amp = 2.0 / xp.sqrt(n_all); cn = xp.asarray(c[1:])
    L0 = math.log(T0 / (2 * math.pi)); th = 16 * math.pi ** 2 * tau / L0 ** 2
    if tau: amp = amp * xp.exp(0.25 * th * logn * logn)
    out = np.empty(len(deltas))
    B = max(16, int(budget / (2 if tau else 1) // Nmax))
    for s in range(0, len(deltas), B):
        d = deltas[s:s + B]
        tau_ = (T0 + d) / (2 * math.pi)
        rt = np.sqrt(tau_); N = np.floor(rt).astype(np.int64); p = rt - N
        dth = R.dtheta(T0, d)
        Nmin = int(N.min()); Nmx = int(N.max())
        ph = xp.outer(xp.asarray(d), logn[:Nmin]); ph *= -1.0; ph += cn[:Nmin][None, :]; ph += xp.asarray(dth)[:, None]
        xp.cos(ph, out=ph)
        if tau:
            Lb = xp.asarray(np.log((T0 + d) / (2 * math.pi)))
            dm = xp.outer(Lb, logn[:Nmin]); dm *= -0.25 * th; xp.exp(dm, out=dm); ph *= dm; del dm
        z = asnp(ph @ amp[:Nmin]); del ph
        for n in range(Nmin + 1, Nmx + 1):
            m = N >= n
            z[m] += 2.0 / math.sqrt(n) * np.cos(c[n] + dth[m] - d[m] * math.log(n)) * np.exp(-0.25 * th * math.log(n) * (np.log((T0 + d[m]) / (2 * math.pi)) - math.log(n)))
        xx = 2 * p - 1
        Rm = Ch.chebval(xx, C0) + Ch.chebval(xx, C1) / np.sqrt(tau_) + Ch.chebval(xx, C2) / tau_
        z += np.where(N % 2 == 1, 1.0, -1.0) * tau_ ** -0.25 * Rm * math.exp(-math.pi ** 2 * tau)
        out[s:s + B] = z
    return out

def near_miss_pairs(S, Fs, off, lo, hi, rtol=0.05):
    """close pairs that the sign-change scan and the three-point parabola of rsz.find_roots can miss: same-sign local minima of |F|
    on the fine grid whose fitted parabola stays within rtol*A (A = half second difference, fine units) of zero. Each candidate is
    settled on the exact windowed-sinc interpolant: Newton to the stationary point, sign of the value there, then the two roots.
    Fs = fine samples (step 1/U of a coarse step), fine index f corresponds to coarse index f/U + off. Returns coarse-index roots."""
    U = R.U
    j = np.arange(max(lo, 1), hi - 1)
    fm, f0, fp = Fs[j - 1], Fs[j], Fs[j + 1]
    m = (fm * f0 > 0) & (f0 * fp > 0) & (np.abs(f0) < np.abs(fm)) & (np.abs(f0) <= np.abs(fp))
    j = j[m]; fm, f0, fp = fm[m], f0[m], fp[m]
    A = (fm - 2 * f0 + fp) / 2; Bq = (fp - fm) / 2
    disc = Bq * Bq - 4 * A * f0
    v = f0 - Bq * Bq / (4 * A)
    c = (disc <= 0) & (v / A < rtol) & (A * f0 > 0)
    j = j[c]
    if len(j) == 0: return np.empty(0), 0
    t = (j - Bq[c] / (2 * A[c])) / U + off; s0 = np.sign(f0[c]); e = 1e-3
    for _ in range(4):
        g0 = R.interp(S, t); gp = R.interp(S, t + e); gm = R.interp(S, t - e)
        d1 = (gp - gm) / (2 * e); d2 = (gp - 2 * g0 + gm) / (e * e)
        t = t - np.clip(d1 / d2, -0.5 / U, 0.5 / U)
    g0 = R.interp(S, t); gp = R.interp(S, t + e); gm = R.interp(S, t - e); d2 = (gp - 2 * g0 + gm) / (e * e)
    ok = g0 * s0 < 0
    if not ok.any(): return np.empty(0), len(j)
    t = t[ok]; w = np.sqrt(-2 * g0[ok] / d2[ok])
    return np.concatenate([t - w, t + w]), len(j)

def roots_of_samples(S):
    """real zeros (in coarse-index units) of the band-limited function sampled at 4x Nyquist; valid range [W, len-W)."""
    W, U = R.W, R.U
    J = len(S); SEG = 2000000; parts = []; nh = 0; ncand = 0; nextra = 0
    for s0 in range(W, J - W, SEG):
        s1 = min(s0 + SEG, J - W)
        Fs = R.upsample(S[s0 - W: s1 + W])
        rr, nn = R.find_roots(Fs, W * U, (s1 - s0 + W) * U + 1)
        parts.append(rr / U + (s0 - W)); nh += nn
        ex, nc = near_miss_pairs(S, Fs, s0 - W, W * U, (s1 - s0 + W) * U + 1)
        parts.append(ex); nextra += len(ex) // 2; ncand += nc
        del Fs
    rc = np.sort(np.concatenate(parts))
    rc = rc[(rc >= W + 1) & (rc < J - W - 1)]
    rp = R.polish(S, rc)
    bad = int((np.diff(rp) <= 0).sum())
    if bad == 0: rc = rp
    roots_of_samples.last = dict(near_miss_candidates=ncand, near_miss_pairs=nextra)
    return rc, nh + nextra, bad

def refine_close(t, func, spacing, thr=0.08, iters=44):
    """zeros t (sorted) of func: those with a neighbour closer than thr*spacing are re-located by bisection on direct evaluations of func
    (no interpolation), bracket = +-0.4 of the distance to the nearest neighbour. Returns the new array, the number refined and the number
    of brackets without a sign change (left unchanged)."""
    t = t.copy(); d = np.diff(t)
    nb = np.minimum(np.concatenate([[np.inf], d]), np.concatenate([d, [np.inf]]))
    sel = np.nonzero(nb < thr * spacing)[0]
    if len(sel) == 0: return t, 0, 0
    a = t[sel] - 0.4 * nb[sel]; b = t[sel] + 0.4 * nb[sel]
    fa = func(a); fb = func(b); ok = fa * fb < 0
    for _ in range(iters):
        m = 0.5 * (a + b); fm = func(m)
        left = fa * fm <= 0
        b = np.where(left, m, b); fb = np.where(left, fm, fb); a = np.where(left, a, m); fa = np.where(left, fa, fm)
    t[sel[ok]] = 0.5 * (a + b)[ok]
    return t, int(ok.sum()), int((~ok).sum())

def theta(t):
    t = np.asarray(t, dtype=np.float64)
    return 0.5 * t * np.log(t / (2 * math.pi)) - 0.5 * t - math.pi / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3)

def zeta_block(Ta, Tb, tau=0.0, budget=2.5e8):
    """zeros gamma in [Ta, Tb) (Ta integer >= 1000). returns gamma, hidden-pair count, expected count."""
    W = R.W
    Lend = math.log(Tb / (2 * math.pi)); h = 2 * math.pi / Lend / R.OS
    pad = (W + 6) * h
    J = int((Tb - Ta + 2 * pad) / h) + 2
    deltas = -pad + h * np.arange(J)
    S = sample_Z(Ta, deltas, tau, budget)
    rc, nh, bad = roots_of_samples(S)
    g = Ta + (-pad + rc * h)
    g, nref, nfail = refine_close(g, lambda t: sample_Z(Ta, t - Ta, tau, budget), 4 * h)
    zeta_block.last = dict(refined=nref, refine_fail=nfail, **roots_of_samples.last)
    g = g[(g >= Ta) & (g < Tb)]
    expect = (theta(Tb) - theta(Ta)) / math.pi
    return g, nh, bad, float(expect)

# ---------------------------------------------------------------- pair statistics
def bmean(v, block=2000):
    m = len(v) // block
    if m < 2: return float(np.mean(v)), float('nan')
    M = v[:m * block].reshape(m, block).mean(1)
    return float(v.mean()), float(M.std(ddof=1) / math.sqrt(m))

def pair_fields(x, J=200, chunk=4000000):
    """for an unfolded list x (unit mean density locally) return for k in [J, n-1-J):
    g_k = x_{k+1}-x_k, B_k = sum_{j != k,k+1} 1/((x_k-x_j)(x_{k+1}-x_j)) (J neighbours each side + continuum tail).
    Then g*D = 2 - g^2 B (D = F_{k+1}-F_k) and R_eff = g^2 B / 2."""
    n = len(x); gs = []; Bs = []
    for c0 in range(J, n - 1 - J, chunk):
        c1 = min(c0 + chunk, n - 1 - J)
        X = xp.asarray(x[c0 - J: c1 + J + 2])
        k = xp.arange(J, J + (c1 - c0))
        a = X[k + 1]; b = X[k]; g = a - b
        B = xp.zeros_like(g)
        for m in range(1, J + 1):
            xr = X[k + 1 + m]; xl = X[k - m]
            B += 1.0 / ((a - xr) * (b - xr)) + 1.0 / ((a - xl) * (b - xl))
        # continuum tail at unit density beyond the J-th neighbours: int dy/((a-y)(b-y)) = log((y-a)/(y-b))/g
        Bt = X[k + 1 + J] + 0.5; At = X[k - J] - 0.5
        B += -(xp.log((Bt - a) / (Bt - b)) + xp.log((b - At) / (a - At))) / g
        gs.append(asnp(g)); Bs.append(asnp(B))
    return np.concatenate(gs), np.concatenate(Bs)

def qstats_from(g, B):
    """g, B from pair_fields for a window; rescaled to unit mean gap (g -> g/m, B -> B m^2). Q = <g D> = <2 - g^2 B>."""
    m = float(g.mean()); g = g / m
    Rf = 0.5 * g * g * (B * (m * m))
    q = 2.0 - 2.0 * Rf
    Q, Qe = bmean(q); V, Ve = bmean((g - 1.0) ** 2)
    close = g < 0.2
    return dict(n=int(len(g)), Q=Q, Qerr=Qe, V=V, Verr=Ve, meangap=m,
                P=[float((g < d).mean()) for d in (0.01, 0.02, 0.05, 0.1, 0.2, 0.4)],
                nclose=int(close.sum()), nclosing=int((Rf[close] > 1).sum()),
                Rclose_q=[float(v) for v in np.quantile(Rf[close], [0.5, 0.9, 0.99, 0.999, 1.0])] if close.any() else [],
                Rall_gt1=float((Rf > 1).mean()), gmin=float(g.min()))

# ---------------------------------------------------------------- backward Dyson flow
_TP = None
def _frow(a):
    x, s, e = a
    D = x[s:e, None] - x[None, :]
    D[np.arange(e - s), np.arange(s, e)] = np.inf
    np.reciprocal(D, out=D)
    return D.sum(1)

def forces_cpu(x, chunk=1.5e7):
    """threaded numpy version (RH_WORKERS threads; numpy releases the GIL inside the array operations)."""
    global _TP
    n = len(x); rows = max(1, int(chunk // n))
    if n * n <= 4e7: return _frow((x, 0, n))
    if _TP is None:
        from concurrent.futures import ThreadPoolExecutor
        _TP = ThreadPoolExecutor(int(os.environ.get('RH_WORKERS', '4')))
    return np.concatenate(list(_TP.map(_frow, [(x, s, min(n, s + rows)) for s in range(0, n, rows)])))

def forces(x, chunk=6e7):
    """F_k = sum_{j != k} 1/(x_k - x_j), x a 1-d xp array (float64). Retries when the shared GPU is out of memory."""
    if not GPU: return forces_cpu(x)
    n = len(x); F = xp.empty(n); rows = max(1, int(chunk // n))
    s = 0
    while s < n:
        e = min(n, s + rows)
        for attempt in range(60):
            try:
                D = x[s:e, None] - x[None, :]
                D[xp.arange(e - s), xp.arange(s, e)] = xp.inf
                xp.reciprocal(D, out=D)
                F[s:e] = D.sum(1); del D
                break
            except Exception as ex:
                if not GPU or 'memory' not in str(type(ex)).lower() + str(ex).lower(): raise
                cp.get_default_memory_pool().free_all_blocks(); time.sleep(10)
        else: raise RuntimeError('GPU memory unavailable')
        s = e
    return F

def backward_flow(x0, fracs=(0.5, 0.25, 0.1, 0.05), stop_frac=1e-3, cfl=0.02, want_tc=True, maxsteps=4000):
    """dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j), s = -t >= 0 (imp-35194 convention, raw ordinates), classical RK4,
    dt = cfl*g_min^2. Tracks the running sup of B_p = (F_k - F_{k+1} + 2/g)/g over adjacent pairs and the min gap.
    Returns snapshots {frac: (s, beta, g_min, span, index)} when g_min first crosses frac*g_min(0), and the collision
    time t_c = s_stop + g_stop^2/(8(1 - R_stop)) extrapolated with the pair ODE once g_min < stop_frac*g_min(0)."""
    x = xp.asarray(np.asarray(x0, dtype=np.float64)); s = 0.0
    def diag(x):
        F = forces(x); g = x[1:] - x[:-1]
        B = (F[:-1] - F[1:] + 2.0 / g) / g
        return F, g, B
    F, g, B = diag(x)
    g0 = float(g.min()); beta = float(B.max()); snaps = {}; todo = sorted(fracs, reverse=True)
    snaps['init'] = dict(s=0.0, beta=beta, gmin=g0, argmin=int(g.argmin()), argB=int(B.argmax()))
    steps = 0
    while steps < maxsteps:
        gm = float(g.min())
        dt = cfl * gm * gm
        k1 = -2 * F
        k2 = -2 * forces(x + 0.5 * dt * k1)
        k3 = -2 * forces(x + 0.5 * dt * k2)
        k4 = -2 * forces(x + dt * k3)
        x = x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4); s += dt; steps += 1
        F, g, B = diag(x)
        gm = float(g.min()); i = int(g.argmin())
        if gm <= 0: snaps['crossed'] = s; break
        beta = max(beta, float(B.max()))
        while todo and gm <= todo[0] * g0:
            f = todo.pop(0)
            lo = max(i - 1, 0); hi = min(i + 2, len(x) - 1)
            span = float(min(x[i + 1] - x[lo], x[hi] - x[i])) if 0 < i < len(x) - 2 else float('nan')
            snaps[f] = dict(s=s, beta=beta, gmin=gm, span=span, prod=beta * gm * span, index=i)
        if gm <= stop_frac * g0 or (not want_tc and not todo):
            Bp = float(B[i]); Rr = 0.5 * gm * gm * Bp
            snaps['tc'] = s + gm * gm / (8 * (1 - Rr)); snaps['tc_pair0'] = g0 * g0 / 8; snaps['tc_index'] = i
            break
    snaps['steps'] = steps
    return snaps
