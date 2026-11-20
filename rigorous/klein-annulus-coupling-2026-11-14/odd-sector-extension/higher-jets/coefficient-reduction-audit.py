"""Exact coefficient-reduction controls; not a theta numerical certificate."""
from pathlib import Path
from functools import lru_cache
import json,math
import sympy as s
u=s.symbols('u',real=True)
odd=[1,3,5,7]

def integrate_polynomial_gaussian(p):
    result=s.S(0)
    for (degree,),co in s.Poly(s.expand(p),u).terms():
        result+=co*s.gamma(s.Rational(degree+1,2))/(2*2**s.Rational(degree+1,2))
    return s.simplify(result)

out={'sympy_version':s.__version__,'scope':'Exact algebraic controls for Taylor coefficients; actual-theta positivity is certified separately','controls':{}}
for name,start in [('gaussian',s.S(1)),('negative_control',1+u**2/10+u**4/300)]:
    p=[start]
    for j in range(7):p.append(s.expand(s.diff(p[-1],u)-2*u*p[-1]))
    k=[z.subs(u,0) for z in p]
    I=[None]+[integrate_polynomial_gaussian(u*p[j]**2) for j in range(1,8)]
    @lru_cache(None)
    def U(a,b):
        if a>b:return U(b,a)
        if b==a+1:return -k[a]**2/2
        return -k[a]*k[b-1]-U(a+1,b-1)
    @lru_cache(None)
    def T(a,b):
        if a>b:return T(b,a)
        if a==b:return I[a]
        return -U(a,b-1)-T(a+1,b-1)
    J=s.zeros(4)
    for i,m in enumerate(odd):
        for j,n in enumerate(odd):
            direct=2*integrate_polynomial_gaussian(2*u*p[m]*p[n]+m*p[m-1]*p[n]+n*p[m]*p[n-1])/(math.factorial(m)*math.factorial(n))
            reduced=2*(2*T(m,n)+m*U(m-1,n)+n*U(m,n-1))/(math.factorial(m)*math.factorial(n))
            assert s.simplify(direct-reduced)==0
            J[i,j]=s.simplify(reduced)
    if name=='gaussian':assert J==s.zeros(4)
    else:
        assert J[:2,:2]==s.Matrix([[s.Rational(121,30000),-s.Rational(37,10000)],[-s.Rational(37,10000),s.Rational(61,18000)]])
        assert J[:2,:2].det()==-s.Rational(29,1350000000)
        assert J.rank()==2
    out['controls'][name]={'matrix':[[str(J[i,j]) for j in range(4)] for i in range(4)],'rank':J.rank(),'direct_and_reduced_entries_agree':True}
out['status']='PASS: all direct integral and reduced coefficients agree exactly; Gaussian zero and negative-control rank/sign match'
Path(__file__).with_suffix('.json').write_text(json.dumps(out,indent=2)+'\n')
print(out['status'])
