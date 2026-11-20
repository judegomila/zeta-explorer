"""Twisted Selberg zeta Z_{Gamma(2)}(s, chi) = Z_{PSL2(Z)}(s, Ind chi) via a two-step Mayer transfer operator.
chi(A) = e(a), chi(B) = e(b), A = [[1,2],[0,1]], B = [[1,0],[2,1]] (free generators of Gamma(2)/+-1).
Z = det(1 - K_X K_Y), (K_X F)(z) = sum_{n>=1} X^n (z+n)^{-2s} F(1/(z+n)), X = rho(T)^-1, Y = rho(L)^-1.
Taylor basis at z = 1, truncation K (convergence in K is measured, not bounded)."""
import cmath, math
from math import comb
import numpy as np
from flint import acb, arb, acb_mat, ctx

T = ((1, 1), (0, 1)); L = ((1, 0), (1, 1)); S = ((0, -1), (1, 0))
def mul(x, y):
    return ((x[0][0]*y[0][0]+x[0][1]*y[1][0], x[0][0]*y[0][1]+x[0][1]*y[1][1]),
            (x[1][0]*y[0][0]+x[1][1]*y[1][0], x[1][0]*y[0][1]+x[1][1]*y[1][1]))
def inv(x):
    return ((x[1][1], -x[0][1]), (-x[1][0], x[0][0]))
def in_gamma2(g):
    return g[0][1] % 2 == 0 and g[1][0] % 2 == 0
def ab_exponents(g):
    """image of g in Gamma(2)^ab = Z^2 (total exponents of A and B)."""
    a, b = g[0][0], g[0][1]; c, d = g[1][0], g[1][1]
    assert a % 2 and d % 2 and b % 2 == 0 and c % 2 == 0
    nA = nB = 0
    while b != 0:
        if abs(b) > abs(a):
            k = -round(b / (2 * a))  # exact for our sizes; fix below
            k = -((b + abs(a)) // (2 * a)) if a > 0 else -((b - abs(a)) // (2 * a))
            # choose k minimising |b + 2ka|
            best = min((abs(b + 2 * kk * a), kk) for kk in (k - 1, k, k + 1))
            k = best[1]
            # g -> g A^k ; g = g' A^{-k}
            b += 2 * k * a; d += 2 * k * c; nA -= k
        else:
            k0 = -(a // (2 * b))
            best = min((abs(a + 2 * kk * b), kk) for kk in (k0 - 1, k0, k0 + 1))
            k = best[1]
            a += 2 * k * b; c += 2 * k * d; nB -= k
    assert abs(a) == 1
    if a == -1: c = -c
    nB += c // 2
    return nA, nB
REPS = [((1, 0), (0, 1)), T, S, mul(S, T), mul(T, S), mul(mul(T, S), T)]
def rho(g, a, b):
    R = np.zeros((6, 6), dtype=complex)
    for i, ri in enumerate(REPS):
        for j, rj in enumerate(REPS):
            h = mul(mul(ri, g), inv(rj))
            if in_gamma2(h):
                nA, nB = ab_exponents(h)
                R[i, j] = cmath.exp(2j * math.pi * (a * nA + b * nB))
    return R
def rho_exact_phases(g):
    """returns 6x6 list of None or (nA, nB)"""
    out = [[None] * 6 for _ in range(6)]
    for i, ri in enumerate(REPS):
        for j, rj in enumerate(REPS):
            h = mul(mul(ri, g), inv(rj))
            if in_gamma2(h): out[i][j] = ab_exponents(h)
    return out

def scalar_op(s, theta, K):
    """matrix of k_theta: f -> sum_n e(theta n)(z+n)^{-2s} f(1/(z+n)); theta an arb (mod 1)."""
    s = acb(s)
    th = arb(theta)
    frac = th - th.floor()
    is_zero = abs(float(frac.mid())) < 1e-14 or abs(float(frac.mid()) - 1) < 1e-14
    if is_zero:
        H = [(2 * s + q).zeta(acb(2)) for q in range(2 * K + 1)]
    else:
        u = (acb(0, 2) * acb.pi() * th).exp()
        H = [(u.polylog(2 * s + q) - u) / u for q in range(2 * K + 1)]
    poch = [[None] * K for _ in range(K)]
    for j in range(K):
        v = acb(1); poch[j][0] = v
        for m in range(1, K):
            v = v * (2 * s + j + m - 1) / m; poch[j][m] = v
    M = [[None] * K for _ in range(K)]
    for m in range(K):
        sg = -1 if m % 2 else 1
        for k in range(K):
            tot = acb(0)
            for j in range(k + 1):
                c = comb(k, j) * (1 if (k - j) % 2 == 0 else -1)
                tot += c * poch[j][m] * H[j + m]
            M[m][k] = sg * tot
    return M

def eig_unitary(U):
    """numpy eigen-decomposition of a unitary matrix: phases theta_i (in turns) and projectors."""
    w, V = np.linalg.eig(U)
    Vi = np.linalg.inv(V)
    th = np.angle(w) / (2 * math.pi)
    return th, V, Vi

def _np(Ml, K):
    return np.array([[complex(float(Ml[i][j].real.mid()), float(Ml[i][j].imag.mid())) for j in range(K)] for i in range(K)])

_cache = {}
def scalar_np(s, key, K, prec):
    ck = (complex(s), key, K, prec)
    if ck not in _cache:
        if len(_cache) > 400: _cache.clear()
        old = ctx.prec; ctx.prec = prec
        try:
            Ml = scalar_op(s, key, K)
            bad = max(float(Ml[i][j].real.rad()) + float(Ml[i][j].imag.rad()) for i in range(K) for j in range(K))
            assert bad < 1e-25, ('entry radius', bad)
            _cache[ck] = _np(Ml, K)
        finally:
            ctx.prec = old
    return _cache[ck]

def ops(s, a, b, K=36, prec=800):
    X = np.linalg.inv(rho(T, a, b)); Y = np.linalg.inv(rho(L, a, b))
    def big(U):
        th, V, Vi = eig_unitary(U)
        Bg = np.zeros((6 * K, 6 * K), dtype=complex)
        for i in range(6):
            key = round(float(th[i]) % 1.0, 12)
            if key > 1 - 1e-11: key = 0.0
            Bg += np.kron(np.outer(V[:, i], Vi[i, :]), scalar_np(s, key, K, prec))
        return Bg
    return big(X), big(Y)

def Ztw(s, a, b, K=36, prec=800):
    """Z_{Gamma(2)}(s, chi_{a,b}). Entries computed in Arb at `prec` bits (radius asserted < 1e-25), then float64 linear algebra."""
    KX, KY = ops(s, a, b, K, prec)
    return complex(np.linalg.det(np.eye(6 * K) - KX @ KY))

def Zmod(s, K=40, prec=800):
    """Z_{PSL2(Z)}(s) = det(1 - L_s^2), trivial representation."""
    M = scalar_np(s, 0.0, K, prec)
    return complex(np.linalg.det(np.eye(K) - M @ M))

def euler_logZ(slist, a, b, tmax):
    """log Z(s,chi) from closed words: -sum_w (1/k_w) tr rho(M_w)^-1 N^-s/(1-N^-1), trace(M_w) <= tmax."""
    X = np.linalg.inv(rho(T, a, b)); Y = np.linalg.inv(rho(L, a, b))
    thx, Vx, Vxi = eig_unitary(X); thy, Vy, Vyi = eig_unitary(Y)
    def powm(th, V, Vi, n):
        return (V * np.exp(2j * math.pi * th * n)) @ Vi
    px = {}; py = {}
    acc = [0j for _ in slist]; count = 0; ntriv = [0j for _ in slist]
    stack = [((1, 0, 0, 1), np.eye(6, dtype=complex), 0)]
    while stack:
        (p, q, r, t), W, k = stack.pop()
        # extend by (n, m): operator weight X^n Y^m, matrix g -> L^m T^n g ... use trace only (cyclic)
        n = 1
        while True:
            # multiply current matrix by T^n on the right
            p1, q1, r1, t1 = p, q + n * p, r, t + n * r
            if p1 + t1 > tmax and k > 0 and n > 1 and False: break
            m = 1; any_ok = False
            while True:
                # then by L^m on the right: [[p1+m q1, q1],[r1+m t1, t1]]
                p2, q2, r2, t2 = p1 + m * q1, q1, r1 + m * t1, t1
                tr = p2 + t2
                if tr > tmax: break
                any_ok = True
                if n not in px: px[n] = powm(thx, Vx, Vxi, n)
                if m not in py: py[m] = powm(thy, Vy, Vyi, m)
                W2 = W @ px[n] @ py[m]
                N = ((tr + math.sqrt(tr * tr - 4)) / 2) ** 2
                trW = np.trace(W2)
                count += 1
                for i, s in enumerate(slist):
                    term = N ** (-s) / (1 - 1 / N) / (k + 1)
                    acc[i] -= trW * term; ntriv[i] -= 6 * term
                stack.append(((p2, q2, r2, t2), W2, k + 1))
                m += 1
            if not any_ok: break
            n += 1
    return acc, ntriv, count
