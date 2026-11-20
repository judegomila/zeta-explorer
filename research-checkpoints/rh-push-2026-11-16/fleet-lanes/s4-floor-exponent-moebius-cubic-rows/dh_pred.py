# Combination 2: explicit-formula prediction of M_DH(x) = sum_{n<=x} b(n), b = Dirichlet inverse of the DH coefficients:
# M_DH(x) = sum over zeros rho of x^rho/(rho DH'(rho)) + ... ; envelope from the tabulated off-line zeros (c12 battery, height <= 2000):
# E_off(x) = sum over off-line zeros rho = beta + i gamma, beta > 1/2 (and conjugates) of 2 x^(beta - 1/2)/(|rho| |DH'(rho)|).
import json, math, sys
import mpmath as mp
import numpy as np
mp.mp.dps = 30
xi = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
def DH(s): return 5**(-s)*(mp.zeta(s, mp.mpf(1)/5) + xi*mp.zeta(s, mp.mpf(2)/5) - xi*mp.zeta(s, mp.mpf(3)/5) - mp.zeta(s, mp.mpf(4)/5))
d = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
rows = []
for b, g, _ in d['offline']:
    rho = mp.mpc(mp.mpf(b), mp.mpf(g)); val = DH(rho); der = mp.diff(DH, rho)
    rows.append(dict(beta=float(b), gamma=float(g), absF=float(abs(val)), absDer=float(abs(der)), amp=float(2/(abs(rho)*abs(der)))))
on = []
for g in d['online'][:40]:
    rho = mp.mpc(0.5, mp.mpf(g)); on.append(dict(gamma=float(g), amp=float(2/(abs(rho)*abs(mp.diff(DH, rho))))))
rows.sort(key=lambda r: -r['beta'])
print('off-line zeros with largest beta:'); [print('  beta %.6f gamma %.4f |F| %.1e |F\'| %.4f amp %.5f' % (r['beta'], r['gamma'], r['absF'], r['absDer'], r['amp'])) for r in rows[:8]]
print('number with beta > 1:', sum(r['beta'] > 1 for r in rows), ' lowest gamma among them:', min([r['gamma'] for r in rows if r['beta'] > 1] or [None]))
print('sum of on-line amplitudes (first 40 zeros): %.4f' % sum(o['amp'] for o in on))
S = np.loadtxt('dh_1e9.sup'); pred = []
for x, sup, supa in S:
    if x < 10: continue
    E = sum(r['amp']*x**(r['beta'] - 0.5) for r in rows); pred.append((x, sup, E))
print('x_bin, measured sup |M_DH|/sqrt x, off-line envelope E_off(x)')
for x, sup, E in pred[::8]: print('  %.3e  %.4f  %.4f' % (x, sup, E))
json.dump(dict(offline=rows, online40=on, pred=pred), open('dh_pred.json', 'w'))
