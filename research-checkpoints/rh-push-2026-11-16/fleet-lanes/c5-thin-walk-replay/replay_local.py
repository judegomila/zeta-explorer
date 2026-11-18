"""Replay of Lemma 7.1 algebra with eta(p) a free unimodular symbol (THIN: eta(p) = +-1).
(a) eta-degree audit of table (7.16): every entry must carry eta(p)^t with t = e0 + 3l (mod 6 pattern via R).
(b) symbolic check of (7.17) from (7.11), (7.12).
(c) numeric sup of |H_p - 1| Q^{363/200} (p not| u, region (7.15)) for eta = +1, -1, random unit phases.
Planned memory: < 50 MB (sympy symbols, 2e4 float evaluations)."""
import sympy as sp, random, cmath, math
print("planned memory: < 50 MB")
eta,Q,x,w,z,rho,alpha,chi4,omega = sp.symbols('eta Q x w z rho alpha chi4 omega')
ap = alpha**3*eta**3; bp = alpha**2*eta**2*chi4
V = Q**(-6*z); R = ap**2*Q**(4-6*x-6*z); Wl = rho*Q**(-w)
# (a) table (7.16): (family (e0,l) with r=0, k, entry / R^r); t = e0+3l at r=0
rows = [((0,2),0,R*(1-1/Q)), ((0,2),0,-ap**2*Q**(3-6*x)), ((0,2),1,Wl*R),
        ((1,0),0,-eta/rho*Q**(-x)), ((1,0),1,eta*Q**(-x-w)), ((1,0),1,-eta*(Q-1)*Q**(-x-w)),
        ((0,1),0,ap*rho**-3*Q**(sp.Rational(3,2)-3*x)), ((0,1),1,-eta*bp*rho**-2*Q**(2-3*x-w)),
        ((1,1),0,bp**2*rho**-4*Q**(2-4*x)), ((1,1),1,-eta*ap*rho**-3*Q**(sp.Rational(5,2)-4*x-w))]
ok=True
for (e0,l),k,ent in rows:
    t=e0+3*l
    deg=sp.degree(sp.Poly(sp.expand(ent*Q**50).subs({Q:2,x:1,w:1,z:1,rho:1,alpha:1,chi4:1}),eta)) if True else None
    P=sp.Poly(sp.expand(ent.subs({Q:3,x:1,w:1,z:1,rho:1,alpha:1,chi4:1})),eta)
    mons=[m[0] for m in P.monoms()]
    good = (mons==[t])
    ok&=good
    print(f"(e0,l)=({e0},{l}) k={k} t={t} eta-degrees={mons} {'OK' if good else 'MISMATCH'}")
print("eta-degree audit:", "PASS" if ok else "FAIL")
# R carries eta^6 = one step r->r+1 (t -> t+6)
print("R eta-degree:", sp.Poly(R.subs({Q:3,x:1,z:1,alpha:1}),eta).monoms())
# (b) (7.17) for p not| u, j = 0 : W = Wloc, D = eta*rho*Q^-x
J0 = -eta/rho*Q**(-x) + Wl*R
def check(j, Jj, ind_le1, ind0, Wv, Dv):
    Pstar = (R*(1-1/Q) - eta*(Q-1)*Q**(-x-w)*(V if ind_le1 else 1))/(1-V)
    Pstar = (Pstar + Jj)/(1-R)
    Pp = 1/(1-V) + (Wl/(1-Wl) if ind0 else 0) + Pstar
    Hp = Pp*(1-V)*(1-Wv)/(1-Dv)
    Ep = Pstar + Dv
    rhs = (Dv*(V+Wv-V*Wv) - V*Wv + (1-V)*(1-Wv)*Ep)/(1-Dv)
    return sp.simplify(Hp-1-rhs)
# note: indicator 1_{j<=1} multiplies V exponent: (Q-1)Q^{-x-w} V^{1_{j<=1}}
# j = 0: chi_p(u) = rho, W = rho Q^-w, D = eta rho Q^-x
print("(7.17) j=0 residual:", check(0, J0, True, True, Wl, eta*rho*Q**(-x)))
# j >= 1 (p | u): W = D = 0, formula reduces to (1-V) Ep
for j,Jj,le1 in [(1,eta*Q**(-x-w),True),(2,ap*rho**-3*Q**(sp.Rational(3,2)-3*x),False),(5,-ap**2*Q**(3-6*x),False)]:
    print(f"(7.17) j={j} residual:", check(j,Jj,le1,False,0,0))
# (c) numeric: region (7.15) corner, p not| u (j=0), D with rho; the j=0 row has -eta rho^-1 Q^-x: Ep = Pstar + D
# NOTE: Ep = Pstar + D cancels -eta rho^-1 Q^-x against D = eta rho Q^-x only if rho^-1 = rho?  check below.
def Hm1(Qv, xv, wv, zv, e, r, a):
    Vv=Qv**(-6*zv); Rv=(a*e**3)**2*Qv**(4-6*xv-6*zv); Wv=r*Qv**(-wv)
    J=-e/r*Qv**(-xv)+Wv*Rv
    Ps=((Rv*(1-1/Qv)-e*(Qv-1)*Qv**(-xv-wv)*Vv)/(1-Vv)+J)/(1-Rv)
    Pp=1/(1-Vv)+Wv/(1-Wv)+Ps
    out={}
    for name,Dv in (("D=eta*rho*Q^-x",e*r*Qv**(-xv)),("D=eta*conj(rho)*Q^-x",e/r*Qv**(-xv))):
        out[name]=abs(Pp*(1-Vv)*(1-Wv)/(1-Dv)-1)
    return out
random.seed(1)
worst={}
for Qv in (7,13,19,31,97,1009,10007,100003):
    for trial in range(400):
        xv=complex(7/8+random.random()*0.2, random.uniform(-50,50))
        wv=complex(0.95+random.random()*0.2, random.uniform(-50,50))
        zv=complex(33/200+random.random()*0.1, random.uniform(-50,50))
        r=cmath.exp(2j*math.pi*random.randrange(6)/6)
        a=cmath.exp(2j*math.pi*random.random())
        for e in (1,-1,cmath.exp(2j*math.pi*random.random())):
            o=Hm1(Qv,xv,wv,zv,e,r,a)
            for kname,val in o.items():
                key=(kname,Qv)
                worst[key]=max(worst.get(key,0), val*Qv**(363/200))
for k in sorted(worst): print(k, "sup |H_p-1| Q^(363/200) =", round(worst[k],4))
