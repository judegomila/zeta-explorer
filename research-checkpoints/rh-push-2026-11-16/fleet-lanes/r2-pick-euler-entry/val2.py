# independent check of levels 1 and 2 (zeta, a=1) by direct mpmath quadrature of the reduction integrals
import mpmath as mp
mp.mp.dps=25
a=mp.mpf(1)
def kap(t):
    x=mp.e**abs(t); return x**0.25*sum((2*(mp.pi*n*n*x)**2-3*mp.pi*n*n*x)*mp.exp(-mp.pi*n*n*x) for n in range(1,8))
def C(t): return mp.quad(lambda s:s*kap(s),[abs(t),abs(t)+1,abs(t)+3,8])/4
Lf=lambda f,z: 2*mp.quad(lambda t:f(t)*mp.cosh(z*t/2),[0,0.5,1,2,4,8])
# tabulate C on Chebyshev grid for speed
import functools
Cc=mp.chebyfit(C,[0,8],60) if False else None
r0=a*Lf(C,a)/Lf(kap,a)
xi=lambda s: mp.mpf(0.5)*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
print("r0",r0, "L(a) from xi:", mp.diff(xi,mp.mpf(1.5))/xi(mp.mpf(1.5)))
S0=lambda s: r0*kap(s)-a*C(s)
def b1(t): return mp.quad(lambda s: mp.sinh(a*(s-t)/2)*S0(s),[t,t+0.5,t+1.5,t+3,8])/(2*a)
for t in [0.1,1.0]:
    b=b1(mp.mpf(t)); n=C(t)-a*b
    print("t",t,"u1=b",mp.nstr(b,10),"v1=n",mp.nstr(n,10))
