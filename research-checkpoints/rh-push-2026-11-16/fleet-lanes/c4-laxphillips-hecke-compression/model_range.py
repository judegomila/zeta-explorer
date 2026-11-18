"""Decisive test. Lax-Phillips functional model for the Eisenstein channel.
Spectral variable z (U(t) = mult. by e^{i z t} on L^2(R)), s = 1/2 - i z, S(z) = phi(1/2 - i z).
Resonances: zeros of S in Im z > 0 at z = +-gamma/2 + i(1 - beta)/2 for rho = beta + i gamma.
e_j(sigma) = 1/(sigma - conj z_j) lie in K_S = H^2 - S H^2, Z(t)^* e_j = exp(-i conj(z_j) t) e_j.
Gram G_jk = <e_j, e_k> = int conj(e_j) e_k = 2 pi i/(z_j - conj z_k).
On the a.c. part T_p = U(log p) + U(-log p); its compression to K is Z_p + Z_p^*, Z_p = Z(log p).
Numerical range of the compression on V = span e_j: generalized eigenvalues of (G D + D^H G, G).
"""
import sys, json
from mpmath import mp, mpf, mpc, matrix, zetazero, cholesky, eigh, exp, log, pi, zeta, gamma, cos, re, im, fabs
mp.dps = 80

def gram(zs):
    n = len(zs); G = matrix(n, n)
    for j in range(n):
        for k in range(n):
            G[j, k] = 2 * pi * 1j / (zs[j] - zs[k].conjugate())
    return G

def numrange(zs, p):
    n = len(zs); G = gram(zs)
    d = [exp(-1j * z.conjugate() * log(p)) for z in zs]
    H = matrix(n, n)
    for j in range(n):
        for k in range(n):
            H[j, k] = G[j, k] * d[k] + d[j].conjugate() * G[j, k]
    L = cholesky(G)            # G = L L^H
    Li = L ** -1
    M = Li * H * Li.H
    M = (M + M.H) / 2
    ev = eigh(M, eigvals_only=True)
    return min(ev), max(ev), min(eigh(G, eigvals_only=True))

def resonances(gammas, betas):
    zs = []
    for g, b in zip(gammas, betas):
        y = (1 - b) / 2
        zs += [mpc(g / 2, y), mpc(-g / 2, y)]
    return zs

def phi(s):
    L = lambda w: pi ** (-w / 2) * gamma(w / 2) * zeta(w)
    return L(2 * s - 1) / L(2 * s)

out = {}
# 0. inner check for S~(z) = phi(1/2 - i z) (z - i/2)/(z + i/2)
mp.dps = 30
chk = []
for z in [mpc(0.3, 0.0), mpc(7.1, 0.0), mpc(40.0, 0.0), mpc(0.2, 0.3), mpc(7.07, 0.2), mpc(7.07, 0.26), mpc(3, 2), mpc(25.0, 0.1), mpc(0.0, 0.45), mpc(0.0, 0.6)]:
    v = phi(mpf(1) / 2 - 1j * z) * (z - 0.5j) / (z + 0.5j)
    chk.append((str(z), float(fabs(v))))
    print("inner check z=%s |S~|=%.12f" % (z, fabs(v)))
out["inner_check"] = chk
mp.dps = 80
NMAX = 30
gam = [im(zetazero(k)) for k in range(1, NMAX + 1)]
print("gamma_1..3", [float(g) for g in gam[:3]])
rows = []
for label, betaf in [("zeta (beta=1/2)", lambda k: mpf(1) / 2),
                     ("moved: zeros 1..4 split to beta=0.2/0.8", None),
                     ("moved: all at beta=0.9", lambda k: mpf(9) / 10),
                     ("moved: all at beta=0.1", lambda k: mpf(1) / 10)]:
    for N in (2, 5, 10, 20, 30):
        if betaf is None:
            # off-line quadruples: rho = 1/2 +- 0.3 + i gamma for the first 4 ordinates (both members), rest on line
            zs = []
            for k in range(N):
                if k < 4:
                    zs += resonances([gam[k], gam[k]], [mpf(2) / 10, mpf(8) / 10])
                else:
                    zs += resonances([gam[k]], [mpf(1) / 2])
        else:
            zs = resonances(gam[:N], [betaf(k) for k in range(N)])
        for p in (2, 3, 5):
            lo, hi, gmin = numrange(zs, p)
            # true Hecke eigenvalues at the resonances, mu = i z
            lam = max(fabs(mpf(p) ** (1j * z) + mpf(p) ** (-1j * z)) for z in zs)
            diag = max(fabs(2 * re(exp(-1j * z.conjugate() * log(p)))) for z in zs)
            r = dict(case=label, N=N, dim=len(zs), p=p, range_lo=float(lo), range_hi=float(hi),
                     max_abs_hecke_eig=float(lam), max_single_state_rayleigh=float(diag),
                     sqrt_bound=float(mpf(p) ** 0.5 + mpf(p) ** -0.5), gram_min_eig=float(gmin))
            rows.append(r)
            print("%-42s N=%2d dim=%2d p=%d range=[%+.9f, %+.9f]  max|lambda_p(rho)|=%.6f  p^.5+p^-.5=%.6f  lam_min(G)=%.2e"
                  % (label, N, len(zs), p, lo, hi, lam, r["sqrt_bound"], gmin))
            sys.stdout.flush()
out["rows"] = rows
json.dump(out, open("model_range.json", "w"), indent=1)
# norm of W = Z_p^*|V in the K-norm (must be <= 1) for the largest zeta case, as a self-check of the Gram convention
zs = resonances(gam[:10], [mpf(1) / 2] * 10)
G = gram(zs); n = len(zs)
for p in (2, 3):
    d = [exp(-1j * z.conjugate() * log(p)) for z in zs]
    Q = matrix(n, n)
    for j in range(n):
        for k in range(n):
            Q[j, k] = d[j].conjugate() * G[j, k] * d[k]
    L = cholesky(G); Li = L ** -1
    M = Li * Q * Li.H; M = (M + M.H) / 2
    ev = eigh(M, eigvals_only=True)
    print("self-check p=%d: ||Z_p^*|V||^2 = %.12f (must be <= 1), min %.3e" % (p, max(ev), min(ev)))
