"""Combination 2 (lane s7): Gaussian-smoothed cell matrices H_{h,m}(t) of the Weil form.
t >= 0 (continuous): the Weil distribution K on the difference variable is convolved with the Gaussian of variance 2t
   (zero side: weight e^{-t xi^2} at frequency xi); H_{h,m}(t) is the Gram matrix of the form on the cells smoothed by variance t,
   so U^T H_{h/2,2m}(t) U = H_{h,m}(t) holds exactly for every t >= 0.
   prime events: sum_n c(n) n^{-1/2} K_sigma(log n - d h), K_sigma = second difference of the second antiderivative of the Gaussian;
   archimedean part: folded frequency integral (FFT); pole pair p: factor e^{p^2 t}.
t < 0 (lattice): q(t) = e^{t Delta_h} q(0), Delta_h = second difference / h^2 (exact inverse of the lattice heat step on the list q_0..q_M;
   symbol multiplier exp(-4 t sin^2(phi/2) / h^2) > 0).
usage: s7heat.py mode out.json"""
import sys, os, json, time, math
import numpy as np, scipy.linalg as sla
from scipy.special import digamma, ndtr, ive
from s7cell import *
MODE = sys.argv[1]; OUT = sys.argv[2]
t0 = time.time()
SQ2PI = math.sqrt(2 * math.pi)

def Rfun(y, s):
    y = np.abs(y)
    return s * np.exp(-0.5 * (y / s) ** 2) / SQ2PI - y * ndtr(-y / s)
def Ksm(y, h, s):
    """(G_s * hat_h)(y) with hat normalised as in the cell matrices: -> hat(y/h) as s -> 0"""
    return np.maximum(0.0, 1 - np.abs(y) / h) + (Rfun(y + h, s) - 2 * Rfun(y, s) + Rfun(y - h, s)) / h

def prime_part(o, h, M, t, P=None):
    """sum_n c(n) n^{-1/2} [K(log n - d h) + mirror], d = 0..M-1"""
    n, c = o['n'], o['c']
    if P is not None: sel = n <= P; n, c = n[sel], c[sel]
    ell = np.log(n.astype(float)); w = c / np.sqrt(n.astype(float))
    s = math.sqrt(2 * t); J = int(math.ceil(7.5 * s / h)) + 1
    keep = ell < (M + J + 1) * h
    ell, w = ell[keep], w[keep]
    idx = np.floor(ell / h).astype(np.int64)
    D0 = J + 2
    acc = np.zeros(M + D0 + J + 4, dtype=w.dtype)
    for j in range(-J, J + 2):
        d = idx + j
        y = ell - d * h
        ok = (d >= -D0) & (d < M)
        if not ok.any(): continue
        kv = Ksm(y[ok], h, s) * w[ok]
        if np.iscomplexobj(kv):
            acc[:M + D0] += np.bincount(d[ok] + D0, kv.real, M + D0) + 1j * np.bincount(d[ok] + D0, kv.imag, M + D0)
        else:
            acc[:M + D0] += np.bincount(d[ok] + D0, kv, M + D0)
    sd = acc[D0:D0 + M].copy()
    neg = acc[D0::-1][:min(M, D0 + 1)]          # s_{-d}, d = 0..D0
    sd[:len(neg)] += np.conj(neg)
    return sd

def arch_part(o, h, M, t):
    """archimedean + conductor part smoothed: folded symbol on L points"""
    L = 1 << int(math.ceil(math.log2(M + 100 / h)))
    J = int(h * math.sqrt(75 / t) / (2 * math.pi)) + 2
    k = np.arange(L); phi = 2 * math.pi * np.where(k < L // 2, k, k - L) / L
    f = np.zeros(L)
    for j in range(-J, J + 1):
        p = phi + 2 * math.pi * j; xi = p / h
        wv = np.full(L, o['const'])
        for z, wt in o['zw']: wv += wt * (digamma(z + 0.5j * xi).real - math.log(math.pi))
        f += wv * np.exp(-t * xi * xi) * np.sinc(p / (2 * math.pi)) ** 2
    return np.fft.ifft(f).real[:M]

def q_heat(o, h, M, t, P=None, pole=True):
    if t == 0: return q_sym(o, h, M, P=P, pole=pole)
    q = arch_part(o, h, M, t) - prime_part(o, h, M, t, P=P)
    if pole:
        d = np.arange(M)
        for p in o['poles']: q = q + math.exp(p * p * t) * pole_q(M, h, [p])
    return q

def q_lattice(q0, s, m):
    """e^{s Delta} applied to the Hermitian sequence q0 (two-sided), s = t / h^2 (either sign); first m entries"""
    J = int(2 * abs(s) + 12 * math.sqrt(abs(s) + 1) + 30)
    j = np.arange(-J, J + 1)
    ker = ive(np.abs(j), 2 * abs(s)) * (1.0 if s > 0 else np.exp(4 * abs(s)) * (-1.0) ** np.abs(j))
    two = np.concatenate([np.conj(q0[1:][::-1]), q0])
    out = np.convolve(two, ker, mode='same')[len(q0) - 1:]
    return out[:m]

def extremes(q, m):
    T = toep(q, m)
    ev = sla.eigh(T, eigvals_only=True, overwrite_a=True, check_finite=False)
    return float(ev[0]), float(ev[-1])

def lam_ld(q, m):
    """lambda_min and its extended-precision Rayleigh quotient (same q list)"""
    T = toep(q, m); w, V = sla.eigh(T, subset_by_index=[0, 0], check_finite=False); v = V[:, 0]
    vl = v.astype(np.clongdouble if np.iscomplexobj(v) else np.longdouble); ql = q[:m].astype(vl.dtype)
    num = ql[0].real * np.sum(np.abs(vl) ** 2)
    for d in range(1, m): num += 2 * (ql[d] * np.sum(np.conj(vl[d:]) * vl[:m - d])).real
    return float(w[0]), float(num / np.sum(np.abs(vl) ** 2))

res = []
if MODE == 'validate':
    o = obj('zeta', 20000)
    # 1. flat symbol: FFT route against the closed form
    flat = dict(n=np.array([2]), c=np.array([0.0]), zw=[], const=1.0, poles=[])
    for h, t in ((0.02, 1e-4), (0.02, 3e-3), (0.005, 1e-2)):
        a = arch_part(flat, h, 200, t); b = Ksm(np.arange(200) * h, h, math.sqrt(2 * t))
        print('flat symbol h=%g t=%g: max |FFT - closed form| = %.2e' % (h, t, np.max(np.abs(a - b))))
    # 2. t -> 0
    h = 0.02; q0 = q_sym(o, h, 300)
    for t in (1e-7, 1e-6, 1e-5):
        print('t=%g: max |q(t) - q(0)| = %.3e' % (t, np.max(np.abs(q_heat(o, h, 300, t) - q0))))
    # 3. mesh refinement identity at t = 0 and t > 0 (zeta, DH)
    for nm in ('zeta', 'dh', 'uni'):
        oo = obj(nm, 20000)
        for t in (0.0, 1e-4, 1e-2):
            m = 150
            q1 = q_heat(oo, h, m + 2, t); q2 = q_heat(oo, h / 2, 2 * m + 4, t)
            T1 = toep(q1, m); T2 = toep(q2, 2 * m)
            U = np.zeros((2 * m, m)); U[np.arange(2 * m), np.arange(2 * m) // 2] = 1 / math.sqrt(2)
            print('%s t=%g: max |U^T H_{h/2,2m} U - H_{h,m}| = %.2e (max entry %.2f)' % (nm, t, np.max(np.abs(U.T @ T2 @ U - T1)), np.max(np.abs(T1))))
    # 4. lattice step: forward then backward
    q0 = q_sym(o, h, 600); qa = q_lattice(q0, 2.0, 500); qb = q_lattice(qa, -2.0, 300)
    print('lattice e^{-2 Delta} e^{2 Delta} q - q: %.2e' % np.max(np.abs(qb - q0[:300])))
    sys.exit()

TS = [0.0, 1e-6, 1e-5, 1e-4, 1e-3, 3e-3, 1e-2, 3e-2, 0.1, 0.230607]
SS = [-6.0, -3.0, -1.0, -0.3]
def run(nm, X, h, windows, ts=TS, ss=SS, tag=''):
    o = obj(nm, X); LX = math.log(X)
    Mmax = int(max(windows) / h) + 2
    q0 = q_sym(o, h, Mmax + 200)
    for kind, par in [('lattice', s) for s in ss] + [('gauss', t) for t in ts]:
        if kind == 'lattice':
            t = par * h * h; q = q_lattice(q0, par, Mmax); reach = (2 * abs(par) + 12 * math.sqrt(abs(par) + 1) + 30) * h
            wcap = min(LX - reach, (Mmax + 200) * h - reach)
        else:
            t = par; wcap = LX - 7.5 * math.sqrt(2 * t) - 2 * h
            q = q_heat(o, h, min(Mmax, int(wcap / h)) + 1, t) if wcap > min(windows) else None
        for W in windows:
            m = int(round(W / h))
            if W > wcap or q is None or m > len(q): continue
            if m <= 6000:
                lmin, lld = lam_ld(q, m); lmax = float(sla.eigh(toep(q, m), eigvals_only=True, subset_by_index=[m - 1, m - 1], check_finite=False)[0])
            else:
                print('  allocation %d x %d = %.2f GB' % (m, m, 8 * m * m / 2 ** 30), flush=True)
                lmin, lmax = extremes(q, m); lld = None
            r = dict(obj=nm, h=h, kind=kind, t=t, s=par if kind == 'lattice' else None, W=W, m=m, lam_min=lmin, lam_min_ld=lld, lam_max=lmax, tag=tag)
            res.append(r)
            print('%-16s %-7s t=%+.3e W=%6.3f m=%5d lam_min %+.4e (ld %s) lam_max %.3e ratio %+.2e  %.0fs' % (nm, kind, t, W, m, lmin, '%+.4e' % lld if lld is not None else '-', lmax, lmin / lmax, time.time() - t0), flush=True)
        json.dump(res, open(OUT, 'w'))

if MODE == 'small':
    run('zeta', 20000, 0.01, [2.0, 4.0]); run('dh', 20000, 0.01, [3.0, 3.6, 4.0])
elif MODE == 'main':
    W1 = [1.0, 2.0, 3.0, 3.3, 3.4, 3.5, 3.6, 3.8, 4.0, 4.5, 5.0, 6.0, 8.0]
    for nm in ('zeta', 'chim4', 'chi5', 'dh', 'tnr-101-2.1', 'liou', 'uni', 'ea0.2'):
        run(nm, 10 ** 6, 0.005, W1)
    run('dh', 10 ** 6, 0.0025, [3.3, 3.4, 3.5, 3.6, 3.8, 4.0], tag='fine')
    run('zeta', 10 ** 6, 0.0025, [4.0, 8.0], tag='fine')
elif MODE == 'tnr':
    Wq = [12.0, 12.5, 13.0, 13.2, 13.4, 13.6, 13.7, 13.8, 13.85, 13.9, 14.0, 14.5]
    run('tnr-1000003-2.1', 3 * 10 ** 7, 0.01, Wq, ts=[0.0, 1e-5, 1e-4, 1e-3, 3e-3, 1e-2, 3e-2], ss=[-3.0, -1.0])
    run('zeta', 3 * 10 ** 7, 0.01, Wq, ts=[0.0, 1e-4, 1e-2, 3e-2], ss=[-1.0])
    run('tnr-101-2.1', 10 ** 6, 0.005, [3.0, 3.5, 4.0, 4.2, 4.4, 4.5, 4.55, 4.6, 4.65, 4.7, 5.0], ts=[0.0, 1e-5, 1e-4, 1e-3, 3e-3, 1e-2, 3e-2], ss=[-3.0, -1.0], tag='q101')
elif MODE == 'big':
    run('zeta', 10 ** 6, math.log(1e6) / 30000 * 1.5, [math.log(1e6) * 0.999 * 2 / 3], ts=[0.0, 1e-6, 1e-4], ss=[-1.0], tag='m20000')
    run('zeta', 10 ** 6, math.log(1e6) / 30000, [13.5], ts=[0.0], ss=[-1.0], tag='m30000')
