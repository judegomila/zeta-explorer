"""Escape-law numerics library (b-escape-law). H_{-tau} = Gaussian convolution of H_0 = xi((1+iz)/2)/8.
Lower half-plane convention: z = x - i*eta, s_z = (1+iz)/2 = (1+eta)/2 + i x/2.
Model (Lemma R):  H_{-tau}(z) = Tsharp(z) * D_tau(s_eff(z)) * (1 + O(L^2/x)),
  Tsharp = J0(z) exp(tau g'(z)^2), g = log J0, J0(w) = gamma-factor of xi/8 at s=(1+iw)/2,
  s_eff(z) = (1+iz)/2 + i tau g'(z),   D_tau(s) = sum_n exp(-(tau/4) log^2 n) n^{-s} = E zeta(s+iV), V~N(0,tau/2).
"""
import math, numpy as np
from flint import acb, arb, ctx
ctx.prec = 100
PI = acb.pi()
LOGPI = PI.log()

def c128(v):
    return complex(float(v.real.mid()), float(v.imag.mid()))

def log_gamma_factor(s):
    """log of (1/16) s (s-1) pi^{-s/2} Gamma(s/2)  (= log J0 at s=(1+iw)/2)."""
    return s.log() + (s-1).log() - acb(16).log() - s*LOGPI/2 + (s/2).lgamma()

def gprime(s):
    """d/dw log J0(w) at s=(1+iw)/2 : (i/2) d/ds."""
    return acb(0, 0.5)*(1/s + 1/(s-1) - LOGPI/2 + (s/2).digamma()/2)

def model_parts(x, eta, tau, dx=0.0):
    """returns (log Tsharp [acb], s_eff [acb]) at z = (x + dx) - i eta  (x + dx added in Arb, for heights beyond double spacing)."""
    s = acb((1+eta)/2, 0) + acb(0, 1)*(acb(x) + acb(dx))/2
    gp = gprime(s)
    return log_gamma_factor(s) + tau*gp*gp, s + acb(0, 1)*tau*gp

class Line:
    """zeta samples on Re s = sigc, Im s = t_j/2, t_j = x0 + j*h, j=-M..M."""
    def __init__(self, x0, half, h, sigc, verbose=False):
        self.x0, self.h, self.sigc = x0, h, sigc
        M = int(round(half/h)); self.t = x0 + h*np.arange(-M, M+1)
        self.kappa = 2*sigc - 1
        lz, lg = [], []
        for tj in self.t:
            s = acb(sigc, tj/2)
            lz.append(s.zeta()); lg.append(log_gamma_factor(s))
        self.ref = float(lg[M].real.mid())
        self.zeta = np.array([c128(v) for v in lz])
        # xi/8 / exp(ref)
        self.xi = np.array([c128((lg[j] - self.ref).exp()*lz[j]) for j in range(len(lz))])
    def F(self, x, eta, tau):
        """H_{-tau}(x - i eta) / exp(ref); x, eta numpy arrays (broadcast)."""
        x = np.asarray(x, dtype=float); eta = np.asarray(eta, dtype=float)
        z = x - 1j*eta
        w = self.t - 1j*self.kappa
        d = z[..., None] - w
        return (self.xi*np.exp(-d*d/(4*tau))).sum(-1)*self.h/math.sqrt(4*math.pi*tau)
    def dF(self, x, eta, tau):
        z = np.asarray(x, dtype=float) - 1j*np.asarray(eta, dtype=float)
        d = z[..., None] - (self.t - 1j*self.kappa)
        return (self.xi*(-d/(2*tau))*np.exp(-d*d/(4*tau))).sum(-1)*self.h/math.sqrt(4*math.pi*tau)
    def D(self, sig, t, tau):
        """D_tau(sig + i t) from the zeta samples (contour-shifted Gaussian average)."""
        s = np.asarray(sig, dtype=float) + 1j*np.asarray(t, dtype=float)
        u = self.t/2
        a = u - (s[..., None] - self.sigc)/1j   # v = u + i(s - sigc)
        return (self.zeta*np.exp(-a*a/tau)).sum(-1)*(self.h/2)/math.sqrt(math.pi*tau)

def D_series(s, tau, N):
    n = np.arange(1, N+1, dtype=float); l = np.log(n)
    return np.sum(np.exp(-(tau/4)*l*l - s*l))
