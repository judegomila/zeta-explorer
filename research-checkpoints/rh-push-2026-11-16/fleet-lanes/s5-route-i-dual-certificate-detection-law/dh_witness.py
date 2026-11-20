"""DH ground vector just past the onset: share of the form carried by the first off-line quadruple(s).
W(g) = sum over zeros; the quadruple (1/2 +- b +- i g0) contributes c^T M_pair c with the planted symbols."""
import math, numpy as np
from symlib import *
OFF = [(85.699348, 0.308517), (114.163343, 0.150830), (166.479306, 0.074356), (176.702461, 0.224258)]
for twoa in (3.5, 3.6, 3.8, 4.0, 4.5):
    a = twoa / 2
    o = make_object('DH', math.exp(twoa) + 1)
    w, nu, vec, rank = lam_min(o, a, 240.0, 2.0, want_vec=True)
    c = vec[:, 0]
    _, G = loewner(nu, np.zeros(len(nu), complex), np.zeros(len(nu), complex), a)
    nrm = c @ G @ c
    parts = []
    for g0, b in OFF:
        A2 = np.zeros(len(nu), complex); B2 = np.zeros(len(nu), complex)
        for s1 in (1, -1):
            for s2 in (1, -1):
                k = s1 * b + 1j * (nu + s2 * g0)
                A2 += (np.exp(2 * a * k) - 1) / k; B2 += (np.exp(2 * a * k) - 1 - 2 * a * k) / (k * k)
        Mp, _ = loewner(nu, A2, B2, a); parts.append(c @ Mp @ c / nrm)
    t = np.linspace(0, 240, 48001); d = t[:, None] - nu[None, :]
    with np.errstate(all='ignore'): S = np.where(np.abs(d) < 1e-12, 2 * a, 2 * np.sin(d * a) / d)
    g2 = (S @ c) ** 2; dt = t[1] - t[0]; tot = math.pi * nrm      # int_0^inf |ghat|^2 = pi ||g||^2 for the symmetric part
    print('2a = %.2f lambda_min % .4e ; quadruple contributions (85.70, 114.16, 166.48, 176.70): %s ; rest % .3e ; mass of |ghat|^2 in t<40: %.3f, 75..96: %.3f' % (
        twoa, w[0], ' '.join('% .3e' % p for p in parts), w[0] - sum(parts), g2[t < 40].sum() * dt / tot, g2[(t > 75) & (t < 96)].sum() * dt / tot))
