"""CHECK 1 (PR 44 separated-tail theorem), independent of the PR scripts.
 (a) envelope (2.1): 1 - 3e^{-t}/(2pi) <= L(t) <= 1 on a grid;
 (b) (3.2): |C(U,V) - sech(d/2)| <= [eta_R + (1+eta_R) d^2/(8R^2)] sech(d/2), by direct quadrature of H;
 (c) (4.1): lambda_min of separated sech Gram >= ell_delta;
 (d) table margins ell_delta - E_{R,delta};
 (e) direct lambda_min of the normalised Gram of H on random separated tail configurations,
     for zeta, for the zero-inserted kernel kappa_sharp, and for the DH kernel.
"""
import sys, random, json
import mpmath as mp
from kern import zeta_kernel, dh_kernel, sharp_kernel

mp.mp.dps = 40
random.seed(20261116)
out = {}
Z = zeta_kernel()

# (a) envelope
worst_lo, worst_hi = mp.inf, -mp.inf
for i in range(0, 401):
    t = mp.mpf(i) / 50          # 0..8
    L = Z(t) / (2 * mp.pi ** 2 * mp.exp(mp.mpf(9) / 4 * t - mp.pi * mp.exp(t)))
    lo = L - (1 - 3 * mp.exp(-t) / (2 * mp.pi))
    hi = 1 - L
    worst_lo, worst_hi = min(worst_lo, lo), max(worst_hi, -hi)
out['a_envelope_min_L_minus_lower'] = mp.nstr(worst_lo, 8)
out['a_envelope_max_L_minus_1'] = mp.nstr(worst_hi, 8)
assert worst_lo >= -mp.mpf(10)**-30 and worst_hi <= 0


def Hval(k, lam, U, V):
    """H(U,V)/alpha = int_0^inf (U+V+2s) k(U+s) k(V+s) ds, U,V>=0 (direct quadrature)."""
    Lam = lam * (mp.exp(U) + mp.exp(V))
    f = lambda s: (U + V + 2 * s) * k(U + s) * k(V + s)
    pts = [0] + [mp.mpf(x) / Lam for x in (0.5, 2, 6, 15, 40, 100)]
    return mp.quad(f, pts)


def eta(R):
    e = mp.exp(-R)
    d, b, c = 3 * e / (2 * mp.pi), e / (2 * mp.pi * R), 7 * e / (4 * mp.pi)
    return (1 - d) ** -4 * (1 / (1 - c) + b / (1 - c) ** 2) - 1


# (b) (3.2) at small R where the bound has content
worst = mp.mpf(0)
for R in (1, 1.5, 2, 3, 5):
    R = mp.mpf(R)
    for _ in range(12):
        U = R + mp.mpf(random.random()) * 3
        V = R + mp.mpf(random.random()) * 3
        C = Hval(Z, mp.pi, U, V) / mp.sqrt(Hval(Z, mp.pi, U, U) * Hval(Z, mp.pi, V, V))
        dd = abs(U - V)
        lhs = abs(C - mp.sech(dd / 2))
        rhs = (eta(R) + (1 + eta(R)) * dd ** 2 / (8 * R ** 2)) * mp.sech(dd / 2)
        worst = max(worst, lhs / rhs)
        assert lhs <= rhs, (R, U, V, lhs, rhs)
out['b_max_ratio_lhs_over_rhs_(3.2)'] = mp.nstr(worst, 8)


def ell(delta):
    return (4 - mp.pi ** 2 / 3) / delta * mp.sech(4 * mp.pi / delta)


def E(R, delta):
    e = eta(R)
    return 4 * e / (mp.exp(delta / 2) - 1) + 32 * (1 + e) / (mp.e ** 2 * R ** 2 * (mp.exp(delta / 4) - 1))


def lam_min(M):
    ev = mp.eigsy(M, eigvals_only=True)
    return min(ev)


# (c) sech Gram lower bound
res_c = {}
for delta in (0.5, 1, 2, 4, 8):
    delta = mp.mpf(delta)
    best = mp.inf
    for trial in range(6):
        n = 14
        pts = [mp.mpf(0)]
        for _ in range(n - 1):
            gap = delta * (1 + (mp.mpf(random.random()) * 0.5 if trial else 0))
            pts.append(pts[-1] + gap)
        G = mp.matrix(n, n)
        for i in range(n):
            for j in range(n):
                G[i, j] = mp.sech((pts[i] - pts[j]) / 2)
        best = min(best, lam_min(G))
    res_c[str(delta)] = {'lam_min_sech_gram': mp.nstr(best, 8), 'ell_delta': mp.nstr(ell(delta), 8)}
    assert best >= ell(delta)
out['c_sech_gram'] = res_c

# (d) table
tab = {}
for delta, R in ((0.5, 1200000), (1, 2000), (2, 100), (4, 20), (8, 8)):
    m = ell(mp.mpf(delta)) - E(mp.mpf(R), mp.mpf(delta))
    tab[f'delta={delta},R={R}'] = mp.nstr(m, 6)
    assert m > 0
out['d_table_margins'] = tab

# (e) direct Gram of H, three kernels
DH = dh_kernel()
SH = sharp_kernel(mp.mpc('0.3', '3'))
res_e = {}
for name, k, lam in (('zeta', Z, mp.pi), ('sharp(rho=0.3+3i)', SH, mp.pi), ('DH', DH, mp.pi / 5)):
    for delta, R in ((8, 8), (4, 20), (2, 6), (1, 6)):
        n = 8
        pts = [mp.mpf(R)]
        for _ in range(n - 1):
            pts.append(pts[-1] + delta * (1 + mp.mpf(random.random()) * 0.3))
        Hm = mp.matrix(n, n)
        for i in range(n):
            for j in range(i, n):
                Hm[i, j] = Hm[j, i] = Hval(k, lam, pts[i], pts[j])
        Cn = mp.matrix(n, n)
        Sg = mp.matrix(n, n)
        for i in range(n):
            for j in range(n):
                Cn[i, j] = Hm[i, j] / mp.sqrt(Hm[i, i] * Hm[j, j])
                Sg[i, j] = mp.sech((pts[i] - pts[j]) / 2)
        res_e[f'{name} delta={delta} R={R}'] = {
            'lam_min_normalised_H': mp.nstr(lam_min(Cn), 8),
            'lam_min_sech': mp.nstr(lam_min(Sg), 8),
            'max_entry_dev_from_sech': mp.nstr(max(abs(Cn[i, j] - Sg[i, j]) for i in range(n) for j in range(n)), 4),
            'theorem_margin(zeta only)': mp.nstr(ell(mp.mpf(delta)) - E(mp.mpf(R), mp.mpf(delta)), 6),
        }
out['e_direct_gram'] = res_e
print(json.dumps(out, indent=1))
