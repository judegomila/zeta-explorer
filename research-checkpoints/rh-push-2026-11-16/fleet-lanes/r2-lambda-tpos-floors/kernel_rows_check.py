# Consistency check of Theorem C against certified kernel rows: by the boundary reduction the largest admissible lambda for a
# two-point row (r, rho) is  lambda*(r, rho) = inf_{0<v<=rho} inf_d  [4v/(d^2+4v^2)] / [ v * (K_1(d+r, v) + K_1(d-r, v))/2 ]   (h = 1 by scaling).
import numpy as np, json
def K(h, d, b): return (h-b)/(d*d+(h-b)**2) + (h+b)/(d*d+(h+b)**2)
d = np.concatenate([np.linspace(0, 20, 400001), np.geomspace(20, 1e7, 4000)])
def lamstar(r, rho):
    best = np.inf
    for v in np.linspace(rho*1e-3, rho, 400):
        best = min(best, ((4*v/(d*d+4*v*v))/(v*0.5*(K(1, d+r, v)+K(1, d-r, v)))).min())
    return best
rows = json.load(open('/Users/USER/Documents/GitHub/mathexplorer/tmp/oai-lambda-out/KERNELS_raymond_backup.json'))['rows']
from fractions import Fraction as F
for row in rows:
    r = float(F(row['r'])); lam = float(F(row['lambda'])); rho = float(F(row['rho'])) if 'rho' in row else None
    if rho is None: print(row); continue
    print('catalogue row r=%-6s rho=%-8s lambda=%.5f   boundary optimum lambda*=%.5f  ok=%s' % (row['r'], row['rho'], lam, lamstar(r, rho), lamstar(r, rho) >= lam - 1e-9))
for r, rho, lam in [(0.6, 161/400, 1.9826), (0.675, 0.2, 1.96), (0.6, 81/400, 1.9958)]:
    print('project row r=%.3f rho=%.4f lambda=%.4f  lambda*=%.5f' % (r, rho, lam, lamstar(r, rho)))
