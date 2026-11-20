"""Combination 4: discrepancy of the Stieltjes transform, D(y) = sup_x |m_N(x + i y) - m_inf(x + i y)|, m_N = sum 1/(gamma - z).
Koksma form: m_N - m_inf = int R(t) / (t - z)^2 dt, R = N(t) - N_smooth(t), so y |m_N - m_inf| <= pi sup |R|.
Task ratio (normalised m = m_N / N): D_N N y_N / log gamma_N = sup_x y |m_N - m_inf| / log gamma_N.
  c4.py validate
  c4.py atom NAME          reading strip y_N = sqrt(2 pi / N) (far below the spacing): ladder over the first N zeros
  c4.py meso NAME [nmax]   mesoscopic strips y = c * spacing, c = 1/4 .. 64, in the unfolded variable; running sup over prefixes
  c4.py tables             full zero sets to height 2000: line Im z = y for a ladder of y, off-line pairs as poles
"""
import sys, json, math, os, numpy as np
import zf
from zf import xp, asnp, log
OUT = os.path.join(zf.HERE, 'out'); CS = (0.25, 1.0, 4.0, 16.0, 64.0)

def theta(t): return 0.5 * t * np.log(t / (2 * math.pi)) - 0.5 * t - math.pi / 8 + 1 / (48 * t)
def dtheta(T0, d):
    e = d / T0
    return 0.5 * d * math.log(T0 / (2 * math.pi)) + 0.5 * T0 * ((1 + e) * np.log1p(e) - e) + (1 / (48 * (T0 + d)) - 1 / (48 * T0))
def unfold(x, T0, q):
    if T0: return dtheta(T0, x) / math.pi
    if q == 1: return theta(x) / math.pi + 1
    return x / (2 * math.pi) * np.log(q * x / (2 * math.pi * math.e))

def block_delta(pos, a, ng, h, cs, n_below, lo=None, hi=None, smooth=None):
    """grid cells [a + k h, a + (k+1) h), k < ng. R = cell average of (number of points below t) - smooth(t); returns {c: Delta on the grid}, R.
    Delta(u + i c) = int R(v) / (v - u - i c)^2 dv by the Fourier multiplier -2 pi xi exp(-xi c) on xi > 0 (xi in cycles: angular 2 pi xi)."""
    k = np.floor((pos - a) / h).astype(np.int64); fr = 1.0 - ((pos - a) / h - k)
    cnt = np.bincount(k, minlength=ng).astype(np.float64); wf = np.bincount(k, weights=fr, minlength=ng)
    Nl = n_below + np.cumsum(cnt) - cnt
    cen = a + (np.arange(ng) + 0.5) * h
    R = Nl + wf - (cen if smooth is None else smooth(cen))
    if lo is not None: R[cen < lo] = 0.0
    if hi is not None: R[cen > hi] = 0.0
    Rg = xp.asarray(R); F = xp.fft.fft(Rg); w = 2 * math.pi * xp.fft.fftfreq(ng, h); out = {}
    for c in cs:
        mult = xp.where(w > 0, -2 * math.pi * w * xp.exp(-xp.clip(w, 0, None) * c), 0.0)
        out[c] = xp.fft.ifft(F * mult)
    return out, R

def meso(name, nmax=None, x=None, T0=0.0, q=1, tag=None, detrend=False, h=1 / 16, BU=2 ** 18, pad=2 ** 15):
    if x is None: x, T0, q = zf.load(name, nmax)
    u = unfold(x, T0, q)
    if detrend:      # empirical density at the scale of 4096 zeros (lists with missing zeros: on-line DH, heat)
        K = 4096; idx = np.arange(len(u)); knots = np.arange(0, len(u), K); kn = np.append(knots, len(u) - 1)
        sm = np.interp(idx, kn, u[kn]); u = idx + (u - sm) * 0 + (u - sm) / np.gradient(sm) * 1.0   # index + local residual in units of the local spacing
    off0 = float(np.median(np.arange(len(u)) + 0.5 - u)); u = u + off0      # R = N(v) - v centred
    n = len(u); res = dict(name=name, zeros=n, top=float(T0 + x[-1]), log_top=float(math.log(T0 + x[-1])), h=h, detrend=detrend, backend='gpu' if zf.GPU else 'cpu', prefixes=[])
    run = {c: 0.0 for c in CS}; arg = {c: None for c in CS}; supR = 0.0; marks = sorted(set([m * 10 ** k for k in range(5, 10) for m in (1, 3) if m * 10 ** k < n] + [n]))
    U0 = math.floor(u[0]); mi = 0
    log(name, 'zeros', n, 'grid per block', int((BU + 2 * pad) / h), 'planned GPU %.1f GB' % ((BU + 2 * pad) / h * 16 * 4 / 1e9))
    while U0 < u[-1]:
        a = U0 - pad; b = U0 + BU + pad; ng = int((b - a) / h)
        i0 = int(np.searchsorted(u, a)); i1 = int(np.searchsorted(u, b))
        D, R = block_delta(u[i0:i1], a, ng, h, CS, i0, lo=u[0], hi=u[-1])
        k0 = int(pad / h); k1 = ng - k0; cen = a + (np.arange(ng) + 0.5) * h
        valid = (cen[k0:k1] >= u[0] + 64) & (cen[k0:k1] <= u[-1] - 64)
        if valid.any():
            supR = max(supR, float(np.abs(R[k0:k1][valid]).max()))
            for c in CS:
                v = asnp(xp.abs(D[c][k0:k1])) * c; v = np.where(valid, v, 0); j = int(np.argmax(v))
                if v[j] > run[c]: run[c] = float(v[j]); arg[c] = float(cen[k0 + j])
        del D
        U0 += BU
        while mi < len(marks) and (U0 >= u[min(marks[mi], n) - 1] or U0 >= u[-1]):
            N = min(marks[mi], n); top = float(T0 + x[N - 1])
            res['prefixes'].append(dict(N=N, top=top, log_top=math.log(top), sup_abs_R=supR, koksma_bound_pi_supR=math.pi * supR,
                                        sup_c_Delta={str(c): run[c] for c in CS}, ratio_to_log_top={str(c): run[c] / math.log(top) for c in CS}))
            log(res['prefixes'][-1]); mi += 1
            if N == n: mi = len(marks)
    res['argsup_unfolded'] = {str(c): arg[c] for c in CS}
    json.dump(res, open(os.path.join(OUT, 'c4_meso_%s.json' % (tag or name)), 'w'), indent=1)
    return res

def atom(name, nmax=None, K=32):
    x, T0, q = zf.load(name, nmax); n = len(x); rows = []
    from c2 import ladder
    for N in ladder(n) + [n]:
        y = math.sqrt(2 * math.pi / N); M = N; best = 0.0; where = None; bs = 2 * 10 ** 7
        for s in range(0, M, bs):
            lo = max(0, s - K); hi = min(M, s + bs + K); X = xp.asarray(x[lo:hi]); m = hi - lo
            acc = xp.zeros(m, dtype=xp.complex128) + 1j / y
            for k in range(1, K + 1):
                acc[k:] += 1.0 / (X[:-k] - X[k:] - 1j * y); acc[:-k] += 1.0 / (X[k:] - X[:-k] - 1j * y)
            r = xp.asarray(zf.rho(T0 + x[lo:hi], q)); hw = 0.5 / r
            ii = xp.arange(m); a_ = X[xp.clip(ii - K, 0, m - 1)] - hw; b_ = X[xp.clip(ii + K, 0, m - 1)] + hw
            acc -= r * (xp.log(b_ - X - 1j * y) - xp.log(a_ - X - 1j * y))
            v = xp.abs(acc[K:m - K]) * y; j = int(xp.argmax(v))
            if float(v[j]) > best: best = float(v[j]); where = float(T0 + x[lo + K + j])
            del X, acc
        g = np.diff(x[:N]); gm = float(g.min())
        rows.append(dict(N=N, y_N=y, top=float(T0 + x[N - 1]), sup_y_Delta=best, at=where, closest_pair_formula=abs(1j + y / (gm - 1j * y)), g_min=gm, y_over_gmin=y / gm,
                         ratio_to_log_top=best / math.log(T0 + x[N - 1]), y_times_density=y * float(zf.rho(T0 + x[N - 1], q))))
        log(name, rows[-1])
    json.dump(dict(name=name, rows=rows), open(os.path.join(OUT, 'c4_atom_%s.json' % name), 'w'), indent=1)

def tables():
    res = {}; H = 2000.0
    for nm in ('ZETA', 'DH', 'HEAT--0.1', 'HEAT--0.5', 'TNR', 'EA-1_4'):
        if nm == 'EA-1_4': zon, _ = zf.table('ZETA'); on = np.array([]); off = [(0.25, float(g)) for g in zon]; q = 1
        else: on, off = zf.table(nm); q = 5 if nm == 'DH' else 1
        proj = np.sort(np.concatenate([on] + [np.array([g, g]) for b, g in off])) if off else on
        if nm == 'DH': smooth = lambda t: np.where(t > 1.3, t / (2 * math.pi) * np.log(np.maximum(5 * t / (2 * math.pi * math.e), 1e-9)) , 0.0)
        elif nm == 'TNR': smooth = lambda t: np.where(t > 8, theta(np.maximum(t, 8)) / math.pi + 1, 0.0) + 2 * (t * math.log(3) / (2 * math.pi))
        elif nm == 'EA-1_4': smooth = lambda t: 2 * np.where(t > 8, theta(np.maximum(t, 8)) / math.pi + 1, 0.0)
        else: smooth = lambda t: np.where(t > 8, theta(np.maximum(t, 8)) / math.pi + 1, 0.0)
        Nfull = len(proj); yN = math.sqrt(2 * math.pi / Nfull); bmax = max([b for b, g in off], default=0.0); rows = []
        for y in sorted({yN, 0.05, 0.1, 0.2, 0.3, 0.45, 0.6, 1.0, 2.0}):
            h = y / 16; pad = 400.0; a = -pad; ng = int((H + 2 * pad) / h)
            D, R = block_delta(proj, a, ng, h, (y,), 0, lo=0.0, hi=H, smooth=smooth)
            cen = a + (np.arange(ng) + 0.5) * h; d = asnp(D[y]); sel = (cen > 30) & (cen < H - 30)
            zz = cen[sel] + 1j * y; corr = np.zeros(len(zz), dtype=complex)
            for b, g in off: corr += 1 / (g + 1j * b - zz) + 1 / (g - 1j * b - zz) - 2 / (g - zz)
            tot = d[sel] + corr; j = int(np.argmax(abs(tot)))
            rows.append(dict(y=y, is_y_N=bool(y == yN), sup_y_Delta_on_line=float(y * abs(tot[j])), at=float(cen[sel][j]), sup_y_Delta_projected_only=float(y * abs(d[sel]).max()),
                             ratio_to_log_H=float(y * abs(tot[j]) / math.log(H)), poles_in_region_Im_z_ge_y=int(sum(b >= y for b, g in off)), sup_over_region='infinite' if bmax >= y else 'finite (= value on the line)'))
        res[nm] = dict(N_full=Nfull, online=len(on), offline_pairs=len(off), y_N=yN, max_offline_b=bmax, sup_abs_R_projected=float(np.abs(R[(cen > 30) & (cen < H - 30)]).max()), rows=rows)
        log(nm, json.dumps(res[nm])[:1600])
    json.dump(res, open(os.path.join(OUT, 'c4_tables.json'), 'w'), indent=1)

def validate():
    ok = True
    # lattice at the integers: Delta(z) = -pi cot(pi z) - i pi, sup_u c |Delta| = 2 pi c e^{-2 pi c} / (1 - e^{-2 pi c})
    pos = np.arange(0, 4096, dtype=float) + 0.5; h = 1 / 16; ng = 4096 * 16
    D, R = block_delta(pos, 0.0, ng, h, CS, 0, smooth=lambda t: t)
    for c in CS[:3]:
        got = float(asnp(xp.abs(D[c])).max() * c); want = 2 * math.pi * c * math.exp(-2 * math.pi * c) / (1 - math.exp(-2 * math.pi * c))
        good = abs(got - want) < 1e-2 * max(want, 1e-3); ok &= good; print('lattice c=%g: sup c|Delta| got %.6g want %.6g %s' % (c, got, want, 'ok' if good else 'FAIL'))
    # random points against the direct sum (periodic images of the FFT are far: compare in the middle)
    rng = np.random.default_rng(5); pos = np.sort(rng.uniform(1000, 3096, 2096)); ng = 4096 * 16
    D, R = block_delta(pos, 0.0, ng, h, CS, 0, lo=1000, hi=3096, smooth=lambda t: np.clip(t - 1000, 0, 2096))
    cen = (np.arange(ng) + 0.5) * h
    for c in (0.25, 4.0):
        for u in (1500.3, 2047.77, 2600.1):
            z = u + 1j * c; direct = (1 / (pos - z)).sum() - (np.log(3096 - z) - np.log(1000 - z))
            got = np.interp(u, cen, asnp(D[c]).real) + 1j * np.interp(u, cen, asnp(D[c]).imag)
            good = abs(got - direct) < 8e-2 * max(1, abs(direct)); ok &= good; print('random c=%g u=%g: FFT %.5f%+.5fi direct %.5f%+.5fi %s' % (c, u, got.real, got.imag, direct.real, direct.imag, 'ok' if good else 'FAIL'))
    print('ALL OK' if ok else 'SOME FAILED')

if __name__ == '__main__':
    m = sys.argv[1]
    if m == 'validate': validate()
    elif m == 'atom': atom(sys.argv[2], int(float(sys.argv[3])) if len(sys.argv) > 3 else None)
    elif m == 'meso': meso(sys.argv[2], int(float(sys.argv[3])) if len(sys.argv) > 3 and float(sys.argv[3]) > 0 else None, detrend=('detrend' in sys.argv), tag=sys.argv[2] + ('_detrend' if 'detrend' in sys.argv else ''))
    elif m == 'tables': tables()
