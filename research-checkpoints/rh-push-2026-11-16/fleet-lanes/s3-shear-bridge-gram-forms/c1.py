# Combination 1: degree-0 overflow fraction and endpoint-bridge mass, curves in a, all kernels.
# Everything is a functional of the one-sided autocorrelation A(g) = int_0^inf Phi(u) Phi(u+g) du:
#   raw shear mass     M(a)      = int_0^inf A(g) sinh(a g) dg
#   off-endpoint share off(a,e)  = int_e^inf A sinh(a g) dg / M(a)          (source: 0.45 at e = 0.1)
#   covering share     cov(a,d)  = int_{2d}^inf (g - 2d) A sinh / int g A sinh   (source: 0.23 at d = 0.05)
#   degree-0 overflow  ov0(a,U)  = max(0, 1 - arcsinh(1)/(a U))             (source: no kernel in it)
#   A-weighted overflow ovA(a)   = int_{arcsinh(1)/a}^inf A dg / int_0^inf A dg
#   support-normalised overflow ovS(a) = ov0(a, U_F), U_F = lag at which A falls to 1e-12 A(0)
import sys, json, math
import numpy as np
from glib import KERNELS, ORDER, gl, autocorr

NA = int(sys.argv[1]) if len(sys.argv) > 1 else 60
NG = int(sys.argv[2]) if len(sys.argv) > 2 else 400
out = sys.argv[3] if len(sys.argv) > 3 else 'out/c1.json'
A_GRID = np.exp(np.linspace(math.log(0.01), math.log(20.0), NA))
EPS = [0.05, 0.1, 0.2]; DEL = [0.05, 0.1]
G = 6.0
edges = sorted(set([0.0, 0.05, 0.1, 0.2, 0.4, 0.7, 1.0, 1.5, 2.0, 3.0, 4.5, G]))
print('planned: %d kernels x %d lags x 3000 nodes x 64-row blocks (< 50 MB)' % (len(ORDER), NG*(len(edges) - 1)), flush=True)

res = {'a': A_GRID.tolist(), 'eps': EPS, 'delta': DEL, 'kernels': {}}
for name in ORDER:
    for scale in ([1.0, 3.0, 10.0, 100.0, 1000.0] if name in ('zeta', 'DH') else [1.0]):
        phi0 = KERNELS[name]
        phi = (lambda u, f=phi0, c=scale: c*f(u))
        gs, ws, As = [], [], []
        for lo, hi in zip(edges[:-1], edges[1:]):
            g, w = gl(NG, lo, hi)
            gs.append(g); ws.append(w); As.append(autocorr(phi, g))
        g = np.concatenate(gs); w = np.concatenate(ws); A = np.concatenate(As)
        A0 = float(autocorr(phi, [0.0])[0])
        # support lag
        gg = np.linspace(0, G, 6001); AA = autocorr(phi, gg)
        idx = np.where(AA > 1e-12*A0)[0]
        UF = float(gg[idx[-1]])
        rows = {'off': [], 'cov': [], 'ovA': [], 'ov0_U6': [], 'ovS': [], 'M': []}
        totA = float((A*w).sum())
        for a in A_GRID:
            sh = np.sinh(a*g)
            M = float((A*sh*w).sum())
            rows['M'].append(M)
            rows['off'].append([float((A*sh*w)[g >= e].sum()/M) for e in EPS])
            C = float((g*A*sh*w).sum())
            rows['cov'].append([float((np.maximum(g - 2*d, 0)*A*sh*w).sum()/C) for d in DEL])
            ts = math.asinh(1.0)/a
            # A-mass beyond tau*: integrate on its own nodes when tau* falls inside the support
            if ts < G:
                g2, w2 = gl(600, ts, min(G, ts + 3.0))
                rows['ovA'].append(float((autocorr(phi, g2)*w2).sum()/totA))
            else:
                rows['ovA'].append(0.0)
            rows['ov0_U6'].append(max(0.0, 1 - ts/6.0))
            rows['ovS'].append(max(0.0, 1 - ts/UF))
        key = name if scale == 1.0 else '%s x%g' % (name, scale)
        res['kernels'][key] = dict(rows, A0=A0, UF=UF, minA=float(A.min()/A0))
        print('%-16s U_F %.3f  minA/A0 %.1e | off(e=0.1) a=0.01 %.5f a~1 %.5f a=20 %.5f | cov(d=.05) a~1 %.5f | ovA a=20 %.3e | ovS a=1 %.4f a=20 %.4f'
              % (key, UF, A.min()/A0, rows['off'][0][1], rows['off'][NA*2//3 - 1][1] if NA > 3 else 0, rows['off'][-1][1],
                 rows['cov'][NA//2][0], rows['ovA'][-1], rows['ovS'][int(np.argmin(abs(A_GRID - 1)))], rows['ovS'][-1]), flush=True)
json.dump(res, open(out, 'w'))
# scale invariance
for nm in ('zeta', 'DH'):
    base = np.array(res['kernels'][nm]['off'])
    d = max(float(abs(np.array(res['kernels']['%s x%g' % (nm, c)]['off']) - base).max()) for c in (3, 10, 100, 1000))
    print('scale invariance %s: max change of off over c = 3..1000: %.2e' % (nm, d))
# source values (repo kernel): a = 0.1, 0.5, 1, 2, 5, 10 -> off(0.1) = 0.45282 0.45302 0.45366 0.45621 0.47395 0.53532
