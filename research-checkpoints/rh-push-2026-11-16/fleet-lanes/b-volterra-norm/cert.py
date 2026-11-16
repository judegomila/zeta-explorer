# Arb enclosures of G(a)^2 = (E_+ E_- - I^2)/4 with E_pm = int_0^U Phi^2 e^{+-2at}, I = int_0^U Phi^2, Phi truncated at N terms.
# Truncation: U=2, N=20. Discarded pieces are bounded in RESULT.md (below 1e-1000 relative).
from flint import arb, acb, ctx
ctx.prec = 200
N, U = 20, 2
def Phi(u):
    s = acb(0); pi = acb.pi()
    for n in range(1, N+1):
        s += (2*pi**2*n**4*(9*u).exp() - 3*pi*n**2*(5*u).exp())*(-pi*n**2*(4*u).exp()).exp()
    return s
def integ(f):
    return acb.integral(lambda x, _: f(x), 0, U, rel_tol=arb(2)**-80, abs_tol=arb(2)**-300).real
def G2(a):
    a = arb(a)
    Ep = integ(lambda u: Phi(u)**2*(2*a*u).exp())
    Em = integ(lambda u: Phi(u)**2*(-2*a*u).exp())
    I = integ(lambda u: Phi(u)**2)
    return (Ep*Em - I*I)/4
for a in ["31.6213", "31.6214", "34.0557", "34.0558", "0.5"]:
    g2 = G2(a); print("a =", a, " G^2 in", g2.str(25), " G in", g2.sqrt().str(25))
