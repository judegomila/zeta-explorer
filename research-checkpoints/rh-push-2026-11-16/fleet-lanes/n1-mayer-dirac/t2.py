import sys, time
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
from mpmath import quad, exp, hyp1f1, diff, sqrt, re, conj, fabs, besselj, quadosc, inf
mp.dps = 30
# (i) Lemma L1 on a generic g(t)=t^beta e^{-t} (no eigen-equation), complex nu.
#  H_mu[t^beta e^-t](u) = int J_mu(2 sqrt(ut)) t^beta e^-t dt = u^(mu/2) G(beta+mu/2+1)/G(mu+1) 1F1(beta+mu/2+1; mu+1; -u)
def H(mu, beta, u): return u**(mu/2)*gamma(beta+mu/2+1)/gamma(mu+1)*hyp1f1(beta+mu/2+1, mu+1, -u)
print("closed form vs quadrature:", mp.nstr(fabs(H(mpf('0.3'), mpf('0.2'), mpf('1.7')) - quad(lambda t: besselj(mpf('0.3'), 2*sqrt(mpf('1.7')*t))*t**mpf('0.2')*exp(-t), [0, 5, 20, 80])), 5))
for nu in (mpc('-0.5', '14.1347'), mpc('-0.2', '3.0'), mpc('-0.8', '3.0')):
    kap = nu + mpf(1)/2
    for beta in (mpc('0.3', '0.7'),):
        P1 = lambda u: H(nu, beta, u); P2 = lambda u: H(nu+1, beta, u)
        P1p = lambda u: H(nu, beta+mpf(1)/2, u); P2p = lambda u: H(nu+1, beta+mpf(1)/2, u)
        Q = lambda u: sqrt(u)*(fabs(P1(u))**2 + fabs(P2(u))**2)
        Nint = lambda u: (fabs(P1(u))**2 - fabs(P2(u))**2)/sqrt(u)
        Sint = lambda u: 2*re(conj(P2(u))*P1p(u) - conj(P1(u))*P2p(u))
        e, R = mpf('0.2'), mpf(6)
        B = Q(R) - Q(e); Nv = quad(Nint, [e, 1, 3, R]); S = quad(Sint, [e, 1, 3, R])
        print("nu=%s: boundary=%s  Re(kappa)*N=%s  source=%s  defect=%s"%(mp.nstr(nu,6), mp.nstr(B,10), mp.nstr(re(kap)*Nv,10), mp.nstr(S,10), mp.nstr(B-re(kap)*Nv-S,3)))
# (ii) Mellin multiplier H_mu[t^(s-1)](u) = u^(-s) G(mu/2+s)/G(mu/2+1-s); check at mu=1.3, s=0.4 (convergent range)
mu, s, u = mpf('1.3'), mpf('0.4'), mpf('2.1')
I = quadosc(lambda x: besselj(mu, x)*(x*x/(4*u))**(s-1)*x/(2*u), [0, inf], omega=1)
print("multiplier check:", mp.nstr(I, 12), mp.nstr(u**(-s)*gamma(mu/2+s)/gamma(mu/2+1-s), 12))
# (iii)/(iv) eigenfunction: Laplace check with relative error, and the large-u regime
mp.dps = 60
for k in (1, 2, 5):
    rho = zetazero(k); s = rho; nu = rho - 1
    x = mpf(2)
    f = lambda u: exp(-x*u)*u**nu*Wg_over(u, nu)/gamma(nu+1)
    pts = [mpf(i)/4 for i in range(0, 41)] + [12, 15, 20, 30, 45]
    I = quad(f, pts); ex = psi(x, s) - psi(x+1, s)
    print("k=%d Laplace check x=2: rel err %s (value %s)"%(k, mp.nstr(fabs(I-ex)/fabs(ex), 5), mp.nstr(ex, 8)))
    cinf = fabs(zeta(nu)/nu)**2
    for U in (300, 1000, 3000):
        P1 = mpf(U)**(nu/2)*Wg_over(U, nu)/gamma(nu+1)
        print("   u=%d: Q(u)/u = %s (pred |zeta(nu)/nu|^2=%s)"%(U, mp.nstr(sqrt(mpf(U))*fabs(P1)**2/U, 10), mp.nstr(cinf, 10)), flush=True)
