"""Hole test on the critical line (float64 screen; GPU optional).

Object F with real q-periodic coefficients c_n (zeta: q = 1), completed by (q/pi)^{s/2} Gamma((s+kappa)/2), root number 1.
Z_F(t) = e^{i theta_F(t)} F(1/2+it) (real).  Smoothed approximate functional equation (test function exp(A u^2 - i pi u/4)):
    Z_F(t) = 2 Re[ e^{i theta_F(t)} sum_n c_n n^{-1/2-it} V(n,t) ],  V = (1/2) erfc( log(n/N0(t)) / (2 sqrt A) ),  N0 = sqrt(q t / 2 pi),
relative error O(A^{-3/4}/t) (first Stirling correction of the gamma ratio; measured in validate_hole.py).
Mollifier M_y(s) = sum_{n<=y} b_n (1 - log n/log y) n^{-s},  b = Dirichlet inverse of c,  y = T^theta.
Block: contiguous windows starting at T0, each 17 local mean spacings long, step = spacing/PPS.
usage: hole.py OBJ T0 NWIN OUT [A] [PPS]
"""
import sys, math, time, json, numpy as np, mpmath as mp
from scipy.special import erfc as erfc_np
import os
import multiprocessing
GPU = False; xp = np; GPU_FREE = 0
if os.environ.get('HOLE_GPU', '1') == '1':
    try:
        import cupy as cp
        from cupyx.scipy.special import erfc as erfc_cp
        GPU_FREE = cp.cuda.Device(0).mem_info[0]
        if GPU_FREE > 6 * 1024 ** 3:
            cp.get_default_memory_pool().set_limit(size=min(22 * 1024 ** 3, int(0.8 * GPU_FREE)))
            xp = cp; GPU = True; cp.zeros(4).sum()
    except Exception as e:
        print('# no GPU:', repr(e)[:100], flush=True); xp = np; GPU = False
G = {}
def cpu_chunk(a):
    g = G; dd = g['d'][a:a + g['chunk']]; q = g['q']; T0 = g['T0']; nz = g['nz']; s2A = g['s2A']; Lmax = g['Lmax']
    P = (-dd)[:, None] * g['logn'][None, :] + g['ph'][None, :]
    C = np.cos(P); S = np.sin(P, out=P)
    logN0 = 0.5 * np.log(q * (T0 + dd) / (2 * math.pi))
    lo = int(np.searchsorted(g['logn'][:nz], logN0.min() - Lmax))
    V = 0.5 * erfc_np((g['logn'][None, lo:nz] - logN0[:, None]) / s2A) * g['amp'][None, lo:nz]
    sr = C[:, :lo] @ g['amp'][:lo] + (C[:, lo:nz] * V).sum(1); si = S[:, :lo] @ g['amp'][:lo] + (S[:, lo:nz] * V).sum(1)
    return a, sr, si, C @ g['Wm'], S @ g['Wm']

XI_DH = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
OBJS = {'zeta': (1, 0, np.array([1.0])), 'chi4': (4, 1, np.array([0, 1, 0, -1.0])), 'chi5': (5, 0, np.array([0, 1, -1, -1, 1.0])),
        'chi3': (3, 1, np.array([0, 1, -1.0])), 'DH': (5, 1, np.array([0, 1, XI_DH, -XI_DH, -1.0]))}

def spf_table(n):
    spf = np.arange(n + 1, dtype=np.int64)
    for p in range(2, int(n ** 0.5) + 1):
        if spf[p] == p:
            idx = np.arange(p * p, n + 1, p); m = spf[idx] == idx; spf[idx[m]] = p
    return spf

def phase_table(T0s, nmax):
    """(-T0 log n) mod 2 pi, n = 1..nmax (index 0 unused); high precision at primes, additive elsewhere."""
    mp.mp.dps = 50
    T0 = mp.mpf(T0s); twopi = 2 * mp.pi
    spf = spf_table(nmax); ph = np.zeros(nmax + 1)
    for n in range(2, nmax + 1):
        p = int(spf[n])
        if p == n:
            v = -T0 * mp.log(n); ph[n] = float(v - twopi * mp.floor(v / twopi))
        else:
            ph[n] = ph[n // p] + ph[p]
    return np.mod(ph, 2 * math.pi), spf

def theta0(T0s, q, kappa):
    mp.mp.dps = 50
    T0 = mp.mpf(T0s)
    v = T0 / 2 * mp.log(mp.mpf(q) / mp.pi) + mp.im(mp.loggamma((mp.mpf(1) / 2 + kappa + 1j * T0) / 2))
    return float(v - 2 * mp.pi * mp.floor(v / (2 * mp.pi)))

def dtheta(T0, d, q):
    x = d / T0
    return 0.5 * d * math.log(q * T0 / (2 * math.pi)) + 0.5 * T0 * ((1 + x) * np.log1p(x) - x) + (1.0 / 48) * (1 / (T0 + d) - 1 / T0)

def inverse_coeffs(per, y):
    q = len(per); c = per[np.arange(y + 1) % q].astype(float); c[0] = 0
    if q == 1: c[1:] = 1.0
    inv = np.zeros(y + 1); acc = np.zeros(y + 1)
    for n in range(1, y + 1):
        inv[n] = (1.0 if n == 1 else 0.0) - acc[n]
        top = y // n
        if top >= 2 and inv[n] != 0: acc[2 * n: top * n + 1: n] += inv[n] * c[2: top + 1]
    return inv

def grid(T0, nwin, q, pps, wlen=17):
    """window starts and the sample grid (offsets d from T0); each window has wlen*pps samples at step spacing/pps"""
    starts = np.empty(nwin + 1); hs = np.empty(nwin); t = float(T0)
    for j in range(nwin):
        sp = 2 * math.pi / math.log(q * t / (2 * math.pi)); hs[j] = sp / pps; starts[j] = t - T0; t += wlen * sp
    starts[nwin] = t - T0
    npw = wlen * pps
    d = (starts[:nwin, None] + hs[:, None] * np.arange(npw)[None, :]).ravel()
    return d, hs, npw

def compute(obj, T0s, nwin, A=0.01, pps=10, thetas=(0.25, 0.5), verbose=True, budget=3.0e8):
    if GPU: budget = min(budget, 0.6 * GPU_FREE / 24)
    else: budget = 1.5e7
    q, kappa, per = OBJS[obj]; T0 = float(T0s)
    d, hs, npw = grid(T0, nwin, q, pps)
    tmax = T0 + d[-1]
    Lmax = 2 * math.sqrt(A) * 4.6                                   # erfc(4.6) = 8e-11
    ncut = int(math.sqrt(q * tmax / (2 * math.pi)) * math.exp(Lmax)) + 2
    ys = [int(round(T0 ** th)) for th in thetas]
    nmax = max(ncut, max(ys))
    if verbose: print(f"# {obj} T0={T0:.3e} windows={nwin} points={len(d)} ncut={ncut} y={ys} nmax={nmax}; planned GPU/CPU chunk memory about {3 * 8 * budget / 1e9:.1f} GB; host arrays {len(d) * 8 * 8 / 1e9:.2f} GB", flush=True)
    t1 = time.time()
    ph, spf = phase_table(T0s, nmax); th0 = theta0(T0s, q, kappa)
    n = np.arange(1, nmax + 1, dtype=np.float64); logn = np.log(n)
    c = per[np.arange(1, nmax + 1) % q].astype(float) if q > 1 else np.ones(nmax)
    amp = c / np.sqrt(n)
    inv = inverse_coeffs(per, max(ys))
    Wm = np.zeros((nmax, len(ys)))
    for i, y in enumerate(ys):
        Wm[:y, i] = inv[1:y + 1] * (1 - logn[:y] / math.log(y)) / np.sqrt(n[:y])
    if verbose: print(f"# tables {time.time() - t1:.0f}s  theta0={th0:.6f}  max|inv|={np.abs(inv).max():.3g}", flush=True)
    keep = np.nonzero((np.abs(amp) > 0) | (np.abs(Wm).sum(1) > 0))[0]          # drop n with all weights zero
    ph_k = xp.asarray(ph[1:][keep]); logn_k = xp.asarray(logn[keep]); logn_h = logn[keep]; amp_h = amp[keep]
    Wm_k = xp.asarray(Wm[keep]); nk = len(keep)
    zcol = np.nonzero(logn_h <= math.log(ncut) + 1e-12)[0]; nz = len(zcol)     # keep is sorted; Z-sum uses the first nz columns
    chunk = max(8, int(budget // nk))
    if not GPU: chunk = min(chunk, 1700)
    Z = np.empty(len(d)); MR = np.empty((len(d), len(ys)), dtype=np.float32); MI = np.empty((len(d), len(ys)), dtype=np.float32)
    s2A = 2 * math.sqrt(A); t1 = time.time()
    if not GPU:
        nw = int(os.environ.get('RH_WORKERS', '1'))
        G.update(d=d, chunk=chunk, q=q, T0=T0, nz=nz, s2A=s2A, Lmax=Lmax, logn=logn_h, ph=ph[1:][keep], amp=amp_h, Wm=Wm[keep])
        if verbose: print(f"# CPU path, {nw} workers, chunk {chunk} points x {nk} terms ({3 * 8 * chunk * nk / 1e9:.2f} GB per worker)", flush=True)
        starts = list(range(0, len(d), chunk))
        def put(res):
            a, sr, si, mr, mi = res; dd = d[a:a + chunk]; th = th0 + dtheta(T0, dd, q)
            Z[a:a + chunk] = 2 * (np.cos(th) * sr - np.sin(th) * si)
            MR[a:a + chunk] = np.cos(th)[:, None] * mr + np.sin(th)[:, None] * mi
            MI[a:a + chunk] = np.cos(th)[:, None] * mi - np.sin(th)[:, None] * mr
        if nw > 1:
            with multiprocessing.get_context('fork').Pool(nw) as pool:
                for j, res in enumerate(pool.imap_unordered(cpu_chunk, starts, chunksize=4)):
                    put(res)
                    if verbose and j % max(1, len(starts) // 20) == 0: print(f"# chunk {j}/{len(starts)} {time.time() - t1:.0f}s", flush=True)
        else:
            for a in starts: put(cpu_chunk(a))
    for a in (range(0, len(d), chunk) if GPU else []):
        dd = d[a:a + chunk]; tc = T0 + dd
        P = xp.asarray(-dd)[:, None] * logn_k[None, :] + ph_k[None, :]
        C = xp.cos(P); S = xp.sin(P); del P
        # smooth cutoff weights per point (depend on t through N0)
        logN0 = 0.5 * np.log(q * tc / (2 * math.pi))
        lo = int(np.searchsorted(logn_h[:nz], logN0.min() - Lmax))
        erfc = erfc_cp if GPU else erfc_np
        ag = xp.asarray(amp_h[:lo]); band = xp.asarray(logn_h[lo:nz]); ab = xp.asarray(amp_h[lo:nz])
        if (logN0.max() - logN0.min()) / s2A < 1e-6:           # weights constant over the chunk: one vector
            v = 0.5 * erfc((band - float(logN0.mean())) / s2A) * ab
            sr = C[:, :lo] @ ag + C[:, lo:nz] @ v; si = S[:, :lo] @ ag + S[:, lo:nz] @ v
        else:
            Vg = 0.5 * erfc((band[None, :] - xp.asarray(logN0)[:, None]) / s2A) * ab[None, :]
            sr = C[:, :lo] @ ag + (C[:, lo:nz] * Vg).sum(1); si = S[:, :lo] @ ag + (S[:, lo:nz] * Vg).sum(1)
        mr = C @ Wm_k; mi = S @ Wm_k
        if GPU: sr, si, mr, mi = cp.asnumpy(sr), cp.asnumpy(si), cp.asnumpy(mr), cp.asnumpy(mi)
        th = th0 + dtheta(T0, dd, q)
        Z[a:a + chunk] = 2 * (np.cos(th) * sr - np.sin(th) * si)
        # e^{-i theta} M = (cos th - i sin th)(mr + i mi)
        MR[a:a + chunk] = np.cos(th)[:, None] * mr + np.sin(th)[:, None] * mi
        MI[a:a + chunk] = np.cos(th)[:, None] * mi - np.sin(th)[:, None] * mr
        del C, S
        if verbose and (a // chunk) % 200 == 0: print(f"# chunk {a // chunk}/{len(d) // chunk + 1} {time.time() - t1:.0f}s", flush=True)
    return dict(obj=obj, T0=T0, q=q, d=d, hs=hs, npw=npw, Z=Z, U=MR, M2=MR.astype(np.float64) ** 2 + MI.astype(np.float64) ** 2, ys=ys, thetas=list(thetas), A=A, pps=pps, secs=time.time() - t1, gpu=GPU)

if __name__ == '__main__':
    obj = sys.argv[1]; T0s = sys.argv[2]; nwin = int(float(sys.argv[3])); out = sys.argv[4]
    A = float(sys.argv[5]) if len(sys.argv) > 5 else 0.01; pps = int(sys.argv[6]) if len(sys.argv) > 6 else 10
    r = compute(obj, T0s, nwin, A=A, pps=pps)
    np.savez(out, T0=r['T0'], q=r['q'], hs=r['hs'], npw=r['npw'], Z=r['Z'].astype(np.float32), U=r['U'].astype(np.float32),
                        M2=r['M2'].astype(np.float32), ys=r['ys'], thetas=r['thetas'], A=A, pps=pps, obj=obj)
    print(f"done {obj} T0={T0s} points={len(r['d'])} secs={r['secs']:.0f} gpu={r['gpu']} max|Z|={np.abs(r['Z']).max():.3f}", flush=True)
