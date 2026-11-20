"""Combination 3: forced zero flow, response spectrum, flux identity.
  c3.py kappa                    (M_s - M_zz)/(M M_z) with M = sum 1/(z - x_k) along the attractive flow, for arbitrary configurations
  c3.py spectrum NAME [nmax]     centre-of-mass response of the forced flow = Landau sum: M_n = (2 pi / T) sum_{gamma <= T} e^{i gamma log n}, n <= 1e4
  c3.py forced [N]               collision-time shift of the forced flow as a function of k0, against the first-order pair formula
  c3.py wrapper                  replay of the interval-RK4 wrapper-width ratio at N = 500 (the source's "reduction factor")
  c3.py lowdh                    DH on-line zeros below the first off-line height against DH's own coefficients
"""
import sys, json, math, os, numpy as np, mpmath as mp
import zf
from zf import xp, asnp, log
OUT = os.path.join(zf.HERE, 'out')
KAP = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)

def mangoldt(nmax):
    L = np.zeros(nmax + 1); sieve = np.ones(nmax + 1, bool); sieve[:2] = False
    for p in range(2, nmax + 1):
        if sieve[p]:
            sieve[2 * p::p] = False; q = p
            while q <= nmax: L[q] = math.log(p); q *= p
    return L

def chi5(n):   # chi mod 5 with chi(2) = i
    return np.array([0, 1, 1j, -1j, -1])[np.asarray(n) % 5]

def lam_from_coeffs(a, nmax):
    """coefficients of -F'/F from the Dirichlet coefficients a(n) (a(1) = 1)"""
    lam = np.zeros(nmax + 1, dtype=complex)
    for n in range(2, nmax + 1):
        v = a[n] * math.log(n)
        for d in range(2, int(n ** 0.5) + 1):
            if n % d == 0:
                v -= lam[d] * a[n // d]
                if d * d != n: v -= lam[n // d] * a[d]
        lam[n] = v
    return lam

def predictions(nmax):
    n = np.arange(nmax + 1); L = mangoldt(nmax); rt = np.sqrt(np.maximum(n, 1))
    P = dict(zeta=-L / rt, chi=-chi5(n) * L / rt, chibar=-np.conj(chi5(n)) * L / rt)
    a = np.real((1 - 1j * KAP) * chi5(n)); P['dh'] = -lam_from_coeffs(a, nmax) / rt
    q, c = 3, 2.2; th = math.acosh(c / 2); t = (-L / rt).astype(complex); m = 1
    while q ** m <= nmax: t[q ** m] = -math.log(q) * (q ** (-m / 2) - (-1) ** m * 2 * math.cosh(m * th)); m += 1
    P['tnr'] = t
    return P, L

def landau(x, T0, nmax=10000, H=None):
    """M_n = (2 pi / H) sum e^{i (T0 + x) log n} for n = 1..nmax"""
    ln = np.log(np.arange(1, nmax + 1)); LN = xp.asarray(ln); acc = xp.zeros(nmax, dtype=xp.complex128)
    bs = max(1, int(6e7 // nmax))
    for s in range(0, len(x), bs):
        ph = xp.outer(xp.asarray(x[s:s + bs]), LN); acc += xp.cos(ph).sum(0) + 1j * xp.sin(ph).sum(0)
    acc = asnp(acc)
    if T0:
        mp.mp.dps = 40; acc = acc * np.array([complex(mp.expj(mp.mpf(T0) * mp.log(k))) for k in range(1, nmax + 1)])
    H = H or (T0 + x[-1] if not T0 else x[-1] - x[0])
    return np.concatenate([[0], 2 * math.pi / H * acc])

def spectrum(name, nmax_z=None, pred_keys=None, x=None, T0=0.0, tag=None, nmax=10000):
    if x is None: x, T0, q = zf.load(name, nmax_z)
    P, L = predictions(nmax)
    log(name, 'zeros', len(x), 'frequencies', nmax, 'planned GPU chunk %.1f GB' % (6e7 * 8 * 3 / 1e9))
    M = landau(x, T0, nmax)
    pp = L[:nmax + 1] > 0; npp = ~pp; npp[:2] = False
    res = dict(name=name, zeros=len(x), top=float(T0 + x[-1]), nmax=nmax, rms_at_non_prime_powers=float(np.sqrt((abs(M[npp]) ** 2).mean())), max_at_non_prime_powers=float(abs(M[npp]).max()))
    for k in (pred_keys or ['zeta', 'chi', 'chibar', 'dh', 'tnr']):
        p = P[k]; d = M - p
        sl = (np.vdot(p[pp], M[pp]) / np.vdot(p[pp], p[pp]))
        res['vs_' + k] = dict(rms_dev_prime_powers=float(np.sqrt((abs(d[pp]) ** 2).mean())), max_dev=float(abs(d[2:]).max()), argmax_dev=int(np.argmax(abs(d[2:])) + 2), regression_slope=[float(sl.real), float(sl.imag)],
                              rms_pred=float(np.sqrt((abs(p[pp]) ** 2).mean())), first=[dict(n=n, M=[float(M[n].real), float(M[n].imag)], pred=[float(np.real(p[n])), float(np.imag(p[n]))]) for n in (2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 27, 81, 9973)])
    json.dump(res, open(os.path.join(OUT, 'c3_spectrum_%s.json' % (tag or name)), 'w'), indent=1); log(json.dumps(res)[:1800])
    return res

def kappa():
    rng = np.random.default_rng(7); res = {}
    cfg = {'random real n=300': np.sort(rng.normal(size=300)) * 20, 'random complex n=300': rng.normal(size=300) * 20 + 1j * rng.normal(size=300),
           'zeta zeros to 2000': zf.table('ZETA')[0].astype(complex), 'DH full set to 2000': zf.full_set(*zf.table('DH')), 'HEAT -0.5 full set': zf.full_set(*zf.table('HEAT--0.5')),
           'TNR full set': zf.full_set(*zf.table('TNR')), 'uniform lattice n=400': np.arange(400.0)}
    for nm, X in cfg.items():
        X = np.asarray(X, dtype=complex); zs = (X.real.mean() + rng.normal(size=40) * X.real.std()) + 1j * (0.3 + 3 * rng.random(40))
        v = -2 * zf.forces(X, np)
        worst = 0; worst_fd = 0
        gmin = np.abs(X[:, None] - X[None, :] + np.eye(len(X)) * 1e9).min(); h = 1e-4 * gmin ** 2
        def step(Y, dt):
            f = lambda Z: -2 * zf.forces(Z, np)
            k1 = f(Y); k2 = f(Y + dt / 2 * k1); k3 = f(Y + dt / 2 * k2); k4 = f(Y + dt * k3); return Y + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
        Xp = step(X, h); Xm = step(X, -h)
        for z in zs:
            Mv = (1 / (z - X)).sum(); Mz = -(1 / (z - X) ** 2).sum(); Mzz = 2 * (1 / (z - X) ** 3).sum(); Ms = (v / (z - X) ** 2).sum()
            worst = max(worst, abs((Ms - Mzz) / (Mv * Mz) - 2))
            Ms_fd = ((1 / (z - Xp)).sum() - (1 / (z - Xm)).sum()) / (2 * h); worst_fd = max(worst_fd, abs((Ms_fd - Mzz) / (Mv * Mz) - 2))
        res[nm] = dict(n=len(X), max_abs_kappa_minus_2_exact_velocity=float(worst), max_abs_kappa_minus_2_finite_difference_of_flow=float(worst_fd)); log(nm, res[nm])
    json.dump(res, open(os.path.join(OUT, 'c3_kappa.json'), 'w'), indent=1)

def forced(N=500, eps=0.01, nk=93):
    x, T0, q = zf.load('zeta8', N); B_ = np if N <= 3000 else xp
    rho_mean = (N - 1) / (x[-1] - x[0]); g = np.diff(x); i = int(np.argmin(g)); a, b = x[i], x[i + 1]
    base = zf.backward_flow(B_.asarray(x), B_, cfl=0.02, stop=1e-8)
    ks = np.unique(np.concatenate([np.linspace(0.05, math.log(1e4), nk), np.log([2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 25, 27, 49, 101, 1009]), [math.pi, 2 * math.pi / g[i]]]))
    rows = []
    for k0 in ks:
        om = k0 * math.pi * rho_mean
        r = zf.backward_flow(B_.asarray(x), B_, cfl=0.02, stop=1e-8, force=(eps, k0, om), track=base['pair0'])
        # first-order pair formula: d(g^2)/ds = -8(1 - Theta) + 2 g eps [cos(k0 b - om s) - cos(k0 a - om s)], unperturbed g(s)^2 = g0^2 (1 - s/tc), frozen a, b
        tc = base['tc']; ss = (np.arange(4000) + 0.5) / 4000 * tc; gs = g[i] * np.sqrt(1 - ss / tc)
        d1 = (2 * gs * eps * (np.cos(k0 * b - om * ss) - np.cos(k0 * a - om * ss))).sum() * tc / 4000 / (8 * (1 - base['Theta0']))
        # centre-of-mass response of the whole window at s = 0: (1/N) sum cos(k0 x_j)
        rows.append(dict(k0=float(k0), dtc=float(r['tc'] - tc), dtc_first_order=float(d1), com_response=float(np.cos(k0 * x).mean())))
    dt = np.array([r['dtc'] for r in rows]); d1 = np.array([r['dtc_first_order'] for r in rows]); cm = np.array([r['com_response'] for r in rows])
    # centre-of-mass identity: d/ds sum x_k = eps sum cos(k0 x_k - om s) (pair forces cancel), checked on one RK4 step
    k0 = math.log(2); om = k0 * math.pi * rho_mean; h = 1e-7
    r1 = zf.backward_flow(B_.asarray(x), B_, cfl=0.02, force=(eps, k0, om), tmax=h, stop=0)
    com = float((asnp(r1['X']) - x).sum()) / h
    res = dict(N=N, eps=eps, tc0=base['tc'], g_min=float(g[i]), Theta0=base['Theta0'], corr_dtc_vs_first_order=float(np.corrcoef(dt, d1)[0, 1]), rms_dtc=float(np.sqrt((dt ** 2).mean())),
               rms_residual=float(np.sqrt(((dt - d1) ** 2).mean())), corr_abs_dtc_vs_abs_com_response=float(np.corrcoef(abs(dt), abs(cm))[0, 1]),
               bound_eps_H0sq_over_4=eps / (4 * rho_mean ** 2), com_identity=dict(measured=com, predicted=float(eps * np.cos(k0 * x).sum())), rows=rows)
    json.dump(res, open(os.path.join(OUT, 'c3_forced_%d.json' % N), 'w'), indent=1); log({k: v for k, v in res.items() if k != 'rows'})

# ---- interval RK4 with one-ulp outward inflation after each operation (src/math/interval-dyson-integrator.mjs)
def _infl(lo, hi): return np.nextafter(lo, -np.inf), np.nextafter(hi, np.inf)
def _add(a, b): return _infl(a[0] + b[0], a[1] + b[1])
def _mul(a, b):
    p = np.stack([a[0] * b[0], a[0] * b[1], a[1] * b[0], a[1] * b[1]]); return _infl(p.min(0), p.max(0))
def _drift(G, t, k0, om, eps):
    lo, hi = G; n = len(lo)
    slo = np.zeros(n); shi = np.zeros(n); slo, shi = _infl(slo, shi)
    for j in range(n):
        dlo, dhi = _infl(lo - hi[j], hi - lo[j])
        bad = (dlo <= 0) & (dhi >= 0); bad[j] = False
        if bad.any(): return None
        with np.errstate(all='ignore'): r1 = 1 / dlo; r2 = 1 / dhi
        rlo, rhi = _infl(np.minimum(r1, r2), np.maximum(r1, r2)); rlo[j] = 0; rhi[j] = 0
        nlo, nhi = _infl(slo + rlo, shi + rhi); nlo[j] = slo[j]; nhi[j] = shi[j]; slo, shi = nlo, nhi
    d = _mul(_infl(np.full(n, -2.0), np.full(n, -2.0)), (slo, shi))
    if eps:
        mid = 0.5 * (k0 * lo - om * t + k0 * hi - om * t); hw = 0.5 * (k0 * hi - k0 * lo); c = np.cos(mid)
        flo = np.maximum(-1, c - hw); fhi = np.minimum(1, c + hw); e = np.maximum(abs(flo), abs(fhi)) * 2.22e-16 + 5e-324
        d = _add(d, (eps * (flo - e), eps * (fhi + e)))
    return d
def _const(v, n): return np.full(n, v), np.full(n, v)
def _rk4(G, dt, t, k0, om, eps):
    n = len(G[0]); dtI = _const(dt, n); half = _const(0.5, n); sixth = _const(1 / 6, n); two = _const(2.0, n)
    k1 = _drift(G, t, k0, om, eps)
    if k1 is None: return None
    k2 = _drift(_add(G, _mul(_mul(half, dtI), k1)), t + 0.5 * dt, k0, om, eps)
    if k2 is None: return None
    k3 = _drift(_add(G, _mul(_mul(half, dtI), k2)), t + 0.5 * dt, k0, om, eps)
    if k3 is None: return None
    k4 = _drift(_add(G, _mul(dtI, k3)), t + dt, k0, om, eps)
    if k4 is None: return None
    s = _add(_add(k1, _mul(two, k2)), _add(_mul(two, k3), k4))
    return _add(G, _mul(_mul(sixth, dtI), s))

def wrapper(N=500, dt=0.0003, nsteps=200):
    x, T0, q = zf.load('zeta8', N); rho_mean = (N - 1) / (x[-1] - x[0]); k0 = math.pi; om = k0 * math.pi * rho_mean
    res = dict(N=N, dt=dt, nsteps=nsteps, k0=k0, omega=om, g_min0=float(np.diff(x).min()), runs={})
    for eps in (0.0, 0.01, 0.05):
        G = (x.copy(), x.copy()); t = 0.0; tr = []; why = 'nsteps'
        for step in range(nsteps):
            gl = G[0][1:] - G[1][:-1]; W = float((G[1] - G[0]).max()); tr.append((step, t, float(gl.min()), W))
            if gl.min() <= 0: why = 'minGapLo <= 0'; break
            nx = _rk4(G, dt, t, k0, om, eps)
            if nx is None: why = 'drift returned null (an interval difference contains 0)'; break
            G = nx; t += dt
        res['runs'][str(eps)] = dict(last_step=tr[-1][0], stop=why, final_maxW=tr[-1][3], final_minGapLo=tr[-1][2], trace=[tr[k] for k in range(0, len(tr), 5)] + tr[-4:])
        log('eps', eps, 'last step', tr[-1][0], why, 'final maxW %.3e' % tr[-1][3], 'minGapLo %.3e' % tr[-1][2])
    r0 = res['runs']['0.0']
    for e in ('0.01', '0.05'):
        r = res['runs'][e]; res['ratio_final_' + e] = r0['final_maxW'] / r['final_maxW']
        # same-step comparison: widths of both runs at the last step they share
        common = min(r0['last_step'], r['last_step']); res['same_step_note'] = 'ratio at each run\'s own final row compares different steps when the runs stop at different steps'
        res['last_steps_' + e] = [r0['last_step'], r['last_step']]
    res['source'] = 'memo: baseline 1.33e-6 (implied), eps 0.01: 7.17e-9 (185x), eps 0.05: 1.19e-9 (1114x)'
    json.dump(res, open(os.path.join(OUT, 'c3_wrapper.json'), 'w'), indent=1); log({k: v for k, v in res.items() if k != 'runs'})

def lowdh():
    """on-line zeros below a height T against the control's own coefficients, with L(chi) as the noise reference at the same height"""
    P, L = predictions(60); res = {}
    on, off = zf.table('DH'); zon, _ = zf.table('ZETA'); T1 = off and min(g for b, g in off)
    chi, _, _ = zf.load('chi', 20000)
    for T in (T1, 300.0, 1000.0, 2000.0):
        row = {}
        for nm, lst, key in (('DH on-line vs DH coefficients', on, 'dh'), ('DH on-line + off-line pairs vs DH coefficients', on, 'dh'), ('L(chi) vs chi coefficients', chi, 'chi'), ('zeta vs zeta coefficients', zon, 'zeta'), ('zeta zeros vs T-NR coefficients', zon, 'tnr')):
            xx = lst[lst <= T]; ns = np.array([2, 3, 4, 7, 9, 11, 13]); M = np.array([2 * math.pi / T * np.exp(1j * xx * math.log(n)).sum() for n in ns])
            if 'pairs' in nm:
                for b, g in off:
                    if g <= T: M += np.array([2 * math.pi / T * np.exp(1j * g * math.log(n)) * (n ** b + n ** -b) for n in ns])
            p = P[key][ns]; row[nm] = dict(zeros=len(xx), rms_dev=float(np.sqrt((abs(M - p) ** 2).mean())), rms_pred=float(np.sqrt((abs(p) ** 2).mean())), n2=[float(M[0].real), float(M[0].imag), float(np.real(p[0])), float(np.imag(p[0]))])
        res['T=%g' % T] = row; log(T, json.dumps(row)[:900])
    json.dump(res, open(os.path.join(OUT, 'c3_lowdh.json'), 'w'), indent=1)

if __name__ == '__main__':
    m = sys.argv[1]
    if m == 'kappa': kappa()
    elif m == 'spectrum': spectrum(sys.argv[2], int(float(sys.argv[3])) if len(sys.argv) > 3 else None)
    elif m == 'forced': forced(int(sys.argv[2]) if len(sys.argv) > 2 else 500)
    elif m == 'wrapper': wrapper()
    elif m == 'lowdh': lowdh()
