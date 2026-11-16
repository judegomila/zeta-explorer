# Function-field model of the Pick-order horizon: genus-g "curve" with all zeros on the circle,
# plus one planted off-circle quartet r^{+-1} e^{+-i theta0}. First indefinite real-node Pick order.
import sys, mpmath as mp

def vdc(n, base=2):
    v, d = mp.mpf(0), mp.mpf(1)
    while n:
        d *= base; v += (n % base) / d; n //= base
    return v

def first_indef(zf, lo, hi, Kmax):
    mp.mp.dps = 60 + 12 * Kmax
    z = zf()
    xs = [mp.exp(mp.log(lo) + (mp.log(hi) - mp.log(lo)) * vdc(i + 1)) for i in range(Kmax)]
    us = [mp.exp(-x) for x in xs]
    h = [mp.re(sum((1 + u * zj) / (1 - u * zj) for zj in z)) / 2 for u in us]
    A = [[(h[i] + h[k]) / (1 - us[i] * us[k]) for k in range(Kmax)] for i in range(Kmax)]
    # LDL^T without pivoting
    L = [[mp.mpf(0)] * Kmax for _ in range(Kmax)]; D = []
    for j in range(Kmax):
        d = A[j][j] - sum(L[j][k] ** 2 * D[k] for k in range(j))
        if d <= 0:
            return j + 1, d
        D.append(d)
        for i in range(j + 1, Kmax):
            L[i][j] = (A[i][j] - sum(L[i][k] * L[j][k] * D[k] for k in range(j))) / d
    return None, D[-1]

def model(g, n, r, spacing="equal"):
    return (lambda: _model(g, n, mp.mpf(r), spacing)[0]), None

def _model(g, n, r, spacing="equal"):
    if spacing == "equal":
        th = [mp.pi * (j - mp.mpf(1) / 2) / g for j in range(1, g + 1)]
    else:  # log-dense like zeta: theta_j ~ increasing density
        th = [mp.pi * (mp.mpf(j) / (g + 1)) ** mp.mpf('0.7') for j in range(1, g + 1)]
    z = []
    for t in th:
        z += [mp.expjpi(t / mp.pi), mp.expjpi(-t / mp.pi)]
    if n is not None:
        t0 = (th[n - 1] + (th[n] if n < g else mp.pi)) / 2 if n >= 1 else th[0] / 2
        for rr in (r, 1 / r):
            z += [rr * mp.expjpi(t0 / mp.pi), rr * mp.expjpi(-t0 / mp.pi)]
    return z, th

if __name__ == "__main__":
    g = int(sys.argv[1]); r = sys.argv[2]; spacing = sys.argv[3] if len(sys.argv) > 3 else "equal"
    Kmax = 2 * g + 5
    s = mp.pi / g
    s = float(s)
    fams = [(0.01 * s, 0.5 * s), (0.1 * s, 3 * s), (0.3 * s, 30 * s)]
    z, th = model(g, None, r, spacing)
    for lo, hi in fams:
        K, d = first_indef(z, lo, hi, 2 * g)
        print("control (no quartet), x in [%.3g,%.3g]: first indefinite order within 2g: %s ; pivot 2g = %s" % (lo, hi, K, mp.nstr(d, 5)), flush=True)
    print("g=%d r=%s spacing=%s; inertia bound K* <= 2g+3 = %d" % (g, r, spacing, 2 * g + 3))
    print(" n = number of on-circle zero pairs with angle below the planted quartet")
    for n in range(0, g + 1):
        z, th = model(g, n, r, spacing)
        res = []
        for lo, hi in fams:
            K, d = first_indef(z, lo, hi, Kmax)
            res.append(K)
        print("  n=%2d  K* by node family %s   min=%s   2n+3=%d" % (n, res, min(k for k in res if k), 2 * n + 3), flush=True)
