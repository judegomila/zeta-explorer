# Identity checks and real-field (GHS-type) inequality for xi and the Davenport-Heilbronn control.
# Memory: scalar mpmath only, no arrays beyond a few hundred floats.
from mpmath import mp, mpf, mpc, pi, gamma, zeta, exp, log, quad, inf, diff, sqrt, dirichlet, atan, cos, sin, loggamma
mp.dps = 30

def Phi(u, N=30):
    s = mpf(0)
    for n in range(1, N+1):
        s += (2*pi**2*n**4*exp(9*u) - 3*pi*n**2*exp(5*u))*exp(-pi*n**2*exp(4*u))
    return s
def phi1(u):
    return (2*pi**2*exp(9*u) - 3*pi*exp(5*u))*exp(-pi*exp(4*u))
def xi(s):
    return s*(s-1)/2*pi**(-s/2)*gamma(s/2)*zeta(s)

print("== 1. Xi(z) = int Phi e^{izu} du = xi((1+iz)/2)/4 ; single term transform = (1/4)(s(s-1)/2)pi^{-s/2}Gamma(s/2)")
for z in [mpf(0), mpf(3), mpf(14.134725141734693790457251983562)]:
    I = 2*quad(lambda u: Phi(u)*cos(z*u), [0, 0.5, 1, 2])
    s = (1+1j*z)/2
    print(" z=%s  integral=%s  xi/4=%s" % (mp.nstr(z,8), mp.nstr(I,15), mp.nstr(xi(s)/4,15)))
for z in [mpc(0.7,0.2), mpc(5,-0.4)]:
    I = quad(lambda u: phi1(u)*exp(1j*z*u), [-inf, -2, 0, 0.5, 1, 2])
    s = (1+1j*z)/2
    cf = (s*(s-1)/2)*pi**(-s/2)*gamma(s/2)/4
    print(" single term z=%s  integral=%s  closed=%s" % (mp.nstr(z,6), mp.nstr(I,12), mp.nstr(cf,12)))
print(" evenness defect of Phi: max |Phi(u)-Phi(-u)| on grid =",
      mp.nstr(max(abs(Phi(mpf(k)/20, 60)-Phi(-mpf(k)/20, 400)) for k in range(1,9)), 5))
print(" sign of single term phi1 at u=-0.3:", mp.nstr(phi1(mpf(-0.3)),8), "(negative => single-site density is signed)")

print("== 2. GHS-type inequality at real field: d^3/dsigma^3 log xi(sigma) <= 0 for sigma > 1/2")
def L3(f, x):
    return diff(lambda t: log(f(t)), x, 3)
worst = None
for k in range(1, 121):
    x = mpf(1)/2 + mpf(k)/4          # sigma = 0.75 .. 30.5
    if abs(x-1) < 1e-9: continue
    v = L3(xi, x)
    if worst is None or v > worst[1]: worst = (x, v)
print(" zeta: max over sigma in (0.5,30.5] step .25 of (log xi)''' =", mp.nstr(worst[1],8), "at sigma=", mp.nstr(worst[0],5))
for x in [mpf('0.51'), mpf('0.6'), mpf(2), mpf(10), mpf(25), mpf(60), mpf(200)]:
    print("   sigma=%s  (log xi)'''=%s" % (mp.nstr(x,5), mp.nstr(L3(xi,x),8)))

# Davenport-Heilbronn: f = (1/2) sec(th) [e^{-i th} L(s,chi) + e^{i th} L(s,chibar)], chi mod 5, chi(2)=i
kap = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1); th = atan(kap)
chi = [0, 1, 1j, -1j, -1]; chib = [0, 1, -1j, 1j, -1]
def fDH(s):
    return (exp(-1j*th)*dirichlet(s, chi) + exp(1j*th)*dirichlet(s, chib))/(2*cos(th))
def LamDH(s):
    return (mpf(5)/pi)**(s/2)*gamma((s+1)/2)*fDH(s)
s0 = mpc(0.3, 7.7)
print(" DH functional equation check |Lam(s)-Lam(1-s)|/|Lam(s)| =", mp.nstr(abs(LamDH(s0)-LamDH(1-s0))/abs(LamDH(s0)),5))
print(" DH coefficients a(1..5) = 1, kappa, -kappa, -1, 0 with kappa =", mp.nstr(kap,12))
print(" DH off-line zero check |f(0.8085171825+85.6993484854i)| =", mp.nstr(abs(fDH(mpc('0.8085171825','85.6993484854'))),5))
reDH = lambda t: LamDH(t).real
worst = None; mn = None
for k in range(1, 121):
    x = mpf(1)/2 + mpf(k)/4
    val = reDH(x)
    if mn is None or val < mn: mn = val
    v = diff(lambda t: log(reDH(t)), x, 3)
    if worst is None or v > worst[1]: worst = (x, v)
print(" DH: min of Lam_DH(sigma) on grid =", mp.nstr(mn,8), "(positive => real-field MGF positive)")
print(" DH: max over sigma in (0.5,30.5] of (log Lam_DH)''' =", mp.nstr(worst[1],8), "at sigma=", mp.nstr(worst[0],5))
for x in [mpf('0.51'), mpf('0.6'), mpf(2), mpf(10), mpf(25)]:
    print("   sigma=%s  (log Lam_DH)'''=%s" % (mp.nstr(x,5), mp.nstr(diff(lambda t: log(reDH(t)), x, 3),8)))

print("== 3. Even cumulant signs (Newman 1975 necessary condition): u_{2n} = (2n)! (-1)^{n-1} sigma_n / n")
# cumulants of U from Taylor coefficients of log xi(1/2 + h/2) in h
from mpmath import taylor
for name, F in [("zeta", lambda h: log(xi(mpf(1)/2 + h/2))), ("DH", lambda h: log(reDH(mpf(1)/2 + h/2)))]:
    c = taylor(F, 0, 12)
    out = []
    for n in range(1, 7):
        out.append(mp.nstr((-1)**(n-1)*c[2*n]*n, 6))
    print(" %s: (-1)^{n-1} n c_{2n} (= sum over zero pairs of gamma^{-2n}, n=1..6): %s" % (name, ", ".join(out)))
