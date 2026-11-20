"""Test 2, first step: reproduce the disk certificate of the zero-channel source (PR 57): for every real tau in [-0.05, 0.05] the
disk |s - c| <= 0.35, c = 1/2 + 14.134725141734693 i, contains exactly one simple zero of F_tau(s) = E xi(s + sqrt(tau/2) N)
(d_tau F = F_ss/4).  Rouche against the linear reference Q(s) = F'(c)(s - c):  |F(c)| + (r^2/2) sup_disk |F''| < r |F'(c)|.
Values: Gauss-Hermite (64 nodes; 48 nodes as a check) of 256-bit ball values; derivatives by central differences with step 1e-15.
MEASURED on a tau grid (the source certificate is an interval certificate over the whole tau interval)."""
import math, json
import numpy as np
from flint import acb, arb, ctx
ctx.prec = 256
def xi(s): return s * (s - 1) / 2 * (-s / 2 * acb.pi().log()).exp() * (s / 2).gamma() * s.zeta()
def F(s, tau, n=64):
    if tau == 0: return xi(s)
    xs, ws = np.polynomial.hermite_e.hermegauss(n); ws = ws / math.sqrt(2 * math.pi)
    c = acb(arb(tau) / 2).sqrt(); tot = acb(0)
    for xk, wk in zip(xs, ws): tot += xi(s + c * float(xk)) * float(wk)
    return tot
h = acb(arb(10) ** -15)
def d1(s, tau): return (F(s + h, tau) - F(s - h, tau)) / (2 * h)
def d2(s, tau): return (F(s + h, tau) - 2 * F(s, tau) + F(s - h, tau)) / (h * h)
c = acb(0.5, 14.134725141734693); r = 0.35
rows = []
for k in range(-5, 6):
    tau = k / 100
    f0 = abs(complex(float(F(c, tau).real.mid()), float(F(c, tau).imag.mid())))
    f48 = F(c, tau, 48); f64 = F(c, tau, 64); gh = float(abs(f48 - f64).mid())
    v = d1(c, tau); f1 = abs(complex(float(v.real.mid()), float(v.imag.mid())))
    sup2 = 0.0
    for j in range(48):
        s = c + acb(r * math.cos(2 * math.pi * j / 48), r * math.sin(2 * math.pi * j / 48))
        v = d2(s, tau); sup2 = max(sup2, abs(complex(float(v.real.mid()), float(v.imag.mid()))))
    lhs = f0 + r * r / 2 * sup2; rhs = r * f1
    rows.append(dict(tau=tau, absF=f0, absF1=f1, supF2=sup2, residual=lhs, floor=rhs, certified=bool(lhs < rhs), gh48_vs_64=gh))
    print('tau %+.2f |F(c)| %.3e |F\'(c)| %.7f sup|F\'\'| %.6f residual %.3e < floor %.3e : %s (GH 48 vs 64: %.1e)' % (tau, f0, f1, sup2, lhs, rhs, lhs < rhs, gh), flush=True)
json.dump(rows, open('t2_disk.json', 'w'), indent=0)
