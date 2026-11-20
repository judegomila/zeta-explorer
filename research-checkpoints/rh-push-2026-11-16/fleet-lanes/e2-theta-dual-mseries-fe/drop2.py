"""drop2.py -- zeta-completed matrix-free dual-length test (see drop.py for the plain statistic).

T(X)  = sum_n a(n) N(n)^(-1/2) V(N(n)/X),  V = (x d/dx + w0) exp(-(ln x)^2/(2 s^2))   (Vhat(w0) = 0, w0 = 1/n)
T*(X) = sum_{d primary, (d,6)=1} N(d)^(-1) T(X / N(d)^n)     <->  zeta_K^S(n u - n/2 + 1) Z(u)
The completion removes the poles of Z at the zeros of zeta_K(n u - n/2 + 1) (terms X^(-1/(2n)) in T).
Noise level: rms of |T*| over random-phase series on the same support (R draws).
"""
import sys, os, math, json, time
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z

def ideal_norms(maxN):
    """norms (with multiplicity) of ideals of Z[omega] prime to 6 with norm <= maxN."""
    out = []
    B = int(math.sqrt(maxN * 4 / 3)) + 2
    cnt = {}
    for a in range(-B, B + 1):
        for b in range(-B, B + 1):
            n = a * a - a * b + b * b
            if 0 < n <= maxN and n % 2 == 1 and n % 3 != 0:
                cnt[n] = cnt.get(n, 0) + 1
    for n, c in sorted(cnt.items()):
        assert c % 6 == 0
        out += [n] * (c // 6)
    return out

def main():
    s = float(sys.argv[1]); out = sys.argv[2]; R = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    t0 = time.time()
    T = A.SFTable(SX + '/data/sf_1e7.npz')
    o = T.order; N = T.N[o].astype(float); lnN = np.log(N); rt = N ** -0.5
    print(f"table: {T.n} nodes; working arrays ~ {T.n * 8 * 12 / 1e6:.0f} MB", flush=True)
    z = (T.na + T.nb * (-0.5 + 1j * math.sqrt(3) / 2))[o]; alpha = z / np.abs(z)
    cut = 4.0 * s
    Xmax = T.X * math.exp(-cut)
    grid = np.geomspace(30, Xmax, 36)
    print(f"s = {s}; X grid 30 .. {Xmax:.3g}; window at the table edge <= exp(-8) relative", flush=True)
    def Tsum(a, w0, X):
        if X < 1.0: return 0.0
        lo = np.searchsorted(lnN, math.log(X) - cut - 0.5); hi = np.searchsorted(lnN, math.log(X) + cut + 0.5)
        L = lnN[lo:hi] - math.log(X)
        V = (-L / (s * s) + w0) * np.exp(-L * L / (2 * s * s))
        return (a[lo:hi] * rt[lo:hi] * V).sum()
    dn = {3: ideal_norms(int((Xmax / 2) ** (1 / 3)) + 1), 6: ideal_norms(int((Xmax / 2) ** (1 / 6)) + 1)}
    print(f"completion ideals: n=3: {len(dn[3])} (norm <= {max(dn[3])}), n=6: {len(dn[6])} (norms {dn[6]})", flush=True)
    def Tstar(a, w0, n, X):
        return sum(Tsum(a, w0, X / d ** n) / d for d in dn[n])
    ys = {'1': (1, 0), '7': (1, 3), '13': (1, -3), '31': (1, 6)}
    rng = np.random.default_rng(11)
    res = {'s': s, 'grid': grid.tolist(), 'rows': {}}
    def show(name, v):
        print(f"{name:16s} " + ' '.join(f"{x:7.1e}" if x < 0.0995 else f"{x:7.3f}" for x in v[::3]), flush=True)
    print("X:               " + ' '.join(f"{v:7.1e}" for v in grid[::3]))
    for yn, y in ys.items():
        e = T.node_exponents(y)[o]; ok = e >= 0; ee = np.maximum(e, 0)
        ser = {'cub': (np.where(ok, np.conj(Z.ZETA6[(2 * ee) % 6]), 0) * T.g2[o], 3),
               'sex': (np.where(ok, np.conj(Z.ZETA6[ee % 6]), 0) * T.g1[o], 6)}
        ser['sexa'] = (ser['sex'][0] * np.conj(alpha) ** 2, 6)
        # noise: random phases on the same support, for n = 3 and n = 6 statistics
        nz = {}
        for n in (3, 6):
            acc0 = np.zeros(len(grid)); acc1 = np.zeros(len(grid)); allr = []
            for r in range(R):
                a = np.exp(2j * np.pi * rng.random(T.n)) * ok
                t_ = np.array([abs(Tsum(a, 1 / n, X)) for X in grid]); ts = np.array([abs(Tstar(a, 1 / n, n, X)) for X in grid])
                acc0 += t_ ** 2; acc1 += ts ** 2; allr.append(ts)
            nz[n] = (np.sqrt(acc0 / R), np.sqrt(acc1 / R))
            res['rows'][f'noise{n}|{yn}'] = {'plain': nz[n][0].tolist(), 'star': nz[n][1].tolist(), 'draws': [x.tolist() for x in allr]}
            show(f"rnd n={n} y={yn} rms*", nz[n][1])
        for kind, (a, n) in ser.items():
            t_ = np.array([Tsum(a, 1 / n, X) for X in grid]); ts = np.array([Tstar(a, 1 / n, n, X) for X in grid])
            res['rows'][f'{kind}|{yn}'] = {'T': [[v.real, v.imag] for v in t_], 'Tstar': [[v.real, v.imag] for v in ts]}
            show(f"{kind} y={yn} z", np.abs(t_) / nz[n][0]); show(f"{kind} y={yn} z*", np.abs(ts) / nz[n][1])
    json.dump(res, open(out + '.json', 'w'))
    print(f"done {time.time() - t0:.0f}s")
main()
