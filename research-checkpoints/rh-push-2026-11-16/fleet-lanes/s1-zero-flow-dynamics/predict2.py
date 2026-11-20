"""First-order prime-sum prediction of the loop defect (b-dyson-defect Proposition 2, formula (*)):
Q(L)+1 = (2 pi/L^2) [ sum_n w(n) Lambda(n)^2/n K(2 pi log n/L) - int_0^L y K(2 pi y/L) dy ],
K = 2 pi Psi_0(k)/k from the CUE_48 Monte Carlo table psi_48.json; w(n) = 1 (zeta) or 1_{5 does not divide n} (chi mod 5)."""
import numpy as np, math, json
from scipy.interpolate import CubicSpline
V_INF = 0.17999
d = json.load(open(__file__.replace('predict2.py', 'psi_48.json'))); k = np.array(d['k']); psi = np.array(d['psi'])
m = k <= 2 * math.pi + 1e-9; k = k[m]; psi = psi[m]
K = CubicSpline(np.concatenate([[0.0], k]), np.concatenate([[0.0], 2 * math.pi * psi / k]), bc_type=((1, -(1 + V_INF)), 'not-a-knot'))
X = 10 ** 7
sv = np.ones(X + 1, dtype=bool); sv[:2] = False
for i in range(2, int(X ** 0.5) + 1):
    if sv[i]: sv[i * i::i] = False
PR = np.nonzero(sv)[0].astype(np.float64); LP = np.log(PR)
def predict(L, skip=None):
    lp = LP if skip is None else LP[PR != skip]
    ymax = L; tot = 0.0
    for mm in range(1, 200):
        y = mm * lp; msk = y < ymax
        if not msk.any(): break
        tot += np.sum(lp[msk] ** 2 * np.exp(-y[msk]) * K(2 * math.pi * y[msk] / L))
    ylo = min(math.log(X), ymax)
    ys = np.linspace(0, ylo, 200001); ramp = np.trapezoid(ys * K(2 * math.pi * ys / L), ys)
    return (2 * math.pi / L ** 2) * (tot - ramp)
if __name__ == '__main__':
    for L in (7, 9, 11.26, 12, 14.365, 16.62): print(L, predict(L), predict(L, 5))
