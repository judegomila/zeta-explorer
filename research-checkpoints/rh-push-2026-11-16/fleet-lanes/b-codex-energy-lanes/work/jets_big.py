"""High-order derivative jets J_N(0) of the cutoff-energy kernel (PR 45 hierarchy) for
zeta, zero-inserted kernels and the Davenport-Heilbronn kernel.

J_mn = int_0^inf [2u k^(m) k^(n) + m k^(m-1) k^(n) + n k^(m) k^(n-1)] du   (alpha = 1).
Parity blocks (m,n both even / both odd) are factored separately by LDL^T on the
diagonally normalised block; the number of negative pivots of the leading j x j block
equals its number of negative eigenvalues (Sylvester), provided no pivot is ~0.
Run at step h and h/2; a sign pattern is reported only as MEASURED.

usage: jets_big.py N dps hinv kernels procs      kernels e.g. zeta,DH,s3,s8
"""
import sys, json, time
from multiprocessing import Pool
import mpmath as mp

N = int(sys.argv[1]); DPS = int(sys.argv[2]); HINV = int(sys.argv[3])
WHICH = sys.argv[4].split(','); PROCS = int(sys.argv[5])
GUARD = int(sys.argv[6]) if len(sys.argv) > 6 else 2 * N + 60
XHI = float(sys.argv[7]) if len(sys.argv) > 7 else 8.5
SINGLE = len(sys.argv) > 8 and sys.argv[8] == 'single'
mp.mp.dps = DPS + GUARD


def polys(p0, shift, jmax):
    out = [list(p0)]
    for _ in range(jmax):
        p = out[-1]
        q = [mp.mpf(0)] * (len(p) + 1)
        for k, c in enumerate(p):
            q[k] += (k + shift) * c
            q[k + 1] -= c
        out.append(q)
    return out


def spec(w):
    if w == 'zeta' or w.startswith('s'):
        return dict(lam=mp.pi, shift=mp.mpf(1) / 4, p0=[mp.mpf(0), mp.mpf(-3), mp.mpf(2)], dh=False)
    return dict(lam=mp.pi / 5, shift=mp.mpf(3) / 4, p0=[mp.mpf(1)], dh=True)


KAP = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
AW = {1: mp.mpf(1), 2: KAP, 3: -KAP, 4: mp.mpf(-1), 0: mp.mpf(0)}
_G = {}


def init(w):
    mp.mp.dps = DPS + GUARD
    sp = spec(w)
    extra = 4 if w.startswith('s') else 0
    _G['sp'] = sp
    _G['P'] = [p[::-1] for p in polys(sp['p0'], sp['shift'], N + extra)]
    _G['extra'] = extra
    if w.startswith('s'):
        rho = mp.mpc('0.3', w[1:])
        a = 4 / rho ** 2
        _G['c'] = (mp.mpf(1), -2 * a.real, abs(a) ** 2)


def node_vals(u):
    """derivatives 0..N of the kernel at u >= 0."""
    sp, P, extra = _G['sp'], _G['P'], _G['extra']
    e = mp.exp(u)
    M = N + extra
    acc = [mp.mpf(0)] * (M + 1)
    n = 1
    cutoff = (DPS + GUARD) * mp.log(10) + 50
    while True:
        t = sp['lam'] * n * n * e
        if t > cutoff + 3 * M and n > 1:
            break
        w = AW[n % 5] * n if sp['dh'] else 1
        if w != 0:
            et = mp.exp(-t) * w
            for j in range(M + 1):
                acc[j] += mp.polyval(P[j], t) * et
        n += 1
    pre = mp.exp(sp['shift'] * u)
    acc = [pre * x for x in acc]
    if extra:
        c0, c2, c4 = _G['c']
        acc = [c0 * acc[j] + c2 * acc[j + 2] + c4 * acc[j + 4] for j in range(N + 1)]
    return acc


def nodes(h, xlo=-7, xhi=None):
    """u = log(1 + exp(x - e^{-x})): double-exponential at 0, linear (du = dx) for large u,
    so that the step in u stays h where the high derivatives carry their mass."""
    if xhi is None:
        xhi = XHI
    out = []
    x = mp.mpf(xlo)
    while x <= xhi:
        E = mp.exp(x - mp.exp(-x))
        u = mp.log1p(E)
        out.append((u, (1 + mp.exp(-x)) * E / (1 + E) * h))
        x += h
    return out


def jet(w, h, pool):
    nd = nodes(h)
    vals = pool.map(node_vals, [u for u, _ in nd], chunksize=4)
    J = [[None] * (N + 1) for _ in range(N + 1)]
    I = [[None] * (N + 1) for _ in range(N + 1)]
    B = [[None] * (N + 1) for _ in range(N + 1)]
    for m in range(N + 1):
        for n in range(m, N + 1):
            I[m][n] = I[n][m] = mp.fsum(wt * u * v[m] * v[n] for (u, wt), v in zip(nd, vals))
            B[m][n] = B[n][m] = mp.fsum(wt * v[m] * v[n] for (u, wt), v in zip(nd, vals))
    for m in range(N + 1):
        for n in range(N + 1):
            J[m][n] = 2 * I[m][n] + (m * B[m - 1][n] if m else 0) + (n * B[m][n - 1] if n else 0)
    return J


def ldl_block(J, par):
    idx = list(range(par, N + 1, 2))
    d = [mp.sqrt(abs(J[i][i])) for i in idx]
    A = [[J[i][j] / (d[a] * d[b]) for b, j in enumerate(idx)] for a, i in enumerate(idx)]
    n = len(idx)
    piv = []
    L = [[mp.mpf(0)] * n for _ in range(n)]
    for j in range(n):
        s = A[j][j] - mp.fsum(L[j][k] ** 2 * piv[k] for k in range(j))
        piv.append(s)
        for i in range(j + 1, n):
            L[i][j] = (A[i][j] - mp.fsum(L[i][k] * L[j][k] * piv[k] for k in range(j))) / s
    return idx, piv


if __name__ == '__main__':
    res = {}
    for w in WHICH:
        t0 = time.time()
        with Pool(PROCS, initializer=init, initargs=(w,)) as pool:
            J1 = jet(w, mp.mpf(1) / HINV, pool)
            J2 = J1 if SINGLE else jet(w, mp.mpf(1) / (2 * HINV), pool)
        qerr = max(abs(J1[i][j] - J2[i][j]) / mp.sqrt(abs(J2[i][i] * J2[j][j])) for i in range(N + 1) for j in range(N + 1))
        r = {'N': N, 'dps': DPS, 'guard': GUARD, 'hinv': HINV, 'quad_diff_h_vs_h/2': mp.nstr(qerr, 3), 'seconds': None}
        for par, nm in ((0, 'even'), (1, 'odd')):
            idx1, p1 = ldl_block(J1, par)
            idx2, p2 = ldl_block(J2, par)
            neg1 = [idx1[i] for i, p in enumerate(p1) if p < 0]
            neg2 = [idx2[i] for i, p in enumerate(p2) if p < 0]
            r[nm] = {'orders_with_negative_pivot_h': neg1, 'orders_with_negative_pivot_h/2': neg2,
                     'pivots_h/2': {str(idx2[i]): mp.nstr(p, 5) for i, p in enumerate(p2)},
                     'min_abs_pivot_h/2': mp.nstr(min(abs(p) for p in p2), 4)}
        r['seconds'] = round(time.time() - t0, 1)
        res[w] = r
        print(w, json.dumps(r), flush=True)
