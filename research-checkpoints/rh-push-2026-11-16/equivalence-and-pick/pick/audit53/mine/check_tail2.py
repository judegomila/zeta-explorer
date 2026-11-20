import sympy as s
a,g,b,h,v,dd,dp=s.symbols('a gamma beta h v d dprime',positive=True)
N0=lambda d: d/a**2-4*g*(d+2)/a**4+16*b*(d+4)/a**6
# total derivative: N0 depends on a and d(a)
N0p=s.diff(N0(dd),a)+s.diff(N0(dd),dd)*dp
p=h+v
sub={dd:1+a*p, dp:p+v}
D0=(N0p*((a**2+4*g)*dp-2*a*dd)-(2*a*N0(dd)-dp)**2).subs(sub)
claim=(16*(b-g**2)*h**2/a**4+192*(b-g**2)*h/a**5+(64*g*b*h*(3*h+2*v)+320*b-576*g**2)/a**6
 +256*g*b*(s.Rational(17,2)*h+v)/a**7+(7680*g*b-1024*b**2*p**2)/a**8-10240*b**2*p/a**9-25600*b**2/a**10)
print('D0 expansion matches:', s.simplify(s.expand(D0-claim))==0)
# (22)-(23) at a=100
A=s.Integer(100);M=1500
br22=16*(s.Rational(568,10)-s.Rational(47,10)**2)-4096*57**2/A**4-40960*57**2/A**5-102400*57**2/A**6
br23=3200*M/A**2+78400*M**2/A**8
print('bracket22-bracket23 at 100 =',float(br22-br23))
G=s.Rational(47,10);B=57
print('N\' bracket at 100 =',float(-1+24*G/A**2+96*G/A**3+16*B/A**4+1040*M/A**6))
