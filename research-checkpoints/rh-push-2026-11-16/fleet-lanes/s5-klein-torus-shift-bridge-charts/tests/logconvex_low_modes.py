"""Log-convexity of E_k(v) for the lowest modes (zeta, completed function, L = 100, r = 1.5, circles xmin = 0.5, 0.6, 0.7, N = 2^14):
second divided difference of log E_k and its predicted value from the two-exponential form a_k = alpha e^(-kappa x) + beta e^(kappa x)
fitted on the outer circles."""
import json, math, sys, os
import numpy as np
d = np.load(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'out', 't_kl_zeta.npz')); meta = json.loads(str(d['meta'])); H = d['H']
kmax = meta['kmax']; kap1 = meta['kappa1']; v = np.array(meta['v'])[:3]
for k in range(1, 9):
    cp = H[:3, k] / (2j * math.pi * k); cm = H[:3, -k] / (2j * math.pi * (-k))
    for name, a in (('log|F|', (cp + np.conj(cm)) / 2), ('arg F', (cp - np.conj(cm)) / 2j)):
        E = np.abs(a) ** 2; h1 = v[1] - v[0]; h2 = v[2] - v[1]
        D2 = 2 * (E[0] * h2 - E[1] * (h1 + h2) + E[2] * h1) / (h1 * h2 * (h1 + h2))
        L2 = 2 * (math.log(E[0]) * h2 - math.log(E[1]) * (h1 + h2) + math.log(E[2]) * h1) / (h1 * h2 * (h1 + h2))
        kap = kap1 * k
        # fit alpha, beta from circles 0 and 2 (x = v - 1/2)
        x0, x2 = v[0] - 0.5, v[2] - 0.5
        M = np.array([[np.exp(-kap * x0), np.exp(kap * x0)], [np.exp(-kap * x2), np.exp(kap * x2)]])
        al, be = np.linalg.solve(M, np.array([a[0], a[2]]))
        x1 = v[1] - 0.5; pred_a1 = al * np.exp(-kap * x1) + be * np.exp(kap * x1)
        A2 = abs(al) ** 2 * math.exp(-2 * kap * x1); B2 = abs(be) ** 2 * math.exp(2 * kap * x1); C = 2 * (al * np.conj(be)).real
        Ef = A2 + B2 + C; pred_L2 = 4 * kap ** 2 * (4 * abs(al * be) ** 2 + C * (A2 + B2)) / Ef ** 2
        print('k=%d %-7s E=%.6e  (E)\'\' = %+.4e  (log E)\'\' = %+.6e  predicted %+.6e  fit error at middle circle %.1e  |beta/alpha| e^(2 kappa x) = %.2e' %
              (k, name, E[1], D2, L2, pred_L2, abs(pred_a1 - a[1]) / abs(a[1]), math.sqrt(B2 / A2)))
