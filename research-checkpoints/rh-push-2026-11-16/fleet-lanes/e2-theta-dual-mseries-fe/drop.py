"""drop.py -- matrix-free dual-length test of a functional equation on the exact Gauss-sum tables.

Series (stripped Kubota type, moduli n squarefree primary prime to 6y, N(n) <= 1e7, exact gamma_j from tmp/sextic):
  cub   a(n) = conj(chi_n(y))^2 gamma_2(n)            cubic Kubota/Patterson series at index y   (calibration)
  sex   a(n) = conj(chi_n(y))   gamma_1(n)            sextic Kubota series at index y            (untwisted candidate)
  sexa  a(n) = abar(n)^2 conj(chi_n(y)) gamma_1(n)    alpha^-2-twisted sextic series             (the m-series of Lemma 1)
  rnd   a(n) = random unit phase on the same support  (control)
Statistic: T(X) = sum_n a(n) N(n)^(-1/2) V(N(n)/X),  V = (x d/dx + w0) exp(-(ln x)^2/(2 s^2)),
  Mellin transform Vhat(w) = (w0 - w) s sqrt(2 pi) exp(s^2 w^2/2): entire, zero at the Kubota pole w0 = 1/n (u = 1/2 + 1/n).
If the series has a functional equation u <-> 1-u of conductor Q (norm scale), T(X) is a dual sum of length Q/X and
falls below the random level sig(X) = (sum N^-1 |V|^2)^(1/2) by a large factor once X >> Q.  Random phases stay at z ~ 1.
Output: z(X) = |T(X)|/sig(X).
"""
import sys, os, math, json, time
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z

def main():
    s = float(sys.argv[1]) if len(sys.argv) > 1 else 0.5
    out = sys.argv[2] if len(sys.argv) > 2 else 'drop'
    t0 = time.time()
    T = A.SFTable(SX + '/data/sf_1e7.npz')
    print(f"table: {T.n} nodes, X = {T.X:.3g}; arrays ~ {T.n * 16 * 8 / 1e6:.0f} MB complex128 working set", flush=True)
    N = T.N.astype(float); lnN = np.log(N); rt = N ** -0.5
    z = T.na + T.nb * (-0.5 + 1j * math.sqrt(3) / 2); alpha = z / np.abs(z)
    cut = 3.2 * s                      # window is exp(-cut^2/2) ~ 6e-3 * ... at the table edge
    Xmax = T.X * math.exp(-cut)
    grid = np.geomspace(20, Xmax, 44)
    print(f"s = {s}; X grid 20 .. {Xmax:.3g} (window truncated at exp(-{cut*cut/2:.1f}) = {math.exp(-cut*cut/2):.1e})", flush=True)
    ys = {'1': (1, 0), '7': (1, 3), '7b': (-2, -3), '13': (1, -3), '19': (-2, 3), '31': (1, 6), '43': (1, -6)}
    rng = np.random.default_rng(7)
    series = {}
    for yn, y in ys.items():
        e = T.node_exponents(y); ok = e >= 0; ee = np.maximum(e, 0)
        series[('cub', yn)] = (np.where(ok, np.conj(Z.ZETA6[(2 * ee) % 6]), 0) * T.g2, 1 / 3)
        sx = np.where(ok, np.conj(Z.ZETA6[ee % 6]), 0) * T.g1
        series[('sex', yn)] = (sx, 1 / 6)
        series[('sexa', yn)] = (sx * np.conj(alpha) ** 2, 1 / 6)
        if yn in ('1', '7', '13'):
            for k in range(6):
                series[(f'rnd{k}', yn)] = (np.exp(2j * np.pi * rng.random(T.n)) * ok, 1 / 6)
    # class-restricted sextic base series (classes mod 4), y = 1
    for c in range(12):
        m = T.m4 == c
        series[(f'sex_m4={c}', '1')] = (T.g1 * m, 1 / 6)
    res = {'s': s, 'grid': grid.tolist(), 'rows': {}}
    for (kind, yn), (a, w0) in series.items():
        Ts = []; sig = []
        for X in grid:
            L = lnN - math.log(X)
            sel = np.abs(L) < cut + 1.0
            Ls = L[sel]
            V = (-Ls / (s * s) + w0) * np.exp(-Ls * Ls / (2 * s * s))
            as_ = a[sel]
            Ts.append((as_ * rt[sel] * V).sum())
            sig.append(math.sqrt(((np.abs(as_) ** 2) / N[sel] * V * V).sum()))
        Ts = np.array(Ts); sig = np.array(sig)
        res['rows'][f'{kind}|{yn}'] = {'T': [[t.real, t.imag] for t in Ts], 'sig': sig.tolist()}
        zz = np.abs(Ts) / sig
        print(f"{kind:10s} y={yn:3s} z(X): " + ' '.join(f"{v:7.1e}" if v < 0.01 else f"{v:7.3f}" for v in zz[::3]), flush=True)
    json.dump(res, open(out + '.json', 'w'))
    print("X shown: " + ' '.join(f"{v:7.1e}" for v in grid[::3]))
    print(f"done {time.time() - t0:.0f}s")
main()
