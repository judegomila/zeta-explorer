"""Measure the zeros' own response coefficient at prime frequencies: K_P(n) = Im(a_n / rho_n),
rho_n = sum_j e^{i gamma_j log n}, a_n = sum_j phi_j e^{i gamma_j log n}, phi_j = 2x_j - x_{j-1} - x_{j+1} (unfolded).
Landau: rho_n / N ~ -Lambda(n) / (sqrt(n) L).  Compare with the sine-process kernel K(k) = 2 pi Psi(k)/k at k = 2 pi log n / L."""
import numpy as np, sys, math, json, mpmath as mp
f = sys.argv[1]; d = np.load(f); T0 = int(float(d['T0'])); delta = d['delta']; x = d['x']; x = x / np.mean(np.diff(x))
phi = 2 * x[1:-1] - x[:-2] - x[2:]; dl = delta[1:-1]; N = len(dl)
Tm = T0 + float(np.median(delta)); L = math.log(Tm / (2 * math.pi))
mp.mp.dps = 40
out = []
for n in [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19, 23, 25, 27, 29, 31, 32, 37, 41, 43, 47, 49, 53, 59, 61, 64, 67, 71, 73, 79, 81, 83, 89, 97, 101, 127, 199, 307, 499, 997]:
    ph0 = float(mp.fmod(mp.mpf(T0) * mp.log(n), 2 * mp.pi)); ln = math.log(n)
    e = np.exp(1j * (ph0 + dl * ln))
    rho = e.sum(); a = (phi * e).sum()
    # von Mangoldt
    lam = 0.0
    for p in range(2, n + 1):
        if all(p % q for q in range(2, int(p ** 0.5) + 1)):
            m = n
            while m % p == 0: m //= p
            if m == 1 and n % p == 0: lam = math.log(p)
    k = 2 * math.pi * ln / L
    out.append(dict(n=n, k=k, rho=[rho.real / N, rho.imag / N], landau=-lam / (math.sqrt(n) * L), KP=(a / rho).imag, KPre=(a / rho).real))
    print('n=%4d k=%.4f  rho/N=%+.6f%+.6fi  Landau %+.6f  K_P=Im(a/rho)=%+.5f  Re=%+.5f   -1.18k=%+.5f' % (n, k, rho.real / N, rho.imag / N, out[-1]['landau'], out[-1]['KP'], out[-1]['KPre'], -1.18 * k), flush=True)
json.dump(dict(L=L, N=N, rows=out), open(f.replace('.npz', '_kprime.json'), 'w'))
