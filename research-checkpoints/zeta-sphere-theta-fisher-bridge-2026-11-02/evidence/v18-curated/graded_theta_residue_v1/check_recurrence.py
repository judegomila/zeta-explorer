import sympy as s
z=s.symbols('z');p0=4*z*(2*z-3);P=p0;A=s.Integer(1);c=s.Integer(0)
for j in range(13):
 assert s.cancel(P/p0-A-c/(2*z-3))==0
 ell=sum(2*k*coef*s.rf(s.Rational(3,2),k) for (k,),coef in s.Poly(A,z).terms())
 assert s.simplify(c+ell)==0
 print('grade',j,'PASS; residue',c)
 P=s.expand(2*z*s.diff(P,z)+(s.Rational(1,2)-2*z)*P)
 An=s.cancel(2*z*s.diff(A,z)+(s.Rational(9,2)-2*z)*A+6*(A-A.subs(z,s.Rational(3,2)))/(2*z-3)-c)
 c=6*A.subs(z,s.Rational(3,2))-c/2
 A=s.expand(An)
print('Exact symbolic checks only; analytic all-grade proof in GRADED_RESIDUE.md.')
