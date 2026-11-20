"""Pointwise check of V (all functions) against the round-1 Euler-Maclaurin evaluator (no functional equation). Usage: check_vs_em.py T"""
import sys, math, os, numpy as np
os.environ['S1_NOGPU'] = '1'
sys.path.insert(0, '../s1-scattering-one-line')
import lib as s1
import core, c1lib
from core import *
T = float(sys.argv[1]); R = 1.3; H = T ** 0.6; tc = T + H / 2
h, M, Smax = c1lib.window_setup(tc, H, int(T ** (4 / 7)))
n = np.arange(1, Smax + 1)
coefs = {'one': xp.ones(Smax, dtype=xp.complex128), 'chi': xp.asarray(CHI5[n % 5]), 'chib': xp.asarray(np.conj(CHI5[n % 5]))}
V, w, info = c1lib.all_V(tc, h, M, Smax, R, coefs)
idx = np.arange(0, M, max(1, M // 64)); t = tc + asnp(w.tau)[idx]
L = info['L']; s0 = info['sigma0']; L5 = info['L5']; s5 = info['sigma5']; LE = info['LE']; sE = info['sigmaE']
Rz, Rzd = s1.hurwitz_batch(t, s0, 1); z, zd = Rz[0], Rzd[0]
ref = {'ZETA': z + zd / L}
s = s0 + 1j * t; qz = np.exp((s - 0.5) * math.log(3)); m = qz + 2.2 + 1 / qz; md = math.log(3) * (qz - 1 / qz)
ref['TNR'] = z * m + (zd * m + z * md) / L
R2, R2d = s1.hurwitz_batch(2 * t, 2 * s0, 1)
ref['LIOU'] = R2[0] / z + (2 * R2d[0] / z - R2[0] * zd / z**2) / L
Ra, Rad = s1.hurwitz_batch(t, sE + 0.25, 1); Rb, Rbd = s1.hurwitz_batch(t, sE - 0.25, 1)
ref['EA'] = Ra[0] * Rb[0] + (Rad[0] * Rb[0] + Ra[0] * Rbd[0]) / LE
R5, R5d = s1.hurwitz_batch(t, s5, 5); chi = CHI5[1:5]
Lc, Lcd = chi @ R5[:4], chi @ R5d[:4]; Lb, Lbd = np.conj(chi) @ R5[:4], np.conj(chi) @ R5d[:4]
ref['LCHI'] = Lc + Lcd / L5; ref['DH'] = C1 * (Lc + Lcd / L5) + C2 * (Lb + Lbd / L5)
for k in ref:
    v = asnp(V[k])[idx]
    print('%-5s max |V - V_EM| = %.2e   (max |V| %.2f)' % (k, np.abs(v - ref[k]).max(), np.abs(ref[k]).max()))
