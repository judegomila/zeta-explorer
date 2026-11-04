"""Exact symbolic identity checks on F=(t^2-1) exp(-t^2/2).
These are algebra/domain sanity checks, not actual-theta asymptotics.
"""
import sympy as s
x=s.symbols('x', real=True)
f=x*x-1
fp=s.diff(f,x)-x*f
fpp=s.diff(fp,x)-x*fp
w=f*f
v=2*(fp*fp-f*fpp)

def integ(poly):
    poly=s.Poly(s.expand(poly),x)
    return s.simplify(sum(c*(s.factorial2(k-1)/2**(k//2) if k else s.Integer(1)) for (k,),c in poly.terms() if k%2==0))

def hd(p,q): return integ(w*s.diff(p,x)*s.diff(q,x))
def xd(p,q): return hd(p,q)+integ(v*p*q)
def wd(poly): return s.diff(poly,x)-2*x*poly

def selected(n,form):
    inds=list(range(n%2,n,2))
    if not inds: return x**n
    M=s.Matrix([[form(x**i,x**j) for j in inds] for i in inds])
    z=s.Matrix([form(x**n,x**i) for i in inds])
    c=M.inv()*z
    return s.expand(x**n-sum(c[k]*x**i for k,i in enumerate(inds)))

for n in range(9):
    p=selected(n,xd); A=xd(p,p); R=x*s.diff(p,x)-n*p
    S=f*s.diff(p,x)+2*fp*p
    vir=integ((w-x*wd(w))*s.diff(p,x)**2-(v+x*wd(v))*p**2)
    assert s.simplify(vir-2*n*A)==0
    curv=integ(((2*n-1)**2*w+(4*n-1)*x*wd(w)+x*x*wd(wd(w)))*s.diff(p,x)**2+((2*n+1)**2*v+(4*n+3)*x*wd(v)+x*x*wd(wd(v)))*p**2)
    assert s.simplify(curv-2*xd(R,R))==0
    source=integ(S*((f-x*fp)*s.diff(p,x)-2*x*fpp*p))
    assert s.simplify(source-(s.Rational(1,2)+n)*A)==0
    L=(n-s.Rational(1,2))*hd(p,p)+integ(x*wd(w)*s.diff(p,x)**2)/2
    assert s.simplify(hd(p,R)+L)==0
    if n:
        pi=selected(n-1,lambda p,q:integ(w*p*q))
        U=integ(w*(s.diff(p,x)-n*pi)**2)
        assert s.simplify(U*hd(R,R)-L**2)>=0
print('PASS: virial, curvature, source commutator, derivative defect, and lower bound, n=0,...,8; exact rational arithmetic after dividing integrals by sqrt(pi).')
