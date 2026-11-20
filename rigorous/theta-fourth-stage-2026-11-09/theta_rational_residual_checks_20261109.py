"""Exact algebra checks for the rational reflection-energy note.

The finite examples below are auxiliary rational functions, not observed
off-axis zeros of xi. No floating-point computation enters the checks.
"""

import json
import sympy as s


def run():
    x,y,rho,z=s.symbols("x y rho z")
    pair=1/((x+rho)*(y-rho))+1/((x-rho)*(y+rho))
    expected=2*(x*y-rho**2)/((x*x-rho**2)*(y*y-rho**2))
    assert s.factor(pair-expected)==0

    rates=list(map(s.Integer,[1,2,3,4,5]))
    gamma=list(map(s.Integer,[2,3]))
    D=s.prod(z+r for r in rates)
    G=s.prod(z*z+g*g for g in gamma)
    b=s.Matrix([s.cancel(G.subs(z,-r)/s.diff(D,z).subs(z,-r)) for r in rates])
    V=sum(bi/(z+r) for bi,r in zip(b,rates))
    assert s.factor(V-G/D)==0
    assert all(s.simplify(V.subs(z,sign*s.I*g))==0 for sign in(-1,1) for g in gamma)

    def lhead(t):
        return sum(2*t/(t*t+g*g) for g in gamma)

    H=s.Matrix([[(lhead(r)+lhead(t))/(r+t) for t in rates] for r in rates])
    assert H.rank()==4
    assert H*b==s.zeros(5,1)
    assert all(H[:k,:k].det()>0 for k in range(1,5))
    defect=s.cancel(H[4,4]-(H[4,:4]*H[:4,:4].inv()*H[:4,4])[0])
    assert defect==0

    # A toy quartet has exact inertia (2,2), as proved in the note.
    rho0=s.Rational(1,4)+3*s.I
    points=[rho0,s.conjugate(rho0),-rho0,-s.conjugate(rho0)]
    target=[1,1,-1,-1]
    P=s.Poly(s.expand(s.interpolate([(p,t*(1+p)**4) for p,t in zip(points,target)],z)),z)
    assert all(c.is_real for c in P.all_coeffs())
    VM=P.as_expr()/(z+1)**4
    assert all(s.simplify(VM.subs(z,p)-t)==0 for p,t in zip(points,target))
    energy=s.simplify(sum(VM.subs(z,p)*s.conjugate(VM.subs(z,-s.conjugate(p))) for p in points))
    assert energy==-4

    eps=s.Rational(1,1000)
    close_rates=[1+j*eps for j in range(4)]
    De=s.prod(z+r for r in close_rates)
    be=s.Matrix([s.cancel(P.as_expr().subs(z,-r)/s.diff(De,z).subs(z,-r)) for r in close_rates])
    Ftoy=s.Poly(s.expand(s.prod(z-p for p in points)),z)
    ltoy=s.cancel(s.diff(Ftoy.as_expr(),z)/Ftoy.as_expr())
    K=s.Matrix([[(ltoy.subs(z,r)+ltoy.subs(z,t))/(r+t) for t in close_rates] for r in close_rates])
    negative_energy=s.cancel((be.T*K*be)[0])
    assert negative_energy<0
    leading=[s.factor(K[:k,:k].det()) for k in range(1,5)]
    pivots=[leading[0]]+[s.cancel(leading[k]/leading[k-1]) for k in range(1,4)]
    assert sum(bool(p>0) for p in pivots)==2
    assert sum(bool(p<0) for p in pivots)==2

    return {
        "status":"passed",
        "pair_identity":"exact symbolic equality",
        "head_example":{
            "frequencies":[2,3],"rates":[1,2,3,4,5],
            "annihilator_coefficients":[str(c) for c in b],
            "rank":4,"next_schur_defect":str(defect),
        },
        "auxiliary_quartet":{
            "centered_zero":"1/4 + 3 i (auxiliary only)",
            "repeated_pole_energy":str(energy),
            "distinct_rates":[str(r) for r in close_rates],
            "distinct_pole_energy":str(negative_energy),
            "positive_directions":2,"negative_directions":2,
        },
        "scope":"Formula audits only; no off-axis xi zero found, no RH proof",
    }


if __name__=="__main__":
    print(json.dumps(run(),indent=2))
