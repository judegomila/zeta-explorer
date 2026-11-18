"""First decisive test: real zeros of Z_{Gamma(2)}(s, chi_{a,b}) in (1/2, 1); functional equation; Euler product."""
import sys, time, json, math, cmath
import numpy as np, mpmath as mp
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-selberg-twist-control')
from sel import *
out = {}
def alphas(a, b):
    return [x % 1.0 for x in (a, b, a - b)]
def real_zeros(a, b, K, grid):
    vals = [(s, Ztw(s, a, b, K=K).real) for s in grid]
    zs = []
    for (s1, v1), (s2, v2) in zip(vals, vals[1:]):
        if v1 * v2 < 0:
            lo, hi, flo = s1, s2, v1
            for _ in range(40):
                mid = (lo + hi) / 2; fm = Ztw(mid, a, b, K=K).real
                if fm * flo > 0: lo, flo = mid, fm
                else: hi = mid
            zs.append((lo + hi) / 2)
    return zs, vals
t0 = time.time()
rows = []
grid = [0.52 + 0.04 * i for i in range(13)]  # 0.52 .. 1.00
for (a, b) in [(0.01, 0.02), (0.03, 0.05), (0.05, 0.12), (0.10, 0.25), (0.15, 0.40), (0.25, 0.60), (1/3, 2/3)]:
    zs, vals = real_zeros(a, b, 24, grid)
    al = alphas(a, b); sm = sum(min(x, 1 - x) for x in al)
    row = {'a': a, 'b': b, 'alphas': al, 'sum_abs_alpha': sm, 'zeros_K24': zs, 'Z_grid': vals}
    if zs:
        # refine the largest zero at K = 36 by secant from the K=24 value
        s0 = zs[-1]
        for K in (30, 36):
            x0, x1 = s0 - 1e-6, s0 + 1e-6
            f0, f1 = Ztw(x0, a, b, K=K).real, Ztw(x1, a, b, K=K).real
            for _ in range(6):
                x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
                x0, f0, x1 = x1, f1, x2; f1 = Ztw(x1, a, b, K=K).real
                if abs(x1 - x0) < 1e-13: break
            row['s0_K%d' % K] = x1; s0 = x1
        row['lambda0'] = s0 * (1 - s0)
    rows.append(row)
    print(json.dumps({k: v for k, v in row.items() if k != 'Z_grid'}), round(time.time() - t0, 1), flush=True)
out['zeros'] = rows

# functional equation: log(Z(s)/Z(1-s)) = sgn * area * int_0^{s-1/2} v tan(pi v) dv + kappa (s - 1/2)
def tanint(w):
    return mp.quad(lambda v: v * mp.tan(mp.pi * v), mp.linspace(0, w, 5))
fe = []
for (a, b) in [(0.03, 0.05), (0.10, 0.25)]:
    al = alphas(a, b)
    kap_pred = 2 * sum(math.log(2 * math.sin(math.pi * x)) for x in al)
    for s in [0.6, 0.75, 0.9, complex(0.7, 1.0), complex(0.8, 3.0), complex(0.55, 6.0)]:
        z1 = Ztw(s, a, b, K=36); z2 = Ztw(1 - s, a, b, K=36)
        ratio = z1 / z2
        w = mp.mpmathify(s) - mp.mpf(1) / 2
        I = complex(tanint(w))
        res = {}
        for sg in (+1, -1):
            for kf in (+1, -1):
                pred = cmath.exp(sg * 2 * math.pi * I + kf * kap_pred * complex(w))
                res['area%+d_kappa%+d' % (sg, kf)] = abs(ratio / pred - 1)
        fe.append({'a': a, 'b': b, 's': str(s), 'ratio': [ratio.real, ratio.imag], 'kappa_pred': kap_pred, 'relerr': res})
        print(a, b, s, ratio, res, round(time.time() - t0, 1), flush=True)
out['fe'] = fe
json.dump(out, open('tmp/research-2026-11-16/push/e1-selberg-twist-control/t1_zero.json', 'w'), indent=1, default=str)
