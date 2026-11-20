"""Test 1. G = F * m,  m(s) = prod_{p in S} (1 - p^-s)/(1 - alpha_p p^-s), alpha_p = sqrt(p) e^{i theta_p},
S = {nearest prime to exp(k^2), k = 1..n}.  If F has the functional equation Lam_F(s) = Lam_F(1-s), the
functional equation for G is m(s) = m(1-s); the base F cancels.  For a base without it,
q(s) = Lam_F(1-s)/Lam_F(s) enters:  residual m(s) - q(s) m(1-s).
Pointwise normalised residual rho = (m(s) - q m(1-s))/sqrt(|m(s)|^2 + |q m(1-s)|^2);  R = rms of rho over the
test points; minimised over the phases (Levenberg-Marquardt, finite-difference Jacobian, multi-start, float64 with
overflow-safe factors), then re-evaluated at 100 digits (mpmath).
"""
import sys, json, math, random, time
import numpy as np
import mpmath as mp

def is_prp(n):
    if n < 2: return False
    for q in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % q == 0: return n == q
    d = n-1; r = 0
    while d % 2 == 0: d //= 2; r += 1
    for a in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        x = pow(a, d, n)
        if x in (1, n-1): continue
        for _ in range(r-1):
            x = x*x % n
            if x == n-1: break
        else: return False
    return True

def sparse_primes(n):
    mp.mp.dps = 800; out = []
    for k in range(1, n+1):
        c = int(mp.nint(mp.exp(k*k))); j = 0
        while True:
            for cand in ((c+j, c-j) if j else (c,)):
                if cand > 1 and is_prp(cand) and cand not in out: out.append(cand); break
            else: j += 1; continue
            break
    return out

def points(npts, seed=20261120, dmin=0.02):
    rng = random.Random(seed); pts = []
    while len(pts) < npts:
        re = rng.uniform(-1, 2); im = rng.uniform(-200, 200)
        if abs(re-0.5) >= dmin: pts.append(complex(re, im))
    return np.array(pts)

def m_float(s, L, theta):
    """prod of factors, overflow-safe.  s: (n_pts,), L: (n,), theta: (n,)"""
    s = s[:, None]; L = L[None, :]; th = theta[None, :]
    with np.errstate(over='ignore', under='ignore', invalid='ignore', divide='ignore'):
        re = s.real
        A = re > 0.5; B = (re > 0) & ~A; C = ~A & ~B
        x = (0.5 - s)*L
        f = np.empty(np.broadcast(s, L).shape, dtype=complex)
        u = np.exp(-np.where(re > 0, s, 0)*L)                    # p^-s where |.| <= 1
        w = np.exp(np.where(A, x, 0) + 1j*th)                    # alpha p^-s where |.| <= 1
        iw = np.exp(-np.where(A, 0, x) - 1j*th)                  # 1/(alpha p^-s) where |.| <= 1
        iu = np.exp(np.where(re > 0, 0, s)*L)                    # p^s where |.| <= 1
        f = np.where(A, (1-u)/(1-w), np.where(B, -(1-u)*iw/(1-iw), np.exp(-1j*th - 0.5*L)*(1-iu)/(1-iw)))
    return np.prod(f, axis=1)

def rho(theta, s, L, q=None):
    a = m_float(s, L, theta); b = m_float(1-s, L, theta)
    if q is not None: b = q*b
    return (a-b)/np.sqrt(abs(a)**2 + abs(b)**2)

def lm(theta0, s, L, q=None, iters=60):
    th = theta0.copy(); lam = 1e-2
    f = lambda t: (lambda r: np.concatenate([r.real, r.imag]))(rho(t, s, L, q))
    r = f(th); c = r @ r
    for it in range(iters):
        J = np.empty((len(r), len(th)))
        for k in range(len(th)):
            e = np.zeros(len(th)); e[k] = 1e-6
            J[:, k] = (f(th+e) - f(th-e))/2e-6
        g = J.T @ r; H = J.T @ J
        improved = False
        for _ in range(8):
            step = np.linalg.solve(H + lam*np.diag(np.diag(H) + 1e-12), -g)
            r2 = f(th+step); c2 = r2 @ r2
            if c2 < c: th = th+step; r = r2; improved = (c - c2) > 1e-13*c; c = c2; lam /= 3; break
            lam *= 4
        if not improved: break
    return th, math.sqrt(c/len(s))

def R_mp(theta, primes, pts, dps=100, q=None):
    mp.mp.dps = dps
    Ls = [mp.log(p) for p in primes]; th = [mp.mpf(float(t)) for t in theta]
    def m(s):
        v = mp.mpf(1)
        for L, t in zip(Ls, th): v *= (1 - mp.exp(-s*L))/(1 - mp.exp((mp.mpf(1)/2 - s)*L + 1j*t))
        return v
    tot = mp.mpf(0); bands = {}
    for j, s0 in enumerate(pts):
        s = mp.mpc(s0.real, s0.imag); a = m(s); b = m(1-s)
        if q is not None: b = b*q[j]
        r2 = abs(a-b)**2/(abs(a)**2 + abs(b)**2); tot += r2
        d = abs(s0.real - 0.5); key = '<0.1' if d < 0.1 else ('<0.5' if d < 0.5 else '>=0.5')
        bands.setdefault(key, []).append(r2)
    return mp.sqrt(tot/len(pts)), {k: (len(v), float(mp.sqrt(sum(v)/len(v))), float(mp.sqrt(min(v)))) for k, v in bands.items()}

def qratio(base, pts, alpha=1.7):
    mp.mp.dps = 30
    def lam(s):
        g = mp.pi**(-s/2)*mp.gamma(s/2)
        if base == 'wt': return g*mp.zeta(s + 1j*alpha)
        if base == 'liouville': return g*mp.zeta(2*s)/mp.zeta(s)
    return np.array([complex(lam(1 - mp.mpc(z.real, z.imag))/lam(mp.mpc(z.real, z.imag))) for z in pts])

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'selftest':
        pr = sparse_primes(8); print('primes k=1..5:', pr[:5], 'digits of k=8:', len(str(pr[7])))
        L = np.array([float(mp.log(p)) for p in pr]); pts = points(200); th = np.linspace(0.3, 2.9, 8)
        # known answer 1: float64 safe product vs mpmath 60 digits
        mp.mp.dps = 60; err = 0
        for s0 in pts[:60]:
            s = mp.mpc(s0.real, s0.imag); v = mp.mpf(1)
            for p, t in zip(pr, th): v *= (1 - mp.mpf(p)**(-s))/(1 - mp.sqrt(p)*mp.exp(1j*mp.mpf(float(t)))*mp.mpf(p)**(-s))
            vf = m_float(np.array([s0]), L, th)[0]
            err = max(err, float(abs(v - vf)/abs(v)) if v != 0 else abs(vf))
        print('float64 product vs mpmath, max relative error:', err)
        # known answer 2: alpha_p = 1 instead of sqrt(p) gives m = 1 and residual 0 (identity check of rho code path)
        # known answer 3: single prime, real alpha: f(1-s) = (1/alpha)(p^s - p)/(p^s - alpha)  (closed form)
        p = pr[1]; s0 = complex(0.8, 3.1); al = math.sqrt(p)
        lhs = m_float(np.array([1-s0]), L[1:2], np.array([0.0]))[0]; rhs = (p**s0 - p)/(p**s0 - al)/al
        print('reflection closed form:', abs(lhs-rhs))
        t1, R1 = lm(np.zeros(3), pts, L[:3]); print('LM n=3 from 0:', R1, t1)
        print('mp check n=3:', R_mp(t1, pr[:3], pts[:50], 50))
    elif mode == 'run':
        nmax = int(sys.argv[2]); npts = int(sys.argv[3]); nstart = int(sys.argv[4]); base = sys.argv[5] if len(sys.argv) > 5 else 'fe'
        pr = sparse_primes(nmax); mp.mp.dps = 120
        L = np.array([float(mp.log(p)) for p in pr]); pts = points(npts)
        q = None if base == 'fe' else qratio(base, pts)
        rng = np.random.default_rng(7); res = []
        for n in [1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40]:
            if n > nmax: break
            t0 = time.time(); best = (None, 9.0); R0s = []
            starts = [np.zeros(n), np.full(n, math.pi)] + [rng.uniform(0, 2*math.pi, n) for _ in range(nstart)]
            for st in starts:
                R0s.append(float(np.sqrt(np.mean(abs(rho(st, pts, L[:n], q))**2))))
                th, R = lm(st, pts, L[:n], q, iters=40 if n <= 10 else 15)
                if R < best[1]: best = (th, R)
            Rm, bands = R_mp(best[0], pr[:n], pts, 100, q)
            # largest pole residue of m at a lattice point of the largest prime: |Res| = |cofactor| / log p
            row = dict(n=n, base=base, R_min_float=best[1], R_min_mp100=mp.nstr(Rm, 20), R_start_range=[min(R0s), max(R0s)],
                       theta=[float(x) % (2*math.pi) for x in best[0]], bands=bands, log_p_max=float(L[n-1]), secs=time.time()-t0)
            res.append(row); print(json.dumps(row), flush=True)
            json.dump(res, open(f'out/twin1_{base}_{npts}.json', 'w'), indent=1)
