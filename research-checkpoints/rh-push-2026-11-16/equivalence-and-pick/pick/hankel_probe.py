"""Diagnostic (midpoint, non-rigorous): local Loewner/Hankel matrices
M_K(f;u)=[f^{(i+j-1)}(u)/(i+j-1)!] for f=-h and f=j=u*h, scaled to unit
diagonal; prints smallest eigenvalue over a log grid of u."""
import sys; sys.path.insert(0, '.')
from xi_series import h_coeffs
from flint import arb
import mpmath as mp
mp.mp.dps = 60
KMAX = int(sys.argv[1]) if len(sys.argv) > 1 else 8

def mats(u, K):
    c = h_coeffs(u, 2 * K + 1, prec=400)          # h^{(m)}/m!
    cm = [mp.mpf(x.mid().str(50, radius=False)) for x in c]
    uu = mp.mpf(u)
    # -h coefficients
    mh = [-x for x in cm]
    # j = u h : j^{(m)}/m! = u*c_m + c_{m-1}
    jc = [uu * cm[0]] + [uu * cm[m] + cm[m - 1] for m in range(1, 2 * K)]
    out = {}
    for name, f in (("-h", mh), ("j", jc)):
        M = mp.matrix(K, K)
        for i in range(K):
            for k in range(K):
                M[i, k] = f[i + k + 1]
        d = [mp.sqrt(abs(M[i, i])) for i in range(K)]
        sgn = [M[i, i] > 0 for i in range(K)]
        N = mp.matrix(K, K)
        for i in range(K):
            for k in range(K):
                N[i, k] = M[i, k] / (d[i] * d[k])
        ev = mp.eigsy(N)[0]
        out[name] = (min(ev), all(sgn))
    return out

us = [10.0 ** e for e in [-3, -1, 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 30]]
if __name__ == "__main__":
      for K in range(3, KMAX + 1):
        worst = {"-h": (1, None), "j": (1, None)}
        for u in us:
            o = mats(u, K)
            for nm in o:
                if o[nm][0] < worst[nm][0]:
                    worst[nm] = (o[nm][0], u)
                if not o[nm][1]:
                    print("nonpositive diagonal", K, nm, u)
        print(K, {k: (mp.nstr(v[0], 5), v[1]) for k, v in worst.items()})
