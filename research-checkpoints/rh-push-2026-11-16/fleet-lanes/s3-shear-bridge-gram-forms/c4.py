# Combination 4: bridge form against a positive reference form.
#   G(z) = F(1/2 + z) completed;  R(u) = G(u - a)/G(u + a);  nodes u_i = delta + i t_i and their conjugates (orbits of
#   the reflection u -> conj u; the other Klein generator u -> -u maps the node set to Re u < 0 and K^b to -K^b^T
#   when G(-z) = +-G(z), so it adds no condition).
#   K^P_ij = (1 - R_i conj R_j)/(u_i + conj u_j)   (ratio Pick kernel; K^b = D K^P D*, D = diag(U_i)/sqrt(2 pi))
#   K^S_ij = 1/(u_i + conj u_j)                    (Szego kernel = Pick kernel of the fixed inner function 0)
#   statistic: lambda_min of the pencil (K^P, K^S).  For ANY positive definite reference the sign of the pencil
#   minimum equals the sign of lambda_min(K^P) (Sylvester), so the reference changes the size, not the verdict.
# Test A: float64 screen on growing windows (function values from flint/mpmath at 30 digits).
# Test B: dense nodes below the first off-line zero, mpmath eigenvalues at high precision.
import sys, os, json, math, time
os.environ['OPENBLAS_NUM_THREADS'] = '1'; os.environ['OMP_NUM_THREADS'] = '1'   # one BLAS thread per process; prefixes run in the pool
import numpy as np
import mpmath as mp
try:
    import flint
    HAVE_FLINT = True
except Exception:
    HAVE_FLINT = False

LOG3 = None


def _fa(s):
    return flint.acb(flint.arb(mp.nstr(mp.re(s), 40)), flint.arb(mp.nstr(mp.im(s), 40)))


def _fm(z):
    return mp.mpc(mp.mpf(z.real.str(40, radius=False)), mp.mpf(z.imag.str(40, radius=False)))


def zeta(s):
    if HAVE_FLINT and mp.mp.dps <= 34 and abs(mp.im(s)) > 50:
        flint.ctx.prec = 150
        return _fm(_fa(s).zeta())
    return mp.zeta(s)


def hurw(s, r, q):
    if HAVE_FLINT and mp.mp.dps <= 34:
        flint.ctx.prec = 150
        return _fm(_fa(s).zeta(flint.arb(r)/q))
    return mp.zeta(s, mp.mpf(r)/q)


def lper(s, b, q):
    return sum(b[r]*hurw(s, r, q) for r in range(1, q) if b[r] != 0)/mp.mpf(q)**s


def kappa():
    return (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)


def logxi(s):
    return mp.log(s*(s - 1)/2) - s/2*mp.log(mp.pi) + mp.loggamma(s/2) + mp.log(zeta(s))


def loglam(s, b, q):
    return (s + 1)/2*mp.log(mp.mpf(q)/mp.pi) + mp.loggamma((s + 1)/2) + mp.log(lper(s, b, q))


_PHIQ = None


def heat_G(z, tau):
    """G(z) = 2 int_0^inf Phi(u) e^{tau u^2} cosh(2 z u) du  (kernel e^{tau u^2} Phi; tau = 0 gives xi(1/2+z)/4)."""
    def phi(u):
        e4 = mp.exp(4*u)
        return mp.fsum((2*mp.pi**2*n**4*mp.exp(9*u) - 3*mp.pi*n*n*mp.exp(5*u))*mp.exp(-mp.pi*n*n*e4) for n in range(1, 9))
    T = abs(mp.im(z))
    npan = max(8, int(T/6) + 8)
    return 2*mp.quad(lambda u: phi(u)*mp.exp(tau*u*u)*mp.cosh(2*z*u), mp.linspace(0, 2.0, npan + 1))


def logG(name, z):
    s = mp.mpf(1)/2 + z
    if name == 'zeta': return logxi(s)
    if name == 'chi-3': return loglam(s, [0, 1, -1], 3)
    if name == 'chi-4': return loglam(s, [0, 1, 0, -1], 4)
    if name == 'DH':
        k = kappa(); return loglam(s, [0, 1, k, -k, -1], 5)
    if name.startswith('E_b='):
        b = mp.mpf(name[4:]); return logxi(s + b) + logxi(s - b)
    if name == 'T-NR(3,2.2)':
        return logxi(s) + mp.log(2*mp.cosh(z*mp.log(3)) + mp.mpf('2.2'))
    if name.startswith('heat'):
        return mp.log(heat_G(z, mp.mpf(name[4:])))
    if name == 'liouville':      # zeta(2s)/zeta(s) with zeta's gamma factor: no functional equation
        return -s/2*mp.log(mp.pi) + mp.loggamma(s/2) + mp.log(zeta(2*s)) - mp.log(zeta(s))
    if name == 'unimod':         # zeta(s + i) with zeta's gamma factor: no functional equation s <-> 1-s
        return -s/2*mp.log(mp.pi) + mp.loggamma(s/2) + mp.log(zeta(s + 1j))
    raise ValueError(name)


def Rval(args):
    name, d, t, a, dps = args
    mp.mp.dps = dps
    d = mp.mpf(d); t = mp.mpf(t); a = mp.mpf(a)
    u = mp.mpc(d, t)
    r = mp.exp(logG(name, u - a) - logG(name, u + a))
    if name == 'unimod':
        uc = mp.mpc(d, -t)
        rc = mp.exp(logG(name, uc - a) - logG(name, uc + a))
    else:
        rc = mp.conj(r)
    if dps <= 34:
        return complex(r), complex(rc)
    return mp.nstr(mp.re(r), dps), mp.nstr(mp.im(r), dps), mp.nstr(mp.re(rc), dps), mp.nstr(mp.im(rc), dps)


def pencil_stats(u, R):
    n = len(u)
    den = u[:, None] + np.conj(u)[None, :]
    KS = 1.0/den
    KP = (1.0 - np.outer(R, np.conj(R)))/den
    evP = np.linalg.eigvalsh(KP)
    L = np.linalg.cholesky(KS)
    X = np.linalg.solve(L, KP)
    M = np.linalg.solve(L, X.conj().T).conj().T
    ev = np.linalg.eigvalsh((M + M.conj().T)/2)
    evS = np.linalg.eigvalsh(KS)
    return float(ev[0]), float(ev[-1]), float(evP[0]/evP[-1]), float(evS[-1]/evS[0])


def _prefix_job(args):
    delta, ts, vals = args
    m = len(ts)
    u = np.array([complex(delta, t) for t in ts] + [complex(delta, -t) for t in ts])
    R = np.array([v[0] for v in vals] + [v[1] for v in vals])
    lo, hi, rel, cond = pencil_stats(u, R)
    return {'n': 2*m, 'top': ts[m - 1], 'pmin': lo, 'pmax': hi, 'KPmin_rel': rel, 'condS': cond, 'maxabsR': float(np.abs(R).max())}


def testA(pool, name, a, delta, h, T0, mmax, prefixes, dps=30):
    ts = [T0 + (k + 0.5)*h for k in range(mmax)]
    vals = pool.map(Rval, [(name, delta, t, a, dps) for t in ts], chunksize=4)
    if dps > 34:
        vals = [(complex(float(v[0]), float(v[1])), complex(float(v[2]), float(v[3]))) for v in vals]
    jobs = [(delta, ts[:m], vals[:m]) for m in prefixes if m <= mmax]
    rows = pool.map(_prefix_job, jobs, chunksize=1)
    return rows


def testB(pool, name, a, delta, tlo, thi, m, dps):
    """dense equispaced heights in [tlo, thi]; eigenvalues of K^P at dps digits."""
    ts = [tlo + (thi - tlo)*(k + mp.mpf(1)/2)/m for k in range(m)] if m > 1 else [tlo]
    vals = pool.map(Rval, [(name, delta, float(t) if False else mp.nstr(t, 30), a, dps) for t in ts], chunksize=1)
    mp.mp.dps = dps
    u = [mp.mpc(delta, mp.mpf(mp.nstr(t, 30))) for t in ts]
    u = u + [mp.conj(x) for x in u]
    R = [mp.mpc(mp.mpf(v[0]), mp.mpf(v[1])) for v in vals] + [mp.mpc(mp.mpf(v[2]), mp.mpf(v[3])) for v in vals]
    n = 2*m
    K = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            K[i, j] = (1 - R[i]*mp.conj(R[j]))/(u[i] + mp.conj(u[j]))
    ev = mp.eigh(K, eigvals_only=True)
    ev = sorted([mp.re(x) for x in ev])
    neg = sum(1 for x in ev if x < 0)
    amin = min(abs(x) for x in ev)
    return {'n': n, 'neg': neg, 'min_rel': mp.nstr(ev[0]/ev[-1], 5), 'smallest_abs_rel': mp.nstr(amin/ev[-1], 5), 'dps': dps,
            'maxabsR': mp.nstr(max(abs(x) for x in R), 8)}


def Rval_str(args):
    name, d, t, a, dps = args
    mp.mp.dps = dps
    return Rval((name, mp.mpf(d), mp.mpf(t), mp.mpf(a), dps))


if __name__ == '__main__':
    import multiprocessing as mpc
    mode = sys.argv[1]; out = sys.argv[2]
    W = int(os.environ.get('RH_WORKERS', '4'))
    pool = mpc.Pool(W)
    res = json.load(open(out)) if os.path.exists(out) else {}
    PREF = [8, 16, 32, 64, 128, 256, 512, 1024]

    def runA(key, name, a, delta, h, T0, mmax, prefixes=None, dps=30):
        if key in res: return
        t0 = time.time()
        rows = testA(pool, name, a, delta, h, T0, mmax, prefixes or [m for m in PREF if m <= mmax] + ([mmax] if mmax not in PREF else []), dps=dps)
        res[key] = {'name': name, 'a': a, 'delta': delta, 'h': h, 'T0': T0, 'rows': rows}
        json.dump(res, open(out, 'w'))
        print('%-44s ' % key + ' | '.join('n=%d top=%.1f pmin=%+.3e' % (r['n'], r['top'], r['pmin']) for r in rows[-4:]) +
              '  pmax %.6f cond %.1e  [%.0fs]' % (rows[-1]['pmax'], rows[-1]['condS'], time.time() - t0), flush=True)

    if mode == 'check':
        mp.mp.dps = 30
        # functional equations and known zeros
        z = mp.mpc('0.3', '7.7')
        for nm in ('zeta', 'chi-3', 'chi-4', 'DH', 'E_b=0.35', 'T-NR(3,2.2)', 'liouville', 'unimod'):
            d = abs(mp.exp(logG(nm, z) - logG(nm, -z)))
            print('%-12s |G(z)/G(-z)| at z = 0.3+7.7i: %s' % (nm, mp.nstr(d, 12)))
        k = kappa(); s0 = mp.mpc('0.8085171825', '85.6993484854')
        print('DH at 0.8085171825+85.6993484854i:', mp.nstr(abs(lper(s0, [0, 1, k, -k, -1], 5)), 5))
        mp.mp.dps = 60
        print('heat tau=-2 at z = 0.2485774+49.7154476i: |G| =', mp.nstr(abs(heat_G(mp.mpc('0.2485774', '49.7154476'), -2)), 5),
              ' |G| at 0.2485774+48.7i =', mp.nstr(abs(heat_G(mp.mpc('0.2485774', '48.7'), -2)), 5))
        mp.mp.dps = 30
        print('heat tau=0 vs xi/4 at z=0.2+10i:', mp.nstr(heat_G(mp.mpc(0.2, 10), 0), 15), mp.nstr(mp.exp(logxi(mp.mpc(0.7, 10)))/4, 15))
        # Schur product with a planted pole: R = (u - p)/(u + conj p) inverse has a pole at p; Pick matrix must be indefinite
        u = np.array([complex(0.1, 0.2*(k_ + 0.5)) for k_ in range(40)]); u = np.concatenate([u, np.conj(u)])
        B = (u - (0.3 + 5j))/(u + (0.3 - 5j))*(u - (0.3 - 5j))/(u + (0.3 + 5j))
        print('Blaschke factor (Schur): pencil min %.3e max %.6f' % pencil_stats(u, B)[:2], ' inverse (pole at 0.3+-5i): pencil min %.3e' % pencil_stats(u, 1/B)[0])
        r = testA(pool, 'zeta', 0.25, 0.25, 0.5, 0.0, 16, [4, 8, 16])
        print('zeta small case', r)
    elif mode == 'A':
        scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
        M = int(1024*scale)
        # controls: growing windows through the first off-line zeros; fine prefix steps
        for a in (0.01, 0.05, 0.1, 0.25):
            mm = int(700*scale)
            runA('A DH a=%g d=0.1' % a, 'DH', a, 0.1, 0.2, 0.0, mm, list(range(max(1, mm//70), mm + 1, max(1, mm//70))))
            mm = int(150*scale)
            runA('A E_b=0.35 a=%g d=0.1' % a, 'E_b=0.35', a, 0.1, 0.2, 0.0, mm, list(range(max(1, mm//30), mm + 1, max(1, mm//30))))
            runA('A E_b=0.2 a=%g d=0.1' % a, 'E_b=0.2', a, 0.1, 0.2, 0.0, mm, list(range(max(1, mm//30), mm + 1, max(1, mm//30))))
            mm = int(120*scale)
            runA('A T-NR a=%g d=0.05' % a, 'T-NR(3,2.2)', a, 0.05, 0.05, 0.0, mm, list(range(max(1, mm//30), mm + 1, max(1, mm//30))))
            mm = int(100*scale)
            runA('A liouville a=%g d=0.1' % a, 'liouville', a, 0.1, 0.2, 0.0, mm, [1, 2, 4, 8, 16, 32, mm])
            runA('A unimod a=%g d=0.1' % a, 'unimod', a, 0.1, 0.2, 0.0, mm, [1, 2, 4, 8, 16, 32, mm])
        for a in (0.05, 0.25, 0.5):   # a = 0.01 at delta = 0.1 was run first (keys kept in the output file)
            for (delta, h) in ((0.1, 0.2), (0.5, 1.0)):
                for T0 in (0.0, 1e2, 1e4, 1e6):
                    runA('A zeta a=%g d=%g T0=%g' % (a, delta, T0), 'zeta', a, delta, h, T0, M)
                for T0 in (0.0, 1e2, 1e4, 1e5):
                    mm = M if T0 < 1e5 else max(8, M//4)
                    runA('A chi-3 a=%g d=%g T0=%g' % (a, delta, T0), 'chi-3', a, delta, h, T0, mm)
                runA('A chi-4 a=%g d=%g T0=0' % (a, delta), 'chi-4', a, delta, h, 0.0, M)
    elif mode == 'Aheat':
        scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
        for (tau, top) in ((-2.0, 64.0), (-0.2, 64.0), (0.05, 64.0)):
            for a in (0.05, 0.2):
                mm = int(top/0.2*scale)
                runA('A heat%g a=%g d=0.1' % (tau, a), 'heat%g' % tau, a, 0.1, 0.2, 0.0, mm, list(range(max(1, mm//32), mm + 1, max(1, mm//32))), dps=60)
    elif mode == 'B':
        dps = int(sys.argv[3]) if len(sys.argv) > 3 else 120
        ms = [int(x) for x in sys.argv[4].split(',')] if len(sys.argv) > 4 else [8, 16, 32]
        # nodes strictly below the first off-line zero of each control
        cases = [('DH', 0.05, 0.1, 60.0, 84.0, 'zero 0.8085+85.699i'), ('DH', 0.05, 0.1, 1.0, 60.0, 'zero 0.8085+85.699i'),
                 ('E_b=0.35', 0.05, 0.1, 1.0, 13.0, 'zeros 0.5+-0.35+14.135i'), ('T-NR(3,2.2)', 0.05, 0.05, 0.1, 2.6, 'zeros 0.5+-0.404+2.8596i'),
                 ('zeta', 0.05, 0.1, 60.0, 84.0, ''), ('zeta', 0.05, 0.1, 1.0, 13.0, ''), ('chi-3', 0.05, 0.1, 60.0, 84.0, ''),
                 ('liouville', 0.05, 0.1, 1.0, 6.0, 'no functional equation'), ('unimod', 0.05, 0.1, 1.0, 6.0, 'no functional equation')]
        if len(sys.argv) > 5 and sys.argv[5] == 'scan':
            # distance scan: windows of fixed length ending at decreasing heights below the first off-line zero
            cases = [('DH', 0.05, 0.1, T - 24.0, T, 'zero 0.8085+85.699i; top of window %g below it' % (85.699 - T)) for T in (84.0, 82.0, 80.0, 77.0, 74.0, 70.0)]
            cases += [('E_b=0.35', 0.05, 0.1, 1.0, T, 'zeros 0.5+-0.35+14.135i') for T in (11.0, 9.0, 7.0, 5.0, 3.0)]
            cases += [('T-NR(3,2.2)', 0.05, 0.05, 0.05, T, 'zeros 0.5+-0.404+2.8596i') for T in (2.0, 1.5, 1.0, 0.5)]
            cases += [('zeta', 0.05, 0.1, 60.0, 84.0, ''), ('zeta', 0.05, 0.1, 1.0, 9.0, ''), ('zeta', 0.05, 0.05, 0.05, 1.5, ''), ('chi-3', 0.05, 0.1, 1.0, 9.0, '')]
        for (name, a, delta, tlo, thi, note) in cases:
            for m in ms:
                key = 'B %s a=%g d=%g [%g,%g] m=%d dps=%d' % (name, a, delta, tlo, thi, m, dps)
                if key in res: continue
                t0 = time.time()
                r = testB(pool, name, mp.mpf(str(a)), mp.mpf(str(delta)), mp.mpf(tlo), mp.mpf(thi), m, dps)
                r['note'] = note
                res[key] = r
                json.dump(res, open(out, 'w'))
                print(key, r, '[%.0fs]' % (time.time() - t0), flush=True)
