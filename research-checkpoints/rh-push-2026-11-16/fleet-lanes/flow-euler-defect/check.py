# Checks for RESULT.md sections 2-4. mpmath only, single process.
from mpmath import mp, mpf, mpc, quad, exp, log, pi, cos, gamma, zeta, inf, sqrt, nsum
mp.dps = 30
def g(y): return (2*pi**2*y**4 - 3*pi*y**2)*exp(-pi*y*y)
def Phi(u, N=30):
    u = abs(u)   # Phi is even; the n-sum is truncated, so evaluate on u>=0
    return sum(exp(u/2)*g(n*exp(u)) for n in range(1, N+1))
def xi(s): return mpf(1)/4*s*(s-1)*pi**(-s/2)*gamma(s/2)*zeta(s)
def gam(s): return s*(s-1)*pi**(-s/2)*gamma(s/2)          # = 4 * Mellin(g)(s)
def H_direct(t, z):      # int e^{t u^2} Phi(u) e^{izu} du
    f = lambda u: exp(t*u*u)*Phi(u)*exp(1j*z*u)
    return quad(f, [-3, -2, -1, 0, 1, 2, 3])
def gam_t(t, s):         # int e^{t v^2} g(e^v) e^{s v} dv   (t<0)
    f = lambda v: exp(t*v*v)*g(exp(v))*exp(s*v)
    return quad(f, [-40, -20, -10, -5, -2, 0, 1, 2, 3])
def H_series(t, z, N=60):
    s = mpf(1)/2 + 1j*z
    return sum(exp(t*log(n)**2)*mpf(n)**(-s)*gam_t(t, s - 2*t*log(n)) for n in range(1, N+1))
print("evenness of Phi:", Phi(mpf('0.3')), Phi(mpf('-0.3')))
print("t=0: direct, xi:", H_direct(0, mpf(3)), xi(mpf(1)/2+3j))
print("Mellin(g)(s)*4 vs gam:", 4*gam_t(0, mpc(2,1)), gam(mpc(2,1)))
for t in (mpf('-0.05'), mpf('-0.3')):
    for z in (mpf(2), mpc(5, 0.7), mpf(14)):
        a = H_direct(t, z); b = H_series(t, z)
        print("t=%s z=%s direct=%s series=%s relerr=%s" % (t, z, mp.nstr(a, 12), mp.nstr(b, 12), mp.nstr(abs(a-b)/abs(a), 3)))
# vertical-mixture identity: H_t(z) = E_{a~N(0,2|t|)} Xi(z+a), t<0
t = mpf('-0.05'); z = mpf(2)
mix = quad(lambda a: exp(-a*a/(4*abs(t)))/sqrt(4*pi*abs(t))*xi(mpf(1)/2+1j*(z+a)), [-8, -2, 0, 2, 8])
print("vertical mixture:", mp.nstr(mix, 12), " direct:", mp.nstr(H_direct(t, z), 12))
# horizontal-mixture identity: H_t(z) = E_{b~N(0,2t)} xi(1/2+iz+b), t>0
t = mpf('0.05'); z = mpf(2)
mix = quad(lambda b: exp(-b*b/(4*t))/sqrt(4*pi*t)*xi(mpf(1)/2+1j*z+b), [-12, -4, 0, 4, 12])
print("horizontal mixture:", mp.nstr(mix, 12), " direct:", mp.nstr(H_direct(t, z), 12))
# termwise divergence for t>0: single-mode integrand at u -> -inf
for u in (-10, -30, -60):
    print("t=0.05 mode n=1 integrand at u=%d:" % u, mp.nstr(exp(t*u*u)*exp(mpf(u)/2)*g(exp(mpf(u))), 5))
# cocycle
for t in (mpf('-0.05'), mpf('0.05')):
    c = lambda n: exp(t*log(n)**2)
    print("t=%s  c6/(c2 c3)=%s  exp(2t log2 log3)=%s" % (t, mp.nstr(c(6)/(c(2)*c(3)), 12), mp.nstr(exp(2*t*log(2)*log(3)), 12)))
