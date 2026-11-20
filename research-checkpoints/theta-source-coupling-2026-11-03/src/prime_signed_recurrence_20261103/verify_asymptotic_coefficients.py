"""Exact symbolic coefficients for arbitrary degree, not finite positivity checks."""
import sympy as s
a,k,l,n=s.symbols('a k l n')
beta=a*a/4-s.Rational(49,16)
gamma=a**4/32-s.Rational(53,64)*a*a+s.Rational(873,512)
ell2=s.factor(gamma-beta*beta/2)
assert s.expand(ell2+a*a/16+s.Rational(191,64))==0
beta_k=beta-k*(k+7)/4
ell2_k=ell2+s.summation((beta-l*(l+7)/4)/2-(4+l)**2/8,(l,0,k-1))
assert s.simplify((s.diff(ell2_k,a)/a).subs(k,2*n)-(4*n-1)/8)==0
assert s.simplify(beta_k.subs(k,2*n)-(a*a/4-s.Rational(49,16)-n*(2*n+7)/2))==0
print('PASS: exact first amplitude correction and second logarithmic derivative coefficient for arbitrary n.')
print('Analytic remainder and domain proof are separate and recorded in the note.')
