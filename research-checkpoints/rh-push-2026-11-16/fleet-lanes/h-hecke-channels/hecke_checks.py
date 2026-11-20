# Hecke relations on the isogeny tree for the lattice (twin-ladder) loading. mpmath, 30 digits.
from mpmath import *
mp.dps = 30

def xis(z):  # xi*(z) = pi^{-z/2} Gamma(z/2) zeta(z)
    return pi**(-z/2)*gamma(z/2)*zeta(z)

def sigma(n, a):
    return sum(mpf(d)**a for d in range(1, n+1) if n % d == 0)

def reduce_tau(t):
    t = mpc(t)
    for _ in range(200):
        t = t - floor(t.real + mpf(1)/2)
        if abs(t) < 1 - mpf(10)**(-20):
            t = -1/t
        else:
            break
    return t

def Estar(tau, s, N=None):
    # E*(tau,s) = (1/2) pi^{-s} Gamma(s) sum' y^s/|m tau+n|^{2s}; invariant under SL2(Z), s<->1-s
    tau = reduce_tau(tau); x, y = tau.real, tau.imag
    if N is None:
        N = int(8 + (mp.dps*2.4 + abs(s.imag if isinstance(s, mpc) else 0)*1.2)/(2*3.14159*float(y)))
    tot = xis(2*s)*y**s + xis(2*s-1)*y**(1-s)
    acc = 0
    for n in range(1, N+1):
        acc += mpf(n)**(s-mpf(1)/2)*sigma(n, 1-2*s)*besselk(s-mpf(1)/2, 2*pi*n*y)*cos(2*pi*n*x)
    return tot + 4*sqrt(y)*acc

def neighbours(tau, p):
    return [p*tau] + [(tau+b)/p for b in range(p)]

chi4 = [0, 1, 0, -1]
if __name__ == "__main__":
    print("== 0. E*(i,s) = 2 pi^-s Gamma(s) zeta(s) L(s,chi_-4)")
    for s in [mpc(2, 1), mpc(0.5, 14.134725), mpc(0.3, 7)]:
        a = Estar(1j, s); b = 2*pi**(-s)*gamma(s)*zeta(s)*dirichlet(s, chi4)
        print(s, abs(a-b)/max(abs(b), mpf(10)**-25) if abs(b) > 1e-20 else abs(a-b))
    print("== 1. Hecke: sum over p+1 neighbours E*(tau',s) = (p^s+p^(1-s)) p^(-1/2) ... determine factor")
    for tau in [mpc(0, 1), mpc(0.2371, 1.4142), mpc(-0.31, 2.2)]:
        for p in [2, 3, 5]:
            for s in [mpc(0.5, 14.134725141734693790), mpc(0.8, 9.3), mpc(1.7, -2.2)]:
                lhs = sum(Estar(t, s) for t in neighbours(tau, p))
                rhs = (p**s + p**(1-s))*Estar(tau, s)
                print("tau", nstr(tau, 5), "p", p, "s", nstr(s, 6), "rel.err", nstr(abs(lhs-rhs)/(abs(rhs)+abs(lhs)+mpf(10)**-40), 3), "|lhs|", nstr(abs(lhs), 3))
    print("== 2. neighbour classes of tau=i")
    for p in [2, 3, 5]:
        print(p, [nstr(reduce_tau(t), 8) for t in neighbours(mpc(0, 1), p)])
