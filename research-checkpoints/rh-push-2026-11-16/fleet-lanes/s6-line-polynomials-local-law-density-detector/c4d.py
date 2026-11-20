"""Combination 4, derivative constant: rho(x) = |W - 1|^2, W = E f, E = prod_{p<=97}(1 - b_p p^-s_B), on the source macrocell
x in [6000000185828, +1/50], y = 0.1809, t = 24727519/2e8, N = 690988 (source: rho(a) <= 0.16600, rho_x(a) <= 3.6619, rho_xx <= 2381.19),
and on PATCH random cells of the same width in the window. Derivatives by central differences on 257 points per cell.
Usage: c4d.py OUT.json OBJ[,OBJ..] [PATCH=64]"""
import sys, json, math, numpy as np, mpmath as mp
import lp, tri, orbit
N = 690988; t = 24727519 / 2e8; y = 0.1809; W = 1 / 50; NP = 257
P97 = [int(p) for p in lp.primes_upto(97)]
mp.mp.dps = 40
xN = 4 * mp.pi * (mp.mpf(N) ** 2 - mp.mpf(t) / 16); span = 4 * mp.pi * (2 * N + 1)
f0 = float((mp.mpf(6000000185828) - xN) / span); df = float(W / span) / (NP - 1); dx = W / (NP - 1)
PATCH = int(sys.argv[3]) if len(sys.argv) > 3 else 64
starts = [f0] + list(np.random.default_rng(7).uniform(0, 0.999, PATCH))
fr = np.concatenate([s + df * np.arange(NP) for s in starts])
_, L, sigma, K, g = tri.consts(N, t, y)
n = np.arange(1, N + 1.0); ln = np.log(n); heat = np.exp((t / 4) * ln * ln)
res = []
for obj in sys.argv[2].split(','):
    a = lp.coefs(obj, N); wB = a[1:] * heat * np.exp(-sigma * ln); wA = np.conj(a[1:]) * heat * np.exp((y - sigma) * ln)
    B, A = orbit.sums(N, t, fr, wB[:, None], wA[:, None])
    E = orbit.euler_values(N, t, fr, P97, [a[p] for p in P97], sigma)
    Wv = (E * (B[:, 0] + g * A[:, 0])).reshape(len(starts), NP); rho = np.abs(Wv - 1) ** 2
    r1 = (rho[:, 2:] - rho[:, :-2]) / (2 * dx); r2 = (rho[:, 2:] - 2 * rho[:, 1:-1] + rho[:, :-2]) / dx ** 2
    r = dict(obj=obj, N=N, t=t, y=y, f0=f0, sigma=sigma, g=g, source_cell=dict(rho_left=float(rho[0, 0]), rho_max=float(rho[0].max()), rho_x_left=float(r1[0, 0]), max_abs_rho_xx=float(np.abs(r2[0]).max())),
             patches=dict(n=PATCH, rho_max=float(rho.max()), max_abs_rho_x=float(np.abs(r1).max()), max_abs_rho_xx=float(np.abs(r2).max()), median_cell_max_abs_rho_xx=float(np.median(np.abs(r2).max(1)))),
             source=dict(rho_left=0.16600368701006035, rho_x=3.6618801058916364, rho_xx=2381.1928013565084))
    print(json.dumps(r), flush=True); res.append(r)
json.dump(res, open(sys.argv[1], 'w'), indent=1)
