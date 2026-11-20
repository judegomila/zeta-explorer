import sympy as sp
from fractions import Fraction as Fr
print("planned memory: < 50 MB")
eta,Q,x,w,z,rho,alpha = sp.symbols('eta Q x w z rho alpha')
ap = alpha**3*eta**3
V = Q**(-6*z); R = ap**2*Q**(4-6*x-6*z); Wl = rho*Q**(-w)
J0 = -eta/rho*Q**(-x) + Wl*R
Pstar = ((R*(1-1/Q) - eta*(Q-1)*Q**(-x-w)*V)/(1-V) + J0)/(1-R)
Pp = 1/(1-V) + Wl/(1-Wl) + Pstar
for name,Dv in (("D = eta*rho*Q^-x (as printed)", eta*rho*Q**(-x)), ("D = eta*rho^-1*Q^-x", eta/rho*Q**(-x))):
    Hp = Pp*(1-V)*(1-Wl)/(1-Dv); Ep = Pstar + Dv
    rhs = (Dv*(V+Wl-V*Wl) - V*Wl + (1-V)*(1-Wl)*Ep)/(1-Dv)
    res = sp.simplify((Hp-1-rhs))
    # leading behaviour of Ep: does the Q^-x term cancel?
    lead = sp.simplify((J0 + Dv).subs({alpha:1}) - Wl*R.subs({alpha:1}))
    print(name, "| (7.17) residual:", res, "| Q^-x term left in Ep:", lead)
# exact rational consistency check of g_THIN(b) = min_delta max(11/12+(1+b)delta, 13/12-(1-b)delta/2)
def g_formula(b): return Fr(11,12) + (1+b)/(3*(3+b))
def g_grid(b, n=3000):
    best=None
    for i in range(n+1):
        d=Fr(i,n)
        v=max(Fr(11,12)+(1+b)*d, Fr(13,12)-(1-b)*d/2)
        best=v if best is None or v<best else best
    return best
mn=None
for i in range(0,126):
    b=Fr(7,8)+Fr(i,1000)
    gf=g_formula(b); gg=g_grid(b)
    assert gg>=gf, (b,gf,gg)           # formula is the exact minimum (LP vertex)
    assert gg-gf < Fr(1,1000)
    m=gf-b; mn=m if mn is None or m<mn else mn
    if i%25==0: print("b =",b,"g =",gf,"=",float(gf),"g-b =",float(m),"delta* =",Fr(1,1)/(3*(3+b)))
print("min over grid of g(b)-b on [7/8,1]:", mn, float(mn), " (=1/12 at b=1)")
# necessary side (Prop D + Cauchy-Schwarz): energy exponent >= 2b-5/6 if high comparison holds
for b in (Fr(7,8),Fr(11,12),Fr(19,20),Fr(1)):
    print("b =",b," necessary E >=",2*b-Fr(5,6)," lambda_min = b-11/12 =",b-Fr(11,12)," proved upper E <=", 2*(g_formula(b)-Fr(5,12)))
