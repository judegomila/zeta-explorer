# Rigorous lower bound ||V|| >= <u,Vw>/(||u|| ||w||), u=Phi e^{at}, w=Phi e^{-as}:
#  <u,Vw> = (1/2) int_0^U Phi(t)^2 [ e^{2at} J_-(t) - J_0(t) ] dt,  J_-(t)=int_0^t Phi^2 e^{-2as} ds, J_0(t)=int_0^t Phi^2 ds.
# Restricting to [0,U] only lowers <u,Vw> (integrand >= 0); E_+ , E_- are taken over [0,U] with tail bound noted in RESULT.md.
import sys, time
from flint import arb, acb, ctx
ctx.prec = 120
N, U = 12, 2
def Phi(u):
    s = acb(0); pi = acb.pi()
    for n in range(1, N+1):
        s += (2*pi**2*n**4*(9*u).exp() - 3*pi*n**2*(5*u).exp())*(-pi*n**2*(4*u).exp()).exp()
    return s
rt, at_ = arb(2)**-45, arb(2)**-200
def integ(f, a, b): return acb.integral(lambda x, _: f(x), a, b, rel_tol=rt, abs_tol=at_)
def lower(a):
    a = arb(a)
    def outer(t):
        Jm = integ(lambda s: Phi(s)**2*(-2*a*s).exp(), 0, t)
        J0 = integ(lambda s: Phi(s)**2, 0, t)
        return Phi(t)**2*((2*a*t).exp()*Jm - J0)
    num = integ(outer, 0, U).real/2
    Ep = integ(lambda u: Phi(u)**2*(2*a*u).exp(), 0, U).real
    Em = integ(lambda u: Phi(u)**2*(-2*a*u).exp(), 0, U).real
    return num/(Ep*Em).sqrt()
for a in sys.argv[1:]:
    t = time.time(); v = lower(a); print("a =", a, " ||V|| >=", v.str(15), " (%.0fs)" % (time.time()-t), flush=True)
