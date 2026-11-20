"""R4 numerical test (MEASURED, mpmath) of the all-real-sigma heated Riemann-Siegel remainder and term bounds
at moderate height, for real parts in [-3,4] (heights y up to 6.01). Not a proof; a falsification test."""
import sys
from mpmath import mp, mpf, mpc, log, exp, sqrt, pi, zeta, gamma, floor, re, im, cos, loggamma
mp.dps = 50
I = mpc(0,1)
def alpha(s): return 1/(2*s) + 1/(s-1) + log(s/(2*pi))/2
def logM0(s): return log(s)+log(s-1)-s/2*log(pi)+log(sqrt(2*pi)/16)+(s/2-mpf(1)/2)*log(s/2)-s/2
def logP(s):  # log of (1/8) s(s-1)/2 pi^{-s/2} Gamma(s/2)
    return log(s)+log(s-1)-log(16)-s/2*log(pi)+loggamma(s/2)
def G(sig, c, t, D, K=mpf(11)/12):
    return exp(K/D + (sig**2/D + sig*c + t*c**2/4)/(1-t/D))/sqrt(1-t/D)
def C0(p):
    return (exp(pi*I*(p*p/2+mpf(3)/8)) - I*sqrt(2)*cos(pi*p/2))/(2*cos(pi*p))
H = mpf(1)/5; VM = 9
nodes = [H*k for k in range(-int(VM/H), int(VM/H)+1)]
def heat(F, t):
    tot = mpc(0)
    for v in nodes:
        tot += F(sqrt(t)*v)*exp(-v*v)
    return tot*H/sqrt(pi)
def run(x, y, t):
    x = mpf(x); y = mpf(y); t = mpf(t)
    T = x/2; Tp = T + pi*t/8; a = sqrt(Tp/(2*pi)); N = int(floor(a)); p = 1-2*(a-N)
    s0 = mpc((1-y)/2, T)
    # common scale: exp(-logscale) removes the Gamma decay
    scale = re(logM0(mpc(0,Tp))) + t*pi**2/64
    def Rint(w):
        s = s0 + w
        Ps = exp(logP(s)-scale); Pr = exp(logP(1-s)-scale)
        S1 = sum(mpf(n)**(-s) for n in range(1,N+1)); S2 = sum(mpf(n)**(-(1-s)) for n in range(1,N+1))
        return Ps*(zeta(s) - S1) - Pr*S2
    R = heat(Rint, t)
    D = T-3
    def br(sig): return G(sig,0,t,D)/2 + mpf('0.2')*G(sig,log(9),t,D)/(a-mpf('0.865')) + mpf('0.029')*G(sig,-log(2),t,D)/(a-mpf('0.353'))
    bound = br((1-y)/2) + br((1+y)/2)
    print("x=%-7s y=%-5s t=%-5s N=%-3d p=%+.3f |Rtot|/(e^{t pi^2/64}|M0(iT')|)=%s  bound=%s  2|C0(p)|=%s  %s" % (
        mp.nstr(x,7), mp.nstr(y,4), mp.nstr(t,3), N, float(p), mp.nstr(abs(R),8), mp.nstr(bound,8), mp.nstr(2*abs(C0(p)),6), "OK" if abs(R) <= bound else "VIOLATION"))
    sys.stdout.flush()
    return abs(R) <= bound
def term(x, sig, t, n):
    # Prop 6.1 at sigma+iT: r_{t,n} versus M_t b_n^t n^{-(s+t alpha/2)}
    T = mpf(x)/2; s = mpc(sig, T); t = mpf(t)
    base = logM0(s)
    r = heat(lambda w: exp(logP(s+w) - (s+w)*log(n) - base), t)
    al = alpha(s)
    approx = exp(t*al**2/4 + t*log(n)**2/4 - (s + t*al/2)*log(n))
    rel = abs(r/approx - 1)
    eps = exp((t*t/8*abs(al-log(n))**2 + t/4 + mpf(1)/6)/(T-mpf('3.33'))) - 1
    print("  term x=%s sigma=%+.3f t=%s n=%d  rel.err=%s  eps_{t,n}=%s  %s" % (x, sig, mp.nstr(t,3), n, mp.nstr(rel,6), mp.nstr(eps,6), "OK" if rel <= eps else "VIOLATION"))
    return rel <= eps
ok = True
for x in (2000, 2003.7, 30000.5):
    for y in (0, 1, 2.5, 4, 6.01):
        for t in (0.02, 0.152):
            ok &= run(x, y, t)
for x in (2000, 30000.5):
    for sig in (-2.505, -1, 0.5, 2, 3.505):
        for t in (0.02, 0.152):
            for n in (1, 3, int(floor(sqrt(mpf(x)/(4*pi))))):
                ok &= term(x, sig, t, n)
print("ALL OK" if ok else "SOME VIOLATION")
