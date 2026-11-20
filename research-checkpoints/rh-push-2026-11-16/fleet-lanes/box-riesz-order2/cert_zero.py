#!/usr/bin/env python3
"""cert_zero.py: Arb certificate of an off-line zero of the pole-corrected FE-symmetrised Riesz section of zeta,
    F_N(s) = G(s) A_N(s) + G(1-s) A_N(1-s),   G(s) = s(s-1)/2 pi^(-s/2) Gamma(s/2),
    A_N(s) = sum_{n<=N} (1 - log n/log M)^k n^-s - k! M^(1-s) / ((1-s)^(k+1) log^k M),  M = N+1
(the object "afep riesz k" of box-ly-search/cert.py).  Certified function: h = F_N / G(s) = A(s) + X(s) A(1-s),
X = G(1-s)/G(s) (G is finite and nonzero at the points used).  Method: complex interval Newton: s0 a point, B the
square of half-side r around s0, h'(B) an enclosure of h' on B not containing 0, and |h(s0)/h'(B)| < r  =>  exactly
one zero of h in B.  usage: cert_zero.py k N q delta_log2 sigma tau [input]   (height T = q / 2^delta_log2)"""
import sys, json, math
sys.set_int_max_str_digits(0)
from flint import arb, acb, ctx

def build(k, N, twist=None, res=1):
    lM = arb(N + 1).log()
    terms = []
    for n in range(1, N + 1):
        lg = arb(n).log()
        c = (1 - lg / lM) ** k
        if twist: c = c * twist(n)
        terms.append((lg, c))
    fk = arb(math.factorial(k)) * res
    def A(s, deriv=False):
        D = acb(0); Dp = acb(0)
        for lg, c in terms:
            e = c * (-s * lg).exp(); D += e; Dp -= lg * e
        Pt = fk / lM ** k * ((1 - s) * lM).exp() / (1 - s) ** (k + 1)
        Pp = Pt * (-lM + (k + 1) / (1 - s))
        return (D - Pt, Dp - Pp, D)
    def logG(s):
        return s.log() + (s - 1).log() - arb(2).log() - (s / 2) * arb.pi().log() + (s / 2).lgamma()
    def dlogG(s):
        return 1 / s + 1 / (s - 1) - arb.pi().log() / 2 + (s / 2).digamma() / 2
    def h(s):
        a, ap, d = A(s); b, bp, _ = A(1 - s)
        X = (logG(1 - s) - logG(s)).exp()
        Xp = X * (-dlogG(1 - s) - dlogG(s))
        return a + X * b, ap + Xp * b - X * bp, d, X
    return h

def certify(k, N, q, DL, sigma, tau, inp='zeta'):
    bits = abs(q).bit_length()
    ctx.prec = bits + 400
    if inp == 'tw2m':   # completely multiplicative sign flip at 2: L(s) = zeta(s) (1 - 2^-s)/(1 + 2^-s), residue 1/3 at s = 1
        h = build(k, N, twist=lambda n: -1 if ((n & -n).bit_length() - 1) % 2 else 1, res=arb(1) / 3)
    else:
        h = build(k, N)
    T = arb(q) / 2 ** DL
    s = acb(arb(sigma), T + arb(tau))
    for it in range(80):
        v, vp, d, X = h(s)
        step = v / vp
        s = acb(arb((s - step).real.mid()), arb((s - step).imag.mid()))
        if abs(step).upper() < arb(2) ** (-(ctx.prec - bits) // 2 - 20) * 1: break
    s0 = s
    v0, vp0, d0, X0 = h(s0)
    out = None
    for rexp in (40, 30, 20, 60, 80):
        r = arb(2) ** (-rexp)
        Bx = acb(arb(s0.real.mid(), r.mid()) if False else s0.real + arb(0, 1) * r, s0.imag + arb(0, 1) * r)
        vB, vpB, dB, XB = h(Bx)
        if vpB.contains(0): continue
        ratio = abs(v0 / vpB).upper()
        if ratio < r.lower():
            sig = s0.real; off = sig - arb(1) / 2
            out = dict(k=k, N=N, q=str(q), delta_log2=DL, T_log10=float((arb(abs(q)).log() / arb(10).log()).mid()) - DL * math.log10(2),
                       re_s=float(sig.mid()), im_s_minus_T=float((s0.imag - T).mid()), radius_log2=-rexp,
                       newton_ratio_upper=float(ratio), abs_hprime_lower=float(abs(vpB).lower()),
                       re_s_minus_half_lower=float((off - r).lower()), in_window=bool((off + r).upper() < 0.49 and (off - r).lower() > 0),
                       abs_X=float(abs(X0).mid()), abs_D_at_zero=float(abs(d0).mid()), prec_bits=ctx.prec, certified=True)
            break
    if out is None:
        out = dict(k=k, N=N, q=str(q), certified=False, re_s=float(s0.real.mid()), abs_h=float(abs(v0).mid()))
    return out

if __name__ == '__main__':
    k = int(sys.argv[1]); N = int(sys.argv[2]); q = int(sys.argv[3]); DL = int(sys.argv[4])
    print(json.dumps(certify(k, N, q, DL, float(sys.argv[5]), float(sys.argv[6]))))
