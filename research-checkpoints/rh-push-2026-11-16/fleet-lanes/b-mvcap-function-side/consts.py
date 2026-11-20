"""Constants of Theorem 2 (double precision; every quantity is a closed form or a 1-D quadrature/maximisation on a fine grid)."""
import numpy as np, math, json
from scipy.special import zeta as hz
def Btr(T): return 0.112 * math.log(T) + 0.278 * math.log(math.log(T)) + 2.510
out = []
for c in [3.1e12, 7.5e16]:
    for h in [300.0, 500.0, 1000.0]:
        for a in [1.0, 1.5, 2.5]:
            sig = 0.5 + a
            L = math.log(c / (2 * math.pi)); dens = L / (2 * math.pi); B = Btr(2 * c)
            small = dens / h ** 2 + 2 * h / c + 3 * B / c + 20 / c
            tau = np.linspace(0, h / 2, 200001)
            epsX = 4 * B * h / (h ** 2 - tau ** 2) + small
            Lam = 0.5 * np.log(((h + tau) ** 2 + a * a) / ((h - tau) ** 2 + a * a))
            dt = tau[1] - tau[0]
            I_eps = np.concatenate([[0], np.cumsum((epsX[1:] + epsX[:-1]) / 2 * dt)])
            I_Lam = np.concatenate([[0], np.cumsum((Lam[1:] + Lam[:-1]) / 2 * dt)])
            kappa = float(np.max(I_eps - dens * I_Lam))                 # loss of min_u A(u) against A(c), |u-c| <= h/2
            Gamma1 = float(dens * I_Lam[-1] - I_eps[-1])                # A(c +- h/2) - A(c) + log osc  >=  Gamma1
            D = h / 2; mhat = math.log((D + math.sqrt(D * D + 4 * a * a)) / (2 * a))
            far_err = B * (5 * mhat + 0.29) + 1e-6                      # |int f dE_N| for h/2 <= |u-c| <= h
            Gmax = 2 * B / (math.log((c - h) / (2 * math.pi)) / (2 * math.pi))   # largest gap in the window allowed by |E_N| <= B
            r = Gmax
            kprime = dens * (a * a + 1.01 * r * r) / h + (4 * B / h + small) * a + 4.1 * B * r / h + 20 * r / c
            msig = hz(2 * sig) / hz(sig)
            pref = (1 + 5 * h / c) * math.exp(kappa + kprime) / msig
            Zmax = 0.618 * c ** (1 / 6) * math.log(c)
            scale = (c / (2 * math.pi)) ** (-a / 2)
            row = dict(c=c, h=h, sigma=sig, B=B, dens=dens, kappa=kappa, Gamma1=Gamma1, far_err=far_err, far_ok=bool(Gamma1 > far_err), Gmax=Gmax, kprime=kprime,
                       m_sigma=msig, prefactor=pref, scale=scale, Ehat_per_unit_Z=pref * scale, Ehat_uncond=pref * scale * Zmax, Zmax_HPY=Zmax)
            out.append(row)
            print('c=%.2g h=%4.0f sigma=%.1f | B=%.3f kappa=%.3f Gamma1=%.1f far_err=%.1f ok=%s | Gmax=%.2f kappa\'=%.3f | prefactor=%.3f  Ehat <= %.3e*|Z(t_m)| ; with HPY |Z|<=%.0f: %.3e' % (c, h, sig, B, kappa, Gamma1, far_err, Gamma1 > far_err, Gmax, kprime, pref, pref * scale, Zmax, pref * scale * Zmax))
json.dump(out, open('consts.json', 'w'), indent=1)
