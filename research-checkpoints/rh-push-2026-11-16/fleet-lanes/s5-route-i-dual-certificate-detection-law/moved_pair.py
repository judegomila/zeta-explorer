"""Background dependence of the detection support: a quadruple ADDED to zeta against a quadruple that REPLACES two
neighbouring on-line zeros (the two zeros are deleted: kernel -2 cos(gamma_j u) each; DH's off-line zeros are of this kind)."""
import math, numpy as np, mpmath as mp
from symlib import *
mp.mp.dps = 20
def expAB(k, a): 
    e = np.exp(2 * a * k); return (e - 1) / k, (e - 1 - 2 * a * k) / (k * k)
for n0 in (649, 10142):
    g1, g2 = float(mp.zetazero(n0).imag), float(mp.zetazero(n0 + 1).imag); g0 = (g1 + g2) / 2
    L = math.log(g0 / 2 / math.pi)
    o = twist_coefficients(make_object('ZETA', math.exp(10.5) + 2), g0)
    print('zeros %.4f, %.4f (gap %.3f, mean spacing %.3f), quadruple at %.4f, L = %.3f' % (g1, g2, g2 - g1, 2 * math.pi / L, g0, L))
    res = {}
    for twoa in np.arange(1.0, 10.01, 0.05):
        a = twoa / 2
        nu = lattice(a, 40.0, 2.0, g0)
        A, B = symbols(o, nu, a, prime_center=g0)
        M, G = loewner(nu, A, B, a)
        lam, V = np.linalg.eigh(G); keep = lam > 1e-9 * lam[-1]; Wm = V[:, keep] / np.sqrt(lam[keep])[None, :]
        Ar = np.zeros(len(nu), complex); Br = np.zeros(len(nu), complex)
        for gj in (g1, g2):
            for s2 in (1, -1):
                dA, dB = expAB(1j * (nu + s2 * gj) + 1e-300, a); Ar -= dA; Br -= dB
        Mr, _ = loewner(nu, Ar, Br, a)
        for b in (0.4, 0.3, 0.2, 0.1, 0.01):
            Ap = np.zeros(len(nu), complex); Bp = np.zeros(len(nu), complex)
            for s1 in (1, -1):
                for s2 in (1, -1):
                    dA, dB = expAB(s1 * b + 1j * (nu + s2 * g0), a); Ap += dA; Bp += dB
            Mp, _ = loewner(nu, Ap, Bp, a)
            for tag, Mt in (('added', M + Mp), ('moved', M + Mp + Mr)):
                Mw = Wm.T @ Mt @ Wm; w = np.linalg.eigvalsh((Mw + Mw.T) / 2)[0]
                if w < -1e-7 and (tag, b) not in res: res[(tag, b)] = twoa
    for b in (0.4, 0.3, 0.2, 0.1, 0.01):
        print('  b = %.2f: 2a* added %s (c = %.3f)   moved %s (c = %.3f)' % (b, '%.2f' % res.get(('added', b), float('nan')), res.get(('added', b), float('nan')) / L,
              '%.2f' % res.get(('moved', b), float('nan')), res.get(('moved', b), float('nan')) / L))
