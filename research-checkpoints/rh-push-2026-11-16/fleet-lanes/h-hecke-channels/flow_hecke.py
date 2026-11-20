# Check: de Bruijn flow conjugates the Hecke multiplier p^z into a sheared shift.
#   e^{(tau/4) d_z^2} [ p^{+-z} X(z) ] = e^{tau l^2/4} p^{+-z} X_tau(z +- tau l/2),  l = log p
# X(z) = xi(1/2+z) = 4 int_R Phi(u) e^{2zu} du,  X_tau(z) = 4 int_R Phi(u) e^{tau u^2} e^{2zu} du.
from mpmath import *
mp.dps = 30
def Phi(u):
    u = abs(u); tot = mpf(0)
    for n in range(1, 12):
        tot += (2*pi**2*n**4*exp(9*u) - 3*pi*n**2*exp(5*u))*exp(-pi*n**2*exp(4*u))
    return tot
def X(z, tau=0):
    return 4*quad(lambda u: Phi(u)*exp(tau*u*u)*exp(2*z*u), linspace(-2.5, 2.5, 21))
def lhs(z, tau, p):
    l = log(p)
    # p^z X(z) = 4 int Phi(u) e^{2z(u+l/2)} du ; p^-z likewise.  Flow multiplies kernel by e^{tau v^2}, v = u +- l/2
    a = 4*quad(lambda u: Phi(u)*exp(tau*(u+l/2)**2)*exp(2*z*(u+l/2)), linspace(-2.5, 2.5, 21))
    b = 4*quad(lambda u: Phi(u)*exp(tau*(u-l/2)**2)*exp(2*z*(u-l/2)), linspace(-2.5, 2.5, 21))
    return a + b
def rhs(z, tau, p):
    l = log(p); h = tau*l/2
    return exp(tau*l*l/4)*(p**z*X(z+h, tau) + p**(-z)*X(z-h, tau))
z0 = mpc(0, 14.134725141734693790457251983562)/1
print("X(i*gamma1) =", nstr(abs(X(z0)), 5), " X(0.3+2i) vs xi:", nstr(abs(X(mpc(0.3, 2)) - (lambda s: s*(s-1)/2*pi**(-s/2)*gamma(s/2)*zeta(s))(mpc(0.8, 2))), 5))
for tau in [0.3, 0.05, -0.1]:
    for p in [2, 3, 5]:
        for z in [mpc(0.2, 3.1), mpc(-0.4, 9.0)]:
            L = lhs(z, tau, p); R = rhs(z, tau, p)
            print("tau", tau, "p", p, "z", nstr(z, 4), "shear h_p=", nstr(tau*log(p)/2, 6), "rel.err", nstr(abs(L-R)/abs(L), 3))
# monoid law of the conjugated operators T_n^(tau): weight e^{tau log^2 n /4}, shift tau log n /2
for (m, n) in [(2, 3), (3, 5), (2, 2)]:
    tau = mpf(-0.1); z = mpc(0.2, 3.1); f = lambda w: X(w, tau)
    T = lambda k, F: (lambda w: exp(tau*log(k)**2/4)*mpf(k)**(-w)*F(w - tau*log(k)/2))
    a = T(m, T(n, f))(z); b = T(n, T(m, f))(z); c = T(m*n, f)(z)
    print("T_%d T_%d = T_%d T_%d = T_%d :" % (m, n, n, m, m*n), nstr(abs(a-b)/abs(c), 3), nstr(abs(a-c)/abs(c), 3))
