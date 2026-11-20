import json, numpy as np, math, sys
from scipy.interpolate import CubicSpline
for f in sys.argv[1:]:
    d = json.load(open(f)); k = np.array(d['k']); psi = np.array(d['psi']); e = np.array(d['psi_err'])
    cs = CubicSpline(np.concatenate([[0], k]), np.concatenate([[0], psi]), bc_type=((1, 0.0), 'not-a-knot'))
    print(f, 'N', d['N'], 'nmat', d['nmat'])
    for kap in [math.pi / 2, math.pi, 1.5 * math.pi, 2 * math.pi, 3 * math.pi, 4 * math.pi]:
        if kap > k[-1] + 1e-9: continue
        P0 = float(cs.integrate(0, kap)); m = k <= kap
        err = math.sqrt(np.sum(e[m] ** 2)) * (k[1] - k[0])
        print('  kappa=%.4f  P0=int_0^kappa Psi = %.5f +- %.5f   R0 = -1 - P0 = %.5f   Psi(kappa)=%.5f' % (kap, P0, err, -1 - P0, float(cs(kap))))
