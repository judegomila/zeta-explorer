"""row_zero_test.py -- does a zero rho of the cube-part L-function of a theta row give a zero of the row series T?

Row (level mask at 2, target eta = 1, m = 1, no angular weight):
    T(s) = sum_{n sf, b; n,b primary, (nb,2)=1} gamma_2(n) q_n^{-s} q_b^{1/2-3s} = L0(s) D(s),
    L0(s) = zeta_F(w)(1-3^{-w})(1-4^{-w}),  w = 3s - 1/2,   D(s) = sum_n gamma_2(n) q_n^{-s}.
Smoothed sum G(X) = sum a(mu) q^{-s} exp(-(q/X)^k) = T(s) + c1 X^{5/6-s} + c2 X^{1/6-s} + O(X^{-k}) if T continues
with poles only at 5/6 and 1/6 (constant terms of the cubic theta function). Complex least squares in (T, c1, c2).
Stand-alone: reads only the arrays N, g2 of tmp/sextic/data/sf_1e7.npz (math data).
"""
import sys, math, numpy as np, mpmath as mp
path = sys.argv[1]
d = np.load(path)
N = d['N'].astype(np.float64); g2 = d['g2'].astype(np.complex128)
print("table entries", len(N), "planned arrays ~", len(N) * 8 * 6 / 1e6, "MB", flush=True)
NMAX = 1e7
o = np.argsort(N); N = N[o]; g2 = g2[o]
lnN = np.log(N)
# cube-part multiplicities: primary b coprime to 2, by norm
cb = {}
for a in range(-40, 41):
    for b in range(-40, 41):
        if a % 3 == 1 and b % 3 == 0 and not (a % 2 == 0 and b % 2 == 0):
            q = a * a - a * b + b * b
            if q ** 3 <= NMAX: cb[q] = cb.get(q, 0) + 1
bl = sorted(cb.items())
print("b norms", len(bl), "first", bl[:6], flush=True)
rng = np.random.default_rng(5)
rand = np.exp(2j * np.pi * rng.random(len(N)))

def G(s, X, k, coef):
    tot = 0j
    for q, c in bl:
        lim = min(NMAX / q ** 3, 2.8 * X / q ** 3)
        j = np.searchsorted(N, lim, side='right')
        if j == 0: continue
        w = np.exp(-(N[:j] * (q ** 3 / X)) ** k)
        tot += c * q ** (0.5 - 3 * s) * np.sum(coef[:j] * np.exp(-s * lnN[:j]) * w)
    return tot

def fit(s, k, coef, Xs, basis=('1', 'p', 'm')):
    y = np.array([G(s, X, k, coef) for X in Xs])
    cols = []
    for bname in basis:
        if bname == '1': cols.append(np.ones(len(Xs), dtype=complex))
        if bname == 'p': cols.append(Xs ** (5 / 6 - s))
        if bname == 'm': cols.append(Xs ** (1 / 6 - s))
    A = np.stack(cols, axis=1)
    sol, *_ = np.linalg.lstsq(A, y, rcond=None)
    res = np.abs(A @ sol - y).max()
    return sol, res, np.abs(y).max()

def L0(s):
    w = 3 * s - 0.5
    chi = lambda n: [0, 1, -1][int(n) % 3]
    return complex(mp.zeta(w) * mp.dirichlet(w, [0, 1, -1]) * (1 - mp.mpf(3) ** (-w)) * (1 - mp.mpf(4) ** (-w)))

mp.mp.dps = 20
g_chi = [mp.re(mp.findroot(lambda t: mp.dirichlet(mp.mpf(1) / 2 + mp.j * t, [0, 1, -1]), mp.mpc(t0, 0))) for t0 in (8.04, 11.25, 15.70)]
g_zeta = [mp.zetazero(1).imag, mp.zetazero(2).imag]
zeros = [('L(chi_-3) #1', float(g_chi[0])), ('L(chi_-3) #2', float(g_chi[1])), ('zeta #1', float(g_zeta[0])),
         ('L(chi_-3) #3', float(g_chi[2])), ('zeta #2', float(g_zeta[1]))]
print("zeros", zeros, flush=True)
Xs = np.geomspace(3e5, 3.5e6, 20)

print("\n== A. validity of the three-term model (max residual / max |G|) ==")
for s in (complex(1 / 3, 2.0), complex(0.5, 3.0), complex(0.7, 1.0)):
    for name, coef in (('gamma_2', g2), ('random phases', rand)):
        for k in (4, 2):
            sol, res, ym = fit(s, k, coef, Xs)
            print(f"s={s:.4f} {name:14s} k={k} T={sol[0]:.6f} c1={sol[1]:.3e} c2={sol[2]:.3e} resid={res:.2e} max|G|={ym:.2e}", flush=True)

print("\n== B. T at s_rho = (rho + 1/2)/3 and at controls on Re s = 1/3 ==")
for name, g in zeros:
    for dt, tag in ((0.0, 'ZERO'), (0.15, 'ctl+'), (-0.15, 'ctl-')):
        s = complex(1 / 3, g / 3 + dt)
        out = []
        for k, XX in ((4, Xs), (2, np.geomspace(3e5, 1.4e6, 20)), (4, np.geomspace(6e5, 3.5e6, 16))):
            sol, res, ym = fit(s, k, g2, XX)
            out.append((sol[0], res))
        l0 = L0(s)
        print(f"{name:13s} {tag} s=1/3+{s.imag:.5f}i |L0|={abs(l0):.3e} " +
              " ".join(f"T={t:.5f}(|T|={abs(t):.4f},res={r:.1e})" for t, r in out), flush=True)

print("\n== C. profile of |T(1/3 + it)|, t = 2.0 .. 5.6 ==")
for t in np.arange(2.0, 5.61, 0.2):
    s = complex(1 / 3, t)
    sol, res, ym = fit(s, 4, g2, Xs)
    print(f"t={t:.2f} |T|={abs(sol[0]):.4f} |L0|={abs(L0(s)):.4f} |D|=|T/L0|={abs(sol[0]) / abs(L0(s)):.4f} res={res:.1e}", flush=True)
