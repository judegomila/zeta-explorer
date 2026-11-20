"""validation of combo3: c^T Q c against the zero side for f(x) = cos^4(pi x / 2a) on [-a,a] (fhat decays like g^-5)."""
import numpy as np, math, json, sys
import ctl, combo3
B = '../../c12-control-battery-harness/tables/'
def fhat(g, a):
    # f = cos^4(pi x/2a) = (3 + 4cos(pi x/a) + cos(2 pi x/a))/8 = sum_k c_k e_k, c_0=3/8, c_{+-1}=1/4, c_{+-2}=1/16
    out = 0
    for k, c in ((0, 3 / 8), (1, .25), (-1, .25), (2, 1 / 16), (-2, 1 / 16)):
        z = g + np.pi * k / a; out = out + c * 2 * np.sin(z * a) / z
    return out
def zero_side(code, a):
    if code == 'ZETA':
        g = np.load('../../s1-zero-flow-dynamics/data/zeta_1e7.npy')[:200000]
        return 2 * np.sum(fhat(g, a) ** 2)
    if code == 'DH':
        z = json.load(open(B + 'zeros_DH.json')); g = np.array([float(x) for x in z['online']])
        tot = 2 * np.sum(fhat(g, a) ** 2)
        for b, gm, _ in z['offline']:
            zz = float(gm) - 1j * (float(b) - 0.5)
            tot += 2 * 2 * (fhat(zz, a) * np.conj(fhat(np.conj(zz), a))).real
        return tot
    if code == 'TNR':
        g = np.load('../../s1-zero-flow-dynamics/data/zeta_1e7.npy')[:200000]; tot = 2 * np.sum(fhat(g, a) ** 2)
        d = ctl.TNR_THETA / math.log(3); h = (2 * np.arange(0, 400000) + 1) * np.pi / math.log(3); zz = h - 1j * d
        tot += 2 * 2 * np.sum((fhat(zz, a) * np.conj(fhat(np.conj(zz), a))).real)
        return tot
    if code.startswith('EA-'):
        g = np.load('../../s1-zero-flow-dynamics/data/zeta_1e7.npy')[:200000]; d = eval(code[3:]); zz = g - 1j * d
        return 2 * 2 * np.sum((fhat(zz, a) * np.conj(fhat(np.conj(zz), a))).real)
for code in ('ZETA', 'DH', 'TNR', 'EA-1/4', 'EA-1/2'):
    for a in (0.5, 1.5, 3.0):
        K = 4; w, sig, tau, nt = combo3.sigma_tau(code, a, K); Q = combo3.build_Q(a, K, sig, tau)
        c = np.zeros(2 * K + 1); c[K] = 3 / 8; c[K + 1] = c[K - 1] = .25; c[K + 2] = c[K - 2] = 1 / 16
        print(code, a, 'prime side %.10f zero side %.10f' % (c @ Q @ c, zero_side(code, a)))
