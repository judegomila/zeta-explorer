# Independent evaluation of the ratio in the counting variable (no L-values, no quadrature in t):
#   h_x(s) = e^{-a(s-1)} A_x(s),  h_x(s)/s = int_0^inf f_x(y) y^{-s-1} dy,  f_x(y) = e^a sum_D c_D N_D(theta_D y),
#   N_D(y) = sum_{n<=y} a_D(n),  sum a_D(n) n^-s = zeta(s) L(s,chi_D)/zeta(2s),  theta_D = sqrt(|D|/Dmax).
#   Plancherel: E_mu|h_x|^2 = int_0^inf f_x^2 dy/y^2 ; with A_x(1)=1: R - 1 = int |f_x - 1_{y>=1}|^2 dy/y^2.
import numpy as np, json, math, sys
from hlib import *
from hlib import _kron
N = int(float(sys.argv[1]))
J = json.load(open('t2_ratio.json')); Ds = J['Ds']
def acoef(D):
    a = np.ones(N + 1, dtype=np.int32); a[0] = 0
    sieve = np.ones(N + 1, dtype=bool)
    for p in range(2, N + 1):
        if not sieve[p]: continue
        sieve[p * p::p] = False
        k = _kron(D, p)
        if k == 1: a[p::p] *= 2
        elif k == -1: a[p::p] = 0
        else: a[p * p::p * p] = 0
    return a
print('alloc MB (coefficients, cumulative sums)', len(Ds) * (N + 1) * 8 / 1e6, flush=True)
cum = {}
for D in Ds:
    cum[D] = np.cumsum(acoef(D)).astype(np.int32)
# check residue: N_D(N)/N -> L(1,chi_D)/zeta(2)
for D in (-3, -163, -199):
    print('density check', D, cum[D][N] / N, 6 * class_number(D) * 2 / (math.pi * wD(D) * math.sqrt(-D)), flush=True)

def evalc(idxc, label):
    # idxc: list of (D, c_D)
    Dm = max(-D for D, _ in idxc); ea = math.sqrt(Dm) / 2
    ys = []; js = []
    for D, c in idxc:
        th = math.sqrt(-D / Dm)
        n = np.arange(1, N + 1)
        a = np.diff(np.concatenate([[0], cum[D][1:]]))
        m = a != 0
        ys.append(n[m] / th); js.append(ea * c * a[m])
    ys = np.concatenate(ys); js = np.concatenate(js)
    o = np.argsort(ys); ys = ys[o]; js = js[o]
    keep = ys <= N                      # every D is complete up to y = N
    ys = ys[keep]; f = np.cumsum(js[keep])
    seg = 1 / ys[:-1] - 1 / ys[1:]
    I2 = np.cumsum(f[:-1] ** 2 * seg); I1 = np.cumsum((f[:-1] - 1) ** 2 * seg)
    res = {}
    for Y in (N / 100, N / 10, N):
        k = np.searchsorted(ys, Y) - 2
        res[Y] = (float(I2[k]), float(I1[k]), float(np.abs(f[max(0, k - 2000):k]).max()))
        print(f"{label}: Y={Y:.3g}  int_1^Y f^2 dy/y^2 = {I2[k]:.6g}   int |f-1|^2 = {I1[k]:.6g}   max|f| near Y = {res[Y][2]:.3g}", flush=True)
    return res

out = {}
for T, rows in J['results'].items():
    for r in rows:
        if 'pair' in r:
            c = r['c']; out[f'T{T}_pair'] = evalc([(-7, c[0]), (-8, c[1])], f'pair(-7,-8) c from T={T} (line value R={r["R"]:.6g})')
        if r.get('X') in (20, 60, 100, 200) and r.get('cut') == 1e-11:
            idx = [D for D in Ds if -D <= r['X']]
            out[f'T{T}_X{r["X"]}'] = evalc(list(zip(idx, r['c'])), f'X={r["X"]} c from T={T} (line value R={r["R"]:.6g})')
json.dump(out, open('t5_yspace.json', 'w'))
