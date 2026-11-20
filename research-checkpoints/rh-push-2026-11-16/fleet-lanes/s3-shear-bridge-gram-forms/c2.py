# Combination 2: skew-Toeplitz shear sections (source assembly: imp-3505 / scripts/imp-3668-dense-fifth-pair-offline.mjs)
#   u_i = (i + 1/2) H0, H0 = 0.025, U = N H0;  R_k = H0 sum_i Phi(u_i) Phi(u_{i+k});
#   T_ij = a (u_j - u_i) R_{|j-i|} H0  (real, skew-symmetric, Toeplitz, banded because R_k vanishes beyond the kernel width);
#   S = T^T T;  eigenvalues lambda_1 >= lambda_2 >= ...
# Statistics: pair splitting |lambda_{2j-1} - lambda_{2j}| / lambda_1, j = 1..6;  L_j = -log(lambda_{2j-1}/lambda_1);
#   C = L_2 / 3;  ladder residual max_j |L_j / (C (j^2 - 1)) - 1|, j = 3..6.
# Prediction for ANY real kernel (Toeplitz edge asymptotics at a nondegenerate maximum of the symbol):
#   Hermitian symbol of iT: g(theta) = -2 sum_{m>0} t_m sin(m theta), t_m = a m H0^2 R_m; M = max |g| at theta0;
#   C_pred = pi^2 |g''(theta0)| / (M (N+1)^2).
import sys, json, math, time, os
import numpy as np
from glib import KERNELS, ORDER

H0 = 0.025; A = 1.0
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=24*1024**3)
    GPU = True
except Exception as e:
    cp = None; GPU = False
print('GPU', GPU, flush=True)


def tvec(phi, N, cplx_phase=0.0):
    m = min(N, 400)                                   # samples beyond u = 10 are zero for every kernel here
    u = (np.arange(m) + 0.5)*H0
    p = phi(u)
    Rk = np.array([H0*np.dot(p[:m - k], p[k:]) for k in range(m)])
    t = A*np.arange(m)*H0*Rk*H0
    return t


def symbol(t):
    th = np.linspace(0, math.pi, 400001)
    m = np.nonzero(np.abs(t) > 1e-300*np.abs(t).max())[0]
    g = np.zeros_like(th); g2 = np.zeros_like(th)
    for k in m:
        g += -2*t[k]*np.sin(k*th); g2 += 2*t[k]*k*k*np.sin(k*th)
    i = int(np.argmax(np.abs(g)))
    # count of near-maximal local maxima (degenerate or multiple maxima would change the ladder)
    ag = np.abs(g)
    loc = np.where((ag[1:-1] > ag[:-2]) & (ag[1:-1] >= ag[2:]))[0] + 1
    second = sorted(ag[loc])[-2]/ag[i] if len(loc) > 1 else 0.0
    return float(ag[i]), float(th[i]), float(abs(g2[i])), int(len(m)), float(second)


def top_eigs(t, N, ntop=12, herm=False):
    xp = cp if GPU else np
    tt = np.zeros(N); k = min(N, len(t)); tt[:k] = t[:k]
    print('  planned: N=%d, T and S float64: 2 x %.2f GB (+ eigensolver workspace of the same order)' % (N, N*N*8/1e9), flush=True)
    T = xp.zeros((N, N), dtype=xp.float64)
    idx = xp.arange(N)
    for k in range(1, k):
        if tt[k] != 0.0:
            T[idx[:-k], idx[k:]] = tt[k]
            T[idx[k:], idx[:-k]] = -tt[k]
    if herm:
        ev = xp.linalg.eigvalsh(1j*T)
        ev = cp.asnumpy(ev) if GPU else ev
        return np.sort(np.abs(ev))[::-1][:ntop]**2
    S = T.T @ T
    del T
    if GPU: cp.get_default_memory_pool().free_all_blocks()
    ev = xp.linalg.eigvalsh(S)
    del S
    ev = cp.asnumpy(ev) if GPU else ev
    if GPU: cp.get_default_memory_pool().free_all_blocks()
    return ev[::-1][:ntop]


def stats(lam):
    l1 = lam[0]
    split = [abs(lam[2*j] - lam[2*j + 1])/l1 for j in range(6)]
    L = [-math.log(lam[2*j]/l1) for j in range(6)]
    C = L[1]/3
    resid = max(abs(L[j]/(C*((j + 1)**2 - 1)) - 1) for j in range(2, 6))
    return split, L, C, resid


if __name__ == '__main__':
    NS = [int(x) for x in sys.argv[1].split(',')]
    out = sys.argv[2]
    names = sys.argv[3].split(',') if len(sys.argv) > 3 else ORDER
    res = json.load(open(out)) if os.path.exists(out) else {}
    for name in names:
        t = tvec(KERNELS[name], 400)
        M, th0, g2, band, second = symbol(t)
        res.setdefault(name, {'symbol': {'M': M, 'theta0': th0, 'g2': g2, 'band': band, 'second_max_ratio': second}, 'rows': {}})
        print('%s: symbol max %.6e at theta0 %.6f, |g\'\'| %.6e, band %d lags, second local max / max %.4f' % (name, M, th0, g2, band, second), flush=True)
        for N in NS:
            if str(N) in res[name]['rows']: continue
            t0 = time.time()
            lam = top_eigs(t, N)
            split, L, C, resid = stats(lam)
            Cp = math.pi**2*g2/(M*(N + 1)**2)
            row = {'lam': [float(x) for x in lam], 'split': split, 'L': L, 'C': C, 'resid': resid, 'Cpred': Cp,
                   'lam1_over_M2': float(lam[0]/M**2), 'sec': time.time() - t0}
            if N <= 3200:
                lamh = top_eigs(t, N, herm=True)
                row['herm_vs_gram'] = float(np.abs(lamh - lam).max()/lam[0])
            res[name]['rows'][str(N)] = row
            print('  N=%6d  max split %.2e  C N^2 %.6f  C/Cpred %.6f  ladder resid %.2e  ratios L3/L2 %.6f L4/L2 %.6f (8/3, 5)  lam1/M^2 %.8f  %.0fs'
                  % (N, max(split), C*N*N, C/Cp, resid, L[2]/L[1], L[3]/L[1], lam[0]/M**2, time.time() - t0), flush=True)
            json.dump(res, open(out, 'w'))
    # unimodular twist: kernel Phi(u) e^{2iu}; T' = D* T D with D = diag(e^{2 i u_j}) (unitary), so the spectrum of S is unchanged
    N = 400
    t = tvec(KERNELS['zeta'], 400)
    idx = np.arange(N); d = idx[None, :] - idx[:, None]
    T = np.sign(d)*t[np.abs(d)]
    Tc = T*np.exp(2j*H0*d)
    e1 = np.sort(np.linalg.eigvalsh(T.T @ T))[::-1][:12]; e2 = np.sort(np.linalg.eigvalsh(Tc.conj().T @ Tc))[::-1][:12]
    print('unimodular twist n^{-i} (kernel Phi e^{2iu}), N=400: max relative change of the top 12 eigenvalues %.2e' % (np.abs(e1 - e2).max()/e1[0]))
