"""drop3.py -- dual-length test with the gamma-matched window (theta-type smoothing).

Candidate functional equation of a Kubota-type series Z(u) = sum_n a(n) N(n)^(-u) of order n, K-type l:
   Lambda(u) = G(u) L_norm(n u - n/2 + 1) Z(u),   G(1/2 + w) ~ prod_{j=1}^{n-1} Gamma(w + j/n + |l|/2)     (candidate gamma factor)
   Lambda(u) = (finite S-data matrix) * (Q)^(1/2-u) * Lambda~(1 - u).
Window:  V(x) = (1/2 pi i) int prod_j Gamma(w + j/n + |l|/2) * (w0 - w)^k x^(-w) dw   (k = 1 only for l = 0: zero at the pole w0 = 1/n).
F(X) = sum_n a(n) N(n)^(-1/2) V(N(n)/X).  With the candidate equation, F(X) is a finite combination of dual sums
sum a~(n) N^(-1/2) V~(N X / Q) with V~ of the same decay exp(-(n-1) x^(1/(n-1))): F(X) -> 0 for X >> Q.
For a series without that equation (random phases) |F(X)| stays at sig(X) = (sum |a|^2 N^-1 V^2)^(1/2).
Reported: z(X) = |F(X)| / sig(X), and the raw |F|.
"""
import sys, math, json, time
import numpy as np
from scipy.special import loggamma
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
OUT = 'tmp/research-2026-11-16/push/e2-theta-dual-mseries-fe/'

def window(n, l, kill):
    """V on a log grid; returns (lx grid, V values real)."""
    c = 1.0; t = np.arange(-14, 14, 0.004); w = c + 1j * t
    lg = sum(loggamma(w + j / n + abs(l) / 2) for j in range(1, n))
    P = np.exp(lg) * ((1 / n - w) if kill else 1.0)
    lx = np.arange(-30, 12.0001, 0.02)
    V = np.array([(P * np.exp(-w * L)).sum().real * 0.004 / (2 * math.pi) for L in lx])
    return lx, V

def main():
    t0 = time.time()
    T = A.SFTable(SX + '/data/sf_1e7.npz')
    N = T.N.astype(float); lnN = np.log(N); rt = N ** -0.5
    print(f"table: {T.n} nodes; working arrays ~ {T.n * 8 * 14 / 1e6:.0f} MB", flush=True)
    zc = T.na + T.nb * (-0.5 + 1j * math.sqrt(3) / 2); alpha = zc / np.abs(zc)
    wins = {}
    for (n, l, kill) in [(3, 0, 1), (3, 1, 0), (3, 2, 0), (6, 0, 1), (6, 1, 0), (6, 2, 0), (6, 0, 0), (3, 0, 0)]:
        wins[(n, l, kill)] = window(n, l, kill)
        lx, V = wins[(n, l, kill)]
        print(f"window n={n} |l|={l} kill={kill}: V(1)={np.interp(0, lx, V):+.3e} V(10)={np.interp(math.log(10), lx, V):+.2e} V(100)={np.interp(math.log(100), lx, V):+.2e} V(1e3)={np.interp(math.log(1e3), lx, V):+.2e} V(1e4)={np.interp(math.log(1e4), lx, V):+.2e}", flush=True)
    grid = np.geomspace(1, 3e5, 34)
    ys = {'1': (1, 0), '7': (1, 3), '13': (1, -3), '31': (1, 6)}
    rng = np.random.default_rng(5)
    res = {'grid': grid.tolist(), 'rows': {}}
    print("X:".ljust(22) + ' '.join(f"{v:7.1e}" for v in grid[::3]))
    def run(name, a, key):
        lx, V = wins[key]; F = []; sg = []; tail = []
        for X in grid:
            Vn = np.interp(lnN - math.log(X), lx, V, left=0.0, right=0.0)
            F.append((a * rt * Vn).sum()); sg.append(math.sqrt(((np.abs(a) ** 2) / N * Vn * Vn).sum()))
            tail.append(abs(np.interp(math.log(T.X / X), lx, V)))
        F = np.array(F); sg = np.array(sg)
        res['rows'][name] = {'F': [[v.real, v.imag] for v in F], 'sig': sg.tolist(), 'edge': tail}
        zz = np.abs(F) / sg
        print(f"{name:21s} " + ' '.join(f"{x:7.1e}" if x < 0.0995 else f"{x:7.3f}" for x in zz[::3]), flush=True)
    for yn, y in ys.items():
        e = T.node_exponents(y); ok = e >= 0; ee = np.maximum(e, 0)
        cub = np.where(ok, np.conj(Z.ZETA6[(2 * ee) % 6]), 0) * T.g2
        sex = np.where(ok, np.conj(Z.ZETA6[ee % 6]), 0) * T.g1
        run(f"cub l=0 y={yn}", cub, (3, 0, 1))
        run(f"cub l=+1 y={yn}", cub * np.conj(alpha), (3, 1, 0))
        run(f"cub l=-1 y={yn}", cub * alpha, (3, 1, 0))
        run(f"sex l=0 y={yn}", sex, (6, 0, 1))
        run(f"sex l=+1 y={yn}", sex * np.conj(alpha), (6, 1, 0))
        run(f"sex l=-1 y={yn}", sex * alpha, (6, 1, 0))
        run(f"sex l=+2 y={yn} (m-ser)", sex * np.conj(alpha) ** 2, (6, 2, 0))
        run(f"sex l=-2 y={yn}", sex * alpha ** 2, (6, 2, 0))
        for r in range(3):
            a = np.exp(2j * np.pi * rng.random(T.n)) * ok
            run(f"rnd{r} win6,l=2 y={yn}", a, (6, 2, 0))
            run(f"rnd{r} win3,l=1 y={yn}", a, (3, 1, 0))
    # mismatched-window control: cubic series with the sextic window and sextic with the cubic window (y = 1)
    run("cub l=+1, sextic win", T.g2 * np.conj(alpha), (6, 1, 0))
    run("sex l=+1, cubic win", T.g1 * np.conj(alpha), (3, 1, 0))
    json.dump(res, open(OUT + 'drop3.json', 'w'))
    print(f"done {time.time() - t0:.0f}s")
if __name__ == "__main__": main()
