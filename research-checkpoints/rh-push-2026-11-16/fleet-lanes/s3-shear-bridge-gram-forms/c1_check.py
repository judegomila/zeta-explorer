# replay of the source table (imp-endpoint-bridge-mass, repo-typed kernel, U = 4) at the source's six a values
import numpy as np, math
from glib import KERNELS, gl, autocorr
phi = KERNELS['zeta_repo']
edges = [0.0, 0.05, 0.1, 0.2, 0.4, 0.7, 1.0, 1.5, 2.0, 3.0, 4.0]
gs, ws, As = [], [], []
for lo, hi in zip(edges[:-1], edges[1:]):
    g, w = gl(400, lo, hi); gs.append(g); ws.append(w); As.append(autocorr(phi, g, Um=4.0))
g = np.concatenate(gs); w = np.concatenate(ws); A = np.concatenate(As)
src = {0.1: (4.576873e-6, 0.45282, 0.230974), 0.5: (2.289661e-5, 0.45302, 0.231118), 1.0: (4.586991e-5, 0.45366, 0.231566),
       2.0: (9.235661e-5, 0.45621, 0.233357), 5.0: (2.420734e-4, 0.47395, 0.245745), 10.0: (5.763637e-4, 0.53532, 0.287864)}
for a, (M0, off0, cov0) in src.items():
    sh = np.sinh(a*g); M = (A*sh*w).sum(); off = (A*sh*w)[g >= 0.1].sum()/M
    C = (g*A*sh*w).sum(); cov = (np.maximum(g - 0.1, 0)*A*sh*w).sum()/C
    print('a=%5.1f  M %.6e (source %.6e)  off(0.1) %.5f (source %.5f)  cov(0.05) %.6f (source %.6f)' % (a, M, M0, off, off0, cov, cov0))
