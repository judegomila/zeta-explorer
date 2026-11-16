"""CHECK 3 (PR 44 leakage bound, PR 45 denominator zero), independent numerics (not interval).
 (a) D(z) = F(z) + F'(z), F(z) = xi(1/2+z): zero near -0.74626947+14.61606607i ; D(-1) > 0.48526023.
 (b) leakage ||1_(1,inf) C_0 1_[0,1]||^2 for alpha = 1 by direct Fourier inversion with
     S(it) = (Xi + i a Xi')/(Xi - i a Xi'),  Xi(t) = xi(1/2+it) = w(t) Z(t).
     A Gaussian taper exp(-t^2/(2 T0^2)) (= smoothing of the box by a Gaussian of u-width 2/T0)
     controls truncation; the energy beyond 1 + margin is reported.
 (c) vacuity table: sup over 0<sigma<1/2 of sigma*|V~(sigma+i tau)|^2 (the largest value the
     single-pole lower bound (5.1) can take with |B_+| = 1) against 0.124030166.
"""
import sys, json
import numpy as np
import mpmath as mp

mp.mp.dps = 30
out = {}
xi = lambda s: s * (s - 1) / 2 * mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
F = lambda z: xi(mp.mpf(1) / 2 + z)
D = lambda z: F(z) + mp.diff(F, z)
z0 = mp.findroot(D, mp.mpc('-0.746', '14.616'))
out['a_root_of_F+F\''] = mp.nstr(z0, 12)
out['a_dist_to_PR_centre'] = mp.nstr(abs(z0 - mp.mpc('-0.74626947', '14.61606607')), 3)
out['a_D(-1)'] = mp.nstr(D(mp.mpf(-1)), 12)

# (c) vacuity
vac = {}
for tau in (5, 9, 14.134725, 100, 3.0e12):
    best = 0
    for i in range(1, 500):
        s = 0.5 * i / 500
        val = s * 4 * (1 + np.exp(-s) - 2 * np.exp(-s / 2) * (-1)) / (s * s + tau * tau)   # cos = -1 worst case
        best = max(best, val)
    vac[str(tau)] = float(best)
out['c_sup_single_pole_lower_bound_with_|B+|=1'] = vac

# (b) leakage
mp.mp.dps = 15
alpha = 1.0
T = float(sys.argv[1]) if len(sys.argv) > 1 else 300.0
dt = float(sys.argv[2]) if len(sys.argv) > 2 else 0.02
T0 = T / 5.0
n = int(T / dt)
ts = (np.arange(n) + 0.5) * dt
S = np.empty(n, dtype=complex)
for i, t in enumerate(ts):
    t = mp.mpf(t)
    Z = mp.siegelz(t)
    Z1 = mp.siegelz(t, derivative=1)
    lam = 2 * t / (t * t + mp.mpf(1) / 4) - mp.im(mp.digamma(mp.mpc(0.25, t / 2))) / 2   # (log w)'
    X, X1 = Z, Z1 + lam * Z          # Xi'/Xi = X1/X ; common factor w cancels
    S[i] = complex((X + 1j * alpha * X1) / (X - 1j * alpha * X1))
fh = (np.exp(1j * ts / 2) - 1) / (1j * ts / 2) * np.exp(-ts ** 2 / (2 * T0 ** 2))
us = np.linspace(-40, 40, 16001)
du = us[1] - us[0]
# g(u) = (1/2pi) Re int_0^inf S fh e^{-i t u/2} dt ; same for f (S=1)
g = np.empty_like(us); f = np.empty_like(us)
for k, u in enumerate(us):
    ph = np.exp(-1j * ts * u / 2)
    g[k] = (S * fh * ph).sum().real * dt / (2 * np.pi)
    f[k] = (fh * ph).sum().real * dt / (2 * np.pi)
tot_g, tot_f = (g ** 2).sum() * du, (f ** 2).sum() * du
res = {'T': T, 'dt': dt, 'gauss_u_width': 2 / T0, 'norm2_f': tot_f, 'norm2_g': tot_g}
for margin in (0.0, 0.05, 0.1, 0.2):
    res[f'energy_g_beyond_1+{margin}'] = float((g[us > 1 + margin] ** 2).sum() * du)
    res[f'energy_f_beyond_1+{margin}'] = float((f[us > 1 + margin] ** 2).sum() * du)
res['energy_g_below_-40_or_above_40 (not captured)'] = float(1 - tot_g)
out['b_leakage'] = res
print(json.dumps(out, indent=1))
