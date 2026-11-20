# c1_blaschke.py : planted zero. F*(s) = zeta(s) (s - rho0)/(s - 1 + conj rho0), rho0 = 1/2 + eta + i gamma0: |F*| = |zeta| on the line
# (same Gram), one zero at depth eta to the right of the line. Local distance for gamma0 at the window centre and outside.
import json, numpy as np, c1_local_nb as c1
dz = np.load('out/F_10000.npz'); u = dz['u']; z = dz['zeta']; T0 = 10000.0; h = 0.05; H = 4.0
idx = np.where(np.abs(u) <= 9*H+1e-9)[0]; uu = u[idx]; zz = z[idx]; out = []
c1.LAD = [1, 20, 400, 2000, 20000]
base = c1.solve_window(zz, uu, H, h, 20000); print('zeta', [(r['N'], round(r['rel']['1e-08'], 4)) for r in base['rows']], flush=True)
out.append({'eta': 0, 'shift_over_H': None, 'rel': {r['N']: r['rel']['1e-08'] for r in base['rows']}})
for eta in (0.01, 0.05, 0.2, 0.5):
    for sh in (0.0, 1.5, 3.0, 6.0):
        g0 = sh*H; B = (1j*(uu-g0) - eta)/(1j*(uu-g0) + eta)
        r = c1.solve_window(zz*B, uu, H, h, 20000)
        row = {'eta': eta, 'shift_over_H': sh, 'weight_at_zero': float(1/np.cosh(np.pi*sh)), 'rel': {x['N']: x['rel']['1e-08'] for x in r['rows']}}
        out.append(row); print(json.dumps(row), flush=True); json.dump(out, open('out_c1/blaschke.json', 'w'), indent=1)
