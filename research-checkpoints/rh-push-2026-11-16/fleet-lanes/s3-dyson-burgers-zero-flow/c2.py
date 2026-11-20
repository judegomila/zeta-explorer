"""Combination 2: renormalised fold-reading amplitude C_ren = y_N^{3/2} |m'(z0*)|, y_N = sqrt(2 pi / N), m(z) = sum 1/(gamma - z).
  c2.py model                 the model cusp |x|^{-1/2} of the source (reproduces the band [2.2215, 2.2510])
  c2.py list NAME             ladder over the first N zeros of a list held in memory: reading (a) z0* = midpoint of the minimal pair + i y_N,
                              reading (b) sup over x, reading (c) smooth density
  c2.py giga                  first N zeros up to 1e9 (zeta8 + generated segments), streamed
  c2.py tables                full zero sets to height 2000 (off-line pairs included in m)
"""
import sys, json, math, os, glob, numpy as np
import zf
from zf import xp, asnp, log
OUT = os.path.join(zf.HERE, 'out'); CPS = math.pi / math.sqrt(2); BAND = (2.2215, 2.2510)

def model(N, panels=8000):
    eps = math.sqrt(2 * math.pi / N); u = np.linspace(0, 1, panels + 1); w = np.ones(panels + 1); w[1:-1:2] = 4; w[2:-1:2] = 2
    B = lambda sgn: (w / (1j * eps - sgn * u * u) ** 2).sum() / panels / 3
    return eps ** 1.5 * abs(-2 * (B(1) + B(-1)))

def reading_a(xl, i, y, extra=None):
    """xl: ordinates near the pair (i, i+1); returns y^1.5 |m'(mid + i y)| and pieces"""
    a = xl[i]; b = xl[i + 1]; z0 = 0.5 * (a + b) + 1j * y
    S2 = (1.0 / (xl - z0) ** 2).sum()
    if extra is not None and len(extra): S2 += (1.0 / (extra - z0) ** 2).sum()
    g = b - a
    return y ** 1.5 * abs(S2), y ** 1.5 * 8 / g ** 2, g

def ladder(nmax): return [N for N in (10 ** k * m for k in range(3, 10) for m in (1, 2, 3, 5, 7)) if N <= nmax]

def do_list(name, x=None, T0=0.0, q=1, extra=None, Ns=None, tag=None):
    if x is None: x, T0, q = zf.load(name)
    n = len(x); rows = []
    g = np.diff(x)
    for N in (Ns or ladder(n) + ([n] if n not in ladder(n) else [])):
        y = math.sqrt(2 * math.pi / N); i = int(np.argmin(g[:N - 1]))
        lo = max(0, i - 2000); hi = min(N, i + 2002)
        Ca_loc, Cpair, gm = reading_a(x[lo:hi], i - lo, y, extra)
        Ca_all = reading_a(x[:N], i, y, extra)[0] if N <= 10 ** 7 else None
        # reading (b): sup over x on the line Im z = y_N; near a zero the atom dominates: y^1.5 |m'| = y^-1/2 |1 + y^2 sum_{j != i} 1/(x_j - x_i - i y)^2|
        K = 8; M = min(N, 2 * 10 ** 7); X = xp.asarray(x[:M]); acc = xp.zeros(M, dtype=xp.complex128) - 1.0 / y ** 2
        for k in range(1, K + 1):
            acc[k:] += 1.0 / (X[:-k] - X[k:] - 1j * y) ** 2; acc[:-k] += 1.0 / (X[k:] - X[:-k] - 1j * y) ** 2
        Cb = float(y ** 1.5 * xp.abs(acc).max()); del X, acc
        # reading (c): smooth density rho = log(q t / 2 pi) / 2 pi on [x_1, x_N], at the middle of the range
        t1 = T0 + x[0]; tN = T0 + x[N - 1]; xm = 0.5 * (t1 + tN); z = xm + 1j * y
        mp_inf = -zf.rho(tN, q) / (tN - z) + zf.rho(t1, q) / (t1 - z) + (1 / (2 * math.pi * xm)) * (np.log((tN - z) / (t1 - z)))
        s = gm * zf.rho(T0 + x[i], q)
        rows.append(dict(N=N, y_N=y, top=float(tN), g_min=float(gm), s_min=float(s), C_a=float(Ca_loc), C_a_allN=Ca_all, C_a_pair_formula=float(Cpair), C_b_sup=Cb,
                         C_b_formula=y ** -0.5, C_c_smooth=float(y ** 1.5 * abs(mp_inf)), in_band_a=bool(BAND[0] <= Ca_loc <= BAND[1]), model_cusp=float(model(N))))
        log(name, rows[-1])
    out = dict(name=name, band=BAND, C_PS=CPS, rows=rows)
    json.dump(out, open(os.path.join(OUT, 'c2_%s.json' % (tag or name)), 'w'), indent=1)
    return out

def scan(name, per_decade=400):
    """C_a on a fine grid of N: fraction of N with C_a inside the band, and the local sensitivity d log C_a / d log N"""
    x, T0, q = zf.load(name); n = len(x); g = np.diff(x)
    run = np.minimum.accumulate(g); newmin = np.concatenate([[True], run[1:] < run[:-1]]); idx = np.maximum.accumulate(np.where(newmin, np.arange(len(g)), 0))
    Ns = np.unique(np.round(10 ** np.arange(3, math.log10(n), 1 / per_decade)).astype(np.int64)); C = np.empty(len(Ns))
    for t, N in enumerate(Ns):
        i = int(idx[N - 2]); lo = max(0, i - 200); hi = min(int(N), i + 202)
        C[t] = reading_a(x[lo:hi], i - lo, math.sqrt(2 * math.pi / N))[0]
    inb = (C >= BAND[0]) & (C <= BAND[1])
    res = dict(name=name, grid_points=len(Ns), N_range=[int(Ns[0]), int(Ns[-1])], fraction_in_band=float(inb.mean()), n_in_band=int(inb.sum()),
               C_quantiles={str(p): float(np.quantile(C, p)) for p in (0.01, 0.1, 0.5, 0.9, 0.99)}, C_min=float(C.min()), C_max=float(C.max()),
               median_abs_dlogC_dlogN=float(np.median(np.abs(np.diff(np.log(np.maximum(C, 1e-300))) / np.diff(np.log(Ns))))),
               per_decade_fraction_in_band={('1e%d' % k): float(inb[(Ns >= 10 ** k) & (Ns < 10 ** (k + 1))].mean()) for k in range(3, int(math.log10(n)) + 1) if ((Ns >= 10 ** k) & (Ns < 10 ** (k + 1))).any()})
    log(res); json.dump(res, open(os.path.join(OUT, 'c2_scan_%s.json' % name), 'w'), indent=1)

def giga():
    """first N zeros for N up to 1e9: minimal gap of each prefix (streamed), reading (a) from the 4000 neighbours of the minimal pair"""
    files = [os.path.join(zf.BASE, zf.REG['zeta8'][0])] + sorted(glob.glob(os.path.join(zf.BASE, 's3-dyson-burgers-zero-flow/data/z9seg/seg_*.npy')))
    Ns = ladder(10 ** 9); best = (np.inf, None); rows = []; count = 0; prev_tail = np.empty(0); li = 0
    for f in files:
        a = np.load(f, mmap_mode='r'); log('file', f, len(a))
        for s in range(0, len(a), 10 ** 7):
            c = np.concatenate([prev_tail, np.array(a[s:s + 10 ** 7])]); off = count - len(prev_tail)   # c[0] has global index off
            while True:
                lim = Ns[li] if li < len(Ns) else None
                top = min(len(c), lim - off) if lim else len(c)     # use zeros with global index < lim
                gg = np.diff(c[:top])
                if len(gg):
                    k = int(np.argmin(gg))
                    if gg[k] < best[0]: best = (float(gg[k]), dict(i=off + k, at=float(c[k]), nb=np.array(c[max(0, k - 2000):k + 2002]), k=k - max(0, k - 2000)))
                if lim and off + len(c) >= lim:
                    N = lim; y = math.sqrt(2 * math.pi / N); b = best[1]
                    Ca, Cp, gm = reading_a(b['nb'], b['k'], y)
                    rows.append(dict(N=N, y_N=y, top=float(c[lim - off - 1]), g_min=gm, s_min=gm * float(zf.rho(b['at'])), at=b['at'], C_a=float(Ca), C_a_pair_formula=float(Cp),
                                     C_b_formula=y ** -0.5, in_band_a=bool(BAND[0] <= Ca <= BAND[1]), model_cusp=float(model(N))))
                    log(rows[-1]); li += 1
                    if li >= len(Ns): break
                else: break
            count = off + len(c); prev_tail = c[-2100:]
            if li >= len(Ns): break
        if li >= len(Ns): break
    json.dump(dict(name='zeta first N (streamed)', total_read=count, rows=rows, band=BAND, C_PS=CPS), open(os.path.join(OUT, 'c2_giga.json'), 'w'), indent=1)

def tables():
    res = {}
    zon, _ = zf.table('ZETA')
    for nm in ('ZETA', 'DH', 'HEAT--0.1', 'HEAT--0.5', 'TNR'):
        on, off = zf.table(nm); q = 5 if nm == 'DH' else 1
        extra = np.array([complex(g, s * b) for b, g in off for s in (1, -1)]) if off else None
        rows = []
        for N in [100, 300, 1000, len(on)]:
            if N > len(on): continue
            top = on[N - 1]; ex = extra[np.abs(extra.real) <= top] if extra is not None else None
            Nfull = N + (len(ex) if ex is not None else 0); y = math.sqrt(2 * math.pi / Nfull)
            i = int(np.argmin(np.diff(on[:N])))
            Ca, Cp, gm = reading_a(on[:N], i, y, ex); Ca_on = reading_a(on[:N], i, y)[0]
            bmax = float(np.abs(ex.imag).max()) if ex is not None and len(ex) else 0.0
            rows.append(dict(N_online=N, N_full=Nfull, y_N=y, g_min=float(gm), C_a_full=float(Ca), C_a_online_only=float(Ca_on), C_a_pair_formula=float(Cp),
                             max_offline_b=bmax, sup_over_Im_z_ge_y='infinite: pole of m\' at an off-line zero with b >= y_N' if bmax >= y else 'finite', in_band=bool(BAND[0] <= Ca <= BAND[1])))
        res[nm] = rows; log(nm, rows)
    a = 0.25; y = math.sqrt(2 * math.pi / (2 * len(zon)))
    res['EA-1_4'] = dict(note='all zeros at gamma +- i/4: no real pair, reading (a) undefined; m\' has poles at height 1/4 >= y_N = %.4f for N >= %d, so the sup reading is infinite' % (y, int(2 * math.pi / a ** 2) + 1))
    json.dump(res, open(os.path.join(OUT, 'c2_tables.json'), 'w'), indent=1)

if __name__ == '__main__':
    m = sys.argv[1]
    if m == 'model':
        r = {str(int(N)): model(N) for N in (1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7, 1e8, 1e9)}; log(r); log('source: 2.250959 at 1e3, 2.221471 at 1e7; C_PS', CPS)
        json.dump(r, open(os.path.join(OUT, 'c2_model.json'), 'w'), indent=1)
    elif m == 'list': do_list(sys.argv[2])
    elif m == 'giga': giga()
    elif m == 'scan': scan(sys.argv[2])
    elif m == 'tables': tables()
