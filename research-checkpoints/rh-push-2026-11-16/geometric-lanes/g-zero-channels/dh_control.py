"""DH control for the channel statement (MEASURED: Arb mid-point arithmetic, Cauchy-FFT jets, no tail proof).
xi_DH(s) = (pi/5)^(-s/2) Gamma((s+1)/2) f(s),  f = (1-i k)/2 L(s,chi) + (1+i k)/2 L(s,chibar), chi mod 5, chi(2)=i.
Heat family F_tau = exp(tau/4 d_s^2) xi_DH.  Track the first off-line pair near 0.8085+85.6993i forward in tau.
"""
import sys, cmath, math
from flint import acb, arb, ctx, dirichlet_char, acb_poly
ctx.prec = 700
G = [dirichlet_char(5, k) for k in range(1, 5)]
for c in G:
    v = complex(c(2))
    if abs(v-1j) < 1e-9: CHI = c
    if abs(v+1j) < 1e-9: CHIB = c
s5 = arb(5).sqrt()
KAP = ((10-2*s5).sqrt()-2)/(s5-1)
I = acb(0, 1)
def f(s):
    return ((1-I*KAP)/2)*CHI.l(s)+((1+I*KAP)/2)*CHIB.l(s)
def xi(s):
    return ((-s/2)*(arb.pi()/5).log()).exp()*((s+1)/2).gamma()*f(s)

def jet(c, J, R=2, N=512):
    vals = [xi(c+R*(2*arb.pi()*I*j/N).exp()) for j in range(N)]
    a = []
    for n in range(J):
        sm = acb(0)
        for j in range(N):
            sm += vals[j]*(-2*arb.pi()*I*((j*n) % N)/N).exp()
        a.append(sm/N/arb(R)**n)
    return a

if __name__ == "__main__":
    s0 = acb("0.808517", "85.699348")
    print("symmetry check xi(s)/xi(1-s):", (xi(s0)/xi(1-s0)).str(15))
    print("|xi_DH| at off-line zero guess:", abs(xi(s0)).str(5), " scale |xi'|~", abs((xi(s0+arb("1e-20"))-xi(s0))/arb("1e-20")).str(5))
    J = 160
    y0 = arb("85.699348")
    c = acb(arb(1)/2, y0)
    a = jet(c, J)
    print("jet tail sizes a_J R^J / a_1:", (abs(a[J-1])*arb(2)**(J-1)/abs(a[1])).str(5))
    fact = [arb(1)]
    for i in range(1, J+2): fact.append(fact[-1]*i)
    def b(tau, nmax=60):
        out = []
        for n in range(nmax):
            v = acb(0); m = 0
            while n+2*m < J:
                v += a[n+2*m]*fact[n+2*m]/(fact[n]*fact[m]*arb(4)**m)*arb(tau)**m
                m += 1
            out.append(v)
        return out
    def ev(bb, h):
        v = acb(0); dv = acb(0); ddv = acb(0)
        for n in range(len(bb)-1, -1, -1):
            ddv = ddv*h+dv; dv = dv*h+v; v = v*h+bb[n]
        return v, dv, 2*ddv
    def newton(bb, h, which=0):
        for _ in range(80):
            v, dv, ddv = ev(bb, h)
            st = (v/dv) if which == 0 else (dv/ddv)
            h = h-st
            h = acb(h.real.mid(), h.imag.mid())
            if abs(complex(st)) < 1e-40: break
        return h
    # track the right-hand zero h(tau) (h = s - c), and the critical point between the pair
    h = acb("0.308517", "0")
    print("tau   Re h (offset from line)   Im h      | F_tau(crit) / (|F'| scale)")
    prev = None
    tau = 0.0; dt = 0.005
    rows = []
    while tau <= 0.5001:
        bb = b(tau)
        h = newton(bb, h)
        x = float(h.real.mid()); yy = float(h.imag.mid())
        rows.append((tau, x, yy))
        if abs(x) < 1e-12 and prev is not None and abs(prev) > 1e-12:
            pass
        prev = x
        if len(rows) % 4 == 1: print("%.3f  %+.6f  %+.6f" % (tau, x, yy), flush=True)
        if abs(x) < 1e-9: break
        tau += dt
    # refine collision time by x^2 linear extrapolation on the last off-line samples
    off = [(t, x) for (t, x, _) in rows if abs(x) > 1e-6]
    (t1, x1), (t2, x2) = off[-2], off[-1]
    tstar = t2+(t2-t1)*x2*x2/(x1*x1-x2*x2)
    print("collision time tau* (x^2 extrapolation):", tstar, " d(x^2)/dtau near collision:", (x2*x2-x1*x1)/(t2-t1))
    # after collision: wall height between the two newborn line zeros
    print("tau   wall W=F_tau(crit)   W/(tau-tau*)   zero offsets along the line")
    for tau in [tstar+d for d in (0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2)]:
        if tau > 0.5: break
        bb = b(tau)
        hc = newton(bb, acb(0, float(rows[-1][2])), which=1)
        W = ev(bb, hc)[0]
        d = math.sqrt(abs(2*(tau-tstar)))
        z1 = newton(bb, hc+acb(0, 0.6*d)); z2 = newton(bb, hc-acb(0, 0.6*d))
        print("%.4f  %s  %s  %+.5f %+.5f" % (tau, W.real.str(6), (W.real/(tau-tstar)).str(6), float(z1.imag.mid()), float(z2.imag.mid())), flush=True)
