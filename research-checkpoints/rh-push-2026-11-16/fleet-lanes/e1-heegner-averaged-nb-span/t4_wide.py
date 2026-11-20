# Test 1c: zeros of the trace bracket B_X(s) = sum_D (sqrt|D|/2)^s L(s,chi_D) far to the right (3 <= Re s <= 120, 0<Im s<=50).
# L by direct Dirichlet series, n <= 400 (relative tail < 4e-6 at Re s >= 3); roots refined with flint.
import numpy as np, flint, math, json
from hlib import *
from hlib import _kron
Ds_all = neg_fund(200)
sig = np.arange(3.0, 120.01, 0.25); ts = np.arange(0.0, 50.0001, 0.05)
S = sig[:, None] + 1j * ts[None, :]
n = np.arange(1, 401)
print('alloc MB', S.size * 16 * 3 / 1e6)
out = {}
for X in (50, 100, 200):
    Ds = [D for D in Ds_all if -D <= X]; Dm = max(-D for D in Ds)
    B = np.zeros(S.shape, dtype=complex)
    for D in Ds:
        ch = np.array([_kron(D, int(k)) for k in n], dtype=float)
        Lv = np.zeros(S.shape, dtype=complex)
        for k in range(1, 401):
            if ch[k - 1]: Lv += ch[k - 1] * np.exp(-S * math.log(k))
        B += np.exp(S * (0.5 * math.log(-D / Dm))) * Lv         # normalised by (sqrt(Dmax)/2)^s
    ph = np.angle(B)
    d = lambda a, b: ((b - a) + np.pi) % (2 * np.pi) - np.pi
    e = d(ph[:-1, :-1], ph[1:, :-1]) + d(ph[1:, :-1], ph[1:, 1:]) + d(ph[1:, 1:], ph[:-1, 1:]) + d(ph[:-1, 1:], ph[:-1, :-1])
    W = np.rint(e / (2 * np.pi)).astype(int)
    def f(s):
        tot = flint.acb(0)
        for D in Ds: tot += (flint.acb(-D / Dm) ** (s / 2)) * chi(D).l(s)
        return tot
    zs = []
    for i, j in zip(*np.nonzero(W)):
        s = flint.acb(float(sig[i] + .125), float(ts[j] + .025))
        for it in range(60):
            hh = 1e-7; fv = f(s); fp = (f(s + hh) - f(s - hh)) / (2 * hh); ds = complex(fv / fp); s = flint.acb(complex(s) - ds)
            if abs(ds) < 1e-12: break
        z = complex(s); zs.append([z.real, z.imag, abs(complex(f(s)))])
    zs.sort()
    out[X] = zs
    print('X', X, 'n_D', len(Ds), 'cells with nonzero winding, 3<=Re s<=120:', len(zs), ' max Re:', max([z[0] for z in zs], default=None))
    for z in zs[-6:]: print('   %.6f + %.6f i  |f|=%.1e' % tuple(z), flush=True)
json.dump({str(k): v for k, v in out.items()}, open('t4_wide.json', 'w'))
