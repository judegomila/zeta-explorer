#!/usr/bin/env python3
"""Combination 2: negative set of w_P(t) = arch(t) - sum_{n <= P} 2 Re(c(n) n^(-1/2) n^(-it)) on [0, T], and the crude positivity
certificates built from it for the band a = (1/2) log(P+), P+ = first n > P with c(n) != 0:
  bathtub floor   (|phihat|^2 <= 2a ||phi||^2, mass 2pi): (a/pi) * integral of the symbol over its lowest set of total measure pi/a
  concentration   mu_m = largest eigenvalue of 1_N B_a 1_N, N = {symbol < m}, B_a = projection onto supp in [-a,a]; certificate needs mu_m (m + D) / m < 1, D = depth
both for the plain symbol w (whole space, no pole term) and for sigma_2 = (t^2 + 1/4)^2 w (pole-free subspace g = phi/4 - phi'').
usage: c2_windows.py OBJ [T dt PMAX OUT]"""
import sys, math, time, json, os
import numpy as np
import s6lib
try:
    if os.environ.get('S6_NUMPY'): raise ImportError
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=int(float(os.environ.get('S6_POOL_GB', '20')) * 1024**3)); GPU = True
except Exception:
    import numpy as xp; GPU = False
OBJ = sys.argv[1]; T = float(sys.argv[2]) if len(sys.argv) > 2 else 1e4; dt = float(sys.argv[3]) if len(sys.argv) > 3 else 0.005
PMAX = int(float(sys.argv[4])) if len(sys.argv) > 4 else 10 ** 6; OUT = sys.argv[5] if len(sys.argv) > 5 else 'out2'
os.makedirs(OUT, exist_ok=True); t0 = time.time()
o = s6lib.obj(OBJ, PMAX + 2000 if OBJ != 'tnr' else PMAX + 2000)
nn = o['n']; cc = o['c']; herm = o['hermitian']
NT = int(round(T / dt)) + 1; t = dt * np.arange(NT)
PL = [P for P in (2, 3, 5, 7, 10, 30, 100, 300, 1000, 3000, 10 ** 4, 10 ** 5, 10 ** 6) if P <= PMAX]
if OBJ == 'p2only': PL = [2, PMAX]
BATCH = max(1, int(2.0e9 / (NT * 8)))
print(f'[{OBJ}] gpu={GPU} T={T} dt={dt} NT={NT} terms<=PMAX: {int(np.sum(nn <= PMAX))}; planned: batch {BATCH} terms x {NT} points = {BATCH*NT*8/2**30:.2f} GB; FFT grid 2^k >= {2*NT}', flush=True)
ar = s6lib.arch(o, t)
tg = xp.asarray(t); C = xp.zeros(NT); Sn = xp.zeros(NT) if herm else None
NF = 1 << int(math.ceil(math.log2(2 * NT + 16)))
xk = 2 * math.pi * xp.fft.fftfreq(NF, d=dt)
def conc(mask2, a, steps=100):
    """largest eigenvalue of 1_N B_a 1_N; mask2: boolean array of length 2*NT-1 on t = -T..T"""
    if not bool(mask2.any()): return 0.0
    M = xp.zeros(NF); M[:mask2.shape[0]] = mask2
    band = (xp.abs(xk) <= a)
    def op(u): return M * xp.fft.ifft(band * xp.fft.fft(M * u)).real
    rs = xp.random.RandomState(7); q = M * rs.standard_normal(NF); q /= xp.linalg.norm(q)
    al = []; be = []; qp = None
    for j in range(steps):
        wv = op(q); a_ = float(xp.vdot(q, wv)); al.append(a_); wv = wv - a_ * q
        if qp is not None: wv -= be[-1] * qp
        b_ = float(xp.linalg.norm(wv))
        if b_ < 1e-13: break
        be.append(b_); qp = q; q = wv / b_
    k = len(al); Tm = np.diag(al) + np.diag(be[:k - 1], 1) + np.diag(be[:k - 1], -1)
    return float(np.linalg.eigvalsh(Tm)[-1])
def two_sided(wp, wm): return np.concatenate([wm[:0:-1], wp])      # t = -T .. T
def stats(sym2, a, label):
    """sym2 on t = -T..T (numpy). returns dict"""
    neg = sym2 < 0
    d = np.diff(neg.astype(np.int8)); starts = np.where(d == 1)[0] + 1; ends = np.where(d == -1)[0] + 1
    if neg[0]: starts = np.r_[0, starts]
    if neg[-1]: ends = np.r_[ends, len(neg)]
    widths = (ends - starts) * dt
    cs = np.concatenate([[0.0], np.cumsum(np.where(neg, sym2, 0.0))]); mins = np.minimum.reduceat(sym2, starts) if len(starts) else np.array([])
    D = float(-sym2.min()) if neg.any() else 0.0
    srt = np.sort(sym2); nb = int(round((math.pi / a) / dt)); nb = min(nb, len(srt))
    bath = (a / math.pi) * float(np.sum(srt[:nb])) * dt
    r = dict(label=label, n_windows=int(len(starts)), measure=float(neg.sum() * dt), frac=float(neg.mean()), width_max=float(widths.max()) if len(widths) else 0.0,
             width_median=float(np.median(widths)) if len(widths) else 0.0, depth=D, argmin=float((np.argmin(sym2) - (NT - 1)) * dt),
             median_window_min=float(np.median(mins)) if len(mins) else 0.0, bathtub_floor=bath, bathtub_measure=nb * dt)
    lev = []
    if D > 0:
        for f in ((0.0, 0.1, 1.0) if label == 'sigma2' else tuple(x / D for x in (0.0, 1.0, 10.0))):   # zeta and p2only were run with the longer lists (0, .01, .03, .1, .3, 1, 3) and (0, .1, .3, 1, 3, 10)
            m = f * D; mu = conc(xp.asarray(sym2 < m), a)
            lev.append(dict(level_over_depth=f, mu=mu, one_minus_mu=1 - mu, needed=(m / (m + D)), ratio=(mu * (m + D) / m if m > 0 else None), floor=m * (1 - mu) - D * mu))
    r['levels'] = lev; r['best_ratio'] = min([l['ratio'] for l in lev if l['ratio'] is not None], default=None)
    r['best_floor'] = max([l['floor'] for l in lev], default=None)
    return r
res = []; pos = 0; order = np.argsort(nn); nn = nn[order]; cc = cc[order]
for P in PL:
    sel = np.where((nn <= P) & (np.arange(len(nn)) >= pos))[0]
    for b in range(0, len(sel), BATCH):
        ix = sel[b:b + BATCH]; ln = xp.asarray(np.log(nn[ix].astype(float)))
        amp = xp.asarray(2 * cc[ix] / np.sqrt(nn[ix].astype(float)))
        ph = xp.outer(ln, tg)
        C += (amp.real[:, None] * xp.cos(ph)).sum(axis=0)
        if herm: Sn += (amp.imag[:, None] * xp.sin(ph)).sum(axis=0)
        del ph
    if len(sel): pos = int(sel[-1]) + 1
    nxt = int(nn[pos]) if pos < len(nn) else None
    if OBJ == 'p2only': nxt = 3
    a = 0.5 * math.log(nxt)
    Cn = xp.asnumpy(C) if GPU else C.copy(); Sv = (xp.asnumpy(Sn) if GPU else Sn.copy()) if herm else 0.0
    wp = ar - (Cn + Sv); wm = ar - (Cn - Sv)
    w2 = two_sided(wp, wm); t2 = np.concatenate([-t[:0:-1], t]); s2 = (t2 ** 2 + 0.25) ** 2 * w2
    # one-sided window anatomy on [0, T] (the source convention)
    neg = wp < 0; d = np.diff(neg.astype(np.int8)); st = np.where(d == 1)[0] + 1; en = np.where(d == -1)[0] + 1
    if neg[0]: st = np.r_[0, st]
    if neg[-1]: en = np.r_[en, len(neg)]
    first = [dict(lo=float(st[i] * dt), hi=float(en[i] * dt), width=float((en[i] - st[i]) * dt), min=float(wp[st[i]:en[i]].min())) for i in range(min(8, len(st)))]
    row = dict(obj=OBJ, P=P, next_n=nxt, a=a, n_terms=int(pos), w0=float(wp[0]), windows_0T=int(len(st)), measure_0T=float(neg.sum() * dt), first_windows=first,
               plain=stats(w2, a, 'w'), sigma2=stats(s2, a, 'sigma2'), seconds=time.time() - t0)
    res.append(row)
    pl, sg = row['plain'], row['sigma2']
    print(f"RESULT2 {OBJ} P={P} (2a = log {nxt} = {2*a:.4f}): w(0) = {row['w0']:+.4f}; windows on [0,T]: {row['windows_0T']}, measure {row['measure_0T']:.1f} ({pl['frac']*100:.1f}%), widths max/median {pl['width_max']:.3f}/{pl['width_median']:.3f}, depth {-pl['depth']:.3f} at t = {pl['argmin']:.2f}, median window min {pl['median_window_min']:.3f}; "
          f"plain: mu0 = {pl['levels'][0]['mu'] if pl['levels'] else 0:.10f}, bathtub {pl['bathtub_floor']:.4g}, best ratio {pl['best_ratio']}, best floor {pl['best_floor']}; "
          f"sigma2: depth {-sg['depth']:.6g} at {sg['argmin']:.2f}, bathtub {sg['bathtub_floor']:.8g}, mu0 = {sg['levels'][0]['mu'] if sg['levels'] else 0:.10f}, best ratio {sg['best_ratio']}, best floor {sg['best_floor']} [{time.time()-t0:.0f}s]", flush=True)
    json.dump(res, open(f'{OUT}/c2_{OBJ}.json', 'w'))
print('done', flush=True)
