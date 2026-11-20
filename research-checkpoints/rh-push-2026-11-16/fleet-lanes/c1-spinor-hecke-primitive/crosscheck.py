"""Cross-check: prime-side Q (box modes, saved) against the zero sum, on smooth combinations
v'_m = v_m - (v_{m+1}+v_{m-1})/2 (transform decays like dist^-3)."""
import json, math, sys, numpy as np
from plib import mode_index
D = __file__.rsplit('/', 1)[0]
gam = np.array(json.load(open(D + '/zeta_zeros_330.json'))); g = np.concatenate([gam, -gam])
for name, T in (('zeta', 6.0), ('ea', 6.0), ('nr', 6.0), ('zeta', 9.0), ('ea', 9.0), ('nr', 9.0)):
    Q = np.load(f'{D}/out_{name}_T{int(T)}_P7_Qfull.npy'); N = 41
    mm = mode_index(N); om = 85.7 + 2 * np.pi * mm / T
    if name == 'zeta': rho = 1j * g
    elif name == 'ea': rho = np.concatenate([1j * g + 0.2, 1j * g - 0.2])
    else:
        b0 = math.acosh(2.05 / 2) / math.log(2); t = (2 * np.arange(-200, 200) + 1) * math.pi / math.log(2)
        t = t[np.abs(t) < 584]; rho = np.concatenate([1j * g, b0 + 1j * t, -b0 + 1j * t])
    Bf = lambda z: (1 - np.exp(-z * T)) / z / math.sqrt(T)
    V = lambda z: Bf(z[:, None] - 1j * om[None, :])
    # coefficient matrix C: rows = smooth tests centred at m = -8..8
    pos = {int(m): i for i, m in enumerate(mm)}
    cs = range(-8, 9); C = np.zeros((len(cs), N))
    for r, c in enumerate(cs):
        C[r, pos[c]] = 1; C[r, pos[c + 1]] = -0.5; C[r, pos[c - 1]] = -0.5
    Qp = C @ Q[:N, :N] @ C.T
    Y = V(rho) @ C.T; YJ = V(-np.conj(rho)) @ C.T
    Qz = Y.T @ YJ.conj()
    print(name, T, 'max |prime-side - zero-side| =', float(np.abs(Qp - Qz).max()), ' scale', float(np.abs(Qp).max()))
