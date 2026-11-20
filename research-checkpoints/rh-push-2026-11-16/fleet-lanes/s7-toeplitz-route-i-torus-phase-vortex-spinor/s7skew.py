"""Combination 3 (lane s7): skew sections with kernel (v - u) K_F(v - u) on [0, 2a] (cells of mesh h).
A = skew Toeplitz(a_d); for a real object A is real skew-symmetric: eigenvalues +- i mu, so the singular values are exactly paired.
Statistic: mu_1 >= mu_2 >= ... (one per pair), r_j = log(mu_1 / mu_j), ratios r_3/r_2 (law: 8/3) and r_4/r_2 (law: 5).
usage: s7skew.py mode out.json   (mode: validate | all | fixedP | pass | big)"""
import sys, os, json, time, math
import numpy as np, scipy.linalg as sla
from scipy.sparse.linalg import LinearOperator, eigsh
from s7cell import *
MODE = sys.argv[1]; OUT = sys.argv[2]
OBJS = os.environ.get('OBJS', 'zeta,chim4,chi5,tnr-101-2.1,dh,liou,ea0.2').split(',')
t0 = time.time()

def mus(a, m, k=8):
    """largest k values mu (one per pair) of the skew section of size m: eigenvalues of the Hermitian matrix i A"""
    A = toep(a, m, skew=True)
    print('  allocation %d x %d complex = %.2f GB' % (m, m, 16 * m * m / 2 ** 30), flush=True)
    ev = sla.eigh(1j * A, eigvals_only=True, subset_by_index=[m - k, m - 1], overwrite_a=True, check_finite=False)
    return ev[::-1]

def mus_fft(a, m, k=8):
    """same by Lanczos with FFT products (large m)"""
    L = 1 << int(math.ceil(math.log2(2 * m)))
    col = np.zeros(L, dtype=complex); col[:m] = a[:m]; col[-(m - 1):] = -np.conj(a[1:m][::-1])
    F = np.fft.fft(col)
    def mv(x):
        y = np.zeros(L, dtype=complex); y[:m] = x.ravel()
        return 1j * np.fft.ifft(F * np.fft.fft(y))[:m]
    ev = eigsh(LinearOperator((m, m), matvec=mv, dtype=complex), k=k, which='LA', tol=1e-11, ncv=max(120, 6 * k), maxiter=20000, return_eigenvectors=False)
    return np.sort(ev)[::-1]

def stats(mu):
    r = np.log(mu[0] / mu)
    return dict(mu=[float(x) for x in mu], r=[float(x) for x in r], r3_over_r2=float(r[2] / r[1]), r4_over_r2=float(r[3] / r[1]))

def skew_symbol_sup(a, h):
    """sup of |g|, g(phi) = 2 sum a_d sin(d phi) (real a): location and curvature"""
    L = 1 << int(math.ceil(math.log2(16 * len(a))))
    two = np.zeros(L, dtype=complex); two[:len(a)] = a; two[-(len(a) - 1):] = -a[1:][::-1]
    g = (1j * np.fft.fft(two)).real
    k = int(np.argmax(np.abs(g)))
    return dict(sup=float(abs(g[k])), t0=float(2 * math.pi * min(k, L - k) / L / h), second=float(np.sort(np.abs(g))[-3]))

res = []
if MODE == 'validate':
    # 1. real skew pairing; 2. dense against FFT-Lanczos; 3. smooth compact kernel x exp(-x^2/2): j^2 law (source premise)
    o = obj('zeta', 3000); h = 0.01
    a = a_skew(o, h, 800)
    d1 = mus(a, 600); d2 = mus_fft(a, 600)
    print('dense', d1[:4], 'fft', d2[:4])
    A = toep(a, 300, skew=True); sv = np.linalg.svd(A, compute_uv=False)
    print('pair splitting of singular values (should be rounding):', np.max(np.abs(sv[0:20:2] - sv[1:20:2]) / sv[0]))
    for U in (20.0, 40.0, 80.0):
        hh = 0.05; m = int(U / hh); x = np.arange(m + 1) * hh
        g = x * np.exp(-x * x / 2) * hh
        st = stats(mus(g, m)); print('gaussian kernel U = %g: r3/r2 = %.4f (8/3 = 2.6667), r4/r2 = %.4f (5), r2 U^2 = %.4f' % (U, st['r3_over_r2'], st['r4_over_r2'], st['r'][1] * U * U))
    # 4. archimedean quadrature against a direct fine sum for d = 3
    hh = 0.02; oo = obj('zeta', 10); aa = a_skew(dict(n=np.array([2]), c=np.array([0.0]), zw=oo['zw'], const=0, poles=[]), hh, 10)
    xs = (np.arange(400000) + 0.5) / 400000 * 2 - 1
    kk = lambda x: -x * np.exp(-0.5 * x) / (-np.expm1(-2 * x))
    print('arch entry d=3: quadrature %.12f direct %.12f' % (aa[3], np.mean(kk(hh * (3 + xs)) * (1 - np.abs(xs))) * 2 * hh))
    sys.exit()

if MODE == 'all':        # premise: all prime powers n < e^{2a}; two or more sizes, mesh refinement
    X = int(float(os.environ.get('X', '1e6')))
    for nm in OBJS:
        o = obj(nm, X)
        for twoa in [math.log(v) for v in (10, 100, 1e4, 1e6) if v <= X]:
            for m in (1500, 3000, 6000):
                h = twoa / m
                a = a_skew(o, h, m + 2)
                st = stats(mus(a, m))
                st.update(obj=nm, twoa=twoa, m=m, h=h, regime='all n < e^2a')
                res.append(st); print(nm, 'all 2a=%.3f m=%d mu %s r3/r2 %.4f r4/r2 %.4f %.0fs' % (twoa, m, np.array2string(np.array(st['mu'][:5]), precision=5), st['r3_over_r2'], st['r4_over_r2'], time.time() - t0), flush=True)
                json.dump(res, open(OUT, 'w'))
elif MODE == 'fixedP':   # fixed coefficient list n <= P, window growing past log P
    for nm in OBJS:
        for P in (2, 31, 1009):
            if nm.startswith('tnr') and P < 101: continue
            o = obj(nm, P + 200); LP = math.log(P + 1)
            wmax = 64 * LP; m = 4000; h = wmax / m
            a = a_skew(o, h, m + int(90 / h) + 2, P=P)
            sup = skew_symbol_sup(a, h)
            for fc in (2, 4, 8, 16, 32, 64):
                mm = int(fc * LP / h)
                st = stats(mus(a, mm)); st.update(obj=nm, P=P, twoa=mm * h, m=mm, h=h, regime='fixed P', sup=sup)
                res.append(st); print(nm, 'P=%d 2a=%.2f m=%d mu1/sup %.5f r2 (2a)^2 %.3f r3/r2 %.4f r4/r2 %.4f %.0fs' % (P, mm * h, mm, st['mu'][0] / sup['sup'], st['r'][1] * (mm * h) ** 2, st['r3_over_r2'], st['r4_over_r2'], time.time() - t0), flush=True)
                json.dump(res, open(OUT, 'w'))
elif MODE == 'pass':     # mu_j(2a) as 2a passes log n: fine scan, zeta against controls; T-NR against zeta with c(q) changed by hand
    h = 0.004; X = 400
    scan = np.arange(0.5, 5.0001, 0.05)
    for nm in OBJS + ['zeta+c101']:
        if nm == 'zeta+c101':
            o = obj('zeta', X); t = obj('tnr-101-2.1', X); o = dict(o); c = o['c'].copy(); j = np.nonzero(o['n'] == 101)[0][0]; c[j] = t['c'][np.nonzero(t['n'] == 101)[0][0]]; o['c'] = c
        else: o = obj(nm, X)
        a = a_skew(o, h, int(5.0 / h) + 3)
        for twoa in scan:
            m = int(round(twoa / h))
            st = stats(mus(a, m, 6)); st.update(obj=nm, twoa=float(twoa), m=m)
            res.append(st)
        print(nm, 'scan done %.0fs' % (time.time() - t0), flush=True)
        json.dump(res, open(OUT, 'w'))
elif MODE == 'big':      # largest size: 2a = log 1e6, FFT-Lanczos
    X = 10 ** 6
    for nm in os.environ.get('OBJS', 'zeta,chim4,dh,tnr-101-2.1').split(','):
        o = obj(nm, X); twoa = math.log(1e6)
        for m in (15000, 30000, 60000):
            h = twoa / m
            a = a_skew(o, h, m + 2)
            st = stats(mus_fft(a, m, 8)); st.update(obj=nm, twoa=twoa, m=m, h=h, regime='all n < e^2a, FFT-Lanczos')
            res.append(st); print(nm, 'big m=%d mu %s r3/r2 %.4f r4/r2 %.4f %.0fs' % (m, np.array2string(np.array(st['mu'][:5]), precision=5), st['r3_over_r2'], st['r4_over_r2'], time.time() - t0), flush=True)
            json.dump(res, open(OUT, 'w'))
