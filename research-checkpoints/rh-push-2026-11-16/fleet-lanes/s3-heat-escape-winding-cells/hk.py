"""Shared library, lane s3-heat-escape-winding-cells.
Completed functions Xi_f(s) (entire, Xi(s) = Xi(1-s), real on Re s = 1/2), H_0(z) = Xi(1/2 + i z/2)  (z = x + i y; s = (1-y)/2 + i x/2),
heat family H_t(z) = E H_0(z + i sqrt(2t) N), N standard normal (t of either sign; d_t H = -d_z^2 H), by Gauss-Hermite quadrature in Arb.
Kinds: zeta | chi4 (L(s, chi_-4), positive comparison) | dh (Davenport-Heilbronn, conductor 5) | tnr (xi(s)(2cosh((s-1/2)log q)+c)) |
       ea (xi(s+a)xi(s-a)) | heat:<tau0> (zeta kernel started at time -tau0: H^heat_t = H_{t - tau0}).
"""
import math, os
import numpy as np
from flint import acb, arb, ctx

KAPPA_DH = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
TNR_Q, TNR_C = 3.0, 2.2
EA_A = 0.1

def setprec(p): ctx.prec = p

def _logxi(s):
    """log of (1/2) s (s-1) pi^{-s/2} Gamma(s/2) (gamma factor of xi)."""
    return s.log() + (s - 1).log() - acb(2).log() - s*acb.pi().log()/2 + (s/2).lgamma()

def parts(kind, s):
    """(log gamma-type factor [acb], arithmetic factor [acb]); Xi = exp(first) * second."""
    if kind == 'zeta' or kind.startswith('heat'):
        return _logxi(s), s.zeta()
    if kind == 'chi4':
        L = (s.zeta(arb(1)/4) - s.zeta(arb(3)/4))*(-s*acb(4).log()).exp()
        return (s/2)*(acb(4)/acb.pi()).log() + ((s + 1)/2).lgamma(), L
    if kind == 'dh':
        k = arb(KAPPA_DH)   # double value of kappa; the function is this exact combination
        k = (arb(10) - 2*arb(5).sqrt()).sqrt() - 2; k = k/(arb(5).sqrt() - 1)
        f = (s.zeta(arb(1)/5) + k*s.zeta(arb(2)/5) - k*s.zeta(arb(3)/5) - s.zeta(arb(4)/5))*(-s*acb(5).log()).exp()
        return (s/2)*(acb(5)/acb.pi()).log() + ((s + 1)/2).lgamma(), f
    if kind == 'tnr':
        w = (s - acb(0.5))*acb(TNR_Q).log()
        return _logxi(s), s.zeta()*(w.exp() + (-w).exp() + acb(TNR_C))
    if kind == 'ea':
        a = acb(EA_A)
        return _logxi(s + a) + _logxi(s - a), (s + a).zeta()*(s - a).zeta()
    raise ValueError(kind)

def ref_at(kind, x):
    """real normaliser: Re log factor at s = 1/2 + i x/2."""
    lg, _ = parts(kind, acb(0.5, x/2.0) if not isinstance(x, arb) else acb(arb(0.5), x/2))
    return lg.real

def H0n(kind, z, ref):
    """H_0(z)/exp(ref), z acb."""
    s = acb(0.5) + acb(0, 1)*z/2
    if s.real < 0.5:
        s = 1 - s          # Xi(s) = Xi(1 - s) (checked in validate.py for every kind): keeps the arithmetic factor at Re s >= 1/2, where Arb's
                           # zeta has finite error bounds at every height (left of 0 at height 5e13 it returns balls of infinite radius)
    lg, v = parts(kind, s)
    return (lg - ref).exp()*v

_GH = {}
def gh(n):
    if n not in _GH:
        x, w = np.polynomial.hermite_e.hermegauss(n)
        _GH[n] = (x, w/math.sqrt(2*math.pi))
    return _GH[n]

def tau0_of(kind):
    return float(kind.split(':')[1]) if kind.startswith('heat') else 0.0

def Hjet(kind, z, t, ref, n=40, order=3):
    """[H, H', H'', H'''] of H_t at z (acb), divided by exp(ref).  kind heat:tau0 uses time t - tau0."""
    t = t - tau0_of(kind)
    if t == 0:
        t = 1e-12          # exact time zero of the base kernel: evaluated at 1e-12 (H and H' unaffected at working precision)
    c = acb(2*t).sqrt()                # sqrt(2t), imaginary for t < 0
    xs, ws = gh(n)
    S = [acb(0) for _ in range(4)]
    for xk, wk in zip(xs, ws):
        xk = float(xk); wk = float(wk)
        f = H0n(kind, z + acb(0, 1)*c*xk, ref)*wk
        S[0] += f; S[1] += f*xk; S[2] += f*(xk*xk - 1); S[3] += f*(xk**3 - 3*xk)
    ic = acb(0, 1)*c
    return [S[0], S[1]/ic, S[2]/(ic*ic), S[3]/(ic*ic*ic)][:order + 1]

def c128(v): return complex(float(v.real.mid()), float(v.imag.mid()))

def Hjet_c(kind, z, t, x_ref, n=40, order=3):
    """complex128 jet at complex z (python complex), normalised at real height x_ref."""
    ref = ref_at(kind, x_ref)
    return [c128(v) for v in Hjet(kind, acb(z.real, z.imag), t, ref, n, order)]
