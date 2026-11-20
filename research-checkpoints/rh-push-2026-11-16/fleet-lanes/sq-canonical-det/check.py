"""Checks of the kernel normalisation.
1. nu=1 zeta: Talbot G vs Suzuki closed form  G(w) = e^{-w/2} g_om(e^{-w}).
2. Laplace transform of K (prime side, truncated) vs Theta(z) = xi(1/2-om-iz)/xi(1/2+om-iz) at Im z large.
3. DH nu=1: Talbot vs closed form.
"""
import math, numpy as np, mpmath as mp
from suz import Fgamma, talbot, coeffs
mp.mp.dps = 40

def g_closed(om, y):
    om = mp.mpf(om); y = mp.mpf(y)
    inc = mp.betainc(mp.mpf(3) / 2 - om, om, y * y, 1)
    return 2 * mp.pi ** om / mp.gamma(om) * (y ** (2 - om) * (1 - y * y) ** (om - 1) - om * y ** (om - 1) * inc)

def g_dh(om, y):
    om = mp.mpf(om); y = mp.mpf(y)
    return (mp.mpf(5) / mp.pi) ** (-om) * 2 / mp.gamma(om) * y ** (1 - om) * (1 - y * y) ** (om - 1)

for om in (0.25, 0.75, 1.5):
    F, sig = Fgamma("zeta", om, 1)
    for w in (0.01, 0.3, 1.0, 3.0, 6.0):
        a = talbot(F, sig, w); b = mp.exp(-mp.mpf(w) / 2) * g_closed(om, mp.exp(-mp.mpf(w)))
        print("zeta om", om, "w", w, mp.nstr(a, 15), mp.nstr(b, 15), mp.nstr(abs(a - b) / abs(b), 3))
    F, sig = Fgamma("dh", om, 1)
    for w in (0.01, 0.3, 1.0, 3.0, 6.0):
        a = talbot(F, sig, w); b = mp.exp(-mp.mpf(w) / 2) * g_dh(om, mp.exp(-mp.mpf(w)))
        print("dh   om", om, "w", w, mp.nstr(a, 15), mp.nstr(b, 15), mp.nstr(abs(a - b) / abs(b), 3))

# Dirichlet coefficient check: sum c(n) n^{-s} vs zeta(s-om)/zeta(s+om) and DH ratio at s = 6
def dh_f(s):
    s5 = mp.sqrt(5); kap = (mp.sqrt(10 - 2 * s5) - 2) / (s5 - 1)
    return 5 ** (-s) * (mp.zeta(s, mp.mpf(1) / 5) + kap * mp.zeta(s, mp.mpf(2) / 5)
                        - kap * mp.zeta(s, mp.mpf(3) / 5) - mp.zeta(s, mp.mpf(4) / 5))
N = 4000
for kind in ("zeta", "dh"):
    for nu in (1, 3):
        om = 0.25
        c = coeffs(kind, om, nu, N)
        s = 6.0
        lhs = float(sum(c[n] * n ** (-s) for n in range(1, N + 1)))
        if kind == "zeta":
            rhs = (mp.zeta(s - om) / mp.zeta(s + om)) ** nu
        else:
            rhs = (dh_f(mp.mpf(s) - om) / dh_f(mp.mpf(s) + om)) ** nu
        print(kind, "nu", nu, "Dirichlet check", lhs, mp.nstr(rhs, 15))
# DH zero check
print("DH f at known zero 0.808517+85.699348i:", mp.nstr(abs(dh_f(mp.mpc('0.808517', '85.699348'))), 5))
