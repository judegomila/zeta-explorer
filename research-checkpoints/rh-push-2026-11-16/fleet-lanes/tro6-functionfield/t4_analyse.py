import sys, numpy as np, pickle, itertools
from fflib import *
np.set_printoptions(linewidth=200, precision=4, suppress=True)
def load(n): return pickle.load(open(f'ck_n{n}.pkl', 'rb'))
def pstar(res, n, d, k):
    """coefficient of u^k of psi(m,u)(1-q^(n+1)u^n)/(1-q^n u^n)"""
    tot = 0; i = 0
    while k - n * i >= 0:
        a = res[(d, k - n * i)]
        b = res[(d, k - n * i - n)] if k - n * i - n >= 0 else 0
        tot = tot + q ** (n * i) * (a - q ** (n + 1) * b); i += 1
    return tot
for n in ((3, 6) if __name__ == "__main__" else ()):
    res = load(n)
    print(f'=== n={n}: P*_m(u) = psi(m,u)(1-q^{n+1}u^{n})/(1-q^{n}u^{n}); max_m |p*_k(m)| / q^(3k/2) ===')
    ds = sorted({d for d, k in res})
    for d in ds:
        ks = sorted(k for dd, k in res if dd == d)
        line = []
        for k in ks:
            v = np.abs(pstar(res, n, d, k)).max() / q ** (1.5 * k)
            line.append(f'{v:.1e}' if v < 1e-9 else f'{v:.3f}')
        print(f' d={d}:', ' '.join(f'k{k}={x}' for k, x in zip(ks, line)))
    u0 = q ** (-(1 + 1 / n))
    print(f' theta coefficient rho(m) = (1-1/q) P*_m(u0), u0=q^-(1+1/{n});  classes rho_eps = (1-1/q) sum_(j=eps mod n) p*_j u0^j')
    for d in ds:
        if not all((d, k) in res for k in range(d + 2)): continue
        ps = [pstar(res, n, d, j) * u0 ** j for j in range(d + 2)]
        tot = (1 - 1 / q) * sum(ps)
        cls = [(1 - 1 / q) * sum(ps[j] for j in range(d + 2) if j % n == e) for e in range(n)]
        Ms = monics(d)
        sfm = np.array([pres(m, deriv(m)) != 0 if d > 0 else True for m in Ms])
        print(f' d={d}: mean|rho|^2={np.mean(abs(tot)**2):.4f}  (sf m: {np.mean(abs(tot[sfm])**2):.4f}, min {abs(tot[sfm]).min()**2:.4f} max {abs(tot[sfm]).max()**2:.4f});  q^(-d/3)={q**(-d/3):.4f} q^(-d/6)={q**(-d/6):.4f}'
              f'  class mean squares: ' + ' '.join(f'{np.mean(abs(c)**2):.4f}' for c in cls))
        # stable-window check: u0^k c_k for k>=d+2 equals class value
        for k in range(d + 2, d + 2 + n):
            if (d, k) in res:
                diff = abs(res[(d, k)] * u0 ** k - cls[k % n]).max()
                print(f'      stable window k={k}: max|u0^k c_k - rho_(k mod n)| = {diff:.2e}')
