"""s1-klein-annulus-energy, combination (4), first statement: distance in S^4 between the image of a zero (w, eta) and the
image of its reflection R(w, eta) = (1/conj w, conj eta/conj w^2), Z = [1 : w : w^2 : eta], w = 1 - 1/s (lens L = 1).
On-line zeros have |w| = 1 and R(w, eta) = (w, eta) on the oval, so the distance is 0.  usage: c4_fixed.py out.json"""
import json, sys, math, cmath
import numpy as np

def s4(Z):
    Z = np.array(Z, dtype=complex); Z = Z / math.sqrt((abs(Z) ** 2).sum())
    A = Z[0] * np.conj(Z[2]) + np.conj(Z[1]) * Z[3]; B = Z[1] * np.conj(Z[2]) - np.conj(Z[0]) * Z[3]
    return np.array([2 * A.real, 2 * A.imag, 2 * B.real, 2 * B.imag, abs(Z[0]) ** 2 + abs(Z[1]) ** 2 - abs(Z[2]) ** 2 - abs(Z[3]) ** 2])

def dist(s, r=1.5):
    w = 1 - 1 / s
    eta = cmath.sqrt((w * w + r * r) * (w * w + r ** -2))
    w2 = 1 / w.conjugate(); eta2 = eta.conjugate() / w.conjugate() ** 2
    assert abs(eta2 ** 2 - (w2 * w2 + r * r) * (w2 * w2 + r ** -2)) < 1e-9 * (1 + abs(eta2) ** 2)
    return float(np.linalg.norm(s4([1, w, w * w, eta]) - s4([1, w2, w2 * w2, eta2]))), abs(w)

if __name__ == '__main__':
    out = []
    zz = json.load(open('tables/zeros_ZETA.json'))['gamma'][:5]
    for g in zz:
        d, aw = dist(complex(0.5, float(g))); out.append(dict(obj='ZETA', beta=0.5, gamma=float(g), dist=d, absw=aw))
    for b, g, _ in json.load(open('tables/zeros_DH.json'))['offline'][:8]:
        d, aw = dist(complex(float(b), float(g))); x0 = float(b) - 0.5
        out.append(dict(obj='DH', beta=float(b), gamma=float(g), dist=d, absw=aw, x0_over_gamma2=x0 / float(g) ** 2, dist_over_that=d / (x0 / float(g) ** 2)))
    for x in (0.01, 0.1, 0.3):
        for g in (10.0, 100.0, 1000.0):
            d, aw = dist(complex(0.5 + x, g)); out.append(dict(obj='synthetic', beta=0.5 + x, gamma=g, dist=d, dist_over_x0_gamma2=d / (x / g ** 2)))
    for r in out: print(r)
    json.dump(out, open(sys.argv[1], 'w'), indent=1)
