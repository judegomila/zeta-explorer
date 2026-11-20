"""Shared library, lane s3-dyson-burgers-zero-flow.
Backend: cupy on one GPU when available (float64 screen), numpy otherwise (RH_BACKEND=cpu forces numpy).
Conventions (sources: src/data/sg1c-theta-trap-theorems.js, src/math/imp-857-phase-locked-dyson.mjs,
src/data/lambda-intercept-burgers-uniformity.js, src/data/imp-33794-cren-window-measurement.js):
  attractive (backward) flow   dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j)   (+ eps cos(k0 x_k - omega s) when forced)
  pair (a, b), g = b - a, T_j = 1/((a - x_j)(b - x_j)), E = sum_j T_j, Theta = g^2 E / 2, d(g^2)/ds = -8 (1 - Theta)
  m_N(z) = sum_k 1/(gamma_k - z), reading strip y_N = sqrt(2 pi / N), C_ren = y_N^{3/2} |m_N'(z0*)|
"""
import os, math, json, time, numpy as np
try:
    if os.environ.get('RH_BACKEND') == 'cpu': raise ImportError
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=int(os.environ.get('RH_POOL_GB', '20')) * 1024 ** 3)
    cp.zeros(1)
    xp = cp; GPU = True
except Exception:
    xp = np; GPU = False

def asnp(a): return cp.asnumpy(a) if GPU else np.asarray(a)
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)

BASE = os.environ.get('RH_BASE', os.path.expanduser('~/rh-push'))
HERE = os.path.dirname(os.path.abspath(__file__))
REG = {  # name: (path, T0 subtracted, conductor q, absolute?)
    'zeta8': ('s1-zero-flow-dynamics/data/zeta_fixed.npy', 0.0, 1),
    'zeta9': ('s2-heat-root-drift-forces/data/zeta_1e9.npy', 1e9, 1),
    'zeta12': ('s3-dyson-burgers-zero-flow/data/zeta_1e12_off.npy', None, 1),
    'chi': ('s1-zero-flow-dynamics/data/dir_chi.npy', 0.0, 5),
    'chibar': ('s1-zero-flow-dynamics/data/dir_chibar.npy', 0.0, 5),
    'dh': ('s1-zero-flow-dynamics/data/dir_dh.npy', 0.0, 5),
    'alt': ('s1-zero-flow-dynamics/data/dir_alt.npy', 0.0, 5),
    'heat0': ('s1-zero-flow-dynamics/data/heat_0.npy', 1e7, 1),
    'heat-1e-4': ('s1-zero-flow-dynamics/data/heat_-1e-4.npy', 1e7, 1),
    'heat-5e-4': ('s1-zero-flow-dynamics/data/heat_-5e-4.npy', 1e7, 1),
    'heat-2e-3': ('s1-zero-flow-dynamics/data/heat_-2e-3.npy', 1e7, 1),
    'heat-1e-2': ('s1-zero-flow-dynamics/data/heat_-1e-2.npy', 1e7, 1),
}

def load(name, nmax=None):
    """returns (x, T0, q): x = ordinates minus T0 (float64, increasing)."""
    if os.path.exists(name):
        x = np.load(name); return (x[:nmax] if nmax else x), 0.0, 1
    path, T0, q = REG[name]
    if not os.path.exists(os.path.join(BASE, path)) and name == 'zeta8': path = 's1-zero-flow-dynamics/data/zeta_1e7.npy'   # local copy (first 1e7)
    x = np.load(os.path.join(BASE, path), mmap_mode='r')
    x = np.array(x[:nmax] if nmax else x, dtype=np.float64)
    if T0 is None: T0 = 1e12            # stored as offsets already
    elif T0: x = x - T0
    return x, T0, q

def rho(T, q=1): return np.log(q * np.asarray(T, dtype=np.float64) / (2 * math.pi)) / (2 * math.pi)

def table(name):
    """full zero tables to height 2000 of lane c12-control-battery-harness. returns (online ordinates, offline list of (b, gamma)) with
    b = beta - 1/2 > 0; the pair is gamma +- i b in the variable x = (s - 1/2)/i."""
    for d in (os.path.join(BASE, 'c12-control-battery-harness/tables'), os.path.join(HERE, '../c12-control-battery-harness/tables')):
        p = os.path.join(d, 'zeros_%s.json' % name)
        if os.path.exists(p): break
    d = json.load(open(p))
    on = np.array([float(v) for v in d.get('online', d.get('gamma', []))])
    if name == 'TNR':
        off = [(float(r[0]) - 0.5, float(r[1])) for r in d['offline_local_factor'] if float(r[0]) > 0.5]
    elif name.startswith('HEAT'):
        off = [(float(r[0]), float(r[1])) for r in d.get('offline', [])]
    else:
        off = [(float(r[0]) - 0.5, float(r[1])) for r in d.get('offline', [])]
    return on, off

def full_set(on, off):
    """complex particle array: real ordinates and gamma +- i b"""
    z = [complex(v) for v in on]
    for b, g in off: z += [complex(g, b), complex(g, -b)]
    return np.array(z)

# ------------------------------------------------------------------ Theta of every adjacent pair
def pair_theta(x, K=400, chunk=20_000_000, extra=None):
    """g_i = x_{i+1} - x_i and Theta_i = g_i^2/2 * sum over the K neighbours on each side of 1/((x_i - x_j)(x_{i+1} - x_j)).
    extra: complex particles (both members of each conjugate pair listed) added to E for every pair (O(n * len(extra)))."""
    n = len(x); g = np.diff(x); E = np.zeros(n - 1)
    for s in range(0, n - 1, chunk):
        e = min(n - 1, s + chunk)
        lo = max(0, s - K); hi = min(n, e + 1 + K)
        X = xp.asarray(x[lo:hi]); a = X[s - lo:e - lo]; b = X[s - lo + 1:e - lo + 1]; acc = xp.zeros(e - s)
        for k in range(1, K + 1):
            i0 = max(s, k)
            if i0 < e:
                xl = X[i0 - lo - k:e - lo - k]
                acc[i0 - s:] += 1.0 / ((a[i0 - s:] - xl) * (b[i0 - s:] - xl))
            i1 = min(e, n - 1 - k)
            if i1 > s:
                xr = X[s - lo + 1 + k:i1 - lo + 1 + k]
                acc[:i1 - s] += 1.0 / ((xr - a[:i1 - s]) * (xr - b[:i1 - s]))
        if extra is not None and len(extra):
            Z = xp.asarray(extra)
            B = max(1, int(2e7 // len(extra)))
            for t in range(0, e - s, B):
                acc[t:t + B] += (1.0 / ((a[t:t + B, None] - Z[None, :]) * (b[t:t + B, None] - Z[None, :]))).real.sum(1)
        E[s:e] = asnp(acc)
        del X, acc
    return g, 0.5 * g * g * E

def window_stats(g, Th, Ns, thr=(0.25, 0.443, 0.5, 1.0)):
    """for each window size N (zeros): number of windows, and for each threshold the number of windows whose minimal pair has Theta > thr;
    max Theta over minimal pairs of windows; the smallest window-minimal gap with Theta > 1/4."""
    from scipy.ndimage import minimum_filter1d, maximum_filter1d
    n = len(g); out = []
    for N in Ns:
        w = N - 1
        if w < 1 or w > n: continue
        m = minimum_filter1d(g, size=w, mode='nearest')
        v0 = w // 2; v1 = n - 1 - (w - 1 - w // 2)          # valid centres v0..v1
        row = dict(N=N, windows=v1 - v0 + 1)
        for t in thr:
            gb = np.where(Th > t, g, np.inf)
            mb = minimum_filter1d(gb, size=w, mode='nearest')
            row['fail_%g' % t] = int((mb[v0:v1 + 1] == m[v0:v1 + 1]).sum())
        m[:v0] = -np.inf; m[v1 + 1:] = -np.inf
        M = maximum_filter1d(m, size=w, mode='constant', cval=-np.inf, origin=(0 if w % 2 else -1))
        ismin = (M == g)
        row['n_minpairs'] = int(ismin.sum())
        row['maxTheta'] = float(Th[ismin].max()) if ismin.any() else None
        row['medTheta'] = float(np.median(Th[ismin])) if ismin.any() else None
        out.append(row)
    return out

def span_of(g, i):
    """largest window (in zeros) in which pair i is the minimal pair"""
    n = len(g); L = i - 1
    while L >= 0 and g[L] >= g[i]: L -= 1
    R = i + 1
    while R < n and g[R] >= g[i]: R += 1
    return R - L

# ------------------------------------------------------------------ pairwise forces and the flow
def forces(X, B_, chunk=3e7):
    """F_k = sum_{j != k} 1/(x_k - x_j); B_ = array module (np, cp); works for float64, complex128, longdouble"""
    n = len(X); out = B_.empty_like(X); bs = max(1, int(chunk // n))
    for s in range(0, n, bs):
        e = min(n, s + bs)
        d = X[s:e, None] - X[None, :]
        d[B_.arange(e - s), B_.arange(s, e)] = B_.inf
        out[s:e] = (1.0 / d).sum(1)
    return out

def rect_field(xin, xout, B_, chunk=3e7):
    """F0_k = sum_j 1/(xin_k - xout_j), F1_k = d/dx of it"""
    n = len(xin); F0 = B_.empty_like(xin); F1 = B_.empty_like(xin); bs = max(1, int(chunk // len(xout)))
    for s in range(0, n, bs):
        r = 1.0 / (xin[s:s + bs, None] - xout[None, :])
        F0[s:s + bs] = r.sum(1); F1[s:s + bs] = -(r * r).sum(1)
    return F0, F1

def theta_of(X, isreal, B_):
    """minimal adjacent pair among the real particles: (g, Theta, ia, ib) with all particles in E"""
    idx = B_.nonzero(isreal)[0]; xr = X[idx].real
    o = B_.argsort(xr); xr = xr[o]; gg = xr[1:] - xr[:-1]
    k = int(B_.argmin(gg)); ia = int(idx[o[k]]); ib = int(idx[o[k + 1]])
    return pair_E(X, ia, ib, B_) + (ia, ib)

def pair_E(X, ia, ib, B_):
    a = X[ia]; b = X[ib]
    with np.errstate(all='ignore'): t = 1.0 / ((a - X) * (b - X) + 0.0)
    m = B_.ones(len(X), dtype=bool); m[ia] = False; m[ib] = False
    E = t[m].sum()
    g = (b - a).real if hasattr(b - a, 'real') else (b - a)
    Er = E.real if hasattr(E, 'real') else E
    return float(g), float(0.5 * g * g * Er)

def backward_flow(x0, B_=np, cfl=0.05, stop=1e-6, isreal=None, force=None, ext=None, maxsteps=20000, track=None, tmax=None, chunk=3e7):
    """RK4 for dx/ds = -2 F(x) [+ eps cos(k0 x - omega s)] [+ frozen far field]; step = cfl * g_min^2 / 8.
    Stops when g_min^2 < stop * g_min(0)^2 (collision time by the exact pair law from there) or at s = tmax.
    force = (eps, k0, omega); ext = (F0, F1, x_ref): far-field force F0 + F1 (x - x_ref) added to F.
    track = (ia, ib): follow this pair instead of the current minimal pair."""
    X = B_.asarray(x0).copy()
    if isreal is None: isreal = B_.ones(len(X), dtype=bool)
    else: isreal = B_.asarray(isreal)
    cplx = X.dtype.kind == 'c'
    def rhs(Y, s):
        F = forces(Y, B_, chunk)
        if ext is not None: F = F + ext[0] + ext[1] * (Y - ext[2])
        v = -2.0 * F
        if force is not None: v = v + force[0] * B_.cos(force[1] * Y - force[2] * s)
        if cplx: v = B_.where(isreal, v.real + 0j, v)
        return v
    s = 0.0; rec = []
    g, Th, ia, ib = theta_of(X, isreal, B_)
    if track: ia, ib = track; g, Th = pair_E(X, ia, ib, B_)
    g0 = g; Th0 = Th; Thmax = Th; pair0 = (ia, ib); switched = 0; steps = 0
    while steps < maxsteps:
        if g * g < stop * g0 * g0: break
        gm = theta_of(X, isreal, B_)[0] if track else g
        dt = cfl * gm * gm / 8.0
        if tmax is not None and s + dt >= tmax: dt = tmax - s
        k1 = rhs(X, s); k2 = rhs(X + (0.5 * dt) * k1, s + 0.5 * dt); k3 = rhs(X + (0.5 * dt) * k2, s + 0.5 * dt); k4 = rhs(X + dt * k3, s + dt)
        X = X + (dt / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4); s += dt; steps += 1
        if track: g, Th = pair_E(X, ia, ib, B_)
        else:
            g, Th, ja, jb = theta_of(X, isreal, B_)
            if (ja, jb) != (ia, ib): switched += 1; ia, ib = ja, jb
        Thmax = max(Thmax, Th)
        if steps % 20 == 0: rec.append((s, g, Th))
        if tmax is not None and s >= tmax: break
    tc = s + g * g / (8.0 * (1.0 - Th)) if Th < 1 else float('nan')
    return dict(tc=float(tc), s_end=float(s), g0=float(g0), g_end=float(g), Theta0=float(Th0), Theta_end=float(Th), Theta_max=float(Thmax),
                steps=steps, switched=switched, pair0=pair0, pair=(ia, ib), X=X, rec=rec)
