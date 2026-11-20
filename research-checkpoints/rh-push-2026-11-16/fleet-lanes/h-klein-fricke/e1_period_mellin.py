"""E1: the r-family of zeta-view tori is the arc (cusp 0 -> cusp inf) of the real oval of X_0(4);
Fricke w_4 is m -> 1-m (K <-> K'); theta = sqrt(2K/pi); xi is the Mellin transform of theta along the arc."""
import mpmath as mp
mp.mp.dps = 50
def data(r):
    m = mp.mpf(r) ** -4
    K, Kp = mp.ellipk(m), mp.ellipk(1 - m)
    return m, K, Kp
print("r, tau_E=iK'/(2K), lambda(2 tau_E)-m, theta3(e^{-pi K'/K})^2 - 2K/pi")
for r in (1.05, 2 ** 0.25, 1.3, 2, 3.7):
    m, K, Kp = data(r)
    q = mp.exp(-mp.pi * Kp / K)
    lam = (mp.jtheta(2, 0, q) / mp.jtheta(3, 0, q)) ** 4
    print(r, mp.nstr(Kp / (2 * K), 12), mp.nstr(lam - m, 5), mp.nstr(mp.jtheta(3, 0, q) ** 2 - 2 * K / mp.pi, 5))
# Fricke: r -> r' with r'^-4 = 1 - r^-4 sends t=K'/K to 1/t; fixed point r = 2^(1/4)
for r in (1.1, 1.5):
    m, K, Kp = data(r); rp = (1 - m) ** (-mp.mpf(1) / 4); m2, K2, Kp2 = data(rp)
    print("Fricke r=%s -> r'=%s : t*t' = %s" % (r, mp.nstr(rp, 12), mp.nstr((Kp / K) * (Kp2 / K2), 15)))
# xi as an integral over the half-arc m in (0,1/2] (r >= 2^(1/4)), from the Fricke fixed point to the cusp
def Lam_period(s):
    def f(m):
        K, Kp = mp.ellipk(m), mp.ellipk(1 - m)
        t = Kp / K
        psi = (mp.sqrt(2 * K / mp.pi) - 1) / 2
        return psi * (t ** (s / 2) + t ** ((1 - s) / 2)) / t * mp.pi / (4 * m * (1 - m) * K ** 2)
    return 1 / (s * (s - 1)) + mp.quad(f, [mp.mpf(10) ** -25, mp.mpf(10) ** -18, mp.mpf(10) ** -12, mp.mpf(10) ** -6, 0.001, 0.05, 0.2, 0.5])
def Lam(s): return mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
for s in (mp.mpf(3), mp.mpc(0.5, 5), mp.mpc(0.5, 14.134725141734693), mp.mpc(0.3, 21)):
    print("s=", s, " period integral:", mp.nstr(Lam_period(s), 15), " Lambda(s):", mp.nstr(Lam(s), 15))
