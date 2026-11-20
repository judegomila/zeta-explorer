"""Combination 3. Polymath approximant f_t(x + iy) (arXiv:1904.12438v2 Theorem 1.3 / eq. (14), normalisation of
dbn-lambda-below-015-research/research/twistor_phase_freeze/screen_direct_ft.py) with coefficients a(n):
  f = sum_{n<=N} a(n) b_n^t n^{-s*} + gamma sum_{n<=N} conj(a(n)) b_n^t n^{y - conj(s*) - kappa},  b_n^t = exp((t/4) log^2 n),
and its Euler-mollified value E f. For each window N the sums are evaluated on a uniform x-grid of M points (step HX) by NUFFT.
Usage: c3_heat.py NWIN M [HX] [mode]      mode 'validate': small-N comparison against the source formula evaluated directly"""
import sys, os, json, math, time, cmath, numpy as np, mpmath as mp
import core
from core import *
NWIN = int(sys.argv[1]); M = int(sys.argv[2]); HX = float(sys.argv[3]) if len(sys.argv) > 3 else 0.25
MODE = sys.argv[4] if len(sys.argv) > 4 else 'run'
TS = (0.16, 0.13, 0.10, 0.05, 0.0); YS = (math.sqrt(87677 / 2500000), 0.5, 1.0)
PR = (2, 3, 5, 7, 11, 13); QN, CN, AE = 3, 2.2, 0.25
mp.mp.dps = 45
def alpha(s): return 1 / (2 * s) + 1 / (s - 1) + mp.log(s / (2 * mp.pi)) / 2
def alpha_p(s): return -1 / (2 * s * s) - 1 / (s - 1) ** 2 + 1 / (2 * s)
def alpha_pp(s): return 1 / s**3 + 2 / (s - 1) ** 3 - 1 / (2 * s * s)
def log_m0(s): return mp.log(s) + mp.log(s - 1) - (s / 2) * mp.log(mp.pi) + mp.log(mp.sqrt(2 * mp.pi) / 16) + (s / 2 - mp.mpf(1) / 2) * mp.log(s / 2) - s / 2
def log_mt(s, t): a = alpha(s); return log_m0(s) + (mp.mpf(t) / 4) * a * a
def beta(s, t): a = alpha(s); return a + (mp.mpf(t) / 2) * a * alpha_p(s)
def beta_p(s, t): a = alpha(s); ap = alpha_p(s); return ap + (mp.mpf(t) / 2) * (ap * ap + a * alpha_pp(s))
def x_n(n, t): return 4 * math.pi * (n * n - t / 16)

def centre(xc, y, t):
    """mp values at the centre of the sample range"""
    xc = mp.mpf(xc); y = mp.mpf(y)
    s0 = mp.mpc(1 + y, -xc) / 2; aarg = mp.mpc(1 - y, xc) / 2; barg = mp.mpc(1 + y, xc) / 2
    sst = s0 + (mp.mpf(t) / 2) * alpha(s0)
    kap = (mp.mpf(t) / 2) * (alpha(aarg) - alpha(barg))
    lg = log_mt(aarg, t) - log_mt(s0, t)
    g1 = mp.mpc(0, 0.5) * (beta(aarg, t) + beta(s0, t)); g2 = (beta_p(s0, t) - beta_p(aarg, t)) / 4
    return sst, kap, lg, g1, g2

def twopi_red(v):
    return float(v - 2 * mp.pi * mp.floor(v / (2 * mp.pi)))

def build_coefs(N):
    """dict name -> numpy complex128 (index n-1), n <= N"""
    n = np.arange(1, N + 1); pr = primes_upto(N)
    out = {'ZETA': np.ones(N, dtype=np.complex128), 'LCHI': CHI5[n % 5].copy(), 'DH': DHPER[n % 5].astype(np.complex128)}
    om = np.zeros(N + 1, dtype=np.int8); rng = np.random.default_rng(20261119)
    sg = rng.integers(0, 2, len(pr)); un = rng.uniform(0, 2 * math.pi, len(pr))
    phs = np.zeros(N + 1); phu = np.zeros(N + 1)
    ea = np.ones(N + 1)
    for i, p in enumerate(pr):
        p = int(p); pk = p; k = 1
        prev = 1.0
        while pk <= N:
            om[pk::pk] += 1; phs[pk::pk] += math.pi * sg[i]; phu[pk::pk] += un[i]
            cur = sum(p ** (AE * (2 * j - k)) for j in range(k + 1))
            ea[pk::pk] *= cur / prev; prev = cur
            pk *= p; k += 1
    out['LIOU'] = (1.0 - 2.0 * (om[1:] % 2)).astype(np.complex128)
    out['SGN'] = np.cos(phs[1:]).round().astype(np.complex128)
    out['U'] = np.exp(1j * phu[1:])
    out['EA'] = ea[1:].astype(np.complex128)
    out['TNR'] = (1.0 + CN * math.sqrt(QN) * (n % QN == 0) + QN * (n % (QN * QN) == 0)).astype(np.complex128)
    loc = {'sg': {int(p): 1.0 - 2.0 * sg[i] for i, p in enumerate(pr[:6])}, 'un': {int(p): cmath.exp(1j * un[i]) for i, p in enumerate(pr[:6])}}
    return out, loc

def smooth13(D):
    return [d for d in range(1, D + 1) if all_smooth(d)]
def all_smooth(d):
    for p in PR:
        while d % p == 0: d //= p
    return d == 1

def mollifiers(u, heat_p, loc, dhinv, dvals):
    """u[p] = p^{-s*} on the grid (xp), heat_p[p] = b_p^t. Returns dict function -> dict name -> xp array"""
    U = {p: heat_p[p] * u[p] for p in PR}
    def prod(cf):
        v = 1
        for p in PR: v = v * (1 - cf(p) * U[p])
        return v
    P13 = prod(lambda p: 1.0)
    out = {'ZETA': {'P13': P13}, 'LCHI': {'own': prod(lambda p: CHI5[p % 5])}, 'LIOU': {'own': prod(lambda p: -1.0)},
           'SGN': {'own': prod(lambda p: loc['sg'][p])}, 'U': {'own': prod(lambda p: loc['un'][p])}}
    v = 1
    for p in PR:
        if p == QN: v = v * (1 - U[p]) / (1 + CN * math.sqrt(QN) * U[p] + QN * U[p] ** 2)
        else: v = v * (1 - U[p])
    out['TNR'] = {'own': v, 'P13': P13}
    v = 1
    for p in PR: v = v * (1 - p ** AE * U[p]) * (1 - p ** (-AE) * U[p])
    out['EA'] = {'own': v, 'P13': P13}
    out['DH'] = {'inv': dvals, 'chi': out['LCHI']['own'], 're': prod(lambda p: CHI5[p % 5].real)}
    return out

def run_window(N, frac, coefs, loc, dh_inv, res, direct_check=None):
    logs_ld = lnn_ld(N); ln = xp.asarray(logs_ld.astype(np.float64))
    tau = xp.arange(-M // 2, M // 2) * HX
    for t in TS:
        left = x_n(N, t); right = x_n(N + 1, t)
        xc = left + frac * (right - left)
        xc = float(min(max(xc, left + M * HX / 2 + 2), right - M * HX / 2 - 2))
        base_ph = xp.asarray(np.fmod((LD(xc) / 2) * logs_ld, TWOPI_LD).astype(np.float64))     # (xc/2) ln n mod 2 pi
        heat = (t / 4) * ln * ln
        for y in YS:
            sst, kap, lg, g1, g2 = centre(xc, y, t)
            dIm = float(sst.imag + mp.mpf(xc) / 2)                    # Im s* = -xc/2 + dIm
            re1 = float(sst.real)
            # term 1: exp(heat - s* ln n), s*(x) = s*c - (i/2)(x - xc)
            w1 = xp.exp(heat - re1 * ln) * xp.exp(1j * (base_ph - dIm * ln))
            # term 2: gamma exp(heat + y ln n - (conj(s*) + kappa) ln n)
            re2 = float(y - sst.real - kap.real); im2 = dIm - float(kap.imag)          # -(Im conj(s*c) + Im kap) = -(xc/2 - dIm + Im kap)
            w2 = xp.exp(heat + re2 * ln) * xp.exp(1j * (-base_ph + im2 * ln))
            lgc = complex(lg.real, twopi_red(lg.imag))
            g1c = complex(g1); g2c = complex(g2)
            gam = xp.exp(lgc + tau * (1j * g1c.imag) + tau * g1c.real + g2c * tau * tau / 2)
            u = {}; heat_p = {}
            for p in PR:
                c0 = complex(mp.exp(-sst * mp.log(p)))
                u[p] = c0 * xp.exp(1j * tau * (math.log(p) / 2)); heat_p[p] = math.exp((t / 4) * math.log(p) ** 2)
            dvals = 0
            for d, bd in dh_inv:
                c0 = complex(mp.exp(-sst * mp.log(d)) * mp.exp((mp.mpf(t) / 4) * mp.log(d) ** 2))
                dvals = dvals + (bd * c0) * xp.exp(1j * tau * (math.log(d) / 2))
            mol = mollifiers(u, heat_p, loc, dh_inv, dvals)
            for fname, a in coefs.items():
                ag = xp.asarray(a[:N])
                A = nufft_sym(-ln / 2, ag * w1, HX, M)
                B = gam * nufft_sym(ln / 2, xp.conj(ag) * w2, HX, M)
                f = A + B
                if direct_check is not None: direct_check(N, t, y, xc, fname, a, asnp(f), asnp(A))
                key = '%g|%.4f|%s' % (t, y, fname)
                r = res.setdefault(key, {})
                def put(name, v):
                    e = r.setdefault(name, {'min_abs': 1e300, 'min_re': 1e300, 'max_abs': 0.0, 'neg': 0, 'cnt': 0, 'sum_abs': 0.0, 'argN': None})
                    ma = float(xp.abs(v).min()); mr = float(v.real.min())
                    if mr < e['min_re']: e['argN'] = N
                    e['min_abs'] = min(e['min_abs'], ma); e['min_re'] = min(e['min_re'], mr); e['max_abs'] = max(e['max_abs'], float(xp.abs(v).max()))
                    e['neg'] += int((v.real <= 0).sum()); e['cnt'] += M; e['sum_abs'] += float(xp.abs(v).sum())
                    e.setdefault('perN', []).append([N, ma, mr])
                put('f', f); put('A', A)
                for mname, mv in mol[fname].items():
                    put('E_' + mname + '*f', mv * f); put('E_' + mname + '*A', mv * A)
                del A, B, f, ag
            del w1, w2, gam, u, mol

def main():
    if MODE == 'validate':
        Ns = [2000, 5000]
    else:
        base = [690988, 850000, 1075000, 2000000, 4050000]
        Ns = sorted(set(base + [int(v) for v in np.exp(np.linspace(math.log(690988), math.log(4050000), max(NWIN - 5, 0) + 2))[1:-1]]))
    Nmax = max(Ns)
    print('windows %d (N %d..%d) M %d hx %g  t %s  y %s  gpu %s extended %s' % (len(Ns), Ns[0], Ns[-1], M, HX, TS, YS, core.GPU, core.EXT), flush=True)
    announce('coefficient tables 8 x complex128[%d]' % Nmax, 8 * 16 * Nmax)
    announce('NUFFT spread chunk 2^20 x 23 x 3 float64 + FFT grid complex128[%d]' % (2 * M), (1 << 20) * 23 * 24 + 16 * 2 * M * 3)
    coefs, loc = build_coefs(Nmax)
    # Dirichlet inverse of the DH coefficients on 13-smooth d <= 30030
    D = 30030; a = np.zeros(D + 1, dtype=np.complex128); a[1:] = DHPER[np.arange(1, D + 1) % 5]
    binv = dirichlet_inverse(a, D)
    dh_inv = [(d, complex(binv[d])) for d in smooth13(D) if binv[d] != 0]
    print('DH truncated inverse: %d terms (13-smooth d <= %d), max |coefficient| %.2f' % (len(dh_inv), D, max(abs(b) for d, b in dh_inv)), flush=True)
    res = {}; t0 = time.time(); chk = None
    if MODE == 'validate':
        sys.path.insert(0, os.environ.get('S2_SRC', '~/Documents/GitHub/dbn-lambda-below-015-research/research/twistor_phase_freeze'))
        import screen_direct_ft as src
        worst = [0.0, 0.0]
        def chk(N, t, y, xc, fname, a, f, A):
            if fname not in ('ZETA', 'DH', 'U'): return
            logs = np.log(np.arange(1, N + 1, dtype=np.float64))
            for i in (0, M // 3, M - 1):
                x = xc + (i - M // 2) * HX
                s0 = (1 + y - 1j * x) / 2; s_star = s0 + (t / 2) * src.alpha(s0); aarg = (1 - y + 1j * x) / 2; barg = (1 + y + 1j * x) / 2
                kappa = (t / 2) * (src.alpha(aarg) - src.alpha(barg)); gamma = cmath.exp(src.log_mt(aarg, t) - src.log_mt(s0, t))
                heat = (t / 4) * logs * logs
                ref = np.sum(a[:N] * np.exp(heat - s_star * logs) + np.conj(a[:N]) * gamma * np.exp(heat + y * logs - (np.conj(s_star) + kappa) * logs))
                worst[0] = max(worst[0], abs(ref - f[i]) / abs(ref))
                if fname == 'ZETA':
                    f2, ef = src.evaluate_value(x, y, t, logs, PR)
                    worst[1] = max(worst[1], abs(f2 - f[i]) / abs(f2))
    for i, N in enumerate(Ns):
        run_window(N, (0.137 + 0.618 * i) % 1.0, coefs, loc, dh_inv, res, chk)
        print('window %d N %d done %.0fs' % (i, N, time.time() - t0), flush=True)
        if MODE != 'validate': json.dump(res, open('c3_result_W%d_M%d.json' % (len(Ns), M), 'w'))
    if MODE == 'validate':
        print('max relative difference grid vs direct source formula with coefficients: %.2e ; vs source evaluate_value (zeta): %.2e' % (worst[0], worst[1]))
    print('\nt | y | function | quantity : min modulus, min real part, fraction of samples with real part <= 0, mean modulus')
    for key in res:
        for name, e in res[key].items():
            if name.startswith('E_') and name.endswith('*f') or name == 'f':
                print('%s | %-18s : %.4f %.4f %.2e %.4f' % (key, name, e['min_abs'], e['min_re'], e['neg'] / e['cnt'], e['sum_abs'] / e['cnt']))
main()
