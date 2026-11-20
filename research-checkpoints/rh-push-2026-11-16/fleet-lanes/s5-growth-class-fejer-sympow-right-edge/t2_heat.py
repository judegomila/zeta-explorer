"""s5 combination 2, backward heat member F_tau (Arb kernel quadrature, objs.Heat): chi_abs(sigma) = Hann mean of (log|f|)^2,
f = F_tau / g (g = zeta's gamma factor; tau = 0 gives zeta).  No argument part (f is not a Dirichlet series).
Usage: t2_heat.py TAU T H dt out.json"""
import sys, os, json, math
import multiprocessing as mp
import numpy as np
from flint import acb, arb, ctx
import objs
XS = [0, 0.01, 0.02, 0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]
TAU = sys.argv[1]; T = float(sys.argv[2]); H = float(sys.argv[3]); dt = float(sys.argv[4]); O = None
def init():
    global O
    O = objs.make('HEAT' + TAU, T + H + 5); O.setprec()
def row(t):
    return [float(abs(O.jp(acb(arb(0.5 + x), arb(t)), 1)[0]).log().mid()) for x in XS]
if __name__ == '__main__':
    n = int(round(H / dt)); tg = T + dt * (np.arange(n) + 0.5); w = np.sin(np.pi * (tg - T) / H) ** 2; w /= w.sum()
    with mp.Pool(int(os.environ.get('RH_WORKERS', '4')), initializer=init) as p: L = np.array(p.map(row, list(tg), chunksize=8))
    ca = [float((L[:, j] ** 2) @ w) for j in range(len(XS))]; m1 = [float(L[:, j] @ w) for j in range(len(XS))]
    var = [a - b * b for a, b in zip(ca, m1)]
    json.dump({'object': 'HEAT' + TAU, 'T0': T, 'H': H, 'dt': dt, 'XS': XS, 'chi_abs': ca, 'mean_logabs': m1, 'var_logabs': var, 'peak_x_abs': XS[int(np.argmax(ca))], 'peak_x_var': XS[int(np.argmax(var))]}, open(sys.argv[5], 'w'))
    print('HEAT' + TAU, 'T0', T, 'peak x of chi_abs', XS[int(np.argmax(ca))], 'of the variance', XS[int(np.argmax(var))], 'chi_abs:', ' '.join('%.4f' % v for v in ca), '| var:', ' '.join('%.4f' % v for v in var), flush=True)
