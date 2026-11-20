"""validate.py -- known-answer check of the smoothed von Mangoldt sum against zeta (mpmath, 30 digits).
sum_{n<=N} Lambda(n)(1 - log n/log N) n^{-s} = -zeta'/zeta(s) - (zeta'/zeta)'(s)/log N + N^{1-s}/((1-s)^2 log N)
                                              - sum_rho N^{rho-s}/((rho-s)^2 log N) - sum_k N^{-2k-s}/((2k+s)^2 log N)."""
import sys, math, mpmath as mp, numpy as np
sys.path.insert(0, __file__.rsplit('/', 1)[0])
import desc
mp.mp.dps = 30
N = 10 ** 6
n, p, k = desc.terms(N)
om = np.log(n.astype(float)); lam = np.log(p.astype(float)) * (1 - om / math.log(N))
zeros = [mp.zetazero(j) for j in range(1, 201)]          # ordinates up to 396.4
for sig, T in ((0.875, 100.0), (0.875, 173.3), (0.75, 150.25), (0.6, 120.7), (0.55, 201.05)):
    s = mp.mpc(sig, T)
    direct = complex(np.sum(lam * np.exp(-(sig + 1j * T) * om)))
    L = mp.log(N)
    f = lambda z: mp.zeta(z, derivative=1) / mp.zeta(z)
    main = -f(s) - mp.diff(f, s) / L + mp.power(N, 1 - s) / ((1 - s) ** 2 * L)
    zs = mp.mpc(0)
    for r in zeros:
        for rho in (r, mp.conj(r)):
            zs += mp.power(N, rho - s) / ((rho - s) ** 2 * L)
    tr = sum(mp.power(N, -2 * j - s) / ((2 * j + s) ** 2 * L) for j in range(1, 40))
    full = main - zs - tr
    print(f"sigma {sig} T {T}: direct {direct:.8f}  formula {complex(full):.8f}  |diff| {abs(direct - complex(full)):.2e}  (without zero sum {abs(direct - complex(main)):.2e})")
